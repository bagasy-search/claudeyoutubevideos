// HUD fijo de The Last Census (fuera de la cámara):
// - Poblacion: «POPULATION: N» mono ámbar sobre cápsula oscura, arriba a la izquierda (igual que el banner). Rueda y
//   destella cuando cambia; `tachado` muestra arriba el número viejo tachado en rojo (8,000,000,000 del Ep.1).
// - Segundo: el 2º contador del episodio (DAY 41 · °F · KCAL…), cápsula gemela debajo, con ícono opcional.
// - HudCenso: los dos + «Animated Short Film».
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont as jetbrains } from "@remotion/google-fonts/JetBrainsMono";
import { useF } from "../anikit/camara";
import { MarcaCorto, valorEn } from "../anikit/pantalla";
import { AMBAR, CAPSULA } from "./elenco";

export const F_MONO = jetbrains("normal", { weights: ["700", "800"], subsets: ["latin"] }).fontFamily;
type Cl = { f: number; v: number; d?: number }[];
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

const useAparece = (desde = 0, hasta = 1e9) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 140 } });
  const o = Math.min(s, interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return { f, s, o };
};

const Capsula: React.FC<{ x: number; y: number; tam: number; o: number; s: number; pop: number; color?: string; children: React.ReactNode }> = ({ x, y, tam, o, s, pop, color = AMBAR, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - s) * -14}px) scale(${1 + 0.06 * pop})`, transformOrigin: "0% 50%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: tam * 0.35, background: CAPSULA, border: `3px solid ${color}`, borderRadius: tam * 0.55, padding: `${tam * 0.18}px ${tam * 0.55}px`, fontFamily: F_MONO, fontWeight: 800, fontSize: tam, color, letterSpacing: 1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", boxShadow: `0 0 ${18 + 30 * pop}px ${color}${pop > 0.05 ? "99" : "44"}, 0 6px 16px rgba(0,0,0,0.45)`, textShadow: `0 0 12px ${color}88` }}>
      {children}
    </div>
  </div>
);

// claves: [{f, v}] — cada cambio rueda en d cuadros. tachado = número viejo arriba con raya roja que se dibuja en `tachaF`
export const Poblacion: React.FC<{ claves: Cl | number; x?: number; y?: number; tam?: number; desde?: number; hasta?: number; tachado?: string; tachaF?: number; grande?: boolean }> = ({ claves, x = 56, y = 48, tam = 40, desde = 0, hasta, tachado, tachaF = 0, grande }) => {
  const { f, s, o } = useAparece(desde, hasta);
  const val = typeof claves === "number" ? { v: claves, pop: 0 } : valorEn(claves, f);
  const T = grande ? tam * 1.8 : tam;
  const raya = interpolate(f, [tachaF, tachaF + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {tachado && (
        <div style={{ position: "absolute", left: x + 10, top: y, opacity: o, fontFamily: F_MONO, fontWeight: 800, fontSize: T * 0.8, color: "#f6ecd2", letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>
          {tachado}
          <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: T * 0.13, background: "#e23a2e", borderRadius: 6, transform: `scaleX(${raya}) rotate(-1.5deg)`, transformOrigin: "0% 50%", boxShadow: "0 0 12px #e23a2e99" }} />
        </div>
      )}
      <Capsula x={x} y={tachado ? y + T * 1.15 : y} tam={T} o={o} s={s} pop={val.pop}>
        <span style={{ color: "#f6ecd2", opacity: 0.92 }}>POPULATION:</span>
        <span>{fmt(val.v)}</span>
      </Capsula>
    </AbsoluteFill>
  );
};

// ícono del 2º contador
const Icono: React.FC<{ t: "dia" | "temp" | "luna" | "radio"; tam: number; color: string }> = ({ t, tam, color }) => (
  <svg width={tam * 0.9} height={tam * 0.9} viewBox="0 0 24 24">
    {t === "temp" && <><rect x="9.5" y="2" width="5" height="14" rx="2.5" fill="none" stroke={color} strokeWidth="2" /><circle cx="12" cy="18" r="4" fill={color} /><rect x="11" y="8" width="2" height="9" fill={color} /></>}
    {t === "dia" && <><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={color} strokeWidth="2" /><path d="M3 10 H21 M8 2 V7 M16 2 V7" stroke={color} strokeWidth="2" /></>}
    {t === "luna" && <path d="M15 3 A9 9 0 1 0 21 15 A7 7 0 1 1 15 3 Z" fill={color} />}
    {t === "radio" && <><rect x="4" y="8" width="16" height="13" rx="2" fill="none" stroke={color} strokeWidth="2" /><path d="M8 8 L16 2" stroke={color} strokeWidth="2" /><circle cx="9" cy="14.5" r="2.5" fill={color} /></>}
  </svg>
);

// 2º contador: «DAY 41» (prefijo) o «-30°F» (sufijo). color frío para temperatura.
export const Segundo: React.FC<{ claves: Cl | number; prefijo?: string; sufijo?: string; icono?: "dia" | "temp" | "luna" | "radio"; color?: string; x?: number; y?: number; tam?: number; desde?: number; hasta?: number; signo?: boolean }> = ({ claves, prefijo = "", sufijo = "", icono, color = AMBAR, x = 56, y = 122, tam = 34, desde = 0, hasta, signo }) => {
  const { f, s, o } = useAparece(desde, hasta);
  const val = typeof claves === "number" ? { v: claves, pop: 0 } : valorEn(claves, f);
  const n = Math.round(val.v);
  const txt = `${prefijo}${signo && n > 0 ? "+" : ""}${n < 0 ? "−" + fmt(-n) : fmt(n)}${sufijo}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Capsula x={x} y={y} tam={tam} o={o} s={s} pop={val.pop} color={color}>
        {icono && <Icono t={icono} tam={tam} color={color} />}
        <span>{txt}</span>
      </Capsula>
    </AbsoluteFill>
  );
};

export type Seg = { claves: Cl | number; prefijo?: string; sufijo?: string; icono?: "dia" | "temp" | "luna" | "radio"; color?: string; desde?: number };
// HUD completo del canal. pob = claves de POPULATION (null = oculto); seg = 2º contador; hora = texto chico «9:14 PM» opcional
export const HudCenso: React.FC<{ pob?: Cl | number | null; seg?: Seg | null; seg2?: Seg | null; pobDesde?: number; tachado?: string; tachaF?: number }> = ({ pob = 2, seg, seg2, pobDesde = 0, tachado, tachaF }) => (
  <>
    {pob !== null && pob !== undefined && <Poblacion claves={pob} desde={pobDesde} tachado={tachado} tachaF={tachaF} />}
    {seg && <Segundo {...seg} y={tachado ? 186 : 122} />}
    {seg2 && <Segundo {...seg2} y={tachado ? 250 : 186} />}
    <MarcaCorto />
  </>
);

// renglón a mano en el cuaderno (pantalla): igual a TextoMano pero tinta azul sobre papel, para inserts
export const FRIO = "#8fd3ff";
