// Main_cmerefripaneles.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEREFRIPANELES } from "./cues_cmerefripaneles.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEREFRIPANELES = 28128;

const VENTANAS = [{"k":0,"from":30,"dur":145,"src":"broll/cmerefripaneles/av_w000.mp4"},{"k":1,"from":526,"dur":148,"src":"broll/cmerefripaneles/av_w001.mp4"},{"k":2,"from":880,"dur":165,"src":"broll/cmerefripaneles/av_w002.mp4"},{"k":3,"from":1193,"dur":111,"src":"broll/cmerefripaneles/av_w003.mp4"},{"k":4,"from":1506,"dur":71,"src":"broll/cmerefripaneles/av_w004.mp4"},{"k":5,"from":1698,"dur":112,"src":"broll/cmerefripaneles/av_w005.mp4"},{"k":6,"from":2509,"dur":244,"src":"broll/cmerefripaneles/av_w006.mp4"},{"k":7,"from":2837,"dur":344,"src":"broll/cmerefripaneles/av_w007.mp4"},{"k":8,"from":3550,"dur":247,"src":"broll/cmerefripaneles/av_w008.mp4"},{"k":9,"from":4424,"dur":135,"src":"broll/cmerefripaneles/av_w009.mp4"},{"k":10,"from":4717,"dur":216,"src":"broll/cmerefripaneles/av_w010.mp4"},{"k":11,"from":5311,"dur":92,"src":"broll/cmerefripaneles/av_w011.mp4"},{"k":12,"from":5732,"dur":147,"src":"broll/cmerefripaneles/av_w012.mp4"},{"k":13,"from":5977,"dur":124,"src":"broll/cmerefripaneles/av_w013.mp4"},{"k":14,"from":6190,"dur":85,"src":"broll/cmerefripaneles/av_w014.mp4"},{"k":15,"from":6872,"dur":90,"src":"broll/cmerefripaneles/av_w015.mp4"},{"k":16,"from":7135,"dur":89,"src":"broll/cmerefripaneles/av_w016.mp4"},{"k":17,"from":10142,"dur":126,"src":"broll/cmerefripaneles/av_w017.mp4"},{"k":18,"from":10366,"dur":67,"src":"broll/cmerefripaneles/av_w018.mp4"},{"k":19,"from":10537,"dur":528,"src":"broll/cmerefripaneles/av_w019.mp4"},{"k":20,"from":11214,"dur":132,"src":"broll/cmerefripaneles/av_w020.mp4"},{"k":21,"from":11834,"dur":121,"src":"broll/cmerefripaneles/av_w021.mp4"},{"k":22,"from":12493,"dur":452,"src":"broll/cmerefripaneles/av_w022.mp4"},{"k":23,"from":13293,"dur":215,"src":"broll/cmerefripaneles/av_w023.mp4"},{"k":24,"from":14408,"dur":209,"src":"broll/cmerefripaneles/av_w024.mp4"},{"k":25,"from":14714,"dur":167,"src":"broll/cmerefripaneles/av_w025.mp4"},{"k":26,"from":15242,"dur":174,"src":"broll/cmerefripaneles/av_w026.mp4"},{"k":27,"from":15647,"dur":110,"src":"broll/cmerefripaneles/av_w027.mp4"},{"k":28,"from":16207,"dur":319,"src":"broll/cmerefripaneles/av_w028.mp4"},{"k":29,"from":17071,"dur":128,"src":"broll/cmerefripaneles/av_w029.mp4"},{"k":30,"from":17346,"dur":253,"src":"broll/cmerefripaneles/av_w030.mp4"},{"k":31,"from":18586,"dur":189,"src":"broll/cmerefripaneles/av_w031.mp4"},{"k":32,"from":18854,"dur":256,"src":"broll/cmerefripaneles/av_w032.mp4"},{"k":33,"from":20132,"dur":149,"src":"broll/cmerefripaneles/av_w033.mp4"},{"k":34,"from":20607,"dur":182,"src":"broll/cmerefripaneles/av_w034.mp4"},{"k":35,"from":21407,"dur":236,"src":"broll/cmerefripaneles/av_w035.mp4"},{"k":36,"from":21833,"dur":87,"src":"broll/cmerefripaneles/av_w036.mp4"},{"k":37,"from":22244,"dur":200,"src":"broll/cmerefripaneles/av_w037.mp4"},{"k":38,"from":22712,"dur":187,"src":"broll/cmerefripaneles/av_w038.mp4"},{"k":39,"from":23230,"dur":87,"src":"broll/cmerefripaneles/av_w039.mp4"},{"k":40,"from":23422,"dur":142,"src":"broll/cmerefripaneles/av_w040.mp4"},{"k":41,"from":24074,"dur":101,"src":"broll/cmerefripaneles/av_w041.mp4"},{"k":42,"from":24515,"dur":258,"src":"broll/cmerefripaneles/av_w042.mp4"},{"k":43,"from":24929,"dur":143,"src":"broll/cmerefripaneles/av_w043.mp4"},{"k":44,"from":25828,"dur":67,"src":"broll/cmerefripaneles/av_w044.mp4"},{"k":45,"from":25980,"dur":123,"src":"broll/cmerefripaneles/av_w045.mp4"},{"k":46,"from":26473,"dur":92,"src":"broll/cmerefripaneles/av_w046.mp4"},{"k":47,"from":26858,"dur":183,"src":"broll/cmerefripaneles/av_w047.mp4"},{"k":48,"from":27083,"dur":89,"src":"broll/cmerefripaneles/av_w048.mp4"},{"k":49,"from":27318,"dur":166,"src":"broll/cmerefripaneles/av_w049.mp4"},{"k":50,"from":27987,"dur":141,"src":"broll/cmerefripaneles/av_w050.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmerefripaneles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmerefripaneles/cmerefripaneles_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMEREFRIPANELES.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEREFRIPANELES.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmerefripaneles_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
