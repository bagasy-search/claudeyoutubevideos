// apex02 · MINUTO 15 (923,58–980,66 s) — vuelta al principio: amanecer, la cascabel fría bajo la jarilla, el pájaro cargando
// sol en la piedra, baja y camina hacia el arbusto; "sólo necesita que falle una vez" y el expediente se cierra. Tiempos ABSOLUTOS; OFF15.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, NoList, TempTag } from "./comps";
import { TaleTape, EndCard, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF15 = 923.58;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 923.58, b: 926.0, v: P + "13778952", from: 14.0, out: { type: "white", d: 0.4 } },
  { a: 926.0, b: 927.58, v: P + "17806511", from: 6.0, out: { type: "cut" } },
  { a: 927.58, b: 928.96, v: P + "1575764", from: 8.0, grade: "brightness(.65) saturate(.7)", k: "cold", out: { type: "cut" } },
  { a: 928.96, b: 931.21, v: A + "r59_coiled_cold", from: 1.0, rate: 0.8, out: { type: "cut" } },
  { a: 931.21, b: 933.47, v: A + "r59_coiled_cold", from: 2.8, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 933.47, b: 935.72, v: A + "r59_coiled_cold", from: 4.61, rate: 0.8, out: { type: "dissolve", d: 0.5 } },
  { a: 935.72, b: 938.11, v: A + "r60_sunrock", from: 0.5, out: { type: "cut" } },
  { a: 938.11, b: 940.5, v: A + "r60_sunrock", from: 2.89, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 940.5, b: 942.73, v: A + "r60_sunrock", from: 6.0, cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "cut" } },
  { a: 942.73, b: 944.96, v: A + "r60_sunrock", from: 8.23, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 944.96, b: 947.36, v: P + "9010511", from: 15.0, out: { type: "cut" } },
  { a: 947.36, b: 949.33, v: A + "r61_walk_to_bush", from: 0.5, out: { type: "cut" } },
  { a: 949.33, b: 951.3, v: A + "r61_walk_to_bush", from: 2.47, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 951.3, b: 953.29, v: A + "r61_walk_to_bush", from: 6.0, out: { type: "cut" } },
  { a: 953.29, b: 955.29, v: A + "r61_walk_to_bush", from: 7.99, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 955.29, b: 958.29, v: R + "c10", from: 8.0, grade: "blur(5px) brightness(.4)", k: "tape", out: { type: "cut" } },
  { a: 958.29, b: 961.29, v: R + "c10", from: 11.0, grade: "blur(5px) brightness(.4)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 961.29, b: 963.48, v: A + "r62_final_miss", from: 1.0, rate: 0.7, out: { type: "cut" } },
  { a: 963.48, b: 965.67, v: A + "r62_final_miss", from: 2.53, rate: 0.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 965.67, b: 968.07, v: A + "r62_final_miss", from: 6.5, out: { type: "cut" } },
  { a: 968.07, b: 970.46, v: A + "r62_final_miss", from: 8.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 970.46, b: 973.01, v: P + "9442581", from: 14.8, rate: 0.5, grade: "blur(8px) brightness(.3)", k: "end", out: { type: "cut" } },
  { a: 973.01, b: 975.56, v: P + "9442581", from: 16.07, rate: 0.5, grade: "blur(8px) brightness(.3)", k: "end", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 975.56, b: 978.11, v: P + "9442581", from: 17.35, rate: 0.5, grade: "blur(8px) brightness(.3)", k: "end", out: { type: "cut" } },
  { a: 978.11, b: 980.66, v: P + "9442581", from: 18.62, rate: 0.5, grade: "blur(8px) brightness(.3)", k: "end", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45] },
];
export const SHOTS15: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF15, b: s.b - OFF15 }));
export const M15_END = 980.66;
export const M15_FRAMES = Math.round((M15_END - OFF15) * FPS);

export const M15: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF15;
  const cur = SHOTS15.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS15.map((s, i) => <ShotLayer key={i} S={SHOTS15} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={923.8} b={925.9} text="BACK TO THE BEGINNING" />
        <Place t={ta} a={926.1} b={927.5} text="SONORAN DESERT" sub="dawn" />
        {cur?.k === "cold" && <TempTag t={ta} a={927.6} b={928.9} x={1250} y={380} kicker="GROUND" value={2} to={12} cold />}
        <Place t={ta} a={929.4} b={935.5} text="STILL COILED" sub="waiting for the sun" />
        <Place t={ta} a={936.2} b={944.8} text="BACK TO THE SUNRISE" sub="dark skin soaking up the light" />
        <BigWord t={ta} a={945.1} b={947.2} text="IT'S CHARGING" hot />
        <Place t={ta} a={948.0} b={955.1} text="HEAD LOW · TAIL OUT" sub="toward the creosote bush" />
        {cur?.k === "tape" && <TaleTape t={ta} a={955.4} b={961.2}
          left={{ name: "THE BIRD", rows: [{ at: 955.5, v: "NO ARMOR" }, { at: 956.4, v: "NO IMMUNITY" }, { at: 957.9, v: "UNDER 1 POUND" }] }}
          right={{ name: "THE SNAKE", rows: [{ at: 959.6, v: "OVER 1 METER" }] }} />}
        <BigWord t={ta} a={961.5} b={965.5} text="IT NEEDS IT TO MISS ONCE" />
        <BigWord t={ta} a={966.6} b={970.3} text="A COLD SNAKE USUALLY DOES" hot />
        {cur?.k === "end" && <Dust t={ta} n={40} op={0.4} />}
        {cur?.k === "end" && <EndCard t={ta} a={970.5} b={980.66} nextAt={974.3} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
void NoList;
