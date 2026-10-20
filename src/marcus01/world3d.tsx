// marcus01 · EL MUNDO: la casa de Marcus en corte (sótano con el furnace, living, dormitorio, garaje) en una tormenta de hielo
// de Georgia, con el poste y su transformador, el medidor de gas y el generador en el patio. UNA cámara para todo el video.
// El furnace está modelado pieza por pieza (gabinete abierto, ventilador, placa, inductor, presostato, encendedor, quemadores,
// válvula de gas, sensor de llama) y cada pieza se prende/apaga con la palabra exacta (EV, sacado de caps.json con at()).
// Flujos de energía/gas/aire = puntos suaves que viajan por curvas. Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";
import { makeAt } from "../kits/yanqui3d/engine";
import CAPS from "./caps.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// ventana "encendido entre a y b" con fundidos cortos
const on = (t: number, a: number, b: number, f = 0.25) => win(t, a, a + f) * (1 - win(t, b, b + f));

export const at = makeAt(CAPS as [string, number][]);

// ---------------- EVENTOS (segundos de la voz) ----------------
export const EV = {
  linesDown: at("brought the lines down"),
  dark: at("the whole street is dark"),
  nineteen: at("19 degrees"),
  gasLine: at("Full gas line"),
  howCan: at("how can a gas"),
  thing: at("Here's the thing"),
  open: at("let's open this thing up"),
  inside: at("see what's inside"),
  inducer: at("start the inducer motor"),
  pulls: at("pulls air through"),
  pressure: at("Then a pressure switch"),
  safety: at("that's a safety"),
  igniter: at("Next the igniter"),
  valve: at("opens the gas valve"),
  burnersLight: at("light, and a flame"),
  sensor: at("flame sensor makes sure"),
  blower: at("the big blower kicks on"),
  everyRoom: at("into every room"),
  countBoard: at("The board, the inducer"),
  needs: at("Every single one of those needs"),
  takeAway: at("Take away the power"),
  shut: at("gas valve stays shut"),
  waiting: at("it's waiting"),
  boardSmall: at("The board and the inducer are small"),
  addUp: at("Add it all up"),
  problem: at("getting the power into the furnace"),
  hardwired: at("comes in hardwired"),
  wireFrom: at("There's a wire from your breaker panel"),
  noPlug: at("No plug, nothing"),
  genYard: at("you've got a generator running"),
  thatBox: at("into that box"),
  bothPlug: at("Five, maybe eight"),
  changes: at("Here's what changes"),
  outletBox: at("you put an outlet in a box"),
  cordPlug: at("furnace gets a short cord"),
  normalDay: at("On a normal day"),
  powerOut: at("When the power goes out"),
  heavyCord: at("plug it into a heavy extension cord"),
  never: at("The house wiring never touches"),
  black: at("The black wire goes"),
  white: at("the white goes"),
  green: at("the green goes"),
  modern: at("Modern furnaces care"),
  transfer: at("It's called a furnace transfer switch"),
  normalOrGen: at("normal or generator"),
  costs: at("It costs more"),
  either: at("Either way"),
  twoWays: at("two ways to feed it"),
  neverBoth: at("never both be on at once"),
  dryer: at("into a dryer outlet"),
  backwards: at("send that power backwards"),
  backfeeding: at("That's called backfeeding"),
  transformer: at("The transformer on the pole"),
  thousands: at("thousands of volts"),
  neverEver: at("Never, ever do it"),
  co: at("Carbon monoxide doesn't smell"),
  sleep: at("to sleep for good"),
  outside: at("The generator goes outside"),
  twenty: at("20 feet from the house"),
  m3plug: at("They plug in the furnace"),
  m3ind: at("the inducer starts"),
  m3ign: at("the igniter glows"),
  m3light: at("the burners light", 400),
  m3out: at("three seconds later"),
  tinyCurrent: at("running a tiny current"),
  goodGround: at("doesn't have a good ground"),
  floating: at("the neutral is floating"),
  cantFeel: at("the board can't feel the flame"),
  shutsOff: at("it shuts the gas off"),
  byItself: at("runs by itself"),
  computer: at("Your furnace board is a little computer"),
  cleanPower: at("It wants clean power"),
  dropsV: at("A thin, long cord drops the voltage"),
  runHot: at("They run hot"),
  battMath: at("On a battery station, let's do"),
  threeHours: at("That's about three hours"),
  testIt: at("Test it"),
  flip: at("flip off that breaker", 520),
  pull: at("pull the plug", 520),
  runGen: at("run it on the generator", 520),
  staysLit: at("stays lit"),
  fiveParts: at("Five dollars of parts"),
  warmOne: at("and a warm one"),
};

// ---------------- POSICIONES (mundo) ----------------
// casa: x -9..4, sótano y -3..0, planta baja 0..3, alta 3..6, frente abierto en z=+3. Garaje x 4..9. Calle en z ≈ 14.
export const FUR: [number, number, number] = [-3.0, -3.0, -1.0];   // pie del gabinete del furnace
const F = (x: number, y: number, z: number): [number, number, number] => [FUR[0] + x, FUR[1] + y, FUR[2] + z];
export const PT = {
  furnace: F(0, 0.7, 0.4),
  board: F(0.14, 0.42, 0.36),
  inducer: F(0.13, 1.1, 0.2),
  pressure: F(-0.15, 1.12, 0.3),
  igniter: F(-0.22, 0.8, 0.22),
  valve: F(0.22, 0.79, 0.26),
  burners: F(0, 0.78, 0.12),
  sensor: F(0.2, 0.83, 0.12),
  blower: F(0, 0.28, 0.2),
  switchBox: F(0.43, 1.0, 0.18),
  outlet: F(0.72, 0.95, 0.3),
  transfer: F(-0.8, 1.15, -0.32),
  panel: [-7.0, -1.4, -2.75] as [number, number, number],
  gasMeter: [-9.15, 0.6, 0.6] as [number, number, number],
  generator: [-15.5, 0.45, 4.5] as [number, number, number],
  window: [-8.95, -0.5, 1.2] as [number, number, number],
  pole: [9.0, 6.4, 12.0] as [number, number, number],
  transformerP: [9.0, 6.6, 12.35] as [number, number, number],
  dryer: [-6.2, -2.45, -2.1] as [number, number, number],
  garageGen: [6.5, 0.45, 0.4] as [number, number, number],
  bedroom: [-1.5, 3.8, 0] as [number, number, number],
  register: [-2.0, 0.14, 1.2] as [number, number, number],
  battery: F(-0.85, 0.3, 0.6),
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number };
const fp = (x: number, y: number, z: number): [number, number, number] => F(x, y, z);
const E = EV;
export const KEYS: Key[] = [
  // Min1 · W1 · calle en la tormenta: el poste, los cables que caen, la ola de apagón, la casa
  { t: 6.0, p: [16, 9.5, 26], l: [8, 5.5, 12], fov: 38 },
  { t: E.linesDown + 0.4, p: [13.5, 8.2, 20], l: [8.5, 5.4, 12], fov: 36 },
  { t: E.dark + 0.5, p: [6, 10, 28], l: [-1, 2, 2], fov: 42, arc: 0.6 },
  { t: E.nineteen + 1.5, p: [-3, 4, 15], l: [-4, 0.5, 1], fov: 40 },
  { t: 13.6, p: [-6.5, 0.6, 8.5], l: [-5.5, -1.0, 0], fov: 38 },
  // W2 · sótano: el furnace en el haz de la linterna, el gas que llega hasta la válvula y se frena
  { t: 20.0, p: fp(1.2, 1.4, 3.4), l: fp(0, 0.75, 0), fov: 40 },
  { t: E.gasLine + 3.2, p: fp(2.2, 1.3, 2.6), l: fp(0.3, 0.9, 0), fov: 38 },
  { t: E.howCan + 0.3, p: fp(0.9, 1.0, 1.35), l: fp(0.2, 0.8, 0.2), fov: 36 },
  { t: E.thing + 1.4, p: fp(0.35, 0.6, 1.05), l: fp(0.14, 0.42, 0.36), fov: 32 },
  { t: 32.2, p: fp(0.25, 0.48, 0.75), l: fp(0.14, 0.42, 0.36), fov: 30 },
  // W3 · la tapa sale volando y entramos
  { t: E.open - 0.1, p: fp(0.2, 1.1, 3.8), l: fp(0, 0.7, 0), fov: 36 },
  { t: E.inside + 1.0, p: fp(0.6, 1.0, 1.9), l: fp(0, 0.7, 0.1), fov: 36 },
  { t: 78.2, p: fp(0.4, 0.9, 1.5), l: fp(0, 0.65, 0.1), fov: 36 },
  // W4 · inductor + humo por el caño
  { t: E.inducer - 0.2, p: fp(0.5, 1.25, 1.0), l: fp(0.13, 1.1, 0.2), fov: 34 },
  { t: E.pulls + 1.5, p: fp(0.35, 1.0, 0.9), l: fp(0.05, 0.9, 0.1), fov: 34 },
  { t: E.pulls + 3.6, p: fp(0.7, 1.9, 1.5), l: fp(0.13, 1.5, 0.15), fov: 38 },
  // W5 · presostato
  { t: E.pressure + 2.6, p: fp(-0.05, 1.2, 0.75), l: fp(-0.15, 1.12, 0.3), fov: 30 },
  { t: E.safety + 3.3, p: fp(-0.3, 1.1, 0.8), l: fp(-0.15, 1.1, 0.3), fov: 30 },
  // W6 · válvula, quemadores, sensor y ventilador → salimos a la casa con el aire caliente
  { t: E.valve - 0.3, p: fp(0.45, 0.85, 0.85), l: fp(0.2, 0.79, 0.25), fov: 32 },
  { t: E.burnersLight + 0.4, p: fp(0.0, 0.9, 0.95), l: fp(0, 0.78, 0.1), fov: 34 },
  { t: E.sensor + 1.3, p: fp(0.38, 0.86, 0.6), l: fp(0.2, 0.82, 0.12), fov: 30 },
  { t: E.blower + 0.4, p: fp(0.1, 0.45, 1.3), l: fp(0, 0.3, 0.2), fov: 36 },
  { t: E.everyRoom + 1.2, p: [2.5, 3.5, 15], l: [-2.5, 1.0, 0], fov: 40, arc: 0.6 },
  // W7 · cada pieza pide luz → se corta y todo se apaga
  { t: E.needs - 0.2, p: fp(0.9, 1.0, 2.2), l: fp(0, 0.7, 0.1), fov: 38 },
  { t: E.shut + 1.8, p: fp(0.55, 0.88, 0.95), l: fp(0.2, 0.79, 0.25), fov: 32 },
  // W8 · esperando
  { t: E.waiting - 0.4, p: fp(1.4, 1.2, 2.4), l: fp(0, 0.65, 0.1), fov: 38 },
  { t: E.waiting + 4.8, p: fp(-0.6, 1.1, 2.6), l: fp(0, 0.65, 0.1), fov: 38 },
  // W9 · placa e inductor chicos → plano entero
  { t: E.boardSmall - 0.4, p: fp(0.35, 0.65, 0.95), l: fp(0.14, 0.45, 0.33), fov: 32 },
  { t: E.addUp, p: fp(0.4, 1.2, 1.0), l: fp(0.13, 1.05, 0.2), fov: 34 },
  { t: E.addUp + 4.5, p: fp(1.6, 1.4, 3.2), l: fp(0, 0.7, 0), fov: 40 },
  // W10 · del patio (generador) a la pared, y al cable fijo del furnace
  { t: E.problem - 0.5, p: [-18.6, 1.7, 8.4], l: [-15.3, 0.4, 4.4], fov: 36 },
  { t: E.hardwired - 0.2, p: [-11.5, 1.2, 6.5], l: [-8.5, -0.5, 1.0], fov: 38, arc: 0.4 },
  { t: E.hardwired + 3.6, p: fp(1.4, 1.3, 1.5), l: fp(0.43, 1.05, 0.15), fov: 34 },
  { t: E.wireFrom + 4.6, p: fp(0.2, 1.7, 2.8), l: [-5.0, -1.2, -2.0], fov: 42 },
  // W11 · sin enchufe + generador en el patio con el cable colgando
  { t: E.noPlug - 0.2, p: fp(1.0, 1.15, 0.85), l: fp(0.43, 1.0, 0.18), fov: 30 },
  { t: E.genYard - 1.4, p: fp(0.9, 1.12, 0.95), l: fp(0.43, 1.0, 0.18), fov: 31 },
  { t: E.genYard - 0.3, p: [-17.4, 1.5, 7.4], l: [-15.3, 0.4, 4.4], fov: 34 },
  { t: E.thatBox + 1.5, p: [-16.5, 1.4, 8.5], l: [-12.0, 0.2, 3.5], fov: 38 },
  // W12 · tomacorriente y ficha en despiece flotando junto al furnace
  { t: E.bothPlug - 0.2, p: fp(1.3, 1.05, 1.25), l: fp(0.72, 0.95, 0.3), fov: 30 },
  { t: E.bothPlug + 4.0, p: fp(1.05, 1.0, 1.35), l: fp(0.72, 0.95, 0.3), fov: 30 },
  // W13 · antes / después + día normal (la corriente fluye del tablero al tomacorriente)
  { t: E.outletBox - 0.6, p: fp(1.5, 1.1, 1.4), l: fp(0.55, 0.95, 0.2), fov: 32 },
  { t: E.normalDay - 0.1, p: fp(1.8, 1.3, 1.9), l: fp(0.5, 0.95, 0.2), fov: 34 },
  { t: E.normalDay + 6.6, p: fp(0.4, 1.9, 3.4), l: [-5.0, -1.0, -1.6], fov: 44 },
  // W14 · generador → cable → ficha del furnace; el cableado de la casa NUNCA lo toca
  { t: E.heavyCord + 3.7, p: [-13, 1.5, 11], l: [-9, -0.8, 1.5], fov: 44 },
  { t: E.never - 0.3, p: [-5.5, -1.0, 7.5], l: [-4.8, -1.9, -0.8], fov: 46 },
  { t: E.never + 7.5, p: [-4.4, -1.2, 6.2], l: [-4.2, -1.9, -1.0], fov: 44 },
  // W15 · el tomacorriente de cerca con los tres cables
  { t: E.modern - 2.8, p: fp(0.95, 0.98, 0.75), l: fp(0.72, 0.95, 0.3), fov: 24 },
  { t: E.modern + 3.8, p: fp(0.75, 1.02, 0.85), l: fp(0.72, 0.95, 0.3), fov: 26 },
  // W16 · llave de transferencia
  { t: E.normalOrGen + 2.4, p: fp(-0.4, 1.3, 0.8), l: fp(-0.8, 1.15, -0.32), fov: 32 },
  { t: E.costs + 5.8, p: fp(-0.2, 1.25, 1.2), l: fp(-0.8, 1.15, -0.32), fov: 34 },
  // W17 · un furnace, dos maneras (traba)
  { t: E.twoWays - 0.3, p: [-4.2, -1.0, 7.0], l: [-5.0, -1.8, -0.5], fov: 48 },
  { t: E.neverBoth + 2.0, p: [-4.6, -1.1, 6.2], l: [-5.0, -1.8, -0.5], fov: 46 },
  // W18 · backfeed: secarropas → tablero → medidor → cable aéreo → poste
  { t: E.dryer + 1.0, p: [-4.0, -1.0, 3.0], l: [-6.2, -2.2, -2.0], fov: 40 },
  { t: E.backwards + 0.4, p: [-1, 3, 16], l: [-4, 0, -1], fov: 44, arc: 0.4 },
  { t: E.backfeeding + 2.2, p: [3, 7, 24], l: [5, 4, 8], fov: 46 },
  // W19 · el transformador con arcos
  { t: E.thousands - 0.6, p: [12.5, 7.6, 16], l: [9.0, 6.5, 12.3], fov: 34 },
  { t: E.neverEver + 3.2, p: [11.8, 7.2, 15.2], l: [9.0, 6.5, 12.3], fov: 32 },
  // W20 · monóxido del garaje a los dormitorios → el generador afuera, a 20 pies
  { t: E.co - 0.3, p: [8, 3.5, 13], l: [3, 1.5, 0], fov: 46 },
  { t: E.sleep + 1.6, p: [2, 6.0, 12], l: [0, 3.5, 0], fov: 44 },
  { t: E.outside + 0.6, p: [-12, 7.5, 18], l: [-12, 0.2, 3], fov: 44, arc: 0.6 },
  { t: E.twenty + 3.5, p: [-11.5, 6.5, 16.5], l: [-12, 0.2, 3], fov: 44 },
  // W21 · repetición rápida de la secuencia que falla
  { t: E.m3plug - 0.5, p: fp(0.7, 1.15, 1.3), l: fp(0, 0.85, 0.15), fov: 36 },
  { t: E.m3out + 1.5, p: fp(0.55, 1.05, 1.5), l: fp(0, 0.8, 0.12), fov: 34 },
  // W22 · el sensor de llama: corriente por la llama a tierra; el neutro flotando
  { t: E.tinyCurrent - 0.5, p: fp(0.6, 1.0, 1.05), l: fp(0.18, 0.8, 0.12), fov: 28 },
  { t: E.goodGround + 0.2, p: fp(0.55, 0.75, 0.8), l: fp(0.17, 0.62, 0.25), fov: 34 },
  { t: E.cantFeel + 1.2, p: fp(0.36, 0.62, 0.8), l: fp(0.15, 0.45, 0.33), fov: 30 },
  // W23 · generador solo, con el tapón de neutro
  { t: E.cantFeel + 7.8, p: fp(0.3, 0.6, 0.72), l: fp(0.15, 0.45, 0.33), fov: 30 },
  { t: E.byItself - 0.7, p: [-17.2, 1.3, 6.8], l: [-15.5, 0.5, 4.5], fov: 30 },
  { t: E.byItself + 4.0, p: [-16.6, 1.6, 7.6], l: [-15.5, 0.45, 4.5], fov: 32 },
  // W24 · la placa (computadora) de cerca
  { t: E.computer - 0.3, p: fp(0.24, 0.5, 0.62), l: fp(0.14, 0.42, 0.36), fov: 26 },
  { t: E.cleanPower + 1.5, p: fp(0.1, 0.48, 0.6), l: fp(0.14, 0.42, 0.36), fov: 26 },
  // W25 · cable fino: cae el voltaje, el motor se calienta
  { t: E.dropsV - 0.4, p: fp(1.4, 0.7, 2.2), l: fp(0.4, 0.4, 0.4), fov: 38 },
  { t: E.runHot + 2.8, p: fp(0.25, 0.42, 1.05), l: fp(0, 0.28, 0.2), fov: 34 },
  // W26 · batería al lado del furnace
  { t: E.threeHours - 4.5, p: fp(-0.1, 0.9, 1.9), l: fp(-0.85, 0.3, 0.6), fov: 34 },
  { t: E.threeHours + 3.0, p: fp(0.3, 1.0, 2.2), l: fp(-0.6, 0.4, 0.5), fov: 36 },
  // W27 · prueba: prende y queda prendido
  { t: E.staysLit - 3.4, p: fp(0.6, 1.0, 1.25), l: fp(0, 0.78, 0.12), fov: 34 },
  { t: E.staysLit + 2.4, p: fp(0.2, 0.92, 1.0), l: fp(0, 0.78, 0.12), fov: 32 },
  // W28 · la casa tibia en la tormenta
  { t: E.warmOne - 3.0, p: [-1, 2.5, 11], l: [-2.5, 1.0, 0], fov: 40 },
  { t: E.warmOne + 3.0, p: [3, 6, 22], l: [-2, 1.5, 0], fov: 42 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de cámara en mano (muy leve) para que el plano quieto no muera
  p.x += Math.sin(t * 0.7) * 0.012; p.y += Math.sin(t * 0.53 + 1) * 0.01;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- ESTADO DEL MUNDO POR SEGUNDO ----------------
// pasos de la secuencia de encendido (0..1 cada uno), con dos "corridas": la que explica y la que falla (error 3) y la prueba final
const seq = (t: number) => {
  // corrida 1 (explicación) — se queda prendida hasta que "Take away the power"
  const off1 = E.takeAway + 1.4;
  let ind = on(t, E.inducer + 0.6, off1), ps = on(t, E.pressure + 1.2, off1, 0.15), ign = on(t, E.igniter + 0.5, E.burnersLight + 1.2, 0.5);
  let gas = on(t, E.valve + 0.6, off1, 0.12), flame = on(t, E.burnersLight + 0.1, off1, 0.2), sens = on(t, E.sensor + 0.5, off1, 0.2);
  let blow = on(t, E.blower + 0.4, off1, 0.9);
  // error 3: arranca, prende y a los 3 s se apaga, una y otra vez
  if (t > E.m3plug - 1) {
    const a = E.m3ind, b = E.m3ign, c = E.m3light;
    ind = on(t, a, 1e9); ign = on(t, b, c + 0.8, 0.3); gas = 0; flame = 0;
    // ciclos: luz en c, se apaga en m3out; y repite cada 3 s hasta el fin de W21
    for (let k = 0; k < 4; k++) { const s0 = c + k * 2.6; const s1 = k === 0 ? E.m3out + 0.6 : s0 + 1.4; const f = on(t, s0, s1, 0.12); flame = Math.max(flame, f); gas = Math.max(gas, f); }
    ps = ind; sens = flame; blow = 0;
    // W22: corriente del sensor que se corta cuando el neutro flota
    if (t > E.tinyCurrent - 1) { ind = 1; ps = 1; flame = on(t, E.tinyCurrent - 1, E.shutsOff + 0.6, 0.2); gas = flame; sens = flame; ign = 0; }
  }
  // prueba final: prende y QUEDA prendido
  if (t > E.flip - 1) { ind = win(t, E.runGen, E.runGen + 0.4); ps = ind; ign = on(t, E.runGen + 0.6, E.staysLit - 1.0, 0.3); gas = win(t, E.staysLit - 1.2, E.staysLit - 1.0); flame = gas; sens = flame; blow = win(t, E.staysLit + 0.5, E.staysLit + 1.5); }
  // error 5: cable fino → el ventilador gira y su motor se pone rojo
  if (t > E.dropsV - 1 && t < E.runHot + 4) { blow = 1; ind = 0; flame = 0; gas = 0; sens = 0; ign = 0; ps = 0; }
  return { ind, ps, ign, gas, flame, sens, blow };
};

// ---------------- PIEZAS ----------------
type Tx = THREE.Texture | undefined;
type V3 = [number, number, number];
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} />
  </mesh>
);
// muro cortado con el canto claro (maqueta). Núcleo un poco más fino para que no haya z-fighting en el corte.
const Slab: React.FC<{ p: V3; s: V3; c: string; cut?: string; map?: Tx }> = ({ p, s, c, cut = "#e7e0d2", map }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={[s[0] - 0.006, s[1] - 0.006, s[2] - 0.006]} /><meshStandardMaterial color={c} roughness={0.92} map={map} /></mesh>
    <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>
  </group>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rot?: V3; m?: number; ro?: number; e?: string; ei?: number; seg?: number; r2?: number }> = ({ p, r, h, c, rot, m = 0.3, ro = 0.5, e, ei = 0, seg = 20, r2 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r2 ?? r, r, h, seg]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);

// flujo de puntos suaves a lo largo de una curva (gas / corriente / aire / humo / monóxido)
const Flow: React.FC<{ pts: V3[]; t: number; amt: number; col: string; n?: number; speed?: number; size?: number; spread?: number; map?: Tx; tube?: number; stopAt?: number; seed?: number; o?: number }> = ({ pts, t, amt, col, n = 60, speed = 0.35, size = 0.06, spread = 0.0, map, tube = 0, stopAt = 1, seed = 1, o = 1 }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.05), [JSON.stringify(pts)]);
  const tubeGeo = useMemo(() => (tube > 0 ? new THREE.TubeGeometry(curve, 160, tube, 8, false) : null), [curve, tube]);
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  if (amt <= 0.01) return null;
  if (tubeGeo) tubeGeo.setDrawRange(0, Math.floor((tubeGeo.index!.count * Math.min(1, stopAt)) / 6) * 6);
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let u = (rnd(i, seed) + t * speed) % 1;
    u = u * stopAt;
    const q = curve.getPointAt(u);
    arr.set([q.x + (rnd(i, seed + 2) - 0.5) * spread, q.y + (rnd(i, seed + 3) - 0.5) * spread, q.z + (rnd(i, seed + 4) - 0.5) * spread], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return (
    <group>
      {tubeGeo && <mesh geometry={tubeGeo}><meshBasicMaterial color={col} transparent opacity={0.22 * amt * o} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>}
      <points geometry={geo}><pointsMaterial color={col} size={size} map={map} transparent opacity={amt * o} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} sizeAttenuation alphaTest={0.01} /></points>
    </group>
  );
};

// cable (tubo) entre puntos
const Wire: React.FC<{ pts: V3[]; r?: number; c: string; e?: string; ei?: number; grow?: number }> = ({ pts, r = 0.012, c, e, ei = 0, grow = 1 }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.1), [JSON.stringify(pts)]);
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 120, r, 8, false), [curve, r]);
  if (grow <= 0.01) return null;
  geo.setDrawRange(0, Math.floor(geo.index!.count * Math.min(1, grow) / 6) * 6);
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={c} roughness={0.55} metalness={0.1} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};

// llama de un quemador (conos aditivos que titilan)
const Flame: React.FC<{ p: V3; amt: number; t: number; i: number }> = ({ p, amt, t, i }) => {
  if (amt <= 0.01) return null;
  const f = 1 + Math.sin(t * 31 + i * 2.1) * 0.08 + Math.sin(t * 17 + i) * 0.05;
  return (
    <group position={p} rotation={[-Math.PI / 2, 0, 0]} scale={[1, amt * f, 1]}>
      <mesh position={[0, -0.06, 0]}><coneGeometry args={[0.028, 0.12, 14, 1, true]} /><meshBasicMaterial color="#3d7bff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.05, 0]}><coneGeometry args={[0.016, 0.08, 12, 1, true]} /><meshBasicMaterial color="#bfe0ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.13, 0]}><coneGeometry args={[0.022, 0.08, 12, 1, true]} /><meshBasicMaterial color="#ff9a3c" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

// ventilador centrífugo (rueda de jaula de ardilla) que gira
const Wheel: React.FC<{ ang: number; hot: number }> = ({ ang, hot }) => (
  <group rotation={[0, 0, 0]}>
    {/* caracol */}
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><cylinderGeometry args={[0.2, 0.2, 0.34, 40, 1, true]} /><meshStandardMaterial color="#9ba2aa" metalness={0.55} roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <group rotation={[Math.PI / 2, ang, 0]}>
      {Array.from({ length: 28 }, (_, i) => (
        <mesh key={i} position={[Math.cos((i / 28) * 6.283) * 0.155, 0, Math.sin((i / 28) * 6.283) * 0.155]} rotation={[0, -(i / 28) * 6.283 + 0.4, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.006]} /><meshStandardMaterial color="#6f767e" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
    </group>
    {/* motor al centro (se pone rojo en el error 5) */}
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}><cylinderGeometry args={[0.08, 0.08, 0.2, 24]} /><meshStandardMaterial color="#3a3d42" metalness={0.5} roughness={0.4} emissive="#ff3a10" emissiveIntensity={hot * 2.2} /></mesh>
  </group>
);

// ---------------- EL FURNACE EN CORTE ----------------
const Furnace: React.FC<{ t: number; tx: ReturnType<typeof useTextures>; map?: Tx }> = ({ t, tx, map }) => {
  const S = seq(t);
  const mains = mainsOn(t);
  // ángulos acumulados (deterministas) del ventilador y del inductor
  const accum = (fn: (x: number) => number, rate: number) => { let a = 0; const N = Math.round(t * FPS); for (let k = Math.max(0, N - 900); k < N; k++) a += rate * fn(k / FPS); return a; };
  const wAng = accum((x) => seq(x).blow, 0.42), iAng = accum((x) => seq(x).ind, 0.8);
  const lid = win(t, E.open + 0.1, E.open + 1.4);      // la tapa frontal sale volando
  const hot = t > E.dropsV - 1 && t < E.runHot + 4 ? win(t, E.dropsV + 1.5, E.runHot) : 0;
  const ledOk = mains * (0.5 + 0.5 * Math.sign(Math.sin(t * 6)));
  const ledErr = t > E.cantFeel - 0.2 && t < E.cantFeel + 6 ? (Math.sin(t * 14) > 0 ? 1 : 0) : 0;
  const ignGlow = S.ign;
  const valveLock = t > E.shut - 0.2 && t < E.waiting + 5 ? 1 : 0;
  const m3 = t > E.m3plug - 2 && t < E.byItself - 2;
  const hard = !((t > E.bothPlug - 1 && t < E.dryer - 10) || m3 || t > E.flip - 1);     // cableado fijo vs ficha
  const plugIn = t > E.outletBox && t < E.powerOut + 2.2 ? win(t, E.cordPlug + 1, E.cordPlug + 2) : t > E.flip - 1 ? 1 - win(t, E.pull, E.pull + 0.4) : 0;
  const extIn = t > E.heavyCord && t < E.dryer - 10 ? win(t, E.heavyCord + 0.5, E.heavyCord + 1.6) : m3 ? win(t, E.m3plug - 0.4, E.m3plug + 0.4) : t > E.flip - 1 ? win(t, E.pull + 0.4, E.pull + 1.2) : 0;
  return (
    <group position={FUR}>
      {/* gabinete: laterales, fondo, techo, división; frente abierto (tapas que vuelan) */}
      <Box p={[-0.3, 0.66, 0]} s={[0.02, 1.32, 0.76]} c="#b9bec4" r={0.45} m={0.4} map={map} />
      <Box p={[0.3, 0.66, 0]} s={[0.02, 1.32, 0.76]} c="#b9bec4" r={0.45} m={0.4} map={map} />
      <Box p={[0, 0.66, -0.37]} s={[0.6, 1.32, 0.02]} c="#a7adb3" r={0.5} m={0.35} />
      <Box p={[0, 1.32, 0]} s={[0.62, 0.02, 0.78]} c="#b9bec4" r={0.45} m={0.4} />
      <Box p={[0, 0.6, 0]} s={[0.58, 0.02, 0.74]} c="#8e949b" r={0.5} m={0.4} />
      <Box p={[0, 0.02, 0]} s={[0.62, 0.04, 0.78]} c="#4b4f55" r={0.6} />
      {/* tapas frontales: arriba y abajo, salen girando hacia la cámara y caen */}
      {[0, 1].map((k) => {
        const l = win(t, E.open + 0.1 + k * 0.18, E.open + 1.3 + k * 0.18);
        if (l > 0.98) return null;
        // rayos X: con "Here's the thing" la tapa se vuelve vidrio azul y se ve la placa muerta adentro
        const xr = on(t, E.howCan + 0.8, 32.5, 0.5);
        const o = (1 - win(l, 0.75, 0.98)) * (1 - 0.82 * xr);
        const hh = k ? 0.7 : 0.58, yy = l * -1.2;
        return (
          <group key={k} position={[0, k ? 0.96 : 0.3, 0.385 + l * 1.6]} rotation={[l * -1.3, l * (k ? 0.6 : -0.5), l * (k ? 0.3 : -0.2)]}>
            <Box p={[0, yy, 0]} s={[0.6, hh, 0.015]} c={xr > 0.05 ? "#9fd0ff" : "#c3c8ce"} r={0.35} m={0.5} o={o} e="#3a8fff" ei={0.35 * xr} cast={xr < 0.5} />
            {xr > 0.02 && <mesh position={[0, yy, 0.009]}><planeGeometry args={[0.6, hh]} /><meshBasicMaterial color="#6fb6ff" wireframe transparent opacity={0.5 * xr} toneMapped={false} /></mesh>}
            {/* rejillas (louvers) de la tapa de abajo */}
            {k === 0 && Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0, yy + 0.2 - i * 0.022, 0.01]} s={[0.36, 0.008, 0.006]} c="#2a2c30" o={o} rad={0.002} />)}
            {/* visor de la llama + manija + calco amarillo sin texto en la de arriba */}
            {k === 1 && <>
              <Box p={[0.12, yy - 0.05, 0.012]} s={[0.12, 0.05, 0.004]} c="#2a2c30" o={o} />
              <Box p={[-0.17, yy + 0.24, 0.011]} s={[0.12, 0.08, 0.003]} c="#e9c43a" o={o} rad={0.003} />
              <Box p={[0, yy - 0.3, 0.016]} s={[0.16, 0.018, 0.02]} c="#55585e" o={o} m={0.6} rad={0.006} />
            </>}
            {k === 0 && <Box p={[0, yy + 0.25, 0.016]} s={[0.16, 0.018, 0.02]} c="#55585e" o={o} m={0.6} rad={0.006} />}
          </group>
        );
      })}
      {lid < 0.02 && <group />}
      {/* ventilador + motor (compartimento de abajo) */}
      <group position={[0, 0.3, 0.02]}><Wheel ang={wAng} hot={hot} /></group>
      {/* placa de control: verde, con LED */}
      <group position={[0.14, 0.42, 0.33]}>
        <Box p={[0, 0, 0]} s={[0.17, 0.12, 0.008]} c="#1f6b3a" r={0.4} m={0.1} />
        {Array.from({ length: 8 }, (_, i) => <Box key={i} p={[-0.06 + (i % 4) * 0.035, -0.03 + Math.floor(i / 4) * 0.035, 0.007]} s={[0.022, 0.014, 0.008]} c={i % 3 ? "#1b1d20" : "#c9b37a"} rad={0.002} />)}
        <Box p={[0.055, 0.04, 0.008]} s={[0.03, 0.02, 0.012]} c="#e9e9e9" rad={0.003} />
        <mesh position={[-0.065, 0.045, 0.012]}><sphereGeometry args={[0.007, 10, 8]} /><meshBasicMaterial color={ledErr ? "#ff2a1a" : "#3dff7a"} toneMapped={false} transparent opacity={0.15 + 0.85 * (ledErr || ledOk)} /></mesh>
        {(ledErr || ledOk) > 0.5 && <pointLight position={[-0.065, 0.045, 0.05]} intensity={0.12} distance={0.4} color={ledErr ? "#ff2a1a" : "#3dff7a"} />}
        {/* transformador de 24 V */}
        <Box p={[-0.13, 0, 0.02]} s={[0.06, 0.06, 0.05]} c="#3b3f45" m={0.4} />
      </group>
      {/* intercambiador de calor (atrás, arriba) */}
      {[-0.18, -0.06, 0.06, 0.18].map((x, i) => <Box key={i} p={[x, 0.95, -0.17]} s={[0.1, 0.5, 0.32]} c="#5d6268" r={0.55} m={0.5} e="#ff5a1a" ei={0.12 * S.flame} rad={0.04} />)}
      {/* quemadores en fila + múltiple de gas + válvula */}
      {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
        <group key={i}>
          <Cyl p={[x, 0.78, 0.1]} r={0.022} h={0.2} c="#8a8f95" rot={[Math.PI / 2, 0, 0]} m={0.7} ro={0.3} />
          <Flame p={[x, 0.78, -0.02]} amt={S.flame * win(t, E.burnersLight + i * 0.12, E.burnersLight + i * 0.12 + 0.15 + (t > E.m3plug ? -0.1 : 0)) + (t > E.m3plug ? S.flame : 0) * 0} t={t} i={i} />
        </group>
      ))}
      <Cyl p={[0, 0.78, 0.24]} r={0.016} h={0.42} c="#9a9ea4" rot={[0, 0, Math.PI / 2]} m={0.7} ro={0.3} />
      <group position={[0.22, 0.79, 0.26]}>
        <Box p={[0, 0, 0]} s={[0.09, 0.09, 0.08]} c="#3c4046" r={0.35} m={0.6} />
        <Box p={[0, 0.06, 0]} s={[0.05, 0.03, 0.05]} c="#7c2a22" r={0.4} />
        {/* traba roja cuando no hay corriente */}
        {valveLock > 0 && <mesh position={[0, 0, 0.06]}><torusGeometry args={[0.065, 0.007, 8, 40]} /><meshBasicMaterial color="#ff3a2a" toneMapped={false} transparent opacity={0.9} /></mesh>}
      </group>
      <Cyl p={[0.35, 0.79, 0.26]} r={0.016} h={0.18} c="#c9a04a" rot={[0, 0, Math.PI / 2]} m={0.8} ro={0.3} />
      {/* encendedor de superficie caliente (se pone naranja) */}
      <group position={[-0.22, 0.8, 0.13]}>
        <Box p={[0, 0, 0]} s={[0.03, 0.012, 0.06]} c="#585550" e="#ff7a1a" ei={1.3 * ignGlow} r={0.6} rad={0.004} />
        {ignGlow > 0.05 && <pointLight intensity={ignGlow * 0.25} distance={0.4} color="#ff8a3a" />}
      </group>
      {/* sensor de llama (varilla) */}
      <group position={[0.2, 0.82, 0.08]}>
        <Cyl p={[0, 0, 0]} r={0.004} h={0.12} c="#d0d4d8" rot={[Math.PI / 2.4, 0, 0]} m={0.9} ro={0.2} e="#5ab8ff" ei={2.5 * S.sens * (t > E.goodGround && t < E.shutsOff + 1 ? 1 - win(t, E.floating, E.floating + 0.6) : 1)} />
      </group>
      {S.flame > 0.05 && <pointLight position={[0, 0.82, 0.05]} intensity={S.flame * 0.35} distance={1.0} color="#7ab0ff" />}
      {/* inductor (motorcito con su rueda) + caño de escape que sube */}
      <group position={[0.13, 1.1, 0.2]}>
        <Cyl p={[0, 0, 0]} r={0.08} h={0.06} c="#2f3236" rot={[Math.PI / 2, 0, 0]} m={0.3} ro={0.5} />
        <group rotation={[Math.PI / 2, iAng, 0]} position={[0, 0, 0.035]}>
          {Array.from({ length: 8 }, (_, i) => <mesh key={i} rotation={[0, (i / 8) * 6.283, 0]} position={[Math.cos((i / 8) * 6.283) * 0.04, 0, -Math.sin((i / 8) * 6.283) * 0.04]}><boxGeometry args={[0.05, 0.004, 0.012]} /><meshStandardMaterial color="#d0d4d8" metalness={0.6} roughness={0.3} /></mesh>)}
        </group>
        <Cyl p={[0, 0, -0.06]} r={0.05} h={0.08} c="#4a4e54" rot={[Math.PI / 2, 0, 0]} m={0.4} />
      </group>
      <Cyl p={[0.13, 1.6, 0.12]} r={0.05} h={1.0} c="#1d1f22" m={0.4} ro={0.4} />
      {/* presostato con su manguerita */}
      <group position={[-0.15, 1.12, 0.3]}>
        <Cyl p={[0, 0, 0]} r={0.035} h={0.025} c="#d9dcdf" rot={[Math.PI / 2, 0, 0]} ro={0.4} />
        <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.012, 16]} /><meshBasicMaterial color={S.ps > 0.5 ? "#3dff7a" : "#555"} toneMapped={false} /></mesh>
      </group>
      <Wire pts={[[-0.15, 1.12, 0.29], [-0.05, 1.18, 0.26], [0.06, 1.13, 0.23]]} r={0.005} c="#e8e2d0" />
      {/* plenum de impulsión arriba */}
      <Box p={[0, 1.6, 0]} s={[0.6, 0.55, 0.74]} c="#c6ccd2" r={0.35} m={0.55} map={map} />
      {/* caja del interruptor de servicio + caño que sube al techo */}
      <group position={[0.43, 1.0, 0.18]}>
        <Box p={[0, 0, 0]} s={[0.12, 0.16, 0.06]} c="#9aa0a6" r={0.4} m={0.5} />
        <Box p={[0, 0, 0.032]} s={[0.07, 0.11, 0.006]} c="#f1efe9" r={0.4} />
        <Box p={[0, mains > 0.5 ? 0.012 : -0.012, 0.04]} s={[0.018, 0.03, 0.02]} c="#f7f5ef" r={0.3} rad={0.004} />
      </group>
      <Cyl p={[0.43, 1.86, 0.18]} r={0.012} h={1.6} c="#b9bdc2" m={0.8} ro={0.25} />
      {/* fijo: el cable baja de la caja y entra directo al gabinete */}
      {hard && <Wire pts={[[0.43, 0.92, 0.18], [0.4, 0.8, 0.2], [0.31, 0.72, 0.2]]} r={0.009} c="#1b1b1b" e="#ffb84a" ei={1.6 * mains * powerGlow(t)} />}
      {/* tomacorriente en su caja sobre una tabla al lado del furnace + ficha con cable corto */}
      {!hard && (
        <group>
          <Box p={[0.78, 0.95, 0.24]} s={[0.3, 0.4, 0.025]} c="#b38b5d" r={0.8} />
          <group position={[0.72, 0.95, 0.27]} scale={0.4 + 0.6 * win(t, E.bothPlug - 1, E.bothPlug - 0.4)}>
            <Box p={[0, 0, 0]} s={[0.075, 0.12, 0.04]} c="#8e959c" m={0.5} r={0.4} />
            <Box p={[0, 0, 0.022]} s={[0.06, 0.1, 0.006]} c="#f4f2ec" r={0.35} rad={0.004} />
            {[0.024, -0.024].map((y) => <group key={y}>
              <Box p={[-0.009, y + 0.003, 0.026]} s={[0.003, 0.012, 0.002]} c="#1a1a1a" rad={0.0005} />
              <Box p={[0.009, y + 0.003, 0.026]} s={[0.003, 0.015, 0.002]} c="#1a1a1a" rad={0.0005} />
              <mesh position={[0, y - 0.01, 0.026]}><circleGeometry args={[0.003, 10]} /><meshBasicMaterial color="#1a1a1a" /></mesh>
            </group>)}
          </group>
          <Wire pts={[[0.31, 0.72, 0.2], [0.45, 0.6, 0.35], [0.62, 0.68, 0.38], [0.72, plugIn > 0.5 ? 0.97 : 0.8, 0.3 + 0.06 * (1 - plugIn)]]} r={0.007} c="#1b1b1b" e="#ffb84a" ei={1.6 * mains * powerGlow(t) * plugIn + 1.6 * extIn * genOn(t)} />
          {/* ficha */}
          <Box p={[0.72, plugIn > 0.5 ? 0.97 : extIn > 0.5 ? 0.62 : 0.8, 0.3 + 0.03 + 0.05 * (1 - Math.max(plugIn, extIn))]} s={[0.035, 0.035, 0.028]} c="#202124" r={0.5} rad={0.006} />
          {/* alargue amarillo 12 AWG que viene del patio */}
          {extIn > 0.01 && <Wire pts={[[0.72, 0.6, 0.36], [0.7, 0.05, 0.6], [-1.5, 0.02, 1.4], [-4.5, 0.02, 2.0], [-5.9, 1.6, 2.2]]} r={0.012} c="#e3b51c" grow={extIn} e="#ffb84a" ei={0.6 * genOn(t)} />}
        </group>
      )}
      {/* llave de transferencia (caja gris con palanca) en la pared de atrás */}
      {t > E.transfer - 1 && t < E.dryer - 3 && (
        <group position={[-0.8, 1.15, -0.32]} scale={win(t, E.transfer - 0.5, E.transfer + 0.3)}>
          <Box p={[0, 0, 0]} s={[0.24, 0.3, 0.1]} c="#7c838b" m={0.5} r={0.35} />
          <Box p={[0, 0.0, 0.052]} s={[0.16, 0.2, 0.006]} c="#2a2d31" r={0.4} />
          <group position={[0, 0, 0.06]} rotation={[0, 0, (t < E.normalOrGen + 1.3 ? 1 : -1) * 0.6 * (1 - 2 * win(t, E.normalOrGen + 1.0, E.normalOrGen + 1.3)) * -1]}>
            <Box p={[0, 0.045, 0.02]} s={[0.028, 0.09, 0.028]} c="#d9d3c7" rad={0.008} />
          </group>
          <Wire pts={[[0, -0.15, 0], [0.05, -0.4, 0.05], [0.3, -1.1, 0.4]]} r={0.01} c="#e3b51c" />
        </group>
      )}
      {/* batería portátil gris al lado (sólo cuando se habla de ella) */}
      {(t > E.battMath - 1 && t < E.testIt) && (
        <group position={[-0.85, 0.22, 0.6]}>
          <Box p={[0, 0, 0]} s={[0.42, 0.34, 0.28]} c="#5c6066" r={0.5} m={0.2} rad={0.03} />
          <Box p={[0, 0.03, 0.142]} s={[0.3, 0.12, 0.004]} c="#0d0f12" rad={0.004} />
          <Box p={[-0.13 + 0.13 * battLeft(t), 0.03, 0.146]} s={[0.26 * battLeft(t), 0.07, 0.003]} c="#5ee38f" e="#5ee38f" ei={1.5} rad={0.002} />
        </group>
      )}
      {/* sombra de contacto al piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.05]}><planeGeometry args={[1.1, 1.2]} /><meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} /></mesh>
      {void tx}
    </group>
  );
};

// corriente de la red: prendida al principio de la noche, se corta con los cables; vuelve en el "día normal" y se va de nuevo
export const mainsOn = (t: number) => {
  if (t < EV.linesDown + 0.4) return 1;
  if (t < EV.open - 2) return 0;
  if (t < EV.takeAway + 1.2) return 1;                 // explicación de la secuencia: con corriente
  if (t < EV.boardSmall - 1) return 0;
  if (t > EV.normalDay - 0.5 && t < EV.powerOut + 0.6) return 1;
  if (t > EV.computer - 1 && t < EV.dropsV - 1) return 1;
  return 0;
};
const powerGlow = (t: number) => (t > EV.wireFrom - 0.3 && t < EV.wireFrom + 7) || (t > EV.normalDay - 0.5 && t < EV.powerOut + 0.6) ? 1 : 0.15;
export const genOn = (t: number) => (t > EV.genYard - 0.5 && t < EV.thatBox + 4) || (t > EV.heavyCord - 1 && t < EV.dryer + 14) || (t > EV.outside - 1 && t < EV.twenty + 5) || (t > EV.byItself - 1.5 && t < EV.byItself + 5) || (t > EV.runGen - 0.5) ? 1 : 0;
const battLeft = (t: number) => 1 - 0.85 * win(t, EV.battMath + 2, EV.threeHours + 3);

// generador inverter rojo (patio) con caño de escape y vapor
const Generator: React.FC<{ p: V3; t: number; on: number; rot?: number; bond?: number; flakeMap?: Tx }> = ({ p, t, on: o, rot = 0, bond = 0, flakeMap }) => {
  const sh = o * Math.sin(t * 70) * 0.004;
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <group position={[sh, 0, 0]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.6, 0.45]} c="#c4271c" r={0.45} m={0.1} rad={0.08} />
        <Box p={[0, 0.33, 0]} s={[0.62, 0.06, 0.12]} c="#202124" r={0.6} rad={0.03} />
        <Box p={[0.12, 0.02, 0.228]} s={[0.4, 0.3, 0.01]} c="#2b2d31" r={0.5} rad={0.01} />
        {[0.0, 0.16].map((x) => <Box key={x} p={[x, -0.02, 0.235]} s={[0.07, 0.09, 0.008]} c="#e8e5dc" rad={0.006} />)}
        {bond > 0.01 && <Box p={[0.16, -0.02, 0.235 + 0.04 * (1 - bond)]} s={[0.06, 0.06, 0.05]} c="#7d8288" rad={0.01} />}
        <mesh position={[-0.2, 0.06, 0.232]}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color={o > 0.5 ? "#3dff7a" : "#333"} toneMapped={false} /></mesh>
        <Box p={[-0.47, 0.05, 0]} s={[0.04, 0.12, 0.12]} c="#55585e" m={0.6} />
      </group>
      <Flow pts={[[-0.5, 0.05, 0], [-0.8, 0.3, 0.05], [-1.3, 0.8, 0.0], [-1.8, 1.4, -0.2]]} t={t} amt={o * 0.6} col="#c9ced6" n={40} speed={0.4} size={0.35} spread={0.25} map={flakeMap} o={0.35} />
    </group>
  );
};

// tormenta de hielo: lluvia helada (trazos cortos) en el aire
const Sleet: React.FC<{ t: number; c: THREE.Vector3; map?: Tx; amt: number }> = ({ t, c, map, amt }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  if (amt < 0.01) return null;
  const n = 2600, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const Y = 22;
    const x = c.x + (rnd(i, 1) - 0.5) * 50 + Math.sin(t * 0.4 + i) * 0.2;
    const y = Y - ((rnd(i, 2) * Y + t * (3.2 + rnd(i, 3) * 1.6)) % Y) - 1;
    const z = c.z - 10 + (rnd(i, 4) - 0.5) * 40;
    p.set([x, y, z], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color="#dfeaff" size={0.07} map={map} alphaTest={0.02} sizeAttenuation transparent opacity={0.7 * amt} depthWrite={false} /></points>;
};

const Neighbor: React.FC<{ x: number; z: number; lit: number; tint: string; i: number; siding?: Tx; flip?: boolean }> = ({ x, z, lit, tint, i, siding, flip }) => {
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-4.6, 0); s.lineTo(0, 2.4); s.lineTo(4.6, 0); s.lineTo(-4.6, 0); return new THREE.ExtrudeGeometry(s, { depth: 6.4, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 }); }, []);
  const warm = new THREE.Color("#ffb85c");
  return (
    <group position={[x, 0, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <Box p={[0, 2.4, 0]} s={[8, 4.8, 5.6]} c={tint} r={0.92} map={siding} rad={0.04} />
      <mesh geometry={roof} position={[0, 4.8, -3.2]} castShadow receiveShadow><meshStandardMaterial color="#2c2f36" roughness={0.6} metalness={0.2} /></mesh>
      {[[-2.3, 1.5], [2.3, 1.5], [-2.3, 3.6], [2.3, 3.6]].map(([wx, wy], k) => (
        <group key={k} position={[wx, wy, 2.81]}>
          <mesh><planeGeometry args={[1.2, 1.0]} /><meshStandardMaterial color="#10151d" emissive={warm} emissiveIntensity={lit * (0.55 + rnd(i * 7 + k, 3) * 0.45) * 2.6} roughness={0.15} metalness={0.4} /></mesh>
          {[[0, 0.53, 1.36, 0.1], [0, -0.53, 1.42, 0.12], [-0.63, 0, 0.1, 1.15], [0.63, 0, 0.1, 1.15]].map(([fx, fy, w, h], q) => (
            <mesh key={q} position={[fx, fy, 0.03]}><boxGeometry args={[w, h, 0.06]} /><meshStandardMaterial color="#f2efe8" roughness={0.6} /></mesh>
          ))}
        </group>
      ))}
      <Box p={[0, 1.1, 2.84]} s={[1.0, 2.2, 0.08]} c="#5a2f24" r={0.6} />
    </group>
  );
};

// árbol pelado con hielo (Georgia en invierno)
const Tree: React.FC<{ p: V3; s?: number; i: number }> = ({ p, s = 1, i }) => (
  <group position={p} scale={s}>
    <Cyl p={[0, 1.4, 0]} r={0.16} r2={0.09} h={2.8} c="#3b2e24" m={0} ro={0.9} />
    {Array.from({ length: 6 }, (_, k) => {
      const a = (k / 6) * 6.283 + rnd(i, k) * 0.6, h = 1.8 + k * 0.3;
      return <Cyl key={k} p={[Math.cos(a) * 0.45, h + 0.35, Math.sin(a) * 0.45]} r={0.05} r2={0.02} h={1.3} c="#4a3c30" m={0.2} ro={0.4} rot={[Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7]} />;
    })}
  </group>
);

// arco eléctrico (zigzag que cambia por cuadro)
const Arc: React.FC<{ a: V3; b: V3; t: number; amt: number; seed?: number; col?: string }> = ({ a, b, t, amt, seed = 1, col = "#bfe3ff" }) => {
  if (amt < 0.02) return null;
  const f = Math.floor(t * 30);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10, q = new THREE.Vector3(...a).lerp(new THREE.Vector3(...b), u);
    if (i > 0 && i < 10) q.add(new THREE.Vector3(rnd(f + i, seed) - 0.5, rnd(f + i, seed + 1) - 0.5, rnd(f + i, seed + 2) - 0.5).multiplyScalar(0.35));
    pts.push(q);
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  return (
    <group>
      <line>{/* @ts-expect-error three line */}<primitive object={geo} attach="geometry" /><lineBasicMaterial color={col} transparent opacity={amt} toneMapped={false} /></line>
      <pointLight position={new THREE.Vector3(...a).lerp(new THREE.Vector3(...b), 0.5)} intensity={amt * 5} distance={5} color={col} />
    </group>
  );
};

// ---------------- LA ESCENA ----------------
export const FurnaceWorld: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const k = camAt(t);
  const mains = mainsOn(t);
  const S = seq(t);
  const night = 1;    // toda la historia pasa en la tormenta de noche, salvo la prueba de octubre
  const autumn = t > EV.testIt - 1 && t < EV.fiveParts ? 1 : 0;
  const day = autumn;
  // casas vecinas: luces prendidas sólo antes del corte
  const wave = (d: number) => (t < EV.linesDown + 0.3 ? 1 : 1 - win(t, EV.linesDown + 0.4 + d * 0.12, EV.linesDown + 0.7 + d * 0.12)) * (t > EV.normalDay - 0.5 && t < EV.powerOut + 0.6 ? 1 : t > EV.open - 2 ? 0 : 1);
  const houseLit = mains;
  const flashlight = (t > 13 && t < 34) || (t > EV.takeAway + 1.4 && t < EV.boardSmall) ? 1 : 0;
  // cable que cae (W1)
  const fall = win(t, EV.linesDown + 0.1, EV.linesDown + 0.9);
  const sparks = on(t, EV.linesDown + 0.5, EV.linesDown + 1.6, 0.1);
  // flujos
  const gasFlow = (t > EV.gasLine - 0.5 && t < 32.5) ? 1 : 0;
  const gasToBurner = S.gas;
  const air = S.blow * (t > EV.dropsV - 1 && t < EV.runHot + 4 ? 0.4 : 1);
  const backfeed = t > EV.dryer - 0.3 && t < EV.neverEver + 4 ? win(t, EV.dryer, EV.dryer + 1.2) : 0;
  const bfStreet = win(t, EV.backwards, EV.backwards + 1.6);
  const arcs = on(t, EV.thousands - 0.2, EV.neverEver + 3, 0.15);
  const coAmt = on(t, EV.co - 0.6, EV.outside + 1.2, 0.6);
  const genInGarage = t > EV.co - 3 && t < EV.outside + 0.4;
  const genYardPos: V3 = genInGarage ? PT.garageGen : PT.generator;
  const measure = on(t, EV.twenty - 0.4, EV.twenty + 4.5, 0.3);
  const bondPlug = t > EV.byItself - 1.5 && t < EV.byItself + 5 ? win(t, EV.byItself - 1.2, EV.byItself - 0.4) : 0;
  const wireGlow = (t > EV.wireFrom - 0.3 && t < EV.wireFrom + 7) ? win(t, EV.wireFrom, EV.wireFrom + 1.5) : 0;
  const normalFlow = t > EV.normalDay && t < EV.powerOut + 0.6 ? 1 : 0;
  const genFlow = (t > EV.heavyCord + 0.8 && t < EV.dryer - 10) ? 1 : 0;
  const twoWays = on(t, EV.twoWays - 0.3, EV.neverBoth + 4, 0.3);
  const alt = Math.sin((t - EV.twoWays) * 1.4) > 0 ? 1 : 0;
  const flameCur = t > EV.tinyCurrent - 0.3 && t < EV.shutsOff + 1 ? win(t, EV.tinyCurrent, EV.tinyCurrent + 0.6) * (1 - win(t, EV.floating, EV.floating + 0.5)) : 0;
  const skyN = new THREE.Color("#0a1120"), skyD = new THREE.Color("#c9b99a");
  const sky = skyN.clone().lerp(skyD, day);
  const warmHouse = on(t, EV.fiveParts - 0.5, 1e9, 1.2);
  const flake = tx.flake;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.4 + 0.2 * (1 - day)} threshold={0.9 + day * 0.6} exposure={0.95 + 0.25 * (1 - day)} env={0.16 + 0.2 * day} />
      <color attach="background" args={[sky.getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.016 - 0.008 * day]} />
      <hemisphereLight args={[new THREE.Color("#6f86b4").lerp(new THREE.Color("#fff0d8"), day).getHex(), new THREE.Color("#141820").lerp(new THREE.Color("#6a5a44"), day).getHex(), 0.5 + day * 1.1]} />
      <directionalLight position={[-12, 20, 16]} intensity={0.55 + day * 2.4} color={new THREE.Color("#9fb8f0").lerp(new THREE.Color("#ffe2b8"), day)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luz de relleno fría para que el corte se lea de noche */}
      <pointLight position={[-3, 1.5, 7]} intensity={8 * (1 - day)} distance={16} color="#8fb0e8" />
      <pointLight position={[-3, -1.2, 4]} intensity={4} distance={8} color="#a9c2ee" />
      {/* foco de la casa (bombitas) cuando hay red */}
      {houseLit > 0.05 && <>
        <pointLight position={[-4.5, -0.5, -0.5]} intensity={houseLit * 5} distance={6} color="#ffd9a0" castShadow />
        <pointLight position={[-2, 2.4, 0]} intensity={houseLit * 7} distance={8} color="#ffd29a" />
      </>}
      {/* linterna: haz de luz desde la cámara al furnace */}
      {flashlight > 0 && <spotLight position={[k.p.x - 0.3, k.p.y + 0.1, k.p.z]} target-position={[FUR[0], FUR[1] + 0.7, FUR[2]]} angle={0.32} penumbra={0.55} intensity={38} distance={9} color="#fff1d6" castShadow />}
      {/* casa tibia del final */}
      {warmHouse > 0.05 && <pointLight position={[-2, 1.6, 0.5]} intensity={warmHouse * 12} distance={9} color="#ffb86a" />}

      {/* ===== TERRENO ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[240, 240]} /><meshStandardMaterial color={new THREE.Color("#5a6470").lerp(new THREE.Color("#7a6a3a"), day)} roughness={0.35 + 0.5 * day} metalness={0.15 * (1 - day)} /></mesh>
      {/* corte de tierra alrededor del sótano */}
      <Box p={[-11.5, -1.63, 0]} s={[5, 3.2, 6.2]} c="#3a2c22" r={1} cast={false} />
      <Box p={[6.5, -1.63, 0]} s={[5, 3.2, 6.2]} c="#3a2c22" r={1} cast={false} />
      <Box p={[-2.5, -3.25, 0]} s={[13.4, 0.3, 6.2]} c="#56585b" r={1} cast={false} />
      {/* calle mojada con hielo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 14.5]} receiveShadow><planeGeometry args={[240, 6]} /><meshStandardMaterial color={new THREE.Color("#20242a").lerp(new THREE.Color("#4d4f53"), day)} roughness={0.18 + day * 0.6} metalness={0.4 * (1 - day)} /></mesh>
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-60 + i * 4.2, 0.02, 14.5]}><planeGeometry args={[1.6, 0.12]} /><meshBasicMaterial color="#c9b56a" transparent opacity={0.35} /></mesh>)}

      {/* ===== LA CASA (frente abierto en z=3) ===== */}
      <Slab p={[-2.5, 1.5, -3.1]} s={[13, 9.2, 0.2]} c="#cfc6b6" />
      <Slab p={[-9.05, 1.5, 0]} s={[0.2, 9.2, 6.2]} c="#cfc6b6" map={tx.siding} />
      <Slab p={[4.05, 3.0, 0]} s={[0.2, 6.2, 6.2]} c="#cfc6b6" />
      <Slab p={[4.05, -1.5, 0]} s={[0.2, 3.0, 6.2]} c="#cfc6b6" />
      <Slab p={[-2.5, 0, 0]} s={[13, 0.25, 6.2]} c="#7a5a3e" cut="#b9a585" />
      <Slab p={[-2.5, 3.0, 0]} s={[13, 0.25, 6.2]} c="#7a5a3e" cut="#b9a585" />
      <Slab p={[-2.5, 6.0, 0]} s={[13, 0.25, 6.2]} c="#cfc6b6" />
      <Slab p={[-3.5, 1.5, -1.5]} s={[0.14, 2.75, 3.0]} c="#d8d0c2" />
      <Slab p={[-3.5, 4.5, 0]} s={[0.14, 2.75, 6.0]} c="#d8d0c2" />
      {[-1, 1].map((sd) => (
        <group key={sd} position={[-2.5, 7.1, sd * 1.6]} rotation={[sd * -0.6, 0, 0]}>
          <Box p={[0, 0, 0]} s={[13.6, 0.22, 3.9]} c="#30333a" />
          <Box p={[0, 0.13, 0]} s={[13.6, 0.04, 3.9]} c="#cfe0f0" r={0.1} m={0.3} o={0.75} />
        </group>
      ))}
      {/* pisos y paredes con textura */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.3, 0.128, 0]} receiveShadow><planeGeometry args={[5.4, 6.0]} /><meshStandardMaterial map={tx.tile} roughness={0.35} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.128, 0]} receiveShadow><planeGeometry args={[7.4, 6.0]} /><meshStandardMaterial map={tx.planks} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 3.128, 0]} receiveShadow><planeGeometry args={[12.8, 6.0]} /><meshStandardMaterial map={tx.planks} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, -3.08, 0]} receiveShadow><planeGeometry args={[12.8, 6.0]} /><meshStandardMaterial map={tx.concrete} roughness={0.9} /></mesh>
      <mesh position={[-2.5, 1.5, -2.997]} receiveShadow><planeGeometry args={[12.8, 2.75]} /><meshStandardMaterial map={tx.paper} roughness={0.95} /></mesh>
      <mesh position={[-2.5, 4.5, -2.997]} receiveShadow><planeGeometry args={[12.8, 2.75]} /><meshStandardMaterial map={tx.paper} color="#cfd8e6" roughness={0.95} /></mesh>
      <mesh position={[-2.5, -1.55, -2.997]} receiveShadow><planeGeometry args={[12.8, 3.0]} /><meshStandardMaterial map={tx.block} roughness={0.95} /></mesh>
      {/* ventanitas del sótano + ventanas de la casa */}
      {[[-7.5, -0.5], [1.5, -0.5]].map(([x, y], i) => <mesh key={i} position={[x, y, -2.99]}><planeGeometry args={[1.0, 0.45]} /><meshBasicMaterial color="#5b7bb0" transparent opacity={0.5} toneMapped={false} /></mesh>)}
      {[[-6.5, 1.7], [0.5, 1.7], [-6.5, 4.6], [0.5, 4.6]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -2.99]}><planeGeometry args={[1.2, 1.0]} /><meshStandardMaterial color="#20304a" emissive={new THREE.Color("#ffc26e")} emissiveIntensity={houseLit * 1.2 + warmHouse * 1.4} roughness={0.2} /></mesh>
      ))}
      {/* living: sillón, alfombra, lámpara, tele, rejilla del piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.135, -0.3]} receiveShadow><planeGeometry args={[2.6, 1.9]} /><meshStandardMaterial map={tx.rug} roughness={1} /></mesh>
      <Box p={[0.3, 0.33, -2.1]} s={[2.4, 0.6, 0.9]} c="#4f5d6e" r={1} />
      <Box p={[0.3, 0.72, -2.5]} s={[2.4, 0.7, 0.24]} c="#4a5767" r={1} />
      <Box p={[2.9, 0.45, -1.2]} s={[0.9, 0.9, 0.9]} c="#6a4a32" />
      <Cyl p={[2.9, 1.12, -1.2]} r={0.17} r2={0.24} h={0.32} c="#efe3c8" e="#ffd28a" ei={houseLit * 1.6 + warmHouse * 2.5} />
      <Box p={[-2.0, 0.135, 1.2]} s={[0.5, 0.02, 0.18]} c="#3a3d42" m={0.6} r={0.4} />
      {/* cocina a la izquierda */}
      <Box p={[-7.4, 0.5, -2.5]} s={[3.0, 0.95, 0.75]} c="#8b6f55" />
      <Box p={[-7.4, 1.0, -2.5]} s={[3.04, 0.05, 0.78]} c="#d8d4cc" r={0.3} />
      <Box p={[-8.5, 1.0, -2.3]} s={[0.9, 1.9, 0.8]} c="#e9ebee" r={0.3} m={0.1} />
      {/* dormitorios arriba: cama con los chicos / la cama de Marcus */}
      <Box p={[-6.2, 3.45, -1.6]} s={[2.2, 0.5, 2.4]} c="#e4e0d8" r={1} />
      <Box p={[-6.2, 3.72, -1.3]} s={[2.24, 0.12, 1.7]} c="#4a5d78" r={1} />
      <Box p={[0.6, 3.45, -1.6]} s={[2.0, 0.5, 2.3]} c="#e4e0d8" r={1} />
      <Box p={[0.6, 3.72, -1.3]} s={[2.04, 0.12, 1.6]} c="#7a4a3a" r={1} />
      <Box p={[-1.7, 3.6, -2.85]} s={[0.24, 0.16, 0.06]} c="#f1efe9" rad={0.01} />
      {/* ===== SÓTANO ===== */}
      <Furnace t={t} tx={tx} map={undefined} />
      {/* conducto troncal en el techo del sótano + subidas a las rejillas (con aire caliente) */}
      <Box p={[-1.0, -0.5, -1.0]} s={[4.6, 0.38, 0.5]} c="#c6ccd2" r={0.35} m={0.55} />
      <Box p={[-3.0, -0.95, -1.0]} s={[0.6, 0.55, 0.5]} c="#c6ccd2" r={0.35} m={0.55} />
      <Cyl p={[-2.0, -0.25, 1.2]} r={0.1} h={0.5} c="#c6ccd2" m={0.55} ro={0.35} />
      <Box p={[-2.0, -0.5, 0.1]} s={[0.22, 0.2, 2.2]} c="#c6ccd2" r={0.35} m={0.55} />
      <Flow pts={[F(0, 0.3, 0.2), F(0, 1.4, 0), [-2.6, -0.5, -1.0], [-1.2, -0.5, -1.0], [-2.0, -0.5, 0.0], [-2.0, -0.4, 1.2], [-2.0, 0.6, 1.2], [-1.6, 1.6, 0.8], [-0.8, 2.2, 0.0]]} t={t} amt={air} col="#ffaa55" n={140} speed={0.22} size={0.14} spread={0.18} map={flake} o={0.7} />
      <Flow pts={[[-1.0, -0.5, -1.0], [1.2, -0.5, -1.0], [1.5, 0.3, -1.4], [1.5, 2.9, -2.3], [0.8, 3.5, -1.8], [0.0, 4.4, -0.8]]} t={t} amt={air} col="#ffaa55" n={90} speed={0.2} size={0.14} spread={0.18} map={flake} o={0.6} seed={7} />
      {/* humo del inductor por el caño */}
      <Flow pts={[F(0.13, 1.1, 0.2), F(0.13, 1.6, 0.12), F(0.13, 3.0, 0.12), F(0.13, 6.4, 0.1), F(0.13, 10.8, 0.1), F(0.5, 12.5, 0.3)]} t={t} amt={S.ind * (t < EV.takeAway + 2 || t > EV.m3plug - 1 ? 1 : 0)} col="#b8c0ca" n={70} speed={0.3} size={0.12} spread={0.06} map={flake} o={0.5} seed={3} />
      <Cyl p={[FUR[0] + 0.13, 4.6, FUR[2] + 0.1]} r={0.06} h={8.4} c="#2a2c30" m={0.4} ro={0.4} />
      {/* gas: desde el medidor afuera por el caño amarillo hasta la válvula (y de la válvula a los quemadores) */}
      <Wire pts={[PT.gasMeter, [-8.86, 0.6, 0.6], [-8.85, 0.55, 0.6], [-8.85, -0.5, 0.6], [-8.8, -0.55, 0.6], [-2.3, -0.55, 0.6], [-2.25, -0.6, 0.6], [-2.25, -0.6, -0.69], [-2.25, -0.65, -0.74], [-2.25, -2.16, -0.74], [-2.3, -2.21, -0.74], F(0.55, 0.79, 0.26), F(0.35, 0.79, 0.26)]} r={0.025} c="#d6b03a" m={0.0} />
      <Flow pts={[PT.gasMeter, [-8.86, 0.6, 0.6], [-8.85, 0.55, 0.6], [-8.85, -0.5, 0.6], [-8.8, -0.55, 0.6], [-2.3, -0.55, 0.6], [-2.25, -0.6, 0.6], [-2.25, -0.6, -0.69], [-2.25, -0.65, -0.74], [-2.25, -2.16, -0.74], [-2.3, -2.21, -0.74], F(0.55, 0.79, 0.26), F(0.27, 0.79, 0.26)]} t={t} amt={Math.max(gasFlow, (t > EV.valve - 1 && t < EV.takeAway + 2) || t > EV.m3plug - 1 ? (t > EV.m3plug - 1 ? 0.35 : 0.8) : 0)} col="#fff2a0" n={140} speed={0.12} size={0.16} map={flake} seed={11} tube={t < 33 ? 0.014 : 0} />
      <Flow pts={[F(0.2, 0.79, 0.26), F(0, 0.78, 0.24), F(-0.15, 0.78, 0.15)]} t={t} amt={gasToBurner} col="#ffe066" n={20} speed={0.8} size={0.03} map={flake} seed={12} />
      <Box p={[PT.gasMeter[0] - 0.12, PT.gasMeter[1], PT.gasMeter[2]]} s={[0.25, 0.35, 0.3]} c="#9aa0a6" m={0.6} r={0.35} />
      {/* tablero eléctrico del sótano + cable fijo al interruptor del furnace (brilla cuando se explica) */}
      <group position={PT.panel}>
        <Box p={[0, 0, 0]} s={[0.55, 0.8, 0.12]} c="#8e959c" m={0.5} r={0.35} />
        {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[-0.1 + (i % 2) * 0.2, 0.27 - Math.floor(i / 2) * 0.1, 0.065]} s={[0.14, 0.05, 0.02]} c="#202124" rad={0.005} />)}
      </group>
      <Wire pts={[[PT.panel[0] + 0.2, PT.panel[1] + 0.42, PT.panel[2] + 0.06], [PT.panel[0] + 0.2, -0.25, -2.6], [-4, -0.2, -1.5], F(0.43, 2.66, 0.18), F(0.43, 1.08, 0.18)]} r={0.014} c="#3a3a3a" e="#ffb84a" ei={2.2 * Math.max(wireGlow, normalFlow)} />
      <Flow pts={[[PT.panel[0] + 0.2, PT.panel[1] + 0.42, PT.panel[2] + 0.06], [PT.panel[0] + 0.2, -0.25, -2.6], [-4, -0.2, -1.5], F(0.43, 2.66, 0.18), F(0.43, 1.08, 0.18), F(0.4, 0.8, 0.2), F(0.31, 0.72, 0.2)]} t={t} amt={Math.max(wireGlow, normalFlow)} col="#ffcf6a" n={50} speed={0.45} size={0.06} map={flake} seed={21} />
      {/* generador → alargue → ficha (flujo) */}
      <Flow pts={[[PT.generator[0] + 0.3, PT.generator[1], PT.generator[2] + 0.25], [-12, 0.05, 3.5], [-9.4, -0.2, 1.4], [-8.95, -0.5, 1.2], [-6, -2.9, 1.8], F(-1.5, 0.05, 1.4), F(0.7, 0.05, 0.6), F(0.72, 0.6, 0.36)]} t={t} amt={genFlow} col="#7dffb0" n={70} speed={0.35} size={0.08} map={flake} seed={31} />
      {genFlow > 0 && <Wire pts={[[PT.generator[0] + 0.3, PT.generator[1], PT.generator[2] + 0.25], [-12, 0.05, 3.5], [-9.4, 0.0, 1.4], [-8.95, -0.5, 1.2], [-6, -2.95, 1.8]]} r={0.03} c="#e3b51c" />}
      {/* "nunca se tocan": barrera de luz entre el tablero y el alargue */}
      {on(t, EV.never, EV.never + 7.5, 0.3) > 0.02 && (
        <mesh position={[-5.3, -1.6, -0.6]} rotation={[0, 0.6, 0]}><planeGeometry args={[0.05, 2.6]} /><meshBasicMaterial color="#ff4a3d" transparent opacity={0.9 * on(t, EV.never, EV.never + 7.5, 0.3)} toneMapped={false} /></mesh>
      )}
      {/* W17: dos maneras de alimentar, alternando (nunca las dos) */}
      <Flow pts={[[PT.panel[0] + 0.2, PT.panel[1] + 0.42, PT.panel[2] + 0.06], [PT.panel[0] + 0.2, -0.25, -2.6], [-4, -0.2, -1.5], F(0.43, 2.66, 0.18), F(0.43, 1.08, 0.18)]} t={t} amt={twoWays * alt} col="#ffcf6a" n={50} speed={0.5} size={0.07} map={flake} seed={41} />
      <Flow pts={[[-8.95, -0.5, 1.2], [-6, -2.9, 1.8], F(-1.5, 0.05, 1.4), F(-0.8, 0.9, -0.3)]} t={t} amt={twoWays * (1 - alt)} col="#7dffb0" n={40} speed={0.5} size={0.07} map={flake} seed={42} />
      {/* secarropas (lavadero del sótano) y el backfeed hacia la calle */}
      <Box p={PT.dryer} s={[0.75, 0.95, 0.7]} c="#e8eaec" r={0.3} m={0.1} />
      <Box p={[PT.dryer[0], PT.dryer[1] + 0.2, PT.dryer[2] + 0.36]} s={[0.4, 0.4, 0.02]} c="#2b2e33" r={0.2} rad={0.18} />
      <Flow pts={[PT.generator, [-12, 0.05, 3.5], [-8.95, -0.5, 1.2], [-6.3, -1.8, -1.6], [PT.panel[0], PT.panel[1], PT.panel[2] + 0.1], [-8.9, 0.8, -2.6], [-9.2, 2.6, -2.5], [-9.4, 4.8, -2.4], [-2, 7.2, 6], [5, 7.3, 10.5], [9.0, 6.6, 12.35]]} t={t} amt={backfeed} col="#ff4a3d" n={260} speed={0.18} size={0.42} map={flake} seed={51} tube={0.09} stopAt={0.35 + 0.65 * bfStreet} />
      {/* ===== GARAJE (x 4..9) ===== */}
      <Slab p={[6.6, 1.6, -3.1]} s={[5.0, 3.2, 0.2]} c="#bdb6a8" />
      <Slab p={[9.05, 1.6, 0]} s={[0.2, 3.2, 6.2]} c="#bdb6a8" />
      <Slab p={[6.6, 0, 0]} s={[5.0, 0.2, 6.2]} c="#8d9095" cut="#a9acb0" />
      <Box p={[6.6, 3.3, 0]} s={[5.2, 0.25, 6.4]} c="#30333a" />
      <Box p={[6.6, 2.75, 2.95]} s={[4.4, 0.9 , 0.08]} c="#d9d6cf" r={0.6} />
      <Generator p={genYardPos} t={t} on={genOn(t) || genInGarage ? 1 : 0} rot={genInGarage ? 0.3 : 0.4} bond={bondPlug} flakeMap={flake} />
      {/* monóxido: nube gris-rojiza del garaje a los dormitorios */}
      <Flow pts={[PT.garageGen, [5.0, 1.2, 0.3], [3.7, 1.5, -0.5], [1.5, 1.8, -0.8], [-0.8, 2.6, -1.4], [-1.2, 3.8, -1.2], [0.4, 4.2, -1.2], [-4.0, 4.2, -1.0], [-6.2, 4.2, -1.0]]} t={t} amt={coAmt} col="#c98a7a" n={220} speed={0.08} size={0.55} spread={0.9} map={flake} o={0.45} seed={61} />
      {/* 20 pies: cinta de medir en el pasto entre la casa y el generador */}
      {measure > 0.02 && (
        <group>
          <Wire pts={[[-9.2, 0.06, 4.2], [-12.4, 0.06, 4.35], [-15.5, 0.06, 4.5]]} r={0.025} c="#ffd34a" e="#ffd34a" ei={1.2} grow={measure} />
          {[[-9.2, 0.25, 4.2], [-15.5, 0.25, 4.5]].map((p, i) => <Box key={i} p={p as V3} s={[0.05, 0.5, 0.05]} c="#ffd34a" e="#ffd34a" ei={1} />)}
        </group>
      )}
      {/* ===== POSTE, TRANSFORMADOR Y CABLES ===== */}
      <Cyl p={[9.0, 4.0, 12.0]} r={0.16} r2={0.13} h={8.0} c="#4a3a2c" m={0} ro={0.9} />
      <Box p={[9.0, 7.6, 12.0]} s={[2.4, 0.12, 0.12]} c="#4a3a2c" r={0.9} />
      <Cyl p={PT.transformerP} r={0.28} h={0.75} c="#7e868e" m={0.6} ro={0.35} />
      <Arc a={[9.0, 7.0, 12.35]} b={[8.0, 7.6, 12.0]} t={t} amt={arcs} seed={3} />
      <Arc a={[9.1, 7.0, 12.3]} b={[10.1, 7.55, 12.0]} t={t} amt={arcs} seed={9} />
      {/* cables de la calle (uno cae con el hielo) */}
      <Wire pts={[[-30, 7.6, 12.0], [-10, 7.0, 12.0], [7.8, 7.6, 12.0]]} r={0.025} c="#1a1a1a" />
      <Wire pts={[[10.2, 7.6, 12.0], [22, 6.8 - fall * 6.6, 12.2], [34, 7.6 - fall * 0.5, 12.0]]} r={0.025} c="#1a1a1a" />
      {/* cable de acometida a la casa */}
      <Wire pts={[[9.0, 6.4, 12.0], [2, 6.4, 7], [-9.3, 5.2, -2.4]]} r={0.02} c="#1a1a1a" />
      <Tree p={[24, 0, 9.0]} s={1.4} i={1} />
      <Tree p={[-20, 0, -6]} s={1.6} i={2} />
      <Tree p={[16, 0, -5]} s={1.5} i={3} />
      {sparks > 0.02 && <Arc a={[22, 1.2 + (1 - fall) * 5, 12.2]} b={[22.6, 0.05, 12.4]} t={t} amt={sparks} seed={17} col="#ffe2a8" />}
      {/* vecinos */}
      <Neighbor x={-24} z={0} lit={wave(1)} tint="#80766b" i={3} siding={tx.siding} />
      <Neighbor x={20} z={0} lit={wave(2)} tint="#7d7466" i={1} siding={tx.siding} />
      <Neighbor x={-8} z={28} flip lit={wave(3)} tint="#76808a" i={5} siding={tx.siding} />
      <Neighbor x={6} z={28} flip lit={wave(3)} tint="#857a6c" i={6} siding={tx.siding} />
      <Neighbor x={20} z={28} flip lit={wave(4)} tint="#6c747a" i={7} siding={tx.siding} />
      <Sleet t={t} c={k.p} map={flake} amt={1 - day} />
    </ThreeCanvas>
  );
};
