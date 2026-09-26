// Main_cmedescon.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEDESCON } from "./cues_cmedescon.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEDESCON = 30734;

const VENTANAS = [{"k":0,"from":0,"dur":115,"src":"broll/cmedescon/av_w000.mp4"},{"k":1,"from":1766,"dur":362,"src":"broll/cmedescon/av_w001.mp4"},{"k":2,"from":3136,"dur":256,"src":"broll/cmedescon/av_w002.mp4"},{"k":3,"from":3611,"dur":163,"src":"broll/cmedescon/av_w003.mp4"},{"k":4,"from":3823,"dur":169,"src":"broll/cmedescon/av_w004.mp4"},{"k":5,"from":4315,"dur":87,"src":"broll/cmedescon/av_w005.mp4"},{"k":6,"from":4685,"dur":151,"src":"broll/cmedescon/av_w006.mp4"},{"k":7,"from":5302,"dur":108,"src":"broll/cmedescon/av_w007.mp4"},{"k":8,"from":6859,"dur":496,"src":"broll/cmedescon/av_w008.mp4"},{"k":9,"from":8150,"dur":121,"src":"broll/cmedescon/av_w009.mp4"},{"k":10,"from":8498,"dur":153,"src":"broll/cmedescon/av_w010.mp4"},{"k":11,"from":9236,"dur":110,"src":"broll/cmedescon/av_w011.mp4"},{"k":12,"from":10117,"dur":124,"src":"broll/cmedescon/av_w012.mp4"},{"k":13,"from":11001,"dur":179,"src":"broll/cmedescon/av_w013.mp4"},{"k":14,"from":11344,"dur":256,"src":"broll/cmedescon/av_w014.mp4"},{"k":15,"from":12244,"dur":96,"src":"broll/cmedescon/av_w015.mp4"},{"k":16,"from":14092,"dur":147,"src":"broll/cmedescon/av_w016.mp4"},{"k":17,"from":16286,"dur":93,"src":"broll/cmedescon/av_w017.mp4"},{"k":18,"from":16656,"dur":93,"src":"broll/cmedescon/av_w018.mp4"},{"k":19,"from":17311,"dur":291,"src":"broll/cmedescon/av_w019.mp4"},{"k":20,"from":18592,"dur":139,"src":"broll/cmedescon/av_w020.mp4"},{"k":21,"from":19207,"dur":481,"src":"broll/cmedescon/av_w021.mp4"},{"k":22,"from":21525,"dur":377,"src":"broll/cmedescon/av_w022.mp4"},{"k":23,"from":22573,"dur":90,"src":"broll/cmedescon/av_w023.mp4"},{"k":24,"from":22944,"dur":201,"src":"broll/cmedescon/av_w024.mp4"},{"k":25,"from":24510,"dur":288,"src":"broll/cmedescon/av_w025.mp4"},{"k":26,"from":25036,"dur":127,"src":"broll/cmedescon/av_w026.mp4"},{"k":27,"from":25984,"dur":223,"src":"broll/cmedescon/av_w027.mp4"},{"k":28,"from":26414,"dur":495,"src":"broll/cmedescon/av_w028.mp4"},{"k":29,"from":27308,"dur":265,"src":"broll/cmedescon/av_w029.mp4"},{"k":30,"from":28832,"dur":223,"src":"broll/cmedescon/av_w030.mp4"},{"k":31,"from":29426,"dur":244,"src":"broll/cmedescon/av_w031.mp4"},{"k":32,"from":30018,"dur":716,"src":"broll/cmedescon/av_w032.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmedescon: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmedescon/cmedescon_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEDESCON.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEDESCON.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmedescon_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
