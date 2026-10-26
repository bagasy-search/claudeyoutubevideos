import React from "react";
import { C } from "./kit";
import { SUELO } from "./mundo";
import { cam, act, o, w, fee, s, trampa, Y, YO, CARCELERO, JUEZ, PRESO } from "./base";
import { Recibo, Letrero } from "./extras";
import type { Pose } from "./motor";
import type { Ropa } from "./persona";

// ═══ TRAMPA 7 · LA PUERTA (734.77), EL GIRO (802.69) y CTA (903.81)
trampa(734.77);
cam(734.6, 1500, SUELO - 520, 0.9, 1.6);
s(734.5, "whoosh_big", -2); s(734.77, "slam", 0); s(734.8, "boom", -4);
o(734.8, "grande", { txt: "TRAP #7", y: 420, s: 170, c: C.oro, t1: 737.0 });
o(736.1, "chip", { txt: "THE DOOR", x: 960, y: 620, c: C.rojo, s: 84, t1: 737.0 });
o(737.2, "chip", { txt: "SAY YOU SURVIVED IT ALL", x: 960, y: 140, c: C.violeta, s: 60, t1: 742.9 });
const REPASO: [number, "moneda" | "cadena" | "pesa" | "balde" | "piojo", string][] = [[738.85, "moneda", "THE BILL"], [739.6, "cadena", "THE CHAINS"], [740.3, "pesa", "THE WEIGHT"], [741.1, "balde", "THE HOLE"], [741.9, "piojo", "THE FEVER"]];
REPASO.forEach(([t, ico, tag], i) => { o(t, "ico", { ico, x: 260 + i * 350, y: 560, s: 0.8, tag, t1: 742.9 }); s(t, "pop", -3); });
// 743.03 los jueces llegan · 749.37 NOT GUILTY
cam(743.0, 6200, SUELO - 420, 0.85, 1.2);
s(742.9, "whoosh_big", -3); s(743.2, "warhorn", -10);
act({ a: 743.0, b: 799.5, x: 6700, y: Y.estrado, h: 400, ropa: JUEZ, seed: 151, sobre: "cofia", viejo: true, flip: true, expr: [[0, "orgullo"], [749.3, "feliz"]], habla: [[748.6, 749.9]], manoD: "mazo", bD: 120, cD: 40, aparece: 743.2 });
act({ a: 743.0, b: 751.4, x: 5880, y: Y.sala, h: 430, ropa: YO, seed: 1, expr: [[0, "miedo"], [749.4, "sorpresa"], [750.4, "feliz"]], salta: [750.4, 751.0] });
o(745.4, "chip", { txt: "THE WORDS YOU WAITED MONTHS FOR", x: 960, y: 140, c: C.violeta, s: 54, t1: 749.2 });
o(749.37, "grande", { txt: "NOT GUILTY", y: 380, s: 170, c: C.lima, t1: 751.3 });
s(749.37, "slam", 0); s(749.4, "wood_hit", -2); s(749.5, "fanfare", -4);
o(750.45, "chip", { txt: "YOU ARE FREE!", x: 960, y: 560, c: C.oro, tinta: C.noche, s: 66, t1: 751.4 });
s(750.5, "glitter", -4);
// 751.45 la puerta… y el carcelero con la mano extendida
cam(751.4, 5250, Y.sala - 300, 1.15, 0.9);
act({ a: 751.4, b: 767.8, x: [5880, 5330], tw: [751.5, 752.8], y: Y.sala, h: 430, ropa: YO, seed: 1, expr: [[0, "feliz"], [753.0, "sorpresa"], [755.5, "miedo"], [763.9, "triste"]], camina: 2.0, flip: true });
act({ a: 751.4, b: 767.8, x: 5060, y: Y.sala, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: [[0, "orgullo"], [758.6, "feliz"]], habla: [[754.2, 757.6], [758.6, 763.4]], bD: 90, cD: 0, aparece: 752.6 });
s(752.6, "wood_hit", -2); s(752.9, "spring", -4);
w(753.2, "emote", { emo: "excl", x: 5330, y: Y.sala - 500, s: 1.2 });
o(755.0, "grande", { txt: "THE DISCHARGE FEE", y: 300, s: 120, c: C.oro, t1: 758.4 });
s(755.0, "slam", -1);
fee(756.2, 8, "DISCHARGE FEE");
s(756.2, "coin_rain", -3);
o(758.7, "ico", { ico: "pan", x: 520, y: 560, s: 0.8, tag: "FED YOU", t1: 763.7 });
o(759.8, "ico", { ico: "cadena", x: 960, y: 560, s: 0.8, tag: "CHAINED YOU", t1: 763.7 });
o(760.8, "ico", { ico: "cama", x: 1400, y: 560, s: 0.8, tag: "HOUSED YOU", t1: 763.7 });
s(758.7, "pop", -3); s(759.8, "metal", -4); s(760.8, "pop", -3);
o(761.6, "chip", { txt: "\"STILL OWED FOR ALL OF IT\"", x: 960, y: 140, c: C.rojo, s: 58, t1: 763.8 });
o(763.9, "sello", { txt: "THE LAW LET HIM KEEP YOU", x: 960, y: 300, s: 80 });
s(763.9, "stamp", 0);
// 767.87 un inocente vuelve a su celda porque no puede pagar la salida
cam(767.8, 2750, SUELO + 380, 1.15, 1.6);
s(767.7, "whoosh_big", -3);
act({ a: 767.8, b: 775.0, x: [3300, 2700], tw: [768.0, 770.6], y: Y.sotano, h: 400, ropa: YO, seed: 1, expr: "triste", camina: 0.8, flip: true, inclina: 10 });
w(768.4, "sello", { txt: "INNOCENT", x: 2750, y: Y.sotano - 520, s: 60, c: C.lima, t1: 775.0 });
o(771.0, "chip", { txt: "COULD NOT AFFORD TO LEAVE", x: 960, y: 900, c: C.rojo, s: 58, t1: 775.0 });
s(768.4, "stamp", -2); s(770.8, "metal", -2); s(771.0, "sad", -6);
// 775.03 ¿cuánto duró? siglos · 1774 · dos años antes de 1776
cam(775.0, 3500, Y.baja - 340, 0.9, 1.2);
o(775.1, "chip", { txt: "HOW LONG DID THIS LAST?", x: 960, y: 140, c: C.violeta, s: 60, t1: 778.7 });
o(776.5, "grande", { txt: "CENTURIES", y: 400, s: 150, c: C.oro, t1: 778.7 });
s(776.5, "slam", -2);
const HOWARD: Ropa = { tunica: "#2a2a3a", tunica2: "#14141f", cinto: "#c9a23a", piel: "#f2c0a0", piel2: "#d89a7a", pelo: "#d8d8d8" };
act({ a: 778.7, b: 793.0, x: 3500, y: Y.baja, h: 430, ropa: HOWARD, seed: 261, sobre: "sombrero", expr: [[0, "neutro"], [783, "orgullo"]], habla: [[780.4, 783.4]], manoD: "pergamino", bD: 90, cD: 60, aparece: 778.8 });
o(778.83, "cuenta", { de: 1300, a: 1774, dur: 1.0, x: 1450, y: 300, s: 220, c: C.oro, t1: 788.1 });
o(779.0, "chip", { txt: "JOHN HOWARD → PARLIAMENT", x: 1450, y: 470, c: C.teal, tinta: C.noche, s: 44, t1: 788.1 });
o(784.6, "sello", { txt: "FEES ABOLISHED FOR THE INNOCENT", x: 960, y: 820, s: 60, c: C.lima });
s(784.6, "stamp", 0); s(785.0, "fanfare", -10);
o(788.3, "linea", { x: 360, y: 640, x2: 1560, y2: 640, c: C.oro, t1: 793.0 });
o(788.6, "chip", { txt: "1774", x: 360, y: 560, c: C.oro, tinta: C.noche, s: 60, t1: 793.0 });
o(789.6, "chip", { txt: "1776", x: 1560, y: 560, c: C.rojo, s: 60, t1: 793.0 });
o(790.3, "chip", { txt: "DECLARATION OF INDEPENDENCE", x: 1360, y: 740, c: C.violeta, s: 40, t1: 793.0 });
o(791.0, "chip", { txt: "2 YEARS", x: 960, y: 560, c: C.teal, tinta: C.noche, s: 52, t1: 793.0 });
s(788.6, "pop", -3); s(789.6, "pop", -3); s(791.0, "ding", -4);
o(793.1, "chip", { txt: "INNOCENT WAS NOT ENOUGH", x: 960, y: 140, c: C.violeta, s: 60, t1: 799.5 });
o(797.3, "sello", { txt: "YOU HAD TO PAY FOR IT", x: 960, y: 360, s: 100 });
s(797.3, "stamp", 0);
act({ a: 793.0, b: 802.6, x: 3400, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: [[0, "triste"], [799.6, "neutro"]] });
// 799.63 ¿peor que la muerte? · 802.69 el giro
o(799.7, "grande", { txt: "WORSE THAN DEATH?", y: 400, s: 130, c: C.rojo, t1: 802.6 });
s(799.7, "suspense", -4);
o(802.7, "grande", { txt: "THE TWIST", y: 420, s: 170, c: C.oro, t1: 804.6 });
s(802.7, "slam", 0); s(802.75, "boom", -2); s(802.8, "riser", -8);
cam(803.9, 10850, SUELO - 760, 0.62, 1.8);
s(803.8, "whoosh_big", -1);
o(804.4, "chip", { txt: "FOR ONE KIND OF PRISONER...", x: 960, y: 140, c: C.violeta, s: 60, t1: 807.0 });
s(807.3, "ding", 0); s(807.5, "sparkle", -2);
// 808.57 Poitiers, 1356: capturan al rey de Francia
cam(808.5, 15600, SUELO - 380, 0.7, 1.6);
s(808.4, "whoosh_big", -2);
o(808.8, "cuenta", { de: 1300, a: 1356, dur: 0.6, x: 960, y: 300, s: 200, c: C.oro, t1: 812.0 });
o(809.6, "chip", { txt: "THE BATTLE OF POITIERS", x: 960, y: 470, c: C.rojo, s: 56, t1: 812.0 });
for (let i = 0; i < 4; i++)
  act({ a: 808.5, b: 815.2, x: [14900 + i * 140, 15350 + i * 140], tw: [808.8, 811.6], y: Y.calle, h: 400, ropa: PRESO(i + 21), seed: 340 + i, expr: "enojado", camina: 1.6, manoD: "cuchilla", bD: 120, cD: 30, sobre: "barba" });
const JUAN: Ropa = { tunica: "#2b3a9f", tunica2: "#1a2470", cinto: "#f7c548", piel: "#f2c0a0", piel2: "#d89a7a", pelo: "#6a4a2a" };
act({ a: 808.5, b: 815.2, x: 15950, y: Y.calle, h: 450, ropa: JUAN, seed: 351, sobre: "coronaFR", flip: true, expr: [[0, "orgullo"], [811.8, "sorpresa"], [812.6, "miedo"]], salta: [812.0], bI: 140, bD: 140, cI: 10, cD: 10 });
s(809.0, "march", -4); s(810.0, "sword", -3); s(810.6, "sword", -4); s(811.4, "sword", -3); s(812.0, "gasp", -3);
o(812.2, "chip", { txt: "THE KING OF FRANCE · JOHN II", x: 960, y: 900, c: C.violeta, s: 56, t1: 815.1 });
// 815.27 no lo tiraron a un pozo: le dieron el Savoy
o(815.4, "ico", { ico: "balde", x: 560, y: 420, s: 0.9, txt: "X", tag: "NOT A PIT", t1: 818.4 });
s(815.4, "fail", -6);
cam(818.5, 10850, SUELO - 640, 0.75, 1.6);
s(818.4, "whoosh_big", -2);
o(818.7, "grande", { txt: "A PALACE", y: 300, s: 140, c: C.oro, t1: 821.0 });
s(818.7, "fanfare", -6); s(818.8, "glitter", -3);
o(819.8, "chip", { txt: "THE SAVOY · ON THE THAMES", x: 960, y: 460, c: C.violeta, s: 52, t1: 822.2 });
act({ a: 818.5, b: 837.6, x: 10850, y: Y.savoy, h: 460, ropa: JUAN, seed: 351, sobre: "coronaFR", expr: [[0, "feliz"], [827.2, "sorpresa"], [831, "orgullo"]], manoD: "copa", bD: 70, cD: 70, habla: [[822.5, 823.4]] });
const SIRV = (i: number): Ropa => ({ ...PRESO(i), tunica: "#f4f0e8", tunica2: "#c8c0b0" });
for (let i = 0; i < 3; i++)
  act({ a: 822.4, b: 837.6, x: 10350 + i * 220 + (i > 0 ? 900 : 0), y: Y.savoy, h: 380, ropa: SIRV(i), seed: 360 + i, flip: i > 0, aparece: 822.4 + i * 0.15, expr: "feliz", manoD: i === 0 ? "jarra" : i === 1 ? "musica" : "pan", bD: 60, cD: 70 });
o(822.5, "ico", { ico: "corona", x: 260, y: 820, s: 0.6, tag: "SERVANTS", t1: 826.9 });
o(823.3, "ico", { ico: "caballo", x: 560, y: 820, s: 0.6, tag: "HORSES", t1: 826.9 });
o(824.0, "ico", { ico: "musica", x: 860, y: 820, s: 0.6, tag: "MUSICIANS", t1: 826.9 });
o(824.8, "ico", { ico: "copa", x: 1160, y: 820, s: 0.6, tag: "FINE WINE", t1: 826.9 });
o(825.6, "ico", { ico: "oveja", x: 1460, y: 820, s: 0.6, tag: "HUNTING", t1: 826.9 });
for (let i = 0; i < 5; i++) s(822.5 + i * 0.78, "pop", -3);
// 827.13 el rescate: 3 millones de coronas de oro
o(827.2, "cuenta", { de: 0, a: 3000000, dur: 1.4, x: 960, y: 300, s: 170, c: C.oro, t1: 834.0 });
o(828.4, "chip", { txt: "GOLD CROWNS · THE RANSOM", x: 960, y: 450, c: C.rojo, s: 54, t1: 834.0 });
for (let i = 0; i < 8; i++) s(827.2 + i * 0.17, "coin", -6);
o(830.6, "chip", { txt: "SEVERAL × FRANCE'S YEARLY INCOME", x: 960, y: 900, c: C.violeta, s: 50, t1: 834.0 });
o(834.1, "chip", { txt: "FRANCE COULD NEVER FINISH PAYING", x: 960, y: 140, c: C.rojo, s: 56, t1: 837.6 });
s(834.1, "unroll", -2); s(835.0, "paper", -4);
// 837.69 lo sueltan bajo palabra… y vuelve solo
cam(837.6, 10850, SUELO - 520, 0.6, 1.0);
act({ a: 837.6, b: 846.1, x: [10850, 12000], tw: [838.0, 840.4], y: Y.savoy, h: 460, ropa: JUAN, seed: 351, sobre: "coronaFR", expr: "feliz", camina: 1.2 });
act({ a: 840.4, b: 846.1, x: [12000, 10850], tw: [840.6, 843.2], y: Y.savoy, h: 460, ropa: JUAN, seed: 351, sobre: "coronaFR", expr: [[0, "neutro"], [843.2, "feliz"]], camina: 1.2, flip: true });
o(838.0, "chip", { txt: "RELEASED ON A PROMISE", x: 960, y: 140, c: C.teal, tinta: C.noche, s: 58, t1: 840.4 });
o(840.6, "chip", { txt: "...AND CAME BACK BY CHOICE", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 58, t1: 843.6 });
s(840.6, "spring", -4);
cam(839.0, 11600, SUELO - 560, 0.8, 1.6);
cam(841.6, 11000, SUELO - 560, 0.85, 1.6);
o(843.7, "ico", { ico: "corona", x: 960, y: 340, s: 1.1, tag: "DIED THERE · STILL LIVING LIKE A KING", c: C.violeta, t1: 846.1 });
// 846.17 Ricardo Corazón de León: 150.000 marcos
cam(846.1, 13440, SUELO - 1400, 1.0, 1.6);
s(846.0, "whoosh_big", -2);
const RICARDO: Ropa = { tunica: "#c81d2e", tunica2: "#7a0f1d", cinto: "#f7c548", piel: "#f2c0a0", piel2: "#d89a7a", pelo: "#c9802a" };
act({ a: 846.1, b: 870.9, x: 13400, y: SUELO - 1310, h: 400, ropa: RICARDO, seed: 371, sobre: "corona", expr: [[0, "orgullo"], [849.5, "sorpresa"], [853, "triste"], [868.2, "feliz"]], manoD: "leon", bD: 40, cD: 60 });
o(846.3, "chip", { txt: "NOT THE ONLY ROYAL GUEST", x: 960, y: 140, c: C.violeta, s: 60, t1: 848.2 });
o(848.3, "chip", { txt: "RICHARD THE LIONHEART", x: 960, y: 140, c: C.rojo, s: 62, t1: 853.0 });
o(850.4, "ico", { ico: "cruz", x: 400, y: 520, s: 0.8, tag: "HOME FROM THE CRUSADES", t1: 853.0 });
o(853.2, "chip", { txt: "HELD IN A GERMAN CASTLE", x: 960, y: 140, c: C.violeta, s: 60, t1: 857.6 });
s(850.4, "pop", -3); s(853.2, "metal", -4);
o(857.8, "cuenta", { de: 0, a: 150000, dur: 1.2, x: 960, y: 320, s: 200, c: C.oro, t1: 864.0 });
o(858.9, "chip", { txt: "MARKS", x: 960, y: 480, c: C.rojo, s: 56, t1: 864.0 });
for (let i = 0; i < 6; i++) s(857.8 + i * 0.2, "coin", -6);
o(861.0, "chip", { txt: "1/4 OF EVERYTHING PEOPLE OWNED", x: 960, y: 900, c: C.violeta, s: 52, t1: 868.0 });
o(864.2, "ico", { ico: "copa", x: 560, y: 560, s: 0.9, tag: "CHURCH GOLD", c: C.oro, t1: 868.0 });
o(865.0, "ico", { ico: "cruz", x: 1360, y: 560, s: 0.9, tag: "SILVER PLATE", c: C.violeta, t1: 868.0 });
s(864.2, "metal", -4); s(865.0, "metal", -4);
for (let i = 0; i < 12; i++) w(861.2 + i * 0.25, "ico", { ico: "moneda", x: 12500 + (i % 6) * 360, y: SUELO - 700, x2: 13400, y2: SUELO - 1500, anim: "vuela", dur: 0.9, s: 0.3, t1: 862.2 + i * 0.25 });
s(861.2, "coin_rain", -4);
o(868.3, "sello", { txt: "A KINGDOM PAID ONE PRISONER'S BILL", x: 960, y: 300, s: 64 });
s(868.3, "stamp", 0);
// 870.99 los presos comunes no juntaban ni 4 peniques
cam(870.9, 4420, Y.baja - 300, 1.3, 1.6);
s(870.8, "whoosh_big", -2);
act({ a: 870.9, b: 877.0, x: 4250, y: Y.baja, h: 430, ropa: YO, seed: 1, expr: "triste", bD: 100, cD: 10 });
o(871.2, "chip", { txt: "ORDINARY PRISONERS:", x: 960, y: 140, c: C.violeta, s: 58, t1: 874.2 });
o(872.4, "cuenta", { de: 0, a: 4, dur: 0.5, x: 1450, y: 330, s: 200, c: C.rojo, suf: "d", t1: 874.2 });
o(873.0, "ico", { ico: "x", x: 1450, y: 330, s: 1.4, t1: 874.2 });
s(873.0, "fail", -4);
o(874.4, "chip", { txt: "SAME COUNTRY · SAME WORD", x: 960, y: 140, c: C.violeta, s: 58, t1: 883.0 });
o(875.6, "grande", { txt: "PRISON", y: 300, s: 150, c: C.oro, t1: 877.0 });
s(875.6, "slam", -2);
cam(877.0, 10850, SUELO - 600, 0.75, 0.9);
act({ a: 877.0, b: 879.2, x: 10850, y: Y.savoy, h: 460, ropa: JUAN, seed: 351, sobre: "coronaFR", expr: "feliz", manoD: "copa", bD: 70, cD: 70 });
o(877.1, "chip", { txt: "A PALACE ON THE RIVER", x: 960, y: 900, c: C.oro, tinta: C.noche, s: 56, t1: 879.1 });
s(877.0, "whoosh", -2); s(877.2, "glitter", -4);
cam(879.2, 19100, SUELO + 820, 0.8, 0.9);
act({ a: 879.2, b: 883.2, x: 19100, y: Y.botella, h: 360, ropa: YO, seed: 1, expr: "triste" });
o(879.3, "chip", { txt: "A HOLE IN THE ROCK", x: 960, y: 900, c: C.rojo, s: 56, t1: 883.1 });
s(879.2, "whoosh", -2); s(880.2, "drop", -6);
o(883.2, "ico", { ico: "mazo", x: 600, y: 420, s: 1.0, txt: "X", tag: "NEVER THE CRIME", t1: 886.8 });
o(884.8, "ico", { ico: "bolsa", x: 1320, y: 420, s: 1.4, tag: "IT WAS THE PURSE", c: C.oro, t1: 886.8 });
s(883.2, "fail", -4); s(884.8, "coin", 0); s(884.9, "slam", -2);
// 886.95 el verdadero secreto: clasificar a la gente por la plata
cam(886.9, 3500, Y.baja - 330, 1.0, 1.4);
act({ a: 886.9, b: 894.8, x: 3500, y: Y.baja, h: 440, ropa: YO, seed: 1, expr: [[0, "sorpresa"], [889.4, "enojado"], [891.6, "miedo"]], salta: [889.5], bD: 120, cD: 20 });
s(886.8, "whoosh_big", -2);
o(887.0, "chip", { txt: "THE REAL SECRET", x: 960, y: 140, c: C.oro, tinta: C.noche, s: 64, t1: 894.7 });
o(889.4, "ico", { ico: "mazo", x: 560, y: 520, s: 0.9, txt: "X", tag: "NOT BUILT TO PUNISH", t1: 894.7 });
o(891.6, "ico", { ico: "balanza", x: 1360, y: 520, s: 1.1, tag: "BUILT TO SORT BY MONEY", c: C.oro, t1: 894.7 });
s(889.4, "fail", -6); s(891.6, "ding", -2);
cam(894.8, 3600, SUELO + 500, 0.45, 1.4);
o(894.9, "chip", { txt: "AT THE BOTTOM OF THE PILE:", x: 960, y: 140, c: C.violeta, s: 58, t1: 900.7 });
o(895.6, "chip", { txt: "THE JAIL", x: 480, y: 280, c: C.rojo, s: 52, t1: 900.7 });
o(896.3, "chip", { txt: "THE FEVER", x: 960, y: 280, c: C.lima, tinta: C.noche, s: 52, t1: 900.7 });
o(897.0, "chip", { txt: "THE DEBT", x: 1440, y: 280, c: C.oro, tinta: C.noche, s: 52, t1: 900.7 });
s(895.6, "pop", -3); s(896.3, "pop", -3); s(897.0, "pop", -3);
o(898.4, "grande", { txt: "WORSE THAN DEATH", y: 520, s: 130, c: C.rojo, t1: 900.7 });
s(898.4, "slam", -1);
// 900.89 la muerte no te mandaba factura
cam(900.8, 2600, Y.baja - 300, 1.2, 1.0);
act({ a: 900.8, b: 903.8, x: 2430, y: Y.baja, h: 450, ropa: CARCELERO, seed: 7, sobre: "gorro", expr: "feliz", bD: 90, cD: 0 });
o(901.0, "oscuro", { t1: 903.8, a: 0.55 });
o(901.6, "grande", { txt: "DEATH DID NOT SEND", y: 360, s: 110, c: C.oro, t1: 903.8 });
o(902.3, "grande", { txt: "YOU A BILL", y: 520, s: 150, c: C.oro, t1: 903.8 });
s(901.6, "boom", -2); s(902.3, "slam", 0);
// 903.81 CTA: salís con las orejas puestas → suscribite → la próxima: una noche en un castillo
cam(903.8, 1500, SUELO - 380, 1.0, 1.0);
act({ a: 903.8, b: 917.6, x: [2000, 1150], tw: [903.9, 906.6], y: Y.calle, h: 430, ropa: YO, seed: 1, expr: [[0, "feliz"], [906.6, "orgullo"], [913.0, "sorpresa"], [914.6, "feliz"]], habla: [[913.0, 916.5]], camina: 1.4, flip: true, salta: [906.8, 913.1], bD: 140, cD: 30 });
o(904.6, "ico", { ico: "oreja", x: 600, y: 330, s: 0.9, tag: "EARS: STILL ATTACHED", c: C.lima, t1: 907.3 });
s(904.6, "ding", -3);
o(907.4, "grande", { txt: "SUBSCRIBE", y: 300, s: 150, c: C.rojo, t1: 909.3 });
o(907.9, "ico", { ico: "campana", x: 1480, y: 300, s: 0.9, anim: "gira", t1: 909.3 });
s(907.4, "slam", -2); s(907.9, "ding", 0);
// 909.3 golpe a pantalla llena (golpe.tsx): NEXT TIME · ONE NIGHT IN A MEDIEVAL CASTLE
s(909.3, "whoosh_big", -2); s(910.2, "riser", -8);
cam(912.3, 1250, SUELO - 400, 1.15, 1.4);
o(912.5, "sello", { txt: "PAID?", x: 1640, y: 330, s: 90, rot: -10, t1: 917.6 });
s(912.5, "stamp", -2);
o(913.0, "chip", { txt: "WHICH TRAP GOT YOU FIRST?", x: 960, y: 140, c: C.rojo, s: 64, t1: 917.6 });
o(914.0, "ico", { ico: "campana", x: 1560, y: 640, s: 0.8, anim: "gira", tag: "SUBSCRIBE", c: C.rojo, t1: 917.6 });
o(914.6, "chip", { txt: "TELL ME IN THE COMMENTS", x: 960, y: 900, c: C.oro, tinta: C.noche, s: 56, t1: 917.6 });
s(914.6, "pop", -3);

export const X4 = (t: number, c: Pose): React.ReactNode => (
  <>
    {/* la factura del rey: un rollo que no se termina nunca */}
    {t >= 834.0 && t < 837.7 && <Recibo t={t} t0={834.0} x={10600} y={SUELO - 760} largo={720} dur={3.0} w={300} items={[["RANSOM", "3,000,000"], ["SERVANTS", "∞"], ["HORSES", "∞"], ["WINE", "∞"]]} resalta={0} />}
  </>
);
export const P4 = (t: number): React.ReactNode => <Letrero t={t} t0={807.15} t1={808.4} txt="HOTEL SAVOY" estrellas={5} />;
