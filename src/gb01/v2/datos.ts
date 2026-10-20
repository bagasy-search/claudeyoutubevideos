// gb01 v2 · datos del video entero: palabras (Groq sobre gb01cut.wav) y ventanas pagadas del avatar (reel0 = ventanas en fila).
import { FPS, makeTiempo } from "../../kits/neon/base";
import WORDS from "../words_full.json";
import AVWIN from "../avwin_full.json";

export const tiempo = makeTiempo(WORDS);
export const T = tiempo.at, TE = tiempo.atEnd;
export type Ventana = { t0: number; t1: number; r0: number };
export const WINS = AVWIN as Ventana[];
export const FIN = TE("watch the wave", 900) + 1.6;
export const FRAMES = Math.ceil(FIN * FPS);
export const P = "gb01/";
