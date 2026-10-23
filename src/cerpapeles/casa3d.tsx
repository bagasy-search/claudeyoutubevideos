// cerpapeles · EL MUNDO: una casa de una planta en corte de casa de muñecas (frente abierto, paredes cortadas a media altura),
// de noche, sobre un bloque de jardín. De izquierda a derecha: GARAJE (el auto con la guantera), COCINA (la heladera con el
// congelador arriba), SALA/ENTRADA (la mesita con la pila de cartas), ESTUDIO (el escritorio con su primer cajón y el
// archivador con llavecita), DORMITORIO (el ropero abierto con la caja contra el fuego suelta en el piso) y el PLACARD del
// pasillo (la carpeta gorda de MANUALES y la caja atornillada detrás del baúl = donde los guarda el cerrajero).
// UNA escena y UNA cámara (keyframes clavados a la voz con at()). El ladrón no se ve: es el haz de su linterna y su
// recorrido punteado; cada escondite que él "piensa" se enciende en rojo. Vista térmica = filtro SVG de falso color
// (Min1.tsx), así el mismo render sirve de noche y "visto por el ladrón". Render SÓLO en el farm.
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
type V3 = [number, number, number];

// ---------------- puntos del mundo ----------------
export const PT = {
  glove: [-7.05, 0.78, -0.35] as V3,      // la guantera del auto
  visor: [-7.3, 1.18, -0.55] as V3,       // el control del portón en el parasol
  freezer: [-4.3, 1.6, -1.55] as V3,     // la puerta del congelador
  mail: [-0.2, 0.78, -1.7] as V3,         // la pila de cartas en la mesita de la entrada
  door: [-1.95, 1.0, -0.6] as V3,         // puerta de entrada (pared izquierda de la sala)
  desk: [2.97, 0.62, -1.5] as V3,         // el primer cajón del escritorio
  folder: [2.97, 0.7, -1.48] as V3,       // la carpeta azul "IMPORTANTE"
  pad: [2.2, 0.79, -1.72] as V3,          // la libretita de claves
  cabinet: [3.95, 1.13, -1.6] as V3,     // archivador con llavecita
  box: [6.35, 0.18, -1.9] as V3,          // caja contra el fuego suelta en el ropero
  bed: [6.7, 0.55, -0.4] as V3,
  manuals: [9.28, 1.7, -1.8] as V3,       // la carpeta gorda de MANUALES en el placard
  safe: [9.2, 0.2, -2.05] as V3,         // la caja atornillada detrás del baúl
  trunk: [9.2, 0.25, -1.45] as V3,
  center: [0.6, 0.8, -0.8] as V3,
};
export const SPOTS: (keyof typeof PT)[] = ["desk", "cabinet", "box", "freezer", "glove"];

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
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p)); // arco de vuelo en traslados largos
    // respiración de cámara en mano (muy chica): nunca queda congelada
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
const label = (txt: string, bg: string, fg: string, w = 512, h = 160, size = 78) => mk(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${0.05 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * w, rnd(i, 4) * h, 3, 3); }
  g.fillStyle = fg; g.font = `900 ${size}px Montserrat, Arial Black, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 4);
});
const useCasaTex = () => useMemo(() => ({
  plaster: mk(256, 256, (g) => { g.fillStyle = "#cfc6b6"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 180 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [3, 1]),
  grass: mk(256, 256, (g) => { g.fillStyle = "#24331f"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${40 + rnd(i, 1) * 40},${70 + rnd(i, 2) * 50},${30 + rnd(i, 3) * 20},.6)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 1.5, 4); } }, [10, 4]),
  soil: mk(256, 256, (g) => { const cs = ["#3a2a1c", "#4a3524", "#5a4632", "#6b6256"]; for (let r = 0; r < 4; r++) { g.fillStyle = cs[r]; g.fillRect(0, r * 64, 256, 64); } for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(20,14,8,${0.3 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 0, 6.3); g.fill(); } }, [6, 1]),
  folderBlue: label("IMPORTANTE", "#2c5fb3", "#f2f2f2", 512, 160, 70),
  manuals: label("MANUALES", "#6f6a5e", "#f1ead7", 512, 200, 84),
  mailTop: mk(256, 160, (g) => { g.fillStyle = "#f1ece0"; g.fillRect(0, 0, 256, 160); g.fillStyle = "#b9b2a2"; for (let k = 0; k < 6; k++) g.fillRect(24, 30 + k * 18, 140 - k * 8, 6); g.fillStyle = "#2c5fb3"; g.fillRect(186, 20, 46, 32); }),
  pad: mk(128, 160, (g) => { g.fillStyle = "#d8b24a"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#f6f0de"; g.fillRect(10, 10, 108, 140); g.fillStyle = "#555"; for (let k = 0; k < 7; k++) g.fillRect(18, 24 + k * 17, 60 + rnd(k, 3) * 30, 4); }),
}), []);

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);

// halo rojo pulsante = "el ladrón lo piensa" (anillo en el piso + columna de luz)
const Heat: React.FC<{ p: V3; on: number; t: number; col?: string; r?: number }> = ({ p, on, t, col = "#ff3a2a", r = 0.42 }) => {
  if (on < 0.01) return null;
  const pul = 0.75 + 0.25 * Math.sin(t * 6);
  return (
    <group position={[p[0], 0.012, p[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.82, r, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * on} toneMapped={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r * 0.82, 48]} /><meshBasicMaterial color={col} transparent opacity={0.18 * on * pul} toneMapped={false} /></mesh>
      <mesh position={[0, (p[1] + 0.5) / 2, 0]}><cylinderGeometry args={[r * 0.3, r * 0.6, p[1] + 0.5, 32, 1, true]} /><meshBasicMaterial color={col} transparent opacity={0.07 * on * pul} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, p[1] + 0.2, 0.25]} color={col} intensity={1.7 * on * pul} distance={1.3} />
    </group>
  );
};

// recorrido del ladrón: puntos rojos en el piso que se van dibujando
const PATH: V3[] = [[-1.6, 0.02, -0.6], [0.2, 0.02, -0.7], [2.5, 0.02, -0.9], [3.9, 0.02, -1.0], [6.2, 0.02, -1.0], [6.0, 0.02, -0.2], [2.0, 0.02, -0.2], [-4.2, 0.02, -0.9], [-6.6, 0.02, 0.4]];
const Trail: React.FC<{ k: number }> = ({ k }) => {
  if (k < 0.005) return null;
  const pts: V3[] = [];
  for (let i = 0; i < PATH.length - 1; i++) { const a = PATH[i], b = PATH[i + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[2] - a[2]) / 0.22); for (let j = 0; j < n; j++) pts.push([lerp(a[0], b[0], j / n), 0.02, lerp(a[2], b[2], j / n)]); }
  const shown = Math.floor(pts.length * k);
  return <>{pts.slice(0, shown).map((q, i) => <mesh key={i} position={q} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.045, 12]} /><meshBasicMaterial color="#ff5040" toneMapped={false} transparent opacity={0.85} /></mesh>)}</>;
};

// la linterna del ladrón (spot que recorre la casa)
const Flashlight: React.FC<{ on: number; at: V3; from: V3 }> = ({ on, at, from }) => {
  const tgt = useMemo(() => new THREE.Object3D(), []);
  tgt.position.set(at[0], at[1], at[2]); tgt.updateMatrixWorld();
  if (on < 0.01) return null;
  return <><primitive object={tgt} /><spotLight position={from} target={tgt} angle={0.36} penumbra={0.8} intensity={6.5 * on} distance={7} color="#fff3d6" castShadow /></>;
};

const Car: React.FC<{ glove: number }> = ({ glove }) => (
  <group position={[-7.2, 0, -0.5]}>
    <Box p={[0, 0.48, 0]} s={[1.8, 0.6, 3.6]} c="#5d6b78" r={0.35} m={0.55} rad={0.18} />
    <Box p={[0, 0.98, -0.15]} s={[1.6, 0.5, 1.9]} c="#4a5662" r={0.3} m={0.4} rad={0.2} />
    <Box p={[0, 0.98, 0.83]} s={[1.5, 0.42, 0.06]} c="#1c2630" r={0.05} m={0.2} rad={0.02} />
    {[[-0.85, 1.25], [0.85, 1.25], [-0.85, -1.25], [0.85, -1.25]].map(([x, z], i) => <mesh key={i} position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 24]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>)}
    {/* guantera abierta (tapa que baja) con los papeles del auto */}
    <group position={[0.15, 0.78, 0.15]} rotation={[-1.1 * glove, 0, 0]}><Box p={[0, -0.06, 0.06]} s={[0.42, 0.12, 0.02]} c="#2d343b" r={0.6} /></group>
    {glove > 0.05 && <Box p={[0.15, 0.74, 0.12]} s={[0.3, 0.02, 0.2]} c="#efe8d6" r={0.9} />}
  </group>
);

const Fridge: React.FC<{ open: number }> = ({ open }) => (
  <group position={[-4.3, 0, -1.95]}>
    <Box p={[0, 0.9, 0]} s={[0.78, 1.8, 0.7]} c="#8f979e" r={0.35} m={0.55} rad={0.05} />
    <Box p={[0, 1.36, 0.36]} s={[0.76, 0.015, 0.01]} c="#3b4045" />
    <Box p={[0.3, 0.85, 0.38]} s={[0.03, 0.6, 0.04]} c="#2e3236" m={0.8} r={0.3} />
    <group position={[-0.39, 1.6, 0.36]} rotation={[0, -1.6 * open, 0]}><Box p={[0.39, 0, 0.02]} s={[0.78, 0.4, 0.05]} c="#98a0a7" r={0.35} m={0.55} /><Box p={[0.69, -0.1, 0.06]} s={[0.03, 0.14, 0.04]} c="#2e3236" m={0.8} r={0.3} /></group>
    {open > 0.05 && <>
      <Box p={[0, 1.6, 0.05]} s={[0.66, 0.32, 0.5]} c="#b8dcf0" r={0.6} e="#9ad4ff" ei={0.6 * open} />
      <Box p={[0.1, 1.52, 0.2]} s={[0.26, 0.04, 0.2]} c="#e9e4d8" r={0.9} />
    </>}
  </group>
);

const Desk: React.FC<{ drawer: number; tex: ReturnType<typeof useCasaTex> }> = ({ drawer, tex }) => (
  <group position={[2.55, 0, -1.85]}>
    <Box p={[0, 0.74, 0]} s={[1.4, 0.05, 0.7]} c="#6b4426" r={0.6} />
    <Box p={[-0.62, 0.36, 0]} s={[0.06, 0.72, 0.66]} c="#5a381f" />
    <Box p={[0.42, 0.36, 0]} s={[0.5, 0.72, 0.66]} c="#5a381f" />
    {/* primer cajón: sale hacia el frente */}
    <group position={[0.42, 0.62, 0.05 + 0.32 * drawer]}>
      <Box p={[0, 0, 0]} s={[0.46, 0.14, 0.6]} c="#6e4628" />
      <Box p={[0, 0.02, 0.31]} s={[0.12, 0.025, 0.02]} c="#c9b07a" m={0.8} r={0.3} />
      <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.26]} /><meshStandardMaterial map={tex.folderBlue} roughness={0.5} /></mesh>
    </group>
    {/* pila de sobres + libretita de claves + lámpara */}
    <Box p={[-0.35, 0.79, 0.05]} s={[0.3, 0.06, 0.22]} c="#ece6d8" r={0.95} />
    <mesh position={[-0.35, 0.785, 0.13]} rotation={[-Math.PI / 2, 0, 0.2]}><planeGeometry args={[0.1, 0.13]} /><meshStandardMaterial map={tex.pad} /></mesh>
    <Box p={[0.5, 0.95, -0.2]} s={[0.05, 0.4, 0.05]} c="#333" m={0.6} />
    <mesh position={[0.5, 1.15, -0.15]}><coneGeometry args={[0.13, 0.16, 24, 1, true]} /><meshStandardMaterial color="#2b3a2f" side={THREE.DoubleSide} emissive="#ffd28a" emissiveIntensity={0.25} /></mesh>
    <Box p={[0, 0.48, 0.65]} s={[0.46, 0.06, 0.46]} c="#3a2a1e" />
  </group>
);

const Cabinet: React.FC<{ pry: number }> = ({ pry }) => (
  <group position={[3.95, 0, -1.95]}>
    <Box p={[0, 0.66, 0]} s={[0.5, 1.32, 0.62]} c="#7d858c" r={0.4} m={0.6} rad={0.02} />
    {[0, 1, 2, 3].map((k) => <group key={k} position={[0, 0.2 + k * 0.31, 0.31 + (k === 3 ? 0.12 * pry : 0)]}><Box p={[0, 0, 0]} s={[0.46, 0.28, 0.02]} c="#8c949b" r={0.35} m={0.6} /><Box p={[0, 0.06, 0.015]} s={[0.14, 0.03, 0.02]} c="#c9ccd0" m={0.9} r={0.2} /></group>)}
    <mesh position={[0, 1.27, 0.33]}><cylinderGeometry args={[0.022, 0.022, 0.02, 16]} /><meshStandardMaterial color="#d8c27a" metalness={1} roughness={0.25} /></mesh>
  </group>
);

const Wardrobe: React.FC<{ open: number; lift: number }> = ({ open, lift }) => (
  <group position={[6.35, 0, -2.0]}>
    <Box p={[0, 1.05, -0.05]} s={[1.3, 2.1, 0.56]} c="#7a5634" r={0.7} />
    <Box p={[0, 1.05, 0.2]} s={[1.18, 1.98, 0.06]} c="#3a2a1d" r={0.9} />
    <group position={[-0.62, 1.05, 0.26]} rotation={[0, -1.9 * open, 0]}><Box p={[0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
    <group position={[0.62, 1.05, 0.26]} rotation={[0, 1.9 * open, 0]}><Box p={[-0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
    {/* ropa colgada */}
    {[-0.4, -0.2, 0.05, 0.3].map((x, i) => <Box key={i} p={[x, 1.45, 0.12]} s={[0.16, 0.8, 0.3]} c={["#4b5a73", "#7b2f2f", "#c8c1b0", "#2f4a3a"][i]} r={0.95} />)}
    {/* la caja contra el fuego, gris, con manija arriba (sube cuando "se la llevan") */}
    <group position={[0, 0.17 + 0.9 * lift, 0.1 + 0.6 * lift]}>
      <Box p={[0, 0, 0]} s={[0.44, 0.3, 0.34]} c="#6f767c" r={0.45} m={0.5} rad={0.03} />
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.07, 0.012, 8, 24, Math.PI]} /><meshStandardMaterial color="#2a2d30" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  </group>
);

const Closet: React.FC<{ tex: ReturnType<typeof useCasaTex>; trunk: number }> = ({ tex, trunk }) => (
  <group position={[9.2, 0, -2.0]}>
    <Box p={[0, 1.15, -0.05]} s={[1.1, 2.3, 0.5]} c="#bfb39c" r={0.85} />
    {[0.8, 1.5].map((y, i) => <Box key={i} p={[0, y, 0.05]} s={[1.02, 0.03, 0.42]} c="#d8cdb6" r={0.8} />)}
    {/* carpetas viejas y la gorda de MANUALES */}
    {[-0.36, -0.26, -0.17].map((x, i) => <Box key={i} p={[x, 1.68, 0.05]} s={[0.08, 0.34, 0.3]} c={["#8a6b4a", "#5f6e57", "#7a7466"][i]} />)}
    <group position={[0.08, 1.7, 0.05]}><Box p={[0, 0, 0]} s={[0.2, 0.38, 0.32]} c="#6f6a5e" /><mesh position={[0, 0, 0.165]}><planeGeometry args={[0.18, 0.08]} /><meshStandardMaterial map={tex.manuals} /></mesh></group>
    {[0.32, 0.4].map((x, i) => <Box key={i} p={[x, 1.66, 0.05]} s={[0.07, 0.3, 0.28]} c={["#a0896a", "#4c5b6b"][i]} />)}
    {/* caja de metal ATORNILLADA al piso, al fondo */}
    <Box p={[0, 0.2, -0.05]} s={[0.46, 0.36, 0.36]} c="#3a3f44" r={0.35} m={0.7} />
    {[-0.17, 0.17].map((x, i) => <mesh key={i} position={[x, 0.025, 0.12]}><cylinderGeometry args={[0.02, 0.02, 0.03, 12]} /><meshStandardMaterial color="#c9c9c9" metalness={1} roughness={0.3} /></mesh>)}
    {/* el baúl pesado adelante (se corre para mostrar la caja) */}
    <Box p={[0.55 * trunk, 0.24, 0.42]} s={[0.9, 0.46, 0.44]} c="#5b3b22" r={0.7} rad={0.04} />
  </group>
);

const Room: React.FC<{ x0: number; x1: number; floor: string; tex: ReturnType<typeof useCasaTex>; planks?: Tx }> = ({ x0, x1, floor, tex, planks }) => {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  return (
    <group>
      <mesh position={[cx, 0, -1.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.3]} /><meshStandardMaterial color={floor} map={planks} roughness={0.8} /></mesh>
      <Box p={[cx, 1.3, -2.25]} s={[w, 2.6, 0.1]} c="#cfc6b6" map={tex.plaster} r={0.95} rad={0.01} />
      <Box p={[x1, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
    </group>
  );
};

export const World: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"]; st: WorldState }> = ({ t, camAt, st }) => {
  const tx = useTextures(), tex = useCasaTex();
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0, 3, 8] }}>
      <Cam t={t} camAt={camAt} />
      <color attach="background" args={["#0e1626"]} />
      <fog attach="fog" args={["#0e1626", 14, 40]} />
      {/* luz de luna sobre el jardín de adelante (que el pasto no quede negro) */}
      <pointLight position={[0.5, 2.2, 3.0]} intensity={4} distance={7} color="#b9c8ff" />
      <ambientLight intensity={0.22} color="#7d8fb8" />
      <directionalLight position={[-6, 9, 6]} intensity={0.55} color="#9fb6ff" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />
      {/* lámparas cálidas de adentro (bajan cuando "la casa está sola") */}
      {[[-4.2, 2.2, -1.2], [0, 2.2, -1.2], [3, 2.2, -1.2], [6.5, 2.2, -1.2]].map((p, i) => <pointLight key={i} position={p as V3} intensity={2.4 * st.lamps} distance={4.5} color="#ffcf8f" castShadow={i === 2} />)}
      {/* bloque de jardín cortado como maqueta */}
      <mesh position={[0.5, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[24, 7]} /><meshStandardMaterial map={tex.grass} roughness={1} /></mesh>
      <Box p={[0.5, -0.62, 0]} s={[24, 1.2, 7]} c="#3a2a1c" map={tex.soil} r={1} rad={0.01} cast={false} />
      {/* habitaciones */}
      <Room x0={-9} x1={-5.5} floor="#55585b" tex={tex} />
      <Room x0={-5.5} x1={-2} floor="#b8b0a2" tex={tex} />
      <Room x0={-2} x1={1.5} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Room x0={1.5} x1={4.5} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Room x0={4.5} x1={8.5} floor="#8e7a63" tex={tex} planks={tx.planks} />
      <Room x0={8.5} x1={10} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[-9, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      {/* puerta de entrada (pared entre cocina y sala) */}
      <Box p={[-1.95, 1.0, -0.6]} s={[0.12, 2.0, 0.9]} c="#5b3b22" r={0.6} />
      {/* sala: sillón + mesita con la pila de cartas */}
      <Box p={[0.6, 0.35, -1.7]} s={[1.6, 0.7, 0.7]} c="#4f5d6e" r={0.95} rad={0.12} />
      <Box p={[-0.2, 0.38, -1.7]} s={[0.5, 0.76, 0.4]} c="#6b4426" />
      <mesh position={[-0.2, 0.79, -1.7]} rotation={[-Math.PI / 2, 0, 0.15]}><planeGeometry args={[0.32, 0.2]} /><meshStandardMaterial map={tex.mailTop} /></mesh>
      <Box p={[-0.2, 0.775, -1.7]} s={[0.3, 0.03, 0.2]} c="#e9e2d2" r={0.95} />
      {/* cocina: mesada */}
      <Box p={[-3.1, 0.45, -1.95]} s={[1.8, 0.9, 0.6]} c="#7c6a55" r={0.7} />
      <Box p={[-3.1, 0.92, -1.95]} s={[1.84, 0.05, 0.64]} c="#d9d4ca" r={0.4} />
      {/* alacenas arriba de la mesada + tostadora y frasco (que se lea cocina) */}
      <Box p={[-3.1, 1.85, -2.05]} s={[1.8, 0.6, 0.36]} c="#6d5c48" r={0.7} />
      {[-3.55, -2.65].map((x) => <Box key={x} p={[x, 1.62, -1.86]} s={[0.12, 0.025, 0.02]} c="#c9b07a" m={0.8} r={0.3} />)}
      <Box p={[-2.5, 1.05, -2.0]} s={[0.32, 0.2, 0.2]} c="#a33a2c" r={0.5} rad={0.04} />
      <Box p={[-3.5, 1.04, -2.05]} s={[0.12, 0.2, 0.12]} c="#cdb98a" r={0.4} />
      <Fridge open={st.freezer} />
      <Car glove={st.glove} />
      <Desk drawer={st.drawer} tex={tex} />
      <Cabinet pry={st.pry} />
      <Wardrobe open={st.wardrobe} lift={st.lift} />
      <Box p={[7.75, 0.28, -0.9]} s={[1.3, 0.4, 2.0]} c="#d9d2c4" r={0.95} rad={0.08} />
      <Box p={[7.75, 0.5, -1.7]} s={[1.3, 0.18, 0.36]} c="#f1ede4" r={0.95} rad={0.08} />
      <Closet tex={tex} trunk={st.trunk} />
      {/* farol de la calle */}
      <Box p={[-10.8, 1.6, 2.2]} s={[0.08, 3.2, 0.08]} c="#222" m={0.6} />
      <mesh position={[-10.8, 3.25, 2.2]}><sphereGeometry args={[0.14, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#ffd9a0" emissiveIntensity={3} toneMapped={false} /></mesh>
      <pointLight position={[-10.8, 3.1, 2.2]} intensity={6} distance={9} color="#ffcf8f" />
      {/* el ladrón: recorrido + linterna + escondites que se encienden */}
      <Trail k={st.trail} />
      <Flashlight on={st.flash} at={st.flashAt} from={st.flashFrom} />
      {SPOTS.map((k) => <Heat key={k} p={PT[k]} on={st.heat[k] ?? 0} t={t} col={st.hot} />)}
      {st.hot !== "#ffffff" && <Heat p={PT.manuals} on={st.good} t={t} col="#3fe08a" r={0.5} />}
      <Post bloom={0.85} threshold={0.78} exposure={1.05} env={0.18} />
    </ThreeCanvas>
  );
};

export type WorldState = {
  lamps: number; drawer: number; pry: number; wardrobe: number; lift: number; freezer: number; glove: number; trunk: number;
  trail: number; flash: number; hot: string; flashAt: V3; flashFrom: V3; heat: Partial<Record<keyof typeof PT, number>>; good: number;
};
