// apex03 · MINUTO 12 (750,52–789,34 s) — las crías de ballena gris en California (embestidas y hundidas); un oso es mucho más chico:
// en el agua gana la orca casi siempre. ¿Y el oso? Su única chance es la geografía: agua baja, costa, témpano grueso. OFF12.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { HudsonMap } from "./HudsonMap";
import { R, P, A } from "./M1";

export const OFF12 = 750.52;
const L = (x: number) => x - OFF12;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 750.52, b: 752.89, v: A + "o54_graywhale_calf", from: 1.0, rate: 0.9, out: { type: "cut" } },
  { a: 752.89, b: 755.25, v: A + "o54_graywhale_calf", from: 3.13, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 755.25, b: 757.62, v: A + "o54_graywhale_calf", from: 5.26, rate: 0.9, out: { type: "cut" } },
  { a: 757.62, b: 760.01, v: A + "o36_ram", from: 7.5, rate: 0.9, out: { type: "cut" } },
  { a: 760.01, b: 762.4, v: A + "o36_ram", from: 9.65, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 762.4, b: 765.2, v: A + "o41_orca_eye", from: 5.5, out: { type: "cut" } },
  { a: 765.2, b: 768.0, v: A + "o41_orca_eye", from: 8.3, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
  { a: 768.0, b: 770.36, v: A + "o12_bear_sniff", from: 10.7, rate: 0.5, out: { type: "cut" } },
  { a: 770.36, b: 773.04, comp: "shore", out: { type: "cut" } },
  { a: 773.04, b: 775.72, comp: "shore", out: { type: "cut" } },
  { a: 775.72, b: 778.4, comp: "shore", out: { type: "flash" } },
  { a: 778.4, b: 780.47, v: A + "o37_shallow", from: 6.0, rate: 0.9, out: { type: "cut" } },
  { a: 780.47, b: 782.53, v: A + "o37_shallow", from: 7.86, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 782.53, b: 784.6, v: A + "o37_shallow", from: 9.72, rate: 0.9, out: { type: "cut" } },
  { a: 784.6, b: 786.97, v: A + "o59_bear_tiny", from: 1.0, out: { type: "cut" } },
  { a: 786.97, b: 789.34, v: A + "o59_bear_tiny", from: 3.37, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS12: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF12, b: s.b - OFF12 }));
export const M12_END = 789.34;
export const M12_FRAMES = Math.round((M12_END - OFF12) * FPS);

export const M12: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF12;
  const renderComp = (s: Shot) => {
    if (s.comp === "shore") return <HudsonMap t0={L(770.36)} keys={[
      { at: 0, pos: [-2, 24, 18], look: [-2, 0, 1], fov: 34 },
      { at: 8.0, pos: [-8, 12, 9], look: [-8, 0, 1], fov: 34 },
    ]} pins={[
      { at: 2.6, lon: -92.5, lat: 58.8, label: "SHALLOW · NEAR SHORE", sub: "orcas avoid it · risk of stranding", ring: true },
      { at: 6.0, lon: -86, lat: 60, label: "MID-BAY", sub: "kilometers from anything solid" },
    ]} />;
    return null;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS12.map((s, i) => <ShotLayer key={i} S={SHOTS12} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={750.8} b={757.4} text="CALIFORNIA · GRAY WHALE CALVES" sub="rammed in turns · held under until they drown" />
        <BigWord t={ta} a={757.9} b={762.2} text="A BEAR IS MANY TIMES SMALLER" />
        <BigWord t={ta} a={762.6} b={767.8} text="IN THE WATER · THE ORCA WINS" sub="almost certainly · every time" hot />
        <BigWord t={ta} a={768.1} b={770.2} text="COULD THE BEAR DO ANYTHING?" />
        <BigWord t={ta} a={770.5} b={772.6} text="GEOGRAPHY" hot y={300} />
        <Place t={ta} a={778.6} b={784.4} text="CLOSE TO SHORE · A BIG THICK FLOE" sub="probably safe" />
        <BigWord t={ta} a={785.0} b={789.1} text="MID-BAY · NOT SAFE" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
