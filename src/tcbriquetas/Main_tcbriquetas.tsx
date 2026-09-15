// Main_tcbriquetas.tsx — GENERADO por build_tcbriquetas.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TCBRIQUETAS } from "./cues_tcbriquetas.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_TCBRIQUETAS = 37612;

const VENTANAS = [{"k":0,"from":0,"dur":251,"src":"broll/tcbriquetas/av_w000.mp4"},{"k":1,"from":1419,"dur":140,"src":"broll/tcbriquetas/av_w001.mp4"},{"k":2,"from":1680,"dur":125,"src":"broll/tcbriquetas/av_w002.mp4"},{"k":3,"from":2305,"dur":220,"src":"broll/tcbriquetas/av_w003.mp4"},{"k":4,"from":2858,"dur":175,"src":"broll/tcbriquetas/av_w004.mp4"},{"k":5,"from":3364,"dur":251,"src":"broll/tcbriquetas/av_w005.mp4"},{"k":6,"from":5110,"dur":191,"src":"broll/tcbriquetas/av_w006.mp4"},{"k":7,"from":5810,"dur":127,"src":"broll/tcbriquetas/av_w007.mp4"},{"k":8,"from":6591,"dur":135,"src":"broll/tcbriquetas/av_w008.mp4"},{"k":9,"from":7742,"dur":156,"src":"broll/tcbriquetas/av_w009.mp4"},{"k":10,"from":8327,"dur":49,"src":"broll/tcbriquetas/av_w010.mp4"},{"k":11,"from":11245,"dur":90,"src":"broll/tcbriquetas/av_w011.mp4"},{"k":12,"from":11950,"dur":110,"src":"broll/tcbriquetas/av_w012.mp4"},{"k":13,"from":15269,"dur":179,"src":"broll/tcbriquetas/av_w013.mp4"},{"k":14,"from":16000,"dur":91,"src":"broll/tcbriquetas/av_w014.mp4"},{"k":15,"from":16912,"dur":136,"src":"broll/tcbriquetas/av_w015.mp4"},{"k":16,"from":18113,"dur":217,"src":"broll/tcbriquetas/av_w016.mp4"},{"k":17,"from":19026,"dur":105,"src":"broll/tcbriquetas/av_w017.mp4"},{"k":18,"from":21483,"dur":76,"src":"broll/tcbriquetas/av_w018.mp4"},{"k":19,"from":23203,"dur":62,"src":"broll/tcbriquetas/av_w019.mp4"},{"k":20,"from":23720,"dur":115,"src":"broll/tcbriquetas/av_w020.mp4"},{"k":21,"from":24399,"dur":107,"src":"broll/tcbriquetas/av_w021.mp4"},{"k":22,"from":25600,"dur":103,"src":"broll/tcbriquetas/av_w022.mp4"},{"k":23,"from":26552,"dur":96,"src":"broll/tcbriquetas/av_w023.mp4"},{"k":24,"from":27252,"dur":137,"src":"broll/tcbriquetas/av_w024.mp4"},{"k":25,"from":28269,"dur":156,"src":"broll/tcbriquetas/av_w025.mp4"},{"k":26,"from":28790,"dur":160,"src":"broll/tcbriquetas/av_w026.mp4"},{"k":27,"from":29768,"dur":181,"src":"broll/tcbriquetas/av_w027.mp4"},{"k":28,"from":30334,"dur":157,"src":"broll/tcbriquetas/av_w028.mp4"},{"k":29,"from":31509,"dur":147,"src":"broll/tcbriquetas/av_w029.mp4"},{"k":30,"from":33332,"dur":170,"src":"broll/tcbriquetas/av_w030.mp4"},{"k":31,"from":33931,"dur":58,"src":"broll/tcbriquetas/av_w031.mp4"},{"k":32,"from":34379,"dur":129,"src":"broll/tcbriquetas/av_w032.mp4"},{"k":33,"from":34678,"dur":98,"src":"broll/tcbriquetas/av_w033.mp4"},{"k":34,"from":36673,"dur":104,"src":"broll/tcbriquetas/av_w034.mp4"},{"k":35,"from":37122,"dur":489,"src":"broll/tcbriquetas/av_w035.mp4"}];

export const MainTcbriquetas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/tcbriquetas/tcbriquetas_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_TCBRIQUETAS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TCBRIQUETAS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tcbriquetas.m4a")} />
    </AbsoluteFill>
  );
};
