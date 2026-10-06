// scenes.ts — escena de FedWhiteboard propia de `fcsjuanetes`. Habla el beat del MECANISMO:
// el dedo gordo como el MÁSTIL de una carpa y los músculos como las cuerdas. Cuando el mástil se
// inclina, la misma cuerda que lo sostenía pasa a tumbarlo. Ese es el juanete.
// Sin imágenes: sólo trazo a mano. El PiP reusa la primera ventana de avatar ya generada, mudo
// (el audio real es el máster global).

import { staticFile } from "remotion";

export const SCENE_FCSJUANETES_MECANISMO = {
  avatarSrc: staticFile("broll/fcsjuanetes_av/win-001.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 32, fy: 14, z: 1.1 },
    { time: 2.6, fx: 22, fy: 40, z: 1.36 },
    { time: 7.0, fx: 66, fy: 40, z: 1.36 },
    { time: 11.5, fx: 50, fy: 64, z: 1.12 },
    { time: 15.5, fx: 50, fy: 46, z: 1.0 },
  ],
  elements: [
    { t: "title" as const, x: 5, y: 6, text: "El juanete: por qué se acelera solo", start: 0.3 },
    { t: "note" as const, x: 9, y: 28, w: 33, text: "MÁSTIL DERECHO\nlas cuerdas tiran parejo\ny lo sostienen solo", start: 2.0, box: true },
    { t: "arrow" as const, from: [44, 36], to: [58, 36], start: 5.6, curve: -0.18 },
    { t: "note" as const, x: 60, y: 28, w: 33, text: "MÁSTIL INCLINADO\nla misma cuerda ahora\ntira en diagonal y lo TUMBA", start: 6.6, box: true, accent: true },
    { t: "note" as const, x: 9, y: 56, w: 26, text: "Aductor: acortado,\njala hacia los otros dedos", start: 10.2, bullet: true },
    { t: "note" as const, x: 38, y: 56, w: 26, text: "Abductor: se resbala\ny deja de enderezar", start: 12.0, bullet: true },
    { t: "note" as const, x: 67, y: 56, w: 26, text: "Sesamoideos: la articulación\nqueda descarrilada", start: 13.6, bullet: true },
    { t: "lasso" as const, x: 50, y: 60, w: 86, h: 20, start: 13.8 },
    { t: "note" as const, x: 20, y: 80, w: 60, text: "Dos de las tres son MÚSCULO: el músculo sí responde", start: 15.0, highlight: true, align: "center" as const },
  ],
};
