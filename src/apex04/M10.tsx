// apex04 · MINUTO 10 (558,45–629,23 s) — la jaula de acero, la cámara infrarroja, dos años de cebos, los lazos que atrapan a los equivocados.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Counter, CageBlueprint, CaseCard, Letterbox } from "./comps";

export const OFF10 = 558.45, END10 = 629.23;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 558.45, b: 561.0, v: R + "river_2858485", from: 1.0, out: { type: "cut" } },
  { a: 561.0, b: 563.5, v: R + "river_4610111", from: 1.0, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 563.5, b: 566.09, img: F + "croc_898d296c.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "sweep", d: 0.5 } },
  { a: 566.09, b: 570.0, comp: "cage2", out: { type: "white", d: 0.3 } },
  { a: 570.0, b: 572.21, v: R + "otros_10810474", from: 0.4, out: { type: "cut" } },
  { a: 572.21, b: 574.0, v: R + "otros_11396197", from: 1.0, out: { type: "cut" } },
  { a: 574.0, b: 575.25, v: R + "otros_3371462", from: 2.0, out: { type: "cut" } },
  { a: 575.25, b: 577.93, v: R + "otros_15556116", from: 1.0, out: { type: "flash" } },
  { a: 577.93, b: 580.4, v: T + "g27_ircam", from: 1.0, out: { type: "cut" } },
  { a: 580.4, b: 583.55, v: R + "otros_2512877", from: 2.0, out: { type: "sweep", d: 0.5 } },
  { a: 583.55, b: 587.09, comp: "cage3", out: { type: "cut" } },
  { a: 587.09, b: 589.2, v: T + "g28_door", from: 1.0, out: { type: "cut" } },
  { a: 589.2, b: 591.17, v: R + "otros_4183797", from: 1.0, out: { type: "flash" } },
  { a: 591.17, b: 593.45, v: R + "lake_27099701", from: 1.0, out: { type: "cut" } },
  { a: 593.45, b: 595.65, v: R + "otros_2894890", from: 1.0, out: { type: "cut" } },
  { a: 595.65, b: 596.73, v: T + "g29_goat_day", from: 1.0, out: { type: "cut" } },
  { a: 596.73, b: 597.89, v: R + "lake_2975760", from: 1.0, out: { type: "cut" } },
  { a: 597.89, b: 600.33, v: R + "otros_28777052", from: 1.0, grade: "brightness(1.5) contrast(1.05)", out: { type: "cut" } },
  { a: 600.33, b: 602.6, v: R + "anim_5159128", from: 1.0, out: { type: "cut" } },
  { a: 602.6, b: 605.27, v: R + "storm_2965291", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 605.27, b: 607.15, v: R + "river_5701471", from: 1.0, out: { type: "cut" } },
  { a: 607.15, b: 609.6, v: T + "g07_snare", from: 1.0, out: { type: "cut" } },
  { a: 609.6, b: 612.0, v: R + "river_6448017", from: 1.0, out: { type: "cut" } },
  { a: 612.0, b: 614.55, img: F + "ruzizi_e6feefe6.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "flash" } },
  { a: 614.55, b: 617.35, v: T + "g08_small_caught", from: 1.0, k: "snare", out: { type: "cut" } },
  { a: 617.35, b: 619.47, img: F + "croc_29f2676a.jpg", k: "snare", cam: [1.1, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 619.47, b: 622.2, img: F + "croc_03e95b6e.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 622.2, b: 625.17, v: T + "g42_mudslide", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 625.17, b: 627.2, v: R + "storm_1575720", from: 1.0, out: { type: "cut" } },
  { a: 627.2, b: 629.23, v: R + "storm_2657691", from: 1.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF10, b: s.b - OFF10 }));
const L = (x: number) => x - OFF10;

export const M10: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF10;
  const renderComp = (s: Shot) => {
    const bg = (src: string, a: number) => <Img src={staticFile(F + src)} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.45) saturate(.6)", transform: `scale(${1.05 + 0.03 * (ta - a)})` }} />;
    if (s.comp === "cage2") return <>{bg("ruzizi_ca638949.jpg", 566.09)}<CageBlueprint t={ta} a={566.09} b={570.05} drawAt={566.2} dimAt={567.6} /></>;
    if (s.comp === "cage3") return <>{bg("ruzizi_ce3be45a.jpg", 583.55)}<CageBlueprint t={ta} a={583.55} b={587.12} drawAt={583.4} camAt={583.7} baitAt={585.2} doorAt={586.4} /></>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={558.7} b={563.3} text="The plan" sub="move him where he can't hurt anyone" />
        <BigWord t={ta} a={563.7} b={566.0} text="AND STUDY HIM" size={170} />
        <BigWord t={ta} a={571.15} b={572.15} text="SO THEY BUILT ONE" size={150} />
        <Counter t={ta} a={575.4} b={577.85} to={2000} dur={1.0} digits={4} comma kicker="STEEL" unit="LB" center y={330} size={220} />
        <Place t={ta} a={578.1} b={583.4} text="A hidden infrared camera" sub="films in total darkness" />
        <BigWord t={ta} a={587.2} b={589.1} text="THE DOOR DROPS" red size={170} />
        <Counter t={ta} a={591.3} b={593.4} to={2} dur={0.5} digits={1} kicker="THEY TRIED FOR" unit="YEARS" center y={330} size={240} />
        <BigWord t={ta} a={598.0} b={600.25} text="NOTHING WENT IN" size={160} />
        <Place t={ta} a={600.5} b={605.1} text="Different baits" sub="no Gustave · no animal at all" />
        <Counter t={ta} a={607.3} b={614.45} to={3} dur={0.5} digits={1} kicker="ANOTHER METHOD" unit="GIANT SNARES" center y={300} size={220} />
        {cur?.k === "snare" && <CaseCard t={ta} a={614.7} b={619.4} title="SNARES · RESULTS" x={1060} y={150}
          rows={[{ at: 615.0, k: "DID THEY WORK", v: "yes" }, { at: 616.0, k: "CAUGHT", v: "smaller crocodiles" }, { at: 617.5, k: "GUSTAVE", v: "never", red: true }]} stamp={{ at: 618.0, text: "WRONG CROC" }} />}
        <Place t={ta} a={619.7} b={625.0} text="Smaller ones kept walking in" sub="the giant stayed just out of reach" />
        <Place t={ta} a={625.4} b={629.1} text="And the war" sub="was still going on" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M10_FRAMES = Math.round((END10 - OFF10) * FPS);
