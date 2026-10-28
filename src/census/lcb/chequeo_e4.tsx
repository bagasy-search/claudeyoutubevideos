// Chequeo de CARAS LIBRES para escenas de grupo de lc04 (sólo lc04: no lo usa lc03).
// Calcula por cuadro el círculo de cada cabeza y los segmentos de antebrazo + herramienta/objeto alzado, y avisa cuando:
//  · un brazo / mano / herramienta / objeto se superpone con una CABEZA (la propia si va en la mano de adelante, o la de
//    otro personaje dibujado DESPUÉS, que la taparía);
//  · dos cabezas quedan a menos de `sep` px (por defecto 140);
//  · una cabeza queda cortada por el borde del cuadro (si se pasan las `claves` de cámara).
// Sólo dibuja/avisa con el input prop {"chequeo":1} (stills: st.sh … --props '{"chequeo":1}'); en el render normal no hace nada.
// Además de marcar el cuadro actual, imprime un RESUMEN de TODA la escena (todos los cuadros [f0,f1]) arriba a la izquierda.
import React from "react";
import { getInputProps } from "remotion";
import { ActorProps, estadoActor } from "../../anikit/actor";
import { Clave, enPantalla, useF } from "../../anikit/camara";
import { articulaciones, huesosDe } from "../../anikit/personaje";

// objeto en la mano: eje +y del objeto = dirección del antebrazo (así lo dibuja Personaje). y0..y1 = extremos sobre ese eje,
// w = ancho, rot = rotación extra que el nodo aplica adentro (p.ej. <g transform="rotate(-40)">).
export type Herr = { y0: number; y1: number; w: number; rot?: number };
export const H_PALA: Herr = { y0: -214, y1: 80, w: 26 };
export const H_HORQ: Herr = { y0: -206, y1: 40, w: 30 };
export const H_BROCHA: Herr = { y0: -112, y1: 0, w: 16 };
export const H_PAPA = (s = 1, dy = 0): Herr => ({ y0: dy - 22 * s, y1: dy + 22 * s, w: 40 * s });

export type ItemCh = { a: ActorProps; nombre?: string; herrD?: (f: number) => Herr | null; herrI?: (f: number) => Herr | null; dx?: (f: number) => number; dy?: (f: number) => number };
type Seg = { x1: number; y1: number; x2: number; y2: number; w: number; frente: boolean };

const rad = (g: number) => (g * Math.PI) / 180;
export const geomItem = (it: ItemCh, f: number) => {
  const s = estadoActor(it.a, f, 30);
  const look = it.a.look;
  const H = huesosDe(look.estilo, look.alto);
  const frontal = look.frontal ?? (look.estilo === "frijol" || look.estilo === "demonio");
  const j = articulaciones(s.p, s.asiento, H, frontal ? { h: 29, c: 15 } : { h: 6, c: 5 });
  const ox = s.x + (it.dx ? it.dx(f) : 0), oy = s.y + (it.dy ? -it.dy(f) : 0);
  const W = (p: { x: number; y: number }) => ({ x: ox + p.x * s.esc * s.dir, y: oy + p.y * s.esc });
  const sombrero = (look.accesorios ?? []).some((q) => q.t === "sombrero");
  const cab = { ...W({ x: j.cabeza.x, y: j.cabeza.y + 4 }), r: H.cabezaR * s.esc, hat: sombrero ? 30 * s.esc : 0 };
  const segs: Seg[] = [];
  const brazo = (B: typeof j.bD, frente: boolean, herr: Herr | null) => {
    const c = W(B.codo), m = W(B.mano);
    segs.push({ x1: c.x, y1: c.y, x2: m.x, y2: m.y, w: 9 * s.esc, frente });
    if (herr) {
      const a = rad(B.angAnte - (herr.rot ?? 0));
      const L = (t: number) => W({ x: B.mano.x + Math.sin(a) * t, y: B.mano.y + Math.cos(a) * t });
      const p0 = L(herr.y0), p1 = L(herr.y1);
      segs.push({ x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, w: herr.w * s.esc, frente });
    }
  };
  // palo: el brazo IZQUIERDO se dibuja detrás de la propia cabeza; el DERECHO, delante
  brazo(j.bI, frontal, it.herrI ? it.herrI(f) : null);
  brazo(j.bD, true, it.herrD ? it.herrD(f) : null);
  return { cab, segs };
};

const distSeg = (px: number, py: number, s: Seg) => {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - s.x1) * dx + (py - s.y1) * dy) / L2));
  return Math.hypot(px - (s.x1 + dx * t), py - (s.y1 + dy * t));
};

export type Choque = { f: number; tipo: "tapa" | "junto" | "borde"; a: string; b?: string };
export const choquesEn = (items: ItemCh[], f: number, sep = 140, claves?: Clave[]): Choque[] => {
  const G = items.map((it) => geomItem(it, f));
  const out: Choque[] = [];
  const nom = (i: number) => items[i].nombre ?? `#${i}`;
  G.forEach((g, i) => {
    // la propia cabeza: sólo lo que va delante (brazo derecho + su objeto); el antebrazo bajo el mentón no cuenta
    g.segs.forEach((s) => { if (s.frente && distSeg(g.cab.x, g.cab.y - g.cab.hat * 0.4, s) < g.cab.r * 0.92 + s.w / 2 + 4) out.push({ f, tipo: "tapa", a: nom(i), b: "sí mismo" }); });
    G.forEach((h, k) => {
      if (k === i) return;
      // lo de k tapa la cabeza de i sólo si k se dibuja DESPUÉS
      if (k > i) h.segs.forEach((s) => { if (distSeg(g.cab.x, g.cab.y - g.cab.hat * 0.4, s) < g.cab.r + s.w / 2 + 12) out.push({ f, tipo: "tapa", a: nom(i), b: nom(k) }); });
      // misma fila (|dy|<60): ≥ sep · filas distintas (la de atrás más arriba y corrida medio paso): ≥ 120
      if (k > i && Math.hypot(g.cab.x - h.cab.x, g.cab.y - h.cab.y) < (Math.abs(g.cab.y - h.cab.y) < 60 ? sep : 120)) out.push({ f, tipo: "junto", a: nom(i), b: nom(k) });
    });
    if (claves) {
      const p = enPantalla(claves, f, 30, g.cab.x, g.cab.y);
      const z = Math.abs((enPantalla(claves, f, 30, g.cab.x + 100, g.cab.y).x - p.x) / 100);
      const r = (g.cab.r + 10) * z;
      if (p.x - r < 0 || p.x + r > 1920 || p.y - r - g.cab.hat * z < 0 || p.y + r > 1080) out.push({ f, tipo: "borde", a: nom(i) });
    }
  });
  return out;
};

const resumen = (items: ItemCh[], f0: number, f1: number, sep: number, claves?: Clave[]) => {
  const res = new Map<string, [number, number, number]>();
  for (let ff = f0; ff <= f1; ff++) for (const c of choquesEn(items, ff, sep, claves)) {
    const k = `${c.tipo}: ${c.a}${c.b ? ` x ${c.b}` : ""}`;
    const v = res.get(k);
    res.set(k, v ? [v[0], ff, v[2] + 1] : [ff, ff, 1]);
  }
  return [...res.entries()].map(([k, [a, b, n]]) => `${k}  f${a}-${b} (${n})`);
};
// el chequeo AUTOMÁTICO (abajo: <A>, <Escena> y conChk) reemplaza a los overlays manuales
const AUTO = true;
export const activo = () => !!(getInputProps() as { chequeo?: number }).chequeo;

// marcas en el MUNDO (va dentro de `medio`, después de los actores): círculo verde = cabeza libre, rojo = tapada/cortada
export const Chequeo: React.FC<{ items: ItemCh[]; sep?: number; claves?: Clave[] }> = ({ items, sep = 140, claves }) => {
  const f = useF();
  if (!activo() || AUTO) return null;
  const G = items.map((it) => geomItem(it, f));
  const malos = new Set(choquesEn(items, f, sep, claves).filter((c) => c.tipo !== "junto").map((c) => c.a));
  return (
    <g>
      {G.map((g, i) => <circle key={i} cx={g.cab.x} cy={g.cab.y} r={g.cab.r} fill="none" stroke={malos.has(items[i].nombre ?? `#${i}`) ? "#ff1a1a" : "#22ff66"} strokeWidth={6} />)}
      {G.map((g, i) => g.segs.map((s, k) => <line key={`${i}-${k}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#ff00ff" strokeWidth={3} opacity={0.8} />))}
    </g>
  );
};
// resumen de TODA la escena (va en `hud`): cada choque con su tramo de cuadros; lo imprime también en consola
export const ChequeoTexto: React.FC<{ items: ItemCh[]; f0: number; f1: number; sep?: number; claves?: Clave[]; titulo?: string }> = ({ items, f0, f1, sep = 140, claves, titulo = "" }) => {
  const f = useF();
  if (!activo() || AUTO) return null;
  const lineas = resumen(items, f0, f1, sep, claves);
  if (lineas.length) (globalThis as unknown as { console: { warn: (t: string) => void } }).console.warn(`[chequeo ${titulo} f${f}] ${lineas.join(" | ")}`);
  return (
    <div style={{ position: "absolute", left: 660, top: 8, width: 1240, fontFamily: "monospace", fontSize: 22, color: lineas.length ? "#ff8080" : "#80ff80", background: "rgba(0,0,0,0.75)", whiteSpace: "pre", zIndex: 99 }}>
      {[`CHEQUEO ${titulo} (f${f0}-${f1})`, ...(lineas.length ? lineas.slice(0, 18) : ["OK: sin choques en toda la escena"])].join(String.fromCharCode(10))}
    </div>
  );
};

// ---------- palear SIN mango sobre las caras (lc04: E42/E44/E75) ----------
// La pala se agarra del MANGO con la mano de atrás (enManoI → detrás de la propia cabeza y del torso) y se extiende hacia
// ADELANTE y ABAJO hasta la tierra: nada de la pala sube por encima de la mano. Dos poses con resorte (clavar / alzar).
export const PALA_ROT = 64;
export const PALA_TR = `rotate(${PALA_ROT}) scale(0.68) translate(0,200)`;
export const H_PALA_I: Herr = { y0: -10, y1: 201, w: 24, rot: PALA_ROT };
export const PALEA_A = { tronco: 34, cabeza: -14, hI: 40, cI: 40, hD: 48, cD: 36, pI: 62, rI: 100, pD: 78, rD: 112 };
export const PALEA_B = { tronco: 10, cabeza: -4, hI: 52, cI: 48, hD: 58, cD: 44, pI: -8, rI: 8, pD: 10, rD: 6 };
export const palear = (f0: number, f1: number, per: number, off: number) => {
  const k: { f: number; v: Record<string, number> }[] = [];
  for (let t = f0 - per + (((off % per) + per) % per); t < f1 + per; t += per) k.push({ f: t, v: PALEA_A }, { f: t + per / 2, v: PALEA_B });
  return k;
};
// la tierra va en la hoja mientras sube (de la mitad del clavado hasta antes de volcar)
export const conTierraP = (f: number, f0: number, per: number, off: number) => { const p = ((((f - f0 - (((off % per) + per) % per)) % per) + per) % per) / per; return p > 0.2 && p < 0.75; };

// =====================================================================================================================
// CHEQUEO AUTOMÁTICO (vuelta I) — corre en TODAS las escenas de lc04 sin instrumentarlas a mano.
//  · <A> (este, no el de comun_ep) registra cada actor en el chequeo de su escena y envuelve lo que lleva en la mano;
//  · <Escena> (este) registra las claves de cámara;
//  · conChk(PLANOS, n0, fin) envuelve cada plano en <Chk nombre="E07">: al final del plano dibuja el informe.
// Qué marca (TODOS los cuadros del plano, geometría pura en coordenadas del mundo):
//  · tapa    → brazo / mano / objeto en la mano sobre una CABEZA (círculo + caja del sombrero/gorro): la propia (brazo
//              de adelante del palo y lo que lleva) o la de otro que se dibuja DESPUÉS;
//  · junto   → cabezas (con sombrero/gorro/pelo) superpuestas;
//  · borde   → en planos de grupo (≥3 personas) una cabeza cortada por el borde del cuadro;
//  · fundido → personaje con opacidad entre 0,03 y 0,97 (fantasma);
//  · salto   → la cabeza cambia de pose >20 px (relativo a los pies, ×escala) o >70 px en el mundo en UN cuadro.
// y en el cuadro ACTUAL (en pantalla, por el DOM): cualquier cosa dibujada DESPUÉS de un actor (objeto suelto, cartel,
// texto del HUD, rótulo) que cubra ≥12 % de su cabeza → «encima».
// Sólo con {"chequeo":1}; manda cada informe por POST a 127.0.0.1:18744 (colector) además de dibujarlo.
import { createContext, useContext, useId, useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { Actor } from "../../anikit/actor";
import { Escena as EscenaKit, EscenaProps } from "../../anikit/escena";
import { BORDE_CALIDO } from "../elenco";
import type { PlanoM } from "../../anikit/montaje";

type Cap = { x1: number; y1: number; x2: number; y2: number; w: number; obj?: boolean }; // cápsula (obj = lo que lleva en la mano)
type RegA = { id: string; a: ActorProps; fG: number; chD?: Herr; chI?: Herr; nombre?: string };
type CtxChk = { actores: Map<string, RegA>; claves?: Clave[]; nombre: string; caps: Map<string, Cap[]> };
const ChkCtx = createContext<CtxChk | null>(null);

const herrCap = (h: Herr): Cap[] => {
  const r = rad(-(h.rot ?? 0));
  return [{ x1: Math.sin(r) * h.y0, y1: Math.cos(r) * h.y0, x2: Math.sin(r) * h.y1, y2: Math.cos(r) * h.y1, w: h.w }];
};

export const A: React.FC<ActorProps & { chD?: Herr; chI?: Herr; nombre?: string }> = ({ chD, chI, nombre, ...p }) => {
  const ctx = useContext(ChkCtx);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fG = useCurrentFrame();
  if (!ctx || !activo()) return <Actor luz={BORDE_CALIDO} {...p} />;
  ctx.actores.set(uid, { id: uid, a: { luz: BORDE_CALIDO, ...p }, fG, chD, chI, nombre });
  const env = (m: ActorProps["enManoD"], lado: string): ActorProps["enManoD"] =>
    m == null ? m : typeof m === "function" ? (ff: number) => <g data-chm={uid + lado}>{m(ff)}</g> : <g data-chm={uid + lado}>{m}</g>;
  return (
    <g data-cha={uid}>
      <Actor luz={BORDE_CALIDO} {...p} enManoD={env(p.enManoD, "D")} enManoI={env(p.enManoI, "I")} />
      {/* marcas invisibles en (0,0) (100,0) (0,100) del mundo: getBoundingClientRect sí incluye la cámara (CSS) */}
      {[[0, 0], [100, 0], [0, 100]].map(([x, y], i) => <rect key={i} data-chp={i} x={x - 0.5} y={y - 0.5} width={1} height={1} fill="none" />)}
    </g>
  );
};

export const Escena: React.FC<EscenaProps> = (p) => {
  const ctx = useContext(ChkCtx);
  if (ctx) ctx.claves = p.claves;
  return <EscenaKit {...p} />;
};

// ---- geometría pura por actor y cuadro ----
type Mat = [number, number, number, number, number, number]; // a b c d e f (SVG)
const ap2 = (M: Mat, x: number, y: number) => ({ x: M[0] * x + M[2] * y + M[4], y: M[1] * x + M[3] * y + M[5] });
type Cab = { x: number; y: number; r: number; hx0: number; hx1: number; hy0: number; hy1: number; esc: number };
const extrasCabeza = (look: ActorProps["look"]) => {
  const acc = (look.accesorios ?? []) as { t: string; pompon?: boolean; forma?: string }[];
  const t = (k: string) => acc.find((q) => q.t === k);
  if (t("sombrero")) return { lado: 30, arriba: 30 };
  if (t("gorroLana")) return { lado: 6, arriba: t("gorroLana")!.pompon ? 25 : 16 };
  if (t("gorroPapel")) return { lado: 4, arriba: 18 };
  if (t("gorra")) return { lado: 14, arriba: 8 };
  if (t("capucha")) return { lado: 10, arriba: 6 };
  const pe = t("pelo");
  if (pe) return { lado: pe.forma === "bob" ? 10 : pe.forma === "cola" ? 14 : 3, arriba: pe.forma === "punta" ? 18 : 9 };
  return { lado: 2, arriba: 2 };
};
type GeoA = { cab: Cab; propios: Cap[]; todos: Cap[]; rel: { x: number; y: number }; op: number };
const geoActor = (r: RegA, f: number, M: Mat, caps: Map<string, Cap[]>): GeoA => {
  const s = estadoActor(r.a, f, 30);
  const look = r.a.look;
  const H = huesosDe(look.estilo, look.alto);
  const frontal = look.frontal ?? (look.estilo === "frijol" || look.estilo === "demonio");
  const j = articulaciones(s.p, s.asiento, H, frontal ? { h: 29, c: 15 } : { h: 6, c: 5 });
  const W = (p: { x: number; y: number }) => ap2(M, s.x + p.x * s.esc * s.dir, s.y + p.y * s.esc);
  const zM = Math.hypot(M[0], M[1]);
  const e = extrasCabeza(look);
  const hy = j.cabeza.y + (frontal ? 14 : 4);
  const c = W({ x: j.cabeza.x, y: hy });
  const k = s.esc * zM;
  const R = H.cabezaR * k;
  const cab: Cab = { x: c.x, y: c.y, r: R, hx0: c.x - (H.cabezaR + e.lado) * k, hx1: c.x + (H.cabezaR + e.lado) * k, hy0: c.y - (H.cabezaR + e.arriba) * k, hy1: c.y + H.cabezaR * k, esc: k };
  const segBrazo = (B: typeof j.bD, lado: "D" | "I"): Cap[] => {
    const o = W(B.o), cd = W(B.codo), m = W(B.mano);
    // el brazo (hombro→codo) se mide desde el 55 %: el hombro está siempre bajo el mentón
    const o2 = { x: o.x + (cd.x - o.x) * 0.55, y: o.y + (cd.y - o.y) * 0.55 };
    const out: Cap[] = [{ x1: o2.x, y1: o2.y, x2: cd.x, y2: cd.y, w: 9 * k }, { x1: cd.x, y1: cd.y, x2: m.x, y2: m.y, w: 9 * k }];
    const herr = lado === "D" ? r.chD : r.chI;
    const loc = herr ? herrCap(herr) : caps.get(r.id + lado) ?? [];
    const A_ = rad(B.angAnte);
    // marco de la mano (translate(mano) rotate(-angAnte)) → local del personaje
    const hm = (hx: number, hy2: number) => W({ x: B.mano.x + hx * Math.cos(A_) + hy2 * Math.sin(A_), y: B.mano.y - hx * Math.sin(A_) + hy2 * Math.cos(A_) });
    for (const q of loc) { const p1 = hm(q.x1, q.y1), p2 = hm(q.x2, q.y2); out.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, w: q.w * k, obj: true }); }
    return out;
  };
  const bD = segBrazo(j.bD, "D"), bI = segBrazo(j.bI, "I");
  // palo: el brazo de ADELANTE (D) y lo que lleva se dibujan DESPUÉS de la cabeza → pueden tapar la propia cara.
  // frijol/frontal: los dos brazos van antes de la cabeza.
  const propios = frontal ? [] : bD;
  return { cab, propios, todos: [...bI, ...bD], rel: { x: j.cabeza.x * s.dir * s.esc, y: hy * s.esc }, op: r.a.opacidad ? r.a.opacidad(f) : 1 };
};
// ¿la cápsula toca la cabeza (círculo r·kc + caja del sombrero/gorro)?
const tocaCab = (cb: Cab, s: Cap, kc: number, marg: number) => {
  if (distSeg(cb.x, cb.y, { ...s, frente: true }) < cb.r * kc + s.w / 2 + marg) return true;
  const top = cb.hy0, bot = cb.y - cb.r * 0.45;
  if (bot - top < 4) return false;
  const n = Math.max(2, Math.ceil(Math.hypot(s.x2 - s.x1, s.y2 - s.y1) / 5));
  const h = s.w * 0.25 + marg * 0.5;
  for (let i = 0; i <= n; i++) {
    const x = s.x1 + ((s.x2 - s.x1) * i) / n, y = s.y1 + ((s.y2 - s.y1) * i) / n;
    if (x > cb.hx0 - h && x < cb.hx1 + h && y > top - h && y < bot + h) return true;
  }
  return false;
};
// dos cabezas se enciman: círculos que se pisan, o el ala/gorro de una sobre la cabeza de la otra
const cajasSeTocan = (a: Cab, b: Cab) => {
  if (Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r - 2) return true;
  const sobre = (p: Cab, q: Cab) => q.x + q.r * 0.85 > p.hx0 && q.x - q.r * 0.85 < p.hx1 && q.y + q.r * 0.85 > p.hy0 && q.y - q.r * 0.85 < p.y - p.r * 0.45;
  return sobre(a, b) || sobre(b, a);
};

type Info = { M: Mat; orden: number; capa1: boolean };
const nombreLook = (look: ActorProps["look"], i: number) => {
  const acc = (look.accesorios ?? []) as { t: string }[];
  const sb = acc.find((q) => q.t === "sombrero") ? " sombrero" : acc.find((q) => q.t === "gorroLana") ? " gorro" : acc.find((q) => q.t === "gorra") ? " gorra" : "";
  return `#${i}[${look.camisa ?? "?"}${sb}${look.alto && look.alto < 0.9 ? " niño" : ""}]`;
};
const informeEscena = (regs: RegA[], info: Map<string, Info>, caps: Map<string, Cap[]>, f0: number, f1: number, claves?: Clave[]) => {
  const res = new Map<string, [number, number, number]>();
  const add = (k: string, f: number) => { const v = res.get(k); res.set(k, v ? [v[0], f, v[2] + 1] : [f, f, 1]); };
  const R = [...regs].sort((a, b) => (info.get(a.id)?.orden ?? 0) - (info.get(b.id)?.orden ?? 0));
  const nom = (r: RegA, i: number) => r.nombre ?? nombreLook(r.a.look, i);
  const grupo = R.length >= 3;
  let prev: GeoA[] | null = null;
  for (let f = f0; f <= f1; f++) {
    const G = R.map((r) => geoActor(r, f, info.get(r.id)?.M ?? [1, 0, 0, 1, 0, 0], caps));
    G.forEach((g, i) => {
      if (g.op < 0.03) return;
      if (g.op < 0.97) add(`fundido: ${nom(R[i], i)}`, f);
      const pr = g.propios.filter((s) => tocaCab(g.cab, s, 0.8, 0));
      if (pr.length) add(`tapa: ${nom(R[i], i)} x su propio ${pr.some((s) => s.obj) ? "OBJETO" : "brazo"}`, f);
      G.forEach((h, k) => {
        if (k <= i || h.op < 0.03) return;
        const ot = h.todos.filter((s) => tocaCab(g.cab, s, 0.95, 3));
        if (ot.length) add(`tapa: ${nom(R[i], i)} x ${ot.some((s) => s.obj) ? "OBJETO" : "brazo"} de ${nom(R[k], k)}`, f);
        if (cajasSeTocan(g.cab, h.cab)) add(`junto: ${nom(R[i], i)} x ${nom(R[k], k)}`, f);
      });
      if (prev && prev[i] && f > f0) {
        const p = prev[i];
        const dRel = Math.hypot(g.rel.x - p.rel.x, g.rel.y - p.rel.y), dAbs = Math.hypot(g.cab.x - p.cab.x, g.cab.y - p.cab.y);
        if (dRel > 20 * g.cab.esc || dAbs > 70 * Math.max(1, g.cab.esc)) add(`salto: ${nom(R[i], i)}`, f);
      }
      if (grupo && claves && info.get(R[i].id)?.capa1) {
        const cy = (g.cab.hy0 + g.cab.hy1) / 2;
        const p = enPantalla(claves, f, 30, g.cab.x, cy);
        const z = Math.abs((enPantalla(claves, f, 30, g.cab.x + 100, cy).x - p.x) / 100);
        const hw = ((g.cab.hx1 - g.cab.hx0) / 2) * z, hh = ((g.cab.hy1 - g.cab.hy0) / 2) * z;
        if (p.x - hw < 0 || p.x + hw > 1920 || p.y - hh < 0 || p.y + hh > 1080) add(`borde: ${nom(R[i], i)}`, f);
      }
    });
    prev = G;
  }
  return [...res.entries()].map(([k, [a, b, n]]) => `${k}  f${a}-${b} (${n})`);
};

// sin lib "dom" en el tsconfig: todo lo del navegador va por `any`
/* eslint-disable @typescript-eslint/no-explicit-any */
const G_: any = globalThis;
// ---- medición en el DOM (cuadro actual) ----
const matDe = (m: any): Mat => (m ? [m.a, m.b, m.c, m.d, m.e, m.f] : [1, 0, 0, 1, 0, 0]);
const medirCaps = (g: any): Cap[] => {
  const base = g.getCTM();
  if (!base) return [];
  const inv = base.inverse();
  const out: Cap[] = [];
  g.querySelectorAll("path,rect,circle,ellipse,line,polygon,polyline,text,image").forEach((el: any) => {
    const e = el as any;
    let bb: any;
    try { bb = e.getBBox(); } catch { return; }
    if (bb.width + bb.height < 3) return;
    const ctm = e.getCTM();
    if (!ctm) return;
    const m = inv.multiply(ctm);
    const P = (x: number, y: number) => new G_.DOMPoint(x, y).matrixTransform(m);
    const q = [P(bb.x, bb.y), P(bb.x + bb.width, bb.y), P(bb.x + bb.width, bb.y + bb.height), P(bb.x, bb.y + bb.height)];
    const L1 = Math.hypot(q[1].x - q[0].x, q[1].y - q[0].y), L2 = Math.hypot(q[2].x - q[1].x, q[2].y - q[1].y);
    const mid = (a: any, b: any) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    const [p1, p2, w] = L1 >= L2 ? [mid(q[0], q[3]), mid(q[1], q[2]), L2] : [mid(q[0], q[1]), mid(q[3], q[2]), L1];
    out.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, w });
  });
  return out;
};
const opacEf = (el: any, cache: Map<any, number>): number => {
  if (!el || el === G_.document.body || el === G_.document.documentElement) return 1;
  const c = cache.get(el);
  if (c !== undefined) return c;
  const cs = G_.getComputedStyle(el);
  let o = cs.display === "none" || cs.visibility === "hidden" ? 0 : parseFloat(cs.opacity || "1");
  if (el instanceof G_.SVGElement && el.tagName !== "g" && el.tagName !== "svg") {
    const fo = parseFloat(el.getAttribute("fill-opacity") ?? "1");
    const fill = el.getAttribute("fill");
    const conTrazo = el.getAttribute("stroke") && el.getAttribute("stroke") !== "none";
    if (fill === "none" && !conTrazo) o = 0;
    else if (!isNaN(fo) && !conTrazo) o *= fo;
  }
  const v = o * opacEf(el.parentElement, cache);
  cache.set(el, v);
  return v;
};
const describe = (el: any) => {
  const tx = (el.textContent ?? "").trim().slice(0, 24);
  if (tx && (el.tagName === "DIV" || el.tagName === "SPAN" || el.tagName === "text")) return `texto «${tx}»`;
  return `${el.tagName}${el.getAttribute("fill") ? " " + el.getAttribute("fill") : ""}`;
};

type Res = { fG: number; todo: string[]; ahora: string[]; marcas: { x: number; y: number; r: number; mal: boolean }[]; segs?: number[][]; cajas?: number[][] };
const Informe: React.FC<{ nombre: string; dur: number; ctx: CtxChk }> = ({ nombre, dur, ctx }) => {
  const fG = useCurrentFrame();
  const f = useF();
  const [r, setR] = useState<Res | null>(null);
  const refSvg = useRef<any>(null);
  const mandado = useRef(-1);
  useLayoutEffect(() => {
    if (r && r.fG === fG) return;
    const h = delayRender(`chequeo ${nombre}`);
    let res: Res;
    const base = refSvg.current.getBoundingClientRect(), kx = 1920 / base.width, ky = 1080 / base.height;
    // Chrome calcula mal getBoundingClientRect de lo SVG dentro de una Capa (ignora el transform-origin del zoom):
    // la cámara se lee del style de la Capa (translate + scale alrededor del centro) y se compone con getCTM.
    const capaDe = (el: any) => {
      for (let e = el.parentElement; e; e = e.parentElement) {
        const t = e instanceof G_.HTMLElement ? e.style.transform : "";
        const m = t && /translate\(([-\d.e]+)px,\s*([-\d.e]+)px\).*scale\(([-\d.e]+)\)/.exec(t);
        if (m) return { tx: +m[1], ty: +m[2], s: +m[3] };
      }
      return null;
    };
    const rel = (n: any) => {
      const M = n.getCTM(), c = capaDe(n);
      if (!M) return null;
      const C = c ?? { tx: 0, ty: 0, s: 1 };
      return { a: C.s * M.a, b: C.s * M.b, c: C.s * M.c, d: C.s * M.d, e: 960 + C.tx + C.s * (M.e - 960), f: 540 + C.ty + C.s * (M.f - 540) };
    };
    const cajaPantalla = (el: any) => {
      const c = el instanceof G_.SVGGraphicsElement ? capaDe(el) : null;
      if (c) {
        let bb: any;
        try { bb = el.getBBox(); } catch { bb = null; }
        const m = rel(el);
        if (bb && m) {
          const xs: number[] = [], ys: number[] = [];
          [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].forEach(([x, y]) => { xs.push(m.a * x + m.c * y + m.e); ys.push(m.b * x + m.d * y + m.f); });
          const l = Math.min(...xs), r2 = Math.max(...xs), t = Math.min(...ys), bo = Math.max(...ys);
          return { left: l, right: r2, top: t, bottom: bo, width: r2 - l, height: bo - t };
        }
      }
      const b = el.getBoundingClientRect();
      return { left: (b.left - base.left) * kx, right: (b.right - base.left) * kx, top: (b.top - base.top) * ky, bottom: (b.bottom - base.top) * ky, width: b.width * kx, height: b.height * ky };
    };
    try {
      const regs = [...ctx.actores.values()].filter((q) => q.fG === fG);
      const info = new Map<string, Info>();
      const orden = regs.map((q, i) => ({ n: G_.document.querySelector(`[data-cha="${q.id}"]`) as any, i })).filter((q) => q.n);
      orden.sort((a, b) => (a.n!.compareDocumentPosition(b.n!) & 4 ? -1 : 1));
      const claves = ctx.claves;
      orden.forEach((q, k) => {
        const n = q.n!;
        const M = matDe(n.getCTM());
        // ¿está en la capa del mundo (z=1)? su origen en pantalla tiene que coincidir con enPantalla
        let capa1 = false;
        const sc = rel(n);
        if (claves && sc) {
          const o = ap2(M, 0, 0), p = enPantalla(claves, f, 30, o.x, o.y), ps = { x: sc.e, y: sc.f };
          capa1 = Math.abs(ps.x - p.x) < 40 && Math.abs(ps.y - p.y) < 40;
        }
        info.set(regs[q.i].id, { M, orden: k, capa1 });
        for (const lado of ["D", "I"]) {
          const g = n.querySelector(`[data-chm="${regs[q.i].id + lado}"]`) as any;
          if (g) ctx.caps.set(regs[q.i].id + lado, medirCaps(g));
        }
      });
      const todo = orden.length ? informeEscena(regs.filter((q) => info.has(q.id)), info, ctx.caps, 0, dur - 1, claves) : [];
      // cuadro actual en pantalla: cabeza (círculo + caja) contra todo lo que se dibuja DESPUÉS del actor
      const cache = new Map<any, number>();
      const ahora: string[] = [];
      const marcas: Res["marcas"] = [];
      const segs: number[][] = [], cajas: number[][] = [];
      const hojas = Array.from(G_.document.querySelectorAll("path,rect,circle,ellipse,line,polygon,polyline,text,image,div,span")).filter((el: any) => {
        if (el.closest("[data-chk-informe]") || el.closest("[data-cha]")) return false;
        if (el.tagName === "DIV" || el.tagName === "SPAN") return Array.from(el.childNodes).some((c: any) => c.nodeType === 3 && (c.textContent ?? "").trim());
        return true;
      });
      const cajasH = hojas.map(cajaPantalla);
      orden.forEach((q) => {
        const n = q.n!, reg = regs[q.i];
        const sc = rel(n);
        if (!sc) return;
        const g = geoActor(reg, f, [1, 0, 0, 1, 0, 0], ctx.caps);
        const opn = opacEf(n, cache);
        if (g.op < 0.03 || opn < 0.05) return;
        const P = (x: number, y: number) => ({ x: sc.a * x + sc.c * y + sc.e, y: sc.b * x + sc.d * y + sc.f });
        const c = P(g.cab.x, g.cab.y), rr = g.cab.r * Math.hypot(sc.a, sc.b);
        const pts: { x: number; y: number }[] = [];
        for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) if (a * a + b * b <= 9) pts.push({ x: c.x + (a / 3) * rr * 0.9, y: c.y + (b / 3) * rr * 0.9 });
        const t0 = P(g.cab.hx0, g.cab.hy0), t1 = P(g.cab.hx1, g.cab.y - g.cab.r * 0.45);
        if (Math.abs(t1.y - t0.y) > 6) for (let a = 0; a <= 4; a++) for (let b = 0; b <= 2; b++) pts.push({ x: t0.x + ((t1.x - t0.x) * a) / 4, y: t0.y + ((t1.y - t0.y) * b) / 2 });
        let mal = false;
        const enCuadro = c.x > -rr && c.x < 1920 + rr && c.y > -rr && c.y < 1080 + rr;
        if (enCuadro) hojas.forEach((el: any, i: number) => {
          if (!(n.compareDocumentPosition(el) & 4)) return;
          const bb = cajasH[i];
          const area = bb.width * bb.height;
          if (area > 1920 * 1080 * 0.25 || area < 40) return;
          const cub = pts.filter((p: { x: number; y: number }) => p.x >= bb.left && p.x <= bb.right && p.y >= bb.top && p.y <= bb.bottom).length;
          if (cub / pts.length < 0.12) return;
          if (opacEf(el, cache) < 0.35) return;
          mal = true;
          ahora.push(`encima: ${describe(el)} sobre ${reg.nombre ?? nombreLook(reg.a.look, info.get(reg.id)?.orden ?? 0)}`);
        });
        if (enCuadro) marcas.push({ x: c.x, y: c.y, r: rr, mal });
        if (enCuadro) { segs.push(...g.todos.map((q2) => { const a1 = P(q2.x1, q2.y1), a2 = P(q2.x2, q2.y2); return [a1.x, a1.y, a2.x, a2.y, q2.w * Math.hypot(sc.a, sc.b), q2.obj ? 1 : 0]; })); cajas.push([t0.x, t0.y, t1.x, t1.y]); }
      });
      res = { fG, todo, ahora: [...new Set(ahora)], marcas, segs, cajas };
    } catch (e) {
      res = { fG, todo: [`ERROR chequeo: ${String(e)}`], ahora: [], marcas: [] };
    }
    setR(res);
    if (mandado.current !== fG) {
      mandado.current = fG;
      G_.fetch("http://127.0.0.1:18744/", { method: "POST", mode: "no-cors", body: JSON.stringify({ esc: nombre, fL: f, n: ctx.actores.size, todo: res.todo, ahora: res.ahora, marcas: res.marcas.map((m) => [Math.round(m.x), Math.round(m.y), Math.round(m.r)]) }) })
        .catch(() => undefined).finally(() => continueRender(h));
    } else continueRender(h);
  });
  const malas = r ? r.todo.length + r.ahora.length : 0;
  const lineas = !r ? [] : [`CHEQUEO ${nombre} f${f} · ${malas ? malas + " avisos" : "OK"}`, ...r.todo.slice(0, 14), ...r.ahora.slice(0, 6)];
  return (
    <div data-chk-informe="1" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, zIndex: 999, pointerEvents: "none" }}>
      <svg ref={refSvg} width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
        {r?.segs?.map((q, i) => <line key={`s${i}`} x1={q[0]} y1={q[1]} x2={q[2]} y2={q[3]} stroke={q[5] ? "#00e5ff" : "#ff00ff"} strokeWidth={Math.max(3, q[4])} strokeOpacity={0.45} strokeLinecap="round" />)}
        {r?.cajas?.map((q, i) => <rect key={`c${i}`} x={Math.min(q[0], q[2])} y={Math.min(q[1], q[3])} width={Math.abs(q[2] - q[0])} height={Math.abs(q[3] - q[1])} fill="none" stroke="#ffee00" strokeWidth={3} />)}
        {r?.marcas.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={m.r} fill="none" stroke={m.mal ? "#ff1a1a" : "#22ff66"} strokeWidth={5} />)}
      </svg>
      <div style={{ position: "absolute", left: 8, bottom: 8, width: 1900, fontFamily: "monospace", fontSize: 24, color: malas ? "#ff9090" : "#80ff80", background: "rgba(0,0,0,0.72)", whiteSpace: "pre-wrap" }}>
        {lineas.join(String.fromCharCode(10))}
      </div>
    </div>
  );
};

export const Chk: React.FC<{ nombre: string; dur: number; children: React.ReactNode }> = ({ nombre, dur, children }) => {
  const ref = useRef<CtxChk | null>(null);
  if (!ref.current) ref.current = { actores: new Map(), nombre, caps: new Map() };
  if (!activo()) return <>{children}</>;
  return (
    <ChkCtx.Provider value={ref.current}>
      {children}
      <Informe nombre={nombre} dur={dur} ctx={ref.current} />
    </ChkCtx.Provider>
  );
};
// envuelve cada plano de la lista: E<n> con n = n0 + índice; `fin` = segundo en que termina el último plano
export const conChk = (lista: [number, React.ReactNode, PlanoM["trans"]?][], n0: number, fin: number): [number, React.ReactNode, PlanoM["trans"]?][] =>
  lista.map(([s, el, tr], i) => {
    const s1 = i + 1 < lista.length ? lista[i + 1][0] : fin;
    return [s, <Chk key={i} nombre={`E${String(n0 + i).padStart(2, "0")}`} dur={Math.round(s1 * 30) - Math.round(s * 30)}>{el}</Chk>, tr];
  });
