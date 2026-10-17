import { staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
const { fontFamily } = loadFont("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
export const FONT = fontFamily;
export const FPS = 30;
export const ACC = "#ffd34d";
export const RED = "#ff4a3d";
export const sf = (p: string) => staticFile("emptymap01/" + p);
