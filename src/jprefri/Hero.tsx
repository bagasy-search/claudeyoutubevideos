// jprefri · heroes en capas (v2): la especificacion viene de edl.json; cada beat (chip, anillo, nota) cae en la palabra dicha (words.json).
// 1) cama = foto borrosa y oscura; 2) impresion con borde blanco (la imagen completa, sin recortar); 3) anillo rojo dibujado; 4) chip y nota.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

export type HeroSpec = {
  name: string; chip: string; chipAt: number; ring: boolean; ringAt: number;
  note: { text: string; at: number } | null; print: string; bed: string;
};

export const Hero: React.FC<{ h: HeroSpec; d: number }> = ({ h, d }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const drift = interpolate(f, [0, d], [1.0, 1.05], { extrapolateRight: "clamp" });
  const enter = interpolate(f, [0, 8], [0.92, 1], { extrapolateRight: "clamp" });
  const fadeIn = (at: number) => interpolate(t, [at, at + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringDraw = interpolate(t, [h.ringAt, h.ringAt + 0.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipOp = fadeIn(h.chipAt);
  const noteOp = h.note ? fadeIn(h.note.at) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <AbsoluteFill style={{ transform: `scale(${1.1 * drift})`, filter: "blur(16px) brightness(0.55)" }}>
        <Img src={staticFile(`img/jprefri/${h.bed}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 700, transform: `scale(${enter * drift})`,
        opacity: chipOp, background: "#fff", padding: 14, boxShadow: "0 18px 50px rgba(0,0,0,.6)", boxSizing: "border-box" }}>
        <Img src={staticFile(`img/jprefri/${h.print}.png`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      {h.ring ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={960} cy={470} rx={330} ry={210} fill="none" stroke="#C8102E" strokeWidth={14}
            strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * ringDraw} transform="rotate(-4 960 470)" />
        </svg>
      ) : null}
      {h.note ? (
        <div style={{ position: "absolute", right: 120, top: 150, background: "#fff7e6", color: "#222", fontFamily: "Arial, sans-serif",
          fontWeight: 700, fontSize: 40, padding: "18px 26px", transform: "rotate(-3deg)", boxShadow: "0 8px 20px rgba(0,0,0,.35)", opacity: noteOp }}>{h.note.text}</div>
      ) : null}
      <div style={{ position: "absolute", left: 70, bottom: 80, background: "#C8102E", color: "#fff", fontFamily: "Arial Black, Arial, sans-serif",
        fontWeight: 900, fontSize: 52, padding: "14px 26px", borderRadius: 8, opacity: chipOp, boxShadow: "0 6px 18px rgba(0,0,0,.45)" }}>{h.chip}</div>
    </AbsoluteFill>
  );
};
