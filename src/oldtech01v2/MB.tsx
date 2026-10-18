// oldtech01v2 · BLOQUE B (408,84–522,34 s, línea de 20 min) — una máquina de piezas estándar: bessales, sesquipedales,
// bipedales a escala del pie romano, tubuli peinados, tegulae mammatae, los sellos de las legiones (XXII en el Rin, VIII en
// Estrasburgo), el ejército como vehículo y el hipocausto de canales.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Hypo3D, Fase, HypoKey, X0, PH } from "./Hypo3D";
import { Place, ThermalDefs, Embers, BigWord, Letterbox } from "./comps";
import { Term, Carved } from "./comps2";
import { BrickScale, ChannelPlan } from "./comps4";

export const OFFB = 408.835;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type SB = Shot & { k?: string };
const ABS: SB[] = [
  { a: 408.835, b: 412.8, v: T + "xb01_moulds", from: 0, rate: 0.95, out: { type: "dissolve", d: 0.4 } },
  { a: 412.8, b: 415.2, v: R + "r5092252", from: 0.5, rate: 1, cam: [1.05, 0.5, 0.5, 1.22, 0.5, 0.6], out: { type: "whip", vx: 1 } },
  { a: 415.2, b: 417.25, v: R + "r6447294", from: 2, rate: 1, out: { type: "white", d: 0.4 } },
  { a: 417.25, b: 422.6, img: F + "fa633617.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.62, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 422.6, b: 435.0, comp: "bricks", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 435.0, b: 438.4, v: R + "r12701356", from: 0.5, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 438.4, b: 441.55, v: R + "r12701356", from: 7, rate: 1, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "flash" } },
  { a: 441.55, b: 445.0, img: F + "2b2bf3ba.jpg", cam: [1.0, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "dissolve", d: 0.35 } },
  { a: 445.0, b: 450.65, img: F + "4a4d53a7.jpg", out: { type: "whip", vx: -1 } },
  { a: 450.65, b: 454.0, img: F + "b01b0d41.jpg", cam: [1.05, 0.5, 0.55, 1.22, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 454.0, b: 457.17, img: F + "557d7fdd.jpg", cam: [1.0, 0.5, 0.5, 1.18, 0.45, 0.5], out: { type: "sweep", d: 0.5 } },
  { a: 457.17, b: 461.55, v: R + "r3952417", from: 1, rate: 1, grade: "contrast(1.06) brightness(.8)", out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 461.55, b: 464.29, img: F + "acde433f.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 464.29, b: 467.4, img: F + "396a46d4.jpg", out: { type: "dissolve", d: 0.3 } },
  { a: 467.4, b: 469.05, img: F + "2a8fa1a4.jpg", out: { type: "white", d: 0.35 } },
  { a: 469.05, b: 471.0, comp: "rhine", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 471.0, b: 474.03, img: F + "0051278b.jpg", cam: [1.0, 0.5, 0.5, 1.16, 0.5, 0.52], k: "x22", out: { type: "whip", vx: 1 } },
  { a: 474.03, b: 476.0, comp: "argent", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 476.0, b: 479.45, img: F + "60a4c1d9.jpg", cam: [1.0, 0.5, 0.5, 1.18, 0.5, 0.48], k: "x8", out: { type: "dissolve", d: 0.4 } },
  { a: 479.45, b: 482.2, img: F + "b1bcbde5.jpg", cam: [1.1, 0.5, 0.55, 1.3, 0.5, 0.6], out: { type: "flash" } },
  { a: 482.2, b: 484.17, img: F + "47f9b55c.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.55, 0.5], out: { type: "whip", vx: -1 } },
  { a: 484.17, b: 487.77, v: R + "r8981772", from: 3, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 487.77, b: 491.5, v: R + "r12590287", from: 1, rate: 1, out: { type: "zoom", fx: 0.75, fy: 0.55 } },
  { a: 491.5, b: 494.93, comp: "furnace", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "white", d: 0.4 } },
  { a: 494.93, b: 497.79, img: F + "88dff62e.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 497.79, b: 507.75, comp: "channels", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 507.75, b: 511.5, v: R + "r10207167", from: 1, rate: 1, out: { type: "sweep", d: 0.5 } },
  { a: 511.5, b: 515.11, v: R + "r9115147", from: 2, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 515.11, b: 518.63, img: F + "63c45476.jpg", cam: [1.05, 0.5, 0.5, 1.22, 0.5, 0.6], out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 518.63, b: 522.335, comp: "below", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5] },
];
export const SHOTSB: SB[] = ABS.map((s) => ({ ...s, a: s.a - OFFB, b: s.b - OFFB }));
export const MB_FRAMES = Math.round((522.335 - OFFB) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });

export const MB: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFFB;
  const L = (x: number) => x - OFFB;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "bricks": return <BrickScale t={t} a={L(417.2)} b={L(435.1)} footAt={L(418.6)} bricks={[
        { at: L(423.4), la: "BESSALIS", ft: 2 / 3, frac: "⅔ FOOT", use: "THE PILLARS" },
        { at: L(428.4), la: "SESQUIPEDALIS", ft: 1.5, frac: "1½ FEET", use: "THE BASE" },
        { at: L(432.4), la: "BIPEDALIS", ft: 2, frac: "2 FEET", use: "THE BRIDGE" }]} />;
      case "rhine": return <ClayMap t0={L(468.8)} keys={[
        { at: 0, pos: [-4.5, 14, 2], look: [-4.46, 0, -7.0], fov: 34 }, { at: 2.4, pos: [-4.4, 4.6, -3.2], look: [-4.46, 0.6, -7.0], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.2, lon: 8.27, lat: 50.0, label: "THE RHINE", sub: "Mogontiacum · Legio XXII" }]} />;
      case "argent": return <ClayMap t0={L(473.8)} keys={[
        { at: 0, pos: [-5.5, 12, 4], look: [-5.5, 0, -4.16], fov: 34 }, { at: 2.2, pos: [-5.4, 4.4, -0.6], look: [-5.5, 0.6, -4.16], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.0, lon: 7.75, lat: 48.58, label: "ARGENTORATUM", sub: "Strasbourg · Legio VIII" }]} />;
      case "furnace": return <Hypo3D t0={L(491.3)} keys={[K(0, [-2, 2.2, 8], [X0 - 1, 0.8, 0], 40), K(3.4, [3, 3.2, 10], [-2, 1.0, 0], 40)]}
        fase={() => base({ open: 0.8, gas: 1, glow: 0.9, room: 0.5 })}
        labels={[{ at: 0.3, out: 3.2, x: X0 - 1.6, y: 1.2, z: 1.1, text: "A FURNACE", side: "r" }, { at: 1.3, out: 3.2, x: 0, y: PH + 0.4, z: 1.6, text: "A RAISED FLOOR", side: "r" }]} />;
      case "channels": return <ChannelPlan t={t} a={L(497.7)} b={L(507.85)} crossAt={L(498.3)} treeAt={L(503.6)} gasAt={L(505.6)} />;
      case "below": return <Hypo3D t0={L(518.4)} keys={[K(0, [9, 2.4, 10], [0, 0.8, 0], 40), K(3.8, [7.5, 3.6, 9], [0, 1.2, 0], 40)]}
        fase={() => base({ open: 0.85, gas: 1, glow: 0.9, room: 1 })}
        labels={[{ at: 0.2, out: 3.6, x: -1, y: 0.35, z: 3.2, text: "HOT GAS BELOW", side: "r" }, { at: 1.6, out: 3.6, x: 1, y: PH + 0.5, z: 2.4, text: "WARM STONE ABOVE", side: "r" }]} />;
    }
    return null;
  };
  const cur = SHOTSB.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTSB.map((s, i) => <ShotLayer key={i} S={SHOTSB} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v === T + "xb02_kiln" && <Embers t={t} n={60} />}
        <Place t={ta} a={409.1} b={412.7} text="NOT ONE CRAFTSMAN" />
        <BigWord t={ta} a={413.1} b={417.1} text="MADE BY THE THOUSAND" />
        <Place t={ta} a={435.3} b={441.4} text="THE SAME SIZES" sub="fired in kilns across the empire" />
        <Term t={ta} a={441.8} b={450.5} words={[{ la: "TUBULI", en: "SCORED SO THE PLASTER WOULD GRIP", at: 445.2 }]} y={150} />
        <Place t={ta} a={450.9} b={456.9} text="BEFORE THE TUBULI" sub="another trick" />
        <Term t={ta} a={457.4} b={461.4} words={[{ la: "TEGULAE MAMMATAE", en: "TILES WITH KNOBS · A GAP OF AIR", at: 458.6 }]} y={150} />
        <Place t={ta} a={461.8} b={464.2} text="RUN BY THE ARMY" />
        {cur?.k === "x22" && <Carved t={ta} a={471.1} b={473.95} text="LEG XXII PR" sub="TWENTY SECOND LEGION · STAMPED IN THE CLAY" />}
        {cur?.k === "x8" && <Carved t={ta} a={476.1} b={479.35} text="LEG VIII AUG" sub="A SMALL SIGNATURE" />}
        <Place t={ta} a={479.7} b={484.0} text="MILITARY SUPPLIES" sub="military hands" />
        <BigWord t={ta} a={484.4} b={487.6} text="THE ARMY CARRIED IT" />
        <Place t={ta} a={488.0} b={491.4} text="EVERY FORT · A BATH HOUSE" />
        <Place t={ta} a={495.1} b={497.7} text="A CHEAPER VERSION" />
        <Place t={ta} a={508.0} b={511.4} text="FEWER BRICKS · LESS FUEL" />
        <Place t={ta} a={511.7} b={515.0} text="COUNTRY VILLAS" sub="of the northern provinces" />
        <Place t={ta} a={515.3} b={518.5} text="PILLARS OR CHANNELS" sub="the same principle" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
