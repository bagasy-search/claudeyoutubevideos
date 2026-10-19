// apex05 · MINUTO 12 (689,61–755,71 s) — #1 oso perezoso: India/Sri Lanka/Nepal, hocico pálido, termitas y aspiradora, no parece asesino (250 lb), las tres cosas: garras, sentidos (ve mal, si lo sorprenden ataca), vecinos (más de mil millones de personas en su bosque).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Counter, StrikeList, Gauge, RankCard, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF12 = 689.61, END12 = 755.71;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 689.61, b: 692.25, img: F + "sloth_cf7ead45.jpg", k: "rank", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.45], out: { type: "cut" } },
  { a: 692.25, b: 695.55, comp: "map", out: { type: "cut" } },
  { a: 695.55, b: 698.0, v: T + "sloth_864ac16c", from: 0.0, out: { type: "cut" } },
  { a: 698.0, b: 700.25, v: T + "sloth_2ef12cc2", from: 0.0, out: { type: "cut" } },
  { a: 700.25, b: 702.61, v: R + "india_31145805", from: 1.0, out: { type: "cut" } },
  { a: 702.61, b: 705.4, v: T + "a05_sloth_slurp", from: 1.0, out: { type: "cut" } },
  { a: 705.4, b: 708.67, img: F + "sloth_8f1b4db2.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.45, 0.5], out: { type: "cut" } },
  { a: 708.67, b: 711.73, v: T + "a43_sloth_termite_night", from: 1.0, out: { type: "flash" } },
  { a: 711.73, b: 713.75, img: F + "sloth_2c75b93d.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 713.75, b: 716.3, img: F + "sloth_e8c69b5c.jpg", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "cut" } },
  { a: 716.3, b: 718.71, v: R + "brown_37414242", from: 5.0, out: { type: "white", d: 0.3 } },
  { a: 718.71, b: 720.8, img: F + "sloth_cd926c06.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 720.8, b: 722.87, img: F + "sloth_7337dff7.jpg", cam: [1.05, 0.6, 0.5, 1.3, 0.62, 0.5], out: { type: "flash" } },
  { a: 722.87, b: 724.59, img: F + "sloth_dc2816b6.jpg", cam: [1.04, 0.3, 0.5, 1.16, 0.3, 0.5], out: { type: "cut" } },
  { a: 724.59, b: 727.4, v: T + "a42_sloth_climb", from: 1.0, out: { type: "cut" } },
  { a: 727.4, b: 730.39, v: R + "india_30650970", from: 1.0, out: { type: "flash" } },
  { a: 730.39, b: 732.85, v: T + "sloth_673f9e87", from: 0.0, out: { type: "cut" } },
  { a: 732.85, b: 735.4, img: F + "sloth_6ff073a2.jpg", k: "eyes", cam: [1.1, 0.5, 0.6, 1.5, 0.5, 0.62], out: { type: "cut" } },
  { a: 735.4, b: 737.85, v: T + "a40_sloth_sniff", from: 1.0, k: "eyes", out: { type: "cut" } },
  { a: 737.85, b: 740.2, img: F + "sloth_1a04625e.jpg", k: "surp", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 740.2, b: 741.97, img: F + "sloth_b1c297b7.jpg", k: "surp", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "flash" } },
  { a: 741.97, b: 743.21, v: T + "a41_sloth_stand_roar", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 743.21, b: 745.03, v: R + "india_3966731", from: 1.0, out: { type: "cut" } },
  { a: 745.03, b: 747.6, v: R + "india_29480508", from: 1.0, out: { type: "cut" } },
  { a: 747.6, b: 749.6, v: T + "a08_mahua", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 749.6, b: 751.4, v: R + "india_5320315", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 751.4, b: 753.11, v: T + "a07_firewood", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 753.11, b: 755.71, v: T + "sloth_fc568cf0", from: 0.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF12, b: s.b - OFF12 }));
const L = (x: number) => x - OFF12;

export const M12: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF12;
  const renderComp = (s: Shot) => {
    if (s.comp === "map") return <GeoMap m="in" t0={L(692.25)} ranges={[{ at: 0.1, color: "#ff8a5c", pts: [[75, 30], [80, 29], [88, 27], [90, 25], [87, 21], [83, 17], [80, 13], [77, 8.5], [75, 12], [73, 17], [72, 21], [74, 25]] }]} keys={[
      { at: 0, pos: [0, 74, 58], look: [0, 0, 0], fov: 34 },
      { at: 3.4, pos: [2, 58, 44], look: [2, 0, -2], fov: 34 },
    ]} pins={[{ at: 0.2, lon: 78, lat: 22, label: "INDIA", ring: false }, { at: 1.2, lon: 80.7, lat: 7.8, label: "SRI LANKA", ring: false }, { at: 2.2, lon: 84, lat: 28.3, label: "NEPAL", ring: false }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "rank" && <RankCard t={ta} a={689.7} b={692.2} n={1} name="SLOTH BEAR" latin="Melursus ursinus" danger={10} />}
        <Place t={ta} a={695.8} b={700.2} text="Shaggy, black" sub="a pale, almost comical snout" />
        <Place t={ta} a={700.4} b={702.55} text="Termites and ants" sub="most of what it eats" />
        <BigWord t={ta} a={702.8} b={708.6} text="A VACUUM CLEANER" sub="two front teeth missing on top" size={180} />
        <Counter t={ta} a={708.8} b={711.65} to={100} dur={1.0} digits={3} kicker="YOU CAN HEAR IT SLURPING FROM" unit="YARDS AWAY" center y={330} size={220} />
        <BigWord t={ta} a={711.9} b={713.7} text="NOT A KILLER?" size={210} />
        <Counter t={ta} a={713.9} b={716.25} to={250} dur={1.0} digits={3} kicker="A MALE · ABOUT" unit="POUNDS" center y={330} size={220} />
        <BigWord t={ta} a={716.4} b={718.65} text="MUCH LESS THAN A GRIZZLY" size={150} />
        <BigWord t={ta} a={718.9} b={722.8} text="THREE THINGS" sub="make it the most dangerous bear in the world" size={200} />
        <BigWord t={ta} a={722.95} b={724.55} text="1 · CLAWS" red size={220} />
        <Place t={ta} a={724.8} b={727.3} text="Curved · 3 inches long" sub="" />
        <Place t={ta} a={727.6} b={730.3} text="Termite mounds" sub="as hard as concrete" />
        <BigWord t={ta} a={730.5} b={732.8} text="2 · SENSES" red size={220} />
        {cur?.k === "eyes" && <Gauge t={ta} a={733.0} b={737.8} value={2} max={10} unit="EYESIGHT" caption="DOESN'T SEE YOU UNTIL YOU'RE CLOSE" x={480} />}
        {cur?.k === "surp" && <StrikeList t={ta} b={741.9} y={330} size={110} items={[{ at: 738.0, text: "SURPRISED?" }, { at: 739.4, text: "RUN AWAY", strike: 740.6 }]} />}
        <BigWord t={ta} a={742.0} b={743.15} text="IT ATTACKS" red size={230} />
        <BigWord t={ta} a={743.3} b={744.95} text="3 · NEIGHBORS" red size={210} />
        <Counter t={ta} a={745.1} b={747.5} to={1} dur={0.6} digits={1} kicker="INDIA · MORE THAN" unit="BILLION PEOPLE" center y={330} size={220} />
        {cur?.k === "list" && <StrikeList t={ta} b={753.05} y={280} size={96} items={[{ at: 747.8, text: "FIREWOOD" }, { at: 749.0, text: "FLOWERS" }, { at: 750.0, text: "FRUIT" }, { at: 751.0, text: "LEAVES" }]} />}
        <BigWord t={ta} a={753.3} b={755.65} text="EXACTLY WHERE THE BEARS ARE" size={140} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M12_FRAMES = Math.round((END12 - OFF12) * FPS);
