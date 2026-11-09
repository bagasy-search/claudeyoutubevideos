// ohf8pc · EL MUNDO: el zaguán, la puerta de roble y su pie. world.json = {cams:[[t,"nombre"]], fx:[[t,{g?,s?}]]}: g = cuánto se cerró la rendija (0 abierta, 1 sellada), s = puerta vencida.
// Luces siempre montadas, sin escala 0 ni caras coplanares; la cámara viaja en arco entre paradas y deriva dentro de cada una.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";
import { M, RBox, lerp } from "./h3d";
import { V3 } from "./okit";
import { Cold, DW, Frame, Leaf, Light, Saddle, Sweep } from "./doorkit";
import WJ from "./world.json";

type C = { p0: V3; p1: V3; l0: V3; l1: V3; f0: number; f1: number };
export const CAMS: Record<string, C> = {
  hall: { p0: [-2.6, 1.4, 3.6], p1: [-1.9, 1.3, 3.2], l0: [0, 0.85, 0], l1: [0.1, 0.8, 0], f0: 42, f1: 40 },
  foot: { p0: [0.6, 0.16, 1.1], p1: [0.3, 0.13, 0.9], l0: [0, 0.08, 0], l1: [0, 0.08, 0], f0: 34, f1: 30 },
  lightl: { p0: [-0.9, 0.07, 0.36], p1: [-0.7, 0.06, 0.3], l0: [0.4, 0.06, 0.02], l1: [0.4, 0.06, 0.02], f0: 32, f1: 28 },
  corner: { p0: [-0.25, 0.22, 0.5], p1: [-0.33, 0.18, 0.38], l0: [-0.46, 0.08, 0.02], l1: [-0.46, 0.08, 0.02], f0: 30, f1: 26 },
  hinge: { p0: [-0.2, 1.85, 0.7], p1: [-0.3, 1.8, 0.55], l0: [-0.46, 1.76, 0.02], l1: [-0.46, 1.76, 0.02], f0: 32, f1: 28 },
  top: { p0: [0.4, 2.0, 0.9], p1: [0.2, 1.98, 0.7], l0: [0, 2.03, 0], l1: [0, 2.03, 0], f0: 34, f1: 30 },
  saddle: { p0: [0, 0.5, 0.7], p1: [0.12, 0.4, 0.52], l0: [0, 0.04, 0.04], l1: [0, 0.04, 0.04], f0: 36, f1: 32 },
  room: { p0: [1.8, 1.5, 4.2], p1: [0.6, 1.25, 3.8], l0: [-0.2, 0.7, 0], l1: [0, 0.6, 0], f0: 44, f1: 42 },
};
type Fx = { g?: number; s?: number };
type Stop = [number, string];
const WJS = WJ as unknown as { cams: Stop[]; fx?: [number, Fx][] };
const ST = (WJS.cams ?? [[0, "hall"]]).filter((s) => CAMS[s[1]]);
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
  const i = idx(t), s = ST[i] ?? [0, "hall"], nx = ST[i + 1]?.[0] ?? s[0] + 30, cur = stopAt(CAMS[s[1]], t - s[0], Math.max(6, nx - s[0]), i);
  if (i === 0) return cur;
  const ps = ST[i - 1], prev = stopAt(CAMS[ps[1]], s[0] - ps[0], Math.max(6, s[0] - ps[0]), i - 1);
  const D = Math.min(2.4, Math.max(1.1, (nx - s[0]) * 0.4)), k = ease((t - s[0]) / D), p = prev.p.clone().lerp(cur.p, k), l = prev.l.clone().lerp(cur.l, k);
  p.z += Math.sin(Math.PI * k) * Math.min(1.8, prev.p.distanceTo(cur.p) * 0.3);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const camSpeed = (t: number) => { const a = camAt(t), b = camAt(t + 1 / 30), d = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25; return { bx: Math.min(10, d * 0.4), by: Math.min(7, d * 0.2) }; };
const fxAt = (t: number, key: keyof Fx) => { let prev = 0, cur = 0, a = -99; for (const [ft, kv] of FX) { if (ft > t) break; const v = kv[key]; if (v !== undefined) { prev = cur; cur = v; a = ft; } } return prev + (cur - prev) * sm((t - a) / 3); };

const CamApply: React.FC<{ t: number }> = ({ t }) => { const { camera } = useThree(); const c = camAt(t); camera.position.copy(c.p); camera.lookAt(c.l); (camera as THREE.PerspectiveCamera).fov = c.fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix(); return null; };

export const Hall: React.FC<{ t: number }> = ({ t }) => {
  const g = fxAt(t, "g"), s = fxAt(t, "s"), sag = 0.014 * s, open = 1 - g, a = lerp(0.012, 0.008, s) * open, b = lerp(0.012, 0.03, s) * open, sweepK = Math.min(1, g * 2.5);
  return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
    <CamApply t={t} />
    <Post bloom={0.12} threshold={0.97} exposure={0.92} env={0.5} />
    <color attach="background" args={["#14110e"]} />
    <hemisphereLight args={["#f2e6d2", "#54402c", 0.5]} />
    <spotLight position={[1.4, 2.7, 3.2]} angle={0.95} penumbra={0.8} intensity={34} distance={12} castShadow color="#ffe9c9" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
    <pointLight position={[-1.6, 1.1, 2.2]} intensity={5} distance={7} color="#ffdcae" />
    {Array.from({ length: 24 }, (_, i) => <RBox key={i} s={[0.195, 0.04, 7]} p={[-2.3 + i * 0.2, -0.021, 3.0]} r={0.004}>{M.wood({ base: [146 - (i % 3) * 8, 106 - (i % 3) * 6, 66], rx: 1 + (i % 4), ry: 1 })}</RBox>)}
    {[-1, 1].map((d) => <RBox key={d} s={[2.2, 3.0, 0.1]} p={[d * (DW / 2 + 0.13 + 1.1), 1.5, -0.1]} r={0.01}><meshStandardMaterial color="#d8c9ad" roughness={0.9} /></RBox>)}
    <RBox s={[1.3, 0.8, 0.1]} p={[0, 2.62, -0.1]} r={0.01}><meshStandardMaterial color="#d8c9ad" roughness={0.9} /></RBox>
    {[-1, 1].map((d) => <RBox key={"z" + d} s={[2.18, 0.18, 0.03]} p={[d * (DW / 2 + 0.14 + 1.1), 0.09, -0.035]} r={0.006}><meshStandardMaterial color="#ece6d6" roughness={0.55} /></RBox>)}
    <mesh position={[0, 1, -0.2]}><planeGeometry args={[1.25, 2.2]} /><meshBasicMaterial color="#ffd38c" toneMapped={false} /></mesh>
    <Saddle p={[0, 0, 0.02]} d={0.16} scoop={lerp(0.006, 0.0005, g)} />
    <Leaf sag={sag} p={[0, 0.056, 0]} />
    <Frame />
    {open > 0.03 && <Light a={a} b={b} y={0.05} z={0.03} />}
    {sweepK > 0.05 && <group position={[0, 0.082 + (1 - sweepK) * 0.5, 0.037]}><Sweep w={DW - 0.03} bend={0.08} /></group>}
    <Cold tt={t} x0={-0.4} x1={0.4} z0={0.05} z1={2.6} y={0.06} k={open * 0.85} n={15} />
    <RBox s={[1.2, 0.012, 2.1]} p={[0.1, 0.007, 2.3]} r={0.004}><meshStandardMaterial color="#7d3a30" roughness={1} /></RBox>
    <RBox s={[0.9, 0.06, 0.34]} p={[1.65, 0.8, 0.12]} r={0.008}>{M.wood({ base: [116, 76, 42] })}</RBox>
    {[-0.38, 0.38].map((x) => <RBox key={x} s={[0.05, 0.78, 0.05]} p={[1.65 + x, 0.39, 0.12]} r={0.006}>{M.wood({ base: [116, 76, 42] })}</RBox>)}
    <mesh position={[1.65, 0.97, 0.12]}><cylinderGeometry args={[0.07, 0.1, 0.28, 24]} /><meshStandardMaterial color="#e9dcc0" roughness={0.6} /></mesh>
    <mesh position={[1.65, 1.2, 0.12]}><cylinderGeometry args={[0.13, 0.22, 0.22, 28, 1, true]} /><meshStandardMaterial color="#fff0cf" roughness={0.6} side={THREE.DoubleSide} emissive="#f2c78a" emissiveIntensity={0.55} /></mesh>
    <mesh position={[-1.5, 0.95, 0.15]}><cylinderGeometry args={[0.026, 0.03, 1.9, 16]} />{M.wood({ base: [96, 62, 34] })}</mesh>
    <RBox s={[0.34, 0.8, 0.14]} p={[-1.5, 1.2, 0.26]} r={0.04}><meshStandardMaterial color="#3d4a58" roughness={0.95} /></RBox>
  </ThreeCanvas>;
};
export const World: React.FC<{ t: number }> = ({ t }) => <Hall t={t} />;
