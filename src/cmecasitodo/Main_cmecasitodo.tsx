// Main_cmecasitodo.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMECASITODO } from "./cues_cmecasitodo.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMECASITODO = 39977;

const VENTANAS = [{"k":0,"from":30,"dur":175,"src":"broll/cmecasitodo/av_w000.mp4"},{"k":1,"from":733,"dur":139,"src":"broll/cmecasitodo/av_w001.mp4"},{"k":2,"from":1099,"dur":133,"src":"broll/cmecasitodo/av_w002.mp4"},{"k":3,"from":1336,"dur":207,"src":"broll/cmecasitodo/av_w003.mp4"},{"k":4,"from":1657,"dur":177,"src":"broll/cmecasitodo/av_w004.mp4"},{"k":5,"from":3337,"dur":213,"src":"broll/cmecasitodo/av_w005.mp4"},{"k":6,"from":3625,"dur":205,"src":"broll/cmecasitodo/av_w006.mp4"},{"k":7,"from":3851,"dur":177,"src":"broll/cmecasitodo/av_w007.mp4"},{"k":8,"from":4433,"dur":131,"src":"broll/cmecasitodo/av_w008.mp4"},{"k":9,"from":5684,"dur":231,"src":"broll/cmecasitodo/av_w009.mp4"},{"k":10,"from":6482,"dur":249,"src":"broll/cmecasitodo/av_w010.mp4"},{"k":11,"from":7454,"dur":212,"src":"broll/cmecasitodo/av_w011.mp4"},{"k":12,"from":7934,"dur":120,"src":"broll/cmecasitodo/av_w012.mp4"},{"k":13,"from":8134,"dur":269,"src":"broll/cmecasitodo/av_w013.mp4"},{"k":14,"from":8802,"dur":281,"src":"broll/cmecasitodo/av_w014.mp4"},{"k":15,"from":9362,"dur":114,"src":"broll/cmecasitodo/av_w015.mp4"},{"k":16,"from":10564,"dur":135,"src":"broll/cmecasitodo/av_w016.mp4"},{"k":17,"from":12300,"dur":346,"src":"broll/cmecasitodo/av_w017.mp4"},{"k":18,"from":13060,"dur":112,"src":"broll/cmecasitodo/av_w018.mp4"},{"k":19,"from":14280,"dur":436,"src":"broll/cmecasitodo/av_w019.mp4"},{"k":20,"from":15050,"dur":166,"src":"broll/cmecasitodo/av_w020.mp4"},{"k":21,"from":15614,"dur":146,"src":"broll/cmecasitodo/av_w021.mp4"},{"k":22,"from":16389,"dur":236,"src":"broll/cmecasitodo/av_w022.mp4"},{"k":23,"from":17920,"dur":168,"src":"broll/cmecasitodo/av_w023.mp4"},{"k":24,"from":18376,"dur":264,"src":"broll/cmecasitodo/av_w024.mp4"},{"k":25,"from":19148,"dur":98,"src":"broll/cmecasitodo/av_w025.mp4"},{"k":26,"from":19712,"dur":108,"src":"broll/cmecasitodo/av_w026.mp4"},{"k":27,"from":20210,"dur":99,"src":"broll/cmecasitodo/av_w027.mp4"},{"k":28,"from":20758,"dur":184,"src":"broll/cmecasitodo/av_w028.mp4"},{"k":29,"from":21161,"dur":300,"src":"broll/cmecasitodo/av_w029.mp4"},{"k":30,"from":22051,"dur":378,"src":"broll/cmecasitodo/av_w030.mp4"},{"k":31,"from":22853,"dur":136,"src":"broll/cmecasitodo/av_w031.mp4"},{"k":32,"from":23489,"dur":308,"src":"broll/cmecasitodo/av_w032.mp4"},{"k":33,"from":23974,"dur":135,"src":"broll/cmecasitodo/av_w033.mp4"},{"k":34,"from":24227,"dur":272,"src":"broll/cmecasitodo/av_w034.mp4"},{"k":35,"from":24895,"dur":385,"src":"broll/cmecasitodo/av_w035.mp4"},{"k":36,"from":25719,"dur":656,"src":"broll/cmecasitodo/av_w036.mp4"},{"k":37,"from":27423,"dur":112,"src":"broll/cmecasitodo/av_w037.mp4"},{"k":38,"from":27868,"dur":371,"src":"broll/cmecasitodo/av_w038.mp4"},{"k":39,"from":28502,"dur":164,"src":"broll/cmecasitodo/av_w039.mp4"},{"k":40,"from":30127,"dur":94,"src":"broll/cmecasitodo/av_w040.mp4"},{"k":41,"from":31273,"dur":210,"src":"broll/cmecasitodo/av_w041.mp4"},{"k":42,"from":32174,"dur":331,"src":"broll/cmecasitodo/av_w042.mp4"},{"k":43,"from":33942,"dur":373,"src":"broll/cmecasitodo/av_w043.mp4"},{"k":44,"from":34523,"dur":128,"src":"broll/cmecasitodo/av_w044.mp4"},{"k":45,"from":35095,"dur":523,"src":"broll/cmecasitodo/av_w045.mp4"},{"k":46,"from":35785,"dur":207,"src":"broll/cmecasitodo/av_w046.mp4"},{"k":47,"from":36638,"dur":200,"src":"broll/cmecasitodo/av_w047.mp4"},{"k":48,"from":36991,"dur":125,"src":"broll/cmecasitodo/av_w048.mp4"},{"k":49,"from":37369,"dur":222,"src":"broll/cmecasitodo/av_w049.mp4"},{"k":50,"from":37771,"dur":324,"src":"broll/cmecasitodo/av_w050.mp4"},{"k":51,"from":38179,"dur":260,"src":"broll/cmecasitodo/av_w051.mp4"},{"k":52,"from":38789,"dur":162,"src":"broll/cmecasitodo/av_w052.mp4"},{"k":53,"from":39165,"dur":272,"src":"broll/cmecasitodo/av_w053.mp4"},{"k":54,"from":39680,"dur":296,"src":"broll/cmecasitodo/av_w054.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmecasitodo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmecasitodo/cmecasitodo_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMECASITODO.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMECASITODO.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmecasitodo.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
