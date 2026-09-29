// Main_cplotaza.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CPLOTAZA } from "./cues_cplotaza.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CPLOTAZA = 42163;

const VENTANAS = [{"k":0,"from":30,"dur":173,"src":"broll/cplotaza/av_w000.mp4"},{"k":1,"from":652,"dur":364,"src":"broll/cplotaza/av_w001.mp4"},{"k":2,"from":1117,"dur":172,"src":"broll/cplotaza/av_w002.mp4"},{"k":3,"from":1555,"dur":147,"src":"broll/cplotaza/av_w003.mp4"},{"k":4,"from":1874,"dur":132,"src":"broll/cplotaza/av_w004.mp4"},{"k":5,"from":2810,"dur":375,"src":"broll/cplotaza/av_w005.mp4"},{"k":6,"from":3326,"dur":161,"src":"broll/cplotaza/av_w006.mp4"},{"k":7,"from":3923,"dur":252,"src":"broll/cplotaza/av_w007.mp4"},{"k":8,"from":4298,"dur":169,"src":"broll/cplotaza/av_w008.mp4"},{"k":9,"from":5177,"dur":295,"src":"broll/cplotaza/av_w009.mp4"},{"k":10,"from":5986,"dur":175,"src":"broll/cplotaza/av_w010.mp4"},{"k":11,"from":6704,"dur":413,"src":"broll/cplotaza/av_w011.mp4"},{"k":12,"from":7699,"dur":196,"src":"broll/cplotaza/av_w012.mp4"},{"k":13,"from":9173,"dur":138,"src":"broll/cplotaza/av_w013.mp4"},{"k":14,"from":9430,"dur":433,"src":"broll/cplotaza/av_w014.mp4"},{"k":15,"from":10528,"dur":331,"src":"broll/cplotaza/av_w015.mp4"},{"k":16,"from":11233,"dur":189,"src":"broll/cplotaza/av_w016.mp4"},{"k":17,"from":12806,"dur":105,"src":"broll/cplotaza/av_w017.mp4"},{"k":18,"from":13181,"dur":164,"src":"broll/cplotaza/av_w018.mp4"},{"k":19,"from":13362,"dur":198,"src":"broll/cplotaza/av_w019.mp4"},{"k":20,"from":16411,"dur":122,"src":"broll/cplotaza/av_w020.mp4"},{"k":21,"from":17137,"dur":127,"src":"broll/cplotaza/av_w021.mp4"},{"k":22,"from":17837,"dur":300,"src":"broll/cplotaza/av_w022.mp4"},{"k":23,"from":18425,"dur":230,"src":"broll/cplotaza/av_w023.mp4"},{"k":24,"from":19802,"dur":128,"src":"broll/cplotaza/av_w024.mp4"},{"k":25,"from":22259,"dur":160,"src":"broll/cplotaza/av_w025.mp4"},{"k":26,"from":22573,"dur":232,"src":"broll/cplotaza/av_w026.mp4"},{"k":27,"from":23141,"dur":243,"src":"broll/cplotaza/av_w027.mp4"},{"k":28,"from":25636,"dur":576,"src":"broll/cplotaza/av_w028.mp4"},{"k":29,"from":27808,"dur":162,"src":"broll/cplotaza/av_w029.mp4"},{"k":30,"from":28809,"dur":425,"src":"broll/cplotaza/av_w030.mp4"},{"k":31,"from":29479,"dur":210,"src":"broll/cplotaza/av_w031.mp4"},{"k":32,"from":30281,"dur":446,"src":"broll/cplotaza/av_w032.mp4"},{"k":33,"from":33300,"dur":123,"src":"broll/cplotaza/av_w033.mp4"},{"k":34,"from":33533,"dur":244,"src":"broll/cplotaza/av_w034.mp4"},{"k":35,"from":35386,"dur":287,"src":"broll/cplotaza/av_w035.mp4"},{"k":36,"from":35771,"dur":173,"src":"broll/cplotaza/av_w036.mp4"},{"k":37,"from":36488,"dur":413,"src":"broll/cplotaza/av_w037.mp4"},{"k":38,"from":37416,"dur":274,"src":"broll/cplotaza/av_w038.mp4"},{"k":39,"from":39399,"dur":135,"src":"broll/cplotaza/av_w039.mp4"},{"k":40,"from":39667,"dur":344,"src":"broll/cplotaza/av_w040.mp4"},{"k":41,"from":40892,"dur":187,"src":"broll/cplotaza/av_w041.mp4"},{"k":42,"from":41371,"dur":233,"src":"broll/cplotaza/av_w042.mp4"},{"k":43,"from":41681,"dur":481,"src":"broll/cplotaza/av_w043.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCplotaza: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cplotaza/cplotaza_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CPLOTAZA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CPLOTAZA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cplotaza_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
