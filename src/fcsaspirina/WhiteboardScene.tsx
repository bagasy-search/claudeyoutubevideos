// WhiteboardScene.tsx — escena de FedWhiteboard para el beat del MECANISMO
// (por qué el ácido salicílico ablanda la queratina), pedida por el brief de
// densidad. avatarSrc es solo el PiP de la esquina, mudo (el audio real es el
// máster global) — reusa la primera ventana de avatar, ya generada.
import { staticFile } from "remotion";

export const SCENE_ASPIRINA_MEC = {
  avatarSrc: staticFile("broll/fcsaspirina_av2/win-001.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 30, fy: 18, z: 1.1 },
    { time: 2.5, fx: 22, fy: 42, z: 1.35 },
    { time: 6.0, fx: 62, fy: 42, z: 1.35 },
    { time: 9.0, fx: 50, fy: 60, z: 1.0 },
  ],
  elements: [
    { t: "title" as const, x: 4, y: 6, text: "Queratolítico: por qué funciona", start: 0.3 },
    { t: "note" as const, x: 12, y: 30, w: 34, text: "QUERATO = queratina\n(uña, callo, piel dura)", start: 1.8, box: true },
    { t: "note" as const, x: 54, y: 30, w: 34, text: "LÍTICO = disuelve,\nrompe el cemento", start: 4.5, box: true, accent: true },
    { t: "arrow" as const, from: [30, 38], to: [50, 38], start: 5.6, curve: -0.2 },
    { t: "note" as const, x: 22, y: 62, w: 56, text: "Disuelve el cemento entre células muertas, capa por capa, sin tocar la piel nueva", start: 7.6, highlight: true, align: "center" as const },
  ],
};
