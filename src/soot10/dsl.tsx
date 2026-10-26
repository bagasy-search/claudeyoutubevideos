import React from "react";
import { interpolate, Easing } from "remotion";
import { C, ent, fontFamily } from "./kit";
import { TINTA } from "./obj";

export const en = (t: number, a: number, b: number) => t >= a && t < b;
// texto de pantalla con entrada elástica y salida (t1); `palabra` = aparece de a una palabra
export const Txt: React.FC<{ t: number; t0: number; t1?: number; text: string; x?: number; y?: number; size?: number; color?: string; borde?: string; rot?: number; fondo?: string; palabras?: number[] }> = ({ t, t0, t1 = t0 + 2.5, text, x = 960, y = 180, size = 120, color = C.crema, borde = TINTA, rot = 0, fondo, palabras }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const s = ent(t, t0, 0, { damping: 9, stiffness: 200 });
  const out = interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.back(2)) });
  const ws = text.split(" ");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s * out}) rotate(${rot + (1 - s) * -6}deg)`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.1}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 2, textShadow: `0 ${size * 0.08}px 0 ${borde}`, background: fondo, padding: fondo ? `${size * 0.1}px ${size * 0.35}px` : undefined, borderRadius: size * 0.25 }}>
      {palabras ? ws.map((w, i) => <span key={i} style={{ opacity: t >= (palabras[i] ?? t0) ? 1 : 0, display: "inline-block", transform: `scale(${t >= (palabras[i] ?? t0) ? ent(t, palabras[i] ?? t0, 0, { damping: 9, stiffness: 240 }) : 0})` }}>{w}{i < ws.length - 1 ? " " : ""}</span>) : text}
    </div>
  );
};
// texto en el mundo (dentro de un <svg>): con contorno, entra con rebote
export const Lbl: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; txt: string; size?: number; color?: string; rot?: number; anchor?: "middle" | "start" | "end" }> = ({ t, t0, t1 = 1e9, x, y, txt, size = 60, color = C.crema, rot = 0, anchor = "middle" }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const s = ent(t, t0, 0, { damping: 9, stiffness: 200 }) * interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
      <text textAnchor={anchor} fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={color} stroke={TINTA} strokeWidth={size * 0.2} paintOrder="stroke" strokeLinejoin="round">{txt}</text>
    </g>
  );
};
// contador que corre (años, cantidades)
export const Contador: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x?: number; y?: number; size?: number; color?: string; pre?: string; post?: string; tFin?: number }> = ({ t, t0, t1, de, a, x = 960, y = 540, size = 160, color = C.oro, pre = "", post = "", tFin }) => {
  if (t < t0 || (tFin !== undefined && t > tFin)) return null;
  const u = interpolate(t, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const v = Math.round(de + (a - de) * u);
  const pop = t > t1 ? ent(t, t1, 0, { damping: 7, stiffness: 260 }) * 0.15 + 0.85 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${TINTA}`, paintOrder: "stroke fill", fontVariantNumeric: "tabular-nums", textShadow: `0 ${size * 0.07}px 0 ${TINTA}`, whiteSpace: "nowrap" }}>{pre}{v}{post}</div>
  );
};
// flash blanco de pantalla (revelaciones / impactos)
export const Flash: React.FC<{ t: number; t0: number; d?: number; c?: string }> = ({ t, t0, d = 0.35, c = "#fff" }) => {
  if (t < t0 || t > t0 + d) return null;
  return <div style={{ position: "absolute", inset: 0, background: c, opacity: (1 - (t - t0) / d) * 0.85, pointerEvents: "none" }} />;
};
// viñeta de lista que se tacha (los oficios, las reglas)
export const Lista: React.FC<{ t: number; x: number; y: number; items: { txt: string; t0: number; tacha?: number; ok?: boolean }[]; size?: number; t1?: number; titulo?: string; w?: number }> = ({ t, x, y, items, size = 54, t1 = 1e9, titulo, w = 620 }) => {
  if (t < items[0].t0 - 0.3 || t > t1 + 0.3) return null;
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e = ent(t, items[0].t0 - 0.3, 0, { damping: 12, stiffness: 180 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${e * out}) rotate(-2deg)`, transformOrigin: "top left", background: "#f4ead2", border: `8px solid ${TINTA}`, borderRadius: 24, padding: "22px 34px", boxShadow: `0 14px 0 rgba(20,10,40,.4)`, fontFamily, fontWeight: 700 }}>
      {titulo && <div style={{ fontSize: size * 0.8, color: C.rojo, marginBottom: 8, letterSpacing: 2 }}>{titulo}</div>}
      {items.map((it, i) => {
        const i0 = i === 0 ? it.t0 - 0.3 : it.t0;
        if (t < i0) return <div key={i} style={{ height: size * 1.25 }} />;
        const s = ent(t, i0, 0, { damping: 10, stiffness: 220 });
        const tw = it.tacha !== undefined ? interpolate(t, [it.tacha, it.tacha + 0.3], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return (
          <div key={i} style={{ position: "relative", fontSize: size, color: TINTA, lineHeight: 1.25, transform: `translateX(${(1 - s) * -60}px)`, opacity: s, whiteSpace: "nowrap" }}>
            <span style={{ color: it.ok ? "#2f9a4a" : C.rojo }}>{it.ok ? "✔" : "•"}</span> {it.txt}
            {tw > 0 && <div style={{ position: "absolute", left: 0, top: "52%", height: size * 0.14, width: `${tw}%`, background: C.rojo, borderRadius: 6 }} />}
          </div>
        );
      })}
    </div>
  );
};
// soga que cae desde arriba de la pantalla (transiciones "grab a rope")
export const Soga: React.FC<{ t: number; t0: number; x: number; largo?: number }> = ({ t, t0, x, largo = 700 }) => {
  if (t < t0) return null;
  const u = interpolate(t, [t0, t0 + 0.35], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const sw = Math.sin((t - t0) * 4) * 8;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
      <g transform={`translate(${x} -20) rotate(${sw})`}>
        <path d={`M 0 0 L 0 ${largo * u}`} stroke="#c9a06a" strokeWidth={26} />
        {Array.from({ length: Math.floor((largo * u) / 34) }, (_, i) => <path key={i} d={`M -13 ${i * 34} l 26 18`} stroke="#8a6a3a" strokeWidth={6} />)}
        <circle cy={largo * u} r={22} fill="#a8803a" />
      </g>
    </svg>
  );
};
