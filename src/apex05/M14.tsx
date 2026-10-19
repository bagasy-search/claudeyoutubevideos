// apex05 · MINUTO 14 (817,27–876,97 s) — las heridas que reconocen los médicos, perder un ojo, no poder trabajar; la madre lleva las crías en el lomo y tiene que pelear; los pueblos van en grupo, con palos y hablando fuerte; compensaciones; el oso también está en peligro.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, CaseCard, StrikeList, Letterbox } from "./comps";

export const OFF14 = 817.27, END14 = 876.97;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 817.27, b: 820.59, v: T + "a45_clinic", from: 1.0, out: { type: "cut" } },
  { a: 820.59, b: 823.67, img: F + "sloth_6ddeb164.jpg", k: "inj", grade: "brightness(.6) saturate(.6)", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 823.67, b: 826.13, v: T + "sloth_64daac40", from: 0.0, k: "inj", grade: "brightness(.6) saturate(.6)", out: { type: "cut" } },
  { a: 826.13, b: 828.6, v: R + "india_15312710", from: 1.0, out: { type: "cut" } },
  { a: 828.6, b: 831.25, v: R + "india_9343898", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 831.25, b: 833.6, v: T + "sloth_27975aa7", from: 0.0, out: { type: "cut" } },
  { a: 833.6, b: 836.27, v: T + "a51_sloth_cubs_ride", from: 1.0, out: { type: "cut" } },
  { a: 836.27, b: 838.8, v: T + "a06_sloth_cubs_back", from: 1.0, k: "tree", out: { type: "cut" } },
  { a: 838.8, b: 841.25, v: T + "sloth_adab9629", from: 0.0, k: "tree", out: { type: "flash" } },
  { a: 841.25, b: 842.6, img: F + "sloth_2dab5e73.jpg", cam: [1.1, 0.4, 0.5, 1.3, 0.4, 0.5], out: { type: "cut" } },
  { a: 842.6, b: 844.9, v: T + "sloth_b4ea299a", from: 0.0, out: { type: "cut" } },
  { a: 844.9, b: 847.45, img: F + "sloth_d44eedde.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 847.45, b: 850.7, v: T + "a09_village_dusk", from: 1.0, out: { type: "cut" } },
  { a: 850.7, b: 853.97, v: T + "a10_group_walk", from: 1.0, k: "grp", out: { type: "cut" } },
  { a: 853.97, b: 857.81, v: T + "a47_group_sticks", from: 1.0, k: "grp", out: { type: "cut" } },
  { a: 857.81, b: 860.4, v: T + "a46_forest_office", from: 1.0, k: "comp", out: { type: "cut" } },
  { a: 860.4, b: 863.0, v: R + "india_15312712", from: 1.0, k: "comp", out: { type: "cut" } },
  { a: 863.0, b: 866.03, img: F + "sloth_66738538.jpg", k: "comp", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 866.03, b: 868.89, img: F + "sloth_b5d79f9b.jpg", cam: [1.1, 0.5, 0.6, 1.35, 0.5, 0.6], out: { type: "cut" } },
  { a: 868.89, b: 870.6, v: R + "india_34661509", from: 1.0, out: { type: "cut" } },
  { a: 870.6, b: 872.39, img: F + "sloth_30f483cb.jpg", cam: [1.1, 0.5, 0.6, 1.35, 0.5, 0.65], out: { type: "flash" } },
  { a: 872.39, b: 874.6, v: T + "a52_sloth_face_close", from: 1.0, out: { type: "cut" } },
  { a: 874.6, b: 876.97, v: T + "sloth_c788da1d", from: 0.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF14, b: s.b - OFF14 }));

export const M14: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF14;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={817.5} b={820.5} text="Doctors in central India" sub="recognize the injuries" />
        {cur?.k === "inj" && <CaseCard t={ta} a={820.7} b={826.05} title="THE INJURIES" x={1060} y={150}
          rows={[{ at: 821.0, k: "SCALP", v: "deep wounds" }, { at: 821.8, k: "FACE", v: "deep wounds" }, { at: 822.6, k: "EYES", v: "deep wounds" }, { at: 824.1, k: "MANY", v: "lose an eye", red: true }]} />}
        <Place t={ta} a={826.3} b={831.15} text="Some can never work again" sub="where there is no other way to feed a family" />
        <Place t={ta} a={831.5} b={836.2} text="Unlike most bears" sub="the cubs ride on her back" />
        {cur?.k === "tree" && <StrikeList t={ta} b={841.2} y={330} size={96} items={[{ at: 836.6, text: "SEND THE CUBS UP A TREE", strike: 839.8 }]} />}
        <BigWord t={ta} a={841.3} b={842.55} text="SHE FIGHTS" red size={240} />
        <BigWord t={ta} a={842.8} b={847.3} text="SUDDEN · VIOLENT" size={190} />
        <Place t={ta} a={847.7} b={850.6} text="Some villages" sub="are trying a new approach" />
        {cur?.k === "grp" && <StrikeList t={ta} b={857.75} y={300} size={100} items={[{ at: 851.0, text: "WALK IN GROUPS" }, { at: 854.1, text: "CARRY STICKS" }, { at: 855.6, text: "TALK LOUDLY" }]} />}
        {cur?.k === "comp" && <CaseCard t={ta} a={858.0} b={865.95} title="COMPENSATION" x={1060} y={150}
          rows={[{ at: 858.4, k: "WHO PAYS", v: "forest departments" }, { at: 860.6, k: "TO", v: "victims and families" }, { at: 863.2, k: "SO THAT", v: "no revenge on the bears", red: true }]} />}
        <BigWord t={ta} a={866.2} b={868.8} text="IN TROUBLE TOO" size={210} />
        <Place t={ta} a={869.0} b={870.55} text="Its forest is shrinking" sub="" />
        <Stamp t={ta} a={870.7} b={872.3} text="VULNERABLE" size={150} />
        <BigWord t={ta} a={872.6} b={876.9} text="IT NEEDS PROTECTION" sub="the most dangerous bear in the world" size={170} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M14_FRAMES = Math.round((END14 - OFF14) * FPS);
