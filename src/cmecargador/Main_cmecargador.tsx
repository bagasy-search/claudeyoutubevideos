// Main_cmecargador.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMECARGADOR } from "./cues_cmecargador.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMECARGADOR = 46724;

const VENTANAS = [{"k":0,"from":0,"dur":151,"src":"broll/cmecargador/av_w000.mp4"},{"k":1,"from":435,"dur":231,"src":"broll/cmecargador/av_w001.mp4"},{"k":2,"from":879,"dur":72,"src":"broll/cmecargador/av_w002.mp4"},{"k":3,"from":1660,"dur":87,"src":"broll/cmecargador/av_w003.mp4"},{"k":4,"from":1931,"dur":244,"src":"broll/cmecargador/av_w004.mp4"},{"k":5,"from":2273,"dur":132,"src":"broll/cmecargador/av_w005.mp4"},{"k":6,"from":2586,"dur":143,"src":"broll/cmecargador/av_w006.mp4"},{"k":7,"from":3034,"dur":111,"src":"broll/cmecargador/av_w007.mp4"},{"k":8,"from":3387,"dur":142,"src":"broll/cmecargador/av_w008.mp4"},{"k":9,"from":3923,"dur":106,"src":"broll/cmecargador/av_w009.mp4"},{"k":10,"from":4153,"dur":217,"src":"broll/cmecargador/av_w010.mp4"},{"k":11,"from":4574,"dur":134,"src":"broll/cmecargador/av_w011.mp4"},{"k":12,"from":4826,"dur":410,"src":"broll/cmecargador/av_w012.mp4"},{"k":13,"from":6346,"dur":126,"src":"broll/cmecargador/av_w013.mp4"},{"k":14,"from":6587,"dur":124,"src":"broll/cmecargador/av_w014.mp4"},{"k":15,"from":6794,"dur":150,"src":"broll/cmecargador/av_w015.mp4"},{"k":16,"from":7018,"dur":226,"src":"broll/cmecargador/av_w016.mp4"},{"k":17,"from":7575,"dur":106,"src":"broll/cmecargador/av_w017.mp4"},{"k":18,"from":8023,"dur":134,"src":"broll/cmecargador/av_w018.mp4"},{"k":19,"from":8315,"dur":143,"src":"broll/cmecargador/av_w019.mp4"},{"k":20,"from":8656,"dur":131,"src":"broll/cmecargador/av_w020.mp4"},{"k":21,"from":9992,"dur":195,"src":"broll/cmecargador/av_w021.mp4"},{"k":22,"from":10938,"dur":449,"src":"broll/cmecargador/av_w022.mp4"},{"k":23,"from":12322,"dur":146,"src":"broll/cmecargador/av_w023.mp4"},{"k":24,"from":12576,"dur":103,"src":"broll/cmecargador/av_w024.mp4"},{"k":25,"from":13132,"dur":153,"src":"broll/cmecargador/av_w025.mp4"},{"k":26,"from":13801,"dur":183,"src":"broll/cmecargador/av_w026.mp4"},{"k":27,"from":14118,"dur":105,"src":"broll/cmecargador/av_w027.mp4"},{"k":28,"from":14825,"dur":110,"src":"broll/cmecargador/av_w028.mp4"},{"k":29,"from":15551,"dur":244,"src":"broll/cmecargador/av_w029.mp4"},{"k":30,"from":16010,"dur":298,"src":"broll/cmecargador/av_w030.mp4"},{"k":31,"from":17077,"dur":94,"src":"broll/cmecargador/av_w031.mp4"},{"k":32,"from":17595,"dur":415,"src":"broll/cmecargador/av_w032.mp4"},{"k":33,"from":18348,"dur":228,"src":"broll/cmecargador/av_w033.mp4"},{"k":34,"from":19091,"dur":150,"src":"broll/cmecargador/av_w034.mp4"},{"k":35,"from":20021,"dur":261,"src":"broll/cmecargador/av_w035.mp4"},{"k":36,"from":20614,"dur":423,"src":"broll/cmecargador/av_w036.mp4"},{"k":37,"from":21527,"dur":234,"src":"broll/cmecargador/av_w037.mp4"},{"k":38,"from":21873,"dur":153,"src":"broll/cmecargador/av_w038.mp4"},{"k":39,"from":22836,"dur":158,"src":"broll/cmecargador/av_w039.mp4"},{"k":40,"from":23169,"dur":108,"src":"broll/cmecargador/av_w040.mp4"},{"k":41,"from":23428,"dur":249,"src":"broll/cmecargador/av_w041.mp4"},{"k":42,"from":23815,"dur":118,"src":"broll/cmecargador/av_w042.mp4"},{"k":43,"from":24337,"dur":119,"src":"broll/cmecargador/av_w043.mp4"},{"k":44,"from":24914,"dur":324,"src":"broll/cmecargador/av_w044.mp4"},{"k":45,"from":25445,"dur":99,"src":"broll/cmecargador/av_w045.mp4"},{"k":46,"from":26080,"dur":147,"src":"broll/cmecargador/av_w046.mp4"},{"k":47,"from":26461,"dur":147,"src":"broll/cmecargador/av_w047.mp4"},{"k":48,"from":26665,"dur":240,"src":"broll/cmecargador/av_w048.mp4"},{"k":49,"from":27560,"dur":323,"src":"broll/cmecargador/av_w049.mp4"},{"k":50,"from":28095,"dur":129,"src":"broll/cmecargador/av_w050.mp4"},{"k":51,"from":28493,"dur":198,"src":"broll/cmecargador/av_w051.mp4"},{"k":52,"from":29332,"dur":140,"src":"broll/cmecargador/av_w052.mp4"},{"k":53,"from":29807,"dur":168,"src":"broll/cmecargador/av_w053.mp4"},{"k":54,"from":30131,"dur":278,"src":"broll/cmecargador/av_w054.mp4"},{"k":55,"from":31282,"dur":252,"src":"broll/cmecargador/av_w055.mp4"},{"k":56,"from":31922,"dur":188,"src":"broll/cmecargador/av_w056.mp4"},{"k":57,"from":32290,"dur":254,"src":"broll/cmecargador/av_w057.mp4"},{"k":58,"from":32702,"dur":133,"src":"broll/cmecargador/av_w058.mp4"},{"k":59,"from":32888,"dur":377,"src":"broll/cmecargador/av_w059.mp4"},{"k":60,"from":33685,"dur":117,"src":"broll/cmecargador/av_w060.mp4"},{"k":61,"from":33902,"dur":192,"src":"broll/cmecargador/av_w061.mp4"},{"k":62,"from":34571,"dur":135,"src":"broll/cmecargador/av_w062.mp4"},{"k":63,"from":34787,"dur":120,"src":"broll/cmecargador/av_w063.mp4"},{"k":64,"from":35218,"dur":108,"src":"broll/cmecargador/av_w064.mp4"},{"k":65,"from":35671,"dur":163,"src":"broll/cmecargador/av_w065.mp4"},{"k":66,"from":35927,"dur":258,"src":"broll/cmecargador/av_w066.mp4"},{"k":67,"from":36893,"dur":69,"src":"broll/cmecargador/av_w067.mp4"},{"k":68,"from":37420,"dur":441,"src":"broll/cmecargador/av_w068.mp4"},{"k":69,"from":38219,"dur":171,"src":"broll/cmecargador/av_w069.mp4"},{"k":70,"from":38735,"dur":254,"src":"broll/cmecargador/av_w070.mp4"},{"k":71,"from":39122,"dur":126,"src":"broll/cmecargador/av_w071.mp4"},{"k":72,"from":39518,"dur":203,"src":"broll/cmecargador/av_w072.mp4"},{"k":73,"from":39968,"dur":221,"src":"broll/cmecargador/av_w073.mp4"},{"k":74,"from":40498,"dur":122,"src":"broll/cmecargador/av_w074.mp4"},{"k":75,"from":40750,"dur":123,"src":"broll/cmecargador/av_w075.mp4"},{"k":76,"from":41624,"dur":121,"src":"broll/cmecargador/av_w076.mp4"},{"k":77,"from":42449,"dur":146,"src":"broll/cmecargador/av_w077.mp4"},{"k":78,"from":42850,"dur":173,"src":"broll/cmecargador/av_w078.mp4"},{"k":79,"from":44562,"dur":547,"src":"broll/cmecargador/av_w079.mp4"},{"k":80,"from":45747,"dur":976,"src":"broll/cmecargador/av_w080.mp4"}];
const AUDIOS: { from: number; dur: number; src: string; vol: number; fi: number; fo: number; loop?: boolean }[] = [];

export const MainCmecargador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmecargador/cmecargador_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} fg={(w as any).fg} fx={(w as any).fx} />
        </Sequence>
      ))}
      {CUES_CMECARGADOR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMECARGADOR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmecargador.m4a")} />
      {AUDIOS.map((a, i) => (
        <Sequence key={"sfx" + i} from={a.from} durationInFrames={a.dur} layout="none">
          <Audio src={staticFile(a.src)} loop={a.loop} volume={(f) => a.vol * Math.max(0, Math.min(1, a.fi ? f / a.fi : 1, a.fo ? (a.dur - f) / a.fo : 1))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
