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
  const pulso = alerta ? 0.78 + 0.22 * Math.cos((f / 16) * Math.PI * 2) : 1; // 26-oct: pulso suave (el 1↔0,4 a saltos se leía como fantasma)
  const w = 150 * tam, h = 68 * tam;
  const lleno = Math.max(0.02, pct / 100);
  return (
    <div style={{ position: "relative", textAlign: "center", fontFamily: F_HUD, opacity: pulso }}>
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
  const s = Math.min(1, (f - desde) / 8) * Math.min(1.3, Math.max(0.85, z)) * Math.max(1.3, tam); // nunca chica (vara del director)
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

// ob03: el medidor de cansancio (cerebrito + «N% TIRED») sobre la cabeza; glitch = tiembla y parpadea en rojo (el día 3)
export const CerebroSvg: React.FC<{ pct: number; f: number; tam?: number; glitch?: boolean }> = ({ pct, f, tam = 1, glitch }) => {
  const col = pct >= 60 ? VERDE : glitch ? "#ff3d2e" : "#ff6a5a";
  const dx = glitch ? Math.sin(f * 2.7) * 4 : 0;
  const on = !glitch || f % 22 < 17;
  return (
    <div style={{ position: "relative", textAlign: "center", fontFamily: F_HUD, transform: `translateX(${dx}px)`, opacity: on ? 1 : 0.55 }}>
      <svg width={120 * tam} height={78 * tam} viewBox="-60 -44 120 78">
        <path d="M-46,0 C-50,-30 -24,-42 0,-32 C24,-42 50,-30 46,0 C50,22 22,30 0,26 C-22,30 -50,22 -46,0 Z" fill="#ffb3c6" stroke={col} strokeWidth={5} />
        <path d="M0,-32 C-6,-10 6,8 0,26" fill="none" stroke="#c75a7a" strokeWidth={4} />
        <path d="M-32,-12 q14,-10 26,0 M-34,8 q16,10 30,0 M6,-12 q14,-10 26,0 M4,8 q16,10 30,0" fill="none" stroke="#c75a7a" strokeWidth={3.5} />
        {glitch && [0, 1, 2].map((k) => <path key={k} d={`M${-58 + k * 6},${-40 + k * 4} l-10,-8`} stroke="#ff3d2e" strokeWidth={4} strokeLinecap="round" opacity={(f + k * 5) % 12 < 7 ? 1 : 0} />)}
      </svg>
      <div style={{ display: "inline-block", marginTop: 4 * tam, padding: `${4 * tam}px ${16 * tam}px`, borderRadius: 14 * tam, background: "rgba(10,12,18,0.82)", border: `${4 * tam}px solid ${col}`, boxShadow: glitch ? "0 0 24px rgba(255,61,46,0.7)" : undefined }}>
        <div style={{ fontWeight: 700, fontSize: 46 * tam, lineHeight: 1, color: col }}>{Math.round(pct)}%</div>
        <div style={{ fontWeight: 700, fontSize: 22 * tam, letterSpacing: 3, color: "#f4efe4" }}>TIRED</div>
      </div>
    </div>
  );
};

export const Cansa: React.FC<{ cl: Clave[]; x: number | ((f: number) => number); y: number | ((f: number) => number); pct: number | ClvPct; desde?: number; hasta?: number; tam?: number; glitch?: boolean | ((f: number) => boolean) }> = ({ cl, x, y, pct, desde = 0, hasta, tam = 1, glitch }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const p = enPantalla(cl, f, fps, typeof x === "function" ? x(f) : x, typeof y === "function" ? y(f) : y);
  const z = cl.length ? cl[0].zoom : 1;
  const s = Math.min(1, (f - desde) / 8) * Math.min(1.3, Math.max(0.85, z)) * Math.max(1.3, tam); // nunca chica (vara del director)
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
      <CerebroSvg pct={valor(pct, f)} f={f} glitch={typeof glitch === "function" ? glitch(f) : glitch} />
    </div>
  );
};

// cartel de texto anclado al mundo (precio, «?», nombre)
export const Tag: React.FC<{ cl: Clave[]; x: number; y: number; texto: string; desde?: number; hasta?: number; color?: string; fondo?: string; tam?: number }> = ({ cl, x, y, texto, desde = 0, hasta, color = "#f4efe4", fondo = "rgba(14,16,22,0.82)", tam = 1 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const p = enPantalla(cl, f, fps, x, y);
  const s = Math.min(1, (f - desde) / 8) * tam;
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%", padding: "8px 22px", borderRadius: 18, background: fondo, border: `4px solid ${color}`, fontFamily: F_HUD, fontWeight: 700, fontSize: 44, color, whiteSpace: "nowrap" }}>{texto}</div>
  );
};
