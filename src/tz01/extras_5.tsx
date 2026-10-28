// tz01 · vuelta 3 (28-oct): primeros términos de espaldas para los contraplanos de Vaishali y la chapa de datos del lavadero.
// Pantalla = coordenadas del cuadro 1920×1080. Sin filtros CSS (nada de blur): borde nítido.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";

const TINTA = "#221c18";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------- el monje joven de espaldas en primer término: calva con brillo, oreja, túnica naranja cruzada al hombro ----------
export const HombroMonje: React.FC<{ x: number; y: number; r?: number; lado?: 1 | -1; inclina?: number }> = ({ x, y, r = 240, lado = 1, inclina = 0 }) => {
  const f = useF();
  const dy = 2 * Math.sin(f / 41);
  const piel = "#d9a273";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y + dy}) scale(${lado},1) rotate(${inclina})`}>
          {/* hombros: túnica naranja con el paño cruzado y la piel del hombro libre */}
          <path d={`M${-r * 1.55},${r * 2.7} Q${-r * 1.5},${r * 0.95} ${-r * 0.45},${r * 0.78} L${r * 0.5},${r * 0.78} Q${r * 1.55},${r * 0.95} ${r * 1.65},${r * 2.7} Z`} fill="#e07a2c" stroke={TINTA} strokeWidth={6} />
          <path d={`M${r * 0.55},${r * 0.82} Q${r * 1.3},${r * 0.92} ${r * 1.5},${r * 1.6} L${r * 0.9},${r * 1.7} Q${r * 0.8},${r * 1.15} ${r * 0.35},${r * 0.95} Z`} fill={piel} stroke={TINTA} strokeWidth={5} />
          <path d={`M${-r * 1.2},${r * 2.7} Q${-r * 0.3},${r * 1.4} ${r * 0.85},${r * 1.0}`} stroke="#c8601f" strokeWidth={r * 0.2} fill="none" />
          <path d={`M${-r * 1.0},${r * 1.25} Q${-r * 0.2},${r * 1.55} ${r * 0.6},${r * 1.2}`} stroke="#b9561c" strokeWidth={5} fill="none" opacity={0.7} />
          {/* nuca y cabeza rapada de 3/4 de espaldas */}
          <rect x={-r * 0.32} y={r * 0.5} width={r * 0.64} height={r * 0.42} fill={piel} />
          <circle cx={0} cy={0} r={r * 0.8} fill={piel} stroke={TINTA} strokeWidth={6} />
          <path d={`M${-r * 0.6},${r * 0.35} Q${-r * 0.1},${r * 0.62} ${r * 0.45},${r * 0.42}`} stroke="#b9855a" strokeWidth={6} fill="none" opacity={0.6} />
          {/* oreja y mejilla del lado de la escena */}
          <ellipse cx={r * 0.78} cy={r * 0.1} rx={r * 0.13} ry={r * 0.21} fill={piel} stroke={TINTA} strokeWidth={5} />
          <path d={`M${r * 0.74},${r * 0.04} q${r * 0.05},${r * 0.08} 0,${r * 0.16}`} stroke="#a8714a" strokeWidth={4} fill="none" />
          {/* brillo de la calva */}
          <ellipse cx={-r * 0.22} cy={-r * 0.48} rx={r * 0.26} ry={r * 0.12} fill="#fff4e0" opacity={0.45} transform={`rotate(-20 ${-r * 0.22} ${-r * 0.48})`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Amrapali de espaldas en primer término: pelo negro recogido en cola larga, vestido rojo, chal amarillo, aro de oro ----------
export const HombroAmrapali: React.FC<{ x: number; y: number; r?: number; lado?: 1 | -1 }> = ({ x, y, r = 240, lado = -1 }) => {
  const f = useF();
  const dy = 2 * Math.sin(f / 37 + 1);
  const piel = "#cf9468", pelo = "#1e1410";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y + dy}) scale(${lado},1)`}>
          <path d={`M${-r * 1.5},${r * 2.7} Q${-r * 1.45},${r * 0.95} ${-r * 0.42},${r * 0.8} L${r * 0.48},${r * 0.8} Q${r * 1.5},${r * 0.95} ${r * 1.6},${r * 2.7} Z`} fill="#b8323a" stroke={TINTA} strokeWidth={6} />
          <path d={`M${-r * 1.35},${r * 1.5} Q${-r * 0.2},${r * 0.7} ${r * 1.3},${r * 1.35} L${r * 1.4},${r * 1.65} Q${-r * 0.2},${r * 1.05} ${-r * 1.3},${r * 1.85} Z`} fill="#f2c14a" stroke={TINTA} strokeWidth={5} />
          <rect x={-r * 0.3} y={r * 0.5} width={r * 0.6} height={r * 0.4} fill={piel} />
          {/* cabeza de 3/4 de espaldas: pelo negro, raya, rodete y cola que cae por la espalda */}
          <circle cx={0} cy={0} r={r * 0.8} fill={pelo} stroke={TINTA} strokeWidth={6} />
          <path d={`M${-r * 0.1},${-r * 0.8} Q${r * 0.05},${-r * 0.2} ${-r * 0.05},${r * 0.4}`} stroke="#3a2a22" strokeWidth={5} fill="none" />
          <circle cx={-r * 0.15} cy={r * 0.32} r={r * 0.3} fill={pelo} stroke={TINTA} strokeWidth={5} />
          <path d={`M${-r * 0.2},${r * 0.5} Q${-r * 0.45},${r * 1.3} ${-r * 0.1},${r * 2.2} Q${r * 0.05},${r * 1.4} ${r * 0.05},${r * 0.55} Z`} fill={pelo} />
          <circle cx={-r * 0.12} cy={r * 0.12} r={r * 0.07} fill="#f2c14a" />
          {/* mejilla, oreja y aro del lado de la escena */}
          <path d={`M${r * 0.72},${-r * 0.1} Q${r * 0.9},${r * 0.25} ${r * 0.6},${r * 0.62} L${r * 0.5},${r * 0.2} Z`} fill={piel} />
          <ellipse cx={r * 0.74} cy={r * 0.12} rx={r * 0.11} ry={r * 0.18} fill={piel} stroke={TINTA} strokeWidth={4} />
          <circle cx={r * 0.76} cy={r * 0.38} r={r * 0.08} fill="none" stroke="#e0b040" strokeWidth={6} />
          <path d={`M${r * 0.1},${-r * 0.78} A${r * 0.8},${r * 0.8} 0 0 1 ${r * 0.78},${0}`} fill="none" stroke="#ffd9a0" strokeWidth={7} opacity={0.45} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- chapa de metal oscura atornillada (datos legibles: rótulo + valor grande) ----------
export type LineaChapa = { etiqueta: string; valor: string; color?: string; desde: number };
export const ChapaDatos: React.FC<{ x: number; y: number; w?: number; lineas: LineaChapa[]; tam?: number; hasta?: number }> = ({ x, y, w = 560, lineas, tam = 46, hasta = 1e9 }) => {
  const f = useF();
  const vis = lineas.filter((l) => f >= l.desde);
  if (!vis.length || f >= hasta + 8) return null;
  const alto = 46 + vis.length * (tam + 34);
  const d0 = Math.min(...lineas.map((l) => l.desde));
  const o = interpolate(f, [d0, d0 + 8], [0, 1], cl) * interpolate(f, [hasta, hasta + 8], [1, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: alto, opacity: o, background: "linear-gradient(180deg,#2c3038,#1a1d22)", border: "4px solid #4a505a", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
        {[[14, 14], [w - 30, 14], [14, alto - 30], [w - 30, alto - 30]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: a, top: b, width: 12, height: 12, borderRadius: 6, background: "#7a808a" }} />)}
        {vis.map((l, i) => {
          const t = interpolate(f, [l.desde, l.desde + 8], [0, 1], cl);
          return (
            <div key={i} style={{ position: "absolute", left: 34, right: 34, top: 26 + i * (tam + 34), height: tam + 20, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: t, transform: `translateX(${(1 - t) * 30}px)`, fontFamily: F_HUD, borderBottom: i < vis.length - 1 ? "2px solid #3a3f48" : "none" }}>
              <span style={{ fontSize: tam * 0.62, fontWeight: 700, color: "#c9ced6", letterSpacing: 2 }}>{l.etiqueta}</span>
              <span style={{ fontSize: tam, fontWeight: 800, color: l.color ?? "#9fd0ff" }}>{l.valor}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
