// rk29a · componentes rediseñados en 3D tras EVALUADOR r2 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
import React from "react";
import { H, Stage, Tag } from "./hkit";
import { Studio, Fob3, Car3, Rings3, Pouch3, Wall3, Thief3, Drawer3, Coin3, RB, sm, spr, c01, rnd } from "./studio3d";

type P = { t: number; h: H };
const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd3ff";

// 1 · la llave no grita: escucha. La pregunta del auto llega, la luz roja contesta, el auto se abre
export const H3Listen: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const ask = tt > 0.8 && tt < 2.9, ans = tt > 2.9 && tt < 4.6, open = tt > 4.6;
  const led = ans ? (Math.sin((tt - 2.9) * 14) > 0 ? 1 : 0.15) : 0, blink = open && tt < 6.2 ? (Math.sin((tt - 4.6) * 9) > 0 ? 1 : 0) : 0;
  return <>
    <Studio tt={tt} night={0.6} keys={[{ t: 0, p: [2.4, 0.55, 2.6], l: [0.7, 0.15, 0.6], fov: 30 }, { t: 3.2, p: [2.0, 1.5, 3.8], l: [-0.1, 0.35, -0.1], arc: 0.12 }, { t: 9, p: [0.5, 1.9, 4.4], l: [-0.6, 0.35, -0.4] }]}>
      <Car3 p={[-1.5, 0, -1.3]} rot={[0, 0.5, 0]} col="#8a929c" head={open ? sm(tt, 4.6, 5.0) : 0} blink={blink} inner={open ? sm(tt, 4.7, 5.3) : 0} />
      <Fob3 p={[0.9, 0, 0.8]} rot={[0, -0.5, 0]} s={1.7} led={led} />
      {ask && <Rings3 p={[-1.0, 0.5, -0.6]} k={(tt - 0.8) * 0.9} n={3} r={2.2} col={ICE} rot={[0, 0.9, 0]} />}
      {ans && <Rings3 p={[0.9, 0.2, 0.8]} k={(tt - 2.9) * 1.1} n={3} r={1.8} col={RED} rot={[0, 0.9, 0]} />}
    </Studio>
  </>;
}}</Stage>;

// 2 · el relevo visto desde arriba: uno junto al auto, otro contra la pared; la pregunta entra, el sí sale, el auto se va
export const H3Relay: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const a1 = tt > 1.2 && tt < 3.0, a2 = tt > 3.0 && tt < 4.6, go = sm(tt, 4.9, 7.2), led = a2 ? (Math.sin(tt * 14) > 0 ? 1 : 0.2) : 0;
  const pulse = c01((tt - 1.0) / 0.6) * (1 - c01((tt - 5.0) / 0.5));
  return <>
    <Studio tt={tt} floor="concrete" night={0.7} kl={[2, 7, 3]} keys={[{ t: 0, p: [1.0, 5.2, 4.6], l: [0.2, 0, 0], fov: 34 }, { t: 9, p: [-0.6, 4.4, 5.2], l: [0.0, 0, 0.2], arc: 0.06 }]}>
      <Wall3 p={[1.6, 0.6, -0.6]} s={[0.25, 1.2, 3.2]} kind="brick" />
      <RB p={[2.6, 0.45, -0.6]} s={[1.0, 0.9, 1.4]} c="#6b4a2e" r={0.7} />
      <Fob3 p={[2.5, 0.92, -0.6]} rot={[0, 1.2, 0]} s={1.3} led={led} />
      <Thief3 p={[1.1, 0, -0.4]} yaw={1.4} reach={0.7} s={0.95} />
      <Thief3 p={[-1.6, 0, 1.0]} yaw={-0.6} reach={0.5} s={0.95} />
      <Car3 p={[-2.2, 0, -0.4 - 6 * go]} rot={[0, 0, 0]} col="#2f5d3a" head={go > 0 ? 1 : 0} brake={tt > 4.6 && go < 0.1 ? 1 : 0} />
      {(() => { const path: [number, number, number][] = [[-2.2, 0.7, -0.2], [-1.6, 1.3, 1.0], [1.1, 1.3, -0.4], [2.5, 1.0, -0.6]]; const f = tt < 3.0 ? sm(tt, 1.0, 3.0) * 3 : tt < 4.6 ? 3 - sm(tt, 3.0, 4.6) * 3 : -1; if (f < 0) return null;
        const i = Math.min(2, Math.floor(f)), k = f - i, a = path[i], b = path[i + 1], q: [number, number, number] = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + 0.4 * Math.sin(Math.PI * k), a[2] + (b[2] - a[2]) * k];
        return <><mesh position={q}><sphereGeometry args={[0.09, 20, 20]} /><meshBasicMaterial color={tt < 3.0 ? "#8fd3ff" : RED} toneMapped={false} /></mesh><pointLight position={q} intensity={2.5 * pulse} distance={2.5} color={tt < 3.0 ? "#8fd3ff" : RED} /></>; })()}
      {a1 && <Rings3 p={[-1.9, 0.6, 0.2]} k={(tt - 1.2) * 1.0} n={3} r={1.4} col={ICE} />}
      {a2 && <Rings3 p={[2.3, 0.95, -0.6]} k={(tt - 3.0) * 1.1} n={3} r={1.3} col={RED} />}
    </Studio>
    <Tag tt={tt} at={1.4} x={520} y={150} txt="BY YOUR CAR" col={AMB} size={54} />
    <Tag tt={tt} at={2.2} x={1420} y={150} txt="BY YOUR WALL" col={AMB} size={54} />
  </>;
}}</Stage>;

// 3 · la casa en corte: arriba la bolsa con la llave dormida; abajo, en el gancho, la otra llave despierta a 18 pulgadas de la pared
export const H3Cutaway: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const build = spr(tt, 0.1, 6, 0.5), led = tt > 1.6 ? (Math.sin(tt * 12) > 0 ? 1 : 0.2) : 0, ruler = sm(tt, 2.6, 3.8);
  return <>
    <Studio tt={tt} night={0.4} keys={[{ t: 0, p: [0.3, 1.7, 6.6], l: [0.3, 1.35, 0], fov: 36 }, { t: 3.2, p: [0.9, 1.5, 5.4], l: [0.7, 1.15, 0], arc: 0.08 }, { t: 7, p: [1.3, 1.1, 4.2], l: [1.2, 0.95, 0] }]}>
      <group scale={[1, build, 1]}>
        <Wall3 p={[-1.6, 1.2, 0]} s={[0.18, 2.4, 1.6]} kind="drywall" />
        <Wall3 p={[2.2, 1.2, 0]} s={[0.22, 2.4, 1.6]} kind="brick" />
        <RB p={[0.3, 1.32, 0]} s={[3.9, 0.12, 1.6]} rad={0.01} c="#8a6a48" r={0.8} />
        <Wall3 p={[0.3, 2.45, -0.75]} s={[3.9, 2.3, 0.08]} kind="drywall" />
      </group>
      <Pouch3 p={[-0.2, 1.38, 0.2]} rot={[0, 0.3, 0]} s={1.2} open={0.25} />
      <Fob3 p={[-0.2, 1.62, 0.2]} rot={[0.5, 0.3, 0]} s={0.7} led={0} />
      <RB p={[1.9, 1.0, 0.2]} s={[0.5, 0.06, 0.08]} c="#3a2f25" r={0.6} />
      <Fob3 p={[1.85, 0.72, 0.28]} rot={[Math.PI / 2 - 0.15, 0, 0.1 * Math.sin(tt * 2)]} s={0.9} led={led} />
      <group position={[1.86, 0.5, 0.55]} scale={[0.01 + ruler, 1, 1]}><RB p={[0.12, 0, 0]} s={[0.24, 0.06, 0.2]} rad={0.008} c="#f2c230" r={0.4} />{[0, 1, 2, 3, 4, 5].map((i) => <RB key={i} p={[0.02 + i * 0.04, 0.032, 0.05]} s={[0.006, 0.006, i % 2 ? 0.05 : 0.09]} rad={0.002} c="#2b2416" />)}</group>
      {tt > 1.8 && <Rings3 p={[2.3, 0.75, 0.2]} k={tt * 0.8} n={3} r={1.6} col={AMB} rot={[0, Math.PI / 2, 0]} />}
    </Studio>
    <Tag tt={tt} at={1.0} x={560} y={170} txt="ASLEEP" col={ICE} size={50} />
    <Tag tt={tt} at={3.6} x={1000} y={640} txt="18 IN" col={RED} size={72} />
  </>;
}}</Stage>;

// 4 · gemelas: para el auto no hay diferencia entre la llave de la bolsa y la del gancho; las dos suben y calzan en una sola
export const H3Twins: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = sm(tt, 2.2, 3.6), meet = sm(tt, 4.0, 5.6), flash = c01(1 - Math.abs(tt - 5.7) / 0.35);
  const lx = -1.1 + 1.1 * meet, rx = 1.1 - 1.1 * meet, led = tt > 5.6 ? (Math.sin(tt * 10) > 0 ? 1 : 0.2) : 0;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0, 1.5, 4.2], l: [0, 0.45, 0], fov: 32 }, { t: 9, p: [0.3, 1.2, 3.0], l: [0, 0.75, 0], arc: 0.1 }]}>
      <Pouch3 p={[-1.1, 0, 0.1]} s={1.1} open={0.35 + 0.65 * sm(tt, 0.4, 1.4)} />
      <RB p={[1.1, 1.05, -0.62]} s={[0.8, 0.12, 0.08]} c="#5a3d24" r={0.7} />
      <mesh position={[1.1, 1.0, -0.55]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.12, 12]} /><meshStandardMaterial color="#2b2d33" metalness={0.8} roughness={0.3} /></mesh>
      <Fob3 p={[lx, 0.22 + 0.7 * up, 0.1]} rot={[0.6 * up, 0, 0]} s={1.15} led={led} />
      <Fob3 p={[rx, 0.55 + 0.37 * up, -0.48 + 0.58 * up]} rot={[Math.PI / 2 * (1 - up) + 0.6 * up, 0, 0.08 * Math.sin(tt * 2) * (1 - up)]} s={1.15} led={led} />
      <pointLight position={[0, 1.2, 0.6]} intensity={flash * 6} distance={3} color="#fff6dc" />
      {tt > 3.6 && Array.from({ length: 9 }, (_, i) => { const on = tt > 4.2 + i * 0.15; const hgt = 0.08 + 0.18 * ((i * 7) % 5) / 4; return <mesh key={i} position={[-0.4 + i * 0.1, 1.45, 0.1]}><boxGeometry args={[0.05, hgt, 0.02]} /><meshBasicMaterial color={on ? "#5ee08a" : "#e8e4dc"} toneMapped={false} /></mesh>; })}
    </Studio>
  </>;
}}</Stage>;

// 5 · el cajón de las pilas y las velitas: sale con peso, adentro las dos llaves de repuesto despiertas contra la pared de afuera
export const H3Drawer: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const op = spr(tt, 0.5, 6, 0.55) * 0.9, led = tt > 2.4 ? (Math.sin(tt * 11) > 0 ? 1 : 0.2) : 0;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.1, 2.5, 3.2], l: [0, 0.55, 0.5], fov: 32 }, { t: 10, p: [0.4, 2.6, 2.1], l: [0, 0.45, 0.75], arc: 0.06 }]}>
      <Wall3 p={[0, 1.2, -0.62]} s={[4, 2.4, 0.2]} kind="brick" />
      <Drawer3 open={op}>
        {[0, 1, 2, 3].map((i) => <mesh key={"b" + i} position={[-0.55 + i * 0.09, 0.05, 0.25]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.18, 20]} /><meshStandardMaterial color={i % 2 ? "#c8a24a" : "#2a2c31"} metalness={0.6} roughness={0.35} /></mesh>)}
        {[0, 1, 2, 3, 4].map((i) => <mesh key={"c" + i} position={[0.25 + i * 0.05, 0.02, 0.32 - (i % 2) * 0.05]} rotation={[Math.PI / 2, 0, 0.3]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.22, 10]} /><meshStandardMaterial color={["#e85a8a", "#5ab0e8", "#f2d24a", "#7ad06a", "#e88a3a"][i]} roughness={0.6} /></mesh>)}
        {[0, 1, 2].map((i) => <mesh key={"r" + i} position={[0.45 + rnd(i, 2) * 0.1, 0.01, -0.12 - i * 0.08]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.008, 8, 24]} /><meshStandardMaterial color="#b5653a" roughness={0.7} /></mesh>)}
        <Coin3 p={[-0.2, 0.01, 0.3]} d={0.12} />
        {Array.from({ length: 16 }, (_, i) => { const x = -0.62 + rnd(i, 5) * 1.24, z = -0.38 + rnd(i, 6) * 0.76, kind = i % 3, sh = 0.012 * Math.sin(tt * 18 + i) * Math.exp(-3 * Math.max(0, tt - 1.2)); if (Math.abs(x + 0.15) < 0.32 && Math.abs(z + 0.17) < 0.2) return null;
          return kind === 0 ? <mesh key={"x" + i} position={[x + sh, 0.04, z]} rotation={[0, rnd(i, 7) * 3, Math.PI / 2]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.18, 16]} /><meshStandardMaterial color={i % 2 ? "#c8a24a" : "#2a2c31"} metalness={0.6} roughness={0.35} /></mesh>
            : kind === 1 ? <mesh key={"x" + i} position={[x, 0.02, z + sh]} rotation={[Math.PI / 2, 0, rnd(i, 8) * 3]} castShadow><cylinderGeometry args={[0.013, 0.013, 0.24, 10]} /><meshStandardMaterial color={["#e85a8a", "#5ab0e8", "#f2d24a", "#7ad06a"][i % 4]} roughness={0.6} /></mesh>
            : <mesh key={"x" + i} position={[x, 0.012, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.055, 0.009, 8, 24]} /><meshStandardMaterial color={["#b5653a", "#d9b24a", "#5a7ab0"][i % 3]} roughness={0.7} /></mesh>; })}
        <Fob3 p={[-0.35, 0.0, -0.15]} rot={[0, 0.4, 0]} s={0.75} led={led} dim={0.75} />
        <Fob3 p={[0.05, 0.0, -0.2]} rot={[0, -0.3, 0]} s={0.75} led={led} dim={0.75} col="#24262b" />
      </Drawer3>
      {tt > 2.6 && <Rings3 p={[-0.15, 0.6, -0.4]} k={tt * 0.8} n={3} r={1.4} col={AMB} rot={[0, 0, 0]} />}
    </Studio>
    <Tag tt={tt} at={3.2} x={960} y={150} txt="OUTSIDE WALL" col={RED} size={60} />
  </>;
}}</Stage>;

export const HEROES_3: Record<string, React.FC<P>> = { listen: H3Listen, relay: H3Relay, cutaway: H3Cutaway, twins: H3Twins, drawer: H3Drawer };
void Coin3; void ICE;
