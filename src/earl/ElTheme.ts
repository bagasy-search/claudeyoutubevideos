// Dockside Earl — marca del canal (reusable por todos los videos del canal).
// "Galpón del muelle": tapa blanca de conservadora escrita con marcador, navy marino, soga, naranja boya, rótulo de
// esténcil como el nombre pintado en la popa del barco. Esténcil (Allerta Stencil) + marcador (Permanent Marker) +
// rótulo condensado (Oswald) + slab de lectura (Bitter). Claro y legible. Textos SIEMPRE por props.
import { loadFont as loadStencil } from "@remotion/google-fonts/AllertaStencil";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBitter } from "@remotion/google-fonts/Bitter";

const st = loadStencil("normal", { weights: ["400"], subsets: ["latin"] });
const mk = loadMarker("normal", { weights: ["400"], subsets: ["latin"] });
const os = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });
const bi = loadBitter("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const STENCIL = st.fontFamily;
export const MARKER = mk.fontFamily;
export const LABEL = os.fontFamily;
export const BODY = bi.fontFamily;

export const EL = {
  navy: "#1E3A5F",
  navyDeep: "#132842",
  sea: "#2F6F8F",
  cooler: "#F4F6F4",
  cooler2: "#E3E8E6",
  ice: "#DCEEF4",
  rope: "#C8A46A",
  buoy: "#E8642C",
  red: "#C8302C",
  green: "#2E7D4F",
  ink: "#1B1F24",
  inkSoft: "#4C5560",
  marker: "#1C2B4A",
  shrimp: "#F19A72",
  white: "#FFFFFF",
  shadow: "rgba(19,40,66,0.35)",
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// plástico blanco de tapa de conservadora (rayado fino + brillo)
export const coolerBg = (base = EL.cooler) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.9), transparent 55%)," +
    "repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0 2px, transparent 2px 6px)," +
    "radial-gradient(ellipse at 85% 95%, rgba(30,58,95,0.10), transparent 50%)",
});
// tablas de madera del muelle, gastadas
export const dockBg = () => ({
  backgroundColor: "#8C7458",
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 3px, transparent 3px 160px)," +
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 11px)," +
    "linear-gradient(#97806250, #6e5a4450)",
});

export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const fontsReady = (): Promise<unknown> => Promise.all([st.waitUntilDone(), mk.waitUntilDone(), os.waitUntilDone(), bi.waitUntilDone()]);
