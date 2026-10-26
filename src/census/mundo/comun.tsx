// Piezas que comparten todos los sets de Duluth: edificio con ventanas (se apagan por `luces`), auto quieto (con nieve
// en el techo), farol, semáforo, nieve que cae, vapor del lago, estrellas, montón de nieve.
// `luces` 0..1: qué fracción de la ciudad sigue prendida (1 = todo, 0 = apagón). Cada ventana tiene su umbral fijo.
import React from "react";
import { random } from "remotion";
import { Halo, Cono, Charco } from "../../anikit/luz";
import { acl, osc, mezclar } from "../../anikit/sets/comun";
import { AMBAR } from "../elenco";

export const prendida = (seed: string, luces: number, base = 0.55) => random(seed) < luces * base;

export const Estrellas: React.FC<{ n?: number; o?: number; f: number; x0?: number; w?: number; y0?: number; h?: number }> = ({ n = 90, o = 1, f, x0 = -1500, w = 7000, y0 = -700, h = 900 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => <circle key={i} cx={x0 + random(`es${i}`) * w} cy={y0 + random(`ey${i}`) * h} r={0.8 + random(`er${i}`) * 1.6} fill="#f6ecd2" opacity={0.35 + 0.4 * Math.abs(Math.sin(f / 40 + i))} />)}
  </g>
);

// edificio: x,y = esquina inferior izquierda (y = base). pisos de 70 px, columnas de ventanas de 46.
export const Edificio: React.FC<{ x: number; y: number; w: number; h: number; color: string; luces: number; seed: string; ventana?: string; techoNieve?: number; detalle?: boolean; base?: number; tanque?: boolean }> = ({ x, y, w, h, color, luces, seed, ventana = AMBAR, techoNieve = 0, detalle = true, base = 0.5, tanque }) => {
  const cols = Math.max(1, Math.floor((w - 24) / 46)), filas = Math.max(1, Math.floor((h - 40) / 62));
  const dx = (w - cols * 46) / 2 + 12;
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={color} />
      <rect x={x} y={y - h} width={w} height={8} fill={osc(color, 0.8)} />
      <rect x={x + w - 10} y={y - h} width={10} height={h} fill={osc(color, 0.85)} />
      {tanque && <g><rect x={x + w * 0.6} y={y - h - 46} width={36} height={34} fill={osc(color, 0.75)} /><path d={`M${x + w * 0.6 - 4},${y - h - 46} L${x + w * 0.6 + 18},${y - h - 62} L${x + w * 0.6 + 40},${y - h - 46} Z`} fill={osc(color, 0.7)} /></g>}
      {techoNieve > 0 && <rect x={x - 4} y={y - h - 6 * techoNieve} width={w + 8} height={10 * techoNieve} rx={4} fill="#e9eef8" opacity={0.9} />}
      {detalle && Array.from({ length: filas }).map((_, r) => Array.from({ length: cols }).map((__, c) => {
        const on = prendida(`${seed}-${r}-${c}`, luces, base);
        const wx = x + dx + c * 46, wy = y - h + 30 + r * 62;
        if (wy + 34 > y - 10) return null;
        return <rect key={`${r}-${c}`} x={wx} y={wy} width={24} height={32} fill={on ? ventana : osc(color, 0.7)} opacity={on ? 0.9 : 1} />;
      }))}
    </g>
  );
};

// auto estacionado de perfil (x = centro, y = piso). nieve 0..1 en techo y capó.
export const Auto: React.FC<{ x: number; y: number; color: string; dir?: 1 | -1; nieve?: number; tipo?: "sedan" | "pickup" | "suv"; s?: number; faros?: boolean }> = ({ x, y, color, dir = 1, nieve = 0, tipo = "sedan", s = 1, faros }) => (
  <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
    <ellipse cx={0} cy={2} rx={130} ry={10} fill="#000" opacity={0.3} />
    {tipo === "pickup" ? (
      <>
        <path d="M-130,-30 L-130,-62 L-20,-62 L-10,-100 L60,-100 L82,-62 L128,-58 L130,-30 Z" fill={color} />
        <path d="M-4,-94 L54,-94 L72,-64 L-4,-64 Z" fill="#2a3346" />
      </>
    ) : tipo === "suv" ? (
      <>
        <path d="M-128,-30 L-128,-70 L-100,-112 L66,-112 L100,-70 L128,-64 L130,-30 Z" fill={color} />
        <path d="M-96,-104 L-20,-104 L-20,-74 L-118,-74 Z M-10,-104 L60,-104 L88,-74 L-10,-74 Z" fill="#2a3346" />
      </>
    ) : (
      <>
        <path d="M-130,-30 L-128,-62 L-70,-68 L-40,-102 L50,-102 L84,-66 L128,-58 L130,-30 Z" fill={color} />
        <path d="M-34,-94 L0,-94 L0,-70 L-60,-70 Z M8,-94 L46,-94 L72,-70 L8,-70 Z" fill="#2a3346" />
      </>
    )}
    <rect x={-130} y={-36} width={260} height={10} fill={osc(color, 0.75)} />
    {[-80, 80].map((wx) => <g key={wx}><circle cx={wx} cy={-22} r={24} fill="#15121a" /><circle cx={wx} cy={-22} r={10} fill="#5a5560" /></g>)}
    <rect x={118} y={-56} width={12} height={9} rx={2} fill={faros ? "#fff4cc" : "#d8d2c0"} />
    <rect x={-130} y={-56} width={8} height={9} rx={2} fill="#a8302a" />
    {nieve > 0 && <>
      <path d={tipo === "sedan" ? "M-44,-102 Q4,-118 52,-102 Z" : tipo === "suv" ? "M-102,-112 Q-10,-130 70,-112 Z" : "M-12,-100 Q24,-114 62,-100 Z"} fill="#eef2fa" opacity={nieve} transform={`scale(1,${0.5 + nieve * 0.8})`} style={{ transformOrigin: "0px -102px" }} />
      <path d="M78,-62 Q104,-70 130,-58 L130,-54 L80,-58 Z" fill="#eef2fa" opacity={nieve} />
      {nieve > 0.6 && <path d="M-136,-30 Q-140,-56 -126,-60 L-120,-30 Z" fill="#eef2fa" opacity={nieve} />}
    </>}
  </g>
);

export const COLORES_AUTO = ["#6a2f36", "#2f4a5e", "#8a8a92", "#3d3a44", "#c9b48a", "#2f5244", "#7a5a3a", "#b8b8c0", "#4a2e5a"];

// farol de calle (prendido o no). luz principal hacia abajo + halo.
export const Farola: React.FC<{ x: number; piso: number; on: number; alto?: number; color?: string; lado?: 1 | -1 }> = ({ x, piso, on, alto = 470, color = "#ffd9a0", lado = 1 }) => (
  <g>
    <rect x={x - 5} y={piso - alto} width={10} height={alto} fill="#1a1620" />
    <path d={`M${x},${piso - alto} Q${x + lado * 30},${piso - alto - 30} ${x + lado * 80},${piso - alto - 18}`} stroke="#1a1620" strokeWidth={9} fill="none" />
    <path d={`M${x + lado * 60},${piso - alto - 22} L${x + lado * 104},${piso - alto - 16} L${x + lado * 96},${piso - alto - 6} L${x + lado * 66},${piso - alto - 8} Z`} fill="#1a1620" />
    <ellipse cx={x + lado * 82} cy={piso - alto - 6} rx={18} ry={5} fill={on > 0.05 ? acl(color, 0.4) : "#3a3442"} opacity={0.4 + 0.6 * on} />
    {on > 0.05 && <>
      <Cono x={x + lado * 82} y={piso - alto - 4} alto={alto - 10} ancho={420} boca={30} color={color} fuerza={0.22 * on} />
      <Halo x={x + lado * 82} y={piso - alto - 4} r={120} color={color} fuerza={0.55 * on} />
      <Charco x={x + lado * 82} y={piso} rx={230} color={color} fuerza={0.42 * on} />
    </>}
  </g>
);

// semáforo colgado de un poste; ciclo de 6 s verde/amarillo/rojo (para nadie). apagado = gris
export const Semaforo: React.FC<{ x: number; piso: number; f: number; on: number; fase?: number }> = ({ x, piso, f, on, fase = 0 }) => {
  const c = Math.floor((f / 30 + fase) % 9);
  const cual = c < 4 ? 2 : c < 5 ? 1 : 0; // 0 rojo 1 amarillo 2 verde
  const cols = ["#ff4a3d", "#ffcf3a", "#4ae08a"];
  return (
    <g>
      <rect x={x - 6} y={piso - 560} width={12} height={560} fill="#1a1620" />
      <rect x={x - 6} y={piso - 560} width={220} height={12} fill="#1a1620" />
      <rect x={x + 150} y={piso - 552} width={40} height={110} rx={8} fill="#121016" />
      {[0, 1, 2].map((k) => {
        const lit = on > 0.05 && k === cual;
        return <g key={k}><circle cx={x + 170} cy={piso - 530 + k * 34} r={12} fill={lit ? cols[k] : "#2a2630"} />{lit && <Halo x={x + 170} y={piso - 530 + k * 34} r={60} color={cols[k]} fuerza={0.6 * on} />}</g>;
      })}
    </g>
  );
};

// nieve cayendo (en coordenadas de mundo, cubre x0..x0+w). viento = deriva en px/cuadro
export const NieveCae: React.FC<{ f: number; n?: number; x0?: number; w?: number; y0?: number; h?: number; viento?: number; tam?: number; o?: number; seed?: number }> = ({ f, n = 160, x0 = -800, w = 5200, y0 = -400, h = 1500, viento = 1.2, tam = 1, o = 0.9, seed = 0 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const v = 1.2 + random(`nv${seed}${i}`) * 1.8;
      const y = y0 + ((random(`ny${seed}${i}`) * h + f * v * 1.6) % h);
      const x = x0 + ((random(`nx${seed}${i}`) * w + f * viento * v + Math.sin(f / 22 + i) * 14) % w + w) % w;
      return <circle key={i} cx={x} cy={y} r={(1.6 + random(`nr${seed}${i}`) * 2.6) * tam} fill="#f4f6ff" />;
    })}
  </g>
);

// vapor de mar (sea smoke) sobre el lago: bandas que suben y se deshacen
export const Vapor: React.FC<{ f: number; x0: number; w: number; y: number; o?: number; color?: string; n?: number }> = ({ f, x0, w, y, o = 0.6, color = "#e6ecff", n = 26 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f / 160 + random(`va${i}`)) % 1);
      const x = x0 + random(`vx${i}`) * w + Math.sin(f / 50 + i) * 30;
      return <ellipse key={i} cx={x} cy={y - t * 140} rx={60 + t * 90} ry={14 + t * 18} fill={color} opacity={Math.sin(t * Math.PI) * 0.5} />;
    })}
  </g>
);

// banco de nieve contra el piso
export const Banco: React.FC<{ x: number; w: number; piso: number; alto: number; color?: string; seed?: string }> = ({ x, w, piso, alto, color = "#e9eef8", seed = "b" }) => {
  if (alto <= 0) return null;
  let d = `M${x},${piso + 4} L${x},${piso - alto * 0.3}`;
  const n = Math.max(2, Math.round(w / 160));
  for (let i = 0; i < n; i++) {
    const xa = x + (i / n) * w, xb = x + ((i + 1) / n) * w;
    d += ` Q${(xa + xb) / 2},${piso - alto * (0.8 + random(`${seed}${i}`) * 0.4)} ${xb},${piso - alto * (0.3 + random(`${seed}q${i}`) * 0.3)}`;
  }
  d += ` L${x + w},${piso + 4} Z`;
  return <g><path d={d} fill={color} /><path d={d} fill={osc(color, 0.82)} opacity={0.35} transform={`translate(0,${alto * 0.18})`} /></g>;
};

export const tinte = (c: string, t: string, k: number) => mezclar(c, t, k);
