// Main_hlgenco.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_HLGENCO } from "./cues_hlgenco.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_HLGENCO = 37330;

const VENTANAS = [{"k":0,"from":30,"dur":162,"src":"broll/hlgenco/av_w000.mp4"},{"k":1,"from":771,"dur":102,"src":"broll/hlgenco/av_w001.mp4"},{"k":2,"from":1058,"dur":160,"src":"broll/hlgenco/av_w002.mp4","fx":[{"start":24,"dur":136,"kind":"detras","props":{"texto":"40 YEARS","sub":"ON THE POLES"}}],"fg":"broll/hlgenco/av_w002_fg.webm"},{"k":3,"from":1319,"dur":223,"src":"broll/hlgenco/av_w003.mp4"},{"k":4,"from":1634,"dur":221,"src":"broll/hlgenco/av_w004.mp4","fx":[{"start":21,"dur":196,"kind":"detras","props":{"texto":"THE MISTAKE","sub":"THAT KILLS FAMILIES"}}],"fg":"broll/hlgenco/av_w004_fg.webm"},{"k":5,"from":2089,"dur":197,"src":"broll/hlgenco/av_w005.mp4"},{"k":6,"from":2424,"dur":218,"src":"broll/hlgenco/av_w006.mp4"},{"k":7,"from":3068,"dur":151,"src":"broll/hlgenco/av_w007.mp4"},{"k":8,"from":3488,"dur":139,"src":"broll/hlgenco/av_w008.mp4"},{"k":9,"from":3766,"dur":207,"src":"broll/hlgenco/av_w009.mp4"},{"k":10,"from":4465,"dur":152,"src":"broll/hlgenco/av_w010.mp4"},{"k":11,"from":4900,"dur":117,"src":"broll/hlgenco/av_w011.mp4"},{"k":12,"from":5580,"dur":188,"src":"broll/hlgenco/av_w012.mp4"},{"k":13,"from":5873,"dur":159,"src":"broll/hlgenco/av_w013.mp4"},{"k":14,"from":6263,"dur":131,"src":"broll/hlgenco/av_w014.mp4"},{"k":15,"from":6856,"dur":171,"src":"broll/hlgenco/av_w015.mp4"},{"k":16,"from":7376,"dur":132,"src":"broll/hlgenco/av_w016.mp4"},{"k":17,"from":7701,"dur":98,"src":"broll/hlgenco/av_w017.mp4"},{"k":18,"from":8019,"dur":188,"src":"broll/hlgenco/av_w018.mp4","fx":[{"start":21,"dur":164,"kind":"detras","props":{"texto":"THE OPEN DOOR","sub":"THE BELIEF THAT KILLS"}}],"fg":"broll/hlgenco/av_w018_fg.webm"},{"k":19,"from":9043,"dur":107,"src":"broll/hlgenco/av_w019.mp4"},{"k":20,"from":9322,"dur":110,"src":"broll/hlgenco/av_w020.mp4"},{"k":21,"from":10229,"dur":81,"src":"broll/hlgenco/av_w021.mp4"},{"k":22,"from":10793,"dur":180,"src":"broll/hlgenco/av_w022.mp4","fx":[{"start":21,"dur":155,"kind":"detras","props":{"texto":"20 FEET","sub":"REMEMBER THE NUMBER"}}],"fg":"broll/hlgenco/av_w022_fg.webm"},{"k":23,"from":11300,"dur":256,"src":"broll/hlgenco/av_w023.mp4"},{"k":24,"from":12106,"dur":148,"src":"broll/hlgenco/av_w024.mp4"},{"k":25,"from":12617,"dur":321,"src":"broll/hlgenco/av_w025.mp4"},{"k":26,"from":13600,"dur":129,"src":"broll/hlgenco/av_w026.mp4"},{"k":27,"from":13845,"dur":60,"src":"broll/hlgenco/av_w027.mp4"},{"k":28,"from":14732,"dur":170,"src":"broll/hlgenco/av_w028.mp4"},{"k":29,"from":15124,"dur":189,"src":"broll/hlgenco/av_w029.mp4"},{"k":30,"from":16305,"dur":106,"src":"broll/hlgenco/av_w030.mp4"},{"k":31,"from":16868,"dur":276,"src":"broll/hlgenco/av_w031.mp4","fx":[{"start":21,"dur":130,"kind":"detras","props":{"texto":"4 MORE","sub":"PLACES IT HIDES"}}],"fg":"broll/hlgenco/av_w031_fg.webm"},{"k":32,"from":17515,"dur":135,"src":"broll/hlgenco/av_w032.mp4"},{"k":33,"from":18190,"dur":118,"src":"broll/hlgenco/av_w033.mp4"},{"k":34,"from":19250,"dur":140,"src":"broll/hlgenco/av_w034.mp4"},{"k":35,"from":19457,"dur":188,"src":"broll/hlgenco/av_w035.mp4"},{"k":36,"from":20339,"dur":126,"src":"broll/hlgenco/av_w036.mp4"},{"k":37,"from":21040,"dur":75,"src":"broll/hlgenco/av_w037.mp4"},{"k":38,"from":22194,"dur":119,"src":"broll/hlgenco/av_w038.mp4"},{"k":39,"from":22765,"dur":150,"src":"broll/hlgenco/av_w039.mp4"},{"k":40,"from":23113,"dur":106,"src":"broll/hlgenco/av_w040.mp4"},{"k":41,"from":23879,"dur":287,"src":"broll/hlgenco/av_w041.mp4"},{"k":42,"from":24671,"dur":54,"src":"broll/hlgenco/av_w042.mp4"},{"k":43,"from":25102,"dur":149,"src":"broll/hlgenco/av_w043.mp4"},{"k":44,"from":26271,"dur":273,"src":"broll/hlgenco/av_w044.mp4"},{"k":45,"from":26744,"dur":166,"src":"broll/hlgenco/av_w045.mp4"},{"k":46,"from":27148,"dur":218,"src":"broll/hlgenco/av_w046.mp4"},{"k":47,"from":28163,"dur":232,"src":"broll/hlgenco/av_w047.mp4"},{"k":48,"from":29373,"dur":83,"src":"broll/hlgenco/av_w048.mp4"},{"k":49,"from":29511,"dur":132,"src":"broll/hlgenco/av_w049.mp4"},{"k":50,"from":30400,"dur":121,"src":"broll/hlgenco/av_w050.mp4"},{"k":51,"from":30850,"dur":182,"src":"broll/hlgenco/av_w051.mp4","fx":[{"start":21,"dur":158,"kind":"detras","props":{"texto":"MY SETUP","sub":"AT MY OWN PLACE"}}],"fg":"broll/hlgenco/av_w051_fg.webm"},{"k":52,"from":32693,"dur":183,"src":"broll/hlgenco/av_w052.mp4"},{"k":53,"from":33287,"dur":261,"src":"broll/hlgenco/av_w053.mp4"},{"k":54,"from":34946,"dur":132,"src":"broll/hlgenco/av_w054.mp4"},{"k":55,"from":35669,"dur":83,"src":"broll/hlgenco/av_w055.mp4"},{"k":56,"from":35836,"dur":295,"src":"broll/hlgenco/av_w056.mp4"},{"k":57,"from":36307,"dur":91,"src":"broll/hlgenco/av_w057.mp4"},{"k":58,"from":36608,"dur":92,"src":"broll/hlgenco/av_w058.mp4"},{"k":59,"from":37086,"dur":243,"src":"broll/hlgenco/av_w059.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainHlgenco: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/hlgenco/hlgenco_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_HLGENCO.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_HLGENCO.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("hlgenco_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
