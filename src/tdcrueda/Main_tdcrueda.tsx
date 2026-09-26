// Main_tdcrueda.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TDCRUEDA } from "./cues_tdcrueda.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TDCRUEDA = 42276;

const VENTANAS = [{"k":0,"from":30,"dur":115,"src":"broll/tdcrueda/av_w000.mp4"},{"k":1,"from":718,"dur":259,"src":"broll/tdcrueda/av_w001.mp4"},{"k":2,"from":1094,"dur":129,"src":"broll/tdcrueda/av_w002.mp4"},{"k":3,"from":1454,"dur":279,"src":"broll/tdcrueda/av_w003.mp4"},{"k":4,"from":2273,"dur":200,"src":"broll/tdcrueda/av_w004.mp4"},{"k":5,"from":2859,"dur":168,"src":"broll/tdcrueda/av_w005.mp4"},{"k":6,"from":3164,"dur":170,"src":"broll/tdcrueda/av_w006.mp4"},{"k":7,"from":3953,"dur":501,"src":"broll/tdcrueda/av_w007.mp4"},{"k":8,"from":6002,"dur":268,"src":"broll/tdcrueda/av_w008.mp4"},{"k":9,"from":7510,"dur":208,"src":"broll/tdcrueda/av_w009.mp4"},{"k":10,"from":8890,"dur":432,"src":"broll/tdcrueda/av_w010.mp4"},{"k":11,"from":12067,"dur":133,"src":"broll/tdcrueda/av_w011.mp4"},{"k":12,"from":13474,"dur":126,"src":"broll/tdcrueda/av_w012.mp4"},{"k":13,"from":15036,"dur":131,"src":"broll/tdcrueda/av_w013.mp4"},{"k":14,"from":16293,"dur":241,"src":"broll/tdcrueda/av_w014.mp4"},{"k":15,"from":17621,"dur":163,"src":"broll/tdcrueda/av_w015.mp4"},{"k":16,"from":19914,"dur":152,"src":"broll/tdcrueda/av_w016.mp4"},{"k":17,"from":20867,"dur":182,"src":"broll/tdcrueda/av_w017.mp4"},{"k":18,"from":21515,"dur":304,"src":"broll/tdcrueda/av_w018.mp4"},{"k":19,"from":23386,"dur":236,"src":"broll/tdcrueda/av_w019.mp4"},{"k":20,"from":24588,"dur":320,"src":"broll/tdcrueda/av_w020.mp4"},{"k":21,"from":25217,"dur":173,"src":"broll/tdcrueda/av_w021.mp4"},{"k":22,"from":25745,"dur":194,"src":"broll/tdcrueda/av_w022.mp4"},{"k":23,"from":27139,"dur":360,"src":"broll/tdcrueda/av_w023.mp4"},{"k":24,"from":29248,"dur":116,"src":"broll/tdcrueda/av_w024.mp4"},{"k":25,"from":29413,"dur":117,"src":"broll/tdcrueda/av_w025.mp4"},{"k":26,"from":30794,"dur":207,"src":"broll/tdcrueda/av_w026.mp4"},{"k":27,"from":31681,"dur":151,"src":"broll/tdcrueda/av_w027.mp4"},{"k":28,"from":32512,"dur":102,"src":"broll/tdcrueda/av_w028.mp4"},{"k":29,"from":33405,"dur":275,"src":"broll/tdcrueda/av_w029.mp4"},{"k":30,"from":34144,"dur":212,"src":"broll/tdcrueda/av_w030.mp4"},{"k":31,"from":35035,"dur":184,"src":"broll/tdcrueda/av_w031.mp4"},{"k":32,"from":35551,"dur":262,"src":"broll/tdcrueda/av_w032.mp4"},{"k":33,"from":36094,"dur":282,"src":"broll/tdcrueda/av_w033.mp4"},{"k":34,"from":36607,"dur":383,"src":"broll/tdcrueda/av_w034.mp4"},{"k":35,"from":37399,"dur":175,"src":"broll/tdcrueda/av_w035.mp4"},{"k":36,"from":37868,"dur":140,"src":"broll/tdcrueda/av_w036.mp4"},{"k":37,"from":38779,"dur":260,"src":"broll/tdcrueda/av_w037.mp4"},{"k":38,"from":39308,"dur":171,"src":"broll/tdcrueda/av_w038.mp4"},{"k":39,"from":39857,"dur":126,"src":"broll/tdcrueda/av_w039.mp4"},{"k":40,"from":40449,"dur":109,"src":"broll/tdcrueda/av_w040.mp4"},{"k":41,"from":40855,"dur":278,"src":"broll/tdcrueda/av_w041.mp4"},{"k":42,"from":41363,"dur":531,"src":"broll/tdcrueda/av_w042.mp4"},{"k":43,"from":42036,"dur":239,"src":"broll/tdcrueda/av_w043.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainTdcrueda: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tdcrueda/tdcrueda_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_TDCRUEDA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TDCRUEDA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("tdcrueda.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
