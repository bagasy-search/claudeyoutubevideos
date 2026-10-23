// cmehel3d · EL MUNDO: una cuadra latinoamericana a oscuras (apagón, día 2) y UNA casa encendida: la de Claudio, en corte
// (cocina con el refrigerador). En la entrada, su auto con el cofre abierto: la batería es un TANQUE de vidrio cuyo nivel
// baja y sube (carga = líquido), y de ahí sale el cable naranja como un río de luz hasta el refrigerador.
// UNA escena y UNA cámara para todo el video; el día y la noche giran sobre la misma cuadra. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../cme3d01/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo (para rótulos HTML y portales) ----------------
export const PT = {
  house: [0, 1.6, 2.5] as [number, number, number],
  fridge: [2.6, 1.2, -1.8] as [number, number, number],
  thermo: [2.6, 1.05, -1.42] as [number, number, number],
  bulb: [0.6, 2.7, -0.4] as [number, number, number],
  bat: [3.05, 0.86, 5.6] as [number, number, number],
  inv: [3.9, 0.12, 4.35] as [number, number, number],
  car: [1.4, 0.8, 5.6] as [number, number, number],
  plug: [2.55, 0.3, -1.5] as [number, number, number],
  table: [-0.9, 0.8, -1.2] as [number, number, number],
};

// ---------------- CÁMARA (claves en segundos de la voz) ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number };
export const KEYS: Key[] = [
  // "Tu calle está negra": desde el portal del avatar, alto sobre la punta de la calle, mirando la cuadra apagada
  { t: 2.9, p: [-26, 6.5, 10.5], l: [-4, 1.0, 3.0], fov: 42 },
  { t: 6.4, p: [-15, 3.6, 10.0], l: [0, 1.3, 1.5], fov: 40 },
  // "es la mía": desde la calle, la casa encendida con el auto en la entrada
  { t: 19.9, p: [7.5, 3.6, 13.5], l: [0.8, 1.3, 1.0], fov: 40 },
  { t: 22.6, p: [4.2, 2.6, 9.6], l: [1.2, 1.2, -0.6], fov: 40 },
  // adentro: el refrigerador andando, 4 grados
  { t: 24.6, p: [1.3, 1.55, 0.7], l: [2.6, 1.15, -1.8], fov: 40, arc: 0.15 },
  { t: 26.0, p: [1.6, 1.45, 0.3], l: [2.6, 1.1, -1.8], fov: 36 },
  // "una sola batería, la de mi auto": del enchufe, la cámara sigue el río de luz hasta el auto
  { t: 28.3, p: [1.9, 0.75, -0.6], l: [2.55, 0.3, -1.6], fov: 38 },
  { t: 29.5, p: [3.0, 0.7, 1.9], l: [3.4, 0.2, 4.0], fov: 40 },
  { t: 30.7, p: [5.6, 2.3, 3.4], l: [3.05, 0.95, 5.6], fov: 30 },
  // "sin comprar una de litio": la batería de cerca (el avatar tapa el viaje)
  { t: 37.1, p: [5.3, 2.1, 3.6], l: [3.05, 0.95, 5.6], fov: 28 },
  { t: 40.0, p: [5.5, 2.25, 3.3], l: [3.05, 0.95, 5.6], fov: 30 },
  // "tres días seguidos": se aleja hasta la cuadra y el cielo gira tres veces
  { t: 42.5, p: [10.5, 5.8, 15.5], l: [0.5, 1.0, 1.5], fov: 42, arc: 0.4 },
  // "esa batería sola no lo hace": de vuelta al tanque (el avatar tapa el viaje)
  { t: 53.6, p: [6.2, 2.4, 3.2], l: [3.0, 0.95, 5.6], fov: 34 },
  { t: 65.5, p: [5.4, 2.0, 2.6], l: [3.0, 0.95, 5.6], fov: 30 },
];
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de cámara en mano, muy leve (nunca quieta del todo)
  p.x += Math.sin(t * 0.7) * 0.03; p.y += Math.sin(t * 0.9 + 1) * 0.02;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.02; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- estado del relato (segundos de la voz) ----------------
// el día: 0 = noche, 1 = día. "tres días seguidos" (40,2-42,6): el cielo gira tres veces sobre la misma cuadra
export const dayAt = (t: number) => (t > 40.1 && t < 42.7 ? 0.5 - 0.5 * Math.cos(((t - 40.1) / 2.6) * Math.PI * 6) : 0);
// nivel del tanque (carga de la batería del auto): lleno; la prueba vieja de 3 h 08 lo vacía hasta 11,8 V (56,5-63,8)
export const levelAt = (t: number) => (t < 56.4 ? 1 : t < 65.5 ? 1 - 0.85 * win(t, 57.0, 63.6) : 1);
// el refrigerador andando (el río de luz corre)
const fridgeOn = (t: number) => (t > 19.5 ? 1 : 0);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: [number, number, number]; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, o }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o !== undefined} opacity={o ?? 1} /></mesh>
);
const Glow: React.FC<{ p: [number, number, number]; s: [number, number]; col: string; o: number; rot?: [number, number, number] }> = ({ p, s, col, o, rot }) => (
  <mesh position={p} rotation={rot}><planeGeometry args={s} /><meshBasicMaterial color={new THREE.Color("#141a26").lerp(new THREE.Color(col), o)} toneMapped={false} /></mesh>
);

// casa de block de un piso, techo plano con pretil y tinaco; a oscuras (alguna vela)
const House: React.FC<{ x: number; z: number; flip?: boolean; tint: string; i: number; block?: Tx; t: number; day: number }> = ({ x, z, flip, tint, i, block, t, day }) => {
  const candle = i % 4 === 2 ? 0.25 + 0.08 * Math.sin(t * 11 + i) + 0.05 * Math.sin(t * 23) : 0;
  const h = 3.2;
  return (
    <group position={[x, 0, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
      <Box p={[0, h / 2, 0]} s={[7.4, h, 5]} c={tint} r={0.95} map={block} rad={0.03} />
      <Box p={[0, 0.35, 2.52]} s={[7.42, 0.7, 0.04]} c={["#7a4b3a", "#3f5d6e", "#5d6b3f"][i % 3]} r={0.8} rad={0.005} />
      <Box p={[0, h + 0.12, 0]} s={[7.6, 0.24, 5.2]} c="#5f5c57" r={1} />
      <Box p={[0, h + 0.42, 2.52]} s={[7.6, 0.4, 0.15]} c={tint} r={1} map={block} />
      {i % 3 === 1 && <Box p={[-1.6, h + 1.4, -0.6]} s={[4.0, 2.4, 3.6]} c="#9a9a96" r={1} map={block} rad={0.02} />}
      <mesh position={[2.3 - (i % 2) * 4, h + 0.8, -1.2]} castShadow><cylinderGeometry args={[0.55, 0.6, 1.1, 20]} /><meshStandardMaterial color={i % 2 ? "#2d4f7a" : "#1d1f22"} roughness={0.6} /></mesh>
      <Box p={[-0.6, 1.05, 2.53]} s={[1.0, 2.1, 0.08]} c={["#5b3b26", "#2f4a5a", "#6b2a24"][i % 3]} r={0.7} />
      {[-2.6, 2.1].map((wx, k) => (
        <group key={k} position={[wx, 1.7, 2.52]}>
          <Box p={[0, 0, -0.01]} s={[1.6, 1.3, 0.05]} c="#d9d2c4" r={0.9} rad={0.01} />
          <Glow p={[0, 0, 0.02]} s={[1.4, 1.1]} col={k === 0 && candle ? "#ff9a3a" : "#8fa6c6"} o={k === 0 && candle ? candle : day * 0.35} />
          {[-0.45, 0, 0.45].map((bx) => <mesh key={bx} position={[bx, 0, 0.06]}><boxGeometry args={[0.03, 1.1, 0.03]} /><meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.5} /></mesh>)}
          {k === 0 && candle > 0 && <pointLight position={[0, 0, 0.8]} intensity={candle * 1.6} distance={3} color="#ff9a3a" />}
        </group>
      ))}
    </group>
  );
};

// el río de luz: cable naranja grueso con pulsos que viajan (corriente que va al refrigerador)
const River: React.FC<{ pts: [number, number, number][]; on: number; t: number; r?: number }> = ({ pts, on, t, r = 0.022 }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map(v3)), [pts.map((p) => p.join()).join("|")]);
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 120, r, 10, false), [curve, r]);
  const N = 9;
  return (
    <group>
      <mesh geometry={geo} castShadow><meshStandardMaterial color="#e2611b" emissive="#ff8a2a" emissiveIntensity={0.35 + on * 0.9} roughness={0.55} toneMapped={false} /></mesh>
      {on > 0.02 && Array.from({ length: N }, (_, i) => {
        const q = curve.getPoint(((t * 0.32 + i / N) % 1));
        return <mesh key={i} position={q}><sphereGeometry args={[r * 2.4, 12, 8]} /><meshBasicMaterial color="#fff1c4" toneMapped={false} transparent opacity={on * 0.95} /></mesh>;
      })}
    </group>
  );
};

// el auto: sedán viejo plateado con el cofre abierto; la batería es un tanque de vidrio con el nivel de carga
const Car: React.FC<{ t: number; level: number; lit: number }> = ({ t, level, lit }) => {
  const col = level > 0.55 ? "#38ff7a" : level > 0.3 ? "#ffb257" : "#ff4a3d";
  const blink = level < 0.3 && Math.sin(t * 9) < 0 ? 0.35 : 1;
  const wob = Math.sin(t * 2.2) * 0.004 * level;
  return (
    <group position={[1.4, 0, 5.6]}>
      {/* carrocería */}
      <Box p={[0, 0.62, 0]} s={[4.3, 0.62, 1.78]} c="#9aa1a8" r={0.32} m={0.55} rad={0.12} />
      <Box p={[-0.35, 1.18, 0]} s={[2.2, 0.55, 1.6]} c="#9aa1a8" r={0.32} m={0.55} rad={0.16} />
      {/* vidrios */}
      <Box p={[-0.35, 1.2, 0.81]} s={[2.0, 0.42, 0.02]} c="#0d1218" r={0.1} m={0.6} rad={0.01} />
      <Box p={[-0.35, 1.2, -0.81]} s={[2.0, 0.42, 0.02]} c="#0d1218" r={0.1} m={0.6} rad={0.01} />
      <Box p={[0.76, 1.18, 0]} s={[0.02, 0.44, 1.5]} c="#0d1218" r={0.1} m={0.6} rot={[0, 0, 0.5]} rad={0.01} />
      {/* ruedas */}
      {[[-1.35, 0.85], [-1.35, -0.85], [1.35, 0.85], [1.35, -0.85]].map(([x, z], i) => <mesh key={i} position={[x, 0.33, z]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.33, 0.33, 0.24, 22]} /><meshStandardMaterial color="#141414" roughness={0.85} /></mesh>)}
      {/* faros y luces traseras (apagados) */}
      {[0.6, -0.6].map((z) => <mesh key={z} position={[2.16, 0.68, z]}><boxGeometry args={[0.02, 0.14, 0.3]} /><meshStandardMaterial color="#d9dde2" emissive="#ffffff" emissiveIntensity={0.05} /></mesh>)}
      {/* vano del motor (hueco oscuro) y el cofre levantado */}
      <Box p={[1.62, 0.9, 0]} s={[0.95, 0.04, 1.5]} c="#16181b" r={0.9} rad={0.01} />
      <group position={[1.1, 0.94, 0]} rotation={[0, 0, 1.95]}>
        <Box p={[0.5, 0, 0]} s={[1.0, 0.04, 1.62]} c="#9aa1a8" r={0.32} m={0.55} rad={0.02} />
      </group>
      <mesh position={[2.05, 1.25, 0.6]} rotation={[0, 0, 0.35]}><cylinderGeometry args={[0.008, 0.008, 0.75, 5]} /><meshStandardMaterial color="#555" /></mesh>
      {/* EL TANQUE: batería de vidrio con el líquido de la carga */}
      <group position={[1.65, 0.92, 0]} scale={1.35}>
        <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.46, 0.4, 0.3]} /><meshStandardMaterial color="#cfe8ff" transparent opacity={0.16} depthWrite={false} roughness={0.05} /></mesh>
        <mesh position={[0, 0.02 + 0.18 * level + wob, 0]}><boxGeometry args={[0.43, 0.36 * level, 0.27]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.9 * blink} transparent opacity={0.88} roughness={0.3} /></mesh>
        <Box p={[0, 0.42, 0]} s={[0.48, 0.05, 0.32]} c="#1e2125" r={0.5} rad={0.01} />
        {[0.25, 0.5, 0.75].map((q) => <mesh key={q} position={[-0.12, 0.02 + 0.36 * q, 0.152]}><planeGeometry args={[0.1, 0.006]} /><meshBasicMaterial color="#e8eef6" transparent opacity={0.7} /></mesh>)}
        {[[-0.14, "#c62828"], [0.14, "#222"]].map(([x, c]) => <mesh key={String(x)} position={[x as number, 0.47, 0.06]}><cylinderGeometry args={[0.025, 0.028, 0.06, 12]} /><meshStandardMaterial color={c as string} metalness={0.6} roughness={0.35} /></mesh>)}
        <pointLight position={[0, 0.3, 0.3]} intensity={0.35 * blink} distance={1.2} color={col} />
      </group>
      {/* cables de los bornes al inversor en el piso */}
      <mesh position={[2.15, 0.6, -0.95]} rotation={[0.7, 0, 0.2]}><cylinderGeometry args={[0.016, 0.016, 1.3, 6]} /><meshStandardMaterial color="#b3201a" roughness={0.5} /></mesh>
    </group>
  );
};

// el inversor en el piso, sobre una tabla, al lado de la rueda
const Inverter: React.FC<{ on: number; t: number }> = ({ on, t }) => (
  <group position={[3.9, 0, 4.35]}>
    <Box p={[0, 0.03, 0]} s={[0.55, 0.05, 0.4]} c="#7a5a3a" r={0.9} />
    <Box p={[0, 0.13, 0]} s={[0.36, 0.14, 0.24]} c="#b8bec4" r={0.35} m={0.6} />
    {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[-0.15 + k * 0.06, 0.205, 0]}><boxGeometry args={[0.012, 0.012, 0.22]} /><meshStandardMaterial color="#8a9096" metalness={0.6} /></mesh>)}
    <mesh position={[0.181, 0.15, 0.06]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.012, 10]} /><meshBasicMaterial color={on ? (Math.sin(t * 4) > -0.8 ? "#38ff7a" : "#1d4a2a") : "#1d4a2a"} toneMapped={false} /></mesh>
  </group>
);

// cielo: domo nocturno con estrellas y luna; de día se aclara
const Sky: React.FC<{ day: number; flake: THREE.Texture }> = ({ day, flake }) => {
  const tex = useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 512; const g = cv.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#03060d"); gr.addColorStop(0.45, "#0b1528"); gr.addColorStop(0.5, "#1c2a44"); gr.addColorStop(1, "#0a0f18");
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 900; i++) { const y = rnd(i, 2) * 240; g.fillStyle = `rgba(255,255,255,${0.15 + 0.75 * rnd(i, 3) * (1 - y / 260)})`; const r = rnd(i, 4) < 0.92 ? 0.6 : 1.3; g.beginPath(); g.arc(rnd(i, 1) * 1024, y, r, 0, 6.3); g.fill(); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return (
    <group>
      <mesh><sphereGeometry args={[180, 48, 24]} /><meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} transparent opacity={1 - day} depthWrite={false} toneMapped={false} /></mesh>
      <group position={[-60, 55, -120]}>
        <mesh><circleGeometry args={[4.2, 40]} /><meshBasicMaterial color="#f3f0e2" fog={false} toneMapped={false} transparent opacity={1 - day} /></mesh>
        <sprite scale={[46, 46, 1]}><spriteMaterial map={flake} color="#9fb8ff" transparent opacity={0.45 * (1 - day)} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></sprite>
      </group>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-120 + i * 30, -2, -95 - rnd(i, 5) * 20]} scale={[26 + rnd(i, 6) * 20, 10 + rnd(i, 7) * 14, 10]}><sphereGeometry args={[1, 16, 8]} /><meshBasicMaterial color={new THREE.Color("#070a10").lerp(new THREE.Color("#5d6f86"), day)} fog={false} /></mesh>)}
    </group>
  );
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const day = dayAt(t), level = levelAt(t), on = fridgeOn(t);
  const skyN = new THREE.Color("#070b14"), skyD = new THREE.Color("#8fa6c6");
  const sky = skyN.clone().lerp(skyD, day * 0.8);
  // el compresor: la caja tiembla apenas cuando arranca
  const kick = t > 24.4 && t < 25.4 ? Math.sin(t * 70) * 0.004 * (1 - win(t, 24.9, 25.4)) : 0;
  const river: [number, number, number][] = [[3.85, 0.2, 4.35], [3.4, 0.03, 3.6], [3.05, 0.03, 2.6], [2.85, 0.03, 1.2], [2.75, 0.03, -0.6], [2.6, 0.08, -1.5], [2.55, 0.3, -1.52]];
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.85 - day * 0.3} threshold={0.8 + day * 0.15} exposure={0.95 + 0.3 * day} env={0.1 + 0.25 * day} />
      <color attach="background" args={[sky.getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.024 - day * 0.014]} />
      <hemisphereLight args={[new THREE.Color("#5f7cb8").lerp(new THREE.Color("#ffe3c4"), day).getHex(), 0x1b1d24, 0.65 + day * 0.7]} />
      <Sky day={day} flake={tx.flake} />
      <directionalLight position={[-14, 22, 16]} intensity={1.0 + day * 1.6} color={new THREE.Color("#9fb8ff").lerp(new THREE.Color("#fff0d8"), day)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0004} />

      {/* piso, vereda, calle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[240, 240]} /><meshStandardMaterial color="#3b3a37" roughness={1} map={tx.concrete} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 7.6]} receiveShadow><planeGeometry args={[240, 5.6]} /><meshStandardMaterial color="#26282b" roughness={0.92} /></mesh>
      {Array.from({ length: 34 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-70 + i * 4.2, 0.02, 9.2]}><planeGeometry args={[1.8, 0.12]} /><meshBasicMaterial color="#b9a660" transparent opacity={0.4} /></mesh>)}
      <Box p={[0, 0.07, 11.35]} s={[200, 0.14, 1.9]} c="#8a867e" r={1} rad={0.02} />
      {/* entrada de concreto de la casa (el auto se para acá) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.0, 0.015, 4.9]} receiveShadow><planeGeometry args={[7.4, 4.6]} /><meshStandardMaterial color="#6f6c66" roughness={0.95} map={tx.concrete} /></mesh>

      {/* la cuadra apagada */}
      {[-27, -18, -9, 9, 18, 27].map((x, i) => <House key={"a" + x} x={x} z={0} tint={["#d8cfbf", "#c9b9a1", "#b8c4c0", "#d9c3a5", "#c7c0b3", "#cfd2c6"][i]} i={i} block={tx.block} t={t} day={day} />)}
      {[-22.5, -13.5, -4.5, 4.5, 13.5, 22.5].map((x, i) => <House key={"b" + x} x={x} z={17.0} flip tint={["#cdbfae", "#bcc8c4", "#d6c8b0", "#c3b8a6", "#d2cdbd", "#bfb5a5"][i]} i={i + 7} block={tx.block} t={t} day={day} />)}
      {/* postes apagados con cables */}
      {[-24, -12, 12, 24].map((x) => <mesh key={x} position={[x, 3.6, 3.6]} castShadow><cylinderGeometry args={[0.12, 0.16, 7.2, 10]} /><meshStandardMaterial color="#8e8a82" roughness={0.9} /></mesh>)}
      {[-1, 1].map((k) => <mesh key={k} position={[0, 7.0, 3.6 + k * 0.5]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 200, 4]} /><meshStandardMaterial color="#111" /></mesh>)}

      {/* ===== LA CASA DE CLAUDIO (frente abierto en z=2.5): la cocina ===== */}
      <group>
        <Box p={[0, 1.6, -2.45]} s={[7.4, 3.2, 0.2]} c="#d8cdb8" r={0.95} map={tx.block} />
        <Box p={[-3.62, 1.6, 0]} s={[0.2, 3.2, 5]} c="#d8cdb8" r={0.95} map={tx.block} />
        <Box p={[3.62, 1.6, 0]} s={[0.2, 3.2, 5]} c="#d8cdb8" r={0.95} map={tx.block} />
        <Box p={[0, 3.32, 0]} s={[7.6, 0.24, 5.2]} c="#b9b3a8" r={1} />
        <mesh position={[2.3, 4.0, -1.2]} castShadow><cylinderGeometry args={[0.55, 0.55, 1.1, 20]} /><meshStandardMaterial color="#2d4f7a" roughness={0.6} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow><planeGeometry args={[7.2, 4.8]} /><meshStandardMaterial color="#c9c3b8" map={tx.tile} roughness={0.6} /></mesh>
        {/* azulejos detrás de la mesada y la mesada con la tarja */}
        <Box p={[-1.2, 1.25, -2.33]} s={[3.6, 0.6, 0.03]} c="#cfe0e6" r={0.4} />
        <Box p={[-1.2, 0.46, -2.0]} s={[3.6, 0.92, 0.6]} c="#7b5a3e" r={0.8} map={tx.planks} rad={0.015} />
        <Box p={[-1.2, 0.94, -2.0]} s={[3.62, 0.05, 0.62]} c="#d9d4ca" r={0.4} rad={0.01} />
        <Box p={[-1.9, 0.95, -2.0]} s={[0.6, 0.04, 0.42]} c="#9aa1a8" r={0.25} m={0.7} rad={0.01} />
        {/* mesa con mantel y la lámpara */}
        <Box p={[-0.9, 0.76, -0.9]} s={[1.6, 0.06, 0.95]} c="#8b5e3c" r={0.75} map={tx.planks} rad={0.01} />
        {[[-1.6, -0.5], [-0.2, -0.5], [-1.6, -1.3], [-0.2, -1.3]].map(([x, z], i) => <Box key={i} p={[x, 0.37, z]} s={[0.06, 0.74, 0.06]} c="#5f3f27" />)}
        {/* EL REFRIGERADOR: viejo, blanco, dos puertas, andando */}
        <group position={[2.6 + kick, 0, -1.85]}>
          <Box p={[0, 0.85, 0]} s={[0.78, 1.7, 0.7]} c="#eceef0" r={0.35} m={0.08} rad={0.05} />
          <mesh position={[0, 1.22, 0.355]}><boxGeometry args={[0.76, 0.012, 0.01]} /><meshStandardMaterial color="#9aa0a6" /></mesh>
          <mesh position={[0.3, 1.42, 0.37]}><boxGeometry args={[0.03, 0.26, 0.03]} /><meshStandardMaterial color="#888" metalness={0.7} /></mesh>
          <mesh position={[0.3, 0.92, 0.37]}><boxGeometry args={[0.03, 0.36, 0.03]} /><meshStandardMaterial color="#888" metalness={0.7} /></mesh>
          <mesh position={[-0.22, 1.5, 0.357]}><planeGeometry args={[0.12, 0.05]} /><meshBasicMaterial color={on ? "#7fd6ff" : "#223"} toneMapped={false} /></mesh>
          {/* imanes y una foto pegada */}
          {[[-0.15, 0.8, "#c62828"], [0.05, 1.0, "#2a62c9"], [-0.05, 0.65, "#f0b400"]].map(([x, y, c], i) => <mesh key={i} position={[x as number, y as number, 0.36]}><circleGeometry args={[0.025, 12]} /><meshStandardMaterial color={c as string} /></mesh>)}
          <mesh position={[-0.12, 0.9, 0.358]} rotation={[0, 0, 0.08]}><planeGeometry args={[0.14, 0.1]} /><meshStandardMaterial color="#d8c9a8" /></mesh>
        </group>
        {/* el foco del techo: la única luz de la cuadra */}
        <mesh position={PT.bulb}><sphereGeometry args={[0.07, 14, 10]} /><meshBasicMaterial color={new THREE.Color("#2a2a2a").lerp(new THREE.Color("#fff3d0"), 1)} toneMapped={false} /></mesh>
        <mesh position={[PT.bulb[0], 3.0, PT.bulb[2]]}><cylinderGeometry args={[0.006, 0.006, 0.6, 4]} /><meshStandardMaterial color="#111" /></mesh>
        <pointLight position={PT.bulb} intensity={5.5} distance={8} color="#ffd9a0" castShadow />
        <spotLight position={[0, 2.8, 1.5]} angle={1.0} penumbra={0.9} intensity={34} distance={14} color="#ffc677" target-position={[0.6, 0, 6]} />
      </group>

      {/* la entrada: el auto, el inversor y el río de luz hasta el refrigerador */}
      <Car t={t} level={level} lit={on} />
      <Inverter on={on} t={t} />
      <River pts={river} on={on} t={t} />
    </ThreeCanvas>
  );
};
