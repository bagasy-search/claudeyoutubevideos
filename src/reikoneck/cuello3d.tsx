// reikoneck · EL MUNDO: el departamento de Reiko en Osaka en corte de casa de muñecas, de mañana, más el SALÓN de antes.
// De izquierda a derecha: el SALÓN (sillón reclinable, espejo redondo, el calentador de toallas con su vidrio tibio, la
// radio vieja), el BAÑO (pileta, espejo redondo, estante de cedro con los frascos, el aceite de camelia, el protector,
// toallas dobladas y el MANIQUÍ de peluquería en su pie: el cuello que muestra todo), la COCINA chiquita (pava, mesa baja
// con el celular y los dos diccionarios), el DORMITORIO de tatami (futón, la almohada alta vs la de sobakawa, un 2º
// maniquí acostado) y el BALCÓN (sol, sombrilla higasa, ropa tendida).
// El maniquí cambia por tramo: toalla tibia que lo envuelve (con vapor), los hombros que bajan, la zona de la cara que
// baja hasta la clavícula, las flechas del aceite (adelante SUBE, a los costados BAJA), el sol que lo tiñe y la sombrilla
// que lo apaga, el celular a la panza (el cuello se dobla y aparecen las líneas) o a los ojos, besar el techo, el cuello
// del kimono que muestra la nuca y el hilo dorado que tira de la coronilla.
// UNA escena y UNA cámara (keyframes clavados a la voz con at()), balanceo a mano manoCam. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type V3 = [number, number, number];

// el maniquí principal (baño) y sus puntos
const BX = -3.0, BZ = -0.7, BY = 1.02; // base de los hombros (arriba del pie)
// ---------------- puntos del mundo ----------------
export const PT = {
  salon: [-7.5, 1.1, -1.0] as V3,        // el sillón del salón
  warmer: [-9.2, 1.0, -1.85] as V3,      // el calentador de toallas
  radio: [-5.8, 1.5, -2.05] as V3,
  sink: [-3.9, 0.95, -1.9] as V3,
  mirror: [-3.9, 1.65, -2.18] as V3,
  oil: [-1.75, 1.55, -2.05] as V3,       // el frasquito de camelia
  sunscreen: [-1.45, 1.55, -2.05] as V3,
  towels: [-2.2, 1.55, -2.05] as V3,
  neck: [BX, BY + 0.2, BZ + 0.1] as V3,  // el cuello del maniquí (adelante)
  chin: [BX, BY + 0.42, BZ + 0.18] as V3,
  nape: [BX, BY + 0.24, BZ - 0.13] as V3,
  collar: [BX, BY + 0.02, BZ + 0.16] as V3,
  head: [BX, BY + 0.6, BZ] as V3,
  kettle: [0.2, 1.05, -1.95] as V3,
  table: [1.5, 0.35, -1.1] as V3,        // mesa baja: celular + diccionarios
  dicts: [1.85, 0.45, -1.2] as V3,
  futon: [4.8, 0.2, -1.1] as V3,
  pillow: [4.8, 0.3, -1.85] as V3,
  balcony: [8.5, 1.2, -0.8] as V3,
  higasa: [8.4, 1.9, -0.6] as V3,
  center: [-0.5, 1.0, -1.0] as V3,
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
    // cámara a mano virtual (balanceo lento, no temblor): giro sobre el punto de mira, escalado por la distancia
    const m = manoCam(t, 1, 7), d = p.distanceTo(l), rd = Math.PI / 180;
    l.x += Math.sin(m.pan * rd) * d; l.y += Math.sin(m.tilt * rd) * d;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k), roll: m.roll * rd };
  };
  const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const c = new THREE.PerspectiveCamera(cm.fov, W / H, 0.05, 200); c.position.copy(cm.p); c.lookAt(cm.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = q.clone().project(c); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, front: v.z < 1 };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  return { camAt, screenOf };
};

const Cam: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"] }> = ({ t, camAt }) => {
  const { camera } = useThree();
  const c = camAt(t);
  const pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(c.p); pc.up.set(Math.sin(c.roll), Math.cos(c.roll), 0); pc.lookAt(c.l); pc.fov = c.fov; pc.near = 0.03; pc.far = 200; pc.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
type Tx = THREE.Texture;
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const useCasaTex = () => useMemo(() => ({
  plaster: mk(256, 256, (g) => { g.fillStyle = "#e4dccd"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 205 + rnd(i, 1) * 35; g.fillStyle = `rgba(${v},${v - 6},${v - 18},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [3, 1]),
  // azulejo blanco chico del baño japonés
  wtile: mk(256, 256, (g) => { g.fillStyle = "#f1efe9"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(120,120,110,.35)"; g.lineWidth = 2; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * 32, 0); g.lineTo(k * 32, 256); g.stroke(); g.beginPath(); g.moveTo(0, k * 32); g.lineTo(256, k * 32); g.stroke(); } for (let i = 0; i < 64; i++) { g.fillStyle = `rgba(255,255,255,${0.1 + rnd(i, 4) * 0.2})`; g.fillRect((i % 8) * 32 + 4, Math.floor(i / 8) * 32 + 4, 10, 3); } }, [4, 3]),
  // tatami: fibras + borde de tela oscuro
  tatami: mk(256, 512, (g) => { g.fillStyle = "#b9b07a"; g.fillRect(0, 0, 256, 512); for (let y = 0; y < 512; y += 3) { g.fillStyle = `rgba(${120 + rnd(y, 1) * 40},${115 + rnd(y, 2) * 30},${60 + rnd(y, 3) * 20},.45)`; g.fillRect(0, y, 256, 1.5); } g.fillStyle = "#2f3a2c"; g.fillRect(0, 0, 14, 512); g.fillRect(242, 0, 14, 512); }, [3, 1]),
  cedar: mk(256, 256, (g) => { g.fillStyle = "#c9a06c"; g.fillRect(0, 0, 256, 256); for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(140,90,45,${0.12 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(90, y + 4 * rnd(k, 3), 170, y - 3, 256, y + 2); g.stroke(); } }),
  frost: mk(128, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#fffaf0"); gr.addColorStop(1, "#f3e7d2"); g.fillStyle = gr; g.fillRect(0, 0, 128, 256); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(255,255,255,${rnd(i, 1) * 0.5})`; g.fillRect(rnd(i, 2) * 128, rnd(i, 3) * 256, 2, 2); } g.fillStyle = "rgba(120,110,90,.5)"; g.fillRect(62, 0, 4, 256); g.fillRect(0, 126, 128, 4); }),
  shoji: mk(256, 256, (g) => { g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#8a6a44"; for (let k = 0; k <= 4; k++) { g.fillRect(k * 63, 0, 4, 256); g.fillRect(0, k * 63, 256, 4); } }),
  laundry: mk(128, 128, (g) => { g.fillStyle = "#e9eef5"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#9fb6d9"; for (let k = 0; k < 6; k++) g.fillRect(0, k * 22 + 4, 128, 6); }),
}), []);

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V3; r: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V3; e?: string; ei?: number; op?: number; seg?: number }> = ({ p, r, r2, h, c, rough = 0.6, m = 0, rot, e, ei = 0, op, seg = 32 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);

// ---------------- EL MANIQUÍ ----------------
// porcelana mate de cabeza de práctica de estética: hombros + pecho alto, cuello en DOS tramos (se dobla de verdad),
// cabeza con mentón, nariz, labios y la melena carré negra. Todos los efectos del video viven acá.
export type BustSt = {
  pitch: number; fold: number; towel: number; steam: number; sh: number; zone: number; face: number; arrows: number;
  sun: number; shade: number; phone: number; phoneH: number; kiss: number; tongue: number; string: number; kimono: number;
  drops: number; press: number;
};
export const BUST0: BustSt = { pitch: 0, fold: 0, towel: 0, steam: 0, sh: 0, zone: 0, face: 0, arrows: 0, sun: 0, shade: 0, phone: 0, phoneH: 0, kiss: 0, tongue: 0, string: 0, kimono: 0, drops: 0, press: 0 };
const PORC = "#e6d3c0";
const NR = 0.112, NH = 0.17; // radio y alto de cada tramo del cuello
// torso de maniquí: perfil torneado (pecho alto → hombro caído → base del cuello)
const TORSO = new THREE.LatheGeometry([[0, -0.2], [0.24, -0.2], [0.3, -0.13], [0.315, -0.06], [0.29, -0.01], [0.22, 0.03], [0.15, 0.055], [0.118, 0.075], [0.112, 0.09], [0, 0.09]].map(([x, y]) => new THREE.Vector2(x, y)), 64);

// flechita que viaja por una curva (el aceite): k = 0..1 a lo largo, se desvanece en las puntas
const Arrow: React.FC<{ a: V3; b: V3; k: number; col: string; o: number }> = ({ a, b, k, col, o }) => {
  const p = v3(a).lerp(v3(b), k), d = v3(b).sub(v3(a)).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  const f = Math.sin(Math.PI * k) * o;
  if (f < 0.02) return null;
  return (
    <group position={p} quaternion={q}>
      <mesh><coneGeometry args={[0.026, 0.06, 16]} /><meshBasicMaterial color={col} transparent opacity={f} toneMapped={false} /></mesh>
      <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.007, 0.007, 0.09, 8]} /><meshBasicMaterial color={col} transparent opacity={f * 0.7} toneMapped={false} /></mesh>
    </group>
  );
};

export const Bust: React.FC<{ p: V3; rot?: V3; st: BustSt; t: number; pedestal?: boolean; hair?: string }> = ({ p, rot, st, t, pedestal = true, hair = "#141210" }) => {
  const bend = st.pitch; // + mira arriba, − mira abajo
  const shY = 0.055 * st.sh;
  const sunT = st.sun * (1 - st.shade);
  const skinE = sunT > 0.01 ? "#ff6a1a" : "#000", skinEI = 0.22 * sunT;
  const zoneO = st.zone, faceO = st.face;
  const stLen = st.string;
  // los dos tramos del cuello se reparten la flexión (la cabeza un poco más)
  const b1 = -bend * 0.42, b2 = -bend * 0.38, b3 = -bend * 0.2;
  const towelA = st.towel;
  const lips = 1 + 0.9 * st.kiss;
  return (
    <group position={p} rotation={rot}>
      {pedestal && <>
        <Cyl p={[0, -0.5, 0]} r={0.045} h={1.0} c="#2b2622" m={0.6} rough={0.35} />
        <Cyl p={[0, -0.99, 0]} r={0.22} r2={0.24} h={0.03} c="#2b2622" m={0.6} rough={0.35} />
      </>}
      {/* hombros y pecho alto (suben con los hombros tensos) */}
      <group position={[0, shY, 0]}>
        <mesh scale={[1, 1, 0.56]} castShadow receiveShadow geometry={TORSO}><meshStandardMaterial color={PORC} roughness={0.55} emissive={skinE} emissiveIntensity={skinEI * 0.6} /></mesh>
        {/* las clavículas, apenas marcadas */}
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.09, 0.0, 0.13]} rotation={[0, 0, sd * 0.25]} scale={[1, 0.35, 0.35]}><capsuleGeometry args={[0.012, 0.13, 6, 12]} /><meshStandardMaterial color="#e6d6c5" roughness={0.45} /></mesh>)}
        {/* zona "la cara termina en la clavícula": velo cálido sobre pecho alto */}
        {zoneO > 0.01 && <mesh position={[0, -0.02, 0.02]} scale={[1.02, 0.44, 0.53]}><sphereGeometry args={[0.33, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.32]} /><meshBasicMaterial color="#ffc98a" transparent opacity={0.28 * zoneO * (0.85 + 0.15 * Math.sin(t * 3))} depthWrite={false} toneMapped={false} /></mesh>}
        {/* cuello del kimono, bajado atrás para mostrar la nuca */}
        {st.kimono > 0.01 && <group rotation={[0.45, 0, 0]} position={[0, 0.0, -0.02]} scale={[1, 1, 0.9]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.03, 12, 48]} /><meshStandardMaterial color="#26375e" roughness={0.7} transparent opacity={st.kimono} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}><torusGeometry args={[0.19, 0.035, 12, 48]} /><meshStandardMaterial color="#f2ece0" roughness={0.7} transparent opacity={st.kimono} /></mesh>
        </group>}
        {/* EL CUELLO: tramo 1 */}
        <group rotation={[b1, 0, 0]}>
          <mesh position={[0, NH / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[NR * 0.97, NR * 1.08, NH, 48]} /><meshStandardMaterial color={PORC} roughness={0.55} emissive={skinE} emissiveIntensity={skinEI} /></mesh>
          {/* la toalla tibia: vuelta atrás + las dos puntas que caen adelante */}
          {towelA > 0.01 && <group position={[0, NH * 0.45, 0]} scale={[1, 1, 1]}>
            <mesh rotation={[Math.PI / 2, 0, -Math.PI / 2]}><torusGeometry args={[NR + 0.045, 0.045, 14, 48, Math.PI * 2 * 0.62 * Math.min(1, towelA * 1.15)]} /><meshStandardMaterial color="#f7f4ee" roughness={0.98} /></mesh>
            {towelA > 0.75 && [-1, 1].map((sd) => <Box key={sd} p={[sd * 0.085, -0.13, 0.12]} s={[0.075, 0.26 * e01(towelA, 0.75, 1), 0.035]} c="#f7f4ee" r={0.98} rad={0.015} rot={[0.2, 0, -sd * 0.12]} />)}
          </group>}
          {/* las líneas que se marcan al doblar (adelante y a los lados) */}
          {st.fold > 0.01 && [0.62, 0.86].map((h, i) => <mesh key={i} position={[0, NH * h, 0]} rotation={[Math.PI / 2 + 0.08, 0, 0]}><torusGeometry args={[NR * 1.0, 0.0045 + 0.003 * st.fold, 6, 48, Math.PI * 1.1]} /><meshStandardMaterial color="#8c6f5a" roughness={0.7} transparent opacity={0.9 * st.fold} /></mesh>)}
          {/* tramo 2 (con su junta esférica: no se abre al doblar) */}
          <mesh position={[0, NH, 0]}><sphereGeometry args={[NR * 0.965, 32, 24]} /><meshStandardMaterial color={PORC} roughness={0.55} emissive={skinE} emissiveIntensity={skinEI * 0.9} /></mesh>
          <group position={[0, NH, 0]} rotation={[b2, 0, 0]}>
            <mesh position={[0, NH / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[NR * 0.95, NR * 0.97, NH, 48]} /><meshStandardMaterial color={PORC} roughness={0.55} emissive={skinE} emissiveIntensity={skinEI * 0.8} /></mesh>
            {st.fold > 0.01 && <mesh position={[0, NH * 0.45, 0]} rotation={[Math.PI / 2 + 0.1, 0, 0]}><torusGeometry args={[NR * 0.97, 0.005 + 0.004 * st.fold, 6, 48, Math.PI * 1.1]} /><meshStandardMaterial color="#8c6f5a" roughness={0.7} transparent opacity={0.95 * st.fold} /></mesh>}
            {zoneO > 0.01 && <mesh position={[0, -NH * 0.5, 0]}><cylinderGeometry args={[NR * 1.07, NR * 1.12, NH * 2.05, 48, 1, true]} /><meshBasicMaterial color="#ffc98a" transparent opacity={0.3 * zoneO * (0.85 + 0.15 * Math.sin(t * 3))} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>}
            {/* la cabeza */}
            <mesh position={[0, NH, 0]}><sphereGeometry args={[NR * 0.94, 32, 24]} /><meshStandardMaterial color={PORC} roughness={0.55} /></mesh>
            <group position={[0, NH, 0]} rotation={[b3, 0, 0]}>
              <mesh position={[0, 0.16, 0.0]} scale={[0.86, 1.08, 0.98]} castShadow receiveShadow><sphereGeometry args={[0.165, 64, 48]} /><meshStandardMaterial color={PORC} roughness={0.55} /></mesh>
              {/* mandíbula y mentón */}
              <mesh position={[0, 0.055, 0.118]} scale={[1.1, 0.7, 0.6]}><sphereGeometry args={[0.034, 24, 16]} /><meshStandardMaterial color={PORC} roughness={0.55} /></mesh>
              {/* nariz y labios (se estiran para "besar el techo") */}
              <mesh position={[0, 0.16, 0.165]} rotation={[0.25, 0, 0]} scale={[0.6, 1, 0.8]}><coneGeometry args={[0.03, 0.07, 16]} /><meshStandardMaterial color={PORC} roughness={0.55} /></mesh>
              <mesh position={[0, 0.095, 0.138 + 0.02 * st.kiss]} scale={[1 / Math.sqrt(lips), 0.5, lips * 0.8]}><sphereGeometry args={[0.028, 24, 16]} /><meshStandardMaterial color="#d9a596" roughness={0.45} /></mesh>
              {/* ojos cerrados: dos rayitas */}
              {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.055, 0.2, 0.142]} rotation={[0, sd * 0.35, 0]}><boxGeometry args={[0.04, 0.005, 0.005]} /><meshStandardMaterial color="#6b5446" /></mesh>)}
              {/* la melena carré negra (por detrás de la cara, hasta el mentón) */}
              <mesh position={[0, 0.17, -0.012]} scale={[0.93, 1.12, 1.04]} castShadow><sphereGeometry args={[0.172, 48, 32, Math.PI * 0.78, Math.PI * 1.44, 0, Math.PI * 0.7]} /><meshStandardMaterial color={hair} roughness={0.55} side={THREE.DoubleSide} /></mesh>
              {/* aros de perla */}
              {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.142, 0.1, 0.02]}><sphereGeometry args={[0.011, 12, 12]} /><meshStandardMaterial color="#fffaf0" roughness={0.2} metalness={0.2} /></mesh>)}
              {/* el hilo dorado que tira de la coronilla */}
              {stLen > 0.01 && <mesh position={[0, 0.34 + 0.9 * stLen, -0.02]}><cylinderGeometry args={[0.004, 0.004, 1.8 * stLen, 8]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} transparent opacity={0.95} /></mesh>}
              {/* la lengua contra el paladar: pulso suave bajo el mentón */}
              {st.tongue > 0.01 && <mesh position={[0, 0.0, 0.07]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.06, 24, 16]} /><meshBasicMaterial color="#7dffb4" transparent opacity={0.35 * st.tongue * (0.6 + 0.4 * Math.sin(t * 5))} depthWrite={false} toneMapped={false} /></mesh>}
            </group>
          </group>
        </group>
        {/* flechas del aceite: adelante SUBEN (clavícula → mandíbula), a los costados BAJAN (detrás de la oreja → clavícula) */}
        {st.arrows > 0.01 && <>
          {[0, 0.33, 0.66].map((ph, i) => <Arrow key={"f" + i} a={[0, 0.01, NR + 0.035]} b={[0, 2 * NH - 0.02, NR + 0.015]} k={(t * 0.55 + ph) % 1} col="#ffcf6a" o={st.arrows} />)}
          {[-1, 1].map((sd) => [0, 0.5].map((ph, i) => <Arrow key={"s" + sd + i} a={[sd * (NR + 0.03), 2 * NH, -0.02]} b={[sd * (NR + 0.06), 0.0, 0.02]} k={(t * 0.5 + ph) % 1} col="#ffcf6a" o={st.arrows} />))}
        </>}
        {/* dos gotas de aceite que caen */}
        {st.drops > 0.01 && [0, 1].map((i) => { const k = ((t * 0.7 + i * 0.5) % 1); return <mesh key={i} position={[0.0 + i * 0.03, 0.75 - 0.5 * k, 0.32]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 12, 12]} /><meshStandardMaterial color="#e8b84a" roughness={0.05} metalness={0.1} transparent opacity={st.drops * (1 - k * 0.3)} /></mesh>; })}
        {/* vapor de la toalla */}
        {st.steam > 0.01 && Array.from({ length: 7 }, (_, i) => { const k = (t * 0.35 + i / 7) % 1; return <mesh key={i} position={[Math.sin(i * 2.1 + t) * 0.08, 0.15 + k * 0.45, 0.1 + Math.cos(i * 1.3) * 0.08]}><sphereGeometry args={[(0.1 + 0.16 * k) * 0.35, 16, 12]} /><meshBasicMaterial color="#ffffff" transparent opacity={(0.3 * st.steam * Math.sin(Math.PI * k)) * 0.45} depthWrite={false} toneMapped={false} /></mesh>; })}
        {/* la toalla que PRESIONA (no frota): un paño que se apoya y se levanta */}
        {st.press > 0.01 && <Box p={[0.0, 0.17, NR + 0.06 + 0.05 * (0.5 + 0.5 * Math.sin(t * 3.2))]} s={[0.22, 0.16, 0.02]} c="#f2efe8" r={0.98} rad={0.01} op={st.press} />}
      </group>
      {/* el celular: a la panza o a la altura de los ojos */}
      {st.phone > 0.01 && <group position={[0, lerp(-0.25, 0.62, st.phoneH), lerp(0.42, 0.5, st.phoneH)]} rotation={[lerp(-1.1, -0.05, st.phoneH), 0, 0]} scale={st.phone}>
        <Box p={[0, 0, 0]} s={[0.075, 0.15, 0.009]} c="#1d1f22" r={0.3} m={0.5} rad={0.008} />
        <mesh position={[0, 0, -0.005]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.066, 0.138]} /><meshBasicMaterial color="#9fc7ff" toneMapped={false} /></mesh>
      </group>}
      {/* la sombrilla higasa: sombra encima */}
      {st.shade > 0.01 && <group position={[0.25, 0.95, 0.15]} rotation={[0, 0, -0.25]} scale={st.shade}>
        <mesh><coneGeometry args={[0.55, 0.22, 24, 1, true]} /><meshStandardMaterial color="#f3ead8" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        <Cyl p={[0, -0.45, 0]} r={0.008} h={0.9} c="#6b4a2a" />
      </group>}
    </group>
  );
};
const e01 = (x: number, a: number, b: number) => cl((x - a) / (b - a));

// ---------------- habitaciones ----------------
const Room: React.FC<{ x0: number; x1: number; floor: string; map?: Tx; wall: string; wmap?: Tx; side?: boolean }> = ({ x0, x1, floor, map, wall, wmap, side = true }) => {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  return (
    <group>
      <mesh position={[cx, 0, -1.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.3]} /><meshStandardMaterial color={floor} map={map} roughness={0.8} /></mesh>
      <Box p={[cx, 1.35, -2.3]} s={[w, 2.7, 0.1]} c={wall} map={wmap} r={0.9} rad={0.01} />
      {side && <Box p={[x1, 1.35, -1.25]} s={[0.1, 2.7, 2.2]} c="#d8cfbf" r={0.9} rad={0.01} />}
    </group>
  );
};

export type WorldState = {
  day: number; sun: number; warm: number; memory: number; kettle: number; pillow: number; roll: number; lying: BustSt;
  bust: BustSt; salon: BustSt; glow: Partial<Record<keyof typeof PT, number>>;
};

const Glow: React.FC<{ p: V3; on: number; t: number; col?: string }> = ({ p, on, t, col = "#ffcf6a" }) => {
  if (on < 0.01) return null;
  const pul = 0.75 + 0.25 * Math.sin(t * 5);
  return (
    <group position={p}>
      <mesh><ringGeometry args={[0.1, 0.115, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * on} toneMapped={false} side={THREE.DoubleSide} /></mesh>
      <mesh><circleGeometry args={[0.1, 48]} /><meshBasicMaterial color={col} transparent opacity={0.12 * on * pul} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    </group>
  );
};

export const World: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"]; st: WorldState }> = ({ t, camAt, st }) => {
  const tx = useTextures(), tex = useCasaTex();
  const sepia = st.memory;
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0, 2, 6] }}>
      <Cam t={t} camAt={camAt} />
      <color attach="background" args={["#e6dccd"]} />
      <fog attach="fog" args={["#e6dccd", 14, 34]} />
      <ambientLight intensity={0.22} color="#fff4e6" />
      <hemisphereLight args={["#fff6e8", "#8d7a62", 0.3]} />
      {/* luz de la mañana: por la ventana esmerilada, desde la izquierda alta */}
      <directionalLight position={[-5, 8, 7]} intensity={1.15 + 0.3 * st.sun} color="#fff0d8" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
      {/* el sol del balcón (al hablar del sol, entra fuerte y anaranjado al baño) */}
      <directionalLight position={[10, 5, 4]} intensity={1.3 * st.sun} color="#ffb070" />
      <pointLight position={[-3.9, 2.2, -1.2]} intensity={0.8} distance={4} color="#fff3e0" />
      <pointLight position={[-7.5, 2.3, -0.8]} intensity={2.2 * (0.6 + 0.4 * sepia)} distance={5} color="#ffcf8f" castShadow />
      <pointLight position={[0.8, 2.2, -1.0]} intensity={1.3} distance={4} color="#ffe3b8" />
      <pointLight position={[4.8, 2.2, -1.0]} intensity={1.1} distance={4.5} color="#ffe0b0" />
      {/* piso exterior / zócalo de la maqueta */}
      <Box p={[0, -0.32, -0.6]} s={[22, 0.6, 4.6]} c="#7a5e45" r={0.85} rad={0.02} cast={false} />
      <mesh position={[0, -0.62, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 40]} /><meshStandardMaterial color="#c9b49a" roughness={0.9} /></mesh>

      {/* ===== EL SALÓN (antes) ===== */}
      <Room x0={-10} x1={-5} floor="#d9d3c8" map={tx.tile} wall="#e8dcc6" wmap={tex.plaster} />
      <Box p={[-10, 1.35, -1.25]} s={[0.1, 2.7, 2.2]} c="#d8cfbf" r={0.9} rad={0.01} />
      {/* espejo redondo del salón + repisa */}
      <mesh position={[-7.5, 1.6, -2.24]}><circleGeometry args={[0.42, 64]} /><meshStandardMaterial color="#c9d2d8" metalness={0.9} roughness={0.08} /></mesh>
      <mesh position={[-7.5, 1.6, -2.245]}><ringGeometry args={[0.42, 0.47, 64]} /><meshStandardMaterial color="#b88a4a" metalness={0.5} roughness={0.55} /></mesh>
      <Box p={[-7.5, 1.05, -2.1]} s={[1.2, 0.06, 0.3]} c="#7a5a3a" r={0.6} />
      {/* el sillón reclinable con su cliente (maniquí 3) */}
      <Box p={[-7.5, 0.25, -1.0]} s={[0.25, 0.5, 0.25]} c="#2b2622" m={0.6} r={0.35} />
      <Box p={[-7.5, 0.55, -1.0]} s={[0.7, 0.14, 0.7]} c="#7d2f2a" r={0.55} rad={0.06} />
      <Box p={[-7.5, 0.95, -1.36]} s={[0.66, 0.78, 0.14]} c="#7d2f2a" r={0.55} rad={0.06} rot={[-0.18, 0, 0]} />
      {[-1, 1].map((sd) => <Box key={sd} p={[-7.5 + sd * 0.38, 0.72, -1.0]} s={[0.08, 0.06, 0.6]} c="#2b2622" r={0.4} />)}
      <Bust p={[-7.5, 1.02, -1.08]} rot={[-0.12, 0, 0]} st={st.salon} t={t} pedestal={false} hair="#3a2a20" />
      {/* el calentador de toallas: caja con vidrio tibio y toallas enrolladas */}
      <Box p={[-9.2, 0.75, -1.9]} s={[0.55, 0.5, 0.42]} c="#e9e4da" r={0.4} rad={0.04} />
      <mesh position={[-9.2, 0.75, -1.685]}><planeGeometry args={[0.42, 0.34]} /><meshStandardMaterial color="#ffd9a0" emissive="#ffb35a" emissiveIntensity={0.6 + 0.6 * st.warm} transparent opacity={0.85} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[-9.33 + i * 0.13, 0.7, -1.8]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.3, 20]} /><meshStandardMaterial color="#fbf8f2" roughness={0.98} /></mesh>)}
      <Box p={[-9.2, 0.25, -1.9]} s={[0.6, 0.5, 0.45]} c="#8a6a4a" r={0.7} />
      {st.warm > 0.01 && Array.from({ length: 5 }, (_, i) => { const k = (t * 0.3 + i / 5) % 1; return <mesh key={i} position={[-9.2 + Math.sin(i * 2 + t) * 0.12, 1.05 + k * 0.6, -1.85]}><sphereGeometry args={[(0.14 + 0.2 * k) * 0.35, 16, 12]} /><meshBasicMaterial color="#ffffff" transparent opacity={(0.28 * st.warm * Math.sin(Math.PI * k)) * 0.45} depthWrite={false} toneMapped={false} /></mesh>; })}
      {/* la radio vieja */}
      <Box p={[-5.8, 1.45, -2.1]} s={[0.36, 0.22, 0.14]} c="#8a5a33" r={0.5} rad={0.03} />
      <mesh position={[-5.88, 1.45, -2.025]}><circleGeometry args={[0.06, 32]} /><meshStandardMaterial color="#3a2a1c" roughness={0.9} /></mesh>
      <Box p={[-5.8, 1.32, -2.12]} s={[0.6, 0.04, 0.24]} c="#7a5a3a" r={0.6} />
      {/* otras dos sillas al fondo (seis en total, se ven tres) */}
      {[-9.2, -5.9].map((x, i) => <group key={i}><Box p={[x, 0.55, -1.1]} s={[0.6, 0.12, 0.6]} c="#7d2f2a" r={0.55} rad={0.06} /><Box p={[x, 0.92, -1.42]} s={[0.56, 0.7, 0.12]} c="#7d2f2a" r={0.55} rad={0.06} rot={[-0.18, 0, 0]} /><Box p={[x, 0.25, -1.1]} s={[0.2, 0.5, 0.2]} c="#2b2622" m={0.6} r={0.35} /></group>)}

      {/* ===== EL BAÑO ===== */}
      <Room x0={-5} x1={-1} floor="#bfc4c3" map={tex.wtile} wall="#d9d5cc" wmap={tex.wtile} />
      {/* ventana esmerilada con la luz de la mañana */}
      <mesh position={[-4.5, 1.9, -2.24]}><planeGeometry args={[0.55, 0.8]} /><meshStandardMaterial map={tex.frost} emissive="#fff3dc" emissiveIntensity={0.45} /></mesh>
      {/* mueble de la pileta + pileta + canilla */}
      <Box p={[-3.9, 0.42, -1.95]} s={[1.1, 0.84, 0.55]} c="#efe9df" r={0.5} rad={0.03} />
      <Box p={[-3.9, 0.88, -1.95]} s={[1.14, 0.08, 0.6]} c="#fbfaf7" r={0.25} rad={0.03} />
      <mesh position={[-3.9, 0.9, -1.92]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2, 48]} /><meshStandardMaterial color="#d8dcdc" roughness={0.15} metalness={0.3} /></mesh>
      <Cyl p={[-3.9, 1.0, -2.15]} r={0.018} h={0.2} c="#c9ccce" m={0.9} rough={0.2} />
      <Box p={[-3.9, 1.1, -2.08]} s={[0.03, 0.03, 0.15]} c="#c9ccce" m={0.9} r={0.2} />
      {/* el chorrito de agua tibia (cuando hablamos del agua) */}
      {st.glow.sink ? <mesh position={[-3.9, 0.99, -2.0]}><cylinderGeometry args={[0.008, 0.01, 0.17, 12]} /><meshStandardMaterial color="#cfe6ff" transparent opacity={0.7 * st.glow.sink} roughness={0.05} /></mesh> : null}
      {/* espejo redondo del baño */}
      <mesh position={[-3.9, 1.65, -2.24]}><circleGeometry args={[0.36, 64]} /><meshStandardMaterial color="#c9d2d8" metalness={0.9} roughness={0.06} /></mesh>
      <mesh position={[-3.9, 1.65, -2.245]}><ringGeometry args={[0.36, 0.39, 64]} /><meshStandardMaterial color="#c9a06c" roughness={0.5} /></mesh>
      {/* estante de cedro: toallas dobladas, frascos lisos, la camelia (ámbar) y el protector (tubo blanco) */}
      <Box p={[-1.9, 1.45, -2.1]} s={[1.3, 0.04, 0.3]} c="#c9a06c" map={tex.cedar} r={0.7} />
      <Box p={[-1.9, 1.05, -2.1]} s={[1.3, 0.04, 0.3]} c="#c9a06c" map={tex.cedar} r={0.7} />
      {[0, 1, 2].map((i) => <Box key={i} p={[-2.35, 1.11 + i * 0.06, -2.08]} s={[0.36, 0.055, 0.24]} c={i === 1 ? "#e9eef0" : "#fbf8f2"} r={0.98} rad={0.02} />)}
      {[-2.5, -2.3].map((x, i) => <Cyl key={i} p={[x, 1.55, -2.08]} r={0.04} h={0.16} c="#f4f2ee" rough={0.3} />)}
      <Cyl p={[PT.oil[0], 1.53, -2.06]} r={0.032} h={0.13} c="#c98a2a" rough={0.1} op={0.85} />
      <Cyl p={[PT.oil[0], 1.62, -2.06]} r={0.012} h={0.04} c="#2b2622" />
      <Box p={[PT.sunscreen[0], 1.54, -2.06]} s={[0.06, 0.15, 0.04]} c="#fafaf6" r={0.4} rad={0.018} />
      <Cyl p={[-1.15, 1.52, -2.06]} r={0.045} h={0.09} c="#e6dccb" rough={0.4} />
      {/* banquito de madera y balde (furo) */}
      <Box p={[-1.6, 0.13, -1.0]} s={[0.36, 0.26, 0.26]} c="#c9a06c" map={tex.cedar} r={0.7} />
      <Cyl p={[-1.6, 0.36, -1.0]} r={0.12} r2={0.1} h={0.18} c="#c9a06c" rough={0.7} />
      {/* EL MANIQUÍ del baño */}
      <Bust p={[BX, BY, BZ]} st={st.bust} t={t} />

      {/* ===== LA COCINA chiquita ===== */}
      <Room x0={-1} x1={3} floor="#b89a74" map={tx.planks} wall="#efe6d4" wmap={tex.plaster} />
      <Box p={[0.4, 0.45, -1.95]} s={[1.5, 0.9, 0.6]} c="#d8d2c6" r={0.6} rad={0.03} />
      <Box p={[0.4, 0.92, -1.95]} s={[1.54, 0.05, 0.64]} c="#a8a49c" m={0.6} r={0.3} />
      <Cyl p={[0.2, 0.95, -1.95]} r={0.12} h={0.02} c="#2b2b2b" m={0.6} rough={0.3} />
      {/* la pava */}
      <group position={[0.2, 0.96, -1.95]}>
        <mesh position={[0, 0.1, 0]} castShadow><sphereGeometry args={[0.11, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial color="#c9ccce" metalness={0.85} roughness={0.25} /></mesh>
        <Cyl p={[0, 0.02, 0]} r={0.11} r2={0.1} h={0.06} c="#c9ccce" m={0.85} rough={0.25} />
        <mesh position={[0.12, 0.1, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.012, 0.022, 0.12, 12]} /><meshStandardMaterial color="#c9ccce" metalness={0.85} roughness={0.25} /></mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.07, 0.009, 8, 32, Math.PI]} /><meshStandardMaterial color="#2b2622" /></mesh>
        {st.kettle > 0.01 && Array.from({ length: 6 }, (_, i) => { const k = (t * 0.5 + i / 6) % 1; return <mesh key={i} position={[0.2 + k * 0.12, 0.17 + k * 0.4, Math.sin(i * 2.3) * 0.04]}><sphereGeometry args={[(0.07 + 0.16 * k) * 0.35, 16, 12]} /><meshBasicMaterial color="#ffffff" transparent opacity={(0.35 * st.kettle * Math.sin(Math.PI * k)) * 0.45} depthWrite={false} toneMapped={false} /></mesh>; })}
      </group>
      <pointLight position={[0.2, 1.0, -1.7]} intensity={0.6 * st.kettle} distance={1} color="#ff7a3a" />
      {/* mesa baja con el celular, la pantalla sobre DOS diccionarios */}
      <Box p={[1.5, 0.3, -1.1]} s={[1.0, 0.05, 0.7]} c="#6b4a2a" map={tx.planks} r={0.6} />
      {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z], i) => <Box key={i} p={[1.5 + x, 0.14, -1.1 + z]} s={[0.05, 0.28, 0.05]} c="#5a3d22" r={0.6} />)}
      <Box p={[1.8, 0.36, -1.25]} s={[0.34, 0.07, 0.24]} c="#7b2f2a" r={0.8} rad={0.01} />
      <Box p={[1.8, 0.43, -1.25]} s={[0.32, 0.07, 0.23]} c="#2f3f5a" r={0.8} rad={0.01} />
      <Box p={[1.8, 0.6, -1.3]} s={[0.4, 0.26, 0.02]} c="#1d1f22" r={0.3} />
      <mesh position={[1.8, 0.6, -1.288]}><planeGeometry args={[0.37, 0.23]} /><meshBasicMaterial color="#b9d4f0" toneMapped={false} /></mesh>
      <Box p={[1.3, 0.34, -0.95]} s={[0.07, 0.01, 0.14]} c="#1d1f22" r={0.3} m={0.5} rad={0.005} />
      {/* zabuton */}
      <Box p={[1.5, 0.04, -0.55]} s={[0.5, 0.06, 0.5]} c="#7d4a5a" r={0.95} rad={0.03} />

      {/* ===== EL DORMITORIO de tatami ===== */}
      <Room x0={3} x1={7} floor="#b9b07a" map={tex.tatami} wall="#f3eadb" wmap={tex.plaster} />
      <mesh position={[6.2, 1.5, -2.24]}><planeGeometry args={[1.0, 1.2]} /><meshStandardMaterial map={tex.shoji} emissive="#fff3dc" emissiveIntensity={0.55} /></mesh>
      {/* futón */}
      <Box p={[4.8, 0.07, -1.0]} s={[1.0, 0.12, 2.0]} c="#f6f3ec" r={0.98} rad={0.05} />
      <Box p={[4.8, 0.16, -0.65]} s={[1.02, 0.08, 1.2]} c="#8fa6c4" r={0.98} rad={0.05} />
      {/* la almohada: alta (dos, blanda) o baja de sobakawa */}
      <Box p={[4.8, 0.16 + 0.12 * st.pillow, -1.78]} s={[0.55, 0.1 + 0.24 * st.pillow, 0.32]} c={st.pillow > 0.5 ? "#fbfaf6" : "#c9b48a"} r={0.98} rad={0.05} />
      {st.roll > 0.01 && <mesh position={[4.8, 0.2, -1.58]} rotation={[0, 0, Math.PI / 2]} scale={st.roll}><cylinderGeometry args={[0.045, 0.045, 0.36, 20]} /><meshStandardMaterial color="#f7f4ee" roughness={0.98} /></mesh>}
      {/* maniquí acostado: la cabeza sobre la almohada (alta = mentón al pecho) */}
      <Bust p={[4.8, 0.2 + 0.05 * st.pillow, -1.25]} rot={[-Math.PI / 2, 0, 0]} st={st.lying} t={t} pedestal={false} />
      <Box p={[3.6, 0.6, -2.05]} s={[0.5, 1.2, 0.4]} c="#a07a52" map={tex.cedar} r={0.7} />

      {/* ===== EL BALCÓN ===== */}
      <mesh position={[8.6, 0.0, -1.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.2, 2.3]} /><meshStandardMaterial color="#a9a59e" map={tx.concrete} roughness={0.9} /></mesh>
      <Box p={[8.6, 0.5, 0.0]} s={[3.2, 1.0, 0.06]} c="#c9c7c2" r={0.5} m={0.3} op={0.55} />
      <Box p={[10.2, 0.5, -1.1]} s={[0.06, 1.0, 2.3]} c="#c9c7c2" r={0.5} m={0.3} op={0.55} />
      <Box p={[8.6, 2.1, -1.6]} s={[2.8, 0.03, 0.03]} c="#b9bcc0" m={0.8} r={0.3} />
      {[7.7, 8.3, 9.0].map((x, i) => <mesh key={i} position={[x, 1.75, -1.6]}><planeGeometry args={[0.4, 0.62]} /><meshStandardMaterial map={tex.laundry} side={THREE.DoubleSide} roughness={0.95} /></mesh>)}
      {/* la higasa apoyada, abierta */}
      <group position={[8.5, 1.15, -0.7]} rotation={[0.25, 0, -0.35]}>
        <mesh><coneGeometry args={[0.6, 0.25, 24, 1, true]} /><meshStandardMaterial color="#f3ead8" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        <Cyl p={[0, -0.5, 0]} r={0.01} h={1.0} c="#6b4a2a" />
      </group>
      {/* el sol */}
      <mesh position={[12, 6, -6]}><sphereGeometry args={[0.7, 32, 32]} /><meshBasicMaterial color="#fff1c8" toneMapped={false} /></mesh>

      {/* halos de lo que se nombra */}
      {Object.entries(st.glow).filter(([k]) => k !== "sink").map(([k, v]) => <Glow key={k} p={PT[k as keyof typeof PT]} on={v ?? 0} t={t} />)}
      <Post bloom={0.3} threshold={0.95} exposure={0.85} env={0.22} />
    </ThreeCanvas>
  );
};
