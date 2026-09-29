// Grade — capa de acabado "documental": grano de película, viñeta, parpadeo leve y polvo.
// Va SIEMPRE arriba de todo (unifica archivo real, IA y stock moderno en un mismo look).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { rnd } from "./theme";

// grano precalculado (8 texturas de ruido que rotan): el feTurbulence a pantalla completa era carísimo en el farm (swangle)
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  const f = useCurrentFrame();
  const k = (f * 5) % 8;
  const ox = -((f * 37) % 960), oy = -((f * 53) % 540);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay", overflow: "hidden" }}>
      {[0, 1, 2].map((i) => [0, 1, 2].map((j) => (
        <Img key={i + "_" + j} src={staticFile(`yc/grain/g${k}.png`)} style={{ position: "absolute", left: ox + i * 960, top: oy + j * 540, width: 960, height: 540 }} />
      )))}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,${strength}) 100%)` }} />
);

export const Dust: React.FC<{ n?: number }> = ({ n = 5 }) => {
  const f = useCurrentFrame();
  const els = [] as React.ReactNode[];
  for (let i = 0; i < n; i++) {
    const s = Math.floor(f / 3) * 13 + i * 7;
    if (rnd(s) > 0.35) continue;
    const x = rnd(s + 1) * 1920, y = rnd(s + 2) * 1080, r = 1 + rnd(s + 3) * 2.5;
    const hair = rnd(s + 4) > 0.8;
    els.push(hair
      ? <div key={i} style={{ position: "absolute", left: x, top: y, width: 1.5, height: 30 + rnd(s + 5) * 60, background: "rgba(255,255,255,0.18)", transform: `rotate(${rnd(s + 6) * 180}deg)` }} />
      : <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "rgba(255,255,255,0.35)" }} />);
  }
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{els}</AbsoluteFill>;
};

export const Flicker: React.FC<{ amount?: number }> = ({ amount = 0.025 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", background: "#000", opacity: rnd(f) * amount }} />;
};

export const Grade: React.FC = () => (
  <>
    <Vignette />
    <Grain />
    <Dust />
    <Flicker />
  </>
);
