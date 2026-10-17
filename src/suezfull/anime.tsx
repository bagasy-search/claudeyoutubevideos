// Escenas anime (ilustraciones agnes en capas) animadas en código: el fondo con empuje de cámara,
// el personaje recortado con su propio paralaje, respiración leve y sombra de contacto; arena encima.
import React from "react";
import { AbsoluteFill, Img, interpolate, Easing } from "remotion";
import { SandDrift, clampX } from "./scenes";

import { sf } from "./sf";

type Char = { src: string; x: number; bottom: number; h: number; tIn?: number; from?: number; shadow?: number };
const ease = Easing.bezier(0.45, 0, 0.25, 1);

export const AnimeScene: React.FC<{ t: number; f: number; t0: number; t1: number; bg: string; chars: Char[]; z0?: number; z1?: number; px?: number; py?: number; sand?: string; children?: React.ReactNode }> = ({ t, f, t0, t1, bg, chars, z0 = 1.02, z1 = 1.12, px = 60, py = 0, sand = "#fff1d0", children }) => {
  const k = interpolate(t, [t0, t1], [0, 1], { ...clampX, easing: ease });
  const z = z0 + (z1 - z0) * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${-px * k}px,${-py * k}px) scale(${z})`, transformOrigin: "50% 55%" }}>
        <Img src={sf(`suez/anime/${bg}.jpg`)} style={{ position: "absolute", left: -64, top: -35, width: 2048, height: 1150 }} />
      </AbsoluteFill>
      {children}
      {chars.map((c, i) => {
        const tin = c.tIn ?? t0;
        const kin = interpolate(t, [tin, tin + 0.45], [0, 1], { ...clampX, easing: Easing.out(Easing.cubic) });
        const slide = (c.from ?? 0) * (1 - kin);
        const breathe = 1 + 0.006 * Math.sin(f / 13 + i);
        const zc = 1 + (z1 - z0) * 1.6 * k; // el primer plano se acerca más rápido que el fondo
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${-px * 1.9 * k + slide}px,${-py * 1.5 * k}px) scale(${zc})`, transformOrigin: `${c.x}px ${1080 - c.bottom}px`, opacity: kin }}>
            <div style={{ position: "absolute", left: c.x - c.h * 0.55, top: 1080 - c.bottom - c.h * 0.035, width: c.h * 1.1, height: c.h * 0.07, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(40,20,5,.55), rgba(40,20,5,0) 70%)", opacity: c.shadow ?? 1 }} />
            <Img src={sf(`suez/anime/${c.src}.png`)} style={{ position: "absolute", left: c.x, top: 1080 - c.bottom, height: c.h, transform: `translate(-50%,-100%) scaleY(${breathe})`, transformOrigin: "50% 100%", filter: "drop-shadow(0 0 1px rgba(255,240,210,.6))" }} />
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><SandDrift f={f} n={55} color={sand} y0={560} y1={1080} op={0.4} /></svg>
    </AbsoluteFill>
  );
};

export const AnimeDawn: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <AnimeScene t={t} f={f} t0={0} t1={1.5} bg="bg_dawn" z0={1.0} z1={1.08} px={40} chars={[{ src: "ch_pharaoh_dawn", x: 470, bottom: 40, h: 900 }]} sand="#ffe3b8" />
);
export const AnimeNecho: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <AnimeScene t={t} f={f} t0={5.8} t1={8.95} bg="bg_necho" z0={1.03} z1={1.14} px={70} chars={[{ src: "ch_necho", x: 1600, bottom: 10, h: 660, tIn: 6.2, from: 160 }]} />
);
export const AnimeDarius: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <AnimeScene t={t} f={f} t0={8.8} t1={12.0} bg="bg_darius" z0={1.04} z1={1.13} px={-60} chars={[{ src: "ch_darius", x: 400, bottom: 10, h: 950, tIn: 9.0, from: -160 }]} sand="#ffe6bf" />
);
export const AnimeNapoleon: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <AnimeScene t={t} f={f} t0={11.7} t1={17.2} bg="bg_sphinx" z0={1.02} z1={1.12} px={60} chars={[{ src: "ch_napoleon", x: 1400, bottom: 20, h: 880, tIn: 12.5, from: 140 }]} sand="#ffd9a8" />
);
export const AnimeSteam: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <AnimeScene t={t} f={f} t0={16.9} t1={19.4} bg="bg_steam" z0={1.02} z1={1.12} px={-50} chars={[{ src: "ch_lesseps", x: 330, bottom: 10, h: 940, tIn: 17.95, from: -150 }]} sand="#e9c9a0">
    {/* humo extra que sube de las chimeneas del fondo */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const k = ((f / 70 + i / 12) % 1);
        const x0 = [520, 960, 1480][i % 3];
        return <circle key={i} cx={x0 - k * 240} cy={260 - k * 300} r={40 + k * 140} fill="#2e2622" opacity={0.45 * (1 - k)} style={{ filter: `blur(${10 + k * 24}px)` }} />;
      })}
    </svg>
  </AnimeScene>
);
