// ApexMain — montaje de Apex Files a partir de un plan (lo arma D:/rtmp_apex01/plan.py):
//   beats[]    = plano base contiguo (foto con Ken-Burns o clip), `tr: "dissolve"` funde con el anterior
//   cards[]    = tarjetas que tapan el base (ApexNumber de cada ítem)
//   overlays[] = componentes encima del metraje (lugar, cifra, nota, ficha)
// Sin grano, viñeta ni filtro: el metraje va limpio. El audio es la voz sola (-14 LUFS).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Media, KB, setClipLens } from "./Media";
import { APEX_COMPS } from "./ApexKit";

export type Beat = { from: number; dur: number; src: string; start?: number; rate?: number; kb?: KB; zoom?: number; pos?: string; tr?: "cut" | "dissolve" };
export type Cue = { from: number; dur: number; comp: string; props: any };
export type Plan = { fps: number; total: number; audio?: string; beats: Beat[]; cards: Cue[]; overlays: Cue[]; lens?: Record<string, number> };

const XF = 10;

const BeatView: React.FC<{ b: Beat; fadeIn: boolean }> = ({ b, fadeIn }) => {
  const f = useCurrentFrame();
  const o = fadeIn ? Math.min(1, f / XF) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Media src={b.src} start={b.start} rate={b.rate} kb={b.kb ?? "in"} zoom={b.zoom ?? 1.08} pos={b.pos} />
    </AbsoluteFill>
  );
};

export const ApexMain: React.FC<{ plan: Plan }> = ({ plan }) => {
  setClipLens(plan.lens ?? {});
  return (
    <AbsoluteFill style={{ background: "#08090A" }}>
      {plan.beats.map((b, i) => {
        const dis = b.tr === "dissolve" && i > 0;
        const from = dis ? Math.max(0, b.from - XF) : b.from;
        const dur = b.dur + (b.from - from);
        return (
          <Sequence key={"b" + i} from={from} durationInFrames={dur} layout="none">
            <BeatView b={b} fadeIn={dis} />
          </Sequence>
        );
      })}
      {plan.overlays.map((c, i) => {
        const C = APEX_COMPS[c.comp];
        return C ? <Sequence key={"o" + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
      })}
      {plan.cards.map((c, i) => {
        const C = APEX_COMPS[c.comp];
        return C ? <Sequence key={"c" + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
      })}
      {plan.audio ? <Audio src={staticFile(plan.audio)} /> : null}
    </AbsoluteFill>
  );
};
