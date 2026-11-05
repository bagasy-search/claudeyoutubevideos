// cme4a · EL VIDEO ENTERO en un solo hilo. La línea de tiempo NO se calcula acá: la arma tools/edl.py (D:/rtmp_cme4a) y la
// misma edl.json alimenta la mezcla de sonido. Capas: cuadro 0 · avatar · pausas · ráfagas · componentes · planos narrativos.
// Cortes secos (avatar y ráfagas al cuadro del golpe); los componentes nacen del clip anterior (Stage lo hunde y lo oscurece).
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Avatar, BgCtx, Shot, type Bg } from "./base";
import { FXR, FXI } from "./planos";
import EDL from "./edl.json";

type Seg = { a: number; b: number; k: "av" | "fx" | "clip"; id: string | null; o?: number; rol?: string; pid?: string };
export const SEGS = (EDL as { segs: Seg[] }).segs;
export const END = (EDL as { end: number }).end;
// fondo de cada componente: el clip que estaba antes (sigue corriendo); si antes había avatar, el clip que viene después
const BG: Record<number, Bg> = {};
SEGS.forEach((s, i) => {
  if (s.k !== "fx") return;
  const p = [...SEGS.slice(0, i)].reverse().find((x) => x.k === "clip" && x.id && s.a - x.b < 0.1);
  const n = SEGS.slice(i + 1).find((x) => x.k === "clip" && x.id);
  BG[i] = p ? { id: p.id!, o: p.o ?? 0, a: p.a } : n ? { id: n.id!, o: n.o ?? 0, a: s.a } : undefined;
});

const node = (s: Seg, i: number, t: number): React.ReactNode => {
  if (s.k === "av") return <Avatar t={t} />;
  if (s.k === "fx") {
    const f = FXI[s.id!], R = FXR[s.id!];
    return <BgCtx.Provider value={BG[i]}>{R ? R(t, f) : null}</BgCtx.Provider>;
  }
  if (!s.id) return <AbsoluteFill style={{ background: "#0b0907" }} />;
  return <Shot id={s.id} t={t} a={s.a} o={s.o ?? 0} push={s.rol === "plano"} />;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SEGS.length - 1 && SEGS[i + 1].a <= t + 1e-4) i++;
  // el audio sale de UN solo master: voz Fish + cama Veo + foley (mezcla.py, -14 LUFS)
  return <AbsoluteFill style={{ background: "#0b0907" }}><AbsoluteFill key={"s" + i}>{node(SEGS[i], i, t)}</AbsoluteFill><Audio src={staticFile("cme4a.wav")} /></AbsoluteFill>;
};
