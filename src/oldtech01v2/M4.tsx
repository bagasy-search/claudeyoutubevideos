// oldtech01v2 · MINUTO 4 (200,07–259,50 s) — suspensura, praefurnium, gases, Séneca, tubuli, paredes-radiador.
// Revelación en 254,38 ("The entire room…"): la voz ya trae el hueco; la música corta y entra el braam.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, k01, ease } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { Hypo3D, Fase, HypoKey, HypoLabel, HypoDim, X0, X1, Z0, WH, PH } from "./Hypo3D";
import { Place, ThermalDefs, Embers, HeatUp, BigWord, Letterbox } from "./comps";
import { Term } from "./comps2";
import { WaxTablet } from "./comps3";

export const OFF4 = 200.07;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/";
type S4 = Shot & { k?: string };
const ABS: S4[] = [
  { a: 200.07, b: 204.01, comp: "susp", out: { type: "whip", vx: -1 } },
  { a: 204.01, b: 206.6, v: T + "w08_praefurnium", from: 0, out: { type: "zoom", fx: 0.45, fy: 0.6 } },
  { a: 206.6, b: 208.6, v: T + "h07_furnace", from: 6.0, out: { type: "whip", vx: 1 } },
  { a: 208.6, b: 210.77, v: T + "h13_stoker", from: 7.0, out: { type: "flash" } },
  { a: 210.77, b: 213.4, v: R + "r12701356", from: 10.5, rate: 1, out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 213.4, b: 218.59, comp: "gasrun", out: { type: "dissolve", d: 0.4 } },
  { a: 218.59, b: 221.55, v: T + "w10_glow", from: 0, out: { type: "whip", vy: -1 } },
  { a: 221.55, b: 224.33, comp: "wallup", out: { type: "sweep", d: 0.5 } },
  { a: 224.33, b: 228.5, v: T + "w11_seneca", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 228.5, b: 232.3, v: T + "w11_seneca", from: 4.0, grade: "blur(10px) brightness(.4)", cam: [1.12, 0.5, 0.5, 1.18, 0.5, 0.5], k: "wax", out: { type: "sweep", d: 0.5 } },
  { a: 232.3, b: 236.4, comp: "pipes", out: { type: "zoom", fx: 0.35, fy: 0.4 } },
  { a: 236.4, b: 240.33, comp: "equal", out: { type: "flash" } },
  { a: 240.33, b: 243.61, v: T + "w12_tubuli", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.3 } },
  { a: 243.61, b: 247.3, v: T + "w13_wallsmoke", from: 0, out: { type: "whip", vy: -1 } },
  { a: 247.3, b: 250.31, v: T + "w14_vents", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 250.31, b: 253.76, comp: "radiator" },
  { a: 253.76, b: 256.9, comp: "heater", out: { type: "white", d: 0.4 } },
  { a: 256.9, b: 259.5, v: T + "w15_caldarium", from: 0 },
];
export const SHOTS4: S4[] = ABS.map((s) => ({ ...s, a: s.a - OFF4, b: s.b - OFF4 }));
export const M4_FRAMES = Math.round((259.5 - OFF4) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });
const FL = X0 + 0.6 + 0.45;   // primer tubulus de la ventana de corte

export const M4: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF4;
  const L = (x: number) => x - OFF4;
  const H4 = (t0abs: number, keys: HypoKey[], fase: (u: number) => Fase, labels: HypoLabel[] = [], dims: HypoDim[] = [], title?: string) =>
    <Hypo3D t0={L(t0abs)} keys={keys} fase={fase} labels={labels} dims={dims} title={title} titleAt={0.2} />;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "susp": return H4(199.9, [K(0, [10, 3.2, 12], [0, 1.4, 0], 36), K(4.2, [7, 2.4, 10], [-1, 1.4, 0], 36)],
        (u) => base({ open: 0.35 * Math.sin(Math.PI * k01(u, 0.6, 3.6)) }),
        [{ at: 0.6, out: 3.9, x: 4.0, y: 1.25, z: 3.4, text: "TILES · CONCRETE · MOSAIC", side: "r" }]);
      case "gasrun": return H4(213.2, [K(0, [7, 3.0, 8.5], [-1.5, 0.4, 0], 40), K(5.4, [2.5, 1.9, 6.6], [-2.5, 0.4, 0], 40)],
        () => base({ gas: 1, glow: 0.7, open: 0.85 }),
        [{ at: 1.2, out: 3.4, x: -2.0, y: 0.45, z: 2.6, text: "NOT FLAMES", sub: "hot gases", side: "r" }, { at: 3.4, out: 5.4, x: -2.5, y: 2.2, z: 3.3, text: "HEATING THE CONCRETE", sub: "from below", side: "r" }]);
      case "wallup": return H4(221.35, [K(0, [3, 2.5, 9], [-1, 1.2, -2], 40), K(3.0, [2, 3.6, 10], [-1, 2.6, -3], 40)],
        (u) => base({ wall: Math.max(0.001, ease(k01(u, 0.4, 2.2))), glow: 0.4, room: 0.2 }), [], [], "BUT NOT ONLY THE FLOOR");
      case "pipes": return H4(232.1, [K(0, [-1.4, 2.4, 3.2], [-2.4, 2.2, Z0], 44), K(4.4, [-1.0, 3.6, 3.6], [-2.4, 2.8, Z0], 44)],
        (u) => base({ gas: 1, glow: 0.7, flue: ease(k01(u, 0.3, 1.8)), room: 0.2 }),
        [{ at: 0.8, out: 4.2, x: FL + 0.8, y: 2.2, z: Z0 + 0.05, text: "PIPES IN THE WALLS", sub: "impressi parietibus tubi", side: "r" }]);
      case "equal": return H4(236.2, [K(0, [8, 3.2, 11], [0, 2.0, -1], 40), K(4.2, [9.5, 4, 13], [0, 2.0, -1], 40)],
        () => base({ gas: 1, glow: 0.8, flue: 1, room: 0.8 }),
        [{ at: 0.9, out: 4.1, x: 3.6, y: PH + 0.45, z: 1.5, text: "LOWEST", sub: "warm", side: "r" }, { at: 1.6, out: 4.1, x: 3.6, y: WH - 0.3, z: Z0 + 0.1, text: "HIGHEST", sub: "just as warm", side: "r" }], [], "EVEN HEAT");
      case "radiator": return H4(250.1, [K(0, [4, 2.6, 7.5], [-1, 2.2, Z0], 42), K(4.5, [6, 3, 10], [-1, 2.2, Z0], 42)],
        () => base({ gas: 1, glow: 1, flue: 1, room: 0.5 }),
        [{ at: 1.2, out: 3.9, x: 3.5, y: 2.6, z: Z0 + 0.1, text: "THE WALLS", sub: "became radiators", side: "r" }]);
      case "heater": return H4(253.6, [K(0, [6, 3.5, 9], [-0.5, 1.6, 0], 40), K(3.0, [13, 8, 17], [-0.5, 1.6, 0], 40)],
        () => base({ gas: 1, glow: 1, flue: 1, room: 1 }), [], [], "ONE GENTLE HEATER");
    }
    return null;
  };
  const cur = SHOTS4.find((s) => t >= s.a && t < s.b);
  const FIRE = new Set([T + "w08_praefurnium", T + "h07_furnace", T + "h13_stoker", T + "w09_flames"]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS4.map((s, i) => <ShotLayer key={i} S={SHOTS4} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && FIRE.has(cur.v) && <Embers t={t} n={60} />}
        <Term t={ta} a={200.3} b={203.95} words={[{ la: "SUSPENSURA", en: "THE HANGING FLOOR", at: 202.9 }]} y={150} />
        <Place t={ta} a={204.2} b={206.5} text="PRAEFURNIUM" sub="the furnace, outside the room" />
        <Place t={ta} a={210.95} b={213.3} text="THE FLAMES STAYED HERE" />
        <HeatUp t={ta} a={218.8} b={221.4} label="FROM BELOW" />
        <Place t={ta} a={224.5} b={228.4} text="SENECA" sub="philosopher · first century AD" />
        {cur?.k === "wax" && <WaxTablet t={ta} a={228.55} b={232.25} author="SENECA" work="Letters, 90" dur={1.8}
          lines={["suspensuras balneorum", "et impressos parietibus tubos", "per quos circumfunderetur calor"]} hot={["suspensuras", "balneorum", "tubos"]}
          en="suspended floors of the baths, and pipes pressed into the walls" />}
        <Term t={ta} a={240.5} b={243.5} words={[{ la: "TUBULI", en: "HOLLOW BOX TILES", at: 242.5 }]} y={150} />
        <Place t={ta} a={247.5} b={250.2} text="VENTS NEAR THE ROOF" />
        <BigWord t={ta} a={253.9} b={256.85} text="ONE HEATER" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
