// ohf8pa · EL MUNDO: la casa en corte con su sistema de aire forzado. El caudal de cada rama y la temperatura de cada cuarto
// dependen de «b» (0 = todo abierto como hace 60 años, 1 = balanceada). world.json = {cams:[[t,"nombre"]], fx:[[t,{b}]]}.
// Luces siempre montadas, sin escala 0 ni caras coplanares; la cámara viaja en arco entre paradas y deriva dentro de cada una.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";
import { M, RBox, lerp, rn, tex } from "./h3d";
import { FlowPath, Tape, V3 } from "./okit";
import WJ from "./world.json";

type C = { p0: V3; p1: V3; l0: V3; l1: V3; f0: number; f1: number };
export const CAMS: Record<string, C> = {
  house: { p0: [1.2, 1.1, 9.4], p1: [-0.6, 0.8, 8.4], l0: [0, 0.2, -0.4], l1: [0, 0.1, -0.4], f0: 42, f1: 40 },
  kitchen: { p0: [-0.2, 1.4, 3.6], p1: [-1.0, 1.15, 3.0], l0: [-2.1, 0.75, -0.7], l1: [-2.3, 0.7, -0.7], f0: 40, f1: 36 },
  back: { p0: [1.2, 3.9, 3.8], p1: [2.0, 3.65, 3.1], l0: [3.0, 3.3, -0.7], l1: [3.05, 3.25, -0.7], f0: 40, f1: 36 },
  furnace: { p0: [-1.3, -1.5, 3.2], p1: [-1.9, -1.75, 2.6], l0: [-3.0, -1.4, -0.1], l1: [-3.0, -1.3, -0.1], f0: 40, f1: 36 },
  trunk: { p0: [-1.4, -1.75, 2.8], p1: [1.4, -1.65, 2.5], l0: [-0.8, -0.55, 0], l1: [1.6, -0.55, 0], f0: 42, f1: 38 },
  branch1: { p0: [-2.18, -0.27, 1.14], p1: [-2.09, -0.29, 0.88], l0: [-2.0, -0.2, 0.08], l1: [-2.0, -0.21, 0.08], f0: 40, f1: 34 },
  branch4: { p0: [3.24, -0.27, 1.14], p1: [3.13, -0.29, 0.88], l0: [3.0, -0.2, 0.08], l1: [3.0, -0.21, 0.08], f0: 40, f1: 34 },
  ret: { p0: [1.4, 0.9, 2.8], p1: [0.8, 0.8, 2.3], l0: [0.3, 0.4, -1.2], l1: [0.25, 0.42, -1.2], f0: 38, f1: 34 },
};
type Stop = [number, string];
const WJS = WJ as unknown as { cams: Stop[]; fx?: [number, { b?: number }][] };
const ST = (WJS.cams ?? [[0, "house"]]).filter((s) => CAMS[s[1]]);
const FX = WJS.fx ?? [];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const k = cl(x); return k * k * (3 - 2 * k); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const UP = new THREE.Vector3(0, 1, 0);
const stopAt = (c: C, u: number, dur: number, i = 0) => {
  const k = sm(u / dur), p = v3(c.p0).lerp(v3(c.p1), k), l = v3(c.l0).lerp(v3(c.l1), k);
  const d = l.clone().sub(p).normalize(), r = d.clone().cross(UP).normalize(), w = sm(u / 1.5);
  p.addScaledVector(r, 0.08 * Math.sin(u * 0.45 + i) * w).addScaledVector(d, Math.min(0.16, 0.012 * u));
  l.addScaledVector(r, 0.1 * Math.sin(u * 0.45 + i + 0.7) * w).addScaledVector(UP, 0.03 * Math.sin(u * 0.3 + i) * w);
  return { p, l, fov: c.f0 + (c.f1 - c.f0) * k };
};
const idx = (t: number) => { let i = 0; while (i < ST.length - 1 && ST[i + 1][0] <= t) i++; return i; };
export const camAt = (t: number) => {
  const i = idx(t), s = ST[i] ?? [0, "house"], nx = ST[i + 1]?.[0] ?? s[0] + 30, cur = stopAt(CAMS[s[1]], t - s[0], Math.max(6, nx - s[0]), i);
  if (i === 0) return cur;
  const ps = ST[i - 1], prev = stopAt(CAMS[ps[1]], s[0] - ps[0], Math.max(6, s[0] - ps[0]), i - 1);
  const D = Math.min(2.4, Math.max(1.1, (nx - s[0]) * 0.4)), k = ease((t - s[0]) / D), p = prev.p.clone().lerp(cur.p, k), l = prev.l.clone().lerp(cur.l, k);
  p.z += Math.sin(Math.PI * k) * Math.min(1.8, prev.p.distanceTo(cur.p) * 0.3);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const camSpeed = (t: number) => { const a = camAt(t), b = camAt(t + 1 / 30), d = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25; return { bx: Math.min(10, d * 0.4), by: Math.min(7, d * 0.2) }; };
const bAt = (t: number) => { let prev = 0, cur = 0, a = -99; for (const [ft, kv] of FX) { if (ft > t) break; if (kv.b !== undefined) { prev = cur; cur = kv.b; a = ft; } } return prev + (cur - prev) * sm((t - a) / 3); };

const CamSet: React.FC<{ t: number }> = ({ t }) => { const c = camAt(t); return <CamApply p={c.p} l={c.l} fov={c.fov} />; };
import { useThree } from "@react-three/fiber";
const CamApply: React.FC<{ p: THREE.Vector3; l: THREE.Vector3; fov: number }> = ({ p, l, fov }) => { const { camera } = useThree(); camera.position.copy(p); camera.lookAt(l); (camera as THREE.PerspectiveCamera).fov = fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix(); return null; };

const GALV = "#b8bec2";
const X = [-2, -0.5, 1, 3], TOP = [0, 0, 2.7, 2.7];
const TEMP0 = [74, 72, 68, 62], TEMP1 = [71, 71, 70, 68], FLOW0 = [1, 0.8, 0.42, 0.18], FLOW1 = [0.72, 0.72, 0.74, 0.74], SHUT = [0.55, 0.32, 0, 0];

const Room: React.FC<{ x: number; y: number; w: number; temp: number; children?: React.ReactNode }> = ({ x, y, w, temp, children }) => {
  const k = cl((temp - 60) / 16), col = new THREE.Color("#7fb2e8").lerp(new THREE.Color("#ffb46b"), k);
  return <group position={[x, y, 0]}>
    <mesh position={[0, 1.3, -1.2]} receiveShadow><planeGeometry args={[w, 2.6]} /><meshStandardMaterial map={tex.plaster("#d9cfbd", 3, 2)} roughness={0.92} /></mesh>
    <mesh position={[0, 1.3, -1.19]}><planeGeometry args={[w, 2.6]} /><meshBasicMaterial color={col} transparent opacity={0.16} depthWrite={false} toneMapped={false} /></mesh>
    <mesh position={[0, 0.002, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.6]} /><meshStandardMaterial map={tex.oak(3, 2)} roughness={0.55} /></mesh>
    {[-1, 1].map((d) => <mesh key={d} position={[(d * w) / 2, 1.3, 0.1]} rotation={[0, (-d * Math.PI) / 2, 0]} receiveShadow><planeGeometry args={[2.6, 2.6]} /><meshStandardMaterial map={tex.plaster("#cfc4b0", 2, 2)} roughness={0.92} /></mesh>)}
    {children}
    <Tape txt={`${Math.round(temp)}°`} p={[w * 0.28, 1.9, -1.15]} w={0.62} rot={[0, 0, -0.02]} col={temp < 66 ? "#1f5ea8" : temp > 72 ? "#b3261e" : "#1c2a3a"} />
  </group>;
};
const Win: React.FC<{ p: V3 }> = ({ p }) => <group position={p}>
  <RBox s={[0.84, 1.14, 0.05]} p={[0, 0, 0]} r={0.01}><meshStandardMaterial color="#e9e3d6" roughness={0.6} /></RBox>
  <mesh position={[0, 0, 0.03]}><planeGeometry args={[0.72, 1.02]} /><meshBasicMaterial color="#b9d0e6" toneMapped={false} /></mesh>
  <RBox s={[0.72, 0.03, 0.03]} p={[0, 0, 0.05]} r={0.004}><meshStandardMaterial color="#e9e3d6" roughness={0.6} /></RBox>
</group>;

export const DuctHouse: React.FC<{ t: number }> = ({ t }) => {
  const b = bAt(t), temps = TEMP0.map((v, i) => lerp(v, TEMP1[i], b)), fl = FLOW0.map((v, i) => lerp(v, FLOW1[i], b));
  return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
    <CamSet t={t} />
    <Post bloom={0.16} threshold={0.97} exposure={0.92} env={0.45} />
    <color attach="background" args={["#14120f"]} />
    <hemisphereLight args={["#e6ecf2", "#2a2420", 0.42]} />
    <spotLight position={[-2, 4.6, 6]} angle={0.8} penumbra={0.9} intensity={70} distance={16} castShadow color="#fff0dc" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
    <pointLight position={[-1, -1, 2]} intensity={7} distance={7} color="#ffd9a8" />
    <pointLight position={[2.5, 4, 2]} intensity={6} distance={7} color="#cfe2ff" />
    {/* sótano: pared de piedra y piso */}
    <mesh position={[0, -1.3, -1.2]} receiveShadow><planeGeometry args={[9, 2.6]} /><meshStandardMaterial map={tex.brick(9, 3)} color="#a39a8c" roughness={0.95} /></mesh>
    <mesh position={[0, -2.6, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[9, 2.6]} /><meshStandardMaterial map={tex.counter(5, 2)} roughness={0.8} /></mesh>
    {[-1, 1].map((d) => <mesh key={d} position={[d * 4.46, -1.325, 0.115]} rotation={[0, (-d * Math.PI) / 2, 0]} receiveShadow><planeGeometry args={[2.67, 2.65]} /><meshStandardMaterial map={tex.brick(3, 3)} color="#a39a8c" roughness={0.95} /></mesh>)}
    {Array.from({ length: 19 }, (_, i) => <RBox key={i} s={[0.09, 0.2, 2.5]} p={[-4.3 + i * 0.48, -0.12, 0.1]} r={0.006}>{M.wood({ base: [86, 56, 32] })}</RBox>)}
    {/* losas */}
    <RBox s={[9, 0.05, 2.7]} p={[0, -0.03, 0.1]} r={0.006}>{M.wood({ base: [110, 72, 42] })}</RBox>
    <RBox s={[9, 0.12, 2.7]} p={[0, 2.64, 0.1]} r={0.008}><meshStandardMaterial color="#cfc5b2" roughness={0.9} /></RBox>
    {/* cuartos */}
    <Room x={-2.5} y={0.02} w={3.6} temp={temps[0]}><RBox s={[1.6, 0.86, 0.5]} p={[-0.5, 0.45, -0.9]} r={0.02}><meshStandardMaterial color="#7a8a78" roughness={0.6} /></RBox><Win p={[1, 1.5, -1.16]} /></Room>
    <Room x={0.7} y={0.02} w={2.8} temp={temps[1]}><RBox s={[1.1, 0.72, 0.7]} p={[-0.4, 0.38, -0.6]} r={0.02}>{M.wood({ base: [120, 78, 44] })}</RBox><Win p={[0.5, 1.5, -1.16]} /></Room>
    <Room x={3.3} y={0.02} w={2.4} temp={lerp(71, 70.5, b)}><RBox s={[0.5, 2.05, 0.05]} p={[0.2, 1.03, -1.15]} r={0.01}>{M.wood({ base: [96, 62, 36] })}</RBox></Room>
    <Room x={-1.3} y={2.72} w={6} temp={temps[2]}><RBox s={[1.5, 0.45, 1.2]} p={[-1.4, 0.26, -0.5]} r={0.04}><meshStandardMaterial color="#b8a58c" roughness={0.8} /></RBox><Win p={[1.2, 1.5, -1.16]} /></Room>
    <Room x={3.1} y={2.72} w={2.8} temp={temps[3]}><RBox s={[1.2, 0.45, 1.4]} p={[-0.4, 0.26, -0.4]} r={0.04}><meshStandardMaterial color="#8d9aa8" roughness={0.8} /></RBox><Win p={[0.6, 1.5, -1.16]} /></Room>
    {/* horno, plenum y tronco */}
    <RBox s={[1, 1.75, 0.9]} p={[-3, -1.72, 0]} r={0.02}><meshStandardMaterial color="#c4b48a" roughness={0.65} metalness={0.15} /></RBox>
    <RBox s={[0.6, 0.02, 0.012]} p={[-3, -1.2, 0.46]} r={0.003}><meshStandardMaterial color="#3a3226" /></RBox>
    {Array.from({ length: 4 }, (_, i) => <RBox key={i} s={[0.5, 0.02, 0.012]} p={[-3, -1.92 - i * 0.07, 0.46]} r={0.003}><meshStandardMaterial color="#3a3226" /></RBox>)}
    <RBox s={[1.04, 0.6, 0.94]} p={[-3, -0.55, 0]} r={0.012}>{M.steel({ col: GALV })}</RBox>
    <RBox s={[6.1, 0.42, 0.56]} p={[0.0, -0.55, 0]} r={0.012}>{M.steel({ col: GALV })}</RBox>
    {[-2.2, -1, 0.2, 1.4, 2.6].map((x) => <RBox key={x} s={[0.012, 0.44, 0.58]} p={[x, -0.55, 0]} r={0.003}>{M.steel({ col: "#8e959a" })}</RBox>)}
    {/* ramas con su manija */}
    {X.map((x, i) => { const y1 = TOP[i] + 0.02, h = y1 + 0.34, shut = SHUT[i] * b;
      return <group key={i}>
        <mesh position={[x, -0.34 + h / 2, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, h, 28]} />{M.steel({ col: GALV })}</mesh>
        <group position={[x, -0.22, 0.1]} rotation={[0, 0, shut * Math.PI / 2 + 0.0]}>
          <RBox s={[0.018, 0.1, 0.012]} p={[0, 0, 0.02]} r={0.003}><meshStandardMaterial color="#d03a2a" roughness={0.4} /></RBox>
          <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.03, 12]} />{M.brass()}</mesh>
        </group>
        <RBox s={[0.34, 0.012, 0.24]} p={[x, y1 + 0.008, 0]} r={0.003}><meshStandardMaterial color="#2a2622" roughness={0.5} metalness={0.5} /></RBox>
        {Array.from({ length: 6 }, (_, j) => <RBox key={j} s={[0.3, 0.006, 0.014]} p={[x, y1 + 0.016, -0.085 + j * 0.034]} r={0.002}>{M.steel({ col: "#5c5852" })}</RBox>)}
        <FlowPath tt={t} pts={[[-3, -0.55, 0.0], [(x - 3) / 2, -0.55, 0.0], [x, -0.55, 0.0], [x, y1, 0], [x, y1 + 1.5 * fl[i] + 0.2, 0]]} n={Math.round(8 + 12 * fl[i])} k={0.25 + 0.75 * fl[i]} r={0.026} v={0.32} col="#ffb070" />
      </group>; })}
    {/* retorno en el hall (arriba del primer piso) */}
    <RBox s={[0.9, 0.62, 0.03]} p={[0.3, 0.55, -1.17]} r={0.006}><meshStandardMaterial color="#d8d2c4" roughness={0.6} /></RBox>
    {Array.from({ length: 9 }, (_, j) => <RBox key={j} s={[0.82, 0.018, 0.02]} p={[0.3, 0.32 + j * 0.058, -1.145]} r={0.002}><meshStandardMaterial color="#4a4238" /></RBox>)}
  </ThreeCanvas>;
};
export const World: React.FC<{ t: number }> = ({ t }) => <DuctHouse t={t} />;
