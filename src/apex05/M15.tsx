// apex05 · MINUTO 15 (876,97–950,25 s) — el ranking final del 8 al 1, la lección (no son monstruos: el mismo lugar, el mismo momento), las cuatro reglas, el cierre y el CTA al próximo archivo.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, StrikeList, RankCard, BearLineup, Stamp, Letterbox } from "./comps";

export const OFF15 = 876.97, END15 = 950.25;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 876.97, b: 879.13, comp: "final", out: { type: "flash" } },
  { a: 879.13, b: 882.01, v: R + "panda_28838889", from: 1.0, k: "r8", out: { type: "cut" } },
  { a: 882.01, b: 884.63, v: T + "andean_09e48055", from: 0.0, k: "r7", out: { type: "cut" } },
  { a: 884.63, b: 886.95, img: F + "sun_4cd61b76.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], k: "r6", out: { type: "cut" } },
  { a: 886.95, b: 889.37, v: T + "polar_02e8ae25", from: 0.0, k: "r5", out: { type: "cut" } },
  { a: 889.37, b: 892.03, v: T + "black_3bbbe2d5", from: 0.0, k: "r4", out: { type: "cut" } },
  { a: 892.03, b: 894.21, v: T + "brown_020d2f89", from: 0.0, k: "r3", out: { type: "cut" } },
  { a: 894.21, b: 896.75, v: T + "moon_2b5a6ad0", from: 0.0, k: "r2", out: { type: "white", d: 0.3 } },
  { a: 896.75, b: 899.3, v: T + "a04_sloth_termite", from: 1.0, out: { type: "cut" } },
  { a: 899.3, b: 902.45, v: T + "sloth_3cda4f32", from: 0.0, k: "r1", out: { type: "flash" } },
  { a: 902.45, b: 904.6, v: T + "a38_bear_away", from: 1.0, out: { type: "cut" } },
  { a: 904.6, b: 906.6, img: F + "sloth_400d8ee8.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 906.6, b: 909.6, v: R + "leis_11022597", from: 1.0, out: { type: "cut" } },
  { a: 909.6, b: 912.7, img: F + "sloth_30db5df2.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 912.7, b: 915.69, v: R + "leis_26202661", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 915.69, b: 919.2, v: T + "a48_mahua_dawn", from: 1.0, out: { type: "cut" } },
  { a: 919.2, b: 921.3, v: R + "leis_7624697", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 921.3, b: 923.75, v: T + "brown_b5dd1c18", from: 0.0, k: "rules", out: { type: "cut" } },
  { a: 923.75, b: 926.13, v: T + "a34_food_locker", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 926.13, b: 929.57, v: T + "a33_bear_spray", from: 1.0, k: "rules", out: { type: "white", d: 0.3 } },
  { a: 929.57, b: 932.59, v: R + "polar_36924755", from: 1.0, out: { type: "cut" } },
  { a: 932.59, b: 934.75, v: R + "andean_15747549", from: 1.0, out: { type: "cut" } },
  { a: 934.75, b: 937.0, v: R + "leis_6454475", from: 1.0, out: { type: "cut" } },
  { a: 937.0, b: 939.6, comp: "change", out: { type: "flash" } },
  { a: 939.6, b: 942.8, v: R + "arctic_10366481", from: 1.0, out: { type: "cut" } },
  { a: 942.8, b: 946.3, img: F + "moon_065942d1.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 946.3, b: 950.25, comp: "end" },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF15, b: s.b - OFF15 }));

const RANKS: Record<string, [number, string, string, number]> = {
  r8: [8, "GIANT PANDA", "Ailuropoda melanoleuca", 1], r7: [7, "ANDEAN BEAR", "Tremarctos ornatus", 1], r6: [6, "SUN BEAR", "Helarctos malayanus", 2],
  r5: [5, "POLAR BEAR", "Ursus maritimus", 6], r4: [4, "AMERICAN BLACK BEAR", "Ursus americanus", 7], r3: [3, "BROWN BEAR", "Ursus arctos", 8],
  r2: [2, "ASIATIC BLACK BEAR", "Ursus thibetanus", 9], r1: [1, "SLOTH BEAR", "Melursus ursinus", 10],
};

export const M15: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF15;
  const renderComp = (s: Shot) => {
    if (s.comp === "final") return <>
      <Img src={staticFile(F + "sloth_62d2060f.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.3) blur(3px)" }} />
      <BearLineup t={ta} a={876.97} b={879.2} mv="back" showRank title="THE FINAL RANKING" />
    </>;
    if (s.comp === "change") return <>
      <Img src={staticFile(F + "sloth_68895dc4.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.3) blur(3px)" }} />
      <BearLineup t={ta} a={937.0} b={939.65} showRank set={[4, 3, 2, 1]} setAt={937.4} title="THE RANKINGS CHANGE" />
    </>;
    if (s.comp === "end") return <AbsoluteFill style={{ background: "#0b0b0b" }} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  const rk = cur?.k && RANKS[cur.k];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {rk && <RankCard t={ta} a={cur!.a + OFF15 + 0.05} b={cur!.b + OFF15 - 0.05} n={rk[0]} name={rk[1]} latin={rk[2]} danger={rk[3]} />}
        <Place t={ta} a={896.9} b={899.2} text="Small · shaggy" sub="it eats termites" />
        <BigWord t={ta} a={902.7} b={906.45} text="NOT MONSTERS" size={210} />
        <Place t={ta} a={906.8} b={909.5} text="A bear and a person" sub="" />
        <Place t={ta} a={909.8} b={912.6} text="The same place" sub="at the same moment" />
        <BigWord t={ta} a={912.9} b={915.6} text="NEITHER EXPECTED IT" size={170} />
        <BigWord t={ta} a={915.9} b={919.1} text="SIMPLE RULES" sub="save the most lives" size={210} />
        {cur?.k === "rules" && <StrikeList t={ta} b={929.5} y={240} size={78} items={[{ at: 919.4, text: "MAKE NOISE" }, { at: 921.5, text: "NEVER BETWEEN MOTHER AND CUBS" }, { at: 923.9, text: "LOCK FOOD AND GARBAGE AWAY" }, { at: 926.3, text: "GROUPS · BEAR SPRAY" }]} />}
        <BigWord t={ta} a={929.8} b={932.5} text="NOT HUNTING US" size={210} />
        <BigWord t={ta} a={932.7} b={934.7} text="AVOIDING US" size={220} />
        <Place t={ta} a={934.9} b={936.9} text="Walk into their world" sub="without thinking" />
        <Place t={ta} a={939.8} b={946.2} text="Next file" sub="the animals that still see humans as prey" />
        <Stamp t={ta} a={946.45} b={950.2} text="APEX FILES" sub="NEXT FILE →" rot={-4} size={150} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M15_FRAMES = Math.round((END15 - OFF15) * FPS);
