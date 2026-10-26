// HUD extra de lc-b: los 3 íconos tachados de la miniatura del Ep.3 (agua / luz / gas) y la barra KCAL del Ep.4.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { valorEn } from "../../anikit/pantalla";
import { AMBAR, CAPSULA } from "../elenco";
import { F_MONO } from "../hud";

export const IconoSistema: React.FC<{ t: "agua" | "luz" | "gas" | "cloaca" | "calle" | "comida"; tam: number }> = ({ t, tam }) => (
  <svg width={tam} height={tam} viewBox="0 0 48 48">
    {t === "agua" && <path d="M24 6 C 30 16 36 22 36 30 A12 12 0 0 1 12 30 C 12 22 18 16 24 6 Z" fill="#7cc8ff" />}
    {t === "luz" && <path d="M27 4 L12 27 L22 27 L19 44 L36 19 L26 19 Z" fill="#ffd23a" />}
    {t === "gas" && <><path d="M24 4 C 34 14 38 22 36 32 A12 12 0 0 1 12 32 C 10 24 16 18 18 12 C 20 18 22 20 24 20 C 24 14 22 10 24 4 Z" fill="#ff7a2a" /><path d="M24 22 C 29 27 30 31 28 35 A5 5 0 0 1 20 35 C 19 31 22 28 24 22 Z" fill="#ffd27a" /></>}
    {t === "cloaca" && <><circle cx="24" cy="24" r="16" fill="none" stroke="#b08a5a" strokeWidth="4" /><path d="M12 24 H36 M24 12 V36" stroke="#b08a5a" strokeWidth="4" /></>}
    {t === "calle" && <><path d="M18 6 L10 42 M30 6 L38 42" stroke="#c9c4d8" strokeWidth="4" /><path d="M24 10 V16 M24 22 V28 M24 34 V40" stroke="#ffcf6e" strokeWidth="4" /></>}
    {t === "comida" && <><ellipse cx="24" cy="28" rx="13" ry="10" fill="#c9a26a" /><circle cx="19" cy="25" r="1.8" fill="#7a5a3a" /><circle cx="28" cy="30" r="1.8" fill="#7a5a3a" /></>}
  </svg>
);

// fila de círculos con ícono y X roja que se dibuja en `tachaF[i]`; `apagar` (f) los desvanece
export const IconosTachados: React.FC<{ iconos: ("agua" | "luz" | "gas")[]; x?: number; y?: number; tam?: number; tachaF?: number[]; desde?: number; hasta?: number }> = ({ iconos, x = 56, y = 120, tam = 92, tachaF = [], desde = -100, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const o = interpolate(f, [hasta - 12, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * Math.min(1, spring({ frame: f - desde, fps, config: { damping: 14 } }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {iconos.map((t, i) => {
        const r = interpolate(f, [tachaF[i] ?? -100, (tachaF[i] ?? -100) + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{ position: "absolute", left: x + i * (tam * 1.22), top: y, width: tam, height: tam, borderRadius: tam, background: CAPSULA, border: `4px solid #8a7ab8`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.5)" }}>
            <IconoSistema t={t} tam={tam * 0.62} />
            <svg width={tam} height={tam} viewBox="0 0 100 100" style={{ position: "absolute", left: -4, top: -4 }}>
              <path d="M26 26 L74 74" stroke="#e23a2e" strokeWidth={9} strokeLinecap="round" strokeDasharray="70" strokeDashoffset={70 * (1 - r)} />
              <path d="M74 26 L26 74" stroke="#e23a2e" strokeWidth={9} strokeLinecap="round" strokeDasharray="70" strokeDashoffset={70 * (1 - Math.max(0, r * 2 - 1) * 1)} />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// barra KCAL GROWN (Ep.4): cápsula con barra que se llena hacia la meta
export const BarraKcal: React.FC<{ claves: { f: number; v: number; d?: number }[]; meta: number; x?: number; y?: number; w?: number; desde?: number; hasta?: number; rotulo?: string }> = ({ claves, meta, x = 56, y = 196, w = 520, desde = 0, hasta = 1e9, rotulo = "KCAL GROWN" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 140 } });
  const o = Math.min(s, interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const v = valorEn(claves, f);
  const k = Math.max(0, Math.min(1, v.v / meta));
  const col = k >= 0.86 ? "#7cd36a" : AMBAR;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - s) * -14}px) scale(${1 + 0.05 * v.pop})`, transformOrigin: "0% 50%", background: CAPSULA, border: `3px solid ${AMBAR}`, borderRadius: 22, padding: "8px 18px", width: w, fontFamily: F_MONO, fontWeight: 800, color: AMBAR, boxShadow: `0 0 ${18 + 30 * v.pop}px ${AMBAR}55, 0 6px 16px rgba(0,0,0,0.45)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 1 }}>
          <span style={{ color: "#f6ecd2" }}>{rotulo}</span>
          <span>{Math.round(v.v).toLocaleString("en-US")}</span>
        </div>
        <div style={{ marginTop: 6, height: 14, borderRadius: 7, background: "#2a2430", overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${k * 100}%`, height: "100%", background: col, borderRadius: 7, boxShadow: `0 0 10px ${col}` }} />
        </div>
        <div style={{ marginTop: 4, fontSize: 16, color: "#f6ecd2", opacity: 0.7, textAlign: "right" }}>GOAL {meta.toLocaleString("en-US")}</div>
      </div>
    </AbsoluteFill>
  );
};
