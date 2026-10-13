// Sachiko's Kitchen · fuentes del canal (las mismas que sachiko1: Fraunces títulos, Oswald rótulos, Caveat notas a mano).
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
const fr = loadFraunces("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin", "latin-ext"] });
const os = loadOswald("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });
const cv = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });
export const SERIF = fr.fontFamily;
export const LABEL = os.fontFamily;
export const HAND = cv.fontFamily;
