// Main_tcestufa.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TCESTUFA } from "./cues_tcestufa.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TCESTUFA = 36495;

const VENTANAS = [{"k":0,"from":0,"dur":268,"src":"broll/tcestufa/av_w000.mp4"},{"k":1,"from":782,"dur":283,"src":"broll/tcestufa/av_w001.mp4"},{"k":2,"from":1712,"dur":253,"src":"broll/tcestufa/av_w002.mp4"},{"k":3,"from":2514,"dur":253,"src":"broll/tcestufa/av_w003.mp4"},{"k":4,"from":4889,"dur":290,"src":"broll/tcestufa/av_w004.mp4"},{"k":5,"from":6039,"dur":280,"src":"broll/tcestufa/av_w005.mp4"},{"k":6,"from":6620,"dur":181,"src":"broll/tcestufa/av_w006.mp4"},{"k":7,"from":6947,"dur":157,"src":"broll/tcestufa/av_w007.mp4"},{"k":8,"from":7533,"dur":169,"src":"broll/tcestufa/av_w008.mp4"},{"k":9,"from":8928,"dur":80,"src":"broll/tcestufa/av_w009.mp4"},{"k":10,"from":10013,"dur":123,"src":"broll/tcestufa/av_w010.mp4"},{"k":11,"from":12173,"dur":133,"src":"broll/tcestufa/av_w011.mp4"},{"k":12,"from":13322,"dur":140,"src":"broll/tcestufa/av_w012.mp4"},{"k":13,"from":14363,"dur":54,"src":"broll/tcestufa/av_w013.mp4"},{"k":14,"from":16116,"dur":153,"src":"broll/tcestufa/av_w014.mp4"},{"k":15,"from":18702,"dur":171,"src":"broll/tcestufa/av_w015.mp4"},{"k":16,"from":20429,"dur":252,"src":"broll/tcestufa/av_w016.mp4"},{"k":17,"from":21695,"dur":214,"src":"broll/tcestufa/av_w017.mp4"},{"k":18,"from":22907,"dur":96,"src":"broll/tcestufa/av_w018.mp4"},{"k":19,"from":23363,"dur":115,"src":"broll/tcestufa/av_w019.mp4"},{"k":20,"from":24101,"dur":91,"src":"broll/tcestufa/av_w020.mp4"},{"k":21,"from":25425,"dur":395,"src":"broll/tcestufa/av_w021.mp4"},{"k":22,"from":25953,"dur":157,"src":"broll/tcestufa/av_w022.mp4"},{"k":23,"from":27493,"dur":333,"src":"broll/tcestufa/av_w023.mp4"},{"k":24,"from":29486,"dur":183,"src":"broll/tcestufa/av_w024.mp4"},{"k":25,"from":30842,"dur":199,"src":"broll/tcestufa/av_w025.mp4"},{"k":26,"from":31658,"dur":169,"src":"broll/tcestufa/av_w026.mp4"},{"k":27,"from":32337,"dur":77,"src":"broll/tcestufa/av_w027.mp4"},{"k":28,"from":32667,"dur":129,"src":"broll/tcestufa/av_w028.mp4"},{"k":29,"from":33503,"dur":232,"src":"broll/tcestufa/av_w029.mp4"},{"k":30,"from":34610,"dur":289,"src":"broll/tcestufa/av_w030.mp4"},{"k":31,"from":35133,"dur":117,"src":"broll/tcestufa/av_w031.mp4"},{"k":32,"from":35364,"dur":354,"src":"broll/tcestufa/av_w032.mp4"},{"k":33,"from":35857,"dur":638,"src":"broll/tcestufa/av_w033.mp4"}];

export const MainTcestufa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tcestufa/tcestufa_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TCESTUFA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TCESTUFA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tcestufa.m4a")} />
    </AbsoluteFill>
  );
};
