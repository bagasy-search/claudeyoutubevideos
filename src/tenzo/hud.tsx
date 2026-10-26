// Recursos fijos en pantalla de Tenzo Films (fuera de la cámara):
//   HudTenzo   → «SCREEN TIME 9h 42m» + «DAY 1/30» arriba a la izquierda. Rueda cuando cambia; sube en ámbar-rojo, congelado en blanco.
//   ManoLeo    → voz interior de Leo, letra a mano BLANCA, horizontal, con sombra oscura
//   ManoMara   → voz de Mara, letra a mano ÁMBAR-ROJA con brillo
//   MarcaTenzo → «Tenzo Films» abajo a la derecha (⛔ nunca «Animated Short Film»)
//   Frase      → frase grande centrada blanco sobre negro (el gancho Monk Mode: «He had seen a thousand women.»)
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig, spring } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, MarcaCorto, TextoMano, valorEn } from "../anikit/pantalla";
import { ACENTO, BLANCO_MANO } from "./elenco";

// minutos → «9h 42m» / «58m» / «0m»
export const hm = (min: number) => {
  const m = Math.max(0, Math.round(min));
  return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m` : `${m}m`;
};
export type ClvMin = { f: number; v: number; d?: number }[];

// SCREEN TIME (minutos, puede rodar) + DAY x/30. `estado`: "sube" (ámbar-rojo), "congelado" (blanco con borde), "normal"
export const HudTenzo: React.FC<{ min: number | ClvMin; dia: number | string; estado?: "sube" | "congelado" | "normal" | ((f: number) => "sube" | "congelado" | "normal"); desde?: number; hasta?: number; sinMarca?: boolean }> = ({ min, dia, estado = "normal", desde = 0, hasta, sinMarca }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 140 } });
  const o = Math.min(s, hasta ? interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
  const { v, pop } = typeof min === "number" ? { v: min, pop: 0 } : valorEn(min, f);
  const est = typeof estado === "function" ? estado(f) : estado;
  const col = est === "sube" ? ACENTO : est === "congelado" ? "#ffffff" : "#e9e3d6";
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 70, top: 56, opacity: o, transform: `translateY(${(1 - s) * 14}px)`, fontFamily: F_HUD, fontWeight: 500, fontSize: 40, lineHeight: 1.22, color: "#d9d4ca", letterSpacing: 1, textShadow: "0 2px 0 rgba(0,0,0,0.4), 0 0 18px rgba(0,0,0,0.55)" }}>
          <div style={{ whiteSpace: "nowrap" }}>
            SCREEN TIME{" "}
            <span style={{ color: col, display: "inline-block", fontWeight: 600, transform: `scale(${1 + 0.14 * pop})`, transformOrigin: "0% 70%", textShadow: est === "sube" ? `0 0 18px ${ACENTO}aa` : est === "congelado" ? "0 0 16px rgba(255,255,255,0.6)" : undefined }}>
              {hm(v)}
            </span>
            {est === "congelado" && <span style={{ marginLeft: 12, fontSize: 30, color: "#ffffff", opacity: 0.85 }}>❄</span>}
          </div>
          <div style={{ whiteSpace: "nowrap", fontSize: 34, color: "#bdb7ac" }}>DAY <span style={{ color: "#f4efe6", fontWeight: 600 }}>{typeof dia === "number" ? `${dia}/30` : dia}</span></div>
        </div>
      </AbsoluteFill>
      {!sinMarca && <MarcaTenzo />}
    </>
  );
};

export const MarcaTenzo: React.FC = () => <MarcaCorto texto="Tenzo Films" />;

// letra a mano: siempre horizontal (rot 0), nunca chica. Leo = blanca con sombra; Mara = ámbar-roja con brillo
type ManoP = Omit<React.ComponentProps<typeof TextoMano>, "color">;
export const ManoLeo: React.FC<ManoP> = ({ tam = 70, vel = 1.5, ...r }) => <TextoMano {...r} tam={Math.max(62, tam)} vel={vel} rot={0} color={BLANCO_MANO} brillo={false} />;
export const ManoMara: React.FC<ManoP> = ({ tam = 78, vel = 1.3, ...r }) => <TextoMano {...r} tam={Math.max(64, tam)} vel={vel} rot={0} color={ACENTO} brillo />;

// frase grande (gancho estilo Monk Mode): blanco limpio sobre fondo negro, aparece con fundido y sube 10 px
export const Frase: React.FC<{ texto: string; desde?: number; hasta?: number; tam?: number; color?: string; y?: number }> = ({ texto, desde = 0, hasta, tam = 76, color = "#f4efe6", y = 540 }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 8], [desde <= 2 ? 0.45 : 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (hasta ? interpolate(f, [hasta - 12, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: `translateY(calc(-50% + ${(1 - Math.min(1, o * 1.3)) * 10}px))`, textAlign: "center", opacity: o, fontFamily: F_HUD, fontWeight: 500, fontSize: tam, color, letterSpacing: 1 }}>
      {texto}
    </div>
  );
};

// rótulo de lugar y hora («UPTOWN, CHICAGO · 3:20 AM») abajo a la izquierda, chico y limpio
export const Rotulo: React.FC<{ texto: string; desde?: number; hasta?: number }> = ({ texto, desde = 0, hasta }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (hasta ? interpolate(f, [hasta - 12, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
  return <div style={{ position: "absolute", left: 76, bottom: 80, maxWidth: 1760, whiteSpace: "nowrap", padding: "10px 22px", borderRadius: 14, background: "rgba(14,12,18,0.55)", opacity: o, fontFamily: F_HUD, fontWeight: 500, fontSize: texto.length > 30 ? 36 : 46, letterSpacing: texto.length > 30 ? 4 : 6, color: "#e8e4dc", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{texto}</div>;
};
