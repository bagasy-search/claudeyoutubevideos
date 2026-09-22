// WhiteboardScene.tsx — pizarra del beat del MECANISMO de fcspuntos: por qué el virus del
// papiloma hace que la piel crezca al doble y de dónde sale el punto negro.
// avatarSrc es solo el PiP de la esquina, MUDO (el audio real es el máster global).
import { staticFile } from "remotion";

export const SCENE_PUNTOS_MEC = {
  // PiP de 13,6s (win-030+031+032 concatenadas) — el beat dura 11s y una sola ventana (~4,3s)
  // dejaba el recuadro congelado. Tampoco repite la ventana de apertura (win-000).
  avatarSrc: staticFile("broll/fcspuntos_av/pip-wb.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 30, fy: 14, z: 1.1 },
    { time: 2.2, fx: 20, fy: 38, z: 1.35 },
    { time: 5.0, fx: 56, fy: 38, z: 1.32 },
    { time: 7.8, fx: 62, fy: 70, z: 1.3 },
    { time: 10.0, fx: 50, fy: 50, z: 1.0 },
  ],
  elements: [
    { t: "title" as const, x: 4, y: 6, text: "De dónde sale el punto negro", start: 0.3 },
    { t: "note" as const, x: 10, y: 28, w: 32, text: "El virus da UNA orden:\nmultiplíquense más rápido", start: 1.6, box: true },
    { t: "note" as const, x: 10, y: 52, w: 32, text: "El peso al caminar la hunde:\ncrece hacia ADENTRO", start: 3.6 },
    { t: "arrow" as const, from: [30, 40], to: [52, 38], start: 4.6, curve: -0.22 },
    { t: "note" as const, x: 54, y: 28, w: 32, text: "Fábrica al doble =\ndoble de alimento", start: 5.2, box: true, accent: true },
    { t: "note" as const, x: 54, y: 52, w: 32, text: "Suben capilares nuevos\nhasta la superficie", start: 7.0 },
    { t: "arrow" as const, from: [70, 60], to: [62, 76], start: 8.4, curve: 0.2 },
    { t: "note" as const, x: 30, y: 82, w: 48, text: "Se rompen, se coagulan: eso es el punto negro. No es raíz, no es tierra.", start: 8.9, highlight: true, align: "center" as const },
    { t: "lasso" as const, x: 54, y: 82, w: 52, h: 18, start: 10.2, rot: -1 },
  ],
};
