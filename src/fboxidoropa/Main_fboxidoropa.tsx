// Main_fboxidoropa.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FBOXIDOROPA } from "./cues_fboxidoropa.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_FBOXIDOROPA = 26630;

const VENTANAS = [{"k":0,"from":0,"dur":133,"src":"broll/fboxidoropa/av_w000.mp4"},{"k":1,"from":1472,"dur":197,"src":"broll/fboxidoropa/av_w001.mp4"},{"k":2,"from":1865,"dur":149,"src":"broll/fboxidoropa/av_w002.mp4"},{"k":3,"from":2388,"dur":304,"src":"broll/fboxidoropa/av_w003.mp4"},{"k":4,"from":2992,"dur":304,"src":"broll/fboxidoropa/av_w004.mp4"},{"k":5,"from":3740,"dur":187,"src":"broll/fboxidoropa/av_w005.mp4"},{"k":6,"from":5451,"dur":109,"src":"broll/fboxidoropa/av_w006.mp4"},{"k":7,"from":5750,"dur":124,"src":"broll/fboxidoropa/av_w007.mp4"},{"k":8,"from":6521,"dur":89,"src":"broll/fboxidoropa/av_w008.mp4"},{"k":9,"from":7404,"dur":111,"src":"broll/fboxidoropa/av_w009.mp4"},{"k":10,"from":8225,"dur":234,"src":"broll/fboxidoropa/av_w010.mp4"},{"k":11,"from":8866,"dur":151,"src":"broll/fboxidoropa/av_w011.mp4"},{"k":12,"from":9864,"dur":224,"src":"broll/fboxidoropa/av_w012.mp4"},{"k":13,"from":10408,"dur":94,"src":"broll/fboxidoropa/av_w013.mp4"},{"k":14,"from":10697,"dur":103,"src":"broll/fboxidoropa/av_w014.mp4"},{"k":15,"from":11957,"dur":108,"src":"broll/fboxidoropa/av_w015.mp4"},{"k":16,"from":12624,"dur":160,"src":"broll/fboxidoropa/av_w016.mp4"},{"k":17,"from":13719,"dur":245,"src":"broll/fboxidoropa/av_w017.mp4"},{"k":18,"from":14880,"dur":115,"src":"broll/fboxidoropa/av_w018.mp4"},{"k":19,"from":16118,"dur":101,"src":"broll/fboxidoropa/av_w019.mp4"},{"k":20,"from":16577,"dur":408,"src":"broll/fboxidoropa/av_w020.mp4"},{"k":21,"from":17059,"dur":85,"src":"broll/fboxidoropa/av_w021.mp4"},{"k":22,"from":17609,"dur":185,"src":"broll/fboxidoropa/av_w022.mp4"},{"k":23,"from":18390,"dur":160,"src":"broll/fboxidoropa/av_w023.mp4"},{"k":24,"from":18705,"dur":67,"src":"broll/fboxidoropa/av_w024.mp4"},{"k":25,"from":19229,"dur":122,"src":"broll/fboxidoropa/av_w025.mp4"},{"k":26,"from":20134,"dur":162,"src":"broll/fboxidoropa/av_w026.mp4"},{"k":27,"from":21103,"dur":225,"src":"broll/fboxidoropa/av_w027.mp4"},{"k":28,"from":21733,"dur":105,"src":"broll/fboxidoropa/av_w028.mp4"},{"k":29,"from":21995,"dur":80,"src":"broll/fboxidoropa/av_w029.mp4"},{"k":30,"from":22480,"dur":117,"src":"broll/fboxidoropa/av_w030.mp4"},{"k":31,"from":23710,"dur":388,"src":"broll/fboxidoropa/av_w031.mp4"},{"k":32,"from":24567,"dur":154,"src":"broll/fboxidoropa/av_w032.mp4"},{"k":33,"from":24947,"dur":254,"src":"broll/fboxidoropa/av_w033.mp4"},{"k":34,"from":25821,"dur":216,"src":"broll/fboxidoropa/av_w034.mp4"},{"k":35,"from":26143,"dur":187,"src":"broll/fboxidoropa/av_w035.mp4"},{"k":36,"from":26570,"dur":59,"src":"broll/fboxidoropa/av_w036.mp4"}];

export const MainFboxidoropa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/fboxidoropa/fboxidoropa_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_FBOXIDOROPA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FBOXIDOROPA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fboxidoropa.m4a")} />
    </AbsoluteFill>
  );
};
