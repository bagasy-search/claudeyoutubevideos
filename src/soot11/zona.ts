// zona segura automática: ningún texto se sale del cuadro (margen ZS px de pantalla)
import type { Cam } from "./mundo";
export const ZS = 80;
// ancho aproximado en px de un renglón de la fuente redonda en 700
export const anchoTxt = (text: string, size: number) => text.length * size * 0.6 + size * 0.2;
// corre el borde izquierdo l de una caja de ancho w para que quepa en [ZS, 1920-ZS]
const corre = (l: number, w: number, lim = 1920) => {
  if (w > lim - 2 * ZS) return lim / 2 - (l + w / 2);
  return Math.max(ZS - l, 0) - Math.max(l + w - (lim - ZS), 0);
};
// pantalla: x del ancla (izquierda o centro) → x corregida
export const segX = (x: number, w: number, centro = true) => x + corre(centro ? x - w / 2 : x, w);
// pantalla: y del centro de una caja de alto h
export const segY = (y: number, h: number) => y + corre(y - h / 2, h, 1080);
// mundo: corre (x, y) de un texto en coordenadas del mundo según la cámara; sólo si el corrimiento es chico
// (si la cámara se fue lejos el texto se va con el mundo, no se pega al borde)
export const segMundo = (cam: Cam, x: number, y: number, w: number, h: number, anchor: "start" | "middle" | "end" = "middle") => {
  const z = cam.z;
  const sx = 960 + (x - cam.x) * z, sy = 540 + (y - cam.y) * z;
  const W = w * z, H = h * z;
  const l = anchor === "middle" ? sx - W / 2 : anchor === "end" ? sx - W : sx;
  const dx = corre(l, W), dy = corre(sy - H, H, 1080);
  const ok = (d: number) => (Math.abs(d) < 420 ? d : 0);
  return { x: x + ok(dx) / z, y: y + ok(dy) / z };
};
