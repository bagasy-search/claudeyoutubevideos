// sgardenwasps · EL MUNDO: el patio de atrás de la casa de su madre en Osaka (y el de Sachiko hoy, que lo copió).
// Casa de madera con engawa y alero hondo (la puerta de atrás: ahí cuelga "el casero" de papel), galpón con el alero donde
// las avispas papeleras arman el nido (dedal → taza → puño), la bici del padre, el caqui, los canteros de daikon y berenjena,
// la tina de lavar con agua jabonosa, la mesita con los limones claveteados y el atomizador, la leña, el cerco.
// Estaciones (primavera → verano → fin de verano → otoño → invierno), atardecer (la hora de actuar), la linterna con celofán rojo.
// UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../cme3d01/fx3d";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const C = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
type V = [number, number, number];

// ---------------- puntos del mundo (portales y rótulos HTML) ----------------
export const NEST: V = [3.15, 2.13, -0.98];
export const PT = {
  nest: NEST,
  nestLow: [3.15, 1.98, -0.98] as V,
  bag: [0.05, 1.98, -2.02] as V,
  bag2: [4.78, 1.95, -0.98] as V,
  door: [0.45, 1.1, -3.15] as V,
  table: [-0.9, 0.78, -1.3] as V,
  lemon: [-0.8, 0.84, -1.25] as V,
  bottle: [-1.12, 0.92, -1.32] as V,
  pot: [-0.62, 0.86, -1.45] as V,
  tub: [1.3, 0.42, -1.6] as V,
  bucket: [2.75, 0.32, -0.55] as V,
  sachet: [-2.6, 1.55, -2.28] as V,
  sachet2: [-0.4, 1.55, -2.28] as V,
  tree: [-3.5, 2.3, 0.7] as V,
  football: [-3.05, 2.05, 1.25] as V,
  hole: [1.85, 0.03, 2.9] as V,
  crack: [-4.55, 1.25, -3.14] as V,
  beds: [0.3, 0.3, 1.2] as V,
  bike: [2.05, 0.6, -1.15] as V,
  shed: [3.6, 1.3, -1.4] as V,
  woodpile: [5.25, 0.4, -0.7] as V,
  ladder: [4.35, 1.2, -0.95] as V,
  trap: [0.85, 0.62, -2.45] as V,
  porch: [-1.9, 0.5, -2.7] as V,
};

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // cámara en mano virtual: balanceo lento (0,4-1,8 Hz), nunca temblor rápido
  p.x += Math.sin(t * 0.53 * 6.28 / 3) * 0.012 + Math.sin(t * 1.1) * 0.004; p.y += Math.sin(t * 0.71 + 1) * 0.008; l.x += Math.sin(t * 0.43 + 2) * 0.01;
  return { p, l, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V) => project(camAt(t), v3(q));
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

// ---------------- texturas propias (deterministas) ----------------
type Tx = THREE.Texture;
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  // tablas de cedro quemado por el sol (la pared de la casa y el galpón)
  siding: mk(256, 256, (g) => {
    for (let r = 0; r < 8; r++) { const b = 150 + rnd(r, 1) * 35; g.fillStyle = `rgb(${b + 18},${b},${b - 14})`; g.fillRect(0, r * 32, 256, 32);
      for (let k = 0; k < 6; k++) { g.strokeStyle = `rgba(30,20,12,${0.1 + rnd(r, k) * 0.15})`; g.lineWidth = 1; g.beginPath(); const y = r * 32 + 4 + k * 5; g.moveTo(0, y); g.bezierCurveTo(90, y + 2, 170, y - 2, 256, y + 1); g.stroke(); }
      g.fillStyle = "rgba(15,10,6,.7)"; g.fillRect(0, r * 32 + 30, 256, 2); }
  }, [3, 2]),
  wood: mk(256, 256, (g) => {
    g.fillStyle = "#a07850"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(80,50,22,${0.1 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(80, y + 4 * rnd(k, 3), 170, y - 4, 256, y + 2); g.stroke(); }
  }, [2, 1]),
  // tejas grises onduladas
  tiles: mk(256, 256, (g) => {
    g.fillStyle = "#4a4d50"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = 60 + rnd(r * 8 + c, 2) * 25; g.fillStyle = `rgb(${v},${v + 3},${v + 6})`; g.beginPath(); g.ellipse(c * 32 + 16 + (r % 2) * 16, r * 32 + 20, 15, 14, 0, 0, Math.PI); g.fill(); }
  }, [6, 2]),
  grass: mk(512, 512, (g) => {
    g.fillStyle = "#6c7d45"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${60 + v * 70},${80 + v * 60},${30 + v * 30},.5)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 1.5, 3 + rnd(i, 4) * 5); }
  }, [10, 10]),
  soil: mk(256, 256, (g) => {
    g.fillStyle = "#6e5038"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2500; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${50 + v * 60},${36 + v * 40},${22 + v * 25},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }, [3, 1]),
  // el papel del nido: capas grises en bandas onduladas (pulpa de madera masticada)
  paper: mk(256, 256, (g) => {
    g.fillStyle = "#8f8b84"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 60; k++) { const v = 110 + rnd(k, 1) * 70; g.strokeStyle = `rgba(${v},${v - 4},${v - 10},.75)`; g.lineWidth = 2 + rnd(k, 2) * 4; g.beginPath(); const y = k * 4.3; g.moveTo(0, y); for (let x = 0; x <= 256; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + k) * 3); g.stroke(); }
  }),
  // panal abierto (celdas hexagonales boca abajo)
  comb: mk(256, 256, (g) => {
    g.fillStyle = "#6e6a62"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 12; r++) for (let c = 0; c < 12; c++) { const x = c * 22 + (r % 2) * 11, y = r * 19; g.fillStyle = rnd(r * 12 + c, 4) > 0.75 ? "#e8e0c8" : "#2a2622"; g.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g[i ? "lineTo" : "moveTo"](x + Math.cos(a) * 9, y + Math.sin(a) * 9); } g.fill(); }
  }),
  // bolsa de papel madera arrugada
  kraft: mk(256, 256, (g) => {
    g.fillStyle = "#b08a5a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${rnd(i, 1) > 0.5 ? "255,240,210" : "70,45,20"},${0.12 + rnd(i, 2) * 0.15})`; g.lineWidth = 1 + rnd(i, 3) * 2; g.beginPath(); const x = rnd(i, 4) * 256, y = rnd(i, 5) * 256; g.moveTo(x, y); g.lineTo(x + (rnd(i, 6) - 0.5) * 120, y + (rnd(i, 7) - 0.5) * 120); g.stroke(); }
  }),
  // bolsita de tela de algodón (los clavos de olor adentro)
  cloth: mk(128, 128, (g) => {
    g.fillStyle = "#e9e1cf"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 128; i += 3) { g.fillStyle = "rgba(150,130,100,.18)"; g.fillRect(i, 0, 1, 128); g.fillRect(0, i, 128, 1); }
    g.fillStyle = "rgba(200,50,30,.8)"; g.fillRect(0, 20, 128, 6);
  }),
  shoji: mk(256, 512, (g) => {
    g.fillStyle = "#f2ece0"; g.fillRect(0, 0, 256, 512);
    g.fillStyle = "#5e432b"; for (let x = 0; x <= 256; x += 64) g.fillRect(Math.min(250, x - 3), 0, 6, 512); for (let y = 0; y <= 512; y += 85) g.fillRect(0, Math.min(506, y - 3), 256, 6);
    g.fillRect(0, 0, 256, 10); g.fillRect(0, 502, 256, 10); g.fillRect(0, 0, 10, 512); g.fillRect(246, 0, 10, 512);
  }),
  hedge: mk(256, 256, (g) => {
    g.fillStyle = "#2f4a26"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${40 + v * 60},${70 + v * 70},${30 + v * 30},.7)`; g.beginPath(); g.ellipse(rnd(i, 2) * 256, rnd(i, 3) * 256, 3 + v * 4, 2, rnd(i, 4) * 3, 0, 6.3); g.fill(); }
  }, [6, 1]),
  // la grieta de la pared (bajo la ventana del costado)
  crack: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256); g.strokeStyle = "rgba(10,6,4,.95)"; g.lineWidth = 6; g.beginPath(); g.moveTo(40, 20);
    for (let i = 0; i < 12; i++) g.lineTo(40 + i * 16 + (rnd(i, 1) - 0.5) * 20, 20 + i * 18); g.stroke();
  }),
}), []);

// ---------------- primitivas ----------------
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx; open?: boolean }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 24, r2, op, map, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} map={map} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
const Ball: React.FC<{ p: V; r: number; c: string; s?: V; rough?: number; e?: string; ei?: number; map?: Tx; flat?: boolean; det?: number }> = ({ p, r, c, s, rough = 0.7, e, ei = 0, map, flat, det }) => (
  <mesh position={p} scale={s} castShadow receiveShadow>{det !== undefined ? <icosahedronGeometry args={[r, det]} /> : <sphereGeometry args={[r, 20, 14]} />}<meshStandardMaterial color={c} roughness={rough} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} flatShading={flat} /></mesh>
);

// el AVISPERO de avispa papelera: tallo + cúpula de papel gris + panal abierto boca abajo (tamaño = sz: 0 nada, .25 dedal, .5 taza, 1 puño)
const Nest: React.FC<{ p: V; sz: number; wet: number; tex: ReturnType<typeof useTex>; drop?: number }> = ({ p, sz, wet, tex, drop = 0 }) => {
  if (sz <= 0.01) return null;
  const R = 0.03 + 0.1 * sz, col = C("#b8ae9c", "#5d5a55", wet);
  const y = p[1] - drop * 1.75, rx = drop * 2.2;
  return <group position={[p[0], y, p[2]]} rotation={[rx, 0, drop * 0.6]}>
    <Cyl p={[0, -0.015, 0]} r={0.004} h={0.03} c="#6e6a62" />
    <mesh position={[0, -0.03 - R * 0.55, 0]} scale={[1, 0.42, 1]} rotation={[0.25, 0, 0.12]} castShadow><sphereGeometry args={[R, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><meshStandardMaterial map={tex.paper} color={col} roughness={0.95 - 0.5 * wet} metalness={0.05 * wet} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.03 - R * 0.42, 0]} rotation={[Math.PI / 2 + 0.25, 0, 0]}><circleGeometry args={[R * 0.97, 28]} /><meshStandardMaterial map={tex.comb} color={C("#ffffff", "#9a968e", wet)} roughness={0.9} side={THREE.DoubleSide} /></mesh>
  </group>;
};

// avispa: cuerpo amarillo y negro + alas que aletean (instancias simples, pocas)
const Wasp: React.FC<{ p: V; t: number; i: number }> = ({ p, t, i }) => {
  const fl = Math.sin(t * 60 + i) * 0.6;
  return <group position={p} rotation={[0, t * 2 + i, 0]} scale={1.5}>
    <mesh scale={[0.6, 0.6, 1.6]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#d8a316" roughness={0.5} /></mesh>
    <mesh position={[0, 0, -0.012]} scale={[0.5, 0.5, 1.2]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#1a1612" roughness={0.5} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.01, 0.006, 0]} rotation={[0, 0, sd * fl]}><planeGeometry args={[0.018, 0.008]} /><meshStandardMaterial color="#e8f0ff" transparent opacity={0.45} side={THREE.DoubleSide} /></mesh>)}
  </group>;
};
const Swarm: React.FC<{ c: V; n: number; t: number; R?: number; seed?: number; calm?: number }> = ({ c, n, t, R = 0.35, seed = 1, calm = 1 }) => <>
  {Array.from({ length: Math.round(n) }, (_, i) => {
    const sp = (0.6 + rnd(i, seed) * 0.9) * calm, a = t * sp * 2 + rnd(i, seed + 1) * 6.3, rr = R * (0.4 + rnd(i, seed + 2) * 0.6);
    return <Wasp key={i} i={i} t={t} p={[c[0] + Math.cos(a) * rr, c[1] + Math.sin(a * 1.7) * rr * 0.4 - 0.05, c[2] + Math.sin(a) * rr]} />;
  })}
</>;

// "EL CASERO": bolsa de papel madera rellena, la boca retorcida, colgada de un hilo de un clavo; se mece con el viento
const PaperBag: React.FC<{ p: V; k: number; t: number; tex: ReturnType<typeof useTex>; wet?: number }> = ({ p, k, t, tex, wet = 0 }) => {
  if (k <= 0.01) return null;
  const sw = Math.sin(t * 0.9) * 0.06 + Math.sin(t * 1.7) * 0.02, drop = (1 - ease(k)) * 0.6;
  return <group position={[p[0], p[1] + 0.25 + drop, p[2]]} rotation={[sw * 0.5, t * 0.15, sw]}>
    <Cyl p={[0, -0.06, 0]} r={0.002} h={0.12} c="#e8dcc0" />
    <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.035, 0.08, 7]} /><meshStandardMaterial map={tex.kraft} color={C("#ffffff", "#8a7a66", wet)} roughness={0.95} flatShading /></mesh>
    <mesh position={[0, -0.3, 0]} scale={[1.05, 1.25, 0.95]} castShadow><icosahedronGeometry args={[0.13, 2]} /><meshStandardMaterial map={tex.kraft} color={C("#ffffff", "#8a7a66", wet)} roughness={0.97} flatShading /></mesh>
  </group>;
};
// bolsita de clavos de olor colgada
const Sachet: React.FC<{ p: V; k: number; t: number; tex: ReturnType<typeof useTex> }> = ({ p, k, t, tex }) => {
  if (k <= 0.01) return null;
  const sw = Math.sin(t * 1.1 + p[0]) * 0.08;
  return <group position={[p[0], p[1] + (1 - ease(k)) * 0.3, p[2]]} rotation={[0, 0, sw]} scale={ease(k)}>
    <Cyl p={[0, 0.06, 0]} r={0.0015} h={0.1} c="#c8321e" />
    <mesh position={[0, -0.02, 0]} scale={[1, 1.3, 0.8]} castShadow><icosahedronGeometry args={[0.04, 2]} /><meshStandardMaterial map={tex.cloth} roughness={0.95} flatShading /></mesh>
    <mesh position={[0, 0.025, 0]}><coneGeometry args={[0.022, 0.03, 8]} /><meshStandardMaterial map={tex.cloth} roughness={0.95} /></mesh>
  </group>;
};
// medio limón con 10-12 clavos de olor
const Lemon: React.FC<{ p: V; k: number }> = ({ p, k }) => k <= 0.01 ? null : <group position={[p[0], p[1] + (1 - ease(k)) * 0.2, p[2]]} scale={ease(k)}>
  <mesh rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.045, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e8c832" roughness={0.55} /></mesh>
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}><circleGeometry args={[0.043, 20]} /><meshStandardMaterial color="#f6eaa0" roughness={0.6} /></mesh>
  {Array.from({ length: 11 }, (_, i) => { const a = i * 2.4, r = 0.012 + (i % 3) * 0.01; return <mesh key={i} position={[Math.cos(a) * r, 0.006, Math.sin(a) * r]}><cylinderGeometry args={[0.0025, 0.0018, 0.014, 5]} /><meshStandardMaterial color="#3d2416" roughness={0.8} /></mesh>; })}
</group>;
// atomizador con agua jabonosa (o el de clavo)
const Bottle: React.FC<{ p: V; tint?: string }> = ({ p, tint = "#cfe6f0" }) => <group position={p}>
  <Cyl p={[0, 0, 0]} r={0.035} h={0.16} c={tint} rough={0.15} op={0.75} />
  <Cyl p={[0, 0.095, 0]} r={0.018} h={0.03} c="#f2f2f2" rough={0.4} />
  <Box p={[0.015, 0.125, 0]} s={[0.05, 0.03, 0.025]} c="#e8e8e8" r={0.4} rad={0.006} />
  <Box p={[0.0, 0.1, 0.022]} s={[0.012, 0.04, 0.012]} c="#e8e8e8" r={0.4} rad={0.004} rot={[0.4, 0, 0]} />
</group>;
// caqui
const Persimmon: React.FC<{ p: V; t: number; season: number; leaf: number }> = ({ p, t, season, leaf }) => {
  const lc = C(C("#5d8a3a", "#c97b2a", cl(season - 2)), "#5a4632", cl(season - 3)), fruit = cl(season - 1.6);
  return <group position={p}>
    <Cyl p={[0, 0.9, 0]} r={0.09} r2={0.13} h={1.8} c="#4a3a2c" rough={0.95} />
    {[[0.4, 1.7, 0.1, 0.7], [-0.35, 1.9, -0.2, -0.6], [0.1, 2.05, 0.35, 0.3]].map(([x, y, z, r], i) => <Cyl key={i} p={[x * 0.5, y, z * 0.5]} r={0.035} h={0.9} c="#4a3a2c" rot={[z, 0, r]} />)}
    {leaf > 0.02 && [[0, 2.35, 0, 0.95], [0.6, 2.15, 0.2, 0.7], [-0.6, 2.2, -0.1, 0.7], [0.1, 2.75, -0.2, 0.65], [-0.2, 2.1, 0.6, 0.6]].map(([x, y, z, r], i) =>
      <mesh key={i} position={[x, y + Math.sin(t * 0.7 + i) * 0.01, z]} scale={leaf} castShadow receiveShadow><icosahedronGeometry args={[r, 2]} /><meshStandardMaterial color={lc} roughness={0.9} flatShading /></mesh>)}
    {fruit > 0.02 && Array.from({ length: 14 }, (_, i) => <Ball key={i} p={[Math.cos(i * 2.1) * (0.5 + rnd(i, 2) * 0.4), 1.75 + rnd(i, 3) * 0.9, Math.sin(i * 2.1) * (0.5 + rnd(i, 4) * 0.4) + 0.15]} r={0.05 * fruit} c="#e8681c" rough={0.45} />)}
  </group>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const s = ST(t);
  const dusk = s.dusk, win = s.season >= 3.6 ? 1 : 0, snow = s.snow;
  const skyDay = C(C("#b9d3e6", "#d6dde0", cl(s.season - 2.8)), "#c9ced3", snow);
  const sky = C(skyDay, "#d98c5f", dusk * 0.85);
  const sun = C("#fff1d6", "#ff9a5a", dusk);
  const grass = C(C(C("#7f9a4c", "#86933f", cl(s.season - 0.6)), "#9a8a4a", cl(s.season - 2.2)), "#e9eef2", snow);
  const leaf = 1 - cl(s.season - 3.2) * 0.95;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.5} threshold={0.88} exposure={lerp(1.0, 0.96, dusk) * (1 - 0.3 * s.shade)} env={lerp(0.35, 0.18, dusk)} />
      <color attach="background" args={[sky]} />
      <fogExp2 attach="fog" args={[sky, 0.028]} />
      <hemisphereLight args={[C("#dfe8f2", "#ffc79a", dusk), C("#6a5a3a", "#3a2a22", dusk), lerp(0.75, 0.68, dusk)]} />
      <directionalLight position={[lerp(7, 9, dusk), lerp(9, 2.6, dusk), lerp(5, 2, dusk)]} intensity={lerp(2.0, 1.6, dusk) * (1 - 0.4 * snow)} color={sun} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* la luz cálida de la cocina por las shoji al atardecer */}
      <pointLight position={[-2, 1.4, -2.2]} intensity={dusk * 2.2} distance={5} color="#ffbe78" />
      {/* la linterna con celofán rojo: las avispas no ven el rojo */}
      {s.red > 0.02 && <spotLight position={[NEST[0] - 0.5, 1.25, NEST[2] + 1.1]} target-position={NEST} angle={0.28} penumbra={0.6} intensity={s.red * 14} distance={4} color="#ff2a10" />}

      {/* suelo: pasto (con nieve en invierno) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial map={tx.grass} color={grass} roughness={1} /></mesh>
      {/* senderito de piedras de la puerta al galpón */}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.6 + i * 0.42, 0.012, -1.9 + i * 0.12]} rotation={[-Math.PI / 2, 0, rnd(i, 3)]} receiveShadow><circleGeometry args={[0.16 + rnd(i, 2) * 0.05, 9]} /><meshStandardMaterial color={C("#8d8a80", "#f2f5f8", snow)} roughness={1} /></mesh>)}

      {/* ===== LA CASA (pared de atrás en z=-3.2) ===== */}
      <Box p={[-1.9, 1.5, -3.25]} s={[6.4, 3.0, 0.12]} c="#8a6c52" map={tx.siding} r={0.9} rad={0.01} />
      {/* shoji de la cocina (se encienden al atardecer) */}
      {[-3.9, -3.0, -2.1].map((x, i) => <mesh key={i} position={[x, 1.25, -3.18]}><planeGeometry args={[0.86, 1.6]} /><meshStandardMaterial map={tx.shoji} color="#ffffff" emissive="#ffc98a" emissiveMap={tx.shoji} emissiveIntensity={0.08 + dusk * 0.9} roughness={0.9} /></mesh>)}
      {/* la puerta de atrás (madera) */}
      <Box p={[0.45, 1.05, -3.17]} s={[0.85, 1.9, 0.06]} c="#5a3d26" map={tx.wood} r={0.7} rad={0.01} />
      <Ball p={[0.78, 1.0, -3.12]} r={0.025} c="#b8954a" rough={0.3} />
      {/* la grieta del costado (avispas que entran a la pared) */}
      {s.crack > 0.01 && <mesh position={[PT.crack[0], PT.crack[1], -3.18]}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial map={tx.crack} transparent opacity={s.crack} depthWrite={false} /></mesh>}
      {s.crack > 0.3 && <Swarm c={[PT.crack[0] + 0.1, PT.crack[1], -3.0]} n={8 * s.crack} t={t} R={0.25} seed={9} />}
      {/* engawa: tarima de madera con sus postes */}
      <Box p={[-1.9, 0.45, -2.75]} s={[6.3, 0.07, 0.9]} c="#8a6a48" map={tx.wood} r={0.6} rad={0.01} />
      {[-4.9, -3.4, -1.5, 0.0].map((x) => <Box key={x} p={[x, 0.22, -2.35]} s={[0.08, 0.44, 0.08]} c="#4a3220" rad={0.008} />)}
      <Box p={[-0.6, 0.18, -2.15]} s={[0.6, 0.18, 0.35]} c={C("#9a978e", "#eef2f5", snow)} r={1} rad={0.03} />{/* piedra-escalón (kutsunugi-ishi) */}
      {/* postes del alero */}
      {[-4.9, -2.6, -0.4, 1.0].map((x) => <Box key={x} p={[x, 1.25, -2.3]} s={[0.1, 2.5, 0.1]} c="#4a3220" r={0.75} rad={0.012} />)}
      <Box p={[-1.9, 2.5, -2.3]} s={[6.4, 0.12, 0.12]} c="#4a3220" r={0.75} rad={0.01} />
      {/* el ALERO hondo (tejas) */}
      <mesh position={[-1.9, 2.75, -2.55]} rotation={[0.38, 0, 0]} castShadow receiveShadow><boxGeometry args={[6.8, 0.05, 1.6]} /><meshStandardMaterial map={tx.tiles} color={C("#ffffff", "#f4f7fa", snow)} roughness={0.8} /></mesh>
      {snow > 0.02 && <mesh position={[-1.9, 2.79, -2.55]} rotation={[0.38, 0, 0]}><boxGeometry args={[6.8, 0.04, 1.6]} /><meshStandardMaterial color="#f6f8fb" roughness={0.9} transparent opacity={snow} /></mesh>}
      {/* el clavo de la puerta y EL CASERO de papel */}
      <Cyl p={[PT.bag[0], 2.47, -2.24]} r={0.006} h={0.05} c="#3a3a3a" m={0.6} rot={[Math.PI / 2, 0, 0]} />
      <PaperBag p={PT.bag} k={s.bag} t={t} tex={tx} wet={0} />
      {/* bolsitas de clavo colgadas en los postes */}
      <Sachet p={PT.sachet} k={s.sachet} t={t} tex={tx} />
      <Sachet p={PT.sachet2} k={s.sachet} t={t + 1} tex={tx} />
      {/* la trampa dulce junto a la puerta (el error 3) */}
      {s.trap > 0.01 && <group position={PT.trap} scale={ease(s.trap)}>
        <Cyl p={[0, 0, 0]} r={0.06} h={0.16} c="#e8b04a" rough={0.1} op={0.7} />
        <Cyl p={[0, 0.09, 0]} r={0.062} h={0.02} c="#c8321e" rough={0.5} />
        <Swarm c={[PT.trap[0] * 0, 0.25, 0]} n={10 * s.trap} t={t} R={0.3} seed={4} />
      </group>}

      {/* ===== LA MESITA del patio: limones claveteados, el atomizador, la olla del agua de clavo ===== */}
      <group position={[PT.table[0], 0, PT.table[2]]}>
        <Cyl p={[0, 0.72, 0]} r={0.42} h={0.035} c="#6a4a30" rough={0.5} map={tx.wood} seg={36} />
        <Cyl p={[0, 0.36, 0]} r={0.035} h={0.72} c="#3b2618" />
        <Cyl p={[0, 0.02, 0]} r={0.22} h={0.03} c="#3b2618" />
      </group>
      <Lemon p={PT.lemon} k={s.lemon} />
      <Lemon p={[PT.lemon[0] + 0.14, PT.lemon[1], PT.lemon[2] + 0.1]} k={s.lemon * 1.4 - 0.4} />
      {s.bottle > 0.01 && <Bottle p={[PT.bottle[0], 0.82, PT.bottle[2]]} tint={s.cloveWater > 0.5 ? "#c8955a" : "#cfe6f0"} />}
      {s.pot > 0.01 && <group position={[PT.pot[0], 0.74, PT.pot[2]]} scale={ease(s.pot)}>
        <Cyl p={[0, 0.06, 0]} r={0.1} h={0.12} c="#b0b4b8" m={0.7} rough={0.3} />
        <Cyl p={[0, 0.115, 0]} r={0.095} h={0.005} c="#6a3a1c" rough={0.2} />
        <Box p={[0.16, 0.1, 0]} s={[0.14, 0.015, 0.025]} c="#1b1712" rad={0.005} />
        {Array.from({ length: 6 }, (_, i) => { const u = ((t * 0.35 + i / 6) % 1); return <Ball key={i} p={[Math.sin(i * 2 + t) * 0.03, 0.15 + u * 0.35, Math.cos(i * 3) * 0.03]} r={0.03 + u * 0.05} c="#ffffff" rough={1} />; }).map((m, i) => <group key={i} visible={s.steam > 0.5}>{m}</group>)}
      </group>}
      {/* el cuenco de clavos */}
      {s.cloves > 0.01 && <group position={[-0.68, 0.74, -1.12]} scale={ease(s.cloves)}>
        <Cyl p={[0, 0.03, 0]} r={0.07} r2={0.045} h={0.06} c="#efe6d2" rough={0.3} open />
        {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.4) * 0.04 * rnd(i, 2), 0.05 + rnd(i, 3) * 0.01, Math.sin(i * 2.4) * 0.04 * rnd(i, 2)]} rotation={[rnd(i, 4) * 3, 0, rnd(i, 5) * 3]}><cylinderGeometry args={[0.003, 0.002, 0.016, 5]} /><meshStandardMaterial color="#3d2416" /></mesh>)}
      </group>}

      {/* ===== LA TINA de lavar con agua jabonosa (y su espuma) ===== */}
      <group position={[PT.tub[0], 0, PT.tub[2]]}>
        <Cyl p={[0, 0.17, 0]} r={0.36} r2={0.3} h={0.34} c="#a7acb0" m={0.75} rough={0.35} open />
        <Cyl p={[0, 0.02, 0]} r={0.3} h={0.02} c="#9a9fa3" m={0.7} rough={0.4} />
        <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.345, 32]} /><meshStandardMaterial color="#c9dde4" roughness={0.08} metalness={0.2} transparent opacity={0.85} /></mesh>
        {s.suds > 0.01 && Array.from({ length: 40 }, (_, i) => <Ball key={i} p={[Math.cos(i * 2.39) * 0.3 * Math.sqrt(rnd(i, 1)), 0.31 + rnd(i, 2) * 0.02, Math.sin(i * 2.39) * 0.3 * Math.sqrt(rnd(i, 1))]} r={(0.02 + rnd(i, 3) * 0.03) * s.suds} c="#ffffff" rough={0.15} />)}
      </group>
      {/* el balde jabonoso bajo el nido (para tirarlo adentro) */}
      {s.bucket > 0.01 && <group position={[PT.bucket[0], 0, PT.bucket[2]]} scale={ease(s.bucket)}>
        <Cyl p={[0, 0.16, 0]} r={0.15} r2={0.12} h={0.32} c="#3d6a9e" rough={0.5} open />
        <Cyl p={[0, 0.01, 0]} r={0.12} h={0.02} c="#3d6a9e" />
        <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.145, 24]} /><meshStandardMaterial color="#dfeef2" roughness={0.2} /></mesh>
        {Array.from({ length: 12 }, (_, i) => <Ball key={i} p={[Math.cos(i * 2.39) * 0.11 * rnd(i, 1), 0.29, Math.sin(i * 2.39) * 0.11 * rnd(i, 1)]} r={0.02} c="#ffffff" rough={0.2} />)}
        <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.15, 0.004, 4, 24, Math.PI]} /><meshStandardMaterial color="#888" metalness={0.6} /></mesh>
      </group>}

      {/* ===== EL GALPÓN (frente en z=-1.4) ===== */}
      <group>
        <Box p={[3.6, 1.1, -2.4]} s={[2.4, 2.2, 2.0]} c="#7a5c44" map={tx.siding} r={0.9} rad={0.02} />
        <Box p={[3.6, 0.95, -1.39]} s={[0.8, 1.7, 0.04]} c="#4a3220" map={tx.wood} r={0.8} rad={0.01} />
        <Box p={[2.75, 1.4, -1.39]} s={[0.45, 0.35, 0.03]} c="#2a3036" r={0.15} m={0.3} rad={0.005} />
        {/* alero del galpón: donde arman el nido */}
        <mesh position={[3.6, 2.3, -1.75]} rotation={[-0.22, 0, 0]} castShadow receiveShadow><boxGeometry args={[2.9, 0.06, 1.9]} /><meshStandardMaterial map={tx.tiles} color={C("#d8d4cc", "#f4f7fa", snow)} roughness={0.85} /></mesh>
        <Box p={[3.6, 2.19, -0.95]} s={[2.9, 0.08, 0.06]} c="#4a3220" rad={0.01} />
        {snow > 0.02 && <mesh position={[3.6, 2.34, -1.75]} rotation={[-0.22, 0, 0]}><boxGeometry args={[2.9, 0.04, 1.9]} /><meshStandardMaterial color="#f6f8fb" transparent opacity={snow} /></mesh>}
      </group>
      {/* el avispero bajo el alero (crece con la estación; se moja; cae al balde) */}
      <Nest p={NEST} sz={s.nest} wet={s.wet} tex={tx} drop={s.drop} />
      {s.nest > 0.05 && s.wasps > 0.2 && <Swarm c={[NEST[0], NEST[1] - 0.12, NEST[2] + 0.1]} n={s.wasps} t={t} R={0.18 + 0.25 * s.nest} calm={1 - 0.7 * dusk} />}
      {/* el chorro del atomizador: recto, desde lejos, a la boca del nido */}
      {s.spray > 0.01 && Array.from({ length: 30 }, (_, i) => { const u = ((t * 2.2 + i / 30) % 1); const a: V = [NEST[0] - 1.6, 1.35, NEST[2] + 1.9];
        return <Ball key={i} p={[lerp(a[0], NEST[0], u), lerp(a[1], NEST[1] - 0.1, u) + Math.sin(u * Math.PI) * 0.12, lerp(a[2], NEST[2], u)]} r={0.005 + 0.004 * u} c="#cfe3f0" rough={0.05} />; }).filter((_, i) => i < 30 * s.spray)}
      {/* la segunda bolsa en la esquina del galpón */}
      <PaperBag p={PT.bag2} k={s.bag2} t={t + 2} tex={tx} />
      {/* la bici del padre apoyada en el galpón */}
      <group position={[PT.bike[0], 0, PT.bike[2]]} rotation={[0, 0.1, -0.12]}>
        {[-0.38, 0.38].map((x) => <mesh key={x} position={[x, 0.34, 0]}><torusGeometry args={[0.32, 0.018, 8, 32]} /><meshStandardMaterial color="#1b1b1b" roughness={0.7} /></mesh>)}
        <Cyl p={[0, 0.5, 0]} r={0.015} h={0.75} c="#2b4a3a" m={0.5} rot={[0, 0, Math.PI / 2 - 0.2]} />
        <Cyl p={[-0.2, 0.55, 0]} r={0.015} h={0.5} c="#2b4a3a" m={0.5} rot={[0, 0, 0.4]} />
        <Cyl p={[0.32, 0.75, 0]} r={0.012} h={0.45} c="#2b4a3a" m={0.5} rot={[0, 0, -0.25]} />
        <Box p={[-0.13, 0.85, 0]} s={[0.18, 0.04, 0.07]} c="#3a2a1f" rad={0.015} />
        <Cyl p={[0.38, 0.97, 0]} r={0.012} h={0.42} c="#9a9a9a" m={0.8} rot={[Math.PI / 2, 0, 0]} />
        <Box p={[0.5, 0.75, 0]} s={[0.22, 0.14, 0.25]} c="#8a7a50" r={0.9} rad={0.01} />{/* canasto */}
      </group>
      {/* la escoba de bambú */}
      <Cyl p={[2.45, 0.8, -1.38]} r={0.012} h={1.5} c="#b09a5a" rot={[0.12, 0, 0.12]} />
      <mesh position={[2.36, 0.12, -1.3]}><coneGeometry args={[0.12, 0.3, 10]} /><meshStandardMaterial color="#8a7440" roughness={1} /></mesh>
      {/* la escalera (el error 5) */}
      {s.ladder > 0.01 && <group position={[PT.ladder[0], 0, PT.ladder[2] + 0.35]} rotation={[0.28, 0, 0]} scale={[1, ease(s.ladder), 1]}>
        {[-0.2, 0.2].map((x) => <Box key={x} p={[x, 1.1, 0]} s={[0.04, 2.2, 0.05]} c="#b8b8b0" m={0.6} r={0.4} rad={0.008} />)}
        {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0, 0.2 + i * 0.3, 0]} s={[0.4, 0.03, 0.04]} c="#b8b8b0" m={0.6} r={0.4} rad={0.006} />)}
      </group>}
      {/* la leña apilada */}
      <group position={PT.woodpile}>
        {Array.from({ length: 15 }, (_, i) => <Cyl key={i} p={[(i % 5) * 0.17 - 0.34, 0.08 + Math.floor(i / 5) * 0.15, 0]} r={0.075} h={0.6} c={i % 2 ? "#8a6a48" : "#7a5a3a"} rough={0.95} rot={[Math.PI / 2, 0, 0]} />)}
      </group>

      {/* ===== EL CAQUI (y el avispero gris en forma de pelota de fútbol, alto en la copa) ===== */}
      <Persimmon p={[PT.tree[0], 0, PT.tree[2]]} t={t} season={s.season} leaf={leaf} />
      {s.football > 0.01 && <group position={PT.football} scale={ease(s.football)}>
        <mesh scale={[0.8, 1.15, 0.8]} castShadow><sphereGeometry args={[0.22, 28, 20]} /><meshStandardMaterial map={tx.paper} color="#9a958c" roughness={0.95} /></mesh>
        <mesh position={[0, -0.2, 0.08]}><circleGeometry args={[0.03, 12]} /><meshBasicMaterial color="#111" /></mesh>
        <Swarm c={[0, -0.25, 0.1]} n={10} t={t} R={0.35} seed={7} />
      </group>}

      {/* ===== LOS CANTEROS: daikon y berenjena ===== */}
      {[0.4, 1.2, 2.0].map((z, r) => <group key={r}>
        <Box p={[0.3, 0.06, z]} s={[3.6, 0.12, 0.55]} c="#8a6a4c" map={tx.soil} r={1} rad={0.03} />
        {win < 1 && Array.from({ length: 12 }, (_, i) => r < 2
          ? <group key={i} position={[-1.35 + i * 0.3, 0.12, z]}>{[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[0, 0.12, 0]} rotation={[Math.cos(j * 1.26) * 0.6, j * 1.26, Math.sin(j * 1.26) * 0.6]}><coneGeometry args={[0.035, 0.32, 4]} /><meshStandardMaterial color={C("#4f7d32", "#7a7a3a", cl(s.season - 2.6))} roughness={0.9} flatShading /></mesh>)}<Ball p={[0, 0.03, 0]} r={0.045} c="#f2efe6" /></group>
          : <group key={i} position={[-1.35 + i * 0.3, 0.12, z]}><Ball p={[0, 0.22, 0]} r={0.14} c="#3e6a2a" flat det={1} />{s.season > 0.8 && s.season < 3 && <Ball p={[0.08, 0.12, 0.08]} r={0.035} s={[1, 1.9, 1]} c="#3a1840" rough={0.25} />}</group>)}
      </group>)}
      {/* el agujero en el pasto con la varita y la cinta (el nido de tierra: NO se toca) */}
      {s.hole > 0.01 && <group position={PT.hole}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}><circleGeometry args={[0.035, 14]} /><meshBasicMaterial color="#0d0a08" /></mesh>
        <Swarm c={[0, 0.12, 0]} n={7 * s.hole} t={t} R={0.18} seed={3} />
        {s.ribbon > 0.01 && <group position={[0.35, 0, 0.1]} scale={[1, ease(s.ribbon), 1]}>
          <Cyl p={[0, 0.3, 0]} r={0.008} h={0.6} c="#c9a46e" />
          <mesh position={[0.07, 0.56, 0]} rotation={[0, 0, Math.sin(t * 3) * 0.2 - 0.2]}><planeGeometry args={[0.16, 0.03]} /><meshStandardMaterial color="#e8241a" side={THREE.DoubleSide} /></mesh>
        </group>}
      </group>}

      {/* ===== el cerco: ligustro atrás y al costado ===== */}
      <Box p={[0, 0.7, -4.4]} s={[14, 1.4, 0.6]} c={C("#ffffff", "#e8eef2", snow)} map={tx.hedge} r={1} rad={0.2} />
      <Box p={[6.6, 0.7, 0.5]} s={[0.6, 1.4, 9]} c={C("#ffffff", "#e8eef2", snow)} map={tx.hedge} r={1} rad={0.2} />
      {/* escarcha / nieve que cae sobre todo en invierno */}
      {snow > 0.05 && Array.from({ length: 60 }, (_, i) => { const y = 4 - ((t * 0.4 + rnd(i, 1) * 4) % 4); return <Ball key={i} p={[-5 + rnd(i, 2) * 11, y, -3.5 + rnd(i, 3) * 7]} r={0.015} c="#ffffff" rough={1} />; })}
    </ThreeCanvas>
  );
};
