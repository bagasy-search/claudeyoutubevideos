// Main_cmerefri.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEREFRI } from "./cues_cmerefri.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEREFRI = 32187;

const VENTANAS = [{"k":0,"from":30,"dur":101,"src":"broll/cmerefri/av_w000.mp4"},{"k":1,"from":564,"dur":174,"src":"broll/cmerefri/av_w001.mp4"},{"k":2,"from":1080,"dur":343,"src":"broll/cmerefri/av_w002.mp4"},{"k":3,"from":1487,"dur":311,"src":"broll/cmerefri/av_w003.mp4"},{"k":4,"from":2393,"dur":130,"src":"broll/cmerefri/av_w004.mp4"},{"k":5,"from":3225,"dur":229,"src":"broll/cmerefri/av_w005.mp4"},{"k":6,"from":3731,"dur":149,"src":"broll/cmerefri/av_w006.mp4"},{"k":7,"from":4037,"dur":110,"src":"broll/cmerefri/av_w007.mp4"},{"k":8,"from":4340,"dur":201,"src":"broll/cmerefri/av_w008.mp4"},{"k":9,"from":5155,"dur":255,"src":"broll/cmerefri/av_w009.mp4"},{"k":10,"from":5885,"dur":331,"src":"broll/cmerefri/av_w010.mp4"},{"k":11,"from":7465,"dur":163,"src":"broll/cmerefri/av_w011.mp4"},{"k":12,"from":7852,"dur":270,"src":"broll/cmerefri/av_w012.mp4"},{"k":13,"from":8507,"dur":161,"src":"broll/cmerefri/av_w013.mp4"},{"k":14,"from":8956,"dur":264,"src":"broll/cmerefri/av_w014.mp4"},{"k":15,"from":9627,"dur":412,"src":"broll/cmerefri/av_w015.mp4"},{"k":16,"from":10996,"dur":429,"src":"broll/cmerefri/av_w016.mp4"},{"k":17,"from":11550,"dur":194,"src":"broll/cmerefri/av_w017.mp4"},{"k":18,"from":12238,"dur":138,"src":"broll/cmerefri/av_w018.mp4"},{"k":19,"from":13097,"dur":243,"src":"broll/cmerefri/av_w019.mp4"},{"k":20,"from":13778,"dur":182,"src":"broll/cmerefri/av_w020.mp4"},{"k":21,"from":14448,"dur":123,"src":"broll/cmerefri/av_w021.mp4"},{"k":22,"from":14828,"dur":109,"src":"broll/cmerefri/av_w022.mp4"},{"k":23,"from":15611,"dur":358,"src":"broll/cmerefri/av_w023.mp4"},{"k":24,"from":16116,"dur":156,"src":"broll/cmerefri/av_w024.mp4"},{"k":25,"from":16366,"dur":85,"src":"broll/cmerefri/av_w025.mp4"},{"k":26,"from":17069,"dur":108,"src":"broll/cmerefri/av_w026.mp4"},{"k":27,"from":17474,"dur":132,"src":"broll/cmerefri/av_w027.mp4"},{"k":28,"from":17741,"dur":95,"src":"broll/cmerefri/av_w028.mp4"},{"k":29,"from":18210,"dur":269,"src":"broll/cmerefri/av_w029.mp4"},{"k":30,"from":19573,"dur":169,"src":"broll/cmerefri/av_w030.mp4"},{"k":31,"from":19867,"dur":208,"src":"broll/cmerefri/av_w031.mp4"},{"k":32,"from":21388,"dur":690,"src":"broll/cmerefri/av_w032.mp4"},{"k":33,"from":22684,"dur":205,"src":"broll/cmerefri/av_w033.mp4"},{"k":34,"from":23732,"dur":198,"src":"broll/cmerefri/av_w034.mp4"},{"k":35,"from":24178,"dur":464,"src":"broll/cmerefri/av_w035.mp4"},{"k":36,"from":25490,"dur":204,"src":"broll/cmerefri/av_w036.mp4"},{"k":37,"from":25933,"dur":187,"src":"broll/cmerefri/av_w037.mp4"},{"k":38,"from":27240,"dur":140,"src":"broll/cmerefri/av_w038.mp4"},{"k":39,"from":27848,"dur":195,"src":"broll/cmerefri/av_w039.mp4"},{"k":40,"from":29331,"dur":93,"src":"broll/cmerefri/av_w040.mp4"},{"k":41,"from":30321,"dur":94,"src":"broll/cmerefri/av_w041.mp4"},{"k":42,"from":31447,"dur":128,"src":"broll/cmerefri/av_w042.mp4"},{"k":43,"from":31824,"dur":363,"src":"broll/cmerefri/av_w043.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmerefri: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmerefri/cmerefri_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMEREFRI.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEREFRI.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmerefri_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
