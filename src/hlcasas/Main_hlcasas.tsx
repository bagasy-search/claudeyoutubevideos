// Main_hlcasas.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_HLCASAS } from "./cues_hlcasas.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_HLCASAS = 33111;

const VENTANAS = [{"k":0,"from":0,"dur":133,"src":"broll/hlcasas/av_w000.mp4"},{"k":1,"from":951,"dur":133,"src":"broll/hlcasas/av_w001.mp4"},{"k":2,"from":1385,"dur":149,"src":"broll/hlcasas/av_w002.mp4"},{"k":3,"from":2463,"dur":195,"src":"broll/hlcasas/av_w003.mp4"},{"k":4,"from":2962,"dur":147,"src":"broll/hlcasas/av_w004.mp4"},{"k":5,"from":3488,"dur":77,"src":"broll/hlcasas/av_w005.mp4"},{"k":6,"from":4855,"dur":339,"src":"broll/hlcasas/av_w006.mp4","zoom":[[154,95,1.14]]},{"k":7,"from":6124,"dur":99,"src":"broll/hlcasas/av_w007.mp4"},{"k":8,"from":7276,"dur":124,"src":"broll/hlcasas/av_w008.mp4"},{"k":9,"from":7879,"dur":120,"src":"broll/hlcasas/av_w009.mp4"},{"k":10,"from":10082,"dur":145,"src":"broll/hlcasas/av_w010.mp4"},{"k":11,"from":10591,"dur":171,"src":"broll/hlcasas/av_w011.mp4"},{"k":12,"from":12241,"dur":217,"src":"broll/hlcasas/av_w012.mp4","zoom":[[117,66,1.14]]},{"k":13,"from":13699,"dur":156,"src":"broll/hlcasas/av_w013.mp4"},{"k":14,"from":16001,"dur":261,"src":"broll/hlcasas/av_w014.mp4","zoom":[[152,90,1.14]]},{"k":15,"from":17455,"dur":106,"src":"broll/hlcasas/av_w015.mp4"},{"k":16,"from":18845,"dur":104,"src":"broll/hlcasas/av_w016.mp4"},{"k":17,"from":21145,"dur":178,"src":"broll/hlcasas/av_w017.mp4"},{"k":18,"from":24337,"dur":188,"src":"broll/hlcasas/av_w018.mp4"},{"k":19,"from":26952,"dur":97,"src":"broll/hlcasas/av_w019.mp4"},{"k":20,"from":27632,"dur":197,"src":"broll/hlcasas/av_w020.mp4"},{"k":21,"from":28322,"dur":163,"src":"broll/hlcasas/av_w021.mp4"},{"k":22,"from":28574,"dur":229,"src":"broll/hlcasas/av_w022.mp4","zoom":[[136,72,1.14]]},{"k":23,"from":29039,"dur":139,"src":"broll/hlcasas/av_w023.mp4"},{"k":24,"from":30513,"dur":131,"src":"broll/hlcasas/av_w024.mp4"},{"k":25,"from":31139,"dur":153,"src":"broll/hlcasas/av_w025.mp4","zoom":[[87,66,1.14]]},{"k":26,"from":31483,"dur":129,"src":"broll/hlcasas/av_w026.mp4"},{"k":27,"from":32989,"dur":121,"src":"broll/hlcasas/av_w027.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainHlcasas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/hlcasas/hlcasas_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_HLCASAS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_HLCASAS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("hlcasas_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
