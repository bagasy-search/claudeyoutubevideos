// duane01 · RESTO (63,77 s → final) con el motor del kit: UNA base por frase (avatar / toma agnes / el mundo 3D del taller),
// transiciones solamente, piezas 2.5D en su capa, todo anclado con at("frase"). El mundo es el mismo de Min1 (shop3d)
// con su propia cámara por tramo (KF) y su estado (fx) por tiempo. Nunca dos mundos juntos en una transición.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ShopWorld, PT, screenOf, camSpeed, Key, FX, ironCss } from "./shop3d";
import { BigNum, Bulb, COL, Card3D, Chips, DrawX, Flash, FONT, Tag, Thermo, e, extrude, spr, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp } from "../kits/yanqui3d/engine";
import { CheckList, ColdBattery, Mistake, MistakesDeal, NextCard, StepTitle, TempChart, TimeBars, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { MIN1_END } from "./Min1";

setSlug("duane01");
export const TEND = 542.4;
const HAS = AVAIL as { clips: string[]; imgs: string[] };

// ---------- cámara del mundo en el resto: un tramo por segmento (lo oculto interpola donde nadie lo ve) ----------
const KF: Key[] = [
  // W1 · "nothing makes heat out of nothing": el taller de día, el sol carga los tambores, cae la noche y los devuelven
  { t: 69.8, p: [3.2, 4.6, 9.5], l: [2.6, 1.0, -1.2], fov: 42 },
  { t: 74.5, p: [2.6, 2.4, 5.0], l: [2.1, 0.9, -2.2], fov: 42 },
  { t: 80.9, p: [1.7, 1.7, 2.6], l: [2.0, 0.8, -2.5], fov: 42 },
  // W2 · la maceta en el banco (la prueba)
  { t: 110.9, p: [5.35, 1.5, 1.35], l: [6.25, 1.1, 0.15], fov: 34 },
  { t: 116.9, p: [5.7, 1.34, 0.85], l: [6.25, 1.1, 0.15], fov: 32 },
  { t: 120.2, p: [5.5, 1.45, 1.05], l: [6.25, 1.1, 0.15], fov: 33 },
  { t: 130.7, p: [5.85, 1.3, 0.62], l: [6.25, 1.1, 0.15], fov: 29 },
  // W3 · "four old drums… behind the south window"
  { t: 141.6, p: [-0.4, 2.7, 3.4], l: [2.0, 0.8, -2.5], fov: 44 },
  { t: 147.7, p: [2.0, 1.45, 0.5], l: [2.05, 0.95, -2.6], fov: 40 },
  // W4 · afuera, del lado sur: el sol bajo de enero pega de frente en la ventana
  { t: 157.0, p: [2.05, 1.2, 2.2], l: [2.05, 1.9, -2.9], fov: 46 },
  { t: 163.5, p: [2.05, 1.35, 0.6], l: [2.05, 1.85, -2.9], fov: 46 },
  // W5 · adentro: la luz entra casi plana y llega hasta el fondo
  { t: 169.4, p: [4.6, 2.5, 2.7], l: [2.0, 0.4, -1.6], fov: 44 },
  { t: 180.7, p: [3.1, 1.6, 0.6], l: [2.0, 0.7, -2.4], fov: 42 },
  // W6 · costado del último tambor: el hueco de 2" contra la pared y el aire caliente que sube y rueda
  { t: 204.6, p: [3.95, 1.25, -1.55], l: [3.06, 0.85, -2.75], fov: 36 },
  { t: 208.9, p: [4.05, 1.4, -1.35], l: [3.06, 1.0, -2.75], fov: 36 },
  { t: 212.9, p: [4.2, 2.0, 0.9], l: [2.3, 1.7, -2.2], fov: 46 },
  { t: 215.95, p: [3.4, 2.5, 1.8], l: [2.2, 1.6, -2.0], fov: 46 },
  // W7 · el piso de concreto: un sumidero de frío (también Mistake 2)
  { t: 220.7, p: [2.6, 0.75, 0.6], l: [2.0, 0.15, -2.4], fov: 42 },
  { t: 231.6, p: [2.2, 0.55, -0.6], l: [2.0, 0.2, -2.45], fov: 40 },
  // W8 · de noche el vidrio devuelve el calor (también Mistake 3)
  { t: 241.0, p: [2.05, 2.0, 2.2], l: [2.05, 1.6, -2.9], fov: 46 },
  { t: 248.4, p: [2.05, 1.8, 0.9], l: [2.05, 1.65, -2.9], fov: 44 },
  // W9 · los números: el día carga, la noche descarga
  { t: 267.3, p: [2.05, 2.2, 3.4], l: [2.05, 0.8, -2.5], fov: 44 },
  { t: 280.1, p: [2.05, 1.6, 1.4], l: [2.05, 0.8, -2.5], fov: 42 },
  // W10 · noche de tormenta: los dos garajes, antes y después
  { t: 297.8, p: [-2.2, 9.5, 17], l: [-2.2, 1.0, 0], fov: 44 },
  { t: 308.2, p: [-2.2, 6.0, 12], l: [-2.2, 1.0, 0], fov: 44 },
  // W11 · mirá dónde cae la mancha de sol en el piso
  { t: 317.6, p: [2.8, 3.4, 2.8], l: [2.0, 0.2, -1.6], fov: 46 },
  { t: 326.5, p: [2.5, 3.1, 2.3], l: [2.0, 0.2, -1.7], fov: 46 },
  { t: 329.8, p: [4.6, 2.6, 2.2], l: [2.2, 0.3, -1.8], fov: 46 },
  { t: 340.3, p: [3.0, 2.0, 1.2], l: [2.0, 0.5, -2.2], fov: 44 },
  { t: 346.2, p: [3.2, 2.2, 1.6], l: [2.0, 0.5, -2.2], fov: 44 },
  { t: 351.0, p: [2.8, 1.9, 0.9], l: [2.0, 0.5, -2.3], fov: 42 },
  // W13 · el termómetro pegado al tambor: 62 °F a las 6 AM
  { t: 370.8, p: [1.85, 1.2, -0.9], l: [1.25, 0.75, -2.26], fov: 36 },
  { t: 376.0, p: [1.6, 1.0, -1.4], l: [1.25, 0.75, -2.26], fov: 32 },
  // W14/W15 · el quemador en la caja de ladrillos
  { t: 385.9, p: [5.3, 1.55, 0.7], l: [6.2, 1.1, -0.25], fov: 34 },
  { t: 391.9, p: [5.55, 1.4, 0.35], l: [6.2, 1.1, -0.25], fov: 32 },
  { t: 398.9, p: [5.45, 1.45, 0.45], l: [6.2, 1.1, -0.25], fov: 32 },
  { t: 404.9, p: [5.7, 1.32, 0.15], l: [6.2, 1.1, -0.25], fov: 30 },
  // W16 · la alarma de CO al lado del banco
  { t: 416.2, p: [5.4, 1.75, 0.9], l: [6.9, 1.7, -0.3], fov: 36 },
  { t: 427.4, p: [6.2, 1.72, 0.3], l: [6.92, 1.72, -0.15], fov: 30 },
  // W18 · afuera de noche, los errores
  { t: 448.5, p: [-14, 4.2, 14.5], l: [-3.5, 1.2, 0], fov: 42 },
  { t: 460.9, p: [-9.5, 3.0, 10], l: [-3.5, 1.2, 0], fov: 42 },
  // W19 · Mistake 2: el concreto
  { t: 470.0, p: [2.6, 0.75, 0.6], l: [2.0, 0.15, -2.4], fov: 42 },
  { t: 476.6, p: [2.2, 0.6, -0.4], l: [2.0, 0.2, -2.45], fov: 40 },
  // W20 · Mistake 3 (noche, vidrio) → Mistake 4 (de día, el sol es gratis)
  { t: 481.2, p: [2.05, 2.0, 2.2], l: [2.05, 1.6, -2.9], fov: 46 },
  { t: 486.0, p: [2.05, 1.85, 1.2], l: [2.05, 1.6, -2.9], fov: 44 },
  { t: 486.1, p: [2.05, 2.3, 3.3], l: [2.05, 1.1, -2.5], fov: 44 },
  { t: 493.5, p: [2.05, 1.7, 1.6], l: [2.05, 0.9, -2.5], fov: 42 },
  // W21 · una batería de calor que el sol carga
  { t: 498.1, p: [0.4, 2.7, 3.6], l: [2.05, 0.8, -2.5], fov: 44 },
  { t: 505.0, p: [1.0, 2.0, 2.0], l: [2.05, 0.8, -2.5], fov: 42 },
  // W22 · los dos garajes en térmica: uno se congela, el otro pasa la noche
  { t: 515.8, p: [-2.2, 8.5, 15.5], l: [-2.2, 1.0, 0], fov: 44 },
  { t: 526.3, p: [-2.2, 5.0, 10.5], l: [-2.2, 1.0, 0], fov: 44 },
];

// ---------- estado del mundo por tiempo ----------
const fx = (t: number): Partial<FX> => {
  if (t < 90) { // W1: día → noche; el sol carga, la noche descarga con la frazada bajada
    const n = e(t, 75.2, 78.6);
    return { day: 1 - n, heat: e(t, 72.6, 73.4), charge: 0.35 + 0.65 * e(t, 73.4, 75.2) - 0.35 * e(t, 78.6, 80.8), blanket: e(t, 77.0, 78.2), flow: e(t, 78.6, 79.6), shopTemp: 30 };
  }
  if (t < 135) return { day: 0.35, pot: 1, heat: t < 118 ? e(t, 113.4, 114.0) : e(t, 121.6, 122.2), shopTemp: 30, charge: 0.4 };
  if (t < 150) return { day: 1, heat: 0, charge: 0.6 };
  if (t < 186) return { day: 1, heat: 0, charge: 0.7 };
  if (t < 218) return { day: 0.9, heat: t < 212.5 ? e(t, 206.2, 206.8) * 0.7 : 1, flow: t < 212.5 ? e(t, 206.4, 207.2) : 1, charge: 0.9, shopTemp: 34 };
  if (t < 240) return { day: 0.3, heat: e(t, 221.6, 222.3), charge: 0.85, shopTemp: 30 };
  if (t < 260) return { day: 0, heat: e(t, 242.0, 242.8), charge: 0.8, blanket: 0, shopTemp: 34, out: -10 };
  if (t < 290) { const n = e(t, 274.4, 278.0); return { day: 1 - n, heat: e(t, 268.2, 268.9), charge: 0.45 + 0.55 * e(t, 268.9, 272.6) - 0.45 * n, blanket: n, flow: n, shopTemp: 32 }; }
  if (t < 312) return { day: 0.05, storm: 0.7, heat: e(t, 299.5, 300.2), nbTemp: -4, shopTemp: 18 + 22 * e(t, 307.0, 307.9), charge: 0.7 * e(t, 307.0, 307.9), blanket: 1 };
  if (t < 356) { const two = t > 336.5 && t < 340.4; return { day: 1, heat: t < 330 ? e(t, 321.0, 321.7) * 0.85 : 0.85, drums: two ? 2 : 4, charge: 0.8, shopTemp: 30 }; }
  if (t < 380) return { day: 0.35, heat: 0, shopTemp: 62, blanket: 0 };
  if (t < 410) { const off = e(t, 401.4, 402.0); return { day: 0.2, flame: t < 398 ? 1 : 1 - off, brick: t < 398 ? 0.4 : 1, heat: t < 398 ? 0 : e(t, 399.6, 400.2), shopTemp: 38, charge: 0.4 }; }
  if (t < 430) return { day: 0.25, alarm: t > 420.0 && t < 423.5 ? (Math.sin(t * 12) > 0 ? 1 : 0.2) : 0, shopTemp: 40 };
  if (t < 466) return { day: 0.03, storm: 0.8, heat: 0, frost: 1 };
  if (t < 480) return { day: 0.3, heat: e(t, 471.2, 471.9), charge: 0.85, shopTemp: 30 };
  if (t < 486.05) return { day: 0, heat: e(t, 481.6, 482.2), charge: 0.8, blanket: 0, shopTemp: 34, out: -10 };
  if (t < 495) return { day: 1, heat: e(t, 488.4, 489.1), charge: 0.5 + 0.5 * e(t, 489.1, 492.0), shopTemp: 28 };
  if (t < 512) { const cyc = 0.5 + 0.5 * Math.sin((t - 498.2) * 1.6); return { day: cyc, heat: 1, charge: 0.4 + 0.55 * cyc, blanket: 1 - cyc, flow: 1 - cyc, shopTemp: 32 }; }
  return { day: 0.03, storm: 0.6, heat: e(t, 516.6, 517.3), nbTemp: -10, shopTemp: 40, charge: 0.75, blanket: 1, frost: 1 };
};
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t, KF), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbR" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><ShopWorld t={t} KF={KF} fx={fx} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const sc = (t: number, q: [number, number, number]) => screenOf(t, q, KF);
const W = (a: number, tr: "zoom" | "portal" | "whip" | "whipL" | "push" | "light" | "flip" = "zoom", p?: [number, number]) => ({ a, tr, p, r: (t: number) => <World t={t} /> });

// escala térmica a la derecha mientras el mundo está en visión térmica
const Scale: React.FC<{ t: number; spans: [number, number][] }> = ({ t, spans }) => {
  const o = spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.4) * (1 - e(t, b - 0.4, b))), 0);
  if (o < 0.01) return null;
  return <div style={{ position: "absolute", right: 60, top: 220, opacity: o, fontFamily: FONT, fontWeight: 800, color: COL.ink, fontSize: 24, textAlign: "center" }}>
    <div>90°F</div><div style={{ width: 34, height: 420, margin: "8px auto", borderRadius: 17, border: "3px solid rgba(255,255,255,.8)", background: `linear-gradient(0deg, ${[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((u) => ironCss(u)).join(",")})` }} /><div>−15°F</div></div>;
};
// tarjeta con foto/toma que entra girando sobre el avatar
const Pop: React.FC<{ t: number; id: string; at: number; out: number; side?: "L" | "R"; label?: string; col?: string }> = ({ t, id, at, out, side = "R", label, col = COL.ink }) => {
  const k = Math.min(1, spr(t, at, 0.8)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sg = side === "R" ? 1 : -1;
  return <Card3D id={id} x={side === "R" ? 1010 : 190} y={200} w={720} h={405} ry={sg * ((1 - k) * 60 + 10)} rx={4} z={(1 - k) * -1300} o={o} label={label} labelCol={col} />;
};
const img = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

export const rest = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: MIN1_END, TEND, flashAtStart: false,
  beats: ({ AV, CL, at }) => [
    AV(63.77, "cut", { spans: [[66.2, 69.6]] }),
    W(69.87, "zoom"),
    AV(80.84, "portal", { spans: [[83.0, 86.7]], edge: true }),
    CL(86.85, "s02", "whip", undefined, [1.04, 1.13]),
    CL(at("A brick", 94) - 0.15, "s03", "push"),
    AV(99.68, "whip", { spans: [[101.6, 105.0]] }),
    CL(105.21, "s04", "portal", [960, 620]),
    W(at("Four tea", 110) - 0.1, "zoom"),
    AV(116.81, "whip", { spans: [[117.4, 120.1]] }),
    W(120.25, "zoom"),
    CL(at("It just spreads", 124) - 0.1, "e01", "push"),
    AV(130.64, "whipL", { spans: [[131.0, 134.9]] }),
    CL(135.08, "s05", "push"),
    CL(at("So what do I", 137) - 0.1, "s06", "whip"),
    W(at("Four old", 140) - 0.1, "portal", [960, 700]),
    AV(147.65, "whipL"),
    CL(150.94, "s07", "light"),
    W(at("It has to face", 155) - 0.1, "whip"),
    AV(163.47, "whipL", { spans: [[163.6, 169.3]], edge: true }),
    W(169.45, "zoom"),
    CL(at("An east", 172) - 0.1, "e02", "light"),
    AV(180.67, "whip", { spans: [[182.8, 186.4]] }),
    CL(186.5, "s09", "whip"),
    CL(at("Paint the outside", 189) - 0.1, "s10", "push"),
    AV(199.36, "whip", { spans: [[199.4, 204.5]] }),
    W(204.65, "zoom"),
    CL(at("Stand them", 207) - 0.1, "s12", "push"),
    W(at("so warm air", 211) - 0.1, "zoom"),
    AV(215.91, "whip", { spans: [[216.0, 220.6]], edge: true }),
    W(220.79, "zoom"),
    CL(at("If your drums", 226) - 0.1, "e03", "push"),
    AV(231.58, "zoom", { spans: [[232.4, 236.5]] }),
    CL(236.68, "s14", "whip"),
    W(at("Step 4", 240) - 0.2, "light"),
    AV(248.31, "whipL", { spans: [[249.5, 253.2]] }),
    CL(253.35, "s15", "whip"),
    CL(at("In the morning", 258) - 0.1, "s16", "light"),
    AV(264.11, "whip"),
    CL(267.41, "e04", "whip"),
    W(at("85", 270) - 0.7, "zoom"),
    AV(280.03, "whip", { spans: [[280.3, 283.8]] }),
    CL(283.87, "s18", "whip"),
    AV(294.6, "whipL"),
    CL(297.92, "e05", "whipL"),
    W(at("Before the drums", 300) - 0.1, "zoom"),
    AV(308.14, "whipL", { spans: [[309.6, 313.9]] }),
    CL(314.08, "s19", "whip"),
    W(at("How many drums", 316) - 0.1, "zoom"),
    AV(326.42, "whip"),
    W(329.85, "zoom"),
    CL(at("I started with two", 336) - 0.1, "e06", "push"),
    AV(340.29, "whip", { spans: [[341.0, 346.0]] }),
    W(346.23, "zoom"),
    CL(at("Last February", 348) - 0.1, "s21", "push"),
    AV(358.37, "whip", { spans: [[359.0, 364.5]] }),
    CL(364.68, "d_drums", "whip"),
    W(at("until he read", 369) - 0.1, "portal", [960, 640]),
    AV(375.95, "whipL", { spans: [[376.0, 378.3]] }),
    CL(381.29, "s30", "push"),
    W(at("So I keep", 384) - 0.1, "zoom"),
    AV(391.89, "whip", { spans: [[392.4, 396.2]] }),
    CL(396.33, "s22", "whip"),
    W(at("The bricks soak", 398) - 0.1, "portal", [960, 560]),
    CL(at("enough to work", 403) - 0.1, "s23", "push"),
    AV(410.61, "whip", { spans: [[410.7, 416.2]], edge: true }),
    W(416.31, "zoom"),
    AV(427.4, "whip", { spans: [[427.5, 432.6]] }),
    CL(432.74, "s26", "whip"),
    CL(at("Nothing ever goes", 436) - 0.1, "s27", "whipL"),
    CL(at("And three things", 439) - 0.1, "s28", "push"),
    AV(443.87, "whip", { spans: [[443.9, 448.5]], edge: true }),
    W(448.64, "zoom"),
    CL(at("Let me give you", 451) - 0.1, "e07", "push"),
    AV(460.88, "whip", { spans: [[460.9, 464.8]] }),
    CL(464.89, "s29", "whip"),
    W(at("Mistake 2", 469) - 0.15, "zoom"),
    AV(476.51, "whip", { spans: [[476.6, 481.2]] }),
    W(481.31, "zoom"),
    CL(at("Mistake 4", 485) - 0.15, "e08", "light"),
    AV(493.49, "whip", { spans: [[493.5, 498.1]] }),
    W(498.23, "zoom"),
    CL(at("it costs you", 503) - 0.1, "s33", "push"),
    AV(510.64, "whip", { spans: [[510.7, 515.8]] }),
    W(515.92, "zoom"),
    CL(at("your water", 517) - 0.1, "e09", "push"),
    AV(526.24, "whip", { spans: [[526.3, 529.5]] }),
    CL(529.63, "s32", "whip"),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const P = (n: React.ReactNode) => L.push(n);
    const pt = (q: [number, number, number]) => sc(t, q);
    P(<Scale key="sc" t={t} spans={[[73.0, 80.84], [113.6, 116.81], [121.8, at("It just spreads", 124) - 0.1], [206.4, 215.91], [221.8, at("If your drums", 226) - 0.1], [242.2, 248.31], [at("85", 270) - 0.2, 280.03], [at("Before the drums", 300) + 0.4, 308.14], [321.4, 326.42], [329.85, at("I started with two", 336) - 0.1], [346.23, at("Last February", 348) - 0.1], [399.8, at("enough to work", 403) - 0.1], [471.5, 476.51], [481.8, at("Mistake 4", 485) - 0.15], [498.23, at("it costs you", 503) - 0.1], [517.0, at("your water", 517) - 0.1]]} />);

    // ---- thermal mass ----
    P(<Words key="np" t={t} items={[{ at: at("Not a pot", 69) , txt: "NOT A POT" }, { at: at("not a brick", 70), txt: "NOT A BRICK" }, { at: at("not a barrel", 71), txt: "NOT A BARREL", col: COL.amber }]} out={72.7} y={880} size={78} />);
    if (t > 73 && t < 81) { const d = pt(PT.drums); P(<Tag key="cf" t={t} at={at("catch heat", 72)} x={d.x} y={d.y} dx={-260} dy={-180} text="CATCH IT WHEN IT'S FREE" col={ironCss(0.85)} out={76.2} />);
      P(<Tag key="hn" t={t} at={at("until the night", 75)} x={d.x} y={d.y} dx={240} dy={-200} text="GIVE IT BACK AT NIGHT" col={ironCss(0.7)} out={78.6} />); }
    P(<Stamp key="tm" t={t} at={at("thermal mass", 78)} text="THERMAL MASS" x={960} y={200} out={80.6} rot={-5} size={96} />);
    P(<BigNum key="wa" t={t} at={at("water", 84)} text="WATER" x={960} y={330} size={210} col={COL.ice} edge="#123a5a" out={86.6} sub="THE CHEAPEST THING ON EARTH" />);
    P(<BigNum key="lb" t={t} at={at("eight pounds", 88)} text="8.34 LB" x={1350} y={360} size={200} col={COL.ink} out={at("A brick", 94) - 0.4} sub="ONE GALLON" />);
    P(<Chips key="bt" t={t} at={at("Every pound", 90)} items={["1 LB OF WATER", "−1°F", "= 1 BTU"]} out={at("A brick", 94) - 0.4} y={860} />);
    P(<Versus key="vs" t={t} at={at("A brick", 94) + 0.2} out={99.5} title="HEAT HELD, POUND FOR POUND" L={{ label: "WATER", val: "1 BTU", h: 1, col: COL.ice }} R={{ label: "BRICK", val: "≈ 0.2 BTU", h: 0.2, col: "#c97a4a" }} />);
    P(<Chips key="ai" t={t} at={at("Air holds", 97)} items={["AIR ≈ NOTHING"]} out={99.5} y={930} />);
    P(<BigNum key="460" t={t} at={at("460", 101)} text="460 LB" x={1380} y={380} size={210} col={COL.amber} edge="#5a3410" out={104.9} sub="OF STORED HEAT · 1 DRUM" />);

    // ---- la maceta ----
    P(<Stamp key="tt" t={t} at={at("I tested it", 106)} text="I TESTED IT" x={1400} y={220} out={110.5} rot={-6} size={84} />);
    if (t > 110 && t < 131) { const p = pt(PT.pot);
      P(<Tag key="pg" t={t} at={at("gets hot", 112)} x={p.x} y={p.y} dx={-280} dy={-170} text="THE POT GETS HOT" col={ironCss(0.85)} out={116.5} />);
      P(<Tag key="pb" t={t} at={at("single BTU", 123)} x={p.x} y={p.y} dx={260} dy={-190} text="+0 BTU FROM THE CLAY" col={COL.red} out={at("It just spreads", 124) - 0.3} />);
    }
    P(<Chips key="ps" t={t} at={at("spreads", 125) + 0.3} items={["SAME HEAT", "JUST SLOWER"]} out={130.4} y={880} />);
    P(<Bulb key="bu" t={t} at={at("light bulbs", 120)} off={1e9} out={124.4} x={1500} y={430} />);
    P(<Words key="15" t={t} items={[{ at: at("one and a half", 120) , txt: "≈ 1.5 OLD BULBS", col: COL.amber }]} out={124.4} y={900} size={86} />);
    P(<Chips key="so" t={t} at={at("soot", 130)} items={["SOOT", "CARBON MONOXIDE"]} out={134.9} y={860} />);
    P(<Stamp key="de" t={t} at={at("decoration", 135)} text="A DECORATION" x={960} y={760} out={137.8} rot={-7} size={100} />);
    // ---- los tambores ----
    if (t > 141 && t < 148) { const d = pt(PT.drums), w = pt(PT.window);
      P(<Tag key="d4" t={t} at={at("Four old", 140) + 0.4} x={d.x} y={d.y} dx={-260} dy={-200} text="4 × 55 GALLONS" sub="OF WATER" col={COL.ice2} out={147.5} size={60} />);
      P(<Tag key="fb" t={t} at={at("flat black", 143)} x={d.x} y={d.y + 60} dx={250} dy={120} text="FLAT BLACK" col={COL.ink} out={147.5} />);
      P(<Tag key="sw" t={t} at={at("south window", 145)} x={w.x} y={w.y} dx={240} dy={-120} text="SOUTH WINDOW" col="#ffd88a" out={147.5} />); }
    P(<Words key="sf" t={t} items={[{ at: at("The sun is the fuel", 149), txt: "THE SUN IS THE FUEL", col: "#ffd88a" }]} out={154.2} y={880} size={96} />);
    P(<StepTitle key="s1" t={t} at={at("Step 1", 154)} n={1} name="THE WINDOW" out={at("It has to face", 155) - 0.15} col="#ffd88a" />);
    if (t > 156 && t < 164) { const w = pt(PT.window); P(<Tag key="so2" t={t} at={at("south", 157) + 0.2} x={w.x} y={w.y} dx={-240} dy={-160} text="FACES SOUTH" sub="LOW WINTER SUN" col="#ffd88a" out={163.3} size={60} />); }
    P(<TimeBars key="tb" t={t} rows={[{ at: at("An east", 172), label: "EAST / WEST", val: "2 HRS", frac: 0.25, col: COL.ice }, { at: at("A south window gets", 175), label: "SOUTH", val: "ALL DAY", frac: 1, col: "#ffd88a" }]} out={180.5} />);
    P(<Pop key="pc" t={t} id={img("s08")} at={at("polycarbonate", 183) - 0.6} out={186.4} label="CLEAR POLYCARBONATE" />);
    // ---- paso 2 ----
    P(<StepTitle key="s2" t={t} at={186.6} n={2} name="THE DRUMS" out={188.6} col={COL.amber} />);
    P(<Chips key="cl" t={t} at={at("never held", 188)} items={["CLEAN", "NO CHEMICALS"]} out={at("Paint the outside", 189) - 0.1} y={860} />);
    P(<Versus key="fg" t={t} at={at("not glossy", 191)} out={at("Fill them", 195) - 0.2} title="SOAKS UP LIGHT" L={{ label: "FLAT BLACK", val: "MOST", h: 0.95, col: "#3c3c3c", mark: "ok" }} R={{ label: "GLOSSY", val: "LESS", h: 0.55, col: "#8a8a8a", mark: "x" }} />);
    P(<BigNum key="4in" t={t} at={at("4 inches", 196)} text={'4"'} x={1450} y={380} size={240} col={COL.ice} edge="#123a5a" out={199.2} sub="OF AIR AT THE TOP" />);
    P(<Pop key="hs" t={t} id={img("s11")} at={199.5} out={204.4} side="R" label={'LEAVE 4" OF AIR'} col={COL.ice2} />);
    P(<Chips key="fr" t={t} at={at("Water grows", 200)} items={["WATER GROWS", "WHEN IT FREEZES"]} out={204.5} y={860} />);
    if (t > 204.6 && t < 216) { const g = pt(PT.gap);
      P(<Tag key="sp" t={t} at={205.3} x={g.x} y={g.y} dx={-260} dy={-170} text="SAVES THE SEAM" col={COL.ice2} out={at("Stand them", 207) - 0.2} />);
      P(<Tag key="rr" t={t} at={at("roll out", 212) - 0.3} x={g.x} y={g.y - 150} dx={-260} dy={-90} text="WARM AIR RISES & ROLLS" col={ironCss(0.82)} out={214.2} />); }
    P(<BigNum key="2in" t={t} at={at("2 inches", 209)} text={'2"'} x={1450} y={380} size={240} col={COL.amber} edge="#5a3410" out={at("roll out", 212) - 0.7} sub="OFF THE WALL" />);
    P(<StepTitle key="s3" t={t} at={at("Step 3", 213)} n={3} name="OFF THE CONCRETE" out={216.6} col={COL.ice} />);
    P(<Stamp key="ev" t={t} at={at("everybody skips", 217)} text="EVERYBODY SKIPS IT" x={960} y={200} out={220.6} rot={-5} size={80} />);
    if (t > 220.7 && t < 231.6) { const f = pt([2.0, 0.12, -1.6]);
      P(<Tag key="cs" t={t} at={at("cold sink", 222)} x={f.x} y={f.y} dx={-240} dy={-180} text="A GIANT COLD SINK" col={ironCss(0.15)} out={226.6} size={60} />);
    }
    P(<Words key="dn" t={t} items={[{ at: at("straight down", 227), txt: "HEAT → INTO THE GROUND", col: COL.red }]} out={231.4} y={880} size={84} />);
    P(<Pop key="fo" t={t} id={img("s13")} at={at("foam board", 232) - 0.3} out={236.5} side="R" label={'2" FOAM + A PALLET'} col="#ff9ac0" />);
    P(<StepTitle key="s4" t={t} at={at("Step 4", 240)} n={4} name="THE NIGHT BLANKET" out={242.6} col="#7aa7ff" />);
    if (t > 242 && t < 248.4) { const w = pt(PT.window); P(<Tag key="lk" t={t} at={at("right back out", 245)} x={w.x} y={w.y} dx={260} dy={-120} text="GLASS LEAKS IT BACK" col={COL.ice} out={248.1} />); }
    P(<Chips key="hk" t={t} at={at("Two hooks", 253)} items={["2 HOOKS", "A BROOM HANDLE"]} out={258.6} y={860} />);
    P(<Versus key="bl" t={t} at={at("bigger difference", 261)} out={264.0} title="WHAT HELPED MORE" L={{ label: "1 BLANKET", val: "MORE", h: 0.95, col: "#5b86d6", mark: "ok" }} R={{ label: "A 5TH DRUM", val: "LESS", h: 0.6, col: "#444" }} />);
    // ---- números ----
    P(<Stamp key="nu" t={t} at={at("Now the numbers", 264)} text="THE NUMBERS" x={960} y={200} out={267.3} rot={-5} size={90} />);
    P(<TempChart key="tc" t={t} at={at("On a clear", 268)} pts={[{ at: at("85", 270), v: 85, lab: "DAY" }, { at: at("near 60", 274), v: 60, lab: "MORNING" }]} out={279.8} title="MY DRUMS" lo={40} step={9} limit={60} />);
    P(<Words key="mx" t={t} items={[{ at: at("25 degrees", 276), txt: "25°F" }, { at: at("times 4 drums", 277), txt: "× 4 DRUMS" }, { at: at("times 460", 279), txt: "× 460 LB", col: COL.amber }]} out={281.6} y={900} size={80} />);
    P(<BigNum key="46k" t={t} at={at("46,000", 281)} text="46,000 BTU" x={960} y={400} size={170} col={COL.amber} edge="#5a3410" out={286.3} sub="BACK INTO MY GARAGE · EVERY NIGHT" />);
    P(<Versus key="hv" t={t} at={at("space heater", 287) - 0.9} out={294.4} title="SAME HEAT" L={{ label: "1500 W HEATER · 9 HRS", val: "46,000 BTU", h: 0.9, col: "#c9c9c9" }} R={{ label: "4 DRUMS · 1 NIGHT", val: "46,000 BTU", h: 0.9, col: COL.amber, mark: "ok" }} />);
    P(<Stamp key="np2" t={t} at={at("without plugging", 291)} text="NOTHING PLUGGED IN" x={960} y={180} out={294.4} rot={-4} size={74} />);
    P(<Words key="ab" t={t} items={[{ at: at("above freezing", 298), txt: "ABOVE FREEZING", col: COL.amber }]} out={302.0} y={880} size={92} />);
    P(<Versus key="ba" t={t} at={at("Before the drums", 302)} out={313.8} title="ON A 0°F NIGHT" L={{ label: "BEFORE", val: "18°F", h: 0.35, col: ironCss(0.3), mark: "x" }} R={{ label: "WITH DRUMS", val: "40°F", h: 0.8, col: ironCss(0.75), mark: "ok" }} />);
    P(<Pop key="pp" t={t} id={img("s20")} at={at("Pipes", 310) - 0.2} out={315.0} side="L" label="PIPES · BATTERIES · PAINT" col={COL.ice2} />);
    // ---- cuántos tambores ----
    if (t > 317 && t < 352) { const f = pt([2.05, 0.12, -1.2]), d = pt(PT.drum0);
      P(<Tag key="sh" t={t} at={at("where the sun", 322)} x={f.x} y={f.y} dx={260} dy={-120} text="WHERE THE SUN HITS" col="#ffd88a" out={326.3} />);
      P(<Tag key="cd" t={t} at={at("in the shadow", 327) } x={d.x} y={d.y} dx={-260} dy={-150} text="A DRUM IN SHADOW = A COLD DRUM" col={COL.ice} out={332.4} />);
      P(<Tag key="pl" t={t} at={at("patch of light", 333)} x={f.x} y={f.y} dx={260} dy={-140} text="YOUR WATER GOES HERE" col="#ffd88a" out={336.4} />);
      P(<Chips key="24" t={t} at={at("I started with two", 336)} items={["START: 2 DRUMS", "NEXT FALL: +2"]} out={340.2} y={880} />);
      P(<Chips key="jg" t={t} at={at("plastic jugs", 342) - 0.2} items={["6-GALLON JUGS", "IN THE SUN", "= LESS, BUT IT WORKS"]} out={350.4} y={880} />); }
    // ---- la historia de febrero ----
    P(<BigNum key="12" t={t} at={at("12 below", 353)} text="−12°F" x={1400} y={380} size={220} col={COL.ice} edge="#123a5a" out={358.2} sub="3 DAYS · NO POWER" />);
    P(<Stamp key="fz" t={t} at={at("frozen and split", 360)} text="HIS PIPE SPLIT" x={960} y={760} out={364.5} rot={-6} size={86} />);
    P(<Words key="wr" t={t} items={[{ at: at("what I was running", 366), txt: "\"WHAT ARE YOU RUNNING?\"" }]} out={368.6} y={880} size={74} />);
    P(<Words key="fb2" t={t} items={[{ at: at("four black barrels", 368), txt: "4 BLACK BARRELS", col: COL.amber }]} out={370.6} y={760} size={96} />);
    P(<BigNum key="62" t={t} at={at("62", 373)} text="62°F" x={1380} y={380} size={250} col={COL.amber} edge="#5a3410" out={378.2} sub="6 AM · −12°F OUTSIDE" />);
    // ---- el respaldo ----
    P(<Words key="5d" t={t} items={[{ at: at("five days", 382), txt: "5 DAYS · NO SUN", col: COL.ice }]} out={385.8} y={880} size={96} />);
    if (t > 385 && t < 410) { const b = pt(PT.burner);
      P(<Tag key="bk" t={t} at={at("So I keep", 384) + 0.3} x={b.x} y={b.y} dx={-260} dy={-170} text="THE BACKUP" col={COL.amber} out={388.0} />);
      P(<Tag key="ab2" t={t} at={at("alcohol burner", 387)} x={b.x} y={b.y} dx={-280} dy={-170} text="SMALL ALCOHOL BURNER" sub="CAMPING KIND" col={COL.ice2} out={391.7} />);
      P(<Tag key="br" t={t} at={at("The bricks soak", 398) + 0.4} x={b.x} y={b.y} dx={300} dy={-170} text="FIREBRICKS HOLD THE HEAT" col={ironCss(0.85)} out={401.4} />);
      P(<Tag key="fo2" t={t} at={at("flame goes out", 400)} x={b.x} y={b.y} dx={260} dy={-200} text="…AND GIVE IT BACK" sub="AFTER THE FLAME IS OUT" col={ironCss(0.7)} out={404.6} />); }
    P(<Stamp key="nf" t={t} at={at("not a furnace", 407)} text="NOT A FURNACE" x={960} y={760} out={410.4} rot={-6} size={100} />);
    // ---- las reglas ----
    P(<Stamp key="ru" t={t} at={at("my rules", 410)} text="MY RULES · NO EXCEPTIONS" x={960} y={180} out={413.0} rot={-4} size={76} />);
    P(<Chips key="co" t={t} at={at("carbon monoxide", 413)} items={["FLAME INDOORS", "→ CARBON MONOXIDE"]} out={416.2} y={880} />);
    if (t > 416 && t < 427.5) { const c = pt(PT.co);
      P(<Tag key="iv" t={t} at={at("cannot", 416)} x={c.x} y={c.y} dx={-300} dy={-150} text="YOU CAN'T SEE IT OR SMELL IT" col={COL.red} out={419.2} />);
      P(<Tag key="al" t={t} at={at("battery carbon monoxide", 419)} x={c.x} y={c.y} dx={-300} dy={-160} text="BATTERY CO ALARM" sub="NEXT TO THE BENCH" col={COL.ink} out={423.9} size={60} />);
      P(<Tag key="mo" t={t} at={at("every month", 424)} x={c.x} y={c.y} dx={-300} dy={160} text="TESTED EVERY MONTH" col="#5ee38f" out={427.2} />); }
    P(<Pop key="dr" t={t} id={img("s25")} at={at("crack the side door", 427) - 0.2} out={432.6} side="L" label={'SIDE DOOR · 2" OPEN'} col={COL.ice2} />);
    P(<CheckList key="ck" t={t} title="WHEN ANYTHING BURNS" rows={[{ at: at("crack the side door", 427), txt: 'DOOR CRACKED 2"' }, { at: at("I never sleep", 432.5), txt: "NEVER SLEEP WITH A FLAME" }, { at: at("never leave one", 435), txt: "NEVER LEAVE IT ALONE" }, { at: at("gas cans", 437), txt: "AWAY FROM GAS CANS & RAGS" }]} out={439.5} />);
    P(<CheckList key="nv" t={t} title="NEVER INSIDE A GARAGE" rows={[{ at: at("charcoal grill", 441), txt: "✗ CHARCOAL GRILL" }, { at: at("a generator", 443), txt: "✗ GENERATOR" }, { at: at("a car with", 444), txt: "✗ CAR, DOOR SHUT" }]} out={448.5} />);
    P(<Words key="km" t={t} items={[{ at: at("kill people", 447), txt: "THEY KILL PEOPLE EVERY WINTER", col: COL.red }]} out={450.6} y={880} size={70} />);
    P(<Stamp key="fm" t={t} at={at("a few minutes", 451)} text={'"JUST A FEW MINUTES"'} x={960} y={420} out={453.2} rot={-5} size={90} />);
    // ---- errores ----
    P(<MistakesDeal key="md" t={t} at={at("mistakes I see", 453)} out={at("Mistake 1", 458) - 0.1} n={4} />);
    P(<Mistake key="m1" t={t} at={at("Mistake 1", 458)} n={1} txt="FILLING TO THE BRIM" out={469.0} />);
    P(<Stamp key="lg" t={t} at={at("Leave the gap", 466)} text="LEAVE THE GAP" x={960} y={220} out={469.0} rot={-5} size={90} />);
    P(<Mistake key="m2" t={t} at={at("Mistake 2", 469)} n={2} txt="BARE CONCRETE" out={478.6} />);
    P(<Chips key="fp" t={t} at={at("Foam and a pallet", 475)} items={["FOAM", "+ A PALLET"]} out={478.6} y={160} />);
    P(<Mistake key="m3" t={t} at={at("Mistake 3", 478)} n={3} txt="NO NIGHT BLANKET" out={486.2} />);
    P(<Mistake key="m4" t={t} at={at("Mistake 4", 485)} n={4} txt={'"FREE HEAT, NO FUEL"'} out={493.3} />);
    P(<Words key="af" t={t} items={[{ at: at("always a fuel", 490), txt: "THERE'S ALWAYS A FUEL" }, { at: at("the sun is free", 492), txt: "THE SUN IS FREE", col: "#ffd88a" }]} out={495.0} y={200} size={84} />);
    // ---- cierre ----
    P(<Stamp key="nh" t={t} at={at("not a heater", 499)} text="NOT A HEATER YOU TURN ON" x={960} y={200} out={501.5} rot={-4} size={76} />);
    P(<ColdBattery key="hb" t={t} at={at("battery for heat", 501)} out={at("it costs you", 503) - 0.2} label="HEAT BATTERY" />);
    P(<CheckList key="kt" t={t} title="WHAT IT COSTS YOU" rows={[{ at: at("old drums", 505), txt: "SOME OLD DRUMS" }, { at: at("can of paint", 506), txt: "A CAN OF PAINT" }, { at: at("sheet", 507), txt: "A SHEET OF FOAM" }, { at: at("moving blanket", 509), txt: "A MOVING BLANKET" }]} out={510.5} />);
    if (t > 516 && t < 526.3) { const n = pt(PT.nb), s = pt(PT.shop);
      P(<Tag key="fs" t={t} at={516.6} x={n.x} y={n.y} dx={40} dy={-280} text="FREEZES SOLID" col={COL.ice} out={at("your water", 517) - 0.4} size={60} />);
      P(<Tag key="mt" t={t} at={516.9} x={s.x} y={s.y} dx={-40} dy={280} text="MAKES IT THROUGH" col={ironCss(0.75)} out={at("your water", 517) - 0.4} size={60} />); void n; }
    P(<Chips key="mo2" t={t} at={at("add another drum", 523)} items={["NEED MORE?", "+1 DRUM"]} out={526.0} y={900} />);
    P(<NextCard key="nx" t={t} at={at("If you want to see", 524) + 0.4} subAt={at("Stay warm", 534) - 0.6} out={541.6} title="NEXT: THE BRAKE ROTOR HEATER">
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.amber, padding: 24, textShadow: extrude(4, "#000") }}>2 OLD BRAKE ROTORS<br /><span style={{ color: COL.ink, fontSize: 30 }}>HOW MANY DEGREES IT REALLY ADDS</span></div>
    </NextCard>);
    void Thermo; void DrawX; void Flash;
    return L;
  },
});

export const Rest: React.FC = () => <rest.Body />;
export const FULL_FRAMES = rest.FRAMES;
