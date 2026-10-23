// valniveamix · EL MUNDO. Tres estaciones en una sola escena y una sola cámara:
// 1) el TOCADOR de la doctora: mesada blanca, azulejo crema, espejo redondo, ventana con luz de mañana; arriba la lata
//    azul abierta (sin marca), el cuenco de vidrio donde se hace la mezcla (crema → gel → grumitos → nata batida),
//    la cucharita, la sábila en su maceta con una hoja cortada, el frasquito con la fecha y EL RECETARIO (páginas reales).
// 2) el CORTE DE PIEL gigante: epidermis (lisa o "tierra seca"), dermis con fibras de colágeno, grasa; gotitas de agua que
//    entran, se escapan o quedan bajo la "tapa" de crema (fina o gruesa).
// 3) el VASO de agua y aceite que se vuelve gotitas (agua en aceite) y las CADENAS de azúcares de la sábila con agua atrapada.
// Eventos clavados a la voz (EV, segundos globales). Render SÓLO en el farm (acá sólo stills).
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { P } from "./lib";
import { KEYS as KEYS0, EV, CY, SK, PTS } from "./cam";
import { manoCam } from "../kits/camara/CamaraMano";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const PT = PTS;

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
const KEYS = () => KEYS0 as Key[];
export const camAt = (t: number) => {
  const K = KEYS();
  if (!K.length) return { p: v3([0, 1.3, 1.3]), l: v3([0, 0.95, 0]), up: new THREE.Vector3(0, 1, 0), fov: 40 };
  let i = 0;
  while (i < K.length - 1 && K[i + 1].t <= t) i++;
  const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // cámara a mano virtual (vara 23-oct): pan/tilt mueven el punto de mira, roll gira el "arriba"
  const m = manoCam(t), d = p.distanceTo(l), rad = Math.PI / 180;
  const fw = l.clone().sub(p).normalize(), rt = fw.clone().cross(new THREE.Vector3(0, 1, 0)).normalize(), upv = rt.clone().cross(fw).normalize();
  l.addScaledVector(rt, Math.tan(m.pan * rad) * d).addScaledVector(upv, Math.tan(m.tilt * rad) * d);
  const up = upv.multiplyScalar(Math.cos(m.roll * rad)).addScaledVector(rt, Math.sin(m.roll * rad));
  return { p, l, up, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; up?: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.002, 400); cam.position.copy(cm.p); if (cm.up) cam.up.copy(cm.up); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
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
  cm.position.copy(k.p); cm.up.copy(k.up); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.002; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- páginas REALES del recetario (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas recetario", { timeoutInMilliseconds: 110000 });
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (tt) => { flip.image = tt.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};
// sube TODAS las texturas a la GPU antes de soltar el cuadro (sin esto, la 1ª vez que una página entra en cuadro sale negra)
const Warm: React.FC<{ tex: THREE.Texture[] }> = ({ tex }) => {
  const { gl, advance } = useThree();
  const h = useRef<number | null>(null);
  if (h.current === null) h.current = delayRender("texturas en GPU", { timeoutInMilliseconds: 170000 });
  const [late, setLate] = useState(false);
  useEffect(() => { const k = setTimeout(() => setLate(true), 80000); return () => clearTimeout(k); }, []);
  const ready = late || tex.every((x) => x.image);
  useLayoutEffect(() => {
    if (!ready) return;
    tex.forEach((x) => gl.initTexture(x));
    advance(performance.now());
    const id = h.current!; h.current = -1;
    if (id >= 0) requestAnimationFrame(() => requestAnimationFrame(() => { advance(performance.now()); continueRender(id); }));
  }, [ready]);
  return null;
};

// ---------------- texturas procedurales ----------------
const mkCv = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!); return cv; };
const toTex = (cv: HTMLCanvasElement, rep: [number, number] = [1, 1], srgb = true) => {
  const t = new THREE.CanvasTexture(cv); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 16; return t;
};
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1], srgb = true) => toTex(mkCv(w, h, draw), rep, srgb);

// la superficie de la piel: poros + surcos finos; dry = la "tierra seca" (grietas en polígonos, escamitas)
const skinTop = (g: CanvasRenderingContext2D, w: number, h: number, dry: boolean, col: boolean) => {
  g.fillStyle = col ? (dry ? "#d9a98f" : "#eab49b") : "#9a9a9a"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { const x = rnd(i, 1) * w, y = rnd(i, 2) * h; g.fillStyle = col ? `rgba(150,80,60,${0.05 + rnd(i, 3) * 0.08})` : `rgba(40,40,40,${0.2 + rnd(i, 3) * 0.3})`; g.beginPath(); g.arc(x, y, 0.6 + rnd(i, 4) * 1.6, 0, 6.3); g.fill(); }
  // surcos (líneas de la piel) en rombos
  const n = dry ? 60 : 26;
  for (let i = 0; i < n; i++) {
    const x0 = rnd(i, 5) * w, y0 = rnd(i, 6) * h, a = (rnd(i, 7) > 0.5 ? 0.6 : -0.6) + (rnd(i, 8) - 0.5) * 0.4, L = (dry ? 120 : 70) + rnd(i, 9) * 160;
    g.beginPath(); g.moveTo(x0, y0);
    let x = x0, y = y0;
    for (let s = 0; s < 8; s++) { x += Math.cos(a + (rnd(i * 9 + s, 10) - 0.5) * 0.7) * L / 8; y += Math.sin(a + (rnd(i * 9 + s, 10) - 0.5) * 0.7) * L / 8; g.lineTo(x, y); }
    g.strokeStyle = col ? `rgba(120,55,40,${dry ? 0.55 : 0.22})` : `rgba(10,10,10,${dry ? 0.95 : 0.5})`; g.lineWidth = dry ? 3.2 : 1.6; g.stroke();
  }
  if (dry && col) for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(245,232,222,${0.35 + rnd(i, 11) * 0.4})`; g.beginPath(); g.ellipse(rnd(i, 12) * w, rnd(i, 13) * h, 3 + rnd(i, 14) * 8, 1.5 + rnd(i, 15) * 3, rnd(i, 16) * 3, 0, 6.3); g.fill(); }
};

const useTex = () => useMemo(() => ({
  // azulejo crema del tocador (10 x 10 cm, junta clara)
  tile: mk(512, 512, (g) => {
    g.fillStyle = "#e9dfcc"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const v = rnd(r * 4 + c, 1);
      const gr = g.createLinearGradient(c * 128, r * 128, c * 128 + 128, r * 128 + 128); gr.addColorStop(0, `rgb(${244 - v * 8},${236 - v * 8},${220 - v * 10})`); gr.addColorStop(1, `rgb(${236 - v * 8},${226 - v * 8},${206 - v * 10})`);
      g.fillStyle = gr; g.fillRect(c * 128 + 3, r * 128 + 3, 122, 122);
      g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(c * 128 + 8, r * 128 + 8, 60, 3);
    }
  }, [12, 6]),
  marble: mk(1024, 512, (g) => {
    g.fillStyle = "#f2efe9"; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 22; i++) { g.beginPath(); let x = rnd(i, 1) * 1024, y = rnd(i, 2) * 512; g.moveTo(x, y); for (let s = 0; s < 30; s++) { x += 14 + rnd(i * 30 + s, 3) * 20; y += (rnd(i * 30 + s, 4) - 0.5) * 30; g.lineTo(x, y); } g.strokeStyle = `rgba(150,140,128,${0.1 + rnd(i, 5) * 0.18})`; g.lineWidth = 0.8 + rnd(i, 6) * 2; g.stroke(); }
  }),
  wood: mk(512, 256, (g) => {
    g.fillStyle = "#c9ae88"; g.fillRect(0, 0, 512, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(110,80,45,${0.1 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(170, y + 4 * rnd(k, 3), 340, y - 4, 512, y + 2); g.stroke(); }
  }, [2, 1]),
  terracota: mk(256, 128, (g) => { g.fillStyle = "#b8643c"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${rnd(i, 1) > 0.5 ? "90,40,20" : "230,170,130"},${0.08 + rnd(i, 2) * 0.12})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 128, 2, 2); } g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(0, 0, 256, 16); }, [3, 1]),
  towel: mk(256, 256, (g) => { g.fillStyle = "#f6f1e8"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(200,190,175,${rnd(i, 1) * 0.3})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1.5, 1.5); } g.fillStyle = "#c9a96a"; g.fillRect(0, 200, 256, 10); }),
  // etiqueta de cinta de papel del frasquito (fecha a mano)
  label: mk(256, 96, (g) => { g.fillStyle = "#efe3c4"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#3a2a1c"; g.font = "italic 700 46px Georgia"; g.textAlign = "center"; g.fillText("lunes 14", 128, 62); }),
  skinSmooth: mk(1024, 1024, (g) => skinTop(g, 1024, 1024, false, true), [2, 1]),
  skinDry: mk(1024, 1024, (g) => skinTop(g, 1024, 1024, true, true), [2, 1]),
  skinBumpS: mk(1024, 1024, (g) => skinTop(g, 1024, 1024, false, false), [2, 1], false),
  skinBumpD: mk(1024, 1024, (g) => skinTop(g, 1024, 1024, true, false), [2, 1], false),
  // la cara cortada: dermis rosada con su trama (el colágeno va encima en 3D)
  derm: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#f3c6b6"); gr.addColorStop(1, "#ecb8a6"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(${rnd(i, 1) > 0.6 ? "200,90,80" : "255,235,225"},${0.08 + rnd(i, 2) * 0.12})`; g.beginPath(); g.arc(rnd(i, 3) * 1024, rnd(i, 4) * 512, 1 + rnd(i, 5) * 3, 0, 6.3); g.fill(); }
    // capilares
    for (let i = 0; i < 9; i++) { g.beginPath(); let x = rnd(i, 6) * 1024, y = 512; g.moveTo(x, y); for (let s = 0; s < 12; s++) { x += (rnd(i * 12 + s, 7) - 0.5) * 70; y -= 30 + rnd(i * 12 + s, 8) * 20; g.lineTo(x, y); } g.strokeStyle = "rgba(190,60,60,.35)"; g.lineWidth = 3; g.stroke(); }
  }),
  epiSide: mk(1024, 128, (g) => {
    g.fillStyle = "#e7a98f"; g.fillRect(0, 0, 1024, 128);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 60; c++) { const x = c * 17 + (r % 2) * 8 + rnd(r * 60 + c, 1) * 4, y = 10 + r * 19; g.fillStyle = `rgba(${200 + rnd(r * 60 + c, 2) * 40},${130 + rnd(r * 60 + c, 3) * 30},${110},.6)`; g.beginPath(); g.ellipse(x, y, 7.5, 7, 0, 0, 6.3); g.fill(); g.strokeStyle = "rgba(150,70,55,.35)"; g.lineWidth = 1.2; g.stroke(); }
    g.fillStyle = "rgba(180,100,80,.5)"; g.fillRect(0, 0, 1024, 6);
  }),
  fatSide: mk(512, 256, (g) => { g.fillStyle = "#f2d896"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 90; i++) { g.strokeStyle = "rgba(200,150,70,.35)"; g.lineWidth = 2; g.beginPath(); g.arc(rnd(i, 1) * 512, rnd(i, 2) * 256, 14 + rnd(i, 3) * 18, 0, 6.3); g.stroke(); } }),
  studio: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#f7eee2"); gr.addColorStop(0.55, "#f1dfcc"); gr.addColorStop(1, "#d9bfa6"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    const rg = g.createRadialGradient(512, 240, 10, 512, 240, 420); rg.addColorStop(0, "rgba(255,250,240,.7)"); rg.addColorStop(1, "rgba(255,250,240,0)"); g.fillStyle = rg; g.fillRect(0, 0, 1024, 512);
  }),
  garden: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#cfe6f4"); gr.addColorStop(0.55, "#eef3e6"); gr.addColorStop(0.62, "#8fb26a"); gr.addColorStop(1, "#5d8a44"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${60 + rnd(i, 1) * 40},${110 + rnd(i, 2) * 50},${50},.6)`; g.beginPath(); g.arc(rnd(i, 3) * 1024, 300 + rnd(i, 4) * 40, 20 + rnd(i, 5) * 50, 0, 6.3); g.fill(); }
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; e?: string; ei?: number }> = ({ p, s, c, r = 0.85, m = 0, map, rad = 0.02, rot, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Tube: React.FC<{ pts: V[]; r: number; col: string; seg?: number; m?: number; rough?: number; op?: number }> = ({ pts, r, col, seg = 40, m = 0, rough = 0.6, op = 1 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(v3)), seg, r, 8, false), [pts.map((q) => q.join()).join("|"), r, seg]);
  if (op <= 0.01) return null;
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={col} roughness={rough} metalness={m} transparent={op < 1} opacity={op} /></mesh>;
};
// gotita de agua (azul clara, brillante)
const Drop: React.FC<{ p: V; r: number; o?: number }> = ({ p, r, o = 1 }) => o <= 0.02 || r <= 0.0005 ? null : (
  <mesh position={p} scale={[r, r * 1.05, r]}><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#7cc4f2" roughness={0.05} metalness={0} transmission={0.55} thickness={0.5} ior={1.33} clearcoat={1} transparent opacity={0.92 * o} emissive="#3d8fd0" emissiveIntensity={0.25} /></mesh>
);

// EL RECETARIO: libro de tapa dura con bisagra; la hoja pasa con curva
const PAPER = "#d8d1c4";
const Sheet: React.FC<{ ang: number; w: number; d: number; front?: Tx; back?: Tx }> = ({ ang, w, d, front, back }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, 0.001, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};
export const BW = 0.26, BD = 0.34;
export const pageAt = (u: number, v: number): V => [PTS.book[0] + 0.004 + (u - 0.5) * (BW - 0.01), PTS.book[1] + 0.046, PTS.book[2] + (v - 0.5) * (BD - 0.012)];
const Book: React.FC<{ p: V; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[] }> = ({ p, open, cover, inside, right, spine, flips = [] }) => {
  const w = BW, d = BD, th = 0.03;
  const ang = Math.PI * ease(open);
  return (
    <group position={p} rotation={[0, 0.06, 0]}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#e2dacb" roughness={0.95} /></mesh>
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Sheet ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} /></group>)}
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.4} metalness={0.05} /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};

// la lata azul abierta (lisa, sin marca): crema blanca adentro con la marca del dedo; la tapa apoyada al costado
const Tin: React.FC<{ dent: number }> = ({ dent }) => (
  <group position={PTS.tin}>
    <mesh position={[0, 0.021, 0]} castShadow receiveShadow><cylinderGeometry args={[0.085, 0.085, 0.042, 64]} /><meshStandardMaterial color="#1b3a8c" metalness={0.55} roughness={0.32} /></mesh>
    <mesh position={[0, 0.0425, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.083, 0.0025, 10, 64]} /><meshStandardMaterial color="#d9dde6" metalness={0.8} roughness={0.25} /></mesh>
    <mesh position={[0, 0.0405, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.081, 64]} /><meshStandardMaterial color="#fbf8f2" roughness={0.55} /></mesh>
    {/* el remolino de la crema y el hueco del dedo */}
    <mesh position={[0.012, 0.043, -0.01]} scale={[0.05, 0.006, 0.04]}><sphereGeometry args={[1, 24, 12]} /><meshStandardMaterial color="#fffdf8" roughness={0.5} /></mesh>
    {dent > 0.01 && <mesh position={[-0.03, 0.0412, 0.025]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}><circleGeometry args={[0.017 * dent, 24]} /><meshStandardMaterial color="#e8e1d4" roughness={0.6} /></mesh>}
    {/* la tapa, apoyada contra el azulejo */}
    <group position={[-0.17, 0.09, -0.16]} rotation={[1.25, 0.15, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.088, 0.088, 0.014, 64]} /><meshStandardMaterial color="#1b3a8c" metalness={0.55} roughness={0.3} /></mesh>
      <mesh position={[0, 0.0072, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.0018, 8, 64]} /><meshStandardMaterial color="#e9edf3" metalness={0.6} roughness={0.3} /></mesh>
    </group>
  </group>
);

// el cuenco de vidrio y lo que pasa adentro: st = 0 vacío · crema · gel · mezcla k (grumos → nata) · gotitas
type BowlSt = { crema: number; gel: number; mix: number; drops: number };
const Bowl: React.FC<{ st: BowlSt; t: number }> = ({ st, t }) => {
  const R = 0.065;
  const mound = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(z, x); const n = 1 + 0.08 * Math.sin(a * 7 + y * 9) * y + 0.05 * Math.sin(a * 13 + y * 17) * y; const peak = y > 0.85 ? 1 + 0.35 * (y - 0.85) / 0.15 : 1; p.setXYZ(i, x * n, y * n * peak, z * n); }
    g.computeVertexNormals(); return g;
  }, []);
  const m = ease(st.mix), sw = t * 2.2;
  return (
    <group position={PTS.bowl}>
      <mesh position={[0, R * 0.62, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[R, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 * 0.98]} />
        <meshPhysicalMaterial color="#f4fbff" roughness={0.04} transmission={0.92} thickness={0.004} ior={1.5} transparent opacity={0.55} side={THREE.DoubleSide} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.03, 0.032, 0.006, 40]} /><meshPhysicalMaterial color="#eef6fa" roughness={0.05} transmission={0.9} transparent opacity={0.5} /></mesh>
      <mesh position={[0, R * 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[R * 0.998, 0.0022, 10, 64]} /><meshPhysicalMaterial color="#ffffff" roughness={0.03} transmission={0.8} transparent opacity={0.6} /></mesh>
      {/* crema (blanca, espesa) y gel (transparente) antes de mezclar: dos montoncitos que se van juntando */}
      {st.crema > 0.01 && m < 0.98 && <mesh position={[-0.014 * (1 - m), 0.012, 0.004]} scale={[0.026 * st.crema * (1 + 0.5 * m), 0.014 * st.crema * (1 - 0.3 * m), 0.024 * st.crema * (1 + 0.5 * m)]} rotation={[0, m * sw, 0]}>
        <sphereGeometry args={[1, 28, 16]} /><meshStandardMaterial color="#fffdf7" roughness={0.42} transparent opacity={1 - e01(m, 0.75, 0.98)} /></mesh>}
      {st.gel > 0.01 && m < 0.9 && <mesh position={[0.018 * (1 - m) + Math.cos(sw) * 0.006 * m, 0.016, -0.004]} scale={[0.017 * st.gel, 0.009 * st.gel, 0.016 * st.gel]}>
        <sphereGeometry args={[1, 28, 16]} /><meshPhysicalMaterial color="#eef7e8" roughness={0.02} transmission={0.85} thickness={0.6} ior={1.35} clearcoat={1} transparent opacity={0.9 * (1 - e01(m, 0.5, 0.9))} /></mesh>}
      {/* la mezcla: más blanca, esponjosa, con picos (nata batida) */}
      {m > 0.35 && <mesh geometry={mound} position={[0, 0.006, 0]} scale={[0.036 * (0.7 + 0.3 * m), 0.026 * m, 0.036 * (0.7 + 0.3 * m)]} rotation={[0, sw * 0.4 * (1 - m), 0]}>
        <meshStandardMaterial color="#fffefb" roughness={0.62} transparent opacity={e01(m, 0.35, 0.75)} /></mesh>}
      {/* grumitos mientras se mezcla */}
      {m > 0.15 && m < 0.75 && Array.from({ length: 9 }, (_, i) => { const a = i * 0.7 + sw * (0.6 + rnd(i, 1) * 0.4), r = 0.012 + rnd(i, 2) * 0.016; return <mesh key={i} position={[Math.cos(a) * r, 0.016 + rnd(i, 3) * 0.006, Math.sin(a) * r]} scale={0.0035 + rnd(i, 4) * 0.003}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#fffaf0" roughness={0.5} /></mesh>; })}
      {/* demasiado gel: gotitas de agua que se separan */}
      {st.drops > 0.01 && Array.from({ length: 14 }, (_, i) => { const a = rnd(i, 5) * 6.3, r = 0.012 + rnd(i, 6) * 0.02; return <Drop key={i} p={[Math.cos(a) * r, 0.022 + rnd(i, 7) * 0.004, Math.sin(a) * r]} r={0.0022 * st.drops * (0.6 + rnd(i, 8))} />; })}
    </group>
  );
};
const e01 = (x: number, a: number, b: number) => sm((x - a) / (b - a));

// la cucharita de té (acero): posición según la escena (apoyada, con crema al ras, con gel, mezclando en círculos)
const Spoon: React.FC<{ p: V; rot: V; load: "none" | "crema" | "gel" }> = ({ p, rot, load }) => (
  <group position={p} rotation={rot}>
    <mesh position={[0.06, 0, 0]} castShadow><boxGeometry args={[0.11, 0.0025, 0.009]} /><meshStandardMaterial color="#d9dde2" metalness={0.95} roughness={0.18} /></mesh>
    <mesh position={[-0.008, -0.002, 0]} scale={[0.022, 0.006, 0.015]} castShadow><sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#e2e5ea" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} /></mesh>
    {load === "crema" && <mesh position={[-0.008, -0.0005, 0]} scale={[0.02, 0.0025, 0.013]}><sphereGeometry args={[1, 20, 10]} /><meshStandardMaterial color="#fffdf7" roughness={0.45} /></mesh>}
    {load === "gel" && <mesh position={[-0.008, 0.0005, 0]} scale={[0.016, 0.004, 0.011]}><sphereGeometry args={[1, 20, 10]} /><meshPhysicalMaterial color="#f0f8ea" roughness={0.02} transmission={0.85} thickness={0.5} ior={1.35} clearcoat={1} transparent opacity={0.9} /></mesh>}
  </group>
);

// sábila en maceta de barro + una hoja cortada a lo largo sobre una tablita (el gel transparente a la vista)
const Aloe: React.FC<{ t: number }> = ({ t }) => {
  const leaves = useMemo(() => Array.from({ length: 11 }, (_, i) => ({ a: i * 2.4 + rnd(i, 1) * 0.5, tilt: 0.25 + rnd(i, 2) * 0.55, L: 0.17 + rnd(i, 3) * 0.12, w: 0.016 + rnd(i, 4) * 0.008 })), []);
  return (
    <group position={PTS.aloe}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow><cylinderGeometry args={[0.07, 0.052, 0.12, 40]} /><meshStandardMaterial map={undefined} color="#b8643c" roughness={0.85} /></mesh>
      <mesh position={[0, 0.123, 0]}><torusGeometry args={[0.07, 0.008, 10, 40]} /><meshStandardMaterial color="#a9572f" roughness={0.85} /></mesh>
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.066, 32]} /><meshStandardMaterial color="#4a3426" roughness={1} /></mesh>
      {leaves.map((l, i) => {
        const sway = Math.sin(t * 0.9 + i) * 0.02;
        return <group key={i} position={[0, 0.115, 0]} rotation={[0, l.a, 0]}>
          <group rotation={[0, 0, -(l.tilt + sway)]}>
            <mesh position={[0, l.L / 2, 0]} scale={[1, 1, 0.45]} castShadow><coneGeometry args={[l.w, l.L, 8]} /><meshStandardMaterial color={i % 3 ? "#6c9a52" : "#5d8a48"} roughness={0.45} /></mesh>
            {[0.25, 0.45, 0.65].map((s, k) => <mesh key={k} position={[l.w * (1 - s) * 0.95, l.L * s, 0]} rotation={[0, 0, -0.9]}><coneGeometry args={[0.0018, 0.008, 4]} /><meshStandardMaterial color="#d8e6b8" roughness={0.6} /></mesh>)}
          </group>
        </group>;
      })}
      {/* la hoja cortada sobre la tablita */}
      <group position={[-0.1, 0, 0.17]} rotation={[0, 0.5, 0]}>
        <Box p={[0, 0.006, 0]} s={[0.2, 0.012, 0.09]} c="#c9ae88" r={0.8} rad={0.004} />
        <mesh position={[0, 0.019, 0]} scale={[0.085, 0.008, 0.022]} castShadow><sphereGeometry args={[1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#5f8f4a" roughness={0.5} /></mesh>
        <mesh position={[0, 0.0195, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.08, 0.018, 1]}><circleGeometry args={[1, 32]} /><meshPhysicalMaterial color="#eef6e0" roughness={0.03} transmission={0.7} thickness={0.3} clearcoat={1} transparent opacity={0.9} /></mesh>
      </group>
    </group>
  );
};

// el frasquito con la mezcla para la semana (aparece en "guárdela en un frasquito")
const Jar: React.FC<{ k: number; label: THREE.Texture }> = ({ k, label }) => k <= 0.01 ? null : (
  <group position={PTS.jar} scale={[1, Math.max(0.001, k), 1]}>
    <mesh position={[0, 0.032, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.064, 40, 1, true]} /><meshPhysicalMaterial color="#f4fbff" roughness={0.04} transmission={0.9} thickness={0.004} transparent opacity={0.45} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.028, 0.028, 0.05, 40]} /><meshStandardMaterial color="#fffdf8" roughness={0.6} /></mesh>
    <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.032, 0.032, 0.012, 40]} /><meshStandardMaterial color="#b9894a" metalness={0.6} roughness={0.35} /></mesh>
    <mesh position={[0, 0.032, 0]}><cylinderGeometry args={[0.0305, 0.0305, 0.022, 40, 1, true, -0.9, 1.8]} /><meshStandardMaterial map={label} roughness={0.8} side={THREE.DoubleSide} /></mesh>
  </group>
);

// ---------------- EL CORTE DE PIEL ----------------
// st: age (0 joven → 1 madura: menos colágeno, menos grasa) · agua (gotitas adentro) · dry (tierra seca arriba) ·
// tapa (capa de crema arriba, 0..1) + gruesa (fina → gruesa) · entra/escape (gotitas que caen / que se van) · polvo
type SkinSt = { age: number; agua: number; dry: number; tapa: number; gruesa: number; entra: number; escape: number };
const SX = 1.7, SZ = 0.82, YE = 0.86, YD = 0.46, YT = 0.95;   // ancho, fondo, techo de dermis, techo de grasa, superficie
const Skin: React.FC<{ st: SkinSt; t: number; tx: ReturnType<typeof useTex> }> = ({ st, t, tx }) => {
  const front = SZ / 2;
  const fibers = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const y = YD + 0.03 + rnd(i, 1) * (YE - YD - 0.06), x0 = -SX / 2 + 0.03, pts: V[] = [];
    for (let s = 0; s <= 12; s++) pts.push([x0 + s * (SX - 0.06) / 12, y + Math.sin(s * 1.1 + i) * 0.03 + (rnd(i * 13 + s, 2) - 0.5) * 0.02, front + 0.004 + rnd(i * 13 + s, 3) * 0.01]);
    return { pts, keep: rnd(i, 4) };
  }), []);
  const fats = useMemo(() => Array.from({ length: 34 }, (_, i) => ({ p: [-SX / 2 + 0.08 + (i % 12) * 0.14 + (Math.floor(i / 12) % 2) * 0.07, 0.07 + Math.floor(i / 12) * 0.13, front - 0.01] as V, r: 0.055 + rnd(i, 5) * 0.02 })), []);
  const drops = useMemo(() => Array.from({ length: 46 }, (_, i) => ({ p: [-SX / 2 + 0.06 + rnd(i, 6) * (SX - 0.12), YE - 0.02 + rnd(i, 7) * (YT - YE - 0.0) - (i % 3 === 0 ? 0.18 * rnd(i, 8) : 0), front + 0.012] as V, k: rnd(i, 9) })), []);
  const age = st.age, dryK = st.dry;
  const tapaH = st.tapa * lerp(0.022, 0.085, st.gruesa);
  return (
    <group position={SK}>
      {/* grasa */}
      <mesh position={[0, YD / 2, 0]} receiveShadow castShadow geometry={rbox(SX, YD, SZ, 0.01)}><meshStandardMaterial map={tx.fatSide} color="#ffffff" roughness={0.6} /></mesh>
      {fats.map((f, i) => <mesh key={i} position={f.p} scale={f.r * (1 - 0.3 * age)}><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#f5d27a" roughness={0.25} clearcoat={0.6} /></mesh>)}
      {/* dermis + colágeno (las fibras se van perdiendo con la edad) */}
      <mesh position={[0, (YD + YE) / 2, 0]} receiveShadow castShadow geometry={rbox(SX, YE - YD, SZ, 0.008)}><meshStandardMaterial map={tx.derm} roughness={0.7} /></mesh>
      {fibers.map((f, i) => <Tube key={i} pts={f.pts} r={0.007} col={i % 2 ? "#fff3ea" : "#f7e2d4"} seg={36} rough={0.35} op={cl((f.keep - age * 0.62) * 6)} />)}
      {/* epidermis */}
      <mesh position={[0, (YE + YT) / 2, 0]} castShadow receiveShadow><boxGeometry args={[SX, YT - YE, SZ]} /><meshStandardMaterial map={tx.epiSide} roughness={0.6} /></mesh>
      {/* la superficie: lisa ↔ tierra seca */}
      <mesh position={[0, YT + 0.0012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[SX, SZ]} /><meshStandardMaterial map={tx.skinSmooth} bumpMap={tx.skinBumpS} bumpScale={1.2} roughness={0.55} /></mesh>
      {dryK > 0.01 && <mesh position={[0, YT + 0.0022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[SX, SZ]} /><meshStandardMaterial map={tx.skinDry} bumpMap={tx.skinBumpD} bumpScale={3} roughness={0.9} transparent opacity={dryK} /></mesh>}
      {/* el agua adentro: gotitas en la cara cortada (cuántas = st.agua), con un latido suave */}
      {drops.map((d, i) => { const on = cl((st.agua - d.k) * 8); return <Drop key={i} p={[d.p[0], d.p[1] + Math.sin(t * 1.3 + i) * 0.003, d.p[2]]} r={0.016 * on * (0.75 + 0.5 * rnd(i, 10))} o={on} />; })}
      {/* gotitas que entran desde arriba (el gel) */}
      {st.entra > 0.01 && Array.from({ length: 16 }, (_, i) => { const ph = (t * 0.55 + rnd(i, 11)) % 1, x = -SX / 2 + 0.1 + rnd(i, 12) * (SX - 0.2), z = -SZ / 2 + 0.1 + rnd(i, 13) * (SZ - 0.2); return <Drop key={"e" + i} p={[x, YT + 0.5 - ph * 0.55, z]} r={0.018 * st.entra} o={Math.sin(ph * Math.PI) * st.entra} />; })}
      {/* gotitas que se escapan hacia arriba (sin tapa): suben y se desvanecen */}
      {st.escape > 0.01 && Array.from({ length: 18 }, (_, i) => { const ph = (t * 0.42 + rnd(i, 14)) % 1, x = -SX / 2 + 0.1 + rnd(i, 15) * (SX - 0.2), z = -SZ / 2 + 0.1 + rnd(i, 16) * (SZ - 0.2); return <Drop key={"s" + i} p={[x + Math.sin(ph * 6 + i) * 0.02, YT + 0.02 + ph * 0.6, z]} r={0.014 * (1 - ph * 0.6) * st.escape} o={(1 - ph) * st.escape} />; })}
      {/* la TAPA: capa de crema arriba (fina y pareja con la mezcla; gruesa, blanca y despareja cuando se pone de más) */}
      {tapaH > 0.001 && <mesh position={[0, YT + tapaH / 2 + 0.002, 0]} castShadow geometry={rbox(SX - 0.01, tapaH, SZ - 0.01, Math.min(0.012, tapaH / 2.2))}>
        <meshPhysicalMaterial color={st.gruesa > 0.5 ? "#fffdf8" : "#fbf4ea"} roughness={lerp(0.3, 0.5, st.gruesa)} clearcoat={0.5} transparent opacity={lerp(0.78, 0.97, st.gruesa) * cl(st.tapa * 3)} /></mesh>}
    </group>
  );
};
// estados del corte de piel según la frase (segmentos clavados a la voz; entre visitas no se ve)
const skinAt = (t: number): SkinSt => {
  const S = (age: number, agua: number, dry: number, tapa = 0, gruesa = 0, entra = 0, escape = 0): SkinSt => ({ age, agua, dry, tapa, gruesa, entra, escape });
  const w = win;
  // la prueba del pellizco: piel con poca agua y más fina
  if (t < 200) return S(1, 0.22, 0.8);
  // Doña Rosario: una capa gruesa, blanca, sobre la cara seca
  if (t < 265) return S(1, 0.15, 1, w(t, EV.gruesa, EV.gruesa + 1.2), 1);
  // "funciona como una tapa": la piel con agua y la tapa que no la deja escapar
  if (t < 279) return S(0.25, 0.95, 0, w(t, EV.tapa + 1.2, EV.tapa + 2.6), 0.35, 0, 1 - w(t, EV.tapa + 1.2, EV.tapa + 2.4));
  // ¿y a los 60, a los 70? menos grasa, menos esponjitas de agua
  if (t < 296) return S(w(t, EV.edad + 0.5, EV.grasa + 1.5), 1 - 0.8 * w(t, EV.grasa + 1.5, EV.esponjas + 1.5), 0);
  // tierra seca: el agua entra y se va; encima la capa gruesa sin agua para guardar
  if (t < 312) return S(1, 0.12, 1, w(t, EV.ponia + 0.4, EV.ponia + 1.6), 1, t < EV.ponia ? 1 : 0, t < EV.ponia + 0.6 ? 1 : 0);
  // dos cosas: agua que entre y una tapa que no la deje salir
  if (t < 330) return S(1, 0.12 + 0.88 * w(t, EV.aguaEntre, EV.aguaEntre + 1.4), 1 - 0.5 * w(t, EV.aguaEntre, EV.aguaEntre + 1.4), w(t, EV.tapaSalir + 0.2, EV.tapaSalir + 1.2), 0.15, t > EV.aguaEntre - 0.3 && t < EV.tapaSalir + 0.4 ? 1 : 0, 0);
  // el gel solo se evapora · la crema sola tapa la sequedad · juntas: agua + tapa
  if (t < 390) {
    if (t < EV.cremaSola) return S(1, 0.15 + 0.6 * w(t, EV.gelSolo + 0.3, EV.gelSolo + 1.4) * (1 - w(t, EV.evapora, EV.evapora + 1.6)), 1, 0, 0, t < EV.evapora ? 1 : 0, t > EV.evapora - 0.2 ? 1 : 0);
    if (t < EV.juntas) return S(1, 0.12, 1, w(t, EV.cremaSola + 0.3, EV.cremaSola + 1.3), 1);
    return S(1, 0.12 + 0.88 * w(t, EV.pone, EV.pone + 1.1), 1 - 0.6 * w(t, EV.pone, EV.pone + 1.1), w(t, EV.laTapa, EV.laTapa + 0.9), 0.15, t < EV.laTapa + 0.3 ? 1 : 0, 0);
  }
  // el minuto justo: piel mojada, el agua empieza a irse, la mezcla la tapa
  if (t < 535) return S(1, 0.95 - 0.25 * w(t, EV.seEvapore, EV.sePone), 0.3, w(t, EV.sePone, EV.sePone + 1.2), 0.15, 0, 1 - w(t, EV.sePone, EV.sePone + 1));
  // error 1: la tapa sobre la tierra seca
  if (t < 700) return S(1, 0.12, 1, w(t, EV.tierra2 + 0.3, EV.tierra2 + 1.4), 1);
  // dos o tres semanas: las rayitas de sequedad se suavizan
  return S(1, 0.9, 1 - w(t, EV.suavizan - 1.4, EV.suavizan + 0.4), 0.6, 0.1);
};

// ---------------- EL VASO: agua y aceite que se vuelven gotitas (agua en aceite) ----------------
const Vaso: React.FC<{ k: number; t: number }> = ({ k, t }) => {
  const R = 0.11, Hh = 0.26;
  const dr = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ a: rnd(i, 1) * 6.3, r: Math.sqrt(rnd(i, 2)) * (R - 0.02), y: 0.03 + rnd(i, 3) * (Hh * 0.7), s: 0.008 + rnd(i, 4) * 0.01 })), []);
  const kk = ease(k);
  return (
    <group position={[PTS.vaso[0], 0.8, PTS.vaso[2]]}>
      <Box p={[0, -0.02, 0]} s={[0.7, 0.04, 0.5]} c="#efe7da" r={0.4} rad={0.01} />
      <mesh position={[0, Hh / 2, 0]} castShadow><cylinderGeometry args={[R, R, Hh, 64, 1, true]} /><meshPhysicalMaterial color="#f4fbff" roughness={0.03} transmission={0.92} thickness={0.004} transparent opacity={0.4} side={THREE.DoubleSide} clearcoat={1} /></mesh>
      {/* separados: agua abajo, aceite amarillo arriba */}
      <mesh position={[0, Hh * 0.22, 0]}><cylinderGeometry args={[R - 0.004, R - 0.004, Hh * 0.42, 64]} /><meshPhysicalMaterial color="#9fd3f5" roughness={0.05} transmission={0.7} transparent opacity={0.7 * (1 - kk)} /></mesh>
      <mesh position={[0, Hh * 0.55, 0]}><cylinderGeometry args={[R - 0.004, R - 0.004, Hh * 0.24, 64]} /><meshPhysicalMaterial color="#e8c35a" roughness={0.08} transmission={0.4} transparent opacity={0.85 * (1 - kk)} /></mesh>
      {/* juntos: la grasa manda (todo color crema) y el agua queda escondida en gotitas */}
      {kk > 0.01 && <mesh position={[0, Hh * 0.38, 0]}><cylinderGeometry args={[R - 0.004, R - 0.004, Hh * 0.74, 64]} /><meshPhysicalMaterial color="#f3e2b0" roughness={0.3} transmission={0.25} thickness={1} transparent opacity={0.6 * kk} /></mesh>}
      {kk > 0.01 && dr.map((d, i) => <Drop key={i} p={[Math.cos(d.a + t * 0.05) * d.r, d.y + Math.sin(t + i) * 0.002, Math.sin(d.a + t * 0.05) * d.r]} r={d.s * kk} o={kk} />)}
    </group>
  );
};

// ---------------- LAS CADENAS de azúcares de la sábila con agua atrapada; la sueltan despacio sobre la piel ----------------
const Cadenas: React.FC<{ suelta: number; t: number }> = ({ suelta, t }) => {
  const C = PTS.cadenas;
  const chains = useMemo(() => Array.from({ length: 6 }, (_, c) => Array.from({ length: 16 }, (_, s) => [C[0] - 0.42 + s * 0.056, C[1] + 0.05 + (c - 2.5) * 0.06 + Math.sin(s * 0.9 + c) * 0.025, C[2] + (rnd(c, 1) - 0.5) * 0.25 + Math.cos(s * 0.7 + c) * 0.03] as V)), []);
  return (
    <group>
      <mesh position={[C[0], 0.74, C[2]]} receiveShadow geometry={rbox(1.2, 0.14, 0.6, 0.01)}><meshStandardMaterial color="#eab49b" roughness={0.55} /></mesh>
      {chains.map((ch, c) => <group key={c}>
        <Tube pts={ch.map((q) => [q[0], q[1] + Math.sin(t * 0.6 + c) * 0.006, q[2]] as V)} r={0.005} col="#cfe0b0" seg={60} rough={0.4} />
        {ch.map((q, s) => <mesh key={s} position={[q[0], q[1] + Math.sin(t * 0.6 + c) * 0.006, q[2]]} scale={0.014}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#e6efd2" roughness={0.35} /></mesh>)}
        {/* el agua atrapada entre los eslabones: con st.suelta va bajando y se apoya en la piel */}
        {ch.filter((_, s) => s % 2 === 1).map((q, s) => { const k = cl((suelta - rnd(c * 9 + s, 2) * 0.7) * 3), y = lerp(q[1] - 0.02, 0.82, ease(k)); return <Drop key={"w" + s} p={[q[0] + 0.01, y, q[2] + 0.01]} r={0.013} o={1 - 0.4 * k} />; })}
      </group>)}
    </group>
  );
};

// el resto del ambiente
const Dome: React.FC<{ tex: THREE.Texture; p: V; r: number }> = ({ tex, p, r }) => <mesh position={p}><sphereGeometry args={[r, 48, 24]} /><meshBasicMaterial map={tex} side={THREE.BackSide} toneMapped={false} /></mesh>;

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const pg = useImgTex(["pg_cover", "pg_inside", "pg_085", "pg_086", "pg_043", "pg_044"]);
  // el recetario: cerrado → se abre (pág. 85) → pasa a la 43; en el truco del dorso, abierto en la 85; al final, abierto
  let open = 0, flip = 0;
  if (t < 200) { open = win(t, EV.libro + 0.3, EV.libro + 1.4); flip = cl((t - EV.p43 - 0.2) / 0.7); }
  else if (t < 800) { open = 1; flip = 0; }
  else { open = win(t, EV.r67 + 0.3, EV.r67 + 1.4); flip = 0; }
  const right = flip > 0 ? pg.pg_043 : pg.pg_085;
  // el cuenco: antes de la receta está la mezcla hecha; en la receta: vacío → crema → gel → grumitos → nata; demasiado gel = gotitas
  let bowl: BowlSt = { crema: 1, gel: 1, mix: 1, drops: 0 };
  if (t > EV.receta - 1 && t < 448) bowl = { crema: win(t, EV.ponga + 0.6, EV.ponga + 1.2), gel: win(t, EV.agregue + 0.5, EV.agregue + 1.1), mix: cl((t - EV.mezcle) / (EV.nata + 0.6 - EV.mezcle)) * (t < EV.grumos ? 0.4 : 1), drops: 0 };
  if (t > EV.grumos - 0.5 && t < 448) bowl.mix = lerp(0.42, 1, cl((t - EV.grumos) / (EV.nata + 0.6 - EV.grumos)));
  // la cucharita: con crema al ras → con gel → mezclando en círculos → apoyada
  const B = PTS.bowl, Tn = PTS.tin;
  let sp: { p: V; rot: V; load: "none" | "crema" | "gel" } = { p: [B[0] + 0.12, CY + 0.004, B[2] + 0.07], rot: [0, 0.5, 0], load: "none" };
  if (t > EV.cuchCrema && t < EV.media) sp = { p: [Tn[0] + 0.02, CY + 0.07, Tn[2] + 0.01], rot: [0, -0.3, 0.12], load: "crema" };
  else if (t > EV.media && t < EV.ponga + 0.6) sp = { p: [B[0] + 0.05, CY + 0.08, B[2] + 0.05], rot: [0, -0.8, 0.1], load: "gel" };
  else if (t > EV.mezcle - 0.3 && t < EV.nata + 1.5) { const a = (t - EV.mezcle) * 4.2; sp = { p: [B[0] + Math.cos(a) * 0.012, CY + 0.075, B[2] + Math.sin(a) * 0.012], rot: [0, -a, 1.25], load: "none" }; }
  else if (t < 30) sp = { p: [B[0] + 0.04, CY + 0.08, B[2] + 0.06], rot: [0, -0.8, 0.1], load: "gel" };   // el gancho: "una cucharadita de gel transparente"
  else if (t > 328 && t < 336) sp = { p: [B[0] + 0.04, CY + 0.08, B[2] + 0.06], rot: [0, -0.8, 0.1], load: "gel" };
  const jar = win(t, EV.frasco + 0.2, EV.frasco + 0.8);
  const dent = t > 30 ? 1 : 0;
  const skin = skinAt(t);
  const vasoK = t < 240 ? win(t, EV.separaran, EV.separaran + 1.6) : 1;
  const suelta = win(t, EV.retienen + 0.2, EV.retienen + 5);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Warm tex={Object.values(pg)} />
      <Post bloom={0.18} threshold={0.95} exposure={0.8} env={0.3} />
      <color attach="background" args={["#d8c5ab"]} />
      <hemisphereLight args={[0xfff1de, 0x9c8468, 0.42]} />
      {/* la ventana a la derecha: luz de mañana */}
      <directionalLight position={[3.2, 2.6, 0.8]} intensity={2.9} color="#ffe9c8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={2} shadow-camera-bottom={-2} shadow-bias={-0.0003} />
      <pointLight position={[0.0, 1.6, 0.9]} intensity={0.6} distance={4} color="#fff4e0" />

      {/* ===== EL TOCADOR ===== */}
      <mesh position={[0, 1.2, -0.36]} receiveShadow><planeGeometry args={[4, 2.4]} /><meshStandardMaterial map={tx.tile} roughness={0.35} /></mesh>
      <mesh position={[1.2, 1.2, 0.6]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[2, 2.4]} /><meshStandardMaterial map={tx.tile} roughness={0.35} /></mesh>
      <mesh position={[-1.4, 1.2, 0.6]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[2, 2.4]} /><meshStandardMaterial color="#efe3cf" roughness={0.8} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 6]} /><meshStandardMaterial map={tx.wood} roughness={0.8} /></mesh>
      {/* la ventana (vista al patio) en la pared de la derecha */}
      <group position={[1.19, 1.38, 0.15]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh><planeGeometry args={[0.7, 0.62]} /><meshBasicMaterial map={tx.garden} toneMapped={false} /></mesh>
        {[[0, 0.32, 0.74, 0.04], [0, -0.32, 0.74, 0.04], [0.36, 0, 0.04, 0.66], [-0.36, 0, 0.04, 0.66], [0, 0, 0.025, 0.62], [0, 0, 0.7, 0.025]].map(([x, y, w, h], i) => <Box key={i} p={[x, y, 0.012]} s={[w, h, 0.03]} c="#f7f2ea" r={0.5} rad={0.005} />)}
      </group>
      {/* el espejo redondo */}
      <group position={PTS.mirror}>
        <mesh position={[0, 0, 0.012]}><circleGeometry args={[0.3, 64]} /><meshStandardMaterial color="#cfd6da" metalness={1} roughness={0.06} /></mesh>
        <mesh position={[0, 0, 0.01]}><torusGeometry args={[0.305, 0.016, 12, 64]} /><meshStandardMaterial color="#b9894a" metalness={0.75} roughness={0.3} /></mesh>
      </group>
      {/* la mesada de mármol y el mueble */}
      <mesh position={[0, CY - 0.025, -0.03]} castShadow receiveShadow geometry={rbox(2.3, 0.05, 0.66, 0.012)}><meshStandardMaterial map={tx.marble} roughness={0.22} /></mesh>
      <mesh position={[0, (CY - 0.05) / 2, -0.06]} receiveShadow geometry={rbox(2.24, CY - 0.05, 0.58, 0.01)}><meshStandardMaterial color="#efe6d6" roughness={0.6} /></mesh>
      {[-0.56, 0, 0.56].map((x, i) => <Box key={i} p={[x, CY - 0.36, 0.235]} s={[0.012, 0.5, 0.012]} c="#b9894a" m={0.7} r={0.3} rad={0.004} />)}
      {/* toalla doblada y un florero */}
      <group position={PTS.towel}>
        <Box p={[0, 0.02, 0]} s={[0.22, 0.04, 0.16]} c="#ffffff" map={tx.towel} r={0.95} rad={0.016} />
        <Box p={[0, 0.058, 0]} s={[0.21, 0.036, 0.155]} c="#ffffff" map={tx.towel} r={0.95} rad={0.016} />
      </group>
      <group position={[-1.0, CY, -0.18]}>
        <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.04, 0.05, 0.16, 32]} /><meshPhysicalMaterial color="#f4fbff" roughness={0.03} transmission={0.9} transparent opacity={0.5} /></mesh>
        {Array.from({ length: 7 }, (_, i) => <group key={i}><Tube pts={[[0, 0.05, 0], [Math.cos(i) * 0.03, 0.2, Math.sin(i) * 0.03], [Math.cos(i) * 0.07, 0.3 + rnd(i, 1) * 0.06, Math.sin(i) * 0.07]]} r={0.003} col="#5d7a3e" seg={10} />
          <mesh position={[Math.cos(i) * 0.07, 0.31 + rnd(i, 1) * 0.06, Math.sin(i) * 0.07]} scale={0.026}><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#fbf7ef" roughness={0.7} /></mesh></group>)}
      </group>
      <Tin dent={dent} />
      <Bowl st={bowl} t={t} />
      <Spoon {...sp} />
      <Aloe t={t} />
      <Jar k={jar} label={tx.label} />
      <Book p={PTS.book} open={open} cover={pg.pg_cover} inside={pg.pg_inside_r} right={right} spine="#7a5a32" flips={[{ k: flip, tex: [pg.pg_085, pg.pg_044] }]} />

      {/* ===== EL CORTE DE PIEL, EL VASO Y LAS CADENAS (estudio crema) ===== */}
      <Dome tex={tx.studio} p={[10, 1, -1]} r={7} />
      <directionalLight position={[13, 4, 4]} intensity={1.6} color="#fff1dc" />
      <pointLight position={[9, 2.2, 2.2]} intensity={2.2} distance={8} color="#fff4e8" />
      <mesh position={[10, -0.002, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[6.8, 64]} /><meshStandardMaterial color="#ead8c2" roughness={0.9} /></mesh>
      <Skin st={skin} t={t} tx={tx} />
      <Vaso k={vasoK} t={t} />
      <Cadenas suelta={suelta} t={t} />
    </ThreeCanvas>
  );
};
