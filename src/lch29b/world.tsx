// lhh29 · el MUNDO de Loretta: su cocina de Iowa en 3D (kitchen3d, de noche, tibia) con cámaras con nombre.
// world.json = {cams: [[t, "nombre"]...]} anclado a frases; entre paradas la cámara viaja en curva (arco), y dentro de
// cada parada deriva despacio (p0→p1), así nunca hay dos cuadros iguales. "book" = el House Book abierto en la página
// real del video; "cover" = el libro cerrado sobre el mantel.
import React from "react";
import * as THREE from "three";
import { KitchenWorld, Scene, BOOK } from "./kitchen3d";
import WJ from "./world.json";

type V3 = [number, number, number];
type C = { p0: V3; p1: V3; l0: V3; l1: V3; f0: number; f1: number };
const BK: V3 = [BOOK[0] - 0.02, BOOK[1] + 0.02, BOOK[2]];
export const CAMS: Record<string, C> = {
  wide: { p0: [2.0, 1.5, 1.45], p1: [1.62, 1.4, 1.0], l0: [0.35, 0.8, -0.45], l1: [0.3, 0.8, -0.45], f0: 40, f1: 37 },
  wide2: { p0: [-0.9, 1.65, 1.6], p1: [-0.5, 1.5, 1.2], l0: [0.0, 0.9, -1.6], l1: [0.2, 0.9, -1.8], f0: 42, f1: 39 },
  table: { p0: [0.75, 1.32, 0.55], p1: [0.35, 1.18, 0.22], l0: [0.1, 0.8, -0.45], l1: [0.05, 0.8, -0.45], f0: 36, f1: 32 },
  stove: { p0: [1.6, 1.35, -0.6], p1: [1.3, 1.15, -1.0], l0: [1.0, 0.8, -2.4], l1: [1.05, 0.75, -2.4], f0: 40, f1: 36 },
  sink: { p0: [0.3, 1.45, -1.1], p1: [-0.1, 1.38, -1.5], l0: [-0.2, 1.3, -2.9], l1: [-0.25, 1.35, -2.9], f0: 42, f1: 38 },
  fridge: { p0: [-1.3, 1.35, -0.9], p1: [-1.5, 1.25, -1.2], l0: [-2.2, 1.0, -2.5], l1: [-2.2, 1.05, -2.6], f0: 42, f1: 38 },
  clock: { p0: [-1.0, 1.75, -1.8], p1: [-1.2, 1.78, -2.1], l0: [-1.38, 1.88, -2.96], l1: [-1.38, 1.88, -2.96], f0: 38, f1: 34 },
  shelf: { p0: [1.6, 1.55, -1.5], p1: [1.3, 1.6, -1.9], l0: [1.35, 1.68, -2.88], l1: [1.25, 1.7, -2.88], f0: 40, f1: 36 },
  counter: { p0: [-1.55, 1.5, -0.4], p1: [-1.7, 1.38, 0.3], l0: [-2.72, 0.95, -0.6], l1: [-2.72, 0.95, 0.4], f0: 40, f1: 36 },
  cross: { p0: [1.9, 1.6, -1.5], p1: [2.1, 1.65, -1.9], l0: [2.35, 1.7, -2.97], l1: [2.35, 1.72, -2.97], f0: 38, f1: 34 },
  candle: { p0: [1.2, 1.1, -0.1], p1: [1.05, 1.02, -0.35], l0: [0.82, 0.9, -0.7], l1: [0.82, 0.92, -0.7], f0: 36, f1: 32 },
  cover: { p0: [BK[0] + 0.05, BK[1] + 0.42, BK[2] + 0.3], p1: [BK[0] - 0.04, BK[1] + 0.3, BK[2] + 0.12], l0: [BK[0] - 0.03, BK[1], BK[2] - 0.01], l1: [BK[0] - 0.01, BK[1], BK[2] - 0.01], f0: 34, f1: 30 },
  book: { p0: [BK[0] - 0.08, BK[1] + 0.42, BK[2] + 0.2], p1: [BK[0] - 0.08, BK[1] + 0.33, BK[2] + 0.1], l0: [BK[0] - 0.09, BK[1], BK[2] - 0.01], l1: [BK[0] - 0.08, BK[1], BK[2] - 0.01], f0: 36, f1: 32 },
};
type Stop = [number, string];
const ST = ((WJ as unknown as { cams: Stop[] }).cams ?? [[0, "wide"]]).filter((s) => CAMS[s[1]]);
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const k = cl(x); return k * k * (3 - 2 * k); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
// deriva viva dentro de la parada: paneo lateral lento + acercamiento suave, así una parada larga nunca queda quieta
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
  const i = idx(t), s = ST[i] ?? [0, "wide"], nx = ST[i + 1]?.[0] ?? s[0] + 30;
  const dur = Math.max(6, nx - s[0]), cur = at(CAMS[s[1]], t - s[0], dur, i);
  if (i === 0) return cur;
  const ps = ST[i - 1], prev = at(CAMS[ps[1]], s[0] - ps[0], Math.max(6, s[0] - ps[0]), i - 1);
  const D = Math.min(2.2, Math.max(1.1, (nx - s[0]) * 0.4)), k = ease((t - s[0]) / D);
  const p = prev.p.clone().lerp(cur.p, k), l = prev.l.clone().lerp(cur.l, k);
  const arc = Math.sin(Math.PI * k) * Math.min(0.35, prev.p.distanceTo(cur.p) * 0.18);
  p.y += arc; p.x += arc * 0.5 * (i % 2 ? 1 : -1);
  // respiración lenta (siempre viva, nunca quieta)
  p.x += 0.004 * Math.sin(t * 0.31); p.y += 0.003 * Math.sin(t * 0.23 + 1);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / 30);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(10, dp * 0.4), by: Math.min(7, dp * 0.2) };
};
// el libro se abre al entrar a "book" (1,2 s) y se cierra al salir; "cover" lo deja cerrado sobre el mantel
const bookOf = (t: number): Scene["book"] => {
  const i = idx(t), name = ST[i]?.[1];
  if (name === "book") return { open: sm((t - ST[i][0] - 0.4) / 1.2), page: "cta" };
  if (name === "cover") return { open: 0, page: "cta" };
  const pv = ST[i - 1]?.[1];
  if ((pv === "book" || pv === "cover") && t - ST[i][0] < 2.2) return { open: pv === "book" ? 1 - sm((t - ST[i][0]) / 0.9) : 0, page: "cta" };
  return { open: 0, page: "cta" };
};
export const World: React.FC<{ t: number }> = ({ t }) => {
  const c = camAt(t);
  const sc: Scene = { cam: { p: [c.p.x, c.p.y, c.p.z], l: [c.l.x, c.l.y, c.l.z], fov: c.fov }, book: bookOf(t) };
  return <KitchenWorld t={t} sc={sc} />;
};
