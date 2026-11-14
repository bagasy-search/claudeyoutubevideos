// Chief Aurelio · Player: arma el video desde edl.json.
//   shots[] = plano base (clip H3 / footage real / foto), cortes duros contiguos (sin fundido: el fundido a negro
//             en cada corte es el destello negro de fedvet2).
//   cues[]  = componentes del kit como OVERLAY encima del plano, con scrim opcional para que se lean.
// El audio NO va acá: la mezcla (voz + ambiente H3 + sfx) se arma aparte en <slug>_mix.wav y encfin la pega.
import React from "react";
import { AbsoluteFill, Sequence, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C } from "./theme";
import * as Dg from "./kit/diagrams";
import * as Cd from "./kit/cards";
import { EXTRA } from "./kit/extra";

export type Shot = { s: number; e: number; src: string; t: "v" | "i" | "n"; rate?: number; from?: number; kb?: "in" | "out" | "l" | "r" };
export type Cue = { s: number; e: number; c: string; p: Record<string, any>; scrim?: number };
export type EDL = { end: number; shots: Shot[]; cues: Cue[] };

const FPS = 30;
const COMPS: Record<string, React.FC<any>> = {
  Telegraph: Dg.Telegraph, ShipCut: Dg.ShipCut, EngineTower: Dg.EngineTower, RouteMap: Dg.RouteMap, WatchClock: Dg.WatchClock, Thermo: Dg.Thermo,
  LogEntry: Cd.LogEntry, Telex: Cd.Telex, CallMeter: Cd.CallMeter, BigStat: Cd.BigStat, GasMeter: Cd.GasMeter, NumberItem: Cd.NumberItem,
  Quote: Cd.Quote, ChapterPlate: Cd.ChapterPlate, Ledger: Cd.Ledger, EndCard: Cd.EndCard,
  ...EXTRA,
};

const Still: React.FC<{ src: string; dur: number; kb: Shot["kb"] }> = ({ src, dur, kb = "in" }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const s = kb === "out" ? 1.12 - 0.08 * t : 1.04 + 0.08 * t;
  const x = kb === "l" ? 3 - 6 * t : kb === "r" ? -3 + 6 * t : 0;
  return <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translateX(${x}%)` }} />;
};

const Scrim: React.FC<{ a: number; dur: number }> = ({ a, dur }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" }));
  return <AbsoluteFill style={{ background: `rgba(11,22,32,${a * o})` }} />;
};

export const makePlayer = (edl: EDL): React.FC => () => (
  <AbsoluteFill style={{ background: C.ink }}>
    {edl.shots.map((sh, i) => {
      if (sh.t === "n") return null; // debajo de un componente opaco: fondo ink
      const from = Math.round(sh.s * FPS), dur = Math.max(1, Math.round(sh.e * FPS) - from);
      return (
        <Sequence key={"s" + i} from={from} durationInFrames={dur} layout="none">
          <AbsoluteFill>
            {sh.t === "v" ? (
              <OffthreadVideo src={staticFile(sh.src)} muted playbackRate={sh.rate ?? 1} startFrom={Math.round((sh.from ?? 0) * FPS)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Still src={sh.src} dur={dur} kb={sh.kb} />
            )}
          </AbsoluteFill>
        </Sequence>
      );
    })}
    {edl.cues.map((cu, i) => {
      const Comp = COMPS[cu.c];
      if (!Comp) throw new Error(`componente desconocido: ${cu.c}`);
      const from = Math.round(cu.s * FPS), dur = Math.max(1, Math.round(cu.e * FPS) - from);
      return (
        <Sequence key={"c" + i} from={from} durationInFrames={dur} layout="none">
          <AbsoluteFill>
            {cu.scrim ? <Scrim a={cu.scrim} dur={dur} /> : null}
            <Comp dur={dur} {...cu.p} />
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
