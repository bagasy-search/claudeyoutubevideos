// Main_cmv1turbinas.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMV1TURBINAS } from "./cues_cmv1turbinas.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMV1TURBINAS = 38832;

const VENTANAS = [{"k":0,"from":18,"dur":94,"src":"broll/cmv1turbinas/av_w000.mp4"},{"k":1,"from":275,"dur":163,"src":"broll/cmv1turbinas/av_w001.mp4"},{"k":2,"from":884,"dur":164,"src":"broll/cmv1turbinas/av_w002.mp4"},{"k":3,"from":1648,"dur":218,"src":"broll/cmv1turbinas/av_w003.mp4"},{"k":4,"from":2047,"dur":301,"src":"broll/cmv1turbinas/av_w004.mp4"},{"k":5,"from":2540,"dur":124,"src":"broll/cmv1turbinas/av_w005.mp4"},{"k":6,"from":3493,"dur":174,"src":"broll/cmv1turbinas/av_w006.mp4"},{"k":7,"from":3915,"dur":185,"src":"broll/cmv1turbinas/av_w007.mp4"},{"k":8,"from":4144,"dur":130,"src":"broll/cmv1turbinas/av_w008.mp4"},{"k":9,"from":4388,"dur":72,"src":"broll/cmv1turbinas/av_w009.mp4"},{"k":10,"from":4994,"dur":341,"src":"broll/cmv1turbinas/av_w010.mp4"},{"k":11,"from":5958,"dur":259,"src":"broll/cmv1turbinas/av_w011.mp4"},{"k":12,"from":6314,"dur":135,"src":"broll/cmv1turbinas/av_w012.mp4"},{"k":13,"from":6752,"dur":129,"src":"broll/cmv1turbinas/av_w013.mp4"},{"k":14,"from":7038,"dur":204,"src":"broll/cmv1turbinas/av_w014.mp4"},{"k":15,"from":7487,"dur":180,"src":"broll/cmv1turbinas/av_w015.mp4"},{"k":16,"from":8021,"dur":348,"src":"broll/cmv1turbinas/av_w016.mp4"},{"k":17,"from":8552,"dur":249,"src":"broll/cmv1turbinas/av_w017.mp4"},{"k":18,"from":8939,"dur":126,"src":"broll/cmv1turbinas/av_w018.mp4"},{"k":19,"from":9113,"dur":161,"src":"broll/cmv1turbinas/av_w019.mp4"},{"k":20,"from":9895,"dur":325,"src":"broll/cmv1turbinas/av_w020.mp4"},{"k":21,"from":10908,"dur":129,"src":"broll/cmv1turbinas/av_w021.mp4"},{"k":22,"from":11118,"dur":105,"src":"broll/cmv1turbinas/av_w022.mp4"},{"k":23,"from":11560,"dur":316,"src":"broll/cmv1turbinas/av_w023.mp4"},{"k":24,"from":12340,"dur":147,"src":"broll/cmv1turbinas/av_w024.mp4"},{"k":25,"from":13115,"dur":144,"src":"broll/cmv1turbinas/av_w025.mp4"},{"k":26,"from":13384,"dur":84,"src":"broll/cmv1turbinas/av_w026.mp4"},{"k":27,"from":13762,"dur":84,"src":"broll/cmv1turbinas/av_w027.mp4"},{"k":28,"from":14203,"dur":133,"src":"broll/cmv1turbinas/av_w028.mp4"},{"k":29,"from":14580,"dur":112,"src":"broll/cmv1turbinas/av_w029.mp4"},{"k":30,"from":15163,"dur":73,"src":"broll/cmv1turbinas/av_w030.mp4"},{"k":31,"from":15464,"dur":182,"src":"broll/cmv1turbinas/av_w031.mp4"},{"k":32,"from":16565,"dur":335,"src":"broll/cmv1turbinas/av_w032.mp4"},{"k":33,"from":16945,"dur":280,"src":"broll/cmv1turbinas/av_w033.mp4"},{"k":34,"from":17585,"dur":338,"src":"broll/cmv1turbinas/av_w034.mp4"},{"k":35,"from":18182,"dur":224,"src":"broll/cmv1turbinas/av_w035.mp4"},{"k":36,"from":18490,"dur":130,"src":"broll/cmv1turbinas/av_w036.mp4"},{"k":37,"from":18925,"dur":100,"src":"broll/cmv1turbinas/av_w037.mp4"},{"k":38,"from":19283,"dur":239,"src":"broll/cmv1turbinas/av_w038.mp4"},{"k":39,"from":20360,"dur":107,"src":"broll/cmv1turbinas/av_w039.mp4"},{"k":40,"from":20686,"dur":96,"src":"broll/cmv1turbinas/av_w040.mp4"},{"k":41,"from":21376,"dur":87,"src":"broll/cmv1turbinas/av_w041.mp4"},{"k":42,"from":21727,"dur":136,"src":"broll/cmv1turbinas/av_w042.mp4"},{"k":43,"from":21955,"dur":160,"src":"broll/cmv1turbinas/av_w043.mp4"},{"k":44,"from":23011,"dur":281,"src":"broll/cmv1turbinas/av_w044.mp4"},{"k":45,"from":23518,"dur":192,"src":"broll/cmv1turbinas/av_w045.mp4"},{"k":46,"from":24070,"dur":413,"src":"broll/cmv1turbinas/av_w046.mp4"},{"k":47,"from":24859,"dur":231,"src":"broll/cmv1turbinas/av_w047.mp4"},{"k":48,"from":25703,"dur":113,"src":"broll/cmv1turbinas/av_w048.mp4"},{"k":49,"from":26471,"dur":145,"src":"broll/cmv1turbinas/av_w049.mp4"},{"k":50,"from":26985,"dur":130,"src":"broll/cmv1turbinas/av_w050.mp4"},{"k":51,"from":27637,"dur":96,"src":"broll/cmv1turbinas/av_w051.mp4"},{"k":52,"from":28326,"dur":196,"src":"broll/cmv1turbinas/av_w052.mp4"},{"k":53,"from":28769,"dur":150,"src":"broll/cmv1turbinas/av_w053.mp4"},{"k":54,"from":29049,"dur":104,"src":"broll/cmv1turbinas/av_w054.mp4"},{"k":55,"from":29782,"dur":138,"src":"broll/cmv1turbinas/av_w055.mp4"},{"k":56,"from":30962,"dur":121,"src":"broll/cmv1turbinas/av_w056.mp4"},{"k":57,"from":31430,"dur":299,"src":"broll/cmv1turbinas/av_w057.mp4"},{"k":58,"from":32518,"dur":201,"src":"broll/cmv1turbinas/av_w058.mp4"},{"k":59,"from":33069,"dur":161,"src":"broll/cmv1turbinas/av_w059.mp4"},{"k":60,"from":33443,"dur":327,"src":"broll/cmv1turbinas/av_w060.mp4"},{"k":61,"from":34354,"dur":115,"src":"broll/cmv1turbinas/av_w061.mp4"},{"k":62,"from":35843,"dur":174,"src":"broll/cmv1turbinas/av_w062.mp4"},{"k":63,"from":36269,"dur":129,"src":"broll/cmv1turbinas/av_w063.mp4"},{"k":64,"from":36608,"dur":165,"src":"broll/cmv1turbinas/av_w064.mp4"},{"k":65,"from":37122,"dur":140,"src":"broll/cmv1turbinas/av_w065.mp4"},{"k":66,"from":37465,"dur":150,"src":"broll/cmv1turbinas/av_w066.mp4"},{"k":67,"from":38039,"dur":164,"src":"broll/cmv1turbinas/av_w067.mp4"},{"k":68,"from":38333,"dur":293,"src":"broll/cmv1turbinas/av_w068.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmv1turbinas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmv1turbinas/cmv1turbinas_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMV1TURBINAS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMV1TURBINAS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={18} layout="none"><Audio src={staticFile("cmv1turbinas.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
