// Reacciones listas: sorpresa, asco, miedo, alivio. Cada una es una ACTUACIÓN de 3 tiempos (anticipación → golpe
// exagerado → asentarse), no un cambio de pose: `conReaccion(actor, tipo, f0)` le agrega las claves de pose y cara al
// Actor y le compone el `ajuste` (salto, temblor, sacudón de cabeza, exhalación). `ReaccionFx` dibuja las marcas
// (rayitas de sorpresa, olor, gotas de sudor, bocanada de alivio) en el MUNDO, sobre la cabeza.
import React from "react";
import { interpolate } from "remotion";
import { useF } from "../camara";
import { ActorProps } from "../actor";
import { ClaveT, Pose } from "../personaje";
import { clamp, Cue, cue } from "./comun";

export type Reaccion = "sorpresa" | "asco" | "miedo" | "alivio";

// [anticipación, golpe, asentado]
const POSES_R: Record<Reaccion, [Partial<Pose>, Partial<Pose>, Partial<Pose>]> = {
  sorpresa: [{ tronco: 8, cabeza: 8, hD: 20, cD: 40, hI: 15, cI: 40, bajar: 4 }, { tronco: -14, cabeza: -14, hD: 135, cD: 35, hI: 128, cI: 40 }, { tronco: -8, cabeza: -8, hD: 125, cD: 28, hI: 118, cI: 30 }],
  asco: [{ tronco: 6, cabeza: 6 }, { tronco: -16, cabeza: -22, hD: 50, cD: 135, hI: -25, cI: 20, pD: 14 }, { tronco: -12, cabeza: -16, hD: 44, cD: 132, hI: -28, cI: 22, pD: 10 }],
  miedo: [{ tronco: -6, cabeza: -6, hD: 30, cD: 50 }, { tronco: 14, cabeza: 14, hD: 48, cD: 132, hI: 44, cI: 136, rI: 12, rD: 12, bajar: 10 }, { tronco: 16, cabeza: 14, hD: 46, cD: 128, hI: 42, cI: 132, rI: 14, rD: 14, bajar: 20 }],
  alivio: [{ tronco: 4, cabeza: 6, hD: 20, cD: 30 }, { tronco: -8, cabeza: -12, hD: 30, cD: 132, hI: -8, cI: 18 }, { tronco: 4, cabeza: 8, hD: 26, cD: 128, hI: -10, cI: 12, bajar: 8 }],
};
const CARA_R: Record<Reaccion, string> = { sorpresa: "sorpresa", asco: "asco", miedo: "miedo", alivio: "alivio" };

export const conReaccion = (a: ActorProps, tipo: Reaccion, f0: number, dura = 60): ActorProps => {
  const [ant, golpe, asent] = POSES_R[tipo];
  // la pose base que había justo antes, para volver al final
  const previa = (a.poses ?? []).filter((k) => k.f < f0).slice(-1)[0]?.v ?? {};
  const poses: ClaveT<string | Partial<Pose>>[] = [
    ...(a.poses ?? []).filter((k) => k.f < f0 || k.f > f0 + dura),
    { f: f0, v: ant, d: 6 }, { f: f0 + 5, v: golpe, d: 5 }, { f: f0 + 16, v: asent, d: 14 }, { f: f0 + dura, v: previa, d: 18 },
  ].sort((x, y) => x.f - y.f);
  const caras: ClaveT<string>[] = [...(a.caras ?? []).filter((k) => k.f < f0 + 2 || k.f > f0 + dura), { f: f0 + 3, v: CARA_R[tipo] }].sort((x, y) => x.f - y.f);
  const base = a.ajuste;
  const ajuste = (p: Pose, f: number): Pose => {
    let q = base ? base(p, f) : p;
    const t = f - f0;
    if (t < 0 || t > dura) return q;
    if (tipo === "sorpresa" && t >= 5 && t < 15) { const u = (t - 5) / 10; q = { ...q, bajar: q.bajar - 22 * 4 * u * (1 - u) }; } // saltito
    if (tipo === "miedo" && t >= 6) { const k = interpolate(t, [6, 12, dura - 10, dura], [0, 1, 1, 0], clamp); q = { ...q, tronco: q.tronco + k * 1.6 * Math.sin(f * 2.3), cabeza: q.cabeza + k * 2 * Math.sin(f * 3.1 + 1), hD: q.hD + k * 2 * Math.sin(f * 2.7) }; }
    if (tipo === "asco" && t >= 6 && t < 30) { const k = Math.exp(-(t - 6) / 8); q = { ...q, cabeza: q.cabeza + 9 * k * Math.sin((t - 6) * 0.9) }; } // «no, no»
    if (tipo === "alivio" && t >= 12) { const k = interpolate(t, [12, 30], [0, 1], clamp) * interpolate(t, [dura - 12, dura], [1, 0], clamp); q = { ...q, tronco: q.tronco + 2 * k * Math.sin(t / 9), bajar: q.bajar + 2 * k }; } // hombros que caen al exhalar
    return q;
  };
  return { ...a, poses, caras, ajuste };
};

// marcas de reacción sobre la cabeza: (x, y) = punto del mundo arriba de la cabeza; dir = hacia dónde mira
export const ReaccionFx: React.FC<{ tipo: Reaccion; f0: number; x: number; y: number; dir?: 1 | -1; s?: number; color?: string }> = ({ tipo, f0, x, y, dir = 1, s = 1, color }) => {
  const f = useF();
  const t = f - f0;
  if (t < 2 || t > 56) return null;
  const o = interpolate(t, [2, 6, 40, 56], [0, 1, 1, 0], clamp);
  if (tipo === "sorpresa") {
    const u = interpolate(t, [3, 12], [0, 1], { ...clamp });
    return (
      <g transform={`translate(${x},${y}) scale(${s})`} opacity={o} stroke={color ?? "#fff3c0"} strokeWidth={7} strokeLinecap="round">
        {[-62, -32, 0, 32, 62].map((a, i) => {
          const r0 = 30 + u * 20, r1 = r0 + 34 * Math.min(1, u * 1.4) * (1 - interpolate(t, [24, 40], [0, 1], clamp));
          const ar = ((a - 90) * Math.PI) / 180;
          return <line key={i} x1={Math.cos(ar) * r0} y1={Math.sin(ar) * r0} x2={Math.cos(ar) * r1} y2={Math.sin(ar) * r1} />;
        })}
      </g>
    );
  }
  if (tipo === "asco") {
    return (
      <g transform={`translate(${x + dir * 40},${y + 60}) scale(${s})`} opacity={o} stroke={color ?? "#9fd86a"} strokeWidth={6} fill="none" strokeLinecap="round">
        {[0, 1, 2].map((i) => {
          const sube = ((t * 1.2 + i * 14) % 42);
          return <path key={i} transform={`translate(${(i - 1) * 26},${-sube})`} opacity={1 - sube / 42} d={`M0,0 q${10},-10 0,-20 q-10,-10 0,-20`} />;
        })}
      </g>
    );
  }
  if (tipo === "miedo") {
    return (
      <g transform={`translate(${x},${y + 40}) scale(${s})`} opacity={o}>
        {[0, 1].map((i) => {
          const cae = ((t * 1.6 + i * 18) % 36);
          return <path key={i} transform={`translate(${dir * (52 + i * 16)},${cae - 10})`} d="M0,-14 Q9,0 0,8 Q-9,0 0,-14 Z" fill={color ?? "#9fd6ff"} opacity={1 - cae / 36} />;
        })}
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 70},-30 l${sd * 10},12 l${-sd * 10},12 l${sd * 10},12`} stroke="#ffffff" strokeOpacity={0.7} strokeWidth={4} fill="none" strokeLinecap="round" transform={`translate(${Math.sin(f * 2.4) * 2},0)`} />)}
      </g>
    );
  }
  // alivio: bocanada que sale de la boca y se deshace
  const u = interpolate(t, [10, 44], [0, 1], clamp);
  return (
    <g transform={`translate(${x + dir * (40 + u * 70)},${y + 70 - u * 30}) scale(${s})`} opacity={o * (1 - u * 0.8)} fill={color ?? "#ffffff"}>
      {[[0, 0, 14], [18, -6, 11], [32, 2, 8]].map(([cx, cy, r], i) => <circle key={i} cx={cx * dir} cy={cy} r={r * (0.6 + u)} opacity={0.75} />)}
    </g>
  );
};

export const foleyReaccion = (tipo: Reaccion, f0: number): Cue[] => {
  if (tipo === "sorpresa") return [cue(f0 + 3, "gasp", -4), cue(f0 + 5, "pop", -8)];
  if (tipo === "asco") return [cue(f0 + 4, "fail", -8), cue(f0 + 6, "cloth", -12)];
  if (tipo === "miedo") return [cue(f0 + 4, "gasp", -6), cue(f0 + 8, "heart", -6)];
  return [cue(f0 + 10, "wind", -14), cue(f0 + 14, "sparkle", -10)];
};
