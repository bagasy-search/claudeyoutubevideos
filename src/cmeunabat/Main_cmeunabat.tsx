// Main_cmeunabat.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEUNABAT } from "./cues_cmeunabat.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEUNABAT = 46508;

const VENTANAS = [{"k":0,"from":0,"dur":115,"src":"broll/cmeunabat/av_w000.mp4"},{"k":1,"from":554,"dur":165,"src":"broll/cmeunabat/av_w001.mp4"},{"k":2,"from":791,"dur":125,"src":"broll/cmeunabat/av_w002.mp4"},{"k":3,"from":1027,"dur":207,"src":"broll/cmeunabat/av_w003.mp4"},{"k":4,"from":1591,"dur":206,"src":"broll/cmeunabat/av_w004.mp4"},{"k":5,"from":2302,"dur":210,"src":"broll/cmeunabat/av_w005.mp4"},{"k":6,"from":2650,"dur":124,"src":"broll/cmeunabat/av_w006.mp4"},{"k":7,"from":2902,"dur":171,"src":"broll/cmeunabat/av_w007.mp4"},{"k":8,"from":3163,"dur":186,"src":"broll/cmeunabat/av_w008.mp4"},{"k":9,"from":3529,"dur":167,"src":"broll/cmeunabat/av_w009.mp4"},{"k":10,"from":4147,"dur":95,"src":"broll/cmeunabat/av_w010.mp4"},{"k":11,"from":4339,"dur":271,"src":"broll/cmeunabat/av_w011.mp4"},{"k":12,"from":5111,"dur":162,"src":"broll/cmeunabat/av_w012.mp4"},{"k":13,"from":5592,"dur":140,"src":"broll/cmeunabat/av_w013.mp4"},{"k":14,"from":6145,"dur":233,"src":"broll/cmeunabat/av_w014.mp4"},{"k":15,"from":6652,"dur":193,"src":"broll/cmeunabat/av_w015.mp4"},{"k":16,"from":7708,"dur":88,"src":"broll/cmeunabat/av_w016.mp4"},{"k":17,"from":8675,"dur":139,"src":"broll/cmeunabat/av_w017.mp4"},{"k":18,"from":10488,"dur":261,"src":"broll/cmeunabat/av_w018.mp4"},{"k":19,"from":11122,"dur":130,"src":"broll/cmeunabat/av_w019.mp4"},{"k":20,"from":11339,"dur":174,"src":"broll/cmeunabat/av_w020.mp4"},{"k":21,"from":12011,"dur":95,"src":"broll/cmeunabat/av_w021.mp4"},{"k":22,"from":12821,"dur":80,"src":"broll/cmeunabat/av_w022.mp4"},{"k":23,"from":13242,"dur":68,"src":"broll/cmeunabat/av_w023.mp4"},{"k":24,"from":13693,"dur":93,"src":"broll/cmeunabat/av_w024.mp4"},{"k":25,"from":14279,"dur":75,"src":"broll/cmeunabat/av_w025.mp4"},{"k":26,"from":14952,"dur":127,"src":"broll/cmeunabat/av_w026.mp4"},{"k":27,"from":15469,"dur":121,"src":"broll/cmeunabat/av_w027.mp4"},{"k":28,"from":15738,"dur":356,"src":"broll/cmeunabat/av_w028.mp4"},{"k":29,"from":16165,"dur":154,"src":"broll/cmeunabat/av_w029.mp4"},{"k":30,"from":18122,"dur":134,"src":"broll/cmeunabat/av_w030.mp4"},{"k":31,"from":19804,"dur":148,"src":"broll/cmeunabat/av_w031.mp4"},{"k":32,"from":20987,"dur":129,"src":"broll/cmeunabat/av_w032.mp4"},{"k":33,"from":22018,"dur":104,"src":"broll/cmeunabat/av_w033.mp4"},{"k":34,"from":22627,"dur":107,"src":"broll/cmeunabat/av_w034.mp4"},{"k":35,"from":23192,"dur":111,"src":"broll/cmeunabat/av_w035.mp4"},{"k":36,"from":24562,"dur":222,"src":"broll/cmeunabat/av_w036.mp4"},{"k":37,"from":25426,"dur":148,"src":"broll/cmeunabat/av_w037.mp4"},{"k":38,"from":25889,"dur":80,"src":"broll/cmeunabat/av_w038.mp4"},{"k":39,"from":26597,"dur":111,"src":"broll/cmeunabat/av_w039.mp4"},{"k":40,"from":28240,"dur":192,"src":"broll/cmeunabat/av_w040.mp4"},{"k":41,"from":30192,"dur":812,"src":"broll/cmeunabat/av_w041.mp4"},{"k":42,"from":31381,"dur":124,"src":"broll/cmeunabat/av_w042.mp4"},{"k":43,"from":31654,"dur":146,"src":"broll/cmeunabat/av_w043.mp4"},{"k":44,"from":32278,"dur":83,"src":"broll/cmeunabat/av_w044.mp4"},{"k":45,"from":32686,"dur":204,"src":"broll/cmeunabat/av_w045.mp4"},{"k":46,"from":33926,"dur":113,"src":"broll/cmeunabat/av_w046.mp4"},{"k":47,"from":34594,"dur":88,"src":"broll/cmeunabat/av_w047.mp4"},{"k":48,"from":35026,"dur":104,"src":"broll/cmeunabat/av_w048.mp4"},{"k":49,"from":36992,"dur":111,"src":"broll/cmeunabat/av_w049.mp4"},{"k":50,"from":38341,"dur":179,"src":"broll/cmeunabat/av_w050.mp4"},{"k":51,"from":39590,"dur":90,"src":"broll/cmeunabat/av_w051.mp4"},{"k":52,"from":40190,"dur":560,"src":"broll/cmeunabat/av_w052.mp4"},{"k":53,"from":41588,"dur":86,"src":"broll/cmeunabat/av_w053.mp4"},{"k":54,"from":42563,"dur":337,"src":"broll/cmeunabat/av_w054.mp4"},{"k":55,"from":43208,"dur":148,"src":"broll/cmeunabat/av_w055.mp4"},{"k":56,"from":45121,"dur":174,"src":"broll/cmeunabat/av_w056.mp4"},{"k":57,"from":45694,"dur":814,"src":"broll/cmeunabat/av_w057.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeunabat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeunabat/cmeunabat_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEUNABAT.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEUNABAT.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeunabat.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
