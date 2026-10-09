// Ole's Camp Kitchen — marca del canal para el kit del video `olsup` (copiada de la idea de OleTheme, NO importada de src/ole/).
// Madera de cabaña, lata esmaltada, hierro fundido, libreta de cocinero y luz de farol. Cálido, oscuro pero legible.
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadBree } from "@remotion/google-fonts/BreeSerif";

const slab = loadSlab("normal", { weights: ["400"], subsets: ["latin"] });
const cv = loadCaveat("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const br = loadBree("normal", { weights: ["400"], subsets: ["latin"] });

export const SLAB = slab.fontFamily;   // títulos tipo cartel maderero
export const HAND = cv.fontFamily;     // letra de libreta de cocinero
export const SERIF = br.fontFamily;    // texto corrido

export const OLE = {
  wood0: "#1E140D",     // madera casi negra (fondos)
  wood1: "#3A2517",
  wood2: "#5C3B22",
  wood3: "#8A5B33",     // tablón claro
  plank: "#A8743F",
  lantern: "#F3A93C",   // luz de farol
  lanternSoft: "#FFD58A",
  ember: "#E8702A",
  enamel: "#2B4C8C",    // taza esmaltada azul de Ole
  enamelWhite: "#EFEBDD",
  iron: "#22201E",
  ironLight: "#4B4743",
  paper: "#E9DCBB",     // libreta vieja
  paperLight: "#F4EBD1",
  paperEdge: "#CDB98A",
  ink: "#2A2018",
  inkSoft: "#5B4A3A",
  plaid: "#A5322B",     // franela roja
  forest: "#2F4A36",    // franela verde de Ole
  snow: "#DCE6EE",
  cream: "#FFF6E0",
  shadow: "rgba(15,8,3,0.45)",
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Tablones de madera en CSS puro (vetas + juntas), sin imágenes
export const woodBg = (base = OLE.wood2, seed = 3) => ({
  backgroundColor: base,
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.30) 0px, rgba(0,0,0,0.30) 3px, transparent 3px, transparent 170px)," +
    "repeating-linear-gradient(0deg, rgba(255,220,160,0.05) 0px, rgba(255,220,160,0.05) 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 5px)," +
    `radial-gradient(ellipse at ${20 + seed * 9}% 30%, rgba(255,190,110,0.16), transparent 60%),` +
    "radial-gradient(ellipse at 50% 120%, rgba(0,0,0,0.5), transparent 60%)",
});

// Papel de libreta (manchas de uso)
export const paperBg = (base = OLE.paper) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 18% 12%, rgba(255,255,255,0.5), transparent 55%)," +
    "radial-gradient(ellipse at 88% 92%, rgba(120,80,30,0.16), transparent 50%)," +
    "radial-gradient(circle at 72% 28%, rgba(120,80,30,0.07), transparent 30%)," +
    "repeating-linear-gradient(0deg, transparent 0px, transparent 39px, rgba(90,110,150,0.22) 39px, rgba(90,110,150,0.22) 41px)",
});

// PRNG determinista (hash entero) — el farm rinde en chunks: nunca Math.random
export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// viñeta + resplandor de farol reutilizable como fondo de tarjeta
export const lanternGlow = "radial-gradient(ellipse at 50% 42%, rgba(255,190,90,0.30) 0%, rgba(255,150,50,0.10) 40%, transparent 70%)";
