// cuca01 · EL MUNDO: la cocina de adobe de Cuca, abierta al patio (como la foto del avatar): el fogón encalado con lumbre de
// encino y el comal negro encima, ollas y comales colgados en la pared, la mesa con metate y molcajete, el limonero del patio,
// la barda de adobe y, del otro lado, la casa de Chayo con su humo. UNA escena y UNA cámara para todo el video:
// la cámara vuela del comal al fogón, a la puerta, al patio y a la barda; todo clavado a la VOZ con at("frase").
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { at, atE } from "./lib";
import { estado, KEYS2 } from "./plan";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- puntos del mundo (para portales y rótulos HTML) ----------------
export const PT = {
  comal: [0.75, 0.94, -1.7] as V3,
  fuego: [0.75, 0.36, -1.18] as V3,     // boca del fogón (portal a la cocina del espectador)
  olla: [-0.25, 1.18, -1.75] as V3,
  clavo: [-3.42, 1.72, 0.95] as V3,     // el comal de la mamá, colgado junto a la puerta
  puerta: [-3.45, 1.1, -0.1] as V3,
  mesa: [-2.0, 0.8, -0.4] as V3,
  barda: [10, 1.4, 1.6] as V3,
  chayo: [15.5, 2.2, 0.5] as V3,
  limon: [5.6, 2.4, 6.2] as V3,
};

// ---------------- tiempos (todos de la voz) ----------------
export const T = {
  mire: at("mire nomas este comal"),
  nieto: at("tiene mas anos que mi nieto"),
  jabon: at("una gota de jabon"),
  venga: at("venga acerquese al fogon"),
  usted: at("usted puso la tortilla"),
  oigame: at("pues oigame bien"),
  mejor: at("o mejor dicho"),
  recetario: at("ningun recetario"),
  abuela: at("mirando a la abuela"),
  lumbre: at("junto a la lumbre"),
  escribio: at("nadie lo escribio nunca"),
  yosi: at("yo si se lo voy a decir"),
  cura: at("como se cura"),
  calienta: at("como se calienta"),
  tatema: at("que se tatema"),
  ceniza: at("como se limpia con ceniza"),
  guarda: at("como se guarda"),
  peso: at("ni uno le va a costar"),
  primero: at("y el primero se lo advierto"),
  refugio: at("refugio mendoza"),
  comadre: at("soy comadre y vecina"),
  barda: at("a una barda de distancia"),
  pasado: at("nos hemos pasado tortillas"),
  anos40: at("por mas de 40 anos"),
  adobe: at("en esta cocina de adobe"),
  lena: at("con lena"),
  barro: at("con barro"),
  paciencia: at("y con paciencia"),
  acuerdo: at("todavia me acuerdo de su comal"),
  negro: at("negro de tanto uso"),
  clavo: at("colgado de un clavo"),
  rapidito: at("rapidito antes de seguir"),
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const C = PT.comal;
export const KEYS: Key[] = [
  // A · "Mire nomás este comal": el portal se abre desde el comal del avatar → encima del comal, de costado
  { t: T.mire - 0.2, p: [1.55, 1.32, -0.95], l: [0.78, 0.93, -1.68], fov: 36 },
  // "tiene más años que mi nieto": órbita lenta por delante del fogón
  { t: T.nieto + 0.3, p: [0.95, 1.42, -0.62], l: [0.74, 0.93, -1.7], fov: 36 },
  // "ni una gota de jabón": baja casi al ras del comal
  { t: T.jabon + 1.6, p: [0.15, 1.1, -0.95], l: [0.78, 0.94, -1.72], fov: 33 },
  // B · "Venga, acérquese al fogón" (avatar) → la cámara vuelve frente a la boca del fogón y se mete en la lumbre
  { t: T.venga + 2.7, p: [0.75, 0.7, 0.75], l: [0.75, 0.38, -1.3], fov: 42 },
  { t: T.usted + 0.4, p: [0.75, 0.42, -0.62], l: [0.75, 0.33, -1.35], fov: 32 },
  // E · "o mejor dicho, nadie le enseñó": la cocina entera, la mesa con el recetario
  { t: T.mejor - 0.1, p: [1.8, 1.75, 1.9], l: [-1.4, 0.85, -0.9], fov: 44 },
  { t: T.recetario + 0.6, p: [0.6, 1.6, 1.4], l: [-1.8, 0.85, -0.6], fov: 40 },
  // "mirando a la abuela, parada junto a la lumbre": vuelve al fogón, el humo sube
  { t: T.abuela + 0.2, p: [0.9, 1.25, 0.55], l: [0.7, 0.85, -1.6], fov: 40, arc: 0.12 },
  { t: T.lumbre + 0.6, p: [0.8, 1.12, -0.25], l: [0.72, 0.9, -1.65], fov: 36 },
  { t: T.escribio + 1.5, p: [0.8, 1.15, -0.3], l: [0.72, 0.92, -1.65], fov: 36 },
  // G · "Cómo se cura, cómo se calienta, qué se tatema, ceniza": órbita alrededor del comal
  { t: T.cura - 0.1, p: [1.75, 1.45, -0.75], l: [0.76, 0.93, -1.7], fov: 34 },
  { t: T.tatema + 0.2, p: [0.75, 1.62, -0.55], l: [0.75, 0.94, -1.68], fov: 32 },
  { t: T.ceniza + 1.2, p: [-0.15, 1.45, -0.75], l: [0.74, 0.93, -1.7], fov: 33 },
  // "cómo se guarda": la cámara gira hacia la pared de la puerta, el comal colgado
  { t: T.guarda + 1.4, p: [-1.4, 1.7, 0.75], l: [-3.42, 1.65, 0.95], fov: 36, arc: 0.1 },
  { t: T.primero - 0.2, p: [-1.7, 1.68, 0.9], l: [-3.42, 1.65, 0.95], fov: 34 },
  // I · "Refugio Mendoza…": desde adentro de la cocina, mirando al patio abierto
  { t: T.refugio - 0.6, p: [-0.4, 1.55, -0.6], l: [5.5, 1.4, 2.5], fov: 46 },
  // "comadre y vecina de Chayo": sale volando por el costado abierto (por debajo del alero) y sube sobre el patio
  { t: T.refugio + 3.2, p: [2.6, 1.6, 1.0], l: [12.0, 1.6, 1.2], fov: 46 },
  { t: T.comadre + 0.6, p: [4.6, 2.3, 2.2], l: [14.5, 1.8, 0.8], fov: 44 },
  { t: T.comadre + 4.6, p: [6.6, 2.5, 2.6], l: [15.0, 1.8, 0.6], fov: 40 },
  // "a una barda de distancia": baja hacia la barda
  { t: T.barda + 1.2, p: [8.1, 1.75, 3.6], l: [10.0, 1.2, 1.4], fov: 40 },
  { t: T.pasado + 0.5, p: [8.6, 1.6, 2.6], l: [10.0, 1.3, 1.5], fov: 34 },
  // K · "con leña, con barro y con paciencia" (toma de Cuca) → la cámara viaja a la puerta: el comal de la mamá
  { t: T.acuerdo - 0.3, p: [-1.2, 1.75, 1.7], l: [-3.4, 1.55, 0.6], fov: 42 },
  { t: T.negro + 0.6, p: [-2.1, 1.72, 1.45], l: [-3.42, 1.68, 0.95], fov: 34 },
  { t: T.clavo + 1.6, p: [-1.9, 1.7, 1.45], l: [-3.42, 1.68, 0.95], fov: 38 },
  { t: T.rapidito + 1.5, p: [-1.95, 1.7, 1.42], l: [-3.42, 1.68, 0.95], fov: 38 },
  ...KEYS2,
].sort((a, b) => a.t - b.t);
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de cámara en mano (muy leve): nunca queda congelada
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
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

// ---------------- texturas procedurales del rancho ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: (i: number) => string, sz = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = col(i); g.fillRect(rnd(i, 2) * w, rnd(i, 3) * h, sz, sz); } };
const useRancho = () => useMemo(() => ({
  // adobe: ladrillos de lodo grandes, juntas hundidas, enjarre caído en partes
  adobe: mk(512, 512, (g) => {
    g.fillStyle = "#7d5a3f"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) {
      const off = (r % 2) * 85, i = r * 3 + c, v = rnd(i, 1);
      g.fillStyle = `rgb(${128 + v * 26},${92 + v * 20},${62 + v * 14})`;
      for (const dx of [-170, 0]) g.fillRect(c * 170 + off + dx + 4, r * 64 + 4, 162, 56);
    }
    noise(g, 512, 512, 5000, (i) => `rgba(${60 + rnd(i, 4) * 80},${40 + rnd(i, 4) * 50},${25 + rnd(i, 4) * 30},.35)`, 2);
    for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(210,190,150,${0.12 * rnd(i, 7)})`; g.lineWidth = 1; g.beginPath(); const x = rnd(i, 8) * 512, y = rnd(i, 9) * 512; g.moveTo(x, y); g.lineTo(x + 8 + rnd(i, 10) * 14, y + 1); g.stroke(); }
    // parches de enjarre claro
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(196,170,132,${0.35 + 0.3 * rnd(i, 11)})`; g.beginPath(); g.ellipse(rnd(i, 12) * 512, rnd(i, 13) * 512, 40 + rnd(i, 14) * 70, 30 + rnd(i, 15) * 50, rnd(i, 16), 0, 6.3); g.fill(); }
  }, [2, 1]),
  // cal: encalado del fogón, ahumado arriba y gastado en la orilla
  cal: mk(512, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#9d9488"); gr.addColorStop(0.35, "#d9d3c6"); gr.addColorStop(1, "#cfc7b6");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 6000, (i) => `rgba(${120 + rnd(i, 4) * 100},${110 + rnd(i, 4) * 95},${95 + rnd(i, 4) * 90},.3)`, 3);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(40,30,25,${0.06 + 0.1 * rnd(i, 5)})`; g.beginPath(); g.ellipse(rnd(i, 6) * 512, rnd(i, 7) * 200, 30 + rnd(i, 8) * 60, 14 + rnd(i, 9) * 30, 0, 0, 6.3); g.fill(); }
    for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(150,105,70,${0.06 + 0.08 * rnd(i, 10)})`; g.beginPath(); g.ellipse(rnd(i, 11) * 512, 300 + rnd(i, 12) * 212, 20 + rnd(i, 13) * 40, 10 + rnd(i, 14) * 22, 0, 0, 6.3); g.fill(); }
  }),
  // piso de tierra apisonada
  tierra: mk(512, 512, (g) => {
    g.fillStyle = "#7a5f45"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 9000, (i) => `rgba(${90 + rnd(i, 4) * 90},${70 + rnd(i, 4) * 70},${50 + rnd(i, 4) * 50},.45)`, 2);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${150 + rnd(i, 5) * 60},${140 + rnd(i, 5) * 50},${120 + rnd(i, 5) * 40},.6)`; g.beginPath(); g.arc(rnd(i, 6) * 512, rnd(i, 7) * 512, 1.5 + rnd(i, 8) * 3.5, 0, 6.3); g.fill(); }
  }, [6, 6]),
  madera: mk(256, 256, (g) => {
    g.fillStyle = "#6b4a30"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(40,25,12,${0.12 + rnd(k, 2) * 0.2})`; g.lineWidth = 1 + rnd(k, 3) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(80, y + 4 * rnd(k, 4), 170, y - 4, 256, y + 2); g.stroke(); }
  }, [1, 1]),
  teja: mk(256, 256, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = rnd(r * 8 + c, 1); g.fillStyle = `rgb(${150 + v * 50},${70 + v * 25},${45 + v * 15})`; g.fillRect(c * 32, r * 32, 32, 32); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(c * 32, r * 32 + 28, 32, 4); g.fillStyle = "rgba(255,220,180,.12)"; g.fillRect(c * 32 + 6, r * 32, 6, 28); }
  }, [4, 3]),
  rebozo: mk(128, 128, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#c0392b"; g.lineWidth = 3; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(64, 64, 12 + k * 9, 0, 6.3); g.stroke(); } g.fillStyle = "#2e86c1"; for (let k = 0; k < 8; k++) { g.beginPath(); g.arc(64 + Math.cos(k) * 50, 64 + Math.sin(k) * 50, 5, 0, 6.3); g.fill(); } }),
  glow: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  humo: mk(128, 128, (g) => { for (let i = 0; i < 26; i++) { const x = 30 + rnd(i, 2) * 68, y = 30 + rnd(i, 3) * 68, r = 14 + rnd(i, 4) * 26; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(255,255,255,.22)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } }),
  cielo: mk(16, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#6f9fd6"); gr.addColorStop(0.55, "#bcd3e6"); gr.addColorStop(0.75, "#f2dcc0"); gr.addColorStop(1, "#d9c4a4"); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V3; cast?: boolean; e?: string; ei?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.03, rot, cast = true, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
// olla / jarro de barro (torno)
const ollaGeo = (h: number, r: number, neck = 0.62, lip = 0.7) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) { const y = i / 24; const w = y < 0.75 ? Math.sin(0.25 + y * 2.6) * 0.95 + 0.05 : lerp(neck, lip, (y - 0.75) / 0.25); pts.push(new THREE.Vector2(Math.max(0.05, w) * r, y * h)); }
  return new THREE.LatheGeometry(pts, 32);
};
const Olla: React.FC<{ p: V3; h: number; r: number; c?: string; rot?: V3 }> = ({ p, h, r, c = "#9a4f2c", rot }) => {
  const g = useMemo(() => ollaGeo(h, r), [h, r]);
  return <mesh position={p} rotation={rot} geometry={g} castShadow receiveShadow><meshStandardMaterial color={c} roughness={0.62} metalness={0.02} side={THREE.DoubleSide} /></mesh>;
};
// comal colgado (disco negro con orilla)
const ComalPared: React.FC<{ p: V3; r: number; rot?: V3; c?: string }> = ({ p, r, rot = [0, 0, 0], c = "#1b1714" }) => (
  <group position={p} rotation={rot}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r, r * 0.97, 0.022, 40]} /><meshStandardMaterial color={c} roughness={0.42} metalness={0.05} /></mesh>
    <mesh position={[0, 0, 0.012]}><torusGeometry args={[r * 0.98, 0.012, 6, 40]} /><meshStandardMaterial color="#2a221c" roughness={0.5} /></mesh>
  </group>
);

// lumbre: lenguas de fuego (conos emisivos que titilan) + brasas + luz que respira
const Fuego: React.FC<{ t: number; p: V3; amt?: number; glow?: THREE.Texture }> = ({ t, p, amt = 1, glow }) => {
  const fl = 0.75 + 0.18 * Math.sin(t * 11.3) + 0.12 * Math.sin(t * 17.1 + 1) + 0.08 * Math.sin(t * 29 + 2);
  return (
    <group position={p}>
      {/* leños de encino */}
      {[[-0.18, 0.2], [0.05, -0.15], [0.2, 0.25]].map(([x, ry], i) => (
        <mesh key={i} position={[x, -0.02 + i * 0.03, 0.12]} rotation={[Math.PI / 2 - 0.08, 0, ry]} castShadow><cylinderGeometry args={[0.045, 0.05, 0.75, 9]} /><meshStandardMaterial color="#3b2a1d" roughness={0.95} emissive="#ff5a10" emissiveIntensity={0.12 + 0.1 * fl} /></mesh>
      ))}
      {/* brasas */}
      {Array.from({ length: 22 }, (_, i) => <mesh key={"b" + i} position={[(rnd(i, 1) - 0.5) * 0.5, -0.07, (rnd(i, 2) - 0.5) * 0.35 - 0.05]}><sphereGeometry args={[0.025 + rnd(i, 3) * 0.02, 6, 5]} /><meshBasicMaterial color={new THREE.Color("#7a1a04").lerp(new THREE.Color("#ffb347"), 0.4 + 0.6 * Math.abs(Math.sin(t * (2 + rnd(i, 4) * 3) + i)))} toneMapped={false} /></mesh>)}
      {/* lenguas */}
      {Array.from({ length: 9 }, (_, i) => {
        const ph = t * (5 + rnd(i, 5) * 4) + i * 1.7, hgt = (0.16 + rnd(i, 6) * 0.16) * (0.75 + 0.35 * Math.sin(ph)) * amt;
        return <mesh key={"f" + i} position={[(rnd(i, 7) - 0.5) * 0.42 + 0.02 * Math.sin(ph * 1.3), hgt / 2 - 0.02, (rnd(i, 8) - 0.5) * 0.22]} rotation={[0, ph * 0.3, 0.12 * Math.sin(ph)]}>
          <coneGeometry args={[0.045 + rnd(i, 9) * 0.03, hgt, 7, 1, true]} />
          <meshBasicMaterial color={new THREE.Color("#ff6a12").lerp(new THREE.Color("#ffd27a"), rnd(i, 10))} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>;
      })}
      {glow && <sprite position={[0, 0.08, 0]} scale={[0.95 * fl, 0.75 * fl, 1]}><spriteMaterial map={glow} color="#ff8a2a" transparent opacity={0.55 * amt} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
      <pointLight position={[0, 0.25, 0.25]} intensity={4.2 * fl * amt} distance={4.2} color="#ff8a3a" castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
    </group>
  );
};

// humo que sube (sprites deterministas)
const Humo: React.FC<{ t: number; p: V3; n?: number; h?: number; spread?: number; o?: number; tex?: THREE.Texture; col?: string }> = ({ t, p, n = 14, h = 1.6, spread = 0.35, o = 0.28, tex, col = "#e9e3d8" }) => (
  <group position={p}>
    {Array.from({ length: n }, (_, i) => {
      const per = 4 + rnd(i, 1) * 2, k = ((t + rnd(i, 2) * per) % per) / per;
      const s = 0.18 + k * (0.5 + rnd(i, 3) * 0.6);
      return <sprite key={i} position={[(rnd(i, 4) - 0.5) * spread + Math.sin(t * 0.6 + i) * 0.12 * k + k * 0.25, k * h, (rnd(i, 5) - 0.5) * spread]} scale={[s, s, 1]}>
        <spriteMaterial map={tex} color={col} transparent opacity={o * Math.sin(k * Math.PI)} depthWrite={false} />
      </sprite>;
    })}
  </group>
);

// tortilla sobre el comal: masa cruda → manchitas → se infla
const Tortilla: React.FC<{ p: V3; r?: number; cook: number; puff: number; rotY?: number }> = ({ p, r = 0.105, cook, puff, rotY = 0 }) => {
  const col = new THREE.Color("#efe1b8").lerp(new THREE.Color("#d9b36a"), cook);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <mesh castShadow scale={[1, 0.05 + puff * 5, 1]}><sphereGeometry args={[r, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={col} roughness={0.85} /></mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r, 28]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>
      {cook > 0.3 && Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * r * 1.3, 0.004 + puff * r * 0.9 * (1 - Math.hypot(rnd(i, 1) - 0.5, rnd(i, 2) - 0.5)), (rnd(i, 2) - 0.5) * r * 1.3]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.008 + rnd(i, 3) * 0.01, 8]} /><meshBasicMaterial color="#6b4a22" transparent opacity={(cook - 0.3) * 1.2} /></mesh>)}
    </group>
  );
};

// lo que se tatema: jitomate, cebolla, ajo con cáscara y chiles; se ponen negros con el tiempo
const Tatemado: React.FC<{ t: number; at0: number }> = ({ t, at0 }) => {
  const k = cl((t - at0) / 5);
  const items: { p: V3; c: string; s: V3; kind: "jit" | "ajo" | "chile" | "ceb" }[] = [
    { p: [0.12, 0.05, 0.12], c: "#d6301c", s: [0.06, 0.05, 0.06], kind: "jit" },
    { p: [-0.05, 0.05, 0.2], c: "#cf3a20", s: [0.055, 0.048, 0.055], kind: "jit" },
    { p: [-0.2, 0.025, 0.02], c: "#efe6d6", s: [0.022, 0.026, 0.022], kind: "ajo" },
    { p: [-0.14, 0.025, -0.06], c: "#efe6d6", s: [0.022, 0.026, 0.022], kind: "ajo" },
    { p: [0.18, 0.02, -0.12], c: "#3f7a24", s: [0.022, 0.02, 0.09], kind: "chile" },
    { p: [0.02, 0.035, -0.2], c: "#ece6da", s: [0.05, 0.035, 0.05], kind: "ceb" },
  ];
  return (
    <group position={[C[0], C[1] + 0.012, C[2]]}>
      {items.map((it, i) => {
        const a = cl((t - at0 - i * 0.12) / 0.35); if (a <= 0) return null;
        const drop = (1 - ease(a)) * 0.25, char = cl(k * (it.kind === "chile" ? 1.3 : 1));
        const col = new THREE.Color(it.c).lerp(new THREE.Color("#1d140e"), char * 0.62);
        return <mesh key={i} position={[it.p[0], it.p[1] + drop, it.p[2]]} scale={it.s} rotation={[0, i, it.kind === "chile" ? 0.2 : 0]} castShadow>
          {it.kind === "chile" ? <capsuleGeometry args={[0.6, 1.6, 6, 10]} /> : <sphereGeometry args={[1, 18, 14]} />}
          <meshStandardMaterial color={col} roughness={0.45 + char * 0.4} />
        </mesh>;
      })}
      {/* manchas negras de tatemado en el comal */}
      {k > 0.2 && Array.from({ length: 6 }, (_, i) => <mesh key={"m" + i} position={[(rnd(i, 3) - 0.5) * 0.4, 0.001, (rnd(i, 4) - 0.5) * 0.4]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.03 + rnd(i, 5) * 0.03, 12]} /><meshBasicMaterial color="#000" transparent opacity={0.4 * (k - 0.2)} /></mesh>)}
    </group>
  );
};


// ---------- piezas 3D del minuto 2 en adelante (las prende plan.ts por plano) ----------
const TG2 = at("si chisporrotea"), TG3 = at("y si la gota brinca"), TNOP = at("truco numero 17");
const Extras: React.FC<{ t: number; E: NonNullable<ReturnType<typeof estado>> }> = ({ t, E }) => {
  const y0 = C[1] + 0.014;
  const fase = t < TG2 ? 0 : t < TG3 ? 1 : 2;
  return (
    <group>
      {/* gotas de agua: quietas → chisporrotean → brincan y bailan */}
      {E.gotas > 0.05 && Array.from({ length: 16 }, (_, i) => {
        const a = rnd(i, 7) * 6.28, r = 0.08 + rnd(i, 8) * 0.3, ph = t * (6 + rnd(i, 9) * 5) + i;
        const hop = fase === 2 ? Math.abs(Math.sin(ph)) * 0.035 : fase === 1 ? Math.abs(Math.sin(ph * 2)) * 0.006 : 0;
        const dx = fase === 2 ? Math.sin(ph * 0.7) * 0.03 : 0, sc = fase === 1 ? 0.7 + 0.3 * Math.sin(ph * 3) : 1;
        return <mesh key={i} position={[C[0] + Math.cos(a) * r + dx, y0 + 0.008 + hop, C[2] + Math.sin(a) * r]} scale={[sc, sc * 0.6, sc]}>
          <sphereGeometry args={[0.012, 12, 8]} /><meshStandardMaterial color="#dff2ff" transparent opacity={0.85} roughness={0.05} metalness={0.1} /></mesh>;
      })}
      {/* grieta que avanza por dentro del barro */}
      {E.grieta > 0.05 && Array.from({ length: 9 }, (_, i) => {
        const k = Math.min(1, E.grieta * 1.2), x0 = -0.36 + i * 0.08, z0 = Math.sin(i * 1.7) * 0.05;
        if (i / 9 > k) return null;
        return <mesh key={i} position={[C[0] + x0 + 0.04, y0 + 0.001, C[2] + z0]} rotation={[-Math.PI / 2, 0, Math.sin(i * 2.3) * 0.6]}><planeGeometry args={[0.09, 0.008]} /><meshBasicMaterial color="#000" /></mesh>;
      })}
      {/* las tres zonas: centro (tatema) · en medio (tortillas) · orillita (esperan) */}
      {E.zonas > 0.05 && [[0.13, "#ff4a2a"], [0.29, "#ffb23a"], [0.43, "#ffe9a8"]].map(([r, c], i) =>
        <mesh key={i} position={[C[0], y0 + 0.003, C[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[(r as number) - 0.012, r as number, 64]} /><meshBasicMaterial color={c as string} transparent opacity={E.zonas * (0.75 + 0.25 * Math.sin(t * 3 + i))} toneMapped={false} /></mesh>)}
      {/* pepitas que brincan y truenan */}
      {E.pepitas > 0.05 && Array.from({ length: 40 }, (_, i) => {
        const a = rnd(i, 11) * 6.28, r = Math.sqrt(rnd(i, 12)) * 0.3, ph = (t * (1.3 + rnd(i, 13)) + rnd(i, 14) * 5) % 4;
        const hop = ph < 0.35 ? Math.sin((ph / 0.35) * Math.PI) * 0.06 : 0;
        return <mesh key={i} position={[C[0] + Math.cos(a) * r, y0 + 0.006 + hop, C[2] + Math.sin(a) * r]} rotation={[hop * 30, a, 0]} scale={[1, 0.35, 0.6]}>
          <sphereGeometry args={[0.016, 10, 6]} /><meshStandardMaterial color={i % 4 ? "#a9b46a" : "#e9d9a8"} roughness={0.6} /></mesh>;
      })}
      {/* nopales enteros con cortaditas: de verde brillante a verde oscuro */}
      {E.nopal > 0.05 && [[-0.12, 0.05, 0.4], [0.15, -0.06, -0.5]].map(([x, z, ry], i) => {
        const k = cl((t - TNOP - 2) / 14), col = new THREE.Color("#5fae3a").lerp(new THREE.Color("#2f4f22"), k);
        return <group key={i} position={[C[0] + x, y0 + 0.012, C[2] + z]} rotation={[0, ry, 0]}>
          <mesh scale={[1, 0.12, 0.62]}><sphereGeometry args={[0.15, 24, 12]} /><meshStandardMaterial color={col} roughness={0.45} /></mesh>
          {[-0.06, 0, 0.06].map((d, j) => <mesh key={j} position={[d, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[0.006, 0.12]} /><meshBasicMaterial color="#1e3214" /></mesh>)}
        </group>;
      })}
      {/* chiles secos: guajillo, ancho, pasilla */}
      {E.chiles > 0.05 && [["#7a1a10", 0.1, 0.06], ["#3b1410", -0.12, -0.02], ["#2a0f0c", 0.02, -0.16]].map(([c, x, z], i) =>
        <mesh key={i} position={[C[0] + (x as number), y0 + 0.012, C[2] + (z as number)]} rotation={[0, i * 1.1, Math.PI / 2]} scale={[0.5, 1, 1]}><capsuleGeometry args={[0.025, 0.16, 6, 10]} /><meshStandardMaterial color={c as string} roughness={0.35} /></mesh>)}
      {/* tomate verde: se pone amarillito y suelta su jugo */}
      {E.tomatillo > 0.05 && Array.from({ length: 5 }, (_, i) => {
        const a = i * 1.26, k = cl((t - at("truco numero 15") - 3) / 10), col = new THREE.Color("#7fbf3a").lerp(new THREE.Color("#c9b13a"), k);
        return <group key={i} position={[C[0] + Math.cos(a) * 0.17, y0 + 0.035, C[2] + Math.sin(a) * 0.17]}>
          <mesh><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color={col} roughness={0.4} /></mesh>
          {k > 0.5 && <mesh position={[0.03, -0.033, 0.02]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.03 * k, 12]} /><meshBasicMaterial color="#3a2a0a" transparent opacity={0.7} /></mesh>}
        </group>;
      })}
      {/* el comal de lámina (fierro), en la mesa, negro como espejo; sal de grano encima */}
      {E.comal2 > 0.05 && <group position={[-2.3, 0.815, -0.38]}>
        <mesh castShadow receiveShadow><cylinderGeometry args={[0.24, 0.24, 0.008, 48]} /><meshStandardMaterial color="#26262a" roughness={0.22} metalness={0.85} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}><torusGeometry args={[0.24, 0.007, 8, 64]} /><meshStandardMaterial color="#8a8a90" roughness={0.3} metalness={0.9} /></mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.14, 8]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} /></mesh>
        {E.sal > 0.05 && Array.from({ length: 70 }, (_, i) => { const a = rnd(i, 21) * 6.28, r = Math.sqrt(rnd(i, 22)) * 0.2;
          return <mesh key={i} position={[Math.cos(a) * r, 0.008, Math.sin(a) * r]} rotation={[rnd(i, 23), rnd(i, 24), 0]}><boxGeometry args={[0.008, 0.008, 0.008]} /><meshStandardMaterial color="#f4f4f2" roughness={0.3} /></mesh>; })}
      </group>}
    </group>
  );
};

// la casa de Chayo, del otro lado de la barda (adobe + teja + puerta azul + su propio humo)
const CasaChayo: React.FC<{ t: number; tx: ReturnType<typeof useRancho> }> = ({ t, tx }) => (
  <group position={[15.5, 0, 0.5]} rotation={[0, -Math.PI / 2 + 0.25, 0]}>
    <Box p={[0, 1.4, 0]} s={[7, 2.8, 4.4]} c="#a77a55" map={tx.adobe} rad={0.06} />
    <Box p={[0, 0.25, 2.21]} s={[7.02, 0.5, 0.04]} c="#7c3b2a" rad={0.004} />
    {/* techo de teja a dos aguas */}
    {[1, -1].map((sgn) => <mesh key={sgn} position={[0, 3.25, sgn * 1.15]} rotation={[sgn * 0.42, 0, 0]} castShadow receiveShadow><boxGeometry args={[7.6, 0.12, 2.75]} /><meshStandardMaterial color="#b4583a" map={tx.teja} roughness={0.85} /></mesh>)}
    <Box p={[-1.2, 1.05, 2.22]} s={[1.0, 2.1, 0.08]} c="#2f5d8a" r={0.7} />
    <Box p={[1.6, 1.6, 2.22]} s={[1.0, 0.9, 0.06]} c="#1a1410" r={0.8} />
    <Box p={[1.6, 1.6, 2.26]} s={[1.12, 1.02, 0.03]} c="#e8dcc4" r={0.9} />
    {/* macetas en el corredor */}
    {[-2.6, -2.1, 0.2, 2.8].map((x, i) => <group key={i} position={[x, 0, 2.6]}><Olla p={[0, 0, 0]} h={0.38} r={0.2} c="#b05a33" /><mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.24, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#4f8a34" : "#c2306a"} roughness={0.9} /></mesh></group>)}
    <mesh position={[2.4, 3.6, -0.6]} castShadow><boxGeometry args={[0.4, 1.2, 0.4]} /><meshStandardMaterial color="#8d6a4c" map={tx.adobe} roughness={0.95} /></mesh>
    <Humo t={t + 3} p={[2.4, 4.2, -0.6]} n={18} h={3.2} spread={0.5} o={0.16} tex={tx.humo} />
  </group>
);

// limonero: copa de esferas verdes con limones
const Limonero: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.1, 0.16, 1.6, 8]} /><meshStandardMaterial color="#5a4330" roughness={0.95} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.8, 1.7 + rnd(i, 2) * 1.1, (rnd(i, 3) - 0.5) * 1.8]} castShadow receiveShadow><sphereGeometry args={[0.45 + rnd(i, 4) * 0.3, 12, 10]} /><meshStandardMaterial color={new THREE.Color("#3f6e2a").lerp(new THREE.Color("#6f9a3a"), rnd(i, 5))} roughness={0.9} /></mesh>)}
    {Array.from({ length: 22 }, (_, i) => <mesh key={"l" + i} position={[(rnd(i, 6) - 0.5) * 2.0, 1.5 + rnd(i, 7) * 1.4, (rnd(i, 8) - 0.5) * 2.0]}><sphereGeometry args={[0.05, 8, 6]} /><meshStandardMaterial color="#d9d23a" roughness={0.6} /></mesh>)}
  </group>
);

export const World: React.FC<{ t: number; ext?: { calCoat?: number; heat?: number; ash?: number; tortillas?: number } }> = ({ t, ext = {} }) => {
  const tx = useRancho();
  // eventos del comal (de la voz)
  const E = estado(t); // del minuto 2 en adelante el estado del comal lo dicta plan.ts
  const calCoat = ext.calCoat ?? (E ? E.cal : win(t, T.cura + 0.15, T.cura + 1.3) * (1 - win(t, T.calienta + 0.2, T.calienta + 0.9)));
  const heat = ext.heat ?? (E ? E.heat : win(t, T.calienta, T.calienta + 0.8) * (1 - win(t, T.tatema + 0.6, T.tatema + 1.2)));
  const ash = ext.ash ?? (E ? E.ash : win(t, T.ceniza, T.ceniza + 0.6) * (1 - win(t, T.guarda + 0.4, T.guarda + 1.0)));
  const comalCol = new THREE.Color("#141110").lerp(new THREE.Color("#ece6d8"), calCoat * 0.92).lerp(new THREE.Color("#8a8278"), ash * 0.75)
    .lerp(new THREE.Color("#3a2c22"), (E?.dark ?? 0) * 0.5 * (1 - calCoat));
  // tortillas en el comal (siempre viven: la cocina está trabajando)
  const tc = (k: number) => cl(((t + k * 2.3) % 7) / 7);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55} threshold={0.88} exposure={1.05} env={0.25} />
      <color attach="background" args={["#c9d6e2"]} />
      <fog attach="fog" args={["#d8d2c4", 18, 60]} />
      <hemisphereLight args={[0xcfe0f5, 0x5a4330, 0.75]} />
      {/* sol de la mañana entrando por el costado abierto */}
      <directionalLight position={[14, 13, 9]} intensity={2.4} color="#ffe2b8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={22} shadow-camera-top={14} shadow-camera-bottom={-10} shadow-bias={-0.0004} />
      {/* cielo */}
      <mesh><sphereGeometry args={[150, 32, 16]} /><meshBasicMaterial map={tx.cielo} side={THREE.BackSide} fog={false} toneMapped={false} /></mesh>
      {/* cerros lejanos */}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[40 + rnd(i, 1) * 20, -4, -40 + i * 16]} scale={[18 + rnd(i, 2) * 14, 9 + rnd(i, 3) * 8, 16]}><sphereGeometry args={[1, 16, 8]} /><meshStandardMaterial color={new THREE.Color("#6f7f5a").lerp(new THREE.Color("#a7b3a8"), 0.5 + 0.3 * rnd(i, 4))} roughness={1} /></mesh>)}
      {/* piso: tierra adentro y patio afuera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0, 0]} receiveShadow><planeGeometry args={[80, 60]} /><meshStandardMaterial map={tx.tierra} color="#b89a78" roughness={1} /></mesh>

      {/* ===== LA COCINA DE CUCA ===== */}
      {/* pared del fondo y pared de la puerta (adobe); el costado derecho y el frente quedan abiertos al patio */}
      <Box p={[0, 1.45, -2.75]} s={[7.4, 2.9, 0.32]} c="#a98163" map={tx.adobe} rad={0.05} />
      <Box p={[-3.6, 1.45, -1.9]} s={[0.32, 2.9, 1.7]} c="#a98163" map={tx.adobe} rad={0.05} />
      <Box p={[-3.6, 1.45, 1.55]} s={[0.32, 2.9, 2.5]} c="#a98163" map={tx.adobe} rad={0.05} />
      <Box p={[-3.6, 2.6, -0.3]} s={[0.32, 0.6, 1.5]} c="#a98163" map={tx.adobe} rad={0.05} />
      {/* puerta de tablas, entreabierta, con el sol del otro lado */}
      <group position={[-3.55, 0, -1.02]} rotation={[0, 0.95, 0]}><Box p={[0.68, 1.1, 0]} s={[1.36, 2.2, 0.06]} c="#5c4029" map={tx.madera} r={0.85} /></group>
      <mesh position={[-3.9, 1.1, -0.3]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.4, 2.2]} /><meshBasicMaterial color="#cbb894" /></mesh>
      {/* techo de vigas y teja (sólo encima de la cocina) */}
      <mesh position={[0, 3.0, -0.4]} rotation={[0.08, 0, 0]} receiveShadow castShadow><boxGeometry args={[7.8, 0.1, 5.2]} /><meshStandardMaterial color="#9a4e33" map={tx.teja} roughness={0.9} /></mesh>
      {[-3, -1.5, 0, 1.5, 3].map((x) => <mesh key={x} position={[x, 2.88, -0.4]} castShadow><boxGeometry args={[0.13, 0.13, 5.2]} /><meshStandardMaterial color="#4a3423" map={tx.madera} roughness={0.9} /></mesh>)}
      {/* horcones (postes) del costado abierto */}
      {[[3.6, 2.0], [3.6, -2.5], [-1.0, 2.0]].map(([x, z], i) => <mesh key={i} position={[x, 1.45, z]} castShadow><cylinderGeometry args={[0.09, 0.11, 2.9, 8]} /><meshStandardMaterial color="#4c3626" map={tx.madera} roughness={0.95} /></mesh>)}

      {/* el fogón encalado: dos hornillas, boca con lumbre */}
      <group>
        <Box p={[0.35, 0.45, -1.9]} s={[2.4, 0.9, 1.15]} c="#d8d0c0" map={tx.cal} rad={0.09} />
        {/* boca del fogón (hueco oscuro) */}
        <mesh position={[0.75, 0.32, -1.31]}><boxGeometry args={[0.7, 0.5, 0.02]} /><meshStandardMaterial color="#120c08" roughness={1} /></mesh>
        <mesh position={[0.75, 0.32, -1.6]}><boxGeometry args={[0.66, 0.46, 0.6]} /><meshStandardMaterial color="#1a100a" roughness={1} side={THREE.BackSide} /></mesh>
        <Fuego t={t} p={[0.75, 0.16, -1.45]} glow={tx.glow} />
        {/* hornilla de la olla */}
        <Fuego t={t + 1.3} p={[-0.3, 0.16, -1.5]} amt={0.55} glow={tx.glow} />
        <mesh position={[-0.3, 0.32, -1.31]}><boxGeometry args={[0.5, 0.4, 0.02]} /><meshStandardMaterial color="#120c08" roughness={1} /></mesh>
        {/* EL COMAL */}
        <group position={C}>
          <mesh castShadow receiveShadow><cylinderGeometry args={[0.46, 0.44, 0.024, 64]} /><meshStandardMaterial color={comalCol} roughness={0.38 + calCoat * 0.5 + ash * 0.3} metalness={0.04} emissive="#ff3a0a" emissiveIntensity={heat * 0.03} /></mesh>
          <mesh position={[0, 0.013, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.452, 0.012, 8, 64]} /><meshStandardMaterial color="#26201b" roughness={0.5} /></mesh>
          {/* brillo de calor: anillo que respira */}
          {/* ceniza blanca tallada en circulitos */}
          {ash > 0.02 && Array.from({ length: 60 }, (_, i) => { const a = rnd(i, 1) * 6.28, rr = Math.sqrt(rnd(i, 2)) * 0.4; return <mesh key={i} position={[Math.cos(a) * rr, 0.014, Math.sin(a) * rr]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.012 + rnd(i, 3) * 0.02, 8]} /><meshBasicMaterial color="#d7d2c8" transparent opacity={ash * 0.85} /></mesh>; })}
        </group>
        {/* tortillas trabajando en el comal (fuera de los momentos de cal/ceniza/tatemado) */}
        {(ext.tortillas ?? (E ? E.tort * (1 - Math.max(calCoat, ash)) : 1 - Math.max(calCoat, ash, win(t, T.tatema - 0.2, T.tatema + 0.2) * (1 - win(t, T.guarda, T.guarda + 0.5))))) > 0.5 && <>
          <Tortilla p={[C[0] - 0.16, C[1] + 0.014, C[2] + 0.1]} cook={tc(0)} puff={E && E.puff > 0.5 ? 0.07 + 0.01 * Math.sin(t * 3) : Math.max(0, Math.sin(Math.min(1, tc(0) * 1.4) * Math.PI)) * 0.06 * (tc(0) > 0.55 ? 1 : 0)} />
          <Tortilla p={[C[0] + 0.17, C[1] + 0.014, C[2] - 0.08]} cook={tc(1.6)} puff={tc(1.6) > 0.6 ? 0.05 * Math.sin((tc(1.6) - 0.6) * 7.8) ** 2 : 0} rotY={1} />
          <Tortilla p={[C[0] + 0.06, C[1] + 0.014, C[2] + 0.26]} r={0.09} cook={0.9} puff={0} rotY={2} />
        </>}
        {(!E || E.tatem > 0.5) && <Tatemado t={t} at0={E ? t - 6 : T.tatema} />}
        {E && <Extras t={t} E={E} />}
        {/* olla de frijoles con su vapor */}
        <Olla p={[-0.3, 0.9, -1.85]} h={0.42} r={0.27} c="#8f4526" />
        <Humo t={t} p={[-0.3, 1.35, -1.85]} n={10} h={1.2} spread={0.18} o={0.22} tex={tx.humo} />
        {/* humo del comal */}
        <Humo t={t + 2} p={[C[0], C[1] + 0.1, C[2]]} n={12} h={1.7} spread={0.5} o={0.16 + 0.12 * win(t, T.abuela, T.lumbre) + 0.25 * (E?.humo ?? 0)} tex={tx.humo} />
      </group>

      {/* repisa del fondo: ollas, jarros y comales colgados (como en la foto) */}
      <Box p={[0.5, 1.55, -2.5]} s={[3.6, 0.07, 0.36]} c="#4a3423" map={tx.madera} rad={0.01} />
      {[[-0.9, 0.36, 0.2, "#8a4325"], [-0.35, 0.28, 0.16, "#a2552f"], [0.25, 0.22, 0.13, "#7d3a22"], [0.85, 0.4, 0.22, "#934a29"], [1.55, 0.3, 0.17, "#b06038"], [2.05, 0.2, 0.12, "#6e3320"]].map(([x, h, r, c], i) => <Olla key={i} p={[x as number, 1.585, -2.5]} h={h as number} r={r as number} c={c as string} />)}
      <ComalPared p={[-1.9, 2.15, -2.57]} r={0.36} />
      <ComalPared p={[-1.15, 2.35, -2.57]} r={0.28} c="#2a2420" />
      <ComalPared p={[2.4, 2.2, -2.57]} r={0.32} />
      {/* sartén de cobre y cucharas de palo */}
      <ComalPared p={[1.4, 2.25, -2.57]} r={0.22} c="#8a5a33" />
      {[-0.4, -0.25, -0.1].map((x, i) => <mesh key={i} position={[x, 2.05, -2.57]} rotation={[0, 0, 0.1 * (i - 1)]}><capsuleGeometry args={[0.02, 0.45, 4, 6]} /><meshStandardMaterial color="#8a6342" roughness={0.8} /></mesh>)}
      {/* ristra de chiles secos */}
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[2.95 + Math.sin(i) * 0.03, 2.5 - i * 0.07, -2.55]} rotation={[0, 0, 0.3 * Math.sin(i * 2)]}><capsuleGeometry args={[0.022, 0.09, 4, 6]} /><meshStandardMaterial color={i % 3 ? "#7a1c12" : "#5e140d"} roughness={0.55} /></mesh>)}

      {/* EL COMAL DE LA MAMÁ: colgado de un clavo junto a la puerta, negro y brillante de tanto uso */}
      <group position={PT.clavo}>
        <mesh position={[0.02, 0.36, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.12, 6]} /><meshStandardMaterial color="#5b3a22" metalness={0.6} roughness={0.5} /></mesh>
        <ComalPared p={[0.035, 0, 0]} r={0.34} rot={[0, Math.PI / 2, 0]} c="#0d0b0a" />
        <pointLight position={[0.9, 0.4, 0.2]} intensity={0.25 + 0.35 * win(t, T.acuerdo, T.negro)} distance={2.5} color="#ffe6c0" />
      </group>
      {/* rayo de sol que entra por la puerta y barre la pared (motas de polvo) */}
      <mesh position={[-2.9, 1.0, -0.3]} rotation={[0, 0.4, 0.5]}><planeGeometry args={[0.9, 3.4]} /><meshBasicMaterial color="#fff0cc" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[-3.1 + rnd(i, 1) * 1.0 + 0.05 * Math.sin(t * 0.3 + i), 0.4 + ((rnd(i, 2) * 2.4 + t * 0.05) % 2.4), -0.8 + rnd(i, 3) * 1.2]}><sphereGeometry args={[0.006, 4, 3]} /><meshBasicMaterial color="#fff6e0" transparent opacity={0.5} toneMapped={false} /></mesh>)}

      {/* mesa con metate, molcajete y el tortillero con servilleta bordada */}
      <group position={[-2.0, 0, -0.4]}>
        <Box p={[0, 0.76, 0]} s={[1.5, 0.08, 0.85]} c="#6b4a30" map={tx.madera} rad={0.015} />
        {[[-0.66, -0.36], [0.66, -0.36], [-0.66, 0.36], [0.66, 0.36]].map(([x, z], i) => <Box key={i} p={[x, 0.37, z]} s={[0.07, 0.74, 0.07]} c="#4f3723" map={tx.madera} rad={0.01} />)}
        {/* metate (se va cuando el comal de fierro ocupa su lugar) */}
        {!(E && E.comal2 > 0.5) && <group position={[-0.35, 0.8, 0.02]} rotation={[0.12, 0.3, 0]}><Box p={[0, 0.06, 0]} s={[0.55, 0.06, 0.36]} c="#4c4846" r={0.95} rad={0.03} />
          <mesh position={[0, 0.13, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.035, 0.32, 4, 10]} /><meshStandardMaterial color="#5a5653" roughness={0.95} /></mesh></group>}
        {/* molcajete */}
        <group position={[0.35, 0.8, -0.15]}>
          <mesh position={[0, 0.1, 0]} castShadow><sphereGeometry args={[0.15, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#3d3a38" roughness={1} side={THREE.DoubleSide} /></mesh>
          {[0, 2.1, 4.2].map((a, i) => <mesh key={i} position={[Math.cos(a) * 0.08, 0.02, Math.sin(a) * 0.08]}><cylinderGeometry args={[0.025, 0.03, 0.06, 6]} /><meshStandardMaterial color="#3d3a38" roughness={1} /></mesh>)}
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 20]} /><meshStandardMaterial color="#6d1d10" roughness={0.6} /></mesh>
        </group>
        {/* tortillero */}
        <group position={[0.3, 0.8, 0.22]}>
          <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.16, 0.13, 0.1, 20, 1, true]} /><meshStandardMaterial color="#b58b4c" roughness={0.9} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0.4]}><planeGeometry args={[0.42, 0.42]} /><meshStandardMaterial map={tx.rebozo} roughness={0.95} /></mesh>
        </group>
        <Olla p={[0.62, 0.8, -0.25]} h={0.22} r={0.09} c="#a2552f" />
      </group>
      {/* leña apilada junto al fogón */}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[2.15 + (i % 3) * 0.17, 0.08 + Math.floor(i / 3) * 0.15, -2.2]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.075, 0.08, 0.8, 8]} /><meshStandardMaterial color={i % 2 ? "#5d4532" : "#6b5038"} roughness={0.95} /></mesh>)}

      {/* ===== EL PATIO ===== */}
      <Limonero p={[5.6, 0, 6.2]} />
      <Limonero p={[11.8, 0, -4.5]} />
      {/* magueyes */}
      {[[5.0, -3.5], [7.5, -2.0], [8.6, 5.8]].map(([x, z], k) => <group key={k} position={[x, 0, z]}>{Array.from({ length: 9 }, (_, i) => <mesh key={i} rotation={[0.55 + rnd(i + k, 1) * 0.3, (i / 9) * 6.28, 0]} position={[0, 0.35, 0]}><coneGeometry args={[0.08, 1.1, 4]} /><meshStandardMaterial color="#5f7d5a" roughness={0.8} /></mesh>)}</group>)}
      {/* la barda de adobe entre las dos casas, con tejitas encima */}
      <group position={[10, 0, 1.6]}>
        <Box p={[0, 0.72, 0]} s={[0.4, 1.44, 16]} c="#a98163" map={tx.adobe} rad={0.05} />
        <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[0.6, 0.1, 16.2]} /><meshStandardMaterial color="#a8553a" map={tx.teja} roughness={0.85} /></mesh>
      </group>
      <CasaChayo t={t} tx={tx} />
      {/* gallina picoteando (vida del patio) */}
      <group position={[4.4 + 0.3 * Math.sin(t * 0.2), 0, 1.0]} rotation={[0, t * 0.2, 0]}>
        <mesh position={[0, 0.22, 0]} castShadow scale={[1.2, 1, 0.8]}><sphereGeometry args={[0.15, 12, 10]} /><meshStandardMaterial color="#8a4f2a" roughness={0.9} /></mesh>
        <mesh position={[0.16, 0.33 - 0.06 * Math.max(0, Math.sin(t * 5)), 0]} castShadow><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color="#8a4f2a" roughness={0.9} /></mesh>
        <mesh position={[0.17, 0.4 - 0.06 * Math.max(0, Math.sin(t * 5)), 0]}><boxGeometry args={[0.05, 0.04, 0.02]} /><meshStandardMaterial color="#c0281a" /></mesh>
      </group>
    </ThreeCanvas>
  );
};
