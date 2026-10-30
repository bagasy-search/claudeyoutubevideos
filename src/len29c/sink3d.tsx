// len29c · EL MUNDO: la bañera/ducha de Lenny EN CORTE (plano z=0, de costado). La rejilla en el piso de la bañera, abajo la CRUZ
// donde se cuelga el pelo, la zapata baja al piso y se junta con el caño del REBOSADERO (la placa con la palanca y su varilla con el
// tapón) en la T; abajo del piso el SIFÓN y el brazo al caño de bajada. Cada punto del video vuelve acá con algo nuevo (pelo que
// crece, sopapa que lo empuja al sifón, la tira dentada que lo saca, el gancho, la placa con la varilla, agua caliente, el colador).
// Cámara y efectos salen de world.json (paradas ancladas a frases). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";
import WJ from "./world.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- cámaras con nombre (posición, mira, lente) ----------------
type C = { p: number[]; l: number[]; fov: number };
export const CAMS: Record<string, C> = {
  wide: { p: [-0.12, 0.42, 2.35], l: [0.05, 0.12, 0], fov: 40 },
  wide2: { p: [-0.75, 0.95, 2.1], l: [0.1, 0.18, 0], fov: 38 },
  shower: { p: [-0.55, 1.05, 2.5], l: [0.05, 0.85, -0.25], fov: 44 },
  tub: { p: [-0.05, 0.78, 0.78], l: [0.26, 0.12, -0.3], fov: 40 },
  drain: { p: [0.18, 0.32, 0.46], l: [0.3, 0.07, -0.02], fov: 38 },
  cross: { p: [0.27, 0.12, 0.34], l: [0.3, 0.04, 0], fov: 36 },
  trap: { p: [0.5, -0.12, 0.62], l: [0.57, -0.2, 0], fov: 36 },
  deep: { p: [0.52, -0.24, 0.44], l: [0.57, -0.23, 0], fov: 34 },
  overflow: { p: [0.05, 0.48, 0.62], l: [0.4, 0.34, -0.22], fov: 38 },
  rod: { p: [0.47, 0.2, 0.72], l: [0.5, 0.17, 0], fov: 38 },
  floor: { p: [0.25, -0.1, 1.25], l: [0.42, -0.14, 0], fov: 40 },
  arm: { p: [0.78, -0.14, 0.62], l: [0.8, -0.2, 0], fov: 38 },
};
type Stop = [number, string];
type FXK = [number, Record<string, number>];
const ST = (WJ as unknown as { cams: Stop[] }).cams ?? [[0, "wide"]];
const FK = (WJ as unknown as { fx: FXK[] }).fx ?? [];

// la cámara viaja entre paradas con curva (arco hacia arriba y de costado): nunca un zoom recto
export const camAt = (t: number) => {
  let i = 0; while (i < ST.length - 1 && ST[i + 1][0] <= t) i++;
  const cur = CAMS[ST[i][1]] ?? CAMS.wide, prev = i > 0 ? CAMS[ST[i - 1][1]] ?? CAMS.wide : cur;
  const D = Math.min(2.6, Math.max(1.2, (ST[i + 1]?.[0] ?? t + 9) - ST[i][0]) * 0.45);
  const k = i > 0 ? ease((t - ST[i][0]) / D) : 1;
  const p = v3(prev.p).lerp(v3(cur.p), k), l = v3(prev.l).lerp(v3(cur.l), k);
  const arc = Math.sin(Math.PI * k) * Math.min(0.12, p.distanceTo(v3(prev.p)) * 0.25);
  p.y += arc; p.x += arc * 0.6 * (i % 2 ? 1 : -1);
  // respiración lenta de la cámara (siempre viva, nunca quieta)
  p.x += 0.006 * Math.sin(t * 0.31); p.y += 0.004 * Math.sin(t * 0.23 + 1);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: number[]) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 200); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: number[]) => project(camAt(t), q);
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const dp = a.p.distanceTo(b.p) * 90 + a.l.distanceTo(b.l) * 40;
  return { bx: Math.min(12, dp * 0.5), by: Math.min(8, dp * 0.25) };
};
// efectos: cada clave se funde en 1 s desde su valor anterior
export const fxAt = (t: number): Record<string, number> => {
  const out: Record<string, number> = {}, prev: Record<string, number> = {};
  for (const [a, kv] of FK) {
    if (a > t) break;
    for (const [k, v] of Object.entries(kv)) { const from = out[k] ?? 0; prev[k] = from; out[k] = from + (v - from) * ease((t - a) / 1.0); }
  }
  return out;
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera, gl } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = camAt(t);
  gl.localClippingEnabled = true;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.005; c.far = 200; c.updateProjectionMatrix(); return null;
};

// ---------------- geometría en el plano z=0 ----------------
const tubeGeo = (c: THREE.Curve<THREE.Vector3>, r: (u: number) => number, nT = 140, nR = 40) => {
  const pos: number[] = [], nor: number[] = [], idx: number[] = [];
  const fr = c.computeFrenetFrames(nT, false);
  for (let i = 0; i <= nT; i++) {
    const p = c.getPointAt(i / nT), N = fr.normals[i], B = fr.binormals[i], R = r(i / nT);
    for (let j = 0; j <= nR; j++) {
      const v = (j / nR) * Math.PI * 2, cs = Math.cos(v), sn = Math.sin(v);
      const n = new THREE.Vector3(cs * N.x + sn * B.x, cs * N.y + sn * B.y, cs * N.z + sn * B.z);
      pos.push(p.x + R * n.x, p.y + R * n.y, p.z + R * n.z); nor.push(n.x, n.y, n.z);
    }
  }
  for (let i = 0; i < nT; i++) for (let j = 0; j < nR; j++) { const a = i * (nR + 1) + j, b = a + nR + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx); return g;
};
const stripGeo = (c: THREE.Curve<THREE.Vector3>, a: (u: number) => number, b: (u: number) => number, nT = 160, z = 0.0004) => {
  const pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= nT; i++) {
    const u = i / nT, p = c.getPointAt(u), tg = c.getTangentAt(u), nx = -tg.y, ny = tg.x;
    for (const sd of [1, -1]) pos.push(p.x + nx * a(u) * sd, p.y + ny * a(u) * sd, z, p.x + nx * b(u) * sd, p.y + ny * b(u) * sd, z);
  }
  for (let i = 0; i < nT; i++) for (let s = 0; s < 2; s++) { const q = i * 4 + s * 2, n = q + 4; if (s === 0) idx.push(q, n, q + 1, n, n + 1, q + 1); else idx.push(q, q + 1, n, n, q + 1, n + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const nn = g.getAttribute("normal") as THREE.BufferAttribute; for (let i = 0; i < nn.count; i++) nn.setXYZ(i, 0, 0, 1); return g;
};
const CLIP = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
const cr = (pts: number[][]) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], 0)), false, "centripetal");

let dot: THREE.Texture | null = null;
const softDot = () => {
  if (dot) return dot;
  const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.8)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); dot = new THREE.CanvasTexture(cv); return dot;
};
const Pts: React.FC<{ pts: Float32Array; color: string; size: number; opacity: number; add?: boolean }> = ({ pts, color, size, opacity, add = true }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  // siempre montado (opacidad 0 en vez de desmontar): sin destellos al aparecer
  return <points geometry={geo}><pointsMaterial map={softDot()} alphaTest={0.01} color={color} size={size} sizeAttenuation transparent opacity={Math.max(0, opacity)} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} depthWrite={false} toneMapped={!add} /></points>;
};
const Pipe: React.FC<{ c: THREE.Curve<THREE.Vector3>; ri: number; ro: number; col: string; cut: string; metal?: number; inner?: string; rough?: number; op?: number }> = ({ c, ri, ro, col, cut, metal = 0, inner, rough = 0.4, op = 1 }) => {
  const g = useMemo(() => ({ o: tubeGeo(c, () => ro), i: tubeGeo(c, () => ri), s: stripGeo(c, () => ri, () => ro), l1: stripGeo(c, () => ro - 0.0005, () => ro + 0.0004, 160, 0.0009), l2: stripGeo(c, () => ri - 0.0004, () => ri + 0.0005, 160, 0.0009) }), [c, ri, ro]);
  const tr = op < 0.999;
  return <group>
    <mesh geometry={g.o} castShadow receiveShadow><meshStandardMaterial color={col} roughness={rough} metalness={metal} clippingPlanes={[CLIP]} clipShadows transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.i} receiveShadow><meshStandardMaterial color={inner ?? col} roughness={0.7} metalness={metal * 0.6} clippingPlanes={[CLIP]} side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.s}><meshStandardMaterial color={cut} roughness={0.8} metalness={metal * 0.4} side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.l1}><meshBasicMaterial color="#1a1612" side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.l2}><meshBasicMaterial color="#1a1612" side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
  </group>;
};

const texCache = new Map<string, THREE.CanvasTexture>();
const tileTex = (rx: number, ry: number) => {
  const key = "t" + rx + "x" + ry; if (texCache.has(key)) return texCache.get(key)!;
  const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g = cv.getContext("2d")!;
  g.fillStyle = "#9b9180"; g.fillRect(0, 0, 256, 256);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = (rnd(r * 4 + c, 60) - 0.5) * 12; g.fillStyle = `rgb(${Math.round(236 + v)},${Math.round(226 + v)},${Math.round(204 + v)})`; g.fillRect(c * 64 + 3, r * 64 + 3, 58, 58); g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(c * 64 + 5, r * 64 + 5, 54, 5); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t); return t;
};
const woodTex = (rx: number, ry: number, base = [150, 98, 56]) => {
  const key = "w" + rx + "x" + ry + base.join(); if (texCache.has(key)) return texCache.get(key)!;
  const cv = document.createElement("canvas"); cv.width = 128; cv.height = 512; const g = cv.getContext("2d")!;
  g.fillStyle = `rgb(${base.join(",")})`; g.fillRect(0, 0, 128, 512);
  for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(60,30,10,${0.08 + 0.12 * rnd(i, 3)})`; g.lineWidth = 1 + 3 * rnd(i, 4); g.beginPath(); const x = rnd(i, 5) * 128; g.moveTo(x, 0); g.bezierCurveTo(x + 10 * rnd(i, 6), 170, x - 10 * rnd(i, 7), 340, x + 6 * rnd(i, 8), 512); g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t); return t;
};

// ---------------- medidas ----------------
export const DX = 0.3;                       // eje del desagüe de la bañera
const TUB_B = 0.1, TUB_T = 0.48;             // fondo (adentro) y borde de la bañera
const TUB_L = -0.85, TUB_R = 0.4;            // pared de la cabecera (izq.) y la de las canillas (der.)
const OVY = 0.36;                            // agujero del rebosadero en la pared de las canillas
const OX = 0.505;                            // caño del rebosadero (bajada) y la T
export const R_I = 0.019, R_O = 0.0235;      // caño de 1½"
const CROSS_Y = 0.078;                       // la cruz, 2 cm debajo de la rejilla
// zapata: baja del desagüe, dobla y corre hasta la T; rebosadero: sale de la placa y baja a la T; abajo la U, el brazo y la bajada
const SHOE = cr([[DX, TUB_B], [DX, 0.02], [DX + 0.03, -0.03], [DX + 0.08, -0.046], [OX, -0.05]]);
const OVF = cr([[TUB_R, OVY], [0.47, OVY], [OX, OVY - 0.035], [OX, 0.0], [OX, -0.05]]);
const TEE = cr([[OX, -0.05], [OX, -0.12]]);
export const UTRAP = cr([[OX, -0.12], [OX, -0.18], [OX + 0.015, -0.235], [OX + 0.06, -0.257], [OX + 0.105, -0.242], [OX + 0.125, -0.2], [OX + 0.13, -0.17]]);
export const ARM = cr([[OX + 0.13, -0.17], [OX + 0.16, -0.164], [0.75, -0.175], [0.86, -0.18]]);
export const STACK = cr([[0.86, -0.18], [0.895, -0.2], [0.91, -0.25], [0.912, -0.7]]);
const WEIR = -0.175;                          // nivel del sello de agua de la U
export const uPt = (u: number) => UTRAP.getPointAt(cl(u));
export const PT = {
  drain: [DX, TUB_B, 0], cross: [DX, CROSS_Y, 0], shoe: [DX + 0.08, -0.046, 0], tee: [OX, -0.06, 0], u: [OX + 0.06, -0.25, 0], crest: [OX + 0.13, -0.17, 0],
  plate: [TUB_R, OVY, -0.3], ovf: [OX, 0.15, 0], arm: [0.72, -0.175, 0], stack: [0.91, -0.35, 0], head: [0.38, 1.72, -0.35], spout: [0.36, 0.6, -0.35],
};

// ======================================================================================================================
export const SinkWorld: React.FC<{ t: number; fx?: Record<string, number>; post?: boolean }> = ({ t, fx: fxIn, post = true }) => {
  const fx = fxIn ?? fxAt(t), f = (k: string) => cl(fx[k] ?? 0);
  const fl = Math.round(t * FPS);
  const tubW = f("tubW"), film = f("film"), coverOff = 1 - f("cover"), hair = f("hair"), deep = f("deep"), plunger = f("plunger");
  const strip = f("strip"), twist = f("twist"), pull = f("pull"), hook = f("hook"), plate = f("plate"), plugHair = f("plugHair"), ovfStrip = f("ovfStrip");
  const hot = f("hot"), flow = f("flow"), shower = f("shower"), catcher = f("catcher"), catchHair = f("catchHair");
  const lvT = TUB_B + 0.004 + 0.09 * tubW;
  const gray = new THREE.Color("#a9c3cf").lerp(new THREE.Color("#8a877c"), 0.65).getStyle();
  const trapWater = new THREE.Color("#7fbde0").lerp(new THREE.Color("#8a8574"), 0.3 + deep * 0.4).getStyle();
  const geo = useMemo(() => ({
    uW: stripGeo(UTRAP, () => 0, () => R_I - 0.0008, 200, 0.0003),
  }), []);
  const sealClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), WEIR)], []);
  // ---- el PELO: mechones que cuelgan de la cruz (crecen con «hair»); la sopapa los aprieta hacia el sifón («deep»); la tira los sube («pull»)
  const lift = ease(pull) * 0.42;                                  // cuánto subió la tira (y el pelo enganchado)
  const stripTip = TUB_B + 0.3 - 0.46 * ease(strip);               // punta de la tira dentada (baja por la zapata)
  const hq = Math.round(Math.max(hair, deep * 0.9) * 24) / 24, dq = Math.round(deep * 24) / 24, lq = Math.round(lift * 40) / 40, pq = Math.round(plunger * 6) / 6;
  const hairGeo = useMemo(() => {
    if (hq < 0.02) return [] as THREE.BufferGeometry[];
    return Array.from({ length: 26 }, (_, i) => {
      const len = (0.025 + 0.11 * rnd(i, 41)) * hq, x0 = DX + (rnd(i, 42) - 0.5) * 0.03, sw = (rnd(i, 43) - 0.5) * 0.012;
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 10; k++) {
        const s = k / 10; let p = new THREE.Vector3(x0 + sw * Math.sin(s * 6 + i), CROSS_Y + 0.004 - len * s, -0.004 - rnd(i, 44) * 0.012);
        if (p.y < 0.02) { const u = cl((0.02 - p.y) / 0.12); const q = SHOE.getPointAt(0.25 + u * 0.4); p = new THREE.Vector3(q.x + sw, q.y + 0.004 * Math.sin(s * 9 + i), p.z); }
        if (dq > 0) { const q = uPt(0.36 + 0.28 * rnd(i * 11 + k, 45)); p.lerp(new THREE.Vector3(q.x + (rnd(i, 46) - 0.5) * 0.02, q.y + (rnd(k, 47) - 0.5) * 0.016, p.z), dq); }
        p.y += lq; if (lq > 0) p.x = p.x + (DX - p.x) * Math.min(1, lq * 3);
        pts.push(p);
      }
      return tubeGeo(new THREE.CatmullRomCurve3(pts), () => 0.0011, 40, 5);
    });
  }, [hq, dq, lq]);
  // pelo enredado en el tapón del rebosadero (sale con la placa)
  const plugQ = Math.round(plate * 30) / 30;
  const plugAt = (p: number): THREE.Vector3 => {
    if (p < 0.6) { const q = OVF.getPointAt(cl(0.85 - 0.85 * (p / 0.6))); return new THREE.Vector3(q.x, q.y - 0.03, -0.004); }
    const k = (p - 0.6) / 0.4; return new THREE.Vector3(TUB_R - 0.36 * ease(k), OVY + 0.05 * ease(k), -0.3 * ease(k));
  };
  const plug = plugAt(plugQ), plateP = new THREE.Vector3(TUB_R - 0.003 - 0.42 * ease(cl(plugQ / 0.6)) * 0 - 0.36 * ease(cl((plugQ - 0.6) / 0.4)) - 0.05 * ease(cl(plugQ / 0.6)), OVY + 0.05 * ease(cl((plugQ - 0.6) / 0.4)), -0.3);
  const rodGeo = useMemo(() => {
    const a = plateP.clone(), b = plug.clone(), m = a.clone().lerp(b, 0.5); m.y += 0.03;
    return tubeGeo(new THREE.CatmullRomCurve3([a, m, b]), () => 0.0028, 40, 8);
  }, [plugQ]); // eslint-disable-line react-hooks/exhaustive-deps
  // la tira dentada por el rebosadero
  const oq = Math.round(ovfStrip * 30) / 30;
  const ovfStripGeo = useMemo(() => {
    if (oq < 0.02) return null;
    const pts: THREE.Vector3[] = []; for (let i = 0; i <= 30; i++) { const s = i / 30; if (s < 0.3) pts.push(new THREE.Vector3(TUB_R - 0.25 + s / 0.3 * 0.25, OVY + 0.01, -0.006)); else { const q = OVF.getPointAt(Math.min(1, (s - 0.3) / 0.7) * oq); pts.push(new THREE.Vector3(q.x, q.y, -0.006)); } }
    return tubeGeo(new THREE.CatmullRomCurve3(pts), () => 0.004, 80, 6);
  }, [oq]);
  // gancho de alambre (con cinta) que baja por la rejilla
  const hookY = TUB_B + 0.32 - 0.33 * ease(hook);
  // ---------- partículas (siempre montadas) ----------
  const nW = 300, wP = new Float32Array(nW * 3);          // AGUA que corre: zapata → T → U → brazo → bajada
  for (let i = 0; i < nW; i++) {
    const ph = (fl * 0.02 + rnd(i, 8)) % 1, seg = ph < 0.2 ? 0 : ph < 0.45 ? 1 : ph < 0.75 ? 2 : 3;
    const c = seg === 0 ? SHOE : seg === 1 ? UTRAP : seg === 2 ? ARM : STACK, u = seg === 0 ? ph / 0.2 : seg === 1 ? (ph - 0.2) / 0.25 : seg === 2 ? (ph - 0.45) / 0.3 : (ph - 0.75) / 0.25 * 0.9;
    const p = c.getPointAt(cl(u)), tg = c.getTangentAt(cl(u)), d = (rnd(i, 9) * 2 - 1) * (R_I - 0.004);
    wP.set([p.x - tg.y * d, p.y + tg.x * d, -rnd(i, 10) * 0.012], i * 3);
  }
  const nV = 160, vP = new Float32Array(nV * 3);          // VAPOR del agua caliente
  for (let i = 0; i < nV; i++) { const ph = (fl * 0.008 + rnd(i, 11)) % 1; vP.set([DX - 0.3 + (rnd(i, 12) - 0.5) * 0.9 * (0.4 + ph), lvT + ph * 0.7, -0.05 - rnd(i, 13) * 0.5], i * 3); }
  const nR = 420, rP = new Float32Array(nR * 3);          // la DUCHA: gotas que caen de la flor a la bañera
  for (let i = 0; i < nR; i++) { const ph = (fl * 0.045 + rnd(i, 14)) % 1, a = rnd(i, 15) * Math.PI * 2, r = 0.02 + 0.2 * ph * rnd(i, 16); rP.set([0.3 + Math.cos(a) * r - ph * 0.25, 1.68 - ph * (1.68 - lvT), -0.35 + Math.sin(a) * r * 0.8], i * 3); }
  const nF = 120, fP = new Float32Array(nF * 3);          // la película de jabón sobre el agua gris
  for (let i = 0; i < nF; i++) { fP.set([TUB_L + 0.05 + rnd(i, 17) * (TUB_R - TUB_L - 0.1), lvT + 0.002, -0.02 - rnd(i, 18) * 0.64], i * 3); }

  const enamel = "#f6f5f1", chrome = "#e3e7ea", pvc = "#f4f3ef", cut = "#ffffff", cutTub = "#e9e6dd";
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      {post && <Post bloom={0.1} threshold={1.05} exposure={0.95} env={0.45} />}
      <color attach="background" args={["#0d0f12"]} />
      <fog attach="fog" args={["#0d0f12", 4, 16]} />
      <hemisphereLight args={["#e2e8ee", "#2a2420", 0.42]} />
      <spotLight position={[-0.5, 2.3, 1.6]} angle={0.7} penumbra={0.8} intensity={27} distance={7} castShadow color="#fff1de" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0.7, -0.05, 1.0]} angle={0.55} penumbra={0.9} intensity={7} distance={3} color="#dceaff" />
      <pointLight position={[0.35, 0.3, 0.3]} intensity={0.9} distance={1.2} color="#ffe2b8" />

      {/* ===== EL BAÑO (corte): piso de baldosa, contrapiso, vigas, cielorraso de abajo, pared del fondo con azulejos ===== */}
      <mesh position={[-0.2, 1.2, -0.72]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial map={tileTex(10, 6.6)} roughness={0.3} /></mesh>
      <mesh position={[-0.2, 0.24, -0.72]} receiveShadow><planeGeometry args={[2.4, 0.48]} /><meshStandardMaterial color="#e8e4da" roughness={0.6} /></mesh>
      <mesh position={[-1.15, 0.0, -0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.6, 0.84]} /><meshStandardMaterial map={tileTex(2.4, 3.4)} roughness={0.35} /></mesh>
      <mesh position={[0.1, -0.011, -0.36]} receiveShadow><boxGeometry args={[2.6, 0.022, 0.72]} /><meshStandardMaterial map={woodTex(4, 1, [172, 126, 78])} roughness={0.8} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.1, -0.011, 0.0006]}><planeGeometry args={[2.6, 0.022]} /><meshStandardMaterial map={woodTex(4, 1, [150, 104, 60])} roughness={0.85} /></mesh>
      <mesh position={[0.1, -0.17, -0.7]}><planeGeometry args={[2.6, 0.3]} /><meshStandardMaterial map={woodTex(6, 1, [104, 72, 44])} roughness={0.9} /></mesh>
      {[-0.55, 0.2, 1.05].map((x, i) => <mesh key={"vg" + i} position={[x, -0.145, -0.36]} castShadow receiveShadow><boxGeometry args={[0.045, 0.24, 0.72]} /><meshStandardMaterial map={woodTex(1, 1, [190, 146, 96])} roughness={0.8} clippingPlanes={[CLIP]} /></mesh>)}
      {[-0.55, 0.2, 1.05].map((x, i) => <mesh key={"vgc" + i} position={[x, -0.145, 0.0007]}><planeGeometry args={[0.045, 0.24]} /><meshStandardMaterial color="#c9a273" roughness={0.9} /></mesh>)}
      <mesh position={[0.1, -0.29, -0.36]}><boxGeometry args={[2.6, 0.014, 0.72]} /><meshStandardMaterial color="#8d877c" roughness={0.95} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.1, -0.29, 0.0006]}><planeGeometry args={[2.6, 0.014]} /><meshStandardMaterial color="#b9b2a5" roughness={0.9} /></mesh>

      {/* ===== LA BAÑERA (corte): adentro esmaltada, el corte se ve como una cinta blanca ===== */}
      <mesh position={[(TUB_L + TUB_R) / 2, (TUB_B + TUB_T) / 2, -0.35]} receiveShadow><boxGeometry args={[TUB_R - TUB_L, TUB_T - TUB_B, 0.7]} /><meshStandardMaterial color={enamel} roughness={0.18} metalness={0.02} side={THREE.BackSide} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[(TUB_L + TUB_R) / 2, TUB_B / 2, -0.69]} receiveShadow><planeGeometry args={[TUB_R - TUB_L + 0.12, TUB_B]} /><meshStandardMaterial color="#9a9083" roughness={1} /></mesh>
      <mesh position={[(TUB_L + TUB_R) / 2, 0.002, -0.35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[TUB_R - TUB_L + 0.12, 0.7]} /><meshStandardMaterial color="#8c8276" roughness={1} /></mesh>
      <mesh position={[(TUB_L + TUB_R) / 2, TUB_B - 0.008, 0.0009]}><planeGeometry args={[TUB_R - TUB_L + 0.12, 0.016]} /><meshStandardMaterial color={cutTub} roughness={0.5} /></mesh>
      <mesh position={[TUB_L - 0.03, (TUB_B + TUB_T) / 2 - 0.05, 0.0009]}><planeGeometry args={[0.06, TUB_T - TUB_B + 0.1]} /><meshStandardMaterial color={cutTub} roughness={0.5} /></mesh>
      <mesh position={[TUB_R + 0.03, (TUB_B + TUB_T) / 2 - 0.05, 0.0009]}><planeGeometry args={[0.06, TUB_T - TUB_B + 0.1]} /><meshStandardMaterial color={cutTub} roughness={0.5} /></mesh>
      <mesh position={[TUB_L - 0.03, TUB_T + 0.008, -0.35]} castShadow><boxGeometry args={[0.07, 0.018, 0.72]} /><meshStandardMaterial color={enamel} roughness={0.2} clippingPlanes={[CLIP]} /></mesh>
      {/* pared de las canillas (a la derecha, en corte): azulejo de cara a la bañera, el hueco con el rebosadero, el revoque */}
      <mesh position={[0.6, 0.98, -0.36]} receiveShadow><boxGeometry args={[0.016, 1.96, 0.72]} /><meshStandardMaterial color="#d9d3c4" roughness={0.9} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.6, 0.98, 0.0006]}><planeGeometry args={[0.016, 1.96]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} /></mesh>
      <mesh position={[0.455, 1.24, -0.36]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[0.72, 1.52]} /><meshStandardMaterial map={tileTex(3.3, 7)} roughness={0.3} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.53, 0.98, -0.7]}><planeGeometry args={[0.15, 1.96]} /><meshStandardMaterial color="#3b3a36" roughness={1} /></mesh>
      <mesh position={[0.1, 0.4, -1.3]}><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#2c2e2f" roughness={1} /></mesh>
      {/* canilla, llave mezcladora y la flor de la ducha */}
      <mesh position={[0.4, 0.6, -0.35]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.018, 0.024, 0.12, 24]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.12} /></mesh>
      <mesh position={[0.44, 0.92, -0.35]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.02, 32]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.12} /></mesh>
      <mesh position={[0.41, 0.92, -0.35]} castShadow><boxGeometry args={[0.05, 0.016, 0.016]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.12} /></mesh>
      <mesh position={[0.42, 1.76, -0.35]} rotation={[0, 0, Math.PI / 2 - 0.25]} castShadow><cylinderGeometry args={[0.011, 0.011, 0.14, 16]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.12} /></mesh>
      <mesh position={[0.34, 1.72, -0.35]} rotation={[0, 0, -0.9]} castShadow><cylinderGeometry args={[0.055, 0.03, 0.04, 32]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.15} /></mesh>
      {/* la PLACA del rebosadero con su palanquita (de cara a la bañera) */}
      <mesh position={[plateP.x, plateP.y, plateP.z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.008, 36]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.12} emissive="#ffb64a" emissiveIntensity={0.25 * plate * (0.6 + 0.4 * Math.sin(t * 4))} /></mesh>
      <mesh position={[plateP.x - 0.006, plateP.y + 0.012, plateP.z]} castShadow><boxGeometry args={[0.01, 0.026, 0.008]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.12} /></mesh>
      <mesh geometry={rodGeo}><meshStandardMaterial color="#b9bfc4" metalness={0.9} roughness={0.3} /></mesh>
      <mesh position={[plug.x, plug.y, plug.z]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.05, 20]} /><meshStandardMaterial color="#a8a9a4" metalness={0.8} roughness={0.35} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={"ph" + i} position={[plug.x, plug.y - 0.02 + i * 0.003, plug.z]} rotation={[Math.PI / 2 + (rnd(i, 50) - 0.5), rnd(i, 51), 0]}><torusGeometry args={[0.014 + 0.004 * rnd(i, 52), 0.0012, 4, 24]} /><meshStandardMaterial color="#3a2a1e" roughness={0.9} transparent opacity={plugHair} /></mesh>)}

      {/* agua gris en la bañera + la película de jabón */}
      <mesh position={[(TUB_L + TUB_R) / 2, (TUB_B + lvT) / 2, -0.35]} scale={[1, Math.max(0.001, tubW), 1]}><boxGeometry args={[TUB_R - TUB_L - 0.004, 0.09, 0.698]} /><meshStandardMaterial color={gray} transparent opacity={0.6 * Math.min(1, tubW * 6)} roughness={0.05} clippingPlanes={[CLIP]} depthWrite={false} /></mesh>

      {/* ===== CAÑERÍA: zapata, rebosadero, T, sifón, brazo, bajada ===== */}
      <Pipe c={SHOE} ri={R_I} ro={R_O} col="#e9e7e1" cut={cut} inner="#d9dee2" rough={0.35} />
      <Pipe c={OVF} ri={R_I} ro={R_O} col="#e9e7e1" cut={cut} inner="#d9dee2" rough={0.35} />
      <Pipe c={TEE} ri={R_I} ro={R_O + 0.004} col={pvc} cut={cut} inner="#d9dee2" rough={0.35} />
      <Pipe c={UTRAP} ri={R_I} ro={R_O} col={pvc} cut={cut} inner="#d9dee2" rough={0.35} />
      <mesh geometry={geo.uW}><meshStandardMaterial color={trapWater} transparent opacity={0.78} roughness={0.08} clippingPlanes={sealClip} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <Pipe c={ARM} ri={R_I} ro={R_O} col={pvc} cut={cut} inner="#d9dee2" rough={0.35} />
      <Pipe c={STACK} ri={R_I} ro={R_O + 0.002} col="#55585c" cut="#8a8d90" metal={0.6} inner="#cfd4d8" rough={0.4} />
      {/* la boca del desagüe (brida de cromo) y la CRUZ */}
      <mesh position={[DX, TUB_B - 0.006, -0.002]}><cylinderGeometry args={[0.03, 0.034, 0.014, 40, 1, true]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.15} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[DX, CROSS_Y, -0.003]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.0025, 0.0025, 0.036, 10]} /><meshStandardMaterial color="#c9ced3" metalness={0.9} roughness={0.25} emissive="#ffb64a" emissiveIntensity={0} /></mesh>
      <mesh position={[DX, CROSS_Y, -0.003]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.036, 10]} /><meshStandardMaterial color="#c9ced3" metalness={0.9} roughness={0.25} /></mesh>
      {/* la REJILLA: tapa con ranuras; cuando la sacan sube y se va al costado */}
      <group position={[DX - 0.16 * ease(coverOff), TUB_B + 0.002 + 0.12 * Math.sin(Math.PI * Math.min(1, coverOff)) * 0.6 + 0.004 * ease(coverOff), -0.18 * ease(coverOff)]} rotation={[0, 0, 0.5 * Math.sin(Math.PI * coverOff)]}>
        <mesh castShadow><cylinderGeometry args={[0.036, 0.036, 0.004, 40]} /><meshStandardMaterial color={chrome} metalness={1} roughness={0.14} clippingPlanes={coverOff > 0.3 ? [] : [CLIP]} /></mesh>
        {[-2, -1, 0, 1, 2].map((k) => <mesh key={"rj" + k} position={[k * 0.011, 0.0022, 0]}><boxGeometry args={[0.004, 0.0006, 0.05 - Math.abs(k) * 0.008]} /><meshBasicMaterial color="#2a2c2e" /></mesh>)}
      </group>
      {/* el COLADOR de silicona sobre la boca, con el pelo arriba */}
      <group position={[DX, TUB_B + 0.012, -0.03]} visible={catcher > 0.02}>
        <mesh><sphereGeometry args={[0.05, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#7fb0a6" roughness={0.6} transparent opacity={catcher} /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={"ch" + i} position={[(rnd(i, 53) - 0.5) * 0.05, 0.04 + 0.006 * rnd(i, 54), (rnd(i, 55) - 0.5) * 0.04]} rotation={[Math.PI / 2, 0, rnd(i, 56) * 6]}><torusGeometry args={[0.012 + 0.01 * rnd(i, 57), 0.0008, 4, 24, 4]} /><meshBasicMaterial color="#2a1e16" transparent opacity={catchHair * catcher} /></mesh>)}
      </group>
      {/* el PELO + jabón gris colgando de la cruz */}
      {hairGeo.map((g, i) => <mesh key={"hg" + i} geometry={g}><meshStandardMaterial color={i % 4 === 0 ? "#6a5a48" : "#2c2219"} roughness={0.9} transparent opacity={Math.min(1, Math.max(hair, deep) * 2)} /></mesh>)}
      {Array.from({ length: 40 }, (_, i) => {
        const s = rnd(i, 60), base0 = new THREE.Vector3(DX + (rnd(i, 61) - 0.5) * 0.026, CROSS_Y - 0.004 - 0.08 * s * hq, -rnd(i, 62) * 0.014);
        const q = uPt(0.38 + rnd(i, 63) * 0.26), p = base0.lerp(new THREE.Vector3(q.x, q.y + (rnd(i, 64) - 0.5) * 0.02, base0.z), dq); p.y += lq;
        return <mesh key={"gk" + i} position={[p.x, p.y, p.z]} scale={[1, 0.6, 0.8]} visible={hq > 0.02}><sphereGeometry args={[0.004 + 0.004 * rnd(i, 65), 10, 8]} /><meshStandardMaterial color={i % 3 ? "#8b877a" : "#b3ad9c"} roughness={0.7} transparent opacity={Math.min(1, Math.max(hair, deep) * 2)} /></mesh>;
      })}
      {/* la TIRA dentada de plástico (baja, gira, sube con el pelo) */}
      <group position={[DX, stripTip + lift + 0.23, -0.004]} rotation={[0, twist * Math.sin(t * 5) * 1.2, 0]} visible={strip > 0.02 || pull > 0.02}>
        <mesh castShadow><boxGeometry args={[0.012, 0.46, 0.0015]} /><meshStandardMaterial color="#2f2f33" roughness={0.6} /></mesh>
        {Array.from({ length: 18 }, (_, i) => [1, -1].map((sd) => <mesh key={"bb" + i + sd} position={[sd * 0.008, -0.22 + i * 0.013, 0]} rotation={[0, 0, sd * 0.7]}><boxGeometry args={[0.006, 0.0015, 0.0015]} /><meshStandardMaterial color="#2f2f33" roughness={0.6} /></mesh>))}
      </group>
      {/* el GANCHO de alambre con cinta */}
      <group position={[DX + 0.004, hookY, -0.004]} visible={hook > 0.02}>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.0013, 0.0013, 0.32, 8]} /><meshStandardMaterial color="#b9bdc1" metalness={0.9} roughness={0.3} /></mesh>
        <mesh position={[-0.0025, 0.0, 0]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.0028, 0.0013, 6, 16, Math.PI]} /><meshStandardMaterial color="#b9bdc1" metalness={0.9} roughness={0.3} /></mesh>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.0028, 0.0028, 0.03, 10]} /><meshStandardMaterial color="#3a6fb5" roughness={0.6} /></mesh>
      </group>
      {ovfStripGeo && <mesh geometry={ovfStripGeo} castShadow><meshStandardMaterial color="#2f2f33" roughness={0.6} /></mesh>}
      {/* la SOPAPA sobre la rejilla (bombea) */}
      <group position={[DX, TUB_B + 0.02 - 0.012 * Math.max(0, Math.sin(t * 6)) * pq + (1 - pq) * 0.5, -0.03]} visible={pq > 0.02}>
        <mesh castShadow><sphereGeometry args={[0.07, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c2302a" roughness={0.45} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.011, 0.011, 0.5, 14]} /><meshStandardMaterial map={woodTex(1, 2, [176, 128, 74])} roughness={0.7} /></mesh>
      </group>

      <Pts pts={wP} color={hot > 0.3 ? "#ffcf9a" : "#a8dcff"} size={0.0055} opacity={flow * 0.85} />
      <Pts pts={vP} color="#ffffff" size={0.06} opacity={hot * 0.2} add={false} />
      <Pts pts={rP} color="#cfeaff" size={0.006} opacity={shower * 0.8} />
      <Pts pts={fP} color="#f4f1e6" size={0.03} opacity={film * tubW * 0.35} add={false} />
    </ThreeCanvas>
  );
};
