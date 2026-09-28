// Main_bten500k.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_BTEN500K } from "./cues_bten500k.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_BTEN500K = 29495;

const VENTANAS = [{"k":0,"from":30,"dur":195,"src":"broll/bten500k/av_w000.mp4"},{"k":1,"from":1003,"dur":106,"src":"broll/bten500k/av_w001.mp4"},{"k":2,"from":1390,"dur":417,"src":"broll/bten500k/av_w002.mp4"},{"k":3,"from":1981,"dur":399,"src":"broll/bten500k/av_w003.mp4"},{"k":4,"from":2806,"dur":146,"src":"broll/bten500k/av_w004.mp4"},{"k":5,"from":3401,"dur":222,"src":"broll/bten500k/av_w005.mp4"},{"k":6,"from":3835,"dur":169,"src":"broll/bten500k/av_w006.mp4"},{"k":7,"from":5231,"dur":186,"src":"broll/bten500k/av_w007.mp4"},{"k":8,"from":5833,"dur":219,"src":"broll/bten500k/av_w008.mp4"},{"k":9,"from":6256,"dur":154,"src":"broll/bten500k/av_w009.mp4"},{"k":10,"from":6644,"dur":241,"src":"broll/bten500k/av_w010.mp4"},{"k":11,"from":7826,"dur":203,"src":"broll/bten500k/av_w011.mp4"},{"k":12,"from":8314,"dur":114,"src":"broll/bten500k/av_w012.mp4"},{"k":13,"from":8933,"dur":138,"src":"broll/bten500k/av_w013.mp4"},{"k":14,"from":9239,"dur":120,"src":"broll/bten500k/av_w014.mp4"},{"k":15,"from":9547,"dur":124,"src":"broll/bten500k/av_w015.mp4"},{"k":16,"from":10584,"dur":213,"src":"broll/bten500k/av_w016.mp4"},{"k":17,"from":11163,"dur":141,"src":"broll/bten500k/av_w017.mp4"},{"k":18,"from":11969,"dur":149,"src":"broll/bten500k/av_w018.mp4"},{"k":19,"from":12462,"dur":150,"src":"broll/bten500k/av_w019.mp4"},{"k":20,"from":12959,"dur":167,"src":"broll/bten500k/av_w020.mp4"},{"k":21,"from":13679,"dur":277,"src":"broll/bten500k/av_w021.mp4"},{"k":22,"from":14960,"dur":112,"src":"broll/bten500k/av_w022.mp4"},{"k":23,"from":15723,"dur":264,"src":"broll/bten500k/av_w023.mp4"},{"k":24,"from":16934,"dur":156,"src":"broll/bten500k/av_w024.mp4"},{"k":25,"from":17609,"dur":150,"src":"broll/bten500k/av_w025.mp4"},{"k":26,"from":18146,"dur":216,"src":"broll/bten500k/av_w026.mp4"},{"k":27,"from":20224,"dur":199,"src":"broll/bten500k/av_w027.mp4"},{"k":28,"from":21063,"dur":235,"src":"broll/bten500k/av_w028.mp4"},{"k":29,"from":23187,"dur":123,"src":"broll/bten500k/av_w029.mp4"},{"k":30,"from":24111,"dur":74,"src":"broll/bten500k/av_w030.mp4"},{"k":31,"from":24624,"dur":203,"src":"broll/bten500k/av_w031.mp4"},{"k":32,"from":25593,"dur":130,"src":"broll/bten500k/av_w032.mp4"},{"k":33,"from":26081,"dur":283,"src":"broll/bten500k/av_w033.mp4"},{"k":34,"from":26808,"dur":182,"src":"broll/bten500k/av_w034.mp4"},{"k":35,"from":27565,"dur":211,"src":"broll/bten500k/av_w035.mp4"},{"k":36,"from":28221,"dur":114,"src":"broll/bten500k/av_w036.mp4"},{"k":37,"from":28947,"dur":548,"src":"broll/bten500k/av_w037.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainBten500k: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/bten500k/bten500k_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_BTEN500K.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_BTEN500K.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("bten500k_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
