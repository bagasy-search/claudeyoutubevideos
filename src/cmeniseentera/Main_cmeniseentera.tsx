// Main_cmeniseentera.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMENISEENTERA } from "./cues_cmeniseentera.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMENISEENTERA = 31582;

const VENTANAS = [{"k":0,"from":30,"dur":139,"src":"broll/cmeniseentera/av_w000.mp4"},{"k":1,"from":980,"dur":63,"src":"broll/cmeniseentera/av_w001.mp4"},{"k":2,"from":1399,"dur":108,"src":"broll/cmeniseentera/av_w002.mp4"},{"k":3,"from":1703,"dur":240,"src":"broll/cmeniseentera/av_w003.mp4"},{"k":4,"from":2116,"dur":322,"src":"broll/cmeniseentera/av_w004.mp4"},{"k":5,"from":4010,"dur":242,"src":"broll/cmeniseentera/av_w005.mp4"},{"k":6,"from":4323,"dur":191,"src":"broll/cmeniseentera/av_w006.mp4"},{"k":7,"from":5887,"dur":379,"src":"broll/cmeniseentera/av_w007.mp4"},{"k":8,"from":6600,"dur":185,"src":"broll/cmeniseentera/av_w008.mp4"},{"k":9,"from":7379,"dur":110,"src":"broll/cmeniseentera/av_w009.mp4"},{"k":10,"from":7849,"dur":484,"src":"broll/cmeniseentera/av_w010.mp4"},{"k":11,"from":8689,"dur":327,"src":"broll/cmeniseentera/av_w011.mp4"},{"k":12,"from":9587,"dur":161,"src":"broll/cmeniseentera/av_w012.mp4"},{"k":13,"from":9822,"dur":70,"src":"broll/cmeniseentera/av_w013.mp4"},{"k":14,"from":10140,"dur":112,"src":"broll/cmeniseentera/av_w014.mp4"},{"k":15,"from":10467,"dur":158,"src":"broll/cmeniseentera/av_w015.mp4"},{"k":16,"from":10684,"dur":251,"src":"broll/cmeniseentera/av_w016.mp4"},{"k":17,"from":11086,"dur":85,"src":"broll/cmeniseentera/av_w017.mp4"},{"k":18,"from":11500,"dur":135,"src":"broll/cmeniseentera/av_w018.mp4"},{"k":19,"from":11739,"dur":204,"src":"broll/cmeniseentera/av_w019.mp4"},{"k":20,"from":12072,"dur":200,"src":"broll/cmeniseentera/av_w020.mp4"},{"k":21,"from":12526,"dur":111,"src":"broll/cmeniseentera/av_w021.mp4"},{"k":22,"from":12762,"dur":247,"src":"broll/cmeniseentera/av_w022.mp4"},{"k":23,"from":13231,"dur":220,"src":"broll/cmeniseentera/av_w023.mp4"},{"k":24,"from":13721,"dur":182,"src":"broll/cmeniseentera/av_w024.mp4"},{"k":25,"from":13973,"dur":306,"src":"broll/cmeniseentera/av_w025.mp4"},{"k":26,"from":14481,"dur":248,"src":"broll/cmeniseentera/av_w026.mp4"},{"k":27,"from":15759,"dur":237,"src":"broll/cmeniseentera/av_w027.mp4"},{"k":28,"from":17865,"dur":384,"src":"broll/cmeniseentera/av_w028.mp4"},{"k":29,"from":18801,"dur":182,"src":"broll/cmeniseentera/av_w029.mp4"},{"k":30,"from":19097,"dur":184,"src":"broll/cmeniseentera/av_w030.mp4"},{"k":31,"from":21556,"dur":284,"src":"broll/cmeniseentera/av_w031.mp4"},{"k":32,"from":21975,"dur":213,"src":"broll/cmeniseentera/av_w032.mp4"},{"k":33,"from":22824,"dur":69,"src":"broll/cmeniseentera/av_w033.mp4"},{"k":34,"from":23328,"dur":138,"src":"broll/cmeniseentera/av_w034.mp4"},{"k":35,"from":23708,"dur":138,"src":"broll/cmeniseentera/av_w035.mp4"},{"k":36,"from":24093,"dur":107,"src":"broll/cmeniseentera/av_w036.mp4"},{"k":37,"from":25473,"dur":295,"src":"broll/cmeniseentera/av_w037.mp4"},{"k":38,"from":26213,"dur":141,"src":"broll/cmeniseentera/av_w038.mp4"},{"k":39,"from":26724,"dur":210,"src":"broll/cmeniseentera/av_w039.mp4"},{"k":40,"from":27119,"dur":211,"src":"broll/cmeniseentera/av_w040.mp4"},{"k":41,"from":27576,"dur":198,"src":"broll/cmeniseentera/av_w041.mp4"},{"k":42,"from":27908,"dur":196,"src":"broll/cmeniseentera/av_w042.mp4"},{"k":43,"from":28298,"dur":287,"src":"broll/cmeniseentera/av_w043.mp4"},{"k":44,"from":29459,"dur":298,"src":"broll/cmeniseentera/av_w044.mp4"},{"k":45,"from":30570,"dur":236,"src":"broll/cmeniseentera/av_w045.mp4"},{"k":46,"from":31141,"dur":248,"src":"broll/cmeniseentera/av_w046.mp4"},{"k":47,"from":31445,"dur":136,"src":"broll/cmeniseentera/av_w047.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeniseentera: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeniseentera/cmeniseentera_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMENISEENTERA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMENISEENTERA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("cmeniseentera_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
