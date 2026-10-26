// lc01 · componentes de los planos 30-57 (lc-a, vuelta 2 del ojo del director).
// · PjX: actor con IK a un punto del MUNDO (ikD / ikI), brazos por claves (brz) y objetos en la mano que quedan
//   derechos en el mundo (objD / objI con `rot`), en vez de girar con el antebrazo.
// · Escritura: renglones que se escriben con la punta exacta (textLength fijo → la punta sabe dónde está), para que la
//   mano del personaje (IK) o la mano grande del inserto (ManoLapiz) sigan a la letra.
// · HeladeraJune: heladera a escala del personaje con la nota de las reglas y la lista (tapa la heladera gigante del set).
// · Vineta (tarjeta con ícono que entra con resorte, se tacha o se apaga), Barras, MapaLago, Ecuacion, Pin, Grifo,
//   DisplaySurtidor, Humo visible, Escarcha, diagramas (red eléctrica, nafta que se pone vieja, frío de enero).
import React, { useId } from "react";
import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { ActorProps, Paso, estadoActor } from "../../anikit/actor";
import { Pose, alcanzar, huesosDe, parpadear, Personaje } from "../../anikit/personaje";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { osc } from "../../anikit/sets/comun";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { F_MONO } from "../hud";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const io = Easing.inOut(Easing.cubic);
export const tw = (f: number, a: number, b: number, v0: number, v1: number, e: (t: number) => number = io) => interpolate(f, [a, b], [v0, v1], { ...CL, easing: e });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const TINTA = "#1d3a8a";
export const ROJO = "#e2483a";

// ---------------------------------------------------------------- actor con IK al mundo
const llenarY = (r: Paso[]) => { let y = r[0].y ?? 0; return r.map((q) => (q.y === undefined ? { ...q, y } : ((y = q.y), q))); };
export type KB = { f: number; v: Partial<Pose> | null; d?: number };
// brazos/tronco por claves: desde k.f va hacia k.v en d cuadros (io). v = null → suelta (vuelve a la pose del actor)
export const brazos = (kf: KB[]) => (p: Pose, f: number): Pose => {
  let o: Partial<Pose> = {};
  for (const k of kf) {
    if (f < k.f) break;
    const t = io(Math.min(1, (f - k.f) / (k.d ?? 10)));
    if (k.v === null) {
      const n: Partial<Pose> = {};
      (Object.keys(o) as (keyof Pose)[]).forEach((c) => { n[c] = (o[c] as number) + (p[c] - (o[c] as number)) * t; });
      o = t >= 1 ? {} : n;
    } else (Object.keys(k.v) as (keyof Pose)[]).forEach((c) => { const a0 = (o[c] ?? p[c]) as number; o[c] = a0 + ((k.v as Pose)[c] - a0) * t; });
  }
  return { ...p, ...o };
};
export type IK = (f: number) => { x: number; y: number; w?: number } | null;
export type Obj = { el: React.ReactNode; rot?: number };
export type PjXProps = Omit<ActorProps, "ruta" | "enManoD" | "enManoI"> & { ruta: Paso[]; objD?: Obj | ((f: number) => Obj | undefined); objI?: Obj | ((f: number) => Obj | undefined); ikD?: IK; ikI?: IK; brz?: KB[] };
export const PjX: React.FC<PjXProps> = (a) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const ruta = llenarY(a.ruta);
  const s = estadoActor({ ...a, ruta, poses: a.poses ?? [{ f: 0, v: "parado" }], caras: a.caras ?? [{ f: 0, v: "neutral" }], seed: a.seed ?? 1, escala: a.escala ?? 1, ajuste: undefined } as ActorProps, f, fps);
  let p = s.p;
  if (a.brz) p = brazos(a.brz)(p, f);
  if (a.ajuste) p = a.ajuste(p, f);
  const H = huesosDe(a.look.estilo, a.look.alto);
  const ik = (lado: "D" | "I", fn?: IK) => {
    const r = fn?.(f);
    if (!r) return;
    const w = Math.max(0, Math.min(1, r.w ?? 1));
    if (w <= 0) return;
    const q = alcanzar(p, lado, { x: ((r.x - s.x) * s.dir) / s.esc, y: (r.y - s.y) / s.esc }, s.asiento, H) as Pose;
    p = lado === "D" ? { ...p, hD: lerp(p.hD, q.hD, w), cD: lerp(p.cD, q.cD, w) } : { ...p, hI: lerp(p.hI, q.hI, w), cI: lerp(p.cI, q.cI, w) };
  };
  ik("D", a.ikD);
  ik("I", a.ikI);
  const obj = (o: PjXProps["objD"], lado: "D" | "I") => {
    const r = typeof o === "function" ? o(f) : o;
    if (!r) return undefined;
    if (r.rot === undefined) return r.el;
    const ang = (lado === "D" ? p.hD + p.cD : p.hI + p.cI) + p.tronco;
    return <g transform={`rotate(${ang + r.rot})`}>{r.el}</g>;
  };
  return (
    <Personaje x={s.x} y={s.y} escala={s.esc} dir={s.dir} p={p} e={s.e} look={a.look} mirar={s.mirar} cara={s.cara} luz={a.luz} sombra={a.sombra}
      asiento={s.asiento} parpadeo={parpadear(f, a.seed ?? 1)} habla={s.habla} enManoD={obj(a.objD, "D")} enManoI={obj(a.objI, "I")} opacidad={a.opacidad ? a.opacidad(f) : 1} />
  );
};
// IK que va de un punto a otro por claves {f, x, y, w} (interpolado con io); fuera de rango = null
export const ikClaves = (cl: { f: number; x: number; y: number; w?: number }[]): IK => (f) => {
  if (f < cl[0].f - 8) return null;
  if (f < cl[0].f) return { x: cl[0].x, y: cl[0].y, w: (f - cl[0].f + 8) / 8 * (cl[0].w ?? 1) };
  for (let i = 1; i < cl.length; i++) {
    const a = cl[i - 1], b = cl[i];
    if (f < b.f) { const t = io((f - a.f) / (b.f - a.f)); return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w ?? 1, b.w ?? 1, t) }; }
  }
  const z = cl[cl.length - 1];
  return { x: z.x, y: z.y, w: z.w ?? 1 };
};

// ---------------------------------------------------------------- escritura con punta
export type Lin = { t: string; x: number; y: number; tam: number; desde: number; hasta: number; color?: string; tachado?: number; ancho?: number; peso?: number };
export const anchoLin = (l: Lin) => l.ancho ?? l.t.length * l.tam * 0.46;
const progLin = (l: Lin, f: number) => Math.max(0, Math.min(1, (f - l.desde) / Math.max(1, l.hasta - l.desde)));
const puntaCruda = (ls: Lin[], f: number) => {
  // el renglón activo (o el más cercano en el tiempo) y la punta sobre él
  let best: Lin | null = null, dist = 1e9;
  for (const l of ls) {
    const d = f < l.desde ? l.desde - f : f > l.hasta ? f - l.hasta : 0;
    if (d < dist) { dist = d; best = l; }
  }
  if (!best) return null;
  const u = progLin(best, f);
  const escribiendo = f >= best.desde && f <= best.hasta;
  return { x: best.x + anchoLin(best) * u, y: best.y - best.tam * 0.3 + (escribiendo ? Math.sin(f * 2.3) * best.tam * 0.14 : -best.tam * 0.4), dist };
};
// punta suavizada (promedio de 5 cuadros) con peso: 1 mientras escribe ±margen, rampa a 0 afuera
export const puntaDe = (ls: Lin[], f: number, margen = 12) => {
  const ps = [-4, -3, -2, -1, 0].map((d) => puntaCruda(ls, f + d)).filter(Boolean) as { x: number; y: number; dist: number }[];
  if (!ps.length) return null;
  const x = ps.reduce((a, p) => a + p.x, 0) / ps.length, y = ps.reduce((a, p) => a + p.y, 0) / ps.length;
  const d = ps[ps.length - 1].dist;
  return { x, y, w: Math.max(0, Math.min(1, 1 - (d - margen) / 10)) };
};
export const ikEscribir = (ls: Lin[], margen = 12): IK => (f) => puntaDe(ls, f, margen);
export const Lineas: React.FC<{ ls: Lin[]; fuente?: string }> = ({ ls, fuente = F_MANO }) => {
  const f = useF();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g>
      {ls.map((l, i) => {
        const u = progLin(l, f);
        if (u <= 0) return null;
        const W = anchoLin(l);
        const raya = l.tachado !== undefined ? tw(f, l.tachado, l.tachado + 9, 0, 1) : 0;
        return (
          <g key={i}>
            <clipPath id={`${id}c${i}`}><rect x={l.x - 4} y={l.y - l.tam * 1.2} width={W * u + 6} height={l.tam * 1.7} /></clipPath>
            <text x={l.x} y={l.y} fontFamily={fuente} fontWeight={l.peso ?? 700} fontSize={l.tam} fill={l.color ?? TINTA} textLength={W} lengthAdjust="spacingAndGlyphs" clipPath={`url(#${id}c${i})`}>{l.t}</text>
            {raya > 0 && <path d={`M${l.x - 4},${l.y - l.tam * 0.32} L${l.x - 4 + (W + 8) * raya},${l.y - l.tam * 0.36}`} stroke="#d8382c" strokeWidth={l.tam * 0.14} strokeLinecap="round" />}
          </g>
        );
      })}
    </g>
  );
};

// lápiz (punta en 0,0; sube hacia arriba-derecha) y marcador
export const LapizP: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#e0a23a" }) => (
  <g transform={`scale(${s}) rotate(28)`}>
    <path d="M0,0 L-6,-18 L6,-18 Z" fill="#e8c89a" /><path d="M0,0 L-2.4,-7 L2.4,-7 Z" fill="#2a2228" />
    <rect x={-6} y={-92} width={12} height={74} fill={color} /><rect x={-6} y={-100} width={12} height={9} fill="#c8c8cc" /><rect x={-6} y={-110} width={12} height={10} rx={3} fill="#e88a9a" />
  </g>
);
export const Marcador: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#1d3a8a" }) => (
  <g transform={`scale(${s}) rotate(24)`}>
    <path d="M0,0 L-5,-12 L5,-12 Z" fill={color} /><rect x={-7} y={-62} width={14} height={50} rx={4} fill="#f2ece0" /><rect x={-7} y={-30} width={14} height={10} fill={color} /><rect x={-8} y={-70} width={16} height={12} rx={4} fill={color} />
  </g>
);

// mano grande de inserto (pantalla): la punta del lápiz en (x, y); manga del color del personaje
export const ManoLapiz: React.FC<{ x: number; y: number; manga?: string; puno?: string; tiembla?: number; lapiz?: boolean; s?: number }> = ({ x, y, manga = "#c8582b", puno = "#efe3c8", tiembla = 0, lapiz = true, s = 1 }) => {
  const f = useF();
  const jx = tiembla * Math.sin(f * 1.7) * 2, jy = tiembla * Math.cos(f * 2.3) * 2;
  return (
    <g transform={`translate(${x + jx},${y + jy}) scale(${s})`}>
      <path d="M150,-60 L1400,1400" stroke={manga} strokeWidth={150} strokeLinecap="round" />
      <path d="M128,-80 L178,-28" stroke={puno} strokeWidth={150} strokeLinecap="butt" opacity={0.95} />
      {lapiz && <LapizP s={2.6} />}
      <ellipse cx={74} cy={-74} rx={70} ry={58} fill="#17100d" transform="rotate(-38 74 -74)" />
      <ellipse cx={30} cy={-40} rx={26} ry={18} fill="#17100d" transform="rotate(-50 30 -40)" />
    </g>
  );
};

// ---------------------------------------------------------------- heladera de June (mundo, living)
// heladera a escala del personaje (380 de alto contra 307 del personaje); dos notas en la puerta del freezer:
// NOTA1 = las reglas (izquierda, June escribe parada a la izquierda), NOTA2 = la lista (derecha)
export const HEL = { x: 3140, w: 300, top: 520, P: 900 };
export const NOTA1 = { x: 3160, y: 548, w: 136, h: 198 };
export const NOTA2 = { x: 3304, y: 548, w: 124, h: 198 };
export const reglaY = (i: number) => NOTA1.y + 50 + i * 23;
export const RX = NOTA1.x + 8;
export const listaY = (i: number) => NOTA2.y + 28 + i * 26;
export const LX = NOTA2.x + 8;
const Nota: React.FC<{ n: { x: number; y: number; w: number; h: number }; rot: number; papel: string; iman: string; renglones?: boolean; children?: React.ReactNode }> = ({ n, rot, papel, iman, renglones, children }) => (
  <g transform={`rotate(${rot} ${n.x + n.w / 2} ${n.y + n.h / 2})`}>
    <rect x={n.x + 3} y={n.y + 4} width={n.w} height={n.h} fill="#000" opacity={0.18} />
    <rect x={n.x} y={n.y} width={n.w} height={n.h} fill={papel} />
    {renglones && Array.from({ length: 7 }).map((_, i) => <rect key={i} x={n.x + 6} y={n.y + 34 + i * 26} width={n.w - 12} height={1.2} fill="#9fb4d4" opacity={0.7} />)}
    <circle cx={n.x + n.w / 2} cy={n.y + 5} r={8} fill={iman} />
    {children}
  </g>
);
export const HeladeraJune: React.FC<{ titulo?: boolean; ls?: Lin[]; lista?: boolean; ls2?: Lin[]; pared?: string }> = ({ titulo = true, ls = [], lista = false, ls2 = [], pared = "#5a4a5e" }) => {
  const { x, w, top, P } = HEL;
  const div = top + 262;
  return (
    <g>
      {/* tapa la heladera gigante del set */}
      <rect x={x - 22} y={300} width={w + 44} height={P - 140 - 300} fill={pared} />
      <rect x={x - 22} y={P - 140} width={w + 44} height={140} fill={osc(pared, 0.8)} />
      {/* heladera a escala del personaje */}
      <ellipse cx={x + w / 2} cy={P + 2} rx={w * 0.55} ry={10} fill="#000" opacity={0.3} />
      <rect x={x} y={top} width={w} height={P - top - 6} rx={18} fill="#e8e4dc" />
      <rect x={x + w - 22} y={top} width={22} height={P - top - 6} rx={11} fill="#d2cec4" />
      <rect x={x} y={div} width={w} height={6} fill="#bdb8ae" />
      <rect x={x + 26} y={div - 20} width={w - 70} height={9} rx={4.5} fill="#a8a49c" />
      <rect x={x + 26} y={div + 18} width={w - 70} height={9} rx={4.5} fill="#a8a49c" />
      <rect x={x + 6} y={P - 22} width={w - 12} height={14} rx={4} fill="#5a5660" />
      <Nota n={NOTA1} rot={-1.2} papel="#fdf6d8" iman={ROJO_CENSO}>
        {titulo && <text x={NOTA1.x + NOTA1.w / 2} y={NOTA1.y + 30} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={19} fill={ROJO_CENSO}>JUNE'S RULES</text>}
        <Lineas ls={ls} />
      </Nota>
      {lista && <Nota n={NOTA2} rot={1.3} papel="#f4f0e6" iman="#2f7f86" renglones><Lineas ls={ls2} /></Nota>}
    </g>
  );
};
// renglones de las reglas (ya escritos o con sus tiempos)
export const REGLAS_T = ["1. FRESH FOOD FIRST", "- save the cans", "2. NOTHING RISKY ALONE", "- no ladders", "- no chainsaws", "- no going on the ice"];
export const regla = (i: number, desde = -999, hasta = -998): Lin => {
  const sub = REGLAS_T[i].startsWith("-");
  const tam = sub ? 14 : 15.5;
  return { t: REGLAS_T[i], x: RX + (sub ? 8 : 0), y: reglaY(i), tam, desde, hasta, color: sub ? "#2f4f8f" : TINTA, ancho: Math.min(sub ? 110 : 120, REGLAS_T[i].length * tam * 0.46) };
};
export const REGLAS_HECHAS = (n: number): Lin[] => Array.from({ length: n }).map((_, i) => regla(i));

// ---------------------------------------------------------------- íconos y viñetas
export const Icono: React.FC<{ n: string; f?: number; apagado?: number }> = ({ n, f = 0, apagado = 0 }) => {
  const g = (c: string) => (apagado > 0 ? osc(c, 1 - 0.55 * apagado) : c);
  switch (n) {
    case "escalera": return <g transform="rotate(12)">{[-24, 24].map((x) => <rect key={x} x={x - 5} y={-50} width={10} height={100} rx={3} fill={g("#c89a5a")} />)}{[-34, -12, 10, 32].map((y) => <rect key={y} x={-24} y={y} width={48} height={8} fill={g("#a87a3a")} />)}</g>;
    case "motosierra": return <g><rect x={-46} y={-20} width={46} height={40} rx={10} fill={g("#e0682a")} /><path d="M-40,-20 q10,-22 34,-10" stroke={g("#2a2228")} strokeWidth={7} fill="none" /><rect x={0} y={-9} width={52} height={18} rx={9} fill={g("#9aa4ac")} />{Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${4 + i * 7},-9 l3,-6 l3,6`} fill={g("#5a646c")} />)}</g>;
    case "hielo": return <g><path d="M-50,10 L-30,-14 L44,-14 L50,10 Z" fill={g("#bfe4f4")} /><path d="M-6,-14 L2,-2 L-8,4 L4,10 M20,-14 L14,-4 L26,2" stroke={g("#4a8ab0")} strokeWidth={3} fill="none" /><ellipse cx={-14} cy={22} rx={22} ry={9} fill={g("#1d3a5a")} /><circle cx={-14} cy={6} r={9} fill={g("#17100d")} /><path d="M-24,22 l-10,-14 M-4,22 l10,-16" stroke={g("#17100d")} strokeWidth={5} /></g>;
    case "bomba": return <g><rect x={-38} y={-10} width={50} height={46} rx={8} fill={g("#5a7a9a")} /><circle cx={-13} cy={13} r={13} fill={g("#2a3a4a")} /><path d={`M-13,13 l${10 * Math.cos(f / 4)},${10 * Math.sin(f / 4)}`} stroke={g("#9fd8ff")} strokeWidth={4} /><rect x={12} y={0} width={36} height={12} fill={g("#8a949a")} /><path d="M40,12 q4,16 0,26 q-6,-8 0,-26 Z" fill={g("#5ab0ff")} /><rect x={-50} y={-30} width={22} height={22} rx={3} fill={g("#ffcf3a")} /><path d="M-41,-28 l-4,9 h6 l-4,9" stroke={g("#3a2a10")} strokeWidth={2.4} fill="none" /></g>;
    case "quitanieve": return <g><rect x={-30} y={-26} width={48} height={34} rx={5} fill={g("#e0a23a")} /><rect x={-24} y={-20} width={18} height={14} fill={g("#bfe4f4")} /><rect x={18} y={-6} width={22} height={14} fill={g("#e0a23a")} /><path d="M-44,-14 L-34,-14 L-34,16 L-50,16 Z" fill={g("#8a949a")} /><circle cx={-12} cy={14} r={9} fill={g("#26262a")} /><circle cx={22} cy={14} r={9} fill={g("#26262a")} /><path d="M-60,18 q8,-22 18,-4 Z" fill={g("#f2f6fa")} /><rect x={-10} y={-36} width={8} height={10} fill={g("#ff8a3a")} /></g>;
    case "agua": return <g><path d="M-40,-24 h40 q14,0 14,14 v8 h-12 v-6 h-42 Z" fill={g("#9aa4ac")} /><rect x={-26} y={-36} width={12} height={14} fill={g("#8a949a")} /><path d="M8,6 q-12,18 0,26 q12,-8 0,-26 Z" fill={g("#5ab0ff")} /><rect x={-46} y={36} width={92} height={8} rx={4} fill={g("#6a7480")} /></g>;
    case "planta": return <g><rect x={-46} y={-4} width={56} height={40} fill={g("#8a5a4a")} /><rect x={-38} y={4} width={12} height={12} fill={g("#5ab0ff")} /><rect x={-20} y={4} width={12} height={12} fill={g("#5ab0ff")} /><rect x={14} y={-24} width={30} height={60} rx={14} fill={g("#5a7a9a")} /><path d="M29,-40 q-10,12 0,18 q10,-6 0,-18 Z" fill={g("#5ab0ff")} /><text x={-18} y={-12} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={14} fill={g("#f2ece0")}>H₂O</text></g>;
    case "pan": return <g><path d="M-44,18 Q-48,-20 0,-24 Q48,-20 44,18 Z" fill={g("#d89a4a")} />{[-20, 0, 20].map((x) => <path key={x} d={`M${x - 6},-14 l12,20`} stroke={g("#a8642a")} strokeWidth={5} strokeLinecap="round" />)}{apagado > 0 && <g fill="#5a8a3a" opacity={apagado}><circle cx={-16} cy={0} r={8} /><circle cx={14} cy={6} r={6} /><circle cx={24} cy={-8} r={5} /></g>}</g>;
    case "leche": return <g><path d="M-26,-20 L0,-44 L26,-20 V40 H-26 Z" fill={g("#f2f2f2")} /><path d="M-26,-20 L0,-44 L26,-20 Z" fill={g("#5aa0d8")} /><rect x={-26} y={0} width={52} height={20} fill={g("#5aa0d8")} /><text x={0} y={15} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={13} fill="#fff">MILK</text></g>;
    case "freezer": return <g><rect x={-46} y={-30} width={92} height={66} rx={8} fill={g("#dfe8ee")} /><rect x={-46} y={-30} width={92} height={14} rx={6} fill={g("#b8c6d0")} />{[0, 60, 120].map((r) => <rect key={r} x={-2} y={-8} width={4} height={36} fill={g("#5ab0ff")} transform={`rotate(${r} 0 10)`} />)}</g>;
    case "carne": return <g><path d="M-40,-6 Q-42,-34 0,-30 Q44,-28 40,4 Q36,30 -4,28 Q-38,26 -40,-6 Z" fill={g("#c84a4a")} /><path d="M-24,-8 q20,-16 44,0" stroke={g("#f2d0c0")} strokeWidth={7} fill="none" /><circle cx={18} cy={8} r={8} fill={g("#f2e6da")} /></g>;
    case "corte": return <g><path d="M-30,40 V-10 Q-30,-22 -20,-22 V-40 Q-14,-48 -8,-40 V-22 L0,-46 Q6,-52 12,-46 V-20 L18,-38 Q24,-44 30,-36 V10 Q30,40 0,42 Z" fill={g("#17100d")} /><rect x={-24} y={-2} width={44} height={16} rx={7} fill={g("#e8c8a0")} transform="rotate(-20)" /><path d="M-18,22 l30,-6" stroke={g("#ff4a3d")} strokeWidth={4} /></g>;
    case "tobillo": return <g><rect x={-12} y={-50} width={22} height={60} fill={g("#3b4a5c")} /><path d="M-14,8 h26 q24,6 26,26 h-52 Z" fill={g("#2a2228")} /><path d="M14,-20 l-12,10 l10,6 l-12,12" stroke={g("#ffcf3a")} strokeWidth={5} fill="none" strokeLinejoin="round" /></g>;
    case "frio": return <g><circle cx={22} cy={-22} r={16} fill={g("#f2ecc8")} /><circle cx={30} cy={-28} r={14} fill={g("#2a3050")} />{[0, 60, 120].map((r) => <g key={r} transform={`rotate(${r} -8 10)`}><rect x={-10} y={-24} width={5} height={68} fill={g("#bfe4ff")} /><path d="M-18,-14 l10,8 l10,-8" stroke={g("#bfe4ff")} strokeWidth={4} fill="none" /></g>)}</g>;
    case "muela": return <g><path d="M-30,-30 Q-34,-44 -14,-42 Q0,-36 14,-42 Q34,-44 30,-30 Q30,0 22,24 Q18,40 10,26 Q4,10 0,10 Q-4,10 -10,26 Q-18,40 -22,24 Q-30,0 -30,-30 Z" fill={g("#f6f2e6")} stroke={g("#c8c0ae")} strokeWidth={3} /><circle cx={8} cy={-16} r={9} fill="#7a3a2a" opacity={0.8} /><path d="M24,-6 l12,-8 M26,6 l14,0" stroke={g("#ff4a3d")} strokeWidth={4} strokeLinecap="round" /></g>;
    case "bolsa": return <g><rect x={-44} y={-22} width={80} height={44} rx={22} fill={g("#2f5a8a")} /><circle cx={36} cy={0} r={22} fill={g("#244a72")} /><circle cx={36} cy={0} r={12} fill={g("#1a3656")} /><rect x={-20} y={-22} width={6} height={44} fill={g("#ffcf3a")} /></g>;
    case "nafta": return <g><path d="M-30,-30 H22 L34,-18 V40 H-30 Z" fill={g("#c0352c")} /><rect x={-20} y={-44} width={16} height={16} fill={g("#2a2228")} /><path d="M2,-30 h20 v-10" stroke={g("#2a2228")} strokeWidth={6} fill="none" /><path d="M-22,-16 L24,30 M24,-16 L-22,30" stroke={g("#8a2a22")} strokeWidth={5} /></g>;
    case "herramientas": return <g><g transform="rotate(-35)"><rect x={-5} y={-40} width={10} height={80} rx={4} fill={g("#a87a3a")} /><rect x={-24} y={-48} width={48} height={18} rx={4} fill={g("#5a646c")} /></g><g transform="rotate(35)"><rect x={-5} y={-36} width={10} height={70} rx={4} fill={g("#8a949a")} /><circle cx={0} cy={-38} r={14} fill={g("#8a949a")} /><rect x={-5} y={-54} width={10} height={16} fill="#fff" /></g></g>;
    case "arroz": return <g><path d="M-30,40 Q-36,-6 -20,-30 L20,-30 Q36,-6 30,40 Z" fill={g("#efe6cf")} /><path d="M-22,-30 q22,-14 44,0" stroke={g("#a8946a")} strokeWidth={6} fill="none" /><text x={0} y={14} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={16} fill={g("#8a6a3a")}>RICE</text></g>;
    case "porotos": case "lata": return <g><rect x={-28} y={-36} width={56} height={74} rx={8} fill={g(n === "lata" ? "#c0352c" : "#7a4a2e")} /><rect x={-28} y={-12} width={56} height={30} fill={g("#f2ece0")} /><ellipse cx={0} cy={-36} rx={28} ry={7} fill={g("#c8c8cc")} />{n === "porotos" && [-12, 0, 12].map((x) => <ellipse key={x} cx={x} cy={3} rx={5} ry={7} fill={g("#8a3a2a")} />)}</g>;
    case "pasta": return <g>{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-26 + i * 6} y={-44} width={3.5} height={88} fill={g("#f1c24a")} transform={`rotate(${(i - 4) * 2})`} />)}<rect x={-32} y={-6} width={64} height={22} rx={4} fill={g("#5aa0d8")} /></g>;
    case "mani": return <g><rect x={-30} y={-28} width={60} height={70} rx={12} fill={g("#c8884a")} /><rect x={-26} y={-44} width={52} height={18} rx={4} fill={g("#c0352c")} /><rect x={-30} y={-6} width={60} height={24} fill={g("#f2ece0")} /><text x={0} y={12} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={13} fill={g("#8a4a1a")}>PB</text></g>;
    case "casa": return <g><path d="M-40,-4 L0,-40 L40,-4 Z" fill={g("#2a1e22")} /><rect x={-32} y={-4} width={64} height={44} fill={g("#8a3a2e")} /><rect x={-8} y={14} width={16} height={26} fill={g("#3a1a16")} /><rect x={14} y={4} width={12} height={12} fill={g(AMBAR)} /><rect x={18} y={-40} width={10} height={20} fill={g("#6a2a22")} /></g>;
    case "cruz": return <g><rect x={-14} y={-40} width={28} height={80} rx={4} fill={g("#e2483a")} /><rect x={-40} y={-14} width={80} height={28} rx={4} fill={g("#e2483a")} /></g>;
    case "rayo": return <path d="M8,-46 L-24,6 H-2 L-10,46 L24,-8 H2 Z" fill={g("#ffcf3a")} />;
    case "comida": return <g><g transform="translate(-16,6)"><rect x={-18} y={-26} width={36} height={52} rx={6} fill={g("#c0352c")} /><rect x={-18} y={-8} width={36} height={18} fill={g("#f2ece0")} /></g><path d="M8,30 Q4,-6 20,-24 L40,-24 Q48,-6 44,30 Z" fill={g("#efe6cf")} /></g>;
    case "techo": return <g><path d="M-44,0 L0,-40 L44,0 Z" fill={g("#5a4a5e")} /><rect x={-34} y={0} width={68} height={40} fill={g("#8a7a6a")} /><path d="M-6,40 V20 h12 v20" fill={g("#3a2a22")} /><path d="M-10,-6 q10,-12 20,0 q-4,10 -10,14 q-6,-4 -10,-14 Z" fill={g("#ff8a3a")} /></g>;
    case "dientes": return <g transform="scale(0.8)"><path d="M-30,-30 Q-34,-44 -14,-42 Q0,-36 14,-42 Q34,-44 30,-30 Q30,0 22,24 Q18,40 10,26 Q4,10 0,10 Q-4,10 -10,26 Q-18,40 -22,24 Q-30,0 -30,-30 Z" fill={g("#f6f2e6")} stroke={g("#c8c0ae")} strokeWidth={3} /></g>;
    default: return <circle r={30} fill={g("#888")} />;
  }
};
// tarjeta con ícono (pantalla): entra con resorte desde `desde`; `tachar` = cuadro de la cruz roja; `apagar` = cuadro en que se apaga
export const Vineta: React.FC<{ x: number; y: number; icono: string; rotulo?: string; desde: number; hasta?: number; tachar?: number; apagar?: number; tam?: number; acento?: string; check?: number; rot?: number }> = ({ x, y, icono, rotulo, desde, hasta = 1e9, tachar, apagar, tam = 150, acento = AMBAR, check, rot = 0 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 11, stiffness: 170 } });
  const o = interpolate(f, [hasta, hasta + 8], [1, 0], CL);
  const x1 = tachar !== undefined ? tw(f, tachar, tachar + 7, 0, 1) : 0;
  const x2 = tachar !== undefined ? tw(f, tachar + 5, tachar + 12, 0, 1) : 0;
  const ap = apagar !== undefined ? tw(f, apagar, apagar + 14, 0, 1) : 0;
  const ck = check !== undefined ? tw(f, check, check + 8, 0, 1) : 0;
  const k = tam / 150;
  return (
    <svg style={{ position: "absolute", left: x - tam * 0.75, top: y - tam * 0.75, width: tam * 1.5, height: tam * 1.5 + (rotulo ? 50 * k : 0), overflow: "visible", opacity: o }} viewBox={`${-tam * 0.75} ${-tam * 0.75} ${tam * 1.5} ${tam * 1.5 + (rotulo ? 50 * k : 0)}`}>
      <g transform={`rotate(${rot + (1 - s) * -10}) scale(${s})`}>
        <rect x={-tam / 2 + 5} y={-tam / 2 + 8} width={tam} height={tam} rx={22 * k} fill="#000" opacity={0.3} />
        <rect x={-tam / 2} y={-tam / 2} width={tam} height={tam} rx={22 * k} fill={ap > 0 ? osc("#f6f0e2", 1 - 0.45 * ap) : "#f6f0e2"} stroke={acento} strokeWidth={6 * k} />
        <g transform={`scale(${k * 1.15})`}><Icono n={icono} f={f} apagado={ap} /></g>
        {rotulo && <text x={0} y={tam / 2 + 38 * k} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26 * k} fill="#f6f0e2" stroke="#120f18" strokeWidth={6 * k} paintOrder="stroke" letterSpacing={2}>{rotulo}</text>}
        {x1 > 0 && <path d={`M${-tam * 0.42},${-tam * 0.42} L${-tam * 0.42 + tam * 0.84 * x1},${-tam * 0.42 + tam * 0.84 * x1}`} stroke={ROJO} strokeWidth={14 * k} strokeLinecap="round" />}
        {x2 > 0 && <path d={`M${tam * 0.42},${-tam * 0.42} L${tam * 0.42 - tam * 0.84 * x2},${-tam * 0.42 + tam * 0.84 * x2}`} stroke={ROJO} strokeWidth={14 * k} strokeLinecap="round" />}
        {ck > 0 && <g transform={`translate(${tam * 0.42},${-tam * 0.42}) scale(${ck})`}><circle r={26 * k} fill="#3aa86a" /><path d={`M${-12 * k},0 l${8 * k},${9 * k} l${15 * k},${-17 * k}`} stroke="#fff" strokeWidth={6 * k} fill="none" strokeLinecap="round" /></g>}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- barras horizontales (pantalla)
export type Barra = { rot: string; v: number; color: string; desde: number; fin?: string; icono?: string };
export const Barras: React.FC<{ x: number; y: number; w: number; items: Barra[]; alto?: number; paso?: number; titulo?: string; tituloDesde?: number; hasta?: number }> = ({ x, y, w, items, alto = 46, paso = 74, titulo, tituloDesde = 0, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {titulo && f >= tituloDesde && <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: "#f6ecd2", marginBottom: 16, textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: tw(f, tituloDesde, tituloDesde + 10, 0, 1) }}>{titulo}</div>}
      {items.map((b, i) => {
        if (f < b.desde) return <div key={i} style={{ height: paso }} />;
        const s = spring({ frame: f - b.desde, fps, config: { damping: 18, stiffness: 70 } });
        const e = tw(f, b.desde, b.desde + 8, 0, 1);
        return (
          <div key={i} style={{ height: paso, display: "flex", alignItems: "center", opacity: e }}>
            <div style={{ width: 230, fontFamily: F_HUD, fontWeight: 600, fontSize: 30, color: "#f6ecd2", letterSpacing: 2, textShadow: "0 3px 8px rgba(0,0,0,0.6)" }}>{b.rot}</div>
            <div style={{ width: w * b.v * s, height: alto, background: b.color, borderRadius: alto / 2, boxShadow: `0 0 18px ${b.color}66` }} />
            {b.fin && <div style={{ marginLeft: 14, fontFamily: F_HUD, fontWeight: 600, fontSize: 34, color: b.color, opacity: tw(f, b.desde + 14, b.desde + 22, 0, 1), textShadow: "0 3px 8px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{b.fin}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- mapa del Lago Superior que se dibuja (pantalla)
const LAGO: [number, number][] = [[0, 30], [6, 26], [12, 22], [20, 17], [28, 12], [36, 8], [42, 6], [48, 8], [54, 6], [60, 4], [68, 5], [76, 8], [84, 12], [92, 17], [99, 25], [100, 31], [96, 36], [88, 39], [80, 37], [72, 41], [64, 40], [60, 34], [63, 24], [57, 29], [52, 37], [44, 40], [36, 38], [28, 38], [20, 36], [12, 34], [5, 33]];
export const MapaLago: React.FC<{ x: number; y: number; w: number; desde: number; hasta?: number }> = ({ x, y, w, desde, hasta = 1e9 }) => {
  const f = useF();
  if (f < desde) return null;
  const k = w / 100;
  const pts = LAGO.map(([a, b]) => [a * k, b * k]);
  let L = 0; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; L += Math.hypot(q[0] - p[0], q[1] - p[1]); }
  const d = "M" + pts.map((p) => p.join(",")).join(" L") + " Z";
  const u = tw(f, desde, desde + 40, 0, 1);
  const r = tw(f, desde + 30, desde + 46, 0, 1);
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const pulso = 1 + 0.25 * Math.max(0, Math.sin((f - desde) / 5));
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: w + 40, height: 46 * k + 120, overflow: "visible", opacity: o }} viewBox={`-20 -20 ${w + 40} ${46 * k + 120}`}>
      <rect x={-20} y={-20} width={w + 40} height={46 * k + 40} rx={18} fill="#120f18" opacity={0.72} />
      <path d={d} fill="#5ab0ff" opacity={0.55 * r} />
      <path d={d} fill="none" stroke="#bfe4ff" strokeWidth={4} strokeDasharray={L} strokeDashoffset={L * (1 - u)} strokeLinejoin="round" />
      <ellipse cx={45 * k} cy={14 * k} rx={5 * k} ry={1.6 * k} fill="#3a4a3a" opacity={r} />
      {r > 0 && <><circle cx={0} cy={30 * k} r={9 * pulso} fill={AMBAR} opacity={r} /><text x={14} y={30 * k + 34} fontFamily={F_HUD} fontWeight={600} fontSize={22} fill={AMBAR} opacity={r}>DULUTH</text></>}
      <text x={w / 2} y={46 * k + 48} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} letterSpacing={3} fill="#f6ecd2" opacity={r}>LAKE SUPERIOR</text>
      <text x={w / 2} y={46 * k + 82} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={21} letterSpacing={2} fill="#bfe4ff" opacity={r}>LARGEST FRESHWATER LAKE BY AREA</text>
    </svg>
  );
};

// ---------------------------------------------------------------- pin que cae sobre un edificio (mundo)
export const Pin: React.FC<{ x: number; y: number; txt: string; desde: number; color?: string; s?: number }> = ({ x, y, txt, desde, color = AMBAR, s = 1 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const sp = spring({ frame: f - desde, fps, config: { damping: 10, stiffness: 160 } });
  const dy = (1 - sp) * -180;
  const W = txt.length * 13 * s + 26 * s;
  return (
    <g transform={`translate(${x},${y + dy}) scale(${s})`} opacity={Math.min(1, sp * 2)}>
      <ellipse cx={0} cy={4} rx={14 * sp} ry={4} fill="#000" opacity={0.35} />
      <path d="M0,0 C-16,-26 -22,-34 -22,-46 A22,22 0 1 1 22,-46 C22,-34 16,-26 0,0 Z" fill={color} stroke="#120f18" strokeWidth={3} />
      <circle cx={0} cy={-46} r={8} fill="#120f18" />
      <rect x={-W / 2 / s} y={-104} width={W / s} height={30} rx={15} fill="#120f18" opacity={0.85} />
      <text x={0} y={-82} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} letterSpacing={1.5} fill={color}>{txt}</text>
    </g>
  );
};

// ---------------------------------------------------------------- humo de chimenea visible (mundo)
export const HumoVisible: React.FC<{ x: number; y: number; o?: number; color?: string }> = ({ x, y, o = 1, color = "#8e8a98" }) => {
  const f = useF();
  return (
    <g opacity={o}>
      {Array.from({ length: 10 }).map((_, i) => {
        const t = (f / 80 + i / 10) % 1;
        return <circle key={i} cx={x + t * 140 + Math.sin(f / 26 + i) * 14} cy={y - t * 360} r={14 + t * 50} fill={color} opacity={(1 - t) * 0.7} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- escarcha que avanza por un vidrio (mundo)
export const Escarcha: React.FC<{ x: number; y: number; w: number; h: number; u: number }> = ({ x, y, w, h, u }) => (
  <g opacity={0.85}>
    {[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map(([cx, cy, sx, sy], i) => {
      const R = u * Math.min(w, h) * (0.55 + 0.1 * i);
      const ox = x + cx * w, oy = y + cy * h;
      return <g key={i}>
        <path d={`M${ox},${oy} L${ox + sx * R},${oy} Q${ox + sx * R * 0.7},${oy + sy * R * 0.3} ${ox + sx * R * 0.75},${oy + sy * R * 0.55} Q${ox + sx * R * 0.4},${oy + sy * R * 0.6} ${ox + sx * R * 0.55},${oy + sy * R * 0.8} Q${ox + sx * R * 0.2},${oy + sy * R * 0.8} ${ox},${oy + sy * R} Z`} fill="#eef6ff" opacity={0.75} />
        {Array.from({ length: 5 }).map((_, k) => <path key={k} d={`M${ox},${oy} l${sx * R * (0.5 + k * 0.12)},${sy * R * (0.15 + k * 0.17)}`} stroke="#ffffff" strokeWidth={2} opacity={0.8} />)}
      </g>;
    })}
  </g>
);

// ---------------------------------------------------------------- grifo con pileta (mundo; chorro 0..1)
export const Pileta: React.FC<{ x: number; piso: number; chorro: number; gota?: boolean }> = ({ x, piso, chorro, gota }) => {
  const f = useF();
  const top = piso - 150;
  return (
    <g>
      <rect x={x - 130} y={top} width={260} height={150} fill="#6a5a4a" /><rect x={x - 140} y={top - 14} width={280} height={18} rx={4} fill="#c8bca8" />
      <rect x={x - 70} y={top - 12} width={140} height={16} rx={6} fill="#8a949a" />
      {[x - 90, x + 30].map((xx) => <rect key={xx} x={xx} y={top + 26} width={60} height={100} rx={4} fill="#5a4a3e" />)}
      <path d={`M${x + 50},${top - 14} V${top - 70} Q${x + 50},${top - 92} ${x + 26},${top - 92} H${x - 6}`} stroke="#9aa4ac" strokeWidth={12} fill="none" strokeLinecap="round" />
      <rect x={x + 36} y={top - 40} width={30} height={10} rx={4} fill="#c0352c" />
      {chorro > 0.02 && <rect x={x - 10} y={top - 88} width={8 * chorro} height={78} rx={4} fill="#8fd3ff" opacity={0.85} />}
      {chorro > 0.02 && Array.from({ length: 4 }).map((_, i) => <rect key={i} x={x - 9} y={top - 80 + ((f * 9 + i * 20) % 70)} width={5 * chorro} height={10} fill="#e6f6ff" opacity={0.8} />)}
      {gota && chorro <= 0.02 && (() => { const t = (f % 40) / 40; return t < 0.7 ? <circle cx={x - 6} cy={top - 86 + t * 70} r={4} fill="#8fd3ff" /> : null; })()}
    </g>
  );
};

// ---------------------------------------------------------------- display del surtidor (pantalla)
export const DisplaySurtidor: React.FC<{ x: number; y: number; gal: number; precio?: number; desde: number; hasta?: number; tam?: number }> = ({ x, y, gal, precio = 3.39, desde, hasta = 1e9, tam = 1 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 150 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const fila = (rot: string, v: string, c: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * tam, marginBottom: 8 * tam }}>
      <div style={{ width: 120 * tam, fontFamily: F_HUD, fontWeight: 600, fontSize: 24 * tam, color: "#9aa4ac", letterSpacing: 2 }}>{rot}</div>
      <div style={{ background: "#0c1410", padding: `${4 * tam}px ${16 * tam}px`, borderRadius: 8, fontFamily: F_MONO, fontWeight: 800, fontSize: 52 * tam, color: c, minWidth: 220 * tam, textAlign: "right", fontVariantNumeric: "tabular-nums", textShadow: `0 0 12px ${c}aa` }}>{v}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "50% 0%", background: "#ece6dc", borderRadius: 18, padding: `${18 * tam}px ${22 * tam}px ${10 * tam}px`, border: "6px solid #c0352c", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
      {fila("GALLONS", gal.toFixed(1), "#7dff6a")}
      {fila("$ SALE", (gal * precio).toFixed(2), "#7dff6a")}
    </div>
  );
};

// ---------------------------------------------------------------- ecuación de calorías (pantalla)
export const Ecuacion: React.FC<{ y: number; t: number[]; f0?: number }> = ({ y, t }) => {
  // t = cuadros de entrada de: [2 personas, ×2,000, ×365, =, resultado que rueda]
  const f = useF();
  const { fps } = useVideoConfig();
  const sp = (a: number) => (f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 12, stiffness: 150 } }));
  const term = (a: number, el: React.ReactNode, w: number) => { const s = sp(a); return <div style={{ width: w, transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5), textAlign: "center" }}>{el}</div>; };
  const tx = (s: string, c = "#f6ecd2", tam = 84) => <div style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: tam, color: c, textShadow: "0 6px 18px rgba(0,0,0,0.6)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{s}</div>;
  const sub = (s: string) => <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: "#c8bfae", marginTop: 4, whiteSpace: "nowrap" }}>{s}</div>;
  const res = interpolate(f, [t[4], t[4] + 36], [0, 1500000], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
      {term(t[0], <>{tx("2", AMBAR)}{sub("PEOPLE")}</>, 150)}
      {term(t[1], <>{tx("× 2,000")}{sub("KCAL A DAY")}</>, 360)}
      {term(t[2], <>{tx("× 365")}{sub("DAYS")}</>, 260)}
      {term(t[3], <>{tx("=")}</>, 90)}
      {term(t[3], <>{tx(fmt(res), AMBAR, 96)}{sub("CALORIES A YEAR")}</>, 470)}
    </div>
  );
};

// ---------------------------------------------------------------- casilleros «¿qué mata a dos personas?» (pantalla)
export const Casilleros: React.FC<{ x: number; y: number; desde: number; llenos: { f: number; icono: string; rot: string }[]; titulo?: string; tam?: number; hasta?: number }> = ({ x, y, desde, llenos, titulo = "WHAT KILLS TWO PEOPLE?", tam = 120, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 140 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: Math.min(o, s * 1.4), transform: `translateY(${(1 - s) * 20}px)` }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 36, letterSpacing: 4, color: "#f6ecd2", textShadow: "0 3px 10px rgba(0,0,0,0.7)", marginBottom: 14, whiteSpace: "nowrap" }}>{titulo}</div>
      <div style={{ display: "flex", gap: 74 }}>
        {[0, 1, 2, 3].map((i) => {
          const l = llenos[i];
          const on = l && f >= l.f;
          const sp = on ? spring({ frame: f - l.f, fps, config: { damping: 10, stiffness: 180 } }) : 0;
          return (
            <div key={i} style={{ width: tam, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: tam, height: tam, borderRadius: 20, border: `5px ${on ? "solid" : "dashed"} ${on ? ROJO : "#8a8090"}`, background: on ? "#f6f0e2" : "rgba(18,15,24,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {on ? <svg width={tam} height={tam} viewBox="-60 -60 120 120" style={{ transform: `scale(${sp})` }}><Icono n={l.icono} f={f} /></svg> : <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#8a8090" }}>?</div>}
              </div>
              <div style={{ height: 34, marginTop: 8, fontFamily: F_HUD, fontWeight: 600, fontSize: 22, letterSpacing: 1.5, color: "#f6ecd2", textAlign: "center", whiteSpace: "nowrap", opacity: on ? Math.min(1, sp) : 0, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{l?.rot}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- la nafta se pone vieja (pantalla, línea de tiempo)
export const NaftaVieja: React.FC<{ x: number; y: number; w: number; desde: number; t3: number; t12: number; hasta?: number }> = ({ x, y, w, desde, t3, t12, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 130 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const mes = interpolate(f, [desde + 10, t3, t12], [0, 3, 12], { ...CL });
  const c = mes < 3 ? "#ffb03a" : mes < 12 ? "#b07a2a" : "#6a4a2a";
  const px = (m: number) => (m / 12) * w;
  const motorX = tw(f, t12, t12 + 8, 0, 1);
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: w + 200, height: 300, overflow: "visible", opacity: Math.min(o, s) }} viewBox={`-60 -150 ${w + 200} 300`}>
      <rect x={-60} y={-150} width={w + 200} height={290} rx={20} fill="#120f18" opacity={0.75} />
      <text x={-30} y={-104} fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={4} fill="#f6ecd2">UNTREATED GAS</text>
      <rect x={0} y={40} width={w} height={10} rx={5} fill="#3a3440" />
      <rect x={0} y={40} width={px(mes)} height={10} rx={5} fill={c} />
      {[0, 3, 6, 9, 12].map((m) => <g key={m}><rect x={px(m) - 2} y={30} width={4} height={30} fill="#8a8090" /><text x={px(m)} y={92} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#c8bfae">{m === 0 ? "NOW" : m === 12 ? "1 YEAR" : `${m} MO`}</text></g>)}
      <g transform={`translate(${px(mes)},-30)`}><g transform="scale(0.9)"><path d="M-30,-30 H22 L34,-18 V40 H-30 Z" fill={c} /><rect x={-20} y={-44} width={16} height={16} fill="#2a2228" /></g></g>
      {f >= t3 && <text x={px(3)} y={128} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#e0a23a" opacity={tw(f, t3, t3 + 8, 0, 1)}>STALE</text>}
      {motorX > 0 && <g transform={`translate(${w + 70},-20) scale(${motorX})`}><rect x={-40} y={-26} width={80} height={52} rx={8} fill="#5a646c" /><rect x={-28} y={-40} width={24} height={16} fill="#5a646c" /><path d="M-36,-36 L36,36 M36,-36 L-36,36" stroke={ROJO} strokeWidth={10} strokeLinecap="round" /></g>}
    </svg>
  );
};

// ---------------------------------------------------------------- mínimas de enero (pantalla, barras con el cero)
const MESES: [string, number][] = [["OCT", 36], ["NOV", 23], ["DEC", 6], ["JAN", -2], ["FEB", 1], ["MAR", 14]];
export const FrioEnero: React.FC<{ x: number; y: number; desde: number; marca: number; hasta?: number }> = ({ x, y, desde, marca, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const k = 4, cero = 200;
  const ext = tw(f, marca, marca + 16, 0, 1);
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: 760, height: 420, overflow: "visible", opacity: o }} viewBox="-40 -40 760 420">
      <rect x={-40} y={-40} width={760} height={420} rx={20} fill="#120f18" opacity={0.75} />
      <text x={-10} y={0} fontFamily={F_HUD} fontWeight={600} fontSize={26} letterSpacing={3} fill="#f6ecd2">AVERAGE LOW · DULUTH (°F)</text>
      <line x1={0} y1={cero} x2={680} y2={cero} stroke="#c8bfae" strokeWidth={2} />
      <text x={676} y={cero - 8} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#c8bfae">0°</text>
      {MESES.map(([m, v], i) => {
        const s = f < desde + i * 5 ? 0 : spring({ frame: f - desde - i * 5, fps, config: { damping: 16, stiffness: 90 } });
        const h = v * k * s;
        const xx = 30 + i * 104;
        const jan = m === "JAN";
        return <g key={m}>
          <rect x={xx} y={h >= 0 ? cero - h : cero} width={64} height={Math.max(2, Math.abs(h))} rx={5} fill={v < 0 ? "#8fd3ff" : "#c8bfae"} opacity={jan ? 1 : 0.55} />
          <text x={xx + 32} y={h >= 0 ? cero + 30 : cero - 12} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={21} fill={jan ? "#8fd3ff" : "#f6ecd2"}>{m}</text>
          {jan && s > 0.5 && <text x={xx + 32} y={cero + 40} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={24} fill="#8fd3ff">{v}°</text>}
        </g>;
      })}
      {ext > 0 && <g opacity={ext}>
        <line x1={0} y1={cero + 30 * k} x2={680 * ext} y2={cero + 30 * k} stroke="#8fd3ff" strokeWidth={4} strokeDasharray="14 8" />
        <text x={676} y={cero + 30 * k - 12} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#8fd3ff">COLD NIGHTS · −30°</text>
      </g>}
    </svg>
  );
};

// ---------------------------------------------------------------- la red se cae: represa → torres → ciudad (pantalla)
export const RedCae: React.FC<{ x: number; y: number; desde: number; rotura: number; hasta?: number }> = ({ x, y, desde, rotura, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 130 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const W = 1300;
  const apag = tw(f, rotura + 6, rotura + 40, 0, 1, (t) => t); // la oscuridad viaja hacia la ciudad
  const vivo = (xx: number) => (f < rotura ? 1 : xx < 520 ? 1 : (xx - 520) / (W - 520) < apag ? 0 : 1);
  const chispa = f >= rotura && f < rotura + 30;
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: W + 80, height: 380, overflow: "visible", opacity: Math.min(o, s) }} viewBox={`-40 -60 ${W + 80} 380`}>
      <rect x={-40} y={-60} width={W + 80} height={380} rx={20} fill="#120f18" opacity={0.78} />
      {/* río y represa */}
      <path d="M-30,250 Q120,230 200,250" stroke="#3a6a9a" strokeWidth={26} fill="none" />
      <path d="M40,140 L160,140 L180,250 L20,250 Z" fill="#8a8a92" />
      {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={40 + i * 26} y={152} width={12} height={(f * 4 + i * 20) % 90} fill="#8fd3ff" opacity={0.7} />)}
      <text x={100} y={300} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#c8bfae">THOMSON DAM</text>
      {/* torres y cables */}
      {[320, 520, 720, 920].map((tx, i) => <g key={i}><path d={`M${tx - 26},250 L${tx},90 L${tx + 26},250 M${tx - 34},120 H${tx + 34}`} stroke="#6a6474" strokeWidth={6} fill="none" /></g>)}
      {[[180, 320], [320, 520], [520, 720], [720, 920], [920, 1150]].map(([a, b], i) => {
        const on = vivo((a + b) / 2);
        return <path key={i} d={`M${a},120 Q${(a + b) / 2},150 ${b},120`} stroke={on ? AMBAR : "#3a3440"} strokeWidth={5} fill="none" />;
      })}
      {f < rotura && Array.from({ length: 4 }).map((_, i) => { const t = ((f / 40 + i / 4) % 1); const xx = 180 + t * 970; return <circle key={i} cx={xx} cy={120 + 30 * Math.sin(((xx - 180) % 200) / 200 * Math.PI) * 0.8} r={8} fill="#fff4c8" />; })}
      {/* rotura */}
      {f >= rotura && <g transform="translate(520,120)"><path d="M-14,-24 L14,24 M14,-24 L-14,24" stroke={ROJO} strokeWidth={8} strokeLinecap="round" />{chispa && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M0,0 l${Math.cos(i) * (20 + (f - rotura) * 2)},${Math.sin(i * 1.7) * (20 + (f - rotura) * 2)}`} stroke="#ffe27a" strokeWidth={3} opacity={1 - (f - rotura) / 30} />)}</g>}
      {/* ciudad */}
      {Array.from({ length: 7 }).map((_, i) => <g key={i}><rect x={1150 + i * 20} y={250 - 50 - ((i * 37) % 70)} width={18} height={50 + ((i * 37) % 70)} fill="#3a3448" />{[0, 1, 2].map((r) => <rect key={r} x={1154 + i * 20} y={250 - 40 - r * 18} width={8} height={8} fill={vivo(1150) ? AMBAR : "#221c2a"} />)}</g>)}
      <text x={1220} y={300} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#c8bfae">DULUTH</text>
      {f >= rotura + 20 && <text x={520} y={-14} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={3} fill={ROJO} opacity={tw(f, rotura + 20, rotura + 30, 0, 1)}>WORKERS ON SHIFT: 0</text>}
    </svg>
  );
};

// ---------------------------------------------------------------- objetos chicos en la mano (dibujados derechos: usar con rot)
export const Escalera: React.FC = () => (<g transform="translate(0,-6)">{[-16, 16].map((y) => <rect key={y} x={-170} y={y - 4} width={300} height={8} rx={3} fill="#c89a5a" />)}{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-160 + i * 38} y={-16} width={7} height={32} fill="#a87a3a" />)}</g>);
export const Pan: React.FC = () => (<g transform="translate(0,-16)"><path d="M-34,14 Q-38,-14 0,-18 Q38,-14 34,14 Z" fill="#d89a4a" />{[-14, 4, 20].map((x) => <path key={x} d={`M${x - 5},-10 l10,16`} stroke="#a8642a" strokeWidth={4} strokeLinecap="round" />)}</g>);
export const Olla: React.FC<{ f: number; hierve?: number }> = ({ f, hierve = 0 }) => (
  <g transform="translate(0,-14)">
    <rect x={-40} y={-20} width={80} height={46} rx={8} fill="#8a949a" /><rect x={-48} y={-24} width={96} height={10} rx={5} fill="#6a7480" />
    {hierve > 0 && Array.from({ length: 5 }).map((_, i) => { const t = ((f / 14 + i / 5) % 1); return <circle key={i} cx={-24 + i * 12} cy={-28 - t * 50} r={5 + t * 8} fill="#eef4ff" opacity={(1 - t) * 0.7 * hierve} />; })}
  </g>
);
export const Pistola: React.FC = () => (<g><rect x={-8} y={-8} width={16} height={34} rx={5} fill="#2a2228" /><path d="M-6,-6 L36,-14 L38,-6 L-4,4 Z" fill="#5a646c" /><rect x={30} y={-16} width={20} height={6} rx={3} fill="#2a2228" /></g>);
export const Vaso2: React.FC<{ lleno: number }> = ({ lleno }) => (<g transform="translate(0,-18)"><path d="M-16,-26 L16,-26 L12,22 L-12,22 Z" fill="#dfefff" opacity={0.5} stroke="#bfd8f0" strokeWidth={3} /><path d={`M${-12 - 4 * lleno},${22 - 46 * lleno} L${12 + 4 * lleno},${22 - 46 * lleno} L12,22 L-12,22 Z`} fill="#5ab0ff" opacity={0.7} /></g>);
