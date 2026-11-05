// sg29kit · la base común de la tanda sg29 (5 videos de Sachiko's Garden). Matemática, paleta, fuentes y el anclaje a la PALABRA.
// Cada video arma su `at("frase")` con mkAt(words.json): cero desfase con la voz final.
import { loadFont as loadMincho } from "@remotion/google-fonts/ShipporiMincho";
import { loadFont as loadBrush } from "@remotion/google-fonts/CaveatBrush";

export const { fontFamily: FONT } = loadMincho("normal", { weights: ["600", "800"], subsets: ["latin"] });
export const { fontFamily: BRUSH } = loadBrush("normal", { weights: ["400"], subsets: ["latin"] });
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const easeIO = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const ei = (t: number, a: number, b: number) => easeIO((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// resorte con peso: sube con sobrepico y se asienta
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
/** visibilidad de una pieza: entra en a (fundido corto), sale en out */
export const vis = (t: number, a: number, out: number, fin = 0.18, fout = 0.3) => e(t, a, a + fin) * (1 - e(t, out, out + fout));

// paleta: washi, sumi, bermellón del sello, índigo, oro viejo, hoja
export const COL = { paper: "#f3ead8", paper2: "#e7dcc4", ink: "#1b1712", red: "#c8321e", indigo: "#2b3f63", gold: "#d9a441", cream: "#fbf6ea", leaf: "#4f7f34", soil: "#3a2a1e", wood: "#9a7650", dim: "rgba(251,246,234,.78)" };
export const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.55)`;

// ---------- at("frase") ----------
export type Wd = { text: string; startMs: number; endMs: number };
export const mkAt = (WORDS: Wd[]) => {
  const norm = (x: string) => x.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9']/g, "");
  const TOK = WORDS.map((w) => ({ k: norm(w.text), a: w.startMs / 1000, b: w.endMs / 1000 }));
  const find = (phrase: string, after: number) => {
    const p = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < TOK.length - p.length + 1; i++) {
      if (TOK[i].a < after - 0.001) continue;
      let ok = true;
      for (let j = 0; j < p.length; j++) if (TOK[i + j].k !== p[j]) { ok = false; break; }
      if (ok) return i;
    }
    throw new Error(`at(): no está "${phrase}" después de ${after}`);
  };
  const at = (phrase: string, after = 0) => TOK[find(phrase, after)].a;
  const atEnd = (phrase: string, after = 0) => { const n = phrase.trim().split(/\s+/).length; return TOK[find(phrase, after) + n - 1].b; };
  const wordsIn = (a: number, b: number) => WORDS.filter((w) => w.startMs / 1000 >= a - 0.01 && w.startMs / 1000 < b).map((w) => ({ text: w.text.trim(), a: w.startMs / 1000, b: w.endMs / 1000 }));
  const END = WORDS.length ? WORDS[WORDS.length - 1].endMs / 1000 : 60;
  return { at, atEnd, wordsIn, END };
};
