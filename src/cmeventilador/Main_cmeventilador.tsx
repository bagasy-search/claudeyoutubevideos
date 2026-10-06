// Main_cmeventilador.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEVENTILADOR } from "./cues_cmeventilador.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEVENTILADOR = 26685;

const VENTANAS = [{"k":0,"from":30,"dur":169,"src":"broll/cmeventilador/av_w000.mp4"},{"k":1,"from":669,"dur":147,"src":"broll/cmeventilador/av_w001.mp4"},{"k":2,"from":994,"dur":116,"src":"broll/cmeventilador/av_w002.mp4"},{"k":3,"from":1461,"dur":96,"src":"broll/cmeventilador/av_w003.mp4"},{"k":4,"from":1588,"dur":114,"src":"broll/cmeventilador/av_w004.mp4"},{"k":5,"from":2662,"dur":202,"src":"broll/cmeventilador/av_w005.mp4"},{"k":6,"from":3889,"dur":205,"src":"broll/cmeventilador/av_w006.mp4"},{"k":7,"from":4613,"dur":225,"src":"broll/cmeventilador/av_w007.mp4"},{"k":8,"from":5271,"dur":191,"src":"broll/cmeventilador/av_w008.mp4"},{"k":9,"from":5594,"dur":132,"src":"broll/cmeventilador/av_w009.mp4"},{"k":10,"from":5864,"dur":110,"src":"broll/cmeventilador/av_w010.mp4"},{"k":11,"from":6386,"dur":153,"src":"broll/cmeventilador/av_w011.mp4"},{"k":12,"from":7232,"dur":193,"src":"broll/cmeventilador/av_w012.mp4"},{"k":13,"from":7645,"dur":94,"src":"broll/cmeventilador/av_w013.mp4"},{"k":14,"from":8370,"dur":176,"src":"broll/cmeventilador/av_w014.mp4"},{"k":15,"from":9212,"dur":213,"src":"broll/cmeventilador/av_w015.mp4"},{"k":16,"from":10083,"dur":122,"src":"broll/cmeventilador/av_w016.mp4"},{"k":17,"from":10683,"dur":179,"src":"broll/cmeventilador/av_w017.mp4"},{"k":18,"from":11453,"dur":243,"src":"broll/cmeventilador/av_w018.mp4"},{"k":19,"from":12126,"dur":90,"src":"broll/cmeventilador/av_w019.mp4"},{"k":20,"from":12513,"dur":104,"src":"broll/cmeventilador/av_w020.mp4"},{"k":21,"from":12908,"dur":72,"src":"broll/cmeventilador/av_w021.mp4"},{"k":22,"from":13882,"dur":128,"src":"broll/cmeventilador/av_w022.mp4"},{"k":23,"from":14749,"dur":181,"src":"broll/cmeventilador/av_w023.mp4"},{"k":24,"from":15250,"dur":101,"src":"broll/cmeventilador/av_w024.mp4"},{"k":25,"from":15453,"dur":133,"src":"broll/cmeventilador/av_w025.mp4"},{"k":26,"from":15781,"dur":59,"src":"broll/cmeventilador/av_w026.mp4"},{"k":27,"from":16104,"dur":107,"src":"broll/cmeventilador/av_w027.mp4"},{"k":28,"from":16404,"dur":194,"src":"broll/cmeventilador/av_w028.mp4"},{"k":29,"from":16979,"dur":364,"src":"broll/cmeventilador/av_w029.mp4"},{"k":30,"from":17421,"dur":264,"src":"broll/cmeventilador/av_w030.mp4"},{"k":31,"from":18117,"dur":138,"src":"broll/cmeventilador/av_w031.mp4"},{"k":32,"from":18858,"dur":296,"src":"broll/cmeventilador/av_w032.mp4"},{"k":33,"from":19420,"dur":239,"src":"broll/cmeventilador/av_w033.mp4"},{"k":34,"from":19744,"dur":115,"src":"broll/cmeventilador/av_w034.mp4"},{"k":35,"from":20010,"dur":108,"src":"broll/cmeventilador/av_w035.mp4"},{"k":36,"from":20565,"dur":105,"src":"broll/cmeventilador/av_w036.mp4"},{"k":37,"from":21012,"dur":95,"src":"broll/cmeventilador/av_w037.mp4"},{"k":38,"from":21322,"dur":133,"src":"broll/cmeventilador/av_w038.mp4"},{"k":39,"from":21522,"dur":86,"src":"broll/cmeventilador/av_w039.mp4"},{"k":40,"from":22016,"dur":64,"src":"broll/cmeventilador/av_w040.mp4"},{"k":41,"from":22461,"dur":301,"src":"broll/cmeventilador/av_w041.mp4"},{"k":42,"from":23096,"dur":109,"src":"broll/cmeventilador/av_w042.mp4"},{"k":43,"from":23278,"dur":71,"src":"broll/cmeventilador/av_w043.mp4"},{"k":44,"from":23922,"dur":99,"src":"broll/cmeventilador/av_w044.mp4"},{"k":45,"from":24204,"dur":155,"src":"broll/cmeventilador/av_w045.mp4"},{"k":46,"from":25373,"dur":293,"src":"broll/cmeventilador/av_w046.mp4"},{"k":47,"from":25835,"dur":213,"src":"broll/cmeventilador/av_w047.mp4"},{"k":48,"from":26457,"dur":228,"src":"broll/cmeventilador/av_w048.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeventilador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeventilador/cmeventilador_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMEVENTILADOR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEVENTILADOR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmeventilador_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
