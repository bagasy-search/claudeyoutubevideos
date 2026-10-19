// apex04 · MINUTO 15 (877,89–954,26 s) — lo que no sale en las películas: quiénes mueren y qué los protege; no son monstruos; el caso sigue abierto + CTA.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, Counter, StrikeList, Routine, Crowd, CageBlueprint, CaseCard, Letterbox } from "./comps";

export const OFF15 = 877.89, END15 = 954.26;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 877.89, b: 881.29, v: T + "g47_washers", from: 1.0, out: { type: "cut" } },
  { a: 881.29, b: 883.5, v: R + "otros_38917552", from: 1.0, k: "who", out: { type: "cut" } },
  { a: 883.5, b: 885.82, v: R + "otros_35915843", from: 1.0, k: "who", out: { type: "cut" } },
  { a: 885.82, b: 887.5, img: F + "kivu_3f9ec661.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 887.5, b: 889.03, v: R + "anim_11968420", from: 1.0, out: { type: "cut" } },
  { a: 889.03, b: 891.96, v: R + "anim_854064", from: 1.0, k: "prot", out: { type: "cut" } },
  { a: 891.96, b: 893.27, v: R + "anim_5565709", from: 1.0, out: { type: "cut" } },
  { a: 893.27, b: 896.67, v: T + "g74_fence_wash", from: 1.0, out: { type: "cut" } },
  { a: 896.67, b: 898.5, v: R + "otros_3723680", from: 1.0, out: { type: "cut" } },
  { a: 898.5, b: 900.34, v: T + "g48_well_kids", from: 1.0, out: { type: "cut" } },
  { a: 900.34, b: 903.2, v: T + "g66_drink_wait", from: 1.0, k: "rout", out: { type: "cut" } },
  { a: 903.2, b: 905.98, v: T + "g75_washing_dawn", from: 1.0, k: "rout", out: { type: "flash" } },
  { a: 905.98, b: 907.93, v: T + "g76_croc_calm", from: 1.0, out: { type: "cut" } },
  { a: 907.93, b: 910.6, v: T + "g55_prehistoric", from: 1.0, k: "dino", out: { type: "cut" } },
  { a: 910.6, b: 913.0, v: T + "g77_fossil", from: 1.0, k: "dino", out: { type: "cut" } },
  { a: 913.0, b: 915.5, v: T + "g78_ancient_swamp", from: 1.0, k: "dino", out: { type: "cut" } },
  { a: 915.5, b: 918.15, v: T + "g24_antelope", from: 1.0, out: { type: "cut" } },
  { a: 918.15, b: 918.96, v: T + "g79_wait_eyes", from: 1.0, out: { type: "cut" } },
  { a: 918.96, b: 919.79, v: T + "g80_watch", from: 1.0, out: { type: "cut" } },
  { a: 919.79, b: 921.12, v: R + "anim_11707592", from: 1.0, out: { type: "cut" } },
  { a: 921.12, b: 923.43, v: T + "g81_strike2", from: 1.0, out: { type: "flash" } },
  { a: 923.43, b: 925.8, v: T + "g82_giant_glide", from: 1.0, out: { type: "cut" } },
  { a: 925.8, b: 928.08, v: T + "g83_giant_bank", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 928.08, b: 931.7, comp: "crowd", out: { type: "cut" } },
  { a: 931.7, b: 934.4, img: F + "ruzizi_180e75e3.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 934.4, b: 937.0, comp: "cage4", out: { type: "cut" } },
  { a: 937.0, b: 939.67, v: R + "anim_4441040", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 939.67, b: 942.0, v: T + "g70_night_river", from: 1.0, out: { type: "cut" } },
  { a: 942.0, b: 944.13, v: T + "g84_last_eyes", from: 1.0, out: { type: "cut" } },
  { a: 944.13, b: 946.93, img: F + "hills_acb8df17.jpg", k: "file", grade: "brightness(.7) saturate(.7)", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "flash" } },
  { a: 946.93, b: 949.6, v: R + "anim_5570168", from: 1.0, out: { type: "cut" } },
  { a: 949.6, b: 952.0, v: R + "anim_17842225", from: 1.0, out: { type: "cut" } },
  { a: 952.0, b: 954.26, v: T + "g86_final_dive", from: 1.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF15, b: s.b - OFF15 }));

export const M15: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF15;
  const renderComp = (s: Shot) => {
    if (s.comp === "crowd") return <><AbsoluteFill style={{ background: "#0d0d0d" }} /><Crowd t={ta} a={928.1} b={931.75} n={300} cols={30} keepAt={930.25} keep={60} label="MAYBE" keepLabel="MAYBE 60 · MAYBE FEWER" /></>;
    if (s.comp === "cage4") return <><Img src={staticFile(F + "hills_de6f4f1a.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.45) saturate(.6)", transform: `scale(${1.05 + 0.03 * (ta - 934.4)})` }} />
      <CageBlueprint t={ta} a={934.4} b={937.05} drawAt={934.3} dimAt={935.4} /></>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={878.1} b={881.2} text="NOT IN THE MOVIES" size={170} />
        {cur?.k === "who" && <StrikeList t={ta} b={885.75} y={330} size={96} items={[{ at: 881.4, text: "TOURISTS", strike: 882.6 }, { at: 883.6, text: "EXPLORERS", strike: 884.6 }]} />}
        <Place t={ta} a={886.0} b={888.95} text="Most victims" sub="people with no choice but to use the river" />
        {cur?.k === "prot" && <StrikeList t={ta} b={891.9} y={330} size={110} items={[{ at: 889.1, text: "A CAGE", strike: 889.8 }, { at: 890.3, text: "A RIFLE", strike: 890.9 }]} />}
        <BigWord t={ta} a={892.0} b={893.2} text="SIMPLE THINGS" size={190} />
        <Place t={ta} a={893.5} b={896.6} text="1 · Fences in the water" sub="where people wash" />
        <Place t={ta} a={896.8} b={900.25} text="2 · Wells" sub="so families never go to the river" />
        {cur?.k === "rout" && <Routine t={ta} a={900.5} b={905.9} hour={7} days={14} label="THE SPOT YOU VISIT EVERY DAY" />}
        <BigWord t={ta} a={906.1} b={907.85} text="NOT MONSTERS" size={200} />
        {cur?.k === "dino" && <Counter t={ta} a={908.1} b={915.4} to={200} dur={1.4} digits={3} kicker="A LINEAGE OF MORE THAN" unit="MILLION YEARS" center y={330} size={220} />}
        <Place t={ta} a={915.7} b={918.05} text="They do exactly" sub="what they evolved to do" />
        <BigWord t={ta} a={918.2} b={918.9} text="WAIT" size={240} />
        <BigWord t={ta} a={919.0} b={919.75} text="WATCH" size={240} />
        <BigWord t={ta} a={919.85} b={921.05} text="LEARN THE ROUTINE" size={170} />
        <BigWord t={ta} a={921.2} b={923.35} text="STRIKE" red size={260} />
        <BigWord t={ta} a={923.6} b={928.0} text="GUSTAVE WAS BETTER AT IT" sub="than any crocodile anyone had seen" size={140} />
        <Place t={ta} a={931.9} b={939.6} text="Two years of science" sub="a flooded cage · a missing goat" />
        <BigWord t={ta} a={939.8} b={944.05} text="NEVER CAUGHT" red size={200} />
        {cur?.k === "file" && <CaseCard t={ta} a={944.2} b={946.9} title="GUSTAVE · RUZIZI DELTA" x={1060} y={150}
          rows={[{ at: 944.4, k: "STATUS", v: "unknown" }, { at: 944.9, k: "CAPTURED", v: "never", red: true }]} stamp={{ at: 945.3, text: "OPEN" }} />}
        <Place t={ta} a={947.1} b={952.0} text="Next file" sub="the animals that still see humans as prey" />
        <BigWord t={ta} a={952.2} b={954.2} text="APEX FILES" size={200} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M15_FRAMES = Math.round((END15 - OFF15) * FPS);
