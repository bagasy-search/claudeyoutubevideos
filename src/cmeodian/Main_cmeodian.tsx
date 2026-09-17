// Main_cmeodian.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEODIAN } from "./cues_cmeodian.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEODIAN = 39701;

const VENTANAS = [{"k":0,"from":0,"dur":114,"src":"broll/cmeodian/av_w000.mp4"},{"k":1,"from":464,"dur":106,"src":"broll/cmeodian/av_w001.mp4"},{"k":2,"from":920,"dur":104,"src":"broll/cmeodian/av_w002.mp4"},{"k":3,"from":1214,"dur":100,"src":"broll/cmeodian/av_w003.mp4"},{"k":4,"from":1696,"dur":145,"src":"broll/cmeodian/av_w004.mp4"},{"k":5,"from":2409,"dur":172,"src":"broll/cmeodian/av_w005.mp4"},{"k":6,"from":3155,"dur":153,"src":"broll/cmeodian/av_w006.mp4"},{"k":7,"from":3764,"dur":152,"src":"broll/cmeodian/av_w007.mp4"},{"k":8,"from":4703,"dur":117,"src":"broll/cmeodian/av_w008.mp4"},{"k":9,"from":5268,"dur":191,"src":"broll/cmeodian/av_w009.mp4"},{"k":10,"from":5773,"dur":79,"src":"broll/cmeodian/av_w010.mp4"},{"k":11,"from":6241,"dur":176,"src":"broll/cmeodian/av_w011.mp4"},{"k":12,"from":6673,"dur":211,"src":"broll/cmeodian/av_w012.mp4"},{"k":13,"from":6992,"dur":124,"src":"broll/cmeodian/av_w013.mp4"},{"k":14,"from":7650,"dur":126,"src":"broll/cmeodian/av_w014.mp4"},{"k":15,"from":8076,"dur":136,"src":"broll/cmeodian/av_w015.mp4"},{"k":16,"from":8911,"dur":215,"src":"broll/cmeodian/av_w016.mp4"},{"k":17,"from":9782,"dur":89,"src":"broll/cmeodian/av_w017.mp4"},{"k":18,"from":10080,"dur":174,"src":"broll/cmeodian/av_w018.mp4"},{"k":19,"from":10809,"dur":96,"src":"broll/cmeodian/av_w019.mp4"},{"k":20,"from":11282,"dur":157,"src":"broll/cmeodian/av_w020.mp4"},{"k":21,"from":11930,"dur":69,"src":"broll/cmeodian/av_w021.mp4"},{"k":22,"from":12780,"dur":165,"src":"broll/cmeodian/av_w022.mp4"},{"k":23,"from":13365,"dur":149,"src":"broll/cmeodian/av_w023.mp4"},{"k":24,"from":13680,"dur":87,"src":"broll/cmeodian/av_w024.mp4"},{"k":25,"from":14013,"dur":116,"src":"broll/cmeodian/av_w025.mp4"},{"k":26,"from":15069,"dur":115,"src":"broll/cmeodian/av_w026.mp4"},{"k":27,"from":15407,"dur":120,"src":"broll/cmeodian/av_w027.mp4"},{"k":28,"from":15894,"dur":186,"src":"broll/cmeodian/av_w028.mp4"},{"k":29,"from":16799,"dur":94,"src":"broll/cmeodian/av_w029.mp4"},{"k":30,"from":17416,"dur":111,"src":"broll/cmeodian/av_w030.mp4"},{"k":31,"from":18291,"dur":136,"src":"broll/cmeodian/av_w031.mp4"},{"k":32,"from":18613,"dur":123,"src":"broll/cmeodian/av_w032.mp4"},{"k":33,"from":18903,"dur":230,"src":"broll/cmeodian/av_w033.mp4"},{"k":34,"from":19918,"dur":76,"src":"broll/cmeodian/av_w034.mp4"},{"k":35,"from":20401,"dur":156,"src":"broll/cmeodian/av_w035.mp4"},{"k":36,"from":20701,"dur":210,"src":"broll/cmeodian/av_w036.mp4"},{"k":37,"from":21209,"dur":113,"src":"broll/cmeodian/av_w037.mp4"},{"k":38,"from":22109,"dur":235,"src":"broll/cmeodian/av_w038.mp4"},{"k":39,"from":23034,"dur":112,"src":"broll/cmeodian/av_w039.mp4"},{"k":40,"from":24143,"dur":177,"src":"broll/cmeodian/av_w040.mp4"},{"k":41,"from":24737,"dur":116,"src":"broll/cmeodian/av_w041.mp4"},{"k":42,"from":24930,"dur":191,"src":"broll/cmeodian/av_w042.mp4"},{"k":43,"from":25809,"dur":394,"src":"broll/cmeodian/av_w043.mp4"},{"k":44,"from":27075,"dur":174,"src":"broll/cmeodian/av_w044.mp4"},{"k":45,"from":27788,"dur":109,"src":"broll/cmeodian/av_w045.mp4"},{"k":46,"from":27953,"dur":186,"src":"broll/cmeodian/av_w046.mp4"},{"k":47,"from":28766,"dur":148,"src":"broll/cmeodian/av_w047.mp4"},{"k":48,"from":29213,"dur":121,"src":"broll/cmeodian/av_w048.mp4"},{"k":49,"from":29585,"dur":122,"src":"broll/cmeodian/av_w049.mp4"},{"k":50,"from":30579,"dur":83,"src":"broll/cmeodian/av_w050.mp4"},{"k":51,"from":30957,"dur":186,"src":"broll/cmeodian/av_w051.mp4"},{"k":52,"from":31710,"dur":104,"src":"broll/cmeodian/av_w052.mp4"},{"k":53,"from":32221,"dur":124,"src":"broll/cmeodian/av_w053.mp4"},{"k":54,"from":32640,"dur":44,"src":"broll/cmeodian/av_w054.mp4"},{"k":55,"from":33161,"dur":190,"src":"broll/cmeodian/av_w055.mp4"},{"k":56,"from":33914,"dur":220,"src":"broll/cmeodian/av_w056.mp4"},{"k":57,"from":34272,"dur":231,"src":"broll/cmeodian/av_w057.mp4"},{"k":58,"from":35109,"dur":126,"src":"broll/cmeodian/av_w058.mp4"},{"k":59,"from":35617,"dur":102,"src":"broll/cmeodian/av_w059.mp4"},{"k":60,"from":35963,"dur":213,"src":"broll/cmeodian/av_w060.mp4"},{"k":61,"from":36396,"dur":131,"src":"broll/cmeodian/av_w061.mp4"},{"k":62,"from":37392,"dur":135,"src":"broll/cmeodian/av_w062.mp4"},{"k":63,"from":37740,"dur":162,"src":"broll/cmeodian/av_w063.mp4"},{"k":64,"from":38100,"dur":153,"src":"broll/cmeodian/av_w064.mp4"},{"k":65,"from":39447,"dur":253,"src":"broll/cmeodian/av_w065.mp4"}];

export const MainCmeodian: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeodian/cmeodian_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_CMEODIAN.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEODIAN.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeodian.m4a")} />
    </AbsoluteFill>
  );
};
