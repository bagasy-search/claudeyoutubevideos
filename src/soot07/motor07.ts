import { Easing } from "remotion";
import { VEL, PLANOS, OSC, FUEGO, SALTOS, TEMAS, DUR, B, M } from "./guion07";
import { construirCalle, Tema, Cam } from "./mundo";
import { rnd } from "../soot/lib";

// Motor de soot07: caminata integrada cuadro a cuadro, cámara por segmentos encadenados (un plano nuevo arranca
// desde donde estaba la cámara en ese instante, aunque el anterior no hubiera terminado) y el barrio de cada x.
export const FPS = 30;
const ease = Easing.inOut(Easing.cubic);
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export const vel = (t: number) => {
  let k = -1;
  for (let i = 0; i < VEL.length; i++) if (VEL[i][0] <= t) k = i; else break;
  if (k < 0) return VEL[0]?.[1] ?? 0;
  const prev = k > 0 ? VEL[k - 1][1] : VEL[k][1];
  const u = cl((t - VEL[k][0]) / 0.5);
  return prev + (VEL[k][1] - prev) * ease(u);
};
const XF = new Float64Array(DUR + 2);
const VF = new Float64Array(DUR + 2);
{
  let x = 0;
  const saltos = [...SALTOS].sort((a, b) => a[0] - b[0]);
  let js = 0;
  for (let f = 0; f <= DUR + 1; f++) {
    const t = f / FPS;
    VF[f] = vel(t);
    while (js < saltos.length && saltos[js][0] <= t) { x += saltos[js][1]; js++; }
    XF[f] = x;
    x += VF[f] / FPS;
  }
}
const idx = (t: number) => Math.max(0, Math.min(DUR + 1, t * FPS));
export const X = (t: number) => { const i = idx(t), a = Math.floor(i), b = Math.min(DUR + 1, a + 1); return XF[a] + (XF[b] - XF[a]) * (i - a); };
export const V = (t: number) => VF[Math.round(idx(t))];
export const XMAX = XF[DUR + 1];

// barrio de cada x: el tiempo en que el protagonista pasa por ahí → tema vigente en ese tiempo
const TEM = [...TEMAS].sort((a, b) => a[0] - b[0]);
const temaT = (t: number): Tema => { let r = TEM[0][1]; for (const [t0, n] of TEM) if (t0 <= t) r = n; return r as Tema; };
export const temaEn = (x: number): Tema => {
  if (x <= XF[0]) return temaT(0);
  let lo = 0, hi = DUR + 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (XF[m] < x) lo = m + 1; else hi = m; }
  return temaT(lo / FPS);
};

// la calle entera, una sola vez (el edificio de la olla y la casa del final, de 6 pisos)
const xCasa = X(M.puertaCasa);
export const X_CASA = xCasa;
export const CALLE = construirCalle(-3000, XMAX + 5000, temaEn).map((e) => {
  if ((e.x < 420 && e.x + e.w > -200) || (e.x < xCasa + 300 && e.x + e.w > xCasa - 150)) return { ...e, pisos: 6, tipo: "insula" as const };
  return e;
});
export const edifEn = (x: number) => CALLE.find((e) => e.x <= x && e.x + e.w >= x);

// cámara: segmentos encadenados
type Seg = { t0: number; d: number; de: [number, number, number]; a: [number, number, number] };
const SEGS: Seg[] = [];
{
  let cur: [number, number, number] = [PLANOS[0][1], PLANOS[0][2], PLANOS[0][3]];
  for (const [t0, dx, y, z, d] of PLANOS) {
    const prev = SEGS[SEGS.length - 1];
    if (prev) cur = valSegP(prev, t0);
    SEGS.push({ t0, d: Math.max(0.01, d), de: cur, a: [dx, y, z] });
  }
}
// OJO v3: acercamiento lento (+7 % en 8 s) en todo plano sostenido: ningún cuadro queda igual muchos segundos
function valSegP(s: Seg, t: number): [number, number, number] {
  const v = valSeg(s, t);
  v[2] *= 1 + 0.07 * cl((t - s.t0 - s.d) / 8);
  return v;
}
function valSeg(s: Seg, t: number): [number, number, number] {
  const u = ease(cl((t - s.t0) / s.d));
  return [0, 1, 2].map((i) => s.de[i] + (s.a[i] - s.de[i]) * u) as [number, number, number];
}
// golpes de zoom en revelaciones (títulos de trampa y textos grandes marcados)
const GOLPES = B.filter((b) => b.k === "trap" || (b.k === "big" && b.golpe)).map((b) => b.t);
export const cam = (t: number): Cam & { dx: number } => {
  let s = SEGS[0];
  for (const g of SEGS) if (g.t0 <= t) s = g; else break;
  const [dx, y, z] = valSegP(s, t);
  const golpe = GOLPES.reduce((a, g) => a + (t >= g && t < g + 1 ? 0.05 * Math.exp(-(t - g) * 6) : 0), 0);
  // deriva lenta para que la cámara nunca esté quieta (dolly suave)
  const deriva = Math.sin(t * 0.21) * 18 + Math.sin(t * 0.07) * 30;
  return { x: X(t) + dx + deriva, y, z: z * (1 + golpe + Math.sin(t * 0.13) * 0.012), dx };
};
const kfLin = (t: number, ks: [number, number][], d = 0.6) => {
  let k = -1;
  for (let i = 0; i < ks.length; i++) if (ks[i][0] <= t) k = i; else break;
  if (k < 0) return ks[0][1];
  const prev = k > 0 ? ks[k - 1][1] : ks[k][1];
  return prev + (ks[k][1] - prev) * ease(cl((t - ks[k][0]) / d));
};
export const oscuridad = (t: number) => kfLin(t, OSC, 0.45);
export const fuego = (t: number) => kfLin(t, FUEGO, 2.5);

// azar determinista por clave
export const azar = (k: number) => rnd(k * 7919 + 13)();
