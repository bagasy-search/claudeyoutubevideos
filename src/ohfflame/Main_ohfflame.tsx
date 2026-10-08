// Main_ohfflame.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OHFFLAME } from "./cues_ohfflame.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OHFFLAME = 34337;

const VENTANAS = [{"k":0,"from":30,"dur":108,"src":"broll/ohfflame/av_w000.mp4"},{"k":1,"from":884,"dur":117,"src":"broll/ohfflame/av_w001.mp4"},{"k":2,"from":1411,"dur":250,"src":"broll/ohfflame/av_w002.mp4"},{"k":3,"from":1994,"dur":156,"src":"broll/ohfflame/av_w003.mp4"},{"k":4,"from":2460,"dur":114,"src":"broll/ohfflame/av_w004.mp4"},{"k":5,"from":3294,"dur":208,"src":"broll/ohfflame/av_w005.mp4"},{"k":6,"from":4129,"dur":258,"src":"broll/ohfflame/av_w006.mp4"},{"k":7,"from":5679,"dur":140,"src":"broll/ohfflame/av_w007.mp4"},{"k":8,"from":6852,"dur":83,"src":"broll/ohfflame/av_w008.mp4"},{"k":9,"from":7193,"dur":75,"src":"broll/ohfflame/av_w009.mp4"},{"k":10,"from":8168,"dur":122,"src":"broll/ohfflame/av_w010.mp4"},{"k":11,"from":9076,"dur":370,"src":"broll/ohfflame/av_w011.mp4"},{"k":12,"from":9545,"dur":236,"src":"broll/ohfflame/av_w012.mp4"},{"k":13,"from":11764,"dur":99,"src":"broll/ohfflame/av_w013.mp4"},{"k":14,"from":12259,"dur":133,"src":"broll/ohfflame/av_w014.mp4"},{"k":15,"from":12523,"dur":140,"src":"broll/ohfflame/av_w015.mp4"},{"k":16,"from":13977,"dur":236,"src":"broll/ohfflame/av_w016.mp4"},{"k":17,"from":14756,"dur":157,"src":"broll/ohfflame/av_w017.mp4"},{"k":18,"from":16069,"dur":90,"src":"broll/ohfflame/av_w018.mp4"},{"k":19,"from":16573,"dur":216,"src":"broll/ohfflame/av_w019.mp4"},{"k":20,"from":20736,"dur":133,"src":"broll/ohfflame/av_w020.mp4"},{"k":21,"from":21010,"dur":115,"src":"broll/ohfflame/av_w021.mp4"},{"k":22,"from":21884,"dur":151,"src":"broll/ohfflame/av_w022.mp4"},{"k":23,"from":22135,"dur":134,"src":"broll/ohfflame/av_w023.mp4"},{"k":24,"from":23308,"dur":151,"src":"broll/ohfflame/av_w024.mp4"},{"k":25,"from":23786,"dur":218,"src":"broll/ohfflame/av_w025.mp4"},{"k":26,"from":24154,"dur":109,"src":"broll/ohfflame/av_w026.mp4"},{"k":27,"from":24712,"dur":162,"src":"broll/ohfflame/av_w027.mp4"},{"k":28,"from":24985,"dur":124,"src":"broll/ohfflame/av_w028.mp4"},{"k":29,"from":25603,"dur":120,"src":"broll/ohfflame/av_w029.mp4"},{"k":30,"from":27051,"dur":131,"src":"broll/ohfflame/av_w030.mp4"},{"k":31,"from":27878,"dur":249,"src":"broll/ohfflame/av_w031.mp4"},{"k":32,"from":28810,"dur":101,"src":"broll/ohfflame/av_w032.mp4"},{"k":33,"from":28975,"dur":101,"src":"broll/ohfflame/av_w033.mp4"},{"k":34,"from":29200,"dur":324,"src":"broll/ohfflame/av_w034.mp4"},{"k":35,"from":29888,"dur":60,"src":"broll/ohfflame/av_w035.mp4"},{"k":36,"from":30551,"dur":134,"src":"broll/ohfflame/av_w036.mp4"},{"k":37,"from":31613,"dur":66,"src":"broll/ohfflame/av_w037.mp4"},{"k":38,"from":31762,"dur":252,"src":"broll/ohfflame/av_w038.mp4"},{"k":39,"from":32384,"dur":312,"src":"broll/ohfflame/av_w039.mp4"},{"k":40,"from":33134,"dur":247,"src":"broll/ohfflame/av_w040.mp4"},{"k":41,"from":33752,"dur":584,"src":"broll/ohfflame/av_w041.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOhfflame: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/ohfflame/ohfflame_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OHFFLAME.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OHFFLAME.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ohfflame_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
