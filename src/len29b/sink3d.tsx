// len29 · EL MUNDO: la pileta de la cocina de Lenny EN CORTE (plano z=0, de costado; la pared a la derecha).
// La pileta de acero cuelga de la mesada; el caño de cola baja al SIFÓN (la U con su sello de agua), el brazo va a la pared
// y adentro de la pared el caño de 1½" dobla hacia abajo (ahí crece la «vela» de grasa). Cada punto del video vuelve acá con
// una cosa nueva adentro (espuma, tapón, balde, espiral, colador, agua caliente…). Cámara y efectos salen de world.json
// (paradas ancladas a frases). Render SÓLO en el farm (acá sólo stills).
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
  wide: { p: [-0.05, 0.62, 1.55], l: [-0.02, 0.5, 0], fov: 38 },
  wide2: { p: [-0.35, 0.95, 1.7], l: [0.0, 0.48, 0], fov: 36 },
  sink: { p: [-0.2, 1.08, 0.62], l: [-0.18, 0.74, -0.05], fov: 40 },
  drain: { p: [-0.24, 0.8, 0.42], l: [-0.18, 0.62, 0], fov: 38 },
  trap: { p: [-0.12, 0.47, 0.5], l: [-0.11, 0.43, 0], fov: 36 },
  trapLo: { p: [-0.05, 0.3, 0.55], l: [-0.1, 0.38, 0], fov: 38 },
  arm: { p: [0.14, 0.5, 0.52], l: [0.14, 0.44, 0], fov: 38 },
  wall: { p: [0.3, 0.42, 0.46], l: [0.37, 0.36, 0], fov: 40 },
  stack: { p: [0.36, 0.2, 0.95], l: [0.37, 0.2, 0], fov: 42 },
  floor: { p: [-0.1, 0.18, 0.85], l: [-0.1, 0.25, 0], fov: 42 },
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
    <mesh geometry={g.o} castShadow receiveShadow><meshStandardMaterial color={col} roughness={rough} metalness={metal} clippingPlanes={[CLIP]} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.i} receiveShadow><meshStandardMaterial color={inner ?? col} roughness={0.7} metalness={metal * 0.6} clippingPlanes={[CLIP]} side={THREE.BackSide} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.s}><meshStandardMaterial color={cut} roughness={0.8} metalness={metal * 0.4} side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.l1}><meshBasicMaterial color="#1a1612" side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
    <mesh geometry={g.l2}><meshBasicMaterial color="#1a1612" side={THREE.DoubleSide} transparent={tr} opacity={op} /></mesh>
  </group>;
};

// ---------------- medidas ----------------
export const DX = -0.18;                     // eje del desagüe de la pileta
const SINK_B = 0.68, SINK_T = 0.885;         // fondo y borde de la pileta
export const R_I = 0.019, R_O = 0.0235;      // caño de 1½" (interior / exterior)
// la U sola (sale del caño de cola y sube a la cresta); el brazo va a la pared con pendiente
export const UTRAP = cr([[DX, 0.52], [DX, 0.46], [DX + 0.015, 0.405], [DX + 0.06, 0.383], [DX + 0.105, 0.398], [DX + 0.125, 0.44], [DX + 0.13, 0.47]]);
export const ARM = cr([[DX + 0.13, 0.47], [DX + 0.16, 0.476], [0.12, 0.468], [0.345, 0.458]]);
export const STACK = cr([[0.345, 0.458], [0.38, 0.44], [0.395, 0.39], [0.398, 0.2], [0.398, -0.25]]);
const TAIL = cr([[DX, SINK_B], [DX, 0.52]]);
const WEIR = 0.455;                          // nivel del sello de agua de la U
export const uPt = (u: number) => UTRAP.getPointAt(cl(u));
export const PT = {
  drain: [DX, SINK_B, 0], sink: [DX, 0.76, 0], tail: [DX, 0.58, 0], u: [DX + 0.06, 0.39, 0], uL: [DX, 0.45, 0], crest: [DX + 0.13, 0.47, 0],
  arm: [0.1, 0.47, 0], wall: [0.345, 0.458, 0], bend: [0.39, 0.4, 0], stack: [0.398, 0.25, 0], bucket: [DX + 0.06, 0.12, 0], nutL: [DX, 0.5, 0], nutR: [DX + 0.135, 0.472, 0],
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

export const SinkWorld: React.FC<{ t: number; fx?: Record<string, number>; post?: boolean }> = ({ t, fx: fxIn, post = true }) => {
  const fx = fxIn ?? fxAt(t), f = (k: string) => cl(fx[k] ?? 0);
  const fl = Math.round(t * FPS);
  const sinkW = f("sinkW"), foam = f("foam"), off = f("trapOff"), clog = f("clog") * (1 - f("clear")), candle = f("candle") * (1 - f("bored") * 0.7), grease = f("grease");
  const hot = f("hot"), flow = f("flow"), aug = f("auger"), strainer = f("strainer"), sag = f("sag"), enz = f("enzyme"), salt = f("salt"), hair = f("hair"), bucket = Math.max(f("bucket"), off);
  const gray = new THREE.Color("#8fb6c8").lerp(new THREE.Color("#7c7a70"), 0.7).lerp(new THREE.Color("#d58c5a"), hot * 0.35).getStyle();
  const trapWater = new THREE.Color("#7fbde0").lerp(new THREE.Color("#8a8574"), clog * 0.6 + salt * 0.2).getStyle();
  const lvS = SINK_B + 0.004 + 0.06 * sinkW;
  // la U baja al balde y se va de cuadro cuando la sacan (las tuercas quedan arriba)
  const uDrop = ease(off) * 0.2, uRot = ease(off) * 0.25;
  const geo = useMemo(() => ({
    uW: stripGeo(UTRAP, () => 0, () => R_I - 0.0008, 200, 0.0003),
    tailW: stripGeo(TAIL, () => 0, () => R_I - 0.0008, 40, 0.0003),
  }), []);
  const sealClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), WEIR + (sinkW > 0.05 ? 0.2 : 0))], [sinkW]);
  const tailClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), sinkW > 0.05 ? SINK_B : WEIR)], [sinkW]);
  // vela de grasa en la curva de la pared: anillo que engorda hacia adentro (sólo la mitad de atrás del corte)
  const candleGeo = useMemo(() => {
    const cq = Math.round(candle * 20) / 20; if (cq < 0.02) return null;
    return tubeGeo(STACK, (u) => R_I - (R_I - 0.003) * cq * Math.exp(-Math.pow((u - 0.33) / 0.18, 2)) * 0.98, 120, 32);
  }, [candle]);
  const greaseGeo = useMemo(() => { const gq = Math.round(grease * 10) / 10; return gq < 0.05 ? null : tubeGeo(ARM, (u) => R_I - 0.006 * gq * (0.4 + 0.6 * u), 90, 32); }, [grease]);
  const augQ = Math.round(aug * 40) / 40;
  const augGeo = useMemo(() => {
    if (augQ < 0.02) return null;
    const pts: THREE.Vector3[] = []; const N = 50;
    for (let i = 0; i < N; i++) { const s = (i / (N - 1)) * augQ; const p = s < 0.62 ? ARM.getPointAt(Math.min(1, s / 0.62)) : STACK.getPointAt(Math.min(0.6, (s - 0.62) / 0.38 * 0.6)); pts.push(new THREE.Vector3(p.x, p.y - 0.004, -0.004)); }
    return tubeGeo(new THREE.CatmullRomCurve3(pts), () => 0.0035, 160, 10);
  }, [augQ]);
  // ---------- partículas (siempre montadas) ----------
  const nF = 260, fP = new Float32Array(nF * 3);          // ESPUMA: sube por el caño de cola y se apila en la pileta
  for (let i = 0; i < nF; i++) {
    const ph = (fl * 0.012 + rnd(i, 1)) % 1, up = rnd(i, 2) < 0.4;
    if (up) fP.set([DX + (rnd(i, 3) - 0.5) * 0.024, WEIR + 0.01 + ph * (lvS - WEIR + 0.02), -rnd(i, 4) * 0.012], i * 3);
    else { const a = rnd(i, 5) * Math.PI * 2, r = 0.02 + 0.17 * Math.sqrt(rnd(i, 6)) * (0.4 + 0.6 * foam); fP.set([DX + Math.cos(a) * r, lvS + 0.006 + 0.035 * rnd(i, 7) * foam * (1 - r / 0.2) + 0.003 * Math.sin(t * 3 + i), Math.min(-0.002, Math.sin(a) * r * 0.6)], i * 3); }
  }
  const nW = 300, wP = new Float32Array(nW * 3);          // AGUA que corre: cola → U → brazo → pared
  for (let i = 0; i < nW; i++) {
    const ph = (fl * 0.02 + rnd(i, 8)) % 1, seg = ph < 0.25 ? 0 : ph < 0.6 ? 1 : 2;
    const c = seg === 0 ? UTRAP : seg === 1 ? ARM : STACK, u = seg === 0 ? ph / 0.25 : seg === 1 ? (ph - 0.25) / 0.35 : (ph - 0.6) / 0.4 * 0.9;
    const p = c.getPointAt(cl(u)), tg = c.getTangentAt(cl(u)), d = (rnd(i, 9) * 2 - 1) * (R_I - 0.004);
    wP.set([p.x - tg.y * d, p.y + tg.x * d - (seg === 0 ? uDrop : 0), -rnd(i, 10) * 0.012], i * 3);
  }
  const nV = 140, vP = new Float32Array(nV * 3);          // VAPOR del agua caliente
  for (let i = 0; i < nV; i++) { const ph = (fl * 0.008 + rnd(i, 11)) % 1; vP.set([DX + (rnd(i, 12) - 0.5) * 0.3 * (0.4 + ph), lvS + ph * 0.4, -0.02 - rnd(i, 13) * 0.1], i * 3); }
  const nS = 160, sP = new Float32Array(nS * 3);          // AGUA SALADA que baja lento y se queda sobre el tapón
  for (let i = 0; i < nS; i++) { const ph = (fl * 0.004 + rnd(i, 14)) % 1, y = SINK_B - ph * (SINK_B - 0.47); sP.set([DX + (rnd(i, 15) - 0.5) * 0.03, Math.max(WEIR + 0.004 + 0.01 * rnd(i, 16), y), -rnd(i, 17) * 0.01], i * 3); }
  const nE = 160, eP = new Float32Array(nE * 3);          // ENZIMAS: puntitos verdes que caminan por adentro del caño
  for (let i = 0; i < nE; i++) { const ph = (fl * 0.0025 + rnd(i, 18)) % 1, p = ARM.getPointAt(ph), sd = rnd(i, 19) < 0.5 ? 1 : -1; eP.set([p.x, p.y + sd * (R_I - 0.004), -rnd(i, 20) * 0.01], i * 3); }
  const nG = 90;                                          // el TAPÓN: grasa gris + pelo en el fondo de la U

  const steel = "#c9ced3", pvc = "#f4f3ef", cut = "#ffffff";
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      {post && <Post bloom={0.1} threshold={1.05} exposure={0.95} env={0.45} />}
      <color attach="background" args={["#0d0f12"]} />
      <fog attach="fog" args={["#0d0f12", 4, 16]} />
      <hemisphereLight args={["#e2e8ee", "#2a2420", 0.42]} />
      <spotLight position={[-0.6, 2.0, 1.3]} angle={0.6} penumbra={0.8} intensity={28} distance={6} castShadow color="#fff1de" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0.4, 0.5, 1.1]} angle={0.5} penumbra={0.9} intensity={6} distance={3} color="#dceaff" />
      <pointLight position={[-0.1, 0.45, 0.3]} intensity={0.7 + 0.5 * f("lamp")} distance={1.1} color="#ffe2b8" />

      {/* ===== EL MUEBLE (corte): piso, fondo de madera, puerta abierta, zócalo ===== */}
      <mesh position={[-0.1, 0, -0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.2, 1.2]} /><meshStandardMaterial color="#b8ab92" roughness={0.6} /></mesh>
      <mesh position={[-0.12, 0.43, -0.56]} receiveShadow><planeGeometry args={[0.93, 0.86]} /><meshStandardMaterial map={woodTex(2, 1, [120, 78, 44])} roughness={0.8} /></mesh>
      <mesh position={[-0.12, 0.06, -0.28]} receiveShadow><boxGeometry args={[0.93, 0.012, 0.56]} /><meshStandardMaterial map={woodTex(2, 1, [164, 112, 66])} roughness={0.75} /></mesh>
      <mesh position={[-0.585, 0.45, -0.28]} castShadow receiveShadow><boxGeometry args={[0.02, 0.9, 0.56]} /><meshStandardMaterial map={woodTex(1, 1, [150, 98, 56])} roughness={0.75} /></mesh>
      {/* mesada con borde y pileta de acero */}
      <mesh position={[-0.13, 0.9, -0.3]} castShadow receiveShadow><boxGeometry args={[1.0, 0.035, 0.62]} /><meshStandardMaterial color="#e9e2cf" roughness={0.45} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[-0.13, 0.9, 0.0006]}><planeGeometry args={[1.0, 0.035]} /><meshStandardMaterial color="#d8cfb6" roughness={0.6} /></mesh>
      <mesh position={[DX, (SINK_B + SINK_T) / 2, -0.22]}><boxGeometry args={[0.42, SINK_T - SINK_B, 0.44]} /><meshStandardMaterial color={steel} metalness={0.85} roughness={0.22} side={THREE.BackSide} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[DX, (SINK_B + SINK_T) / 2, 0.0007]}><planeGeometry args={[0.43, SINK_T - SINK_B]} /><meshStandardMaterial color="#1d2024" transparent opacity={0} /></mesh>
      {[[-1, 0], [1, 0]].map(([sd], i) => <mesh key={"sw" + i} position={[DX + sd * 0.212, (SINK_B + SINK_T) / 2, 0.0008]}><planeGeometry args={[0.006, SINK_T - SINK_B]} /><meshStandardMaterial color="#9aa2aa" metalness={0.7} roughness={0.3} /></mesh>)}
      <mesh position={[DX, SINK_B - 0.003, 0.0008]}><planeGeometry args={[0.43, 0.006]} /><meshStandardMaterial color="#9aa2aa" metalness={0.7} roughness={0.3} /></mesh>
      {/* agua gris en la pileta */}
      <mesh position={[DX, (SINK_B + lvS) / 2, -0.22]} scale={[1, Math.max(0.001, sinkW), 1]}><boxGeometry args={[0.41, 0.06, 0.43]} /><meshStandardMaterial color={gray} transparent opacity={0.62 * Math.min(1, sinkW * 6)} roughness={0.05} clippingPlanes={[CLIP]} depthWrite={false} /></mesh>
      {/* canilla */}
      <mesh position={[DX + 0.02, 1.02, -0.47]} castShadow><cylinderGeometry args={[0.014, 0.018, 0.22, 20]} /><meshStandardMaterial color="#e3e7ea" metalness={1} roughness={0.12} /></mesh>
      <mesh position={[DX + 0.02, 1.12, -0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.011, 0.011, 0.22, 16]} /><meshStandardMaterial color="#e3e7ea" metalness={1} roughness={0.12} /></mesh>
      {/* pared: azulejo arriba de la mesada, pared en corte (yeso + montante) a la derecha */}
      <mesh position={[-0.13, 1.25, -0.6]} receiveShadow><planeGeometry args={[1.2, 0.7]} /><meshStandardMaterial map={tileTex(8, 4.6)} roughness={0.3} /></mesh>
      <mesh position={[0.32, 0.55, -0.3]} receiveShadow><boxGeometry args={[0.016, 1.4, 0.62]} /><meshStandardMaterial color="#ece8de" roughness={0.9} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.32, 0.55, 0.0006]}><planeGeometry args={[0.016, 1.4]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} /></mesh>
      <mesh position={[0.47, 0.55, -0.3]} receiveShadow><boxGeometry args={[0.016, 1.4, 0.62]} /><meshStandardMaterial color="#d9d3c4" roughness={0.9} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.43, 0.55, -0.4]} castShadow><boxGeometry args={[0.04, 1.4, 0.09]} /><meshStandardMaterial map={woodTex(1, 3, [196, 156, 104])} roughness={0.8} /></mesh>
      <mesh position={[0.395, 0.55, -0.6]}><planeGeometry args={[0.15, 1.4]} /><meshStandardMaterial color="#3b3a36" roughness={1} /></mesh>
      <mesh position={[0.1, 0.2, -1.2]}><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#2c2e2f" roughness={1} /></mesh>

      {/* ===== CAÑERÍA: cola (cromo), U (PVC blanco), brazo, caño de la pared ===== */}
      <Pipe c={TAIL} ri={R_I - 0.002} ro={R_I + 0.001} col="#dfe4e8" cut="#c5ccd2" metal={0.9} inner="#6c7177" rough={0.18} />
      <mesh geometry={geo.tailW}><meshStandardMaterial color={trapWater} transparent opacity={0.75} roughness={0.1} clippingPlanes={tailClip} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {/* colador / canasto en la boca del desagüe */}
      <mesh position={[DX, SINK_B + 0.003, -0.002]}><cylinderGeometry args={[0.045, 0.045, 0.006, 40, 1, true]} /><meshStandardMaterial color="#d7dce0" metalness={1} roughness={0.15} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[DX, SINK_B + 0.005 - 0.04 * strainer, -0.002]} scale={[1, Math.max(0.001, strainer), 1]}><cylinderGeometry args={[0.042, 0.026, 0.05, 40, 4, true]} /><meshStandardMaterial color="#b9c0c6" metalness={0.9} roughness={0.35} wireframe transparent opacity={strainer} clippingPlanes={[CLIP]} /></mesh>
      <group position={[0, -uDrop, 0]} rotation={[0, 0, uRot * 0.3]}>
        <Pipe c={UTRAP} ri={R_I} ro={R_O} col={pvc} cut={cut} inner="#d9dee2" rough={0.35} op={1 - ease(cl((off - 0.7) / 0.3)) * 0.85} />
        <mesh geometry={geo.uW}><meshStandardMaterial color={trapWater} transparent opacity={0.78 * (1 - off)} roughness={0.08} clippingPlanes={sealClip} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        {/* el TAPÓN: grasa gris con pelo en el fondo de la U (sube con la U cuando la sacan) */}
        {Array.from({ length: nG }, (_, i) => { const u = 0.34 + rnd(i, 30) * 0.32, p = uPt(u), d = (rnd(i, 31) - 0.5) * R_I * 1.5; return (
          <mesh key={"cg" + i} position={[p.x + d * 0.3, p.y + d * 0.6, -rnd(i, 33) * 0.016]} rotation={[rnd(i, 34) * 3, rnd(i, 35) * 3, rnd(i, 36) * 3]} scale={[1, 0.5, 0.8]} visible={clog > 0.02}>
            <sphereGeometry args={[0.006 + 0.005 * rnd(i, 37), 10, 8]} /><meshStandardMaterial color={i % 5 === 0 ? "#f2eee2" : i % 3 ? "#7d786c" : "#9a9384"} roughness={0.85} transparent opacity={clog} /></mesh>); })}
        {Array.from({ length: 16 }, (_, i) => { const p = uPt(0.35 + rnd(i, 38) * 0.3); return (
          <mesh key={"hr" + i} position={[p.x, p.y, -0.006]} rotation={[0, 0, rnd(i, 39) * 6]} visible={hair > 0.02}><torusGeometry args={[0.008 + 0.01 * rnd(i, 40), 0.0006, 4, 24, 4]} /><meshBasicMaterial color="#2a1e16" transparent opacity={hair * clog} /></mesh>); })}
      </group>
      {/* tuercas deslizantes (quedan en su lugar; brillan cuando se nombran) */}
      {[PT.nutL, PT.nutR].map((q, i) => <mesh key={"nt" + i} position={[q[0], q[1] - (i === 0 ? 0.0 : 0), -0.002]} rotation={[0, 0, i === 0 ? 0 : Math.PI / 2 - 0.2]}><cylinderGeometry args={[R_O + 0.007, R_O + 0.007, 0.03, 24, 1, true]} /><meshStandardMaterial color="#eeeae0" emissive="#ffb64a" emissiveIntensity={0.8 * f("nuts") * (0.6 + 0.4 * Math.sin(t * 5))} roughness={0.4} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>)}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* el brazo (con su combado si le tiraron agua hirviendo) */}
        <group position={[0.12, 0.47, 0]} rotation={[0, 0, -sag * 0.09]} >
          <group position={[-0.12, -0.47 - sag * 0.012, 0]}>
            <Pipe c={ARM} ri={R_I} ro={R_O} col={pvc} cut={cut} inner="#d9dee2" rough={0.35} />
            {greaseGeo && <mesh geometry={greaseGeo}><meshStandardMaterial color="#d9c27a" roughness={0.6} side={THREE.BackSide} clippingPlanes={[CLIP]} /></mesh>}
          </group>
        </group>
        <Pipe c={STACK} ri={R_I} ro={R_O + 0.002} col={f("iron") > 0.5 ? "#55585c" : pvc} cut={f("iron") > 0.5 ? "#8a8d90" : cut} metal={f("iron") > 0.5 ? 0.6 : 0} inner="#cfd4d8" rough={0.4} />
        {candleGeo && <mesh geometry={candleGeo}><meshStandardMaterial color="#e6d39a" roughness={0.55} side={THREE.BackSide} clippingPlanes={[CLIP]} /></mesh>}
      </group>
      {/* ESPIRAL: cable de acero que entra por el brazo y dobla en la pared */}
      {augGeo && <mesh geometry={augGeo} castShadow><meshStandardMaterial color="#c9ccd0" metalness={0.9} roughness={0.25} /></mesh>}
      {/* BALDE naranja abajo de la U */}
      <group position={[DX + 0.06, 0.06 + 0.11, -0.16]} scale={[1, 1, 1]} visible={bucket > 0.02}>
        <mesh><cylinderGeometry args={[0.13, 0.11, 0.22, 40, 1, true]} /><meshStandardMaterial color="#e6762a" roughness={0.55} transparent opacity={bucket} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.08 + 0.05 * off, 0]}><cylinderGeometry args={[0.118, 0.112, 0.02, 40]} /><meshStandardMaterial color="#7b776a" roughness={0.1} transparent opacity={bucket * off} /></mesh>
      </group>
      <mesh position={[DX + 0.06, 0.068, -0.2]} rotation={[-Math.PI / 2, 0, 0.3]} visible={bucket > 0.02}><planeGeometry args={[0.5, 0.36]} /><meshStandardMaterial color="#cfc3a8" roughness={1} transparent opacity={bucket} /></mesh>

      <Pts pts={fP} color="#ffffff" size={0.012} opacity={foam * 0.95} add={false} />
      <Pts pts={wP} color={hot > 0.3 ? "#ffcf9a" : "#a8dcff"} size={0.0055} opacity={flow * 0.85} />
      <Pts pts={vP} color="#ffffff" size={0.04} opacity={hot * 0.22} add={false} />
      <Pts pts={sP} color="#e9f2f5" size={0.005} opacity={salt * 0.9} add={false} />
      <Pts pts={eP} color="#7dff9e" size={0.005} opacity={enz * 0.9} />
    </ThreeCanvas>
  );
};
