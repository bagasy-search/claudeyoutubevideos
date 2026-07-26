// wb_v8v252t741it.ts — ESCENA DE PIZARRA (FedWhiteboard, estilo Vox) para el beat del
// "por qué funciona": la cascada de la remolacha → óxido nítrico → la arteria se relaja.
// Ventana anclada al ms de Whisper: arranca en "¿y qué es el óxido nítrico?" (1197.66s) y
// termina en "ahora, honestidad" (1235.5s). El avatar del PiP va MUTEADO: el audio maestro
// del video es la capa AvatarLayer, si no se escucharía doble.
import { staticFile } from "remotion";

export const WB_START = 1197.66;
export const WB_DUR = 37.8;

export const SCENE_V8: any = {
  avatarSrc: staticFile("avatar_clips/v8v252t741it/wb.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 30, fy: 12, z: 1.16 },   // título
    { time: 1.6, fx: 22, fy: 34, z: 1.42 },   // ÓXIDO NÍTRICO
    { time: 8.8, fx: 50, fy: 46, z: 1.34 },   // la arteria
    { time: 15.4, fx: 74, fy: 40, z: 1.42 },  // lo que gana el cuerpo
    { time: 22.8, fx: 50, fy: 68, z: 1.36 },  // la evidencia
    { time: 30.0, fx: 50, fy: 45, z: 1.0 },   // recap abierto, se mantiene
  ],
  elements: [
    { t: "title", x: 4, y: 5, text: "Por qué la remolacha baja la presión", start: 0.4 },

    { t: "note", x: 6, y: 26, text: "ÓXIDO NÍTRICO", start: 1.8, accent: true, size: 44 },
    { t: "note", x: 6, y: 36, text: 'la orden de "aflojá" que le llega a tus arterias', start: 4.6, w: 34 },
    { t: "note", x: 6, y: 46, text: "tu cuerpo abre los caños desde adentro", start: 7.2, w: 32, bullet: true },

    { t: "image", x: 40, y: 30, w: 24, src: staticFile("img/dg_v8v252t741it_cascada_remolacha_oxido_nitrico.jpg"), start: 9.4, caption: "la pared de la arteria se relaja" },
    { t: "arrow", from: [26, 42], to: [39, 40], start: 10.6, curve: 0.3 },
    { t: "note", x: 40, y: 62, text: "el diámetro se agranda un poquito", start: 12.0, w: 26, highlight: true },
    { t: "note", x: 40, y: 71, text: "la sangre pasa con menos esfuerzo", start: 13.8, w: 26 },

    { t: "arrow", from: [65, 45], to: [76, 38], start: 15.2, curve: -0.25 },
    { t: "note", x: 74, y: 26, text: "menos esfuerzo para el corazón", start: 16.2, w: 24, bullet: true },
    { t: "note", x: 74, y: 38, text: "más riego al cerebro y a las piernas", start: 18.4, w: 24, bullet: true },

    { t: "note", x: 30, y: 84, text: "MEDIDO EN ENSAYOS CLÍNICOS", start: 23.6, w: 30, box: true, align: "center" },
    { t: "note", x: 62, y: 84, text: "−4 a −5 mmHg en la máxima", start: 28.2, w: 24, accent: true, align: "center" },
    { t: "lasso", x: 74, y: 87, w: 26, h: 12, start: 31.4, rot: -2 },
    { t: "note", x: 6, y: 86, text: "no es un milagro: es una diferencia real, todos los días", start: 33.8, w: 22 },
  ],
};
