// fbcafe · EL MUNDO: el taller del fondo de Claudio (piso de lajas de cemento, muro de bloque gris, banco de trabajo con
// la radio, el mate, el frasco de café y LA COLECCIÓN; bolsas de cemento, limonero) y en el medio, sobre dos caballetes,
// LA TABLA: cemento que parece pino viejo, EN CORTE en la punta (se ven las capas). La cámara baja a la superficie y la veta
// crece como un paisaje. Al costado, junto a la pileta, el deck de madera de verdad que se pudre en dos inviernos.
// UNA escena y UNA cámara; eventos clavados a la voz (EV, segundos globales). Render SÓLO en el farm (acá sólo stills).
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { P } from "./lib";
import { KEYS as KEYS0, EV } from "./cam";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo ----------------
export const PL = 1.2, PW = 0.18, PH = 0.045;          // LA TABLA (largo x, ancho z, alto y)
export const PLANK: V = [0, 0.62, 0.3];                  // centro de la cara de arriba
export const BENCH: V = [1.9, 0, -2.45];
export const BOOK: V = [1.5, 0.935, -2.42];
export const DECK: V = [3.55, 0, 0.9];
export const PT = {
  plank: [0, PLANK[1], PLANK[2]] as V,
  knot: [-0.18, PLANK[1], PLANK[2] + 0.02] as V,
  cut: [PL / 2 + 0.001, PLANK[1] - PH / 2, PLANK[2]] as V,       // la cara cortada (mira a +x)
  layer: (k: number): V => [PL / 2 + 0.002, PLANK[1] - PH * k, PLANK[2] - PW * 0.3],
  bag: [-1.45, 0.16, -1.5] as V, bags: [-2.25, 0.7, -2.6] as V,
  cafe: [2.25, 1.02, -2.5] as V, radio: [2.7, 1.05, -2.72] as V, mate: [1.08, 1.0, -2.3] as V,
  deck: [DECK[0], 0.12, DECK[2]] as V, deckEnd: [DECK[0] - 0.75, 0.13, DECK[2] + 0.45] as V, mold: [DECK[0], 0.12, DECK[2] + 0.12] as V,
  lemon: [-3.6, 1.8, -2.65] as V,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
export const KEYS: Key[] = [...(KEYS0 as Key[])].sort((a, b) => a.t - b.t);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de cámara en mano (muy suave, proporcional a la distancia) para que nunca quede congelada
  const d = Math.min(1, p.distanceTo(l) / 2);
  p.x += Math.sin(t * 0.7) * 0.004 * d; p.y += Math.sin(t * 0.53 + 1) * 0.003 * d;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.002, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
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
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.002; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- páginas REALES de la Colección (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas coleccion", { timeoutInMilliseconds: 110000 });
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (tt) => { flip.image = tt.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};

// sube TODAS las texturas a la GPU antes de soltar el cuadro: sin esto, la 1ª vez que algo entra en cuadro (la baldosa,
// las páginas) puede salir NEGRO en un cuadro suelto (pasó en los stills)
const Warm: React.FC<{ tex: THREE.Texture[] }> = ({ tex }) => {
  const { gl, advance } = useThree();
  const h = useRef<number | null>(null);
  if (h.current === null) h.current = delayRender("texturas en GPU", { timeoutInMilliseconds: 170000 });
  // con el runner cargado (swangle, 4 pestañas) una textura puede no llegar nunca: a los 80 s se sube lo que haya y se sigue
  const [late, setLate] = useState(false);
  useEffect(() => { const k = setTimeout(() => setLate(true), 80000); return () => clearTimeout(k); }, []);
  const ready = late || tex.every((x) => x.image);
  // cuando llegan (aunque sea tarde, con la máquina cargada): subirlas y VOLVER A DIBUJAR la escena; el lienzo
  // sólo se dibuja al cambiar de cuadro, así que sin este advance el cuadro queda con las texturas en negro
  useLayoutEffect(() => {
    if (!ready) return;
    tex.forEach((x) => gl.initTexture(x));
    advance(performance.now());
    const id = h.current!; h.current = -1;
    if (id >= 0) requestAnimationFrame(() => requestAnimationFrame(() => { advance(performance.now()); continueRender(id); }));
  }, [ready]);
  return null;
};

// texturas FOTOGRÁFICAS (fotos reales vistas desde arriba): pino, deck podrido, piso, muro
const useFoto = (spec: Record<string, [number, number]>) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("texturas foto", { timeoutInMilliseconds: 110000 }); let n = Object.keys(spec).length;
    for (const [id, rep] of Object.entries(spec)) {
      const tx = L.load(staticFile(P + id + ".jpg"), () => { if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(rep[0], rep[1]); r[id] = tx;
    }
    return r;
  }, []);
};

// ---------------- texturas procedurales ----------------
const mkCv = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!); return cv; };
const toTex = (cv: HTMLCanvasElement, rep: [number, number] = [1, 1], srgb = true) => {
  const t = new THREE.CanvasTexture(cv); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 16; return t;
};
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => toTex(mkCv(w, h, draw), rep);

// LA VETA: pino/roble viejo con nudos. Las líneas se abren alrededor de cada nudo como en la madera de verdad.
// col = versión color (tinte de café: lo hondo más oscuro), alt = relieve (vetas = surcos del peine)
const KNOTS = [{ x: 0.35, y: 0.55, r: 0.05 }, { x: 0.72, y: 0.3, r: 0.035 }, { x: 0.12, y: 0.22, r: 0.025 }];
const grain = (g: CanvasRenderingContext2D, w: number, h: number, col: boolean) => {
  const base = g.createLinearGradient(0, 0, 0, h);
  if (col) { base.addColorStop(0, "#9a6c43"); base.addColorStop(0.5, "#a87a4e"); base.addColorStop(1, "#8f6239"); } else { base.addColorStop(0, "#9a9a9a"); base.addColorStop(1, "#9a9a9a"); }
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  const N = 70;
  for (let i = 0; i < N; i++) {
    const y0 = (i + 0.5) / N, late = rnd(i, 1);
    g.beginPath();
    for (let s = 0; s <= 240; s++) {
      const x = s / 240;
      let y = y0 + 0.006 * Math.sin(x * 9 + i * 0.7) + 0.003 * Math.sin(x * 31 + i);
      for (const k of KNOTS) {
        const dx = (x - k.x) * (w / h), dy = y0 - k.y, d = Math.hypot(dx, dy);
        y += (dy >= 0 ? 1 : -1) * k.r * 1.6 * Math.exp(-(dx * dx) / (2 * (k.r * 2.2) ** 2)) * Math.exp(-Math.abs(dy) / (k.r * 3)) * (d < k.r * 1.1 ? 0 : 1);
      }
      if (s === 0) g.moveTo(x * w, y * h); else g.lineTo(x * w, y * h);
    }
    g.strokeStyle = col ? `rgba(${58 + late * 20},${32 + late * 12},${14},${0.35 + late * 0.35})` : `rgba(30,30,30,${0.45 + late * 0.4})`;
    g.lineWidth = (1.2 + late * 3.2) * (h / 512); g.stroke();
  }
  for (const k of KNOTS) {
    const cx = k.x * w, cy = k.y * h, R = k.r * h;
    for (let r = 6; r >= 1; r--) { g.beginPath(); g.ellipse(cx, cy, R * r / 6 * 1.5, R * r / 6, 0, 0, 6.3); g.fillStyle = col ? `rgba(${50 + r * 10},${26 + r * 6},${10 + r * 2},${0.55})` : `rgba(${25 + r * 8},${25 + r * 8},${25 + r * 8},.7)`; g.fill(); }
  }
  // poros y rayitas finas (lo que vende la madera de cerca)
  for (let i = 0; i < 2600; i++) { const x = rnd(i, 3) * w, y = rnd(i, 4) * h; g.fillStyle = col ? `rgba(40,20,8,${0.12 + rnd(i, 5) * 0.2})` : "rgba(20,20,20,.35)"; g.fillRect(x, y, (2 + rnd(i, 6) * 10) * (w / 2048), 1.2 * (h / 512)); }
  // desgaste gris del sol en los bordes (pino de muelle, 40 veranos)
  if (col) { const e = g.createLinearGradient(0, 0, 0, h); e.addColorStop(0, "rgba(170,160,145,.35)"); e.addColorStop(0.12, "rgba(170,160,145,0)"); e.addColorStop(0.88, "rgba(170,160,145,0)"); e.addColorStop(1, "rgba(170,160,145,.35)"); g.fillStyle = e; g.fillRect(0, 0, w, h); }
};
// cemento crudo con arena (lo que hay debajo del tinte)
const cementDraw = (g: CanvasRenderingContext2D, w: number, h: number, tone = 152) => {
  g.fillStyle = `rgb(${tone},${tone - 2},${tone - 6})`; g.fillRect(0, 0, w, h);
  for (let i = 0; i < (w * h) / 90; i++) { const v = rnd(i, 7); g.fillStyle = v < 0.5 ? `rgba(90,88,84,${0.15 + 0.25 * rnd(i, 8)})` : `rgba(210,206,198,${0.15 + 0.25 * rnd(i, 8)})`; g.beginPath(); g.arc(rnd(i, 9) * w, rnd(i, 10) * h, 0.5 + rnd(i, 11) * 1.6, 0, 6.3); g.fill(); }
};

const useTallerTex = () => useMemo(() => {
  const gCol = mkCv(2048, 512, (g) => grain(g, 2048, 512, true));
  const gAlt = mkCv(2048, 512, (g) => grain(g, 2048, 512, false));
  return {
    grain: toTex(gCol), grainBump: toTex(gAlt, [1, 1], false),
    cement: mk(512, 512, (g) => cementDraw(g, 512, 512), [2, 1]),
    // la cara cortada: sellador (brillo), tinte de café (2 mm), cemento con arena, fibra, la malla de alambre
    cut: mk(512, 128, (g) => {
      cementDraw(g, 512, 128, 140);
      g.fillStyle = "#6b4426"; g.fillRect(0, 0, 512, 10); g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(0, 0, 512, 2.5);
      for (let i = 0; i < 70; i++) { g.strokeStyle = "rgba(240,240,235,.55)"; g.lineWidth = 0.8; const x = rnd(i, 1) * 512, y = 14 + rnd(i, 2) * 108, a = rnd(i, 3) * 6.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 4); g.stroke(); }
      for (let k = 0; k < 9; k++) { g.fillStyle = "#5e5a55"; g.beginPath(); g.arc(28 + k * 57, 74, 3.2, 0, 6.3); g.fill(); g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.arc(27 + k * 57, 73, 1.1, 0, 6.3); g.fill(); }
    }),
    // lajas de cemento del piso del taller
    floor: mk(512, 512, (g) => {
      g.fillStyle = "#77736b"; g.fillRect(0, 0, 512, 512);
      for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) { const c = mkCv(250, 250, (gg) => cementDraw(gg, 250, 250, 150 + rnd(r * 2 + q, 1) * 22)); g.drawImage(c, q * 256 + 3, r * 256 + 3); }
      for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(60,50,40,${0.06 + rnd(i, 4) * 0.08})`; g.beginPath(); g.arc(rnd(i, 1) * 512, rnd(i, 2) * 512, 10 + rnd(i, 3) * 40, 0, 6.3); g.fill(); }
    }, [10, 10]),
    // muro de bloque gris con junta
    block: mk(512, 256, (g) => {
      g.fillStyle = "#6d6b66"; g.fillRect(0, 0, 512, 256);
      for (let r = 0; r < 4; r++) for (let q = -1; q < 3; q++) { const o = (r % 2) * 128, c = mkCv(250, 60, (gg) => cementDraw(gg, 250, 60, 140 + rnd(r * 4 + q, 2) * 18)); g.drawImage(c, q * 256 + o + 3, r * 64 + 2); }
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(60,70,50,${0.05 + rnd(i, 5) * 0.06})`; g.beginPath(); g.arc(rnd(i, 1) * 512, 200 + rnd(i, 2) * 56, 10 + rnd(i, 3) * 30, 0, 6.3); g.fill(); }
    }, [5, 2.2]),
    wood: mk(256, 256, (g) => {
      g.fillStyle = "#8a6440"; g.fillRect(0, 0, 256, 256);
      for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(50,30,15,${0.1 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2.5; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(90, y + 4 * rnd(k, 3), 170, y - 4, 256, y + 2); g.stroke(); }
    }, [2, 1]),
    // tabla de deck de madera VERDADERA (se pone gris, con hongo negro)
    deckNew: mk(512, 64, (g) => { g.fillStyle = "#a8743f"; g.fillRect(0, 0, 512, 64); for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(80,40,15,${0.2 + rnd(k, 1) * 0.3})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); g.moveTo(0, k * 4.6 + 2); g.bezierCurveTo(170, k * 4.6 + 6 * rnd(k, 3), 340, k * 4.6 - 3, 512, k * 4.6 + 2); g.stroke(); } }),
    deckOld: mk(512, 64, (g) => {
      g.fillStyle = "#8d8a83"; g.fillRect(0, 0, 512, 64);
      for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(50,48,44,${0.3 + rnd(k, 1) * 0.3})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); g.moveTo(0, k * 4.6 + 2); g.bezierCurveTo(170, k * 4.6 + 6 * rnd(k, 3), 340, k * 4.6 - 3, 512, k * 4.6 + 2); g.stroke(); }
      for (let i = 0; i < 260; i++) { const x = rnd(i, 1) * 512, edge = rnd(i, 2) < 0.5 ? rnd(i, 3) * 8 : 64 - rnd(i, 3) * 8; g.fillStyle = `rgba(15,14,10,${0.25 + rnd(i, 4) * 0.5})`; g.beginPath(); g.arc(x, edge, 1 + rnd(i, 5) * 4, 0, 6.3); g.fill(); }
      for (let i = 0; i < 12; i++) { g.strokeStyle = "rgba(25,22,18,.6)"; g.lineWidth = 1.2; const x = rnd(i, 6) * 512, y = 10 + rnd(i, 7) * 44; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30 + rnd(i, 8) * 60, y + (rnd(i, 9) - 0.5) * 4); g.stroke(); }
    }),
    // bolsa de cemento (papel madera, texto genérico)
    bag: mk(512, 256, (g) => {
      g.fillStyle = "#c9b48c"; g.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,100,70,${0.05 + rnd(i, 1) * 0.08})`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 256, 2 + rnd(i, 4) * 30, 1.5); }
      g.fillStyle = "#3a5a8a"; g.fillRect(40, 60, 432, 70); g.fillStyle = "#f4efe2"; g.font = "900 46px sans-serif"; g.textAlign = "center"; g.fillText("CEMENTO PORTLAND", 256, 112);
      g.fillStyle = "#3a3a3a"; g.font = "800 40px sans-serif"; g.fillText("25 kg", 256, 190);
      g.fillStyle = "rgba(150,150,150,.35)"; g.fillRect(0, 230, 512, 26);
    }),
    // etiqueta del frasco de café
    cafe: mk(256, 128, (g) => { g.fillStyle = "#7a1f1a"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#f2e6c8"; g.font = "900 42px sans-serif"; g.textAlign = "center"; g.fillText("CAFÉ", 128, 58); g.font = "700 20px sans-serif"; g.fillText("INSTANTÁNEO", 128, 92); }),
    granules: mk(128, 128, (g) => { g.fillStyle = "#3a1f0e"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 900; i++) { g.fillStyle = rnd(i, 1) > 0.5 ? "#5a3216" : "#24120a"; g.fillRect(rnd(i, 2) * 128, rnd(i, 3) * 128, 2, 2); } }),
    sky: mk(1024, 512, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#5a95cf"); gr.addColorStop(0.45, "#a9cbe8"); gr.addColorStop(0.52, "#eef0ea"); gr.addColorStop(1, "#c9c2b0"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 40; i++) { const x = rnd(i, 1) * 1024, y = 60 + rnd(i, 2) * 160, r = 30 + rnd(i, 3) * 70; const cg = g.createRadialGradient(x, y, 0, x, y, r * 1.8); cg.addColorStop(0, "rgba(255,255,255,.5)"); cg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = cg; g.beginPath(); g.ellipse(x, y, r * 1.8, r * 0.6, 0, 0, 6.3); g.fill(); }
    }),
  };
}, []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Tube: React.FC<{ pts: V[]; r: number; col: string; grow?: number; seg?: number; m?: number; rough?: number }> = ({ pts, r, col, grow = 1, seg = 40, m = 0, rough = 0.7 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(v3)), seg, r, 8, false), [pts.map((q) => q.join()).join("|"), r, seg]);
  const n = geo.index ? geo.index.count : 0;
  geo.setDrawRange(0, Math.floor((n * cl(grow)) / 48) * 48);
  if (grow <= 0.001) return null;
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={col} roughness={rough} metalness={m} /></mesh>;
};

// LA COLECCIÓN: libro de tapa dura, tapa con bisagra, hoja que pasa con curva (mismo libro de hdcesq)
const PAPER = "#b3ada3";
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
export const BW = 0.3, BD = 0.42;
export const pageAt = (u: number, v: number): V => [BOOK[0] + 0.004 + (u - 0.5) * (BW - 0.01), BOOK[1] + 0.046, BOOK[2] + (v - 0.5) * (BD - 0.012)];
const Book: React.FC<{ p: V; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[] }> = ({ p, open, cover, inside, right, spine, flips = [] }) => {
  const w = BW, d = BD, th = 0.034;
  const ang = Math.PI * ease(open);
  return (
    <group position={p}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#c4bcab" roughness={0.95} /></mesh>
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Sheet ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} /></group>)}
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.38} metalness={0.05} /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};

// LA TABLA en los caballetes. skin = cuánto de la "piel de madera" queda (1 = toda; se barre desde la punta izquierda),
// relieve: plano subdividido con desplazamiento (de cerca, la veta es un paisaje de surcos y lomas)
const Plank: React.FC<{ tx: ReturnType<typeof useTallerTex>; skin: number; wet: number; foto: THREE.Texture }> = ({ tx, skin, wet, foto }) => {
  const geo = useMemo(() => { const g = new THREE.PlaneGeometry(PL, PW, 600, 90); g.rotateX(-Math.PI / 2); return g; }, []);
  const ks = cl(skin);
  const y0 = PLANK[1];
  return (
    <group>
      {/* cuerpo de cemento (lo que hay debajo) */}
      <mesh position={[0, y0 - PH / 2, PLANK[2]]} castShadow receiveShadow geometry={rbox(PL, PH, PW, 0.004)}><meshStandardMaterial map={tx.cement} color="#d8d4cc" roughness={0.9} /></mesh>
      {/* la cara cortada con las capas */}
      <mesh position={[PL / 2 + 0.0008, y0 - PH / 2, PLANK[2]]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[PW - 0.004, PH - 0.002]} /><meshStandardMaterial map={tx.cut} roughness={0.85} /></mesh>
      {/* la piel de madera (café + peine + sellador), recortada desde la izquierda */}
      {ks > 0.002 && <group position={[PL / 2 - (PL * ks) / 2, y0 + 0.0012, PLANK[2]]} scale={[ks, 1, 1]}>
        <mesh geometry={geo} receiveShadow castShadow>
          <meshStandardMaterial map={foto} bumpMap={foto} bumpScale={2.2} displacementMap={foto} displacementScale={0.0012} displacementBias={-0.0004}
            roughness={0.62 - 0.4 * wet} metalness={0.02} color={new THREE.Color("#ffffff").multiplyScalar(1 - 0.25 * wet)} />
        </mesh>
      </group>}
    </group>
  );
};

// caballete de madera
const Horse: React.FC<{ x: number; map: THREE.Texture }> = ({ x, map }) => (
  <group position={[x, 0, PLANK[2]]}>
    <Box p={[0, 0.57, 0]} s={[0.09, 0.05, 0.7]} c="#b8a48c" r={0.85} map={map} rad={0.004} />
    {[-1, 1].map((sz) => [-1, 1].map((sx) => <Box key={sz + "" + sx} p={[sx * 0.1, 0.28, sz * 0.25]} s={[0.045, 0.6, 0.035]} c="#a8937a" map={map} rad={0.004} rot={[0, 0, sx * 0.3]} />))}
  </group>
);

// bolsa de cemento: almohadón de papel
const Bag: React.FC<{ p: V; rot?: V; tex: THREE.Texture }> = ({ p, rot, tex }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(0.62, 0.15, 0.42, 0.06)}><meshStandardMaterial map={tex} roughness={0.95} /></mesh>
);

// el deck de madera de verdad, al lado de la pileta: rot 0→1 = dos inviernos (gris, puntas levantadas, hongo negro, astillas)
const Deck: React.FC<{ tx: ReturnType<typeof useTallerTex>; rot: number; wet: number; nueva: THREE.Texture; vieja: THREE.Texture }> = ({ tx, rot, wet, nueva, vieja }) => {
  const n = 9, bw = 0.14, gap = 0.012, L = 1.6;
  // la foto del deck tiene 6 tablas apiladas: cada tabla del modelo toma una franja
  const viejas = useMemo(() => Array.from({ length: n * 3 }, (_, j) => { const c = vieja.clone(); c.repeat.set(1, 1 / 6); c.offset.set(0, ((j * 7) % 6) / 6); c.needsUpdate = true; return c; }), [vieja, vieja.image]);
  const nuevas = useMemo(() => Array.from({ length: n * 3 }, (_, j) => { const c = nueva.clone(); c.repeat.set(0.33, 0.12); c.offset.set((j % 3) * 0.33, rnd(Math.floor(j / 3), 2) * 0.85); c.needsUpdate = true; return c; }), [nueva, nueva.image]);
  return (
    <group position={DECK}>
      {[-0.55, 0, 0.55].map((x, i) => <Box key={i} p={[x, 0.04, 0]} s={[0.07, 0.08, n * (bw + gap)]} c="#5a4630" />)}
      {Array.from({ length: n }, (_, i) => {
        const z = (i - (n - 1) / 2) * (bw + gap), lift = rot * (0.02 + rnd(i, 1) * 0.035), cup = rot * (rnd(i, 2) - 0.5) * 0.12;
        return <group key={i} position={[0, 0.095, z]} rotation={[cup, 0, 0]}>
          {[-1, 0, 1].map((seg) => <group key={seg} position={[seg * L / 3, 0, 0]} rotation={[0, 0, seg === 0 ? 0 : -seg * lift * (i % 3 === 0 ? 1.4 : 0.7)]}>
            <mesh position={[0, 0, 0]} castShadow receiveShadow><boxGeometry args={[L / 3 + 0.002, 0.022, bw]} /><meshStandardMaterial map={nuevas[i * 3 + seg + 1]} roughness={0.75} transparent opacity={1} color={new THREE.Color("#ffffff").multiplyScalar(1 - 0.3 * wet)} /></mesh>
            {rot > 0.01 && <mesh position={[0, 0.0115, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[L / 3, bw]} /><meshStandardMaterial map={viejas[i * 3 + seg + 1]} transparent opacity={rot} roughness={0.95} color={new THREE.Color("#ffffff").multiplyScalar(1 - 0.35 * wet)} /></mesh>}
          </group>)}
          {/* astillas que se levantan */}
          {rot > 0.5 && i % 2 === 1 && <mesh position={[(rnd(i, 3) - 0.5) * 1.1, 0.014, (rnd(i, 4) - 0.5) * 0.08]} rotation={[0, rnd(i, 5) * 0.4, 0.35 * (rot - 0.5) * 2]}><boxGeometry args={[0.09, 0.002, 0.006]} /><meshStandardMaterial color="#9a958b" roughness={0.9} /></mesh>}
        </group>;
      })}
      {/* hongo negro en las juntas */}
      {false && Array.from({ length: n - 1 }, (_, i) => <mesh key={"m" + i} position={[0, 0.108, (i + 0.5 - (n - 1) / 2) * (bw + gap)]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[L, 0.02]} /><meshStandardMaterial color="#0e0d0a" transparent opacity={rot * 0.85} /></mesh>)}
      {/* la pileta */}
      <mesh position={[L / 2 + 0.95, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.8, 2.6]} /><meshStandardMaterial color="#3aa6c8" roughness={0.08} metalness={0.3} /></mesh>
      <Box p={[L / 2 + 0.06, 0.03, 0]} s={[0.1, 0.06, 2.6]} c="#d8d2c4" />
    </group>
  );
};

// limonero: tronco + copa de hojas instanciadas + limones
const Lemon: React.FC<{ p: V }> = ({ p }) => {
  const items = useMemo(() => Array.from({ length: 700 }, (_, i) => { const a = rnd(i, 1) * 6.3, b = rnd(i, 2) * 3.1, r = 0.55 + rnd(i, 3) * 0.35; return { p: [Math.cos(a) * Math.sin(b) * r, 1.9 + Math.cos(b) * r * 0.75, Math.sin(a) * Math.sin(b) * r] as V, r: [rnd(i, 4) * 6, rnd(i, 5) * 6, rnd(i, 6) * 6] as V, c: rnd(i, 7) > 0.3 ? "#2f5a24" : "#3f7a2e" }; }), []);
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshStandardMaterial({ roughness: 0.6 }), items.length); const o = new THREE.Object3D(); const c = new THREE.Color();
    items.forEach((it, i) => { o.position.set(...it.p); o.rotation.set(...it.r); o.scale.set(0.06, 0.008, 0.03); o.updateMatrix(); m.setMatrixAt(i, o.matrix); m.setColorAt(i, c.set(it.c)); });
    m.castShadow = true; return m;
  }, [items]);
  return (
    <group position={p}>
      <Tube pts={[[0, 0, 0], [0.04, 0.8, 0.02], [-0.02, 1.5, 0], [0.02, 1.9, 0]]} r={0.06} col="#5a4632" seg={12} />
      <primitive object={mesh} />
      {Array.from({ length: 14 }, (_, i) => { const a = rnd(i, 8) * 6.3, r = 0.6 + rnd(i, 9) * 0.2; return <mesh key={i} position={[Math.cos(a) * r, 1.75 + rnd(i, 10) * 0.5, Math.sin(a) * r]} scale={[0.045, 0.035, 0.035]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f2d23a" roughness={0.45} /></mesh>; })}
    </group>
  );
};

const SkyDome: React.FC<{ tex: THREE.Texture }> = ({ tex }) => <mesh><sphereGeometry args={[150, 48, 24]} /><meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} toneMapped={false} /></mesh>;

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTallerTex();
  const ft = useFoto({ x_tabla: [1, 1], x_pino: [1, 1], x_deck: [1, 1], x_muro: [2.4, 1] });
  const pg = useImgTex(["p001", "p002", "p018", "p019", "p020"]);
  // la piel de madera se barre en "no es madera / es cemento" y vuelve con el café
  const skin = 1 - win(t, EV.wipe, EV.wipe + 0.9) + win(t, EV.veta, EV.veta + 1.4);
  // el deck: dos inviernos
  const rot = t < EV.patio ? 0 : win(t, EV.inviernos, EV.inviernos + 2.4);
  const wetDeck = t > EV.moja && t < EV.moja + 6 ? win(t, EV.moja, EV.moja + 0.8) * (1 - win(t, EV.moja + 4.5, EV.moja + 6)) : 0;
  const kCafe = 1;
  // la Colección: se abre y pasa a la pág. 19 (impresa "17")
  const open = win(t, EV.c1open, EV.c1open + 1.1);
  const flip = cl((t - EV.c1page) / 0.6);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Warm tex={[...Object.values(ft), ...Object.values(pg)]} />
      <Post bloom={0.3} threshold={0.92} exposure={0.95} env={0.35} />
      <color attach="background" args={["#a9cbe8"]} />
      <fogExp2 attach="fog" args={[0xb9c9d6, 0.02]} />
      <hemisphereLight args={[0xd7e6ff, 0x5a4a38, 0.75]} />
      <directionalLight position={[6, 9, 5]} intensity={2.6} color="#ffe2b8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
      {/* luz rasante sobre la tabla: hace que la veta tenga sombra (paisaje) */}
      <spotLight position={[-1.6, 1.0, 0.9]} target-position={[0, PLANK[1], PLANK[2]]} angle={0.5} penumbra={0.8} intensity={6} distance={4} color="#fff0d8" />

      {/* piso, muros */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial map={tx.floor} roughness={0.95} /></mesh>
      <mesh position={[0, 1.1, -3.25]} receiveShadow><boxGeometry args={[11, 2.2, 0.2]} /><meshStandardMaterial map={ft.x_muro} roughness={0.95} /></mesh>
      <mesh position={[-4.6, 1.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><boxGeometry args={[7, 2.2, 0.2]} /><meshStandardMaterial map={ft.x_muro} roughness={0.95} /></mesh>
      <Box p={[0, 2.23, -3.25]} s={[11, 0.06, 0.26]} c="#8c8a84" />

      {/* LA TABLA en los caballetes */}
      <Horse x={-0.4} map={ft.x_pino} /><Horse x={0.4} map={ft.x_pino} />
      <Plank tx={tx} skin={skin} wet={0} foto={ft.x_tabla} />

      {/* el banco de trabajo */}
      <group>
        {[[-1.1, -0.32], [1.1, -0.32], [-1.1, 0.32], [1.1, 0.32]].map(([x, z], i) => <Box key={i} p={[BENCH[0] + x, 0.45, BENCH[2] + z]} s={[0.08, 0.9, 0.08]} c="#8a7660" map={ft.x_pino} />)}
        <Box p={[BENCH[0], 0.91, BENCH[2]]} s={[2.4, 0.05, 0.8]} c="#a08a72" map={ft.x_tabla} rad={0.01} />
        <Box p={[BENCH[0], 0.25, BENCH[2]]} s={[2.25, 0.03, 0.7]} c="#8a7660" map={ft.x_tabla} />
        {/* la radio vieja */}
        <group position={PT.radio}>
          <Box p={[0, 0, 0]} s={[0.32, 0.18, 0.12]} c="#6a2a1e" r={0.5} rad={0.02} />
          <mesh position={[-0.06, 0, 0.061]}><circleGeometry args={[0.055, 24]} /><meshStandardMaterial color="#2a2522" roughness={0.9} /></mesh>
          <Box p={[0.09, 0.03, 0.062]} s={[0.1, 0.04, 0.004]} c="#e8d8a8" e="#ffcc66" ei={0.4} rad={0.002} />
          <Tube pts={[[0.13, 0.09, -0.03], [0.2, 0.3, -0.05], [0.28, 0.48, -0.07]]} r={0.003} col="#c8c8c8" m={0.9} rough={0.3} seg={6} />
        </group>
        {/* el mate frío */}
        <group position={PT.mate}>
          <mesh position={[0, -0.02, 0]} scale={[0.05, 0.06, 0.05]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#6b4a2a" roughness={0.6} /></mesh>
          <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.035, 0.04, 0.02, 20]} /><meshStandardMaterial color="#b9b2a2" metalness={0.8} roughness={0.3} /></mesh>
          <Tube pts={[[0.01, 0.0, 0], [0.02, 0.08, 0], [0.035, 0.13, 0]]} r={0.004} col="#d0d0d0" m={0.9} rough={0.25} seg={6} />
        </group>
        {/* el frasco de café */}
        <group position={PT.cafe} scale={kCafe}>
          <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.15, 28, 1, true]} /><meshPhysicalMaterial color="#e8f0f4" transparent opacity={0.25} roughness={0.05} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.052, 0.052, 0.1, 28]} /><meshStandardMaterial map={tx.granules} roughness={0.9} /></mesh>
          <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.0565, 0.0565, 0.07, 28, 1, true, -0.9, 1.8]} /><meshStandardMaterial map={tx.cafe} roughness={0.6} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.058, 0.058, 0.025, 28]} /><meshStandardMaterial color="#c9a43a" metalness={0.6} roughness={0.35} /></mesh>
        </group>
        {/* llana y peine de vetas */}
        <Box p={[2.75, 0.945, -2.25]} s={[0.24, 0.006, 0.1]} c="#9aa0a6" m={0.85} r={0.3} rad={0.002} />
        <Box p={[0.95, 0.95, -2.62]} s={[0.15, 0.02, 0.1]} c="#c76b2a" r={0.6} rad={0.006} />
        {/* LA COLECCIÓN */}
        <Book p={BOOK} open={open} cover={pg.p001} inside={pg.p002_r} right={flip > 0 ? pg.p019 : pg.p018} spine="#8a2c22"
          flips={[{ k: flip, tex: [pg.p018, pg.p020] }]} />
      </group>

      {/* bolsas de cemento: la pila y la que quedó tirada */}
      <Bag p={[-2.25, 0.08, -2.6]} tex={tx.bag} />
      <Bag p={[-2.2, 0.23, -2.58]} rot={[0, 0.15, 0]} tex={tx.bag} />
      <Bag p={[-2.28, 0.38, -2.62]} rot={[0, -0.1, 0]} tex={tx.bag} />
      <Bag p={PT.bag} rot={[0.05, 0.7, 0.35]} tex={tx.bag} />
      {/* balde con mezcla */}
      <group position={[0.95, 0, -1.35]}>
        <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.16, 0.13, 0.32, 28, 1, true]} /><meshStandardMaterial color="#1e1e1e" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.155, 28]} /><meshStandardMaterial color="#8d8a84" roughness={0.75} /></mesh>
      </group>

      <Deck tx={tx} rot={rot} wet={wetDeck} nueva={ft.x_pino} vieja={ft.x_deck} />
      <Lemon p={[-3.6, 0, -2.6]} />
      <SkyDome tex={tx.sky} />
      {/* el barrio detrás del muro */}
    </ThreeCanvas>
  );
};
