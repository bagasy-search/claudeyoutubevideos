// TfbLeakTest — la prueba de llenado como gráfico: silueta del tanque con nervaduras, el agua sube hasta arriba con
// ondas, un reloj barre las horas (0 → `hours`), el papel pegado bajo el parche queda SECO (se prende un check verde).
// Si `fail` es true, aparece una mancha húmeda en el papel y una cruz roja (sirve para mostrar el caso "vuelve a pasar").
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export const TfbLeakTest: React.FC<{ dur: number; hours?: number; fillUntil?: number; label?: string; okLabel?: string; fail?: boolean }> = ({ dur, hours = 24, fillUntil, label, okLabel, fail = false }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const out = lin(f, [dur - 8, dur], [1, 0], EIO), inn = pop(f, fps, 0, 150, 18);
  const fu = fillUntil ?? Math.round(dur * 0.35);
  const lvl = lin(f, [6, fu], [0.04, 0.92], EIO);
  const clock = lin(f, [fu, dur - 30], [0, 1], EIO);
  const h = Math.round(clock * hours);
  const done = pop(f, fps, dur - 28, 240, 12);
  const TW = 420, TH = 560, tx = 560, ty = 250;
  const wave = (k: number) => Math.sin(f / 5 + k) * 6;
  const waterY = ty + TH - (TH - 40) * lvl;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out, background: "radial-gradient(ellipse at 45% 50%, rgba(10,12,16,0.8), rgba(0,0,0,0.92))" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + 0.1 * Math.max(0, inn)})`, transformOrigin: "40% 55%" }}>
        <defs>
          <clipPath id="tfbTankClip"><rect x={tx} y={ty} width={TW} height={TH} rx={60} /></clipPath>
        </defs>
        <rect x={tx} y={ty} width={TW} height={TH} rx={60} fill="#1a1a1d" stroke="#3a3a40" strokeWidth={6} />
        <g clipPath="url(#tfbTankClip)">
          <path d={`M ${tx - 20} ${waterY + wave(0)} Q ${tx + TW * 0.25} ${waterY - 14 + wave(1)} ${tx + TW / 2} ${waterY + wave(2)} T ${tx + TW + 20} ${waterY + wave(3)} L ${tx + TW + 20} ${ty + TH + 20} L ${tx - 20} ${ty + TH + 20} Z`} fill={C.water} opacity={0.55} />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={tx} y={ty + 40 + i * 58} width={TW} height={8} fill="#2c2c32" opacity={0.7} />)}
        </g>
        <rect x={tx + TW / 2 - 90} y={ty - 36} width={180} height={40} rx={10} fill="#222" />
        {/* parche + papel */}
        <rect x={tx + TW / 2 - 50} y={ty + TH * 0.62} width={100} height={46} rx={14} fill="#0f0f10" stroke={C.yellow} strokeWidth={4} />
        <rect x={tx + TW / 2 - 60} y={ty + TH * 0.62 + 60} width={120} height={90} rx={6} fill="#fafaf5" transform={`rotate(-2 ${tx + TW / 2} ${ty + TH * 0.7})`} />
        {fail ? <ellipse cx={tx + TW / 2} cy={ty + TH * 0.62 + 90} rx={34 * clock} ry={22 * clock} fill="#8fb6d6" opacity={0.8} /> : null}
        {/* reloj */}
        <g transform="translate(1340 420)">
          <circle r={150} fill="#fafaf5" stroke="#111" strokeWidth={10} />
          <path d={`M 0 0 L 0 -150 A 150 150 0 ${clock > 0.5 ? 1 : 0} 1 ${Math.sin(clock * Math.PI * 2 * 0.9999) * 150} ${-Math.cos(clock * Math.PI * 2 * 0.9999) * 150} Z`} fill={C.yellow} opacity={0.75} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-130} x2={0} y2={-112} stroke="#111" strokeWidth={6} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-118} stroke={C.red} strokeWidth={9} strokeLinecap="round" transform={`rotate(${clock * 360 * 2})`} />
          <circle r={12} fill="#111" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1340 - 150, width: 300, top: 600, textAlign: "center", fontFamily: F_DISPLAY, fontSize: 96, color: C.white }}>{h} H</div>
      {label ? <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: F_DISPLAY, fontSize: 70, color: C.white, letterSpacing: 2, opacity: lin(f, [2, 10], [0, 1], EO) }}>{label}</div> : null}
      {okLabel && f > dur - 28 ? <div style={{ position: "absolute", left: 1340 - 260, width: 520, top: 760, display: "flex", justifyContent: "center" }}>
        <div style={{ backgroundColor: fail ? C.red : C.green, color: "#fff", fontFamily: F_DISPLAY, fontSize: 60, padding: "6px 30px", borderRadius: 14, transform: `scale(${Math.max(0, done)}) rotate(-3deg)`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>{okLabel}</div>
      </div> : null}
      <div style={{ position: "absolute", left: tx - 30, top: ty + TH + 40, width: TW + 60, textAlign: "center", fontFamily: F_SANS, fontWeight: 900, fontSize: 30, color: C.water, letterSpacing: 3, opacity: lin(f, [6, 14], [0, 1]) }}>{Math.round(lvl * 100)} %</div>
    </AbsoluteFill>
  );
};
