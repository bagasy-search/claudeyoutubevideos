// Main_cmeinversor.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEINVERSOR } from "./cues_cmeinversor.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEINVERSOR = 32926;

const VENTANAS = [{"k":0,"from":30,"dur":90,"src":"broll/cmeinversor/av_w000.mp4"},{"k":1,"from":497,"dur":346,"src":"broll/cmeinversor/av_w001.mp4"},{"k":2,"from":1072,"dur":274,"src":"broll/cmeinversor/av_w002.mp4"},{"k":3,"from":1476,"dur":109,"src":"broll/cmeinversor/av_w003.mp4"},{"k":4,"from":2576,"dur":286,"src":"broll/cmeinversor/av_w004.mp4"},{"k":5,"from":3129,"dur":284,"src":"broll/cmeinversor/av_w005.mp4"},{"k":6,"from":3861,"dur":251,"src":"broll/cmeinversor/av_w006.mp4"},{"k":7,"from":4690,"dur":172,"src":"broll/cmeinversor/av_w007.mp4"},{"k":8,"from":5016,"dur":157,"src":"broll/cmeinversor/av_w008.mp4"},{"k":9,"from":5899,"dur":141,"src":"broll/cmeinversor/av_w009.mp4"},{"k":10,"from":6328,"dur":376,"src":"broll/cmeinversor/av_w010.mp4"},{"k":11,"from":7084,"dur":154,"src":"broll/cmeinversor/av_w011.mp4"},{"k":12,"from":7796,"dur":164,"src":"broll/cmeinversor/av_w012.mp4"},{"k":13,"from":8397,"dur":157,"src":"broll/cmeinversor/av_w013.mp4"},{"k":14,"from":9541,"dur":95,"src":"broll/cmeinversor/av_w014.mp4"},{"k":15,"from":9741,"dur":95,"src":"broll/cmeinversor/av_w015.mp4"},{"k":16,"from":9965,"dur":148,"src":"broll/cmeinversor/av_w016.mp4"},{"k":17,"from":10341,"dur":185,"src":"broll/cmeinversor/av_w017.mp4"},{"k":18,"from":11017,"dur":210,"src":"broll/cmeinversor/av_w018.mp4"},{"k":19,"from":11363,"dur":132,"src":"broll/cmeinversor/av_w019.mp4"},{"k":20,"from":11845,"dur":240,"src":"broll/cmeinversor/av_w020.mp4"},{"k":21,"from":12453,"dur":341,"src":"broll/cmeinversor/av_w021.mp4"},{"k":22,"from":13951,"dur":63,"src":"broll/cmeinversor/av_w022.mp4"},{"k":23,"from":14558,"dur":122,"src":"broll/cmeinversor/av_w023.mp4"},{"k":24,"from":15059,"dur":255,"src":"broll/cmeinversor/av_w024.mp4"},{"k":25,"from":15546,"dur":188,"src":"broll/cmeinversor/av_w025.mp4"},{"k":26,"from":16865,"dur":167,"src":"broll/cmeinversor/av_w026.mp4"},{"k":27,"from":17782,"dur":131,"src":"broll/cmeinversor/av_w027.mp4"},{"k":28,"from":18112,"dur":189,"src":"broll/cmeinversor/av_w028.mp4"},{"k":29,"from":18412,"dur":141,"src":"broll/cmeinversor/av_w029.mp4"},{"k":30,"from":19160,"dur":252,"src":"broll/cmeinversor/av_w030.mp4"},{"k":31,"from":20006,"dur":200,"src":"broll/cmeinversor/av_w031.mp4"},{"k":32,"from":20544,"dur":167,"src":"broll/cmeinversor/av_w032.mp4"},{"k":33,"from":20911,"dur":154,"src":"broll/cmeinversor/av_w033.mp4"},{"k":34,"from":21696,"dur":86,"src":"broll/cmeinversor/av_w034.mp4"},{"k":35,"from":22395,"dur":175,"src":"broll/cmeinversor/av_w035.mp4"},{"k":36,"from":22981,"dur":292,"src":"broll/cmeinversor/av_w036.mp4"},{"k":37,"from":23471,"dur":120,"src":"broll/cmeinversor/av_w037.mp4"},{"k":38,"from":23701,"dur":124,"src":"broll/cmeinversor/av_w038.mp4"},{"k":39,"from":24296,"dur":91,"src":"broll/cmeinversor/av_w039.mp4"},{"k":40,"from":24820,"dur":282,"src":"broll/cmeinversor/av_w040.mp4"},{"k":41,"from":25860,"dur":70,"src":"broll/cmeinversor/av_w041.mp4"},{"k":42,"from":27145,"dur":168,"src":"broll/cmeinversor/av_w042.mp4"},{"k":43,"from":27712,"dur":126,"src":"broll/cmeinversor/av_w043.mp4"},{"k":44,"from":27997,"dur":134,"src":"broll/cmeinversor/av_w044.mp4"},{"k":45,"from":28212,"dur":254,"src":"broll/cmeinversor/av_w045.mp4"},{"k":46,"from":29097,"dur":246,"src":"broll/cmeinversor/av_w046.mp4"},{"k":47,"from":29489,"dur":64,"src":"broll/cmeinversor/av_w047.mp4"},{"k":48,"from":30365,"dur":205,"src":"broll/cmeinversor/av_w048.mp4"},{"k":49,"from":31101,"dur":108,"src":"broll/cmeinversor/av_w049.mp4"},{"k":50,"from":31461,"dur":122,"src":"broll/cmeinversor/av_w050.mp4"},{"k":51,"from":32043,"dur":151,"src":"broll/cmeinversor/av_w051.mp4"},{"k":52,"from":32359,"dur":566,"src":"broll/cmeinversor/av_w052.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeinversor: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeinversor/cmeinversor_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMEINVERSOR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEINVERSOR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmeinversor_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
