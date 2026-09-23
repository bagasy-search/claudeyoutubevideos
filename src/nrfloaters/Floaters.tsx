// Floaters.tsx — capa PROCEDURAL que simula lo que ve alguien con moscas volantes, encima de un clip REAL
// de stock (el brief pide material real; la IA queda para el presentador). Nada de <Video>: el clip va con
// ReframedVideo (OffthreadVideo). Sin filtros de color sobre el footage: sólo sombras grises semitransparentes.
//   kind: "sky"     puntos + hebras + una telaraña, deriva lenta con retraso (como el gel que chapotea)
//         "page"    2 hebras finas que cruzan la línea de lectura
//         "ring"    el anillo grande (Weiss) + telaraña: el floater NUEVO del desprendimiento
//         "shower"  lluvia de puntitos oscuros (la señal de alarma nº1)
//         "curtain" sombra oscura que baja desde el borde superior (la señal nº3)
// Determinista por seed (el farm rinde en chunks paralelos: nada de Math.random).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ReframedVideo } from "../nrvaseneck/Piezas";

const h = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Kind = "sky" | "page" | "ring" | "shower" | "curtain";

// deriva "con retraso": la mirada se mueve en saltos y el floater la sigue tarde y se pasa (gel)
const drift = (t: number, seed: number, salt: number, amp: number) => {
  const f1 = 0.11 + h(seed, salt) * 0.08, f2 = 0.27 + h(seed, salt + 1) * 0.1;
  return amp * (0.75 * Math.sin(t * f1 * 2 * Math.PI + h(seed, salt + 2) * 6.28) + 0.25 * Math.sin(t * f2 * 2 * Math.PI + h(seed, salt + 3) * 6.28));
};

const Thread: React.FC<{ x: number; y: number; len: number; rot: number; w: number; op: number }> = ({ x, y, len, rot, w, op }) => (
  <path d={`M ${-len / 2} 0 C ${-len / 4} ${-len * 0.18}, ${len / 4} ${len * 0.2}, ${len / 2} ${-len * 0.05}`}
    transform={`translate(${x} ${y}) rotate(${rot})`} fill="none" stroke={`rgba(40,44,48,${op})`} strokeWidth={w} strokeLinecap="round" filter="url(#fb)" />
);

export const FloaterClip: React.FC<{ src: string; seed: number; frames?: number; kind?: Kind }> = ({ src, seed, frames, kind = "sky" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const inOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const dx = drift(t, seed, 1, 60), dy = drift(t, seed, 9, 26);
  const els: React.ReactNode[] = [];
  if (kind === "sky" || kind === "page") {
    const n = kind === "page" ? 2 : 5;
    for (let i = 0; i < n; i++) {
      const x = 360 + h(seed, 20 + i) * 1200 + dx * (0.7 + 0.6 * h(seed, 30 + i));
      const y = (kind === "page" ? 380 : 220) + h(seed, 40 + i) * (kind === "page" ? 260 : 620) + dy * (0.6 + h(seed, 50 + i));
      els.push(<Thread key={`t${i}`} x={x} y={y} len={90 + h(seed, 60 + i) * 170} rot={h(seed, 70 + i) * 180 + drift(t, seed, 80 + i, 8)} w={3 + h(seed, 90 + i) * 4} op={0.28 + 0.2 * h(seed, 95 + i)} />);
    }
    if (kind === "sky") for (let i = 0; i < 9; i++) {
      const x = 260 + h(seed, 100 + i) * 1400 + dx * (0.5 + h(seed, 110 + i));
      const y = 160 + h(seed, 120 + i) * 760 + dy * (0.5 + h(seed, 130 + i));
      els.push(<circle key={`d${i}`} cx={x} cy={y} r={5 + h(seed, 140 + i) * 11} fill={`rgba(38,42,46,${0.22 + 0.2 * h(seed, 150 + i)})`} filter="url(#fb)" />);
    }
    if (kind === "sky") els.push(<g key="web" transform={`translate(${1180 + dx * 1.2} ${420 + dy * 1.1}) rotate(${drift(t, seed, 170, 10)})`} filter="url(#fb)">
      {[0, 40, 85, 130, 170].map((a) => <path key={a} d={`M 0 0 Q ${60 * Math.cos(a)} ${50 * Math.sin(a + 1)}, ${140 * Math.cos((a * Math.PI) / 180)} ${120 * Math.sin((a * Math.PI) / 180)}`} fill="none" stroke="rgba(40,44,48,0.26)" strokeWidth={3} />)}
    </g>);
  }
  if (kind === "ring") {
    els.push(<ellipse key="ring" cx={900 + dx * 1.3} cy={470 + dy * 1.2} rx={120} ry={96} fill="none" stroke="rgba(36,40,44,0.42)" strokeWidth={16} filter="url(#fb2)" transform={`rotate(${drift(t, seed, 200, 14)} ${900 + dx * 1.3} ${470 + dy * 1.2})`} />);
    els.push(<Thread key="rt" x={1120 + dx * 0.9} y={600 + dy} len={220} rot={20 + drift(t, seed, 210, 12)} w={5} op={0.3} />);
  }
  if (kind === "shower") {
    // aparecen de golpe y se van asentando: la "pimienta"
    const k = interpolate(frame, [6, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    for (let i = 0; i < 90; i++) {
      if (h(seed, 300 + i) > k) continue;
      const x = 300 + h(seed, 310 + i) * 1320 + dx * (0.4 + h(seed, 320 + i));
      const y = 120 + h(seed, 330 + i) * 820 + dy * (0.4 + h(seed, 340 + i)) + t * (6 + 10 * h(seed, 350 + i));
      els.push(<circle key={`s${i}`} cx={x} cy={y} r={2.5 + h(seed, 360 + i) * 5} fill={`rgba(20,22,24,${0.4 + 0.3 * h(seed, 370 + i)})`} filter="url(#fb)" />);
    }
  }
  const curtain = kind === "curtain" ? interpolate(frame, [0, Math.max(30, durationInFrames - 10)], [0.08, 0.42], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill>
      <ReframedVideo src={src} seed={seed} frames={frames} />
      <AbsoluteFill style={{ opacity: inOp }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={2.2} /></filter>
            <filter id="fb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={4} /></filter>
            <linearGradient id="cur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(8,10,12,0.92)" />
              <stop offset="0.75" stopColor="rgba(8,10,12,0.55)" />
              <stop offset="1" stopColor="rgba(8,10,12,0)" />
            </linearGradient>
          </defs>
          {els}
          {kind === "curtain" ? <rect x={0} y={0} width={1920} height={1080 * curtain + 60} fill="url(#cur)" /> : null}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
