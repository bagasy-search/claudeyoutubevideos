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

// ---------- vuelta 4: el bolso de ropa con color (azul saturado, cordón blanco, una manga roja asomando) para que se lea sobre el cuarto gris ----------
export const BolsoColor: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-6,0 L6,0 L4,18 L-4,18 Z" fill="#f2efe8" />
    <path d="M-12,22 Q-30,8 -22,-6" stroke="#f2efe8" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M10,20 Q34,10 40,30 Q44,46 30,44 Q24,30 10,30 Z" fill="#d8402e" stroke={TINTA} strokeWidth={3} />
    {/* bolsa de tela fruncida: cuello angosto atado, panza redonda que se apoya */}
    <path d="M-9,18 Q-52,34 -46,74 Q-42,104 0,106 Q42,104 46,74 Q52,34 9,18 Z" fill="#2f6fd6" stroke={TINTA} strokeWidth={3.5} />
    <path d="M-9,18 L-16,10 M-3,18 L-4,8 M3,18 L4,8 M9,18 L16,10" stroke="#2f6fd6" strokeWidth={6} strokeLinecap="round" />
    <path d="M-12,22 L12,22" stroke="#f2efe8" strokeWidth={5} strokeLinecap="round" />
    <path d="M-36,46 Q-40,74 -26,94" stroke="#6aa0ff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M-6,30 Q-14,60 -8,96 M10,32 Q18,62 12,96" stroke="#1f4c99" strokeWidth={3} fill="none" />
  </g>
);

// ---------- vuelta 4: INSERTO «I made the rice»: el cuenco humeante en las manos viejas, sobre fondo cálido oscuro ----------
export const InsertoArroz: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  const t = f - desde;
  const sube = interpolate(t, [0, 14], [60, 0], { ...cl, easing: (x: number) => 1 - Math.pow(1 - x, 3) });
  const z = 1 + 0.0016 * t;
  const piel = "#d9a273";
  const granos = Array.from({ length: 70 }).map((_, i) => {
    const a = (i * 137.5 * Math.PI) / 180, r = 150 * Math.sqrt((i + 0.5) / 70);
    return { x: r * Math.cos(a) * 1.25, y: -r * Math.abs(Math.sin(a)) * 0.55 - (150 - r) * 0.42, rot: (i * 47) % 180 };
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #5a3a1e 0%, #2a1a10 55%, #120b07 100%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(960,${640 + sube}) scale(${z})`}>
          {/* vapor: tres hilos que suben ondulando, opacidad continua */}
          {[-70, 0, 70].map((dx, k) => {
            const ph = t / 9 + k * 2.1;
            const o = interpolate(t, [4, 16], [0, 0.55], cl) * (0.75 + 0.25 * Math.sin(ph));
            return <path key={k} d={`M${dx},-120 C${dx + 40 * Math.sin(ph)},-200 ${dx - 40 * Math.sin(ph + 1)},-290 ${dx + 30 * Math.sin(ph + 2)},-400`} stroke="#fff4e0" strokeWidth={14} strokeLinecap="round" fill="none" opacity={o} />;
          })}
          {/* arroz */}
          <ellipse cx={0} cy={-40} rx={210} ry={52} fill="#f4efe4" />
          <path d="M-205,-40 Q-150,-170 0,-175 Q150,-170 205,-40 Z" fill="#fbf8f1" stroke={TINTA} strokeWidth={4} />
          {granos.map((g, i) => <ellipse key={i} cx={g.x} cy={g.y - 48} rx={9} ry={4.5} fill="#e9e1cf" transform={`rotate(${g.rot} ${g.x} ${g.y - 48})`} />)}
          {/* cuenco */}
          <path d="M-250,-40 Q-240,160 0,175 Q240,160 250,-40 Z" fill="#f2efe8" stroke={TINTA} strokeWidth={5} />
          <path d="M-246,-12 Q0,8 246,-12" stroke="#2f5fae" strokeWidth={14} fill="none" />
          <path d="M-200,40 Q-150,130 -40,150" stroke="#ffffff" strokeWidth={10} fill="none" opacity={0.6} strokeLinecap="round" />
          <ellipse cx={0} cy={-40} rx={250} ry={40} fill="none" stroke={TINTA} strokeWidth={5} />
          <rect x={-80} y={165} width={160} height={26} rx={8} fill="#d8d2c4" stroke={TINTA} strokeWidth={4} />
          {/* manos viejas a los lados, mangas grises desde abajo */}
          {[-1, 1].map((l) => (
            <g key={l} transform={`scale(${l},1)`}>
              <path d="M300,420 Q300,200 250,110" stroke="#7d8189" strokeWidth={120} fill="none" strokeLinecap="round" />
              <path d="M215,40 Q300,40 300,140 Q296,190 240,186 Q200,150 215,40 Z" fill={piel} stroke={TINTA} strokeWidth={4} />
              {[0, 1, 2, 3].map((d) => <path key={d} d={`M${222 - d * 4},${56 + d * 28} q-34,4 -44,18`} stroke={TINTA} strokeWidth={4} fill="none" strokeLinecap="round" />)}
              <path d="M226,30 q-30,-20 -60,-6" stroke={piel} strokeWidth={26} strokeLinecap="round" fill="none" />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
