import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily, ent, prog, Rayos, Particulas } from "./kit";
import { Trampas } from "./kit2";
import { Persona, Expr, Ropa } from "./persona";
import { CHICO } from "./objetos";

// Piezas comunes de soot06: tarjeta de trampa (encima del mundo, sin cortar), inserto que se abre en iris desde
// un objeto del mundo y se cierra de vuelta hacia él, marcadores numerados en el mundo y la ruta de la noche.

// ── tarjeta de trampa: banda diagonal + número gigante + nombre + hora; el mundo sigue vivo atrás (oscurecido)
export const TarjetaTrampa: React.FC<{ t: number; t0: number; t1: number; n: number; nombre: string; hora: string; color?: string }> = ({ t, t0, t1, n, nombre, hora, color = C.rojo }) => {
  if (t < t0 - 0.05 || t > t1 + 0.4) return null;
  const e = prog(t, t0, t0 + 0.35), s = prog(t, t1, t1 + 0.4);
  const k = e * (1 - s);
  const num = ent(t, t0 + 0.08, 0, { damping: 8, stiffness: 200 });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(14,8,40,${0.55 * k})` }} />
      <div style={{ position: "absolute", left: -200, right: -200, top: 330, height: 420, background: color, transform: `skewY(-6deg) translateX(${(1 - e) * -2400 + s * 2400}px)`, boxShadow: "0 18px 0 rgba(10,5,30,.4)" }} />
      <div style={{ position: "absolute", left: -200, right: -200, top: 300, height: 20, background: C.oro, transform: `skewY(-6deg) translateX(${(1 - e) * 2400 - s * 2400}px)` }} />
      <div style={{ position: "absolute", left: 230, top: 540, transform: `translate(-50%,-50%) scale(${num * (1 - s)}) rotate(${(1 - num) * -30 - 6}deg)`, fontFamily, fontWeight: 700, fontSize: 420, color: C.crema, WebkitTextStroke: `30px ${C.noche}`, paintOrder: "stroke fill", lineHeight: 1 }}>{n}</div>
      <div style={{ position: "absolute", left: 470, top: 410, transform: `translateX(${(1 - ent(t, t0 + 0.15)) * 900}px) skewY(-6deg)`, opacity: 1 - s, fontFamily, fontWeight: 700, fontSize: 64, color: C.oro, letterSpacing: 4 }}>TRAP #{n} · {hora}</div>
      <div style={{ position: "absolute", left: 470, top: 470, transform: `translateX(${(1 - ent(t, t0 + 0.28)) * 1100}px) skewY(-6deg)`, opacity: 1 - s, fontFamily, fontWeight: 700, fontSize: 170, color: "#fff", WebkitTextStroke: `14px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", lineHeight: 1.1 }}>{nombre}</div>
      <div style={{ opacity: 1 - s }}><Trampas t={t} t0={t0 + 0.4} n={n} x={1300} y={820} on={C.oro} /></div>
    </AbsoluteFill>
  );
};

// ── inserto: escena a pantalla completa que nace en iris desde (ix, iy) — el objeto del mundo que la motiva —
// y al final se cierra hacia (ox, oy). Fondo saturado con rayos (la vara del video 1).
export const Inserto: React.FC<{ t: number; t0: number; t1: number; ix?: number; iy?: number; ox?: number; oy?: number; fondo?: string; fondo2?: string; rayos?: boolean; children: React.ReactNode; empuje?: number }> = ({ t, t0, t1, ix = 960, iy = 540, ox, oy, fondo = C.violeta, fondo2 = C.noche, rayos = true, children, empuje = 0.06 }) => {
  const dl = ix === 960 && iy === 540 ? 0 : 0.25; // encadenado (sale de otro inserto) = sin demora
  if (t < t0 + dl || t > t1) return null;
  const a = interpolate(t, [t0 + dl, t0 + dl + 0.35], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const b = interpolate(t, [t1 - 0.36, t1], [1, 0], { extrapolateLeft: "clamp", easing: Easing.in(Easing.cubic) });
  const r = Math.min(a, b);
  const cx = t < (t0 + t1) / 2 ? ix : ox ?? ix, cy = t < (t0 + t1) / 2 ? iy : oy ?? iy;
  const z = 1.04 + empuje * prog(t, t0, t1);
  return (
    <AbsoluteFill style={{ clipPath: r < 1 ? `circle(${r * 2300}px at ${cx}px ${cy}px)` : undefined }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${fondo}, ${fondo2} 85%)` }} />
      {rayos && <Rayos t={t} x={960} y={540} op={0.07} />}
      <AbsoluteFill style={{ transform: `scale(${z})` }}>{children}</AbsoluteFill>
      {r < 1 && <div style={{ position: "absolute", left: cx - r * 2300, top: cy - r * 2300, width: r * 4600, height: r * 4600, borderRadius: "50%", border: "16px solid #fff", boxSizing: "border-box" }} />}
    </AbsoluteFill>
  );
};

// ── marcador numerado clavado en el mundo (pin redondo con número) — coordenadas de mundo
export const Marcador: React.FC<{ t: number; t0: number; x: number; y: number; n: number | string; s?: number; color?: string; t1?: number }> = ({ t, t0, x, y, n, s = 1, color = C.rojo, t1 = 1e9 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0, 0, { damping: 8, stiffness: 220 }) * (t > t1 ? Math.max(0, 1 - (t - t1) / 0.3) : 1);
  const lat = 1 + Math.sin((t - t0) * 6) * 0.04;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${e * s * lat})`, transformOrigin: "50% 100%" }}>
      <svg width={140} height={180} viewBox="-70 -170 140 180" style={{ overflow: "visible" }}>
        <path d="M 0 0 Q -60 -70 -60 -110 A 60 60 0 1 1 60 -110 Q 60 -70 0 0 Z" fill={color} stroke="#fff" strokeWidth={10} />
        <text x={0} y={-86} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff">{n}</text>
      </svg>
    </div>
  );
};
// ── ruta punteada de puntos del mundo que se dibuja de a poco (u 0..1)
export const Ruta: React.FC<{ t: number; pts: [number, number][]; u: number; color?: string; w?: number }> = ({ t, pts, u, color = "#fff", w = 22 }) => {
  if (u <= 0) return null;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={10} height={10}>
      <path d={d} stroke="rgba(14,8,40,.55)" strokeWidth={w + 16} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} />
      <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} />
      <path d={d} stroke={C.rojo} strokeWidth={w * 0.45} fill="none" strokeLinejoin="round" strokeDasharray="30 40" strokeDashoffset={-t * 120} opacity={u >= 1 ? 1 : 0} />
    </svg>
  );
};
// ── rastrillo (portcullis) que cae en la puerta de la muralla (coordenadas de mundo)
export const Rastrillo: React.FC<{ t: number; tc: number }> = ({ t, tc }) => {
  if (t < tc || t > tc + 4) return null;
  const u = Math.min(1, ((t - tc) / 0.28) ** 2);
  const reb = t > tc + 0.28 ? Math.abs(Math.sin((t - tc - 0.28) * 20)) * Math.exp(-(t - tc - 0.28) * 8) * 30 : 0;
  const y = 3240 + (1 - u) * -320 - reb;
  return (
    <div style={{ position: "absolute", left: 2490, top: 3240, width: 260, height: 480, overflow: "hidden" }}><svg style={{ position: "absolute", left: 0, top: y - 3240, overflow: "visible" }} width={260} height={480}>
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={10 + i * 44} y={0} width={14} height={460} fill="#4a4a5a" />)}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={0} y={20 + i * 66} width={250} height={14} fill="#4a4a5a" />)}
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${10 + i * 44} 460 l 7 30 l 7 -30`} fill="#4a4a5a" />)}
    </svg></div>
  );
};
// ── confeti de felicitaciones (pantalla)
export const Confeti: React.FC<{ t: number; t0: number; n?: number }> = ({ t, t0, n = 90 }) => {
  if (t < t0 || t > t0 + 2.6) return null;
  const r = rnd(5);
  const u = t - t0;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (r() - 0.5) * 2.2, v = 900 + r() * 900, ox = r() < 0.5 ? 200 : 1720;
        const x = ox + Math.cos(a) * v * u * (ox < 960 ? 1 : -1) * 0.6, y = 1100 + Math.sin(a) * v * u + 900 * u * u;
        return <rect key={i} x={x} y={y} width={18} height={30} fill={[C.rojo, C.oro, C.teal, C.rosa, C.lima, C.lila][i % 6]} transform={`rotate(${u * 600 * (r() - 0.5)} ${x + 9} ${y + 15})`} />;
      })}
    </svg>
  );
};
// ── tarjetita con ícono para listas rápidas (FREEZE / STARVE / ...)
export const Ficha: React.FC<{ t: number; t0: number; x: number; y: number; label: string; color: string; icono: React.ReactNode; tacha?: number }> = ({ t, t0, x, y, label, color, icono, tacha = 1e9 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 9, stiffness: 220 });
  const tc = prog(t, tacha, tacha + 0.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e}) rotate(${(1 - e) * 20}deg)`, width: 250, height: 290, background: "#fff6e0", borderRadius: 28, border: `10px solid ${color}`, boxShadow: "0 12px 0 rgba(14,8,40,.45)", overflow: "hidden" }}>
      <svg width={230} height={200} viewBox="-115 -100 230 200" style={{ position: "absolute", left: 0, top: 6 }}>{icono}</svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color }}>{label}</div>
      {tc > 0 && <svg style={{ position: "absolute", inset: 0 }} width={230} height={270}><line x1={20} y1={20} x2={20 + 190 * tc} y2={20 + 230 * tc} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" /></svg>}
    </div>
  );
};
export const Brasas: React.FC<{ t: number }> = ({ t }) => <Particulas t={t} tipo="brasas" n={40} seed={9} />;

// ── VOS dentro de un inserto: el chico de la miniatura, grande y de cuerpo entero, actuando lo que se cuenta
// (la vara: nunca un objeto solo sobre rayos). Entra con salto desde abajo; gesto = brazos (bD/cD) + objeto en mano.
export const Yo: React.FC<{ t: number; t0: number; x: number; y?: number; h?: number; expr?: Expr; habla?: boolean; flip?: boolean; bD?: number; cD?: number; bI?: number; cI?: number; manoD?: React.ReactNode; mira?: number; tiembla?: boolean; ropa?: Ropa }> = ({ t, t0, x, y = 1050, h = 640, expr = "sorpresa", habla, flip, bD = 8, cD = 10, bI, cI, manoD, mira = 0, tiembla, ropa = CHICO }) => {
  if (t < t0) return null;
  const sube = interpolate(t, [t0, t0 + 0.35], [h * 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const tir = tiembla ? Math.sin(t * 70) * 4 : 0;
  return (
    <div style={{ position: "absolute", left: tir, top: sube }}>
      <Persona x={x} y={y} h={h} t={t} seed={7} ropa={ropa} expr={expr} habla={habla} flip={flip} bD={bD} cD={cD} bI={bI} cI={cI} manoD={manoD} mira={mira} />
    </div>
  );
};

// ── reloj de la noche (HUD fijo, abajo a la derecha): hora que avanza + trampa n/7 con 7 puntos que se van llenando
const HORAS: [number, number][] = [[55.2, 16], [201.5, 18], [281.6, 20], [415.5, 22], [550.2, 24], [660.9, 26], [749.5, 28], [813.5, 29]];
const TRAMPA_T0 = [55.2, 201.5, 281.6, 415.5, 550.2, 660.9, 749.5];
export const RelojNoche: React.FC<{ t: number }> = ({ t }) => {
  if (t < 58.0 || t > 813.3) return null;
  const ult = TRAMPA_T0.filter((x) => t >= x).pop() ?? 55.2; // sólo aparece ~6 s al empezar cada trampa: nunca pisa títulos
  const op = Math.min(prog(t, ult + 2.4, ult + 2.9), 1 - prog(t, ult + 8.5, ult + 9.0));
  const hh = interpolate(t, HORAS.map((k) => k[0]), HORAS.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h24 = Math.floor(hh) % 24, mm = Math.floor((hh % 1) * 60 / 15) * 15;
  const lbl = `${h24 % 12 === 0 ? 12 : h24 % 12}:${String(mm).padStart(2, "0")} ${h24 >= 12 ? "PM" : "AM"}`;
  const n = TRAMPA_T0.filter((x) => t >= x).length;
  const ang = (hh % 12) * 30, angM = (hh % 1) * 360;
  return (
    <div style={{ position: "absolute", right: 22, top: 18, transform: "scale(.78)", transformOrigin: "100% 0", opacity: op, display: "flex", alignItems: "center", gap: 14, background: "rgba(14,10,42,.82)", border: "5px solid #fff", borderRadius: 26, padding: "10px 20px 10px 12px", fontFamily, fontWeight: 700, color: C.crema, boxShadow: "0 8px 0 rgba(10,6,30,.4)" }}>
      <svg width={74} height={74} viewBox="-37 -37 74 74">
        <circle r={33} fill="#fff6e0" stroke={C.oro} strokeWidth={5} />
        <line x1={0} y1={0} x2={Math.sin(ang * Math.PI / 180) * 17} y2={-Math.cos(ang * Math.PI / 180) * 17} stroke={C.noche} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.sin(angM * Math.PI / 180) * 26} y2={-Math.cos(angM * Math.PI / 180) * 26} stroke={C.rojo} strokeWidth={4} strokeLinecap="round" />
        <circle r={4} fill={C.noche} />
      </svg>
      <div>
        <div style={{ fontSize: 40, lineHeight: 1 }}>{lbl}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
          <span style={{ fontSize: 22, color: C.oro, marginRight: 4 }}>TRAP {n}/7</span>
          {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: i < n ? C.rojo : "rgba(255,255,255,.25)", transform: `scale(${i === n - 1 ? 1 + 0.5 * (1 - prog(t, TRAMPA_T0[i], TRAMPA_T0[i] + 0.5)) : 1})` }} />)}
        </div>
      </div>
    </div>
  );
};
