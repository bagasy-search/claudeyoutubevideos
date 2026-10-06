// Main_cmelavadora.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMELAVADORA } from "./cues_cmelavadora.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMELAVADORA = 28343;

const VENTANAS = [{"k":0,"from":30,"dur":90,"src":"broll/cmelavadora/av_w000.mp4"},{"k":1,"from":316,"dur":79,"src":"broll/cmelavadora/av_w001.mp4"},{"k":2,"from":713,"dur":153,"src":"broll/cmelavadora/av_w002.mp4"},{"k":3,"from":1304,"dur":155,"src":"broll/cmelavadora/av_w003.mp4"},{"k":4,"from":1582,"dur":154,"src":"broll/cmelavadora/av_w004.mp4"},{"k":5,"from":2900,"dur":236,"src":"broll/cmelavadora/av_w005.mp4"},{"k":6,"from":3511,"dur":130,"src":"broll/cmelavadora/av_w006.mp4"},{"k":7,"from":4240,"dur":183,"src":"broll/cmelavadora/av_w007.mp4"},{"k":8,"from":5078,"dur":79,"src":"broll/cmelavadora/av_w008.mp4"},{"k":9,"from":5331,"dur":195,"src":"broll/cmelavadora/av_w009.mp4"},{"k":10,"from":5606,"dur":173,"src":"broll/cmelavadora/av_w010.mp4"},{"k":11,"from":5879,"dur":215,"src":"broll/cmelavadora/av_w011.mp4"},{"k":12,"from":7246,"dur":471,"src":"broll/cmelavadora/av_w012.mp4"},{"k":13,"from":8894,"dur":126,"src":"broll/cmelavadora/av_w013.mp4"},{"k":14,"from":9972,"dur":161,"src":"broll/cmelavadora/av_w014.mp4"},{"k":15,"from":10286,"dur":222,"src":"broll/cmelavadora/av_w015.mp4"},{"k":16,"from":11492,"dur":164,"src":"broll/cmelavadora/av_w016.mp4"},{"k":17,"from":12301,"dur":159,"src":"broll/cmelavadora/av_w017.mp4"},{"k":18,"from":12643,"dur":414,"src":"broll/cmelavadora/av_w018.mp4"},{"k":19,"from":13483,"dur":153,"src":"broll/cmelavadora/av_w019.mp4"},{"k":20,"from":13858,"dur":169,"src":"broll/cmelavadora/av_w020.mp4"},{"k":21,"from":14116,"dur":126,"src":"broll/cmelavadora/av_w021.mp4"},{"k":22,"from":14406,"dur":353,"src":"broll/cmelavadora/av_w022.mp4"},{"k":23,"from":15150,"dur":97,"src":"broll/cmelavadora/av_w023.mp4"},{"k":24,"from":15340,"dur":123,"src":"broll/cmelavadora/av_w024.mp4"},{"k":25,"from":16200,"dur":130,"src":"broll/cmelavadora/av_w025.mp4"},{"k":26,"from":16395,"dur":157,"src":"broll/cmelavadora/av_w026.mp4"},{"k":27,"from":16865,"dur":186,"src":"broll/cmelavadora/av_w027.mp4"},{"k":28,"from":17213,"dur":121,"src":"broll/cmelavadora/av_w028.mp4"},{"k":29,"from":17575,"dur":328,"src":"broll/cmelavadora/av_w029.mp4"},{"k":30,"from":18043,"dur":110,"src":"broll/cmelavadora/av_w030.mp4"},{"k":31,"from":18985,"dur":100,"src":"broll/cmelavadora/av_w031.mp4"},{"k":32,"from":19241,"dur":93,"src":"broll/cmelavadora/av_w032.mp4"},{"k":33,"from":19503,"dur":269,"src":"broll/cmelavadora/av_w033.mp4"},{"k":34,"from":19796,"dur":175,"src":"broll/cmelavadora/av_w034.mp4"},{"k":35,"from":20409,"dur":86,"src":"broll/cmelavadora/av_w035.mp4"},{"k":36,"from":20756,"dur":159,"src":"broll/cmelavadora/av_w036.mp4"},{"k":37,"from":21214,"dur":215,"src":"broll/cmelavadora/av_w037.mp4"},{"k":38,"from":23579,"dur":108,"src":"broll/cmelavadora/av_w038.mp4"},{"k":39,"from":24215,"dur":273,"src":"broll/cmelavadora/av_w039.mp4"},{"k":40,"from":24581,"dur":104,"src":"broll/cmelavadora/av_w040.mp4"},{"k":41,"from":25125,"dur":317,"src":"broll/cmelavadora/av_w041.mp4"},{"k":42,"from":26938,"dur":200,"src":"broll/cmelavadora/av_w042.mp4"},{"k":43,"from":27231,"dur":153,"src":"broll/cmelavadora/av_w043.mp4"},{"k":44,"from":27448,"dur":185,"src":"broll/cmelavadora/av_w044.mp4"},{"k":45,"from":28193,"dur":150,"src":"broll/cmelavadora/av_w045.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmelavadora: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmelavadora/cmelavadora_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMELAVADORA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMELAVADORA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmelavadora_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
