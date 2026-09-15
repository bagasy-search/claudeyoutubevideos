// Main_tcfiltro.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TCFILTRO } from "./cues_tcfiltro.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TCFILTRO = 43611;

const VENTANAS = [{"k":0,"from":0,"dur":146,"src":"broll/tcfiltro/av_w000.mp4"},{"k":1,"from":902,"dur":156,"src":"broll/tcfiltro/av_w001.mp4"},{"k":2,"from":1295,"dur":164,"src":"broll/tcfiltro/av_w002.mp4"},{"k":3,"from":1624,"dur":153,"src":"broll/tcfiltro/av_w003.mp4"},{"k":4,"from":2000,"dur":144,"src":"broll/tcfiltro/av_w004.mp4"},{"k":5,"from":2364,"dur":392,"src":"broll/tcfiltro/av_w005.mp4"},{"k":6,"from":4072,"dur":155,"src":"broll/tcfiltro/av_w006.mp4"},{"k":7,"from":5701,"dur":170,"src":"broll/tcfiltro/av_w007.mp4"},{"k":8,"from":6630,"dur":147,"src":"broll/tcfiltro/av_w008.mp4"},{"k":9,"from":7488,"dur":89,"src":"broll/tcfiltro/av_w009.mp4"},{"k":10,"from":7877,"dur":290,"src":"broll/tcfiltro/av_w010.mp4"},{"k":11,"from":9739,"dur":209,"src":"broll/tcfiltro/av_w011.mp4"},{"k":12,"from":10681,"dur":223,"src":"broll/tcfiltro/av_w012.mp4"},{"k":13,"from":11970,"dur":136,"src":"broll/tcfiltro/av_w013.mp4"},{"k":14,"from":13665,"dur":90,"src":"broll/tcfiltro/av_w014.mp4"},{"k":15,"from":14951,"dur":120,"src":"broll/tcfiltro/av_w015.mp4"},{"k":16,"from":16203,"dur":75,"src":"broll/tcfiltro/av_w016.mp4"},{"k":17,"from":17418,"dur":93,"src":"broll/tcfiltro/av_w017.mp4"},{"k":18,"from":18563,"dur":273,"src":"broll/tcfiltro/av_w018.mp4"},{"k":19,"from":20408,"dur":386,"src":"broll/tcfiltro/av_w019.mp4"},{"k":20,"from":21737,"dur":162,"src":"broll/tcfiltro/av_w020.mp4"},{"k":21,"from":23093,"dur":105,"src":"broll/tcfiltro/av_w021.mp4"},{"k":22,"from":23656,"dur":202,"src":"broll/tcfiltro/av_w022.mp4"},{"k":23,"from":25387,"dur":165,"src":"broll/tcfiltro/av_w023.mp4"},{"k":24,"from":25658,"dur":140,"src":"broll/tcfiltro/av_w024.mp4"},{"k":25,"from":26653,"dur":320,"src":"broll/tcfiltro/av_w025.mp4"},{"k":26,"from":27343,"dur":56,"src":"broll/tcfiltro/av_w026.mp4"},{"k":27,"from":28883,"dur":151,"src":"broll/tcfiltro/av_w027.mp4"},{"k":28,"from":29932,"dur":96,"src":"broll/tcfiltro/av_w028.mp4"},{"k":29,"from":31406,"dur":118,"src":"broll/tcfiltro/av_w029.mp4"},{"k":30,"from":31743,"dur":147,"src":"broll/tcfiltro/av_w030.mp4"},{"k":31,"from":33716,"dur":128,"src":"broll/tcfiltro/av_w031.mp4"},{"k":32,"from":36736,"dur":76,"src":"broll/tcfiltro/av_w032.mp4"},{"k":33,"from":37361,"dur":152,"src":"broll/tcfiltro/av_w033.mp4"},{"k":34,"from":38462,"dur":255,"src":"broll/tcfiltro/av_w034.mp4"},{"k":35,"from":40174,"dur":99,"src":"broll/tcfiltro/av_w035.mp4"},{"k":36,"from":42737,"dur":120,"src":"broll/tcfiltro/av_w036.mp4"},{"k":37,"from":43136,"dur":474,"src":"broll/tcfiltro/av_w037.mp4"}];

export const MainTcfiltro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tcfiltro/tcfiltro_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TCFILTRO.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TCFILTRO.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tcfiltro.m4a")} />
    </AbsoluteFill>
  );
};
