// lkit · reproductor genérico de un video Loretta: edl.json → planos (fotos/clips/avatar/archivo/componentes) + pistas encima.
// edl = { end, shots: [{a, b, k, vid?, av?, z?, o?, tin?, tout?, c?, props?}], counts?: [{a, b, n}], of?, word?, hide?, overlays?: [{a, b, c, props}] }
// Uso en el entry del video:  setKit({ imgDir: "img/<slug>", av: AV.win, ... });  const Full = makePlayer(EDL);
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Plate, CompWrap, Grain, OV, fr, type Shot } from "./core";
import { LKIT, LKIT_OVERLAYS } from "./index";
import { ItemCounter } from "./items";

export type Edl = {
  end: number;
  shots: (Shot & { c?: string; props?: any })[];
  counts?: { a: number; b: number; n: number }[]; of?: number; word?: string; ofw?: string; look?: { font?: string; bg?: string; bd?: string; num?: string }; hide?: [number, number][];
  overlays?: { a: number; b: number; c: string; props?: any }[];
};

// extra = escenas HÉROE propias del video (src/<slug>/heroes.tsx): mismo contrato que un componente del kit ({a, d, ...props}); pisan al kit si se llaman igual.
export const makePlayer = (E: Edl, extra: Record<string, React.FC<any>> = {}): React.FC => () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {E.shots.map((s, i) => {
      const lead = s.tin && s.tin !== "cut" ? OV : 0;
      const tail = s.tout && s.tout !== "cut" ? OV : 0;
      const from = fr(s.a) - lead, d = fr(s.b) - fr(s.a);
      const K = s.c ? (extra[s.c] || LKIT[s.c]) : null;
      if (s.c && !K) throw new Error(`lkit: componente desconocido "${s.c}" en el plano ${i} (${s.a}s)`);
      return (
        <Sequence key={i} from={from} durationInFrames={d + lead + tail}>
          {K ? <CompWrap lead={lead} d={d} tout={s.tout}><K {...s.props} a={s.a} d={d} /></CompWrap> : <Plate s={s} d={d} lead={lead} />}
        </Sequence>
      );
    })}
    {(E.overlays || []).map((o, i) => {
      const K = extra[o.c] || LKIT_OVERLAYS[o.c];
      if (!K) throw new Error(`lkit: superposición desconocida "${o.c}"`);
      const d = fr(o.b) - fr(o.a);
      return <Sequence key={"o" + i} from={fr(o.a)} durationInFrames={d}><K {...o.props} a={o.a} d={d} /></Sequence>;
    })}
    {E.counts && E.counts.length ? <ItemCounter counts={E.counts} of={E.of || E.counts.length} word={E.word} hide={E.hide} ofw={E.ofw} look={E.look} /> : null}
    <Grain />
  </AbsoluteFill>
);
