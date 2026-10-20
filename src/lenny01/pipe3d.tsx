// lenny01 · EL MUNDO: la pileta doble de la cocina de Lenny EN CORTE TÉCNICO (plano z=0 corta todo por el eje de los caños):
// pared del caño (PVC o galvanizado), sello de agua del sifón, anillo de grasa que crece hasta "el tamaño de un lápiz",
// jabón/pelo/borra/arroz atrapados, la taza (bicarbonato + sal gruesa) que se asienta en la curva, el agua caliente que
// lo ablanda y el anillo que SE SUELTA. Por la pared baja la columna al sótano y el caño principal va hasta la calle
// (raíces del árbol, caño roto). UNA escena; cada frase la mira con su propia cámara (kf) y sus niveles de efecto (fx).
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- cámara por keyframes ----------------
export type K = { t: number; p: number[]; l: number[]; fov: number; arc?: number };
export const camAt = (t: number, KF: K[]) => {
  let i = 0; while (i < KF.length - 1 && KF[i + 1].t <= t) i++;
  const a = KF[i], b = KF[Math.min(i + 1, KF.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  return { p, l: v3(a.l).lerp(v3(b.l), k), fov: a.fov + (b.fov - a.fov) * k };
};
export const project = (t: number, q: number[], KF: K[]) => {
  const c = camAt(t, KF), cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.005, 200); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
// velocidad de cámara en pantalla → blur de movimiento
export const camSpeed = (t: number, KF: K[]) => {
  const a = camAt(t, KF), b = camAt(t + 1 / FPS, KF);
  const dp = a.p.distanceTo(b.p) * 90 + a.l.distanceTo(b.l) * 40;
  return { bx: Math.min(12, dp * 0.5), by: Math.min(8, dp * 0.25) };
};
const Cam: React.FC<{ t: number; kf: K[] }> = ({ t, kf }) => {
  const { camera, gl } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = camAt(t, kf);
  gl.localClippingEnabled = true;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.005; c.far = 200; c.updateProjectionMatrix(); return null;
};

// ---------------- curvas en el plano z=0 ----------------
class Arc extends THREE.Curve<THREE.Vector3> {
  constructor(public cx: number, public cy: number, public r: number, public a0: number, public a1: number) { super(); }
  getPoint(u: number, o = new THREE.Vector3()) { const a = this.a0 + (this.a1 - this.a0) * u; return o.set(this.cx + this.r * Math.cos(a), this.cy + this.r * Math.sin(a), 0); }
}
const L = (a: number[], b: number[]) => new THREE.LineCurve3(new THREE.Vector3(a[0], a[1], 0), new THREE.Vector3(b[0], b[1], 0));
const path = (...cs: THREE.Curve<THREE.Vector3>[]) => { const p = new THREE.CurvePath<THREE.Vector3>(); cs.forEach((c) => p.add(c)); return p; };

// sifón de la pileta izquierda: bajada → U → subida → codo → brazo horizontal hasta la columna de la pared
export const R_IN = 0.0205, R_OUT = 0.0245;
export const TRAP = path(L([-0.25, 0.7], [-0.25, 0.4]), new Arc(-0.19, 0.4, 0.06, Math.PI, 2 * Math.PI), L([-0.13, 0.4], [-0.13, 0.44]), new Arc(-0.09, 0.44, 0.04, Math.PI, Math.PI / 2), L([-0.09, 0.48], [0.475, 0.48]));
// desagüe de la pileta derecha (continuo) que entra por la te a la bajada izquierda
const RIGHT = path(L([0.15, 0.7], [0.15, 0.58]), new Arc(0.11, 0.58, 0.04, 0, -Math.PI / 2), L([0.11, 0.54], [-0.228, 0.54]));
// columna en la pared → sótano → caño principal bajo el contrapiso hasta la cloaca de la calle
export const STACK = path(L([0.52, 1.7], [0.52, -2.4]), new Arc(0.64, -2.4, 0.12, Math.PI, 1.5 * Math.PI), L([0.64, -2.52], [13.6, -2.72]));
export const R_ST = 0.058, R_STO = 0.066;

// tubo con radio variable r(u) (la grasa engorda en la curva)
const tubeGeo = (c: THREE.Curve<THREE.Vector3>, r: (u: number) => number, nT = 140, nR = 44) => {
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
// cara del corte (en z=0): franja entre a(u) y b(u) a cada lado del eje (a=0 → franja entera, para el agua)
const stripGeo = (c: THREE.Curve<THREE.Vector3>, a: (u: number) => number, b: (u: number) => number, nT = 160, z = 0.0004) => {
  const pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= nT; i++) {
    const u = i / nT, p = c.getPointAt(u), tg = c.getTangentAt(u), nx = -tg.y, ny = tg.x;
    for (const sd of [1, -1]) { pos.push(p.x + nx * a(u) * sd, p.y + ny * a(u) * sd, z, p.x + nx * b(u) * sd, p.y + ny * b(u) * sd, z); }
  }
  for (let i = 0; i < nT; i++) for (let s = 0; s < 2; s++) { const q = i * 4 + s * 2, n = q + 4; if (s === 0) idx.push(q, n, q + 1, n, n + 1, q + 1); else idx.push(q, q + 1, n, n, q + 1, n + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const nn = g.getAttribute("normal") as THREE.BufferAttribute; for (let i = 0; i < nn.count; i++) nn.setXYZ(i, 0, 0, 1); return g;
};
// contorno fino (tinta) en los bordes del corte: separa pared / grasa / agua
const lineGeo = (c: THREE.Curve<THREE.Vector3>, rs: number[], w = 0.00055) => {
  const parts = rs.map((r) => stripGeo(c, () => r - w / 2, () => r + w / 2, 160, 0.0009));
  const pos: number[] = [], idx: number[] = []; let o = 0;
  parts.forEach((g) => { const a = g.getAttribute("position").array as ArrayLike<number>; for (let i = 0; i < a.length; i++) pos.push(a[i]); (g.getIndex()!.array as ArrayLike<number>).forEach((x) => idx.push(x + o)); o += a.length / 3; });
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
};
const CLIP = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);   // quita todo lo que está en z>0 (el corte)

// ---------------- partículas redondas ----------------
let dot: THREE.Texture | null = null;
const softDot = () => {
  if (dot) return dot;
  const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,.8)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); dot = new THREE.CanvasTexture(cv); return dot;
};
const Pts: React.FC<{ pts: Float32Array; color: string; size: number; opacity: number; add?: boolean }> = ({ pts, color, size, opacity, add = true }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  if (opacity <= 0.01) return null;
  return <points geometry={geo}><pointsMaterial map={softDot()} alphaTest={0.01} color={color} size={size} sizeAttenuation transparent opacity={opacity} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} depthWrite={false} toneMapped={!add} /></points>;
};

// ---------------- niveles de efecto ----------------
export type FX = {
  basin?: number;     // agua gris en la pileta izq. (0 vacía · 1 al borde)
  grease?: number;    // anillo de grasa (0 nada · 1 agujero del tamaño de un lápiz)
  drip?: number;      // gotas de grasa caliente que bajan y se ponen blancas en el caño frío
  scum?: number; debris?: number;   // jabón gris sobre la grasa · pelo, borra de café y arroz atrapados
  gas?: number;       // gas cloacal que sube y choca contra el sello
  seal?: number;      // sello de agua del sifón visible (default 1)
  mix?: number;       // la taza: bicarbonato + sal gruesa asentados sobre el tapón
  fizz?: number;      // la mezcla trabaja (burbujitas, la grasa se vuelve jabón)
  scrub?: number;     // la sal raspa las paredes
  hot?: number;       // agua caliente bajando (caño tibio, vapor)
  soften?: number;    // la junta del PVC se ablanda y gotea (agua hirviendo)
  flush?: number;     // descarga fuerte de agua
  letgo?: number;     // el anillo se suelta en pedazos y se va
  plunge?: number;    // pulsos de presión del sopapo
  escape?: number;    // la presión se escapa por la otra pileta (0 = trapo puesto)
  rag?: number;       // trapo en el desagüe derecho
  metal?: number;     // 1 = caños viejos de acero galvanizado / cromo
  rust?: number;      // el químico come el metal de adentro
  gurgle?: number;    // la burbuja del "gluglú"
  roots?: number; crack?: number; backup?: number;  // caño principal: raíces, rotura, agua que vuelve
  pan?: number;       // grasa que cae de la sartén a la pileta
};

const Pipe: React.FC<{ c: THREE.Curve<THREE.Vector3>; ri: number; ro: number; col: string; cut: string; metal?: number; inner?: string; rough?: number }> = ({ c, ri, ro, col, cut, metal = 0, inner, rough = 0.45 }) => {
  const g = useMemo(() => ({ o: tubeGeo(c, () => ro), i: tubeGeo(c, () => ri), s: stripGeo(c, () => ri, () => ro), l: lineGeo(c, [ri, ro]) }), [c, ri, ro]);
  return (
    <group>
      <mesh geometry={g.o} castShadow receiveShadow><meshStandardMaterial color={col} roughness={rough} metalness={metal} clippingPlanes={[CLIP]} side={THREE.FrontSide} /></mesh>
      <mesh geometry={g.i} receiveShadow><meshStandardMaterial color={inner ?? col} roughness={0.7} metalness={metal * 0.6} clippingPlanes={[CLIP]} side={THREE.BackSide} /></mesh>
      <mesh geometry={g.s}><meshStandardMaterial color={cut} roughness={0.85} metalness={metal * 0.4} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={g.l}><meshBasicMaterial color="#1a1612" side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

// largo de arco del sifón (para ubicar cosas por distancia)
const TL = TRAP.getLength();
const uAtY1 = (y: number) => (0.7 - y) / TL;            // en la bajada izquierda
export const trapPt = (u: number) => TRAP.getPointAt(cl(u));
// perfil del tapón: grasa sobre todo en el fondo de la U y el arranque del brazo
const gProf = (u: number) => { const s = u * TL; return sm((s - 0.16) / 0.12) * (1 - sm((s - 0.78) / 0.16)) * (0.75 + 0.25 * Math.sin(s * 23) * Math.sin(s * 7)); };
const SEAL_Y = 0.457;

export const PipeWorld: React.FC<{ t: number; kf: K[]; fx?: FX; post?: boolean; night?: number; hide?: string }> = ({ t, kf, fx = {}, post = true, night = 0, hide = "" }) => {
  const T = useTextures();
  const fl = Math.round(t * FPS);
  const G = cl(fx.grease ?? 0) * (1 - 0.92 * cl(fx.letgo ?? 0));
  const metal = cl(fx.metal ?? 0), rust = cl(fx.rust ?? 0);
  const th = (u: number) => G * gProf(u) * (R_IN - 0.0042);       // espesor de la grasa
  const geo = useMemo(() => {
    const qG = Math.round(G * 40) / 40;   // cache por escalones (40 niveles)
    const thq = (u: number) => qG * gProf(u) * (R_IN - 0.0042);
    return {
      gTube: tubeGeo(TRAP, (u) => R_IN - Math.max(0.0004, thq(u)), 160, 44),
      gStrip: stripGeo(TRAP, (u) => R_IN - Math.max(0.0004, thq(u)), () => R_IN - 0.0002, 160, 0.0006),
      wTube: tubeGeo(TRAP, (u) => R_IN - Math.max(0.0006, thq(u)) - 0.0004, 160, 44),
      gLine: stripGeo(TRAP, (u) => R_IN - Math.max(0.0004, thq(u)) - 0.0003, (u) => R_IN - Math.max(0.0004, thq(u)) + 0.0003, 160, 0.0009),
      wStrip: stripGeo(TRAP, () => 0, (u) => R_IN - Math.max(0.0006, thq(u)) - 0.0006, 160, 0.0002),
    };
  }, [Math.round(G * 40)]);
  const sealClip = useMemo(() => [CLIP, new THREE.Plane(new THREE.Vector3(0, -1, 0), SEAL_Y)], []);
  const bk = cl(fx.backup ?? 0);
  const bkGeo = useMemo(() => stripGeo(STACK, () => 0, () => R_ST - 0.003, 400, 0.0003), []);
  const bkClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(1, 0, 0), -(13.6 - 13.2 * bk)), new THREE.Plane(new THREE.Vector3(0, -1, 0), -2.2)], [bk]);
  const sealClipS = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, -1, 0), SEAL_Y)], []);   // la franja del corte está en z>0: sin CLIP
  const basinClip = useMemo(() => [CLIP, new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.705 + 0.18 * cl(fx.basin ?? 0))], [fx.basin]);

  // ---------- partículas ----------
  // grasa caliente (ámbar) que baja por la bajada y se vuelve cera blanca al tocar el caño frío
  const drip = cl(fx.drip ?? 0), nD = 160, dA = new Float32Array(nD * 3), dW = new Float32Array(nD * 3);
  for (let i = 0; i < nD; i++) {
    const ph = (fl * 0.006 + rnd(i, 1)) % 1, u = ph * 0.62, p = trapPt(u), tg = TRAP.getTangentAt(cl(u));
    const off = (rnd(i, 2) - 0.5) * 1.6 * R_IN * 0.7, z = -rnd(i, 3) * R_IN * 0.6;
    const q = [p.x - tg.y * off, p.y + tg.x * off, z];
    (u < 0.24 ? dA : dW).set(q, i * 3);
  }
  // pelo/borra/arroz atrapados en la grasa (en la cara del corte, dentro de la franja de grasa)
  const deb = cl(fx.debris ?? 0) * (1 - cl(fx.letgo ?? 0)), nB = 220, bH = new Float32Array(nB * 3), bC = new Float32Array(nB * 3), bR = new Float32Array(nB * 3);
  for (let i = 0; i < nB; i++) {
    const u = 0.17 + rnd(i, 4) * 0.55, p = trapPt(u), tg = TRAP.getTangentAt(u), sd = rnd(i, 5) < 0.5 ? 1 : -1;
    const d = (R_IN - th(u) * (0.15 + 0.8 * rnd(i, 6))) * sd, q = [p.x - tg.y * d, p.y + tg.x * d, 0.0009];
    const k = rnd(i, 7); (k < 0.45 ? bH : k < 0.8 ? bC : bR).set(q, i * 3);
  }
  // gas cloacal: sube por la columna, entra al brazo y choca contra el sello (rebota)
  const gas = cl(fx.gas ?? 0), nG = 260, gP = new Float32Array(nG * 3);
  for (let i = 0; i < nG; i++) {
    const ph = (fl * 0.005 + rnd(i, 8)) % 1, a = rnd(i, 9) * 6.283;
    let q: number[];
    if (ph < 0.55) { const y = -0.8 + ph / 0.55 * 1.28; q = [0.52 + Math.cos(a) * 0.03 * rnd(i, 10), y, -0.02 * rnd(i, 11)]; }
    else { const k = (ph - 0.55) / 0.45, x = 0.47 - k * 0.56, wob = Math.sin(fl * 0.3 + i) * 0.006 * k; q = [Math.max(-0.1, x) + wob, 0.48 + (rnd(i, 12) - 0.5) * 0.03, -0.015 * rnd(i, 13)]; }
    gP.set(q, i * 3);
  }
  // la taza: bicarbonato (polvo blanco) + sal gruesa (cristales) asentados en la curva sobre el tapón
  const mix = cl(fx.mix ?? 0), nM = 420, mS = new Float32Array(nM * 3), mC = new Float32Array(nM * 3);
  for (let i = 0; i < nM; i++) {
    const fall = cl(mix * 1.6 - rnd(i, 14) * 0.6);
    const u = 0.12 + (0.2 + 0.12 * rnd(i, 15)) * fall * (1 - cl(fx.flush ?? 0)) + 0.6 * cl(fx.flush ?? 0) * rnd(i, 16);
    const p = trapPt(u), tg = TRAP.getTangentAt(cl(u)), r = (R_IN - th(u) - 0.001) * (rnd(i, 17) * 2 - 1) * 0.9;
    const scr = cl(fx.scrub ?? 0) * Math.sin(fl * 0.12 + i) * 0.004;
    (i % 3 === 0 ? mC : mS).set([p.x - tg.y * r + scr, p.y + tg.x * r, -rnd(i, 18) * R_IN * 0.7], i * 3);
  }
  // burbujas de la reacción + vapor del agua caliente + descarga
  const fz = cl(fx.fizz ?? 0), nF = 200, fP = new Float32Array(nF * 3);
  for (let i = 0; i < nF; i++) { const ph = (fl * 0.02 + rnd(i, 19)) % 1, u = 0.2 + rnd(i, 20) * 0.26, p = trapPt(u); fP.set([p.x + (rnd(i, 21) - 0.5) * 0.03, p.y + ph * 0.02, -rnd(i, 22) * 0.012], i * 3); }
  const fsh = cl(fx.flush ?? 0), hot = cl(fx.hot ?? 0), nW = 520, wP = new Float32Array(nW * 3);
  for (let i = 0; i < nW; i++) {
    const ph = (fl * (0.012 + 0.02 * fsh) + rnd(i, 23)) % 1, u = ph, p = TRAP.getPointAt(u), tg = TRAP.getTangentAt(u);
    const r = (R_IN - th(u) - 0.001) * (rnd(i, 24) * 2 - 1) * 0.92; wP.set([p.x - tg.y * r, p.y + tg.x * r, -rnd(i, 25) * R_IN * 0.7], i * 3);
  }
  const nV = 160, vP = new Float32Array(nV * 3);
  for (let i = 0; i < nV; i++) { const ph = (fl * 0.008 + rnd(i, 26)) % 1; vP.set([-0.25 + (rnd(i, 27) - 0.5) * 0.25 * ph, 0.71 + ph * 0.35, -0.05 - rnd(i, 28) * 0.1], i * 3); }
  // pedazos del anillo que se sueltan y se van por el brazo
  const lg = cl(fx.letgo ?? 0), nL = 90, lP = new Float32Array(nL * 3);
  for (let i = 0; i < nL; i++) { const u = 0.22 + rnd(i, 29) * 0.4 + lg * (0.5 + rnd(i, 30) * 0.6), p = trapPt(Math.min(0.999, u)), tg = TRAP.getTangentAt(Math.min(0.999, u)), r = (rnd(i, 31) - 0.5) * R_IN * 1.4; lP.set([p.x - tg.y * r, p.y + tg.x * r, -rnd(i, 32) * 0.01], i * 3); }
  // presión del sopapo: pulsos que bajan; con la otra pileta abierta se escapan por ahí
  const pl = cl(fx.plunge ?? 0), esc = cl(fx.escape ?? 0), nP = 240, pP = new Float32Array(nP * 3), eP = new Float32Array(nP * 3);
  for (let i = 0; i < nP; i++) {
    const ph = (fl * 0.03 + rnd(i, 33)) % 1;
    const toClog = rnd(i, 34) > esc, p = toClog ? trapPt(ph * 0.3) : ph < 0.5 ? trapPt(ph * 0.3) : RIGHT.getPointAt(cl(1 - (ph - 0.5) * 2));
    const q = [p.x + (rnd(i, 35) - 0.5) * 0.02, p.y, -rnd(i, 36) * 0.01];
    (toClog ? pP : eP).set(q, i * 3);
  }
  // goteo de la junta ablandada (PVC + agua hirviendo)
  const sof = cl(fx.soften ?? 0), dripY = 0.6 - ((fl * 0.02) % 1) * 0.5;
  // gluglú: burbuja que sube por la U
  const gu = cl(fx.gurgle ?? 0), gph = (t * 0.9) % 1, gb = trapPt(0.62 - gph * 0.35);

  // colores de caño
  const pvc = new THREE.Color("#ece9e2").lerp(new THREE.Color("#8d9196"), metal).lerp(new THREE.Color("#8a4a24"), rust * 0.6).getStyle();
  const pvcCut = new THREE.Color("#b4bbc2").lerp(new THREE.Color("#b9bcc0"), metal).getStyle();
  const pvcIn = new THREE.Color("#34312d").lerp(new THREE.Color("#5a5148"), metal).lerp(new THREE.Color("#9b4a1c"), rust).getStyle();
  const hotTint = sm(hot * 1.6);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} kf={kf} />
      {post && <Post bloom={0.12} threshold={1.05} exposure={0.92 - night * 0.3} env={0.22} />}
      <color attach="background" args={["#0b0e12"]} />
      <fog attach="fog" args={["#0b0e12", 6, 26]} />
      <hemisphereLight args={["#c9d6ea", "#2a2018", 0.32]} />
      {/* luz de cocina (techo) + linterna fría dentro del bajo mesada */}
      <spotLight position={[-0.4, 2.6, 1.6]} angle={0.6} penumbra={0.75} intensity={34} distance={7} castShadow color="#fff1dc" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0.15, 0.55, 1.1]} angle={0.42} penumbra={0.8} intensity={7} distance={3} color="#dce9ff" />
      <pointLight position={[-0.1, 0.5, 0.35]} intensity={0.55} distance={1.4} color="#ffe0b8" />
      {/* sótano: foco pelado */}
      <pointLight position={[1.6, -0.9, 1.2]} intensity={9} distance={7} color="#ffd29a" />
      {/* afuera: atardecer */}
      <directionalLight position={[8, 6, 6]} intensity={1.2} color="#ffc48a" />

      {/* ===== COCINA ===== */}
      {/* piso (corte: tablas + contrapiso + vigas), deja el agujero de la columna */}
      <mesh position={[-1.32, -0.13, -1.2]} receiveShadow><boxGeometry args={[3.7, 0.26, 2.4]} /><meshStandardMaterial color="#6a5440" roughness={0.9} /></mesh>
      <mesh position={[0.52 + 1.32 + 0.03, -0.13, -1.2]} receiveShadow><boxGeometry args={[2.64, 0.26, 2.4]} /><meshStandardMaterial color="#6a5440" roughness={0.9} /></mesh>
      <mesh position={[-1.32, 0.003, -1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.7, 2.4]} /><meshStandardMaterial color="#c9bc9c" roughness={0.6} /></mesh>
      {/* pared del fondo con azulejo + pared lateral (corte con montantes) */}
      <mesh position={[-0.6, 1.25, -0.62]} receiveShadow><planeGeometry args={[4.4, 2.5]} /><meshStandardMaterial color="#d9cfb9" roughness={0.9} /></mesh>
      <mesh position={[-0.1, 1.12, -0.615]}><planeGeometry args={[1.1, 0.42]} /><meshStandardMaterial color="#e8e0cc" roughness={0.35} /></mesh>
      <mesh position={[0.452, 1.25, -0.31]}><boxGeometry args={[0.012, 2.5, 0.62]} /><meshStandardMaterial color="#e3dccb" roughness={0.85} /></mesh>
      <mesh position={[0.594, 1.25, -0.31]}><boxGeometry args={[0.012, 2.5, 0.62]} /><meshStandardMaterial color="#e3dccb" roughness={0.85} /></mesh>
      <mesh position={[0.523, 1.25, -0.6]}><boxGeometry args={[0.13, 2.5, 0.04]} /><meshStandardMaterial color="#b98d5a" roughness={0.9} /></mesh>
      <mesh position={[0.523, 1.25, 0.0005]}><planeGeometry args={[0.154, 2.5]} /><meshStandardMaterial color="#2a241e" transparent opacity={0.35} /></mesh>
      {/* bajo mesada (roble) cortado de frente */}
      {[-0.63, 0.43].map((x) => <mesh key={x} position={[x, 0.45, -0.29]} castShadow receiveShadow geometry={rbox(0.02, 0.86, 0.58, 0.004)}><meshStandardMaterial color="#7a5232" roughness={0.65} /></mesh>)}
      <mesh position={[-0.1, 0.09, -0.29]} receiveShadow><boxGeometry args={[1.04, 0.02, 0.58]} /><meshStandardMaterial color="#7d5530" roughness={0.8} /></mesh>
      <mesh position={[-0.1, 0.45, -0.585]} receiveShadow><boxGeometry args={[1.04, 0.72, 0.01]} /><meshStandardMaterial color="#5e4128" roughness={0.9} /></mesh>
      {/* balde naranja + botellas lisas dentro del bajo mesada */}
      <mesh position={[-0.47, 0.19, -0.3]} castShadow><cylinderGeometry args={[0.11, 0.095, 0.18, 28, 1, true]} /><meshStandardMaterial color="#e2702a" roughness={0.55} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.3, 0.2, -0.38]} castShadow><cylinderGeometry args={[0.04, 0.045, 0.2, 18]} /><meshStandardMaterial color="#f1f1ec" roughness={0.4} /></mesh>
      <mesh position={[0.22, 0.17, -0.42]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.14, 18]} /><meshStandardMaterial color="#3e7fbf" roughness={0.35} /></mesh>
      {/* mesada (laminado beige, se ve el aglomerado en el corte) con los huecos de las piletas */}
      {([[-0.56, 0.18], [0.41, 0.08], [0, 0.06]] as number[][]).map(([x, w], i) => <mesh key={"ct" + i} position={[x, 0.905, -0.105]} castShadow receiveShadow><boxGeometry args={[w, 0.038, 0.21]} /><meshStandardMaterial color="#d8c9a8" roughness={0.5} clippingPlanes={[CLIP]} /></mesh>)}
      <mesh position={[-0.1, 0.905, -0.41]} castShadow receiveShadow><boxGeometry args={[1.12, 0.038, 0.4]} /><meshStandardMaterial color="#d8c9a8" roughness={0.5} /></mesh>
      {/* piletas de acero (cortadas al medio) */}
      {([[-0.25, 0.44], [0.2, 0.34]] as number[][]).map(([cx, w], i) => (
        <group key={"b" + i}>
          <mesh position={[cx, 0.703, -0.105]} receiveShadow><boxGeometry args={[w, 0.006, 0.21]} /><meshStandardMaterial color="#b8bec4" metalness={0.85} roughness={0.28} clippingPlanes={[CLIP]} /></mesh>
          <mesh position={[cx, 0.8, -0.212]} receiveShadow><boxGeometry args={[w, 0.2, 0.006]} /><meshStandardMaterial color="#c3c9cf" metalness={0.85} roughness={0.25} /></mesh>
          {[-1, 1].map((sd) => <mesh key={sd} position={[cx + sd * w / 2, 0.8, -0.105]} receiveShadow><boxGeometry args={[0.006, 0.2, 0.21]} /><meshStandardMaterial color="#c3c9cf" metalness={0.85} roughness={0.25} clippingPlanes={[CLIP]} /></mesh>)}
          {/* rejilla del desagüe */}
          <mesh position={[i ? 0.15 : -0.25, 0.707, -0.0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.022, 0.042, 32, 1, Math.PI, Math.PI]} /><meshStandardMaterial color="#9aa1a8" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} /></mesh>
        </group>
      ))}
      {/* canilla cuello de cisne */}
      <mesh position={[-0.03, 1.03, -0.27]} castShadow><cylinderGeometry args={[0.016, 0.02, 0.24, 18]} /><meshStandardMaterial color="#d7dde3" metalness={1} roughness={0.12} /></mesh>
      <mesh position={[-0.03, 1.15, -0.2]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[0.07, 0.013, 12, 32, Math.PI]} /><meshStandardMaterial color="#d7dde3" metalness={1} roughness={0.12} /></mesh>
      {/* agua gris de la pileta (sube con fx.basin) + restos flotando */}
      {(fx.basin ?? 0) > 0.01 && <>
        <mesh position={[-0.25, 0.8, -0.105]}><boxGeometry args={[0.43, 0.19, 0.205]} /><meshStandardMaterial color="#6d6a5c" transparent opacity={0.82} roughness={0.15} metalness={0.1} clippingPlanes={basinClip} /></mesh>
        <mesh position={[-0.25, 0.7051 + 0.18 * cl(fx.basin ?? 0), -0.105]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.43, 0.205]} /><meshStandardMaterial color="#8a8676" roughness={0.08} metalness={0.25} transparent opacity={0.9} clippingPlanes={[CLIP]} /></mesh>
        {Array.from({ length: 18 }, (_, i) => <mesh key={"fb" + i} position={[-0.43 + rnd(i, 40) * 0.36 + Math.sin(t * 0.4 + i) * 0.01, 0.707 + 0.18 * cl(fx.basin ?? 0), -0.2 + rnd(i, 41) * 0.19]} rotation={[0, t * 0.3 + i, 0]}>
          <boxGeometry args={[0.008 + rnd(i, 42) * 0.01, 0.003, 0.005]} /><meshStandardMaterial color={i % 3 ? "#efe9d6" : "#6e8a3a"} roughness={0.6} /></mesh>)}
      </>}
      {/* trapo en el desagüe derecho */}
      {(fx.rag ?? 0) > 0.01 && <mesh position={[0.15, 0.715 + 0.04 * (1 - cl(fx.rag ?? 0)), -0.02]} castShadow><sphereGeometry args={[0.034, 18, 12]} /><meshStandardMaterial color="#6f8fb5" roughness={1} /></mesh>}

      {/* ===== CAÑOS EN CORTE ===== */}
      <Pipe c={TRAP} ri={R_IN} ro={R_OUT} col={pvc} cut={pvcCut} inner={pvcIn} metal={metal * 0.8} rough={0.4 - metal * 0.1} />
      <Pipe c={RIGHT} ri={R_IN} ro={R_OUT} col={pvc} cut={pvcCut} inner={pvcIn} metal={metal * 0.8} />
      <Pipe c={STACK} ri={R_ST} ro={R_STO} col="#2b2d30" cut="#55585c" inner="#1d1a17" metal={0.35} rough={0.7} />
      {/* tuercas de las juntas (la de la U se ablanda con agua hirviendo) */}
      {([[-0.25, 0.43], [-0.13, 0.43], [-0.25, 0.66], [0.47, 0.48]] as number[][]).map(([x, y], i) => (
        <mesh key={"nut" + i} position={[x, y - (i === 0 ? sof * 0.006 : 0), 0]} rotation={[i === 3 ? 0 : 0, 0, i === 3 ? Math.PI / 2 : 0]}><cylinderGeometry args={[R_OUT + 0.006, R_OUT + 0.006, 0.026, 28, 1, true]} />
          <meshStandardMaterial color={i === 0 && sof > 0 ? new THREE.Color(pvc).lerp(new THREE.Color("#ff7a40"), sof * 0.5).getStyle() : pvc} roughness={0.45} metalness={metal * 0.8} clippingPlanes={[CLIP]} side={THREE.DoubleSide} /></mesh>
      ))}
      {sof > 0.05 && <mesh position={[-0.25, Math.max(0.12, dripY - 0.18), 0.002]}><sphereGeometry args={[0.005 * sof, 12, 8]} /><meshStandardMaterial color="#cfe6ff" transparent opacity={0.85} roughness={0.05} /></mesh>}
      {/* óxido que come el galvanizado de adentro */}
      {rust > 0.02 && Array.from({ length: 60 }, (_, i) => { const u = 0.15 + rnd(i, 50) * 0.7, p = trapPt(u), tg = TRAP.getTangentAt(u), sd = rnd(i, 51) < 0.5 ? 1 : -1, d = R_IN + 0.0012 * rnd(i, 52); return (
        <mesh key={"ru" + i} position={[p.x - tg.y * d * sd, p.y + tg.x * d * sd, 0.0012]}><circleGeometry args={[0.0015 + 0.004 * rust * rnd(i, 53), 10]} /><meshBasicMaterial color={i % 4 ? "#a4521f" : "#5b2a10"} /></mesh>); })}

      {/* sello de agua (transparente, frío) */}
      {(fx.seal ?? 1) > 0.01 && <>
        <mesh geometry={geo.wTube}><meshStandardMaterial color="#5f9cc8" transparent opacity={0.35 * (fx.seal ?? 1)} roughness={0.05} clippingPlanes={sealClip} side={THREE.BackSide} depthWrite={false} /></mesh>
        <mesh geometry={geo.wStrip}><meshStandardMaterial side={THREE.DoubleSide} color={new THREE.Color("#2a7fc4").lerp(new THREE.Color("#c7843c"), hotTint).getStyle()} transparent opacity={0.8 * (fx.seal ?? 1)} roughness={0.1} clippingPlanes={sealClipS} depthWrite={false} /></mesh>
      </>}
      {/* EL TAPÓN: anillo de cera blanca (grasa fría) + jabón gris encima */}
      {G > 0.01 && <>
        <mesh geometry={geo.gLine}><meshBasicMaterial color="#5a4a30" side={THREE.DoubleSide} /></mesh>
        {!hide.includes("gT") && <mesh geometry={geo.gTube} receiveShadow><meshStandardMaterial color={new THREE.Color("#8f7330").lerp(new THREE.Color("#4e4434"), cl(fx.scum ?? 0) * 0.5).getStyle()} roughness={0.75} clippingPlanes={[CLIP]} side={THREE.BackSide} /></mesh>}
        {!hide.includes("gS") && <mesh geometry={geo.gStrip}><meshStandardMaterial side={THREE.DoubleSide} color={new THREE.Color("#d9b24c").lerp(new THREE.Color("#8a7a5e"), cl(fx.scum ?? 0) * 0.45).lerp(new THREE.Color("#ffd8a8"), hotTint).getStyle()} roughness={0.8} emissive="#ffb070" emissiveIntensity={hotTint * 0.25} /></mesh>}
      </>}
      <Pts pts={bH} color="#2b2118" size={0.007} opacity={deb} add={false} />
      <Pts pts={bC} color="#3a2a1c" size={0.0055} opacity={deb} add={false} />
      <Pts pts={bR} color="#fbf6e8" size={0.0065} opacity={deb} add={false} />
      <Pts pts={dA} color="#ffb24a" size={0.004} opacity={drip * 0.95} />
      <Pts pts={dW} color="#fff4dc" size={0.0034} opacity={drip * 0.8} add={false} />
      <Pts pts={gP} color="#9fd34a" size={0.006} opacity={gas * 0.7} />
      <Pts pts={mS} color="#ffffff" size={0.006} opacity={mix * (1 - fsh)} add={false} />
      <Pts pts={mC} color="#dfe8f0" size={0.0085} opacity={mix * (1 - fsh)} add={false} />
      <Pts pts={fP} color="#e8fbff" size={0.0022} opacity={fz * 0.9} />
      <Pts pts={wP} color={hot > 0.3 ? "#ffcf9a" : "#9fd8ff"} size={0.0036} opacity={Math.max(fsh, hot * 0.6) * 0.8} />
      <Pts pts={vP} color="#ffffff" size={0.03} opacity={hot * 0.25} add={false} />
      <Pts pts={lP} color="#f3ead4" size={0.005} opacity={lg > 0.02 ? (1 - lg * 0.6) : 0} add={false} />
      <Pts pts={pP} color="#ffd36a" size={0.005} opacity={pl * 0.9} />
      <Pts pts={eP} color="#ff6a4a" size={0.005} opacity={pl * esc * 0.9} />
      {gu > 0.01 && <mesh position={[gb.x, gb.y, -0.006]}><sphereGeometry args={[0.012 * gu, 18, 12]} /><meshStandardMaterial color="#cfe9ff" transparent opacity={0.55} roughness={0} metalness={0.2} /></mesh>}

      {/* ===== SÓTANO Y CALLE ===== */}
      <mesh position={[1.2, -2.42, -1.2]} receiveShadow><boxGeometry args={[5.4, 0.12, 2.4]} /><meshStandardMaterial map={T.concrete} color="#9a9890" roughness={0.95} /></mesh>
      <mesh position={[0.4, -1.25, -1.5]} receiveShadow><planeGeometry args={[6, 2.5]} /><meshStandardMaterial map={T.block} color="#a9a7a0" roughness={0.95} /></mesh>
      <mesh position={[3.95, -1.25, -1.0]} receiveShadow><boxGeometry args={[0.3, 2.7, 2]} /><meshStandardMaterial map={T.concrete} color="#8d8a82" roughness={0.95} /></mesh>
      {/* la casa por fuera (sobre el sótano): pared de siding con ventana */}
      <mesh position={[2.3, 1.3, -0.35]} receiveShadow><boxGeometry args={[3.5, 2.6, 0.1]} /><meshStandardMaterial color="#cdbb98" roughness={0.9} /></mesh>
      <mesh position={[2.6, 1.45, -0.29]}><planeGeometry args={[0.9, 0.8]} /><meshStandardMaterial color="#3d5a78" roughness={0.2} metalness={0.3} /></mesh>
      <mesh position={[2.3, 2.62, -0.3]}><boxGeometry args={[3.7, 0.08, 0.3]} /><meshStandardMaterial color="#5a4636" roughness={0.9} /></mesh>
      {/* cielo de atardecer detrás + estratos de tierra */}
      <mesh position={[9.5, 3.5, -3.2]}><planeGeometry args={[14, 7]} /><meshBasicMaterial color="#a9c4dc" toneMapped={false} /></mesh>
      {[[-0.5, "#7a5a3c"], [-1.3, "#5f4430"], [-2.0, "#6e5038"], [-3.0, "#56402e"]].map(([y, c], i) => <mesh key={"es" + i} position={[9, y as number, -0.245]}><boxGeometry args={[10, 0.03, 0.02]} /><meshStandardMaterial color={c as string} roughness={1} /></mesh>)}
      <directionalLight position={[6, 1, 12]} intensity={night > 0.5 ? 0.4 : 1.6} color="#fff4e6" />
      {/* tierra en corte (detrás del caño) + pasto arriba */}
      <mesh position={[9, -2.6, -1.7]} receiveShadow><boxGeometry args={[10, 5.2, 2.9]} /><meshStandardMaterial color="#5e4432" roughness={1} /></mesh>
      <mesh position={[9, 0.0, -1.6]} receiveShadow><boxGeometry args={[10, 0.06, 3.1]} /><meshStandardMaterial color="#6f9a3c" roughness={1} /></mesh>
      <mesh position={[1.2, -3.6, -1.7]} receiveShadow><boxGeometry args={[5.4, 2.2, 2.9]} /><meshStandardMaterial color="#6e5038" roughness={1} /></mesh>
      {/* árbol de la vereda y sus raíces que buscan la junta del caño */}
      <mesh position={[8.6, 1.6, -0.6]} castShadow><cylinderGeometry args={[0.16, 0.22, 3.2, 14]} /><meshStandardMaterial color="#4b3424" roughness={0.95} /></mesh>
      <mesh position={[8.6, 3.6, -0.6]} castShadow><sphereGeometry args={[1.5, 20, 16]} /><meshStandardMaterial color="#47602c" roughness={1} /></mesh>
      {(fx.roots ?? 0) > 0.01 && ROOTS.map((c, i) => <mesh key={"rt" + i} geometry={c.geo}><meshStandardMaterial color="#d8b07a" emissive="#3a2414" emissiveIntensity={0.6} roughness={0.85} side={THREE.DoubleSide} clippingPlanes={[new THREE.Plane(new THREE.Vector3(0, 1, 0), -(0.02 - (fx.roots ?? 0) * 2.75 * c.k))]} /></mesh>)}
      {(fx.crack ?? 0) > 0.01 && <mesh position={[8.3, -2.574, 0.0012]} rotation={[0, 0, -0.35]}><planeGeometry args={[0.007, 0.022 * (fx.crack ?? 0)]} /><meshBasicMaterial color="#0a0806" /></mesh>}
      {bk > 0.01 && <mesh geometry={bkGeo}><meshStandardMaterial color="#6b5a30" roughness={0.3} side={THREE.DoubleSide} clippingPlanes={bkClip} /></mesh>}
      {/* cloaca de la calle (círculo grande en corte) + asfalto */}
      <mesh position={[13.9, -2.9, -0.4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.38, 0.38, 0.8, 32, 1, true]} /><meshStandardMaterial color="#6d6a63" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[13.9, 0.02, -1.6]} receiveShadow><boxGeometry args={[2.6, 0.1, 3.1]} /><meshStandardMaterial color="#2c2d30" roughness={0.9} /></mesh>
    </ThreeCanvas>
  );
};

// raíces del árbol: troncales que bajan a la junta del caño principal (x≈8.3) y un mechón que entra por la grieta
const ROOTS = (() => {
  const out: { geo: THREE.BufferGeometry; k: number }[] = [];
  const wig = (pts: THREE.Vector3[]) => new THREE.CatmullRomCurve3(pts, false, "centripetal");
  for (let i = 0; i < 6; i++) {
    const x0 = 8.6 + (rnd(i, 70) - 0.5) * 0.3, x1 = 8.3 + (rnd(i, 71) - 0.5) * 0.5, y1 = -2.6 + (i < 3 ? 0.04 : -0.25 - rnd(i, 72) * 0.35), z = -0.09 - rnd(i, 80) * 0.12;
    const pts = Array.from({ length: 12 }, (_, j) => { const k = j / 11; return new THREE.Vector3(x0 + (x1 - x0) * k + Math.sin(k * 5.5 + i * 2.1) * 0.22 * (1 - k * 0.6) + Math.sin(k * 17 + i) * 0.03, -0.03 + (y1 + 0.03) * k, z); });
    out.push({ geo: tubeGeo(wig(pts), (u) => 0.016 * (1 - 0.75 * u) + 0.002, 90, 8), k: 1 });
    for (let b = 0; b < 4; b++) { const st = pts[2 + b * 2], d = (rnd(i * 5 + b, 74) - 0.5) * 0.9;
      out.push({ geo: tubeGeo(wig([st, st.clone().add(new THREE.Vector3(d * 0.4, -0.2, 0.01)), st.clone().add(new THREE.Vector3(d * 0.8 + Math.sin(b) * 0.05, -0.38, 0.0)), st.clone().add(new THREE.Vector3(d, -0.55 - rnd(b, 75) * 0.3, 0.01))]), (u) => 0.006 * (1 - 0.8 * u) + 0.001, 40, 6), k: 1 }); }
  }
  // el mechón que entró por la junta: pelusa de raicitas DENTRO del caño principal
  for (let i = 0; i < 26; i++) {
    const x = 8.3 + (rnd(i, 76) - 0.5) * 0.04, y0 = -2.585, len = 0.12 + rnd(i, 77) * 0.3, dir = rnd(i, 78) < 0.5 ? -1 : 1, z = 0.0008 + rnd(i, 81) * 0.0004;
    const pts = Array.from({ length: 6 }, (_, j) => { const k = j / 5; return new THREE.Vector3(x + dir * len * k, y0 - 0.012 - k * 0.04 * rnd(i, 79) + Math.sin(k * 9 + i) * 0.008, z); });
    out.push({ geo: tubeGeo(wig(pts), (u) => 0.0026 * (1 - 0.7 * u) + 0.0006, 30, 5), k: 1 });
  }
  out.forEach((o) => o.geo.computeVertexNormals());   // las normales de Frenet salían NaN en algunas raíces (se veían negras)
  return out;
})();

// puntos útiles para rótulos/portales
export const PT = {
  drain: [-0.25, 0.71, 0], bend: [-0.19, 0.345, 0], seal: [-0.13, 0.44, 0], arm: [0.15, 0.48, 0], clog: [-0.17, 0.36, 0], tee: [-0.25, 0.54, 0],
  nut: [-0.25, 0.43, 0], right: [0.15, 0.71, 0], stack: [0.52, 0.2, 0], basement: [0.6, -2.4, 0], main: [6, -2.62, 0], roots: [8.3, -2.62, 0], basin: [-0.25, 0.86, 0],
};
