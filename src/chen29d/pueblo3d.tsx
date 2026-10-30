// chencho01 · EL MUNDO: el pueblo de Chencho en Michoacán. Una calle empedrada que sube hacia la plaza y la iglesia blanca de
// cúpula roja; casas de adobe pintadas (terracota, rosa, blanco, ocre) con guardapolvo guinda y portales de teja sobre postes;
// cerros verdes atrás. A la izquierda, la casa de Chencho: el PORTÓN VERDE de mezquite que se abre al patio (limonero,
// gallinero, mesa de madera con los 5 libros de Chayo). En la banqueta, EL CUADERNO DE CUENTAS (objeto héroe: los renglones
// se escriben con la voz). En la plaza, el tianguis del domingo con sus lonas.
// UNA escena y UNA cámara para todo el video; eventos clavados a la voz. Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { delayRender, continueRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { HAND, handReady, P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
type V = [number, number, number];

// ---------------- medidas y puntos del mundo ----------------
const SW = 3.0;          // media calle (empedrado de -3 a 3)
const FX = 4.3;          // fachadas en x = ±4.3; banqueta de 3.0 a 4.3
const BQ = 0.2;          // alto de la banqueta
const PZ = -34;          // borde de la plaza
export const NB: V = [-3.45, BQ + 0.012, 3.3];               // el cuaderno de cuentas, abierto sobre la banqueta
export const PT = {
  porton: [-FX, 1.3, 1.8] as V,       // centro del portón verde
  nb: NB,
  mesa: [-8.2, 0.8, 1.8] as V,         // mesa del patio con los libros
  libro: [-8.12, 0.8, 1.86] as V,     // el Libro 1 que se abre
  limon: [-10.4, 1.4, 4.6] as V,
  gallinas: [-10.6, 0.5, -1.4] as V,
  iglesia: [3.5, 9, -58] as V,
  tianguis: [0, 1.4, -40] as V,
  recibo: [-4.25, 1.75, 3.6] as V,     // donde va el medidor de luz en la fachada
};

// ---------------- CÁMARA (keyframes globales; el minuto 1 y el resto se suman con setKeys) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([0, 1.6, 8]), l: v3([0, 1.4, -20]), fov: 40 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008; // cámara en mano, muy suave
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 600); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.12), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.06) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.02; cm.far = 600; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas procedurales del pueblo ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const usePueblo = () => useMemo(() => {
  // empedrado: piedras de río IRREGULARES (Voronoi con junta F2-F1), colores de cantera y basalto, tierra en las juntas
  const stones = (g: CanvasRenderingContext2D, S: number, bump: boolean) => {
    const N = 24, cell = S / N, P: [number, number, number][] = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const i = r * N + c; P.push([(c + 0.15 + rnd(i, 1) * 0.7) * cell, (r + 0.15 + rnd(i, 2) * 0.7) * cell, i]); }
    const img = g.createImageData(S, S), d = img.data;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
      let f1 = 1e9, f2 = 1e9, id = 0;
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        const gx = (cx + ox + N) % N, gy = (cy + oy + N) % N, q = P[gy * N + gx];
        const px = q[0] + (cx + ox - gx) * cell, py = q[1] + (cy + oy - gy) * cell;
        const dd = Math.hypot(x - px, y - py);
        if (dd < f1) { f2 = f1; f1 = dd; id = q[2]; } else if (dd < f2) f2 = dd;
      }
      const edge = (f2 - f1) / cell;             // 0 en la junta
      const k = Math.min(1, edge / 0.11), dome = Math.sqrt(k), n = (rnd(x * 7 + y * 13, 9) - 0.5);
      const o = (y * S + x) * 4;
      if (bump) { const v = 255 * (0.08 + 0.92 * dome) + n * 30; d[o] = d[o + 1] = d[o + 2] = v; }
      else {
        const t = rnd(id, 5), w = rnd(id, 6);
        let R = t < 0.45 ? 128 + w * 40 : t < 0.8 ? 92 + w * 30 : 150 + w * 45, G = R - 6 - rnd(id, 7) * 10, B = R - 16 - rnd(id, 8) * 14;
        if (t > 0.8) { G -= 12; B -= 26; }                       // cantera rosada
        const sh = 0.55 + 0.45 * dome + n * 0.12, dirt = 1 - k;
        R = R * sh * (1 - dirt) + 70 * dirt; G = G * sh * (1 - dirt) + 58 * dirt; B = B * sh * (1 - dirt) + 44 * dirt;
        d[o] = R; d[o + 1] = G; d[o + 2] = B;
      }
      d[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    if (!bump) for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${rnd(i, 3) > 0.5 ? "60,80,40" : "40,30,20"},${0.08 + 0.1 * rnd(i, 4)})`; g.beginPath(); g.ellipse(rnd(i, 5) * S, rnd(i, 6) * S, 20 + rnd(i, 7) * 60, 10 + rnd(i, 8) * 30, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
  };
  const tejaDraw = (g: CanvasRenderingContext2D) => {
    for (let c = 0; c < 16; c++) {
      const gr = g.createLinearGradient(c * 32, 0, c * 32 + 32, 0);
      const b = 0.85 + rnd(c, 2) * 0.3;
      gr.addColorStop(0, `rgb(${90 * b},${38 * b},${24 * b})`); gr.addColorStop(0.5, `rgb(${178 * b},${82 * b},${52 * b})`); gr.addColorStop(1, `rgb(${96 * b},${40 * b},${26 * b})`);
      g.fillStyle = gr; g.fillRect(c * 32, 0, 32, 512);
      for (let r = 0; r < 8; r++) { g.fillStyle = "rgba(30,10,5,.45)"; g.fillRect(c * 32, r * 64 + ((c % 2) * 32), 32, 4); }
    }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${rnd(i, 3) > 0.5 ? "60,70,40" : "30,20,15"},${0.12 * rnd(i, 4)})`; g.fillRect(rnd(i, 5) * 512, rnd(i, 6) * 512, 6, 6); }
  };
  return {
    piedra: mk(1024, 1024, (g) => stones(g, 1024, false), [3.4, 34]),
    piedraB: mk(1024, 1024, (g) => stones(g, 1024, true), [3.4, 34]),
    banqueta: mk(256, 256, (g) => {
      g.fillStyle = "#a59a8a"; g.fillRect(0, 0, 256, 256);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { const v = 150 + rnd(r * 2 + c, 1) * 30; g.fillStyle = `rgb(${v},${v - 8},${v - 18})`; g.fillRect(c * 128 + 3, r * 64 + 3, 122, 58); }
      for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(60,50,40,${0.15 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
    }, [1, 12]),
    // aplanado de cal sobre adobe: manchas, salitre abajo, desconchones
    muro: mk(512, 512, (g) => {
      g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 70; i++) { const gr = g.createRadialGradient(rnd(i, 1) * 512, rnd(i, 2) * 512, 0, rnd(i, 1) * 512, rnd(i, 2) * 512, 30 + rnd(i, 3) * 80); gr.addColorStop(0, `rgba(120,100,80,${0.05 + 0.08 * rnd(i, 4)})`); gr.addColorStop(1, "rgba(120,100,80,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
      for (let i = 0; i < 12; i++) { g.fillStyle = "rgba(150,110,75,.55)"; g.beginPath(); g.ellipse(rnd(i, 7) * 512, 300 + rnd(i, 8) * 200, 10 + rnd(i, 9) * 30, 6 + rnd(i, 10) * 14, 0, 0, 6.3); g.fill(); }
      for (let i = 0; i < 1200; i++) { g.fillStyle = `rgba(80,70,60,${0.08 * rnd(i, 11)})`; g.fillRect(rnd(i, 12) * 512, rnd(i, 13) * 512, 2, 2); }
    }, [2, 1]),
    teja: mk(512, 512, tejaDraw, [4, 1]),
    madera: mk(256, 256, (g) => {
      g.fillStyle = "#6b4a2e"; g.fillRect(0, 0, 256, 256);
      for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(30,18,8,${0.15 + rnd(k, 1) * 0.25})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const x = k * 6.4; g.moveTo(x, 0); g.bezierCurveTo(x + 4, 80, x - 4, 170, x + 2, 256); g.stroke(); }
    }),
    // portón verde de mezquite: tablas verticales, pintura gastada que deja ver la madera
    porton: mk(512, 512, (g) => {
      g.fillStyle = "#5a3d24"; g.fillRect(0, 0, 512, 512);
      for (let c = 0; c < 8; c++) {
        const v = rnd(c, 1) * 14; g.fillStyle = `rgb(${38 + v},${104 + v},${70 + v})`; g.fillRect(c * 64 + 2, 0, 60, 512);
        g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(c * 64, 0, 3, 512);
        for (let k = 0; k < 9; k++) { g.fillStyle = `rgba(110,78,48,${0.6 + 0.3 * rnd(c * 9 + k, 3)})`; g.beginPath(); g.ellipse(c * 64 + 10 + rnd(c * 9 + k, 4) * 44, rnd(c * 9 + k, 5) * 512, 3 + rnd(c * 9 + k, 6) * 9, 6 + rnd(c * 9 + k, 7) * 30, 0, 0, 6.3); g.fill(); }
      }
      g.fillStyle = "rgba(20,40,28,.55)"; g.fillRect(0, 150, 512, 12); g.fillRect(0, 360, 512, 12);
    }),
    tierra: mk(512, 512, (g) => {
      g.fillStyle = "#9c7a55"; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2600; i++) { const v = rnd(i, 1); g.fillStyle = v > 0.6 ? `rgba(70,50,30,${0.25 * rnd(i, 2)})` : `rgba(200,170,130,${0.2 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 1 + rnd(i, 5) * 4, 1 + rnd(i, 5) * 4); }
    }, [4, 4]),
    pasto: mk(256, 256, (g) => {
      g.fillStyle = "#5f7d3a"; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2000; i++) { g.fillStyle = `rgba(${rnd(i, 1) > 0.5 ? "120,150,70" : "40,60,25"},${0.35 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 3); }
    }, [30, 30]),
    cielo: (() => { const t = mk(1024, 512, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#4f86c6"); gr.addColorStop(0.3, "#7eaad8"); gr.addColorStop(0.47, "#b4cfe6"); gr.addColorStop(0.5, "#d6e2ea"); gr.addColorStop(1, "#dfe6e8");
      g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 46; i++) { const cx = rnd(i, 1) * 1024, cy = 90 + rnd(i, 2) * 150, w = 60 + rnd(i, 3) * 160;
        for (let k = 0; k < 7; k++) { const x = cx + (rnd(i * 7 + k, 4) - 0.5) * w * 1.6, y = cy + (rnd(i * 7 + k, 5) - 0.5) * w * 0.25, r = w * (0.3 + rnd(i * 7 + k, 6) * 0.4);
          const c = g.createRadialGradient(x, y - r * 0.2, 0, x, y, r); c.addColorStop(0, "rgba(255,255,255,.85)"); c.addColorStop(0.6, "rgba(248,250,252,.45)"); c.addColorStop(1, "rgba(240,244,248,0)"); g.fillStyle = c; g.fillRect(x - r, y - r, 2 * r, 2 * r); } }
    }); t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; return t; })(),
    picado: mk(128, 160, (g) => {
      g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 160);
      g.globalCompositeOperation = "destination-out";
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { g.beginPath(); const x = 24 + c * 40, y = 30 + r * 32; if ((r + c) % 2) g.arc(x, y, 9, 0, 6.3); else { g.moveTo(x, y - 11); g.lineTo(x + 10, y); g.lineTo(x, y + 11); g.lineTo(x - 10, y); } g.fill(); }
      for (let c = 0; c < 8; c++) { g.beginPath(); g.moveTo(c * 16, 160); g.lineTo(c * 16 + 8, 146); g.lineTo(c * 16 + 16, 160); g.fill(); }
      g.globalCompositeOperation = "source-over";
    }),
    hoja: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  };
}, []);

// texturas de imagen (tapas y páginas REALES de la guía) con delayRender
const useImgs = (names: string[]) => {
  const [h] = useState(() => delayRender("tex guia"));
  const tex = useMemo(() => {
    const L = new THREE.TextureLoader(); let n = 0;
    return names.map((nm) => L.load(staticFile(P + nm), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; n++; if (n === names.length) continueRender(h); }, undefined, () => { n++; if (n === names.length) continueRender(h); }));
  }, []);
  return tex;
};

// ---------------- cuaderno: páginas escritas a mano, renglón por renglón ----------------
export type Row = { l: string; v?: string; col?: string };
const pageTex = (title: string, rows: Row[], n: number, fontOk: boolean, extra?: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = 768; cv.height = 1024; const g = cv.getContext("2d")!;
  g.fillStyle = "#f3ecd9"; g.fillRect(0, 0, 768, 1024);
  for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(150,120,80,${0.06 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 768, rnd(i, 3) * 1024, 4 + rnd(i, 4) * 20, 0, 6.3); g.fill(); }
  g.strokeStyle = "rgba(70,110,170,.35)"; g.lineWidth = 2; for (let y = 150; y < 1000; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(768, y); g.stroke(); }
  g.strokeStyle = "rgba(200,60,60,.45)"; g.beginPath(); g.moveTo(84, 0); g.lineTo(84, 1024); g.stroke(); g.beginPath(); g.moveTo(560, 0); g.lineTo(560, 1024); g.stroke();
  const F = fontOk ? HAND : "cursive";
  g.fillStyle = "#1f2a44"; g.font = `700 58px ${F}`; g.fillText(title, 100, 110);
  rows.forEach((r, i) => {
    const k = Math.max(0, Math.min(1, n - i)); if (k <= 0) return;
    const y = 140 + 64 * (i + 1) - 12;
    g.save(); g.beginPath(); g.rect(0, y - 60, 100 + 660 * k, 72); g.clip();
    g.fillStyle = r.col ?? "#22314f"; g.font = `500 48px ${F}`; g.fillText(r.l, 100, y);
    if (r.v) { g.font = `700 50px ${F}`; g.textAlign = "right"; g.fillText(r.v, 735, y); g.textAlign = "left"; }
    g.restore();
  });
  extra?.(g);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
export const CUENTA: Row[] = [
  { l: "Tianguis", v: "$1,200" }, { l: "Tortillas", v: "$330" }, { l: "La tiendita", v: "$400" }, { l: "Gas", v: "$230" },
  { l: "Luz", v: "$73" }, { l: "Agua (comité)", v: "$70" }, { l: "Combi", v: "$100" }, { l: "Teléfono", v: "$100" },
  { l: "Salud", v: "$60" }, { l: "Predial", v: "$27" }, { l: "Carnitas dom.", v: "$360" },
];
const Cuaderno: React.FC<{ p: V; rotY: number; open: number; rows: number; total: number; hideTotal: number; fontOk: boolean; title: string; list: Row[] }> = ({ p, rotY, open, rows, total, hideTotal, fontOk, title, list }) => {
  const BW = 0.15, BD = 0.21, TH = 0.012;
  const nq = Math.round(rows * 12) / 12, tq = Math.round(total * 10) / 10, hq = Math.round(hideTotal * 10) / 10;
  const right = useMemo(() => pageTex(title, list, nq, fontOk, (g) => {
    if (tq <= 0) return;
    const y = 140 + 64 * (list.length + 1) + 20;
    g.strokeStyle = "#22314f"; g.lineWidth = 4; g.beginPath(); g.moveTo(420, y - 50); g.lineTo(420 + 320 * Math.min(1, tq * 2), y - 50); g.stroke();
    g.fillStyle = "#b3261e"; g.font = `700 64px ${fontOk ? HAND : "cursive"}`; g.fillText("Total", 100, y + 10);
    if (hq > 0.5) { g.fillStyle = "#b3261e"; g.textAlign = "right"; g.fillText("¿ ?", 735, y + 10); g.textAlign = "left"; }
    else { g.textAlign = "right"; g.fillText("$2,950", 735, y + 10); g.textAlign = "left"; g.strokeStyle = "#b3261e"; g.lineWidth = 5; g.beginPath(); g.ellipse(620, y - 8, 150, 52, -0.05, 0, 6.3 * Math.min(1, tq)); g.stroke(); }
  }), [nq, tq, hq, fontOk, title]);
  const left = useMemo(() => pageTex("", [], 0, fontOk, (g) => {
    g.fillStyle = "#22314f"; g.font = `500 44px ${fontOk ? HAND : "cursive"}`;
    ["Septiembre", "", "pensión ✓", "huevos: 4-5 diarios", "frijol nuevo 3 kg", "regar el limonero", "", "Chayo dom. 2 pm"].forEach((s, i) => g.fillText(s, 110, 210 + i * 64));
  }), [fontOk]);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <mesh position={[0, TH / 2, 0]} castShadow receiveShadow geometry={rbox(BW * 2 + 0.01, TH, BD + 0.008, 0.003)}><meshStandardMaterial color="#e9dfc6" roughness={1} /></mesh>
      {/* tapa de atrás (cartón café) asomando */}
      <mesh position={[0, 0.0015, 0]} geometry={rbox(BW * 2 + 0.02, 0.003, BD + 0.016, 0.001)}><meshStandardMaterial color="#6b4a2e" roughness={0.9} /></mesh>
      <mesh position={[BW / 2 + 0.002, TH + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={right} roughness={0.95} color="#cfc8b6" /></mesh>
      {/* hoja izquierda con bisagra: open=0 cerrado (tapa café arriba), 1 = abierto plano */}
      <group position={[0, TH, 0]} rotation={[0, 0, Math.PI * (1 - open)]}>
        <mesh position={[-BW / 2 - 0.002, 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={left} roughness={0.95} side={THREE.DoubleSide} color="#cfc8b6" /></mesh>
        <mesh position={[-BW / 2 - 0.002, -0.0005, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW + 0.006, BD + 0.008]} /><meshStandardMaterial color="#7a5434" roughness={0.9} /></mesh>
      </group>
      {/* lápiz */}
      <mesh position={[0.17, 0.006, 0.03]} rotation={[Math.PI / 2, 0, 0.5]} castShadow><cylinderGeometry args={[0.0045, 0.0045, 0.12, 6]} /><meshStandardMaterial color="#e2b23a" roughness={0.6} /></mesh>
    </group>
  );
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number; bump?: Tx }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0, bump }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} bumpMap={bump} bumpScale={0.6} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; s?: number; m?: number }> = ({ prof, p, c, r = 0.75, s = 1, m = 0 }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 32), [JSON.stringify(prof)]);
  return <mesh position={p} scale={s} geometry={geo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} side={THREE.DoubleSide} /></mesh>;
};
const MACETA: [number, number][] = [[0, 0], [0.12, 0], [0.16, 0.22], [0.18, 0.24], [0.175, 0.26]];

// casa de pueblo: fachada (con hueco de puerta y ventanas), guardapolvo, portal de teja sobre postes hacia la banqueta
type Casa = { z0: number; z1: number; side: 1 | -1; col: string; band?: string; h?: number; portal?: boolean; door?: number; deep?: number };
const PALETA = ["#c8735a", "#e6d9c6", "#d89a8c", "#d6a95c", "#e9e2d4", "#b9604a", "#9fbfae", "#e3c9a3"];
const CasaP: React.FC<{ c: Casa; tx: ReturnType<typeof usePueblo> }> = ({ c, tx }) => {
  const h = c.h ?? 3.4, x = c.side * FX, len = c.z1 - c.z0, zc = (c.z0 + c.z1) / 2, deep = c.deep ?? 6, band = c.band ?? "#8a2a22";
  const fx = x + c.side * 0.15; // centro del muro (grosor 0,3)
  const wins = Math.max(1, Math.floor(len / 3)), npost = Math.max(2, Math.round(len / 2.6) + 1);
  return (
    <group>
      {/* cuerpo de la casa (bloque) */}
      <Box p={[x + c.side * (deep / 2), h / 2, zc]} s={[deep, h, len - 0.04]} c={c.col} map={tx.muro} r={1} rad={0.03} />
      {/* guardapolvo guinda */}
      <Box p={[x - c.side * 0.005, 0.5, zc]} s={[0.04, 1.0, len - 0.06]} c={band} map={tx.muro} r={0.95} rad={0.01} cast={false} />
      {/* cornisa */}
      <Box p={[x - c.side * 0.05, h - 0.08, zc]} s={[0.16, 0.12, len]} c="#d8cdbb" r={1} rad={0.02} />
      {/* puertas y ventanas: madera oscura, marco de cantera */}
      {Array.from({ length: wins }, (_, i) => {
        const z = c.z0 + (i + 0.5) * (len / wins), isDoor = i === (c.door ?? 0);
        return (
          <group key={i}>
            <Box p={[x - c.side * 0.03, isDoor ? 1.15 : 1.75, z]} s={[0.06, isDoor ? 2.3 : 1.2, isDoor ? 1.2 : 0.9]} c="#d9c9a8" r={1} rad={0.01} />
            <Box p={[x - c.side * 0.06, isDoor ? 1.1 : 1.75, z]} s={[0.05, isDoor ? 2.1 : 1.0, isDoor ? 1.0 : 0.72]} c={isDoor ? "#5a3a22" : "#2a2420"} map={isDoor ? tx.madera : undefined} r={0.85} rad={0.01} />
            {!isDoor && Array.from({ length: 5 }, (_, k) => <mesh key={k} position={[x - c.side * 0.1, 1.75, z - 0.3 + k * 0.15]}><cylinderGeometry args={[0.012, 0.012, 1.0, 6]} /><meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} /></mesh>)}
          </group>
        );
      })}
      {/* portal: techo de teja inclinado sobre la banqueta + vigas + postes de madera */}
      {c.portal !== false && <>
        <mesh position={[c.side * (FX - 0.65), h - 0.42, zc]} rotation={[0, 0, c.side * 0.2]} castShadow receiveShadow geometry={rbox(1.55, 0.09, len + 0.02, 0.02)}><meshStandardMaterial map={tx.teja} color="#e8b090" roughness={0.85} /></mesh>
        <Box p={[c.side * (SW + 0.15), h - 0.62, zc]} s={[0.14, 0.14, len]} c="#4f3520" map={tx.madera} r={0.95} />
        {Array.from({ length: npost }, (_, i) => <Box key={i} p={[c.side * (SW + 0.15), (h - 0.62) / 2, c.z0 + 0.15 + i * ((len - 0.3) / (npost - 1))]} s={[0.13, h - 0.62, 0.13]} c="#5a3d26" map={tx.madera} r={0.95} />)}
      </>}
      {/* techo de teja de la casa (a dos aguas, sólo se ve el alero) */}
      <mesh position={[x + c.side * (deep / 2), h + 0.35, zc]} rotation={[0, 0, -c.side * 0.16]} castShadow geometry={rbox(deep + 0.5, 0.1, len + 0.06, 0.02)}><meshStandardMaterial map={tx.teja} color="#e2a487" roughness={0.85} /></mesh>
    </group>
  );
};

const Cerro: React.FC<{ p: V; s: V; c: string }> = ({ p, s, c }) => <mesh position={p} scale={s}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={c} roughness={1} /></mesh>;
const Arbol: React.FC<{ p: V; s?: number; pino?: boolean; c?: string }> = ({ p, s = 1, pino, c = "#4d6b30" }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.9, 0]} castShadow><cylinderGeometry args={[0.1, 0.16, 1.8, 7]} /><meshStandardMaterial color="#4a3422" roughness={1} /></mesh>
    {pino ? [0, 1, 2].map((k) => <mesh key={k} position={[0, 2 + k * 0.9, 0]} castShadow><coneGeometry args={[1.3 - k * 0.35, 1.8, 9]} /><meshStandardMaterial color="#2f4a2a" roughness={1} /></mesh>)
      : [[0, 2.6, 0, 1.4], [0.8, 2.3, 0.3, 1.0], [-0.7, 2.4, -0.2, 1.05], [0.1, 3.2, 0.2, 0.9]].map(([x, y, z, r], k) => <mesh key={k} position={[x, y, z]} castShadow><icosahedronGeometry args={[r, 1]} /><meshStandardMaterial color={new THREE.Color(c).offsetHSL(0, 0, (k % 2) * 0.04).getStyle()} roughness={1} flatShading /></mesh>)}
  </group>
);

// iglesia blanca con torre de campanario y cúpula roja (como la del fondo de la calle)
const Iglesia: React.FC<{ tx: ReturnType<typeof usePueblo>; bell?: number }> = ({ tx, bell = 0 }) => (
  <group position={[0, 0, -60]}>
    <Box p={[0, 4.5, 0]} s={[11, 9, 4]} c="#efe9df" map={tx.muro} r={1} rad={0.05} />
    <Box p={[0, 3.5, 6]} s={[8, 7, 10]} c="#ece5da" map={tx.muro} r={1} rad={0.05} />
    {/* portada: arco de cantera + puerta */}
    <Box p={[0, 2.4, 2.05]} s={[2.6, 4.8, 0.2]} c="#c9b28e" r={1} rad={0.05} />
    <Box p={[0, 1.9, 2.12]} s={[1.8, 3.6, 0.1]} c="#4b3020" map={tx.madera} r={0.9} />
    <mesh position={[0, 7.7, 2.05]}><circleGeometry args={[0.7, 24]} /><meshStandardMaterial color="#3a2a20" /></mesh>
    {/* frontón ondulado */}
    <Box p={[0, 9.6, 0]} s={[6, 1.4, 3.6]} c="#efe9df" map={tx.muro} r={1} rad={0.5} />
    {/* torre (derecha) */}
    <group position={[4.2, 0, 0.5]}>
      <Box p={[0, 6, 0]} s={[3.2, 12, 3.2]} c="#f1ebe1" map={tx.muro} r={1} rad={0.05} />
      {/* campanario abierto: 4 pilares + losas, la campana se ve desde afuera */}
      <Box p={[0, 12.15, 0]} s={[2.7, 0.3, 2.7]} c="#e6dccd" r={1} rad={0.04} />
      <Box p={[0, 14.65, 0]} s={[2.8, 0.3, 2.8]} c="#e6dccd" r={1} rad={0.04} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <Box key={i} p={[x * 1.05, 13.4, z * 1.05]} s={[0.5, 2.3, 0.5]} c="#f1ebe1" map={tx.muro} r={1} rad={0.04} />)}
      {/* la campana de bronce: cuelga del yugo y se mece con `bell` (radianes) */}
      <Box p={[0, 13.95, 0]} s={[2.5, 0.16, 0.18]} c="#4a3423" r={0.9} />
      <group position={[0, 13.9, 0]} rotation={[bell, 0, 0]}>
        <mesh position={[0, -0.62, 0]} castShadow><latheGeometry args={[[[0, 0.62], [0.22, 0.6], [0.3, 0.45], [0.34, 0.15], [0.42, -0.08], [0.58, -0.2], [0.6, -0.26], [0, -0.26]].map(([x, y]) => new THREE.Vector2(x, y)), 32]} /><meshStandardMaterial color="#9a7432" metalness={0.85} roughness={0.32} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -1.02, 0]}><sphereGeometry args={[0.1, 12, 10]} /><meshStandardMaterial color="#4a3a22" metalness={0.6} roughness={0.5} /></mesh>
      </group>
      <mesh position={[0, 15.0, 0]} castShadow><sphereGeometry args={[1.25, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b8463a" roughness={0.6} /></mesh>
      <Box p={[0, 16.6, 0]} s={[0.08, 0.9, 0.08]} c="#333" m={0.6} />
      <Box p={[0, 16.75, 0]} s={[0.45, 0.08, 0.08]} c="#333" m={0.6} />
    </group>
  </group>
);

// lona del tianguis (tela tensada con caída) + mesa con montones de verdura
const LONA = ["#e2672e", "#2f7fc1", "#e94a8a", "#f2c230", "#3aa36b", "#d93b3b", "#7b4fc8", "#e2672e"];
const Puesto: React.FC<{ p: V; i: number; rot?: number }> = ({ p, i, rot = 0 }) => {
  const piles = ["#c8321e", "#3c7a2a", "#e9dfc4", "#e8a321", "#7a9a3a", "#5a2a1a"];
  return (
    <group position={p} rotation={[0, rot, 0]}>
      {[[-1.3, -1], [1.3, -1], [-1.3, 1], [1.3, 1]].map(([x, z], k) => <mesh key={k} position={[x, 1.15, z]} castShadow><cylinderGeometry args={[0.03, 0.03, 2.3, 6]} /><meshStandardMaterial color="#888" metalness={0.5} /></mesh>)}
      <mesh position={[0, 2.35, 0]} rotation={[-0.08, 0, 0]} castShadow><boxGeometry args={[2.9, 0.03, 2.3]} /><meshStandardMaterial color={LONA[i % LONA.length]} roughness={0.8} side={THREE.DoubleSide} transparent opacity={0.96} /></mesh>
      <Box p={[0, 0.42, 0.2]} s={[2.4, 0.06, 1.1]} c="#7a5a3a" r={0.9} />
      {[[-1.1, 0.42], [1.1, 0.42]].map(([x], k) => <Box key={k} p={[x, 0.2, 0.2]} s={[0.06, 0.4, 1.0]} c="#5a4028" r={0.9} />)}
      {Array.from({ length: 6 }, (_, k) => (
        <group key={k} position={[-0.95 + k * 0.38, 0.47, 0.2 + (k % 2) * 0.2]}>
          {Array.from({ length: 7 }, (_, j) => <mesh key={j} position={[(rnd(i * 50 + k * 7 + j, 1) - 0.5) * 0.18, 0.04 + (j > 3 ? 0.07 : 0), (rnd(i * 50 + k * 7 + j, 2) - 0.5) * 0.18]} castShadow><sphereGeometry args={[0.055, 10, 8]} /><meshStandardMaterial color={piles[(k + i) % piles.length]} roughness={0.5} /></mesh>)}
        </group>
      ))}
      {/* huacales */}
      <Box p={[0.9, 0.15, 1.0]} s={[0.5, 0.3, 0.38]} c="#b98c58" map={undefined} r={0.95} />
    </group>
  );
};

// libro (tapa con imagen real + página real a la derecha). open 0..1 (la tapa gira sobre el lomo hacia la izquierda)
const Libro: React.FC<{ p: V; rotY: number; cover: THREE.Texture; pageR?: THREE.Texture; pageL?: THREE.Texture; open?: number; lift?: number; th?: number }> = ({ p, rotY, cover, pageR, pageL, open = 0, lift = 0, th = 0.014 }) => {
  const BW = 0.205, BD = 0.265;
  return (
    <group position={[p[0], p[1] + lift, p[2]]} rotation={[0, rotY, 0]}>
      <Box p={[BW / 2, th / 2, 0]} s={[BW, th, BD]} c="#f4ead8" r={1} rad={0.002} />
      <mesh position={[BW / 2, 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW + 0.006, BD + 0.006]} /><meshStandardMaterial color="#7a1f2b" roughness={0.8} /></mesh>
      {pageR && <mesh position={[BW / 2, th + 0.0006, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.98, BD * 0.98]} /><meshStandardMaterial map={pageR} roughness={0.9} /></mesh>}
      <group position={[0, th, 0]} rotation={[0, 0, Math.PI * open]}>
        <mesh position={[BW / 2, 0.0012, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow><planeGeometry args={[BW + 0.006, BD + 0.006]} /><meshStandardMaterial map={cover} roughness={0.55} /></mesh>
        <mesh position={[BW / 2, 0.0004, 0]} rotation={[Math.PI / 2, 0, Math.PI]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={pageL} color={pageL ? "#fff" : "#f4ead8"} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
  );
};

// gallina (cuerpo + cola + cabeza con cresta), picotea con el tiempo
const Gallina: React.FC<{ p: V; t: number; i: number; c?: string }> = ({ p, t, i, c = "#8a4a22" }) => {
  const peck = Math.max(0, Math.sin(t * 2.2 + i * 1.7)) ** 6;
  return (
    <group position={p} rotation={[0, rnd(i, 3) * 6.3, 0]}>
      <mesh position={[0, 0.18, 0]} scale={[1, 0.85, 1.3]} castShadow><sphereGeometry args={[0.13, 14, 10]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>
      <mesh position={[0, 0.27, -0.16]} rotation={[-0.7, 0, 0]} castShadow><coneGeometry args={[0.08, 0.18, 8]} /><meshStandardMaterial color="#3a2a1a" roughness={0.95} /></mesh>
      <group position={[0, 0.3, 0.13]} rotation={[0.9 * peck, 0, 0]}>
        <mesh position={[0, 0.04, 0.05]} castShadow><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>
        <mesh position={[0, 0.11, 0.05]}><boxGeometry args={[0.015, 0.05, 0.06]} /><meshStandardMaterial color="#c8231a" /></mesh>
        <mesh position={[0, 0.03, 0.12]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.015, 0.04, 6]} /><meshStandardMaterial color="#e2a62a" /></mesh>
      </group>
      {[-0.04, 0.04].map((x) => <mesh key={x} position={[x, 0.05, 0]}><cylinderGeometry args={[0.008, 0.008, 0.1, 5]} /><meshStandardMaterial color="#d9a030" /></mesh>)}
    </group>
  );
};

const Limonero: React.FC<{ p: V; t: number; hoja: THREE.Texture }> = ({ p, t, hoja }) => (
  <group position={p}>
    <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.06, 0.09, 1.2, 7]} /><meshStandardMaterial color="#5a4030" roughness={1} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.3, 1.35 + rnd(i, 2) * 0.9, (rnd(i, 3) - 0.5) * 1.3]} rotation={[0, 0, Math.sin(t * 0.8 + i) * 0.03]} castShadow><icosahedronGeometry args={[0.32 + rnd(i, 4) * 0.15, 1]} /><meshStandardMaterial color={["#3f6b2a", "#4b7a30", "#36602a"][i % 3]} roughness={0.85} flatShading /></mesh>)}
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rnd(i, 5) - 0.5) * 1.4, 1.2 + rnd(i, 6) * 1.0, (rnd(i, 7) - 0.5) * 1.4]} castShadow><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color="#a8c63a" roughness={0.5} /></mesh>)}
  </group>
);

export type WorldProps = {
  t: number;
  nbOpen?: number; nbRows?: number; nbTotal?: number; nbHide?: number; nbTitle?: string;
  porton?: number;             // 0 cerrado, 1 abierto
  books?: number;              // 0..1 los libros aparecen sobre la mesa (se abren en abanico)
  bookOpen?: number;           // 0..1 el Libro 1 se abre en la pág. 15
  bookLift?: number;           // el Libro 1 se levanta hacia la cámara
  stones?: number;             // onda de luz que recorre las piedras ("piedra por piedra")
  tianguis?: number;           // 0..1 las lonas del tianguis puestas
  dusk?: number;               // 0..1 atardecer
  bell?: number;               // vaivén de la campana del campanario (radianes)
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, nbOpen = 1, nbRows = 0, nbTotal = 0, nbHide = 1, nbTitle = "Octubre", porton = 0, books = 1, bookOpen = 0, bookLift = 0, stones = 0, tianguis = 1, dusk = 0, bell = 0 } = pr;
  const tx = usePueblo();
  const [fontOk, setFontOk] = useState(false);
  useMemo(() => { const h = delayRender("letra a mano"); handReady().then(() => { setFontOk(true); requestAnimationFrame(() => continueRender(h)); }).catch(() => { setFontOk(true); continueRender(h); }); }, []);
  const sky = new THREE.Color("#c9d4dc").lerp(new THREE.Color("#e8a77a"), dusk);
  const casas = useMemo(() => {
    const L: Casa[] = [];
    // lado izquierdo: la casa de Chencho (con patio, sin bloque macizo) va de z -3.4 a 7.4; el resto hacia la plaza
    let z = 7.4 + 0.02;
    for (let i = 0; i < 3; i++) { const len = 6 + rnd(i, 9) * 3; L.push({ z0: z, z1: z + len, side: -1, col: PALETA[(i * 3 + 1) % PALETA.length], h: 3.2 + rnd(i, 2) * 0.6 }); z += len + 0.02; }
    z = -3.4 - 0.02;
    for (let i = 0; i < 6 && z > PZ + 2; i++) { const len = Math.min(5.5 + rnd(i, 3) * 4, z - PZ); L.push({ z0: z - len, z1: z, side: -1, col: PALETA[(i * 5 + 2) % PALETA.length], h: 3.1 + rnd(i, 4) * 0.7, portal: i % 2 === 0 }); z -= len + 0.02; }
    // lado derecho: de adelante hacia la plaza
    z = 16;
    for (let i = 0; i < 9 && z > PZ + 2; i++) { const len = Math.min(5 + rnd(i, 5) * 4, z - PZ); L.push({ z0: z - len, z1: z, side: 1, col: PALETA[(i * 3 + 4) % PALETA.length], h: 3.2 + rnd(i, 6) * 0.8, portal: i % 3 !== 2, door: i % 2 }); z -= len + 0.02; }
    return L;
  }, []);
  const glowAt = (z: number) => stones > 0 ? Math.max(0, 1 - Math.abs(z - lerp(8, -30, stones)) / 3) : 0;
  const PW = 2.4, PH = 2.6, PZc = 1.8; // hueco del portón
  const leaf = (s: 1 | -1) => (
    <group position={[-FX + 0.02, 0, PZc + s * PW / 2]} rotation={[0, s * -porton * 1.75, 0]}>
      <mesh position={[0.0, PH / 2, -s * PW / 4]} castShadow receiveShadow geometry={rbox(0.08, PH, PW / 2 - 0.02, 0.01)}><meshStandardMaterial map={tx.porton} roughness={0.85} /></mesh>
      {[0.5, 2.1].map((y) => <mesh key={y} position={[0.05, y, -s * PW / 4]}><boxGeometry args={[0.02, 0.06, PW / 2 - 0.1]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.5} /></mesh>)}
      <mesh position={[0.06, 1.3, -s * (PW / 2 - 0.12)]}><torusGeometry args={[0.05, 0.01, 6, 14]} /><meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} /></mesh>
    </group>
  );
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.18 + 0.3 * dusk} threshold={1.1} exposure={1.0} env={0.3} />
      <color attach="background" args={[sky.getHex()]} />
      <mesh rotation={[0, 0.6, 0]}><sphereGeometry args={[480, 48, 24]} /><meshBasicMaterial map={tx.cielo} side={THREE.BackSide} fog={false} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#ffb88a"), dusk)} /></mesh>
      <fog attach="fog" args={[sky.getHex(), 70, 340]} />
      <hemisphereLight args={[new THREE.Color("#dfe8f0").lerp(new THREE.Color("#ffc890"), dusk).getHex(), 0x6a5a40, 0.62]} />
      <directionalLight position={[18, 15, 4]} intensity={2.7 + 0.6 * dusk} color={new THREE.Color("#fff3e2").lerp(new THREE.Color("#ffb070"), dusk).getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-far={90} shadow-bias={-0.0004} shadow-normalBias={0.03} />

      {/* ===== calle empedrada, banquetas, campo ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -9]} receiveShadow><planeGeometry args={[SW * 2, 100]} /><meshStandardMaterial map={tx.piedra} bumpMap={tx.piedraB} bumpScale={2.2} roughness={0.92} color="#e8e2d8" /></mesh>
      {/* onda de luz "piedra por piedra" */}
      {stones > 0 && stones < 1 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, lerp(8, -30, stones)]}><planeGeometry args={[SW * 2, 3]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.28 * Math.sin(Math.PI * stones)} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>}
      {[-1, 1].map((s) => <Box key={s} p={[s * (SW + (FX - SW) / 2), BQ / 2, -9]} s={[FX - SW, BQ, 100]} c="#bdb3a3" map={tx.banqueta} r={0.95} rad={0.03} />)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -40]} receiveShadow><planeGeometry args={[400, 400]} /><meshStandardMaterial map={tx.pasto} roughness={1} /></mesh>
      {/* plaza (piso de cantera) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -48]} receiveShadow><planeGeometry args={[34, 28]} /><meshStandardMaterial map={tx.banqueta} color="#d6cdbd" roughness={0.95} /></mesh>

      {/* ===== casas ===== */}
      {casas.map((c, i) => <CasaP key={i} c={c} tx={tx} />)}

      {/* ===== LA CASA DE CHENCHO (izquierda, z -3.4 .. 7.4): fachada blanca-terracota con portón verde y patio adentro ===== */}
      {(() => {
        const z0 = -3.4, z1 = 7.4, h = 3.3, x = -FX, col = "#d98a6c";
        const segs: [number, number][] = [[z0, PZc - PW / 2 - 0.25], [PZc + PW / 2 + 0.25, z1]];
        return (
          <group>
            {segs.map(([a, b], i) => <Box key={i} p={[x - 0.15, h / 2, (a + b) / 2]} s={[0.3, h, b - a]} c={col} map={tx.muro} r={1} rad={0.02} />)}
            {/* dintel sobre el portón + jambas de cantera */}
            <Box p={[x - 0.15, PH + (h - PH) / 2 + 0.05, PZc]} s={[0.3, h - PH - 0.1, PW + 0.5]} c={col} map={tx.muro} r={1} rad={0.02} />
            {[-1, 1].map((s) => <Box key={s} p={[x + 0.02, PH / 2, PZc + s * (PW / 2 + 0.12)]} s={[0.1, PH, 0.24]} c="#cbb592" r={1} rad={0.02} />)}
            <Box p={[x + 0.02, PH + 0.1, PZc]} s={[0.12, 0.22, PW + 0.5]} c="#cbb592" r={1} rad={0.02} />
            <Box p={[x + 0.01, 0.5, (z0 + PZc - PW / 2 - 0.25) / 2]} s={[0.04, 1.0, PZc - PW / 2 - 0.25 - z0]} c="#7a2620" map={tx.muro} r={0.95} rad={0.01} cast={false} />
            <Box p={[x + 0.01, 0.5, (z1 + PZc + PW / 2 + 0.25) / 2]} s={[0.04, 1.0, z1 - PZc - PW / 2 - 0.25]} c="#7a2620" map={tx.muro} r={0.95} rad={0.01} cast={false} />
            <Box p={[x + 0.05, h - 0.08, (z0 + z1) / 2]} s={[0.16, 0.12, z1 - z0]} c="#d8cdbb" r={1} rad={0.02} />
            {leaf(1)}{leaf(-1)}
            {/* escalón de piedra frente al portón */}
            <Box p={[-FX + 0.35, BQ + 0.06, PZc]} s={[0.5, 0.12, PW + 0.2]} c="#a89c88" map={tx.banqueta} r={1} rad={0.03} />
            {/* ventana enrejada + maceta */}
            <Box p={[x + 0.03, 1.75, 5.4]} s={[0.06, 1.2, 0.9]} c="#d9c9a8" r={1} rad={0.01} />
            <Box p={[x + 0.0, 1.75, 5.4]} s={[0.05, 1.0, 0.72]} c="#2a2420" r={0.85} rad={0.01} />
            <Lathe prof={MACETA} p={[-FX + 0.25, BQ, 6.5]} c="#b65a32" r={0.9} s={1.6} />
            <mesh position={[-FX + 0.25, BQ + 0.62, 6.5]} castShadow><icosahedronGeometry args={[0.32, 1]} /><meshStandardMaterial color="#c2304a" roughness={0.9} flatShading /></mesh>
            {/* portal de teja de la casa de Chencho */}
            <mesh position={[-(FX - 0.65), h - 0.42, (z0 + z1) / 2]} rotation={[0, 0, -0.2]} castShadow receiveShadow geometry={rbox(1.55, 0.09, z1 - z0 + 0.02, 0.02)}><meshStandardMaterial map={tx.teja} color="#e8b090" roughness={0.85} /></mesh>
            <Box p={[-(SW + 0.15), h - 0.62, (z0 + z1) / 2]} s={[0.14, 0.14, z1 - z0]} c="#4f3520" map={tx.madera} r={0.95} />
            {[z0 + 0.15, -0.9, 4.5, z1 - 0.15].map((z) => <Box key={z} p={[-(SW + 0.15), (h - 0.62) / 2 + BQ / 2, z]} s={[0.13, h - 0.62, 0.13]} c="#5a3d26" map={tx.madera} r={0.95} />)}
            {/* medidor de luz en la fachada */}
            <Box p={[x + 0.06, 1.75, 3.6]} s={[0.08, 0.32, 0.22]} c="#9aa0a6" m={0.4} r={0.5} />
            <mesh position={[x + 0.11, 1.78, 3.6]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.07, 20]} /><meshStandardMaterial color="#dfe6e8" roughness={0.2} metalness={0.2} /></mesh>

            {/* ===== PATIO (detrás del portón) ===== */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.3, 0.01, 2]} receiveShadow><planeGeometry args={[7.6, 10.6]} /><meshStandardMaterial map={tx.tierra} roughness={1} /></mesh>
            <Box p={[-12.15, h / 2, 2]} s={[0.3, h, 10.8]} c="#e8d8c0" map={tx.muro} r={1} />
            <Box p={[-8.3, h / 2, -3.25]} s={[7.9, h, 0.3]} c="#e8d8c0" map={tx.muro} r={1} />
            <Box p={[-8.3, h / 2, 7.25]} s={[7.9, h, 0.3]} c="#e8d8c0" map={tx.muro} r={1} />
            {/* corredor con techo de teja al fondo */}
            <mesh position={[-11.1, 2.75, 2]} rotation={[0, 0, 0.18]} castShadow receiveShadow geometry={rbox(2.3, 0.09, 10.4, 0.02)}><meshStandardMaterial map={tx.teja} color="#e8b090" roughness={0.85} /></mesh>
            {[-2.4, 0.4, 3.2, 6].map((z) => <Box key={z} p={[-10.0, 1.3, z]} s={[0.13, 2.6, 0.13]} c="#5a3d26" map={tx.madera} r={0.95} />)}
            {/* mesa de madera con los 5 libros de Chayo */}
            <group position={[-8.2, 0, 1.8]}>
              <Box p={[0, 0.76, 0]} s={[1.3, 0.06, 0.85]} c="#7a5434" map={tx.madera} r={0.85} rad={0.01} />
              {[[-0.58, -0.36], [0.58, -0.36], [-0.58, 0.36], [0.58, 0.36]].map(([x, z], k) => <Box key={k} p={[x, 0.37, z]} s={[0.07, 0.74, 0.07]} c="#5a3d26" map={tx.madera} r={0.9} />)}
              {/* jarro de café y canasta de pan */}
              <Lathe prof={[[0, 0], [0.04, 0], [0.05, 0.03], [0.052, 0.09], [0.048, 0.1]]} p={[0.48, 0.79, -0.24]} c="#a3502a" r={0.8} />
              <Lathe prof={[[0, 0], [0.12, 0], [0.16, 0.07], [0.165, 0.08]]} p={[-0.45, 0.79, -0.22]} c="#b48a52" r={1} />
            </group>
            {/* sillas */}
            {[[-8.9, 1.3], [-7.4, 2.5]].map(([x, z], k) => <group key={k} position={[x, 0, z]}><Box p={[0, 0.45, 0]} s={[0.42, 0.04, 0.42]} c="#8a6a3a" r={0.9} /><Box p={[0, 0.9, -0.2]} s={[0.42, 0.5, 0.04]} c="#8a6a3a" r={0.9} />{[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([a, b], j) => <Box key={j} p={[a, 0.22, b]} s={[0.04, 0.45, 0.04]} c="#6a4a2a" r={0.9} />)}</group>)}
            <Limonero p={PT.limon} t={t} hoja={tx.hoja} />
            {/* gallinero de madera y alambre + gallinas */}
            <group position={[-10.9, 0, -1.6]}>
              <Box p={[0, 0.65, -0.9]} s={[2.0, 1.3, 0.06]} c="#6a4a2e" map={tx.madera} r={0.95} />
              <mesh position={[0, 1.4, -0.4]} rotation={[0.25, 0, 0]} castShadow><boxGeometry args={[2.2, 0.05, 1.3]} /><meshStandardMaterial map={tx.teja} color="#c99a7a" roughness={0.9} /></mesh>
              {[[-1, -0.9], [1, -0.9], [-1, 0.1], [1, 0.1]].map(([x, z], k) => <Box key={k} p={[x, 0.7, z]} s={[0.07, 1.4, 0.07]} c="#5a3d26" r={0.95} />)}
            </group>
            {[[-10.2, -0.8], [-9.6, -1.6], [-10.6, 0.2], [-9.2, -0.2], [-10.9, -1.2], [-9.9, 0.6]].map(([x, z], i) => <Gallina key={i} p={[x, 0, z]} t={t} i={i} c={["#8a4a22", "#efe6d6", "#3a2a22", "#a65a2a"][i % 4]} />)}
            {/* macetas del corredor */}
            {[-2.2, -1.3, 4.0, 5.2, 6.4].map((z, i) => <group key={z}><Lathe prof={MACETA} p={[-11.6, 0, z]} c="#b65a32" r={0.9} s={1.3} /><mesh position={[-11.6, 0.55, z]} castShadow><icosahedronGeometry args={[0.28, 1]} /><meshStandardMaterial color={["#4b7a30", "#c2304a", "#3f6b2a", "#e07a2a", "#4b7a30"][i]} roughness={0.9} flatShading /></mesh></group>)}
          </group>
        );
      })()}

      {/* ===== EL CUADERNO DE CUENTAS ===== */}
      <Cuaderno p={NB} rotY={0.35} open={nbOpen} rows={nbRows} total={nbTotal} hideTotal={nbHide} fontOk={fontOk} title={nbTitle} list={CUENTA} />

      {/* ===== postes de luz y cables ===== */}
      {[-1, 1].flatMap((s) => [12, -2, -16, -30].map((z) => (
        <group key={`${s}${z}`} position={[s * (SW + 0.3), 0, z + (s > 0 ? 4 : 0)]}>
          <mesh position={[0, 3.6, 0]} castShadow><cylinderGeometry args={[0.07, 0.1, 7.2, 8]} /><meshStandardMaterial color="#8d8a84" roughness={0.9} /></mesh>
          <Box p={[0, 6.9, 0]} s={[0.1, 0.1, 1.2]} c="#6b6863" r={0.9} />
        </group>
      )))}
      {[-1, 1].map((s) => [-0.5, 0.5].map((o) => {
        const pts = [12, -2, -16, -30].map((z) => new THREE.Vector3(s * (SW + 0.3), 6.85, z + (s > 0 ? 4 : 0) + o));
        const cur = new THREE.CatmullRomCurve3(pts.flatMap((p, i) => i < pts.length - 1 ? [p, p.clone().lerp(pts[i + 1], 0.5).add(new THREE.Vector3(0, -0.45, 0))] : [p]));
        return <mesh key={`${s}${o}`}><tubeGeometry args={[cur, 80, 0.012, 4, false]} /><meshStandardMaterial color="#222" roughness={0.8} /></mesh>;
      }))}

      {/* ===== papel picado cruzando la calle ===== */}
      {[4, -6, -16, -26].map((z, j) => Array.from({ length: 15 }, (_, i) => {
        const x = -SW - 0.3 + (i + 0.5) * ((2 * SW + 0.6) / 15), sag = 0.55 * (1 - Math.pow((x / (SW + 0.3)), 2));
        const cols = ["#e8336d", "#f2a900", "#2bb3a3", "#7a3fd1", "#ff6a2a", "#3a8be0"];
        return <mesh key={`pp${j}_${i}`} position={[x, 5.25 - sag - 0.2, z + 0.02]} rotation={[Math.sin(t * 2.1 + i * 0.7 + j) * 0.18, 0, 0]}><planeGeometry args={[0.34, 0.42]} /><meshStandardMaterial map={tx.picado} alphaTest={0.5} transparent={false} side={THREE.DoubleSide} color={cols[(i + j) % cols.length]} roughness={0.8} emissive={cols[(i + j) % cols.length]} emissiveIntensity={0.12} /></mesh>;
      }))}
      {[4, -6, -16, -26].map((z) => { const cur = new THREE.CatmullRomCurve3([new THREE.Vector3(-SW - 0.3, 5.3, z), new THREE.Vector3(0, 4.75, z), new THREE.Vector3(SW + 0.3, 5.3, z)]); return <mesh key={`hp${z}`}><tubeGeometry args={[cur, 30, 0.008, 4, false]} /><meshStandardMaterial color="#ddd" /></mesh>; })}
      {/* ===== bugambilias sobre los portales ===== */}
      {[[1, 13.5], [1, 2.2], [-1, -8.5], [1, -12], [-1, 11], [1, -22], [-1, -20]].map(([sd, z], j) => (
        <group key={`bg${j}`} position={[sd * (FX - 0.25), 3.0, z]}>
          {Array.from({ length: 140 }, (_, i) => { const q = i + j * 200, hang = rnd(q, 4) > 0.75 ? rnd(q, 8) * 1.3 : 0; return <mesh key={i} position={[-sd * rnd(q, 1) * 0.45, (rnd(q, 2) - 0.5) * 0.9 - hang, (rnd(q, 3) - 0.5) * (2.6 - hang)]}><sphereGeometry args={[0.045 + rnd(q, 5) * 0.05, 6, 5]} /><meshStandardMaterial color={rnd(q, 6) > 0.28 ? (rnd(q, 7) > 0.5 ? "#d42a86" : "#b81f72") : "#3f6b2a"} roughness={0.8} /></mesh>; })}
        </group>
      ))}

      {/* ===== plaza: tianguis, árboles, quiosco ===== */}
      {tianguis > 0.01 && [[-8, -40], [-4.5, -40.5], [-1, -40], [4, -40.5], [7.5, -40], [-6, -45], [-2.5, -45.5], [2.5, -45], [6, -45.5]].map(([x, z], i) => (
        <group key={i} scale={[1, Math.min(1, tianguis * 1.2), 1]}><Puesto p={[x, 0, z]} i={i} rot={(rnd(i, 4) - 0.5) * 0.2} /></group>
      ))}
      {[[-13, -37], [13, -37], [-14, -52], [14, -52], [-9, -55]].map(([x, z], i) => <Arbol key={i} p={[x, 0, z]} s={1.4} c="#4a6a2c" />)}
      <Iglesia tx={tx} bell={bell} />

      {/* ===== cerros y pinos al fondo ===== */}
      <Cerro p={[-40, -8, -140]} s={[70, 32, 30]} c="#5b7a45" />
      <Cerro p={[45, -10, -150]} s={[80, 36, 30]} c="#52703f" />
      <Cerro p={[0, -14, -190]} s={[120, 42, 30]} c="#6c8a5a" />
      <Cerro p={[-70, -6, -60]} s={[40, 18, 50]} c="#5f7d47" />
      <Cerro p={[70, -6, -70]} s={[40, 20, 50]} c="#587843" />
      {Array.from({ length: 26 }, (_, i) => <Arbol key={i} p={[(rnd(i, 1) - 0.5) * 120, 0, -70 - rnd(i, 2) * 40]} s={1.3 + rnd(i, 3)} pino />)}
      {Array.from({ length: 10 }, (_, i) => <Arbol key={`b${i}`} p={[(i % 2 ? 1 : -1) * (14 + rnd(i, 4) * 10), 0, 20 - i * 6]} s={1.2 + rnd(i, 5) * 0.6} c="#4d6b30" />)}
    </ThreeCanvas>
  );
};
