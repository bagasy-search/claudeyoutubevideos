// lcf11c · «STOP Cooking Chicken the OLD Way! 30 Genius Chicken Tricks». Plano a plano desde cues.json (D:/rtmp/lor_tools/cues_lor.py).
// Video mudo: la mezcla (voz + audio real de los clips, -14 LUFS) la hace la nube y encfin la mezcla al final. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import CUES from "./cues.json";
import * as P from "./piezas";
import { Escena } from "./escenas";
import { cl } from "./look";

const C = CUES as any;
export const TOTAL_LCF11C: number = C.TOTAL;
const SH: any[] = C.SHOTS;

const WEEK = SH.filter((s) => s.k === "S" && s.type === "week");
// foto para cada día de la semana: la del carrusel cuya receta nombra
const dayImg = (val: string) => {
  const v = val.toLowerCase();
  const it = (C.CAROUSEL as any[]).find((c) => v.includes(String(c.name).toLowerCase().split(" ")[0]));
  return it ? it.img : (C.CAROUSEL[0]?.img ?? null);
};
const DAYS = WEEK.map((w) => ({ val: w.val, img: dayImg(w.val) }));
const RECAP = new Set(SH.filter((s) => s.k === "K" && s.from > TOTAL_LCF11C * 0.85).map((s) => s.uid));

const Body: React.FC<{ s: any }> = ({ s }) => {
  switch (s.k) {
    case "A": return <P.Avatar s={s} />;
    case "Y": return <P.ClipY s={s} />;
    case "V": return <P.Veo s={s} />;
    case "G":
      if (s.scene) return <Escena name={s.scene.name} src={s.src} dur={s.dur / 30} marks={s.scene.marks} t0={s.scene.t0} />;
      return s.old ? <P.OldPhoto s={s} /> : <P.Photo s={s} />;
    case "K": return <P.RecipeCard s={s} c={C.CARDS[s.card]} recap={RECAP.has(s.uid)} />;
    case "B": return <P.Book s={s} />;
    case "Q": return <P.QR s={s} />;
    case "S":
      if (s.type === "bar") return s.n ? <P.Opener s={s} /> : <P.ChapterBar s={s} />;
      if (s.type === "dato") return <P.Dato s={s} />;
      if (s.type === "map") return <P.MapIowa s={s} />;
      if (s.type === "carousel") return <P.Wall30 s={s} items={C.CAROUSEL} />;
      if (s.type === "week") return <P.WeekDay s={s} idx={WEEK.indexOf(s)} days={DAYS} />;
      return null;
  }
  return null;
};

// barra de progreso: visible en los planos de receta que no son avatar ni piezas, con fundido corto
const ProgressLayer: React.FC = () => {
  const f = useCurrentFrame();
  const i = SH.findIndex((s) => f >= s.from && f < s.from + s.dur);
  const s = SH[i];
  if (!s || !s.recipe || !"YGV".includes(s.k) || s.scene) return null;
  // fundido sólo al entrar/salir de un tramo con barra
  let a = i; while (a > 0 && SH[a - 1].recipe && "YGV".includes(SH[a - 1].k) && !SH[a - 1].scene) a--;
  let b = i; while (b < SH.length - 1 && SH[b + 1].recipe && "YGV".includes(SH[b + 1].k) && !SH[b + 1].scene) b++;
  const f0 = SH[a].from, f1 = SH[b].from + SH[b].dur;
  const o = cl((f - f0) / 8) * cl((f1 - f) / 8);
  const [n, of, name] = s.recipe;
  return <P.Progress n={n} of={of} name={name} t={f / 30} o={o} />;
};

export const MainLcf11c: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SH.map((s) => (
      <Sequence key={s.uid} from={s.from} durationInFrames={s.dur} name={`${s.uid}·${s.k}`}>
        <Body s={s} />
      </Sequence>
    ))}
    <ProgressLayer />
  </AbsoluteFill>
);
