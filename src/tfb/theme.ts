// The Free Builder — sistema visual del canal (miniaturas: blanco / AMARILLO de círculo de zoom / ROJO de flecha,
// sobre footage real). Fuente de verdad de colores, fuentes y curvas de TODOS los componentes Tfb*. Nada suelto.
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { Easing } from "remotion";

const { fontFamily: ANTON } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: BARLOW } = loadBarlow("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
const { fontFamily: MARKER } = loadMarker("normal", { weights: ["400"], subsets: ["latin"] });

/** Titulares y números grandes. */
export const F_DISPLAY = `${ANTON}, Impact, sans-serif`;
/** Etiquetas, rótulos, pasos. */
export const F_SANS = `${BARLOW}, 'Arial Narrow', sans-serif`;
/** Anotación "a mano" sobre el footage. */
export const F_HAND = `${MARKER}, 'Segoe Script', cursive`;

export const TFB = {
  yellow: "#FFD21F",   // anillo del círculo de zoom (miniaturas)
  yellowDeep: "#F2B705",
  red: "#E3261C",      // flecha roja (miniaturas)
  redDeep: "#B3160F",
  white: "#FFFFFF",
  ink: "#101114",      // texto oscuro / cajas
  crust: "#B8862F",    // sarro amarillo-marrón
  crustDark: "#6E4A1C",
  crustLight: "#E0B45A",
  water: "#4FB3E8",
  waterDeep: "#1F6FA8",
  porcelain: "#F4F2EE",
  porcelainShade: "#D9D5CD",
  ok: "#39D98A",       // libre / limpio
  shadow: "0 10px 28px rgba(0,0,0,0.45)",
  textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.45)",
};

/** Curvas únicas del canal: entrada con rebote corto, salida limpia. */
export const EASE_IN = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_OUT = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
