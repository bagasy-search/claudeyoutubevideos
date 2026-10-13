// Main_cmv3barata.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMV3BARATA } from "./cues_cmv3barata.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMV3BARATA = 30893;

const VENTANAS = [{"k":0,"from":18,"dur":106,"src":"broll/cmv3barata/av_w000.mp4"},{"k":1,"from":310,"dur":153,"src":"broll/cmv3barata/av_w001.mp4"},{"k":2,"from":934,"dur":176,"src":"broll/cmv3barata/av_w002.mp4"},{"k":3,"from":1536,"dur":518,"src":"broll/cmv3barata/av_w003.mp4"},{"k":4,"from":2192,"dur":141,"src":"broll/cmv3barata/av_w004.mp4"},{"k":5,"from":2493,"dur":286,"src":"broll/cmv3barata/av_w005.mp4"},{"k":6,"from":2901,"dur":138,"src":"broll/cmv3barata/av_w006.mp4"},{"k":7,"from":3372,"dur":147,"src":"broll/cmv3barata/av_w007.mp4"},{"k":8,"from":3827,"dur":107,"src":"broll/cmv3barata/av_w008.mp4"},{"k":9,"from":4355,"dur":74,"src":"broll/cmv3barata/av_w009.mp4"},{"k":10,"from":4545,"dur":353,"src":"broll/cmv3barata/av_w010.mp4"},{"k":11,"from":5370,"dur":117,"src":"broll/cmv3barata/av_w011.mp4"},{"k":12,"from":6157,"dur":84,"src":"broll/cmv3barata/av_w012.mp4"},{"k":13,"from":6343,"dur":161,"src":"broll/cmv3barata/av_w013.mp4"},{"k":14,"from":6728,"dur":150,"src":"broll/cmv3barata/av_w014.mp4"},{"k":15,"from":7219,"dur":125,"src":"broll/cmv3barata/av_w015.mp4"},{"k":16,"from":7886,"dur":248,"src":"broll/cmv3barata/av_w016.mp4"},{"k":17,"from":8596,"dur":222,"src":"broll/cmv3barata/av_w017.mp4"},{"k":18,"from":9346,"dur":148,"src":"broll/cmv3barata/av_w018.mp4"},{"k":19,"from":10021,"dur":138,"src":"broll/cmv3barata/av_w019.mp4"},{"k":20,"from":10282,"dur":119,"src":"broll/cmv3barata/av_w020.mp4"},{"k":21,"from":10559,"dur":177,"src":"broll/cmv3barata/av_w021.mp4"},{"k":22,"from":10949,"dur":275,"src":"broll/cmv3barata/av_w022.mp4"},{"k":23,"from":11620,"dur":112,"src":"broll/cmv3barata/av_w023.mp4"},{"k":24,"from":12047,"dur":231,"src":"broll/cmv3barata/av_w024.mp4"},{"k":25,"from":12844,"dur":176,"src":"broll/cmv3barata/av_w025.mp4"},{"k":26,"from":13589,"dur":149,"src":"broll/cmv3barata/av_w026.mp4"},{"k":27,"from":14252,"dur":84,"src":"broll/cmv3barata/av_w027.mp4"},{"k":28,"from":14533,"dur":91,"src":"broll/cmv3barata/av_w028.mp4"},{"k":29,"from":14953,"dur":204,"src":"broll/cmv3barata/av_w029.mp4"},{"k":30,"from":15696,"dur":205,"src":"broll/cmv3barata/av_w030.mp4"},{"k":31,"from":16039,"dur":138,"src":"broll/cmv3barata/av_w031.mp4"},{"k":32,"from":16591,"dur":124,"src":"broll/cmv3barata/av_w032.mp4"},{"k":33,"from":16870,"dur":101,"src":"broll/cmv3barata/av_w033.mp4"},{"k":34,"from":17146,"dur":207,"src":"broll/cmv3barata/av_w034.mp4"},{"k":35,"from":17432,"dur":198,"src":"broll/cmv3barata/av_w035.mp4"},{"k":36,"from":17880,"dur":335,"src":"broll/cmv3barata/av_w036.mp4"},{"k":37,"from":18694,"dur":82,"src":"broll/cmv3barata/av_w037.mp4"},{"k":38,"from":19244,"dur":245,"src":"broll/cmv3barata/av_w038.mp4"},{"k":39,"from":19699,"dur":154,"src":"broll/cmv3barata/av_w039.mp4"},{"k":40,"from":20251,"dur":94,"src":"broll/cmv3barata/av_w040.mp4"},{"k":41,"from":20631,"dur":240,"src":"broll/cmv3barata/av_w041.mp4"},{"k":42,"from":21059,"dur":85,"src":"broll/cmv3barata/av_w042.mp4"},{"k":43,"from":21325,"dur":417,"src":"broll/cmv3barata/av_w043.mp4"},{"k":44,"from":22364,"dur":400,"src":"broll/cmv3barata/av_w044.mp4"},{"k":45,"from":22930,"dur":112,"src":"broll/cmv3barata/av_w045.mp4"},{"k":46,"from":23104,"dur":306,"src":"broll/cmv3barata/av_w046.mp4"},{"k":47,"from":23783,"dur":293,"src":"broll/cmv3barata/av_w047.mp4"},{"k":48,"from":24305,"dur":159,"src":"broll/cmv3barata/av_w048.mp4"},{"k":49,"from":25276,"dur":61,"src":"broll/cmv3barata/av_w049.mp4"},{"k":50,"from":25661,"dur":381,"src":"broll/cmv3barata/av_w050.mp4"},{"k":51,"from":26324,"dur":122,"src":"broll/cmv3barata/av_w051.mp4"},{"k":52,"from":26537,"dur":90,"src":"broll/cmv3barata/av_w052.mp4"},{"k":53,"from":27248,"dur":117,"src":"broll/cmv3barata/av_w053.mp4"},{"k":54,"from":27588,"dur":113,"src":"broll/cmv3barata/av_w054.mp4"},{"k":55,"from":28045,"dur":230,"src":"broll/cmv3barata/av_w055.mp4"},{"k":56,"from":28387,"dur":150,"src":"broll/cmv3barata/av_w056.mp4"},{"k":57,"from":28629,"dur":95,"src":"broll/cmv3barata/av_w057.mp4"},{"k":58,"from":28963,"dur":183,"src":"broll/cmv3barata/av_w058.mp4"},{"k":59,"from":29658,"dur":363,"src":"broll/cmv3barata/av_w059.mp4"},{"k":60,"from":30232,"dur":266,"src":"broll/cmv3barata/av_w060.mp4"},{"k":61,"from":30731,"dur":162,"src":"broll/cmv3barata/av_w061.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmv3barata: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmv3barata/cmv3barata_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMV3BARATA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMV3BARATA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={18} layout="none"><Audio src={staticFile("cmv3barata.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
