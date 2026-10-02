// Loretta's Church Kitchen — marca del canal (reusable por todos los videos del canal).
// Papel crema de recetario, rojo gingham, amarillo manteca, verde del ribete del delantal, tinta marrón.
// Serif editorial (Fraunces) + manuscrita de tarjeta de receta (Caveat). Luz clara, nada de cine oscuro.
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const fr = loadFraunces("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin"] });
const cv = loadCaveat("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const SERIF = fr.fontFamily;
export const HAND = cv.fontFamily;

export const LOR = {
  paper: "#F6EEDC",      // crema de recetario
  paper2: "#EFE3C8",
  paperEdge: "#E2D1AC",
  ink: "#3B2A1E",        // tinta marrón
  inkSoft: "#6B5443",
  gingham: "#C8323A",    // rojo gingham
  ginghamSoft: "#E9A2A4",
  butter: "#F2C94C",     // amarillo manteca
  butterSoft: "#FBE7A6",
  green: "#6E9A5B",      // ribete del delantal
  greenDeep: "#4C7440",
  lilac: "#B7A2D6",      // el cárdigan de Loretta
  crust: "#D99A4E",
  crustDark: "#A8652A",
  white: "#FFFDF7",
  shadow: "rgba(59,42,30,0.28)",
};

// Fondo gingham (mantel) en CSS puro
export const gingham = (c = LOR.gingham, size = 44, op = 0.55) => ({
  backgroundColor: LOR.white,
  backgroundImage: `linear-gradient(90deg, ${hexA(c, op)} 50%, transparent 50%), linear-gradient(${hexA(c, op)} 50%, transparent 50%)`,
  backgroundSize: `${size}px ${size}px`,
});

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Textura de papel (ruido suave + manchas) sin imágenes externas
export const paperBg = (base = LOR.paper) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.55), transparent 55%)," +
    "radial-gradient(ellipse at 85% 90%, rgba(168,101,42,0.10), transparent 50%)," +
    "radial-gradient(circle at 70% 30%, rgba(168,101,42,0.06), transparent 30%)",
});

// PRNG determinista (hash entero) — el farm rinde en chunks: nunca Math.random
export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Para dibujar en <canvas> con estas fuentes hay que esperar a que carguen (delayRender en el componente)
export const fontsReady = (): Promise<unknown> => Promise.all([fr.waitUntilDone(), cv.waitUntilDone()]);
