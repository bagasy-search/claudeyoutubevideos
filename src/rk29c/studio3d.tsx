// estudio 3D compartido de la tanda rk29 (29-oct, tras EVALUADOR r2: los componentes 2D quedaban planos → objetos 3D reales
// sobre una mesa con luz motivada, sombra de contacto, AO y cámara curva). Luces SIEMPRE montadas (rampas de intensidad).
import React, { useContext, useEffect, useMemo, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export type V3 = [number, number, number];
const W = 1920, H = 1080;
export const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (t: number, a: number, b: number) => { const x = c01((t - a) / (b - a)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
// resorte con peso (sobrepasa y asienta)
export const spr = (t: number, a: number, k = 7, d = 0.42) => { const x = t - a; if (x <= 0) return 0; return 1 - Math.exp(-d * k * x) * Math.cos(k * x); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- cámara: llaves (tiempo relativo al componente) con arco y deriva orgánica ----------
export type CK = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: V3) => new THREE.Vector3(a[0], a[1], a[2]);
export const DurCtx = React.createContext<number>(9);
const Cam: React.FC<{ tt: number; keys: CK[]; dur: number }> = ({ tt, keys, dur }) => {
  const { camera } = useThree();
  let i = 0; while (i < keys.length - 1 && keys[i + 1].t <= tt) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  // el fov se hereda de la última clave que lo fijó (sin esto la clave sin fov volvía a 32 y cerraba el cuadro: recortes)
  let fa = 32; for (let j = 0; j <= i; j++) if (keys[j].fov) fa = keys[j].fov as number;
  const k = b.t > a.t ? sm(tt, a.t, b.t) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p));
  // salida: empuje final hacia el objeto (el medio y la salida nunca quedan iguales)
  p.lerp(l, 0.04 * sm(tt, dur * 0.55, dur + 0.6)); // 0,1 recortaba objetos altos (puertas) en la salida
  p.x += Math.sin(tt * 0.53) * 0.01; p.y += Math.sin(tt * 0.71 + 1) * 0.007;
  const pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(p); pc.lookAt(l); pc.fov = lerp(fa, b.fov ?? fa, k); pc.near = 0.05; pc.far = 120; pc.updateProjectionMatrix();
  return null;
};

// ---------- texturas propias ----------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
export const useTex3 = () => useMemo(() => ({
  brick: mk(256, 256, (g) => { g.fillStyle = "#d8cbb8"; g.fillRect(0, 0, 256, 256); for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) { const o = (r % 2) * 32, v = rnd(r * 4 + c, 2) * 30; g.fillStyle = `rgb(${150 + v},${62 + v / 2},${42 + v / 3})`; g.fillRect(c * 64 + o - 64, r * 32 + 3, 58, 26); g.fillRect(c * 64 + o, r * 32 + 3, 58, 26); } }, [2, 2]),
  fabric: mk(128, 128, (g) => { g.fillStyle = "#3a3d44"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 128; i += 4) { g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(i, 0, 2, 128); g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(0, i, 128, 2); } }, [4, 4]),
  drywall: mk(128, 128, (g) => { g.fillStyle = "#ece7dc"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${0.03 * rnd(i, 3)})`; g.fillRect(rnd(i, 1) * 128, rnd(i, 2) * 128, 2, 2); } }),
  wood: mk(256, 256, (g) => { for (let c = 0; c < 4; c++) { const b = 150 + rnd(c, 1) * 30; g.fillStyle = `rgb(${b + 20},${b - 25},${b - 70})`; g.fillRect(c * 64, 0, 64, 256); for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(70,40,15,${0.1 + rnd(c, k) * 0.15})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(c * 64 + 4 + k * 4, 0); g.bezierCurveTo(c * 64 + k * 4 + 10, 90, c * 64 + k * 4 - 6, 170, c * 64 + 4 + k * 4, 256); g.stroke(); } g.fillStyle = "rgba(30,18,8,.5)"; g.fillRect(c * 64, 0, 2, 256); } }, [1, 1]),
}), []);

// ---------- foto real del momento como fondo con profundidad (la pasa el Stage por contexto) ----------
export const PhotoCtx = React.createContext<string | undefined>(undefined);
const usePhoto = (src?: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [hd] = useState(() => (src ? delayRender("foto3d " + src) : null));
  useEffect(() => {
    if (!src || hd === null) return;
    new THREE.TextureLoader().load(src, (t: THREE.Texture) => { t.colorSpace = THREE.SRGBColorSpace; setTex(t); continueRender(hd); }, undefined, () => continueRender(hd));
  }, [src, hd]);
  return tex;
};
const Backdrop: React.FC<{ dim: number }> = ({ dim }) => {
  const tex = usePhoto(useContext(PhotoCtx));
  if (!tex) return null;
  return <mesh position={[0, 3.2, -9]}><planeGeometry args={[30, 16.9]} /><meshBasicMaterial map={tex} color={new THREE.Color(dim, dim, dim)} toneMapped={false} fog={false} /></mesh>;
};

// ---------- el estudio: mesa / piso, luz principal con sombra, contraluz, AO + bloom ----------
export const Studio: React.FC<{ tt: number; keys: CK[]; floor?: "wood" | "concrete" | "tile" | "paper" | "none"; night?: number; bg?: string; kl?: V3; warm?: number; photo?: number; children: React.ReactNode }> = ({ tt, keys, floor = "wood", night = 0, bg = "#2b2620", kl: kp = [3, 6, 4], warm = 1, photo = 0.5, children }) => {
  const tx = useTextures(), dur = useContext(DurCtx);
  const fm = useMemo(() => {
    const b = floor === "wood" ? tx.planks : floor === "concrete" ? tx.concrete : floor === "tile" ? tx.tile : floor === "paper" ? tx.paper : undefined;
    if (!b) return undefined; const c = b.clone(); c.repeat.set(floor === "tile" ? 14 : 9, floor === "tile" ? 14 : 9); c.needsUpdate = true; return c;
  }, [tx, floor]);
  return <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 32, position: [0, 2, 5] }}>
    <Cam tt={tt} keys={keys} dur={dur} />
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[bg, 7, 22]} />
    {photo > 0 && <Backdrop dim={photo} />}
    <ambientLight intensity={0.22 - 0.1 * night} color={night > 0.5 ? "#8094c8" : "#fff2e0"} />
    <spotLight position={kp} angle={0.6} penumbra={0.8} intensity={(40 - 22 * night) * warm} distance={30} decay={1.6} color={night > 0.5 ? "#b8c6ff" : "#ffe6c4"} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
    <directionalLight position={[-4, 3, -5]} intensity={0.9} color="#9fb6ff" />
    {floor !== "none" && <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial map={fm} color={floor === "concrete" ? "#9a9b9d" : "#ffffff"} roughness={0.75} /></mesh>}
    {children}
    <Post bloom={0.28} threshold={0.93} env={0.32} exposure={1.05} />
  </ThreeCanvas>;
};

// ---------- piezas ----------
type MP = { c?: string; r?: number; m?: number; e?: string; ei?: number; op?: number; map?: THREE.Texture };
export const Mat: React.FC<MP> = ({ c = "#ccc", r = 0.6, m = 0, e = "#000", ei = 0, op, map }) => <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} map={map} />;
export const RB: React.FC<{ p?: V3; s: V3; rad?: number; rot?: V3 } & MP> = ({ p = [0, 0, 0], s, rad = 0.03, rot, ...m }) => <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow receiveShadow><Mat {...m} /></mesh>;

// llave de auto (control): cuerpo negro brillante, 3 botones que se hunden, LED que late, argolla; `open` separa las mitades y deja ver la pila
export const Fob3: React.FC<{ p?: V3; rot?: V3; s?: number; led?: number; press?: number[]; open?: number; batt?: boolean; dim?: number; col?: string; ring?: boolean }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, led = 0, press = [0, 0, 0], open = 0, batt = true, dim = 0, col = "#17181c", ring = true }) => (
  <group position={p} rotation={rot} scale={s}>
    <group position={[0, 0.045 + open * 0.16, 0]} rotation={[0, 0, -open * 0.35]}>
      <RB p={[0, 0, 0]} s={[0.34, 0.06, 0.6]} rad={0.028} c={col} r={0.25} m={0.1} />
      {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.036 - press[i] * 0.012, -0.14 + i * 0.13]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.02, 24]} /><Mat c={i === 2 ? "#a33" : "#2b2d33"} r={0.5} /></mesh>)}
      <mesh position={[0.1, 0.032, 0.21]}><sphereGeometry args={[0.016, 16, 16]} /><meshBasicMaterial color={led > 0.05 ? "#ff3020" : "#3a1410"} toneMapped={false} /></mesh>
      <pointLight position={[0.1, 0.08, 0.21]} intensity={led * 1.4 * (1 - dim)} distance={0.8} color="#ff3020" />
    </group>
    <RB p={[0, 0.01, 0]} s={[0.34, 0.03, 0.6]} rad={0.014} c={col} r={0.35} />
    {batt && <mesh position={[0, 0.03 + open * 0.05, 0.02]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.016, 32]} /><Mat c="#d6d8dc" m={1} r={0.22} /></mesh>}
    <RB p={[0, 0.03, 0]} s={[0.352, 0.012, 0.612]} rad={0.006} c="#c9ced4" m={1} r={0.18} />
    <mesh position={[0, 0.03, -0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.07, 0.014, 12, 32]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    {ring && <group position={[0, 0.02, -0.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.13, 0.012, 12, 40]} /><Mat c="#d6d9de" m={1} r={0.2} /></mesh>
      <group position={[0.06, 0.0, -0.14]} rotation={[0, 0.5, 0]}><mesh castShadow><cylinderGeometry args={[0.07, 0.07, 0.014, 6]} /><Mat c="#c8a24a" m={1} r={0.3} /></mesh><RB p={[0, 0, -0.2]} s={[0.05, 0.012, 0.3]} rad={0.004} c="#c8a24a" m={1} r={0.3} /></group>
    </group>}
  </group>
);

// moneda / pila
export const Coin3: React.FC<{ p?: V3; rot?: V3; d?: number; c?: string; glow?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], d = 0.2, c = "#c9ced4", glow = 0.18 }) => (
  <group position={p} rotation={rot}>
    <mesh castShadow><cylinderGeometry args={[d / 2, d / 2, d * 0.09, 48]} /><Mat c={c} m={1} r={0.16} e="#ffffff" ei={glow} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[d / 2, d * 0.03, 8, 48]} /><Mat c="#8a8e95" m={1} r={0.3} /></mesh>
    <mesh position={[0, d * 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[d * 0.36, d * 0.4, 48]} /><meshStandardMaterial color="#8a8e95" metalness={1} roughness={0.3} /></mesh>
  </group>
);

// bolsa de tela con cierre (la bolsa que duerme la llave); open = solapa abierta
export const Pouch3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; col?: string; mesh?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, col = "#3a3d44", mesh = 0 }) => {
  const t3 = useTex3();
  return <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.07, 0]} s={[0.62, 0.14, 0.82]} rad={0.06} c={col} r={0.95} map={t3.fabric} />
    <group position={[0, 0.14, -0.41]} rotation={[-open * 2.2, 0, 0]}><RB p={[0, 0, 0.2]} s={[0.6, 0.03, 0.4]} rad={0.012} c={col} r={0.95} map={t3.fabric} /></group>
    <RB p={[0, 0.142, 0.02]} s={[0.52, 0.012, 0.02]} rad={0.005} c="#9aa0a8" m={1} r={0.3} />
    {mesh > 0 && <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.6, 0.12, 0.8]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.3} wireframe transparent opacity={0.5 * mesh} /></mesh>}
  </group>;
};

// auto chico (juguete realista): carrocería, cabina vidriada, ruedas, faros, giros que titilan, luz de freno
export const Car3: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string; head?: number; blink?: number; brake?: number; inner?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#7c8590", head = 0, blink = 0, brake = 0, inner = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.32, 0]} s={[1.0, 0.32, 2.3]} rad={0.12} c={col} r={0.28} m={0.55} />
    <RB p={[0, 0.6, -0.15]} s={[0.86, 0.3, 1.2]} rad={0.12} c="#1d2430" r={0.28} m={0.4} e="#ffd9a0" ei={inner * 0.9} />
    <pointLight position={[0, 0.62, -0.1]} intensity={inner * 2.2} distance={2.2} color="#ffd9a0" />
    {[-1, 1].map((sx) => <group key={"m" + sx} position={[sx * 0.5, 0.55, 0.42]} rotation={[0, sx * (0.2 + 1.1 * inner), 0]}><RB p={[sx * 0.08, 0, 0]} s={[0.16, 0.08, 0.04]} rad={0.015} c={col} r={0.3} m={0.5} /></group>)}
    {[[-0.5, 0.75], [0.5, 0.75], [-0.5, -0.75], [0.5, -0.75]].map(([x, z], i) => <mesh key={i} position={[x, 0.17, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.17, 0.17, 0.14, 28]} /><Mat c="#111" r={0.8} /></mesh>)}
    {[-0.32, 0.32].map((x, i) => <mesh key={"h" + i} position={[x, 0.36, 1.151]}><boxGeometry args={[0.2, 0.08, 0.01]} /><meshBasicMaterial color={head > 0.05 ? "#fff6dc" : "#8a8a80"} toneMapped={false} /></mesh>)}
    {[-0.44, 0.44].map((x, i) => <mesh key={"b" + i} position={[x, 0.36, 1.151]}><boxGeometry args={[0.08, 0.06, 0.012]} /><meshBasicMaterial color={blink > 0.5 ? "#ffb020" : "#5a4310"} toneMapped={false} /></mesh>)}
    {[-0.36, 0.36].map((x, i) => <mesh key={"r" + i} position={[x, 0.38, -1.151]}><boxGeometry args={[0.24, 0.07, 0.012]} /><meshBasicMaterial color={brake > 0.05 ? "#ff2a1a" : "#4a1410"} toneMapped={false} /></mesh>)}
    <spotLight position={[0, 0.4, 1.25]} target-position={[0, 0, 4]} angle={0.5} penumbra={0.7} intensity={head * 14} distance={6} color="#fff2d0" />
    <pointLight position={[0, 0.5, 1.3]} intensity={blink * 0.9} distance={1.6} color="#ffb020" />
  </group>
);

// ondas de señal: anillos 3D (toro) que salen de `p` y se apagan; k = tiempo, dir = eje (y = hacia arriba)
export const Rings3: React.FC<{ p: V3; k: number; n?: number; r?: number; col?: string; rot?: V3; op?: number }> = ({ p, k, n = 3, r = 1.2, col = "#ffb257", rot = [Math.PI / 2, 0, 0], op = 1 }) => (
  <group position={p} rotation={rot}>{Array.from({ length: n }, (_, i) => { const f = ((k + i / n) % 1); return <mesh key={i} scale={0.08 + f * r}><torusGeometry args={[1, 0.035 / (0.08 + f * r) * 0.5 + 0.012, 8, 64]} /><meshBasicMaterial color={col} transparent opacity={(1 - f) * 0.85 * op} toneMapped={false} /></mesh>; })}</group>
);

// pared con espesor (material: brick / wood / drywall)
export const Wall3: React.FC<{ p?: V3; rot?: V3; s: V3; kind: "brick" | "wood" | "drywall" }> = ({ p = [0, 0, 0], rot, s, kind }) => {
  const t3 = useTex3();
  return <RB p={p} rot={rot} s={s} rad={0.01} c="#fff" r={0.9} map={kind === "brick" ? t3.brick : kind === "wood" ? t3.wood : t3.drywall} />;
};

// ladrón: silueta con capucha (capsulas), paso y brazo que alcanza
export const Thief3: React.FC<{ p?: V3; yaw?: number; step?: number; reach?: number; s?: number }> = ({ p = [0, 0, 0], yaw = 0, step = 0, reach = 0, s = 1 }) => {
  const m = <meshStandardMaterial color="#16181d" roughness={0.9} />;
  return <group position={p} rotation={[0, yaw, 0]} scale={s}>
    <mesh position={[0, 0.95, 0]} castShadow><capsuleGeometry args={[0.2, 0.72, 6, 16]} />{m}</mesh>
    <mesh position={[0, 1.6, 0]} castShadow><sphereGeometry args={[0.2, 20, 20]} />{m}</mesh>
    <group position={[0.24, 1.3, 0]} rotation={[-0.2 - 1.3 * reach, 0, 0]}><mesh position={[0, -0.3, 0]} castShadow><capsuleGeometry args={[0.065, 0.48, 4, 8]} />{m}</mesh></group>
    <group position={[-0.24, 1.3, 0]} rotation={[0.3 * step, 0, 0]}><mesh position={[0, -0.3, 0]} castShadow><capsuleGeometry args={[0.065, 0.48, 4, 8]} />{m}</mesh></group>
    {[-0.1, 0.1].map((x, i) => <group key={i} position={[x, 0.6, 0]} rotation={[(i ? -1 : 1) * 0.45 * step, 0, 0]}><mesh position={[0, -0.28, 0]} castShadow><capsuleGeometry args={[0.08, 0.46, 4, 8]} />{m}</mesh></group>)}
  </group>;
};

// mueble con cajón que sale con peso (open 0..1)
export const Drawer3: React.FC<{ p?: V3; open?: number; children?: React.ReactNode }> = ({ p = [0, 0, 0], open = 0, children }) => {
  const t3 = useTex3();
  return <group position={p}>
    <RB p={[0, 0.45, 0]} s={[1.6, 0.9, 1.0]} rad={0.02} c="#b9b2a5" r={0.6} />
    <group position={[0, 0.62, 0.02 + open * 0.75]}>
      <RB p={[0, 0, 0.49]} s={[1.5, 0.3, 0.04]} rad={0.012} c="#fff" r={0.6} map={t3.wood} />
      <RB p={[0, 0.0, 0.52]} s={[0.36, 0.04, 0.04]} rad={0.015} c="#c9ced4" m={1} r={0.3} />
      <RB p={[0, -0.13, 0]} s={[1.42, 0.03, 0.94]} rad={0.005} c="#d9cdb6" r={0.9} />
      {[-0.71, 0.71].map((x, i) => <RB key={i} p={[x, -0.02, 0]} s={[0.03, 0.24, 0.94]} rad={0.005} c="#b98a55" r={0.8} />)}
      <RB p={[0, -0.02, -0.46]} s={[1.42, 0.24, 0.03]} rad={0.005} c="#b98a55" r={0.8} />
      <group position={[0, -0.11, 0]}>{children}</group>
    </group>
  </group>;
};
