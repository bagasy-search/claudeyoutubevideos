// clducha · LA CÁMARA (una sola, todo el video): llaves en segundos globales (= tiempo de la voz).
import * as THREE from "three";
import { REST_KEYS } from "./rest_plan";
export const FPS = 30, W = 1920, H = 1080;
type V3 = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const TR = 0.06, PI_ = 0.156, LOW = TR + PI_; // la junta de la fila de abajo
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const KEYS1: Key[] = [
  // GANCHO · de noche: la cámara baja con la linterna hasta la junta negra de abajo ("como con lápiz")
  { t: 8.6, p: [0.3, 1.0, 0.5], l: [-0.3, 0.45, -1], fov: 40 },
  { t: 12.0, p: [0.0, 0.36, -0.45], l: [-0.2, LOW, -1], fov: 34 },
  { t: 15.9, p: [-0.08, 0.27, -0.62], l: [-0.2, LOW - 0.01, -1], fov: 30 },
  // "y hoy otra vez" (de día) → se abre: "a la altura de sus pies"
  { t: 21.0, p: [0.05, 0.4, -0.35], l: [-0.25, 0.25, -1], fov: 34 },
  { t: 23.8, p: [0.6, 0.9, 0.9], l: [-0.2, 0.35, -0.9], fov: 40 },
  { t: 27.45, p: [0.55, 0.85, 0.85], l: [-0.2, 0.3, -0.9], fov: 40 },
  // "le voy a decir algo": vuela a LA JUNTA EN CORTE (la ciudad)
  { t: 28.5, p: [6.5, 3.6, 6.2], l: [12, 0, 1.2], fov: 45 },
  { t: 29.9, p: [12.95, 0.55, 3.2], l: [12.4, -0.05, 1.6], fov: 38 },
  // "está ADENTRO… el cloro nunca llega": macro a la calle con las raíces
  { t: 33.5, p: [12.8, 0.26, 2.6], l: [12.58, -0.07, 1.62], fov: 36 },
  { t: 37.0, p: [12.95, 0.15, 2.25], l: [12.58, -0.07, 1.62], fov: 34 },
  // "esa noche aprendí…": la ciudad entera, las raíces encendidas
  { t: 58.8, p: [13.8, 1.0, 4.0], l: [12.2, -0.1, 1.0], fov: 40 },
  { t: 62.2, p: [13.2, 0.7, 3.4], l: [12.2, -0.1, 1.0], fov: 40 },
  // cosa 1 · por qué el cloro falla
  { t: 67.6, p: [12.3, 0.35, 2.7], l: [11.42, -0.06, 1.62], fov: 36 },
  { t: 73.6, p: [11.9, 0.2, 2.3], l: [11.42, -0.07, 1.62], fov: 32 },
  // CTA1 · del baño al carrito del pasillo: la guía en la pág. 19
  { t: 88.04, p: [1.0, 1.6, 2.2], l: [-0.2, 0.6, -0.9], fov: 42 },
  { t: 90.2, p: [2.8, 1.8, 2.4], l: [3.3, 0.95, 0.3], fov: 38 },
  { t: 92.5, p: [3.25, 1.52, 0.88], l: [3.15, 0.965, 0.3], fov: 35 },
  { t: 103.3, p: [3.25, 1.46, 0.8], l: [3.18, 0.965, 0.3], fov: 33 },
  { t: 106.3, p: [3.25, 1.46, 0.8], l: [3.18, 0.965, 0.3], fov: 33 },
  { t: 107.0, p: [2.0, 2.9, 1.8], l: [0.0, 0.6, -0.7], fov: 42 },
  { t: 107.9, p: [0.55, 1.05, 0.75], l: [-0.2, 0.3, -0.9], fov: 38 },
  { t: 109.5, p: [0.35, 0.7, 0.3], l: [-0.2, 0.3, -0.9], fov: 36 },
];
export const KEYS: Key[] = [...KEYS1, ...REST_KEYS]; // el resto (rest_plan.ts) sigue la misma cámara
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t && t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.004, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
