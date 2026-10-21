// gb01es · datos del video entero en español: tiempos = anclas EN pasadas por el mapa EN→ES (../tiempo_es) y ventanas del avatar ES (reel0 = ventanas en fila).
import { FPS } from "../../kits/neon/base";
import { tiempo, W } from "../tiempo_es";
import AVWIN from "../avwin_full.json";

export { tiempo, W };
export const T = tiempo.at, TE = tiempo.atEnd;
export type Ventana = { t0: number; t1: number; r0: number };
export const WINS = AVWIN as Ventana[];
export const FIN = TE("watch the wave", 900) + 1.6;
export const FRAMES = Math.ceil(FIN * FPS);
export const P = "gb01/";
