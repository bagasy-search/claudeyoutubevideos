// al28a · EL MUNDO: la casa de Doña Marta en corte (le falta la pared del frente), de día, con la luz de la ventana de costado.
// Living a la izquierda (la ventana con LA GRIETA DE LA ESQUINA, el cuarteado de pelo, la horizontal bajo la losa y la de abajo
// con salitre) y el dormitorio a la derecha (la DIAGONAL más ancha arriba, el placard que no cierra). Afuera, a la derecha,
// la esquina con la CANALETA ROTA que larga el agua al pie del cimiento. Adelante, LA PARED GIGANTE EN CORTE (ladrillo,
// revoque, pintura) donde se ve todo el arreglo: la V, el polvo, el fijador, el relleno duro que se despega, el sellador
// elástico que acompaña, la malla, el enduido desvanecido y la pintura. Los testigos de yeso, la moneda y la linterna rasante.
// UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- medidas ----------------
// pared del fondo: cara de adentro en z=-2.9; el living va de x -4 a 1.2, el tabique del dormitorio en x 1.2, el dormitorio hasta x 4
const ZW = -2.9, HW = 2.7;
// la ventana del living (hueco) y LA GRIETA que sale de su esquina de arriba a la derecha
const WIN0 = -2.3, WIN1 = -0.9, WY0 = 1.0, WY1 = 2.15;
// la pared gigante en corte (adelante, a la izquierda del centro): superficie arriba, el corte mira a la cámara
export const GIANT: V = [-0.4, 0, 1.25];
const GW = 2.6, GBR = 0.62, GRV = 0.26, GPT = 0.03, GD = 0.7;   // ancho, ladrillo, revoque, pintura (alto), profundidad
export const BOOK: V = [2.55, 0.76, 0.6];

// ---------------- puntos del mundo (rótulos HTML) ----------------
export const PT = {
  corner: [WIN1 + 0.12, WY1 + 0.16, ZW + 0.01] as V,
  hair: [0.45, 1.35, ZW + 0.01] as V,
  horiz: [0.2, 2.6, ZW + 0.01] as V,
  low: [-3.0, 0.25, ZW + 0.01] as V,
  diag: [2.6, 1.7, ZW + 0.01] as V,
  placard: [3.9, 1.1, -1.4] as V,
  canaleta: [4.35, 2.75, -3.2] as V,
  soil: [4.5, 0.02, -3.3] as V,
  giant: [GIANT[0], GBR + GRV, GIANT[2] + GD / 2] as V,
  book: BOOK,
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
  p.x += Math.sin(t * 0.53) * 0.01; p.y += Math.sin(t * 0.71 + 1) * 0.007;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
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

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useCasaTex = () => useMemo(() => ({
  // pared pintada (látex crema con el grano del revoque y sombras de años)
  wall: mk(512, 512, (g) => {
    g.fillStyle = "#e6dcc8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5200; i++) { const v = 200 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 8},${v - 26},.35)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 10; i++) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, 120); gr.addColorStop(0, "rgba(150,130,100,.10)"); gr.addColorStop(1, "rgba(150,130,100,0)"); g.save(); g.translate(rnd(i, 4) * 512, rnd(i, 5) * 512); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 120, 0, 6.3); g.fill(); g.restore(); }
  }, [3, 2]),
  // el cuarteado de pelo (telaraña de rayitas: barro seco de charco)
  hair: mk(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512); g.strokeStyle = "rgba(60,48,36,.85)"; g.lineCap = "round";
    const seeds = Array.from({ length: 34 }, (_, i) => [rnd(i, 1) * 512, rnd(i, 2) * 512]);
    for (let i = 0; i < seeds.length; i++) for (let j = i + 1; j < seeds.length; j++) {
      const [ax, ay] = seeds[i], [bx, by] = seeds[j], d = Math.hypot(ax - bx, ay - by);
      if (d > 120 || rnd(i * 50 + j, 3) < 0.45) continue;
      g.lineWidth = 1 + rnd(i + j, 4) * 1.6; g.beginPath(); g.moveTo(ax, ay);
      for (let k = 1; k <= 6; k++) g.lineTo(lerp(ax, bx, k / 6) + (rnd(i * 9 + k, 5) - 0.5) * 9, lerp(ay, by, k / 6) + (rnd(j * 9 + k, 6) - 0.5) * 9);
      g.stroke();
    }
    const m = g.createRadialGradient(256, 256, 120, 256, 256, 256); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(1, "rgba(0,0,0,1)");
    g.globalCompositeOperation = "destination-out"; g.fillStyle = m; g.fillRect(0, 0, 512, 512); g.globalCompositeOperation = "source-over";
  }),
  // salitre (eflorescencia blanca y pintura inflada abajo)
  salt: mk(512, 128, (g) => {
    g.clearRect(0, 0, 512, 128);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(250,250,245,${0.3 + rnd(i, 1) * 0.5})`; const y = 128 - Math.pow(rnd(i, 2), 1.8) * 120; g.fillRect(rnd(i, 3) * 512, y, 2 + rnd(i, 4) * 3, 2); }
    const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "rgba(120,100,70,0)"); gr.addColorStop(1, "rgba(120,100,70,.35)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 128);
  }),
  // ladrillo común (corte de la pared gigante)
  brick: mk(512, 256, (g) => {
    g.fillStyle = "#b8a68a"; g.fillRect(0, 0, 512, 256);
    for (let r = 0; r < 4; r++) for (let c = -1; c < 3; c++) {
      const x = c * 220 + (r % 2) * 110 + 8, y = r * 64 + 6, i = r * 7 + c + 9;
      g.fillStyle = `rgb(${150 + rnd(i, 1) * 30},${70 + rnd(i, 2) * 20},${45 + rnd(i, 3) * 15})`; g.fillRect(x, y, 204, 52);
      for (let k = 0; k < 60; k++) { g.fillStyle = `rgba(${90 + rnd(i * 60 + k, 4) * 80},${40 + rnd(i * 60 + k, 5) * 30},25,.5)`; g.fillRect(x + rnd(i * 60 + k, 6) * 204, y + rnd(i * 60 + k, 7) * 52, 3, 3); }
    }
  }, [2, 1]),
  // revoque grueso (arena con cal, granos)
  rev: mk(256, 256, (g) => {
    g.fillStyle = "#b9b1a2"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) { const v = 140 + rnd(i, 1) * 80; g.fillStyle = `rgba(${v},${v - 6},${v - 16},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 2.5, 1 + rnd(i, 5) * 2.5); }
  }, [3, 1]),
  // la malla de fibra de vidrio (cuadraditos, con transparencia)
  mesh: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256); g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 5;
    for (let k = 0; k <= 256; k += 32) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); }
  }, [6, 2]),
  // piso de cerámico calcáreo
  floor: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#b8a58a" : "#9a836a"; g.fillRect(c * 64, r * 64, 64, 64); g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(c * 64 + 8, r * 64 + 8, 48, 48); }
    g.strokeStyle = "rgba(40,30,20,.45)"; g.lineWidth = 2; for (let k = 0; k <= 512; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 512); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(512, k); g.stroke(); }
  }, [4, 3]),
  // tierra del patio (la esquina mojada se oscurece aparte)
  soil: mk(256, 256, (g) => {
    g.fillStyle = "#5d6a3a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) { const v = 70 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v + 20},${v},${v - 20},.5)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 3); }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${60 + rnd(i, 7) * 40},${110 + rnd(i, 8) * 50},${40 + rnd(i, 9) * 20},${0.35 + rnd(i, 4) * 0.45})`; g.fillRect(rnd(i, 5) * 256, rnd(i, 6) * 256, 2, 7); }
  }, [6, 6]),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 24, r2, op }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
// plano pegado a una pared (z fijo, mirando +z o girado)
const Decal: React.FC<{ p: V; w: number; h: number; map: THREE.Texture; op: number; rotY?: number; col?: string }> = ({ p, w, h, map, op, rotY = 0, col = "#fff" }) =>
  op < 0.01 ? null : <mesh position={p} rotation={[0, rotY, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} color={col} transparent opacity={op} depthWrite={false} roughness={0.9} polygonOffset polygonOffsetFactor={-2} /></mesh>;

// UNA GRIETA dibujada sobre la pared: polilínea (x,y en la cara z) con ancho por tramo; glow = resaltado (ámbar), width = cuánto se abrió
type CPt = [number, number, number];          // x, y, ancho (m)
const Crack: React.FC<{ pts: CPt[]; z: number; vis: number; glow: number; grow?: number; col?: string; rotY?: number; ox?: number }> = ({ pts, z, vis, glow, grow = 1, col = "#ffb02e", rotY = 0, ox = 0 }) => {
  if (vis < 0.01) return null;
  const n = Math.max(1, Math.round((pts.length - 1) * cl(grow)));
  const segs = pts.slice(0, n + 1);
  return <group position={[ox, 0, z]} rotation={[0, rotY, 0]}>{segs.slice(1).map((b, i) => {
    const a = segs[i], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), w = (a[2] + b[2]) / 2;
    return <group key={i} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.002]} rotation={[0, 0, Math.atan2(dy, dx)]}>
      <mesh><planeGeometry args={[L + w * 0.6, w * 1.6]} /><meshBasicMaterial color="#6b5a46" transparent opacity={vis * 0.28} depthWrite={false} /></mesh>
      <mesh position={[0, 0, 0.0005]}><planeGeometry args={[L + w * 0.4, w * 0.5]} /><meshBasicMaterial color="#17110c" transparent opacity={vis * 0.95} depthWrite={false} /></mesh>
      {/* resaltado: un halo ámbar alrededor de la grieta (sin parpadeo: sube y baja con el estado) */}
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[L + 0.03, w + 0.03]} /><meshBasicMaterial color={col} transparent opacity={vis * glow * 0.55} depthWrite={false} toneMapped={false} /></mesh>
    </group>;
  })}</group>;
};
// testigo de yeso: pastilla redonda cruzada sobre la grieta, con la fecha a lápiz; split = la rayita que lo parte
const Testigo: React.FC<{ p: V; vis: number; split?: number; r?: number; rotY?: number }> = ({ p, vis, split = 0, r = 0.075, rotY = 0 }) => {
  if (vis < 0.01) return null;
  const k = ease(vis);
  return <group position={p} rotation={[0, rotY, 0]} scale={[k, k, k]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r, r * 1.04, 0.018, 32]} /><meshStandardMaterial color="#f4f1ea" roughness={0.95} /></mesh>
    {/* rayita horizontal de lápiz que cruza yeso y pared */}
    <mesh position={[0, 0, 0.0095]}><planeGeometry args={[r * 3.2, 0.004]} /><meshBasicMaterial color="#3a3a40" /></mesh>
    {split > 0.01 && <mesh position={[0, 0, 0.0098]} rotation={[0, 0, 1.25]}><planeGeometry args={[r * 2.05 * cl(split * 1.5), 0.003 + 0.006 * cl(split - 0.4)]} /><meshBasicMaterial color="#1a1410" /></mesh>}
  </group>;
};
// partículas (gotas de lluvia de la canaleta, polvo de la V)
const Dots: React.FC<{ pts: [number, number, number, number][]; col: string; size: number; glow: THREE.Texture; add?: boolean }> = ({ pts, col, size, glow, add = false }) => {
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry(), c = new THREE.Color(col);
    const pos = new Float32Array(pts.length * 3), cc = new Float32Array(pts.length * 3);
    pts.forEach(([x, y, z, o], i) => { pos.set([x, y, z], i * 3); cc.set([c.r * o, c.g * o, c.b * o], i * 3); });
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(cc, 3));
    return geo;
  }, [pts, col]);
  return <points geometry={g}><pointsMaterial map={glow} size={size} sizeAttenuation vertexColors transparent depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};

// ---------------- LA PARED GIGANTE EN CORTE ----------------
// superficie arriba (y = GBR+GRV+GPT), la grieta baja por el medio (x=0). La cara cortada mira a +z (a la cámara).
// open: la grieta se abre/cierra con el calor del día (el movimiento normal de la casa) · v: la V abierta · dust · fij (fijador)
// rigid: relleno duro (gris) que se despega y se raja · seal: sellador elástico que se estira · malla · end (enduido) · paint
const shapeExtrude = (pts: [number, number][], d: number) => {
  const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2); return g;
};
const Giant: React.FC<{ t: number; s: ReturnType<typeof ST>; tt: ReturnType<typeof useCasaTex>; glow: THREE.Texture }> = ({ t, s, tt, glow }) => {
  const k = ease(s.giant);
  const mv = s.move * (0.5 + 0.5 * Math.sin(t * 1.6));                 // el día y la noche: la pared respira
  const gap = 0.012 + 0.03 * mv;                                         // la ranura de la grieta
  const top = GBR + GRV, vw = 0.17 * ease(s.v), vd = 0.2 * ease(s.v);   // la V: ancho arriba y profundidad (dentro del revoque)
  const half = (side: number) => {
    const x0 = side * gap / 2, x1 = side * GW / 2;
    // revoque de esta mitad con su chaflán (la mitad de la V)
    const rev: [number, number][] = side < 0
      ? [[x1, GBR], [x0, GBR], [x0, top - vd], [x0 - vw / 2, top], [x1, top]]
      : [[x0, GBR], [x1, GBR], [x1, top], [x0 + vw / 2, top], [x0, top - vd]];
    return rev;
  };
  const geoL = useMemo(() => shapeExtrude(half(-1), GD), [gap.toFixed(4), vw.toFixed(4)]);
  const geoR = useMemo(() => shapeExtrude(half(1), GD), [gap.toFixed(4), vw.toFixed(4)]);
  // relleno de la V (triángulo), sellador: se estira con la ranura; rígido: queda del ancho de cuando se puso y se separa
  const fillV = (w: number, d: number): [number, number][] => [[-w / 2, top], [0, top - d], [w / 2, top]];
  const geoSeal = useMemo(() => shapeExtrude(fillV(Math.max(0.02, vw + gap * 0.2), vd + 0.004), GD * 0.98), [gap.toFixed(4), vw.toFixed(4)]);
  const geoRig = useMemo(() => shapeExtrude(fillV(0.17, 0.2), GD * 0.98), []);
  const dustPts = useMemo(() => Array.from({ length: 70 }, (_, i) => [(rnd(i, 1) - 0.5) * 0.14, top - rnd(i, 2) * 0.18, (rnd(i, 3) - 0.5) * GD, 0.9] as [number, number, number, number]), []);
  if (k < 0.01) return null;
  const pz = GD / 2;
  return <group position={[GIANT[0], (1 - k) * -0.5, GIANT[2]]} scale={[1, k, 1]}>
    {/* ladrillo (abajo, partido por la grieta) */}
    {[-1, 1].map((sd) => <Box key={sd} p={[sd * (GW / 4 + gap / 4), GBR / 2, 0]} s={[GW / 2 - gap / 2, GBR, GD]} c="#a8694c" map={tt.brick} r={0.95} rad={0.008} />)}
    {/* revoque con la V */}
    <mesh geometry={geoL} castShadow receiveShadow><meshStandardMaterial color="#b3a998" map={tt.rev} roughness={1} /></mesh>
    <mesh geometry={geoR} castShadow receiveShadow><meshStandardMaterial color="#b3a998" map={tt.rev} roughness={1} /></mesh>
    {/* pintura vieja (rota en la grieta) */}
    {[-1, 1].map((sd) => <Box key={"p" + sd} p={[sd * (GW / 4 + (gap + vw) / 4), top + GPT / 2, 0]} s={[GW / 2 - (gap + vw) / 2, GPT, GD + 0.004]} c="#9d927e" map={tt.rev} r={1} rad={0.004} op={1 - ease(s.paint) * 0.98} />)}
    {/* las tapadas viejas de Doña Marta: tres capas sueltas que salen al abrir la V */}
    {s.old > 0.01 && [["#f2efe8", 0], ["#ddd6c6", 1], ["#c8c0b0", 2]].map(([c, i]) => {
      const j = i as number, out = ease(cl(s.old * 3 - j));
      return <Box key={j} p={[0.0 + out * (0.35 + j * 0.28), top + 0.015 + j * 0.016 + out * (0.25 + j * 0.1), out * 0.15]} s={[0.09, 0.016, GD * 0.9]} c={c as string} r={0.9} rad={0.004} rot={[0, 0, out * (0.6 + j * 0.4)]} />;
    })}
    {/* polvo dentro de la V (se va con el pincel) */}
    {s.dust > 0.01 && <Dots pts={dustPts.map(([x, y, z, o]) => [x, y + s.brush * (0.4 + rnd(Math.round(x * 999), 4) * 0.5), z, o * s.dust * (1 - s.brush)] as [number, number, number, number])} col="#d9cfbd" size={0.05} glow={glow} />}
    {/* fijador: película blanca lechosa que moja las paredes de la V y 2 cm a los costados */}
    {s.fij > 0.01 && <Box p={[0, top + 0.002, 0]} s={[vw + 0.12, 0.004, GD * 0.99]} c="#d8d4ca" r={0.5} op={0.5 * s.fij} rad={0.001} />}
    {/* relleno DURO: entra, la pared se mueve y se despega de un costado + se raja al medio */}
    {s.rigid > 0.01 && <group position={[0, 0, 0]}>
      <mesh geometry={geoRig} position={[-mv * 0.012, 0, 0]}><meshStandardMaterial color="#a9a49b" roughness={0.6} transparent opacity={ease(s.rigid)} /></mesh>
      {s.rigidCrack > 0.01 && <Box p={[0.02, top - 0.07, pz + 0.002]} s={[0.006 + 0.012 * mv, 0.16 * s.rigidCrack, 0.004]} c="#1a1410" r={1} rad={0.001} />}
    </group>}
    {/* sellador ELÁSTICO: llena la V y se estira con la ranura (sin despegarse) */}
    {s.seal > 0.01 && <mesh geometry={geoSeal}><meshStandardMaterial color="#d9d2c4" roughness={0.7} transparent opacity={ease(s.seal)} emissive="#ffcf7a" emissiveIntensity={0.05 * s.sealGlow} /></mesh>}
    {/* malla de fibra hundida en el enduido, 10 cm de ancho (en el modelo, 0,5) */}
    {s.malla > 0.01 && <mesh position={[0, top + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.55 * ease(s.malla), GD * 0.96]} /><meshStandardMaterial map={tt.mesh} transparent opacity={0.9 * (1 - 0.6 * s.end)} color="#c2bcae" depthWrite={false} /></mesh>}
    {/* enduido: capa ancha que se DESVANECE a los costados (más fina en los bordes) */}
    {s.end > 0.01 && [0.9, 0.65, 0.4].map((w, i) => <Box key={"e" + i} p={[0, top + 0.016 + i * 0.004, 0]} s={[w * ease(s.end), 0.008, GD * 0.985]} c="#beb4a1" r={1} rad={0.003} op={0.5 + 0.17 * i} />)}
    {/* lija: polvito que sale en círculos */}
    {s.sand > 0.01 && <Dots pts={Array.from({ length: 40 }, (_, i) => { const a = t * 3 + i; return [Math.cos(a) * 0.2 * rnd(i, 1), top + 0.05 + rnd(i, 2) * 0.1, Math.sin(a) * 0.2, s.sand * 0.7] as [number, number, number, number]; })} col="#f2efe6" size={0.03} glow={glow} />}
    {/* pintura nueva: dos manos, el paño completo */}
    {s.paint > 0.01 && <Box p={[0, top + 0.03, 0]} s={[GW * ease(s.paint), 0.012, GD + 0.006]} c={s.paint2 > 0.5 ? "#bdb29d" : "#c3b9a5"} r={1} rad={0.004} />}
    {/* rótulos físicos: tres plaquitas en el corte (ladrillo · revoque · pintura) */}
    {s.layers > 0.01 && [[GBR / 2, "#c27a58"], [GBR + GRV / 2, "#cfc6b6"], [top + 0.02, "#e9dfcb"]].map(([y, c], i) => <Box key={"l" + i} p={[-GW / 2 - 0.12, y as number, pz - 0.05]} s={[0.12 * ease(cl(s.layers * 3 - i)), 0.05, 0.05]} c={c as string} r={0.6} rad={0.01} e={c as string} ei={0.15} />)}
  </group>;
};

// ---------------- EL MANUAL: páginas REALES del PDF (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas manual"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};
const PW = 0.29, PD = 0.438;
const uv = (u: number, v: number): V => [-PW / 2 + u * PW, 0.0009, -PD / 2 + v * PD];
const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  if (k <= 0.01) return null;
  const w = (u1 - u0) * PW * k, c = uv(u0, v);
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};

// las grietas de la casa (en metros sobre la cara de cada pared)
const C_CORNER: CPt[] = [[WIN1, WY1, 0.008], [WIN1 + 0.06, WY1 + 0.07, 0.007], [WIN1 + 0.1, WY1 + 0.16, 0.006], [WIN1 + 0.17, WY1 + 0.24, 0.005], [WIN1 + 0.21, WY1 + 0.34, 0.003]];
const C_DIAG: CPt[] = [[3.45, 2.45, 0.026], [3.3, 2.3, 0.022], [3.22, 2.12, 0.02], [3.05, 2.0, 0.017], [2.95, 1.8, 0.014], [2.78, 1.66, 0.011], [2.68, 1.46, 0.009], [2.5, 1.3, 0.007], [2.4, 1.1, 0.005], [2.25, 0.95, 0.003]];
const C_HORIZ: CPt[] = Array.from({ length: 11 }, (_, i) => [-0.6 + i * 0.17, 2.6 + (rnd(i, 4) - 0.5) * 0.012, 0.006] as CPt);
const C_LOW: CPt[] = Array.from({ length: 9 }, (_, i) => [-3.7 + i * 0.2, 0.26 + (rnd(i, 5) - 0.5) * 0.02, 0.005] as CPt);

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useCasaTex();
  const pg = useImgTex(["m1_p001", "m1_p013"]);
  const s = ST(t);
  const dark = s.dark;                                  // la pieza a oscuras para la linterna rasante
  const rain = s.rain;
  const rainPts = useMemo(() => Array.from({ length: 160 }, (_, i) => i), []);
  const corner = ease(s.fixed) ;                        // la canaleta arreglada + la vereda perimetral
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.45} threshold={0.9} exposure={1.25 - 0.55 * dark} env={0.45 - 0.3 * dark} />
      <color attach="background" args={[new THREE.Color("#b9cde0").lerp(new THREE.Color("#0b0d12"), dark * 0.85).getStyle()]} />
      <fog attach="fog" args={["#c8d6e4", 14, 40]} />
      <hemisphereLight args={[0xdfe8f5, 0x7a6650, 1.05 - 0.85 * dark]} />
      {/* el sol de la tarde: entra por la ventana del living de COSTADO (rasante sobre la pared del fondo) */}
      <directionalLight position={[-9, 6.5, -6]} intensity={2.4 - 1.9 * dark} color="#ffe2b8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[-1.2, 2.3, 0.6]} intensity={1.6 - 1.4 * dark} distance={9} color="#fff1dc" />
      <pointLight position={[2.6, 2.2, -0.6]} intensity={1.1 - 0.9 * dark} distance={6} color="#fff1dc" />
      {/* LA LINTERNA apoyada contra la pared, alumbrando RASANTE (siempre montada; la intensidad sube y baja) */}
      <spotLight position={[GIANT[0] - 1.6, GBR + GRV + 0.12, GIANT[2]]} target-position={[GIANT[0] + 1.2, GBR + GRV, GIANT[2]]} angle={0.5} penumbra={0.6} intensity={9 * s.flash} distance={5} color="#fff6e6" castShadow />
      <mesh position={[GIANT[0] - 1.62, GBR + GRV + 0.12, GIANT[2]]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.035, 0.03, 0.22, 16]} /><meshStandardMaterial color="#222" roughness={0.4} metalness={0.5} emissive="#fff6e6" emissiveIntensity={0.6 * s.flash} transparent opacity={cl(s.flash * 3)} /></mesh>

      {/* patio y suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial map={tt.soil} color="#c4c8b0" roughness={0.97} /></mesh>
      {/* ===== LA CASA (frente abierto en z=+2.6) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -0.15]} receiveShadow><planeGeometry args={[8.2, 5.5]} /><meshStandardMaterial map={tt.floor} roughness={0.55} /></mesh>
      {/* pared del fondo con el hueco de la ventana */}
      <Box p={[-3.15, HW / 2, ZW - 0.1]} s={[1.7, HW, 0.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WIN0 + WIN1) / 2, WY0 / 2, ZW - 0.1]} s={[WIN1 - WIN0, WY0, 0.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WIN0 + WIN1) / 2, (WY1 + HW) / 2, ZW - 0.1]} s={[WIN1 - WIN0, HW - WY1, 0.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.55, HW / 2, ZW - 0.1]} s={[4.9, HW, 0.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      {/* marco y vidrio de la ventana */}
      <Box p={[(WIN0 + WIN1) / 2, WY0 - 0.03, ZW + 0.02]} s={[WIN1 - WIN0 + 0.1, 0.06, 0.12]} c="#f4f0e8" r={0.5} rad={0.01} />
      {[[WIN0, 0], [WIN1, 0]].map(([x], i) => <Box key={i} p={[x, (WY0 + WY1) / 2, ZW - 0.05]} s={[0.05, WY1 - WY0, 0.08]} c="#6a4a32" r={0.7} rad={0.008} />)}
      <Box p={[(WIN0 + WIN1) / 2, WY1, ZW - 0.05]} s={[WIN1 - WIN0, 0.05, 0.08]} c="#6a4a32" r={0.7} rad={0.008} />
      <Box p={[(WIN0 + WIN1) / 2, (WY0 + WY1) / 2, ZW - 0.05]} s={[0.035, WY1 - WY0, 0.06]} c="#6a4a32" r={0.7} rad={0.006} />
      <mesh position={[(WIN0 + WIN1) / 2, (WY0 + WY1) / 2, ZW - 0.07]}><planeGeometry args={[WIN1 - WIN0, WY1 - WY0]} /><meshStandardMaterial color="#cfe3f2" transparent opacity={0.18} roughness={0.05} metalness={0.2} /></mesh>
      {/* pared izquierda y tabique del dormitorio (con el vano de la puerta) */}
      <Box p={[-4.1, HW / 2, -0.15]} s={[0.2, HW, 5.5]} c="#e2d7c2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.2, HW / 2, -2.3]} s={[0.12, HW, 1.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.2, HW / 2, -0.3]} s={[0.12, HW, 1.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.2, 2.35, -1.2]} s={[0.12, 0.7, 0.6]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      {/* pared derecha del dormitorio (la de afuera) con el placard */}
      <Box p={[4.1, HW / 2, -0.15]} s={[0.2, HW, 5.5]} c="#e2d7c2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[3.85, 1.1, -1.4]} s={[0.3, 2.2, 1.2]} c="#8a6a4a" r={0.65} rad={0.01} />
      {/* la puerta del placard: ya no cierra (queda entreabierta y roza arriba) */}
      <group position={[3.69, 1.1, -0.82]} rotation={[0, -0.12 - 0.2 * s.placard, 0]}><Box p={[0, 0, -0.29]} s={[0.025, 2.1, 0.58]} c="#9a7a56" r={0.6} rad={0.006} e="#ffb02e" ei={0.25 * s.placard} /></group>
      {/* losa (el techo de hormigón, sólo la mitad de atrás: que la cámara entre) */}
      <Box p={[0, HW + 0.08, -2.15]} s={[8.4, 0.16, 1.7]} c="#d9d3c6" r={0.9} rad={0.01} />
      {/* muebles: el sofá, la mesa baja, la lámpara, el cuadro, la cama del dormitorio */}
      <Box p={[-2.6, 0.24, -2.3]} s={[1.9, 0.42, 0.75]} c="#6f7f6a" r={0.95} rad={0.08} />
      <Box p={[-2.6, 0.62, -2.6]} s={[1.9, 0.5, 0.2]} c="#6f7f6a" r={0.95} rad={0.08} />
      <Box p={[-1.0, 0.24, -1.2]} s={[0.9, 0.06, 0.5]} c="#7a5638" r={0.6} rad={0.01} />
      {[[-1.4, -1.4], [-0.6, -1.4], [-1.4, -1.0], [-0.6, -1.0]].map(([x, z], i) => <Box key={i} p={[x, 0.11, z]} s={[0.04, 0.22, 0.04]} c="#5a3e28" r={0.6} rad={0.006} />)}
      <Box p={[2.75, 0.3, -1.9]} s={[1.5, 0.35, 1.9]} c="#d9cdb6" map={tx.paper} r={0.95} rad={0.06} />
      <Box p={[2.75, 0.62, -2.75]} s={[1.5, 0.75, 0.08]} c="#5a3e28" r={0.6} rad={0.02} />
      {/* mesa de trabajo de Claudio (el balde, la espátula, el vasito de yeso) + EL MANUAL */}
      <Box p={[2.55, 0.72, 0.6]} s={[1.2, 0.05, 0.7]} c="#9a7a56" r={0.6} rad={0.01} />
      {[[2.0, 0.3], [3.1, 0.3], [2.0, 0.9], [3.1, 0.9]].map(([x, z], i) => <Box key={i} p={[x, 0.36, z]} s={[0.05, 0.72, 0.05]} c="#5a3e28" r={0.6} rad={0.006} />)}
      <Cyl p={[3.0, 0.88, 0.75]} r={0.12} r2={0.1} h={0.28} c="#d9d4c8" rough={0.6} />
      <Cyl p={[2.15, 0.79, 0.85]} r={0.04} r2={0.032} h={0.09} c="#f2f0ea" rough={0.5} />

      {/* ===== LAS GRIETAS DE LA CASA ===== */}
      {/* 1) de pelo: el cuarteado de telaraña */}
      <Decal p={[0.45, 1.35, ZW + 0.003]} w={0.9} h={0.9} map={tt.hair} op={s.hairVis} col={s.hairGlow > 0.05 ? "#ffcf8a" : "#ffffff"} />
      {/* 2) la de la esquina de la ventana (la que Doña Marta tapó tres veces) */}
      <Crack pts={C_CORNER} z={ZW} vis={s.cornerVis} glow={s.cornerGlow} />
      {/* 3) la DIAGONAL del dormitorio, más ancha arriba */}
      <Crack pts={C_DIAG} z={ZW} vis={1} glow={s.diagGlow} col="#ff5a3a" grow={1} />
      {/* 4) horizontal bajo la losa y 4b) la de abajo con salitre */}
      <Crack pts={C_HORIZ} z={ZW} vis={1} glow={s.horizGlow} />
      <Crack pts={C_LOW} z={ZW} vis={1} glow={s.lowGlow} col="#7ad0ff" />
      <Decal p={[-3.0, 0.22, ZW + 0.004]} w={2.0} h={0.45} map={tt.salt} op={0.9} />
      {/* LOS CUATRO TESTIGOS: living (esquina), pasillo (pelo), cocina (bajo la losa) y dormitorio (diagonal) */}
      <Testigo p={[WIN1 + 0.1, WY1 + 0.16, ZW + 0.012]} vis={s.testigo} r={0.05} />
      <Testigo p={[0.45, 1.35, ZW + 0.012]} vis={s.testigo} r={0.05} />
      <Testigo p={[0.2, 2.6, ZW + 0.012]} vis={s.testigo} r={0.045} />
      <Testigo p={[2.95, 1.8, ZW + 0.012]} vis={Math.max(s.testigo, s.split > 0 ? 1 : 0)} split={s.split} r={0.06} />
      {/* LA MONEDA: el canto contra la grieta del dormitorio (entra entera, arriba más) */}
      {s.coin > 0.01 && <group position={[3.06 - 0.04 * ease(s.coinIn), 1.95, ZW + 0.03 - 0.022 * ease(s.coinIn)]} rotation={[Math.PI / 2, 0, -0.85]} scale={ease(cl(s.coin * 2))}>
        <mesh castShadow><cylinderGeometry args={[0.035, 0.035, 0.0045, 40]} /><meshStandardMaterial color="#d9b25a" roughness={0.25} metalness={0.9} /></mesh>
      </group>}

      {/* ===== AFUERA: la esquina del dormitorio, la canaleta rota y el agua al pie del cimiento ===== */}
      <Box p={[4.35, HW + 0.14, -1.0]} s={[0.25, 0.12, 4.4]} c="#8d9196" r={0.4} m={0.6} rad={0.01} />
      {/* bajada: rota (termina en el aire) → arreglada (codo que tira lejos, sobre la vereda) */}
      <Cyl p={[4.38, 1.85, -3.25]} r={0.045} h={1.6} c="#8d9196" m={0.6} rough={0.4} />
      <Cyl p={[4.38, 0.75 - 0.6 * corner, -3.25 + 0.35 * corner]} r={0.045} h={0.6 * corner + 0.001} c="#8d9196" m={0.6} rough={0.4} rot={[corner * 1.2, 0, 0]} />
      {/* la tierra blanda de la esquina (oscura de agua) y la vereda perimetral nueva */}
      <mesh position={[4.6, 0.003, -3.25]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.9, 40]} /><meshStandardMaterial color="#3b2c1c" roughness={0.75 + 0.2 * corner} transparent opacity={(0.25 + 0.6 * s.wet) * (1 - corner)} /></mesh>
      <Box p={[4.62, 0.03, -1.0]} s={[0.6 * corner + 0.001, 0.06, 4.6]} c="#a9a8a3" map={tx.concrete} r={0.9} rad={0.01} op={cl(corner * 2)} />
      {rain > 0.01 && <Dots pts={rainPts.map((i) => { const ph = (t * (1.3 + rnd(i, 1) * 0.6) + rnd(i, 2)) % 1; return [4.38 + (rnd(i, 3) - 0.5) * 0.08, 1.05 - ph * 1.05, -3.25 + (rnd(i, 4) - 0.5) * 0.08, rain * 0.95] as [number, number, number, number]; })} col="#9fc8ff" size={0.035} glow={tx.flake} />}
      {/* el cimiento en corte bajo la esquina (la tierra blanda y el agua que baja) */}
      {s.found > 0.01 && <group position={[4.1, 0, -3.0]}>
        <Box p={[0, -0.35 * ease(s.found), 0]} s={[0.4, 0.7 * ease(s.found), 0.4]} c="#8f8a80" map={tx.concrete} r={0.95} rad={0.01} />
        <Dots pts={Array.from({ length: 60 }, (_, i) => { const ph = (t * 0.25 + rnd(i, 1)) % 1; return [0.35 + rnd(i, 2) * 0.5, -ph * 0.7, -0.2 + rnd(i, 3) * 0.5, s.found * s.wet * 0.8] as [number, number, number, number]; })} col="#6aa8ff" size={0.04} glow={tx.flake} />
      </group>}

      {/* afuera: zócalo de cemento, la medianera de ladrillo y un cerco (que el patio tenga profundidad) */}
      <Box p={[4.215, 0.22, -0.15]} s={[0.03, 0.44, 5.5]} c="#9a978f" map={tx.concrete} r={0.95} rad={0.004} />
      <Box p={[0.15, 0.22, -3.115]} s={[8.4, 0.44, 0.03]} c="#9a978f" map={tx.concrete} r={0.95} rad={0.004} />
      <Box p={[2.5, 0.95, -6.6]} s={[16, 1.9, 0.22]} c="#b56e4e" map={tt.brick} r={0.95} rad={0.01} />
      {Array.from({ length: 12 }, (_, i) => <Box key={"cerco" + i} p={[8.6, 0.6, -6.2 + i * 0.85]} s={[0.08, 1.2, 0.08]} c="#7a5a3c" r={0.9} rad={0.01} />)}
      <Box p={[8.6, 1.05, -1.5]} s={[0.04, 0.08, 10]} c="#7a5a3c" r={0.9} rad={0.01} />
      <Box p={[8.6, 0.45, -1.5]} s={[0.04, 0.08, 10]} c="#7a5a3c" r={0.9} rad={0.01} />
      {/* el corte de la tierra bajo la esquina (sólo cuando bajamos a ver el cimiento) */}
      {s.found > 0.01 && <>
        <Box p={[5.0, -0.7, -3.75]} s={[3.6, 1.4, 0.1]} c="#5a4430" map={tt.soil} r={1} rad={0.002} />
        <Box p={[5.0, -1.42, -2.4]} s={[3.6, 0.06, 2.8]} c="#4a3828" r={1} rad={0.002} />
        <Box p={[5.0, -0.035, -2.4]} s={[3.6, 0.06, 2.8]} c="#4b5a2e" r={1} rad={0.002} />
        <Box p={[3.15, -0.7, -2.4]} s={[0.1, 1.4, 2.8]} c="#5a4430" map={tt.soil} r={1} rad={0.002} />
      </>}

      {/* ===== LA PARED GIGANTE EN CORTE ===== */}
      <Giant t={t} s={s} tt={tt} glow={tx.flake} />

      {/* ===== EL MANUAL DEL ALBAÑIL: sobre la mesa, se abre en la página 13 ===== */}
      {s.book > 0.01 && pg.m1_p001 && <Book p={[BOOK[0] - 0.15, BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.08} open={s.open} cover={pg.m1_p001} inside={pg.m1_p013_r} right={pg.m1_p013} spine="#e8a21a">
        {s.open > 0.9 && <>
          <PageHi k={s.hi[0]} u0={0.07} u1={0.92} v={0.37} h={0.06} />
          <PageHi k={s.hi[1]} u0={0.07} u1={0.93} v={0.6} h={0.035} col="#ff9a4a" />
          <PageHi k={s.hi[2]} u0={0.08} u1={0.93} v={0.765} h={0.035} col="#7dff9e" />
        </>}
      </Book>}
    </ThreeCanvas>
  );
};
