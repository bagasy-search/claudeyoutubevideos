// lc02 · planos 41-80 — piezas propias (rehechura v2, 26-oct):
//  · EscenaNB: la Escena del kit SIN motion blur (el Plano del kit borronea todo paneo > 3 px/cuadro).
//  · PjM: el actor con IK a puntos del MUNDO (manos que agarran de verdad) y un render-prop `mundo` con las
//    articulaciones en coordenadas del mundo (para colgar mejilla hinchada, linterna en la boca, objetos con texto
//    que NO se espejan, etc.).
//  · Ore (labrador de verdad), escáner de mano legible, mano con lápiz, mapas, gráficos y sets chicos.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import { Clave, poseEn, temblor, useF } from "../../anikit/camara";
import { Actor, estadoActor, Paso, posRuta } from "../../anikit/actor";
import { alcanzar, articulaciones, huesosDe, Look, Pose } from "../../anikit/personaje";
import { Paleta } from "../../anikit/paletas";
import { Halo } from "../../anikit/luz";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { F_MONO } from "../hud";
import { NieveCae } from "../mundo/comun";

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const io = Easing.inOut(Easing.cubic);
export const tr = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], { ...cl, easing: io });

// ======================================================================================================
// EscenaNB: igual que anikit/Escena (3 capas con paralaje, temblor de mano) pero sin desenfoque de movimiento
// ======================================================================================================
type Est = { x: number; y: number; zoom: number; rot: number; foco: number };
const CamCtx = createContext<Est>({ x: 0, y: 0, zoom: 1, rot: 0, foco: 1 });
const CapaNB: React.FC<{ z: number; dmax?: number; children: React.ReactNode }> = ({ z, dmax = 18, children }) => {
  const c = useContext(CamCtx);
  const par = Math.max(0.05, z);
  const zoom = 1 + (c.zoom - 1) * par;
  const blur = Math.min(3, Math.abs(z - c.foco) * dmax);
  return (
    <AbsoluteFill style={{ transform: `translate(${-c.x * par}px, ${-c.y * par}px) rotate(${c.rot * par}deg) scale(${zoom})`, transformOrigin: "50% 50%" }}>
      <AbsoluteFill style={{ filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export type EscenaNBProps = {
  Set: React.FC<any>; pal: Paleta; claves: Clave[]; setProps?: Record<string, unknown>;
  medio?: React.ReactNode; frente?: React.ReactNode; detras?: React.ReactNode; hud?: React.ReactNode; lejosExtra?: React.ReactNode;
  mano?: number; seed?: number; zLejos?: number; fondo?: string; golpeF?: number; sinFrenteSet?: boolean;
};
export const EscenaNB: React.FC<EscenaNBProps> = ({ Set, pal, claves, setProps = {}, medio, frente, detras, hud, lejosExtra, mano = 3, seed = 0, zLejos = 0.25, fondo, golpeF, sinFrenteSet }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const p = poseEn(claves, f, fps);
  const s = temblor(f, fps, mano, seed);
  const g = golpeF !== undefined && f >= golpeF ? 7 * Math.exp(-(f - golpeF) / 3) * Math.sin((f - golpeF) * 2.2) : 0;
  const sp = { f, pal, ...setProps };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: fondo ?? pal.cielo[0], overflow: "hidden" }}>
        <CamCtx.Provider value={{ x: p.x + s.x + g, y: p.y + s.y - g * 0.6, zoom: p.zoom, rot: p.rot + s.rot, foco: p.foco }}>
          <CapaNB z={zLejos} dmax={3}><Set capa="lejos" {...sp} />{lejosExtra}</CapaNB>
          <CapaNB z={1}><Set capa="medio" {...sp} />{detras}{medio}</CapaNB>
          <CapaNB z={1.4} dmax={5}>{!sinFrenteSet && <Set capa="frente" {...sp} />}{frente}</CapaNB>
        </CamCtx.Provider>
      </AbsoluteFill>
      {hud}
    </AbsoluteFill>
  );
};

// ======================================================================================================
// PjM: actor con IK a puntos del mundo + agregados en coordenadas del mundo
// ======================================================================================================
type K<T> = { f: number; v: T; d?: number }[];
export type Junta = { cabeza: { x: number; y: number }; manoD: { x: number; y: number }; manoI: { x: number; y: number }; hombro: { x: number; y: number }; cad: { x: number; y: number }; dir: 1 | -1; esc: number; boca: { x: number; y: number } };
export type Meta = { D?: { x: number; y: number } | null; I?: { x: number; y: number } | null; wD?: number; wI?: number };
export type PjMProps = {
  look: Look; ruta: Paso[]; poses?: K<string | Partial<Pose>>; caras?: K<string>; dir?: K<1 | -1>; habla?: [number, number][];
  enManoD?: React.ReactNode | ((f: number) => React.ReactNode); enManoI?: React.ReactNode | ((f: number) => React.ReactNode);
  miradas?: K<{ x: number; y: number }>; escala?: number; seed?: number; luz?: any; asiento?: K<number | undefined>; giros?: K<number>;
  opacidad?: (f: number) => number; correr?: number;
  ik?: (f: number) => Meta; // metas de las manos en el MUNDO (w = peso 0..1)
  extra?: (p: Pose, f: number) => Pose; // retoque después del IK
  mundo?: (j: Junta, f: number) => React.ReactNode; // se dibuja ENCIMA del actor, en coordenadas del mundo
  atras?: (j: Junta, f: number) => React.ReactNode; // se dibuja DEBAJO del actor
};
const llenarY = (r: Paso[]) => { let y = r[0].y ?? 0; return r.map((q) => (q.y === undefined ? { ...q, y } : ((y = q.y), q))); };
const escalon = <T,>(k: K<T> | undefined, f: number, def: T): T => { if (!k) return def; let v = k[0].v; for (const c of k) if (c.f <= f) v = c.v; return v; };
const dirEn = (a: PjMProps, ruta: Paso[], f: number): 1 | -1 => {
  if (a.dir) return escalon(a.dir, f, 1 as 1 | -1);
  const dx = posRuta(ruta, f + 2).x - posRuta(ruta, f - 2).x;
  if (Math.abs(dx) > 0.2) return dx > 0 ? 1 : -1;
  for (let i = ruta.length - 1; i > 0; i--) if (ruta[i].f <= f && ruta[i].x !== ruta[i - 1].x) return ruta[i].x > ruta[i - 1].x ? 1 : -1;
  const sig = ruta.find((q, i) => i > 0 && q.x !== ruta[i - 1].x);
  if (sig) return sig.x > ruta[ruta.indexOf(sig) - 1].x ? 1 : -1;
  return 1;
};
const mezclaA = (a: Pose, b: Partial<Pose>, w: number): Pose => { const o = { ...a }; (Object.keys(b) as (keyof Pose)[]).forEach((k) => (o[k] = a[k] + ((b[k] as number) - a[k]) * w)); return o; };
const actorDe = (a: PjMProps, ruta: Paso[]) => {
  const H = huesosDe(a.look.estilo, a.look.alto);
  const esc = a.escala ?? 1;
  const ajuste = a.ik || a.extra ? (p: Pose, f: number) => {
    let q = p;
    if (a.ik) {
      const m = a.ik(f);
      const pos = posRuta(ruta, f);
      const d = dirEn(a, ruta, f);
      const as = escalon(a.asiento, f, undefined as number | undefined);
      const loc = (w: { x: number; y: number }) => ({ x: ((w.x - pos.x) * d) / esc, y: (w.y - pos.y) / esc });
      if (m.D && (m.wD ?? 1) > 0.001) q = mezclaA(q, alcanzar(q, "D", loc(m.D), as, H), m.wD ?? 1);
      if (m.I && (m.wI ?? 1) > 0.001) q = mezclaA(q, alcanzar(q, "I", loc(m.I), as, H), m.wI ?? 1);
    }
    if (a.extra) q = a.extra(q, f);
    return q;
  } : undefined;
  return {
    look: a.look, ruta, poses: a.poses ?? [{ f: 0, v: "parado" }], caras: a.caras ?? [{ f: 0, v: "neutral" }], dir: a.dir, habla: a.habla,
    enManoD: a.enManoD, enManoI: a.enManoI, miradas: a.miradas, escala: esc, seed: a.seed ?? 1, luz: a.luz, asiento: a.asiento, ajuste, giros: a.giros, opacidad: a.opacidad, correr: a.correr,
  };
};
export const juntas = (a: PjMProps, f: number, fps: number): Junta => {
  const ruta = llenarY(a.ruta);
  const ap = actorDe(a, ruta);
  const s = estadoActor(ap as any, f, fps);
  const H = huesosDe(a.look.estilo, a.look.alto);
  const j = articulaciones(s.p, s.asiento, H);
  const W = (q: { x: number; y: number }) => ({ x: s.x + s.dir * s.esc * q.x, y: s.y + s.esc * q.y });
  const cab = W(j.cabeza);
  return { cabeza: cab, manoD: W(j.bD.mano), manoI: W(j.bI.mano), hombro: W(j.hombro), cad: W(j.cad), dir: s.dir, esc: s.esc, boca: { x: cab.x + s.dir * 26 * s.esc, y: cab.y + 16 * s.esc } };
};
export const PjM: React.FC<PjMProps> = (a) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const ruta = llenarY(a.ruta);
  const ap = actorDe(a, ruta);
  const j = a.mundo || a.atras ? juntas(a, f, fps) : null;
  return (
    <g>
      {j && a.atras?.(j, f)}
      <Actor {...(ap as any)} />
      {j && a.mundo?.(j, f)}
    </g>
  );
};

// ======================================================================================================
// utilería en el mundo
// ======================================================================================================
// silla de madera (asiento a 62 del piso → asiento del actor ≈ 64)
// alto = altura del asiento (taburete de la mesa del Living ≈ 100 → asiento del actor = alto + 4)
export const Silla: React.FC<{ x: number; piso: number; dir?: 1 | -1; color?: string; alto?: number; respaldo?: boolean }> = ({ x, piso, dir = 1, color = "#8a5a36", alto = 66, respaldo = true }) => (
  <g transform={`translate(${x},${piso}) scale(${dir},1)`}>
    {respaldo && <rect x={-40} y={-alto - 134} width={11} height={140} rx={4} fill="#6a4228" />}
    {respaldo && [0, 1, 2].map((k) => <rect key={k} x={-40} y={-alto - 122 + k * 38} width={30} height={8} rx={3} fill="#734a2c" />)}
    <rect x={-40} y={-alto} width={80} height={12} rx={4} fill={color} />
    <rect x={-36} y={-alto + 10} width={9} height={alto - 10} fill="#5e3a22" /><rect x={28} y={-alto + 10} width={9} height={alto - 10} fill="#5e3a22" />
    {alto > 80 && <rect x={-34} y={-alto * 0.4} width={66} height={6} fill="#5e3a22" />}
  </g>
);
// cuaderno rojo chico (en el mundo): tapa con el alce, tapa arrancada que cuelga
export const CuadernoChico: React.FC<{ x: number; y: number; rot?: number; s?: number; roto?: number }> = ({ x, y, rot = 0, s = 1, roto = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-26} y={-34} width={52} height={68} rx={4} fill="#f4ecd6" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-20} y={-24 + i * 12} width={40} height={2} fill="#9fb4d4" />)}
    {roto < 0.5 && <><rect x={-28} y={-36} width={56} height={72} rx={4} fill={ROJO_CENSO} /><rect x={-20} y={-26} width={40} height={14} rx={2} fill="#f4ecd6" /><circle cx={0} cy={10} r={9} fill="#7a4a26" /></>}
    {roto >= 0.5 && <path d="M-28,-36 h22 l-6,10 8,12 -7,14 9,12 -6,14 6,14 h-26 Z" fill={ROJO_CENSO} />}
  </g>
);
// tapa arrancada que vuela (x,y = punto donde se arranca; p = 0..1 del vuelo)
export const TapaVuela: React.FC<{ x: number; y: number; p: number; dir?: 1 | -1 }> = ({ x, y, p, dir = 1 }) => p <= 0 ? null : (
  <g transform={`translate(${x + dir * p * 170},${y - Math.sin(p * Math.PI) * 120 + p * p * 160}) rotate(${dir * p * 300})`}>
    <path d="M-6,-36 h34 v72 h-34 l7,-12 -9,-14 8,-14 -9,-12 7,-12 Z" fill={ROJO_CENSO} /><rect x={2} y={-26} width={20} height={14} rx={2} fill="#f4ecd6" />
  </g>
);
// escáner de mano legible (nunca espejado: va en el mundo, no en enManoD). x,y = centro; s = escala
export const EscanerW: React.FC<{ f: number; x: number; y: number; s?: number; rot?: number; freq?: number; voz?: number; on?: number; alerta?: number }> = ({ f, x, y, s = 1, rot = 0, freq = 162.4, voz = 0, on = 1, alerta = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={10} y={-84} width={10} height={44} rx={4} fill="#1c1a20" />
    <rect x={-26} y={-46} width={52} height={96} rx={10} fill="#2a2a30" stroke="#4a4a54" strokeWidth={2} />
    <rect x={-20} y={-38} width={40} height={26} rx={3} fill={on > 0.5 ? "#a8d890" : "#2c3a2a"} />
    {on > 0.5 && <text x={0} y={-19} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={11} fill="#16240f">{freq.toFixed(3)}</text>}
    {on > 0.5 && <path d={Array.from({ length: 14 }).map((_, i) => `${i ? "L" : "M"}${-17 + i * 2.6},${-14.5 + (voz > 0 ? Math.sin(i * 0.9 + f * 0.8) * 3 * voz : Math.sin(i * 7.1 + f * 3.3) * 1.2)}`).join(" ")} stroke="#16240f" strokeWidth={0.9} fill="none" />}
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-18 + (i % 3) * 13} y={-4 + Math.floor(i / 3) * 12} width={10} height={8} rx={2} fill="#4a4a54" />)}
    {[0, 1, 2].map((i) => <rect key={`r${i}`} x={-14} y={36 + i * 4} width={28} height={2} fill="#141218" />)}
    <circle cx={16} cy={-42} r={2.6} fill={voz > 0 ? "#5aff7a" : on > 0.5 ? (Math.floor(f / 12) % 2 ? "#ff5a3a" : "#5a2a22") : "#3a2a22"} />
    {alerta > 0 && <g opacity={alerta}><rect x={-20} y={-38} width={40} height={26} rx={3} fill="#e0a23a" /><text x={0} y={-21} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={10} fill="#1c1a20">WX ALERT</text></g>}
  </g>
);
// linterna chica en el mundo con haz (ang en grados, 0 = derecha)
export const LinternaW: React.FC<{ x: number; y: number; ang?: number; largo?: number; abre?: number; on?: number }> = ({ x, y, ang = 0, largo = 420, abre = 70, on = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang})`}>
    {on > 0 && <path d={`M10,-5 L${largo},${-abre} L${largo},${abre} L10,5 Z`} fill="#fff6c8" opacity={0.26 * on} />}
    {on > 0 && <path d={`M10,-3 L${largo * 0.7},${-abre * 0.45} L${largo * 0.7},${abre * 0.45} L10,3 Z`} fill="#fff6c8" opacity={0.2 * on} />}
    <rect x={-22} y={-7} width={34} height={14} rx={4} fill="#2a2a32" /><rect x={10} y={-9} width={8} height={18} rx={2} fill="#4a4a54" />
  </g>
);
// pinzas de extracción a escala de mano (x,y = mango)
export const PinzasW: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-3,0 Q-6,-20 -14,-40 L-9,-42 Q0,-22 3,0 Z" fill="#d6dae2" /><path d="M3,0 Q8,-20 18,-40 L13,-42 Q3,-22 -1,0 Z" fill="#b4b8c0" />
    <path d="M-4,0 Q-7,14 -5,26 L5,26 Q7,14 5,0 Z" fill="#c8ccd4" />
  </g>
);
// frasco de antibióticos chico (en la mano / en la mesa)
export const FrascoW: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-13} y={-40} width={26} height={8} rx={2} fill="#f2ece0" /><rect x={-15} y={-32} width={30} height={42} rx={5} fill="#e0882a" />
    <rect x={-12} y={-24} width={24} height={20} rx={2} fill="#f8f2e2" /><rect x={-9} y={-18} width={18} height={2.5} fill="#c0352c" /><rect x={-9} y={-12} width={14} height={2} fill="#9a948a" />
  </g>
);
// pila de libros de la biblioteca (lomos con etiqueta)
export const PilaLibros: React.FC<{ x: number; piso: number; n?: number }> = ({ x, piso, n = 5 }) => (
  <g>{Array.from({ length: n }).map((_, i) => { const w = 86 - (i % 3) * 8, c = ["#3a5a8a", "#8a3a2e", "#4a7a5a", "#c89a3a", "#5a4a7a"][i % 5]; return <g key={i} transform={`translate(${x + ((i * 7) % 11) - 5},${piso - 16 - i * 17})`}><rect x={-w / 2} y={-8} width={w} height={16} rx={2} fill={c} /><rect x={w / 2 - 22} y={-5} width={12} height={10} fill="#f2ece0" /></g>; })}</g>
);
// bolsa de farmacia
export const BolsaFarm: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-12,0 Q0,-18 12,0" stroke="#e8e2d6" strokeWidth={4} fill="none" />
    <path d="M-22,0 L22,0 L26,52 L-26,52 Z" fill="#f2ece0" /><path d="M-6,18 h12 v-6 h6 v12 h-6 v6 h-6 v-6 h-6 Z" transform="translate(0,6)" fill="#c0352c" />
  </g>
);
// mejilla hinchada (sobre la cabeza del palo): bulto + latido rojo
export const Hinchazon: React.FC<{ j: Junta; k: number; f: number; latido?: number }> = ({ j, k, f, latido = 0 }) => {
  if (k <= 0.01) return null;
  const bx = j.cabeza.x + j.dir * 24 * j.esc, by = j.cabeza.y + 22 * j.esc;
  const lat = latido > 0 ? (Math.sin(f / 3.2) > 0.4 ? 1 : 0.3) * latido : 0;
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={26 * k * j.esc} ry={22 * k * j.esc} fill="#17100d" />
      {lat > 0 && [0, 1].map((r) => { const q = ((f / 14 + r * 0.5) % 1); return <circle key={r} cx={bx + j.dir * 6} cy={by} r={(20 + q * 60) * j.esc} fill="none" stroke="#ff4a3a" strokeWidth={5 * j.esc} opacity={(1 - q) * 0.8 * latido} />; })}
      {lat > 0 && <circle cx={bx + j.dir * 8} cy={by + 2} r={10 * j.esc} fill="#ff4a3a" opacity={0.55 * lat} />}
    </g>
  );
};

// ======================================================================================================
// ORE: labrador negro de verdad (4 patas articuladas, pecho hondo, hocico, oreja caída, cola de nutria, collar rojo)
// x,y = patas en el piso; mira a +x con dir 1. s = 1 → ~100 px a la cruz (un labrador al lado de un adulto de 307 px)
// ======================================================================================================
export const OreLab: React.FC<{ x: number; y: number; dir?: 1 | -1; s?: number; f?: number; cola?: number; sentado?: boolean; cabeza?: number; jadea?: number; luz?: string; orejaArriba?: number }> = ({ x, y, dir = 1, s = 1, f = 0, cola = 0, sentado = false, cabeza = 0, jadea = 0, luz = "#ffcf6e", orejaArriba = 0 }) => {
  const c = "#1d1918", c2 = "#151110", men = Math.sin(f / 2.4) * 22 * cola;
  const resp = jadea > 0 ? Math.sin(f / 2) * 1.5 * jadea : 0;
  const Cabeza: React.FC<{ hx: number; hy: number }> = ({ hx, hy }) => (
    <g transform={`translate(${hx},${hy}) rotate(${cabeza})`}>
      <path d="M-16,-6 Q-18,-26 2,-28 Q18,-28 24,-18 L44,-14 Q52,-12 52,-4 Q52,6 42,8 L18,10 Q4,14 -8,8 Q-18,2 -16,-6 Z" fill={c} />
      <ellipse cx={50} cy={-8} rx={6} ry={5} fill="#3a2a2a" />
      {jadea > 0 && <path d={`M22,8 Q34,${12 + 6 * jadea} 44,8 Q38,${20 + 4 * jadea} 30,${22 + 4 * jadea} Q24,18 22,8 Z`} fill="#d86a7a" />}
      <path d="M22,8 Q32,12 42,8" stroke="#0c0a0a" strokeWidth={2} fill="none" />
      <circle cx={16} cy={-15} r={4} fill="#f6ecd2" /><circle cx={17.4} cy={-15} r={2.4} fill="#120d0c" /><circle cx={18} cy={-16} r={0.9} fill="#fff" />
      <path d="M8,-21 Q14,-24 20,-21" stroke="#0c0a0a" strokeWidth={1.6} fill="none" />
      <path d={`M-6,-24 Q-${16 + orejaArriba * 4},-${18 + orejaArriba * 10} -14,${6 - orejaArriba * 10} Q-4,${8 - orejaArriba * 8} 2,-18 Z`} fill={c2} />
      <path d="M-12,-24 Q8,-34 30,-20" stroke={luz} strokeWidth={2.4} fill="none" opacity={0.6} />
    </g>
  );
  const Pata: React.FC<{ pts: number[][]; w: number; atras?: boolean }> = ({ pts, w, atras }) => (
    <g><path d={`M${pts.map((p) => p.join(",")).join(" L")}`} stroke={atras ? c2 : c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={pts[pts.length - 1][0] + 5} cy={pts[pts.length - 1][1] - 3} rx={9} ry={5} fill={atras ? c2 : c} /></g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
      <ellipse cx={0} cy={2} rx={sentado ? 70 : 92} ry={8} fill="#000" opacity={0.25} />
      {!sentado ? (
        <>
          <path d={`M-66,-92 Q-92,${-96 + men * 0.4} -104,${-74 + men}`} stroke={c} strokeWidth={12} strokeLinecap="round" fill="none" />
          <Pata atras pts={[[-46, -84], [-38, -50], [-56, -28], [-50, -4]]} w={17} />
          <Pata atras pts={[[44, -70], [46, -34], [44, -4]]} w={13} />
          <path d={`M-70,-88 C-74,-106 -52,${-110 - resp} -30,${-108 - resp} L36,${-108 - resp} C60,-108 76,-94 72,-70 C68,-54 54,-50 40,-56 L-18,-62 C-46,-60 -70,-66 -70,-88 Z`} fill={c} />
          <Pata pts={[[-56, -86], [-46, -48], [-64, -28], [-58, -4]]} w={19} />
          <Pata pts={[[54, -70], [58, -34], [56, -4]]} w={14} />
          <path d="M40,-98 L56,-140 L80,-132 L70,-76 Z" fill={c} />
          <path d="M50,-118 L74,-110" stroke={ROJO_CENSO} strokeWidth={7} strokeLinecap="round" />
          <Cabeza hx={70} hy={-140} />
          <path d={`M-62,-104 Q-10,${-116 - resp} 40,-110`} stroke={luz} strokeWidth={3} fill="none" opacity={0.55} />
        </>
      ) : (
        <>
          <path d={`M-58,-14 Q-84,${-10 + men * 0.3} -96,${-2 + men * 0.4}`} stroke={c} strokeWidth={12} strokeLinecap="round" fill="none" />
          <Pata atras pts={[[34, -96], [38, -50], [36, -4]]} w={13} />
          <path d={`M-62,-20 C-70,-58 -40,-96 0,${-124 - resp} C22,-140 54,-136 60,-108 C66,-80 56,-60 46,-40 L40,0 L-40,0 C-60,-2 -64,-8 -62,-20 Z`} fill={c} />
          <ellipse cx={-26} cy={-30} rx={36} ry={30} fill={c} />
          <path d="M-26,-6 Q-4,0 14,-4" stroke={c} strokeWidth={14} strokeLinecap="round" fill="none" />
          <Pata pts={[[46, -92], [50, -46], [48, -4]]} w={15} />
          <path d="M30,-118 L44,-164 L70,-158 L62,-112 Z" fill={c} />
          <path d="M38,-142 L64,-136" stroke={ROJO_CENSO} strokeWidth={7} strokeLinecap="round" />
          <Cabeza hx={58} hy={-166} />
          <path d={`M-56,-40 Q-30,${-100 - resp} 20,-132`} stroke={luz} strokeWidth={3} fill="none" opacity={0.5} />
        </>
      )}
    </g>
  );
};

// ======================================================================================================
// pantalla: mano con lápiz que escribe (manga del color del personaje), reloj de pared, onda, garabato
// ======================================================================================================
// brazo que entra desde abajo a la derecha hasta la punta (tx,ty) del lápiz (coordenadas de pantalla o del svg)
export const ManoLapiz: React.FC<{ tx: number; ty: number; manga?: string; desdeX?: number; desdeY?: number; s?: number }> = ({ tx, ty, manga = "#2f7f86", desdeX = 1900, desdeY = 1200, s = 1 }) => {
  const hx = tx + 34 * s, hy = ty + 40 * s; // la mano un poco atrás de la punta
  const mx = (hx + desdeX) / 2 + 40, my = (hy + desdeY) / 2 + 60;
  return (
    <g>
      <path d={`M${desdeX},${desdeY} Q${mx},${my} ${hx + 30 * s},${hy + 34 * s}`} stroke={manga} strokeWidth={62 * s} strokeLinecap="round" fill="none" />
      <g transform={`translate(${tx},${ty}) rotate(-38)`}>
        <rect x={-6 * s} y={-4 * s} width={12 * s} height={92 * s} rx={3} fill="#e0a23a" /><path d={`M${-6 * s},${-4 * s} L0,${-22 * s} L${6 * s},${-4 * s} Z`} fill="#f2d6a8" /><path d={`M${-2 * s},${-15 * s} L0,${-22 * s} L${2 * s},${-15 * s} Z`} fill="#2a2228" />
      </g>
      <ellipse cx={hx + 6 * s} cy={hy + 10 * s} rx={30 * s} ry={24 * s} fill="#17100d" />
      <ellipse cx={hx - 12 * s} cy={hy - 4 * s} rx={12 * s} ry={9 * s} fill="#17100d" />
    </g>
  );
};
// reloj de pared con aguja de minutos que gira (min = minutos transcurridos)
export const RelojPared: React.FC<{ x: number; y: number; r?: number; min: number; hora?: number }> = ({ x, y, r = 44, min, hora = 9 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r + 6} fill="#3a2a22" /><circle r={r} fill="#f2ece0" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-1.5} y={-r + 4} width={3} height={i % 3 ? 6 : 11} fill="#2a2228" transform={`rotate(${i * 30})`} />)}
    <rect x={-2.5} y={-r * 0.5} width={5} height={r * 0.5} rx={2} fill="#2a2228" transform={`rotate(${hora * 30 + min * 0.5})`} />
    <rect x={-1.6} y={-r * 0.8} width={3.2} height={r * 0.8} rx={1.5} fill="#c0352c" transform={`rotate(${min * 6})`} />
    <circle r={4} fill="#2a2228" />
  </g>
);
// garabato de cabeza revuelta (sobre la cabeza): se dibuja con p 0..1
export const Garabato: React.FC<{ x: number; y: number; p: number; f: number; color?: string; s?: number }> = ({ x, y, p, f, color = "#cfc8e8", s = 1 }) => {
  if (p <= 0) return null;
  const pts = Array.from({ length: 60 }).map((_, i) => { const t = i / 59, a = t * 26 + f / 9; return [x + Math.cos(a) * (28 + 20 * Math.sin(t * 9)) * s, y + Math.sin(a * 1.3) * (14 + 8 * Math.cos(t * 7)) * s - t * 6 * s]; });
  const n = Math.max(2, Math.round(60 * p));
  return <path d={`M${pts.slice(0, n).map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}`} stroke={color} strokeWidth={4 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />;
};
// tira de onda de sonido que se aplana (amp 0..1) — pantalla, x,y = izquierda/centro
export const Onda: React.FC<{ x: number; y: number; w: number; amp: number; f: number; color?: string; rotulo?: string }> = ({ x, y, w, amp, f, color = "#f6ecd2", rotulo }) => (
  <g>
    <rect x={x - 24} y={y - 70} width={w + 48} height={140} rx={22} fill="#120f18" opacity={0.72} />
    <path d={Array.from({ length: 90 }).map((_, i) => `${i ? "L" : "M"}${x + (i * w) / 89},${y + amp * 46 * Math.sin(i * 0.9 + f * 0.7) * Math.abs(Math.sin(i * 0.23 + f * 0.11))}`).join(" ")} stroke={color} strokeWidth={4} fill="none" />
    {rotulo && <text x={x + w / 2} y={y - 40} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} letterSpacing={4} fill={color} opacity={0.85}>{rotulo}</text>}
  </g>
);
// número que rueda (texto SVG)
export const rueda = (f: number, a: number, b: number, v0: number, v1: number) => Math.round(interpolate(f, [a, b], [v0, v1], { ...cl, easing: Easing.out(Easing.cubic) }));
export const fmt = (n: number) => n.toLocaleString("en-US");

// ======================================================================================================
// sets chicos propios
// ======================================================================================================
// escenario oscuro con piso (para diagramas con personaje)
export const SetVacio: React.FC<{ capa: string; f: number; color?: string }> = ({ capa, color = "#2a2236" }) => {
  if (capa === "lejos") return <rect x={-3000} y={-2000} width={8000} height={5000} fill="#0d0b12" />;
  if (capa === "frente") return null;
  return (
    <g>
      <defs><radialGradient id="vacioG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={color} /><stop offset="100%" stopColor="#0d0b12" /></radialGradient></defs>
      <ellipse cx={960} cy={560} rx={1500} ry={900} fill="url(#vacioG)" />
      <ellipse cx={960} cy={905} rx={700} ry={40} fill="#000" opacity={0.3} />
    </g>
  );
};
// la Antártida como set (estación, antena, nieve, aurora): piso 900
const PARKA: Look = { estilo: "palo", camisa: "#d0452c", manga: "larga", pantalon: "#2a2a32", zapatos: "#1a1410", accesorios: [{ t: "capucha", color: "#b83a26" } as any] };
export const PARKA_A = PARKA;
export const PARKA_B: Look = { ...PARKA, camisa: "#e0a23a", accesorios: [{ t: "capucha", color: "#c8892a" } as any] };
export const PARKA_C: Look = { ...PARKA, camisa: "#3a6a9a", accesorios: [{ t: "capucha", color: "#2f5a84" } as any] };
export const SetAntartida: React.FC<{ capa: string; f: number }> = ({ capa, f }) => {
  if (capa === "lejos") {
    return (
      <g>
        <defs><linearGradient id="antC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#070c1c" /><stop offset="70%" stopColor="#14203a" /><stop offset="100%" stopColor="#25365a" /></linearGradient></defs>
        <rect x={-3000} y={-2000} width={8000} height={3200} fill="url(#antC)" />
        {Array.from({ length: 120 }).map((_, i) => <circle key={i} cx={-1200 + ((i * 337) % 4400)} cy={-600 + ((i * 191) % 1150)} r={i % 6 ? 1.8 : 3} fill="#fff" opacity={0.35 + 0.35 * Math.sin(f / 18 + i)} />)}
        {[0, 1].map((k) => <path key={k} d={`M-1200,${120 + k * 70} Q0,${-40 + 40 * Math.sin(f / 40 + k)} 960,${90 + k * 50} T3200,${40 + k * 60}`} stroke={k ? "#4affc0" : "#5affb0"} strokeWidth={k ? 50 : 90} fill="none" opacity={0.13} />)}
        <path d="M-2000,820 Q-600,700 400,770 T2400,740 T4400,760 V1500 H-2000 Z" fill="#b8c6dc" />
      </g>
    );
  }
  if (capa === "frente") return <NieveCae f={f} n={90} x0={-800} w={3600} y0={-200} h={1300} />;
  return (
    <g>
      <rect x={-2000} y={860} width={8000} height={900} fill="#dfe8f4" />
      <path d="M-2000,880 Q-400,850 600,872 T3000,866 V900 H-2000 Z" fill="#eef4fc" />
      {[[-260, 620, 420, 200, "#c0352c"], [300, 680, 300, 150, "#3a6a9a"], [2050, 660, 380, 170, "#c0352c"]].map(([x, y, w, h, c], i) => (
        <g key={i}>
          <rect x={x as number} y={(y as number) + 10} width={w as number} height={h as number} rx={12} fill={c as string} />
          <rect x={(x as number) - 6} y={y as number} width={(w as number) + 12} height={18} rx={8} fill="#eef4fc" />
          {[0, 1, 2].map((k) => <rect key={k} x={(x as number) + 26 + k * ((w as number) / 3)} y={(y as number) + 50} width={46} height={34} rx={4} fill={AMBAR} opacity={0.85} />)}
          {[0, 1, 2, 3].map((k) => <rect key={`p${k}`} x={(x as number) + 14 + k * ((w as number) / 3.3)} y={(y as number) + 10 + (h as number)} width={14} height={900 - (y as number) - 10 - (h as number)} fill="#2a2a32" />)}
        </g>
      ))}
      <rect x={1640} y={420} width={10} height={480} fill="#2a2a32" />
      <path d={`M1650,430 h86 v48 h-86 Z`} fill="#c0352c" transform={`skewY(${Math.sin(f / 7) * 4})`} />
      {[0, 1, 2].map((k) => <path key={k} d={`M1645,${520 + k * 120} L${1545 - k * 40},900 M1645,${520 + k * 120} L${1745 + k * 40},900`} stroke="#5a5a64" strokeWidth={2} />)}
    </g>
  );
};

// ======================================================================================================
// componentes de concepto (pantalla, 1920×1080)
// ======================================================================================================
// mapa de EE.UU. con la onda de Fort Collins a Duluth
const US: [number, number][] = [[-124.7, 48.4], [-124.1, 46.3], [-124.4, 42.8], [-123.8, 39.8], [-122.4, 37.2], [-120.6, 34.6], [-117.1, 32.6], [-114.7, 32.7], [-111.1, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.7], [-103.1, 29.0], [-101.4, 29.8], [-99.5, 27.6], [-97.2, 25.9], [-97.4, 27.9], [-95.0, 29.3], [-93.8, 29.7], [-90.1, 29.1], [-89.0, 30.3], [-86.4, 30.4], [-84.3, 29.9], [-82.8, 28.0], [-81.8, 26.1], [-80.4, 25.2], [-80.1, 26.8], [-81.3, 30.6], [-79.2, 33.2], [-75.6, 35.3], [-76.3, 37.0], [-74.1, 39.6], [-73.9, 40.6], [-70.0, 41.7], [-70.7, 43.0], [-67.0, 44.8], [-68.2, 47.3], [-69.3, 47.4], [-71.1, 45.3], [-74.9, 45.0], [-76.4, 44.1], [-79.1, 43.3], [-78.9, 42.9], [-82.6, 41.7], [-83.1, 42.1], [-82.4, 43.0], [-82.6, 45.3], [-84.6, 45.8], [-84.4, 46.5], [-88.3, 48.3], [-89.6, 48.0], [-92.0, 48.3], [-94.6, 48.7], [-95.2, 49.0], [-123.0, 49.0]];
const proy = (lon: number, lat: number) => ({ x: 420 + (lon + 125) * 23.5, y: 230 + (50 - lat) * 29 });
export const MapaUSA: React.FC<{ f: number; onda: number; respaldo: number; nadie: number }> = ({ f, onda, respaldo, nadie }) => {
  const fc = proy(-105.08, 40.59), du = proy(-92.1, 46.78);
  const d = Math.hypot(du.x - fc.x, du.y - fc.y);
  const sup = [[-92.1, 46.7], [-90.5, 46.6], [-87.5, 46.5], [-84.6, 46.5], [-84.8, 47.5], [-86.5, 48.7], [-88.7, 48.4], [-90.8, 47.6]].map(([a, b]) => proy(a, b));
  return (
    <g>
      <path d={`M${US.map(([a, b]) => { const p = proy(a, b); return `${p.x.toFixed(0)},${p.y.toFixed(0)}`; }).join(" L")} Z`} fill="#2e3550" stroke="#5a6488" strokeWidth={4} />
      <path d={`M${sup.map((p) => `${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(" L")} Z`} fill="#141a2e" stroke="#5a6488" strokeWidth={3} />
      {Array.from({ length: 30 }).map((_, i) => { const p = proy(-120 + ((i * 7.3) % 46), 31 + ((i * 3.7) % 17)); return <circle key={i} cx={p.x} cy={p.y} r={4} fill="#4a5276" opacity={0.6 * (1 - nadie)} />; })}
      {[0, 1, 2, 3, 4].map((k) => { const r = ((f * 4 + k * 70) % 340) * onda; return <circle key={k} cx={fc.x} cy={fc.y} r={r} fill="none" stroke={AMBAR} strokeWidth={5} opacity={onda * Math.max(0, 1 - r / 360) * 0.9} />; })}
      <path d={`M${fc.x},${fc.y} L${fc.x + (du.x - fc.x) * onda},${fc.y + (du.y - fc.y) * onda}`} stroke={AMBAR} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-f * 3} />
      <circle cx={fc.x} cy={fc.y} r={13} fill={AMBAR} />
      <text x={fc.x} y={fc.y + 50} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#f6ecd2">FORT COLLINS, CO</text>
      <g opacity={interpolate(onda, [0.85, 1], [0, 1], cl)}><circle cx={du.x} cy={du.y} r={12} fill="#f6ecd2" /><circle cx={du.x} cy={du.y} r={12 + 16 * Math.abs(Math.sin(f / 6))} fill="none" stroke="#f6ecd2" strokeWidth={3} />
        <text x={du.x + 6} y={du.y - 26} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#f6ecd2">DULUTH</text></g>
      <text x={d > 0 ? (fc.x + du.x) / 2 + 30 : 0} y={(fc.y + du.y) / 2 + 52} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={24} fill={AMBAR} opacity={interpolate(onda, [0.5, 0.8], [0, 1], cl)}>WWVB · 60 kHz</text>
      {/* generador de respaldo junto a la torre */}
      <g transform={`translate(${fc.x - 250},${fc.y - 200})`} opacity={respaldo}>
        <rect x={-70} y={-46} width={140} height={92} rx={12} fill="#1c1a24" stroke={AMBAR} strokeWidth={3} />
        <rect x={-52} y={-24} width={104} height={30} rx={5} fill="#2a2a36" /><rect x={-50} y={-22} width={100 * (0.6 + 0.4 * Math.abs(Math.sin(f / 9)))} height={26} rx={4} fill="#7ad08a" />
        <path d="M-6,14 L-16,34 L0,30 L-8,46 L14,24 L0,28 L8,14 Z" fill={AMBAR} />
        <text x={0} y={76} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#f6ecd2">BACKUP POWER</text>
      </g>
    </g>
  );
};

// corte del diente: encía, hueso, raíces, pulpa y el pus que crece en la punta de la raíz
export const AbscesoCorte: React.FC<{ f: number; inf: number; flechas: number }> = ({ f, inf, flechas }) => {
  const pul = 1 + 0.05 * Math.sin(f / 3) * inf;
  return (
    <g transform="translate(860,520)">
      <rect x={-760} y={40} width={1520} height={520} fill="#e8d6b0" />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={-720 + ((i * 97) % 1440)} cy={120 + ((i * 53) % 400)} r={6 + (i % 4) * 3} fill="#d4bf94" />)}
      <path d="M-760,40 Q-380,-10 0,20 Q380,-10 760,40 L760,110 Q380,70 0,96 Q-380,70 -760,110 Z" fill="#d87a88" />
      <path d="M-200,-300 Q-230,-120 -180,40 Q-170,240 -120,330 Q-86,356 -72,260 Q-50,120 0,100 Q50,120 72,260 Q86,356 120,330 Q170,240 180,40 Q230,-120 200,-300 Q0,-370 -200,-300 Z" fill="#f6f0e2" stroke="#cfc2a6" strokeWidth={8} />
      <path d="M-90,-150 Q0,-190 90,-150 Q80,-40 30,40 Q20,150 -10,240 L-20,236 Q-10,140 -30,40 Q-80,-40 -90,-150 Z" fill="#e89a9a" opacity={0.75} />
      <path d="M30,40 Q60,160 96,290" stroke="#e89a9a" strokeWidth={14} fill="none" opacity={0.75} />
      <g transform={`translate(104,330) scale(${pul})`}>
        <circle r={30 + 70 * inf} fill="#e2483a" opacity={0.3 * inf} />
        <circle r={22 + 48 * inf} fill="#e8b23a" opacity={inf} />
        {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={Math.cos(i * 2.4 + f / 20) * 30 * inf} cy={Math.sin(i * 1.7 + f / 24) * 24 * inf} r={4} fill="#a8742a" opacity={inf} />)}
      </g>
      <g opacity={flechas} fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f6ecd2">
        <path d="M460,-260 Q300,-260 220,-200" stroke="#f6ecd2" strokeWidth={5} fill="none" /><text x={480} y={-248}>TOOTH</text>
        <path d="M460,190 Q330,220 200,300" stroke="#e8b23a" strokeWidth={6} fill="none" /><path d="M200,300 l26,-6 -10,-20 Z" fill="#e8b23a" /><text x={480} y={170} fill="#e8b23a">INFECTION</text><text x={480} y={216} fontSize={30} fill="#f6ecd2" opacity={0.85}>AT THE ROOT</text>
        <path d="M-470,300 Q-380,330 -300,300" stroke="#cfc2a6" strokeWidth={5} fill="none" /><text x={-640} y={312} fontSize={34} fill="#5a4a3a">JAWBONE</text>
      </g>
    </g>
  );
};

// mapa de 3 cuadras: casa → farmacia, la línea punteada se dibuja con p
export const MapaCuadras: React.FC<{ x: number; y: number; p: number; f: number; o: number }> = ({ x, y, p, f, o }) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <rect x={-20} y={-20} width={560} height={300} rx={22} fill="#120f18" opacity={0.86} stroke={AMBAR} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 130} y={30} width={100} height={70} rx={6} fill="#2e2a3a" />)}
    {[0, 1, 2, 3].map((i) => <rect key={`b${i}`} x={20 + i * 130} y={150} width={100} height={90} rx={6} fill="#2e2a3a" />)}
    <path d="M60,125 H460" stroke="#4a4458" strokeWidth={30} />
    <path d={`M60,125 H${60 + 400 * p}`} stroke={AMBAR} strokeWidth={7} strokeDasharray="16 12" strokeDashoffset={-f * 2} />
    {[1, 2, 3].map((i) => <text key={i} x={60 + i * 133 - 66} y={135} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={30} fill={p * 3 >= i - 0.4 ? "#120f18" : "#6a6478"} style={{ paintOrder: "stroke" }} stroke={p * 3 >= i - 0.4 ? AMBAR : "none"} strokeWidth={10}>{i}</text>)}
    <g transform="translate(60,125)"><rect x={-26} y={-26} width={52} height={40} fill="#8a3a2e" /><path d="M-32,-26 L0,-52 L32,-26 Z" fill="#5a2a22" /></g>
    <g transform="translate(470,125)"><circle r={30} fill="#f6ecd2" /><path d="M-8,-20 h16 v12 h12 v16 h-12 v12 h-16 v-12 h-12 v-16 h12 Z" fill="#c0352c" /></g>
    <text x={260} y={22} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#f6ecd2" letterSpacing={3}>HOME → PHARMACY</text>
  </g>
);

// gráfico de potencia: baja LENTO (no de golpe). p = progreso del trazo; corte = la caída de golpe tachada
export const GraficoPotencia: React.FC<{ x: number; y: number; p: number; fecha: number; corte: number }> = ({ x, y, p, fecha, corte }) => {
  const W = 760, H = 380;
  const pts = Array.from({ length: 41 }).map((_, i) => { const t = i / 40; return [x + t * W, y + H - (H - 40) * (1 - 0.18 * t * t - 0.06 * t)]; });
  const n = Math.max(2, Math.round(41 * p));
  const xf = x + W * 0.42;
  return (
    <g>
      <rect x={x - 70} y={y - 70} width={W + 130} height={H + 150} rx={24} fill="#120f18" opacity={0.82} />
      <path d={`M${x},${y} V${y + H} H${x + W}`} stroke="#8a8498" strokeWidth={4} fill="none" />
      <text x={x - 20} y={y + 50} textAnchor="end" fontFamily={F_MONO} fontWeight={800} fontSize={24} fill="#8a8498">100%</text>
      <text x={x + W} y={y + H + 44} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#8a8498" letterSpacing={3}>YEARS →</text>
      <text x={x} y={y - 24} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#f6ecd2" letterSpacing={4}>STRENGTH</text>
      <g opacity={fecha}><path d={`M${xf},${y + 10} V${y + H}`} stroke={AMBAR} strokeWidth={4} strokeDasharray="10 8" /><text x={xf + 12} y={y + 36} fontFamily={F_MONO} fontWeight={800} fontSize={24} fill={AMBAR}>EXP. DATE</text></g>
      <path d={`M${pts.slice(0, n).map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}`} stroke="#7ad08a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <g opacity={corte}>
        <path d={`M${xf},${y + 50} V${y + H - 10}`} stroke="#e2483a" strokeWidth={6} strokeDasharray="12 10" />
        <path d={`M${xf - 40},${y + 150} l80,80 M${xf + 40},${y + 150} l-80,80`} stroke="#e2483a" strokeWidth={12} strokeLinecap="round" />
        <text x={xf + 60} y={y + 210} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#e2483a">NOT ALL AT ONCE</text>
      </g>
    </g>
  );
};

// mapa del puerto de Duluth: el puerto (detrás de Park Point) se congela; el lago abierto humea
export const MapaPuerto: React.FC<{ f: number; puerto: number; lago: number; zoom: number }> = ({ f, puerto, lago, zoom }) => (
  <g transform={`translate(960,540) scale(${zoom}) translate(-960,-540)`}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#26507a" />
    {Array.from({ length: 26 }).map((_, i) => { const xx = 700 + ((i * 263) % 1500), yy = 300 + ((i * 157) % 700), q = ((f / 40 + i * 0.37) % 1); return <ellipse key={i} cx={xx} cy={yy - q * 50} rx={40 + q * 30} ry={14 + q * 8} fill="#ffffff" opacity={0.25 * (1 - q) * lago} />; })}
    <path d="M-1400,-400 H700 Q560,0 520,240 Q470,420 380,560 Q250,760 -1400,900 Z" fill="#4a5a4a" />
    <path d="M-1400,-400 H700 Q560,0 520,240 Q470,420 380,560 Q250,760 -1400,900 Z" fill="#eef2fa" opacity={0.85} />
    <path d="M380,560 Q330,700 160,820 Q40,900 -1400,980 V1500 H-1400 Z" fill="#3a4a5a" />
    <path d="M-100,600 Q120,580 300,620 Q360,640 380,700 Q300,790 120,830 Q-60,860 -200,820 Z" fill="#26507a" />
    <path d="M-100,600 Q120,580 300,620 Q360,640 380,700 Q300,790 120,830 Q-60,860 -200,820 Z" fill="#eef2fa" opacity={puerto} />
    <path d="M300,610 Q450,560 560,470 L580,480 Q470,580 320,640 Z" fill="#d8c8a0" />
    <path d={`M520,240 Q470,420 380,560 L${400 + 60 * lago},${560} Q${500 + 50 * lago},420 ${560 + 50 * lago},240 Z`} fill="#eef2fa" opacity={0.9} />
    <g fontFamily={F_HUD} fontWeight={600} textAnchor="middle">
      <text x={90} y={716} fontSize={44} fill="#1d3a5a" opacity={puerto}>HARBOR</text>
      <text x={90} y={760} fontSize={30} fill="#1d3a5a" opacity={puerto}>FROZEN SOLID</text>
      <text x={900} y={560} fontSize={56} fill="#f6ecd2" opacity={lago}>LAKE SUPERIOR</text>
      <text x={900} y={614} fontSize={34} fill="#9fd3ff" opacity={lago}>OPEN WATER · STEAMING</text>
      <text x={150} y={300} fontSize={44} fill="#3a3442">DULUTH</text>
    </g>
  </g>
);

// arco del sol + barra de horas de luz
export const ArcoSol: React.FC<{ x: number; y: number; r: number; p: number; f: number }> = ({ x, y, r, p, f }) => {
  const a = Math.PI * (1 - p);
  const sx = x + Math.cos(a) * r, sy = y - Math.sin(a) * r * 0.7;
  return (
    <g>
      <path d={`M${x - r},${y} A${r},${r * 0.7} 0 0 1 ${x + r},${y}`} stroke="#ffe6a0" strokeWidth={4} strokeDasharray="10 12" fill="none" opacity={0.6} />
      <circle cx={sx} cy={sy} r={70} fill="#ffe6a0" opacity={0.25} /><circle cx={sx} cy={sy} r={44} fill="#ffd27a" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-3} y={-74} width={6} height={18} rx={3} fill="#ffd27a" transform={`translate(${sx},${sy}) rotate(${i * 36 + f})`} />)}
    </g>
  );
};
export const BarraLuz: React.FC<{ x: number; y: number; horas: number; o: number }> = ({ x, y, horas, o }) => (
  <g opacity={o} transform={`translate(${x},${y})`}>
    <rect x={-20} y={-58} width={620} height={128} rx={24} fill="#120f18" opacity={0.8} />
    <text x={0} y={-18} fontFamily={F_HUD} fontWeight={600} fontSize={28} fill="#f6ecd2" letterSpacing={4}>DAYLIGHT</text>
    <rect x={0} y={6} width={480} height={36} rx={18} fill="#2a2a36" />
    <rect x={0} y={6} width={480 * horas / 14} height={36} rx={18} fill={AMBAR} />
    {Array.from({ length: 15 }).map((_, i) => <rect key={i} x={i * (480 / 14) - 1} y={46} width={2} height={i % 2 ? 6 : 12} fill="#8a8498" />)}
    <text x={590} y={38} textAnchor="end" fontFamily={F_MONO} fontWeight={800} fontSize={40} fill={AMBAR}>{horas.toFixed(1)}h</text>
  </g>
);
// curva de frío del invierno con el punto «ya pasamos lo peor»
export const CurvaFrio: React.FC<{ x: number; y: number; p: number; marca: number }> = ({ x, y, p, marca }) => {
  const W = 620, H = 220;
  const temp = (t: number) => 18 - 46 * Math.exp(-Math.pow((t - 0.42) / 0.22, 2)); // °F
  const Y = (v: number) => y + H * (1 - (v + 32) / 54);
  const pts = Array.from({ length: 41 }).map((_, i) => { const t = i / 40; return [x + t * W, Y(temp(t))]; });
  const n = Math.max(2, Math.round(41 * p));
  const tm = 0.78, mx = x + tm * W, my = Y(temp(tm));
  return (
    <g>
      <rect x={x - 40} y={y - 70} width={W + 80} height={H + 120} rx={22} fill="#120f18" opacity={0.8} />
      <text x={x} y={y - 26} fontFamily={F_HUD} fontWeight={600} fontSize={28} fill="#f6ecd2" letterSpacing={4}>WINTER COLD</text>
      <path d={`M${x},${Y(0)} H${x + W}`} stroke="#5a5468" strokeWidth={2} strokeDasharray="8 8" />
      <path d={`M${pts.slice(0, n).map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}`} stroke="#8fd3ff" strokeWidth={7} fill="none" strokeLinecap="round" />
      <g opacity={marca}><circle cx={x + 0.42 * W} cy={Y(-28)} r={9} fill="#8fd3ff" /><text x={x + 0.42 * W} y={Y(-28) + 40} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={22} fill="#8fd3ff">WORST</text>
        <circle cx={mx} cy={my} r={14} fill={AMBAR} /><circle cx={mx} cy={my} r={24} fill="none" stroke={AMBAR} strokeWidth={3} /><text x={mx} y={my - 30} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={22} fill={AMBAR}>NOW</text></g>
    </g>
  );
};
// monitor de pulso: línea de ECG y BPM
export const Pulso: React.FC<{ x: number; y: number; f: number; o: number; bpm: number }> = ({ x, y, f, o, bpm }) => {
  const W = 420;
  const pts = Array.from({ length: 120 }).map((_, i) => { const t = ((i + f * 2) % 40) / 40; const v = t > 0.45 && t < 0.5 ? -60 : t >= 0.5 && t < 0.55 ? 40 : t >= 0.55 && t < 0.6 ? -12 : 0; return [x + (i * W) / 119, y + v]; });
  return (
    <g opacity={o}>
      <rect x={x - 30} y={y - 110} width={W + 220} height={190} rx={24} fill="#120f18" opacity={0.82} />
      <path d={`M${pts.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}`} stroke="#7ad08a" strokeWidth={4} fill="none" />
      <text x={x + W + 30} y={y + 8} fontFamily={F_MONO} fontWeight={800} fontSize={60} fill="#7ad08a">{bpm}</text>
      <text x={x + W + 34} y={y + 48} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#f6ecd2" letterSpacing={3}>BPM</text>
      <path d={`M${x + W + 90},${y - 70} c-10,-14 -30,-8 -30,6 c0,14 30,30 30,30 c0,0 30,-16 30,-30 c0,-14 -20,-20 -30,-6 Z`} fill="#e2483a" transform={`translate(${x + W + 90},${y - 60}) scale(${1 + 0.15 * Math.max(0, Math.sin(f / 4))}) translate(${-(x + W + 90)},${-(y - 60)})`} />
    </g>
  );
};
// palitos de conteo: 130 noches (5 por grupo), los n primeros dibujados
export const Palitos: React.FC<{ x: number; y: number; n: number; o: number }> = ({ x, y, n, o }) => (
  <g opacity={o}>
    <rect x={x - 26} y={y - 64} width={26 * 14 + 40} height={250} rx={20} fill="#120f18" opacity={0.8} />
    {Array.from({ length: Math.min(130, Math.round(n)) }).map((_, i) => { const g = Math.floor(i / 5), k = i % 5, gx = x + (g % 13) * 28, gy = y + Math.floor(g / 13) * 82; return k < 4 ? <rect key={i} x={gx + k * 5} y={gy} width={2.6} height={44} fill="#cfc8b6" /> : <line key={i} x1={gx - 3} y1={gy + 34} x2={gx + 22} y2={gy + 8} stroke="#e2483a" strokeWidth={3} />; })}
  </g>
);
// avión que entra y queda tachado
export const AvionTachado: React.FC<{ x: number; y: number; p: number; tacha: number }> = ({ x, y, p, tacha }) => (
  <g>
    <g transform={`translate(${x - 300 + 300 * p},${y + 30 - 30 * p})`} opacity={Math.min(1, p * 3)}>
      <path d="M-70,0 L60,-6 Q80,-4 82,4 Q80,10 60,10 L-70,6 Z" fill="#e8e4dc" /><path d="M-10,0 L-40,-46 L-22,-46 L22,0 Z" fill="#c8c4bc" /><path d="M-10,6 L-36,46 L-20,46 L22,6 Z" fill="#c8c4bc" /><path d="M-66,0 L-80,-26 L-70,-26 L-52,0 Z" fill="#c8c4bc" />
    </g>
    {tacha > 0 && <path d={`M${x - 70},${y - 50} L${x - 70 + 140 * Math.min(1, tacha * 2)},${y - 50 + 100 * Math.min(1, tacha * 2)} ${tacha > 0.5 ? `M${x + 70},${y - 50} L${x + 70 - 140 * (tacha - 0.5) * 2},${y - 50 + 100 * (tacha - 0.5) * 2}` : ""}`} stroke="#e2483a" strokeWidth={14} strokeLinecap="round" fill="none" />}
  </g>
);

// texto en el mundo/pantalla con caja oscura (para rótulos dentro de SVG)
export const Rot: React.FC<{ x: number; y: number; t: string; o?: number; tam?: number; color?: string; borde?: string; anchor?: "middle" | "start" | "end" }> = ({ x, y, t, o = 1, tam = 40, color = "#f6ecd2", borde = AMBAR, anchor = "middle" }) => {
  if (o <= 0.01) return null;
  const w = t.length * tam * 0.56 + 44;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "start" ? x : x - w;
  return (
    <g opacity={o}>
      <rect x={x0} y={y - tam * 0.95} width={w} height={tam * 1.45} rx={tam * 0.72} fill="rgba(10,14,30,0.6)" stroke={borde} strokeWidth={3} />
      <text x={x0 + w / 2} y={y + tam * 0.1} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={tam} fill={color}>{t}</text>
    </g>
  );
};
export const aparece = (f: number, d: number, h = 1e9) => interpolate(f, [d, d + 8, h, h + 8], [0, 1, 1, 0], cl);

// pared de ladrillo con la ventana de Gus (P76): se dibuja ENCIMA de Gus y Ore (son vistos por la ventana)
export const VENT_G = { x: 560, y: 170, w: 800, h: 690 };
export const InteriorGus: React.FC<{ f: number; lampara: number }> = ({ f, lampara }) => {
  const V = VENT_G;
  return (
    <g>
      <rect x={V.x - 40} y={V.y - 40} width={V.w + 80} height={V.h + 300} fill={lampara > 0.5 ? "#a0703e" : "#5a4030"} />
      <rect x={V.x - 40} y={V.y + V.h - 10} width={V.w + 80} height={300} fill="#4a3424" />
      <g transform={`translate(${V.x + 120},${V.y + 120})`}><rect x={-60} y={-46} width={120} height={92} fill="#5a3a24" /><rect x={-50} y={-36} width={100} height={72} fill="#3a6a8a" /><path d="M-50,30 L-14,-6 L10,16 L30,0 L50,30 Z" fill="#2a4a3a" /></g>
      <g transform={`translate(${V.x + V.w - 150},${V.y + V.h - 20})`}>
        <rect x={-100} y={-120} width={200} height={14} fill="#5a3a24" /><rect x={-90} y={-106} width={12} height={130} fill="#4a2e1c" /><rect x={78} y={-106} width={12} height={130} fill="#4a2e1c" />
        <rect x={-80} y={-200} width={160} height={80} rx={6} fill="#2a2a30" /><circle cx={-40} cy={-160} r={20} fill="#4a4a54" /><rect x={-6} y={-184} width={70} height={26} rx={3} fill={lampara > 0.5 ? "#9fe0a0" : "#4a6a4a"} />
        {[0, 1, 2].map((k) => <circle key={k} cx={4 + k * 22} cy={-140} r={6} fill="#6a6a74" />)}
        <rect x={56} y={-320} width={6} height={120} fill="#1c1a20" />
      </g>
      {/* lámpara de pie */}
      <g transform={`translate(${V.x + 110},${V.y + V.h + 120})`}>
        <rect x={-6} y={-470} width={12} height={470} fill="#2a2228" />
        <path d="M-70,-470 L70,-470 L46,-560 L-46,-560 Z" fill={lampara > 0.5 ? "#ffe2a0" : "#8a7a5a"} />
        <line x1={30} y1={-470} x2={30} y2={-420 + (lampara > 0.4 && lampara < 0.6 ? 14 : 0)} stroke="#c8b48a" strokeWidth={2} /><circle cx={30} cy={-418} r={4} fill="#c8b48a" />
      </g>
      {lampara > 0.05 && <Halo x={V.x + 110} y={V.y + V.h - 360} r={760} color="#ffcf6e" fuerza={0.55 * lampara * (0.95 + 0.05 * Math.sin(f / 5))} />}
    </g>
  );
};
export const ParedGus: React.FC<{ f: number; lampara: number; nieve?: number }> = ({ f, lampara, nieve = 1 }) => {
  const V = VENT_G;
  return (
    <g>
      <path d={`M-900,-900 H2900 V1800 H-900 Z M${V.x},${V.y} V${V.y + V.h} H${V.x + V.w} V${V.y} Z`} fill="#5a2e2a" fillRule="evenodd" />
      {Array.from({ length: 50 }).map((_, r) => <g key={r}>{Array.from({ length: 34 }).map((__, c) => { const bx = -900 + c * 116 + (r % 2) * 58, by = -900 + r * 54; const dentro = bx + 110 > V.x && bx < V.x + V.w && by + 50 > V.y && by < V.y + V.h; return dentro ? null : <rect key={c} x={bx} y={by} width={108} height={46} rx={3} fill={(r * 7 + c * 3) % 5 ? "#6a3430" : "#5e2c28"} />; })}</g>)}
      <rect x={V.x - 24} y={V.y - 24} width={V.w + 48} height={24} fill="#3e1e1c" />
      <rect x={V.x - 24} y={V.y} width={24} height={V.h} fill="#3e1e1c" /><rect x={V.x + V.w} y={V.y} width={24} height={V.h} fill="#3e1e1c" />
      <rect x={V.x + V.w / 2 - 8} y={V.y} width={16} height={V.h * 0.42} fill="#3e1e1c" />
      <rect x={V.x} y={V.y + V.h * 0.42 - 8} width={V.w} height={16} fill="#3e1e1c" />
      <rect x={V.x - 50} y={V.y + V.h} width={V.w + 100} height={34} rx={4} fill="#4a2a26" />
      {nieve > 0 && <path d={`M${V.x - 50},${V.y + V.h + 2} Q${V.x + V.w / 2},${V.y + V.h - 22} ${V.x + V.w + 50},${V.y + V.h + 2} Z`} fill="#eef2fa" />}
      {lampara > 0.05 && <rect x={V.x} y={V.y} width={V.w} height={V.h} fill="#ffe6b0" opacity={0.06 * lampara} />}
      {lampara > 0.05 && <path d={`M${V.x},${V.y + V.h + 34} L${V.x - 260},${V.y + V.h + 420} L${V.x + V.w + 260},${V.y + V.h + 420} L${V.x + V.w},${V.y + V.h + 34} Z`} fill="#ffcf6e" opacity={0.12 * lampara} />}
    </g>
  );
};
export const CieloGus: React.FC<{ capa: string; f: number }> = ({ capa, f }) => {
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={8000} height={5000} fill="#141226" />{Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={-800 + ((i * 337) % 3600)} cy={-300 + ((i * 191) % 900)} r={i % 5 ? 1.6 : 2.6} fill="#fff" opacity={0.3 + 0.3 * Math.sin(f / 20 + i)} />)}</g>;
  if (capa === "frente") return <NieveCae f={f} n={110} x0={-900} w={3800} y0={-300} h={1600} />;
  return null;
};
export { F_MANO };
