// FIGURANTES VIVOS: la gente del fondo respira, parpadea, cambia el peso de pie y MIRA LA ACCIÓN (cabeza, cara y pupilas
// siguen al punto que importa, con un retraso distinto cada uno, como gente de verdad). Nunca un muñeco congelado.
//   <Figurante look={LOOKS.awakenGorra} x={1900} piso={CALLE_PISO} escala={0.8} seed={3} atiende={(f) => ({ x: posRuta(ruta, f).x, y: 640 })} />
//   atiende: punto fijo {x,y}, claves [{f, v:{x,y}}] o función f → {x,y} (por ej. la posición del protagonista)
//   reacciones: [{ f: 90, cara: "sorpresa", pose: "manosCara" }] → el figurante reacciona a lo que pasa
// respirar(seed) → `ajuste` para un Actor que ya existe (le agrega respiración y cambio de peso sin tocar lo demás).
import React from "react";
import { useF } from "./camara";
import { ClaveT, enTiempo, EXPRESIONES, Look, LuzP, mezclaExpr, mezclaPose, parpadear, Personaje, Pose, pose, labios } from "./personaje";

type Punto = { x: number; y: number };
export type Atiende = Punto | ClaveT<Punto>[] | ((f: number) => Punto);
export type FiguranteProps = {
  look: Look; x: number; piso: number; escala?: number; seed?: number; luz?: LuzP; sombra?: number;
  pose?: string | Partial<Pose>; cara?: string; asiento?: number; // asiento = alto de la silla (sentado)
  atiende?: Atiende; retraso?: number; // cuadros que tarda en mirar (por defecto 6-14 según seed)
  reacciones?: { f: number; cara?: string; pose?: string | Partial<Pose> }[];
  habla?: [number, number][]; enManoD?: React.ReactNode; enManoI?: React.ReactNode; opacidad?: number;
};

const puntoEn = (a: Atiende | undefined, f: number): Punto | undefined => {
  if (!a) return undefined;
  if (typeof a === "function") return a(f);
  if (Array.isArray(a)) return enTiempo(a, f, 30, (p, q, t) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t }));
  return a;
};

// respiración + cambio de peso: senos lentos con fase propia (cada figurante respira a su ritmo)
export const respirar = (seed = 0, fuerza = 1) => (p: Pose, f: number): Pose => {
  const per = 104 + ((seed * 29) % 37), ph = seed * 1.9;
  const r = Math.sin((f / per) * Math.PI * 2 + ph), peso = Math.sin(f / (per * 2.7) + ph * 0.7);
  return {
    ...p,
    tronco: p.tronco + (r * 1.1 + peso * 1.4) * fuerza, cabeza: p.cabeza - r * 0.9 * fuerza,
    hI: p.hI + r * 2.2 * fuerza, hD: p.hD - r * 2.2 * fuerza, bajar: p.bajar + (r * 0.9 + 0.9) * fuerza,
    pI: p.pI + peso * 2 * fuerza, pD: p.pD + peso * 2 * fuerza,
  };
};

export const Figurante: React.FC<FiguranteProps> = (a) => {
  const f = useF();
  const seed = a.seed ?? 0;
  const esc = a.escala ?? 1;
  // reacciones encadenadas como claves de cara y de pose
  const caras: ClaveT<string>[] = [{ f: -999, v: a.cara ?? "neutral" }, ...(a.reacciones ?? []).filter((r) => r.cara).map((r) => ({ f: r.f, v: r.cara! }))];
  const poses: ClaveT<string | Partial<Pose>>[] = [{ f: -999, v: a.pose ?? {} }, ...(a.reacciones ?? []).filter((r) => r.pose).map((r) => ({ f: r.f, v: r.pose! }))];
  const e = enTiempo(caras.map((k) => ({ ...k, v: EXPRESIONES[k.v] ?? EXPRESIONES.neutral })), f, 30, mezclaExpr, 150);
  let p = enTiempo(poses.map((k) => ({ ...k, v: pose(k.v) })), f, 30, mezclaPose);
  p = respirar(seed)(p, f);
  // mirada con retraso: la cabeza llega tarde y con inercia (promedio de los últimos cuadros)
  const ret = a.retraso ?? 6 + (seed * 5) % 9;
  const head = { x: a.x, y: a.piso - 270 * esc };
  let dx = 0, dy = 0, n = 0;
  for (let k = 0; k < 6; k++) { const q = puntoEn(a.atiende, f - ret - k * 2); if (q) { dx += q.x - head.x; dy += q.y - head.y; n++; } }
  if (n) { dx /= n; dy /= n; }
  // micro-gesto ocasional: una inclinación de cabeza cada tanto (nunca todos a la vez)
  const gesto = Math.max(0, Math.sin(f / (70 + (seed % 5) * 13) + seed * 2.3) - 0.85) / 0.15;
  const base: 1 | -1 = seed % 2 ? -1 : 1;
  const dir: 1 | -1 = n ? (dx > 40 ? 1 : dx < -40 ? -1 : base) : base;
  const mirar = n ? { x: Math.max(-1, Math.min(1, dx / 380)), y: Math.max(-1, Math.min(1, dy / 420)) } : { x: Math.sin(f / 90 + seed) * 0.4, y: 0 };
  const cara = n ? Math.max(-0.8, Math.min(0.8, Math.abs(dx) / 600)) : 0.2;
  p = { ...p, cabeza: p.cabeza + (n ? Math.max(-10, Math.min(10, (dy / 420) * 10)) : 0) + gesto * 6 };
  const hablando = a.habla?.some(([d, h]) => f >= d && f < h) ? labios(f, seed) : 0;
  return (
    <Personaje x={a.x} y={a.piso} escala={esc} dir={dir} p={p} e={e} look={a.look} mirar={mirar} cara={cara} luz={a.luz} sombra={a.sombra}
      asiento={a.asiento} parpadeo={parpadear(f, seed + 3)} habla={hablando} enManoD={a.enManoD} enManoI={a.enManoI} opacidad={a.opacidad} />
  );
};

// varios figurantes de una: misma `atiende` para todos, cada uno con su seed (ritmos distintos)
export const Figurantes: React.FC<{ lista: Omit<FiguranteProps, "atiende">[]; atiende?: Atiende }> = ({ lista, atiende }) => (
  <g>{lista.map((fp, i) => <Figurante key={i} seed={i * 7 + 1} {...fp} atiende={atiende} />)}</g>
);
