// Main_tfbsilicona.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TFBSILICONA } from "./cues_tfbsilicona.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TFBSILICONA = 44041;

const VENTANAS = [{"k":0,"from":0,"dur":204,"src":"broll/tfbsilicona/av_w000.mp4"},{"k":1,"from":496,"dur":92,"src":"broll/tfbsilicona/av_w001.mp4"},{"k":2,"from":1049,"dur":62,"src":"broll/tfbsilicona/av_w002.mp4"},{"k":3,"from":1775,"dur":106,"src":"broll/tfbsilicona/av_w003.mp4"},{"k":4,"from":2114,"dur":229,"src":"broll/tfbsilicona/av_w004.mp4"},{"k":5,"from":3041,"dur":74,"src":"broll/tfbsilicona/av_w005.mp4"},{"k":6,"from":3155,"dur":142,"src":"broll/tfbsilicona/av_w006.mp4"},{"k":7,"from":3869,"dur":157,"src":"broll/tfbsilicona/av_w007.mp4"},{"k":8,"from":4604,"dur":98,"src":"broll/tfbsilicona/av_w008.mp4"},{"k":9,"from":4999,"dur":117,"src":"broll/tfbsilicona/av_w009.mp4"},{"k":10,"from":5771,"dur":89,"src":"broll/tfbsilicona/av_w010.mp4"},{"k":11,"from":6121,"dur":337,"src":"broll/tfbsilicona/av_w011.mp4"},{"k":12,"from":6542,"dur":93,"src":"broll/tfbsilicona/av_w012.mp4"},{"k":13,"from":7059,"dur":101,"src":"broll/tfbsilicona/av_w013.mp4"},{"k":14,"from":8089,"dur":223,"src":"broll/tfbsilicona/av_w014.mp4"},{"k":15,"from":8430,"dur":240,"src":"broll/tfbsilicona/av_w015.mp4"},{"k":16,"from":9922,"dur":84,"src":"broll/tfbsilicona/av_w016.mp4"},{"k":17,"from":11009,"dur":257,"src":"broll/tfbsilicona/av_w017.mp4"},{"k":18,"from":12271,"dur":69,"src":"broll/tfbsilicona/av_w018.mp4"},{"k":19,"from":12979,"dur":193,"src":"broll/tfbsilicona/av_w019.mp4"},{"k":20,"from":14365,"dur":157,"src":"broll/tfbsilicona/av_w020.mp4"},{"k":21,"from":14708,"dur":119,"src":"broll/tfbsilicona/av_w021.mp4"},{"k":22,"from":15290,"dur":141,"src":"broll/tfbsilicona/av_w022.mp4"},{"k":23,"from":15634,"dur":436,"src":"broll/tfbsilicona/av_w023.mp4"},{"k":24,"from":16439,"dur":183,"src":"broll/tfbsilicona/av_w024.mp4"},{"k":25,"from":17151,"dur":134,"src":"broll/tfbsilicona/av_w025.mp4"},{"k":26,"from":18308,"dur":150,"src":"broll/tfbsilicona/av_w026.mp4"},{"k":27,"from":18549,"dur":88,"src":"broll/tfbsilicona/av_w027.mp4"},{"k":28,"from":20179,"dur":63,"src":"broll/tfbsilicona/av_w028.mp4"},{"k":29,"from":20453,"dur":179,"src":"broll/tfbsilicona/av_w029.mp4"},{"k":30,"from":20806,"dur":120,"src":"broll/tfbsilicona/av_w030.mp4"},{"k":31,"from":21220,"dur":171,"src":"broll/tfbsilicona/av_w031.mp4"},{"k":32,"from":21848,"dur":139,"src":"broll/tfbsilicona/av_w032.mp4"},{"k":33,"from":22455,"dur":137,"src":"broll/tfbsilicona/av_w033.mp4"},{"k":34,"from":23429,"dur":168,"src":"broll/tfbsilicona/av_w034.mp4"},{"k":35,"from":24657,"dur":62,"src":"broll/tfbsilicona/av_w035.mp4"},{"k":36,"from":25279,"dur":123,"src":"broll/tfbsilicona/av_w036.mp4"},{"k":37,"from":25864,"dur":193,"src":"broll/tfbsilicona/av_w037.mp4"},{"k":38,"from":26236,"dur":62,"src":"broll/tfbsilicona/av_w038.mp4"},{"k":39,"from":27008,"dur":188,"src":"broll/tfbsilicona/av_w039.mp4"},{"k":40,"from":27596,"dur":303,"src":"broll/tfbsilicona/av_w040.mp4"},{"k":41,"from":28106,"dur":297,"src":"broll/tfbsilicona/av_w041.mp4"},{"k":42,"from":28645,"dur":136,"src":"broll/tfbsilicona/av_w042.mp4"},{"k":43,"from":29179,"dur":164,"src":"broll/tfbsilicona/av_w043.mp4"},{"k":44,"from":29590,"dur":211,"src":"broll/tfbsilicona/av_w044.mp4"},{"k":45,"from":30295,"dur":278,"src":"broll/tfbsilicona/av_w045.mp4"},{"k":46,"from":30725,"dur":120,"src":"broll/tfbsilicona/av_w046.mp4"},{"k":47,"from":31592,"dur":192,"src":"broll/tfbsilicona/av_w047.mp4"},{"k":48,"from":34097,"dur":119,"src":"broll/tfbsilicona/av_w048.mp4"},{"k":49,"from":35460,"dur":145,"src":"broll/tfbsilicona/av_w049.mp4"},{"k":50,"from":35888,"dur":62,"src":"broll/tfbsilicona/av_w050.mp4"},{"k":51,"from":36539,"dur":182,"src":"broll/tfbsilicona/av_w051.mp4"},{"k":52,"from":37646,"dur":88,"src":"broll/tfbsilicona/av_w052.mp4"},{"k":53,"from":38198,"dur":75,"src":"broll/tfbsilicona/av_w053.mp4"},{"k":54,"from":38411,"dur":131,"src":"broll/tfbsilicona/av_w054.mp4"},{"k":55,"from":38655,"dur":131,"src":"broll/tfbsilicona/av_w055.mp4"},{"k":56,"from":39263,"dur":149,"src":"broll/tfbsilicona/av_w056.mp4"},{"k":57,"from":39724,"dur":200,"src":"broll/tfbsilicona/av_w057.mp4"},{"k":58,"from":40426,"dur":318,"src":"broll/tfbsilicona/av_w058.mp4"},{"k":59,"from":41122,"dur":144,"src":"broll/tfbsilicona/av_w059.mp4"},{"k":60,"from":42208,"dur":151,"src":"broll/tfbsilicona/av_w060.mp4"},{"k":61,"from":42858,"dur":178,"src":"broll/tfbsilicona/av_w061.mp4"},{"k":62,"from":43266,"dur":310,"src":"broll/tfbsilicona/av_w062.mp4"},{"k":63,"from":43727,"dur":313,"src":"broll/tfbsilicona/av_w063.mp4"}];

export const MainTfbsilicona: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tfbsilicona/tfbsilicona_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TFBSILICONA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TFBSILICONA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tfbsilicona.m4a")} />
    </AbsoluteFill>
  );
};
