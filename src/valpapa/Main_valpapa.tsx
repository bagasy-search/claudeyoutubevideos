// Main_valpapa.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_VALPAPA } from "./cues_valpapa.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_VALPAPA = 45243;

const VENTANAS = [{"k":0,"from":30,"dur":128,"src":"broll/valpapa/av_w000.mp4"},{"k":1,"from":477,"dur":219,"src":"broll/valpapa/av_w001.mp4"},{"k":2,"from":804,"dur":117,"src":"broll/valpapa/av_w002.mp4"},{"k":3,"from":1180,"dur":136,"src":"broll/valpapa/av_w003.mp4"},{"k":4,"from":1577,"dur":111,"src":"broll/valpapa/av_w004.mp4"},{"k":5,"from":1963,"dur":228,"src":"broll/valpapa/av_w005.mp4"},{"k":6,"from":2912,"dur":102,"src":"broll/valpapa/av_w006.mp4"},{"k":7,"from":3415,"dur":248,"src":"broll/valpapa/av_w007.mp4"},{"k":8,"from":4189,"dur":236,"src":"broll/valpapa/av_w008.mp4"},{"k":9,"from":4917,"dur":316,"src":"broll/valpapa/av_w009.mp4"},{"k":10,"from":5887,"dur":108,"src":"broll/valpapa/av_w010.mp4"},{"k":11,"from":6179,"dur":84,"src":"broll/valpapa/av_w011.mp4"},{"k":12,"from":6443,"dur":341,"src":"broll/valpapa/av_w012.mp4"},{"k":13,"from":7369,"dur":200,"src":"broll/valpapa/av_w013.mp4"},{"k":14,"from":7828,"dur":196,"src":"broll/valpapa/av_w014.mp4"},{"k":15,"from":9974,"dur":131,"src":"broll/valpapa/av_w015.mp4"},{"k":16,"from":10281,"dur":368,"src":"broll/valpapa/av_w016.mp4"},{"k":17,"from":10844,"dur":107,"src":"broll/valpapa/av_w017.mp4"},{"k":18,"from":11222,"dur":215,"src":"broll/valpapa/av_w018.mp4"},{"k":19,"from":11618,"dur":152,"src":"broll/valpapa/av_w019.mp4"},{"k":20,"from":12065,"dur":279,"src":"broll/valpapa/av_w020.mp4"},{"k":21,"from":12503,"dur":190,"src":"broll/valpapa/av_w021.mp4"},{"k":22,"from":12879,"dur":127,"src":"broll/valpapa/av_w022.mp4"},{"k":23,"from":13201,"dur":76,"src":"broll/valpapa/av_w023.mp4"},{"k":24,"from":13513,"dur":178,"src":"broll/valpapa/av_w024.mp4"},{"k":25,"from":13733,"dur":133,"src":"broll/valpapa/av_w025.mp4"},{"k":26,"from":14038,"dur":193,"src":"broll/valpapa/av_w026.mp4"},{"k":27,"from":15121,"dur":135,"src":"broll/valpapa/av_w027.mp4"},{"k":28,"from":16163,"dur":83,"src":"broll/valpapa/av_w028.mp4"},{"k":29,"from":16325,"dur":165,"src":"broll/valpapa/av_w029.mp4"},{"k":30,"from":17902,"dur":199,"src":"broll/valpapa/av_w030.mp4"},{"k":31,"from":18568,"dur":94,"src":"broll/valpapa/av_w031.mp4"},{"k":32,"from":19931,"dur":152,"src":"broll/valpapa/av_w032.mp4"},{"k":33,"from":20809,"dur":137,"src":"broll/valpapa/av_w033.mp4"},{"k":34,"from":21384,"dur":75,"src":"broll/valpapa/av_w034.mp4"},{"k":35,"from":22115,"dur":229,"src":"broll/valpapa/av_w035.mp4"},{"k":36,"from":22458,"dur":139,"src":"broll/valpapa/av_w036.mp4"},{"k":37,"from":22835,"dur":199,"src":"broll/valpapa/av_w037.mp4"},{"k":38,"from":23264,"dur":224,"src":"broll/valpapa/av_w038.mp4"},{"k":39,"from":24182,"dur":107,"src":"broll/valpapa/av_w039.mp4"},{"k":40,"from":24458,"dur":197,"src":"broll/valpapa/av_w040.mp4"},{"k":41,"from":25427,"dur":159,"src":"broll/valpapa/av_w041.mp4"},{"k":42,"from":25769,"dur":131,"src":"broll/valpapa/av_w042.mp4"},{"k":43,"from":26680,"dur":71,"src":"broll/valpapa/av_w043.mp4"},{"k":44,"from":27259,"dur":189,"src":"broll/valpapa/av_w044.mp4"},{"k":45,"from":27670,"dur":434,"src":"broll/valpapa/av_w045.mp4"},{"k":46,"from":29308,"dur":204,"src":"broll/valpapa/av_w046.mp4"},{"k":47,"from":29872,"dur":232,"src":"broll/valpapa/av_w047.mp4"},{"k":48,"from":30890,"dur":264,"src":"broll/valpapa/av_w048.mp4"},{"k":49,"from":31456,"dur":52,"src":"broll/valpapa/av_w049.mp4"},{"k":50,"from":31740,"dur":121,"src":"broll/valpapa/av_w050.mp4"},{"k":51,"from":31960,"dur":241,"src":"broll/valpapa/av_w051.mp4"},{"k":52,"from":32272,"dur":224,"src":"broll/valpapa/av_w052.mp4"},{"k":53,"from":33481,"dur":171,"src":"broll/valpapa/av_w053.mp4"},{"k":54,"from":33900,"dur":160,"src":"broll/valpapa/av_w054.mp4"},{"k":55,"from":34162,"dur":142,"src":"broll/valpapa/av_w055.mp4"},{"k":56,"from":34886,"dur":140,"src":"broll/valpapa/av_w056.mp4"},{"k":57,"from":35077,"dur":178,"src":"broll/valpapa/av_w057.mp4"},{"k":58,"from":35504,"dur":254,"src":"broll/valpapa/av_w058.mp4"},{"k":59,"from":35777,"dur":371,"src":"broll/valpapa/av_w059.mp4"},{"k":60,"from":36223,"dur":102,"src":"broll/valpapa/av_w060.mp4"},{"k":61,"from":36508,"dur":322,"src":"broll/valpapa/av_w061.mp4"},{"k":62,"from":37069,"dur":221,"src":"broll/valpapa/av_w062.mp4"},{"k":63,"from":37756,"dur":168,"src":"broll/valpapa/av_w063.mp4"},{"k":64,"from":38054,"dur":338,"src":"broll/valpapa/av_w064.mp4"},{"k":65,"from":38624,"dur":146,"src":"broll/valpapa/av_w065.mp4"},{"k":66,"from":39109,"dur":158,"src":"broll/valpapa/av_w066.mp4"},{"k":67,"from":39450,"dur":119,"src":"broll/valpapa/av_w067.mp4"},{"k":68,"from":39818,"dur":262,"src":"broll/valpapa/av_w068.mp4"},{"k":69,"from":40511,"dur":99,"src":"broll/valpapa/av_w069.mp4"},{"k":70,"from":40876,"dur":295,"src":"broll/valpapa/av_w070.mp4"},{"k":71,"from":41487,"dur":322,"src":"broll/valpapa/av_w071.mp4"},{"k":72,"from":42093,"dur":245,"src":"broll/valpapa/av_w072.mp4"},{"k":73,"from":43393,"dur":174,"src":"broll/valpapa/av_w073.mp4"},{"k":74,"from":43707,"dur":570,"src":"broll/valpapa/av_w074.mp4"},{"k":75,"from":44338,"dur":109,"src":"broll/valpapa/av_w075.mp4"},{"k":76,"from":44545,"dur":369,"src":"broll/valpapa/av_w076.mp4"},{"k":77,"from":45146,"dur":96,"src":"broll/valpapa/av_w077.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainValpapa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4EBD9" }}>
      <PlacaPiso src="img/valpapa/valpapa_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_VALPAPA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_VALPAPA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Sequence from={30} layout="none"><Audio src={staticFile("valpapa_mix.m4a")} /></Sequence>
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
