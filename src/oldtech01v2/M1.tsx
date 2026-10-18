// oldtech01v2 · MINUTO 1 (0–72,7 s) — v2 (18-oct): recorrido continuo mapa de arcilla → maqueta → clips → hipocausto → maqueta → Roma.
// Cada unión está pensada a mano para que no se vea el corte (lavado a blanco, fundido arcilla↔arcilla, barrido de luz, zoom a través, portal).
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, k01, easeOut, interp } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { Hypo3D } from "./Hypo3D";
import { ClayMap } from "./ClayMap";
import { Maqueta, BATH } from "./Maqueta";
import { BigWord, Place, Counter, ThermalDefs, Readout, Snow, Embers, TempSplit, TempTag, Thermostat, YearRoll, HeatUp, Letterbox, NoList, StrikeRing } from "./comps";
import { FrostCreep, IceEtch, EmberForm } from "./comps3";
import { OffthreadVideo, Sequence } from "remotion";
import { W as WW, H as HH } from "./lib";

const T = "oldtech01v2/t2v/", E = "oldtech01v2/estilos/";
type S2 = Shot & { k?: string };
export const SHOTS: S2[] = [
  { a: 0, b: 1.3, v: T + "h01_avalanche", from: 2.0, out: { type: "white", d: 0.4 } },
  { a: 1.3, b: 3.62, comp: "map1", out: { type: "dissolve", d: 0.5 } },
  { a: 3.62, b: 4.75, comp: "maq1", out: { type: "sweep", d: 0.5 } },
  { a: 4.75, b: 5.56, v: T + "h02_iceriver", from: 0.7, out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 5.56, b: 7.47, v: T + "h03_roofs", from: 0, out: { type: "whip", vx: 1 } },
  { a: 7.47, b: 12.34, v: T + "tst_alps_storm", from: 0, cam: [1.02, 0.5, 0.5, 1.1, 0.55, 0.6], out: { type: "zoom", fx: 0.62, fy: 0.72 } },
  { a: 12.34, b: 14.64, v: T + "h04_door", from: 0, rate: 0.625, out: { type: "white", d: 0.36 } },
  { a: 14.64, b: 17.24, v: T + "h05_mosaic", from: 0, thermal: 15.5, out: { type: "whip", vx: 1 } },
  { a: 17.24, b: 19.58, v: T + "h04_door", from: 5.2, out: { type: "flash" } },
  { a: 19.58, b: 24.92, v: T + "h05_mosaic", from: 4.0, cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.62], out: { type: "zoom", fx: 0.5, fy: 0.92 } },
  { a: 24.92, b: 31.82, comp: "hypo", out: { type: "shrink", fx: 0.5, fy: 0.5, r: 0.3, d: 0.9 } },
  { a: 31.82, b: 34.21, comp: "maq2", out: { type: "sweep", d: 0.55 } },
  { a: 34.21, b: 35.57, v: T + "h08_rome", from: 0, out: { type: "whip", vx: -1 } },
  { a: 35.57, b: 38.13, v: E + "e4_mapa_figuras", from: 2.5, out: { type: "flash" } },
  { a: 38.13, b: 39.75, v: T + "h13_stoker", from: 3.4, out: { type: "whip", vx: 1 } },
  { a: 39.75, b: 41.3, v: T + "h07_furnace", from: 0.8, out: { type: "zoom", fx: 0.5, fy: 0.62 } },
  { a: 41.3, b: 44.33, v: T + "h06_under", from: 7.2, out: { type: "flash" } },
  { a: 44.33, b: 47.49, comp: "split22", out: { type: "whip", vx: -1 } },
  { a: 47.49, b: 50.65, v: T + "f10_modern", from: 0, k: "thermo", out: { type: "sweep", d: 0.5 } },
  { a: 50.65, b: 53.51, v: T + "h03_roofs", from: 8.0, out: { type: "dissolve", d: 0.6 } },
  { a: 53.51, b: 55.88, v: E + "e2_diorama_noche", from: 1.0, cam: [1.0, 0.5, 0.5, 1.1, 0.55, 0.62], out: { type: "flash" } },
  { a: 55.88, b: 57.32, v: T + "h09_romeburn", from: 3.5, out: { type: "dissolve", d: 0.6 } },
  { a: 57.32, b: 59.24, comp: "map2", out: { type: "sweep", d: 0.5 } },
  { a: 59.24, b: 62.98, v: T + "h10_medieval", from: 0, out: { type: "whip", vy: -1 } },
  { a: 62.98, b: 65.38, v: T + "f06_castle", from: 0, k: "heatup", out: { type: "dissolve", d: 0.5 } },
  { a: 65.38, b: 66.88, v: T + "h12_seine", from: 0, cam: [1.7, 0.45, 0.95, 1.8, 0.5, 0.95], out: { type: "whip", vx: 1 } },
  { a: 66.88, b: 68.6, v: T + "p06_julian", from: 0, out: { type: "whip", vx: -1 } },
  { a: 68.6, b: 70.52, v: T + "p07_brazier", from: 7.0, cam: [1.25, 0.55, 0.62, 1.35, 0.55, 0.65], out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 70.52, b: 72.68, v: T + "h11_fumes", from: 3.5 },
];
const SNOW = new Set([T + "h03_roofs", T + "tst_alps_storm", T + "h12_seine"]);
const FIRE = new Set([T + "h07_furnace", T + "h13_stoker", T + "h09_romeburn"]);

const Clip: React.FC<{ v: string; at: number; from?: number; rate?: number; dx?: number }> = ({ v, at, from = 0, rate = 1.25, dx = 0 }) => (
  <Sequence from={Math.round(at * FPS)} layout="none">
    <OffthreadVideo src={staticFile(`${v}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{ width: WW, height: HH, objectFit: "cover", transform: dx ? `translateX(${dx}%) scale(1.2)` : undefined }} />
  </Sequence>
);

// hipocausto: arranca mirando el piso desde arriba y baja hasta las pilae (t0 = 24,92)
const HT = 24.92;
const hypoKeys = [
  { at: 0, pos: [-1.4, 3.0, 3.9] as [number, number, number], look: [-1.5, 0.5, 0.2] as [number, number, number], fov: 46 },
  { at: 1.64, pos: [-3.4, 0.45, 4.3] as [number, number, number], look: [-1.6, 0.42, 0] as [number, number, number], fov: 50 },
  { at: 2.64, pos: [-1.6, 1.2, 7.6] as [number, number, number], look: [-1.4, 0.8, 0] as [number, number, number], fov: 44 },
  { at: 4.94, pos: [5.0, 4.4, 12.8] as [number, number, number], look: [-0.9, 1.6, -0.6] as [number, number, number], fov: 38 },
  { at: 7.04, pos: [7.2, 5.2, 14.2] as [number, number, number], look: [-0.6, 1.8, -0.8] as [number, number, number], fov: 37 },
];
const hypoFase = (t: number) => ({ open: 0, gas: k01(t, 1.2, 1.8), flue: easeOut(k01(t, 2.69, 3.54)), glow: 0.6 + 0.4 * k01(t, 1.5, 2.8), room: k01(t, 4.94, 6.24) });

export const M1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const renderComp = (s: Shot) => {
    if (s.comp === "map1") return <ClayMap t0={1.3} keys={[
      { at: 0, pos: [0, 62, 34], look: [1, 0, 2], fov: 34 },
      { at: 2.4, pos: [5.4, 5.0, 5.0], look: [4.6, 0.6, -0.6], fov: 34 },
    ]} pins={[{ at: 0.55, out: 2.35, lon: 12.8, lat: 46.8, label: "THE EASTERN ALPS", sub: "January" }]} />;
    if (s.comp === "maq1") return <Maqueta t0={3.37} keys={[
      { at: 0, pos: [-34, 13, 26], look: [-18, 0, 8], fov: 34 },
      { at: 1.9, pos: [-16, 10.5, 23], look: [2, 0, 7], fov: 34 },
    ]} />;
    if (s.comp === "maq2") return <Maqueta t0={31.37} keys={[
      { at: 0, pos: [BATH[0] + 9, 17, BATH[1] + 14], look: [BATH[0], 0, BATH[1]], fov: 34 },
      { at: 3.4, pos: [BATH[0] + 15, 24, BATH[1] + 21], look: [BATH[0] - 3, 0, BATH[1]], fov: 34 },
    ]} ring={{ at: 0, x: BATH[0], z: BATH[1], label: "THE BATH HOUSE", sub: "a Roman town in the Alps" }} />;
    if (s.comp === "map2") return <ClayMap t0={56.92} keys={[
      { at: 0, pos: [1, 50, 26], look: [1, 0, 2], fov: 34 },
      { at: 2.8, pos: [1, 58, 32], look: [1, 0, 2], fov: 34 },
    ]} dark={(u) => 0.35 + 0.55 * k01(u, 0.4, 2.2)} />;
    if (s.comp === "hypo") return (
      <Hypo3D t0={HT} keys={hypoKeys} fase={hypoFase} title="HEAT FROM BELOW" titleAt={1.0}
        labels={[{ at: 2.74, out: 6.9, x: -2.2, y: 0.45, z: 3.3, text: "HOT GASES", sub: "under the floor", side: "r" },
          { at: 3.34, out: 6.9, x: -1.0, y: 3.1, z: -3.4, text: "UP THROUGH THE WALLS", sub: "hollow clay flues", side: "r" }]} />
    );
    if (s.comp === "split22") return (
      <TempSplit t={t} a={44.33} b={47.55}
        left={<><Clip v={T + "t05_family"} at={44.0} from={6.8} dx={-24} /><TempTag t={t} a={45.2} b={47.5} x={110} y={600} kicker="INSIDE" value={22} /></>}
        right={<><Clip v={T + "a01_legion"} at={44.0} from={3.0} /><Snow t={t} n={160} wind={0.9} big /><TempTag t={t} a={45.7} b={47.5} x={1260} y={600} kicker="OUTSIDE" value="< 0" cold /></>} />
    );
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {!farm && <Audio src={staticFile("oldtech01v2_mix.wav")} />}
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && SNOW.has(cur.v) && <Snow t={t} n={110} wind={0.5} />}
        {cur?.v && FIRE.has(cur.v) && <Embers t={t} n={60} />}
        <FrostCreep t={t} a={8.1} b={12.1}>
          <IceEtch t={t} a={8.4} b={12.1} x={1130} y={250} kicker="OUTSIDE" text="< 0°C" size={200} tally={{ at: 10.45, n: 6, label: "WEEKS BELOW FREEZING" }} />
        </FrostCreep>
        <Readout t={t} a={16.1} b={17.2} x={820} y={640} label="FLOOR" value="WARM" />
        <StrikeRing t={t} a={17.6} b={19.5} x={680} y={445} r={120} label="NOT THIS" />
        <NoList t={t} b={24.85} items={[{ at: 19.9, text: "NO FIRE" }, { at: 21.24, text: "NO FLAME" }, { at: 22.6, text: "NO SMOKE" }, { at: 23.5, text: "NO CHIMNEY" }]} />
        <BigWord t={t} a={34.61} b={35.55} text="ROMAN" hot />
        <EmberForm t={t} a={35.85} b={37.75} text="2,000" kicker="NEARLY" unit="YEARS OLD" y={500} size={320} />
        <HeatUp t={t} a={42.9} b={44.3} x={W * 0.5} label="UNDER ENTIRE BUILDINGS" />
        {cur?.k === "thermo" && <Thermostat t={t} a={47.49} b={50.65} value={22} />}
        <BigWord t={t} a={56.26} b={57.3} text="LOST" hot />
        <YearRoll t={t} a={57.4} b={59.2} from={476} to={1476} dur={1.7} label="MORE THAN 1,000 YEARS" />
        {cur?.k === "heatup" && <HeatUp t={t} a={63.2} b={65.3} x={W * 0.42} label="UP THE CHIMNEY" />}
        <Place t={t} a={65.5} b={66.85} text="LUTETIA" sub="Paris, around AD 358" />
        <Place t={t} a={67.0} b={68.5} text="EMPEROR JULIAN" sub="refused the heated floor" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
