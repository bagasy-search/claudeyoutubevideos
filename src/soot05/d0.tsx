import React from "react";
import { C } from "./kit";
import { SUELO, L } from "./mundo";
import { cam, act, o, w, wi, fee, s, trampa, Y, YO, CARCELERO, JUEZ, PRESO } from "./base";
import { Grilletes, Recibo, Nube, Pines, Letrero, Ojos } from "./extras";
import type { Pose } from "./motor";

// ═══ GANCHO 0-52 s: tobillo → cara → Newgate entera → la factura → «welcome» → lo que pagás → la oscuridad →
// el tribunal (inocente pero no salís) → el loop abierto (la fiebre que mató al juez) → el mapa de las 7 trampas.
const YX = 3200; // dónde está «vos» en la sala común

// 0.00 «You are 31 years old» — el grillete se cierra en primerísimo plano y la cámara sube a la cara
cam(0, YX, Y.baja - 40, 4.4);
cam(0.55, YX, Y.baja - 330, 2.7, 1.1);
cam(1.9, YX + 80, Y.baja - 440, 2.0, 0.5);
o(0.12, "flash", { c: "#fff" });
s(0.12, "metal", 2); s(0.14, "slam", 0);
o(0.24, "cuenta", { de: 0, a: 31, dur: 0.5, x: 1500, y: 300, s: 260, c: C.oro, t1: 1.9 });
o(0.78, "chip", { txt: "YEARS OLD", x: 1500, y: 470, c: C.violeta, s: 58, t1: 1.9 });
act({ a: 0, b: 27.7, x: YX, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "miedo"], [1.9, "triste"], [9.6, "sorpresa"], [11.2, "miedo"], [14, "triste"], [21.1, "triste"]], mira: 0.6 });
// 1.94 «You owe a baker 11 shillings» — globo de pensamiento con el panadero
w(2.0, "globo", { x: YX + 120, y: Y.baja - 470, icos: ["pan"], txt: "11 SHILLINGS", s: 40, hx: 0.2, t1: 4.3 });
o(2.74, "sello", { txt: "OWED", x: 470, y: 820, s: 96, rot: -10, t1: 4.3 });
s(2.0, "pop", -2); s(2.74, "stamp", 0);
// 4.36 «And tonight, in a stone room under a London gate» — tirón hacia atrás: Newgate entera de noche
cam(4.3, 2700, SUELO - 640, 0.44, 2.2);
s(4.25, "whoosh_big", -2);
o(4.5, "chip", { txt: "TONIGHT", x: 960, y: 120, c: C.violeta, s: 64 });
o(5.5, "chip", { txt: "A STONE ROOM", x: 300, y: 930, c: C.teal, tinta: C.noche, s: 56, t1: 7.4 });
o(6.6, "chip", { txt: "UNDER A LONDON GATE", x: 1250, y: 930, c: C.rojo, s: 56, t1: 7.4 });
// 7.5 «a man is going to hand you a bill» — entra el carcelero
act({ a: 6.6, b: 52, x: [2560, YX - 260], tw: [7.0, 8.4], y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "orgullo"], [30, "neutro"]], habla: [[8.5, 9.6]], bD: 70, cD: 50 });
cam(7.4, YX - 120, Y.baja - 280, 1.35, 1.0);
w(8.7, "emote", { emo: "excl", x: YX, y: Y.baja - 520, s: 1.3 });
o(8.95, "chip", { txt: "THE BILL", x: 960, y: 120, c: C.rojo, s: 70 });
s(8.7, "unroll", 0);
// 9.62 «for the chains he just locked on your ankles» — la cámara baja a los tobillos
cam(9.65, YX - 60, Y.baja - 70, 2.9, 0.55);
w(10.5, "emote", { emo: "brillos", x: YX - 40, y: Y.baja - 60, s: 0.8 });
fee(9.8, 4, "CHAINS");
s(10.54, "metal", -1);
// 12.14 «Welcome to a medieval prison» — el cartel de hotel con una estrella
cam(12.0, YX - 60, Y.baja - 300, 1.2, 0.8);
s(12.1, "wood_hit", -2); s(12.6, "ding", -2);
// 13.58-20.28 — todo se paga: comida, cama, vela, paja, hierro
wi(14.6, "pan", YX + 260, Y.baja - 260, { s: 0.8, tag: "FOOD", t1: 16.0 });
fee(14.88, 3, "FOOD");
cam(15.9, 2700, Y.alta - 220, 1.7, 0.55);
wi(16.2, "cama", 2560, Y.alta - 300, { s: 0.9, tag: "BED", t1: 17.4 });
fee(16.46, 2, "BED");
act({ a: 15, b: 20, x: 2900, y: Y.alta, h: 400, ropa: PRESO(1), seed: 21, expr: "feliz", manoD: "copa", bD: 60, cD: 60 });
cam(17.35, 3060, Y.alta - 240, 2.0, 0.45);
wi(17.6, "vela", 3080, Y.alta - 330, { s: 0.75, tag: "CANDLE", t1: 18.4 });
fee(17.78, 1, "CANDLE");
cam(18.3, YX + 400, Y.baja - 120, 1.9, 0.45);
wi(18.5, "paja", YX + 420, Y.baja - 230, { s: 1.1, tag: "STRAW", t1: 19.3 });
fee(18.6, 1, "STRAW");
cam(19.3, YX - 20, Y.baja - 250, 1.6, 0.45);
w(19.6, "chip", { txt: "+ IRON", x: YX + 60, y: Y.baja - 160, c: C.rojo, s: 34, t1: 20.9 });
s(19.54, "metal", -2);
// 21.12 «And if you cannot pay» — bolsillos vacíos → al piso, junto al desagüe, a oscuras
cam(21.0, YX, Y.baja - 280, 1.5, 0.7);
wi(21.6, "moneda", YX + 220, Y.baja - 420, { s: 0.6, txt: "X", t1: 22.6 });
s(21.9, "fail", -4);
act({ a: 22.4, b: 27.7, x: YX + 20, y: Y.baja - 70, h: 430, ropa: YO, seed: 1, expr: "triste", rot: 90 });
cam(23.4, YX + 250, Y.baja - 80, 2.2, 0.8);
w(24.1, "chip", { txt: "THE DRAIN", x: YX + 380, y: Y.baja - 150, c: C.teal, tinta: C.noche, s: 30, t1: 25.0 });
o(24.8, "oscuro", { t1: 28.0, a: 0.96 });
s(24.8, "wind", -10); s(25.0, "suspense", -4);
o(26.2, "chip", { txt: "THE PART THAT SOUNDS LIKE A JOKE", x: 960, y: 200, c: C.violeta, s: 54, t1: 27.8 });
// 27.9 «Even if the judge says you are innocent» — luz, vuelo al tribunal
cam(27.75, 6250, SUELO - 520, 0.95, 1.0);
s(27.7, "whoosh_big", -3);
act({ a: 27.7, b: 52, x: 6700, y: Y.estrado, h: 400, ropa: JUEZ, seed: 31, sobre: "cofia", viejo: true, expr: [[0, "neutro"], [40.5, "miedo"]], habla: [[28.3, 29.3]], bD: 120, cD: 40, manoD: "mazo", rot: 0, flip: true });
act({ a: 27.7, b: 30.1, x: 5880, y: Y.sala, h: 430, ropa: YO, seed: 1, expr: [[0, "miedo"], [29.2, "feliz"]], salta: [29.25] });
o(29.16, "sello", { txt: "INNOCENT", c: "#2a9a4a", x: 560, y: 260, s: 120 });
s(29.1, "wood_hit", 0);
// 30.0 «you still cannot walk out» — corre a la puerta; el carcelero la tapa con la mano extendida
act({ a: 30.1, b: 33.9, x: [5880, 5240], tw: [30.1, 31.2], y: Y.sala, h: 430, ropa: YO, seed: 1, expr: [[0, "feliz"], [31.3, "sorpresa"]], camina: 2.2 });
cam(30.2, 5200, SUELO - 330, 1.25, 1.0);
act({ a: 30.8, b: 34, x: 5000, y: Y.sala, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: "orgullo", bD: 100, cD: 0, aparece: 30.8, habla: [[31.7, 33]] });
s(30.8, "spring", -2);
fee(32.6, 6, "ONE MORE FEE");
// 32.3 golpe a pantalla llena (golpe.tsx): INNOCENT. STILL PAYING.
s(32.3, "slam", -1); s(32.65, "boom", -5);
// 33.94 «By the end of this video...» — loop abierto
cam(33.9, 6000, SUELO - 560, 0.72, 1.4);
o(37.02, "sello", { txt: "NOT GUILTY", c: "#2a9a4a", x: 960, y: 300, s: 110, t1: 39.3 });
o(37.7, "ico", { ico: "craneo", x: 960, y: 640, s: 1.4, t1: 39.3 });
o(38.2, "chip", { txt: "DIED INSIDE ANYWAY", x: 960, y: 870, c: C.rojo, s: 60, t1: 39.3 });
s(37.7, "boom", -4);
// 39.44 «and why a single trial in an English town killed the judge, the jury, and nearly everyone»
cam(39.4, 6000, SUELO - 520, 0.9, 1.2);
act({ a: 34, b: 52, x: 5880, y: Y.sala, h: 430, ropa: PRESO(2), seed: 41, expr: "triste", ronchas: [40, 41], ladea: -8 });
o(41.1, "chip", { txt: "AN ENGLISH TOWN", x: 960, y: 120, c: C.violeta, s: 58 });
for (let i = 0; i < 4; i++) act({ a: 33.9, b: 52, x: 5150 + i * 120, y: Y.jurado, h: 300, ropa: PRESO(i + 5), seed: 50 + i, expr: [[0, "neutro"], [41.8, "miedo"]], rot: [0, 90], tw: [43.05 + i * 0.12, 43.35 + i * 0.12] });
for (let i = 0; i < 6; i++) act({ a: 33.9, b: 52, x: 6080 + i * 90 + (i % 2) * 20, y: Y.sala + (i % 2) * 12, h: 380, ropa: PRESO(i + 1), seed: 60 + i, expr: [[0, "neutro"], [42, "miedo"]], flip: true, rot: [0, -90], tw: [44.15 + i * 0.1, 44.45 + i * 0.1] });
w(42.25, "chip", { txt: "THE JUDGE", x: 6700, y: SUELO - 1150, c: C.rojo, s: 40, t1: 45.6 });
w(43.05, "chip", { txt: "THE JURY", x: 5330, y: SUELO - 900, c: C.rojo, s: 40, t1: 45.6 });
w(44.2, "chip", { txt: "EVERYONE WATCHING", x: 6320, y: SUELO - 600, c: C.rojo, s: 40, t1: 45.6 });
s(42.3, "fall", -2); s(43.1, "fall", -3); s(43.4, "fall", -4); s(44.2, "fall", -3); s(44.5, "fall", -4); s(44.8, "fall", -5);
// 46.0 «There are seven traps waiting for you behind that door» — vista de pájaro del mundo entero
cam(45.95, 10200, SUELO - 300, 0.088, 1.5);
s(45.9, "whoosh_big", 0); s(46.0, "riser", -6);
for (let i = 0; i < 7; i++) s(46.32 + 0.22 * i, "tick", -2);
o(47.3, "chip", { txt: "7 TRAPS", x: 960, y: 120, c: C.rojo, s: 72 });
// 48.84 «Let's go in.» — picada a Newgate y adentro
cam(48.75, 1450, SUELO - 520, 1.05, 1.1);
s(48.7, "whoosh_big", -2); s(49.6, "wood_hit", -4);
// 49.8 «Trap number one. The bill.»
trampa(49.8);
o(49.85, "grande", { txt: "TRAP #1", y: 420, s: 170, c: C.oro, t1: 52.2 });
o(51.25, "chip", { txt: "THE BILL", x: 960, y: 620, c: C.rojo, s: 84, t1: 52.2 });
s(49.85, "slam", 0); s(49.9, "boom", -4);
cam(50.7, L.oficina.x, Y.baja - 330, 1.2, 1.0);

// ── piezas especiales del gancho
export const X0 = (t: number, c: Pose): React.ReactNode => (
  <>
    {t < 22.4 && <Grilletes t={t} x={YX} y={Y.baja} h={430} t0={0.12} aX={YX - 260} aY={Y.baja - 120} />}
    {t >= 22.4 && t < 28 && <Grilletes t={t} x={YX + 20} y={Y.baja} h={430} aX={YX - 260} aY={Y.baja - 120} />}
    {t > 8.4 && t < 12.5 && <Recibo t={t} t0={8.75} x={YX - 195} y={Y.baja - 300} largo={290} w={210} items={[["CHAINS", "4d"], ["LOCKING", "1d"], ["KEY", "1d"]]} resalta={t > 9.7 ? 0 : -1} />}
    <Nube t={t} t0={40.0} t1={44.5} t2={45.6} x={5980} y={SUELO - 500} r={900} />
    <Pines t={t} t0={46.1} t1={48.8} z={c.z} P={[[L.oficina.x, SUELO - 700], [L.torre.x, SUELO - 2150], [L.tribunal.x, SUELO - 1450], [L.botella.x, SUELO + 600], [L.comun.x, SUELO - 1600], [L.fleet.x, SUELO - 1250], [L.puerta.x, SUELO - 1600]]} />
  </>
);
export const P0 = (t: number): React.ReactNode => (
  <>
    <Letrero t={t} t0={12.15} t1={14.1} txt="WELCOME" estrellas={1} />
    <Ojos t={t} t0={25.0} t1={27.9} x={1000} y={560} s={1.4} n={6} />
  </>
);
