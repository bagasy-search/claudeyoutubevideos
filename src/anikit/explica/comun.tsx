// Base de los componentes de EXPLICACIÓN (lo que carga la idea de cada escena): entradas con resorte y overshoot,
// escalonado, sombra plana (sin filter), lectura de números y el FOLEY de cada mini acción.
// Todo es determinístico (sale sólo del cuadro): ni Math.random, ni estado, ni nada que cambie entre chunks del farm.
import React from "react";
import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../camara";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

// reloj local de un componente: f = cuadros desde `desde`; ent(d) = resorte con overshoot que arranca a los d cuadros
export const useReloj = (desde = 0, hasta?: number) => {
  const F = useF();
  const { fps } = useVideoConfig();
  const f = F - desde;
  const ent = (d = 0, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
    spring({ frame: f - d, fps, config: { damping: 12, stiffness: 120, mass: 0.9, ...cfg } });
  const suave = (d: number, dur: number) => interpolate(f, [d, d + dur], [0, 1], { ...clamp, easing: easeOut });
  const salida = hasta === undefined ? 1 : interpolate(F, [hasta - 12, hasta], [1, 0], clamp);
  return { f, fps, ent, suave, salida, F };
};

// sombra plana: el mismo dibujo, oscuro y corrido hacia abajo (las referencias usan sombra dura y corta, no blur)
export const Sombra: React.FC<{ dy?: number; o?: number; children: React.ReactNode }> = ({ dy = 8, o = 0.28, children }) => (
  <g transform={`translate(0,${dy})`} opacity={o} style={{ fill: "#000" }}>{children}</g>
);

// velo: lavado oscuro de pantalla completa debajo del panel, para que el set no compita con la infografía (no es
// filtro: un rect plano con alfa). Va primero en el hud.
export const Velo: React.FC<{ desde?: number; hasta?: number; o?: number; color?: string }> = ({ desde = 0, hasta, o = 0.42, color = "#0d0b12" }) => {
  const { f, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: salida }}><rect width={1920} height={1080} fill={color} opacity={o * interpolate(f, [0, 12], [0, 1], clamp)} /></svg>;
};

// número legible: 1,388 · 2.5 · 12%
export const num = (v: number, dec = 0) => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// muestrea una curva suave (Catmull-Rom) que pasa por los puntos → polilínea + largo acumulado (para recorrerla a
// velocidad pareja, dibujarla con dasharray y poner una flecha en la punta). Puro: mismo resultado en cada chunk.
export type Pt = { x: number; y: number };
export const curva = (pts: Pt[], porTramo = 24) => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    for (let k = 0; k < porTramo; k++) {
      const t = k / porTramo, t2 = t * t, t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push({ x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(pts[pts.length - 1]);
  const L = [0];
  for (let i = 1; i < out.length; i++) L.push(L[i - 1] + Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y));
  const d = "M" + out.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L");
  // punto y ángulo a una fracción u (0..1) del largo
  const en = (u: number) => {
    const s = Math.max(0, Math.min(1, u)) * L[L.length - 1];
    let i = 1;
    while (i < L.length - 1 && L[i] < s) i++;
    const a = out[i - 1], b = out[i], k = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
  };
  return { d, largo: L[L.length - 1], en, puntos: out };
};

// ---------- FOLEY ----------
// Cada componente exporta `foleyX(props)` → lista de golpes de sonido en SEGUNDOS ABSOLUTOS del video (si le pasás
// `desde` absoluto). Los pools son los de D:/rtmp/sfxlib/mezcla.py (whoosh, pop, tick, ding, slam, heart, gasp…).
// Se juntan todas las listas del video y se escribe el cues.py con `cuesPy()`; después:
//   python -I D:/rtmp/sfxlib/mezcla.py voz.wav cues.py voz_con_sfx.wav
export type Cue = [number, string, number?];
export const cue = (cuadro: number, pool: string, gainDb?: number, fps = 30): Cue => [Math.round((cuadro / fps) * 1000) / 1000, pool, gainDb];
export const cuesPy = (cues: Cue[]) =>
  "CUES = [\n" + cues.slice().sort((a, b) => a[0] - b[0]).map((c) => `    (${c[0]}, "${c[1]}"${c[2] !== undefined ? `, ${c[2]}` : ""}),`).join("\n") + "\n]\n";
