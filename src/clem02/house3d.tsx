// clem02 · EL MUNDO: la casa de granja de Clem en corte (lavadero | cocina | living | baño) entre trigales de Kansas.
// Una sola escena y UNA cámara que recorre la casa cuarto por cuarto con EL frasco del abuelo (vinagre + cáscaras de naranja):
// canilla con sarro, hornallas con grasa, lavarropas que huele a pantano, salamandra con hollín, inodoro, mampara, porche, granero.
// Eventos clavados a la voz (segundos globales de caps.json). Render SÓLO en el farm (acá sólo stills).
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
// cuartos de la casa en corte (frente abierto en z=2): lavadero x -7.1..-4.1 · cocina -4.1..4.1 · living 4.1..8.1 · baño 8.1..11.1
export const JARC: [number, number, number] = [-1.05, 0.935, -2.74];  // el frasco del abuelo, al fondo de la mesada
const SINKF: [number, number, number] = [8.95, 1.0, -2.86];          // canilla del baño
const STOVE: [number, number, number] = [2.0, 0.95, -2.68];          // hornallas
const WASHER: [number, number, number] = [-6.3, 0.55, -2.55];        // lavarropas
const WSTOVE: [number, number, number] = [7.1, 0.5, -2.45];          // salamandra del living
const SHOWER: [number, number, number] = [10.55, 1.1, -0.45];        // ducha con mampara
export const KEYS: Key[] = [
  // gancho · "something for the hard water / the stove / the washing machine": la casa en corte, cuarto por cuarto
  { t: 9.6, p: [9.15, 1.42, -1.3], l: [SINKF[0], 0.98, SINKF[2]], fov: 34 },
  { t: 10.9, p: [8.95, 1.22, -2.0], l: [SINKF[0], 0.98, SINKF[2]], fov: 30 },
  { t: 12.0, p: [2.3, 1.5, -1.25], l: [STOVE[0], 0.92, STOVE[2]], fov: 34, arc: 0.25 },
  { t: 12.9, p: [2.15, 1.32, -1.65], l: [STOVE[0], 0.92, STOVE[2]], fov: 32 },
  { t: 13.9, p: [-5.2, 1.3, -0.85], l: [WASHER[0], 0.5, WASHER[2]], fov: 36, arc: 0.3 },
  { t: 16.0, p: [-5.75, 1.05, -1.45], l: [WASHER[0], 0.48, WASHER[2]], fov: 33 },
  // "picture my grandpa's kitchen in 1952": la cocina entera → UN frasco al fondo de la mesada
  { t: 20.9, p: [0.6, 2.05, 3.2], l: [-0.6, 0.9, -1.8], fov: 46 },
  { t: 24.6, p: [-0.2, 1.6, 0.9], l: [-0.8, 0.95, -2.4], fov: 40 },
  { t: 28.5, p: [-0.92, 1.12, -1.95], l: [JARC[0], 1.03, JARC[2]], fov: 30, arc: 0.1 },
  { t: 32.9, p: [-1.0, 1.06, -2.28], l: [JARC[0], 1.04, JARC[2]], fov: 26 },
  // "walk you through the house": la cámara sale de la cocina y sube: la casa entera en corte + la granja
  { t: 52.0, p: [-0.95, 1.1, -1.9], l: [JARC[0], 1.03, JARC[2]], fov: 30 },
  { t: 55.5, p: [2.0, 9.5, 8.6], l: [1.4, 0.4, -1.0], fov: 50, arc: 0.4 },
  { t: 61.8, p: [2.0, 9.8, 9.2], l: [2.0, 0.4, -1.0], fov: 54 },
  { t: 65.6, p: [-0.6, 10.2, 9.6], l: [-0.4, 0.4, -1.4], fov: 56 },
  // ===== RESTO =====
  // "Peels and vinegar": macro del frasco, el aceite que sale de las cáscaras · 2 semanas en time-lapse
  { t: 102.8, p: [-0.82, 1.08, -2.2], l: [JARC[0], 1.03, JARC[2]], fov: 28 },
  { t: 116.5, p: [-0.98, 1.02, -2.42], l: [JARC[0], 1.04, JARC[2]], fov: 24 },
  // "So let's start ... the kitchen"
  { t: 138.3, p: [1.6, 1.75, 1.6], l: [-0.4, 0.9, -2.5], fov: 42 },
  { t: 144.0, p: [0.3, 1.45, -0.9], l: [-0.3, 0.92, -2.68], fov: 36 },
  // "Now the bathroom" + "white crust, a gray ring, spots all over the shower door"
  { t: 332.8, p: [5.9, 2.1, 2.6], l: [9.4, 0.9, -1.6], fov: 44, arc: 0.3 },
  { t: 334.5, p: [7.4, 1.8, 1.4], l: [9.6, 0.9, -1.8], fov: 42 },
  { t: 339.5, p: [8.4, 1.65, 0.9], l: [9.7, 0.85, -1.9], fov: 42 },
  { t: 344.0, p: [8.9, 1.5, 0.3], l: [9.9, 0.9, -1.8], fov: 40 },
  // "Next room. The laundry"
  { t: 443.0, p: [-4.6, 1.8, 1.7], l: [-6.0, 0.6, -2.0], fov: 42 },
  { t: 446.4, p: [-5.5, 1.25, -0.9], l: [WASHER[0], 0.52, WASHER[2]], fov: 36 },
  // "Before we go outside, the living room": la salamandra con el vidrio negro de hollín
  { t: 509.7, p: [5.0, 1.9, 1.9], l: [6.6, 0.8, -1.8], fov: 44 },
  { t: 514.8, p: [6.5, 1.2, -0.9], l: [WSTOVE[0], 0.5, WSTOVE[2]], fov: 34 },
  { t: 521.3, p: [6.85, 0.95, -1.5], l: [WSTOVE[0], 0.48, WSTOVE[2]], fov: 30 },
  // "Now let's walk out to the porch": el camino de ripio al granero
  { t: 588.4, p: [-7.2, 2.5, 6.6], l: [-11.0, 0.0, 3.2], fov: 42 },
  { t: 594.1, p: [-9.4, 1.6, 5.8], l: [-11.4, 0.0, 3.4], fov: 36 },
  // "Then the barn"
  { t: 622.3, p: [-9.6, 4.2, 4.6], l: [-18, 2.2, -14], fov: 40 },
  { t: 628.3, p: [-13.6, 3.9, -6.2], l: [-18, 2.3, -14], fov: 36 },
  // "where never to use it": la casa entera, de frente
  { t: 699.3, p: [1.6, 3.4, 7.6], l: [1.6, 0.9, -1.6], fov: 50 },
  { t: 702.9, p: [1.2, 3.0, 6.6], l: [1.2, 0.9, -1.6], fov: 50 },
  // las cuentas: el mueble bajo la pileta lleno de botellas → un frasco y un rociador
  { t: 755.3, p: [0.45, 0.68, -0.85], l: [0.45, 0.38, -2.5], fov: 38 },
  { t: 781.8, p: [0.47, 0.6, -1.25], l: [0.45, 0.34, -2.62], fov: 35 },
  { t: 798.6, p: [0.45, 0.66, -0.95], l: [0.45, 0.36, -2.55], fov: 37 },
  { t: 811.7, p: [0.47, 0.57, -1.4], l: [0.45, 0.32, -2.64], fov: 33 },
  // repaso: el frasco recorre la casa de nuevo
  { t: 831.5, p: [-0.95, 1.1, -1.9], l: [JARC[0], 1.03, JARC[2]], fov: 30 },
  { t: 836.9, p: [0.2, 1.5, -0.6], l: [-0.6, 0.92, -2.6], fov: 38 },
  { t: 842.3, p: [3.2, 1.6, 0.5], l: [5.0, 0.9, -2.0], fov: 42 },
  { t: 846.7, p: [9.1, 1.6, 0.6], l: [SHOWER[0], 1.3, SHOWER[2]], fov: 40 },
  { t: 850.2, p: [9.3, 1.45, -0.6], l: [10.4, 0.45, -2.6], fov: 38 },
  { t: 852.1, p: [2.3, 1.5, -1.25], l: [STOVE[0], 0.92, STOVE[2]], fov: 34, arc: 0.3 },
  { t: 854.6, p: [-0.3, 1.4, -1.4], l: [0.45, 0.92, -2.68], fov: 34 },
  { t: 857.2, p: [-7.4, 3.0, 7.6], l: [-11.0, 0.0, 3.2], fov: 44, arc: 0.6 },
  { t: 859.7, p: [-12.5, 3.2, -4.0], l: [-18, 2.2, -14], fov: 40 },
  // cierre · la granja al atardecer, la cámara se va subiendo
  { t: 896.9, p: [9, 5, 16], l: [-2, 1, -2], fov: 40 },
  { t: 906.5, p: [22, 17, 34], l: [-4, 0, -5], fov: 42 },  // ===== tomas extra del resto (se ordenan solas) =====
  { t: 161.2, p: [-0.3, 1.3, -1.6], l: [-0.6, 0.93, -2.6], fov: 36 },
  { t: 165.2, p: [-0.5, 1.15, -2.0], l: [-0.7, 0.93, -2.7], fov: 32 },
  { t: 168.8, p: [2.3, 1.5, -1.25], l: [STOVE[0], 0.92, STOVE[2]], fov: 34 },
  { t: 174.0, p: [2.1, 1.25, -1.85], l: [STOVE[0], 0.92, STOVE[2]], fov: 30 },
  { t: 200.6, p: [2.6, 1.35, -1.4], l: [STOVE[0], 0.92, STOVE[2]], fov: 32 },
  { t: 204.4, p: [2.2, 1.2, -1.9], l: [STOVE[0], 0.92, STOVE[2]], fov: 28 },
  { t: 286.9, p: [0.45, 1.5, -1.7], l: [0.45, 0.85, -2.68], fov: 34 },
  { t: 290.2, p: [0.45, 1.3, -2.1], l: [0.45, 0.85, -2.68], fov: 30 },
  { t: 328.0, p: [0.45, 1.6, -1.2], l: [0.45, 1.65, -3.0], fov: 40 },
  { t: 405.4, p: [8.6, 1.7, 0.8], l: [9.6, 0.9, -2.0], fov: 40 },
  { t: 420.0, p: [9.0, 1.4, 0.0], l: [10.2, 0.6, -2.4], fov: 36 },
  { t: 425.3, p: [-12.5, 3.2, -4.0], l: [-18, 2.2, -14], fov: 40 },
  { t: 428.9, p: [-14.5, 2.6, -8.0], l: [-18, 2.2, -14], fov: 34 },
  { t: 565.0, p: [5.6, 1.1, 0.4], l: [6.3, 0.2, -0.8], fov: 36 },
  { t: 569.9, p: [6.0, 0.8, -0.2], l: [6.3, 0.2, -0.8], fov: 30 },
  { t: 607.4, p: [-8.8, 1.2, 5.4], l: [-9.8, 0.05, 3.4], fov: 34 },
  { t: 612.9, p: [-9.3, 0.8, 4.6], l: [-9.8, 0.05, 3.4], fov: 28 },
  { t: 677.5, p: [-10.5, 2.2, -1.5], l: [-13.5, 0.8, -4.2], fov: 38 },
  { t: 682.0, p: [-11.8, 1.6, -2.8], l: [-13.5, 0.8, -4.2], fov: 32 },
  { t: 710.9, p: [0.9, 2.6, 5.6], l: [1.0, 0.9, -1.6], fov: 48 },
  { t: 823.7, p: [-0.5, 1.3, -1.2], l: [JARC[0], 1.03, JARC[2]], fov: 34 },
  { t: 880.0, p: [6, 3, 10], l: [1, 1, -1], fov: 40 },
  { t: 893.0, p: [7, 4, 13], l: [0, 1, -1.5], fov: 40 },
];
KEYS.sort((a, b) => a.t - b.t);

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
const LIQ = [new THREE.Color("#eef3ee"), new THREE.Color("#e6c27a"), new THREE.Color("#c4893a")];
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
      {sprigs > 0 && <Peels c={c} t={t} />}
      {fill > 0.01 && (
        <mesh position={[0, 0.006 + lh / 2, 0]} renderOrder={2}>
          <cylinderGeometry args={[JR - 0.004, JR - 0.004, lh, 40]} />
          <meshStandardMaterial color={col} transparent opacity={0.2 + 0.32 * c} roughness={0.3} emissive={col} emissiveIntensity={0.08 + 0.3 * c} depthWrite={false} />
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
  return <Puffs pts={pts} col={c > 0.6 ? "#ffc27a" : "#ffd9a8"} size={0.012} o={0.55 * lid} map={tx.flake} add />;
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

// ---------------- EL FRASCO DEL ABUELO: dónde está y de qué color (clavado a la voz) ----------------
// c: 0 vinagre claro → 1 té liviano (las cáscaras ya soltaron el aceite) · peels: cáscaras adentro · lid: tapa levantada
type JS = { p: V3; c: number; peels: number; lid: number; fly: boolean };
// recorrido del frasco por la casa (gancho 52-65,6 y repaso 831,5-860): sube, cruza los cuartos y aterriza
const ROOMS: Record<string, V3> = {
  kitchen: JARC, bath: [9.35, 0.94, -2.8], laundry: [-6.3, 0.995, -2.55], living: [6.2, 0.02, -2.6],
  porch: [-7.85, 0.32, -0.4], barn: [-13.4, 0.02, -8.6],
};
const PATH1: [number, V3][] = [[55.6, JARC], [62.2, [JARC[0], 1.6, -1.6]], [62.9, [-0.1, 1.5, -1.6]], [63.5, [9.35, 1.5, -1.6]], [64.1, [-6.3, 1.6, -1.6]], [64.7, [-7.9, 1.6, 0.0]], [65.4, [-12.5, 1.8, -7.0]]];
const PATH2: [number, V3][] = [[836.9, JARC], [842.3, [0.45, 1.25, -2.4]], [846.7, [9.0, 1.4, -1.4]], [850.2, [10.2, 1.2, -1.8]], [852.1, [2.0, 1.25, -2.4]], [854.6, [0.45, 1.25, -2.4]], [857.2, [-9.6, 1.6, 3.6]], [859.7, [-13.4, 1.5, -8.6]]];
const along = (P: [number, V3][], t: number): V3 => {
  let i = 0; while (i < P.length - 1 && P[i + 1][0] <= t) i++;
  const [ta, a] = P[i], [tb, b] = P[Math.min(i + 1, P.length - 1)];
  const k = tb > ta ? ease((t - ta) / (tb - ta)) : 0;
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(Math.PI * k) * 0.25, lerp(a[2], b[2], k)];
};
export const jarState = (t: number): JS => {
  if (inR(t, 55.6, 66)) return { p: along(PATH1, t), c: 1, peels: 1, lid: 0, fly: true };
  if (inR(t, 836.9, 862)) return { p: along(PATH2, t), c: 1, peels: 1, lid: 0, fly: true };
  // time-lapse de las 2 semanas (103,5-108,5): de vinagre claro a té liviano
  if (inR(t, 76, 103.5)) return { p: JARC, c: 0, peels: 1, lid: 0, fly: false };
  if (inR(t, 103.5, 116.6)) return { p: JARC, c: ease((t - 103.6) / 4.8), peels: 1, lid: win(t, 109.5, 110.4), fly: false };
  const room = t < 332 ? "kitchen" : t < 437 ? "bath" : t < 509 ? "laundry" : t < 586 ? "living" : t < 622 ? "porch" : t < 699 ? "barn" : "kitchen";
  return { p: ROOMS[room], c: 1, peels: 1, lid: 0, fly: false };
};
// días del time-lapse (para el contador HTML)
export const lapseDay = (t: number) => (inR(t, 103.4, 109) ? 1 + 13 * cl((t - 103.6) / 4.8) : 0);

// cáscaras de naranja en espiral, flotando dentro del frasco
const PEELS = Array.from({ length: 11 }, (_, i) => ({ y: 0.03 + rnd(i, 1) * 0.11, a: rnd(i, 2) * 6.28, r: 0.006 + rnd(i, 3) * 0.014, rx: rnd(i, 4) * 3, ry: rnd(i, 5) * 3, arc: 2.6 + rnd(i, 6) * 2.4, s: 0.016 + rnd(i, 7) * 0.009 }));
const Peels: React.FC<{ c: number; t: number }> = ({ c, t }) => {
  const col = new THREE.Color("#ec8a24").lerp(new THREE.Color("#b45a1c"), c * 0.6);
  return (
    <group>
      {PEELS.map((q, i) => (
        <mesh key={i} position={[Math.cos(q.a) * q.r, q.y + Math.sin(t * 0.8 + i) * 0.003, Math.sin(q.a) * q.r]} rotation={[q.rx + Math.sin(t * 0.3 + i) * 0.08, q.ry, 0]} scale={[1, 1, 0.45]} renderOrder={3}>
          <torusGeometry args={[q.s, 0.0075, 8, 20, q.arc]} />
          <meshStandardMaterial color={col} roughness={0.55} emissive="#c2500c" emissiveIntensity={0.45} />
        </mesh>
      ))}
    </group>
  );
};

// perro de granja echado (Biscuit), respira
const Dog: React.FC<{ p: V3; ry: number; t: number }> = ({ p, ry, t }) => {
  const br = 1 + Math.sin(t * 2.2) * 0.025;
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <mesh position={[0, 0.16, 0]} scale={[0.2, 0.15 * br, 0.38]} castShadow><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#8a5a32" roughness={0.95} /></mesh>
      <mesh position={[0.05, 0.19, 0.0]} scale={[0.16, 0.11, 0.2]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#efe6d6" roughness={0.95} /></mesh>
      <mesh position={[0, 0.2, 0.42]} castShadow><sphereGeometry args={[0.11, 16, 12]} /><meshStandardMaterial color="#8a5a32" roughness={0.95} /></mesh>
      <mesh position={[0, 0.16, 0.54]} scale={[0.7, 0.6, 1]}><sphereGeometry args={[0.07, 12, 10]} /><meshStandardMaterial color="#efe6d6" roughness={0.95} /></mesh>
      <mesh position={[0, 0.17, 0.6]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#1a1412" roughness={0.3} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.09, 0.22, 0.4]} rotation={[0.2, 0, s * 0.5]} scale={[0.5, 1, 0.25]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color="#5e3a1e" roughness={0.95} /></mesh>)}
      {[-1, 1].map((s) => <mesh key={"f" + s} position={[s * 0.09, 0.05, 0.4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.24, 8]} /><meshStandardMaterial color="#efe6d6" roughness={0.95} /></mesh>)}
      <mesh position={[0.1, 0.1, -0.42]} rotation={[0.3, 0.6 + Math.sin(t * 3) * 0.25, 0]}><cylinderGeometry args={[0.02, 0.01, 0.3, 6]} /><meshStandardMaterial color="#8a5a32" roughness={0.95} /></mesh>
    </group>
  );
};

// costra blanca de sarro alrededor de una canilla (puntos instanciados)
const crustGeo = new THREE.SphereGeometry(0.009, 6, 5);
const crustMatsAt = (c: V3, n: number) => Array.from({ length: n }, (_, i) => { const a = rnd(i, 1) * 6.28, y = Math.pow(rnd(i, 2), 2.2) * 0.1, rr = 0.019 + (y < 0.01 ? rnd(i, 6) * 0.025 : 0); return M4([c[0] + Math.cos(a) * rr, c[1] + y, c[2] + Math.sin(a) * rr], [0, 0, 0], [0.5 + rnd(i, 3) * 0.6, 0.35 + rnd(i, 4) * 0.4, 0.5 + rnd(i, 5) * 0.6]); });
const CRUST_SINK = crustMatsAt([8.95, 0.88, -2.98], 240);
const CRUST_KIT = crustMatsAt([0.45, 0.937, -2.88], 200);
// manchas de agua dura en la mampara (textura) y hollín de la salamandra
const useHouseTex = () => useMemo(() => {
  const mk2 = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; };
  return {
    spots: mk2(256, 512, (g) => { g.clearRect(0, 0, 256, 512); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(240,240,232,${0.18 + 0.4 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 256, 80 + Math.pow(rnd(i, 3), 0.6) * 432, 1 + rnd(i, 4) * 4, 0, 6.3); g.fill(); } g.fillStyle = "rgba(230,230,220,.18)"; g.fillRect(0, 300, 256, 212); }),
    soot: mk2(256, 256, (g) => { g.fillStyle = "#0b0908"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(60,48,40,${0.3 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 3 + rnd(i, 4) * 14, 0, 6.3); g.fill(); } }),
    rug: mk2(512, 512, (g) => { const C = ["#9a3a2a", "#3a5a7a", "#c9a04a", "#5a6a3a", "#e6dcc6", "#7a3a4a"]; for (let r = 25; r > 0; r--) { g.fillStyle = C[r % C.length]; g.beginPath(); g.ellipse(256, 256, r * 10.2, r * 10.2, 0, 0, 6.3); g.fill(); } for (let i = 0; i < 2000; i++) { g.fillStyle = `rgba(0,0,0,${0.08 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); } }),
  };
}, []);

// ---------------- LA ESCENA ----------------
export const HouseWorld: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), ft = useFarmTex(), ht = useHouseTex();
  const J = jarState(t);
  const day = lapseDay(t), lapsing = day > 0;
  const dayLight = lapsing ? 0.62 + 0.38 * Math.cos((day - 1) * Math.PI * 2) : 1;
  const sunset = win(t, 862, 900);
  const sunCol = new THREE.Color("#fff1d8").lerp(new THREE.Color("#ffad5c"), sunset);
  const sunPos: V3 = [lerp(-22, -30, sunset), lerp(26, 9, sunset), lerp(14, 6, sunset)];
  const sky = new THREE.Color("#c9dbea").lerp(new THREE.Color("#f2b98a"), sunset);
  // eventos clavados a la voz
  const swamp = inR(t, 13.6, 16.2) ? win(t, 13.9, 14.6) : 0;                        // el lavarropas que huele a pantano
  const crustBath = t < 860 && !(inR(t, 846, 850) && t > 847.4);                      // sarro en la canilla del baño (se va en el repaso)
  const ring = inR(t, 339, 345) || inR(t, 404, 421) || inR(t, 9, 11.5) ? 1 : inR(t, 849, 852) ? 1 - win(t, 850.6, 851.6) : 0;
  const spotsO = inR(t, 846, 852) ? 1 - win(t, 847.2, 848.6) : 1;
  const soot = inR(t, 509, 522) ? 1 : t < 509 ? 1 : 0;                                 // vidrio negro → limpio (el fuego prende después)
  const fire = t > 522 && t < 586 ? 1 : 0;
  const under = inR(t, 754, 813);
  const gone = under ? cl((t - 806.6) / 2.6) : 0;                                     // "from ten bottles to one jar"
  const weedsDead = inR(t, 856, 860) ? win(t, 857.3, 858.6) : 0;
  const washerDoor = inR(t, 443, 447) ? win(t, 444.6, 445.5) : 0;
  const swampPts: number[] = [];
  if (swamp > 0.01) for (let i = 0; i < 200; i++) { const ph = (t * 0.3 + rnd(i, 2)) % 1; swampPts.push(-6.3 + Math.sin(ph * 9 + i) * 0.14 * (1 + ph), 0.6 + ph * 0.9, -2.2 + Math.cos(ph * 7 + i) * 0.12); }
  const firePts: number[] = [];
  if (fire) for (let i = 0; i < 160; i++) { const ph = (t * (0.9 + rnd(i, 1)) + rnd(i, 2)) % 1; firePts.push(7.1 + (rnd(i, 3) - 0.5) * 0.3 * (1 - ph), 0.3 + ph * 0.32, -2.5 + (rnd(i, 4) - 0.5) * 0.18); }
  const BOT = ["#3d7fd6", "#57b84a", "#e8c531", "#d8473a", "#59c3c3", "#e6e6e0", "#b05ad6", "#f08a2a", "#4a9ad6", "#c8d84a"];
  const crustM = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f2efe6", roughness: 1 }), []);
  const W1 = "#e8e0cf";
  const roofOff = inR(t, 53.5, 66.2);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.22 + 0.25 * sunset} threshold={0.88} exposure={0.95 + 0.1 * sunset} env={0.32} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 45, 140]} />
      <hemisphereLight args={["#dbe8f5", "#8a7650", 0.62 * (lapsing ? 0.35 + 0.65 * dayLight : 1)]} />
      <directionalLight position={sunPos} intensity={(2.3 - 0.6 * sunset) * (lapsing ? 0.15 + 0.85 * dayLight : 1)} color={sunCol} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={26} shadow-camera-bottom={-26} shadow-camera-far={90} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[-0.6, 2.05, -0.4]} intensity={(lapsing ? 0.3 : 1) * 3.2} distance={6} color="#ffd9a0" decay={1.6} />
      <pointLight position={[0.45, 1.7, -2.2]} intensity={2.4 * (lapsing ? 0.2 + 0.8 * dayLight : 1)} distance={5} color="#f4f0e6" decay={1.6} />
      <pointLight position={[-1.05, 1.5, -2.1]} intensity={lapsing ? 0.4 + 1.4 * dayLight : 1.2} distance={2.2} color="#ffe2b0" decay={1.6} />
      <pointLight position={[9.6, 2.1, -1.2]} intensity={2.2} distance={5} color="#f4f6f8" decay={1.6} />
      <pointLight position={[-5.6, 2.1, -1.0]} intensity={2.0} distance={5} color="#fff0d8" decay={1.6} />
      <pointLight position={[6.1, 2.1, -0.8]} intensity={2.0} distance={5} color="#ffdcae" decay={1.6} />
      {fire > 0 && <pointLight position={[7.1, 0.5, -2.2]} intensity={2.2 + Math.sin(t * 17) * 0.4} distance={3.2} color="#ff9a3c" decay={1.6} />}

      {/* suelo: trigal + patio + camino de ripio (del porche al granero) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[400, 400]} /><meshStandardMaterial map={ft.field} roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.004, -1]} receiveShadow><planeGeometry args={[34, 26]} /><meshStandardMaterial map={ft.yard} roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, -0.4]} position={[-9.6, 0.008, 3.9]} receiveShadow><planeGeometry args={[1.3, 8.6]} /><meshStandardMaterial map={ft.gravel} roughness={1} /></mesh>
      <group position={[-1.8, 0, 0]}><Weeds dead={weedsDead} /></group>
      <Wheat t={t} sunset={sunset} />
      <Barn map={ft.barn} />
      {/* gallinero + gallinas */}
      <group position={[-11.6, 0, -5.4]} rotation={[0, 0.5, 0]}>
        <Box p={[0, 0.9, 0]} s={[2.2, 1.4, 1.6]} c="#9a3326" map={ft.barn} />
        <Box p={[0, 1.7, 0]} s={[2.5, 0.12, 1.9]} c="#5b5e63" rot={[0.25, 0, 0]} />
        <Box p={[0.5, 0.55, 0.81]} s={[0.4, 0.5, 0.04]} c="#2a1e16" />
      </group>
      {[[-10.2, -3.4, 2.4], [-11.0, -3.5, -1.9], [-10.7, -4.1, 0.2], [-10.1, -4.0, 3.4], [-11.3, -3.8, -2.8]].map(([x, z, r], i) => <Hen key={i} p={[x, 0, z]} ry={r} t={t} i={i} />)}
      {/* camioneta azul vieja junto al granero */}
      <group position={[-13.5, 0, -4.2]} rotation={[0, 0.9, 0]}>
        <Box p={[0, 0.55, 0]} s={[1.8, 0.6, 4.2]} c="#3c5a7a" r={0.5} m={0.3} rad={0.08} />
        <Box p={[0, 1.05, 0.55]} s={[1.7, 0.6, 1.4]} c="#3c5a7a" r={0.5} m={0.3} rad={0.08} />
        <Box p={[0, 1.08, 1.27]} s={[1.5, 0.48, 0.03]} c="#9fb6c6" r={0.1} m={0.6} />
        {[[-0.9, 1.3], [0.9, 1.3], [-0.9, -1.3], [0.9, -1.3]].map(([x, z], i) => <mesh key={i} position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 0.22, 20]} /><meshStandardMaterial color="#1c1c1c" roughness={0.9} /></mesh>)}
      </group>

      {/* ===== LA CASA (frente abierto en z=2) ===== */}
      {/* fondo: lavadero | cocina (con la ventana de la pileta) | living | baño (ventanita) */}
      <Slab p={[-5.6, 1.2, -3.1]} s={[3.0, 2.4, 0.2]} c={W1} map={ft.wall} />
      <Slab p={[-2.2, 1.4, -3.1]} s={[4.1, 2.8, 0.2]} c={W1} map={ft.wall} />
      <Slab p={[2.7, 1.4, -3.1]} s={[3.3, 2.8, 0.2]} c={W1} map={ft.wall} />
      <Slab p={[0.45, 0.6, -3.1]} s={[1.2, 1.2, 0.2]} c={W1} map={ft.wall} />
      <Slab p={[0.45, 2.45, -3.1]} s={[1.2, 0.7, 0.2]} c={W1} map={ft.wall} />
      <Slab p={[6.1, 1.4, -3.1]} s={[4.0, 2.8, 0.2]} c="#e6dccb" map={ft.wall} />
      <Slab p={[9.6, 1.4, -3.1]} s={[3.0, 2.8, 0.2]} c="#eef0ec" map={ft.wall} />
      {/* tabiques con puertas: lavadero|cocina (la puerta de atrás) · cocina|living · living|baño */}
      <Slab p={[-4.1, 1.4, -1.85]} s={[0.2, 2.8, 2.5]} c={W1} map={ft.wall} />
      <Slab p={[-4.1, 1.4, 1.2]} s={[0.2, 2.8, 1.6]} c={W1} map={ft.wall} />
      <Slab p={[-4.1, 2.45, -0.1]} s={[0.2, 0.7, 1.0]} c={W1} map={ft.wall} />
      <Slab p={[4.1, 1.4, -2.25]} s={[0.2, 2.8, 1.7]} c={W1} map={ft.wall} />
      <Slab p={[4.1, 1.4, 1.2]} s={[0.2, 2.8, 1.6]} c={W1} map={ft.wall} />
      <Slab p={[4.1, 2.47, -0.5]} s={[0.2, 0.65, 1.8]} c={W1} map={ft.wall} />
      <Slab p={[8.1, 1.4, -2.1]} s={[0.2, 2.8, 2.0]} c="#eef0ec" map={ft.wall} />
      <Slab p={[8.1, 1.4, 1.35]} s={[0.2, 2.8, 1.3]} c="#eef0ec" map={ft.wall} />
      <Slab p={[8.1, 2.45, -0.4]} s={[0.2, 0.7, 1.4]} c="#eef0ec" map={ft.wall} />
      {/* paredes exteriores: lavadero (con la puerta al porche) y baño */}
      <Slab p={[-7.1, 1.2, -2.0]} s={[0.2, 2.4, 2.2]} c={W1} map={ft.wall} />
      <Slab p={[-7.1, 1.2, 1.3]} s={[0.2, 2.4, 1.4]} c={W1} map={ft.wall} />
      <Slab p={[-7.1, 2.2, -0.35]} s={[0.2, 0.4, 1.1]} c={W1} map={ft.wall} />
      <Slab p={[11.1, 1.4, -0.55]} s={[0.2, 2.8, 5.1]} c="#eef0ec" map={ft.wall} />
      {/* marco de la ventana de la pileta + cortinita */}
      {[[-0.15, 1.65, 0.06, 0.95], [1.05, 1.65, 0.06, 0.95], [0.45, 1.65, 0.04, 0.9], [0.45, 1.2, 1.3, 0.07], [0.45, 2.1, 1.3, 0.06]].map(([x, y, w, h], i) => <Box key={i} p={[x, y, -3.0]} s={[w, h, 0.06]} c="#f2ede2" r={0.6} rad={0.01} />)}
      <Box p={[0.45, 1.17, -2.92]} s={[1.3, 0.04, 0.16]} c="#efe9dd" r={0.6} rad={0.01} />
      {[-0.05, 0.95].map((x) => <Box key={x} p={[x, 1.86, -2.95]} s={[0.24, 0.56, 0.03]} c="#d9d2bf" r={1} rad={0.01} />)}
      {/* pisos: tablas (cocina, living, lavadero) + baldosas blancas (baño) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.006, -0.5]} receiveShadow><planeGeometry args={[15.2, 5]} /><meshStandardMaterial map={tx.planks} roughness={0.6} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.6, 0.008, -0.55]} receiveShadow><planeGeometry args={[3.0, 5.1]} /><meshStandardMaterial color="#e9ecea" roughness={0.35} /></mesh>
      <Box p={[2.0, 0.0, -0.5]} s={[18.6, 0.012, 5.2]} c="#5a4130" r={1} rad={0.003} />
      {/* cielorraso + techos */}
      {!roofOff && <group><Box p={[2.0, 2.86, -0.5]} s={[18.4, 0.12, 5.2]} c={W1} />{[-1, 1].map((sd) => <group key={sd} position={[2.0, 3.55, -0.5 + sd * 1.45]} rotation={[sd * -0.55, 0, 0]}><Box p={[0, 0, 0]} s={[18.8, 0.16, 3.3]} c="#4a4d52" r={0.7} m={0.3} /></group>)}</group>}
      {/* porche de atrás (sale del lavadero) + romero */}
      <Box p={[-7.95, 0.15, -0.3]} s={[1.5, 0.3, 2.4]} c="#9b9488" map={tx.planks} />
      {[0, 1].map((k) => <Box key={k} p={[-8.85 - k * 0.3, 0.1 - k * 0.05, -0.3]} s={[0.35, 0.2 - k * 0.1, 1.2]} c="#8e877b" />)}
      {[-1.3, 0.8].map((z) => <Box key={z} p={[-8.6, 1.3, z]} s={[0.1, 2.3, 0.1]} c="#efe9dd" />)}
      <Box p={[-7.95, 2.5, -0.3]} s={[1.8, 0.1, 2.6]} c="#4a4d52" />
      <Bush p={[-8.9, 0, -2.2]} />

      {/* ===== COCINA ===== */}
      <Box p={[-0.7, 0.45, -2.68]} s={[1.4, 0.9, 0.6]} c="#efeadf" r={0.7} />
      <Box p={[1.25, 0.45, -2.68]} s={[0.7, 0.9, 0.6]} c="#efeadf" r={0.7} />
      <Box p={[-0.15, 0.915, -2.68]} s={[2.5, 0.04, 0.64]} c="#d9d2c4" r={0.4} />
      <Box p={[1.25, 0.915, -2.68]} s={[0.72, 0.04, 0.64]} c="#d9d2c4" r={0.4} />
      <Box p={[-2.15, 0.45, -2.68]} s={[1.5, 0.9, 0.6]} c="#efeadf" r={0.7} />
      <Box p={[-2.15, 0.915, -2.68]} s={[1.52, 0.04, 0.64]} c="#d9d2c4" r={0.4} />
      <Box p={[0.45, 0.82, -2.68]} s={[0.92, 0.24, 0.6]} c="#f6f6f2" r={0.18} rad={0.04} />
      <mesh position={[0.45, 0.86, -2.68]}><boxGeometry args={[0.8, 0.2, 0.46]} /><meshStandardMaterial color="#e9eae6" roughness={0.2} side={THREE.BackSide} /></mesh>
      <group position={[0.45, 0.93, -2.88]}>
        <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.016, 0.02, 0.24, 18]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[0, 0.24, 0.07]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.013, 0.013, 0.16, 16]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[0, 0.22, 0.15]}><cylinderGeometry args={[0.014, 0.012, 0.05, 16]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
      </group>
      {inR(t, 8, 17) && <Inst geo={crustGeo} mat={crustM} mats={CRUST_KIT} />}
      {/* mueble bajo la pileta: puertas + las 10 botellas de la cuenta → un frasco y un rociador */}
      <mesh position={[0.45, 0.45, -2.72]}><boxGeometry args={[0.88, 0.76, 0.52]} /><meshStandardMaterial color="#3b342c" roughness={1} side={THREE.BackSide} /></mesh>
      <group position={[0.0, 0.46, -2.375]} rotation={[0, -(under ? 1.9 : 0), 0]}><Box p={[0.222, 0, 0]} s={[0.44, 0.74, 0.025]} c="#f1ece2" r={0.6} rad={0.008} /></group>
      <group position={[0.9, 0.46, -2.375]} rotation={[0, under ? 1.9 : 0, 0]}><Box p={[-0.222, 0, 0]} s={[0.44, 0.74, 0.025]} c="#f1ece2" r={0.6} rad={0.008} /></group>
      {under && BOT.map((c, i) => {
        const g = cl(gone * 1.6 - i * 0.06);
        if (g >= 1) return null;
        return <Sprayer key={i} p={[0.1 + (i % 5) * 0.17, 0.06 + g * 0.5, -2.82 + Math.floor(i / 5) * 0.2 + g * 0.6]} col={c} lvl={0.5} ry={i * 0.7} s={1.05 * (1 - g)} />;
      })}
      {under && gone > 0.5 && <group><Jar p={[0.35, 0.09, -2.7]} c={1} fill={1} sprigs={1} lid={0} t={t} ry={0.3} /><Sprayer p={[0.62, 0.09, -2.66]} col="#f2f6f8" lvl={0.6} ry={-0.6} s={1.05} clear /></group>}
      {/* cocina enlozada blanca con grasa de panceta en las hornallas */}
      <Box p={[2.0, 0.45, -2.68]} s={[0.78, 0.9, 0.6]} c="#f4f2ec" r={0.35} m={0.1} />
      <Box p={[2.0, 0.92, -2.68]} s={[0.8, 0.03, 0.62]} c="#efece4" r={0.3} />
      <Box p={[2.0, 1.12, -2.96]} s={[0.8, 0.36, 0.06]} c="#f4f2ec" r={0.35} />
      {[[1.8, -2.68], [2.2, -2.55], [2.2, -2.82], [1.8, -2.5]].map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, 0.94, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.01, 6, 24]} /><meshStandardMaterial color="#333" metalness={0.6} /></mesh>
          {(t < 17 || inR(t, 165, 210) || inR(t, 850, 853)) && <mesh position={[x, 0.938, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 24]} /><meshStandardMaterial color="#6b4a1f" roughness={0.25} transparent opacity={inR(t, 850, 853) ? 0.75 * (1 - win(t, 852.2, 853)) : 0.75} /></mesh>}
        </group>
      ))}
      {/* heladera vieja + alacenas + cafetera + microondas */}
      <Box p={[3.4, 0.86, -2.62]} s={[0.86, 1.72, 0.66]} c="#efe9da" r={0.3} m={0.05} rad={0.09} />
      <Box p={[3.78, 1.06, -2.28]} s={[0.04, 0.32, 0.04]} c="#c9cdd2" m={0.9} r={0.2} rad={0.01} />
      <Box p={[-0.85, 1.85, -2.83]} s={[1.1, 0.72, 0.34]} c="#f1ece2" r={0.6} />
      <Box p={[1.9, 1.85, -2.83]} s={[1.4, 0.72, 0.34]} c="#f1ece2" r={0.6} />
      <Box p={[-2.15, 1.85, -2.83]} s={[1.4, 0.72, 0.34]} c="#f1ece2" r={0.6} />
      <Box p={[-1.75, 1.07, -2.78]} s={[0.22, 0.3, 0.22]} c="#f3f2ee" r={0.4} rad={0.02} />
      <mesh position={[-1.75, 0.98, -2.68]}><cylinderGeometry args={[0.07, 0.065, 0.11, 20]} /><meshPhysicalMaterial color="#e8eef0" transparent opacity={0.35} roughness={0.05} /></mesh>
      <Box p={[-2.4, 1.07, -2.74]} s={[0.5, 0.3, 0.36]} c="#f1f0eb" r={0.4} rad={0.02} />
      <Box p={[-2.47, 1.07, -2.555]} s={[0.3, 0.2, 0.01]} c="#2a2c2e" r={0.1} m={0.4} />
      {/* mesa larga de pino + sillas + lámpara */}
      <group>
        <mesh position={[-0.6, 0.76, -0.4]} castShadow receiveShadow geometry={rbox(2.0, 0.05, 0.95, 0.015)}><meshStandardMaterial map={ft.pine} roughness={0.75} /></mesh>
        {[[-1.5, -0.8], [0.3, -0.8], [-1.5, 0.0], [0.3, 0.0]].map(([x, z], i) => <Box key={i} p={[x, 0.37, z]} s={[0.06, 0.74, 0.06]} c="#cdb48a" r={0.8} />)}
        {[[-1.2, -1.1, 0], [0.0, -1.1, 0], [-1.2, 0.3, Math.PI], [0.0, 0.3, Math.PI]].map(([x, z, r], i) => (
          <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
            <Box p={[0, 0.45, 0]} s={[0.42, 0.04, 0.4]} c="#a77d52" />
            <Box p={[0, 0.75, -0.19]} s={[0.42, 0.6, 0.04]} c="#a77d52" />
          </group>
        ))}
        <mesh position={[-0.6, 2.45, -0.4]}><cylinderGeometry args={[0.004, 0.004, 0.75, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[-0.6, 2.05, -0.4]} castShadow><coneGeometry args={[0.2, 0.16, 24, 1, true]} /><meshStandardMaterial color="#2f4a3a" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-0.6, 1.98, -0.4]}><sphereGeometry args={[0.04, 12, 10]} /><meshBasicMaterial color="#fff2d0" toneMapped={false} /></mesh>
        {/* naranjas en un plato */}
        {[[-0.95, -0.35], [-0.86, -0.42], [-0.9, -0.27]].map(([x, z], i) => <mesh key={i} position={[x, 0.82, z]} castShadow><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#ec8a24" roughness={0.6} /></mesh>)}
        <mesh position={[-0.9, 0.79, -0.35]}><cylinderGeometry args={[0.13, 0.11, 0.015, 24]} /><meshStandardMaterial color="#f4f1ea" roughness={0.4} /></mesh>
      </group>
      <mesh position={[-1.3, 0.95, -2.62]} castShadow><cylinderGeometry args={[0.14, 0.12, 0.04, 28]} /><meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.5} /></mesh>

      {/* ===== LIVING: salamandra de hierro + alfombra trenzada + sillón + Biscuit ===== */}
      <group position={[WSTOVE[0], 0, -2.55]}>
        <Box p={[0, 0.42, 0]} s={[0.62, 0.62, 0.5]} c="#1c1b1b" r={0.7} m={0.5} rad={0.03} />
        <Box p={[0, 0.06, 0]} s={[0.7, 0.1, 0.56]} c="#232120" r={0.7} m={0.5} />
        <mesh position={[0, 1.6, -0.1]} castShadow><cylinderGeometry args={[0.07, 0.07, 2.4, 16]} /><meshStandardMaterial color="#1f1e1d" metalness={0.6} roughness={0.5} /></mesh>
        <mesh position={[0, 0.43, 0.252]}><planeGeometry args={[0.4, 0.34]} /><meshStandardMaterial map={ht.soot} transparent opacity={0.96 * soot} roughness={0.9} /></mesh>
        <mesh position={[0, 0.43, 0.251]}><planeGeometry args={[0.4, 0.34]} /><meshStandardMaterial color={fire ? "#ff8a2a" : "#1a1210"} emissive={fire ? "#ff6a10" : "#000"} emissiveIntensity={fire ? 1.4 + Math.sin(t * 13) * 0.3 : 0} roughness={0.6} /></mesh>
        <Box p={[0, 0.43, 0.26]} s={[0.46, 0.4, 0.02]} c="#2a2826" m={0.6} r={0.4} rad={0.005} o={0.0001} />
        {[[-0.22, 0.43], [0.22, 0.43]].map(([x, y], i) => <Box key={i} p={[x, y, 0.26]} s={[0.03, 0.4, 0.03]} c="#2a2826" m={0.6} r={0.4} rad={0.005} />)}
        {[0.24, 0.62].map((y) => <Box key={y} p={[0, y, 0.26]} s={[0.46, 0.03, 0.03]} c="#2a2826" m={0.6} r={0.4} rad={0.005} />)}
      </group>
      <Puffs pts={firePts} col="#ffb44a" size={0.03} o={0.8 * fire} map={tx.flake} add />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.1, 0.012, -0.9]} receiveShadow><circleGeometry args={[0.95, 48]} /><meshStandardMaterial map={ht.rug} roughness={1} /></mesh>
      <Box p={[5.0, 0.4, -2.2]} s={[0.9, 0.8, 0.85]} c="#7a4a3a" r={0.95} rad={0.12} />
      <Box p={[5.0, 0.85, -2.55]} s={[0.9, 0.7, 0.2]} c="#7a4a3a" r={0.95} rad={0.08} />
      <Dog p={[6.3, 0.012, -0.8]} ry={-0.9} t={t} />
      {/* ===== BAÑO: lavabo con sarro, inodoro con sarro, ducha con mampara manchada ===== */}
      <group position={[8.95, 0, -2.8]}>
        <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.09, 0.13, 0.8, 18]} /><meshStandardMaterial color="#f6f6f2" roughness={0.2} /></mesh>
        <Box p={[0, 0.84, 0.02]} s={[0.56, 0.12, 0.42]} c="#f6f6f2" r={0.18} rad={0.05} />
        <mesh position={[0, 0.98, -0.12]} castShadow><cylinderGeometry args={[0.014, 0.018, 0.2, 14]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[0, 1.07, -0.06]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.011, 0.011, 0.13, 12]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <Box p={[0, 1.55, -0.2]} s={[0.5, 0.6, 0.02]} c="#cfd8dc" r={0.05} m={0.8} />
      </group>
      {crustBath && <Inst geo={crustGeo} mat={crustM} mats={CRUST_SINK} />}
      <group position={[10.4, 0, -2.65]}>
        <Box p={[0, 0.2, 0.05]} s={[0.36, 0.4, 0.5]} c="#f6f6f2" r={0.2} rad={0.12} />
        <mesh position={[0, 0.42, 0.1]}><cylinderGeometry args={[0.2, 0.18, 0.06, 28]} /><meshStandardMaterial color="#f6f6f2" roughness={0.2} /></mesh>
        <mesh position={[0, 0.43, 0.1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.15, 28]} /><meshStandardMaterial color="#cfe0e4" roughness={0.05} /></mesh>
        <mesh position={[0, 0.435, 0.1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.12, 0.15, 28]} /><meshStandardMaterial color="#7d7468" roughness={0.9} transparent opacity={0.85 * ring} /></mesh>
        <Box p={[0, 0.72, -0.16]} s={[0.4, 0.5, 0.18]} c="#f6f6f2" r={0.2} rad={0.04} />
      </group>
      <group>
        <Box p={[10.55, 0.05, -0.45]} s={[1.0, 0.1, 1.3]} c="#f2f3f1" r={0.2} />
        <mesh position={[10.05, 1.05, -0.45]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.3, 1.9]} /><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.18} roughness={0.05} clearcoat={1} depthWrite={false} side={THREE.DoubleSide} /></mesh>
        <mesh position={[10.04, 1.05, -0.45]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[1.3, 1.9]} /><meshStandardMaterial map={ht.spots} transparent opacity={spotsO} depthWrite={false} roughness={1} /></mesh>
        <mesh position={[10.98, 1.9, -0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.25, 10]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
        <mesh position={[10.83, 1.86, -0.45]} rotation={[0, 0, -0.6]}><cylinderGeometry args={[0.05, 0.03, 0.04, 18]} /><meshStandardMaterial color="#d6d9dd" metalness={1} roughness={0.12} /></mesh>
      </group>
      {/* ===== LAVADERO: lavarropas de carga frontal, estante, botas con sal sobre la alfombrita ===== */}
      <group position={[WASHER[0], 0, -2.6]}>
        <Box p={[0, 0.45, 0]} s={[0.66, 0.9, 0.62]} c="#f4f4f1" r={0.35} rad={0.04} />
        <mesh position={[0, 0.42, 0.312]} rotation={[0, washerDoor * -1.4, 0]}><torusGeometry args={[0.2, 0.035, 10, 32]} /><meshStandardMaterial color="#c9cdd2" metalness={0.8} roughness={0.25} /></mesh>
        <mesh position={[0, 0.42, 0.31]}><circleGeometry args={[0.18, 32]} /><meshPhysicalMaterial color="#5b6670" transparent opacity={0.65} roughness={0.08} clearcoat={1} /></mesh>
        <Box p={[-0.18, 0.84, 0.29]} s={[0.22, 0.05, 0.02]} c="#dfe1e3" r={0.4} rad={0.008} />
      </group>
      <Puffs pts={swampPts} col="#8d9a3a" size={0.06} o={0.45 * swamp} map={tx.flake} />
      <Box p={[-5.5, 1.75, -2.9]} s={[1.6, 0.04, 0.32]} c="#8a6a4a" r={0.9} />
      {[[-6.0, 1.86], [-5.7, 1.86], [-5.2, 1.86]].map(([x, y], i) => <mesh key={i} position={[x, y, -2.9]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.2, 18]} /><meshStandardMaterial color={["#e6e6e0", "#a7c7d8", "#d9d2c4"][i]} roughness={0.4} /></mesh>)}
      <Box p={[-6.4, 0.015, 0.7]} s={[0.9, 0.02, 0.6]} c="#5a4a3a" r={1} rad={0.004} />
      {[-0.13, 0.13].map((dz, i) => (
        <group key={i} position={[-6.45 + i * 0.06, 0.03, 0.7 + dz]} rotation={[0, 0.2, 0]}>
          <Box p={[0, 0.07, 0.02]} s={[0.11, 0.12, 0.3]} c="#6b4628" r={0.7} rad={0.04} />
          <Box p={[0, 0.2, -0.07]} s={[0.11, 0.26, 0.12]} c="#6b4628" r={0.7} rad={0.03} />
        </group>
      ))}
      {/* EL FRASCO DEL ABUELO (cáscaras de naranja) + el rociador mitad y mitad */}
      <group position={J.p} scale={J.fly ? 5.5 : 1.45}>
        <Jar p={[0, 0, 0]} c={J.c} fill={1} sprigs={J.peels} lid={J.lid} t={t} ry={t * (J.fly ? 0.6 : 0.02)} />
      </group>
      {t >= 128 && t < 332 && <Sprayer p={[-0.72, 0.935, -2.66]} col="#f2f6f8" lvl={0.6} ry={-0.6} clear />}
    </ThreeCanvas>
  );
};

// marcadores 3D (portales y rótulos HTML)
export const PT = {
  jar: [JARC[0], 1.05, JARC[2]] as V3,
  sinkBath: [8.95, 1.0, -2.86] as V3,
  stove: [STOVE[0], 0.95, STOVE[2]] as V3,
  washer: [WASHER[0], 0.6, -2.3] as V3,
  toilet: [10.4, 0.45, -2.55] as V3,
  showerDoor: [10.05, 1.2, -0.45] as V3,
  showerHead: [10.83, 1.86, -0.45] as V3,
  wstove: [WSTOVE[0], 0.43, -2.3] as V3,
  dog: [6.3, 0.25, -0.6] as V3,
  kitchen: [-0.4, 1.0, -1.5] as V3,
  bath: [9.6, 1.0, -1.2] as V3,
  laundry: [-5.6, 1.0, -1.2] as V3,
  living: [6.1, 1.0, -1.2] as V3,
  porch: [-7.95, 0.8, -0.3] as V3,
  barn: [-18, 3, -14] as V3,
  weeds: [-9.8, 0.1, 3.4] as V3,
  under: [0.45, 0.25, -2.6] as V3,
  coffee: [-1.75, 1.1, -2.7] as V3,
  drain: [0.45, 0.92, -2.68] as V3,
  house: [2.0, 2.5, -0.5] as V3,
};
