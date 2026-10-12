// cksalads · cierre: tarjeta de resumen (las 7 ensaladas y sus paginas) en 1049-1089 s, y la CTA del libro en 322-343 s (CtaCard).
import React from "react";
import { AbsoluteFill } from "remotion";
import { HAND, LABEL, SERIF, fr, cl, img, C, Grade, Grain, Bed, sp, Chip } from "./Base";

import { useCurrentFrame } from "remotion";
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const ROWS = [
  ["7", "Copper Pennies", "p. 27", "undercook the carrots by a minute"],
  ["6", "Three-Bean Salad", "p. 22", "pour the dressing on warm"],
  ["5", "Frog Eye Salad", "p. 26", "cook the little custard, overnight"],
  ["4", "Green Pistachio Fluff", "p. 23", "don't drain the pineapple"],
  ["3", "Seven-Layer Salad", "p. 25", "frost the mayonnaise to the glass"],
  ["2", "Church Basement Macaroni", "p. 24", "save a third of the dressing"],
  ["1", "Strawberry Pretzel Salad", "p. 21", "seal the cream to the sides"],
];
export const RecapCard: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k="n_church_table_supper" f={f} T={d} dim={0.6} />
      <div style={{ position: "absolute", left: 140, top: 90, opacity: cl(sp(f, 0, 13, 150) * 1.4) }}>
        <Chip txt="THE SEVEN, COUNTING DOWN" size={50} bg="#FFFDF4" color={C.ink} rot={-1} />
      </div>
      {ROWS.map((r, i) => {
        const u = sp(f, at(a + 1.5 + i * 4.8), 13, 150);
        return (
          <div key={i} style={{ position: "absolute", left: 140, right: 140, top: 230 + i * 110, display: "flex", alignItems: "baseline", gap: 30,
            opacity: cl(u * 1.6), transform: `translateX(${(1 - u) * -60}px)`, fontFamily: SERIF, color: C.porc, textShadow: "0 6px 26px rgba(0,0,0,0.65)" }}>
            <div style={{ fontWeight: 900, fontSize: 84, width: 110 }}>{r[0]}</div>
            <div style={{ fontWeight: 800, fontSize: 60, width: 780 }}>{r[1]}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, width: 170, color: "#F2C94C" }}>{r[2]}</div>
            <div style={{ fontFamily: HAND, fontSize: 48, opacity: 0.95 }}>{r[3]}</div>
          </div>
        );
      })}
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};
