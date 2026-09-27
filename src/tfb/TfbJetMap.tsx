// TfbJetMap — los agujeritos de abajo del borde vistos desde arriba (un anillo en perspectiva): se iluminan UNO POR UNO;
// los libres largan un chorrito (agua animada), los tapados se marcan con costra y una cruz roja. Opcional: fase "destapar"
// (a partir de `clearAt` los tapados se destapan en orden). Fondo = footage desenfocado. Rótulos por props (≤2 palabras).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_SANS, EASE_IN, clamp } from "./theme";

export type TfbJetMapProps = {
  children?: React.ReactNode;
  n?: number;                 // cantidad de agujeritos del anillo
  blocked: number[];          // índices tapados
  step?: number;              // cuadros entre agujero y agujero
  startAt?: number;
  clearAt?: number | null;    // desde acá se destapan los tapados, uno por uno
  legendFree?: string; legendBlocked?: string;
  exitAt?: number;
};

export const TfbJetMap: React.FC<TfbJetMapProps> = ({ children, n = 16, blocked, step = 5, startAt = 10, clearAt = null, legendFree = "LIBRE", legendBlocked = "TAPADO", exitAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f, fps, config: { damping: 16, stiffness: 130 } });
  const x = exitAt == null ? 0 : interpolate(f, [exitAt - 10, exitAt], [0, 1], clamp);
  const CX = 960, CY = 560, RX = 560, RY = 250;
  const order = Array.from({ length: n }, (_, i) => i);
  const clearOrder = blocked.slice();
  return (
    <AbsoluteFill style={{ opacity: e * (1 - x) }}>
      {children && <AbsoluteFill style={{ filter: "blur(16px) brightness(0.42)", transform: "scale(1.08)" }}>{children}</AbsoluteFill>}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* taza vista desde arriba: loza + borde */}
        <ellipse cx={CX} cy={CY + 20} rx={RX + 70} ry={RY + 50} fill={TFB.porcelain} opacity={0.96} />
        <ellipse cx={CX} cy={CY + 28} rx={RX - 40} ry={RY - 30} fill="#c9d3da" />
        <ellipse cx={CX} cy={CY + 60} rx={RX - 180} ry={RY - 110} fill={TFB.water} opacity={0.85} />
        <ellipse cx={CX} cy={CY + 20} rx={RX + 70} ry={RY + 50} fill="none" stroke="#fff" strokeWidth={6} />
        {order.map((i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const px = CX + Math.cos(a) * RX, py = CY + Math.sin(a) * RY;
          const on = interpolate(f, [startAt + i * step, startAt + i * step + 6], [0, 1], { ...clamp, easing: EASE_IN });
          const isB = blocked.includes(i);
          const cleared = isB && clearAt != null ? interpolate(f, [clearAt + clearOrder.indexOf(i) * step, clearAt + clearOrder.indexOf(i) * step + 8], [0, 1], clamp) : 0;
          const free = !isB || cleared > 0.5;
          const drop = free && on > 0.9 ? ((f * 4 + i * 17) % 40) / 40 : -1;
          const k = 1 + (1 - on) * 0.8;
          return (
            <g key={i} opacity={Math.max(0.25, on)}>
              <circle cx={px} cy={py} r={20 * k} fill={free ? "#0b1118" : TFB.crust} stroke={free ? TFB.ok : TFB.red} strokeWidth={6} />
              {free && drop >= 0 && <path d={`M ${px} ${py + 18} q ${(CX - px) * 0.08} ${40 + drop * 60} ${(CX - px) * 0.12} ${60 + drop * 90}`} stroke={TFB.water} strokeWidth={7} fill="none" strokeLinecap="round" opacity={1 - drop} />}
              {!free && on > 0.5 && (
                <g stroke={TFB.red} strokeWidth={7} strokeLinecap="round" opacity={on * (1 - cleared)}>
                  <line x1={px - 18} y1={py - 18} x2={px + 18} y2={py + 18} /><line x1={px + 18} y1={py - 18} x2={px - 18} y2={py + 18} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", gap: 60, fontFamily: F_SANS, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: 3 }}>
        <span><span style={{ display: "inline-block", width: 30, height: 30, borderRadius: 15, border: `6px solid ${TFB.ok}`, background: "#0b1118", verticalAlign: -4, marginRight: 14 }} />{legendFree}</span>
        <span><span style={{ display: "inline-block", width: 30, height: 30, borderRadius: 15, border: `6px solid ${TFB.red}`, background: TFB.crust, verticalAlign: -4, marginRight: 14 }} />{legendBlocked}</span>
      </div>
    </AbsoluteFill>
  );
};
