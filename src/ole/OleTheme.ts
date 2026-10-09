// Ole's Camp Kitchen — marca del canal (reusable por todos los videos del canal).
// Alineada con la portada del libro «Ole's Logging Camp Cookbook» y su maqueta (ole-guide/src/style.css):
// verde bosque, kraft, papel de libreta, naranja de fuego, hierro, rojo de camisa leñadora.
// Fraunces (display) + Source Sans 3 (texto) + Oswald espaciado (rótulos) + Kalam (libreta del cocinero, a lápiz).
// Luz clara: tarjetas de PAPEL sobre el metraje vivo; nada de placas negras a pantalla completa.
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSource } from "@remotion/google-fonts/SourceSans3";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";

const fr = loadFraunces("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin"] });
const frI = loadFraunces("italic", { weights: ["400", "600"], subsets: ["latin"] });
const ss = loadSource("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const os = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const ka = loadKalam("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const SERIF = fr.fontFamily;   // títulos (como la portada)
export const SANS = ss.fontFamily;    // texto corrido
export const LABEL = os.fontFamily;   // rótulos en mayúscula espaciada ("OLE'S CAMP KITCHEN")
export const HAND = ka.fontFamily;    // libreta del cocinero, a lápiz

export const OLE = {
  forest: "#1D3527",
  forest2: "#14261C",
  kraft: "#C9A66B",
  kraftL: "#E9D9B8",
  paper: "#F7F0E0",
  cream: "#FBF6EA",
  fire: "#D9772B",
  ember: "#F0B267",
  iron: "#1B1A18",
  ironL: "#3A3733",
  plaid: "#8E2B2B",
  mute: "#6B6455",
  line: "#D8CBAA",
  pencil: "#4A4536",
  enamel: "#2F5D8A",      // lata esmaltada azul (la taza de Ole)
  enamelFleck: "#E9EEF3",
  bean: "#8A4B2A",
  beanL: "#B87A4E",
  snow: "#EEF2F4",
  shadow: "rgba(20,38,28,0.30)",
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Papel de libreta de cocinero (renglones + margen rojo + manchas de grasa), CSS puro
export const notebookBg = (base = OLE.paper, rule = 46) => ({
  backgroundColor: base,
  backgroundImage:
    `linear-gradient(90deg, transparent 88px, ${hexA(OLE.plaid, 0.35)} 88px, ${hexA(OLE.plaid, 0.35)} 91px, transparent 91px),` +
    `repeating-linear-gradient(0deg, transparent 0 ${rule - 2}px, ${hexA("#7A93A8", 0.28)} ${rule - 2}px ${rule}px),` +
    "radial-gradient(ellipse at 78% 22%, rgba(201,166,107,0.22), transparent 18%)," +
    "radial-gradient(ellipse at 18% 84%, rgba(142,43,43,0.06), transparent 22%)",
});

// Papel kraft liso con veta suave
export const kraftBg = (base = OLE.kraftL) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.45), transparent 55%)," +
    "radial-gradient(ellipse at 85% 90%, rgba(120,80,30,0.14), transparent 50%)," +
    "repeating-linear-gradient(92deg, rgba(120,80,30,0.035) 0 3px, transparent 3px 9px)",
});

// Tabla de pino (fondo de madera) en CSS puro
export const woodBg = (base = "#B98C5A") => ({
  backgroundColor: base,
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(60,35,15,0.10) 0 2px, transparent 2px 7px)," +
    "repeating-linear-gradient(0deg, transparent 0 138px, rgba(40,22,10,0.45) 138px 141px)," +
    "radial-gradient(ellipse at 30% 40%, rgba(255,220,170,0.18), transparent 60%)",
});

// PRNG determinista (hash entero) — el farm rinde en chunks: nunca Math.random
export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Para dibujar en <canvas> con estas fuentes hay que esperar a que carguen (delayRender en el componente)
export const fontsReady = (): Promise<unknown> =>
  Promise.all([fr.waitUntilDone(), frI.waitUntilDone(), ss.waitUntilDone(), os.waitUntilDone(), ka.waitUntilDone()]);
export const SERIF_ITALIC = frI.fontFamily;
