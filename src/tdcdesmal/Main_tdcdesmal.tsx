// Main_tdcdesmal.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TDCDESMAL } from "./cues_tdcdesmal.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TDCDESMAL = 31341;

const VENTANAS = [{"k":0,"from":30,"dur":231,"src":"broll/tdcdesmal/av_w000.mp4"},{"k":1,"from":527,"dur":299,"src":"broll/tdcdesmal/av_w001.mp4"},{"k":2,"from":1000,"dur":130,"src":"broll/tdcdesmal/av_w002.mp4"},{"k":3,"from":1399,"dur":407,"src":"broll/tdcdesmal/av_w003.mp4"},{"k":4,"from":2163,"dur":262,"src":"broll/tdcdesmal/av_w004.mp4"},{"k":5,"from":2983,"dur":198,"src":"broll/tdcdesmal/av_w005.mp4"},{"k":6,"from":4346,"dur":268,"src":"broll/tdcdesmal/av_w006.mp4"},{"k":7,"from":5633,"dur":266,"src":"broll/tdcdesmal/av_w007.mp4"},{"k":8,"from":7014,"dur":299,"src":"broll/tdcdesmal/av_w008.mp4"},{"k":9,"from":8396,"dur":608,"src":"broll/tdcdesmal/av_w009.mp4"},{"k":10,"from":9613,"dur":319,"src":"broll/tdcdesmal/av_w010.mp4"},{"k":11,"from":10666,"dur":129,"src":"broll/tdcdesmal/av_w011.mp4"},{"k":12,"from":11112,"dur":166,"src":"broll/tdcdesmal/av_w012.mp4"},{"k":13,"from":12025,"dur":139,"src":"broll/tdcdesmal/av_w013.mp4"},{"k":14,"from":12367,"dur":202,"src":"broll/tdcdesmal/av_w014.mp4"},{"k":15,"from":13567,"dur":208,"src":"broll/tdcdesmal/av_w015.mp4"},{"k":16,"from":14720,"dur":207,"src":"broll/tdcdesmal/av_w016.mp4"},{"k":17,"from":16096,"dur":348,"src":"broll/tdcdesmal/av_w017.mp4"},{"k":18,"from":17570,"dur":293,"src":"broll/tdcdesmal/av_w018.mp4"},{"k":19,"from":19061,"dur":211,"src":"broll/tdcdesmal/av_w019.mp4"},{"k":20,"from":19784,"dur":391,"src":"broll/tdcdesmal/av_w020.mp4"},{"k":21,"from":20897,"dur":257,"src":"broll/tdcdesmal/av_w021.mp4"},{"k":22,"from":21506,"dur":184,"src":"broll/tdcdesmal/av_w022.mp4"},{"k":23,"from":22814,"dur":230,"src":"broll/tdcdesmal/av_w023.mp4"},{"k":24,"from":23817,"dur":298,"src":"broll/tdcdesmal/av_w024.mp4"},{"k":25,"from":24839,"dur":247,"src":"broll/tdcdesmal/av_w025.mp4"},{"k":26,"from":25717,"dur":325,"src":"broll/tdcdesmal/av_w026.mp4"},{"k":27,"from":26301,"dur":152,"src":"broll/tdcdesmal/av_w027.mp4"},{"k":28,"from":26860,"dur":155,"src":"broll/tdcdesmal/av_w028.mp4"},{"k":29,"from":27620,"dur":273,"src":"broll/tdcdesmal/av_w029.mp4"},{"k":30,"from":28396,"dur":173,"src":"broll/tdcdesmal/av_w030.mp4"},{"k":31,"from":28835,"dur":221,"src":"broll/tdcdesmal/av_w031.mp4"},{"k":32,"from":29165,"dur":195,"src":"broll/tdcdesmal/av_w032.mp4"},{"k":33,"from":29749,"dur":391,"src":"broll/tdcdesmal/av_w033.mp4"},{"k":34,"from":30599,"dur":395,"src":"broll/tdcdesmal/av_w034.mp4"},{"k":35,"from":31238,"dur":103,"src":"broll/tdcdesmal/av_w035.mp4"}];

export const MainTdcdesmal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tdcdesmal/tdcdesmal_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TDCDESMAL.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TDCDESMAL.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("tdcdesmal.m4a")} /></Sequence>
    </AbsoluteFill>
  );
};
