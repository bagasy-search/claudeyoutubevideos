// Main_cmeestbar.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEESTBAR } from "./cues_cmeestbar.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEESTBAR = 34120;

const VENTANAS = [{"k":0,"from":0,"dur":271,"src":"broll/cmeestbar/av_w000.mp4"},{"k":1,"from":787,"dur":83,"src":"broll/cmeestbar/av_w001.mp4"},{"k":2,"from":1275,"dur":173,"src":"broll/cmeestbar/av_w002.mp4"},{"k":3,"from":1710,"dur":143,"src":"broll/cmeestbar/av_w003.mp4"},{"k":4,"from":2258,"dur":60,"src":"broll/cmeestbar/av_w004.mp4"},{"k":5,"from":2362,"dur":124,"src":"broll/cmeestbar/av_w005.mp4"},{"k":6,"from":3094,"dur":99,"src":"broll/cmeestbar/av_w006.mp4"},{"k":7,"from":4211,"dur":140,"src":"broll/cmeestbar/av_w007.mp4"},{"k":8,"from":4489,"dur":133,"src":"broll/cmeestbar/av_w008.mp4"},{"k":9,"from":5540,"dur":125,"src":"broll/cmeestbar/av_w009.mp4"},{"k":10,"from":6353,"dur":188,"src":"broll/cmeestbar/av_w010.mp4"},{"k":11,"from":7472,"dur":54,"src":"broll/cmeestbar/av_w011.mp4"},{"k":12,"from":7895,"dur":243,"src":"broll/cmeestbar/av_w012.mp4"},{"k":13,"from":9161,"dur":93,"src":"broll/cmeestbar/av_w013.mp4"},{"k":14,"from":9552,"dur":89,"src":"broll/cmeestbar/av_w014.mp4"},{"k":15,"from":10099,"dur":162,"src":"broll/cmeestbar/av_w015.mp4"},{"k":16,"from":11816,"dur":157,"src":"broll/cmeestbar/av_w016.mp4"},{"k":17,"from":12916,"dur":124,"src":"broll/cmeestbar/av_w017.mp4"},{"k":18,"from":14169,"dur":92,"src":"broll/cmeestbar/av_w018.mp4"},{"k":19,"from":15049,"dur":290,"src":"broll/cmeestbar/av_w019.mp4"},{"k":20,"from":15634,"dur":177,"src":"broll/cmeestbar/av_w020.mp4"},{"k":21,"from":16147,"dur":202,"src":"broll/cmeestbar/av_w021.mp4"},{"k":22,"from":17567,"dur":277,"src":"broll/cmeestbar/av_w022.mp4"},{"k":23,"from":18495,"dur":122,"src":"broll/cmeestbar/av_w023.mp4"},{"k":24,"from":18936,"dur":219,"src":"broll/cmeestbar/av_w024.mp4"},{"k":25,"from":19369,"dur":107,"src":"broll/cmeestbar/av_w025.mp4"},{"k":26,"from":20228,"dur":109,"src":"broll/cmeestbar/av_w026.mp4"},{"k":27,"from":20559,"dur":118,"src":"broll/cmeestbar/av_w027.mp4"},{"k":28,"from":21190,"dur":128,"src":"broll/cmeestbar/av_w028.mp4"},{"k":29,"from":21968,"dur":304,"src":"broll/cmeestbar/av_w029.mp4"},{"k":30,"from":22690,"dur":151,"src":"broll/cmeestbar/av_w030.mp4"},{"k":31,"from":23925,"dur":127,"src":"broll/cmeestbar/av_w031.mp4"},{"k":32,"from":24560,"dur":146,"src":"broll/cmeestbar/av_w032.mp4"},{"k":33,"from":25190,"dur":266,"src":"broll/cmeestbar/av_w033.mp4"},{"k":34,"from":25810,"dur":166,"src":"broll/cmeestbar/av_w034.mp4"},{"k":35,"from":26234,"dur":71,"src":"broll/cmeestbar/av_w035.mp4"},{"k":36,"from":26481,"dur":121,"src":"broll/cmeestbar/av_w036.mp4"},{"k":37,"from":27909,"dur":95,"src":"broll/cmeestbar/av_w037.mp4"},{"k":38,"from":28403,"dur":236,"src":"broll/cmeestbar/av_w038.mp4"},{"k":39,"from":28733,"dur":237,"src":"broll/cmeestbar/av_w039.mp4"},{"k":40,"from":29521,"dur":87,"src":"broll/cmeestbar/av_w040.mp4"},{"k":41,"from":30430,"dur":112,"src":"broll/cmeestbar/av_w041.mp4"},{"k":42,"from":30891,"dur":229,"src":"broll/cmeestbar/av_w042.mp4"},{"k":43,"from":31546,"dur":165,"src":"broll/cmeestbar/av_w043.mp4"},{"k":44,"from":32149,"dur":190,"src":"broll/cmeestbar/av_w044.mp4"},{"k":45,"from":32833,"dur":207,"src":"broll/cmeestbar/av_w045.mp4"},{"k":46,"from":33247,"dur":135,"src":"broll/cmeestbar/av_w046.mp4"},{"k":47,"from":33743,"dur":120,"src":"broll/cmeestbar/av_w047.mp4"},{"k":48,"from":34057,"dur":62,"src":"broll/cmeestbar/av_w048.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeestbar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeestbar/cmeestbar_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEESTBAR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEESTBAR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeestbar.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
