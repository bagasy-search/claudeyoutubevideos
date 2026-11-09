// ohf8pc · componentes 19-36: el umbral gastado, el hueco escondido, el plunger, las esquinas, los errores, el maestro, el fuego, las preguntas
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { FlowPath, Hand, Tape } from "./okit";
import { Cold, DH, DT, DW, Frame, Joist, Leaf, Light, Paper, PI, Saddle, Sweep } from "./doorkit";

type P = { t: number; h: H };
const FOOT = { floor: "oak" as const, wall: "plaster" as const, wallZ: -0.05, bg: "#1d1915", key1: [-1, 2, 1.6] };
const WARM = { floor: "oak" as const, wall: "paper" as const, wallZ: -0.05, bg: "#1d1915", key1: [-1, 2.2, 1.8] };
const VOID = { floor: "oak" as const, wall: "plaster" as const, wallZ: -1.1, bg: "#2b241d", key1: [-1, 2.2, 1.6] };
const BLK = { col: "#2a292c" };

// 14:26 · COMO UN ESCALÓN DE PIEDRA: la regla apoya en las puntas y en el medio entra una luz de media pulgada
export const HStoneStep: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...VOID} cam={{ at: [0, 0.12, 0], az: [-0.08, 0.06], el: [0.06, 0.1], r: [1.5, 1.41], fov: 30 }}>{(tt) => { const sc = eio(tt, 0.4, 2.0) * 0.05, r = cl(phys(tt, 2.2, 8, 0.45)); return <>
  <Saddle w={1.0} d={0.18} h={0.1} scoop={sc} />
  <RBox s={[1.06, 0.03, 0.04]} p={[0, 0.115 + (1 - r) * 0.5, 0.0]} r={0.004}>{M.wood({ base: [186, 150, 106] })}</RBox>
  <RBox s={[0.01, Math.max(0.006, sc * r), 0.01]} p={[0, 0.1 - (sc * r) / 2, 0.095]} r={0.002} shadow={false}><meshBasicMaterial color="#d43d2a" toneMapped={false} /></RBox>
  <Tape txt={'1/2" GONE'} col="#a33a1e" p={[0.0, 0.36, 0.08]} w={0.42} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
</>; }}</Scene3D>;

// 15:02 · BLANDO COMO TORTA: el punzón rebota en lo sano y se hunde en lo podrido
export const HCake: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...VOID} cam={{ at: [0, 0.2, 0], az: [-0.36, -0.2], el: [0.34, 0.4], r: [1.66, 1.56], fov: 30 }}>{(tt) => { const a = eio(tt, 0.7, 1.1) * (1 - eio(tt, 1.25, 1.7)), b = eio(tt, 2.8, 3.6); return <>
  <RBox s={[0.68, 0.14, 0.3]} p={[-0.36, 0.07, 0]} r={0.008}>{M.wood({ base: [160, 116, 70] })}</RBox>
  <RBox s={[0.68, 0.14, 0.3]} p={[0.36, 0.07, 0]} r={0.012}><meshStandardMaterial color="#3e2e22" roughness={1} /></RBox>
  {Array.from({ length: 18 }, (_, i) => <RBox key={i} s={[0.04 + rn(i, 31) * 0.05, 0.016, 0.03]} p={[0.06 + rn(i, 32) * 0.6, 0.144, -0.12 + rn(i, 33) * 0.24]} rot={[0, rn(i, 34) * 3, 0]} r={0.005}><meshStandardMaterial color="#5a4432" roughness={1} /></RBox>)}
  {([[-0.36, a * 0.015], [0.36, b * 0.11]] as const).map(([x, dep]) => <group key={x} position={[x, 0.145 - dep, 0]}><mesh position={[0, 0.03, 0]}><coneGeometry args={[0.012, 0.06, 12]} />{M.steel({})}</mesh><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.006, 0.006, 0.16, 10]} />{M.steel({})}</mesh><mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.03, 0.026, 0.18, 18]} />{M.wood({ base: [176, 138, 92] })}</mesh></group>)}
  <Tape txt="HARD: FINE" col="#1f7a3a" p={[-0.36, 0.54, 0.1]} w={0.44} k={phys(tt, 1.5, 8, 0.45)} rev={cl(tt - 1.5)} />
  <Tape txt="SOFT LIKE CAKE" col="#a33a1e" p={[0.36, 0.54, 0.1]} w={0.6} k={phys(tt, 3.6, 8, 0.45)} rev={cl(tt - 3.6)} />
</>; }}</Scene3D>;

// 16:25 · LO QUE NADIE MIRA: sale el umbral y debajo hay un túnel directo a la calle
export const HHidden: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...VOID} floor="none" cam={{ at: [0, 0.0, 0.06], az: [-0.76, -0.6], el: [0.14, 0.2], r: [1.5, 1.41], fov: 30 }}>{(tt) => { const up = eio(tt, 0.7, 2.0), w = cl(tt - 2); return <>
  <group rotation={[0, PI / 2, 0]}>
    <RBox s={[1.6, 0.05, 0.42]} p={[0, -0.025, 0.5]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
    <RBox s={[1.6, 0.16, 0.42]} p={[0, -0.14, 0.5]} r={0.004}><meshStandardMaterial color="#54463a" roughness={0.95} /></RBox>
    <RBox s={[1.6, 0.2, 0.42]} p={[0, -0.1, -0.5]} r={0.004}><meshStandardMaterial color="#8b8a82" roughness={0.95} /></RBox>
    <RBox s={[0.6, 0.016, 0.62]} p={[0, -0.2, 0]} r={0.003}><meshStandardMaterial color="#29231c" roughness={1} /></RBox>
    <group position={[0, 0.0 + up * 0.5, 0]} rotation={[0.3 * up, 0, 0]}><RBox s={[1.04, 0.06, 0.6]} p={[0, 0.03, 0]} r={0.006}>{M.wood({ base: [150, 106, 62] })}</RBox></group>
  </group>
  <Cold tt={tt} x0={-0.65} x1={0.65} z0={-0.1} z1={-0.1} k={0} />
  {[-0.28, -0.1, 0.08, 0.26].map((z, i) => <FlowPath key={z} tt={tt + i * 0.4} pts={[[-0.54, -0.08, z], [-0.24, -0.14, z], [0.1, -0.14, z + 0.02], [0.32, -0.02, z + 0.06], [0.58, 0.05, z + 0.1]]} n={14} k={w} r={0.015} v={0.5} col="#9fd2ee" />)}
  <Tape txt="NOBODY LOOKS HERE" col="#a33a1e" p={[0, 0.42, 0.16]} rot={[0, -0.7, 0]} w={0.88} k={phys(tt, 2.4, 8, 0.45)} rev={cl(tt - 2.4)} />
</>; }}</Scene3D>;

// 17:03 · PARA AFUERA: el umbral inclinado: la gota corre hacia la calle
export const HSlope: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...VOID} cam={{ at: [0, 0.12, 0], az: [-0.12, 0.05], el: [0.08, 0.12], r: [1.43, 1.35], fov: 30 }}>{(tt) => { const rk = eio(tt, 0.6, 1.6) * -0.1, dr = eio(tt, 1.9, 3.9); return <>
  <RBox s={[1.4, 0.16, 0.5]} p={[0, -0.08, 0]} r={0.004}><meshStandardMaterial color="#54463a" roughness={0.95} /></RBox>
  <group position={[0, 0.03, 0]} rotation={[0, 0, rk]}><RBox s={[1.1, 0.06, 0.34]} r={0.006}><meshPhysicalMaterial color="#b08650" roughness={0.3} clearcoat={0.8} /></RBox><mesh position={[lerp(-0.45, 0.46, dr), 0.046, 0]} scale={[1.3, 0.55, 1]}><sphereGeometry args={[0.035, 18, 14]} />{M.water({ op: 0.85 })}</mesh></group>
  <Tape txt="INSIDE" col="#1c2a3a" p={[-0.42, 0.34, 0.1]} w={0.3} k={phys(tt, 0.5, 8, 0.45)} rev={cl(tt - 0.5)} />
  <Tape txt="RAIN RUNS OUT" col="#1f7a3a" p={[0.3, 0.3, 0.1]} w={0.56} k={phys(tt, 3.0, 8, 0.45)} rev={cl(tt - 3)} />
</>; }}</Scene3D>;

// 17:50 · EL BOTONCITO: al cerrar, el pistón toca el marco y baja la goma; al abrir se levanta y libra la alfombra
export const HPlunger: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...VOID} cam={{ at: [0, 0.3, 0.06], az: [-0.16, -0.04], el: [0.08, 0.13], r: [1.5, 1.41], fov: 30 }}>{(tt) => { const cl1 = eio(tt, 1.0, 2.2), inn = eio(tt, 2.1, 2.5), down = 0.05 * inn, X = lerp(0.3, 0, cl1); return <>
  <RBox s={[1.5, 0.05, 0.3]} p={[0.06, 0.025, 0]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
  <RBox s={[0.1, 0.8, 0.14]} p={[-0.56, 0.4, 0]} r={0.008}><meshStandardMaterial color="#ece6d6" roughness={0.55} /></RBox>
  <group position={[X, 0, 0]}>
    <RBox s={[1.0, 0.54, DT]} p={[0, 0.44, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
    <RBox s={[1.0, 0.1, DT + 0.012]} p={[0, 0.17, 0]} r={0.003}>{M.steel({})}</RBox>
    <RBox s={[0.98, 0.046, DT - 0.004]} p={[0, 0.11 - down, 0]} r={0.003}>{M.rubber(BLK)}</RBox>
    <mesh position={[-0.5 - 0.03 * (1 - inn), 0.17, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.06, 14]} />{M.brass()}</mesh>
  </group>
  <Tape txt={inn > 0.5 ? "CLICK. SEALED." : "OPEN: IT LIFTS"} col={inn > 0.5 ? "#1f7a3a" : "#1c2a3a"} p={[0.25, 0.86, 0.06]} w={0.66} k={phys(tt, 0.8, 8, 0.45)} rev={cl(tt - 0.8)} />
</>; }}</Scene3D>;

// 18:38 · UN CUARTO DE VUELTA: los tornillos del umbral de metal; la tira sube de a poco
export const HQuarter: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...VOID} cam={{ at: [0, 0.1, 0.02], az: [-0.3, -0.16], el: [0.62, 0.7], r: [1.20, 1.12], fov: 30 }}>{(tt) => { const q = eio(tt, 1.0, 2.0) + eio(tt, 2.7, 3.7), up = q * 0.011; return <>
  <RBox s={[1.2, 0.05, 0.22]} p={[0, 0.025, 0]} r={0.006}><meshStandardMaterial color="#b9a877" roughness={0.55} metalness={0.45} /></RBox>
  <RBox s={[1.2, 0.03 + up, 0.05]} p={[0, 0.058 + up / 2, 0]} r={0.004}><meshStandardMaterial color="#e2dfd2" roughness={0.65} /></RBox>
  {[-0.36, 0, 0.36].map((x) => <group key={x} position={[x, 0.078 + up, 0]} rotation={[0, (q * PI) / 2, 0]}><mesh><cylinderGeometry args={[0.018, 0.018, 0.005, 20]} />{M.brass()}</mesh><RBox s={[0.03, 0.002, 0.004]} p={[0, 0.003, 0]} r={0.0006} shadow={false}><meshBasicMaterial color="#574a1e" /></RBox></group>)}
  <Tape txt="CHECK THIS FIRST" col="#1f7a3a" p={[0, 0.1, 0.24]} rot={[-1, 0, 0]} w={0.66} k={phys(tt, 2.2, 8, 0.45)} rev={cl(tt - 2.2)} />
</>; }}</Scene3D>;

// 19:13 · EL AGUJERO DEL LÁPIZ: donde se juntan los dos burletes queda un hueco del tamaño de un lápiz
export const HPencilHole: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...VOID} cam={{ at: [-0.46, 0.09, 0.03], az: [-0.16, -0.02], el: [0.16, 0.22], r: [0.68, 0.62], fov: 30 }}>{(tt) => { const pk = phys(tt, 2.0, 8, 0.45), w = cl(tt - 0.6); return <>
  <RBox s={[1.3, 0.05, 0.3]} p={[0, 0.025, 0]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
  <RBox s={[0.12, 0.9, 0.14]} p={[-0.56, 0.45, 0]} r={0.008}><meshStandardMaterial color="#ece6d6" roughness={0.55} /></RBox>
  <RBox s={[0.018, 0.9, 0.05]} p={[-0.49, 0.5, 0.0]} r={0.004}>{M.rubber(BLK)}</RBox>
  <RBox s={[1, 0.5, DT]} p={[0.06, 0.34, -0.01]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
  <group position={[0.04, 0.09, DT / 2]}><Sweep w={0.98} bend={0.05} /></group>
  {[0, 1, 2].map((i) => <FlowPath key={i} tt={tt + i * 0.5} pts={[[-0.5, 0.075, -0.15], [-0.49, 0.075, 0.0], [-0.45, 0.08, 0.15], [-0.36, 0.09, 0.3]]} n={9} k={w} r={0.0055} v={0.5} col="#9fd2ee" />)}
  <group position={[-0.48 + (1 - cl(pk)) * -0.4, 0.078, 0.11]} rotation={[0, 0.2, PI / 2]}><mesh><cylinderGeometry args={[0.0065, 0.0065, 0.28, 12]} /><meshStandardMaterial color="#e5b432" roughness={0.45} /></mesh></group>
  <Tape txt="THE CORNER" col="#a33a1e" p={[-0.3, 0.22, 0.16]} rot={[0, -0.05, 0]} w={0.26} k={phys(tt, 2.8, 8, 0.45)} rev={cl(tt - 2.8)} />
</>; }}</Scene3D>;

// 19:36 · UNA ESTAMPILLA DE ESPUMA: el pad se pega en la esquina y la corriente se corta
export const HStamp: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...VOID} cam={{ at: [-0.46, 0.14, 0.03], az: [-0.3, -0.18], el: [0.14, 0.2], r: [0.73, 0.68], fov: 30 }}>{(tt) => { const pk = phys(tt, 1.2, 9, 0.42), w = 1 - eio(tt, 2.1, 2.8); return <>
  <RBox s={[1.3, 0.05, 0.3]} p={[0, 0.025, 0]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
  <RBox s={[0.12, 0.9, 0.14]} p={[-0.56, 0.45, 0]} r={0.008}><meshStandardMaterial color="#ece6d6" roughness={0.55} /></RBox>
  <RBox s={[1, 0.5, DT]} p={[0.06, 0.34, -0.01]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
  <RBox s={[0.018, 0.06, 0.06]} p={[-0.49 + (1 - cl(pk)) * 0.12, 0.08 + (1 - cl(pk)) * 0.12, 0.05 + (1 - cl(pk)) * 0.2]} r={0.005}><meshStandardMaterial color="#3a3f4a" roughness={0.9} /></RBox>
  {w > 0.02 && [0, 1, 2].map((i) => <FlowPath key={i} tt={tt + i * 0.5} pts={[[-0.5, 0.075, -0.15], [-0.49, 0.075, 0.0], [-0.45, 0.08, 0.15], [-0.36, 0.09, 0.3]]} n={9} k={w} r={0.0055} v={0.5} col="#9fd2ee" />)}
  <Tape txt="30 SECONDS" col="#1f7a3a" p={[-0.3, 0.26, 0.16]} w={0.26} k={phys(tt, 2.8, 8, 0.45)} rev={cl(tt - 2.8)} />
</>; }}</Scene3D>;

// 20:15 · CUÑA Y REGLA: la goma derecha baja contra la luz en cuña: toca sólo en una punta
export const HWedge: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...FOOT} wallZ={-0.04} cam={{ at: [0, 0.14, 0], az: [-0.04, 0.05], el: [0.05, 0.08], r: [1.7, 1.6], fov: 30 }}>{(tt) => { const d = cl(phys(tt, 1.2, 7, 0.6)); return <>
  <RBox s={[1.2, 0.05, 0.12]} p={[0, 0.025, 0.04]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
  <RBox s={[0.96, 0.5, 0.04]} p={[0, 0.34, 0]} rot={[0, 0, -0.022]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox>
  <group position={[0, 0.002, 0.015]}><Light w={0.96} a={0.0} b={0.05} y={0.05} /></group>
  <group position={[0, lerp(0.34, 0.1, d), 0.05]}><Sweep w={0.92} bend={0.05} /></group>
  <Tape txt="STRAIGHT RUBBER" col="#1c2a3a" p={[-0.2, 0.42, 0.12]} w={0.56} k={phys(tt, 0.5, 8, 0.45)} rev={cl(tt - 0.5)} />
  <Tape txt="CROOKED GAP" col="#a33a1e" p={[0.3, 0.26, 0.12]} w={0.48} k={phys(tt, 2.6, 8, 0.45)} rev={cl(tt - 2.6)} />
</>; }}</Scene3D>;

// 21:07 · LOS AGUJEROS DE LLORAR: el agua sale por ahí; el sellador los tapa y se acumula adentro
export const HWeep: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" {...VOID} cam={{ at: [0, 0.1, 0.05], az: [-0.3, -0.16], el: [0.1, 0.14], r: [1.27, 1.20], fov: 30 }}>{(tt) => { const cau = eio(tt, 2.8, 3.8), lvl = eio(tt, 3.8, 5.6); return <>
  <RBox s={[1.2, 0.12, 0.24]} p={[0, 0.06, 0]} r={0.004}>{M.steel({ col: "#c9b887" })}</RBox>
  <RBox s={[1.14, 0.028 + 0.06 * lvl, 0.19]} p={[0, 0.13 + 0.03 * lvl, 0]} r={0.008}>{M.water({ op: 0.7 })}</RBox>
  {[-0.36, 0, 0.36].map((x, i) => <group key={x}>
    <RBox s={[0.05, 0.02, 0.003]} p={[x, 0.05, 0.121]} r={0.001} shadow={false}><meshBasicMaterial color="#1a1a1a" /></RBox>
    {cau < 0.5 && <FlowPath tt={tt + i * 0.3} pts={[[x, 0.05, 0.12], [x, 0.03, 0.17], [x, 0.0, 0.26], [x, -0.07, 0.3]]} n={9} k={1 - cau * 2} r={0.009} v={0.6} col="#7db8df" />}
    <RBox s={[0.08 * cau + 0.002, 0.03 * cau + 0.002, 0.012]} p={[x, 0.05, 0.124]} r={0.003}><meshStandardMaterial color="#ded9cc" roughness={0.75} /></RBox>
  </group>)}
  <Tape txt="LEAVE THEM OPEN" col="#a33a1e" p={[0, 0.36, 0.14]} w={0.68} k={phys(tt, 3.6, 8, 0.45)} rev={cl(tt - 3.6)} />
</>; }}</Scene3D>;

// 22:25 · SIN LUZ: se apaga la rendija, de punta a punta
export const HNoLight: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...FOOT} cam={{ at: [0, 0.24, 0], az: [-0.1, 0.06], el: [0.05, 0.08], r: [1.8, 1.7], fov: 30 }}>{(tt) => { const off = 1 - eio(tt, 1.2, 3.2); return <>
  <Leaf p={[0, 0.056, 0]} /><Frame /><Saddle p={[0, 0, 0.012]} />
  <group position={[0, 0, 0.012]}><Light a={0.008} b={0.008} y={0.05} k={off} /></group>
  <Sweep w={DW - 0.03} p={[0, 0.082, 0.037]} bend={0.08} />
  <Tape txt="THAT'S IT. DONE." col="#1f7a3a" p={[0, 0.42, 0.14]} w={0.66} k={phys(tt, 3.4, 8, 0.45)} rev={cl(tt - 3.4)} />
</>; }}</Scene3D>;

// 23:46 · EL VIENTO EN LA MANO: sale la pieza vieja y la mano siente lo que nadie vio
export const HWindHand: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...VOID} cam={{ at: [0, 0.06, 0.05], az: [-0.58, -0.42], el: [0.14, 0.2], r: [1.43, 1.34], fov: 30 }}>{(tt) => { const w = cl(tt - 0.8), wig = Math.sin(tt * 5) * 0.03; return <>
  <RBox s={[1.2, 0.05, 0.34]} p={[0, -0.025, 0.42]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
  <RBox s={[1.2, 0.2, 0.34]} p={[0, -0.1, -0.42]} r={0.004}><meshStandardMaterial color="#8b8a82" roughness={0.95} /></RBox>
  <RBox s={[1.2, 0.02, 0.6]} p={[0, -0.21, 0]} r={0.004}><meshStandardMaterial color="#29231c" roughness={1} /></RBox>
  <Hand p={[0.0, -0.02 + wig, 0.12]} rot={[-0.1, 0, PI]} s={1.05} bend={0.2} />
  {[-0.22, -0.08, 0.08, 0.22].map((x, i) => <FlowPath key={x} tt={tt + i * 0.4} pts={[[x, -0.15, -0.5], [x, -0.1, -0.2], [x, -0.03, 0.1], [x + 0.02, 0.06, 0.45]]} n={13} k={w} r={0.011} v={0.5} col="#9fd2ee" />)}
  <Tape txt="SEALED, THEY SAID" col="#a33a1e" p={[0.1, 0.3, 0.3]} rot={[0, -0.55, 0]} w={0.74} k={phys(tt, 2.0, 8, 0.45)} rev={cl(tt - 2)} />
</>; }}</Scene3D>;

// 24:07 · EL FUEGO TAMBIÉN RESPIRA: la llama pierde su aire a medida que la casa se cierra
export const HFire: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" wallZ={-0.3} bg="#141210" key1={[-1, 2, 1.6]} cam={{ at: [0, 0.34, 0], az: [-0.16, 0.05], el: [0.08, 0.13], r: [1.95, 1.83], fov: 30 }}>{(tt) => { const lean = eio(tt, 1.6, 3.8), a = 1 - lean * 0.6; return <>
  <RBox s={[0.96, 0.08, 0.5]} p={[0, 0.04, 0]} r={0.008}>{M.steel({ col: "#55585e" })}</RBox>
  {[-0.3, 0, 0.3].map((x, i) => <group key={x} position={[x, 0.09, 0]}>
    <mesh position={[0, 0.13 * a, 0]} scale={[1 + lean * 0.5, a, 1]}><coneGeometry args={[0.07, 0.26, 18]} /><meshBasicMaterial color={lean > 0.5 ? "#d59430" : "#3c8ef0"} toneMapped={false} transparent opacity={0.86} /></mesh>
    <mesh position={[0, 0.1 * a, 0]} scale={[0.5, a, 0.5]}><coneGeometry args={[0.06, 0.2, 14]} /><meshBasicMaterial color={lean > 0.5 ? "#f1d07a" : "#bfe2ff"} toneMapped={false} /></mesh>
  </group>)}
  {[-1, 1].map((s, i) => <FlowPath key={s} tt={tt + i * 0.5} pts={[[s * 1.2, 0.2, 0.3], [s * 0.7, 0.14, 0.15], [s * 0.3, 0.12, 0.05], [s * 0.08, 0.14, 0.02]]} n={12} k={1 - lean} r={0.015} v={0.5} col="#9fd2ee" />)}
  <Tape txt="FIRE NEEDS AIR" col="#b5541c" p={[0, 0.72, 0.1]} w={0.64} k={phys(tt, 0.7, 8, 0.45)} rev={cl(tt - 0.7)} />
  <Tape txt="CO ALARM, EVERY FLOOR" col="#a33a1e" p={[0, 0.56, 0.16]} w={0.92} k={phys(tt, 3.4, 8, 0.45)} rev={cl(tt - 3.4)} />
</>; }}</Scene3D>;

// 24:46 · CON UNA MANO: la puerta se abre con un dedo aunque el burlete esté puesto
export const HOneHand: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...WARM} cam={{ at: [0.1, 0.92, 0.1], az: [-0.18, 0.1], el: [0.04, 0.08], r: [4.03, 3.82], fov: 32 }}>{(tt) => { const a = eio(tt, 1.4, 3.0); return <>
  <Frame /><Saddle p={[0, 0, 0.02]} />
  <Leaf swing={a * 1.1} p={[0, 0.056, 0]} />
  <group position={[-DW / 2, 0, 0]} rotation={[0, a * 1.1, 0]}><group position={[DW / 2, 0.082, DT / 2 + 0.012]}><Sweep w={DW - 0.03} bend={0.1} /></group><Hand p={[DW - 0.08, 1.05, 0.13]} rot={[0.1, 0, -PI / 2]} s={1.15} bend={0.75} /></group>
  <Tape txt="ONE HAND. ALWAYS." col="#a33a1e" p={[0.82, 1.75, 0.24]} w={0.9} k={phys(tt, 2.8, 8, 0.45)} rev={cl(tt - 2.8)} />
</>; }}</Scene3D>;

// 25:33 · DOS PUERTAS: cada una con su burlete y en el medio la tira alta deja la misma esquina
export const HFrench: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" {...FOOT} wallZ={-0.04} cam={{ at: [0, 0.3, 0], az: [-0.1, 0.06], el: [0.08, 0.13], r: [2.0, 1.89], fov: 30 }}>{(tt) => { const pk = phys(tt, 2.0, 8, 0.45), w = cl(tt - 0.6); return <>
  {[-1, 1].map((s) => <group key={s} position={[s * 0.45, 0, 0]}><RBox s={[0.87, 1.0, 0.04]} p={[0, 0.56, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox><group position={[0, 0.082, 0.024]}><Sweep w={0.84} bend={0.06} /></group></group>)}
  <RBox s={[1.9, 0.05, 0.14]} p={[0, 0.025, 0.02]} r={0.004}>{M.wood({ base: [150, 106, 62] })}</RBox>
  <RBox s={[0.05, 1.05, 0.03]} p={[0, 0.62, 0.05]} r={0.004}>{M.wood({ base: [116, 76, 40] })}</RBox>
  {[0, 1, 2].map((i) => <FlowPath key={i} tt={tt + i * 0.5} pts={[[0, 0.07, -0.2], [0, 0.07, 0.04], [0.02, 0.08, 0.26], [0.08, 0.09, 0.5]]} n={9} k={w} r={0.0085} v={0.5} col="#9fd2ee" />)}
  <Tape txt="SAME CORNER LEAK" col="#a33a1e" p={[0, 1.24, 0.1]} w={0.76} k={phys(tt, 2.4, 8, 0.45)} rev={cl(tt - 2.4)} />
  <RBox s={[0.06, 0.06, 0.02]} p={[0, 0.09, 0.08]} r={0.01}><meshStandardMaterial color="#c8281e" roughness={0.4} transparent opacity={cl(pk) * 0.85} /></RBox>
</>; }}</Scene3D>;

// 26:11 · LA REJILLA NO SE TAPA: puerta del cuarto de la caldera: la mano con la cinta se detiene
export const HLouver: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" {...WARM} cam={{ at: [0, 0.54, 0], az: [-0.16, 0.05], el: [0.06, 0.1], r: [2.24, 2.09], fov: 30 }}>{(tt) => { const mv = eio(tt, 1.2, 2.6), nope = phys(tt, 2.8, 8, 0.45); return <>
  <RBox s={[0.9, 1.3, 0.04]} p={[0, 0.65, 0]} r={0.006}><meshStandardMaterial color="#d8d0bf" roughness={0.6} /></RBox>
  <RBox s={[0.56, 0.36, 0.01]} p={[0, 0.36, 0.022]} r={0.003}><meshStandardMaterial color="#6d6658" roughness={0.6} /></RBox>
  {Array.from({ length: 7 }, (_, i) => <RBox key={i} s={[0.5, 0.03, 0.02]} p={[0, 0.22 + i * 0.047, 0.034]} rot={[-0.5, 0, 0]} r={0.002}><meshStandardMaterial color="#d8d0bf" roughness={0.6} /></RBox>)}
  {[0, 1, 2].map((i) => <FlowPath key={i} tt={tt + i * 0.5} pts={[[-0.14 + i * 0.14, 0.36, 0.9], [-0.14 + i * 0.14, 0.36, 0.3], [-0.14 + i * 0.14, 0.36, 0.05], [-0.14 + i * 0.14, 0.36, -0.3]]} n={12} k={1} r={0.012} v={0.5} col="#ef8a3a" />)}
  <group position={[lerp(0.9, 0.34, mv), 0.36, 0.26]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.05, 28]} /><meshStandardMaterial color="#b9b39f" roughness={0.6} /></mesh></group>
  {[0.78, -0.78].map((r) => <RBox key={r} s={[0.72, 0.05, 0.012]} p={[0, 0.36, 0.06]} rot={[0, 0, r]} r={0.004} shadow={false}><meshStandardMaterial color="#c8281e" roughness={0.45} transparent opacity={cl(nope)} /></RBox>)}
  <Tape txt="THE FURNACE BREATHES" col="#a33a1e" p={[0, 1.02, 0.1]} w={0.96} k={phys(tt, 3.2, 8, 0.45)} rev={cl(tt - 3.2)} />
</>; }}</Scene3D>;

// 26:44 · CORTÁ LA ALFOMBRA: una tijera le saca media pulgada y la puerta pasa
export const HRug: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="blinds" {...VOID} cam={{ at: [0, 0.1, 0.05], az: [-0.26, -0.1], el: [0.2, 0.25], r: [1.6, 1.5], fov: 30 }}>{(tt) => { const cut = eio(tt, 0.9, 2.3), sw = eio(tt, 3.0, 4.6) * 0.38, ry = lerp(0.09, 0.06, cut); return <>
  <RBox s={[2.2, 0.04, 1.2]} p={[0, -0.02, 0]} r={0.004}>{M.wood({ base: [146, 106, 66] })}</RBox>
  <RBox s={[1.8, ry, 1.0]} p={[0, ry / 2, 0.1]} r={0.012}><meshStandardMaterial color="#8a3b32" roughness={1} /></RBox>
  {Array.from({ length: 22 }, (_, i) => <RBox key={i} s={[0.05, 0.004, 0.9]} p={[-0.84 + i * 0.08, ry + 0.002, 0.1]} r={0.001} shadow={false}><meshStandardMaterial color={i % 2 ? "#a65a3a" : "#c3a06a"} roughness={1} /></RBox>)}
  <group position={[-0.8, 0, -0.42]} rotation={[0, sw, 0]}><RBox s={[1.2, 0.5, 0.04]} p={[0.6, 0.35, 0]} r={0.006}>{M.wood({ base: [132, 88, 48] })}</RBox><group position={[0.6, 0.1, 0.03]}><Sweep w={1.14} bend={0.08} /></group></group>
  <Tape txt="CUT THE RUG, NOT THE DOOR" col="#1f7a3a" p={[0.1, 0.6, 0.3]} rot={[-0.2, -0.2, 0]} w={1.12} k={phys(tt, 2.0, 8, 0.45)} rev={cl(tt - 2)} />
</>; }}</Scene3D>;

// 27:40 · UNA HOJA Y UNA LÍNEA DE LUZ: el cierre, con todo lo que se usó
export const HSheet: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" {...FOOT} cam={{ at: [0, 0.12, 0.26], az: [-0.3, -0.1], el: [0.24, 0.3], r: [1.3, 1.22], fov: 30 }}>{(tt) => { const p = phys(tt, 0.7, 8, 0.45); return <>
  <Leaf p={[0, 0.056, 0]} /><Saddle p={[0, 0, 0.02]} d={0.18} /><Frame />
  <group position={[0, 0, 0.012]}><Light a={0.012} b={0.012} y={0.05} /></group>
  <Paper p={[0.18, 0.058 + (1 - cl(p)) * 0.6, 0.4]} rot={[0, 0.3, 0]} />
  <Tape txt="ONE EVENING" col="#1c2a3a" p={[-0.24, 0.26, 0.42]} rot={[-0.5, 0.2, 0]} w={0.5} k={phys(tt, 2.8, 8, 0.45)} rev={cl(tt - 2.8)} />
</>; }}</Scene3D>;
