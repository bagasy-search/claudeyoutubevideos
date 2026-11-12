// ck11c · canal 242 (Loretta's Church Cookbook). Plano a plano desde cues.json (D:/rtmp/ck11c/tools/cues.py).
// Video mudo: la mezcla (voz + audio real de los clips, -14 LUFS) la hace la nube y encfin la mezcla al final. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import CUES from "./cues.json";
import * as P from "./piezas";
import { Escena } from "./escenas";
import { cl } from "./look";

const C = CUES as any;
export const TOTAL_CK11C: number = C.TOTAL;
const SH: any[] = C.SHOTS;
const SLUG = "ck11c";

const Body: React.FC<{ s: any }> = ({ s }) => {
  switch (s.k) {
    case "A": return <P.Avatar s={s} />;
    case "Y": return <P.ClipY s={s} />;
    case "V": return <P.Veo s={s} />;
    case "G":
      if (s.scene) return <Escena name={s.scene} s={s} />;
      return s.old ? <P.OldPhoto s={s} /> : <P.Photo s={s} />;
    case "C":
      if (s.comp === "card") return <P.TypedCard s={s} c={C.CARDS[s.card]} />;
      if (s.comp === "recap") return <P.RecapBoard s={s} rows={C.RECAP} n={s.n} of={s.of} />;
      if (s.comp === "book") return <P.Book s={s} slug={SLUG} />;
      return null;
    case "S":
      if (s.type === "carousel") return <P.CorkBoard s={s} items={C.DISHES} title="What to bring to the church supper" />;
      if (s.type === "scene") return <P.SignUp s={s} of={10} names={C.NAMES} />;
      if (s.type === "map") return <P.MapBulletin s={s} />;
      return null;
  }
  return null;
};

// tarjetitas de mesa «dish N of 10»: visibles en los planos Y/G/V de cada plato, con fundido al entrar y salir del tramo
const TentLayer: React.FC = () => {
  const f = useCurrentFrame();
  const i = SH.findIndex((s) => f >= s.from && f < s.from + s.dur);
  const s = SH[i];
  const ok = (x: any) => x && x.recipe && "YGV".includes(x.k) && !x.scene;
  if (!ok(s)) return null;
  let a = i; while (a > 0 && ok(SH[a - 1])) a--;
  let b = i; while (b < SH.length - 1 && ok(SH[b + 1])) b++;
  const o = cl((f - SH[a].from) / 8) * cl((SH[b].from + SH[b].dur - f) / 8);
  const [n, of, name] = s.recipe;
  return <P.TentCards n={n} of={of} name={name} o={o} />;
};

export const MainCk11c: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SH.map((s) => (
      <Sequence key={s.uid} from={s.from} durationInFrames={s.dur} name={`${s.uid}·${s.k}`}>
        <Body s={s} />
      </Sequence>
    ))}
    <TentLayer />
    {(C.DATOS as any[]).map((o, i) => (
      <Sequence key={"d" + i} from={o.from} durationInFrames={o.dur}><P.CrowdChart o={o} /></Sequence>
    ))}
  </AbsoluteFill>
);
