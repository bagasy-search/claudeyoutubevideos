// ElMercuryLadder — la cadena alimentaria sobre una regla de medir pescado (tabla de madera del muelle): de los chicos
// a los grandes predadores, cada pez entra y suma gotitas de mercurio; los de arriba quedan marcados "go easy".
// Props: fish [{name, len (0..1 del ancho), drops}], every, title, flagFrom (índice desde el que se marcan).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EL, MARKER, STENCIL, dockBg } from "./ElTheme";
import { Stamp, ease } from "./ElParts";

const Fish: React.FC<{ w: number; h: number; color: string }> = ({ w, h, color }) => (
  <svg width={w} height={h} viewBox="0 0 300 96" preserveAspectRatio="none"><path d="M10 48 C 60 6, 190 4, 240 40 L 292 8 L 280 48 L 292 88 L 240 56 C 190 92, 60 90, 10 48 Z" fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth={4} /><circle cx={48} cy={42} r={6} fill="#111" /></svg>
);
export const ElMercuryLadder: React.FC<{ fish: { name: string; len: number; drops: number }[]; every?: number; title?: string; flagFrom?: number }> = ({ fish, every = 26, title = "mercury builds up the food chain", flagFrom = 99 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const rowH = Math.min(150, 780 / fish.length);
  return (
    <AbsoluteFill style={{ ...dockBg() }}>
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 52, color: EL.white, textShadow: "0 3px 10px rgba(0,0,0,0.5)", textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 140, height: 6, background: "repeating-linear-gradient(90deg, #f4e9c8 0 2px, transparent 2px 40px)" }} />
      {fish.map((x, i) => {
        const at = 10 + i * every; const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 120 } });
        const y = 170 + i * rowH; const w = 200 + x.len * 560; const fh = Math.min(w * 0.32, rowH * 0.8); const flag = i >= flagFrom;
        return (
          <div key={i} style={{ position: "absolute", left: 120, top: y, width: 1680, height: rowH, opacity: interpolate(f, [at, at + 6], [0, 1], ease) }}>
            <div style={{ position: "absolute", left: 0, top: (rowH - fh) / 2, transform: `translateX(${(1 - s) * -600}px)` }}><Fish w={w} h={fh} color={flag ? "#7a8f9c" : "#9fb9c6"} /></div>
            <div style={{ position: "absolute", left: w + 40, top: rowH / 2 - 34, fontFamily: MARKER, fontSize: 52, color: EL.white, textShadow: "0 2px 6px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{x.name}</div>
            <div style={{ position: "absolute", right: 260, top: rowH / 2 - 22, display: "flex", gap: 10 }}>
              {Array.from({ length: x.drops }).map((_, d) => <div key={d} style={{ width: 34, height: 44, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", transform: `scale(${interpolate(f, [at + 8 + d * 3, at + 12 + d * 3], [0, 1], ease)})`, background: "radial-gradient(circle at 35% 30%, #ffffff, #b8c2c8 55%, #7d8a92)", boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }} />)}
            </div>
            {flag ? <div style={{ position: "absolute", right: 0, top: rowH / 2 - 34 }}><Stamp text="go easy" at={at + 14} size={44} color={EL.red} rot={-5} style={{ background: "rgba(255,255,255,0.9)", mixBlendMode: "normal" }} /></div> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
