// gary02 · LA ARENA: el garaje de Gary convertido en ring. Tres pedestales con los contendientes
// (generador · estación de batería · batería de auto + inversor), cada uno se enciende con su foco cuando la voz lo nombra.
// UNA cámara (keyframes en segundos globales). Render SÓLO en el farm.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { Generator, Exhaust, PowerStation, CarBattery } from "./gear3d";

const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const awin = (t: number, a: number, b: number) => sm((t - a) / (b - a));
type V3 = [number, number, number];
export type AKey = { t: number; p: V3; l: V3; fov?: number };

// pedestales: x de cada contendiente
export const PED: V3[] = [[-2.2, 0, 0], [0, 0, 0], [2.2, 0, 0]];
export const TOP = 0.9; // alto del pedestal

const v3 = (a: V3) => new THREE.Vector3(a[0], a[1], a[2]);
export const camOf = (keys: AKey[], t: number) => {
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t <= t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  return { p: v3(a.p).lerp(v3(b.p), k), l: v3(a.l).lerp(v3(b.l), k), fov: (a.fov ?? 38) + ((b.fov ?? 38) - (a.fov ?? 38)) * k };
};
export const aproject = (keys: AKey[], t: number, q: V3) => {
  const c = camOf(keys, t);
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 200); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
const Cam: React.FC<{ keys: AKey[]; t: number }> = ({ keys, t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = camOf(keys, t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.05; c.far = 200; c.updateProjectionMatrix();
  return null;
};

const Ped: React.FC<{ x: number; on: number; col: string }> = ({ x, on, col }) => (
  <group position={[x, 0, 0]}>
    <mesh position={[0, TOP / 2, 0]} castShadow receiveShadow geometry={rbox(1.3, TOP, 1.3, 0.04)}><meshStandardMaterial color="#2a2c30" roughness={0.55} metalness={0.25} /></mesh>
    <mesh position={[0, TOP + 0.012, 0]} receiveShadow geometry={rbox(1.36, 0.03, 1.36, 0.012)}><meshStandardMaterial color="#cfd3d8" roughness={0.3} metalness={0.8} /></mesh>
    {/* filete de luz en el canto superior */}
    <mesh position={[0, TOP - 0.02, 0.66]}><boxGeometry args={[1.3, 0.025, 0.01]} /><meshBasicMaterial color={col} transparent opacity={0.15 + 0.85 * on} toneMapped={false} /></mesh>
    {/* cono de luz del foco (aditivo) */}
    {on > 0.01 && <mesh position={[0, TOP + 1.9, 0]}><cylinderGeometry args={[0.12, 0.85, 3.8, 32, 1, true]} /><meshBasicMaterial color="#fff2d8" transparent opacity={on * 0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>}
    {on > 0.01 && <spotLight position={[0, TOP + 3.8, 0.4]} angle={0.42} penumbra={0.55} intensity={on * 60} distance={9} color="#fff1d6" castShadow shadow-bias={-0.0004} shadow-normalBias={0.02} target-position={[x, TOP, 0]} />}
  </group>
);

export const ArenaWorld: React.FC<{ t: number; keys: AKey[]; on: [number, number, number]; run?: number; pct?: string }> = ({ t, keys, on, run = 0, pct = "100%" }) => {
  const tx = useTextures();
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam keys={keys} t={t} />
      <Post bloom={0.55} threshold={0.8} exposure={0.95} env={0.12} />
      <color attach="background" args={["#0b0c0f"]} />
      <fog attach="fog" args={["#0b0c0f", 7, 18]} />
      <hemisphereLight args={["#6d7a90", "#121318", 0.35]} />
      {/* piso de garaje + pared de pegboard al fondo, todo en penumbra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial map={tx.concrete} color="#8a8d92" roughness={0.75} metalness={0.05} /></mesh>
      <mesh position={[0, 2.5, -3]} receiveShadow><planeGeometry args={[16, 5]} /><meshStandardMaterial color="#b08d62" roughness={1} /></mesh>
      {Array.from({ length: 34 }, (_, i) => Array.from({ length: 10 }, (_, j) => (
        <mesh key={i + "_" + j} position={[-7.6 + i * 0.46, 0.4 + j * 0.46, -2.99]}><circleGeometry args={[0.03, 8]} /><meshBasicMaterial color="#3b2c1c" /></mesh>
      )))}
      {/* tablero eléctrico de Gary en la pared */}
      <mesh position={[3.9, 2.0, -2.97]} castShadow geometry={rbox(0.8, 1.1, 0.12, 0.02)}><meshStandardMaterial color="#8d9196" metalness={0.5} roughness={0.4} /></mesh>
      <pointLight position={[0, 3.5, 4]} intensity={2.5} distance={12} color="#8ea6d4" />
      <Ped x={PED[0][0]} on={on[0]} col="#ff5a3d" />
      <Ped x={PED[1][0]} on={on[1]} col="#7fd8ff" />
      <Ped x={PED[2][0]} on={on[2]} col="#ffc04a" />
      <Generator p={[PED[0][0], TOP + 0.03, 0]} rotY={0.5} run={run} t={t} scale={1.2} />
      <Exhaust t={t} from={[PED[0][0] - 0.25, TOP + 0.2, -0.2]} dir={[-0.5, 0.5, -0.2]} run={run * 0.6} map={tx.flake} n={60} />
      <PowerStation p={[PED[1][0], TOP + 0.03, 0]} rotY={-0.25} pct={pct} glow={0.25 + 0.75 * on[1]} scale={2.0} />
      <CarBattery p={[PED[2][0], TOP + 0.03, 0]} rotY={-0.45} scale={1.9} />
    </ThreeCanvas>
  );
};
