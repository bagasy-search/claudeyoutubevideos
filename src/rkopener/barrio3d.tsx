// rkopener · EL MUNDO: una casa de una planta en corte de casa de muñecas, de noche, con la VEREDA y la CALLE adelante.
// De izquierda a derecha: GARAJE (portón seccional que SUBE, motor en el techo, panel de pared con el botón de traba y
// su luz ámbar, la puerta a la casa arriba de 3 escalones con su cerrojo), COCINA (mesada, ganchera de llaves), SALA,
// DORMITORIO y el cuarto de los CHICOS. Afuera: el auto estacionado en la entrada con el control en el parasol, la
// cámara de seguridad arriba del portón, dos casas vecinas y el farol. El ladrón es una silueta oscura con capucha que
// camina por el recorrido; la LÍNEA ROJA se dibuja del auto al portón, a la puerta, a la cocina y al dormitorio.
// UNA escena y UNA cámara (keyframes clavados a la voz con at()). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type V3 = [number, number, number];

// ---------------- puntos del mundo ----------------
export const PT = {
  visor: [-6.95, 1.25, 3.0] as V3,        // el control en el parasol del auto
  window: [-6.25, 1.0, 3.25] as V3,       // ventanilla del acompañante
  glove: [-6.75, 0.85, 2.85] as V3,       // la guantera
  console: [-7.05, 1.3, 2.9] as V3,       // los botones del techo del auto
  gdoor: [-7.2, 1.05, 0.2] as V3,         // el portón
  motor: [-7.2, 2.45, -1.0] as V3,        // el motor del portón (botón learn)
  panel: [-5.62, 1.3, -0.55] as V3,       // el panel de pared con la traba
  door: [-5.55, 1.35, -1.5] as V3,        // la puerta del garaje a la casa
  steps: [-5.95, 0.2, -1.5] as V3,
  keys: [-4.9, 1.45, -2.18] as V3,        // la ganchera de llaves de la cocina
  counter: [-3.4, 0.95, -1.9] as V3,      // la mesada (las carteras)
  bed: [3.2, 0.55, -1.2] as V3,
  kids: [6.6, 0.5, -1.2] as V3,
  cam: [-7.2, 2.42, 0.32] as V3,          // la cámara de seguridad
  street: [-3.0, 0.0, 7.5] as V3,
  center: [-2.5, 0.8, 0.5] as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[]) => {
  const camAt = (t: number) => {
    let i = 0;
    while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
    const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p));
    p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
  };
  const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const c = new THREE.PerspectiveCamera(cm.fov, W / H, 0.05, 200); c.position.copy(cm.p); c.lookAt(cm.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = q.clone().project(c); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, front: v.z < 1 };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const a = screenOf(t - 1 / FPS, PT.center), b = screenOf(t, PT.center);
    return { bx: Math.abs(b.x - a.x) * 0.06, by: Math.abs(b.y - a.y) * 0.06 };
  };
  return { camAt, screenOf, camSpeed };
};

const Cam: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"] }> = ({ t, camAt }) => {
  const { camera } = useThree();
  const c = camAt(t);
  const pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(c.p); pc.lookAt(c.l); pc.fov = c.fov; pc.near = 0.05; pc.far = 200; pc.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
type Tx = THREE.Texture;
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const useBarrioTex = () => useMemo(() => ({
  plaster: mk(256, 256, (g) => { g.fillStyle = "#cfc6b6"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 180 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [3, 1]),
  grass: mk(256, 256, (g) => { g.fillStyle = "#24331f"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${40 + rnd(i, 1) * 40},${70 + rnd(i, 2) * 50},${30 + rnd(i, 3) * 20},.6)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 1.5, 4); } }, [14, 6]),
  asphalt: mk(256, 256, (g) => { g.fillStyle = "#26282b"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { const v = 30 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v},${v + 4},.7)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1.5, 1.5); } }, [12, 1]),
  // portón seccional: 4 paneles horizontales con relieve
  gdoor: mk(512, 360, (g) => {
    g.fillStyle = "#e9e6df"; g.fillRect(0, 0, 512, 360);
    for (let r = 0; r < 4; r++) { g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(0, r * 90 + 86, 512, 4);
      for (let c = 0; c < 4; c++) { g.strokeStyle = "rgba(0,0,0,.13)"; g.lineWidth = 4; g.strokeRect(c * 128 + 12, r * 90 + 14, 104, 60); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(c * 128 + 14, r * 90 + 16, 100, 3); } }
  }),
  soil: mk(256, 256, (g) => { const cs = ["#3a2a1c", "#4a3524", "#5a4632", "#6b6256"]; for (let r = 0; r < 4; r++) { g.fillStyle = cs[r]; g.fillRect(0, r * 64, 256, 64); } }, [8, 1]),
}), []);

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);

// halo pulsante en el piso + columna de luz (rojo = lo que usa el ladrón · verde = la defensa)
const Heat: React.FC<{ p: V3; on: number; t: number; col?: string; r?: number }> = ({ p, on, t, col = "#ff3a2a", r = 0.42 }) => {
  if (on < 0.01) return null;
  const pul = 0.75 + 0.25 * Math.sin(t * 6);
  return (
    <group position={[p[0], 0.015, p[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.82, r, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * on} toneMapped={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r * 0.82, 48]} /><meshBasicMaterial color={col} transparent opacity={0.18 * on * pul} toneMapped={false} /></mesh>
      <mesh position={[0, (p[1] + 0.5) / 2, 0]}><cylinderGeometry args={[r * 0.3, r * 0.6, p[1] + 0.5, 32, 1, true]} /><meshBasicMaterial color={col} transparent opacity={0.035 * on * pul} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, p[1] + 0.2, 0.25]} color={col} intensity={0.5 * on * pul} distance={0.9} />
    </group>
  );
};

// el recorrido del ladrón: auto → portón → escalones → puerta → cocina → sala → dormitorio
export const ROUTE: V3[] = [[-5.7, 0.03, 3.3], [-6.4, 0.03, 1.4], [-7.0, 0.03, 0.3], [-6.9, 0.03, -0.8], [-6.1, 0.03, -1.5], [-5.2, 0.03, -1.5], [-4.2, 0.03, -1.1], [-2.5, 0.03, -0.9], [0.0, 0.03, -0.9], [2.2, 0.03, -0.9], [3.2, 0.03, -0.6]];
const routeCurve = new THREE.CatmullRomCurve3(ROUTE.map((q) => v3(q)), false, "catmullrom", 0.3);
export const routeAt = (k: number): V3 => { const q = routeCurve.getPointAt(cl(k)); return [q.x, q.y, q.z]; };
const RedLine: React.FC<{ k: number; t: number; col: string }> = ({ k, t, col }) => {
  const kk = Math.round(cl(k) * 200) / 200;
  const geo = useMemo(() => {
    if (kk < 0.01) return null;
    const n = Math.max(2, Math.round(80 * kk)), pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) pts.push(routeCurve.getPointAt((i / n) * kk));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, 0.045, 8, false);
  }, [kk]);
  if (!geo) return null;
  const tip = routeAt(kk), pul = 0.8 + 0.2 * Math.sin(t * 7);
  return (
    <group>
      <mesh geometry={geo}><meshBasicMaterial color={col} toneMapped={false} /></mesh>
      <mesh position={[tip[0], 0.08, tip[2]]}><sphereGeometry args={[0.1 * pul, 16, 16]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
      <pointLight position={[tip[0], 0.4, tip[2]]} color={col} intensity={2.2} distance={1.8} />
    </group>
  );
};

// el ladrón: silueta oscura con capucha (sin cara)
const Thief: React.FC<{ at: V3; yaw: number; on: number; reach?: number }> = ({ at, yaw, on, reach = 0 }) => {
  if (on < 0.01) return null;
  const mat = <meshStandardMaterial color="#15171b" roughness={0.9} transparent opacity={on} />;
  return (
    <group position={[at[0], 0, at[2]]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.95, 0]} castShadow><capsuleGeometry args={[0.2, 0.75, 6, 16]} />{mat}</mesh>
      <mesh position={[0, 1.62, 0.02]} castShadow><sphereGeometry args={[0.17, 20, 20]} />{mat}</mesh>
      <mesh position={[0, 1.66, -0.03]}><sphereGeometry args={[0.2, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><meshStandardMaterial color="#202329" roughness={0.95} transparent opacity={on} /></mesh>
      <group position={[0.22, 1.32, 0]} rotation={[-0.3 - 1.3 * reach, 0, 0]}><mesh position={[0, -0.32, 0]} castShadow><capsuleGeometry args={[0.065, 0.5, 4, 8]} />{mat}</mesh></group>
      <group position={[-0.22, 1.32, 0]} rotation={[0.15, 0, 0]}><mesh position={[0, -0.32, 0]} castShadow><capsuleGeometry args={[0.065, 0.5, 4, 8]} />{mat}</mesh></group>
      {[-0.1, 0.1].map((x, i) => <mesh key={i} position={[x, 0.32, 0]} castShadow><capsuleGeometry args={[0.08, 0.5, 4, 8]} />{mat}</mesh>)}
    </group>
  );
};

// la linterna del ladrón
const Flashlight: React.FC<{ on: number; at: V3; from: V3 }> = ({ on, at, from }) => {
  const tgt = useMemo(() => new THREE.Object3D(), []);
  tgt.position.set(at[0], at[1], at[2]); tgt.updateMatrixWorld();
  if (on < 0.01) return null;
  return <><primitive object={tgt} /><spotLight position={from} target={tgt} angle={0.36} penumbra={0.8} intensity={6.5 * on} distance={7} color="#fff3d6" castShadow /></>;
};

// el auto de la entrada (trompa contra el portón). broken = ventanilla rota (cubitos en el piso y en el asiento)
const Car: React.FC<{ glove: number; broken: number; remote: number; rGlow: number; console: number; lights: number }> = ({ glove, broken, remote, rGlow, console, lights }) => (
  <group position={[-6.9, 0, 3.4]}>
    <Box p={[0, 0.48, 0]} s={[1.8, 0.6, 3.9]} c="#5d6b78" r={0.35} m={0.55} rad={0.18} />
    {/* cabina HUECA: techo + parantes + vidrios translúcidos, así se ven parasol, consola y guantera */}
    <Box p={[0, 1.25, 0.1]} s={[1.62, 0.05, 2.0]} c="#4a5662" r={0.3} m={0.4} rad={0.03} />
    {[[-0.78, -0.88], [0.78, -0.88], [-0.78, 0.15], [0.78, 0.15], [-0.78, 1.08], [0.78, 1.08]].map(([x, z], i) => <Box key={i} p={[x, 1.0, z]} s={[0.06, 0.5, 0.07]} c="#4a5662" r={0.3} m={0.4} />)}
    {/* tablero, asientos y piso de la cabina */}
    <Box p={[0, 0.88, -0.72]} s={[1.52, 0.2, 0.36]} c="#3a3836" r={0.8} />
    <Box p={[0, 0.79, 0.2]} s={[1.5, 0.02, 1.7]} c="#2b2a29" r={0.95} />
    {[-0.38, 0.38].map((x, i) => <group key={i}><Box p={[x, 0.86, 0.0]} s={[0.5, 0.12, 0.5]} c="#6b6157" r={0.85} rad={0.04} /><Box p={[x, 1.08, 0.24]} s={[0.5, 0.48, 0.1]} c="#6b6157" r={0.85} rad={0.04} /></group>)}
    <Box p={[0, 0.9, 0.85]} s={[1.4, 0.2, 0.45]} c="#6b6157" r={0.85} rad={0.04} />
    <pointLight position={[0, 1.05, 0.3]} intensity={0.4} distance={2.0} color="#ffe2b8" />
    {/* parabrisas (hacia el portón = -z) y luneta */}
    <Box p={[0, 1.0, -0.92]} s={[1.5, 0.44, 0.03]} c="#1c2630" r={0.05} m={0.2} rad={0.01} op={0.3} />
    <Box p={[0, 1.0, 1.12]} s={[1.5, 0.42, 0.03]} c="#1c2630" r={0.05} m={0.2} rad={0.01} op={0.35} />
    {/* ventanillas laterales: la del acompañante (x+) desaparece cuando se rompe */}
    <Box p={[-0.8, 1.0, 0.1]} s={[0.02, 0.38, 1.9]} c="#1c2630" r={0.05} m={0.2} rad={0.005} op={0.3} />
    {broken < 0.5 && <Box p={[0.8, 1.0, 0.1]} s={[0.02, 0.38, 1.9]} c="#26323d" r={0.05} m={0.3} rad={0.005} op={0.28} />}
    {broken > 0.05 && Array.from({ length: 70 }, (_, i) => {
      const inside = i < 40, k = cl(broken * 1.4 - rnd(i, 7) * 0.4);
      const x = inside ? 0.3 + rnd(i, 1) * 0.45 : 1.0 + rnd(i, 1) * 0.6, z = -0.5 + rnd(i, 2) * 1.3, y0 = 1.0, y1 = inside ? 0.82 : 0.02;
      return <mesh key={i} position={[x, lerp(y0, y1, k), z]} rotation={[rnd(i, 3) * 3, rnd(i, 4) * 3, 0]}><boxGeometry args={[0.035, 0.035, 0.035]} /><meshStandardMaterial color="#cfe7ef" roughness={0.05} metalness={0.3} emissive="#9fd6ff" emissiveIntensity={0.25} /></mesh>;
    })}
    {/* parasol del conductor + el control gris */}
    <Box p={[-0.35, 1.2, -0.62]} s={[0.55, 0.03, 0.28]} c="#6d6a64" r={0.9} />
    {remote > 0.05 && <Box p={[-0.35, 1.17, -0.6]} s={[0.2, 0.04, 0.12]} c="#9aa0a6" r={0.4} m={0.3} e="#ffb257" ei={1.6 * rGlow} />}
    {/* botones del techo (consola) */}
    {[-0.08, 0, 0.08].map((x, i) => <Box key={i} p={[x, 1.22, -0.78]} s={[0.05, 0.02, 0.04]} c="#333" e="#ffb257" ei={1.4 * console} rad={0.005} />)}
    {/* guantera (tapa que baja) con papeles */}
    <group position={[0.4, 0.85, -0.55]} rotation={[1.0 * glove, 0, 0]}><Box p={[0, -0.06, -0.03]} s={[0.42, 0.12, 0.02]} c="#2d343b" r={0.6} /></group>
    {glove > 0.05 && <Box p={[0.4, 0.82, -0.6]} s={[0.3, 0.02, 0.18]} c="#efe8d6" r={0.9} e="#fff4d6" ei={0.3 * glove} />}
    {/* luces traseras (parpadean al cerrar) */}
    {[-0.65, 0.65].map((x, i) => <Box key={i} p={[x, 0.62, 1.96]} s={[0.3, 0.1, 0.03]} c="#5a0d0d" e="#ff2a1a" ei={2.5 * lights} />)}
    {[[-0.85, 1.35], [0.85, 1.35], [-0.85, -1.35], [0.85, -1.35]].map(([x, z], i) => <mesh key={i} position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 24]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>)}
  </group>
);

// el garaje: portón que sube (se va acostando bajo el techo), motor con riel, panel con traba, puerta con escalones
const Garage: React.FC<{ tex: ReturnType<typeof useBarrioTex>; lift: number; jam: number; lock: number; t: number; dbolt: number; door: number; learn: number; plug: number; motorLight: number }> = ({ tex, lift, jam, lock, t, dbolt, door, learn, plug, motorLight }) => {
  const shake = jam > 0 ? Math.sin(t * 40) * 0.004 * jam : 0;
  const y = 1.05 + 1.25 * lift, tilt = -Math.PI / 2 * cl((lift - 0.35) / 0.65), zz = 0.15 - 1.0 * cl((lift - 0.35) / 0.65);
  const blink = lock > 0.5 ? (Math.sin(t * 5.5) > 0 ? 1 : 0.15) : 0;
  return (
    <group>
      {/* portón seccional */}
      <group position={[-7.2, y + shake, zz]} rotation={[tilt, 0, 0]}><mesh castShadow receiveShadow><boxGeometry args={[3.0, 2.1, 0.06]} /><meshStandardMaterial map={tex.gdoor} roughness={0.55} metalness={0.1} /></mesh></group>
      {/* marco y dintel del frente del garaje */}
      <Box p={[-8.82, 1.25, 0.15]} s={[0.3, 2.5, 0.2]} c="#cdc8bd" r={0.9} />
      <Box p={[-5.58, 1.25, 0.15]} s={[0.3, 2.5, 0.2]} c="#cdc8bd" r={0.9} />
      <Box p={[-7.2, 2.4, 0.15]} s={[3.5, 0.3, 0.22]} c="#cdc8bd" r={0.9} />
      {/* riel + motor colgado del techo (la luz del motor se enciende al moverse) */}
      <Box p={[-7.2, 2.32, -0.7]} s={[0.06, 0.06, 1.8]} c="#555" m={0.7} r={0.4} />
      <Box p={[-7.2, 2.3, -1.65]} s={[0.5, 0.22, 0.6]} c="#d8d6d0" r={0.5} rad={0.04} e="#fff1c9" ei={1.2 * motorLight} />
      <Box p={[-6.94, 2.28, -1.6]} s={[0.02, 0.05, 0.05]} c="#333" e="#ffb257" ei={2 * learn} rad={0.005} />
      {/* cable al enchufe del techo (se desenchufa) */}
      <Box p={[-7.2, 2.4 - 0.2 * plug, -1.98]} s={[0.02, 0.2 + 0.25 * plug, 0.02]} c="#222" rad={0.005} />
      {/* panel de pared con el botón de traba y la luz ámbar */}
      <group position={[-5.6, 1.3, -0.55]}>
        <Box p={[0, 0, 0]} s={[0.03, 0.2, 0.13]} c="#f2f0ea" r={0.5} rad={0.01} />
        <Box p={[-0.02, 0.03, 0]} s={[0.02, 0.06, 0.08]} c="#cfcac0" r={0.5} rad={0.005} />
        <Box p={[-0.02, -0.05, 0.03]} s={[0.02, 0.025, 0.025]} c="#888" rad={0.004} />
        <mesh position={[-0.025, -0.05, -0.03]}><sphereGeometry args={[0.012, 10, 10]} /><meshBasicMaterial color={blink > 0.5 ? "#ffb020" : "#5a4310"} toneMapped={false} /></mesh>
        {blink > 0.5 && <pointLight position={[-0.15, -0.05, -0.03]} color="#ffb020" intensity={0.8} distance={0.8} />}
      </group>
      {/* escalones y la puerta a la casa (pared derecha del garaje) */}
      {[0, 1, 2].map((i) => <Box key={i} p={[-5.95 + i * 0.0, 0.1 + i * 0.12, -1.5]} s={[0.7 - i * 0.18, 0.12, 0.9]} c="#8a6a48" r={0.8} rad={0.01} />)}
      <group position={[-5.55, 1.35, -1.95]} rotation={[0, 1.4 * door, 0]}>
        <Box p={[0, 0, 0.45]} s={[0.05, 1.95, 0.9]} c="#efece4" r={0.6} rad={0.01} />
        <mesh position={[-0.05, 0, 0.82]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.05, 16]} /><meshStandardMaterial color="#c9a85a" metalness={1} roughness={0.25} /></mesh>
        <mesh position={[-0.05, 0.2, 0.82]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.03, 16]} /><meshStandardMaterial color="#c9a85a" metalness={1} roughness={0.25} emissive="#3fe08a" emissiveIntensity={1.6 * dbolt} /></mesh>
      </group>
      {/* estantes, cortadora de pasto, bicis (que se lea garaje) */}
      <Box p={[-8.7, 0.9, -1.4]} s={[0.4, 1.8, 1.2]} c="#6d5c48" r={0.8} />
      {[0.5, 1.0, 1.5].map((yy, i) => <Box key={i} p={[-8.6, yy, -1.4]} s={[0.35, 0.18, 0.3 + 0.2 * i]} c={["#a33a2c", "#3d5a80", "#cdb98a"][i]} />)}
      <Box p={[-8.2, 0.25, -0.4]} s={[0.5, 0.4, 0.8]} c="#2f5d34" r={0.6} />
      <Box p={[-7.0, 0.04, -1.2]} s={[2.6, 0.02, 1.8]} c="#4a4c4f" r={1} cast={false} rad={0.005} />
    </group>
  );
};

const Room: React.FC<{ x0: number; x1: number; floor: string; tex: ReturnType<typeof useBarrioTex>; planks?: Tx; wallH?: number; hole?: boolean }> = ({ x0, x1, floor, tex, planks, wallH = 1.4, hole }) => {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  return (
    <group>
      <mesh position={[cx, 0, -1.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.3]} /><meshStandardMaterial color={floor} map={planks} roughness={0.8} /></mesh>
      <Box p={[cx, 1.3, -2.25]} s={[w, 2.6, 0.1]} c="#cfc6b6" map={tex.plaster} r={0.95} rad={0.01} />
      {hole ? <>{/* hueco de la puerta a la casa (z -1.97..-1.03, alto 2.33) */}
        <Box p={[x1, wallH / 2, -2.11]} s={[0.1, wallH, 0.28]} c="#c4baa8" r={0.95} rad={0.01} />
        <Box p={[x1, wallH / 2, -0.49]} s={[0.1, wallH, 1.08]} c="#c4baa8" r={0.95} rad={0.01} />
        <Box p={[x1, (wallH + 2.33) / 2, -1.5]} s={[0.1, wallH - 2.33, 0.94]} c="#c4baa8" r={0.95} rad={0.01} />
      </> : <Box p={[x1, wallH / 2, -1.1]} s={[0.1, wallH, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />}
    </group>
  );
};

// casa vecina (bloque simple con techo, portón cerrado y auto en la entrada)
const Neighbor: React.FC<{ x: number; tex: ReturnType<typeof useBarrioTex>; lamp: number }> = ({ x, tex, lamp }) => (
  <group position={[x, 0, -0.6]}>
    <Box p={[0, 1.3, -0.6]} s={[7, 2.6, 3.4]} c="#b9b1a2" map={tex.plaster} r={0.95} />
    <mesh position={[0, 3.25, -0.6]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[5.4, 1.4, 4]} /><meshStandardMaterial color="#3b3430" roughness={0.9} /></mesh>
    <mesh position={[-1.6, 1.05, 1.13]}><planeGeometry args={[2.8, 2.1]} /><meshStandardMaterial map={tex.gdoor} roughness={0.6} /></mesh>
    <Box p={[2.0, 1.4, 1.12]} s={[1.0, 0.8, 0.04]} c="#2a2216" e="#ffcf8f" ei={0.9 * lamp} />
    <Box p={[-1.6, 0.48, 3.4]} s={[1.8, 0.6, 3.6]} c={x > 0 ? "#6b2f2a" : "#2e3d52"} r={0.35} m={0.5} rad={0.18} />
    <Box p={[-1.6, 0.98, 3.5]} s={[1.6, 0.5, 1.9]} c={x > 0 ? "#5a2622" : "#273447"} r={0.3} m={0.4} rad={0.2} />
    <Box p={[-1.6, 0.012, 3.2]} s={[3.2, 0.02, 5]} c="#6c6d6f" r={1} cast={false} rad={0.005} />
  </group>
);

export const World: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"]; st: WorldState }> = ({ t, camAt, st }) => {
  const tx = useTextures(), tex = useBarrioTex();
  const yaw = st.thiefYaw;
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0, 3, 8] }}>
      <Cam t={t} camAt={camAt} />
      <color attach="background" args={["#0b1322"]} />
      <fog attach="fog" args={["#0b1322", 16, 46]} />
      <ambientLight intensity={0.24 + 0.5 * st.day} color={st.day > 0.5 ? "#dfe6f0" : "#7d8fb8"} />
      <directionalLight position={[-6, 9, 8]} intensity={0.55 + 1.6 * st.day} color={st.day > 0.5 ? "#fff1dc" : "#9fb6ff"} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={10} shadow-camera-bottom={-10} />
      <pointLight position={[-3, 2.4, 4.5]} intensity={3.5} distance={9} color="#b9c8ff" />
      {/* lámparas de adentro (de noche bajan: la casa duerme) */}
      {[[-3.8, 2.2, -1.2], [-0.2, 2.2, -1.2], [3.2, 2.2, -1.2], [6.6, 2.2, -1.2]].map((p, i) => <pointLight key={i} position={p as V3} intensity={2.4 * st.lamps} distance={4.5} color="#ffcf8f" castShadow={i === 0} />)}
      {/* foco del garaje + luz del porche */}
      <pointLight position={[-7.2, 2.1, -0.8]} intensity={2.6 * st.gLight} distance={4.5} color="#ffd9a0" />
      <pointLight position={[-5.3, 2.3, 0.6]} intensity={1.6} distance={3.5} color="#ffcf8f" />
      <mesh position={[-5.3, 2.3, 0.35]}><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color="#ffe0a8" toneMapped={false} /></mesh>
      {/* el terreno: pasto, la entrada de cemento, la vereda y la calle */}
      <mesh position={[0, -0.02, 2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 12]} /><meshStandardMaterial map={tex.grass} roughness={1} /></mesh>
      <mesh position={[-7.2, 0.005, 3.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.4, 6.4]} /><meshStandardMaterial map={tx.concrete} color="#9a9b9d" roughness={0.9} /></mesh>
      <mesh position={[0, 0.004, 7.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 1.2]} /><meshStandardMaterial map={tx.concrete} color="#8a8b8d" roughness={0.9} /></mesh>
      <mesh position={[0, 0.002, 9.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 2.8]} /><meshStandardMaterial map={tex.asphalt} roughness={0.95} /></mesh>
      <Box p={[0, -0.62, 3.0]} s={[40, 1.2, 14]} c="#3a2a1c" map={tex.soil} r={1} rad={0.01} cast={false} />
      {/* la casa */}
      <Room x0={-9} x1={-5.5} floor="#55585b" tex={tex} wallH={2.6} hole />
      <Room x0={-5.5} x1={-2} floor="#b8b0a2" tex={tex} />
      <Room x0={-2} x1={1.5} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Room x0={1.5} x1={5} floor="#8e7a63" tex={tex} planks={tx.planks} />
      <Room x0={5} x1={8.2} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[-9, 1.3, -1.1]} s={[0.1, 2.6, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      <Garage tex={tex} lift={st.gLift} jam={st.jam} lock={st.lock} t={t} dbolt={st.dbolt} door={st.door} learn={st.learn} plug={st.plug} motorLight={st.motorLight} />
      {/* cocina: mesada con las carteras y la laptop, heladera, ganchera con llaves */}
      <Box p={[-3.4, 0.45, -1.95]} s={[2.2, 0.9, 0.6]} c="#7c6a55" r={0.7} />
      <Box p={[-3.4, 0.92, -1.95]} s={[2.24, 0.05, 0.64]} c="#d9d4ca" r={0.4} />
      <Box p={[-3.4, 1.85, -2.05]} s={[2.2, 0.6, 0.36]} c="#6d5c48" r={0.7} />
      {st.loot < 0.5 && <><Box p={[-3.9, 1.05, -1.9]} s={[0.34, 0.24, 0.14]} c="#7b3b2a" r={0.7} rad={0.04} /><Box p={[-3.2, 1.03, -1.85]} s={[0.3, 0.2, 0.12]} c="#2f3a4d" r={0.7} rad={0.04} /><Box p={[-2.6, 0.96, -1.9]} s={[0.42, 0.02, 0.3]} c="#3a3d42" m={0.6} r={0.3} /></>}
      <Box p={[-2.35, 0.9, -1.95]} s={[0.7, 1.8, 0.62]} c="#8f979e" r={0.35} m={0.55} rad={0.05} />
      <Box p={[-4.9, 1.45, -2.18]} s={[0.4, 0.08, 0.04]} c="#6b4426" />
      {st.loot < 0.5 && [-5.02, -4.9, -4.78].map((x, i) => <Box key={i} p={[x, 1.33, -2.15]} s={[0.04, 0.12, 0.02]} c="#c9a85a" m={0.9} r={0.3} />)}
      {/* sala */}
      <Box p={[-0.3, 0.35, -1.75]} s={[1.8, 0.7, 0.7]} c="#4f5d6e" r={0.95} rad={0.12} />
      <Box p={[0.9, 0.25, -0.9]} s={[0.8, 0.5, 0.5]} c="#6b4426" />
      {/* dormitorio */}
      <Box p={[3.2, 0.28, -1.25]} s={[1.6, 0.4, 1.9]} c="#d9d2c4" r={0.95} rad={0.08} />
      <Box p={[3.2, 0.5, -2.0]} s={[1.6, 0.18, 0.36]} c="#f1ede4" r={0.95} rad={0.08} />
      <Box p={[3.2, 0.52, -0.95]} s={[1.4, 0.22, 1.0]} c="#4b5a73" r={0.95} rad={0.1} />
      {/* cuarto de los chicos: dos camitas con bultos */}
      {[5.9, 7.3].map((x, i) => <group key={i}><Box p={[x, 0.22, -1.3]} s={[0.9, 0.3, 1.6]} c="#c9d6e8" r={0.95} rad={0.06} /><Box p={[x, 0.42, -1.15]} s={[0.6, 0.16, 0.8]} c={i ? "#e0a3a3" : "#a3c4e0"} r={0.95} rad={0.08} /></group>)}
      <mesh position={[6.6, 0.3, -2.15]}><sphereGeometry args={[0.06, 12, 12]} /><meshBasicMaterial color="#ffe9a8" toneMapped={false} /></mesh>
      <pointLight position={[6.6, 0.35, -1.9]} intensity={0.6} distance={1.6} color="#ffe9a8" />
      {/* la cámara de seguridad sobre el portón */}
      <group position={PT.cam}><Box p={[0, 0, 0]} s={[0.12, 0.1, 0.22]} c="#eeeeea" r={0.4} rad={0.03} /><mesh position={[0.04, 0.03, 0.12]}><sphereGeometry args={[0.012, 8, 8]} /><meshBasicMaterial color={Math.sin(t * 4) > 0 ? "#ff2a2a" : "#4a0a0a"} toneMapped={false} /></mesh></group>
      {/* el auto en la entrada */}
      <Car glove={st.glove} broken={st.broken} remote={st.remote} rGlow={st.rGlow} console={st.console} lights={st.carLights} />
      {/* vecinos y farol */}
      <Neighbor x={-17} tex={tex} lamp={st.lamps * 0.6} />
      <Neighbor x={13.5} tex={tex} lamp={st.lamps * 0.6} />
      <Box p={[-1.0, 1.6, 7.7]} s={[0.08, 3.2, 0.08]} c="#222" m={0.6} />
      <mesh position={[-1.0, 3.25, 7.7]}><sphereGeometry args={[0.14, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#ffd9a0" emissiveIntensity={3} toneMapped={false} /></mesh>
      <pointLight position={[-1.0, 3.1, 7.7]} intensity={7} distance={10} color="#ffcf8f" />
      {/* el ladrón, su linterna, la línea roja y los puntos que se encienden */}
      <Thief at={st.thiefAt} yaw={yaw} on={st.thief} reach={st.reach} />
      <Flashlight on={st.flash} at={st.flashAt} from={st.flashFrom} />
      <RedLine k={st.route} t={t} col={st.routeCol} />
      {Object.entries(st.heat).map(([k, v]) => <Heat key={k} p={PT[k as keyof typeof PT]} on={v ?? 0} t={t} />)}
      {Object.entries(st.good).map(([k, v]) => <Heat key={"g" + k} p={PT[k as keyof typeof PT]} on={v ?? 0} t={t} col="#3fe08a" r={0.5} />)}
      <Post bloom={0.85} threshold={0.78} exposure={1.05 + 0.25 * st.day} env={0.18 + 0.3 * st.day} />
    </ThreeCanvas>
  );
};

export type WorldState = {
  day: number; lamps: number; gLight: number; gLift: number; jam: number; lock: number; dbolt: number; door: number; learn: number; plug: number; motorLight: number;
  glove: number; broken: number; remote: number; rGlow: number; console: number; carLights: number; loot: number;
  thief: number; thiefAt: V3; thiefYaw: number; reach: number; flash: number; flashAt: V3; flashFrom: V3;
  route: number; routeCol: string; heat: Partial<Record<keyof typeof PT, number>>; good: Partial<Record<keyof typeof PT, number>>;
};
