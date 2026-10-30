// lch29a · componentes únicos 16-22.
import React from "react";
import * as THREE from "three";
import { AMB, GRN, H, ICE, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Eraser, Motes, WallBB } from "./bb";

const PI = Math.PI;

// ---- 10:03 · LA GOMA BLANCA: frota la marca negra de taco con ida y vuelta; la marca se achica y caen las virutas ----
export const HEraser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-1.0, 1.3, 1.4]}
  cam={{ at: [0, 0.06, 0.02], az: [0.3, 0.05], el: [0.15, 0.2], r: [0.36, 0.3], fov: 30 }} over={(tt) => <Tag tt={tt} at={4.4} x={960} y={150} txt="GONE" col={GRN} size={52} />}>{(tt) => {
  const rub = eio(tt, 0.8, 4.6), st = tt > 0.8 && tt < 4.6, x = 0.02 * Math.sin(tt * 14) * (st ? 1 : 0), land = phys(tt, 0.2, 7, 0.45);
  return <>
    <WallBB L={0.6} dust={0} />
    {/* marca negra de goma de taco: trazo curvo que se borra */}
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.05 + i * 0.012, 0.06 + 0.012 * Math.sin(i * 0.6), 0.0102]} rotation={[0, 0, 0.4]} scale={Math.max(0.001, 1 - rub * (0.7 + 0.3 * rn(i, 2)))}><circleGeometry args={[0.009, 16]} /><meshStandardMaterial color="#141414" roughness={0.5} transparent opacity={0.9} /></mesh>)}
    <group position={[x, 0.065 + (1 - cl(land)) * 0.15, 0.022]} rotation={[PI / 2, 0, 0.3]}><Eraser wear={rub} /></group>
    {/* virutas que caen al piso y ruedan */}
    {Array.from({ length: 14 }, (_, i) => { const a = 1.0 + i * 0.25, k = cl((tt - a) / 0.6); return tt > a && <mesh key={i} position={[-0.04 + rn(i, 3) * 0.08 + 0.03 * cl(tt - a - 0.6), lerp(0.05, 0.004, k * k), 0.025 + 0.02 * rn(i, 4)]} rotation={[0, 0, rn(i, 5) * 3 + tt * 2]}><capsuleGeometry args={[0.002, 0.007, 4, 6]} /><meshStandardMaterial color="#8d8a84" roughness={0.9} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 10:36 · LA MANCHA BRILLANTE: frotar fuerte deja un parche de brillo en la pintura mate (luz rasante que lo delata) ----
export const HShinySpot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-1.8, 0.5, 0.6]}
  cam={{ at: [0, 0.06, 0], az: [-0.3, -0.75], el: [0.1, 0.12], r: [0.42, 0.36], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.6} x={960} y={160} txt="SHINY SPOT FOREVER" col={RED} size={44} />}>{(tt) => {
  const scrub = eio(tt, 0.4, 2.6), sweep = cl((tt - 2.8) / 2.6);
  return <>
    <WallBB L={0.8} dust={0} gloss={0} />
    {/* el parche pulido: más brillante y con barniz, crece mientras se frota */}
    <mesh position={[0, 0.06, 0.0101]} scale={[Math.max(0.001, scrub), Math.max(0.001, scrub), 1]}><circleGeometry args={[0.04, 32]} /><meshPhysicalMaterial color="#ffffff" roughness={0.02} clearcoat={1} clearcoatRoughness={0} envMapIntensity={2} /></mesh>
    <mesh position={[0, 0.06, 0.01015]} scale={[Math.max(0.001, scrub), Math.max(0.001, scrub), 1]}><ringGeometry args={[0.038, 0.041, 40]} /><meshStandardMaterial color="#d9d3c6" roughness={0.3} /></mesh>
    {/* un dedo con trapo frotando en círculos */}
    {tt < 2.8 && <group position={[0.025 * Math.cos(tt * 12), 0.06 + 0.02 * Math.sin(tt * 12), 0.03]} rotation={[0, 0, 0.3]}><RBox s={[0.06, 0.045, 0.03]} r={0.012}><meshStandardMaterial color="#6f8fb0" roughness={1} /></RBox></group>}
    {/* la luz rasante barre de izquierda a derecha y el parche brilla al pasar */}
    
    {sweep > 0 && Math.abs(lerp(-0.12, 0.12, sweep)) < 0.045 && <mesh position={[lerp(-0.12, 0.12, sweep), 0.06, 0.0106]}><planeGeometry args={[0.018, 0.075]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * (1 - Math.abs(lerp(-0.12, 0.12, sweep)) / 0.045)} depthWrite={false} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 11:14 · TRES SEGUNDOS: el bolsillo del delantal de Doris; sale la goma rosa, borra y vuelve; tres golpes de reloj ----
const apronTex = () => tex.text("apronflor", 256, 256, (g) => { g.fillStyle = "#f3e7d3"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 70; i++) { const x = rn(i, 2) * 256, y = rn(i, 3) * 256; g.fillStyle = ["#d98aa0", "#9cc48a", "#e9c86a", "#8fb0d8"][i % 4]; g.beginPath(); g.arc(x, y, 6 + rn(i, 4) * 6, 0, 7); g.fill(); } });
export const HDorisPocket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0.0, 0.12, 0.05], az: [-0.25, 0.15], el: [0.16, 0.2], r: [0.68, 0.58], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.8} x={1400} y={260} txt="3 SECONDS" col={AMB} size={48} />}>{(tt) => {
  const out = eio(tt, 0.4, 1.0), go = eio(tt, 1.0, 1.4), back = eio(tt, 3.6, 4.4), rubbing = tt > 1.4 && tt < 3.4;
  const ex = lerp(lerp(-0.15, 0.08, go), -0.15, back), ey = lerp(lerp(0.2, 0.06, go), 0.2, back), mark = 1 - eio(tt, 1.4, 3.4);
  return <>
    <WallBB L={0.7} dust={0} />
    {/* delantal floreado (tela curva) con su bolsillo, colgado a la izquierda */}
    <mesh position={[-0.2, 0.24, 0.12]} rotation={[0, 0.9, 0]}><cylinderGeometry args={[0.22, 0.22, 0.3, 32, 1, true, -0.5, 1.0]} /><meshStandardMaterial map={apronTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <mesh position={[-0.2, 0.19, 0.12]} rotation={[0, 0.9, 0]}><cylinderGeometry args={[0.226, 0.226, 0.09, 32, 1, true, -0.25, 0.5]} /><meshStandardMaterial map={apronTex()} color="#efd9bf" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.09, 0.058, 0.0102]} rotation={[0, 0, 0.25]} scale={[Math.max(0.001, mark), 1, 1]}><planeGeometry args={[0.09, 0.012]} /><meshStandardMaterial color="#151515" roughness={0.6} /></mesh>
    <group position={[ex + (rubbing ? 0.015 * Math.sin(tt * 16) : 0), ey + 0.06 * (1 - out) * (1 - go), 0.03]} rotation={[PI / 2, 0, 0.3]} scale={1.7}><Eraser col="#ef9fb4" wear={0.3 * (1 - mark)} /></group>
    {/* tres pulsos ámbar: un segundo cada uno */}
    {[0, 1, 2].map((i) => { const k = cl((tt - 1.4 - i) / 1); return k > 0 && <mesh key={i} position={[0.3, 0.2 - i * 0.05, 0.05]}><sphereGeometry args={[0.012 * (1 + 0.6 * Math.exp(-k * 5)), 14, 10]} />{M.glow({ col: AMB, op: 0.95 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 11:30 · EL ESTANTE: el polvo del aire baja flotando en zigzag y se posa justo en el labio de arriba ----
export const HLedge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-0.6, 1.8, 0.9]}
  cam={{ at: [0.02, 0.15, 0.02], az: [0.45, 0.2], el: [0.3, 0.24], r: [0.5, 0.42], fov: 30 }} over={(tt) => <Tag tt={tt} at={4.4} x={960} y={140} txt="IT'S A LEDGE" col={AMB} size={46} />}>{(tt) => {
  const land = eio(tt, 1.0, 5.5);
  return <>
    <WallBB L={0.7} top={land} dust={0} line={0.2} wall="#b9ab92" />
    <pointLight position={[-0.2, 0.4, 0.15]} intensity={0.5} distance={0.8} color="#ffe2b0" />
    {/* haz de sol que hace ver las motas */}
    <mesh position={[0, 0.3, 0.06]} rotation={[0, 0, -0.5]}><planeGeometry args={[0.18, 0.7]} /><meshBasicMaterial color="#fff1d0" transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <Motes n={90} r={0.0046} col="#7f786c" pos={(i) => { const t0 = rn(i, 2) * 4, k = cl((tt - t0) / 2.4), x = -0.3 + rn(i, 3) * 0.6; return [x + 0.02 * Math.sin(tt * 1.5 + i), lerp(0.42, 0.126, k), lerp(0.02 + 0.08 * rn(i, 4), 0.004, k)]; }} op={(i) => (tt > rn(i, 2) * 4 ? 0.85 : 0)} />
  </>;
}}</Scene3D>;

// ---- 11:44 · LA VISTA DESDE EL SOFÁ: dos ojos (parado y sentado) y sus rayos; el de sentado cae justo en el estante gris ----
export const HEyeLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [0.6, 0.85, 0], az: [-0.12, 0.1], el: [0.1, 0.12], r: [3.6, 3.3], fov: 32 }} over={(tt) => <><Tag tt={tt} at={1.4} x={1180} y={180} txt="STANDING" col={ICE} size={34} /><Tag tt={tt} at={3.0} x={1180} y={560} txt="SITTING" col={AMB} size={34} /></>}>{(tt) => {
  const r1 = eio(tt, 0.6, 1.6), r2 = eio(tt, 2.2, 3.4), flash = cl((tt - 3.4) * 2) * (0.6 + 0.4 * Math.sin(tt * 6));
  const Eye: React.FC<{ y: number; x: number }> = ({ x, y }) => <group position={[x, y, 0.05]}><mesh><sphereGeometry args={[0.11, 24, 16]} /><meshStandardMaterial color="#e6c9ae" roughness={0.7} /></mesh><mesh position={[-0.095, 0.01, 0.03]}><sphereGeometry args={[0.02, 14, 10]} /><meshStandardMaterial color="#222" /></mesh><mesh position={[0.02, 0.06, 0]} scale={[1.05, 0.6, 1.05]}><sphereGeometry args={[0.11, 20, 12]} /><meshStandardMaterial color="#e9e6e0" roughness={0.9} /></mesh></group>;
  const body = <meshStandardMaterial color="#5c7fa8" roughness={0.8} />;
  const Ray: React.FC<{ y: number; x: number; k: number; col: string }> = ({ x, y, k, col }) => { const dx = -x, dy = 0.12 - y, L = Math.hypot(dx, dy) * k, a = Math.atan2(dy, dx); return <mesh position={[x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2, 0.05]} rotation={[0, 0, a + PI / 2]}><cylinderGeometry args={[0.006, 0.006, Math.max(0.001, L), 8]} />{M.glow({ col, op: 0.85 })}</mesh>; };
  return <>
    <group rotation={[0, PI / 2, 0]} position={[0, 0, 0]}><WallBB L={0.8} top={1} line={0.3} /></group>
    {/* sofá: bloque floreado, y la silueta de la señora sentada como dos ojos */}
    <RBox s={[0.5, 0.42, 0.7]} p={[1.25, 0.21, 0]} r={0.05}><meshStandardMaterial color="#b8796a" roughness={0.9} /></RBox>
    {/* parada (atrás) y sentada en el sofá (adelante) */}
    <group position={[1.15, 0, -0.35]}><mesh position={[0, 0.7, 0]} castShadow><capsuleGeometry args={[0.13, 0.9, 10, 20]} />{body}</mesh></group>
    <mesh position={[1.22, 0.6, 0.05]} castShadow><capsuleGeometry args={[0.13, 0.28, 10, 20]} />{body}</mesh>
    <mesh position={[1.05, 0.48, 0.05]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.1, 0.25, 10, 20]} />{body}</mesh>
    <Eye x={1.2} y={0.88} /><Eye x={1.15} y={1.55} />
    <Ray x={1.15} y={1.55} k={r1} col={ICE} /><Ray x={1.2} y={0.85} k={r2} col={AMB} />
    <mesh position={[0.01, 0.125, 0.05]}><sphereGeometry args={[0.03 * flash + 0.001, 14, 10]} />{M.glow({ col: RED, op: 0.6 * flash })}</mesh>
  </>;
}}</Scene3D>;

// ---- 12:52 · HINCHADO: corte del zócalo de fibra; el agua sube por abajo, la placa se hincha y la pintura se ampolla ----
export const HSwell: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-1.2, 1.0, 1.4]}
  cam={{ at: [0, 0.06, 0], az: [1.2, 1.0], el: [0.12, 0.18], r: [0.38, 0.32], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.4} x={960} y={150} txt="SOFT & BUBBLY" col={RED} size={46} />}>{(tt) => {
  const wet = eio(tt, 0.6, 2.0), sw = eio(tt, 1.8, 4.6);
  return <>
    {/* placa de fibra (MDF marrón claro) pintada de blanco: la parte de abajo engorda */}
    <mesh position={[0, 0.06, 0]} castShadow><boxGeometry args={[0.5, 0.12, 0.018]} /><meshStandardMaterial color="#f2efe8" roughness={0.6} /></mesh>
    <mesh position={[0, 0.015 * (1 + 0.6 * sw), 0.004 * sw]} scale={[1, 1 + 0.9 * sw, 1 + 1.6 * sw]} castShadow><boxGeometry args={[0.5, 0.03, 0.019]} /><meshStandardMaterial map={tex.paper(3, 1)} color="#c9a274" roughness={1} /></mesh>
    {/* charco que se mete en la ranura */}
    <mesh position={[0, 0.0015, 0.05]} rotation={[-PI / 2, 0, 0]} scale={[1, Math.max(0.001, wet), 1]}><circleGeometry args={[0.2, 40]} />{M.water({ op: 0.5 })}</mesh>
    {/* ampollas en la pintura */}
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.2 + i * 0.045, 0.03 + 0.01 * rn(i, 2), 0.012 + 0.012 * sw]} scale={[1, 1, 0.5]}><sphereGeometry args={[0.008 * cl(sw * 1.5 - rn(i, 3) * 0.5) + 0.0005, 12, 8, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#f6f3ec" roughness={0.5} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 13:24 · NUNCA MEZCLAR: lavandina al centro; amoníaco y vinagre se acercan y una cruz roja los frena (tabla never-mix) ----
const lab = (k: string, bg: string, fg: string, t1: string) => tex.text("lab" + k, 256, 256, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.fillStyle = fg; g.font = "900 44px Arial"; g.textAlign = "center"; g.fillText(t1, 128, 140); });
const Bottle: React.FC<{ k: string; bg: string; fg: string; t1: string; col: string }> = ({ k, bg, fg, t1, col }) => <group>
  <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.05, 0.055, 0.2, 32]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.6} /></mesh>
  <mesh position={[0, 0.1, 0.0]}><cylinderGeometry args={[0.0555, 0.0555, 0.09, 32, 1, true, -0.9, 1.8]} /><meshStandardMaterial map={lab(k, bg, fg, t1)} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.215, 0]}><cylinderGeometry args={[0.022, 0.03, 0.03, 20]} /><meshStandardMaterial color="#d33" roughness={0.4} /></mesh>
</group>;
export const HNeverMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.1], el: [0.2, 0.16], r: [1.2, 1.05], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.2} x={960} y={150} txt="NEVER MIX" col={RED} size={56} />}>{(tt) => {
  const ap = eio(tt, 0.6, 1.6), gas1 = cl((tt - 1.5) / 0.9) * (1 - eio(tt, 2.6, 3.4)), back1 = eio(tt, 2.2, 2.9);
  const ap2 = eio(tt, 3.0, 3.9), gas2 = cl((tt - 3.8) / 0.9) * (1 - eio(tt, 4.9, 5.6)), back2 = eio(tt, 4.5, 5.2);
  const Gas: React.FC<{ x: number; k: number; col: string }> = ({ x, k, col }) => <>{k > 0.01 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[x + (rn(i, 2) - 0.5) * 0.12 * k, 0.12 + 0.18 * k * rn(i, 3) + 0.02 * Math.sin(tt * 2 + i), (rn(i, 4) - 0.5) * 0.08]} scale={(0.025 + 0.04 * rn(i, 5)) * (0.4 + k)}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={col} transparent opacity={0.45 * k} roughness={1} depthWrite={false} /></mesh>)}</>;
  return <>
    <group><Bottle k="bl" bg="#ffffff" fg="#1d4f8f" t1="BLEACH" col="#f5f5f0" /></group>
    <group position={[lerp(-0.42, -0.17, ap) - 0.22 * back1, 0, 0]} rotation={[0, 0, 0.15 * back1]}><Bottle k="am" bg="#ffe36a" fg="#222" t1="AMMONIA" col="#ffe9a0" /></group>
    <group position={[lerp(0.42, 0.17, ap2) + 0.22 * back2, 0, 0]} rotation={[0, 0, -0.15 * back2]}><Bottle k="vi" bg="#f4f1e8" fg="#7a2c1d" t1="VINEGAR" col="#efe6c8" /></group>
    <Gas x={-0.09} k={gas1} col="#b7d44a" /><Gas x={0.09} k={gas2} col="#cfe07a" />
  </>;
}}</Scene3D>;
