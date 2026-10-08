// Main_ohfwater.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_OHFWATER } from "./cues_ohfwater.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_OHFWATER = 26971;

const VENTANAS = [{"k":0,"from":30,"dur":90,"src":"broll/ohfwater/av_w000.mp4"},{"k":1,"from":917,"dur":251,"src":"broll/ohfwater/av_w001.mp4"},{"k":2,"from":1370,"dur":105,"src":"broll/ohfwater/av_w002.mp4"},{"k":3,"from":1723,"dur":230,"src":"broll/ohfwater/av_w003.mp4"},{"k":4,"from":2033,"dur":297,"src":"broll/ohfwater/av_w004.mp4"},{"k":5,"from":2448,"dur":108,"src":"broll/ohfwater/av_w005.mp4"},{"k":6,"from":2631,"dur":97,"src":"broll/ohfwater/av_w006.mp4"},{"k":7,"from":3284,"dur":662,"src":"broll/ohfwater/av_w007.mp4"},{"k":8,"from":4223,"dur":149,"src":"broll/ohfwater/av_w008.mp4"},{"k":9,"from":4550,"dur":213,"src":"broll/ohfwater/av_w009.mp4"},{"k":10,"from":6257,"dur":370,"src":"broll/ohfwater/av_w010.mp4"},{"k":11,"from":6950,"dur":254,"src":"broll/ohfwater/av_w011.mp4"},{"k":12,"from":9047,"dur":231,"src":"broll/ohfwater/av_w012.mp4"},{"k":13,"from":9454,"dur":285,"src":"broll/ohfwater/av_w013.mp4"},{"k":14,"from":10615,"dur":428,"src":"broll/ohfwater/av_w014.mp4"},{"k":15,"from":11175,"dur":182,"src":"broll/ohfwater/av_w015.mp4"},{"k":16,"from":11932,"dur":49,"src":"broll/ohfwater/av_w016.mp4"},{"k":17,"from":13040,"dur":208,"src":"broll/ohfwater/av_w017.mp4"},{"k":18,"from":13666,"dur":67,"src":"broll/ohfwater/av_w018.mp4"},{"k":19,"from":13957,"dur":247,"src":"broll/ohfwater/av_w019.mp4"},{"k":20,"from":14567,"dur":65,"src":"broll/ohfwater/av_w020.mp4"},{"k":21,"from":15148,"dur":101,"src":"broll/ohfwater/av_w021.mp4"},{"k":22,"from":15548,"dur":355,"src":"broll/ohfwater/av_w022.mp4"},{"k":23,"from":16879,"dur":306,"src":"broll/ohfwater/av_w023.mp4"},{"k":24,"from":18271,"dur":154,"src":"broll/ohfwater/av_w024.mp4"},{"k":25,"from":18472,"dur":258,"src":"broll/ohfwater/av_w025.mp4"},{"k":26,"from":19682,"dur":125,"src":"broll/ohfwater/av_w026.mp4"},{"k":27,"from":20944,"dur":65,"src":"broll/ohfwater/av_w027.mp4"},{"k":28,"from":21941,"dur":108,"src":"broll/ohfwater/av_w028.mp4"},{"k":29,"from":22556,"dur":111,"src":"broll/ohfwater/av_w029.mp4"},{"k":30,"from":24221,"dur":235,"src":"broll/ohfwater/av_w030.mp4"},{"k":31,"from":25600,"dur":204,"src":"broll/ohfwater/av_w031.mp4"},{"k":32,"from":26188,"dur":187,"src":"broll/ohfwater/av_w032.mp4"},{"k":33,"from":26632,"dur":339,"src":"broll/ohfwater/av_w033.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainOhfwater: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/ohfwater/ohfwater_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_OHFWATER.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_OHFWATER.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("ohfwater_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
