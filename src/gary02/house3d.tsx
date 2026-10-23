// gary02 · EL MUNDO: la casa de Gary en corte, de noche, en pleno apagón (toda la calle a oscuras).
// En el garaje: el generador a nafta rugiendo y largando humo, el portón levantado "un pie", el cable naranja que
// cruza la casa hasta la heladera. Y el monóxido: niebla gris que pasa por debajo de la puerta y sube al dormitorio
// mientras la alarma de CO del pasillo titila. UNA cámara, sin cortes; eventos clavados a la voz (segundos globales).
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { Generator, Exhaust, CoFog, CoAlarm } from "./gear3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- CÁMARA: keyframes [t, pos, look, fov]; easing cúbico + arco en los traslados largos ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number };
export const KEYS: Key[] = [
  // 8,6 "It's cheaper, and it won't try to kill you in your sleep": de la calle a oscuras al dormitorio con la niebla
  { t: 8.55, p: [7, 17, 31], l: [-1, 1, 2], fov: 40 },
  { t: 10.1, p: [-2.6, 3.4, 11.5], l: [-2.2, 1.8, -0.5], fov: 38 },
  { t: 11.5, p: [-3.0, 4.6, 3.0], l: [-3.8, 3.6, -1.4], fov: 36 },
  { t: 12.7, p: [-3.1, 4.5, 2.6], l: [-3.8, 3.6, -1.4], fov: 34 },
  // E · 20,8 garaje: el generador; "cracked the big door open a foot"; "ran a cord into the kitchen" → la heladera
  { t: 20.8, p: [8.4, 2.7, 6.8], l: [4.6, 0.6, -0.4], fov: 38 },
  { t: 21.6, p: [8.2, 2.4, 6.4], l: [4.8, 0.5, -0.4], fov: 37 },
  { t: 22.9, p: [8.6, 1.0, 3.4], l: [6.6, 0.25, 0.4], fov: 34 },
  { t: 24.5, p: [6.4, 1.5, 4.8], l: [4.5, 0.4, 0.2], fov: 36 },
  { t: 26.2, p: [-0.6, 1.5, 4.8], l: [-2.4, 0.3, -0.4], fov: 38, arc: 0.25 },
  { t: 27.7, p: [-4.2, 1.35, 2.1], l: [-5.2, 0.9, -1.5], fov: 36 },
  // F2 · 29,6 "You go to bed": sube al dormitorio, el despertador marca 3:00
  { t: 29.55, p: [-4.2, 1.35, 2.1], l: [-5.2, 0.9, -1.5], fov: 36 },
  { t: 30.7, p: [-2.55, 3.95, 0.9], l: [-2.4, 3.66, -2.0], fov: 32, arc: 0.3 },
  { t: 31.7, p: [-2.5, 3.92, 0.6], l: [-2.4, 3.66, -2.0], fov: 31 },
  // H · 37,6 el humo no se queda en el garaje: sigue a la niebla por debajo de la puerta, la cocina y arriba
  { t: 37.6, p: [7.2, 2.3, 6.4], l: [4.2, 0.6, -0.6], fov: 38 },
  { t: 40.1, p: [5.4, 1.5, 5.0], l: [3.0, 0.4, -0.2], fov: 36 },
  { t: 41.5, p: [3.1, 0.6, 3.3], l: [1.4, 0.15, 0.6], fov: 40 },
  { t: 43.1, p: [-0.6, 1.5, 5.6], l: [-2.6, 1.0, -0.8], fov: 40 },
  { t: 44.6, p: [-2.2, 4.7, 4.6], l: [-3.4, 3.7, -1.4], fov: 38, arc: 0.3 },
  { t: 45.9, p: [-2.3, 4.8, 5.4], l: [-3.4, 3.7, -1.4], fov: 38 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3; // arco de vuelo: sube y vuelve a bajar
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
// velocidad de la cámara en píxeles de pantalla → blur de movimiento real
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
// proyección de un punto 3D a la pantalla con la MISMA cámara (para portales y rótulos HTML)
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));

const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.05; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- reloj LED (CanvasTexture: dígitos de 7 segmentos que titilan y se apagan) ----------------
const useLed = (txt: string, color: string, glow: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 96; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#050607"; g.fillRect(0, 0, 256, 96);
  g.font = "bold 74px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "rgba(255,255,255,0.05)"; g.fillText("8:88", 128, 52);
  if (glow > 0.02) { g.shadowColor = color; g.shadowBlur = 22 * glow; g.globalAlpha = glow; g.fillStyle = color; g.fillText(txt, 128, 52); g.globalAlpha = 1; g.shadowBlur = 0; }
  tex.needsUpdate = true;
  return tex;
};
const Led: React.FC<{ pos: [number, number, number]; w: number; txt: string; color: string; glow: number; rotY?: number }> = ({ pos, w, txt, color, glow, rotY = 0 }) => {
  const tex = useLed(txt, color, glow);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh><planeGeometry args={[w, w * 0.375]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      {glow > 0.05 && <pointLight position={[0, 0, 0.15]} intensity={glow * 0.6} distance={1.6} color={color} />}
    </group>
  );
};

// ---------------- piezas de la casa ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: [number, number, number] }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
// muro con canto claro en el corte (se ve el espesor, como maqueta de arquitecto)
const Slab: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; cut?: string; map?: Tx; inner?: Tx }> = ({ p, s, c, cut = "#e4ddd0", map, inner }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.9} map={map} /></mesh>
    {inner && s[2] < 0.5 && <mesh position={[0, 0, s[2] / 2 + 0.003]} receiveShadow><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color="#ffffff" roughness={0.95} map={inner} /></mesh>}
    {inner && s[0] < 0.5 && <mesh position={[s[0] / 2 + 0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[s[2], s[1]]} /><meshStandardMaterial color="#ffffff" roughness={0.95} map={inner} /></mesh>}
    {!inner && <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>}
  </group>
);
// cono de luz de luna que entra por una ventana (aditivo, polvo en el aire)
const Beam: React.FC<{ p: [number, number, number]; rot: [number, number, number]; len: number; w: number; o: number; col?: string }> = ({ p, rot, len, w, o, col = "#9fc0ff" }) => o < 0.01 ? null : (
  <mesh position={p} rotation={rot}><cylinderGeometry args={[w * 0.55, w, len, 24, 1, true]} />
    <meshBasicMaterial color={col} transparent opacity={o * 0.11} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
);
// ventana que deja entrar la luz de la luna (vidrio emisivo azul + marco)
const Win: React.FC<{ p: [number, number, number]; w?: number; h?: number; glow: number; warm?: number }> = ({ p, w = 1.1, h = 1.0, glow, warm = 0 }) => (
  <group position={p}>
    <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial color={new THREE.Color("#6f93c9").lerp(new THREE.Color("#ffc874"), warm)} transparent opacity={0.25 + glow * 0.6} toneMapped={false} /></mesh>
    {[[0, h / 2, w + 0.1, 0.07], [0, -h / 2, w + 0.1, 0.07], [-w / 2, 0, 0.07, h], [w / 2, 0, 0.07, h], [0, 0, 0.05, h]].map(([x, y, a, b], i) => (
      <mesh key={i} position={[x, y, 0.02]}><planeGeometry args={[a, b]} /><meshStandardMaterial color="#e8e2d6" /></mesh>
    ))}
  </group>
);
// casa vecina simple (caja + techo a dos aguas + nieve + ventanas que se apagan)
const Neighbor: React.FC<{ x: number; z: number; flip?: boolean; lit: number; tint: string; i: number; siding?: Tx }> = ({ x, z, flip, lit, tint, i, siding }) => {
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-4.6, 0); s.lineTo(0, 2.7); s.lineTo(4.6, 0); s.lineTo(-4.6, 0); return new THREE.ExtrudeGeometry(s, { depth: 6.4, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 }); }, []);
  const snowRoof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-4.55, 0.18); s.lineTo(0, 2.78); s.lineTo(4.55, 0.18); s.lineTo(4.2, 0.26); s.lineTo(0, 2.6); s.lineTo(-4.2, 0.26); return new THREE.ExtrudeGeometry(s, { depth: 6.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.12, bevelSegments: 3 }); }, []);
  const warm = new THREE.Color("#ffb85c");
  return (
    <group position={[x, 0, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <Box p={[0, 2.6, 0]} s={[8, 5.2, 5.6]} c={tint} r={0.92} map={siding} rad={0.04} />
      <Box p={[0, 0.25, 0]} s={[8.2, 0.5, 5.8]} c="#6d6a66" r={1} />
      <mesh geometry={roof} position={[0, 5.2, -3.2]} castShadow receiveShadow><meshStandardMaterial color="#2c2f36" roughness={0.85} /></mesh>
      <mesh geometry={snowRoof} position={[0, 5.3, -3.25]} castShadow><meshStandardMaterial color="#f3f7fb" roughness={0.9} /></mesh>
      <Box p={[2.4, 7.0, -0.8]} s={[0.8, 2.2, 0.8]} c="#6b3d2e" r={0.95} />
      <Box p={[2.4, 8.15, -0.8]} s={[0.95, 0.18, 0.95]} c="#f3f7fb" r={1} />
      {[[-2.3, 1.6], [2.3, 1.6], [-2.3, 3.9], [2.3, 3.9], [0, 3.9]].map(([wx, wy], k) => {
        const on = lit * (0.55 + rnd(i * 7 + k, 3) * 0.45);
        return (
          <group key={k} position={[wx, wy, 2.81]}>
            <mesh><planeGeometry args={[1.2, 1.05]} /><meshStandardMaterial color="#10151d" emissive={warm} emissiveIntensity={on * 2.6} roughness={0.2} metalness={0.3} /></mesh>
            {[[0, 0.56, 1.36, 0.1], [0, -0.56, 1.42, 0.14], [-0.63, 0, 0.1, 1.2], [0.63, 0, 0.1, 1.2], [0, 0, 0.06, 1.05], [0, 0, 1.2, 0.06]].map(([fx, fy, w, h], q) => (
              <mesh key={q} position={[fx, fy, 0.03]}><boxGeometry args={[w, h, 0.06]} /><meshStandardMaterial color="#f2efe8" roughness={0.6} /></mesh>
            ))}
            <Box p={[0, -0.66, 0.1]} s={[1.4, 0.08, 0.22]} c="#f3f7fb" r={1} />
            {[-0.85, 0.85].map((sx) => <Box key={sx} p={[sx, 0, 0.04]} s={[0.3, 1.15, 0.05]} c="#2f4a3a" r={0.8} />)}
          </group>
        );
      })}
      <Box p={[0, 1.1, 2.84]} s={[1.0, 2.2, 0.08]} c="#5a2f24" r={0.6} />
      <mesh position={[0.32, 1.1, 2.9]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color="#c9a14a" metalness={1} roughness={0.25} /></mesh>
      <Box p={[0, 2.5, 3.5]} s={[2.4, 0.12, 1.4]} c="#3a3d44" />
      <Box p={[0, 2.6, 3.5]} s={[2.4, 0.1, 1.4]} c="#f3f7fb" r={1} />
      {[-1.05, 1.05].map((px) => <Box key={px} p={[px, 1.25, 4.1]} s={[0.12, 2.5, 0.12]} c="#f2efe8" r={0.6} />)}
      <Box p={[0, 0.1, 3.6]} s={[2.2, 0.2, 1.4]} c="#8e8a83" />
      {lit > 0.05 && <pointLight position={[0, 2.2, 4.2]} intensity={lit * 5} distance={7} color="#ffc27a" />}
    </group>
  );
};
const Pine: React.FC<{ p: [number, number, number]; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.15, 0.2, 1, 8]} /><meshStandardMaterial color="#3b2b20" /></mesh>
    {[0, 1, 2].map((k) => (
      <group key={k}>
        <mesh position={[0, 1.6 + k * 1.1, 0]} castShadow><coneGeometry args={[1.5 - k * 0.38, 1.9, 9]} /><meshStandardMaterial color="#1f3a2c" roughness={0.95} flatShading /></mesh>
        <mesh position={[0, 1.75 + k * 1.1, 0]}><coneGeometry args={[1.38 - k * 0.38, 1.5, 9]} /><meshStandardMaterial color="#eef3f8" roughness={1} transparent opacity={0.55} flatShading /></mesh>
      </group>
    ))}
  </group>
);
const StreetLight: React.FC<{ p: [number, number, number]; on: number }> = ({ p, on }) => (
  <group position={p}>
    <mesh position={[0, 2.4, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 4.8, 8]} /><meshStandardMaterial color="#30343b" metalness={0.5} roughness={0.5} /></mesh>
    <mesh position={[0, 4.85, 0.35]}><boxGeometry args={[0.35, 0.12, 0.8]} /><meshStandardMaterial color="#30343b" /></mesh>
    <mesh position={[0, 4.77, 0.55]}><sphereGeometry args={[0.13, 12, 8]} /><meshBasicMaterial color={new THREE.Color("#1a1a1a").lerp(new THREE.Color("#ffd28a"), on)} toneMapped={false} /></mesh>
    {on > 0.05 && <pointLight position={[0, 4.6, 0.6]} intensity={on * 18} distance={9} color="#ffcf8a" />}
  </group>
);

// nieve que cae (determinista)
const Snow: React.FC<{ t: number; n?: number; c: THREE.Vector3; map?: Tx }> = ({ t, n = 3200, c, map }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const X = 60, Y = 26, Z = 50;
    const x = c.x + (rnd(i, 1) - 0.5) * X + Math.sin(t * 0.6 + i) * 0.25;
    const y = Y - ((rnd(i, 2) * Y + t * (0.7 + rnd(i, 3) * 0.5)) % Y) - 2;
    const z = c.z - 6 + (rnd(i, 4) - 0.5) * Z;
    p.set([x, y, z], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color="#f4f8ff" size={0.13} map={map} alphaTest={0.02} sizeAttenuation transparent opacity={0.9} depthWrite={false} /></points>;
};

// ventilador de la caldera (rueda de paletas que gira y se frena)
const Blower: React.FC<{ ang: number }> = ({ ang }) => (
  <group position={[-4.25, -1.55, -1.08]} rotation={[0, 0, ang]}>
    <mesh><torusGeometry args={[0.34, 0.035, 8, 32]} /><meshStandardMaterial color="#8d9198" metalness={0.7} roughness={0.35} /></mesh>
    {Array.from({ length: 14 }, (_, i) => (
      <mesh key={i} position={[Math.cos((i / 14) * 6.283) * 0.24, Math.sin((i / 14) * 6.283) * 0.24, 0]} rotation={[0, 0.5, (i / 14) * 6.283]}>
        <boxGeometry args={[0.16, 0.025, 0.12]} /><meshStandardMaterial color="#6f747c" metalness={0.6} roughness={0.4} />
      </mesh>
    ))}
    <mesh><cylinderGeometry args={[0.07, 0.07, 0.16, 16]} /><meshStandardMaterial color="#2a2d31" metalness={0.5} /></mesh>
  </group>
);
// anillos del zumbido de la heladera (se achican y mueren en "gone")
const Hum: React.FC<{ t: number; amp: number }> = ({ t, amp }) => (
  <group position={[-5.25, 1.15, -1.25]}>
    {[0, 1, 2, 3].map((k) => {
      const ph = ((t * 0.9 + k * 0.25) % 1);
      return <mesh key={k} rotation={[0, 0, 0]} scale={0.6 + ph * 1.6}>
        <ringGeometry args={[0.98, 1.0, 64]} />
        <meshBasicMaterial color="#9fd8ff" transparent opacity={amp * (1 - ph) * 0.55} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>;
    })}
  </group>
);

// cable naranja que crece desde el generador, pasa bajo la puerta y llega a la heladera
const CORD = new THREE.CatmullRomCurve3(([[4.85, 0.42, 0.75], [4.4, 0.13, 1.4], [3.0, 0.13, 1.5], [2.1, 0.14, 1.3], [0.6, 0.15, 1.2], [-1.4, 0.15, 0.9], [-3.6, 0.15, -0.4], [-4.75, 0.15, -1.0], [-4.8, 0.45, -1.4]] as [number, number, number][]).map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.2);
const Cord: React.FC<{ k: number }> = ({ k }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(CORD, 260, 0.03, 8, false), []);
  const n = geo.index ? geo.index.count : 0;
  geo.setDrawRange(0, Math.floor((n * k) / 6) * 6);
  return k < 0.005 ? null : <mesh geometry={geo} castShadow><meshStandardMaterial color="#ff7a1a" roughness={0.45} emissive="#ff6a00" emissiveIntensity={0.25} /></mesh>;
};

// ---------------- LA ESCENA ----------------
export const HouseWorld: React.FC<{ t: number; offset?: number }> = ({ t }) => {
  // noche cerrada todo el minuto 1 (apagón)
  const day = 0, sunA = 0;
  const fanAng = 0, stoveGlow = 0, hum = 0;
  const nightClock = t > 29.9 ? 0.9 : 0;                         // despertador a pilas: 3:00
  const neighLit = (_i: number, _d: number) => 0;                // toda la calle a oscuras
  const wave = (_d: number) => 0;
  const garageLantern = 1;                                       // el farol a pilas del garaje
  const genRun = 1;                                              // el generador ruge todo el minuto 1
  const door = win(t, 21.5, 22.6) * 0.3;                         // "cracked the big door open a foot" (0,3 m)
  const cord = t < 24.5 ? 0 : win(t, 24.5, 27.3);                // "ran a cord into the kitchen for the fridge"
  const fogPre = t > 8.4 && t < 13 ? win(t, 9.6, 12.4) : 0;      // adelanto: niebla en el dormitorio
  const fog = t > 37.4 ? win(t, 37.6, 45.2) : 0;                 // el CO avanza por la casa
  const chirp = t < 32.6 ? 0 : t < 36.1 ? (((t - 32.6) % 1.3) < 0.12 ? 1 : 0) : (Math.sin(t * 22) > 0 ? 1 : 0.15);
  const skyN = new THREE.Color("#0b1220"), skyD = new THREE.Color("#aab6c4");
  const sky = skyN.clone().lerp(skyD, day);
  const moon = 0.55 + 0.25 * (1 - day), sun = day * 2.4;
  const k = camAt(t);
  const tx = useTextures();

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.15 + 0.75 * (1 - day)} threshold={0.85 + 1.2 * day} exposure={0.82 + 0.43 * (1 - day)} env={0.12 + 0.13 * day} />
      <color attach="background" args={[sky.getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.012 + 0.006 * (1 - day)]} />
      <hemisphereLight args={[new THREE.Color("#7f98c4").lerp(new THREE.Color("#e6ecf2"), day).getHex(), new THREE.Color("#1a1d24").lerp(new THREE.Color("#8a8f96"), day).getHex(), 0.55 + day * 0.9]} />
      <directionalLight position={[Math.cos(sunA) * -14 - 10, 22, 18]} intensity={moon * (1 - day) + sun} color={new THREE.Color("#a9c3ff").lerp(new THREE.Color("#fff3e2"), day)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} />
      {/* luz suave de "luna que entra" para que el corte se lea */}
      <pointLight position={[-2, 2.2, 6]} intensity={9 * (1 - day)} distance={18} color="#8fb0e8" />
      <pointLight position={[-3.5, 5, 6]} intensity={6 * (1 - day)} distance={14} color="#8fb0e8" />
      <pointLight position={[-4, -1, 5]} intensity={5 * (1 - day)} distance={10} color="#8fb0e8" />

      {/* terreno: nieve + corte de tierra alrededor del sótano */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[220, 220]} /><meshStandardMaterial color="#e9eef4" roughness={1} /></mesh>
      <Box p={[-7.6, -1.6, 0]} s={[3.2, 3.2, 5.4]} c="#3a2c22" r={1} />
      <Box p={[2.1, -1.6, 0]} s={[0.3, 3.2, 5.4]} c="#3a2c22" r={1} />
      <Box p={[4.3, -1.6, 0]} s={[4.4, 3.2, 5.4]} c="#3a2c22" r={1} />
      <Box p={[-2, -3.2, 0]} s={[8.4, 0.3, 5.4]} c="#56585b" r={1} />
      {/* calle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 8.8]} receiveShadow><planeGeometry args={[220, 5.4]} /><meshStandardMaterial color={new THREE.Color("#2b2e33").lerp(new THREE.Color("#55595f"), day)} roughness={0.95} /></mesh>
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-60 + i * 4.2, 0.02, 8.8]}><planeGeometry args={[1.6, 0.12]} /><meshBasicMaterial color="#c9b56a" transparent opacity={0.35} /></mesh>)}
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-48 + i * 4.6 + rnd(i, 2), 0.18, 6.0 + rnd(i, 3) * 0.3]} scale={[1.6, 0.4, 0.6]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#f2f5f9" roughness={1} /></mesh>)}

      {/* ===== LA CASA (frente abierto en z=2.5) ===== */}
      <Slab p={[-2, 1.5, -2.6]} s={[8.2, 9.2, 0.2]} c="#cfc6b6" />
      <Slab p={[-6.05, 1.5, 0]} s={[0.2, 9.2, 5.2]} c="#cfc6b6" />
      <Slab p={[2.05, 1.5, 0]} s={[0.2, 9.2, 5.2]} c="#cfc6b6" />
      <Slab p={[-1, 4.5, 0]} s={[0.14, 3.0, 5.0]} c="#d8d0c2" />
      <Slab p={[-1, 1.5, -1.2]} s={[0.14, 3.0, 2.6]} c="#d8d0c2" />
      <Slab p={[-2, 0, 0]} s={[8.2, 0.25, 5.2]} c="#7a5a3e" cut="#b9a585" />
      <Slab p={[-2, 3.0, 0]} s={[8.2, 0.25, 5.2]} c="#7a5a3e" cut="#b9a585" />
      <Slab p={[-2, 6.0, 0]} s={[8.2, 0.25, 5.2]} c="#cfc6b6" />
      {/* techo a dos aguas con nieve (a lo largo de x) */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[-2, 7.0, sd * 1.35]} rotation={[sd * -0.62, 0, 0]}>
          <Box p={[0, 0, 0]} s={[8.8, 0.22, 3.4]} c="#30333a" />
          <Box p={[0, 0.16, 0]} s={[8.8, 0.12, 3.4]} c="#f1f5f9" r={1} />
        </group>
      ))}
      {/* ventanas del fondo (luna) */}
      <Win p={[-3.6, 4.6, -2.49]} glow={1 - day * 0.5} />
      <Win p={[0.5, 4.6, -2.49]} glow={1 - day * 0.5} />
      <Win p={[0.5, 1.7, -2.49]} glow={1 - day * 0.5} />
      <Win p={[-2.4, -0.6, -2.49]} w={0.9} h={0.45} glow={1 - day * 0.5} />

      {/* ===== ACABADOS: pisos, empapelado, bloques, detalles de vida ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.55, 0.128, 0]} receiveShadow><planeGeometry args={[4.9, 5.0]} /><meshStandardMaterial map={tx.tile} roughness={0.35} metalness={0.05} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.128, 0]} receiveShadow><planeGeometry args={[3.0, 5.0]} /><meshStandardMaterial map={tx.planks} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 3.128, 0]} receiveShadow><planeGeometry args={[8.0, 5.0]} /><meshStandardMaterial map={tx.planks} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -3.04, 0]} receiveShadow><planeGeometry args={[8.0, 5.0]} /><meshStandardMaterial map={tx.concrete} roughness={0.9} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.3, 0.105, 0]} receiveShadow><planeGeometry args={[4.4, 5.0]} /><meshStandardMaterial map={tx.concrete} roughness={0.85} /></mesh>
      <mesh position={[-2, 1.5, -2.497]} receiveShadow><planeGeometry args={[8.0, 2.75]} /><meshStandardMaterial map={tx.paper} roughness={0.95} /></mesh>
      <mesh position={[-2, 4.5, -2.497]} receiveShadow><planeGeometry args={[8.0, 2.75]} /><meshStandardMaterial map={tx.paper} color="#cfd8e6" roughness={0.95} /></mesh>
      <mesh position={[-2, -1.55, -2.497]} receiveShadow><planeGeometry args={[8.0, 3.0]} /><meshStandardMaterial map={tx.block} roughness={0.95} /></mesh>
      {/* living: alfombra, cuadros, lámpara de pie, biblioteca */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.135, -0.5]} receiveShadow><planeGeometry args={[2.3, 1.7]} /><meshStandardMaterial map={tx.rug} roughness={1} /></mesh>
      {[[0.0, 2.15, 0.7, 0.5, "#6a8bb0"], [1.0, 2.25, 0.45, 0.6, "#b0805a"], [-1.8, 4.65, 0.6, 0.45, "#8aa07a"]].map(([x, y, w, h, c], i) => (
        <group key={i} position={[x as number, y as number, -2.47]}>
          <Box p={[0, 0, 0]} s={[(w as number) + 0.1, (h as number) + 0.1, 0.04]} c="#3a2a1e" r={0.5} rad={0.01} />
          <mesh position={[0, 0, 0.025]}><planeGeometry args={[w as number, h as number]} /><meshStandardMaterial color={c as string} roughness={0.7} /></mesh>
        </group>
      ))}
      <mesh position={[1.75, 0.8, -2.15]} castShadow><cylinderGeometry args={[0.02, 0.02, 1.35, 8]} /><meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} /></mesh>
      <mesh position={[1.75, 1.55, -2.15]} castShadow><cylinderGeometry args={[0.16, 0.24, 0.28, 20, 1, true]} /><meshStandardMaterial color="#efe3c8" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <Box p={[1.82, 0.95, 0.2]} s={[0.3, 1.7, 1.1]} c="#5b3f2b" />
      {[0.45, 0.95, 1.45].map((y, i) => <group key={i}>{Array.from({ length: 7 }, (_, j) => <Box key={j} p={[1.7, y + 0.12, -0.25 + j * 0.13]} s={[0.12, 0.26 - rnd(i * 9 + j, 2) * 0.07, 0.09]} c={["#7a2e2a", "#2f4f6a", "#c9a14a", "#3f5f3a", "#d8d0c2"][(i + j) % 5]} r={0.8} rad={0.008} />)}</group>)}
      {/* cortinas */}
      {[[-3.6, 4.6], [0.5, 4.6], [0.5, 1.7]].map(([x, y], i) => [-0.75, 0.75].map((dx) => (
        <Box key={i + "c" + dx} p={[x + dx, y + 0.05, -2.4]} s={[0.32, 1.3, 0.06]} c={i === 0 ? "#41506b" : "#8a5a4a"} r={1} rad={0.02} />
      )))}
      {/* luna que entra: conos con polvo */}
      <Beam p={[-3.6, 3.95, -1.3]} rot={[-0.95, 0, 0]} len={2.9} w={0.85} o={1 - day} />
      <Beam p={[0.5, 3.95, -1.3]} rot={[-0.95, 0, 0]} len={2.9} w={0.85} o={1 - day} />
      <Beam p={[0.5, 0.95, -1.35]} rot={[-0.95, 0, 0]} len={2.7} w={0.85} o={1 - day} />
      {/* cocina viva: pava, olla, frutera, lámpara colgante */}
      <mesh position={[-3.75, 1.05, -2.15]} castShadow><sphereGeometry args={[0.11, 16, 12]} /><meshStandardMaterial color="#b8bcc2" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[-3.42, 1.03, -2.0]} castShadow><cylinderGeometry args={[0.13, 0.12, 0.14, 20]} /><meshStandardMaterial color="#2b2f36" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[-2.6, 0.46, 0.4]} castShadow><cylinderGeometry args={[0.18, 0.12, 0.08, 20]} /><meshStandardMaterial color="#e8e2d6" roughness={0.4} /></mesh>
      {[[-2.65, 0.53, 0.38, "#c8402f"], [-2.55, 0.53, 0.43, "#e0b02a"], [-2.6, 0.55, 0.33, "#7aa33a"]].map(([x, y, z, c], i) => <mesh key={i} position={[x as number, y as number, z as number]} castShadow><sphereGeometry args={[0.055, 12, 10]} /><meshStandardMaterial color={c as string} roughness={0.5} /></mesh>)}
      <mesh position={[-2.6, 2.45, 0.4]}><cylinderGeometry args={[0.005, 0.005, 0.8, 4]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[-2.6, 2.0, 0.4]} castShadow><coneGeometry args={[0.22, 0.2, 24, 1, true]} /><meshStandardMaterial color="#2f4a3a" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      {/* sótano: caldera con su ventilador, termotanque, ductos */}
      <Box p={[-4.25, -1.6, -1.65]} s={[1.2, 2.6, 1.1]} c="#9aa0a6" r={0.5} m={0.35} />
      <Box p={[-4.25, -1.55, -1.11]} s={[0.9, 0.9, 0.02]} c="#15171a" r={0.6} />
      <Blower ang={fanAng} />
      
      <mesh position={[-2.6, -1.9, -1.8]} castShadow><cylinderGeometry args={[0.38, 0.38, 2.0, 24]} /><meshStandardMaterial color="#c9ccd0" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[-4.25, -0.4, -1.9]}><boxGeometry args={[0.6, 0.6, 0.6]} /><meshStandardMaterial color="#a7adb4" metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[-3.0, -0.35, -1.9]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.18, 0.18, 2.4, 16]} /><meshStandardMaterial color="#a7adb4" metalness={0.6} roughness={0.35} /></mesh>

      {/* cocina: heladera, mesada, horno con reloj LED, alacenas, mesa */}
      <group>
        <Box p={[-5.3, 0.97, -1.75]} s={[1.0, 1.9, 0.85]} c="#e9ebee" r={0.3} m={0.1} />
        <Box p={[-5.3, 1.45, -1.32]} s={[0.98, 0.02, 0.02]} c="#b9bec4" />
        <Box p={[-4.86, 1.0, -1.3]} s={[0.04, 0.5, 0.05]} c="#9ea4ab" m={0.6} />
        <Box p={[-4.86, 1.65, -1.3]} s={[0.04, 0.3, 0.05]} c="#9ea4ab" m={0.6} />
        <Hum t={t} amp={hum} />
        <Box p={[-4.3, 0.48, -2.1]} s={[0.9, 0.95, 0.75]} c="#8b6f55" />
        <Box p={[-4.3, 0.98, -2.1]} s={[0.92, 0.05, 0.78]} c="#d8d4cc" r={0.3} />
        <Box p={[-3.6, 0.48, -2.1]} s={[0.85, 0.95, 0.72]} c="#dfe2e5" r={0.35} m={0.2} />
        <Box p={[-3.6, 1.15, -2.42]} s={[0.85, 0.42, 0.08]} c="#d4d8dc" r={0.4} />
        <Led pos={[-3.6, 1.17, -2.37]} w={0.34} txt="2:00" color="#3dff7a" glow={stoveGlow} />
        <Box p={[-3.6, 0.42, -1.73]} s={[0.6, 0.38, 0.02]} c="#1b1d20" r={0.2} />
        <Box p={[-2.6, 0.48, -2.1]} s={[1.2, 0.95, 0.75]} c="#8b6f55" />
        <Box p={[-2.6, 0.98, -2.1]} s={[1.22, 0.05, 0.78]} c="#d8d4cc" r={0.3} />
        <Box p={[-3.6, 2.35, -2.3]} s={[3.0, 0.7, 0.4]} c="#8b6f55" />
        <Box p={[-2.6, 0.38, 0.4]} s={[1.3, 0.06, 0.9]} c="#6d4c33" />
        {[-0.5, 0.5].map((dx) => <Box key={dx} p={[-2.6 + dx * 0.9, 0.24, 0.4 + dx * 0.0]} s={[0.4, 0.48, 0.4]} c="#5b3f2b" />)}
      </group>
      {/* living: sillón, tele apagada */}
      <Box p={[0.5, 0.3, -1.7]} s={[2.0, 0.55, 0.85]} c="#5d6a73" r={1} />
      <Box p={[0.5, 0.65, -2.05]} s={[2.0, 0.6, 0.2]} c="#56626b" r={1} />
      <Box p={[0.5, 1.4, 1.5]} s={[1.2, 0.7, 0.06]} c="#0e0f11" r={0.2} />
      {/* dormitorio: cama, mesa de luz con el reloj despertador */}
      <Box p={[-3.8, 3.4, -1.3]} s={[2.0, 0.5, 2.3]} c="#e4e0d8" r={1} />
      <Box p={[-3.8, 3.68, -0.95]} s={[2.04, 0.12, 1.6]} c="#4a5d78" r={1} />
      <Box p={[-3.8, 3.7, -2.25]} s={[1.6, 0.18, 0.4]} c="#f4f1ea" r={1} />
      <Box p={[-3.8, 3.9, -2.47]} s={[2.1, 1.0, 0.1]} c="#5a4130" />
      <Box p={[-2.4, 3.3, -2.0]} s={[0.55, 0.6, 0.45]} c="#6d4c33" />
      <Box p={[-2.4, 3.69, -2.02]} s={[0.36, 0.18, 0.14]} c="#202226" r={0.3} />
      <Led pos={[-2.4, 3.69, -1.948]} w={0.3} txt="3:00" color="#ff3b2f" glow={nightClock} />
      {/* baño arriba a la derecha */}
      <Box p={[0.6, 3.45, -1.7]} s={[1.9, 0.55, 0.8]} c="#f1f2f3" r={0.25} />

      {/* ===== GARAJE (x 2..6.6) con el estante de las cosas de $60 y el farol a pilas ===== */}
      <Slab p={[4.3, 1.6, -2.6]} s={[4.6, 3.2, 0.2]} c="#bdb6a8" />
      <Slab p={[6.65, 2.95, 0]} s={[0.2, 0.5, 5.2]} c="#bdb6a8" />
      {/* portón seccional (mira a +x): se levanta 0,3 m */}
      <group position={[6.66, 1.35 + door, 0]}>
        <Box p={[0, 0, 0]} s={[0.08, 2.7, 4.8]} c="#e2ddd2" r={0.55} rad={0.015} />
        {[-0.9, -0.3, 0.3, 0.9].map((y) => <Box key={y} p={[0.045, y, 0]} s={[0.02, 0.05, 4.7]} c="#c9c3b6" r={0.6} rad={0.005} />)}
      </group>
      {door > 0.02 && <>
        <mesh position={[6.62, door / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[4.8, door]} /><meshBasicMaterial color="#5f86c4" transparent opacity={0.85} toneMapped={false} /></mesh>
        <pointLight position={[6.2, 0.15, 0]} intensity={door * 18} distance={3.5} color="#7fa6e6" />
      </>}
      {/* puerta interior garaje → casa (en la pared x=2,05) */}
      <Box p={[2.16, 1.05, 1.3]} s={[0.04, 2.0, 0.9]} c="#6e5038" r={0.6} rad={0.01} />
      <Slab p={[4.3, 0, 0]} s={[4.6, 0.2, 5.2]} c="#8d9095" cut="#a9acb0" />
      <Box p={[4.3, 3.3, 0]} s={[4.8, 0.25, 5.4]} c="#30333a" />
      <Box p={[4.3, 3.47, 0]} s={[4.8, 0.12, 5.4]} c="#f1f5f9" r={1} />
      <Box p={[3.4, 1.7, -2.45]} s={[2.0, 1.4, 0.04]} c="#b08d62" r={1} />
      <group position={[5.5, 0, -2.05]}>
        {[0.35, 0.95, 1.55].map((y) => <Box key={y} p={[0, y, 0]} s={[1.6, 0.04, 0.6]} c="#8c9198" m={0.5} r={0.4} />)}
        {[-0.78, 0.78].map((x) => <Box key={x} p={[x, 0.95, 0]} s={[0.04, 1.9, 0.6]} c="#8c9198" m={0.5} r={0.4} />)}
        {[-0.5, -0.17, 0.16, 0.49].map((x, i) => <mesh key={i} position={[x, 0.53, 0.02]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.32, 16]} /><meshStandardMaterial color="#dfe8ee" transparent opacity={0.85} roughness={0.2} /></mesh>)}
        <mesh position={[-0.3, 1.17, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.18, 0.18, 0.62, 20]} /><meshStandardMaterial color="#c9ced6" metalness={0.9} roughness={0.25} /></mesh>
        <Box p={[0.4, 1.12, 0]} s={[0.5, 0.3, 0.4]} c="#f2f2ef" r={0.9} />
        <Box p={[0, 1.67, 0]} s={[0.9, 0.2, 0.5]} c="#2f4f86" r={1} />
      </group>
      <Box p={[3.2, 0.48, -2.1]} s={[1.6, 0.95, 0.7]} c="#6e5a46" />
      <mesh position={[3.4, 1.12, -2.0]}><cylinderGeometry args={[0.09, 0.11, 0.28, 12]} /><meshBasicMaterial color={new THREE.Color("#333").lerp(new THREE.Color("#ffd28a"), garageLantern)} toneMapped={false} /></mesh>
      {garageLantern > 0.02 && <pointLight position={[3.4, 1.4, -1.6]} intensity={garageLantern * 14} distance={7} color="#ffc272" castShadow />}

      {/* ===== gary02: generador, humo, cable naranja, alarma de CO, Gary durmiendo, niebla de monóxido ===== */}
      <Generator p={[4.5, 0.1, 0.5]} rotY={-0.5} run={genRun} t={t} scale={1.25} />
      <Exhaust t={t} from={[4.05, 0.32, 0.2]} dir={[-0.5, 0.45, 0.35]} run={genRun} map={tx.flake} />
      <Cord k={cord} />
      <CoAlarm p={[-0.4, 4.95, -2.46]} blink={chirp} />
      <mesh position={[-3.8, 3.86, -2.0]} castShadow><sphereGeometry args={[0.17, 20, 16]} /><meshStandardMaterial color="#c99a7c" roughness={0.7} /></mesh>
      <mesh position={[-3.8, 3.84, -1.15]} scale={[0.55, 0.22, 1.0]} castShadow><sphereGeometry args={[0.5, 20, 14]} /><meshStandardMaterial color="#4a5d78" roughness={1} /></mesh>
      {fogPre > 0.01 && <CoFog t={t} k={fogPre} o={0.75} n={260} map={tx.flake} spread={[2.2, 0.6, 2.4]} path={[[-1.2, 3.25, 0.6], [-3.0, 3.3, -0.4], [-4.4, 3.5, -1.4]]} />}
      {fog > 0.01 && <CoFog t={t} k={fog} map={tx.flake} n={900} path={[[4.4, 0.3, 0.4], [3.0, 0.2, 1.2], [2.1, 0.12, 1.3], [0.2, 0.25, 0.6], [-2.6, 0.35, 0.0], [-0.4, 1.6, -1.6], [-0.6, 3.3, -0.8], [-3.0, 3.4, -0.8], [-4.4, 3.6, -1.4]]} />}

      {/* vecinos, faroles, pinos */}
      <Neighbor x={15} z={0} lit={neighLit(0, 1)} tint="#7d7466" i={1} siding={tx.siding} />
      <Neighbor x={27} z={0} lit={neighLit(1, 2)} tint="#6b7480" i={2} siding={tx.siding} />
      <Neighbor x={-17} z={0} lit={neighLit(2, 1)} tint="#80766b" i={3} siding={tx.siding} />
      <Neighbor x={-29} z={0} lit={neighLit(3, 2)} tint="#6f6a63" i={4} siding={tx.siding} />
      <Neighbor x={-6} z={17.6} flip lit={neighLit(4, 3)} tint="#76808a" i={5} siding={tx.siding} />
      <Neighbor x={6} z={17.6} flip lit={neighLit(5, 3)} tint="#857a6c" i={6} siding={tx.siding} />
      <Neighbor x={18} z={17.6} flip lit={neighLit(6, 4)} tint="#6c747a" i={7} siding={tx.siding} />
      <Neighbor x={-18} z={17.6} flip lit={neighLit(7, 4)} tint="#7a7068" i={8} siding={tx.siding} />
      {[-24, -12, 0, 12, 24].map((x, i) => <StreetLight key={x} p={[x, 0, 6.3]} on={t < 15.6 ? wave(Math.abs(x) / 8) : 0} />)}
      {[[-9.5, 0, -3], [9.5, 0, -4], [21, 0, -5], [-22, 0, -4.5], [0, 0, 23], [-12, 0, 24], [12, 0, 23.5]].map((p, i) => <Pine key={i} p={p as [number, number, number]} s={1 + rnd(i, 9) * 0.5} />)}
      {/* tacho del vecino con bolsas */}
      <group position={[13.6, 0, 6.6]}>
        <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.42, 0.36, 1.1, 20]} /><meshStandardMaterial color="#5d6066" roughness={0.6} /></mesh>
        {[[0, 1.2, 0], [0.25, 1.1, 0.2], [-0.5, 0.25, 0.5]].map((p, i) => <mesh key={i} position={p as [number, number, number]} castShadow><sphereGeometry args={[0.33, 12, 8]} /><meshStandardMaterial color="#111214" roughness={0.3} /></mesh>)}
      </group>
      <Snow t={t} c={k.p} map={tx.flake} />
    </ThreeCanvas>
  );
};

// marcadores 3D (para portales y rótulos)
export const PT = {
  nightClock: [-2.4, 3.69, -1.95] as [number, number, number],
  furnaceFan: [-4.25, -1.55, -1.08] as [number, number, number],
  stoveClock: [-3.6, 1.17, -2.37] as [number, number, number],
  fridge: [-5.3, 1.2, -1.3] as [number, number, number],
  garage: [3.4, 1.15, -2.0] as [number, number, number],
  trash: [13.6, 0.9, 6.6] as [number, number, number],
  shelf: [5.5, 1.0, -1.8] as [number, number, number],
  generator: [4.5, 0.55, 0.5] as [number, number, number],
  doorGap: [6.66, 0.15, 0.6] as [number, number, number],
  innerDoor: [2.1, 0.2, 1.3] as [number, number, number],
  coAlarm: [-0.4, 4.95, -2.4] as [number, number, number],
  sleeper: [-3.8, 3.86, -1.6] as [number, number, number],
};
