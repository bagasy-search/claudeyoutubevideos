// Main_olesuppers.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OLESUPPERS } from "./cues_olesuppers.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OLESUPPERS = 39590;

const VENTANAS = [{"k":0,"from":30,"dur":121,"src":"broll/olesuppers/av_w000.mp4"},{"k":1,"from":802,"dur":298,"src":"broll/olesuppers/av_w001.mp4"},{"k":2,"from":1631,"dur":198,"src":"broll/olesuppers/av_w002.mp4"},{"k":3,"from":1975,"dur":161,"src":"broll/olesuppers/av_w003.mp4"},{"k":4,"from":2944,"dur":204,"src":"broll/olesuppers/av_w004.mp4"},{"k":5,"from":4010,"dur":185,"src":"broll/olesuppers/av_w005.mp4"},{"k":6,"from":5152,"dur":156,"src":"broll/olesuppers/av_w006.mp4"},{"k":7,"from":5475,"dur":157,"src":"broll/olesuppers/av_w007.mp4"},{"k":8,"from":5750,"dur":137,"src":"broll/olesuppers/av_w008.mp4"},{"k":9,"from":6769,"dur":174,"src":"broll/olesuppers/av_w009.mp4"},{"k":10,"from":8220,"dur":110,"src":"broll/olesuppers/av_w010.mp4"},{"k":11,"from":9092,"dur":108,"src":"broll/olesuppers/av_w011.mp4"},{"k":12,"from":9277,"dur":154,"src":"broll/olesuppers/av_w012.mp4"},{"k":13,"from":9874,"dur":195,"src":"broll/olesuppers/av_w013.mp4"},{"k":14,"from":10901,"dur":277,"src":"broll/olesuppers/av_w014.mp4"},{"k":15,"from":11378,"dur":299,"src":"broll/olesuppers/av_w015.mp4"},{"k":16,"from":12776,"dur":159,"src":"broll/olesuppers/av_w016.mp4"},{"k":17,"from":14122,"dur":163,"src":"broll/olesuppers/av_w017.mp4"},{"k":18,"from":15052,"dur":101,"src":"broll/olesuppers/av_w018.mp4"},{"k":19,"from":16640,"dur":132,"src":"broll/olesuppers/av_w019.mp4"},{"k":20,"from":17614,"dur":158,"src":"broll/olesuppers/av_w020.mp4"},{"k":21,"from":18244,"dur":255,"src":"broll/olesuppers/av_w021.mp4"},{"k":22,"from":20024,"dur":134,"src":"broll/olesuppers/av_w022.mp4"},{"k":23,"from":22826,"dur":138,"src":"broll/olesuppers/av_w023.mp4"},{"k":24,"from":23099,"dur":146,"src":"broll/olesuppers/av_w024.mp4"},{"k":25,"from":24998,"dur":149,"src":"broll/olesuppers/av_w025.mp4"},{"k":26,"from":25618,"dur":132,"src":"broll/olesuppers/av_w026.mp4"},{"k":27,"from":27203,"dur":209,"src":"broll/olesuppers/av_w027.mp4"},{"k":28,"from":28699,"dur":114,"src":"broll/olesuppers/av_w028.mp4"},{"k":29,"from":29443,"dur":123,"src":"broll/olesuppers/av_w029.mp4"},{"k":30,"from":32236,"dur":119,"src":"broll/olesuppers/av_w030.mp4"},{"k":31,"from":33131,"dur":134,"src":"broll/olesuppers/av_w031.mp4"},{"k":32,"from":33501,"dur":211,"src":"broll/olesuppers/av_w032.mp4"},{"k":33,"from":34396,"dur":222,"src":"broll/olesuppers/av_w033.mp4"},{"k":34,"from":35441,"dur":299,"src":"broll/olesuppers/av_w034.mp4"},{"k":35,"from":37700,"dur":121,"src":"broll/olesuppers/av_w035.mp4"},{"k":36,"from":38027,"dur":303,"src":"broll/olesuppers/av_w036.mp4"},{"k":37,"from":38474,"dur":174,"src":"broll/olesuppers/av_w037.mp4"},{"k":38,"from":38843,"dur":746,"src":"broll/olesuppers/av_w038.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOlesuppers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0907" }}>
      <PlacaPiso src="img/olesuppers/olesuppers_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_OLESUPPERS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OLESUPPERS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("olesuppers_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
