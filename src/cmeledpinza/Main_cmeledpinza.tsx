// Main_cmeledpinza.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMELEDPINZA } from "./cues_cmeledpinza.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMELEDPINZA = 46725;

const VENTANAS = [{"k":0,"from":0,"dur":99,"src":"broll/cmeledpinza/av_w000.mp4"},{"k":1,"from":195,"dur":289,"src":"broll/cmeledpinza/av_w001.mp4"},{"k":2,"from":679,"dur":260,"src":"broll/cmeledpinza/av_w002.mp4"},{"k":3,"from":1434,"dur":348,"src":"broll/cmeledpinza/av_w003.mp4"},{"k":4,"from":1846,"dur":183,"src":"broll/cmeledpinza/av_w004.mp4"},{"k":5,"from":2154,"dur":148,"src":"broll/cmeledpinza/av_w005.mp4"},{"k":6,"from":2338,"dur":148,"src":"broll/cmeledpinza/av_w006.mp4"},{"k":7,"from":3109,"dur":141,"src":"broll/cmeledpinza/av_w007.mp4"},{"k":8,"from":3905,"dur":141,"src":"broll/cmeledpinza/av_w008.mp4"},{"k":9,"from":4862,"dur":137,"src":"broll/cmeledpinza/av_w009.mp4"},{"k":10,"from":5944,"dur":282,"src":"broll/cmeledpinza/av_w010.mp4"},{"k":11,"from":6595,"dur":199,"src":"broll/cmeledpinza/av_w011.mp4"},{"k":12,"from":6867,"dur":189,"src":"broll/cmeledpinza/av_w012.mp4"},{"k":13,"from":7272,"dur":116,"src":"broll/cmeledpinza/av_w013.mp4"},{"k":14,"from":7913,"dur":80,"src":"broll/cmeledpinza/av_w014.mp4"},{"k":15,"from":8564,"dur":126,"src":"broll/cmeledpinza/av_w015.mp4"},{"k":16,"from":9515,"dur":232,"src":"broll/cmeledpinza/av_w016.mp4"},{"k":17,"from":10060,"dur":267,"src":"broll/cmeledpinza/av_w017.mp4"},{"k":18,"from":10545,"dur":130,"src":"broll/cmeledpinza/av_w018.mp4"},{"k":19,"from":11025,"dur":50,"src":"broll/cmeledpinza/av_w019.mp4"},{"k":20,"from":11520,"dur":201,"src":"broll/cmeledpinza/av_w020.mp4"},{"k":21,"from":11985,"dur":96,"src":"broll/cmeledpinza/av_w021.mp4"},{"k":22,"from":12859,"dur":246,"src":"broll/cmeledpinza/av_w022.mp4"},{"k":23,"from":14089,"dur":131,"src":"broll/cmeledpinza/av_w023.mp4"},{"k":24,"from":14951,"dur":85,"src":"broll/cmeledpinza/av_w024.mp4"},{"k":25,"from":15556,"dur":246,"src":"broll/cmeledpinza/av_w025.mp4"},{"k":26,"from":16258,"dur":152,"src":"broll/cmeledpinza/av_w026.mp4"},{"k":27,"from":16802,"dur":338,"src":"broll/cmeledpinza/av_w027.mp4"},{"k":28,"from":17343,"dur":220,"src":"broll/cmeledpinza/av_w028.mp4"},{"k":29,"from":17837,"dur":319,"src":"broll/cmeledpinza/av_w029.mp4"},{"k":30,"from":18493,"dur":166,"src":"broll/cmeledpinza/av_w030.mp4"},{"k":31,"from":19238,"dur":111,"src":"broll/cmeledpinza/av_w031.mp4"},{"k":32,"from":19774,"dur":121,"src":"broll/cmeledpinza/av_w032.mp4"},{"k":33,"from":19981,"dur":117,"src":"broll/cmeledpinza/av_w033.mp4"},{"k":34,"from":20570,"dur":87,"src":"broll/cmeledpinza/av_w034.mp4"},{"k":35,"from":22241,"dur":238,"src":"broll/cmeledpinza/av_w035.mp4"},{"k":36,"from":22693,"dur":115,"src":"broll/cmeledpinza/av_w036.mp4"},{"k":37,"from":24048,"dur":307,"src":"broll/cmeledpinza/av_w037.mp4"},{"k":38,"from":24475,"dur":142,"src":"broll/cmeledpinza/av_w038.mp4"},{"k":39,"from":24865,"dur":346,"src":"broll/cmeledpinza/av_w039.mp4"},{"k":40,"from":25570,"dur":163,"src":"broll/cmeledpinza/av_w040.mp4"},{"k":41,"from":26373,"dur":166,"src":"broll/cmeledpinza/av_w041.mp4"},{"k":42,"from":27419,"dur":200,"src":"broll/cmeledpinza/av_w042.mp4"},{"k":43,"from":28142,"dur":351,"src":"broll/cmeledpinza/av_w043.mp4"},{"k":44,"from":28822,"dur":190,"src":"broll/cmeledpinza/av_w044.mp4"},{"k":45,"from":29350,"dur":146,"src":"broll/cmeledpinza/av_w045.mp4"},{"k":46,"from":30596,"dur":198,"src":"broll/cmeledpinza/av_w046.mp4"},{"k":47,"from":31592,"dur":148,"src":"broll/cmeledpinza/av_w047.mp4"},{"k":48,"from":32355,"dur":56,"src":"broll/cmeledpinza/av_w048.mp4"},{"k":49,"from":32651,"dur":90,"src":"broll/cmeledpinza/av_w049.mp4"},{"k":50,"from":33118,"dur":444,"src":"broll/cmeledpinza/av_w050.mp4"},{"k":51,"from":33799,"dur":346,"src":"broll/cmeledpinza/av_w051.mp4"},{"k":52,"from":35123,"dur":150,"src":"broll/cmeledpinza/av_w052.mp4"},{"k":53,"from":35839,"dur":93,"src":"broll/cmeledpinza/av_w053.mp4"},{"k":54,"from":36254,"dur":165,"src":"broll/cmeledpinza/av_w054.mp4"},{"k":55,"from":38231,"dur":193,"src":"broll/cmeledpinza/av_w055.mp4"},{"k":56,"from":38591,"dur":173,"src":"broll/cmeledpinza/av_w056.mp4"},{"k":57,"from":39560,"dur":152,"src":"broll/cmeledpinza/av_w057.mp4"},{"k":58,"from":40038,"dur":205,"src":"broll/cmeledpinza/av_w058.mp4"},{"k":59,"from":40448,"dur":120,"src":"broll/cmeledpinza/av_w059.mp4"},{"k":60,"from":40759,"dur":61,"src":"broll/cmeledpinza/av_w060.mp4"},{"k":61,"from":42692,"dur":228,"src":"broll/cmeledpinza/av_w061.mp4"},{"k":62,"from":43098,"dur":221,"src":"broll/cmeledpinza/av_w062.mp4"},{"k":63,"from":43516,"dur":124,"src":"broll/cmeledpinza/av_w063.mp4"},{"k":64,"from":43913,"dur":102,"src":"broll/cmeledpinza/av_w064.mp4"},{"k":65,"from":44966,"dur":250,"src":"broll/cmeledpinza/av_w065.mp4"},{"k":66,"from":45736,"dur":331,"src":"broll/cmeledpinza/av_w066.mp4"},{"k":67,"from":46381,"dur":343,"src":"broll/cmeledpinza/av_w067.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeledpinza: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeledpinza/cmeledpinza_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMELEDPINZA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMELEDPINZA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeledpinza.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
