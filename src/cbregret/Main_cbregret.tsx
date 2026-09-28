// Main_cbregret.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CBREGRET } from "./cues_cbregret.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CBREGRET = 41000;

const VENTANAS = [{"k":0,"from":30,"dur":90,"src":"broll/cbregret/av_w000.mp4"},{"k":1,"from":876,"dur":247,"src":"broll/cbregret/av_w001.mp4"},{"k":2,"from":1495,"dur":259,"src":"broll/cbregret/av_w002.mp4"},{"k":3,"from":2977,"dur":99,"src":"broll/cbregret/av_w003.mp4"},{"k":4,"from":4213,"dur":109,"src":"broll/cbregret/av_w004.mp4"},{"k":5,"from":4906,"dur":106,"src":"broll/cbregret/av_w005.mp4"},{"k":6,"from":6549,"dur":79,"src":"broll/cbregret/av_w006.mp4"},{"k":7,"from":6751,"dur":150,"src":"broll/cbregret/av_w007.mp4"},{"k":8,"from":8444,"dur":99,"src":"broll/cbregret/av_w008.mp4"},{"k":9,"from":9195,"dur":89,"src":"broll/cbregret/av_w009.mp4"},{"k":10,"from":9448,"dur":102,"src":"broll/cbregret/av_w010.mp4"},{"k":11,"from":12698,"dur":86,"src":"broll/cbregret/av_w011.mp4"},{"k":12,"from":13526,"dur":154,"src":"broll/cbregret/av_w012.mp4"},{"k":13,"from":14108,"dur":101,"src":"broll/cbregret/av_w013.mp4"},{"k":14,"from":15022,"dur":69,"src":"broll/cbregret/av_w014.mp4"},{"k":15,"from":15262,"dur":115,"src":"broll/cbregret/av_w015.mp4"},{"k":16,"from":17887,"dur":87,"src":"broll/cbregret/av_w016.mp4"},{"k":17,"from":18139,"dur":154,"src":"broll/cbregret/av_w017.mp4"},{"k":18,"from":18628,"dur":186,"src":"broll/cbregret/av_w018.mp4"},{"k":19,"from":21508,"dur":139,"src":"broll/cbregret/av_w019.mp4"},{"k":20,"from":23942,"dur":92,"src":"broll/cbregret/av_w020.mp4"},{"k":21,"from":25631,"dur":84,"src":"broll/cbregret/av_w021.mp4"},{"k":22,"from":26506,"dur":70,"src":"broll/cbregret/av_w022.mp4"},{"k":23,"from":27206,"dur":113,"src":"broll/cbregret/av_w023.mp4"},{"k":24,"from":28262,"dur":129,"src":"broll/cbregret/av_w024.mp4"},{"k":25,"from":29095,"dur":91,"src":"broll/cbregret/av_w025.mp4"},{"k":26,"from":31427,"dur":155,"src":"broll/cbregret/av_w026.mp4"},{"k":27,"from":32049,"dur":172,"src":"broll/cbregret/av_w027.mp4"},{"k":28,"from":32836,"dur":126,"src":"broll/cbregret/av_w028.mp4"},{"k":29,"from":32998,"dur":132,"src":"broll/cbregret/av_w029.mp4"},{"k":30,"from":33187,"dur":68,"src":"broll/cbregret/av_w030.mp4"},{"k":31,"from":34230,"dur":231,"src":"broll/cbregret/av_w031.mp4"},{"k":32,"from":35057,"dur":91,"src":"broll/cbregret/av_w032.mp4"},{"k":33,"from":35316,"dur":72,"src":"broll/cbregret/av_w033.mp4"},{"k":34,"from":35733,"dur":66,"src":"broll/cbregret/av_w034.mp4"},{"k":35,"from":37859,"dur":72,"src":"broll/cbregret/av_w035.mp4"},{"k":36,"from":38433,"dur":68,"src":"broll/cbregret/av_w036.mp4"},{"k":37,"from":40146,"dur":149,"src":"broll/cbregret/av_w037.mp4"},{"k":38,"from":40538,"dur":220,"src":"broll/cbregret/av_w038.mp4"},{"k":39,"from":40876,"dur":123,"src":"broll/cbregret/av_w039.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCbregret: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cbregret/cbregret_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CBREGRET.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CBREGRET.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cbregret.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
