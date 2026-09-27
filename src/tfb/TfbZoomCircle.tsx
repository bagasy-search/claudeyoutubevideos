// TfbZoomCircle — la gramática de la miniatura hecha movimiento: un círculo de zoom con anillo AMARILLO que muestra
// ampliado (en vivo, cuadro a cuadro) el punto del footage que importa, y una flecha ROJA que lo señala.
// El objetivo se SIGUE con keyframes (x,y en fracción del cuadro), el círculo entra con resorte y la flecha se "dispara".
// Uso: <TfbZoomCircle target={[{f:0,x:.46,y:.55},{f:60,x:.48,y:.52}]} center={{x:.78,y:.62}}>{footage}</TfbZoomCircle>
// `children` es el footage (se dibuja 2 veces: de fondo y dentro del círculo). Sin texto quemado; `label` opcional (≤3 palabras).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_DISPLAY, EASE_IN, EASE_OUT, clamp } from "./theme";

type K = { f: number; x: number; y: number };
export type TfbZoomCircleProps = {
  children: React.ReactNode;
  target: K[];                 // punto a ampliar (fracción 0-1 del cuadro), keyframes en cuadros relativos
  center?: { x: number; y: number }; // centro del círculo (fracción). Default: lado opuesto al objetivo
  radius?: number;             // px
  zoom?: number;
  inAt?: number;               // cuadro en que aparece
  outAt?: number;              // cuadro en que se va (default: nunca)
  arrow?: boolean;
  label?: string;
  dimBackground?: number;      // 0-1, oscurece un poco el fondo para que el círculo mande
  hideBase?: boolean;          // si el footage de fondo ya lo dibuja otra capa
};

const at = (ks: K[], f: number) => {
  if (f <= ks[0].f) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) if (f < ks[i + 1].f) {
    const p = interpolate(f, [ks[i].f, ks[i + 1].f], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    return { f, x: ks[i].x + (ks[i + 1].x - ks[i].x) * p, y: ks[i].y + (ks[i + 1].y - ks[i].y) * p };
  }
  return ks[ks.length - 1];
};

export const TfbZoomCircle: React.FC<TfbZoomCircleProps> = ({ children, target, center, radius = 250, zoom = 2.8, inAt = 0, outAt, arrow = true, label, dimBackground = 0.18, hideBase }) => {
  const f = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = at(target, f);
  const c = center || { x: t.x < 0.5 ? 0.76 : 0.24, y: 0.5 };
  const sIn = spring({ frame: f - inAt, fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
  const sOut = outAt == null ? 0 : interpolate(f, [outAt - 8, outAt], [0, 1], { ...clamp, easing: EASE_OUT });
  const s = Math.max(0, sIn * (1 - sOut));
  const R = radius * s;
  const cx = c.x * W, cy = c.y * H, tx = t.x * W, ty = t.y * H;
  // flecha: de la orilla del círculo hacia el objetivo, se dispara después del círculo
  const ang = Math.atan2(ty - cy, tx - cx);
  const pA = interpolate(f - inAt, [6, 16], [0, 1], { ...clamp, easing: EASE_IN }) * (1 - sOut);
  const start = { x: cx + Math.cos(ang) * (radius + 26), y: cy + Math.sin(ang) * (radius + 26) };
  const dist = Math.hypot(tx - start.x, ty - start.y) - 38;
  const len = Math.max(0, dist) * pA;
  const bob = Math.sin((f - inAt) / 6) * 4 * pA;
  const lab = interpolate(f - inAt, [12, 22], [0, 1], { ...clamp, easing: EASE_IN }) * (1 - sOut);
  return (
    <AbsoluteFill>
      {!hideBase && <AbsoluteFill>{children}</AbsoluteFill>}
      {dimBackground > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${dimBackground * s})` }} />}
      {/* marca pequeña sobre el objetivo */}
      {s > 0.01 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={tx} cy={ty} r={34 + (1 - pA) * 30} fill="none" stroke={TFB.yellow} strokeWidth={6} opacity={pA * 0.95} />
          {arrow && len > 4 && (
            <g transform={`translate(${start.x + Math.cos(ang) * bob},${start.y + Math.sin(ang) * bob}) rotate(${(ang * 180) / Math.PI})`} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.45))" }}>
              <rect x={0} y={-17} width={Math.max(0, len - 58)} height={34} rx={5} fill={TFB.red} stroke="#fff" strokeWidth={3} />
              <polygon points={`${len - 70},-44 ${len},0 ${len - 70},44`} fill={TFB.red} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
            </g>
          )}
        </svg>
      )}
      {s > 0.01 && (
        <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", border: `${Math.max(2, 12 * s)}px solid ${TFB.yellow}`, boxShadow: "0 18px 50px rgba(0,0,0,.55), inset 0 0 40px rgba(0,0,0,.35)", boxSizing: "border-box", background: "#000" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${R - tx * zoom * s}px, ${R - ty * zoom * s}px) scale(${zoom * s})` }}>{children}</div>
        </div>
      )}
      {label && lab > 0.01 && (
        <div style={{ position: "absolute", left: cx - 300, width: 600, top: cy + radius + 22, textAlign: "center", opacity: lab, transform: `translateY(${(1 - lab) * 20}px)` }}>
          <span style={{ fontFamily: F_DISPLAY, fontSize: 58, color: TFB.ink, background: TFB.yellow, padding: "4px 22px 8px", borderRadius: 10, letterSpacing: 1, boxShadow: TFB.shadow }}>{label}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
