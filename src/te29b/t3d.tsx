// t3d · kit 3D compartido de la tanda te29 (31-oct). El evaluador baja a ≤6 todo lo que no tiene «foto real o 3D adentro»: los objetos héroe
// pasan a three.js de verdad (PBR, sombras suaves, AO y bloom de fx3d) y el renglón de texto sigue siendo HTML por encima (Num de tkit).
// Reglas: nunca escala 0 (con bloom da un rectángulo negro) → `sc()`; luces siempre montadas; cámara siempre en curva, nunca zoom lineal.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox, useTextures } from "./fx3d";

export type V3 = [number, number, number];
export const sc = (s: number) => Math.max(0.001, s);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// cámara en curva: va de `from` a `to` por un arco (se levanta y gira un poco), mirando a `look`
const Rig: React.FC<{ from: V3; to: V3; look: V3; look2?: V3; k: number; arc: number; fov: number }> = ({ from, to, look, look2, k, arc, fov }) => {
  const { camera } = useThree();
  const s = Math.sin(Math.PI * k);
  camera.position.set(lp(from[0], to[0], k) + arc * s, lp(from[1], to[1], k) + arc * 0.35 * s, lp(from[2], to[2], k));
  (camera as THREE.PerspectiveCamera).fov = fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  const L = look2 ?? look; camera.lookAt(lp(look[0], L[0], k), lp(look[1], L[1], k), lp(look[2], L[2], k));
  return null;
};

export const Scene3: React.FC<{ k: number; from: V3; to: V3; look: V3; look2?: V3; arc?: number; fov?: number; bg?: string; floor?: string | null; fog?: [number, number];
  key1?: V3; bloom?: number; exposure?: number; env?: number; children: React.ReactNode }> = ({ k, from, to, look, look2, arc = 1.2, fov = 34, bg = "#141210", floor = "#2a2420", fog = [18, 60],
  key1 = [-6, 12, 8], bloom = 0.35, exposure = 1.05, env = 0.45, children }) =>
  <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <Rig from={from} to={to} look={look} look2={look2} k={k} arc={arc} fov={fov} />
    <Post bloom={bloom} threshold={0.88} exposure={exposure} env={env} />
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[bg, fog[0], fog[1]]} />
    <hemisphereLight args={[0xfff1dc, 0x1a1c20, 0.55]} />
    <directionalLight position={key1} intensity={2.4} color="#ffe6c8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-bias={-0.0004} shadow-radius={6} />
    <directionalLight position={[8, 5, -7]} intensity={1.1} color="#9fc2ff" />
    {floor === "planks" ? <Planks /> : floor && <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color={floor} roughness={0.82} /></mesh>}
    {children}
  </ThreeCanvas>;

// piso de tablas de madera (textura procedural de fx3d)
const Planks: React.FC = () => { const tx = useTextures(); const m = React.useMemo(() => { const t = tx.planks.clone(); t.repeat.set(26, 26); t.needsUpdate = true; return t; }, [tx]);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[160, 160]} /><meshStandardMaterial map={m} color="#6e5038" roughness={0.7} /></mesh>; };
// polvo al apoyar: anillo de bolitas que se abre y se apaga (k = segundos desde el golpe)
export const Puff: React.FC<{ p: V3; k: number; r?: number }> = ({ p, k, r = 0.9 }) => k <= 0 || k > 0.8 ? null : <group position={p}>
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><ringGeometry args={[r * (0.6 + 1.1 * k), r * (0.75 + 1.5 * k), 48]} /><meshBasicMaterial color="#e8d8b8" transparent opacity={0.25 * (1 - k / 0.8)} depthWrite={false} /></mesh>
  {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2, d = r * (0.7 + 1.4 * k); return <mesh key={i} position={[Math.cos(a) * d, 0.05 + 0.6 * k * (1 - k), Math.sin(a) * d]}><sphereGeometry args={[0.035, 6, 6]} /><meshBasicMaterial color="#e8d8b8" transparent opacity={0.8 * (1 - k / 0.8)} /></mesh>; })}</group>;

type M = { c: string; m?: number; ro?: number; e?: string; ei?: number; o?: number; ds?: boolean };
const Mat: React.FC<M> = ({ c, m = 0, ro = 0.6, e, ei = 0, o, ds }) => <meshStandardMaterial side={ds ? THREE.DoubleSide : THREE.FrontSide} color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o !== undefined} opacity={o ?? 1} />;

// caja de bordes redondeados
export const Bx: React.FC<{ p: V3; s: V3; rot?: V3; rad?: number } & M> = ({ p, s, rot = [0, 0, 0], rad = 0.04, ...m }) =>
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow receiveShadow><Mat {...m} /></mesh>;
// cilindro (moneda, columna, carrete, poste)
export const Cy: React.FC<{ p: V3; r: number; h: number; r2?: number; rot?: V3; seg?: number } & M> = ({ p, r, h, r2, rot = [0, 0, 0], seg = 40, ...m }) =>
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r2 ?? r, r, h, seg]} /><Mat {...m} /></mesh>;
export const Sp: React.FC<{ p: V3; r: number } & M> = ({ p, r, ...m }) => <mesh position={p} castShadow receiveShadow><sphereGeometry args={[r, 32, 24]} /><Mat {...m} /></mesh>;

export const GOLD3 = { c: "#e2b13c", m: 1, ro: 0.28 }, SILV3 = { c: "#d6dce2", m: 1, ro: 0.25 }, COPP3 = { c: "#c9733a", m: 1, ro: 0.32 };
// moneda: canto + dos caras con aro en relieve
export const Coin3: React.FC<{ p: V3; r?: number; rot?: V3; kind?: "g" | "s" | "c" }> = ({ p, r = 0.5, rot = [0, 0, 0], kind = "g" }) => {
  const mt = kind === "s" ? SILV3 : kind === "c" ? COPP3 : GOLD3;
  return <group position={p} rotation={rot}>
    <Cy p={[0, 0, 0]} r={r} h={r * 0.16} {...mt} />
    <mesh position={[0, r * 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[r * 0.82, r * 0.05, 10, 48]} /><Mat {...mt} /></mesh>
    <mesh position={[0, -r * 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r * 0.82, r * 0.05, 10, 48]} /><Mat {...mt} /></mesh>
  </group>;
};
// lingote: tronco de pirámide (cilindro de 4 lados)
export const Bar3: React.FC<{ p: V3; s?: number; rot?: V3 }> = ({ p, s = 1, rot = [0, 0, 0] }) =>
  <mesh position={p} rotation={rot} scale={[sc(s) * 1.6, sc(s) * 0.5, sc(s) * 0.7]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.6, 1, 4, 1]} /><Mat {...GOLD3} /></mesh>;

// figura de arcilla (cabeza + cuerpo cápsula), como el stickman 3D del kit
export const Man3: React.FC<{ p: V3; c?: string; s?: number; rot?: V3; arm?: number }> = ({ p, c = "#ece6da", s = 1, rot = [0, 0, 0], arm = 0 }) =>
  <group position={p} rotation={rot} scale={sc(s)}>
    <mesh position={[0, 0.85, 0]} castShadow receiveShadow><capsuleGeometry args={[0.32, 0.9, 8, 20]} /><Mat c={c} ro={0.55} /></mesh>
    <Sp p={[0, 1.95, 0]} r={0.3} c={c} ro={0.55} />
    <group position={[0.36, 1.4, 0]} rotation={[0, 0, -0.2 - arm * 2.6]}><mesh position={[0, -0.38, 0]} castShadow><capsuleGeometry args={[0.09, 0.62, 6, 12]} /><Mat c={c} ro={0.55} /></mesh></group>
    <group position={[-0.36, 1.4, 0]} rotation={[0, 0, 0.2]}><mesh position={[0, -0.38, 0]} castShadow><capsuleGeometry args={[0.09, 0.62, 6, 12]} /><Mat c={c} ro={0.55} /></mesh></group>
  </group>;

// cofre de madera con herrajes dorados; `lid` 0..1 abre la tapa y enciende el brillo de adentro
export const Chest3: React.FC<{ p: V3; lid?: number; rot?: V3; s?: number }> = ({ p, lid = 0, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={sc(s)}>
    <Bx p={[0, 0.35, 0]} s={[1.4, 0.7, 0.9]} c="#6a3e1e" ro={0.7} />
    {[-0.55, 0.55].map((x) => <Bx key={x} p={[x, 0.35, 0]} s={[0.1, 0.72, 0.92]} c="#c99a3a" m={1} ro={0.35} rad={0.02} />)}
    <Bx p={[0, 0.66, 0]} s={[1.3, 0.04, 0.8]} c="#ffd36a" e="#ffb23a" ei={2.2 * lid} />
    <mesh position={[0, 0.66, 0]} scale={[0.64, sc(0.06 + 0.16 * lid), 0.4]} castShadow receiveShadow><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Mat {...GOLD3} e="#ffb23a" ei={0.25 * lid} /></mesh>
    {[0, 1, 2, 3].map((i) => <Coin3 key={i} p={[-0.4 + i * 0.27, 0.7 + 0.12 * lid + 0.05 * (i % 2), 0.12 - 0.08 * i]} r={0.15} rot={[0.4 + 0.3 * i, 0, 0.3 - 0.2 * i]} />)}
    <group position={[0, 0.7, -0.45]} rotation={[-1.45 * lid, 0, 0]}>
      <mesh position={[0, 0, 0.45]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.45, 0.45, 1.4, 24, 1, false, 0, Math.PI]} /><Mat c="#7a4822" ro={0.65} ds /></mesh>
      <Bx p={[0, 0.0, 0.45]} s={[1.4, 0.05, 0.9]} c="#8a5228" ro={0.6} rad={0.01} e="#ffb23a" ei={0.35 * lid} />
      {[-0.55, 0.55].map((x) => <mesh key={x} position={[x, 0, 0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.46, 0.46, 0.1, 24, 1, false, 0, Math.PI]} /><Mat {...GOLD3} ds /></mesh>)}
      <Bx p={[0, 0.06, 0.9]} s={[0.22, 0.26, 0.06]} {...GOLD3} />
    </group>
  </group>;

// mar: plano con olas suaves calculadas por cuadro (determinista con tt), azul profundo y brillante con el entorno PBR
export const Sea3: React.FC<{ tt: number; c?: string; size?: number; amp?: number }> = ({ tt, c = "#123a5a", size = 80, amp = 0.12 }) => {
  const g = React.useMemo(() => new THREE.PlaneGeometry(size, size, 90, 90), [size]);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, amp * (Math.sin(x * 0.7 + tt * 1.3) + 0.6 * Math.sin(y * 1.1 - tt * 0.9) + 0.3 * Math.sin((x + y) * 2.1 + tt * 2))); }
  pos.needsUpdate = true; g.computeVertexNormals();
  return <mesh geometry={g} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial color={c} roughness={0.18} metalness={0.15} /></mesh>;
};

// galeón: casco perfilado y extruido, castillo de popa, tres palos con velas curvas y gallardete
const hullG = (() => { const s = new THREE.Shape(); s.moveTo(-1.7, 0.95); s.lineTo(2.1, 0.95); s.quadraticCurveTo(1.7, 0.1, 1.1, -0.1); s.lineTo(-1.3, -0.1); s.quadraticCurveTo(-1.75, 0.3, -1.7, 0.95);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3 }); g.translate(0, 0, -0.45); return g; })();
export const Ship3: React.FC<{ p: V3; rot?: V3; s?: number; flag?: string; roll?: number }> = ({ p, rot = [0, 0, 0], s = 1, flag = "#1f3f8a", roll = 0 }) =>
  <group position={p} rotation={[rot[0] + roll * 0.04, rot[1], rot[2] + roll * 0.05]} scale={sc(s)}>
    <mesh geometry={hullG} castShadow receiveShadow><Mat c="#5a3418" ro={0.7} /></mesh>
    <Bx p={[0.2, 0.62, 0]} s={[3.7, 0.08, 1.12]} c="#c99a3a" m={1} ro={0.4} rad={0.02} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Bx key={i} p={[-1.1 + i * 0.55, 0.45, 0.5]} s={[0.16, 0.14, 0.04]} c="#1a1008" rad={0.01} />)}
    <Bx p={[-1.3, 1.25, 0]} s={[0.8, 0.6, 0.98]} c="#6a4020" ro={0.7} />
    {([[-0.6, 2.4], [0.5, 2.9], [1.5, 2.1]] as [number, number][]).map(([x, hh], i) => <group key={i} position={[x, 0.95, 0]}>
      <Cy p={[0, hh / 2, 0]} r={0.05} r2={0.04} h={hh} c="#3a2412" ro={0.8} seg={10} />
      {[0.42, 0.75].map((f, j) => <mesh key={j} position={[0.18, hh * f, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[1.1 - j * 0.25, 1.1 - j * 0.25, hh * 0.3, 20, 1, true, -0.55, 1.1]} /><Mat c="#efe6d2" ro={0.9} ds /></mesh>)}
      <mesh position={[0.22, hh + 0.08, 0]} castShadow><boxGeometry args={[0.4, 0.14, 0.01]} /><Mat c={flag} ro={0.8} ds /></mesh>
    </group>)}
  </group>;
