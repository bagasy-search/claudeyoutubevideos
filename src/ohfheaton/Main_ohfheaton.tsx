// Main_ohfheaton.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OHFHEATON } from "./cues_ohfheaton.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OHFHEATON = 27620;

const VENTANAS = [{"k":0,"from":30,"dur":161,"src":"broll/ohfheaton/av_w000.mp4"},{"k":1,"from":547,"dur":132,"src":"broll/ohfheaton/av_w001.mp4"},{"k":2,"from":1040,"dur":234,"src":"broll/ohfheaton/av_w002.mp4"},{"k":3,"from":1582,"dur":161,"src":"broll/ohfheaton/av_w003.mp4"},{"k":4,"from":1882,"dur":128,"src":"broll/ohfheaton/av_w004.mp4"},{"k":5,"from":2330,"dur":96,"src":"broll/ohfheaton/av_w005.mp4"},{"k":6,"from":3402,"dur":179,"src":"broll/ohfheaton/av_w006.mp4"},{"k":7,"from":3736,"dur":98,"src":"broll/ohfheaton/av_w007.mp4"},{"k":8,"from":4222,"dur":206,"src":"broll/ohfheaton/av_w008.mp4"},{"k":9,"from":4877,"dur":62,"src":"broll/ohfheaton/av_w009.mp4"},{"k":10,"from":6377,"dur":113,"src":"broll/ohfheaton/av_w010.mp4"},{"k":11,"from":6685,"dur":94,"src":"broll/ohfheaton/av_w011.mp4"},{"k":12,"from":7129,"dur":549,"src":"broll/ohfheaton/av_w012.mp4"},{"k":13,"from":8017,"dur":251,"src":"broll/ohfheaton/av_w013.mp4"},{"k":14,"from":8699,"dur":150,"src":"broll/ohfheaton/av_w014.mp4"},{"k":15,"from":9275,"dur":113,"src":"broll/ohfheaton/av_w015.mp4"},{"k":16,"from":9737,"dur":134,"src":"broll/ohfheaton/av_w016.mp4"},{"k":17,"from":10848,"dur":154,"src":"broll/ohfheaton/av_w017.mp4"},{"k":18,"from":11073,"dur":351,"src":"broll/ohfheaton/av_w018.mp4"},{"k":19,"from":12902,"dur":125,"src":"broll/ohfheaton/av_w019.mp4"},{"k":20,"from":13760,"dur":262,"src":"broll/ohfheaton/av_w020.mp4"},{"k":21,"from":15136,"dur":319,"src":"broll/ohfheaton/av_w021.mp4"},{"k":22,"from":15999,"dur":238,"src":"broll/ohfheaton/av_w022.mp4"},{"k":23,"from":17479,"dur":102,"src":"broll/ohfheaton/av_w023.mp4"},{"k":24,"from":18336,"dur":192,"src":"broll/ohfheaton/av_w024.mp4"},{"k":25,"from":18805,"dur":412,"src":"broll/ohfheaton/av_w025.mp4"},{"k":26,"from":19477,"dur":194,"src":"broll/ohfheaton/av_w026.mp4"},{"k":27,"from":20339,"dur":99,"src":"broll/ohfheaton/av_w027.mp4"},{"k":28,"from":20557,"dur":127,"src":"broll/ohfheaton/av_w028.mp4"},{"k":29,"from":21770,"dur":212,"src":"broll/ohfheaton/av_w029.mp4"},{"k":30,"from":23644,"dur":121,"src":"broll/ohfheaton/av_w030.mp4"},{"k":31,"from":23982,"dur":125,"src":"broll/ohfheaton/av_w031.mp4"},{"k":32,"from":25085,"dur":88,"src":"broll/ohfheaton/av_w032.mp4"},{"k":33,"from":26114,"dur":251,"src":"broll/ohfheaton/av_w033.mp4"},{"k":34,"from":26753,"dur":186,"src":"broll/ohfheaton/av_w034.mp4"},{"k":35,"from":27154,"dur":338,"src":"broll/ohfheaton/av_w035.mp4"},{"k":36,"from":27541,"dur":79,"src":"broll/ohfheaton/av_w036.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOhfheaton: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/ohfheaton/ohfheaton_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OHFHEATON.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OHFHEATON.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ohfheaton_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
