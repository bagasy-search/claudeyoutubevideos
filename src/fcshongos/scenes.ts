// scenes.ts — escenas de FedWhiteboard propias de `fcshongos`. Habla el beat del MECANISMO
// ("por qué funciona la rutina"): vinagre baja el pH → terpinen-4-ol del aceite de árbol de té
// ataca al hongo en ese nuevo terreno. Reutiliza los `_prev_bed.jpg` ya generados para esos
// beats (095 = vinagre, 099 = terpinen) así no hace falta arte nuevo.
import { staticFile } from "remotion";

const P = (n: string) => staticFile(`img/fcshongos/${n}`);

// Slot real disponible: 552.24s→573.26s (~21s, el único hueco de esa duración sin avatar
// interrumpiendo). El diseño original de 52s no cabía en ningún hueco sin comerse avatar de
// verdad, así que esta versión es más corta: título + 2 tarjetas + conclusión, a paso más rápido.
export const SCENE_FCSHONGOS_MECANISMO = {
  avatarSrc: staticFile("broll/fcshongos_av/win-023.mp4"),
  muted: true,
  cameras: [
    { time: 0.0, fx: 35, fy: 15, z: 1.05 },
    { time: 2.2, fx: 25, fy: 46, z: 1.38 },
    { time: 8.5, fx: 40, fy: 46, z: 1.18 },
    { time: 10.0, fx: 55, fy: 46, z: 1.38 },
    { time: 14.5, fx: 50, fy: 66, z: 1.16 },
    { time: 17.5, fx: 50, fy: 46, z: 1.0 },
  ],
  elements: [
    { t: "title", x: 4, y: 6, text: "Por qué funciona esta rutina", start: 0.4 },
    {
      t: "card", x: 25, y: 46, w: 19,
      src: P("fcshongos_095_prev_bed.jpg"),
      label: "El vinagre", caption: "Baja el pH\nde la superficie", start: 2.2,
    },
    { t: "arrow", from: [35, 46], to: [47, 46], start: 8.3, curve: -0.25 },
    {
      t: "card", x: 55, y: 46, w: 19,
      src: P("fcshongos_099_prev_bed.jpg"),
      label: "Terpinen-4-ol", caption: "El compuesto\nantifúngico del aceite", start: 10.0,
    },
    {
      t: "note", x: 50, y: 74, w: 36,
      text: "Ese cambio de terreno es lo que deja al hongo sin donde crecer",
      start: 14.5, fill: true, align: "center",
    },
  ],
};
