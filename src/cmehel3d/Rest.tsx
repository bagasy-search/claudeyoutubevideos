// cmehel3d · DEL 1:05 AL FINAL (65,6 → 1000,3 s). Misma vara que el minuto 1 (gary01 / cgordie1): UN mundo (la cuadra,
// la cocina y el auto de Claudio, casa3d.tsx) con UNA cámara que vuela tapada por el avatar o por las tomas; dentro de un
// mismo plano del mundo la cámara viaja (nunca dos mundos pegados). Las piezas 2.5D van en una capa aparte que cruza las
// transiciones, y CERO cortes secos. La estrella es el tester en la mano: las cifras salen siempre al lado, nunca encima.
// Todo anclado a la palabra con at("frase") sobre los tiempos reales de la voz (anclas.json). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, addKeys, bookPt, screenOf, Key } from "./casa3d";
import { World } from "./Min1";
import { at, Avatar, Take, Stamp, Lcd, Head, WINS } from "./lib";
import { BigNum, COL, DrawX, Flash, Portal, Receipt, Tag, Thermo, e, ei } from "../cme3d01/lib";
import { Versus, Words, CheckList, TimeBars } from "../cme3d01/comps2";
import { Eq, ErrCard, Paso } from "../cme3d01/rest_fx";
import { VoltChart, BlockStrip, Notebook, DescCard, Regla, Trato, Ask, Subscribe } from "./rest_fx";
import ANC from "./anclas.json";

export const T0 = 65.6, TEND = 1000.3;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------- anclas (segundo exacto de cada frase) ----------
const A = Object.fromEntries(Object.entries(ANC as unknown as Record<string, [string, number]>).map(([k, [ph, af]]) => [k, at(ph, af)])) as Record<keyof typeof ANC, number>;
export const ANCHORS = A;

// ---------- vistas de la cámara del mundo ----------
type View = { p: [number, number, number]; l: [number, number, number]; fov: number };
const V: Record<string, View> = {
  book: { p: [-0.95, 1.5, -0.3], l: [-0.88, 0.79, -0.98], fov: 34 },
  spread: { p: [-1.0, 1.52, -0.58], l: [-1.0, 0.8, -0.98], fov: 32 },
  page: { p: [-0.98, 1.42, -0.62], l: [-0.97, 0.8, -0.97], fov: 34 },
  tank: { p: [5.4, 2.0, 2.6], l: [3.0, 0.95, 5.6], fov: 30 },
  tankFar: { p: [6.4, 2.6, 2.9], l: [3.0, 0.95, 5.6], fov: 36 },
  inv: { p: [4.75, 0.85, 3.4], l: [3.9, 0.15, 4.35], fov: 32 },
  carInv: { p: [6.4, 1.9, 7.6], l: [3.3, 0.45, 4.9], fov: 42 },
  fridge: { p: [1.6, 1.45, 0.3], l: [2.6, 1.1, -1.8], fov: 36 },
  fridgeX: { p: [2.42, 1.22, -0.3], l: [2.6, 0.98, -1.85], fov: 42 },
  kitchen: { p: [0.1, 2.0, 2.6], l: [0.9, 0.9, -1.4], fov: 46 },
  engine: { p: [4.9, 2.3, 7.7], l: [2.9, 1.0, 5.8], fov: 36 },
  rear: { p: [-4.2, 1.6, 9.2], l: [0.2, 0.7, 5.8], fov: 40 },
  street: { p: [10.5, 5.8, 15.5], l: [0.5, 1.0, 1.5], fov: 42 },
  streetFar: { p: [-14, 7.5, 16], l: [2, 1.0, 2.0], fov: 44 },
  house: { p: [7.5, 3.6, 13.5], l: [0.8, 1.3, 1.0], fov: 40 },
  door: { p: [2.48, 1.02, -0.85], l: [2.56, 0.86, -1.5], fov: 38 },
};
const push = (v: View, k = 0.1): View => ({ ...v, p: v.p.map((x, i) => x + (v.l[i] - x) * k) as View["p"] });

// ---------- transiciones entre bases (las mismas de cme3d01) ----------
type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL") {
    const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2), d = tr === "whip" ? -1 : 1, id = `wb${b}`;
    L.push(<AbsoluteFill key="w" style={{ transform: `translateX(${(out ? d : -d) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={0} /> : null}{out ? prev : cur}</AbsoluteFill>);
    if (k2 > 0.4) L.push(<AbsoluteFill key="wl" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 88 : (1 - ei((k - 0.5) * 2, 0, 1)) * -88; // 88 y no 90: de canto el canvas mide 0 y ThreeCanvas nunca se crea
    L.push(<AbsoluteFill key="fb" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a222c, #05070a)" }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={0} y={b} /> : null}{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,236,200,${0.95 * g}), rgba(255,170,90,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// blur del avatar / del mundo mientras hay una pieza pesada encima: tramos [desde, hasta]
const soft = (t: number, spans: [number, number][], amt = 14) => spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.35) * (1 - e(t, b, b + 0.35))), 0) * amt;

// ---------- LA LÍNEA DE TIEMPO DE BASES ----------
type Beat = { a: number; tr: Tr; p?: [number, number]; k?: string; cam?: [number, View][]; r: (t: number) => React.ReactNode };
const av = (ms: number) => WINS.reduce((b, w) => (Math.abs(w.ms - ms) < Math.abs(b.ms - ms) ? w : b)).ms;
const AV = (ms: number, tr: Tr, opt: { spans?: [number, number][]; p?: [number, number] } = {}): Beat => ({
  a: av(ms), tr, p: opt.p, r: (t) => <Avatar t={t} blur={soft(t, opt.spans ?? [])} dark={soft(t, opt.spans ?? [], 0.35)} />,
});
// una toma LTX (o su cuadro clave mientras no llega), con empuje lento
const CL = (a: number, k: string, tr: Tr, opt: { p?: [number, number]; z?: [number, number]; from?: number; spans?: [number, number][] } = {}): Beat => ({
  a, tr, p: opt.p, k, r: (t) => { const b = soft(t, opt.spans ?? [], 10); return <AbsoluteFill style={{ filter: b > 0.2 ? `blur(${b}px) brightness(${1 - b / 30})` : undefined }}><Take k={k} a={a} from={opt.from} z={opt.z ?? [1.0, 1.07]} dur={12} /></AbsoluteFill>; },
});
// el mundo: la cámara pasa por las vistas dadas ([segundo, vista]; la primera en `a`)
const WB = (a: number, tr: Tr, cam: View | [number, View][], opt: { p?: [number, number]; spans?: [number, number][]; amt?: number } = {}): Beat => ({
  a, tr, p: opt.p, cam: Array.isArray(cam) ? cam : [[a, cam]],
  r: (t) => { const b = soft(t, opt.spans ?? [], opt.amt ?? 8); return <AbsoluteFill style={{ filter: b > 0.2 ? `blur(${b}px) brightness(${1 - b / 40})` : undefined, transform: b > 0.2 ? "scale(1.03)" : undefined }}><World t={t} /></AbsoluteFill>; },
});

const BEATS: Beat[] = [
  AV(65.5, "cut"),
  // la guía dice que no alcanza
  WB(71.0, "portal", [[71.0, V.book], [80.6, push(V.book, 0.25)]], { p: [960, 520] }),
  AV(80.2, "zoom", { p: [960, 560] }),
  // detalle 3 en la entrada → la página 13
  WB(83.5, "whip", [[83.5, V.house], [85.6, push(V.house, 0.12)], [86.5, V.spread], [95.9, push(V.page, 0.05)]]),
  AV(95.8, "light"),
  WB(99.6, "zoom", [[99.6, V.page], [112.6, push(V.spread, -0.05)]], { p: [960, 540] }),
  AV(112.2, "whip"),
  WB(116.3, "portal", [[116.3, V.book], [127.9, push(V.book, 0.2)]], { p: [960, 520], spans: [[A.enlace - 0.1, A.trato - 0.25]] }),
  AV(127.6, "zoom"),
  // el trato
  CL(132.0, "c_ventana_vecinos", "whip", { spans: [[132.1, 143.5]] }),
  AV(143.5, "push"),
  // la comida → lo que usé: la batería de mi auto
  WB(147.6, "zoom", [[147.6, V.fridge], [149.6, push(V.fridge, 0.08)], [150.6, V.tankFar], [158.4, V.tank]]),
  AV(158.1, "portal", { p: [960, 480] }),
  CL(163.9, "c_bornes", "zoom"),
  WB(A.inv30 - 0.35, "whip", [[A.inv30 - 0.35, V.inv], [178.0, push(V.inv, 0.15)]]),
  AV(177.7, "flip"),
  // detalle 1: el inversor de 300 W no arranca nada
  CL(182.3, "c_inversor", "whip"),
  AV(193.6, "zoom"),
  CL(198.7, "c_pinza", "whip"),
  AV(209.1, "light", { spans: [[A.pinzaAmp - 0.2, 213.3]] }),
  // el kit
  WB(213.2, "zoom", [[213.2, V.fridge], [218.8, push(V.fridge, 0.2)]], { spans: [[213.2, 226.6]], amt: 4 }),
  CL(A.fusible - 0.3, "c_fusible", "whip", { spans: [[A.fusible - 0.3, 226.6]] }),
  CL(A.ext10 - 0.3, "c_extension", "whip", { spans: [[A.ext10 - 0.3, 226.6]] }),
  AV(226.5, "portal"),
  WB(230.3, "zoom", [[230.3, V.carInv], [242.5, push(V.carInv, 0.15)]]),
  AV(242.2, "whip"),
  // nunca a los enchufes de la casa → la cuenta que daba miedo
  CL(248.1, "c_cable_corriente", "zoom", { spans: [[248.2, A.cuentaMiedo - 0.4]] }),
  WB(A.cuentaMiedo - 0.3, "whip", [[A.cuentaMiedo - 0.3, V.kitchen], [260.3, V.fridge]]),
  AV(260.0, "zoom"),
  WB(264.1, "flip", [[264.1, V.fridge], [276.7, push(V.fridge, 0.15)]], { spans: [[264.2, 276.5]], amt: 9 }),
  AV(276.4, "flip"),
  CL(281.3, "c_cuaderno", "zoom"),
  AV(292.3, "whip"),
  // parte 1: hielo
  CL(297.8, "c_botellas", "zoom", { spans: [[A.dosPartes - 0.1, A.hielo + 1.6]] }),
  AV(311.1, "portal"),
  WB(315.7, "zoom", [[315.7, V.fridge], [317.5, V.fridgeX], [326.6, push(V.fridgeX, 0.1)]], { spans: [[A.kilo1 - 0.2, 326.4]], amt: 6 }),
  AV(326.3, "whip", { spans: [[A.w1100 - 0.2, 332.7]] }),
  WB(332.6, "zoom", [[332.6, V.fridgeX], [343.1, push(V.fridgeX, 0.12)]]),
  AV(342.8, "flip"),
  CL(347.2, "c_rotar", "zoom"),
  WB(A.rotas - 0.3, "whip", [[A.rotas - 0.3, V.fridgeX], [360.1, push(V.fridgeX, 0.1)]]),
  AV(359.8, "portal"),
  // la hielera con motor → parte 2: el termómetro manda
  WB(363.6, "zoom", [[363.6, push(V.fridgeX, 0.1)], [A.segunda - 0.2, V.fridge]]),
  CL(A.segunda - 0.3, "c_termometro", "whip"),
  AV(374.5, "zoom"),
  WB(378.3, "portal", [[378.3, V.book], [379.3, V.spread], [390.8, push(V.spread, 0.08)]], { p: [960, 520], spans: [[A.g6 - 0.2, 390.6]], amt: 3 }),
  AV(390.5, "whip"),
  CL(394.6, "c_enchufar", "zoom", { spans: [[A.unaHora - 0.2, 407.7]] }),
  AV(407.6, "portal"),
  WB(411.0, "zoom", [[411.0, V.kitchen], [422.5, push(V.kitchen, 0.15)]], { spans: [[411.0, A.prueba - 0.2]], amt: 9 }),
  AV(422.2, "flip"),
  // LA PRUEBA · día 1
  CL(427.4, "c_tester_s2", "zoom", { z: [1.0, 1.04] }),
  AV(440.6, "whip"),
  CL(445.2, "c_compresor", "zoom"),
  AV(456.4, "portal"),
  WB(462.6, "zoom", [[462.6, V.carInv], [466.5, V.inv], [473.8, push(V.inv, 0.1)]]),
  AV(473.5, "flip"),
  CL(476.8, "c_tester_carga", "zoom", { z: [1.0, 1.04] }),
  AV(489.1, "whip"),
  WB(493.5, "zoom", [[493.5, V.tank], [504.3, push(V.tank, 0.12)]], { spans: [[493.6, 504.1]], amt: 8 }),
  AV(504.0, "portal"),
  WB(509.8, "zoom", [[509.8, V.fridge], [522.4, push(V.fridge, 0.15)]]),
  AV(522.1, "whip"),
  WB(527.0, "zoom", [[527.0, V.tank], [539.5, push(V.tank, 0.1)]]),
  AV(539.2, "flip"),
  WB(543.4, "zoom", [[543.4, V.inv], [A.nuncaPaso - 0.2, push(V.inv, 0.12)]]),
  CL(A.nuncaPaso - 0.3, "c_congelador", "whip"),
  AV(553.6, "zoom"),
  // detalle 3: el alternador
  WB(558.6, "whip", [[558.6, V.house], [A.enAuto - 0.4, push(V.house, 0.15)], [A.enAuto + 0.6, V.engine], [571.1, push(V.engine, 0.15)]]),
  AV(570.8, "portal"),
  WB(574.3, "zoom", [[574.3, V.street], [A.orden - 0.2, push(V.street, 0.15)]]),
  CL(A.orden - 0.3, "c_inv_off", "whip"),
  AV(586.6, "flip"),
  WB(591.7, "zoom", [[591.7, V.inv], [602.3, push(V.inv, 0.2)]]),
  AV(602.0, "whip"),
  CL(606.5, "c_garaje_no", "zoom", { spans: [[606.6, 619.8]] }),
  AV(619.7, "portal"),
  CL(623.1, "c_llave", "whip"),
  CL(A.pinzaB - 0.3, "c_pinza_carga", "zoom"),
  AV(633.5, "flip", { spans: [[633.6, 639.5]] }),
  WB(639.4, "zoom", [[639.4, V.rear], [643.5, V.engine], [652.7, push(V.engine, 0.15)]]),
  AV(652.4, "whip"),
  CL(657.3, "c_tablero", "zoom"),
  CL(A.noRalenti - 0.3, "c_escape", "whip"),
  AV(670.7, "portal"),
  CL(674.9, "c_manejar", "zoom"),
  CL(A.dia2 - 0.3, "c_calor", "whip"),
  AV(686.9, "flip"),
  WB(692.8, "zoom", [[692.8, V.fridge], [A.calorAfuera - 0.3, push(V.fridge, 0.15)], [A.calorAfuera + 0.5, V.tank], [705.7, push(V.tank, 0.1)]]),
  AV(705.4, "zoom"),
  WB(710.8, "portal", [[710.8, V.tankFar], [722.6, push(V.tankFar, 0.1)]], { p: [960, 520], spans: [[710.9, 722.4]], amt: 7 }),
  AV(722.3, "flip"),
  WB(728.2, "zoom", [[728.2, V.rear], [731.0, V.engine], [738.6, V.tank]]),
  AV(738.3, "whip"),
  CL(742.7, "c_hielo_vivo", "zoom"),
  CL(A.seisDiez - 0.3, "c_vuelve_luz", "light"),
  AV(756.3, "portal"),
  // volvió la luz: la cuadra se enciende · los números
  WB(761.3, "zoom", [[761.3, V.streetFar], [773.3, V.street]]),
  AV(773.0, "flip"),
  WB(777.2, "zoom", [[777.2, V.tankFar], [789.6, push(V.tankFar, 0.1)]], { spans: [[777.3, 789.4]], amt: 8 }),
  AV(789.3, "whip"),
  WB(795.4, "zoom", [[795.4, V.engine], [808.3, push(V.engine, 0.12)]], { spans: [[795.5, 808.1]], amt: 7 }),
  AV(808.0, "flip"),
  CL(813.5, "c_basura", "zoom", { spans: [[813.6, 824.3]] }),
  AV(824.2, "portal"),
  CL(830.3, "c_generador", "zoom", { spans: [[830.4, 843.6]] }),
  AV(843.5, "whip"),
  // las 5 reglas
  WB(847.6, "zoom", [[847.6, V.house], [859.2, push(V.house, 0.15)]], { spans: [[A.r1 - 0.2, 859.0]], amt: 7 }),
  AV(858.9, "flip"),
  WB(863.9, "zoom", [[863.9, V.tank], [874.1, push(V.tank, 0.12)]], { spans: [[A.r2 - 0.2, 874.0]], amt: 7 }),
  AV(873.8, "whip"),
  WB(877.7, "zoom", [[877.7, V.engine], [890.8, push(V.engine, 0.12)]], { spans: [[A.r3 - 0.2, 890.6]], amt: 7 }),
  AV(890.5, "portal"),
  WB(894.7, "zoom", [[894.7, V.inv], [A.r4 - 0.4, push(V.inv, 0.15)], [A.r4 + 0.4, V.street], [905.6, push(V.street, 0.1)]], { spans: [[A.r4 - 0.2, 905.4]], amt: 7 }),
  AV(905.3, "flip"),
  CL(911.4, "c_una_vez", "zoom", { spans: [[A.r5 - 0.2, 924.7]] }),
  AV(924.6, "whip"),
  // el plan de 72 h → pegado en la puerta
  WB(928.9, "zoom", [[928.9, V.book], [934.2, V.spread], [941.4, push(V.spread, 0.1)]]),
  AV(941.1, "portal", { spans: [[A.enchufasQ - 0.2, 945.4]] }),
  WB(945.3, "zoom", [[945.3, V.kitchen], [946.8, V.door], [955.6, push(V.door, 0.1)]]),
  AV(955.3, "flip"),
  WB(961.4, "zoom", [[961.4, V.kitchen], [975.1, push(V.kitchen, 0.12)]], { spans: [[A.sola3 - 0.2, 974.9]], amt: 6 }),
  AV(974.8, "whip"),
  CL(979.2, "c_cierre", "zoom", { spans: [[A.masLargo - 0.2, 990.5]] }),
  AV(990.4, "portal"),
  WB(996.1, "zoom", [[996.1, V.street], [1000.3, V.streetFar]]),
];

// la cámara del mundo: cada plano WB agrega sus claves (y una de cierre cuando termina de verse)
let keysDone = false;
if (!keysDone) {
  keysDone = true;
  const ks: Key[] = [];
  BEATS.forEach((b, i) => {
    if (!b.cam) return;
    const nx = BEATS[i + 1], end = nx ? nx.a + DUR[nx.tr] + 0.05 : TEND + 1;
    const cam = b.cam.filter(([t]) => t < end);
    cam.forEach(([t, v]) => ks.push({ t, p: v.p, l: v.l, fov: v.fov }));
    const last = cam[cam.length - 1][1];
    if (cam[cam.length - 1][0] < end - 0.2) ks.push({ t: end, p: push(last, cam.length === 1 ? 0.08 : 0.02).p, l: last.l, fov: last.fov });
  });
  addKeys(ks);
}

// ---------- LA CAPA DE PIEZAS (cruza las transiciones) ----------
const scr = (t: number, q: [number, number, number]) => screenOf(t, q);
const G = "#38ff7a";
const pieces = (t: number) => {
  const car = scr(t, [2.9, 1.2, 5.6]), bat = scr(t, PT.bat), inv = scr(t, PT.inv), fr = scr(t, [2.95, 1.5, -1.6]), th = scr(t, PT.thermo), alt = scr(t, PT.alt), door = scr(t, [2.54, 1.05, -1.48]);
  const fx2 = scr(t, [2.5, 0.76, -1.75]), fx4 = scr(t, [2.6, 1.42, -1.75]), pgR = scr(t, bookPt(0.5, 0.45));
  return [
    // la guía dice que no alcanza
    <Head key="gd" t={t} at={71.2} out={A.medi2 - 0.2} text="MI GUÍA DICE:" y={110} size={64} col={COL.dim} />,
    <Words key="na" t={t} items={[{ at: A.alcanza + 0.2, txt: "NO ALCANZA PARA EL REFRIGERADOR", col: COL.red }]} out={A.medi2 - 0.2} y={880} size={84} />,
    <Words key="et" t={t} items={[{ at: A.etiqueta, txt: "EL NÚMERO DE LA ETIQUETA" }]} out={A.medi2 - 0.2} y={210} size={64} />,
    <Stamp key="lm" t={t} at={A.medi2 + 0.1} text="DESPUÉS LO MEDÍ" x={960} y={500} rot={-6} size={96} col={G} out={80.4} />,
    <Words key="3d" t={t} items={[{ at: A.detalles, txt: "3 DETALLES", col: COL.amber }, { at: A.detalles + 0.7, txt: "QUE NO CUESTAN CASI NADA" }]} out={83.4} y={930} size={76} />,
    // detalle 3 en la entrada → pág. 13
    <Tag key="en" t={t} at={A.estac} x={car.x} y={car.y} dx={-320} dy={-170} text="UNO ESTÁ EN TU ENTRADA" col={COL.amber} out={A.pag13 - 0.5} size={58} />,
    <Head key="p13" t={t} at={A.pag13} out={95.7} text="PLAN APAGÓN · PÁG. 13" y={70} size={56} col="#f7a8cf" />,
    <Eq key="eq1" t={t} out={95.75} y={900} size={110} terms={[{ at: A.ah70, txt: "70 Ah" }, { at: A.v12, txt: "12 V", op: "×" }]} />,
    <BigNum key="840" t={t} at={A.wh840} text="= 840 Wh" x={1460} y={330} size={150} col={COL.ink} sub="LA ETIQUETA" out={99.5} />,
    // la cascada de la página 13
    <BigNum key="420" t={t} at={A.w420} text="420 Wh" x={420} y={300} size={150} col={COL.amber} edge="#5a3200" sub="LA MITAD · PARA NO MATARLA" out={112.0} />,
    <BigNum key="370" t={t} at={A.w370} text="370 Wh" x={1480} y={300} size={150} col={G} edge="#0e4a24" sub="ÚTILES · MENOS EL INVERSOR" out={112.0} />,
    t > A.inversor && t < A.w370 + 0.2 ? <Tag key="ivp" t={t} at={A.inversor} x={pgR.x} y={pgR.y} dx={-120} dy={300} text="− LO QUE SE COME EL INVERSOR" col={COL.red} out={A.w370 + 0.1} size={44} /> : null,
    <Words key="lrc" t={t} items={[{ at: A.luz, txt: "LUZ ✓" }, { at: A.router, txt: "ROUTER ✓" }, { at: A.router + 0.5, txt: "CELULAR ✓" }]} out={A.sostuvo - 0.2} y={930} size={76} />,
    <Words key="ur" t={t} items={[{ at: A.tresd, txt: "¿UN REFRIGERADOR?", col: COL.ice }, { at: A.tresd + 1.0, txt: "3 DÍAS", col: G }]} out={A.sistema - 0.2} y={880} size={100} />,
    <Head key="slc" t={t} at={A.sistema} out={A.enlace - 0.2} text="DENTRO DEL SISTEMA LUZ CERO" y={110} size={64} col="#f7a8cf" />,
    <DescCard key="cta1" t={t} at={A.enlace} out={A.trato - 0.3} y={560} />,
    <Words key="tr" t={t} items={[{ at: A.trato, txt: "EL TRATO DE SIEMPRE", col: COL.amber }]} out={127.5} y={540} size={100} />,
    <Words key="nv" t={t} items={[{ at: A.vendo, txt: "NO VENDO BATERÍAS" }, { at: A.marca, txt: "SIN MARCA" }, { at: A.mando, txt: "NADIE ME PAGÓ", col: G }]} out={131.9} y={950} size={64} />,
    <Trato key="tt" t={t} at={A.gratis - 0.2} out={143.3} rows={[{ at: A.gratis, txt: "NO ES ENERGÍA GRATIS" }, { at: A.factura, txt: "NO BAJA LA FACTURA" }]} y={420} />,
    <Words key="cs" t={t} items={[{ at: A.costo, txt: "TIENE UN COSTO:", col: COL.amber }, { at: A.litros - 0.2, txt: "LITROS Y DÓLARES" }]} out={143.3} y={780} size={76} />,
    <Words key="uc" t={t} items={[{ at: A.unaCosa, txt: "PARA UNA SOLA COSA", col: COL.amber }]} out={147.5} y={940} size={76} />,
    <Head key="cn" t={t} at={147.8} out={A.vamos - 0.2} text="QUE LA COMIDA NO SE PIERDA" y={110} size={72} />,
    // lo que usé
    <Tag key="lu" t={t} at={A.vamos + 0.6} x={bat.x} y={bat.y} dx={-110} dy={-290} text="1 · LO QUE USÉ" sub="LA BATERÍA DE MI AUTO" col={COL.amber} out={158.0} size={62} />,
    <Words key="ah" t={t} items={[{ at: A.ah70b, txt: "70 Ah" }, { at: A.ah70b + 1.2, txt: "12 V" }]} out={158.0} y={900} size={96} />,
    <Words key="pa" t={t} items={[{ at: A.plomo, txt: "PLOMO ÁCIDO" }, { at: A.anos4, txt: "4 AÑOS", col: COL.amber }]} out={163.8} y={940} size={72} />,
    <Stamp key="pe" t={t} at={A.peor + 0.2} text="LA PEOR BATERÍA POSIBLE" x={960} y={200} rot={-5} size={84} out={A.inv30 - 0.4} />,
    <Words key="pq" t={t} items={[{ at: A.peor + 1.6, txt: "POR ESO LA ELEGÍ", col: G }]} out={A.inv30 - 0.4} y={900} size={84} />,
    <Tag key="i30" t={t} at={A.inv30} x={inv.x} y={inv.y} dx={-90} dy={-300} text="INVERSOR · US$30" col={COL.amber} out={177.6} size={62} />,
    <Words key="cj" t={t} items={[{ at: A.caja, txt: "LA CAJA:" , col: COL.dim }, { at: A.caja + 0.9, txt: "1000 W CONTINUOS" }, { at: A.pico2000, txt: "2000 PICO" }]} out={177.6} y={130} size={64} />,
    <Words key="nd" t={t} items={[{ at: A.noLoDa, txt: "1000 CONTINUO ✗", col: COL.red }, { at: A.picoSi, txt: "PICO ✓", col: G }]} out={182.2} y={940} size={72} />,
    // detalle 1
    <BigNum key="d1" t={t} at={A.det1} text="DETALLE 1" x={960} y={260} size={150} col={COL.amber} edge="#5a3200" out={A.w300 - 0.3} />,
    <Words key="w3" t={t} items={[{ at: A.w300, txt: "LA GUÍA: INVERSOR DE 300 W" }]} out={193.5} y={180} size={70} />,
    <Stamp key="nar" t={t} at={A.noArranca + 0.1} text="NO ARRANCA. NUNCA." x={960} y={560} rot={-6} size={100} out={193.5} />,
    <BigNum key="680" t={t} at={A.w680} text="680 W" x={1490} y={330} size={180} col={COL.red} edge="#4a0d08" sub="MENOS DE 1 SEGUNDO" out={198.6} />,
    <Lcd key="l680" t={t} at={A.pinzaCuadro} out={209.0} v="680" unit="W" label="PINZA · CUADRO A CUADRO" x={1480} y={300} col={COL.amber} />,
    <Stamp key="sa" t={t} at={A.apaga} text="SE APAGA" x={600} y={260} rot={-7} size={100} out={209.0} />,
    <Words key="ns" t={t} items={[{ at: A.niSeEntera, txt: "Y EL REFRIGERADOR NI SE ENTERA" }]} out={209.0} y={920} size={64} />,
    // el kit
    <CheckList key="kit" t={t} title="EL KIT" rows={[{ at: A.pinzaAmp, txt: "PINZA AMPERIMÉTRICA" }, { at: A.tester, txt: "TESTER" }, { at: A.termo6, txt: "TERMÓMETRO · US$6" }, { at: A.fusible, txt: "FUSIBLE AL BORNE +" }, { at: A.ext10, txt: "EXTENSIÓN 10 m GRUESA" }]} out={226.4} x={1290} y={200} />,
    <Tag key="et6" t={t} at={A.estante} x={th.x} y={th.y} dx={-360} dy={-150} text="EN EL ESTANTE DEL MEDIO" col={COL.ice} out={A.fusible - 0.3} size={50} />,
    <Words key="dc" t={t} items={[{ at: A.hastaCocina, txt: "DEL AUTO A LA COCINA" }]} out={A.fijate - 0.1} y={940} size={72} />,
    <Words key="fj" t={t} items={[{ at: A.fijate, txt: "FÍJATE EN ESTO", col: COL.amber }]} out={230.2} y={940} size={84} />,
    <Head key="ns2" t={t} at={A.noSale} out={A.enElPiso - 0.2} text="LA BATERÍA NO SALE DEL AUTO" y={90} size={70} col={G} />,
    <Tag key="pi" t={t} at={A.enElPiso + 0.2} x={inv.x} y={inv.y} dx={-90} dy={-300} text="INVERSOR EN EL PISO" sub="AL LADO DE LA RUEDA" col={COL.amber} out={242.1} size={56} />,
    <Tag key="dcc" t={t} at={A.dosCables} x={bat.x} y={bat.y} dx={-110} dy={-290} text="2 CABLES CORTOS" col={COL.amber} out={242.1} size={56} />,
    <Words key="ntc" t={t} items={[{ at: A.noToco, txt: "NO TOCO LA INSTALACIÓN", col: G }]} out={248.0} y={940} size={76} />,
    <ErrCard key="nu1" kind="NUNCA" t={t} at={248.3} n={1} txt="BATERÍA → ENCHUFES DE LA CASA" out={A.cuentaMiedo - 0.4} y={420} />,
    <Words key="1c" t={t} items={[{ at: A.unCable, txt: "1 CABLE → 1 APARATO", col: G }]} out={A.cuentaMiedo - 0.4} y={860} size={96} />,
    <Head key="cm" t={t} at={A.cuentaMiedo} out={259.9} text="LA CUENTA QUE ME DABA MIEDO" y={90} size={66} />,
    <Tag key="2p" t={t} at={A.dosPuertas} x={fr.x} y={fr.y} dx={-360} dy={-120} text="2 PUERTAS · 12 AÑOS" col={COL.ice} out={259.9} size={58} />,
    <BigNum key="110" t={t} at={A.w110} text="110 W" x={1490} y={320} size={170} col={COL.ice2} edge="#1d3a52" sub="ANDANDO" out={264.0} />,
    <Words key="td" t={t} items={[{ at: A.todoDia, txt: "ENCHUFADO TODO EL DÍA" }]} out={A.casi1000 - 0.6} y={300} size={80} />,
    <Eq key="eq2" t={t} out={A.contra370 - 0.3} y={480} size={130} terms={[{ at: A.arrancaPara, txt: "110 W" }, { at: A.arrancaPara + 1.4, txt: "24 h", op: "×" }, { at: A.casi1000, txt: "≈ 1000 Wh", col: COL.red, op: "=" }]} />,
    <Versus key="v1" t={t} at={A.contra370 - 0.1} out={276.3} title="Wh POR DÍA" L={{ label: "EL REFRIGERADOR", val: "1000", h: 0.95, col: COL.red }} R={{ label: "LA BATERÍA", val: "370", h: 0.35, col: G }} />,
    <Stamp key="nal" t={t} at={A.noAlcanza + 0.1} text="NO ALCANZA" x={960} y={180} rot={-6} size={100} out={276.3} />,
    <Words key="md" t={t} items={[{ at: A.medioDia, txt: "NI PARA MEDIO DÍA" }, { at: A.h3, txt: "→ 3 HORAS", col: COL.red }]} out={281.2} y={940} size={72} />,
    <Stamp key="imp" t={t} at={A.imposible} text="EN EL PAPEL: IMPOSIBLE" x={960} y={220} rot={-5} size={88} out={A.cuanta - 0.3} />,
    <Words key="cb" t={t} items={[{ at: A.cuanta, txt: "¿CUÁNTA BATERÍA NECESITAS?" }]} out={292.2} y={860} size={80} />,
    t > A.otra && t < 292.3 ? <DrawX key="cbx" t={t} at={A.otra} x={380} y={800} w={1160} h={120} /> : null,
    <Words key="330" t={t} items={[{ at: A.w330, txt: "330 Wh AL DÍA", col: G }, { at: A.w330 + 1.6, txt: "EN VEZ DE 1000", col: COL.dim }]} out={297.7} y={940} size={72} />,
    // parte 1: hielo
    <BigNum key="2p" t={t} at={A.dosPartes} text="2 PARTES" x={960} y={330} size={170} out={A.hielo - 0.1} />,
    <BigNum key="ph" t={t} at={A.hielo} text="1 · HIELO" x={960} y={330} size={190} col={COL.ice2} edge="#1d3a52" out={A.hielo + 1.9} />,
    <Words key="bac" t={t} items={[{ at: A.botellasAgua - 0.4, txt: "BOTELLAS DE AGUA CONGELADAS", col: COL.ice }]} out={311.0} y={920} size={72} />,
    <Words key="12k" t={t} items={[{ at: A.seis, txt: "6 × 2 L" }, { at: A.kilos12, txt: "= 12 kg DE HIELO", col: COL.ice }]} out={315.6} y={940} size={80} />,
    <Words key="fp" t={t} items={[{ at: A.abuela, txt: "¿TRUCO DE ABUELA?" }, { at: A.fisica, txt: "FÍSICA PURA", col: COL.ice }]} out={A.kilo1 - 0.3} y={130} size={76} />,
    <Eq key="eq3" t={t} out={326.2} y={520} size={140} terms={[{ at: A.kilo1, txt: "1 kg DE HIELO", col: COL.ice2 }, { at: A.w93, txt: "93 Wh", col: COL.ice, op: "≈" }]} sub={{ at: A.son12, txt: "× 12 kg…" }} />,
    <Versus key="v2" t={t} at={A.w1100 - 0.1} out={332.5} title="Wh DE FRÍO" L={{ label: "12 kg DE HIELO", val: "1100", h: 0.9, col: COL.ice, mark: "ok" }} R={{ label: "LA BATERÍA ENTERA", val: "840", h: 0.68, col: "#b9c7d6" }} />,
    <Words key="pg" t={t} items={[{ at: A.pagaste, txt: "LO PAGASTE CON LA LUZ DE ANTES" }]} out={A.pasasDos - 0.2} y={940} size={64} />,
    <Tag key="2a" t={t} at={A.pasasDos + 0.4} x={fx2.x} y={fx2.y} dx={-380} dy={60} text="2 ARRIBA EN EL REFRIGERADOR" col={COL.ice} out={342.7} size={50} />,
    <Tag key="4c" t={t} at={A.cuatro} x={fx4.x} y={fx4.y} dx={-380} dy={-120} text="4 EN EL CONGELADOR" col={COL.ice2} out={342.7} size={50} />,
    <Words key="bo" t={t} items={[{ at: A.bolsas, txt: "+ BOLSAS DE AGUA EN LOS HUECOS", col: COL.ice }]} out={347.1} y={950} size={60} />,
    <Words key="lg" t={t} items={[{ at: A.lleno, txt: "LLENO GUARDA", col: COL.ice }, { at: A.vacio, txt: "VACÍO PIERDE", col: COL.red }]} out={A.rotas - 0.35} y={900} size={84} />,
    <Head key="rot" t={t} at={A.rotas} out={359.7} text="CADA NOCHE: ROTAR" y={90} size={76} col={COL.ice} />,
    <Words key="ds" t={t} items={[{ at: A.dejaDeSer, txt: "DEJA DE SER UN REFRIGERADOR" }]} out={363.5} y={950} size={64} />,
    <Words key="hp" t={t} items={[{ at: A.hielera, txt: "= HIELERA DE PLAYA", col: COL.ice }, { at: A.motor, txt: "+ UN MOTOR", col: COL.amber }]} out={A.segunda - 0.35} y={120} size={80} />,
    // parte 2: el termómetro manda
    <BigNum key="p2" t={t} at={A.segunda} text="2 · EL TERMÓMETRO MANDA" x={960} y={300} size={110} col={COL.amber} edge="#5a3200" out={A.noTodoDia - 0.2} />,
    <Words key="ntd" t={t} items={[{ at: A.noTodoDia, txt: "NO VA ENCHUFADO TODO EL DÍA" }]} out={374.4} y={900} size={72} />,
    <Words key="eb" t={t} items={[{ at: A.bloques, txt: "EN BLOQUES", col: COL.amber }, { at: A.reglaUna, txt: "1 SOLA REGLA" }]} out={378.2} y={940} size={76} />,
    <Head key="p11" t={t} at={A.pag11} out={390.4} text="PLAN APAGÓN · PÁG. 11" y={60} size={52} col="#f7a8cf" />,
    <Words key="r6" t={t} items={[{ at: A.g6, txt: "6 °C O MÁS → ENCHUFAS", col: COL.amber }]} out={390.4} y={170} size={66} />,
    <Words key="r4" t={t} items={[{ at: A.baja4, txt: "BAJA A 4 °C → DESENCHUFAS", col: COL.ice }]} out={390.4} y={250} size={66} />,
    <Thermo key="th1" t={t} at={A.enchufas} x={1560} y={360} from={6} to={4} dur={2.4} out={390.4} />,
    <BlockStrip key="bs" t={t} out={394.5} blocks={[{ at: A.m6, h: 6, lab: "6 AM" }, { at: A.t1, h: 13, lab: "1 PM" }, { at: A.n7, h: 19, lab: "7 PM" }]} y={830} />,
    <Words key="ct" t={t} items={[{ at: A.cambiaTodo, txt: "ESTO CAMBIA TODO", col: COL.amber }]} out={A.unaHora - 0.3} y={160} size={84} />,
    <Versus key="v3" t={t} at={A.unaHora - 0.1} out={407.5} title="CADA BLOQUE, CON HIELO" L={{ label: "LA GUÍA", val: "1,5 h", h: 0.8, col: "#b9c7d6" }} R={{ label: "LO QUE MEDÍ", val: "1 h", h: 0.53, col: G, mark: "ok" }} />,
    <Words key="3b" t={t} items={[{ at: A.tresBl, txt: "3 BLOQUES × 1 h × 110 W" }]} out={410.9} y={940} size={72} />,
    <Eq key="eq4" t={t} out={A.contra - 0.3} y={480} size={150} terms={[{ at: 411.1, txt: "3 h" }, { at: 411.4, txt: "110 W", op: "×" }, { at: A.w330b, txt: "330 Wh", col: G, op: "=" }]} />,
    <Versus key="v4" t={t} at={A.contra - 0.1} out={A.prueba - 0.25} title="Wh POR DÍA" L={{ label: "LO QUE PIDE", val: "330", h: 0.8, col: G }} R={{ label: "LA BATERÍA", val: "370", h: 0.9, col: COL.ice }} />,
    <Stamp key="ej" t={t} at={A.entra} text="ENTRA. JUSTO." x={960} y={200} rot={-5} size={100} col={G} out={A.prueba - 0.25} />,
    <Words key="lp" t={t} items={[{ at: A.prueba, txt: "AHORA SÍ: LA PRUEBA", col: COL.amber }]} out={422.1} y={540} size={110} />,
    // día 1
    <Words key="d1" t={t} items={[{ at: A.dia1, txt: "DÍA 1 · 7:00 AM", col: COL.amber }]} out={427.3} y={950} size={70} />,
    <Notebook key="nb1" t={t} at={A.breaker} out={440.5} title="Día 1" x={80} y={150} rot={-3} rows={[{ at: A.breaker + 0.3, txt: "7:00 bajo el breaker" }, { at: A.r1263 + 0.6, txt: "batería 12,63 V (llena)" }, { at: A.g3 + 0.3, txt: "termómetro 3 °C" }]} />,
    <Lcd key="l1263" t={t} at={A.r1263} out={440.5} v="12,63" x={1480} y={310} />,
    <Lcd key="l114" t={t} at={A.v114} out={A.acomoda + 0.6} v="11,4" x={1480} y={310} label="ARRANQUE · 1 SEGUNDO" col={COL.red} />,
    <Words key="ac" t={t} items={[{ at: A.acomoda, txt: "Y SE ACOMODA", col: G }]} out={456.3} y={940} size={72} />,
    <BigNum key="104" t={t} at={A.a104} text="10,4 A" x={1490} y={320} size={170} col={COL.amber} edge="#5a3200" sub="COMPRESOR ANDANDO" out={462.5} />,
    <Eq key="eq5" t={t} out={A.trampa - 0.3} y={140} size={96} terms={[{ at: A.a104b, txt: "10,4 A" }, { at: A.a104b + 0.6, txt: "12 V", op: "×" }, { at: A.w110b - 0.3, txt: "≈ 125 W", col: COL.amber, op: "=" }]} sub={{ at: A.w110b, txt: "→ 110 W LLEGAN AL REFRIGERADOR" }} />,
    <Tag key="pd" t={t} at={A.perdidas} x={inv.x} y={inv.y} dx={-90} dy={-300} text="LA DIFERENCIA = CALOR" col={COL.red} out={473.4} size={56} />,
    <Stamp key="tp1" t={t} at={A.trampa} text="TRAMPA 1" x={1500} y={850} rot={-6} size={96} out={473.4} />,
    <Lcd key="l1195" t={t} at={A.v1195} out={489.0} v="11,95" x={1480} y={310} label="COMPRESOR ANDANDO" col={COL.amber} />,
    <Words key="cv" t={t} items={[{ at: A.vacia, txt: "¿CASI VACÍA?", col: COL.red }]} out={A.yNo - 0.2} y={940} size={84} />,
    <Stamp key="yn" t={t} at={A.yNo} text="Y NO." x={600} y={300} rot={-8} size={130} col={G} out={489.0} />,
    <Lcd key="l1248" t={t} at={A.v1248} out={493.4} v="12,48" x={1480} y={310} label="20 MIN DESPUÉS · REPOSO" />,
    <Versus key="v5" t={t} at={493.7} out={503.9} title="EL MISMO TESTER" L={{ label: "ANDANDO · MIENTE", val: "11,95", h: 0.5, col: COL.red, mark: "x" }} R={{ label: "EN REPOSO", val: "12,48", h: 0.85, col: G, mark: "ok" }} />,
    <Stamp key="rs" t={t} at={A.siempre} text="REPOSO. SIEMPRE." x={960} y={180} rot={-5} size={96} col={G} out={503.9} />,
    <BigNum key="20m" t={t} at={A.min20} text="20 MIN" x={1490} y={320} size={170} col={COL.ice2} edge="#1d3a52" sub="SIN NADA CONECTADO" out={A.t1pm - 0.3} />,
    <Words key="1pm" t={t} items={[{ at: A.t1pm, txt: "1:00 PM", col: COL.amber }]} out={509.7} y={950} size={72} />,
    <Thermo key="th2" t={t} at={A.seisJustos} x={300} y={330} from={6} to={4} dur={2.0} out={521.9} />,
    <Notebook key="nb2" t={t} at={A.seisJustos - 0.2} out={521.9} title="Día 1 · bloques" x={1200} y={150} rows={[{ at: A.m58, txt: "13:00  6 °C → 58 min" }, { at: A.h104, txt: "19:00  6,1 °C → 1 h 04" }]} />,
    <Words key="24h" t={t} items={[{ at: A.h24, txt: "24 HORAS DESPUÉS", col: COL.amber }]} out={526.9} y={950} size={72} />,
    <VoltChart key="vc1" t={t} at={527.2} out={539.1} pts={[{ at: 527.4, v: 12.63, lab: "DÍA 1 · 7 AM" }, { at: A.v1210, v: 12.1, lab: "+24 h" }]} x={1060} y={180} w={760} h={480} />,
    <Words key="mi" t={t} items={[{ at: A.mitadB, txt: "≈ LA MITAD DE LA BATERÍA", col: COL.amber }]} out={539.1} y={930} size={72} />,
    <Words key="400" t={t} items={[{ at: A.w400, txt: "SALIERON 400 Wh" }, { at: A.llegaron, txt: "LLEGARON 330", col: G }]} out={543.3} y={950} size={64} />,
    <Tag key="70c" t={t} at={A.enCalor} x={inv.x} y={inv.y} dx={-90} dy={-300} text="~70 Wh EN CALOR" col={COL.red} out={A.nuncaPaso - 0.3} size={62} />,
    <Words key="np" t={t} items={[{ at: A.nuncaPaso, txt: "NUNCA PASÓ DE 6 °C", col: COL.ice }]} out={553.5} y={140} size={80} />,
    <Words key="cl" t={t} items={[{ at: A.carneDura, txt: "CARNE DURA ✓", col: G }, { at: A.lecheFria, txt: "LECHE FRÍA ✓", col: G }]} out={553.5} y={940} size={72} />,
    <Words key="1d" t={t} items={[{ at: A.unDia, txt: "1 DÍA → BATERÍA A LA MITAD", col: COL.amber }]} out={558.5} y={950} size={64} />,
    // detalle 3: el alternador
    <Stamp key="sau" t={t} at={A.sinAuto} text="Y SIN AUTO" x={960} y={300} rot={-6} size={110} out={A.noDice - 0.2} />,
    <BigNum key="d3" t={t} at={A.tercerD - 0.3} text="DETALLE 3" x={960} y={260} size={150} col={COL.amber} edge="#5a3200" sub="LO QUE LA GUÍA NO DICE" out={A.enAuto - 0.4} />,
    <Tag key="al" t={t} at={A.alternador} x={alt.x} y={alt.y} dx={-340} dy={-220} text="EL ALTERNADOR" sub="UN GENERADOR QUE YA PAGASTE" col={G} out={570.7} size={62} />,
    <CheckList key="alt" t={t} title="EL ALTERNADOR" rows={[{ at: A.ruido, txt: "CASI SIN RUIDO" }, { at: A.roba, txt: "NADIE TE LO ROBA" }, { at: A.exacto, txt: "CARGA ESTA BATERÍA" }]} out={A.orden - 0.35} x={1300} y={220} />,
    <Stamp key="ho" t={t} at={A.orden} text="HAY UN ORDEN" x={960} y={200} rot={-5} size={96} col={COL.amber} out={A.apagas - 0.3} />,
    <Paso key="s1" t={t} at={A.apagas} n={1} name="APAGAR EL INVERSOR" val="SIEMPRE" valAt={A.apagas + 1.3} out={591.6} />,
    <BigNum key="200" t={t} at={A.a200} text="200 A" x={1490} y={310} size={180} col={COL.red} edge="#4a0d08" sub="EL MOTOR DE ARRANQUE" out={A.frito - 0.4} />,
    <Stamp key="fr" t={t} at={A.frito} text="FRITO" x={1450} y={300} rot={-8} size={140} out={A.segundoP - 0.1} />,
    <Paso key="s2" t={t} at={A.segundoP} n={2} name="EL AUTO AFUERA" val="NO SE NEGOCIA" valAt={A.segundoP + 1.0} out={606.4} />,
    <ErrCard key="g1" kind="NUNCA" t={t} at={606.7} n={1} txt="DENTRO DE UN GARAJE" out={A.porton - 0.2} y={300} />,
    <ErrCard key="g2" kind="NUNCA" t={t} at={A.porton} n={2} txt="CON EL PORTÓN ENTREABIERTO" out={A.ventana - 0.2} y={300} />,
    <ErrCard key="g3" kind="NUNCA" t={t} at={A.ventana} n={3} txt="DEBAJO DE UNA VENTANA" out={A.muere - 0.1} y={300} />,
    <Words key="mo" t={t} items={[{ at: A.monoxido, txt: "MONÓXIDO DE CARBONO", col: COL.red }]} out={619.6} y={420} size={96} />,
    <Words key="so" t={t} items={[{ at: A.olor, txt: "SIN OLOR" }, { at: A.color, txt: "SIN COLOR" }, { at: A.duerme, txt: "TE DUERME", col: COL.red }]} out={A.arranco - 0.1} y={940} size={72} />,
    <Words key="arr" t={t} items={[{ at: A.arranco, txt: "ARRANCO.", col: G }]} out={623.0} y={940} size={90} />,
    <Lcd key="l1210" t={t} at={A.v1210b} out={A.pinzaB - 0.4} v="12,10" x={1480} y={310} label="ANTES DE ARRANCAR" col={COL.amber} />,
    <Words key="pr" t={t} items={[{ at: A.primera, txt: "ARRANCÓ A LA PRIMERA", col: G }]} out={A.pinzaB - 0.4} y={940} size={72} />,
    <Lcd key="l38" t={t} at={A.a38} out={633.4} v="38" unit="A" x={1480} y={310} label="ENTRAN A LA BATERÍA" col={G} />,
    <TimeBars key="tb" t={t} out={639.3} x={1180} y={260} rows={[{ at: 633.6, label: "AL ARRANCAR", val: "38 A", frac: 1, col: G }, { at: A.m20, label: "20 MIN", val: "22 A", frac: 0.58, col: COL.amber }, { at: A.hora9, label: "1 HORA", val: "9 A", frac: 0.24, col: COL.red }]} />,
    <Words key="ml" t={t} items={[{ at: A.masLlena, txt: "MÁS LLENA = MENOS ACEPTA", col: COL.amber }]} out={A.noLlena - 0.1} y={140} size={76} />,
    <Tag key="nl" t={t} at={A.noLlena} x={bat.x} y={bat.y} dx={-110} dy={-290} text="NUNCA LA LLENA HASTA ARRIBA" col={COL.amber} out={652.3} size={54} />,
    <BigNum key="115" t={t} at={A.hora15} text="1 h 15" x={1490} y={300} size={150} col={COL.ink} sub="DE MOTOR EN MARCHA" out={652.3} />,
    <Lcd key="l1248b" t={t} at={A.v1248b} out={657.2} v="12,48" x={1480} y={310} label="EN REPOSO · CARGADA" />,
    <Words key="ct2" t={t} items={[{ at: A.casiToda, txt: "CASI TODA DE VUELTA", col: G }]} out={A.ralenti - 0.2} y={940} size={76} />,
    <Words key="34" t={t} items={[{ at: A.tresCuartos, txt: "¾ L DE GASOLINA POR HORA", col: COL.amber }]} out={A.noRalenti - 0.35} y={940} size={72} />,
    <Words key="nr" t={t} items={[{ at: A.noRalenti, txt: "MEJOR: NO EN RALENTÍ" }]} out={670.6} y={940} size={76} />,
    <Words key="sh" t={t} items={[{ at: A.salir, txt: "¿SALES A BUSCAR HIELO?" }]} out={674.8} y={950} size={64} />,
    <Words key="mc" t={t} items={[{ at: A.manejas, txt: "MANEJANDO CARGA MEJOR", col: G }]} out={A.dia2 - 0.35} y={940} size={76} />,
    <BigNum key="dia2" t={t} at={A.dia2} text="DÍA 2" x={960} y={300} size={200} col={COL.amber} edge="#5a3200" out={A.g29 - 0.3} />,
    <BigNum key="29" t={t} at={A.g29} text="29 °C" x={1490} y={300} size={180} col={COL.red} edge="#4a0d08" sub="EN LA COCINA" out={686.8} />,
    <Thermo key="th3" t={t} at={A.v58 - 0.6} x={1560} y={360} from={4} to={5.8} dur={1.4} out={692.7} />,
    <Words key="02" t={t} items={[{ at: A.decimas, txt: "A 0,2 °C DEL LÍMITE", col: COL.amber }]} out={A.calorAfuera - 0.3} y={140} size={80} />,
    <Words key="b120" t={t} items={[{ at: A.h120, txt: "ESE BLOQUE: 1 h 20", col: COL.amber }]} out={A.calorAfuera - 0.3} y={940} size={66} />,
    <Words key="nb" t={t} items={[{ at: A.ningunaBat, txt: "EL CALOR NO LO ARREGLA NINGUNA BATERÍA" }]} out={705.3} y={940} size={58} />,
    <Lcd key="l1202" t={t} at={A.v1202} out={710.7} v="12,02" x={1480} y={310} label="DÍA 3 · EN REPOSO" col={COL.red} />,
    <VoltChart key="vc2" t={t} at={711.0} out={722.2} redAt={A.lineaRoja} pts={[{ at: 711.1, v: 12.63, lab: "DÍA 1" }, { at: 711.4, v: 12.1, lab: "DÍA 2" }, { at: 711.7, v: 12.48, lab: "CARGADA" }, { at: 712.0, v: 12.02, lab: "DÍA 3" }]} x={240} y={200} w={1440} h={520} />,
    <Words key="dn" t={t} items={[{ at: A.danarse, txt: "POR DEBAJO: SE DAÑA EN SERIO", col: COL.red }]} out={A.noArranque - 0.2} y={850} size={72} />,
    <Words key="na2" t={t} items={[{ at: A.noArranque, txt: "Y EL AUTO PUEDE NO ARRANCAR", col: COL.red }]} out={722.2} y={850} size={72} />,
    <Words key="sg" t={t} items={[{ at: A.sinGen, txt: "SIN GENERADOR" }, { at: A.sinGen + 0.9, txt: "SIN BATERÍA" }, { at: A.sinGen + 1.8, txt: "SIN REFRIGERADOR", col: COL.red }]} out={728.1} y={950} size={60} />,
    <Words key="ar2" t={t} items={[{ at: A.arranco2, txt: "ARRANCÓ", col: G }]} out={A.h140 - 0.2} y={140} size={90} />,
    <BigNum key="140" t={t} at={A.h140} text="1 h 40" x={1490} y={300} size={150} col={COL.ink} sub="DE MOTOR" out={A.v1252 - 0.2} />,
    <Lcd key="l1252" t={t} at={A.v1252} out={738.2} v="12,52" x={1480} y={310} label="EN REPOSO · CARGADA" />,
    <Words key="d3w" t={t} items={[{ at: A.dia3b, txt: "DÍA 3", col: COL.amber }]} out={738.2} y={940} size={90} />,
    <Words key="3bn" t={t} items={[{ at: A.tresBl2, txt: "3 BLOQUES · TODO NORMAL", col: G }]} out={742.6} y={950} size={64} />,
    <Words key="cz" t={t} items={[{ at: A.corazon, txt: "TODAVÍA CON CORAZÓN DE HIELO", col: COL.ice }]} out={A.seisDiez - 0.35} y={940} size={72} />,
    <BigNum key="71" t={t} at={A.h71} text="71 HORAS" x={960} y={280} size={190} col={COL.ice2} edge="#1d3a52" sub="6:10 PM · VOLVIÓ LA LUZ" out={A.v1205 - 0.3} />,
    <Flash key="fl" t={t} at={A.volvio + 0.3} peak={0.4} w={0.45} col="#ffe2b0" />,
    <Lcd key="l1205" t={t} at={A.v1205} out={756.2} v="12,05" x={1480} y={310} label="ANTES DE ENCHUFAR" col={COL.amber} />,
    <Thermo key="th4" t={t} at={A.g42 - 0.4} x={1560} y={360} from={4} to={4.2} dur={0.8} out={761.2} />,
    <BigNum key="3d2" t={t} at={A.tresDias - 0.2} text="3 DÍAS" x={960} y={260} size={210} col={G} edge="#0e4a24" sub="UNA SOLA BATERÍA DE AUTO" out={A.numeros - 0.3} />,
    <Words key="mx" t={t} items={[{ at: A.v58b, txt: "MÁX 5,8 °C ✓", col: COL.ice }, { at: A.bajo0, txt: "CONGELADOR ≤ −10 °C ✓", col: COL.ice }]} out={A.numeros - 0.3} y={900} size={70} />,
    <Words key="nq" t={t} items={[{ at: A.numeros, txt: "LOS NÚMEROS QUE IMPORTAN", col: COL.amber }]} out={772.9} y={540} size={100} />,
    <Stamp key="ng" t={t} at={A.noGratis} text="NO ES GRATIS" x={1450} y={250} rot={-7} size={100} out={777.1} />,
    <Versus key="v6" t={t} at={A.wh1200 - 0.2} out={789.2} title="Wh EN 3 DÍAS" L={{ label: "SALIERON", val: "1200", h: 0.92, col: G, mark: "ok" }} R={{ label: "LA ETIQUETA", val: "840", h: 0.64, col: "#b9c7d6" }} />,
    <Words key="2c" t={t} items={[{ at: A.dosCargas, txt: "+ 2 CARGAS DEL AUTO", col: COL.amber }]} out={789.2} y={160} size={80} />,
    <Words key="255" t={t} items={[{ at: A.h255, txt: "2 h 55 DE MOTOR" }, { at: A.litrosB, txt: "2,25 L", col: COL.amber }]} out={795.3} y={950} size={70} />,
    <Receipt key="rc" t={t} title="LO QUE COSTÓ · US$" cur="" rows={[{ at: A.dol25, item: "GASOLINA 2,25 L", $: 2.5 }, { at: A.bat2, item: "BATERÍA (2 % VIDA)", $: 2 }]} totalAt={A.tot45} x={1130} y={120} sc={1.3} out={A.carneP - 0.3} />,
    <BigNum key="150" t={t} at={A.d150} text="~150 DESCARGAS" x={760} y={330} size={120} col={COL.ink} sub="VIDA DE UNA BATERÍA DE ARRANQUE" out={808.0} />,
    <Words key="3h" t={t} items={[{ at: A.leHice3, txt: "LE HICE 3", col: COL.amber }]} out={807.9} y={900} size={90} />,
    <Words key="2pc" t={t} items={[{ at: A.pct2, txt: "= 2 % DE SU VIDA", col: COL.amber }, { at: A.d95, txt: "(US$95 → US$2)" }]} out={813.4} y={950} size={64} />,
    <Versus key="v7" t={t} at={A.carneP - 0.1} out={824.1} title="EN DÓLARES" L={{ label: "LO QUE GASTÉ", val: "4,5", h: 0.18, col: COL.amber }} R={{ label: "LA COMIDA SALVADA", val: "140", h: 0.95, col: G, mark: "ok" }} />,
    <Words key="gc" t={t} items={[{ at: A.genChico, txt: "¿Y CON UN GENERADOR CHICO?" }]} out={830.2} y={950} size={64} />,
    <Trato key="gen" t={t} title="UN GENERADOR CHICO" at={A.h9 - 0.2} out={843.4} y={480} rows={[{ at: A.h9, txt: "9 h DE MOTOR" }, { at: A.cinco, txt: "5+ LITROS" }, { at: A.d200, txt: "US$200 PARA COMPRARLO" }, { at: A.ruido7, txt: "RUIDO A LAS 7 AM" }, { at: A.encadenado, txt: "ENCADENADO DE NOCHE" }]} />,
    <Words key="ylt" t={t} items={[{ at: A.yaLoTienes, txt: "EL AUTO YA LO TIENES", col: G }]} out={847.5} y={950} size={72} />,
    // las 5 reglas
    <BigNum key="5r" t={t} at={A.reglas5} text="5 REGLAS" x={960} y={300} size={200} col={COL.amber} edge="#5a3200" sub="CADA UNA, APRENDIDA MIDIENDO" out={A.r1 - 0.3} />,
    <Regla key="r1" t={t} at={A.r1} n={1} txt="EL VOLTAJE SE LEE EN REPOSO" sub="20 MIN SIN NADA CONECTADO" out={858.8} />,
    <Words key="20s" t={t} items={[{ at: A.r1b, txt: "20 MIN SIN NADA CONECTADO", col: COL.ice }]} out={863.8} y={950} size={64} />,
    <Words key="mi2" t={t} items={[{ at: A.abajo, txt: "ANDANDO: MIENTE ↓", col: COL.red }, { at: A.arribaM, txt: "RECIÉN CARGADA: MIENTE ↑", col: COL.amber }]} out={A.r2 - 0.3} y={540} size={80} />,
    <Regla key="r2" t={t} at={A.r2} n={2} txt="LA LÍNEA ROJA: 12,0 V" sub="EN REPOSO" col={COL.red} out={873.7} />,
    <Words key="ca" t={t} items={[{ at: A.cargaAuto, txt: "LLEGA A 12 → ESE DÍA CARGA", col: COL.amber }]} out={877.6} y={950} size={64} />,
    <Words key="ss" t={t} items={[{ at: A.siOsi, txt: "SÍ O SÍ" }, { at: A.dosDias, txt: "2 DÍAS DESCARGADA = NO VUELVE", col: COL.red }]} out={A.r3 - 0.3} y={540} size={80} />,
    <Regla key="r3" t={t} at={A.r3} n={3} txt="INVERSOR APAGADO ANTES DE ARRANCAR" sub="SIEMPRE" out={890.4} />,
    <Words key="ap" t={t} items={[{ at: A.aguantarPico, txt: "QUE AGUANTE EL PICO DEL ARRANQUE", col: COL.amber }]} out={894.6} y={950} size={60} />,
    <Eq key="eq6" t={t} out={A.r4 - 0.3} y={480} size={140} terms={[{ at: A.seisVeces - 0.4, txt: "110 W" }, { at: A.seisVeces, txt: "6", op: "×" }, { at: A.seisVeces + 1.0, txt: "≈ 680 W", col: COL.red, op: "=" }]} />,
    <Regla key="r4" t={t} at={A.r4} n={4} txt="EL MOTOR SIEMPRE AFUERA" sub="LEJOS DE LAS VENTANAS" subAt={A.lejos} col={COL.red} out={905.2} />,
    <Words key="fm" t={t} items={[{ at: A.noEsParaTi, txt: "SI NO, NO ES PARA TI" }, { at: A.familia - 1.2, txt: "LA COMIDA SE REEMPLAZA" }, { at: A.familia, txt: "TU FAMILIA NO", col: COL.red }]} out={911.3} y={950} size={56} />,
    <Regla key="r5" t={t} at={A.r5} n={5} txt="LA PUERTA: 1 VEZ POR BLOQUE" sub="SACAS TODO DE UNA SOLA VEZ" subAt={A.deUnaVez} col={COL.ice} out={A.tiras - 0.3} y={460} />,
    <Words key="tf" t={t} items={[{ at: A.tiras, txt: "CADA VEZ QUE ABRES: TIRAS FRÍO", col: COL.red }]} out={928.8} y={880} size={68} />,
    <Words key="ucm" t={t} items={[{ at: A.unaCosaMas, txt: "UNA COSA MÁS", col: COL.amber }]} out={928.8} y={950} size={70} />,
    <Words key="lt" t={t} items={[{ at: A.linterna, txt: "NO LO IMPROVISES A LAS 11 PM" }]} out={A.pag30 - 0.3} y={120} size={70} />,
    <Head key="p30" t={t} at={A.pag30} out={941.0} text="PLAN APAGÓN · PÁG. 30 → 36" y={60} size={52} col="#f7a8cf" />,
    <Words key="72" t={t} items={[{ at: A.h72, txt: "72 HORAS · HORA POR HORA", col: COL.amber }]} out={941.0} y={950} size={70} />,
    <CheckList key="p72" t={t} title="EL PLAN DE 72 h" rows={[{ at: A.enchufasQ, txt: "QUÉ ENCHUFAS" }, { at: A.enchufasQ + 0.8, txt: "CUÁNDO" }, { at: A.enchufasQ + 1.5, txt: "EN QUÉ ORDEN" }, { at: A.pasaDe6 - 0.3, txt: "SI PASA DE 6 °C" }]} out={A.pegue - 0.4} x={1300} y={220} />,
    <Tag key="pc" t={t} at={A.pegue} x={door.x} y={door.y} dx={-420} dy={-180} text="PEGADO CON CINTA" sub="LOS 3 DÍAS" col={COL.amber} out={A.sistema2 - 0.3} size={60} />,
    <Head key="slc2" t={t} at={A.sistema2} out={955.2} text="DENTRO DEL SISTEMA LUZ CERO" y={90} size={60} col="#f7a8cf" />,
    <DescCard key="cta2" t={t} at={A.enlace2 - 0.3} out={961.3} y={830} />,
    <Words key="sola" t={t} items={[{ at: A.sola3, txt: "SOLA: 3 HORAS", col: COL.red }]} out={974.7} y={140} size={84} />,
    <CheckList key="fo" t={t} title="LO QUE LA ESTIRÓ" rows={[{ at: A.conHielo, txt: "12 kg DE HIELO" }, { at: A.termoManda, txt: "EL TERMÓMETRO MANDA" }, { at: A.unaVezDia, txt: "EL AUTO, 1 VEZ AL DÍA" }]} out={974.7} x={1300} y={260} />,
    <Words key="3df" t={t} items={[{ at: A.tresDiasF, txt: "= 3 DÍAS", col: G }]} out={A.carneMes - 0.2} y={950} size={90} />,
    <Words key="cmes" t={t} items={[{ at: A.carneMes, txt: "LA CARNE DEL MES SIGUE AHÍ", col: COL.ice }]} out={979.1} y={950} size={64} />,
    <Words key="cmt" t={t} items={[{ at: A.comentarios, txt: "DE TUS COMENTARIOS SALEN LOS PRÓXIMOS VIDEOS" }]} out={A.masLargo - 0.3} y={965} size={50} />,
    <Ask key="ask" t={t} out={990.3} y={320} qs={[{ at: A.masLargo, txt: "¿CUÁNTO DURÓ TU APAGÓN MÁS LARGO?" }, { at: A.primeroP, txt: "¿QUÉ SE TE ECHÓ A PERDER PRIMERO?" }]} />,
    <Subscribe key="sub" t={t} at={A.suscribete - 0.2} bellAt={A.campanita} out={996.0} y={900} />,
    <Head key="mide" t={t} at={A.mide} out={TEND} text="MIDE." y={440} size={180} col={G} />,
  ];
};

// tomas para la mezcla: cada CL arranca su audio nativo en `a` y suena hasta el próximo beat
export const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3) })).filter((x) => x.k);
export const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(2), tr: b.tr, k: b.k ?? "" }));

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < T0) return null;   // hasta 65,6 manda el minuto 1
  let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++;
  const b = BEATS[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(b.tr, k, BEATS[i - 1].r(t), b.r(t), b.p ?? [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const fin = 1 - e(t, TEND - 0.7, TEND - 0.05);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        {base}
        {pieces(t)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
