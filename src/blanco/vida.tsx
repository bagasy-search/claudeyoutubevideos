// VIDA del mundo: lo que hace que en cada segundo pasen cosas sin ensuciar el cuadro.
//   transeuntes()  → gente 3D que cruza la calle en el fondo (más chica = más lejos), con oficios y cargas
//   PasaFrente     → siluetas grandes y oscuras que cruzan PEGADAS a cámara (capa frente): carro, gente, ropa colgada
//   Polvo          → motas en el haz de luz (capa sobre), deriva lenta, determinista
//   Moscas         → 3-5 puntitos que orbitan algo sucio (≤2 Hz)
//   Despertar      → pantalla negra que se abre en iris desde un punto, con dos parpadeos (en pantalla, fuera del Plano)
import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { useF } from "../anikit/camara";
import { PasoGuion } from "../stickman3d/acciones";
import { Personaje } from "./capa3d";
import { PISO } from "./sets/londres";
import { OFICIOS, ROPA } from "./elenco";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// gente que cruza: repartida en [x0, x1], en 2 carriles de profundidad, mitad va y mitad viene; algunos cargan cajas
export const transeuntes = (o: { x0: number; x1: number; n: number; seed: string; dur: number; quietos?: number; sinCargas?: boolean; expr?: PasoGuion["expr"] }): Personaje[] =>
  Array.from({ length: o.n }).map((_, i) => {
    const r = (k: string) => random(`${o.seed}-${i}-${k}`);
    const va = r("dir") < 0.5 ? 1 : -1;
    const lejos = r("prof") < 0.55;
    const carga = o.sinCargas === false && r("carga") < 0.25; // con vestuario cada uno ya lleva su objeto
    const quieto = i < (o.quietos ?? 0);
    const x = o.x0 + (o.x1 - o.x0) * ((i + r("x") * 0.8) / o.n) - va * o.dur * 44;
    const accion = quieto ? (r("q") < 0.5 ? "explicar" : "reir") : carga ? "cargar_caja" : "caminar";
    return {
      x: quieto ? o.x0 + (o.x1 - o.x0) * ((i + 0.5) / o.n) : x, ropa: ROPA[OFICIOS[Math.floor(r("c") * OFICIOS.length)]],
      escala: lejos ? 0.72 : 0.86, prof: lejos ? -4 - r("z") : -2.2 - r("z") * 0.6, semilla: 200 + i, sombra: lejos ? 0.18 : 0.26,
      guion: [{ t: 0, accion, rotY: quieto ? (r("q2") < 0.5 ? 40 : -40) : va * 90, expr: o.expr ?? (quieto ? "hablando" : r("e") < 0.3 ? "aburrido" : "neutral") }],
      // la caja se lleva caminando: el paso de cargar no avanza solo, lo empuja mov
      mov: carga ? (s) => ({ dx: va * s * 70 }) : undefined,
    } as Personaje;
  });

// silueta oscura enorme cruzando delante de cámara (va en la capa frente, z 1.4: con el paralaje pasa rápido)
export const PasaFrente: React.FC<{ tipo: "carro" | "gente" | "ropa" | "barril" | "vaca"; x0: number; x1: number; desde: number; dur: number; y?: number; color?: string }> = ({ tipo, x0, x1, desde, dur, y = PISO + 120, color = "#24160c" }) => {
  const f = useF();
  const t = (f - desde) / dur;
  if (t < 0 || t > 1) return null;
  const x = x0 + (x1 - x0) * t;
  const paso = Math.sin(f * 0.35) * 6; // 1,7 Hz
  const g = (hijo: React.ReactNode) => <g transform={`translate(${x},${y + Math.abs(paso)})`} fill={color}>{hijo}</g>;
  switch (tipo) {
    case "carro": return g(<><rect x={-300} y={-260} width={600} height={140} rx={14} /><circle cx={-180} cy={-70} r={90} /><circle cx={180} cy={-70} r={90} /><path d="M300 -200 L520 -170" stroke={color} strokeWidth={22} strokeLinecap="round" /><path d="M-280 -260 Q-200 -420 0 -400 Q200 -440 280 -260 Z" /></>);
    case "gente": return g(<><circle cy={-560} r={70} /><rect x={-70} y={-480} width={140} height={300} rx={60} /><rect x={-60} y={-200} width={44} height={200} rx={20} transform={`rotate(${paso * 2} -38 -200)`} /><rect x={16} y={-200} width={44} height={200} rx={20} transform={`rotate(${-paso * 2} 38 -200)`} /></>);
    case "ropa": return g(<><path d="M-700 -760 Q0 -680 700 -760" stroke={color} strokeWidth={8} fill="none" />{[-500, -260, 20, 300, 520].map((cx, i) => <path key={cx} d={`M${cx - 70} ${-728 + Math.abs(cx) * 0.04} h140 l-14 ${150 + (i % 2) * 40} h-112 Z`} transform={`rotate(${Math.sin(f * 0.1 + i) * 4} ${cx} -720)`} />)}</>);
    case "barril": return g(<><rect x={-110} y={-280} width={220} height={280} rx={40} /><rect x={150} y={-200} width={170} height={200} rx={30} /></>);
    case "vaca": return g(<><ellipse cy={-300} rx={300} ry={150} /><circle cx={300} cy={-380} r={90} /><rect x={-220} y={-200} width={50} height={200} /><rect x={150} y={-200} width={50} height={200} /></>);
  }
};

// motas de polvo en el haz: banda vertical [x0,x1] × [y0,y1] del mundo
export const Polvo: React.FC<{ x0: number; x1: number; y0?: number; y1?: number; n?: number; color?: string; o?: number }> = ({ x0, x1, y0 = PISO - 700, y1 = PISO, n = 40, color = "#fff2c8", o = 0.7 }) => {
  const f = useF();
  return (
    <g>{Array.from({ length: n }).map((_, i) => {
      const r = (k: string) => random(`polvo-${i}-${k}`);
      const u = (r("u") + f * (0.0006 + r("v") * 0.0008)) % 1;
      const x = x0 + (x1 - x0) * r("x") + Math.sin(f * 0.03 + i) * 24;
      const y = y1 - (y1 - y0) * u;
      return <circle key={i} cx={x} cy={y} r={2 + r("r") * 3.5} fill={color} opacity={o * Math.sin(u * Math.PI) * (0.4 + r("o") * 0.6)} />;
    })}</g>
  );
};

export const Moscas: React.FC<{ x: number; y: number; n?: number; r?: number }> = ({ x, y, n = 4, r = 60 }) => {
  const f = useF();
  return <g>{Array.from({ length: n }).map((_, i) => {
    const a = f * (0.11 + i * 0.023) + i * 2.1;
    return <circle key={i} cx={x + Math.cos(a) * r * (0.6 + 0.4 * Math.sin(a * 0.7))} cy={y + Math.sin(a * 1.3) * r * 0.45} r={4} fill="#1a120c" />;
  })}</g>;
};

// pantalla negra → dos parpadeos → se abre en iris desde (cx,cy) de la pantalla. f0 = primer parpadeo; abre del todo en f0+fin
export const Despertar: React.FC<{ f0?: number; fin?: number; cx?: number; cy?: number }> = ({ f0 = 18, fin = 70, cx = 960, cy = 470 }) => {
  const f = useF();
  if (f > f0 + fin + 30) return null;
  // apertura de párpado (0 cerrado … 1 abierto): parpadeo corto, se cierra, segundo parpadeo, abre
  const p = interpolate(f, [0, f0, f0 + 6, f0 + 14, f0 + 22, f0 + 30, f0 + 40, f0 + fin], [0, 0, 0.22, 0.22, 0, 0, 0.45, 1], cl);
  const iris = interpolate(f, [f0 + 30, f0 + fin + 30], [0, 1], cl);
  const alto = p * 640; // los párpados se separan desde el centro
  const R = 140 + iris * 1500;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080}>
        <defs>
          <radialGradient id="iris" cx={cx} cy={cy} r={R} gradientUnits="userSpaceOnUse">
            <stop offset="0.55" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={Math.min(1, 1.15 - iris)} />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#iris)" />
        <path d={`M0 0 H1920 V${cy - alto} Q960 ${cy - alto * 1.25} 0 ${cy - alto} Z`} fill="#000" />
        <path d={`M0 1080 H1920 V${cy + alto} Q960 ${cy + alto * 1.25} 0 ${cy + alto} Z`} fill="#000" />
      </svg>
    </AbsoluteFill>
  );
};

// haz de sol cónico que entra en diagonal entre las casas (capa sobre, se mezcla en screen) y respira muy lento
export const Haz: React.FC<{ x: number; ancho?: number; inclin?: number; o?: number; color?: string }> = ({ x, ancho = 260, inclin = 420, o = 0.22, color = "#ffe2a0" }) => {
  const f = useF();
  const r = o * (0.85 + 0.15 * Math.sin(f * 0.02 + x));
  const id = `haz${Math.round(x)}`;
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={r} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <path d={`M${x - ancho * 0.25} ${PISO - 1500} L${x + ancho * 0.25} ${PISO - 1500} L${x + inclin + ancho} ${PISO + 40} L${x + inclin - ancho * 0.4} ${PISO + 40} Z`} fill={`url(#${id})`} />
    </g>
  );
};

// bocanada de humo que cruza (bolas grises que crecen y se apagan; nada de blur)
export const Humo: React.FC<{ x0: number; x1: number; y: number; desde: number; dur: number; r?: number; color?: string; o?: number }> = ({ x0, x1, y, desde, dur, r = 90, color = "#cfc6bc", o = 0.55 }) => {
  const f = useF();
  return <g>{Array.from({ length: 9 }).map((_, i) => {
    const t = (f - desde - i * 3) / dur;
    if (t < 0 || t > 1) return null;
    const e = 1 - (1 - t) ** 2;
    return <circle key={i} cx={x0 + (x1 - x0) * e + Math.sin(i * 2.3) * r * 0.6} cy={y - e * r * 0.8 + Math.cos(i * 1.7) * r * 0.4} r={r * (0.5 + e * 0.9) * (0.7 + (i % 3) * 0.15)} fill={color} opacity={o * Math.sin(t * Math.PI)} />;
  })}</g>;
};

// salpicón de barro: gotas con tiro parabólico desde (x, y) que caen y quedan como manchas
export const Salpicon: React.FC<{ x: number; y: number; desde: number; n?: number; fuerza?: number; color?: string; seed?: string }> = ({ x, y, desde, n = 14, fuerza = 1, color = "#5a3e22", seed = "sal" }) => {
  const f = useF();
  const t = (f - desde) / 30;
  if (t < 0) return null;
  return <g>{Array.from({ length: n }).map((_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    const a = Math.PI * (0.1 + r("a") * 0.8), v = (260 + r("v") * 420) * fuerza;
    const vx = Math.cos(a) * v * (r("s") < 0.5 ? -1 : 1), vy = -Math.sin(a) * v;
    const tc = (-vy * 2) / 1800; // vuelve al piso
    const tt = Math.min(t, tc);
    const gx = x + vx * tt, gy = y + vy * tt + 900 * tt * tt;
    const tam = 5 + r("r") * 11;
    return t < tc ? <circle key={i} cx={gx} cy={gy} r={tam} fill={color} /> : <ellipse key={i} cx={gx} cy={y + 2} rx={tam * 1.8} ry={tam * 0.45} fill={color} opacity={0.85} />;
  })}<ellipse cx={x} cy={y + 2} rx={70 * fuerza * Math.min(1, t * 8)} ry={12 * fuerza} fill={color} /></g>;
};

// niebla negra de la peste: entra desde la derecha con borde ondulado; `borde(f)` = x del mundo del frente de la niebla
export const Niebla: React.FC<{ borde: number; y0?: number; y1?: number; color?: string; o?: number }> = ({ borde, y0 = PISO - 1600, y1 = PISO + 900, color = "#141012", o = 0.9 }) => {
  const f = useF();
  const pts = Array.from({ length: 24 }).map((_, i) => {
    const y = y0 + ((y1 - y0) * i) / 23;
    return `${borde + Math.sin(i * 1.3 + f * 0.04) * 60 + Math.sin(i * 0.5 - f * 0.025) * 90},${y}`;
  });
  return (
    <g opacity={o}>
      {/* borde: bolas que se arremolinan (≤1 Hz) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const y = y0 + ((y1 - y0) * (i + 0.5)) / 16;
        return <circle key={i} cx={borde + Math.sin(i * 2.1 + f * 0.05) * 70} cy={y} r={150 + Math.sin(i + f * 0.03) * 40} fill={color} opacity={0.55} />;
      })}
      <polygon points={`${pts.join(" ")} ${borde + 9000},${y1} ${borde + 9000},${y0}`} fill={color} />
    </g>
  );
};

// bandada que cruza el cielo (alas a ≤2 Hz), en V suelta
export const Pajaros: React.FC<{ x0: number; x1: number; y: number; desde: number; dur: number; n?: number; s?: number; color?: string }> = ({ x0, x1, y, desde, dur, n = 7, s = 1, color = "#3a2a24" }) => {
  const f = useF();
  const t = (f - desde) / dur;
  if (t < 0 || t > 1) return null;
  return <g>{Array.from({ length: n }).map((_, i) => {
    const fila = Math.ceil(i / 2), lado = i % 2 ? 1 : -1;
    const x = x0 + (x1 - x0) * t - fila * 70 * s * Math.sign(x1 - x0);
    const yy = y + fila * lado * 40 * s + Math.sin(f * 0.05 + i) * 10;
    const a = Math.sin(f * 0.38 + i * 1.3) * 14 * s; // aleteo 1,8 Hz
    return <path key={i} d={`M${x - 22 * s} ${yy - a} Q${x - 8 * s} ${yy - 6 * s} ${x} ${yy} Q${x + 8 * s} ${yy - 6 * s} ${x + 22 * s} ${yy - a}`} stroke={color} strokeWidth={5 * s} fill="none" strokeLinecap="round" />;
  })}</g>;
};
