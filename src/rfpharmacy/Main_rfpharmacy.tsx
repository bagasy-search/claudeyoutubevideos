// Main_rfpharmacy.tsx — GENERADO por _work/rfpharmacy/montaje.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BASE, AVATAR, OVERLAYS, OV2, HERO, SFX, TOTAL_FRAMES_RFPHARMACY } from "./cues.gen";

const Capa: React.FC<{ cues: typeof BASE }> = ({ cues }) => (
  <>
    {cues.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, c.dur))}</AbsoluteFill>
      </Sequence>
    ))}
  </>
);

export const MainRfpharmacy: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A1220" }}>
    <Capa cues={BASE} />
    <Capa cues={AVATAR} />
    <Capa cues={OVERLAYS} />
    <Capa cues={OV2} />
    <Capa cues={HERO} />
    <Audio src={staticFile("rfpharmacy.m4a")} />
    {SFX.map((s, k) => (
      <Sequence key={"sfx" + k} from={s.from} durationInFrames={75} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
export { TOTAL_FRAMES_RFPHARMACY };
