// oldtech01v2 · MINUTO 5 (259,50–342,30 s) — el hipocausto sube a los Alpes: Raetia/Noricum, Aguntum, Cambodunum, el limes, la villa de Plinio.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, k01, ease } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Maqueta } from "./Maqueta";
import { Hypo3D, Fase, HypoKey, X0, Z0 } from "./Hypo3D";
import { Place, ThermalDefs, Snow, HeatUp, Letterbox } from "./comps";
import { Carved } from "./comps2";
import { WaxTablet, PlanGrid } from "./comps3";

export const OFF5 = 259.5;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type S5 = Shot & { k?: string };
const ABS: S5[] = [
  { a: 259.5, b: 262.0, comp: "north", out: { type: "dissolve", d: 0.5 } },
  { a: 262.0, b: 264.6, v: T + "a01_legion", from: 0, out: { type: "whip", vx: 1 } },
  { a: 264.6, b: 268.14, v: T + "a01_legion", from: 7.5, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.45], out: { type: "white", d: 0.4 } },
  { a: 268.14, b: 271.4, comp: "aguntum", out: { type: "dissolve", d: 0.5 } },
  { a: 271.4, b: 274.4, img: F + "27c6eace.jpg", out: { type: "zoom", fx: 0.55, fy: 0.55 } },
  { a: 274.4, b: 278.0, img: F + "7a3e715b.jpg", grade: "blur(9px) brightness(.42)", cam: [1.12, 0.5, 0.5, 1.2, 0.5, 0.5], k: "plan", out: { type: "sweep", d: 0.5 } },
  { a: 278.0, b: 281.0, v: T + "a03_courtyard", from: 0, out: { type: "whip", vx: -1 } },
  { a: 281.0, b: 284.8, comp: "maq", out: { type: "sweep", d: 0.5 } },
  { a: 284.8, b: 288.6, v: T + "a03_courtyard", from: 5.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "zoom", fx: 0.5, fy: 0.7 } },
  { a: 288.6, b: 291.6, v: T + "h06_under", from: 0, out: { type: "flash" } },
  { a: 291.6, b: 295.16, v: T + "a04_walls", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 295.16, b: 297.8, v: T + "a05_pool", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 297.8, b: 301.0, comp: "pool", out: { type: "flash" } },
  { a: 301.0, b: 303.62, v: T + "a05_pool", from: 4.0, out: { type: "white", d: 0.4 } },
  { a: 303.62, b: 306.8, comp: "kempten", out: { type: "dissolve", d: 0.5 } },
  { a: 306.8, b: 309.84, img: F + "c0fd3651.jpg", out: { type: "whip", vx: 1 } },
  { a: 309.84, b: 313.64, img: F + "8813de2c.jpg", out: { type: "white", d: 0.4 } },
  { a: 313.64, b: 317.4, comp: "limes", out: { type: "dissolve", d: 0.5 } },
  { a: 317.4, b: 320.0, v: T + "a07_rhine", from: 0, out: { type: "whip", vx: -1 } },
  { a: 320.0, b: 322.36, v: T + "a07_rhine", from: 4.0, out: { type: "sweep", d: 0.5 } },
  { a: 322.36, b: 325.5, v: T + "a08_laurentum", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 325.5, b: 328.7, v: T + "a08_laurentum", from: 4.0, grade: "blur(8px) brightness(.5)", cam: [1.1, 0.5, 0.5, 1.16, 0.5, 0.5], k: "pliny", out: { type: "whip", vx: 1 } },
  { a: 328.7, b: 332.3, v: T + "a09_corridor", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.75 } },
  { a: 332.3, b: 334.98, comp: "corr", out: { type: "dissolve", d: 0.4 } },
  { a: 334.98, b: 338.8, v: T + "a09_corridor", from: 4.5, grade: "blur(9px) brightness(.42)", cam: [1.1, 0.5, 0.5, 1.16, 0.5, 0.5], k: "letter", out: { type: "sweep", d: 0.5 } },
  { a: 338.8, b: 342.3, v: T + "a09_corridor", from: 8.0, cam: [1.02, 0.5, 0.5, 1.14, 0.45, 0.55] },
];
export const SHOTS5: S5[] = ABS.map((s) => ({ ...s, a: s.a - OFF5, b: s.b - OFF5 }));
export const M5_FRAMES = Math.round((342.3 - OFF5) * FPS);

const LIMES: { n: string; ll: [number, number] }[] = [
  { n: "MOGONTIACUM", ll: [8.27, 50.0] }, { n: "SAALBURG", ll: [8.57, 50.27] }, { n: "CASTRA REGINA", ll: [12.1, 49.02] },
  { n: "VINDOBONA", ll: [16.37, 48.21] }, { n: "CARNUNTUM", ll: [16.86, 48.11] }, { n: "COLONIA", ll: [6.96, 50.94] },
];
type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });

export const M5: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF5;
  const L = (x: number) => x - OFF5;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "north": return <ClayMap t0={L(259.0)} keys={[
        { at: 0, pos: [4, 30, 30], look: [4, 0, 6], fov: 34 }, { at: 3.2, pos: [3.5, 24, 16], look: [3, 0, -2], fov: 34 },
      ]} pins={[{ at: 0.9, out: 3.4, lon: 10.9, lat: 47.6, label: "RAETIA", ring: false }, { at: 1.3, out: 3.4, lon: 14.3, lat: 47.4, label: "NORICUM", ring: false }]}
        routes={[{ at: 0.4, from: [12.48, 41.9], to: [11.0, 47.3], d: 1.1 }, { at: 0.7, from: [12.48, 41.9], to: [14.2, 47.2], d: 1.1 }]} />;
      case "aguntum": return <ClayMap t0={L(267.9)} keys={[
        { at: 0, pos: [5.6, 10, 10], look: [4.6, 0, -0.6], fov: 34 }, { at: 3.6, pos: [5.1, 3.0, 2.6], look: [4.6, 0.6, -0.6], fov: 34 },
      ]} pins={[{ at: 0.6, out: 3.4, lon: 12.82, lat: 46.84, label: "AGUNTUM", sub: "near Lienz, East Tyrol" }]} />;
      case "maq": return <Maqueta t0={L(280.8)} keys={[
        { at: 0, pos: [20 - 10, 15, -9 + 18], look: [20, 0, -9] }, { at: 4.2, pos: [20 - 5, 10, -9 + 13], look: [20, 0, -9] },
      ]} ring={{ at: 0.8, out: 3.9, x: 20, z: -9, label: "THE GREAT HOUSE", sub: "excavated by the University of Innsbruck" }} />;
      case "pool": return <Hypo3D t0={L(297.6)} keys={[K(0, [7, 3, 9], [0, 1.0, 0], 40), K(3.4, [5, 2.2, 7.5], [-0.5, 0.9, 0], 40)]}
        fase={() => base({ open: 0.9, gas: 1, glow: 0.8, room: 0.4 })}
        labels={[{ at: 0.5, out: 3.2, x: 2.5, y: 0.45, z: 3.2, text: "HOT AIR UNDER", side: "r" }, { at: 1.3, out: 3.2, x: 2.5, y: 2.3, z: 3.3, text: "AND AROUND", sub: "the pool set apart from the walls", side: "r" }]} title="AGUNTUM · THE BATHS" />;
      case "kempten": return <ClayMap t0={L(303.4)} keys={[
        { at: 0, pos: [2.5, 9, 9], look: [0.4, 0, -2.4], fov: 34 }, { at: 3.4, pos: [1.2, 3.2, 1.8], look: [-0.4, 0.6, -2.5], fov: 34 },
      ]} pins={[{ at: 0.5, out: 3.3, lon: 10.31, lat: 47.73, label: "CAMBODUNUM", sub: "today Kempten, Bavaria" }]} />;
      case "limes": return <ClayMap t0={L(313.4)} dark={() => 0.25} keys={[
        { at: 0, pos: [3, 24, 16], look: [3, 0, -4], fov: 34 }, { at: 4.0, pos: [5, 20, 12], look: [5, 0, -4.5], fov: 34 },
      ]} pins={LIMES.map((c, i) => ({ at: 0.4 + i * 0.3, out: 3.9, lon: c.ll[0], lat: c.ll[1], label: c.n, ring: false }))}
        routes={[{ at: 0.2, from: [4.5, 51.9], to: [8.3, 49.9], d: 1.2 }, { at: 0.8, from: [8.6, 49.5], to: [12.1, 49.0], d: 1.2 }, { at: 1.4, from: [12.1, 49.0], to: [18.0, 47.9], d: 1.4 }]} />;
      case "corr": return <Hypo3D t0={L(332.1)} keys={[K(0, [-1.4, 2.0, 3.6], [-3.0, 1.6, Z0], 46), K(3.0, [-0.6, 2.8, 4.4], [-3.0, 2.2, Z0], 46)]}
        fase={() => base({ gas: 1, glow: 0.7, flue: 1, room: 0.5 })}
        labels={[{ at: 0.4, out: 2.9, x: X0 + 1.0, y: 0.5, z: 2.4, text: "A HOLLOW FLOOR", side: "r" }, { at: 1.0, out: 2.9, x: X0 + 2.5, y: 2.6, z: Z0 + 0.1, text: "LINED WITH PIPES", side: "r" }]} />;
    }
    return null;
  };
  const cur = SHOTS5.find((s) => t >= s.a && t < s.b);
  const SNOWY = new Set([T + "a01_legion", T + "a03_courtyard"]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS5.map((s, i) => <ShotLayer key={i} S={SHOTS5} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && SNOWY.has(cur.v) && <Snow t={t} n={130} wind={0.7} />}
        <Place t={ta} a={264.8} b={268.0} text="REAL WINTERS" sub="and they brought the hypocaust with them" />
        {cur?.k === "plan" && <PlanGrid t={ta} a={274.5} b={277.95} area="2,500 m²" label="ITS LARGEST HOUSE" />}
        <Place t={ta} a={278.2} b={280.9} text="AROUND AD 50" />
        <Place t={ta} a={285.0} b={288.5} text="REBUILT FOR THE ALPS" />
        <Place t={ta} a={288.8} b={291.5} text="HEATING ADDED" />
        <Place t={ta} a={291.8} b={295.0} text="BIG ROOMS SPLIT" sub="smaller rooms stay warm" />
        <HeatUp t={ta} a={301.1} b={303.5} label="AIR ALL AROUND" />
        <Place t={ta} a={310.0} b={313.5} text="HEATED BATHS" />
        <Place t={ta} a={320.1} b={322.3} text="ARMY FORTS" sub="headquarters and commanders' houses" />
        <Place t={ta} a={322.5} b={325.4} text="LAURENTUM" sub="a seaside villa near Rome" />
        {cur?.k === "pliny" && <Carved t={ta} a={325.6} b={328.6} text="PLINY THE YOUNGER" sub="NEPHEW OF PLINY THE ELDER" />}
        {cur?.k === "letter" && <WaxTablet t={ta} a={335.05} b={338.75} papyrus author="PLINY THE YOUNGER" work="Letters, 2.17" dur={1.7}
          lines={["suspensus et tubulatus", "conceptum vaporem", "salubri temperamento", "huc illuc digerit"]} hot={["suspensus", "tubulatus", "salubri"]}
          en="raised and piped, it spreads the warm air with a healthy, measured warmth" />}
        <Place t={ta} a={339.0} b={342.2} text="HERE AND THERE" sub="as it was needed" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
