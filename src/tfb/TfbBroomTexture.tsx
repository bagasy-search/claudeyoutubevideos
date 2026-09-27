// TfbBroomTexture — vista CENITAL de un paño de cemento fresco: la escoba cruza y el rayado se DIBUJA en tiempo real
// detrás de sus cerdas (surcos finos, paralelos, con la leve ondulación de la mano). `early` = pasada antes de tiempo:
// surcos desgarrados con grumos (el error). Superficie, granos y brillo hechos por código, frame a frame.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, TFB, clamp, easeInOut, outro, pop } from "./theme";

export const TfbBroomTexture: React.FC<{
  dur: number; passFrom?: number; passFrames?: number; early?: boolean; note?: string; noteAt?: number; lines?: number;
}> = ({ dur, passFrom = 10, passFrames = 70, early = false, note, noteAt = 60, lines = 110 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 8) * interpolate(f, [0, 8], [0, 1], clamp);
  const W = 1920, H = 1080, PX = 260, PY = 150, PW = 1400, PH = 780;
  const rnd = (i: number, s: number) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); };
  const t = interpolate(f, [passFrom, passFrom + passFrames], [0, 1], { ...clamp, easing: easeInOut });
  const bx = PX - 60 + (PW + 120) * t; // posición de la escoba (x del filo de las cerdas)
  const sheen = early ? 1 : interpolate(f, [0, passFrom], [0.55, 0.25], clamp);
  const grooves = Array.from({ length: lines }).map((_, k) => {
    const y0 = PY + 14 + (k * (PH - 28)) / (lines - 1);
    let d = `M${PX},${y0.toFixed(1)}`;
    const end = Math.min(PX + PW, bx - 8);
    for (let xx = PX; xx <= end; xx += 40) {
      const wob = Math.sin(xx * 0.004 + k * 0.7) * 3 + (early ? (rnd(k * 97 + xx, 3) - 0.5) * 9 : (rnd(k * 97 + xx, 3) - 0.5) * 1.2);
      d += ` L${xx.toFixed(1)},${(y0 + wob).toFixed(1)}`;
    }
    const op = early ? 0.9 : 0.28 + rnd(k, 61) * 0.3;
    return <g key={k}><path d={d} stroke={early ? "#3f3a33" : "#57514a"} strokeWidth={early ? 4.5 : 1.3 + rnd(k, 67)} fill="none" opacity={op} strokeLinecap="round" />
      {!early && <path d={d} transform="translate(0 2)" stroke="#d4cfc6" strokeWidth={1} fill="none" opacity={op * 0.8} />}</g>;
  });
  const lumps = early ? Array.from({ length: 70 }).map((_, k) => { const lx = PX + rnd(k, 51) * PW; if (lx > bx - 10) return null;
    return <ellipse key={k} cx={lx} cy={PY + rnd(k, 53) * PH} rx={6 + rnd(k, 57) * 10} ry={4 + rnd(k, 59) * 6} fill="#7a7266" opacity={0.85} />; }) : null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(8,8,8,0.72)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="bt-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="table" tableValues="0 0.22" /></feComponentTransfer></filter>
          <linearGradient id="bt-sheen" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.35 * sheen} /><stop offset="0.5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity={0.18 * sheen} /></linearGradient>
          <clipPath id="bt-slab"><rect x={PX} y={PY} width={PW} height={PH} rx={10} /></clipPath>
        </defs>
        <rect x={PX - 18} y={PY - 18} width={PW + 36} height={PH + 36} rx={16} fill="#6f6a62" />
        <g clipPath="url(#bt-slab)">
          <rect x={PX} y={PY} width={PW} height={PH} fill="#9b958a" />
          <rect x={PX} y={PY} width={PW} height={PH} filter="url(#bt-noise)" />
          {Array.from({ length: 260 }).map((_, k) => <circle key={k} cx={PX + rnd(k, 5) * PW} cy={PY + rnd(k, 9) * PH} r={1 + rnd(k, 13) * 1.8} fill={rnd(k, 17) > 0.5 ? "#7f796f" : "#b9b3a8"} />)}
          {grooves}{lumps}
          <rect x={PX} y={PY} width={Math.max(0, bx - PX)} height={PH} fill="#000" opacity={early ? 0 : 0.05} />
          <rect x={Math.max(PX, bx)} y={PY} width={PW} height={PH} fill="url(#bt-sheen)" />
        </g>
        {/* la escoba: cabezal de madera + cerdas que se doblan hacia atrás */}
        {t > 0 && t < 1 && (
          <g transform={`translate(${bx} ${PY - 40})`}>
            {Array.from({ length: 90 }).map((_, k) => { const yy = 10 + k * ((PH + 60) / 90); return <line key={k} x1={0} y1={yy} x2={-26 - rnd(k, 71) * 8} y2={yy + 3} stroke="#2b2b2b" strokeWidth={3} strokeLinecap="round" />; })}
            <rect x={-6} y={0} width={40} height={PH + 80} rx={8} fill="#b07a45" stroke="#7a4f27" strokeWidth={3} />
            <rect x={36} y={(PH + 80) / 2 - 16} width={260} height={32} rx={14} fill="#c99a5b" stroke="#8a5a2b" strokeWidth={3} />
          </g>
        )}
      </svg>
      {note && (() => { const p = pop(f, fps, noteAt, 12, 0.6); return (
        <div style={{ position: "absolute", left: PX + 30, top: PY + PH + 34, opacity: p, transform: `rotate(-2deg) translateY(${(1 - p) * 20}px)`,
          fontFamily: CAVEAT, fontWeight: 700, fontSize: 64, color: early ? TFB.red : TFB.yellow, textShadow: "0 3px 0 rgba(0,0,0,0.6)" }}>{note}</div>); })()}
    </AbsoluteFill>
  );
};
