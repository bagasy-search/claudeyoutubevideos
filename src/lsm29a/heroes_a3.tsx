// lsm29a · componentes únicos 13-18 (las tarjetas con nombre, el lugar de más, el recién llegado y el hilo que une).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Dots, FoldChair, Fork, Glass, Plate, Roll, Steam, Table, Teacup, linenTex, paperTex } from "./tg";

const PI = Math.PI;

// tarjeta de lugar plegada en carpa (k = 0 plana, 1 parada)
const PlaceCard: React.FC<{ name: string; k: number; p?: [number, number, number]; ry?: number }> = ({ name, k, p = [0, 0, 0], ry = 0 }) => {
  // carpa: la cumbrera sube al centro y las dos tapas quedan apoyadas en la mesa; la de adelante muestra el nombre derecho
  const a = lerp(0.02, 1.15, k), L = 0.07, map = paperTex("pc" + name, [name], { w: 512, h: 256 });
  return <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, (L / 2) * Math.sin(a), (L / 2) * Math.cos(a)]} rotation={[-PI / 2 + a, 0, 0]} castShadow><planeGeometry args={[0.13, L]} /><meshStandardMaterial map={map} roughness={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, (L / 2) * Math.sin(a), -(L / 2) * Math.cos(a)]} rotation={[-PI / 2 - a, 0, 0]} castShadow><planeGeometry args={[0.13, L]} /><meshStandardMaterial color="#f3ede0" roughness={0.8} side={THREE.DoubleSide} /></mesh>
  </group>;
};

// ---- 10:17 · ALGUIEN TE ESPERABA: la tarjeta cae plana sobre el plato, se pliega sola y se para con un nombre escrito a mano ----
export const HPlacecard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.85}
  cam={{ at: [0, 0.81, 0.02], az: [-0.45, 0.35], el: [0.28, 0.14], r: [0.62, 0.36], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.6} x={560} y={200} txt="SOMEBODY EXPECTED YOU" col={AMB} size={34} />}>{(tt) => {
  const drop = phys(tt, 0.4, 7, 0.5), fold = eio(tt, 1.6, 2.8);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.2} d={0.8} /></group>
    <group position={[0, 0.76, 0]}><Plate r={0.13} /></group>
    <Fork p={[-0.17, 0.76, 0]} />
    <Glass p={[0.19, 0.76, -0.12]} lv={0.55} />
    <group position={[0, 0.775 + (1 - cl(drop)) * 0.3, 0.01]} rotation={[0, (1 - cl(drop)) * 2.6, (1 - cl(drop)) * 0.4]}><PlaceCard name="Mrs. Inez Carlson" k={fold} /></group>
  </>;
}}</Scene3D>;

// ---- 10:51 · UN LUGAR DE MÁS: seis cubiertos en fila; el séptimo entra deslizándose y una silla se acerca sola ----
export const HExtraplace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" warm={0.85}
  cam={{ at: [0.9, 0.7, 0], at1: [1.1, 0.66, 0], az: [0.45, 0.3], el: [0.5, 0.44], r: [1.45, 1.15], fov: 32 }} over={(tt) => <Tag tt={tt} at={3.4} x={1400} y={880} txt="SOMEBODY WILL NEED IT" col={AMB} size={38} />}>{(tt) => {
  const s = phys(tt, 0.9, 7, 0.6), ch = phys(tt, 2.2, 5, 0.75), halo = eio(tt, 1.6, 2.4);
  const Setting: React.FC<{ x: number; z: number }> = ({ x, z }) => <group position={[x, 0.76, z]}>
    <Plate r={0.1} /><Fork p={[-0.14, 0, 0]} /><RBox s={[0.012, 0.004, 0.15]} r={0.002} p={[0.14, 0.003, 0]}>{M.steel()}</RBox><Glass p={[0.12, 0, -Math.sign(z) * 0.1]} lv={0.5} />
    <mesh position={[-0.21, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.08, 0.13]} /><meshStandardMaterial color="#8f2430" roughness={0.95} /></mesh>
  </group>;
  return <>
    <group position={[0, 0.76, 0]}><Table w={2.4} d={0.8} /></group>
    {/* seis lugares completos, tres por lado */}
    {[-0.9, -0.3, 0.3].map((x) => [1, -1].map((k) => <group key={x + "_" + k}><Setting x={x} z={k * 0.2} /><FoldChair p={[x, 0, k * 0.6]} ry={k > 0 ? PI : 0} /></group>))}
    {/* el séptimo lugar entra deslizándose a la cabecera */}
    <group position={[0, 0.0 + 0.05 * Math.sin(PI * cl(s)), lerp(0.9, 0, cl(s))]}><group position={[0.92, 0.76, 0]} scale={1.3}><group position={[-0.92, -0.76, 0]}><Setting x={0.92} z={0.0001} /></group></group></group>
    {/* y una silla se acerca sola, arrastrándose, con su sombra */}
    <FoldChair p={[lerp(2.0, 1.32, cl(ch)), 0, 0]} ry={-PI / 2} col="#c79a52" />
    <mesh rotation={[-PI / 2, 0, 0]} position={[lerp(2.0, 1.32, cl(ch)), 0.002, 0]}><circleGeometry args={[0.28, 28]} /><meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} /></mesh>
    <mesh position={[0.92, 0.775, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.12, 0.22, 48]} />{M.glow({ col: "#ffcf7a", op: 0.6 * halo })}</mesh>
  </>;
}}</Scene3D>;

// ---- 11:44 · LA PUNTA DEL PERCHERO: la mesa larga desde la cabecera; allá lejos, un plato solo junto al perchero lleno de abrigos… se apaga ----
const Coat: React.FC<{ c: string; ry: number }> = ({ c, ry }) => <group rotation={[0, ry, 0]}>
  <mesh position={[0, -0.32, 0]} scale={[1, 1, 0.55]} castShadow><cylinderGeometry args={[0.1, 0.2, 0.62, 20]} /><meshStandardMaterial color={c} roughness={0.92} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.11, -0.28, 0]} rotation={[0, 0, k * 0.12]} castShadow><cylinderGeometry args={[0.035, 0.045, 0.5, 12]} /><meshStandardMaterial color={c} roughness={0.92} /></mesh>)}
  <mesh position={[0, -0.03, 0.02]} rotation={[0.3, 0, 0]}><torusGeometry args={[0.07, 0.02, 8, 18, PI]} /><meshStandardMaterial color={c} roughness={0.9} /></mesh>
</group>;
export const HLongtable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.95}
  cam={{ at: [0.2, 0.85, 0.15], at1: [1.78, 1.0, 0.36], az: [-1.42, -1.15], el: [0.36, 0.26], r: [2.5, 0.95], fov: 32 }}>{(tt) => {
  const dim = eio(tt, 3.6, 5.2), eat = eio(tt, 1.6, 3.4);
  return <>
    <group position={[0, 0.76, 0]}><Table w={3.6} d={0.7} /></group>
    {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1].map((x) => [-1, 1].map((k) => <group key={x + "" + k}><group position={[x, 0.76, k * 0.2]}><Plate r={0.09} /></group><FoldChair p={[x, 0, k * 0.55]} ry={k > 0 ? PI : 0} /></group>))}
    {/* la última silla, pegada al perchero */}
    <group position={[1.65, 0.76, 0.2]}><Plate r={0.09} />{eat < 1 && <mesh position={[0, 0.025, 0]} scale={[1 - eat, 0.4 * (1 - eat) + 0.001, 1 - eat]}><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color="#b9763c" roughness={0.5} /></mesh>}</group>
    <FoldChair p={[1.65, 0, 0.55 + 0.25 * dim]} ry={PI + 0.4 * dim} />
    <group position={[2.0, 0, 0.6]}>
      <mesh position={[0, 0.85, 0]}><cylinderGeometry args={[0.015, 0.015, 1.7, 10]} />{M.steel()}</mesh>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 20]} />{M.steel()}</mesh>
      {["#56704a", "#8a6a44", "#4a5a7a", "#9a3a30"].map((c, i) => <group key={i} position={[Math.cos(i * 1.6) * 0.12, 1.6, Math.sin(i * 1.6) * 0.12]}><Coat c={c} ry={i * 1.6} /></group>)}
      {/* la gorra del soldado en el gancho */}
      <mesh position={[0.08, 1.66, 0.1]} scale={[1, 0.45, 1.2]}><sphereGeometry args={[0.07, 18, 12, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#3d4a2e" roughness={0.8} /></mesh>
    </group>
    {/* el haz cálido sobre esa punta, que se va apagando */}
    <mesh position={[1.7, 0.765, 0.3]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.5, 36]} />{M.glow({ col: "#ffd08a", op: 0.3 * (1 - dim) })}</mesh>
  </>;
}}</Scene3D>;

// ---- 12:48 · UNA COSA EN COMÚN: dos tarjetas con nombre en dos platos; un hilo rojo las une pasando por un granito de trigo ----
export const HCommonthread: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [0, 0.86, -0.04], az: [-0.3, 0.25], el: [0.5, 0.4], r: [0.95, 0.8], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.2} x={960} y={950} txt="BOTH GREW UP IN NEBRASKA" col={AMB} size={36} />}>{(tt) => {
  const k = eio(tt, 1.2, 3.0), pts = [[-0.3, 0.84, 0.02], [-0.12, 0.92, -0.08], [0, 0.95, -0.12], [0.12, 0.92, -0.08], [0.3, 0.84, 0.02]];
  const n = Math.max(2, Math.round(2 + k * 3)), sub = pts.slice(0, n);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.4} d={0.8} /></group>
    {[-0.3, 0.3].map((x, i) => <group key={x}><group position={[x, 0.76, 0.1]}><Plate r={0.12} /></group>
      <group position={[x, 0.776, -0.02]}><PlaceCard name={i ? "Gary" : "Frank"} k={eio(tt, 0.3 + i * 0.3, 1.0 + i * 0.3)} /></group></group>)}
    {k > 0.02 && <mesh geometry={tubeG("thr" + n, sub, 0.0035, 60, 8)}><meshStandardMaterial color="#c4302a" roughness={0.6} /></mesh>}
    {/* el trigo de Nebraska donde se cruzan */}
    <group position={[0, 0.95, -0.12]} scale={0.02 + 0.98 * eio(tt, 0.2, 1.0)}>
      <mesh rotation={[0, 0, 0.15]} castShadow><capsuleGeometry args={[0.022, 0.045, 8, 16]} /><meshPhysicalMaterial color="#d9a84a" roughness={0.35} clearcoat={0.5} /></mesh>
      <mesh position={[0.004, 0, 0.021]} rotation={[0, 0, 0.15]}><boxGeometry args={[0.003, 0.06, 0.003]} /><meshStandardMaterial color="#a8782e" roughness={0.6} /></mesh>
      <mesh position={[0, 0.0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.002, 8, 30]} />{M.glow({ col: "#ffd27a", op: 0.5 * eio(tt, 2.8, 3.4) })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 13:08 · ¿QUÉ COCINABA TU MAMÁ?: la bandeja giratoria trae, de a una, el relleno de ostras, los tamales y la sopa coreana ----
export const HLazysusan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.82, 0.08], az: [0.1, 0.2], el: [0.5, 0.42], r: [0.85, 0.72], fov: 30 }} over={(tt) => <Tag tt={tt} at={0.8} x={1420} y={880} txt="YOUR MOTHER'S DISH" col={AMB} size={38} />}>{(tt) => {
  const rot = lerp(0, PI * 4 / 3, eio(tt, 1.2, 2.6)) + lerp(0, PI * 2 / 3, eio(tt, 3.2, 4.4)) + 0.02 * tt;
  const D = [
    <><mesh position={[0, 0.03, 0]} scale={[1.3, 1, 1]}><cylinderGeometry args={[0.07, 0.06, 0.05, 30]} />{M.glass({ op: 0.4 })}</mesh><mesh position={[0, 0.05, 0]} scale={[1.3, 0.25, 1]}><sphereGeometry args={[0.065, 20, 12]} /><meshStandardMaterial color="#b88a4e" roughness={0.7} /></mesh>{[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * 1.6) * 0.04, 0.066, Math.sin(i * 1.6) * 0.03]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#4c8a3c" /></mesh>)}</>,
    <>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[(i - 2) * 0.026, 0.025, (rn(i, 2) - 0.5) * 0.02]} rotation={[PI / 2, 0, 0.1 * i]} castShadow><capsuleGeometry args={[0.012, 0.07, 6, 10]} /><meshStandardMaterial color="#d8c08a" roughness={0.85} /></mesh>)}</>,
    <><mesh position={[0, 0.035, 0]}><sphereGeometry args={[0.065, 30, 16, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh><mesh position={[0, 0.03, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.058, 30]} /><meshPhysicalMaterial color="#b4472a" roughness={0.1} clearcoat={1} /></mesh><Steam p={[0, 0.03, 0]} tt={tt} on={0.8} n={8} w={0.05} /></>,
  ];
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.4} d={1.0} /></group>
    <group position={[0, 0.77, 0]} rotation={[0, rot, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[0.3, 0.3, 0.02, 64]} />{M.wood({ base: [150, 98, 54] })}</mesh>
      {D.map((d, i) => { const fz = Math.cos(i * PI * 2 / 3 + rot), big = 1 + 0.3 * Math.max(0, fz) ** 6; return <group key={i} position={[Math.sin(i * PI * 2 / 3) * 0.17, 0.01, Math.cos(i * PI * 2 / 3) * 0.17]} scale={big}>{d}</group>; })}
    </group>
    {[-1, 1].map((k) => <group key={k} position={[k * 0.5, 0.76, 0.3]}><Plate r={0.1} /></group>)}
  </>;
}}</Scene3D>;

// ---- 13:41 · CATORCE AÑOS: la misma tarjeta «Frank» se apila año tras año; el contador sube a 14 ----
export const HFourteen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [0.08, 0.1, 0.03], az: [0.5, 0.2], el: [0.35, 0.3], r: [0.85, 0.75], fov: 30 }} over={(tt) => <Tag tt={tt} at={4.2} x={1400} y={300} txt="EVERY THANKSGIVING" col={AMB} size={36} />}>{(tt) => {
  const N = 14, last = (i: number) => 0.5 + i * 0.27, n = Array.from({ length: N }, (_, i) => i).filter((i) => tt > last(i)).length;
  return <>
    {Array.from({ length: N }, (_, i) => { const k = phys(tt, last(i), 9, 0.5); return tt > last(i) - 0.05 && <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.012, 0.012 + i * 0.011 + (1 - cl(k)) * 0.35, (rn(i, 3) - 0.5) * 0.012]} rotation={[0, (rn(i, 4) - 0.5) * 0.2, 0]} castShadow>
      <boxGeometry args={[0.18, 0.009, 0.1]} />
      {[0, 1, 3, 4, 5].map((m) => <meshStandardMaterial key={m} attach={`material-${m}`} color="#efe9da" roughness={0.8} />)}
      <meshStandardMaterial attach="material-2" map={paperTex("frank", ["Frank"], { w: 512, h: 280 })} roughness={0.8} /></mesh>; })}
    {/* contador de dos tambores */}
    <group position={[0.26, 0.1, 0.08]} rotation={[0, -0.45, 0]} scale={1.5}>
      <RBox s={[0.15, 0.1, 0.08]} r={0.012}>{M.brass()}</RBox><RBox s={[0.12, 0.075, 0.01]} r={0.005} p={[0, 0, 0.038]}><meshStandardMaterial color="#1b1712" roughness={0.5} /></RBox>
      <DigitDrum v={Math.floor(n / 10)} p={[-0.025, 0, 0.042]} r={0.03} w={0.04} /><DigitDrum v={n % 10} p={[0.025, 0, 0.042]} r={0.03} w={0.04} />{[-1, 1].map((k) => <RBox key={k} s={[0.15, 0.03, 0.006]} r={0.003} p={[0, k * 0.03, 0.075]}>{M.brass()}</RBox>)}
    </group>
  </>;
}}</Scene3D>;
