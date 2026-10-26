// Actor: el personaje manejado por una línea de tiempo (ruta, poses, caras, mirada).
// Camina SOLO cuando se mueve: la fase del ciclo sale de la distancia recorrida (los pies no patinan) y el peso
// de la caminata sale de la velocidad (arranca y frena con naturalidad). La dirección se da vuelta sola.
import React from "react";
import { Easing, interpolate, useVideoConfig } from "remotion";
import { useF } from "./camara";
import {
  ClaveT, Expr, EXPRESIONES, huesosDe, Look, LuzP, Pose, Personaje, ZANCADA, caminar, enTiempo, labios, mezclaExpr, mezclaPose, parpadear, pose,
} from "./personaje";

export type Paso = { f: number; x: number; y?: number; curva?: "inout" | "lineal" | "out" | "in" };
export type ActorProps = {
  look: Look;
  ruta: Paso[]; // posición de los pies en el mundo
  poses?: ClaveT<string | Partial<Pose>>[];
  caras?: ClaveT<string>[];
  miradas?: ClaveT<{ x: number; y: number }>[];
  giros?: ClaveT<number>[]; // giro de cara -1..1
  dir?: ClaveT<1 | -1>[]; // fuerza la dirección (si no, sale de la velocidad)
  habla?: [number, number][]; // tramos [desde, hasta] en que mueve la boca
  correr?: number; // 0 camina, 1 corre
  escala?: number; luz?: LuzP; sombra?: number; asiento?: ClaveT<number | undefined>[]; seed?: number;
  enManoD?: React.ReactNode | ((f: number) => React.ReactNode); enManoI?: React.ReactNode | ((f: number) => React.ReactNode);
  ajuste?: (p: Pose, f: number) => Pose; // retoque final (IK para agarrar algo, temblor de miedo…)
  opacidad?: (f: number) => number; // aparecer / desvanecerse (el demonio que se va)
  vivo?: number; // actuación de fondo (0 = apagada): gestos que se encadenan cuando la pose de la línea de tiempo no cambia
};

// ACTUACIÓN DE FONDO: nadie se queda tieso. Cada ~2 s un gesto (asiente, habla con la mano, se rasca, abre los brazos,
// cambia el peso) que entra y sale con curva. Sólo toca un brazo si está suelto (no pisa celular, volante ni manos a la cara).
const GESTOS: Partial<Pose>[] = [
  { cabeza: 12, tronco: 3 }, { hD: 40, cD: 55, cabeza: -5 }, { tronco: -6, cabeza: -8, hI: -14 }, { hD: 120, cD: 135, cabeza: 9 },
  { hI: -34, cI: 30, hD: 34, cD: 30, cabeza: -6 }, { cabeza: -12, tronco: 5 }, { hI: -40, cI: 60, cabeza: 6 }, { tronco: 7, hD: 22, cD: 80, hI: -20, cI: 70 },
];
const actuar = (p: Pose, f: number, seed: number, amp: number): Pose => {
  const per = 58 + ((seed * 13) % 17);
  const t = f + seed * 23;
  const n = Math.floor(t / per), u = (t % per) / per;
  const env = Math.pow(Math.sin(Math.PI * Math.min(1, u / 0.85)), 2) * amp;
  const g = GESTOS[(n * 5 + seed * 3) % GESTOS.length];
  const suelto = (h: number, c: number) => Math.abs(h) < 70 && c < 100;
  const q = { ...p };
  const ks = Object.keys(g) as (keyof Pose)[];
  for (const k of ks) {
    if ((k === "hD" || k === "cD") && !suelto(p.hD, p.cD)) continue;
    if ((k === "hI" || k === "cI") && !suelto(p.hI, p.cI)) continue;
    q[k] = (q[k] as number) + (g[k] as number) * env;
  }
  return q;
};

const curvas = { inout: Easing.inOut(Easing.cubic), lineal: (t: number) => t, out: Easing.out(Easing.cubic), in: Easing.in(Easing.cubic) };
export const posRuta = (ruta: Paso[], f: number) => {
  if (f <= ruta[0].f) return { x: ruta[0].x, y: ruta[0].y ?? 0, d: 0 };
  let d = 0;
  for (let i = 1; i < ruta.length; i++) {
    const a = ruta[i - 1], b = ruta[i];
    const ay = a.y ?? 0, byy = b.y ?? ay;
    const L = Math.hypot(b.x - a.x, byy - ay);
    if (f < b.f) {
      const u = interpolate(f, [a.f, b.f], [0, 1], { easing: curvas[b.curva ?? "inout"] });
      return { x: a.x + (b.x - a.x) * u, y: ay + (byy - ay) * u, d: d + L * u };
    }
    d += L;
  }
  const z = ruta[ruta.length - 1];
  return { x: z.x, y: z.y ?? ruta.slice().reverse().find((r) => r.y !== undefined)?.y ?? 0, d };
};

export const estadoActor = (a: ActorProps, f: number, fps: number) => {
  const esc = a.escala ?? 1;
  const r = posRuta(a.ruta, f);
  // velocidad suavizada (±3 cuadros) → peso de la caminata
  const v = (posRuta(a.ruta, f + 3).d - posRuta(a.ruta, f - 3).d) / 6;
  const correr = a.correr ?? (v > 7 * esc ? Math.min(1, (v - 7 * esc) / (4 * esc)) : 0);
  const w = Math.min(1, v / (1.6 * esc));
  const fase = r.d / (ZANCADA(correr, huesosDe(a.look.estilo, a.look.alto)) * esc);
  const base = a.poses ? enTiempo(a.poses.map((k) => ({ ...k, v: pose(k.v) })), f, fps, mezclaPose) : pose();
  const vivo = a.vivo ?? 1;
  const actuada = vivo > 0 && w < 0.5 ? actuar(base, f, a.seed ?? 0, vivo * (1 - w * 2)) : base;
  let p = w > 0.01 ? mezclaPose(actuada, caminar(fase, correr), w) : actuada;
  if (a.ajuste) p = a.ajuste(p, f);
  const e: Expr = a.caras ? enTiempo(a.caras.map((k) => ({ ...k, v: EXPRESIONES[k.v] })), f, fps, mezclaExpr, 150) : EXPRESIONES.neutral;
  // dirección: la fijada, o la del último movimiento
  let dir: 1 | -1 = 1;
  if (a.dir) dir = enTiempo(a.dir, f, fps, (x, y, t) => (t > 0.5 ? y : x));
  else {
    const dx = posRuta(a.ruta, f + 2).x - posRuta(a.ruta, f - 2).x;
    if (Math.abs(dx) > 0.2) dir = dx > 0 ? 1 : -1;
    else {
      // quieto: conserva la del último tramo con movimiento
      for (let i = a.ruta.length - 1; i > 0; i--) if (a.ruta[i].f <= f && a.ruta[i].x !== a.ruta[i - 1].x) { dir = a.ruta[i].x > a.ruta[i - 1].x ? 1 : -1; break; }
      if (f < a.ruta[0].f || a.ruta.every((q, i) => i === 0 || q.f > f)) {
        const sig = a.ruta.find((q, i) => i > 0 && q.x !== a.ruta[i - 1].x);
        if (sig) dir = sig.x > a.ruta[a.ruta.indexOf(sig) - 1].x ? 1 : -1;
      }
    }
  }
  const mirar = a.miradas ? enTiempo(a.miradas, f, fps, (x, y, t) => ({ x: x.x + (y.x - x.x) * t, y: x.y + (y.y - x.y) * t })) : { x: 0, y: 0 };
  const cara = a.giros ? enTiempo(a.giros, f, fps, (x, y, t) => x + (y - x) * t) : 0;
  const hablando = a.habla?.some(([d, h]) => f >= d && f < h) ? labios(f, a.seed ?? 0) : 0;
  const asiento = a.asiento ? enTiempo(a.asiento, f, fps, (x, y, t) => (y === undefined || x === undefined ? (t > 0.5 ? y : x) : x + (y - x) * t)) : undefined;
  return { x: r.x, y: r.y, p, e, dir, mirar, cara, habla: hablando, asiento, esc };
};

export const Actor: React.FC<ActorProps> = (a) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = estadoActor(a, f, fps);
  const mano = (m: ActorProps["enManoD"]) => (typeof m === "function" ? m(f) : m);
  return (
    <Personaje
      x={s.x} y={s.y} escala={s.esc} dir={s.dir} p={s.p} e={s.e} look={a.look} mirar={s.mirar} cara={s.cara}
      luz={a.luz} sombra={a.sombra} asiento={s.asiento} parpadeo={parpadear(f, a.seed ?? 0)} habla={s.habla}
      enManoD={mano(a.enManoD)} enManoI={mano(a.enManoI)}
      opacidad={a.opacidad ? a.opacidad(f) : 1}
    />
  );
};
