// Main_louhash.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_LOUHASH } from "./cues_louhash.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_LOUHASH = 42068;

const VENTANAS = [{"k":0,"from":30,"dur":249,"src":"broll/louhash/av_w000.mp4","zoom":[[128,100,1.14]]},{"k":1,"from":1034,"dur":114,"src":"broll/louhash/av_w001.mp4"},{"k":2,"from":1422,"dur":205,"src":"broll/louhash/av_w002.mp4","zoom":[[128,54,1.14]]},{"k":3,"from":1957,"dur":105,"src":"broll/louhash/av_w003.mp4"},{"k":4,"from":2351,"dur":117,"src":"broll/louhash/av_w004.mp4"},{"k":5,"from":3059,"dur":239,"src":"broll/louhash/av_w005.mp4"},{"k":6,"from":5336,"dur":154,"src":"broll/louhash/av_w006.mp4","zoom":[[65,73,1.14]]},{"k":7,"from":5648,"dur":164,"src":"broll/louhash/av_w007.mp4","zoom":[[98,43,1.14]]},{"k":8,"from":5927,"dur":374,"src":"broll/louhash/av_w008.mp4"},{"k":9,"from":7041,"dur":155,"src":"broll/louhash/av_w009.mp4"},{"k":10,"from":7338,"dur":95,"src":"broll/louhash/av_w010.mp4"},{"k":11,"from":7829,"dur":197,"src":"broll/louhash/av_w011.mp4","zoom":[[129,44,1.14]]},{"k":12,"from":8825,"dur":108,"src":"broll/louhash/av_w012.mp4"},{"k":13,"from":9371,"dur":449,"src":"broll/louhash/av_w013.mp4"},{"k":14,"from":11375,"dur":75,"src":"broll/louhash/av_w014.mp4"},{"k":15,"from":11583,"dur":488,"src":"broll/louhash/av_w015.mp4"},{"k":16,"from":12471,"dur":81,"src":"broll/louhash/av_w016.mp4"},{"k":17,"from":12949,"dur":97,"src":"broll/louhash/av_w017.mp4"},{"k":18,"from":13275,"dur":222,"src":"broll/louhash/av_w018.mp4"},{"k":19,"from":13656,"dur":101,"src":"broll/louhash/av_w019.mp4"},{"k":20,"from":14917,"dur":216,"src":"broll/louhash/av_w020.mp4","zoom":[[81,58,1.14]]},{"k":21,"from":15844,"dur":144,"src":"broll/louhash/av_w021.mp4"},{"k":22,"from":16399,"dur":262,"src":"broll/louhash/av_w022.mp4","zoom":[[211,51,1.14]]},{"k":23,"from":16776,"dur":230,"src":"broll/louhash/av_w023.mp4","zoom":[[136,94,1.14]]},{"k":24,"from":17347,"dur":146,"src":"broll/louhash/av_w024.mp4"},{"k":25,"from":17608,"dur":222,"src":"broll/louhash/av_w025.mp4"},{"k":26,"from":17849,"dur":156,"src":"broll/louhash/av_w026.mp4"},{"k":27,"from":18465,"dur":110,"src":"broll/louhash/av_w027.mp4"},{"k":28,"from":19424,"dur":231,"src":"broll/louhash/av_w028.mp4"},{"k":29,"from":20972,"dur":209,"src":"broll/louhash/av_w029.mp4","zoom":[[98,83,1.14]]},{"k":30,"from":22482,"dur":136,"src":"broll/louhash/av_w030.mp4"},{"k":31,"from":23336,"dur":237,"src":"broll/louhash/av_w031.mp4"},{"k":32,"from":24444,"dur":135,"src":"broll/louhash/av_w032.mp4"},{"k":33,"from":24692,"dur":243,"src":"broll/louhash/av_w033.mp4"},{"k":34,"from":28277,"dur":263,"src":"broll/louhash/av_w034.mp4"},{"k":35,"from":28742,"dur":283,"src":"broll/louhash/av_w035.mp4"},{"k":36,"from":29380,"dur":88,"src":"broll/louhash/av_w036.mp4"},{"k":37,"from":29648,"dur":137,"src":"broll/louhash/av_w037.mp4"},{"k":38,"from":30226,"dur":322,"src":"broll/louhash/av_w038.mp4"},{"k":39,"from":31088,"dur":159,"src":"broll/louhash/av_w039.mp4"},{"k":40,"from":31954,"dur":206,"src":"broll/louhash/av_w040.mp4"},{"k":41,"from":32283,"dur":173,"src":"broll/louhash/av_w041.mp4","zoom":[[79,71,1.14]]},{"k":42,"from":33206,"dur":93,"src":"broll/louhash/av_w042.mp4"},{"k":43,"from":33943,"dur":134,"src":"broll/louhash/av_w043.mp4"},{"k":44,"from":34693,"dur":510,"src":"broll/louhash/av_w044.mp4"},{"k":45,"from":36944,"dur":161,"src":"broll/louhash/av_w045.mp4"},{"k":46,"from":37278,"dur":126,"src":"broll/louhash/av_w046.mp4"},{"k":47,"from":37650,"dur":101,"src":"broll/louhash/av_w047.mp4"},{"k":48,"from":39061,"dur":86,"src":"broll/louhash/av_w048.mp4"},{"k":49,"from":39291,"dur":308,"src":"broll/louhash/av_w049.mp4"},{"k":50,"from":39862,"dur":96,"src":"broll/louhash/av_w050.mp4"},{"k":51,"from":40707,"dur":761,"src":"broll/louhash/av_w051.mp4"},{"k":52,"from":41666,"dur":402,"src":"broll/louhash/av_w052.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainLouhash: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0A08" }}>
      <PlacaPiso src="img/louhash/louhash_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_LOUHASH.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_LOUHASH.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("louhash_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
