// ctrolla · EL VIDEO ENTERO (0 → END) en un solo hilo: avatar (ventanas pagadas de avwin.json) ↔ planos.
// Los planos (planos.tsx) se anclan a la VOZ con at("frase"): foto/clip agnes · el laboratorio 3D (una sola cámara, CAM2) ·
// "tablero" (el laboratorio desenfocado detrás de una pieza). Entre planos nunca hay corte seco: portal, latigazo, subida o zoom
// a través. Si un plano cae dentro de una ventana del avatar, arranca al salir el avatar (y el avatar sale CON ese movimiento).
// Las piezas (FX) viven aparte, cada una con su frase de entrada y de salida. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EV0, Ev, KitchenWorld, makeCam, Key } from "./cocina3d";
import { ei, Portal } from "./lib";
import { Avatar, Shot, WIN } from "./base";
import { BEATS, FXS, END, Beat, Via, CAMSTART } from "./planos";

export { END };
const TR = 0.32;

// ---------- el laboratorio: una cámara, keyframes de todos los planos 3D ----------
const BCAM = makeCam([{ t: 0, p: [-0.9, 2.3, 3.1], l: [0.3, 1.25, -0.6], fov: 44 }, { t: END + 5, p: [0.4, 2.0, 2.4], l: [0.4, 1.15, -0.8], fov: 40 }]);
const Board: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ filter: "blur(16px) brightness(.42) saturate(.8)", transform: "scale(1.06)" }}><KitchenWorld t={t} ev={{ ...EV0, day: 0.75 }} cam={BCAM} /></AbsoluteFill>
);

// inicio efectivo de cada plano: el que cae dentro de una ventana del avatar arranca al salir el avatar;
// si dos planos quedan pegados (<0,8 s) se queda el último (nunca un destello)
type B2 = Beat & { s: number; afterAv: boolean };
const inWin = (a: number) => WIN.find((w) => a > w.ms - 0.2 && a < w.me);
const PL: B2[] = (() => {
  const xs = BEATS.map((b) => { const w = inWin(b.a); return { ...b, s: w ? w.me + 0.05 : b.a, afterAv: false } as B2; }).sort((x, y) => x.s - y.s);
  const out: B2[] = [];
  xs.forEach((b, i) => { if (i + 1 < xs.length && xs[i + 1].s - b.s < 0.8) return; out.push(b); });
  // el plano que sigue a cada ventana entra AL CERRARLA (si arrancaba unas décimas después, el avatar ya apagado dejaba negro)
  WIN.forEach((w) => { const b = out.find((x) => x.s >= w.ms); if (b && b.s > w.me + 0.05) b.s = w.me + 0.05; });
  // ¿entre el plano anterior y éste hubo una ventana del avatar? → éste sale del avatar
  out.forEach((b, i) => { const p0 = i ? out[i - 1].s : -1; b.afterAv = WIN.some((w) => w.me > p0 && w.me <= b.s + 0.06); });
  return out;
})();

let CAM2: ReturnType<typeof makeCam>;
{
  const K: Key[] = [{ t: 0, ...CAMSTART }];
  PL.forEach((b, k) => {
    if (!b.w) return;
    const end = k + 1 < PL.length ? PL[k + 1].s : END;
    K.push({ t: b.s - TR - 0.3, ...b.w.A });
    (b.w.keys ?? []).forEach(([kt, P]) => K.push({ t: kt, ...P }));
    if (b.w.B) K.push({ t: end + 0.4, ...b.w.B });
  });
  K.sort((a, b) => a.t - b.t);
  // keyframes repetidos en el mismo instante rompen la interpolación
  CAM2 = makeCam(K.filter((k, i) => i === 0 || k.t - K[i - 1].t > 0.02));
}
export const scr = (t: number, q: [number, number, number]) => CAM2.screenOf(t, q);
const World2: React.FC<{ t: number; ev: Partial<Ev> }> = ({ t, ev }) => {
  const v0 = CAM2.camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb2" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><KitchenWorld t={t} ev={{ ...EV0, day: 0.8, ...ev }} cam={CAM2} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const ptOf = (t: number, q: Beat["q"]) => (!q ? { x: 960, y: 540 } : q.length === 3 ? scr(t, q as [number, number, number]) : { x: q[0], y: q[1] });

const node = (b: B2, t: number): React.ReactNode =>
  b.w ? <World2 t={t} ev={b.w.ev(t)} /> : b.board ? <><Board t={t} />{b.c?.(t)}</> : b.c ? b.c(t) : <Shot k={b.k!} t={t} a={b.s} z={b.z} />;

const VIA = (via: Via, p: number, prev: React.ReactNode, cur: React.ReactNode, pt: { x: number; y: number }, key: string, nb = false): React.ReactNode[] => {
  // nb = el plano que sale es el avatar → nunca se desenfoca (creador, 21-oct)
  const q = Math.sin(p * Math.PI), bl = (px: number) => (nb || px <= 0.5 ? undefined : `blur(${px}px)`);
  if (via === "portal") return [<AbsoluteFill key={key + "p"}>{prev}</AbsoluteFill>, <Portal key={key + "c"} x={pt.x} y={pt.y} r={p}>{cur}</Portal>];
  if (via === "zoom") return [
    <AbsoluteFill key={key + "c"} style={{ transform: `scale(${1.25 - 0.25 * p})`, filter: q > 0.05 ? `blur(${q * 14}px)` : undefined }}>{cur}</AbsoluteFill>,
    <AbsoluteFill key={key + "p"} style={{ opacity: 1 - p, transformOrigin: `${pt.x}px ${pt.y}px`, transform: `scale(${1 + p * p * 5})`, filter: bl(p * 18) }}>{prev}</AbsoluteFill>];
  if (via === "rise") return [
    <AbsoluteFill key={key + "p"} style={{ transform: `translateY(${-p * 500}px)`, filter: bl(q * 20) }}>{prev}</AbsoluteFill>,
    <AbsoluteFill key={key + "c"} style={{ transform: `translateY(${(1 - p) * 1080}px)`, filter: q > 0.05 ? `blur(${q * 26}px)` : undefined }}>{cur}</AbsoluteFill>];
  return [
    <AbsoluteFill key={key + "p"} style={{ transform: `translateX(${-p * 700}px)`, filter: bl(q * 30) }}>{prev}</AbsoluteFill>,
    <AbsoluteFill key={key + "c"} style={{ transform: `translateX(${(1 - p) * 1920}px)`, filter: q > 0.05 ? `blur(${q * 36}px)` : undefined }}>{cur}</AbsoluteFill>];
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  // plano vigente (el que ya empezó a entrar)
  let i = -1; for (let k = 0; k < PL.length; k++) if (t >= PL[k].s - TR) i = k;
  const w = WIN.find((x) => t >= x.ms - 0.15 && t < x.me);
  // avatar entero: la ventana ya abrió y el plano vigente es ANTERIOR a ella (el que sigue entra al cerrar la ventana)
  const avFull = w && t >= w.ms + 0.4 && (i < 0 || PL[i].s - TR < w.ms);
  if (i < 0 || avFull) {
    L.push(<Avatar key="av" t={t} />);
  } else {
    const b = PL[i], p = ei(t, b.s - TR, b.s + 0.06);
    const wo = WIN.find((x) => x.me <= b.s + 0.06 && x.me > b.s - 1);
    const prev = b.afterAv ? <Avatar t={Math.min(t, b.s - 0.01, wo ? wo.me - 0.04 : 1e9)} /> : i > 0 ? node(PL[i - 1], t) : <Avatar t={t} />;
    const cur = node(b, t);
    if (p >= 1) L.push(<AbsoluteFill key={"b" + i}>{cur}</AbsoluteFill>);
    else VIA(b.via ?? "whip", p, prev, cur, ptOf(t, b.q), "b" + i, b.afterAv).forEach((x) => L.push(x));
    // entrada al avatar: portal desde el punto de salida del plano
    if (w && t < w.ms + 0.4) {
      const r = ei(t, w.ms - 0.15, w.ms + 0.4);
      const o = ptOf(t, b.out ?? (b.w ? [0.55, 1.02, 0.25] : [960, 540]));
      L.push(<Portal key={"po" + w.ms} x={o.x} y={o.y} r={r}><Avatar t={Math.max(w.ms, t)} /></Portal>);
    }
  }
  // piezas
  FXS.forEach((fx, k) => { if (t >= fx.a - 0.2 && t < fx.b + 0.6) L.push(<React.Fragment key={"f" + k}>{fx.n(t)}</React.Fragment>); });
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
