// Main_cmv6casa.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMV6CASA } from "./cues_cmv6casa.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMV6CASA = 27158;

const VENTANAS = [{"k":0,"from":18,"dur":130,"src":"broll/cmv6casa/av_w000.mp4"},{"k":1,"from":436,"dur":52,"src":"broll/cmv6casa/av_w001.mp4"},{"k":2,"from":1075,"dur":73,"src":"broll/cmv6casa/av_w002.mp4"},{"k":3,"from":1390,"dur":84,"src":"broll/cmv6casa/av_w003.mp4"},{"k":4,"from":1625,"dur":201,"src":"broll/cmv6casa/av_w004.mp4"},{"k":5,"from":1866,"dur":145,"src":"broll/cmv6casa/av_w005.mp4"},{"k":6,"from":2410,"dur":326,"src":"broll/cmv6casa/av_w006.mp4"},{"k":7,"from":2851,"dur":125,"src":"broll/cmv6casa/av_w007.mp4"},{"k":8,"from":3083,"dur":119,"src":"broll/cmv6casa/av_w008.mp4"},{"k":9,"from":3737,"dur":189,"src":"broll/cmv6casa/av_w009.mp4"},{"k":10,"from":4251,"dur":144,"src":"broll/cmv6casa/av_w010.mp4"},{"k":11,"from":5491,"dur":169,"src":"broll/cmv6casa/av_w011.mp4"},{"k":12,"from":5726,"dur":88,"src":"broll/cmv6casa/av_w012.mp4"},{"k":13,"from":6950,"dur":242,"src":"broll/cmv6casa/av_w013.mp4"},{"k":14,"from":7264,"dur":139,"src":"broll/cmv6casa/av_w014.mp4"},{"k":15,"from":7584,"dur":91,"src":"broll/cmv6casa/av_w015.mp4"},{"k":16,"from":8047,"dur":327,"src":"broll/cmv6casa/av_w016.mp4"},{"k":17,"from":8731,"dur":215,"src":"broll/cmv6casa/av_w017.mp4"},{"k":18,"from":9418,"dur":141,"src":"broll/cmv6casa/av_w018.mp4"},{"k":19,"from":9828,"dur":127,"src":"broll/cmv6casa/av_w019.mp4"},{"k":20,"from":10154,"dur":155,"src":"broll/cmv6casa/av_w020.mp4"},{"k":21,"from":10443,"dur":157,"src":"broll/cmv6casa/av_w021.mp4"},{"k":22,"from":10637,"dur":106,"src":"broll/cmv6casa/av_w022.mp4"},{"k":23,"from":10810,"dur":211,"src":"broll/cmv6casa/av_w023.mp4"},{"k":24,"from":11773,"dur":91,"src":"broll/cmv6casa/av_w024.mp4"},{"k":25,"from":12234,"dur":56,"src":"broll/cmv6casa/av_w025.mp4"},{"k":26,"from":12573,"dur":183,"src":"broll/cmv6casa/av_w026.mp4"},{"k":27,"from":12927,"dur":174,"src":"broll/cmv6casa/av_w027.mp4"},{"k":28,"from":13151,"dur":392,"src":"broll/cmv6casa/av_w028.mp4"},{"k":29,"from":13682,"dur":107,"src":"broll/cmv6casa/av_w029.mp4"},{"k":30,"from":15011,"dur":360,"src":"broll/cmv6casa/av_w030.mp4"},{"k":31,"from":15426,"dur":89,"src":"broll/cmv6casa/av_w031.mp4"},{"k":32,"from":15593,"dur":727,"src":"broll/cmv6casa/av_w032.mp4"},{"k":33,"from":16767,"dur":185,"src":"broll/cmv6casa/av_w033.mp4"},{"k":34,"from":17345,"dur":232,"src":"broll/cmv6casa/av_w034.mp4"},{"k":35,"from":18084,"dur":141,"src":"broll/cmv6casa/av_w035.mp4"},{"k":36,"from":18566,"dur":147,"src":"broll/cmv6casa/av_w036.mp4"},{"k":37,"from":18813,"dur":143,"src":"broll/cmv6casa/av_w037.mp4"},{"k":38,"from":20525,"dur":360,"src":"broll/cmv6casa/av_w038.mp4"},{"k":39,"from":21386,"dur":90,"src":"broll/cmv6casa/av_w039.mp4"},{"k":40,"from":22080,"dur":153,"src":"broll/cmv6casa/av_w040.mp4"},{"k":41,"from":22938,"dur":142,"src":"broll/cmv6casa/av_w041.mp4"},{"k":42,"from":24292,"dur":626,"src":"broll/cmv6casa/av_w042.mp4"},{"k":43,"from":25378,"dur":105,"src":"broll/cmv6casa/av_w043.mp4"},{"k":44,"from":25667,"dur":130,"src":"broll/cmv6casa/av_w044.mp4"},{"k":45,"from":25962,"dur":158,"src":"broll/cmv6casa/av_w045.mp4"},{"k":46,"from":26224,"dur":119,"src":"broll/cmv6casa/av_w046.mp4"},{"k":47,"from":26421,"dur":256,"src":"broll/cmv6casa/av_w047.mp4"},{"k":48,"from":26975,"dur":182,"src":"broll/cmv6casa/av_w048.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmv6casa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmv6casa/cmv6casa_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_CMV6CASA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMV6CASA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={18} layout="none"><Audio src={staticFile("cmv6casa.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
