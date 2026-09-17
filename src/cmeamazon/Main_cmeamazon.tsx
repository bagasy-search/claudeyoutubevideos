// Main_cmeamazon.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEAMAZON } from "./cues_cmeamazon.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEAMAZON = 42048;

const VENTANAS = [{"k":0,"from":0,"dur":90,"src":"broll/cmeamazon/av_w000.mp4"},{"k":1,"from":390,"dur":72,"src":"broll/cmeamazon/av_w001.mp4"},{"k":2,"from":787,"dur":57,"src":"broll/cmeamazon/av_w002.mp4"},{"k":3,"from":1051,"dur":118,"src":"broll/cmeamazon/av_w003.mp4"},{"k":4,"from":1393,"dur":108,"src":"broll/cmeamazon/av_w004.mp4"},{"k":5,"from":1639,"dur":71,"src":"broll/cmeamazon/av_w005.mp4"},{"k":6,"from":2280,"dur":165,"src":"broll/cmeamazon/av_w006.mp4"},{"k":7,"from":3050,"dur":186,"src":"broll/cmeamazon/av_w007.mp4"},{"k":8,"from":3643,"dur":288,"src":"broll/cmeamazon/av_w008.mp4"},{"k":9,"from":5750,"dur":171,"src":"broll/cmeamazon/av_w009.mp4"},{"k":10,"from":6406,"dur":183,"src":"broll/cmeamazon/av_w010.mp4"},{"k":11,"from":6710,"dur":156,"src":"broll/cmeamazon/av_w011.mp4"},{"k":12,"from":8005,"dur":203,"src":"broll/cmeamazon/av_w012.mp4"},{"k":13,"from":8970,"dur":181,"src":"broll/cmeamazon/av_w013.mp4"},{"k":14,"from":9619,"dur":184,"src":"broll/cmeamazon/av_w014.mp4"},{"k":15,"from":10437,"dur":223,"src":"broll/cmeamazon/av_w015.mp4"},{"k":16,"from":12031,"dur":190,"src":"broll/cmeamazon/av_w016.mp4"},{"k":17,"from":12631,"dur":112,"src":"broll/cmeamazon/av_w017.mp4"},{"k":18,"from":13669,"dur":139,"src":"broll/cmeamazon/av_w018.mp4"},{"k":19,"from":14140,"dur":169,"src":"broll/cmeamazon/av_w019.mp4"},{"k":20,"from":14560,"dur":171,"src":"broll/cmeamazon/av_w020.mp4"},{"k":21,"from":15310,"dur":219,"src":"broll/cmeamazon/av_w021.mp4"},{"k":22,"from":15979,"dur":162,"src":"broll/cmeamazon/av_w022.mp4"},{"k":23,"from":16594,"dur":175,"src":"broll/cmeamazon/av_w023.mp4"},{"k":24,"from":17248,"dur":181,"src":"broll/cmeamazon/av_w024.mp4"},{"k":25,"from":18463,"dur":172,"src":"broll/cmeamazon/av_w025.mp4"},{"k":26,"from":19073,"dur":284,"src":"broll/cmeamazon/av_w026.mp4"},{"k":27,"from":20313,"dur":132,"src":"broll/cmeamazon/av_w027.mp4"},{"k":28,"from":20662,"dur":91,"src":"broll/cmeamazon/av_w028.mp4"},{"k":29,"from":21361,"dur":183,"src":"broll/cmeamazon/av_w029.mp4"},{"k":30,"from":21694,"dur":171,"src":"broll/cmeamazon/av_w030.mp4"},{"k":31,"from":23061,"dur":147,"src":"broll/cmeamazon/av_w031.mp4"},{"k":32,"from":24136,"dur":196,"src":"broll/cmeamazon/av_w032.mp4"},{"k":33,"from":24610,"dur":145,"src":"broll/cmeamazon/av_w033.mp4"},{"k":34,"from":25241,"dur":93,"src":"broll/cmeamazon/av_w034.mp4"},{"k":35,"from":25471,"dur":206,"src":"broll/cmeamazon/av_w035.mp4"},{"k":36,"from":26118,"dur":148,"src":"broll/cmeamazon/av_w036.mp4"},{"k":37,"from":26666,"dur":152,"src":"broll/cmeamazon/av_w037.mp4"},{"k":38,"from":27316,"dur":195,"src":"broll/cmeamazon/av_w038.mp4"},{"k":39,"from":29083,"dur":85,"src":"broll/cmeamazon/av_w039.mp4"},{"k":40,"from":29645,"dur":171,"src":"broll/cmeamazon/av_w040.mp4"},{"k":41,"from":30743,"dur":258,"src":"broll/cmeamazon/av_w041.mp4"},{"k":42,"from":31477,"dur":320,"src":"broll/cmeamazon/av_w042.mp4"},{"k":43,"from":33428,"dur":155,"src":"broll/cmeamazon/av_w043.mp4"},{"k":44,"from":34193,"dur":186,"src":"broll/cmeamazon/av_w044.mp4"},{"k":45,"from":34662,"dur":158,"src":"broll/cmeamazon/av_w045.mp4"},{"k":46,"from":34931,"dur":197,"src":"broll/cmeamazon/av_w046.mp4"},{"k":47,"from":35434,"dur":117,"src":"broll/cmeamazon/av_w047.mp4"},{"k":48,"from":35885,"dur":174,"src":"broll/cmeamazon/av_w048.mp4"},{"k":49,"from":36962,"dur":177,"src":"broll/cmeamazon/av_w049.mp4"},{"k":50,"from":37290,"dur":303,"src":"broll/cmeamazon/av_w050.mp4"},{"k":51,"from":38006,"dur":111,"src":"broll/cmeamazon/av_w051.mp4"},{"k":52,"from":38203,"dur":147,"src":"broll/cmeamazon/av_w052.mp4"},{"k":53,"from":38576,"dur":138,"src":"broll/cmeamazon/av_w053.mp4"},{"k":54,"from":39200,"dur":155,"src":"broll/cmeamazon/av_w054.mp4"},{"k":55,"from":39941,"dur":151,"src":"broll/cmeamazon/av_w055.mp4"},{"k":56,"from":40376,"dur":219,"src":"broll/cmeamazon/av_w056.mp4"},{"k":57,"from":40655,"dur":108,"src":"broll/cmeamazon/av_w057.mp4"},{"k":58,"from":41410,"dur":73,"src":"broll/cmeamazon/av_w058.mp4"},{"k":59,"from":41846,"dur":202,"src":"broll/cmeamazon/av_w059.mp4"}];

export const MainCmeamazon: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeamazon/cmeamazon_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_CMEAMAZON.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEAMAZON.filter((c) => c.capa === "comp").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEAMAZON.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeamazon.m4a")} />
      <Audio src={staticFile("sfx/amb_cmeamazon.mp3")} />
    </AbsoluteFill>
  );
};
