import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import caps from "./caps.json";

// Mundo 2.5D de cámara estenopeica: cada capa vive a una distancia D; la cámara tiene (cx, cy, cz).
// Un punto p dibujado "en reposo" en la capa D cae en pantalla en (p - c·F/D) · D/(D - cz)  → paralaje y dolly reales.
// Desenfoque por capa = apertura · |D - foco| / (D - cz)  → profundidad de campo con cambio de foco.

export const F = 1000;
export const SUELO = 300; // altura del piso en el plano de los personajes (D = F)
export const FPS = 30;

export type Cam = { cx: number; cy: number; cz: number; foco: number; ap: number };

export const rnd = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const suave = (t: number, a: number, b: number) =>
  b <= a ? (t >= b ? 1 : 0) : interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.25, 1) });
// rápido al principio y frena (golpes, sacudones)
export const seco = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

// Hermite con tangentes Catmull-Rom: la cámara pasa por los puntos SIN frenar en cada uno (nada robótico)
export const curva = (t: number, ks: [number, number][]) => {
  const n = ks.length;
  if (t <= ks[0][0]) return ks[0][1];
  if (t >= ks[n - 1][0]) return ks[n - 1][1];
  let i = 0;
  while (t > ks[i + 1][0]) i++;
  const pend = (j: number) => (j === 0 || j === n - 1 ? 0 : (ks[j + 1][1] - ks[j - 1][1]) / (ks[j + 1][0] - ks[j - 1][0]));
  const [t0, v0] = ks[i];
  const [t1, v1] = ks[i + 1];
  const h = t1 - t0;
  const u = (t - t0) / h;
  const m0 = pend(i) * h;
  const m1 = pend(i + 1) * h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * m1;
};

// cámara a partir de llaves [t, cx, cy, cz]
export const recorrido = (t: number, ks: [number, number, number, number][]) => ({
  cx: curva(t, ks.map((k) => [k[0], k[1]])),
  cy: curva(t, ks.map((k) => [k[0], k[2]])),
  cz: curva(t, ks.map((k) => [k[0], k[3]])),
});

// ---------- sincronía con la voz: at("frase") = segundo en que se DICE ----------
type Palabra = { text: string; startMs: number; endMs: number };
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
const PAL = (caps as Palabra[]).map((w) => ({ w: norm(w.text), s: w.startMs / 1000, e: w.endMs / 1000 }));
export const at = (frase: string, desde = 0): number => {
  const q = norm(frase).split(/\s+/);
  for (let i = 0; i <= PAL.length - q.length; i++) {
    if (PAL[i].s < desde) continue;
    if (q.every((w, j) => PAL[i + j].w === w)) return PAL[i].s;
  }
  throw new Error(`at(): no encuentro "${frase}" en la voz`);
};
export const finDe = (frase: string, desde = 0): number => {
  const q = norm(frase).split(/\s+/);
  const s = at(frase, desde);
  const i = PAL.findIndex((p) => p.s === s);
  return PAL[i + q.length - 1].e;
};

export const desenfoque = (D: number, c: Cam) => Math.min(40, (c.ap * Math.abs(D - c.foco)) / Math.max(40, D - c.cz));

// Capa a distancia D. Lo de adentro se dibuja en coordenadas "de reposo" (centro de pantalla = 0,0).
// Siempre lleva filtro (aunque sea 0 px): prenderlo/apagarlo entre cuadros cambia el rasterizado y parpadea.
export const Capa: React.FC<{
  D: number;
  cam: Cam;
  children: React.ReactNode;
  sinDesenfoque?: boolean;
  extra?: number;
  opacidad?: number;
  mezcla?: React.CSSProperties["mixBlendMode"];
}> = ({ D, cam, children, sinDesenfoque, extra = 0, opacidad = 1, mezcla }) => {
  const dist = D - cam.cz;
  // lo que la cámara está por atravesar se desvanece (y nunca queda "detrás" de la cámara)
  const cerca = clamp((dist - 70) / 150, 0, 1);
  if (cerca <= 0 || opacidad <= 0) return null;
  const k = F / D;
  const m = D / dist;
  const b = (sinDesenfoque ? 0 : desenfoque(D, cam)) + extra;
  const W = 12000;
  const H = 6000;
  return (
    <AbsoluteFill style={{ filter: `blur(${b.toFixed(2)}px)`, opacity: opacidad * cerca, mixBlendMode: mezcla }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(960px,540px) scale(${m}) translate(${-cam.cx * k}px,${-cam.cy * k}px)`,
        }}
      >
        <svg
          width={W}
          height={H}
          viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
          style={{ position: "absolute", left: -W / 2, top: -H / 2, overflow: "visible" }}
        >
          {children}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// posición en pantalla (relativa al centro) de un punto de la capa D
export const aPantalla = (x: number, y: number, D: number, c: Cam) => {
  const k = F / D;
  const m = D / (D - c.cz);
  return [(x - c.cx * k) * m, (y - c.cy * k) * m];
};

// recorrido de un personaje: llaves [t, x]; entre llaves camina con arranque y frenada suaves.
// Devuelve x, distancia recorrida (para la fase del paso: los pies no patinan) y cuánto "camina" (0..1).
export const andar = (t: number, ks: [number, number][], vel = 240) => {
  let x = ks[0][1];
  let dist = 0;
  let amp = 0;
  for (let i = 1; i < ks.length; i++) {
    const [t0, x0] = ks[i - 1];
    const [t1, x1] = ks[i];
    if (t <= t0) break;
    const u = clamp((t - t0) / (t1 - t0), 0, 1);
    // perfil trapezoidal suave: 0,25 s de arranque y de frenada
    const r = Math.min(0.25, (t1 - t0) / 3) / (t1 - t0);
    const e = (v: number) => {
      if (v < r) return (v * v) / (2 * r * (1 - r));
      if (v > 1 - r) return 1 - ((1 - v) * (1 - v)) / (2 * r * (1 - r));
      return (v - r / 2) / (1 - r);
    };
    const pu = e(u);
    x = lerp(x0, x1, pu);
    dist += Math.abs(x1 - x0) * pu;
    if (u > 0 && u < 1) {
      const v = Math.abs(x1 - x0) / (t1 - t0) / (1 - r);
      const perfil = u < r ? u / r : u > 1 - r ? (1 - u) / r : 1;
      amp = clamp((v / vel) * perfil, 0, 1.25);
    }
  }
  return { x, dist, amp };
};
