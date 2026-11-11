// swl11c · «Poor Man's Sunday Dinner for One — The Old Church Way, Under $3» (370 Supper with Loretta). Plano a plano desde cues.json (D:/rtmp/swl11c/tools/cues.py).
// Video mudo: la mezcla (voz + audio real de los clips, -14 LUFS) la hace la nube y encfin la mezcla al final. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import CUES from "./cues.json";
import * as P from "./piezas";
import { Escena } from "./escenas";
import { cl } from "./look";

const C = CUES as any;
export const TOTAL_SWL11C: number = C.TOTAL;
const SH: any[] = C.SHOTS;
const SLUG = "swl11c", LABEL = "Supper for One";

const Body: React.FC<{ s: any }> = ({ s }) => {
  switch (s.k) {
    case "A": return <P.Avatar s={s} />;
    case "Y": return <P.ClipY s={s} />;
    case "V": return <P.Veo s={s} />;
    case "G":
      if (s.scene) return <Escena name={s.scene} s={s} />;
      return s.old ? <P.OldPhoto s={s} /> : <P.Photo s={s} />;
    case "C":
      if (s.comp === "card") return <P.LedgerCard s={s} c={C.CARDS[s.card]} />;
      if (s.comp === "recap") return <P.RecapLedger s={s} rows={C.ROWS} n={s.n} of={s.of} />;
      if (s.comp === "book") return <P.Book s={s} slug={SLUG} label={LABEL} />;
      return null;
    case "S":
      if (s.type === "carousel") return <P.DinnerStrip s={s} items={C.DISHES} title="Sunday dinner for one · and the week after" />;
      if (s.type === "scene") return <P.IndexTab s={s} of={C.DISHES.length} />;
      if (s.type === "map") return <P.MapInk s={s} />;
      return null;
  }
  return null;
};

const PennyLayer: React.FC = () => {
  const f = useCurrentFrame();
  const i = SH.findIndex((s) => f >= s.from && f < s.from + s.dur);
  const s = SH[i];
  const ok = (x: any) => x && x.recipe && "YGV".includes(x.k) && !x.scene;
  if (!ok(s)) return null;
  let a = i; while (a > 0 && ok(SH[a - 1])) a--;
  let b = i; while (b < SH.length - 1 && ok(SH[b + 1])) b++;
  const o = cl((f - SH[a].from) / 8) * cl((SH[b].from + SH[b].dur - f) / 8);
  const [n, of, name] = s.recipe;
  return <P.Pennies n={n} of={of} name={name} o={o} />;
};

export const MainSwl11c: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SH.map((s) => (
      <Sequence key={s.uid} from={s.from} durationInFrames={s.dur} name={`${s.uid}·${s.k}`}>
        <Body s={s} />
      </Sequence>
    ))}
    <PennyLayer />
    {(C.DATOS as any[]).map((o, i) => (
      <Sequence key={"d" + i} from={o.from} durationInFrames={o.dur}><P.Clipping o={o} /></Sequence>
    ))}
  </AbsoluteFill>
);
