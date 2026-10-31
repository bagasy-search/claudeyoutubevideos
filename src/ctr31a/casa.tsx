// ctr31a · EL MUNDO: «La casa de cristal». Corte 3D de la casa de Claudio, dos plantas, paredes de vidrio esmerilado,
// TODOS los caños a la vista (cobre = agua que entra, PVC gris = desagües), el agua como luz azul que circula por los caños
// y los 5 tapones en rojo (fregadero · lavamanos · bañera · ducha · inodoro). Todo sale de (t, ev, pose): nada guarda estado
// entre cuadros (costura de chunks del farm). Render SÓLO en el farm; acá sólo stills.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { staticFile } from "remotion";
import { BgCtx } from "./base";
import { Telon, useImgTex } from "./mesa3d";

export const W = 1920, H = 1080;
export type V3 = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const back = (x: number) => { const c = cl(x), k = 1.5; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- CÁMARA: keyframes bezier + mano lenta (0,4-1,8 Hz) ----------------
export type Pose = { p: V3; l: V3; fov?: number };
export type CKey = Pose & { t: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const mano = (t: number, amt = 1): { dp: V3; dl: V3 } => ({
  dp: [amt * (0.035 * Math.sin(t * 2.7) + 0.012 * Math.sin(t * 6.1 + 1)), amt * (0.022 * Math.sin(t * 4.4 + 2) + 0.008 * Math.sin(t * 9.3)), amt * 0.02 * Math.sin(t * 2.3 + 4)],
  dl: [amt * 0.018 * Math.sin(t * 3.1 + 0.5), amt * 0.012 * Math.sin(t * 5.2 + 3), 0],
});
export const camPath = (K: CKey[], hand = 1) => (t: number) => {
  let i = 0;
  while (i < K.length - 1 && K[i + 1].t <= t) i++;
  const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  const m = mano(t, hand);
  return { p: [p.x + m.dp[0], p.y + m.dp[1], p.z + m.dp[2]] as V3, l: [l.x + m.dl[0], l.y + m.dl[1], l.z + m.dl[2]] as V3, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
};
export const screenOf = (c: Pose, q: V3) => {
  const cam = new THREE.PerspectiveCamera(c.fov ?? 40, W / H, 0.01, 200); cam.position.set(...c.p); cam.lookAt(...c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};

// ---------------- la casa: medidas y puntos ----------------
// planta baja y = 0..2.7 (cocina izquierda · lavadero derecha) · planta alta y = 2.7..5.3 (baño izquierda · bañera derecha)
export const FL = 2.7;
export const PT = {
  sink: [-1.7, 0.9, -1.15] as V3,      // fregadero de la cocina
  basin: [-2.45, FL + 0.86, -1.22] as V3, // lavamanos
  shower: [-0.75, FL + 0.08, -0.85] as V3, // rejilla de la ducha
  toilet: [-1.55, FL + 0.42, -1.15] as V3, // inodoro
  washer: [2.25, 0.95, -1.42] as V3,   // manguera de la lavadora (pileta)
  tub: [1.75, FL + 0.55, -1.0] as V3,  // bañera
  cabinet: [-1.7, 0.42, -1.0] as V3,   // mueble bajo el fregadero
  stack: [0.25, 1.3, -1.45] as V3,     // bajante
  street: [3.7, -0.55, -1.45] as V3,
  house: [0, 2.6, -0.2] as V3,
};
// los 5 tapones, en el orden del golpe de agua del final: cocina · lavamanos · bañera · ducha · inodoro
export const PLUGS: V3[] = [PT.sink, PT.basin, PT.tub, PT.shower, PT.toilet];
// poses de cámara de cada cuarto (para aterrizar)
export const ROOM: Record<string, Pose> = {
  wide: { p: [0.4, 3.4, 9.6], l: [0, 2.55, -0.4], fov: 38 },
  wideHi: { p: [-5.2, 6.6, 8.2], l: [0, 2.4, -0.5], fov: 36 },
  kitchen: { p: [-1.2, 1.55, 2.6], l: [-1.7, 0.85, -1.1], fov: 40 },
  cabinet: { p: [-1.5, 0.75, 1.3], l: [-1.7, 0.45, -1.05], fov: 42 },
  basin: { p: [-2.0, FL + 1.35, 1.2], l: [-2.45, FL + 0.8, -1.2], fov: 40 },
  shower: { p: [-0.5, FL + 1.9, 1.0], l: [-0.75, FL + 0.1, -0.85], fov: 42 },
  toilet: { p: [-1.1, FL + 1.25, 1.2], l: [-1.55, FL + 0.45, -1.1], fov: 40 },
  tub: { p: [1.4, FL + 1.6, 1.8], l: [1.75, FL + 0.5, -1.0], fov: 40 },
  laundry: { p: [1.9, 1.55, 2.4], l: [2.1, 0.8, -1.25], fov: 40 },
  stack: { p: [1.4, 2.4, 2.2], l: [0.25, 1.8, -1.45], fov: 44 },
  street: { p: [2.2, 0.6, 2.8], l: [3.0, -0.4, -1.4], fov: 42 },
};

// caño con codos redondeados: polilínea → puntos extra en cada esquina → catmull centrípeto
const elbow = (pts: V3[], r = 0.09) => {
  const out: THREE.Vector3[] = [v3(pts[0])];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = v3(pts[i - 1]), b = v3(pts[i]), c = v3(pts[i + 1]);
    const r1 = Math.min(r, a.distanceTo(b) / 2.2), r2 = Math.min(r, b.distanceTo(c) / 2.2);
    out.push(b.clone().add(a.clone().sub(b).setLength(r1)), b.clone().add(c.clone().sub(b).setLength(r2)));
  }
  out.push(v3(pts[pts.length - 1]));
  return new THREE.CatmullRomCurve3(out, false, "centripetal");
};
// desagües (de cada artefacto a la bajante y a la calle) y el agua que entra (cobre)
const DR: V3[][] = [
  [PT.sink, [-1.7, 0.55, -1.15], [-1.7, 0.42, -1.4], [-1.7, -0.25, -1.4], [0.25, -0.38, -1.45]],
  [PT.basin, [-2.45, FL + 0.45, -1.22], [-2.45, FL + 0.4, -1.45], [-2.45, FL - 0.05, -1.45], [0.25, FL - 0.15, -1.45]],
  [PT.shower, [-0.75, FL - 0.12, -0.85], [-0.75, FL - 0.12, -1.45], [0.25, FL - 0.2, -1.45]],
  [PT.toilet, [-1.55, FL - 0.1, -1.15], [-1.55, FL - 0.1, -1.45], [0.25, FL - 0.25, -1.45]],
  [PT.washer, [2.25, 0.45, -1.45], [2.25, -0.3, -1.45], [0.25, -0.42, -1.45]],
  [PT.tub, [1.75, FL + 0.1, -1.0], [1.75, FL - 0.1, -1.45], [0.25, FL - 0.22, -1.45]],
];
const STACK: V3[] = [[0.25, 5.6, -1.45], [0.25, -0.55, -1.45], PT.street];
const SUP: V3[][] = [
  [[-3.8, 0.3, -1.5], [-0.25, 0.3, -1.5], [-0.25, FL + 1.1, -1.5], [-2.45, FL + 1.1, -1.5], [-2.45, FL + 0.95, -1.3]],
  [[-1.7, 0.3, -1.5], [-1.7, 1.15, -1.5], [-1.7, 1.15, -1.32]],
  [[-0.25, 0.3, -1.5], [2.25, 0.3, -1.5], [2.25, 1.25, -1.5]],
  [[-0.25, FL + 1.1, -1.5], [-0.75, FL + 1.1, -1.5], [-0.75, FL + 2.0, -1.5], [-0.75, FL + 2.0, -1.0]],
  [[-0.25, FL + 0.6, -1.5], [1.75, FL + 0.6, -1.5], [1.75, FL + 0.75, -1.3]],
];

// ---------------- ev: lo que pasa en la casa ----------------
export type CasaEv = {
  build: number;            // 0 → 1: la casa se arma desde la profundidad
  flow: number;             // agua que circula (0 quieta · 1 normal)
  plugs: number[];          // 5 tapones: 0 apagado · 1 rojo encendido
  blast: number;            // golpe de agua: 0..6 recorre desagüe por desagüe
  focus?: string;           // cuarto iluminado
  focusAmt?: number;
  day?: number;
  glass?: number;           // opacidad del vidrio (más alto = más esmerilado)
  loop?: number;            // 0..1 la manguera de la lavadora sube en bucle (truco 16)
  spin?: number;            // giro de la casa (recap)
};
export const CEV0: CasaEv = { build: 1, flow: 1, plugs: [0, 0, 0, 0, 0], blast: 0, day: 0.85, glass: 1, loop: 0, spin: 0 };

const Piece: React.FC<{ k: number; i: number; n: number; children: React.ReactNode }> = ({ k, i, n, children }) => {
  // cada pieza llega de a una desde atrás (z) y de abajo, con sobrepico, y asienta
  const x = cl(k * (n + 4) - i) / 1;
  if (x <= 0) return null;
  const b = back(Math.min(1, x / 1.6));
  return <group position={[0, (1 - b) * -1.2, (1 - b) * -7]} scale={0.6 + 0.4 * b}>{children}</group>;
};
const Bx: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; ro?: number; map?: THREE.Texture; e?: string; ei?: number; cast?: boolean }> = ({ p, s, c, r = 0.03, m = 0, ro = 0.6, map, e, ei = 0, cast = true }) => (
  <mesh position={p} geometry={rbox(s[0], s[1], s[2], r)} castShadow={cast} receiveShadow>
    <meshStandardMaterial color={c} metalness={m} roughness={ro} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} />
  </mesh>
);
const Glass: React.FC<{ p: V3; s: V3; o: number }> = ({ p, s, o }) => (
  <group position={p}>
    <mesh renderOrder={2}><boxGeometry args={s} /><meshPhysicalMaterial color="#dce8ee" transparent opacity={0.13 * o} roughness={0.25} metalness={0} clearcoat={1} clearcoatRoughness={0.15} depthWrite={false} /></mesh>
    {/* perfiles de aluminio (bordes) */}
    {(() => {
      const [a, b, c] = s, f = 0.035, L: [V3, V3][] = [];
      const big = (q: number) => q > 0.06;
      if (!big(a)) { L.push([[0, b / 2, 0], [f, f, c]], [[0, -b / 2, 0], [f, f, c]], [[0, 0, c / 2], [f, b, f]], [[0, 0, -c / 2], [f, b, f]]); }
      else { L.push([[0, b / 2, 0], [a, f, f]], [[0, -b / 2, 0], [a, f, f]], [[a / 2, 0, 0], [f, b, f]], [[-a / 2, 0, 0], [f, b, f]]); }
      return L.map(([q, z], i) => <mesh key={i} position={q}><boxGeometry args={z} /><meshStandardMaterial color="#d7dde2" metalness={0.75} roughness={0.28} /></mesh>);
    })()}
  </group>
);
const Pipe: React.FC<{ pts: V3[]; r: number; mat: "pvc" | "cu"; hi?: number }> = ({ pts, r, mat, hi = 0 }) => {
  const g = useMemo(() => new THREE.TubeGeometry(elbow(pts, r * 2.4), 90, r, 14, false), [pts, r]);
  return (
    <mesh geometry={g} castShadow>
      {mat === "cu"
        ? <meshStandardMaterial color="#c47a4a" metalness={0.95} roughness={0.28} emissive="#ff8a40" emissiveIntensity={0.15 * hi} />
        : <meshPhysicalMaterial color="#9aa2a8" metalness={0.05} roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.3} emissive="#3aa0ff" emissiveIntensity={0.4 * hi} />}
    </mesh>
  );
};
// el agua como luz: puntos que viajan por el caño (posición = f(t), sin estado)
const Flow: React.FC<{ curve: THREE.Curve<THREE.Vector3>; t: number; n: number; speed: number; amt: number; col: string; size: number; seed: number }> = ({ curve, t, n, speed, amt, col, size, seed }) => {
  const geo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  if (amt <= 0.01) return null;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const u = (rnd(i, seed) + t * speed) % 1, q = curve.getPointAt(u);
        const s = size * (0.6 + 0.6 * rnd(i, seed + 3)) * amt;
        return <mesh key={i} geometry={geo} position={q} scale={s}><meshBasicMaterial color={col} toneMapped={false} transparent opacity={0.9} /></mesh>;
      })}
    </group>
  );
};
const Plug: React.FC<{ p: V3; on: number; t: number; i: number }> = ({ p, on, t, i }) => {
  // el tapón rojo: disco que late lento (≤1 Hz) + halo; apagado queda gris oscuro, nunca desaparece de golpe
  const puls = 1 + 0.12 * Math.sin(t * 5.2 + i * 1.7) * on;
  return (
    <group position={p}>
      <mesh scale={[puls, 1, puls]}><cylinderGeometry args={[0.075, 0.085, 0.045, 28]} /><meshStandardMaterial color={new THREE.Color("#3a3d42").lerp(new THREE.Color("#ff2a1a"), on)} emissive="#ff2a1a" emissiveIntensity={2.4 * on} roughness={0.35} toneMapped={false} /></mesh>
      <pointLight color="#ff3a22" intensity={1.6 * on} distance={1.1} decay={2} />
      <mesh scale={0.22 * puls * (0.4 + 0.6 * on)}><sphereGeometry args={[1, 18, 12]} /><meshBasicMaterial color="#ff4030" transparent opacity={0.16 * on} depthWrite={false} toneMapped={false} /></mesh>
    </group>
  );
};

// artefactos (cerámica blanca, acero)
const Fixtures: React.FC<{ tx: ReturnType<typeof useTextures>; loop: number }> = ({ tx, loop }) => {
  const hose = useMemo(() => {
    const up = 0.95 + loop * 0.55;
    return new THREE.TubeGeometry(elbow([[2.25, 0.55, -1.0], [2.25, up, -1.1], [2.25, up, -1.4], [2.25, 0.95, -1.42]], 0.12), 60, 0.022, 10, false);
  }, [loop]);
  return (
    <group>
      {/* cocina: mueble de fórmica + mesada + pileta doble de acero */}
      <Bx p={[-1.7, 0.42, -1.18]} s={[1.6, 0.84, 0.62]} c="#c9b99c" ro={0.55} />
      <Bx p={[-1.7, 0.42, -0.86]} s={[0.7, 0.72, 0.03]} c="#d8cbb1" ro={0.5} />
      <Bx p={[-1.7, 0.88, -1.18]} s={[1.66, 0.05, 0.66]} c="#e9e6df" ro={0.3} />
      <Bx p={[-1.7, 0.86, -1.15]} s={[0.78, 0.05, 0.46]} c="#9aa0a6" m={0.9} ro={0.22} />
      <mesh position={[-1.7, 1.12, -1.42]} rotation={[0.25, 0, 0]}><torusGeometry args={[0.11, 0.016, 12, 30, Math.PI]} /><meshStandardMaterial color="#cfd3d7" metalness={0.95} roughness={0.18} /></mesh>
      {/* lavadero: lavadora + pileta de concreto */}
      <Bx p={[1.5, 0.45, -1.1]} s={[0.66, 0.9, 0.64]} c="#dfe0dd" ro={0.4} />
      <mesh position={[1.5, 0.5, -0.77]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.19, 0.035, 14, 36]} /><meshStandardMaterial color="#c9ced3" metalness={0.8} roughness={0.25} /></mesh>
      <mesh position={[1.5, 0.5, -0.78]}><circleGeometry args={[0.18, 32]} /><meshPhysicalMaterial color="#9fc6dc" transparent opacity={0.55} roughness={0.05} /></mesh>
      <Bx p={[2.25, 0.82, -1.25]} s={[0.6, 0.3, 0.48]} c="#8e8f8c" ro={0.85} map={tx.concrete} />
      <mesh geometry={hose} castShadow><meshStandardMaterial color="#6b6f73" roughness={0.6} /></mesh>
      {/* baño: lavamanos de pie, inodoro con tanque, plato de ducha con rejilla, bañera esmaltada */}
      <Bx p={[-2.45, FL + 0.42, -1.25]} s={[0.16, 0.8, 0.16]} c="#e4e1da" ro={0.32} />
      <Bx p={[-2.45, FL + 0.86, -1.22]} s={[0.56, 0.12, 0.42]} c="#e4e1da" ro={0.32} r={0.06} />
      <mesh position={[-2.45, FL + 0.93, -1.2]}><cylinderGeometry args={[0.17, 0.12, 0.05, 30]} /><meshStandardMaterial color="#d8d5ce" roughness={0.3} /></mesh>
      <Bx p={[-1.55, FL + 0.2, -1.12]} s={[0.36, 0.4, 0.5]} c="#e4e1da" ro={0.32} r={0.12} />
      <Bx p={[-1.55, FL + 0.62, -1.38]} s={[0.42, 0.42, 0.16]} c="#e4e1da" ro={0.32} r={0.04} />
      <Bx p={[-0.75, FL + 0.04, -0.85]} s={[0.9, 0.06, 0.9]} c="#dedbd4" ro={0.35} />
      <mesh position={[-0.75, FL + 0.075, -0.85]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.14, 0.14]} /><meshStandardMaterial color="#b8bcc0" metalness={0.95} roughness={0.25} /></mesh>
      <Bx p={[1.75, FL + 0.28, -1.0]} s={[1.5, 0.56, 0.72]} c="#e2dfd7" ro={0.28} r={0.12} />
      <Bx p={[1.75, FL + 0.5, -1.0]} s={[1.32, 0.14, 0.54]} c="#d9e9f0" ro={0.05} r={0.05} />
    </group>
  );
};

const Rig: React.FC<{ c: Pose }> = ({ c }) => {
  const { camera } = useThree(); const k = camera as THREE.PerspectiveCamera;
  k.position.set(...c.p); k.up.set(0, 1, 0); k.lookAt(...c.l); k.fov = c.fov ?? 40; k.near = 0.02; k.far = 200; k.updateProjectionMatrix();
  return null;
};

export const Casa: React.FC<{ t: number; ev?: Partial<CasaEv>; cam: Pose; children?: React.ReactNode }> = ({ t, ev: ev0, cam, children }) => {
  const ev = { ...CEV0, ...ev0 };
  const tx = useTextures();
  const curves = useMemo(() => ({ dr: DR.map((d) => elbow(d, 0.14)), st: elbow(STACK, 0.2), sup: SUP.map((s) => elbow(s, 0.1)) }), []);
  const day = ev.day ?? 0.85, g = ev.glass ?? 1, B = ev.build;
  const N = 14;
  // golpe de agua: ev.blast 0..6 → el desagüe i se llena de luz cuando blast pasa por i
  // DR = sink · basin · shower · toilet · washer · tub → turno en el golpe (cocina, lavamanos, bañera, ducha, inodoro; lavadora no)
  const ORD = [0, 1, 3, 4, 99, 2];
  const blk = (k: number) => sm(ev.blast - k) * (1 - sm(ev.blast - k - 1.3));
  const bl = (i: number) => (i >= 5.5 ? Math.max(...[0, 1, 2, 3, 4].map(blk)) : blk(ORD[i]));
  const hiRoom = (r: string) => (ev.focus === r ? ev.focusAmt ?? 1 : 0);
  const bgId = React.useContext(BgCtx), [tel, telDone] = useImgTex(bgId ? staticFile("ctr31a/vbg/" + bgId + ".jpg") : undefined);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Rig c={cam} />
      {tel && <Telon cam={cam} tex={tel} dist={16} tone="#8f8a82" done={telDone} />}
      <Post bloom={0.45} threshold={1.0} exposure={0.98} env={0.5} />
      <color attach="background" args={[new THREE.Color("#0a1118").lerp(new THREE.Color("#1b2633"), day).getHex()]} />
      <fog attach="fog" args={[new THREE.Color("#0a1118").lerp(new THREE.Color("#1b2633"), day).getHex(), 14, 34]} />
      <hemisphereLight args={[0xcfe3ff, 0x2a241e, 0.55 + 0.25 * day]} />
      <directionalLight position={[-6, 9, 6]} intensity={1.3 + 0.8 * day} color="#fff2e0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-4} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0, 9, 4]} angle={0.6} penumbra={0.9} intensity={1.4} color="#e4f1ff" target-position={[0, 2, -1]} />
      {/* luz del cuarto en foco (rampa, siempre montada) */}
      {(["kitchen", "basin", "shower", "toilet", "laundry", "tub", "cabinet", "stack"] as const).map((r) => {
        const q = ROOM[r].l; return <pointLight key={r} position={[q[0], q[1] + 1.1, q[2] + 0.9]} intensity={0.9 * hiRoom(r)} distance={3.2} color="#fff1dd" />;
      })}
      <group rotation={[0, (ev.spin ?? 0) * Math.PI * 2, 0]}>
        {/* terreno y losas */}
        <Piece k={B} i={0} n={N}><mesh position={[0, -0.9, 0]} receiveShadow><boxGeometry args={[14, 0.6, 9]} /><meshStandardMaterial color="#3d3a33" roughness={0.95} /></mesh>
          <mesh position={[0, -0.59, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 9]} /><meshStandardMaterial color="#4c5a3e" roughness={0.95} /></mesh></Piece>
        <Piece k={B} i={1} n={N}><Bx p={[0, -0.1, 0]} s={[6.6, 0.2, 3.4]} c="#b9a283" map={tx.planks} ro={0.7} r={0.02} /></Piece>
        <Piece k={B} i={5} n={N}><Bx p={[0, FL, 0]} s={[6.6, 0.18, 3.4]} c="#d8d2c6" map={tx.tile} ro={0.5} r={0.02} /></Piece>
        {/* caños: bajante, desagües, cobre */}
        <Piece k={B} i={2} n={N}><Pipe pts={STACK} r={0.075} mat="pvc" hi={bl(5.5)} /></Piece>
        {DR.map((d, i) => <Piece key={"d" + i} k={B} i={3 + (i % 3)} n={N}><Pipe pts={d} r={0.045} mat="pvc" hi={bl(i)} /></Piece>)}
        {SUP.map((s, i) => <Piece key={"s" + i} k={B} i={4 + (i % 2)} n={N}><Pipe pts={s} r={0.02} mat="cu" /></Piece>)}
        {/* artefactos */}
        <Piece k={B} i={7} n={N}><Fixtures tx={tx} loop={ev.loop ?? 0} /></Piece>
        {/* paredes de vidrio esmerilado: fondo, costados, divisiones, techo */}
        <Piece k={B} i={8} n={N}><Glass p={[0, 1.35, -1.62]} s={[6.6, 2.7, 0.03]} o={g} /><Glass p={[0, FL + 1.3, -1.62]} s={[6.6, 2.6, 0.03]} o={g} /></Piece>
        <Piece k={B} i={9} n={N}><Glass p={[-3.3, 1.35, 0]} s={[0.03, 2.7, 3.4]} o={g} /><Glass p={[-3.3, FL + 1.3, 0]} s={[0.03, 2.6, 3.4]} o={g} /></Piece>
        <Piece k={B} i={10} n={N}><Glass p={[3.3, 1.35, 0]} s={[0.03, 2.7, 3.4]} o={g} /><Glass p={[3.3, FL + 1.3, 0]} s={[0.03, 2.6, 3.4]} o={g} /></Piece>
        <Piece k={B} i={11} n={N}><Glass p={[0.55, 1.35, 0]} s={[0.03, 2.7, 3.4]} o={g * 0.8} /><Glass p={[0.55, FL + 1.3, 0]} s={[0.03, 2.6, 3.4]} o={g * 0.8} /></Piece>
        <Piece k={B} i={12} n={N}>
          {/* techo a dos aguas de vidrio */}
          {[-1, 1].map((sd) => <group key={sd} position={[0, FL + 2.6 + 0.55, 0]} rotation={[sd * 0.38, 0, 0]}><Glass p={[0, 0, sd * -0.85]} s={[6.7, 0.03, 1.85]} o={g * 0.9} /></group>)}
        </Piece>
        {/* el agua como luz azul circulando */}
        {B > 0.95 && <>
          {curves.sup.map((c, i) => <Flow key={"fs" + i} curve={c} t={t} n={10} speed={0.16} amt={ev.flow * 0.7} col="#bfe6ff" size={0.016} seed={20 + i} />)}
          {curves.dr.map((c, i) => <Flow key={"fd" + i} curve={c} t={t} n={9 + Math.round(bl(i) * 30)} speed={0.11 + bl(i) * 0.4} amt={Math.max(ev.flow, bl(i) * 2)} col="#3fb2ff" size={0.026} seed={40 + i} />)}
          <Flow curve={curves.st} t={t} n={16 + Math.round(bl(5.5) * 40)} speed={0.09 + bl(5.5) * 0.3} amt={Math.max(ev.flow, bl(5.5) * 2)} col="#3fb2ff" size={0.034} seed={60} />
        </>}
        {PLUGS.map((p, i) => <Plug key={i} p={p} on={(ev.plugs[i] ?? 0) * sm(B * 1.2 - 0.2)} t={t} i={i} />)}
        {children}
      </group>
    </ThreeCanvas>
  );
};
