// oldtech01v2 · MINUTO 2 (72,68–137,2 s) — Orata, Baiae, balineae pensiles, el negocio y el nombre griego.
// Los tiempos se escriben ABSOLUTOS (segundos de la voz) y se pasan a locales con OFF: la composición arranca en 72,68.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, W, k01, easeOut, ease, interp } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { Hypo3D } from "./Hypo3D";
import { ClayMap } from "./ClayMap";
import { Place, ThermalDefs, Embers, Letterbox } from "./comps";
import { Carved, SourceCard, Term, Etym, DevFlow } from "./comps2";

export const OFF2 = 72.68;
const T = "oldtech01v2/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 72.68, b: 77.6, comp: "map3", out: { type: "sweep", d: 0.55 } },
  { a: 77.6, b: 79.7, v: T + "o06_villa", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 79.7, b: 83.08, v: T + "o06_villa", from: 3.2, grade: "blur(7px) brightness(.55) saturate(.9)", cam: [1.08, 0.5, 0.5, 1.14, 0.5, 0.5], k: "name", out: { type: "whip", vx: 1 } },
  { a: 83.08, b: 85.66, v: T + "o03_oysters", from: 0.5, out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 85.66, b: 91.18, v: T + "o02_oysterbeds", from: 0, cam: [1.0, 0.5, 0.5, 1.12, 0.6, 0.5], out: { type: "flash" } },
  { a: 91.18, b: 96.08, comp: "hypoTerm", out: { type: "whip", vy: -1 } },
  { a: 96.08, b: 99.88, v: T + "o04_hanging", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.7 } },
  { a: 99.88, b: 111.34, comp: "hypoBuild", out: { type: "flash" } },
  { a: 111.34, b: 115.38, v: T + "o05_gasflow", from: 0, out: { type: "whip", vx: -1 } },
  { a: 115.38, b: 118.6, v: T + "o06_villa", from: 7.0, out: { type: "sweep", d: 0.5 } },
  { a: 118.6, b: 121.6, v: T + "o07_greek", from: 0, out: { type: "whip", vx: 1 } },
  { a: 121.6, b: 128.66, v: T + "o01_naples", from: 0, rate: 0.625, grade: "blur(8px) brightness(.5)", cam: [1.1, 0.5, 0.5, 1.16, 0.5, 0.5], k: "dev", out: { type: "sweep", d: 0.5 } },
  { a: 128.66, b: 132.94, comp: "spread", out: { type: "flash" } },
  { a: 132.94, b: 137.16, comp: "etym" },
];
export const SHOTS2: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF2, b: s.b - OFF2 }));
export const M2_FRAMES = Math.round((137.16 - OFF2) * FPS);

const BAIAE: [number, number] = [14.07, 40.82];
const CITIES: { at: number; n: string; ll: [number, number] }[] = [
  { at: 129.0, n: "ROME", ll: [12.48, 41.9] }, { at: 129.4, n: "LUTETIA", ll: [2.35, 48.85] }, { at: 129.7, n: "CARNUNTUM", ll: [16.86, 48.11] },
  { at: 130.0, n: "BATH", ll: [-2.36, 51.38] }, { at: 130.3, n: "CAMBODUNUM", ll: [10.31, 47.73] }, { at: 130.6, n: "ITALICA", ll: [-6.04, 37.44] },
  { at: 130.9, n: "SAALBURG", ll: [8.57, 50.27] }, { at: 131.2, n: "BYZANTIUM", ll: [28.98, 41.01] }, { at: 131.5, n: "AGUNTUM", ll: [12.82, 46.84] },
];

// hipocausto "colgante": el piso flota (open=1) y se apoya sobre las pilae; después entra el gas. Tiempos locales al t0 del plano.
const keysTerm = [
  { at: 0, pos: [14, 9.5, 19] as [number, number, number], look: [-0.5, 4.2, 0] as [number, number, number], fov: 34 },
  { at: 5.2, pos: [8, 8.5, 21] as [number, number, number], look: [-0.5, 4.4, 0] as [number, number, number], fov: 34 },
];
const keysBuild = [
  { at: 0, pos: [9, 6.5, 15.5] as [number, number, number], look: [-0.5, 2.0, 0] as [number, number, number], fov: 38 },
  { at: 3.8, pos: [3.5, 3.0, 11.5] as [number, number, number], look: [-1.0, 1.0, 0] as [number, number, number], fov: 42 },
  { at: 7.4, pos: [-3.0, 0.55, 5.0] as [number, number, number], look: [-1.6, 0.42, 0] as [number, number, number], fov: 50 },
  { at: 11.6, pos: [-1.2, 1.0, 6.8] as [number, number, number], look: [-1.4, 0.6, 0] as [number, number, number], fov: 46 },
];

export const M2: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF2;
  const L = (x: number) => x - OFF2;
  const renderComp = (s: Shot) => {
    if (s.comp === "map3") return <ClayMap t0={L(72.4)} keys={[
      { at: 0, pos: [5.4, 5.0, 5.0], look: [4.6, 0.6, -0.6], fov: 34 },
      { at: 1.8, pos: [7.0, 22, 22], look: [6.5, 0, 8], fov: 34 },
      { at: 5.0, pos: [7.6, 6.5, 19.5], look: [7.1, 0.3, 11.4], fov: 34 },
    ]} pins={[{ at: 2.6, out: 5.4, lon: 14.25, lat: 40.85, label: "THE BAY OF NAPLES", sub: "warm, rich, crowded with villas" }]} />;
    if (s.comp === "hypoTerm") return <Hypo3D t0={L(90.98)} keys={keysTerm} fase={(u) => ({ open: 1, gas: 0, flue: 0, glow: 0.25, room: 0 })} />;
    if (s.comp === "hypoBuild") return <Hypo3D t0={L(99.6)} keys={keysBuild}
      fase={(u) => ({ open: 1 - ease(k01(u, 3.8, 5.6)), gas: k01(u, 8.0, 9.2), flue: 0, glow: 0.2 + 0.8 * k01(u, 8.4, 10.5), room: 0 })}
      labels={[
        { at: 0.5, out: 3.6, x: -2.2, y: 4.2, z: 3.0, text: "THE FLOOR", sub: "not on the ground", side: "r" },
        { at: 2.6, out: 5.6, x: 2.4, y: 3.0, z: 3.0, text: "IN THE AIR", side: "r" },
        { at: 4.0, out: 7.4, x: -2.15, y: 0.45, z: 3.3, text: "SHORT PILLARS", sub: "pilae, about 60 cm", side: "r" },
        { at: 5.9, out: 7.6, x: -0.9, y: 0.3, z: 3.3, text: "EMPTY SPACE", side: "r" },
        { at: 8.9, out: 11.6, x: -4.6, y: 0.45, z: 1.06, text: "HOT GASES", sub: "from the furnace", side: "r" },
      ]} title="BALINEAE PENSILES" titleAt={0.3} />;
    if (s.comp === "spread") return <ClayMap t0={L(128.36)} keys={[
      { at: 0, pos: [4, 46, 30], look: [4, 0, 2], fov: 34 },
      { at: 4.6, pos: [2, 54, 34], look: [2, 0, 2], fov: 34 },
    ]} pins={[{ at: 0.3, out: 4.9, lon: BAIAE[0], lat: BAIAE[1], label: "BAIAE", ring: true }, ...CITIES.map((c) => ({ at: L(c.at) - L(128.36) + 0.5, out: 4.9, lon: c.ll[0], lat: c.ll[1], label: c.n, ring: false }))]}
      routes={CITIES.map((c) => ({ at: L(c.at) - L(128.36), from: BAIAE, to: c.ll, d: 0.6 }))} />;
    if (s.comp === "etym") return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1408 0%, #0b0605 70%)" }}><Embers t={t} n={70} /></AbsoluteFill>;
    return null;
  };
  const cur = SHOTS2.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS2.map((s, i) => <ShotLayer key={i} S={SHOTS2} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={77.75} b={79.6} text="BAIAE" sub="around 95 BC" />
        <Carved t={ta} a={79.85} b={83.0} text="GAIUS SERGIUS ORATA" sub="BUSINESSMAN · OYSTER FARMER" />
        <SourceCard t={ta} a={86.0} b={91.0} author="PLINY THE ELDER" work="Natural History, book 9" latin="ostrearum vivaria primus omnium Sergius Orata invenit in Baiano" hi={[0, 17]} en="the first of all to make oyster beds, at Baiae" />
        <Term t={ta} a={91.4} b={96.0} words={[{ la: "BALINEAE", en: "BATHS", at: 94.2 }, { la: "PENSILES", en: "HANGING", at: 94.96 }]} y={150} />
        <Place t={ta} a={111.6} b={115.2} text="DID HE INVENT IT?" sub="historians still argue" />
        <Place t={ta} a={115.6} b={118.4} text="OR JUST SELL IT BETTER?" />
        <Place t={ta} a={118.8} b={121.4} text="GREEK BATHHOUSES" sub="heated floors, earlier" />
        {cur?.k === "dev" && <DevFlow t={ta} a={121.7} b={128.6} steps={[{ at: 123.84, ico: "villa", label: "BUY A VILLA" }, { at: 125.0, ico: "bath", label: "ADD HANGING BATHS" }, { at: 126.56, ico: "coin", label: "SELL", val: "+ PROFIT" }]} />}
        <Etym t={ta} a={133.1} b={137.1} join={135.02} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
