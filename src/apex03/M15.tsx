// apex03 · MINUTO 15 (906,66–960,99 s) — vuelta al principio: Hudson a fines del verano, el oso nadando chiquito en el mar gris,
// tal vez haya hielo adelante, las aletas detrás; en el hielo reina el oso, en el agua la orca; el veredicto y el cierre (caso 04: el cocodrilo). OFF15.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { CaseFile, EndCard } from "./compsA";
import { HudsonMap } from "./HudsonMap";
import { R, P, A } from "./M1";

export const OFF15 = 906.66;
const L = (x: number) => x - OFF15;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 906.66, b: 909.66, comp: "hb", out: { type: "dissolve", d: 0.4 } },
  { a: 909.66, b: 912.45, v: A + "o59_bear_tiny", from: 6.0, out: { type: "cut" } },
  { a: 912.45, b: 915.24, v: A + "o59_bear_tiny", from: 8.79, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 915.24, b: 916.91, v: P + "8318615", from: 6.0, out: { type: "cut" } },
  { a: 916.91, b: 918.58, v: P + "8318615", from: 7.67, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 918.58, b: 919.74, v: P + "2498966", from: 10.0, out: { type: "cut" } },
  { a: 919.74, b: 922.74, v: A + "o60_fins_far_bear", from: 1.0, out: { type: "cut" } },
  { a: 922.74, b: 924.71, v: R + "e01", from: 34.0, out: { type: "cut" } },
  { a: 924.71, b: 926.68, v: R + "e01", from: 35.97, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 926.68, b: 929.26, v: R + "e05", from: 55.0, out: { type: "cut" } },
  { a: 929.26, b: 931.46, v: R + "e01", from: 37.95, rate: 0.9, out: { type: "white", d: 0.3 } },
  { a: 931.46, b: 933.73, v: P + "6887983", from: 8.0, out: { type: "cut" } },
  { a: 933.73, b: 936.0, v: P + "6887983", from: 10.27, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 936.0, b: 938.4, v: P + "36265495", from: 2.0, grade: "blur(3px) brightness(.4)", k: "file", out: { type: "cut" } },
  { a: 938.4, b: 940.8, v: P + "36265495", from: 4.4, grade: "blur(3px) brightness(.4)", k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 940.8, b: 943.2, v: P + "36265495", from: 6.8, grade: "blur(3px) brightness(.4)", k: "file", out: { type: "cut" } },
  { a: 943.2, b: 945.32, v: P + "6744924", from: 9.0, grade: "blur(3px) brightness(.4)", k: "file", out: { type: "cut" } },
  { a: 945.32, b: 947.43, v: P + "6744924", from: 11.12, grade: "blur(3px) brightness(.4)", k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 947.43, b: 949.55, v: P + "6744924", from: 13.23, grade: "blur(3px) brightness(.4)", k: "file", out: { type: "flash" } },
  { a: 949.55, b: 952.41, v: P + "8016865", from: 2.0, rate: 0.42, grade: "blur(8px) brightness(.3)", k: "end", out: { type: "cut" } },
  { a: 952.41, b: 955.27, v: P + "8016865", from: 3.2, rate: 0.42, grade: "blur(8px) brightness(.3)", k: "end", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 955.27, b: 958.13, v: P + "8016865", from: 4.4, rate: 0.42, grade: "blur(8px) brightness(.3)", k: "end", out: { type: "cut" } },
  { a: 958.13, b: 960.99, v: P + "8016865", from: 5.6, rate: 0.42, grade: "blur(8px) brightness(.3)", k: "end", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45] },
];
export const SHOTS15: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF15, b: s.b - OFF15 }));
export const M15_END = 960.99;
export const M15_FRAMES = Math.round((M15_END - OFF15) * FPS);

export const M15: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF15;
  const renderComp = (s: Shot) => {
    if (s.comp === "hb") return <HudsonMap t0={L(906.66)} keys={[
      { at: 0, pos: [-4, 18, 14], look: [-4, 0, 2], fov: 34 },
      { at: 3.0, pos: [0, 30, 22], look: [0, 0, 1], fov: 34 },
    ]} pins={[{ at: 0.3, lon: -86, lat: 59.5, label: "HUDSON BAY", sub: "late summer", ring: true }]} />;
    return null;
  };
  const cur = SHOTS15.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS15.map((s, i) => <ShotLayer key={i} S={SHOTS15} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={909.9} b={915.0} text="HOURS IN THE WATER" sub="a small white shape on a huge grey sea" />
        <Place t={ta} a={915.5} b={918.4} text="SOMEWHERE AHEAD · MAYBE · ICE" />
        <BigWord t={ta} a={918.6} b={919.7} text="MAYBE NOT" />
        <Place t={ta} a={920.0} b={922.6} text="BEHIND IT · THE FINS" />
        <Place t={ta} a={923.0} b={926.5} text="HUNTING SEALS?" sub="maybe they haven't noticed the bear at all" />
        <BigWord t={ta} a={926.8} b={929.1} text="ON THE ICE · THE BEAR IS KING" />
        <BigWord t={ta} a={929.3} b={931.4} text="IN THE WATER · THE ORCA" hot />
        <Place t={ta} a={931.7} b={935.8} text="THE ICE DECIDES" sub="where one kingdom ends and the other begins" />
        {cur?.k === "file" && <CaseFile t={ta} a={936.1} b={949.4} num="03" name="VERDICT" latin="ocean's top killer vs land's top killer"
          rows={[{ at: 941.4, k: "THE FIGHT", v: "ORCA", hot: true }, { at: 943.4, k: "A FIGHT AT ALL?", v: "THE ICE DECIDES" }, { at: 946.6, k: "THE ICE TODAY", v: "ON THE ORCA'S SIDE", hot: true }]} />}
        {cur?.k === "end" && <EndCard t={ta} a={949.6} b={960.99} nextAt={953.4} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
