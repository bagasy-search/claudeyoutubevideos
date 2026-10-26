// RECURSOS FIJOS de «Owen Upgraded» (canal B): el CARTEL verde sobre las cabezas y el HUD de la serie
// (PARTICIPANTS nn/47 + reloj del día + «Animated Short Film»). Hecho para ob04-ob06; lo pueden usar todas las sesiones.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, MarcaCorto, RelojDia, valorEn } from "../anikit/pantalla";
import { VERDE } from "./elenco";

export { VERDE };
export const ROJO = "#ff4a5a"; // pulso / pantalla de más

// ---------- precio: formato de los carteles ----------
export const usd = (v: number) => {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(v % 1e6 === 0 ? 0 : v >= 1e7 ? 1 : 2).replace(/\.?0+$/, "")}M`;
  return "$" + Math.round(v).toLocaleString("en-US");
};

// ---------- HUD fijo de la serie ----------
// part = [{f, v}] participantes que siguen (rueda al bajar, con destello rojo); hora = minutos desde medianoche (null = sin reloj)
export const HudSerie: React.FC<{ part: { f: number; v: number; d?: number }[]; hora?: number | null; horaDesde?: number }> = ({ part, hora = null, horaDesde = 0 }) => {
  const f = useF();
  const { v, pop } = valorEn(part.map((k) => ({ ...k, d: k.d ?? 24 })), f);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 70, top: 50, fontFamily: F_HUD, fontWeight: 500, fontSize: 40, color: "#e9e3d6", letterSpacing: 0.5, textShadow: "0 2px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap", background: "rgba(12,16,22,0.62)", padding: "6px 18px", borderRadius: 14 }}>
        PARTICIPANTS{" "}
        <span style={{ color: pop > 0.05 ? mezclarHex(VERDE, ROJO, pop) : VERDE, display: "inline-block", transform: `scale(${1 + 0.25 * pop})`, transformOrigin: "0% 70%", fontVariantNumeric: "tabular-nums" }}>{Math.round(v)}/47</span>
      </div>
      {hora !== null && f >= horaDesde && <RelojDia min={hora} x={1640} y={46} tam={36} />}
      <MarcaCorto />
    </AbsoluteFill>
  );
};

const mezclarHex = (a: string, b: string, t: number) => {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, "0")).join("");
};

// ---------- el CARTEL sobre las cabezas (recurso fijo): icono + valor que rueda + rótulo ----------
// x, y = punto de PANTALLA (enPantalla(claves, f, fps, actorX, PISO - 330)); fmt = cómo se escribe el valor
export type Icono = "dolar" | "reloj" | "panza" | "corazon" | "bateria" | "cerebro";
const ICONOS: Record<Icono, (c: string) => React.ReactNode> = {
  // etiqueta de precio (el «price tag» de la serie) con su agujerito
  dolar: (c) => <g transform="rotate(-35)"><path d="M-6,-14 H13 V14 H-6 L-15,0 Z" fill={c} /><circle cx={-6} cy={0} r={3.6} fill="#08140c" /></g>,
  reloj: (c) => <g><circle r="11" fill="none" stroke={c} strokeWidth="3" /><path d="M0,0 V-7 M0,0 L5,3" stroke={c} strokeWidth="3" strokeLinecap="round" /></g>,
  panza: (c) => <path d="M-6,-12 Q-2,-4 -8,2 Q-14,12 -2,13 Q12,14 11,1 Q10,-7 2,-6 Q-1,-6 -1,-12 Z" fill={c} />,
  bateria: (c) => <g><rect x={-13} y={-8} width={24} height={16} rx={3} fill="none" stroke={c} strokeWidth={3} /><rect x={12} y={-3} width={3} height={6} fill={c} /><rect x={-10} y={-5} width={18} height={10} rx={1} fill={c} /></g>,
  cerebro: (c) => <g fill="none" stroke={c} strokeWidth={3} strokeLinecap="round"><path d="M0,-11 C-8,-14 -15,-8 -13,-1 C-17,4 -11,12 -4,10 C-2,13 0,12 0,12 Z" /><path d="M0,-11 C8,-14 15,-8 13,-1 C17,4 11,12 4,10 C2,13 0,12 0,12" /><path d="M-6,-4 q4,3 0,7 M6,-4 q-4,3 0,7" /></g>,
  corazon: (c) => <path d="M0,11 C-14,1 -13,-11 -5,-11 C-2,-11 0,-8 0,-6 C0,-8 2,-11 5,-11 C13,-11 14,1 0,11 Z" fill={c} />,
};
export const Cartel: React.FC<{
  x: number; y: number; claves: { f: number; v: number; d?: number }[] | number; fmt?: (v: number) => string; texto?: string;
  icono?: Icono; color?: string; rotulo?: string; desde?: number; hasta?: number; tam?: number; latido?: number; parpadeo?: number;
}> = ({ x, y, claves, fmt = usd, texto, icono = "dolar", color = VERDE, rotulo, desde = 0, hasta = 1e9, tam = 58, latido, parpadeo = 0 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 150 } });
  const o = Math.min(s, interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (f < desde || o <= 0.001) return null;
  const val = typeof claves === "number" ? { v: claves, pop: 0 } : valorEn(claves, f);
  // latido: bpm → el cartel late (corazón); parpadeo 0..1 → falla como un neón que se apaga
  const lat = latido ? Math.max(0, Math.sin(((f / fps) * latido * Math.PI * 2) / 60)) ** 8 : 0;
  const fl = parpadeo ? (random(`pc${Math.floor(f / 2)}`) < parpadeo * 0.5 ? 0.25 : 1) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * fl, transform: `translate(-50%,-100%) scale(${(0.6 + 0.4 * s) * (1 + 0.1 * val.pop + 0.08 * lat)})`, transformOrigin: "50% 100%", textAlign: "center", fontFamily: F_HUD, whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: tam * 0.18, padding: `${tam * 0.12}px ${tam * 0.32}px`, borderRadius: tam * 0.28, background: "rgba(8,20,12,0.78)", border: `${Math.max(3, tam * 0.06)}px solid ${color}`, boxShadow: `0 0 ${tam * 0.5}px ${color}88, inset 0 0 ${tam * 0.3}px ${color}44` }}>
        <svg width={tam * 0.62} height={tam * 0.62} viewBox="-16 -16 32 32" style={{ overflow: "visible" }}>{ICONOS[icono](color)}</svg>
        <span style={{ fontWeight: 600, fontSize: tam, lineHeight: 1, color, textShadow: `0 0 ${tam * 0.3}px ${color}aa`, fontVariantNumeric: "tabular-nums" }}>{texto ?? fmt(val.v)}</span>
      </div>
      {rotulo && <div style={{ fontWeight: 500, fontSize: tam * 0.3, letterSpacing: 3, color: "#f4efe4", marginTop: 4, textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>{rotulo}</div>}
      <div style={{ width: 3, height: tam * 0.35, background: color, margin: "4px auto 0", borderRadius: 2, opacity: 0.8 }} />
    </div>
  );
};

// ---------- CARTEL EN EL MUNDO (SVG, va dentro de `medio`): se mueve con la cámara y queda clavado sobre la cabeza ----------
// x, y = punto del mundo donde va la PUNTA de abajo del cartel (encima de la cabeza). Mismo diseño que <Cartel>.
export const CartelM: React.FC<{
  x: number; y: number; claves: { f: number; v: number; d?: number }[] | number; fmt?: (v: number) => string; texto?: string;
  icono?: Icono; color?: string; rotulo?: string; desde?: number; hasta?: number; tam?: number; latido?: number; parpadeo?: number; f: number; fps?: number;
}> = ({ x, y, claves, fmt = usd, texto, icono = "dolar", color = VERDE, rotulo, desde = 0, hasta = 1e9, tam = 40, latido, parpadeo = 0, f, fps = 30 }) => {
  const s = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 150 } });
  const o = Math.min(s, interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (f < desde || o <= 0.001) return null;
  const val = typeof claves === "number" ? { v: claves, pop: 0 } : valorEn(claves, f);
  const lat = latido ? Math.max(0, Math.sin(((f / fps) * latido * Math.PI * 2) / 60)) ** 8 : 0;
  const fl = parpadeo ? (random(`pc${Math.floor(f / 2)}`) < parpadeo * 0.5 ? 0.25 : 1) : 1;
  const t = texto ?? fmt(val.v);
  // ancho aproximado de Fredoka 600: 0,58 em por carácter
  const wTxt = t.length * tam * 0.6, ic = tam * 0.9, pad = tam * 0.34;
  const w = wTxt + ic + pad * 2.4, h = tam * 1.36;
  const sc = (0.6 + 0.4 * s) * (1 + 0.12 * val.pop + 0.09 * lat);
  const flota = Math.sin(f / 22 + x * 0.01) * 4;
  return (
    <g transform={`translate(${x},${y + flota}) scale(${sc})`} opacity={o * fl}>
      <rect x={-1.5} y={-tam * 0.42} width={3} height={tam * 0.42} fill={color} opacity={0.8} />
      <g transform={`translate(0,${-tam * 0.42})`}>
        <rect x={-w / 2 - 6} y={-h - 6} width={w + 12} height={h + 12} rx={h * 0.32} fill={color} opacity={0.18} />
        <rect x={-w / 2} y={-h} width={w} height={h} rx={h * 0.26} fill="#08140c" fillOpacity={0.8} stroke={color} strokeWidth={Math.max(3, tam * 0.07)} />
        <g transform={`translate(${-w / 2 + pad + ic / 2},${-h / 2}) scale(${ic / 32})`}>{ICONOS[icono](color)}</g>
        <text x={-w / 2 + pad * 1.4 + ic} y={-h / 2 + tam * 0.36} fontFamily={F_HUD} fontWeight={600} fontSize={tam} fill={color} style={{ fontVariantNumeric: "tabular-nums" }}>{t}</text>
        {rotulo && <text x={0} y={-h - tam * 0.3} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={tam * 0.38} letterSpacing={3} fill="#f4efe4" stroke="#000" strokeOpacity={0.45} strokeWidth={3} paintOrder="stroke">{rotulo}</text>}
      </g>
    </g>
  );
};

// altura de la coronilla sobre los pies (palo): piernas 124·alto + torso 88·alto + cabeza ~95; sentado = asiento + torso + cabeza
export const coronilla = (esc: number, alto = 1, asiento?: number) => esc * ((asiento !== undefined ? asiento : 124 * alto) + 88 * alto + 98);
