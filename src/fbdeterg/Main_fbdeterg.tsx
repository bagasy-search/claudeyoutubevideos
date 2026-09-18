// Main_fbdeterg.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FBDETERG } from "./cues_fbdeterg.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_FBDETERG = 36966;

const VENTANAS = [{"k":0,"from":0,"dur":122,"src":"broll/fbdeterg/av_w000.mp4"},{"k":1,"from":347,"dur":112,"src":"broll/fbdeterg/av_w001.mp4"},{"k":2,"from":954,"dur":107,"src":"broll/fbdeterg/av_w002.mp4"},{"k":3,"from":1076,"dur":71,"src":"broll/fbdeterg/av_w003.mp4"},{"k":4,"from":1243,"dur":96,"src":"broll/fbdeterg/av_w004.mp4"},{"k":5,"from":1481,"dur":71,"src":"broll/fbdeterg/av_w005.mp4"},{"k":6,"from":1717,"dur":102,"src":"broll/fbdeterg/av_w006.mp4"},{"k":7,"from":2093,"dur":252,"src":"broll/fbdeterg/av_w007.mp4"},{"k":8,"from":3362,"dur":158,"src":"broll/fbdeterg/av_w008.mp4"},{"k":9,"from":3907,"dur":174,"src":"broll/fbdeterg/av_w009.mp4"},{"k":10,"from":4274,"dur":131,"src":"broll/fbdeterg/av_w010.mp4"},{"k":11,"from":6370,"dur":121,"src":"broll/fbdeterg/av_w011.mp4"},{"k":12,"from":7152,"dur":301,"src":"broll/fbdeterg/av_w012.mp4"},{"k":13,"from":8831,"dur":196,"src":"broll/fbdeterg/av_w013.mp4"},{"k":14,"from":9139,"dur":159,"src":"broll/fbdeterg/av_w014.mp4"},{"k":15,"from":10213,"dur":150,"src":"broll/fbdeterg/av_w015.mp4"},{"k":16,"from":10687,"dur":132,"src":"broll/fbdeterg/av_w016.mp4"},{"k":17,"from":11539,"dur":129,"src":"broll/fbdeterg/av_w017.mp4"},{"k":18,"from":12106,"dur":178,"src":"broll/fbdeterg/av_w018.mp4"},{"k":19,"from":12979,"dur":176,"src":"broll/fbdeterg/av_w019.mp4"},{"k":20,"from":13437,"dur":196,"src":"broll/fbdeterg/av_w020.mp4"},{"k":21,"from":13757,"dur":82,"src":"broll/fbdeterg/av_w021.mp4"},{"k":22,"from":13985,"dur":135,"src":"broll/fbdeterg/av_w022.mp4"},{"k":23,"from":14285,"dur":261,"src":"broll/fbdeterg/av_w023.mp4"},{"k":24,"from":14934,"dur":124,"src":"broll/fbdeterg/av_w024.mp4"},{"k":25,"from":15766,"dur":183,"src":"broll/fbdeterg/av_w025.mp4"},{"k":26,"from":16452,"dur":170,"src":"broll/fbdeterg/av_w026.mp4"},{"k":27,"from":17161,"dur":215,"src":"broll/fbdeterg/av_w027.mp4"},{"k":28,"from":17773,"dur":177,"src":"broll/fbdeterg/av_w028.mp4"},{"k":29,"from":18008,"dur":159,"src":"broll/fbdeterg/av_w029.mp4"},{"k":30,"from":18571,"dur":187,"src":"broll/fbdeterg/av_w030.mp4"},{"k":31,"from":19451,"dur":174,"src":"broll/fbdeterg/av_w031.mp4"},{"k":32,"from":19907,"dur":123,"src":"broll/fbdeterg/av_w032.mp4"},{"k":33,"from":20160,"dur":116,"src":"broll/fbdeterg/av_w033.mp4"},{"k":34,"from":20470,"dur":66,"src":"broll/fbdeterg/av_w034.mp4"},{"k":35,"from":21632,"dur":162,"src":"broll/fbdeterg/av_w035.mp4"},{"k":36,"from":22187,"dur":108,"src":"broll/fbdeterg/av_w036.mp4"},{"k":37,"from":22801,"dur":99,"src":"broll/fbdeterg/av_w037.mp4"},{"k":38,"from":23040,"dur":143,"src":"broll/fbdeterg/av_w038.mp4"},{"k":39,"from":23561,"dur":128,"src":"broll/fbdeterg/av_w039.mp4"},{"k":40,"from":24133,"dur":137,"src":"broll/fbdeterg/av_w040.mp4"},{"k":41,"from":24581,"dur":104,"src":"broll/fbdeterg/av_w041.mp4"},{"k":42,"from":25250,"dur":164,"src":"broll/fbdeterg/av_w042.mp4"},{"k":43,"from":25867,"dur":165,"src":"broll/fbdeterg/av_w043.mp4"},{"k":44,"from":26735,"dur":148,"src":"broll/fbdeterg/av_w044.mp4"},{"k":45,"from":27107,"dur":153,"src":"broll/fbdeterg/av_w045.mp4"},{"k":46,"from":27514,"dur":163,"src":"broll/fbdeterg/av_w046.mp4"},{"k":47,"from":28375,"dur":339,"src":"broll/fbdeterg/av_w047.mp4"},{"k":48,"from":29540,"dur":131,"src":"broll/fbdeterg/av_w048.mp4"},{"k":49,"from":30154,"dur":165,"src":"broll/fbdeterg/av_w049.mp4"},{"k":50,"from":30578,"dur":116,"src":"broll/fbdeterg/av_w050.mp4"},{"k":51,"from":31967,"dur":231,"src":"broll/fbdeterg/av_w051.mp4"},{"k":52,"from":32598,"dur":151,"src":"broll/fbdeterg/av_w052.mp4"},{"k":53,"from":33419,"dur":104,"src":"broll/fbdeterg/av_w053.mp4"},{"k":54,"from":34352,"dur":160,"src":"broll/fbdeterg/av_w054.mp4"},{"k":55,"from":35015,"dur":153,"src":"broll/fbdeterg/av_w055.mp4"},{"k":56,"from":35261,"dur":109,"src":"broll/fbdeterg/av_w056.mp4"},{"k":57,"from":35462,"dur":127,"src":"broll/fbdeterg/av_w057.mp4"},{"k":58,"from":36592,"dur":121,"src":"broll/fbdeterg/av_w058.mp4"},{"k":59,"from":36802,"dur":163,"src":"broll/fbdeterg/av_w059.mp4"}];

export const MainFbdeterg: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/fbdeterg/fbdeterg_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_FBDETERG.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FBDETERG.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fbdeterg.m4a")} />
    </AbsoluteFill>
  );
};
