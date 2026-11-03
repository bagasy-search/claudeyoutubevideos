// ola2 · KIT FOTO. Los objetos son FOTOS REALES (Nano Banana, vista cenital, recortadas con rembg → public/<slug>/objs/*.png)
// apoyadas en el 3D: el fondo es otra foto a sangre (mesa, estuche, tatami…), la luz clave viene de la izquierda como en las
// fotos, la sombra es REAL (sale del alfa del recorte) y cae sobre un atrapa-sombras encima del fondo. La tinta (tiza, labial,
// pluma, pincel) se dibuja con trazo progresivo en un lienzo transparente apoyado sobre la superficie.
import React from "react";
import * as THREE from "three";
import { HAND, Ready, canv, cl, rn, useImg, type V3 } from "./k3d";

export const SLUG = "mk01a";
const PATH = (id: string, ext: string) => `${SLUG}/objs/${id}.${ext}`;
const dims = (tex: THREE.Texture | null, L: number) => {
  const im = tex?.image as HTMLImageElement | undefined, ar = im ? im.width / im.height : 1;
  return ar >= 1 ? [L, L / ar] : [L * ar, L];
};

// foto de fondo a sangre (cenital) + atrapa-sombras. w = ancho en metros; el alto sale de la foto
export const Fondo: React.FC<{ id: string; w: number; y?: number; o?: number; luz?: number; ext?: string }> = ({ id, w, y = 0, o = 0.5, luz = 1, ext = "jpg" }) => {
  const [tex, done] = useImg(PATH(id, ext));
  if (!tex) return null;
  const [W, H] = dims(tex, w), g = Math.round(255 * cl(luz));
  return <group position={[0, y, 0]}>
    <Ready dep={tex} done={done} />
    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[W, H]} /><meshBasicMaterial map={tex} toneMapped={false} color={`rgb(${g},${g},${g})`} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0006, 0]} receiveShadow><planeGeometry args={[W, H]} /><shadowMaterial transparent opacity={o} /></mesh>
  </group>;
};
// tamaño del fondo (para ubicar cosas en coordenadas de la foto: u,v ∈ 0..1 desde arriba-izquierda)
export const uv = (W: number, ar: number, u: number, v: number): [number, number] => [(u - 0.5) * W, (v - 0.5) * (W / ar)];

// objeto recortado con espesor: capas apiladas (la de abajo más oscura = el canto) · up = parado (plano vertical, pie en y=0)
export const Obj: React.FC<{ id: string; L: number; p?: V3; r?: V3; capas?: number; esp?: number; luz?: number; op?: number; up?: boolean; sombra?: boolean; tint?: string; sc?: number; children?: React.ReactNode }> = ({ id, L, p = [0, 0, 0], r = [0, 0, 0], capas = 4, esp = 0.0018, luz = 1, op = 1, up = false, sombra = true, tint, sc = 1, children }) => {
  const [tex, done] = useImg(PATH(id, "png"));
  if (!tex) return null;
  const [W, H] = dims(tex, L), g = Math.round(255 * cl(luz)), gd = Math.round(g * 0.45);
  return <group position={p} rotation={r} scale={[sc, sc, sc]}>
    <Ready dep={tex} done={done} />
    <group visible={op > 0.003} rotation={up ? [0, 0, 0] : [-Math.PI / 2, 0, 0]} position={up ? [0, H / 2, 0] : [0, 0, 0]}>
      {Array.from({ length: capas }, (_, i) => { const top = i === capas - 1; return <mesh key={i} position={[0, 0, (i + 1) * esp]} castShadow={sombra && i === 0 && op > 0.4}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} toneMapped={false} transparent={op < 1} opacity={op} alphaTest={0.5} side={THREE.DoubleSide} color={top ? (tint ?? `rgb(${g},${g},${g})`) : `rgb(${gd},${gd},${gd})`} />
      </mesh>; })}
    </group>
    {children}
  </group>;
};
export const useAR = (id: string, ext = "png") => { const [tex] = useImg(PATH(id, ext)); const im = tex?.image as HTMLImageElement | undefined; return im ? im.width / im.height : 1; };

// ---------- tinta que se dibuja ----------
type Kind = "tiza" | "labial" | "pluma" | "pincel" | "lapiz";
const INK: Record<Kind, string> = { tiza: "#f3f0e6", labial: "#b3121f", pluma: "#1d2a4a", pincel: "#141414", lapiz: "#3a3a3a" };
// polilínea parcial (fracción p de su largo)
export const pathP = (g: CanvasRenderingContext2D, pts: number[][], p: number) => {
  const L: number[] = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1] * cl(p); if (T <= 0) return;
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) { if (L[i] <= T) g.lineTo(pts[i][0], pts[i][1]); else { const k = (T - L[i - 1]) / (L[i] - L[i - 1]); g.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k); break; } }
  g.stroke();
};
// trazo de BROCHA real: cerdas paralelas (kasure), ancho que crece y se afina, cerdas que se secan al final. p = avance
export const brocha = (g: CanvasRenderingContext2D, pts: number[][], p: number, wd: number, seed = 1) => {
  const L: number[] = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1], T = tot * cl(p); if (T <= 0) return;
  const at = (d: number) => { let i = 1; while (i < L.length - 1 && L[i] < d) i++; const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k; const a = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]); return [x, y, a]; };
  const NB = Math.max(12, Math.round(wd * 0.9)), step = 3;
  for (let j = 0; j < NB; j++) {
    const off = (j / (NB - 1) - 0.5), dry = 1 - (0.12 + 0.5 * Math.abs(off) * 2) * rn(j, seed), gap = rn(j, seed + 7);
    g.lineWidth = 1.8 + 1.8 * rn(j, seed + 3); g.globalAlpha = 0.8 + 0.2 * rn(j, seed + 5);
    g.beginPath(); let pen = false;
    for (let d = 0; d <= T; d += step) {
      const u = d / tot, w = wd * Math.min(1, u / 0.08 + 0.35) * (1 - 0.55 * Math.max(0, (u - 0.8) / 0.2));
      const [x, y, a] = at(d), ox = -Math.sin(a) * off * w, oy = Math.cos(a) * off * w;
      const vis = u < dry && !(gap > 0.72 && u > 0.3 && Math.sin(d * 0.035 + j * 1.7) > 0.2);
      if (vis) { if (!pen) { g.moveTo(x + ox, y + oy); pen = true; } else g.lineTo(x + ox, y + oy); } else pen = false;
    }
    g.stroke();
  }
  g.globalAlpha = 1;
};
// círculo a mano (ligeramente abierto y pasado), como polilínea
export const ring = (cx: number, cy: number, rx: number, ry: number, seed = 1) => Array.from({ length: 64 }, (_, i) => { const a = -2.2 + (i / 63) * Math.PI * 2.15, w = 1 + 0.04 * Math.sin(i * 0.5 + seed); return [cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w]; });
export const arrow = (x0: number, y0: number, x1: number, y1: number, hd = 40) => { const a = Math.atan2(y1 - y0, x1 - x0); return [[x0, y0], [(x0 + x1) / 2 + (y1 - y0) * 0.08, (y0 + y1) / 2 - (x1 - x0) * 0.08], [x1, y1], [x1 - hd * Math.cos(a - 0.5), y1 - hd * Math.sin(a - 0.5)], [x1, y1], [x1 - hd * Math.cos(a + 0.5), y1 - hd * Math.sin(a + 0.5)]]; };
// grano según la herramienta (la tiza se rompe en polvo; el labial deja cera; el pincel se abre al final)
const grano = (g: CanvasRenderingContext2D, w: number, h: number, k: Kind) => {
  if (k === "tiza") { g.globalCompositeOperation = "destination-out"; for (let i = 0; i < w * h / 90; i++) { g.globalAlpha = 0.25 + 0.6 * rn(i, 1); g.fillRect(rn(i, 2) * w, rn(i, 3) * h, 1 + 2.4 * rn(i, 4), 1 + 2 * rn(i, 5)); } }
  if (k === "labial") { g.globalCompositeOperation = "source-atop"; for (let i = 0; i < w * h / 120; i++) { g.fillStyle = rn(i, 6) > 0.5 ? "rgba(255,190,190,.35)" : "rgba(70,0,0,.3)"; g.fillRect(rn(i, 2) * w, rn(i, 3) * h, 2.5, 1); } }
  if (k === "pincel") { g.globalCompositeOperation = "destination-out"; for (let i = 0; i < w * h / 400; i++) { g.globalAlpha = 0.4 * rn(i, 1); g.fillRect(rn(i, 2) * w, rn(i, 3) * h, 6 * rn(i, 4), 1); } }
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
};
// lienzo de tinta: draw(g, p) dibuja con p ∈ 0..1 (cuantizado a 30 pasos para cachear)
export const tinta = (key: string, w: number, h: number, p: number, kind: Kind, draw: (g: CanvasRenderingContext2D, p: number, col: string) => void) => {
  const q = Math.round(cl(p) * 30) / 30, fontOk = typeof document !== "undefined" && document.fonts.check(`700 40px "${HAND}"`);
  return canv(`tinta|${key}|${q}|${fontOk ? 1 : 0}`, w, h, (g) => {
    g.clearRect(0, 0, w, h); const col = INK[kind];
    g.strokeStyle = col; g.fillStyle = col; g.lineCap = "round"; g.lineJoin = "round";
    if (q > 0) draw(g, q, col);
    grano(g, w, h, kind);
  });
};
// texto a mano que avanza de izquierda a derecha (font: familia ya cargada)
export const escribir = (g: CanvasRenderingContext2D, txt: string, x: number, y: number, size: number, p: number, font: string, align: CanvasTextAlign = "center") => {
  g.font = `700 ${size}px "${font}"`; g.textAlign = align; g.textBaseline = "middle";
  const m = g.measureText(txt).width, x0 = align === "center" ? x - m / 2 : align === "right" ? x - m : x;
  g.save(); g.beginPath(); g.rect(x0 - 4, y - size, m * cl(p) + 6, size * 2); g.clip(); g.fillText(txt, x, y); g.restore();
};
// plano de tinta apoyado (o parado con up)
export const Tinta: React.FC<{ tex: THREE.Texture; w: number; h: number; p?: V3; r?: V3; op?: number; up?: boolean }> = ({ tex, w, h, p = [0, 0.004, 0], r = [0, 0, 0], op = 1, up = false }) => (
  <group position={p} rotation={r}><mesh rotation={up ? [0, 0, 0] : [-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} transparent opacity={op} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh></group>
);
// destello (estrella aditiva) para un brillo de cristal / diamante en la palabra
export const Destello: React.FC<{ p: V3; s: number; k: number }> = ({ p, s, k }) => k <= 0.01 ? null : (
  <sprite position={p} scale={[s * k, s * k, 1]}><spriteMaterial map={canv("destello", 256, 256, (g) => {
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.12, "rgba(255,246,225,.7)"); gr.addColorStop(1, "rgba(255,230,190,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256); g.globalCompositeOperation = "lighter";
    for (const a of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) { g.save(); g.translate(128, 128); g.rotate(a); const l = a % (Math.PI / 2) ? 70 : 128; const lg = g.createLinearGradient(-l, 0, l, 0); lg.addColorStop(0, "rgba(255,255,255,0)"); lg.addColorStop(0.5, "rgba(255,255,255,.9)"); lg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = lg; g.fillRect(-l, -1.5, 2 * l, 3); g.restore(); }
  })} blending={THREE.AdditiveBlending} transparent depthWrite={false} toneMapped={false} /></sprite>
);
// polvo de tiza que cae del trazo (partículas deterministas)
export const Polvo: React.FC<{ t: number; t0: number; p: V3; n?: number }> = ({ t, t0, p, n = 18 }) => {
  const dt = t - t0; if (dt < 0 || dt > 1.6) return null;
  return <group position={p}>{Array.from({ length: n }, (_, i) => { const vx = (rn(i, 1) - 0.5) * 0.05, vz = (rn(i, 2) - 0.5) * 0.05, y = Math.max(0, 0.03 + 0.04 * rn(i, 3) - 0.5 * 2.2 * dt * dt * (0.5 + rn(i, 4)));
    return <mesh key={i} position={[vx * dt * 3, y, vz * dt * 3]}><sphereGeometry args={[0.0012 + 0.0012 * rn(i, 5), 5, 4]} /><meshBasicMaterial color="#f4f1e8" transparent opacity={0.8 * (1 - dt / 1.6)} /></mesh>; })}</group>;
};
