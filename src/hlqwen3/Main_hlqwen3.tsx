// Main_hlqwen3.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_HLQWEN3 } from "./cues_hlqwen3.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_HLQWEN3 = 4932;

const VENTANAS = [{"k":0,"from":0,"dur":202,"src":"broll/hlqwen3/av_w000.mp4"},{"k":1,"from":454,"dur":173,"src":"broll/hlqwen3/av_w001.mp4"},{"k":2,"from":1020,"dur":149,"src":"broll/hlqwen3/av_w002.mp4"},{"k":3,"from":1449,"dur":116,"src":"broll/hlqwen3/av_w003.mp4"},{"k":4,"from":3839,"dur":189,"src":"broll/hlqwen3/av_w004.mp4"},{"k":5,"from":4720,"dur":211,"src":"broll/hlqwen3/av_w005.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainHlqwen3: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/hlqwen3/hlqwen3_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_HLQWEN3.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_HLQWEN3.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("hlqwen3_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
