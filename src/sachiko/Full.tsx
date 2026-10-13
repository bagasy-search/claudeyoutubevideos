// Sachiko's Kitchen · el video entero a partir del EDL del video (src/<slug>/edl.json). Sin audio acá: la mezcla va aparte.
// Uso en src/<slug>/Full.tsx:  export const { Full, TOTAL_S } = makeFull(EDL, { ...MIS_COMPONENTES_NUEVOS });
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Plate, CompWrap, Grain, OV, fr, type Shot } from "./Base";
import { KIT } from "./Kit";
import { NEW } from "./New";
import { SAC } from "./Sac";
import { DIR } from "./Dir";

type S2 = Shot & { c?: string; props?: any };
export const ALL: Record<string, React.FC<any>> = { ...KIT, ...NEW, ...SAC, ...DIR };

export const makeFull = (EDL: any, extra: Record<string, React.FC<any>> = {}) => {
  const SH = EDL.shots as S2[];
  const REG = { ...ALL, ...extra };
  for (const s of SH) if (s.c && !REG[s.c]) throw new Error(`componente desconocido en el EDL: ${s.c}`);
  const Full: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SH.map((s, i) => {
        const lead = s.tin && s.tin !== "cut" ? OV : 0;
        const tail = s.tout && s.tout !== "cut" ? OV : 0;
        const from = fr(s.a) - lead, d = fr(s.b) - fr(s.a);
        const K = s.c ? REG[s.c] : null;
        return (
          <Sequence key={i} from={from} durationInFrames={d + lead + tail}>
            {K ? <CompWrap lead={lead} d={d} tout={s.tout}><K {...s.props} a={s.a} d={d} /></CompWrap> : <Plate s={s} d={d} lead={lead} />}
          </Sequence>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
  return { Full, TOTAL_S: EDL.end as number };
};
