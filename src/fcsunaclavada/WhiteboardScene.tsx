// WhiteboardScene.tsx — escena de FedWhiteboard para el beat del MECANISMO de fcsunaclavada
// (por qué la uña encarnada NO se arregla sola: el círculo vicioso inflamación → presión).
// avatarSrc es solo el PiP de la esquina, mudo (el audio real es el máster global).
import { staticFile } from "remotion";

export const SCENE_UNA_MEC = {
  avatarSrc: staticFile("broll/fcsunaclavada_av/win-001.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 32, fy: 16, z: 1.1 },
    { time: 3.0, fx: 24, fy: 40, z: 1.35 },
    { time: 7.0, fx: 64, fy: 44, z: 1.35 },
    { time: 11.0, fx: 50, fy: 62, z: 1.0 },
  ],
  elements: [
    { t: "title" as const, x: 4, y: 6, text: "Por qué no se arregla solo", start: 0.3 },
    { t: "note" as const, x: 10, y: 28, w: 34, text: "La uña PERFORA\nel pliegue de piel", start: 1.8, box: true },
    { t: "arrow" as const, from: [30, 36], to: [52, 36], start: 3.4, curve: -0.18 },
    { t: "note" as const, x: 54, y: 28, w: 36, text: "El cuerpo la lee\ncomo una ASTILLA\n→ se inflama", start: 4.2, box: true, accent: true },
    { t: "arrow" as const, from: [70, 44], to: [62, 58], start: 6.4, curve: 0.25 },
    { t: "note" as const, x: 26, y: 60, w: 52, text: "El pliegue inflamado crece → aprieta MÁS → la uña se clava MÁS", start: 7.4, highlight: true, align: "center" as const },
    { t: "arrow" as const, from: [26, 66], to: [16, 40], start: 9.6, curve: 0.35 },
  ],
};
