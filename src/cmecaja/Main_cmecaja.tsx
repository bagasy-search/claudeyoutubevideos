// Main_cmecaja.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMECAJA } from "./cues_cmecaja.gen";
import { AvatarVentana, PlacaPiso } from "./Piezas";

export const TOTAL_FRAMES_CMECAJA = 39588;

const VENTANAS = [{"k":0,"from":0,"dur":91,"src":"broll/cmecaja/av_w000.mp4"},{"k":1,"from":137,"dur":101,"src":"broll/cmecaja/av_w001.mp4"},{"k":2,"from":547,"dur":60,"src":"broll/cmecaja/av_w002.mp4"},{"k":3,"from":714,"dur":83,"src":"broll/cmecaja/av_w003.mp4"},{"k":4,"from":1079,"dur":72,"src":"broll/cmecaja/av_w004.mp4"},{"k":5,"from":1259,"dur":74,"src":"broll/cmecaja/av_w005.mp4"},{"k":6,"from":1417,"dur":88,"src":"broll/cmecaja/av_w006.mp4"},{"k":7,"from":1684,"dur":105,"src":"broll/cmecaja/av_w007.mp4"},{"k":8,"from":1874,"dur":120,"src":"broll/cmecaja/av_w008.mp4"},{"k":9,"from":2695,"dur":142,"src":"broll/cmecaja/av_w009.mp4"},{"k":10,"from":3231,"dur":179,"src":"broll/cmecaja/av_w010.mp4"},{"k":11,"from":3756,"dur":89,"src":"broll/cmecaja/av_w011.mp4"},{"k":12,"from":4297,"dur":125,"src":"broll/cmecaja/av_w012.mp4"},{"k":13,"from":4651,"dur":108,"src":"broll/cmecaja/av_w013.mp4"},{"k":14,"from":4901,"dur":71,"src":"broll/cmecaja/av_w014.mp4"},{"k":15,"from":5284,"dur":150,"src":"broll/cmecaja/av_w015.mp4"},{"k":16,"from":7052,"dur":154,"src":"broll/cmecaja/av_w016.mp4"},{"k":17,"from":7385,"dur":133,"src":"broll/cmecaja/av_w017.mp4"},{"k":18,"from":8378,"dur":146,"src":"broll/cmecaja/av_w018.mp4"},{"k":19,"from":9221,"dur":123,"src":"broll/cmecaja/av_w019.mp4"},{"k":20,"from":9551,"dur":128,"src":"broll/cmecaja/av_w020.mp4"},{"k":21,"from":9796,"dur":81,"src":"broll/cmecaja/av_w021.mp4"},{"k":22,"from":10280,"dur":95,"src":"broll/cmecaja/av_w022.mp4"},{"k":23,"from":10852,"dur":219,"src":"broll/cmecaja/av_w023.mp4"},{"k":24,"from":11333,"dur":204,"src":"broll/cmecaja/av_w024.mp4"},{"k":25,"from":12079,"dur":164,"src":"broll/cmecaja/av_w025.mp4"},{"k":26,"from":12608,"dur":167,"src":"broll/cmecaja/av_w026.mp4"},{"k":27,"from":13442,"dur":147,"src":"broll/cmecaja/av_w027.mp4"},{"k":28,"from":13742,"dur":288,"src":"broll/cmecaja/av_w028.mp4"},{"k":29,"from":14161,"dur":90,"src":"broll/cmecaja/av_w029.mp4"},{"k":30,"from":14984,"dur":347,"src":"broll/cmecaja/av_w030.mp4"},{"k":31,"from":16280,"dur":146,"src":"broll/cmecaja/av_w031.mp4"},{"k":32,"from":17169,"dur":227,"src":"broll/cmecaja/av_w032.mp4"},{"k":33,"from":17747,"dur":127,"src":"broll/cmecaja/av_w033.mp4"},{"k":34,"from":18220,"dur":227,"src":"broll/cmecaja/av_w034.mp4"},{"k":35,"from":18670,"dur":129,"src":"broll/cmecaja/av_w035.mp4"},{"k":36,"from":18858,"dur":151,"src":"broll/cmecaja/av_w036.mp4"},{"k":37,"from":19441,"dur":120,"src":"broll/cmecaja/av_w037.mp4"},{"k":38,"from":20336,"dur":98,"src":"broll/cmecaja/av_w038.mp4"},{"k":39,"from":21146,"dur":78,"src":"broll/cmecaja/av_w039.mp4"},{"k":40,"from":21392,"dur":114,"src":"broll/cmecaja/av_w040.mp4"},{"k":41,"from":21770,"dur":239,"src":"broll/cmecaja/av_w041.mp4"},{"k":42,"from":22367,"dur":173,"src":"broll/cmecaja/av_w042.mp4"},{"k":43,"from":22877,"dur":176,"src":"broll/cmecaja/av_w043.mp4"},{"k":44,"from":23116,"dur":136,"src":"broll/cmecaja/av_w044.mp4"},{"k":45,"from":23900,"dur":132,"src":"broll/cmecaja/av_w045.mp4"},{"k":46,"from":24625,"dur":255,"src":"broll/cmecaja/av_w046.mp4"},{"k":47,"from":24982,"dur":123,"src":"broll/cmecaja/av_w047.mp4"},{"k":48,"from":25412,"dur":122,"src":"broll/cmecaja/av_w048.mp4"},{"k":49,"from":26009,"dur":316,"src":"broll/cmecaja/av_w049.mp4"},{"k":50,"from":26441,"dur":68,"src":"broll/cmecaja/av_w050.mp4"},{"k":51,"from":26962,"dur":97,"src":"broll/cmecaja/av_w051.mp4"},{"k":52,"from":27247,"dur":120,"src":"broll/cmecaja/av_w052.mp4"},{"k":53,"from":28340,"dur":170,"src":"broll/cmecaja/av_w053.mp4"},{"k":54,"from":29210,"dur":186,"src":"broll/cmecaja/av_w054.mp4"},{"k":55,"from":29566,"dur":115,"src":"broll/cmecaja/av_w055.mp4"},{"k":56,"from":30221,"dur":293,"src":"broll/cmecaja/av_w056.mp4"},{"k":57,"from":30992,"dur":130,"src":"broll/cmecaja/av_w057.mp4"},{"k":58,"from":31250,"dur":107,"src":"broll/cmecaja/av_w058.mp4"},{"k":59,"from":32399,"dur":132,"src":"broll/cmecaja/av_w059.mp4"},{"k":60,"from":32722,"dur":139,"src":"broll/cmecaja/av_w060.mp4"},{"k":61,"from":33040,"dur":325,"src":"broll/cmecaja/av_w061.mp4"},{"k":62,"from":34119,"dur":123,"src":"broll/cmecaja/av_w062.mp4"},{"k":63,"from":34351,"dur":343,"src":"broll/cmecaja/av_w063.mp4"},{"k":64,"from":35927,"dur":372,"src":"broll/cmecaja/av_w064.mp4"},{"k":65,"from":36419,"dur":221,"src":"broll/cmecaja/av_w065.mp4"},{"k":66,"from":37501,"dur":129,"src":"broll/cmecaja/av_w066.mp4"},{"k":67,"from":37957,"dur":108,"src":"broll/cmecaja/av_w067.mp4"},{"k":68,"from":38425,"dur":169,"src":"broll/cmecaja/av_w068.mp4"},{"k":69,"from":39455,"dur":81,"src":"broll/cmecaja/av_w069.mp4"}];

export const MainCmecaja: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <PlacaPiso src="img/cmecaja/cmecaja_placa_a.jpg" />
      {VENTANAS.map((w) => (
        <Sequence key={"av" + w.k} from={w.from} durationInFrames={w.dur} layout="none">
          <AvatarVentana src={w.src} desde={w.from} />
        </Sequence>
      ))}
      {CUES_CMECAJA.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMECAJA.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmecaja.m4a")} />
    </AbsoluteFill>
  );
};
