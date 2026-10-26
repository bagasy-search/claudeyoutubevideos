import React from "react";
import { C } from "./kit";
import { SUELO } from "./mundo";
import { cam, act, o, w, wi, fee, s, trampa, Y, YO, CARCELERO, JUEZ, REY, PRESO } from "./base";
import { Nube, Ojos } from "./extras";
import type { Pose } from "./motor";
import type { Ropa } from "./persona";

// ═══ TRAMPA 5 · LA FIEBRE (469.83-620.8) y TRAMPA 6 · LA DEUDA (620.85-734.7)

trampa(469.83);
cam(469.7, 3650, Y.baja - 330, 1.0, 0.7);
s(469.6, "whoosh_big", -3); s(469.83, "slam", 0); s(469.9, "boom", -5);
o(469.9, "grande", { txt: "TRAP #5", y: 420, s: 170, c: C.oro, t1: 472.1 });
o(471.0, "chip", { txt: "THE FEVER", x: 960, y: 620, c: C.lima, tinta: C.noche, s: 84, t1: 472.1 });
o(472.6, "chip", { txt: "IT KILLED MORE THAN...", x: 960, y: 140, c: C.violeta, s: 60, t1: 477.3 });
o(473.9, "ico", { ico: "llave", x: 520, y: 520, s: 0.9, txt: "X", tag: "ANY JAILER", t1: 477.3 });
o(474.6, "ico", { ico: "mazo", x: 960, y: 520, s: 0.9, txt: "X", tag: "ANY JUDGE", t1: 477.3 });
o(475.6, "ico", { ico: "soga", x: 1400, y: 520, s: 0.9, txt: "X", tag: "ANY ROPE", t1: 477.3 });
s(473.9, "fail", -6); s(474.6, "fail", -6); s(475.6, "fail", -6);
// 477.47 una noche cualquiera, desde adentro
const VN = 3500;
act({ a: 469.7, b: 552.3, x: VN, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "neutro"], [482.2, "miedo"], [489.4, "sorpresa"], [492.9, "miedo"], [499, "triste"], [520.2, "miedo"], [524, "triste"], [527, "dormido"], [531, "miedo"]], ronchas: [521.5, 526] });
cam(477.4, VN, Y.baja - 260, 1.4, 1.0);
o(478.2, "chip", { txt: "ONE ORDINARY NIGHT", x: 960, y: 140, c: C.violeta, s: 62, t1: 481.9 });
act({ a: 477.4, b: 484.2, x: [VN - 330, 2930], tw: [482.0, 483.0], y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: "orgullo", camina: 1.2, manoD: "llave", bD: 60, cD: 60 });
s(482.3, "wood_hit", -2); s(482.7, "metal", -3);
o(482.6, "oscuro", { t1: 498.6, a: 0.45, c: "#05020c" });
o(483.0, "chip", { txt: "SUNSET: LOCKED", x: 960, y: 140, c: C.rojo, s: 60, t1: 486.0 });
wi(484.6, "vela", VN + 160, Y.baja - 280, { s: 0.6, tag: "ONLY IF YOU PAID", c: C.oro, t1: 498.6 });
fee(486.3, 1, "CANDLE");
s(486.3, "coin", -3);
o(489.4, "chip", { txt: "*COUGH*", x: 560, y: 520, c: C.lima, tinta: C.noche, s: 48, rot: -8, t1: 491.0 });
o(490.7, "chip", { txt: "\"MY BLANKET!\"", x: 1420, y: 460, c: C.rosa, s: 48, rot: 6, t1: 492.6 });
s(489.5, "gasp", -4);
w(493.0, "chip", { txt: "DAMP STRAW", x: VN, y: Y.baja + 30, c: C.ambar, tinta: C.noche, s: 30, t1: 497.4 });
o(495.0, "chip", { txt: "...AND IT MOVES", x: 960, y: 900, c: C.rojo, s: 56, t1: 497.6 });
s(495.0, "cricket", -8); s(495.4, "step", -14);
o(497.7, "chip", { txt: "THAT IS THE ROOM", x: 960, y: 140, c: C.violeta, s: 60, t1: 498.8 });
// 498.87 ahora le sumamos lo que mata
cam(498.8, 3650, Y.baja - 330, 0.95, 0.9);
for (let i = 0; i < 14; i++)
  act({ a: 499.0, b: 552.3, x: 2980 + ((i * 97) % 1380), y: Y.baja + (i % 3) * 6, h: 340 + (i % 4) * 25, ropa: PRESO(i), seed: 200 + i, aparece: 502.3 + i * 0.07, flip: i % 2 === 1,
    expr: [[0, "triste"], [520, "miedo"], [528 + (i % 5), "dormido"]], ronchas: [520.5 + (i % 4) * 0.4, 524], rot: i % 4 === 0 ? [0, 90] : 0, tw: [526 + i * 0.1, 526.6 + i * 0.1] });
s(502.4, "popcluster", -3);
o(502.3, "cuenta", { de: 10, a: 40, dur: 0.7, x: 1500, y: 300, s: 200, c: C.rojo, t1: 504.8 });
o(502.9, "chip", { txt: "PEOPLE · ROOM FOR 10", x: 1500, y: 460, c: C.violeta, s: 44, t1: 504.8 });
o(505.0, "chip", { txt: "NO WINDOWS THAT OPEN", x: 960, y: 140, c: C.rojo, s: 60, t1: 506.7 });
w(506.8, "ico", { ico: "paja", x: 3300, y: Y.baja - 120, s: 0.7, tag: "SINCE SPRING", c: C.lima, t1: 509.9 });
cam(510.0, 4180, Y.baja - 200, 1.6, 0.6);
w(510.0, "chip", { txt: "ONE BUCKET", x: 4195, y: Y.baja - 380, c: C.rojo, s: 40, t1: 511.0 });
s(510.0, "drop", -3); s(510.3, "drone", -10);
cam(511.0, 3650, Y.baja - 300, 1.1, 0.8);
o(511.2, "ico", { ico: "jabon", x: 560, y: 330, s: 0.9, txt: "X", tag: "WASHING COSTS MONEY", t1: 516.8 });
for (let i = 0; i < 10; i++) w(513.5 + i * 0.12, "ico", { ico: "piojo", x: 3100 + i * 120, y: Y.baja - 200 - (i % 3) * 80, s: 0.25, anim: "pop", t1: 516.8 });
o(514.0, "grande", { txt: "LICE", y: 330, s: 170, c: C.lima, t1: 516.8 });
s(514.0, "slam", -2); s(514.4, "popcluster", -4); s(515.0, "cricket", -6);
// 516.99 la fiebre de la cárcel: cabeza, fiebre, ronchas, delirio, muerte
o(517.0, "grande", { txt: "GAOL FEVER", y: 260, s: 150, c: C.lima, t1: 520.0 });
s(517.0, "boom", -3); s(517.2, "drone", -8);
cam(520.1, VN, Y.baja - 280, 1.6, 0.9);
o(520.3, "ico", { ico: "rayo", x: 400, y: 300, s: 0.7, tag: "HEADACHE", t1: 527.9 });
o(521.0, "ico", { ico: "termometro", x: 400, y: 500, s: 0.7, tag: "BURNING", c: C.rojo, t1: 527.9 });
o(522.6, "chip", { txt: "RASH", x: 400, y: 680, c: C.rojo, s: 48, t1: 527.9 });
o(524.4, "chip", { txt: "DELIRIUM", x: 1500, y: 300, c: C.violeta, s: 48, rot: 7, t1: 527.9 });
o(526.4, "ico", { ico: "craneo", x: 1500, y: 560, s: 0.9, tag: "VERY OFTEN DEATH", c: C.rojo, t1: 527.9 });
s(520.3, "heart", -4); s(521.0, "heart", -4); s(522.6, "pop", -3); s(524.4, "riser", -8); s(526.4, "heart", -2);
w(524.2, "emote", { emo: "susto", x: VN, y: Y.baja - 500, s: 1.2 });
// 528.11 hoy: tifus por los piojos · antes: el «mal aire»
cam(528.0, 3650, Y.baja - 320, 1.0, 0.9);
o(528.2, "chip", { txt: "TODAY WE KNOW:", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 58, t1: 532.8 });
o(529.3, "grande", { txt: "TYPHUS", y: 330, s: 160, c: C.lima, t1: 532.8 });
o(530.5, "ico", { ico: "piojo", x: 960, y: 640, s: 1.0, tag: "CARRIED BY BODY LICE", c: C.violeta, t1: 532.8 });
s(529.3, "slam", -2);
o(533.0, "chip", { txt: "BACK THEN: \"BAD AIR\"", x: 960, y: 140, c: C.ambar, tinta: C.noche, s: 60, t1: 538.4 });
o(535.0, "chip", { txt: "FOUL VAPORS", x: 960, y: 900, c: C.lima, tinta: C.noche, s: 56, t1: 538.4 });
s(533.2, "wind", -8);
// 538.53 1414: la fiebre mata al carcelero de Newgate
cam(538.5, 2600, Y.baja - 300, 1.2, 0.6);
o(539.0, "cuenta", { de: 1400, a: 1414, dur: 0.6, x: 1500, y: 300, s: 200, c: C.oro, t1: 543.0 });
act({ a: 538.5, b: 552.3, x: 2430, y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "orgullo"], [543.5, "miedo"], [545.5, "dormido"]], ronchas: [543, 545], rot: [0, -90], tw: [545.4, 545.9] });
s(545.6, "fall", -3); s(545.9, "punch", -4);
o(544.0, "chip", { txt: "THE KEEPER HIMSELF", x: 960, y: 140, c: C.rojo, s: 62, t1: 548.0 });
o(546.2, "chip", { txt: "+ DOZENS OF PRISONERS", x: 960, y: 900, c: C.violeta, s: 56, t1: 548.0 });
o(548.1, "grande", { txt: "KILLED BY HIS OWN JAIL", x: 1000, y: 120, s: 64, c: C.rojo, fijo: true, t1: 550.4 });
s(548.1, "stamp", 0);
o(550.4, "chip", { txt: "THE MOMENT I PROMISED YOU", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 60, t1: 552.3 });
s(550.4, "riser", -6);
// 552.43 Oxford, 1577: Rowland Jenks, encuadernador
cam(552.3, 5900, SUELO - 420, 0.8, 1.6);
s(552.2, "whoosh_big", -2);
o(552.9, "chip", { txt: "OXFORD", x: 960, y: 140, c: C.violeta, s: 66, t1: 556.4 });
o(553.5, "cuenta", { de: 1500, a: 1577, dur: 0.6, x: 960, y: 330, s: 200, c: C.oro, t1: 556.4 });
const JENKS: Ropa = { ...PRESO(1), tunica: "#8a6a3a", tunica2: "#5a4020" };
act({ a: 552.3, b: 613.6, x: [5300, 5880], tw: [560.4, 562.2], y: Y.sala, h: 420, ropa: JENKS, seed: 221, expr: [[0, "neutro"], [556.4, "enojado"], [560.3, "miedo"], [567.0, "sorpresa"], [570, "triste"]], manoD: "libro", bD: 40, cD: 50, camina: 0 });
w(555.5, "chip", { txt: "ROWLAND JENKS · BOOKBINDER", x: 5300, y: Y.sala - 520, c: C.ambar, tinta: C.noche, s: 32, t1: 558.4 });
o(558.0, "ico", { ico: "corona", x: 1500, y: 600, s: 0.8, tag: "SPOKE AGAINST THE QUEEN", c: C.rojo, t1: 560.2 });
s(558.0, "gasp", -6);
// 560.25 lo suben de la cárcel a una sala llena
cam(560.2, 6000, SUELO - 440, 0.85, 1.0);
for (let i = 0; i < 6; i++)
  act({ a: 560.2, b: 613.6, x: 5080 + i * 85, y: Y.jurado, h: 300, ropa: PRESO(i + 3), seed: 230 + i, flip: true, expr: [[0, "neutro"], [569.2, "miedo"], [576.3 + i * 0.15, "dormido"]], ronchas: [569.5, 572], rot: [0, i % 2 ? 22 : -22], tw: [576.3 + i * 0.15, 576.7 + i * 0.15] });
const SHERIFF: Ropa = { ...REY, tunica: "#2a6a3a", tunica2: "#14401f" };
act({ a: 560.2, b: 613.6, x: 6700, y: Y.estrado, h: 400, ropa: JUEZ, seed: 151, sobre: "cofia", viejo: true, flip: true, expr: [[0, "orgullo"], [569.2, "miedo"], [573.4, "dormido"]], ronchas: [569.6, 572.5], rot: [0, -28], tw: [573.5, 574.0], habla: [[565.3, 568.6]], manoD: "mazo", bD: 110, cD: 40 });
act({ a: 560.2, b: 613.6, x: 6250, y: Y.sala, h: 420, ropa: SHERIFF, seed: 241, sobre: "sombrero", flip: true, expr: [[0, "neutro"], [569.2, "miedo"], [574.9, "dormido"]], ronchas: [570, 573], rot: [0, -85], tw: [574.9, 575.4] });
for (let i = 0; i < 5; i++)
  act({ a: 560.2, b: 613.6, x: 4980 + i * 70 + (i > 2 ? 1700 : 0), y: Y.sala, h: 360, ropa: PRESO(i + 8), seed: 250 + i, aparece: 560.3 + i * 0.08, expr: [[0, "neutro"], [569.2, "miedo"]], ronchas: [570, 573] });
s(560.4, "march", -6); s(561.2, "street", -14);
o(565.3, "chip", { txt: "THE TRIAL WENT BADLY", x: 960, y: 140, c: C.rojo, s: 60, t1: 567.0 });
o(567.0, "ico", { ico: "oreja", x: 960, y: 330, s: 1.2, tag: "SENTENCE: LOSE HIS EARS", c: C.rojo, t1: 569.0 });
s(567.0, "slam", -2); s(567.3, "gasp", -4);
o(569.2, "chip", { txt: "WITHIN A FEW DAYS...", x: 960, y: 140, c: C.lima, tinta: C.noche, s: 60, t1: 573.2 });
s(569.4, "drone", -6); s(570.0, "wind", -10);
w(573.5, "ico", { ico: "craneo", x: 6700, y: Y.estrado - 520, s: 0.5, tag: "THE CHIEF JUDGE", c: C.rojo, t1: 583 });
w(574.9, "ico", { ico: "craneo", x: 6250, y: Y.sala - 520, s: 0.5, tag: "THE SHERIFF", c: C.rojo, t1: 583 });
w(576.3, "ico", { ico: "craneo", x: 5300, y: Y.jurado - 420, s: 0.5, tag: "THE JURY", c: C.rojo, t1: 583 });
s(573.5, "fall", -4); s(574.9, "fall", -4); s(576.3, "fall", -4); s(576.6, "fall", -6);
o(577.7, "oscuro", { t1: 583.0, a: 0.62 });
o(578.0, "cuenta", { de: 0, a: 300, dur: 2.0, x: 960, y: 360, s: 240, c: C.rojo, pre: "~", t1: 583.0 });
o(579.5, "chip", { txt: "DEAD IN OXFORD", x: 960, y: 540, c: C.violeta, s: 58, t1: 583.0 });
for (let i = 0; i < 8; i++) s(578.1 + i * 0.24, "tick", -6);
o(583.1, "grande", { txt: "THE BLACK ASSIZE", y: 400, s: 140, c: C.rojo, t1: 585.0 });
o(583.1, "oscuro", { t1: 590.0, a: 0.55 });
s(583.1, "slam", 0); s(583.2, "boom", -2);
// 585.11 jail → court → home
cam(585.0, 5500, SUELO - 400, 0.72, 1.2);
for (let i = 0; i < 8; i++) w(585.3 + i * 0.25, "ico", { ico: "piojo", x: 5900, y: SUELO - 300, x2: 4500 - i * 260, y2: SUELO - 520 - (i % 3) * 120, anim: "vuela", dur: 1.2, s: 0.35, t1: 590.0 });
o(585.6, "chip", { txt: "JAIL → COURT", x: 600, y: 140, c: C.lima, tinta: C.noche, s: 56, t1: 590.0 });
o(587.8, "chip", { txt: "COURT → HOME", x: 1320, y: 140, c: C.rojo, s: 56, t1: 590.0 });
s(585.4, "swish", -4); s(587.8, "swish", -4);
// 590.13 otra vez: Exeter 1580s, Old Bailey 1750s, John Howard
o(590.2, "chip", { txt: "IT HAPPENED AGAIN", x: 960, y: 140, c: C.violeta, s: 62, t1: 593.2 });
o(591.4, "ico", { ico: "calendario", x: 520, y: 450, s: 0.8, tag: "EXETER · 1580s", t1: 600.0 });
o(593.3, "ico", { ico: "calendario", x: 960, y: 450, s: 0.8, tag: "OLD BAILEY · 1750s", t1: 600.0 });
s(591.4, "pop", -3); s(593.3, "pop", -3);
o(596.8, "ico", { ico: "corona", x: 1400, y: 450, s: 0.8, tag: "LORD MAYOR + 2 JUDGES", c: C.rojo, t1: 600.0 });
s(596.8, "fail", -4);
cam(600.0, 2500, Y.baja - 300, 1.05, 1.0);
cam(601.2, 4100, Y.baja - 300, 1.05, 10.6);
s(599.9, "whoosh_big", -3);
const HOWARD: Ropa = { tunica: "#2a2a3a", tunica2: "#14141f", cinto: "#c9a23a", piel: "#f2c0a0", piel2: "#d89a7a", pelo: "#d8d8d8" };
act({ a: 600.0, b: 620.7, x: [2300, 4300], tw: [600.4, 612.0], y: Y.baja, h: 430, ropa: HOWARD, seed: 261, sobre: "sombrero", expr: [[0, "neutro"], [606, "sorpresa"], [609.5, "triste"]], camina: 1.0, manoD: "lupa", bD: 80, cD: 50 });
o(600.6, "chip", { txt: "JOHN HOWARD · 1770s", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 60, t1: 604.6 });
o(603.0, "cuenta", { de: 0, a: 300, dur: 1.4, x: 1500, y: 330, s: 160, c: C.oro, suf: "+ JAILS", t1: 606.6 });
for (let i = 0; i < 5; i++) s(600.6 + i * 1.1, "step", -10);
o(606.7, "chip", { txt: "A CHILLING CONCLUSION", x: 960, y: 140, c: C.rojo, s: 60, t1: 609.4 });
o(609.5, "ico", { ico: "piojo", x: 620, y: 520, s: 1.6, tag: "JAIL FEVER", c: C.lima, t1: 613.5 });
o(610.2, "chip", { txt: "KILLED MORE THAN", x: 960, y: 520, c: C.violeta, s: 44, t1: 613.5 });
o(610.9, "ico", { ico: "soga", x: 1300, y: 520, s: 0.8, tag: "THE HANGMAN", c: C.rojo, t1: 613.5 });
s(609.5, "slam", -2); s(610.9, "swish", -4);
// 613.67 lo más peligroso del tribunal: el preso rascándose
cam(613.6, 5900, Y.sala - 300, 1.3, 1.1);
wi(615.6, "piojo", 6080, Y.sala - 330, { s: 0.55, anim: "gira", t1: 620.6 });
s(615.6, "pop", -4);
act({ a: 613.6, b: 620.7, x: 5880, y: Y.sala, h: 430, ropa: PRESO(4), seed: 271, expr: "neutro", ronchas: [613.6, 614], bD: 140, cD: 150, aparece: 613.6 });
o(614.5, "chip", { txt: "NOT THE JUDGE", x: 960, y: 140, c: C.violeta, s: 60, t1: 617.0 });
o(617.0, "sello", { txt: "THE PRISONER", x: 960, y: 260, s: 110 });
s(617.0, "stamp", 0);
w(618.6, "chip", { txt: "*SCRATCH SCRATCH*", x: 5880, y: Y.sala - 560, c: C.lima, tinta: C.noche, s: 34, rot: -6, t1: 620.7 });
for (let i = 0; i < 6; i++) s(618.6 + i * 0.3, "paper", -10);

// ═══ TRAMPA 6 · LA DEUDA (620.85)
trampa(620.85);
cam(620.7, 500, SUELO - 330, 1.0, 1.8);
s(620.5, "whoosh_big", -2); s(620.85, "slam", 0); s(620.9, "boom", -5);
o(620.9, "grande", { txt: "TRAP #6", y: 420, s: 170, c: C.oro, t1: 623.4 });
o(622.0, "chip", { txt: "THE DEBT", x: 960, y: 620, c: C.rojo, s: 84, t1: 623.4 });
act({ a: 620.7, b: 641.6, x: 700, y: Y.calle, h: 430, ropa: YO, seed: 1, expr: [[0, "neutro"], [627.1, "orgullo"], [629.7, "triste"], [634, "miedo"]] });
const PANADERO: Ropa = { tunica: "#f4f0e8", tunica2: "#c8c0b0", cinto: "#c98f4a", piel: "#f0b890", piel2: "#d08a66", pelo: "#3a2418" };
act({ a: 620.7, b: 641.6, x: 300, y: Y.calle, h: 450, ropa: PANADERO, seed: 281, expr: [[0, "enojado"]], manoD: "pan", bD: 40, cI: 0, bI: 100, habla: [[623.8, 626.8], [632, 634]], salta: [624.0, 636.2] });
w(623.8, "globo", { x: 700, y: Y.calle - 520, txt: "11 SHILLINGS", icos: ["moneda"], s: 32, hx: 0.3, t1: 627.0 });
o(627.1, "ico", { ico: "cuchilla", x: 520, y: 330, s: 0.8, txt: "X", tag: "NOT A THIEF", t1: 631.4 });
o(628.5, "ico", { ico: "craneo", x: 960, y: 330, s: 0.8, txt: "X", tag: "NOT A MURDERER", t1: 631.4 });
o(629.7, "ico", { ico: "pan", x: 1400, y: 330, s: 0.8, tag: "OWES A BAKER", c: C.ambar, t1: 631.4 });
s(627.1, "pop", -3); s(628.5, "pop", -3); s(629.7, "pop", -3);
o(631.6, "cuenta", { de: 1200, a: 1285, dur: 0.6, x: 1500, y: 300, s: 200, c: C.oro, t1: 636.0 });
o(633.0, "chip", { txt: "A MERCHANT COULD JAIL YOU", x: 960, y: 140, c: C.rojo, s: 56, t1: 639.8 });
o(636.2, "sello", { txt: "UNTIL PAID IN FULL", x: 960, y: 820, s: 90 });
s(636.2, "stamp", 0);
// 639.93 el círculo vicioso
cam(639.9, 3400, Y.baja - 300, 1.2, 1.6);
s(639.8, "whoosh_big", -3);
act({ a: 639.9, b: 656.0, x: 3400, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "triste"], [649.1, "miedo"], [654.2, "enojado"]], salta: [654.25, 654.95, 655.55], inclina: 8 });
o(640.0, "chip", { txt: "SEE THE PROBLEM?", x: 960, y: 140, c: C.violeta, s: 60, t1: 641.1 });
o(641.2, "chip", { txt: "1 · IN PRISON FOR DEBT", x: 960, y: 260, c: C.rojo, s: 48, t1: 649.0 });
o(643.4, "chip", { txt: "2 · CAN'T EARN IN PRISON", x: 1440, y: 620, c: C.violeta, s: 48, t1: 649.0 });
o(646.2, "chip", { txt: "3 · RENT EVERY NIGHT", x: 480, y: 620, c: C.ambar, tinta: C.noche, s: 48, t1: 649.0 });
s(641.2, "pop", -3); s(643.4, "pop", -3); s(646.2, "pop", -3);
fee(646.6, 2, "RENT");
// el carcelero viene a cobrar la renta: cada «DAY.» le saca una moneda más
act({ a: 646.3, b: 656.0, x: [2900, 3120], tw: [646.3, 647.2], y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "orgullo"], [650.5, "feliz"]], camina: 1.0, manoD: "bolsa", bD: 70, cD: 60, habla: [[647.3, 648.6]], aparece: 646.3 });
for (const [k, tt] of [646.7, 654.25, 654.95, 655.55].entries()) w(tt, "ico", { ico: "moneda", x: 3360, y: Y.baja - 300, x2: 3170, y2: Y.baja - 330, anim: "vuela", dur: 0.45, s: 0.3, t1: tt + 0.5 + k * 0 });
s(646.8, "coin", -3); s(654.3, "coin", -4); s(655.0, "coin", -4); s(655.6, "coin", -2);
o(649.1, "ico", { ico: "pan", x: 560, y: 380, s: 0.9, tag: "BAKER: SAME", c: C.ambar, t1: 656.0 });
o(650.5, "ico", { ico: "llave", x: 1360, y: 380, s: 0.9, tag: "JAILER: GROWS", c: C.rojo, t1: 656.0 });
s(650.5, "riser", -8);
o(654.2, "grande", { txt: "EVERY.", y: 520, s: 120, c: C.rojo, t1: 656.1 });
o(654.9, "grande", { txt: "SINGLE.", y: 680, s: 130, c: C.rojo, t1: 656.1 });
o(655.5, "grande", { txt: "DAY.", y: 850, s: 150, c: C.rojo, t1: 656.1 });
fee(654.2, 1, "RENT"); fee(654.9, 1, "RENT"); fee(655.5, 1, "RENT");
s(654.2, "slam", -2); s(654.9, "slam", -2); s(655.5, "slam", 0);
// 656.13 la reja de mendigar de la Fleet
cam(656.0, 8450, SUELO - 380, 1.1, 1.6);
s(655.9, "whoosh_big", -2);
o(656.6, "chip", { txt: "THE FLEET: THE BEGGING GRATE", x: 960, y: 140, c: C.violeta, s: 58, t1: 659.2 });
act({ a: 656.0, b: 675.6, x: 8560, y: Y.fleetB, h: 420, ropa: YO, seed: 1, flip: true, expr: [[0, "triste"], [667.7, "neutro"], [669.7, "triste"]], habla: [[667.7, 669.6]], bD: 100, cD: 10 });
w(666.0, "ico", { ico: "bolsa", x: 8300, y: Y.fleetB - 330, s: 0.65, anim: "gira", t1: 675.6 });
for (let i = 0; i < 3; i++)
  act({ a: 659.3, b: 668.0, x: [7760 - i * 130, 8320 - i * 200], tw: [659.4 + i * 0.6, 662.0 + i * 0.6], y: Y.calle, h: 400, ropa: PRESO(i + 11), seed: 290 + i, expr: [[0, "neutro"], [664, "triste"]], camina: 1.0, flip: false });
o(660.0, "chip", { txt: "DEBTORS TOOK TURNS", x: 960, y: 140, c: C.ambar, tinta: C.noche, s: 58, t1: 665.0 });
o(667.75, "grande", { txt: "PRAY REMEMBER", y: 330, s: 110, c: C.oro, t1: 669.6 });
o(668.4, "grande", { txt: "THE POOR PRISONERS!", y: 470, s: 100, c: C.oro, t1: 669.6 });
s(667.75, "riser", -10);
cam(666.0, 8500, Y.fleetB - 300, 1.4, 3.0);
o(669.8, "chip", { txt: "FOR YEARS", x: 960, y: 140, c: C.violeta, s: 60, t1: 673.7 });
o(671.6, "cuenta", { de: 1, a: 12, dur: 1.0, x: 1500, y: 330, s: 200, c: C.oro, suf: " YRS", t1: 673.7 });
o(673.9, "ico", { ico: "craneo", x: 1500, y: 330, s: 0.9, tag: "THE REST OF THEIR LIVES", c: C.rojo, t1: 675.6 });
s(673.9, "sad", -6);
// 675.75 las familias se mudan adentro: un barrio dentro de los muros
cam(675.6, 9100, SUELO - 420, 0.8, 1.2);
const ESPOSA: Ropa = { tunica: "#c9673f", tunica2: "#8c4021", cinto: "#3a2418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#4a2a17" };
act({ a: 675.6, b: 690.2, x: 8800, y: Y.fleetB, h: 420, ropa: YO, seed: 1, expr: [[0, "sorpresa"], [681, "triste"]] });
act({ a: 676.6, b: 690.2, x: 8960, y: Y.fleetB, h: 400, ropa: ESPOSA, seed: 301, sobre: "cofia", expr: "triste", aparece: 676.6, flip: true });
act({ a: 677.0, b: 690.2, x: 9090, y: Y.fleetB, h: 240, ropa: PRESO(13), seed: 302, expr: "neutro", aparece: 677.0, flip: true });
act({ a: 677.3, b: 690.2, x: 9190, y: Y.fleetB, h: 210, ropa: PRESO(14), seed: 303, expr: "feliz", aparece: 677.3, flip: true });
s(676.6, "pop", -3); s(677.0, "pop", -4); s(677.3, "pop", -4);
w(677.6, "ico", { ico: "casa", x: 9600, y: SUELO - 520, s: 0.6, txt: "X", tag: "NO HOUSE OUTSIDE", t1: 680.4 });
o(680.5, "chip", { txt: "A NEIGHBORHOOD INSIDE THE WALLS", x: 960, y: 140, c: C.violeta, s: 54, t1: 687.4 });
for (let i = 0; i < 5; i++)
  act({ a: 681.0, b: 690.2, x: 8700 + i * 220, y: Y.fleetA, h: 300 - (i % 2) * 70, ropa: PRESO(15 + i), seed: 310 + i, expr: i % 2 ? "feliz" : "neutro", aparece: 681.6 + i * 0.25, flip: i % 2 === 0 });
w(684.6, "chip", { txt: "WIVES", x: 8700, y: SUELO - 870, c: C.rosa, s: 34, t1: 690.2 });
w(685.4, "chip", { txt: "CHILDREN", x: 9100, y: SUELO - 870, c: C.lima, tinta: C.noche, s: 34, t1: 690.2 });
w(686.1, "chip", { txt: "SHOPS!", x: 9500, y: SUELO - 870, c: C.oro, tinta: C.noche, s: 34, t1: 690.2 });
s(684.6, "pop", -4); s(685.4, "pop", -4); s(686.1, "ding", -4);
o(687.75, "chip", { txt: "ON A DEBT THAT NEVER SHRINKS", y: 400, c: C.rojo, s: 52, t1: 690.2 });
// 690.29 Ludgate: arriba los que pagan, abajo los que no
cam(690.2, 7900, SUELO - 300, 0.55, 1.2);
o(690.8, "grande", { txt: "LUDGATE", y: 230, s: 140, c: C.oro, t1: 694.0 });
s(690.8, "slam", -2);
o(692.2, "chip", { txt: "FOR DEBTORS (FREEMEN)", x: 960, y: 380, c: C.violeta, s: 52, t1: 695.6 });
o(695.7, "chip", { txt: "A GATE IN THE OLD CITY WALL", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 56, t1: 698.9 });
act({ a: 698.9, b: 706.6, x: 7800, y: Y.ludA, h: 380, ropa: REY, seed: 321, expr: "feliz", manoD: "copa", bD: 70, cD: 70 });
act({ a: 698.9, b: 706.6, x: 7980, y: Y.ludA, h: 360, ropa: { ...REY, tunica: "#8a2b9f" }, seed: 322, expr: "orgullo", flip: true });
act({ a: 698.9, b: 706.6, x: 7850, y: Y.ludB, h: 380, ropa: YO, seed: 1, expr: [[0, "triste"], [701.6, "enojado"]], bI: 150, cI: 20, salta: [701.7] });
cam(698.9, 7900, SUELO - 260, 0.68, 5.0);
act({ a: 698.9, b: 706.6, x: 8050, y: Y.ludB, h: 360, ropa: PRESO(20), seed: 323, expr: "triste", flip: true });
w(699.4, "chip", { txt: "ABOVE: CAN PAY", x: 7900, y: Y.ludA - 470, c: C.oro, tinta: C.noche, s: 40, t1: 706.6 });
w(701.6, "chip", { txt: "BELOW: CANNOT", x: 7900, y: Y.ludB + 90, c: C.rojo, s: 40, t1: 706.6 });
s(699.4, "ding", -4); s(701.6, "fail", -6);
o(703.7, "chip", { txt: "SAME GATE · SAME DEBT", x: 960, y: 140, c: C.violeta, s: 58, t1: 706.6 });
o(705.2, "chip", { txt: "VERY DIFFERENT NIGHT", x: 960, y: 250, c: C.rojo, s: 52, t1: 706.6 });
// 706.67 ¿la salida? caridad, un amigo, un milagro
cam(706.6, 3600, Y.baja - 300, 1.1, 1.6);
s(706.5, "whoosh_big", -3);
act({ a: 706.6, b: 734.7, x: 3500, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "neutro"], [708, "feliz"], [714.3, "sorpresa"], [721, "feliz"], [730.4, "triste"]], salta: [729.0] });
o(706.8, "chip", { txt: "THE WAY OUT?", x: 960, y: 140, c: C.violeta, s: 60, t1: 715.3 });
o(708.1, "ico", { ico: "pergamino", x: 480, y: 450, s: 0.9, tag: "CHARITY · A WILL", t1: 715.3 });
o(713.4, "ico", { ico: "corazon", x: 960, y: 450, s: 0.9, tag: "A FRIEND", c: C.rosa, t1: 715.3 });
o(714.3, "ico", { ico: "estrella", x: 1440, y: 450, s: 0.9, tag: "A MIRACLE", c: C.oro, t1: 715.3 });
s(708.1, "paper", -3); s(713.4, "pop", -3); s(714.3, "sparkle", -2);
// 715.39 Dick Whittington reconstruye Newgate
cam(715.3, 2900, Y.baja - 380, 0.75, 1.0);
const DICK: Ropa = { tunica: "#c81d2e", tunica2: "#7a0f1d", cinto: "#f7c548", piel: "#f2c0a0", piel2: "#d89a7a", pelo: "#a0602c" };
act({ a: 715.3, b: 727.0, x: [1800, 2500], tw: [715.4, 717.4], y: Y.calle, h: 440, ropa: DICK, seed: 331, sobre: "sombrero", expr: "feliz", camina: 1.0, manoD: "bolsa", bD: 60, cD: 40 });
w(716.4, "ico", { ico: "gato", x: 2330, y: Y.calle - 70, s: 0.4, t1: 727 });
o(716.6, "chip", { txt: "RICHARD WHITTINGTON", x: 960, y: 140, c: C.rojo, s: 62, t1: 720.0 });
o(717.8, "chip", { txt: "MAYOR OF LONDON", x: 960, y: 250, c: C.oro, tinta: C.noche, s: 48, t1: 720.0 });
for (let i = 0; i < 10; i++) w(720.3 + i * 0.12, "ico", { ico: "moneda", x: 2500, y: Y.calle - 300, x2: 2400 + i * 200, y2: SUELO - 1200 + (i % 3) * 200, anim: "vuela", dur: 0.8, s: 0.35, t1: 721.6 + i * 0.12 });
s(720.3, "coin_rain", -3);
w(721.4, "emote", { emo: "brillos", x: 3200, y: SUELO - 1300, s: 3.0 });
o(721.4, "sello", { txt: "NEWGATE REBUILT", x: 960, y: 300, s: 110, c: C.oro });
s(721.4, "stamp", 0); s(721.6, "sparkle", -2); s(722.0, "glitter", -3);
o(723.6, "chip", { txt: "THE OLD ONE WAS KILLING PEOPLE", x: 960, y: 920, c: C.lima, tinta: C.noche, s: 52, t1: 726.9 });
cam(727.0, 3320, Y.baja - 300, 1.3, 0.9);
// Whittington entra y te deja la bolsa: alegría... pero la puerta sigue cerrada
act({ a: 727.0, b: 734.7, x: [2900, 3180], tw: [727.1, 728.2], y: Y.baja, h: 440, ropa: DICK, seed: 331, sobre: "sombrero", expr: [[0, "feliz"], [730.4, "triste"]], camina: 1.0, manoD: "bolsa", bD: 90, cD: 20, habla: [[728.3, 729.6]], aparece: 727.0 });
w(728.5, "ico", { ico: "bolsa", x: 3260, y: Y.baja - 330, x2: 3420, y2: Y.baja - 300, anim: "vuela", dur: 0.5, s: 0.45, t1: 730.4 });
s(728.5, "coin", -2);
o(727.0, "chip", { txt: "A GREAT ACT OF KINDNESS", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 60, t1: 730.3 });
s(727.0, "fanfare", -10);
o(730.5, "ico", { ico: "llave", x: 560, y: 450, s: 0.9, txt: "X", tag: "NOT FREEDOM", t1: 734.6 });
o(731.6, "ico", { ico: "cama", x: 1360, y: 450, s: 0.9, tag: "JUST A ROOM THAT WON'T KILL YOU", c: C.lima, t1: 734.6 });
s(730.5, "fail", -4); s(731.6, "pop", -3);

export const X3 = (t: number, _c: Pose): React.ReactNode => (
  <>
    {/* el aire «podrido» de la sala común y la fiebre que se esparce */}
    <Nube t={t} t0={517.0} t1={521.0} t2={537.5} x={3650} y={Y.baja - 250} r={700} seed={5} />
    <Nube t={t} t0={569.3} t1={573.0} t2={577.4} x={5900} y={SUELO - 420} r={900} seed={9} op={0.25} />
    <Nube t={t} t0={543.0} t1={545.0} t2={548.0} x={2430} y={Y.baja - 220} r={300} seed={6} />
  </>
);
export const P3 = (t: number): React.ReactNode => <Ojos t={t} t0={492.8} t1={498.6} x={1300} y={720} s={0.7} n={5} />;
