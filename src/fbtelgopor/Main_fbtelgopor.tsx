// Main_fbtelgopor.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FBTELGOPOR } from "./cues_fbtelgopor.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_FBTELGOPOR = 37135;

const VENTANAS = [{"k":0,"from":0,"dur":156,"src":"broll/fbtelgopor/av_w000.mp4"},{"k":1,"from":440,"dur":66,"src":"broll/fbtelgopor/av_w001.mp4"},{"k":2,"from":782,"dur":68,"src":"broll/fbtelgopor/av_w002.mp4"},{"k":3,"from":1077,"dur":213,"src":"broll/fbtelgopor/av_w003.mp4"},{"k":4,"from":1802,"dur":159,"src":"broll/fbtelgopor/av_w004.mp4"},{"k":5,"from":2175,"dur":219,"src":"broll/fbtelgopor/av_w005.mp4"},{"k":6,"from":3139,"dur":99,"src":"broll/fbtelgopor/av_w006.mp4"},{"k":7,"from":3509,"dur":222,"src":"broll/fbtelgopor/av_w007.mp4"},{"k":8,"from":4643,"dur":95,"src":"broll/fbtelgopor/av_w008.mp4"},{"k":9,"from":5018,"dur":157,"src":"broll/fbtelgopor/av_w009.mp4"},{"k":10,"from":5429,"dur":179,"src":"broll/fbtelgopor/av_w010.mp4"},{"k":11,"from":6586,"dur":264,"src":"broll/fbtelgopor/av_w011.mp4"},{"k":12,"from":7330,"dur":228,"src":"broll/fbtelgopor/av_w012.mp4"},{"k":13,"from":7673,"dur":196,"src":"broll/fbtelgopor/av_w013.mp4"},{"k":14,"from":8564,"dur":135,"src":"broll/fbtelgopor/av_w014.mp4"},{"k":15,"from":8858,"dur":183,"src":"broll/fbtelgopor/av_w015.mp4"},{"k":16,"from":9554,"dur":118,"src":"broll/fbtelgopor/av_w016.mp4"},{"k":17,"from":9809,"dur":192,"src":"broll/fbtelgopor/av_w017.mp4"},{"k":18,"from":10866,"dur":143,"src":"broll/fbtelgopor/av_w018.mp4"},{"k":19,"from":11415,"dur":79,"src":"broll/fbtelgopor/av_w019.mp4"},{"k":20,"from":12250,"dur":58,"src":"broll/fbtelgopor/av_w020.mp4"},{"k":21,"from":13019,"dur":118,"src":"broll/fbtelgopor/av_w021.mp4"},{"k":22,"from":13311,"dur":223,"src":"broll/fbtelgopor/av_w022.mp4"},{"k":23,"from":13645,"dur":123,"src":"broll/fbtelgopor/av_w023.mp4"},{"k":24,"from":14119,"dur":60,"src":"broll/fbtelgopor/av_w024.mp4"},{"k":25,"from":14872,"dur":235,"src":"broll/fbtelgopor/av_w025.mp4"},{"k":26,"from":15640,"dur":175,"src":"broll/fbtelgopor/av_w026.mp4"},{"k":27,"from":16505,"dur":116,"src":"broll/fbtelgopor/av_w027.mp4"},{"k":28,"from":16980,"dur":126,"src":"broll/fbtelgopor/av_w028.mp4"},{"k":29,"from":17582,"dur":158,"src":"broll/fbtelgopor/av_w029.mp4"},{"k":30,"from":17842,"dur":162,"src":"broll/fbtelgopor/av_w030.mp4"},{"k":31,"from":18547,"dur":174,"src":"broll/fbtelgopor/av_w031.mp4"},{"k":32,"from":19541,"dur":100,"src":"broll/fbtelgopor/av_w032.mp4"},{"k":33,"from":20003,"dur":165,"src":"broll/fbtelgopor/av_w033.mp4"},{"k":34,"from":20747,"dur":153,"src":"broll/fbtelgopor/av_w034.mp4"},{"k":35,"from":21083,"dur":233,"src":"broll/fbtelgopor/av_w035.mp4"},{"k":36,"from":21875,"dur":193,"src":"broll/fbtelgopor/av_w036.mp4"},{"k":37,"from":22324,"dur":186,"src":"broll/fbtelgopor/av_w037.mp4"},{"k":38,"from":22918,"dur":71,"src":"broll/fbtelgopor/av_w038.mp4"},{"k":39,"from":23350,"dur":147,"src":"broll/fbtelgopor/av_w039.mp4"},{"k":40,"from":23666,"dur":186,"src":"broll/fbtelgopor/av_w040.mp4"},{"k":41,"from":24307,"dur":102,"src":"broll/fbtelgopor/av_w041.mp4"},{"k":42,"from":24859,"dur":121,"src":"broll/fbtelgopor/av_w042.mp4"},{"k":43,"from":25347,"dur":139,"src":"broll/fbtelgopor/av_w043.mp4"},{"k":44,"from":25919,"dur":220,"src":"broll/fbtelgopor/av_w044.mp4"},{"k":45,"from":26639,"dur":71,"src":"broll/fbtelgopor/av_w045.mp4"},{"k":46,"from":27245,"dur":64,"src":"broll/fbtelgopor/av_w046.mp4"},{"k":47,"from":27839,"dur":137,"src":"broll/fbtelgopor/av_w047.mp4"},{"k":48,"from":28463,"dur":182,"src":"broll/fbtelgopor/av_w048.mp4"},{"k":49,"from":29500,"dur":236,"src":"broll/fbtelgopor/av_w049.mp4"},{"k":50,"from":30213,"dur":170,"src":"broll/fbtelgopor/av_w050.mp4"},{"k":51,"from":30645,"dur":295,"src":"broll/fbtelgopor/av_w051.mp4"},{"k":52,"from":31373,"dur":304,"src":"broll/fbtelgopor/av_w052.mp4"},{"k":53,"from":32093,"dur":127,"src":"broll/fbtelgopor/av_w053.mp4"},{"k":54,"from":32473,"dur":189,"src":"broll/fbtelgopor/av_w054.mp4"},{"k":55,"from":32762,"dur":179,"src":"broll/fbtelgopor/av_w055.mp4"},{"k":56,"from":33403,"dur":140,"src":"broll/fbtelgopor/av_w056.mp4"},{"k":57,"from":33758,"dur":120,"src":"broll/fbtelgopor/av_w057.mp4"},{"k":58,"from":34362,"dur":149,"src":"broll/fbtelgopor/av_w058.mp4"},{"k":59,"from":35524,"dur":116,"src":"broll/fbtelgopor/av_w059.mp4"},{"k":60,"from":36436,"dur":99,"src":"broll/fbtelgopor/av_w060.mp4"},{"k":61,"from":36848,"dur":286,"src":"broll/fbtelgopor/av_w061.mp4"}];

export const MainFbtelgopor: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/fbtelgopor/fbtelgopor_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_FBTELGOPOR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FBTELGOPOR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fbtelgopor.m4a")} />
    </AbsoluteFill>
  );
};
