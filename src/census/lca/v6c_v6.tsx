// v6c · vuelta 6 de lc01 (P30, P33, P37, P41, P42, P43, P46, P47, P48): piezas nuevas (sólo las usa lc01_planos2).
// - TomasSeco: sub-tomas con CORTE SECO en cuadro entero (nunca fundido cruzado del set consigo mismo: dejaba doble
//   exposición en P43 279,0 y lageos en el cuadro que seguía al fundido: P41 263,0, P42 273,63, P47 318,43).
// - PlacaV6: placa oscura OPACA que entra con resorte de escala (0 → 1) con su contenido ya dibujado desde el cuadro 1
//   y sale encogiéndose (nunca una caja vacía ni un fundido a media opacidad).
// - ContadorV6 / BarrasVidaV6 (P37): el contador de tiendas y las barras «toda la comida / 2 personas» con texto ≥ 46 px.
// - LagoV6 (P41): el lago Superior GRANDE al centro del cielo, mapa + rótulos dibujados desde el cuadro 1.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { F_MONO } from "../hud";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- sub-tomas con corte seco
// cortes[i] = cuadro (del plano) en que empieza tomas[i + 1]
export const TomasSeco: React.FC<{ cortes: number[]; tomas: React.ReactNode[] }> = ({ cortes, tomas }) => {
  const f = useF();
  let i = 0;
  while (i < cortes.length && f >= cortes[i]) i++;
  return <AbsoluteFill>{tomas[i]}</AbsoluteFill>;
};

// ---------------------------------------------------------------- placa opaca con resorte (x = centro, y = borde de arriba)
export const PlacaV6: React.FC<{ x: number; y: number; desde: number; hasta?: number; sale?: number; borde?: string; children: React.ReactNode; pad?: string }> = ({ x, y, desde, hasta = 1e9, sale = 7, borde = AMBAR, children, pad = "14px 34px 16px" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f >= hasta + sale) return null;
  const sIn = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 170, mass: 0.8 } });
  const sOut = interpolate(f, [hasta, hasta + sale], [1, 0], { ...CL, easing: Easing.in(Easing.cubic) });
  const s = sIn * sOut;
  if (s <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${s})`, transformOrigin: "50% 0%",
      background: "#16121c", border: `5px solid ${borde}`, borderRadius: 22, padding: pad, boxShadow: "0 10px 26px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- P37 · contador de tiendas (opaco, resorte)
export const ContadorV6: React.FC<{ x: number; y: number; rotulo: string; valor: string; desde: number; hasta?: number; color?: string; tam?: number }> = ({ x, y, rotulo, valor, desde, hasta, color = AMBAR, tam = 84 }) => (
  <PlacaV6 x={x} y={y} desde={desde} hasta={hasta} borde={color}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: "#f6ecd2" }}>{rotulo}</div>
      <div style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: tam, lineHeight: 1.05, color, fontVariantNumeric: "tabular-nums" }}>{valor}</div>
    </div>
  </PlacaV6>
);

// ---------------------------------------------------------------- P37 · toda la comida de Duluth vs 2 personas (texto 44 px, barras 38 px)
export const BarrasVidaV6: React.FC<{ x: number; y: number; w: number; desde: number; d2: number }> = ({ x, y, w, desde, d2 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const b1 = f < desde ? 0 : spring({ frame: f - desde - 6, fps, config: { damping: 20, stiffness: 60 } });
  const b2 = f < d2 ? 0 : spring({ frame: f - d2, fps, config: { damping: 12, stiffness: 140 } });
  const W = w - 68;
  const late = f < d2 + 20 ? 0 : 0.5 + 0.5 * Math.sin((f - d2 - 20) / 5);
  const rot: React.CSSProperties = { fontFamily: F_HUD, fontWeight: 700, fontSize: 44, letterSpacing: 2, lineHeight: 1.05, whiteSpace: "nowrap" };
  return (
    <PlacaV6 x={x} y={y} desde={desde} pad="12px 30px 18px">
      <div style={{ width: W }}>
        <div style={{ ...rot, color: "#f6ecd2" }}>ALL THE FOOD IN DULUTH</div>
        <div style={{ height: 38, width: W * b1, background: AMBAR, borderRadius: 12, marginTop: 6 }} />
        <div style={{ ...rot, color: "#8fc8ff", marginTop: 10 }}>2 PEOPLE · ONE LIFETIME</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 6, height: 38 }}>
          <div style={{ height: 38, width: Math.max(10, W * 0.04 * b2), background: "#5ab0ff", borderRadius: 10, boxShadow: `0 0 0 ${5 * late}px rgba(90,176,255,0.35)` }} />
          <div style={{ height: 38, flex: 1, marginLeft: 10, borderRadius: 10, border: "4px dashed rgba(246,236,210,0.4)", boxSizing: "border-box" }} />
        </div>
      </div>
    </PlacaV6>
  );
};

// ---------------------------------------------------------------- P41 · el lago Superior (todo dibujado desde el cuadro 1; el contorno brilla al recorrerse)
const SUP: [number, number][] = [[0, 52], [8, 46], [16, 40], [24, 33], [31, 27], [38, 21], [44, 15], [50, 12], [56, 8], [62, 5], [68, 4], [74, 6], [79, 4], [85, 7], [90, 12], [95, 18], [100, 26], [99, 33], [94, 37], [88, 41], [82, 40], [76, 44], [70, 47], [66, 44], [64, 36], [61, 33], [58, 38], [55, 46], [50, 48], [44, 47], [38, 49], [32, 49], [26, 50], [20, 52], [14, 54], [8, 55], [3, 55]];
export const LagoV6: React.FC<{ x: number; y: number; desde: number; hasta?: number }> = ({ x, y, desde, hasta }) => {
  const f = useF();
  const k = 4.1; // mapa 410 × 230
  const pts = SUP.map(([a, b]) => [a * k, b * k]);
  let L = 0; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; L += Math.hypot(q[0] - p[0], q[1] - p[1]); }
  const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L") + " Z";
  const u = interpolate(f, [desde + 2, desde + 40], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const du = pts[0];
  const pulso = 1 + 0.25 * Math.max(0, Math.sin((f - desde) / 5));
  return (
    <PlacaV6 x={x} y={y} desde={desde} hasta={hasta} pad="22px 36px 22px 30px">
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        <svg width={430} height={250} viewBox="-10 -12 430 262" style={{ overflow: "visible" }}>
          <path d={d} fill="#2f6fa8" />
          <path d={d} fill="none" stroke="#bfe4ff" strokeWidth={4} opacity={0.5} strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#e8f6ff" strokeWidth={7} strokeDasharray={`${L * 0.18} ${L}`} strokeDashoffset={-L * u} strokeLinejoin="round" strokeLinecap="round" opacity={u < 1 ? 1 : 0} />
          <circle cx={du[0]} cy={du[1]} r={14 * pulso} fill={AMBAR} stroke="#120f18" strokeWidth={3} />
          <text x={du[0] + 2} y={du[1] + 46} fontFamily={F_HUD} fontWeight={700} fontSize={38} fill={AMBAR}>DULUTH</text>
        </svg>
        <div style={{ fontFamily: F_HUD, fontWeight: 700, lineHeight: 1.12 }}>
          <div style={{ fontSize: 60, letterSpacing: 3, color: "#f6ecd2" }}>LAKE SUPERIOR</div>
          <div style={{ fontSize: 42, color: "#8fd3ff", marginTop: 6 }}>LARGEST FRESHWATER</div>
          <div style={{ fontSize: 42, color: "#8fd3ff" }}>LAKE ON EARTH</div>
          <div style={{ fontSize: 34, letterSpacing: 3, color: "#f6ecd2", marginTop: 6, fontWeight: 600 }}>BY SURFACE AREA</div>
        </div>
      </div>
    </PlacaV6>
  );
};
