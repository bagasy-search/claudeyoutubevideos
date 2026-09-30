// Main_tdccobre.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TDCCOBRE } from "./cues_tdccobre.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TDCCOBRE = 37745;

const VENTANAS = [{"k":0,"from":0,"dur":156,"src":"broll/tdccobre/av_w000.mp4"},{"k":1,"from":486,"dur":143,"src":"broll/tdccobre/av_w001.mp4"},{"k":2,"from":722,"dur":113,"src":"broll/tdccobre/av_w002.mp4"},{"k":3,"from":1179,"dur":146,"src":"broll/tdccobre/av_w003.mp4"},{"k":4,"from":1920,"dur":68,"src":"broll/tdccobre/av_w004.mp4"},{"k":5,"from":2504,"dur":221,"src":"broll/tdccobre/av_w005.mp4"},{"k":6,"from":3948,"dur":163,"src":"broll/tdccobre/av_w006.mp4"},{"k":7,"from":4354,"dur":100,"src":"broll/tdccobre/av_w007.mp4"},{"k":8,"from":5844,"dur":225,"src":"broll/tdccobre/av_w008.mp4"},{"k":9,"from":6462,"dur":58,"src":"broll/tdccobre/av_w009.mp4"},{"k":10,"from":7284,"dur":158,"src":"broll/tdccobre/av_w010.mp4"},{"k":11,"from":8378,"dur":83,"src":"broll/tdccobre/av_w011.mp4"},{"k":12,"from":8728,"dur":136,"src":"broll/tdccobre/av_w012.mp4"},{"k":13,"from":9234,"dur":65,"src":"broll/tdccobre/av_w013.mp4"},{"k":14,"from":13939,"dur":167,"src":"broll/tdccobre/av_w014.mp4"},{"k":15,"from":15915,"dur":169,"src":"broll/tdccobre/av_w015.mp4"},{"k":16,"from":16562,"dur":220,"src":"broll/tdccobre/av_w016.mp4"},{"k":17,"from":18508,"dur":256,"src":"broll/tdccobre/av_w017.mp4"},{"k":18,"from":19188,"dur":63,"src":"broll/tdccobre/av_w018.mp4"},{"k":19,"from":19710,"dur":119,"src":"broll/tdccobre/av_w019.mp4"},{"k":20,"from":19981,"dur":268,"src":"broll/tdccobre/av_w020.mp4"},{"k":21,"from":21981,"dur":169,"src":"broll/tdccobre/av_w021.mp4"},{"k":22,"from":22411,"dur":148,"src":"broll/tdccobre/av_w022.mp4"},{"k":23,"from":23226,"dur":142,"src":"broll/tdccobre/av_w023.mp4"},{"k":24,"from":24171,"dur":195,"src":"broll/tdccobre/av_w024.mp4"},{"k":25,"from":24933,"dur":155,"src":"broll/tdccobre/av_w025.mp4"},{"k":26,"from":25848,"dur":106,"src":"broll/tdccobre/av_w026.mp4"},{"k":27,"from":27648,"dur":103,"src":"broll/tdccobre/av_w027.mp4"},{"k":28,"from":27897,"dur":316,"src":"broll/tdccobre/av_w028.mp4"},{"k":29,"from":28938,"dur":90,"src":"broll/tdccobre/av_w029.mp4"},{"k":30,"from":31339,"dur":108,"src":"broll/tdccobre/av_w030.mp4"},{"k":31,"from":32559,"dur":196,"src":"broll/tdccobre/av_w031.mp4"},{"k":32,"from":34461,"dur":107,"src":"broll/tdccobre/av_w032.mp4"},{"k":33,"from":34993,"dur":120,"src":"broll/tdccobre/av_w033.mp4"},{"k":34,"from":36275,"dur":229,"src":"broll/tdccobre/av_w034.mp4"},{"k":35,"from":36975,"dur":339,"src":"broll/tdccobre/av_w035.mp4"},{"k":36,"from":37459,"dur":285,"src":"broll/tdccobre/av_w036.mp4"}];

export const MainTdccobre: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tdccobre/tdccobre_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TDCCOBRE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TDCCOBRE.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tdccobre.m4a")} />
    </AbsoluteFill>
  );
};
