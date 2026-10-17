// megab01 · marca Megabuild (arena + verde, Oswald/Inter)
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
const { fontFamily: OSW } = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: INT } = loadInter("normal", { weights: ["500", "700"], subsets: ["latin"] });
export const C = { ink: "#0d0f0b", sand: "#e9c37b", green: "#4fd27a", deep: "#1f6b3c", white: "#f7f4ec", red: "#ff5a3c" };
export const FONTS = { OSW, INT };
