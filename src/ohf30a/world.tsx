// ohf30 · el MUNDO de la casa vieja (house3d) con cámaras con nombre. world.json = {cams: [[t, "nombre"]...], fx: [[t, {heat, gauge}]...]}
// anclado a frases; entre paradas la cámara viaja en curva (arco) — de la sala al sótano baja por el corte de la losa —, y dentro
// de cada parada deriva despacio (p0→p1), así nunca hay dos cuadros iguales. "book" = el manual abierto en la página del capítulo;
// "cover" = el manual cerrado sobre la mesita.
import React from "react";
import * as THREE from "three";
import { HouseWorld, Scene, BOOK } from "./house3d";
import WJ from "./world.json";

type V3 = [number, number, number];
type C = { p0: V3; p1: V3; l0: V3; l1: V3; f0: number; f1: number };
const BK: V3 = [BOOK[0], BOOK[1] + 0.02, BOOK[2]];
export const CAMS: Record<string, C> = {
  // la casa entera en corte: sala arriba, sótano abajo
  house: { p0: [3.0, -0.2, 6.0], p1: [2.3, -0.35, 5.2], l0: [-0.1, -0.95, -1.4], l1: [-0.2, -0.95, -1.5], f0: 44, f1: 42 },
  sala: { p0: [2.2, 1.55, 1.6], p1: [1.7, 1.4, 1.1], l0: [-0.3, 0.8, -2.2], l1: [-0.35, 0.8, -2.3], f0: 42, f1: 38 },
  sala2: { p0: [-1.6, 1.5, 1.4], p1: [-1.1, 1.35, 1.0], l0: [0.4, 0.7, -2.4], l1: [0.3, 0.7, -2.5], f0: 42, f1: 38 },
  radiator: { p0: [0.55, 0.95, -1.35], p1: [0.25, 0.8, -1.65], l0: [-0.2, 0.4, -2.74], l1: [-0.25, 0.38, -2.74], f0: 40, f1: 35 },
  valve: { p0: [-0.25, 0.42, -2.1], p1: [-0.45, 0.35, -2.2], l0: [-0.82, 0.18, -2.74], l1: [-0.82, 0.18, -2.74], f0: 36, f1: 32 },
  bleed: { p0: [0.75, 0.95, -2.2], p1: [0.6, 0.86, -2.32], l0: [0.32, 0.7, -2.74], l1: [0.33, 0.7, -2.74], f0: 34, f1: 30 },
  window: { p0: [0.6, 1.5, -1.3], p1: [0.3, 1.45, -1.65], l0: [-0.2, 1.5, -2.99], l1: [-0.22, 1.48, -2.99], f0: 40, f1: 36 },
  sash: { p0: [0.25, 1.62, -2.25], p1: [0.1, 1.58, -2.38], l0: [-0.2, 1.55, -2.98], l1: [-0.18, 1.56, -2.98], f0: 36, f1: 32 },
  sill: { p0: [0.35, 1.1, -2.2], p1: [0.15, 1.02, -2.32], l0: [-0.2, 0.85, -2.92], l1: [-0.25, 0.85, -2.92], f0: 36, f1: 32 },
  baseboard: { p0: [-1.75, 0.75, 0.9], p1: [-2.0, 0.6, 0.55], l0: [-2.95, 0.1, -0.6], l1: [-2.95, 0.1, -0.9], f0: 40, f1: 36 },
  endcap: { p0: [-2.35, 0.42, 1.25], p1: [-2.5, 0.36, 1.05], l0: [-2.93, 0.1, 0.5], l1: [-2.93, 0.1, 0.45], f0: 36, f1: 32 },
  chair: { p0: [2.4, 1.3, 0.2], p1: [2.2, 1.2, -0.2], l0: [1.2, 0.6, -2.0], l1: [1.15, 0.6, -2.05], f0: 40, f1: 36 },
  boiler: { p0: [2.6, -1.6, -0.6], p1: [2.2, -1.75, -0.9], l0: [1.2, -1.95, -2.4], l1: [1.15, -1.95, -2.42], f0: 40, f1: 36 },
  gauge: { p0: [1.3, -1.6, -1.6], p1: [1.18, -1.64, -1.72], l0: [1.1, -1.68, -2.1], l1: [1.1, -1.68, -2.1], f0: 34, f1: 30 },
  glass: { p0: [2.15, -1.75, -1.65], p1: [2.0, -1.8, -1.78], l0: [1.73, -1.82, -2.22], l1: [1.73, -1.83, -2.22], f0: 34, f1: 30 },
  pipes: { p0: [0.9, -1.9, 0.6], p1: [0.5, -1.8, 0.2], l0: [0.2, -0.85, -2.5], l1: [0.0, -0.8, -2.5], f0: 42, f1: 38 },
  bench: { p0: [-0.9, -1.4, -0.8], p1: [-1.15, -1.5, -1.1], l0: [-1.9, -1.55, -2.6], l1: [-1.95, -1.55, -2.6], f0: 40, f1: 36 },
  cover: { p0: [BK[0] + 0.05, BK[1] + 0.42, BK[2] + 0.3], p1: [BK[0] - 0.04, BK[1] + 0.3, BK[2] + 0.12], l0: [BK[0] - 0.03, BK[1], BK[2] - 0.01], l1: [BK[0] - 0.01, BK[1], BK[2] - 0.01], f0: 34, f1: 30 },
  book: { p0: [BK[0] - 0.08, BK[1] + 0.42, BK[2] + 0.2], p1: [BK[0] - 0.08, BK[1] + 0.33, BK[2] + 0.1], l0: [BK[0] - 0.09, BK[1], BK[2] - 0.01], l1: [BK[0] - 0.08, BK[1], BK[2] - 0.01], f0: 36, f1: 32 },
};
type Stop = [number, string];
type Fx = [number, { heat?: number; gauge?: number }];
const WJS = WJ as unknown as { cams: Stop[]; fx?: Fx[] };
const ST = (WJS.cams ?? [[0, "sala"]]).filter((s) => CAMS[s[1]]);
const FX = WJS.fx ?? [];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const k = cl(x); return k * k * (3 - 2 * k); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const UP = new THREE.Vector3(0, 1, 0);
const at = (c: C, u: number, dur: number, i = 0) => {
  const k = sm(u / dur), p = v3(c.p0).lerp(v3(c.p1), k), l = v3(c.l0).lerp(v3(c.l1), k);
  const d = l.clone().sub(p).normalize(), r = d.clone().cross(UP).normalize(), w = sm(u / 1.5) * Math.min(1, p.distanceTo(l) / 1.5);
  p.addScaledVector(r, 0.09 * Math.sin(u * 0.45 + i) * w).addScaledVector(d, Math.min(0.2, 0.013 * u));
  l.addScaledVector(r, 0.16 * Math.sin(u * 0.45 + i + 0.7) * w).addScaledVector(UP, 0.04 * Math.sin(u * 0.3 + i) * w);
  return { p, l, fov: c.f0 + (c.f1 - c.f0) * k };
};
const idx = (t: number) => { let i = 0; while (i < ST.length - 1 && ST[i + 1][0] <= t) i++; return i; };
export const camAt = (t: number) => {
  const i = idx(t), s = ST[i] ?? [0, "sala"], nx = ST[i + 1]?.[0] ?? s[0] + 30;
  const dur = Math.max(6, nx - s[0]), cur = at(CAMS[s[1]], t - s[0], dur, i);
  if (i === 0) return cur;
  const ps = ST[i - 1], prev = at(CAMS[ps[1]], s[0] - ps[0], Math.max(6, s[0] - ps[0]), i - 1);
  const D = Math.min(2.4, Math.max(1.1, (nx - s[0]) * 0.4)), k = ease((t - s[0]) / D);
  const p = prev.p.clone().lerp(cur.p, k), l = prev.l.clone().lerp(cur.l, k);
  // de un piso al otro el vuelo sale hacia afuera del corte (z+) para no atravesar la losa
  const floors = Math.sign(prev.p.y + 0.2) !== Math.sign(cur.p.y + 0.2);
  const arc = Math.sin(Math.PI * k) * (floors ? 1.6 : Math.min(0.35, prev.p.distanceTo(cur.p) * 0.18));
  if (floors) { p.z += Math.sin(Math.PI * k) * Math.max(0, 3.3 - p.z); } else { p.y += arc; p.x += arc * 0.5 * (i % 2 ? 1 : -1); }
  p.x += 0.004 * Math.sin(t * 0.31); p.y += 0.003 * Math.sin(t * 0.23 + 1);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / 30);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(10, dp * 0.4), by: Math.min(7, dp * 0.2) };
};
const bookOf = (t: number): Scene["book"] => {
  const i = idx(t), name = ST[i]?.[1];
  if (name === "book") return { open: sm((t - ST[i][0] - 0.4) / 1.2), page: "cta" };
  if (name === "cover") return { open: 0, page: "cta" };
  const pv = ST[i - 1]?.[1];
  if ((pv === "book" || pv === "cover") && t - ST[i][0] < 2.2) return { open: pv === "book" ? 1 - sm((t - ST[i][0]) / 0.9) : 0, page: "cta" };
  return { open: 0, page: "cta" };
};
// fx con rampa (nunca salto): el último valor antes de t, fundido en 1,5 s desde el anterior
const fxAt = (t: number, key: "heat" | "gauge", def: number) => {
  let prev = def, cur = def, a = -99;
  for (const [ft, kv] of FX) { if (ft > t) break; if (kv[key] !== undefined) { prev = cur; cur = kv[key]!; a = ft; } }
  return prev + (cur - prev) * sm((t - a) / 1.5);
};
export const World: React.FC<{ t: number }> = ({ t }) => {
  const c = camAt(t);
  const sc: Scene = { cam: { p: [c.p.x, c.p.y, c.p.z], l: [c.l.x, c.l.y, c.l.z], fov: c.fov }, book: bookOf(t), heat: fxAt(t, "heat", 0.15), gauge: fxAt(t, "gauge", 13) };
  return <HouseWorld t={t} sc={sc} />;
};
