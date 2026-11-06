// fb5nd · PIEZAS CON CUERPO del patio de suelo cemento: la losa del patio en perspectiva (trapecio con frente), el terreno
// EN CORTE por capas (tierra negra con raíces, tierra limpia, fondo compactado, suelo cemento en dos capas), el frasco de
// la prueba, el pisón, la pala, la regadera, la bolsa de cemento, el balde, la regla, la camioneta. Todo f(t).
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export const NEGRA = "#3a2819", CLARA = "#a88456", BARRO = "#5b4029", CHARCO = "#6d8192", SC = "#bfb39e", SCM = "#8f8473", SCS = "#cdc4b3", TOSCA = "#c6a675", MAD = "#9a6233", NYL = "rgba(30,34,38,.72)";

// punto sobre una losa trapecial: u 0..1 a lo ancho, v 0..1 de atrás (arriba) hacia adelante
export const mkF = (cx: number, y: number, w: number, d: number, back = 0.68) => (u: number, v: number): [number, number] => {
  const hw = lerp(back, 1, v) * w / 2;
  return [cx + (u - 0.5) * 2 * hw, y + v * d];
};
export const quad = (f: (u: number, v: number) => [number, number], u0: number, v0: number, u1: number, v1: number) =>
  [f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)].map((p) => p.join(",")).join(" ");

// la losa: cara de arriba + canto. children se dibujan encima con f()
export const Losa: React.FC<{ cx: number; y: number; w: number; d: number; h?: number; top?: string; side?: string; grano?: number; children?: (f: (u: number, v: number) => [number, number]) => React.ReactNode }> = ({ cx, y, w, d, h = 46, top = SC, side = SCM, grano = 60, children }) => {
  const f = mkF(cx, y, w, d);
  const [a, b] = [f(0, 1), f(1, 1)];
  return (
    <g>
      <polygon points={quad(f, 0, 0, 1, 1)} fill={top} />
      <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={h} fill={side} />
      {Array.from({ length: grano }, (_, i) => { const [x, yy] = f(hash(i, 11), hash(i, 12)); return <circle key={i} cx={x} cy={yy} r={1.5 + 2.5 * hash(i, 13)} fill="rgba(40,30,20,.2)" />; })}
      {children?.(f)}
    </g>
  );
};

// juntas sobre la losa: nu × nv paños, k 0..1 cuánto se dibujaron
export const Juntas: React.FC<{ f: (u: number, v: number) => [number, number]; nu: number; nv: number; k: number; col?: string; w?: number }> = ({ f, nu, nv, k, col = "#4b4238", w = 7 }) => k < 0.01 ? null : (
  <g>
    {Array.from({ length: nu - 1 }, (_, i) => { const u = (i + 1) / nu, [x0, y0] = f(u, 0), [x1, y1] = f(u, cl(k)); return <line key={"u" + i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={col} strokeWidth={w} strokeLinecap="round" />; })}
    {Array.from({ length: nv - 1 }, (_, i) => { const v = (i + 1) / nv, [x0, y0] = f(0, v), [x1, y1] = f(cl(k), v); return <line key={"v" + i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={col} strokeWidth={w} strokeLinecap="round" />; })}
  </g>
);

// charcos (barro): o 0..1
export const Charcos: React.FC<{ f: (u: number, v: number) => [number, number]; o: number; n?: number; seed?: number }> = ({ f, o, n = 7, seed = 3 }) => o < 0.02 ? null : (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => { const [x, y] = f(0.1 + 0.8 * hash(i, seed), 0.15 + 0.75 * hash(i, seed + 1)), r = 50 + 80 * hash(i, seed + 2); return (
      <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.32} fill={CHARCO} /><ellipse cx={x - r * 0.3} cy={y - r * 0.08} rx={r * 0.35} ry={r * 0.07} fill="#c9dbe6" opacity={0.6} /></g>); })}
    {Array.from({ length: 16 }, (_, i) => { const [x, y] = f(hash(i, seed + 5), hash(i, seed + 6)); return <path key={"z" + i} d={`M${x - 26},${y} q14,-12 26,0 q14,12 26,0`} stroke="#3e2b1a" strokeWidth={5} fill="none" />; })}
  </g>
);

// brillo diagonal que barre un polígono (agua que corre / luz)
export const Brillo: React.FC<{ id: string; pts: string; k: number; o?: number; w?: number }> = ({ id, pts, k, o = 0.55, w = 220 }) => {
  if (o <= 0.01) return null;
  const x = lerp(-400, 2300, cl(k));
  return (
    <g>
      <defs>
        <clipPath id={`br${id}`}><polygon points={pts} /></clipPath>
        <linearGradient id={`bg${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} /><stop offset=".5" stopColor="#fffaf0" stopOpacity={o} /><stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#br${id})`}><polygon points={`${x},0 ${x + w},0 ${x + w - 500},1080 ${x - 500},1080`} fill={`url(#bg${id})`} /></g>
    </g>
  );
};

// el terreno EN CORTE: capas de abajo hacia arriba desde `y`. tipo negra (raíces), clara, base (compactada), sc (suelo cemento)
export type Capa = { h: number; k: number; tipo: "negra" | "clara" | "base" | "sc" | "nylon" | "tosca"; col?: string; moj?: number };
export const Capas: React.FC<{ x: number; y: number; w: number; capas: Capa[]; seed?: number }> = ({ x, y, w, capas, seed = 1 }) => {
  let base = y;
  return (
    <g>
      {capas.map((c, i) => {
        const h = c.h * cl(c.k), top = base - h; base = top;
        if (h < 0.5) return null;
        const col = c.col ?? (c.tipo === "negra" ? NEGRA : c.tipo === "clara" ? CLARA : c.tipo === "base" ? "#8d6c45" : c.tipo === "sc" ? SC : c.tipo === "tosca" ? TOSCA : "#22272b");
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={h} fill={col} />
            {c.tipo === "sc" && (c.moj ?? 0) > 0 && <rect x={x} y={top} width={w} height={h} fill="#5f5548" opacity={0.5 * (c.moj ?? 0)} />}
            {(c.tipo === "clara" || c.tipo === "base" || c.tipo === "sc") && Array.from({ length: Math.round(w / 22) }, (_, j) => (
              <circle key={j} cx={x + hash(j, seed + i) * w} cy={top + (0.12 + 0.76 * hash(j, seed + i + 9)) * h} r={1.8 + 3 * hash(j, seed + 3)} fill={c.tipo === "sc" ? "#8c8170" : "#6e5232"} />
            ))}
            {c.tipo === "base" && Array.from({ length: Math.round(w / 60) }, (_, j) => <line key={"b" + j} x1={x + j * 60} y1={top + 4} x2={x + j * 60 + 40} y2={top + 4} stroke="#6e5232" strokeWidth={3} />)}
            {c.tipo === "negra" && Array.from({ length: Math.round(w / 40) }, (_, j) => { const rx = x + hash(j, seed + 7) * w; return <path key={"r" + j} d={`M${rx},${top} q${-14 + 28 * hash(j, 2)},${h * 0.4} ${-6 + 12 * hash(j, 3)},${h * 0.85}`} stroke="#c8a873" strokeWidth={2.5} fill="none" opacity={0.75} />; })}
            {c.tipo === "negra" && Array.from({ length: Math.round(w / 70) }, (_, j) => <ellipse key={"h" + j} cx={x + hash(j, seed + 8) * w} cy={top + 6} rx={14} ry={5} fill="#6a8a3a" />)}
            {c.tipo === "nylon" && <rect x={x - 12} y={top} width={w + 24} height={h} rx={3} fill="#1d2226" opacity={0.92} />}
          </g>
        );
      })}
    </g>
  );
};

// balde en corte: nivel lvl 0..1, color del contenido
export const Balde: React.FC<{ x: number; y: number; s?: number; lvl: number; liq?: string; children?: React.ReactNode }> = ({ x, y, s = 1, lvl, liq = "#cfe8f6", children }) => {
  const W = 300 * s, H = 340 * s, top = y - H, ly = y - H * 0.92 * cl(lvl);
  const xl = (yy: number) => x - lerp(W * 0.42, W * 0.5, (y - yy) / H), xr = (yy: number) => x + lerp(W * 0.42, W * 0.5, (y - yy) / H);
  return (
    <g>
      <path d={`M${x - W * 0.5},${top} Q${x},${top - 150 * s} ${x + W * 0.5},${top}`} fill="none" stroke="#5e5547" strokeWidth={7 * s} />
      <polygon points={`${x - W * 0.5},${top} ${x + W * 0.5},${top} ${x + W * 0.42},${y} ${x - W * 0.42},${y}`} fill="#e8e3d8" opacity={0.35} stroke="#f6f1e6" strokeWidth={6 * s} />
      {lvl > 0.01 && <polygon points={`${xl(ly)},${ly} ${xr(ly)},${ly} ${x + W * 0.42},${y} ${x - W * 0.42},${y}`} fill={liq} opacity={0.95} />}
      {lvl > 0.01 && <ellipse cx={x} cy={ly} rx={(xr(ly) - xl(ly)) / 2} ry={14 * s} fill={liq} stroke="rgba(255,255,255,.35)" strokeWidth={3} />}
      {children}
      <rect x={x - W * 0.5 - 6} y={top - 8} width={W + 12} height={16 * s} rx={8} fill="#d9d3c6" />
    </g>
  );
};

// regla de aluminio · bolsa de cemento · llana
export const Regla: React.FC<{ x: number; y: number; l?: number; rot?: number }> = ({ x, y, l = 700, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-l / 2} y={-16} width={l} height={32} rx={4} fill="#c8ccd0" stroke="#7d848c" strokeWidth={3} />
    <rect x={-l / 2} y={-16} width={l} height={8} fill="#eef2f5" />
  </g>
);
export const Bolsa: React.FC<{ x: number; y: number; s?: number; txt?: string; kg?: string; col?: string }> = ({ x, y, s = 1, txt = "CEMENTO", kg = "50 KG", col = "#d8cfbd" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,-170 Q-130,-180 -110,-190 L110,-190 Q130,-180 120,-170 L130,140 Q130,160 110,160 L-110,160 Q-130,160 -130,140 Z" fill={col} stroke="#9c927e" strokeWidth={4} />
    <rect x={-105} y={-60} width={210} height={90} rx={8} fill="#b8342a" />
    <text y={4} textAnchor="middle" fontSize={46} fontWeight={800} fill="#fff" fontFamily="Barlow Condensed">{txt}</text>
    <text y={110} textAnchor="middle" fontSize={36} fontWeight={700} fill="#5c5546" fontFamily="Barlow">{kg}</text>
  </g>
);
export const Llana: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-150,0 L130,0 Q160,0 160,-20 L160,-26 L-150,-26 Z" fill="#cfd5da" stroke="#6f7780" strokeWidth={3} />
    <rect x={-60} y={-56} width={120} height={30} rx={6} fill={MAD} />
    <rect x={-20} y={-90} width={40} height={40} rx={10} fill="#5e3a1c" />
  </g>
);

// el FRASCO de la prueba: agua (lvl), turbio 0..1, y las tres capas asentadas (arena, limo, arcilla: alturas en px)
export const Frasco: React.FC<{ x: number; y: number; s?: number; lvl?: number; turb?: number; ar?: number; li?: number; ac?: number; rayas?: number[]; tapa?: number; rot?: number }> = ({ x, y, s = 1, lvl = 0, turb = 0, ar = 0, li = 0, ac = 0, rayas = [], tapa = 1, rot = 0 }) => {
  const W = 230, H = 380, b = H / 2, top = -H / 2;
  const wy = b - (H - 30) * cl(lvl);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-W / 2} y={top} width={W} height={H} rx={34} fill="rgba(210,235,245,.14)" stroke="rgba(235,248,255,.75)" strokeWidth={6} />
      {lvl > 0.01 && <rect x={-W / 2 + 6} y={wy} width={W - 12} height={b - wy - 6} rx={26} fill="#9fb9c2" opacity={0.4} />}
      {turb > 0.01 && <rect x={-W / 2 + 6} y={wy} width={W - 12} height={b - wy - 6} rx={26} fill="#8b6b45" opacity={0.85 * turb} />}
      {ar > 0 && <rect x={-W / 2 + 6} y={b - 6 - ar} width={W - 12} height={ar} rx={8} fill="#d3b07a" />}
      {ar > 0 && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-W / 2 + 14 + (W - 28) * hash(i, 41)} cy={b - 10 - ar * hash(i, 42) * 0.9} r={2.5} fill="#9c7a45" />)}
      {li > 0 && <rect x={-W / 2 + 6} y={b - 6 - ar - li} width={W - 12} height={li} fill="#b9a68c" />}
      {ac > 0 && <rect x={-W / 2 + 6} y={b - 6 - ar - li - ac} width={W - 12} height={ac} fill="#8e7c69" />}
      {rayas.map((ry, i) => <line key={i} x1={W / 2 - 6} x2={W / 2 + 34} y1={b - 6 - ry} y2={b - 6 - ry} stroke="#ff5546" strokeWidth={7} strokeLinecap="round" />)}
      <rect x={-W / 2 + 10} y={top - 40 + (1 - tapa) * -160} width={W - 20} height={44} rx={10} fill="#c9a03a" opacity={tapa > 0.02 ? 1 : 0} />
      <rect x={-W / 2 + 22} y={top + 26} width={16} height={H - 70} rx={8} fill="#fff" opacity={0.22} />
    </g>
  );
};

// PISÓN de mano: taco de madera 20×20 + palo. lift 0..1 (arriba)
export const Pison: React.FC<{ x: number; y: number; s?: number; lift?: number }> = ({ x, y, s = 1, lift = 0 }) => (
  <g transform={`translate(${x},${y - 120 * lift}) scale(${s})`}>
    <rect x={-14} y={-420} width={28} height={340} rx={10} fill="#b98a55" />
    <rect x={-60} y={-430} width={120} height={22} rx={10} fill="#7a5530" />
    <rect x={-80} y={-90} width={160} height={90} rx={8} fill={MAD} stroke="#5e3a1c" strokeWidth={4} />
    <line x1={-70} y1={-60} x2={70} y2={-60} stroke="#7a4b24" strokeWidth={3} />
  </g>
);
// PALA (de costado): carga 0..1 de tierra
export const Pala: React.FC<{ x: number; y: number; rot?: number; s?: number; carga?: number; col?: string }> = ({ x, y, rot = 0, s = 1, carga = 0, col = CLARA }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-8} y={-420} width={16} height={330} rx={6} fill="#b98a55" />
    <path d="M-34,-440 h68 v26 h-68 z" fill="#3a3a3a" />
    <path d="M-80,-100 L80,-100 L70,40 Q0,90 -70,40 Z" fill="#7d858c" stroke="#454b50" strokeWidth={4} />
    {carga > 0.02 && <ellipse cx={0} cy={-100} rx={86 * carga} ry={40 * carga} fill={col} />}
  </g>
);
// REGADERA: inclinación rot; gotas o 0..1
export const Regadera: React.FC<{ x: number; y: number; rot?: number; s?: number; o?: number; t?: number }> = ({ x, y, rot = 0, s = 1, o = 0, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g transform={`rotate(${rot})`}>
      <rect x={-110} y={-90} width={220} height={170} rx={30} fill="#3f7d5a" stroke="#2a5a3e" strokeWidth={5} />
      <path d="M-80,-90 Q0,-200 80,-90" fill="none" stroke="#2a5a3e" strokeWidth={16} />
      <path d="M100,-10 L260,-110" stroke="#3f7d5a" strokeWidth={26} strokeLinecap="round" />
      <ellipse cx={268} cy={-114} rx={30} ry={18} fill="#2a5a3e" transform="rotate(-30 268 -114)" />
    </g>
    {o > 0.02 && Array.from({ length: 22 }, (_, i) => { const ph = (t * 1.6 + hash(i, 61)) % 1; return <line key={i} x1={250 + 70 * (hash(i, 62) - 0.5) + ph * 30} y1={-60 + ph * 320} x2={252 + 70 * (hash(i, 62) - 0.5) + ph * 30} y2={-44 + ph * 320} stroke="#a9dcff" strokeWidth={4} strokeLinecap="round" opacity={o} />; })}
  </g>
);
// CAMIONETA de costado: carga de fardos opcional
export const Camioneta: React.FC<{ x: number; y: number; s?: number; fardos?: boolean; giro?: number }> = ({ x, y, s = 1, fardos, giro = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-330,-60 L-330,-150 L-60,-150 L-60,-60 Z" fill="#6b7d8c" />
    <path d="M-60,-60 L-60,-200 Q-55,-230 -20,-230 L130,-230 L230,-130 L320,-118 Q350,-112 350,-80 L350,-60 Z" fill="#7f93a3" />
    <path d="M-30,-205 L120,-205 L195,-135 L-30,-135 Z" fill="#c9dde8" opacity={0.85} />
    <rect x={-350} y={-70} width={710} height={30} rx={10} fill="#4b5862" />
    {fardos && [-300, -200].map((fx) => <rect key={fx} x={fx} y={-230} width={95} height={80} rx={6} fill="#d8b860" stroke="#a5873a" strokeWidth={3} />)}
    {[-220, 230].map((wx) => (
      <g key={wx} transform={`translate(${wx},-30) rotate(${giro})`}>
        <circle r={62} fill="#22262a" /><circle r={30} fill="#9aa4ac" />
        {[0, 72, 144, 216, 288].map((ang) => <rect key={ang} x={-4} y={-28} width={8} height={18} fill="#5c656c" transform={`rotate(${ang})`} />)}
      </g>
    ))}
  </g>
);
// ESTACA con hilo atado a altura hy (desde el suelo)
export const Estaca: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 160 }) => (
  <g><polygon points={`${x - 12},${y - h} ${x + 12},${y - h} ${x + 12},${y - 10} ${x},${y + 14} ${x - 12},${y - 10}`} fill={MAD} stroke="#5e3a1c" strokeWidth={3} /></g>
);
// LADRILLO
export const Ladrillo: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 150, h = 60 }) => (
  <g><rect x={x - w / 2} y={y - h} width={w} height={h} rx={4} fill="#b4552f" stroke="#7a3518" strokeWidth={3} /><rect x={x - w / 2} y={y - h} width={w} height={10} fill="#cf7046" /></g>
);
// copo (helada) y sol
export const Copo: React.FC<{ x: number; y: number; r?: number; o?: number; rot?: number }> = ({ x, y, r = 40, o = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
    {[0, 60, 120].map((g) => <g key={g} transform={`rotate(${g})`}><line x1={-r} x2={r} y1={0} y2={0} stroke="#dff2ff" strokeWidth={6} strokeLinecap="round" />
      {[-1, 1].map((sg) => <path key={sg} d={`M${sg * r * 0.6},0 l${sg * r * 0.25},${-r * 0.22} M${sg * r * 0.6},0 l${sg * r * 0.25},${r * 0.22}`} stroke="#dff2ff" strokeWidth={4} strokeLinecap="round" />)}</g>)}
  </g>
);
export const Sol: React.FC<{ x: number; y: number; r?: number; o?: number; rot?: number }> = ({ x, y, r = 50, o = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={r * 1.25} x2={r * 1.7} y1={0} y2={0} stroke="#ffd27a" strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}
    <circle r={r} fill="#ffc44d" />
  </g>
);
// gota de agua en bolita (o que se mete en el poro)
export const Gotita: React.FC<{ x: number; y: number; r?: number; ent?: number }> = ({ x, y, r = 40, ent = 0 }) => (
  <g>
    <ellipse cx={x} cy={y + r * 0.2} rx={r * (1 + ent)} ry={r * 0.25 * (1 + ent)} fill="rgba(60,70,80,.35)" />
    <ellipse cx={x} cy={y - r * 0.35 * (1 - ent)} rx={r * (1 + 0.6 * ent)} ry={r * 0.6 * (1 - 0.85 * ent)} fill="rgba(140,205,255,.75)" />
    <ellipse cx={x - r * 0.35} cy={y - r * 0.6 * (1 - ent)} rx={r * 0.25} ry={r * 0.12} fill="#fff" opacity={0.8 * (1 - ent)} />
  </g>
);
// tarjeta-rótulo dentro del SVG (no en la esquina)
export const Tarja: React.FC<{ x: number; y: number; w?: number; txt: string; col?: string; size?: number; k?: number }> = ({ x, y, w = 380, txt, col = C.cream, size = 46, k = 1 }) => k < 0.02 ? null : (
  <g transform={`translate(${x},${y}) scale(${k})`}>
    <rect x={-w / 2} y={-44} width={w} height={88} rx={16} fill="rgba(30,20,10,.84)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
    <text y={size * 0.35} textAnchor="middle" fontSize={size} fontWeight={800} fill={col} fontFamily="Barlow Condensed">{txt.toUpperCase()}</text>
  </g>
);
