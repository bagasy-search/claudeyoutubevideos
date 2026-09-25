// Main_cmenino.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMENINO } from "./cues_cmenino.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMENINO = 40579;

const VENTANAS = [{"k":0,"from":0,"dur":203,"src":"broll/cmenino/av_w000.mp4","fx":[{"start":131,"dur":72,"kind":"detras","props":{"texto":"8 horas","sub":"dice la caja","y":0.3}}],"fg":"broll/cmenino/av_w000_fg.webm"},{"k":1,"from":2328,"dur":200,"src":"broll/cmenino/av_w001.mp4"},{"k":2,"from":3282,"dur":137,"src":"broll/cmenino/av_w002.mp4"},{"k":3,"from":3749,"dur":173,"src":"broll/cmenino/av_w003.mp4"},{"k":4,"from":4105,"dur":67,"src":"broll/cmenino/av_w004.mp4"},{"k":5,"from":5773,"dur":124,"src":"broll/cmenino/av_w005.mp4"},{"k":6,"from":7278,"dur":265,"src":"broll/cmenino/av_w006.mp4"},{"k":7,"from":8182,"dur":112,"src":"broll/cmenino/av_w007.mp4"},{"k":8,"from":8606,"dur":168,"src":"broll/cmenino/av_w008.mp4"},{"k":9,"from":9282,"dur":217,"src":"broll/cmenino/av_w009.mp4"},{"k":10,"from":10243,"dur":222,"src":"broll/cmenino/av_w010.mp4"},{"k":11,"from":11730,"dur":56,"src":"broll/cmenino/av_w011.mp4"},{"k":12,"from":12068,"dur":221,"src":"broll/cmenino/av_w012.mp4","fx":[{"start":108,"dur":99,"kind":"detras","props":{"texto":"7 de 10","sub":"vatios reales a pleno sol","y":0.3}}],"fg":"broll/cmenino/av_w012_fg.webm"},{"k":13,"from":12610,"dur":60,"src":"broll/cmenino/av_w013.mp4"},{"k":14,"from":13178,"dur":105,"src":"broll/cmenino/av_w014.mp4"},{"k":15,"from":13359,"dur":201,"src":"broll/cmenino/av_w015.mp4"},{"k":16,"from":13762,"dur":145,"src":"broll/cmenino/av_w016.mp4"},{"k":17,"from":14493,"dur":182,"src":"broll/cmenino/av_w017.mp4"},{"k":18,"from":14821,"dur":152,"src":"broll/cmenino/av_w018.mp4"},{"k":19,"from":16261,"dur":133,"src":"broll/cmenino/av_w019.mp4"},{"k":20,"from":16789,"dur":328,"src":"broll/cmenino/av_w020.mp4","fx":[{"start":12,"dur":138,"kind":"detras","props":{"texto":"14×","sub":"más energía guardada","y":0.3}}],"fg":"broll/cmenino/av_w020_fg.webm"},{"k":21,"from":18466,"dur":176,"src":"broll/cmenino/av_w021.mp4"},{"k":22,"from":20245,"dur":166,"src":"broll/cmenino/av_w022.mp4","fx":[{"start":12,"dur":141,"kind":"detras","props":{"texto":"3 noches","sub":"de lluvia seguidas","y":0.3}}],"fg":"broll/cmenino/av_w022_fg.webm"},{"k":23,"from":20536,"dur":328,"src":"broll/cmenino/av_w023.mp4"},{"k":24,"from":21191,"dur":210,"src":"broll/cmenino/av_w024.mp4"},{"k":25,"from":21568,"dur":268,"src":"broll/cmenino/av_w025.mp4","fx":[{"start":114,"dur":141,"kind":"orbita","props":{"items":["Gastar menos","Más batería","Más panel"],"cx":0.52,"cy":0.24,"rx":0.19,"ry":0.06,"tilt":-7,"periodoS":7}}],"fg":"broll/cmenino/av_w025_fg.webm"},{"k":26,"from":23397,"dur":164,"src":"broll/cmenino/av_w026.mp4"},{"k":27,"from":24448,"dur":176,"src":"broll/cmenino/av_w027.mp4"},{"k":28,"from":25841,"dur":101,"src":"broll/cmenino/av_w028.mp4"},{"k":29,"from":26693,"dur":111,"src":"broll/cmenino/av_w029.mp4"},{"k":30,"from":27954,"dur":116,"src":"broll/cmenino/av_w030.mp4"},{"k":31,"from":30061,"dur":216,"src":"broll/cmenino/av_w031.mp4"},{"k":32,"from":30989,"dur":126,"src":"broll/cmenino/av_w032.mp4"},{"k":33,"from":31210,"dur":247,"src":"broll/cmenino/av_w033.mp4"},{"k":34,"from":32196,"dur":132,"src":"broll/cmenino/av_w034.mp4"},{"k":35,"from":35243,"dur":218,"src":"broll/cmenino/av_w035.mp4"},{"k":36,"from":36341,"dur":149,"src":"broll/cmenino/av_w036.mp4"},{"k":37,"from":37016,"dur":173,"src":"broll/cmenino/av_w037.mp4","fx":[{"start":12,"dur":149,"kind":"detras","props":{"lineas":[{"t":"1 batería","at":0.85},{"t":"2 panel","at":2.35},{"t":"3 foco","at":3.95}],"y":0.36}}],"fg":"broll/cmenino/av_w037_fg.webm"},{"k":38,"from":38249,"dur":140,"src":"broll/cmenino/av_w038.mp4"},{"k":39,"from":39486,"dur":542,"src":"broll/cmenino/av_w039.mp4"},{"k":40,"from":40162,"dur":416,"src":"broll/cmenino/av_w040.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmenino: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmenino/cmenino_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMENINO.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMENINO.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmenino_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
