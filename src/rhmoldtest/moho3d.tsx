// rhmoldtest · EL MUNDO: un baño familiar de Ohio en corte de casa de muñecas (frente abierto), con la bañera y su cordón de
// silicona; el moho negro en la esquina; la nube de esporas que viaja a la toalla, al extractor y al techo; al lado, en el
// pasillo, la mesita con el balde de Rhonda y LA GUÍA. Y lejos (x = 40), el MICROSCOPIO: el mismo cordón de silicona cortado
// (1 unidad = 1 mm), translúcido, con las RAÍCES del moho adentro, los tallos con sus esporas arriba y las cerdas del cepillo.
// UNA escena y UNA cámara; los saltos baño ↔ microscopio se tapan con portales 2D. Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---------------- puntos del mundo ----------------
export const X0: V3 = [40, 0, 0]; // origen del microscopio (mm)
export const ML = 3; // largo del tramo de silicona en el microscopio; la cara cortada está en x = X0+ML
export const PT = {
  corner: [-1.5, 0.57, -1.47] as V3,      // la esquina de la bañera (cordón de silicona con moho)
  dab: [-1.38, 0.565, -1.49] as V3,       // donde se moja el hisopo
  towel: [1.15, 1.15, -1.42] as V3,
  vent: [0.2, 2.44, -0.6] as V3,
  ceil: [-0.55, 2.445, -0.95] as V3,      // la mancha del techo (plato)
  sill: [-1.58, 1.3, 0.25] as V3,
  book: [2.55, 0.8, 0.25] as V3,
  // microscopio
  colony: add(X0, [ML - 0.35, 0.62, -0.95]) as V3,
  roots: add(X0, [ML, 0.35, -1.25]) as V3,
  spore: add(X0, [ML - 0.2, 1.35, -0.6]) as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const M = (p: V3): V3 => add(X0, p);
export const KEYS: Key[] = [
  // B · el baño entero: "vas a desparramar ese moho por todo el baño"
  { t: 3.0, p: [1.75, 1.95, 2.7], l: [-0.45, 1.15, -1.0], fov: 40 },
  { t: 5.8, p: [1.05, 1.7, 2.0], l: [-0.6, 1.05, -1.1], fov: 40 },
  // C · baja a la esquina de la bañera ("a black spot in the corner")
  { t: 7.5, p: [-0.92, 0.88, -0.72], l: PT.corner, fov: 34 },
  { t: 8.8, p: [-1.12, 0.74, -1.02], l: PT.corner, fov: 32 },
  // E · MICROSCOPIO: las cerdas golpean, las esporas vuelan (14,4) y suben hacia la cámara ("into the air")
  { t: 12.0, p: M([ML + 1.6, 1.25, 1.1]), l: M([ML - 0.6, 0.55, -1.0]), fov: 40 },
  { t: 14.6, p: M([ML + 0.9, 1.0, 0.45]), l: M([ML - 0.5, 0.65, -0.95]), fov: 38 },
  { t: 16.9, p: M([ML + 2.6, 3.4, 2.8]), l: M([ML - 0.5, 1.4, -0.8]), fov: 44 },
  // G · el hisopo en la esquina: la mancha aclara
  { t: 27.5, p: [-0.98, 0.83, -0.82], l: PT.dab, fov: 32 },
  { t: 33.9, p: [-1.16, 0.73, -1.08], l: PT.dab, fov: 30 },
  // I · MICROSCOPIO: las raíces empujan hondo dentro de la silicona (cara cortada)
  { t: 39.0, p: M([ML + 2.3, 0.75, -0.55]), l: M([ML, 0.55, -1.0]), fov: 40 },
  { t: 41.8, p: M([ML + 1.55, 0.6, -0.85]), l: M([ML, 0.5, -1.05]), fov: 38 },
  // J · el techo: 10 pies cuadrados
  { t: 41.81, p: [0.45, 1.0, 0.75], l: [-0.55, 2.4, -0.95], fov: 46 },
  { t: 45.0, p: [0.2, 1.1, 0.35], l: [-0.55, 2.42, -0.95], fov: 44 },
  // N · del baño al pasillo: la guía sobre la mesita
  { t: 57.0, p: [0.95, 1.7, 2.0], l: [-0.4, 1.0, -1.0], fov: 40 },
  { t: 59.4, p: [2.62, 1.5, 0.95], l: [2.55, 0.8, 0.2], fov: 38, arc: 0.12 },
  { t: 63.4, p: [2.6, 1.42, 0.82], l: [2.55, 0.8, 0.22], fov: 36 },
  { t: 65.6, p: [2.6, 1.22, 0.56], l: [2.6, 0.8, 0.24], fov: 34 },
  { t: 75.4, p: [2.56, 1.2, 0.54], l: [2.6, 0.8, 0.25], fov: 33 },
  { t: 78.5, p: [2.56, 1.2, 0.54], l: [2.6, 0.8, 0.25], fov: 33 },
  { t: 82.6, p: [-0.95, 0.86, -0.75], l: PT.corner, fov: 34, arc: 0.18 },
];

// ---------------- CÁMARA · EL RESTO (82,7 s → final): cada tramo 3D tiene su llave de entrada y de salida ----------------
type KK = [number, V3, V3, number?, number?];
const CO = PT.corner, DB = PT.dab, SILL: V3 = [-1.58, 1.32, 0.27], WIDE_P: V3 = [1.75, 1.95, 2.7], WIDE_L: V3 = [-0.45, 1.15, -1.0];
const TOI: V3 = [0.5, 0.05, -1.0], BEH: V3 = [0.5, 0.45, -1.45], SPOUT: V3 = [-1.42, 0.45, -1.3], WINL: V3 = [-1.59, 1.5, 0.25], BOT: V3 = [2.02, 1.0, 0.24];
const CEIL_L: V3 = [-0.55, 2.42, -0.95], BKL: V3 = [2.6, 0.8, 0.25], HALL_L: V3 = [2.2, 0.8, -0.2];
const RK: KK[] = [
  [92.1, [-0.85, 0.95, -0.62], CO, 34], [96.0, [-1.05, 0.8, -0.95], CO, 32],
  [104.1, [-0.55, 1.75, 0.85], SILL, 36], [112.0, [-0.95, 1.55, 0.55], SILL, 34],
  [125.3, M([ML + 2.3, 0.75, -0.55]), M([ML, 0.5, -1.05]), 40], [132.9, M([ML + 1.4, 0.55, -0.9]), M([ML, 0.5, -1.05]), 38],
  [138.1, [1.0, 0.75, -0.25], TOI, 40], [145.3, [0.85, 0.55, -0.45], TOI, 38],
  [162.0, [2.45, 1.3, 1.0], BOT, 34], [168.4, [2.3, 1.15, 0.8], BOT, 32],
  [191.3, [-0.98, 0.83, -0.82], DB, 32], [195.3, [-1.12, 0.75, -1.02], DB, 30],
  [202.1, [-1.05, 0.8, -0.95], DB, 30], [206.3, [-1.18, 0.72, -1.1], DB, 28],
  [220.1, M([ML + 1.9, 0.4, -0.7]), M([ML, 0.35, -1.2]), 40], [229.1, M([ML + 1.1, 0.35, -1.05]), M([ML, 0.35, -1.2]), 38],
  [238.4, [2.5, 1.35, 1.05], BOT, 34], [244.9, [2.35, 1.2, 0.85], BOT, 32], [246.4, [2.62, 1.5, 0.95], BKL, 38], [249.6, [2.6, 1.35, 0.75], BKL, 36],
  [251.2, WIDE_P, WIDE_L, 40], [252.4, WIDE_P, WIDE_L, 40],
  [255.4, WIDE_P, WIDE_L, 40], [260.6, [1.5, 1.9, 2.4], WIDE_L, 40], [262.2, [-0.92, 0.88, -0.72], CO, 34], [265.5, [-1.05, 0.8, -0.95], CO, 32],
  [270.6, [-0.85, 1.15, -0.65], SPOUT, 38], [275.4, [-1.0, 1.0, -0.8], SPOUT, 36],
  [282.5, [-0.55, 1.7, 0.75], WINL, 38], [284.8, [-0.8, 1.65, 0.55], WINL, 36],
  [294.2, [1.0, 1.05, -0.8], BEH, 40], [298.3, [0.9, 0.9, -0.95], BEH, 38],
  [311.6, [0.65, 1.35, 0.45], PT.vent, 40], [316.6, [0.5, 1.55, 0.2], PT.vent, 38],
  [325.6, [3.1, 1.75, 1.7], HALL_L, 44], [333.0, [2.9, 1.6, 1.4], HALL_L, 42],
  [343.4, [1.9, 2.0, 2.9], WIDE_L, 40], [350.0, [1.5, 1.85, 2.3], WIDE_L, 40],
  [355.1, M([ML + 3.0, 2.2, 2.6]), M([ML - 0.6, 0.6, -1.0]), 44], [360.5, M([ML + 1.6, 1.25, 1.1]), M([ML - 0.6, 0.6, -1.0]), 40], [368.1, M([ML + 0.9, 1.0, 0.45]), M([ML - 0.5, 0.65, -0.95]), 38],
  [371.1, M([ML + 1.6, 1.25, 1.1]), M([ML - 0.6, 0.55, -1.0]), 40], [375.8, M([ML + 0.9, 1.0, 0.45]), M([ML - 0.5, 0.65, -0.95]), 38], [378.8, M([ML + 2.6, 3.4, 2.8]), M([ML - 0.5, 1.4, -0.8]), 44],
  [389.3, WIDE_P, WIDE_L, 40], [393.6, [1.2, 1.75, 2.1], WIDE_L, 40],
  [438.5, [-0.98, 0.83, -0.82], DB, 32], [443.8, [-1.12, 0.75, -1.02], DB, 30],
  [454.1, M([ML + 2.0, 1.1, 0.6]), M([ML, 0.45, -1.1]), 40], [460.0, M([ML + 1.3, 0.8, 0.0]), M([ML, 0.45, -1.1]), 38], [467.6, M([ML + 1.5, 0.45, -0.8]), M([ML, 0.4, -1.15]), 38],
  [476.0, [-0.9, 0.9, -0.7], CO, 34], [482.5, [-1.1, 0.76, -1.0], CO, 32],
  [491.6, [1.6, 1.9, 2.5], [-0.55, 2.0, -1.0], 40], [499.7, [0.6, 1.5, 1.2], [-0.55, 2.0, -1.0], 44],
  [522.5, M([ML + 2.2, 0.9, 0.3]), M([ML, 0.45, -1.05]), 40], [529.6, M([ML + 1.6, 0.6, -0.4]), M([ML, 0.45, -1.05]), 38],
  [535.5, [-0.8, 1.0, -0.55], CO, 34], [542.7, [-1.0, 0.85, -0.85], CO, 32],
  [552.7, WIDE_P, WIDE_L, 40], [555.5, [1.5, 1.9, 2.4], WIDE_L, 40],
  [569.9, [2.2, 2.1, 2.4], [-0.4, 1.0, -1.0], 42], [580.1, [0.3, 2.0, 2.9], [-0.4, 1.0, -1.0], 42],
  [583.2, [2.4, 1.2, 0.75], BOT, 32], [590.3, [2.2, 1.1, 0.55], BOT, 30],
  [605.0, [-0.7, 1.7, 0.8], SILL, 36], [608.6, [-0.95, 1.55, 0.55], SILL, 34],
  [627.8, [-0.95, 0.86, -0.75], CO, 34], [630.3, [-1.05, 0.8, -0.9], CO, 32],
  [633.5, [-0.6, 1.1, -0.4], CO, 36], [640.1, [-0.9, 0.9, -0.7], CO, 34],
  [653.6, [-0.75, 0.95, -0.55], [-1.1, 0.57, -1.47], 36], [657.4, [-0.95, 0.85, -0.75], [-1.1, 0.57, -1.47], 34],
  [668.0, M([ML + 2.0, 0.9, 0.2]), M([ML, 0.45, -1.05]), 40], [675.45, M([ML + 1.4, 0.55, -0.6]), M([ML, 0.45, -1.05]), 38],
  [675.6, [-0.85, 0.95, -0.62], CO, 34], [682.5, [-1.1, 0.78, -1.0], CO, 32],
  [686.5, M([ML + 1.2, 1.2, 0.8]), M([ML - 0.4, 0.5, -1.0]), 40], [693.15, M([ML + 0.8, 0.7, 0.1]), M([ML - 0.4, 0.5, -1.0]), 38],
  [693.3, WIDE_P, WIDE_L, 40], [699.6, [1.3, 1.8, 2.2], WIDE_L, 40],
  [704.3, [2.5, 1.25, 0.85], BOT, 32], [710.85, [2.38, 1.18, 0.72], BOT, 30],
  [711.0, M([ML + 1.5, 0.25, -0.6]), M([ML, 0.2, -1.25]), 40], [715.5, M([ML + 0.9, 0.2, -0.9]), M([ML, 0.2, -1.25]), 38],
  [720.9, [-0.95, 0.86, -0.75], CO, 34], [726.35, [-1.12, 0.74, -1.02], CO, 32],
  [726.5, [0.45, 1.0, 0.75], CEIL_L, 46], [734.9, [0.2, 1.1, 0.35], CEIL_L, 44],
  [762.7, [0.95, 1.7, 2.0], [-0.4, 1.0, -1.0], 40], [765.2, [2.62, 1.5, 0.95], [2.55, 0.8, 0.2], 38, 0.12], [767.9, [2.6, 1.22, 0.56], [2.6, 0.8, 0.24], 34],
  [772.1, [2.56, 1.2, 0.54], BKL, 33], [783.0, [2.56, 1.2, 0.54], BKL, 33], [785.6, [2.6, 1.42, 0.82], [2.55, 0.8, 0.22], 36],
  [790.0, [2.56, 1.2, 0.54], BKL, 33], [800.6, [2.57, 1.24, 0.6], BKL, 34],
  [815.1, WIDE_P, WIDE_L, 40], [818.4, [1.5, 1.9, 2.4], WIDE_L, 40],
  [829.1, [-0.8, 1.0, -0.55], CO, 34], [834.8, [-0.95, 0.9, -0.75], CO, 32],
  [837.7, [-0.95, 0.9, -0.75], CO, 32], [844.9, [-1.1, 0.76, -1.0], CO, 30], [845.6, [0.65, 1.35, 0.45], PT.vent, 40], [847.8, [0.6, 1.4, 0.4], PT.vent, 40],
  [851.2, [0.7, 1.3, 0.5], PT.vent, 40], [855.5, [0.55, 1.45, 0.3], PT.vent, 38],
  [859.6, [0.45, 1.7, 0.05], [0.2, 2.3, -0.6], 40], [863.5, [0.35, 1.9, -0.2], [0.2, 2.3, -0.6], 38],
  [867.0, [-0.85, 0.95, -0.62], CO, 34], [872.1, [-1.05, 0.8, -0.95], CO, 32],
  [890.0, [1.9, 2.0, 2.9], WIDE_L, 40], [897.3, [1.2, 1.75, 2.1], WIDE_L, 40],
  [906.0, [1.5, 1.9, 2.5], [-0.55, 2.0, -1.0], 40], [912.0, [0.5, 1.4, 1.0], [-0.55, 2.0, -1.0], 44],
  [918.1, [-0.98, 0.83, -0.82], DB, 32], [921.4, [-1.12, 0.75, -1.02], DB, 30], [924.7, [-0.85, 0.95, -0.62], [-1.0, 0.57, -1.47], 34],
  [939.5, [0.45, 1.0, 0.75], PT.ceil, 46], [944.6, [0.3, 1.05, 0.5], PT.ceil, 44], [949.0, WIDE_P, WIDE_L, 40],
  [952.6, [-0.6, 1.7, 0.8], SILL, 36], [955.2, [-0.9, 1.55, 0.55], SILL, 34], [956.0, [1.0, 0.75, -0.25], TOI, 40], [957.0, [0.9, 0.62, -0.38], TOI, 38],
  [958.0, [-0.98, 0.83, -0.82], DB, 32], [964.7, [-1.12, 0.75, -1.02], DB, 30],
  [969.6, M([ML + 1.6, 1.25, 1.1]), M([ML - 0.6, 0.55, -1.0]), 40], [973.85, M([ML + 2.6, 3.4, 2.8]), M([ML - 0.5, 1.4, -0.8]), 44],
  [974.0, WIDE_P, WIDE_L, 40], [979.0, [1.4, 1.85, 2.3], WIDE_L, 40],
  [982.3, [0.45, 1.0, 0.75], CEIL_L, 46], [989.6, [0.2, 1.1, 0.35], CEIL_L, 44], [992.3, [2.62, 1.5, 0.95], [2.55, 0.8, 0.2], 38, 0.15], [994.6, [2.6, 1.22, 0.56], [2.6, 0.8, 0.24], 34],
  [1004.4, [2.56, 1.2, 0.54], BKL, 33], [1007.2, [-0.95, 0.86, -0.75], CO, 34, 0.18], [1012.4, [-1.12, 0.75, -1.02], DB, 30],
  [1016.0, [1.9, 2.0, 2.9], WIDE_L, 40], [1029.5, [1.1, 1.7, 1.9], WIDE_L, 40],
];
for (const [t, p, l, fov, arc] of RK) KEYS.push({ t, p, l, fov, arc });
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  if (a.p.distanceTo(b.p) > 1.5) return { bx: 0, by: 0 }; // salto entre sets (tapado por portal)
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- páginas REALES de la guía (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia");
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (q) => { flip.image = q.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useBathTex = () => useMemo(() => ({
  // azulejo cuadrado blanco con pastina gris
  tile: mk(256, 256, (g) => {
    g.fillStyle = "#9da19f"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const v = 240 + rnd(r * 4 + c, 2) * 10; g.fillStyle = `rgb(${v},${v},${v - 3})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60);
      const gr = g.createLinearGradient(c * 64, r * 64, c * 64 + 64, r * 64 + 64); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(0,0,0,.04)"); g.fillStyle = gr; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60);
    }
  }, [6, 4]),
  hex: mk(256, 256, (g) => {
    g.fillStyle = "#f2f1ec"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(90,90,90,.45)"; g.lineWidth = 2;
    const R = 16; for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) {
      const x = c * R * 1.732 + (r % 2) * R * 0.866, y = r * R * 1.5; g.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(x + R * Math.cos(a), y + R * Math.sin(a)); } g.closePath(); g.stroke();
      if (rnd(r * 10 + c, 4) > 0.9) { g.fillStyle = "#d6d5cf"; g.fill(); }
    }
  }, [5, 5]),
  paint: mk(128, 128, (g) => { g.fillStyle = "#e9e4da"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${0.02 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 128, rnd(i, 3) * 128, 2, 2); } }, [4, 4]),
  wood: mk(256, 256, (g) => {
    for (let r = 0; r < 8; r++) { const b = 150 + rnd(r, 1) * 30; g.fillStyle = `rgb(${b},${b - 45},${b - 90})`; g.fillRect(0, r * 32, 256, 32); g.fillStyle = "rgba(40,20,5,.5)"; g.fillRect(0, r * 32, 256, 2);
      for (let k = 0; k < 5; k++) { g.strokeStyle = `rgba(70,40,15,${0.1 + rnd(r, k) * 0.15})`; g.beginPath(); g.moveTo(0, r * 32 + 5 + k * 5); g.bezierCurveTo(90, r * 32 + 8 + k * 5, 170, r * 32 + 2 + k * 5, 256, r * 32 + 6 + k * 5); g.stroke(); } }
  }, [3, 3]),
  // mancha de moho (alfa): racimos de puntitos negros y verdosos
  blotch: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) {
      const a = rnd(i, 1) * 6.283, rr = Math.pow(rnd(i, 2), 0.65) * 118, x = 128 + Math.cos(a) * rr, y = 128 + Math.sin(a) * rr * 0.9;
      const s = 1 + rnd(i, 3) * 4.5 * (1 - rr / 140); const k = rnd(i, 5);
      g.fillStyle = k > 0.75 ? `rgba(48,62,40,${0.5 + 0.4 * rnd(i, 4)})` : `rgba(16,18,16,${0.45 + 0.5 * rnd(i, 4)})`;
      g.beginPath(); g.arc(x, y, s, 0, 6.3); g.fill();
    }
  }),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  sky: mk(64, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#1d2733"); gr.addColorStop(0.6, "#2a3442"); gr.addColorStop(1, "#11161d"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); }),
}), []);
type Tx = THREE.Texture;

const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} />
  </mesh>
);
const CHROME = { color: "#eef1f3", metalness: 1, roughness: 0.12 };

// calcomanía plana (mancha) sobre una superficie: normal = eje
const Decal: React.FC<{ p: V3; r: number; tex: Tx; o: number; rot?: V3; col?: string }> = ({ p, r, tex, o, rot = [0, 0, 0], col = "#ffffff" }) => o < 0.01 || r < 0.001 ? null : (
  <mesh position={p} rotation={rot}><planeGeometry args={[r * 2, r * 2]} /><meshStandardMaterial map={tex} color={col} transparent opacity={o} depthWrite={false} roughness={0.9} polygonOffset polygonOffsetFactor={-4} /></mesh>
);

// ---------------- EL BAÑO ----------------
const Tub: React.FC = () => (
  <group>
    {/* faldón + borde + interior */}
    <Box p={[-0.775, 0.27, -0.79]} s={[1.65, 0.54, 0.05]} c="#f7f6f2" r={0.25} rad={0.02} />
    <Box p={[-0.775, 0.55, -0.81]} s={[1.65, 0.04, 0.09]} c="#fbfaf7" r={0.2} rad={0.015} />
    <Box p={[0.03, 0.55, -1.14]} s={[0.09, 0.04, 0.72]} c="#fbfaf7" r={0.2} rad={0.015} />
    <Box p={[-0.775, 0.55, -1.47]} s={[1.65, 0.04, 0.07]} c="#fbfaf7" r={0.2} rad={0.015} />
    <Box p={[-1.565, 0.55, -1.14]} s={[0.07, 0.04, 0.72]} c="#fbfaf7" r={0.2} rad={0.015} />
    <mesh position={[-0.77, 0.14, -1.14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.5, 0.56]} /><meshStandardMaterial color="#eeeeea" roughness={0.18} /></mesh>
    <Box p={[-0.77, 0.34, -1.4]} s={[1.5, 0.4, 0.02]} c="#efeeea" r={0.2} rad={0.005} />
    <Box p={[-0.77, 0.34, -0.86]} s={[1.5, 0.4, 0.02]} c="#efeeea" r={0.2} rad={0.005} />
    <Box p={[-1.52, 0.34, -1.14]} s={[0.02, 0.4, 0.56]} c="#efeeea" r={0.2} rad={0.005} />
    <Box p={[-0.02, 0.34, -1.14]} s={[0.02, 0.4, 0.56]} c="#efeeea" r={0.2} rad={0.005} />
    {/* grifería */}
    <mesh position={[-1.45, 0.86, -1.495]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.02, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[-1.45, 0.75, -1.44]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.022, 0.12, 16]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[-1.45, 1.75, -1.45]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.05, 0.03, 0.06, 20]} /><meshStandardMaterial {...CHROME} /></mesh>
    {/* barral y cortina recogida */}
    <mesh position={[-0.78, 2.0, -0.8]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 1.66, 12]} /><meshStandardMaterial {...CHROME} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.12 + i * 0.016, 1.38, -0.8 + Math.sin(i * 1.7) * 0.03]} castShadow><cylinderGeometry args={[0.022, 0.03, 1.24, 10]} /><meshStandardMaterial color="#f6f6f2" roughness={0.7} /></mesh>)}
  </group>
);
// cordón de silicona (tubo) a lo largo de la junta bañera/pared
const Caulk: React.FC<{ a: V3; b: V3 }> = ({ a, b }) => {
  const d = v3(b).sub(v3(a)), L = d.length(), mid = v3(a).add(v3(b)).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q}><cylinderGeometry args={[0.011, 0.011, L, 10]} /><meshPhysicalMaterial color="#f3f2ee" roughness={0.35} clearcoat={0.6} /></mesh>;
};
// moho del cordón: puntitos negros aplastados (y el aclarado del hisopo en `lit`)
const CaulkMold: React.FC<{ k: number; lit: number }> = ({ k, lit }) => {
  if (k < 0.01) return null;
  const n = Math.round(320 * k);
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const along = Math.pow(rnd(i, 1), 2.4);
        const seg = rnd(i, 7);
        const p: V3 = seg < 0.55 ? [-1.53 + along * 0.55, 0.565 + (rnd(i, 2) - 0.5) * 0.012, -1.488 + (rnd(i, 3) - 0.5) * 0.01]
          : seg < 0.8 ? [-1.588 + (rnd(i, 3) - 0.5) * 0.01, 0.565 + (rnd(i, 2) - 0.5) * 0.012, -1.45 + along * 0.4]
          : [-1.592, 0.58 + along * 0.32, -1.49];
        const dd = Math.hypot(p[0] - PT.dab[0], p[2] - PT.dab[2]);
        const L = lit * (dd < 0.05 ? 1 : 0);
        const c = new THREE.Color(rnd(i, 4) > 0.7 ? "#28331f" : "#121412").lerp(new THREE.Color("#b9bbb5"), L * 0.85);
        const s = (0.0018 + rnd(i, 5) * 0.004) * (1.4 - along);
        return <mesh key={i} position={p} scale={[1, 0.55, 1]}><sphereGeometry args={[s, 8, 6]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>;
      })}
    </group>
  );
};
const Toilet: React.FC = () => (
  <group position={[0.5, 0, -1.25]}>
    <mesh position={[0, 0.17, 0.1]} scale={[1, 1, 1.3]} castShadow><cylinderGeometry args={[0.15, 0.12, 0.34, 28]} /><meshPhysicalMaterial color="#fbfbf8" roughness={0.15} clearcoat={1} /></mesh>
    <mesh position={[0, 0.36, 0.12]} scale={[1, 0.55, 1.4]} castShadow><sphereGeometry args={[0.18, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#fbfbf8" roughness={0.15} clearcoat={1} /></mesh>
    <mesh position={[0, 0.405, 0.12]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.4, 1]}><torusGeometry args={[0.15, 0.022, 10, 40]} /><meshPhysicalMaterial color="#fbfbf8" roughness={0.2} clearcoat={1} /></mesh>
    <mesh position={[0, 0.41, 0.12]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.4, 1]}><circleGeometry args={[0.13, 32]} /><meshStandardMaterial color="#cfe0e8" roughness={0.05} metalness={0.1} /></mesh>
    <mesh position={[0, 0.62, -0.03]} rotation={[-0.12, 0, 0]} scale={[1, 1.4, 1]}><cylinderGeometry args={[0.165, 0.165, 0.025, 32]} /><meshPhysicalMaterial color="#fbfbf8" roughness={0.2} clearcoat={1} /></mesh>
    <Box p={[0, 0.66, -0.13]} s={[0.42, 0.4, 0.18]} c="#fbfbf8" r={0.15} rad={0.03} />
    <Box p={[0, 0.875, -0.13]} s={[0.45, 0.04, 0.2]} c="#fbfbf8" r={0.15} rad={0.015} />
  </group>
);
// esporas en el AIRE del baño: salen de la esquina y viajan a la toalla, al extractor y al techo
const TGT: V3[] = [PT.towel, PT.vent, PT.ceil, PT.sill];
const SporeCloud: React.FC<{ t: number; a: number; dur: number; o: number; tex: Tx }> = ({ t, a, dur, o, tex }) => {
  const N = 700;
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = useMemo(() => new Float32Array(N * 3), []);
  if (o < 0.01 || t < a) return null;
  for (let i = 0; i < N; i++) {
    const st = a + rnd(i, 1) * dur * 0.45, u = ease(cl((t - st) / (dur * 0.55 + rnd(i, 2) * dur * 0.3)));
    const tg = TGT[i % 4], s = PT.corner;
    const sw = Math.sin(u * Math.PI);
    const x = lerp(s[0], tg[0], u) + sw * (rnd(i, 3) - 0.5) * 0.9 + Math.sin(t * 1.3 + i) * 0.03;
    const y = lerp(s[1], tg[1], u) + sw * (0.25 + rnd(i, 4) * 0.5);
    const z = lerp(s[2], tg[2], u) + sw * (rnd(i, 5) - 0.3) * 0.9;
    const alive = t >= st ? 1 : 0;
    pos[i * 3] = alive ? x : 999; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
  return <points geometry={geo}><pointsMaterial map={tex} color="#1c241a" size={0.06} sizeAttenuation transparent opacity={0.85 * o} depthWrite={false} alphaTest={0.02} /></points>;
};
// el cuadrado de 3 x 3 pies (10 pies²) que se dibuja alrededor de la mancha del techo
const SqFt: React.FC<{ k: number }> = ({ k }) => {
  if (k < 0.01) return null;
  const c = PT.ceil, s = 0.46, y = c[1] - 0.004, L = 4 * 2 * s * k;
  const segs: [V3, V3][] = [[[-s, 0, -s], [s, 0, -s]], [[s, 0, -s], [s, 0, s]], [[s, 0, s], [-s, 0, s]], [[-s, 0, s], [-s, 0, -s]]];
  let left = L;
  return (
    <group position={[c[0], y, c[2]]}>
      {segs.map(([a, b], i) => {
        const f = cl(left / (2 * s)); left -= 2 * s; if (f <= 0) return null;
        const e: V3 = [lerp(a[0], b[0], f), 0, lerp(a[2], b[2], f)];
        const mid: V3 = [(a[0] + e[0]) / 2, 0, (a[2] + e[2]) / 2], len = 2 * s * f;
        return <mesh key={i} position={mid} rotation={[0, a[0] === b[0] ? Math.PI / 2 : 0, 0]}><boxGeometry args={[len, 0.004, 0.012]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>;
      })}
    </group>
  );
};
// el hisopo que se moja y toca la esquina
const Swab: React.FC<{ t: number; a: number; on: number }> = ({ t, a, on }) => {
  if (on < 0.01) return null;
  const k = ease((t - a) / 0.7), back = win(t, a + 1.0, a + 1.6);
  const tip = v3(PT.dab).add(new THREE.Vector3(0.02, 0.05, 0.09).multiplyScalar(1 - k + back * 1.4));
  return (
    <group position={tip} rotation={[0.9, 0.25, 0.2]}>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.0028, 0.0028, 0.15, 8]} /><meshStandardMaterial color="#f7f7f3" roughness={0.6} /></mesh>
      <mesh scale={[1, 1.6, 1]}><sphereGeometry args={[0.0065, 14, 10]} /><meshStandardMaterial color="#e9eae6" roughness={1} /></mesh>
    </group>
  );
};

// tiras de papel de cocina empapadas a lo largo del cordón + film plástico encima (el truco de la noche)
const Strips: React.FC<{ k: number }> = ({ k }) => {
  if (k < 0.01) return null;
  return (
    <group>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-1.5 + i * 0.205, 0.585, -1.488]} rotation={[0.55, 0, (rnd(i, 61) - 0.5) * 0.06]} castShadow>
          <boxGeometry args={[0.2, 0.004, 0.065]} /><meshStandardMaterial color="#f4f1e8" roughness={0.95} />
        </mesh>))}
      <mesh position={[-1.552, 0.6, -1.15]} rotation={[0, 0, 0.55]}><boxGeometry args={[0.004, 0.065, 0.62]} /><meshStandardMaterial color="#f4f1e8" roughness={0.95} /></mesh>
      <mesh position={[-0.78, 0.592, -1.476]} rotation={[0.55, 0, 0]}><boxGeometry args={[1.48, 0.002, 0.09]} /><meshPhysicalMaterial color="#e8f4ff" transparent opacity={0.35} roughness={0.05} clearcoat={1} /></mesh>
    </group>
  );
};
// un cuadradito de papel higiénico contra la rejilla del extractor: cuelga flojo = el extractor NO tira
const TP: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  if (k < 0.01) return null;
  const sw = Math.sin(t * 2.2) * 0.06;
  return (
    <group position={[PT.vent[0], PT.vent[1] - 0.02, PT.vent[2] + 0.05]} rotation={[sw, 0, sw * 0.5]}>
      <mesh position={[0, -0.06, 0]}><planeGeometry args={[0.11, 0.12]} /><meshStandardMaterial color="#fbfbf6" side={THREE.DoubleSide} roughness={1} /></mesh>
      <mesh position={[0.03, 0, 0.02]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.025, 0.06, 0.02]} /><meshStandardMaterial color="#ffd21f" roughness={0.6} /></mesh>
    </group>
  );
};
// agua que baja por los azulejos y se junta en la esquina (donde el moho "toma")
const Wet: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  if (k < 0.01) return null;
  return (
    <group>
      <mesh position={[-1.25, 0.567, -1.47]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.55, 0.05]} /><meshPhysicalMaterial color="#9cc9ff" transparent opacity={0.45 * k} roughness={0.02} clearcoat={1} depthWrite={false} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const x = -1.52 + rnd(i, 71) * 0.9, u = ((t * (0.18 + rnd(i, 72) * 0.12) + rnd(i, 73)) % 1); return (
        <mesh key={i} position={[x, 1.6 - u * 1.02, -1.567]} scale={[1, 2.2, 0.6]}><sphereGeometry args={[0.009, 10, 8]} /><meshPhysicalMaterial color="#cfe6ff" transparent opacity={0.8 * k} roughness={0.02} clearcoat={1} /></mesh>); })}
    </group>
  );
};

// ---------------- LA GUÍA (proporción real 1700x2200) ----------------
const PAPER = "#cfc9be";
export const BW = 0.3, BD = BW * 2200 / 1700;
export const Book: React.FC<{ p: V3; rotY?: number; open: number; cover: Tx; inside: Tx; right: Tx; spine: string; children?: React.ReactNode }> = ({ p, rotY = 0, open, cover, inside, right, spine, children }) => {
  const w = BW, d = BD, th = 0.03;
  const ang = Math.PI * ease(open);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#d8d0bf" roughness={0.95} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[w / 2 + 0.0025, 0.009 + i * (th / 8), 0]}><boxGeometry args={[0.001, 0.0012, d - 0.01]} /><meshBasicMaterial color="#bfb39a" /></mesh>)}
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      <group position={[0.004, 0.0065 + th, 0]}>{children}</group>
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.4} metalness={0.03} color="#e2ddd4" /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};
// marcador fosforito que se PINTA sobre un renglón de la página (coordenadas normalizadas de la página real)
export const Marker: React.FC<{ t: number; at: number; out?: number; box: [number, number, number, number]; col?: string }> = ({ t, at, out = 1e9, box, col = "#ffd60a" }) => {
  const a = ease((t - at) / 0.4), o = 1 - win(t, out, out + 0.3);
  if (a <= 0.01 || o <= 0.01) return null;
  const pw = BW - 0.01, pd = BD - 0.012;
  const [x0, y0, x1, y1] = box, ww = (x1 - x0) * pw * a, hh = (y1 - y0) * pd;
  return <mesh position={[(x0 - 0.5) * pw + ww / 2, 0.0009, (y0 - 0.5) * pd + hh / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ww, hh]} /><meshBasicMaterial color={col} transparent opacity={0.5 * o} depthWrite={false} /></mesh>;
};
export const pagePt = (u: number, v: number): V3 => [PT.book[0] + 0.004 + (u - 0.5) * (BW - 0.01), PT.book[1] + 0.037, PT.book[2] + (v - 0.5) * (BD - 0.012)];

const Caddy: React.FC = () => (
  <group position={[2.12, 0.78, 0.2]}>
    <Box p={[0, 0.07, 0]} s={[0.36, 0.14, 0.22]} c="#7f8890" r={0.6} rad={0.02} />
    <Box p={[0, 0.2, 0]} s={[0.03, 0.14, 0.2]} c="#7f8890" r={0.6} rad={0.01} />
    <mesh position={[-0.1, 0.22, 0.04]} castShadow><cylinderGeometry args={[0.035, 0.04, 0.2, 20]} /><meshPhysicalMaterial color="#5a3216" roughness={0.3} clearcoat={0.5} /></mesh>
    <mesh position={[-0.1, 0.35, 0.04]}><cylinderGeometry args={[0.012, 0.016, 0.06, 12]} /><meshStandardMaterial color="#f2f2ee" /></mesh>
    <mesh position={[0.1, 0.2, -0.04]} castShadow><cylinderGeometry args={[0.03, 0.035, 0.16, 20]} /><meshStandardMaterial color="#f3f3ef" roughness={0.4} /></mesh>
    <Box p={[0.09, 0.15, 0.06]} s={[0.1, 0.03, 0.1]} c="#ffd21f" r={0.6} rad={0.01} />
  </group>
);

// ---------------- EL MICROSCOPIO (1 unidad = 1 mm) ----------------
// cordón cóncavo entre la pared (z = -1.6) y la bañera (y = 0): sección en el plano (z, y), extruido a lo largo de x
const FIL = 1.25;
const filletShape = () => {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(FIL, 0);
  for (let k = 0; k <= 24; k++) { const a = (k / 24) * Math.PI / 2; s.lineTo(FIL - FIL * Math.sin(a), FIL - FIL * Math.cos(a)); }
  s.lineTo(0, 0); return s;
};
// superficie del cordón: punto en la curva cóncava (u 0..1) a lo largo de x
const surf = (x: number, u: number): V3 => { const a = u * Math.PI / 2; return [x, FIL - FIL * Math.cos(a) * 0.98, -1.6 + FIL - FIL * Math.sin(a) * 0.98]; };
const surfN = (u: number) => { const a = u * Math.PI / 2; return new THREE.Vector3(0, Math.cos(a), Math.sin(a)); };
// raíces (hifas): curvas que bajan desde la superficie hacia adentro, con ramas; se dibujan con `grow`
const useHyphae = () => useMemo(() => {
  const out: { geo: THREE.TubeGeometry; deep: boolean }[] = [];
  for (let i = 0; i < 46; i++) {
    const deep = i >= 26;
    const x = deep ? ML - 0.03 - rnd(i, 1) * 0.3 : ML - 0.05 - rnd(i, 1) * 1.6, u = 0.15 + rnd(i, 2) * 0.7;
    const s = v3(surf(x, u)), n = surfN(u).multiplyScalar(-1);
    const pts = [s.clone()];
    let p = s.clone(), dir = n.clone();
    const L = deep ? 0.95 : 0.5, steps = 7;
    for (let k = 0; k < steps; k++) {
      dir.add(new THREE.Vector3((rnd(i * 9 + k, 3) - 0.5) * (deep ? 0.25 : 0.9), -0.25 - rnd(i, k) * 0.3, -0.15 - rnd(i * 3 + k, 4) * 0.25)).normalize();
      p = p.clone().add(dir.clone().multiplyScalar(L / steps));
      p.y = Math.max(0.03, p.y); p.z = Math.max(-1.57, p.z);
      pts.push(p);
    }
    out.push({ geo: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, deep ? 0.016 : 0.02, 6, false), deep });
  }
  return out;
}, []);
// colonias: tallos con su cabeza de esporas, sobre la superficie del cordón (cerca de la cara cortada)
const STALKS = Array.from({ length: 34 }, (_, i) => ({ x: ML - 0.06 - rnd(i, 11) * 1.4, u: 0.2 + rnd(i, 12) * 0.65, h: 0.16 + rnd(i, 13) * 0.24, r: 0.04 + rnd(i, 14) * 0.025 }));
const Micro: React.FC<{ t: number; grow: number; grow2: number; brush: number; burst: number; bleach: number; fizz: number; cap?: number; tex: Tx }> = ({ t, grow, grow2, brush, burst, bleach, fizz, cap = 0, tex }) => {
  const hy = useHyphae();
  const shape = useMemo(() => new THREE.ExtrudeGeometry(filletShape(), { depth: ML, bevelEnabled: false, curveSegments: 24 }), []);
  // esporas sueltas: salen de las cabezas golpeadas
  const NS = 700;
  const sp = useMemo(() => new THREE.BufferGeometry(), []);
  const arr = new Float32Array(NS * 3);
  for (let i = 0; i < NS; i++) {
    const st = STALKS[i % STALKS.length], h = v3(surf(st.x, st.u)).add(surfN(st.u).multiplyScalar(st.h));
    const tau = Math.max(0, burst * 3.2 - rnd(i, 5) * 0.6);
    const v = new THREE.Vector3((rnd(i, 6) - 0.5) * 1.4, 0.6 + rnd(i, 7) * 1.4, 0.3 + rnd(i, 8) * 1.2);
    const q = h.clone().add(v.multiplyScalar(tau)).add(new THREE.Vector3(Math.sin(t * 2 + i) * 0.04 * tau, 0, 0));
    if (burst <= 0.001) { q.copy(h).add(new THREE.Vector3((rnd(i, 9) - 0.5) * st.r * 1.6, (rnd(i, 10) - 0.5) * st.r * 1.6, (rnd(i, 15) - 0.5) * st.r * 1.6)); }
    arr[i * 3] = q.x; arr[i * 3 + 1] = q.y; arr[i * 3 + 2] = q.z;
  }
  sp.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  const bx = lerp(ML + 1.5, ML - 2.2, brush); // cerdas que barren a lo largo del cordón
  const moldC = new THREE.Color("#1f281c").lerp(new THREE.Color("#e9ebe4"), bleach);
  return (
    <group position={X0}>
      <color attach="background" args={["#0c1720"]} /><fog attach="fog" args={["#0c1720", 4, 11]} />
      {/* bañera (abajo) y pared con azulejo (atrás), en corte */}
      <mesh position={[ML / 2, -0.4, 0]} receiveShadow><boxGeometry args={[ML + 1.5, 0.8, 3.6]} /><meshPhysicalMaterial color="#d3d6d3" roughness={0.35} clearcoat={0.6} /></mesh>
      <mesh position={[ML / 2, 1.6, -2.0]} receiveShadow><boxGeometry args={[ML + 1.5, 4, 0.8]} /><meshStandardMaterial color="#b7b0a4" roughness={0.9} /></mesh>
      <mesh position={[ML / 2, 1.6, -1.585]}><boxGeometry args={[ML + 1.5, 4, 0.03]} /><meshPhysicalMaterial color="#c4cacb" roughness={0.2} clearcoat={1} /></mesh>
      {/* la pastina: una línea gris (a esta escala un azulejo es enorme) */}
      <mesh position={[ML / 2, 2.6, -1.565]}><boxGeometry args={[ML + 1.5, 0.12, 0.02]} /><meshStandardMaterial color="#7b807f" roughness={0.9} /></mesh>
      {/* cara cortada del cordón: lechosa, deja ver las raíces */}
      <mesh position={[ML + 0.002, 0, -1.6]} rotation={[0, Math.PI / 2, 0]}><shapeGeometry args={[filletShape()]} /><meshStandardMaterial color="#e6eef0" transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} roughness={0.6} /></mesh>
      {/* EL CORDÓN DE SILICONA translúcido */}
      <mesh geometry={shape} rotation={[0, -Math.PI / 2, 0]} position={[ML, 0, -1.6]}>
        <meshPhysicalMaterial color="#eef4f3" roughness={0.3} transparent opacity={0.55} clearcoat={0.8} depthWrite={false} side={THREE.DoubleSide} emissive="#5d7f8a" emissiveIntensity={0.15} />
      </mesh>
      {/* silicona NUEVA encima de la vieja (error 4): encierra el bosque con su agua */}
      {cap > 0.01 && <mesh geometry={shape} rotation={[0, -Math.PI / 2, 0]} position={[ML, -0.001, -1.6 - 0.001]} scale={[1, 1.32 * (0.85 + 0.15 * cap), 1.32 * (0.85 + 0.15 * cap)]}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.15} transparent opacity={0.42 * cap} clearcoat={1} depthWrite={false} side={THREE.DoubleSide} emissive="#9fc7ff" emissiveIntensity={0.12} />
      </mesh>}
      {/* raíces adentro */}
      {hy.map((h, i) => {
        const g = h.deep ? grow2 : grow; if (g < 0.01) return null;
        const n = h.geo.index ? h.geo.index.count : 0; h.geo.setDrawRange(0, Math.floor(n * cl(g)));
        return <mesh key={i} geometry={h.geo}><meshStandardMaterial color={h.deep ? "#16240f" : "#1a2414"} emissive="#4f8a2a" emissiveIntensity={h.deep ? 0.75 : 0.4} roughness={0.6} toneMapped={false} /></mesh>;
      })}
      {/* tallos + cabezas */}
      {STALKS.map((st, i) => {
        const base = v3(surf(st.x, st.u)), n = surfN(st.u);
        const hit = brush > 0 ? cl(1 - Math.abs(bx - st.x) * 2.2) : 0;
        const bend = hit * (0.9 + rnd(i, 3) * 0.6);
        const dir = n.clone().add(new THREE.Vector3(-bend, -bend * 0.3, 0)).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const top = base.clone().add(dir.clone().multiplyScalar(st.h));
        const headK = 1 - cl(burst * 2.5 - rnd(i, 4) * 0.5);
        return (
          <group key={i}>
            <mesh position={base.clone().add(dir.clone().multiplyScalar(st.h / 2))} quaternion={q}><cylinderGeometry args={[0.005, 0.008, st.h, 6]} /><meshStandardMaterial color={moldC.clone().lerp(new THREE.Color("#4f5f44"), 0.45)} roughness={0.7} /></mesh>
            {headK > 0.02 && <group position={top} scale={headK}>{Array.from({ length: 7 }, (_, j) => <mesh key={j} position={[(rnd(i * 7 + j, 41) - 0.5) * st.r * 1.6, (rnd(i * 7 + j, 42) - 0.3) * st.r * 1.6, (rnd(i * 7 + j, 43) - 0.5) * st.r * 1.6]}><sphereGeometry args={[st.r * (0.35 + rnd(i * 7 + j, 44) * 0.3), 10, 8]} /><meshStandardMaterial color={moldC} roughness={0.95} /></mesh>)}</group>}
          </group>
        );
      })}
      {/* alfombra de moho en la superficie */}
      {Array.from({ length: 420 }, (_, i) => { const p = surf(ML - rnd(i, 21) * 1.9, 0.08 + rnd(i, 22) * 0.84); return <mesh key={i} position={p} scale={[1, 0.6, 1]}><sphereGeometry args={[0.008 + rnd(i, 23) * 0.018, 8, 6]} /><meshStandardMaterial color={moldC} roughness={1} /></mesh>; })}
      <points geometry={sp}><pointsMaterial map={tex} color="#2a3326" size={0.05} sizeAttenuation transparent opacity={0.95} depthWrite={false} alphaTest={0.02} /></points>
      {/* cerdas del cepillo */}
      {brush > 0 && brush < 1 && Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[bx + (i % 5) * 0.12, 1.9, -0.9 + Math.floor(i / 5) * 0.32 + (i % 2) * 0.1]} rotation={[0.35, 0, 0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.4, 10]} /><meshPhysicalMaterial color="#e8d36a" roughness={0.35} clearcoat={0.6} />
        </mesh>))}
      {/* burbujas de peróxido que bajan por las raíces */}
      {fizz > 0.01 && Array.from({ length: 80 }, (_, i) => { const h = hy[i % hy.length]; const u = (rnd(i, 31) + t * 0.18) % 1; const q = h.geo.parameters.path.getPointAt(u); return <mesh key={i} position={q}><sphereGeometry args={[0.02 + rnd(i, 32) * 0.03, 10, 8]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7 * fizz} roughness={0.05} clearcoat={1} /></mesh>; })}
      <pointLight position={[ML + 1.5, 2.5, 1.8]} intensity={4} distance={7} color="#fff4e2" />
      <spotLight position={[ML + 2.5, 1.2, -0.2]} angle={0.7} penumbra={0.8} intensity={10} distance={8} color="#8fc8ff" target-position={add(X0, [ML - 0.5, 0.4, -1.1])} />
      <pointLight position={[ML + 0.6, 0.4, -0.4]} intensity={0.8} distance={2} color="#c8ffd0" /><pointLight position={[ML + 0.4, 1.8, -2.4]} intensity={6} distance={5} color="#7ab8ff" />
    </group>
  );
};

// ---------------- EL MUNDO ----------------
export type WState = { mold?: number; ceil?: number; spots?: number; cloud?: [number, number]; lit?: number; swab?: number; swabA?: number; sq?: number; grow?: number; grow2?: number; brush?: number; burst?: number; bleach?: number; fizz?: number; open?: number; page?: "p23" | "p20" | "p53"; strips?: number; dark?: number; tp?: number; wet?: number; cap?: number };
// estado por segundo (minuto 1; el resto agrega sus tramos)
// ---------------- estado · EL RESTO ----------------
const inn = (t: number, a: number, b: number) => t >= a && t < b;
const CLOUDS = [389.7, 492.0, 553.1, 939.9];
const SWABS = [191.8, 438.9, 918.6, 962.9, 1007.4];
const restState = (t: number): WState => {
  const cs = CLOUDS.filter((c) => c <= t + 0.01 && t < c + 9).pop();
  const sa = SWABS.filter((c) => c - 0.5 <= t).pop() ?? 0;
  const mold = t < 657.3 ? 1 : inn(t, 900, 1016) ? 1 : 0;
  const ceil = t < 763 || inn(t, 900, 990) ? 1 : 0;
  // aclarado del hisopo: lo que el test "lee"
  const lit = inn(t, 200, 216) ? win(t, 202.7, 204.3) : inn(t, 918, 926) ? win(t, 919.6, 920.6) : inn(t, 962, 966) ? win(t, 963.6, 964.4) : 0;
  return {
    mold, ceil, spots: ceil,
    cloud: cs !== undefined ? [cs, 3.2] : undefined,
    lit, swab: t >= sa - 0.2 && t < sa + 3 ? 1 : 0, swabA: sa,
    sq: inn(t, 726, 736) ? win(t, 730.3, 731.6) : inn(t, 982, 990) ? win(t, 984.9, 986.0) : 0,
    grow: 1, grow2: inn(t, 125, 133) ? win(t, 126.0, 129.0) : inn(t, 220, 229.5) ? win(t, 220.8, 223.6) : 1,
    brush: inn(t, 373.4, 375.6) ? ((t - 373.4) / 1.1) % 1 : inn(t, 970.0, 972.2) ? ((t - 970.0) / 1.1) % 1 : 0,
    burst: inn(t, 371, 380) ? cl((t - 373.8) / 4.2) : inn(t, 969, 975) ? cl((t - 970.3) / 3.5) : 0,
    bleach: inn(t, 454, 468) ? win(t, 455.2, 458.5) : 0,
    fizz: inn(t, 669, 676) ? win(t, 669.8, 670.8) : inn(t, 686, 694) ? 1 : 0,
    cap: inn(t, 522, 530) ? win(t, 523.2, 524.6) : 0,
    open: inn(t, 760, 805) ? win(t, 765.4, 766.8) * (1 - win(t, 800.0, 800.6)) : inn(t, 988, 1010) ? win(t, 992.4, 993.8) * (1 - win(t, 1004.6, 1005.6)) : 0,
    page: inn(t, 760, 788) ? "p20" : inn(t, 788, 805) ? "p53" : "p23",
    strips: inn(t, 651, 657.3) || inn(t, 921.6, 926) ? 1 : 0,
    dark: inn(t, 144.8, 152) ? 0.7 : inn(t, 633.5, 640.2) ? 0.55 * win(t, 634.0, 635.5) : inn(t, 651, 657.3) ? 0.6 : 0,
    tp: inn(t, 859.5, 863.6) ? 1 : 0,
    wet: inn(t, 829, 845.4) || inn(t, 866.8, 872.2) ? 1 : 0,
  };
};
export const stateAt = (t: number): WState => t >= 82.72 ? restState(t) : ({
  mold: 1,
  ceil: t < 3.9 ? 0 : t < 30 ? win(t, 3.9, 5.2) : 1,
  spots: t < 3.9 ? 0 : win(t, 4.2, 5.4),
  cloud: [3.0, 3.2],
  lit: win(t, 29.0, 30.6) * (t < 40 ? 1 : 0),
  swab: t > 27.4 && t < 31 ? 1 : 0,
  sq: t > 41.8 && t < 46 ? win(t, 42.0, 43.0) : 0,
  grow: t < 39 ? 1 : 1, grow2: t < 39 ? 0 : win(t, 39.3, 41.4),
  brush: t > 12 && t < 14.4 ? ((t - 12.05) / 1.1) % 1 : 0,
  burst: t < 12.3 ? 0 : cl((t - 12.3) / 4.2),
  bleach: 0, fizz: 0,
  open: win(t, 63.2, 64.6) * (1 - win(t, 79.0, 80.2)),
  page: "p23",
});

export const World: React.FC<{ t: number; st?: WState }> = ({ t, st }) => {
  const s = st ?? stateAt(t);
  const tx = useTextures();
  const bt = useBathTex();
  const pg = useImgTex(["p001", "p019", "p020", "p022", "p023", "p052", "p053"]);
  const dk = 1 - (s.dark ?? 0);
  const micro = camAt(t).p.x > 20;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={micro ? 0.5 : 0.22} threshold={micro ? 0.85 : 0.95} exposure={micro ? 0.7 : 0.85} env={micro ? 0.12 : 0.32} />
      {micro ? (
        <Micro t={t} grow={s.grow ?? 1} grow2={s.grow2 ?? 0} brush={s.brush ?? 0} burst={s.burst ?? 0} bleach={s.bleach ?? 0} fizz={s.fizz ?? 0} cap={s.cap ?? 0} tex={bt.dot} />
      ) : (
        <>
          <color attach="background" args={["#161c24"]} />
          <mesh><sphereGeometry args={[60, 32, 16]} /><meshBasicMaterial map={bt.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
          <hemisphereLight args={[0xe4ecf6, 0x2a2622, 0.5 * dk + 0.08]} />
          {dk < 0.99 && <directionalLight position={[-3, 3, 1]} intensity={0.9 * (1 - dk)} color="#8fb2ff" />}
          <directionalLight position={[4, 9, 7]} intensity={1.3 * dk} color="#fff3e2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
            shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
          <pointLight position={[0, 1.7, -0.3]} intensity={1.1 * dk} distance={5} color="#ffe8c8" castShadow />
          <spotLight position={[-1.3, 1.6, 0.4]} angle={0.8} penumbra={0.9} intensity={3 * dk + 0.6} distance={4} color="#eef4ff" target-position={PT.corner} />
          {/* piso del baño, paredes, techo cortado */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[3.3, 3.1]} /><meshStandardMaterial map={bt.hex} roughness={0.4} /></mesh>
          <Box p={[0, -0.06, 0]} s={[3.32, 0.12, 3.12]} c="#a9a49b" r={0.9} rad={0.01} />
          <Box p={[-0.78, 1.25, -1.6]} s={[1.75, 1.4, 0.06]} c="#f6f6f2" r={0.3} map={bt.tile} rad={0.004} />
          <Box p={[-0.78, 0.27, -1.6]} s={[1.75, 0.56, 0.06]} c="#f6f6f2" r={0.3} rad={0.004} />
          <Box p={[-1.63, 1.25, -1.14]} s={[0.06, 1.4, 0.98]} c="#f6f6f2" r={0.3} map={bt.tile} rad={0.004} />
          <Box p={[0.8, 1.25, -1.6]} s={[1.6, 2.5, 0.06]} c="#e9e4da" r={0.85} map={bt.paint} rad={0.004} />
          <Box p={[-0.78, 2.22, -1.6]} s={[1.75, 0.55, 0.06]} c="#e9e4da" r={0.85} map={bt.paint} rad={0.004} />
          <Box p={[-1.63, 1.25, 0.45]} s={[0.06, 2.5, 2.2]} c="#e9e4da" r={0.85} map={bt.paint} rad={0.004} />
          <Box p={[-1.63, 2.22, -1.14]} s={[0.06, 0.55, 0.98]} c="#e9e4da" r={0.85} map={bt.paint} rad={0.004} />
          <Box p={[0, 2.5, -0.03]} s={[3.32, 0.06, 3.14]} c="#ece8e0" r={0.9} rad={0.004} />
          {/* ventana con alféizar en la pared izquierda */}
          <mesh position={[-1.595, 1.65, 0.25]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.6, 0.62]} /><meshStandardMaterial color="#f0f6ff" emissive="#dfeaff" emissiveIntensity={0.9} roughness={0.9} /></mesh>
          <Box p={[-1.58, 1.3, 0.25]} s={[0.1, 0.03, 0.7]} c="#f5f4f0" r={0.5} rad={0.006} />
          {/* extractor */}
          <Box p={PT.vent} s={[0.26, 0.02, 0.26]} c="#f2f1ec" r={0.6} rad={0.006} />
          {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[PT.vent[0] - 0.1 + i * 0.04, PT.vent[1] - 0.012, PT.vent[2]]}><boxGeometry args={[0.012, 0.004, 0.22]} /><meshStandardMaterial color="#b9b7b0" /></mesh>)}
          {/* toallero + toalla */}
          <mesh position={[1.15, 1.32, -1.54]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.6, 12]} /><meshStandardMaterial {...CHROME} /></mesh>
          <Box p={[1.15, 1.08, -1.53]} s={[0.46, 0.48, 0.05]} c="#f0ece2" r={0.98} rad={0.02} />
          {/* alfombrita */}
          <Box p={[-0.75, 0.01, -0.45]} s={[0.8, 0.02, 0.5]} c="#d8c9a8" r={1} rad={0.01} />
          <Tub />
          <Toilet />
          <Caulk a={[-1.6, 0.565, -1.492]} b={[0.06, 0.565, -1.492]} />
          <Caulk a={[-1.59, 0.565, -1.5]} b={[-1.59, 0.565, -0.78]} />
          <Caulk a={[-1.592, 0.565, -1.494]} b={[-1.592, 1.95, -1.494]} />
          <CaulkMold k={s.mold ?? 1} lit={s.lit ?? 0} />
          <Decal p={[-1.5, 0.62, -1.565]} r={0.07 * (s.mold ?? 1)} tex={bt.blotch} o={0.8} />
          {/* lo que se contagia: el techo (plato), la toalla, el alféizar */}
          <Decal p={PT.ceil} r={0.13 * (s.ceil ?? 0) + 0.001} tex={bt.blotch} o={s.ceil ?? 0} rot={[Math.PI / 2, 0, 0]} />
          <Decal p={[1.1, 1.0, -1.503]} r={0.07 * (s.spots ?? 0) + 0.001} tex={bt.blotch} o={0.8 * (s.spots ?? 0)} />
          <Decal p={[-1.528, 1.32, 0.3]} r={0.06 * (s.spots ?? 0) + 0.001} tex={bt.blotch} o={0.8 * (s.spots ?? 0)} rot={[-Math.PI / 2, 0, 0]} />
          <Decal p={[0.2, 2.426, -0.6]} r={0.1 * (s.spots ?? 0) + 0.001} tex={bt.blotch} o={0.5 * (s.spots ?? 0)} rot={[Math.PI / 2, 0, 0]} />
          {s.cloud && <SporeCloud t={t} a={s.cloud[0]} dur={s.cloud[1]} o={1 - win(t, s.cloud[0] + s.cloud[1] + 2, s.cloud[0] + s.cloud[1] + 3)} tex={bt.dot} />}
          <SqFt k={s.sq ?? 0} />
          <Swab t={t} a={s.swabA ?? 27.6} on={s.swab ?? 0} />
          {/* desagüe de la bañera (lugar 2) */}
          <mesh position={[-1.36, 0.142, -1.14]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.035, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
          <mesh position={[-1.36, 0.143, -1.14]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.035, 0.045, 24]} /><meshStandardMaterial color="#1a1d18" roughness={1} /></mesh>
          {/* la mugre: aro gris grasoso alrededor del inodoro (no se aclara con lejía) */}
          <Decal p={[0.5, 0.004, -1.0]} r={0.2} tex={bt.blotch} o={0.32} rot={[-Math.PI / 2, 0, 0]} col="#9a9282" />
          <Decal p={[0.5, 0.0045, -1.08]} r={0.26} tex={bt.blotch} o={0.18} rot={[-Math.PI / 2, 0, 0.7]} col="#a39b8a" />
          <Strips k={s.strips ?? 0} />
          <TP t={t} k={s.tp ?? 0} />
          <Wet t={t} k={s.wet ?? 0} />
          {/* ===== EL PASILLO: piso de madera, la mesita con el balde y LA GUÍA ===== */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.002, 0]} receiveShadow><planeGeometry args={[1.7, 3.1]} /><meshStandardMaterial map={bt.wood} roughness={0.6} /></mesh>
          <Box p={[2.5, 1.25, -1.6]} s={[1.7, 2.5, 0.06]} c="#d9cfbd" r={0.9} rad={0.004} />
          <Box p={[1.64, 1.25, -1.05]} s={[0.08, 2.5, 1.15]} c="#e2dccf" r={0.9} rad={0.004} />
          <Box p={[1.64, 1.25, -0.46]} s={[0.12, 2.5, 0.06]} c="#f4f1ea" r={0.6} rad={0.01} />
          <Box p={[2.4, 0.76, 0.22]} s={[0.95, 0.04, 0.6]} c="#8a5a33" r={0.5} map={tx.planks} rad={0.01} />
          {[[-0.42, -0.25], [0.42, -0.25], [-0.42, 0.25], [0.42, 0.25]].map(([dx, dz], i) => <Box key={i} p={[2.4 + dx, 0.37, 0.22 + dz]} s={[0.04, 0.74, 0.04]} c="#6e4426" r={0.6} rad={0.01} />)}
          <Caddy />
          <spotLight position={[2.6, 2.3, 1.0]} angle={0.55} penumbra={0.8} intensity={6} distance={4} color="#fff2dc" target-position={PT.book} castShadow />
          <Book p={PT.book} open={s.open ?? 0} cover={pg.p001} inside={s.page === "p20" ? pg.p019_r : s.page === "p53" ? pg.p052_r : pg.p022_r} right={s.page === "p20" ? pg.p020 : s.page === "p53" ? pg.p053 : pg.p023} spine="#5b3920">
            {/* CTA1 · pág. 23: título, el hisopo, la mezcla, los minutos, el paso 3 */}
            <Marker t={t} at={68.1} out={78.3} box={[0.065, 0.348, 0.63, 0.385]} />
            <Marker t={t} at={71.72} out={78.3} box={[0.06, 0.6, 0.21, 0.62]} col="#9fd0ff" />
            <Marker t={t} at={72.6} out={78.3} box={[0.33, 0.488, 0.88, 0.526]} />
            <Marker t={t} at={73.2} out={78.3} box={[0.33, 0.537, 0.46, 0.555]} col="#ff9f43" />
            <Marker t={t} at={74.7} out={78.3} box={[0.08, 0.723, 0.67, 0.743]} col="#9fffb0" />
            {s.page === "p20" && <>{/* CTA2 · pág. 20 */}
              <Marker t={t} at={767.93} out={784.6} box={[0.07, 0.35, 0.775, 0.382]} />
              <Marker t={t} at={770.47} out={784.6} box={[0.08, 0.485, 0.45, 0.506]} col="#ff9f43" />
              <Marker t={t} at={771.51} out={784.6} box={[0.33, 0.514, 0.43, 0.533]} col="#ff9f43" />
              <Marker t={t} at={772.41} out={784.6} box={[0.08, 0.68, 0.48, 0.7]} col="#9fd0ff" />
              <Marker t={t} at={775.42} out={784.6} box={[0.08, 0.776, 0.67, 0.795]} col="#9fffb0" />
            </>}
            {s.page === "p53" && <>{/* pág. 53 · cuándo llamar a un profesional */}
              <Marker t={t} at={793.84} box={[0.08, 0.085, 0.6, 0.132]} />
              <Marker t={t} at={799.1} box={[0.08, 0.274, 0.8, 0.298]} col="#ff8a7a" />
            </>}
            {t > 990 && <>{/* CIERRE · pág. 23 otra vez */}
              <Marker t={t} at={994.24} out={1004.4} box={[0.065, 0.348, 0.63, 0.385]} />
              <Marker t={t} at={998.0} out={1004.4} box={[0.33, 0.488, 0.88, 0.526]} />
            </>}
          </Book>
        </>
      )}
    </ThreeCanvas>
  );
};
