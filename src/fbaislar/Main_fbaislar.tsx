// Main_fbaislar.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FBAISLAR } from "./cues_fbaislar.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_FBAISLAR = 29415;

const VENTANAS = [{"k":0,"from":0,"dur":140,"src":"broll/fbaislar/av_w000.mp4"},{"k":1,"from":1744,"dur":120,"src":"broll/fbaislar/av_w001.mp4"},{"k":2,"from":2358,"dur":67,"src":"broll/fbaislar/av_w002.mp4"},{"k":3,"from":2916,"dur":324,"src":"broll/fbaislar/av_w003.mp4"},{"k":4,"from":4023,"dur":81,"src":"broll/fbaislar/av_w004.mp4"},{"k":5,"from":4662,"dur":428,"src":"broll/fbaislar/av_w005.mp4"},{"k":6,"from":6171,"dur":87,"src":"broll/fbaislar/av_w006.mp4"},{"k":7,"from":6735,"dur":130,"src":"broll/fbaislar/av_w007.mp4"},{"k":8,"from":7336,"dur":184,"src":"broll/fbaislar/av_w008.mp4"},{"k":9,"from":8047,"dur":261,"src":"broll/fbaislar/av_w009.mp4"},{"k":10,"from":9815,"dur":103,"src":"broll/fbaislar/av_w010.mp4"},{"k":11,"from":10144,"dur":150,"src":"broll/fbaislar/av_w011.mp4"},{"k":12,"from":10405,"dur":169,"src":"broll/fbaislar/av_w012.mp4"},{"k":13,"from":12090,"dur":97,"src":"broll/fbaislar/av_w013.mp4"},{"k":14,"from":13205,"dur":98,"src":"broll/fbaislar/av_w014.mp4"},{"k":15,"from":13571,"dur":93,"src":"broll/fbaislar/av_w015.mp4"},{"k":16,"from":13736,"dur":138,"src":"broll/fbaislar/av_w016.mp4"},{"k":17,"from":15075,"dur":178,"src":"broll/fbaislar/av_w017.mp4"},{"k":18,"from":15964,"dur":199,"src":"broll/fbaislar/av_w018.mp4"},{"k":19,"from":16675,"dur":204,"src":"broll/fbaislar/av_w019.mp4"},{"k":20,"from":17209,"dur":168,"src":"broll/fbaislar/av_w020.mp4"},{"k":21,"from":17779,"dur":100,"src":"broll/fbaislar/av_w021.mp4"},{"k":22,"from":18076,"dur":104,"src":"broll/fbaislar/av_w022.mp4"},{"k":23,"from":18765,"dur":235,"src":"broll/fbaislar/av_w023.mp4"},{"k":24,"from":19186,"dur":291,"src":"broll/fbaislar/av_w024.mp4"},{"k":25,"from":19774,"dur":243,"src":"broll/fbaislar/av_w025.mp4"},{"k":26,"from":21042,"dur":293,"src":"broll/fbaislar/av_w026.mp4"},{"k":27,"from":21949,"dur":201,"src":"broll/fbaislar/av_w027.mp4"},{"k":28,"from":22201,"dur":226,"src":"broll/fbaislar/av_w028.mp4"},{"k":29,"from":22814,"dur":344,"src":"broll/fbaislar/av_w029.mp4"},{"k":30,"from":23798,"dur":93,"src":"broll/fbaislar/av_w030.mp4"},{"k":31,"from":24306,"dur":72,"src":"broll/fbaislar/av_w031.mp4"},{"k":32,"from":25019,"dur":277,"src":"broll/fbaislar/av_w032.mp4"},{"k":33,"from":26030,"dur":261,"src":"broll/fbaislar/av_w033.mp4"},{"k":34,"from":26644,"dur":71,"src":"broll/fbaislar/av_w034.mp4"},{"k":35,"from":27141,"dur":98,"src":"broll/fbaislar/av_w035.mp4"},{"k":36,"from":27639,"dur":228,"src":"broll/fbaislar/av_w036.mp4"},{"k":37,"from":28223,"dur":270,"src":"broll/fbaislar/av_w037.mp4"},{"k":38,"from":28990,"dur":170,"src":"broll/fbaislar/av_w038.mp4"},{"k":39,"from":29366,"dur":48,"src":"broll/fbaislar/av_w039.mp4"}];

export const MainFbaislar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/fbaislar/fbaislar_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_FBAISLAR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FBAISLAR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fbaislar.m4a")} />
    </AbsoluteFill>
  );
};
