// marcus02 · EL MUNDO: la casa de Marcus en corte (sótano con el furnace, planta baja, planta alta, ático) en un atardecer
// helado de Georgia. El aire caliente se escapa por arriba (ático: muros, caños, campana del baño) y el frío entra por abajo
// (rim joist, enchufes, ventana, bajo la puerta): el "efecto chimenea" se ve como corrientes naranjas y celestes.
// Los 12 puntos del video viven acá (PT.n1…n12) y la cámara vuela de uno al otro; con el #7 sellado las corrientes se apagan.
// UNA cámara keyada a la voz (makeAt). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";
import { makeAt } from "../kits/yanqui3d/engine";
import CAPS from "./caps.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

export const at = makeAt(CAPS as [string, number][]);

// ---------------- EVENTOS (segundos de la voz) ----------------
export const EV = {
  smoke: at("Watch the smoke"),
  intoOutlet: at("gets pulled right into"),
  money: at("That's your money"),
  leaving: at("leaving the house through"),
  twelve: at("12 things most techs"),
  every: at("For every one"),
  seven: at("number seven is the big one"),
  drafty: at("In a drafty old house"),
  n1: at("Number one"),
  n2: at("Number two"),
  n3: at("Number three"),
  n4: at("Number four"),
  n5: at("Number five"),
  n6: at("Number six"),
  n7: at("And now, number seven"),
  stack: at("Your house is a chimney"),
  slips: at("it slips out the top"),
  pulls: at("pulls cold air in at the bottom"),
  breathing: at("That's the house breathing in"),
  atticFirst: at("The attic first"),
  dirty: at("Anywhere you see dirty insulation"),
  hatch: at("The attic hatch"),
  rim: at("called the rim joist"),
  outlets: at("Then the outlets and switches"),
  doors: at("And last, the doors"),
  close: at("close to half", 600),
  staysDone: at("And it stays done"),
  n8: at("Number eight"),
  n9: at("Number nine"),
  n10: at("Number 10"),
  n11: at("Number 11"),
  n12: at("Number 12"),
  addUp: at("So let's add it up"),
};

// ---------------- PUNTOS (para rótulos, portales y los 12 pines) ----------------
export const PT = {
  outlet: [0.9, 0.35, -2.45] as V3,
  n1: [-0.4, 1.5, -2.44] as V3,        // termostato
  n2: [-3.62, -1.75, -1.6] as V3,      // ranura del filtro
  n3: [0.75, 3.15, -0.9] as V3,        // rejilla del cuarto de huéspedes
  n4: [-3.8, 3.75, -1.0] as V3,        // la cama
  n5: [-3.0, -0.35, -1.9] as V3,       // unión del ducto en el sótano
  n6: [3.7, 0.95, -0.6] as V3,         // bomba de calor afuera
  n7: [-1.0, 6.1, -1.6] as V3,         // agujeros del ático (el grande)
  n8: [0.5, 2.62, -0.2] as V3,         // ventilador de techo
  n9: [-2.4, 3.75, -2.05] as V3,       // humidificador
  n10: [0.5, 1.7, -2.45] as V3,        // ventana del living
  n11: [-3.62, -1.0, -1.38] as V3,     // la llave del furnace
  n12: [-4.25, -1.2, -1.1] as V3,      // el furnace
  rim: [-2.0, -0.12, -2.42] as V3,
  hatch: [-2.6, 5.95, 0.6] as V3,
  door: [2.0, 0.15, 0.6] as V3,
  ridge: [-2.0, 8.3, 0] as V3,
};

// ---------------- CÁMARA: vistas con nombre + paradas keyadas a la voz ----------------
type View = { p: V3; l: V3; fov: number };
const VW: Record<string, View> = {
  wide: { p: [-1.6, 4.0, 15.5], l: [-1.8, 3.4, 0], fov: 44 },
  street: { p: [7, 9.5, 27], l: [-1, 2.2, 0], fov: 40 },
  outlet: { p: [0.95, 0.62, -1.35], l: [0.9, 0.38, -2.5], fov: 34 },
  living: { p: [0.2, 1.6, 2.6], l: [0.4, 1.3, -1.6], fov: 40 },
  n1: { p: [-0.35, 1.6, -0.75], l: [-0.4, 1.5, -2.5], fov: 34 },
  n2: { p: [-3.0, -1.35, 1.4], l: [-4.0, -1.7, -1.6], fov: 36 },
  n3: { p: [0.7, 4.5, 1.6], l: [0.7, 3.2, -1.0], fov: 38 },
  n4: { p: [-2.7, 4.6, 2.3], l: [-3.7, 3.6, -1.2], fov: 38 },
  n5: { p: [-2.5, -0.7, 1.5], l: [-3.0, -0.4, -1.9], fov: 36 },
  n6: { p: [6.3, 2.0, 4.2], l: [3.7, 0.6, -0.6], fov: 38 },
  n7: { p: [-1.6, 7.25, 3.2], l: [-1.8, 6.4, -1.0], fov: 40 },
  attic: { p: [-0.9, 6.75, 0.9], l: [-1.0, 6.05, -1.6], fov: 36 },
  stack: { p: [-1.8, 2.6, 19], l: [-1.8, 2.6, 0], fov: 40 },
  rim: { p: [-1.5, -0.75, 0.6], l: [-2.1, -0.15, -2.45], fov: 36 },
  hatch: { p: [-1.9, 4.3, 2.4], l: [-2.6, 5.9, 0.6], fov: 38 },
  door: { p: [0.0, 0.9, 2.6], l: [2.0, 0.3, 0.6], fov: 38 },
  n8: { p: [0.7, 1.4, 2.5], l: [0.5, 2.45, -0.2], fov: 40 },
  n9: { p: [-1.9, 4.1, -0.5], l: [-2.4, 3.7, -2.05], fov: 34 },
  n10: { p: [0.5, 1.8, 0.4], l: [0.5, 1.7, -2.5], fov: 36 },
  n11: { p: [-2.9, -1.05, 0.3], l: [-3.62, -1.1, -1.5], fov: 34 },
  n12: { p: [-3.1, -0.9, 2.3], l: [-4.25, -1.4, -1.4], fov: 38 },
};
// paradas: [segundo, vista] — la cámara llega a la vista en 1,2 s y después se acerca despacio (push)
const STOPS: [number, string][] = [
  [0, "outlet"],
  [EV.money, "living"], [EV.leaving, "wide"], [EV.twelve - 0.6, "wide"], [EV.seven, "n7"],
  [EV.n1, "n1"], [EV.n2, "n2"], [EV.n3, "n3"], [EV.n4, "n4"], [EV.n5, "n5"], [EV.n6, "n6"],
  [EV.n7, "n7"], [EV.stack - 0.4, "stack"], [EV.atticFirst, "attic"], [EV.hatch, "hatch"], [EV.rim - 1.2, "rim"],
  [EV.outlets, "outlet"], [EV.doors, "door"], [EV.close - 1.5, "stack"],
  [EV.n8, "n8"], [EV.n9, "n9"], [EV.n10, "n10"], [EV.n11, "n11"], [EV.n12, "n12"], [EV.addUp, "wide"],
];
const push = (v: View, k: number): View => {
  const p = v.p.map((x, i) => lerp(x, v.l[i], k)) as V3;
  return { p, l: v.l, fov: v.fov - 2 * k };
};
type Key = { t: number } & View;
export const KEYS: Key[] = (() => {
  const K: Key[] = [];
  STOPS.forEach(([a, n], i) => {
    const v = VW[n], nx = i + 1 < STOPS.length ? STOPS[i + 1][0] : a + 60;
    if (i > 0) K.push({ t: a, ...push(VW[STOPS[i - 1][1]], 0.1) });
    K.push({ t: a + (i ? 1.2 : 0), ...v });
    K.push({ t: Math.max(a + 1.3, nx - 0.01), ...push(v, 0.1) });
  });
  return K;
})();
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  const d = v3(a.p).distanceTo(v3(b.p));
  if (d > 6) p.y += Math.sin(Math.PI * k) * Math.min(4, d * 0.15); // arco en los vuelos largos
  return { p, l, fov: lerp(a.fov, b.fov, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, z: v.z };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, dp * 0.22), by: Math.min(10, dp * 0.1) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.05; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
// muro con canto claro en el corte (maqueta de arquitecto); el núcleo 0,006 más fino evita z-fighting
const Slab: React.FC<{ p: V3; s: V3; c: string; cut?: string; map?: Tx }> = ({ p, s, c, cut = "#e4ddd0", map }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={[s[0] - 0.006, s[1] - 0.006, s[2] - 0.006]} /><meshStandardMaterial color={c} roughness={0.9} map={map} /></mesh>
    <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>
  </group>
);
const Win: React.FC<{ p: V3; w?: number; h?: number; glow: number }> = ({ p, w = 1.1, h = 1.0, glow }) => (
  <group position={p}>
    <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial color="#3d5a86" transparent opacity={0.35 + glow * 0.5} toneMapped={false} /></mesh>
    {[[0, h / 2, w + 0.1, 0.07], [0, -h / 2, w + 0.1, 0.07], [-w / 2, 0, 0.07, h], [w / 2, 0, 0.07, h], [0, 0, 0.05, h]].map(([x, y, a, b], i) => (
      <mesh key={i} position={[x, y, 0.02]}><planeGeometry args={[a, b]} /><meshStandardMaterial color="#e8e2d6" /></mesh>
    ))}
  </group>
);
const Neighbor: React.FC<{ x: number; z: number; flip?: boolean; tint: string; i: number; siding?: Tx }> = ({ x, z, flip, tint, i, siding }) => {
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-4.6, 0); s.lineTo(0, 2.7); s.lineTo(4.6, 0); s.lineTo(-4.6, 0); return new THREE.ExtrudeGeometry(s, { depth: 6.4, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 }); }, []);
  return (
    <group position={[x, 0, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <Box p={[0, 2.6, 0]} s={[8, 5.2, 5.6]} c={tint} r={0.92} map={siding} rad={0.04} />
      <Box p={[0, 0.25, 0]} s={[8.2, 0.5, 5.8]} c="#6d6a66" r={1} />
      <mesh geometry={roof} position={[0, 5.2, -3.2]} castShadow receiveShadow><meshStandardMaterial color="#3a3530" roughness={0.85} /></mesh>
      {[[-2.3, 1.6], [2.3, 1.6], [-2.3, 3.9], [2.3, 3.9], [0, 3.9]].map(([wx, wy], k) => (
        <mesh key={k} position={[wx, wy, 2.81]}><planeGeometry args={[1.2, 1.05]} /><meshStandardMaterial color="#10151d" emissive="#ffb85c" emissiveIntensity={(0.4 + rnd(i * 7 + k, 3) * 0.6) * 2.2} roughness={0.2} /></mesh>
      ))}
      <Box p={[0, 1.1, 2.84]} s={[1.0, 2.2, 0.08]} c="#5a2f24" r={0.6} />
      <pointLight position={[0, 2.2, 4.2]} intensity={4} distance={7} color="#ffc27a" />
    </group>
  );
};
const Pine: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.15, 0.2, 1, 8]} /><meshStandardMaterial color="#3b2b20" /></mesh>
    {[0, 1, 2].map((k) => <mesh key={k} position={[0, 1.6 + k * 1.1, 0]} castShadow><coneGeometry args={[1.5 - k * 0.38, 1.9, 9]} /><meshStandardMaterial color="#22382a" roughness={0.95} flatShading /></mesh>)}
  </group>
);
// rueda que gira (ventilador de techo / ventilador de la bomba de calor)
const Fan: React.FC<{ p: V3; ang: number; r: number; n: number; col: string; rot?: V3 }> = ({ p, ang, r, n, col, rot }) => (
  <group position={p} rotation={rot}>
    <group rotation={[0, ang, 0]}>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i} position={[Math.cos((i / n) * 6.283) * r * 0.55, 0, Math.sin((i / n) * 6.283) * r * 0.55]} rotation={[0.15, -(i / n) * 6.283, 0]} castShadow>
          <boxGeometry args={[r, 0.02, r * 0.28]} /><meshStandardMaterial color={col} roughness={0.6} />
        </mesh>
      ))}
    </group>
    <mesh><cylinderGeometry args={[r * 0.14, r * 0.14, 0.12, 16]} /><meshStandardMaterial color="#2c2d30" metalness={0.5} roughness={0.4} /></mesh>
  </group>
);

// ---------------- CORRIENTES DE AIRE (efecto chimenea) ----------------
// cada camino es una poli-línea; las partículas lo recorren con fase propia (deterministas)
const WARM: V3[][] = [
  [[0.5, 1.0, -1.2], [0.4, 2.6, -1.4], [-0.6, 3.6, -1.6], [-1.0, 5.6, -1.6], [-1.0, 6.2, -1.6], [-1.4, 7.2, -1.0], [-2.0, 8.6, 0.2]],
  [[-3.8, 4.0, -1.0], [-4.1, 5.4, -1.8], [-4.25, 6.2, -1.9], [-3.6, 7.3, -1.0], [-2.4, 8.7, 0.0]],
  [[0.6, 3.9, -1.7], [0.6, 5.6, -2.0], [0.6, 6.2, -2.0], [-0.4, 7.4, -1.2], [-1.6, 8.7, 0.0]],
  [[-2.6, 1.2, 0.2], [-2.6, 2.7, 0.4], [-2.6, 5.4, 0.6], [-2.6, 6.2, 0.6], [-2.2, 7.6, 0.4], [-1.8, 8.7, 0.1]],
];
const COLD: V3[][] = [
  [[-2.0, -0.12, -3.6], [-2.0, -0.12, -2.4], [-2.2, -0.9, -1.4], [-2.8, -2.2, 0.0]],
  [[0.9, 0.35, -3.6], [0.9, 0.35, -2.4], [0.7, 0.3, -1.4], [0.2, 0.25, 0.0]],
  [[0.5, 1.75, -3.6], [0.5, 1.7, -2.4], [0.4, 1.1, -1.4], [0.1, 0.5, -0.2]],
  [[3.4, 0.12, 0.6], [2.05, 0.15, 0.6], [1.0, 0.2, 0.4], [-0.2, 0.25, 0.2]],
  [[-6.9, -0.12, -1.0], [-6.0, -0.12, -1.0], [-5.2, -0.8, -0.6], [-4.6, -2.0, 0.2]],
];
const along = (path: V3[], u: number): V3 => {
  const L: number[] = [0];
  for (let i = 1; i < path.length; i++) L.push(L[i - 1] + v3(path[i]).distanceTo(v3(path[i - 1])));
  const d = u * L[L.length - 1];
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
  return [0, 1, 2].map((j) => lerp(path[i - 1][j], path[i][j], cl(k))) as V3;
};
const Flow: React.FC<{ t: number; paths: V3[][]; n: number; amt: number; col: string; speed: number; map?: Tx; size: number }> = ({ t, paths, n, amt, col, speed, map, size }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const m = Math.round(n * cl(amt));
  const p = new Float32Array(Math.max(1, m) * 3);
  for (let i = 0; i < m; i++) {
    const path = paths[i % paths.length];
    const u = (rnd(i, 1) + t * speed * (0.8 + rnd(i, 2) * 0.4)) % 1;
    const q = along(path, u), w = 0.07 + 0.1 * Math.sin(u * 3.14);
    p.set([q[0] + (rnd(i, 3) - 0.5) * w * 2 + Math.sin(t * 2 + i) * 0.03, q[1] + (rnd(i, 4) - 0.5) * w, q[2] + (rnd(i, 5) - 0.5) * w * 2], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  if (m < 1) return null;
  return <points geometry={geo}><pointsMaterial color={col} size={size} map={map} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation toneMapped={false} /></points>;
};
// mancha de aislación sucia + aro rojo que la marca (#7)
const Stain: React.FC<{ p: V3; r: number; hl: number }> = ({ p, r, hl }) => (
  <group position={p}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}><circleGeometry args={[r, 28]} /><meshStandardMaterial color="#3a3333" roughness={1} transparent opacity={0.85} /></mesh>
    {hl > 0.02 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><ringGeometry args={[r * 1.15, r * 1.3, 40]} /><meshBasicMaterial color="#ff4a3d" transparent opacity={hl} toneMapped={false} /></mesh>}
  </group>
);

// ---------------- LA ESCENA ----------------
export const HouseWorld: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  // cuánto pierde la casa: 1 = colador; con "And it stays done" queda sellada (las corrientes casi desaparecen)
  const leak = 1 - 0.85 * win(t, EV.staysDone - 1.0, EV.staysDone + 1.5);
  // las corrientes se ven fuerte en el gancho y en la explicación del #7; el resto del video, suaves
  const show = Math.max(0.35, win(t, EV.smoke - 0.5, EV.smoke + 0.5) * (1 - win(t, EV.n1 - 1, EV.n1)), win(t, EV.stack - 1, EV.stack) * (1 - win(t, EV.n8 - 1, EV.n8)));
  const hl = win(t, EV.dirty, EV.dirty + 0.5) * (1 - win(t, EV.hatch, EV.hatch + 0.5));
  const fanAng = t * (t > EV.n8 ? 1.4 : 3.2);
  const hpAng = t * 9;
  const k = camAt(t);
  void k;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55} threshold={0.9} exposure={1.0} env={0.18} />
      <color attach="background" args={["#1a2436"]} />
      <fogExp2 attach="fog" args={["#1a2436", 0.014]} />
      <hemisphereLight args={["#8fa6cc", "#2a2622", 0.7]} />
      <directionalLight position={[-16, 20, 18]} intensity={0.9} color="#b7c8ee" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luces de la casa encendida (tibias): living, cocina, dormitorio, cuarto de huéspedes, sótano, ático (linterna) */}
      <pointLight position={[0.5, 2.4, 0.4]} intensity={7} distance={7} color="#ffc98a" castShadow />
      <pointLight position={[-3.6, 2.4, 0.4]} intensity={5} distance={6} color="#ffd29a" />
      <pointLight position={[-3.6, 5.4, 0.6]} intensity={5} distance={6} color="#ffc98a" />
      <pointLight position={[0.6, 5.4, 0.6]} intensity={4} distance={6} color="#ffd6a0" />
      <pointLight position={[-3.2, -0.6, 0.6]} intensity={6} distance={7} color="#ffe2b0" />
      <pointLight position={[-1.6, 7.2, 0.8]} intensity={3} distance={6} color="#fff0d0" />
      <pointLight position={[-2, 3, 8]} intensity={5} distance={16} color="#9fb6e0" />

      {/* terreno helado + corte de tierra alrededor del sótano */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[220, 220]} /><meshStandardMaterial color="#9fa99f" roughness={1} /></mesh>
      <Box p={[-7.6, -1.6, 0]} s={[3.2, 3.2, 5.4]} c="#3a2c22" r={1} />
      <Box p={[4.3, -1.6, 0]} s={[4.4, 3.2, 5.4]} c="#3a2c22" r={1} />
      <Box p={[-2, -3.2, 0]} s={[8.4, 0.3, 5.4]} c="#56585b" r={1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 8.8]} receiveShadow><planeGeometry args={[220, 5.4]} /><meshStandardMaterial color="#2f3236" roughness={0.95} /></mesh>
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-60 + i * 4.2, 0.02, 8.8]}><planeGeometry args={[1.6, 0.12]} /><meshBasicMaterial color="#c9b56a" transparent opacity={0.35} /></mesh>)}

      {/* ===== LA CASA (frente abierto en z=2.5) ===== */}
      <Slab p={[-2, 1.5, -2.6]} s={[8.2, 9.2, 0.2]} c="#d6cdbd" map={tx.siding} />
      <Slab p={[-6.05, 1.5, 0]} s={[0.2, 9.2, 5.2]} c="#d6cdbd" />
      <Slab p={[2.05, 1.5, 0]} s={[0.2, 9.2, 5.2]} c="#d6cdbd" />
      <Slab p={[-1, 4.5, 0]} s={[0.14, 3.0, 5.0]} c="#d8d0c2" />
      <Slab p={[-1, 1.5, -1.2]} s={[0.14, 3.0, 2.6]} c="#d8d0c2" />
      <Slab p={[-2, 0, 0]} s={[8.2, 0.25, 5.2]} c="#7a5a3e" cut="#b9a585" />
      <Slab p={[-2, 3.0, 0]} s={[8.2, 0.25, 5.2]} c="#7a5a3e" cut="#b9a585" />
      <Slab p={[-2, 6.0, 0]} s={[8.2, 0.22, 5.2]} c="#cfc6b6" />
      {/* techo a dos aguas (sin nieve: Georgia) */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[-2, 7.0, sd * 1.35]} rotation={[sd * -0.62, 0, 0]}>
          <Box p={[0, 0, 0]} s={[8.8, 0.22, 3.4]} c="#3b342e" />
        </group>
      ))}
      {/* ático: vigas y aislación rosa con manchas sucias en los agujeros */}
      {Array.from({ length: 13 }, (_, i) => <Box key={i} p={[-5.8 + i * 0.63, 6.2, 0]} s={[0.08, 0.18, 5.0]} c="#b08a5e" r={0.9} rad={0.01} />)}
      {Array.from({ length: 12 }, (_, i) => <Box key={"in" + i} p={[-5.5 + i * 0.63, 6.24, 0]} s={[0.54, 0.2, 4.9]} c="#e7a9a0" r={1} rad={0.06} />)}
      <Stain p={[-1.0, 6.35, -1.6]} r={0.32} hl={hl} />
      <Stain p={[-4.25, 6.35, -1.9]} r={0.28} hl={hl} />
      <Stain p={[0.6, 6.35, -2.0]} r={0.25} hl={hl} />
      <mesh position={[-4.25, 6.8, -1.9]}><cylinderGeometry args={[0.07, 0.07, 1.6, 12]} /><meshStandardMaterial color="#e8e8e4" roughness={0.4} /></mesh>
      <Box p={[-2.6, 6.12, 0.6]} s={[0.8, 0.06, 0.8]} c="#efe9dd" />
      {/* ventanas */}
      <Win p={[-3.6, 4.6, -2.49]} glow={0.6} />
      <Win p={[0.5, 4.6, -2.49]} glow={0.6} />
      <Win p={[0.5, 1.7, -2.49]} glow={0.6} />
      <Win p={[-2.4, -0.6, -2.49]} w={0.9} h={0.45} glow={0.6} />

      {/* ===== ACABADOS ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.55, 0.128, 0]} receiveShadow><planeGeometry args={[4.9, 5.0]} /><meshStandardMaterial map={tx.tile} roughness={0.35} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.128, 0]} receiveShadow><planeGeometry args={[3.0, 5.0]} /><meshStandardMaterial map={tx.planks} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 3.128, 0]} receiveShadow><planeGeometry args={[8.0, 5.0]} /><meshStandardMaterial map={tx.planks} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -3.04, 0]} receiveShadow><planeGeometry args={[8.0, 5.0]} /><meshStandardMaterial map={tx.concrete} roughness={0.9} /></mesh>
      <mesh position={[-2, 1.5, -2.497]} receiveShadow><planeGeometry args={[8.0, 2.75]} /><meshStandardMaterial map={tx.paper} roughness={0.95} /></mesh>
      <mesh position={[-2, 4.5, -2.497]} receiveShadow><planeGeometry args={[8.0, 2.75]} /><meshStandardMaterial map={tx.paper} color="#cfd8e6" roughness={0.95} /></mesh>
      <mesh position={[-2, -1.55, -2.497]} receiveShadow><planeGeometry args={[8.0, 3.0]} /><meshStandardMaterial map={tx.block} roughness={0.95} /></mesh>
      {/* rim joist: la tabla sobre el cimiento */}
      <Box p={[-2, -0.12, -2.42]} s={[8.0, 0.24, 0.06]} c="#a07a52" r={0.9} rad={0.01} />
      {/* living: alfombra, sillón, tele, lámpara, termostato, enchufe del gancho */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.135, -0.5]} receiveShadow><planeGeometry args={[2.3, 1.7]} /><meshStandardMaterial map={tx.rug} roughness={1} /></mesh>
      <Box p={[0.5, 0.3, -1.7]} s={[2.0, 0.55, 0.85]} c="#5d6a73" r={1} />
      <Box p={[0.5, 0.65, -2.05]} s={[2.0, 0.6, 0.2]} c="#56626b" r={1} />
      <mesh position={[1.75, 0.8, -2.15]} castShadow><cylinderGeometry args={[0.02, 0.02, 1.35, 8]} /><meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} /></mesh>
      <mesh position={[1.75, 1.55, -2.15]}><cylinderGeometry args={[0.16, 0.24, 0.28, 20, 1, true]} /><meshStandardMaterial color="#efe3c8" emissive="#ffcf8a" emissiveIntensity={0.9} side={THREE.DoubleSide} /></mesh>
      <Box p={[-0.4, 1.5, -2.46]} s={[0.22, 0.3, 0.04]} c="#f2f2ee" r={0.4} rad={0.01} />
      <mesh position={[-0.4, 1.53, -2.437]}><planeGeometry args={[0.12, 0.07]} /><meshBasicMaterial color="#7dffb0" toneMapped={false} /></mesh>
      <Box p={[0.9, 0.35, -2.47]} s={[0.12, 0.18, 0.02]} c="#f4f4f0" r={0.4} rad={0.005} />
      {[0.03, -0.03].map((dy) => <mesh key={dy} position={[0.9, 0.35 + dy, -2.458]}><planeGeometry args={[0.035, 0.025]} /><meshBasicMaterial color="#222" /></mesh>)}
      {[[-3.6, 4.6], [0.5, 4.6], [0.5, 1.7]].map(([x, y], i) => [-0.75, 0.75].map((dx) => (
        <Box key={i + "c" + dx} p={[x + dx, y + 0.05, -2.4]} s={[0.32, 1.3, 0.06]} c={i === 0 ? "#41506b" : "#8a5a4a"} r={1} rad={0.02} />
      )))}
      {/* ventilador de techo del living */}
      <mesh position={[0.5, 2.78, -0.2]}><cylinderGeometry args={[0.015, 0.015, 0.2, 6]} /><meshStandardMaterial color="#333" /></mesh>
      <Fan p={[0.5, 2.62, -0.2]} ang={fanAng} r={0.6} n={5} col="#6b4a30" />
      {/* cocina */}
      <Box p={[-5.3, 0.97, -1.75]} s={[1.0, 1.9, 0.85]} c="#e9ebee" r={0.3} m={0.1} />
      <Box p={[-4.3, 0.48, -2.1]} s={[0.9, 0.95, 0.75]} c="#8b6f55" />
      <Box p={[-4.3, 0.98, -2.1]} s={[0.92, 0.05, 0.78]} c="#d8d4cc" r={0.3} />
      <Box p={[-3.6, 0.48, -2.1]} s={[0.85, 0.95, 0.72]} c="#dfe2e5" r={0.35} m={0.2} />
      <Box p={[-2.6, 0.48, -2.1]} s={[1.2, 0.95, 0.75]} c="#8b6f55" />
      <Box p={[-2.6, 0.98, -2.1]} s={[1.22, 0.05, 0.78]} c="#d8d4cc" r={0.3} />
      <Box p={[-3.6, 2.35, -2.3]} s={[3.0, 0.7, 0.4]} c="#8b6f55" />
      <Box p={[-2.6, 0.38, 0.4]} s={[1.3, 0.06, 0.9]} c="#6d4c33" />
      {/* dormitorio: cama, cómoda con el humidificador */}
      <Box p={[-3.8, 3.4, -1.3]} s={[2.0, 0.5, 2.3]} c="#e4e0d8" r={1} />
      <Box p={[-3.8, 3.68, -0.95]} s={[2.04, 0.12, 1.6]} c="#4a5d78" r={1} />
      <Box p={[-3.8, 3.7, -2.25]} s={[1.6, 0.18, 0.4]} c="#f4f1ea" r={1} />
      <Box p={[-2.4, 3.3, -2.0]} s={[0.55, 0.6, 0.45]} c="#6d4c33" />
      <mesh position={[-2.4, 3.72, -2.02]}><cylinderGeometry args={[0.07, 0.09, 0.22, 16]} /><meshStandardMaterial color="#f4f4f2" roughness={0.4} /></mesh>
      {/* cuarto de huéspedes: cama chica, cajas, rejilla en el piso */}
      <Box p={[1.0, 3.35, -1.8]} s={[1.6, 0.4, 0.9]} c="#d9d2c4" r={1} />
      {[[0.0, 3.35, 0.4], [0.2, 3.62, 0.5]].map((p, i) => <Box key={i} p={p as V3} s={[0.5, 0.4, 0.45]} c="#b28d5e" r={1} />)}
      <Box p={[0.75, 3.14, -0.9]} s={[0.4, 0.02, 0.18]} c="#8c9198" m={0.6} r={0.35} />
      {/* sótano: furnace con su llave, ductos, termotanque */}
      <Box p={[-4.25, -1.6, -1.65]} s={[1.2, 2.6, 1.1]} c="#9aa0a6" r={0.5} m={0.35} />
      <Box p={[-3.63, -1.75, -1.6]} s={[0.03, 0.1, 0.9]} c="#e8e4da" r={0.6} />
      <Box p={[-3.62, -1.0, -1.38]} s={[0.04, 0.16, 0.1]} c="#f0eee8" r={0.5} rad={0.01} />
      <mesh position={[-2.6, -1.9, -1.8]} castShadow><cylinderGeometry args={[0.38, 0.38, 2.0, 24]} /><meshStandardMaterial color="#c9ccd0" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[-4.25, -0.4, -1.9]}><boxGeometry args={[0.6, 0.6, 0.6]} /><meshStandardMaterial color="#a7adb4" metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[-2.2, -0.35, -1.9]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.18, 0.18, 3.6, 16]} /><meshStandardMaterial color="#a7adb4" metalness={0.6} roughness={0.35} /></mesh>
      {[-3.0, -1.5, 0.0].map((x) => <mesh key={x} position={[x, -0.35, -1.9]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.19, 0.012, 6, 24]} /><meshStandardMaterial color="#7a7f86" metalness={0.6} /></mesh>)}

      {/* bomba de calor afuera, a la derecha */}
      <group position={[3.7, 0, -0.6]}>
        <Box p={[0, 0.05, 0]} s={[1.2, 0.1, 1.2]} c="#8e8a83" r={1} />
        <Box p={[0, 0.55, 0]} s={[0.95, 0.9, 0.95]} c="#b9bcbf" r={0.5} m={0.3} />
        <Fan p={[0, 1.02, 0]} ang={hpAng} r={0.36} n={4} col="#2c2f33" />
        <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.38, 0.45, 32]} /><meshStandardMaterial color="#2c2f33" side={THREE.DoubleSide} /></mesh>
      </group>
      {/* puerta lateral con luz por abajo */}
      <Box p={[2.06, 1.1, 0.6]} s={[0.06, 2.1, 0.9]} c="#5a2f24" r={0.6} />

      {/* EL AIRE: caliente que se va por arriba, frío que entra por abajo */}
      <Flow t={t} paths={WARM} n={520} amt={show * leak} col="#ff9a4a" speed={0.16} map={tx.flake} size={0.16} />
      <Flow t={t} paths={COLD} n={380} amt={show * leak} col="#7fc8ff" speed={0.2} map={tx.flake} size={0.14} />

      {/* vecinos y árboles */}
      <Neighbor x={15} z={0} tint="#7d7466" i={1} siding={tx.siding} />
      <Neighbor x={-17} z={0} tint="#80766b" i={3} siding={tx.siding} />
      <Neighbor x={-6} z={17.6} flip tint="#76808a" i={5} siding={tx.siding} />
      <Neighbor x={6} z={17.6} flip tint="#857a6c" i={6} siding={tx.siding} />
      {[[-9.5, 0, -3], [9.5, 0, -4], [21, 0, -5], [-22, 0, -4.5], [0, 0, 23], [-12, 0, 24]].map((p, i) => <Pine key={i} p={p as V3} s={1 + rnd(i, 9) * 0.5} />)}
    </ThreeCanvas>
  );
};
