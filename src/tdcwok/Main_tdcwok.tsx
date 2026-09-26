// Main_tdcwok.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TDCWOK } from "./cues_tdcwok.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TDCWOK = 40120;

const VENTANAS = [{"k":0,"from":30,"dur":128,"src":"broll/tdcwok/av_w000.mp4"},{"k":1,"from":380,"dur":141,"src":"broll/tdcwok/av_w001.mp4"},{"k":2,"from":830,"dur":215,"src":"broll/tdcwok/av_w002.mp4"},{"k":3,"from":1206,"dur":408,"src":"broll/tdcwok/av_w003.mp4"},{"k":4,"from":1721,"dur":162,"src":"broll/tdcwok/av_w004.mp4"},{"k":5,"from":2867,"dur":176,"src":"broll/tdcwok/av_w005.mp4"},{"k":6,"from":3176,"dur":147,"src":"broll/tdcwok/av_w006.mp4"},{"k":7,"from":3439,"dur":202,"src":"broll/tdcwok/av_w007.mp4"},{"k":8,"from":4291,"dur":273,"src":"broll/tdcwok/av_w008.mp4"},{"k":9,"from":5365,"dur":186,"src":"broll/tdcwok/av_w009.mp4"},{"k":10,"from":5749,"dur":188,"src":"broll/tdcwok/av_w010.mp4"},{"k":11,"from":7528,"dur":241,"src":"broll/tdcwok/av_w011.mp4"},{"k":12,"from":8188,"dur":304,"src":"broll/tdcwok/av_w012.mp4"},{"k":13,"from":9661,"dur":133,"src":"broll/tdcwok/av_w013.mp4"},{"k":14,"from":10676,"dur":229,"src":"broll/tdcwok/av_w014.mp4"},{"k":15,"from":11440,"dur":87,"src":"broll/tdcwok/av_w015.mp4"},{"k":16,"from":12188,"dur":206,"src":"broll/tdcwok/av_w016.mp4"},{"k":17,"from":13333,"dur":145,"src":"broll/tdcwok/av_w017.mp4"},{"k":18,"from":13783,"dur":185,"src":"broll/tdcwok/av_w018.mp4"},{"k":19,"from":14798,"dur":243,"src":"broll/tdcwok/av_w019.mp4"},{"k":20,"from":15613,"dur":138,"src":"broll/tdcwok/av_w020.mp4"},{"k":21,"from":16540,"dur":181,"src":"broll/tdcwok/av_w021.mp4"},{"k":22,"from":17194,"dur":160,"src":"broll/tdcwok/av_w022.mp4"},{"k":23,"from":17525,"dur":118,"src":"broll/tdcwok/av_w023.mp4"},{"k":24,"from":18480,"dur":114,"src":"broll/tdcwok/av_w024.mp4"},{"k":25,"from":19478,"dur":141,"src":"broll/tdcwok/av_w025.mp4"},{"k":26,"from":19757,"dur":206,"src":"broll/tdcwok/av_w026.mp4"},{"k":27,"from":20137,"dur":306,"src":"broll/tdcwok/av_w027.mp4"},{"k":28,"from":22119,"dur":199,"src":"broll/tdcwok/av_w028.mp4"},{"k":29,"from":22608,"dur":202,"src":"broll/tdcwok/av_w029.mp4"},{"k":30,"from":23110,"dur":175,"src":"broll/tdcwok/av_w030.mp4"},{"k":31,"from":23569,"dur":128,"src":"broll/tdcwok/av_w031.mp4"},{"k":32,"from":24604,"dur":213,"src":"broll/tdcwok/av_w032.mp4"},{"k":33,"from":25006,"dur":139,"src":"broll/tdcwok/av_w033.mp4"},{"k":34,"from":25331,"dur":135,"src":"broll/tdcwok/av_w034.mp4"},{"k":35,"from":25543,"dur":214,"src":"broll/tdcwok/av_w035.mp4"},{"k":36,"from":26531,"dur":302,"src":"broll/tdcwok/av_w036.mp4"},{"k":37,"from":27970,"dur":198,"src":"broll/tdcwok/av_w037.mp4"},{"k":38,"from":28408,"dur":206,"src":"broll/tdcwok/av_w038.mp4"},{"k":39,"from":28736,"dur":146,"src":"broll/tdcwok/av_w039.mp4"},{"k":40,"from":29086,"dur":162,"src":"broll/tdcwok/av_w040.mp4"},{"k":41,"from":29381,"dur":98,"src":"broll/tdcwok/av_w041.mp4"},{"k":42,"from":29811,"dur":150,"src":"broll/tdcwok/av_w042.mp4"},{"k":43,"from":30920,"dur":153,"src":"broll/tdcwok/av_w043.mp4"},{"k":44,"from":31388,"dur":160,"src":"broll/tdcwok/av_w044.mp4"},{"k":45,"from":31776,"dur":134,"src":"broll/tdcwok/av_w045.mp4"},{"k":46,"from":32419,"dur":175,"src":"broll/tdcwok/av_w046.mp4"},{"k":47,"from":32874,"dur":190,"src":"broll/tdcwok/av_w047.mp4"},{"k":48,"from":33677,"dur":152,"src":"broll/tdcwok/av_w048.mp4"},{"k":49,"from":33992,"dur":82,"src":"broll/tdcwok/av_w049.mp4"},{"k":50,"from":35420,"dur":124,"src":"broll/tdcwok/av_w050.mp4"},{"k":51,"from":36523,"dur":134,"src":"broll/tdcwok/av_w051.mp4"},{"k":52,"from":36762,"dur":191,"src":"broll/tdcwok/av_w052.mp4"},{"k":53,"from":37894,"dur":140,"src":"broll/tdcwok/av_w053.mp4"},{"k":54,"from":38159,"dur":215,"src":"broll/tdcwok/av_w054.mp4"},{"k":55,"from":39364,"dur":398,"src":"broll/tdcwok/av_w055.mp4"},{"k":56,"from":39884,"dur":235,"src":"broll/tdcwok/av_w056.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainTdcwok: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tdcwok/tdcwok_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_TDCWOK.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TDCWOK.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("tdcwok.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
