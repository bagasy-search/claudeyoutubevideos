// ohf8pe · componentes únicos 13-24: aliento, doce platos, cinco comidas, tres pinzas, termómetro, escalera, dos cuartos, niebla, canasta, dos ojos de buey, tambor, freezer
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Tape } from "./okit";
import { Bug, MiniBed, PI, Specks, Steam, faceTex, quilt, sv, walk } from "./bkit";

const cloth = (c: string) => <meshStandardMaterial color={c} roughness={0.95} />;

// ---- EL ALIENTO: quien duerme exhala; la nube corre por la sábana y la chinche la sigue ----
export const HBreathTrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[0.4, 2, 1.9]}
  cam={{ at: [0.05, 0.42, 0], az: [0.22, -0.16], el: [0.24, 0.16], r: [1.9, 1.7], fov: 32 }}>{(tt) => { const u = eio(tt, 2.2, 5.0), breath = 0.5 + 0.5 * Math.sin(tt * 1.8);
  return <>
    <RBox s={[3, 0.3, 1.3]} p={[0, 0.12, 0]} r={0.04}>{quilt("btq", "#d9d4c6", "#c2bcab")}</RBox>
    <RBox s={[0.6, 0.12, 0.62]} p={[-0.62, 0.33, 0]} r={0.05}><meshStandardMaterial color="#efece2" roughness={0.9} /></RBox>
    <mesh position={[-0.6, 0.5, 0]} scale={[1, 1, 0.86]} castShadow><sphereGeometry args={[0.15, 32, 22]} /><meshStandardMaterial color="#c79a7b" roughness={0.75} /></mesh>
    <mesh position={[-0.63, 0.61, 0]} scale={[1.05, 0.5, 0.9]}><sphereGeometry args={[0.15, 28, 16]} /><meshStandardMaterial color="#9b9892" roughness={1} /></mesh>
    <mesh position={[0.34, 0.33 + 0.012 * breath, 0]} rotation={[0, 0, 0]} scale={[2.4, 0.42 + 0.03 * breath, 1.4]}><sphereGeometry args={[0.3, 40, 24]} /><meshStandardMaterial color="#58708a" roughness={0.95} /></mesh>
    {Array.from({ length: 30 }, (_, i) => { const v = (tt * 0.3 + rn(i, 61)) % 1; return <mesh key={i} position={[-0.42 + v * 1.65, 0.54 - v * 0.2 + Math.sin(v * 8 + i) * 0.03, (rn(i, 62) - 0.5) * (0.1 + v * 0.3) + 0.46]}><sphereGeometry args={[0.022 + v * 0.03, 12, 9]} /><meshStandardMaterial color="#b6d4ea" roughness={1} transparent opacity={0.42 * Math.sin(v * PI)} depthWrite={false} /></mesh>; })}
    <Bug p={[lerp(1.3, 0.48, u), 0.28, 0.5]} ry={PI} s={1.7} run={tt} />
    <Tape txt="YOUR BREATH" p={[0.4, 0.92, 0.3]} w={0.62} k={phys(tt, 1.4, 8, 0.45)} rev={cl((tt - 1.4) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- DOCE PLATOS: doce vacíos, uno por mes; camina por todos y sigue viva ----
const PLAT: [number, number][] = Array.from({ length: 12 }, (_, i) => { const r = i < 6 ? -0.3 : 0.3, c = i < 6 ? i : 11 - i; return [-1.0 + c * 0.4, r]; });
export const HTwelvePlates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" key1={[-0.6, 2.5, 1.5]}
  cam={{ at: [0, 0.1, 0], az: [-0.24, 0.22], el: [0.72, 0.56], r: [3.0, 2.7], fov: 32 }}>{(tt) => { const u = cl((tt - 0.5) / 4.9), { x, z, ry } = walk(PLAT, u), done = Math.floor(u * 11.99);
  return <>
    {PLAT.map(([a, b], i) => <group key={i} position={[a, 0.05, b]}>
      <mesh castShadow scale={[1, 0.14, 1]}><cylinderGeometry args={[0.17, 0.12, 0.16, 44]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.024, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.11, 36]} /><meshStandardMaterial color={i <= done ? "#e9e1d0" : "#f9f6ee"} roughness={0.4} /></mesh>
    </group>)}
    <Bug p={[x, 0.09, z]} ry={ry} s={2} run={tt} />
    <Tape txt="12 MONTHS NOTHING" p={[0, 0.54, 0.05]} w={0.92} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- CINCO COMIDAS: cinco tamaños en fila; sin gota no hay paso siguiente ----
export const HFiveMeals: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[0.5, 2.3, 2]}
  cam={{ at: [0.04, 0.2, 0], az: [0.2, -0.14], el: [0.3, 0.24], r: [2.15, 1.95], fov: 32 }}>{(tt) => <>
    <RBox s={[3.4, 0.1, 1.4]} p={[0, -0.05, 0]} r={0.02}>{quilt("fmq")}</RBox>
    {[0, 1, 2, 3, 4].map((i) => { const a = 0.5 + i * 1.0, d = eio(tt, a, a + 0.55), k = phys(tt, a + 0.55, 7, 0.5), S = 0.8 + i * 0.75, X = -1.05 + i * 0.5 + i * i * 0.012; return <group key={i}>
      {d > 0 && d < 1 && <mesh position={[X, lerp(0.86, 0.1, d * d), 0]} scale={[0.8, 1.2, 0.8]}><sphereGeometry args={[0.04, 18, 14]} /><meshPhysicalMaterial color="#8d1a14" roughness={0.12} clearcoat={1} /></mesh>}
      <Bug p={[X, 0, 0]} s={sv(k * S)} fed={0.35 + i * 0.1} pale={i < 3} run={tt * 0.15} ry={0.3} />
    </group>; })}
    <Tape txt="5 MEALS TO GROW" p={[0, 0.62, 0.1]} w={0.86} k={phys(tt, 5.3, 8, 0.45)} rev={cl((tt - 5.3) / 0.6)} />
  </>}</Scene3D>;

// ---- TRES PINZAS: en la soga, tres tarjetas con 14 días entre cada una ----
export const HThreePins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[-0.5, 2.2, 2]}
  cam={{ at: [0, 0.72, 0], az: [-0.18, 0.14], el: [0.08, 0.06], r: [2.2, 2.0], fov: 32 }}>{(tt) => <>
    <mesh position={[0, 1.08, 0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.007, 3.2, 8]} /><meshStandardMaterial color="#cdbf9f" roughness={1} /></mesh>
    {[0, 1, 2].map((i) => { const a = 0.6 + i * 1.25, k = phys(tt, a, 7, 0.45), X = -0.72 + i * 0.72, sw = Math.sin((tt - a) * 5) * 0.14 * Math.exp(-(Math.max(0, tt - a)) * 1.3);
      return <group key={i} position={[X, lerp(1.9, 1.08, k), 0.1]} rotation={[0, 0, sw]}>
        <RBox s={[0.42, 0.56, 0.012]} p={[0, -0.32, 0]} r={0.004}><meshStandardMaterial map={faceTex(`tp${i}`, String(i + 1), "#f4efe1", i === 2 ? "#b3261e" : "#2a2119")} roughness={0.85} /></RBox>
        <RBox s={[0.05, 0.14, 0.05]} p={[0, -0.02, 0.01]} r={0.008}>{M.wood({ rx: 1, ry: 2, base: [206, 170, 118] })}</RBox>
      </group>; })}
    {[0, 1].map((i) => <Tape key={i} txt="14 DAYS" p={[-0.36 + i * 0.72, 0.3, 0.2]} w={0.32} k={phys(tt, 1.7 + i * 1.25, 8, 0.45)} rev={cl((tt - 1.7 - i * 1.25) / 0.5)} />)}
  </>}</Scene3D>;

// ---- 120°: sube el mercurio; al cruzar la raya, adulta, cría y huevo se apagan ----
export const HHeatLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" key1={[-0.5, 2.3, 2]}
  cam={{ at: [0.15, 0.56, 0], az: [0.2, -0.12], el: [0.14, 0.1], r: [2.75, 2.5], fov: 32 }}>{(tt) => { const f = eio(tt, 0.6, 3.4), L = lerp(0.1, 1.06, f), d = eio(tt, 2.9, 3.8), mark = 0.17 + 0.86;
  return <>
    <group position={[-0.6, 0, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow><sphereGeometry args={[0.13, 32, 24]} /><meshPhysicalMaterial color="#c8281e" roughness={0.18} clearcoat={1} /></mesh>
      <mesh position={[0, 0.17 + L / 2, 0]}><cylinderGeometry args={[0.04, 0.04, L, 24]} /><meshStandardMaterial color="#c8281e" roughness={0.3} /></mesh>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.07, 0.07, 1.2, 32, 1, true]} /><meshPhysicalMaterial color="#f2f7f8" transparent opacity={0.2} roughness={0.05} clearcoat={1} side={2} depthWrite={false} /></mesh>
      {Array.from({ length: 11 }, (_, i) => <RBox key={i} s={[i % 5 === 0 ? 0.14 : 0.08, 0.008, 0.008]} p={[0.13, 0.2 + i * 0.1, 0.05]} r={0.001}><meshStandardMaterial color="#2a2119" /></RBox>)}
      <RBox s={[0.4, 0.016, 0.02]} p={[0.16, mark, 0.06]} r={0.002}><meshBasicMaterial color="#e3593a" /></RBox>
    </group>
    <Bug p={[0.02, 0.05, 0.1]} s={sv(2.1 * (1 - 0.18 * d))} dead={d} ry={-0.4} run={d < 0.4 ? tt : 0} />
    <Bug p={[0.56, 0.05, 0.1]} s={sv(1.4 * (1 - 0.18 * d))} dead={d} ry={0.5} pale run={d < 0.4 ? tt : 0} />
    <mesh position={[1.0, 0.075, 0.1]} scale={[1, 1, 1.5]}><sphereGeometry args={[0.03, 20, 14]} /><meshStandardMaterial color={d > 0.5 ? "#2b2723" : "#fbf6e6"} roughness={0.4} /></mesh>
    <Tape txt="120°F" col="#b3261e" p={[-0.08, 1.14, 0.1]} w={0.42} k={phys(tt, 2.7, 8, 0.45)} rev={cl((tt - 2.7) / 0.5)} />
    <Tape txt="EVERY STAGE" p={[0.56, 0.5, 0.2]} w={0.62} k={phys(tt, 4.1, 8, 0.45)} rev={cl((tt - 4.1) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA ESCALERA: el colchón baja arrastrado y en cada escalón quedan bichos ----
export const HStairShed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[0.6, 2.6, 2]}
  cam={{ at: [0, 0.68, 0], az: [0.42, 0.2], el: [0.2, 0.16], r: [2.9, 2.62], fov: 32 }}>{(tt) => { const u = eio(tt, 0.6, 4.4), N = 6, cx = lerp(1.08, -1.1, u), cy = lerp(1.58, 0.42, u);
  return <>
    {Array.from({ length: N }, (_, i) => <RBox key={i} s={[0.36, 0.2 + i * 0.22, 1.1]} p={[-0.9 + i * 0.36, 0.1 + i * 0.11 + 0.02, 0]} r={0.006}>{M.wood({ rx: 2, ry: 1, base: [146 + i * 3, 104, 66] })}</RBox>)}
    {Array.from({ length: N }, (_, i) => { const X = -0.9 + i * 0.36, top = 0.22 + i * 0.22 + 0.02; return <Specks key={i} id={70 + i} n={14} w={0.3} d={0.9} p={[X, top, 0]} k={cl((X - cx + 0.4) / 0.3)} size={0.02} />; })}
    <group position={[cx, cy, 0]} rotation={[0, 0, 0.55]}><RBox s={[1.5, 0.2, 0.84]} r={0.05}>{quilt("ssh")}</RBox></group>
    <Tape txt="EVERY STAIR" p={[-0.5, 1.26, 0.4]} w={0.7} k={phys(tt, 3.1, 8, 0.45)} rev={cl((tt - 3.1) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- DOS CUARTOS: la almohada se muda al sofá y la fila de chinches la sigue por la puerta ----
const FOL: [number, number][] = [[-0.85, 0.3], [-0.3, 0.5], [0, 0.34], [0.3, 0.16], [0.82, 0.2]];
export const HFollowRooms: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.3, 2.8, 1.5]}
  cam={{ at: [0, 0.2, 0.1], az: [0.24, -0.1], el: [0.72, 0.6], r: [3.0, 2.7], fov: 32 }}>{(tt) => { const p = eio(tt, 0.7, 2.2);
  return <>
    <RBox s={[0.08, 0.34, 0.86]} p={[0, 0.17, -0.47]} r={0.006}><meshStandardMaterial color="#dcd3bf" roughness={0.9} /></RBox>
    <RBox s={[0.08, 0.34, 0.5]} p={[0, 0.17, 0.72]} r={0.006}><meshStandardMaterial color="#dcd3bf" roughness={0.9} /></RBox>
    <MiniBed p={[-0.84, 0.04, -0.2]} id="fr" />
    <group position={[0.86, 0.04, -0.2]}>
      <RBox s={[0.96, 0.16, 0.42]} p={[0, 0.12, 0]} r={0.03}>{cloth("#6f5a4a")}</RBox>
      <RBox s={[0.96, 0.3, 0.1]} p={[0, 0.23, -0.2]} r={0.03}>{cloth("#62503f")}</RBox>
    </group>
    <RBox s={[0.26, 0.08, 0.3]} p={[lerp(-1.1, 0.7, p), 0.4 + Math.sin(p * PI) * 0.5 - 0.08 * p, lerp(-0.2, -0.16, p)]} r={0.035}><meshStandardMaterial color="#f7f4ec" roughness={0.9} /></RBox>
    {Array.from({ length: 7 }, (_, i) => { const u = cl((tt - 2.2 - i * 0.3) / 2.2), { x, z, ry } = walk(FOL, u); return u > 0 ? <Bug key={i} p={[x, 0.045, z]} ry={ry} s={1.6} run={tt + i} /> : null; })}
    <Tape txt="NOW TWO ROOMS" p={[0, 0.72, 0.1]} w={0.86} k={phys(tt, 4.6, 8, 0.45)} rev={cl((tt - 4.6) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- LA NIEBLA: en corte, la nube se queda arriba; las chinches bajan más hondo ----
export const HFogTop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[0.5, 2.2, 2]}
  cam={{ at: [0, 0.62, 0], az: [0.14, -0.14], el: [0.08, 0.05], r: [2.05, 1.86], fov: 32 }}>{(tt) => { const f = eio(tt, 0.5, 2.4), d = eio(tt, 2.0, 4.6);
  return <>
    {[-1.05, -0.21, 0.63].map((x, i) => <RBox key={i} s={[0.72, 0.62, 0.8]} p={[x + 0.21, 0.31, 0]} r={0.005}>{M.wood({ rx: 1, ry: 2, base: [150 - i * 8, 108, 68] })}</RBox>)}
    {[-0.42, 0.42].map((x) => <RBox key={x} s={[0.14, 0.62, 0.01]} p={[x, 0.31, -0.3]} r={0.001}><meshStandardMaterial color="#0d0a08" /></RBox>)}
    <group position={[0.84, 0.63, 0]}><mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.26, 28]} />{M.steel({ col: "#c8ccd0" })}</mesh></group>
    {Array.from({ length: 70 }, (_, i) => { const u = cl(f * 1.3 - rn(i, 71) * 0.3), x = lerp(0.84, -1.5 + rn(i, 72) * 3, u), y = 0.95 + rn(i, 73) * 0.42 - 0.2 * u; return <mesh key={i} position={[x, y, (rn(i, 74) - 0.5) * 0.9]}><sphereGeometry args={[0.1 + rn(i, 75) * 0.12, 12, 9]} /><meshStandardMaterial color="#d7dcd9" roughness={1} transparent opacity={0.3 * u} depthWrite={false} /></mesh>; })}
    {[-0.42, 0.42].flatMap((x, a) => [0, 1, 2].map((i) => <Bug key={a + "" + i} p={[x + 0.012, lerp(0.54 - i * 0.05, 0.2 - i * 0.05, d), 0.0]} rz={-PI / 2} ry={0} s={0.72} run={tt + i} />))}
    <Tape txt="NEVER REACHES THE CRACK" col="#b3261e" p={[0, 0.36, 0.56]} w={1.0} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA CANASTA: siete cosas de ferretería caen de a una y entran justas ----
export const HBasket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none" key1={[-0.5, 2.4, 1.9]}
  cam={{ at: [0, 0.45, 0], az: [-0.22, 0.14], el: [0.34, 0.26], r: [2.15, 1.94], fov: 32 }}>{(tt) => { const yy = (a: number, Y: number) => lerp(2.2, Y, phys(tt, a, 8, 0.6));
  return <>
    {[0, 0.28, 0.56].map((y) => <RBox key={y} s={[1.3, 0.015, 0.84]} p={[0, 0.06 + y, 0]} r={0.002}><meshStandardMaterial color="#b3b7ba" metalness={0.8} roughness={0.35} transparent opacity={y === 0 ? 1 : 0.0001} depthWrite={y === 0} /></RBox>)}
    {[-0.65, -0.325, 0, 0.325, 0.65].flatMap((x) => [-0.42, 0.42].map((z) => <mesh key={x + "" + z} position={[x, 0.33, z]}><cylinderGeometry args={[0.006, 0.006, 0.56, 8]} /><meshStandardMaterial color="#b3b7ba" metalness={0.8} roughness={0.35} /></mesh>))}
    {[-0.65, -0.21, 0.21, 0.65].flatMap((x) => [0.2, 0.61].map((y) => <RBox key={x + "" + y} s={[0.012, 0.012, 0.84]} p={[x, y, 0]} r={0.002}><meshStandardMaterial color="#b3b7ba" metalness={0.8} roughness={0.35} /></RBox>))}
    {[-0.42, 0, 0.42].flatMap((z) => [0.2, 0.61].map((y) => <RBox key={z + "" + y} s={[1.3, 0.012, 0.012]} p={[0, y, z]} r={0.002}><meshStandardMaterial color="#b3b7ba" metalness={0.8} roughness={0.35} /></RBox>))}
    <RBox s={[0.3, 0.3, 0.26]} p={[-0.42, yy(0.5, 0.23), -0.16]} r={0.01}>{cloth("#2a2a2c")}</RBox>
    <mesh position={[0.18, yy(1.0, 0.13), 0.2]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.09, 26]} /><meshStandardMaterial color="#d9cfae" roughness={0.6} /></mesh>
    <mesh position={[-0.02, yy(1.6, 0.14), -0.18]} rotation={[0, 0.4, PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.42, 22]} /><meshStandardMaterial color="#efe9da" roughness={0.5} /></mesh>
    <RBox s={[0.36, 0.2, 0.3]} p={[0.42, yy(2.2, 0.17), -0.16]} r={0.012}><meshStandardMaterial map={faceTex("bzip", "ZIP", "#dfe8ee", "#254059", 110)} roughness={0.7} /></RBox>
    {[-0.1, 0.06].map((x, i) => <mesh key={x} position={[x - 0.34, yy(2.8 + i * 0.2, 0.42), 0.2]} rotation={[PI, 0, 0]}><cylinderGeometry args={[0.1, 0.08, 0.08, 28, 1, true]} /><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.45} roughness={0.08} clearcoat={1} side={2} depthWrite={false} /></mesh>)}
    <group position={[0.5, yy(3.5, 0.62), 0.2]} rotation={[0.1, 0.5, -0.8]}><mesh castShadow><cylinderGeometry args={[0.03, 0.05, 0.56, 20]} />{M.matte({ col: "#7d8a92" })}</mesh></group>
    <group position={[0.05, yy(4.1, 0.56), 0.0]} rotation={[0.3, 0, 0.9]}><mesh castShadow><cylinderGeometry args={[0.02, 0.02, 0.5, 14]} />{M.chrome()}</mesh></group>
  </>;
}}</Scene3D>;

// ---- DOS OJOS DE BUEY: en el agua nada contenta; en el calor se apaga ----
const Porthole: React.FC<{ x: number; col: string; children?: React.ReactNode }> = ({ x, col, children }) => <group position={[x, 0.7, 0]}>
  <mesh position={[0, 0, -0.1]}><circleGeometry args={[0.46, 56]} /><meshBasicMaterial color={col} /></mesh>
  {children}
  <mesh position={[0, 0, 0.02]}><torusGeometry args={[0.47, 0.04, 16, 70]} />{M.chrome()}</mesh>
</group>;
export const HWashDry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.2, 2, 2.2]}
  cam={{ at: [0, 0.72, 0], az: [0.14, -0.12], el: [0.06, 0.04], r: [2.15, 1.95], fov: 32 }}>{(tt) => { const d = eio(tt, 2.8, 3.9);
  return <>
    <RBox s={[2.6, 1.5, 0.1]} p={[0, 0.72, -0.2]} r={0.02}><meshStandardMaterial color="#eeeae0" roughness={0.45} /></RBox>
    <Porthole x={-0.58} col="#467ea0">
      {Array.from({ length: 12 }, (_, i) => { const v = (tt * 0.38 + rn(i, 81)) % 1; return <mesh key={i} position={[(rn(i, 82) - 0.5) * 0.7, -0.4 + v * 0.8, -0.06]}><sphereGeometry args={[0.012 + rn(i, 83) * 0.02, 10, 8]} /><meshStandardMaterial color="#d4ecf6" transparent opacity={0.65} /></mesh>; })}
      <group rotation={[PI / 2, 0, 0]}><Bug p={[Math.sin(tt * 0.9) * 0.1, -0.01, Math.cos(tt * 1.3) * 0.08]} s={2.2} run={tt} ry={Math.sin(tt)} /></group>
    </Porthole>
    <Porthole x={0.58} col={"#d0681f"}>
      <group rotation={[PI / 2, 0, 0]}><Bug p={[0, -0.01, 0]} s={2.2} dead={d} run={d < 0.5 ? tt : 0} /></group>
      <mesh position={[0, 0, -0.08]}><circleGeometry args={[0.45, 48]} /><meshBasicMaterial color="#ffcb6b" transparent opacity={0.22 + 0.12 * Math.sin(tt * 2)} /></mesh>
    </Porthole>
    <Tape txt="WASHER: ALIVE" p={[-0.58, 0.14, 0.14]} w={0.62} k={phys(tt, 1.1, 8, 0.45)} rev={cl((tt - 1.1) / 0.6)} />
    <Tape txt="DRYER: DONE" col="#b3261e" p={[0.58, 0.14, 0.14]} w={0.56} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL MEDIO DE LA PILA: dos tambores; el relleno queda azul en el centro, el otro se calienta entero ----
const Drum: React.FC<{ x: number; tt: number; n: number; R: number; heat: (i: number, r: number) => number }> = ({ x, tt, n, R, heat }) => <group position={[x, 0.72, 0]}>
  <mesh position={[0, 0, -0.3]}><circleGeometry args={[0.58, 60]} /><meshStandardMaterial color="#3b3b3d" metalness={0.5} roughness={0.5} /></mesh>
  <mesh><torusGeometry args={[0.58, 0.035, 14, 70]} />{M.steel({ col: "#c8ccd0" })}</mesh>
  {Array.from({ length: n }, (_, i) => { const a = rn(i, 91) * 6.28, r0 = Math.sqrt(rn(i, 92)) * R, rot = a + tt * 0.5, px = Math.cos(rot) * r0, py = Math.sin(rot) * r0 - (0.54 - R) * 0.7, k = cl(heat(i, r0 / R)); return <mesh key={i} position={[px, py, (rn(i, 93) - 0.5) * 0.3]}><sphereGeometry args={[0.1, 14, 10]} /><meshStandardMaterial color={`rgb(${Math.round(lerp(92, 236, k))},${Math.round(lerp(132, 124, k))},${Math.round(lerp(198, 46, k))})`} roughness={0.95} /></mesh>; })}
</group>;
export const HMiddlePile: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[0.3, 2.1, 2.2]}
  cam={{ at: [0, 0.74, 0], az: [-0.16, 0.12], el: [0.06, 0.04], r: [2.3, 2.1], fov: 32 }}>{(tt) => { const g = eio(tt, 0.8, 4.6);
  return <>
    <Drum x={-0.68} tt={tt} n={46} R={0.44} heat={(i, r) => g * 1.6 * r * r} />
    <Drum x={0.68} tt={tt} n={15} R={0.3} heat={() => g * 1.2} />
    <Tape txt="PACKED: COLD MIDDLE" col="#b3261e" p={[-0.68, 0.06, 0.2]} w={0.74} k={phys(tt, 3.5, 8, 0.45)} rev={cl((tt - 3.5) / 0.6)} />
    <Tape txt="ROOM: HOT THROUGH" p={[0.68, 0.06, 0.2]} w={0.74} k={phys(tt, 4.2, 8, 0.45)} rev={cl((tt - 4.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL FREEZER: en corte, bolsa adentro; la aguja clavada en cero y cuatro días ----
export const HFourDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.5, 2.4, 2]}
  cam={{ at: [0, 0.54, 0], az: [0.28, -0.14], el: [0.26, 0.18], r: [2.25, 2.05], fov: 32 }}>{(tt) => { const lid = eio(tt, 0.4, 1.2), b = phys(tt, 1.0, 7, 0.55), lc = eio(tt, 1.9, 2.4), a = lerp(0, 1.4, lid) * (1 - lc);
  return <>
    <RBox s={[1.5, 0.08, 0.8]} p={[0, 0.08, 0]} r={0.01}><meshStandardMaterial color="#f0ede4" roughness={0.5} /></RBox>
    <RBox s={[0.07, 0.72, 0.8]} p={[-0.72, 0.42, 0]} r={0.01}><meshStandardMaterial color="#f0ede4" roughness={0.5} /></RBox>
    <RBox s={[0.07, 0.72, 0.8]} p={[0.72, 0.42, 0]} r={0.01}><meshStandardMaterial color="#f0ede4" roughness={0.5} /></RBox>
    <RBox s={[1.5, 0.72, 0.06]} p={[0, 0.42, -0.38]} r={0.01}><meshStandardMaterial color="#e4e8ec" roughness={0.45} /></RBox>
    <mesh position={[-0.14, lerp(1.5, 0.32, b), 0]} scale={[1.3, 0.75, 0.9]} castShadow><sphereGeometry args={[0.26, 30, 20]} /><meshStandardMaterial color="#20201f" roughness={0.5} /></mesh>
    <group position={[0.42, 0.34, 0.2]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.03, 40]} /><meshStandardMaterial color="#f4f2ea" roughness={0.5} /></mesh>
      <RBox s={[0.012, 0.12, 0.008]} p={[0, 0.05, 0.022]} r={0.001}><meshBasicMaterial color="#b3261e" /></RBox>
      <Tape txt="0°F" p={[0, 0.25, 0.02]} w={0.22} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.5)} />
    </group>
    <group position={[0, 0.8, -0.4]} rotation={[-a, 0, 0]}><RBox s={[1.5, 0.05, 0.8]} p={[0, 0, 0.4]} r={0.012}><meshStandardMaterial color="#f7f4ec" roughness={0.45} /></RBox></group>
    {[0, 1, 2, 3].map((i) => { const k = phys(tt, 2.9 + i * 0.5, 8, 0.45); return <RBox key={i} s={[0.2, 0.2, 0.012]} p={[-0.45 + i * 0.3, 0.95, 0.1]} rot={[0, 0, (i - 1.5) * 0.03]} r={0.003}><meshStandardMaterial map={faceTex(`fd${i}`, String(i + 1), "#f4efe1", "#2a2119")} roughness={0.8} /></RBox>; })}
  </>;
}}</Scene3D>;
