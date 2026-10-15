// SceneCallout.tsx — EL DATO DENTRO DE LA ESCENA (canal Ray Kessler, oct-2026).
//
// Reemplaza al "número + etiqueta sobre negro": la FOTO/CLIP real del momento (`bg`) llena el cuadro con
// empuje de cámara hacia el punto (`at`, en %); un anillo de luz late sobre el objeto real, una línea
// guía lleva a la etiqueta (`label` grande + `sub`), y opcionalmente un SELLO (`stamp`) cae al final.
// `steps` (≤4) agrega chips numerados que se encienden en orden sobre la escena (1 · 2 · 3).
// `color`: brass (dato), danger (alerta), ok (bien hecho).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, clamp01 } from "./RayStage";
import { WorldBed, Pulse, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const SceneCallout: React.FC<{
  bg?: string;
  at?: [number, number];
  kicker?: string;
  label?: string;
  sub?: string;
  stamp?: string;
  color?: "brass" | "danger" | "ok";
  steps?: string[];
  bed?: string;
  durationInFrames?: number;
}> = ({ bg, at = [50, 50], kicker = "", label = "", sub = "", stamp = "", color = "brass", steps = [], durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const col = color === "danger" ? V.dangerSoft : color === "ok" ? V.ok : V.brassSoft;
  const ring = interpolate(t, [0.06, 0.2], [0, 1], ease);
  const line = interpolate(t, [0.16, 0.32], [0, 1], ease);
  const lab = interpolate(t, [0.26, 0.4], [0, 1], ease);
  const ax = at[0] * 19.2, ay = at[1] * 10.8;
  // la etiqueta va al lado con más aire
  const izq = at[0] > 55;
  const lx = izq ? Math.max(120, ax - 760) : Math.min(1920 - 760, ax + 200);
  const ly = Math.min(Math.max(ay - 150, 220), 760);
  const ex = izq ? lx + 640 : lx, ey = ly + 60;
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.16} fx={at[0]} fy={at[1]} dim={0.12} durationInFrames={D} />
      <Pulse x={at[0]} y={at[1]} color={col} t={ring} r={150} on={ring} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line x1={ax} y1={ay} x2={ax + (ex - ax) * line} y2={ay + (ey - ay) * line} stroke={col} strokeWidth={4} />
        <circle cx={ax} cy={ay} r={9} fill={col} opacity={ring} />
      </svg>
      {label ? (
        <div style={{ position: "absolute", left: lx, top: ly, width: 640, opacity: lab, transform: `translateY(${(1 - lab) * 18}px)`, textAlign: izq ? "right" : "left" }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1.02, color: V.white, textShadow: "0 5px 24px rgba(0,0,0,.95)" }}>{label}</div>
          {sub ? <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 36, color: col, marginTop: 10, textShadow: "0 3px 16px rgba(0,0,0,.95)" }}>{sub}</div> : null}
        </div>
      ) : null}
      {steps.length ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", gap: 22 }}>
          {steps.map((s, i) => {
            const a = clamp01((t - 0.36 - i * (0.4 / steps.length)) / 0.08);
            return (
              <div key={i} style={{ opacity: 0.25 + 0.75 * a, transform: `scale(${0.9 + 0.1 * a})`, display: "flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 40, background: "rgba(10,10,12,.72)", border: `3px solid ${a > 0.5 ? col : "rgba(255,255,255,.25)"}` }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, color: col }}>{i + 1}</div>
                <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 32, color: V.white }}>{s}</div>
              </div>
            );
          })}
        </div>
      ) : null}
      <Tag kicker={kicker} a={interpolate(t, [0, 0.07], [0, 1], ease)} />
      {stamp ? <Stamp text={stamp} color={col} p={clamp01((t - 0.7) / 0.12)} x={50} y={steps.length ? 30 : 76} size={92} rot={-6} /> : null}
    </AbsoluteFill>
  );
};
