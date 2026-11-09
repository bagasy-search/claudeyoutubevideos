// ohf8pb · componentes 35-39: el día justo, una semana contra una mañana, ladrillos, inyección bajo la losa y el balde en vez del martillo neumático
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys } from "./h3d";
import { Tape } from "./okit";
import { Bucket, CONC, PI, Slab, Trowel, Y0, Yard } from "./slabkit";

type P = { t: number; h: H };
const SKY = { floor: "none" as const, wall: "none" as const, bg: "#b9cbd8", key1: [-1.4, 3, 2.6] };

// 9:30 · EL DÍA JUSTO: un termómetro de poste; el líquido sube y se queda en la franja verde
export const HThermo: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...SKY} cam={{ at: [0, Y0 + 0.62, 0], az: [-0.22, -0.06], el: [0.08, 0.12], r: [2.3, 2.18], fov: 32 }}>{(tt) => {
  const y0 = Y0 + 0.16, H1 = 0.98, lv = cl(phys(tt, 0.9, 5, 0.6)) * 0.62, band = phys(tt, 2.2, 8, 0.45);
  return <><Yard cut={false} />
    <Slab w={1.8} d={0.8} p={[0, Y0 - 0.08, 0.2]} k="a" />
    <RBox s={[0.16, 1.5, 0.13]} p={[0, Y0 + 0.75, -0.14]} r={0.012}>{M.wood({ base: [132, 96, 60] })}</RBox>
    <RBox s={[0.3, H1 + 0.14, 0.03]} p={[0, y0 + H1 / 2, -0.06]} r={0.012}><meshStandardMaterial color="#efe8d8" roughness={0.6} /></RBox>
    <RBox s={[0.1, H1 * 0.4, 0.008]} p={[0, y0 + H1 * 0.47, -0.04]} r={0.002} shadow={false}><meshStandardMaterial color="#2f9a4d" roughness={0.5} emissive="#2f9a4d" emissiveIntensity={0.25 * cl(band)} /></RBox>
    {Array.from({ length: 11 }, (_, i) => <RBox key={i} s={[0.05, 0.005, 0.004]} p={[-0.08, y0 + 0.04 + i * 0.09, -0.04]} r={0.001} shadow={false}><meshBasicMaterial color="#3c352a" /></RBox>)}
    <mesh position={[0, y0 + H1 / 2, -0.015]}><cylinderGeometry args={[0.022, 0.022, H1, 16]} />{M.glass()}</mesh>
    <mesh position={[0, y0 + (H1 * lv) / 2, -0.015]}><cylinderGeometry args={[0.014, 0.014, Math.max(0.02, H1 * lv), 12]} /><meshStandardMaterial color="#c8281e" roughness={0.35} /></mesh>
    <mesh position={[0, y0, -0.015]}><sphereGeometry args={[0.042, 20, 16]} /><meshStandardMaterial color="#c8281e" roughness={0.35} /></mesh>
    <Tape txt="50° TO 90°" col="#1f7a3a" p={[0.5, y0 + H1 * 0.55, 0.05]} rot={[0, -0.2, 0]} w={0.5} k={band} rev={cl(tt - 2.2)} />
    <Tape txt="NO FREEZE, 2 DAYS" col="#1c2a3a" p={[-0.56, y0 + H1 * 0.52, 0.05]} rot={[0, 0.2, 0]} w={0.56} k={phys(tt, 4, 8, 0.45)} rev={cl(tt - 4)} />
  </>;
}}</Scene3D>;

// 24:30 · UNA SEMANA CONTRA UNA MAÑANA: cinco días apilados sobre la losa vieja; uno sobre la nueva
const Day: React.FC<{ x: number; z?: number; tt: number; d: number; col: string }> = ({ x, z = 0, tt, d, col }) => { const k = phys(tt, d, 9, 0.42); return <RBox s={[0.17, 0.17, 0.17]} p={[x, Y0 + 0.11 + (1 - cl(k)) * 0.9, z]} rot={[0, (1 - cl(k)) * 0.8, 0]} r={0.014}><meshStandardMaterial color={col} roughness={0.55} /></RBox>; };
export const HMorning: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...SKY} cam={{ at: [0, Y0 + 0.2, 0.05], az: [-0.1, 0.08], el: [0.28, 0.34], r: [3.33, 3.17], fov: 32 }}>{(tt) => <><Yard cut={false} />
  <Slab w={1.5} d={0.8} p={[-0.82, Y0 - 0.08, 0]} k="a" col="#8f8b81" />
  <Slab w={1.5} d={0.8} p={[0.82, Y0 - 0.08, 0]} k="b" col={CONC.fresh} />
  {[0, 1, 2, 3, 4].map((i) => <Day key={i} x={-1.3 + i * 0.24} tt={tt} d={0.7 + i * 0.42} col="#b9772e" />)}
  <Day x={0.82} tt={tt} d={3.6} col="#2f8a4a" />
  <Tape txt="ALL WEEK" col="#a33a1e" p={[-0.82, Y0 + 0.46, 0.05]} w={0.56} k={phys(tt, 3.0, 8, 0.45)} rev={cl(tt - 3)} />
  <Tape txt="ONE MORNING" col="#1f7a3a" p={[0.82, Y0 + 0.46, 0.05]} w={0.66} k={phys(tt, 4.2, 8, 0.45)} rev={cl(tt - 4.2)} />
</>}</Scene3D>;

// 26:05 · LOS LADRILLOS QUIEREN MOVERSE: se levanta el bajo, entra arena, se apisona
export const HBrick: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...SKY} cam={{ at: [0, Y0 + 0.02, 0.02], az: [-0.32, -0.2], el: [0.52, 0.46], r: [2.0, 1.89], fov: 32 }}>{(tt) => {
  const up = eio(tt, 1.0, 1.9) * (1 - eio(tt, 3.9, 4.6)), sand = eio(tt, 2.2, 3.6), tamp = Math.max(0, Math.sin(cl((tt - 4.8) / 1.4) * PI * 3)) * 0.08 * (tt < 6.2 ? 1 : 0);
  const low = lerp(-0.05, 0, sand), W = 0.3, D = 0.15;
  const col = (i: number, j: number) => ["#9c4a32", "#a85438", "#8f4430"][(i * 3 + j * 5) % 3];
  return <><Yard cut={false} />
    <RBox s={[2.5, 0.03, 1.2]} p={[0, Y0 - 0.005, 0.05]} r={0.006}><meshStandardMaterial color="#c9b48a" roughness={1} /></RBox>
    {Array.from({ length: 7 }, (_, j) => Array.from({ length: 7 }, (_, i) => { const x = (i - 3) * (W + 0.012) + (j % 2 ? W / 2 : 0), z = (j - 3) * (D + 0.012) + 0.05, me = i === 3 && j === 3; return <RBox key={i + "-" + j} s={[W, 0.06, D]} p={[x, Y0 + 0.045 + (me ? low + up * 0.3 - tamp * 0.2 : 0), z]} rot={me ? [0, 0, up * 0.25] : [0, 0, 0]} r={0.008}><meshStandardMaterial color={col(i, j)} roughness={0.9} /></RBox>; }))}
    {sand > 0.01 && <mesh position={[0, Y0 + 0.018, 0.05]} scale={[0.14 * sand + 0.01, 0.05 * sand + 0.005, 0.07 * sand + 0.01]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color="#e0cda1" roughness={1} /></mesh>}
    {tt > 4.7 && tt < 6.3 && <group position={[0, Y0 + 0.14 + tamp * 2.2, 0.05]}><RBox s={[0.36, 0.06, 0.2]} r={0.01}>{M.wood({ base: [146, 104, 62] })}</RBox><mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.02, 0.02, 0.55, 12]} />{M.wood({ base: [176, 138, 92] })}</mesh></group>}
    <Tape txt="SAND UNDER IT" col="#1c2a3a" p={[0.02, Y0 + 0.14, 0.62]} rot={[-0.5, -0.2, 0]} w={0.72} k={phys(tt, 2.4, 8, 0.45)} rev={cl(tt - 2.4)} />
  </>;
}}</Scene3D>;

// 27:05 · ESPUMA POR DEBAJO: la losa entera sube; la rajada se queda como estaba
export const HMudJack: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...SKY} cam={{ at: [0, Y0 - 0.08, 0.2], az: [-0.1, 0.06], el: [0.1, 0.14], r: [2.7, 2.56], fov: 32 }}>{(tt) => {
  const g = eio(tt, 1.0, 3.6), lift = cl(phys(tt, 2.0, 5, 0.75)), drop = 0.1 * (1 - lift), foamH = 0.09 + 0.1 * lift, b2 = eio(tt, 3.8, 5.0);
  return <><Yard />
    <Slab w={1.5} d={0.66} p={[-0.84, Y0 - 0.08 - drop, 0.03]} k="a" />
    <RBox s={[Math.max(0.04, 1.42 * g), foamH, 0.665]} p={[-0.84, Y0 - 0.18 - drop - foamH / 2 + 0.002, 0.03]} r={0.03}><meshStandardMaterial color="#e6b93f" roughness={0.8} /></RBox>
    <mesh position={[-0.84, Y0 - 0.32, 0.5]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.34, 14]} />{M.rubber({ col: "#2a292c" })}</mesh>
    <group position={[0.42, Y0 - 0.08, 0.03]} rotation={[0, 0, -0.03]}><Slab w={0.72} d={0.66} p={[0, 0, 0]} k="b" /></group>
    <group position={[1.2, Y0 - 0.13, 0.03]} rotation={[0, 0, 0.06]}><Slab w={0.72} d={0.66} p={[0, 0, 0]} k="c" /></group>
    {b2 > 0 && <RBox s={[0.1, 0.09 * b2 + 0.004, 0.665]} p={[0.8, Y0 - 0.24, 0.03]} r={0.02}><meshStandardMaterial color="#e6b93f" roughness={0.8} /></RBox>}
    <Tape txt="ONE PIECE: YES" col="#1f7a3a" p={[-0.84, Y0 + 0.3, 0.2]} w={0.68} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
    <Tape txt="CRACKED: NO" col="#a33a1e" p={[0.82, Y0 + 0.3, 0.2]} w={0.62} k={phys(tt, 4.6, 8, 0.45)} rev={cl(tt - 4.6)} />
  </>;
}}</Scene3D>;

// 28:45 · NO HACE FALTA: el martillo neumático se va y caen el balde y la llana
export const HInstead: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" {...SKY} cam={{ at: [0, Y0 + 0.28, 0.1], az: [-0.26, -0.1], el: [0.22, 0.27], r: [2.2, 2.09], fov: 32 }}>{(tt) => {
  const out = eio(tt, 1.0, 2.0), bk = phys(tt, 2.2, 9, 0.42), tr = phys(tt, 3.0, 9, 0.42);
  return <><Yard cut={false} />
    <Slab w={2.4} d={0.9} p={[0, Y0 - 0.08, 0.1]} k="a" col={CONC.fresh} />
    {out < 1 && <group position={[0.1 + 2.2 * out, Y0 + 0.5 + 0.8 * out, 0.1]} rotation={[0, 0, -0.5 * out]}>
      <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.024, 0.008, 0.44, 12]} />{M.steel({})}</mesh>
      <RBox s={[0.22, 0.46, 0.2]} p={[0, 0.12, 0]} r={0.03}><meshStandardMaterial color="#c8281e" roughness={0.45} /></RBox>
      <RBox s={[0.5, 0.05, 0.05]} p={[0, 0.42, 0]} r={0.02}>{M.rubber({ col: "#2a292c" })}</RBox>
    </group>}
    <group position={[-0.3, Y0 + 0.02 + (1 - cl(bk)) * 1.1, 0.05]}><Bucket s={1.15} /></group>
    <group position={[0.34, Y0 + 0.05 + (1 - cl(tr)) * 1.1, 0.24]} rotation={[0, 0.7, 0]}><Trowel s={1.35} /></group>
    <Tape txt="ONE GOOD SATURDAY" col="#1f7a3a" p={[0, Y0 + 0.92, 0]} w={0.98} k={phys(tt, 4.0, 8, 0.45)} rev={cl(tt - 4)} />
  </>;
}}</Scene3D>;
