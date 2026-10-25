import type { Llave, Act, Ev, Cargo } from "./motor";
import type { Ropa } from "./persona";
import type { IcoK } from "./iconos";
import { SUELO } from "./mundo";

// Registro de datos de soot05: cada línea de d0..d4 empuja acá. El mezclador (cues_soot05.py) lee las MISMAS
// líneas: o(t, "chip"...) = pop, fee(...) = monedas, s(t, "pool", dB) = foley a mano, cam con viaje largo = whoosh.
export const K: Llave[] = [];
export const A: Act[] = [];
export const O: Ev[] = [];
export const W: Ev[] = [];
export const F: Cargo[] = [];
export const S: [number, string, number][] = [];
export const TT: number[] = []; // inicio de cada trampa (HUD)

export const cam = (t: number, x: number, y: number, z: number, d?: number) => { K.push([t, x, y, z, d]); };
export const act = (p: Act) => { A.push(p); };
export const o = (t: number, k: Ev["k"], p: Partial<Ev> = {}) => { O.push({ t, k, ...p }); };
export const w = (t: number, k: Ev["k"], p: Partial<Ev> = {}) => { W.push({ t, k, ...p }); };
export const wi = (t: number, ico: IcoK, x: number, y: number, p: Partial<Ev> = {}) => { W.push({ t, k: "ico", ico, x, y, ...p }); };
export const fee = (t: number, d: number, txt: string) => { F.push([t, d, txt]); };
export const s = (t: number, pool: string, g = 0) => { S.push([t, pool, g]); };
export const trampa = (t: number) => { TT.push(t); };

// pisos (y de los pies)
export const Y = {
  calle: SUELO + 22,
  baja: SUELO - 26, // planta baja de Newgate
  alta: SUELO - 686, // 1er piso
  sotano: SUELO + 634,
  pozo: SUELO + 1622,
  sala: SUELO - 46, // piso del tribunal
  estrado: SUELO - 556, // jueces arriba del estrado
  jurado: SUELO - 446,
  fleetB: SUELO - 46,
  fleetA: SUELO - 536,
  ludA: SUELO - 818,
  ludB: SUELO + 496,
  savoy: SUELO - 46,
  little: SUELO + 236,
  botella: SUELO + 1480,
};

// mismo preso que la miniatura: túnica beige rota, pelo rubio, gorro de cuero amarillo (motor.tsx capYO)
export const YO: Ropa = { tunica: "#b39a76", tunica2: "#8a7254", cinto: "#5a3418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#d9a83a" };
export const CARCELERO: Ropa = { tunica: "#4a2f7a", tunica2: "#2a1a4a", cinto: "#c98f4a", piel: "#e8a27a", piel2: "#c47a56", pelo: "#2a1a10" };
export const JUEZ: Ropa = { tunica: "#c81d2e", tunica2: "#7a0f1d", cinto: "#f4f0e8", piel: "#f0b890", piel2: "#d08a66", pelo: "#9c958f" };
export const REY: Ropa = { tunica: "#2b3a9f", tunica2: "#1a2470", cinto: "#f7c548", piel: "#f2c0a0", piel2: "#d89a7a", pelo: "#c9a050" };
export const PRESO = (i: number): Ropa => {
  const t = [["#8a7a6a", "#5a4a3a"], ["#7a8a9a", "#4a5a6a"], ["#9a7a5a", "#6a4a2a"], ["#6a6a8a", "#3a3a5a"], ["#8a6a7a", "#5a3a4a"]][i % 5];
  const p = [["#f2b48a", "#d98d66"], ["#c98b62", "#a2643f"], ["#8d5a3b", "#6a3f26"], ["#f5c7a0", "#dc9d78"]][i % 4];
  return { tunica: t[0], tunica2: t[1], cinto: "#3a2418", piel: p[0], piel2: p[1], pelo: ["#4a2a17", "#1d1410", "#7a4a22", "#2b1c14", "#a0602c"][(i * 3) % 5] };
};
