// lenny02 · EL MUNDO: un inodoro de VIDRIO EN CORTE (plano z=0 por el eje): el tazón con su agua, el borde hueco con los
// agujeros (rim jets) que se tapan de sarro, el pasaje y el agujero del chorro de sifón, el sifón de loza con su cresta,
// el tapón de toallitas, el tanque con flapper / rebalse / válvula de llenado, el anillo de cera y el caño bajo el piso.
// UNA escena; cada frase la mira con su propia cámara (kf) y sus niveles de efecto (fx). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";

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


// ---------------- niveles de efecto ----------------
export type FX = {
  bowl?: number;      // agua del inodoro: 0 nivel normal (sello) · 1 al borde
  dirty?: number;     // agua turbia/marrón
  paper?: number;     // papel flotando
  clog?: number;      // tapón de toallitas en la cresta del sifón
  letgo?: number;     // el tapón se suelta y se va por el caño
  flush?: number;     // descarga: agua que corre por el sifón
  siphon?: number;    // el sifón LLENO (el "tirón")
  jets?: number;      // agua que sale por los agujeros del borde
  scale?: number;     // sarro en los agujeros del borde (0 limpios · 1 casi todos tapados)
  jet?: number;       // chorro de sifón del fondo
  jetScale?: number;  // sarro en el agujero del chorro
  plunger?: number;   // sopapo de brida puesto
  flat?: number;      // sopapo PLANO (no sella: aire que se escapa)
  pump?: number;      // bombeo (pulsos)
  auger?: number;     // cable del auger avanzando por el sifón (0..1)
  soap?: number;      // detergente que baja
  hot?: number;       // agua caliente (vapor)
  vinegar?: number;   // vinagre dentro del borde hueco
  tape?: number;      // cinta tapando los agujeros
  flakes?: number;    // escamas de sarro que caen
  crack?: number;     // fisura en la loza (agua hirviendo)
  wax?: number;       // anillo de cera aplastado que pierde
  tank?: number;      // nivel del tanque (0 bajo · 1 en la marca)
  flap?: number;      // flapper abierto
  lid?: number;       // tapa del tanque puesta (default 1)
  supply?: number;    // agua entrando por la manguera
  main?: number;      // agua que vuelve por el caño principal
};

// ---------------- geometría base (plano de corte z=0; x = de adelante hacia atrás) ----------------
export const BX = -0.2, SX = 1.25;            // eje del tazón y estiramiento ovalado
const BOWL: [number, number][] = [[0.172, 0.4], [0.17, 0.375], [0.162, 0.34], [0.145, 0.3], [0.118, 0.26], [0.085, 0.225], [0.055, 0.2], [0.036, 0.185]];
const rAt = (y: number) => { for (let i = 0; i < BOWL.length - 1; i++) { const [r0, y0] = BOWL[i], [r1, y1] = BOWL[i + 1]; if (y <= y0 && y >= y1) return r0 + (r1 - r0) * (y - y0) / (y1 - y0); } return y > 0.4 ? 0.172 : 0.036; };
const WEIR_Y = 0.279;                         // nivel del sello (agua quieta del tazón)
export const lvY = (b: number) => WEIR_Y + (0.395 - WEIR_Y) * cl(b);
const cr = (pts: number[][]) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], 0)), false, "centripetal");
// sifón del inodoro: sale del fondo del tazón hacia atrás, sube a la cresta y baja al piso
export const R_T = 0.026, R_TO = 0.037;
export const TRAP = cr([[-0.19, 0.19], [-0.13, 0.152], [-0.065, 0.165], [-0.02, 0.235], [0.025, 0.302], [0.07, 0.305], [0.1, 0.245], [0.102, 0.13], [0.092, 0.035], [0.09, -0.04]]);
const CREST_X = 0.05;
// caño bajo el piso: curva de inodoro → horizontal con pendiente hacia la columna
export const DRAIN = path(L([0.09, -0.04], [0.09, -0.2]), new Arc(0.2, -0.2, 0.11, Math.PI, 1.5 * Math.PI), L([0.2, -0.31], [2.4, -0.37]));
export const R_D = 0.048, R_DO = 0.054;
// pasaje del chorro de sifón: del borde del frente baja por fuera del tazón al agujero del fondo
const JETP = cr([[-0.405, 0.372], [-0.41, 0.3], [-0.37, 0.215], [-0.3, 0.158], [-0.245, 0.16], [-0.218, 0.18]]);
// del tanque al borde (atrás)
const FEED = cr([[0.12, 0.44], [0.1, 0.405], [0.04, 0.386], [0.0, 0.386]]);
const RIM_Y = 0.384, RIM_R = 0.168, RIM_T = 0.019;
const NH = 22;   // agujeros del borde (vuelta entera; se ven los de z<0)
const holeAng = (i: number) => (i / NH) * Math.PI * 2 + 0.07;
export const holePos = (i: number) => { const a = holeAng(i); return [BX + Math.cos(a) * (RIM_R - 0.006) * SX, RIM_Y - RIM_T + 0.003, Math.sin(a) * (RIM_R - 0.006)]; };
export const holeOpen = (i: number, scale: number) => rnd(i, 90) > scale * 0.92;
const TL_ = TRAP.getLength();
export const trapPt = (u: number) => TRAP.getPointAt(cl(u));

// azulejo de baño de 10 cm con junta (canvas, repetido a escala real)
const texCache = new Map<string, THREE.CanvasTexture>();
const tileTex = (kind: "wall" | "floor", rx: number, ry: number) => {
  const key = kind + rx + "x" + ry; if (texCache.has(key)) return texCache.get(key)!;
  const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g = cv.getContext("2d")!;
  g.fillStyle = kind === "wall" ? "#7f9f92" : "#9a9a94"; g.fillRect(0, 0, 256, 256);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const i = r * 4 + c, v = (rnd(i, 60) - 0.5) * 10;
    const base = kind === "wall" ? [178 + v, 222 + v, 204 + v] : (i === 5 ? [60, 64, 70] : [238 + v * 0.5, 237 + v * 0.5, 232 + v * 0.5]);
    g.fillStyle = `rgb(${base.map(Math.round).join(",")})`; g.fillRect(c * 64 + 3, r * 64 + 3, 58, 58);
    g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(c * 64 + 5, r * 64 + 5, 54, 6);
  }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t); return t;
};

const latheGeo = (shrink: number, seg = 96) => new THREE.LatheGeometry(BOWL.map(([r, y]) => new THREE.Vector2(Math.max(0.001, r - shrink), y)), seg);

// ---------------- material de "loza de vidrio" ----------------
const Glass: React.FC<{ op?: number; clip?: THREE.Plane[]; side?: THREE.Side; col?: string }> = ({ op = 0.2, clip = [CLIP], side = THREE.DoubleSide, col = "#e6f3f7" }) =>
  <meshStandardMaterial color={col} transparent opacity={op} roughness={0.06} metalness={0.1} clippingPlanes={clip} side={side} depthWrite={false} />;

export const ToiletWorld: React.FC<{ t: number; kf: K[]; fx?: FX; post?: boolean; night?: number }> = ({ t, kf, fx = {}, post = true, night = 0 }) => {
  const fl = Math.round(t * FPS);
  const lv = lvY(fx.bowl ?? 0), dirty = cl(fx.dirty ?? 0), scale = cl(fx.scale ?? 0);
  const water = new THREE.Color("#7fbde0").lerp(new THREE.Color("#7a6a46"), dirty).lerp(new THREE.Color("#d9b27a"), cl(fx.hot ?? 0) * 0.35).getStyle();
  const geo = useMemo(() => ({
    bowlIn: latheGeo(0), bowlOut: latheGeo(-0.011), water: latheGeo(0.0025),
    bowlCut: [cr(BOWL.map(([r, y]) => [BX - r * SX - 0.0055, y])), cr(BOWL.map(([r, y]) => [BX + r * SX + 0.0055, y]))].map((c) => stripGeo(c, () => 0, () => 0.0065, 120, 0.0005)),
    bowlLine: [cr(BOWL.map(([r, y]) => [BX - r * SX, y])), cr(BOWL.map(([r, y]) => [BX + r * SX, y]))].map((c) => lineGeo(c, [0.0], 0.0008)),
    trapW: stripGeo(TRAP, () => 0, () => R_T - 0.0006, 200, 0.0003),
    drainW: stripGeo(DRAIN, () => 0, () => R_D - 0.002, 200, 0.0003),
    rim: new THREE.TorusGeometry(RIM_R, RIM_T, 20, 96),
  }), []);
  const waterClip = useMemo(() => [CLIP, new THREE.Plane(new THREE.Vector3(0, -1, 0), lv)], [lv]);
  const sealClip = useMemo(() => {
    const siph = cl(fx.siphon ?? 0);
    if (siph > 0.5) return [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.4)];
    const top = (fx.clog ?? 0) > 0.3 ? lv : WEIR_Y;
    return [new THREE.Plane(new THREE.Vector3(0, -1, 0), top), new THREE.Plane(new THREE.Vector3(-1, 0, 0), CREST_X)];
  }, [lv, fx.clog, fx.siphon]);
  const mainClip = useMemo(() => [new THREE.Plane(new THREE.Vector3(1, 0, 0), -(2.4 - 2.3 * cl(fx.main ?? 0)))], [fx.main]);
  // cable del auger: sigue el sifón hasta u
  const aug = cl(fx.auger ?? 0), augQ = Math.round(aug * 40) / 40;
  const augGeo = useMemo(() => {
    if (augQ < 0.02) return null;
    const pts = Array.from({ length: 30 }, (_, i) => { const u = (i / 29) * augQ * 0.62, p = trapPt(u); return new THREE.Vector3(p.x, p.y - 0.006, -0.004); });
    return tubeGeo(new THREE.CatmullRomCurve3(pts), () => 0.0045, 120, 10);
  }, [augQ]);

  // ---------- partículas ----------
  const jets = cl(fx.jets ?? 0), nJ = 600, jP = new Float32Array(nJ * 3);
  for (let i = 0; i < nJ; i++) {
    const h = i % NH, open = holeOpen(h, scale);
    const ph = (fl * 0.035 + rnd(i, 1)) % 1, y = RIM_Y - RIM_T - ph * (RIM_Y - RIM_T - lv), a = holeAng(h) + ph * 0.5 + (rnd(i, 2) - 0.5) * 0.06, r = rAt(y) - 0.003;
    jP.set(open ? [BX + Math.cos(a) * r * SX, y, Math.min(-0.002, Math.sin(a) * r)] : [0, -9, 0], i * 3);
  }
  const jt = cl(fx.jet ?? 0) * (1 - 0.85 * cl(fx.jetScale ?? 0)), nT = 260, tP = new Float32Array(nT * 3);
  for (let i = 0; i < nT; i++) { const ph = (fl * 0.05 + rnd(i, 3)) % 1, u = ph * 0.45, p = trapPt(u); tP.set([p.x + (rnd(i, 4) - 0.5) * 0.02, p.y + (rnd(i, 5) - 0.5) * 0.018, -0.002 - rnd(i, 6) * 0.015], i * 3); }
  const fsh = Math.max(cl(fx.flush ?? 0), cl(fx.siphon ?? 0)), nF = 520, fP = new Float32Array(nF * 3);
  for (let i = 0; i < nF; i++) {
    const ph = (fl * (0.015 + 0.03 * fsh) + rnd(i, 7)) % 1;
    const onDrain = rnd(i, 8) < 0.35, c = onDrain ? DRAIN : TRAP, u = onDrain ? ph * 0.5 : ph, p = c.getPointAt(u), tg = c.getTangentAt(u), R = (onDrain ? R_D : R_T) - 0.003, d = (rnd(i, 9) * 2 - 1) * R * 0.9;
    fP.set([p.x - tg.y * d, p.y + tg.x * d, -rnd(i, 10) * R * 0.6], i * 3);
  }
  const soap = cl(fx.soap ?? 0), nS = 220, sP = new Float32Array(nS * 3);
  for (let i = 0; i < nS; i++) { const ph = (fl * 0.006 + rnd(i, 11)) % 1, y = lv - ph * (lv - 0.17), a = rnd(i, 12) * Math.PI + Math.PI, r = rAt(y) * (0.2 + 0.6 * rnd(i, 13)); sP.set([BX + Math.cos(a) * r * SX + (y < 0.2 ? ph * 0.06 : 0), y, Math.sin(a) * r], i * 3); }
  const hot = cl(fx.hot ?? 0), nV = 160, vP = new Float32Array(nV * 3);
  for (let i = 0; i < nV; i++) { const ph = (fl * 0.008 + rnd(i, 14)) % 1; vP.set([BX + (rnd(i, 15) - 0.5) * 0.3 * (0.4 + ph), lv + ph * 0.45, -0.02 - rnd(i, 16) * 0.12], i * 3); }
  const flk = cl(fx.flakes ?? 0), nK = 200, kP = new Float32Array(nK * 3);
  for (let i = 0; i < nK; i++) { const h = Math.floor(rnd(i, 17) * NH), hp = holePos(h), ph = (fl * 0.012 + rnd(i, 18)) % 1; kP.set([hp[0] + (rnd(i, 19) - 0.5) * 0.01 + (BX - hp[0]) * ph * 0.25, hp[1] - ph * (hp[1] - lv + 0.02), Math.min(-0.003, hp[2] + (0 - hp[2]) * ph * 0.25)], i * 3); }
  const pl = cl(fx.plunger ?? 0), flat = cl(fx.flat ?? 0), pump = cl(fx.pump ?? 0), pOff = pump * Math.max(0, Math.sin(t * 9)) * 0.03;
  const nA = 120, aP = new Float32Array(nA * 3);   // aire que se escapa alrededor del sopapo plano
  for (let i = 0; i < nA; i++) { const ph = (fl * 0.03 + rnd(i, 20)) % 1, a = rnd(i, 21) * Math.PI + Math.PI; aP.set([BX + Math.cos(a) * 0.075 * SX, 0.215 + ph * (lv - 0.215), Math.sin(a) * 0.075], i * 3); }
  const nP = 200, pP = new Float32Array(nP * 3);   // pulsos de presión del sopapo de brida hacia el tapón
  for (let i = 0; i < nP; i++) { const ph = (fl * 0.035 + rnd(i, 22)) % 1, p = trapPt(ph * 0.5); pP.set([p.x + (rnd(i, 23) - 0.5) * 0.02, p.y + (rnd(i, 24) - 0.5) * 0.02, -0.004 - rnd(i, 25) * 0.01], i * 3); }
  const clog = cl(fx.clog ?? 0) * (1 - cl(fx.letgo ?? 0)), lg = cl(fx.letgo ?? 0), nC = 70;
  const wax = cl(fx.wax ?? 0), nW = 80, wP = new Float32Array(nW * 3);
  for (let i = 0; i < nW; i++) { const ph = (fl * 0.01 + rnd(i, 26)) % 1; wP.set([0.15 + ph * 0.25, -0.004 - ph * 0.02 * rnd(i, 27), -0.02 - rnd(i, 28) * 0.12], i * 3); }
  const tankY = 0.56 + 0.16 * cl(fx.tank ?? 1), flap = cl(fx.flap ?? 0), lid = fx.lid ?? 1;
  const nQ = 160, qP = new Float32Array(nQ * 3);   // agua del tanque bajando al borde cuando se abre el flapper
  for (let i = 0; i < nQ; i++) { const ph = (fl * 0.04 + rnd(i, 29)) % 1, p = FEED.getPointAt(ph); qP.set([p.x, p.y + (rnd(i, 30) - 0.5) * 0.01, -0.005], i * 3); }

  const porc = "#f6f4ee", cut = "#ffffff", ink = "#25313a";
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, localClippingEnabled: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} kf={kf} />
      {post && <Post bloom={0.12} threshold={1.05} exposure={0.95 - night * 0.35} env={0.3} />}
      <color attach="background" args={["#0b0e12"]} />
      <fog attach="fog" args={["#0b0e12", 5, 20]} />
      <hemisphereLight args={["#d6e4ee", "#2a2420", 0.38]} />
      <spotLight position={[-0.5, 2.3, 1.4]} angle={0.55} penumbra={0.8} intensity={30} distance={6} castShadow color="#fff3e2" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0.3, 0.6, 1.3]} angle={0.5} penumbra={0.9} intensity={6} distance={3} color="#dceaff" />
      <pointLight position={[-0.2, 0.55, 0.35]} intensity={0.6} distance={1.2} color="#ffe6c8" />
      <pointLight position={[0.9, -0.35, 0.8]} intensity={2.5} distance={3} color="#ffd29a" />

      {/* ===== BAÑO: piso de baldosa (corte con tablas y vigas), azulejo verde menta, zócalo ===== */}
      <mesh position={[-0.6, 0.0005, -0.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.5]} /><meshStandardMaterial map={tileTex("floor", 12, 7.5)} roughness={0.35} /></mesh>
      <mesh position={[1.5, 0.0005, -0.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.8, 1.5]} /><meshStandardMaterial map={tileTex("floor", 9, 7.5)} roughness={0.35} /></mesh>
      <mesh position={[-0.6, -0.025, -0.75]} receiveShadow><boxGeometry args={[2.4, 0.05, 1.5]} /><meshStandardMaterial color="#8a6a4a" roughness={0.9} /></mesh>
      <mesh position={[1.48, -0.025, -0.75]} receiveShadow><boxGeometry args={[1.84, 0.05, 1.5]} /><meshStandardMaterial color="#8a6a4a" roughness={0.9} /></mesh>
      {[-1.4, -0.95, -0.5, 0.45, 0.9, 1.35, 1.8, 2.25].map((x) => <mesh key={"j" + x} position={[x, -0.15, -0.75]} receiveShadow><boxGeometry args={[0.05, 0.2, 1.5]} /><meshStandardMaterial color="#b58a58" roughness={0.9} /></mesh>)}
      <mesh position={[0.0, 0.75, -0.62]} receiveShadow><planeGeometry args={[4.2, 1.5]} /><meshStandardMaterial map={tileTex("wall", 10.5, 3.75)} roughness={0.3} /></mesh>
      {/* fondo del corte (sótano): nada de negro alrededor del decorado */}
      <mesh position={[0, 0.2, -0.95]}><planeGeometry args={[9, 5]} /><meshStandardMaterial color="#3a3f3d" roughness={1} /></mesh>
      <mesh position={[0.0, 1.25, -0.615]}><planeGeometry args={[4.2, 0.03]} /><meshStandardMaterial color="#2f5f52" roughness={0.4} /></mesh>
      <mesh position={[0.32, 0.75, -0.31]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[0.62, 1.5]} /><meshStandardMaterial map={tileTex("wall", 1.55, 3.75)} roughness={0.3} /></mesh>
      <mesh position={[0.33, 0.75, 0.0005]}><planeGeometry args={[0.03, 1.5]} /><meshStandardMaterial color="#d8c8a8" roughness={0.9} /></mesh>
      {/* llave de paso + manguera al tanque */}
      <mesh position={[0.3, 0.16, -0.09]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.05, 16]} /><meshStandardMaterial color="#d7dde3" metalness={1} roughness={0.15} /></mesh>
      <mesh position={[0.272, 0.16, -0.09]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[0.017, 0.006, 10, 24]} /><meshStandardMaterial color="#d7dde3" metalness={1} roughness={0.15} /></mesh>
      <mesh position={[0.262, 0.29, -0.09]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.27, 12]} /><meshStandardMaterial color="#c9ccd0" metalness={0.8} roughness={0.35} /></mesh>

      {/* ===== EL INODORO DE VIDRIO EN CORTE ===== */}
      <group position={[BX, 0, 0]} scale={[SX, 1, 1]}>
        <mesh geometry={geo.bowlIn} receiveShadow><Glass op={0.28} side={THREE.BackSide} col="#f3f8fa" /></mesh>
        <mesh geometry={geo.bowlOut}><Glass op={0.12} side={THREE.FrontSide} /></mesh>
        {/* agua del tazón */}
        <mesh geometry={geo.water}><meshStandardMaterial color={water} transparent opacity={0.55 + dirty * 0.3} roughness={0.05} clippingPlanes={waterClip} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh position={[0, lv, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[rAt(lv) - 0.002, 64]} /><meshStandardMaterial color={water} transparent opacity={0.7 + dirty * 0.25} roughness={0.04} metalness={0.15} clippingPlanes={[CLIP]} side={THREE.DoubleSide} /></mesh>
        {/* borde hueco */}
        <mesh geometry={geo.rim} position={[0, RIM_Y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><Glass op={0.35} col="#f6fbfc" /></mesh>
        {(fx.tape ?? 0) > 0.01 && <mesh position={[0, RIM_Y - RIM_T + 0.004, 0]}><cylinderGeometry args={[RIM_R + 0.002, RIM_R + 0.002, 0.016 * cl(fx.tape ?? 0), 64, 1, true]} /><meshStandardMaterial color="#8f9396" roughness={0.6} clippingPlanes={[CLIP]} side={THREE.DoubleSide} /></mesh>}
      </group>
      {/* corte de la loza (blanco puro con contorno) */}
      {geo.bowlCut.map((g, i) => <mesh key={"bc" + i} geometry={g}><meshStandardMaterial color={cut} roughness={0.5} side={THREE.DoubleSide} /></mesh>)}
      {geo.bowlLine.map((g, i) => <mesh key={"bl" + i} geometry={g}><meshBasicMaterial color={ink} side={THREE.DoubleSide} /></mesh>)}
      {/* cortes del borde hueco (dos anillos) + vinagre adentro */}
      {[-1, 1].map((sd) => (
        <group key={"rc" + sd} position={[BX + sd * RIM_R * SX, RIM_Y, 0.0008]}>
          <mesh><ringGeometry args={[RIM_T - 0.005, RIM_T, 32]} /><meshStandardMaterial color={cut} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0, 0.0002]}><ringGeometry args={[RIM_T - 0.0055, RIM_T - 0.005, 32]} /><meshBasicMaterial color={ink} side={THREE.DoubleSide} /></mesh>
          {(fx.vinegar ?? 0) > 0.01 && <mesh position={[0, -RIM_T * (1 - cl(fx.vinegar ?? 0)), 0.0001]}><circleGeometry args={[(RIM_T - 0.005) * Math.min(1, 0.4 + cl(fx.vinegar ?? 0)), 24]} /><meshStandardMaterial color="#f0e6a6" transparent opacity={0.85} roughness={0.1} /></mesh>}
          {scale > 0.05 && <mesh position={[0, -RIM_T + 0.005, 0.0003]}><circleGeometry args={[0.0045 * scale * (1 - cl(fx.flakes ?? 0) * 0.8), 12]} /><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></mesh>}
        </group>
      ))}
      {/* agujeros del borde: abiertos (oscuros) o tapados de sarro (costra blanca-naranja) */}
      {Array.from({ length: NH }, (_, i) => { const p = holePos(i); if (p[2] > 0.001) return null; const open = holeOpen(i, scale) || (fx.flakes ?? 0) > 0.6; return (
        <group key={"h" + i} position={[p[0], p[1], p[2]]}>
          <mesh><sphereGeometry args={[0.0042, 12, 8]} /><meshBasicMaterial color={open ? "#13202a" : "#c9b48a"} /></mesh>
          {!open && <mesh position={[0, -0.001, 0]}><sphereGeometry args={[0.0075, 14, 10]} /><meshStandardMaterial color={i % 3 ? "#ece2cc" : "#d29a5a"} roughness={0.95} /></mesh>}
        </group>); })}
      {/* pasaje y agujero del chorro de sifón */}
      <Pipe c={JETP} ri={0.008} ro={0.012} col={porc} cut={cut} inner="#9fc6da" />
      <mesh position={[-0.215, 0.181, -0.002]} rotation={[0, 0, -0.4]}><circleGeometry args={[0.0085, 20]} /><meshBasicMaterial color="#13202a" side={THREE.DoubleSide} /></mesh>
      {(fx.jetScale ?? 0) > 0.02 && <mesh position={[-0.215, 0.181, -0.001]}><sphereGeometry args={[0.009 * cl(fx.jetScale ?? 0), 14, 10]} /><meshStandardMaterial color="#e3d2ad" roughness={0.95} /></mesh>}
      {/* EL SIFÓN (loza en corte) + sello de agua */}
      <Pipe c={TRAP} ri={R_T} ro={R_TO} col={porc} cut={cut} inner="#dfe8ee" rough={0.25} />
      <mesh geometry={geo.trapW}><meshStandardMaterial color={water} transparent opacity={0.8} roughness={0.1} clippingPlanes={sealClip} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <Pipe c={FEED} ri={0.012} ro={0.017} col={porc} cut={cut} inner="#dfe8ee" />
      {/* cuerpo de loza (pie) translúcido */}
      <mesh position={[0, 0, -0.13]}><extrudeGeometry args={[BODY, { depth: 0.13, bevelEnabled: false }]} /><Glass op={0.1} /></mesh>
      {/* el TAPÓN: toallitas apelmazadas en la cresta */}
      {clog > 0.01 && Array.from({ length: nC }, (_, i) => { const u = 0.5 + rnd(i, 40) * 0.16 + lg * (0.5 + rnd(i, 41) * 0.5), p = trapPt(Math.min(0.995, u)), d = (rnd(i, 42) - 0.5) * R_T * 1.4; return (
        <mesh key={"cl" + i} position={[p.x + d * 0.3, p.y + d, -rnd(i, 43) * 0.018]} rotation={[rnd(i, 44) * 3, rnd(i, 45) * 3, rnd(i, 46) * 3]} scale={[1, 0.35, 0.8]}>
          <sphereGeometry args={[0.009 + 0.006 * rnd(i, 47), 10, 8]} /><meshStandardMaterial color={i % 4 ? "#ece8de" : "#cfc6b0"} roughness={0.95} transparent opacity={clog + lg * 0.6} /></mesh>); })}
      {/* papel flotando */}
      {(fx.paper ?? 0) > 0.01 && Array.from({ length: 14 }, (_, i) => { const a = Math.PI + rnd(i, 48) * Math.PI, r = rAt(lv) * 0.7 * rnd(i, 49); return (
        <mesh key={"pp" + i} position={[BX + Math.cos(a) * r * SX + Math.sin(t * 0.5 + i) * 0.006, lv + 0.001, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, t * 0.2 + i]}><planeGeometry args={[0.025 + rnd(i, 50) * 0.02, 0.018]} /><meshStandardMaterial color="#f1ede2" roughness={1} transparent opacity={cl(fx.paper ?? 0)} side={THREE.DoubleSide} /></mesh>); })}
      {/* fisura del agua hirviendo */}
      {(fx.crack ?? 0) > 0.01 && <mesh position={[BX - 0.13 * SX, 0.3, 0.0012]} rotation={[0, 0, 0.5]}><planeGeometry args={[0.0018, 0.09 * cl(fx.crack ?? 0)]} /><meshBasicMaterial color="#1a1a1a" /></mesh>}

      {/* ===== SOPAPO ===== */}
      {pl > 0.01 && (flat > 0.5 ? (
        <group position={[BX, 0.225 + pOff, 0]}>
          <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.07, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b32a1e" roughness={0.6} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
          <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.012, 0.55, 14]} /><meshStandardMaterial color="#b9895a" roughness={0.7} /></mesh>
        </group>
      ) : (
        <group position={[BX + 0.025, 0.2 + pOff, 0]} rotation={[0, 0, 0.12]}>
          <mesh position={[0, -0.022, 0]}><cylinderGeometry args={[0.022, 0.026, 0.04, 24, 1, true]} /><meshStandardMaterial color="#1c1c1e" roughness={0.6} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
          <mesh position={[0, 0.012, 0]}><sphereGeometry args={[0.066, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#222225" roughness={0.55} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
          <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.012, 0.012, 0.6, 14]} /><meshStandardMaterial color="#d2c7b4" roughness={0.6} /></mesh>
        </group>
      ))}
      {/* ===== AUGER: tubo con funda de goma + cable que entra por el sifón ===== */}
      {aug > 0.01 && <>
        <mesh position={[BX - 0.02, 0.5, -0.005]} rotation={[0, 0, 0.18]}><cylinderGeometry args={[0.011, 0.011, 0.62, 14]} /><meshStandardMaterial color="#2b2d30" metalness={0.6} roughness={0.4} /></mesh>
        <mesh position={[BX + 0.005, 0.2, -0.005]} rotation={[0, 0, 1.1]}><cylinderGeometry args={[0.014, 0.014, 0.07, 14]} /><meshStandardMaterial color="#141414" roughness={0.8} /></mesh>
        {augGeo && <mesh geometry={augGeo} castShadow><meshStandardMaterial color="#c9ccd0" metalness={0.9} roughness={0.25} /></mesh>}
      </>}

      {/* ===== TANQUE ===== */}
      <mesh position={[0.165, 0.615, -0.11]}><boxGeometry args={[0.27, 0.38, 0.22]} /><Glass op={0.16} /></mesh>
      {[[0.165, 0.43, 0.27, 0.012], [0.165, 0.8, 0.27, 0.012], [0.035, 0.615, 0.012, 0.38], [0.295, 0.615, 0.012, 0.38]].map(([x, y, w, h], i) =>
        <mesh key={"tk" + i} position={[x, y, 0.0006]}><planeGeometry args={[w, h]} /><meshStandardMaterial color={cut} side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0.165, (0.436 + tankY) / 2, -0.11]}><boxGeometry args={[0.25, tankY - 0.436, 0.21]} /><meshStandardMaterial color="#8cc7e6" transparent opacity={0.42} roughness={0.05} clippingPlanes={[CLIP]} depthWrite={false} /></mesh>
      <mesh position={[0.165, 0.72, -0.2]}><planeGeometry args={[0.2, 0.004]} /><meshBasicMaterial color="#2a3a44" /></mesh>
      {lid > 0.01 && <mesh position={[0.165, 0.815 + (1 - lid) * 0.25, -0.11]} castShadow><boxGeometry args={[0.29, 0.025, 0.24]} /><meshStandardMaterial color={porc} roughness={0.25} transparent opacity={0.35 + 0.4 * lid} clippingPlanes={[CLIP]} /></mesh>}
      {/* válvula de descarga + flapper con cadena */}
      <mesh position={[0.12, 0.45, -0.001]}><cylinderGeometry args={[0.034, 0.034, 0.03, 28, 1, true]} /><meshStandardMaterial color="#e8e8e2" roughness={0.4} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
      <group position={[0.155, 0.467, 0]} rotation={[0, 0, flap * 1.2]}>
        <mesh position={[-0.035, 0, 0]}><cylinderGeometry args={[0.038, 0.038, 0.01, 28]} /><meshStandardMaterial color="#b3261a" roughness={0.7} clippingPlanes={[CLIP]} side={THREE.DoubleSide} /></mesh>
      </group>
      <mesh position={[0.125 + flap * 0.02, 0.62 + flap * 0.03, -0.004]}><cylinderGeometry args={[0.0015, 0.0015, 0.28 - flap * 0.06, 6]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0.09, 0.765, -0.02]} rotation={[0, 0, -0.08 - flap * 0.25]}><boxGeometry args={[0.12, 0.008, 0.008]} /><meshStandardMaterial color="#c9ccd0" metalness={0.8} roughness={0.3} /></mesh>
      {/* tubo de rebalse + manguerita */}
      <mesh position={[0.185, 0.6, -0.001]}><cylinderGeometry args={[0.013, 0.013, 0.27, 20, 1, true]} /><meshStandardMaterial color="#f0f0ea" roughness={0.4} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.185, 0.7, 0.0006]}><planeGeometry args={[0.028, 0.0035]} /><meshBasicMaterial color="#2a3a44" /></mesh>
      <mesh position={[0.222, 0.745, -0.006]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.004, 0.004, 0.08, 8]} /><meshStandardMaterial color="#202020" roughness={0.7} /></mesh>
      {/* válvula de llenado + flotante */}
      <mesh position={[0.258, 0.58, -0.07]}><cylinderGeometry args={[0.012, 0.014, 0.28, 16]} /><meshStandardMaterial color="#4a4a4e" roughness={0.6} /></mesh>
      <mesh position={[0.258, tankY - 0.03, -0.07]}><cylinderGeometry args={[0.026, 0.026, 0.05, 20]} /><meshStandardMaterial color="#3a3a3e" roughness={0.6} /></mesh>
      {/* ===== PISO: brida, anillo de cera y caño ===== */}
      <mesh position={[0.09, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.052, 0.012 * (1 - wax * 0.4), 14, 40]} /><meshStandardMaterial color="#d8a83c" roughness={0.6} clippingPlanes={[CLIP]} /></mesh>
      <mesh position={[0.09, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.052, 0.085, 40]} /><meshStandardMaterial color="#3a3a3c" roughness={0.6} side={THREE.DoubleSide} clippingPlanes={[CLIP]} /></mesh>
      <Pipe c={DRAIN} ri={R_D} ro={R_DO} col="#2a2b2e" cut="#62666b" inner="#1d1b18" rough={0.6} />
      {(fx.main ?? 0) > 0.01 && <mesh geometry={geo.drainW}><meshStandardMaterial color="#6b5a30" roughness={0.3} side={THREE.DoubleSide} clippingPlanes={mainClip} /></mesh>}

      <Pts pts={jP} color="#bfe6ff" size={0.0042} opacity={jets * 0.9} />
      <Pts pts={tP} color="#d6f0ff" size={0.0065} opacity={jt * 0.9} />
      <Pts pts={fP} color={hot > 0.3 ? "#ffcf9a" : "#a8dcff"} size={0.0055} opacity={fsh * 0.85} />
      <Pts pts={sP} color="#59d36a" size={0.006} opacity={soap * 0.9} />
      <Pts pts={vP} color="#ffffff" size={0.04} opacity={hot * 0.22} add={false} />
      <Pts pts={kP} color="#f6efdc" size={0.004} opacity={flk} add={false} />
      <Pts pts={aP} color="#e8f6ff" size={0.006} opacity={pl * flat * pump * 0.9} />
      <Pts pts={pP} color="#ffd36a" size={0.006} opacity={pl * (1 - flat) * pump * 0.9} />
      <Pts pts={wP} color="#8fc8ff" size={0.006} opacity={wax * 0.8} add={false} />
      <Pts pts={qP} color="#bfe6ff" size={0.006} opacity={flap * 0.9} />
    </ThreeCanvas>
  );
};

// silueta lateral del pie de loza (se extruye hacia atrás del corte)
const BODY = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.16, 0); s.lineTo(0.17, 0); s.quadraticCurveTo(0.16, 0.2, 0.13, 0.32); s.lineTo(0.03, 0.39);
  s.lineTo(-0.36, 0.39); s.quadraticCurveTo(-0.4, 0.3, -0.3, 0.2); s.quadraticCurveTo(-0.18, 0.12, -0.16, 0); return s;
})();

// puntos útiles para rótulos/portales
export const PT = {
  bowl: [BX, 0.3, 0], sump: [BX + 0.01, 0.19, 0], trap: [-0.04, 0.2, 0], crest: [0.05, 0.305, 0], down: [0.1, 0.15, 0], wax: [0.09, 0.005, 0], drain: [0.6, -0.33, 0],
  rimF: [BX - RIM_R * SX, RIM_Y, 0], rimB: [BX + RIM_R * SX, RIM_Y, 0], jet: [-0.215, 0.181, 0], tank: [0.165, 0.62, 0], flap: [0.12, 0.47, 0], overflow: [0.185, 0.73, 0],
  fill: [0.258, 0.66, 0], line: [0.165, 0.72, 0], valve: [0.29, 0.16, 0], level: [BX, WEIR_Y, 0],
};
