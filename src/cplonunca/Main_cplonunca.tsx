// Main_cplonunca.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CPLONUNCA } from "./cues_cplonunca.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CPLONUNCA = 44511;

const VENTANAS = [{"k":0,"from":0,"dur":144,"src":"broll/cplonunca/av_w000.mp4"},{"k":1,"from":317,"dur":200,"src":"broll/cplonunca/av_w001.mp4"},{"k":2,"from":753,"dur":259,"src":"broll/cplonunca/av_w002.mp4"},{"k":3,"from":1273,"dur":132,"src":"broll/cplonunca/av_w003.mp4"},{"k":4,"from":1689,"dur":201,"src":"broll/cplonunca/av_w004.mp4"},{"k":5,"from":2104,"dur":90,"src":"broll/cplonunca/av_w005.mp4"},{"k":6,"from":2668,"dur":256,"src":"broll/cplonunca/av_w006.mp4"},{"k":7,"from":3037,"dur":159,"src":"broll/cplonunca/av_w007.mp4"},{"k":8,"from":3447,"dur":164,"src":"broll/cplonunca/av_w008.mp4"},{"k":9,"from":4491,"dur":175,"src":"broll/cplonunca/av_w009.mp4"},{"k":10,"from":5109,"dur":121,"src":"broll/cplonunca/av_w010.mp4"},{"k":11,"from":5497,"dur":116,"src":"broll/cplonunca/av_w011.mp4"},{"k":12,"from":6290,"dur":182,"src":"broll/cplonunca/av_w012.mp4"},{"k":13,"from":7184,"dur":299,"src":"broll/cplonunca/av_w013.mp4"},{"k":14,"from":7756,"dur":145,"src":"broll/cplonunca/av_w014.mp4"},{"k":15,"from":8195,"dur":150,"src":"broll/cplonunca/av_w015.mp4"},{"k":16,"from":8521,"dur":112,"src":"broll/cplonunca/av_w016.mp4"},{"k":17,"from":9034,"dur":97,"src":"broll/cplonunca/av_w017.mp4"},{"k":18,"from":9376,"dur":92,"src":"broll/cplonunca/av_w018.mp4"},{"k":19,"from":9688,"dur":134,"src":"broll/cplonunca/av_w019.mp4"},{"k":20,"from":10357,"dur":57,"src":"broll/cplonunca/av_w020.mp4"},{"k":21,"from":11566,"dur":88,"src":"broll/cplonunca/av_w021.mp4"},{"k":22,"from":11821,"dur":140,"src":"broll/cplonunca/av_w022.mp4"},{"k":23,"from":12727,"dur":73,"src":"broll/cplonunca/av_w023.mp4"},{"k":24,"from":13051,"dur":241,"src":"broll/cplonunca/av_w024.mp4"},{"k":25,"from":13612,"dur":144,"src":"broll/cplonunca/av_w025.mp4"},{"k":26,"from":14205,"dur":203,"src":"broll/cplonunca/av_w026.mp4"},{"k":27,"from":15574,"dur":304,"src":"broll/cplonunca/av_w027.mp4"},{"k":28,"from":16376,"dur":136,"src":"broll/cplonunca/av_w028.mp4"},{"k":29,"from":16820,"dur":228,"src":"broll/cplonunca/av_w029.mp4"},{"k":30,"from":17359,"dur":101,"src":"broll/cplonunca/av_w030.mp4"},{"k":31,"from":17619,"dur":236,"src":"broll/cplonunca/av_w031.mp4"},{"k":32,"from":18880,"dur":140,"src":"broll/cplonunca/av_w032.mp4"},{"k":33,"from":19309,"dur":166,"src":"broll/cplonunca/av_w033.mp4"},{"k":34,"from":19639,"dur":153,"src":"broll/cplonunca/av_w034.mp4"},{"k":35,"from":20303,"dur":191,"src":"broll/cplonunca/av_w035.mp4"},{"k":36,"from":21409,"dur":152,"src":"broll/cplonunca/av_w036.mp4"},{"k":37,"from":22165,"dur":181,"src":"broll/cplonunca/av_w037.mp4"},{"k":38,"from":23281,"dur":232,"src":"broll/cplonunca/av_w038.mp4"},{"k":39,"from":23619,"dur":76,"src":"broll/cplonunca/av_w039.mp4"},{"k":40,"from":24083,"dur":130,"src":"broll/cplonunca/av_w040.mp4"},{"k":41,"from":25653,"dur":322,"src":"broll/cplonunca/av_w041.mp4"},{"k":42,"from":26229,"dur":211,"src":"broll/cplonunca/av_w042.mp4"},{"k":43,"from":26956,"dur":142,"src":"broll/cplonunca/av_w043.mp4"},{"k":44,"from":27375,"dur":185,"src":"broll/cplonunca/av_w044.mp4"},{"k":45,"from":28261,"dur":88,"src":"broll/cplonunca/av_w045.mp4"},{"k":46,"from":28496,"dur":87,"src":"broll/cplonunca/av_w046.mp4"},{"k":47,"from":29091,"dur":260,"src":"broll/cplonunca/av_w047.mp4"},{"k":48,"from":29719,"dur":183,"src":"broll/cplonunca/av_w048.mp4"},{"k":49,"from":30572,"dur":244,"src":"broll/cplonunca/av_w049.mp4"},{"k":50,"from":31867,"dur":65,"src":"broll/cplonunca/av_w050.mp4"},{"k":51,"from":32149,"dur":380,"src":"broll/cplonunca/av_w051.mp4"},{"k":52,"from":33121,"dur":278,"src":"broll/cplonunca/av_w052.mp4"},{"k":53,"from":33847,"dur":104,"src":"broll/cplonunca/av_w053.mp4"},{"k":54,"from":35105,"dur":225,"src":"broll/cplonunca/av_w054.mp4"},{"k":55,"from":35531,"dur":182,"src":"broll/cplonunca/av_w055.mp4"},{"k":56,"from":35818,"dur":124,"src":"broll/cplonunca/av_w056.mp4"},{"k":57,"from":37029,"dur":140,"src":"broll/cplonunca/av_w057.mp4"},{"k":58,"from":37814,"dur":169,"src":"broll/cplonunca/av_w058.mp4"},{"k":59,"from":38570,"dur":104,"src":"broll/cplonunca/av_w059.mp4"},{"k":60,"from":38771,"dur":126,"src":"broll/cplonunca/av_w060.mp4"},{"k":61,"from":38951,"dur":194,"src":"broll/cplonunca/av_w061.mp4"},{"k":62,"from":39424,"dur":282,"src":"broll/cplonunca/av_w062.mp4"},{"k":63,"from":40598,"dur":129,"src":"broll/cplonunca/av_w063.mp4"},{"k":64,"from":40850,"dur":293,"src":"broll/cplonunca/av_w064.mp4"},{"k":65,"from":41458,"dur":152,"src":"broll/cplonunca/av_w065.mp4"},{"k":66,"from":42348,"dur":115,"src":"broll/cplonunca/av_w066.mp4"},{"k":67,"from":42884,"dur":101,"src":"broll/cplonunca/av_w067.mp4"},{"k":68,"from":43586,"dur":925,"src":"broll/cplonunca/av_w068.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCplonunca: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cplonunca/cplonunca_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CPLONUNCA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CPLONUNCA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cplonunca.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
