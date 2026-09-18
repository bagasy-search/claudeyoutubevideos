// Main_fbmarmol.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FBMARMOL } from "./cues_fbmarmol.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_FBMARMOL = 41874;

const VENTANAS = [{"k":0,"from":0,"dur":97,"src":"broll/fbmarmol/av_w000.mp4"},{"k":1,"from":805,"dur":184,"src":"broll/fbmarmol/av_w001.mp4"},{"k":2,"from":1084,"dur":94,"src":"broll/fbmarmol/av_w002.mp4"},{"k":3,"from":1259,"dur":63,"src":"broll/fbmarmol/av_w003.mp4"},{"k":4,"from":1826,"dur":134,"src":"broll/fbmarmol/av_w004.mp4"},{"k":5,"from":2120,"dur":315,"src":"broll/fbmarmol/av_w005.mp4"},{"k":6,"from":3324,"dur":376,"src":"broll/fbmarmol/av_w006.mp4"},{"k":7,"from":3805,"dur":145,"src":"broll/fbmarmol/av_w007.mp4"},{"k":8,"from":4730,"dur":132,"src":"broll/fbmarmol/av_w008.mp4"},{"k":9,"from":5009,"dur":132,"src":"broll/fbmarmol/av_w009.mp4"},{"k":10,"from":5554,"dur":151,"src":"broll/fbmarmol/av_w010.mp4"},{"k":11,"from":6846,"dur":478,"src":"broll/fbmarmol/av_w011.mp4"},{"k":12,"from":8611,"dur":91,"src":"broll/fbmarmol/av_w012.mp4"},{"k":13,"from":9058,"dur":130,"src":"broll/fbmarmol/av_w013.mp4"},{"k":14,"from":11392,"dur":458,"src":"broll/fbmarmol/av_w014.mp4"},{"k":15,"from":12018,"dur":182,"src":"broll/fbmarmol/av_w015.mp4"},{"k":16,"from":12788,"dur":98,"src":"broll/fbmarmol/av_w016.mp4"},{"k":17,"from":14359,"dur":85,"src":"broll/fbmarmol/av_w017.mp4"},{"k":18,"from":14800,"dur":144,"src":"broll/fbmarmol/av_w018.mp4"},{"k":19,"from":15071,"dur":131,"src":"broll/fbmarmol/av_w019.mp4"},{"k":20,"from":15617,"dur":147,"src":"broll/fbmarmol/av_w020.mp4"},{"k":21,"from":16060,"dur":134,"src":"broll/fbmarmol/av_w021.mp4"},{"k":22,"from":16874,"dur":272,"src":"broll/fbmarmol/av_w022.mp4"},{"k":23,"from":17894,"dur":281,"src":"broll/fbmarmol/av_w023.mp4"},{"k":24,"from":18901,"dur":108,"src":"broll/fbmarmol/av_w024.mp4"},{"k":25,"from":19474,"dur":156,"src":"broll/fbmarmol/av_w025.mp4"},{"k":26,"from":20425,"dur":157,"src":"broll/fbmarmol/av_w026.mp4"},{"k":27,"from":21112,"dur":108,"src":"broll/fbmarmol/av_w027.mp4"},{"k":28,"from":21903,"dur":108,"src":"broll/fbmarmol/av_w028.mp4"},{"k":29,"from":22148,"dur":227,"src":"broll/fbmarmol/av_w029.mp4"},{"k":30,"from":22540,"dur":301,"src":"broll/fbmarmol/av_w030.mp4"},{"k":31,"from":23573,"dur":107,"src":"broll/fbmarmol/av_w031.mp4"},{"k":32,"from":24101,"dur":213,"src":"broll/fbmarmol/av_w032.mp4"},{"k":33,"from":24908,"dur":77,"src":"broll/fbmarmol/av_w033.mp4"},{"k":34,"from":25193,"dur":133,"src":"broll/fbmarmol/av_w034.mp4"},{"k":35,"from":26104,"dur":198,"src":"broll/fbmarmol/av_w035.mp4"},{"k":36,"from":28120,"dur":150,"src":"broll/fbmarmol/av_w036.mp4"},{"k":37,"from":28438,"dur":136,"src":"broll/fbmarmol/av_w037.mp4"},{"k":38,"from":28934,"dur":93,"src":"broll/fbmarmol/av_w038.mp4"},{"k":39,"from":29290,"dur":186,"src":"broll/fbmarmol/av_w039.mp4"},{"k":40,"from":29633,"dur":167,"src":"broll/fbmarmol/av_w040.mp4"},{"k":41,"from":31198,"dur":86,"src":"broll/fbmarmol/av_w041.mp4"},{"k":42,"from":31610,"dur":431,"src":"broll/fbmarmol/av_w042.mp4"},{"k":43,"from":32699,"dur":65,"src":"broll/fbmarmol/av_w043.mp4"},{"k":44,"from":33557,"dur":64,"src":"broll/fbmarmol/av_w044.mp4"},{"k":45,"from":34193,"dur":186,"src":"broll/fbmarmol/av_w045.mp4"},{"k":46,"from":34952,"dur":201,"src":"broll/fbmarmol/av_w046.mp4"},{"k":47,"from":35309,"dur":120,"src":"broll/fbmarmol/av_w047.mp4"},{"k":48,"from":36180,"dur":185,"src":"broll/fbmarmol/av_w048.mp4"},{"k":49,"from":36658,"dur":155,"src":"broll/fbmarmol/av_w049.mp4"},{"k":50,"from":37106,"dur":114,"src":"broll/fbmarmol/av_w050.mp4"},{"k":51,"from":37807,"dur":174,"src":"broll/fbmarmol/av_w051.mp4"},{"k":52,"from":38425,"dur":139,"src":"broll/fbmarmol/av_w052.mp4"},{"k":53,"from":39033,"dur":90,"src":"broll/fbmarmol/av_w053.mp4"},{"k":54,"from":39329,"dur":72,"src":"broll/fbmarmol/av_w054.mp4"},{"k":55,"from":39914,"dur":173,"src":"broll/fbmarmol/av_w055.mp4"},{"k":56,"from":40642,"dur":162,"src":"broll/fbmarmol/av_w056.mp4"},{"k":57,"from":41444,"dur":147,"src":"broll/fbmarmol/av_w057.mp4"},{"k":58,"from":41822,"dur":52,"src":"broll/fbmarmol/av_w058.mp4"}];

export const MainFbmarmol: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/fbmarmol/fbmarmol_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_FBMARMOL.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FBMARMOL.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fbmarmol.m4a")} />
    </AbsoluteFill>
  );
};
