import React from "react";
import { C, prog } from "./kit";
import { SUELO } from "./mundo";
import { cam, act, o, w, wi, fee, s, trampa, Y, YO, JUEZ, PRESO } from "./base";
import type { Pose } from "./motor";
import type { Ropa } from "./persona";

// ═══ TRAMPA 3 · LA ESPERA (249.46-349) y TRAMPA 4 · EL POZO (349.18-469.8)

// 249.46 Trap number three, the wait
trampa(249.46);
cam(249.3, 3450, Y.baja - 320, 1.1, 1.3);
s(249.2, "whoosh_big", -3); s(249.46, "slam", 0); s(249.5, "boom", -5);
o(249.5, "grande", { txt: "TRAP #3", y: 420, s: 170, c: C.oro, t1: 251.6 });
o(250.7, "chip", { txt: "THE WAIT", x: 960, y: 620, c: C.teal, tinta: C.noche, s: 84, t1: 251.6 });
act({ a: 249.3, b: 282.3, x: 3300, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "neutro"], [253.8, "miedo"], [262, "sorpresa"], [271.8, "triste"], [276.4, "miedo"], [279.8, "triste"]], salta: [264.6] });
w(251.8, "emote", { emo: "preg", x: 3300, y: Y.baja - 500, s: 1.2 });
wi(252.3, "reloj", 3530, Y.baja - 360, { s: 0.7, anim: "gira", t1: 255.2 });
s(252.3, "tick", -4); s(252.8, "tick", -6); s(253.3, "tick", -6);
o(255.3, "sello", { txt: "NOBODY KNOWS", x: 960, y: 250, s: 120 });
s(255.3, "stamp", 0);
// 256.48 los jueces no estaban todo el año: salen de gira
cam(256.4, 6450, SUELO - 640, 1.05, 1.3);
s(256.3, "whoosh_big", -3);
o(257.2, "chip", { txt: "THE ROYAL JUDGES", x: 960, y: 140, c: C.rojo, s: 64, t1: 260.0 });
w(258.2, "chip", { txt: "NOT HERE", x: 6680, y: SUELO - 820, c: C.violeta, s: 44, t1: 260.0 });
for (let i = 0; i < 3; i++)
  act({ a: 259.9, b: 266.3, x: [6400 + i * 160, 7700 + i * 160], tw: [260.2 + i * 0.15, 264.0 + i * 0.15], y: Y.calle, h: 400, ropa: JUEZ, seed: 151 + i, sobre: "cofia", viejo: true, expr: "orgullo", camina: 1.1, manoD: "libro", bD: 40, cD: 40, aparece: 259.9 + i * 0.15 });
cam(259.45, 6650, SUELO - 300, 1.1, 0.45);
cam(260.6, 7850, SUELO - 300, 1.1, 3.4);
o(260.6, "chip", { txt: "ON CIRCUIT", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 64, t1: 264.0 });
o(261.6, "linea", { x: 300, y: 900, x2: 1620, y2: 900, c: C.oro, t1: 264.0 });
for (let i = 0; i < 4; i++) s(260.4 + i * 0.6, "step", -9);
s(261.0, "street", -12);
// 264.3 llegan y vacían la cárcel de una
cam(264.2, 3700, Y.baja - 300, 0.95, 0.9);
s(264.1, "whoosh", -3);
for (let i = 0; i < 5; i++)
  act({ a: 264.2, b: 268.4, x: [3450 + i * 140, 5000 + i * 140], tw: [264.6 + i * 0.12, 266.6 + i * 0.12], y: Y.baja, h: 400, ropa: PRESO(i), seed: 160 + i, expr: "sorpresa", camina: 1.6 });
s(264.6, "march", -6);
o(264.4, "chip", { txt: "EMPTIED IN ONE GO", x: 960, y: 140, c: C.violeta, s: 62, t1: 266.3 });
o(266.4, "grande", { txt: "GAOL DELIVERY", y: 420, s: 150, c: C.oro, t1: 269.0 });
s(266.4, "slam", -1);
o(269.2, "ico", { ico: "calendario", x: 700, y: 640, s: 1.0, tag: "SPRING", t1: 271.7 });
o(269.6, "ico", { ico: "calendario", x: 1220, y: 640, s: 1.0, tag: "SUMMER", t1: 271.7 });
o(270.4, "chip", { txt: "TWICE A YEAR", x: 960, y: 900, c: C.teal, tinta: C.noche, s: 60, t1: 271.7 });
s(269.2, "pop", -3); s(269.6, "pop", -3);
// 271.84 te arrestan una semana tarde → 6 meses a oscuras, pagando cada noche
cam(271.8, 3350, Y.baja - 280, 1.5, 0.8);
o(272.4, "chip", { txt: "ARRESTED A WEEK LATE", x: 960, y: 140, c: C.rojo, s: 60, t1: 276.2 });
s(272.6, "fail", -4);
o(276.4, "cuenta", { de: 0, a: 6, dur: 1.0, x: 1500, y: 340, s: 240, c: C.oro, t1: 279.6 });
o(276.9, "chip", { txt: "MONTHS IN THE DARK", x: 1500, y: 520, c: C.violeta, s: 50, t1: 279.6 });
o(276.6, "oscuro", { t1: 282.2, a: 0.5 });
for (let i = 0; i < 6; i++) s(276.5 + i * 0.17, "tick", -6);
fee(279.8, 30, "180 NIGHTS");
// las noches corren: contador grande + calendario que pasa hojas al lado tuyo
o(279.9, "cuenta", { de: 1, a: 180, dur: 1.8, x: 1380, y: 300, s: 150, c: C.rojo, suf: " NIGHTS", t1: 282.2 });
wi(279.9, "calendario", 3560, Y.baja - 300, { s: 0.7, anim: "gira", t1: 282.2 });
cam(279.7, 3620, Y.baja - 280, 1.6, 2.4);
s(279.8, "coin_rain", -2);
w(280.2, "emote", { emo: "lagrimas", x: 3300, y: Y.baja - 480, s: 1.2 });

// 282.36 ¿y si te negabas a ser juzgado?
cam(282.3, 6290, SUELO - 530, 0.98, 1.2);
s(282.2, "whoosh_big", -3);
act({ a: 282.3, b: 308.5, x: 5880, y: Y.sala, h: 430, ropa: YO, seed: 1, expr: [[0, "neutro"], [286, "miedo"], [294.7, "orgullo"], [299.2, "sorpresa"], [306.9, "miedo"]], flip: true });
act({ a: 282.3, b: 308.5, x: 6700, y: Y.estrado, h: 400, ropa: JUEZ, seed: 151, sobre: "cofia", viejo: true, flip: true, expr: [[0, "neutro"], [294.7, "enojado"], [299.2, "orgullo"]], habla: [[282.4, 284.4], [299.3, 301.0], [303.0, 304.8]], bD: 40, cD: 70, manoD: "mazo", salta: [306.9] });
w(283.6, "globo", { x: 6680, y: Y.estrado - 470, txt: "HOW DO YOU PLEAD?", s: 30, hx: 0.3, t1: 286.0 });
w(284.8, "emote", { emo: "excl", x: 5870, y: Y.sala - 520, s: 1.1 });
o(284.8, "chip", { txt: "SOME MEN SAID NOTHING", x: 960, y: 140, c: C.violeta, s: 60, t1: 286.0 });
o(286.1, "ico", { ico: "corona", x: 960, y: 260, s: 1.1, tag: "CONVICTED? THE CROWN TAKES ALL", c: C.rojo, t1: 294.5 });
s(286.1, "warhorn", -8);
o(290.2, "ico", { ico: "pergamino", x: 520, y: 650, s: 0.85, tag: "LAND", anim: "vuela", x2: 960, y2: 260, dur: 3.9, t1: 294.3 });
o(291.0, "ico", { ico: "casa", x: 840, y: 650, s: 0.85, tag: "HOUSE", anim: "vuela", x2: 960, y2: 260, dur: 3.1, t1: 294.3 });
o(291.8, "ico", { ico: "vaca", x: 1160, y: 650, s: 0.85, tag: "ANIMALS", anim: "vuela", x2: 960, y2: 260, dur: 2.4, t1: 294.3 });
s(290.3, "pop", -3); s(291.1, "pop", -3); s(291.9, "pop", -3);
o(292.8, "ico", { ico: "nene", x: 1480, y: 650, s: 0.85, txt: "X", tag: "NOTHING", t1: 294.4 });
s(292.9, "sad", -6);
o(294.7, "sello", { txt: "NO PLEA", x: 960, y: 250, s: 120, c: C.oro });
s(294.7, "stamp", 0);
o(296.4, "chip", { txt: "NO VERDICT", x: 960, y: 420, c: C.violeta, s: 60, t1: 299.0 });
o(297.6, "ico", { ico: "casa", x: 960, y: 700, s: 1.1, tag: "FAMILY KEEPS THE FARM", c: C.lima, t1: 299.0 });
s(297.6, "ding", -4);
// 299.1 la ley tenía respuesta: 1275, Westminster
cam(299.0, 6330, SUELO - 535, 1.04, 6.0);
s(306.95, "wood_hit", -1);
o(299.2, "chip", { txt: "THE LAW HAD AN ANSWER", x: 960, y: 140, c: C.rojo, s: 62, t1: 301.0 });
o(301.0, "cuenta", { de: 1200, a: 1275, dur: 0.7, x: 960, y: 380, s: 220, c: C.oro, t1: 304.6 });
o(302.7, "ico", { ico: "pergamino", x: 960, y: 700, s: 1.1, tag: "STATUTE OF WESTMINSTER", t1: 306.8 });
s(302.7, "unroll", -2);
o(306.9, "sello", { txt: "HARD AND STRICT", x: 960, y: 300, s: 110 });
s(306.9, "stamp", 0);
// 308.56 la celda: piso pelado, casi nada para comer
cam(308.5, 2720, Y.sotano - 240, 2.2, 0.8);
s(308.4, "whoosh_big", -3);
act({ a: 308.5, b: 321.2, x: 2700, y: Y.sotano, h: 400, ropa: YO, seed: 1, expr: [[0, "triste"], [314.6, "feliz"], [317.3, "triste"]], gesto: [[308.5, "encoge"], [314.6, "rasca"], [317.3, "encoge"]], salta: [314.65] });
w(311.5, "chip", { txt: "BARE FLOOR", x: 2700, y: Y.sotano + 30, c: C.violeta, s: 34, t1: 314.2 });
wi(314.6, "pan", 2930, Y.sotano - 300, { s: 0.6, tag: "MONDAY", t1: 317.2 });
wi(316.0, "agua", 2480, Y.sotano - 300, { s: 0.6, tag: "TUESDAY", t1: 317.2 });
s(314.6, "pop", -3); s(316.0, "drop", -3);
o(317.3, "sello", { txt: "NEVER BOTH", x: 960, y: 250, s: 120 });
s(317.3, "stamp", 0);
o(319.3, "oscuro", { t1: 344.0, a: 0.3, c: "#1a0510" });
cam(319.3, 2700, Y.sotano - 300, 2.1, 1.6);
o(319.4, "chip", { txt: "THEN IT GOT WORSE", x: 960, y: 140, c: C.rojo, s: 62, t1: 321.2 });
s(319.4, "suspense", -6);
// 321.32 de espaldas, pesas sobre el pecho, cada día más
cam(321.2, 2850, Y.sotano - 260, 1.6, 0.8);
act({ a: 321.2, b: 343.8, x: 2700, y: Y.sotano - 70, h: 400, ropa: YO, seed: 1, rot: 90, expr: [[0, "miedo"], [328.4, "dormido"], [333, "miedo"], [338.7, "dormido"]] });
for (let i = 0; i < 6; i++) {
  wi(323.5 + i * 0.7, "pesa", 2960, Y.sotano - 130 - i * 70, { s: 0.55, anim: "cae", t1: 343.8 });
  s(323.6 + i * 0.7, "metal_fall", -4 - i * 0.5);
}
o(325.0, "chip", { txt: "MORE EACH DAY", x: 960, y: 140, c: C.violeta, s: 60, t1: 328.2 });
o(328.4, "ico", { ico: "craneo", x: 1500, y: 320, s: 1.0, tag: "OR UNTIL YOU DIED", c: C.rojo, t1: 331.0 });
s(328.4, "heart", -4); s(329.0, "heart", -8);
o(329.4, "ico", { ico: "flor", x: 520, y: 320, s: 0.9, tag: "A FRENCH NAME", c: C.violeta, t1: 333.0 });
o(333.2, "grande", { txt: "PEINE FORTE", y: 400, s: 140, c: C.oro, t1: 336.4 });
o(333.7, "grande", { txt: "ET DURE", y: 570, s: 140, c: C.oro, t1: 336.4 });
s(333.2, "slam", 0); s(333.3, "boom", -5);
// 336.48 una cantidad sorprendente lo eligió
cam(336.4, 2560, Y.sotano - 180, 1.35, 1.0);
for (let i = 0; i < 3; i++) {
  act({ a: 336.4, b: 343.8, x: 2150 + i * 380, y: Y.sotano - 70 - (i === 1 ? 0 : 0), h: 340, ropa: PRESO(i + 2), seed: 170 + i, rot: 90, expr: [[0, "orgullo"], [338.7, "dormido"]], aparece: 336.5 + i * 0.25 });
  for (let k = 0; k < 3; k++) wi(336.7 + i * 0.25 + k * 0.2, "pesa", 2150 + i * 380 + 230, Y.sotano - 110 - k * 60, { s: 0.45, anim: "cae", t1: 343.8 });
}
o(336.5, "chip", { txt: "A SURPRISING NUMBER CHOSE IT", x: 960, y: 140, c: C.violeta, s: 58, t1: 338.6 });
o(338.7, "chip", { txt: "WITHOUT A WORD", x: 960, y: 140, c: C.rojo, s: 62, t1: 342.0 });
o(342.1, "ico", { ico: "casa", x: 760, y: 330, s: 1.0, tag: "THE HOUSE", c: C.lima, t1: 343.8 });
o(342.4, "ico", { ico: "nene", x: 1160, y: 330, s: 1.0, tag: "THE CHILDREN", c: C.lima, t1: 343.8 });
s(342.1, "ding", -4); s(342.4, "sad", -8);
// 343.82 y todo eso... pasaba ARRIBA, en la parte cómoda
cam(343.8, 3100, SUELO + 420, 0.45, 1.4);
s(343.7, "whoosh", -2);
o(345.9, "chip", { txt: "THIS WAS UPSTAIRS", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 70, t1: 349.2 });
o(347.3, "chip", { txt: "\"THE COMFORTABLE PART\"", x: 960, y: 260, c: C.violeta, s: 54, t1: 349.2 });
w(348.1, "ico", { ico: "x", x: 3820, y: SUELO + 1350, s: 1.0, tag: "DOWN HERE?", c: C.rojo, t1: 349.2 });
s(346.0, "pop", -3); s(347.3, "pop", -3); s(348.1, "suspense", -5);

// ═══ TRAMPA 4 · EL POZO (349.18)
trampa(349.18);
cam(349.1, 3820, SUELO + 1250, 1.0, 1.4);
s(349.0, "fall", -2); s(349.9, "slam", 0); s(350.0, "boom", -4);
o(349.9, "grande", { txt: "TRAP #4", y: 420, s: 170, c: C.oro, t1: 352.2 });
o(351.0, "chip", { txt: "THE HOLE", x: 960, y: 620, c: C.rojo, s: 84, t1: 352.2 });
act({ a: 349.6, b: 357.6, x: 3820, y: Y.pozo, h: 400, ropa: YO, seed: 1, expr: [[0, "miedo"], [352.6, "sorpresa"], [353.4, "miedo"], [355, "triste"]], aparece: 349.6, miraY: -1, bI: 150, bD: 150, cI: 20, cD: 20, salta: [352.7, 354.3, 356.1] });
cam(352.4, 3820, SUELO + 1290, 1.3, 4.5);
for (let i = 0; i < 3; i++) w(352.6 + i * 1.6, "ico", { ico: "agua", x: 3800 + i * 40, y: SUELO + 700, x2: 3820, y2: Y.pozo - 420, anim: "vuela", dur: 0.6, s: 0.25, t1: 353.3 + i * 1.6 });
o(352.5, "chip", { txt: "\"MEDIEVAL DUNGEON\"", x: 960, y: 140, c: C.violeta, s: 64, t1: 357.6 });
s(352.6, "drop", -6); s(354.2, "drop", -8); s(356.0, "drop", -6);
// 357.82 donjon = la torre del castillo, lo más seguro
cam(357.8, 13450, SUELO - 1100, 0.42, 1.8);
s(357.7, "whoosh_big", -2);
o(359.0, "grande", { txt: "DONJON", y: 300, s: 160, c: C.oro, t1: 362.2 });
o(360.0, "chip", { txt: "FRENCH: THE GREAT TOWER", x: 960, y: 470, c: C.violeta, s: 56, t1: 362.2 });
o(362.5, "chip", { txt: "THE KEEP", x: 520, y: 880, c: C.teal, tinta: C.noche, s: 60, t1: 365.4 });
o(363.3, "chip", { txt: "STRONGEST", x: 960, y: 880, c: C.oro, tinta: C.noche, s: 60, t1: 365.4 });
o(364.5, "chip", { txt: "SAFEST", x: 1400, y: 880, c: C.lima, tinta: C.noche, s: 60, t1: 365.4 });
s(362.5, "pop", -3); s(363.3, "pop", -3); s(364.5, "pop", -3);
// 365.6 la palabra se resbaló hacia abajo
cam(366.2, 13110, SUELO - 300, 0.8, 1.2);
cam(368.4, 13110, SUELO + 100, 0.85, 1.0);
o(366.6, "chip", { txt: "OVER TIME...", x: 960, y: 140, c: C.violeta, s: 60, t1: 369.0 });
w(368.4, "grande", { txt: "DUNGEON", x: 13110, y: SUELO - 160, s: 120, c: C.rojo, anim: "cae", t1: 373.8 });
s(368.4, "fall", -3); s(369.1, "slam", -2);
w(370.2, "chip", { txt: "THE DARK ROOM UNDERNEATH", x: 13110, y: SUELO + 380, c: C.violeta, s: 36, t1: 373.8 });
// el chico adentro del cuarto oscuro de abajo (OJO v3: 370 sin personajes)
act({ a: 366.2, b: 373.9, x: 13100, y: SUELO + 300, h: 235, ropa: YO, seed: 1, expr: [[0, "triste"], [368.45, "miedo"]], salta: [368.45], gesto: [[369.2, "encoge"]] });
// asomado a la boca de la botella antes de que lo bajen (OJO v3: 380 sin personajes)
act({ a: 374.0, b: 389.0, x: 19100, y: SUELO - 20, h: 360, ropa: YO, seed: 1, expr: [[0, "sorpresa"], [380.4, "miedo"]], miraY: 1, salta: [377.95], gesto: [[383.3, "encoge"]] });
o(371.4, "chip", { txt: "FOR PEOPLE YOU NEVER WANT TO SEE AGAIN", x: 960, y: 920, c: C.rojo, s: 48, t1: 373.8 });
// 374.0 St Andrews, Escocia
cam(374.0, 18950, SUELO - 650, 0.42, 2.0);
s(373.9, "whoosh_big", -1); s(375.0, "wind", -10); s(375.2, "birds", -14);
o(374.6, "chip", { txt: "ST ANDREWS CASTLE", x: 960, y: 140, c: C.violeta, s: 66, t1: 377.8 });
o(375.5, "chip", { txt: "SCOTLAND", x: 960, y: 250, c: C.teal, tinta: C.noche, s: 52, t1: 377.8 });
o(377.9, "grande", { txt: "THE BOTTLE DUNGEON", y: 380, s: 130, c: C.oro, t1: 380.0 });
s(377.9, "slam", -1);
cam(379.6, 19100, SUELO + 720, 0.62, 1.4);
o(380.4, "chip", { txt: "CUT INTO SOLID ROCK", x: 960, y: 140, c: C.violeta, s: 60, t1: 383.0 });
s(380.4, "stomp", -6); s(380.9, "stomp", -8);
w(383.3, "chip", { txt: "NARROW NECK", x: 19400, y: SUELO + 200, c: C.oro, tinta: C.noche, s: 40, t1: 389.0 });
w(384.3, "chip", { txt: "WIDE BOTTOM", x: 19100, y: SUELO + 1640, c: C.oro, tinta: C.noche, s: 40, t1: 389.0 });
s(383.3, "pop", -3); s(384.3, "pop", -3);
o(385.6, "cuenta", { de: 0, a: 7, dur: 0.6, x: 1560, y: 360, s: 220, c: C.oro, t1: 389.0 });
o(386.0, "chip", { txt: "METERS DEEP", x: 1560, y: 530, c: C.rojo, s: 50, t1: 389.0 });
o(387.4, "ico", { ico: "puerta", x: 420, y: 330, s: 0.8, txt: "X", tag: "NO STAIRS", t1: 389.0 });
o(388.3, "ico", { ico: "llave", x: 420, y: 640, s: 0.8, txt: "X", tag: "NO DOOR", t1: 389.0 });
s(387.5, "fail", -6); s(388.3, "fail", -6);
// 389.06 te bajan con una soga
cam(389.0, 19100, SUELO + 260, 0.75, 0.8);
cam(390.4, 19100, SUELO + 820, 0.8, 1.2);
act({ a: 389.0, b: 430.5, x: 19100, y: [SUELO - 20, Y.botella], tw: [389.3, 391.2], h: 360, ropa: YO, seed: 1, expr: [[0, "miedo"], [392.5, "triste"], [395.6, "feliz"], [397.5, "enojado"], [399.6, "triste"]], bI: 160, bD: 160, cI: 10, cD: 10 });
s(389.3, "cloth", -2); s(389.9, "cloth", -4); s(390.6, "cloth", -4); s(391.2, "stomp", -3);
o(391.0, "chip", { txt: "THE ONLY WAY OUT:", x: 960, y: 140, c: C.violeta, s: 58, t1: 395.4 });
o(392.3, "chip", { txt: "THE SAME ROPE", x: 960, y: 250, c: C.oro, tinta: C.noche, s: 58, t1: 395.4 });
w(393.4, "chip", { txt: "IF SOMEBODY THROWS IT BACK", x: 19100, y: SUELO - 260, c: C.rojo, s: 32, t1: 395.4 });
s(393.0, "swish", -3);
w(395.7, "ico", { ico: "pan", x: 19100, y: SUELO + 100, x2: 19150, y2: Y.botella - 60, anim: "vuela", dur: 1.0, s: 0.5, t1: 397.4 });
s(395.7, "fall", -6); s(396.7, "drop", -4);
w(397.5, "ico", { ico: "balde", x: 19300, y: Y.botella - 90, s: 0.5, t1: 401 });
o(397.5, "chip", { txt: "EVERYTHING ELSE STAYED", x: 960, y: 160, c: C.lima, tinta: C.noche, s: 58, t1: 401.2 });
s(397.6, "drone", -6);
// 399.96 está dentro de la Sea Tower · 1546, el cardenal Beaton
cam(399.9, 19100, SUELO - 700, 0.45, 1.3);
o(400.4, "chip", { txt: "INSIDE THE SEA TOWER", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 60, t1: 403.8 });
o(402.8, "chip", { txt: "ONE MORE GUEST...", x: 960, y: 920, c: C.rojo, s: 56, t1: 404.9 });
o(405.0, "cuenta", { de: 1500, a: 1546, dur: 0.7, x: 960, y: 320, s: 200, c: C.oro, t1: 407.0 });
cam(406.4, 18850, SUELO - 400, 0.85, 1.0);
const BEATON: Ropa = { ...JUEZ, tunica: "#d21f3c", tunica2: "#8a0f24" };
act({ a: 406.4, b: 413.0, x: 18700, y: Y.calle, h: 420, ropa: BEATON, seed: 181, sobre: "capelo", viejo: true, expr: [[0, "orgullo"], [407.6, "sorpresa"], [408.6, "miedo"]],
  rot: [0, 90], tw: [408.7, 409.1] });
for (let i = 0; i < 3; i++)
  act({ a: 406.5, b: 413.0, x: [18100 + i * 120, 18450 + i * 120], tw: [406.6, 408.0], y: Y.calle, h: 400, ropa: PRESO(5 + i), seed: 185 + i, expr: "enojado", camina: 1.6, manoD: i === 1 ? "cuchilla" : undefined, bD: 90, cD: 20, aparece: 406.5 });
s(406.7, "march", -4); s(407.5, "wood_hit", -2); s(408.6, "sword", -1); s(408.8, "punch", -2); s(409.0, "fall", -6);
o(407.4, "chip", { txt: "BROKE IN", x: 960, y: 140, c: C.rojo, s: 62, t1: 409.6 });
o(409.7, "chip", { txt: "CARDINAL DAVID BEATON", x: 960, y: 900, c: C.violeta, s: 58, t1: 413.0 });
w(413.3, "ico", { ico: "sal", x: 18700, y: Y.calle - 260, s: 0.8, tag: "SALT", t1: 415.0 });
s(413.3, "popcluster", -4);
cam(414.4, 19100, Y.botella - 260, 0.95, 1.0);
act({ a: 414.4, b: 430.5, x: 19050, y: [SUELO - 40, Y.botella - 40], tw: [414.6, 415.9], h: 380, ropa: BEATON, seed: 181, sobre: "capelo", viejo: true, expr: "dormido", rot: 90 });
s(414.6, "fall", -2); s(415.9, "punch", -2);
o(416.6, "ico", { ico: "calendario", x: 1500, y: 320, s: 0.9, tag: "FOR MONTHS", t1: 418.2 });
o(418.3, "chip", { txt: "THE MOST POWERFUL CHURCHMAN IN SCOTLAND", x: 960, y: 140, c: C.violeta, s: 50, t1: 421.8 });
o(420.2, "sello", { txt: "IN HIS OWN PIT", x: 960, y: 320, s: 100 });
s(420.2, "stamp", 0);
// 421.94 oubliette = olvidar; la tapa se cierra
cam(421.9, 19100, Y.botella - 320, 1.15, 0.8);
o(424.3, "grande", { txt: "OUBLIETTE", y: 300, s: 160, c: C.oro, t1: 427.6 });
s(424.3, "slam", -1);
o(425.8, "chip", { txt: "OUBLIER = TO FORGET", x: 960, y: 470, c: C.violeta, s: 60, t1: 427.6 });
s(427.7, "wood_hit", 0); s(427.8, "boom", -6);
o(427.9, "oscuro", { t1: 430.6, a: 0.45 });
o(428.6, "chip", { txt: "SO HE COULD BE FORGOTTEN", x: 960, y: 900, c: C.rojo, s: 56, t1: 430.5 });
// 430.6 la Little Ease de la Torre: ni parado ni acostado
cam(430.6, 13110, SUELO + 130, 1.35, 1.8);
s(430.5, "whoosh_big", -2);
o(432.3, "chip", { txt: "THE TOWER OF LONDON", x: 960, y: 140, c: C.violeta, s: 62, t1: 435.4 });
o(433.4, "chip", { txt: "SOMETHING SMALLER", x: 960, y: 250, c: C.rojo, s: 52, t1: 435.4 });
o(435.5, "grande", { txt: "LITTLE EASE", y: 330, s: 150, c: C.oro, t1: 438.4 });
s(435.5, "slam", -1);
act({ a: 433.0, b: 444.6, x: 13110, y: SUELO + 238, h: 220, ropa: YO, seed: 1, expr: [[0, "miedo"], [442.3, "triste"]], inclina: 28, aparece: 433.0 });
o(438.9, "chip", { txt: "CAN'T STAND UP", x: 520, y: 760, c: C.rojo, s: 52, t1: 444.4 });
o(440.6, "chip", { txt: "CAN'T LIE DOWN", x: 1400, y: 760, c: C.rojo, s: 52, t1: 444.4 });
s(438.9, "wood_hit", -4); s(440.7, "wood_hit", -4);
o(442.5, "chip", { txt: "ONLY CROUCH", x: 960, y: 140, c: C.violeta, s: 62, t1: 444.4 });
o(443.6, "cuenta", { de: 1, a: 9, dur: 0.8, x: 1500, y: 360, s: 160, c: C.oro, suf: " DAYS", t1: 444.6 });
// 444.72 confesión: muchas «oubliettes» eran depósitos, pozos o letrinas
cam(444.6, 13450, SUELO - 700, 0.5, 1.2);
act({ a: 444.6, b: 469.7, x: 12620, y: Y.calle, h: 640, ropa: YO, seed: 1, expr: [[0, "neutro"], [449.3, "sorpresa"], [453.6, "feliz"], [457.8, "orgullo"], [460.3, "sorpresa"], [462.3, "feliz"]], habla: [[445.0, 448.8], [449.3, 452.0]], bD: 130, cD: 30, aparece: 444.8, salta: [460.4, 466.6] });
o(445.0, "chip", { txt: "A SMALL CONFESSION", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 64, t1: 449.0 });
o(446.9, "chip", { txt: "TRUTH > LEGEND", x: 960, y: 250, c: C.oro, tinta: C.noche, s: 52, t1: 449.0 });
o(449.3, "chip", { txt: "\"OUBLIETTES\" WERE OFTEN...", x: 960, y: 140, c: C.violeta, s: 58, t1: 457.6 });
o(453.6, "ico", { ico: "barril", x: 520, y: 560, s: 1.0, tag: "STOREROOMS", t1: 457.6 });
o(454.9, "ico", { ico: "agua", x: 960, y: 560, s: 1.0, tag: "WELLS", t1: 457.6 });
o(456.6, "ico", { ico: "balde", x: 1400, y: 560, s: 1.0, tag: "LATRINES", c: C.lima, t1: 457.6 });
s(453.6, "pop", -3); s(454.9, "drop", -3); s(456.6, "drone", -4);
o(457.8, "ico", { ico: "sombrero", x: 520, y: 380, s: 1.0, tag: "THE VICTORIANS", t1: 462.0 });
o(458.6, "ico", { ico: "libro", x: 960, y: 380, s: 1.0, tag: "HORROR STORIES", c: C.rojo, t1: 462.0 });
for (let i = 0; i < 5; i++) o(460.3 + i * 0.2, "chip", { txt: "OUBLIETTE!", x: 380 + i * 300, y: 650 + (i % 2) * 140, c: C.rojo, s: 40, rot: (i - 2) * 6, t1: 462.0 });
for (let i = 0; i < 5; i++) s(460.3 + i * 0.2, "pop", -5);
// 462.13 pero esto SÍ era real
o(462.3, "ico", { ico: "tick", x: 480, y: 520, s: 0.9, tag: "BOTTLE DUNGEONS", c: C.lima, t1: 469.6 });
o(464.1, "ico", { ico: "tick", x: 960, y: 520, s: 0.9, tag: "PIT PRISONS", c: C.lima, t1: 469.6 });
o(466.5, "ico", { ico: "tick", x: 1440, y: 520, s: 0.9, tag: "LITTLE EASE", c: C.lima, t1: 469.6 });
s(462.6, "ding", -4); s(464.3, "ding", -4); s(466.7, "ding", -2);
o(467.7, "chip", { txt: "PICK THE RIGHT CASTLE", x: 960, y: 880, c: C.oro, tinta: C.noche, s: 60, t1: 469.7 });

// ── piezas especiales
export const X2 = (t: number, _c: Pose): React.ReactNode => (
  <>
    {/* soga para bajarte a la botella; se recoge en 394.4 */}
    {t >= 389.0 && t < 395.6 && (() => {
      const yb = t < 394.4 ? SUELO - 20 + (Y.botella - SUELO + 20) * prog(t, 389.3, 391.2) - 330 : Y.botella - 330 - (Y.botella - SUELO + 400) * prog(t, 394.4, 395.4);
      return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><line x1={19100} y1={SUELO - 400} x2={19100} y2={yb} stroke="#c9a23a" strokeWidth={12} /></svg>;
    })()}
    {/* tapa de la oubliette */}
    {t >= 427.2 && t < 431 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><rect x={19340 - 300 * prog(t, 427.2, 427.7)} y={SUELO - 30} width={160} height={40} rx={8} fill="#7a5a3a" stroke="#3a2418" strokeWidth={6} /></svg>}
    {/* carcelero arriba en la boca del pozo de Newgate */}
    {t >= 349.6 && t < 357.6 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><line x1={3820} y1={SUELO + 660} x2={3820} y2={SUELO + 660 + 900 * prog(t, 349.6, 350.6)} stroke="#c9a23a" strokeWidth={10} opacity={1 - prog(t, 351.5, 352.2)} /></svg>}
  </>
);
export const P2 = (_t: number): React.ReactNode => null;
