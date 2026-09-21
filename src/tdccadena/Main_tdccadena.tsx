// Main_tdccadena.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TDCCADENA } from "./cues_tdccadena.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TDCCADENA = 14815;

const VENTANAS = [{"k":0,"from":30,"dur":494,"src":"broll/tdccadena/av_w000.mp4"},{"k":1,"from":2759,"dur":140,"src":"broll/tdccadena/av_w001.mp4"},{"k":2,"from":5252,"dur":189,"src":"broll/tdccadena/av_w002.mp4"},{"k":3,"from":8867,"dur":156,"src":"broll/tdccadena/av_w003.mp4"},{"k":4,"from":12022,"dur":205,"src":"broll/tdccadena/av_w004.mp4"},{"k":5,"from":14302,"dur":512,"src":"broll/tdccadena/av_w005.mp4"}];

export const MainTdccadena: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tdccadena/tdccadena_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TDCCADENA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TDCCADENA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("tdccadena.m4a")} /></Sequence>
    </AbsoluteFill>
  );
};
