// ohf8pc · componentes 1-18: el agujero escondido, la chimenea, las pruebas, la puerta caída, el plomo, el sello en U, el burlete
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { FlowPath, Hand, Tape } from "./okit";
import { Cold, DH, DT, DW, Frame, Hinge, Joist, Leaf, Light, Paper, PI, Saddle, Screw, SealU, Sweep } from "./doorkit";

type P = { t: number; h: H };
const FOOT = { floor: "oak" as const, wall: "plaster" as const, wallZ: -0.05, bg: "#1d1915", key1: [-1, 2, 1.6] };
const WARM = { floor: "oak" as const, wall: "paper" as const, wallZ: -0.05, bg: "#1d1915", key1: [-1, 2.2, 1.8] };
const CAMF = (r0: number, r1: number, az0 = -0.16, az1 = 0.12) => ({ at: [0, 0.16, 0.05], az: [az0, az1], el: [0.08, 0.12], r: [r0, r1], fov: 30 });

// 0:51 · NUEVE PULGADAS: la rendija larga se pliega y se vuelve un cuadrado abierto en la pared
export const HHole: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...FOOT} cam={{ at: [0, 0.34, 0], az: [-0.12, 0.08], el: [0.05, 0.08], r: [2.3, 2.18], fov: 32 }}>{(tt) => {
  const k = eio(tt, 1.2, 3.4), w = lerp(0.92, 0.19, k), hh = lerp(0.016, 0.19, k), x = lerp(0, 0.5, k), y = lerp(0.09, 0.6, k);
  return <>
    {k < 0.98 && <><Leaf /><Saddle p={[0, 0.0, 0.02]} /><Frame /></>}
    {k >= 0.98 && <RBox s={[2.6, 1.4, 0.02]} p={[0, 0.7, -0.02]} r={0.002}><meshStandardMaterial color="#d7ccb8" roughness={0.9} /></RBox>}
    <mesh position={[x, y, 0.035]}><planeGeometry args={[w, hh]} /><meshBasicMaterial color="#ffe6b4" toneMapped={false} /></mesh>
    <Tape txt={'1/4" × 3 FT'} col="#1c2a3a" p={[-0.55, 0.42, 0.1]} w={0.56} k={phys(tt, 0.5, 8, 0.45)} rev={cl(tt - 0.5)} />
    <Tape txt={'= 3" × 3" HOLE'} col="#a33a1e" p={[-0.5, 0.74, 0.1]} w={0.72} k={phys(tt, 3.4, 8, 0.45)} rev={cl(tt - 3.4)} />
  </>;
}}</Scene3D>;

// 1:16 · TRES ARREGLOS: de lo más barato a lo que dura más que la puerta, cada uno cae sobre su escalón
const Step: React.FC<{ x: number; h: number }> = ({ x, h }) => <RBox s={[0.62, h, 0.5]} p={[x, h / 2, 0.05]} r={0.012}>{M.wood({ base: [116, 82, 52] })}</RBox>;
export const HThree: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...WARM} cam={{ at: [0, 0.34, 0], az: [-0.2, -0.02], el: [0.2, 0.26], r: [2.2, 2.09], fov: 32 }}>{(tt) => { const f = (d: number) => (1 - cl(phys(tt, d, 9, 0.42))) * 1.1; return <>
  <Step x={-0.68} h={0.1} /><Step x={0} h={0.22} /><Step x={0.68} h={0.34} />
  <group position={[-0.68, 0.16 + f(0.7), 0.05]}><SealU w={0.5} /></group>
  <group position={[0, 0.3 + f(1.6), 0.05]}><Sweep w={0.5} bend={0.15} /></group>
  <group position={[0.68, 0.34 + f(2.5), 0.05]}><Saddle w={0.54} d={0.16} h={0.05} /></group>
  {([["NO TOOLS", -0.68, 0.46, 2.0, "#1f7a3a"], ["SCREW-ON", 0, 0.62, 3.0, "#1c2a3a"], ["OUTLASTS THE DOOR", 0.5, 0.84, 4.0, "#a33a1e"]] as const).map(([s, x, y, d, c]) => <Tape key={s} txt={s} col={c} p={[x, y, 0.16]} w={x > 0.5 ? 0.62 : 0.44} k={phys(tt, d, 8, 0.45)} rev={cl(tt - d)} />)}
</>; }}</Scene3D>;

// 2:23 · LA CASA ES UNA CHIMENEA: la casa cortada; el calor sube por la escalera y el frío entra por la puerta
export const HChimney: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#23303f" key1={[-1.4, 3, 2.4]} cam={{ at: [0, 1.0, 0], az: [-0.18, 0.1], el: [0.04, 0.1], r: [3.9, 3.7], fov: 32 }}>{(tt) => { const W = "#dcd2be", k = cl(tt - 0.8); return <>
  <RBox s={[3.2, 0.06, 1.0]} p={[0, 0.0, 0]} r={0.006}>{M.wood({ base: [130, 92, 58] })}</RBox>
  <RBox s={[3.2, 0.06, 1.0]} p={[0, 1.02, 0]} r={0.006}>{M.wood({ base: [130, 92, 58] })}</RBox>
  {[-1.6, 1.6].map((x) => <RBox key={x} s={[0.08, 2.0, 1.0]} p={[x, 1.0, 0]} r={0.008}><meshStandardMaterial color={W} roughness={0.85} /></RBox>)}
  <RBox s={[3.3, 0.05, 1.05]} p={[-0.93, 2.42, 0]} rot={[0, 0, 0.58]} r={0.006}><meshStandardMaterial color="#6a4638" roughness={0.9} /></RBox>
  <RBox s={[3.3, 0.05, 1.05]} p={[0.93, 2.42, 0]} rot={[0, 0, -0.58]} r={0.006}><meshStandardMaterial color="#6a4638" roughness={0.9} /></RBox>
  <RBox s={[3.2, 2.0, 0.03]} p={[0, 1.0, -0.5]} r={0.003}><meshStandardMaterial color="#b9ae99" roughness={0.95} /></RBox>
  {Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.22, 0.05, 0.6]} p={[0.2 + i * 0.13, 0.07 + i * 0.125, 0.1]} r={0.004}>{M.wood({ base: [116, 82, 52] })}</RBox>)}
  <RBox s={[0.1, 0.72, 0.5]} p={[-1.6, 0.42, 0.1]} r={0.008}><meshBasicMaterial color="#10161d" /></RBox>
  <FlowPath tt={tt} pts={[[-1.9, 0.14, 0.1], [-1.2, 0.12, 0.1], [-0.4, 0.14, 0.1], [0.3, 0.3, 0.1], [1.1, 1.0, 0.1], [1.2, 1.5, 0.1]]} n={22} k={k} r={0.024} v={0.42} col="#7cc4ef" />
  {[-0.7, 0.2, 0.9].map((x, i) => <FlowPath key={x} tt={tt + i * 0.5} pts={[[x + 0.3, 1.2, 0.1], [x, 1.6, 0.1], [x * 0.5, 2.1, 0.1], [0.05 * i, 2.7, 0.1], [0.05 * i, 3.3, 0.1]]} n={14} k={k} r={0.03} v={0.5} col="#ef8a3a" />)}
  <Tape txt="WARM LEAVES UP HERE" col="#b5541c" p={[-0.2, 3.0, 0.5]} w={1.0} k={phys(tt, 1.4, 8, 0.45)} rev={cl(tt - 1.4)} />
  <Tape txt="COLD COMES IN LOW" col="#1c2a3a" p={[-0.92, 0.42, 0.56]} w={0.95} k={phys(tt, 3.0, 8, 0.45)} rev={cl(tt - 3)} />
</>; }}</Scene3D>;

// 3:07 · EL RÍO DE LOS TOBILLOS: dos pies en el río frío y el termostato a metro y medio, feliz
const Sock: React.FC<{ x: number }> = ({ x }) => <group position={[x, 0, 0.3]}>
  <RBox s={[0.12, 0.09, 0.3]} p={[0, 0.05, 0.06]} r={0.04}><meshStandardMaterial color="#8a7a66" roughness={1} /></RBox>
  <mesh position={[0, 0.27, -0.03]}><cylinderGeometry args={[0.06, 0.055, 0.38, 20]} /><meshStandardMaterial color="#8a7a66" roughness={1} /></mesh>
  <mesh position={[0, 0.74, -0.03]}><cylinderGeometry args={[0.075, 0.06, 0.6, 20]} /><meshStandardMaterial color="#35415a" roughness={0.9} /></mesh>
</group>;
export const HRiver: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...WARM} cam={{ at: [0, 0.5, 0.3], az: [-0.42, -0.26], el: [0.1, 0.16], r: [2.7, 2.56], fov: 34 }}>{(tt) => <>
  <Sock x={-0.1} /><Sock x={0.14} />
  <Cold tt={tt} x0={-0.9} x1={0.9} z0={-0.1} z1={1.4} k={cl(tt - 0.4)} y={0.11} />
  <group position={[0.72, 1.45, 0.0]}><RBox s={[0.2, 0.2, 0.05]} r={0.03}><meshStandardMaterial color="#efe8d8" roughness={0.5} /></RBox><mesh position={[0, 0, 0.03]}><circleGeometry args={[0.065, 24]} /><meshBasicMaterial color="#1e7a4a" toneMapped={false} /></mesh></group>
  <Tape txt="72° UP HERE" col="#1f7a3a" p={[0.72, 1.18, 0.06]} w={0.58} k={phys(tt, 1.8, 8, 0.45)} rev={cl(tt - 1.8)} />
  <Tape txt="YOUR ANKLES" col="#1c2a3a" p={[-0.62, 0.32, 0.5]} rot={[0, 0.4, 0]} w={0.6} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
</>}</Scene3D>;

// 3:46 · LA FORMA DE LA LUZ: tres puertas, tres rendijas: pareja, cuña, cazuela
export const HShapes: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" {...FOOT} wallZ={-0.03} cam={{ at: [0, 0.2, 0], az: [-0.05, 0.05], el: [0.05, 0.08], r: [2.8, 2.68], fov: 32 }}>{(tt) => { const G = [[-0.98, 0.03, 0.03, 0.03, "EVEN", "#1c2a3a"], [0, 0.05, 0.004, undefined, "WEDGE", "#a33a1e"], [0.98, 0.012, 0.012, 0.06, "SCOOPED", "#8a5a14"]] as const; return <>
  {G.map(([x, a, b, c, s, col], i) => { const k = cl(phys(tt, 0.6 + i * 1.3, 7, 0.55)); return <group key={s} position={[x, 0, 0]}>
    <RBox s={[0.86, 0.5, 0.04]} p={[0, 0.36 + 0.02, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
    <RBox s={[0.9, 0.05, 0.13]} p={[0, 0.025, 0.04]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
    <group position={[0, 0.052, 0.016]} scale={[1, 1.6, 1]}><Light w={0.86} a={a} b={b} c={c} k={k} /></group>
    <Tape txt={s} col={col} p={[0, 0.74, 0.08]} w={0.46} k={phys(tt, 1.2 + i * 1.3, 8, 0.45)} rev={cl(tt - 1.2 - i * 1.3)} />
  </group>; })}
</>; }}</Scene3D>;

// 4:28 · TRES PUNTOS DE PAPEL: la hoja se tira en izquierda, medio y derecha; cada una cuenta otra cosa
export const HPaper3: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...FOOT} cam={{ at: [0, 0.08, 0.2], az: [-0.08, 0.1], el: [0.62, 0.68], r: [1.7, 1.6], fov: 32 }}>{(tt) => { const S = [[-0.32, 1.1, 0.34, "SLIDES", "#a33a1e"], [0, 2.8, 0.08, "DRAGS", "#1f7a3a"], [0.32, 4.4, 0.34, "SLIDES", "#a33a1e"]] as const; return <>
  <Leaf p={[0, 0.056, 0.0]} /><Saddle p={[0, 0, 0.02]} d={0.2} />
  {S.map(([x, d, L, s, c], i) => { const k = eio(tt, d, d + 0.8); return <group key={x}>
    <Paper p={[x, 0.058, 0.08 + k * L]} />
    <Hand p={[x, 0.11, 0.26 + k * L]} rot={[0.2, 0, -PI]} s={0.7} bend={0.7} />
    <Tape txt={s} col={c} p={[x, 0.2, 0.58]} rot={[-0.8, 0, 0]} w={0.3} k={phys(tt, d + 0.6, 8, 0.45)} rev={cl(tt - d - 0.6)} />
  </group>; })}
</>; }}</Scene3D>;

// 4:47 · LA CASA TIRANDO: se prenden los extractores y el aire del piso se pone a correr
const Fan: React.FC<{ x: number; y: number; tt: number; on: number }> = ({ x, y, tt, on }) => <group position={[x, y, 0.02]}>
  <RBox s={[0.38, 0.38, 0.04]} r={0.016}><meshStandardMaterial color="#d6d0c4" roughness={0.55} /></RBox>
  <group position={[0, 0, 0.028]} rotation={[0, 0, tt * 16 * on]}>{[0, 1, 2, 3].map((i) => <RBox key={i} s={[0.3, 0.05, 0.004]} rot={[0, 0.3, (i * PI) / 2]} p={[Math.cos((i * PI) / 2) * 0.04, Math.sin((i * PI) / 2) * 0.04, 0]} r={0.002}>{M.steel({})}</RBox>)}</group>
</group>;
export const HFans: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...WARM} cam={{ at: [0, 0.74, 0], az: [-0.16, 0.08], el: [0.08, 0.13], r: [3.3, 3.14], fov: 32 }}>{(tt) => { const on = eio(tt, 1.0, 2.0), on2 = eio(tt, 2.2, 3.2), p = cl(on + on2); return <>
  <group position={[-1.0, 0, 0]}><Leaf /><Frame /><Saddle p={[0, 0, 0.02]} /></group>
  <Fan x={0.55} y={1.5} tt={tt} on={on} /><Fan x={1.2} y={1.5} tt={tt} on={on2} />
  <FlowPath tt={tt} pts={[[-1, 0.09, 0.0], [-0.6, 0.11, 0.3], [0.1, 0.25, 0.3], [0.5, 1.1, 0.25], [0.55, 1.5, 0.06]]} n={18} k={p * 0.5} r={0.02} v={0.5} col="#9fd2ee" />
  <FlowPath tt={tt + 0.6} pts={[[-1, 0.09, 0.0], [-0.5, 0.1, 0.4], [0.4, 0.3, 0.3], [1.1, 1.1, 0.25], [1.2, 1.5, 0.06]]} n={18} k={p * 0.5} r={0.02} v={0.5} col="#9fd2ee" />
  <Tape txt="BOTH FANS ON" col="#1c2a3a" p={[0.85, 1.15, 0.12]} w={0.68} k={phys(tt, 2.8, 8, 0.45)} rev={cl(tt - 2.8)} />
</>; }}</Scene3D>;

// 5:43 · EL CAJÓN DE LA MAESTRA: se abre: tres burletes usados y el cuarto en el paquete
export const HDrawer3: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...WARM} cam={{ at: [0, 0.5, 0.25], az: [-0.2, 0.0], el: [0.46, 0.56], r: [1.85, 1.73], fov: 32 }}>{(tt) => { const o = eio(tt, 0.6, 1.6) * 0.48; return <>
  <RBox s={[1.5, 0.5, 0.7]} p={[0, 0.25, -0.1]} r={0.012}>{M.wood({ base: [118, 80, 46] })}</RBox>
  <RBox s={[1.42, 0.05, 0.7]} p={[0, 0.5, -0.1]} r={0.008}>{M.wood({ base: [132, 92, 54] })}</RBox>
  <group position={[0, 0, o]}>
    <RBox s={[1.3, 0.03, 0.6]} p={[0, 0.34, -0.06]} r={0.004}>{M.wood({ base: [166, 130, 88] })}</RBox>
    <RBox s={[1.34, 0.17, 0.03]} p={[0, 0.4, 0.26]} r={0.008}>{M.wood({ base: [132, 92, 54] })}</RBox>
    <mesh position={[0, 0.41, 0.29]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 20]} />{M.brass()}</mesh>
    {[-0.2, -0.06, 0.08].map((z, i) => <group key={z} position={[-0.1, 0.37, z - 0.05]} rotation={[PI / 2, 0, i * 0.05]}><Sweep w={0.9} bend={0.05} /></group>)}
    <RBox s={[0.94, 0.02, 0.1]} p={[-0.1, 0.37, 0.12]} r={0.006}><meshPhysicalMaterial color="#f2eee2" transparent opacity={0.72} roughness={0.2} clearcoat={1} /></RBox>
  </group>
  <Tape txt="3 SWEEPS. NO LUCK." col="#a33a1e" p={[0.1, 0.84, 0.3]} rot={[-0.3, 0, 0]} w={0.9} k={phys(tt, 2.2, 8, 0.45)} rev={cl(tt - 2.2)} />
</>; }}</Scene3D>;

// 6:16 · LA PUERTA SE VENCIÓ: la hoja de 80 libras cede en la bisagra de arriba y abajo nace una cuña
export const HTipped: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...FOOT} cam={{ at: [0, 0.98, 0], az: [-0.12, 0.08], el: [0.02, 0.05], r: [3.45, 3.29], fov: 32 }}>{(tt) => { const s = cl(phys(tt, 1.0, 5, 0.75)) * 0.018; return <>
  <Frame /><Saddle p={[0, 0, 0.012]} />
  <Leaf sag={s} p={[0, 0.06, 0]} />
  <Hinge p={[-DW / 2 - 0.02, 1.76, 0.03]} s={1.3} /><Hinge p={[-DW / 2 - 0.02, 1.0, 0.03]} s={1.3} /><Hinge p={[-DW / 2 - 0.02, 0.3, 0.03]} s={1.3} />
  <Tape txt="80 LBS" col="#1c2a3a" p={[0.0, 1.5, 0.1]} w={0.42} k={phys(tt, 0.4, 8, 0.45)} rev={cl(tt - 0.4)} />
  <Tape txt="A WEDGE" col="#a33a1e" p={[0.72, 0.42, 0.14]} w={0.44} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
  <mesh position={[0.72, 0.17, 0.1]} rotation={[0, 0, PI]}><coneGeometry args={[0.05, 0.14, 4]} /><meshStandardMaterial color="#a33a1e" roughness={0.5} /></mesh>
</>; }}</Scene3D>;

// 6:54 · UNA MONEDA DE LUZ: la luz de arriba se mide con un nickel que entra justo
export const HNickel: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...FOOT} cam={{ at: [0.02, 2.04, 0.05], az: [-0.34, -0.2], el: [-0.06, 0], r: [0.92, 0.86], fov: 32 }}>{(tt) => { const k = phys(tt, 1.0, 7, 0.55); return <>
  <group position={[0, 0.025, 0]}><Leaf p={[0, 0, 0]} h={2.0} /></group>
  <Frame h={2.03 + 0.03} />
  <mesh position={[lerp(0.42, 0.06, cl(k)), 2.038, 0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.006, 40]} />{M.steel({ col: "#c9cbc7" })}</mesh>
  <Tape txt="NICKEL WIDE" col="#1f7a3a" p={[-0.04, 1.86, 0.1]} w={0.44} k={phys(tt, 2.4, 8, 0.45)} rev={cl(tt - 2.4)} />
</>; }}</Scene3D>;

// 7:13 · EL TORNILLO LARGO: corte por el marco: el corto queda en el jamba; el de tres pulgadas muerde el montante
export const HLongScrew: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="paper" wallZ={-1.1} bg="#2b241d" key1={[-1, 2, 1.8]} cam={{ at: [0, 1.0, 0], az: [-0.08, 0.06], el: [0.1, 0.14], r: [1.59, 1.48], fov: 30 }}>{(tt) => { const a = eio(tt, 0.6, 1.5), b = eio(tt, 1.9, 3.4); return <>
  <RBox s={[0.18, 0.6, 0.12]} p={[-0.08, 1.0, 0]} r={0.008}>{M.wood({ base: [176, 142, 100] })}</RBox>
  <RBox s={[0.4, 0.6, 0.14]} p={[0.25, 1.0, 0]} r={0.008}>{M.wood({ base: [132, 96, 60] })}</RBox>
  <RBox s={[0.004, 0.62, 0.15]} p={[0.012, 1.0, 0]} r={0.001} shadow={false}><meshBasicMaterial color="#1a120b" /></RBox>
  <group position={[-0.17, 1.14, 0.07 + 0.002]}><Screw L={0.15} p={[-0.3 * a, 0, 0]} rot={[0, PI, 0]} col="steel" /></group>
  <group position={[-0.2 - 0.3 * (1 - b), 0.88, 0.075]}><Screw L={0.42} p={[0.42, 0, 0]} rot={[0, PI, 0]} /></group>
  <Tape txt="THE OLD SHORT ONE" col="#a33a1e" p={[-0.3, 1.24, 0.12]} w={0.44} k={phys(tt, 0.6, 8, 0.45)} rev={cl(tt - 0.6)} />
  <Tape txt='3" INTO THE FRAMING' col="#1f7a3a" p={[-0.34, 0.74, 0.12]} w={0.76} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
</>; }}</Scene3D>;

// 7:37 · ANTES DE 1978: un corte en la pintura: las capas viejas guardan el plomo; el paño húmedo se lleva el polvo
export const HLead: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...WARM} cam={{ at: [0, 0.54, 0], az: [-0.3, -0.14], el: [0.04, 0.09], r: [2.0, 1.88], fov: 30 }}>{(tt) => { const L = ["#f0ede3", "#a9c2a8", "#e0b96c", "#c8d4dd", "#d7cfb9"], k = eio(tt, 0.5, 2.0); return <>
  <RBox s={[0.9, 0.9, 0.1]} p={[0, 0.5, -0.1]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
  {L.map((c, i) => <RBox key={c} s={[0.78 - (L.length - 1 - i) * 0.13 * k, 0.74 - (L.length - 1 - i) * 0.11 * k, 0.012]} p={[-i * 0.032 * k, 0.5 + i * 0.024 * k, -0.04 + (L.length - i) * 0.0135]} r={0.003}><meshStandardMaterial color={c} roughness={0.7} /></RBox>)}
  <Tape txt="BEFORE 1978" col="#a33a1e" p={[0, 0.92, 0.1]} w={0.56} k={phys(tt, 1.0, 8, 0.45)} rev={cl(tt - 1)} />
  <Tape txt="WET, NEVER DRY" col="#1c2a3a" p={[-0.06, 0.16, 0.14]} w={0.68} k={phys(tt, 3.6, 8, 0.45)} rev={cl(tt - 3.6)} />
</>; }}</Scene3D>;

// 8:39 · COMO UNA U: se abre con las manos y abraza el canto de la puerta
export const HLetterU: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="plaster" wallZ={-1.1} bg="#2b241d" key1={[-1, 2.2, 1.6]} cam={{ at: [0, 0.3, 0.03], az: [-0.72, -0.56], el: [0.16, 0.2], r: [1.17, 1.09], fov: 30 }}>{(tt) => { const sl = eio(tt, 1.0, 2.6); return <>
  <group rotation={[0, PI / 2, 0]}>
    <RBox s={[0.9, 0.5, DT]} p={[0, 0.58, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
    <group position={[(1 - sl) * 0.9, 0.34, 0]}><SealU w={0.9} /></group>
  </group>
  <Hand p={[0.14, 0.34, 0.04 + (1 - sl) * 0.6]} rot={[0.1, 0.5, 1.4]} s={0.72} bend={0.7} />
  <Tape txt="SLIDES ON. NO SCREWS." col="#1f7a3a" p={[0.0, 0.14, 0.22]} rot={[-0.3, -0.6, 0]} w={0.72} k={phys(tt, 3, 8, 0.45)} rev={cl(tt - 3)} />
</>; }}</Scene3D>;

// 9:23 · TOCAR, NO APLASTAR: la aleta baja, se dobla apenas y ahí frena la mano
export const HTouch: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="paper" wallZ={-1.1} bg="#2b241d" key1={[-1, 2.2, 1.6]} cam={{ at: [0, 0.2, 0], az: [-0.1, 0.02], el: [0.08, 0.13], r: [1.09, 1.03], fov: 30 }}>{(tt) => { const d = phys(tt, 0.8, 7, 0.6), c = eio(tt, 2.8, 3.5), crush = c * (1 - eio(tt, 4.7, 5.4)), y = 0.26 - 0.075 * cl(d) - 0.055 * crush, curl = 0.08 + cl(d - 0.9) * 0.34 + crush * 1.1; return <>
  <group rotation={[0, PI / 2, 0]}>
    <RBox s={[0.9, 0.08, 0.14]} p={[0, 0.04, 0]} r={0.008}>{M.wood({ base: [150, 106, 62] })}</RBox>
    <RBox s={[0.9, 0.3, DT]} p={[0, y + 0.18, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
    <group position={[0, y + 0.0, DT / 2 + 0.004]} rotation={[0, 0, 0]}><group position={[0, 0.0, 0]}><RBox s={[0.9, 0.05, 0.008]} r={0.002}>{M.steel({})}</RBox><group position={[0, -0.026, 0]} rotation={[curl, 0, 0]}><RBox s={[0.9, 0.05, 0.005]} p={[0, -0.025, 0]} r={0.002}>{M.rubber({ col: "#2a292c" })}</RBox></group></group></group>
  </group>
  <Tape txt={crush > 0.3 ? "CRUSHED" : "JUST TOUCHING"} col={crush > 0.3 ? "#a33a1e" : "#1f7a3a"} p={[0.0, 0.5, 0.2]} rot={[0, 0.1, 0]} w={0.62} k={phys(tt, 2.0, 8, 0.45)} rev={cl(tt - 2.0)} />
</>; }}</Scene3D>;

// 10:44 · LA CULEBRA EN EL PISO: un burlete de tela en el paso; el bastón lo encuentra
export const HHip: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...WARM} cam={{ at: [0, 0.2, 0.36], az: [-0.52, -0.34], el: [0.2, 0.26], r: [1.85, 1.75], fov: 32 }}>{(tt) => { const k = phys(tt, 0.5, 8, 0.45), ca = eio(tt, 1.6, 3.2), tilt = eio(tt, 3.2, 3.8) * 0.28; return <>
  <Leaf /><Frame /><Saddle p={[0, 0, 0.02]} />
  {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[-0.46 + i * 0.04, 0.05 + (1 - cl(k)) * 0.8, 0.2 + Math.sin(i * 0.7) * 0.014]}><sphereGeometry args={[0.05, 12, 10]} /><meshStandardMaterial color={i % 4 < 2 ? "#a8452e" : "#c8a05a"} roughness={1} /></mesh>)}
  <group position={[lerp(0.5, 0.12, ca), 0.45, lerp(1.0, 0.25, ca)]} rotation={[0.14 + tilt, 0, tilt * 0.7]}><mesh><cylinderGeometry args={[0.012, 0.012, 0.9, 14]} />{M.wood({ base: [86, 58, 34] })}</mesh></group>
  <Tape txt="NOT WHERE YOU WALK" col="#a33a1e" p={[0, 0.5, 0.42]} w={0.92} k={phys(tt, 3.5, 8, 0.45)} rev={cl(tt - 3.5)} />
</>; }}</Scene3D>;

// 11:24 · PARA QUÉ LADO ABRE: la puerta barre y el burlete va en la cara hacia donde abre
export const HSwing: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...FOOT} cam={{ at: [0, 0.24, 0.3], az: [-0.14, 0.14], el: [0.92, 0.98], r: [2.99, 2.83], fov: 32 }}>{(tt) => { const a = eio(tt, 1.0, 2.2) * (1 - eio(tt, 2.8, 3.4)); return <>
  <Frame /><Saddle p={[0, 0, 0.02]} />
  <Leaf swing={a * 1.2} p={[0, 0.054, 0]} />
  <group position={[-DW / 2, 0, 0]} rotation={[0, a * 1.2, 0]}><group position={[DW / 2, 0.05, DT / 2 + 0.012]}><Sweep w={DW - 0.03} bend={0.1} col="#3fb26b" /></group></group>
  {Array.from({ length: 12 }, (_, i) => { const u = (i / 11) * 1.2, r = DW; return <RBox key={i} s={[0.02, 0.002, 0.02]} p={[-DW / 2 + Math.cos(u) * r, 0.057, Math.sin(u) * r]} r={0.001} shadow={false}><meshBasicMaterial color="#d6ccb4" /></RBox>; })}
  <Tape txt="ON THE SIDE IT SWINGS TO" col="#1f7a3a" p={[0.1, 0.18, 0.92]} rot={[-1.2, 0, 0]} w={1.1} k={phys(tt, 2.8, 8, 0.45)} rev={cl(tt - 2.8)} />
</>; }}</Scene3D>;

// 11:33 · VINILO O CEPILLO: umbral liso, umbral con joroba: uno sella y otro abraza las lomas
export const HVinylBrush: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" floor="oak" wall="paper" wallZ={-1.1} bg="#2b241d" key1={[-1, 2.2, 1.6]} cam={{ at: [0, 0.14, 0], az: [-0.06, 0.05], el: [0.08, 0.12], r: [2.44, 2.31], fov: 30 }}>{(tt) => { const d = (x: number) => 0.3 - 0.1 * cl(phys(tt, x, 7, 0.6)); return <>
  <RBox s={[1.0, 0.06, 0.14]} p={[-0.56, 0.03, 0]} r={0.006}>{M.wood({ base: [162, 118, 74] })}</RBox>
  <group position={[-0.56, d(0.8), 0]}><Sweep w={0.96} bend={0.05} /></group>
  {Array.from({ length: 16 }, (_, i) => <RBox key={i} s={[0.064, 0.05 + 0.024 * Math.abs(Math.sin(i * 1.1)), 0.14]} p={[0.2 + i * 0.0625, 0.03, 0]} r={0.008}>{M.wood({ base: [130, 92, 54] })}</RBox>)}
  <group position={[0.68, d(2.4), 0]}><Sweep w={0.96} kind="brush" /></group>
  <Tape txt="SMOOTH: VINYL" col="#1c2a3a" p={[-0.56, 0.5, 0.12]} w={0.6} k={phys(tt, 1.2, 8, 0.45)} rev={cl(tt - 1.2)} />
  <Tape txt="ROUGH: BRUSH" col="#b5541c" p={[0.66, 0.5, 0.12]} w={0.6} k={phys(tt, 2.9, 8, 0.45)} rev={cl(tt - 2.9)} />
</>; }}</Scene3D>;

// 12:36 · RANURAS LARGAS A PROPÓSITO: la tira sube y baja sobre el tornillo sin soltarse
export const HSlots: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="paper" wallZ={-1.1} bg="#2b241d" key1={[-1, 2.2, 1.6]} cam={{ at: [0, 0.3, 0.03], az: [-0.24, -0.12], el: [0.08, 0.12], r: [1.07, 0.99], fov: 30 }}>{(tt) => { const y = 0.03 * Math.sin(cl((tt - 1.4) / 3.0) * PI * 2); return <>
  <RBox s={[1.0, 0.56, 0.03]} p={[0, 0.3, -0.02]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
  <group position={[0, 0.27 + y, 0]}><RBox s={[0.92, 0.14, 0.006]} r={0.003}>{M.steel({ col: "#d1d3d1" })}</RBox></group>
  {[-0.3, 0.3].map((x) => <group key={x}><RBox s={[0.03, 0.09, 0.004]} p={[x, 0.27 + y, 0.004]} r={0.002} shadow={false}><meshBasicMaterial color="#262523" /></RBox><mesh position={[x, 0.27, 0.012]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.006, 20]} />{M.brass()}</mesh><RBox s={[0.026, 0.004, 0.002]} p={[x, 0.27, 0.0155]} r={0.0006} shadow={false}><meshBasicMaterial color="#6b5824" /></RBox></group>)}
  <Tape txt="ROOM TO MOVE" col="#1f7a3a" p={[0, 0.5, 0.06]} w={0.62} k={phys(tt, 0.8, 8, 0.45)} rev={cl(tt - 0.8)} />
</>; }}</Scene3D>;

// 13:28 · LA ALETA CANSADA: dos semanas después de apretarla: se enrolla, se rompe y deja pasar
export const HCurl: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="paper" wallZ={-1.1} bg="#2b241d" key1={[-1, 2.2, 1.6]} cam={{ at: [0, 0.16, 0], az: [-0.92, -0.74], el: [0.08, 0.13], r: [0.76, 0.71], fov: 30 }}>{(tt) => { const c = eio(tt, 1.0, 3.6), Fins = 16; return <>
  <group rotation={[0, PI / 2, 0]}>
    <RBox s={[1.1, 0.07, 0.15]} p={[0, 0.035, 0]} r={0.006}>{M.wood({ base: [150, 106, 62] })}</RBox>
    <RBox s={[1.1, 0.26, DT]} p={[0, 0.3, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
    <RBox s={[1.1, 0.05, 0.008]} p={[0, 0.17, DT / 2 + 0.005]} r={0.002}>{M.steel({})}</RBox>
    {Array.from({ length: Fins }, (_, i) => { const x = -0.5 + (i * 1.0) / (Fins - 1), tear = i % 5 === 2 ? c : 0; return <group key={i} position={[x, 0.143, DT / 2 + 0.005]} rotation={[0.2 + 1.4 * c, 0, 0]}><RBox s={[1.0 / Fins - 0.002 - 0.02 * tear, 0.066 * (1 - tear * 0.5), 0.005]} p={[0, -0.03, 0]} r={0.0016}>{M.rubber({ col: "#2a292c" })}</RBox></group>; })}
  </group>
  <Tape txt="2 WEEKS LATER" col="#a33a1e" p={[0.06, 0.5, 0.2]} rot={[0, -0.9, 0]} w={0.56} k={phys(tt, 1.6, 8, 0.45)} rev={cl(tt - 1.6)} />
</>; }}</Scene3D>;
