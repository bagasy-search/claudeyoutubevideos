// Main_cmv2liam.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMV2LIAM } from "./cues_cmv2liam.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMV2LIAM = 36178;

const VENTANAS = [{"k":0,"from":18,"dur":145,"src":"broll/cmv2liam/av_w000.mp4"},{"k":1,"from":579,"dur":136,"src":"broll/cmv2liam/av_w001.mp4"},{"k":2,"from":1085,"dur":156,"src":"broll/cmv2liam/av_w002.mp4"},{"k":3,"from":1376,"dur":258,"src":"broll/cmv2liam/av_w003.mp4"},{"k":4,"from":1717,"dur":213,"src":"broll/cmv2liam/av_w004.mp4"},{"k":5,"from":2019,"dur":164,"src":"broll/cmv2liam/av_w005.mp4"},{"k":6,"from":2363,"dur":80,"src":"broll/cmv2liam/av_w006.mp4"},{"k":7,"from":2539,"dur":175,"src":"broll/cmv2liam/av_w007.mp4"},{"k":8,"from":2821,"dur":136,"src":"broll/cmv2liam/av_w008.mp4"},{"k":9,"from":3481,"dur":177,"src":"broll/cmv2liam/av_w009.mp4"},{"k":10,"from":3911,"dur":269,"src":"broll/cmv2liam/av_w010.mp4"},{"k":11,"from":4441,"dur":101,"src":"broll/cmv2liam/av_w011.mp4"},{"k":12,"from":4868,"dur":305,"src":"broll/cmv2liam/av_w012.mp4"},{"k":13,"from":5426,"dur":126,"src":"broll/cmv2liam/av_w013.mp4"},{"k":14,"from":6029,"dur":131,"src":"broll/cmv2liam/av_w014.mp4"},{"k":15,"from":6282,"dur":238,"src":"broll/cmv2liam/av_w015.mp4"},{"k":16,"from":6739,"dur":152,"src":"broll/cmv2liam/av_w016.mp4"},{"k":17,"from":7000,"dur":226,"src":"broll/cmv2liam/av_w017.mp4"},{"k":18,"from":8102,"dur":214,"src":"broll/cmv2liam/av_w018.mp4"},{"k":19,"from":9022,"dur":134,"src":"broll/cmv2liam/av_w019.mp4"},{"k":20,"from":9700,"dur":513,"src":"broll/cmv2liam/av_w020.mp4"},{"k":21,"from":10708,"dur":268,"src":"broll/cmv2liam/av_w021.mp4"},{"k":22,"from":11051,"dur":78,"src":"broll/cmv2liam/av_w022.mp4"},{"k":23,"from":11313,"dur":83,"src":"broll/cmv2liam/av_w023.mp4"},{"k":24,"from":11616,"dur":111,"src":"broll/cmv2liam/av_w024.mp4"},{"k":25,"from":11885,"dur":138,"src":"broll/cmv2liam/av_w025.mp4"},{"k":26,"from":12376,"dur":192,"src":"broll/cmv2liam/av_w026.mp4"},{"k":27,"from":12686,"dur":155,"src":"broll/cmv2liam/av_w027.mp4"},{"k":28,"from":13004,"dur":336,"src":"broll/cmv2liam/av_w028.mp4"},{"k":29,"from":13480,"dur":198,"src":"broll/cmv2liam/av_w029.mp4"},{"k":30,"from":14084,"dur":232,"src":"broll/cmv2liam/av_w030.mp4"},{"k":31,"from":14698,"dur":89,"src":"broll/cmv2liam/av_w031.mp4"},{"k":32,"from":14986,"dur":178,"src":"broll/cmv2liam/av_w032.mp4"},{"k":33,"from":15421,"dur":192,"src":"broll/cmv2liam/av_w033.mp4"},{"k":34,"from":16091,"dur":329,"src":"broll/cmv2liam/av_w034.mp4"},{"k":35,"from":16485,"dur":168,"src":"broll/cmv2liam/av_w035.mp4"},{"k":36,"from":17062,"dur":117,"src":"broll/cmv2liam/av_w036.mp4"},{"k":37,"from":17483,"dur":108,"src":"broll/cmv2liam/av_w037.mp4"},{"k":38,"from":17731,"dur":91,"src":"broll/cmv2liam/av_w038.mp4"},{"k":39,"from":18036,"dur":83,"src":"broll/cmv2liam/av_w039.mp4"},{"k":40,"from":18396,"dur":109,"src":"broll/cmv2liam/av_w040.mp4"},{"k":41,"from":18987,"dur":196,"src":"broll/cmv2liam/av_w041.mp4"},{"k":42,"from":19438,"dur":117,"src":"broll/cmv2liam/av_w042.mp4"},{"k":43,"from":19844,"dur":132,"src":"broll/cmv2liam/av_w043.mp4"},{"k":44,"from":20062,"dur":134,"src":"broll/cmv2liam/av_w044.mp4"},{"k":45,"from":20609,"dur":527,"src":"broll/cmv2liam/av_w045.mp4"},{"k":46,"from":21490,"dur":231,"src":"broll/cmv2liam/av_w046.mp4"},{"k":47,"from":22268,"dur":108,"src":"broll/cmv2liam/av_w047.mp4"},{"k":48,"from":22647,"dur":393,"src":"broll/cmv2liam/av_w048.mp4"},{"k":49,"from":23446,"dur":90,"src":"broll/cmv2liam/av_w049.mp4"},{"k":50,"from":23621,"dur":131,"src":"broll/cmv2liam/av_w050.mp4"},{"k":51,"from":24063,"dur":113,"src":"broll/cmv2liam/av_w051.mp4"},{"k":52,"from":24426,"dur":114,"src":"broll/cmv2liam/av_w052.mp4"},{"k":53,"from":24610,"dur":117,"src":"broll/cmv2liam/av_w053.mp4"},{"k":54,"from":24930,"dur":298,"src":"broll/cmv2liam/av_w054.mp4"},{"k":55,"from":25452,"dur":219,"src":"broll/cmv2liam/av_w055.mp4"},{"k":56,"from":25940,"dur":325,"src":"broll/cmv2liam/av_w056.mp4"},{"k":57,"from":26423,"dur":141,"src":"broll/cmv2liam/av_w057.mp4"},{"k":58,"from":27162,"dur":300,"src":"broll/cmv2liam/av_w058.mp4"},{"k":59,"from":27724,"dur":57,"src":"broll/cmv2liam/av_w059.mp4"},{"k":60,"from":28382,"dur":131,"src":"broll/cmv2liam/av_w060.mp4"},{"k":61,"from":29046,"dur":151,"src":"broll/cmv2liam/av_w061.mp4"},{"k":62,"from":29710,"dur":148,"src":"broll/cmv2liam/av_w062.mp4"},{"k":63,"from":29900,"dur":155,"src":"broll/cmv2liam/av_w063.mp4"},{"k":64,"from":30137,"dur":164,"src":"broll/cmv2liam/av_w064.mp4"},{"k":65,"from":30333,"dur":172,"src":"broll/cmv2liam/av_w065.mp4"},{"k":66,"from":30745,"dur":86,"src":"broll/cmv2liam/av_w066.mp4"},{"k":67,"from":31531,"dur":145,"src":"broll/cmv2liam/av_w067.mp4"},{"k":68,"from":31939,"dur":225,"src":"broll/cmv2liam/av_w068.mp4"},{"k":69,"from":32290,"dur":134,"src":"broll/cmv2liam/av_w069.mp4"},{"k":70,"from":32586,"dur":143,"src":"broll/cmv2liam/av_w070.mp4"},{"k":71,"from":32905,"dur":203,"src":"broll/cmv2liam/av_w071.mp4"},{"k":72,"from":33275,"dur":146,"src":"broll/cmv2liam/av_w072.mp4"},{"k":73,"from":33728,"dur":94,"src":"broll/cmv2liam/av_w073.mp4"},{"k":74,"from":33956,"dur":176,"src":"broll/cmv2liam/av_w074.mp4"},{"k":75,"from":34848,"dur":139,"src":"broll/cmv2liam/av_w075.mp4"},{"k":76,"from":35090,"dur":219,"src":"broll/cmv2liam/av_w076.mp4"},{"k":77,"from":35516,"dur":181,"src":"broll/cmv2liam/av_w077.mp4"},{"k":78,"from":36001,"dur":176,"src":"broll/cmv2liam/av_w078.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmv2liam: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmv2liam/cmv2liam_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMV2LIAM.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMV2LIAM.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={18} layout="none"><Audio src={staticFile("cmv2liam.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
