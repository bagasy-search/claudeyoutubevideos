// ohf8pb · EL MUNDO: la vereda de la casa en corte. Debajo de cada losa, lo que le pasa: la raíz, la helada, el agua que se lleva la tierra.
// world.json = {cams:[[t,"nombre"]], fx:[[t,{b?,f?,w?}]]}: b = obra (0 rota, 1 reparada), f = helada, w = lluvia.
// Luces siempre montadas, sin escala 0 ni caras coplanares; la cámara viaja en arco entre paradas y deriva dentro de cada una.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";
import { M, RBox, lerp, rn } from "./h3d";
import { FlowPath, Tape, V3 } from "./okit";
import { Bucket, CONC, Conc, PI, Slab, Trowel, Wedge, Y0, Yard } from "./slabkit";
import WJ from "./world.json";

type C = { p0: V3; p1: V3; l0: V3; l1: V3; f0: number; f1: number };
export const CAMS: Record<string, C> = {
  walk: { p0: [-5.2, 2.0, 5.6], p1: [-3.6, 1.7, 5.0], l0: [0.4, 0.5, -0.2], l1: [1.0, 0.45, -0.2], f0: 42, f1: 40 },
  lip: { p0: [-3.0, 0.85, 1.75], p1: [-2.75, 0.74, 1.4], l0: [-2.25, 0.5, 0.1], l1: [-2.25, 0.46, 0.1], f0: 34, f1: 30 },
  section: { p0: [-1.0, 0.55, 4.1], p1: [1.0, 0.5, 3.6], l0: [-0.4, 0.3, 0.3], l1: [1.1, 0.28, 0.3], f0: 40, f1: 37 },
  root: { p0: [-2.25, 0.34, 2.1], p1: [-1.1, 0.3, 1.8], l0: [-1.5, 0.28, 0.3], l1: [-1.45, 0.28, 0.3], f0: 36, f1: 32 },
  downspout: { p0: [3.1, 1.1, 2.6], p1: [2.3, 0.85, 2.1], l0: [1.5, 0.55, -0.3], l1: [1.5, 0.3, 0.2], f0: 40, f1: 36 },
  crack: { p0: [0.9, 1.75, 1.05], p1: [1.45, 1.5, 0.92], l0: [1.5, 0.5, 0.04], l1: [1.5, 0.5, 0.02], f0: 36, f1: 33 },
  edge: { p0: [4.3, 1.05, 1.7], p1: [3.8, 0.85, 1.4], l0: [3.0, 0.48, 0.24], l1: [3.05, 0.44, 0.26], f0: 36, f1: 33 },
  house: { p0: [-1.4, 3.1, 7.8], p1: [1.2, 2.5, 7.2], l0: [0.2, 1.4, -2.4], l1: [0.3, 1.3, -2.4], f0: 42, f1: 40 },
};
type Fx = { b?: number; f?: number; w?: number };
type Stop = [number, string];
const WJS = WJ as unknown as { cams: Stop[]; fx?: [number, Fx][] };
const ST = (WJS.cams ?? [[0, "walk"]]).filter((s) => CAMS[s[1]]);
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
  const i = idx(t), s = ST[i] ?? [0, "walk"], nx = ST[i + 1]?.[0] ?? s[0] + 30, cur = stopAt(CAMS[s[1]], t - s[0], Math.max(6, nx - s[0]), i);
  if (i === 0) return cur;
  const ps = ST[i - 1], prev = stopAt(CAMS[ps[1]], s[0] - ps[0], Math.max(6, s[0] - ps[0]), i - 1);
  const D = Math.min(2.4, Math.max(1.1, (nx - s[0]) * 0.4)), k = ease((t - s[0]) / D), p = prev.p.clone().lerp(cur.p, k), l = prev.l.clone().lerp(cur.l, k);
  p.z += Math.sin(Math.PI * k) * Math.min(1.8, prev.p.distanceTo(cur.p) * 0.3);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const camSpeed = (t: number) => { const a = camAt(t), b = camAt(t + 1 / 30), d = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25; return { bx: Math.min(10, d * 0.4), by: Math.min(7, d * 0.2) }; };
const fxAt = (t: number, key: keyof Fx) => { let prev = 0, cur = 0, a = -99; for (const [ft, kv] of FX) { if (ft > t) break; const v = kv[key]; if (v !== undefined) { prev = cur; cur = v; a = ft; } } return prev + (cur - prev) * sm((t - a) / 3); };

const CamApply: React.FC<{ t: number }> = ({ t }) => { const { camera } = useThree(); const c = camAt(t); camera.position.copy(c.p); camera.lookAt(c.l); (camera as THREE.PerspectiveCamera).fov = c.fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix(); return null; };

const CAP = Y0 + 0.02, W = 1.48, Z = 0.03;
const CrackTop: React.FC<{ pts: [number, number][]; w: number; col?: string }> = ({ pts, w, col = "#1b1916" }) => <>{pts.slice(0, -1).map((a, i) => { const b = pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz); return <RBox key={i} s={[l + 0.01, 0.003, w]} p={[(a[0] + b[0]) / 2, CAP + 0.0045, (a[1] + b[1]) / 2]} rot={[0, -Math.atan2(dz, dx), 0]} r={0.0008} shadow={false}><meshBasicMaterial color={col} /></RBox>; })}</>;

export const Walk: React.FC<{ t: number }> = ({ t }) => {
  const b = fxAt(t, "b"), f = fxAt(t, "f"), w = fxAt(t, "w"), ice = 0.1 * f, ramp = cl(b * 3), crackFill = cl(b * 3 - 1), coat = cl(b * 3 - 2), edgeOk = cl(b * 3 - 1.2);
  const col = (k: number) => "#" + new THREE.Color("#9b978c").lerp(new THREE.Color(CONC.fresh), k * coat).getHexString();
  return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
    <CamApply t={t} />
    <Post bloom={0.12} threshold={0.97} exposure={0.92} env={0.5} />
    <color attach="background" args={["#b9cbd8"]} />
    <hemisphereLight args={["#e9f0f6", "#6a5a48", 0.55]} />
    <spotLight position={[-4, 9, 8]} angle={0.9} penumbra={0.8} intensity={150} distance={30} castShadow color="#fff5e6" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
    <pointLight position={[1, 1.2, 4]} intensity={6} distance={9} color="#fff1dc" />
    <Yard w={18} />
    {/* la hilera de losas */}
    <Slab w={W} p={[-4.5, Y0 - 0.08, Z]} k="a0" col={col(1)} />
    <Slab w={W} p={[-3, Y0 - 0.08, Z]} k="a1" col={col(1)} />
    <group position={[-2.24, Y0 - 0.08, Z]} rotation={[0, 0, -0.05]}><Slab w={W} p={[0.74, 0.1, 0]} k="a2" col={col(1)} /></group>
    <Slab w={W} p={[0, Y0 - 0.08 + ice, Z]} rot={[0, 0, 0.012 * f]} k="a3" col={col(1)} />
    <group position={[1.5, Y0 - 0.1, Z]} rotation={[0, 0, -0.022]}><Slab w={W} p={[0, 0, 0]} k="a4" col={col(1)} /></group>
    <Slab w={W} p={[3, Y0 - 0.08, Z - 0.1]} d={0.46} k="a5" col={col(1)} />
    <Slab w={W - 0.5 + 0.5 * edgeOk} p={[3 - 0.25 + 0.25 * edgeOk, Y0 - 0.08, Z + 0.23]} d={0.2} k="a5b" col={edgeOk > 0.5 ? CONC.fresh : "#9b978c"} />
    <Slab w={W} p={[4.5, Y0 - 0.08, Z]} k="a6" col={col(1)} />
    {/* la rampa contra el dedo */}
    <Wedge l={1.3} h0={0.0008} h1={Math.max(0.002, 0.1 * ramp)} p={[-3.56, CAP, Z]} col={ramp > 0.6 ? CONC.fresh : "#a39f93"} k="w" />
    {/* la grieta de la losa 4 y el parche */}
    <group position={[1.5, 0, Z]}><CrackTop pts={[[-0.72, 0.22], [-0.42, 0.06], [-0.1, 0.1], [0.2, -0.08], [0.72, -0.2]]} w={lerp(0.05, 0.01, crackFill)} col={crackFill > 0.5 ? "#6d6a60" : "#1b1916"} /></group>
    {/* las piedritas del borde */}
    {edgeOk < 0.5 && [[3.42, 0.34], [3.7, 0.28], [3.56, 0.46], [3.32, 0.46], [3.76, 0.42]].map(([x, z], i) => <RBox key={i} s={[0.1 + i * 0.03, 0.08, 0.09]} p={[x, Y0 - 0.02, z]} rot={[i, i * 0.7, 0.3]} r={0.018}><Conc k="r" /></RBox>)}
    {/* la raíz bajo la losa 3 y el maple */}
    <mesh position={[-1.5, Y0 - 0.37, 0.36]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.14, 0.14, 0.03, 32]} /><meshStandardMaterial color="#7c5835" roughness={0.85} /></mesh>
    <mesh position={[-1.5, Y0 + 1.5, -2.2]} castShadow><cylinderGeometry args={[0.3, 0.42, 3.2, 24]} /><meshStandardMaterial color="#5e4630" roughness={0.9} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-1.5 + Math.cos(i * 0.7) * (0.9 + (i % 3) * 0.5), Y0 + 3.5 + Math.sin(i * 1.3) * 0.6, -2.2 + Math.sin(i * 0.7) * 0.8]} castShadow><sphereGeometry args={[0.95 + rn(i, 131) * 0.5, 16, 12]} /><meshStandardMaterial color={i % 2 ? "#5a7a3c" : "#4d6c34"} roughness={0.95} /></mesh>)}
    {/* la helada bajo la losa 4 */}
    {f > 0.01 && <RBox s={[1.25, Math.max(0.006, ice + 0.01), 0.03]} p={[0, Y0 - 0.19 + ice / 2, 0.355]} r={0.003} shadow={false}><meshPhysicalMaterial color="#d3ecfb" roughness={0.12} clearcoat={1} transparent opacity={0.92} /></RBox>}
    {/* el caño y el hueco de la lavada */}
    <mesh position={[1.75, Y0 - 0.3, 0.357]}><planeGeometry args={[1.0, 0.2]} /><meshBasicMaterial color="#22170f" toneMapped={false} /></mesh>
    <RBox s={[0.14, 2.4, 0.1]} p={[1.9, Y0 + 1.2, -0.7]} r={0.016}>{M.steel({ col: "#c8cbc4" })}</RBox>
    <group position={[1.9, Y0 + 0.08, -0.65]} rotation={[0, b > 0.15 ? -1.1 : 0, 0]}><RBox s={[0.13, 0.09, b > 0.15 ? 1.4 : 0.34]} p={[0, 0, b > 0.15 ? 0.7 : 0.17]} r={0.015}>{M.steel({ col: "#c8cbc4" })}</RBox></group>
    {b <= 0.15 && <FlowPath tt={t} pts={[[1.9, Y0 + 0.08, -0.32], [1.86, Y0 + 0.04, 0.0], [1.8, Y0 - 0.04, 0.3], [1.5, Y0 - 0.28, 0.36], [1.0, Y0 - 0.3, 0.37]]} n={18} k={0.2 + 0.8 * w} r={0.022} v={0.5} col="#7db8df" />}
    {w > 0.02 && Array.from({ length: 80 }, (_, i) => { const u = (t * 1.6 + rn(i, 141)) % 1; return <RBox key={i} s={[0.004, 0.12, 0.004]} p={[-6 + rn(i, 142) * 12, Y0 + 3 - 3 * u, -1.6 + rn(i, 143) * 3]} r={0.001} shadow={false}><meshBasicMaterial color="#d3e2ef" transparent opacity={0.55 * w} depthWrite={false} toneMapped={false} /></RBox>; })}
    {/* el rincón de trabajo */}
    <Bucket p={[-0.6, Y0, -0.7]} />
    <Trowel p={[-0.3, Y0 + 0.02, -0.55]} rot={[0, 0.8, 0]} s={1.2} />
    <Tape txt="1 INCH" col="#b3261e" p={[-2.25, Y0 + 0.62, Z]} w={0.34} k={1 - ramp} rev={1 - ramp} />
  </ThreeCanvas>;
};
export const World: React.FC<{ t: number }> = ({ t }) => <Walk t={t} />;
