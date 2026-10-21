// ortega01 · EL MUNDO: la casa del comandante Ortega en Guadalajara, en corte (maqueta de arquitecto, frente abierto).
// Planta baja: patio con barda y naranjo (izq) · cocina · sala con escalera · cochera con zaguán verde (der).
// Planta alta: recámara principal (buró, cama, clóset, cómoda) · cuarto de los nietos. Azotea con tinaco.
// Media mañana de sol. El RATERO (figura de capucha) recorre la casa con su RUTA roja que se dibuja; los escondites
// se marcan con pines verdes (nunca busca) y rojos (siempre busca). UNA cámara para todo el minuto, nunca corta.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- CÁMARA: keyframes que arma Min1 (con at()) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
let KEYS: Key[] = [{ t: 0, p: [0, 8, 22], l: [-2, 2, 0], fov: 40 }];
// Min1 y Rest suman sus keyframes (cada uno los suyos, ordenados por tiempo)
let KSET = false;
export const setKeys = (k: Key[]) => { KEYS = [...(KSET ? KEYS : []), ...k].sort((a, b) => a.t - b.t); KSET = true; };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.05; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- RUTA DEL RATERO (posición por tiempo, la arma Min1 con at()) ----------------
export type RP = { t: number; p: V3; ry?: number; pose?: "walk" | "climb" | "crouch" | "reach" };
let ROUTE: RP[] = [];
export const setRoute = (r: RP[]) => { ROUTE = [...ROUTE, ...r].sort((a, b) => a.t - b.t); };
const routeAt = (t: number) => {
  if (!ROUTE.length) return null;
  if (t <= ROUTE[0].t) return { ...ROUTE[0], k: 0, moving: false };
  let i = 0; while (i < ROUTE.length - 1 && ROUTE[i + 1].t <= t) i++;
  const a = ROUTE[i], b = ROUTE[Math.min(i + 1, ROUTE.length - 1)];
  const k = b.t > a.t ? sm((t - a.t) / (b.t - a.t)) : 1;
  const p: V3 = [lerp(a.p[0], b.p[0], k), lerp(a.p[1], b.p[1], k), lerp(a.p[2], b.p[2], k)];
  const ry = lerp(a.ry ?? 0, b.ry ?? a.ry ?? 0, k);
  const moving = b !== a && k > 0 && k < 1 && Math.hypot(b.p[0] - a.p[0], b.p[2] - a.p[2]) > 0.2;
  return { t, p, ry, pose: (k < 0.5 ? a.pose : b.pose) ?? "walk", k, moving };
};
// puntos de la ruta muestreados (para la estela roja que se dibuja)
const routePts = (t0: number, t: number) => { const out: THREE.Vector3[] = []; for (let x = t0; x <= t; x += 0.08) { const r = routeAt(x); if (r) out.push(new THREE.Vector3(r.p[0], r.p[1] + 0.04, r.p[2])); } return out; };

// figura del ratero: capucha gris oscuro, guantes negros, sin cara (sombra dentro de la capucha)
const Thief: React.FC<{ t: number }> = ({ t }) => {
  const r = routeAt(t); if (!r) return null;
  const sw = r.moving ? Math.sin(t * 11) : 0;
  const climb = r.pose === "climb", crouch = r.pose === "crouch", reach = r.pose === "reach";
  const hood = "#2b2e33", pants = "#15171b", glove = "#0b0b0c";
  const dy = crouch ? -0.35 : 0;
  return (
    <group position={r.p} rotation={[0, r.ry, 0]}>
      <group position={[0, dy, 0]}>
        {/* piernas */}
        {[-1, 1].map((s) => (
          <mesh key={s} castShadow position={[s * 0.11, 0.42 + (climb && s > 0 ? 0.25 : 0), (r.moving ? s * sw * 0.12 : 0) + (climb && s > 0 ? 0.25 : 0)]} rotation={[(r.moving ? -s * sw * 0.45 : 0) + (climb && s > 0 ? -1.2 : 0) + (crouch ? -0.6 : 0), 0, 0]}>
            <capsuleGeometry args={[0.085, 0.62, 6, 10]} /><meshStandardMaterial color={pants} roughness={0.9} />
          </mesh>
        ))}
        {/* torso con capucha */}
        <mesh castShadow position={[0, 1.12, 0]} rotation={[crouch ? 0.35 : reach ? 0.25 : 0, 0, 0]}><capsuleGeometry args={[0.2, 0.45, 6, 12]} /><meshStandardMaterial color={hood} roughness={0.95} /></mesh>
        <mesh castShadow position={[0, 1.62, crouch ? 0.12 : 0.02]}><sphereGeometry args={[0.15, 16, 12]} /><meshStandardMaterial color={hood} roughness={0.95} /></mesh>
        <mesh position={[0, 1.6, 0.11 + (crouch ? 0.12 : 0)]}><sphereGeometry args={[0.095, 12, 10]} /><meshStandardMaterial color="#050505" roughness={1} /></mesh>
        {/* brazos y guantes */}
        {[-1, 1].map((s) => {
          const up = climb ? -2.6 : reach ? -1.3 : (r.moving ? s * sw * 0.5 : 0);
          return (
            <group key={s} position={[s * 0.27, 1.38, 0]} rotation={[up, 0, s * 0.12]}>
              <mesh castShadow position={[0, -0.27, 0]}><capsuleGeometry args={[0.065, 0.42, 6, 10]} /><meshStandardMaterial color={hood} roughness={0.95} /></mesh>
              <mesh castShadow position={[0, -0.56, 0]}><sphereGeometry args={[0.075, 10, 8]} /><meshStandardMaterial color={glove} roughness={0.5} /></mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// estela roja de la ruta (tubo que se va dibujando) + huellas
const Trail: React.FC<{ t: number; t0: number; o: number }> = ({ t, t0, o }) => {
  const pts = routePts(t0, t);
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  if (pts.length < 2 || o < 0.01) return null;
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.TubeGeometry(curve, Math.max(8, pts.length * 2), 0.035, 6, false);
  void geo;
  return (
    <group>
      <mesh geometry={tube}><meshBasicMaterial color="#ff3a2e" transparent opacity={0.9 * o} toneMapped={false} /></mesh>
      {pts.filter((_, i) => i % 4 === 0).map((p, i) => <mesh key={i} position={[p.x, p.y - 0.03, p.z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.07, 12]} /><meshBasicMaterial color="#ff5a3a" transparent opacity={0.55 * o} toneMapped={false} /></mesh>)}
    </group>
  );
};

// pin 3D (esfera + aguja + anillo que late): verde = nunca busca, rojo = siempre busca
export type Pin = { p: V3; at: number; col: "g" | "r"; out?: number };
let PINS: Pin[] = [];
export const setPins = (p: Pin[]) => { PINS = [...PINS, ...p]; };
const PinMesh: React.FC<{ t: number; pin: Pin }> = ({ t, pin }) => {
  const k = sm((t - pin.at) / 0.25) * (1 - sm((t - (pin.out ?? 1e9)) / 0.3));
  if (k <= 0.01) return null;
  const c = pin.col === "g" ? "#43e07f" : "#ff3b2f";
  const bob = Math.sin((t - pin.at) * 3) * 0.04;
  const ph = ((t - pin.at) * 1.1) % 1;
  return (
    <group position={pin.p} scale={k * 1.9}>
      <mesh position={[0, 0.32 + bob, 0]}><sphereGeometry args={[0.11, 18, 14]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.6} roughness={0.3} /></mesh>
      <mesh position={[0, 0.16 + bob, 0]}><coneGeometry args={[0.05, 0.22, 10]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={0.6 + ph * 1.8}><ringGeometry args={[0.15, 0.19, 40]} /><meshBasicMaterial color={c} transparent opacity={(1 - ph) * 0.8} toneMapped={false} depthWrite={false} /></mesh>
    </group>
  );
};

// ---------------- piezas de la casa ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
// muro con canto claro en el corte (espesor visible, maqueta de arquitecto)
const Slab: React.FC<{ p: V3; s: V3; c: string; cut?: string; map?: Tx }> = ({ p, s, c, cut = "#efe6d6", map }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.92} map={map} /></mesh>
    <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>
  </group>
);
// ventana con herrería negra (rejas con volutas) y vidrio que deja entrar el sol
const Barred: React.FC<{ p: V3; w?: number; h?: number; rotY?: number }> = ({ p, w = 1.2, h = 1.1, rotY = 0 }) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial color="#cfe6ff" toneMapped={false} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <Box key={i} p={[-w / 2 + (i + 0.5) * (w / 6), 0, 0.06]} s={[0.025, h, 0.025]} c="#141414" r={0.4} m={0.6} rad={0.01} />)}
    {[-h / 2, -h / 6, h / 6, h / 2].map((y, i) => <Box key={"h" + i} p={[0, y, 0.06]} s={[w, 0.03, 0.03]} c="#141414" r={0.4} m={0.6} rad={0.01} />)}
    {[-0.3, 0.3].map((x) => <mesh key={x} position={[x * w, h / 3, 0.07]}><torusGeometry args={[0.07, 0.012, 6, 18]} /><meshStandardMaterial color="#141414" metalness={0.6} roughness={0.4} /></mesh>)}
  </group>
);
// rayo de sol con polvo que entra por la ventana (aditivo)
const Ray: React.FC<{ p: V3; rot: V3; len: number; w: number; o: number }> = ({ p, rot, len, w, o }) => o < 0.01 ? null : (
  <mesh position={p} rotation={rot}><cylinderGeometry args={[w * 0.6, w, len, 24, 1, true]} />
    <meshBasicMaterial color="#ffe2a8" transparent opacity={o * 0.09} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
);
// casa vecina de Guadalajara: cubo de azotea plana, color vivo, tinaco, herrería
const Vecina: React.FC<{ x: number; z: number; w: number; h: number; c: string; i: number; flip?: boolean }> = ({ x, z, w, h, c, i, flip }) => (
  <group position={[x, 0, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
    <Box p={[0, h / 2, 0]} s={[w, h, 6]} c={c} r={0.95} rad={0.03} />
    <Box p={[0, h + 0.12, 0]} s={[w + 0.15, 0.24, 6.15]} c="#e8e1d4" r={0.9} />
    <mesh position={[w * 0.25 * (rnd(i, 2) > 0.5 ? 1 : -1), h + 0.75, -1.5]} castShadow><cylinderGeometry args={[0.55, 0.55, 1.1, 20]} /><meshStandardMaterial color="#1c1d20" roughness={0.6} /></mesh>
    {[-w / 4, w / 4].map((wx, k) => (
      <group key={k} position={[wx, h * (k ? 0.68 : 0.32), 3.01]}>
        <mesh><planeGeometry args={[1.1, 1.0]} /><meshStandardMaterial color="#2a3640" roughness={0.2} metalness={0.4} /></mesh>
        {Array.from({ length: 5 }, (_, j) => <Box key={j} p={[-0.44 + j * 0.22, 0, 0.05]} s={[0.025, 1.0, 0.025]} c="#141414" rad={0.01} />)}
      </group>
    ))}
    <Box p={[w * 0.3, 1.15, 3.02]} s={[1.1, 2.3, 0.06]} c={["#3d6b4f", "#7a3b2e", "#2f4f86", "#6b5a2e"][i % 4]} r={0.6} />
  </group>
);
// jacaranda (copa lila)
const Jaca: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.13, 0.2, 2.8, 8]} /><meshStandardMaterial color="#4a3a2c" roughness={1} /></mesh>
    {[[0, 3.2, 0, 1.4], [0.9, 3.0, 0.3, 1.0], [-0.8, 3.1, -0.2, 1.1], [0.2, 3.8, -0.4, 0.9]].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow><icosahedronGeometry args={[r, 1]} /><meshStandardMaterial color={["#9b7fd6", "#8a6cc9", "#a98ae0", "#7f63c0"][i]} roughness={0.95} flatShading /></mesh>
    ))}
  </group>
);
// naranjo en maceta de barro (el escondite del comandante)
const Naranjo: React.FC<{ p: V3; glow: number; lift: number }> = ({ p, glow, lift }) => (
  <group position={p}>
    <mesh position={[0, 0.38, 0]} castShadow receiveShadow><cylinderGeometry args={[0.46, 0.34, 0.76, 28]} /><meshStandardMaterial color="#b4613a" roughness={0.85} emissive="#ffb257" emissiveIntensity={glow * 0.35} /></mesh>
    <mesh position={[0, 0.77, 0]}><cylinderGeometry args={[0.47, 0.47, 0.06, 28]} /><meshStandardMaterial color="#9c5232" roughness={0.9} /></mesh>
    <group position={[0, lift * 0.35, 0]}>
      <mesh position={[0, 0.76, 0]}><cylinderGeometry args={[0.42, 0.42, 0.04, 24]} /><meshStandardMaterial color="#3b2a1f" roughness={1} /></mesh>
      <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.04, 0.06, 0.9, 8]} /><meshStandardMaterial color="#5b4230" /></mesh>
      {[[0, 1.95, 0, 0.62], [0.38, 1.75, 0.15, 0.42], [-0.36, 1.8, -0.1, 0.45], [0.05, 2.35, -0.12, 0.42], [-0.1, 1.7, 0.36, 0.4], [0.15, 1.75, -0.38, 0.4]].map(([x, y, z, r], i) => (
        <mesh key={"f" + i} position={[x, y, z]} castShadow><icosahedronGeometry args={[r, 2]} /><meshStandardMaterial color={["#2f6b34", "#3a7d3c", "#2a5f2f", "#43873f", "#336f36", "#2c6532"][i]} roughness={0.85} flatShading /></mesh>
      ))}
      {Array.from({ length: 16 }, (_, i) => { const a = i * 2.4, r = 0.62 + rnd(i, 4) * 0.12; return <mesh key={i} position={[Math.cos(a) * r, 1.55 + rnd(i, 3) * 0.85, Math.sin(a) * r]} castShadow><sphereGeometry args={[0.075, 12, 10]} /><meshStandardMaterial color="#ff8c1a" roughness={0.45} /></mesh>; })}
    </group>
  </group>
);

// ---------------- LA ESCENA ----------------
export const CasaWorld: React.FC<{ t: number; trail?: [number, number]; thief?: boolean; naranjo?: { glow: number; lift: number }; zaguan?: number }> = ({ t, trail, thief = true, naranjo = { glow: 0, lift: 0 }, zaguan = 0 }) => {
  const tx = useTextures();
  const sun = new THREE.Vector3(-14, 22, 16);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.3} threshold={0.95} exposure={0.88} env={0.28} />
      <color attach="background" args={["#7fb0e2"]} />
      <fog attach="fog" args={["#a9c7e6", 40, 110]} />
      <hemisphereLight args={["#cfe2ff", "#8c7a62", 0.6]} />
      <directionalLight position={sun.toArray()} intensity={3.0} color="#ffecc8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* relleno cálido dentro de los cuartos (el corte se lee) */}
      <pointLight position={[-3.2, 2.2, 1.6]} intensity={5} distance={7} color="#ffd9a8" />
      <pointLight position={[1.2, 2.2, 1.6]} intensity={4} distance={7} color="#ffd9a8" />
      <pointLight position={[-3.2, 5.2, 1.6]} intensity={5} distance={7} color="#ffd9a8" />
      <pointLight position={[1.2, 5.2, 1.6]} intensity={4} distance={7} color="#ffe6c4" />

      {/* terreno, banqueta y calle empedrada */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[220, 220]} /><meshStandardMaterial color="#b9ab92" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 4.0]} receiveShadow><planeGeometry args={[220, 2.2]} /><meshStandardMaterial map={tx.concrete} color="#d6cfc2" roughness={0.95} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 8.6]} receiveShadow><planeGeometry args={[220, 7]} /><meshStandardMaterial map={tx.cobble} roughness={0.95} /></mesh>

      {/* ===== PATIO (x -11..-5.5) con barda naranja, naranjo, tendedero, tambo azul ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.25, 0.02, 0]} receiveShadow><planeGeometry args={[5.5, 5.2]} /><meshStandardMaterial map={tx.concrete} color="#cfc8bb" roughness={0.9} /></mesh>
      <Box p={[-11.05, 1.1, 0]} s={[0.2, 2.2, 5.4]} c="#c9773d" map={tx.brick} r={0.95} rad={0.02} />
      <Box p={[-8.25, 1.1, -2.65]} s={[5.8, 2.2, 0.2]} c="#c9773d" map={tx.brick} r={0.95} rad={0.02} />
      <Box p={[-11.05, 2.24, 0]} s={[0.26, 0.08, 5.4]} c="#e2d6c2" />
      <Box p={[-8.25, 2.24, -2.65]} s={[5.8, 0.08, 0.26]} c="#e2d6c2" />
      <Naranjo p={[-10.1, 0, -1.85]} glow={naranjo.glow} lift={naranjo.lift} />
      <mesh position={[-6.4, 0.45, -2.0]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.9, 24]} /><meshStandardMaterial color="#1f5fbf" roughness={0.5} /></mesh>
      {[-1.2, 1.6].map((z) => <mesh key={z} position={[-6.2, 1.1, z]}><cylinderGeometry args={[0.02, 0.02, 2.2, 6]} /><meshStandardMaterial color="#666" metalness={0.6} /></mesh>)}
      <mesh position={[-6.2, 2.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 2.8, 4]} /><meshStandardMaterial color="#ddd" /></mesh>
      {[-0.6, 0.6].map((z, i) => <mesh key={z} position={[-6.2, 1.75, z]} rotation={[0, Math.PI / 2, Math.sin(t * 1.3 + i) * 0.04]} castShadow><planeGeometry args={[0.7, 0.7]} /><meshStandardMaterial color="#f4f1ea" side={THREE.DoubleSide} roughness={1} /></mesh>)}
      {/* lavadero de cemento (cuarto de lavado al aire libre) con su canasta de ropa */}
      <Box p={[-7.2, 0.45, -2.25]} s={[0.85, 0.9, 0.6]} c="#9a9a94" r={0.95} />
      <Box p={[-7.2, 0.93, -2.3]} s={[0.85, 0.06, 0.5]} c="#8a8a84" r={0.9} />
      <mesh position={[-6.95, 0.2, -1.45]} castShadow><cylinderGeometry args={[0.24, 0.2, 0.4, 16]} /><meshStandardMaterial color="#3e8fd0" roughness={0.6} /></mesh>
      {/* bodeguita del jardín con costal de cal */}
      <Box p={[-8.3, 0.75, -2.0]} s={[1.3, 1.5, 1.0]} c="#8a8f94" r={0.5} m={0.3} />
      <Box p={[-8.3, 1.55, -2.0]} s={[1.45, 0.08, 1.15]} c="#6e7378" m={0.3} />

      {/* ===== LA CASA (x -5.5..3.5), frente abierto en z=2.6 ===== */}
      <Slab p={[-1, 3, -2.6]} s={[9.2, 6.2, 0.2]} c="#efe2c8" map={tx.stucco} />
      <Slab p={[-5.55, 3, 0]} s={[0.2, 6.2, 5.4]} c="#efe2c8" map={tx.stucco} />
      <Slab p={[3.55, 3, 0]} s={[0.2, 6.2, 5.4]} c="#efe2c8" map={tx.stucco} />
      <Slab p={[-1, 4.5, -0.75]} s={[0.14, 3.0, 3.7]} c="#f2ead9" />
      <Slab p={[-1, 1.5, -1.6]} s={[0.14, 3.0, 1.8]} c="#f2ead9" />
      <Slab p={[-1, 0, 0]} s={[9.2, 0.22, 5.4]} c="#8e6f52" cut="#d8c7ad" />
      <Slab p={[-1, 3.0, 0]} s={[9.2, 0.24, 5.4]} c="#e0d3bd" cut="#efe6d6" />
      <Slab p={[-1, 6.05, 0]} s={[9.4, 0.26, 5.6]} c="#d9cdb8" cut="#efe6d6" />
      {/* pretil y tinaco en la azotea */}
      <Box p={[-1, 6.4, -2.65]} s={[9.4, 0.5, 0.15]} c="#efe2c8" />
      <mesh position={[1.9, 6.95, -1.4]} castShadow><cylinderGeometry args={[0.6, 0.6, 1.3, 24]} /><meshStandardMaterial color="#17181b" roughness={0.55} /></mesh>
      <mesh position={[1.9, 7.65, -1.4]}><cylinderGeometry args={[0.35, 0.55, 0.18, 24]} /><meshStandardMaterial color="#17181b" roughness={0.55} /></mesh>
      {/* pisos: barro en planta baja, mosaico en la alta */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.115, 0]} receiveShadow><planeGeometry args={[9.0, 5.2]} /><meshStandardMaterial map={tx.barro} roughness={0.6} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 3.125, 0]} receiveShadow><planeGeometry args={[9.0, 5.2]} /><meshStandardMaterial map={tx.mosaico} roughness={0.45} /></mesh>
      {/* ventanas con herrería */}
      <Barred p={[-3.3, 4.6, -2.49]} />
      <Barred p={[1.3, 4.6, -2.49]} w={1.0} />
      <Barred p={[-3.3, 1.7, -2.49]} w={1.0} />
      <Ray p={[-3.3, 3.95, -1.5]} rot={[-0.9, 0, 0.15]} len={2.6} w={0.75} o={1} />
      <Ray p={[-3.3, 1.05, -1.5]} rot={[-0.9, 0, 0.15]} len={2.6} w={0.7} o={1} />
      {/* puerta lateral cocina → patio */}
      <Box p={[-5.48, 1.1, 1.2]} s={[0.08, 2.2, 0.95]} c="#6b4a33" r={0.6} />

      {/* --- COCINA (x -5.5..-1) --- refri con congelador, estufa, alacena, mesa con mantel de hule */}
      <Box p={[-5.0, 1.0, -2.05]} s={[0.85, 2.0, 0.8]} c="#e6e8ea" r={0.3} m={0.1} />
      <Box p={[-5.0, 1.42, -1.645]} s={[0.84, 0.02, 0.02]} c="#a9aeb4" />
      <Box p={[-4.62, 1.75, -1.62]} s={[0.04, 0.4, 0.05]} c="#9ea4ab" m={0.6} />
      <Box p={[-3.95, 0.5, -2.15]} s={[0.8, 0.95, 0.7]} c="#f1f1ef" r={0.35} />
      <Box p={[-3.95, 1.0, -2.15]} s={[0.8, 0.04, 0.7]} c="#2a2a2a" r={0.3} m={0.5} />
      <Box p={[-2.75, 0.48, -2.15]} s={[1.4, 0.95, 0.7]} c="#7a5638" />
      <Box p={[-2.75, 0.98, -2.15]} s={[1.42, 0.05, 0.72]} c="#d9d2c4" r={0.3} />
      <Box p={[-3.3, 2.35, -2.3]} s={[2.8, 0.7, 0.4]} c="#7a5638" />
      <Box p={[-2.9, 0.75, 0.6]} s={[1.4, 0.05, 0.95]} c="#d64f3c" r={0.6} />
      {[[-3.4, 0.6], [-2.4, 0.6]].map(([x, z], i) => <Box key={i} p={[x, 0.4, z + (i ? 0.7 : -0.7)]} s={[0.4, 0.8, 0.4]} c="#6b4a33" />)}
      <mesh position={[-2.9, 0.86, 0.6]} castShadow><cylinderGeometry args={[0.16, 0.12, 0.14, 20]} /><meshStandardMaterial color="#c45a2a" roughness={0.6} /></mesh>
      {/* bote de basura */}
      <mesh position={[-1.5, 0.38, -2.1]} castShadow><cylinderGeometry args={[0.2, 0.17, 0.55, 18]} /><meshStandardMaterial color="#3b7d4f" roughness={0.6} /></mesh>

      {/* --- SALA (x -1..3.5) --- sillón, tele, escalera, fotos familiares --- */}
      <Box p={[0.6, 0.38, 0.4]} s={[1.9, 0.55, 0.85]} c="#7c5b46" r={1} />
      <Box p={[0.6, 0.72, 0.05]} s={[1.9, 0.6, 0.2]} c="#6f513e" r={1} />
      <Box p={[0.6, 1.25, 1.75]} s={[1.1, 0.65, 0.06]} c="#0e0f11" r={0.2} />
      {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[1.2 + i * 0.18, 0.25 + i * 0.25, -2.05]} s={[0.2, 0.06, 0.9]} c="#d7cdb8" r={0.4} rad={0.01} />)}
      <Box p={[2.4, 1.6, -1.58]} s={[2.4, 0.04, 0.04]} c="#141414" rot={[0, 0, 0.78]} m={0.6} />
      {/* el retrato del comandante (ahí se mete el avatar en "aquí en mi propia casa") */}
      <Box p={[0.6, 1.85, -2.47]} s={[1.12, 0.7, 0.05]} c="#3a2414" r={0.45} rad={0.012} />
      <mesh position={[0.6, 1.85, -2.44]}><planeGeometry args={[0.96, 0.54]} /><meshStandardMaterial color="#b9b3a8" roughness={0.6} /></mesh>
      {[[-0.45, 2.3, "#5b7da8"], [-0.45, 1.5, "#a8745b"], [1.55, 2.35, "#7d9a6a"]].map(([x, y, c], i) => (
        <group key={i} position={[x as number, y as number, -2.47]}>
          <Box p={[0, 0, 0]} s={[0.46, 0.36, 0.04]} c="#3a2a1e" r={0.5} rad={0.01} />
          <mesh position={[0, 0, 0.025]}><planeGeometry args={[0.38, 0.28]} /><meshStandardMaterial color={c as string} roughness={0.7} /></mesh>
        </group>
      ))}

      {/* --- RECÁMARA PRINCIPAL (arriba, x -5.5..-1) --- cama con colcha tejida, 2 burós, clóset, cómoda --- */}
      <Box p={[-3.3, 3.42, -1.2]} s={[1.8, 0.42, 2.2]} c="#efe8da" r={1} />
      <Box p={[-3.3, 3.66, -0.95]} s={[1.84, 0.1, 1.7]} c="#f4ecd8" map={tx.crochet} r={1} />
      <Box p={[-3.3, 3.95, -2.35]} s={[1.9, 1.1, 0.1]} c="#5a3a24" />
      <Box p={[-4.55, 3.4, -2.05]} s={[0.5, 0.58, 0.42]} c="#5a3a24" />
      <Box p={[-2.05, 3.4, -2.05]} s={[0.5, 0.58, 0.42]} c="#5a3a24" />
      <Box p={[-2.05, 3.45, -1.83]} s={[0.4, 0.15, 0.02]} c="#3e2817" />
      <Box p={[-2.05, 3.73, -2.07]} s={[0.16, 0.12, 0.08]} c="#1b1b1b" r={0.3} />
      <Box p={[-5.2, 4.15, 0.6]} s={[0.55, 2.0, 1.6]} c="#6a4a30" />
      <Box p={[-4.92, 4.15, 0.6]} s={[0.02, 1.9, 0.02]} c="#3e2817" />
      <Box p={[-1.45, 3.65, 1.3]} s={[0.55, 1.0, 1.2]} c="#6a4a30" />
      <mesh position={[-3.3, 4.75, -2.27]}><boxGeometry args={[0.05, 0.3, 0.02]} /><meshStandardMaterial color="#3a2a1e" /></mesh>
      <mesh position={[-3.3, 4.8, -2.27]}><boxGeometry args={[0.18, 0.05, 0.02]} /><meshStandardMaterial color="#3a2a1e" /></mesh>

      {/* --- CUARTO DE LOS NIETOS (arriba, x -1..3.5) --- camita, caja de juguetes, peluche --- */}
      <Box p={[1.9, 3.38, -1.6]} s={[1.0, 0.35, 1.8]} c="#e8eef5" r={1} />
      <Box p={[1.9, 3.58, -1.4]} s={[1.02, 0.08, 1.4]} c="#6fa8dc" r={1} />
      <Box p={[0.0, 3.4, 1.2]} s={[0.9, 0.5, 0.6]} c="#e0b23c" r={0.7} />
      <mesh position={[1.9, 3.78, -2.2]} castShadow><sphereGeometry args={[0.16, 14, 12]} /><meshStandardMaterial color="#a8794f" roughness={1} /></mesh>
      {[-0.1, 0.1].map((x) => <mesh key={x} position={[1.9 + x, 3.93, -2.2]}><sphereGeometry args={[0.06, 10, 8]} /><meshStandardMaterial color="#a8794f" roughness={1} /></mesh>)}

      {/* ===== COCHERA (x 3.5..8) con zaguán verde y coche viejo ===== */}
      <Slab p={[5.8, 1.4, -2.6]} s={[4.6, 2.8, 0.2]} c="#e6d9bf" map={tx.stucco} />
      <Slab p={[8.05, 1.4, 0]} s={[0.2, 2.8, 5.4]} c="#e6d9bf" map={tx.stucco} />
      <Box p={[5.8, 2.9, 0]} s={[4.8, 0.2, 5.6]} c="#d9cdb8" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.03, 0]} receiveShadow><planeGeometry args={[4.4, 5.2]} /><meshStandardMaterial map={tx.concrete} roughness={0.9} /></mesh>
      <group position={[5.8, 0, 2.62]}>
        {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[i < 4 ? -2.0 + i * 0.5 * (1 - zaguan) : 2.0 - (8 - i) * 0.5 * (1 - zaguan), 1.2, zaguan * 0.07 * (i % 4)]} s={[0.45, 2.3, 0.05]} c="#2e5e45" r={0.55} m={0.4} rad={0.01} />)}
        <Box p={[0.05, 1.25, 0.05]} s={[0.12, 0.2, 0.06]} c="#c9a14a" m={0.9} r={0.3} />
      </group>
      <group position={[5.6, 0, -0.3]}>
        <Box p={[0, 0.55, 0]} s={[1.7, 0.6, 3.6]} c="#8c2f2a" r={0.35} m={0.3} rad={0.12} />
        <Box p={[0, 1.05, -0.2]} s={[1.5, 0.5, 1.9]} c="#7a2824" r={0.3} m={0.3} rad={0.12} />
        <Box p={[0, 1.07, -0.2]} s={[1.52, 0.4, 1.7]} c="#2b3640" r={0.1} m={0.6} rad={0.1} />
        {[[-0.8, -1.2], [0.8, -1.2], [-0.8, 1.2], [0.8, 1.2]].map(([x, z], i) => <mesh key={i} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.2, 18]} /><meshStandardMaterial color="#111" roughness={0.8} /></mesh>)}
      </group>
      {/* estante con lata de pintura, caja de herramientas y botas */}
      <Box p={[7.6, 0.9, -2.2]} s={[0.6, 1.8, 0.5]} c="#7d6a55" />
      <mesh position={[7.6, 1.1, -2.1]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.2, 16]} /><meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.35} /></mesh>
      <Box p={[7.6, 0.45, -2.1]} s={[0.5, 0.25, 0.3]} c="#b23a2a" m={0.4} r={0.5} />

      {/* ===== vecinas, jacarandas, poste ===== */}
      <Vecina x={12.6} z={-0.3} w={8.4} h={5.6} c="#e39bb4" i={1} />
      <Vecina x={21.6} z={-0.3} w={9} h={3.4} c="#f2c45a" i={2} />
      <Vecina x={-17.9} z={-0.3} w={9} h={3.4} c="#7fb7d9" i={3} />
      <Vecina x={-27} z={-0.3} w={9} h={5.8} c="#f0e3c4" i={4} />
      {[[-13.0, 0, 5.4], [9.6, 0, 5.4], [17, 0, 5.6]].map((p, i) => <Jaca key={i} p={p as V3} s={1 + rnd(i, 5) * 0.4} />)}
      <mesh position={[10.6, 3.5, 5.0]} castShadow><cylinderGeometry args={[0.1, 0.13, 7, 8]} /><meshStandardMaterial color="#8a8378" roughness={0.9} /></mesh>
      {[1.6, 19.6].map((x) => <mesh key={x} position={[x, 6.6, 5.0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.01, 0.01, 18, 4]} /><meshStandardMaterial color="#1a1a1a" /></mesh>)}

      {/* ===== el ratero, su ruta y los pines ===== */}
      {thief && <Thief t={t} />}
      {trail && <Trail t={Math.min(t, trail[1])} t0={trail[0]} o={1} />}
      {PINS.map((p, i) => <PinMesh key={i} t={t} pin={p} />)}
    </ThreeCanvas>
  );
};

// marcadores 3D (para portales, rótulos y pines)
export const PT = {
  barda: [-11.05, 2.3, 0.2] as V3,
  naranjo: [-10.1, 1.2, -1.85] as V3,
  puertaPatio: [-5.5, 1.1, 1.2] as V3,
  sala: [0.6, 0.9, 0.4] as V3,
  cocina: [-3.2, 1.0, -0.5] as V3,
  escalera: [2.0, 1.6, -2.0] as V3,
  buro: [-2.05, 3.55, -1.85] as V3,
  colchon: [-3.3, 3.65, -0.6] as V3,
  closet: [-4.95, 4.3, 0.6] as V3,
  comoda: [-1.45, 4.1, 1.3] as V3,
  congelador: [-5.0, 1.75, -1.62] as V3,
  ventanaRec: [-3.3, 4.6, -2.45] as V3,
  zaguan: [5.8, 1.25, 2.7] as V3,
  marco: [0.6, 1.85, -2.44] as V3,
  mesa: [-2.9, 0.8, 0.6] as V3,
  lavadero: [-7.2, 0.95, -2.25] as V3,
  basura: [-1.5, 0.66, -2.1] as V3,
  alacena: [-3.3, 2.35, -2.2] as V3,
  tele: [0.6, 1.25, 1.75] as V3,
  nietos: [1.9, 3.8, -1.6] as V3,
  estante: [7.6, 1.0, -2.1] as V3,
  bodeguita: [-8.3, 1.2, -2.0] as V3,
};
