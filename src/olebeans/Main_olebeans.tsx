// Main_olebeans.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OLEBEANS } from "./cues_olebeans.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OLEBEANS = 45159;

const VENTANAS = [{"k":0,"from":30,"dur":142,"src":"broll/olebeans/av_w000.mp4"},{"k":1,"from":800,"dur":303,"src":"broll/olebeans/av_w001.mp4"},{"k":2,"from":2488,"dur":221,"src":"broll/olebeans/av_w002.mp4"},{"k":3,"from":4374,"dur":83,"src":"broll/olebeans/av_w003.mp4"},{"k":4,"from":6288,"dur":284,"src":"broll/olebeans/av_w004.mp4"},{"k":5,"from":6806,"dur":102,"src":"broll/olebeans/av_w005.mp4"},{"k":6,"from":7181,"dur":164,"src":"broll/olebeans/av_w006.mp4"},{"k":7,"from":8069,"dur":152,"src":"broll/olebeans/av_w007.mp4"},{"k":8,"from":8467,"dur":223,"src":"broll/olebeans/av_w008.mp4"},{"k":9,"from":8980,"dur":93,"src":"broll/olebeans/av_w009.mp4"},{"k":10,"from":9553,"dur":142,"src":"broll/olebeans/av_w010.mp4"},{"k":11,"from":11222,"dur":96,"src":"broll/olebeans/av_w011.mp4"},{"k":12,"from":12411,"dur":172,"src":"broll/olebeans/av_w012.mp4"},{"k":13,"from":12737,"dur":164,"src":"broll/olebeans/av_w013.mp4"},{"k":14,"from":13157,"dur":183,"src":"broll/olebeans/av_w014.mp4"},{"k":15,"from":14079,"dur":136,"src":"broll/olebeans/av_w015.mp4"},{"k":16,"from":14708,"dur":121,"src":"broll/olebeans/av_w016.mp4"},{"k":17,"from":15555,"dur":64,"src":"broll/olebeans/av_w017.mp4"},{"k":18,"from":16693,"dur":125,"src":"broll/olebeans/av_w018.mp4"},{"k":19,"from":17560,"dur":166,"src":"broll/olebeans/av_w019.mp4"},{"k":20,"from":18832,"dur":94,"src":"broll/olebeans/av_w020.mp4"},{"k":21,"from":19778,"dur":206,"src":"broll/olebeans/av_w021.mp4"},{"k":22,"from":20153,"dur":186,"src":"broll/olebeans/av_w022.mp4"},{"k":23,"from":20934,"dur":107,"src":"broll/olebeans/av_w023.mp4"},{"k":24,"from":21203,"dur":225,"src":"broll/olebeans/av_w024.mp4"},{"k":25,"from":22417,"dur":157,"src":"broll/olebeans/av_w025.mp4"},{"k":26,"from":24148,"dur":235,"src":"broll/olebeans/av_w026.mp4"},{"k":27,"from":25764,"dur":128,"src":"broll/olebeans/av_w027.mp4"},{"k":28,"from":26396,"dur":153,"src":"broll/olebeans/av_w028.mp4"},{"k":29,"from":27257,"dur":161,"src":"broll/olebeans/av_w029.mp4"},{"k":30,"from":28539,"dur":120,"src":"broll/olebeans/av_w030.mp4"},{"k":31,"from":30173,"dur":128,"src":"broll/olebeans/av_w031.mp4"},{"k":32,"from":30634,"dur":52,"src":"broll/olebeans/av_w032.mp4"},{"k":33,"from":30923,"dur":258,"src":"broll/olebeans/av_w033.mp4"},{"k":34,"from":33865,"dur":100,"src":"broll/olebeans/av_w034.mp4"},{"k":35,"from":34223,"dur":202,"src":"broll/olebeans/av_w035.mp4"},{"k":36,"from":35089,"dur":85,"src":"broll/olebeans/av_w036.mp4"},{"k":37,"from":36813,"dur":70,"src":"broll/olebeans/av_w037.mp4"},{"k":38,"from":37392,"dur":181,"src":"broll/olebeans/av_w038.mp4"},{"k":39,"from":38402,"dur":227,"src":"broll/olebeans/av_w039.mp4"},{"k":40,"from":39458,"dur":164,"src":"broll/olebeans/av_w040.mp4"},{"k":41,"from":40480,"dur":115,"src":"broll/olebeans/av_w041.mp4"},{"k":42,"from":40733,"dur":242,"src":"broll/olebeans/av_w042.mp4"},{"k":43,"from":42872,"dur":123,"src":"broll/olebeans/av_w043.mp4"},{"k":44,"from":44111,"dur":401,"src":"broll/olebeans/av_w044.mp4"},{"k":45,"from":44603,"dur":145,"src":"broll/olebeans/av_w045.mp4"},{"k":46,"from":44974,"dur":184,"src":"broll/olebeans/av_w046.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOlebeans: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0907" }}>
      <PlacaPiso src="img/olebeans/olebeans_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_OLEBEANS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OLEBEANS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("olebeans_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
