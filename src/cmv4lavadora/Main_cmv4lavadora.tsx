// Main_cmv4lavadora.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMV4LAVADORA } from "./cues_cmv4lavadora.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMV4LAVADORA = 34012;

const VENTANAS = [{"k":0,"from":18,"dur":168,"src":"broll/cmv4lavadora/av_w000.mp4"},{"k":1,"from":995,"dur":195,"src":"broll/cmv4lavadora/av_w001.mp4"},{"k":2,"from":1270,"dur":117,"src":"broll/cmv4lavadora/av_w002.mp4"},{"k":3,"from":1690,"dur":384,"src":"broll/cmv4lavadora/av_w003.mp4"},{"k":4,"from":2384,"dur":84,"src":"broll/cmv4lavadora/av_w004.mp4"},{"k":5,"from":2542,"dur":403,"src":"broll/cmv4lavadora/av_w005.mp4"},{"k":6,"from":3060,"dur":200,"src":"broll/cmv4lavadora/av_w006.mp4"},{"k":7,"from":3547,"dur":106,"src":"broll/cmv4lavadora/av_w007.mp4"},{"k":8,"from":3788,"dur":167,"src":"broll/cmv4lavadora/av_w008.mp4"},{"k":9,"from":4597,"dur":100,"src":"broll/cmv4lavadora/av_w009.mp4"},{"k":10,"from":5179,"dur":234,"src":"broll/cmv4lavadora/av_w010.mp4"},{"k":11,"from":5941,"dur":112,"src":"broll/cmv4lavadora/av_w011.mp4"},{"k":12,"from":6358,"dur":167,"src":"broll/cmv4lavadora/av_w012.mp4"},{"k":13,"from":6812,"dur":170,"src":"broll/cmv4lavadora/av_w013.mp4"},{"k":14,"from":7068,"dur":150,"src":"broll/cmv4lavadora/av_w014.mp4"},{"k":15,"from":7295,"dur":140,"src":"broll/cmv4lavadora/av_w015.mp4"},{"k":16,"from":7768,"dur":121,"src":"broll/cmv4lavadora/av_w016.mp4"},{"k":17,"from":7982,"dur":157,"src":"broll/cmv4lavadora/av_w017.mp4"},{"k":18,"from":8377,"dur":199,"src":"broll/cmv4lavadora/av_w018.mp4"},{"k":19,"from":9804,"dur":121,"src":"broll/cmv4lavadora/av_w019.mp4"},{"k":20,"from":10107,"dur":113,"src":"broll/cmv4lavadora/av_w020.mp4"},{"k":21,"from":10444,"dur":98,"src":"broll/cmv4lavadora/av_w021.mp4"},{"k":22,"from":11009,"dur":176,"src":"broll/cmv4lavadora/av_w022.mp4"},{"k":23,"from":11450,"dur":153,"src":"broll/cmv4lavadora/av_w023.mp4"},{"k":24,"from":11917,"dur":116,"src":"broll/cmv4lavadora/av_w024.mp4"},{"k":25,"from":12789,"dur":421,"src":"broll/cmv4lavadora/av_w025.mp4"},{"k":26,"from":13804,"dur":164,"src":"broll/cmv4lavadora/av_w026.mp4"},{"k":27,"from":14344,"dur":346,"src":"broll/cmv4lavadora/av_w027.mp4"},{"k":28,"from":15469,"dur":201,"src":"broll/cmv4lavadora/av_w028.mp4"},{"k":29,"from":15975,"dur":152,"src":"broll/cmv4lavadora/av_w029.mp4"},{"k":30,"from":16202,"dur":126,"src":"broll/cmv4lavadora/av_w030.mp4"},{"k":31,"from":17205,"dur":115,"src":"broll/cmv4lavadora/av_w031.mp4"},{"k":32,"from":17609,"dur":106,"src":"broll/cmv4lavadora/av_w032.mp4"},{"k":33,"from":17944,"dur":64,"src":"broll/cmv4lavadora/av_w033.mp4"},{"k":34,"from":18601,"dur":106,"src":"broll/cmv4lavadora/av_w034.mp4"},{"k":35,"from":19261,"dur":212,"src":"broll/cmv4lavadora/av_w035.mp4"},{"k":36,"from":19842,"dur":140,"src":"broll/cmv4lavadora/av_w036.mp4"},{"k":37,"from":21309,"dur":331,"src":"broll/cmv4lavadora/av_w037.mp4"},{"k":38,"from":21938,"dur":118,"src":"broll/cmv4lavadora/av_w038.mp4"},{"k":39,"from":22081,"dur":89,"src":"broll/cmv4lavadora/av_w039.mp4"},{"k":40,"from":22624,"dur":250,"src":"broll/cmv4lavadora/av_w040.mp4"},{"k":41,"from":23165,"dur":108,"src":"broll/cmv4lavadora/av_w041.mp4"},{"k":42,"from":23488,"dur":242,"src":"broll/cmv4lavadora/av_w042.mp4"},{"k":43,"from":24656,"dur":147,"src":"broll/cmv4lavadora/av_w043.mp4"},{"k":44,"from":25283,"dur":302,"src":"broll/cmv4lavadora/av_w044.mp4"},{"k":45,"from":25981,"dur":654,"src":"broll/cmv4lavadora/av_w045.mp4"},{"k":46,"from":27720,"dur":256,"src":"broll/cmv4lavadora/av_w046.mp4"},{"k":47,"from":28141,"dur":339,"src":"broll/cmv4lavadora/av_w047.mp4"},{"k":48,"from":29149,"dur":409,"src":"broll/cmv4lavadora/av_w048.mp4"},{"k":49,"from":29790,"dur":62,"src":"broll/cmv4lavadora/av_w049.mp4"},{"k":50,"from":30882,"dur":614,"src":"broll/cmv4lavadora/av_w050.mp4"},{"k":51,"from":31652,"dur":153,"src":"broll/cmv4lavadora/av_w051.mp4"},{"k":52,"from":31903,"dur":130,"src":"broll/cmv4lavadora/av_w052.mp4"},{"k":53,"from":32319,"dur":229,"src":"broll/cmv4lavadora/av_w053.mp4"},{"k":54,"from":32724,"dur":613,"src":"broll/cmv4lavadora/av_w054.mp4"},{"k":55,"from":33415,"dur":315,"src":"broll/cmv4lavadora/av_w055.mp4"},{"k":56,"from":33895,"dur":116,"src":"broll/cmv4lavadora/av_w056.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmv4lavadora: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmv4lavadora/cmv4lavadora_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMV4LAVADORA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMV4LAVADORA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={18} layout="none"><Audio src={staticFile("cmv4lavadora.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
