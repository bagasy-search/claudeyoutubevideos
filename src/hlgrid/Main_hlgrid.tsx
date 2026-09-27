// Main_hlgrid.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_HLGRID } from "./cues_hlgrid.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_HLGRID = 38380;

const VENTANAS = [{"k":0,"from":30,"dur":157,"src":"broll/hlgrid/av_w000.mp4"},{"k":1,"from":357,"dur":137,"src":"broll/hlgrid/av_w001.mp4","fx":[{"start":24,"dur":113,"kind":"detras","props":{"texto":"40 YEARS","sub":"ON THE LINE"}}],"fg":"broll/hlgrid/av_w001_fg.webm"},{"k":2,"from":604,"dur":88,"src":"broll/hlgrid/av_w002.mp4"},{"k":3,"from":788,"dur":117,"src":"broll/hlgrid/av_w003.mp4"},{"k":4,"from":1232,"dur":99,"src":"broll/hlgrid/av_w004.mp4","fx":[{"start":21,"dur":74,"kind":"detras","props":{"texto":"7","sub":"THINGS · IN ORDER"}}],"fg":"broll/hlgrid/av_w004_fg.webm"},{"k":5,"from":1796,"dur":116,"src":"broll/hlgrid/av_w005.mp4"},{"k":6,"from":3172,"dur":104,"src":"broll/hlgrid/av_w006.mp4"},{"k":7,"from":3994,"dur":172,"src":"broll/hlgrid/av_w007.mp4","zoom":[[92,70,1.14]]},{"k":8,"from":4247,"dur":134,"src":"broll/hlgrid/av_w008.mp4"},{"k":9,"from":5015,"dur":153,"src":"broll/hlgrid/av_w009.mp4"},{"k":10,"from":5440,"dur":106,"src":"broll/hlgrid/av_w010.mp4"},{"k":11,"from":6203,"dur":134,"src":"broll/hlgrid/av_w011.mp4"},{"k":12,"from":6521,"dur":270,"src":"broll/hlgrid/av_w012.mp4"},{"k":13,"from":7123,"dur":165,"src":"broll/hlgrid/av_w013.mp4"},{"k":14,"from":7726,"dur":114,"src":"broll/hlgrid/av_w014.mp4"},{"k":15,"from":8080,"dur":70,"src":"broll/hlgrid/av_w015.mp4"},{"k":16,"from":8344,"dur":248,"src":"broll/hlgrid/av_w016.mp4"},{"k":17,"from":8639,"dur":188,"src":"broll/hlgrid/av_w017.mp4"},{"k":18,"from":9416,"dur":142,"src":"broll/hlgrid/av_w018.mp4"},{"k":19,"from":10108,"dur":212,"src":"broll/hlgrid/av_w019.mp4"},{"k":20,"from":10558,"dur":72,"src":"broll/hlgrid/av_w020.mp4"},{"k":21,"from":11597,"dur":110,"src":"broll/hlgrid/av_w021.mp4"},{"k":22,"from":11845,"dur":187,"src":"broll/hlgrid/av_w022.mp4"},{"k":23,"from":12078,"dur":250,"src":"broll/hlgrid/av_w023.mp4"},{"k":24,"from":13471,"dur":145,"src":"broll/hlgrid/av_w024.mp4"},{"k":25,"from":13749,"dur":92,"src":"broll/hlgrid/av_w025.mp4"},{"k":26,"from":14144,"dur":158,"src":"broll/hlgrid/av_w026.mp4"},{"k":27,"from":15101,"dur":121,"src":"broll/hlgrid/av_w027.mp4"},{"k":28,"from":16376,"dur":160,"src":"broll/hlgrid/av_w028.mp4","fx":[{"start":21,"dur":136,"kind":"detras","props":{"texto":"RULE 4","sub":"THE ONE THAT KILLS"}}],"fg":"broll/hlgrid/av_w028_fg.webm","zoom":[[77,65,1.14]]},{"k":29,"from":18197,"dur":168,"src":"broll/hlgrid/av_w029.mp4"},{"k":30,"from":19133,"dur":153,"src":"broll/hlgrid/av_w030.mp4"},{"k":31,"from":19579,"dur":246,"src":"broll/hlgrid/av_w031.mp4"},{"k":32,"from":20642,"dur":163,"src":"broll/hlgrid/av_w032.mp4"},{"k":33,"from":20882,"dur":147,"src":"broll/hlgrid/av_w033.mp4"},{"k":34,"from":21995,"dur":113,"src":"broll/hlgrid/av_w034.mp4"},{"k":35,"from":23110,"dur":96,"src":"broll/hlgrid/av_w035.mp4"},{"k":36,"from":23516,"dur":313,"src":"broll/hlgrid/av_w036.mp4"},{"k":37,"from":24680,"dur":118,"src":"broll/hlgrid/av_w037.mp4"},{"k":38,"from":25018,"dur":180,"src":"broll/hlgrid/av_w038.mp4"},{"k":39,"from":27231,"dur":77,"src":"broll/hlgrid/av_w039.mp4"},{"k":40,"from":27757,"dur":162,"src":"broll/hlgrid/av_w040.mp4"},{"k":41,"from":28875,"dur":202,"src":"broll/hlgrid/av_w041.mp4"},{"k":42,"from":30045,"dur":275,"src":"broll/hlgrid/av_w042.mp4","fx":[{"start":141,"dur":128,"kind":"detras","props":{"texto":"EVERY WIRE","sub":"IS LIVE"}}],"fg":"broll/hlgrid/av_w042_fg.webm"},{"k":43,"from":30820,"dur":109,"src":"broll/hlgrid/av_w043.mp4"},{"k":44,"from":31541,"dur":139,"src":"broll/hlgrid/av_w044.mp4"},{"k":45,"from":31929,"dur":163,"src":"broll/hlgrid/av_w045.mp4"},{"k":46,"from":33274,"dur":109,"src":"broll/hlgrid/av_w046.mp4"},{"k":47,"from":33628,"dur":270,"src":"broll/hlgrid/av_w047.mp4"},{"k":48,"from":34902,"dur":136,"src":"broll/hlgrid/av_w048.mp4"},{"k":49,"from":35154,"dur":95,"src":"broll/hlgrid/av_w049.mp4"},{"k":50,"from":35381,"dur":90,"src":"broll/hlgrid/av_w050.mp4"},{"k":51,"from":35597,"dur":89,"src":"broll/hlgrid/av_w051.mp4"},{"k":52,"from":36077,"dur":100,"src":"broll/hlgrid/av_w052.mp4"},{"k":53,"from":36498,"dur":134,"src":"broll/hlgrid/av_w053.mp4"},{"k":54,"from":36812,"dur":209,"src":"broll/hlgrid/av_w054.mp4"},{"k":55,"from":37342,"dur":340,"src":"broll/hlgrid/av_w055.mp4"},{"k":56,"from":38021,"dur":358,"src":"broll/hlgrid/av_w056.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainHlgrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C0E" }}>
      <PlacaPiso src="img/hlgrid/hlgrid_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} zoom={(w as any).zoom} />
        </Sequence>
      ))}
      {CUES_HLGRID.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_HLGRID.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("hlgrid_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
