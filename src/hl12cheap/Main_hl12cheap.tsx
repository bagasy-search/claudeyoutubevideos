// Main_hl12cheap.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_HL12CHEAP } from "./cues_hl12cheap.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_HL12CHEAP = 39798;

const VENTANAS = [{"k":0,"from":30,"dur":206,"src":"broll/hl12cheap/av_w000.mp4"},{"k":1,"from":867,"dur":109,"src":"broll/hl12cheap/av_w001.mp4"},{"k":2,"from":1214,"dur":364,"src":"broll/hl12cheap/av_w002.mp4","fx":[{"start":175,"dur":189,"kind":"detras","props":{"texto":"12","sub":"CHEAP THINGS"}}],"fg":"broll/hl12cheap/av_w002_fg.webm"},{"k":3,"from":1634,"dur":187,"src":"broll/hl12cheap/av_w003.mp4"},{"k":4,"from":1922,"dur":198,"src":"broll/hl12cheap/av_w004.mp4"},{"k":5,"from":2188,"dur":154,"src":"broll/hl12cheap/av_w005.mp4"},{"k":6,"from":2503,"dur":177,"src":"broll/hl12cheap/av_w006.mp4"},{"k":7,"from":2846,"dur":201,"src":"broll/hl12cheap/av_w007.mp4"},{"k":8,"from":3373,"dur":145,"src":"broll/hl12cheap/av_w008.mp4"},{"k":9,"from":3844,"dur":171,"src":"broll/hl12cheap/av_w009.mp4"},{"k":10,"from":4379,"dur":240,"src":"broll/hl12cheap/av_w010.mp4"},{"k":11,"from":4796,"dur":116,"src":"broll/hl12cheap/av_w011.mp4"},{"k":12,"from":5015,"dur":123,"src":"broll/hl12cheap/av_w012.mp4"},{"k":13,"from":5214,"dur":115,"src":"broll/hl12cheap/av_w013.mp4"},{"k":14,"from":5788,"dur":135,"src":"broll/hl12cheap/av_w014.mp4"},{"k":15,"from":6439,"dur":242,"src":"broll/hl12cheap/av_w015.mp4"},{"k":16,"from":6971,"dur":159,"src":"broll/hl12cheap/av_w016.mp4"},{"k":17,"from":7528,"dur":129,"src":"broll/hl12cheap/av_w017.mp4"},{"k":18,"from":7747,"dur":111,"src":"broll/hl12cheap/av_w018.mp4"},{"k":19,"from":8230,"dur":124,"src":"broll/hl12cheap/av_w019.mp4"},{"k":20,"from":8819,"dur":231,"src":"broll/hl12cheap/av_w020.mp4"},{"k":21,"from":9502,"dur":144,"src":"broll/hl12cheap/av_w021.mp4"},{"k":22,"from":9719,"dur":218,"src":"broll/hl12cheap/av_w022.mp4"},{"k":23,"from":10252,"dur":79,"src":"broll/hl12cheap/av_w023.mp4"},{"k":24,"from":10841,"dur":164,"src":"broll/hl12cheap/av_w024.mp4"},{"k":25,"from":11461,"dur":71,"src":"broll/hl12cheap/av_w025.mp4"},{"k":26,"from":11654,"dur":234,"src":"broll/hl12cheap/av_w026.mp4"},{"k":27,"from":12445,"dur":91,"src":"broll/hl12cheap/av_w027.mp4"},{"k":28,"from":12598,"dur":123,"src":"broll/hl12cheap/av_w028.mp4"},{"k":29,"from":12946,"dur":253,"src":"broll/hl12cheap/av_w029.mp4"},{"k":30,"from":13947,"dur":174,"src":"broll/hl12cheap/av_w030.mp4"},{"k":31,"from":15045,"dur":127,"src":"broll/hl12cheap/av_w031.mp4"},{"k":32,"from":15635,"dur":119,"src":"broll/hl12cheap/av_w032.mp4"},{"k":33,"from":16265,"dur":168,"src":"broll/hl12cheap/av_w033.mp4"},{"k":34,"from":16474,"dur":174,"src":"broll/hl12cheap/av_w034.mp4"},{"k":35,"from":17158,"dur":282,"src":"broll/hl12cheap/av_w035.mp4"},{"k":36,"from":18103,"dur":96,"src":"broll/hl12cheap/av_w036.mp4"},{"k":37,"from":18499,"dur":148,"src":"broll/hl12cheap/av_w037.mp4"},{"k":38,"from":18850,"dur":234,"src":"broll/hl12cheap/av_w038.mp4"},{"k":39,"from":19349,"dur":90,"src":"broll/hl12cheap/av_w039.mp4"},{"k":40,"from":19709,"dur":269,"src":"broll/hl12cheap/av_w040.mp4"},{"k":41,"from":20716,"dur":157,"src":"broll/hl12cheap/av_w041.mp4"},{"k":42,"from":21463,"dur":210,"src":"broll/hl12cheap/av_w042.mp4"},{"k":43,"from":22097,"dur":126,"src":"broll/hl12cheap/av_w043.mp4"},{"k":44,"from":22618,"dur":101,"src":"broll/hl12cheap/av_w044.mp4"},{"k":45,"from":23580,"dur":99,"src":"broll/hl12cheap/av_w045.mp4"},{"k":46,"from":24506,"dur":161,"src":"broll/hl12cheap/av_w046.mp4"},{"k":47,"from":25166,"dur":124,"src":"broll/hl12cheap/av_w047.mp4"},{"k":48,"from":25335,"dur":122,"src":"broll/hl12cheap/av_w048.mp4"},{"k":49,"from":25726,"dur":76,"src":"broll/hl12cheap/av_w049.mp4"},{"k":50,"from":26558,"dur":252,"src":"broll/hl12cheap/av_w050.mp4"},{"k":51,"from":27048,"dur":92,"src":"broll/hl12cheap/av_w051.mp4"},{"k":52,"from":27660,"dur":223,"src":"broll/hl12cheap/av_w052.mp4"},{"k":53,"from":28322,"dur":99,"src":"broll/hl12cheap/av_w053.mp4"},{"k":54,"from":29359,"dur":210,"src":"broll/hl12cheap/av_w054.mp4"},{"k":55,"from":29680,"dur":100,"src":"broll/hl12cheap/av_w055.mp4","fx":[{"start":18,"dur":77,"kind":"detras","props":{"texto":"$20","sub":"MAYBE $25"}}],"fg":"broll/hl12cheap/av_w055_fg.webm"},{"k":56,"from":29989,"dur":130,"src":"broll/hl12cheap/av_w056.mp4"},{"k":57,"from":30945,"dur":164,"src":"broll/hl12cheap/av_w057.mp4"},{"k":58,"from":31820,"dur":237,"src":"broll/hl12cheap/av_w058.mp4"},{"k":59,"from":32152,"dur":276,"src":"broll/hl12cheap/av_w059.mp4"},{"k":60,"from":34049,"dur":110,"src":"broll/hl12cheap/av_w060.mp4"},{"k":61,"from":35444,"dur":155,"src":"broll/hl12cheap/av_w061.mp4"},{"k":62,"from":37464,"dur":56,"src":"broll/hl12cheap/av_w062.mp4"},{"k":63,"from":38075,"dur":54,"src":"broll/hl12cheap/av_w063.mp4"},{"k":64,"from":38598,"dur":535,"src":"broll/hl12cheap/av_w064.mp4"},{"k":65,"from":39233,"dur":564,"src":"broll/hl12cheap/av_w065.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainHl12cheap: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/hl12cheap/hl12cheap_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_HL12CHEAP.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_HL12CHEAP.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("hl12cheap_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
