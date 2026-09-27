// Main_olebreakfast.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OLEBREAKFAST } from "./cues_olebreakfast.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OLEBREAKFAST = 41197;

const VENTANAS = [{"k":0,"from":30,"dur":257,"src":"broll/olebreakfast/av_w000.mp4"},{"k":1,"from":823,"dur":62,"src":"broll/olebreakfast/av_w001.mp4"},{"k":2,"from":1733,"dur":219,"src":"broll/olebreakfast/av_w002.mp4"},{"k":3,"from":2135,"dur":168,"src":"broll/olebreakfast/av_w003.mp4"},{"k":4,"from":2919,"dur":119,"src":"broll/olebreakfast/av_w004.mp4"},{"k":5,"from":4720,"dur":152,"src":"broll/olebreakfast/av_w005.mp4"},{"k":6,"from":5439,"dur":149,"src":"broll/olebreakfast/av_w006.mp4"},{"k":7,"from":7007,"dur":151,"src":"broll/olebreakfast/av_w007.mp4"},{"k":8,"from":8151,"dur":139,"src":"broll/olebreakfast/av_w008.mp4"},{"k":9,"from":8956,"dur":108,"src":"broll/olebreakfast/av_w009.mp4"},{"k":10,"from":10095,"dur":185,"src":"broll/olebreakfast/av_w010.mp4"},{"k":11,"from":11701,"dur":346,"src":"broll/olebreakfast/av_w011.mp4","zoom":[[169,161,1.13]]},{"k":12,"from":13141,"dur":218,"src":"broll/olebreakfast/av_w012.mp4"},{"k":13,"from":14226,"dur":160,"src":"broll/olebreakfast/av_w013.mp4"},{"k":14,"from":15207,"dur":284,"src":"broll/olebreakfast/av_w014.mp4"},{"k":15,"from":15775,"dur":173,"src":"broll/olebreakfast/av_w015.mp4"},{"k":16,"from":16806,"dur":171,"src":"broll/olebreakfast/av_w016.mp4"},{"k":17,"from":17161,"dur":162,"src":"broll/olebreakfast/av_w017.mp4"},{"k":18,"from":17653,"dur":206,"src":"broll/olebreakfast/av_w018.mp4"},{"k":19,"from":18768,"dur":158,"src":"broll/olebreakfast/av_w019.mp4"},{"k":20,"from":20948,"dur":167,"src":"broll/olebreakfast/av_w020.mp4"},{"k":21,"from":22318,"dur":280,"src":"broll/olebreakfast/av_w021.mp4","zoom":[[120,134,1.13]]},{"k":22,"from":22833,"dur":133,"src":"broll/olebreakfast/av_w022.mp4"},{"k":23,"from":23767,"dur":144,"src":"broll/olebreakfast/av_w023.mp4"},{"k":24,"from":25028,"dur":133,"src":"broll/olebreakfast/av_w024.mp4"},{"k":25,"from":25982,"dur":147,"src":"broll/olebreakfast/av_w025.mp4"},{"k":26,"from":26335,"dur":233,"src":"broll/olebreakfast/av_w026.mp4"},{"k":27,"from":26945,"dur":123,"src":"broll/olebreakfast/av_w027.mp4"},{"k":28,"from":28400,"dur":143,"src":"broll/olebreakfast/av_w028.mp4"},{"k":29,"from":28877,"dur":586,"src":"broll/olebreakfast/av_w029.mp4"},{"k":30,"from":30455,"dur":279,"src":"broll/olebreakfast/av_w030.mp4","zoom":[[187,70,1.13]]},{"k":31,"from":31504,"dur":173,"src":"broll/olebreakfast/av_w031.mp4","zoom":[[63,87,1.13]]},{"k":32,"from":32809,"dur":98,"src":"broll/olebreakfast/av_w032.mp4"},{"k":33,"from":33747,"dur":197,"src":"broll/olebreakfast/av_w033.mp4"},{"k":34,"from":34725,"dur":145,"src":"broll/olebreakfast/av_w034.mp4"},{"k":35,"from":35503,"dur":403,"src":"broll/olebreakfast/av_w035.mp4"},{"k":36,"from":37253,"dur":155,"src":"broll/olebreakfast/av_w036.mp4"},{"k":37,"from":38014,"dur":153,"src":"broll/olebreakfast/av_w037.mp4"},{"k":38,"from":38579,"dur":253,"src":"broll/olebreakfast/av_w038.mp4","zoom":[[167,76,1.13]]},{"k":39,"from":39182,"dur":112,"src":"broll/olebreakfast/av_w039.mp4"},{"k":40,"from":39916,"dur":223,"src":"broll/olebreakfast/av_w040.mp4","zoom":[[138,63,1.13]]},{"k":41,"from":40496,"dur":366,"src":"broll/olebreakfast/av_w041.mp4"},{"k":42,"from":41015,"dur":181,"src":"broll/olebreakfast/av_w042.mp4","zoom":[[80,96,1.13]]}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOlebreakfast: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0907" }}>
      <PlacaPiso src="img/olebreakfast/olebreakfast_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OLEBREAKFAST.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OLEBREAKFAST.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("olebreakfast_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
