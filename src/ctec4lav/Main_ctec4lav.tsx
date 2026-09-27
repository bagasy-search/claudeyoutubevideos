// Main_ctec4lav.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CTEC4LAV } from "./cues_ctec4lav.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CTEC4LAV = 39666;

const VENTANAS = [{"k":0,"from":30,"dur":200,"src":"broll/ctec4lav/av_w000.mp4"},{"k":1,"from":389,"dur":167,"src":"broll/ctec4lav/av_w001.mp4"},{"k":2,"from":914,"dur":131,"src":"broll/ctec4lav/av_w002.mp4"},{"k":3,"from":1219,"dur":258,"src":"broll/ctec4lav/av_w003.mp4"},{"k":4,"from":1631,"dur":143,"src":"broll/ctec4lav/av_w004.mp4"},{"k":5,"from":2060,"dur":236,"src":"broll/ctec4lav/av_w005.mp4"},{"k":6,"from":3129,"dur":87,"src":"broll/ctec4lav/av_w006.mp4"},{"k":7,"from":4774,"dur":258,"src":"broll/ctec4lav/av_w007.mp4"},{"k":8,"from":5104,"dur":176,"src":"broll/ctec4lav/av_w008.mp4"},{"k":9,"from":6038,"dur":182,"src":"broll/ctec4lav/av_w009.mp4"},{"k":10,"from":6755,"dur":100,"src":"broll/ctec4lav/av_w010.mp4"},{"k":11,"from":7446,"dur":64,"src":"broll/ctec4lav/av_w011.mp4"},{"k":12,"from":8102,"dur":195,"src":"broll/ctec4lav/av_w012.mp4"},{"k":13,"from":8506,"dur":138,"src":"broll/ctec4lav/av_w013.mp4"},{"k":14,"from":9337,"dur":145,"src":"broll/ctec4lav/av_w014.mp4"},{"k":15,"from":9939,"dur":152,"src":"broll/ctec4lav/av_w015.mp4"},{"k":16,"from":10494,"dur":64,"src":"broll/ctec4lav/av_w016.mp4"},{"k":17,"from":10804,"dur":136,"src":"broll/ctec4lav/av_w017.mp4"},{"k":18,"from":11635,"dur":168,"src":"broll/ctec4lav/av_w018.mp4"},{"k":19,"from":13123,"dur":139,"src":"broll/ctec4lav/av_w019.mp4"},{"k":20,"from":13377,"dur":116,"src":"broll/ctec4lav/av_w020.mp4"},{"k":21,"from":15091,"dur":183,"src":"broll/ctec4lav/av_w021.mp4"},{"k":22,"from":15433,"dur":144,"src":"broll/ctec4lav/av_w022.mp4"},{"k":23,"from":16040,"dur":260,"src":"broll/ctec4lav/av_w023.mp4"},{"k":24,"from":17173,"dur":89,"src":"broll/ctec4lav/av_w024.mp4"},{"k":25,"from":17499,"dur":208,"src":"broll/ctec4lav/av_w025.mp4"},{"k":26,"from":18462,"dur":141,"src":"broll/ctec4lav/av_w026.mp4"},{"k":27,"from":18757,"dur":75,"src":"broll/ctec4lav/av_w027.mp4"},{"k":28,"from":21320,"dur":176,"src":"broll/ctec4lav/av_w028.mp4"},{"k":29,"from":21938,"dur":100,"src":"broll/ctec4lav/av_w029.mp4"},{"k":30,"from":22529,"dur":173,"src":"broll/ctec4lav/av_w030.mp4"},{"k":31,"from":22940,"dur":75,"src":"broll/ctec4lav/av_w031.mp4"},{"k":32,"from":23329,"dur":247,"src":"broll/ctec4lav/av_w032.mp4"},{"k":33,"from":25653,"dur":209,"src":"broll/ctec4lav/av_w033.mp4"},{"k":34,"from":27389,"dur":329,"src":"broll/ctec4lav/av_w034.mp4"},{"k":35,"from":27826,"dur":135,"src":"broll/ctec4lav/av_w035.mp4"},{"k":36,"from":29161,"dur":150,"src":"broll/ctec4lav/av_w036.mp4"},{"k":37,"from":29612,"dur":185,"src":"broll/ctec4lav/av_w037.mp4"},{"k":38,"from":30326,"dur":107,"src":"broll/ctec4lav/av_w038.mp4"},{"k":39,"from":31757,"dur":303,"src":"broll/ctec4lav/av_w039.mp4"},{"k":40,"from":32627,"dur":119,"src":"broll/ctec4lav/av_w040.mp4"},{"k":41,"from":32988,"dur":205,"src":"broll/ctec4lav/av_w041.mp4"},{"k":42,"from":33434,"dur":293,"src":"broll/ctec4lav/av_w042.mp4"},{"k":43,"from":37772,"dur":84,"src":"broll/ctec4lav/av_w043.mp4"},{"k":44,"from":38594,"dur":122,"src":"broll/ctec4lav/av_w044.mp4"},{"k":45,"from":38961,"dur":99,"src":"broll/ctec4lav/av_w045.mp4"},{"k":46,"from":39305,"dur":360,"src":"broll/ctec4lav/av_w046.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCtec4lav: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/ctec4lav/ctec4lav_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CTEC4LAV.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CTEC4LAV.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ctec4lav.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
