// Main_cmv5ventilador.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMV5VENTILADOR } from "./cues_cmv5ventilador.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMV5VENTILADOR = 30236;

const VENTANAS = [{"k":0,"from":18,"dur":119,"src":"broll/cmv5ventilador/av_w000.mp4"},{"k":1,"from":650,"dur":147,"src":"broll/cmv5ventilador/av_w001.mp4"},{"k":2,"from":1012,"dur":73,"src":"broll/cmv5ventilador/av_w002.mp4"},{"k":3,"from":1436,"dur":120,"src":"broll/cmv5ventilador/av_w003.mp4"},{"k":4,"from":1891,"dur":273,"src":"broll/cmv5ventilador/av_w004.mp4"},{"k":5,"from":2594,"dur":120,"src":"broll/cmv5ventilador/av_w005.mp4"},{"k":6,"from":2801,"dur":308,"src":"broll/cmv5ventilador/av_w006.mp4"},{"k":7,"from":3220,"dur":211,"src":"broll/cmv5ventilador/av_w007.mp4"},{"k":8,"from":4245,"dur":125,"src":"broll/cmv5ventilador/av_w008.mp4"},{"k":9,"from":4651,"dur":193,"src":"broll/cmv5ventilador/av_w009.mp4"},{"k":10,"from":5104,"dur":90,"src":"broll/cmv5ventilador/av_w010.mp4"},{"k":11,"from":5380,"dur":90,"src":"broll/cmv5ventilador/av_w011.mp4"},{"k":12,"from":6355,"dur":244,"src":"broll/cmv5ventilador/av_w012.mp4"},{"k":13,"from":6728,"dur":66,"src":"broll/cmv5ventilador/av_w013.mp4"},{"k":14,"from":6962,"dur":117,"src":"broll/cmv5ventilador/av_w014.mp4"},{"k":15,"from":7525,"dur":105,"src":"broll/cmv5ventilador/av_w015.mp4"},{"k":16,"from":8069,"dur":78,"src":"broll/cmv5ventilador/av_w016.mp4"},{"k":17,"from":8934,"dur":91,"src":"broll/cmv5ventilador/av_w017.mp4"},{"k":18,"from":9222,"dur":120,"src":"broll/cmv5ventilador/av_w018.mp4"},{"k":19,"from":9756,"dur":103,"src":"broll/cmv5ventilador/av_w019.mp4"},{"k":20,"from":10306,"dur":189,"src":"broll/cmv5ventilador/av_w020.mp4"},{"k":21,"from":10662,"dur":223,"src":"broll/cmv5ventilador/av_w021.mp4"},{"k":22,"from":11313,"dur":187,"src":"broll/cmv5ventilador/av_w022.mp4"},{"k":23,"from":11574,"dur":77,"src":"broll/cmv5ventilador/av_w023.mp4"},{"k":24,"from":12328,"dur":137,"src":"broll/cmv5ventilador/av_w024.mp4"},{"k":25,"from":12923,"dur":384,"src":"broll/cmv5ventilador/av_w025.mp4"},{"k":26,"from":13547,"dur":193,"src":"broll/cmv5ventilador/av_w026.mp4"},{"k":27,"from":14323,"dur":210,"src":"broll/cmv5ventilador/av_w027.mp4"},{"k":28,"from":15572,"dur":99,"src":"broll/cmv5ventilador/av_w028.mp4"},{"k":29,"from":15985,"dur":256,"src":"broll/cmv5ventilador/av_w029.mp4"},{"k":30,"from":16430,"dur":165,"src":"broll/cmv5ventilador/av_w030.mp4"},{"k":31,"from":16684,"dur":108,"src":"broll/cmv5ventilador/av_w031.mp4"},{"k":32,"from":16937,"dur":228,"src":"broll/cmv5ventilador/av_w032.mp4"},{"k":33,"from":17945,"dur":125,"src":"broll/cmv5ventilador/av_w033.mp4"},{"k":34,"from":18619,"dur":205,"src":"broll/cmv5ventilador/av_w034.mp4"},{"k":35,"from":19261,"dur":215,"src":"broll/cmv5ventilador/av_w035.mp4"},{"k":36,"from":19993,"dur":148,"src":"broll/cmv5ventilador/av_w036.mp4"},{"k":37,"from":20728,"dur":284,"src":"broll/cmv5ventilador/av_w037.mp4"},{"k":38,"from":21117,"dur":102,"src":"broll/cmv5ventilador/av_w038.mp4"},{"k":39,"from":21991,"dur":412,"src":"broll/cmv5ventilador/av_w039.mp4"},{"k":40,"from":22936,"dur":143,"src":"broll/cmv5ventilador/av_w040.mp4"},{"k":41,"from":23290,"dur":147,"src":"broll/cmv5ventilador/av_w041.mp4"},{"k":42,"from":23749,"dur":111,"src":"broll/cmv5ventilador/av_w042.mp4"},{"k":43,"from":24355,"dur":100,"src":"broll/cmv5ventilador/av_w043.mp4"},{"k":44,"from":24684,"dur":284,"src":"broll/cmv5ventilador/av_w044.mp4"},{"k":45,"from":25376,"dur":137,"src":"broll/cmv5ventilador/av_w045.mp4"},{"k":46,"from":26206,"dur":81,"src":"broll/cmv5ventilador/av_w046.mp4"},{"k":47,"from":26782,"dur":310,"src":"broll/cmv5ventilador/av_w047.mp4"},{"k":48,"from":27316,"dur":582,"src":"broll/cmv5ventilador/av_w048.mp4"},{"k":49,"from":28352,"dur":230,"src":"broll/cmv5ventilador/av_w049.mp4"},{"k":50,"from":28888,"dur":127,"src":"broll/cmv5ventilador/av_w050.mp4"},{"k":51,"from":29161,"dur":244,"src":"broll/cmv5ventilador/av_w051.mp4"},{"k":52,"from":29428,"dur":328,"src":"broll/cmv5ventilador/av_w052.mp4"},{"k":53,"from":30037,"dur":199,"src":"broll/cmv5ventilador/av_w053.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmv5ventilador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmv5ventilador/cmv5ventilador_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMV5VENTILADOR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMV5VENTILADOR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={18} layout="none"><Audio src={staticFile("cmv5ventilador.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
