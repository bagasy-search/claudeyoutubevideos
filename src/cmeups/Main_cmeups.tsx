// Main_cmeups.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEUPS } from "./cues_cmeups.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMEUPS = 46373;

const VENTANAS = [{"k":0,"from":0,"dur":111,"src":"broll/cmeups/av_w000.mp4"},{"k":1,"from":429,"dur":212,"src":"broll/cmeups/av_w001.mp4"},{"k":2,"from":1156,"dur":120,"src":"broll/cmeups/av_w002.mp4"},{"k":3,"from":1500,"dur":104,"src":"broll/cmeups/av_w003.mp4"},{"k":4,"from":1730,"dur":230,"src":"broll/cmeups/av_w004.mp4"},{"k":5,"from":2371,"dur":222,"src":"broll/cmeups/av_w005.mp4"},{"k":6,"from":2909,"dur":536,"src":"broll/cmeups/av_w006.mp4"},{"k":7,"from":3503,"dur":99,"src":"broll/cmeups/av_w007.mp4"},{"k":8,"from":3947,"dur":175,"src":"broll/cmeups/av_w008.mp4"},{"k":9,"from":4203,"dur":128,"src":"broll/cmeups/av_w009.mp4"},{"k":10,"from":4829,"dur":278,"src":"broll/cmeups/av_w010.mp4"},{"k":11,"from":5549,"dur":203,"src":"broll/cmeups/av_w011.mp4"},{"k":12,"from":6365,"dur":178,"src":"broll/cmeups/av_w012.mp4"},{"k":13,"from":7096,"dur":126,"src":"broll/cmeups/av_w013.mp4"},{"k":14,"from":7499,"dur":113,"src":"broll/cmeups/av_w014.mp4"},{"k":15,"from":7875,"dur":58,"src":"broll/cmeups/av_w015.mp4"},{"k":16,"from":8060,"dur":366,"src":"broll/cmeups/av_w016.mp4"},{"k":17,"from":8583,"dur":120,"src":"broll/cmeups/av_w017.mp4"},{"k":18,"from":9093,"dur":283,"src":"broll/cmeups/av_w018.mp4"},{"k":19,"from":9778,"dur":83,"src":"broll/cmeups/av_w019.mp4"},{"k":20,"from":9925,"dur":234,"src":"broll/cmeups/av_w020.mp4"},{"k":21,"from":10298,"dur":86,"src":"broll/cmeups/av_w021.mp4"},{"k":22,"from":10693,"dur":336,"src":"broll/cmeups/av_w022.mp4"},{"k":23,"from":11209,"dur":403,"src":"broll/cmeups/av_w023.mp4"},{"k":24,"from":12074,"dur":275,"src":"broll/cmeups/av_w024.mp4"},{"k":25,"from":12452,"dur":209,"src":"broll/cmeups/av_w025.mp4"},{"k":26,"from":12897,"dur":137,"src":"broll/cmeups/av_w026.mp4"},{"k":27,"from":13471,"dur":90,"src":"broll/cmeups/av_w027.mp4"},{"k":28,"from":13616,"dur":188,"src":"broll/cmeups/av_w028.mp4"},{"k":29,"from":14024,"dur":137,"src":"broll/cmeups/av_w029.mp4"},{"k":30,"from":14888,"dur":286,"src":"broll/cmeups/av_w030.mp4"},{"k":31,"from":15646,"dur":171,"src":"broll/cmeups/av_w031.mp4"},{"k":32,"from":16266,"dur":333,"src":"broll/cmeups/av_w032.mp4"},{"k":33,"from":17051,"dur":260,"src":"broll/cmeups/av_w033.mp4"},{"k":34,"from":18175,"dur":131,"src":"broll/cmeups/av_w034.mp4"},{"k":35,"from":18676,"dur":181,"src":"broll/cmeups/av_w035.mp4"},{"k":36,"from":19102,"dur":127,"src":"broll/cmeups/av_w036.mp4"},{"k":37,"from":20148,"dur":214,"src":"broll/cmeups/av_w037.mp4"},{"k":38,"from":20819,"dur":131,"src":"broll/cmeups/av_w038.mp4"},{"k":39,"from":21661,"dur":427,"src":"broll/cmeups/av_w039.mp4"},{"k":40,"from":23426,"dur":237,"src":"broll/cmeups/av_w040.mp4"},{"k":41,"from":23726,"dur":182,"src":"broll/cmeups/av_w041.mp4"},{"k":42,"from":24440,"dur":173,"src":"broll/cmeups/av_w042.mp4"},{"k":43,"from":24884,"dur":239,"src":"broll/cmeups/av_w043.mp4"},{"k":44,"from":25207,"dur":151,"src":"broll/cmeups/av_w044.mp4"},{"k":45,"from":25450,"dur":91,"src":"broll/cmeups/av_w045.mp4"},{"k":46,"from":25787,"dur":106,"src":"broll/cmeups/av_w046.mp4"},{"k":47,"from":26231,"dur":229,"src":"broll/cmeups/av_w047.mp4"},{"k":48,"from":26531,"dur":193,"src":"broll/cmeups/av_w048.mp4"},{"k":49,"from":26862,"dur":83,"src":"broll/cmeups/av_w049.mp4"},{"k":50,"from":27596,"dur":127,"src":"broll/cmeups/av_w050.mp4"},{"k":51,"from":28071,"dur":176,"src":"broll/cmeups/av_w051.mp4"},{"k":52,"from":28348,"dur":172,"src":"broll/cmeups/av_w052.mp4"},{"k":53,"from":29413,"dur":167,"src":"broll/cmeups/av_w053.mp4"},{"k":54,"from":29702,"dur":187,"src":"broll/cmeups/av_w054.mp4"},{"k":55,"from":30243,"dur":702,"src":"broll/cmeups/av_w055.mp4"},{"k":56,"from":31943,"dur":192,"src":"broll/cmeups/av_w056.mp4"},{"k":57,"from":33627,"dur":82,"src":"broll/cmeups/av_w057.mp4"},{"k":58,"from":34946,"dur":272,"src":"broll/cmeups/av_w058.mp4"},{"k":59,"from":36020,"dur":343,"src":"broll/cmeups/av_w059.mp4"},{"k":60,"from":36491,"dur":96,"src":"broll/cmeups/av_w060.mp4"},{"k":61,"from":37226,"dur":577,"src":"broll/cmeups/av_w061.mp4"},{"k":62,"from":38642,"dur":264,"src":"broll/cmeups/av_w062.mp4"},{"k":63,"from":39249,"dur":104,"src":"broll/cmeups/av_w063.mp4"},{"k":64,"from":40028,"dur":101,"src":"broll/cmeups/av_w064.mp4"},{"k":65,"from":40229,"dur":179,"src":"broll/cmeups/av_w065.mp4"},{"k":66,"from":40591,"dur":145,"src":"broll/cmeups/av_w066.mp4"},{"k":67,"from":41185,"dur":261,"src":"broll/cmeups/av_w067.mp4"},{"k":68,"from":41774,"dur":105,"src":"broll/cmeups/av_w068.mp4"},{"k":69,"from":42141,"dur":161,"src":"broll/cmeups/av_w069.mp4"},{"k":70,"from":44569,"dur":457,"src":"broll/cmeups/av_w070.mp4"},{"k":71,"from":45383,"dur":271,"src":"broll/cmeups/av_w071.mp4"},{"k":72,"from":46259,"dur":114,"src":"broll/cmeups/av_w072.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmeups: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmeups/cmeups_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMEUPS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEUPS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeups.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
