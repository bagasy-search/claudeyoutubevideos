// ck2510d (base lcf01) · EL MUNDO: la cocina de Loretta (Iowa, casa vieja), en corte de maqueta. Una sola escena y UNA cámara.
// Heladera redondeada con la fuente del funeral en papel aluminio · cocina esmaltada blanca de los 50 con la puerta del
// horno que es el PORTAL (cada cena sale de ahí) · mesa para UNO con el mantel viejo del sótano de la iglesia (la crucecita
// bordada en la esquina), la silla vacía de Harold, la vela · reloj de pared a las 4:50 · mesada larga con las 10 fuentecitas.
// Eventos clavados a la voz (segundos globales de caps.json). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const inR = (t: number, a: number, b: number) => t >= a && t < b;
type V3 = [number, number, number];
type Tx = THREE.Texture | undefined;

// ---------------- puntos fijos del mundo ----------------
const CLOCK: V3 = [-1.35, 1.92, -2.96];
const FRIDGE: V3 = [-2.15, 0, -2.5];          // base
const RANGE: V3 = [1.35, 0, -2.62];           // base
const OVEN_DOOR = { x: 1.18, y0: 0.16, w: 0.56, h: 0.5, z: -2.29 };
const TABLE: V3 = [0.35, 0.76, -0.45];        // centro del tablero
const PLATE: V3 = [-0.08, 0.775, -0.45];
const DISH_ROW = (i: number): V3 => [-2.72, 0.935, -1.6 + i * 0.355];
export const PT = {
  clock: CLOCK,
  fridgePan: [-2.15, 1.0, -2.5] as V3,
  ovenWin: [OVEN_DOOR.x, 0.42, OVEN_DOOR.z] as V3,
  ovenOut: [OVEN_DOOR.x, 0.66, -2.0] as V3,
  plate: PLATE,
  bigPan: [0.42, 0.8, -0.45] as V3,
  chair: [1.2, 0.95, -0.45] as V3,
  cross: [0.38, 0.78, -0.05] as V3,
  dish: DISH_ROW,
};

// ---------------- CÁMARA: keyframes [t, pos, look, fov]; cúbica + arco en los vuelos largos ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = [
  // B · el reloj del pasillo a las 4:50 → la heladera se abre: la fuente del funeral en papel aluminio
  { t: 3.5, p: [-1.2, 1.78, -2.25], l: CLOCK, fov: 34 },
  { t: 5.5, p: [-1.25, 1.74, -2.05], l: [-1.38, 1.88, -2.96], fov: 34 },
  { t: 6.9, p: [-1.45, 1.3, -1.0], l: [-2.2, 1.0, -2.5], fov: 40, arc: 0.06 },
  { t: 9.6, p: [-1.95, 1.12, -1.5], l: [-2.18, 0.98, -2.55], fov: 36 },
  { t: 13.2, p: [-2.08, 1.06, -1.8], l: [-2.16, 0.97, -2.6], fov: 31 },
  // E · de noche, la cocina oscura; "picture a different kitchen": se prende la luz del horno, la vela, la lámpara
  { t: 23.85, p: [2.1, 1.65, 1.35], l: [-0.3, 0.85, -2.4], fov: 42 },
  { t: 27.3, p: [1.85, 1.5, 0.75], l: [0.5, 0.75, -2.5], fov: 40 },
  { t: 30.6, p: [1.22, 0.74, -1.3], l: [1.18, 0.44, -2.4], fov: 36 },
  // G · se abre la puerta del horno, el calor en la cara, sale UNA fuentecita
  { t: 36.9, p: [1.2, 0.62, -1.45], l: [1.18, 0.42, -2.4], fov: 38 },
  { t: 38.6, p: [1.19, 0.85, -1.5], l: [1.18, 0.38, -2.3], fov: 37 },
  { t: 40.1, p: [1.18, 0.82, -1.62], l: [1.18, 0.36, -2.12], fov: 33 },
  // la fuentecita ya en el plato de la mesa para uno
  { t: 43.85, p: [0.05, 1.18, 0.35], l: [-0.08, 0.8, -0.45], fov: 36 },
  { t: 47.6, p: [-0.22, 1.05, 0.08], l: [-0.08, 0.8, -0.45], fov: 31 },
  // I · "That's what tonight is about": la mesa para uno entera, la silla vacía
  { t: 53.2, p: [2.0, 1.5, 1.45], l: [0.35, 0.8, -0.45], fov: 40 },
  { t: 55.9, p: [1.55, 1.38, 0.95], l: [0.35, 0.8, -0.45], fov: 38 },
  // la fuente de 9x13 de la iglesia se achica a UN plato
  { t: 61.4, p: [0.48, 1.32, 0.3], l: [0.4, 0.78, -0.45], fov: 34 },
  { t: 65.65, p: [0.02, 1.12, 0.12], l: [-0.06, 0.78, -0.45], fov: 31 },
  // K · las 10 fuentecitas en fila sobre la mesada; la 9 con el aro rojo
  { t: 71.5, p: [-1.55, 1.5, -1.95], l: [-2.72, 0.95, -1.3], fov: 40 },
  { t: 73.1, p: [-1.7, 1.38, 0.55], l: [-2.72, 0.95, 0.95], fov: 36, arc: 0.05 },
  { t: 76.0, p: [-2.02, 1.22, 0.75], l: [-2.72, 0.95, 0.94], fov: 30 },
  { t: 83.7, p: [-2.14, 1.16, 0.86], l: [-2.72, 0.95, 0.94], fov: 27 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.7) * 0.003; p.y += Math.sin(t * 0.93 + 1) * 0.0025;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 600); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ k: { p: THREE.Vector3; l: THREE.Vector3; fov: number } }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 600; c.updateProjectionMatrix();
  return null;
};

// ---------------- ESTADO (clavado a la voz) ----------------
export const state = (t: number) => {
  const fridge = inR(t, 5, 17.5) ? win(t, 6.05, 7.0) : 0;
  const night = t < 23.5 ? 0.55 : t < 27.4 ? 1 : 0;                     // 0 = tarde cálida · 1 = noche sola
  const warm = t >= 27.4 ? win(t, 27.6, 28.6) : 0;                       // "a different kitchen"
  const ovenLight = t >= 27.4 ? win(t, 27.7, 28.2) : 0;
  const door = inR(t, 36.9, 43.9) ? win(t, 37.0, 37.85) : 0;
  const dishOut = inR(t, 36.9, 43.9) ? ease((t - 38.85) / 1.15) : 0;
  const heat = inR(t, 37.2, 41.5) ? win(t, 37.3, 37.9) * (1 - win(t, 40.3, 41.3)) : 0;
  const plateDish = t >= 43.8;
  const bigPan = inR(t, 53, 66) ? 1 - ease((t - 62.2) / 0.85) : 0;       // 9x13 → 1 plato
  const row = t >= 71 && t < 90;
  const nine = row ? win(t, 73.0, 73.4) : 0;
  const rowDim = row ? win(t, 74.9, 75.6) : 0;
  return { fridge, night, warm, ovenLight, door, dishOut, heat, plateDish, bigPan, row, nine, rowDim };
};

// ---------------- ESCENAS del resto del video (Rest.tsx las arma por toma) ----------------
export type St = ReturnType<typeof state>;
export type Scene = {
  cam: { p: V3; l: V3; fov: number };
  st?: Partial<St>;
  kind?: number;                                                   // qué cena (1-10, 0 = genérica) en el horno / el plato
  book?: { open: number; page: string; turn?: number; from?: string };
  rowHi?: number;                                                  // fuentecita resaltada en la fila (1-10)
  list?: boolean;                                                  // la lista pegada en la puerta de la heladera
  fridgeFood?: boolean;
  dial?: number;                                                   // giro de la perilla del horno (0-1; 375° ≈ 0.67)                                            // heladera con las bolsitas planas y las fuentecitas en papel
};
const BASE: St = { fridge: 0, night: 1, warm: 1, ovenLight: 1, door: 0, dishOut: 0, heat: 0, plateDish: false, bigPan: 0, row: false, nine: 0, rowDim: 0 };
export const BOOK: V3 = [0.46, 0.762, -0.36];
const BW = 0.17, BD = 0.22, BT = 0.018;

// las páginas REALES del libro (public/lcf01/book_p###.jpg)
const PAGES = ["001", "011", "012", "018"];
const usePages = () => {
  const [h] = useState(() => delayRender("páginas del libro"));
  return useMemo(() => {
    let n = PAGES.length;
    const done = () => { n -= 1; if (n === 0) continueRender(h); };
    const L = new THREE.TextureLoader();
    return Object.fromEntries(PAGES.map((pg) => {
      const tx = L.load(staticFile(`ck2510d/book_p${pg}.jpg`), done, undefined, done);
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return [pg, tx];
    })) as Record<string, THREE.Texture>;
  }, [h]);
};

// ---------------- geometría ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, cast = true, map, rad = 0.015, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} />
  </mesh>
);
const Chrome: React.FC<{ p: V3; s: V3; rot?: V3 }> = ({ p, s, rot }) => <Box p={p} s={s} c="#e8ecf0" r={0.12} m={1} rad={Math.min(s[0], s[1], s[2]) / 2.2} rot={rot} />;

// partículas blandas
const Puffs: React.FC<{ pts: number[]; col: string; size: number; o: number; map?: Tx }> = ({ pts, col, size, o, map }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color={col} size={size} transparent opacity={o} depthWrite={false} map={map} alphaMap={map} sizeAttenuation /></points>;
};

// fuentecita ovalada de un plato: cazuelita de cerámica torneada + costra gratinada con relieve (bultos, ampollas tostadas)
const RAMEKIN = (() => {
  const pts = [[0, 0], [0.056, 0], [0.061, 0.003], [0.066, 0.012], [0.069, 0.04], [0.074, 0.047], [0.075, 0.051], [0.071, 0.052], [0.066, 0.047], [0.063, 0.006], [0, 0.006]].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();
const CRUST = (() => {
  const g = new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = 0.18 * Math.sin(x * 23 + z * 7) * Math.cos(z * 19 - x * 5) + 0.12 * Math.sin(x * 41 + 1.3) * Math.sin(z * 37);
    p.setY(i, y * (0.55 + 0.45 * y) + n * y * 0.6);
  }
  g.computeVertexNormals(); return g;
})();
export const Dish: React.FC<{ p: V3; t: number; s?: number; top?: string; bubble?: number; ry?: number; seed?: number; ring?: number; map?: Tx }> = ({ p, t, s = 1, top = "#ffffff", bubble = 1, ry = 0, seed = 0, ring = 0, map }) => {
  const bub = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ a: rnd(i + seed * 31, 1) * 6.28, r: 0.55 + rnd(i + seed * 31, 2) * 0.4, ph: rnd(i + seed * 31, 3) * 6.28, sp: 1.5 + rnd(i + seed * 31, 4) * 2.2 })), [seed]);
  return (
    <group position={p} rotation={[0, ry, 0]} scale={[s, s, s]}>
      <mesh geometry={RAMEKIN} castShadow receiveShadow scale={[1.4, 1, 1]}><meshStandardMaterial color="#f6f3ec" roughness={0.14} side={THREE.DoubleSide} /></mesh>
      {/* salsa que asoma en el borde */}
      <mesh position={[0, 0.043, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, 1, 1]}><ringGeometry args={[0.05, 0.067, 48]} /><meshStandardMaterial color="#b8641e" roughness={0.25} emissive="#6a2a04" emissiveIntensity={0.12} /></mesh>
      <mesh geometry={CRUST} position={[0, 0.041, 0]} scale={[0.064 * 1.4, 0.016, 0.064]} castShadow><meshStandardMaterial map={map} color={top} roughness={0.5} /></mesh>
      {/* burbujas en los bordes */}
      {bubble > 0.01 && bub.map((b, i) => {
        const k = Math.max(0, Math.sin(t * b.sp + b.ph)), rr = b.r;
        return <mesh key={i} position={[Math.cos(b.a) * rr * 0.064 * 1.4, 0.046 + 0.004 * (1 - rr), Math.sin(b.a) * rr * 0.064]} scale={[k * bubble, k * 0.75 * bubble, k * bubble]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color="#e9a64a" roughness={0.08} transparent opacity={0.9} /></mesh>;
      })}
      {ring > 0.01 && <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4 * (1 + 0.04 * Math.sin(t * 6)), 1 + 0.04 * Math.sin(t * 6), 1]}><ringGeometry args={[0.1, 0.11, 64]} /><meshBasicMaterial color="#ff3b30" transparent opacity={ring} toneMapped={false} /></mesh>}
    </group>
  );
};

// ck2510d · los 9 pasteles: fuente de vidrio torneada + repulgue "pinch, push, turn" + relleno y tapa propios de cada uno
// 1 pie plant (natilla rosada + enrejado) · 2 grosella (tapa con tajos) · 3 ground cherry (tapa) · 4 uva Concord (enrejado oscuro)
// 5 saúco (crumble) · 6 Bob Andy (natilla especiada, arriba esponjoso) · 7 lemon sponge (dorado esponjoso) · 8 water pie (lisa, brillante) · 9 mincemeat (tapa, oscuro por los tajos)
const PLATEG = (() => {
  const pts = [[0, 0], [0.078, 0], [0.084, 0.004], [0.098, 0.03], [0.112, 0.036], [0.114, 0.04], [0.108, 0.04], [0.095, 0.034], [0.081, 0.006], [0, 0.006]].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 64);
})();
const PIES: Record<number, { fill: string; top: "lattice" | "full" | "crumb" | "open" | "puff"; crust?: string }> = {
  0: { fill: "#c8873a", top: "full" }, 1: { fill: "#e79a95", top: "lattice" }, 2: { fill: "#d9c07a", top: "full" }, 3: { fill: "#e7b43c", top: "full" },
  4: { fill: "#3b0f35", top: "lattice" }, 5: { fill: "#3a1030", top: "crumb" }, 6: { fill: "#a8652c", top: "puff" }, 7: { fill: "#e8b450", top: "puff" },
  8: { fill: "#f0d48e", top: "open" }, 9: { fill: "#4a2412", top: "full", crust: "#d79c55" },
};
export const Pie: React.FC<{ k: number; p: V3; t: number; s?: number; bubble?: number; map?: Tx; ry?: number; ring?: number }> = ({ k, p, t, s = 1, bubble = 1, map, ry = 0, ring = 0 }) => {
  const P = PIES[k] ?? PIES[0], crust = P.crust ?? "#e2ad62", R = 0.094;
  return (
    <group position={p} rotation={[0, ry, 0]} scale={[s, s, s]}>
      <mesh geometry={PLATEG} castShadow receiveShadow><meshStandardMaterial color="#cfe0e4" roughness={0.06} metalness={0.1} transparent opacity={0.55} side={THREE.DoubleSide} /></mesh>
      {/* relleno */}
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[R - 0.004, 0.08, 0.026, 48]} /><meshStandardMaterial color={P.fill} roughness={P.top === "open" ? 0.12 : 0.35} emissive={P.fill} emissiveIntensity={0.05} /></mesh>
      {/* repulgue: 26 pellizcos alrededor del borde */}
      {Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2; return <mesh key={"cr" + i} position={[Math.cos(a) * (R + 0.006), 0.045, Math.sin(a) * (R + 0.006)]} rotation={[0, -a, 0]} scale={[0.6, 0.85, 1]} castShadow><sphereGeometry args={[0.013, 10, 8]} /><meshStandardMaterial color={crust} roughness={0.6} map={map} /></mesh>; })}
      {P.top === "full" && <>
        <mesh geometry={CRUST} position={[0, 0.043, 0]} scale={[R, 0.022, R]} castShadow><meshStandardMaterial color={crust} roughness={0.55} map={map} /></mesh>
        {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2 + 0.3; return <mesh key={"sl" + i} position={[Math.cos(a) * 0.03, 0.066, Math.sin(a) * 0.03]} rotation={[0, -a, 0]}><boxGeometry args={[0.028, 0.002, 0.004]} /><meshStandardMaterial color={P.fill} roughness={0.3} emissive={P.fill} emissiveIntensity={0.15 * bubble} /></mesh>; })}
      </>}
      {P.top === "lattice" && [-2, -1, 0, 1, 2].flatMap((i) => [0, 1].map((d) => (
        <mesh key={"lt" + i + d} position={[d ? i * 0.034 : 0, 0.047 + d * 0.003, d ? 0 : i * 0.034]} rotation={[0, d ? 0 : Math.PI / 2, 0]} castShadow><boxGeometry args={[0.016, 0.006, 2 * Math.sqrt(Math.max(0.0001, R * R - (i * 0.034) ** 2))]} /><meshStandardMaterial color={crust} roughness={0.55} map={map} /></mesh>
      )))}
      {P.top === "crumb" && Array.from({ length: 60 }, (_, i) => { const a = rnd(i, 21) * 6.283, r = Math.sqrt(rnd(i, 22)) * (R - 0.01); return <mesh key={"cb" + i} position={[Math.cos(a) * r, 0.046 + rnd(i, 23) * 0.006, Math.sin(a) * r]} scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.007 + rnd(i, 24) * 0.006, 8, 6]} /><meshStandardMaterial color={rnd(i, 25) > 0.3 ? "#b98a4a" : "#d7a85e"} roughness={0.8} /></mesh>; })}
      {P.top === "puff" && <mesh geometry={CRUST} position={[0, 0.04, 0]} scale={[R - 0.004, 0.014, R - 0.004]}><meshStandardMaterial color={P.fill} roughness={0.5} map={map} /></mesh>}
      {/* burbujas de jugo (frutas) */}
      {bubble > 0.01 && (P.top === "lattice" || P.top === "crumb") && Array.from({ length: 10 }, (_, i) => {
        const kk = Math.max(0, Math.sin(t * (1.6 + rnd(i, 4) * 2) + rnd(i, 3) * 6.28)), a = rnd(i, 1) * 6.283, r = 0.03 + rnd(i, 2) * 0.05;
        return <mesh key={"bb" + i} position={[Math.cos(a) * r, 0.05, Math.sin(a) * r]} scale={[kk * bubble, kk * 0.7 * bubble, kk * bubble]}><sphereGeometry args={[0.005, 10, 8]} /><meshStandardMaterial color={P.fill} roughness={0.05} /></mesh>;
      })}
      {ring > 0.01 && <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1 + 0.04 * Math.sin(t * 6), 1 + 0.04 * Math.sin(t * 6), 1]}><ringGeometry args={[0.13, 0.142, 64]} /><meshBasicMaterial color="#ff3b30" transparent opacity={ring} toneMapped={false} /></mesh>}
    </group>
  );
};
const DishK: React.FC<{ k: number; p: V3; t: number; s?: number; bubble?: number; map?: Tx; ry?: number }> = (pr) => <Pie {...pr} />;

// el libro "Supper for One" sobre la mesa: tapa con bisagra en el lomo, página derecha con la página REAL y una hoja que pasa
const Book: React.FC<{ open: number; page: THREE.Texture; cover: THREE.Texture; turn?: number; from?: THREE.Texture }> = ({ open, page, cover, turn = 0, from }) => (
  <group position={BOOK}>
    <Box p={[0, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />
    {open > 0.55 && <Box p={[-BW, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />}
    <mesh position={[0, BT + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={page} color="#e6e1d6" toneMapped={false} /></mesh>
    {turn > 0.001 && turn < 0.999 && from && (
      <group position={[-BW / 2, BT + 0.0016, 0]} rotation={[0, 0, turn * Math.PI]}>
        <mesh position={[BW / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={from} color="#e6e1d6" toneMapped={false} /></mesh>
        <mesh position={[BW / 2, -0.0004, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f4efe2" roughness={0.85} /></mesh>
      </group>
    )}
    <group position={[-BW / 2, BT + 0.002, 0]} rotation={[0, 0, open * Math.PI * 0.995]}>
      <Box p={[BW / 2, 0, 0]} s={[BW + 0.006, 0.004, BD + 0.006]} c="#4b2a6a" r={0.5} rad={0.0015} />
      <mesh position={[BW / 2, 0.0022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={cover} roughness={0.55} /></mesh>
      <mesh position={[BW / 2, -0.0022, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f4efe2" roughness={0.85} /></mesh>
    </group>
  </group>
);

// mantel con caída de verdad: un solo paño que se dobla en los bordes de la mesa y hace pliegues
const clothGeo = (w: number, d: number, drop: number) => {
  const g = new THREE.PlaneGeometry(w + 2 * drop, d + 2 * drop, 90, 60);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const ox = Math.max(0, Math.abs(x) - w / 2), oy = Math.max(0, Math.abs(y) - d / 2), o = Math.max(ox, oy);
    if (o <= 0) continue;
    const fold = 0.012 * Math.min(1, o / 0.08) * Math.sin((ox > oy ? y : x) * 46 + (ox > oy ? 1 : 2));
    const nx = ox > 0 ? Math.sign(x) * (w / 2 + 0.006 + (ox >= oy ? fold : 0)) : x;
    const ny = oy > 0 ? Math.sign(y) * (d / 2 + 0.006 + (oy > ox ? fold : 0)) : y;
    p.setX(i, nx); p.setY(i, ny); p.setZ(i, -o + 0.002);
  }
  g.computeVertexNormals(); return g;
};
const CLOTH = clothGeo(1.22, 0.77, 0.24);

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useKitTex = () => useMemo(() => ({
  // linóleo a cuadros rojo y crema, gastado
  lino: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = (r + c) % 2 ? "#e9e1cf" : "#9c3a32"; g.fillRect(c * 64, r * 64, 64, 64); }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(80,60,40,${0.06 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 3, 3); }
  }, [8, 8]),
  // pared pintada crema con zócalo de madera
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#efe9dc"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(160,140,110,${0.05 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 2 + rnd(i, 5) * 6, 0, 6.3); g.fill(); }
  }, [4, 2]),
  // cuadrillé amarillo de las cortinas
  gingham: mk(128, 128, (g) => {
    g.fillStyle = "#fbf3d2"; g.fillRect(0, 0, 128, 128);
    g.fillStyle = "rgba(232,190,40,.55)"; for (let k = 0; k < 8; k++) { g.fillRect(k * 16, 0, 8, 128); g.fillRect(0, k * 16, 128, 8); }
  }, [4, 6]),
  // el mantel del sótano de la iglesia: blanco gastado, puntilla y la crucecita roja bordada en una esquina
  cloth: mk(1024, 640, (g) => {
    g.fillStyle = "#f3efe4"; g.fillRect(0, 0, 1024, 640);
    for (let y = 0; y < 640; y += 3) { g.fillStyle = `rgba(190,180,160,${0.08 + 0.04 * rnd(y, 1)})`; g.fillRect(0, y, 1024, 1); }
    for (let x = 0; x < 1024; x += 3) { g.fillStyle = `rgba(190,180,160,${0.05})`; g.fillRect(x, 0, 1, 640); }
    // mancha vieja de café y un remiendo
    g.fillStyle = "rgba(170,130,80,.10)"; g.beginPath(); g.arc(300, 410, 26, 0, 6.3); g.fill();
    // borde de puntilla
    g.strokeStyle = "rgba(170,160,140,.6)"; g.lineWidth = 3; g.strokeRect(14, 14, 996, 612);
    for (let x = 20; x < 1010; x += 16) { g.beginPath(); g.arc(x, 14, 6, 0, Math.PI); g.stroke(); g.beginPath(); g.arc(x, 626, 6, Math.PI, 0); g.stroke(); }
    // cruz en punto cruz (esquina de adelante, a la izquierda)
    const cx = 190, cy = 480, u = 7;
    const st = (i: number, j: number) => { g.strokeStyle = "#a3171c"; g.lineWidth = 2.2; const x = cx + i * u, y = cy + j * u; g.beginPath(); g.moveTo(x, y); g.lineTo(x + u, y + u); g.moveTo(x + u, y); g.lineTo(x, y + u); g.stroke(); };
    for (let j = -6; j <= 7; j++) st(0, j);
    for (let i = -4; i <= 4; i++) if (i) st(i, -2);
  }),
  // costra gratinada: dorado con ampollas tostadas y queso más claro
  crust: mk(256, 256, (g) => {
    g.fillStyle = "#d9973c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { const r = 2 + rnd(i, 1) * 9; g.fillStyle = rnd(i, 2) > 0.55 ? `rgba(122,58,14,${0.35 + 0.4 * rnd(i, 3)})` : `rgba(245,200,110,${0.35 + 0.4 * rnd(i, 3)})`; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, r, r * (0.6 + rnd(i, 6) * 0.6), rnd(i, 7) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(70,30,8,${0.5 * rnd(i, 8)})`; g.beginPath(); g.arc(rnd(i, 9) * 256, rnd(i, 10) * 256, 1.5 + rnd(i, 11) * 3, 0, 6.3); g.fill(); }
  }),
  // lista a mano pegada en la heladera: renglones de garabatos (ilegibles) y algunos tachados
  list: mk(256, 352, (g) => {
    g.fillStyle = "#fbf8ee"; g.fillRect(0, 0, 256, 352);
    g.strokeStyle = "rgba(120,150,190,.35)"; g.lineWidth = 1; for (let y = 52; y < 352; y += 24) { g.beginPath(); g.moveTo(10, y); g.lineTo(246, y); g.stroke(); }
    for (let r = 0; r < 12; r++) {
      const y = 46 + r * 24, w = 90 + rnd(r, 1) * 120;
      g.strokeStyle = "#3a3a44"; g.lineWidth = 2; g.beginPath(); g.moveTo(22, y);
      for (let x = 22; x < 22 + w; x += 3) g.lineTo(x, y - 4 + Math.sin(x * 0.55 + r) * 3 + Math.sin(x * 1.7) * 1.5);
      g.stroke();
      if (r < 5) { g.strokeStyle = "#b02a24"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(16, y - 4); g.lineTo(30 + w, y - 6); g.stroke(); }
    }
  }),
  // reloj de pared
  clockFace: mk(256, 256, (g) => {
    g.fillStyle = "#fbf7ec"; g.beginPath(); g.arc(128, 128, 120, 0, 6.3); g.fill();
    g.fillStyle = "#1f1d1a";
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; g.save(); g.translate(128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100); g.rotate(a); g.fillRect(-3, -10, 6, k % 3 ? 14 : 22); g.restore(); }
  }),
  // papel aluminio arrugado
  foil: mk(256, 256, (g) => {
    g.fillStyle = "#b9bcc0"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 220; i++) { const v = 150 + rnd(i, 1) * 105; g.fillStyle = `rgba(${v},${v},${v + 4},.55)`; g.beginPath(); const x = rnd(i, 2) * 256, y = rnd(i, 3) * 256; g.moveTo(x, y); g.lineTo(x + 30 * (rnd(i, 4) - 0.5), y + 30 * (rnd(i, 5) - 0.5)); g.lineTo(x + 30 * (rnd(i, 6) - 0.5), y + 30 * (rnd(i, 7) - 0.5)); g.closePath(); g.fill(); }
  }),
  // ventana: noche/atardecer azul con la silueta del árbol
  dusk: mk(256, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#1a2a4a"); gr.addColorStop(0.7, "#46597e"); gr.addColorStop(1, "#8a7a78"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#121620"; g.fillRect(0, 210, 256, 46);
    g.strokeStyle = "#141820"; g.lineWidth = 6; g.beginPath(); g.moveTo(190, 256); g.lineTo(175, 120); g.lineTo(140, 70); g.moveTo(178, 140); g.lineTo(220, 90); g.stroke();
  }),
}), []);

// ---------------- LA ESCENA ----------------
export const KitchenWorld: React.FC<{ t: number; sc?: Scene }> = ({ t, sc }) => {
  const tx = useTextures(), kt = useKitTex(), pg = usePages();
  const S: St = sc ? { ...BASE, ...sc.st } : state(t);
  const hi = sc ? (sc.rowHi ?? 0) - 1 : 8;
  const warm = S.warm, dark = S.night * (1 - warm);
  // luz general: tarde gris → noche → cocina tibia
  const amb = lerp(0.5, 0.16, dark) + 0.05 * warm;
  const lampI = (t < 23.5 ? 0.5 : 0) + 1.15 * warm;
  const candle = warm * (0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 7.3));
  const ovenGlow = S.ovenLight * (1.6 + 0.12 * Math.sin(t * 5));
  // calor que sale del horno (ondas que suben y vienen a la cámara)
  const heatPts: number[] = [];
  if (S.heat > 0.01) for (let i = 0; i < 260; i++) { const ph = (t * (0.5 + rnd(i, 1) * 0.4) + rnd(i, 2)) % 1; heatPts.push(OVEN_DOOR.x + (rnd(i, 3) - 0.5) * 0.5 + Math.sin(ph * 6 + i) * 0.04, 0.5 + ph * 0.75, -2.35 + ph * 0.9 + (rnd(i, 4) - 0.5) * 0.2); }
  // vapor de la fuentecita (en el plato y en la mesada)
  const steamAt = (q: V3, n: number, o: number) => { const pts: number[] = []; for (let i = 0; i < n; i++) { const ph = (t * (0.22 + rnd(i, 5) * 0.15) + rnd(i, 6)) % 1; pts.push(q[0] + Math.sin(ph * 5 + i) * 0.02 * (1 + ph * 3), q[1] + 0.03 + ph * 0.35, q[2] + Math.cos(ph * 4 + i) * 0.02 * (1 + ph * 3)); } return <Puffs pts={pts} col="#f6f2ea" size={0.022} o={o} map={tx.flake} />; };
  const dishPos: V3 = [OVEN_DOOR.x, 0.345, lerp(-2.56, -2.08, S.dishOut)];
  const door = S.door;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam k={sc ? { p: v3(sc.cam.p), l: v3(sc.cam.l), fov: sc.cam.fov } : camAt(t)} />
      <Post bloom={0.22 + 0.12 * warm} threshold={0.92} exposure={lerp(0.92, 0.72, dark) - 0.08 * warm} env={lerp(0.28, 0.12, dark)} />
      <color attach="background" args={["#0d0f14"]} />
      <hemisphereLight args={["#e3e6ee", "#6b5a44", amb]} />
      {/* luz de la ventana (fría) */}
      <directionalLight position={[-0.3, 3.2, -6]} intensity={lerp(0.9, 0.25, dark) * (1 - 0.5 * warm)} color="#9fb3d8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-camera-far={20} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* lámpara colgante sobre la mesa */}
      <pointLight position={[0.35, 1.85, -0.45]} intensity={lampI} distance={5.5} color="#ffcf8f" decay={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[1.6, 2.2, 1.4]} intensity={0.45 + 0.15 * warm - 0.3 * dark} distance={7} color="#ffe6c4" decay={1.6} />
      {/* vela */}
      {candle > 0.01 && <pointLight position={[0.82, 0.98, -0.7]} intensity={candle * 0.9} distance={1.8} color="#ffb35a" decay={1.8} />}
      {/* horno: luz de adentro + la que sale por la puerta */}
      {ovenGlow > 0.01 && <pointLight position={[OVEN_DOOR.x, 0.42, -2.6]} intensity={ovenGlow * (0.35 + 1.0 * door)} distance={2.2} color="#ff9a3c" decay={1.7} />}
      {S.fridge > 0.02 && <pointLight position={[-2.15, 1.3, -2.45]} intensity={S.fridge * 2.2} distance={2.2} color="#eaf4ff" decay={1.8} />}

      {/* piso y paredes (maqueta en corte: pared del fondo + la izquierda) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow><planeGeometry args={[7, 6]} /><meshStandardMaterial map={kt.lino} roughness={0.55} /></mesh>
      <mesh position={[0, 1.3, -3]} receiveShadow><planeGeometry args={[7, 2.6]} /><meshStandardMaterial map={kt.wall} roughness={0.95} /></mesh>
      <mesh position={[-3.05, 1.3, -0.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[6, 2.6]} /><meshStandardMaterial map={kt.wall} roughness={0.95} /></mesh>
      <Box p={[0, 0.06, -2.985]} s={[7, 0.12, 0.03]} c="#6a4a2c" r={0.7} />
      <Box p={[-3.035, 0.06, -0.5]} s={[0.03, 0.12, 6]} c="#6a4a2c" r={0.7} />
      {/* cantos claros del corte */}
      <Box p={[3.5, 1.3, -3]} s={[0.04, 2.6, 0.08]} c="#efe6d4" r={1} />
      <Box p={[-3.05, 1.3, 2.5]} s={[0.08, 2.6, 0.04]} c="#efe6d4" r={1} />

      {/* ventana sobre la pileta, cortinas de cuadrillé amarillo */}
      <mesh position={[-0.2, 1.62, -2.975]}><planeGeometry args={[0.95, 0.8]} /><meshStandardMaterial map={kt.dusk} emissiveMap={kt.dusk} emissive="#ffffff" emissiveIntensity={lerp(0.9, 0.45, dark)} roughness={0.2} /></mesh>
      {[[-0.2, 1.22], [-0.2, 2.02]].map(([x, y], i) => <Box key={"wf" + i} p={[x, y, -2.96]} s={[1.05, 0.05, 0.05]} c="#f4efe4" />)}
      {[-0.7, 0.3].map((x, i) => <Box key={"wv" + i} p={[x, 1.62, -2.96]} s={[0.05, 0.85, 0.05]} c="#f4efe4" />)}
      <Box p={[-0.2, 1.62, -2.96]} s={[0.025, 0.8, 0.03]} c="#f4efe4" />
      {[-0.68, 0.28].map((x, i) => <mesh key={"cu" + i} position={[x, 1.68, -2.92]}><boxGeometry args={[0.28, 0.72, 0.02]} /><meshStandardMaterial map={kt.gingham} roughness={0.9} /></mesh>)}
      <Box p={[-0.2, 2.08, -2.92]} s={[1.2, 0.18, 0.03]} c="#fbf3d2" map={kt.gingham} />

      {/* mesada con la pileta */}
      <Box p={[-0.2, 0.44, -2.68]} s={[1.5, 0.88, 0.6]} c="#f2eee6" r={0.5} />
      <Box p={[-0.2, 0.9, -2.68]} s={[1.56, 0.04, 0.64]} c="#d9d2c4" r={0.35} />
      <mesh position={[-0.2, 0.905, -2.66]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.4]} /><meshStandardMaterial color="#c9ccd0" roughness={0.2} metalness={0.7} /></mesh>
      <Chrome p={[-0.2, 1.05, -2.92]} s={[0.03, 0.3, 0.03]} />
      <Chrome p={[-0.2, 1.18, -2.84]} s={[0.025, 0.025, 0.18]} />

      {/* reloj de pared: las 4:50 (segundero que avanza) */}
      <group position={CLOCK}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.035, 48]} /><meshStandardMaterial color="#b3261e" roughness={0.35} /></mesh>
        <mesh position={[0, 0, 0.019]}><circleGeometry args={[0.15, 48]} /><meshStandardMaterial map={kt.clockFace} roughness={0.6} /></mesh>
        {/* hora (4:50 → 145°), minutos (300°), segundero */}
        <mesh position={[0, 0, 0.024]} rotation={[0, 0, -((4 + 50 / 60) / 12) * Math.PI * 2]}><mesh position={[0, 0.045, 0]}><boxGeometry args={[0.012, 0.09, 0.003]} /><meshStandardMaterial color="#1a1a1a" /></mesh></mesh>
        <mesh position={[0, 0, 0.027]} rotation={[0, 0, -((50 + t / 60) / 60) * Math.PI * 2]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.008, 0.125, 0.003]} /><meshStandardMaterial color="#1a1a1a" /></mesh></mesh>
        <mesh position={[0, 0, 0.03]} rotation={[0, 0, -(Math.floor(t) / 60) * Math.PI * 2 - 0.3]}><mesh position={[0, 0.055, 0]}><boxGeometry args={[0.003, 0.13, 0.002]} /><meshStandardMaterial color="#b3261e" /></mesh></mesh>
      </group>
      {/* crucecita de madera en la pared */}
      <group position={[2.35, 1.72, -2.97]}>
        <Box p={[0, 0, 0]} s={[0.04, 0.3, 0.025]} c="#5a3a20" r={0.6} />
        <Box p={[0, 0.06, 0]} s={[0.18, 0.04, 0.025]} c="#5a3a20" r={0.6} />
      </group>
      {/* repisa con frascos */}
      <Box p={[1.35, 1.62, -2.88]} s={[1.0, 0.03, 0.2]} c="#7a5634" r={0.7} />
      {[0, 1, 2].map((i) => <mesh key={"jr" + i} position={[1.0 + i * 0.32, 1.72, -2.88]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.16, 20]} /><meshStandardMaterial color={["#c99a4a", "#e9e1cc", "#9a3b26"][i]} roughness={0.15} transparent opacity={0.85} /></mesh>)}

      {/* HELADERA redondeada de los 50 (bisagra a la izquierda) */}
      <group position={FRIDGE}>
        {/* gabinete HUECO: fondo, costados, techo y piso (se ve el interior al abrir) */}
        <Box p={[0, 0.81, -0.33]} s={[0.78, 1.62, 0.04]} c="#f3f1ea" r={0.25} rad={0.015} />
        {[-0.37, 0.37].map((x, i) => <Box key={"fs" + i} p={[x, 0.81, 0]} s={[0.04, 1.62, 0.7]} c="#f3f1ea" r={0.25} rad={0.015} />)}
        <Box p={[0, 1.6, 0]} s={[0.78, 0.06, 0.7]} c="#f3f1ea" r={0.25} rad={0.03} />
        <Box p={[0, 0.06, 0]} s={[0.78, 0.12, 0.7]} c="#e9e6dd" r={0.3} rad={0.015} />
        {/* interior esmaltado + congelador chiquito arriba */}
        <mesh position={[0, 0.81, -0.305]}><planeGeometry args={[0.7, 1.5]} /><meshStandardMaterial color="#eef3f6" roughness={0.35} emissive="#dfeeff" emissiveIntensity={0.25 * S.fridge} /></mesh>
        <Box p={[0, 1.42, -0.02]} s={[0.66, 0.24, 0.58]} c="#dfe5e8" r={0.3} m={0.2} />
        {[0.55, 0.95].map((y, i) => <Box key={"sh" + i} p={[0, y, 0]} s={[0.68, 0.012, 0.6]} c="#d6dde2" r={0.15} m={0.5} />)}
        <mesh position={[-0.2, 0.62, 0.02]}><cylinderGeometry args={[0.045, 0.045, 0.13, 16]} /><meshStandardMaterial color="#f7f7f2" roughness={0.3} /></mesh>
        <mesh position={[0.22, 0.6, -0.05]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.16, 16]} /><meshStandardMaterial color="#e8c84a" roughness={0.5} /></mesh>
        {/* las bolsitas planas de carne (un cuarto de libra) y fuentecitas en papel: "every supper starts in your freezer" */}
        {sc?.fridgeFood && [0.578, 0.978].map((y, r) => [-0.2, 0, 0.2].map((x, c) => (
          <group key={"bg" + r + c} position={[x, y + 0.012 * (c % 2), 0.02 + 0.06 * ((r + c) % 2)]} rotation={[0, 0.12 * (c - 1), 0]}>
            {r === 0 ? <><Box p={[0, 0.008, 0]} s={[0.15, 0.016, 0.12]} c="#a83a2c" r={0.5} rad={0.004} /><mesh position={[0, 0.0175, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.13]} /><meshStandardMaterial color="#eef4f8" roughness={0.08} transparent opacity={0.35} /></mesh></>
              : <Box p={[0, 0.03, 0]} s={[0.17, 0.06, 0.13]} c="#e6e9ec" r={0.3} m={0.75} map={kt.foil} rad={0.01} />}
          </group>
        )))}
        {/* la fuente del funeral, en papel aluminio, para 12 */}
        {!sc?.fridgeFood && <group position={[0, 0.995, 0.02]}>
          <Box p={[0, 0, 0]} s={[0.36, 0.07, 0.26]} c="#e6e9ec" r={0.3} m={0.75} map={kt.foil} rad={0.01} />
          <Box p={[0, 0.04, 0]} s={[0.375, 0.02, 0.275]} c="#f4f6f8" r={0.22} m={0.8} map={kt.foil} rad={0.008} />
        </group>}
        {/* puerta */}
        <group position={[-0.39, 0, 0.36]} rotation={[0, -S.fridge * 1.9, 0]}>
          <Box p={[0.39, 0.81, 0.02]} s={[0.78, 1.58, 0.06]} c="#f6f4ee" r={0.22} rad={0.05} />
          <Chrome p={[0.7, 1.05, 0.08]} s={[0.04, 0.28, 0.04]} />
          {sc?.list && <><mesh position={[0.3, 1.0, 0.053]}><planeGeometry args={[0.17, 0.235]} /><meshStandardMaterial map={kt.list} roughness={0.9} /></mesh>
            <mesh position={[0.3, 1.115, 0.054]} rotation={[0, 0, 0.06]}><planeGeometry args={[0.07, 0.02]} /><meshStandardMaterial color="#e9dfb8" roughness={0.6} transparent opacity={0.85} /></mesh></>}
        </group>
      </group>

      {/* COCINA esmaltada blanca de los 50: el HORNO es el portal */}
      <group position={RANGE}>
        <Box p={[0.305, 0.46, 0]} s={[0.39, 0.92, 0.66]} c="#f5f3ee" r={0.18} rad={0.02} />
        <Box p={[-0.475, 0.46, 0]} s={[0.05, 0.92, 0.66]} c="#f5f3ee" r={0.18} rad={0.015} />
        <Box p={[-0.195, 0.79, 0]} s={[0.61, 0.26, 0.66]} c="#f5f3ee" r={0.18} rad={0.015} />
        <Box p={[-0.195, 0.08, 0]} s={[0.61, 0.16, 0.66]} c="#f5f3ee" r={0.18} rad={0.015} />
        <Box p={[-0.195, 0.41, -0.31]} s={[0.61, 0.52, 0.04]} c="#f5f3ee" r={0.18} rad={0.01} />
        <Box p={[0, 0.94, 0]} s={[1.02, 0.04, 0.68]} c="#f8f6f1" r={0.15} />
        {[-0.25, 0.25].map((x) => [-0.15, 0.12].map((z) => <mesh key={x + "" + z} position={[x, 0.97, z]}><cylinderGeometry args={[0.08, 0.08, 0.015, 20]} /><meshStandardMaterial color="#26272a" roughness={0.5} /></mesh>))}
        {/* respaldo con las perillas */}
        <Box p={[0, 1.12, -0.3]} s={[1.0, 0.32, 0.08]} c="#f5f3ee" r={0.2} rad={0.03} />
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (sc?.dial !== undefined && i === 1 ? null : <Chrome key={"k" + i} p={[x, 1.02, 0.34]} s={[0.05, 0.05, 0.03]} />))}
        {/* la perilla del horno que gira (escena "dial"): marcas alrededor y la raya roja del índice */}
        {sc?.dial !== undefined && <group position={[-0.1, 1.02, 0.34]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.034, 0.036, 0.034, 32]} /><meshStandardMaterial color="#d9dadc" metalness={0.85} roughness={0.22} /></mesh>
          {Array.from({ length: 9 }, (_, j) => { const an = Math.PI * (0.5 - j * 0.1875); return <mesh key={"tk" + j} position={[Math.cos(an) * 0.052, Math.sin(an) * 0.052, -0.016]}><boxGeometry args={[0.004, 0.004, 0.002]} /><meshStandardMaterial color={j === 4 ? "#b3261e" : "#55565a"} /></mesh>; })}
          <group rotation={[0, 0, -sc.dial * Math.PI * 1.125]}>
            <Box p={[0, 0, 0.022]} s={[0.012, 0.06, 0.012]} c="#c9cacc" m={0.85} r={0.25} rad={0.004} />
            <mesh position={[0, 0.02, 0.0285]}><boxGeometry args={[0.004, 0.018, 0.001]} /><meshStandardMaterial color="#b3261e" /></mesh>
          </group>
        </group>}
        {/* cajón de la derecha */}
        <Box p={[0.27, 0.42, 0.335]} s={[0.4, 0.5, 0.02]} c="#f8f6f1" r={0.16} />
        <Chrome p={[0.27, 0.6, 0.355]} s={[0.22, 0.03, 0.03]} />
        {/* boca del horno (adentro, oscuro y anaranjado) */}
        <mesh position={[OVEN_DOOR.x - RANGE[0], 0.41, 0.02]}><boxGeometry args={[0.54, 0.48, 0.6]} /><meshStandardMaterial color="#2a1a10" emissive="#ff7a1e" emissiveIntensity={0.3 * S.ovenLight} side={THREE.BackSide} roughness={0.8} /></mesh>
        
        {S.ovenLight > 0.01 && <mesh position={[OVEN_DOOR.x - RANGE[0], 0.62, -0.1]}><torusGeometry args={[0.16, 0.006, 8, 40]} /><meshBasicMaterial color="#ff6a1a" toneMapped={false} transparent opacity={S.ovenLight} /></mesh>}
      </group>
      {/* puerta del horno (bisagra abajo) con ventanita que brilla */}
      <group position={[OVEN_DOOR.x, OVEN_DOOR.y0, OVEN_DOOR.z]} rotation={[door * 1.45, 0, 0]}>
        <Box p={[0, 0.087, 0.012]} s={[OVEN_DOOR.w, 0.174, 0.03]} c="#f8f6f1" r={0.16} rad={0.01} />
        <Box p={[0, OVEN_DOOR.h - 0.07, 0.012]} s={[OVEN_DOOR.w, 0.14, 0.03]} c="#f8f6f1" r={0.16} rad={0.01} />
        {[-1, 1].map((k) => <Box key={"dj" + k} p={[k * (OVEN_DOOR.w / 2 - 0.055), OVEN_DOOR.h * 0.55, 0.012]} s={[0.11, 0.22, 0.03]} c="#f8f6f1" r={0.16} rad={0.008} />)}
        <mesh position={[0, OVEN_DOOR.h * 0.55, 0.02]}><planeGeometry args={[0.34, 0.2]} /><meshStandardMaterial color="#20140c" transparent opacity={0.42 - 0.12 * S.ovenLight} emissive="#ff8a2a" emissiveIntensity={0.08 * S.ovenLight} roughness={0.05} metalness={0.2} depthWrite={false} /></mesh>
        <Chrome p={[0, OVEN_DOOR.h - 0.05, 0.05]} s={[0.38, 0.03, 0.03]} />
      </group>
      {/* la fuentecita: adentro del horno, después sale */}
      {(sc ? sc.kind !== undefined && !S.plateDish : t < 43.9 && t >= 27) && <DishK k={sc?.kind ?? 0} p={dishPos} t={t} bubble={S.ovenLight} map={kt.crust} />}
      <group position={[OVEN_DOOR.x, 0.338, dishPos[2]]}>
        {Array.from({ length: 9 }, (_, i) => <Chrome key={"rk" + i} p={[-0.22 + i * 0.055, 0, 0]} s={[0.006, 0.006, 0.4]} />)}
        {[-0.19, 0, 0.19].map((z, i) => <Chrome key={"rz" + i} p={[0, 0.002, z]} s={[0.48, 0.006, 0.006]} />)}
      </group>
      {S.heat > 0.01 && <Puffs pts={heatPts} col="#ffe2bc" size={0.16} o={0.09 * S.heat} map={tx.flake} />}

      {/* MESA PARA UNO con el mantel de la iglesia */}
      <group>
        {[[-0.18, -0.75], [0.88, -0.75], [-0.18, -0.15], [0.88, -0.15]].map(([x, z], i) => <Box key={"tl" + i} p={[x, 0.37, z]} s={[0.05, 0.74, 0.05]} c="#6e4a2a" r={0.6} />)}
        <Box p={[TABLE[0], 0.745, TABLE[2]]} s={[1.2, 0.03, 0.75]} c="#7a5434" r={0.6} />
        {/* mantel del sótano de la iglesia: un paño con caída y pliegues */}
        <mesh geometry={CLOTH} position={[TABLE[0], 0.762, TABLE[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow><meshStandardMaterial map={kt.cloth} roughness={0.92} side={THREE.DoubleSide} /></mesh>
        {/* UN plato, UN vaso de leche, la vela */}
        <mesh position={PLATE} receiveShadow castShadow><cylinderGeometry args={[0.13, 0.11, 0.015, 48]} /><meshStandardMaterial color="#f7f4ec" roughness={0.18} /></mesh>
        <mesh position={[PLATE[0], PLATE[1] + 0.0085, PLATE[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.1, 0.108, 48]} /><meshStandardMaterial color="#5f86b8" roughness={0.3} /></mesh>
        <Chrome p={[PLATE[0] + 0.17, 0.772, PLATE[2] + 0.02]} s={[0.018, 0.006, 0.19]} />
        <mesh position={[PLATE[0] + 0.05, 0.83, PLATE[2] - 0.2]} castShadow><cylinderGeometry args={[0.035, 0.03, 0.12, 24]} /><meshStandardMaterial color="#f8f8f6" roughness={0.1} transparent opacity={0.92} /></mesh>
        <mesh position={[0.82, 0.85, -0.7]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.16, 16]} /><meshStandardMaterial color="#f3ead6" roughness={0.6} /></mesh>
        <mesh position={[0.82, 0.775, -0.7]}><cylinderGeometry args={[0.04, 0.045, 0.02, 24]} /><meshStandardMaterial color="#b8a27a" roughness={0.3} metalness={0.7} /></mesh>
        {candle > 0.01 && <mesh position={[0.82, 0.95 + 0.002 * Math.sin(t * 17), -0.7]} scale={[1, 1.9, 1]}><sphereGeometry args={[0.011, 12, 10]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>}
        {/* la cena en el plato */}
        {S.plateDish && <DishK k={sc?.kind ?? 0} p={[PLATE[0], 0.785, PLATE[2]]} t={t} s={0.95} bubble={0.8} ry={0.3} map={kt.crust} />}
        {S.plateDish && (sc || t < 53) && steamAt([PLATE[0], 0.83, PLATE[2]], 120, 0.18)}
        {/* la fuente de 9x13 de la iglesia → se achica a una porción */}
        {S.bigPan > 0.01 && (
          <group position={PT.bigPan} scale={[lerp(0.42, 1, S.bigPan), lerp(0.8, 1, S.bigPan), lerp(0.42, 1, S.bigPan)]}>
            <Box p={[0, 0, 0]} s={[0.44, 0.07, 0.3]} c="#b4b7bb" r={0.3} m={0.85} rad={0.012} />
            <Box p={[0, 0.03, 0]} s={[0.41, 0.02, 0.27]} c="#d29039" r={0.55} rad={0.006} />
          </group>
        )}
        {sc?.book && <Book open={sc.book.open} page={pg[sc.book.page]} cover={pg["001"]} turn={sc.book.turn} from={sc.book.from ? pg[sc.book.from] : undefined} />}
        {/* sillas: la de ella y la de Harold (vacía, al fondo) */}
        {[[-0.48, 0], [1.2, Math.PI]].map(([x, ry], i) => (
          <group key={"ch" + i} position={[x, 0, -0.45]} rotation={[0, ry, 0]}>
            <Box p={[0, 0.45, 0]} s={[0.42, 0.04, 0.42]} c="#7b5232" r={0.55} />
            {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([a, b], j) => <Box key={j} p={[a, 0.22, b]} s={[0.035, 0.45, 0.035]} c="#6b452a" r={0.6} />)}
            <Box p={[-0.19, 0.72, 0]} s={[0.035, 0.52, 0.42]} c="#6b452a" r={0.6} />
            {[0.58, 0.72, 0.86].map((y, j) => <Box key={"sl" + j} p={[-0.19, y, 0]} s={[0.03, 0.05, 0.38]} c="#7b5232" r={0.55} />)}
          </group>
        ))}
      </group>
      {/* lámpara colgante */}
      <mesh position={[0.35, 2.3, -0.45]}><cylinderGeometry args={[0.004, 0.004, 0.6, 6]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0.35, 1.95, -0.45]}><coneGeometry args={[0.2, 0.16, 32, 1, true]} /><meshStandardMaterial color="#e9dfc6" roughness={0.6} side={THREE.DoubleSide} emissive="#ffcf8f" emissiveIntensity={0.25 * warm} /></mesh>
      <mesh position={[0.35, 1.9, -0.45]}><sphereGeometry args={[0.04, 16, 12]} /><meshBasicMaterial color={warm > 0.1 ? "#fff1cf" : "#8a8478"} toneMapped={false} /></mesh>

      {/* mesada larga contra la pared izquierda: las 10 fuentecitas (la 9 con el aro rojo) */}
      <Box p={[-2.72, 0.45, -0.1]} s={[0.6, 0.9, 3.4]} c="#f2eee6" r={0.5} />
      <Box p={[-2.72, 0.905, -0.1]} s={[0.64, 0.04, 3.44]} c="#ece3cf" r={0.32} />
      <Chrome p={[-2.4, 0.905, -0.1]} s={[0.012, 0.042, 3.44]} />
      {!S.row && [0, 1, 2].map((i) => <mesh key={"can" + i} position={[-2.86, 1.0 + i * 0.015, 1.3 - i * 0.2]} castShadow><cylinderGeometry args={[0.07 - i * 0.012, 0.07 - i * 0.012, 0.16 + i * 0.03, 28]} /><meshStandardMaterial color="#c43a2e" roughness={0.3} metalness={0.4} /></mesh>)}
      {[0, 1, 2, 3].map((i) => <Box key={"cab" + i} p={[-2.415, 0.45, -1.5 + i * 0.85]} s={[0.02, 0.78, 0.8]} c="#f6f3ec" r={0.4} />)}
      {S.row && Array.from({ length: 9 }, (_, i) => (
        <Pie key={"r" + i} k={i + 1} p={DISH_ROW(i)} t={t} s={1.05} bubble={i === hi ? 1 : 1 - 0.7 * S.rowDim} map={kt.crust} ring={sc ? (i === hi ? 1 : 0) : 0} ry={0.15 * (rnd(i, 9) - 0.5)} />
      ))}
    </ThreeCanvas>
  );
};
