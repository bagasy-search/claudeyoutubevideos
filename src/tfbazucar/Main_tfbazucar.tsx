// Main_tfbazucar.tsx — GENERADO por la FÁBRICA (montaje premium). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TFBAZUCAR } from "./cues_tfbazucar.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TFBAZUCAR = 44432;

const VENTANAS = [{"k":0,"from":0,"dur":95,"src":"broll/tfbazucar/av_w000.mp4"},{"k":1,"from":826,"dur":188,"src":"broll/tfbazucar/av_w001.mp4"},{"k":2,"from":1136,"dur":69,"src":"broll/tfbazucar/av_w002.mp4"},{"k":3,"from":1679,"dur":132,"src":"broll/tfbazucar/av_w003.mp4"},{"k":4,"from":2252,"dur":82,"src":"broll/tfbazucar/av_w004.mp4"},{"k":5,"from":2707,"dur":162,"src":"broll/tfbazucar/av_w005.mp4"},{"k":6,"from":2952,"dur":142,"src":"broll/tfbazucar/av_w006.mp4"},{"k":7,"from":3323,"dur":111,"src":"broll/tfbazucar/av_w007.mp4"},{"k":8,"from":3823,"dur":172,"src":"broll/tfbazucar/av_w008.mp4"},{"k":9,"from":5086,"dur":141,"src":"broll/tfbazucar/av_w009.mp4"},{"k":10,"from":5459,"dur":153,"src":"broll/tfbazucar/av_w010.mp4"},{"k":11,"from":5966,"dur":263,"src":"broll/tfbazucar/av_w011.mp4"},{"k":12,"from":6351,"dur":436,"src":"broll/tfbazucar/av_w012.mp4"},{"k":13,"from":7525,"dur":126,"src":"broll/tfbazucar/av_w013.mp4"},{"k":14,"from":7732,"dur":450,"src":"broll/tfbazucar/av_w014.mp4"},{"k":15,"from":8347,"dur":67,"src":"broll/tfbazucar/av_w015.mp4"},{"k":16,"from":9584,"dur":198,"src":"broll/tfbazucar/av_w016.mp4"},{"k":17,"from":10036,"dur":122,"src":"broll/tfbazucar/av_w017.mp4"},{"k":18,"from":10187,"dur":305,"src":"broll/tfbazucar/av_w018.mp4"},{"k":19,"from":10967,"dur":181,"src":"broll/tfbazucar/av_w019.mp4"},{"k":20,"from":11431,"dur":180,"src":"broll/tfbazucar/av_w020.mp4"},{"k":21,"from":11935,"dur":154,"src":"broll/tfbazucar/av_w021.mp4"},{"k":22,"from":12205,"dur":115,"src":"broll/tfbazucar/av_w022.mp4"},{"k":23,"from":12559,"dur":148,"src":"broll/tfbazucar/av_w023.mp4"},{"k":24,"from":13817,"dur":147,"src":"broll/tfbazucar/av_w024.mp4"},{"k":25,"from":15337,"dur":267,"src":"broll/tfbazucar/av_w025.mp4"},{"k":26,"from":15734,"dur":350,"src":"broll/tfbazucar/av_w026.mp4"},{"k":27,"from":16459,"dur":123,"src":"broll/tfbazucar/av_w027.mp4"},{"k":28,"from":18519,"dur":133,"src":"broll/tfbazucar/av_w028.mp4"},{"k":29,"from":21452,"dur":211,"src":"broll/tfbazucar/av_w029.mp4"},{"k":30,"from":22123,"dur":430,"src":"broll/tfbazucar/av_w030.mp4"},{"k":31,"from":22730,"dur":102,"src":"broll/tfbazucar/av_w031.mp4"},{"k":32,"from":23275,"dur":126,"src":"broll/tfbazucar/av_w032.mp4"},{"k":33,"from":23761,"dur":162,"src":"broll/tfbazucar/av_w033.mp4"},{"k":34,"from":24940,"dur":149,"src":"broll/tfbazucar/av_w034.mp4"},{"k":35,"from":25639,"dur":126,"src":"broll/tfbazucar/av_w035.mp4"},{"k":36,"from":26068,"dur":173,"src":"broll/tfbazucar/av_w036.mp4"},{"k":37,"from":27513,"dur":203,"src":"broll/tfbazucar/av_w037.mp4"},{"k":38,"from":27796,"dur":156,"src":"broll/tfbazucar/av_w038.mp4"},{"k":39,"from":29113,"dur":140,"src":"broll/tfbazucar/av_w039.mp4"},{"k":40,"from":29751,"dur":529,"src":"broll/tfbazucar/av_w040.mp4"},{"k":41,"from":31316,"dur":90,"src":"broll/tfbazucar/av_w041.mp4"},{"k":42,"from":32005,"dur":247,"src":"broll/tfbazucar/av_w042.mp4"},{"k":43,"from":32465,"dur":155,"src":"broll/tfbazucar/av_w043.mp4"},{"k":44,"from":34097,"dur":257,"src":"broll/tfbazucar/av_w044.mp4"},{"k":45,"from":35431,"dur":282,"src":"broll/tfbazucar/av_w045.mp4"},{"k":46,"from":36101,"dur":83,"src":"broll/tfbazucar/av_w046.mp4"},{"k":47,"from":36785,"dur":57,"src":"broll/tfbazucar/av_w047.mp4"},{"k":48,"from":37603,"dur":73,"src":"broll/tfbazucar/av_w048.mp4"},{"k":49,"from":38095,"dur":150,"src":"broll/tfbazucar/av_w049.mp4"},{"k":50,"from":38608,"dur":175,"src":"broll/tfbazucar/av_w050.mp4"},{"k":51,"from":39618,"dur":269,"src":"broll/tfbazucar/av_w051.mp4"},{"k":52,"from":39971,"dur":219,"src":"broll/tfbazucar/av_w052.mp4"},{"k":53,"from":42288,"dur":112,"src":"broll/tfbazucar/av_w053.mp4"},{"k":54,"from":42559,"dur":127,"src":"broll/tfbazucar/av_w054.mp4"},{"k":55,"from":43267,"dur":227,"src":"broll/tfbazucar/av_w055.mp4"},{"k":56,"from":43864,"dur":355,"src":"broll/tfbazucar/av_w056.mp4"},{"k":57,"from":44381,"dur":51,"src":"broll/tfbazucar/av_w057.mp4"}];

export const MainTfbazucar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tfbazucar/tfbazucar_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TFBAZUCAR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TFBAZUCAR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tfbazucar.m4a")} />
    </AbsoluteFill>
  );
};
