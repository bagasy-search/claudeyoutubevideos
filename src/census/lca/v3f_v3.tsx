// lc02 · vuelta 3 (v3f, planos 21-40): componentes nuevos. Sólo los usa lc02_planos1 (P21-P40).
// - Rot: rótulo opaco con entrada de resorte (≥ 8 cuadros), para zonas lisas.
// - PilaLena: leña DE VERDAD apilada (troncos de tamaño, tono y giro distintos, estacas a los costados), crece tronco a tronco.
// - Volutas: humo con degradé (manchas suaves que suben, se abren y giran), nunca círculos duros.
// - GasNube: el CO como masa violeta translúcida que avanza desde una fuente y sube; moléculas adentro.
// - XRoja: una X que se dibuja trazo a trazo sobre un objeto.
// - CanioPared: el caño de agua en la pared de una casa vacía: el hielo crece, el caño se hincha y se raja con chorro.
// - BolsaDormir2: bolsa de dormir con capucha (parte de atrás y de adelante) y cierre.
// - Tilde: palotes de un cuaderno (inserto de mano).
import React from "react";
import { interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { cl, ou } from "./lc02_planos1_comp";

const rnd = (n: number) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

// ---------------------------------------------------------------------------------------------------------------
export const Rot: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; fondo?: string }> = ({ texto, x, y, desde, hasta = 1e9, color = "#f1d36b", tam = 40, fondo = "rgba(18,15,24,0.9)" }) => {
  const f = useF();
  if (f < desde || f > hasta + 10) return null;
  const o = interpolate(f, [desde, desde + 9, hasta, hasta + 10], [0, 1, 1, 0], cl);
  const s = interpolate(f, [desde, desde + 12], [0.82, 1], ou);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%, -50%) scale(${s})`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: "#f6ecd2", background: fondo, border: `3px solid ${color}`, borderRadius: 44, padding: "6px 26px", whiteSpace: "nowrap", letterSpacing: 1 }}>{texto}</div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// leña apilada (mundo): x = borde izquierdo, piso; cols × filas; prog 0..1 = cuántos troncos se ven (de abajo arriba)
const CORT = ["#8a5a3a", "#7a4a2e", "#9a6a42", "#6e4428", "#a07048", "#845434"];
const CARA = ["#c89a6a", "#d4a878", "#b8885a", "#caa070", "#bf9060"];
export type Tronco = { cx: number; cy: number; r: number; corte: string; cara: string; rot: number; partido: boolean; i: number };
export const troncosPila = (x: number, piso: number, cols: number, filas: number, seed = 0): Tronco[] => {
  const out: Tronco[] = [];
  let i = 0;
  for (let r = 0; r < filas; r++) {
    const n = r === filas - 1 ? cols - 2 : cols;
    for (let c = 0; c < n; c++) {
      const q = seed * 101 + r * 31 + c * 7;
      const rad = 19 + rnd(q) * 9;
      out.push({ cx: x + 30 + c * 50 + (r % 2) * 25 + (rnd(q + 1) - 0.5) * 8 + (r === filas - 1 ? 50 : 0), cy: piso - 24 - r * 44 + (rnd(q + 2) - 0.5) * 5, r: rad, corte: CORT[Math.floor(rnd(q + 3) * CORT.length)], cara: CARA[Math.floor(rnd(q + 4) * CARA.length)], rot: rnd(q + 5) * 360, partido: rnd(q + 6) < 0.3, i: i++ });
    }
  }
  return out;
};
export const TroncoPunta: React.FC<{ t: Tronco; s?: number }> = ({ t, s = 1 }) => {
  const r = t.r * s;
  return (
    <g transform={`translate(${t.cx},${t.cy}) rotate(${t.rot})`}>
      {t.partido
        ? <><path d={`M${-r},${r * 0.35} A${r},${r} 0 1 1 ${r},${r * 0.35} Z`} fill={t.corte} stroke="#3e2616" strokeWidth={3} /><path d={`M${-r * 0.8},${r * 0.3} A${r * 0.8},${r * 0.8} 0 1 1 ${r * 0.8},${r * 0.3} Z`} fill={t.cara} /><path d={`M${-r * 0.4},${r * 0.25} A${r * 0.4},${r * 0.4} 0 1 1 ${r * 0.4},${r * 0.25}`} fill="none" stroke="#8a6038" strokeWidth={2} /></>
        : <><circle r={r} fill={t.corte} stroke="#3e2616" strokeWidth={3} /><circle r={r * 0.78} fill={t.cara} /><circle r={r * 0.5} fill="none" stroke="#9a6a40" strokeWidth={2} /><circle r={r * 0.2} fill="none" stroke="#9a6a40" strokeWidth={2} /><path d={`M0,0 L${r * 0.7},${-r * 0.2}`} stroke="#7a5030" strokeWidth={2} /></>}
    </g>
  );
};
export const PilaLena: React.FC<{ x: number; piso: number; cols?: number; filas?: number; prog?: number; seed?: number; estacas?: boolean }> = ({ x, piso, cols = 12, filas = 9, prog = 1, seed = 0, estacas = true }) => {
  const ts = troncosPila(x, piso, cols, filas, seed);
  const n = ts.length * prog;
  const alto = filas * 44 + 20;
  const w = cols * 50 + 30;
  return (
    <g>
      {/* sombra contra la pared */}
      <rect x={x - 6} y={piso - alto * Math.min(1, prog + 0.05)} width={w + 12} height={alto * Math.min(1, prog + 0.05)} fill="#2a1e22" opacity={0.35} rx={10} />
      {ts.map((t) => {
        if (t.i >= n) return null;
        const u = Math.min(1, n - t.i); // el último aparece creciendo
        return <TroncoPunta key={t.i} t={t} s={0.6 + 0.4 * u} />;
      })}
      {estacas && [x - 8, x + w - 4].map((sx) => <g key={sx}><rect x={sx} y={piso - alto - 30} width={14} height={alto + 30} rx={4} fill="#5a3a24" stroke="#3e2616" strokeWidth={2} /></g>)}
      {/* astillas en el piso */}
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={x + 40 + i * 120 + rnd(seed + i) * 40} y={piso - 4} width={18 + rnd(i + 9) * 14} height={5} rx={2} fill="#b8885a" transform={`rotate(${rnd(i + 3) * 40 - 20} ${x + 40 + i * 120} ${piso})`} />)}
    </g>
  );
};
// la altura de la pila (para cotas): piso − filas·44 − 20
export const altoPila = (filas: number) => filas * 44 + 20;

// ---------------------------------------------------------------------------------------------------------------
// humo con degradé: manchas suaves (degradé radial con alfa) que suben, crecen, se abren y se desvanecen
export const Volutas: React.FC<{ id: string; x: number; y: number; f: number; n?: number; color?: string; o?: number; viento?: number; alto?: number; ancho?: number; per?: number; r0?: number }> = ({ id, x, y, f, n = 10, color = "#9aa0ae", o = 1, viento = 0.4, alto = 420, ancho = 1, per = 80, r0 = 22 }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={`vol${id}`}><stop offset="0" stopColor={color} stopOpacity={0.85} /><stop offset="0.55" stopColor={color} stopOpacity={0.45} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient>
    </defs>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f / per) + i / n) % 1;
      const cx = x + t * alto * viento + Math.sin(f / 23 + i * 1.7) * 18 * (0.4 + t) * ancho;
      const cy = y - t * alto;
      const r = r0 + t * 70 * ancho;
      return <ellipse key={i} cx={cx} cy={cy} rx={r * 1.25} ry={r * 0.85} fill={`url(#vol${id})`} opacity={(t < 0.12 ? t / 0.12 : 1) * (1 - t) * 0.95} transform={`rotate(${(i * 47 + f * 0.6) % 360} ${cx} ${cy})`} />;
    })}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// el CO: masa violeta translúcida que avanza desde (x0, piso) hasta x0 + avance·(x1 − x0) y sube hasta `alto`
export const GasNube: React.FC<{ id: string; x0: number; x1: number; piso: number; alto: number; avance: number; f: number; color?: string; o?: number; moleculas?: boolean }> = ({ id, x0, x1, piso, alto, avance, f, color = "#a07ae0", o = 1, moleculas = true }) => {
  if (avance <= 0) return null;
  const dir = x1 > x0 ? 1 : -1;
  const frente = x0 + (x1 - x0) * avance;
  const N = 26;
  return (
    <g opacity={o}>
      <defs><radialGradient id={`gas${id}`}><stop offset="0" stopColor={color} stopOpacity={0.62} /><stop offset="0.6" stopColor={color} stopOpacity={0.3} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      {Array.from({ length: N }).map((_, i) => {
        const u = i / (N - 1);
        const bx = x0 + (frente - x0) * u + Math.sin(f / 19 + i * 2.1) * 22;
        const sube = alto * (0.35 + 0.65 * Math.min(1, avance * 1.3)) * (1 - u * 0.45);
        const by = piso - 40 - (rnd(i + 3) * sube) + Math.cos(f / 27 + i) * 14;
        const r = 90 + rnd(i) * 80;
        return <ellipse key={i} cx={bx} cy={by} rx={r * 1.4} ry={r} fill={`url(#gas${id})`} />;
      })}
      {/* lengüetas en el frente que avanza */}
      {[0, 1, 2].map((i) => { const yy = piso - 80 - i * 110 + Math.sin(f / 13 + i) * 18; return <path key={i} d={`M${frente - dir * 120},${yy} q${dir * 90},${-30 + i * 10} ${dir * 170},${Math.sin(f / 9 + i) * 16}`} stroke={color} strokeOpacity={0.45} strokeWidth={26} fill="none" strokeLinecap="round" />; })}
      {moleculas && Array.from({ length: 6 }).map((_, i) => {
        const u = (i + 0.5) / 6;
        const mx = x0 + (frente - x0) * u + Math.sin(f / 15 + i) * 16;
        const my = piso - 120 - rnd(i + 11) * alto * 0.6 + Math.cos(f / 17 + i * 2) * 20;
        return <g key={i} transform={`translate(${mx},${my}) rotate(${f * 2 + i * 60})`}><circle cx={-16} cy={0} r={15} fill="#3a3440" stroke="#f6ecd2" strokeWidth={2} /><circle cx={16} cy={0} r={18} fill="#e2483a" stroke="#f6ecd2" strokeWidth={2} /><text x={-16} y={5} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={14} fill="#fff">C</text><text x={16} y={6} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={15} fill="#fff">O</text></g>;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
export const XRoja: React.FC<{ x: number; y: number; w: number; h: number; prog: number; grosor?: number; color?: string }> = ({ x, y, w, h, prog, grosor = 30, color = "#e2483a" }) => {
  if (prog <= 0) return null;
  const a = Math.min(1, prog * 2), b = Math.max(0, prog * 2 - 1);
  return (
    <g stroke={color} strokeWidth={grosor} strokeLinecap="round" fill="none">
      <path d={`M${x},${y} L${x + w * a},${y + h * a}`} />
      {b > 0 && <path d={`M${x + w},${y} L${x + w - w * b},${y + h * b}`} />}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// caño de agua en la pared de una casa vacía (pantalla 1920×1080): hielo 0..1 crece desde los dos lados;
// raja = cuadros desde que se rompe (−1 = sano)
export const CanioPared: React.FC<{ f: number; hielo: number; raja: number }> = ({ f, hielo, raja }) => {
  const y = 600, x0 = 0, x1 = 1920, cx = 1000;
  const hinch = Math.max(0, hielo - 0.55) / 0.45 * 30;
  const roto = raja >= 0;
  const t = roto ? Math.min(1, raja / 16) : 0;
  const frenteI = x0 + (cx - 60 - x0) * hielo, frenteD = x1 - (x1 - cx - 60) * hielo;
  const cristales = (x: number, dir: number) => Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${x},${y - 30 + i * 15} l${dir * (18 + (i % 2) * 16)},${-6 + (i % 3) * 6} l${-dir * 10},8 Z`} fill="#ffffff" />);
  return (
    <g>
      {/* pared de la casa vacía en corte: yeso, montantes, aislante rosa */}
      <rect x={0} y={0} width={1920} height={1080} fill="#2e2834" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-40 + i * 290} y={0} width={70} height={1080} fill="#7a6048" stroke="#5a4430" strokeWidth={4} />)}
      {Array.from({ length: 7 }).map((_, i) => <g key={i}><rect x={30 + i * 290} y={0} width={220} height={1080} fill="#d89a9a" opacity={0.18} />{Array.from({ length: 9 }).map((__, j) => <path key={j} d={`M${40 + i * 290},${60 + j * 120} q100,40 200,0`} stroke="#d89a9a" strokeOpacity={0.25} strokeWidth={4} fill="none" />)}</g>)}
      <rect x={0} y={960} width={1920} height={120} fill="#3a2a22" />
      {/* escarcha en la pared */}
      <rect x={0} y={0} width={1920} height={1080} fill="#cfe4ff" opacity={0.06 + 0.12 * hielo} />
      {/* caño de cobre */}
      <path d={`M${x0},${y - 46} H${cx - 200} Q${cx},${y - 46 - hinch * 2.2} ${cx + 200},${y - 46} H${x1} V${y + 46} H${cx + 200} Q${cx},${y + 46 + hinch * 2.2} ${cx - 200},${y + 46} H${x0} Z`} fill="#c8783a" stroke="#7a4420" strokeWidth={6} />
      <path d={`M${x0},${y - 30} H${x1}`} stroke="#e8a060" strokeWidth={6} opacity={0.6} />
      {/* agua y hielo adentro */}
      <rect x={x0} y={y - 28} width={x1 - x0} height={56} fill="#3a8adf" />
      <rect x={x0} y={y - 28} width={frenteI - x0} height={56} fill="#e4f2ff" />
      <rect x={frenteD} y={y - 28} width={x1 - frenteD} height={56} fill="#e4f2ff" />
      {hielo > 0.02 && hielo < 1 && <>{cristales(frenteI, 1)}{cristales(frenteD, -1)}</>}
      {[260, 640, 1400, 1700].map((xx) => <rect key={xx} x={xx - 18} y={y - 60} width={36} height={120} rx={5} fill="#9a5a2a" stroke="#6a3a1a" strokeWidth={3} />)}
      {/* flechas de presión cuando el hielo empuja */}
      {hielo > 0.5 && !roto && [-1, 1].map((d) => <path key={d} d={`M${cx + d * 260},${y} h${-d * 120} m${d * 26},-22 l${-d * 26},22 l${d * 26},22`} stroke="#ff5a4a" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.6 + 0.4 * Math.sin(f / 3)} />)}
      {roto && <g>
        <path d={`M${cx - 40},${y - 50 - hinch * 2} l22,26 l-18,18 l30,24 l-14,26 l26,22`} stroke="#120f18" strokeWidth={10} fill="none" strokeLinejoin="round" />
        {Array.from({ length: 16 }).map((_, i) => { const a = -Math.PI / 2 + ((i / 15) - 0.5) * 1.6; const v = (320 + (i % 4) * 110) * t; return <path key={i} d={`M${cx},${y - 60} L${cx + Math.cos(a) * v},${y - 60 + Math.sin(a) * v + 260 * t * t}`} stroke="#bfe4ff" strokeWidth={16 - (i % 3) * 4} strokeLinecap="round" opacity={0.92} />; })}
        {Array.from({ length: 22 }).map((_, i) => { const a = -Math.PI / 2 + (rnd(i) - 0.5) * 2.2; const v = (200 + rnd(i + 5) * 500) * t; return <circle key={i} cx={cx + Math.cos(a) * v} cy={y - 60 + Math.sin(a) * v + 420 * t * t} r={6 + rnd(i + 2) * 8} fill="#dff2ff" opacity={1 - t * 0.5} />; })}
        <circle cx={cx} cy={y - 40} r={60 + 380 * t} fill="none" stroke="#ffffff" strokeWidth={16 * (1 - t) + 1} opacity={1 - t} />
        {/* charco que crece abajo */}
        <ellipse cx={cx} cy={968} rx={80 + 420 * t} ry={14 + 10 * t} fill="#6ab4ff" opacity={0.7} />
      </g>}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// bolsa de dormir con capucha (mundo): x = centro, piso, alto = hasta los hombros (sentado en el piso)
export const BolsaDormir2: React.FC<{ x: number; piso: number; color: string; parte: "atras" | "frente"; dir?: 1 | -1; alto?: number }> = ({ x, piso, color, parte, dir = 1, alto = 190 }) => {
  const osc = "#00000033";
  if (parte === "atras") {
    // la capucha detrás de la cabeza
    return <g><ellipse cx={x - dir * 6} cy={piso - alto - 44} rx={62} ry={70} fill={color} stroke="#1a1620" strokeWidth={4} /><ellipse cx={x - dir * 6} cy={piso - alto - 44} rx={46} ry={54} fill={osc} /></g>;
  }
  return (
    <g>
      <path d={`M${x - 92},${piso} Q${x - 120},${piso - alto * 0.7} ${x - 70},${piso - alto} Q${x},${piso - alto - 18} ${x + 70},${piso - alto} Q${x + 150 * dir},${piso - alto * 0.55} ${x + 190 * dir},${piso - 40} Q${x + 200 * dir},${piso} ${x + 150 * dir},${piso} Z`} fill={color} stroke="#1a1620" strokeWidth={4} />
      {[0.25, 0.5, 0.75].map((u) => <path key={u} d={`M${x - 100},${piso - alto * u} Q${x},${piso - alto * u - 10} ${x + 150 * dir},${piso - alto * u * 0.6}`} stroke={osc} strokeWidth={5} fill="none" />)}
      {/* cierre */}
      <path d={`M${x + 20 * dir},${piso - alto + 4} Q${x + 30 * dir},${piso - alto * 0.5} ${x + 10 * dir},${piso - 6}`} stroke="#d8d2c4" strokeWidth={4} strokeDasharray="6 5" fill="none" />
      <rect x={x + 22 * dir - 6} y={piso - alto + 4} width={12} height={20} rx={3} fill="#d8d2c4" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// palotes de días (pantalla), cada grupo de 5 con la diagonal; n = cuántos; el último se dibuja con `ult` 0..1
export const Palotes: React.FC<{ x: number; y: number; n: number; ult?: number; alto?: number; paso?: number; color?: string; grosor?: number; porFila?: number }> = ({ x, y, n, ult = 1, alto = 46, paso = 14, color = "#2a2a3a", grosor = 4, porFila = 30 }) => (
  <g stroke={color} strokeWidth={grosor} strokeLinecap="round" fill="none">
    {Array.from({ length: n }).map((_, i) => {
      const fila = Math.floor(i / porFila), j = i % porFila;
      const g = Math.floor(j / 5), m = j % 5;
      const bx = x + g * (paso * 4 + 26), by = y + fila * (alto + 22);
      const u = i === n - 1 ? ult : 1;
      if (m === 4) return <path key={i} d={`M${bx - 6},${by + alto - 4} L${bx - 6 + (paso * 3 + 16) * u},${by + 4 + (alto - 8) * (1 - u)}`} />;
      return <path key={i} d={`M${bx + m * paso},${by} v${alto * u}`} />;
    })}
  </g>
);
