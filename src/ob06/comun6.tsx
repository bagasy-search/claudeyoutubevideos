// Ayudantes compartidos por las escenas de ob06 (sólo este video).
import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { OWEN, RIM } from "../owen/elenco";
import { ROJO } from "../owen/cartel";
import { PersonaP } from "../owen/b/gente";
import { BUS_PISO, BUS_PUNTOS, alVolante } from "../owen/mundo/bus";

export const BP = BUS_PISO;
export const ch = BUS_PUNTOS.chofer;
export const AMARILLO = "#ffc94a";
export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const panza = (extra: Record<string, unknown> = {}) => ({ claves: 0, icono: "panza" as const, texto: "ANYTHING", color: AMARILLO, ...extra });
export const corazon = (bpm: number, extra: Record<string, unknown> = {}) => ({ claves: bpm, icono: "corazon" as const, fmt: (v: number) => `${Math.round(v)}`, color: ROJO, latido: bpm, ...extra });
export const owenVolante = (extra: Partial<PersonaP> = {}): PersonaP => ({
  look: OWEN, ruta: [{ f: 0, x: ch, y: BP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: BUS_PUNTOS.asiento }], poses: [{ f: 0, v: "sentado" }],
  ajuste: alVolante(ch, 1), luz: RIM.tubo, seed: 47, ...extra,
});
export const Txt: React.FC<{ t: string; a: number; b: number; f: number; top?: number; left?: number; tam?: number; color?: string; mano?: boolean; rot?: number; chip?: boolean }> = ({ t, a, b, f, top = 150, left, tam = 64, color = "#f4efe4", mano, rot = 0, chip }) => (
  <div style={{ position: "absolute", top, left: left ?? 0, right: left === undefined ? 0 : undefined, textAlign: left === undefined ? "center" : "left", fontFamily: mano ? F_MANO : F_HUD, fontWeight: mano ? 700 : 600, fontSize: tam, color, transform: `rotate(${rot}deg)`, opacity: interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], cl), textShadow: "0 3px 12px rgba(0,0,0,0.7)", whiteSpace: "pre-line", lineHeight: 1.1 }}>{chip ? <span style={{ background: "rgba(12,16,22,0.72)", padding: "6px 22px", borderRadius: 16 }}>{t}</span> : t}</div>
);
// celular GRANDE y legible (HUD): una notificación o un chat con letra ≥46 px
export const CeluGrande: React.FC<{ x: number; y: number; desde: number; f: number; de: string; lineas: string[]; escribe?: number; hora?: string; vibra?: number; w?: number; h?: number; vel?: number; icono?: string; color?: string; extra?: React.ReactNode }> = ({ x, y, desde, f, de, lineas, escribe, hora = "5:12", vibra, w = 560, h = 860, vel = 1.3, icono = "H", color = "#2a6fd6", extra }) => {
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 110 } });
  const vib = vibra !== undefined && f >= vibra && f < vibra + 20 ? Math.sin(f * 2.6) * 7 : 0;
  let n = Math.max(0, Math.floor((f - (escribe ?? desde + 10)) * vel));
  return (
    <div style={{ position: "absolute", left: x + vib, top: y + (1 - s) * 900, width: w, height: h, borderRadius: 64, background: "#141418", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", padding: 18, boxSizing: "border-box", transform: `rotate(${-2 + Math.sin(f / 40) * 0.6}deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 48, background: "linear-gradient(#2c3a4c,#151c26)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: F_HUD, fontWeight: 500, color: "#e9eef2", fontSize: 96 }}>{hora}</div>
        <div style={{ position: "absolute", top: 210, left: 22, right: 22, borderRadius: 30, background: "rgba(246,248,250,0.97)", padding: "24px 26px", fontFamily: F_HUD, color: "#1a1e26" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600, color }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{icono}</div>{de}
          </div>
          {lineas.map((l, i) => {
            const vis = l.slice(0, Math.max(0, n)); n -= l.length;
            return <div key={i} style={{ fontSize: 46, fontWeight: 600, marginTop: 14, lineHeight: 1.12, minHeight: 52 }}>{vis}</div>;
          })}
        </div>
        {extra}
      </div>
    </div>
  );
};
// cartel en el MUNDO con borde (no HUD) para objetos: nota adhesiva
export const Nota: React.FC<{ x: number; y: number; t: string; rot?: number; s?: number; color?: string }> = ({ x, y, t, rot = -4, s = 1, color = "#ffe27a" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-80} width={240} height={160} fill={color} stroke="#c9a83a" strokeWidth={3} />
    <rect x={-120} y={-80} width={240} height={26} fill="#000" opacity={0.06} />
    {t.split("\n").map((l, i, arr) => <text key={i} x={0} y={-10 + i * 46 - (arr.length - 1) * 18} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#3a2a1a" textAnchor="middle">{l}</text>)}
  </g>
);
export { F_HUD, F_MANO };
