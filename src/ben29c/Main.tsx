// ben29 · MOTOR de los videos de Benito: UN mundo (panaderia3d) + UNA cámara (plan.ts) + fotos/tomas reales
// + el avatar en sus ventanas pagadas (avwin.json) con CORTE SECO (sin portal/iris/latigazo/zoom) + el componente
// único del minuto (heroes.tsx) en los huecos sin avatar. Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import PLAN from "./plan_t.json";
import { P, Portal, Vid, e, ei, s } from "./lib";
import { PT, World, screenOf } from "./panaderia3d";
import { BEATS } from "./plan";
import { MAP } from "./heroes";
import type { H } from "./ckit";

const PL = PLAN as { end: number; heroes?: H[] };
// un bloque con pulse (los 5 errores) aparece sólo alrededor de cada ítem, con su propia entrada
const HS: H[] = (PL.heroes ?? []).flatMap((x) => x.pulse ? (x.items as { a: number }[]).map((i) => ({ ...x, at: i.a - 0.6, out: i.a + x.pulse })) : [x]);
export const END = PL.end;
export const FULL_FRAMES = s(END);
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
const CDUR = ((AVAIL as { dur?: Record<string, number> }).dur ?? {}) as Record<string, number>;
const AW = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
// sin reel todavía (RunPod sin saldo): las ventanas del avatar muestran el mundo; nunca una cara fija en el repo público
const enAv = (t: number) => REEL && AW.some((w) => t >= w.ms && t < w.me);

// ---------- avatar: nítido, sin halo ni borde; el video queda montado un poco antes (preroll) y se ve sólo en su ventana ----------
const AvatarR: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000", opacity: enAv(t) ? 1 : 0 }}>
    {REEL ? AW.map((w, i) => (
      <Sequence key={i} from={Math.max(0, s(w.ms) - 15)} durationInFrames={s(w.me - w.ms) + 30} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - Math.min(15, s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>))
      : null}
  </AbsoluteFill>
);

// toma (clip si ya está, si no la foto) con empuje lento + balanceo de cámara en mano (CamaraMano lenta)
const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.04, 1.14], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const hx = 7 * Math.sin(t * 0.43 + a), hy = 5 * Math.sin(t * 0.61 + a * 2), hr = 0.35 * Math.sin(t * 0.37 + a);
  const cd = CDUR[k] ?? 5;
  return <AbsoluteFill style={{ transform: `scale(${sc + 0.012}) translate(${ox * q + hx}px,${oy * q + hy}px) rotate(${hr}deg)` }}><Vid id={"img_" + k} />{CLIPS.has(k) && <AbsoluteFill style={{ opacity: 1 - e(t, a + cd - 0.45, a + cd - 0.1) }}><Sequence from={s(a)} durationInFrames={Math.max(1, s(cd - 0.1))} layout="none"><Vid id={k} /></Sequence></AbsoluteFill>}</AbsoluteFill>;
};
const Whip: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: 1 | -1 }> = ({ t, a, b, from, to, dir = 1 }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 42;
  const f = mb > 1 ? `blur(${mb}px)` : undefined;
  return <>
    {k < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: f }}>{from}</AbsoluteFill>}
    {k > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: f }}>{to}</AbsoluteFill>}
  </>;
};

// ---------- capa de planos (mundo / toma): entre b-roll sí hay transición propia (portal desde el objeto, latigazo) ----------
const beatAt = (t: number) => { let i = -1; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++; return Math.max(0, i); };
const plano = (i: number, t: number): React.ReactNode => {
  const b = BEATS[i], nx = BEATS[i + 1]?.a ?? b.a + 8;
  return b.kind === "w" ? <World t={t} /> : <Shot k={b.arg} t={t} a={b.a} dur={Math.max(3, nx - b.a)} z={i % 2 ? [1.03, 1.13] : [1.12, 1.03]} ox={i % 3 === 0 ? -30 : 20} />;
};
const foco = (arg: string) => arg.startsWith("oven") || arg.startsWith("pot") ? PT.dome : arg.startsWith("bowl") ? PT.bowl : arg.startsWith("loaf") ? PT.loaf : PT.prod;
const Planos: React.FC<{ t: number }> = ({ t }) => {
  const i = beatAt(t), b = BEATS[i];
  if (i === 0 || t - b.a > 0.6) return <>{plano(i, t)}</>;
  const pv = BEATS[i - 1];
  if (b.kind === "w" && pv.kind === "w") return <>{plano(i, t)}</>; // la cámara vuela: no hay corte
  if (b.kind === "i" && pv.kind === "w") { const c = screenOf(Math.max(t, b.a), foco(pv.arg)); return <>{plano(i - 1, t)}<Portal x={c.x} y={c.y} r={ei(t, b.a - 0.05, b.a + 0.5)} ring={0.5}>{plano(i, t)}</Portal></>; }
  if (b.kind === "w" && pv.kind === "i") return <Whip t={t} a={b.a - 0.2} b={b.a + 0.25} from={plano(i - 1, t)} to={plano(i, t)} dir={i % 2 ? 1 : -1} />;
  return <>{plano(i, t)}</>; // foto → foto: corte limpio (las dos tomas se mueven distinto)
};

// ---------- el avatar entra y sale con CORTE SECO ----------
const Capa: React.FC<{ t: number }> = ({ t }) => <>{!enAv(t) && <Planos t={t} />}<AvatarR t={t} /></>;

export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [<Capa key="capa" t={t} />];
  // componente único del minuto: tapa el mundo/las tomas (nunca al avatar)
  const hh = !enAv(t) ? HS.find((x) => t >= x.at - 0.05 && t <= x.out + 0.85) : undefined;
  if (hh) { const Co = MAP[hh.k]; if (Co) { L.splice(0); L.push(<Co key={"h" + hh.k} t={t} h={hh} />); } }
  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};
