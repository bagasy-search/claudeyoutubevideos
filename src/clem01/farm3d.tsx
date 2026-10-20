// clem01 · EL MUNDO: la casa de granja de Clem en corte, sola entre trigales de Kansas (granero, gallinero, camino de ripio).
// Una sola escena y UNA cámara que vuela: del mueble bajo la pileta (6 rociadores químicos) a la alacena con EL frasco
// (vinagre + romero que pasa de agua clara a miel oscura en 2 semanas, en time-lapse), y después a cada uso:
// mesa, ventana del oeste, heladera, olla, hormigas, canilla con sarro, tacho, gallinero, yuyos del camino.
// Eventos clavados a la voz (segundos globales tomados de caps.json). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const inR = (t: number, a: number, b: number) => t >= a && t < b;

// ---------------- CÁMARA: keyframes [t, pos, look, fov]; cúbica + arco en los vuelos largos ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number };
const JAR: [number, number, number] = [-0.35, 0.785, -0.45];   // frasco sobre la mesa
const SHELF: [number, number, number] = [-3.1, 1.405, -2.72];  // frasco en la alacena
export const KEYS: Key[] = [
  // A→B · el mueble bajo la pileta se abre: 6 rociadores y el vaho químico
  { t: 4.4, p: [0.45, 0.66, -0.55], l: [0.45, 0.45, -2.4], fov: 38 },
  { t: 5.7, p: [0.45, 0.56, -1.15], l: [0.45, 0.36, -2.62], fov: 36 },
  { t: 13.7, p: [0.52, 0.47, -1.62], l: [0.45, 0.3, -2.7], fov: 33 },
  // D · "$40 a month walking out the door": los rociadores se van caminando por la puerta de atrás
  { t: 17.15, p: [1.4, 2.35, 0.6], l: [-0.6, 0.15, -1.9], fov: 42 },
  { t: 21.3, p: [-0.9, 2.25, 0.7], l: [-3.6, 0.15, -0.7], fov: 42 },
  // E · "picture a different cabinet": vuelo a la alacena, UN frasco; time-lapse de 2 semanas
  { t: 22.9, p: [-3.05, 1.52, -1.6], l: [SHELF[0], 1.43, -2.75], fov: 32, arc: 0.15 },
  { t: 30.7, p: [-3.09, 1.49, -2.2], l: [SHELF[0], 1.46, -2.75], fov: 28 },
  // H · "My name is Clem...": del frasco en la mesa, sube por el techo hasta el aire: la granja entre trigales
  { t: 41.75, p: [-0.05, 1.02, 0.3], l: [JAR[0], 0.88, JAR[2]], fov: 32 },
  { t: 43.0, p: [0.7, 1.5, 3.4], l: [-0.4, 0.9, -0.5], fov: 38 },
  { t: 45.8, p: [17, 19, 27], l: [-3, 0, -4], fov: 42, arc: 1.2 },
  { t: 48.5, p: [15, 16.5, 23], l: [-4, 0, -5], fov: 42 },
  // ===== RESTO =====
  // "First, the jar": órbita al frasco vacío
  { t: 73.4, p: [0.12, 1.0, 0.22], l: [JAR[0], 0.86, JAR[2]], fov: 30 },
  { t: 75.0, p: [-0.85, 1.0, 0.2], l: [JAR[0], 0.86, JAR[2]], fov: 30 },
  // "That smell is the oil inside the needles": macro de las ramitas en el frasco vacío
  { t: 124.7, p: [0.0, 1.0, -0.05], l: [JAR[0], 0.87, JAR[2]], fov: 28 },
  { t: 131.3, p: [-0.12, 0.95, -0.18], l: [JAR[0], 0.87, JAR[2]], fov: 28 },
  // "The hardest part. You wait."
  { t: 161.0, p: [0.3, 1.12, 0.3], l: [JAR[0], 0.88, JAR[2]], fov: 32 },
  { t: 163.7, p: [0.0, 1.0, -0.05], l: [JAR[0], 0.87, JAR[2]], fov: 28 },
  // time-lapse en la alacena (2 semanas) y la tapa que se abre
  { t: 170.7, p: [-3.05, 1.5, -1.3], l: [SHELF[0], 1.43, -2.75], fov: 30 },
  { t: 181.8, p: [-3.09, 1.48, -2.2], l: [SHELF[0], 1.45, -2.75], fov: 27 },
  { t: 183.4, p: [-2.85, 1.66, -1.2], l: [SHELF[0], 1.55, -2.75], fov: 33 },
  // "Two weeks, not one": dos frascos en la mesa
  { t: 188.9, p: [-0.55, 1.03, 0.32], l: [-0.55, 0.87, JAR[2]], fov: 30 },
  { t: 195.1, p: [-0.55, 0.98, 0.12], l: [-0.55, 0.87, JAR[2]], fov: 28 },
  // "It keeps for a year in the cupboard"
  { t: 203.7, p: [-3.0, 1.55, -1.45], l: [SHELF[0], 1.44, -2.75], fov: 31 },
  { t: 205.95, p: [-3.06, 1.5, -1.7], l: [SHELF[0], 1.44, -2.75], fov: 29 },
  // USO 1 · la mesa
  { t: 215.85, p: [-2.6, 1.7, -0.9], l: [-3.1, 1.3, -2.7], fov: 34 },
  { t: 217.1, p: [0.9, 1.45, 0.95], l: [-0.4, 0.8, -0.4], fov: 36, arc: 0.25 },
  // USO 2 · la ventana del oeste con el polvo de la cosecha
  { t: 243.4, p: [0.9, 1.45, 0.95], l: [-0.4, 0.8, -0.4], fov: 36 },
  { t: 245.0, p: [2.3, 1.55, -0.35], l: [4.0, 1.55, -0.5], fov: 38, arc: 0.15 },
  { t: 246.8, p: [2.75, 1.55, -0.45], l: [4.0, 1.55, -0.5], fov: 36 },
  // USO 3 · la heladera
  { t: 266.9, p: [1.3, 1.45, 0.6], l: [3.4, 1.0, -2.4], fov: 36 },
  { t: 268.1, p: [2.25, 1.3, -0.65], l: [3.35, 0.95, -2.55], fov: 34 },
  // USO 4 · la olla
  { t: 287.9, p: [1.1, 1.55, -0.55], l: [1.8, 1.0, -2.68], fov: 34 },
  { t: 289.8, p: [1.6, 1.3, -1.55], l: [1.8, 1.02, -2.68], fov: 32 },
  // USO 5 · hormigas
  { t: 309.8, p: [1.7, 1.4, -1.3], l: [1.25, 0.93, -2.72], fov: 32 },
  { t: 315.3, p: [1.32, 1.1, -2.05], l: [1.2, 0.93, -2.74], fov: 28 },
  // USO 7 · la canilla con sarro
  { t: 353.8, p: [0.45, 1.38, -1.55], l: [0.45, 1.0, -2.86], fov: 32 },
  { t: 361.3, p: [0.52, 1.16, -2.2], l: [0.45, 1.0, -2.86], fov: 27 },
  // USO 8 · el tacho
  { t: 377.1, p: [1.7, 1.35, 2.7], l: [3.4, 0.5, 1.1], fov: 36 },
  { t: 381.8, p: [2.55, 1.2, 2.25], l: [3.4, 0.55, 1.1], fov: 32 },
  // USO 9 · el gallinero
  { t: 396.9, p: [-4.5, 2.6, 3.2], l: [-9, 0.5, -3.5], fov: 40 },
  { t: 398.3, p: [-7.3, 1.2, -1.2], l: [-9, 0.4, -3.4], fov: 36 },
  // USO 10 · los yuyos del camino (y la huerta que NO se toca)
  { t: 434.9, p: [-5.2, 2.3, 7.0], l: [-8.2, 0, 3.0], fov: 40 },
  { t: 441.2, p: [-6.4, 1.65, 5.8], l: [-8.6, 0, 3.0], fov: 36 },
  // errores · la cocina entera (con el ácido encima)
  { t: 441.25, p: [2.6, 1.75, 1.95], l: [-0.5, 0.8, -1.5], fov: 42 },
  { t: 446.8, p: [2.1, 1.65, 1.6], l: [-0.6, 0.8, -1.5], fov: 40 },
  // error 2 · la lavandina (el rociador blanco) bajo la pileta
  { t: 468.9, p: [1.2, 0.9, -1.0], l: [0.45, 0.35, -2.6], fov: 36 },
  { t: 477.4, p: [0.75, 0.6, -1.45], l: [0.5, 0.3, -2.65], fov: 32 },
  // cuentas · los rociadores de vuelta bajo la pileta
  { t: 503.6, p: [0.45, 0.62, -0.95], l: [0.45, 0.4, -2.5], fov: 36 },
  { t: 511.3, p: [0.48, 0.55, -1.35], l: [0.45, 0.33, -2.65], fov: 34 },
  // el frasco al atardecer y la casa que se aleja entre el trigo
  { t: 515.1, p: [0.3, 1.05, 0.4], l: [JAR[0], 0.87, JAR[2]], fov: 30 },
  { t: 521.0, p: [-0.15, 1.12, 0.55], l: [JAR[0], 0.88, JAR[2]], fov: 32 },
  { t: 526.6, p: [6, 6, 14], l: [-0.5, 0.8, -0.5], fov: 40, arc: 0.8 },
  // cierre · la granja entera al atardecer, la cámara se va subiendo
  { t: 545.6, p: [9, 5, 16], l: [-2, 1, -2], fov: 40 },
  { t: 549, p: [22, 17, 34], l: [-4, 0, -5], fov: 42 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de mano (nunca quieta del todo)
  p.x += Math.sin(t * 0.7) * 0.004; p.y += Math.sin(t * 0.93 + 1) * 0.003;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 600); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
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
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 600; c.updateProjectionMatrix();
  return null;
};

// ---------------- ESTADO DEL FRASCO (clavado a la voz) ----------------
// c: 0 agua clara → 0,5 verde dorado pálido → 1 miel oscura · fill: nivel · sprigs: ramitas adentro · lid: tapa levantada
type JS = { c: number; fill: number; sprigs: number; lid: number; onShelf: boolean; aroma?: number; noLid?: boolean };
export const jarState = (t: number): JS => {
  if (t < 41) return { c: t < 27.6 ? 0 : ease((t - 27.6) / 2.5), fill: 1, sprigs: 1, lid: t < 31 ? win(t, 30.1, 30.6) : 0, onShelf: t >= 21.4 };
  if (t < 73.4) return { c: 1, fill: 1, sprigs: 1, lid: 0, onShelf: false };
  if (t < 124.5) return { c: 0, fill: 0, sprigs: 0, lid: 0, onShelf: false };
  if (t < 139) return { c: 0, fill: 0, sprigs: 1, lid: 0, onShelf: false, aroma: 1, noLid: true };
  if (t < 195) {
    const c = t < 170.8 ? 0 : t < 174.1 ? 0.5 * ease((t - 170.8) / 3.3) : t < 178.2 ? 0.5 + 0.08 * (t - 174.1) / 4.1 : 0.58 + 0.42 * ease((t - 178.2) / 2.4);
    return { c, fill: 1, sprigs: 1, lid: inR(t, 160, 189) ? win(t, 182.0, 182.8) : 0, onShelf: t >= 163.6 && t < 188.5 };
  }
  return { c: 1, fill: 0.86, sprigs: 0, lid: 0, onShelf: inR(t, 203.5, 206.5) };
};
// días del time-lapse (para el contador HTML): hook 27,0-30,2 y resto 170,8-180,6
export const lapseDay = (t: number) => (inR(t, 27.5, 31) ? 1 + 13 * cl((t - 27.6) / 2.5) : inR(t, 170.6, 183) ? 1 + 13 * cl((t - 170.8) / 9.8) : 0);

// ---------------- geometría reusable ----------------
type V3 = [number, number, number];
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o !== undefined} opacity={o ?? 1} />
  </mesh>
);
// muro con canto claro en el corte (maqueta de arquitecto)
const Slab: React.FC<{ p: V3; s: V3; c: string; cut?: string; map?: Tx }> = ({ p, s, c, cut = "#efe6d4", map }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.92} map={map} /></mesh>
    <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>
  </group>
);
// InstancedMesh con matrices (se recalculan si cambian por cuadro)
const Inst: React.FC<{ geo: THREE.BufferGeometry; mat: THREE.Material; mats: THREE.Matrix4[]; cast?: boolean; cols?: THREE.Color[]; ro?: number }> = ({ geo, mat, mats, cast = false, cols, ro = 0 }) => {
  const mesh = useMemo(() => { const m = new THREE.InstancedMesh(geo, mat, Math.max(1, mats.length)); m.castShadow = cast; m.receiveShadow = true; m.frustumCulled = false; m.renderOrder = ro; return m; }, [geo, mat, mats.length, cast, ro]);
  mesh.count = mats.length;
  mats.forEach((M, i) => mesh.setMatrixAt(i, M));
  mesh.instanceMatrix.needsUpdate = true;
  if (cols) { cols.forEach((c, i) => mesh.setColorAt(i, c)); if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; }
  return <primitive object={mesh} />;
};
const M4 = (p: V3, r: V3 = [0, 0, 0], s: V3 = [1, 1, 1]) => new THREE.Matrix4().compose(v3(p), new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0], r[1], r[2])), v3(s));

// partículas blandas (punto redondo, nunca cuadrado)
const Puffs: React.FC<{ pts: number[]; col: string; size: number; o: number; map?: Tx; add?: boolean }> = ({ pts, col, size, o, map, add }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  if (o < 0.01 || pts.length === 0) return null;
  return <points geometry={geo}><pointsMaterial color={col} size={size} map={map} alphaTest={0.01} sizeAttenuation transparent opacity={o} depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} /></points>;
};

// ---------------- EL FRASCO (vidrio, líquido que cambia de color, ramitas de romero con agujas) ----------------
const JR = 0.045, JH = 0.165;
const LIQ = [new THREE.Color("#e9f1ec"), new THREE.Color("#c9962a"), new THREE.Color("#6e3008")];
const liqCol = (c: number) => (c < 0.5 ? LIQ[0].clone().lerp(LIQ[1], c * 2) : LIQ[1].clone().lerp(LIQ[2], (c - 0.5) * 2));
const sprigGeo = new THREE.BoxGeometry(0.0016, 0.0011, 0.011);
const stemGeo = new THREE.CylinderGeometry(0.0012, 0.0016, 1, 5);
// ramitas CURVAS (polilínea con curvatura propia), agujas alrededor del tallo con jitter, no en peine
const SPRIGS = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2 + rnd(i, 4), r = 0.005 + rnd(i, 2) * 0.02, lean = (rnd(i, 3) - 0.5) * 0.45;
  return { a, r, lean, bend: (rnd(i, 9) - 0.5) * 1.1, h: 0.11 + rnd(i, 5) * 0.03 };
});
const sprigPt = (s: (typeof SPRIGS)[number], u: number): V3 => {
  const bx = Math.cos(s.a) * s.r, bz = Math.sin(s.a) * s.r;
  const ang = s.lean + s.bend * u * u;              // se curva más arriba
  const off = Math.sin(ang) * u * s.h;
  let x = bx + off * Math.cos(s.a + 1.2), z = bz + off * Math.sin(s.a + 1.2);
  const rad = Math.hypot(x, z), RMAX = JR - 0.012;   // nunca atraviesan el vidrio
  if (rad > RMAX) { x *= RMAX / rad; z *= RMAX / rad; }
  return [x, 0.008 + Math.cos(ang * 0.5) * u * s.h, z];
};
const needleMats = (() => {
  const out: THREE.Matrix4[] = [];
  SPRIGS.forEach((s, i) => {
    for (let k = 0; k < 110; k++) {
      const u = 0.06 + rnd(i * 131 + k, 1) * 0.94, [x, y, z] = sprigPt(s, u);
      const yaw = rnd(i * 97 + k, 6) * Math.PI * 2, up = 0.25 + rnd(i * 97 + k, 7) * 0.9, rr = 0.0025 + rnd(k, 11) * 0.0035;
      const len = 0.75 + 0.6 * (1 - u) * rnd(k, 8);
      out.push(M4([x + Math.cos(yaw) * rr, y + (rnd(k, 12) - 0.5) * 0.003, z + Math.sin(yaw) * rr], [-up, -yaw + Math.PI / 2, (rnd(k, 13) - 0.5) * 0.6], [1, 1, len]));
    }
  });
  return out;
})();
const stemMats = SPRIGS.flatMap((s) => Array.from({ length: 6 }, (_, j) => {
  const a = new THREE.Vector3(...sprigPt(s, j / 6)), b = new THREE.Vector3(...sprigPt(s, (j + 1) / 6));
  const mid = a.clone().add(b).multiplyScalar(0.5), d = b.clone().sub(a), len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return new THREE.Matrix4().compose(mid, q, new THREE.Vector3(1, len, 1));
}));
export const Jar: React.FC<{ p: V3; c: number; fill: number; sprigs: number; lid: number; t: number; ry?: number; aroma?: number; noLid?: boolean }> = ({ p, c, fill, sprigs, lid, t, ry = 0, aroma, noLid }) => {
  const col = liqCol(c);
  const needle = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3f6a3a", roughness: 0.7, emissive: "#1d3a1a", emissiveIntensity: 0.35, transparent: true, opacity: 1 }), []);
  needle.color.set(new THREE.Color("#2f5a2c").lerp(new THREE.Color("#4a3a10"), c)); needle.opacity = 1 - 0.3 * c;
  const stem = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5d4a2c", roughness: 0.8, transparent: true, opacity: 1 }), []); stem.opacity = 1 - 0.3 * c;
  const lh = (JH - 0.022) * fill;
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {sprigs > 0 && <group><Inst geo={sprigGeo} mat={needle} mats={needleMats} ro={3} /><Inst geo={stemGeo} mat={stem} mats={stemMats} ro={3} /></group>}
      {fill > 0.01 && (
        <mesh position={[0, 0.006 + lh / 2, 0]} renderOrder={2}>
          <cylinderGeometry args={[JR - 0.004, JR - 0.004, lh, 40]} />
          <meshStandardMaterial color={col} transparent opacity={0.24 + 0.66 * c} roughness={0.3} emissive={col} emissiveIntensity={0.08 + 0.3 * c} depthWrite={false} />
        </mesh>
      )}
      {fill > 0.01 && <mesh position={[0, 0.006 + lh, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}><circleGeometry args={[JR - 0.004, 40]} /><meshStandardMaterial color={col.clone().lerp(new THREE.Color("#ffffff"), 0.35)} transparent opacity={0.35 + 0.4 * c} roughness={0.05} depthWrite={false} /></mesh>}
      {/* vidrio: cuerpo + hombro + cuello con rosca */}
      <mesh position={[0, JH * 0.43, 0]} renderOrder={4}>
        <cylinderGeometry args={[JR, JR, JH * 0.86, 48, 1, true]} />
        <meshPhysicalMaterial color="#f2fbf6" transparent opacity={0.11} roughness={0.04} metalness={0} clearcoat={1} clearcoatRoughness={0.05} side={THREE.FrontSide} depthWrite={false} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.003, 0]} renderOrder={4}><cylinderGeometry args={[JR, JR * 0.96, 0.006, 48]} /><meshPhysicalMaterial color="#e8f4ee" transparent opacity={0.45} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
      <mesh position={[0, JH * 0.9, 0]} renderOrder={4}><cylinderGeometry args={[JR * 0.83, JR, JH * 0.09, 48, 1, true]} /><meshPhysicalMaterial color="#f2fbf6" transparent opacity={0.22} roughness={0.04} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {[0, 1, 2].map((k) => <mesh key={k} position={[0, JH * 0.955 + k * 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[JR * 0.84, 0.0012, 6, 40]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>)}
      {/* brillo vertical (se lee como vidrio aunque el fondo sea oscuro) */}
      <mesh position={[JR * 0.62, JH * 0.45, JR * 0.79]} rotation={[0, 0.66, 0]} renderOrder={5}><planeGeometry args={[0.006, JH * 0.7]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.28} depthWrite={false} toneMapped={false} /></mesh>
      {/* tapa lisa de metal (sin marca) que se desenrosca y sube */}
      {!noLid && <group position={[0, JH + 0.006 + lid * 0.05, lid * 0.02]} rotation={[lid * -0.5, lid * 2.2, 0]}>
        <mesh castShadow><cylinderGeometry args={[JR * 0.9, JR * 0.9, 0.016, 40]} /><meshStandardMaterial color="#c9ccd0" metalness={0.9} roughness={0.28} /></mesh>
        <mesh position={[0, 0.0085, 0]}><cylinderGeometry args={[JR * 0.82, JR * 0.82, 0.002, 40]} /><meshStandardMaterial color="#b9bcc0" metalness={0.85} roughness={0.35} /></mesh>
      </group>}
      <AromaJar t={t} lid={aroma ?? lid} c={c} />
    </group>
  );
};
// aroma de romero que sale de la tapa abierta (hilos verde-dorados que suben en espiral)
const AromaJar: React.FC<{ t: number; lid: number; c: number }> = ({ t, lid, c }) => {
  const tx = useTextures();
  if (lid < 0.05) return null;
  const pts: number[] = [];
  for (let i = 0; i < 260; i++) {
    const ph = (t * (0.22 + rnd(i, 1) * 0.12) + rnd(i, 2)) % 1, a = rnd(i, 3) * 6.28 + ph * 5;
    const r = 0.012 + ph * (0.05 + rnd(i, 4) * 0.08);
    pts.push(Math.cos(a) * r, JH + 0.01 + ph * 0.42, Math.sin(a) * r);
  }
  return <Puffs pts={pts} col={c > 0.6 ? "#d9e7a0" : "#c8e6b5"} size={0.012} o={0.55 * lid} map={tx.flake} add />;
};

// rociador (mueble bajo la pileta) — plástico liso de color, gatillo blanco, sin etiquetas
const Sprayer: React.FC<{ p: V3; col: string; lvl: number; ry?: number; s?: number; clear?: boolean }> = ({ p, col, lvl, ry = 0, s = 1, clear }) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.04, 0.045, 0.2, 24]} /><meshPhysicalMaterial color={col} transparent opacity={clear ? 0.35 : 0.82} roughness={0.25} clearcoat={0.6} depthWrite={!clear} /></mesh>
    {clear && <mesh position={[0, 0.005 + 0.095 * lvl, 0]}><cylinderGeometry args={[0.037, 0.042, 0.19 * lvl, 24]} /><meshStandardMaterial color="#b4782a" transparent opacity={0.75} roughness={0.2} emissive="#6a3a0a" emissiveIntensity={0.15} /></mesh>}
    <mesh position={[0, 0.215, 0]}><cylinderGeometry args={[0.016, 0.03, 0.03, 16]} /><meshStandardMaterial color={col} roughness={0.4} /></mesh>
    <Box p={[0, 0.25, 0.012]} s={[0.036, 0.045, 0.07]} c="#f3f3f0" r={0.5} rad={0.01} />
    <Box p={[0, 0.227, 0.04]} s={[0.012, 0.04, 0.012]} c="#e9e9e4" r={0.5} rad={0.004} rot={[0.3, 0, 0]} />
    <mesh position={[0, 0.252, 0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.016, 10]} /><meshStandardMaterial color="#222" /></mesh>
  </group>
);
// niebla del rociador (cono de gotitas que sale de la boquilla)
const Mist: React.FC<{ t: number; at: number; from: V3; dir: V3; map?: Tx }> = ({ t, at, from, dir, map }) => {
  const k = t - at;
  if (k < 0 || k > 1.2) return null;
  const pts: number[] = [];
  const d = v3(dir).normalize();
  for (let i = 0; i < 420; i++) {
    const u = Math.min(1, (k * (1.6 + rnd(i, 1)) ) ), spread = 0.25 * u;
    const off = new THREE.Vector3((rnd(i, 2) - 0.5) * spread, (rnd(i, 3) - 0.5) * spread, (rnd(i, 4) - 0.5) * spread);
    const q = v3(from).add(d.clone().multiplyScalar(u * (0.35 + rnd(i, 5) * 0.25))).add(off);
    q.y -= u * u * 0.06;
    pts.push(q.x, q.y, q.z);
  }
  return <Puffs pts={pts} col="#eef6ff" size={0.007} o={0.8 * (1 - win(k, 0.6, 1.2))} map={map} />;
};

// ---------------- texturas propias del campo ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useFarmTex = () => useMemo(() => ({
  field: mk(512, 512, (g) => {
    g.fillStyle = "#c79d47"; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 8) { g.fillStyle = `rgba(${150 + rnd(y, 1) * 40},${110 + rnd(y, 2) * 30},40,.35)`; g.fillRect(0, y, 512, 3); }
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(255,${220 + rnd(i, 3) * 30},140,${0.15 * rnd(i, 4)})`; g.fillRect(rnd(i, 5) * 512, rnd(i, 6) * 512, 2, 4); }
  }, [60, 60]),
  yard: mk(256, 256, (g) => {
    g.fillStyle = "#7d7a4a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) { const v = rnd(i, 1); g.fillStyle = v > 0.5 ? `rgba(90,110,50,${0.4 * rnd(i, 2)})` : `rgba(140,120,80,${0.35 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 3); }
  }, [10, 10]),
  gravel: mk(256, 256, (g) => {
    g.fillStyle = "#9a948a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = 110 + rnd(i, 1) * 110; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 2.4, 0, 6.3); g.fill(); }
  }, [1, 6]),
  pine: mk(512, 256, (g) => {
    g.fillStyle = "#d9c49b"; g.fillRect(0, 0, 512, 256);
    for (let r = 0; r < 5; r++) { g.fillStyle = `rgba(${200 + rnd(r, 1) * 25},${178 + rnd(r, 2) * 20},${135 + rnd(r, 3) * 15},1)`; g.fillRect(0, r * 51, 512, 50); g.fillStyle = "rgba(120,90,50,.35)"; g.fillRect(0, r * 51 + 50, 512, 1.5); }
    for (let k = 0; k < 60; k++) { g.strokeStyle = `rgba(150,110,60,${0.06 + rnd(k, 4) * 0.08})`; g.lineWidth = 1 + rnd(k, 5); g.beginPath(); const y = rnd(k, 6) * 256; g.moveTo(0, y); g.bezierCurveTo(170, y + 6 * rnd(k, 7), 340, y - 5, 512, y + 3); g.stroke(); }
  }),
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#eae3d3"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 24) { g.fillStyle = "rgba(160,140,110,.12)"; g.fillRect(x, 0, 2, 256); }
    for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(150,130,100,${0.06 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 2 + rnd(i, 5) * 5, 0, 6.3); g.fill(); }
  }, [6, 2]),
  barn: mk(256, 256, (g) => {
    g.fillStyle = "#8e2f24"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 16) { g.fillStyle = `rgba(${60 + rnd(x, 1) * 30},10,8,.35)`; g.fillRect(x, 0, 2, 256); g.fillStyle = `rgba(255,200,180,${0.05 * rnd(x, 2)})`; g.fillRect(x + 3, 0, 10, 256); }
  }, [3, 1]),
  dust: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(200,180,140,${0.12 + 0.25 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 2 + rnd(i, 4) * 9, 0, 6.3); g.fill(); }
    g.fillStyle = "rgba(190,170,130,.35)"; g.fillRect(0, 0, 256, 256);
  }),
}), []);

// ---------------- la granja de afuera ----------------
const wheatGeo = (() => { const g = new THREE.CylinderGeometry(0.035, 0.012, 0.85, 4); g.translate(0, 0.425, 0); return g; })();
const WHEAT = (() => {
  const out: { x: number; z: number; s: number; ph: number }[] = [];
  let i = 0;
  while (out.length < 22000 && i < 120000) {
    i++;
    const x = (rnd(i, 1) - 0.5) * 90, z = (rnd(i, 2) - 0.5) * 90 - 8;
    if (Math.abs(x + 3) < 15 && Math.abs(z + 1) < 13) continue; // patio de la casa
    if (Math.abs(x + 18) < 9 && Math.abs(z + 14) < 9) continue; // granero
    out.push({ x, z, s: 0.75 + rnd(i, 3) * 0.5, ph: rnd(i, 4) * 6.28 });
  }
  return out;
})();
const Wheat: React.FC<{ t: number; sunset: number }> = ({ t }) => {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.95, flatShading: true }), []);
  const cols = useMemo(() => WHEAT.map((w) => new THREE.Color("#d9b25c").lerp(new THREE.Color("#b88a3a"), rnd(w.ph * 100, 9))), []);
  const mats = WHEAT.map((w) => M4([w.x, 0, w.z], [Math.sin(t * 1.3 + w.x * 0.25 + w.ph * 0.3) * 0.12, 0, Math.sin(t * 1.1 + w.z * 0.2) * 0.08], [w.s, w.s * (0.9 + 0.2 * Math.sin(w.ph)), w.s]));
  return <Inst geo={wheatGeo} mat={mat} mats={mats} cols={cols} />;
};
const Barn: React.FC<{ map?: Tx }> = ({ map }) => {
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-4.4, 0); s.lineTo(-3.2, 2.2); s.lineTo(0, 3.6); s.lineTo(3.2, 2.2); s.lineTo(4.4, 0); s.lineTo(-4.4, 0); return new THREE.ExtrudeGeometry(s, { depth: 10.4, bevelEnabled: false }); }, []);
  return (
    <group position={[-18, 0, -14]} rotation={[0, 0.35, 0]}>
      <Box p={[0, 2.6, 0]} s={[8, 5.2, 10]} c="#9a3326" map={map} rad={0.05} />
      <mesh geometry={roof} position={[0, 5.2, -5.2]} castShadow><meshStandardMaterial color="#5b5e63" roughness={0.6} metalness={0.4} /></mesh>
      <Box p={[0, 1.8, 5.02]} s={[3.2, 3.6, 0.08]} c="#7a2a20" />
      {[[0, 1.8, 5.08, 3.2, 0.18], [0, 1.8, 5.08, 0.18, 3.6]].map(([x, y, z, w, h], i) => <Box key={i} p={[x, y, z]} s={[w, h, 0.04]} c="#efe9dd" rad={0.01} rot={[0, 0, i ? 0.72 : -0.72]} />)}
      <mesh position={[6.2, 4.5, -2]} castShadow><cylinderGeometry args={[1.6, 1.6, 9, 28]} /><meshStandardMaterial color="#b8bcc0" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[6.2, 9.4, -2]} castShadow><sphereGeometry args={[1.6, 28, 12, 0, 6.29, 0, 1.57]} /><meshStandardMaterial color="#a9adb2" metalness={0.75} roughness={0.3} /></mesh>
    </group>
  );
};
// rosal de romero (muchas ramitas verde-grises) junto al porche
const bushGeo = new THREE.BoxGeometry(0.004, 0.003, 0.03);
const BUSH = (() => {
  const out: THREE.Matrix4[] = [];
  for (let s = 0; s < 70; s++) {
    const a = rnd(s, 1) * 6.28, r = rnd(s, 2) * 0.45, h = 0.45 + rnd(s, 3) * 0.55, lean = 0.2 + rnd(s, 4) * 0.5;
    for (let k = 0; k < 16; k++) {
      const u = k / 16, y = u * h, x = Math.cos(a) * (r + u * h * Math.sin(lean)), z = Math.sin(a) * (r + u * h * Math.sin(lean));
      const yaw = a + (k % 2 ? 1 : -1) * 1.1;
      out.push(M4([x + Math.cos(yaw) * 0.012, y, z + Math.sin(yaw) * 0.012], [0.5, -yaw, 0], [1.2, 1.2, 1.2]));
    }
  }
  return out;
})();
const Bush: React.FC<{ p: V3 }> = ({ p }) => {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4f6b4a", roughness: 0.8 }), []);
  return <group position={p}><Inst geo={bushGeo} mat={mat} mats={BUSH} cast /></group>;
};
// gallinas que picotean
const Hen: React.FC<{ p: V3; ry: number; t: number; i: number }> = ({ p, ry, t, i }) => {
  const peck = Math.max(0, Math.sin(t * 3.1 + i * 1.7)) ** 6;
  const col = i % 3 === 0 ? "#7a3b1c" : i % 3 === 1 ? "#9c5a2a" : "#5a2f17";
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <mesh position={[0, 0.2, 0]} scale={[0.15, 0.13, 0.21]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>
      <mesh position={[0, 0.27, -0.2]} rotation={[-0.7, 0, 0]} castShadow><coneGeometry args={[0.08, 0.16, 8]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>
      <group position={[0, 0.3 - peck * 0.16, 0.17 + peck * 0.05]} rotation={[peck * 0.9, 0, 0]}>
        <mesh castShadow><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>
        <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.015, 0.04, 0.06]} /><meshStandardMaterial color="#c4271d" roughness={0.6} /></mesh>
        <mesh position={[0, -0.005, 0.07]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.014, 0.04, 6]} /><meshStandardMaterial color="#e2b23a" /></mesh>
      </group>
      {[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.05, 0]}><cylinderGeometry args={[0.008, 0.008, 0.1, 5]} /><meshStandardMaterial color="#d9a43a" /></mesh>)}
    </group>
  );
};
// yuyos entre el ripio: verdes → marrones y caídos (uso 10)
const Weeds: React.FC<{ dead: number }> = ({ dead }) => {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5d8a3a", roughness: 0.9, flatShading: true }), []);
  mat.color.set(new THREE.Color("#5d8a3a").lerp(new THREE.Color("#7a5a2a"), dead));
  const geo = useMemo(() => { const g = new THREE.ConeGeometry(0.025, 0.3, 4); g.translate(0, 0.15, 0); return g; }, []);
  const mats: THREE.Matrix4[] = [];
  for (let i = 0; i < 40; i++) {
    const u = i / 40, x = lerp(-6.3, -9.4, u) + (rnd(i, 1) - 0.5) * 1.0, z = lerp(0.3, 7.5, u) + (rnd(i, 2) - 0.5) * 0.4;
    for (let k = 0; k < 5; k++) mats.push(M4([x + (rnd(i * 9 + k, 3) - 0.5) * 0.12, 0.01, z + (rnd(i * 9 + k, 4) - 0.5) * 0.12], [(rnd(i * 9 + k, 5) - 0.5) * 0.8 + dead * 0.9, rnd(i, 6) * 6, 0], [1, 0.7 + rnd(i * 9 + k, 7) * 0.6 - dead * 0.35, 1]));
  }
  return <Inst geo={geo} mat={mat} mats={mats} />;
};

// ---------------- LA ESCENA ----------------
export const FarmWorld: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), ft = useFarmTex();
  const J = jarState(t);
  // time-lapse: la luz de la ventana sube y baja (días que pasan)
  const day = lapseDay(t), lapsing = day > 0;
  const dayLight = lapsing ? 0.62 + 0.38 * Math.cos((day - 1) * Math.PI * 2) : 1;
  const sunset = win(t, 505, 520);
  const sunCol = new THREE.Color("#fff1d8").lerp(new THREE.Color("#ffad5c"), sunset);
  const sunPos: V3 = [lerp(-22, -30, sunset), lerp(26, 9, sunset), lerp(14, 6, sunset)];
  const sky = new THREE.Color("#c9dbea").lerp(new THREE.Color("#f2b98a"), sunset);
  // mueble bajo la pileta: puertas y rociadores
  const under = inR(t, 4.0, 21.8) || inR(t, 468.5, 478) || inR(t, 503, 512);
  const doors = under ? 1 : 0;
  const walk = inR(t, 17, 22) ? ease((t - 17.9) / 3.3) : 0;
  const haze = (inR(t, 4.6, 21.8) ? win(t, 4.8, 6.0) * (1 - win(t, 20.5, 21.6)) : 0) + (inR(t, 503, 512) ? win(t, 503.6, 504.4) : 0);
  // alacena
  const pantryDoor = inR(t, 21.4, 31.5) ? win(t, 21.9, 22.8) : inR(t, 163, 189) || inR(t, 203, 207) ? 1 : 0;
  // usos
  const fridge = inR(t, 266.5, 269) ? win(t, 267.2, 267.95) : 0;
  const steam = inR(t, 287.5, 293) ? win(t, 287.9, 288.6) : 0;
  const ants = inR(t, 309, 316);
  const crust = inR(t, 353, 362) ? 1 : 0;
  const trashLid = inR(t, 377, 382) ? win(t, 377.5, 378.0) : 0;
  const stink = inR(t, 377, 382) ? win(t, 377.6, 378.2) * (1 - win(t, 380.2, 381.0)) : 0;
  const dust = inR(t, 243, 247.5) ? 1 - win(t, 244.6, 246.6) : 1;
  const weeds = inR(t, 434, 442) ? win(t, 435.6, 437.8) : 0;
  const sprayOnTable = t >= 205;
  const twoJars = inR(t, 188.5, 195.5);
  // vapor de la olla (sube y se abre hacia la ventana)
  const steamPts: number[] = [];
  if (steam > 0.01) for (let i = 0; i < 300; i++) { const ph = (t * (0.25 + rnd(i, 1) * 0.2) + rnd(i, 2)) % 1; steamPts.push(1.8 + Math.sin(ph * 6 + i) * 0.05 * (1 + ph * 4) + ph * ph * 0.6 * (rnd(i, 3) - 0.3), 1.0 + ph * 1.1, -2.68 + Math.cos(ph * 5 + i) * 0.05 * (1 + ph * 3)); }
  // vaho químico bajo la pileta (amarillo verdoso, sale y sube)
  const hazePts: number[] = [];
  if (haze > 0.01) for (let i = 0; i < 380; i++) { const ph = (t * (0.12 + rnd(i, 1) * 0.1) + rnd(i, 2)) % 1; hazePts.push(0.1 + rnd(i, 3) * 0.7 + Math.sin(ph * 4 + i) * 0.08, 0.15 + ph * 1.0, -2.6 + rnd(i, 4) * 0.4 + ph * 0.9); }
  // olor del tacho (verde sucio, ondulado)
  const stinkPts: number[] = [];
  if (stink > 0.01) for (let i = 0; i < 160; i++) { const ph = (t * 0.35 + rnd(i, 2)) % 1; stinkPts.push(3.4 + Math.sin(ph * 9 + i) * 0.12, 0.75 + ph * 0.8, 1.1 + Math.cos(ph * 7 + i) * 0.12); }
  // hormigas en fila
  const antMats: THREE.Matrix4[] = [];
  if (ants) for (let i = 0; i < 22; i++) { const u = ((i / 22) + rnd(i, 3) * 0.02 + (t - 309) * 0.02) % 1; const x = 1.58 - u * 0.66, z = -2.74 + Math.sin(u * 18 + i) * 0.014; antMats.push(M4([x, 0.94, z], [0, Math.PI / 2 + Math.cos(u * 18 + i) * 0.35, 0], [2.2, 2.2, 2.2])); }
  const antGeo = useMemo(() => {
    // hormiga de verdad: cabeza + tórax + abdomen + 6 patas finas
    const parts = [new THREE.SphereGeometry(0.0019, 8, 6).translate(0, 0.0022, 0.0062), new THREE.SphereGeometry(0.0015, 8, 6).scale(1, 0.9, 1.5).translate(0, 0.0022, 0.0022),
      new THREE.SphereGeometry(0.003, 10, 8).scale(1, 0.85, 1.35).translate(0, 0.0026, -0.0035)];
    for (const sx of [-1, 1]) for (const zz of [-0.0012, 0.0022, 0.0052]) parts.push(new THREE.CylinderGeometry(0.0003, 0.0003, 0.007, 4).rotateZ(sx * 1.15).rotateY(zz * 60 * sx).translate(sx * 0.0028, 0.0012, zz));
    return mergeGeometries(parts.map((g) => g.toNonIndexed()));
  }, []);
  const antMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#121010", roughness: 0.4 }), []);
  // costra blanca de sarro en la canilla
  const crustMats: THREE.Matrix4[] = [];
  if (crust) for (let i = 0; i < 260; i++) { const a = rnd(i, 1) * 6.28, y = Math.pow(rnd(i, 2), 2.2) * 0.1, rr = 0.019 + (y < 0.01 ? rnd(i, 6) * 0.025 : 0); crustMats.push(M4([0.45 + Math.cos(a) * rr, 0.937 + y, -2.88 + Math.sin(a) * rr], [0, 0, 0], [0.5 + rnd(i, 3) * 0.6, 0.35 + rnd(i, 4) * 0.4, 0.5 + rnd(i, 5) * 0.6])); }
  const crustGeo = useMemo(() => new THREE.SphereGeometry(0.005, 6, 5), []);
  const crustMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f2efe6", roughness: 1 }), []);
  const BOTTLES: [string, number][] = [["#3d7fd6", 0.4], ["#57b84a", 1], ["#e8c531", 0.5], ["#d8473a", 1], ["#59c3c3", 0.35], ["#e6e6e0", 1]];

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.22 + 0.25 * sunset} threshold={0.88} exposure={0.95 + 0.1 * sunset} env={0.32} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 45, 140]} />
      <hemisphereLight args={["#dbe8f5", "#8a7650", 0.62 * (lapsing ? 0.35 + 0.65 * dayLight : 1)]} />
      <directionalLight position={sunPos} intensity={(2.3 - 0.6 * sunset) * (lapsing ? 0.15 + 0.85 * dayLight : 1)} color={sunCol} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={26} shadow-camera-bottom={-26} shadow-camera-far={90} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luz de adentro: lámpara colgante de la mesa + rebote de las ventanas */}
      <pointLight position={[-0.6, 2.05, -0.4]} intensity={(lapsing ? 0.3 : 1) * 3.2} distance={6} color="#ffd9a0" decay={1.6} />
      <pointLight position={[0.45, 1.7, -2.2]} intensity={2.4 * (lapsing ? 0.2 + 0.8 * dayLight : 1)} distance={5} color="#f4f0e6" decay={1.6} />
      <pointLight position={[3.4, 1.6, -0.5]} intensity={2.0} distance={5} color={sunCol.getHex()} decay={1.6} />
      <pointLight position={[-3.1, 1.75, -1.6]} intensity={pantryDoor * (lapsing ? 0.15 + 1.6 * dayLight : 1.4)} distance={2.6} color="#ffe2b0" decay={1.6} />
      {fridge > 0.05 && <pointLight position={[3.4, 1.2, -2.3]} intensity={fridge * 1.6} distance={2} color="#e8f4ff" />}

      {/* suelo: trigal + patio + camino de ripio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[400, 400]} /><meshStandardMaterial map={ft.field} roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.004, -1]} receiveShadow><planeGeometry args={[30, 26]} /><meshStandardMaterial map={ft.yard} roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, -0.4]} position={[-7.8, 0.008, 3.9]} receiveShadow><planeGeometry args={[1.3, 8.6]} /><meshStandardMaterial map={ft.gravel} roughness={1} /></mesh>
      <Weeds dead={weeds} />
      {/* huerta con cerquito (la que NO se toca) */}
      <group position={[-11.2, 0, 4.2]}>
        <Box p={[0, 0.08, 0]} s={[2.6, 0.16, 3.4]} c="#4a3524" r={1} />
        {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.9 + (i % 3) * 0.9, 0.3, -1.3 + Math.floor(i / 3) * 0.52]} castShadow><sphereGeometry args={[0.2 + rnd(i, 1) * 0.06, 12, 8]} /><meshStandardMaterial color={i % 2 ? "#4f8a3a" : "#3f7a32"} roughness={0.8} /></mesh>)}
        {Array.from({ length: 14 }, (_, i) => { const a = i < 7; const u = (i % 7) / 6; return <Box key={i} p={a ? [-1.45 + u * 2.9, 0.35, 1.85] : [1.45, 0.35, -1.85 + u * 3.7]} s={[0.05, 0.7, 0.05]} c="#cdbb98" r={0.9} rad={0.01} />; })}
      </group>
      <Wheat t={t} sunset={sunset} />
      <Barn map={ft.barn} />
      {/* gallinero rojo + bebedero + gallinas */}
      <group position={[-10.2, 0, -5]} rotation={[0, 0.5, 0]}>
        <Box p={[0, 0.9, 0]} s={[2.2, 1.4, 1.6]} c="#9a3326" map={ft.barn} />
        <Box p={[0, 1.7, 0]} s={[2.5, 0.12, 1.9]} c="#5b5e63" rot={[0.25, 0, 0]} />
        <Box p={[0, 0.1, 0]} s={[2.2, 0.2, 1.6]} c="#5a4632" />
        <Box p={[0.5, 0.55, 0.81]} s={[0.4, 0.5, 0.04]} c="#2a1e16" />
      </group>
      <group position={[-9.0, 0, -3.3]}>
        <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.3, 20]} /><meshStandardMaterial color="#b9bdc2" metalness={0.8} roughness={0.35} /></mesh>
        <mesh position={[0, 0.38, 0]} castShadow><coneGeometry args={[0.13, 0.12, 20]} /><meshStandardMaterial color="#b9bdc2" metalness={0.8} roughness={0.35} /></mesh>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.22, 0.22, 0.05, 24]} /><meshStandardMaterial color="#a9adb2" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[0, 0.056, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.13, 0.21, 24]} /><meshStandardMaterial color="#9ec6d6" roughness={0.05} metalness={0.2} transparent opacity={0.8} /></mesh>
      </group>
      {[[-8.6, -3.0, 2.4], [-9.4, -3.1, -1.9], [-9.1, -3.75, 0.2], [-8.5, -3.7, 3.4], [-9.7, -3.5, -2.8], [-10.1, -2.9, 1.2]].map(([x, z, r], i) => <Hen key={i} p={[x, 0, z]} ry={r} t={t} i={i} />)}

      {/* ===== LA CASA (frente abierto en z=2) ===== */}
      {/* pared del fondo con la ventana de la pileta (x -0.15..1.05, y 1.2..2.1) */}
      <Slab p={[-2.2, 1.4, -3.1]} s={[4.1, 2.8, 0.2]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[2.7, 1.4, -3.1]} s={[3.3, 2.8, 0.2]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[0.45, 0.6, -3.1]} s={[1.2, 1.2, 0.2]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[0.45, 2.45, -3.1]} s={[1.2, 0.7, 0.2]} c="#e8e0cf" map={ft.wall} />
      {/* pared izquierda con la puerta de atrás abierta (z -0.6..0.4) */}
      <Slab p={[-4.1, 1.4, -1.85]} s={[0.2, 2.8, 2.5]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[-4.1, 1.4, 1.2]} s={[0.2, 2.8, 1.6]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[-4.1, 2.45, -0.1]} s={[0.2, 0.7, 1.0]} c="#e8e0cf" map={ft.wall} />
      <Box p={[-3.62, 1.05, 0.38]} s={[0.05, 2.1, 0.95]} c="#6a8a7a" rot={[0, -1.25, 0]} rad={0.015} />
      {/* pared derecha con la ventana grande del oeste (z -1.4..0.4, y 0.95..2.15) */}
      <Slab p={[4.1, 1.4, -2.25]} s={[0.2, 2.8, 1.7]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[4.1, 1.4, 1.2]} s={[0.2, 2.8, 1.6]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[4.1, 0.47, -0.5]} s={[0.2, 0.95, 1.8]} c="#e8e0cf" map={ft.wall} />
      <Slab p={[4.1, 2.47, -0.5]} s={[0.2, 0.65, 1.8]} c="#e8e0cf" map={ft.wall} />
      {/* vidrio del oeste con el polvo de la cosecha (se limpia en el uso 2) */}
      <mesh position={[4.02, 1.55, -0.5]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[1.8, 1.2]} /><meshStandardMaterial map={ft.dust} transparent opacity={0.9 * dust} roughness={1} depthWrite={false} /></mesh>
      {[[4.0, 1.55, -1.4, 0.06, 1.3], [4.0, 1.55, 0.4, 0.06, 1.3], [4.0, 1.55, -0.5, 0.04, 1.2], [4.0, 0.95, -0.5, 1.9, 0.08], [4.0, 2.15, -0.5, 1.9, 0.07]].map(([x, y, z, w, h], i) => <Box key={i} p={[x, y, z]} s={[0.08, h, w]} c="#f2ede2" r={0.6} rad={0.01} />)}
      {/* marco de la ventana de la pileta + cortinita */}
      {[[-0.15, 1.65, 0.06, 0.95], [1.05, 1.65, 0.06, 0.95], [0.45, 1.65, 0.04, 0.9], [0.45, 1.2, 1.3, 0.07], [0.45, 2.1, 1.3, 0.06]].map(([x, y, w, h], i) => <Box key={i} p={[x, y, -3.0]} s={[w, h, 0.06]} c="#f2ede2" r={0.6} rad={0.01} />)}
      <Box p={[0.45, 1.17, -2.92]} s={[1.3, 0.04, 0.16]} c="#efe9dd" r={0.6} rad={0.01} />
      {[-0.05, 0.95].map((x) => <Box key={x} p={[x, 1.86, -2.95]} s={[0.24, 0.56, 0.03]} c="#d9d2bf" r={1} rad={0.01} />)}
      {/* piso de tablas + zócalo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -0.5]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial map={tx.planks} roughness={0.6} /></mesh>
      <Box p={[0, 0.0, -0.5]} s={[8.4, 0.012, 5.2]} c="#5a4130" r={1} rad={0.003} />
      {/* techo a dos aguas (afuera) */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[0, 3.55, -0.5 + sd * 1.45]} rotation={[sd * -0.55, 0, 0]}>
          <Box p={[0, 0, 0]} s={[8.8, 0.16, 3.3]} c="#4a4d52" r={0.7} m={0.3} />
        </group>
      ))}
      <Box p={[0, 2.86, -0.5]} s={[8.4, 0.12, 5.2]} c="#e8e0cf" />
      {/* porche de atrás con escalones + el romero */}
      <Box p={[-5.2, 0.15, -0.1]} s={[2.0, 0.3, 2.3]} c="#9b9488" map={tx.planks} />
      {[0, 1].map((k) => <Box key={k} p={[-6.4 - k * 0.3, 0.1 - k * 0.05, -0.1]} s={[0.35, 0.2 - k * 0.1, 1.2]} c="#8e877b" />)}
      {[-1.1, 1.0].map((z) => <Box key={z} p={[-6.1, 1.3, z]} s={[0.1, 2.3, 0.1]} c="#efe9dd" />)}
      <Box p={[-5.2, 2.5, -0.1]} s={[2.2, 0.1, 2.5]} c="#4a4d52" />
      <Bush p={[-6.6, 0, -1.7]} />

      {/* ===== COCINA ===== */}
      {/* mesada del fondo (x -1.4..2.6) */}
      <Box p={[-0.7, 0.45, -2.68]} s={[1.4, 0.9, 0.6]} c="#efeadf" r={0.7} />
      <Box p={[1.25, 0.45, -2.68]} s={[0.7, 0.9, 0.6]} c="#efeadf" r={0.7} />
      <Box p={[-0.15, 0.915, -2.68]} s={[2.5, 0.04, 0.64]} c="#d9d2c4" r={0.4} />
      <Box p={[1.25, 0.915, -2.68]} s={[0.72, 0.04, 0.64]} c="#d9d2c4" r={0.4} />
      {/* pileta enlozada blanca profunda */}
      <Box p={[0.45, 0.82, -2.68]} s={[0.92, 0.24, 0.6]} c="#f6f6f2" r={0.18} rad={0.04} />
      <mesh position={[0.45, 0.86, -2.68]}><boxGeometry args={[0.8, 0.2, 0.46]} /><meshStandardMaterial color="#e9eae6" roughness={0.2} side={THREE.BackSide} /></mesh>
      {/* canilla cromada (y su sarro en el uso 7) */}
      <group position={[0.45, 0.93, -2.88]}>
        <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.016, 0.02, 0.24, 18]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[0, 0.24, 0.07]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.013, 0.013, 0.16, 16]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[0, 0.22, 0.15]}><cylinderGeometry args={[0.014, 0.012, 0.05, 16]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        {[-0.1, 0.1].map((x) => <mesh key={x} position={[x, 0.04, 0]}><cylinderGeometry args={[0.02, 0.024, 0.06, 6]} /><meshStandardMaterial color="#e8e9ea" metalness={0.9} roughness={0.2} /></mesh>)}
      </group>
      {crust > 0 && <Inst geo={crustGeo} mat={crustMat} mats={crustMats} />}
      {/* mueble bajo la pileta: 2 puertas con bisagra + interior + rociadores */}
      <mesh position={[0.45, 0.45, -2.72]}><boxGeometry args={[0.88, 0.76, 0.52]} /><meshStandardMaterial color="#3b342c" roughness={1} side={THREE.BackSide} /></mesh>
      <group position={[0.0, 0.46, -2.375]} rotation={[0, -doors * 1.9, 0]}><Box p={[0.222, 0, 0]} s={[0.44, 0.74, 0.025]} c="#f1ece2" r={0.6} rad={0.008} /><mesh position={[0.4, 0.2, 0.02]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#8c7b55" metalness={0.8} roughness={0.3} /></mesh></group>
      <group position={[0.9, 0.46, -2.375]} rotation={[0, doors * 1.9, 0]}><Box p={[-0.222, 0, 0]} s={[0.44, 0.74, 0.025]} c="#f1ece2" r={0.6} rad={0.008} /><mesh position={[-0.4, 0.2, 0.02]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#8c7b55" metalness={0.8} roughness={0.3} /></mesh></group>
      {under && BOTTLES.map(([c, lvl], i) => {
        const bx = 0.12 + i * 0.13, bz = -2.72 + (i % 2) * 0.12;
        const w = cl(walk * 1.4 - i * 0.07);
        const w1 = cl(w * 2), w2 = cl(w * 2 - 1);
        const pos: V3 = walk > 0 ? [lerp(lerp(bx, -2.6 - i * 0.05, w1), -3.95, w2), (w > 0 && w < 1 ? 0.02 + Math.abs(Math.sin(w * 22 + i)) * 0.07 : 0.01), lerp(lerp(bz, -1.95 + (i % 2) * 0.12, w1), -0.1 + (i % 2) * 0.2, w2)] : [bx, 0.06, bz];
        return <Sprayer key={i} p={pos} col={c} lvl={lvl} ry={walk > 0 ? -Math.PI / 2 + Math.sin(w * 22 + i) * 0.25 : i * 0.7} s={walk > 0 ? 1.25 + 0.75 * cl(w * 3) : 1.25} />;
      })}
      <Puffs pts={hazePts} col="#cfe86a" size={0.12} o={0.16 * cl(haze)} map={tx.flake} />
      {/* cocina enlozada blanca con la olla */}
      <Box p={[2.0, 0.45, -2.68]} s={[0.78, 0.9, 0.6]} c="#f4f2ec" r={0.35} m={0.1} />
      <Box p={[2.0, 0.92, -2.68]} s={[0.8, 0.03, 0.62]} c="#1d1d1f" r={0.3} />
      <Box p={[2.0, 1.12, -2.96]} s={[0.8, 0.36, 0.06]} c="#f4f2ec" r={0.35} />
      <Box p={[2.0, 0.5, -2.37]} s={[0.6, 0.4, 0.02]} c="#2a2a2c" r={0.2} />
      {[[1.8, -2.68], [2.2, -2.55], [2.2, -2.82]].map(([x, z], i) => <mesh key={i} position={[x, 0.94, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.01, 6, 24]} /><meshStandardMaterial color="#333" metalness={0.6} /></mesh>)}
      <mesh position={[1.8, 1.01, -2.68]} castShadow><cylinderGeometry args={[0.1, 0.09, 0.13, 28, 1, true]} /><meshStandardMaterial color="#9ea3a8" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[1.8, 1.06, -2.68]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.095, 28]} /><meshStandardMaterial color="#b88a3a" roughness={0.1} transparent opacity={0.85} /></mesh>
      <Box p={[1.8 + 0.17, 1.06, -2.68]} s={[0.18, 0.02, 0.03]} c="#2a2a2c" rad={0.008} />
      {steam > 0.01 && <mesh position={[1.8, 0.945, -2.68]}><cylinderGeometry args={[0.06, 0.06, 0.005, 20]} /><meshBasicMaterial color="#3a6cff" transparent opacity={0.7 * steam} toneMapped={false} /></mesh>}
      <Puffs pts={steamPts} col="#ffffff" size={0.06} o={0.3 * steam} map={tx.flake} />
      {/* heladera vieja redondeada (puerta que se abre en el uso 3) */}
      <Box p={[3.4, 0.86, -2.62]} s={[0.86, 1.72, 0.66]} c="#efe9da" r={0.3} m={0.05} rad={0.09} />
      <mesh position={[3.4, 0.86, -2.3]}><boxGeometry args={[0.76, 1.6, 0.04]} /><meshStandardMaterial color="#f7f8fa" roughness={0.5} emissive="#dff0ff" emissiveIntensity={fridge * 0.35} /></mesh>
      {fridge > 0.02 && [0.45, 0.85, 1.25].map((y) => <Box key={y} p={[3.4, y, -2.5]} s={[0.72, 0.02, 0.36]} c="#dfe8ef" r={0.2} o={0.7} />)}
      <group position={[3.83, 0.86, -2.28]} rotation={[0, fridge * 1.6, 0]}>
        <Box p={[-0.43, 0, 0.0]} s={[0.86, 1.72, 0.06]} c="#efe9da" r={0.3} m={0.05} rad={0.03} />
        <Box p={[-0.78, 0.2, 0.06]} s={[0.04, 0.32, 0.04]} c="#c9cdd2" m={0.9} r={0.2} rad={0.01} />
      </group>
      {/* alacenas de arriba */}
      <Box p={[-0.85, 1.85, -2.83]} s={[1.1, 0.72, 0.34]} c="#f1ece2" r={0.6} />
      <Box p={[1.9, 1.85, -2.83]} s={[1.4, 0.72, 0.34]} c="#f1ece2" r={0.6} />
      {/* ALACENA alta de madera con la puerta (x -3.7..-2.5) */}
      <group>
        <mesh position={[-3.1, 1.1, -2.72]}><boxGeometry args={[1.18, 2.18, 0.48]} /><meshStandardMaterial color="#8a6a4a" map={tx.planks} roughness={0.9} side={THREE.BackSide} /></mesh>
        <Box p={[-3.1, 2.22, -2.7]} s={[1.24, 0.06, 0.54]} c="#7a5638" />
        {[-3.71, -2.49].map((x) => <Box key={x} p={[x, 1.1, -2.7]} s={[0.04, 2.2, 0.52]} c="#7a5638" />)}
        {[0.5, 0.95, 1.38, 1.85].map((y) => <Box key={y} p={[-3.1, y, -2.72]} s={[1.16, 0.03, 0.46]} c="#6d4c33" r={0.8} />)}
        {[[-3.5, 0.53], [-3.35, 0.53], [-2.75, 0.98], [-3.45, 1.88], [-2.7, 1.88], [-3.55, 1.41]].map(([x, y], i) => (
          <mesh key={i} position={[x, y + 0.07, -2.78]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.14, 18]} /><meshStandardMaterial color={["#c98a3a", "#a7442e", "#e1c35a", "#8a9a5a", "#d9d2c4", "#b36a2a"][i]} roughness={0.3} transparent opacity={0.85} /></mesh>
        ))}
        <group position={[-3.7, 1.1, -2.45]} rotation={[0, -pantryDoor * 1.95, 0]}>
          <Box p={[0.6, 0, 0]} s={[1.2, 2.16, 0.035]} c="#8b6444" r={0.75} rad={0.01} />
          {[[0.6, 0.55], [0.6, -0.5]].map(([x, y], i) => <Box key={i} p={[x, y, 0.025]} s={[0.95, 0.85, 0.01]} c="#7a5638" r={0.8} rad={0.005} />)}
          <mesh position={[1.1, 0, 0.04]}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#8c7b55" metalness={0.8} roughness={0.3} /></mesh>
        </group>
      </group>
      {/* mesa larga de pino fregado + 4 sillas + lámpara colgante */}
      <group>
        <mesh position={[-0.6, 0.76, -0.4]} castShadow receiveShadow geometry={rbox(2.0, 0.05, 0.95, 0.015)}><meshStandardMaterial map={ft.pine} roughness={0.75} /></mesh>
        {[[-1.5, -0.8], [0.3, -0.8], [-1.5, 0.0], [0.3, 0.0]].map(([x, z], i) => <Box key={i} p={[x, 0.37, z]} s={[0.06, 0.74, 0.06]} c="#cdb48a" r={0.8} />)}
        {[[-1.2, -1.1, 0], [0.0, -1.1, 0], [-1.2, 0.3, Math.PI], [0.0, 0.3, Math.PI]].map(([x, z, r], i) => (
          <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
            <Box p={[0, 0.45, 0]} s={[0.42, 0.04, 0.4]} c="#a77d52" />
            <Box p={[0, 0.75, -0.19]} s={[0.42, 0.6, 0.04]} c="#a77d52" />
            {[[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]].map(([a, b], j) => <Box key={j} p={[a, 0.22, b]} s={[0.04, 0.45, 0.04]} c="#8f6a44" />)}
          </group>
        ))}
        <mesh position={[-0.6, 2.45, -0.4]}><cylinderGeometry args={[0.004, 0.004, 0.75, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[-0.6, 2.05, -0.4]} castShadow><coneGeometry args={[0.2, 0.16, 24, 1, true]} /><meshStandardMaterial color="#2f4a3a" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-0.6, 1.98, -0.4]}><sphereGeometry args={[0.04, 12, 10]} /><meshBasicMaterial color="#fff2d0" toneMapped={false} /></mesh>
      </group>
      {/* sartén de hierro y tabla de cortar en la mesada */}
      <mesh position={[-0.95, 0.95, -2.62]} castShadow><cylinderGeometry args={[0.14, 0.12, 0.04, 28]} /><meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.5} /></mesh>
      <Box p={[-0.42, 0.945, -2.66]} s={[0.36, 0.025, 0.24]} c="#b88a58" r={0.8} rad={0.01} />
      {/* tacho con tapa que se abre (uso 8) */}
      <group position={[3.4, 0, 1.1]}>
        <mesh position={[0, 0.33, 0]} castShadow><cylinderGeometry args={[0.2, 0.17, 0.66, 24]} /><meshStandardMaterial color="#8f949a" metalness={0.5} roughness={0.45} /></mesh>
        <group position={[0, 0.67, -0.2]} rotation={[-trashLid * 1.3, 0, 0]}><mesh position={[0, 0, 0.2]} castShadow><cylinderGeometry args={[0.21, 0.21, 0.03, 24]} /><meshStandardMaterial color="#7f848a" metalness={0.55} roughness={0.4} /></mesh></group>
      </group>
      <Puffs pts={stinkPts} col="#a9b24a" size={0.05} o={0.4 * stink} map={tx.flake} />
      {/* hormigas (uso 5) */}
      {ants && <Inst geo={antGeo} mat={antMat} mats={antMats} />}
      {/* EL FRASCO (mesa o alacena) + el de comparación + el rociador de miel (en el gancho no está en la mesa hasta "My name is Clem") */}
      {!(t < 21.4) && <Jar p={J.onShelf ? SHELF : twoJars ? [JAR[0] + 0.05, JAR[1], JAR[2]] : JAR} c={J.c} fill={J.fill} sprigs={J.sprigs} lid={J.lid} aroma={J.aroma} noLid={J.noLid} t={t} ry={t * 0.02} />}
      {twoJars && <Jar p={[-0.8, JAR[1], JAR[2]]} c={0.42} fill={1} sprigs={1} lid={0} t={t} ry={1.1} />}
      {sprayOnTable && <Sprayer p={[-0.02, 0.785, -0.32]} col="#f2f6f8" lvl={0.6} ry={-0.6} clear />}
      <Mist t={t} at={216.3} from={[0.03, 1.035, -0.25]} dir={[-0.6, -0.25, 0.1]} map={tx.flake} />
      <Mist t={t} at={313.2} from={[1.75, 1.1, -2.45]} dir={[-0.5, -0.55, -0.4]} map={tx.flake} />
      <Mist t={t} at={379.9} from={[3.0, 1.0, 1.4]} dir={[0.5, -0.4, -0.35]} map={tx.flake} />
      <Mist t={t} at={244.4} from={[3.4, 1.6, -0.3]} dir={[0.8, 0, -0.2]} map={tx.flake} />
    </ThreeCanvas>
  );
};

// marcadores 3D (portales y rótulos HTML)
export const BOTTLE = (i: number): V3 => [0.12 + i * 0.13, 0.33, -2.72 + (i % 2) * 0.12];
export const PT = {
  sink: [0.45, 0.4, -2.55] as V3,
  bottles: [0.45, 0.2, -2.65] as V3,
  backDoor: [-4.0, 0.6, -0.1] as V3,
  jarShelf: [SHELF[0], 1.48, SHELF[2]] as V3,
  jarTable: [JAR[0], 0.87, JAR[2]] as V3,
  jarTable2: [-0.8, 0.87, JAR[2]] as V3,
  spray: [-0.02, 0.9, -0.32] as V3,
  westWin: [4.0, 1.55, -0.5] as V3,
  fridge: [3.4, 1.0, -2.3] as V3,
  pot: [1.8, 1.08, -2.68] as V3,
  ants: [1.25, 0.93, -2.74] as V3,
  faucet: [0.45, 1.0, -2.86] as V3,
  trash: [3.4, 0.7, 1.1] as V3,
  waterer: [-9.0, 0.35, -3.3] as V3,
  weeds: [-8.0, 0.1, 3.4] as V3,
  garden: [-11.2, 0.4, 4.2] as V3,
  field: [6, 0.5, -16] as V3,
  barn: [-18, 3, -14] as V3,
  house: [0, 2.5, -0.5] as V3,
};
