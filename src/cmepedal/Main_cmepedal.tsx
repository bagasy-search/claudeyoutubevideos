// Main_cmepedal.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEPEDAL } from "./cues_cmepedal.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEPEDAL = 34557;

const VENTANAS = [{"k":0,"from":0,"dur":184,"src":"broll/cmepedal/av_w000.mp4"},{"k":1,"from":389,"dur":152,"src":"broll/cmepedal/av_w001.mp4"},{"k":2,"from":841,"dur":243,"src":"broll/cmepedal/av_w002.mp4"},{"k":3,"from":1407,"dur":118,"src":"broll/cmepedal/av_w003.mp4"},{"k":4,"from":2038,"dur":85,"src":"broll/cmepedal/av_w004.mp4"},{"k":5,"from":2474,"dur":131,"src":"broll/cmepedal/av_w005.mp4"},{"k":6,"from":2752,"dur":81,"src":"broll/cmepedal/av_w006.mp4"},{"k":7,"from":3226,"dur":186,"src":"broll/cmepedal/av_w007.mp4"},{"k":8,"from":4247,"dur":211,"src":"broll/cmepedal/av_w008.mp4"},{"k":9,"from":4654,"dur":247,"src":"broll/cmepedal/av_w009.mp4"},{"k":10,"from":5082,"dur":86,"src":"broll/cmepedal/av_w010.mp4"},{"k":11,"from":6763,"dur":96,"src":"broll/cmepedal/av_w011.mp4"},{"k":12,"from":7270,"dur":252,"src":"broll/cmepedal/av_w012.mp4"},{"k":13,"from":10483,"dur":353,"src":"broll/cmepedal/av_w013.mp4"},{"k":14,"from":11973,"dur":54,"src":"broll/cmepedal/av_w014.mp4"},{"k":15,"from":12281,"dur":71,"src":"broll/cmepedal/av_w015.mp4"},{"k":16,"from":12740,"dur":86,"src":"broll/cmepedal/av_w016.mp4"},{"k":17,"from":13660,"dur":122,"src":"broll/cmepedal/av_w017.mp4"},{"k":18,"from":13970,"dur":100,"src":"broll/cmepedal/av_w018.mp4"},{"k":19,"from":14455,"dur":155,"src":"broll/cmepedal/av_w019.mp4"},{"k":20,"from":15016,"dur":189,"src":"broll/cmepedal/av_w020.mp4"},{"k":21,"from":15548,"dur":143,"src":"broll/cmepedal/av_w021.mp4"},{"k":22,"from":16364,"dur":90,"src":"broll/cmepedal/av_w022.mp4"},{"k":23,"from":16567,"dur":166,"src":"broll/cmepedal/av_w023.mp4"},{"k":24,"from":17445,"dur":65,"src":"broll/cmepedal/av_w024.mp4"},{"k":25,"from":18526,"dur":158,"src":"broll/cmepedal/av_w025.mp4"},{"k":26,"from":19516,"dur":120,"src":"broll/cmepedal/av_w026.mp4"},{"k":27,"from":19789,"dur":441,"src":"broll/cmepedal/av_w027.mp4"},{"k":28,"from":21145,"dur":100,"src":"broll/cmepedal/av_w028.mp4"},{"k":29,"from":22247,"dur":135,"src":"broll/cmepedal/av_w029.mp4"},{"k":30,"from":23237,"dur":177,"src":"broll/cmepedal/av_w030.mp4"},{"k":31,"from":24989,"dur":122,"src":"broll/cmepedal/av_w031.mp4"},{"k":32,"from":25201,"dur":93,"src":"broll/cmepedal/av_w032.mp4"},{"k":33,"from":25714,"dur":202,"src":"broll/cmepedal/av_w033.mp4"},{"k":34,"from":27679,"dur":228,"src":"broll/cmepedal/av_w034.mp4"},{"k":35,"from":27990,"dur":331,"src":"broll/cmepedal/av_w035.mp4"},{"k":36,"from":28900,"dur":419,"src":"broll/cmepedal/av_w036.mp4"},{"k":37,"from":30221,"dur":117,"src":"broll/cmepedal/av_w037.mp4"},{"k":38,"from":30686,"dur":83,"src":"broll/cmepedal/av_w038.mp4"},{"k":39,"from":31415,"dur":101,"src":"broll/cmepedal/av_w039.mp4"},{"k":40,"from":32130,"dur":86,"src":"broll/cmepedal/av_w040.mp4"},{"k":41,"from":32432,"dur":106,"src":"broll/cmepedal/av_w041.mp4"},{"k":42,"from":33117,"dur":172,"src":"broll/cmepedal/av_w042.mp4"},{"k":43,"from":33569,"dur":125,"src":"broll/cmepedal/av_w043.mp4"},{"k":44,"from":33889,"dur":233,"src":"broll/cmepedal/av_w044.mp4"},{"k":45,"from":34337,"dur":220,"src":"broll/cmepedal/av_w045.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmepedal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmepedal/cmepedal_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEPEDAL.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEPEDAL.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmepedal.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
