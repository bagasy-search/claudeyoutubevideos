// Main_ohfpipes.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OHFPIPES } from "./cues_ohfpipes.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OHFPIPES = 26783;

const VENTANAS = [{"k":0,"from":30,"dur":136,"src":"broll/ohfpipes/av_w000.mp4"},{"k":1,"from":653,"dur":351,"src":"broll/ohfpipes/av_w001.mp4"},{"k":2,"from":1691,"dur":132,"src":"broll/ohfpipes/av_w002.mp4"},{"k":3,"from":2570,"dur":204,"src":"broll/ohfpipes/av_w003.mp4"},{"k":4,"from":2852,"dur":250,"src":"broll/ohfpipes/av_w004.mp4"},{"k":5,"from":3277,"dur":168,"src":"broll/ohfpipes/av_w005.mp4"},{"k":6,"from":3667,"dur":144,"src":"broll/ohfpipes/av_w006.mp4"},{"k":7,"from":4184,"dur":110,"src":"broll/ohfpipes/av_w007.mp4"},{"k":8,"from":5646,"dur":242,"src":"broll/ohfpipes/av_w008.mp4"},{"k":9,"from":6397,"dur":252,"src":"broll/ohfpipes/av_w009.mp4"},{"k":10,"from":6849,"dur":237,"src":"broll/ohfpipes/av_w010.mp4"},{"k":11,"from":8158,"dur":106,"src":"broll/ohfpipes/av_w011.mp4"},{"k":12,"from":8859,"dur":342,"src":"broll/ohfpipes/av_w012.mp4"},{"k":13,"from":11411,"dur":138,"src":"broll/ohfpipes/av_w013.mp4"},{"k":14,"from":11676,"dur":240,"src":"broll/ohfpipes/av_w014.mp4"},{"k":15,"from":13412,"dur":247,"src":"broll/ohfpipes/av_w015.mp4"},{"k":16,"from":13737,"dur":241,"src":"broll/ohfpipes/av_w016.mp4"},{"k":17,"from":15068,"dur":164,"src":"broll/ohfpipes/av_w017.mp4"},{"k":18,"from":15751,"dur":123,"src":"broll/ohfpipes/av_w018.mp4"},{"k":19,"from":16420,"dur":125,"src":"broll/ohfpipes/av_w019.mp4"},{"k":20,"from":16631,"dur":167,"src":"broll/ohfpipes/av_w020.mp4"},{"k":21,"from":16907,"dur":229,"src":"broll/ohfpipes/av_w021.mp4"},{"k":22,"from":17735,"dur":446,"src":"broll/ohfpipes/av_w022.mp4"},{"k":23,"from":19439,"dur":152,"src":"broll/ohfpipes/av_w023.mp4"},{"k":24,"from":20048,"dur":222,"src":"broll/ohfpipes/av_w024.mp4"},{"k":25,"from":20968,"dur":238,"src":"broll/ohfpipes/av_w025.mp4"},{"k":26,"from":21384,"dur":153,"src":"broll/ohfpipes/av_w026.mp4"},{"k":27,"from":21758,"dur":115,"src":"broll/ohfpipes/av_w027.mp4"},{"k":28,"from":22522,"dur":256,"src":"broll/ohfpipes/av_w028.mp4"},{"k":29,"from":24105,"dur":103,"src":"broll/ohfpipes/av_w029.mp4"},{"k":30,"from":25325,"dur":251,"src":"broll/ohfpipes/av_w030.mp4"},{"k":31,"from":25998,"dur":193,"src":"broll/ohfpipes/av_w031.mp4"},{"k":32,"from":26419,"dur":363,"src":"broll/ohfpipes/av_w032.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOhfpipes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/ohfpipes/ohfpipes_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OHFPIPES.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OHFPIPES.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ohfpipes_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
