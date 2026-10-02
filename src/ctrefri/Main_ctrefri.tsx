// Main_ctrefri.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CTREFRI } from "./cues_ctrefri.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CTREFRI = 42855;

const VENTANAS = [{"k":0,"from":0,"dur":99,"src":"broll/ctrefri/av_w000.mp4"},{"k":1,"from":298,"dur":384,"src":"broll/ctrefri/av_w001.mp4"},{"k":2,"from":925,"dur":337,"src":"broll/ctrefri/av_w002.mp4"},{"k":3,"from":1568,"dur":126,"src":"broll/ctrefri/av_w003.mp4"},{"k":4,"from":2657,"dur":220,"src":"broll/ctrefri/av_w004.mp4"},{"k":5,"from":3250,"dur":241,"src":"broll/ctrefri/av_w005.mp4"},{"k":6,"from":3641,"dur":188,"src":"broll/ctrefri/av_w006.mp4"},{"k":7,"from":4373,"dur":114,"src":"broll/ctrefri/av_w007.mp4"},{"k":8,"from":4577,"dur":690,"src":"broll/ctrefri/av_w008.mp4"},{"k":9,"from":7407,"dur":176,"src":"broll/ctrefri/av_w009.mp4"},{"k":10,"from":8111,"dur":157,"src":"broll/ctrefri/av_w010.mp4"},{"k":11,"from":10466,"dur":231,"src":"broll/ctrefri/av_w011.mp4"},{"k":12,"from":10909,"dur":599,"src":"broll/ctrefri/av_w012.mp4"},{"k":13,"from":11960,"dur":145,"src":"broll/ctrefri/av_w013.mp4"},{"k":14,"from":13367,"dur":348,"src":"broll/ctrefri/av_w014.mp4"},{"k":15,"from":14982,"dur":101,"src":"broll/ctrefri/av_w015.mp4"},{"k":16,"from":15630,"dur":454,"src":"broll/ctrefri/av_w016.mp4"},{"k":17,"from":16510,"dur":233,"src":"broll/ctrefri/av_w017.mp4"},{"k":18,"from":17263,"dur":97,"src":"broll/ctrefri/av_w018.mp4"},{"k":19,"from":17660,"dur":207,"src":"broll/ctrefri/av_w019.mp4"},{"k":20,"from":17959,"dur":545,"src":"broll/ctrefri/av_w020.mp4"},{"k":21,"from":19426,"dur":162,"src":"broll/ctrefri/av_w021.mp4"},{"k":22,"from":19763,"dur":143,"src":"broll/ctrefri/av_w022.mp4"},{"k":23,"from":20273,"dur":416,"src":"broll/ctrefri/av_w023.mp4"},{"k":24,"from":21439,"dur":200,"src":"broll/ctrefri/av_w024.mp4"},{"k":25,"from":22265,"dur":118,"src":"broll/ctrefri/av_w025.mp4"},{"k":26,"from":22577,"dur":95,"src":"broll/ctrefri/av_w026.mp4"},{"k":27,"from":22897,"dur":361,"src":"broll/ctrefri/av_w027.mp4"},{"k":28,"from":25783,"dur":163,"src":"broll/ctrefri/av_w028.mp4"},{"k":29,"from":26221,"dur":523,"src":"broll/ctrefri/av_w029.mp4"},{"k":30,"from":28094,"dur":90,"src":"broll/ctrefri/av_w030.mp4"},{"k":31,"from":28954,"dur":270,"src":"broll/ctrefri/av_w031.mp4"},{"k":32,"from":33589,"dur":255,"src":"broll/ctrefri/av_w032.mp4"},{"k":33,"from":35676,"dur":169,"src":"broll/ctrefri/av_w033.mp4"},{"k":34,"from":37211,"dur":224,"src":"broll/ctrefri/av_w034.mp4"},{"k":35,"from":39410,"dur":120,"src":"broll/ctrefri/av_w035.mp4"},{"k":36,"from":41015,"dur":769,"src":"broll/ctrefri/av_w036.mp4"},{"k":37,"from":42119,"dur":736,"src":"broll/ctrefri/av_w037.mp4"}];

export const MainCtrefri: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/ctrefri/ctrefri_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_CTREFRI.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CTREFRI.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("ctrefri.m4a")} />
    </AbsoluteFill>
  );
};
