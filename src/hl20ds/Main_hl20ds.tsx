// Main_hl20ds.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_HL20DS } from "./cues_hl20ds.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_HL20DS = 21349;

const VENTANAS = [{"k":0,"from":0,"dur":221,"src":"broll/hl20ds/av_w000.mp4"},{"k":1,"from":702,"dur":193,"src":"broll/hl20ds/av_w001.mp4"},{"k":2,"from":1591,"dur":180,"src":"broll/hl20ds/av_w002.mp4"},{"k":3,"from":3888,"dur":171,"src":"broll/hl20ds/av_w003.mp4","zoom":[[103,68,1.14]]},{"k":4,"from":6793,"dur":157,"src":"broll/hl20ds/av_w004.mp4"},{"k":5,"from":7131,"dur":141,"src":"broll/hl20ds/av_w005.mp4"},{"k":6,"from":7630,"dur":203,"src":"broll/hl20ds/av_w006.mp4"},{"k":7,"from":8385,"dur":204,"src":"broll/hl20ds/av_w007.mp4","zoom":[[147,57,1.14]]},{"k":8,"from":9736,"dur":159,"src":"broll/hl20ds/av_w008.mp4"},{"k":9,"from":11549,"dur":193,"src":"broll/hl20ds/av_w009.mp4","zoom":[[110,54,1.14]]},{"k":10,"from":15939,"dur":288,"src":"broll/hl20ds/av_w010.mp4"},{"k":11,"from":16588,"dur":169,"src":"broll/hl20ds/av_w011.mp4"},{"k":12,"from":17489,"dur":240,"src":"broll/hl20ds/av_w012.mp4","zoom":[[123,92,1.14]]},{"k":13,"from":18014,"dur":172,"src":"broll/hl20ds/av_w013.mp4","zoom":[[96,47,1.14]]},{"k":14,"from":19169,"dur":97,"src":"broll/hl20ds/av_w014.mp4"},{"k":15,"from":19601,"dur":119,"src":"broll/hl20ds/av_w015.mp4"},{"k":16,"from":20266,"dur":151,"src":"broll/hl20ds/av_w016.mp4","zoom":[[81,60,1.14]]},{"k":17,"from":20812,"dur":423,"src":"broll/hl20ds/av_w017.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainHl20ds: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/hl20ds/hl20ds_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_HL20DS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_HL20DS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("hl20ds_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
