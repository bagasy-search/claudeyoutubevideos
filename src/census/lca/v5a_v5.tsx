// v5a · vuelta 5 de lc02 (P03-P40, escenas < 8): piezas nuevas (sólo las usa lc02_planos1).
// - FundidoSuave: corte INTERNO de una escena con fundido de 8 cuadros en curva seno (in-out): la diferencia entre
//   cuadros sube y baja de a poco, así el medidor no ve un «cuadro quieto» pegado a un fundido lineal (lageo de
//   P29 126,17 y P40 184,2: el fundido lineal de 6 daba 17 por cuadro y el vecino 1 → lo marcaba como lageo).
// - Miton: la mano enguantada de inserto (manga de lana + puño tejido + mitón con guarda y pulgar), en vez de la
//   mancha negra sobre una barra.
// - RotuloV5: píldora de título anclada por ARRIBA (top) con sub que entra en su palabra (subDesde) y sub legible.
// - Linterna: el haz del celular de June (cono + charco de luz) entre dos puntos del mundo.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { Cono, Halo } from "../../anikit/luz";
import { AMBAR } from "../elenco";
import { cl } from "./lc02_planos1_comp";

const seno = { ...cl, easing: Easing.inOut(Easing.sin) };

// ---------------------------------------------------------------------------------------------------------------
export const FundidoSuave: React.FC<{ c: number; d?: number; a: React.ReactNode; b: React.ReactNode }> = ({ c, d = 8, a, b }) => {
  const f = useF();
  const o = interpolate(f, [c, c + d], [0, 1], seno);
  return (
    <AbsoluteFill>
      {f < c + d && <AbsoluteFill>{a}</AbsoluteFill>}
      {f >= c && <AbsoluteFill style={{ opacity: o }}>{b}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// mitón de lana (svg, pantalla o mundo): (x, y) = centro de la palma; la manga sale hacia +y local; ang como ManoGuante
export const Miton: React.FC<{ x: number; y: number; ang?: number; manga?: string; color?: string; guarda?: string; s?: number; largo?: number }> = ({ x, y, ang = 30, manga = "#2f7f86", color = "#b2342a", guarda = "#f2ece0", s = 1, largo = 900 }) => (
  <g transform={`translate(${x},${y}) rotate(${-ang}) scale(${s})`}>
    {/* manga de la campera con un pliegue */}
    <rect x={-58} y={70} width={116} height={largo} rx={44} fill={manga} />
    <path d={`M-58,${150} Q0,${170} 58,${150}`} stroke="#00000033" strokeWidth={6} fill="none" />
    <path d={`M-40,${260} Q0,${276} 40,${260}`} stroke="#00000022" strokeWidth={5} fill="none" />
    {/* puño tejido (acanalado) */}
    <rect x={-52} y={36} width={104} height={52} rx={14} fill={guarda} />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-44 + i * 12} y={40} width={5} height={44} rx={2} fill="#00000018" />)}
    {/* cuerpo del mitón */}
    <path d="M-50,40 C-60,-10 -58,-62 -26,-78 C4,-92 46,-74 52,-30 C56,0 52,22 50,40 Z" fill={color} stroke="#00000040" strokeWidth={4} />
    {/* guarda de rombos */}
    <rect x={-54} y={-6} width={106} height={20} fill={guarda} opacity={0.9} />
    {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${-44 + i * 22},4 l9,-8 l9,8 l-9,8 Z`} fill={color} />)}
    {/* pulgar */}
    <path d="M-48,14 C-80,6 -88,-28 -70,-40 C-58,-48 -46,-30 -44,-14 Z" fill={color} stroke="#00000040" strokeWidth={4} />
    {/* brillo de lana */}
    <path d="M-20,-62 Q10,-74 34,-54" stroke="#ffffff33" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// píldora de título anclada por arriba: y = borde SUPERIOR (medir en el still ≥ 110); sub opcional que entra en su palabra
export const RotuloV5: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; sub?: string; subDesde?: number; subTam?: number }> = ({ texto, x, y, desde, hasta = 1e9, color = AMBAR, tam = 40, sub, subDesde, subTam }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 150 } });
  const o = interpolate(f, [desde, desde + 8, hasta, hasta + 10], [0, 1, 1, 0], cl);
  const sd = subDesde ?? desde;
  const so = interpolate(f, [sd, sd + 8], [0, 1], cl);
  const sh = sub ? interpolate(f, [sd, sd + 10], [0, 1], seno) : 0;
  const st = subTam ?? tam * 0.62;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.8 + 0.2 * s})`, transformOrigin: "50% 0%", opacity: o, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: "#f6ecd2", background: "rgba(18,15,24,0.88)", border: `3px solid ${color}`, borderRadius: 30, padding: "4px 26px 6px", whiteSpace: "nowrap", letterSpacing: 1, lineHeight: 1.15 }}>
      {texto}
      {sub && <div style={{ fontSize: st, color, letterSpacing: 2, opacity: so, height: st * 1.2 * sh, overflow: "hidden" }}>{sub}</div>}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// haz de linterna (mundo): de (x0, y0) hacia (x1, y1); charco de luz donde pega
export const Linterna: React.FC<{ x0: number; y0: number; x1: number; y1: number; color?: string; fuerza?: number; ancho?: number }> = ({ x0, y0, x1, y1, color = "#fff3c8", fuerza = 0.32, ancho = 240 }) => {
  const dx = x1 - x0, dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  const ang = (Math.atan2(-dx, dy) * 180) / Math.PI; // el Cono apunta a +y local: rotate(θ) lleva (0,1) a (−sinθ, cosθ)
  return (
    <g>
      <Cono x={x0} y={y0} alto={L * 1.25} ancho={ancho} boca={14} color={color} fuerza={fuerza} ang={ang} />
      <Halo x={x1} y={y1} r={90} color={color} fuerza={fuerza * 1.6} />
    </g>
  );
};
