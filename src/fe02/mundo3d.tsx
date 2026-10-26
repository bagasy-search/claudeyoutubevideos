// fe02 · EL MUNDO: Funerales Navarro (Analco) en corte, como casa de muñecas. Oficina de Ernesto (escritorio, veladora, cotización,
// pluma, sobre amarillo, la Carpeta de la Familia, retrato) con la ventana a Analco y la cúpula del templo · sala de exhibición
// (ataúdes CERRADOS con etiqueta de precio colgante, bóvedas, repisa de urnas) · capilla (sillas, cempasúchil, veladoras) · cochera
// (la carroza) · patio con el nicho de cantera. UNA cámara para todo el video (keyframes del plan, vuelo en arco, zoom en logaritmo,
// mano lenta). Determinista en función de t. ⛔ Nunca cuerpos ni ataúd abierto. Render SÓLO en el farm (acá sólo stills).
import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox, useTextures } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";
import { SERIF_GRAB, SERIF, MANO } from "./funerario";
import { FONT } from "./lib";
import CAMS from "./cams.json";
import EV from "./ev.json";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
// bezier (0.65,0,0.35,1) ≈ cúbica de entrada y salida
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const flick = (t: number, s = 0) => 0.84 + 0.09 * Math.sin(t * 7.3 + s) + 0.05 * Math.sin(t * 13.1 + s * 2) + 0.03 * Math.sin(t * 23.7 + s * 3);
type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- ESTACIONES de cámara (el plan elige una por plano) ----------------
// oficina x -7..-1 · exhibición -1..8 · capilla 8..14 · cochera 14..21 · patio 21..28. Paredes de fondo en z=-3, frente abierto.
export const ST: Record<string, { p: V3; l: V3; fov: number }> = {
  cupula: { p: [-4.3, 1.75, -2.2], l: [-4.6, 3.2, -24], fov: 34 },          // por la ventana: Analco y la cúpula
  ventana: { p: [-4.4, 1.62, -1.75], l: [-4.6, 3.6, -22], fov: 44 },         // la ventana desde adentro
  escritorio: { p: [-3.75, 1.78, 2.05], l: [-4.0, 0.95, -1.6], fov: 42 },  // el lugar del espectador
  cotizacion: { p: [-3.82, 1.42, -0.32], l: [-3.85, 0.78, -1.0], fov: 36 },  // la hoja en la mano
  pluma: { p: [-3.55, 1.12, -0.55], l: [-3.75, 0.79, -1.02], fov: 32 },      // la pluma tocando el papel
  retrato: { p: [-4.62, 1.08, -0.9], l: [-4.72, 1.0, -1.85], fov: 30 },      // el retrato de Ernesto (portal al avatar)
  veladora: { p: [-5.0, 1.15, -0.6], l: [-5.2, 0.92, -1.5], fov: 32 },
  sobre: { p: [-3.05, 1.25, -0.9], l: [-3.1, 0.79, -1.6], fov: 32 },
  carpeta: { p: [-2.62, 1.36, -0.25], l: [-2.65, 0.8, -1.02], fov: 34 },     // la Carpeta de la Familia (CTA)
  archivero: { p: [-5.55, 1.45, -0.7], l: [-6.55, 0.85, -2.55], fov: 34 },
  fotos: { p: [-5.6, 1.85, -0.6], l: [-5.9, 1.9, -2.95], fov: 36 },          // pared con la foto de Don Refugio y el crucifijo
  oficina: { p: [-3.6, 2.7, 4.9], l: [-4.0, 1.05, -1.4], fov: 40 },
  corte: { p: [10.5, 7.8, 21], l: [10.5, 0.6, -1], fov: 44 },               // la funeraria entera en corte
  exhibicion: { p: [3.3, 2.3, 4.8], l: [3.0, 0.8, -1.2], fov: 40 },
  ataud1: { p: [1.05, 1.45, 1.6], l: [0.3, 0.86, -0.4], fov: 34 },
  ataud2: { p: [2.6, 1.45, 1.6], l: [1.9, 0.86, -0.4], fov: 34 },
  ataud3: { p: [4.2, 1.45, 1.6], l: [3.5, 0.86, -0.4], fov: 34 },
  tag1: { p: [0.42, 1.12, 1.95], l: [0.3, 0.96, 0.6], fov: 28 },
  tag2: { p: [2.02, 1.12, 1.95], l: [1.9, 0.96, 0.6], fov: 28 },
  tag3: { p: [3.62, 1.12, 1.95], l: [3.5, 0.96, 0.6], fov: 28 },
  tapa: { p: [0.95, 1.25, 0.2], l: [0.3, 1.02, -1.0], fov: 30 },             // la goma de la tapa del sellado
  bovedas: { p: [6.15, 1.45, 3.7], l: [6.15, 0.5, -0.6], fov: 40 },
  boveda_lujo: { p: [7.2, 0.95, 2.0], l: [7.0, 0.5, -0.5], fov: 34 },
  boveda_llana: { p: [5.45, 0.95, 2.0], l: [5.3, 0.48, -0.5], fov: 34 },
  urnas: { p: [2.0, 1.75, 0.2], l: [2.0, 1.45, -2.9], fov: 36 },
  urna_barro: { p: [0.75, 1.62, -1.6], l: [0.7, 1.5, -2.85], fov: 30 },
  urna_marmol: { p: [3.25, 1.62, -1.6], l: [3.3, 1.52, -2.85], fov: 30 },
  capilla: { p: [11.0, 1.85, 3.2], l: [11.0, 1.0, -2.2], fov: 40 },
  flores: { p: [11.4, 1.35, -0.6], l: [11.0, 1.05, -2.3], fov: 32 },
  veladoras: { p: [9.4, 1.1, -0.9], l: [9.2, 0.85, -2.4], fov: 30 },
  sillas: { p: [12.6, 1.4, 2.0], l: [10.8, 0.6, -0.4], fov: 36 },
  cochera: { p: [17.6, 2.2, 5.6], l: [17.4, 0.9, -1.0], fov: 40 },
  carroza: { p: [20.3, 1.3, 2.5], l: [17.6, 0.9, -0.9], fov: 38 },
  faros: { p: [20.55, 0.85, 1.2], l: [19.8, 0.86, -0.9], fov: 32 },
  patio: { p: [24.6, 2.0, 5.2], l: [24.6, 1.3, -2.0], fov: 40 },
  nicho: { p: [24.6, 1.65, 1.4], l: [24.6, 1.6, -2.7], fov: 34 },
  lapida: { p: [24.6, 1.35, -0.4], l: [24.6, 1.3, -2.7], fov: 30 },
  pirul: { p: [26.8, 1.6, 3.6], l: [26.5, 2.4, -1.0], fov: 38 },
};

// ---------------- cámara: el plan da [{a, st, fly}] (fly = el plano anterior también era el mundo → se vuela) ----------------
type Cam = { a: number; b: number; st: string; fly?: number; side?: number; push?: number };
const CS = CAMS as Cam[];
const pose = (c: Cam, q: number) => {
  const s = ST[c.st] ?? ST.escritorio, p = v3(s.p), l = v3(s.l);
  const push = c.push ?? 0.1, side = c.side ?? 0;
  const d = p.clone().sub(l), r = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 1, 0)).normalize();
  const k = sm(q);
  // empuje lento (dolly-in) + deslizamiento lateral, siempre hacia el sujeto
  const pp = l.clone().add(d.multiplyScalar(1 + push * (1 - k))).add(r.multiplyScalar(side * (k - 0.5) * 0.35));
  return { p: pp, l, fov: s.fov };
};
export const camAt = (t: number) => {
  let i = 0; while (i < CS.length - 1 && CS[i + 1].a <= t) i++;
  const c = CS[i], len = Math.max(0.5, c.b - c.a), q = (t - c.a) / len;
  const end = pose(c, cl(q));
  if (!c.fly || i === 0) return end;
  const pc = CS[i - 1], A = pose(pc, 1), B = pose(c, 0);
  const dist = A.p.distanceTo(B.p) + A.l.distanceTo(B.l) * 0.5;
  const F = Math.min(len * 0.5, Math.max(0.9, Math.min(2.2, 0.55 + dist * 0.11)));
  if (t >= c.a + F) return end;
  const k = ease((t - c.a) / F);
  // zoom en logaritmo: la distancia al punto de mira se interpola en log → el vuelo no "frena" al llegar
  const dA = A.p.distanceTo(A.l), dB = B.p.distanceTo(B.l);
  const dir = A.p.clone().sub(A.l).normalize().lerp(B.p.clone().sub(B.l).normalize(), k).normalize();
  const L = A.l.clone().lerp(B.l, k), D = Math.exp(lerp(Math.log(dA), Math.log(dB), k));
  const P = L.clone().add(dir.multiplyScalar(D));
  const arc = Math.min(2.6, dist * 0.09); P.y += Math.sin(Math.PI * k) * arc; P.z += Math.sin(Math.PI * k) * arc * 0.8;
  return { p: P, l: L, fov: Math.exp(lerp(Math.log(A.fov), Math.log(B.fov), k)) };
};
// proyección de un punto del mundo a la pantalla con la MISMA cámara (portales y rótulos que siguen a la cámara)
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, front: v.z < 1 };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
// velocidad en pantalla → blur de movimiento (tope 16 px)
export const camBlur = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / 30);
  const pa = project(a, a.l), pb = project(b, a.l);
  const px = Math.hypot(pa.x - pb.x, pa.y - pb.y) + a.p.distanceTo(b.p) * 40;
  return Math.min(16, Math.max(0, (px - 6) * 0.22));
};

const CamRig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t), m = manoCam(t, 0.55, 7);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l);
  // mano lenta (0,4-1,8 Hz) aplicada a la cámara 3D, no a la imagen
  c.rotateY(THREE.MathUtils.degToRad(m.pan * 0.6)); c.rotateX(THREE.MathUtils.degToRad(m.tilt * 0.6)); c.rotateZ(THREE.MathUtils.degToRad(m.roll * 0.5));
  c.fov = k.fov; c.near = 0.03; c.far = 300; c.updateProjectionMatrix();
  return null;
};

// ---------------- texturas: TODO se precarga (fuentes + imágenes) ANTES de montar el lienzo; caché de módulo (se monta y
// desmonta en cada ventana del avatar sin volver a bajar nada). Así el primer cuadro del lienzo ya tiene todo dibujado.
const IMGS = ["fe02/img/e03.jpg", "fe02/img/e04.jpg", "fe02/img/e52.jpg", "fe02/img/cf-funeral_tapa.png", "fe02/img/es_funeral_frase_no_p25.png"];
type Assets = Record<string, HTMLImageElement | null>;
let CACHE: Promise<Assets> | null = null;
const loadAll = () => CACHE ??= (async () => {
  const fs = [`700 40px "${SERIF_GRAB}"`, `900 40px "${SERIF_GRAB}"`, `700 40px "${MANO}"`, `800 40px "${SERIF}"`, `600 40px "${FONT}"`, `800 40px "${FONT}"`, `900 40px "${FONT}"`];
  await Promise.all(fs.map((f) => document.fonts.load(f).catch(() => null)));
  const ims = await Promise.all(IMGS.map((src) => new Promise<[string, HTMLImageElement | null]>((res) => {
    const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res([src, im]); im.onerror = () => res([src, null]); im.src = staticFile(src);
  })));
  return Object.fromEntries(ims);
})();
const imgTex = (im: HTMLImageElement | null | undefined) => {
  if (!im) return null; const t = new THREE.Texture(im); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t;
};
const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};

// la COTIZACIÓN (se tachan los renglones con pluma roja a medida que avanza el video)
export const COTIZ: { tx: string; v: string; tacha: number }[] = [
  { tx: "Servicio básico: traslado local, arreglo, velación", v: "$18.500", tacha: -1 },
  { tx: "Ataúd sencillo de madera", v: "$9.500", tacha: -1 },
  { tx: "Mejora: ataúd «de protección», sellado", v: "$11.000", tacha: 0 },
  { tx: "Embalsamamiento", v: "$4.800", tacha: 1 },
  { tx: "Bóveda de lujo, forro de bronce", v: "$14.000", tacha: 2 },
  { tx: "Urna de mármol", v: "$3.900", tacha: 3 },
  { tx: "Flores y corona de la funeraria", v: "$6.500", tacha: 4 },
  { tx: "Recargo por traslado «urgente»", v: "$3.000", tacha: 5 },
  { tx: "Gestoría y trámites", v: "$2.000", tacha: 6 },
  { tx: "Fosa y derechos de panteón", v: "$13.200", tacha: -1 },
];
const strikes = (EV as { strikes: number[] }).strikes; // segundo en que se tacha cada renglón (índice = tacha)
const drawCotiz = (g: CanvasRenderingContext2D, t: number) => {
  const Wd = 1024, Hd = 1400;
  g.fillStyle = "#f3ead6"; g.fillRect(0, 0, Wd, Hd);
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(150,120,80,${0.05 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * Wd, rnd(i, 4) * Hd, 30 + rnd(i, 5) * 60, 0, 6.3); g.fill(); }
  g.fillStyle = "#2a2219"; g.textAlign = "center";
  g.font = `900 64px "${SERIF_GRAB}"`; g.fillText("COTIZACIÓN", Wd / 2, 140);
  g.font = `700 30px "${SERIF}"`; g.fillStyle = "#5a4a36"; g.fillText("Servicios funerarios · precios en pesos", Wd / 2, 192);
  g.fillStyle = "#2a2219"; g.fillRect(80, 228, Wd - 160, 3);
  g.textAlign = "left";
  COTIZ.forEach((r, i) => {
    const y = 300 + i * 92;
    g.font = `600 33px "${FONT}"`; g.fillStyle = "#2a2219"; g.fillText(r.tx, 90, y);
    g.textAlign = "right"; g.font = `800 36px "${FONT}"`; g.fillText(r.v, Wd - 90, y); g.textAlign = "left";
    g.strokeStyle = "rgba(60,45,30,.25)"; g.lineWidth = 2; g.setLineDash([4, 8]); g.beginPath(); g.moveTo(90, y + 24); g.lineTo(Wd - 90, y + 24); g.stroke(); g.setLineDash([]);
    const ts = r.tacha >= 0 ? strikes[r.tacha] : undefined;
    if (ts !== undefined && t >= ts) {
      const k = cl((t - ts) / 0.5);
      g.strokeStyle = "#b8322a"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(84, y - 10); g.lineTo(84 + (Wd - 168) * k, y - 14 + 5 * Math.sin(k * 6)); g.stroke();
    }
  });
  const yT = 300 + COTIZ.length * 92 + 40;
  g.fillStyle = "#2a2219"; g.fillRect(80, yT - 50, Wd - 160, 3);
  g.font = `900 46px "${SERIF_GRAB}"`; g.fillText("TOTAL", 90, yT + 10);
  g.textAlign = "right"; g.fillText("$86.400", Wd - 90, yT + 10); g.textAlign = "left";
  g.font = `700 34px "${MANO}"`; g.fillStyle = "#1f2a44"; g.fillText("Firma de conformidad: ______________________", 90, Hd - 70);
};

// ---------------- piezas del mundo ----------------
type Tx = THREE.Texture | null | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V3; cast?: boolean; cc?: number }> = ({ p, s, c, r = 0.8, m = 0, e, ei = 0, map, rad = 0.02, rot, cast = true, cc = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshPhysicalMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map ?? undefined} clearcoat={cc} clearcoatRoughness={0.12} />
  </mesh>
);
// muro con canto claro en el corte (se ve el espesor, como maqueta)
const Muro: React.FC<{ p: V3; s: V3; c: string; map?: Tx }> = ({ p, s, c, map }) => (
  <group position={p}>
    <mesh receiveShadow castShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.85} map={map ?? undefined} /></mesh>
    <mesh position={[0, s[1] / 2 + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[s[0], s[2]]} /><meshStandardMaterial color="#e8dcc6" roughness={1} /></mesh>
  </group>
);
// llama de veladora (emisiva: el bloom la hace brillar) + vaso de vidrio
const Veladora: React.FC<{ p: V3; t: number; s?: number; seed?: number; light?: number; col?: string }> = ({ p, t, s = 1, seed = 0, light = 0, col = "#d9453a" }) => {
  const f = flick(t, seed);
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.035, 0.032, 0.14, 18]} /><meshStandardMaterial color={col} roughness={0.25} transparent opacity={0.8} emissive={col} emissiveIntensity={0.25 * f} /></mesh>
      <mesh position={[0, 0.165 + 0.004 * Math.sin(t * 9 + seed), 0]} scale={[1, 1.5 + 0.18 * f, 1]}><sphereGeometry args={[0.012, 10, 10]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
      {light > 0 && <pointLight position={[0, 0.25, 0.05]} intensity={light * f} distance={4.5} decay={1.6} color="#ffb35c" />}
    </group>
  );
};
// flor de cempasúchil (esfera de pétalos) en racimos deterministas
const Cempas: React.FC<{ p: V3; n: number; r: number; seed?: number }> = ({ p, n, r, seed = 1 }) => (
  <group position={p}>
    {Array.from({ length: n }).map((_, i) => {
      const a = rnd(i, seed) * 6.28, d = Math.sqrt(rnd(i, seed + 1)) * r, y = rnd(i, seed + 2) * r * 0.6;
      return <mesh key={i} position={[Math.cos(a) * d, y, Math.sin(a) * d]} castShadow><icosahedronGeometry args={[0.045 + rnd(i, seed + 3) * 0.02, 1]} /><meshStandardMaterial color={rnd(i, seed + 4) > 0.4 ? "#f39a1e" : "#ffb53b"} roughness={0.8} emissive="#5a2a00" emissiveIntensity={0.15} flatShading /></mesh>;
    })}
  </group>
);
// ATAÚD CERRADO (tapa abovedada, molduras, asas) sobre su base · etiqueta de precio colgante que gira y se da vuelta
const Ataud: React.FC<{ x: number; col: string; m: number; r: number; trim?: string }> = ({ x, col, m, r, trim = "#c9a55a" }) => {
  const z = -0.45, cc = m > 0.5 ? 1 : 0.8;
  return (
    <group position={[x, 0, z]}>
      {/* andas cubiertas con paño de terciopelo que cae hasta el piso */}
      <Box p={[0, 0.27, 0]} s={[0.8, 0.54, 2.08]} c="#2a1a17" r={0.95} rad={0.03} />
      <Box p={[0, 0.5, 0]} s={[0.9, 0.12, 2.18]} c="#5e1619" r={0.75} rad={0.03} />
      {Array.from({ length: 9 }, (_, i) => <Box key={"f" + i} p={[0, 0.5, -1.0 + i * 0.25]} s={[0.92, 0.1, 0.06]} c="#4c1114" r={0.8} rad={0.025} cast={false} />)}
      {/* cuerpo laqueado con zócalo, cintura y paneles en relieve */}
      <Box p={[0, 0.6, 0]} s={[0.7, 0.06, 2.06]} c={trim} r={0.25} m={0.9} rad={0.02} />
      <Box p={[0, 0.8, 0]} s={[0.64, 0.38, 1.98]} c={col} r={r} m={m} rad={0.05} cc={cc} />
      {[1, -1].map((sd) => [-0.62, 0, 0.62].map((q, i) => <Box key={sd + "p" + i} p={[sd * 0.322, 0.79, q]} s={[0.012, 0.24, 0.52]} c={col} r={r * 0.8} m={m} rad={0.006} cc={cc} />))}
      <Box p={[0, 0.985, 0]} s={[0.69, 0.04, 2.03]} c={trim} r={0.2} m={0.92} rad={0.015} />
      {/* tapa abovedada CERRADA en dos niveles con remate */}
      <mesh position={[0, 1.04, 0]} scale={[0.335, 0.085, 1.0]} castShadow receiveShadow geometry={rbox(2, 1, 2, 0.45)}><meshPhysicalMaterial color={col} roughness={r * 0.8} metalness={m} clearcoat={cc} clearcoatRoughness={0.08} /></mesh>
      <mesh position={[0, 1.12, 0]} scale={[0.25, 0.05, 0.86]} castShadow geometry={rbox(2, 1, 2, 0.45)}><meshPhysicalMaterial color={col} roughness={r * 0.7} metalness={m} clearcoat={cc} clearcoatRoughness={0.06} /></mesh>
      <Box p={[0, 1.165, 0]} s={[0.04, 0.012, 1.4]} c={trim} r={0.2} m={0.95} rad={0.005} cast={false} />
      {/* esquineros de bronce */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => <Box key={"e" + i} p={[sx * 0.322, 0.8, sz * 0.985]} s={[0.05, 0.4, 0.05]} c={trim} r={0.2} m={0.95} rad={0.02} />)}
      {/* barras de asas con soportes */}
      {[1, -1].map((sd) => <group key={"a" + sd}>
        <mesh position={[sd * 0.385, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.016, 0.016, 1.6, 16]} /><meshPhysicalMaterial color={trim} roughness={0.18} metalness={1} clearcoat={0.5} /></mesh>
        {[-0.7, -0.23, 0.23, 0.7].map((q, i) => <Box key={i} p={[sd * 0.355, 0.76, q]} s={[0.07, 0.05, 0.05]} c={trim} r={0.2} m={0.95} rad={0.02} cast={false} />)}
      </group>)}
    </group>
  );
};
const tagTex = (front: string, back: string, sub: string) => canvasTex(512, 600, (g) => {
  // la textura tiene las DOS caras (arriba = frente, abajo = dorso); cada plano usa su mitad con offset
  for (const [y0, tx, big] of [[0, front, false], [300, back, true]] as [number, string, boolean][]) {
    g.fillStyle = "#efe3c8"; g.fillRect(0, y0, 512, 300);
    g.strokeStyle = "#8a6a3a"; g.lineWidth = 6; g.strokeRect(14, y0 + 14, 484, 272);
    g.fillStyle = "#8a6a3a"; g.beginPath(); g.arc(40, y0 + 40, 10, 0, 6.3); g.fill();
    g.fillStyle = big ? "#9e2a24" : "#2a2219"; g.textAlign = "center";
    g.font = big ? `900 92px "${SERIF_GRAB}"` : `800 46px "${SERIF}"`;
    g.fillText(tx, 256, y0 + (big ? 170 : 150));
    g.font = `700 30px "${FONT}"`; g.fillStyle = "#5a4a36"; g.fillText(sub, 256, y0 + 240);
  }
});
const half = (t: THREE.Texture | null, top: boolean) => { if (!t) return null; const c = t.clone(); c.repeat.set(1, 0.5); c.offset.set(0, top ? 0.5 : 0); c.needsUpdate = true; return c; };

// urna (torno) — barro, madera, sencilla, mármol, metal
const Urna: React.FC<{ p: V3; c: string; r: number; m: number; h?: number; shape?: number; map?: Tx }> = ({ p, c, r, m, h = 0.32, shape = 0, map }) => {
  const pts = useMemo(() => {
    const a: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) { const y = (i / 16) * h; const q = i / 16; const w = shape === 0 ? 0.07 + 0.06 * Math.sin(q * Math.PI) : shape === 1 ? 0.085 + 0.01 * q : 0.06 + 0.07 * Math.sin(q * Math.PI * 0.9) - 0.02 * q; a.push(new THREE.Vector2(Math.max(0.03, w), y)); }
    return a;
  }, [h, shape]);
  return (
    <group position={p}>
      <mesh castShadow receiveShadow><latheGeometry args={[pts, 48]} /><meshPhysicalMaterial color={c} map={map ?? undefined} roughness={r} metalness={m} clearcoat={r < 0.7 ? 1 : 0.2} clearcoatRoughness={0.1} /></mesh>
      <mesh position={[0, h * 0.18, 0]}><torusGeometry args={[pts[3].x + 0.002, 0.006, 8, 48]} /><meshStandardMaterial color="#c9a55a" roughness={0.2} metalness={1} /></mesh>
      <mesh position={[0, h + 0.012, 0]} castShadow><cylinderGeometry args={[0.05, 0.06, 0.03, 32]} /><meshPhysicalMaterial color={c} map={map ?? undefined} roughness={r} metalness={m} clearcoat={0.6} /></mesh>
      <mesh position={[0, h + 0.04, 0]} castShadow><sphereGeometry args={[0.022, 20, 14]} /><meshStandardMaterial color="#c9a55a" roughness={0.2} metalness={1} /></mesh>
    </group>
  );
};
// silla de capilla
const Silla: React.FC<{ p: V3; vel?: Tx }> = ({ p, vel }) => (
  <group position={p}>
    <Box p={[0, 0.43, 0]} s={[0.46, 0.05, 0.44]} c="#3a2216" r={0.4} cc={0.6} rad={0.015} />
    <Box p={[0, 0.48, 0.01]} s={[0.4, 0.06, 0.38]} c="#7a1d22" r={0.85} rad={0.03} map={vel} />
    {[-0.2, 0.2].map((x, i) => <Box key={"r" + i} p={[x, 0.75, -0.2]} s={[0.04, 0.66, 0.04]} c="#3a2216" r={0.4} cc={0.6} rad={0.012} />)}
    <Box p={[0, 0.84, -0.2]} s={[0.36, 0.34, 0.035]} c="#7a1d22" r={0.85} rad={0.02} map={vel} />
    <Box p={[0, 1.06, -0.2]} s={[0.46, 0.05, 0.05]} c="#3a2216" r={0.4} cc={0.6} rad={0.015} />
    {[[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]].map(([x, z], i) => <Box key={i} p={[x, 0.21, z]} s={[0.04, 0.42, 0.04]} c="#3a2216" r={0.4} cc={0.6} rad={0.012} />)}
  </group>
);

// ---------------- LA ESCENA ----------------
const Mundo: React.FC<{ t: number; A: Assets }> = ({ t, A }) => {
  const T = useTextures();
  const fontsOk = true;
  const [retrato, fotoPapa, fotoCalle, tapa, pag] = useMemo(() => IMGS.map((k) => imgTex(A[k])), [A]);
  useEffect(() => () => { [retrato, fotoPapa, fotoCalle, tapa, pag].forEach((x) => x?.dispose()); }, [retrato, fotoPapa, fotoCalle, tapa, pag]);
  const ev = EV as { strikes: number[]; tags: number[]; book: [number, number][]; sobre: number; faros: number; lapida: number };
  // texturas de letra: recién cuando están las fuentes (si no, el lienzo dibuja con la fuente de sistema)
  const tags = useMemo(() => fontsOk ? [
    tagTex("¿Cuánto?", "$20.500", "Sellado «de protección»"), tagTex("¿Cuánto?", "$9.500", "Madera, sencillo"), tagTex("¿Cuánto?", "$14.800", "Metálico gris"),
  ] : null, [fontsOk]);
  const tagFaces = useMemo(() => tags ? tags.map((x) => ({ a: half(x, true), b: half(x, false) })) : null, [tags]);
  const urnTags = useMemo(() => fontsOk ? ["$300 - 800", "$800 - 2.500", "$$$$"].map((v, i) => canvasTex(512, 220, (g) => {
    g.fillStyle = "#efe3c8"; g.fillRect(0, 0, 512, 220); g.strokeStyle = "#8a6a3a"; g.lineWidth = 6; g.strokeRect(10, 10, 492, 200);
    g.textAlign = "center"; g.fillStyle = i === 2 ? "#9e2a24" : "#2a2219"; g.font = `900 70px "${SERIF_GRAB}"`; g.fillText(v, 256, 112);
    g.font = `700 32px "${FONT}"`; g.fillStyle = "#5a4a36"; g.fillText(["Barro de Tlaquepaque", "Urna sencilla", "Mármol"][i], 256, 178);
  })) : null, [fontsOk]);
  const vaultTags = useMemo(() => fontsOk ? ["LA QUE PIDE EL PANTEÓN", "DE LUJO · FORRO DE BRONCE"].map((v, i) => canvasTex(640, 160, (g) => {
    g.fillStyle = i ? "#2a2219" : "#efe3c8"; g.fillRect(0, 0, 640, 160); g.strokeStyle = i ? "#c9a55a" : "#8a6a3a"; g.lineWidth = 6; g.strokeRect(10, 10, 620, 140);
    g.textAlign = "center"; g.fillStyle = i ? "#e8c77a" : "#2a2219"; g.font = `800 ${i ? 33 : 38}px "${FONT}"`; g.fillText(v, 320, 94);
  })) : null, [fontsOk]);
  const lapidaTex = useMemo(() => fontsOk ? canvasTex(1024, 640, (g) => {
    g.fillStyle = "#cdbfa6"; g.fillRect(0, 0, 1024, 640);
    for (let i = 0; i < 7; i++) { g.strokeStyle = "rgba(93,78,56,.16)"; g.lineWidth = 2; g.beginPath(); const y = 60 + i * 85; g.moveTo(0, y); g.bezierCurveTo(300, y - 18, 700, y + 20, 1024, y - 6); g.stroke(); }
    g.textAlign = "center";
    const carve = (tx: string, y: number, f: string) => { g.font = f; g.fillStyle = "rgba(255,255,255,.45)"; g.fillText(tx, 512, y + 3); g.fillStyle = "#3c3125"; g.fillText(tx, 512, y); };
    carve("✝", 120, `700 70px "${SERIF_GRAB}"`);
    carve("LO QUE YO LE DIRÍA", 290, `900 76px "${SERIF_GRAB}"`);
    carve("A MI PROPIA MADRE", 390, `900 76px "${SERIF_GRAB}"`);
    carve("FUNERALES NAVARRO · ANALCO · 1958", 520, `700 36px "${SERIF_GRAB}"`);
  }) : null, [fontsOk]);
  const rotulo = useMemo(() => fontsOk ? canvasTex(1024, 200, (g) => {
    g.fillStyle = "#1e1a16"; g.fillRect(0, 0, 1024, 200); g.textAlign = "center"; g.fillStyle = "#e8c77a"; g.font = `900 92px "${SERIF_GRAB}"`; g.fillText("FUNERALES NAVARRO", 512, 130);
  }) : null, [fontsOk]);
  // la cotización se redibuja cuando cambia lo tachado (determinista en t)
  const cot = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 1400; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return { cv, tx }; }, []);
  const cotKey = fontsOk ? strikes.map((s) => (t < s ? 0 : t < s + 0.5 ? Math.round((t - s) * 30) : 99)).join(",") : "x";
  useMemo(() => { if (!fontsOk) return; drawCotiz(cot.cv.getContext("2d")!, t); cot.tx.needsUpdate = true; }, [cotKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { cot.tx.dispose(); tags?.forEach((x) => x.dispose()); urnTags?.forEach((x) => x.dispose()); vaultTags?.forEach((x) => x.dispose()); lapidaTex?.dispose(); rotulo?.dispose(); }, [cot, tags, urnTags, vaultTags, lapidaTex, rotulo]);

  const fv = flick(t, 1);
  const bookK = Math.max(0, ...ev.book.map(([a, b]) => ease((t - a) / 1.4) * (1 - ease((t - b) / 1.0))));
  const sobreK = ease((t - ev.sobre) / 1.2);
  const farosK = sm((t - ev.faros) / 0.6);
  // la pluma: cuando se tacha un renglón, la punta recorre ese renglón sobre la hoja
  let penX = -3.62, penZ = -0.86, penY = 0.80, penTilt = 0.5;
  for (let i = 0; i < strikes.length; i++) {
    const s = strikes[i]; if (t >= s - 0.4 && t < s + 0.9) {
      const row = COTIZ.findIndex((r) => r.tacha === i), k = cl((t - s) / 0.5);
      const v = 1 - (300 + row * 92 - 10) / 1400; // fracción vertical en la hoja
      penX = -4.1 + 0.08 + 0.42 * k; penZ = -1.0 + (0.5 - v) * 0.56; penY = 0.795 + (t < s ? 0.03 * (s - t) / 0.4 : 0); penTilt = 0.6;
    }
  }
  return (
    <>
      <CamRig t={t} />
      <color attach="background" args={["#1a1420"]} />
      <fog attach="fog" args={["#1c1520", 14, 70]} />
      <hemisphereLight args={["#ffd9a8", "#2a1d18", 0.28]} />
      <directionalLight position={[-8, 6, -10]} intensity={0.35} color="#9fb4ff" />
      {/* atardecer de Analco que entra de frente/arriba (única luz con sombras) */}
      <directionalLight position={[6, 14, 12]} intensity={1.25} color="#ffc28a" castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-radius={4}
        shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-near={1} shadow-camera-far={60} shadow-bias={-0.0004} shadow-normalBias={0.02} />

      {/* ===== piso y muros (casa de muñecas) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0, 0]} receiveShadow><planeGeometry args={[40, 7]} /><meshPhysicalMaterial map={T.planks} color="#9a7050" roughness={0.42} clearcoat={0.7} clearcoatRoughness={0.18} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[24.5, 0.005, 0]} receiveShadow><planeGeometry args={[7, 7]} /><meshStandardMaterial map={T.block} color="#cbb89a" roughness={0.95} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.02, 10]} receiveShadow><planeGeometry args={[80, 14]} /><meshStandardMaterial color="#3a2f28" roughness={1} /></mesh>
      {/* muro de fondo con hueco de ventana en la oficina (x -5.15..-3.75, y 1.0..2.5) */}
      <Muro p={[-6.1, 1.6, -3.1]} s={[1.9, 3.2, 0.2]} c="#b8946a" map={T.damasco} />
      <Muro p={[-2.4, 1.6, -3.1]} s={[2.7, 3.2, 0.2]} c="#b8946a" map={T.damasco} />
      <Muro p={[-4.45, 0.5, -3.1]} s={[1.4, 1.0, 0.2]} c="#b59b78" />
      <Muro p={[-4.45, 2.85, -3.1]} s={[1.4, 0.7, 0.2]} c="#b59b78" />
      <Muro p={[3.5, 1.6, -3.1]} s={[9.0, 3.2, 0.2]} c="#7a2c2c" map={T.damasco} />
      <Muro p={[11, 1.6, -3.1]} s={[6.0, 3.2, 0.2]} c="#d8c7a6" map={T.damasco} />
      <Muro p={[17.5, 1.6, -3.1]} s={[7.0, 3.2, 0.2]} c="#8d8a84" map={T.block} />
      {/* tabiques cortados entre salas (con puerta) */}
      {[-7.05, -1, 8, 14, 21].map((x, i) => <group key={i}>
        <Muro p={[x, 1.6, -2.15]} s={[0.16, 3.2, 1.7]} c="#a07a56" />
        <Muro p={[x, 1.6, 1.35]} s={[0.16, 3.2, 3.3]} c="#9c8466" />
        <Muro p={[x, 2.85, -0.75]} s={[0.16, 0.7, 1.1]} c="#9c8466" />
      </group>)}
      {/* zócalo de madera en la oficina */}
      <Box p={[-4.0, 0.45, -2.98]} s={[5.9, 0.9, 0.04]} c="#6a4228" r={0.38} rad={0.005} cast={false} map={T.lambrin} cc={0.6} />
      {[[-4.0, 5.9], [3.5, 9.0], [11, 6.0]].map(([x, w], i) => <group key={"cor" + i}>
        <Box p={[x, 3.08, -2.96]} s={[w, 0.12, 0.1]} c="#e6d3a8" r={0.45} rad={0.03} cast={false} />
        <Box p={[x, 2.99, -2.97]} s={[w, 0.04, 0.07]} c="#c9a55a" r={0.25} m={0.8} rad={0.01} cast={false} />
        <Box p={[x, 0.93, -2.94]} s={[w, 0.05, 0.06]} c="#4a2c1a" r={0.35} cc={0.6} rad={0.015} cast={false} />
        <Box p={[x, 0.06, -2.94]} s={[w, 0.12, 0.06]} c="#2e1b10" r={0.35} cc={0.6} rad={0.015} cast={false} />
      </group>)}

      {/* ===== AFUERA por la ventana: Analco al atardecer y la cúpula del templo ===== */}
      <mesh position={[-4.5, 9, -40]}><planeGeometry args={[90, 34]} /><meshBasicMaterial color="#e89a62" toneMapped={false} fog={false} /></mesh>
      <mesh position={[-4.5, 22, -39.5]}><planeGeometry args={[90, 16]} /><meshBasicMaterial color="#5b4a78" toneMapped={false} fog={false} transparent opacity={0.85} /></mesh>
      {[-14, -10.5, -8.2, 0.6, 3.2, 6.5].map((x, i) => <Box key={i} p={[x, 1.2 + rnd(i, 3) * 0.6, -9 - rnd(i, 4) * 6]} s={[3 + rnd(i, 5) * 2, 2.4 + rnd(i, 3) * 1.2, 3]} c={["#c88a5e", "#d6a77a", "#b9754e", "#e0b88a"][i % 4]} r={0.95} rad={0.05} cast={false} />)}
      {/* templo de San Sebastián de Analco: nave, cúpula con linternilla y cruz */}
      <group position={[-4.8, 0, -22]}>
        <Box p={[0, 3.2, 0]} s={[5, 6.4, 9]} c="#d5a676" r={0.95} rad={0.08} cast={false} />
        <mesh position={[0, 7.4, 0]}><cylinderGeometry args={[2.0, 2.0, 2.0, 24]} /><meshStandardMaterial color="#d9ae80" roughness={0.9} /></mesh>
        <mesh position={[0, 8.4, 0]}><sphereGeometry args={[2.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c58d5a" roughness={0.6} metalness={0.1} /></mesh>
        <mesh position={[0, 10.8, 0]}><cylinderGeometry args={[0.45, 0.45, 0.9, 12]} /><meshStandardMaterial color="#e2bb8c" roughness={0.9} /></mesh>
        <Box p={[0, 11.85, 0]} s={[0.08, 1.0, 0.08]} c="#2a2219" r={0.5} cast={false} />
        <Box p={[0, 11.95, 0]} s={[0.5, 0.08, 0.08]} c="#2a2219" r={0.5} cast={false} />
        {[-1.4, 0, 1.4].map((x, i) => <mesh key={i} position={[x, 4.6, 4.52]}><planeGeometry args={[0.6, 1.2]} /><meshBasicMaterial color="#ffcf7a" toneMapped={false} /></mesh>)}
      </group>
      {[-14, -10.5, -8.2, 0.6, 3.2, 6.5].map((x, i) => [0, 1].map((k) => <mesh key={i + "_" + k} position={[x - 0.6 + k * 1.2, 1.6 + rnd(i, 3) * 0.6, -7.45 - rnd(i, 4) * 6]}><planeGeometry args={[0.45, 0.6]} /><meshBasicMaterial color={(i + k) % 3 ? "#ffcf8a" : "#3a2a24"} toneMapped={false} /></mesh>))}
      {[-5.35, -3.55].map((x, i) => <group key={i}>
        {Array.from({ length: 5 }, (_, j) => <Box key={j} p={[x + (j - 2) * 0.07, 1.85, -2.93 + (j % 2) * 0.03]} s={[0.075, 1.9, 0.05]} c={j % 2 ? "#8a3b2a" : "#9c4632"} r={0.92} cast={false} />)}
      </group>)}
      <Box p={[-4.45, 2.82, -2.9]} s={[2.2, 0.04, 0.04]} c="#3a2416" m={0.4} r={0.5} rad={0.01} cast={false} />
      <group position={[-4.85, 1.04, -2.95]}>
        <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.1, 0.075, 0.2, 18]} /><meshStandardMaterial color="#a8562e" roughness={0.9} /></mesh>
        <Cempas p={[0, 0.2, 0]} n={9} r={0.12} seed={31} />
      </group>
      <Veladora p={[-4.05, 1.04, -2.95]} t={t} s={1.2} seed={7} light={0.6} />
      {/* marco de la ventana y reja */}
      <Box p={[-4.45, 1.0, -3.0]} s={[1.5, 0.08, 0.36]} c="#5b3b26" r={0.6} />
      {[-4.8, -4.45, -4.1].map((x, i) => <Box key={i} p={[x, 1.75, -3.05]} s={[0.018, 1.5, 0.018]} c="#1d1b1a" m={0.6} r={0.5} rad={0.008} cast={false} />)}

      {/* ===== OFICINA de Ernesto ===== */}
      <Box p={[-4.0, 0.39, -1.3]} s={[2.2, 0.78, 1.0]} c="#4a2c1a" r={0.4} rad={0.03} cc={0.7} map={T.lambrin} />
      <Box p={[-4.0, 0.775, -1.3]} s={[2.3, 0.04, 1.08]} c="#5d3a22" r={0.3} rad={0.012} cc={1} />
      <mesh position={[-4.0, 0.796, -1.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.5, 0.7]} /><meshStandardMaterial color="#2f4a35" roughness={0.9} /></mesh>
      {/* sillón de Ernesto (vacío) y silla del cliente */}
      <Box p={[-4.0, 0.5, -2.25]} s={[0.7, 0.14, 0.6]} c="#4a1e16" r={0.45} rad={0.05} cc={0.5} />
      <Box p={[-4.0, 1.05, -2.52]} s={[0.7, 1.0, 0.14]} c="#4a1e16" r={0.45} rad={0.06} cc={0.5} />
      {[-0.36, 0.36].map((dx, i) => <Box key={"br" + i} p={[-4.0 + dx, 0.66, -2.28]} s={[0.1, 0.18, 0.62]} c="#4a1e16" r={0.45} rad={0.04} cc={0.5} />)}
      {/* archiveros verdes, crucifijo, foto de la calle, foto con el retrato de Don Refugio */}
      {[-6.55, -5.93].map((x, ci) => (
        <group key={ci}>
          <Box p={[x, 0.7, -2.6]} s={[0.6, 1.4, 0.6]} c={ci ? "#456149" : "#3f5a45"} m={0.4} r={0.45} />
          {[0.2, 0.53, 0.86, 1.19].map((y, i) => (ci === 0 && i === 3) ? null : (
            <group key={i}>
              <Box p={[x, y, -2.295]} s={[0.54, 0.3, 0.012]} c={ci ? "#4b684f" : "#44614a"} m={0.4} r={0.42} cast={false} />
              <Box p={[x, y + 0.06, -2.285]} s={[0.16, 0.06, 0.008]} c="#b8a679" m={0.85} r={0.3} cast={false} />
              <Box p={[x, y + 0.06, -2.28]} s={[0.13, 0.04, 0.004]} c={["#efe6cf", "#f3ecd8", "#e9dfc4"][(i + ci) % 3]} r={0.9} cast={false} />
              <Box p={[x, y - 0.04, -2.275]} s={[0.22, 0.035, 0.03]} c="#c9b98f" m={0.85} r={0.28} rad={0.008} cast={false} />
            </group>
          ))}
        </group>
      ))}
      {/* cajón de arriba ABIERTO con carpetas de trámites asomando */}
      <group position={[-6.55, 1.19, -2.05]}>
        <Box p={[0, -0.07, 0]} s={[0.54, 0.16, 0.5]} c="#3a5340" m={0.4} r={0.45} />
        <Box p={[0, 0, 0.255]} s={[0.54, 0.3, 0.012]} c="#44614a" m={0.4} r={0.42} />
        <Box p={[0, -0.04, 0.27]} s={[0.22, 0.035, 0.03]} c="#c9b98f" m={0.85} r={0.28} rad={0.008} />
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} position={[0, 0.06, -0.2 + i * 0.05]} rotation={[-0.08 + (i % 3) * 0.04, 0, 0]}>
            <Box p={[0, 0, 0]} s={[0.48, 0.24, 0.006]} c={["#d9b56a", "#e2c27e", "#cfa95c", "#efe6cf"][i % 4]} r={0.85} cast={false} />
            <Box p={[-0.16 + (i % 4) * 0.1, 0.135, 0]} s={[0.09, 0.04, 0.006]} c={["#d9b56a", "#e2c27e", "#cfa95c", "#efe6cf"][i % 4]} r={0.85} cast={false} />
          </group>
        ))}
      </group>
      {/* encima: cajas de expedientes, pila de carpetas y el sello */}
      <Box p={[-5.93, 1.52, -2.62]} s={[0.46, 0.24, 0.38]} c="#a8875a" r={0.8} rad={0.01} />
      <Box p={[-5.93, 1.52, -2.42]} s={[0.2, 0.08, 0.004]} c="#efe6cf" r={0.9} cast={false} />
      {[0, 1, 2, 3, 4].map((i) => <Box key={i} p={[-6.58 + (i % 2) * 0.02, 1.415 + i * 0.022, -2.62]} s={[0.4, 0.018, 0.3]} c={["#d9b56a", "#efe6cf", "#cfa95c", "#e2c27e", "#d9b56a"][i]} r={0.85} rad={0.004} />)}
      <Box p={[-6.4, 1.555, -2.55]} s={[0.05, 0.08, 0.05]} c="#2a1a12" r={0.5} rad={0.01} />
      <Box p={[-2.6, 2.25, -2.97]} s={[0.05, 0.7, 0.04]} c="#3a2416" r={0.5} rad={0.008} />
      <Box p={[-2.6, 2.38, -2.97]} s={[0.36, 0.05, 0.04]} c="#3a2416" r={0.5} rad={0.008} />
      <group position={[-5.9, 1.9, -2.98]}>
        <Box p={[0, 0, 0]} s={[0.74, 0.56, 0.04]} c="#2b1b10" r={0.5} rad={0.01} />
        <mesh position={[0, 0, 0.025]}><planeGeometry args={[0.64, 0.46]} /><meshStandardMaterial map={fotoPapa ?? undefined} color={fotoPapa ? "#fff" : "#887"} roughness={0.6} /></mesh>
      </group>
      <group position={[-1.75, 1.85, -2.98]}>
        <Box p={[0, 0, 0]} s={[0.62, 0.46, 0.04]} c="#2b1b10" r={0.5} rad={0.01} />
        <mesh position={[0, 0, 0.025]}><planeGeometry args={[0.54, 0.38]} /><meshStandardMaterial map={fotoCalle ?? undefined} color={fotoCalle ? "#fff" : "#887"} roughness={0.6} /></mesh>
      </group>
      {/* sobre el escritorio: veladora-lámpara (la LUZ de la oficina), retrato, cotización, pluma, sobre amarillo, la Carpeta */}
      <Veladora p={[-5.0, 0.795, -1.55]} t={t} s={1.6} seed={1} light={1.5} />
      <pointLight position={[-4.2, 1.8, 0.4]} intensity={0.95} distance={7} color="#ffd6a0" />
      <group position={[-4.72, 0.795, -1.72]} rotation={[-0.12, 0.25, 0]}>
        <Box p={[0, 0.2, 0]} s={[0.36, 0.42, 0.03]} c="#6b4a22" m={0.5} r={0.35} rad={0.01} />
        <mesh position={[0, 0.2, 0.017]}><planeGeometry args={[0.3, 0.36]} /><meshStandardMaterial map={retrato ?? undefined} color={retrato ? "#fff" : "#887"} roughness={0.5} /></mesh>
      </group>
      <mesh position={[-3.85, 0.797, -0.98]} rotation={[-Math.PI / 2, 0, 0.04]} receiveShadow><planeGeometry args={[0.5, 0.68]} /><meshStandardMaterial map={cot.tx} color="#cfc6b4" roughness={0.9} /></mesh>
      {/* pluma fuente: cuerpo negro con anillo dorado; la punta sigue el renglón que se tacha */}
      <group position={[penX, penY + 0.035, penZ]} rotation={[0, 0.5, penTilt]}>
        <mesh castShadow><cylinderGeometry args={[0.009, 0.007, 0.15, 12]} /><meshStandardMaterial color="#141210" roughness={0.25} metalness={0.3} /></mesh>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.012, 12]} /><meshStandardMaterial color="#d4b05c" roughness={0.25} metalness={0.9} /></mesh>
        <mesh position={[0, -0.085, 0]}><coneGeometry args={[0.007, 0.02, 10]} /><meshStandardMaterial color="#d4b05c" roughness={0.2} metalness={0.9} /></mesh>
      </group>
      {/* sobre amarillo (la solapa se abre al final) */}
      <group position={[-3.1, 0.8, -1.6]} rotation={[0, -0.18, 0]}>
        <Box p={[0, 0.004, 0]} s={[0.36, 0.008, 0.24]} c="#e2b64a" r={0.8} rad={0.002} />
        <group position={[0, 0.009, -0.12]} rotation={[-Math.PI * 0.92 * sobreK, 0, 0]}>
          <mesh position={[0, 0, 0.07]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.18, 3, Math.PI / 2 - Math.PI / 3, (2 * Math.PI) / 3]} /><meshStandardMaterial color="#d6a73c" roughness={0.8} side={THREE.DoubleSide} /></mesh>
        </group>
        {sobreK > 0.3 && <Box p={[0, 0.012 + 0.06 * sm((sobreK - 0.3) / 0.7), 0.02 - 0.08 * sm((sobreK - 0.3) / 0.7)]} s={[0.3, 0.004, 0.2]} c="#f4ecd9" r={0.9} rad={0.001} />}
      </group>
      {/* LA CARPETA DE LA FAMILIA: libro con su tapa real que se abre en la página 25 */}
      <group position={[-2.65, 0.8, -1.02]} rotation={[0, -0.08, 0]}>
        <Box p={[0, 0.018, 0]} s={[0.34, 0.036, 0.46]} c="#f4ecd9" r={0.9} rad={0.004} />
        <mesh position={[0.0, 0.0375, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.33, 0.45]} /><meshStandardMaterial map={pag ?? undefined} color={pag ? "#fff" : "#eee"} roughness={0.9} /></mesh>
        <group position={[-0.17, 0.04, 0]} rotation={[0, 0, Math.PI * 0.97 * bookK]}>
          <mesh position={[0.17, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow><planeGeometry args={[0.35, 0.47]} /><meshStandardMaterial map={tapa ?? undefined} color={tapa ? "#fff" : "#7a2a22"} roughness={0.6} side={THREE.FrontSide} /></mesh>
          <mesh position={[0.17, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.35, 0.47]} /><meshStandardMaterial color="#efe6d2" roughness={0.9} /></mesh>
        </group>
      </group>

      {/* ===== SALA DE EXHIBICIÓN ===== */}
      {tagFaces && <>
        <AtaudTag x={0.3} col="#7c5a3a" m={0.85} r={0.28} trim="#e0c27a" faces={tagFaces[0]} flipAt={ev.tags[0]} t={t} seed={1} />
        <AtaudTag x={1.9} col="#8a5a32" m={0.0} r={0.5} trim="#b08850" faces={tagFaces[1]} flipAt={ev.tags[1]} t={t} seed={2} />
        <AtaudTag x={3.5} col="#7e848a" m={0.8} r={0.3} trim="#c9c9c9" faces={tagFaces[2]} flipAt={ev.tags[2]} t={t} seed={3} />
      </>}
      {/* sala: lambrín de madera y cortinas de terciopelo a los lados del fondo */}
      <Box p={[3.5, 0.47, -2.98]} s={[9.0, 0.94, 0.04]} c="#4e2e1a" r={0.38} rad={0.005} cast={false} map={T.lambrin} cc={0.6} />
      <Box p={[11, 0.47, -2.98]} s={[6.0, 0.94, 0.04]} c="#5b3b26" r={0.38} rad={0.005} cast={false} map={T.lambrin} cc={0.6} />
      {/* alfombra de pasillo bajo los ataúdes y cuadros con marco dorado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.2, 0.006, 0.9]} receiveShadow><planeGeometry args={[7.6, 1.3]} /><meshStandardMaterial map={T.runner} color="#ffffff" roughness={0.95} /></mesh>
      {[[1.1, 2.3], [5.9, 2.3]].map(([x, y], i) => <group key={"cu" + i} position={[x, y, -2.96]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.62, 0.05]} c="#c9a55a" r={0.25} m={0.9} rad={0.02} />
        <mesh position={[0, 0, 0.028]}><planeGeometry args={[0.76, 0.48]} /><meshStandardMaterial map={(i ? fotoCalle : fotoPapa) ?? undefined} color="#fff" roughness={0.5} /></mesh>
      </group>)}
      {[-0.6, 7.6].map((x, i) => <group key={i} position={[x, 1.65, -2.85]}>{Array.from({ length: 7 }).map((_, j) => <mesh key={j} position={[(j - 3) * 0.11, 0, 0.03 * Math.sin(j * 1.7)]}><cylinderGeometry args={[0.07, 0.08, 3.1, 16]} /><meshPhysicalMaterial color="#6a1a1e" roughness={0.6} sheen={1} sheenColor="#ff9a8a" sheenRoughness={0.4} /></mesh>)}</group>)}
      {/* lámparas de la sala */}
      {[0.3, 1.9, 3.5, 6.2].map((x, i) => <group key={i} position={[x, 2.9, -0.4]}>
        <mesh><cylinderGeometry args={[0.16, 0.22, 0.14, 20, 1, true]} /><meshStandardMaterial color="#c9a55a" metalness={0.8} roughness={0.35} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.06, 12, 12]} /><meshBasicMaterial color="#ffe0a8" toneMapped={false} /></mesh>
        <pointLight position={[0, -0.2, 0]} intensity={1.4} distance={5} decay={1.6} color="#ffd29a" />
      </group>)}
      {/* bóvedas: la básica de concreto y la de lujo (metal con forro de bronce) */}
      <group position={[5.3, 0, -0.9]}>
        <Box p={[0, 0.36, 0]} s={[0.95, 0.72, 2.3]} c="#8f9192" r={0.95} map={T.concrete} rad={0.03} />
        {vaultTags && <mesh position={[0, 0.42, 1.152]}><planeGeometry args={[0.8, 0.2]} /><meshStandardMaterial map={vaultTags[0]} roughness={0.8} /></mesh>}
      </group>
      <group position={[7.0, 0, -0.9]}>
        <Box p={[0, 0.38, 0]} s={[1.0, 0.76, 2.35]} c="#3b3430" r={0.25} m={0.7} rad={0.05} />
        <Box p={[0, 0.78, 0]} s={[1.04, 0.06, 2.39]} c="#c2884a" r={0.2} m={0.95} rad={0.02} />
        <Box p={[0, 0.06, 0]} s={[1.04, 0.06, 2.39]} c="#c2884a" r={0.2} m={0.95} rad={0.02} />
        {vaultTags && <mesh position={[0, 0.42, 1.177]}><planeGeometry args={[0.85, 0.21]} /><meshStandardMaterial map={vaultTags[1]} roughness={0.5} /></mesh>}
      </group>
      {/* repisa de urnas en la pared */}
      <Box p={[2.0, 1.3, -2.8]} s={[3.6, 0.05, 0.42]} c="#5b3b26" r={0.5} rad={0.01} />
      <Urna p={[0.7, 1.325, -2.8]} c="#b5683a" r={0.85} m={0} shape={0} />
      <Urna p={[1.35, 1.325, -2.8]} c="#7a5634" r={0.6} m={0} shape={1} h={0.28} />
      <Urna p={[2.0, 1.325, -2.8]} c="#8e8a84" r={0.5} m={0.2} shape={2} />
      <Urna p={[2.65, 1.325, -2.8]} c="#5d6a74" r={0.3} m={0.8} shape={0} h={0.34} />
      <Urna p={[3.3, 1.325, -2.8]} r={0.12} m={0.0} shape={2} h={0.36} map={T.marmol} c="#cfc8bc" />
      {urnTags && [[0.7, 0], [2.0, 1], [3.3, 2]].map(([x, i]) => <mesh key={i} position={[x, 1.2, -2.565]}><planeGeometry args={[0.36, 0.155]} /><meshStandardMaterial map={urnTags[i]} roughness={0.8} /></mesh>)}

      {/* ===== CAPILLA de velación ===== */}
      <Box p={[11, 0.08, -2.3]} s={[2.6, 0.16, 1.1]} c="#5b3b26" r={0.6} />
      <Box p={[11, 1.95, -2.95]} s={[0.1, 1.3, 0.06]} c="#c9a55a" m={0.85} r={0.3} rad={0.01} />
      <Box p={[11, 2.25, -2.95]} s={[0.62, 0.1, 0.06]} c="#c9a55a" m={0.85} r={0.3} rad={0.01} />
      <Cempas p={[10.0, 0.18, -2.3]} n={42} r={0.38} seed={3} />
      <Cempas p={[12.0, 0.18, -2.3]} n={42} r={0.38} seed={5} />
      <group position={[11, 0, -1.9]}>
        {/* corona de flores en su tripié */}
        <Box p={[0, 0.6, 0]} s={[0.04, 1.2, 0.04]} c="#2d2622" r={0.5} rad={0.01} />
        <mesh position={[0, 1.35, 0]} castShadow><torusGeometry args={[0.32, 0.09, 12, 32]} /><meshStandardMaterial color="#efe9df" roughness={0.9} /></mesh>
        <Cempas p={[0, 1.08, 0.04]} n={16} r={0.14} seed={9} />
      </group>
      {Array.from({ length: 14 }).map((_, i) => <Veladora key={i} p={[9.7 + (i % 7) * 0.42, 0.16, -2.55 + Math.floor(i / 7) * 0.32]} t={t} seed={i * 1.7} col={i % 3 ? "#d9453a" : "#e8d9b5"} light={i === 3 || i === 10 ? 1.2 : 0} />)}
      {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((c) => <Silla key={r + "_" + c} p={[9.4 + c * 0.66, 0, 0.1 + r * 0.9]} vel={T.terciopelo} />))}
      <pointLight position={[11, 2.6, 0.5]} intensity={1.1} distance={7} color="#ffd6a0" />
      <spotLight position={[11, 3.0, 0.6]} target-position={[11, 1.4, -2.9]} angle={0.45} penumbra={0.8} intensity={6} distance={7} color="#ffe2b0" />

      {/* ===== COCHERA con la carroza ===== */}
      <group position={[17.4, 0, -0.9]}>
        <Box p={[0, 0.62, 0]} s={[4.8, 0.7, 1.75]} c="#0e0e12" r={0.15} m={0.5} rad={0.18} cc={1} />
        <Box p={[-0.4, 1.28, 0]} s={[3.6, 0.72, 1.62]} c="#0e0e12" r={0.15} m={0.5} rad={0.2} cc={1} />
        <Box p={[1.95, 0.98, 0]} s={[0.95, 0.12, 1.5]} c="#0e0e12" r={0.15} m={0.5} rad={0.06} cc={1} />
        {[[-1.6, 0.92], [1.6, 0.92], [-1.6, -0.92], [1.6, -0.92]].map(([x, z], i) => <mesh key={"gb" + i} position={[x, 0.42, z]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.42, 0.42, 0.14, 32, 1, true, -Math.PI / 2, Math.PI]} /><meshPhysicalMaterial color="#0e0e12" roughness={0.15} metalness={0.5} clearcoat={1} side={THREE.DoubleSide} /></mesh>)}
        {[2.47, -2.47].map((x, i) => <Box key={"pg" + i} p={[x, 0.38, 0]} s={[0.1, 0.12, 1.8]} c="#e8e8e8" m={1} r={0.08} rad={0.05} />)}
        <Box p={[-0.4, 1.68, 0]} s={[3.2, 0.03, 1.4]} c="#d8d8d8" m={1} r={0.12} rad={0.01} />
        <Box p={[-0.35, 1.3, 0]} s={[3.3, 0.5, 1.64]} c="#20282e" r={0.03} m={0.9} rad={0.1} cc={1} />
        {/* cortinas plisadas detrás del vidrio lateral y landau cromado */}
        {[1, -1].map((sd) => <group key={sd}>
          {Array.from({ length: 11 }, (_, i) => <Box key={i} p={[-1.85 + i * 0.3, 1.3, sd * (0.832 + (i % 2) * 0.008)]} s={[0.33, 0.4, 0.012]} c={i % 2 ? "#5e1a1d" : "#702327"} r={0.9} cast={false} />)}
          <Box p={[0, 0.94, sd * 0.885]} s={[4.7, 0.035, 0.02]} c="#d8d8d8" m={0.95} r={0.15} rad={0.008} cast={false} />
          <Box p={[0, 0.42, sd * 0.885]} s={[4.5, 0.03, 0.02]} c="#c8c8c8" m={0.95} r={0.2} rad={0.008} cast={false} />
          <mesh position={[-1.72, 1.3, sd * 0.83]} rotation={[0, sd > 0 ? 0 : Math.PI, 0]}><torusGeometry args={[0.16, 0.022, 10, 28, Math.PI]} /><meshStandardMaterial color="#d6d6d6" metalness={0.95} roughness={0.15} /></mesh>
          <Box p={[-1.95, 1.28, sd * 0.83]} s={[0.36, 0.44, 0.012]} c="#1a1a20" r={0.2} m={0.7} cast={false} />
        </group>)}
        {[[-1.6, 0.98], [1.6, 0.98], [-1.6, -0.98], [1.6, -0.98]].map(([x, z], i) => <mesh key={"h" + i} position={[x, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.02, 24]} /><meshStandardMaterial color="#d8d8d8" metalness={0.95} roughness={0.15} /></mesh>)}
        {Array.from({ length: 6 }, (_, i) => <Box key={"g" + i} p={[2.465, 0.56 + i * 0.045, 0]} s={[0.03, 0.02, 0.86]} c="#d0d0d0" m={1} r={0.1} cast={false} />)}
        <Box p={[2.0, 1.3, 0]} s={[0.04, 0.4, 1.4]} c="#3b4a55" r={0.06} m={0.9} rad={0.02} cast={false} />
        {[[-1.6, 0.86], [1.6, 0.86], [-1.6, -0.86], [1.6, -0.86]].map(([x, z], i) => <mesh key={i} position={[x, 0.34, z]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.34, 0.34, 0.22, 40]} /><meshStandardMaterial color="#151515" roughness={0.7} /></mesh>)}
        <Box p={[2.42, 0.72, 0]} s={[0.05, 0.2, 1.4]} c="#0e0e12" r={0.15} m={0.5} rad={0.01} cc={1} />
        {[0.55, -0.55].map((z, i) => <group key={i} position={[2.44, 0.86, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[0.12, 0.12, 0.08, 40]} /><meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.08} /></mesh>
          <mesh position={[0, -0.045, 0]}><sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color={farosK > 0.05 ? "#fff6dc" : "#cfd6dc"} emissive="#fff1d0" emissiveIntensity={4 * farosK} roughness={0.05} clearcoat={1} toneMapped={farosK < 0.05} /></mesh>
        </group>)}
        <Box p={[2.44, 0.67, 0]} s={[0.04, 0.36, 0.96]} c="#e8e8e8" m={1} r={0.08} rad={0.03} cast={false} />
        {farosK > 0.05 && <spotLight position={[2.6, 0.86, 0]} target-position={[8, 0.2, 0]} angle={0.5} penumbra={0.6} intensity={3 * farosK} distance={9} color="#fff1d0" />}
        {/* cortinas de la ventana trasera */}
        <Box p={[-1.9, 1.3, 0]} s={[0.05, 0.42, 1.5]} c="#7a1f22" r={0.9} rad={0.01} />
      </group>
      <Box p={[17.5, 1.5, -2.95]} s={[4.6, 2.6, 0.06]} c="#5a5650" m={0.5} r={0.6} rad={0.01} />
      {Array.from({ length: 9 }).map((_, i) => <Box key={i} p={[17.5, 0.35 + i * 0.29, -2.9]} s={[4.6, 0.03, 0.02]} c="#3e3b36" m={0.5} r={0.6} rad={0.005} cast={false} />)}
      <pointLight position={[17.5, 2.9, 0.5]} intensity={0.55} distance={7} color="#ffe2b8" />
      <pointLight position={[19.8, 2.4, 2.6]} intensity={0.7} distance={6} color="#ffe9cc" />

      {/* ===== PATIO: nicho de cantera, lápida tallada, pirul, macetas de barro con cempasúchil ===== */}
      <group position={[24.6, 0, -2.75]}>
        <Box p={[0, 1.55, 0]} s={[5.6, 3.1, 0.6]} c="#d6c09a" r={0.9} rad={0.04} map={T.block} />
        <Box p={[0, 3.18, 0.05]} s={[5.9, 0.18, 0.75]} c="#c4ab84" r={0.85} rad={0.04} />
        <Box p={[0, 3.32, 0.02]} s={[5.7, 0.1, 0.65]} c="#b39a72" r={0.85} rad={0.03} />
        <Box p={[0, 0.08, 0.1]} s={[5.9, 0.16, 0.8]} c="#b39a72" r={0.85} rad={0.03} />
        {[-2, -1, 1, 2].map((c) => [0, 1, 2].map((r) => <Box key={c + "_" + r} p={[c * 1.05, 0.62 + r * 0.92, 0.29]} s={[0.92, 0.78, 0.04]} c={rnd(c * 3 + r, 2) > 0.5 ? "#bfae90" : "#cbbb9e"} r={0.95} rad={0.012} cast={false} />))}
        <mesh position={[0, 1.55, 0.315]}><planeGeometry args={[1.0, 2.6 * 0.6]} /><meshStandardMaterial map={lapidaTex ?? undefined} color={lapidaTex ? "#fff" : "#cdbfa6"} roughness={0.95} /></mesh>
        <Cempas p={[0, 0.1, 0.65]} n={30} r={0.32} seed={11} />
        {[-0.55, 0.55].map((x, i) => <Veladora key={i} p={[x, 0.0, 0.6]} t={t} s={1.5} seed={20 + i} light={i ? 0.9 : 0} col="#e8d9b5" />)}
      </group>
      {[[22.2, 1.4], [27.0, 1.2], [22.8, -0.6]].map(([x, z], i) => <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.24, 0.17, 0.4, 20]} /><meshStandardMaterial color="#a8562e" roughness={0.9} /></mesh>
        <Cempas p={[0, 0.42, 0]} n={14} r={0.2} seed={30 + i} />
      </group>)}
      <group position={[27.0, 0, -1.2]}>
        <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.13, 0.22, 2.8, 10]} /><meshStandardMaterial color="#5a4433" roughness={1} /></mesh>
        {Array.from({ length: 46 }).map((_, i) => <mesh key={i} position={[(rnd(i, 7) - 0.5) * 2.8, 2.3 + rnd(i, 8) * 1.8, (rnd(i, 9) - 0.5) * 1.9]} scale={[1, 0.8, 1]} castShadow><sphereGeometry args={[0.32 + rnd(i, 10) * 0.28, 20, 14]} /><meshStandardMaterial color={["#56743a", "#4a6831", "#6a8a44", "#3f5a2b"][Math.floor(rnd(i, 11) * 4)]} roughness={0.85} /></mesh>)}
      </group>
      {/* rótulo sobre la entrada de la oficina */}
      {rotulo && <mesh position={[-4.0, 3.4, -3.05]}><planeGeometry args={[3.0, 0.58]} /><meshStandardMaterial map={rotulo} roughness={0.6} emissive="#e8c77a" emissiveIntensity={0.08} emissiveMap={rotulo} /></mesh>}
      <Post bloom={0.45 + 0.08 * fv} threshold={0.97} ao exposure={1.0} env={0.45} />
    </>
  );
};

// ataúd con su etiqueta de dos caras (frente «¿Cuánto?» → dorso con el precio)
const AtaudTag: React.FC<{ x: number; col: string; m: number; r: number; trim: string; faces: { a: THREE.Texture | null; b: THREE.Texture | null }; flipAt: number; t: number; seed: number }> = ({ x, col, m, r, trim, faces, flipAt, t, seed }) => {
  const fl = ease((t - flipAt) / 0.9);
  const sway = Math.sin(t * 1.3 + seed) * 0.14 * (1 - fl * 0.7) + Math.sin(t * 0.7 + seed * 2) * 0.05;
  return (
    <group>
      <Ataud x={x} col={col} m={m} r={r} trim={trim} />
      <group position={[x, 1.13, -0.45 + 1.06]} rotation={[0, 0, sway * 0.4]}>
        <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.002, 0.002, 0.1, 4]} /><meshBasicMaterial color="#d8c9a6" /></mesh>
        <group position={[0, -0.16, 0]} rotation={[0, sway + Math.PI * fl, 0]}>
          <mesh castShadow><boxGeometry args={[0.24, 0.14, 0.004]} /><meshStandardMaterial color="#efe3c8" roughness={0.85} /></mesh>
          <mesh position={[0, 0, 0.0026]}><planeGeometry args={[0.24, 0.14]} /><meshStandardMaterial map={faces.a ?? undefined} roughness={0.85} /></mesh>
          <mesh position={[0, 0, -0.0026]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.24, 0.14]} /><meshStandardMaterial map={faces.b ?? undefined} roughness={0.85} /></mesh>
        </group>
      </group>
    </group>
  );
};

export const MundoFE: React.FC<{ t: number }> = ({ t }) => {
  const [A, setA] = useState<Assets | null>(null);
  const [h] = useState(() => delayRender("mundo: fuentes + imágenes"));
  useEffect(() => { let on = true; loadAll().then((a) => { if (on) setA(a); }); return () => { on = false; }; }, []);
  // se suelta recién cuando el lienzo ya está montado (su propio delayRender cubre el 1er cuadro)
  useEffect(() => { if (A) continueRender(h); }, [A, h]);
  useEffect(() => () => continueRender(h), [h]);
  if (!A) return null;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Mundo t={t} A={A} />
    </ThreeCanvas>
  );
};
