/* Random Top Wheelers Visual Display - Updates every 24 hours
 * This is a visual leaderboard that randomly selects:
 * - Player names from a predefined list
 * - Player profile images from /public/players/
 * - Fixed prize amounts: $100, $75, $50 for positions 1, 2, 3
 * Data refreshes automatically every 24 hours for variety
 */

export type Wheeler = { name: string; img: string; wins: number };

export const REFRESH_MS = 24 * 60 * 60 * 1000; // 24 hours
const IMG_COUNT = 12; // how many /public/players/playerN.jpg images you have

export const NAMES: string[] = [
  // Classic American Names
  "Mary Johnson", "Sylvia Miller", "Phillip Calderon", "James Carter", "Sophia Roberts",
  "Liam Thompson", "Isabella Martinez", "Noah Anderson", "Emma White", "Mason Lewis",
  "Ava Hall", "Lucas Allen", "Mia Young", "Ethan Hernandez", "Charlotte King",
  "Benjamin Wright", "Amelia Scott", "Elijah Green", "Harper Adams", "Oliver Nelson",
  "Ella Baker", "Henry Rivera", "Grace Perez", "Alexander Campbell", "Chloe Mitchell",
  "Daniel Moore", "Abigail Stewart", "Matthew Flores", "Scarlett Torres", "Jack Morgan",
  
  // Additional Diverse Names
  "Zoe Parker", "Ryan Cooper", "Maya Patel", "Tyler Brooks", "Aria Davis",
  "Jordan Wilson", "Layla Garcia", "Connor Murphy", "Nora Rodriguez", "Austin Lee",
  "Hazel Collins", "Blake Edwards", "Luna Gonzalez", "Caleb Turner", "Violet Phillips",
  "Ian Stewart", "Penelope Cox", "Xavier Reed", "Aurora Bailey", "Jaxon Kelly",
  "Stella Howard", "Brayden Ward", "Ivy Torres", "Grayson Peterson", "Willow Gray",
  "Easton Ramirez", "Nova James", "Hudson Watson", "Paisley Brooks", "Maverick Powell",
  "Emilia Jenkins", "Ryder Perry", "Kinsley Russell", "Asher Griffin", "Delilah Diaz",
  "Kai Henderson", "Aaliyah Butler", "Felix Coleman", "Savannah Foster", "Theo Gonzales",
  "Cora Hughes", "Silas Flores", "Lydia Sanders", "Jasper Price", "Clara Bennett",
  "Axel Wood", "Ellie Barnes", "Miles Ross", "Natalie Henderson", "Ezra Martinez"
];

function buildImageList(count = IMG_COUNT): string[] {
  // Check actual file names in /public/players/ folder
  const imageFiles = [
    '/players/player1_circle_1024.png',
    '/players/player2_circle_1024.png', 
    '/players/player3_circle_512.png',
    '/players/player4_circle_512.png',
    '/players/player5_circle_512.png',
    '/players/player6_circle_512.png',
    '/players/player7_circle_512.png',
    '/players/player8_circle_512.png',
    '/players/player9_circle_512.png',
    '/players/player10_circle_512.png',
    '/players/player11_circle_512.png',
    '/players/player12_circle_512.png'
  ];
  return imageFiles.slice(0, count);
}

function pickUnique<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// Fixed prize amounts for top 3 positions
const FIXED_PRIZES = [100.00, 75.00, 50.00]; // 1st: $100, 2nd: $75, 3rd: $50

export function randomTopWheelers(): Wheeler[] {
  const images = buildImageList();
  const chosenNames = pickUnique(NAMES, 3);
  const chosenImgs = pickUnique(images, 3);
  
  return [0, 1, 2].map(i => ({
    name: chosenNames[i],
    img: chosenImgs[i],
    wins: FIXED_PRIZES[i] // Fixed amounts: $100, $75, $50
  }));
}

const LS_KEY_DATA = "topWheelers:data";
const LS_KEY_TS = "topWheelers:ts";
const LS_KEY_VERSION = "topWheelers:version";
const CURRENT_VERSION = "2.0"; // Increment this when data structure changes

export function getDailyWheelers(now = Date.now()): Wheeler[] {
  if (typeof window === "undefined") return randomTopWheelers();
  try {
    const tsStr = localStorage.getItem(LS_KEY_TS);
    const dataStr = localStorage.getItem(LS_KEY_DATA);
    const versionStr = localStorage.getItem(LS_KEY_VERSION);
    
    // Check if we have valid cached data and correct version
    if (tsStr && dataStr && versionStr === CURRENT_VERSION) {
      const ts = Number(tsStr);
      if (!Number.isNaN(ts) && now - ts < REFRESH_MS) {
        return JSON.parse(dataStr) as Wheeler[];
      }
    }
  } catch {}
  
  // Generate fresh data
  const fresh = randomTopWheelers();
  try {
    localStorage.setItem(LS_KEY_DATA, JSON.stringify(fresh));
    localStorage.setItem(LS_KEY_TS, String(now));
    localStorage.setItem(LS_KEY_VERSION, CURRENT_VERSION);
  } catch {}
  return fresh;
}

export function forceRefreshDailyWheelers(): Wheeler[] {
  const fresh = randomTopWheelers();
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY_DATA, JSON.stringify(fresh));
    localStorage.setItem(LS_KEY_TS, String(Date.now()));
    localStorage.setItem(LS_KEY_VERSION, CURRENT_VERSION);
  }
  return fresh;
}
