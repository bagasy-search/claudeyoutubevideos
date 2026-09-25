// Main_cmegenalt.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEGENALT } from "./cues_cmegenalt.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEGENALT = 46534;

const VENTANAS = [{"k":0,"from":0,"dur":167,"src":"broll/cmegenalt/av_w000.mp4"},{"k":1,"from":455,"dur":151,"src":"broll/cmegenalt/av_w001.mp4"},{"k":2,"from":1364,"dur":357,"src":"broll/cmegenalt/av_w002.mp4"},{"k":3,"from":1978,"dur":174,"src":"broll/cmegenalt/av_w003.mp4"},{"k":4,"from":2362,"dur":113,"src":"broll/cmegenalt/av_w004.mp4"},{"k":5,"from":2811,"dur":95,"src":"broll/cmegenalt/av_w005.mp4"},{"k":6,"from":3097,"dur":162,"src":"broll/cmegenalt/av_w006.mp4"},{"k":7,"from":4118,"dur":101,"src":"broll/cmegenalt/av_w007.mp4"},{"k":8,"from":4432,"dur":241,"src":"broll/cmegenalt/av_w008.mp4"},{"k":9,"from":4947,"dur":173,"src":"broll/cmegenalt/av_w009.mp4"},{"k":10,"from":5474,"dur":447,"src":"broll/cmegenalt/av_w010.mp4"},{"k":11,"from":6568,"dur":93,"src":"broll/cmegenalt/av_w011.mp4"},{"k":12,"from":6980,"dur":244,"src":"broll/cmegenalt/av_w012.mp4"},{"k":13,"from":7539,"dur":133,"src":"broll/cmegenalt/av_w013.mp4"},{"k":14,"from":8039,"dur":102,"src":"broll/cmegenalt/av_w014.mp4"},{"k":15,"from":9440,"dur":90,"src":"broll/cmegenalt/av_w015.mp4"},{"k":16,"from":10031,"dur":216,"src":"broll/cmegenalt/av_w016.mp4"},{"k":17,"from":10628,"dur":109,"src":"broll/cmegenalt/av_w017.mp4"},{"k":18,"from":10907,"dur":177,"src":"broll/cmegenalt/av_w018.mp4"},{"k":19,"from":12354,"dur":171,"src":"broll/cmegenalt/av_w019.mp4"},{"k":20,"from":12890,"dur":164,"src":"broll/cmegenalt/av_w020.mp4"},{"k":21,"from":13549,"dur":277,"src":"broll/cmegenalt/av_w021.mp4"},{"k":22,"from":14057,"dur":89,"src":"broll/cmegenalt/av_w022.mp4"},{"k":23,"from":14480,"dur":116,"src":"broll/cmegenalt/av_w023.mp4"},{"k":24,"from":14925,"dur":144,"src":"broll/cmegenalt/av_w024.mp4"},{"k":25,"from":16800,"dur":120,"src":"broll/cmegenalt/av_w025.mp4"},{"k":26,"from":17789,"dur":127,"src":"broll/cmegenalt/av_w026.mp4"},{"k":27,"from":18280,"dur":124,"src":"broll/cmegenalt/av_w027.mp4"},{"k":28,"from":18492,"dur":128,"src":"broll/cmegenalt/av_w028.mp4"},{"k":29,"from":18916,"dur":59,"src":"broll/cmegenalt/av_w029.mp4"},{"k":30,"from":20213,"dur":353,"src":"broll/cmegenalt/av_w030.mp4"},{"k":31,"from":20841,"dur":118,"src":"broll/cmegenalt/av_w031.mp4"},{"k":32,"from":22467,"dur":224,"src":"broll/cmegenalt/av_w032.mp4"},{"k":33,"from":23159,"dur":138,"src":"broll/cmegenalt/av_w033.mp4"},{"k":34,"from":24593,"dur":207,"src":"broll/cmegenalt/av_w034.mp4"},{"k":35,"from":25145,"dur":126,"src":"broll/cmegenalt/av_w035.mp4"},{"k":36,"from":25489,"dur":122,"src":"broll/cmegenalt/av_w036.mp4"},{"k":37,"from":26580,"dur":74,"src":"broll/cmegenalt/av_w037.mp4"},{"k":38,"from":27200,"dur":131,"src":"broll/cmegenalt/av_w038.mp4"},{"k":39,"from":27460,"dur":249,"src":"broll/cmegenalt/av_w039.mp4"},{"k":40,"from":28678,"dur":479,"src":"broll/cmegenalt/av_w040.mp4"},{"k":41,"from":30206,"dur":76,"src":"broll/cmegenalt/av_w041.mp4"},{"k":42,"from":30552,"dur":205,"src":"broll/cmegenalt/av_w042.mp4"},{"k":43,"from":31034,"dur":168,"src":"broll/cmegenalt/av_w043.mp4"},{"k":44,"from":31584,"dur":140,"src":"broll/cmegenalt/av_w044.mp4"},{"k":45,"from":32437,"dur":102,"src":"broll/cmegenalt/av_w045.mp4"},{"k":46,"from":32891,"dur":174,"src":"broll/cmegenalt/av_w046.mp4"},{"k":47,"from":33637,"dur":160,"src":"broll/cmegenalt/av_w047.mp4"},{"k":48,"from":35099,"dur":158,"src":"broll/cmegenalt/av_w048.mp4"},{"k":49,"from":35366,"dur":95,"src":"broll/cmegenalt/av_w049.mp4"},{"k":50,"from":35669,"dur":300,"src":"broll/cmegenalt/av_w050.mp4"},{"k":51,"from":36500,"dur":248,"src":"broll/cmegenalt/av_w051.mp4"},{"k":52,"from":37959,"dur":120,"src":"broll/cmegenalt/av_w052.mp4"},{"k":53,"from":38648,"dur":97,"src":"broll/cmegenalt/av_w053.mp4"},{"k":54,"from":39016,"dur":124,"src":"broll/cmegenalt/av_w054.mp4"},{"k":55,"from":39221,"dur":173,"src":"broll/cmegenalt/av_w055.mp4"},{"k":56,"from":40056,"dur":353,"src":"broll/cmegenalt/av_w056.mp4"},{"k":57,"from":41146,"dur":101,"src":"broll/cmegenalt/av_w057.mp4"},{"k":58,"from":41320,"dur":122,"src":"broll/cmegenalt/av_w058.mp4"},{"k":59,"from":41586,"dur":146,"src":"broll/cmegenalt/av_w059.mp4"},{"k":60,"from":41941,"dur":177,"src":"broll/cmegenalt/av_w060.mp4"},{"k":61,"from":42904,"dur":72,"src":"broll/cmegenalt/av_w061.mp4"},{"k":62,"from":43711,"dur":144,"src":"broll/cmegenalt/av_w062.mp4"},{"k":63,"from":44577,"dur":184,"src":"broll/cmegenalt/av_w063.mp4"},{"k":64,"from":45661,"dur":102,"src":"broll/cmegenalt/av_w064.mp4"},{"k":65,"from":45890,"dur":127,"src":"broll/cmegenalt/av_w065.mp4"},{"k":66,"from":46221,"dur":312,"src":"broll/cmegenalt/av_w066.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmegenalt: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmegenalt/cmegenalt_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEGENALT.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEGENALT.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmegenalt.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
