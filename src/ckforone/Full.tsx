// ckforone · el video entero editado por Claude (11-oct-2026). Público mayor: tomas de 6-10 s, más Loretta a cámara,
// material REAL de archivo (películas de dominio público + fotos con licencia libre). Sin audio acá: la mezcla va aparte (numpy).
import React from "react";
import { AbsoluteFill, Sequence, Img, staticFile } from "remotion";
import { Plate, CompWrap, Grain, OV, fr, type Shot } from "./Base";
import { KIT } from "./Kit";
import { NEW } from "./New";
import EDL from "./edl.json";

export const TOTAL_S = (EDL as any).end as number;
type S2 = Shot & { c?: string; props?: any };
const SH = (EDL as any).shots as S2[];
const ALL: Record<string, React.FC<any>> = { ...KIT, ...NEW };

export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SH.map((s, i) => {
      const lead = s.tin && s.tin !== "cut" ? OV : 0;
      const tail = s.tout && s.tout !== "cut" ? OV : 0;
      const from = fr(s.a) - lead, d = fr(s.b) - fr(s.a);
      const K = s.c ? ALL[s.c] : null;
      return (
        <Sequence key={i} from={from} durationInFrames={d + lead + tail}>
          {K ? <CompWrap lead={lead} d={d} tout={s.tout}><K {...s.props} a={s.a} d={d} /></CompWrap> : <Plate s={s} d={d} lead={lead} />}
          {(s as any).qr ? <AbsoluteFill><div style={{ position: "absolute", right: 70, bottom: 70, width: 300, padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 12px 34px rgba(0,0,0,0.55)" }}><Img src={staticFile("img/ckforone/qr.jpg")} style={{ width: 276, height: 276, display: "block" }} /></div></AbsoluteFill> : null}
        </Sequence>
      );
    })}
    <Grain />
  </AbsoluteFill>
);
