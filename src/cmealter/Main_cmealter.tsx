// Main_cmealter.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEALTER } from "./cues_cmealter.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEALTER = 45520;

const VENTANAS = [{"k":0,"from":0,"dur":90,"src":"broll/cmealter/av_w000.mp4"},{"k":1,"from":1085,"dur":158,"src":"broll/cmealter/av_w001.mp4"},{"k":2,"from":1537,"dur":322,"src":"broll/cmealter/av_w002.mp4"},{"k":3,"from":2845,"dur":115,"src":"broll/cmealter/av_w003.mp4"},{"k":4,"from":3189,"dur":172,"src":"broll/cmealter/av_w004.mp4"},{"k":5,"from":3848,"dur":234,"src":"broll/cmealter/av_w005.mp4"},{"k":6,"from":4774,"dur":642,"src":"broll/cmealter/av_w006.mp4"},{"k":7,"from":6557,"dur":116,"src":"broll/cmealter/av_w007.mp4"},{"k":8,"from":7982,"dur":93,"src":"broll/cmealter/av_w008.mp4"},{"k":9,"from":9496,"dur":210,"src":"broll/cmealter/av_w009.mp4"},{"k":10,"from":9946,"dur":201,"src":"broll/cmealter/av_w010.mp4"},{"k":11,"from":11370,"dur":167,"src":"broll/cmealter/av_w011.mp4"},{"k":12,"from":11855,"dur":163,"src":"broll/cmealter/av_w012.mp4"},{"k":13,"from":12841,"dur":286,"src":"broll/cmealter/av_w013.mp4"},{"k":14,"from":13225,"dur":216,"src":"broll/cmealter/av_w014.mp4"},{"k":15,"from":13637,"dur":89,"src":"broll/cmealter/av_w015.mp4"},{"k":16,"from":13947,"dur":173,"src":"broll/cmealter/av_w016.mp4"},{"k":17,"from":14427,"dur":121,"src":"broll/cmealter/av_w017.mp4"},{"k":18,"from":15909,"dur":205,"src":"broll/cmealter/av_w018.mp4"},{"k":19,"from":16436,"dur":338,"src":"broll/cmealter/av_w019.mp4"},{"k":20,"from":17067,"dur":179,"src":"broll/cmealter/av_w020.mp4"},{"k":21,"from":17975,"dur":171,"src":"broll/cmealter/av_w021.mp4"},{"k":22,"from":18334,"dur":144,"src":"broll/cmealter/av_w022.mp4"},{"k":23,"from":18869,"dur":146,"src":"broll/cmealter/av_w023.mp4"},{"k":24,"from":20222,"dur":281,"src":"broll/cmealter/av_w024.mp4"},{"k":25,"from":20864,"dur":164,"src":"broll/cmealter/av_w025.mp4"},{"k":26,"from":21202,"dur":188,"src":"broll/cmealter/av_w026.mp4"},{"k":27,"from":21545,"dur":117,"src":"broll/cmealter/av_w027.mp4"},{"k":28,"from":22266,"dur":314,"src":"broll/cmealter/av_w028.mp4"},{"k":29,"from":22880,"dur":185,"src":"broll/cmealter/av_w029.mp4"},{"k":30,"from":23510,"dur":98,"src":"broll/cmealter/av_w030.mp4"},{"k":31,"from":23725,"dur":246,"src":"broll/cmealter/av_w031.mp4"},{"k":32,"from":24375,"dur":151,"src":"broll/cmealter/av_w032.mp4"},{"k":33,"from":24891,"dur":688,"src":"broll/cmealter/av_w033.mp4"},{"k":34,"from":25649,"dur":209,"src":"broll/cmealter/av_w034.mp4"},{"k":35,"from":26647,"dur":574,"src":"broll/cmealter/av_w035.mp4"},{"k":36,"from":27470,"dur":210,"src":"broll/cmealter/av_w036.mp4"},{"k":37,"from":27949,"dur":124,"src":"broll/cmealter/av_w037.mp4"},{"k":38,"from":29207,"dur":131,"src":"broll/cmealter/av_w038.mp4"},{"k":39,"from":29500,"dur":172,"src":"broll/cmealter/av_w039.mp4"},{"k":40,"from":30233,"dur":159,"src":"broll/cmealter/av_w040.mp4"},{"k":41,"from":30551,"dur":653,"src":"broll/cmealter/av_w041.mp4"},{"k":42,"from":31927,"dur":145,"src":"broll/cmealter/av_w042.mp4"},{"k":43,"from":32336,"dur":222,"src":"broll/cmealter/av_w043.mp4"},{"k":44,"from":32812,"dur":135,"src":"broll/cmealter/av_w044.mp4"},{"k":45,"from":33063,"dur":239,"src":"broll/cmealter/av_w045.mp4"},{"k":46,"from":33401,"dur":122,"src":"broll/cmealter/av_w046.mp4"},{"k":47,"from":34306,"dur":95,"src":"broll/cmealter/av_w047.mp4"},{"k":48,"from":34885,"dur":217,"src":"broll/cmealter/av_w048.mp4"},{"k":49,"from":36236,"dur":258,"src":"broll/cmealter/av_w049.mp4"},{"k":50,"from":36981,"dur":118,"src":"broll/cmealter/av_w050.mp4"},{"k":51,"from":37322,"dur":251,"src":"broll/cmealter/av_w051.mp4"},{"k":52,"from":38562,"dur":503,"src":"broll/cmealter/av_w052.mp4"},{"k":53,"from":39197,"dur":131,"src":"broll/cmealter/av_w053.mp4"},{"k":54,"from":39780,"dur":93,"src":"broll/cmealter/av_w054.mp4"},{"k":55,"from":40126,"dur":153,"src":"broll/cmealter/av_w055.mp4"},{"k":56,"from":40340,"dur":334,"src":"broll/cmealter/av_w056.mp4"},{"k":57,"from":41410,"dur":94,"src":"broll/cmealter/av_w057.mp4"},{"k":58,"from":42416,"dur":162,"src":"broll/cmealter/av_w058.mp4"},{"k":59,"from":43798,"dur":576,"src":"broll/cmealter/av_w059.mp4"},{"k":60,"from":44891,"dur":499,"src":"broll/cmealter/av_w060.mp4"},{"k":61,"from":45437,"dur":83,"src":"broll/cmealter/av_w061.mp4"}];

export const MainCmealter: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmealter/cmealter_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_CMEALTER.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEALTER.filter((c) => c.capa === "comp").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEALTER.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmealter.m4a")} />
    </AbsoluteFill>
  );
};
