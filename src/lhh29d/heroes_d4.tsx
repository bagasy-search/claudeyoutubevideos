// lhh29d · componentes únicos 28-36: las hormigas que van como a misa, la raya de sal que no cruzan, el escalón con hielo,
// el cuarto de taza por escalón, el frío de menos de 15, mitad sal y mitad arena, el camino de Harold de 1961, la sal que se queda años y la lata de grasa.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Brick, Grains, Kettle, SaltPile, Stream, lg, saltMat } from "./saltkit";

const PI = Math.PI;
type V = [number, number, number];
// hormiga negra: tres bolitas y seis patitas que se mueven
const Ant: React.FC<{ p: number[]; yaw: number; tt: number; s?: number }> = ({ p, yaw, tt, s = 1 }) =>
  <group position={p as V} rotation={[0, yaw, 0]} scale={s}>
    {[[-0.008, 0.0035, 0.0045], [0, 0.0032, 0.003], [0.007, 0.0034, 0.0036]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0]} scale={[1.3, 0.9, 1]} castShadow><sphereGeometry args={[r, 12, 8]} /><meshPhysicalMaterial color="#120c08" roughness={0.3} clearcoat={0.8} /></mesh>)}
    {[-1, 1].map((sd) => [-0.004, 0, 0.004].map((x, i) => <mesh key={sd + "" + i} position={[x, 0.002, sd * 0.004]} rotation={[sd * 0.9, Math.sin(tt * 30 + i * 2 + sd) * 0.5, 0]}><cylinderGeometry args={[0.0004, 0.0004, 0.008, 4]} /><meshBasicMaterial color="#120c08" /></mesh>))}
  </group>;
const Cross: React.FC<{ k: number; p?: number[]; s?: number }> = ({ k, p = [0, 0, 0], s = 1 }) => k <= 0 ? null : <group position={p as V} scale={s}>
  {[1, -1].map((d) => <mesh key={d} rotation={[0, 0, d * PI / 4]} scale={[k, 1, 1]}><planeGeometry args={[0.3, 0.03]} />{M.glow({ col: RED, op: 0.9 })}</mesh>)}</group>;
const iceMat = (op = 0.55) => <meshPhysicalMaterial color="#dff1ff" roughness={0.04} transmission={0.4} thickness={0.01} clearcoat={1} transparent opacity={op} />;
const step = (y: number, z: number, key: number, wet = 0) => <RBox key={key} s={[0.5, 0.06, 0.16]} p={[0, y, z]} r={0.006}><meshStandardMaterial map={tex.wood(3, 1, [150, 140, 128])} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#6a6458"), wet)} roughness={0.85} /></RBox>;

// ---- 13:10 · COMO SI FUERAN A MISA: la fila de hormigas desfila por el umbral de la puerta de atrás, ordenadita, de a una ----
export const HAntChurch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0.04, 0.03, 0], az: [-0.5, -0.3], el: [0.26, 0.2], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="LIKE THEY'RE COMING TO CHURCH" col={AMB} />}>{(tt, u) => <>
  {/* la capillita de madera blanca: la fila entra por la puerta */}
  <group position={[0.2, 0, 0]}>
    <RBox s={[0.1, 0.08, 0.09]} p={[0, 0.04, 0]} r={0.003}>{M.porcelain({ col: "#d9d3c6" })}</RBox>
    {[-1, 1].map((k) => <mesh key={k} position={[0, 0.1, k * 0.024]} rotation={[k * 0.9, 0, 0]}><boxGeometry args={[0.11, 0.004, 0.065]} /><meshStandardMaterial color="#5a3a2a" roughness={0.8} /></mesh>)}
    <RBox s={[0.026, 0.06, 0.026]} p={[0.03, 0.14, 0]} r={0.002}>{M.porcelain({ col: "#d9d3c6" })}</RBox>
    <mesh position={[0.03, 0.195, 0]}><coneGeometry args={[0.02, 0.05, 4]} /><meshStandardMaterial color="#5a3a2a" roughness={0.8} /></mesh>
    <mesh position={[-0.051, 0.026, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.038, 0.052]} /><meshStandardMaterial color="#1a1008" /></mesh>
    {[-0.02, 0.02].map((z, i) => <mesh key={i} position={[0, 0.05, 0.0455 * (i ? 1 : -1) + 0 * z]}><planeGeometry args={[0.016, 0.026]} /><meshStandardMaterial color="#2a2018" emissive="#ffb84a" emissiveIntensity={0.25} /></mesh>)}
  </group>
  {Array.from({ length: 12 }, (_, i) => { const x = -0.3 + u * 0.8 - i * 0.048; if (x < -0.3) return null; const inn = cl((x - 0.12) / 0.03); return inn < 1 && <Ant key={i} p={[x, 0.0, Math.sin(x * 20 + i) * 0.008]} yaw={0} tt={tt + i} s={4.0 * (1 - inn * 0.6)} />; })}
</>}</Scene3D>;

// ---- 13:22 · NO LA CRUZAN: el umbral; la raya de sal se dibuja de punta a punta; las hormigas llegan, la tocan con la antena y dan la vuelta ----
export const HSaltLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.4, 0.3]}
  cam={{ at: [0, 0.01, 0], az: [0.05, 0.2], el: [0.95, 0.85], r: [0.48, 0.4], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THEY WON'T CROSS IT" col={GRN} /><Tag tt={tt} at={4.6} x={1450} y={840} txt="NOT A POISON" col={ICE} size={42} /></>}>{(tt) => {
  const line = eio(tt, 0.4, 2.0);
  return <>
    <RBox s={[0.6, 0.012, 0.08]} p={[0, 0.006, 0.0]} r={0.003}>{M.wood({ base: [140, 98, 60] })}</RBox>
    {Array.from({ length: 70 }, (_, i) => { const u = i / 70; if (u > line) return null; return <mesh key={i} position={[-0.27 + u * 0.54, 0.0135, (rn(i, 2) - 0.5) * 0.012]} rotation={[i, i, 0]}><boxGeometry args={[0.005, 0.004, 0.005]} />{saltMat()}</mesh>; })}
    {Array.from({ length: 9 }, (_, i) => { const st = 1.2 + i * 0.4, u = cl((tt - st) / 1.4), back = cl((tt - st - 1.6) / 1.6), z = 0.18 - u * 0.13 + back * 0.15, x = -0.2 + i * 0.05;
      return tt > st && <Ant key={i} p={[x + Math.sin(tt * 3 + i) * 0.004, 0.0, z]} yaw={back > 0 ? -PI / 2 - PI * cl(back * 3) : -PI / 2} tt={tt + i} s={1.4} />; })}
  </>;
}}</Scene3D>;

// ---- 14:00 · EL HIELO ES LO MÁS PELIGROSO: el escalón vidriado; el zapato pisa y resbala ----
export const HHip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#141a22"
  cam={{ at: [0.03, 0.07, 0.03], az: [-0.6, -0.4], el: [0.24, 0.2], r: [0.74, 0.64], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="ICE ON THE FRONT STEPS" col={ICE} />}>{(tt, u) => {
  const slip = eio(u, 0.62, 0.84);
  return <>
    {step(0.03, 0.08, 0)}{step(0.09, -0.08, 1)}
    <RBox s={[0.48, 0.006, 0.15]} p={[0, 0.063, 0.08]} r={0.003}>{iceMat()}</RBox>
    <group position={[lerp(-0.17, -0.02, slip), 0.085 + slip * 0.05, 0.09]} rotation={[0, 0.2, slip * 0.55]} scale={1.15}>
      <RBox s={[0.14, 0.008, 0.054]} p={[0.003, -0.016, 0]} r={0.003}><meshStandardMaterial color="#c9b79a" roughness={0.9} /></RBox>
      <RBox s={[0.036, 0.016, 0.05]} p={[-0.05, -0.027, 0]} r={0.003}><meshStandardMaterial color="#2a1a10" roughness={0.7} /></RBox>
      <RBox s={[0.13, 0.026, 0.05]} r={0.012}><meshPhysicalMaterial color="#3a2416" roughness={0.35} clearcoat={0.8} /></RBox>
      <mesh position={[0.05, 0.0, 0]} scale={[1.2, 0.75, 1]}><sphereGeometry args={[0.024, 20, 14]} /><meshPhysicalMaterial color="#3a2416" roughness={0.35} clearcoat={0.8} /></mesh>
      <RBox s={[0.055, 0.05, 0.046]} p={[-0.04, 0.03, 0]} r={0.012}><meshPhysicalMaterial color="#3a2416" roughness={0.35} clearcoat={0.8} /></RBox>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.005 + i * 0.013, 0.0145 - i * 0.002, 0]} rotation={[0, 0, -0.15]}><boxGeometry args={[0.003, 0.003, 0.034]} /><meshStandardMaterial color="#f1ece2" roughness={0.8} /></mesh>)}
      <mesh position={[-0.042, 0.12, 0]}><cylinderGeometry args={[0.024, 0.026, 0.13, 20]} /><meshStandardMaterial color="#3d4a63" roughness={0.9} /></mesh>
    </group>
    {Array.from({ length: 30 }, (_, i) => { const u = ((tt * 0.3 + rn(i, 2)) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.8, 0.4 - u * 0.4, (rn(i, 4) - 0.5) * 0.4]}><sphereGeometry args={[0.002, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
    {(() => { const tip = eio(u, 0.14, 0.26), spread = eio(u, 0.22, 0.42), dark = eio(u, 0.3, 0.6); return <>
      <group position={[0.12, 0.066, 0.03]} rotation={[0, -0.4, -1.2 * tip]}>
        <RBox s={[0.07, 0.11, 0.035]} p={[0, 0.055, 0]} r={0.01}><meshStandardMaterial map={tex.text("rockbag", 128, 192, (g) => { g.fillStyle = "#2f5fae"; g.fillRect(0, 0, 128, 192); g.fillStyle = "#f4f1ea"; g.fillRect(0, 60, 128, 60); g.fillStyle = "#2f5fae"; g.font = "bold 26px Arial"; g.textAlign = "center"; g.fillText("SALT", 64, 100); })} roughness={0.8} /></RBox></group>
      {Array.from({ length: 40 }, (_, i) => { const r = spread * (0.03 + rn(i, 5) * 0.12), a = PI * 0.6 + rn(i, 6) * PI * 0.9; return spread > 0 && <mesh key={"s" + i} position={[0.1 + Math.cos(a) * r, 0.068, 0.08 + Math.sin(a) * r * 0.5]} rotation={[i, i, 0]}><boxGeometry args={[0.005, 0.004, 0.005]} />{saltMat()}</mesh>; })}
      <mesh position={[0.05, 0.0665, 0.08]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 0.7, 1]}><circleGeometry args={[0.07 * dark + 0.001, 40]} /><meshStandardMaterial color="#3a4048" transparent opacity={0.55 * dark} roughness={0.2} /></mesh></>; })()}
  </>;
}}</Scene3D>;

// ---- 14:14 · UN CUARTO DE TAZA POR ESCALÓN: la tacita vuelca la sal en abanico finito y debajo el hielo se oscurece y se derrite ----
export const HQuarterCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#141a22"
  cam={{ at: [0, 0.07, 0], az: [0.45, 0.3], el: [0.55, 0.46], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="A QUARTER CUP A STEP" col={AMB} /><Tag tt={tt} at={2.4} x={1450} y={840} txt="SPREAD THIN" col={GRN} size={42} /></>}>{(tt) => {
  const pour = eio(tt, 0.3, 1.0), melt = eio(tt, 1.4, 4.4);
  return <>
    {step(0.03, 0.08, 0, melt * 0.5)}{step(0.09, -0.08, 1)}
    <RBox s={[0.48, 0.006, 0.15]} p={[0, 0.063, 0.08]} r={0.003}>{iceMat(0.55 * (1 - melt * 0.8))}</RBox>
    <Grains n={80} r={0.16} p={[0, 0.064, 0.08]} k={eio(tt, 0.5, 1.6)} seed={21} s={0.004} />
    <group position={[0.02, 0.22, 0.06]} rotation={[0, 0, 2.0 * pour]}>
      <mesh geometry={lg("mcup", [[0, 0], [0.035, 0], [0.04, 0.05], [0.042, 0.05], [0.037, 0.0]], 32)}>{M.steel({ side: THREE.DoubleSide })}</mesh>
      <RBox s={[0.08, 0.004, 0.014]} p={[-0.07, 0.045, 0]} r={0.002}>{M.steel({})}</RBox>
    </group>
    <Stream tt={tt} p={[-0.02, 0.2, 0.06]} y1={0.07} on={tt > 0.6 && tt < 1.8 ? 1 : 0} n={30} spread={0.05} />
  </>;
}}</Scene3D>;

// ---- 14:40 · BAJO 15 GRADOS NO ANDA: el termómetro de afuera baja de 30 a 10; los granos de sal quedan secos sobre el hielo, sin derretir nada ----
export const HBelow15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#0f151d"
  cam={{ at: [0.02, 0.15, 0], az: [-0.2, 0.05], el: [0.24, 0.2], r: [0.74, 0.64], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="BELOW 15° IT QUITS" col={ICE} /><Tag tt={tt} at={2.6} x={1450} y={840} txt="USE SAND" col={AMB} size={44} /></>}>{(tt, u) => {
  const temp = lerp(30, 10, eio(u, 0.06, 0.5)), col = (temp + 10) / 50, mk = eio(u, 0.74, 0.84);
  return <>
    {step(0.03, 0.08, 0)}
    <RBox s={[0.48, 0.006, 0.15]} p={[0, 0.063, 0.08]} r={0.003}>{iceMat()}</RBox>
    <Grains n={40} r={0.15} p={[0, 0.064, 0.08]} seed={23} s={0.0045} />
    {[[-0.12, 0.06], [-0.03, 0.1], [0.06, 0.05], [0.12, 0.11]].map(([x, z], i) => <group key={"ug" + i} position={[x, 0.068, z]}>
      <mesh><boxGeometry args={[0.009, 0.009, 0.009]} />{saltMat()}</mesh>
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, 0]} scale={Math.max(0.001, mk)}><ringGeometry args={[0.016, 0.021, 32]} />{M.glow({ col: "#e0302a" })}</mesh></group>)}
    <group position={[0.17, 0.125, -0.03]} scale={0.9}>
      <RBox s={[0.085, 0.3, 0.014]} r={0.008}>{M.wood({ base: [190, 180, 160] })}</RBox>
      {[-10, 0, 15, 30].map((v) => <mesh key={v} position={[0.016, -0.12 + ((v + 10) / 50) * 0.24, 0.007]}><boxGeometry args={[0.014, v === 15 ? 0.003 : 0.0015, 0.001]} /><meshBasicMaterial color={v === 15 ? "#2a6fc8" : "#333"} /></mesh>)}
      <mesh position={[0, -0.13, 0.012]}><sphereGeometry args={[0.02, 16, 12]} /><meshStandardMaterial color="#c8322a" emissive="#c8322a" emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, -0.12 + col * 0.12, 0.01]} scale={[1, col + 0.02, 1]}><cylinderGeometry args={[0.009, 0.009, 0.24, 12]} /><meshStandardMaterial color="#c8322a" emissive="#c8322a" emissiveIntensity={0.4} /></mesh>
    </group>
    {Array.from({ length: 24 }, (_, i) => { const u = ((tt * 0.25 + rn(i, 2)) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.8, 0.45 - u * 0.45, (rn(i, 4) - 0.5) * 0.4]}><sphereGeometry args={[0.002, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 14:45 · MITAD SAL, MITAD ARENA: la lata de café junto a la puerta se llena en dos chorros, blanco y arena, y la pala se clava arriba ----
export const HHalfSand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.12, 0], az: [0.3, 0.15], el: [0.46, 0.4], r: [0.6, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HALF SALT · HALF SAND" col={AMB} /><Tag tt={tt} at={4.2} x={1450} y={840} txt="BY THE FRONT DOOR" col={ICE} size={40} /></>}>{(tt, u) => {
  const a = eio(u, 0.08, 0.72), b = a, sc = u > 0.8 ? 1 - Math.exp(-(u - 0.8) * 30) * Math.cos((u - 0.8) * 50) : 0;
  return <>
    <mesh geometry={lg("can", [[0, 0], [0.06, 0], [0.06, 0.16], [0.062, 0.16], [0.062, 0]], 48)}><meshStandardMaterial color="#c43a2a" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.08, 0.0]}><cylinderGeometry args={[0.0625, 0.0625, 0.05, 48, 1, true]} /><meshStandardMaterial color="#f2e6c4" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.002 + 0.056 * a, 0]} scale={[1, 1.6 * a + 0.01, 1]}><cylinderGeometry args={[0.058, 0.058, 0.07, 48]} /><meshStandardMaterial map={tex.text("pilemix", 128, 128, (g) => { g.fillStyle = "#efe9dc"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1600; i++) { g.fillStyle = i % 2 ? "#b8874a" : "#fdfdfb"; g.fillRect(rn(i, 2) * 128, rn(i, 3) * 128, 2, 2); } })} roughness={0.9} /></mesh>
    {u > 0.08 && u < 0.72 && [-1, 1].map((sd) => Array.from({ length: 70 }, (_, i) => { const q = ((tt * 1.4 + i / 70) % 1); return <mesh key={sd + "_" + i} position={[sd * 0.02 + (rn(i + sd * 9, 5) - 0.5) * 0.016, 0.27 - q * (0.25 - 0.112 * b), (rn(i + sd * 9, 6) - 0.5) * 0.016]}><sphereGeometry args={[0.0048, 8, 6]} /><meshStandardMaterial color={sd < 0 ? "#fbfbf8" : "#c09358"} roughness={0.9} /></mesh>; }))}
    {sc > 0 && <group position={[0.02, 0.14 + (1 - cl(sc)) * 0.2, 0]} rotation={[0, 0, 0.3]}>
      <mesh position={[0, 0, 0]} scale={[1, 1.3, 0.5]}><sphereGeometry args={[0.025, 20, 12, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.006, 0.006, 0.09, 12]} />{M.wood({ base: [150, 100, 60] })}</mesh></group>}
    {/* la puerta de entrada atrás */}
    <RBox s={[0.36, 0.5, 0.03]} p={[-0.05, 0.25, -0.2]} r={0.006}><meshStandardMaterial color="#2f4a3a" roughness={0.6} /></RBox>
    <mesh position={[0.1, 0.24, -0.18]}><sphereGeometry args={[0.012, 16, 12]} />{M.brass({})}</mesh>
  </>;
}}</Scene3D>;

// ---- 14:58 · EL CAMINO DE HAROLD, 1961: los ladrillos caen uno por uno y arman el camino hasta la puerta; en las juntas brotan los yuyos ----
export const HPath1961: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1a2016" lamp={[0, 0.5, 0.2]}
  cam={{ at: [0, 0.0, -0.05], az: [0.35, 0.2], el: [0.6, 0.5], r: [0.95, 0.8], fov: 32 }}
  over={(tt) => <><Head tt={tt} kick="" title="HAROLD'S PATH · 1961" col={AMB} /><Tag tt={tt} at={4.6} x={1450} y={840} txt="WEEDS EVERY SUMMER" col={GRN} size={40} /></>}>{(tt) => {
  const n = 24, w = eio(tt, 4.2, 6.8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.001, 0]}><planeGeometry args={[3, 3]} /><meshStandardMaterial color="#4f6a34" roughness={1} bumpMap={tex.paper(20, 20)} bumpScale={5} /></mesh>
    {Array.from({ length: n }, (_, i) => { const row = Math.floor(i / 2), col = i % 2, k = phys(tt, 0.3 + i * 0.13, 8, 0.45); if (k <= 0) return null;
      return <Brick key={i} p={[(col - 0.5) * 0.105 + (row % 2) * 0.02, 0.0275 + (1 - cl(k)) * 0.3, 0.36 - row * 0.1]} rot={[0, PI / 2 * 0 + 0.02 * (rn(i, 2) - 0.5), 0]} s={0.5} />; })}
    {Array.from({ length: 14 }, (_, i) => { const k = cl(w * 14 - i); if (k <= 0) return null; const z = 0.31 - Math.floor(i / 2) * 0.1 - 0.05, x = (i % 2 ? 1 : -1) * 0.003;
      return <group key={i} position={[x, 0.0, z]} scale={k}>{[0, 1, 2].map((l) => <mesh key={l} position={[0, 0.03, 0]} rotation={[0.4 * Math.cos(l * 2.1), l * 2.1, 0.4 * Math.sin(l * 2.1)]}>
        <coneGeometry args={[0.006, 0.06, 4]} /><meshStandardMaterial color="#5aa03a" roughness={0.8} /></mesh>)}</group>; })}
    <RBox s={[0.5, 0.4, 0.04]} p={[0, 0.2, -0.86]} r={0.006}><meshStandardMaterial color="#e8e2d4" roughness={0.8} /></RBox>
    <RBox s={[0.16, 0.3, 0.02]} p={[0, 0.15, -0.83]} r={0.004}><meshStandardMaterial color="#2f4a3a" roughness={0.6} /></RBox>
    <group position={[0.18, 0.06, 0.3]} rotation={[0, -0.5, 0]}><DigitDrum v={1} p={[-0.045, 0, 0]} r={0.02} w={0.028} /><DigitDrum v={9} p={[-0.015, 0, 0]} r={0.02} w={0.028} /><DigitDrum v={lerp(0, 6, eio(tt, 0.3, 2.6))} p={[0.015, 0, 0]} r={0.02} w={0.028} /><DigitDrum v={lerp(0, 1, eio(tt, 0.3, 2.9))} p={[0.045, 0, 0]} r={0.02} w={0.028} /></group>
  </>;
}}</Scene3D>;

// ---- 15:29 · LA SAL SE QUEDA AÑOS: corte de la tierra bajo los ladrillos; el agua salada baja por la junta y se queda; los años pasan y ahí no crece nada; el cantero queda a salvo ----
export const HYearsGround: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0.07, 0.0, 0], az: [0.02, 0.1], el: [0.1, 0.12], r: [0.82, 0.72], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SALT STAYS FOR YEARS" col={RED} /><Tag tt={tt} at={1.0} x={980} y={200} txt="ONLY IN THE CRACKS" col={AMB} size={38} anchor="l" />
    </>}>{(tt, u) => {
  const seep = eio(u, 0.06, 0.4), yrs = eio(u, 0.4, 0.86) * 5, keep = eio(u, 0.82, 0.92), wg = eio(u, 0.56, 0.72), wd = eio(u, 0.8, 0.9);
  return <>
    <RBox s={[0.9, 0.24, 0.12]} p={[0, -0.12, 0]} r={0.004}><meshStandardMaterial color="#5a3c24" roughness={1} bumpMap={tex.paper(6, 3)} bumpScale={4} /></RBox>
    {[-0.25, -0.13, -0.01, 0.11].map((x, i) => <Brick key={i} p={[x, 0.014, 0]} s={0.55} />)}
    {[-0.19, -0.07, 0.05].map((x, i) => <group key={i}>
      <mesh position={[x, -0.01 - seep * 0.07, 0.061]} scale={[1, seep, 1]}><planeGeometry args={[0.03, 0.14]} /><meshBasicMaterial color="#e8eef2" transparent opacity={0.55} /></mesh>
      {Array.from({ length: 10 }, (_, k) => <mesh key={k} position={[x + (rn(i * 10 + k, 2) - 0.5) * 0.03, -0.01 - rn(i * 10 + k, 3) * 0.13 * seep, 0.062]}><boxGeometry args={[0.004, 0.004, 0.001]} />{saltMat()}</mesh>)}</group>)}
    {[0.23, 0.285, 0.335, 0.37].map((x, i) => <group key={"wd" + i} position={[x, 0.0, 0.03]} scale={Math.max(0.001, wg * (1 + 0.15 * wd))}>
      {[-1, 0, 1].map((k) => <mesh key={k} position={[k * 0.008, 0.025, 0]} rotation={[0, 0, k * 0.4]}><coneGeometry args={[0.008, 0.07, 6]} /><meshStandardMaterial color="#3f9a3a" roughness={0.8} /></mesh>)}</group>)}
    {/* el cantero con flores a la derecha, separado por la tabla */}
    <RBox s={[0.012, 0.3, 0.12]} p={[0.2, -0.08, 0]} r={0.002}>{M.wood({ base: [130, 90, 55] })}</RBox>
    {[0.26, 0.32, 0.38].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.002, 0.002, 0.08, 6]} /><meshStandardMaterial color="#3f8a3a" /></mesh>
      <mesh position={[0, 0.085, 0]}><sphereGeometry args={[0.014, 14, 10]} /><meshStandardMaterial color={["#e04a6a", "#f2c84a", "#9a5ad0"][i]} roughness={0.7} /></mesh></group>)}
    <group position={[-0.06, 0.13, 0.04]}><RBox s={[0.12, 0.06, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={yrs} p={[-0.02, 0, 0.016]} r={0.02} w={0.028} />
      <mesh position={[0.03, 0, 0.017]}><planeGeometry args={[0.04, 0.03]} /><meshStandardMaterial map={tex.text("yrs", 128, 96, (g) => { g.fillStyle = "#f1ead9"; g.fillRect(0, 0, 128, 96); g.fillStyle = "#2a1e12"; g.font = "bold 44px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("YRS", 64, 50); })} /></mesh></group>
  </>;
}}</Scene3D>;

// ---- 16:36 · LA GRASA VA A UNA LATA: la sartén vuelca la grasa dorada en la lata; se enfría y se pone blanca y dura; el desagüe con cruz ----
export const HGreaseCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0.0, 0.08, 0], az: [-0.3, -0.1], el: [0.62, 0.54], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="GREASE GOES IN A CAN" col={AMB} /><Tag tt={tt} at={3.0} x={1450} y={840} txt="NEVER DOWN THE DRAIN" col={RED} size={40} /></>}>{(tt, u) => {
  const pour = eio(u, 0.04, 0.14) * (1 - eio(u, 0.44, 0.52)), lvl = eio(u, 0.12, 0.46), hard = eio(u, 0.56, 0.86);
  return <>
    <mesh geometry={lg("tcan", [[0, 0], [0.045, 0], [0.045, 0.11], [0.047, 0.11], [0.047, 0]], 40)}>{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.005 + 0.04 * lvl, 0]} scale={[1, lvl + 0.01, 1]}><cylinderGeometry args={[0.043, 0.043, 0.08, 40]} />
      <meshPhysicalMaterial color={new THREE.Color("#d8a43a").lerp(new THREE.Color("#f3eee2"), hard)} roughness={0.2 + 0.6 * hard} clearcoat={1 - hard} transparent opacity={0.85 + 0.15 * hard} /></mesh>
    <group position={[0.1, 0.18, 0]} rotation={[0, 0, 1.3 * pour]}>
      <mesh geometry={lg("fpan", [[0, 0], [0.07, 0], [0.08, 0.025], [0.082, 0.025], [0.072, 0.0]], 40)}>{M.steel({ side: THREE.DoubleSide })}</mesh>
      <RBox s={[0.12, 0.012, 0.022]} p={[0.13, 0.015, 0]} r={0.005}>{M.plastic({ col: "#1a1a1a" })}</RBox>
    </group>
    {pour > 0.6 && <mesh position={[0.03, 0.12, 0]}><cylinderGeometry args={[0.006, 0.007, 0.1, 12]} /><meshPhysicalMaterial color="#d8a43a" roughness={0.2} clearcoat={1} /></mesh>}
    <group position={[-0.2, 0.002, 0.05]}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.04, 32]} />{M.steel({})}</mesh>
      {[-0.02, 0, 0.02].map((x, i) => <mesh key={i} position={[x, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.006, 0.05]} /><meshBasicMaterial color="#222" /></mesh>)}
      
    </group>
  </>;
}}</Scene3D>;
