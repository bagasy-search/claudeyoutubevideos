// oldtech01v2 · MINUTO 7 (418,96–486,05 s) — el secreto (calienta MASA), calor radiante, confort; las trampas: lento, hambriento, peligroso.
// Abre con el golpe de la revelación (418,96).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, k01, ease } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { Hypo3D, Fase, HypoKey, X0, Z0, PH } from "./Hypo3D";
import { Place, ThermalDefs, Embers, BigWord, Snow, Letterbox } from "./comps";
import { Term } from "./comps2";
import { RadiantWaves, HourRing } from "./comps3";

export const OFF7 = 418.96;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/";
type S7 = Shot & { k?: string };
const ABS: S7[] = [
  { a: 418.96, b: 422.93, comp: "mass", out: { type: "dissolve", d: 0.4 } },
  { a: 422.93, b: 428.53, comp: "inside", out: { type: "white", d: 0.4 } },
  { a: 428.53, b: 433.2, v: T + "p06_julian", from: 6.0, thermal: 428.53, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 433.2, b: 438.0, v: T + "h10_medieval", from: 6.0, thermal: 433.2, out: { type: "dissolve", d: 0.5 } },
  { a: 438.0, b: 441.0, v: T + "h04_door", from: 8.5, out: { type: "zoom", fx: 0.5, fy: 0.75 } },
  { a: 441.0, b: 443.6, comp: "warm22", out: { type: "whip", vx: 1 } },
  { a: 443.6, b: 446.77, v: T + "a03_courtyard", from: 9.0, out: { type: "flash" } },
  { a: 446.77, b: 450.09, v: T + "w14_vents", from: 8.6, rate: 1, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "zoom", fx: 0.5, fy: 0.8 } },
  { a: 450.09, b: 457.87, comp: "slow", out: { type: "whip", vx: -1 } },
  { a: 457.87, b: 460.35, v: T + "w08_praefurnium", from: 9.0, out: { type: "flash" } },
  { a: 460.35, b: 463.45, v: T + "h13_stoker", from: 9.75, rate: 0.75, out: { type: "white", d: 0.35 } },
  { a: 463.45, b: 469.0, v: T + "p03_carts", from: 0, cam: [1.02, 0.5, 0.5, 1.16, 0.55, 0.5], out: { type: "whip", vx: 1 } },
  { a: 469.0, b: 472.0, v: R + "r6666772", from: 1, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 472.0, b: 474.81, v: R + "r855606", from: 1, rate: 1, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.4], out: { type: "flash" } },
  { a: 474.81, b: 478.0, v: T + "w08_praefurnium", from: 3.25, rate: 0.55, out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 478.0, b: 480.7, v: T + "h13_stoker", from: 0, out: { type: "flash" } },
  { a: 480.7, b: 481.99, v: R + "r855887", from: 6, rate: 1, out: { type: "white", d: 0.3 } },
  { a: 481.99, b: 484.0, v: T + "h11_fumes", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 484.0, b: 486.05, v: T + "p06_julian", from: 4.0 },
];
export const SHOTS7: S7[] = ABS.map((s) => ({ ...s, a: s.a - OFF7, b: s.b - OFF7 }));
export const M7_FRAMES = Math.round((486.05 - OFF7) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });

export const M7: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF7;
  const L = (x: number) => x - OFF7;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "mass": return <Hypo3D t0={L(418.8)} keys={[K(0, [8, 3.0, 10], [0, 1.0, 0], 38), K(4.2, [5.5, 2.0, 7.5], [-0.5, 0.8, 0], 38)]}
        fase={(u) => base({ open: 0.6 * ease(k01(u, 0.8, 2.2)), gas: 1, glow: 1, room: 0.8, flue: 1 })}
        labels={[{ at: 1.3, out: 4.0, x: 3.5, y: 0.5, z: 3.2, text: "LADRILLO", side: "r" }, { at: 1.9, out: 4.0, x: 3.5, y: PH + 0.23 + 1.3, z: 3.3, text: "HORMIGÓN", side: "r" }, { at: 2.5, out: 4.0, x: 3.5, y: PH + 0.39 + 2.0, z: 3.3, text: "STONE", sub: "tons of it", side: "r" }]} />;
      case "inside": return <Hypo3D t0={L(422.8)} keys={[K(0, [4.5, 2.6, 3.0], [-3, 2.2, Z0], 52), K(5.8, [3.0, 2.4, 2.4], [-4, 2.0, Z0], 52)]}
        fase={() => base({ gas: 1, glow: 1, flue: 1, room: 1 })} />;
      case "thermal": return null;
      case "warm22": return <Hypo3D t0={L(440.8)} keys={[K(0, [9, 4.2, 11], [0, 1.6, 0], 40), K(2.8, [7.5, 3.4, 9.5], [0, 1.6, 0], 40)]}
        fase={() => base({ gas: 1, glow: 0.8, flue: 1, room: 1 })}
        labels={[{ at: 0.3, out: 2.7, x: 0.5, y: 2.6, z: 0.5, text: "≈ 22 °C", sub: "piedra tibia bajo los pies", side: "r" }]} />;
      case "slow": return <Hypo3D t0={L(449.9)} keys={[K(0, [9, 3.4, 11], [0, 1.0, 0], 40), K(8.0, [7, 2.6, 9], [-0.5, 1.0, 0], 40)]}
        fase={(u) => base({ gas: 1, glow: 1, room: ease(k01(u, 1.2, 7.4)), open: 0 })}
        labels={[{ at: 2.0, out: 7.6, x: -4.0, y: PH + 0.42, z: 3.3, text: "CALENTÁNDOSE DEL TODO", sub: "muchas horas — quizás uno o dos días", side: "r" }]} />;
    }
    return null;
  };
  const cur = SHOTS7.find((s) => t >= s.a && t < s.b);
  const FIRE = new Set([T + "w08_praefurnium", T + "p04_fornacator", T + "h13_stoker", T + "w09_flames"]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS7.map((s, i) => <ShotLayer key={i} S={SHOTS7} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && FIRE.has(cur.v) && <Embers t={t} n={60} />}
        {cur?.v === T + "a03_courtyard" && <Snow t={t} n={140} wind={0.6} />}
        <BigWord t={ta} a={419.0} b={420.4} text="MASA" hot />
        <RadiantWaves t={ta} a={423.1} b={428.5} sides={["b"]} />
        <Place t={ta} a={425.0} b={428.4} text="CALOR RADIANTE" sub="desde abajo y desde todos los lados" />
        <Place t={ta} a={428.7} b={431.7} text="SUPERFICIES TIBIAS" sub="tu cuerpo deja de perder calor hacia ellas" />
        <Place t={ta} a={433.4} b={437.9} text="AIRE FRESCO" sub="y la sala igual se siente cómoda" />
        <Place t={ta} a={443.8} b={446.6} text="UN ENERO ALPINO" />
        <BigWord t={ta} a={446.9} b={448.3} text="UN PROBLEMA" />
        <BigWord t={ta} a={448.45} b={449.95} text="VARIOS" hot />
        <Place t={ta} a={450.2} b={452.4} text="1 · ERA LENTO" />
        <HourRing t={ta} a={451.9} b={457.8} hours={48} caption="UNO O DOS DÍAS" />
        <Place t={ta} a={458.0} b={460.25} text="SIN INTERRUPTOR" sub="nunca lo dejabas enfriar" />
        <Place t={ta} a={460.5} b={463.4} text="DÍA Y NOCHE" sub="toda la temporada" />
        <Place t={ta} a={463.6} b={466.6} text="2 · ERA VORAZ" />
        <Place t={ta} a={469.2} b={474.7} text="BOSQUES TALADOS" sub="en parte para alimentar los hornos" />
        <Term t={ta} a={475.0} b={477.9} words={[{ la: "FORNACATOR", en: "EL FOGONERO", at: 476.7 }]} y={150} />
        <Place t={ta} a={482.1} b={485.9} text="3 · ERA PELIGROSO" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
