// duane02 · RESTO (64,72 s → final) con el motor del kit: UNA base por frase (avatar / toma agnes / el mundo 3D de la estufa),
// transiciones solamente, piezas 2.5D en su capa, ancladas a los tiempos de la voz (frases.txt / caps.json).
// El mundo es el mismo de Min1 (stove3d) con su propia cámara por tramo (KF) y su estado (fx) por tiempo.
import React from "react";
import { AbsoluteFill } from "remotion";
import { StoveWorld, PT, screenOf, camSpeed, Key, FX, ironCss } from "./stove3d";
import { BigNum, COL, Card3D, Chips, FONT, Receipt, Tag as TagK, Thermo, e, extrude, spr, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Price, Stamp } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, MistakesDeal, NextCard, RuleCard, StepTitle, TempChart, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { MIN1_END } from "./Min1";

setSlug("duane02");
export const TEND = 941.92;
const HAS = AVAIL as { clips: string[]; imgs: string[] };
const pick = (...ks: string[]) => ks.find((k) => HAS.clips.includes(k)) ?? ks.find((k) => HAS.imgs.includes(k)) ?? ks[ks.length - 1];
const img = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

// ---------- cámara del mundo: un tramo por segmento (lo oculto interpola donde nadie lo ve) ----------
const KF: Key[] = [
  // A · lo que viene: tiraje, dónde va, la leña, los grados, el monóxido
  { t: 69.4, p: [3.4, 2.2, 2.8], l: [1.0, 0.8, -1.9], fov: 44 },
  { t: 73.0, p: [2.2, 1.6, 0.2], l: [0.9, 1.3, -2.3], fov: 42 },
  { t: 75.0, p: [2.6, 3.2, 2.6], l: [1.1, 0.0, -1.5], fov: 44 },
  { t: 77.5, p: [4.5, 2.4, 3.4], l: [2.0, 1.0, -1.2], fov: 46 },
  { t: 82.3, p: [3.2, 1.9, 0.9], l: [2.2, 1.9, -2.9], fov: 40 },
  // B · hierro fundido: guarda el calor y lo devuelve despacio
  { t: 87.8, p: [1.6, 0.8, -1.0], l: [0.9, 0.4, -1.9], fov: 32 },
  { t: 100.3, p: [1.25, 0.65, -1.35], l: [0.9, 0.38, -1.9], fov: 28 },
  // C · el disco ventilado en corte: las aletas, el aire que entra frío y sale caliente
  { t: 113.5, p: [1.8, 1.0, -0.8], l: [0.9, 0.4, -1.9], fov: 34 },
  { t: 118.6, p: [1.2, 0.62, -1.55], l: [0.9, 0.35, -1.9], fov: 26 },
  { t: 123.05, p: [1.22, 0.64, -1.5], l: [0.9, 0.35, -1.9], fov: 27 },
  { t: 131.9, p: [1.5, 0.8, -1.1], l: [0.9, 0.45, -1.9], fov: 32 },
  { t: 135.9, p: [1.9, 1.0, -0.7], l: [0.9, 0.5, -1.9], fov: 36 },
  // D · los discos flotando: $0
  { t: 156.4, p: [1.75, 0.75, -1.0], l: [0.9, 0.4, -1.9], fov: 36 },
  { t: 166.0, p: [1.55, 0.65, -1.2], l: [0.9, 0.4, -1.9], fov: 34 },
  // E · el caño, la manga de la pared y la alarma
  { t: 178.5, p: [3.0, 1.5, 0.6], l: [1.2, 1.2, -2.2], fov: 44 },
  { t: 188.1, p: [2.8, 1.6, 0.0], l: [1.4, 1.4, -2.5], fov: 42 },
  { t: 194.2, p: [3.2, 1.8, -1.0], l: [2.2, 1.75, -2.9], fov: 40 },
  { t: 204.2, p: [4.2, 2.2, 1.6], l: [1.5, 1.3, -2.3], fov: 44 },
  // F · el humo del primer fuego (afuera, nunca adentro) → el soporte
  { t: 245.1, p: [9, 6, 14], l: [3, 1.2, -1], fov: 42 },
  { t: 251.9, p: [8, 5.2, 12.5], l: [3, 1.2, -1], fov: 42 },
  { t: 252.0, p: [2.0, 1.0, -0.6], l: [0.9, 0.3, -1.9], fov: 36 },
  { t: 257.0, p: [1.6, 0.7, -1.1], l: [0.9, 0.2, -1.9], fov: 32 },
  { t: 266.4, p: [1.5, 0.75, -1.2], l: [0.9, 0.25, -1.9], fov: 30 },
  { t: 273.1, p: [1.3, 0.9, -1.4], l: [0.9, 0.25, -1.9], fov: 28 },
  // G · se apilan: abajo sombrero abajo, arriba dado vuelta; los bulones
  { t: 294.2, p: [1.6, 0.8, -1.1], l: [0.9, 0.35, -1.9], fov: 34 },
  { t: 308.3, p: [1.6, 0.85, -1.05], l: [0.9, 0.4, -1.9], fov: 32 },
  { t: 313.3, p: [1.5, 0.95, -1.3], l: [0.9, 0.45, -1.9], fov: 30 },
  { t: 317.1, p: [1.4, 0.85, -1.4], l: [0.9, 0.4, -1.9], fov: 28 },
  // H · la corredera: el acelerador
  { t: 333.7, p: [1.25, 0.45, -1.0], l: [0.9, 0.3, -1.68], fov: 28 },
  { t: 340.8, p: [1.3, 0.5, -0.9], l: [0.9, 0.3, -1.68], fov: 30 },
  // I · la tapa con el collar
  { t: 352.6, p: [1.4, 1.0, -1.3], l: [0.9, 0.5, -1.9], fov: 30 },
  { t: 358.9, p: [1.3, 1.1, -1.4], l: [0.9, 0.6, -1.9], fov: 30 },
  // J · el tiraje en rayos X
  { t: 364.3, p: [2.7, 1.3, 0.3], l: [0.9, 0.95, -2.0], fov: 42 },
  { t: 376.6, p: [2.5, 1.4, 0.0], l: [0.9, 1.05, -2.1], fov: 42 },
  { t: 380.2, p: [2.5, 1.4, 0.0], l: [0.9, 1.05, -2.1], fov: 42 },
  { t: 387.6, p: [2.4, 1.6, 0.2], l: [0.9, 1.2, -2.2], fov: 40 },
  // K · por el caño hasta la pared y afuera: la regla 3-2-10
  { t: 395.5, p: [1.8, 2.0, -0.9], l: [0.9, 1.7, -2.6], fov: 36 },
  { t: 400.0, p: [1.5, 1.8, -2.2], l: [0.9, 1.7, -3.0], fov: 34 },
  { t: 402.0, p: [6.5, 3.6, -10], l: [0.9, 4.2, -3.3], fov: 40, arc: 0.3 },
  { t: 407.8, p: [5.5, 4.6, -8.5], l: [0.9, 4.4, -3.3], fov: 40 },
  // galvanizado: el caño de cerca
  { t: 433.3, p: [1.7, 1.9, -1.0], l: [0.9, 1.5, -2.0], fov: 34 },
  { t: 439.8, p: [1.5, 2.1, -1.2], l: [0.9, 1.65, -2.3], fov: 34 },
  // L · mañana fría: el caño lleno de aire frío
  { t: 443.8, p: [2.6, 1.8, 0.3], l: [0.9, 1.4, -2.3], fov: 40 },
  { t: 448.5, p: [2.2, 1.6, -0.3], l: [0.9, 1.3, -2.3], fov: 38 },
  // M · las distancias: 36" y 18"
  { t: 475.0, p: [3.2, 3.0, 1.6], l: [1.0, 0.0, -1.7], fov: 48 },
  { t: 479.2, p: [3.0, 2.8, 1.3], l: [1.0, 0.0, -1.7], fov: 46 },
  { t: 485.6, p: [3.0, 2.6, 0.8], l: [0.9, 1.2, -2.0], fov: 42 },
  { t: 488.1, p: [2.7, 2.2, 0.5], l: [0.9, 1.0, -1.9], fov: 40 },
  // N · lejos de lo que larga vapores
  { t: 493.7, p: [3.4, 2.2, 0.0], l: [6.2, 0.4, 2.4], fov: 44 },
  { t: 500.3, p: [4.8, 1.4, 1.0], l: [6.4, 0.35, 2.5], fov: 36 },
  // el seguro: el taller solo en la nieve
  { t: 515.7, p: [9, 6, 14], l: [3, 1.2, -1], fov: 42 },
  { t: 521.1, p: [7.5, 4.5, 11], l: [3, 1.2, -1], fov: 42 },
  // O · madera mala: humo amarillo
  { t: 558.8, p: [2.0, 1.2, -0.3], l: [0.9, 0.6, -1.9], fov: 38 },
  { t: 565.2, p: [2.3, 1.6, 0.2], l: [0.9, 1.0, -1.9], fov: 40 },
  // P · la cuenta de los BTU
  { t: 577.3, p: [3.2, 1.5, 1.0], l: [0.9, 0.6, -1.9], fov: 40 },
  { t: 589.7, p: [2.6, 1.3, 0.3], l: [0.9, 0.6, -1.9], fov: 38 },
  { t: 593.6, p: [4.5, 2.6, 2.6], l: [2.0, 1.0, -1.2], fov: 46 },
  { t: 600.8, p: [4.0, 2.3, 2.0], l: [2.0, 1.0, -1.2], fov: 46 },
  // Q · los números de una mañana real
  { t: 608.1, p: [9, 7, 13], l: [3, 1, -0.5], fov: 42 },
  { t: 613.0, p: [5.5, 3.6, 6.5], l: [3, 1, -0.5], fov: 44 },
  { t: 619.6, p: [4.8, 2.8, 4.6], l: [3, 1, -0.8], fov: 46 },
  { t: 624.7, p: [4.8, 2.8, 4.6], l: [3, 1, -0.8], fov: 46 },
  { t: 633.8, p: [3.8, 2.0, 1.6], l: [2.4, 1.4, -1.2], fov: 42 },
  // R · la chapa de arriba: 400-600 °F
  { t: 656.8, p: [1.35, 0.95, -1.25], l: [0.9, 0.5, -1.9], fov: 30 },
  { t: 663.0, p: [1.6, 1.1, -0.95], l: [0.9, 0.55, -1.9], fov: 32 },
  { t: 669.8, p: [2.2, 1.4, -0.2], l: [0.9, 0.7, -1.9], fov: 38 },
  // S · afuera: el caño humeando; a −20 no da abasto
  { t: 690.4, p: [3, 4.5, -12], l: [1.5, 2.6, -3], fov: 42 },
  { t: 696.4, p: [3.5, 5, -13], l: [1.5, 2.6, -3], fov: 44 },
  { t: 700.3, p: [3, 4.2, -11], l: [1.5, 2.8, -3], fov: 42 },
  // T · el monóxido: buen tiraje lo saca; fuego ahogado lo deja adentro
  { t: 714.4, p: [3.6, 2.0, 1.6], l: [0.9, 1.4, -2.2], fov: 44 },
  { t: 722.3, p: [3.0, 1.7, 0.8], l: [0.9, 1.2, -2.2], fov: 42 },
  { t: 727.8, p: [4.5, 2.4, 2.4], l: [2.5, 2.4, -1.0], fov: 46 },
  { t: 736.7, p: [4.0, 1.9, 1.8], l: [2.5, 2.2, -1.0], fov: 46 },
  // U · las dos alarmas
  { t: 742.7, p: [4.6, 2.0, 1.4], l: [1.6, 1.5, -2.2], fov: 46 },
  { t: 749.6, p: [3.6, 1.9, -0.4], l: [2.2, 1.75, -2.9], fov: 38 },
  { t: 756.0, p: [5.4, 1.8, 0.8], l: [6.9, 1.75, 1.6], fov: 38 },
  // V · la corredera cerrada: la fábrica de monóxido
  { t: 776.3, p: [1.3, 0.5, -0.95], l: [0.9, 0.3, -1.68], fov: 30 },
  { t: 788.7, p: [2.4, 1.4, 0.4], l: [0.9, 1.0, -1.9], fov: 42 },
  // W · afuera de noche, los errores
  { t: 826.0, p: [-1, 5, -12], l: [1.5, 2.2, -2.5], fov: 42 },
  { t: 839.5, p: [-0.5, 4.4, -10.5], l: [1.5, 2.2, -2.5], fov: 42 },
  // X · dormido con el fuego ahogado
  { t: 878.6, p: [4.5, 2.4, 2.4], l: [2.5, 2.4, -1.0], fov: 46 },
  { t: 881.3, p: [4.3, 2.2, 2.2], l: [2.5, 2.3, -1.0], fov: 46 },
  // Y · cerrá la corredera y dejalo apagarse
  { t: 888.1, p: [1.3, 0.5, -0.95], l: [0.9, 0.3, -1.68], fov: 30 },
  { t: 892.1, p: [1.45, 0.62, -0.9], l: [0.9, 0.35, -1.7], fov: 32 },
  // Z · el resumen: de 26 a los 50 y pico
  { t: 896.4, p: [9, 6, 14], l: [3, 1.2, -1], fov: 42 },
  { t: 901.0, p: [4.8, 2.8, 4.6], l: [3, 1, -0.8], fov: 46 },
  { t: 906.9, p: [3.6, 1.9, 1.4], l: [1.4, 0.9, -1.7], fov: 42 },
];

// ---------- estado del mundo por tiempo ----------
const fx = (t: number): Partial<FX> => {
  if (t < 85) { const d = e(t, 69.6, 70.4) * (1 - e(t, 73.6, 74.1));
    return { day: 0.45, fire: 1, draft: d, xray: d, clear: e(t, 74.2, 74.8) * (1 - e(t, 76.6, 77.0)), heat: e(t, 77.0, 77.6) * (1 - e(t, 80.2, 80.6)), flow: 0.5, smoke: 0.6 * e(t, 80.6, 82.0), alarm: t > 81.2 ? 1 : 0, shopTemp: 45 }; }
  if (t < 105) return { day: 0.4, fire: 1 - 0.75 * e(t, 96.5, 99.5), heat: e(t, 94.0, 94.6), shopTemp: 40 };
  if (t < 140) return { day: 0.4, cut: 1, fire: t < 123 ? 0.5 : 1, flow: e(t, 125.6, 126.6), shopTemp: 40 };
  if (t < 170) return { day: 0.45, build: 3, explode: 1, fire: 0, shopTemp: 30 };
  if (t < 240) return { day: 0.45, fire: 1, flow: 0.4, shopTemp: 45, alarm: t > 187.3 && t < 188.3 ? 1 : 0 };
  if (t < 266) return t < 252 ? { day: 0.8, fire: 0, shopTemp: 30 } : { day: 0.4, build: 1 + 0.0 * t, fire: 0, shopTemp: 30 };
  if (t < 290) return { day: 0.4, build: 2, fire: 0, shopTemp: 30 };
  if (t < 330) { const b = t < 301 ? 2 : t < 313.4 ? 2 + e(t, 301.2, 303.2) : 3 + e(t, 313.6, 314.6); return { day: 0.4, build: b, cut: t > 305.3 && t < 308.4 ? 1 : 0, fire: 0, shopTemp: 30 }; }
  if (t < 345) { const sl = t < 336.6 ? 0.5 : t < 338.6 ? 1 : 0.1; return { day: 0.35, fire: t < 336.6 ? 0.6 : t < 338.6 ? 1 : 0.45, slide: sl, build: 7, shopTemp: 40 }; }
  if (t < 362) return { day: 0.4, build: 5 + e(t, 352.8, 354.0), fire: 0, shopTemp: 30 };
  if (t < 380.3) return { day: 0.4, fire: 1, draft: e(t, 366.9, 367.6), xray: e(t, 364.6, 365.3), shopTemp: 40 };
  if (t < 392) return { day: 0.4, fire: 1, draft: 1 - e(t, 383.6, 384.3), xray: 1, smoke: 0.55 * e(t, 384.2, 385.5) * (1 - e(t, 386.8, 387.6)), smolder: e(t, 383.6, 384.3) * (1 - e(t, 386.8, 387.6)), shopTemp: 40 };
  if (t < 412) return { day: 0.6, fire: 1, draft: 1, xray: t < 401.8 ? 0.6 : 0, rule: e(t, 402.6, 403.4), shopTemp: 42 };
  if (t < 443) return { day: 0.5, fire: 1, xray: 0.4, heat: e(t, 433.6, 434.2), shopTemp: 42 };
  if (t < 455) return { day: 0.2, fire: 0, xray: 1, heat: e(t, 444.0, 444.6), shopTemp: 26, frost: 1 };
  if (t < 493) return { day: 0.45, fire: 1, clear: t < 485.6 ? e(t, 475.3, 476.0) : 1, hearth: e(t, 488.0, 488.6), shopTemp: 42 };
  if (t < 512) return { day: 0.45, fire: 1, fumes: e(t, 496.6, 497.2), shopTemp: 42 };
  if (t < 530) return { day: 0.8, fire: 1, shopTemp: 42 };
  if (t < 570) return { day: 0.4, fire: 1, smolder: 1, smoke: 0.6 * e(t, 559.0, 561.0), shopTemp: 40 };
  if (t < 606) return { day: 0.45, fire: 1, flow: 1, heat: e(t, 577.6, 578.3), shopTemp: 48 };
  if (t < 640) { const T = t < 627 ? 26 : t < 631 ? 26 + 10 * e(t, 629.7, 631.2) : 36 + 9 * e(t, 631.6, 634.1);
    return { day: t < 619 ? 0.3 : 0.55, fire: t > 629.6 ? 1 : 0, flow: t > 630 ? 0.6 : 0, heat: e(t, 613.2, 613.9), frost: t < 629 ? 1 : 0, shopTemp: T }; }
  if (t < 680) return { day: 0.5, fire: 1, heat: e(t, 657.2, 657.9) * (1 - e(t, 661.0, 661.5)), shopTemp: 50, stoveT: 560 };
  if (t < 712) return t < 696.4 ? { day: 0.8, fire: 1, shopTemp: 50 } : { day: 0.05, storm: 1, fire: 1, shopTemp: 36 };
  if (t < 740) { const sm = e(t, 724.1, 725.4); return { day: 0.4, fire: 1, draft: e(t, 719.8, 720.6) * (1 - sm), xray: e(t, 719.8, 720.6), smolder: sm, smoke: t < 727 ? sm * 0.3 : 0.3 + 0.5 * e(t, 728.0, 733.0), shopTemp: 42 }; }
  if (t < 770) return { day: 0.45, fire: 1, alarm: (t > 752.5 && t < 754.5) || (t > 757.9 && t < 759.5) ? 1 : 0, shopTemp: 45 };
  if (t < 800) { const ch = e(t, 787.2, 788.6); return { day: 0.05, fire: 1, slide: 0.6 - 0.58 * ch, smolder: ch, smoke: 0.7 * e(t, 788.0, 790.0), shopTemp: 40 }; }
  if (t < 860) return { day: 0.03, storm: 0.5, fire: 0, shopTemp: 20 };
  if (t < 885) return { day: 0.02, fire: 1, smolder: 1, smoke: 0.85, alarm: 1, shopTemp: 40 };
  if (t < 895) { const c = e(t, 888.4, 889.6); return { day: 0.4, fire: 1 - 0.8 * e(t, 889.6, 892.0), slide: 0.6 - 0.58 * c, shopTemp: 42 }; }
  return { day: 0.35, fire: 1, flow: 0.7, heat: e(t, 897.6, 898.3) * (1 - e(t, 906.4, 906.9)), shopTemp: 26 + 26 * e(t, 900.6, 905.4) };
};
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t, KF), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbR" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><StoveWorld t={t} KF={KF} fx={fx} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// etiqueta 3D que se da vuelta sola si el texto se iría del cuadro
const Tag: React.FC<React.ComponentProps<typeof TagK>> = (p) => {
  const dx0 = p.dx ?? 120, size0 = p.size ?? 46, w = size0 * 0.8 * p.text.length + 30;
  const room = (d: number) => (d >= 0 ? 1850 - (p.x + d) : p.x + d - 70);
  const dx = room(dx0) >= w || room(dx0) >= room(-dx0) ? dx0 : -dx0;
  const size = Math.max(30, Math.min(size0, (size0 * room(dx)) / w));
  return <TagK {...p} dx={dx} size={size} />;
};
const sc = (t: number, q: [number, number, number]) => screenOf(t, q, KF);
const W = (a: number, tr: "zoom" | "portal" | "whip" | "whipL" | "push" | "light" | "flip" = "zoom", p?: [number, number]) => ({ a, tr, p, r: (t: number) => <World t={t} /> });

// escala térmica a la derecha mientras el mundo está en visión térmica
const Scale: React.FC<{ t: number; spans: [number, number][] }> = ({ t, spans }) => {
  const o = spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.4) * (1 - e(t, b - 0.4, b))), 0);
  if (o < 0.01) return null;
  return <div style={{ position: "absolute", right: 60, top: 220, opacity: o, fontFamily: FONT, fontWeight: 800, color: COL.ink, fontSize: 24, textAlign: "center" }}>
    <div>75°F</div><div style={{ width: 34, height: 420, margin: "8px auto", borderRadius: 17, border: "3px solid rgba(255,255,255,.8)", background: `linear-gradient(0deg, ${[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((u) => ironCss(u)).join(",")})` }} /><div>−5°F</div></div>;
};
// tarjeta con foto/toma que entra girando sobre el avatar
const Pop: React.FC<{ t: number; id: string; at: number; out: number; side?: "L" | "R"; label?: string; col?: string }> = ({ t, id, at, out, side = "R", label, col = COL.ink }) => {
  const k = Math.min(1, spr(t, at, 0.8)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sg = side === "R" ? 1 : -1;
  return <Card3D id={id} x={side === "R" ? 1190 : 40} y={210} w={680} h={382} ry={sg * ((1 - k) * 60 + 10)} rx={4} z={(1 - k) * -1300} o={o} label={label} labelCol={col} />;
};
// chip suelto (dato) que cae arriba a la izquierda
const Chip: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; text: string; col?: string; size?: number }> = ({ t, at, out, x = 150, y = 150, text, col = COL.ink, size = 54 }) => {
  const k = Math.min(1.1, spr(t, at)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900 }}>
    <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg) translateY(${(1 - Math.min(1, k)) * -60}px)`, padding: "12px 26px", borderRadius: 14, background: "linear-gradient(180deg, rgba(14,22,36,.92), rgba(8,12,20,.92))", border: `3px solid ${col}`, boxShadow: `0 24px 50px rgba(0,0,0,.6), 0 0 24px ${col}55`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 3, whiteSpace: "nowrap", textShadow: extrude(4, "rgba(0,0,0,.6)") }}>{text}</div>
  </div>;
};

export const rest = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: MIN1_END, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => [
    AV(64.862, "cut"),
    W(69.38, "zoom"),
    AV(82.378, "whip"),
    W(87.76, "zoom"),
    AV(100.368, "whip"),
    CL(105.757, "n_truck_brake", "whip"),
    W(113.5, "whipL"),
    AV(118.632, "whip"),
    W(123.056, "zoom"),
    AV(135.927, "whip"),
    CL(141.5, "d_carry", "whip"),
    CL(148.8, "n_scrapbin", "push"),
    AV(151.801, "whip"),
    W(156.382, "zoom"),
    CL(166.0, "n_kit", "push"),
    AV(169.517, "whip"),
    CL(175.171, "d_plasma", "whip"),
    W(178.5, "zoom"),
    AV(188.196, "whip"),
    W(194.199, "zoom"),
    AV(204.315, "whip"),
    CL(208.647, "d_inspect", "whip"),
    CL(218.6, "n_crack", "push"),
    AV(222.714, "whip"),
    CL(227.996, "d_wirewheel", "whip"),
    CL(235.2, "n_burnin", "push"),
    AV(239.559, "whip"),
    W(245.079, "zoom"),
    AV(257.124, "whip"),
    CL(261.196, "d_legs", "whip"),
    W(266.4, "zoom"),
    AV(273.133, "whip"),
    CL(277.746, "d_stack", "whip"),
    CL(285.8, "n_preheat", "push"),
    AV(289.547, "whip"),
    W(294.21, "zoom"),
    AV(308.334, "whip"),
    W(313.296, "zoom"),
    CL(317.1, "d_cutoff", "whip"),
    AV(325.306, "whip"),
    CL(330.56, "d_slide", "whip"),
    W(333.7, "zoom"),
    AV(340.831, "whip"),
    CL(344.905, "d_collar", "whip"),
    W(352.6, "zoom"),
    AV(358.978, "whip"),
    W(364.328, "zoom"),
    AV(376.695, "whip"),
    W(380.202, "zoom"),
    CL(387.7, "d_pipeup", "push"),
    AV(392.214, "whip"),
    W(395.481, "zoom"),
    AV(407.847, "whip"),
    CL(411.51, "n_roof", "whip"),
    CL(415.2, "d_screws", "push"),
    AV(421.428, "whip"),
    CL(426.602, "n_galv", "whip"),
    W(433.3, "zoom"),
    AV(439.865, "whip"),
    W(443.765, "zoom"),
    CL(448.6, "d_newspaper", "whip"),
    AV(454.93, "whip"),
    CL(460.385, "n_smoke_back", "whip"),
    AV(471.411, "whip"),
    W(474.994, "zoom"),
    CL(479.3, "d_tape36", "push"),
    W(485.6, "zoom"),
    AV(488.18, "whip"),
    W(493.696, "zoom"),
    CL(500.4, "n_fumes", "push"),
    AV(505.349, "whip"),
    CL(508.433, "n_attached", "whip"),
    W(515.7, "zoom"),
    AV(521.193, "whip"),
    CL(525.453, "d_sticks", "whip"),
    ...(HAS.clips.includes("plata_feed_b") ? [CL(532.0, "plata_feed_b", "push")] : []),
    AV(537.682, "whip"),
    CL(542.905, "d_meter", "whip"),
    CL(548.4, "n_badwood", "push"),
    AV(553.669, "whip"),
    W(558.838, "zoom"),
    CL(565.3, "d_bucketscale", "whip"),
    AV(572.133, "whip"),
    W(577.282, "zoom"),
    AV(589.739, "whip"),
    W(593.651, "zoom"),
    CL(600.9, "n_heaters", "push"),
    AV(604.151, "whip"),
    W(608.095, "zoom"),
    AV(619.646, "whip"),
    W(624.69, "zoom"),
    CL(633.9, "d_thermo45", "push"),
    AV(635.793, "whip"),
    CL(641.251, "n_bigdoor", "whip"),
    CL(643.7, "d_weld_warm", "push"),
    CL(649.6, "n_stovetherm", "push"),
    AV(653.705, "whip"),
    W(656.831, "zoom"),
    AV(669.874, "whip"),
    CL(674.484, "n_propane", "whip"),
    AV(685.538, "whip"),
    W(690.452, "zoom"),
    CL(700.4, pick("plata_feed_a", "d_feed"), "whip"),
    AV(705.44, "whip"),
    CL(709.817, "d_watch", "whip"),
    W(714.4, "zoom"),
    AV(722.31, "whip"),
    W(727.849, "zoom"),
    AV(736.726, "whip"),
    W(742.741, "zoom"),
    AV(756.093, "whip"),
    CL(760.847, "n_co_door", "whip"),
    CL(764.2, "d_wave", "push"),
    CL(769.4, "n_dizzy", "push"),
    AV(772.635, "whip"),
    W(776.26, "zoom"),
    AV(788.76, "whip"),
    CL(793.108, "n_smolder", "whip"),
    CL(799.3, "d_leave", "push"),
    AV(806.176, "whip"),
    CL(811.186, "d_creosote", "whip"),
    CL(818.9, "d_ashes", "push"),
    AV(821.395, "whip"),
    W(826.005, "zoom"),
    AV(839.569, "whip"),
    CL(843.513, "n_stub", "whip"),
    CL(851.3, "n_tooclose", "push"),
    AV(856.727, "whip"),
    CL(862.599, "n_pallet_fire", "whip"),
    AV(873.225, "whip"),
    W(878.624, "zoom"),
    CL(881.3, "n_steam", "push"),
    W(888.1, "zoom"),
    AV(892.143, "whip"),
    W(896.377, "zoom"),
    AV(906.996, "whip"),
    CL(911.216, "d_hero", "whip"),
    AV(923.716, "whip"),
    CL(928.625, "d_arms", "whip"),
  ],
  pieces: (t) => {
    const L: React.ReactNode[] = [];
    const P = (n: React.ReactNode) => L.push(n);
    const pt = (q: [number, number, number]) => sc(t, q);
    P(<Scale key="sc" t={t} spans={[[77.0, 80.6], [94.0, 100.3], [433.6, 439.8], [444.0, 448.6], [577.6, 589.7], [593.65, 600.9], [613.2, 619.6], [624.7, 633.9], [657.2, 661.5], [897.6, 906.9]]} />);

    // ---- intro: lo que vas a ver ----
    P(<Stamp key="sbs" t={t} at={67.3} text="STEP BY STEP" x={1400} y={260} out={69.2} rot={-5} size={80} />);
    if (t > 69 && t < 82.4) { const s = pt(PT.stove), p = pt(PT.pipe);
      P(<Tag key="i1" t={t} at={69.6} x={p.x} y={p.y} dx={280} dy={-120} text="HOW THE DRAFT WORKS" col={ironCss(0.85)} out={73.6} />);
      P(<Tag key="i2" t={t} at={74.3} x={s.x} y={s.y} dx={300} dy={-160} text="WHERE IT CAN GO" sub="AND WHERE IT NEVER CAN" col={COL.red} out={76.6} />);
      P(<Chip key="i3" t={t} at={75.6} out={77.0} text="HOW MUCH WOOD IT EATS" col={COL.amber} />);
      P(<Chip key="i4" t={t} at={77.4} out={80.2} text="HOW MANY DEGREES IT ADDS" col={ironCss(0.85)} />); }
    P(<Words key="co0" t={t} items={[{ at: 80.6, txt: "CARBON MONOXIDE", col: COL.red }]} out={82.3} y={880} size={92} />);
    P(<Stamp key="ka" t={t} at={83.7} text="THE PART THAT KEEPS YOU ALIVE" x={960} y={800} out={84.9} rot={-4} size={70} />);
    P(<Words key="wh" t={t} items={[{ at: 85.0, txt: "WHY BRAKE ROTORS?" }]} out={87.6} y={500} size={110} />);
    // ---- por qué discos ----
    P(<Words key="ci" t={t} items={[{ at: 88.6, txt: "CAST IRON", col: "#c9c6bd" }]} out={93.5} y={880} size={110} />);
    P(<Chips key="ih" t={t} at={94.0} items={["THICK", "SOAKS UP HEAT", "GIVES IT BACK SLOW"]} out={100.1} y={140} />);
    P(<Words key="bt" t={t} items={[{ at: 100.4, txt: "BUILT TO TAKE HEAT", col: COL.amber }]} out={102.5} y={880} size={92} />);
    P(<Chips key="hw" t={t} at={103.3} items={["HIGHWAY SPEED", "→ FULL STOP", "+ 100s OF °F"]} out={105.6} y={760} />);
    P(<Words key="ag" t={t} items={[{ at: 107.4, txt: "AGAIN AND AGAIN · FOR YEARS" }]} out={110.8} y={880} size={78} />);
    P(<Stamp key="nn" t={t} at={111.6} text="NOTHING NEW TO IT" x={960} y={220} out={113.4} rot={-5} size={84} />);
    if (t > 113.5 && t < 118.7) { const s = pt(PT.slots); P(<Tag key="vr" t={t} at={115.1} x={s.x} y={s.y} dx={-320} dy={-160} text="VENTED ROTORS" col={COL.amber} out={118.5} size={64} />); }
    P(<Pop key="vn" t={t} id={img("n_vanes")} at={119.0} out={122.9} label="2 FACES · FINS IN BETWEEN" col={COL.amber} />);
    if (t > 123 && t < 135.9) { const s = pt(PT.slots);
      P(<Tag key="ca" t={t} at={125.5} x={s.x} y={s.y} dx={-320} dy={-180} text="COLD AIR IN" col={COL.ice} out={128.4} />);
      P(<Tag key="ha" t={t} at={129.2} x={s.x} y={s.y} dx={300} dy={-200} text="HOT AIR OUT" col={ironCss(0.9)} out={131.8} />); }
    P(<Stamp key="hx" t={t} at={132.4} text="A HEAT EXCHANGER" x={960} y={220} out={135.7} rot={-5} size={92} />);
    P(<Words key="fb" t={t} items={[{ at: 133.9, txt: "THE FACTORY BUILT IT FOR YOU", col: COL.amber }]} out={135.7} y={880} size={70} />);
    P(<Pop key="sc1" t={t} id={img("d_scale")} at={137.6} out={141.3} side="L" label="≈ 25 LB EACH" col={COL.amber} />);
    P(<Chips key="r13" t={t} at={136.4} items={["3/4-TON PICKUP", '13" ACROSS', "25 LB EACH"]} out={141.3} y={800} />);
    P(<BigNum key="50" t={t} at={144.3} text="50 LB" x={1400} y={380} size={230} col={COL.amber} edge="#5a3410" out={148.6} sub="OF CAST IRON IN MY CORNER" />);
    P(<Words key="ab" t={t} items={[{ at: 150.5, txt: "ANY BRAKE SHOP", col: COL.amber }]} out={151.7} y={880} size={92} />);
    P(<Chips key="mt" t={t} at={152.3} items={["BELOW MIN THICKNESS", "→ SCRAP BIN"]} out={156.2} y={800} />);
    if (t > 156.3 && t < 166.1) { const s = pt(PT.stove);
      P(<Price key="p1" t={t} at={157.2} x={s.x + 260} y={s.y - 160} item="ASK NICE" $={0} out={160.3} />);
      P(<Price key="p2" t={t} at={160.6} x={s.x - 520} y={s.y - 120} item="SCRAPYARD" $={3} out={164.4} />);
      P(<Stamp key="fr" t={t} at={164.7} text="MINE WERE FREE" x={960} y={820} out={165.9} rot={-5} size={92} />); }
    // ---- el costo ----
    P(<Receipt key="rc" t={t} rows={[{ at: 168.6, item: "ROTORS", $: 0 }, { at: 175.3, item: "STEEL (SCRAP)", $: 30 }, { at: 182.0, item: "PIPE + ELBOW + WALL", $: 160 }, { at: 187.6, item: "CO ALARM", $: 25 }, { at: 190.2, item: "EXTINGUISHER", $: 30 }]} totalAt={193.9} x={1240} y={120} out={196.6} sc={1.25} title="WHAT IT COST ME" />);
    if (t > 178.5 && t < 188.2) { const th = pt(PT.thimble);
      P(<Tag key="th" t={t} at={183.6} x={th.x} y={th.y} dx={-300} dy={170} text="INSULATED PASS-THROUGH" col={COL.ice2} out={187.0} size={50} />); }
    P(<Words key="dk" t={t} items={[{ at: 197.6, txt: "THE PIPE + THE ALARM" }, { at: 199.4, txt: "DON'T SKIP THEM", col: COL.red }]} out={202.6} y={880} size={84} />);
    if (t > 194.2 && t < 204.3) { const c = pt(PT.co1), o = pt(PT.outTop);
      P(<Tag key="ca1" t={t} at={194.8} x={c.x} y={c.y} dx={-280} dy={150} text="CO ALARM" col={COL.red} out={202.4} />); void o; }
    P(<Chip key="cr" t={t} at={202.8} out={204.2} text="CHEAP ROTORS: FINE ✓" col="#5ee38f" />);
    P(<Stamp key="cc" t={t} at={204.6} text="A CHEAP CHIMNEY KILLS" x={960} y={220} out={207.4} rot={-5} size={86} />);
    // ---- paso 1 ----
    P(<StepTitle key="s1" t={t} at={207.84} n={1} name="PICK THE RIGHT ROTORS" out={210.2} />);
    P(<Chips key="s1c" t={t} at={210.4} items={["SAME SIZE", "BOTH VENTED", "NO CRACKS"]} out={213.8} y={800} />);
    P(<Words key="lc" t={t} items={[{ at: 214.0, txt: "FACE + AROUND THE HUB" }]} out={218.4} y={880} size={80} />);
    P(<Stamp key="op" t={t} at={219.6} text="OPENS UP WHEN HOT" x={960} y={220} out={222.6} rot={-5} size={84} />);
    P(<Words key="ff" t={t} items={[{ at: 223.0, txt: "FLAT · FACE TO FACE · NO GAPS" }]} out={227.2} y={180} size={70} />);
    P(<StepTitle key="s2" t={t} at={227.38} n={2} name="CLEAN + BURN IN OUTSIDE" out={230.8} col={COL.ice} />);
    P(<Chips key="s2c" t={t} at={231.0} items={["BRAKE DUST", "GREASE", "ROAD GRIME"]} out={235.1} y={800} />);
    P(<Chip key="1h" t={t} at={237.5} out={239.4} text="OUTDOORS · ≈ 1 HOUR" col={COL.amber} />);
    P(<Words key="ss" t={t} items={[{ at: 242.5, txt: "SMOKE + STINK" }]} out={245.0} y={880} size={90} />);
    P(<Stamp key="ny" t={t} at={248.4} text="IN THE YARD · NOT IN YOUR SHOP" x={960} y={220} out={251.9} rot={-4} size={70} />);
    P(<StepTitle key="s3" t={t} at={252.08} n={3} name="THE STAND" out={254.5} col={COL.amber} />);
    P(<Words key="nf" t={t} items={[{ at: 254.7, txt: "NEVER ON THE FLOOR", col: COL.red }]} out={257.0} y={880} size={90} />);
    P(<Chips key="s3c" t={t} at={258.4} items={['1/4" PLATE', "3 LEGS", '≈ 6" UP']} out={261.1} y={800} />);
    if (t > 266.4 && t < 273.2) { const s = pt([0.9, 0.18, -1.9]);
      P(<Tag key="fl" t={t} at={267.6} x={s.x} y={s.y} dx={300} dy={-160} text="THE FLOOR OF THE FIREBOX" col={COL.amber} out={272.9} size={52} />);
      P(<Chip key="as" t={t} at={273.3 - 0.4} out={273.1} text="ASH ON STEEL" />); }
    P(<Words key="ash" t={t} items={[{ at: 273.3, txt: "ASH ON STEEL · NOT CONCRETE" }]} out={275.9} y={880} size={70} />);
    // ---- paso 4 ----
    P(<StepTitle key="s4" t={t} at={276.02} n={4} name="STACK · DON'T WELD THE IRON" out={278.6} col={COL.red} />);
    P(<Stamp key="wt" t={t} at={281.4} text="THE WELDER TALKING" x={1400} y={200} out={283.3} rot={-5} size={70} />);
    P(<Chips key="pr" t={t} at={286.4} items={["PREHEAT 500°F", "NICKEL ROD", "COOL IN SAND"]} out={289.4} y={800} />);
    P(<Words key="ck" t={t} items={[{ at: 292.4, txt: "OR IT CRACKS NEXT TO YOUR WELD", col: COL.red }]} out={294.0} y={880} size={66} />);
    P(<Stamp key="sd" t={t} at={297.1} text="SO I DIDN'T" x={960} y={220} out={298.0} rot={-5} size={90} />);
    if (t > 294.2 && t < 308.4) { const s = pt([0.9, 0.3, -1.9]), u = pt([0.9, 0.55, -1.9]);
      P(<Tag key="hd" t={t} at={298.4} x={s.x} y={s.y} dx={-320} dy={-60} text="BOTTOM: HAT DOWN" col={COL.ink} out={301.0} />);
      P(<Tag key="hu" t={t} at={301.4} x={u.x} y={u.y} dx={300} dy={-160} text="TOP: UPSIDE DOWN · HAT UP" col={COL.amber} out={305.1} size={48} />);
      P(<Tag key="bx" t={t} at={305.5} x={s.x} y={s.y} dx={300} dy={-120} text="A CLOSED IRON BOX" col={ironCss(0.85)} out={308.2} />); }
    P(<Pop key="bo" t={t} id={img("d_bolts")} at={308.7} out={313.2} label="3 × GRADE 8 BOLTS" col="#ffd88a" />);
    P(<Words key="nw" t={t} items={[{ at: 314.6, txt: "NO WELD." }, { at: 315.4, txt: "NO CRACK.", col: "#5ee38f" }]} out={317.0} y={880} size={96} />);
    // ---- paso 5 ----
    P(<StepTitle key="s5" t={t} at={317.16} n={5} name="THE DOOR" out={319.2} col={COL.amber} />);
    P(<Chip key="43" t={t} at={320.4} out={325.1} text={'≈ 4" × 3" SLOT'} col={COL.amber} size={60} />);
    P(<Pop key="dr" t={t} id={img("n_door")} at={327.6} out={330.4} label="DOOR ON A PIN + A SLIDE" col={COL.amber} />);
    if (t > 333.7 && t < 340.9) { const s = pt(PT.slide);
      P(<Tag key="gp" t={t} at={333.9} x={s.x} y={s.y} dx={-320} dy={-180} text="YOUR GAS PEDAL" col={COL.amber} out={336.4} size={60} />);
      P(<Tag key="op2" t={t} at={336.6} x={s.x} y={s.y} dx={300} dy={-180} text="OPEN = IT ROARS" col={ironCss(0.9)} out={338.5} />);
      P(<Tag key="cl" t={t} at={338.6} x={s.x} y={s.y} dx={300} dy={-180} text="CLOSED = IT SLOWS" col={COL.ice} out={340.7} />); }
    P(<Stamp key="kl" t={t} at={342.0} text="REMEMBER THE SLIDE" x={960} y={220} out={344.8} rot={-5} size={84} />);
    // ---- paso 6 ----
    P(<StepTitle key="s6" t={t} at={345.24} n={6} name="THE TOP" out={347.0} col={COL.ice} />);
    P(<Chip key="cl4" t={t} at={348.6} out={352.4} text={'PLATE + 4" COLLAR'} col={COL.ice2} />);
    if (t > 352.6 && t < 359) { const c = pt(PT.cap); P(<Tag key="ps" t={t} at={352.9} x={c.x} y={c.y} dx={300} dy={-140} text="WHERE THE PIPE STARTS" col={COL.amber} out={355.0} />);
      P(<Words key="bb" t={t} items={[{ at: 355.1, txt: "BOLTED." }, { at: 355.8, txt: "AGAIN.", col: COL.amber }]} out={356.6} y={880} size={96} />); }
    P(<Versus key="wb" t={t} at={356.8} out={361.3} title="HOW I JOIN IT" L={{ label: "STEEL → STEEL", val: "WELD", h: 0.85, col: "#9aa3ad", mark: "ok" }} R={{ label: "STEEL → CAST IRON", val: "BOLT", h: 0.85, col: COL.amber, mark: "ok" }} />);
    // ---- paso 7: tiraje ----
    P(<StepTitle key="s7" t={t} at={361.48} n={7} name="THE PIPE + THE DRAFT" out={364.2} col={ironCss(0.85)} />);
    if (t > 364.3 && t < 376.7) { const p = pt(PT.pipe), d = pt(PT.slide);
      P(<Words key="pu" t={t} items={[{ at: 364.7, txt: "IT DOESN'T PUSH." }, { at: 366.9, txt: "THE CHIMNEY PULLS.", col: ironCss(0.85) }]} out={368.3} y={880} size={84} />);
      P(<Tag key="hg" t={t} at={369.2} x={p.x} y={p.y} dx={280} dy={-140} text="HOT GAS RISES" col={ironCss(0.9)} out={376.5} />);
      P(<Tag key="fa" t={t} at={372.6} x={d.x} y={d.y} dx={-300} dy={60} text="SUCKS FRESH AIR IN" col={COL.ice} out={376.5} />); }
    P(<Chips key="tw" t={t} at={377.0} items={["TALLER", "WARMER", "= HARDER PULL"]} out={380.0} y={800} />);
    P(<Stamp key="dr2" t={t} at={380.6} text="THAT'S DRAFT" x={960} y={220} out={383.4} rot={-5} size={90} />);
    P(<Stamp key="sm" t={t} at={384.4} text="A SMOKE MACHINE" x={960} y={220} out={387.4} rot={-6} size={92} />);
    P(<Words key="ug" t={t} items={[{ at: 387.9, txt: "GO UP · NOT SIDEWAYS", col: COL.amber }]} out={392.0} y={880} size={84} />);
    P(<Chips key="mr" t={t} at={392.6} items={["4 FT UP", "1 ELBOW", '+1/4" PER FT']} out={395.3} y={800} />);
    if (t > 395.4 && t < 402) { const w = pt(PT.thimble); P(<Tag key="sh" t={t} at={399.4} x={w.x} y={w.y} dx={-320} dy={-150} text="KEEP THIS SHORT" col={COL.amber} out={401.8} />); }
    if (t > 402 && t < 407.9) { const o = pt(PT.outTop), ea = pt(PT.eave);
      P(<Tag key="3f" t={t} at={403.6} x={o.x} y={o.y} dx={280} dy={-60} text="3 FT ABOVE THE ROOF" col={COL.amber} out={407.6} size={50} />);
      P(<Tag key="2f" t={t} at={405.6} x={ea.x} y={ea.y} dx={-300} dy={60} text="2 FT HIGHER · 10 FT AROUND" col={COL.ice} out={407.6} size={48} />); }
    P(<RuleCard key="rule" t={t} at={411.6} at2={412.3} at3={413.0} out={415.1} />);
    P(<Chips key="sc3" t={t} at={415.6} items={["3 SCREWS", "EVERY JOINT", "CRIMP DOWN"]} out={421.2} y={800} />);
    P(<Words key="om" t={t} items={[{ at: 424.9, txt: "ONE MORE THING" }]} out={426.5} y={880} size={84} />);
    P(<CheckList key="ng" t={t} title="NEVER FOR A STOVE" rows={[{ at: 427.0, txt: "✗ GALVANIZED PIPE" }, { at: 428.6, txt: "✗ DRYER VENT" }]} out={433.1} />);
    if (t > 433.3 && t < 439.9) { const p = pt(PT.pipe); P(<Tag key="zn" t={t} at={433.6} x={p.x} y={p.y} dx={280} dy={-140} text="ZINC FUMES" col={COL.red} out={439.6} size={64} />); }
    P(<Words key="2d" t={t} items={[{ at: 436.6, txt: "2 DAYS IN BED · THE SHAKES", col: COL.red }]} out={439.6} y={880} size={74} />);
    if (t > 443.7 && t < 448.6) { const p = pt(PT.pipe); P(<Tag key="cp" t={t} at={444.4} x={p.x} y={p.y} dx={280} dy={-140} text="COLD, HEAVY AIR" sub="WANTS TO FALL" col={COL.ice} out={448.4} />); }
    P(<Chip key="np" t={t} at={449.6} out={454.8} text="WARM THE PIPE FIRST" col={COL.amber} />);
    P(<Stamp key="df" t={t} at={457.6} text="SMOKE IN THE SHOP = DRAFT FAILED" x={960} y={220} out={460.2} rot={-4} size={64} />);
    P(<Chips key="st" t={t} at={462.1} items={["STOP", "OPEN THE BIG DOOR", "FIND OUT WHY"]} out={466.4} y={800} />);
    // ---- paso 8: dónde va ----
    P(<StepTitle key="s8" t={t} at={466.66} n={8} name="WHERE IT GOES" out={469.6} col={COL.red} />);
    P(<Words key="hu2" t={t} items={[{ at: 469.8, txt: "WHERE PEOPLE GET HURT", col: COL.red }]} out={471.3} y={880} size={84} />);
    P(<Chip key="ul" t={t} at={472.0} out={474.8} text="NO SAFETY LISTING = UNLISTED STOVE" col={COL.amber} size={46} />);
    if (t > 474.9 && t < 479.4) { const s = pt([0.9, 0.17, -1.0]); P(<Tag key="36" t={t} at={475.4} x={s.x} y={s.y} dx={300} dy={-140} text='36" FROM ANYTHING THAT BURNS' col={COL.red} out={479.2} size={50} />); }
    P(<BigNum key="36b" t={t} at={480.0} text={'36"'} x={1450} y={380} size={240} col={COL.red} edge="#5a1410" out={485.4} />);
    P(<Chips key="wsb" t={t} at={482.5} items={["WALLS", "SHELVES", "BENCH", "LUMBER"]} out={485.4} y={800} />);
    if (t > 485.6 && t < 488.2) { const p = pt(PT.pipe); P(<Tag key="18" t={t} at={485.8} x={p.x} y={p.y} dx={260} dy={-120} text={'PIPE: 18"'} col={COL.amber} out={488.0} size={64} />); }
    P(<Pop key="br" t={t} id={img("d_bricks")} at={488.6} out={493.5} side="L" label={'BRICKS · 18" IN FRONT'} col={COL.amber} />);
    P(<Words key="cr2" t={t} items={[{ at: 491.0, txt: "A HOT COAL WILL ROLL OUT" }]} out={493.5} y={880} size={70} />);
    if (t > 493.6 && t < 500.5) { const c = pt(PT.cans); P(<Tag key="fu" t={t} at={496.8} x={c.x} y={c.y} dx={-320} dy={-160} text="FAR FROM ANYTHING WITH FUMES" col={COL.red} out={500.3} size={48} />); }
    P(<Chips key="fu2" t={t} at={500.6} items={["GAS CANS", "THINNER", "PARTS WASHER", "SAWDUST"]} out={505.2} y={800} />);
    P(<Pop key="pb" t={t} id={img("n_polebarn")} at={505.6} out={508.3} label="A POLE BUILDING · ON ITS OWN" col={COL.ice2} />);
    P(<Words key="at" t={t} items={[{ at: 508.7, txt: "ATTACHED GARAGE?" }]} out={511.8} y={180} size={96} />);
    P(<Chips key="ca2" t={t} at={512.0} items={["FIRE DEPT", "INSURANCE", "FIRST"]} out={515.5} y={800} />);
    P(<Stamp key="in" t={t} at={516.2} text="SOME INSURANCE WON'T COVER IT" x={960} y={220} out={518.5} rot={-4} size={68} />);
    P(<Words key="bf" t={t} items={[{ at: 518.7, txt: "BEFORE THE FIRE", col: "#5ee38f" }, { at: 520.0, txt: "NOT AFTER", col: COL.red }]} out={521.1} y={880} size={84} />);
    // ---- la leña ----
    P(<Words key="tw2" t={t} items={[{ at: 522.5, txt: "NOW · THE WOOD", col: COL.amber }]} out={525.3} y={500} size={110} />);
    P(<Chips key="sm2" t={t} at={526.0} items={['STICKS ≈ 1"', "2×4 ENDS", "BRANCHES"]} out={531.9} y={800} />);
    P(<Stamp key="dry" t={t} at={532.2} text="IT HAS TO BE DRY" x={960} y={220} out={533.7} rot={-5} size={86} />);
    P(<Chips key="ww" t={t} at={534.2} items={["HISSES", "SMOKES", "CREOSOTE", "HALF THE HEAT"]} out={537.5} y={800} />);
    P(<BigNum key="20" t={t} at={543.6} text="< 20%" x={1450} y={380} size={220} col="#5ee38f" edge="#123a1a" out={546.5} sub="OR IT DOESN'T GO IN" />);
    P(<CheckList key="nv" t={t} title="NEVER BURN" rows={[{ at: 548.6, txt: "✗ PRESSURE-TREATED" }, { at: 549.8, txt: "✗ PAINTED WOOD" }, { at: 550.9, txt: "✗ PLYWOOD / PARTICLE BOARD" }, { at: 552.6, txt: "✗ TRASH" }]} out={558.6} />);
    P(<Stamp key="hd2" t={t} at={561.6} text="WOULD YOU COOK A HOT DOG OVER IT?" x={960} y={220} out={565.2} rot={-4} size={60} />);
    // ---- cuánta leña ----
    P(<Chip key="wg" t={t} at={566.0} out={571.9} text="I WEIGHED IT" col={COL.amber} />);
    P(<Chips key="4h" t={t} at={570.0} items={["4 HOURS", "1 BUCKET", "≈ 12 LB"]} out={572.0} y={800} />);
    P(<Words key="mx" t={t} items={[{ at: 577.4, txt: "12 LB" }, { at: 579.6, txt: "× 7,000 BTU" }, { at: 583.7, txt: "× ½ INTO THE ROOM", col: COL.amber }]} out={589.6} y={880} size={80} />);
    if (t > 577.3 && t < 589.7) { const p = pt(PT.pipe); P(<Tag key="up" t={t} at={588.0} x={p.x} y={p.y} dx={280} dy={-140} text="THE REST GOES UP THE PIPE" col={COL.ice} out={589.6} size={48} />); }
    P(<BigNum key="42k" t={t} at={594.0} text="42,000 BTU" x={960} y={400} size={170} col={COL.amber} edge="#5a3410" out={598.0} sub="IN 4 HOURS" />);
    P(<BigNum key="10k" t={t} at={598.2} text="10,000 BTU/H" x={960} y={400} size={160} col={ironCss(0.9)} edge="#5a3410" out={600.8} />);
    P(<Versus key="hv" t={t} at={601.4} out={604.0} title="" L={{ label: "2 × 1500 W HEATERS", val: "10,000 BTU/H", h: 0.85, col: "#c9c9c9" }} R={{ label: "A BUCKET OF SCRAP WOOD", val: "10,000 BTU/H", h: 0.85, col: COL.amber, mark: "ok" }} />);
    // ---- los números del termómetro ----
    P(<Stamp key="nu" t={t} at={608.5} text="OFF MY THERMOMETER" x={960} y={200} out={610.7} rot={-5} size={80} />);
    P(<Chips key="sh24" t={t} at={611.0} items={["24 × 24", "WALLS INSULATED", "BIG DOOR: NOT"]} out={616.8} y={800} />);
    P(<Words key="jan" t={t} items={[{ at: 617.1, txt: "A REAL MORNING · LAST JANUARY" }]} out={619.5} y={180} size={66} />);
    P(<Chips key="20b" t={t} at={620.0} items={["−20°F = A BAD NIGHT", "THIS: ORDINARY"]} out={624.5} y={800} />);
    P(<TempChart key="tc" t={t} at={624.7} pts={[{ at: 627.2, v: 26, lab: "WALKED IN" }, { at: 631.2, v: 36, lab: "7:30" }, { at: 634.1, v: 45, lab: "8:00" }, { at: 636.0, v: 52, lab: "9:00 BENCH" }]} out={641.1} title="MY SHOP · 14°F OUTSIDE" lo={20} step={8} limit={32} />);
    P(<Chip key="7" t={t} at={629.8} out={633.7} text="LIT AT 7:00" col={COL.amber} x={1450} />);
    P(<Chip key="42d" t={t} at={641.4} out={643.6} text="42°F BY THE BIG DOOR" col={COL.ice} />);
    P(<Chips key="wwf" t={t} at={644.4} items={["WELD", "TURN A WRENCH", "FEEL YOUR FINGERS"]} out={649.5} y={800} />);
    P(<Thermo key="st" t={t} at={650.2} x={1500} y={480} from={70} to={600} dur={2.4} out={656.6} />);
    P(<Chip key="46" t={t} at={651.0} out={656.6} text="400–600°F ON TOP" col={ironCss(0.95)} />);
    P(<Words key="cs" t={t} items={[{ at: 657.0, txt: "PAST 600? CLOSE THE SLIDE", col: COL.amber }]} out={661.1} y={880} size={78} />);
    // ---- el ahorro ----
    P(<Words key="sv" t={t} items={[{ at: 661.4, txt: "WHAT DOES IT SAVE?" }]} out={662.9} y={500} size={100} />);
    P(<Chips key="kw" t={t} at={663.0} items={["2 HEATERS", "4 HOURS", "12 kWh"]} out={667.2} y={800} />);
    P(<BigNum key="2d" t={t} at={668.6} text="≈ $2 / DAY" x={1400} y={380} size={170} col="#5ee38f" edge="#123a1a" out={674.3} sub="AT 17¢ / kWh" />);
    P(<Chip key="pp" t={t} at={676.4} out={685.4} text="PROPANE: ≈ ½ GALLON / DAY" col={COL.ice2} />);
    P(<Words key="un" t={t} items={[{ at: 679.6, txt: "WATER + FUMES · IN THE ROOM", col: COL.red }]} out={685.4} y={880} size={74} />);
    P(<Stamp key="sp" t={t} at={686.0} text="MY FUEL: THE SCRAP PILE" x={1300} y={220} out={690.3} rot={-5} size={70} />);
    P(<Words key="hd3" t={t} items={[{ at: 690.6, txt: "A FEW HUNDRED $ A WINTER", col: "#5ee38f" }]} out={696.3} y={880} size={80} />);
    P(<BigNum key="m20" t={t} at={697.0} text="−20°F" x={960} y={400} size={220} col={COL.ice} edge="#123a5a" out={700.3} sub="IT DOESN'T KEEP UP" />);
    P(<Chip key="30" t={t} at={701.0} out={705.3} text="A LOAD LASTS 30–40 MIN" col={COL.amber} />);
    P(<Stamp key="wk" t={t} at={710.0} text="NEVER RUNS WITHOUT ME IN THE SHOP" x={960} y={220} out={714.3} rot={-4} size={62} />);
    // ---- monóxido ----
    P(<Words key="co1" t={t} items={[{ at: 714.6, txt: "CARBON MONOXIDE", col: COL.red }]} out={717.8} y={500} size={120} />);
    P(<Chip key="ev" t={t} at={718.0} out={722.1} text="EVERY WOOD FIRE MAKES IT" col={COL.red} />);
    if (t > 714.4 && t < 722.4) { const o = pt(PT.pipe); P(<Tag key="gd" t={t} at={720.0} x={o.x} y={o.y} dx={280} dy={-140} text="GOOD DRAFT: UP AND OUT" col="#5ee38f" out={722.1} />); }
    P(<Chips key="lk" t={t} at={724.2} items={["SMOLDERING FIRE", "LEAKY JOINT", "DEAD DRAFT"]} out={727.7} y={800} />);
    P(<Words key="sms" t={t} items={[{ at: 732.1, txt: "CAN'T SEE IT." }, { at: 733.6, txt: "CAN'T SMELL IT.", col: COL.red }]} out={736.6} y={880} size={92} />);
    P(<BigNum key="400" t={t} at={736.9} text="400+" x={1420} y={330} size={210} col={COL.red} edge="#5a1410" out={739.6} sub="AMERICANS DIE A YEAR · CDC" />);
    P(<BigNum key="100k" t={t} at={739.8} text="100,000+" x={1400} y={330} size={170} col={COL.amber} edge="#5a3410" out={742.6} sub="EMERGENCY ROOM VISITS" />);
    P(<Stamp key="nx" t={t} at={746.6} text="MY RULES · NO EXCEPTIONS" x={960} y={220} out={749.4} rot={-4} size={74} />);
    if (t > 742.7 && t < 756.1) { const c1 = pt(PT.co1), c2 = pt(PT.co2);
      P(<Tag key="a1" t={t} at={750.0} x={c1.x} y={c1.y} dx={280} dy={-120} text="≈ 15 FT · HEAD HEIGHT" col={COL.red} out={754.6} size={50} />);
      P(<Tag key="a2" t={t} at={756.2 - 0.4} x={c2.x} y={c2.y} dx={-300} dy={-120} text="ONE BY THE DOOR" col={COL.red} out={756.0} />); }
    P(<Pop key="tb" t={t} id={img("d_co_test")} at={757.8} out={760.7} label="TEST BUTTON · EVERY MONTH" col="#5ee38f" />);
    P(<Words key="go" t={t} items={[{ at: 761.2, txt: "DON'T OPEN A WINDOW AND KEEP WORKING", col: COL.red }]} out={764.1} y={880} size={58} />);
    P(<Chips key="911" t={t} at={764.4} items={["GO OUTSIDE", "DOOR OPEN", "CALL 911"]} out={769.3} y={800} />);
    P(<CheckList key="sy" t={t} title="LIKE THE FLU · NO FEVER" rows={[{ at: 769.8, txt: "HEADACHE" }, { at: 770.8, txt: "DIZZY" }, { at: 771.7, txt: "UPSET STOMACH" }, { at: 772.9, txt: "SLEEPY" }]} out={776.1} />);
    P(<Stamp key="gt" t={t} at={777.7} text="GET OUT" x={960} y={220} out={782.8} rot={-5} size={110} />);
    if (t > 776.3 && t < 788.8) { const s = pt(PT.slide);
      P(<Tag key="ks" t={t} at={783.2} x={s.x} y={s.y} dx={-320} dy={-180} text="REMEMBER THE SLIDE?" col={COL.amber} out={785.1} />);
      P(<Tag key="kl2" t={t} at={785.3} x={s.x} y={s.y} dx={300} dy={-180} text="HERE'S THE KILLER" col={COL.red} out={788.6} size={56} />); }
    P(<Words key="ch" t={t} items={[{ at: 786.9, txt: "CHOKED DOWN TO LAST ALL NIGHT", col: COL.red }]} out={788.6} y={880} size={66} />);
    P(<Stamp key="cf" t={t} at={795.7} text="A CARBON MONOXIDE FACTORY" x={960} y={220} out={799.2} rot={-4} size={70} />);
    P(<Words key="nl" t={t} items={[{ at: 799.4, txt: "NEVER SLEEP WITH IT LIT" }, { at: 801.2, txt: "NEVER LEAVE IT LIT", col: COL.red }]} out={806.0} y={880} size={74} />);
    P(<Pop key="sd2" t={t} id={img("n_smokedet")} at={806.3} out={811.0} label="SMOKE DETECTOR + EXTINGUISHER" col={COL.ice2} />);
    P(<Chip key="cm" t={t} at={811.6} out={818.8} text="CREOSOTE CHECK · EVERY MONTH" col={COL.amber} />);
    P(<Chips key="as2" t={t} at={819.2} items={["METAL CAN", "LID", "OUTSIDE"]} out={821.2} y={800} />);
    P(<Stamp key="lc2" t={t} at={826.2} text="LIVE COALS FOR DAYS" x={960} y={220} out={829.0} rot={-5} size={84} />);
    P(<Words key="gb" t={t} items={[{ at: 829.0, txt: "A WEEK-OLD BOX OF ASHES", col: COL.red }]} out={833.9} y={880} size={74} />);
    // ---- errores ----
    P(<MistakesDeal key="md" t={t} at={834.2} out={838.6} n={4} />);
    P(<Mistake key="m1" t={t} at={838.72} n={1} txt="THE WRONG PIPE" out={851.2} />);
    P(<Chips key="m1c" t={t} at={840.0} items={["GALVANIZED", "DRYER VENT", "3-FT STUB"]} out={843.4} y={160} />);
    P(<Words key="nd" t={t} items={[{ at: 847.5, txt: "NO DRAFT = CO IN YOUR FACE", col: COL.red }]} out={851.2} y={180} size={70} />);
    P(<Mistake key="m2" t={t} at={851.4} n={2} txt="TOO CLOSE" out={861.2} />);
    P(<Versus key="tc2" t={t} at={853.7} out={861.2} title="" L={{ label: "3 FT", val: "FINE", h: 0.9, col: "#5ee38f", mark: "ok" }} R={{ label: "1 FT", val: "FIRE", h: 0.9, col: COL.red, mark: "x" }} />);
    P(<Mistake key="m3" t={t} at={861.38} n={3} txt="BURNING JUNK" out={871.9} />);
    P(<Chips key="m3c" t={t} at={864.1} items={["POISONS THE AIR", "GLUES THE PIPE SHUT"]} out={871.9} y={160} />);
    P(<Mistake key="m4" t={t} at={872.02} n={4} txt="CHOKED DOWN ALL NIGHT" out={881.2} />);
    P(<Stamp key="sl" t={t} at={879.1} text="KILLS PEOPLE IN THEIR SLEEP" x={960} y={220} out={881.2} rot={-4} size={68} />);
    P(<Stamp key="bn" t={t} at={881.5} text="BONUS: NO WATER ON HOT IRON" x={960} y={220} out={887.9} rot={-4} size={66} />);
    P(<Words key="cr3" t={t} items={[{ at: 886.0, txt: "IT CRACKS IN HALF", col: COL.red }]} out={887.9} y={880} size={84} />);
    if (t > 888.1 && t < 892.2) { const s = pt(PT.slide); P(<Tag key="cs2" t={t} at={888.3} x={s.x} y={s.y} dx={-320} dy={-180} text="CLOSE IT · LET IT BURN OUT" col={COL.amber} out={892.0} size={42} />); }
    // ---- cierre ----
    P(<Chips key="rc2" t={t} at={892.4} items={["2 JUNK ROTORS", "A STAND", "A SLIDE", "A TALL PIPE"]} out={896.2} y={800} />);
    P(<Words key="10k2" t={t} items={[{ at: 899.0, txt: "50 LB OF IRON" }, { at: 901.0, txt: "10,000 BTU / HOUR", col: COL.amber }]} out={903.8} y={180} size={80} />);
    P(<BigNum key="26" t={t} at={904.0} text="26 → 52°F" x={960} y={420} size={170} col={ironCss(0.85)} edge="#5a3410" out={906.8} sub="ONE JANUARY MORNING" />);
    P(<Words key="nm" t={t} items={[{ at: 909.9, txt: "NOT MAGIC." }, { at: 911.0, txt: "NOT FREE ENERGY.", col: COL.red }]} out={912.9} y={880} size={84} />);
    P(<Words key="fd" t={t} items={[{ at: 913.1, txt: "FIRE DONE RIGHT", col: COL.amber }, { at: 915.0, txt: "+ AN ALARM ON THE WALL" }]} out={917.6} y={880} size={74} />);
    P(<NextCard key="nx2" t={t} at={918.0} subAt={921.5} out={931.4} title="NEXT: 9 DAYS WITHOUT POWER">
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.amber, padding: "70px 24px 24px", textShadow: extrude(4, "#000") }}>WHAT I BURNED EVERY DAY<br /><span style={{ color: COL.ink, fontSize: 30 }}>AND WHAT DIDN'T WORK AT ALL</span></div>
    </NextCard>);
    P(<Words key="q" t={t} items={[{ at: 931.8, txt: "HOW COLD IS YOUR SHOP" }, { at: 933.6, txt: "ON A WINTER MORNING?", col: COL.ice }]} out={941.6} y={820} size={80} />);
    return L;
  },
});

export const Rest: React.FC = () => <rest.Body />;
export const FULL_FRAMES = rest.FRAMES;
