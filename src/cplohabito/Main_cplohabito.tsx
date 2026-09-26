// Main_cplohabito.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CPLOHABITO } from "./cues_cplohabito.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CPLOHABITO = 38616;

const VENTANAS = [{"k":0,"from":0,"dur":145,"src":"broll/cplohabito/av_w000.mp4"},{"k":1,"from":549,"dur":160,"src":"broll/cplohabito/av_w001.mp4"},{"k":2,"from":1104,"dur":261,"src":"broll/cplohabito/av_w002.mp4"},{"k":3,"from":1523,"dur":194,"src":"broll/cplohabito/av_w003.mp4"},{"k":4,"from":1851,"dur":193,"src":"broll/cplohabito/av_w004.mp4"},{"k":5,"from":2123,"dur":112,"src":"broll/cplohabito/av_w005.mp4"},{"k":6,"from":2628,"dur":190,"src":"broll/cplohabito/av_w006.mp4"},{"k":7,"from":3921,"dur":137,"src":"broll/cplohabito/av_w007.mp4"},{"k":8,"from":4775,"dur":96,"src":"broll/cplohabito/av_w008.mp4"},{"k":9,"from":5705,"dur":132,"src":"broll/cplohabito/av_w009.mp4"},{"k":10,"from":6653,"dur":179,"src":"broll/cplohabito/av_w010.mp4"},{"k":11,"from":7396,"dur":108,"src":"broll/cplohabito/av_w011.mp4"},{"k":12,"from":8677,"dur":109,"src":"broll/cplohabito/av_w012.mp4"},{"k":13,"from":9226,"dur":132,"src":"broll/cplohabito/av_w013.mp4"},{"k":14,"from":9558,"dur":314,"src":"broll/cplohabito/av_w014.mp4"},{"k":15,"from":10078,"dur":93,"src":"broll/cplohabito/av_w015.mp4"},{"k":16,"from":10628,"dur":158,"src":"broll/cplohabito/av_w016.mp4"},{"k":17,"from":11693,"dur":176,"src":"broll/cplohabito/av_w017.mp4"},{"k":18,"from":12067,"dur":132,"src":"broll/cplohabito/av_w018.mp4"},{"k":19,"from":12871,"dur":130,"src":"broll/cplohabito/av_w019.mp4"},{"k":20,"from":13094,"dur":141,"src":"broll/cplohabito/av_w020.mp4"},{"k":21,"from":13395,"dur":165,"src":"broll/cplohabito/av_w021.mp4"},{"k":22,"from":14070,"dur":116,"src":"broll/cplohabito/av_w022.mp4"},{"k":23,"from":14247,"dur":221,"src":"broll/cplohabito/av_w023.mp4"},{"k":24,"from":14615,"dur":105,"src":"broll/cplohabito/av_w024.mp4"},{"k":25,"from":14841,"dur":185,"src":"broll/cplohabito/av_w025.mp4"},{"k":26,"from":15682,"dur":112,"src":"broll/cplohabito/av_w026.mp4"},{"k":27,"from":16630,"dur":60,"src":"broll/cplohabito/av_w027.mp4"},{"k":28,"from":16786,"dur":196,"src":"broll/cplohabito/av_w028.mp4"},{"k":29,"from":17353,"dur":163,"src":"broll/cplohabito/av_w029.mp4"},{"k":30,"from":18148,"dur":94,"src":"broll/cplohabito/av_w030.mp4"},{"k":31,"from":18526,"dur":183,"src":"broll/cplohabito/av_w031.mp4"},{"k":32,"from":20015,"dur":312,"src":"broll/cplohabito/av_w032.mp4"},{"k":33,"from":21011,"dur":186,"src":"broll/cplohabito/av_w033.mp4"},{"k":34,"from":21679,"dur":90,"src":"broll/cplohabito/av_w034.mp4"},{"k":35,"from":21841,"dur":125,"src":"broll/cplohabito/av_w035.mp4"},{"k":36,"from":22458,"dur":105,"src":"broll/cplohabito/av_w036.mp4"},{"k":37,"from":23193,"dur":97,"src":"broll/cplohabito/av_w037.mp4"},{"k":38,"from":24485,"dur":136,"src":"broll/cplohabito/av_w038.mp4"},{"k":39,"from":24728,"dur":68,"src":"broll/cplohabito/av_w039.mp4"},{"k":40,"from":24880,"dur":143,"src":"broll/cplohabito/av_w040.mp4"},{"k":41,"from":25885,"dur":96,"src":"broll/cplohabito/av_w041.mp4"},{"k":42,"from":26352,"dur":104,"src":"broll/cplohabito/av_w042.mp4"},{"k":43,"from":26568,"dur":160,"src":"broll/cplohabito/av_w043.mp4"},{"k":44,"from":26827,"dur":61,"src":"broll/cplohabito/av_w044.mp4"},{"k":45,"from":27508,"dur":222,"src":"broll/cplohabito/av_w045.mp4"},{"k":46,"from":28337,"dur":225,"src":"broll/cplohabito/av_w046.mp4"},{"k":47,"from":28640,"dur":121,"src":"broll/cplohabito/av_w047.mp4"},{"k":48,"from":29125,"dur":93,"src":"broll/cplohabito/av_w048.mp4"},{"k":49,"from":29385,"dur":114,"src":"broll/cplohabito/av_w049.mp4"},{"k":50,"from":29872,"dur":86,"src":"broll/cplohabito/av_w050.mp4"},{"k":51,"from":30020,"dur":104,"src":"broll/cplohabito/av_w051.mp4"},{"k":52,"from":30371,"dur":157,"src":"broll/cplohabito/av_w052.mp4"},{"k":53,"from":31496,"dur":119,"src":"broll/cplohabito/av_w053.mp4"},{"k":54,"from":32631,"dur":201,"src":"broll/cplohabito/av_w054.mp4"},{"k":55,"from":33070,"dur":375,"src":"broll/cplohabito/av_w055.mp4"},{"k":56,"from":33547,"dur":122,"src":"broll/cplohabito/av_w056.mp4"},{"k":57,"from":34607,"dur":171,"src":"broll/cplohabito/av_w057.mp4"},{"k":58,"from":35797,"dur":169,"src":"broll/cplohabito/av_w058.mp4"},{"k":59,"from":36184,"dur":339,"src":"broll/cplohabito/av_w059.mp4"},{"k":60,"from":36712,"dur":138,"src":"broll/cplohabito/av_w060.mp4"},{"k":61,"from":36932,"dur":134,"src":"broll/cplohabito/av_w061.mp4"},{"k":62,"from":37678,"dur":661,"src":"broll/cplohabito/av_w062.mp4"},{"k":63,"from":38465,"dur":150,"src":"broll/cplohabito/av_w063.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCplohabito: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cplohabito/cplohabito_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CPLOHABITO.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CPLOHABITO.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cplohabito_mix.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
