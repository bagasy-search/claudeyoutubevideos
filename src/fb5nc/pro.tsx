// fb5nc · PIEZAS CON CUERPO (ronda 2 del ojo del director): vaso de vidrio en 3/4 con menisco y reflejos, tabla de
// madera con veta y laca que refleja la ventana, gota de agua esférica con su cáustica, cubo de telgopor con caras,
// pincel de verdad, lata de thinner cilíndrica. Todo SVG puro y f(t); los ids de degradé llevan `u` para no chocar.
import React from "react";
import { C, FONT, cl, hash, lerp } from "./lib";

// vaso cilíndrico visto apenas desde arriba: (x, y = base), ancho w, alto h, nivel lv 0..1
export const Vaso3: React.FC<{ u: string; x: number; y: number; w: number; h: number; lv: number; liq?: string; lid?: boolean; o?: number; turb?: number; children?: React.ReactNode }> = ({ u, x, y, w, h, lv, liq = "rgba(143,211,255,.35)", lid, o = 1, turb = 0, children }) => {
  const rx = w / 2, ry = w * 0.13, yl = y - h * lv, top = y - h;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={`lq${u}`} x1="0" x2="1">
          <stop offset="0" stopColor={liq} stopOpacity={1} /><stop offset="0.35" stopColor="#fff" stopOpacity={0.18} /><stop offset="0.5" stopColor={liq} stopOpacity={0.85} /><stop offset="1" stopColor="#000" stopOpacity={0.35} />
        </linearGradient>
        <linearGradient id={`gl${u}`} x1="0" x2="1">
          <stop offset="0" stopColor="#dff2ff" stopOpacity={0.28} /><stop offset="0.12" stopColor="#fff" stopOpacity={0.06} /><stop offset="0.85" stopColor="#fff" stopOpacity={0.04} /><stop offset="1" stopColor="#dff2ff" stopOpacity={0.3} />
        </linearGradient>
      </defs>
      {/* boca de atrás */}
      <ellipse cx={x} cy={top} rx={rx} ry={ry} fill="none" stroke="rgba(220,240,255,.35)" strokeWidth={3} />
      {/* líquido: cuerpo + fondo + superficie */}
      {lv > 0.005 && <>
        <path d={`M${x - rx + 4},${yl} L${x - rx + 4},${y} A${rx - 4},${ry} 0 0 0 ${x + rx - 4},${y} L${x + rx - 4},${yl} Z`} fill={liq} />
        <path d={`M${x - rx + 4},${yl} L${x - rx + 4},${y} A${rx - 4},${ry} 0 0 0 ${x + rx - 4},${y} L${x + rx - 4},${yl} Z`} fill={`url(#lq${u})`} opacity={0.75} />
        {turb > 0 && <path d={`M${x - rx + 4},${yl} L${x - rx + 4},${y} A${rx - 4},${ry} 0 0 0 ${x + rx - 4},${y} L${x + rx - 4},${yl} Z`} fill="#ece8de" opacity={0.85 * turb} />}
        <ellipse cx={x} cy={yl} rx={rx - 4} ry={ry * 0.92} fill={liq} stroke="rgba(255,255,255,.55)" strokeWidth={2.5} />
        <ellipse cx={x - rx * 0.25} cy={yl - ry * 0.15} rx={rx * 0.4} ry={ry * 0.3} fill="rgba(255,255,255,.22)" />
      </>}
      {children}
      {/* vidrio: cuerpo, fondo grueso, boca de adelante, brillos verticales */}
      <path d={`M${x - rx},${top} L${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} L${x + rx},${top}`} fill={`url(#gl${u})`} stroke="rgba(225,242,255,.75)" strokeWidth={4} />
      <path d={`M${x - rx + 6},${y - 4} A${rx - 6},${ry - 2} 0 0 0 ${x + rx - 6},${y - 4}`} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={7} />
      <path d={`M${x - rx},${top} A${rx},${ry} 0 0 0 ${x + rx},${top}`} fill="none" stroke="rgba(235,248,255,.9)" strokeWidth={4} />
      <rect x={x - rx + w * 0.07} y={top + h * 0.08} width={w * 0.05} height={h * 0.78} rx={w * 0.025} fill="rgba(255,255,255,.42)" />
      <rect x={x - rx + w * 0.15} y={top + h * 0.12} width={w * 0.018} height={h * 0.6} rx={w * 0.01} fill="rgba(255,255,255,.3)" />
      <rect x={x + rx - w * 0.08} y={top + h * 0.15} width={w * 0.025} height={h * 0.66} rx={w * 0.012} fill="rgba(255,255,255,.2)" />
      {lid && <g>
        <path d={`M${x - rx - 6},${top - 4} L${x - rx - 6},${top - 34} A${rx + 6},${ry + 2} 0 0 1 ${x + rx + 6},${top - 34} L${x + rx + 6},${top - 4} A${rx + 6},${ry + 2} 0 0 1 ${x - rx - 6},${top - 4} Z`} fill="#a9a196" stroke="#4e483f" strokeWidth={3} />
        <ellipse cx={x} cy={top - 34} rx={rx + 6} ry={ry + 2} fill="#cfc8bb" stroke="#4e483f" strokeWidth={3} />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={x - rx + (i + 0.5) * (w / 14)} y1={top - 30} x2={x - rx + (i + 0.5) * (w / 14)} y2={top - 8} stroke="rgba(0,0,0,.18)" strokeWidth={2} />)}
      </g>}
    </g>
  );
};

// tabla de madera: cara de arriba en perspectiva (fondo más angosto), canto al frente, veta y, si `lac`, laca que
// refleja la ventana (dos paños de luz que se corren con `sh`)
export const Tabla3: React.FC<{ u: string; x: number; y: number; w: number; d: number; th?: number; lac?: number; sh?: number; col?: string; col2?: string; children?: React.ReactNode }> = ({ u, x, y, w, d, th = 46, lac = 0, sh = 0, col = "#a8693a", col2 = "#6b3f1f", children }) => {
  const ins = d * 0.45, L = x - w / 2, R = x + w / 2;
  const top = `M${L},${y} L${R},${y} L${R - ins},${y - d} L${L + ins},${y - d} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`tw${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={col2} /><stop offset="1" stopColor={col} /></linearGradient>
        <clipPath id={`tc${u}`}><path d={top} /></clipPath>
      </defs>
      <path d={`M${L},${y} L${R},${y} L${R},${y + th} L${L},${y + th} Z`} fill={col2} />
      <path d={`M${L},${y + th * 0.35} L${R},${y + th * 0.35}`} stroke="rgba(0,0,0,.18)" strokeWidth={2} />
      <path d={top} fill={`url(#tw${u})`} />
      <g clipPath={`url(#tc${u})`}>
        {Array.from({ length: 16 }, (_, i) => { const yy = y - d + (i + 0.5) * (d / 16), wob = 10 * Math.sin(i * 1.7); return <path key={i} d={`M${L - 40},${yy} C ${L + w * 0.3},${yy + wob} ${L + w * 0.6},${yy - wob} ${R + 40},${yy + wob * 0.5}`} stroke="rgba(60,30,10,.28)" strokeWidth={1.5 + (i % 3)} fill="none" />; })}
        <ellipse cx={L + w * 0.68} cy={y - d * 0.45} rx={46} ry={14} fill="none" stroke="rgba(60,30,10,.35)" strokeWidth={3} />
        <ellipse cx={L + w * 0.68} cy={y - d * 0.45} rx={22} ry={6} fill="rgba(60,30,10,.3)" />
        {lac > 0 && <g opacity={lac}>
          <path d={top} fill="rgba(255,190,90,.16)" />
          <path d={`M${L + w * (0.18 + sh)},${y + 10} L${L + w * (0.3 + sh)},${y + 10} L${L + w * (0.42 + sh)},${y - d - 10} L${L + w * (0.3 + sh)},${y - d - 10} Z`} fill="rgba(255,250,235,.38)" />
          <path d={`M${L + w * (0.34 + sh)},${y + 10} L${L + w * (0.37 + sh)},${y + 10} L${L + w * (0.49 + sh)},${y - d - 10} L${L + w * (0.46 + sh)},${y - d - 10} Z`} fill="rgba(255,250,235,.3)" />
        </g>}
        {children}
      </g>
      <path d={`M${L},${y} L${R},${y}`} stroke={lac > 0 ? "rgba(255,240,210,.85)" : "rgba(255,220,180,.35)"} strokeWidth={3} />
    </g>
  );
};

// gota de agua con volumen: cuerpo esférico (sq = aplastada 0..1, 1 = charco chato), brillo, cáustica y sombra
export const Gota3: React.FC<{ u: string; x: number; y: number; r: number; sq?: number; col?: string; o?: number }> = ({ u, x, y, r, sq = 0, col = "#8fd3ff", o = 1 }) => {
  const rx = r * (1 + 1.6 * sq), ry = r * (1 - 0.82 * sq);
  return (
    <g opacity={o}>
      <defs>
        <radialGradient id={`gd${u}`} cx="0.42" cy="0.38" r="0.7"><stop offset="0" stopColor="#fff" stopOpacity={0.55} /><stop offset="0.35" stopColor={col} stopOpacity={0.35} /><stop offset="0.85" stopColor={col} stopOpacity={0.75} /><stop offset="1" stopColor="#1d4a6b" stopOpacity={0.85} /></radialGradient>
      </defs>
      <ellipse cx={x + r * 0.35} cy={y + 4} rx={rx * 1.05} ry={Math.max(6, ry * 0.18)} fill="rgba(0,0,0,.35)" />
      <ellipse cx={x + r * 0.15} cy={y - 2} rx={rx * 0.55} ry={Math.max(4, ry * 0.12)} fill="rgba(255,250,220,.55)" />
      <path d={`M${x - rx},${y} C ${x - rx},${y - ry * 1.35} ${x + rx},${y - ry * 1.35} ${x + rx},${y} Z`} fill={`url(#gd${u})`} stroke="rgba(255,255,255,.75)" strokeWidth={2.5} />
      <ellipse cx={x - rx * 0.35} cy={y - ry * 0.68} rx={Math.max(4, rx * 0.22)} ry={Math.max(3, ry * 0.16)} fill="rgba(255,255,255,.95)" transform={`rotate(-20 ${x - rx * 0.35} ${y - ry * 0.68})`} />
      <ellipse cx={x + rx * 0.4} cy={y - ry * 0.3} rx={Math.max(2, rx * 0.06)} ry={Math.max(2, ry * 0.06)} fill="rgba(255,255,255,.7)" />
    </g>
  );
};
// gota en el aire (lágrima)
export const GotaCae: React.FC<{ x: number; y: number; r: number; col?: string }> = ({ x, y, r, col = "#8fd3ff" }) => (
  <g>
    <path d={`M${x},${y - r * 2.2} C ${x + r * 0.4},${y - r * 1.2} ${x + r},${y - r * 0.4} ${x + r},${y + r * 0.2} A${r},${r} 0 0 1 ${x - r},${y + r * 0.2} C ${x - r},${y - r * 0.4} ${x - r * 0.4},${y - r * 1.2} ${x},${y - r * 2.2} Z`} fill={col} fillOpacity={0.75} stroke="#fff" strokeWidth={2} />
    <ellipse cx={x - r * 0.4} cy={y - r * 0.2} rx={r * 0.22} ry={r * 0.32} fill="rgba(255,255,255,.9)" />
  </g>
);

// cubo de telgopor con tres caras y bolitas; `soft` 0..1 lo ablanda (bordes que se caen)
export const Cubo3: React.FC<{ x: number; y: number; s: number; o?: number; rot?: number; soft?: number }> = ({ x, y, s, o = 1, rot = 0, soft = 0 }) => {
  const k = s * 0.32, sg = soft * s * 0.25;
  return (
    <g opacity={o} transform={`rotate(${rot} ${x} ${y})`}>
      <path d={`M${x - s / 2},${y - s / 2 + sg * 0.3} Q${x},${y - s / 2 - sg} ${x + s / 2},${y - s / 2 + sg * 0.3} L${x + s / 2 + k},${y - s / 2 - k} L${x - s / 2 + k},${y - s / 2 - k} Z`} fill="#ffffff" stroke="rgba(0,0,0,.18)" strokeWidth={2} />
      <path d={`M${x + s / 2},${y - s / 2} L${x + s / 2 + k},${y - s / 2 - k} L${x + s / 2 + k - sg * 0.3},${y + s / 2 - k} L${x + s / 2},${y + s / 2} Z`} fill="#d9d6cc" stroke="rgba(0,0,0,.18)" strokeWidth={2} />
      <path d={`M${x - s / 2 - sg * 0.2},${y - s / 2 + sg * 0.3} Q${x},${y - s / 2 - sg * 0.6} ${x + s / 2},${y - s / 2} L${x + s / 2 + sg * 0.3},${y + s / 2} Q${x},${y + s / 2 + sg * 0.6} ${x - s / 2 - sg * 0.3},${y + s / 2} Z`} fill="#f4f2ea" stroke="rgba(0,0,0,.2)" strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={x - s * 0.36 + (i % 4) * s * 0.24} cy={y - s * 0.32 + Math.floor(i / 4) * s * 0.3} r={s * 0.09} fill="none" stroke="rgba(0,0,0,.09)" strokeWidth={1.5} />)}
    </g>
  );
};

// pincel de verdad: mango de madera, virola de metal, cerdas (mojadas con `col` en la punta), girado `rot`
export const Pincel: React.FC<{ x: number; y: number; rot?: number; s?: number; col?: string }> = ({ x, y, rot = 0, s = 1, col = "#f0a93a" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-16,-420 Q-20,-300 -14,-150 L14,-150 Q20,-300 16,-420 Q0,-440 -16,-420 Z" fill="#b5703a" stroke="#5e3a1c" strokeWidth={3} />
    <ellipse cx={0} cy={-395} rx={7} ry={7} fill="#2b1a0c" />
    <path d="M-30,-150 L30,-150 L34,-70 L-34,-70 Z" fill="#c9c6bf" stroke="#5e584d" strokeWidth={3} />
    <path d="M-30,-128 L30,-128 M-31,-104 L31,-104" stroke="rgba(0,0,0,.25)" strokeWidth={3} />
    <path d="M-34,-70 L34,-70 L30,10 Q0,26 -30,10 Z" fill="#3a2a1c" />
    <path d="M-31,-20 L31,-20 L30,10 Q0,26 -30,10 Z" fill={col} opacity={0.9} />
    {[-22, -10, 2, 14, 24].map((v) => <line key={v} x1={v} y1={-66} x2={v * 0.95} y2={8} stroke="rgba(255,255,255,.12)" strokeWidth={2} />)}
  </g>
);

// lata de thinner cilíndrica con etiqueta (texto opcional)
export const Lata3: React.FC<{ x: number; y: number; w?: number; h?: number; txt?: string; col?: string }> = ({ x, y, w = 200, h = 290, txt = "THINNER", col = "#c43b2c" }) => {
  const rx = w / 2, ry = w * 0.14;
  return (
    <g>
      <defs><linearGradient id={`lt${x}`} x1="0" x2="1"><stop offset="0" stopColor="#6c6a66" /><stop offset="0.3" stopColor="#e9e7e1" /><stop offset="0.55" stopColor="#b7b4ad" /><stop offset="1" stopColor="#55534f" /></linearGradient></defs>
      <path d={`M${x - rx},${y - h} L${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} L${x + rx},${y - h} Z`} fill={`url(#lt${x})`} stroke="#3c3a36" strokeWidth={3} />
      <path d={`M${x - rx},${y - h * 0.78} L${x + rx},${y - h * 0.78} L${x + rx},${y - h * 0.2} L${x - rx},${y - h * 0.2} Z`} fill={col} />
      <path d={`M${x - rx},${y - h * 0.78} L${x + rx},${y - h * 0.78} L${x + rx},${y - h * 0.2} L${x - rx},${y - h * 0.2} Z`} fill={`url(#lt${x})`} opacity={0.35} />
      <text x={x} y={y - h * 0.44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={w * 0.24} fill="#fff8ec">{txt}</text>
      <ellipse cx={x} cy={y - h} rx={rx} ry={ry} fill="#d9d6cf" stroke="#3c3a36" strokeWidth={3} />
      <ellipse cx={x + rx * 0.45} cy={y - h - 4} rx={rx * 0.22} ry={ry * 0.5} fill="#8e8b85" stroke="#3c3a36" strokeWidth={2} />
    </g>
  );
};

// cinta de vapor: trazo grueso, translúcido y ondulado que avanza de (x0,y0) a (x1,y1); u 0..1 = avance
export const Vapor: React.FC<{ x0: number; y0: number; x1: number; y1: number; u: number; col?: string; w?: number; seed?: number }> = ({ x0, y0, x1, y1, u, col = "rgba(190,225,255,.55)", w = 26, seed = 0 }) => {
  const pts = Array.from({ length: 9 }, (_, i) => { const k = (i / 8) * u; return [lerp(x0, x1, k) + 30 * Math.sin(k * 9 + seed), lerp(y0, y1, k) + 22 * Math.cos(k * 7 + seed)]; });
  const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" L");
  return <path d={d} stroke={col} strokeWidth={w * (1 - 0.4 * u)} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={cl(u * 4) * (1 - cl((u - 0.75) * 4))} style={{ filter: "blur(4px)" }} />;
};

export const rnd = (i: number, s: number) => hash(i, s);
