// keikoen01 · EL MUNDO: la cocina chica de madera de Keiko en Kioto, en CORTE (sin la pared de adelante).
// Mesada de madera con azulejo blanco, ventana esmerilada, arrocera, hornalla con olla, aparador de vidrio ondulado con frascos,
// la caja de arroz de madera de la madre (con la abolladura en la tapa), mesita para UNA persona, noren índigo en la puerta,
// farol de papel colgado. LA PIEZA ANCLA: la heladera blanca con el CAJÓN DEL CONGELADOR que se abre en corte: adentro el
// desorden escarchado (tapers redondos, bolsas-piedra) que se convierte en el ORDEN de Keiko (bolsas planas paradas como libros,
// arroz en paquetes, bolitas de miso, cubetera de dashi). Niebla fría que cae. UNA escena y UNA cámara para todo el video.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { HAND, handReady } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
type V = [number, number, number];

// ---------------- puntos del mundo ----------------
export const COUNTER_Y = 0.86;
const FR: V = [1.55, 0, -1.45];            // heladera (centro de la base)
export const DRAWER_OUT = 0.5;             // cuánto sale el cajón
export const PT = {
  fridge: [FR[0], 1.0, FR[2] + 0.36] as V,
  drawer: [FR[0], 0.5, FR[2] + 0.34] as V,   // boca del cajón (cerrado)
  drawerIn: [FR[0], 0.3, FR[2] + 0.34 + DRAWER_OUT] as V, // adentro del cajón abierto
  stone: [FR[0] + 0.12, 0.3, FR[2] + 0.18 + DRAWER_OUT] as V,
  door: [FR[0], 1.18, FR[2] + 0.36] as V,    // la puerta de arriba (la lista con imán)
  trash: [1.02, 0.45, -1.02] as V,
  table: [-0.25, 0.74, 0.45] as V,
  bowl: [-0.25, 0.78, 0.5] as V,
  ricebox: [-2.06, 1.0, 0.3] as V,
  window: [-1.35, 1.78, -1.78] as V,
  stove: [0.3, 0.95, -1.5] as V,
  cooker: [-2.0, 1.0, -1.5] as V,
  noren: [2.38, 1.6, -0.15] as V,
};

// ---------------- CÁMARA (keyframes globales: minuto 1 + resto) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([2, 1.6, 3]), l: v3([0, 0.8, 0]), fov: 40 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  p.x += Math.sin(t * 0.53) * 0.009; p.y += Math.sin(t * 0.71 + 1) * 0.006; // cámara en mano, muy suave
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
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: (i: number) => string, r = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = col(i); g.fillRect(rnd(i, 11) * w, rnd(i, 12) * h, r * (0.5 + rnd(i, 13)), r * (0.5 + rnd(i, 14))); } };
const grain = (g: CanvasRenderingContext2D, w: number, h: number, base: [number, number, number], lines: number, vertical = true) => {
  g.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`; g.fillRect(0, 0, w, h);
  for (let k = 0; k < lines; k++) {
    g.strokeStyle = `rgba(${base[0] * 0.55},${base[1] * 0.5},${base[2] * 0.42},${0.05 + rnd(k, 3) * 0.1})`; g.lineWidth = 0.6 + rnd(k, 4) * 1.6; g.beginPath();
    if (vertical) { const x = rnd(k, 5) * w; g.moveTo(x, 0); g.bezierCurveTo(x + 8 * rnd(k, 6), h * 0.33, x - 10 * rnd(k, 7), h * 0.66, x + 4, h); }
    else { const y = rnd(k, 5) * h; g.moveTo(0, y); g.bezierCurveTo(w * 0.33, y + 6 * rnd(k, 6), w * 0.66, y - 8 * rnd(k, 7), w, y + 3); }
    g.stroke();
  }
  noise(g, w, h, Math.round(w * h / 300), (i) => `rgba(255,235,200,${0.03 + rnd(i, 1) * 0.04})`, 2);
};
const useKitchen = () => useMemo(() => ({
  hinoki: mk(256, 512, (g) => grain(g, 256, 512, [190, 156, 114], 34)),
  hinokiH: mk(512, 256, (g) => grain(g, 512, 256, [190, 156, 114], 34, false)),
  oscura: mk(256, 512, (g) => grain(g, 256, 512, [120, 78, 44], 30)),
  // piso de tablas oscuras y gastadas
  piso: mk(512, 512, (g) => {
    for (let r = 0; r < 6; r++) {
      const b = 92 + rnd(r, 1) * 22; g.fillStyle = `rgb(${b + 18},${b - 6},${b - 38})`; g.fillRect(0, r * 85, 512, 85);
      for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(30,18,8,${0.1 + rnd(r * 20 + k, 2) * 0.18})`; g.lineWidth = 1 + rnd(k, 3) * 2; g.beginPath(); const y = r * 85 + 5 + k * 5.6; g.moveTo(0, y); g.bezierCurveTo(170, y + 3 * rnd(k, r), 340, y - 2, 512, y + 2); g.stroke(); }
      g.fillStyle = "rgba(20,10,4,.6)"; g.fillRect(0, r * 85, 512, 3); const off = rnd(r, 9) * 512; g.fillRect(off, r * 85, 3, 85);
    }
    noise(g, 512, 512, 1600, (i) => `rgba(255,230,190,${0.03 + rnd(i, 1) * 0.04})`, 3);
  }, [3, 3]),
  // azulejo blanco cuadrado de 10 cm con junta gris
  azulejo: mk(256, 256, (g) => {
    g.fillStyle = "#b9b4aa"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = 238 + rnd(r * 4 + c, 1) * 10; g.fillStyle = `rgb(${v},${v - 2},${v - 6})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
  }, [8, 2.5]),
  // vidrio ondulado del aparador (a contraluz)
  ondulado: mk(128, 256, (g) => {
    g.fillStyle = "#c9d2cf"; g.fillRect(0, 0, 128, 256);
    for (let y = 0; y < 256; y += 4) { g.fillStyle = `rgba(255,255,255,${0.15 + 0.15 * Math.sin(y * 0.4)})`; g.fillRect(0, y, 128, 2); }
    for (let x = 0; x < 128; x += 6) { g.fillStyle = `rgba(40,50,48,${0.05 + 0.05 * Math.sin(x)})`; g.fillRect(x, 0, 2, 256); }
  }),
  // noren índigo con un círculo blanco (sin letras)
  noren: mk(512, 512, (g) => {
    g.fillStyle = "#1f3a5f"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 3000, (i) => `rgba(10,20,40,${0.12 + rnd(i, 1) * 0.12})`, 2);
    g.strokeStyle = "#e9e3d4"; g.lineWidth = 16; g.beginPath(); g.arc(256, 230, 110, 0.2, 6.0); g.stroke();
    g.fillStyle = "#e9e3d4"; g.beginPath(); g.arc(256, 230, 26, 0, 6.3); g.fill();
  }),
  // escarcha: blanco azulado con cristales
  escarcha: mk(256, 256, (g) => {
    g.fillStyle = "#e3eef4"; g.fillRect(0, 0, 256, 256);
    noise(g, 256, 256, 2400, (i) => `rgba(${200 + rnd(i, 1) * 55},${225 + rnd(i, 2) * 30},255,${0.35 + rnd(i, 3) * 0.4})`, 2);
    g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1;
    for (let i = 0; i < 70; i++) { const x = rnd(i, 21) * 256, y = rnd(i, 22) * 256; for (let a = 0; a < 3; a++) { const an = a * 1.047 + rnd(i, 23); g.beginPath(); g.moveTo(x - Math.cos(an) * 5, y - Math.sin(an) * 5); g.lineTo(x + Math.cos(an) * 5, y + Math.sin(an) * 5); g.stroke(); } }
  }, [2, 2]),
  // tatami-papel del farol
  washi: mk(256, 256, (g) => {
    g.fillStyle = "#f6ecd6"; g.fillRect(0, 0, 256, 256);
    noise(g, 256, 256, 1800, (i) => `rgba(170,140,90,${0.05 + rnd(i, 1) * 0.08})`, 2);
    for (let y = 0; y < 256; y += 32) { g.fillStyle = "rgba(120,90,50,.35)"; g.fillRect(0, y, 256, 3); }
  }),
  dot: mk(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  }),
  vapor: mk(128, 128, (g) => {
    for (let k = 0; k < 7; k++) { const gr = g.createRadialGradient(40 + rnd(k, 1) * 48, 40 + rnd(k, 2) * 48, 0, 64, 64, 60); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
  }),
}), []);

// etiqueta de cinta de papel escrita a mano ("RICE · 10/20")
const tapeTex = (txt: string, sub: string) => mk(256, 96, (g) => {
  g.fillStyle = "#f3ead2"; g.fillRect(0, 0, 256, 96);
  noise(g, 256, 96, 300, (i) => `rgba(150,120,70,${0.06 + rnd(i, 1) * 0.06})`, 2);
  g.fillStyle = "#1d1a18"; g.textAlign = "center";
  g.font = `700 50px ${HAND}`; g.fillText(txt, 128, 48);
  g.font = `500 32px ${HAND}`; g.fillText(sub, 128, 84);
});
// la lista de la puerta (papel con renglones; el contenido lo dibuja la pieza 2D cuando la cámara se acerca)
const listTex = (lines: string[], crossed: number) => mk(256, 340, (g) => {
  g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 256, 340);
  g.strokeStyle = "rgba(90,110,150,.25)"; g.lineWidth = 2; for (let y = 60; y < 340; y += 38) { g.beginPath(); g.moveTo(14, y); g.lineTo(242, y); g.stroke(); }
  g.fillStyle = "#1d1a18"; g.font = `700 40px ${HAND}`; g.fillText("Freezer", 20, 42);
  lines.forEach((ln, i) => { g.font = `500 32px ${HAND}`; g.fillText(ln, 22, 92 + i * 38); if (i < crossed) { g.strokeStyle = "#1d1a18"; g.lineWidth = 3; g.beginPath(); g.moveTo(18, 82 + i * 38); g.lineTo(200, 80 + i * 38); g.stroke(); } });
});

// ---------------- piezas básicas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number; o?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o < 1} opacity={o} /></mesh>
);
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; map?: Tx; rot?: V; s?: number; m?: number; inner?: string; seg?: number; phys?: boolean }> = ({ prof, p, c, r = 0.6, map, rot, s = 1, m = 0, inner, seg = 40, phys }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), seg), [JSON.stringify(prof), seg]);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow receiveShadow>{phys ? <meshPhysicalMaterial color={c} roughness={r} clearcoat={0.8} clearcoatRoughness={0.2} side={inner ? THREE.FrontSide : THREE.DoubleSide} /> : <meshStandardMaterial color={c} roughness={r} metalness={m} map={map} side={inner ? THREE.FrontSide : THREE.DoubleSide} />}</mesh>
      {inner && <mesh geometry={geo}><meshStandardMaterial color={inner} roughness={0.4} side={THREE.BackSide} /></mesh>}
    </group>
  );
};
const BOWL: [number, number][] = [[0, 0], [0.03, 0], [0.035, 0.008], [0.06, 0.035], [0.065, 0.06], [0.062, 0.062]];
const CUP: [number, number][] = [[0, 0], [0.025, 0], [0.032, 0.02], [0.034, 0.07], [0.032, 0.072]];
const POT: [number, number][] = [[0, 0], [0.13, 0], [0.14, 0.01], [0.145, 0.12], [0.15, 0.125]];
const JAR: [number, number][] = [[0, 0], [0.055, 0], [0.06, 0.01], [0.06, 0.17], [0.045, 0.19], [0.045, 0.21]];

// vapor/niebla deterministas (sprites). fall = la niebla fría CAE (va hacia abajo y hacia afuera)
const Puffs: React.FC<{ p: V; t: number; amt: number; tex: THREE.Texture; spread?: number; h?: number; n?: number; size?: number; col?: string; fall?: boolean; out?: number }> = ({ p, t, amt, tex, spread = 0.25, h = 0.9, n = 16, size = 0.35, col = "#fff6ea", fall, out = 0 }) => {
  if (amt <= 0.01) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => {
        const life = 2.8 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const y = fall ? -ph * h * (0.4 + ph) : ph * h;
        const x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.04 * ph, z = (rnd(i, 4) - 0.5) * spread + out * ph;
        const s = size * (0.5 + ph * 1.5);
        return <sprite key={i} position={[x, y, z]} scale={[s, s, 1]}><spriteMaterial map={tex} color={col} transparent opacity={amt * (fall ? 0.4 : 0.3) * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>;
      })}
    </group>
  );
};

// ---------------- EL CAJÓN DEL CONGELADOR (en corte) ----------------
// order 0 = el desorden (tapers redondos escarchados, bolsas-bulto, la piedra al fondo) · 1 = el orden de Keiko
const BAG_Z = (i: number) => -0.25 + i * 0.05, BAG_H = (i: number) => 0.25 + (7 - i) * 0.016, BAG_X = (i: number) => (i % 2 ? 0.13 : -0.13);
// punto de la etiqueta de la bolsa i en el mundo (cajón abierto)
export const bagTag = (i: number): V => [FR[0] + BAG_X(i), 0.09 + BAG_H(i) - 0.045, FR[2] + 0.04 + DRAWER_OUT + BAG_Z(i) + 0.014];
export type Bag = { k: string; sub: string; col: string; h?: number };
export const ORDER_BAGS: Bag[] = [
  { k: "RICE", sub: "Sun 10/19", col: "#f4f1e8" }, { k: "RICE", sub: "Sun 10/19", col: "#f4f1e8" }, { k: "RICE", sub: "Sun 10/19", col: "#f4f1e8" },
  { k: "SOUP", sub: "10/12", col: "#d9a25a" }, { k: "GREENS", sub: "10/14", col: "#6f9a45" }, { k: "SALMON", sub: "miso 10/15", col: "#e8916a" },
  { k: "CHICKEN", sub: "miso 10/20", col: "#e9d2b0" }, { k: "MUSHROOM", sub: "3 kinds", col: "#9a7a5a" },
];
const Drawer: React.FC<{ t: number; open: number; order: number; stone: number; frost: number; tx: ReturnType<typeof useKitchen>; tapes: THREE.Texture[]; lit: number; miso: number; dashi: number; hl?: number }> = ({ t, open, order, stone, frost, tx, tapes, lit, miso, dashi, hl = -1 }) => {
  const IW = 0.58, ID = 0.56, IH = 0.38;
  const mess = 1 - order;
  return (
    <group position={[FR[0], 0.07, FR[2] + 0.04 + open * DRAWER_OUT]}>
      {/* caja del cajón: piso + 3 paredes interiores (la de adelante es el frente blanco) */}
      <Box p={[0, 0.01, -0.02]} s={[IW, 0.02, ID]} c="#b9c6cc" r={0.6} rad={0.008} />
      <Box p={[-IW / 2, IH / 2, -0.02]} s={[0.02, IH, ID]} c="#c3ced3" r={0.6} rad={0.006} />
      <Box p={[IW / 2, IH / 2, -0.02]} s={[0.02, IH, ID]} c="#c3ced3" r={0.6} rad={0.006} />
      <Box p={[0, IH / 2, -0.02 - ID / 2]} s={[IW, IH, 0.02]} c="#c3ced3" r={0.6} rad={0.006} />
      {/* frente del cajón con manija */}
      <Box p={[0, 0.25, 0.27]} s={[0.66, 0.5, 0.05]} c="#e2e0d9" r={0.4} rad={0.02} />
      <Box p={[0, 0.44, 0.305]} s={[0.4, 0.035, 0.03]} c="#cfd3d6" r={0.25} m={0.6} rad={0.012} />
      {/* escarcha en las paredes (crece con frost) */}
      {frost > 0.01 && <mesh position={[0, IH - 0.004, -0.02 - ID / 2 + 0.013]}><planeGeometry args={[IW, 0.06 + 0.1 * frost]} /><meshStandardMaterial map={tx.escarcha} color="#ffffff" roughness={1} transparent opacity={0.9 * frost} /></mesh>}
      {/* luz fría del congelador */}
      {lit > 0.01 && <pointLight position={[0, 0.42, -0.1]} intensity={0.45 * lit} distance={0.9} decay={2} color="#cfe6ff" />}

      {/* ===== EL DESORDEN ===== */}
      {mess > 0.01 && <group scale={[1, Math.max(0.001, mess), 1]}>
        {Array.from({ length: 5 }, (_, i) => <group key={"tp" + i} position={[-0.2 + (i % 3) * 0.17, 0.02 + Math.floor(i / 3) * 0.1, -0.15 + (i % 2) * 0.22]} rotation={[0.1 * rnd(i, 1), rnd(i, 2), 0.15 * rnd(i, 3)]}>
          <mesh castShadow><cylinderGeometry args={[0.07, 0.065, 0.09, 24]} /><meshStandardMaterial map={tx.escarcha} color="#cfdbe0" roughness={0.95} /></mesh>
          <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.074, 0.074, 0.015, 24]} /><meshStandardMaterial color={["#b5574a", "#4a6a96", "#c09a48", "#4f7a5e", "#7a6a8a"][i]} roughness={0.5} /></mesh>
        </group>)}
        {Array.from({ length: 6 }, (_, i) => <mesh key={"bu" + i} position={[0.16 - (i % 3) * 0.14, 0.13 + Math.floor(i / 3) * 0.05, 0.12 - (i % 2) * 0.12]} rotation={[(rnd(i, 4) - 0.5) * 0.7, rnd(i, 5) * 3, (rnd(i, 6) - 0.5) * 0.6]} castShadow geometry={rbox(0.16, 0.035 + rnd(i, 7) * 0.02, 0.12, 0.014)}>
          <meshStandardMaterial map={tx.escarcha} color={["#d8e2e6", "#e3d6c8", "#d0dccf", "#dcd2d8", "#d8e2e6", "#e6dcc4"][i]} roughness={0.95} /></mesh>)}
      </group>}
      {/* LA PIEDRA: la bolsita blanca de escarcha al fondo */}
      {stone > 0.01 && <group position={[0.12, 0.2, -0.2]} rotation={[0.35, 0.6, 0.25]} scale={stone}>
        <mesh castShadow geometry={rbox(0.15, 0.055, 0.12, 0.022)}><meshStandardMaterial map={tx.escarcha} color="#e4edf2" roughness={1} emissive="#9fd0ff" emissiveIntensity={0.04} /></mesh>
        <mesh position={[0.055, 0.03, -0.03]} rotation={[0.3, 0.2, 0.5]} geometry={rbox(0.05, 0.02, 0.04, 0.008)}><meshStandardMaterial map={tx.escarcha} color="#f2f7fa" roughness={1} /></mesh>
        <mesh position={[-0.07, 0.0, 0.02]} rotation={[0, 0, 0.6]} geometry={rbox(0.03, 0.05, 0.025, 0.008)}><meshStandardMaterial map={tx.escarcha} color="#eef4f7" roughness={1} /></mesh>
      </group>}

      {/* ===== EL ORDEN DE KEIKO: bolsas planas paradas como libros ===== */}
      {order > 0.01 && ORDER_BAGS.map((b, i) => {
        const a = order * ORDER_BAGS.length * 1.4 - i * 1.0, k = cl(a), up = ease(k);
        if (k <= 0.001) return null;
        const bz = BAG_Z(i), h = BAG_H(i), xo = BAG_X(i), glow = hl === i ? 1 : 0;
        return <group key={"ob" + i} position={[0, 0.02 + (1 - up) * 0.35, bz]} rotation={[(1 - up) * 0.5, 0, 0]}>
          <Box p={[0, h / 2, 0]} s={[0.5, h, 0.026]} c={b.col} r={0.4} rad={0.01} e={glow ? "#ffd27a" : undefined} ei={glow * 0.3} />
          <mesh position={[xo, h - 0.045, 0.0135]}><planeGeometry args={[0.17, 0.064]} /><meshStandardMaterial map={tapes[i]} roughness={0.9} /></mesh>
          {/* brillo del plástico */}
          <mesh position={[-xo * 0.6, h * 0.45, 0.014]}><planeGeometry args={[0.2, 0.08]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.1} roughness={0.05} clearcoat={1} /></mesh>
        </group>;
      })}
      {/* bolitas de miso envueltas (adelante a la izquierda) */}
      {miso > 0.01 && Array.from({ length: 10 }, (_, i) => { const k = cl(miso * 12 - i); if (k <= 0.001) return null; return <mesh key={"mi" + i} position={[-0.24 + (i % 5) * 0.05, 0.43 + (1 - ease(k)) * 0.2, 0.125 + Math.floor(i / 5) * 0.045]} scale={ease(k)} castShadow>
        <sphereGeometry args={[0.022, 16, 12]} /><meshPhysicalMaterial color="#c08a4a" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} transmission={0.2} /></mesh>; })}
      {/* cubetera de dashi (adelante a la derecha) */}
      {(miso > 0.01 || dashi > 0.01) && <Box p={[0, 0.4, 0.15]} s={[0.56, 0.012, 0.15]} c="#cfd6da" r={0.4} m={0.3} rad={0.004} />}
      {dashi > 0.01 && <group position={[0.15, 0.42 + (1 - ease(cl(dashi))) * 0.2, 0.15]} scale={ease(cl(dashi))}>
        <Box p={[0, 0, 0]} s={[0.22, 0.03, 0.1]} c="#e9eef0" r={0.3} rad={0.006} />
        {Array.from({ length: 8 }, (_, i) => <mesh key={"dc" + i} position={[-0.08 + (i % 4) * 0.053, 0.022, -0.022 + Math.floor(i / 4) * 0.045]}><boxGeometry args={[0.04, 0.025, 0.035]} /><meshPhysicalMaterial color="#d8b071" roughness={0.1} transmission={0.4} thickness={0.03} clearcoat={1} /></mesh>)}
      </group>}
      <Puffs p={[0, 0.42, 0.25]} t={t} amt={open * (0.35 + 0.25 * frost)} tex={tx.vapor} spread={0.5} h={0.4} n={10} size={0.24} col="#e6f3ff" fall out={0.25} />
    </group>
  );
};

// ---------------- props del mundo que cambian con el video ----------------
export type WorldProps = {
  t: number;
  night?: number;      // 0 día · 1 noche
  drawer?: number;     // 0..1 cajón del congelador abierto
  order?: number;      // 0 desorden escarchado · 1 el orden de Keiko
  stone?: number;      // 0..1 la bolsa-piedra al fondo
  frost?: number;      // 0..1 cuánta escarcha
  miso?: number;       // 0..1 bolitas de miso en el cajón
  dashi?: number;      // 0..1 cubetera de dashi
  hlBag?: number;      // índice de bolsa resaltada
  lid?: number;        // 0..1 tapa del tacho abierta
  list?: number;       // 0..1 la lista en la puerta
  listLines?: string[]; listCrossed?: number;
  pot?: number;        // vapor de la olla
  cooker?: number;     // vapor de la arrocera
  ricebox?: number;    // 0..1 brillo cálido sobre la caja de arroz de la madre
  bowlOn?: number;     // 0..1 la comida servida en la mesita (una persona)
  top?: number;        // 1 = esconde el farol (tomas cenitales)
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, night = 0, drawer = 0, order = 0, stone = 0, frost = 0.6, miso = 0, dashi = 0, hlBag = -1, lid = 0, list = 1, pot = 0.6, cooker = 0, ricebox = 0, bowlOn = 1 } = pr;
  const tx = useKitchen();
  const [fontOk, setFontOk] = useState(false);
  useMemo(() => { const h = delayRender("letra a mano"); handReady().then(() => { setFontOk(true); requestAnimationFrame(() => continueRender(h)); }).catch(() => { setFontOk(true); continueRender(h); }); }, []);
  const tapes = useMemo(() => (fontOk ? ORDER_BAGS.map((b) => tapeTex(b.k, b.sub)) : []), [fontOk]);
  const lines = pr.listLines ?? ["rice  ||||| ||", "miso balls  10", "greens  ||", "soup  |", "salmon  ||", "chicken  ||"];
  const lt = useMemo(() => (fontOk ? listTex(lines, pr.listCrossed ?? 0) : undefined), [fontOk, JSON.stringify(lines), pr.listCrossed ?? 0]);
  const sky = new THREE.Color("#f3efe6").lerp(new THREE.Color("#18233d"), night);
  const fogC = new THREE.Color("#2a2420").lerp(new THREE.Color("#0b0f18"), night);
  const sunI = 1.55 * (1 - night);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.32 + 0.15 * night} threshold={0.92 - 0.05 * night} exposure={0.94 - 0.1 * night} env={0.24 * (1 - night) + 0.05} />
      <color attach="background" args={[fogC.getHex()]} />
      <fog attach="fog" args={[fogC.getHex(), 7, 26]} />
      <hemisphereLight args={[new THREE.Color("#fff1dc").lerp(new THREE.Color("#3a4a72"), night).getHex(), 0x2a1a10, 0.6 - 0.38 * night]} />
      {/* luz de la mañana por la ventana esmerilada y por el lado abierto */}
      <directionalLight position={[-3, 5, 4]} intensity={sunI} color="#fff0d8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <rectAreaLight position={[PT.window[0], PT.window[1], PT.window[2] + 0.05]} width={1.0} height={0.7} intensity={(5 - 4.2 * night)} color={night > 0.5 ? "#7f95c8" : "#fff4e2"} />
      {/* el farol de papel sobre la mesita */}
      <pointLight position={[-0.25, 1.95, 0.45]} intensity={1.4 + 2.6 * night} distance={6} decay={1.5} color="#ffc27e" castShadow shadow-bias={-0.0004} />

      {/* ===== piso y paredes ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4.8, 3.6]} /><meshStandardMaterial map={tx.piso} roughness={0.75} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#1b1612" roughness={1} /></mesh>
      {/* pared del fondo: madera arriba, azulejo detrás de la mesada */}
      <Box p={[0, 1.3, -1.86]} s={[4.8, 2.6, 0.1]} c="#d9c7aa" map={tx.hinokiH} r={0.85} rad={0.01} />
      <mesh position={[-0.7, 1.22, -1.805]}><planeGeometry args={[3.2, 0.72]} /><meshStandardMaterial map={tx.azulejo} roughness={0.25} /></mesh>
      {/* ventana esmerilada con marco de aluminio viejo */}
      <group position={PT.window}>
        <Box p={[0, 0, 0.0]} s={[1.08, 0.78, 0.06]} c="#8f8a80" r={0.4} m={0.5} rad={0.01} />
        {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0, 0.035]}><planeGeometry args={[0.48, 0.7]} /><meshStandardMaterial color={sky.getStyle()} emissive={sky.getStyle()} emissiveIntensity={0.9 - 0.6 * night} roughness={0.9} /></mesh>)}
        <Box p={[0, 0, 0.04]} s={[0.03, 0.74, 0.02]} c="#77736a" r={0.4} m={0.5} rad={0.005} />
      </group>
      {/* pared izquierda */}
      <Box p={[-2.45, 1.3, 0]} s={[0.1, 2.6, 3.6]} c="#d9c7aa" map={tx.hinoki} r={0.85} rad={0.01} />
      {/* pared derecha con la puerta y el noren */}
      <Box p={[2.45, 1.3, -1.25]} s={[0.1, 2.6, 1.3]} c="#d9c7aa" map={tx.hinoki} r={0.85} rad={0.01} />
      <Box p={[2.45, 2.25, -0.15]} s={[0.1, 0.7, 0.9]} c="#d9c7aa" map={tx.hinoki} r={0.85} rad={0.01} />
      {[-0.6, 0.3].map((z) => <Box key={z} p={[2.4, 0.95, z]} s={[0.08, 1.9, 0.06]} c="#6a4426" map={tx.oscura} r={0.8} />)}
      {/* noren: dos paños que se mecen */}
      {[-0.37, 0.07].map((z, i) => <mesh key={z} position={[2.36, 1.62, z + 0.11]} rotation={[0, -Math.PI / 2, Math.sin(t * 0.9 + i * 1.7) * 0.03]}><planeGeometry args={[0.43, 0.62, 8, 8]} /><meshStandardMaterial map={tx.noren} side={THREE.DoubleSide} roughness={0.95} /></mesh>)}
      {/* techo (sólo atrás, la cámara entra por adelante) + viga */}
      <Box p={[0, 2.62, -0.9]} s={[4.8, 0.06, 1.9]} c="#cdb48a" map={tx.hinokiH} r={0.9} rad={0.01} />
      <Box p={[0, 2.55, 0.1]} s={[4.8, 0.14, 0.14]} c="#6a4426" map={tx.oscura} r={0.9} />

      {/* ===== MESADA ===== */}
      <group>
        <Box p={[-0.7, 0.42, -1.5]} s={[3.2, 0.84, 0.6]} c="#d6b07a" map={tx.hinoki} r={0.8} rad={0.015} />
        {Array.from({ length: 6 }, (_, i) => <group key={"pu" + i}>
          <mesh position={[-2.03 + i * 0.533, 0.42, -1.195]}><planeGeometry args={[0.5, 0.78]} /><meshStandardMaterial map={tx.hinoki} color="#c99e66" roughness={0.75} /></mesh>
          <Box p={[-2.03 + i * 0.533 + (i % 2 ? -0.19 : 0.19), 0.62, -1.18]} s={[0.025, 0.12, 0.025]} c="#5a4a3a" r={0.4} m={0.6} rad={0.008} />
        </group>)}
        <Box p={[-0.7, COUNTER_Y - 0.01, -1.48]} s={[3.24, 0.03, 0.66]} c="#b9bcbf" r={0.32} m={0.65} rad={0.01} />
        {/* pileta */}
        <mesh position={[-0.95, COUNTER_Y + 0.006, -1.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.55, 0.4]} /><meshStandardMaterial color="#5c5f63" roughness={0.3} metalness={0.7} /></mesh>
        <group position={[-0.95, COUNTER_Y, -1.74]}>
          <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.015, 0.018, 0.3, 10]} /><meshStandardMaterial color="#c8cbce" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, 0.3, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.17, 10]} /><meshStandardMaterial color="#c8cbce" metalness={0.8} roughness={0.2} /></mesh>
        </group>
        {/* tabla con un daikon */}
        <Box p={[-0.35, COUNTER_Y + 0.02, -1.45]} s={[0.42, 0.03, 0.26]} c="#e2c18e" map={tx.hinokiH} r={0.8} rad={0.01} />
        <mesh position={[-0.35, COUNTER_Y + 0.07, -1.45]} rotation={[0, 0.3, Math.PI / 2]} castShadow><cylinderGeometry args={[0.04, 0.03, 0.34, 18]} /><meshStandardMaterial color="#f3efe6" roughness={0.6} /></mesh>
        {/* hornalla de dos fuegos con olla */}
        <Box p={[0.32, COUNTER_Y + 0.05, -1.5]} s={[0.62, 0.1, 0.42]} c="#2a2a2c" r={0.4} m={0.4} rad={0.02} />
        <group position={[0.18, COUNTER_Y + 0.1, -1.5]}><Lathe prof={POT} p={[0, 0, 0]} c="#9aa0a4" r={0.3} m={0.7} inner="#3a3a3a" /></group>
        <Puffs p={[0.18, COUNTER_Y + 0.24, -1.5]} t={t} amt={pot} tex={tx.vapor} spread={0.14} h={0.8} n={10} size={0.26} />
        {/* pava */}
        <group position={[0.48, COUNTER_Y + 0.1, -1.5]}><Lathe prof={[[0, 0], [0.09, 0], [0.1, 0.04], [0.09, 0.12], [0.04, 0.15], [0.02, 0.17]]} p={[0, 0, 0]} c="#c9b8a0" r={0.3} m={0.5} /></group>
        {/* arrocera blanca */}
        <group position={[-2.0, COUNTER_Y, -1.5]}>
          <mesh position={[0, 0.12, 0]} castShadow scale={[1, 0.85, 0.9]}><sphereGeometry args={[0.16, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshPhysicalMaterial color="#f4f2ee" roughness={0.3} clearcoat={0.7} /></mesh>
          <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.16, 0.15, 0.13, 28]} /><meshPhysicalMaterial color="#f4f2ee" roughness={0.3} clearcoat={0.7} /></mesh>
          <mesh position={[0, 0.06, 0.15]}><planeGeometry args={[0.09, 0.05]} /><meshStandardMaterial color="#9bb8a0" emissive="#9bd8a8" emissiveIntensity={0.4} /></mesh>
        </group>
        <Puffs p={[-2.0, COUNTER_Y + 0.27, -1.5]} t={t} amt={cooker} tex={tx.vapor} spread={0.06} h={0.7} n={8} size={0.18} />
      </group>

      {/* ===== APARADOR de vidrio ondulado (pared izquierda) ===== */}
      <group position={[-2.2, 0, 0.0]}>
        <Box p={[0, 0.45, 0]} s={[0.42, 0.9, 1.2]} c="#c99e66" map={tx.hinoki} r={0.75} rad={0.015} />
        <Box p={[0.02, 0.92, 0]} s={[0.46, 0.04, 1.24]} c="#b98c58" map={tx.hinokiH} r={0.7} rad={0.01} />
        {[-0.3, 0.3].map((z) => <Box key={z} p={[0.215, 0.7, z]} s={[0.02, 0.14, 0.54]} c="#bf9460" map={tx.hinokiH} r={0.7} rad={0.008} />)}
        <Box p={[0, 1.85, 0]} s={[0.36, 1.0, 1.2]} c="#c99e66" map={tx.hinoki} r={0.75} rad={0.015} />
        {[-0.3, 0.3].map((z) => <group key={"vd" + z}>
          <mesh position={[0.185, 1.85, z]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.5, 0.86]} /><meshStandardMaterial map={tx.ondulado} roughness={0.15} metalness={0.1} emissive="#e9dcc3" emissiveIntensity={0.08} /></mesh>
          <Box p={[0.19, 1.85, z]} s={[0.02, 0.9, 0.04]} c="#a67a48" r={0.7} rad={0.005} />
        </group>)}
        {/* frascos de vidrio en el estante abierto: porotos blancos, soja, porotos verdes */}
        {["#efe9dc", "#c9a56a", "#5d7a3a", "#3a2a24"].map((c, i) => <group key={"fr" + i} position={[0.05, 0.94, -0.42 + i * 0.13]}>
          <Lathe prof={JAR} p={[0, 0, 0]} c="#e8f0f2" r={0.05} phys s={0.8} />
          <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.043, 0.043, 0.13, 18]} /><meshStandardMaterial color={c} roughness={0.85} /></mesh>
        </group>)}
        {/* LA CAJA DE ARROZ DE LA MADRE, con la abolladura en la tapa */}
        <group position={[0.1, 0.94, 0.28]} rotation={[0, 0.25, 0]}>
          <Box p={[0, 0.11, 0]} s={[0.3, 0.22, 0.4]} c="#6b4426" map={tx.oscura} r={0.7} rad={0.01} e="#ffb060" ei={0.12 * ricebox} />
          {[[-0.15, -0.2], [0.15, -0.2], [-0.15, 0.2], [0.15, 0.2]].map(([x, z]) => <Box key={x + "" + z} p={[x, 0.11, z]} s={[0.03, 0.23, 0.03]} c="#2e2a26" r={0.5} m={0.6} rad={0.004} />)}
          {/* tapa con la abolladura (una tapa partida en dos alturas + sombra) */}
          <Box p={[0, 0.235, 0]} s={[0.32, 0.03, 0.42]} c="#5a3618" map={tx.oscura} r={0.6} rad={0.008} />
          <mesh position={[-0.03, 0.2505, 0.05]} rotation={[-Math.PI / 2, 0, 0.5]} scale={[1, 0.7, 1]}><circleGeometry args={[0.075, 32]} /><meshStandardMaterial color="#2a1608" roughness={0.5} transparent opacity={0.55} /></mesh>
          <mesh position={[-0.02, 0.2508, 0.06]} rotation={[-Math.PI / 2, 0, 0.5]} scale={[1, 0.55, 1]}><ringGeometry args={[0.062, 0.078, 32]} /><meshStandardMaterial color="#8a5a30" roughness={0.4} transparent opacity={0.25} /></mesh>
          {/* cucharón de madera para medir el arroz */}
          <group position={[0.08, 0.25, -0.12]} scale={0.7}><Lathe prof={[[0, 0], [0.045, 0], [0.05, 0.06], [0.05, 0.065]]} p={[0, 0, 0]} c="#b98c58" r={0.7} map={tx.hinokiH} /><Box p={[0.08, 0.04, 0]} s={[0.1, 0.015, 0.025]} c="#b98c58" r={0.7} rad={0.005} /></group>
          {ricebox > 0.01 && <pointLight position={[0.2, 0.55, 0.2]} intensity={0.7 * ricebox} distance={1.1} color="#ffb766" />}
        </group>
      </group>

      {/* ===== LA HELADERA con el cajón del congelador ===== */}
      <group>
        <Box p={[FR[0], 1.13, FR[2]]} s={[0.66, 1.06, 0.68]} c="#e2e0d9" r={0.4} rad={0.03} />
        <Box p={[FR[0] - 0.29, 1.15, FR[2] + 0.36]} s={[0.03, 0.4, 0.04]} c="#cfd3d6" r={0.25} m={0.6} rad={0.012} />
        <Box p={[FR[0], 0.035, FR[2] - 0.05]} s={[0.64, 0.07, 0.6]} c="#3a3a3c" r={0.6} rad={0.01} />
        {/* carcasa del congelador (hueco donde corre el cajón) */}
        <Box p={[FR[0], 0.32, FR[2] - 0.05]} s={[0.66, 0.58, 0.58]} c="#e9e8e2" r={0.4} rad={0.02} />
        <mesh position={[FR[0], 0.33, FR[2] + 0.245]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#0c1218" emissive="#9fd0ff" emissiveIntensity={0.25 * drawer} /></mesh>
        <Drawer t={t} open={drawer} order={order} stone={stone} frost={frost} tx={tx} tapes={tapes} lit={drawer} miso={miso} dashi={dashi} hl={hlBag} />
        {/* la lista con imán rojo en la puerta */}
        {lt && list > 0.01 && <group position={[FR[0] + 0.08, 1.22, FR[2] + 0.346 + 0.002]} scale={list}>
          <mesh><planeGeometry args={[0.2, 0.265]} /><meshStandardMaterial map={lt} roughness={0.9} /></mesh>
          <mesh position={[0, 0.13, 0.01]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.015, 20]} /><meshStandardMaterial color="#c8352b" roughness={0.4} /></mesh>
        </group>}
        {/* marcador y cinta en un vasito arriba de la heladera */}
        <group position={[FR[0] + 0.18, 1.66, FR[2] + 0.1]}>
          <Lathe prof={CUP} p={[0, 0, 0]} c="#e8e0d0" r={0.5} s={1.4} />
          <mesh position={[0.01, 0.1, 0]} rotation={[0.15, 0, 0.1]}><cylinderGeometry args={[0.008, 0.008, 0.13, 8]} /><meshStandardMaterial color="#1d1a18" /></mesh>
          <mesh position={[-0.07, 0.025, 0.02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.012, 8, 20]} /><meshStandardMaterial color="#efe3c4" roughness={0.9} /></mesh>
        </group>
      </group>

      {/* ===== EL TACHO con pedal y tapa ===== */}
      <group position={[1.02, 0, -1.02]}>
        <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.13, 0.12, 0.4, 28]} /><meshStandardMaterial color="#efefea" roughness={0.35} metalness={0.15} /></mesh>
        <Box p={[0, 0.02, 0.14]} s={[0.1, 0.02, 0.06]} c="#9a9a96" r={0.4} m={0.5} rad={0.008} />
        <group position={[0, 0.4, -0.13]} rotation={[-lid * 1.2, 0, 0]}>
          <mesh position={[0, 0.012, 0.13]} castShadow><cylinderGeometry args={[0.135, 0.135, 0.025, 28]} /><meshStandardMaterial color="#e6e6e0" roughness={0.3} metalness={0.2} /></mesh>
        </group>
      </group>

      {/* ===== LA MESITA PARA UNA ===== */}
      <group position={[PT.table[0], 0, PT.table[2]]}>
        <Box p={[0, 0.71, 0]} s={[0.82, 0.04, 0.56]} c="#c99e66" map={tx.hinokiH} r={0.6} rad={0.012} />
        {[[-0.36, -0.23], [0.36, -0.23], [-0.36, 0.23], [0.36, 0.23]].map(([x, z]) => <Box key={x + "" + z} p={[x, 0.35, z]} s={[0.05, 0.7, 0.05]} c="#8a5c32" map={tx.oscura} r={0.7} />)}
        {/* banquito */}
        <group position={[0, 0, 0.55]}><Box p={[0, 0.44, 0]} s={[0.32, 0.04, 0.3]} c="#c99e66" map={tx.hinokiH} r={0.7} rad={0.01} />{[[-0.13, -0.12], [0.13, -0.12], [-0.13, 0.12], [0.13, 0.12]].map(([x, z]) => <Box key={x + "" + z} p={[x, 0.21, z]} s={[0.035, 0.42, 0.035]} c="#8a5c32" r={0.7} />)}</group>
        {/* un bol de arroz, una sopa, un platito, un vaso de té, palitos en su apoyo */}
        <group position={[-0.08, 0.73, 0.08]}>
          <Lathe prof={BOWL} p={[0, 0, 0]} c="#efe8dc" r={0.25} phys inner="#f4efe6" s={1.1} />
          {bowlOn > 0.01 && <mesh position={[0, 0.05, 0]} scale={[bowlOn, bowlOn * 0.6, bowlOn]}><sphereGeometry args={[0.058, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#fbfaf6" roughness={0.85} /></mesh>}
        </group>
        <group position={[0.1, 0.73, 0.1]}>
          <Lathe prof={BOWL} p={[0, 0, 0]} c="#4a1f16" r={0.2} phys inner="#2a120c" s={1.0} />
          {bowlOn > 0.01 && <mesh position={[0, 0.048, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.055 * bowlOn, 24]} /><meshPhysicalMaterial color="#b98a4e" roughness={0.2} clearcoat={1} /></mesh>}
        </group>
        <group position={[0.02, 0.73, -0.1]}><mesh><cylinderGeometry args={[0.08, 0.07, 0.015, 24]} /><meshStandardMaterial color="#3b4a63" roughness={0.3} /></mesh>{bowlOn > 0.01 && <mesh position={[0, 0.02, 0]} scale={[1.4 * bowlOn, 0.5 * bowlOn, 0.8 * bowlOn]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#e8865a" roughness={0.5} /></mesh>}</group>
        <group position={[0.24, 0.73, -0.08]}><Lathe prof={CUP} p={[0, 0, 0]} c="#7f9d4c" r={0.35} phys s={1.0} /></group>
        <group position={[-0.02, 0.735, 0.22]} rotation={[0, 0.1, 0]}>
          <Box p={[0, 0.005, 0]} s={[0.04, 0.012, 0.02]} c="#c8352b" r={0.4} rad={0.004} />
          {[-0.006, 0.006].map((z) => <mesh key={z} position={[0.0, 0.016, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.003, 0.0045, 0.22, 6]} /><meshStandardMaterial color="#3a2414" roughness={0.6} /></mesh>)}
        </group>
        <group position={[-0.28, 0.73, -0.12]}><Lathe prof={[[0, 0], [0.06, 0], [0.075, 0.05], [0.07, 0.09], [0.03, 0.11], [0.02, 0.12]]} p={[0, 0, 0]} c="#5a5048" r={0.35} m={0.2} /></group>
      </group>

      {/* farol de papel */}
      <group visible={(pr.top ?? 0) < 0.5} position={[-0.25, 2.05, 0.45]}>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.004, 0.004, 0.5, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh scale={[1, 0.85, 1]}><sphereGeometry args={[0.2, 24, 16]} /><meshStandardMaterial map={tx.washi} color="#f3e2c0" emissive="#ffc77a" emissiveIntensity={0.35 + 0.45 * night} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        {[-0.12, -0.06, 0, 0.06, 0.12].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[Math.sqrt(0.04 - (y / 0.85) * (y / 0.85)) + 0.002, 0.003, 6, 40]} /><meshStandardMaterial color="#5a4630" roughness={0.8} /></mesh>)}
        {[0.16, -0.16].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.07, 0.07, 0.025, 24]} /><meshStandardMaterial color="#2a1f18" roughness={0.6} /></mesh>)}
      </group>
    </ThreeCanvas>
  );
};
