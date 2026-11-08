// ohf8pd · componentes únicos 1-6: el rasquido, la canilla, el cráneo, los hombres de oficio, el limón, el ascensor
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Tape, Wheel } from "./okit";
import { Mouse, PI, Pencil, Ring, stoneTex, sv } from "./rkit";

export const HX: React.FC<{ t: number; h: H }> = () => null;

const plaster = <meshStandardMaterial color="#d9d0bd" roughness={0.92} />;
const WallCut: React.FC<{ W: number; Hh: number; x0: number; x1: number; y0: number; y1: number; z?: number; mat?: React.ReactNode }> = ({ W, Hh, x0, x1, y0, y1, z = 0, mat = plaster }) => <group position={[0, 0, z]}>
  <RBox s={[x0 + W / 2, Hh, 0.03]} p={[(-W / 2 + x0) / 2, Hh / 2, 0]} r={0.004}>{mat}</RBox>
  <RBox s={[W / 2 - x1, Hh, 0.03]} p={[(W / 2 + x1) / 2, Hh / 2, 0]} r={0.004}>{mat}</RBox>
  <RBox s={[x1 - x0, y0, 0.03]} p={[(x0 + x1) / 2, y0 / 2, 0]} r={0.004}>{mat}</RBox>
  <RBox s={[x1 - x0, Hh - y1, 0.03]} p={[(x0 + x1) / 2, (Hh + y1) / 2, 0]} r={0.004}>{mat}</RBox>
</group>;

// ---- 0:07 · A 18 PULGADAS DE TU CABEZA: pared abierta; el ratón camina, frena, sigue; la cinta mide hasta la almohada ----
export const HWallWalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.8, 2.2, 1.8]} lamp={[1.0, 0.75, 0.75]}
  cam={{ at: [0.15, 0.62, 0], az: [-0.32, -0.12], el: [0.1, 0.06], r: [1.75, 1.5], fov: 32 }}>{(tt) => {
  const walk = tt < 1.8 ? tt / 1.8 * 0.42 : tt < 3.0 ? 0.42 : 0.42 + (tt - 3.0) * 0.17, stop = tt >= 1.8 && tt < 3.0;
  const x = -0.55 + walk, m = eio(tt, 3.3, 4.3);
  return <>
    <RBox s={[1.9, 1.05, 0.02]} p={[0, 0.55, -0.1]} r={0.003}><meshStandardMaterial color="#30261c" roughness={0.95} /></RBox>
    {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[1.9, 0.026, 0.008]} p={[0, 0.3 + i * 0.05, -0.08]} r={0.002} rot={[0, 0, (rn(i, 2) - 0.5) * 0.008]}>{M.wood({ rx: 3, ry: 1, base: [118, 82, 50] })}</RBox>)}
    <RBox s={[1.9, 0.05, 0.1]} p={[0, 0.5, -0.04]} r={0.004}>{M.wood({ rx: 4, ry: 1, base: [146, 104, 62] })}</RBox>
    <WallCut W={2.6} Hh={1.35} x0={-0.8} x1={0.68} y0={0.3} y1={0.9} z={0.02} />
    <Mouse p={[x, 0.525, -0.03]} run={stop ? 0 : tt} stand={stop ? 0.4 : 0} s={1.5} />
    {[0.3, 0.9, 1.5, 3.3, 3.9, 4.5, 5.1].map((a, i) => <Ring key={i} tt={tt} a={a} p={[x - 0.02 + (a > 2 ? 0.1 : 0), 0.56, 0.05]} r={0.18} d={0.8} />)}
    <RBox s={[0.95, 0.22, 1.2]} p={[0.8, 0.2, 0.62]} r={0.05}><meshStandardMaterial color="#e7e0d0" roughness={0.9} /></RBox>
    <mesh position={[0.62, 0.38, 0.28]} scale={[0.32, 0.1, 0.2]} castShadow><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#f4efe4" roughness={0.9} /></mesh>
    <RBox s={[0.98, 0.5, 0.05]} p={[0.8, 0.26, 0.04]} r={0.01}>{M.wood({ rx: 2, ry: 1, base: [86, 54, 30] })}</RBox>
    <mesh position={[lerp(0.11, 0.36, m), 0.455, 0.2]} scale={[sv(m), 1, 1]}><boxGeometry args={[0.5, 0.05, 0.005]} /><meshStandardMaterial color="#f2c531" metalness={0.3} roughness={0.35} /></mesh>
    <Tape txt="18 INCHES" p={[-0.04, 0.42, 0.2]} w={0.3} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 0:38 · TRAPO Y CANILLA: gotea, el trapo va y viene y el charco sigue; se cierra la canilla y recién se seca ----
export const HMopFaucet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.9, 2.2, 1.5]}
  cam={{ at: [-0.08, 0.55, 0.02], az: [-0.24, 0.12], el: [0.22, 0.14], r: [2.15, 1.95], fov: 32 }}>{(tt) => {
  const off = eio(tt, 4.4, 5.0), mopX = 0.18 * Math.sin(tt * 2.2) * (1 - off), pud = (0.34 + 0.08 * Math.sin(tt * 0.8)) * (tt > 5 ? Math.max(0.05, 1 - (tt - 5) * 0.35) : 1);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[-0.32, 0.03, 0.12]} scale={[1.25, 0.8, 1]}><circleGeometry args={[Math.max(0.01, pud), 56]} />{M.water({ op: 0.6 })}</mesh>
    <mesh geometry={tubeG("fau", [[-0.9, 0.94, -0.3], [-0.5, 0.94, -0.3], [-0.34, 0.92, -0.16], [-0.32, 0.8, 0.1], [-0.32, 0.74, 0.12]], 0.03, 60, 18)} castShadow>{M.brass()}</mesh>
    <Wheel p={[-0.55, 1.03, -0.3]} a={off * 5} r={0.07} col="#a82420" />
    {Array.from({ length: 6 }, (_, i) => { const u = (tt * 1.4 + i / 6) % 1; if (tt > 4.8) return null; return <mesh key={i} position={[-0.32, 0.72 - u * u * 0.7, 0.12]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 12, 10]} />{M.water({ op: 0.85 })}</mesh>; })}
    <group position={[0.2 + mopX, 0, 0.2]} rotation={[0.04, 0, -0.1 - mopX * 0.7]}>
      <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 1.2, 14]} />{M.wood({ rx: 1, ry: 4, base: [168, 128, 82] })}</mesh>
      {Array.from({ length: 40 }, (_, i) => { const a = i / 40 * PI * 2, l = 0.15 + 0.1 * rn(i, 2), h = 0.2 + 0.08 * rn(i, 3); return <mesh key={i} geometry={tubeG("mopb" + i, [[0, h, 0], [Math.cos(a) * 0.09, h * 0.6, Math.sin(a) * 0.08], [Math.cos(a) * l * 0.8, 0.05, Math.sin(a) * l * 0.8], [Math.cos(a) * l, 0.03, Math.sin(a) * l]], 0.017, 20, 7)} castShadow><meshStandardMaterial color="#d8d1c0" roughness={0.95} /></mesh>; })}
      <Tape txt="THE TRAP" p={[0.0, 0.42, 0.02]} w={0.26} k={phys(tt, 0.7, 8, 0.45)} rev={cl((tt - 0.7) / 0.7)} />
    </group>
    <Tape txt="THE HOLE" col="#b3261e" p={[-0.72, 0.84, -0.22]} rot={[0, 0.1, 0]} w={0.3} k={phys(tt, 2.0, 8, 0.45)} rev={cl((tt - 2.0) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 1:33 · EL ÚNICO HUESO QUE NO SE DOBLA: corte de la pared de piedra; el lápiz mide la rendija; el ratón llega, el cráneo calza justo y el cuerpo se aplasta ----
const Skull: React.FC<{ p: number[] }> = ({ p }) => <group position={p as [number, number, number]}>
  <mesh scale={[1.45, 0.92, 0.9]} castShadow><sphereGeometry args={[0.05, 32, 24]} /><meshPhysicalMaterial color="#efe6d2" roughness={0.45} clearcoat={0.3} /></mesh>
  <mesh position={[0.075, -0.012, 0]} scale={[1.3, 0.55, 0.6]} castShadow><sphereGeometry args={[0.03, 24, 18]} /><meshPhysicalMaterial color="#efe6d2" roughness={0.45} clearcoat={0.3} /></mesh>
  <mesh position={[0.012, 0.012, 0.04]} scale={[1.1, 0.9, 0.4]}><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#2b2119" /></mesh>
  <mesh position={[0.108, -0.03, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.006, 0.028, 0.012]} /><meshStandardMaterial color="#e6b35c" roughness={0.3} /></mesh>
</group>;
const FUR = (op: number) => <meshStandardMaterial color="#8d8173" roughness={0.9} transparent opacity={op} depthWrite={false} />;
export const HSkullFit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.6, 1.9, 1.6]}
  cam={{ at: [0, 0.5, 0], az: [-0.24, 0.14], el: [0.12, 0.07], r: [1.3, 1.14], fov: 32 }}>{(tt) => {
  const gap = 0.1, pencilIn = eio(tt, 0.2, 0.9) * (1 - eio(tt, 1.7, 2.3)), sk = lerp(-0.62, 0.0, eio(tt, 2.4, 3.8)) + lerp(0, 0.72, eio(tt, 4.9, 6.2));
  const body = (i: number) => { const x = sk - 0.1 - i * 0.04, r = 0.082 * (1 - i * 0.024), inside = cl(1.15 - Math.abs(x) / 0.25); return { x, r, sy: lerp(1, gap * 0.46 / r, eio(inside, 0, 0.5)), sz: lerp(1, 1.28, eio(inside, 0, 0.5)) }; };
  return <>
    {[1, -1].map((s) => <mesh key={s} position={[0, 0.5 + s * (gap / 2 + 0.34), -0.05]} castShadow receiveShadow><boxGeometry args={[0.52, 0.68, 0.5]} /><meshStandardMaterial map={stoneTex("sk2" + s, 1, 1)} roughness={0.95} /></mesh>)}
    <mesh position={[0, 0.5, -0.31]}><boxGeometry args={[0.52, gap * 1.02, 0.02]} /><meshStandardMaterial color="#14100c" /></mesh>
    {[-1, 1].map((s) => <RBox key={s} s={[0.42, 0.03, 0.34]} p={[s * 0.47, 0.405, 0.08]} r={0.006}>{M.wood({ rx: 2, ry: 1, base: [118, 80, 46] })}</RBox>)}
    <Pencil p={[lerp(-1.3, -0.4, pencilIn), 0.5, 0.12]} L={0.95} r={0.043} />
    {tt > 2.3 && <group position={[0, 0, 0.12]}>
      <Skull p={[sk, 0.5, 0]} />
      <mesh position={[sk + 0.01, 0.5, 0]} scale={[1.55, cl(1.15 - Math.abs(sk) / 0.25) > 0.3 ? 0.84 : 1, 1]}><sphereGeometry args={[0.062, 26, 18]} />{FUR(0.28)}</mesh>
      {[-1, 1].map((m) => <mesh key={m} position={[sk - 0.05, 0.56, m * 0.04]} scale={[1, 1, 0.25]}><sphereGeometry args={[0.028, 16, 12]} />{FUR(Math.abs(sk) < 0.28 ? 0 : 0.8)}</mesh>)}
      {Array.from({ length: 15 }, (_, i) => { const b = body(i); return <mesh key={i} position={[b.x, 0.5, 0]} scale={[1.25, b.sy, b.sz]}><sphereGeometry args={[b.r, 22, 16]} /><meshStandardMaterial color="#8d8173" roughness={0.9} /></mesh>; })}
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[sk - 0.72 - i * 0.04, 0.46 - i * 0.002, 0]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#c9a9a0" roughness={0.7} /></mesh>)}
    </group>}
    <Tape txt="THE ONLY HARD PART" p={[0.0, 0.7, 0.22]} w={0.56} k={phys(tt, 3.7, 8, 0.45)} rev={cl((tt - 3.7) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 2:25 · CADA OFICIO DEJÓ UNA PUERTA ABIERTA: la viga perimetral; un agujero por oficio con su año, y por cada uno entra día ----
const JOB = [["1925", "PLUMBER", -0.54], ["1950", "GAS MAN", -0.18], ["1982", "CABLE", 0.18], ["1994", "A/C", 0.54]] as const;
export const HTradesmen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.3, 1.8, 1.7]}
  cam={{ at: [-0.05, 0.4, 0], at1: [0.08, 0.4, 0], az: [-0.2, 0.2], el: [0.12, 0.08], r: [1.8, 1.65], fov: 32 }}>{(tt) => <>
    <RBox s={[1.9, 0.5, 0.06]} p={[0, 1.02, -0.08]} r={0.01}>{M.wood({ rx: 5, ry: 1, base: [104, 72, 42] })}</RBox>
    <RBox s={[1.9, 0.34, 0.14]} p={[0, 0.5, 0]} r={0.012}>{M.wood({ rx: 5, ry: 1, base: [132, 88, 48] })}</RBox>
    <RBox s={[1.9, 0.5, 0.42]} p={[0, 0.08, 0.04]} r={0.01}><meshStandardMaterial map={stoneTex("rj", 3, 1)} roughness={0.95} /></RBox>
    <RBox s={[1.9, 0.08, 0.5]} p={[0, 0.73, -0.06]} r={0.01}>{M.wood({ rx: 5, ry: 1, base: [148, 104, 62] })}</RBox>
    {JOB.map(([yr, who, x], i) => { const a = 0.5 + i * 1.05, k = phys(tt, a, 8, 0.5), s = sv(cl(k));
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, 0.5, 0.0725]} scale={[s, s, 1]}><circleGeometry args={[0.06, 32]} /><meshBasicMaterial color={`rgb(${Math.round(lerp(9, 255, eio(tt, a + 0.2, a + 0.7)))},${Math.round(lerp(7, 226, eio(tt, a + 0.2, a + 0.7)))},${Math.round(lerp(5, 170, eio(tt, a + 0.2, a + 0.7)))})`} /></mesh>
        <mesh position={[0, 0.5, 0.073]} scale={[s, s, 1]}><ringGeometry args={[0.06, 0.07, 32]} /><meshStandardMaterial color="#d7c29a" roughness={1} /></mesh>
        <mesh position={[0, 0.5, 0.12]} rotation={[PI / 2, 0, 0]} scale={[1, sv(cl(k)), 1]}><cylinderGeometry args={[0.022, 0.022, 0.32, 18]} />{i === 1 ? M.matte({ col: "#2a2a2c" }) : M.steel({ col: i ? "#c28652" : "#8f9499" })}</mesh>
        <group position={[0, 0.24, 0.29]} rotation={[0, 0, 0.05 * Math.sin(tt * 2 + i)]}>
          <Tape txt={yr} p={[0, 0, 0]} w={0.19} k={phys(tt, a + 0.25, 9, 0.45)} />
          <Tape txt={who} col="#b3261e" p={[0, -0.075, 0.002]} w={who.length < 5 ? 0.13 : 0.25} k={phys(tt, a + 0.4, 9, 0.45)} />
        </group>
      </group>; })}
  </>}</Scene3D>;

// ---- 2:50 · EL TAMAÑO DE UN LIMÓN: el hueco alrededor del caño del aire; un limón de verdad cae y calza justo ----
const lemonTex = () => tex.text("lemon", 512, 256, (g) => { g.fillStyle = "#efb90f"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 2600; i++) { g.fillStyle = i % 2 ? "rgba(150,96,0,.3)" : "rgba(255,226,110,.35)"; g.beginPath(); g.arc(rn(i, 11) * 512, rn(i, 12) * 256, 0.8 + rn(i, 13) * 1.4, 0, 7); g.fill(); } });
export const HLemonHole: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-0.7, 1.8, 2]}
  cam={{ at: [0, 0.5, 0], az: [0.42, 0.14], el: [0.16, 0.1], r: [1.05, 0.9], fov: 32 }}>{(tt) => { const lm = phys(tt, 1.3, 7, 0.34), z = lerp(0.9, 0.06, lm), y = 0.5 + (1 - lm) * 0.25, rot = (1 - lm) * 3;
  return <>
    {Array.from({ length: 8 }, (_, i) => i === 3 || i === 4 ? null : <RBox key={i} s={[1.4, 0.113, 0.04]} p={[0, 0.5 + (i - 3.5) * 0.125, 0]} r={0.008}><meshStandardMaterial color="#efe9d9" roughness={0.75} /></RBox>)}
    {[-1, 1].map((m) => <RBox key={m} s={[0.56, 0.24, 0.04]} p={[m * 0.42, 0.5, 0]} r={0.008}><meshStandardMaterial color="#efe9d9" roughness={0.75} /></RBox>)}
    <mesh position={[0, 0.5, -0.05]}><boxGeometry args={[0.32, 0.26, 0.04]} /><meshStandardMaterial color="#0c0907" /></mesh>
    <mesh geometry={tubeG("lset", [[-0.55, 0.95, 0.09], [-0.2, 0.62, 0.1], [-0.06, 0.53, 0.05], [-0.04, 0.5, -0.1]], 0.016, 50, 12)} castShadow><meshStandardMaterial color="#c0793f" metalness={0.9} roughness={0.3} /></mesh>
    <mesh geometry={tubeG("lset2", [[-0.55, 0.9, 0.09], [-0.22, 0.58, 0.1], [-0.03, 0.48, 0.05], [0, 0.46, -0.1]], 0.011, 50, 12)} castShadow><meshStandardMaterial color="#c0793f" metalness={0.9} roughness={0.3} /></mesh>
    <group position={[0.06, y, z]} rotation={[rot, rot * 0.6, 0]}>
      <mesh scale={[1.25, 1, 1]} castShadow><sphereGeometry args={[0.1, 40, 30]} /><meshPhysicalMaterial map={lemonTex()} roughness={0.6} clearcoat={0.12} /></mesh>
      {[-1, 1].map((m) => <mesh key={m} position={[m * 0.128, 0, 0]} scale={[0.5, 0.42, 0.42]}><sphereGeometry args={[0.03, 16, 12]} /><meshPhysicalMaterial color="#e7c21e" roughness={0.5} /></mesh>)}
    </group>
    <Tape txt="NOBODY WENT BACK" p={[0.08, 0.72, 0.06]} w={0.58} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 3:20 · LA PARED ES UN ASCENSOR: casa de muñecas en corte; el ratón sube por el hueco sin ver el día; abajo el agujero, arriba el ruido sobre la cama ----
const ROOMS: [number, number, string][] = [[-1, 0, "#a79a82"], [1, 0, "#8f9a8c"], [-1, 1, "#b7a184"], [1, 1, "#c0ad93"], [-1, 2, "#9aa3a8"], [1, 2, "#c9b898"]];
const FY = [0.42, 1.12, 1.82, 2.5];
export const HElevator: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.4, 3.4, 4.2]} lamp={[0.9, 2.2, 1.2]}
  cam={{ at: [0.0, 1.38, 0], az: [0.08, -0.08], el: [0.05, 0.03], r: [4.85, 4.55], fov: 32 }}>{(tt) => { const my = lerp(0.2, 2.26, eio(tt, 0.7, 4.7));
  return <>
    <RBox s={[4.6, 0.5, 0.7]} p={[0, 0.14, 0]} r={0.01}><meshStandardMaterial map={stoneTex("el2", 5, 1)} roughness={0.95} /></RBox>
    {ROOMS.map(([sx, f, c], i) => <RBox key={i} s={[2.0, FY[f + 1] - FY[f], 0.02]} p={[sx * 1.2, (FY[f] + FY[f + 1]) / 2, -0.3]} r={0.002}><meshStandardMaterial color={c} roughness={0.92} /></RBox>)}
    {FY.map((y, i) => [-1, 1].map((sx) => <RBox key={i + "," + sx} s={[2.0, 0.06, 0.64]} p={[sx * 1.2, y, 0]} r={0.006}>{M.wood({ rx: 3, ry: 1, base: [120, 80, 46] })}</RBox>))}
    <RBox s={[0.64, 2.3, 0.02]} p={[0, 1.42, -0.3]} r={0.002}><meshStandardMaterial color="#4a3a2a" roughness={0.95} /></RBox>
    {ROOMS.map(([sx, f], i) => <group key={i} position={[sx * 1.5, FY[f] + 0.38, -0.285]}><RBox s={[0.44, 0.42, 0.012]} r={0.003}>{M.wood({ rx: 1, ry: 1, base: [226, 218, 200] })}</RBox><mesh position={[0, 0, 0.008]}><planeGeometry args={[0.36, 0.34]} /><meshBasicMaterial color="#bcd6e6" /></mesh></group>)}
    {[-0.33, 0.33].map((x) => <RBox key={x} s={[0.06, 2.3, 0.62]} p={[x, 1.42, 0]} r={0.005}>{M.wood({ rx: 1, ry: 4, base: [158, 116, 72] })}</RBox>)}
    <RBox s={[1.0, 0.16, 0.5]} p={[1.2, 1.97, 0]} r={0.04}><meshStandardMaterial color="#ece6d6" roughness={0.9} /></RBox>
    <RBox s={[0.06, 0.42, 0.52]} p={[1.72, 2.06, 0]} r={0.01}>{M.wood({ rx: 1, ry: 2, base: [86, 54, 30] })}</RBox>
    <mesh position={[1.5, 2.1, 0]} scale={[0.18, 0.07, 0.2]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#f6f1e6" roughness={0.9} /></mesh>
    {[[0.9, -0.1], [1.4, -0.1], [0.9, 0.1], [1.4, 0.1]].map(([x, z], i) => <mesh key={i} position={[x, 0.63, z]}><cylinderGeometry args={[0.014, 0.014, 0.4, 8]} />{M.wood({ rx: 1, ry: 2, base: [130, 92, 54] })}</mesh>)}
    <RBox s={[0.7, 0.3, 0.3]} p={[-1.2, 1.3, -0.1]} r={0.04}><meshStandardMaterial color="#7d5a42" roughness={0.85} /></RBox>
    <RBox s={[0.6, 0.04, 0.3]} p={[1.15, 0.84, 0]} r={0.008}>{M.wood({ rx: 2, ry: 1, base: [150, 110, 66] })}</RBox>
    <RBox s={[0.5, 0.42, 0.26]} p={[-1.25, 2.04, -0.14]} r={0.01}>{M.wood({ rx: 2, ry: 1, base: [104, 70, 40] })}</RBox>
    <Mouse p={[0.12, my, 0.05]} rz={PI / 2} run={tt} s={5.4} />
    <mesh position={[-0.42, 0.24, 0.36]} scale={[1.2, 0.8, 1]}><circleGeometry args={[0.1, 28]} /><meshStandardMaterial color="#080604" /></mesh>
    <Tape txt="THE HOLE" col="#b3261e" p={[-1.0, 0.24, 0.38]} w={0.8} k={phys(tt, 0.4, 8, 0.45)} rev={cl((tt - 0.4) / 0.7)} />
    {[4.3, 4.8, 5.3, 5.8].map((a, i) => <Ring key={i} tt={tt} a={a} p={[0.3, 2.2, 0.35]} r={0.5} d={1.1} />)}
    <Tape txt="THE NOISE" p={[1.05, 2.33, 0.34]} w={0.9} k={phys(tt, 4.5, 8, 0.45)} rev={cl((tt - 4.5) / 0.7)} />
  </>;
}}</Scene3D>;
