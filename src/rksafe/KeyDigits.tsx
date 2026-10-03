// KeyDigits.tsx — LA LLAVE ES UNA LISTA DE NÚMEROS (rkkeyphoto, oct-2026).
//
// Sobre la foto real de la llave (`bg`) se marca el borde dentado (`edge`: [[x1,y1],[x2,y2]] en %):
// cinco posiciones se encienden en orden, de cada una sale un dígito (`digits`) que sube y se acomoda en
// una fila abajo: "3 · 5 · 2 · 6 · 4 = THE KEY". Conceptual (números de ejemplo): no enseña a leer cortes.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, clamp01, rgba } from "./RayStage";
import { WorldBed, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const KeyDigits: React.FC<{
  bg?: string;
  edge?: [[number, number], [number, number]];
  digits?: string[];
  kicker?: string;
  result?: string;
  durationInFrames?: number;
}> = ({ bg, edge = [[30, 45], [70, 45]], digits = ["3", "5", "2", "6", "4"], kicker = "", result = "= THE KEY", durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seq);
  const t = frame / D;
  const [[x1, y1], [x2, y2]] = edge;
  const n = digits.length;
  const pts = digits.map((_, i) => {
    const f = (i + 0.5) / n;
    return [(x1 + (x2 - x1) * f) * 19.2, (y1 + (y2 - y1) * f) * 10.8];
  });
  const lineA = interpolate(t, [0.05, 0.22], [0, 1], ease);
  const rowY = 900;
  const res = clamp01((t - 0.72) / 0.1);
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.1} fx={(x1 + x2) / 2} fy={(y1 + y2) / 2} dim={0.2} durationInFrames={D} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line x1={x1 * 19.2} y1={y1 * 10.8} x2={(x1 + (x2 - x1) * lineA) * 19.2} y2={(y1 + (y2 - y1) * lineA) * 10.8} stroke={V.brassSoft} strokeWidth={4} strokeDasharray="14 10" />
        {pts.map(([px, py], i) => {
          const a = clamp01((t - 0.18 - i * 0.07) / 0.06);
          return <circle key={i} cx={px} cy={py} r={14 + 8 * a} fill={rgba(V.brass, 0.25 * a)} stroke={V.brassSoft} strokeWidth={4} opacity={a} />;
        })}
      </svg>
      {pts.map(([px, py], i) => {
        const a = clamp01((t - 0.2 - i * 0.07) / 0.06);
        const fly = interpolate(t, [0.5 + i * 0.03, 0.66 + i * 0.03], [0, 1], ease);
        const tx = 960 + (i - (n - 1) / 2) * 150;
        const x = px + (tx - px) * fly, y = py - 90 + (rowY - (py - 90)) * fly;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * a})`, opacity: a, width: 104, height: 104, borderRadius: 18, background: "rgba(10,10,12,.82)", border: `4px solid ${V.brassSoft}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, color: V.white, boxShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{digits[i]}</div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: rowY + 70, textAlign: "center", opacity: res, transform: `translateY(${(1 - res) * 16}px)`, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: 3, color: V.brassSoft, textShadow: "0 5px 24px rgba(0,0,0,.95)" }}>{result}</div>
      <Tag kicker={kicker} a={interpolate(t, [0, 0.07], [0, 1], ease)} />
      <div style={{ position: "absolute", right: 60, bottom: 30, fontFamily: F_BODY, fontSize: 22, color: "rgba(255,255,255,.55)" }}>example numbers</div>
    </AbsoluteFill>
  );
};
