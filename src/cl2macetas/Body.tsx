// cl2macetas · EL VIDEO ENTERO en un hilo. La línea de tiempo NO se calcula acá: la arma plan/tl.py una sola vez (tl.json),
// y de ese mismo archivo sale la cama de sonido de los Veo. Avatar ↔ cualquier cosa = corte seco; entre planos y piezas,
// empuje corto con desenfoque. Los CTA (QR) van encima de lo que haya.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Avatar, BgCtx, Clip, Foto, MIX, Stage } from "./base";
import { C, P, e } from "./lib";
import { Hilo, Cta } from "./hilo";
import * as K1 from "./comps1";
import * as K2 from "./comps2";
import * as K3 from "./comps3";
import TL from "./tl.json";
import FXJ from "./fx.json";

type Seg = { a: number; b: number; k: "av" | "fx" | "hilo" | "clip" | "img"; id: string };
type Fx = { id: string; c: string; a: number; b: number; m: Record<string, number>; k: string };
const T = TL as unknown as { end: number; segs: Seg[]; bg: Record<string, string> };
export const END = T.end;
const SEGS = T.segs;
const FX: Record<string, Fx> = Object.fromEntries((FXJ as unknown as { fx: Fx[] }).fx.map((f) => [f.id, f]));
const CTA = (FXJ as unknown as { cta: Fx[] }).cta;
const COMP = { ...K1, ...K2, ...K3 } as unknown as Record<string, React.FC<{ t: number; a: number; b: number; m: Record<string, number> }>>;
const CALIDO = new Set(["noche", "nieve", "lechosa", "nylon", "plato"]);
const TR = 0.28;

const node = (s: Seg, t: number): React.ReactNode => {
  if (s.k === "av") return <Avatar t={Math.min(Math.max(t, s.a), s.b - 0.04)} />;
  if (s.k === "clip") return <Clip id={s.id} t={t} a={s.a} dur={s.b - s.a} />;
  if (s.k === "img") return <Foto id={s.id} t={t} a={s.a} dur={s.b - s.a} />;
  if (s.k === "hilo") { const f = FX[s.id]; return f ? <Hilo t={t} a={f.a} b={f.b} m={f.m} mode={f.c} /> : <Hilo t={t} a={s.a} b={s.b} m={{}} mode="relleno" />; }
  const f = FX[s.id], Comp = COMP[f.c];
  // si la pieza vuelve después de una ventana del avatar, sigue donde iba (es f(t)); la escena se arma en su primer tramo
  return (
    <BgCtx.Provider value={T.bg[s.id]}>
      <Stage t={t} a={s.a} b={s.b} heat={CALIDO.has(s.id) ? 1 : 0}>{Comp ? <Comp t={t} a={f.a} b={f.b} m={f.m} /> : null}</Stage>
    </BgCtx.Provider>
  );
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let lo = 0, hi = SEGS.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (SEGS[mid].a <= t + 1e-6) lo = mid; else hi = mid - 1; }
  const i = lo, s = SEGS[i], pr = i > 0 ? SEGS[i - 1] : undefined;
  const p = pr && s.k !== "av" && pr.k !== "av" ? e(t, s.a, s.a + TR) : 1;
  const L: React.ReactNode[] = [];
  if (p >= 1 || !pr) L.push(<AbsoluteFill key={"s" + i}>{node(s, t)}</AbsoluteFill>);
  else {
    const q = Math.sin(p * Math.PI), dir = i % 2 ? 1 : -1;
    L.push(<AbsoluteFill key={"p" + (i - 1)} style={{ transform: `translateX(${dir * -p * 420}px)`, filter: `blur(${q * 22}px)` }}>{node(pr, Math.min(t, pr.b - 0.01))}</AbsoluteFill>);
    L.push(<AbsoluteFill key={"s" + i} style={{ transform: `translateX(${dir * (1 - p) * 1920}px)`, filter: `blur(${q * 26}px)` }}>{node(s, t)}</AbsoluteFill>);
  }
  const cta = CTA.find((c) => t >= c.a && t < c.b);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {L}
      {cta && <Cta t={t} a={cta.a} b={cta.b} m={cta.m} />}
      <Audio src={staticFile(MIX ? "cl2macetasmix.wav" : "cl2macetascut.wav")} />
    </AbsoluteFill>
  );
};
