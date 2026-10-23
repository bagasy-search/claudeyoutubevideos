// wongen01 · EL MUNDO: la cocina del takeout de Mr. Lau, en CORTE (sin la pared de adelante).
// Pared del fondo de azulejo blanco engrasado; al centro LA ESTUFA DE WOK de acero con el wok de hierro negro y el quemador
// "turbina" (el fuego sube por los costados); campana con tubos de luz y el riel de comandas. A la izquierda la mesada con la
// FILA DE POLVOS BLANCOS (sal, azúcar, pimienta blanca, MSG) y LAS DOS SOJAS; más a la izquierda LA HORNALLA DE CASA con la
// sartén de hierro (la llamita azul: "tu cocina te miente"). A la derecha la arrocera grande y el carro de BANDEJAS de arroz
// frente a la cámara fría. Lejos, en negro: EL GRANO DE ARROZ EN MACRO (fresco = mojado y pegado / dormido = duro y suelto).
// UNA escena y UNA cámara para todo el video; los eventos se clavan a la voz desde Main. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export type V = [number, number, number];

// ---------------- medidas (metros) ----------------
const WOK = { x: -0.35, y: 0.99, z: -1.95, R: 0.36, D: 0.15 }; // y = fondo del wok
const TOP = 0.92; // mesada / tapa de la estufa
// ---------------- puntos del mundo ----------------
export const PT = {
  wok: [WOK.x, WOK.y + 0.06, WOK.z] as V,
  wokRim: [WOK.x + WOK.R, WOK.y + WOK.D, WOK.z] as V,
  fuego: [WOK.x, WOK.y - 0.05, WOK.z + 0.3] as V,
  olla: [0.45, 1.05, -1.95] as V,
  polvos: [-1.75, TOP + 0.08, -2.15] as V,
  soja: [-1.18, TOP + 0.14, -2.2] as V,
  sojaLight: [-1.28, TOP + 0.14, -2.2] as V,
  sojaDark: [-1.08, TOP + 0.14, -2.2] as V,
  plato: [-0.95, TOP + 0.03, -1.65] as V,
  arrocera: [1.55, TOP + 0.25, -2.15] as V,
  bandejas: [2.85, 1.1, -1.2] as V,
  camara: [3.5, 1.2, -1.2] as V,
  comandas: [-0.2, 2.02, -1.55] as V,
  campana: [-0.2, 2.3, -2.0] as V,
  cajas: [0.95, TOP + 0.1, -1.55] as V,
  casa: [-3.0, 0.95, -1.4] as V,         // la sartén de hierro sobre la hornalla de casa
  casaHorn: [-3.0, 0.9, -1.4] as V,
  macro: [24, 1.2, 0] as V,              // escenario del grano de arroz
  macroL: [23.55, 1.2, 0] as V,
  macroR: [24.45, 1.2, 0] as V,
};

// ---------------- CÁMARA (keyframes globales) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([0.6, 1.7, 1.6]), l: v3([-0.3, 1.0, -1.9]), fov: 40 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  p.x += Math.sin(t * 0.53) * 0.008; p.y += Math.sin(t * 0.71 + 1) * 0.006; // cámara en mano, nunca quieta
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

// ---------------- texturas procedurales ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const label = (txt: string, sub: string, bg: string, fg: string, w = 256, h = 128) => mk(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
  g.fillStyle = fg; g.textAlign = "center"; g.font = `900 ${Math.round(h * 0.36)}px Arial`; g.fillText(txt, w / 2, h * 0.52);
  if (sub) { g.font = `700 ${Math.round(h * 0.17)}px Arial`; g.fillText(sub, w / 2, h * 0.8); }
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(120,90,40,${0.05 + rnd(i, 3) * 0.08})`; g.beginPath(); g.arc(rnd(i, 4) * w, rnd(i, 5) * h, 2 + rnd(i, 6) * 8, 0, 6.3); g.fill(); } // grasa
});
const useCocina = () => useMemo(() => ({
  // azulejo blanco 15×7,5 con junta gris y grasa que sube desde la estufa
  tile: mk(1024, 1024, (g) => {
    g.fillStyle = "#8f8a80"; g.fillRect(0, 0, 1024, 1024);
    for (let r = 0; r < 16; r++) for (let c = 0; c < 8; c++) {
      const off = (r % 2) * 64, x = c * 128 + off, y = r * 64, v = 228 + rnd(r * 8 + c, 1) * 18;
      for (const xx of [x, x - 1024]) {
        const gr = g.createLinearGradient(0, y, 0, y + 60); gr.addColorStop(0, `rgb(${v},${v},${v - 6})`); gr.addColorStop(1, `rgb(${v - 22},${v - 22},${v - 30})`);
        g.fillStyle = gr; g.fillRect(xx + 3, y + 3, 122, 58);
        g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(xx + 6, y + 6, 116, 4);
      }
    }
    for (let i = 0; i < 160; i++) { const x = rnd(i, 1) * 1024, y = 500 + rnd(i, 2) * 524, r = 30 + rnd(i, 3) * 120; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(140,100,40,${0.06 + rnd(i, 4) * 0.08})`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 40; i++) { const x = rnd(i, 7) * 1024, y = 600 + rnd(i, 8) * 300; g.strokeStyle = `rgba(150,110,50,${0.12 + rnd(i, 9) * 0.12})`; g.lineWidth = 2 + rnd(i, 10) * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i, 11) - 0.5) * 10, y + 40 + rnd(i, 12) * 160); g.stroke(); } // chorreadas
  }, [3, 1.5]),
  // baldosa colorada de cocina (quarry tile) con junta oscura y desgaste
  piso: mk(1024, 1024, (g) => {
    g.fillStyle = "#3a2018"; g.fillRect(0, 0, 1024, 1024);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = rnd(r * 8 + c, 1); g.fillStyle = `rgb(${150 + v * 35},${62 + v * 18},${44 + v * 10})`; g.fillRect(c * 128 + 4, r * 128 + 4, 120, 120); }
    for (let i = 0; i < 12000; i++) { g.fillStyle = rnd(i, 5) > 0.5 ? `rgba(40,20,12,${0.08 + rnd(i, 6) * 0.12})` : `rgba(230,170,140,${0.05 + rnd(i, 6) * 0.08})`; g.fillRect(rnd(i, 7) * 1024, rnd(i, 8) * 1024, 2, 2); }
    for (let i = 0; i < 50; i++) { const x = rnd(i, 1) * 1024, y = rnd(i, 2) * 1024, r = 60 + rnd(i, 3) * 160; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(20,10,5,.12)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  }, [5, 4]),
  // acero inoxidable cepillado
  acero: mk(512, 512, (g) => {
    g.fillStyle = "#b9bcbf"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1400; i++) { const y = rnd(i, 1) * 512, v = 150 + rnd(i, 2) * 90; g.strokeStyle = `rgba(${v},${v},${v + 4},${0.15 + rnd(i, 3) * 0.2})`; g.lineWidth = 0.6 + rnd(i, 4); g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + (rnd(i, 5) - 0.5) * 3); g.stroke(); }
    for (let i = 0; i < 30; i++) { const x = rnd(i, 6) * 512, y = rnd(i, 7) * 512, r = 20 + rnd(i, 8) * 60; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(120,95,50,.12)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  }, [2, 2]),
  // tabla de picar
  tabla: mk(256, 256, (g) => { g.fillStyle = "#d9c7a5"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 300; i++) { g.strokeStyle = `rgba(120,90,50,${0.05 + rnd(i, 1) * 0.1})`; g.beginPath(); const x = rnd(i, 2) * 256, y = rnd(i, 3) * 256, a = rnd(i, 4) * 6; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 20, y + Math.sin(a) * 20); g.stroke(); } }),
  // arroz en bandeja (de arriba)
  arroz: mk(512, 512, (g) => {
    g.fillStyle = "#e9e4d6"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) { const x = rnd(i, 1) * 512, y = rnd(i, 2) * 512, a = rnd(i, 3) * 3.14, v = 225 + rnd(i, 4) * 30; g.fillStyle = `rgba(${v},${v - 3},${v - 14},.9)`; g.beginPath(); g.ellipse(x, y, 5, 1.8, a, 0, 6.3); g.fill(); g.fillStyle = "rgba(120,110,90,.18)"; g.beginPath(); g.ellipse(x + 1, y + 1.5, 5, 1.6, a, 0, 6.3); g.fill(); }
  }, [2, 1]),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  // humo: mancha blanda irregular
  humo: mk(128, 128, (g) => { for (let i = 0; i < 26; i++) { const x = 64 + (rnd(i, 1) - 0.5) * 60, y = 64 + (rnd(i, 2) - 0.5) * 60, r = 18 + rnd(i, 3) * 28; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(255,255,255,.22)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } }),
  polvos: [label("SALT", "", "#f4f1ea", "#7a1f1f"), label("SUGAR", "", "#f4f1ea", "#7a1f1f"), label("W.PEPPER", "", "#f4f1ea", "#7a1f1f"), label("MSG", "", "#f4f1ea", "#7a1f1f")],
  light: label("LIGHT", "SOY SAUCE", "#d8b25a", "#3a1a08"),
  dark: label("DARK", "SOY SAUCE", "#2a1408", "#e9c86a"),
  ticket: mk(128, 256, (g) => {
    g.fillStyle = "#f6f2e8"; g.fillRect(0, 0, 128, 256);
    g.fillStyle = "#222"; g.font = "900 22px monospace"; g.fillText("#  214", 10, 30);
    for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(30,30,30,${0.6 + rnd(i, 1) * 0.3})`; g.fillRect(10, 52 + i * 22, 40 + rnd(i, 2) * 70, 8); }
    g.fillStyle = "#b02020"; g.fillRect(10, 230, 108, 6);
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number; o?: number }> = ({ p, s, c, r = 0.8, m = 0, map, rad = 0.01, rot, cast = true, e, ei = 0, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o < 1} opacity={o} /></mesh>
);
const Cyl: React.FC<{ p: V; r1: number; r2?: number; h: number; c: string; r?: number; m?: number; seg?: number; rot?: V; e?: string; ei?: number; map?: Tx; o?: number }> = ({ p, r1, r2, h, c, r = 0.6, m = 0, seg = 28, rot, e, ei = 0, map, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r1, r2 ?? r1, h, seg]} /><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} /></mesh>
);

// perfil del wok: casquete de hierro, borde fino
const wokGeo = (R: number, D: number) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) { const r = (i / 24) * R; pts.push(new THREE.Vector2(r, D * (r / R) ** 2)); }
  return new THREE.LatheGeometry(pts, 64);
};
const wokY = (r: number) => WOK.y + WOK.D * (Math.min(r, WOK.R) / WOK.R) ** 2;

// LLAMA: conos aditivos que tiemblan. fire 0..1 (0,25 hornalla de casa · 1 turbina del restaurante)
const Llamas: React.FC<{ t: number; p: V; R: number; fire: number; n?: number; blue?: boolean }> = ({ t, p, R, fire, n = 18, blue }) => {
  if (fire <= 0.01) return null;
  return <group position={p}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2, fl = 0.75 + 0.25 * Math.sin(t * 23 + i * 1.7) + 0.15 * Math.sin(t * 41 + i * 3.1);
      const h = (blue ? 0.05 : 0.08 + 0.32 * fire) * fl, w = blue ? 0.012 : 0.02 + 0.03 * fire;
      const tilt = blue ? 0.1 : 0.35 + 0.25 * fire; // la llama del restaurante sube por los costados del wok
      return <group key={i} rotation={[0, -a, 0]}>
        <group position={[R, 0, 0]} rotation={[0, 0, -tilt]}>
          <mesh position={[0, h / 2, 0]} userData={{ noAO: true }}><coneGeometry args={[w, h, 8, 1, true]} /><meshBasicMaterial color={blue ? "#4a7dff" : "#ff8a1e"} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, h * 0.3, 0]} userData={{ noAO: true }}><coneGeometry args={[w * 0.55, h * 0.6, 8, 1, true]} /><meshBasicMaterial color={blue ? "#9fd0ff" : "#3a6bff"} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>;
    })}
  </group>;
};

// HUMO que sube (sprites blandos; GTAO los ignora)
const Humo: React.FC<{ t: number; p: V; k: number; tx: THREE.Texture; n?: number; spread?: number; col?: string }> = ({ t, p, k, tx, n = 26, spread = 0.25, col = "#d9d4cc" }) => {
  if (k <= 0.01) return null;
  return <group position={p}>
    {Array.from({ length: n }, (_, i) => {
      const life = 3.2, ph = ((t + rnd(i, 1) * life) % life) / life;
      const x = (rnd(i, 2) - 0.5) * spread + Math.sin(t * 0.8 + i) * 0.06 * ph, z = (rnd(i, 3) - 0.5) * spread;
      const sc = 0.12 + ph * 0.55;
      return <sprite key={i} position={[x, 0.05 + ph * 1.0, z]} scale={[sc, sc, sc]}><spriteMaterial map={tx} color={col} transparent opacity={k * 0.55 * Math.sin(Math.PI * ph)} depthWrite={false} /></sprite>;
    })}
  </group>;
};

// WOK HEI: gotitas de aceite que saltan, tocan la llama y arden un instante
const Chispas: React.FC<{ t: number; k: number; tx: THREE.Texture }> = ({ t, k, tx }) => {
  if (k <= 0.01) return null;
  return <group position={[WOK.x, WOK.y + 0.1, WOK.z]}>
    {Array.from({ length: 46 }, (_, i) => {
      const life = 0.7 + rnd(i, 1) * 0.5, ph = ((t + rnd(i, 2) * 3) % life) / life;
      const a = rnd(i, 3) * 6.28, r = WOK.R * (0.6 + rnd(i, 4) * 0.6) * (0.4 + ph);
      const y = 0.05 + Math.sin(Math.PI * ph) * (0.15 + rnd(i, 5) * 0.3);
      const burn = ph > 0.35 && ph < 0.75 ? 1 : 0.25;
      const sc = (0.012 + 0.05 * burn * rnd(i, 6)) * k;
      return <sprite key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={[sc * 2, sc * 2, sc * 2]}><spriteMaterial map={tx} color={burn > 0.5 ? "#ffb347" : "#fff1c2"} transparent opacity={k * (1 - ph)} blending={THREE.AdditiveBlending} depthWrite={false} /></sprite>;
    })}
  </group>;
};

// EL ARROZ en el wok: granos instanciados. rice = cuánto hay · clump 0 suelto / 1 en bollos · brown 0 blanco / 1 dorado-takeout
// toss = salto · wet = brillo mojado · press = aplastado contra el metal
type Arroz = { rice: number; clump: number; brown: number; toss: number; wet: number; press: number };
const NG = 1500;
const ArrozWok: React.FC<Arroz & { t: number }> = ({ t, rice, clump, brown, toss, wet, press }) => {
  const geo = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.6 }), NG);
    m.castShadow = true; m.receiveShadow = true; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); return m;
  }, [geo]);
  const mat = mesh.material as THREE.MeshStandardMaterial;
  mat.roughness = lerp(0.65, 0.18, wet); mat.color.set(new THREE.Color("#cfc9bb").lerp(new THREE.Color("#8f5a2a"), brown));
  const o = new THREE.Object3D(), col = new THREE.Color();
  const n = Math.round(NG * cl(rice));
  for (let i = 0; i < NG; i++) {
    if (i >= n) { o.scale.set(0, 0, 0); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); continue; }
    const rr = Math.sqrt(rnd(i, 1)) * WOK.R * 0.7, a = rnd(i, 2) * 6.28;
    let x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    const layer = rnd(i, 3) * 0.03 * (1 - rr / (WOK.R * 0.7)) * (1 - press);
    // bollos: 7 centros, los granos se juntan
    const c = i % 7, ca = c * 0.9 + 0.4, cr = WOK.R * (0.15 + 0.4 * rnd(c, 9));
    const cx = Math.cos(ca) * cr, cz = Math.sin(ca) * cr, cu = 0.035 + rnd(i, 12) * 0.03;
    const sx = cx + (rnd(i, 13) - 0.5) * cu * 2, sz = cz + (rnd(i, 14) - 0.5) * cu * 2;
    x = lerp(x, sx, clump); z = lerp(z, sz, clump);
    let y = wokY(Math.hypot(x, z)) + 0.006 + layer + clump * (0.02 + rnd(i, 15) * 0.03);
    // salto
    const ph = ((t * 1.3 + rnd(i, 5) * 0.3) % 1), lift = toss * Math.max(0, Math.sin(Math.PI * ph)) * (0.15 + 0.15 * rnd(i, 6));
    y += lift; x += toss * Math.sin(Math.PI * ph) * 0.06;
    o.position.set(WOK.x + x, y, WOK.z + z);
    o.rotation.set(rnd(i, 7) * 0.8, rnd(i, 8) * 6.28, lerp(0, 0.2, press));
    o.scale.set(0.0075, 0.003, 0.003);
    o.updateMatrix(); mesh.setMatrixAt(i, o.matrix);
    // granos tostados: unos más oscuros (bordes crocantes)
    const v = rnd(i, 10);
    col.set("#ffffff").multiplyScalar(0.88 + v * 0.14); if (brown > 0.3 && v < 0.18) col.multiplyScalar(0.72);
    mesh.setColorAt(i, col);
  }
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return <primitive object={mesh} />;
};

// cuajos de huevo (amarillos, blandos) · peas & carrots · verdeo
const Huevo: React.FC<{ p: V; k: number; R?: number; brown?: number }> = ({ p, k, R = 0.2, brown = 0 }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: 16 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = Math.sqrt(rnd(i, 2)) * R, s = (0.02 + rnd(i, 3) * 0.022) * Math.min(1, k * 1.4 - i * 0.02);
    return s > 0 ? <mesh key={i} position={[Math.cos(a) * r, 0.012 + rnd(i, 4) * 0.01, Math.sin(a) * r]} scale={[s * 1.4, s * 0.55, s]} rotation={[0, rnd(i, 5) * 6, 0]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={new THREE.Color("#ffd23a").lerp(new THREE.Color("#d9a440"), brown)} roughness={0.55} /></mesh> : null; })}
</group>;
const Arvejas: React.FC<{ p: V; k: number; R?: number }> = ({ p, k, R = 0.22 }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: 34 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = Math.sqrt(rnd(i, 2)) * R, on = cl(k * 1.5 - i * 0.015); const zan = i % 3 === 0;
    return on > 0 ? <mesh key={i} position={[Math.cos(a) * r, 0.02 + rnd(i, 3) * 0.01 + (1 - on) * 0.3, Math.sin(a) * r]} rotation={[rnd(i, 4), rnd(i, 5), 0]} castShadow>
      {zan ? <boxGeometry args={[0.011, 0.011, 0.011]} /> : <sphereGeometry args={[0.008, 10, 8]} />}<meshStandardMaterial color={zan ? "#f07a1e" : "#5fae3a"} roughness={0.45} /></mesh> : null; })}
</group>;
const Verdeo: React.FC<{ p: V; k: number; R?: number; white?: boolean }> = ({ p, k, R = 0.22, white }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: 30 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = Math.sqrt(rnd(i, 2)) * R, on = cl(k * 1.5 - i * 0.02);
    return on > 0 ? <mesh key={i} position={[Math.cos(a) * r, 0.025 + (1 - on) * 0.25, Math.sin(a) * r]} rotation={[Math.PI / 2 + rnd(i, 3), 0, rnd(i, 4)]}><torusGeometry args={[0.007, 0.0025, 6, 14]} /><meshStandardMaterial color={white ? "#eef3d8" : "#5bc23a"} roughness={0.4} /></mesh> : null; })}
</group>;

// botella de soja (light = ámbar claro, dark = casi negra) con etiqueta
const Botella: React.FC<{ p: V; map: THREE.Texture; dark?: boolean; glow?: number; rot?: V }> = ({ p, map, dark, glow = 0, rot }) => (
  <group position={p} rotation={rot}>
    <mesh castShadow position={[0, 0, 0]}><cylinderGeometry args={[0.035, 0.038, 0.2, 24]} /><meshPhysicalMaterial color={dark ? "#1a0c05" : "#8a4a14"} roughness={0.08} metalness={0} transmission={0} clearcoat={1} emissive={dark ? "#3a1a08" : "#ffb35a"} emissiveIntensity={0.5 * glow} /></mesh>
    <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.012, 0.03, 0.06, 18]} /><meshPhysicalMaterial color={dark ? "#1a0c05" : "#8a4a14"} roughness={0.08} clearcoat={1} /></mesh>
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.014, 0.014, 0.025, 14]} /><meshStandardMaterial color="#c8202a" roughness={0.5} /></mesh>
    <mesh position={[0, -0.01, 0.0385]}><planeGeometry args={[0.062, 0.09]} /><meshStandardMaterial map={map} roughness={0.7} emissive="#fff" emissiveMap={map} emissiveIntensity={0.25 * glow} /></mesh>
  </group>
);

// caja de takeout (oyster pail): cuerpo trapezoidal blanco + asa de alambre
const Caja: React.FC<{ p: V; s?: number; open?: number; fill?: number; rot?: V }> = ({ p, s = 1, open = 0, fill = 0, rot }) => (
  <group position={p} scale={s} rotation={rot}>
    <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}><cylinderGeometry args={[0.085, 0.062, 0.11, 4, 1, open > 0]} /><meshStandardMaterial color="#f4f1ea" roughness={0.75} side={THREE.DoubleSide} /></mesh>
    {open <= 0 && <mesh position={[0, 0.062, 0]} rotation={[0, Math.PI / 4, 0]}><cylinderGeometry args={[0.04, 0.085, 0.03, 4]} /><meshStandardMaterial color="#efebe2" roughness={0.75} /></mesh>}
    {fill > 0 && <mesh position={[0, 0.045, 0]} rotation={[0, Math.PI / 4, 0]}><cylinderGeometry args={[0.07, 0.083, 0.04, 4]} /><meshStandardMaterial color="#b9773a" roughness={0.8} /></mesh>}
    <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.07, 0.0022, 6, 30, Math.PI]} /><meshStandardMaterial color="#999" metalness={0.8} roughness={0.3} /></mesh>
    {/* la pagoda roja */}
    <mesh position={[0, 0.0, 0.066]} rotation={[0.08, 0, 0]}><planeGeometry args={[0.05, 0.05]} /><meshBasicMaterial color="#c8202a" transparent opacity={0.85} /></mesh>
  </group>
);

// GRANO DE ARROZ EN MACRO. wet 1 = recién hecho (capa de almidón pegajosa, gotas, puente de pegamento) · 0 = dormido (mate, duro)
// split = se separan · crystal = las líneas del almidón que se vuelve firme (retrogradación) · toast = dorado con manchas
export type Macro = { on: number; wet: number; split: number; crystal: number; toast: number };
const GranoMacro: React.FC<{ t: number; p: V; m: Macro; side: number; tx: ReturnType<typeof useCocina> }> = ({ t, p, m, side, tx }) => {
  const gap = 0.02 + m.split * 0.45;
  const col = new THREE.Color("#d9d2c0").lerp(new THREE.Color("#c8873e"), m.toast);
  return <group position={[p[0] + side * gap, p[1] + Math.sin(t * 0.9 + side) * 0.015, p[2]]} rotation={[0.2, side * 0.25 + t * 0.05, 0.12 * side]}>
    <mesh castShadow scale={[0.42, 0.17, 0.17]}><sphereGeometry args={[1, 48, 32]} /><meshPhysicalMaterial color={col} roughness={lerp(0.75, 0.25, m.wet)} clearcoat={m.wet} clearcoatRoughness={0.1} sheen={0.4} /></mesh>
    {/* capa pegajosa de almidón */}
    {m.wet > 0.02 && <mesh scale={[0.45, 0.2, 0.2]} userData={{ noAO: true }}><sphereGeometry args={[1, 40, 28]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.6} transparent opacity={0.22 * m.wet} thickness={0.05} depthWrite={false} /></mesh>}
    {m.wet > 0.02 && Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.6, 0.12 + rnd(i, 2) * 0.06, (rnd(i, 3) - 0.5) * 0.2]} scale={0.02 + rnd(i, 4) * 0.025} userData={{ noAO: true }}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#ffffff" roughness={0.02} transmission={0.9} transparent opacity={0.7 * m.wet} depthWrite={false} /></mesh>)}
    {/* cristales del almidón que se pone firme */}
    {m.crystal > 0.02 && Array.from({ length: 22 }, (_, i) => { const a = rnd(i, 5) * 6.28, x = (rnd(i, 6) - 0.5) * 0.6; return <mesh key={"c" + i} position={[x, Math.cos(a) * 0.08, Math.sin(a) * 0.08]} rotation={[a, 0, rnd(i, 7)]} scale={[0.05 * cl(m.crystal * 2 - i * 0.04), 0.004, 0.004]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#ffffff" emissive="#bfe4ff" emissiveIntensity={1.4 * m.crystal} /></mesh>; })}
    {/* manchas tostadas */}
    {m.toast > 0.05 && Array.from({ length: 12 }, (_, i) => { const a = rnd(i, 8) * 6.28; return <mesh key={"t" + i} position={[(rnd(i, 9) - 0.5) * 0.6, Math.cos(a) * 0.163, Math.sin(a) * 0.163]} rotation={[a, 0, 0]} scale={[0.04 + rnd(i, 10) * 0.05, 0.003, 0.03]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#6a3510" roughness={0.7} transparent opacity={m.toast} /></mesh>; })}
  </group>;
};

// ---------------- props del mundo que cambian con el video ----------------
export type WorldProps = {
  t: number;
  fire?: number;            // llama de la turbina 0..1
  homeFire?: number;        // llamita azul de la hornalla de casa 0..1
  smoke?: number; hei?: number; // humo del wok · chispas del wok hei
  arroz?: Partial<Arroz>;
  egg?: number; eggPlate?: number; eggBrown?: number; peas?: number; whites?: number; greens?: number;
  soyPour?: number; soyDark?: number; soyEdge?: number; // chorro de soja (0 nada · 1 cayendo) · dark: cuál botella · edge 1 = sobre el metal del borde
  glowPolvo?: number;       // índice+1 del polvo que se ilumina (0 = ninguno; 5 = los 4)
  glowSoja?: number;        // 1 light · 2 dark · 3 las dos
  tickets?: number;         // comandas colgadas 0..12
  night?: number;           // viernes a la noche
  trays?: number;           // bandejas en el carro 0..6
  frio?: number;            // la cámara fría abierta (luz azul)
  cooker?: number;          // vapor de la arrocera
  heatGlow?: number;        // el metal vacío humeando de caliente
  casaRice?: number;        // arroz en la sartén de casa (0..1) · casaMush = engrudo
  macro?: Partial<Macro>;
};
export const World: React.FC<WorldProps> = (pr) => {
  const { t, fire = 0.35, homeFire = 0, smoke = 0.2, hei = 0, egg = 0, eggPlate = 0, eggBrown = 0, peas = 0, whites = 0, greens = 0, soyPour = 0, soyDark = 0, soyEdge = 1,
    glowPolvo = 0, glowSoja = 0, tickets = 4, night = 0, trays = 6, frio = 0, cooker = 0, heatGlow = 0, casaRice = 0 } = pr;
  const a: Arroz = { rice: 0, clump: 0, brown: 0, toss: 0, wet: 0, press: 0, ...pr.arroz };
  const mc: Macro = { on: 0, wet: 1, split: 0, crystal: 0, toast: 0, ...pr.macro };
  const tx = useCocina();
  const wokGeom = useMemo(() => wokGeo(WOK.R, WOK.D), []);
  const flick = 0.85 + 0.15 * Math.sin(t * 17) * Math.sin(t * 7.3);
  // chorro de soja: de la botella al borde del wok (o al medio del arroz)
  const pourTo: V = soyEdge > 0.5 ? [WOK.x + WOK.R * 0.86, wokY(WOK.R * 0.86), WOK.z + 0.06] : [WOK.x + 0.03, WOK.y + 0.04, WOK.z];
  const pourFrom: V = [pourTo[0] + 0.04, pourTo[1] + 0.2, pourTo[2] + 0.02];
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.32} threshold={0.93} exposure={lerp(1.05, 0.9, night)} env={lerp(0.35, 0.2, night)} />
      <color attach="background" args={[mc.on > 0.5 ? 0x050403 : 0x1a1512]} />
      <fog attach="fog" args={[0x1a1512, 9, 30]} />
      <hemisphereLight args={[0xf2f4ff, 0x3a2a20, lerp(0.75, 0.4, night)]} />
      {/* tubos fluorescentes del techo (frío) */}
      <directionalLight position={[1.5, 5, 3]} intensity={lerp(2.0, 1.1, night)} color="#f4f6ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={4} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* la llama ilumina el wok y la pared (cálido, tiembla) */}
      <pointLight position={[WOK.x, WOK.y + 0.05, WOK.z + 0.15]} intensity={(0.3 + 1.6 * fire) * flick} distance={2.4} decay={1.6} color="#ff9a3a" />
      <pointLight position={[WOK.x + 0.2, 1.95, WOK.z + 0.25]} intensity={1.4} distance={3} decay={1.6} color="#fff4e0" />
      <pointLight position={[-3.0, 1.9, -1.0]} intensity={1.1} distance={3} decay={1.6} color="#ffe2b8" />
      <pointLight position={[3.1, 1.5, -1.0]} intensity={0.7 * frio} distance={3} decay={1.6} color="#a8d4ff" />

      {/* piso y paredes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 6]} /><meshStandardMaterial map={tx.piso} roughness={0.75} /></mesh>
      <Box p={[0, 1.5, -2.65]} s={[10, 3, 0.2]} c="#ffffff" map={tx.tile} r={0.35} rad={0.02} />
      <Box p={[-4.4, 1.5, 0]} s={[0.2, 3, 6]} c="#ffffff" map={tx.tile} r={0.35} rad={0.02} />
      <Box p={[4.2, 1.5, 0.3]} s={[0.2, 3, 5.4]} c="#ffffff" map={tx.tile} r={0.35} rad={0.02} />
      <Box p={[0, 3.05, -1.3]} s={[10, 0.1, 3]} c="#d8d6d0" r={0.9} />

      {/* LA ESTUFA DE WOK: cuerpo de acero, dos bocas (wok y olla de caldo), canaleta de agua atrás */}
      <group>
        <Box p={[0.05, TOP / 2, -1.95]} s={[1.7, TOP, 0.85]} c="#c9ccd0" map={tx.acero} m={0.75} r={0.38} rad={0.015} />
        <Box p={[0.05, TOP + 0.01, -2.33]} s={[1.7, 0.06, 0.1]} c="#c9ccd0" map={tx.acero} m={0.75} r={0.35} />
        <mesh position={[WOK.x, TOP + 0.015, WOK.z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27, 0.025, 10, 40]} /><meshStandardMaterial color="#2a2624" metalness={0.6} roughness={0.5} emissive="#ff5a1a" emissiveIntensity={0.25 * fire} /></mesh>
        <mesh position={[0.45, TOP + 0.015, WOK.z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.022, 10, 40]} /><meshStandardMaterial color="#2a2624" metalness={0.6} roughness={0.5} /></mesh>
        {/* perillas */}
        {[-0.55, -0.35, 0.3, 0.6].map((x, i) => <Cyl key={i} p={[x, 0.65, -1.51]} r1={0.03} h={0.03} c="#222" rot={[Math.PI / 2, 0, 0]} />)}
        {/* olla de caldo atrás */}
        <Cyl p={[0.45, TOP + 0.13, WOK.z]} r1={0.19} h={0.24} c="#b8bcc0" m={0.85} r={0.3} />
        <Humo t={t + 7} p={[0.45, TOP + 0.26, WOK.z]} k={0.35} tx={tx.humo} n={10} spread={0.2} />
      </group>
      {/* el WOK de hierro negro, con mango largo y oreja */}
      <group>
        <mesh geometry={wokGeom} position={[WOK.x, WOK.y, WOK.z]} castShadow receiveShadow><meshStandardMaterial color="#1c1a19" metalness={0.65} roughness={0.42} side={THREE.DoubleSide} emissive="#ff4a10" emissiveIntensity={0.18 * heatGlow} /></mesh>
        <group position={[WOK.x, 0, WOK.z]} rotation={[0, 0.75, 0]}>
          <mesh position={[-WOK.R - 0.17, WOK.y + WOK.D + 0.02, 0]} rotation={[0, 0, Math.PI / 2 - 0.12]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.34, 12]} /><meshStandardMaterial color="#3a3836" metalness={0.7} roughness={0.4} /></mesh>
          <mesh position={[-WOK.R - 0.38, WOK.y + WOK.D + 0.045, 0]} rotation={[0, 0, Math.PI / 2 - 0.12]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.18, 12]} /><meshStandardMaterial color="#4a2a16" roughness={0.7} /></mesh>
        </group>
        <mesh position={[WOK.x + WOK.R + 0.02, WOK.y + WOK.D, WOK.z]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} /><meshStandardMaterial color="#2a2826" metalness={0.7} roughness={0.4} /></mesh>
        <Llamas t={t} p={[WOK.x, TOP - 0.02, WOK.z]} R={0.22} fire={fire} n={22} />
        {heatGlow > 0.02 && <Humo t={t} p={[WOK.x, WOK.y + 0.02, WOK.z]} k={heatGlow * 0.6} tx={tx.humo} n={14} spread={0.3} col="#bdb6ae" />}
        <ArrozWok t={t} {...a} />
        <Huevo p={[WOK.x, wokY(0.1), WOK.z]} k={egg} R={WOK.R * 0.6} brown={eggBrown} />
        <Arvejas p={[WOK.x, wokY(0.1), WOK.z]} k={peas} R={WOK.R * 0.62} />
        <Verdeo p={[WOK.x, wokY(0.1), WOK.z]} k={whites} R={WOK.R * 0.5} white />
        <Verdeo p={[WOK.x, wokY(0.1) + 0.01, WOK.z]} k={greens} R={WOK.R * 0.64} />
        <Humo t={t} p={[WOK.x, WOK.y + 0.05, WOK.z]} k={smoke} tx={tx.humo} n={26} spread={0.4} />
        <Chispas t={t} k={hei} tx={tx.dot} />
        {/* chorro de soja + burbujas sobre el metal */}
        {soyPour > 0.01 && <group>
          <mesh position={[(pourFrom[0] + pourTo[0]) / 2, (pourFrom[1] + pourTo[1]) / 2, (pourFrom[2] + pourTo[2]) / 2]} rotation={[0, 0, 0.16]}><cylinderGeometry args={[0.004, 0.006, 0.2 * soyPour, 10]} /><meshPhysicalMaterial color={soyDark > 0.5 ? "#140803" : "#5a2a0c"} roughness={0.05} clearcoat={1} /></mesh>
          <Botella p={[pourFrom[0] + 0.03, pourFrom[1] + 0.08, pourFrom[2]]} map={soyDark > 0.5 ? tx.dark : tx.light} dark={soyDark > 0.5} rot={[0, 0, 2.0]} />
          {soyEdge > 0.5 && Array.from({ length: 14 }, (_, i) => { const ph = ((t * 2 + rnd(i, 1)) % 1); return <mesh key={i} position={[pourTo[0] + (rnd(i, 2) - 0.5) * 0.08, pourTo[1] + 0.005 + ph * 0.01, pourTo[2] + (rnd(i, 3) - 0.5) * 0.1]} scale={0.004 + 0.006 * Math.sin(Math.PI * ph)}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#3a1a06" roughness={0.05} clearcoat={1} /></mesh>; })}
        </group>}
      </group>
      {/* CAMPANA de acero + tubos de luz + riel de comandas */}
      <group>
        <mesh position={[0.05, 2.45, -2.05]} castShadow geometry={rbox(2.2, 0.5, 1.0, 0.02)}><meshStandardMaterial color="#c4c7cb" map={tx.acero} metalness={0.8} roughness={0.35} /></mesh>
        {[-0.6, 0.6].map((x) => <Box key={x} p={[x, 2.19, -1.75]} s={[0.9, 0.025, 0.06]} c="#ffffff" e="#f4f8ff" ei={2.2} cast={false} />)}
        <Box p={[-0.2, 2.08, -1.52]} s={[2.0, 0.02, 0.03]} c="#b0b3b6" m={0.9} r={0.3} />
        {Array.from({ length: 12 }, (_, i) => i < tickets ? <mesh key={i} position={[-1.05 + i * 0.16, 1.97, -1.51]} rotation={[0.06 * Math.sin(t * 2 + i), 0, 0.03 * Math.sin(t * 1.3 + i * 2)]}><planeGeometry args={[0.09, 0.18]} /><meshStandardMaterial map={tx.ticket} roughness={0.9} side={THREE.DoubleSide} emissive="#ffffff" emissiveMap={tx.ticket} emissiveIntensity={0.12} /></mesh> : null)}
      </group>

      {/* MESADA IZQUIERDA: los 4 polvos blancos, las 2 sojas, el plato del huevo, tabla con verdeo */}
      <group>
        <Box p={[-1.45, TOP / 2, -2.1]} s={[1.0, TOP, 0.65]} c="#c9ccd0" map={tx.acero} m={0.7} r={0.4} rad={0.012} />
        {[0, 1, 2, 3].map((i) => {
          const x = PT.polvos[0] - 0.24 + i * 0.16, g = glowPolvo === 5 || glowPolvo === i + 1 ? 1 : 0;
          return <group key={i} position={[x, TOP, -2.25]}>
            <Box p={[0, 0.06, 0]} s={[0.14, 0.12, 0.14]} c="#d8dade" m={0.8} r={0.3} rad={0.008} />
            <mesh position={[0, 0.119, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.12]} /><meshStandardMaterial color={i === 2 ? "#ece7da" : "#fbfaf6"} roughness={0.95} emissive="#ffffff" emissiveIntensity={0.25 * g} /></mesh>
            <mesh position={[0, 0.06, 0.0715]}><planeGeometry args={[0.12, 0.06]} /><meshStandardMaterial map={tx.polvos[i]} roughness={0.8} emissive="#fff" emissiveMap={tx.polvos[i]} emissiveIntensity={0.6 * g} /></mesh>
            {/* cucharita */}
            <mesh position={[0.03, 0.14, 0.02]} rotation={[0.5, 0, 0.3]}><cylinderGeometry args={[0.003, 0.003, 0.1, 6]} /><meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.2} /></mesh>
          </group>;
        })}
        <Botella p={PT.sojaLight} map={tx.light} glow={glowSoja === 1 || glowSoja === 3 ? 1 : 0} />
        <Botella p={PT.sojaDark} map={tx.dark} dark glow={glowSoja === 2 || glowSoja === 3 ? 1 : 0} />
        <Cyl p={PT.plato} r1={0.12} r2={0.09} h={0.02} c="#f2f0ea" r={0.3} />
        <Huevo p={[PT.plato[0], PT.plato[1] + 0.005, PT.plato[2]]} k={eggPlate} R={0.07} />
        <Box p={[-1.75, TOP + 0.012, -1.92]} s={[0.36, 0.024, 0.24]} c="#ffffff" map={tx.tabla} r={0.8} rad={0.006} />
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-1.85 + i * 0.03, TOP + 0.032, -1.92]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.22, 8]} /><meshStandardMaterial color={i % 2 ? "#5bc23a" : "#7ad04a"} roughness={0.5} /></mesh>)}
      </group>

      {/* MESADA DERECHA: la arrocera grande, cajas de takeout */}
      <group>
        <Box p={[1.55, TOP / 2, -2.1]} s={[1.1, TOP, 0.65]} c="#c9ccd0" map={tx.acero} m={0.7} r={0.4} rad={0.012} />
        <Cyl p={[PT.arrocera[0], TOP + 0.17, PT.arrocera[2]]} r1={0.24} r2={0.22} h={0.34} c="#e8e6e0" r={0.4} m={0.1} />
        <mesh position={[PT.arrocera[0], TOP + 0.35, PT.arrocera[2]]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.235, 30, 16, 0, 6.3, 0, 1.6]} /><meshStandardMaterial color="#d8d6d0" roughness={0.35} metalness={0.3} /></mesh>
        <Cyl p={[PT.arrocera[0], TOP + 0.43, PT.arrocera[2]]} r1={0.03} h={0.04} c="#333" />
        <Box p={[PT.arrocera[0], TOP + 0.12, PT.arrocera[2] + 0.235]} s={[0.12, 0.06, 0.01]} c="#2a2a2a" e="#ff3a2a" ei={0.9} />
        <Humo t={t + 3} p={[PT.arrocera[0], TOP + 0.45, PT.arrocera[2]]} k={cooker} tx={tx.humo} n={14} spread={0.12} col="#ffffff" />
        {Array.from({ length: 5 }, (_, i) => <Caja key={i} p={[1.0 + (i % 3) * 0.19, TOP + 0.055 + Math.floor(i / 3) * 0.13, -1.95]} />)}
        <Caja p={[1.85, TOP + 0.055, -1.85]} open={1} fill={1} rot={[0, 0.4, 0]} />
      </group>

      {/* EL CARRO DE BANDEJAS frente a la CÁMARA FRÍA (pared derecha) */}
      <group>
        <Box p={[4.08, 1.15, -1.2]} s={[0.08, 2.2, 1.2]} c="#c7cacd" map={tx.acero} m={0.8} r={0.3} e="#9fd0ff" ei={0.15 * frio} />
        <Box p={[4.0, 1.15, -0.62]} s={[0.06, 0.4, 0.05]} c="#7a7d80" m={0.9} r={0.3} />
        {[-0.28, 0.28].map((z) => [0.0, 0.0].map((_, k) => <Box key={z + "" + k} p={[2.85 + (k ? 0.22 : -0.22), 0.95, -1.2 + z]} s={[0.03, 1.9, 0.03]} c="#b9bcbf" m={0.85} r={0.3} />))}
        {Array.from({ length: 6 }, (_, i) => i < trays ? <group key={i} position={[2.85, 0.4 + i * 0.26, -1.2]}>
          <Box p={[0, 0, 0]} s={[0.46, 0.025, 0.66]} c="#b0b4b8" m={0.85} r={0.32} rad={0.006} />
          <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.62]} /><meshStandardMaterial map={tx.arroz} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#d8ecff"), frio * 0.5)} roughness={0.85} /></mesh>
        </group> : null)}
        <Humo t={t + 11} p={[2.85, 0.4 + 5 * 0.26, -1.2]} k={cooker * 0.6} tx={tx.humo} n={10} spread={0.4} col="#ffffff" />
      </group>

      {/* LA HORNALLA DE CASA con la sartén de hierro (a la izquierda, sobre su mueble blanco) */}
      <group>
        <Box p={[PT.casaHorn[0], 0.45, PT.casaHorn[2]]} s={[0.76, 0.9, 0.66]} c="#efece4" r={0.35} rad={0.02} />
        <Box p={[PT.casaHorn[0], 0.91, PT.casaHorn[2]]} s={[0.76, 0.02, 0.66]} c="#1a1a1a" r={0.4} m={0.4} />
        {[[-0.18, -0.15], [0.18, -0.15], [-0.18, 0.15], [0.18, 0.15]].map(([x, z], i) => <mesh key={i} position={[PT.casaHorn[0] + x, 0.93, PT.casaHorn[2] + z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.09, 0.008, 6, 4]} /><meshStandardMaterial color="#222" roughness={0.6} /></mesh>)}
        <Llamas t={t} p={[PT.casaHorn[0] + 0.18, 0.925, PT.casaHorn[2] + 0.15]} R={0.05} fire={homeFire} n={14} blue />
        <group position={[PT.casaHorn[0] + 0.18, 0.955, PT.casaHorn[2] + 0.15]}>
          <Cyl p={[0, 0, 0]} r1={0.15} r2={0.13} h={0.05} c="#1d1c1b" m={0.5} r={0.55} />
          <mesh position={[-0.24, 0.02, 0]} rotation={[0, 0, Math.PI / 2 - 0.08]}><cylinderGeometry args={[0.015, 0.012, 0.18, 10]} /><meshStandardMaterial color="#1d1c1b" metalness={0.5} roughness={0.55} /></mesh>
          {casaRice > 0.01 && <mesh position={[0, 0.026, 0]} scale={[1, 0.18, 1]}><sphereGeometry args={[0.12, 24, 12, 0, 6.3, 0, 1.4]} /><meshStandardMaterial color={new THREE.Color("#e9e2d0").lerp(new THREE.Color("#7a4a22"), casaRice > 0.5 ? (casaRice - 0.5) * 2 : 0)} roughness={0.25} /></mesh>}
        </group>
        {/* cartel "YOUR STOVE" no: el texto va en 2.5D. Una ventana de cocina de casa atrás, para que se lea "casa" */}
        <Box p={[PT.casaHorn[0], 1.75, -2.54]} s={[0.9, 0.7, 0.04]} c="#a8c4e0" e="#cfe4ff" ei={0.7} cast={false} />
        <Box p={[PT.casaHorn[0], 1.75, -2.52]} s={[0.94, 0.04, 0.05]} c="#efece4" />
        <Box p={[PT.casaHorn[0], 1.75, -2.52]} s={[0.04, 0.74, 0.05]} c="#efece4" />
      </group>

      {/* ESCENARIO MACRO: el grano de arroz gigante sobre negro */}
      {mc.on > 0.01 && <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PT.macro[0], 0.75, PT.macro[2]]}><circleGeometry args={[3, 48]} /><meshStandardMaterial color="#0c0a08" roughness={0.25} metalness={0.3} /></mesh>
        <pointLight position={[PT.macro[0] - 0.8, 2.4, 1.4]} intensity={2.2} distance={6} decay={1.6} color="#fff1dc" castShadow />
        <pointLight position={[PT.macro[0] + 1.2, 1.6, -0.8]} intensity={1.2} distance={4} color="#8fb8ff" />
        <GranoMacro t={t} p={PT.macro} m={mc} side={-1} tx={tx} />
        <GranoMacro t={t} p={PT.macro} m={mc} side={1} tx={tx} />
        {/* puente de pegamento entre los dos granos frescos */}
        {mc.wet > 0.05 && mc.split < 0.6 && <mesh position={PT.macro} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1]} userData={{ noAO: true }}><cylinderGeometry args={[0.05 * mc.wet * (1 - mc.split), 0.07 * mc.wet * (1 - mc.split), 0.06 + mc.split * 0.9, 18]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.5} transparent opacity={0.6 * mc.wet} depthWrite={false} /></mesh>}
      </group>}
    </ThreeCanvas>
  );
};
