// Main_cmedosaires.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEDOSAIRES } from "./cues_cmedosaires.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEDOSAIRES = 38704;

const VENTANAS = [{"k":0,"from":30,"dur":146,"src":"broll/cmedosaires/av_w000.mp4"},{"k":1,"from":1613,"dur":351,"src":"broll/cmedosaires/av_w001.mp4"},{"k":2,"from":2007,"dur":106,"src":"broll/cmedosaires/av_w002.mp4"},{"k":3,"from":2267,"dur":108,"src":"broll/cmedosaires/av_w003.mp4"},{"k":4,"from":2555,"dur":119,"src":"broll/cmedosaires/av_w004.mp4"},{"k":5,"from":3536,"dur":188,"src":"broll/cmedosaires/av_w005.mp4"},{"k":6,"from":4016,"dur":191,"src":"broll/cmedosaires/av_w006.mp4"},{"k":7,"from":4476,"dur":128,"src":"broll/cmedosaires/av_w007.mp4"},{"k":8,"from":5522,"dur":180,"src":"broll/cmedosaires/av_w008.mp4"},{"k":9,"from":6034,"dur":357,"src":"broll/cmedosaires/av_w009.mp4"},{"k":10,"from":6676,"dur":141,"src":"broll/cmedosaires/av_w010.mp4"},{"k":11,"from":6929,"dur":293,"src":"broll/cmedosaires/av_w011.mp4"},{"k":12,"from":7462,"dur":245,"src":"broll/cmedosaires/av_w012.mp4"},{"k":13,"from":8166,"dur":136,"src":"broll/cmedosaires/av_w013.mp4"},{"k":14,"from":8767,"dur":93,"src":"broll/cmedosaires/av_w014.mp4"},{"k":15,"from":9044,"dur":279,"src":"broll/cmedosaires/av_w015.mp4"},{"k":16,"from":9344,"dur":176,"src":"broll/cmedosaires/av_w016.mp4"},{"k":17,"from":10220,"dur":218,"src":"broll/cmedosaires/av_w017.mp4"},{"k":18,"from":10899,"dur":332,"src":"broll/cmedosaires/av_w018.mp4"},{"k":19,"from":11823,"dur":197,"src":"broll/cmedosaires/av_w019.mp4"},{"k":20,"from":12160,"dur":161,"src":"broll/cmedosaires/av_w020.mp4"},{"k":21,"from":12390,"dur":195,"src":"broll/cmedosaires/av_w021.mp4"},{"k":22,"from":13421,"dur":111,"src":"broll/cmedosaires/av_w022.mp4"},{"k":23,"from":13904,"dur":298,"src":"broll/cmedosaires/av_w023.mp4"},{"k":24,"from":15469,"dur":276,"src":"broll/cmedosaires/av_w024.mp4"},{"k":25,"from":17312,"dur":162,"src":"broll/cmedosaires/av_w025.mp4"},{"k":26,"from":18291,"dur":107,"src":"broll/cmedosaires/av_w026.mp4"},{"k":27,"from":18546,"dur":146,"src":"broll/cmedosaires/av_w027.mp4"},{"k":28,"from":19004,"dur":287,"src":"broll/cmedosaires/av_w028.mp4"},{"k":29,"from":19855,"dur":399,"src":"broll/cmedosaires/av_w029.mp4"},{"k":30,"from":20378,"dur":183,"src":"broll/cmedosaires/av_w030.mp4"},{"k":31,"from":20734,"dur":132,"src":"broll/cmedosaires/av_w031.mp4"},{"k":32,"from":21517,"dur":149,"src":"broll/cmedosaires/av_w032.mp4"},{"k":33,"from":23300,"dur":120,"src":"broll/cmedosaires/av_w033.mp4"},{"k":34,"from":23636,"dur":303,"src":"broll/cmedosaires/av_w034.mp4"},{"k":35,"from":24431,"dur":123,"src":"broll/cmedosaires/av_w035.mp4"},{"k":36,"from":25430,"dur":190,"src":"broll/cmedosaires/av_w036.mp4"},{"k":37,"from":26894,"dur":304,"src":"broll/cmedosaires/av_w037.mp4"},{"k":38,"from":27387,"dur":107,"src":"broll/cmedosaires/av_w038.mp4"},{"k":39,"from":27623,"dur":75,"src":"broll/cmedosaires/av_w039.mp4"},{"k":40,"from":28364,"dur":355,"src":"broll/cmedosaires/av_w040.mp4"},{"k":41,"from":29920,"dur":310,"src":"broll/cmedosaires/av_w041.mp4"},{"k":42,"from":30532,"dur":222,"src":"broll/cmedosaires/av_w042.mp4"},{"k":43,"from":31820,"dur":138,"src":"broll/cmedosaires/av_w043.mp4"},{"k":44,"from":32042,"dur":107,"src":"broll/cmedosaires/av_w044.mp4"},{"k":45,"from":32386,"dur":101,"src":"broll/cmedosaires/av_w045.mp4"},{"k":46,"from":32784,"dur":178,"src":"broll/cmedosaires/av_w046.mp4"},{"k":47,"from":33104,"dur":135,"src":"broll/cmedosaires/av_w047.mp4"},{"k":48,"from":34763,"dur":744,"src":"broll/cmedosaires/av_w048.mp4"},{"k":49,"from":36144,"dur":123,"src":"broll/cmedosaires/av_w049.mp4"},{"k":50,"from":36858,"dur":186,"src":"broll/cmedosaires/av_w050.mp4"},{"k":51,"from":37434,"dur":332,"src":"broll/cmedosaires/av_w051.mp4"},{"k":52,"from":37866,"dur":234,"src":"broll/cmedosaires/av_w052.mp4"},{"k":53,"from":38253,"dur":451,"src":"broll/cmedosaires/av_w053.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmedosaires: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmedosaires/cmedosaires_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMEDOSAIRES.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEDOSAIRES.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmedosaires_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
