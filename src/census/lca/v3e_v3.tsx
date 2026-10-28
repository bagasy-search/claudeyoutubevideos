// v3e · vuelta 3 de lc02 P01-P20: piezas nuevas (sólo las usa lc02_planos1, escenas P01-P20).
// La pila de leña DE VERDAD (rodajas partidas en cuartos/mitades, con corteza, apiladas fila por fila entre estacas),
// las cotas de una cuerda, la tira de 90 días, el texto que se escribe con barrido, el calendario de pared que pasa de
// hoja, la nota de las reglas de June en inserto, el velo de súper sin luz, humo de motosierra, look de liniero.
import React from "react";
import { interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Look } from "../../anikit/personaje";
import { AMBAR, THEO } from "../elenco";
import { cl, ou } from "./lc02_planos1_comp";

const CORTEZA = ["#4a2e1c", "#5a3a24", "#3e2818"];
const CARA = ["#d9ae78", "#c99a62", "#e2bd8a", "#c48e58"];

// ---------------------------------------------------------------------------------------------------------------
// un leño partido visto de punta (mundo): tipo 0 = redondo, 1 = mitad, 2 = cuarto. cx, cy = centro; r = radio
export const PuntaLenio: React.FC<{ cx: number; cy: number; r: number; tipo: number; rot: number; tono: number; fantasma?: boolean }> = ({ cx, cy, r, tipo, rot, tono, fantasma }) => {
  const forma = (k: number) => {
    const R = r * k;
    if (tipo === 0) return `M${-R},0 A${R},${R} 0 1 1 ${R},0 A${R},${R} 0 1 1 ${-R},0 Z`;
    if (tipo === 1) return `M${-R},${R * 0.35} A${R},${R} 0 0 1 ${R},${R * 0.35} Z`;
    return `M${-R * 0.55},${R * 0.5} L${-R * 0.55},${-R * 0.55} A${R * 1.1},${R * 1.1} 0 0 1 ${R * 0.55},${R * 0.5} Z`;
  };
  const corteza = fantasma ? "#b89a74" : CORTEZA[tono % 3];
  const cara = fantasma ? "#ecd8b8" : CARA[tono % 4];
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
      <path d={forma(1)} fill={corteza} />
      <path d={forma(0.8)} fill={cara} />
      {!fantasma && <>
        <path d={forma(0.5)} fill="none" stroke="#a87a4a" strokeWidth={1.6} opacity={0.7} />
        <path d={forma(0.25)} fill="none" stroke="#a87a4a" strokeWidth={1.4} opacity={0.6} />
        <path d={`M0,0 l${r * 0.55},${-r * 0.2}`} stroke="#8a5e36" strokeWidth={1.6} opacity={0.6} />
      </>}
    </g>
  );
};

// pila de leña partida (mundo): x = borde izq, piso = base, w × h; prog 0..1 = filas puestas (la última cae);
// fantasma = la que todavía FALTA (contorno punteado ámbar, leños pálidos); estacas en las puntas; num = número pintado
export const PilaLena: React.FC<{ x: number; piso: number; w: number; h: number; prog: number; seed?: number; fantasma?: boolean; estacas?: boolean; num?: string; numO?: number; prof?: number }> = ({ x, piso, w, h, prog, seed = 0, fantasma, estacas = true, num, numO = 1, prof = 0 }) => {
  if (prog <= 0) return null;
  const filas = Math.max(2, Math.round(h / 38));
  const fh = h / filas;
  const r = fh * 0.58;
  const paso = r * 1.62;
  const cols = Math.max(2, Math.floor((w - r) / paso));
  const vis = prog * filas;
  const leños: React.ReactNode[] = [];
  for (let fi = 0; fi < filas; fi++) {
    const q = Math.max(0, Math.min(1, vis - fi));
    if (q <= 0) break;
    const caida = (1 - q) * fh * 1.4;
    const o = Math.min(1, q * 1.6);
    for (let c = 0; c < cols; c++) {
      const k = `${seed}-${fi}-${c}`;
      const rr = r * (0.84 + random(`r${k}`) * 0.26);
      const tipo = random(`t${k}`) < 0.2 ? 0 : random(`t${k}`) < 0.6 ? 1 : 2;
      const cx = x + r * 0.9 + c * paso + (fi % 2 ? paso * 0.45 : 0) + (random(`x${k}`) - 0.5) * r * 0.3;
      if (cx > x + w - r * 0.6) continue;
      const cy = piso - fh * 0.5 - fi * fh + (random(`y${k}`) - 0.5) * fh * 0.14 - caida;
      leños.push(<g key={k} opacity={o}><PuntaLenio cx={cx} cy={cy} r={rr * (tipo === 0 ? 0.86 : 1.08)} tipo={tipo} rot={Math.floor(random(`o${k}`) * 4) * 90 + (random(`a${k}`) - 0.5) * 40} tono={Math.floor(random(`c${k}`) * 12)} fantasma={fantasma} /></g>);
    }
  }
  const top = piso - Math.min(1, prog) * h;
  return (
    <g opacity={fantasma ? 0.62 : 1}>
      {/* el costado en profundidad (la cuerda mide 4 ft hacia atrás) */}
      {prof > 0 && !fantasma && <path d={`M${x + w},${piso} l${prof},${-prof * 0.62} V${top - prof * 0.62} l${-prof},${prof * 0.62} Z`} fill="#5a3a24" />}
      {prof > 0 && !fantasma && <path d={`M${x},${top} l${prof},${-prof * 0.62} H${x + w + prof} l${-prof},${prof * 0.62} Z`} fill="#7a5034" />}
      {prof > 0 && !fantasma && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${x + 20 + i * (w / 6)},${top - 4} l${prof * 0.9},${-prof * 0.56}`} stroke="#4a2e1c" strokeWidth={5} />)}
      {/* sombra en la nieve */}
      {!fantasma && <ellipse cx={x + w / 2 + prof / 2} cy={piso + 6} rx={w / 2 + 40} ry={16} fill="#000" opacity={0.18} />}
      {fantasma && <rect x={x} y={piso - h} width={w} height={h} rx={6} fill="none" stroke={AMBAR} strokeWidth={5} strokeDasharray="16 12" opacity={1.4} />}
      {leños}
      {estacas && !fantasma && [x - 8, x + w - 6].map((sx, i) => <g key={i}><rect x={sx} y={piso - h - 30} width={14} height={h + 30} rx={4} fill="#5a3a24" /><rect x={sx} y={piso - h - 30} width={14} height={10} rx={3} fill="#e9eef8" opacity={0.9} /></g>)}
      {num && <text x={x + w / 2} y={piso - h / 2 + 34} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={Math.min(110, h * 0.62)} fill={fantasma ? AMBAR : "#fff3d8"} stroke="#120f18" strokeWidth={fantasma ? 0 : 6} paintOrder="stroke" opacity={numO}>{num}</text>}
    </g>
  );
};

// cota de medida (mundo o pantalla): línea con topes que se dibuja desde el centro (p 0..1)
export const Cota: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; ancho?: number }> = ({ x1, y1, x2, y2, p, color = AMBAR, ancho = 6 }) => {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const ax = mx + (x1 - mx) * p, ay = my + (y1 - my) * p, bx = mx + (x2 - mx) * p, by = my + (y2 - my) * p;
  const L = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / L) * 16, ny = ((x2 - x1) / L) * 16;
  return (
    <g stroke={color} strokeWidth={ancho} strokeLinecap="round" fill="none">
      <path d={`M${ax},${ay} L${bx},${by}`} />
      {p > 0.98 && <path d={`M${x1 - nx},${y1 - ny} L${x1 + nx},${y1 + ny} M${x2 - nx},${y2 - ny} L${x2 + nx},${y2 + ny}`} />}
    </g>
  );
};

// rótulo de pantalla que aparece con resorte (caja oscura con borde de color). x = centro, y = arriba
export const Rotulo3: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; sub?: string }> = ({ texto, x, y, desde, hasta = 1e9, color = AMBAR, tam = 40, sub }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 150 } });
  const o = interpolate(f, [desde, desde + 8, hasta, hasta + 10], [0, 1, 1, 0], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.75 + 0.25 * s})`, transformOrigin: "50% 0%", opacity: o, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color: "#f6ecd2", background: "rgba(18,15,24,0.86)", border: `3px solid ${color}`, borderRadius: 36, padding: "4px 26px 6px", whiteSpace: "nowrap", letterSpacing: 1 }}>
      {texto}
      {sub && <div style={{ fontSize: tam * 0.5, color, marginTop: -2, letterSpacing: 2 }}>{sub}</div>}
    </div>
  );
};

// texto a mano que se escribe con un barrido (pantalla, svg): nunca aparecen letras sueltas ni mutiladas
export const TextoBarrido: React.FC<{ texto: string; x: number; y: number; desde: number; dur?: number; tam?: number; color?: string; rot?: number; id: string }> = ({ texto, x, y, desde, dur = 14, tam = 80, color = AMBAR, rot = -4, id }) => {
  const f = useF();
  if (f < desde) return null;
  const u = interpolate(f, [desde, desde + dur], [0, 1], ou);
  const w = texto.length * tam * 0.52 + 30;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs><clipPath id={`tb${id}`}><rect x={x - 20} y={y - tam * 1.2} width={w * u + 20} height={tam * 1.7} /></clipPath></defs>
      <g clipPath={`url(#tb${id})`} transform={`rotate(${rot} ${x} ${y})`}>
        <text x={x} y={y} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={color} stroke="#120f18" strokeWidth={7} paintOrder="stroke" strokeLinejoin="round">{texto}</text>
      </g>
    </svg>
  );
};

// tira de 90 días (pantalla): título + 90 casillas en 2 filas que se llenan; x = centro, y = arriba
export const Tira90: React.FC<{ x: number; y: number; desde: number; prog: number; titulo?: string }> = ({ x, y, desde, prog, titulo = "90 DAYS OF WINTER AHEAD" }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  const n = Math.round(90 * prog);
  const W = 45 * 19 + 40;
  return (
    <svg width={W} height={130} viewBox={`0 0 ${W} 130`} style={{ position: "absolute", left: x - W / 2, top: y, opacity: Math.min(1, s * 1.4), transform: `scale(${0.8 + 0.2 * s})`, transformOrigin: "50% 0%" }}>
      <rect x={0} y={0} width={W} height={130} rx={22} fill="#120f18" opacity={0.88} stroke="#e2483a" strokeWidth={4} />
      <text x={W / 2} y={44} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f6ecd2" letterSpacing={2}>{titulo}</text>
      {Array.from({ length: 90 }).map((_, i) => <rect key={i} x={22 + (i % 45) * 19} y={62 + Math.floor(i / 45) * 30} width={14} height={24} rx={3} fill={i < n ? "#5ab0ff" : "#3a3446"} />)}
    </svg>
  );
};

// calendario de pared (mundo) que pasa de hoja: la hoja de arriba (de) se levanta y deja ver la de abajo (a)
export const CalPared: React.FC<{ x: number; y: number; de: string; a: string; pasa: number; f: number; s?: number }> = ({ x, y, de, a, pasa, f, s = 1 }) => {
  const u = interpolate(f, [pasa, pasa + 12], [0, 1], ou);
  const hoja = (mes: string, tinta: string) => (
    <g>
      <rect x={-70} y={0} width={140} height={170} rx={6} fill="#f6f1e6" stroke="#00000022" strokeWidth={2} />
      <rect x={-70} y={0} width={140} height={44} rx={6} fill="#e2483a" />
      <text x={0} y={32} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={mes.length > 6 ? 21 : 28} fill="#fff" letterSpacing={1}>{mes}</text>
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-60 + (i % 6) * 20.5} y={54 + Math.floor(i / 6) * 22} width={15} height={16} rx={2} fill={tinta} />)}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M0,-26 L-30,2 M0,-26 L30,2" stroke="#3a2a22" strokeWidth={3} /><circle cx={0} cy={-28} r={5} fill="#3a2a22" />
      {hoja(a, "#d8d0c0")}
      {u < 1 && <g transform={`translate(0,0) scale(1,${Math.cos(u * Math.PI * 0.95)})`} opacity={1 - u * 0.3}>{hoja(de, "#9aa4bc")}</g>}
      {u > 0.4 && <path d={`M-70,0 Q0,${-30 * u} 70,0`} stroke="#e8e0d0" strokeWidth={6} fill="none" opacity={1 - u} />}
    </g>
  );
};

// la nota de las reglas de June en la puerta de la heladera (inserto de pantalla): los renglones, y lo que marca
export const NotaReglas: React.FC<{ marca: number; circ: number }> = ({ marca, circ }) => {
  const L = ["1. FRESH FOOD FIRST", "  - save the cans", "2. NOTHING RISKY ALONE", "  - no ladders", "  - no chainsaws", "  - no going on the ice"];
  const y0 = 330;
  return (
    <g>
      {/* puerta de la heladera */}
      <rect x={0} y={0} width={1920} height={1080} fill="#e6e2da" />
      <rect x={0} y={0} width={1920} height={1080} fill="url(#nrg)" opacity={0.5} />
      <defs><linearGradient id="nrg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#b8b2a8" /></linearGradient></defs>
      <rect x={1700} y={180} width={40} height={600} rx={18} fill="#b8b4ac" />
      {/* imanes */}
      <circle cx={420} cy={250} r={34} fill="#3a7ac0" /><rect x={1340} y={820} width={120} height={70} rx={12} fill="#e0a23a" />
      <g transform="rotate(-2 960 560)">
        <rect x={560} y={180} width={800} height={760} fill="#fdf6d8" stroke="#e0d6b0" strokeWidth={4} />
        <rect x={900} y={160} width={120} height={50} fill="#e2483a" opacity={0.85} />
        <text x={620} y={270} fontFamily={F_MANO} fontWeight={700} fontSize={64} fill="#c0352c">JUNE'S RULES</text>
        {L.map((t, i) => <text key={i} x={620} y={y0 + 20 + i * 92} fontFamily={F_MANO} fontWeight={700} fontSize={i === 4 ? 66 : 56} fill="#1d3a8a" opacity={i === 4 || marca <= 0 ? 1 : 1 - 0.45 * Math.min(1, marca)}>{t}</text>)}
        {/* subrayado + círculo en «no chainsaws» */}
        {marca > 0 && <path d={`M680,${y0 + 20 + 4 * 92 + 18} L${680 + 470 * Math.min(1, marca)},${y0 + 20 + 4 * 92 + 12}`} stroke="#e2483a" strokeWidth={9} strokeLinecap="round" />}
        {circ > 0 && <ellipse cx={920} cy={y0 + 4 * 92} rx={310} ry={66} fill="none" stroke="#e2483a" strokeWidth={8} strokeDasharray={`${2 * Math.PI * 190 * circ} 4000`} transform={`rotate(-3 920 ${y0 + 4 * 92})`} />}
      </g>
    </g>
  );
};
// la punta del lápiz en NotaReglas para cada avance (para colgar la mano)
export const puntaNota = (marca: number, circ: number) => {
  const y0 = 330;
  if (circ > 0) { const a = -Math.PI + circ * Math.PI * 2; return { x: 920 + 310 * Math.cos(a), y: y0 + 4 * 92 + 66 * Math.sin(a) }; }
  return { x: 680 + 470 * Math.min(1, marca), y: y0 + 20 + 4 * 92 + 14 };
};

// súper sin luz (mundo): velo azul oscuro + tubos apagados + la luz gris del día que entra por la vidriera
export const VeloSinLuz: React.FC<{ piso: number; x0?: number; w?: number; o?: number }> = ({ piso, x0 = -800, w = 6000, o = 0.5 }) => (
  <g>
    <rect x={x0} y={-1500} width={w} height={3000} fill="#0d1226" opacity={o} />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-200 + i * 560 - 170} y={piso - 868} width={340} height={20} rx={10} fill="#4a5058" />)}
  </g>
);

// humo de escape (mundo): bocanadas grises que suben y se abren desde (x, y)
export const HumoEscape: React.FC<{ x: number; y: number; f: number; desde: number; n?: number; dir?: number }> = ({ x, y, f, desde, n = 7, dir = -1 }) => {
  if (f < desde) return null;
  return (
    <g>{Array.from({ length: n }).map((_, i) => {
      const t = ((f - desde + i * 7) % 42) / 42;
      if (f - desde < i * 4) return null;
      return <circle key={i} cx={x + dir * 60 * t + Math.sin(i * 2 + f / 6) * 8} cy={y - 110 * t} r={10 + 30 * t} fill="#c8ccd6" opacity={0.55 * (1 - t)} />;
    })}</g>
  );
};

// rollo de cinta (en la mano)
export const RolloCinta: React.FC = () => (
  <g transform="translate(6,-6)"><circle r={16} fill="#d9c27a" /><circle r={8} fill="#5a4a2e" /><rect x={10} y={-2} width={26} height={9} fill="#d9c27a" transform="rotate(20)" /></g>
);

// Theo de liniero (flashback): casco amarillo y chaleco reflectivo
export const THEO_LINIERO: Look = { ...THEO, accesorios: [{ t: "gorra", color: "#f2c414" }, { t: "chaleco", color: "#d6e83a" }] };

// velo cálido de recuerdo (pantalla) + marco de foto
export const VeloRecuerdo: React.FC<{ o?: number; texto?: string }> = ({ o = 1, texto }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <div style={{ position: "absolute", inset: 0, background: "#c89a5a", opacity: 0.2 }} />
    <div style={{ position: "absolute", inset: 0, border: "26px solid rgba(20,14,10,0.55)" }} />
    {texto && <div style={{ position: "absolute", left: 1500, top: 980, transform: "translateX(-50%)", fontFamily: F_HUD, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: "#f6ecd2", opacity: 0.85 }}>{texto}</div>}
  </div>
);

// tarjeta de servicio que se tacha con una línea sobre la palabra (pantalla). x = centro, y = centro
export const Servicio: React.FC<{ x: number; y: number; icono: "estufa" | "hospital" | "telefono"; rotulo: string; desde: number; tacha: number; w?: number }> = ({ x, y, icono, rotulo, desde, tacha, w = 400 }) => {
  const f = useF();
  if (f < desde) return null;
  const s = interpolate(f, [desde, desde + 10], [0.6, 1], ou);
  const o = interpolate(f, [desde, desde + 8], [0, 1], cl);
  const t = interpolate(f, [tacha, tacha + 10], [0, 1], ou);
  const h = 120;
  const tw = rotulo.length * 24 + 10;
  const c = "#f6ecd2";
  return (
    <svg width={w + 40} height={h + 40} viewBox={`-20 -20 ${w + 40} ${h + 40}`} style={{ position: "absolute", left: x - w / 2 - 20, top: y - h / 2 - 20, opacity: o * (1 - 0.25 * t), transform: `scale(${s})`, overflow: "visible" }}>
      <rect x={0} y={0} width={w} height={h} rx={24} fill="#120f18" opacity={0.88} stroke={t > 0.5 ? "#e2483a" : "#f6ecd255"} strokeWidth={4} />
      <g transform={`translate(64,${h / 2})`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={1 - 0.5 * t}>
        {icono === "estufa" && <><rect x={-30} y={-22} width={60} height={48} rx={7} /><rect x={-17} y={-10} width={34} height={24} rx={4} fill="#ff8a3a" stroke="none" opacity={1 - t} /><path d="M-6,-22 V-42" /></>}
        {icono === "hospital" && <><rect x={-34} y={-36} width={68} height={72} rx={7} /><path d="M0,-18 V18 M-18,0 H18" stroke="#e2483a" strokeWidth={10} /></>}
        {icono === "telefono" && <><rect x={-20} y={-38} width={40} height={76} rx={8} /><path d="M-7,28 h14" /><path d="M30,-30 q12,12 0,26" opacity={1 - t} /></>}
      </g>
      <text x={122} y={h / 2 + 13} fontFamily={F_HUD} fontWeight={600} fontSize={38} fill={c} letterSpacing={2}>{rotulo}</text>
      {t > 0 && <path d={`M114,${h / 2} L${114 + (tw + 16) * t},${h / 2 - 2}`} stroke="#e2483a" strokeWidth={7} strokeLinecap="round" />}
      {t > 0.9 && <path d={`M${w - 48},${h / 2 - 14} l28,28 M${w - 20},${h / 2 - 14} l-28,28`} stroke="#e2483a" strokeWidth={7} strokeLinecap="round" />}
    </svg>
  );
};
