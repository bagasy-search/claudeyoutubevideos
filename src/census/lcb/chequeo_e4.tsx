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
const activo = () => !!(getInputProps() as { chequeo?: number }).chequeo;

// marcas en el MUNDO (va dentro de `medio`, después de los actores): círculo verde = cabeza libre, rojo = tapada/cortada
export const Chequeo: React.FC<{ items: ItemCh[]; sep?: number; claves?: Clave[] }> = ({ items, sep = 140, claves }) => {
  const f = useF();
  if (!activo()) return null;
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
  if (!activo()) return null;
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
