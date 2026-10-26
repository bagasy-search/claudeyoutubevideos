// ob02: la batería sobre la cabeza (en coordenadas de MUNDO, sigue a la cámara). pct fijo o con claves que se interpolan;
// capa = la cafeína: una franja brillante arriba que tapa el rojo de abajo; alerta = parpadea; zz = letras de sueño.
import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { Clave, enPantalla, useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { VERDE } from "./elenco";

export type ClvPct = { f: number; v: number }[];
const valor = (p: number | ClvPct, f: number) => {
  if (typeof p === "number") return p;
  if (p.length === 1 || f <= p[0].f) return p[0].v;
  return interpolate(f, p.map((c) => c.f), p.map((c) => c.v), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
export const colorPct = (pct: number) => (pct < 15 ? "#ff3d2e" : pct < 45 ? "#ffc24a" : VERDE);

// la batería dibujada (en pantalla), centrada abajo en (0,0)
export const BateriaSvg: React.FC<{ pct: number; capa?: number; tam?: number; alerta?: boolean; f: number }> = ({ pct, capa = 0, tam = 1, alerta, f }) => {
  const col = colorPct(pct);
  const on = !alerta || f % 16 < 10;
  const w = 150 * tam, h = 68 * tam;
  const lleno = Math.max(0.02, pct / 100);
  return (
    <div style={{ position: "relative", textAlign: "center", fontFamily: F_HUD, opacity: on ? 1 : 0.4 }}>
      <svg width={w + 14 * tam} height={h} viewBox="0 0 164 68" style={{ filter: undefined }}>
        <rect x={4} y={4} width={142} height={60} rx={12} fill="rgba(10,12,18,0.78)" stroke={col} strokeWidth={6} />
        <rect x={148} y={22} width={12} height={24} rx={4} fill={col} />
        <rect x={12} y={12} width={126 * lleno} height={44} rx={6} fill={col} />
        {capa > 0 && <rect x={12 + 126 * lleno} y={12} width={126 * Math.min(1 - lleno, capa / 100)} height={12} rx={4} fill="#fff6c8" opacity={0.95} />}
        {capa > 0 && <rect x={12 + 126 * lleno} y={24} width={126 * Math.min(1 - lleno, capa / 100)} height={32} rx={4} fill="none" stroke="#fff6c8" strokeWidth={2} strokeDasharray="6 6" opacity={0.6} />}
      </svg>
      <div style={{ fontWeight: 700, fontSize: 44 * tam, lineHeight: 1, color: capa > 0 ? "#fff6c8" : col, textShadow: "0 3px 8px rgba(0,0,0,0.8)" }}>{Math.round(pct + capa)}%</div>
    </div>
  );
};

export const Bat: React.FC<{ cl: Clave[]; x: number | ((f: number) => number); y: number | ((f: number) => number); pct: number | ClvPct; desde?: number; hasta?: number; capa?: number | ClvPct; alerta?: boolean; tam?: number; zz?: boolean }> = ({ cl, x, y, pct, desde = 0, hasta, capa = 0, alerta, tam = 1, zz }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const X = typeof x === "function" ? x(f) : x, Y = typeof y === "function" ? y(f) : y;
  const p = enPantalla(cl, f, fps, X, Y);
  const z = cl.length ? cl[0].zoom : 1;
  const s = Math.min(1, (f - desde) / 8) * Math.min(1.3, Math.max(0.85, z)) * tam;
  const v = valor(pct, f), c = valor(capa, f);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
      <BateriaSvg pct={v} capa={c} f={f} alerta={alerta ?? v < 8} />
      {zz && [0, 1, 2].map((k) => {
        const t = ((f + k * 20) % 60) / 60;
        return <div key={k} style={{ position: "absolute", left: 150 + t * 60, top: 40 - t * 90, fontFamily: F_HUD, fontWeight: 700, fontSize: 34 + k * 8, color: "#ffe04a", opacity: Math.sin(t * Math.PI), textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>z</div>;
      })}
    </div>
  );
};
