import React from "react";
import { AbsoluteFill, spring, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fredoka";
import { rnd, clamp } from "../soot/lib";
import MAPA from "./mapa.json";

// Kit de Soot v3: TODO en código (cero imágenes). Cielos por capas, colinas con paralaje, objetos,
// mapa de puntos real, chapitas y contadores. Paleta saturada de complementarios (vara del short de los zombies).
export const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700"] });
export const FPS = 30;
export const C = {
  noche: "#1b1240", noche2: "#2d1b69", violeta: "#5b2bb5", lila: "#9b7bf0", teal: "#2ec4d6", lima: "#9be15d",
  rojo: "#e8344a", ambar: "#ffb020", naranja: "#ff7a3d", rosa: "#ff6f91", crema: "#fff3d6", oro: "#f7c548", tierra: "#c9773a",
};

export const ent = (t: number, t0: number, d = 0, cfg = { damping: 12, stiffness: 170 }) =>
  spring({ frame: Math.round((t - t0 - d) * FPS), fps: FPS, config: cfg });
export const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// ── escena: monta a sus hijos en [t0, t1 + SOLAPE) — la siguiente entra ENCIMA con su transición — y les aplica
// un empuje de cámara sorteado (in/out, foco 35-65 %) + golpes de zoom en las palabras fuertes.
export const SOLAPE = 0.34;
// soot02: además de las entradas del video 1, las del MUNDO CONTINUO — la cámara viaja dentro del mismo mundo:
// paneo (de lado, la anterior sale con `sale="paneo"`), baja (la cámara desciende; la anterior `sale="baja"`),
// atraviesa (zoom a través de un objeto en ix,iy; la anterior `sale="atraviesa"` se agranda hacia ese punto), nada.
// fondo="none" = transparente: debajo queda el mar persistente de Completo (nunca corta).
export type Entrada = "iris" | "barrido" | "zoom" | "diag" | "corte" | "sube" | "paneo" | "baja" | "atraviesa" | "nada" | "fundido";
export type Salida = "paneo" | "baja" | "atraviesa" | "fundido" | "nada";
const ENTRADAS: Entrada[] = ["iris", "barrido", "zoom", "diag", "corte", "sube", "barrido", "zoom"];
export const Escena: React.FC<{ t: number; t0: number; t1: number; children: React.ReactNode; zoom?: number; seed?: number; fondo?: string; entra?: Entrada; sale?: Salida; golpes?: number[]; banda?: string; ix?: number; iy?: number; sx?: number; sy?: number; quieta?: boolean }> = ({ t, t0, t1, children, zoom, seed, fondo = C.noche, entra, sale, golpes = [], banda, ix = 960, iy = 540, sx = 960, sy = 540, quieta }) => {
  if (t < t0 || t >= t1 + SOLAPE) return null;
  const r = rnd(seed ?? Math.round(t0 * 1000) + 3);
  const vel = 0.018 + r() * 0.02;
  const amp = quieta ? 0 : Math.min(0.035, zoom ?? vel * (t1 - t0));
  const dentro = r() < 0.5;
  const ox = 35 + r() * 30, oy = 35 + r() * 30;
  const tipo = entra ?? ENTRADAS[Math.floor(r() * ENTRADAS.length)];
  const col = banda ?? [C.rojo, C.ambar, C.teal, C.violeta, C.rosa][Math.floor(r() * 5)];
  const u = interpolate(t, [t0, t1 + SOLAPE], [0, 1], { easing: Easing.inOut(Easing.sin) });
  const k = dentro ? u : 1 - u;
  const golpe = golpes.reduce((a, g) => a + (t >= g ? 0.035 * Math.exp(-(t - g) * 7) : 0), 0);
  const transp = fondo === "none";
  const salida: Salida = sale ?? (transp ? "fundido" : "nada");
  // entrada (0 → 1 en ~0,32 s)
  const e = interpolate(t, [t0, t0 + SOLAPE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  // salida (0 → 1 en el solape final)
  const s = interpolate(t, [t1, t1 + SOLAPE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  let clip = "none", tr = "", op = 1;
  let extra: React.ReactNode = null;
  if (e < 1) {
    if (tipo === "iris") clip = `circle(${e * 125}% at ${ix}px ${iy}px)`;
    else if (tipo === "barrido") { tr = `translateX(${(1 - e) * 105}%)`; extra = <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: `${(1 - e) * 105}%`, marginLeft: -140, background: col }} />; }
    else if (tipo === "sube") { tr = `translateY(${(1 - e) * 105}%)`; extra = <div style={{ position: "absolute", left: 0, right: 0, height: 120, top: `${(1 - e) * 105}%`, marginTop: -120, background: col }} />; }
    else if (tipo === "diag") { const p = e * 260 - 60; clip = `polygon(-10% -10%, ${p}% -10%, ${p - 60}% 110%, -10% 110%)`; }
    else if (tipo === "zoom") tr = `scale(${1.6 - 0.6 * e})`;
    else if (tipo === "paneo") tr = `translateX(${(1 - e) * 100}%)`;
    else if (tipo === "baja") tr = `translateY(${(1 - e) * 100}%)`;
    else if (tipo === "atraviesa") { tr = `scale(${0.55 + 0.45 * e})`; op = Math.min(1, e * 1.6); }
    else if (tipo === "fundido") op = e;
  }
  if (t >= t1) {
    if (salida === "paneo") tr = `translateX(${-s * 100}%)`;
    else if (salida === "baja") tr = `translateY(${-s * 100}%)`;
    else if (salida === "atraviesa") { tr = `translate(${(960 - sx) * s * 2}px, ${(540 - sy) * s * 2}px) scale(${1 + s * 3})`; op = 1 - s; }
    else if (salida === "fundido") op = 1 - s;
  }
  const zoomIn = tipo === "zoom" || tipo === "atraviesa";
  const corteGolpe = tipo === "corte" ? 0.09 * Math.exp(-(t - t0) * 8) : 0;
  return (
    <>
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: transp ? undefined : fondo, clipPath: clip, transform: tr, transformOrigin: salida === "atraviesa" && t >= t1 ? `${sx}px ${sy}px` : tipo === "atraviesa" ? `${ix}px ${iy}px` : undefined, opacity: tipo === "zoom" ? Math.min(1, e * 2.2) : zoomIn ? op : op }}>
        <AbsoluteFill style={{ transformOrigin: `${ox}% ${oy}%`, transform: `scale(${1 + amp * k + golpe + corteGolpe})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {extra && <AbsoluteFill style={{ pointerEvents: "none" }}>{extra}</AbsoluteFill>}
    </>
  );
};
// cámara de mundo: encuadra un set grande con keyframes [t, fx, fy, z] (punto del set que queda al centro, zoom)
export const Cam: React.FC<{ t: number; k: [number, number, number, number][]; children: React.ReactNode }> = ({ t, k, children }) => {
  let i = 0;
  while (i < k.length - 1 && k[i + 1][0] <= t) i++;
  const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
  const u = b[0] > a[0] ? interpolate(t, [a[0], b[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 0;
  const fx = a[1] + (b[1] - a[1]) * u, fy = a[2] + (b[2] - a[2]) * u, z = a[3] + (b[3] - a[3]) * u;
  return <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - fx * z}px, ${540 - fy * z}px) scale(${z})` }}>{children}</AbsoluteFill>;
};

// ── partículas: polvo, brasas, luciérnagas, destellos, lluvia de oro
export const Particulas: React.FC<{ t: number; tipo: "polvo" | "brasas" | "luciernagas" | "destellos" | "lluviaoro"; n?: number; seed?: number }> = ({ t, tipo, n = 40, seed = 3 }) => {
  const r = rnd(seed * 7 + 1);
  const ps = Array.from({ length: n }, () => ({ x: r() * 1920, y: r() * 1080, v: 0.4 + r(), f: r() * 6, s: r() }));
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {ps.map((p, i) => {
        if (tipo === "polvo") {
          const x = ((p.x + t * 30 * p.v + Math.sin(t * 0.7 + p.f) * 40) % 1960) - 20, y = p.y + Math.sin(t * 0.5 + p.f) * 30;
          return <circle key={i} cx={x} cy={y} r={2 + p.s * 4} fill="#fff1d0" opacity={0.18 + 0.25 * p.s} />;
        }
        if (tipo === "brasas") {
          const y = 1100 - ((p.y + t * 90 * p.v) % 1180), x = p.x + Math.sin(t * 1.3 + p.f) * 50;
          return <circle key={i} cx={x} cy={y} r={2 + p.s * 3.5} fill={p.s > 0.5 ? "#ffb347" : "#ff6a3d"} opacity={0.5 + 0.5 * Math.sin(t * 5 + p.f) ** 2} />;
        }
        if (tipo === "luciernagas") {
          const x = p.x + Math.sin(t * 0.6 * p.v + p.f) * 70, y = 560 + (p.y % 520) + Math.cos(t * 0.8 + p.f) * 40;
          const a = Math.max(0, Math.sin(t * 1.8 * p.v + p.f));
          return <g key={i} opacity={a}><circle cx={x} cy={y} r={14} fill="#d9ff7a" opacity={0.18} /><circle cx={x} cy={y} r={4} fill="#f2ffb0" /></g>;
        }
        if (tipo === "lluviaoro") {
          const y = ((p.y + t * 260 * p.v) % 1180) - 60, x = p.x;
          return <rect key={i} x={x} y={y} width={7} height={7} transform={`rotate(${t * 200 * p.v + p.f * 60} ${x + 3} ${y + 3})`} fill={p.s > 0.5 ? C.oro : "#fff6c8"} />;
        }
        const a = Math.max(0, Math.sin(t * 2.4 * p.v + p.f)) ** 6;
        const d = 10 + p.s * 18;
        return <path key={i} d={`M ${p.x} ${p.y - d} L ${p.x + d * 0.22} ${p.y - d * 0.22} L ${p.x + d} ${p.y} L ${p.x + d * 0.22} ${p.y + d * 0.22} L ${p.x} ${p.y + d} L ${p.x - d * 0.22} ${p.y + d * 0.22} L ${p.x - d} ${p.y} L ${p.x - d * 0.22} ${p.y - d * 0.22} Z`} fill="#fff8d6" opacity={a} />;
      })}
    </svg>
  );
};
// rayos de luz que giran lento detrás de un astro u objeto
export const Rayos: React.FC<{ t: number; x: number; y: number; color?: string; n?: number; op?: number; largo?: number }> = ({ t, x, y, color = "#fff3c4", n = 14, op = 0.13, largo = 1400 }) => (
  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
    <g transform={`translate(${x} ${y}) rotate(${t * 6})`}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2, b = a + Math.PI / n / 1.4;
        return <path key={i} d={`M 0 0 L ${Math.cos(a) * largo} ${Math.sin(a) * largo} L ${Math.cos(b) * largo} ${Math.sin(b) * largo} Z`} fill={color} opacity={op} />;
      })}
    </g>
  </svg>
);
// primer plano oscuro (pasto/piedras) que pasa con paralaje: da profundidad
export const Frente: React.FC<{ t: number; color?: string; vel?: number; seed?: number }> = ({ t, color = "#1a0d2a", vel = 60, seed = 5 }) => {
  const r = rnd(seed);
  const mats = Array.from({ length: 9 }, (_, i) => ({ x: i * 260 + r() * 120, w: 160 + r() * 220, h: 50 + r() * 90, pasto: r() < 0.6 }));
  const dx = (t * vel) % 2340;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {mats.map((m, i) => {
        const x = ((m.x - dx + 2340) % 2340) - 200;
        const w = m.w / 7;
        return m.pasto ? (
          <g key={i} fill={color}>
            {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M ${x + k * w} 1090 Q ${x + k * w + 6} ${1080 - m.h * 0.7} ${x + k * w + 18 + Math.sin(t * 2 + k) * 6} ${1080 - m.h * (0.7 + ((k * 37) % 10) / 30)} Q ${x + k * w + 16} 1060 ${x + k * w + 24} 1090 Z`} />)}
          </g>
        ) : <ellipse key={i} cx={x + m.w / 2} cy={1095} rx={m.w / 2} ry={m.h * 0.7} fill={color} />;
      })}
    </svg>
  );
};
// emociones sobre la cabeza (sudor, lágrimas, !, ?, enojo, brillos, susto)
export type Emo = "sudor" | "lagrimas" | "excl" | "preg" | "enojo" | "brillos" | "susto";
export const Emote: React.FC<{ t: number; t0: number; t1?: number; tipo: Emo; x: number; y: number; s?: number }> = ({ t, t0, t1 = 1e9, tipo, x, y, s = 1 }) => {
  if (t < t0 || t > t1) return null;
  const e = ent(t, t0, 0, { damping: 9, stiffness: 220 });
  const lt = t - t0;
  let g: React.ReactNode = null;
  if (tipo === "sudor") { const k = (lt * 0.9) % 1; g = <path transform={`translate(110 ${-40 + k * 70})`} d="M 0 -26 Q 16 0 0 12 Q -16 0 0 -26 Z" fill="#7fd6ff" stroke="#fff" strokeWidth={4} opacity={1 - k * 0.6} />; }
  if (tipo === "lagrimas") g = <>{[-1, 1].map((d) => <path key={d} d={`M ${d * 38} 20 q ${d * 4} 40 ${d * 2} ${60 + Math.sin(lt * 9) * 6}`} stroke="#7fd6ff" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />)}</>;
  if (tipo === "excl" || tipo === "preg") g = <g transform={`translate(130 -150) rotate(${Math.sin(lt * 8) * 6})`}><ellipse cx={0} cy={0} rx={48} ry={56} fill={tipo === "excl" ? C.rojo : C.violeta} stroke="#fff" strokeWidth={6} /><text x={0} y={24} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={72} fill="#fff">{tipo === "excl" ? "!" : "?"}</text></g>;
  if (tipo === "enojo") g = <g transform={`translate(90 -120) scale(${1 + Math.sin(lt * 14) * 0.08})`} stroke={C.rojo} strokeWidth={11} strokeLinecap="round">{[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M 8 -26 Q 6 -8 26 -8" fill="none" />)}</g>;
  if (tipo === "brillos") g = <>{[[-130, -120], [130, -90], [90, -190]].map(([dx, dy], i) => { const a = Math.max(0, Math.sin(lt * 6 + i * 2)); const d = 26 * a; return <path key={i} transform={`translate(${dx} ${dy})`} d={`M 0 ${-d} L ${d * 0.25} ${-d * 0.25} L ${d} 0 L ${d * 0.25} ${d * 0.25} L 0 ${d} L ${-d * 0.25} ${d * 0.25} L ${-d} 0 L ${-d * 0.25} ${-d * 0.25} Z`} fill="#fff3a0" />; })}</>;
  if (tipo === "susto") g = <g stroke="#fff" strokeWidth={8} strokeLinecap="round">{[-1, 1].map((d) => [0, 1, 2].map((i) => <line key={`${d}${i}`} x1={d * (125 + i * 4)} y1={-60 + i * 30} x2={d * (160 + i * 4 + Math.sin(lt * 20) * 6)} y2={-70 + i * 30} />))}</g>;
  return (
    <svg style={{ position: "absolute", left: x - 200 * s, top: y - 200 * s, overflow: "visible", pointerEvents: "none" }} width={400 * s} height={400 * s} viewBox="-200 -200 400 400">
      <g transform={`scale(${e})`}>{g}</g>
    </svg>
  );
};
// centro de la cabeza de una Persona en pantalla (para colgarle emociones)
export const cabeza = (x: number, y: number, h = 560) => ({ x, y: y - 450 * (h / 560), s: h / 560 });

// ── cielos
const CIELOS = {
  atardecer: ["#2d1b69", "#7a2f8f", "#e2557a", "#ff9a4d", "#ffd27a"],
  noche: ["#0e0a2a", "#1b1240", "#2d1b69", "#4a2f8f", "#6b48b8"],
  dia: ["#4fb3e8", "#78c8ee", "#a8dcf2", "#d6f0f7", "#fff3d6"],
  polvo: ["#c26a3a", "#e08a4a", "#f2ae62", "#f7c98a", "#fde3b4"],
  sangre: ["#1a0614", "#4a0f2a", "#8c1d34", "#d6423a", "#ff8a4d"],
};
export type Cielo = keyof typeof CIELOS;
export const Cielo: React.FC<{ tipo: Cielo }> = ({ tipo }) => {
  const s = CIELOS[tipo];
  return <AbsoluteFill style={{ background: `linear-gradient(180deg, ${s[0]} 0%, ${s[1]} 30%, ${s[2]} 55%, ${s[3]} 78%, ${s[4]} 100%)` }} />;
};
export const Estrellas: React.FC<{ t: number; n?: number; seed?: number; alto?: number }> = ({ t, n = 70, seed = 4, alto = 620 }) => {
  const r = rnd(seed);
  const e = Array.from({ length: n }, () => [r() * 1920, r() * alto, 1 + r() * 2.6, r() * 6]);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {e.map(([x, y, s, f], i) => <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={0.45 + 0.45 * Math.sin(t * 2 + f)} />)}
    </svg>
  );
};
export const Astro: React.FC<{ x: number; y: number; r: number; luna?: boolean }> = ({ x, y, r, luna }) => (
  <svg style={{ position: "absolute", left: x - r * 3, top: y - r * 3 }} width={r * 6} height={r * 6}>
    <defs>
      <radialGradient id={`halo${x}${y}`}><stop offset="0.3" stopColor={luna ? "#fff6d8" : "#fff0b0"} stopOpacity={0.55} /><stop offset="1" stopColor={luna ? "#fff6d8" : "#ffb347"} stopOpacity={0} /></radialGradient>
    </defs>
    <circle cx={r * 3} cy={r * 3} r={r * 3} fill={`url(#halo${x}${y})`} />
    <circle cx={r * 3} cy={r * 3} r={r} fill={luna ? "#fff6d8" : "#fff0b0"} />
    {luna && <><circle cx={r * 2.7} cy={r * 2.8} r={r * 0.18} fill="#e8dcb4" /><circle cx={r * 3.35} cy={r * 3.3} r={r * 0.12} fill="#e8dcb4" /></>}
  </svg>
);
// colinas por capas: cada capa una curva suave sorteada; `dx` = paralaje en px (las de atrás se mueven menos)
export const Colinas: React.FC<{ capas: string[]; base?: number; dx?: number; seed?: number; alto?: number }> = ({ capas, base = 640, dx = 0, seed = 9, alto = 90 }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {capas.map((col, i) => {
      const r = rnd(seed + i * 17);
      const y0 = base + i * ((1080 - base) / (capas.length + 0.6));
      const desp = (dx * (i + 1)) / capas.length;
      const pts: string[] = [];
      for (let k = -2; k <= 26; k++) {
        const x = k * 90 - (desp % 180);
        pts.push(`${x},${y0 - (Math.sin(k * 0.55 + seed + i) * 0.5 + 0.5) * alto * (0.6 + r() * 0.5)}`);
      }
      return <polygon key={i} points={`-300,1080 ${pts.join(" ")} 2300,1080`} fill={col} strokeLinejoin="round" />;
    })}
  </svg>
);

// ── chapita (CORNELL · 2015 de la ref)
export const Chip: React.FC<{ t: number; t0: number; t1?: number; text: string; color?: string; x: number; y: number; size?: number; centro?: boolean; tinta?: string }> = ({ t, t0, t1 = 1e9, text, color = C.violeta, x: x0, y: y0, size: size0 = 62, centro, tinta = "#fff" }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  // zona segura: nunca cortado contra los bordes (90 px arriba, 64 a los costados) ni ilegible (≥34 px)
  const size = Math.max(34, size0);
  const w = text.length * size * 0.64 + size * 0.84, h = size * 1.47;
  const izq = Math.max(64, Math.min(1856 - w, centro ? x0 - w / 2 : x0));
  const x = centro ? izq + w / 2 : izq;
  const y = Math.max(90 + h / 2, Math.min(1016 - h / 2, y0));
  // entra desde 60 % con fundido corto: nunca "nace microscópica"
  const s = 0.6 + 0.4 * ent(t, t0, 0, { damping: 11, stiffness: 180 });
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: prog(t, t0, t0 + 0.1) * Math.min(1, out * 1.6), transform: `translate(${centro ? "-50%" : "0"}, -50%) scale(${s * (0.7 + 0.3 * out)}) rotate(${(1 - s) * -12}deg)`, overflow: "hidden", transformOrigin: centro ? "center" : "left center", fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: color, padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: size * 0.3, boxShadow: "0 8px 0 rgba(20,10,50,.35)", letterSpacing: 1, whiteSpace: "nowrap", lineHeight: 1.15 }}>
      {text}
      <div style={{ position: "absolute", top: 0, bottom: 0, width: size * 0.9, left: `${interpolate(t, [t0 + 0.12, t0 + 0.6], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, background: "linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)", transform: "skewX(-20deg)" }} />
    </div>
  );
};
// texto grande con contorno (títulos)
export const Grande: React.FC<{ t: number; t0: number; text: string; x?: number; y: number; size?: number; color?: string; borde?: string }> = ({ t, t0, text, x = 960, y: y0, size = 150, color = C.crema, borde = C.noche }) => {
  if (t < t0) return null;
  const s = 0.6 + 0.4 * ent(t, t0, 0, { damping: 9, stiffness: 190 });
  const y = Math.max(80 + size * 0.6, Math.min(1000 - size * 0.6, y0));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: prog(t, t0, t0 + 0.1), transform: `translate(-50%, -50%) scale(${s})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 2, textShadow: `0 ${size * 0.07}px 0 ${borde}` }}>
      {text}
    </div>
  );
};

// ── mapa de puntos (tierra real de world-atlas, imperio c. 117 dibujado a mano)
const M = MAPA as { paso: number; pts: [number, number, number][]; lugares: { n: string; x: number; y: number }[] };
export const lugar = (n: string) => M.lugares.find((l) => l.n === n)!;
export const MapaPuntos: React.FC<{ t: number; enciende?: [number, number]; desde?: string; brillo?: string; pulsa?: string[]; t0Pulsa?: number; rutas?: { a: string; t0: number }[]; vuela?: { n: string; z: number; t: [number, number] } }> = ({ t, enciende, desde = "ROME", brillo = C.ambar, pulsa = [], t0Pulsa = 0, rutas = [], vuela }) => {
  const o = lugar(desde);
  const maxD = 1500;
  const u = enciende ? prog(t, enciende[0], enciende[1]) : 1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.noche2} 0%, ${C.noche} 70%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: vuela ? (() => { const v = prog(t, vuela.t[0], vuela.t[1]); const l = lugar(vuela.n); const z = 1 + (vuela.z - 1) * v; return `translate(${(960 - l.x * z) * v + 0 * (1 - v)}px, ${(540 - l.y * z) * v}px) scale(${z})`; })() : undefined }}>
        {M.pts.map(([x, y, imp], i) => {
          const d = Math.hypot(x - o.x, y - o.y) / maxD;
          const on = imp && u > d;
          const fresco = on ? clamp((u - d) * 12, 0, 1) : 0;
          return <circle key={i} cx={x} cy={y} r={on ? 3.6 + (1 - fresco) * 2.5 : 3.2} fill={on ? brillo : "#3d2d7a"} opacity={on ? 0.95 : 0.8} />;
        })}
        {rutas.map(({ a, t0 }, i) => {
          if (t < t0) return null;
          const l = lugar(a);
          const mx = (o.x + l.x) / 2, my = Math.min(o.y, l.y) - 120;
          const u = prog(t, t0, t0 + 0.7);
          return (
            <g key={a + i}>
              <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${l.x} ${l.y}`} stroke="#fff" strokeWidth={5} fill="none" strokeDasharray="14 12" strokeDashoffset={-t * 60} opacity={0.85} pathLength={1000} style={{ strokeDasharray: `${u * 1000} 1000` }} />
              {u >= 1 && <circle cx={l.x} cy={l.y} r={12} fill={C.ambar} stroke="#fff" strokeWidth={4} />}
            </g>
          );
        })}
        {pulsa.map((n, i) => {
          const l = lugar(n);
          const k = ((t - t0Pulsa - i * 0.25) % 1.4) / 1.4;
          if (t < t0Pulsa + i * 0.25) return null;
          return (
            <g key={n}>
              <circle cx={l.x} cy={l.y} r={14 + k * 60} fill="none" stroke={C.rojo} strokeWidth={5} opacity={1 - k} />
              <circle cx={l.x} cy={l.y} r={14} fill={C.rojo} stroke="#fff" strokeWidth={4} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ── objetos
export const Moneda: React.FC<{ x: number; y: number; r?: number; rot?: number; gira?: number; t?: number }> = ({ x, y, r = 40, rot = 0, gira = 0, t = 0 }) => (
  <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible", transform: gira ? `scaleX(${Math.max(0.08, Math.abs(Math.cos(t * gira * Math.PI)))})` : undefined }} width={r * 2} height={r * 2}>
    <g transform={`rotate(${rot} ${r} ${r})`}>
      <ellipse cx={r} cy={r + r * 0.12} rx={r} ry={r} fill="#b87a14" />
      <circle cx={r} cy={r} r={r} fill={C.oro} />
      <circle cx={r} cy={r} r={r * 0.74} fill="none" stroke="#d99a1e" strokeWidth={r * 0.1} />
      <text x={r} y={r + r * 0.32} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={r * 0.9} fill="#b87a14">X</text>
      <path d={`M ${r * 0.45} ${r * 0.55} Q ${r * 0.7} ${r * 0.25} ${r * 1.1} ${r * 0.3}`} stroke="#fff6c8" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
export const Pan: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 90 * s, top: y - 60 * s, overflow: "visible" }} width={180 * s} height={120 * s} viewBox="0 0 180 120">
    <ellipse cx={90} cy={70} rx={86} ry={46} fill="#a8621f" />
    <ellipse cx={90} cy={62} rx={80} ry={40} fill="#d98a35" />
    {[-1, 0, 1].map((k) => <path key={k} d={`M ${70 + k * 40} 38 Q ${80 + k * 40} 62 ${72 + k * 40} 86`} stroke="#a8621f" strokeWidth={7} fill="none" strokeLinecap="round" />)}
    <path d="M 30 50 Q 60 30 100 32" stroke="#ffd08a" strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);
export const Bota: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 80 * s, top: y - 90 * s, overflow: "visible" }} width={160 * s} height={180 * s} viewBox="0 0 160 180">
    <path d="M 40 10 L 90 10 L 92 110 L 150 130 Q 160 160 140 168 L 30 168 Q 20 120 40 10 Z" fill="#7a4520" />
    {[30, 55, 80, 105].map((yy) => <line key={yy} x1={42} y1={yy} x2={90} y2={yy} stroke="#4a2810" strokeWidth={6} />)}
    <rect x={26} y={160} width={124} height={14} rx={6} fill="#3d220d" />
    {[50, 80, 110, 135].map((xx) => <circle key={xx} cx={xx} cy={176} r={5} fill="#c8ccd4" />)}
  </svg>
);
export const Tienda: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 140 * s, top: y - 150 * s, overflow: "visible" }} width={280 * s} height={160 * s} viewBox="0 0 280 160">
    <path d="M 10 150 L 140 10 L 270 150 Z" fill="#c9a36a" />
    <path d="M 140 10 L 270 150 L 180 150 Z" fill="#a8834e" />
    <path d="M 110 150 L 140 70 L 170 150 Z" fill="#5a3a1e" />
    <line x1={140} y1={10} x2={140} y2={-14} stroke="#5a3a1e" strokeWidth={6} />
  </svg>
);
export const Pergamino: React.FC<{ x: number; y: number; w: number; abre: number; lineas?: number; firma?: number; titulo?: string }> = ({ x, y, w, abre, lineas = 9, firma = 0, titulo }) => {
  const H = 640 * abre;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - H / 2 - 30 }}>
      <svg width={w} height={H + 60} style={{ overflow: "visible" }}>
        <rect x={20} y={30} width={w - 40} height={H} fill="#f6e3b4" />
        <rect x={20} y={30} width={22} height={H} fill="#e6cc92" />
        {titulo && abre > 0.4 && <text x={w / 2} y={100} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#7a3d14" opacity={clamp((abre - 0.4) * 3, 0, 1)}>{titulo}</text>}
        {Array.from({ length: lineas }, (_, i) => {
          const yy = 140 + i * 46;
          if (yy > H) return null;
          const r = rnd(i + 3);
          return <rect key={i} x={70} y={yy} width={(w - 160) * (0.55 + r() * 0.45)} height={12} rx={6} fill="#c79a5a" opacity={0.75} />;
        })}
        {firma > 0 && (
          <path d={`M 80 ${H - 30} q 30 -50 50 -10 t 40 0 q 20 -40 40 0 t 50 -10 q 30 20 70 -20`} stroke="#2b3a8f" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - firma)} />
        )}
        <rect x={0} y={10} width={w} height={40} rx={20} fill="#c98f4a" />
        <rect x={0} y={H + 10} width={w} height={40} rx={20} fill="#c98f4a" />
        <rect x={10} y={16} width={w - 20} height={10} rx={5} fill="#e8b878" />
      </svg>
    </div>
  );
};
export const Aguila: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 160 * s, top: y - 120 * s, overflow: "visible" }} width={320 * s} height={600 * s} viewBox="0 0 320 600">
    <defs><linearGradient id="oro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0a0" /><stop offset="0.45" stopColor="#f2b52e" /><stop offset="1" stopColor="#a8650f" /></linearGradient></defs>
    <rect x={150} y={150} width={20} height={460} fill="#7a4a22" />
    <path d="M 160 40 Q 120 70 130 110 L 20 40 Q 30 130 120 150 L 200 150 Q 290 130 300 40 L 190 110 Q 200 70 160 40 Z" fill="url(#oro)" />
    <circle cx={160} cy={60} r={22} fill="url(#oro)" />
    <path d="M 170 58 L 196 66 L 170 72 Z" fill="#a8650f" />
    <circle cx={164} cy={56} r={4} fill="#5a3008" />
    <rect x={110} y={150} width={100} height={22} rx={8} fill="url(#oro)" />
    <rect x={120} y={200} width={80} height={110} rx={6} fill="#c81d2e" />
    <text x={160} y={268} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#ffd77a">SPQR</text>
  </svg>
);
export const Casa: React.FC<{ x: number; y: number; s?: number; tono?: string; techo?: string; luz?: boolean }> = ({ x, y, s = 1, tono = "#e8b98a", techo = "#b5452c", luz }) => (
  <svg style={{ position: "absolute", left: x - 130 * s, top: y - 220 * s, overflow: "visible" }} width={260 * s} height={220 * s} viewBox="0 0 260 220">
    <rect x={20} y={90} width={220} height={130} fill={tono} />
    <rect x={160} y={90} width={80} height={130} fill="rgba(60,20,30,.18)" />
    <path d="M 0 96 L 130 20 L 260 96 Z" fill={techo} />
    <rect x={100} y={140} width={56} height={80} rx={26} fill="#5a3418" />
    <rect x={40} y={120} width={40} height={36} rx={6} fill={luz ? "#ffd27a" : "#5a3418"} />
    <rect x={182} y={120} width={40} height={36} rx={6} fill={luz ? "#ffd27a" : "#5a3418"} />
  </svg>
);
export const Mesa: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 520 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y, overflow: "visible" }} width={w} height={220}>
    <rect x={30} y={30} width={22} height={190} fill="#6b3a1f" />
    <rect x={w - 52} y={30} width={22} height={190} fill="#6b3a1f" />
    <rect x={0} y={0} width={w} height={40} rx={10} fill="#a8622c" />
    <rect x={0} y={30} width={w} height={14} fill="#7a4520" />
  </svg>
);
export const Pluma: React.FC = () => (
  <g transform="rotate(-30)">
    <path d="M 0 0 Q -30 -90 10 -170 Q 40 -90 6 0 Z" fill="#fff6e8" />
    <line x1={3} y1={0} x2={10} y2={-160} stroke="#c9b9a0" strokeWidth={4} />
    <line x1={3} y1={0} x2={0} y2={30} stroke="#2b2b2b" strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const Palo: React.FC<{ largo?: number }> = ({ largo = 230 }) => (
  <g transform="rotate(-100)">
    <path d={`M -6 -40 Q 0 ${largo / 2} 4 ${largo}`} stroke="#6b3a1f" strokeWidth={16} fill="none" strokeLinecap="round" />
    {[0.25, 0.5, 0.75].map((k) => <circle key={k} cx={k * 3} cy={largo * k - 20} r={9} fill="#7d4a24" />)}
  </g>
);
export const Garrote: React.FC = () => (
  <g transform="rotate(-150)"><path d="M -5 -20 L 8 150 Q 30 170 10 190 Q -20 180 -14 150 Z" fill="currentColor" /></g>
);
export const Zzz: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <>
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.6 + i / 3) % 1);
      return <div key={i} style={{ position: "absolute", left: x + k * 90, top: y - k * 160, fontFamily, fontWeight: 700, fontSize: 40 + k * 50, color: "#fff", opacity: Math.sin(k * Math.PI) }}>z</div>;
    })}
  </>
);
// grilla de 100 reclutas (ALIVE/LOST), del v2
const Fig: React.FC<{ c: string; s?: number }> = ({ c, s = 1 }) => (
  <svg width={26 * s} height={34 * s} viewBox="0 0 26 34"><circle cx={13} cy={7} r={6} fill={c} /><rect x={4} y={15} width={18} height={18} rx={8} fill={c} /></svg>
);
export const Grilla: React.FC<{ t: number; t0: number; de: number; a: number; tA: [number, number]; x?: number; y?: number; s?: number }> = ({ t, t0, de, a, tA, x = 960, y = 540, s = 1.6 }) => {
  const orden = React.useMemo(() => { const r = rnd(99); return Array.from({ length: 100 }, (_, i) => i).sort(() => r() - 0.5); }, []);
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 13, stiffness: 160 });
  const muertos = Math.round(interpolate(t, tA, [de, a], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const muerto = new Set(orden.slice(0, muertos));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e})`, background: "rgba(27,18,64,.92)", borderRadius: 34, padding: "28px 30px 22px", boxShadow: "0 14px 0 rgba(10,5,30,.45)" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(20, ${26 * s}px)`, gap: `${6 * s}px ${4 * s}px` }}>
        {Array.from({ length: 100 }, (_, i) => {
          const k = orden.indexOf(i);
          if (k < de || k >= a) return <Fig key={i} s={s} c={k < de ? "#5d5a7a" : C.teal} />;
          const td = tA[0] + ((k - de + 0.5) / (a - de)) * (tA[1] - tA[0]);
          const u = clamp((t - td) / 0.3, 0, 1);
          return (
            <div key={i} style={{ transform: `translateY(${u * 8 * s}px) rotate(${u * 80}deg)`, transformOrigin: "50% 100%", opacity: 1 - u * 0.35 }}>
              <Fig s={s} c={u <= 0 ? C.teal : u < 0.5 ? C.rojo : "#5d5a7a"} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 18, fontFamily, fontWeight: 700, fontSize: 44 }}>
        <span style={{ background: C.teal, color: C.noche, padding: "4px 20px", borderRadius: 12 }}>ALIVE {100 - muertos}</span>
        <span style={{ background: "#5d5a7a", color: "#fff", padding: "4px 20px", borderRadius: 12 }}>LOST {muertos}</span>
      </div>
    </div>
  );
};

// banda oscura arriba/abajo para los textos sobre vistas llenas de caras (los chips no pisan cabezas)
export const Franja: React.FC<{ t: number; t0?: number; abajo?: boolean; alto?: number }> = ({ t, t0 = -1e9, abajo, alto = 250 }) =>
  t < t0 ? null : (
    <div style={{ position: "absolute", left: 0, width: 1920, height: alto, [abajo ? "bottom" : "top"]: 0, opacity: Math.min(1, (t - t0) * 4), background: `linear-gradient(${abajo ? "0deg" : "180deg"}, rgba(18,12,30,.96) 62%, rgba(18,12,30,0))` }} />
  );
