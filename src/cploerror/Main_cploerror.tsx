// Main_cploerror.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CPLOERROR } from "./cues_cploerror.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CPLOERROR = 40857;

const VENTANAS = [{"k":0,"from":30,"dur":268,"src":"broll/cploerror/av_w000.mp4"},{"k":1,"from":402,"dur":184,"src":"broll/cploerror/av_w001.mp4","fx":[{"start":21,"dur":108,"kind":"detras","props":{"texto":"3 casas","sub":"por semana","y":0.3}}],"fg":"broll/cploerror/av_w001_fg.webm"},{"k":2,"from":652,"dur":251,"src":"broll/cploerror/av_w002.mp4"},{"k":3,"from":1284,"dur":224,"src":"broll/cploerror/av_w003.mp4"},{"k":4,"from":2257,"dur":199,"src":"broll/cploerror/av_w004.mp4"},{"k":5,"from":3453,"dur":140,"src":"broll/cploerror/av_w005.mp4"},{"k":6,"from":4050,"dur":97,"src":"broll/cploerror/av_w006.mp4"},{"k":7,"from":4810,"dur":345,"src":"broll/cploerror/av_w007.mp4"},{"k":8,"from":6709,"dur":206,"src":"broll/cploerror/av_w008.mp4"},{"k":9,"from":7352,"dur":224,"src":"broll/cploerror/av_w009.mp4"},{"k":10,"from":8971,"dur":249,"src":"broll/cploerror/av_w010.mp4"},{"k":11,"from":9644,"dur":120,"src":"broll/cploerror/av_w011.mp4"},{"k":12,"from":10117,"dur":150,"src":"broll/cploerror/av_w012.mp4"},{"k":13,"from":12270,"dur":122,"src":"broll/cploerror/av_w013.mp4"},{"k":14,"from":13436,"dur":146,"src":"broll/cploerror/av_w014.mp4"},{"k":15,"from":13742,"dur":300,"src":"broll/cploerror/av_w015.mp4"},{"k":16,"from":17708,"dur":409,"src":"broll/cploerror/av_w016.mp4"},{"k":17,"from":18628,"dur":97,"src":"broll/cploerror/av_w017.mp4"},{"k":18,"from":19022,"dur":82,"src":"broll/cploerror/av_w018.mp4"},{"k":19,"from":19826,"dur":286,"src":"broll/cploerror/av_w019.mp4"},{"k":20,"from":22804,"dur":200,"src":"broll/cploerror/av_w020.mp4"},{"k":21,"from":23276,"dur":222,"src":"broll/cploerror/av_w021.mp4"},{"k":22,"from":23970,"dur":242,"src":"broll/cploerror/av_w022.mp4"},{"k":23,"from":25163,"dur":136,"src":"broll/cploerror/av_w023.mp4"},{"k":24,"from":26280,"dur":429,"src":"broll/cploerror/av_w024.mp4"},{"k":25,"from":27536,"dur":152,"src":"broll/cploerror/av_w025.mp4"},{"k":26,"from":28558,"dur":165,"src":"broll/cploerror/av_w026.mp4"},{"k":27,"from":29157,"dur":350,"src":"broll/cploerror/av_w027.mp4"},{"k":28,"from":30626,"dur":241,"src":"broll/cploerror/av_w028.mp4"},{"k":29,"from":31914,"dur":108,"src":"broll/cploerror/av_w029.mp4"},{"k":30,"from":33522,"dur":164,"src":"broll/cploerror/av_w030.mp4"},{"k":31,"from":34785,"dur":102,"src":"broll/cploerror/av_w031.mp4"},{"k":32,"from":34983,"dur":95,"src":"broll/cploerror/av_w032.mp4"},{"k":33,"from":35825,"dur":179,"src":"broll/cploerror/av_w033.mp4"},{"k":34,"from":36992,"dur":96,"src":"broll/cploerror/av_w034.mp4"},{"k":35,"from":37528,"dur":235,"src":"broll/cploerror/av_w035.mp4"},{"k":36,"from":37869,"dur":198,"src":"broll/cploerror/av_w036.mp4"},{"k":37,"from":38305,"dur":161,"src":"broll/cploerror/av_w037.mp4"},{"k":38,"from":39275,"dur":194,"src":"broll/cploerror/av_w038.mp4"},{"k":39,"from":39677,"dur":283,"src":"broll/cploerror/av_w039.mp4"},{"k":40,"from":40081,"dur":216,"src":"broll/cploerror/av_w040.mp4"},{"k":41,"from":40386,"dur":471,"src":"broll/cploerror/av_w041.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCploerror: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cploerror/cploerror_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CPLOERROR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CPLOERROR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cploerror_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
