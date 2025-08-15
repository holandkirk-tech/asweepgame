/* Random Top Wheelers data + 24h localStorage caching */

export type Wheeler = { name: string; img: string; wins: number };

export const REFRESH_MS = 24 * 60 * 60 * 1000; // 24 hours
const IMG_COUNT = 12; // how many /public/players/playerN.jpg images you have

export const NAMES: string[] = [
  "Mary Johnson","Sylvia Miller","Phillip Calderon","James Carter","Sophia Roberts",
  "Liam Thompson","Isabella Martinez","Noah Anderson","Emma White","Mason Lewis",
  "Ava Hall","Lucas Allen","Mia Young","Ethan Hernandez","Charlotte King",
  "Benjamin Wright","Amelia Scott","Elijah Green","Harper Adams","Oliver Nelson",
  "Ella Baker","Henry Rivera","Grace Perez","Alexander Campbell","Chloe Mitchell",
  "Daniel Moore","Abigail Stewart","Matthew Flores","Scarlett Torres","Jack Morgan"
];

function buildImageList(count = IMG_COUNT): string[] {
  return Array.from({ length: count }, (_, i) => `/players/player${i + 1}.jpg`);
}

function pickUnique<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function randomTopWheelers(): Wheeler[] {
  const images = buildImageList();
  const chosenNames = pickUnique(NAMES, 3);
  const chosenImgs = pickUnique(images, 3);
  return [0, 1, 2].map(i => ({
    name: chosenNames[i],
    img: chosenImgs[i],
    wins: parseFloat((Math.random() * (100 - 50) + 50).toFixed(2)) // $50–$100
  }));
}

const LS_KEY_DATA = "topWheelers:data";
const LS_KEY_TS = "topWheelers:ts";

export function getDailyWheelers(now = Date.now()): Wheeler[] {
  if (typeof window === "undefined") return randomTopWheelers();
  try {
    const tsStr = localStorage.getItem(LS_KEY_TS);
    const dataStr = localStorage.getItem(LS_KEY_DATA);
    if (tsStr && dataStr) {
      const ts = Number(tsStr);
      if (!Number.isNaN(ts) && now - ts < REFRESH_MS) {
        return JSON.parse(dataStr) as Wheeler[];
      }
    }
  } catch {}
  const fresh = randomTopWheelers();
  try {
    localStorage.setItem(LS_KEY_DATA, JSON.stringify(fresh));
    localStorage.setItem(LS_KEY_TS, String(now));
  } catch {}
  return fresh;
}

export function forceRefreshDailyWheelers(): Wheeler[] {
  const fresh = randomTopWheelers();
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY_DATA, JSON.stringify(fresh));
    localStorage.setItem(LS_KEY_TS, String(Date.now()));
  }
  return fresh;
}
