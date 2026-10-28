// EscenaB: la Escena de anikit + una capa 3D (personajes Blanquito) entre el medio y el frente, y una capa `sobre`
// (SVG en coordenadas del mundo, por ENCIMA de los personajes: símbolos, objetos en mano, carro que los tapa).
//   lejos (z .25) → [tras (zTras), sólo sets pintados] → medio (set + detras) → 3D (personajes) → sobre (z 1) → frente (z 1.4) → hud (pantalla)
// + HUD de supervivencia bilingüe del canal: día y hora que ruedan, y la barra «probabilidad de sobrevivir».
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CapaSVG, Clave, Plano, useF } from "../anikit/camara";
import { Paleta } from "../anikit/paletas";
import { conMomento, Momento, palMomento } from "../anikit/momento";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { LuzEscena } from "../stickman3d/iluminacion";
import { Capa3D, Personaje } from "./capa3d";

export type Idioma = "es" | "en";

export const EscenaB: React.FC<{
  Set: React.FC<any>; pal: Paleta; claves: Clave[]; setProps?: Record<string, unknown>; momento?: Momento;
  personajes?: Personaje[]; luz?: LuzEscena; detras?: React.ReactNode; sobre?: React.ReactNode; frente?: React.ReactNode; hud?: React.ReactNode;
  mano?: number; seed?: number; zLejos?: number; interior?: boolean; zTras?: number;
}> = ({ Set, pal, claves, setProps = {}, momento, personajes = [], luz, detras, sobre, frente, hud, mano = 3, seed = 0, zLejos = 0.25, interior, zTras }) => {
  const f = useF();
  const S = momento ? conMomento(Set, momento, { interior }) : Set;
  const P = momento ? palMomento(pal, momento) : pal;
  const sp = { f, pal: P, ...setProps };
  const noche = momento === "noche";
  return (
    <AbsoluteFill>
      <Plano claves={claves} mano={mano} seed={seed} fondo={P.cielo[0]} mbMax={2.5}>
        <CapaSVG z={zLejos} desenfoqueMax={3}><S capa="lejos" {...sp} /></CapaSVG>
        {zTras !== undefined && <CapaSVG z={zTras} desenfoqueMax={2}><S capa="tras" {...sp} /></CapaSVG>}
        <CapaSVG z={1}><S capa="medio" {...sp} />{detras}</CapaSVG>
        <Capa3D personajes={personajes} luz={{ ...(noche ? { intensidad: 1.5, color: "#ffd9a8", relleno: 0.55, tinte: "#8a90b8", entorno: 0.55 } : {}), ...luz }} />
        <CapaSVG z={1}>{sobre}</CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={5}><S capa="frente" {...sp} />{frente}</CapaSVG>
      </Plano>
      {hud}
    </AbsoluteFill>
  );
};

// ── HUD de supervivencia (fuera del Montaje: corre sobre todo el video, así no hay salto en los cortes) ──────────
export type MarcaHUD = { f: number; dia: string; hora: string; prob: number };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const HudSupervivencia: React.FC<{ marcas: MarcaHUD[]; idioma: Idioma; lugar: string; acento?: string; hasta?: number }> = ({ marcas, idioma, lugar, acento = "#ff5a3c", hasta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let i = 0;
  for (let k = 0; k < marcas.length; k++) if (f >= marcas[k].f) i = k;
  const m = marcas[i], prev = marcas[Math.max(0, i - 1)];
  const t = f - m.f;
  const pop = i === 0 ? spring({ frame: f - 20, fps, config: { damping: 14 } }) : 1;
  const giro = i > 0 ? spring({ frame: t, fps, config: { damping: 12, stiffness: 140 } }) : 1;
  const prob = interpolate(spring({ frame: t, fps, config: { damping: 20, stiffness: 50 } }), [0, 1], [i > 0 ? prev.prob : m.prob, m.prob]);
  const o = hasta ? interpolate(f, [hasta, hasta + 15], [1, 0], cl) : 1;
  const colProb = prob < 30 ? "#ff4a3d" : prob < 60 ? "#ffc93c" : "#5fd47a";
  const L = idioma === "es" ? { dia: "DÍA", prob: "PROBABILIDAD DE SOBREVIVIR" } : { dia: "DAY", prob: "CHANCE OF SURVIVAL" };
  const caja: React.CSSProperties = { background: "rgba(20,12,8,0.78)", border: "4px solid #f4e6c8", borderRadius: 18, boxShadow: "0 6px 0 rgba(0,0,0,0.35)" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o * pop }}>
      {/* día + hora */}
      <div style={{ position: "absolute", left: 48, top: 40, ...caja, padding: "12px 26px", fontFamily: F_HUD, color: "#fff6e6", transform: `scale(${0.85 + 0.15 * pop})`, transformOrigin: "0 0" }}>
        <div style={{ fontSize: 26, letterSpacing: 3, color: "#f4d9a8" }}>{lugar}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, height: 64, overflow: "hidden" }}>
          <span style={{ fontSize: 58, fontWeight: 900, color: acento, display: "inline-block", transform: `translateY(${(1 - giro) * -60}px)` }}>{L.dia} {m.dia}</span>
          <span style={{ fontSize: 46, fontWeight: 700, display: "inline-block", transform: `translateY(${(1 - giro) * 60}px)` }}>{m.hora}</span>
        </div>
      </div>
      {/* probabilidad de sobrevivir */}
      <div style={{ position: "absolute", right: 48, top: 40, width: 470, ...caja, padding: "12px 22px", fontFamily: F_HUD, color: "#fff6e6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2 }}><span>{L.prob}</span><span style={{ fontWeight: 900, fontSize: 30, color: colProb }}>{Math.round(prob)}%</span></div>
        <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: "#3a2a20", overflow: "hidden" }}>
          <div style={{ width: `${prob}%`, height: "100%", background: colProb, borderRadius: 11 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// texto grande «a mano» con rebote, para el dato clave del segundo (1348, 70.000, 1 PENIQUE…)
export const Dato: React.FC<{ texto: string; x: number; y: number; desde: number; hasta: number; color?: string; tam?: number; rot?: number }> = ({ texto, x, y, desde, hasta, color = "#ffd23c", tam = 110, rot = -4 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + (1 - s) * 10}deg) scale(${s})`, opacity: o, fontFamily: F_MANO, fontWeight: 700, fontSize: tam, color, whiteSpace: "pre", textAlign: "center", lineHeight: 1, WebkitTextStroke: "3px #1d1410", textShadow: "0 7px 0 #1d1410" }}>{texto}</div>
  );
};
