// apex02 · MINUTO 12 (697,44–774,58 s) — la cuarta cosa: la serpiente es de sangre fría y por la mañana es lenta; el pájaro
// ya está caliente (la hora del pájaro). Y el otro que aprendió lo mismo: el secretario africano, patadas de 15 ms. Tiempos ABSOLUTOS; OFF12.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter } from "./comps";
import { MorningCurves, TaleTape, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF12 = 697.44;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 697.44, b: 699.5, v: A + "r39_coldsnake", from: 1.0, grade: "url(#thermal)", out: { type: "cut" } },
  { a: 699.5, b: 701.56, v: A + "r39_coldsnake", from: 3.06, grade: "url(#thermal)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 701.56, b: 703.53, v: A + "r39_coldsnake", from: 5.5, out: { type: "cut" } },
  { a: 703.53, b: 705.5, v: A + "r39_coldsnake", from: 7.47, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 705.5, b: 707.42, v: P + "9010493", from: 8.0, out: { type: "cut" } },
  { a: 707.42, b: 709.34, v: P + "9010493", from: 9.92, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 709.34, b: 710.98, v: A + "r64_perch", from: 4.5, rate: 0.85, out: { type: "cut" } },
  { a: 710.98, b: 712.62, v: A + "r64_perch", from: 5.89, rate: 0.85, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 712.62, b: 715.25, v: P + "9010511", from: 10.0, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "curves", out: { type: "cut" } },
  { a: 715.25, b: 717.87, v: P + "9010511", from: 11.58, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "curves", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 717.87, b: 720.5, v: P + "9010511", from: 13.15, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "curves", out: { type: "flash" } },
  { a: 720.5, b: 722.62, v: A + "r66_run_dawn", from: 5.2, out: { type: "cut" } },
  { a: 722.62, b: 724.75, v: A + "r66_run_dawn", from: 7.32, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 724.75, b: 726.49, v: P + "7963035", from: 16.0, out: { type: "cut" } },
  { a: 726.49, b: 728.23, v: P + "7963035", from: 17.74, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
  { a: 728.23, b: 730.63, v: R + "d01", from: 1.0, out: { type: "cut" } },
  { a: 730.63, b: 733.03, v: R + "d01", from: 3.4, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 733.03, b: 735.54, v: R + "d01", from: 6.5, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 735.54, b: 738.05, v: R + "d01", from: 9.01, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 738.05, b: 740.07, v: A + "r33_secretary", from: 1.0, out: { type: "cut" } },
  { a: 740.07, b: 742.08, v: A + "r33_secretary", from: 3.02, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 742.08, b: 744.1, v: A + "r33_secretary", from: 5.03, out: { type: "cut" } },
  { a: 744.1, b: 746.29, v: R + "d02", from: 2.0, out: { type: "flash" } },
  { a: 746.29, b: 749.01, v: A + "r33_secretary", from: 7.1, rate: 0.43, grade: "blur(5px) brightness(.45)", k: "kick", out: { type: "cut" } },
  { a: 749.01, b: 751.73, v: A + "r33_secretary", from: 8.27, rate: 0.43, grade: "blur(5px) brightness(.45)", k: "kick", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 751.73, b: 754.45, v: A + "r33_secretary", from: 9.44, rate: 0.43, grade: "blur(5px) brightness(.45)", k: "kick", out: { type: "cut" } },
  { a: 754.45, b: 757.17, v: A + "r33_secretary", from: 10.61, rate: 0.43, grade: "blur(5px) brightness(.45)", k: "kick", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 757.17, b: 759.77, v: R + "d01", from: 14.0, cam: [1.1, 0.5, 0.6, 1.25, 0.5, 0.7], out: { type: "cut" } },
  { a: 759.77, b: 762.38, v: R + "d01", from: 16.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 762.38, b: 764.75, v: P + "3574265", from: 6.0, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "tape", out: { type: "cut" } },
  { a: 764.75, b: 767.11, v: P + "3574265", from: 7.42, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 767.11, b: 769.48, v: P + "3574265", from: 8.84, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "tape", out: { type: "cut" } },
  { a: 769.48, b: 771.84, v: P + "3574265", from: 10.26, rate: 0.6, grade: "blur(6px) brightness(.4)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 771.84, b: 774.58, v: A + "r53_clamp", from: 9.0, out: { type: "white", d: 0.3 } },
];
export const SHOTS12: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF12, b: s.b - OFF12 }));
export const M12_END = 774.58;
export const M12_FRAMES = Math.round((M12_END - OFF12) * FPS);

export const M12: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF12;
  const cur = SHOTS12.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS12.map((s, i) => <ShotLayer key={i} S={SHOTS12} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={697.7} b={701.4} text="COLD-BLOODED" />
        <Place t={ta} a={702.0} b={705.4} text="STIFF · SLOW" sub="on a cool morning" />
        <Place t={ta} a={705.8} b={709.2} text="IT NEEDS THE SUN FIRST" />
        <Place t={ta} a={709.6} b={712.5} text="THE BIRD DOESN'T WAIT" />
        {cur?.k === "curves" && <MorningCurves t={ta} a={712.7} b={720.4} gapAt={717.8} />}
        <Place t={ta} a={720.8} b={724.6} text="AWAKE AND FAST" sub="while the snake is still waking up" />
        <BigWord t={ta} a={725.6} b={728.1} text="A SLOW SNAKE IS BREAKFAST" hot />
        <Place t={ta} a={729.3} b={732.9} text="NOT THE ONLY ONE" />
        <Place t={ta} a={733.4} b={737.9} text="SECRETARY BIRD" sub="African grasslands · kills snakes with its feet" />
        <Place t={ta} a={738.4} b={743.9} text="OVER 1 M TALL" sub="it stomps on the head" />
        <Place t={ta} a={744.3} b={746.2} text="SCIENTISTS MEASURED THE KICKS" />
        {cur?.k === "kick" && <Counter t={ta} a={746.6} b={751.9} from={0} to={5} dur={1.6} digits={1} unit="× BODY WEIGHT" kicker="ONE KICK" x={420} y={330} />}
        {cur?.k === "kick" && <Counter t={ta} a={752.0} b={757.0} from={0} to={15} dur={0.8} digits={2} unit="MS" kicker="FOOT ON TARGET" x={420} y={330} hot />}
        {cur?.k === "kick" && <Place t={ta} a={754.9} b={757.0} text="10× FASTER THAN A BLINK" />}
        <Place t={ta} a={757.5} b={762.2} text="LONG LEGS · SCALED SHINS" />
        {cur?.k === "tape" && <TaleTape t={ta} a={762.5} b={771.7}
          left={{ name: "SECRETARY BIRD", rows: [{ at: 762.8, v: "LONG LEGS · KICKS" }, { at: 767.6, v: "AFRICA" }] }}
          right={{ name: "ROADRUNNER", rows: [{ at: 764.0, v: "BILL · FEATHERS · NERVE" }, { at: 768.3, v: "NORTH AMERICA" }] }} />}
        {cur?.k === "tape" && <BigWord t={ta} a={769.4} b={771.7} text="SAME IDEA" hot y={760} />}
        <BigWord t={ta} a={772.0} b={774.5} text="DON'T BE THERE · HIT FIRST" hot />
        {cur?.v === R + "d01" && <Dust t={ta} n={25} op={0.3} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
