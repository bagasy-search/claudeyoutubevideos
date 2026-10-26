import React from "react";
import { C } from "./kit";
import { SUELO, L } from "./mundo";
import { cam, act, o, w, wi, fee, s, trampa, Y, YO, CARCELERO, PRESO, REY } from "./base";
import { Grilletes, Letrero } from "./extras";
import { prog } from "./kit";
import type { Pose } from "./motor";
import type { Ropa } from "./persona";

// ═══ TRAMPA 1 (resto, 52-153) y TRAMPA 2 (153-249): la factura y las cadenas.
const KX = 2430, VX = 2720; // carcelero y vos en la oficina

// 52.2 «forget everything the movies taught you» · 54.96 prison was almost never the punishment
cam(52.1, 2600, Y.baja - 300, 1.3, 1.0);
act({ a: 50.5, b: 91.2, x: VX, y: Y.baja, h: 430, ropa: YO, seed: 1, flip: true, expr: [[0, "neutro"], [59.6, "miedo"], [62.6, "neutro"], [70.6, "triste"], [86.8, "miedo"]] });
act({ a: 52, b: 81.2, x: KX, y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "orgullo"], [70.6, "feliz"]], habla: [[70.6, 71.6], [76.7, 80.4]], bD: 30, cD: 60 });
o(52.8, "chip", { txt: "FORGET THE MOVIES", x: 960, y: 140, c: C.violeta, s: 62 });
o(53.6, "ico", { ico: "ojo", x: 1500, y: 420, s: 0.9, txt: "X", t1: 55.4 });
o(56.6, "sello", { txt: "NOT THE PUNISHMENT", x: 960, y: 820, s: 84, rot: -5, t1: 58.3 });
// 58.34 sheep → hanged / fined / cut something off
wi(58.9, "oveja", VX + 190, Y.baja - 120, { s: 0.85, t1: 62.6 });
s(58.9, "pop", -2);
o(59.7, "ico", { ico: "soga", x: 1450, y: 420, s: 1.1, anim: "cae", tag: "HANGED", t1: 62.7 });
o(60.6, "ico", { ico: "moneda", x: 960, y: 330, s: 1.0, tag: "FINED", c: C.violeta, t1: 62.7 });
o(61.56, "ico", { ico: "cuchilla", x: 1400, y: 330, s: 1.1, tag: "CUT OFF", rot: -20, t1: 62.7 });
s(59.7, "swish", -2); s(60.6, "coin", -2); s(61.6, "sword", -2); s(61.7, "gasp", -6);
// 62.9 waiting room: judge / debt / ransom
cam(62.8, 2620, Y.baja - 330, 1.15, 0.9);
o(63.5, "chip", { txt: "THE WAITING ROOM", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 66 });
wi(64.2, "ticket", VX + 30, Y.baja - 470, { s: 0.7, t1: 70.4 });
o(65.9, "ico", { ico: "mazo", x: 560, y: 760, s: 0.9, tag: "A JUDGE", t1: 70.3 });
o(67.8, "ico", { ico: "bolsa", x: 960, y: 760, s: 0.9, tag: "YOUR DEBT", t1: 70.3 });
o(69.4, "ico", { ico: "corona", x: 1360, y: 760, s: 0.9, tag: "A RANSOM", t1: 70.3 });
s(64.2, "paper", -4);
// 70.52 «And the waiting room was a business»
o(71.3, "sello", { txt: "A BUSINESS", c: C.oro, x: 960, y: 260, s: 120 });
w(71.3, "ico", { ico: "moneda", x: KX + 80, y: Y.baja - 560, s: 0.5, anim: "gira", t1: 73.6 });
s(71.3, "coin_rain", -4);
// 72.46 not like a policeman for a city · 76.7 bought / rented / inherited
cam(72.4, KX + 60, Y.baja - 320, 1.6, 0.8);
o(73.8, "ico", { ico: "corona", x: 1450, y: 330, s: 0.9, txt: "X", t1: 76.4 });
o(74.6, "chip", { txt: "NOT A POLICEMAN", x: 1450, y: 560, c: C.violeta, s: 52, t1: 76.4 });
o(78.6, "ico", { ico: "bolsa", x: 1100, y: 330, s: 0.8, tag: "BOUGHT", t1: 81.2 });
o(79.4, "ico", { ico: "llave", x: 1420, y: 330, s: 0.8, tag: "RENTED", t1: 81.2 });
o(80.3, "ico", { ico: "pergamino", x: 1740, y: 330, s: 0.8, tag: "INHERITED", t1: 81.2 });
// 81.36 la Fleet: el cargo de guardián pasa de padre a hijo
cam(81.2, L.fleet.x - 20, SUELO - 700, 0.95, 1.3);
s(81.1, "whoosh_big", -3);
o(82.2, "chip", { txt: "THE FLEET PRISON", x: 960, y: 140, c: C.rojo, s: 62 });
const GEN: Ropa[] = [CARCELERO, { ...CARCELERO, tunica: "#5b3a8a" }, { ...CARCELERO, tunica: "#6a4a9a" }, { ...CARCELERO, tunica: "#7a5aaa" }];
GEN.forEach((r, i) => act({ a: 83.0 + i * 0.45, b: 86.9, x: 8720 + i * 230, y: Y.fleetA, h: 360 - i * 30, ropa: r, seed: 70 + i, sobre: "gorro", viejo: i === 0, expr: "orgullo", aparece: 83.0 + i * 0.45, flip: true }));
for (let i = 0; i < 4; i++) s(83.0 + i * 0.45, "pop", -3);
w(84.8, "chip", { txt: "SAME FAMILY", x: 9070, y: SUELO - 1030, c: C.violeta, s: 44, t1: 86.9 });
o(85.6, "chip", { txt: "FOR GENERATIONS", x: 960, y: 900, c: C.ambar, tinta: C.noche, s: 60, t1: 86.9 });
// 86.88 «expects that prison to pay him back»
cam(86.75, KX + 160, Y.baja - 300, 1.45, 1.2);
s(86.7, "whoosh_big", -3);
act({ a: 86.7, b: 108.3, x: KX, y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: "feliz", habla: [[87, 90.6]], bD: 70, cD: 90, bI: 70, cI: 90, manoD: "bolsa" });
for (let i = 0; i < 5; i++) w(89.9 + i * 0.12, "ico", { ico: "moneda", x: VX, y: Y.baja - 300, x2: KX + 60, y2: Y.baja - 320, anim: "vuela", dur: 0.6, s: 0.35, t1: 90.7 + i * 0.12 });
s(90.0, "coin", -2); s(90.4, "coin", -4);
// 91.4 «the meter starts running» → la factura, cargo por cargo
o(92.9, "chip", { txt: "THE METER IS RUNNING", x: 820, y: 140, c: C.rojo, s: 60 });
s(92.9, "roll", -4);
act({ a: 91.2, b: 108.3, x: [VX - 40, VX], tw: [91.2, 92.3], y: Y.baja, h: 430, ropa: YO, seed: 1, flip: true, expr: [[0, "miedo"], [99, "triste"]] });
fee(95.08, 4, "ENTRY");
w(95.1, "sello", { txt: "ADMITTED", x: VX - 60, y: Y.baja - 560, s: 40, t1: 96.4 });
s(95.08, "stamp", -1);
cam(95.8, 2650, Y.alta - 240, 1.35, 0.6);
fee(96.5, 2, "BED");
act({ a: 95.5, b: 100.6, x: 2360, y: Y.alta - 120, h: 330, ropa: PRESO(3), seed: 81, expr: "triste", rot: 90 });
act({ a: 95.5, b: 100.6, x: 2420, y: Y.alta - 150, h: 330, ropa: PRESO(4), seed: 82, expr: "enojado", rot: 90 });
act({ a: 95.5, b: 100.6, x: 2920, y: Y.alta - 130, h: 360, ropa: REY, seed: 83, expr: "dormido", rot: 90 });
w(97.0, "chip", { txt: "SHARED", x: 2370, y: Y.alta - 360, c: C.violeta, s: 40, t1: 100.4 });
w(98.3, "chip", { txt: "ALL YOURS", x: 2930, y: Y.alta - 360, c: C.oro, tinta: C.noche, s: 40, t1: 100.4 });
fee(98.5, 3, "PRIVATE BED");
cam(100.5, 2600, Y.baja - 280, 1.45, 0.55);
wi(100.9, "pan", VX + 200, Y.baja - 330, { s: 0.7, t1: 103.4 });
fee(101.0, 3, "FOOD");
o(102.4, "ico", { ico: "corona", x: 1500, y: 300, s: 0.8, txt: "X", t1: 103.6 });
wi(103.9, "carbon", VX + 200, Y.baja - 330, { s: 0.7, t1: 105.1 });
fee(104.0, 1, "COAL");
cam(105.1, 4180, Y.baja - 140, 2.0, 0.7);
wi(105.6, "agua", 4060, Y.baja - 260, { s: 0.6, t1: 108.2 });
fee(105.7, 1, "WATER");
w(107.2, "chip", { txt: "1 WEEK OLD", x: 4200, y: Y.baja - 340, c: C.lima, tinta: C.noche, s: 34, t1: 108.3 });
s(107.2, "drop", -4);
// 108.3 los vecinos: garnish
cam(108.2, 3500, Y.baja - 320, 1.05, 0.9);
act({ a: 108.3, b: 130.2, x: 3200, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "miedo"], [113.8, "triste"], [116.6, "sorpresa"], [118.5, "miedo"], [121, "triste"], [123, "neutro"], [137.6, "feliz"], [139.7, "triste"], [142.2, "neutro"]], salta: [116.7] });
for (let i = 0; i < 5; i++)
  act({ a: 108.3, b: 122, x: [4500 + i * 110, 3420 + i * 150], tw: [108.4 + i * 0.25, 109.9 + i * 0.25], y: Y.baja + (i % 2) * 8, h: 390 + (i % 3) * 20, ropa: PRESO(i), seed: 90 + i, flip: true,
    expr: [[0, "neutro"], [112.8, "orgullo"], [114.6, "feliz"], [116.4, "enojado"], [118.5, "feliz"]], habla: [[110.1, 111.8]], manoD: i % 2 ? "jarra" : undefined, bD: i % 2 ? 60 : 8, cD: i % 2 ? 70 : 10 });
o(112.82, "grande", { txt: "GARNISH", y: 230, s: 170, c: C.oro, t1: 115.2 });
s(112.82, "slam", 0);
fee(114.5, 6, "DRINKS");
o(114.4, "ico", { ico: "jarra", x: 1500, y: 640, s: 0.9, tag: "ROUND FOR ALL", c: C.violeta, t1: 116.2 });
s(114.4, "popcluster", -4);
w(116.65, "ico", { ico: "abrigo", x: 3200, y: Y.baja - 260, x2: 3700, y2: Y.baja - 420, anim: "vuela", dur: 0.7, s: 0.8, t1: 118.4 });
s(116.65, "cloth", 0); s(116.8, "tear", -4);
w(117.6, "emote", { emo: "sudor", x: 3200, y: Y.baja - 470, s: 1 });
o(118.55, "sello", { txt: "PAY OR STRIP", x: 960, y: 230, s: 120 });
// 120.54 sin plata: caridad
cam(120.5, 3250, Y.baja - 300, 1.4, 0.7);
w(121.0, "emote", { emo: "preg", x: 3200, y: Y.baja - 480, s: 1.1 });
o(123.1, "chip", { txt: "CHARITY", x: 960, y: 140, c: C.rosa, s: 72 });
o(125.9, "ico", { ico: "pergamino", x: 620, y: 520, s: 1.0, tag: "RICH MAN'S WILL", t1: 127.9 });
o(126.5, "ico", { ico: "pan", x: 1300, y: 520, s: 1.0, tag: "BREAD", c: C.ambar, t1: 127.9 });
cam(127.9, 3500, Y.baja - 340, 1.2, 0.6);
for (let i = 0; i < 7; i++) w(128.3 + i * 0.17, "ico", { ico: "pan", x: 3050 + i * 140, y: Y.baja - 90, anim: "cae", s: 0.55, rot: i * 37, t1: 130.4 });
for (let i = 0; i < 4; i++) s(128.6 + i * 0.3, "drop", -4);
w(129.5, "chip", { txt: "THE LOAVES THAT CAME OUT WRONG", x: 3520, y: Y.baja - 560, c: C.ambar, tinta: C.noche, s: 36, t1: 130.5 });
// 130.16 la reja a la calle, la caja en un palo, los que pasan
cam(130.3, 4480, Y.baja - 280, 1.3, 0.9);
act({ a: 130.2, b: 142.2, x: 4250, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "triste"], [136.4, "feliz"], [139.7, "triste"]], bD: 45, cD: 30 });
act({ a: 130.2, b: 142.2, x: [5000, 4640], tw: [134.2, 135.6], y: Y.calle, h: 430, ropa: PRESO(7), seed: 101, flip: true, expr: [[0, "neutro"], [135.8, "feliz"]], bD: 60, cD: 40 });
for (let i = 0; i < 3; i++) w(135.9 + i * 0.25, "ico", { ico: "moneda", x: 4660, y: Y.baja - 520, anim: "cae", s: 0.3, t1: 136.6 + i * 0.25 });
s(136.0, "coin", -2); s(136.5, "coin", -4);
act({ a: 137.5, b: 139.68, x: 4820, y: Y.calle, h: 400, ropa: PRESO(9), seed: 102, flip: true, expr: "feliz", aparece: 137.5, manoD: "pan", bD: 60, cD: 40 });
act({ a: 137.7, b: 139.68, x: 4960, y: Y.calle, h: 260, ropa: PRESO(10), seed: 103, flip: true, expr: "feliz", aparece: 137.7 });
s(137.6, "pop", -3); s(139.7, "fail", -4);
w(139.75, "chip", { txt: "NO FAMILY?", x: 4800, y: Y.baja - 470, c: C.violeta, s: 40, t1: 142 });
w(140.9, "chip", { txt: "THE BOX", x: 4700, y: Y.baja - 380, c: C.rojo, s: 44, t1: 142.2 });
// 142.22 «basically a hotel check-in» — una estrella, subsuelo, encadenado, minibar
cam(142.2, 2600, Y.baja - 300, 1.2, 0.9);
act({ a: 142.2, b: 146.3, x: 2700, y: Y.baja, h: 430, ropa: YO, seed: 1, flip: true, expr: "neutro" });
act({ a: 142.2, b: 153.2, x: KX, y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: "feliz", habla: [[142.4, 145.4]], bD: 40, cD: 70 });
wi(145.0, "campanita", 2620, Y.baja - 260, { s: 0.5, t1: 146.4 });
s(145.1, "ding", 0);
cam(147.0, 2700, SUELO + 340, 0.9, 0.7);
o(147.4, "chip", { txt: "UNDERGROUND", x: 960, y: 140, c: C.violeta, s: 66, t1: 148.4 });
cam(148.3, 3300, Y.baja - 300, 1.4, 0.6);
act({ a: 148.3, b: 153.2, x: 3240, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "miedo"], [151.5, "sorpresa"]] });
s(148.96, "metal", -2);
w(149.0, "chip", { txt: "CHAINED TO THE WALL", x: 3240, y: Y.baja - 560, c: C.rojo, s: 34, t1: 150.6 });
cam(150.5, 4150, Y.baja - 170, 1.9, 0.6);
wi(151.3, "balde", 4195, Y.baja - 330, { s: 0.6, tag: "MINIBAR", c: C.rojo, t1: 153.2 });
fee(152.2, 2, "MINIBAR");

// ═══ TRAMPA 2 · LAS CADENAS (153.18)
trampa(153.18);
cam(153.0, 3880, Y.alta - 320, 1.0, 1.0);
s(153.0, "whoosh_big", -3); s(153.2, "slam", 0); s(153.25, "boom", -5);
o(153.25, "grande", { txt: "TRAP #2", y: 420, s: 170, c: C.oro, t1: 155.4 });
o(154.4, "chip", { txt: "THE CHAINS", x: 960, y: 620, c: C.rojo, s: 84, t1: 155.4 });
const CX = 3850; // vos en el cuarto de las cadenas
act({ a: 153.0, b: 186.4, x: CX, y: Y.alta, h: 430, ropa: YO, seed: 1, expr: [[0, "neutro"], [156.3, "feliz"], [159.0, "sorpresa"], [163.4, "miedo"], [173.9, "feliz"], [179.2, "neutro"]], inclina: 0, salta: [163.5] });
w(156.3, "chip", { txt: "FREE?", x: CX + 200, y: Y.alta - 520, c: C.lima, tinta: C.noche, s: 44, t1: 158.7 });
o(158.95, "sello", { txt: "NOT FREE", x: 960, y: 250, s: 120 });
s(158.95, "fail", -2);
// 159.82 grilletes pesados de llegada, abulonados al piso o a la pared
cam(160.0, CX, Y.alta - 260, 1.5, 0.9);
w(163.4, "ico", { ico: "pesa", x: CX + 140, y: Y.alta - 90, anim: "cae", s: 0.7, t1: 172.5 });
s(163.5, "metal_fall", 0); s(163.6, "stomp", -2);
o(163.8, "chip", { txt: "HEAVY IRON FETTERS", x: 960, y: 140, c: C.violeta, s: 62, t1: 166.0 });
w(165.9, "chip", { txt: "BOLTED TO THE FLOOR", x: CX - 60, y: Y.alta + 40, c: C.rojo, s: 32, t1: 168.6 });
w(166.6, "chip", { txt: "OR THE WALL", x: CX - 320, y: Y.alta - 520, c: C.rojo, s: 32, t1: 168.6 });
s(165.9, "metal", -2); s(166.6, "metal", -3);
act({ a: 166.9, b: 169.2, x: CX + 380, y: Y.alta, h: 360, ropa: PRESO(5), seed: 111, viejo: true, expr: "triste", aparece: 166.9, flip: true, manoD: "flor", bD: 50, cD: 50 });
w(167.8, "chip", { txt: "DANGEROUS?", x: CX + 380, y: Y.alta - 460, c: C.violeta, s: 36, t1: 169.1 });
s(167.0, "spring", -4);
// 169.0 el «servicio» del carcelero: menos hierro, por una tarifa
act({ a: 168.9, b: 186.4, x: [3420, CX - 300], tw: [168.9, 169.9], y: Y.alta, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "feliz"], [175, "orgullo"]], habla: [[169.4, 170.6], [171.0, 174.2]], bD: 60, cD: 40 });
w(170.0, "globo", { x: CX - 300, y: Y.alta - 520, txt: "A SERVICE!", icos: ["llave"], s: 34, hx: 0.25, t1: 172 });
fee(171.2, 6, "LIGHTER IRONS");
w(172.4, "ico", { ico: "pesa", x: CX + 140, y: Y.alta - 90, x2: CX - 380, y2: Y.alta - 120, anim: "vuela", dur: 0.8, s: 0.7, t1: 173.6 });
s(172.4, "whoosh", -2); s(173.2, "metal_fall", -4); s(174.0, "sparkle", -2);
o(177.4, "grande", { txt: "THE EASEMENT", y: 400, s: 140, c: C.oro, t1: 179.2 });
o(177.9, "grande", { txt: "OF IRONS", y: 580, s: 140, c: C.oro, t1: 179.2 });
s(177.4, "fanfare", -6);
// 179.22 pensalo: no eran para que no te escapes... eran para ALQUILAR
cam(179.1, CX, Y.alta - 300, 1.5, 0.9);
o(181.6, "chip", { txt: "NOT FOR ESCAPES", x: 960, y: 140, c: C.violeta, s: 62, t1: 184.8 });
o(184.0, "chip", { txt: "(NOT ONLY)", x: 960, y: 250, c: C.rosa, s: 40, t1: 184.8 });
cam(185.0, 3880, Y.alta - 380, 1.05, 0.6);
o(185.8, "sello", { txt: "FOR RENT", x: 960, y: 300, s: 130, c: C.oro });
s(185.8, "stamp", 0);
// 186.6 el rico: grilletes livianos o nada · 190.3 el pobre: 20 libras hasta el desagüe y vuelta
cam(186.5, 2750, Y.alta - 260, 1.4, 0.9);
act({ a: 186.4, b: 190.3, x: [2300, 3000], tw: [186.6, 190.2], y: Y.alta, h: 420, ropa: REY, seed: 121, expr: "orgullo", manoD: "copa", bD: 70, cD: 70 });
w(189.2, "emote", { emo: "brillos", x: 2850, y: Y.alta - 470, s: 1.2 });
o(187.5, "chip", { txt: "RICH: LIGHT SHACKLES", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 58, t1: 189.1 });
o(189.2, "chip", { txt: "...OR NONE AT ALL", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 58, t1: 190.3 });
cam(190.3, 3600, Y.baja - 280, 1.15, 0.6);
act({ a: 190.3, b: 193.9, x: [3200, 4100], tw: [190.6, 192.6], y: Y.baja, h: 430, ropa: YO, seed: 1, expr: "triste", camina: 1.0, inclina: 12 });
act({ a: 193.9, b: 210.9, x: [4100, 3300], tw: [193.9, 196.5], y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "triste"], [210.1, "feliz"]], camina: 1.0, inclina: 12 });
o(191.3, "cuenta", { de: 0, a: 20, dur: 0.5, x: 1500, y: 300, s: 220, c: C.oro, t1: 193.9 });
o(191.7, "chip", { txt: "POUNDS OF IRON", x: 1500, y: 470, c: C.rojo, s: 54, t1: 193.9 });
s(190.9, "stomp", -6); s(191.5, "stomp", -6); s(192.1, "stomp", -6); s(192.7, "metal", -6);
// 193.94 quejas por siglos · Parlamento y la City ponen topes
for (let i = 0; i < 7; i++) o(194.0 + i * 0.13, "ico", { ico: "pergamino", x: 300 + i * 220, y: 380 + (i % 3) * 120, anim: "cae", s: 0.7, rot: (i - 3) * 9, t1: 198.0 });
s(194.0, "flutter", -2); s(194.5, "paper", -4);
o(195.0, "chip", { txt: "COMPLAINTS: CENTURIES", x: 960, y: 140, c: C.violeta, s: 60, t1: 198.0 });
o(196.0, "chip", { txt: "PARLIAMENT", x: 540, y: 880, c: C.rojo, s: 56, t1: 200.6 });
o(196.9, "chip", { txt: "CITY OF LONDON", x: 1300, y: 880, c: C.teal, tinta: C.noche, s: 56, t1: 200.6 });
o(198.4, "sello", { txt: "LIMITS!", x: 960, y: 520, s: 120, t1: 200.6 });
cam(200.6, KX + 100, Y.baja - 300, 1.5, 0.9);
act({ a: 200.6, b: 210.9, x: KX, y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "feliz"], [205.2, "miedo"]], salta: [201.3], habla: [[201, 202.6]] });
w(201.3, "emote", { emo: "brillos", x: KX, y: Y.baja - 520, s: 1.2 });
s(201.3, "spring", -3);
o(205.4, "chip", { txt: "SQUEEZED TOO HARD?", x: 960, y: 140, c: C.rojo, s: 60, t1: 206.8 });
s(205.6, "metal", 0); s(206.2, "gasp", -4);
cam(206.9, 3400, Y.baja - 300, 1.3, 0.9);
w(208.7, "chip", { txt: "STAND UP STRAIGHT?", x: 3350, y: Y.baja - 560, c: C.violeta, s: 36, t1: 210.9 });
fee(210.1, 3, "STANDING UP");
// 210.96 la Torre de Londres: lista de precios y la leyenda de Flambard
cam(210.8, 13450, SUELO - 1050, 0.4, 1.6);
s(210.7, "whoosh_big", -2);
o(211.6, "chip", { txt: "THE TOWER OF LONDON", x: 960, y: 140, c: C.violeta, s: 66, t1: 215.2 });
w(214.6, "ico", { ico: "pergamino", x: 13050, y: SUELO - 520, s: 2.4, tag: "PRICE LIST", t1: 218.2 });
s(214.6, "unroll", -2);
o(216.4, "chip", { txt: "THE LEGEND", x: 960, y: 920, c: C.oro, tinta: C.noche, s: 60, t1: 218.4 });
cam(217.6, 13440, SUELO - 1460, 1.15, 1.2);
const FL: Ropa = { tunica: "#f4f0e8", tunica2: "#c8c0d8", cinto: "#f7c548", piel: "#f2b48a", piel2: "#d98d66", pelo: "#6a4a2a" };
const GUARDIA: Ropa = { tunica: "#7a8a9a", tunica2: "#4a5a6a", cinto: "#3a2418", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" };
act({ a: 217.5, b: 238.1, x: 13300, y: SUELO - 1310, h: 380, ropa: FL, seed: 131, sobre: "mitra", expr: [[0, "orgullo"], [224, "feliz"], [233.7, "sorpresa"], [235, "feliz"]], habla: [[227.4, 228.4]], manoD: "copa", bD: 60, cD: 60 });
o(221.0, "cuenta", { de: 1000, a: 1100, dur: 0.6, x: 1520, y: 300, s: 200, c: C.oro, t1: 223.8 });
o(222.3, "chip", { txt: "BISHOP RANULF FLAMBARD", x: 960, y: 900, c: C.violeta, s: 56, t1: 224.6 });
o(219.6, "chip", { txt: "THE FIRST PRISONER", x: 960, y: 140, c: C.rojo, s: 58, t1: 222.2 });
wi(224.8, "bolsa", 13090, SUELO - 1470, { s: 0.55, t1: 229 });
wi(226.8, "pan", 13530, SUELO - 1400, { s: 0.5, t1: 229 });
s(224.8, "coin", -3); s(226.8, "pop", -3);
for (let i = 0; i < 2; i++)
  act({ a: 227.4, b: 240.0, x: 13560 + i * 150, y: SUELO - 1310, h: 360, ropa: GUARDIA, seed: 141 + i, flip: true, aparece: 227.4 + i * 0.2,
    expr: [[0, "feliz"], [235.6, "dormido"]], rot: [0, -80], tw: [235.8 + i * 0.2, 236.2 + i * 0.2], manoD: "jarra", bD: 70, cD: 80 });
o(228.0, "chip", { txt: "DINNERS FOR HIS GUARDS", x: 960, y: 140, c: C.ambar, tinta: C.noche, s: 58, t1: 230.4 });
// 229 el barril de vino · 232.6 adentro, una soga
o(229.4, "oscuro", { t1: 240.5, a: 0.35, c: "#0a0530" });
o(231.0, "chip", { txt: "A BIG CASK OF WINE", x: 960, y: 140, c: C.rojo, s: 60, t1: 232.6 });
s(230.6, "roll", -4); s(231.6, "wood_hit", -2);
wi(234.15, "rollo", 13240, SUELO - 1560, { s: 0.55, anim: "gira", t1: 236.7 });
s(234.15, "spring", 0); s(234.3, "gasp", -6);
o(234.4, "sello", { txt: "A ROPE", x: 960, y: 260, s: 110, t1: 236.5 });
s(235.9, "snore", -4); s(236.9, "cloth", -3);
o(236.0, "chip", { txt: "GUARDS: DRUNK", x: 960, y: 140, c: C.violeta, s: 58, t1: 237.4 });
// 238.2 baja por la pared
cam(238.0, 13950, SUELO - 760, 0.62, 1.4);
act({ a: 238.1, b: 243.6, x: [13995, 14400], y: [SUELO - 1250, SUELO + 22], tw: [238.2, 239.8], h: 330, ropa: FL, seed: 131, sobre: "mitra", expr: [[0, "miedo"], [239.8, "feliz"]], camina: 0.6, bI: 160, bD: 160, cI: 10, cD: 10, salta: [240.1, 241.4] });
s(238.3, "cloth", -2); s(238.8, "cloth", -4); s(239.8, "stomp", -2);
o(240.1, "chip", { txt: "FIRST PRISONER", x: 960, y: 200, c: C.violeta, s: 64, t1: 243.6 });
o(242.4, "grande", { txt: "FIRST ESCAPE", y: 420, s: 150, c: C.oro, t1: 243.7 });
s(242.4, "slam", 0); s(242.5, "fanfare", -6);
// 243.74 la lección: la plata te compraba hasta la soga
cam(243.6, 14750, SUELO - 380, 1.0, 1.2);
act({ a: 243.6, b: 249.5, x: [14400, 15150], tw: [243.7, 249.4], y: SUELO + 22, h: 330, ropa: FL, seed: 131, sobre: "mitra", expr: "feliz", camina: 1.3, flip: false });
s(244.0, "step", -8); s(245.2, "step", -8); s(246.4, "step", -8); s(247.6, "step", -8);
o(244.0, "chip", { txt: "THE LESSON", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 60, t1: 249.3 });
o(246.4, "ico", { ico: "cadena", x: 640, y: 560, s: 1.1, tag: "LIGHTER CHAINS", c: C.violeta, t1: 249.3 });
o(248.6, "ico", { ico: "rollo", x: 1280, y: 560, s: 1.1, tag: "THE ROPE", c: C.oro, t1: 249.3 });
s(246.4, "metal", -4); s(248.6, "sparkle", -2);

// ── piezas especiales
export const X1 = (t: number, _c: Pose): React.ReactNode => (
  <>
    {/* grilletes de «vos» en el cuarto de las cadenas: pesados → livianos */}
    {t >= 163.4 && t < 186.4 && <Grilletes t={t} x={CX} y={Y.alta} h={430} t0={163.45} aX={CX + 140} aY={Y.alta - 30} peso={t < 172.6 ? 2.2 : 0.7} />}
    {t >= 190.3 && t < 196.6 && <Grilletes t={t} x={t < 193.9 ? 3200 + 900 * prog(t, 190.6, 192.6) : 4100 - 800 * prog(t, 193.9, 196.5)} y={Y.baja} h={430} peso={2.2} />}
    {t >= 188.0 && t < 189.2 && <Grilletes t={t} x={2300 + 700 * prog(t, 186.6, 190.2)} y={Y.alta} h={420} peso={0.4} />}
    {t >= 148.9 && t < 153.2 && <Grilletes t={t} x={3240} y={Y.baja} h={430} t0={148.96} aX={2960} aY={Y.baja - 200} />}
    {t >= 205.5 && t < 210.9 && <Grilletes t={t} x={KX} y={Y.baja} h={450} t0={205.6} aX={2120} aY={Y.baja - 120} />}
    {/* bola de 20 libras arrastrada */}
    {t >= 190.3 && t < 196.6 && (() => {
      const x = t < 193.9 ? 3200 + 900 * prog(t, 190.6, 192.6) : 4100 - 800 * prog(t, 193.9, 196.5);
      const bx = t < 193.9 ? x - 230 : x + 230;
      return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><line x1={x} y1={Y.baja - 20} x2={bx} y2={Y.baja - 40} stroke="#9aa3b3" strokeWidth={12} strokeDasharray="20 8" /><circle cx={bx} cy={Y.baja - 55} r={55} fill="#3a3a4e" /><circle cx={bx - 18} cy={Y.baja - 74} r={14} fill="#6a6a80" /></svg>;
    })()}
    {/* caja en un palo por la reja de Newgate */}
    {t >= 134.0 && t < 142.2 && (() => {
      const u = prog(t, 134.0, 134.8);
      return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><line x1={4300} y1={Y.baja - 330} x2={4300 + 380 * u} y2={Y.baja - 360} stroke="#8a5a2a" strokeWidth={14} /><rect x={4250 + 380 * u} y={Y.baja - 450} width={110} height={80} rx={8} fill="#7a4520" stroke={C.oro} strokeWidth={6} /></svg>;
    })()}
    {/* el barril que entra rodando a la habitación del obispo, y la soga por la ventana */}
    {t >= 230.4 && t < 237 && (() => {
      const u = prog(t, 230.5, 231.6);
      const x = 12980 + 260 * u;
      return <svg style={{ position: "absolute", left: x - 90, top: SUELO - 1490, overflow: "visible" }} width={180} height={180}><g transform={`rotate(${u * 540} 90 90)`}><ellipse cx={90} cy={90} rx={80} ry={86} fill="#a8622a" /><rect x={10} y={40} width={160} height={14} fill="#5a3418" /><rect x={10} y={126} width={160} height={14} fill="#5a3418" /></g></svg>;
    })()}
    {t >= 236.9 && t < 250 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><path d={`M 13995 ${SUELO - 1390} Q 14010 ${SUELO - 900} 13995 ${SUELO - 1390 + 1390 * prog(t, 236.9, 237.9)}`} stroke="#c9a23a" strokeWidth={14} fill="none" /></svg>}
  </>
);
export const P1 = (t: number): React.ReactNode => <Letrero t={t} t0={142.4} t1={146.3} txt="HOTEL NEWGATE" estrellas={1} />;
