// Main_fbrefrac.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FBREFRAC } from "./cues_fbrefrac.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_FBREFRAC = 28876;

const VENTANAS = [{"k":0,"from":0,"dur":148,"src":"broll/fbrefrac/av_w000.mp4"},{"k":1,"from":789,"dur":327,"src":"broll/fbrefrac/av_w001.mp4"},{"k":2,"from":1471,"dur":53,"src":"broll/fbrefrac/av_w002.mp4"},{"k":3,"from":2001,"dur":185,"src":"broll/fbrefrac/av_w003.mp4"},{"k":4,"from":2462,"dur":109,"src":"broll/fbrefrac/av_w004.mp4"},{"k":5,"from":2905,"dur":199,"src":"broll/fbrefrac/av_w005.mp4"},{"k":6,"from":4600,"dur":173,"src":"broll/fbrefrac/av_w006.mp4"},{"k":7,"from":5389,"dur":95,"src":"broll/fbrefrac/av_w007.mp4"},{"k":8,"from":6212,"dur":119,"src":"broll/fbrefrac/av_w008.mp4"},{"k":9,"from":7671,"dur":64,"src":"broll/fbrefrac/av_w009.mp4"},{"k":10,"from":10070,"dur":104,"src":"broll/fbrefrac/av_w010.mp4"},{"k":11,"from":11486,"dur":160,"src":"broll/fbrefrac/av_w011.mp4"},{"k":12,"from":12871,"dur":218,"src":"broll/fbrefrac/av_w012.mp4"},{"k":13,"from":13907,"dur":288,"src":"broll/fbrefrac/av_w013.mp4"},{"k":14,"from":14775,"dur":311,"src":"broll/fbrefrac/av_w014.mp4"},{"k":15,"from":15567,"dur":140,"src":"broll/fbrefrac/av_w015.mp4"},{"k":16,"from":16864,"dur":317,"src":"broll/fbrefrac/av_w016.mp4"},{"k":17,"from":17371,"dur":357,"src":"broll/fbrefrac/av_w017.mp4"},{"k":18,"from":18835,"dur":123,"src":"broll/fbrefrac/av_w018.mp4"},{"k":19,"from":19369,"dur":153,"src":"broll/fbrefrac/av_w019.mp4"},{"k":20,"from":19888,"dur":129,"src":"broll/fbrefrac/av_w020.mp4"},{"k":21,"from":20889,"dur":130,"src":"broll/fbrefrac/av_w021.mp4"},{"k":22,"from":21736,"dur":325,"src":"broll/fbrefrac/av_w022.mp4"},{"k":23,"from":22443,"dur":451,"src":"broll/fbrefrac/av_w023.mp4"},{"k":24,"from":24298,"dur":176,"src":"broll/fbrefrac/av_w024.mp4"},{"k":25,"from":24913,"dur":178,"src":"broll/fbrefrac/av_w025.mp4"},{"k":26,"from":25282,"dur":317,"src":"broll/fbrefrac/av_w026.mp4"},{"k":27,"from":26329,"dur":213,"src":"broll/fbrefrac/av_w027.mp4"},{"k":28,"from":27475,"dur":459,"src":"broll/fbrefrac/av_w028.mp4"},{"k":29,"from":28040,"dur":228,"src":"broll/fbrefrac/av_w029.mp4"},{"k":30,"from":28379,"dur":294,"src":"broll/fbrefrac/av_w030.mp4"},{"k":31,"from":28827,"dur":48,"src":"broll/fbrefrac/av_w031.mp4"}];

export const MainFbrefrac: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/fbrefrac/fbrefrac_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_FBREFRAC.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FBREFRAC.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fbrefrac.m4a")} />
    </AbsoluteFill>
  );
};
