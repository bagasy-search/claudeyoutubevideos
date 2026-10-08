// Main_ohfbleed.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OHFBLEED } from "./cues_ohfbleed.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OHFBLEED = 27038;

const VENTANAS = [{"k":0,"from":30,"dur":94,"src":"broll/ohfbleed/av_w000.mp4"},{"k":1,"from":658,"dur":207,"src":"broll/ohfbleed/av_w001.mp4"},{"k":2,"from":984,"dur":283,"src":"broll/ohfbleed/av_w002.mp4"},{"k":3,"from":1393,"dur":405,"src":"broll/ohfbleed/av_w003.mp4"},{"k":4,"from":1908,"dur":226,"src":"broll/ohfbleed/av_w004.mp4"},{"k":5,"from":2257,"dur":225,"src":"broll/ohfbleed/av_w005.mp4"},{"k":6,"from":3053,"dur":246,"src":"broll/ohfbleed/av_w006.mp4"},{"k":7,"from":3388,"dur":418,"src":"broll/ohfbleed/av_w007.mp4"},{"k":8,"from":4377,"dur":571,"src":"broll/ohfbleed/av_w008.mp4"},{"k":9,"from":6675,"dur":140,"src":"broll/ohfbleed/av_w009.mp4"},{"k":10,"from":7244,"dur":155,"src":"broll/ohfbleed/av_w010.mp4"},{"k":11,"from":7619,"dur":416,"src":"broll/ohfbleed/av_w011.mp4"},{"k":12,"from":8743,"dur":135,"src":"broll/ohfbleed/av_w012.mp4"},{"k":13,"from":8967,"dur":182,"src":"broll/ohfbleed/av_w013.mp4"},{"k":14,"from":11082,"dur":352,"src":"broll/ohfbleed/av_w014.mp4"},{"k":15,"from":12073,"dur":117,"src":"broll/ohfbleed/av_w015.mp4"},{"k":16,"from":12297,"dur":249,"src":"broll/ohfbleed/av_w016.mp4"},{"k":17,"from":13198,"dur":94,"src":"broll/ohfbleed/av_w017.mp4"},{"k":18,"from":13360,"dur":360,"src":"broll/ohfbleed/av_w018.mp4"},{"k":19,"from":14616,"dur":436,"src":"broll/ohfbleed/av_w019.mp4"},{"k":20,"from":15529,"dur":229,"src":"broll/ohfbleed/av_w020.mp4"},{"k":21,"from":17434,"dur":457,"src":"broll/ohfbleed/av_w021.mp4"},{"k":22,"from":18509,"dur":137,"src":"broll/ohfbleed/av_w022.mp4"},{"k":23,"from":18865,"dur":121,"src":"broll/ohfbleed/av_w023.mp4"},{"k":24,"from":20266,"dur":309,"src":"broll/ohfbleed/av_w024.mp4"},{"k":25,"from":21883,"dur":90,"src":"broll/ohfbleed/av_w025.mp4"},{"k":26,"from":22920,"dur":248,"src":"broll/ohfbleed/av_w026.mp4"},{"k":27,"from":24307,"dur":94,"src":"broll/ohfbleed/av_w027.mp4"},{"k":28,"from":25486,"dur":259,"src":"broll/ohfbleed/av_w028.mp4"},{"k":29,"from":26131,"dur":195,"src":"broll/ohfbleed/av_w029.mp4"},{"k":30,"from":26662,"dur":375,"src":"broll/ohfbleed/av_w030.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOhfbleed: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/ohfbleed/ohfbleed_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OHFBLEED.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OHFBLEED.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ohfbleed_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
