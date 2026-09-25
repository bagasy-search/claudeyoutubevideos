// Main_cmepaneles.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEPANELES } from "./cues_cmepaneles.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEPANELES = 40635;

const VENTANAS = [{"k":0,"from":0,"dur":132,"src":"broll/cmepaneles/av_w000.mp4"},{"k":1,"from":740,"dur":371,"src":"broll/cmepaneles/av_w001.mp4"},{"k":2,"from":1759,"dur":555,"src":"broll/cmepaneles/av_w002.mp4"},{"k":3,"from":3620,"dur":104,"src":"broll/cmepaneles/av_w003.mp4"},{"k":4,"from":3838,"dur":151,"src":"broll/cmepaneles/av_w004.mp4"},{"k":5,"from":4222,"dur":207,"src":"broll/cmepaneles/av_w005.mp4"},{"k":6,"from":5835,"dur":101,"src":"broll/cmepaneles/av_w006.mp4"},{"k":7,"from":6148,"dur":335,"src":"broll/cmepaneles/av_w007.mp4"},{"k":8,"from":7235,"dur":72,"src":"broll/cmepaneles/av_w008.mp4"},{"k":9,"from":7929,"dur":154,"src":"broll/cmepaneles/av_w009.mp4"},{"k":10,"from":8681,"dur":215,"src":"broll/cmepaneles/av_w010.mp4"},{"k":11,"from":9275,"dur":149,"src":"broll/cmepaneles/av_w011.mp4"},{"k":12,"from":9813,"dur":99,"src":"broll/cmepaneles/av_w012.mp4"},{"k":13,"from":10210,"dur":84,"src":"broll/cmepaneles/av_w013.mp4"},{"k":14,"from":10415,"dur":305,"src":"broll/cmepaneles/av_w014.mp4"},{"k":15,"from":10867,"dur":168,"src":"broll/cmepaneles/av_w015.mp4"},{"k":16,"from":11974,"dur":177,"src":"broll/cmepaneles/av_w016.mp4"},{"k":17,"from":13507,"dur":104,"src":"broll/cmepaneles/av_w017.mp4"},{"k":18,"from":13973,"dur":71,"src":"broll/cmepaneles/av_w018.mp4"},{"k":19,"from":14143,"dur":139,"src":"broll/cmepaneles/av_w019.mp4"},{"k":20,"from":14421,"dur":155,"src":"broll/cmepaneles/av_w020.mp4"},{"k":21,"from":14783,"dur":375,"src":"broll/cmepaneles/av_w021.mp4"},{"k":22,"from":15662,"dur":187,"src":"broll/cmepaneles/av_w022.mp4"},{"k":23,"from":16004,"dur":175,"src":"broll/cmepaneles/av_w023.mp4"},{"k":24,"from":16546,"dur":153,"src":"broll/cmepaneles/av_w024.mp4"},{"k":25,"from":17159,"dur":78,"src":"broll/cmepaneles/av_w025.mp4"},{"k":26,"from":17663,"dur":272,"src":"broll/cmepaneles/av_w026.mp4"},{"k":27,"from":18134,"dur":171,"src":"broll/cmepaneles/av_w027.mp4"},{"k":28,"from":18577,"dur":157,"src":"broll/cmepaneles/av_w028.mp4"},{"k":29,"from":19938,"dur":184,"src":"broll/cmepaneles/av_w029.mp4"},{"k":30,"from":20182,"dur":190,"src":"broll/cmepaneles/av_w030.mp4"},{"k":31,"from":20605,"dur":454,"src":"broll/cmepaneles/av_w031.mp4"},{"k":32,"from":21711,"dur":113,"src":"broll/cmepaneles/av_w032.mp4"},{"k":33,"from":22451,"dur":69,"src":"broll/cmepaneles/av_w033.mp4"},{"k":34,"from":23443,"dur":221,"src":"broll/cmepaneles/av_w034.mp4"},{"k":35,"from":24359,"dur":366,"src":"broll/cmepaneles/av_w035.mp4"},{"k":36,"from":25981,"dur":269,"src":"broll/cmepaneles/av_w036.mp4"},{"k":37,"from":27462,"dur":108,"src":"broll/cmepaneles/av_w037.mp4"},{"k":38,"from":28750,"dur":168,"src":"broll/cmepaneles/av_w038.mp4"},{"k":39,"from":29224,"dur":386,"src":"broll/cmepaneles/av_w039.mp4"},{"k":40,"from":30979,"dur":105,"src":"broll/cmepaneles/av_w040.mp4"},{"k":41,"from":31176,"dur":336,"src":"broll/cmepaneles/av_w041.mp4"},{"k":42,"from":31954,"dur":133,"src":"broll/cmepaneles/av_w042.mp4"},{"k":43,"from":32619,"dur":221,"src":"broll/cmepaneles/av_w043.mp4"},{"k":44,"from":33278,"dur":390,"src":"broll/cmepaneles/av_w044.mp4"},{"k":45,"from":33836,"dur":162,"src":"broll/cmepaneles/av_w045.mp4"},{"k":46,"from":34468,"dur":129,"src":"broll/cmepaneles/av_w046.mp4"},{"k":47,"from":35371,"dur":91,"src":"broll/cmepaneles/av_w047.mp4"},{"k":48,"from":36593,"dur":191,"src":"broll/cmepaneles/av_w048.mp4"},{"k":49,"from":36901,"dur":451,"src":"broll/cmepaneles/av_w049.mp4"},{"k":50,"from":38420,"dur":199,"src":"broll/cmepaneles/av_w050.mp4"},{"k":51,"from":39911,"dur":723,"src":"broll/cmepaneles/av_w051.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmepaneles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmepaneles/cmepaneles_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEPANELES.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEPANELES.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmepaneles_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
