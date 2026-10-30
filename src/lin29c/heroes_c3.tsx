// lin29c · componentes 23-32 (aeropuertos)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn, cl, tubeG } from "./h3d";
import { Coin, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone, Plane, Suitcase } from "./lkit_b";
import { Car } from "./heroes_c1";

// ---- 14:50 · LA BALANZA DE MANO: la valija cuelga del gancho; sale un libro y el visor baja de 54 a 49 ----
export const HLuggageScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.24, 0], az: [-0.2, 0.12], el: [0.08, 0.08], r: [0.92, 0.84], fov: 30 }}>{(tt) => {
  const lift = eio(tt, 0.3, 1.0), out = eio(tt, 1.8, 2.6), v = Math.round(lerp(lerp(0, 54, eio(tt, 0.9, 1.6)), 49, out));
  const bob = 0.01 * Math.sin(tt * 5) * (1 - eio(tt, 1.0, 2.0));
  return <>
    <group position={[0, 0.4, 0.04]} scale={pop(tt, 0.1) * 2.6}>
      <RBox s={[0.1, 0.05, 0.03]} r={0.012}>{M.plastic({ col: "#e9b62a" })}</RBox>
      <RBox s={[0.06, 0.026, 0.004]} p={[0, 0.0, 0.016]} r={0.003}>{M.plastic({ col: "#9fbf9a" })}</RBox>
      {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? v / 10 : v % 10} p={[-0.011 + d * 0.022, 0, 0.019]} r={0.011} w={0.018} />)}
      <mesh position={[0, -0.045, 0]}><torusGeometry args={[0.012, 0.003, 8, 20, PI * 1.4]} />{M.chrome()}</mesh>
      <mesh position={[0, -0.075, 0]}><boxGeometry args={[0.015, 0.05, 0.002]} /><meshStandardMaterial color="#1b1b1b" /></mesh>
    </group>
    <group position={[0, lerp(0.0, 0.06, lift) + bob, 0]} scale={pop(tt, 0.1)}>
      <Suitcase col="#7a1426" s={1.0} lid={eio(tt, 1.5, 1.8) * (1 - eio(tt, 2.6, 2.9)) * 0.9} />
    </group>
    <group position={[lerp(0.0, 0.2, out), lerp(0.2, 0.06, out) + 0.12 * Math.sin(PI * out), 0.1]} rotation={[0, 0, -out * 1.4]} scale={2.2 * Math.max(0.001, eio(tt, 1.6, 1.8))}>
      <RBox s={[0.08, 0.1, 0.025]} r={0.004}><meshStandardMaterial color="#2f5d4a" roughness={0.8} /></RBox>
      <RBox s={[0.074, 0.094, 0.026]} p={[0.004, 0, 0]} r={0.002}><meshStandardMaterial color="#f4efe3" roughness={0.9} /></RBox>
    </group>
    <group position={[-0.2, 0.26, 0.08]} scale={pop(tt, 2.9) * 1.6}><PriceTag lines={["50 LB MAX", "✓ 49"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 15:23 · EL GATO EN LA BALANZA: el gato de arcilla se sube, la aguja gira y se acomoda tranquilo ----
export const HCatScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0, 0.07, 0.02], az: [-0.3, 0.1], el: [0.5, 0.45], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const hop = eio(tt, 0.6, 1.3), needle = phys(tt, 1.3, 6, 0.3), tail = Math.sin(tt * 2.2) * 0.4;
  const fur = "#e88a3a";
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.22, 0.03, 0.2]} p={[0, 0.015, 0]} r={0.014}>{M.porcelain()}</RBox>
      <mesh position={[0, 0.031, 0.07]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03, 32]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
      <mesh position={[0, 0.032, 0.07]} rotation={[-PI / 2, 0, -needle * 2.4]}><planeGeometry args={[0.005, 0.055]} /><meshBasicMaterial color="#d9342a" /></mesh>
    </group>
    <group position={[lerp(-0.25, 0, hop), 0.03 * hop + 0.1 * Math.sin(PI * hop), lerp(0.02, -0.01, hop)]} rotation={[0, lerp(1.2, 0.3, hop), 0]}>
      <mesh position={[0, 0.055, 0]} scale={[1.2, 0.8, 0.85]}><sphereGeometry args={[0.055, 32, 24]} /><meshStandardMaterial color={fur} roughness={0.85} /></mesh>
      <mesh position={[0.05, 0.11, 0]}><sphereGeometry args={[0.038, 32, 24]} /><meshStandardMaterial color={fur} roughness={0.85} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0.05, 0.145, s * 0.02]} rotation={[0, 0, 0]}><coneGeometry args={[0.012, 0.025, 4]} /><meshStandardMaterial color={fur} roughness={0.85} /></mesh>)}
      {[-1, 1].map((s) => <mesh key={"e" + s} position={[0.083, 0.118, s * 0.013]}><sphereGeometry args={[0.005, 10, 8]} /><meshBasicMaterial color="#1b1b1b" /></mesh>)}
      <mesh geometry={tubeG("cattail" + Math.round(tail * 10), [[-0.06, 0.05, 0], [-0.1, 0.08, 0.02 * tail], [-0.11, 0.13, 0.05 * tail]], 0.01, 40)}><meshStandardMaterial color={fur} roughness={0.85} /></mesh>
    </group>
    
  </>;
}}</Scene3D>;

// ---- 15:59 · LA BANDEJA DEL CONTROL: el bastón y los zapatos pasan bajo el arco y la luz se pone verde ----
export const HTsaTray: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.6, -0.4], el: [0.22, 0.2], r: [0.85, 0.76], fov: 30 }}>{(tt) => {
  const x = lerp(-0.32, 0.26, eio(tt, 0.5, 3.6)), ok = x > 0.04;
  return <>
    <RBox s={[0.8, 0.05, 0.16]} p={[0, 0.025, 0]} r={0.006}>{M.plastic({ col: "#3a3d42" })}</RBox>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-0.38 + i * 0.05, 0.052, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.15, 10]} />{M.steel()}</mesh>)}
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.16, 0.2, 0.2]} p={[0, 0.15, 0]} r={0.02}>{M.pvc({ col: "#d0d4da" })}</RBox>
      <mesh position={[0, 0.13, 0]}><boxGeometry args={[0.17, 0.08, 0.17]} /><meshStandardMaterial color="#141414" /></mesh>
      {[-0.06, 0.06].map((z) => <mesh key={z} position={[-0.081, 0.13, z * 0.0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.15, 0.075]} /><meshStandardMaterial color="#222" transparent opacity={0.5} side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0, 0.26, 0.101]}><circleGeometry args={[0.014, 20]} /><meshBasicMaterial color={ok ? "#3fd27a" : "#5a5e66"} toneMapped={false} /></mesh>
    </group>
    <group position={[x, 0.06, 0]}>
      <RBox s={[0.22, 0.03, 0.13]} p={[0, 0.015, 0]} r={0.01}>{M.plastic({ col: "#8a929c" })}</RBox>
      <mesh position={[0.0, 0.04, 0.03]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.2, 12]} />{M.wood({ base: [110, 70, 40] })}</mesh>
      <mesh position={[0.1, 0.04, 0.03]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.006, 8, 20, PI]} />{M.wood({ base: [110, 70, 40] })}</mesh>
      {[-0.05, -0.0].map((z, i) => <RBox key={i} s={[0.07, 0.025, 0.03]} p={[-0.05 + i * 0.0, 0.045, -0.035 + i * 0.035]} r={0.01}><meshStandardMaterial color="#5a3420" roughness={0.5} /></RBox>)}
    </group>
    <group position={[0.2, 0.24, 0.1]} scale={pop(tt, 2.6) * 1.2}><PriceTag lines={["CANE", "✓ OK"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

let _heart: THREE.ExtrudeGeometry | null = null;
const heartG = () => { if (_heart) return _heart; const s = new THREE.Shape(); s.moveTo(0, -0.04); s.bezierCurveTo(-0.06, 0.0, -0.04, 0.05, 0, 0.025); s.bezierCurveTo(0.04, 0.05, 0.06, 0.0, 0, -0.04);
  return (_heart = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 4 })); };

// ---- 16:46 · HICE UNA AMIGA: el tubo del teléfono descansa y de él sale un corazón que late ----
export const HMadeFriend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.15, 0.12], el: [0.22, 0.2], r: [0.72, 0.65], fov: 30 }}>{(tt) => {
  const up = eio(tt, 1.0, 2.0), beat = 1 + 0.08 * Math.max(0, Math.sin(tt * 7)) * up;
  const heart = heartG();
  return <>
    <group position={[0, 0, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.22, 0.05, 0.14]} p={[0, 0.025, 0]} r={0.02}>{M.pvc({ col: "#b8302a" })}</RBox>
      {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.024, 0.008, 0.02]} p={[-0.03 + (i % 3) * 0.032, 0.052, -0.035 + Math.floor(i / 3) * 0.03]} r={0.004}>{M.plastic({ col: "#f2f2ee" })}</RBox>)}
      <group position={[0.0, 0.08, 0.045]} rotation={[0, 0, 0]}>
        <mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.014, 0.16, 8, 16]} />{M.pvc({ col: "#b8302a" })}</mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.09, -0.01, 0]}><sphereGeometry args={[0.025, 20, 14]} />{M.pvc({ col: "#b8302a" })}</mesh>)}
      </group>
    </group>
    <mesh geometry={heart} position={[0, 0.12 + 0.08 * up, 0.04]} rotation={[PI, 0, 0]} scale={Math.max(0.001, up) * 1.4 * beat}><meshPhysicalMaterial color="#ff4a5a" roughness={0.3} clearcoat={0.8} emissive="#ff6a3a" emissiveIntensity={0.06 + 0.08 * Math.max(0, Math.sin(tt * 7))} /></mesh>
    <pointLight position={[0, 0.2, 0.12]} intensity={0.35 * up} distance={0.5} color="#ffb070" />
    <mesh geometry={tubeG("mfcord", Array.from({ length: 60 }, (_, i) => { const u = i / 59, a = u * 18 * PI; return [-0.11 - 0.012 * Math.cos(a) - u * 0.04, 0.05 - u * 0.04 + 0.012 * Math.sin(a), 0.045 - u * 0.06]; }), 0.003, 300, 6)}>{M.pvc({ col: "#b8302a" })}</mesh>
    <group position={[0.18, 0.17, 0.06]} scale={pop(tt, 2.6) * 1.4}><PriceTag lines={["A NEW", "FRIEND"]} col="#fbf8f0" fg="#b8302a" /></group>
  </>;
}}</Scene3D>;

// ---- 17:34 · DOS RELOJES: llegar 2 horas antes en vuelos de cabotaje, 3 en internacionales; las agujas corren ----
export const HTwoClocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.1], el: [0.06, 0.06], r: [0.78, 0.7], fov: 30 }}>{(tt) => {
  const C = [{ x: -0.15, hrs: 2, col: "#2f6f9a", l: ["DOMESTIC", "2 HRS"] }, { x: 0.15, hrs: 3, col: "#b8302a", l: ["INTL", "3 HRS"] }];
  return <>
    {C.map((c, j) => { const k = eio(tt, 0.6 + j * 0.4, 2.8 + j * 0.4); const sweep = k * c.hrs / 12 * 2 * PI;
      return <group key={j} position={[c.x, 0.17, 0]} scale={pop(tt, 0.1 + j * 0.3)}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.02, 64]} />{M.chrome()}</mesh>
        <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.1, 64]} />{M.porcelain()}</mesh>
        <mesh position={[0, 0, 0.012]}><circleGeometry args={[0.095, 64, PI / 2 - sweep, Math.max(0.001, sweep)]} /><meshBasicMaterial color={c.col} transparent opacity={0.35} /></mesh>
        {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * 2 * PI; return <mesh key={i} position={[0.085 * Math.sin(a), 0.085 * Math.cos(a), 0.013]}><boxGeometry args={[0.004, 0.012, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh>; })}
        <group rotation={[0, 0, -sweep]}><mesh position={[0, 0.035, 0.016]}><boxGeometry args={[0.008, 0.07, 0.003]} /><meshBasicMaterial color="#1b1b1b" /></mesh></group>
        <group rotation={[0, 0, -sweep * 12]}><mesh position={[0, 0.042, 0.018]}><boxGeometry args={[0.004, 0.085, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh></group>
        <mesh position={[0, 0, 0.02]}><sphereGeometry args={[0.008, 12, 10]} />{M.brass()}</mesh>
        <group position={[0, -0.16, 0.03]} scale={pop(tt, 1.4 + j * 0.4) * 1.4}><PriceTag lines={c.l} col={c.col} fg="#ffffff" /></group>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 18:36 · LA COLUMNA C7: el auto se estaciona junto a la columna; el flash de la foto la deja guardada ----
export const HParkingPillar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.35, -0.15], el: [0.12, 0.1], r: [0.78, 0.7], fov: 30 }}>{(tt) => {
  const park = eio(tt, 0.3, 1.6), flash = Math.max(0, 1 - Math.abs(tt - 2.4) * 6);
  const scr = txt("pilphoto" + (tt > 2.4 ? 1 : 0), tt > 2.4 ? ["C7", "✓"] : ["", ""], { w: 256, h: 512, bg: tt > 2.4 ? "#e9b62a" : "#1b2430", fg: "#1b1b1b", size: 110, lh: 150 });
  return <>
    <group position={[0, 0, -0.06]} scale={pop(tt, 0.1)}>
      <RBox s={[0.12, 0.42, 0.12]} p={[0, 0.21, 0]} r={0.006}><meshStandardMaterial color="#a8a8a2" roughness={0.95} /></RBox>
      <RBox s={[0.122, 0.12, 0.122]} p={[0, 0.22, 0]} r={0.004}>{M.matte({ col: "#e9b62a" })}</RBox>
      <Sheet map={txt("c7big", ["C7"], { w: 256, h: 256, bg: "#e9b62a", fg: "#1b1b1b", size: 190 })} w={0.1} h={0.1} p={[0, 0.22, 0.062]} />
    </group>
    <Car p={[lerp(-0.45, -0.13, park), 0, 0.06]} col="#7a8088" s={1.3} />
    <Phone map={scr} p={[0.18, 0.16, 0.12]} r={[0, -0.5, 0]} s={0.9 * pop(tt, 1.6)} em={0.9} />
    <pointLight position={[0.15, 0.2, 0.2]} intensity={6 * flash} distance={1.2} color="#ffffff" />
    <mesh position={[0.17, 0.2, 0.13]} scale={0.001 + flash}><sphereGeometry args={[0.03, 16, 12]} />{M.glow({ col: "#ffffff", op: 0.9 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 19:12 · LA RUTINA EN UN TABLERO: la ficha salta de casilla: casa → auto → control → puerta ----
export const HRoutinePath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.03, 0], az: [-0.2, 0.15], el: [0.75, 0.68], r: [0.82, 0.74], fov: 30 }}>{(tt) => {
  const P = [[-0.24, 0.06], [-0.08, -0.06], [0.08, 0.06], [0.24, -0.06]], L = ["HOME", "CAR", "SECURITY", "GATE"], C = ["#3f8f5a", "#2f6f9a", "#e8a33a", "#b8302a"];
  const f = cl((tt - 0.8) / 0.9), i0 = Math.min(3, Math.floor(f * 0 + Math.min(3, (tt - 0.8) / 0.9))), seg = Math.max(0, Math.min(3, (tt - 0.8) / 0.9));
  const a = Math.min(2, Math.floor(seg)), k = eio(seg - a, 0, 1), on = seg >= 3 ? 3 : a + (k > 0.98 ? 1 : 0);
  const from = P[a], to = P[a + 1];
  const tx = seg >= 3 ? P[3][0] : lerp(from[0], to[0], k), tz = seg >= 3 ? P[3][1] : lerp(from[1], to[1], k), ty = seg >= 3 ? 0 : 0.08 * Math.sin(PI * k);
  return <>
    <mesh geometry={tubeG("rpath", P.map(([x, z]) => [x, 0.004, z]), 0.008, 60, 8)}>{M.matte({ col: "#d8c9a8" })}</mesh>
    {P.map(([x, z], i) => <group key={i} position={[x, 0, z]} scale={pop(tt, 0.1 + i * 0.15)}>
      <mesh position={[0, 0.008, 0]}><cylinderGeometry args={[0.05, 0.05, 0.016, 40]} /><meshStandardMaterial color={C[i]} roughness={0.5} emissive={C[i]} emissiveIntensity={on >= i ? 0.35 : 0} /></mesh>
      <Sheet map={txt("rp" + L[i], [L[i]], { w: 256, h: 64, bg: "#fbf8f0", fg: C[i], size: 44 })} w={0.1} h={0.025} p={[0, 0.017, 0.075]} r={[-PI / 2, 0, 0]} />
    </group>)}
    <group position={[tx, 0.016 + ty, tz]} scale={pop(tt, 0.5) * (1 + 0.15 * (1 - phys(tt, 0.8 + (a + 1) * 0.9, 8, 0.3)))}>
      <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.02, 0.05, 24]} />{M.brass()}</mesh>
      <mesh position={[0, 0.062, 0]}><sphereGeometry args={[0.014, 20, 14]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 20:00 · EL TERMO DE CASA: el termo se inclina y llena dos tacitas; el vapor sube ----
export const HThermos: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.12], el: [0.16, 0.14], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const tilt = eio(tt, 0.6, 1.2) * (1 - eio(tt, 3.4, 4.0)), tgt = tt < 2.3 ? 0 : 1;
  const f0 = eio(tt, 1.0, 2.2), f1 = eio(tt, 2.5, 3.5);
  const cx = [-0.03, 0.09];
  return <>
    <group position={[lerp(-0.14, lerp(cx[0], cx[1], eio(tt, 2.2, 2.5)) - 0.1, eio(tt, 0.3, 0.6)), lerp(0.1, 0.2, eio(tt, 0.3, 0.6)), 0]} rotation={[0, 0, -tilt * 1.85]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.2, 40]} />{M.steel()}</mesh>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.0355, 0.0355, 0.06, 40]} />{M.rubber({ col: "#2f5d4a" })}</mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.02, 0.03, 0.025, 40]} />{M.plastic({ col: "#1b1d22" })}</mesh>
    </group>
    {tilt > 0.9 && <mesh position={[cx[tgt], 0.1, 0.02]}><cylinderGeometry args={[0.004, 0.004, 0.1, 8]} /><meshPhysicalMaterial color="#5a341c" roughness={0.1} transparent opacity={0.85} /></mesh>}
    {cx.map((x, i) => { const f = i ? f1 : f0; return <group key={i} position={[x, 0, 0.02]} scale={pop(tt, 0.3 + i * 0.2)}>
      <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.03, 0.024, 0.05, 32, 1, true]} /><meshPhysicalMaterial color="#fbfaf7" roughness={0.15} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.024, 0.024, 0.002, 32]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.002 + 0.04 * f, 0]}><cylinderGeometry args={[0.024 + 0.006 * f, 0.024, Math.max(0.001, 0.04 * f) * 0.1, 32]} /><meshStandardMaterial color="#5a341c" roughness={0.2} /></mesh>
      <mesh position={[0.036, 0.028, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.004, 8, 16]} />{M.porcelain()}</mesh>
      {f > 0.5 && Array.from({ length: 3 }, (_, j) => { const ph = (tt * 0.5 + j / 3) % 1; return <mesh key={j} position={[0.008 * Math.sin(tt * 2 + j), 0.07 + ph * 0.1, 0]} scale={1 - ph}><sphereGeometry args={[0.01, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.3 * (1 - ph)} /></mesh>; })}
    </group>; })}
    <group position={[0.15, 0.21, 0.06]} scale={pop(tt, 3.3) * 1.1}><PriceTag lines={["HOME", "$0"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 20:17 · LA PUERTA TRANQUILA: tres carteles de puerta; los dos llenos se apagan y la ficha va a la vacía ----
export const HQuietGate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="dark"
  cam={{ at: [0, 0.18, 0], az: [-0.12, 0.12], el: [0.16, 0.14], r: [1.0, 0.92], fov: 30 }}>{(tt) => {
  const G = [{ x: -0.2, n: "B12", full: 1 }, { x: 0, n: "B14", full: 1 }, { x: 0.2, n: "B15", full: 0 }];
  const go = eio(tt, 1.8, 3.2);
  return <>
    {G.map((g, i) => { const dim = g.full ? eio(tt, 1.0 + i * 0.2, 1.5 + i * 0.2) : 0; return <group key={i} position={[g.x, 0, -0.04]} scale={pop(tt, 0.1 + i * 0.2)}>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.005, 0.005, 0.28, 10]} />{M.steel()}</mesh>
      <RBox s={[0.13, 0.07, 0.012]} p={[0, 0.3, 0]} r={0.006}>{M.plastic({ col: "#1b1d22" })}</RBox>
      <mesh position={[0, 0.3, 0.007]}><planeGeometry args={[0.12, 0.06]} /><meshBasicMaterial map={txt("gate" + g.n, [g.n], { w: 256, h: 128, bg: "#1d2f5a", fg: "#f2d23a", size: 90 })} color={dim > 0.5 ? "#444" : "#ffffff"} toneMapped={false} /></mesh>
      {Array.from({ length: 6 }, (_, j) => <RBox key={j} s={[0.03, 0.035, 0.03]} p={[-0.05 + (j % 3) * 0.05, 0.02, 0.06 + Math.floor(j / 3) * 0.05]} r={0.006}>{M.pvc({ col: "#5a5e66" })}</RBox>)}
      {g.full ? Array.from({ length: 5 }, (_, j) => <mesh key={"p" + j} position={[-0.05 + (j % 3) * 0.05, 0.06, 0.06 + Math.floor(j / 3) * 0.05]}><capsuleGeometry args={[0.01, 0.025, 6, 10]} /><meshStandardMaterial color={["#b8302a", "#2f6f9a", "#e8a33a", "#3f8f5a", "#7a3a8a"][j]} roughness={0.7} /></mesh>) : null}
    </group>; })}
    <group position={[lerp(0, 0.2, go), 0.03 + 0.05 * Math.sin(PI * go), lerp(0.2, 0.06, go)]} scale={pop(tt, 1.6)}>
      <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.018, 0.05, 24]} />{M.brass()}</mesh>
      <mesh position={[0, 0.062, 0]}><sphereGeometry args={[0.013, 20, 14]} />{M.brass()}</mesh>
    </group>
    <group position={[0.26, 0.17, 0.14]} scale={pop(tt, 3.3) * 1.2}><PriceTag lines={["QUIET", "GATE"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 21:11 · EL SÁNDWICH DE $16: el sándwich envuelto aterriza con su etiqueta de $16 y un sello rojo la tacha de un golpe ----
export const HSandwich: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.08, 0.06, 0], az: [-0.05, 0.05], el: [0.4, 0.36], r: [0.7, 0.64], fov: 30 }}>{(tt) => {
  const st = eio(tt, 1.7, 2.0), hit = 1 - phys(tt, 2.0, 9, 0.25);
  return <>
    <group position={[0, fallY(tt, 0.3, 0.3), 0]} rotation={[0, 0.5, 0]} scale={1.15}>
      {[0.012, 0.048].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.085, 0.085, 0.022, 3]} /><meshStandardMaterial color="#e8d3a0" roughness={0.85} /></mesh>)}
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.088, 0.088, 0.016, 3]} /><meshStandardMaterial color="#6fa04a" roughness={0.8} /></mesh>
      <mesh position={[0, 0.031, 0]} scale={[0.99, 1, 0.99]}><cylinderGeometry args={[0.086, 0.086, 0.01, 3]} /><meshStandardMaterial color="#d9634a" roughness={0.7} /></mesh>
      <mesh position={[0, 0.03, 0]} scale={[1.06, 1.1, 1.06]}><cylinderGeometry args={[0.085, 0.085, 0.06, 3]} /><meshPhysicalMaterial color="#ffffff" roughness={0.15} transparent opacity={0.22} clearcoat={1} /></mesh>
    </group>
    <group position={[0.17, 0.09 + 0.004 * hit, 0.05]} rotation={[0, -0.25, 0.08]} scale={pop(tt, 0.9) * 1.5}>
      <PriceTag lines={["$16"]} col="#b8302a" fg="#fff4e6" />
      {[-1, 1].map((s) => <mesh key={s} visible={st > 0.02} position={[0.008, 0, 0.004]} rotation={[0, 0, s * 0.42]} scale={[Math.max(0.001, st), 1, 1]}><boxGeometry args={[0.12, 0.005, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh>)}
    </group>
    
  </>;
}}</Scene3D>;
