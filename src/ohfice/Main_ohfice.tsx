// Main_ohfice.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OHFICE } from "./cues_ohfice.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OHFICE = 26446;

const VENTANAS = [{"k":0,"from":30,"dur":90,"src":"broll/ohfice/av_w000.mp4"},{"k":1,"from":831,"dur":166,"src":"broll/ohfice/av_w001.mp4"},{"k":2,"from":1107,"dur":104,"src":"broll/ohfice/av_w002.mp4"},{"k":3,"from":1529,"dur":605,"src":"broll/ohfice/av_w003.mp4"},{"k":4,"from":2419,"dur":162,"src":"broll/ohfice/av_w004.mp4"},{"k":5,"from":3154,"dur":228,"src":"broll/ohfice/av_w005.mp4"},{"k":6,"from":3425,"dur":257,"src":"broll/ohfice/av_w006.mp4"},{"k":7,"from":3867,"dur":133,"src":"broll/ohfice/av_w007.mp4"},{"k":8,"from":4208,"dur":320,"src":"broll/ohfice/av_w008.mp4"},{"k":9,"from":4907,"dur":117,"src":"broll/ohfice/av_w009.mp4"},{"k":10,"from":5714,"dur":98,"src":"broll/ohfice/av_w010.mp4"},{"k":11,"from":6835,"dur":141,"src":"broll/ohfice/av_w011.mp4"},{"k":12,"from":7199,"dur":186,"src":"broll/ohfice/av_w012.mp4"},{"k":13,"from":7615,"dur":308,"src":"broll/ohfice/av_w013.mp4"},{"k":14,"from":10159,"dur":112,"src":"broll/ohfice/av_w014.mp4"},{"k":15,"from":11984,"dur":146,"src":"broll/ohfice/av_w015.mp4"},{"k":16,"from":12245,"dur":328,"src":"broll/ohfice/av_w016.mp4"},{"k":17,"from":12841,"dur":144,"src":"broll/ohfice/av_w017.mp4"},{"k":18,"from":13260,"dur":94,"src":"broll/ohfice/av_w018.mp4"},{"k":19,"from":13829,"dur":106,"src":"broll/ohfice/av_w019.mp4"},{"k":20,"from":14356,"dur":120,"src":"broll/ohfice/av_w020.mp4"},{"k":21,"from":14657,"dur":332,"src":"broll/ohfice/av_w021.mp4"},{"k":22,"from":16654,"dur":337,"src":"broll/ohfice/av_w022.mp4"},{"k":23,"from":17088,"dur":89,"src":"broll/ohfice/av_w023.mp4"},{"k":24,"from":18890,"dur":78,"src":"broll/ohfice/av_w024.mp4"},{"k":25,"from":19144,"dur":189,"src":"broll/ohfice/av_w025.mp4"},{"k":26,"from":20148,"dur":265,"src":"broll/ohfice/av_w026.mp4"},{"k":27,"from":20665,"dur":265,"src":"broll/ohfice/av_w027.mp4"},{"k":28,"from":21110,"dur":171,"src":"broll/ohfice/av_w028.mp4"},{"k":29,"from":21727,"dur":58,"src":"broll/ohfice/av_w029.mp4"},{"k":30,"from":22208,"dur":140,"src":"broll/ohfice/av_w030.mp4"},{"k":31,"from":22714,"dur":202,"src":"broll/ohfice/av_w031.mp4"},{"k":32,"from":23219,"dur":429,"src":"broll/ohfice/av_w032.mp4"},{"k":33,"from":23779,"dur":229,"src":"broll/ohfice/av_w033.mp4"},{"k":34,"from":24996,"dur":272,"src":"broll/ohfice/av_w034.mp4"},{"k":35,"from":25574,"dur":184,"src":"broll/ohfice/av_w035.mp4"},{"k":36,"from":26047,"dur":399,"src":"broll/ohfice/av_w036.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOhfice: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/ohfice/ohfice_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OHFICE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OHFICE.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ohfice_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
