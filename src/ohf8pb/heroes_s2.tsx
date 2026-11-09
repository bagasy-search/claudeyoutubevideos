// ohf8pb · componentes 18-34: grietas, rampa, capas, levantar losa, bordes, juntas, capa final, cierre
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { FlowPath, Tape } from "./okit";
import { Board, Boot, Bucket, CONC, Conc, Hammer, PI, Rule, Slab, Trowel, Wedge, Y0, Yard } from "./slabkit";

type P = { t: number; h: H };
const SEC = { at: [0, 0.52, 0], az: [-0.14, 0.12], el: [0.07, 0.11], r: [2.05, 1.92], fov: 32 };
const SKY = { floor: "none" as const, wall: "none" as const, bg: "#b9cbd8", key1: [-1.4, 3, 2.6] };

// 16:30 · COLA DE MILANO: el corte en corte: abajo más ancho; el mortero entra y al tirar no sale
export const HDovetail: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={{ at: [0, Y0 - 0.04, 0.2], az: [-0.1, 0.08], el: [0.03, 0.06], r: [1.9, 1.82], fov: 30 }}>{(tt) => {
  const op = eio(tt, 0.5, 1.8), fill = eio(tt, 2.0, 3.0), pull = tt > 3.8 ? 0.025 * Math.abs(Math.sin((tt - 3.8) * 5)) * cl(tt - 3.8) : 0, top = lerp(0.03, 0.15, op) / 2, bot = lerp(0.03, 0.24, op) / 2, H1 = 0.22 * op + 0.004;
  const mk = (pts: [number, number][]) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.closePath(); return s; };
  const yt = Y0 + 0.02, yb = yt - H1;
  const L = mk([[-1.3, yt], [-top, yt], [-bot, yb], [-bot - 0.02, yt - 0.34], [-1.3, yt - 0.34]]), R = mk([[1.3, yt], [top, yt], [bot, yb], [bot + 0.02, yt - 0.34], [1.3, yt - 0.34]]), B = mk([[-bot, yb], [bot, yb], [bot + 0.02, yt - 0.34], [-bot - 0.02, yt - 0.34]]), Pl = mk([[-top, yt + 0.002], [top, yt + 0.002], [bot, yb + 0.001], [-bot, yb + 0.001]]);
  return <><Yard />
    {[L, R, B].map((s, i) => <mesh key={i} position={[0, 0, 0.37]} castShadow><extrudeGeometry args={[s, { depth: 0.02, bevelEnabled: false }]} /><Conc k="z" /></mesh>)}
    <mesh position={[0, 0, 0.385]}><shapeGeometry args={[Pl]} /><meshStandardMaterial color="#3d352b" roughness={1} /></mesh>
    {fill > 0 && <mesh position={[0, pull, 0.372]} scale={[1, 1, 1]}><extrudeGeometry args={[Pl, { depth: 0.022, bevelEnabled: false }]} /><meshStandardMaterial color="#d1cdbd" roughness={0.85} /></mesh>}
    <group position={[0, Y0 + 0.3 + 0.1 * Math.max(0, Math.sin(tt * 9)) * (1 - cl(tt - 1.8)), 0.4]} rotation={[0, 0, 0]}>{tt < 2 && <Hammer p={[0.1, 0.1, 0]} rot={[0, 0, -0.5]} s={0.8} />}</group>
    {tt > 3.5 && <group position={[0, Y0 + 0.2, 0.42]}><RBox s={[0.02, 0.24, 0.01]} p={[0, 0.06, 0]} r={0.004}><meshStandardMaterial color="#b3261e" roughness={0.5} /></RBox><mesh position={[0, 0.21, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.05, 0.08, 16]} /><meshStandardMaterial color="#b3261e" roughness={0.5} /></mesh></group>}
    <Tape txt="WIDER AT THE BOTTOM" col="#1c2a3a" p={[-0.5, Y0 + 0.24, 0.42]} w={0.5} k={phys(tt, 1.7, 8, 0.45)} rev={cl((tt - 1.7) * 2)} />
    <Tape txt="IT CAN'T LIFT OUT" col="#1f7a3a" p={[0.5, Y0 + 0.24, 0.42]} w={0.46} k={phys(tt, 4.3, 8, 0.45)} rev={cl((tt - 4.3) * 2)} />
  </>;
}}</Scene3D>;

// 17:30 · GRIETA QUE RESPIRA: dos losas se separan y juntan con la estación; el parche se raja y el cordón estira
export const HMoving: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.06, 0.15], az: [-0.1, 0.1], el: [0.34, 0.38], r: [1.95, 1.85], fov: 32 }}>{(tt) => {
  const s = (Math.sin(tt * 1.5 - 1.2) + 1) / 2, g = 0.012 + 0.048 * s, e = eio(tt, 4.0, 5.2);
  return <><Yard cut={false} />
    <Slab w={1.2} d={1} p={[-0.6 - g / 2, Y0 - 0.08, 0]} k="a" /><Slab w={1.2} d={1} p={[0.6 + g / 2, Y0 - 0.08, 0]} k="b" />
    {e < 1 && Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[Math.min(g + 0.01, 0.07) * (0.7 + rn(i, 81) * 0.5), 0.022, 0.09]} p={[(rn(i, 82) - 0.5) * 0.006, Y0 + 0.008, -0.42 + i * 0.105]} r={0.004}><Conc col="#c1beb5" k="y" /></RBox>)}
    {e > 0 && <RBox s={[g + 0.022, 0.026 * e + 0.002, 0.98]} p={[0, Y0 + 0.022, 0]} r={0.008}><meshStandardMaterial color="#3a3a3d" roughness={0.42} /></RBox>}
    <Tape txt={s > 0.5 ? "WINTER: OPENS" : "SUMMER: CLOSES"} col={s > 0.5 ? "#1f5ea8" : "#b3261e"} p={[0, Y0 + 0.3, -0.34]} w={0.5} k={1} rev={1} />
    <Tape txt="A BEAD AND YOU'RE DONE" col="#1f7a3a" p={[0, Y0 + 0.05, 0.52]} rot={[-1.0, 0, 0]} w={0.56} k={phys(tt, 5.4, 8, 0.45)} rev={cl((tt - 5.4) * 2)} />
  </>;
}}</Scene3D>;

// 18:30 · EL LADO BAJO: el cincel amaga contra el alto y se tacha; la cuña sube desde el bajo
export const HLowSide: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={{ ...SEC, r: [2.75, 2.6] }}>{(tt) => {
  const c = phys(tt, 1.5, 8, 0.45), r = eio(tt, 3.2, 5.0), ch = cl(tt - 2.9), lip = 0.1;
  return <><Yard />
    <Slab w={1.5} p={[-0.8, Y0 - 0.08 - lip + 0.0, 0.03]} k="a" /><Slab w={1.5} p={[0.76, Y0 - 0.08, 0.03]} k="b" />
    <Wedge l={1.0 * Math.max(0.01, r)} h0={0.0008} h1={lip * r} p={[-0.02 - 1.0 * Math.max(0.01, r), Y0 + 0.02 - lip, 0.03]} />
    <group position={[0.28, Y0 + 0.3 + 0.18 * ch, 0.2]} rotation={[0, 0, 0.5]}><mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.02, 0.028, 0.5, 12]} />{M.steel({ col: "#7d8388" })}</mesh></group>
    <group position={[0.28, Y0 + 0.36, 0.24]} scale={Math.max(0.03, cl(c)) * 0.7}><RBox s={[0.6, 0.044, 0.012]} rot={[0, 0, 0.78]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox><RBox s={[0.6, 0.044, 0.012]} rot={[0, 0, -0.78]} r={0.004}><meshStandardMaterial color="#c8281e" roughness={0.5} /></RBox></group>
    <Tape txt="DON'T CUT THE HIGH SIDE" col="#b3261e" p={[0.45, Y0 + 0.56, 0.2]} w={0.66} k={phys(tt, 1.9, 8, 0.45)} rev={cl((tt - 1.9) * 2)} />
    <Tape txt="BUILD THE LOW SIDE" col="#1f7a3a" p={[-0.68, Y0 + 0.4, 0.2]} w={0.58} k={phys(tt, 4.3, 8, 0.45)} rev={cl((tt - 4.3) * 2)} />
  </>;
}}</Scene3D>;

// 19:20 · DOS PIES POR PULGADA: una cinta se tira y la bola sube la lomada o la rampa
export const HRamp: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ at: [0, 0.6, 0], az: [-0.1, 0.1], el: [0.08, 0.12], r: [2.2, 2.06], fov: 32 }}>{(tt) => {
  const a = eio(tt, 0.4, 1.8), b = eio(tt, 2.8, 4.4), lip = 0.12, l = lerp(0.26, 1.42, b);
  return <><Yard />
    <Slab w={2} p={[-1.04, Y0 - 0.08 - lip, 0.03]} k="a" /><Slab w={1.2} p={[0.6, Y0 - 0.08, 0.03]} k="b" />
    <Wedge l={l} h0={0.0008} h1={lip * a} p={[-0.04 - l, Y0 + 0.02 - lip, 0.03]} col={b > 0.5 ? CONC.fresh : "#b6a67a"} />
    <Rule l={l} p={[-0.04 - l / 2, Y0 + 0.02 - lip + 0.004, 0.5]} rot={[0, 0, 0]} n={Math.round(lerp(2, 12, b))} />
    <Tape txt={b > 0.5 ? "2 FT PER INCH: A WALK" : "SHORT: A SPEED BUMP"} col={b > 0.5 ? "#1f7a3a" : "#b3261e"} p={[-0.3, Y0 + 0.44, 0.2]} w={0.74} k={phys(tt, b > 0.5 ? 3.7 : 1.4, 8, 0.45)} rev={1} />
    <mesh position={[lerp(-1.1, 0.34, eio(tt, 4.7, 6.8)), Y0 + 0.02 - lip + 0.06 + lip * cl((lerp(-1.1, 0.34, eio(tt, 4.7, 6.8)) + 1.46) / 1.42), 0.32]} castShadow><sphereGeometry args={[0.06, 26, 18]} /><meshStandardMaterial color="#c8281e" roughness={0.3} /></mesh>
  </>;
}}</Scene3D>;

// 20:45 · DE A CAPAS: a la izquierda capa, rayado, reloj, capa; a la derecha todo junto se chorrea
export const HLayers: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.08, 0.2], az: [-0.12, 0.1], el: [0.14, 0.18], r: [2.18, 2.05], fov: 32 }}>{(tt) => {
  const a = phys(tt, 0.4, 8, 0.45), sc = cl((tt - 1.3) * 1.4), cl2 = eio(tt, 2.2, 3.6), b = phys(tt, 3.8, 8, 0.45), s = eio(tt, 1.4, 4.2), lh = 0.07;
  return <><Yard />
    <Slab w={1.2} p={[-0.7, Y0 - 0.08, 0.03]} k="a" /><Slab w={1.2} p={[0.7, Y0 - 0.08, 0.03]} k="b" />
    <RBox s={[1, lh, 0.62]} p={[-0.7, Y0 + 0.024 + lh / 2 + 0.4 * (1 - cl(a)), 0.03]} r={0.008}><Conc col="#a8a59a" k="l" /></RBox>
    {Array.from({ length: 11 }, (_, i) => <RBox key={i} s={[0.006, 0.002, 0.58 * Math.max(0.02, cl(sc * 11 - i))]} p={[-1.12 + i * 0.084, Y0 + 0.024 + lh + 0.0014, 0.03]} rot={[0, 0.3, 0]} r={0.0005} shadow={false}><meshBasicMaterial color="#54504a" /></RBox>)}
    <group position={[-0.7, Y0 + 0.46, 0.2]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.03, 40]} /><meshStandardMaterial color="#efe9db" roughness={0.5} /></mesh><RBox s={[0.008, 0.12, 0.005]} p={[0, 0.056, 0.019]} r={0.001}><meshBasicMaterial color="#1a1a1a" /></RBox><group rotation={[0, 0, -cl2 * 2 * PI * 2]}><RBox s={[0.006, 0.09, 0.005]} p={[0, 0.042, 0.022]} r={0.001}><meshBasicMaterial color="#b3261e" /></RBox></group></group>
    <RBox s={[1, lh, 0.62]} p={[-0.7, Y0 + 0.024 + lh * 1.5 + 0.005 + 0.4 * (1 - cl(b)), 0.03]} r={0.008}><Conc col="#b5b2a8" k="m" /></RBox>
    <RBox s={[1 + 0.14 * s, lerp(0.17, 0.095, s), 0.62]} p={[0.7, Y0 + 0.024 + lerp(0.085, 0.048, s), 0.03]} r={lerp(0.01, 0.045, s)}><Conc col="#aaa79c" k="n" /></RBox>
    <mesh position={[0.52, Y0 + 0.024 + lerp(0.17, 0.095, s) + 0.001, 0.036]} rotation={[0, 0, 0.24]}><planeGeometry args={[0.32 * s + 0.001, 0.008]} /><meshBasicMaterial color="#2a2722" /></mesh>
    <Tape txt="ONE HALF INCH AT A TIME" col="#1f7a3a" p={[-0.68, Y0 + 0.74, 0.2]} w={0.74} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3) * 2)} />
    <Tape txt="ALL AT ONCE: SLUMPS" col="#b3261e" p={[0.52, Y0 + 0.36, 0.2]} w={0.5} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
  </>;
}}</Scene3D>;

// 21:30 · EL SERRUCHO: el 2x4 va y viene apoyado en las dos losas y deja la rampa lisa
export const HScreed: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={{ at: [0.05, Y0 + 0.06, 0.05], az: [0.42, 0.22], el: [0.3, 0.26], r: [1.8, 1.7], fov: 32 }}>{(tt) => {
  const z = lerp(-0.42, 0.42, eio(tt, 0.7, 5.8)), saw = 0.09 * Math.sin(tt * 6.2) * cl(tt - 0.6), lip = 0.1, T = Y0 + 0.02 - lip;
  const N = 18;
  return <><Yard cut={false} />
    <Slab w={1.4} d={1.05} p={[-0.86, T - 0.1, 0]} k="a" /><Slab w={1.4} d={1.05} p={[0.9, Y0 - 0.08, 0]} k="b" />
    {Array.from({ length: N }, (_, i) => { const zc = -0.5 + (i * 1.0) / (N - 1), done = zc < z; return <group key={i} position={[0, 0, zc]}><Wedge l={0.72} h0={0.002} h1={lip} d={1.0 / N + 0.005} p={[-0.54, T, 0]} col={done ? CONC.fresh : "#938f83"} k={done ? "f" : "u"} />{!done && <RBox s={[0.7, 0.03, 1.0 / N + 0.002]} p={[-0.18, T + 0.05 + rn(i, 91) * 0.02, 0]} r={0.012}><Conc col="#938f83" k="u" /></RBox>}</group>; })}
    <Board l={1.9} p={[0.02 + saw, T + lip / 2 + 0.05, z]} rot={[0, 0, Math.atan2(lip, 0.72) * 0.72]} />
    <Tape txt="ONE END ON EACH SLAB" col="#1c2a3a" p={[0.2, Y0 + 0.44, -0.52]} w={0.66} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) * 2)} />
  </>;
}}</Scene3D>;

// 22:05 · NADA: la llana empuja hacia el final fino hasta que el borde desaparece; primer plano
export const HFeather: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [-0.3, Y0 + 0.02, 0.12], az: [-0.45, -0.25], el: [0.13, 0.08], r: [1.22, 1.10], fov: 28 }}>{(tt) => {
  const k = eio(tt, 0.5, 4.8), x = lerp(0.1, -0.62, k), h0 = lerp(0.02, 0.0009, k), tt2 = Math.sin(tt * 5) * 0.01;
  return <><Yard cut={false} />
    <Slab w={2.4} d={1.2} p={[-0.3, Y0 - 0.08, 0]} k="a" />
    <Wedge l={0.92} h0={h0} h1={0.09} p={[-0.82, Y0 + 0.021, 0]} d={0.9} col="#aeaba0" k="v" />
    <Trowel p={[x, Y0 + 0.021 + lerp(h0, 0.09, (x + 0.82) / 0.92) + 0.018 + tt2, 0.02]} rot={[0, 0, 0.1]} s={1.3} wide />
    <Tape txt="NOTHING LEFT" col="#1f7a3a" p={[-0.62, Y0 + 0.2, 0.3]} w={0.34} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) * 2)} />
  </>;
}}</Scene3D>;

// 22:55 · 400 LIBRAS: la barra sobre el taco levanta el borde; entre los bloques, no van los dedos
export const HPryBar: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={SEC}>{(tt) => {
  const a = eio(tt, 0.8, 3.0), rot = 0.22 * a;
  return <><Yard />
    <mesh position={[0.4, Y0 - 0.25, 0.355]}><planeGeometry args={[1.3, 0.18 * a + 0.002]} /><meshBasicMaterial color="#3a2617" toneMapped={false} /></mesh>
    <group position={[-0.28, Y0 - 0.18, 0.03]} rotation={[0, 0, rot * 0.4]}><Slab w={1.5} p={[0.75, 0.1, 0]} k="a" /></group>
    <Slab w={0.7} p={[-0.72, Y0 - 0.08, 0.03]} k="b" />
    <RBox s={[0.26, 0.14, 0.2]} p={[-0.56, Y0 + 0.095, 0.2]} r={0.01}>{M.wood({ base: [146, 104, 62] })}</RBox>
    <group position={[-0.56, Y0 + 0.17, 0.2]} rotation={[0, 0, 0.45 - rot * 1.5]}><mesh position={[-0.3, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 1.2, 14]} />{M.steel({ col: "#44484d" })}</mesh></group>
    <group position={[0.74, Y0 - 0.21, 0.32]}><RBox s={[0.2, 0.14 * Math.max(0.05, cl(phys(tt, 2.8, 7, 0.5))), 0.2]} r={0.01}>{M.wood({ base: [146, 104, 62] })}</RBox></group>
    <group position={[0.74, Y0 + 0.5, 0.2]}><RBox s={[0.6, 0.28, 0.03]} r={0.012}><meshStandardMaterial color="#e6dcc0" roughness={0.6} /></RBox></group>
    <Tape txt="400 POUNDS" col="#b3261e" p={[0.5, Y0 + 0.42, 0.24]} w={0.4} k={phys(tt, 1.9, 8, 0.45)} rev={cl((tt - 1.9) * 2)} />
    <Tape txt="GET HELP" col="#1c2a3a" p={[0.0, Y0 + 0.94, 0.2]} w={0.3} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
  </>;
}}</Scene3D>;

// 24:05 · LOS BANDERINES: salen de a uno; el pasto se vuelve corte y aparecen los caños de abajo
export const HFlags: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ at: [0, Y0 + 0.04, 0.04], az: [-0.22, 0.14], el: [0.26, 0.2], r: [2.9, 2.7], fov: 32 }}>{(tt) => {
  const N = 7, sf = (i: number) => phys(tt, 0.5 + i * 0.28, 8, 0.45), c = eio(tt, 3.5, 4.8);
  return <><Yard cut />
    <Slab w={3.4} d={0.5} p={[0, Y0 - 0.08, -0.3]} k="a" />
    <mesh position={[0, Y0 - 0.32, 0.361]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03 * c + 0.001, 0.03 * c + 0.001, 3.6, 20]} /><meshStandardMaterial color="#d6b02a" roughness={0.45} /></mesh>
    <mesh position={[0, Y0 - 0.2, 0.361]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.018 * c + 0.001, 0.018 * c + 0.001, 3.6, 16]} /><meshStandardMaterial color="#b3261e" roughness={0.45} /></mesh>
    {Array.from({ length: N }, (_, i) => { const k = cl(sf(i)), x = -1.6 + (i * 3.2) / (N - 1); return <group key={i} position={[x, Y0, 0.2]}><mesh position={[0, 0.28 * k, 0]}><cylinderGeometry args={[0.005, 0.005, 0.56 * k + 0.001, 8]} />{M.steel({ col: "#c8ccd0" })}</mesh><RBox s={[0.16, 0.1, 0.002]} p={[0.08, 0.5 * k, 0]} rot={[0, Math.sin(tt * 5 + i) * 0.25, 0]} r={0.001}><meshStandardMaterial color={i % 2 ? "#d6b02a" : "#b3261e"} roughness={0.6} /></RBox></group>; })}
    <Tape txt="GAS" col="#7a5c0a" p={[-0.72, Y0 - 0.32, 0.4]} w={0.13} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) * 2)} />
    <Tape txt="ELECTRIC" col="#b3261e" p={[0.6, Y0 - 0.2, 0.4]} w={0.26} k={phys(tt, 4.9, 8, 0.45)} rev={cl((tt - 4.9) * 2)} />
    <Tape txt="CALL 811" col="#1c2a3a" p={[0, Y0 + 0.62, 0.0]} w={0.32} k={phys(tt, 1.9, 8, 0.45)} rev={cl((tt - 1.9) * 2)} />
  </>;
}}</Scene3D>;

// 24:50 · HOMBRO Y MOLDE: la esquina se recorta en escuadra, la tabla se clava y se llena
export const HForm: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0.05, Y0 - 0.0, 0.12], az: [0.62, 0.42], el: [0.48, 0.42], r: [1.73, 1.60], fov: 32 }}>{(tt) => {
  const b = phys(tt, 1.4, 8, 0.45), f = eio(tt, 2.8, 3.9), off = eio(tt, 4.9, 5.7), R = [[0.34, 0.12], [0.3, -0.05], [0.42, 0.26], [0.2, 0.3]], loose = 1 - eio(tt, 0.3, 1.2);
  return <><Yard cut={false} />
    <Slab w={1.2} d={1.1} p={[-0.3, Y0 - 0.08, 0]} k="a" />
    <Slab w={0.5} d={0.54} p={[0.54, Y0 - 0.08, -0.28]} k="b" />
    {R.map(([a, c], i) => <RBox key={i} s={[0.1 + i * 0.03, 0.09, 0.08 + i * 0.03]} p={[a + 0.2 + (1 - loose) * 0.6, Y0 - 0.03 - (1 - loose) * 0.3, c + (1 - loose) * 0.4]} rot={[i, i * 0.6, 0.3]} r={0.014}><Conc k="r" /></RBox>)}
    {f > 0 && <RBox s={[0.5, 0.2 * f, 0.5]} p={[0.54, Y0 - 0.18 + 0.1 * f + 0.0, 0.24]} r={0.006}><Conc col="#b5b2a8" k="g" /></RBox>}
    <group position={[0.54 + 0.5 * off, 0, 0.51 + 0.5 * (1 - cl(b)) + 0.2 * off]}><Board l={0.52} h={0.2} d={0.03} p={[0, Y0 - 0.08, 0]} />{[-0.2, 0.2].map((x) => <RBox key={x} s={[0.03, 0.36, 0.03]} p={[x, Y0 - 0.1, 0.03]} r={0.004}>{M.wood({ base: [146, 104, 62] })}</RBox>)}</group>
    <group position={[1.0, 0, 0.0]}>{Array.from({ length: 0 }).map((_, i) => <mesh key={i} />)}</group>
    <Tape txt="SQUARE SHOULDER" col="#1c2a3a" p={[-0.26, Y0 + 0.22, 0.24]} rot={[-0.5, 0.5, 0]} w={0.5} k={phys(tt, 1.0, 8, 0.45)} rev={cl(tt - 1)} />
    <Tape txt="BRAND NEW EDGE" col="#1f7a3a" p={[-0.26, Y0 + 0.08, 0.5]} rot={[-0.5, 0.5, 0]} w={0.5} k={phys(tt, 5.6, 8, 0.45)} rev={cl((tt - 5.6) * 2)} />
  </>;
}}</Scene3D>;

// 26:10 · EL LUGAR PARA RAJARSE: con la junta la raya va derecha; sin junta dibuja lo que quiere
export const HJoint: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={{ at: [0, Y0 + 0.02, 0.08], az: [-0.08, 0.08], el: [0.8, 0.86], r: [2.0, 1.88], fov: 32 }}>{(tt) => {
  const k = eio(tt, 2.2, 5.0), pts = Array.from({ length: 13 }, (_, i) => [-0.56 + i * 0.094, 0.1 * Math.sin(i * 1.3) + 0.05 * Math.sin(i * 2.9 + 1)]);
  return <><Yard cut={false} />
    <Slab w={2.5} d={0.56} p={[0, Y0 - 0.08, -0.36]} k="a" col={CONC.fresh} />
    <Slab w={2.5} d={0.56} p={[0, Y0 - 0.08, 0.36]} k="b" col={CONC.fresh} />
    <RBox s={[0.022, 0.003, 0.56]} p={[0, Y0 + 0.024, -0.36]} r={0.0006} shadow={false}><meshBasicMaterial color="#2a2722" /></RBox>
    <RBox s={[0.008 + 0.01 * k, 0.003, 0.5 * k + 0.001]} p={[0.0, Y0 + 0.0255, -0.36]} r={0.0006} shadow={false}><meshBasicMaterial color="#14120f" /></RBox>
    {pts.slice(0, -1).map((p, i) => { const q = pts[i + 1], u = cl(k * 12 - i), dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz); return <RBox key={i} s={[l * u + 0.0008, 0.002, 0.012]} p={[p[0] + (dx * u) / 2, Y0 + 0.0245, 0.36 + (p[1] + q[1]) * 0.5 * 0.5]} rot={[0, -Math.atan2(dz, dx) * 0.5, 0]} r={0.0005} shadow={false}><meshBasicMaterial color="#14120f" /></RBox>; })}
    <Tape txt="JOINT KEPT: STRAIGHT LINE" col="#1f7a3a" p={[-0.86, Y0 + 0.05, -0.36]} rot={[-1.2, 0, 0]} w={0.72} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
    <Tape txt="COVERED: CROOKED" col="#b3261e" p={[-0.86, Y0 + 0.05, 0.36]} rot={[-1.2, 0, 0]} w={0.54} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) * 2)} />
  </>;
}}</Scene3D>;

// 27:00 · VEINTE MINUTOS: la línea se vierte, el secador la lleva y el reloj va comiéndose el tiempo
export const HPour: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ at: [0, Y0 + 0.1, 0.05], az: [-0.36, -0.16], el: [0.44, 0.34], r: [2.69, 2.53], fov: 32 }}>{(tt) => {
  const p = eio(tt, 0.4, 1.7), s = eio(tt, 1.9, 6.0), W = 1.5, zF = lerp(0.42, -0.42, s), arc = lerp(0.02, 2 * PI, 1 - eio(tt, 0.8, 7));
  return <><Yard cut={false} />
    <Slab w={2.1} d={1.1} p={[0, Y0 - 0.08, 0]} k="a" />
    <RBox s={[W, 0.05, 0.1]} p={[0, Y0 + 0.05, zF - 0.09]} r={0.022}><meshPhysicalMaterial color="#b5b2a8" roughness={0.35} clearcoat={0.5} /></RBox>
    {s > 0.001 && <RBox s={[W, 0.004, Math.max(0.01, 0.84 * s)]} p={[0, Y0 + 0.027, 0.42 - 0.42 * s]} r={0.001}><meshPhysicalMaterial color="#aeaba0" roughness={0.32} clearcoat={0.55} /></RBox>}
    <group position={[0, Y0 + 0.05, zF + 0.05]}><RBox s={[W + 0.2, 0.08, 0.05]} r={0.01}><meshStandardMaterial color="#2a2d30" roughness={0.6} /></RBox><group position={[0, 0.4, 0.34]} rotation={[-0.95, 0, 0]}><mesh><cylinderGeometry args={[0.018, 0.018, 1.1, 12]} />{M.wood({ base: [176, 134, 86] })}</mesh></group></group>
    <group position={[1.42, Y0 + 0.52, -0.22]} rotation={[-0.2, -0.36, 0]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.05, 48]} /><meshStandardMaterial color="#efe9db" roughness={0.5} /></mesh><mesh position={[0, 0, 0.028]}><ringGeometry args={[0.1, 0.27, 64, 1, PI / 2 - arc, arc]} /><meshBasicMaterial color="#b3261e" side={THREE.DoubleSide} toneMapped={false} /></mesh></group>
    <Tape txt="20 MINUTES" col="#b3261e" p={[1.42, Y0 + 0.12, -0.12]} rot={[-0.3, -0.36, 0]} w={0.42} k={phys(tt, 1.0, 8, 0.45)} rev={cl(tt - 1)} />
  </>;
}}</Scene3D>;

// 27:45 · PISTA DE PATINAJE: dos suelas bajo la lluvia; en lo liso se va, en lo barrido agarra
export const HSkate: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={{ at: [0, Y0 + 0.14, 0.12], az: [-0.1, 0.08], el: [0.28, 0.26], r: [2.37, 2.24], fov: 32 }}>{(tt) => {
  const n = Math.round(eio(tt, 0.5, 2.0) * 34), sl = eio(tt, 2.9, 4.4);
  return <><Yard cut={false} />
    <Slab w={1.2} d={1.1} p={[-0.65, Y0 - 0.08, 0.02]} k="a" col="#8f8d85" gloss /><Slab w={1.2} d={1.1} p={[0.65, Y0 - 0.08, 0.02]} k="b" col={CONC.fresh} />
    {Array.from({ length: n }, (_, i) => <RBox key={i} s={[1.1, 0.003, 0.007]} p={[0.65, Y0 + 0.0245, -0.5 + i * 0.03]} r={0.001} shadow={false}><meshBasicMaterial color="#716e66" /></RBox>)}
    <Boot p={[-0.88 + 0.72 * sl, Y0 + 0.024 + 0.14 * Math.sin(sl * PI) * 0.4, 0.08]} rot={[0, 0, 0.16 * sl]} s={0.7} />
    <Boot p={[0.65, Y0 + 0.024, 0.08]} s={0.7} />
    {Array.from({ length: 34 }, (_, i) => { const u = (tt * 1.5 + rn(i, 95)) % 1; return <RBox key={i} s={[0.003, 0.09, 0.003]} p={[-1.4 + rn(i, 96) * 2.8, Y0 + 1.5 - 1.5 * u, -0.5 + rn(i, 97)]} r={0.0008} shadow={false}><meshBasicMaterial color="#c9dcec" transparent opacity={0.68} depthWrite={false} toneMapped={false} /></RBox>; })}
    <Tape txt="SKATING RINK" col="#b3261e" p={[-0.65, Y0 + 0.05, 0.72]} rot={[-1.0, 0, 0]} w={0.46} k={phys(tt, 4.1, 8, 0.45)} rev={cl((tt - 4.1) * 2)} />
    <Tape txt="BROOM IT: GRIP" col="#1f7a3a" p={[0.65, Y0 + 0.05, 0.72]} rot={[-1.0, 0, 0]} w={0.48} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) * 2)} />
  </>;
}}</Scene3D>;

// 28:15 (bloque cierre) · COMIDA POR LA SAL: cráteres que crecen de un lado; arena que sólo está del otro
export const HSalt: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" {...SKY} cam={{ at: [0, Y0 + 0.02, 0.04], az: [-0.08, 0.1], el: [0.74, 0.8], r: [1.5, 1.41], fov: 30 }}>{(tt) => {
  const d = eio(tt, 0.3, 1.4), e = eio(tt, 1.8, 5.2), N = 42;
  return <><Yard cut={false} />
    <Slab w={1.12} d={1.1} p={[-0.6, Y0 - 0.08, 0]} k="a" /><Slab w={1.12} d={1.1} p={[0.6, Y0 - 0.08, 0]} k="b" />
    {Array.from({ length: N }, (_, i) => { const x = -1.08 + rn(i, 101) * 0.96, z = -0.48 + rn(i, 102) * 0.96, e2 = e * (0.5 + rn(i, 103) * 0.7), f = cl(d * 3 - rn(i, 104) * 2); return <group key={i}>
      {e2 > 0.001 && <mesh position={[x, Y0 + 0.0246, z]} rotation={[-PI / 2, 0, rn(i, 105) * 3]} scale={[1, 0.8 + rn(i, 106) * 0.3, 1]}><circleGeometry args={[0.008 + 0.046 * e2, 20]} /><meshBasicMaterial color="#403b32" transparent opacity={0.9} depthWrite={false} /></mesh>}
      {f > 0 && e < 0.72 && <mesh position={[x, Y0 + 0.034 - 0.01 * e, z]} rotation={[rn(i, 107) * 3, rn(i, 108) * 3, 0]}><boxGeometry args={[0.014, 0.014, 0.014]} /><meshStandardMaterial color="#f1f3f5" roughness={0.3} transparent opacity={1 - e / 0.72 + 0.02} /></mesh>}
    </group>; })}
    {Array.from({ length: 170 }, (_, i) => { const f = cl(d * 3 - rn(i, 111) * 2); return f > 0 && <mesh key={i} position={[0.12 + rn(i, 112) * 0.96, Y0 + 0.028, -0.48 + rn(i, 113) * 0.96]}><sphereGeometry args={[0.0055, 6, 5]} /><meshStandardMaterial color="#b89b68" roughness={0.9} /></mesh>; })}
    <Tape txt="SALT EATS IT" col="#b3261e" p={[-0.6, Y0 + 0.06, 0.66]} rot={[-1.2, 0, 0]} w={0.42} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) * 2)} />
    <Tape txt="SAND JUST GRIPS" col="#1f7a3a" p={[0.6, Y0 + 0.06, 0.66]} rot={[-1.2, 0, 0]} w={0.48} k={phys(tt, 4.4, 8, 0.45)} rev={cl((tt - 4.4) * 2)} />
  </>;
}}</Scene3D>;

// comentario: un cartel clavado en el jardín, con la frase

const Sign = () => tex.text("signthk", 1024, 512, (g) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 1024, 512); g.fillStyle = "#22181a"; g.font = "bold 92px Georgia"; g.textAlign = "center"; g.fillText("Thank God", 512, 138); g.fillText("I jumped ahead.", 512, 258); g.font = "60px Georgia"; g.fillStyle = "#6b6052"; g.fillText("“This video shows nothing useful.”", 512, 396); });
export const HThankGod: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={{ at: [0, Y0 + 0.62, 0], az: [-0.26, 0.18], el: [0.08, 0.1], r: [2.0, 1.89], fov: 32 }}>{(tt) => {
  const d = tt < 1.0 ? lerp(1.2, 0, Math.pow(cl(tt), 2)) : 0.0, sh = tt > 1 ? 0.016 * Math.exp(-(tt - 1) * 5) * Math.sin((tt - 1) * 30) : 0;
  return <><Yard cut={false} />
    <Slab w={3.4} d={0.7} p={[0, Y0 - 0.08, 0.5]} k="a" />
    <group position={[0, Y0 + d, -0.1]} rotation={[0, 0, sh]}><RBox s={[0.08, 0.9, 0.06]} p={[0, 0.22, -0.03]} r={0.008}>{M.wood({ base: [130, 92, 56] })}</RBox>
      <RBox s={[1.42, 0.74, 0.04]} p={[0, 0.76, 0]} r={0.012}>{M.wood({ base: [122, 84, 50] })}</RBox>
      <mesh position={[0, 0.76, 0.0215]}><planeGeometry args={[1.32, 0.66]} /><meshStandardMaterial map={Sign()} roughness={0.85} /></mesh></group>
  </>;
}}</Scene3D>;

// 29:10 · TU FIN DE SEMANA: estacas con cartel que se clavan a lo largo de la vereda y la cámara las recorre
export const HWeekend: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [-0.9, Y0 + 0.15, 0.1], at1: [0.9, Y0 + 0.15, 0.1], az: [-0.46, -0.36], el: [0.28, 0.26], r: [2.82, 2.69], fov: 32 }}>{(tt) => {
  const L = [["WEEK BEFORE", "TEST + WATER"], ["DAY BEFORE", "TRIM + WASH"], ["SATURDAY", "CRACKS, EDGES, RAMP"], ["NEXT DAY", "ONE THIN COAT"]];
  return <><Yard cut={false} />
    <Slab w={4.8} d={0.7} p={[0, Y0 - 0.08, 0.5]} k="a" />
    {L.map(([a, b], i) => { const x = -1.5 + i, k = cl(phys(tt, 0.4 + i * 1.35, 8, 0.45)); return <group key={i} position={[x, Y0 + 0.9 * (1 - k), -0.05]}><RBox s={[0.05, 0.64, 0.04]} p={[0, 0.1, -0.02]} r={0.006}>{M.wood({ base: [146, 104, 62] })}</RBox>
      <Tape txt={a} col="#b3261e" p={[0, 0.48, 0.02]} w={0.5} k={k} rev={k} />
      <Tape txt={b} col="#1c2a3a" p={[0, 0.3, 0.02]} w={0.6} k={k} rev={k} /></group>; })}
  </>;
}}</Scene3D>;

// 30:30 · MEDIA PULGADA Y UN BASTÓN: la punta del bastón choca y el mismo bastón pasa cuando hay rampa
export const HCane: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={{ at: [-0.05, Y0 + 0.26, 0.12], az: [-0.22, 0.1], el: [0.1, 0.13], r: [1.5, 1.41], fov: 30 }}>{(tt) => {
  const r = eio(tt, 3.0, 4.2), x = tt < 3.0 ? lerp(-0.7, -0.05, eio(tt, 0.4, 1.7)) : lerp(-0.42, 0.42, eio(tt, 4.3, 6.1)), lip = 0.06, g = tt < 3 ? 0.34 * cl((tt - 1.7) * 4) * (1 - cl((tt - 2.7) * 4)) : 0;
  const floorY = x < -0.04 ? (tt < 3 ? 0 : lip * r * cl((x + 0.75) / 0.71)) : lip;
  return <><Yard />
    <Slab w={1.5} p={[-0.8, Y0 - 0.08 - lip + 0.0, 0.03]} k="a" /><Slab w={1.5} p={[0.72, Y0 - 0.08, 0.03]} k="b" />
    <Wedge l={0.7} h0={0.0008} h1={lip * r} p={[-0.74, Y0 + 0.02 - lip, 0.03]} />
    <group position={[x, Y0 + 0.02 - lip + floorY, 0.2]} rotation={[0, 0, -0.14 + g]}><mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.016, 0.016, 1.2, 14]} />{M.wood({ base: [96, 60, 36] })}</mesh><mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.03, 0.03, 0.04, 16]} /><meshStandardMaterial color="#1b1b1c" roughness={0.85} /></mesh></group>
    <Tape txt="HALF AN INCH" col="#b3261e" p={[0.34, Y0 + 0.46, 0.14]} w={0.38} k={phys(tt, 1.8, 8, 0.45)} rev={cl((tt - 1.8) * 2)} />
    <Tape txt="AS IF YOUR MOTHER" col="#1f7a3a" p={[-0.3, Y0 + 0.82, 0.14]} w={0.58} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) * 2)} />
  </>;
}}</Scene3D>;
