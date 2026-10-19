// apex02 · MINUTO 13 (774,58–848,15 s) — la familia: parejas por años, el regalo del cortejo, el nido en el cactus, los dos
// padres, el menú de los pichones, 2 semanas y media al vuelo y el pichón que un día enfrenta a su primera serpiente. Tiempos ABSOLUTOS; OFF13.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter } from "./comps";
import { WordStack, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF13 = 774.58;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 774.58, b: 776.1, v: R + "c01", from: 4.0, out: { type: "cut" } },
  { a: 776.1, b: 777.62, v: R + "c01", from: 5.52, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 777.62, b: 780.39, v: A + "r24_nest", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 780.39, b: 783.25, v: A + "r23_court", from: 6.5, rate: 0.94, out: { type: "cut" } },
  { a: 783.25, b: 786.1, v: A + "r23_court", from: 9.19, rate: 0.94, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 786.1, b: 788.35, v: A + "r57_gift", from: 0.5, out: { type: "cut" } },
  { a: 788.35, b: 790.6, v: A + "r57_gift", from: 2.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 790.6, b: 792.69, v: A + "r57_gift", from: 5.0, out: { type: "cut" } },
  { a: 792.69, b: 794.79, v: A + "r57_gift", from: 7.09, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 794.79, b: 797.24, v: A + "r57_gift", from: 9.4, out: { type: "flash" } },
  { a: 797.24, b: 799.12, v: A + "r24_nest", from: 4.5, out: { type: "cut" } },
  { a: 799.12, b: 801.0, v: A + "r24_nest", from: 6.38, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 801.0, b: 802.85, v: P + "20709625", from: 6.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.55], out: { type: "cut" } },
  { a: 802.85, b: 804.7, v: P + "20709625", from: 7.85, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 804.7, b: 806.82, v: P + "1494252", from: 8.0, out: { type: "cut" } },
  { a: 806.82, b: 808.51, v: A + "r25_feed", from: 6.0, out: { type: "cut" } },
  { a: 808.51, b: 810.2, v: A + "r25_feed", from: 7.69, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 810.2, b: 812.08, v: P + "4357029", from: 6.0, out: { type: "cut" } },
  { a: 812.08, b: 813.96, v: P + "4357029", from: 7.88, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 813.96, b: 816.65, v: P + "5454070", from: 2.0, grade: "brightness(.6)", k: "menu", out: { type: "cut" } },
  { a: 816.65, b: 819.34, v: P + "5454070", from: 4.69, grade: "brightness(.6)", k: "menu", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 819.34, b: 821.05, v: A + "r26_young", from: 0.5, out: { type: "cut" } },
  { a: 821.05, b: 823.38, v: A + "r26_young", from: 2.5, grade: "brightness(.7)", k: "days", out: { type: "cut" } },
  { a: 823.38, b: 825.7, v: A + "r26_young", from: 4.83, grade: "brightness(.7)", k: "days", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 825.7, b: 828.56, v: A + "r26_young", from: 7.5, rate: 0.75, out: { type: "cut" } },
  { a: 828.56, b: 831.41, v: A + "r26_young", from: 9.64, rate: 0.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 831.41, b: 833.08, v: P + "855484", from: 8.0, out: { type: "cut" } },
  { a: 833.08, b: 834.75, v: P + "855484", from: 9.67, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 834.75, b: 836.79, v: P + "5862024", from: 8.0, grade: "brightness(.55)", k: "learn", out: { type: "cut" } },
  { a: 836.79, b: 838.82, v: P + "5862024", from: 10.04, grade: "brightness(.55)", k: "learn", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 838.82, b: 840.86, v: P + "5862024", from: 12.07, grade: "brightness(.55)", k: "learn", out: { type: "flash" } },
  { a: 840.86, b: 842.68, v: A + "r58_young_face", from: 1.0, out: { type: "cut" } },
  { a: 842.68, b: 844.5, v: A + "r58_young_face", from: 2.82, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 844.5, b: 846.33, v: A + "r58_young_face", from: 6.5, cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "cut" } },
  { a: 846.33, b: 848.15, v: A + "r58_young_face", from: 8.33, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
];
export const SHOTS13: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF13, b: s.b - OFF13 }));
export const M13_END = 848.15;
export const M13_FRAMES = Math.round((M13_END - OFF13) * FPS);

export const M13: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF13;
  const cur = SHOTS13.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS13.map((s, i) => <ShotLayer key={i} S={SHOTS13} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={774.9} b={777.5} text="NOT JUST A HUNTER" />
        <BigWord t={ta} a={777.9} b={780.3} text="FAMILY" />
        <Place t={ta} a={780.7} b={785.9} text="PAIRS FOR YEARS" sub="territory defended all year" />
        <Place t={ta} a={786.4} b={789.4} text="SPRING · A GIFT" />
        <Place t={ta} a={789.8} b={794.6} text="A DEAD LIZARD" sub="tail wag · a bow" />
        <BigWord t={ta} a={795.0} b={797.1} text="SHE ACCEPTS" hot />
        <Place t={ta} a={797.6} b={804.5} text="STICKS IN A CACTUS" sub="a few feet off the ground" />
        <BigWord t={ta} a={804.9} b={806.7} text="THORNS = DEFENSE" />
        <Place t={ta} a={807.1} b={810.0} text="BOTH PARENTS" sub="sit on the eggs · feed the chicks" />
        <BigWord t={ta} a={810.5} b={813.8} text="AND WHAT DO THEY FEED THEM?" />
        {cur?.k === "menu" && <WordStack t={ta} a={814.0} b={819.2} words={[{ at: 814.1, text: "INSECTS" }, { at: 815.6, text: "LIZARDS" }, { at: 816.6, text: "SMALL SNAKES", hot: true }]} x={120} y={240} size={120} />}
        <BigWord t={ta} a={819.5} b={821.0} text="THEY GROW FAST" />
        {cur?.k === "days" && <Counter t={ta} a={821.4} b={825.6} from={0} to={17} dur={1.6} digits={2} unit="DAYS" kicker="HATCHING → LEAVING THE NEST · ABOUT" x={160} y={330} />}
        <Place t={ta} a={826.0} b={831.2} text="HUNTING ON THEIR OWN" sub="full sprint" />
        <Place t={ta} a={831.7} b={834.6} text="NO CLASSROOM" />
        {cur?.k === "learn" && <WordStack t={ta} a={835.0} b={840.7} words={[{ at: 837.0, text: "SMALL PREY" }, { at: 838.4, text: "BIGGER" }, { at: 839.6, text: "FASTER", hot: true }]} x={120} y={240} size={120} />}
        <Place t={ta} a={841.2} b={844.4} text="A YOUNG BIRD · A YOUNG SNAKE" sub="a cold morning" />
        <BigWord t={ta} a={844.8} b={848.0} text="THE OLDEST FIGHT STARTS AGAIN" hot />
        {cur?.v === A + "r58_young_face" && <Dust t={ta} n={30} op={0.3} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
