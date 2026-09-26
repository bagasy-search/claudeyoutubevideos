// Main_cmesegbat.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMESEGBAT } from "./cues_cmesegbat.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMESEGBAT = 34556;

const VENTANAS = [{"k":0,"from":0,"dur":119,"src":"broll/cmesegbat/av_w000.mp4"},{"k":1,"from":463,"dur":232,"src":"broll/cmesegbat/av_w001.mp4"},{"k":2,"from":1163,"dur":139,"src":"broll/cmesegbat/av_w002.mp4"},{"k":3,"from":1606,"dur":156,"src":"broll/cmesegbat/av_w003.mp4"},{"k":4,"from":1837,"dur":189,"src":"broll/cmesegbat/av_w004.mp4"},{"k":5,"from":2184,"dur":101,"src":"broll/cmesegbat/av_w005.mp4"},{"k":6,"from":2506,"dur":116,"src":"broll/cmesegbat/av_w006.mp4"},{"k":7,"from":2683,"dur":179,"src":"broll/cmesegbat/av_w007.mp4"},{"k":8,"from":3251,"dur":161,"src":"broll/cmesegbat/av_w008.mp4"},{"k":9,"from":3507,"dur":253,"src":"broll/cmesegbat/av_w009.mp4"},{"k":10,"from":5347,"dur":262,"src":"broll/cmesegbat/av_w010.mp4"},{"k":11,"from":6169,"dur":372,"src":"broll/cmesegbat/av_w011.mp4"},{"k":12,"from":6917,"dur":93,"src":"broll/cmesegbat/av_w012.mp4"},{"k":13,"from":7111,"dur":49,"src":"broll/cmesegbat/av_w013.mp4"},{"k":14,"from":7820,"dur":136,"src":"broll/cmesegbat/av_w014.mp4"},{"k":15,"from":8293,"dur":178,"src":"broll/cmesegbat/av_w015.mp4"},{"k":16,"from":8656,"dur":292,"src":"broll/cmesegbat/av_w016.mp4"},{"k":17,"from":9413,"dur":143,"src":"broll/cmesegbat/av_w017.mp4"},{"k":18,"from":10420,"dur":162,"src":"broll/cmesegbat/av_w018.mp4"},{"k":19,"from":11345,"dur":192,"src":"broll/cmesegbat/av_w019.mp4"},{"k":20,"from":11642,"dur":74,"src":"broll/cmesegbat/av_w020.mp4"},{"k":21,"from":11813,"dur":119,"src":"broll/cmesegbat/av_w021.mp4"},{"k":22,"from":12590,"dur":116,"src":"broll/cmesegbat/av_w022.mp4"},{"k":23,"from":13420,"dur":78,"src":"broll/cmesegbat/av_w023.mp4"},{"k":24,"from":13940,"dur":201,"src":"broll/cmesegbat/av_w024.mp4"},{"k":25,"from":14724,"dur":149,"src":"broll/cmesegbat/av_w025.mp4"},{"k":26,"from":15156,"dur":154,"src":"broll/cmesegbat/av_w026.mp4"},{"k":27,"from":15376,"dur":207,"src":"broll/cmesegbat/av_w027.mp4"},{"k":28,"from":15959,"dur":288,"src":"broll/cmesegbat/av_w028.mp4"},{"k":29,"from":17611,"dur":170,"src":"broll/cmesegbat/av_w029.mp4"},{"k":30,"from":17990,"dur":170,"src":"broll/cmesegbat/av_w030.mp4"},{"k":31,"from":18304,"dur":88,"src":"broll/cmesegbat/av_w031.mp4"},{"k":32,"from":18523,"dur":129,"src":"broll/cmesegbat/av_w032.mp4"},{"k":33,"from":18829,"dur":180,"src":"broll/cmesegbat/av_w033.mp4"},{"k":34,"from":19874,"dur":168,"src":"broll/cmesegbat/av_w034.mp4"},{"k":35,"from":22379,"dur":117,"src":"broll/cmesegbat/av_w035.mp4"},{"k":36,"from":22733,"dur":307,"src":"broll/cmesegbat/av_w036.mp4"},{"k":37,"from":24038,"dur":164,"src":"broll/cmesegbat/av_w037.mp4"},{"k":38,"from":24317,"dur":164,"src":"broll/cmesegbat/av_w038.mp4"},{"k":39,"from":25013,"dur":188,"src":"broll/cmesegbat/av_w039.mp4"},{"k":40,"from":25270,"dur":99,"src":"broll/cmesegbat/av_w040.mp4"},{"k":41,"from":25555,"dur":168,"src":"broll/cmesegbat/av_w041.mp4"},{"k":42,"from":26527,"dur":142,"src":"broll/cmesegbat/av_w042.mp4"},{"k":43,"from":26912,"dur":119,"src":"broll/cmesegbat/av_w043.mp4"},{"k":44,"from":27356,"dur":231,"src":"broll/cmesegbat/av_w044.mp4"},{"k":45,"from":27898,"dur":177,"src":"broll/cmesegbat/av_w045.mp4"},{"k":46,"from":29032,"dur":237,"src":"broll/cmesegbat/av_w046.mp4"},{"k":47,"from":29815,"dur":261,"src":"broll/cmesegbat/av_w047.mp4"},{"k":48,"from":30190,"dur":136,"src":"broll/cmesegbat/av_w048.mp4"},{"k":49,"from":31271,"dur":109,"src":"broll/cmesegbat/av_w049.mp4"},{"k":50,"from":33690,"dur":350,"src":"broll/cmesegbat/av_w050.mp4"},{"k":51,"from":34239,"dur":184,"src":"broll/cmesegbat/av_w051.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmesegbat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmesegbat/cmesegbat_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMESEGBAT.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMESEGBAT.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmesegbat.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
