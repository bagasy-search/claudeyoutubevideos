// Main_olewinter.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OLEWINTER } from "./cues_olewinter.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OLEWINTER = 42190;

const VENTANAS = [{"k":0,"from":30,"dur":117,"src":"broll/olewinter/av_w000.mp4","fx":[{"start":27,"dur":72,"kind":"detras","props":{"texto":"40 MEN","sub":"32 BELOW ZERO","y":0.3}}],"fg":"broll/olewinter/av_w000_fg.webm"},{"k":1,"from":454,"dur":239,"src":"broll/olewinter/av_w001.mp4"},{"k":2,"from":1006,"dur":126,"src":"broll/olewinter/av_w002.mp4"},{"k":3,"from":1347,"dur":314,"src":"broll/olewinter/av_w003.mp4"},{"k":4,"from":2282,"dur":186,"src":"broll/olewinter/av_w004.mp4"},{"k":5,"from":2878,"dur":277,"src":"broll/olewinter/av_w005.mp4"},{"k":6,"from":3202,"dur":161,"src":"broll/olewinter/av_w006.mp4"},{"k":7,"from":3542,"dur":80,"src":"broll/olewinter/av_w007.mp4"},{"k":8,"from":6481,"dur":146,"src":"broll/olewinter/av_w008.mp4"},{"k":9,"from":6731,"dur":194,"src":"broll/olewinter/av_w009.mp4"},{"k":10,"from":7213,"dur":112,"src":"broll/olewinter/av_w010.mp4"},{"k":11,"from":8787,"dur":107,"src":"broll/olewinter/av_w011.mp4"},{"k":12,"from":9231,"dur":182,"src":"broll/olewinter/av_w012.mp4"},{"k":13,"from":9901,"dur":162,"src":"broll/olewinter/av_w013.mp4"},{"k":14,"from":11042,"dur":117,"src":"broll/olewinter/av_w014.mp4"},{"k":15,"from":12447,"dur":87,"src":"broll/olewinter/av_w015.mp4"},{"k":16,"from":16724,"dur":134,"src":"broll/olewinter/av_w016.mp4"},{"k":17,"from":17639,"dur":405,"src":"broll/olewinter/av_w017.mp4"},{"k":18,"from":18549,"dur":283,"src":"broll/olewinter/av_w018.mp4"},{"k":19,"from":20245,"dur":173,"src":"broll/olewinter/av_w019.mp4"},{"k":20,"from":21445,"dur":82,"src":"broll/olewinter/av_w020.mp4"},{"k":21,"from":21838,"dur":94,"src":"broll/olewinter/av_w021.mp4"},{"k":22,"from":22008,"dur":265,"src":"broll/olewinter/av_w022.mp4"},{"k":23,"from":22813,"dur":120,"src":"broll/olewinter/av_w023.mp4"},{"k":24,"from":23502,"dur":109,"src":"broll/olewinter/av_w024.mp4"},{"k":25,"from":24323,"dur":190,"src":"broll/olewinter/av_w025.mp4"},{"k":26,"from":25413,"dur":271,"src":"broll/olewinter/av_w026.mp4"},{"k":27,"from":25902,"dur":136,"src":"broll/olewinter/av_w027.mp4"},{"k":28,"from":26638,"dur":178,"src":"broll/olewinter/av_w028.mp4"},{"k":29,"from":27642,"dur":160,"src":"broll/olewinter/av_w029.mp4"},{"k":30,"from":27955,"dur":126,"src":"broll/olewinter/av_w030.mp4"},{"k":31,"from":28275,"dur":205,"src":"broll/olewinter/av_w031.mp4"},{"k":32,"from":28946,"dur":158,"src":"broll/olewinter/av_w032.mp4"},{"k":33,"from":30349,"dur":146,"src":"broll/olewinter/av_w033.mp4"},{"k":34,"from":30721,"dur":136,"src":"broll/olewinter/av_w034.mp4"},{"k":35,"from":31051,"dur":106,"src":"broll/olewinter/av_w035.mp4"},{"k":36,"from":31340,"dur":119,"src":"broll/olewinter/av_w036.mp4"},{"k":37,"from":33091,"dur":157,"src":"broll/olewinter/av_w037.mp4"},{"k":38,"from":33462,"dur":181,"src":"broll/olewinter/av_w038.mp4"},{"k":39,"from":34630,"dur":63,"src":"broll/olewinter/av_w039.mp4"},{"k":40,"from":34980,"dur":200,"src":"broll/olewinter/av_w040.mp4"},{"k":41,"from":37232,"dur":149,"src":"broll/olewinter/av_w041.mp4","fx":[{"start":18,"dur":126,"kind":"detras","props":{"texto":"THE ONE TRICK","y":0.3}}],"fg":"broll/olewinter/av_w041_fg.webm"},{"k":42,"from":38284,"dur":157,"src":"broll/olewinter/av_w042.mp4"},{"k":43,"from":38889,"dur":129,"src":"broll/olewinter/av_w043.mp4"},{"k":44,"from":39322,"dur":178,"src":"broll/olewinter/av_w044.mp4"},{"k":45,"from":40058,"dur":98,"src":"broll/olewinter/av_w045.mp4"},{"k":46,"from":40556,"dur":173,"src":"broll/olewinter/av_w046.mp4"},{"k":47,"from":41344,"dur":753,"src":"broll/olewinter/av_w047.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOlewinter: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0907" }}>
      <PlacaPiso src="img/olewinter/olewinter_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_OLEWINTER.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OLEWINTER.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("olewinter_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
