// RollingCodeWaves.tsx — CÓDIGO FIJO contra CÓDIGO ROTATIVO (canal Ray Kessler, rkremote).
//
// Cada "click" del control dispara ondas de radio que cruzan la pantalla hasta el receptor del motor.
// Debajo se apila el código que viajó en ese click:
//   · FIXED   — el MISMO código, click tras click. Las filas idénticas se marcan en rojo: "repeatable".
//   · ROLLING — un código NUEVO en cada click; el anterior se tacha y se apaga: "never good again".
// `mode="both"` parte la pantalla y corre los dos lados en paralelo (la comparación que se transforma).
// ⛔ Encuadre DEFENSIVO: explica POR QUÉ uno es débil; no muestra ningún aparato ni técnica.
// ⛔ Los clicks se reparten como FRACCIÓN de la duración; los códigos salen de un hash determinista.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, rnd, PhotoBed, Keyring } from "./RayStage";

const bits = (seed: number, n = 12) => Array.from({ length: n }, (_, i) => (rnd(seed * 31 + i * 7) < 0.5 ? "0" : "1")).join("");

const Lado: React.FC<{
  x: number; w: number; tipo: "fixed" | "rolling"; t: number; clicks: number; frame: number; label: string; sub: string;
}> = ({ x, w, tipo, t, clicks, frame, label, sub }) => {
  const c0 = 0.14, c1 = 0.8;
  const tClick = (i: number) => c0 + (i / Math.max(1, clicks - 1)) * (c1 - c0);
  const hechos = Array.from({ length: clicks }, (_, i) => i).filter((i) => t >= tClick(i));
  const color = tipo === "fixed" ? V.danger : V.brass;
  const fijo = bits(7);
  const cab = clamp01(interpolate(t, [0, 0.08], [0, 1]));
  const remX = x + 90, remY = 330, rxX = x + w - 150, rxY = 330;
  return (
    <>
      <div style={{ position: "absolute", left: x + 40, top: 150, opacity: cab }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: 2, color }}>{label}</div>
        <div style={{ fontFamily: F_BODY, fontSize: 30, color: V.bone, marginTop: 2 }}>{sub}</div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {/* control */}
        <g opacity={cab} transform={`translate(${remX} ${remY})`}>
          <rect x="-34" y="-58" width="68" height="116" rx="14" fill={tipo === "fixed" ? "#8E8E94" : "#2E2E33"} stroke={V.bone} strokeWidth="3" />
          <rect x="-20" y="-40" width="40" height="30" rx="7" fill={hechos.length && frame % 30 < 8 ? color : "#4A4A50"} />
          <circle cx="0" cy="36" r="5" fill={V.danger} />
        </g>
        {/* receptor (el motor) */}
        <g opacity={cab} transform={`translate(${rxX} ${rxY})`}>
          <rect x="-70" y="-44" width="140" height="88" rx="16" fill="#BDB5A3" stroke="#6F6A5E" strokeWidth="3" />
          <circle cx="44" cy="-18" r="8" fill={hechos.length ? V.brassSoft : "#3A3228"} />
          <path d="M 60 40 C 70 70, 64 90, 78 120" stroke="#E7E1D0" strokeWidth="3" fill="none" />
        </g>
        {/* ondas del click más reciente */}
        {hechos.length ? (() => {
          const i = hechos[hechos.length - 1];
          const p = clamp01((t - tClick(i)) / 0.07);
          return [0, 1, 2].map((k) => {
            const q = clamp01(p * 1.3 - k * 0.15);
            const xx = interpolate(q, [0, 1], [remX + 50, rxX - 80]);
            return q > 0 && q < 1 ? <path key={k} d={`M ${xx} ${remY - 40} Q ${xx + 30} ${remY} ${xx} ${remY + 40}`} stroke={rgba(color, 1 - q)} strokeWidth="6" fill="none" /> : null;
          });
        })() : null}
      </svg>
      {/* la pila de códigos */}
      <div style={{ position: "absolute", left: x + 40, top: 460, width: w - 80 }}>
        {hechos.slice(-5).map((i, k, arr) => {
          const nuevo = k === arr.length - 1;
          const a = clamp01((t - tClick(i)) / 0.05);
          const codigo = tipo === "fixed" ? fijo : bits(100 + i * 13);
          const viejo = tipo === "rolling" && !nuevo;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 20, marginBottom: 12, opacity: a * (viejo ? 0.42 : 1),
              transform: `translateY(${(1 - a) * 20}px)`,
            }}>
              <div style={{ fontFamily: F_DISPLAY, fontSize: 30, color: V.bone, width: 120 }}>CLICK {i + 1}</div>
              <div style={{
                position: "relative", fontFamily: "monospace", fontWeight: 700, fontSize: 44, letterSpacing: 6,
                color: tipo === "fixed" ? (hechos.length > 1 ? V.dangerSoft : V.white) : nuevo ? V.brassSoft : V.bone,
                padding: "4px 14px", borderRadius: 6, background: rgba(V.ink0, 0.6),
                border: `2px solid ${tipo === "fixed" && hechos.length > 1 ? rgba(V.danger, 0.8) : "transparent"}`,
              }}>
                {codigo}
                {viejo ? <div style={{ position: "absolute", left: 8, right: 8, top: "50%", height: 4, background: V.bone }} /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const RollingCodeWaves: React.FC<{
  mode?: "fixed" | "rolling" | "both";
  kicker?: string;
  verdict?: string;
  clicks?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({
  mode = "both",
  kicker = "WHAT THE REMOTE SAYS",
  verdict = "",
  clicks = 4,
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const vA = clamp01(interpolate(t, [0.84, 0.92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const kA = clamp01(interpolate(t, [0, 0.06], [0, 1]));
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.84} />
      <div style={{ position: "absolute", left: 96, top: 70, opacity: kA, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
      {mode === "both" ? (
        <>
          <Lado x={40} w={900} tipo="fixed" t={t} clicks={clicks} frame={frame} label="FIXED CODE" sub="Same every click" />
          <div style={{ position: "absolute", left: 958, top: 150, width: 4, height: 780, background: rgba(V.bone, 0.25) }} />
          <Lado x={980} w={900} tipo="rolling" t={t} clicks={clicks} frame={frame} label="ROLLING CODE" sub="New every click" />
        </>
      ) : (
        <Lado x={120} w={1680} tipo={mode} t={t} clicks={clicks + 1} frame={frame}
          label={mode === "fixed" ? "FIXED CODE" : "ROLLING CODE"} sub={mode === "fixed" ? "Click. Same code. Click. Same code." : "Click. New code. The old one is dead."} />
      )}
      {verdict ? (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: vA,
          transform: `translateY(${(1 - vA) * 20}px)`, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, color: V.white,
          textShadow: "0 6px 26px rgba(0,0,0,.9)",
        }}>{verdict}</div>
      ) : null}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
