// Main_cme150.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CME150 } from "./cues_cme150.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CME150 = 45218;

const VENTANAS = [{"k":0,"from":0,"dur":157,"src":"broll/cme150/av_w000.mp4"},{"k":1,"from":349,"dur":179,"src":"broll/cme150/av_w001.mp4"},{"k":2,"from":798,"dur":607,"src":"broll/cme150/av_w002.mp4"},{"k":3,"from":1980,"dur":143,"src":"broll/cme150/av_w003.mp4"},{"k":4,"from":2348,"dur":198,"src":"broll/cme150/av_w004.mp4"},{"k":5,"from":2650,"dur":224,"src":"broll/cme150/av_w005.mp4"},{"k":6,"from":4244,"dur":454,"src":"broll/cme150/av_w006.mp4"},{"k":7,"from":4847,"dur":254,"src":"broll/cme150/av_w007.mp4"},{"k":8,"from":5593,"dur":127,"src":"broll/cme150/av_w008.mp4"},{"k":9,"from":6102,"dur":95,"src":"broll/cme150/av_w009.mp4"},{"k":10,"from":6309,"dur":197,"src":"broll/cme150/av_w010.mp4"},{"k":11,"from":6928,"dur":114,"src":"broll/cme150/av_w011.mp4"},{"k":12,"from":7401,"dur":129,"src":"broll/cme150/av_w012.mp4"},{"k":13,"from":8145,"dur":526,"src":"broll/cme150/av_w013.mp4"},{"k":14,"from":8866,"dur":255,"src":"broll/cme150/av_w014.mp4"},{"k":15,"from":9835,"dur":141,"src":"broll/cme150/av_w015.mp4"},{"k":16,"from":10199,"dur":173,"src":"broll/cme150/av_w016.mp4"},{"k":17,"from":11033,"dur":266,"src":"broll/cme150/av_w017.mp4"},{"k":18,"from":11410,"dur":278,"src":"broll/cme150/av_w018.mp4"},{"k":19,"from":12396,"dur":469,"src":"broll/cme150/av_w019.mp4"},{"k":20,"from":14563,"dur":279,"src":"broll/cme150/av_w020.mp4"},{"k":21,"from":14976,"dur":202,"src":"broll/cme150/av_w021.mp4"},{"k":22,"from":15560,"dur":182,"src":"broll/cme150/av_w022.mp4"},{"k":23,"from":16330,"dur":131,"src":"broll/cme150/av_w023.mp4"},{"k":24,"from":16790,"dur":234,"src":"broll/cme150/av_w024.mp4"},{"k":25,"from":17518,"dur":127,"src":"broll/cme150/av_w025.mp4"},{"k":26,"from":18888,"dur":95,"src":"broll/cme150/av_w026.mp4"},{"k":27,"from":19459,"dur":112,"src":"broll/cme150/av_w027.mp4"},{"k":28,"from":19754,"dur":261,"src":"broll/cme150/av_w028.mp4"},{"k":29,"from":20758,"dur":79,"src":"broll/cme150/av_w029.mp4"},{"k":30,"from":21001,"dur":204,"src":"broll/cme150/av_w030.mp4"},{"k":31,"from":21794,"dur":230,"src":"broll/cme150/av_w031.mp4"},{"k":32,"from":22235,"dur":574,"src":"broll/cme150/av_w032.mp4"},{"k":33,"from":23623,"dur":114,"src":"broll/cme150/av_w033.mp4"},{"k":34,"from":24326,"dur":88,"src":"broll/cme150/av_w034.mp4"},{"k":35,"from":24725,"dur":59,"src":"broll/cme150/av_w035.mp4"},{"k":36,"from":25173,"dur":132,"src":"broll/cme150/av_w036.mp4"},{"k":37,"from":26053,"dur":79,"src":"broll/cme150/av_w037.mp4"},{"k":38,"from":26335,"dur":160,"src":"broll/cme150/av_w038.mp4"},{"k":39,"from":27311,"dur":259,"src":"broll/cme150/av_w039.mp4"},{"k":40,"from":28147,"dur":139,"src":"broll/cme150/av_w040.mp4"},{"k":41,"from":30062,"dur":377,"src":"broll/cme150/av_w041.mp4"},{"k":42,"from":30490,"dur":145,"src":"broll/cme150/av_w042.mp4"},{"k":43,"from":31216,"dur":330,"src":"broll/cme150/av_w043.mp4"},{"k":44,"from":31828,"dur":134,"src":"broll/cme150/av_w044.mp4"},{"k":45,"from":32187,"dur":84,"src":"broll/cme150/av_w045.mp4"},{"k":46,"from":33190,"dur":169,"src":"broll/cme150/av_w046.mp4"},{"k":47,"from":34129,"dur":41,"src":"broll/cme150/av_w047.mp4"},{"k":48,"from":35056,"dur":217,"src":"broll/cme150/av_w048.mp4"},{"k":49,"from":36233,"dur":154,"src":"broll/cme150/av_w049.mp4"},{"k":50,"from":36770,"dur":135,"src":"broll/cme150/av_w050.mp4"},{"k":51,"from":37028,"dur":136,"src":"broll/cme150/av_w051.mp4"},{"k":52,"from":37452,"dur":253,"src":"broll/cme150/av_w052.mp4"},{"k":53,"from":37807,"dur":116,"src":"broll/cme150/av_w053.mp4"},{"k":54,"from":38239,"dur":151,"src":"broll/cme150/av_w054.mp4"},{"k":55,"from":39146,"dur":165,"src":"broll/cme150/av_w055.mp4"},{"k":56,"from":39589,"dur":196,"src":"broll/cme150/av_w056.mp4"},{"k":57,"from":39859,"dur":309,"src":"broll/cme150/av_w057.mp4"},{"k":58,"from":41495,"dur":112,"src":"broll/cme150/av_w058.mp4"},{"k":59,"from":42628,"dur":100,"src":"broll/cme150/av_w059.mp4"},{"k":60,"from":42983,"dur":257,"src":"broll/cme150/av_w060.mp4"},{"k":61,"from":43916,"dur":681,"src":"broll/cme150/av_w061.mp4"},{"k":62,"from":44726,"dur":152,"src":"broll/cme150/av_w062.mp4"}];

export const MainCme150: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cme150/cme150_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_CME150.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CME150.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cme150.m4a")} />
    </AbsoluteFill>
  );
};
