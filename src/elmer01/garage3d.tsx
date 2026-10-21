// elmer01 · EL MUNDO: un garaje de Tennessee en corte (maqueta de arquitecto) donde vive el banco plegable de pallets.
// Una sola escena y UNA cámara para todo el video: la cámara vuela de la camioneta a la pared, a los pallets, al banco.
// Unidades = PIES. Pared izquierda (x = -10) con montantes cada 16" (se ven con `xray`), banco de 48" x 22" a 34,5".
// Estado por cuadro (fold, leg, bags, xray, pallets…) lo calcula Min1/Rest con at("frase"). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const W = 1920, H = 1080, FPS = 30;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- CÁMARA: keyframes [t, pos, look, fov] (los arma Min1 con at()); easing cúbico, arco en traslados largos ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (K: Key[], t: number) => {
  let i = 0;
  while (i < K.length - 1 && K[i + 1].t <= t) i++;
  const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 600); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (K: Key[], t: number, q: V3) => project(camAt(K, t), v3(q));
export const camSpeed = (K: Key[], t: number) => {
  const a = camAt(K, t), b = camAt(K, t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 22 + a.l.distanceTo(b.l) * 9;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ K: Key[]; t: number }> = ({ K, t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(K, t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.05; c.far = 600; c.updateProjectionMatrix();
  return null;
};

// ---------------- puntos de interés (para rótulos/portales HTML) ----------------
export const BENCH = { x0: -10 + 0.33, y: 2.875, z: 2.0, w: 4.0, d: 1.833 }; // pared izq · alto 34,5" · ancho 48" · fondo 22"
export const PT: Record<string, V3> = {
  benchFace: [BENCH.x0 + 0.25, BENCH.y + 1.4, BENCH.z],          // cara del banco plegado
  benchTop: [BENCH.x0 + 0.9, BENCH.y + 0.1, BENCH.z],
  benchLeg: [BENCH.x0 + BENCH.d - 0.15, 1.2, BENCH.z],
  wallGap: [BENCH.x0 + 0.33, BENCH.y + 1.0, BENCH.z + BENCH.w / 2 + 0.3],
  truck: [3.2, 3.0, 0.5],
  truckMirror: [0.15, 4.0, -2.6],
  mower: [-4.6, 1.6, -8.0],
  floor: [-5.5, 0.05, 2.0],
  pallets: [6.5, 1.3, 15.5],
  bulb: [-1, 8.4, -1],
  stud: [-10, 4.5, BENCH.z - 1.33],
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
export const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.03, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} />
  </mesh>
);

// tabla de pallet (madera con veta procedural; tono por índice)
const useWood = () => useMemo(() => {
  const mk = (seed: number, base: [number, number, number]) => {
    const cv = document.createElement("canvas"); cv.width = 256; cv.height = 64; const g = cv.getContext("2d")!;
    g.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`; g.fillRect(0, 0, 256, 64);
    for (let k = 0; k < 26; k++) {
      g.strokeStyle = `rgba(70,42,18,${0.07 + rnd(seed, k) * 0.16})`; g.lineWidth = 0.6 + rnd(seed, k + 9) * 1.8; g.beginPath();
      const y = rnd(seed, k + 3) * 64; g.moveTo(0, y); g.bezierCurveTo(80, y + 5 * (rnd(seed, k) - 0.5), 170, y - 4, 256, y + 3 * (rnd(seed, k + 1) - 0.5)); g.stroke();
    }
    for (let n = 0; n < 2; n++) { const x = 30 + rnd(seed, n + 40) * 196, y = 10 + rnd(seed, n + 50) * 44; g.fillStyle = "rgba(40,28,20,.75)"; g.beginPath(); g.arc(x, y, 2.2, 0, 6.3); g.fill(); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  };
  const tones: [number, number, number][] = [[196, 160, 112], [184, 146, 98], [205, 172, 126], [170, 132, 88], [192, 150, 104], [178, 150, 112], [200, 165, 118]];
  return { raw: tones.map((b, i) => mk(i + 1, [b[0] - 38, b[1] - 34, b[2] - 30])), oiled: tones.map((b, i) => mk(i + 1, [Math.min(255, b[0] + 6), b[1] - 12, b[2] - 38])) };
}, []);

const Pallet: React.FC<{ p: V3; rot?: V3; wood: THREE.Texture[] }> = ({ p, rot, wood }) => (
  <group position={p} rotation={rot}>
    {[-1.45, 0, 1.45].map((z, i) => <Box key={"s" + i} p={[0, 0.27, z]} s={[4, 0.29, 0.125]} c="#b89a74" map={wood[(i + 2) % 7]} rad={0.015} />)}
    {Array.from({ length: 7 }, (_, i) => <Box key={"d" + i} p={[-1.75 + i * 0.583, 0.48, 0]} s={[0.29, 0.06, 3.33]} c="#c8aa82" map={wood[i]} rad={0.01} />)}
    {[0, 3, 6].map((i) => <Box key={"b" + i} p={[-1.75 + i * 0.583, 0.09, 0]} s={[0.29, 0.06, 3.33]} c="#a88a64" map={wood[(i + 1) % 7]} rad={0.01} />)}
  </group>
);

// camioneta simple (cajas redondeadas) sin marcas
const Truck: React.FC<{ p: V3 }> = ({ p }) => {
  const paint = "#5d6b74", glass = "#1b2329";
  return (
    <group position={p}>
      <Box p={[0, 2.25, 4.2]} s={[6.1, 1.9, 7.4]} c={paint} r={0.45} m={0.55} rad={0.18} />
      <Box p={[0, 1.95, -2.9]} s={[6.0, 1.4, 6.6]} c={paint} r={0.45} m={0.55} rad={0.15} />
      <Box p={[0, 3.55, 1.6]} s={[5.6, 1.7, 3.6]} c={paint} r={0.45} m={0.55} rad={0.3} />
      <Box p={[0, 3.6, 3.43]} s={[5.0, 1.25, 0.08]} c={glass} r={0.08} m={0.3} rad={0.02} />
      <Box p={[3.0, 3.6, 1.6]} s={[0.06, 1.15, 2.9]} c={glass} r={0.08} m={0.3} rad={0.02} />
      <Box p={[-3.0, 3.6, 1.6]} s={[0.06, 1.15, 2.9]} c={glass} r={0.08} m={0.3} rad={0.02} />
      {/* espejos */}
      <Box p={[-3.3, 3.3, 3.1]} s={[0.55, 0.5, 0.12]} c="#2a2f33" r={0.4} m={0.5} rad={0.05} />
      <Box p={[3.3, 3.3, 3.1]} s={[0.55, 0.5, 0.12]} c="#2a2f33" r={0.4} m={0.5} rad={0.05} />
      <Box p={[0, 1.7, -6.25]} s={[6.2, 0.55, 0.3]} c="#9aa1a6" r={0.3} m={0.8} rad={0.08} />
      <Box p={[0, 1.6, 7.95]} s={[6.2, 0.45, 0.3]} c="#9aa1a6" r={0.3} m={0.8} rad={0.08} />
      {[[-2.75, -3.6], [2.75, -3.6], [-2.75, 5.0], [2.75, 5.0]].map(([x, z], i) => (
        <group key={i} position={[x, 1.25, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow receiveShadow><cylinderGeometry args={[1.25, 1.25, 0.85, 32]} /><meshStandardMaterial color="#1a1b1d" roughness={0.9} /></mesh>
          <mesh position={[0, x > 0 ? 0.43 : -0.43, 0]}><cylinderGeometry args={[0.62, 0.62, 0.04, 24]} /><meshStandardMaterial color="#b9bec2" roughness={0.3} metalness={0.9} /></mesh>
        </group>
      ))}
    </group>
  );
};

// cortadora de pasto (roja, asiento negro)
const Mower: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p} rotation={[0, 0.2, 0]}>
    <Box p={[0, 1.25, 0.5]} s={[2.6, 1.0, 2.4]} c="#b3261e" r={0.4} m={0.3} rad={0.25} />
    <Box p={[0, 1.15, -1.4]} s={[2.6, 0.8, 1.6]} c="#b3261e" r={0.4} m={0.3} rad={0.2} />
    <Box p={[0, 2.0, -1.2]} s={[1.5, 0.35, 1.3]} c="#1d1d1f" r={0.7} rad={0.15} />
    <Box p={[0, 2.6, -1.85]} s={[1.5, 1.0, 0.3]} c="#1d1d1f" r={0.7} rad={0.12} />
    <Box p={[0, 0.55, -0.3]} s={[3.6, 0.35, 2.4]} c="#3a3c40" r={0.6} m={0.4} rad={0.1} />
    <mesh position={[0, 2.4, 1.2]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 1.1, 8]} /><meshStandardMaterial color="#222" /></mesh>
    <mesh position={[0, 2.9, 1.45]} rotation={[Math.PI / 2 + 0.5, 0, 0]}><torusGeometry args={[0.45, 0.06, 8, 24]} /><meshStandardMaterial color="#222" /></mesh>
    {[[-1.3, -1.4, 0.75], [1.3, -1.4, 0.75], [-1.2, 1.2, 0.5], [1.2, 1.2, 0.5]].map(([x, z, r], i) => (
      <mesh key={i} position={[x, r, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[r, r, 0.6, 24]} /><meshStandardMaterial color="#151515" roughness={0.9} /></mesh>
    ))}
  </group>
);

// bolsa de arena de 50 lb (cae y se aplasta un poco al llegar)
const Bag: React.FC<{ p: V3; k: number; i: number }> = ({ p, k, i }) => {
  if (k <= 0) return null;
  const y = p[1] + (1 - ease(k)) * 3.2, sq = k > 0.92 ? 1 - Math.sin((k - 0.92) / 0.08 * Math.PI) * 0.12 : 1;
  return (
    <group position={[p[0], y, p[2]]} rotation={[0, (rnd(i, 7) - 0.5) * 0.4, 0]} scale={[1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)]}>
      <mesh castShadow receiveShadow geometry={rbox(0.95, 0.3, 1.5, 0.13)}><meshStandardMaterial color="#d8cdb2" roughness={0.95} /></mesh>
      <mesh position={[0, 0.152, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#8c2f24" roughness={0.9} /></mesh>
    </group>
  );
};

// ---------------- EL BANCO: cleat francés + ledger + tapa de 7 tablas + bastidor + pata con bisagra + estante ----------------
// fold: 0 = plegado contra la pared · 1 = abierto. leg: 0 = pata plegada bajo la tapa · 1 = apoyada (con sobrepaso que traba)
export const Bench: React.FC<{ fold: number; leg: number; wood: { raw: THREE.Texture[]; oiled: THREE.Texture[] }; oil?: number; bags?: number; glow?: number }> = ({ fold, leg, wood, oil = 0, bags = 0, glow = 0 }) => {
  const B = BENCH, T = 0.07; // tapa 7/8" aprox
  const ang = (1 - ease(fold)) * (Math.PI / 2);
  const lk = ease(leg), over = Math.sin(cl((leg - 0.82) / 0.18) * Math.PI) * 0.06;
  const legAng = (1 - lk) * (Math.PI / 2) - over; // gira sobre el eje X: plegada queda a lo largo del banco
  const legL = B.y - 0.33;
  const tex = oil > 0.5 ? wood.oiled : wood.raw;
  const boardW = B.w / 7;
  return (
    <group>
      {/* cleat de pared (bisel 45°) y ledger del banco */}
      <Box p={[-10 + 0.07, B.y - 0.15, B.z]} s={[0.125, 0.29, B.w]} c="#a5835c" map={wood.raw[3]} rad={0.01} />
      <Box p={[-10 + 0.2, B.y - 0.05, B.z]} s={[0.125, 0.33, B.w]} c="#b08d64" map={wood.raw[5]} rad={0.01} />
      {/* bisagras (3) */}
      {[-1.5, 0, 1.5].map((dz, i) => <Box key={"h" + i} p={[B.x0, B.y + 0.03, B.z + dz]} s={[0.05, 0.1, 0.35]} c="#3b3d40" r={0.35} m={0.85} rad={0.01} />)}
      {/* todo lo que pivota sobre la bisagra trasera */}
      <group position={[B.x0, B.y, B.z]} rotation={[0, 0, ang]}>
        {/* tapa: 7 tablas alternadas con la juntura marcada */}
        {Array.from({ length: 7 }, (_, i) => (
          <Box key={"t" + i} p={[B.d / 2, T / 2, -B.w / 2 + boardW * (i + 0.5)]} s={[B.d, T, boardW - 0.006]} c={oil > 0.5 ? "#e0b98a" : "#d6b48a"} map={tex[i]} rad={0.008} r={oil > 0.5 ? 0.45 : 0.8} />
        ))}
        {/* cabezas de clavija (4) */}
        {[[0.3, -1.6], [B.d - 0.3, -1.6], [0.3, 1.6], [B.d - 0.3, 1.6]].map(([x, z], i) => (
          <mesh key={"pg" + i} position={[x, T + 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.03, 20]} /><meshStandardMaterial color="#6b4a2a" roughness={0.7} /></mesh>
        ))}
        {/* bastidor: largueros adelante/atrás + 3 travesaños */}
        <Box p={[0.08, -0.17, 0]} s={[0.125, 0.29, B.w]} c="#a6855f" map={wood.raw[2]} rad={0.01} />
        <Box p={[B.d - 0.08, -0.17, 0]} s={[0.125, 0.29, B.w]} c="#a6855f" map={wood.raw[4]} rad={0.01} />
        {[-B.w / 2 + 0.07, 0, B.w / 2 - 0.07].map((z, i) => <Box key={"x" + i} p={[B.d / 2, -0.17, z]} s={[B.d - 0.25, 0.29, 0.125]} c="#9f7f5a" map={wood.raw[(i + 5) % 7]} rad={0.01} />)}
        {/* estante dentro del bastidor */}
        {Array.from({ length: 4 }, (_, i) => <Box key={"sh" + i} p={[0.3 + i * 0.36, -0.3, 0]} s={[0.27, 0.05, B.w - 0.28]} c="#b99a74" map={wood.raw[(i + 1) % 7]} rad={0.008} />)}
        {/* pata: bisagra en el larguero delantero */}
        <group position={[B.d - 0.15, -0.31, 0.55]} rotation={[legAng, 0, 0]}>
          <Box p={[0, -legL / 2, 0]} s={[0.25, legL, 0.29]} c="#a07c55" map={wood.raw[6]} rad={0.02} />
          <Box p={[0.13, -0.05, 0]} s={[0.04, 0.12, 0.3]} c="#3b3d40" r={0.35} m={0.85} rad={0.01} />
        </group>
        {/* bolsas de arena */}
        {Array.from({ length: 6 }, (_, i) => <Bag key={"bg" + i} i={i} k={cl(bags - i)} p={[0.25 + (i % 2) * 0.62 + 0.25, T + 0.15 + Math.floor(i / 2) * 0.3, -0.75 + (i % 2) * 0.1]} />)}
        {glow > 0.01 && <mesh position={[B.d / 2, T + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[B.d, B.w]} /><meshBasicMaterial color="#ffd27a" transparent opacity={glow * 0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
      </group>
    </group>
  );
};

// pared con montantes cada 16": el yeso se vuelve transparente con `xray` y aparecen los montantes y los tornillos
const StudWall: React.FC<{ xray: number; paper: THREE.Texture }> = ({ xray, paper }) => {
  const studs = Array.from({ length: 16 }, (_, i) => -11 + i * 1.333);
  return (
    <group>
      {studs.map((z, i) => <Box key={i} p={[-10.3, 4.5, z]} s={[0.29, 9, 0.125]} c="#c9a978" r={0.85} rad={0.01} />)}
      <Box p={[-10.3, 0.06, 0]} s={[0.29, 0.125, 22]} c="#b89668" rad={0.01} />
      <Box p={[-10.3, 8.94, 0]} s={[0.29, 0.125, 22]} c="#b89668" rad={0.01} />
      {/* yeso por dentro (se hace vidrio con xray) */}
      <mesh position={[-10.13, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow={xray < 0.5}>
        <planeGeometry args={[22, 9]} />
        <meshStandardMaterial color="#e6e0d4" roughness={0.95} map={paper} transparent opacity={1 - 0.82 * xray} depthWrite={xray < 0.5} />
      </mesh>
      {/* tornillos del yeso: puntitos sobre cada montante (los que "agarra el imán") */}
      {xray > 0.01 && studs.flatMap((z, i) => [1.2, 3.0, 4.8, 6.6].map((y, j) => (
        <mesh key={i + "_" + j} position={[-10.11, y, z]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.035, 12]} /><meshBasicMaterial color="#ffcf6a" toneMapped={false} transparent opacity={xray} /></mesh>
      )))}
      {/* canto del corte arriba: se ve el espesor de la pared */}
      <Box p={[-10.25, 9.06, 0]} s={[0.42, 0.06, 22.1]} c="#efe8dc" rad={0.01} />
    </group>
  );
};

export type GState = { fold: number; leg: number; bags: number; xray: number; pallets: number; oil: number; glow: number; day: number; bulb: number };

export const GarageWorld: React.FC<{ K: Key[]; t: number; st: GState; children?: React.ReactNode }> = ({ K, t, st, children }) => {
  const tx = useTextures();
  const wood = useWood();
  const sun = new THREE.Color("#ffd9a8");
  return (
    <ThreeCanvas linear={false} width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ background: "#121418" }}>
      <Cam K={K} t={t} />
      <color attach="background" args={[new THREE.Color("#1a1c20").lerp(new THREE.Color("#9fb6cc"), st.day * 0.55)]} />
      <fog attach="fog" args={[new THREE.Color("#1a1c20").lerp(new THREE.Color("#a9bccd"), st.day * 0.55), 40, 110]} />
      <hemisphereLight args={["#cfd8e6", "#3b3128", 0.35 + 0.35 * st.day]} />
      {/* sol de la tarde entrando por el portón (de adelante a la izquierda) */}
      <directionalLight position={[14, 22, 30]} intensity={1.6 + 1.4 * st.day} color={sun} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={26} shadow-camera-bottom={-26} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* bombita desnuda del techo */}
      <pointLight position={[-1, 8.3, -1]} intensity={st.bulb * 26} distance={26} decay={1.6} color="#ffcf8a" castShadow shadow-bias={-0.0004} />
      <mesh position={[-1, 8.45, -1]}><sphereGeometry args={[0.17, 20, 16]} /><meshBasicMaterial color={new THREE.Color("#fff1cf").multiplyScalar(0.4 + 2.2 * st.bulb)} toneMapped={false} /></mesh>
      <mesh position={[-1, 8.85, -1]}><cylinderGeometry args={[0.012, 0.012, 0.6, 6]} /><meshStandardMaterial color="#222" /></mesh>

      {/* losa de hormigón con canto (maqueta) + entrada */}
      <mesh position={[0, -0.25, 0]} receiveShadow><boxGeometry args={[22, 0.5, 24]} /><meshStandardMaterial color="#8d8e8f" roughness={0.92} map={tx.concrete} /></mesh>
      <mesh position={[-5.5, 0.006, 2.4]} rotation={[-Math.PI / 2, 0, 0.4]}><circleGeometry args={[0.9, 28]} /><meshStandardMaterial color="#4d4a45" roughness={0.6} transparent opacity={0.55} /></mesh>
      <mesh position={[0, -0.27, 21]} receiveShadow><boxGeometry args={[22, 0.46, 18]} /><meshStandardMaterial color="#9b9a96" roughness={0.95} map={tx.concrete} /></mesh>
      <mesh position={[0, -0.6, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[220, 220]} /><meshStandardMaterial color="#4f6a3a" roughness={1} /></mesh>

      {/* pared del fondo (bloque) y pared izquierda con montantes; derecha abierta (corte) */}
      <mesh position={[0, 4.5, -12.1]} receiveShadow castShadow><boxGeometry args={[22, 9, 0.35]} /><meshStandardMaterial color="#bdb7ac" roughness={0.95} map={tx.block} /></mesh>
      <StudWall xray={st.xray} paper={tx.paper} />
      {/* ventanita lateral + estante con latas + manguera en gancho (vida) */}
      <mesh position={[5, 6.0, -11.9]}><planeGeometry args={[2.4, 1.6]} /><meshBasicMaterial color={new THREE.Color("#9fb7d4").lerp(new THREE.Color("#ffe2b0"), st.day)} toneMapped={false} /></mesh>
      <Box p={[-6, 5.6, -11.5]} s={[4, 0.1, 0.9]} c="#7a5c3c" rad={0.01} />
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-7.6 + i * 0.8, 6.0, -11.5]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.7, 18]} /><meshStandardMaterial color={["#7d8a94", "#a33a2c", "#c9b27a", "#5f6e4a", "#8b8f93"][i]} roughness={0.5} metalness={0.5} /></mesh>)}
      <mesh position={[3.5, 5.2, -11.7]} rotation={[0, 0, 0]}><torusGeometry args={[0.7, 0.09, 10, 40]} /><meshStandardMaterial color="#d26a1d" roughness={0.6} /></mesh>

      <Truck p={[3.4, 0, -2.2]} />
      <Mower p={[-4.6, 0, -8.6]} />
      <Bench fold={st.fold} leg={st.leg} wood={wood} oil={st.oil} bags={st.bags} glow={st.glow} />

      {/* tres pallets gratis en la entrada (aparecen apilados) */}
      {[0, 1, 2].map((i) => {
        const k = ease(cl(st.pallets * 3 - i));
        return k > 0 ? <group key={i} position={[0, (1 - k) * 4, 0]}><Pallet p={[6.5 + rnd(i, 3) * 0.3, i * 0.53, 15.5]} rot={[0, 0.25 + (rnd(i, 5) - 0.5) * 0.18, 0]} wood={wood.raw} /></group> : null;
      })}

      {children}
      <Post bloom={0.55} threshold={0.86} exposure={0.95 + 0.25 * st.day} env={0.32 + 0.2 * st.day} />
    </ThreeCanvas>
  );
};
