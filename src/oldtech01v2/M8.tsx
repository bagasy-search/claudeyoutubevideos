// oldtech01v2 · MINUTO 8 (486,05–547,35 s) — Juliano en Lutetia: el invierno, el cuarto sin calefacción, el brasero, casi muere.
// Revelación en 526,80 ("Julian was overcome").
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, k01, ease } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Hypo3D, Fase, HypoKey, X0, X1, Z0, PH } from "./Hypo3D";
import { Place, ThermalDefs, Embers, Snow, BigWord, StrikeRing, Letterbox } from "./comps";
import { Carved } from "./comps2";
import { WaxTablet } from "./comps3";

export const OFF8 = 486.05;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/";
type S8 = Shot & { k?: string };
const ABS: S8[] = [
  { a: 486.05, b: 489.4, comp: "lutmap", out: { type: "dissolve", d: 0.5 } },
  { a: 489.4, b: 493.65, v: T + "p05_lutetia", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 493.65, b: 497.15, v: T + "p05_lutetia", from: 5.5, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "white", d: 0.4 } },
  { a: 497.15, b: 500.0, v: R + "r8016858", from: 1, rate: 1, out: { type: "whip", vx: 1 } },
  { a: 500.0, b: 504.4, v: R + "r8016858", from: 7, rate: 1, grade: "blur(9px) brightness(.45)", cam: [1.6, 0.5, 0.9, 1.7, 0.5, 0.9], k: "quote", out: { type: "sweep", d: 0.5 } },
  { a: 504.4, b: 507.2, comp: "under", out: { type: "dissolve", d: 0.4 } },
  { a: 507.2, b: 509.92, v: T + "w14_vents", from: 5.0, out: { type: "whip", vx: -1 } },
  { a: 509.92, b: 513.0, v: T + "j01_julian", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 513.0, b: 516.48, v: T + "j01_julian", from: 4.5, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.65], out: { type: "flash" } },
  { a: 516.48, b: 519.3, v: T + "j02_julian_night", from: 0, out: { type: "zoom", fx: 0.6, fy: 0.5 } },
  { a: 519.3, b: 522.32, v: T + "p07_brazier", from: 0, out: { type: "dissolve", d: 0.35 } },
  { a: 522.32, b: 525.92, v: T + "p07_brazier", from: 3.8, cam: [1.1, 0.55, 0.6, 1.3, 0.55, 0.6] },
  { a: 526.8, b: 528.57, v: T + "h11_fumes", from: 6.3, out: { type: "whip", vx: 1 } },
  { a: 528.57, b: 532.0, v: T + "p08_carried", from: 1.5, out: { type: "dissolve", d: 0.4 } },
  { a: 532.0, b: 536.29, v: T + "p08_carried", from: 6.0, out: { type: "sweep", d: 0.5 } },
  { a: 536.29, b: 538.9, v: T + "p08_carried", from: 10.0, grade: "blur(9px) brightness(.4)", k: "emp", out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 538.9, b: 541.03, comp: "empire", out: { type: "flash" } },
  { a: 541.03, b: 544.4, comp: "safe", out: { type: "dissolve", d: 0.4 } },
  { a: 544.4, b: 547.35, v: T + "a05_pool", from: 8.0 },
];
// hueco de silencio 525,92–526,80: negro (la música corta) — el plano de p07 se apaga y entra el golpe
export const SHOTS8: S8[] = ABS.map((s) => ({ ...s, a: s.a - OFF8, b: s.b - OFF8 }));
export const M8_FRAMES = Math.round((547.35 - OFF8) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });

export const M8: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF8;
  const L = (x: number) => x - OFF8;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "lutmap": return <ClayMap t0={L(485.8)} dark={() => 0.2} keys={[
        { at: 0, pos: [-13, 14, -2], look: [-16.3, 0, -4.7], fov: 34 }, { at: 3.6, pos: [-15.8, 3.6, -1.4], look: [-16.3, 0.6, -4.7], fov: 34 },
      ]} pins={[{ at: 0.6, out: 3.4, lon: 2.35, lat: 48.85, label: "LUTETIA", sub: "a small town on the Seine · late 350s" }]} />;
      case "under": return <Hypo3D t0={L(504.2)} keys={[K(0, [8, 2.6, 9], [-1, 0.6, 0], 40), K(3.0, [6, 2.0, 8], [-2, 0.5, 0], 40)]}
        fase={() => base({ open: 0.7, gas: 1, glow: 0.8, room: 0.5 })}
        labels={[{ at: 0.4, out: 2.9, x: -2.5, y: 0.45, z: 3.0, text: "FURNACES UNDERNEATH", sub: "in the Roman style", side: "r" }]} />;
      case "empire": return <ClayMap t0={L(538.7)} keys={[
        { at: 0, pos: [4, 30, 26], look: [4, 0, 6], fov: 34 }, { at: 2.6, pos: [4, 40, 34], look: [4, 0, 4], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.3, lon: 12.48, lat: 41.9, label: "THE EMPIRE", sub: "soon to be his" }]} />;
      case "safe": return <Hypo3D t0={L(540.8)} keys={[K(0, [-5, 2.2, 7], [-6.8, 0.6, 0.8], 40), K(3.6, [-1, 3.6, 10], [-4, 1.2, 0], 40)]}
        fase={() => base({ gas: 1, glow: 0.8, flue: 1, room: 0.8 })}
        labels={[{ at: 0.4, out: 3.5, x: X0 - 1.6, y: 1.2, z: 1.1, text: "THE FIRE", sub: "outside the room", side: "r" }, { at: 1.4, out: 3.5, x: 0, y: 2.6, z: 0.5, text: "CLEAN AIR INSIDE", side: "r" }]} title="THE SAFER CHOICE" />;
    }
    return null;
  };
  const cur = SHOTS8.find((s) => t >= s.a && t < s.b);
  const COLD = new Set([T + "p05_lutetia", T + "j01_julian", T + "j02_julian_night", T + "p08_carried"]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS8.map((s, i) => <ShotLayer key={i} S={SHOTS8} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && COLD.has(cur.v) && <Snow t={t} n={90} wind={0.5} op={0.6} />}
        {cur?.v === T + "p07_brazier" && <Embers t={t} n={30} op={0.7} />}
        <Place t={ta} a={489.6} b={493.5} text="JULIAN" sub="the future emperor" />
        <BigWord t={ta} a={495.4} b={497.1} text="PARIS" />
        <Place t={ta} a={497.3} b={499.9} text="AN UNUSUALLY HARSH WINTER" />
        {cur?.k === "quote" && <WaxTablet t={ta} a={500.05} b={504.35} papyrus author="JULIAN" work="Misopogon" dur={1.6}
          lines={["the river carried", "slabs of ice", "like blocks of marble"]} hot={["ice", "marble"]} en="his own account of that winter in Lutetia" />}
        <Place t={ta} a={507.4} b={509.8} text="WARMED FROM BELOW" />
        <Place t={ta} a={510.1} b={512.9} text="A STERN MAN" sub="who prided himself on toughness" />
        <StrikeRing t={ta} a={513.4} b={516.3} x={960} y={820} r={150} label="NO HEATING" />
        <Place t={ta} a={519.5} b={522.2} text="A FEW HOT COALS" />
        <Place t={ta} a={522.5} b={525.8} text="DAMP WALLS · FUMES" />
        <BigWord t={ta} a={526.85} b={528.5} text="OVERCOME" hot />
        <Place t={ta} a={528.8} b={531.9} text="NEARLY SUFFOCATED" sub="carried outside into the night" />
        <Place t={ta} a={532.2} b={536.1} text="HIS DOCTORS" sub="made him vomit — only then did he recover" />
        {cur?.k === "emp" && <Carved t={ta} a={536.35} b={538.85} text="IULIANUS AUGUSTUS" sub="EMPEROR · AD 361–363" />}
        <Place t={ta} a={544.6} b={547.2} text="THE SAFER CHOICE ALL ALONG" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
