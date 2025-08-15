import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

// ---------- CONFIG & GLOBALS ----------
const {
  DATABASE_URL,
  ADMIN_USERNAME = 'admin',
  ADMIN_PASSWORD = 'changeme',
  SESSION_SECRET = 'please-change-session-secret',
  IP_SALT = 'please-change-ip-salt',
  NODE_ENV,
} = process.env;

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in environment.');
}

const sql = DATABASE_URL ? neon(DATABASE_URL) : (async () => { throw new Error('DATABASE_URL not set'); }) as unknown as ReturnType<typeof neon>;
let schemaReady = false;

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Prize distribution (in cents)
const PRIZES = [0, 500, 1000, 2500, 5000, 10000];
const WEIGHTS = [40, 30, 15, 10, 4, 1]; // sum = 100

// ---------- UTILS ----------
function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function hashHex(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}
function signToken(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = b64url(Buffer.from(JSON.stringify(header)));
  const encPayload = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = crypto.createHmac('sha256', SESSION_SECRET!).update(`${encHeader}.${encPayload}`).digest();
  return `${encHeader}.${encPayload}.${b64url(sig)}`;
}
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
function verifyToken(token?: string): { ok: boolean; payload?: Record<string, unknown> } {
  if (!token) return { ok: false };
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false };
  const [h, p, s] = parts;
  const expected = b64url(crypto.createHmac('sha256', SESSION_SECRET!).update(`${h}.${p}`).digest());
  if (!safeEqual(s, expected)) return { ok: false };
  try {
    const payload = JSON.parse(Buffer.from(p, 'base64').toString('utf8'));
    if (!payload || typeof payload.exp !== 'number' || payload.sub !== 'admin') return { ok: false };
    if (payload.exp * 1000 < Date.now()) return { ok: false };
    return { ok: true, payload };
  } catch { return { ok: false }; }
}
function setCookie(res: VercelResponse, name: string, value: string, maxAgeSec: number) {
  const isProd = !!(process.env.VERCEL || NODE_ENV === 'production');
  const attrs = [
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    `Max-Age=${maxAgeSec}`,
    isProd ? `Secure` : ``,
  ].filter(Boolean).join('; ');
  res.setHeader('Set-Cookie', `${name}=${value}; ${attrs}`);
}
function clearCookie(res: VercelResponse, name: string) {
  res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
}
function getClientIp(req: VercelRequest): string {
  const xf = (req.headers['x-forwarded-for'] || '') as string;
  const first = xf.split(',')[0].trim();
  return first || (req.socket?.remoteAddress || '0.0.0.0');
}
function pickPrize(prizes: number[], weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.floor(Math.random() * total);
  for (let i = 0; i < prizes.length; i++) {
    r -= weights[i];
    if (r < 0) return prizes[i];
  }
  return prizes[0];
}
async function parseBody<T = Record<string, unknown>>(req: VercelRequest): Promise<T> {
  if (req.body && typeof req.body === 'object') return req.body as T;
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve) => {
    req.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve());
  });
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw);
}

// ---------- DB SCHEMA ----------
async function ensureSchema() {
  if (schemaReady) return;
  await sql`CREATE TABLE IF NOT EXISTS codes(
    code_hash TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    max_uses INT NOT NULL,
    uses INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );`;
  await sql`CREATE TABLE IF NOT EXISTS spins(
    id TEXT PRIMARY KEY,
    code_hash TEXT NOT NULL REFERENCES codes(code_hash),
    prize_cents INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_hash TEXT
  );`;
  await sql`CREATE TABLE IF NOT EXISTS attempts(
    id TEXT PRIMARY KEY,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );`;
  schemaReady = true;
}

// ---------- AUTH HELPERS ----------
function requireAdmin(req: VercelRequest): boolean {
  const cookies = (req.headers.cookie || '').split(';').map(s => s.trim());
  const entry = cookies.find(c => c.startsWith(COOKIE_NAME + '='));
  const token = entry?.split('=')[1];
  return verifyToken(token).ok;
}

// ---------- HANDLERS ----------
async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { username, password } = await parseBody<{ username: string; password: string }>(req);
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const payload = { sub: 'admin', exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE };
  const token = signToken(payload);
  setCookie(res, COOKIE_NAME, token, COOKIE_MAX_AGE);
  res.status(200).json({ ok: true });
}

async function handleLogout(_req: VercelRequest, res: VercelResponse) {
  clearCookie(res, COOKIE_NAME);
  res.status(200).json({ ok: true });
}

async function handleCreateCode(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const body = await parseBody<{ ttlSeconds?: number }>(req);
  const ttlSeconds = typeof body.ttlSeconds === 'number' ? Math.max(60, Math.min(86400, body.ttlSeconds)) : 600;

  const code = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  const codeHash = hashHex(code);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await sql`INSERT INTO codes (code_hash, expires_at, max_uses, uses)
            VALUES (${codeHash}, ${expiresAt.toISOString()}, 1, 0)
            ON CONFLICT (code_hash) DO UPDATE
            SET expires_at = EXCLUDED.expires_at, max_uses = 1, uses = 0;`;

  res.status(200).json({ code, expiresAt: expiresAt.toISOString() });
}

async function handleSpin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { code } = await parseBody<{ code: string }>(req);
  if (!/^\d{5}$/.test(code || '')) return res.status(400).json({ error: 'Invalid code format' });

  const ip = getClientIp(req);
  const ipHash = hashHex(ip + IP_SALT);

  // rate limit: max 5 attempts per hour
  const cntRows = await sql`SELECT COUNT(*)::int AS c FROM attempts
                                   WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 hour'`;
  const tries = Number((cntRows as any)?.[0]?.c ?? 0);
  if (tries >= 5) return res.status(429).json({ error: 'Too many attempts. Try later.' });

  // record attempt (both success and failure consume an attempt slot)
  await sql`INSERT INTO attempts (id, ip_hash) VALUES (${crypto.randomUUID()}, ${ipHash})`;

  const codeHash = hashHex(code);

  // atomically consume a single-use code if valid & not expired
  const updated = await sql`
    UPDATE codes
    SET uses = uses + 1
    WHERE code_hash = ${codeHash}
      AND uses < max_uses
      AND now() < expires_at
    RETURNING code_hash, uses, max_uses
  `;
  if (!(updated as any).length || (updated as any).length === 0) {
    return res.status(400).json({ error: 'Code invalid, used, or expired' });
  }

  const prizeCents = pickPrize(PRIZES, WEIGHTS);
  await sql`INSERT INTO spins (id, code_hash, prize_cents, ip_hash)
            VALUES (${crypto.randomUUID()}, ${codeHash}, ${prizeCents}, ${ipHash})`;

  res.status(200).json({ prizeCents });
}

async function handleWins(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  // Optional range (ISO). If none, default last 30 days.
  const { from, to } = (req.query || {}) as { from?: string; to?: string };
  const rangeWhere = from && to
    ? sql`created_at >= ${from}::timestamptz AND created_at < ${to}::timestamptz`
    : sql`created_at >= now() - interval '30 days'`;

  const sumRows = await sql`SELECT COALESCE(SUM(prize_cents),0)::int AS total, COUNT(*)::int AS count
                                   FROM spins WHERE ${rangeWhere}`;
  const items = await sql`SELECT id, prize_cents, created_at
                                 FROM spins WHERE ${rangeWhere}
                                 ORDER BY created_at DESC LIMIT 200`;

  res.status(200).json({
    totalCents: Number((sumRows as any)?.[0]?.total ?? 0),
    count: Number((sumRows as any)?.[0]?.count ?? 0),
    items: (items as any[]).map(r => ({ id: r.id, prizeCents: Number(r.prize_cents), createdAt: r.created_at })),
  });
}

// ---------- ROUTER ----------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    const op = String((req.query?.op || '')).toLowerCase();
    if (op === 'login') return handleLogin(req, res);
    if (op === 'logout') return handleLogout(req, res);
    if (op === 'create_code') return handleCreateCode(req, res);
    if (op === 'spin') return handleSpin(req, res);
    if (op === 'wins') return handleWins(req, res);
    return res.status(404).json({ error: 'Unknown op' });
  } catch (e: unknown) {
    console.error(e);
    res.status(500).json({ error: (e as Error)?.message || 'Server error' });
  }
}

// ---------- QUICK TEST (examples)
// curl -X POST 'http://localhost:3000/api/backend?op=login' -H 'Content-Type: application/json' -d '{"username":"admin","password":"changeme"}' -i
// curl -X POST 'http://localhost:3000/api/backend?op=create_code' --cookie "admin_session=PASTE" -H 'Content-Type: application/json' -d '{}'
// curl -X POST 'http://localhost:3000/api/backend?op=spin' -H 'Content-Type: application/json' -d '{"code":"12345"}'
// curl 'http://localhost:3000/api/backend?op=wins' --cookie "admin_session=PASTE"