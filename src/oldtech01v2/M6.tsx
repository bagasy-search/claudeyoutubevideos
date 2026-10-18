// oldtech01v2 · MINUTO 6 (342,30–418,96 s) — la prueba: Saalburg 1951-52, Kretschmer, Carnuntum, Groundwell Ridge, el secreto.
// Termina en el hueco de silencio antes de "It heated mass" (418,96 = golpe de la revelación, abre el minuto 7).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, k01, ease } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Hypo3D, Fase, HypoKey, X0, X1, Z0, Z1, WH, PH } from "./Hypo3D";
import { Place, ThermalDefs, Embers, StrikeRing, Letterbox } from "./comps";
import { EmberForm, DialGauge } from "./comps3";

export const OFF6 = 342.3;
const T = "oldtech01v2/t2v/";
type S6 = Shot & { k?: string };
const ABS: S6[] = [
  { a: 342.3, b: 346.0, v: T + "t04_coals", from: 0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 346.0, b: 348.2, v: T + "p01_night", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.75 } },
  { a: 348.2, b: 350.28, v: T + "w08_praefurnium", from: 5.0, out: { type: "white", d: 0.4 } },
  { a: 350.28, b: 353.4, comp: "saalmap", out: { type: "dissolve", d: 0.5 } },
  { a: 353.4, b: 356.6, v: T + "t01_saalburg", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 356.6, b: 359.8, v: T + "t02_engineer", from: 0, out: { type: "whip", vx: -1 } },
  { a: 359.8, b: 362.64, v: T + "t01_saalburg", from: 5.0, out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 362.64, b: 366.5, comp: "sensors", out: { type: "flash" } },
  { a: 366.5, b: 369.6, v: T + "t02_engineer", from: 4.5, grade: "blur(10px) brightness(.38)", cam: [1.12, 0.5, 0.5, 1.18, 0.5, 0.5], k: "g21", out: { type: "whip", vx: 1 } },
  { a: 369.6, b: 372.12, v: T + "t02_engineer", from: 8.5, out: { type: "dissolve", d: 0.5 } },
  { a: 372.12, b: 375.4, comp: "carnmap", out: { type: "dissolve", d: 0.5 } },
  { a: 375.4, b: 378.66, v: T + "t03_carnuntum", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 378.66, b: 384.68, comp: "temps", out: { type: "whip", vy: 1 } },
  { a: 384.68, b: 387.6, v: T + "w07_mosaicmaking", from: 5.0, out: { type: "dissolve", d: 0.4 } },
  { a: 387.6, b: 390.74, comp: "dark", k: "ghot", out: { type: "white", d: 0.4 } },
  { a: 390.74, b: 394.4, comp: "engmap", out: { type: "dissolve", d: 0.5 } },
  { a: 394.4, b: 397.6, v: T + "t04_coals", from: 4.6, out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 397.6, b: 401.36, v: T + "w09_flames", from: 6.0, grade: "brightness(.45)", k: "fire", out: { type: "flash" } },
  { a: 401.36, b: 405.0, comp: "cool", out: { type: "dissolve", d: 0.4 } },
  { a: 405.0, b: 408.0, v: T + "w10_glow", from: 5.0, out: { type: "whip", vx: -1 } },
  { a: 408.0, b: 410.36, v: T + "w15_caldarium", from: 5.0, out: { type: "zoom", fx: 0.5, fy: 0.7 } },
  { a: 410.36, b: 413.6, comp: "stone", out: { type: "flash" } },
  { a: 413.6, b: 415.8, v: T + "h06_under", from: 4.0, out: { type: "whip", vy: -1 } },
  { a: 415.8, b: 418.96, v: T + "w15_caldarium", from: 8.5 },
];
export const SHOTS6: S6[] = ABS.map((s) => ({ ...s, a: s.a - OFF6, b: s.b - OFF6 }));
export const M6_FRAMES = Math.round((418.96 - OFF6) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });

export const M6: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF6;
  const L = (x: number) => x - OFF6;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "dark": return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2a1408 0%, #0b0605 70%)" }}><Embers t={t} n={50} op={0.6} /></AbsoluteFill>;
      case "saalmap": return <ClayMap t0={L(350.0)} keys={[
        { at: 0, pos: [-2, 12, 6], look: [-3.8, 0, -7.2], fov: 34 }, { at: 3.4, pos: [-3.2, 3.6, -3.4], look: [-3.9, 0.6, -7.5], fov: 34 },
      ]} pins={[{ at: 0.6, out: 3.3, lon: 8.57, lat: 50.27, label: "SAALBURG", sub: "a rebuilt Roman fort, Germany" }]} />;
      case "carnmap": return <ClayMap t0={L(371.9)} keys={[
        { at: 0, pos: [13.5, 12, 6], look: [12.7, 0, -3.2], fov: 34 }, { at: 3.4, pos: [12.9, 3.6, 0.4], look: [12.7, 0.6, -3.2], fov: 34 },
      ]} pins={[{ at: 0.6, out: 3.3, lon: 16.86, lat: 48.11, label: "CARNUNTUM", sub: "the Roman city near Vienna" }]} />;
      case "engmap": return <ClayMap t0={L(390.5)} keys={[
        { at: 0, pos: [-23, 14, -2], look: [-24.6, 0, -10.2], fov: 34 }, { at: 3.8, pos: [-24.3, 4.0, -6.6], look: [-24.6, 0.6, -10.2], fov: 34 },
      ]} pins={[{ at: 0.6, out: 3.7, lon: -1.79, lat: 51.59, label: "GROUNDWELL RIDGE", sub: "a Roman villa near Swindon, England" }]} />;
      case "sensors": return <Hypo3D t0={L(362.4)} keys={[K(0, [9, 4, 11], [0, 1.4, 0], 40), K(4.2, [7, 3.2, 9.5], [-0.5, 1.4, 0], 40)]}
        fase={() => base({ gas: 1, glow: 0.6, flue: 0.6, room: 0.4 })}
        labels={[
          { at: 0.3, out: 3.9, x: -3, y: PH + 0.42, z: 1.5, text: "SENSOR · FLOOR", side: "r" },
          { at: 0.7, out: 3.9, x: 3.2, y: PH + 0.42, z: 2.5, text: "SENSOR · FLOOR", side: "r" },
          { at: 1.1, out: 3.9, x: 2.5, y: 2.8, z: Z0 + 0.12, text: "SENSOR · WALL", side: "l" },
          { at: 1.5, out: 3.9, x: -1.0, y: 0.4, z: 3.3, text: "SENSOR · UNDERFLOOR", side: "r" },
        ]} title="SAALBURG · WINTER 1951–52" />;
      case "temps": return <Hypo3D t0={L(378.4)} keys={[K(0, [10, 3.6, 12], [0, 1.6, 0], 40), K(6.4, [6.5, 2.6, 9], [-0.5, 1.6, 0], 40)]}
        fase={(u) => base({ gas: 1, glow: 1, flue: 1, room: k01(u, 0.3, 3.0) })}
        labels={[
          { at: 0.5, out: 5.8, x: 2.6, y: PH + 0.42, z: 2.6, text: "FLOOR 20–50 °C", sub: "measured in reconstructions", side: "l" },
          { at: 2.6, out: 5.8, x: 2.0, y: 3.0, z: Z0 + 0.12, text: "WALLS UP TO 30 °C", side: "l" },
        ]} title="CARNUNTUM · RECONSTRUCTION TESTS" />;
      case "cool": return <Hypo3D t0={L(401.2)} keys={[K(0, [4, 2.6, 8], [-2.5, 0.4, 0], 40), K(3.8, [7, 2.4, 8.5], [1.5, 0.4, 0], 40)]}
        fase={() => base({ gas: 1, glow: 0.9, open: 0.8 })}
        labels={[{ at: 0.3, out: 3.6, x: X0 - 1.6, y: 0.9, z: 1.2, text: "≈ 400 °C", sub: "in the fire", side: "r" }, { at: 1.6, out: 3.6, x: X1 - 1.0, y: 0.5, z: 2.6, text: "A HOT OVEN", sub: "by the far end", side: "l" }]} />;
      case "stone": return <Hypo3D t0={L(410.2)} keys={[K(0, [1.8, 1.1, 5.0], [-0.6, 0.5, 2.6], 38), K(3.4, [1.2, 1.4, 4.4], [-0.6, 0.6, 2.6], 38)]}
        fase={() => base({ gas: 1, glow: 1, open: 0.5 })}
        labels={[{ at: 0.3, out: 3.2, x: -0.59, y: 0.75, z: 2.71, text: "HOT ENOUGH TO HEAT STONE", side: "r" }, { at: 1.4, out: 3.2, x: -0.59, y: 0.25, z: 2.71, text: "NOT TO CRACK IT", side: "r" }]} />;
    }
    return null;
  };
  const cur = SHOTS6.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS6.map((s, i) => <ShotLayer key={i} S={SHOTS6} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {(cur?.v === T + "w08_praefurnium" || cur?.v === T + "p01_night") && <Embers t={t} n={50} />}
        <Place t={ta} a={342.5} b={345.9} text="CAN WE TEST IT?" />
        <Place t={ta} a={346.2} b={350.1} text="REBUILT · FIRED UP" sub="working reconstructions" />
        <Place t={ta} a={356.8} b={359.7} text="FRITZ KRETSCHMER" sub="engineer" />
        <Place t={ta} a={360.0} b={362.5} text="WINTER 1951–52" />
        {cur?.k === "g21" && <DialGauge t={ta} a={366.55} b={369.55} value={21} max={50} band={[18, 24]} caption="ROOM TEMPERATURE" sub="in his calculations" from={4} />}
        {cur?.k === "ghot" && <DialGauge t={ta} a={387.65} b={390.7} value={47} max={60} band={[18, 26]} red={[40, 60]} caption="TOO HOT" sub="beyond comfortable, even today" from={20} />}
        <Place t={ta} a={394.6} b={397.5} text="CHARCOAL" sub="from the villa's furnace" />
        {cur?.k === "fire" && <EmberForm t={ta} a={397.65} b={401.2} text="330–410°" kicker="THE FIRE BURNED AT" unit="DEGREES CELSIUS" y={480} size={250} />}
        <Place t={ta} a={408.2} b={410.2} text="EXACTLY WHAT IT NEEDED" />
        <Place t={ta} a={413.8} b={415.7} text="THE REAL SECRET" />
        <StrikeRing t={ta} a={416.0} b={417.9} x={960} y={420} r={150} label="NOT THE AIR" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
