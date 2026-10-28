// Kit del video entero al nivel del piloto (28-oct, «es un 9, seguí»): reloj ES→EN por palabras ancla, tomas con
// corte seco, encuadres (plano medio corto / medio / inserto al piso), el vestuario de Tiza según el día, y los objetos
// 2D chicos que se repiten entre bloques. Todo determinista por cuadro.
import React from "react";
import { interpolate, spring } from "remotion";
import { mira } from "../../anikit/camara";
import { Ropa } from "../../stickman3d/vestuario";
import { ROPA } from "../elenco";
import { Idioma } from "../escena";
import { Globo } from "../iconos";
import { PISO } from "../sets/londres";
import { PasoGuion } from "../../stickman3d/acciones";
import { Personaje } from "../capa3d";

// plano medio corto (la ref del creador): cintura → coronilla en el alto del cuadro
export const PMC = { y: PISO - 274, zoom: 3.85 };
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export type B = { D: number; L: Idioma; f0?: number };
export const M_ = "#3a2414"; // la tinta de todo (mismo marrón que el contorno de los personajes)

// Los tiempos de cada bloque se escriben en segundos de la voz ES; `pares` = [s ES, s EN] de palabras que se
// corresponden (asr/bNN_{es,en}.json). Entre anclas se interpola lineal; así cada plano cae en SU frase en los dos
// idiomas. `off` = cuadros donde empieza este pedazo cuando el bloque está partido en dos sets.
export const reloj = (L: Idioma, pares: [number, number][], off = 0) => {
  const abs = (s: number) => {
    if (L === "es") return s;
    let a: [number, number] = [0, 0];
    for (const b of pares) {
      if (s <= b[0]) return a[1] + ((s - a[0]) * (b[1] - a[1])) / Math.max(0.001, b[0] - a[0]);
      a = b;
    }
    return a[1] + (s - a[0]) * 1.25;
  };
  return { S: (s: number) => abs(s) - off / 30, F: (s: number) => Math.round(abs(s) * 30) - off };
};

// ── encuadres ──
export type Enc = { x: number; y: number; z: number; rot?: number };
export const P = (x: number, dz = 0, rot = 0): Enc => ({ x, y: PMC.y, z: PMC.zoom + dz, rot }); // plano medio corto
export const Me = (x: number, z: number, dy = 0, rot = 0): Enc => ({ x, y: PISO - 272 + dy, z, rot }); // medio / general
export const Pi = (x: number, z = 3.6, dy = 0, rot = 0): Enc => ({ x, y: PISO - 75 + dy, z, rot }); // inserto al piso
export const E = (x: number, y: number, z: number, rot = 0): Enc => ({ x, y, z, rot });
// una toma = [s ES de entrada, encuadre al entrar, encuadre al salir]: corte seco a la siguiente. Sin encuadre de
// salida, la cámara viaja (paneo curvo) hasta el de entrada de la próxima.
export const tomas = (F: (s: number) => number, D: number, lista: [number, Enc, Enc?][]) =>
  lista.flatMap(([s, a, b], i) => {
    const f0 = i === 0 ? 0 : F(s), f1 = i + 1 < lista.length ? F(lista[i + 1][0]) - 1 : D;
    const o = [mira(f0, a.x, a.y, a.z, { curva: "inout", rot: a.rot ?? 0 })];
    if (b) o.push(mira(Math.max(f0 + 1, f1), b.x, b.y, b.z, { curva: "inout", rot: b.rot ?? 0 }));
    return o;
  });

// los globitos de un bloque (s ES); cada uno lleva un blip en la mezcla (D:/rtmp/blanco/v01/mezclar_blips_video.py)
export type GloboDef = { tipo?: Parameters<typeof Globo>[0]["tipo"]; texto?: [string, string]; desde: number; hasta: number; x: number; y: number; cola: [number, number]; tam?: number };
export const Globos: React.FC<{ lista: GloboDef[]; F: (s: number) => number; L: Idioma }> = ({ lista, F, L }) => (
  <>{lista.map((g, i) => <Globo key={i} {...g} texto={g.texto ? (L === "es" ? g.texto[0] : g.texto[1]) : undefined} desde={F(g.desde)} hasta={F(g.hasta)} />)}</>
);

// fuera de cuadro salvo entre [a, b] (s locales): así un extra no se cuela en otro plano
export const solo = (s: number, a: number, b: number) => (s >= a && s <= b ? 0 : 9000);
// caminata de largo FIJO en los dos idiomas: corrige el avance del ciclo de caminar (0,95 u/s × K = 88 px/s)
export const VCAM = 88.4, VCOR = 232.5;
export const tramo = (s: number, s0: number, s1: number, d: number, v = VCAM) => (d / Math.max(0.1, s1 - s0) - v * Math.sign(d)) * Math.min(Math.max(s - s0, 0), s1 - s0);
export const avance = (s: number, s0: number, s1: number, d: number) => d * Math.min(1, Math.max(0, (s - s0) / Math.max(0.1, s1 - s0)));

// ── Tiza según el día: llega en zapatillas; el trapero le da capa, botas y gorro (b03); cambia el gorro por el gato (b10)
export const ROPA_T0: Ropa = ROPA.tiza;
export const ROPA_CAPA: Ropa = { capa: "#7a5030", calzado: { tipo: "zapatillas" } };
export const ROPA_BOTAS: Ropa = { capa: "#7a5030", calzado: { tipo: "botas", color: "#6a4a2a" } };
export const ROPA_T1: Ropa = { ...ROPA_BOTAS, sombrero: { tipo: "boina", color: "#5a4030" } }; // con gorro
export const ROPA_T2: Ropa = ROPA_BOTAS; // sin gorro (lo cambió por el gato)

// ── objetos 2D chicos (capa «sobre», coordenadas del mundo) ──
export const Moneda: React.FC<{ f: number; f0: number; x: number; y: number; s?: number }> = ({ f, f0, x, y, s: e = 1 }) => {
  const t = f - f0;
  if (t < 0) return null;
  const cae = interpolate(t, [0, 9], [-140, 0], cl), bote = t > 9 ? Math.abs(Math.sin((t - 9) * 0.5)) * 18 * Math.exp(-(t - 9) * 0.18) : 0;
  const gira = Math.abs(Math.cos(t * 0.35 * Math.exp(-t * 0.03)));
  return (
    <g transform={`translate(${x},${y + cae - bote}) scale(${e})`}>
      <ellipse cy={bote + 4} rx={26} ry={6} fill="#1a0e06" opacity={0.25} />
      <g transform={`scale(${0.25 + 0.75 * gira},1)`}><circle r={24} fill="#d8dce0" stroke={M_} strokeWidth={5} /><circle r={16} fill="none" stroke="#9aa2a8" strokeWidth={3} /><path d="M-10 -12 Q-16 -4 -14 6" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" /></g>
      {t > 10 && t < 30 && [0, 1, 2, 3].map((i) => <path key={i} d="M0 -34 V-48" stroke="#fff6c0" strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 90 + 45}) scale(${interpolate(t, [10, 30], [0.6, 1.4], cl)})`} opacity={interpolate(t, [10, 30], [1, 0], cl)} />)}
    </g>
  );
};
export const Repollo: React.FC<{ x: number; y: number; r: number; s?: number }> = ({ x, y, r, s: e = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${e})`}><circle r={30} fill="#7cc46a" stroke={M_} strokeWidth={5} /><path d="M-18 0 Q0 -20 18 0 M-12 12 Q0 0 12 12 M0 -28 V26" stroke="#3c7a3a" strokeWidth={4} fill="none" /></g>
);
// gotas de sudor que caen de la frente (≤2 Hz)
export const Sudor: React.FC<{ f: number; x: number; y: number; desde: number; hasta: number; s?: number }> = ({ f, x, y, desde, hasta, s: e = 1 }) => {
  if (f < desde || f > hasta) return null;
  return <g>{[0, 1].map((i) => { const u = ((f - desde + i * 17) % 34) / 34; return <path key={i} transform={`translate(${x + (i ? 34 : -30) * e},${y + u * 70 * e}) scale(${e})`} d="M0 -16 Q10 0 10 6 A10 10 0 0 1 -10 6 Q-10 0 0 -16 Z" fill="#7fc8f0" stroke={M_} strokeWidth={3} opacity={1 - u * 0.6} />; })}</g>;
};
// vapor / olor que sube ondulando (lento)
export const Vapor: React.FC<{ f: number; x: number; y: number; color?: string; n?: number; alto?: number; s?: number }> = ({ f, x, y, color = "#fff6e6", n = 3, alto = 160, s: e = 1 }) => (
  <g fill="none" strokeLinecap="round">{Array.from({ length: n }).map((_, i) => {
    const u = ((f * 0.012 + i / n) % 1), dx = (i - (n - 1) / 2) * 34 * e;
    return <path key={i} d={`M${x + dx} ${y - u * alto * e} q-14 -20 0 -40 q14 -20 0 -40`} stroke={color} strokeWidth={9 * e} opacity={Math.sin(u * Math.PI) * 0.85} />;
  })}</g>
);
// pulgas que saltan en arco (cada una con su fase)
export const Pulgas: React.FC<{ f: number; x: number; y: number; n?: number; ancho?: number; s?: number }> = ({ f, x, y, n = 8, ancho = 220, s: e = 1 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const per = 22 + (i % 4) * 5, u = ((f + i * 7) % per) / per, x0 = x + (((i * 53) % 100) / 100 - 0.5) * ancho;
    const px = x0 + (u - 0.5) * 40 * (i % 2 ? 1 : -1), py = y - Math.sin(u * Math.PI) * (50 + (i % 3) * 25) * e;
    return <g key={i} transform={`translate(${px},${py}) scale(${e})`}><ellipse rx={7} ry={5} fill="#5a2a14" stroke={M_} strokeWidth={2} /><path d="M-4 4 l-6 8 M3 4 l2 9" stroke={M_} strokeWidth={2} /></g>;
  })}</g>
);
// estrellitas del golpe (giran lento)
export const Estrellas: React.FC<{ f: number; f0: number; x: number; y: number; dur?: number }> = ({ f, f0, x, y, dur = 40 }) => {
  const t = f - f0;
  if (t < 0 || t > dur) return null;
  const s = spring({ frame: t, fps: 30, config: { damping: 10, stiffness: 180 } }) * interpolate(t, [dur - 8, dur], [1, 0], cl);
  return <g transform={`translate(${x},${y}) scale(${s})`}>{[0, 1, 2].map((i) => { const a = t * 0.12 + (i * 2 * Math.PI) / 3; return <path key={i} transform={`translate(${Math.cos(a) * 54},${Math.sin(a) * 16})`} d="M0 -14 L4 -4 L14 -4 L6 3 L9 14 L0 7 L-9 14 L-6 3 L-14 -4 L-4 -4 Z" fill="#ffd23c" stroke={M_} strokeWidth={3} />; })}</g>;
};

// lo que el ciclo de caminar/correr ya lo movió (para corregirlo y dejar a cada uno donde lo pide el plano)
export const integrado = (g: PasoGuion[], s: number) => {
  let d = 0;
  g.forEach((p, i) => {
    const v = p.accion === "caminar" ? VCAM : p.accion === "correr" ? VCOR : 0;
    const b = Math.min(s, g[i + 1]?.t ?? Infinity);
    if (v && b > p.t) d += v * Math.sin(((p.rotY ?? 0) * Math.PI) / 180) * (b - p.t);
  });
  return d;
};
// un personaje que está donde dice `donde(s)` (x del mundo según el segundo local), camine o no
export const ubicado = (x0: number, g: PasoGuion[], donde: (s: number) => number, extra: Partial<Personaje> = {}): Personaje => ({
  x: x0, guion: g, semilla: 7, ...extra,
  mov: (s) => ({ ...(extra.mov ? extra.mov(s) : {}), dx: donde(s) - x0 - integrado(g, s) + (extra.mov ? extra.mov(s).dx ?? 0 : 0) }),
});
// tabla de posiciones por plano: [desde s, x] (salto en el corte)
export const segun = (s: number, tabla: [number, number][]) => tabla.reduce((x, [t, v]) => (s >= t ? v : x), tabla[0][1]);
// fuera de cuadro salvo dentro de alguna de las ventanas [a, b] (s locales)
export const ventanas = (s: number, vs: [number, number][]) => (vs.some(([a, b]) => s >= a && s < b) ? 0 : 9000);
// del mundo a la pantalla para un encuadre (sin la rotación chica): para apuntar la cola de un globo a una cabeza
export const pant = (e: Enc, wx: number, wy: number): [number, number] => [960 + (wx - e.x) * e.z, 540 + (wy - e.y) * e.z];
export const cab = (e: Enc, wx: number, alto = 0) => pant(e, wx, PISO - 300 - alto);
