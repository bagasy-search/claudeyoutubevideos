// lsm29 · EL MUNDO: el salón del sótano de la iglesia de Loretta (Zion United Methodist, Iowa), en corte de maqueta.
// Mesa larga con el mantel blanco y las sillas plegables, el pasaplatos a la cocina (con la cafetera grande de cromo),
// ventanitas altas de sótano, la cruz de madera, el piano vertical, el pizarrón de anuncios y las lámparas de escuela.
// Un solo salón para toda la tanda; THEME cambia la decoración (thanks · xmas · funeral · wedding · plain).
// Reglas 3D: luces SIEMPRE montadas (sólo cambia la intensidad), llamas ≤2 Hz, nunca escala 0 (bloom → rectángulo negro).
import React, { useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";
import { THEME } from "./theme";
import { P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
type Tx = THREE.Texture | undefined;
export type Theme = "thanks" | "xmas" | "funeral" | "wedding" | "plain";

// ---------------- puntos fijos ----------------
export const TABLE: V3 = [0.2, 0.76, -0.6];
const TW = 2.7, TD = 0.8;
export const SEATS: V3[] = [-0.85, -0.2, 0.45, 1.1].flatMap((x) => [[x, 0, -0.6 - 0.62] as V3, [x, 0, -0.6 + 0.62] as V3]);
export const HEAD: V3 = [1.82, 0, -0.6];            // la silla de la cabecera (la silla vacía en thanks)
export const PASS = { x0: -2.3, x1: -0.9, y0: 0.98, y1: 1.72, z: -3 };   // pasaplatos a la cocina
export const URN: V3 = [-1.25, 1.02, -3.35];
export const CROSS: V3 = [1.45, 1.6, -2.96];
export const PIANO: V3 = [2.75, 0, -2.62];
export const BOARD: V3 = [-3.02, 1.45, -0.9];
export const SERVE: V3 = [-2.7, 0.76, -0.4];         // mesa de servir contra la pared izquierda
export const BOOK: V3 = [0.86, 0.78, -0.6];
export const CENTER: V3 = [0.12, 0.78, -0.6];
export const PT = { table: TABLE, head: HEAD, pass: [(PASS.x0 + PASS.x1) / 2, 1.3, -3] as V3, urn: URN, cross: CROSS, piano: PIANO, board: BOARD, serve: SERVE, center: CENTER, book: BOOK };

// ---------------- cámara ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const Cam: React.FC<{ k: { p: THREE.Vector3; l: THREE.Vector3; fov: number } }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 600; c.updateProjectionMatrix();
  return null;
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 600); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};

export type Scene = {
  cam: { p: V3; l: V3; fov: number };
  book?: { open: number; page: string; turn?: number; from?: string };
  light?: number;          // 0 = media luz (antes de prender) · 1 = salón encendido
  hiChair?: number;        // 0-1: la silla vacía con su vela resaltada
};
const BW = 0.17, BD = 0.22, BT = 0.018;

// páginas reales del libro (public/<slug>/book_p001.jpg = tapa · book_cta.jpg = página abierta)
const usePages = () => {
  const [h] = useState(() => delayRender("páginas del libro"));
  return useMemo(() => {
    let n = 2;
    const done = () => { n -= 1; if (n === 0) continueRender(h); };
    const L = new THREE.TextureLoader();
    const ld = (f: string) => { const tx = L.load(staticFile(P + f), done, undefined, done); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return tx; };
    return { "001": ld("book_p001.jpg"), cta: ld("book_cta.jpg") } as Record<string, THREE.Texture>;
  }, [h]);
};

// ---------------- geometría ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, cast = true, map, rad = 0.012, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} />
  </mesh>
);
const Chrome: React.FC<{ p: V3; s: V3; rot?: V3 }> = ({ p, s, rot }) => <Box p={p} s={s} c="#e8ecf0" r={0.12} m={1} rad={Math.min(s[0], s[1], s[2]) / 2.2} rot={rot} />;

// mantel con caída y pliegues (un solo paño)
const clothGeo = (w: number, d: number, drop: number) => {
  const g = new THREE.PlaneGeometry(w + 2 * drop, d + 2 * drop, 140, 50);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const ox = Math.max(0, Math.abs(x) - w / 2), oy = Math.max(0, Math.abs(y) - d / 2), o = Math.max(ox, oy);
    if (o <= 0) continue;
    const fold = 0.014 * Math.min(1, o / 0.08) * Math.sin((ox > oy ? y : x) * 40 + (ox > oy ? 1 : 2));
    const nx = ox > 0 ? Math.sign(x) * (w / 2 + 0.006 + (ox >= oy ? fold : 0)) : x;
    const ny = oy > 0 ? Math.sign(y) * (d / 2 + 0.006 + (oy > ox ? fold : 0)) : y;
    p.setX(i, nx); p.setY(i, ny); p.setZ(i, -o + 0.002);
  }
  g.computeVertexNormals(); return g;
};
const CLOTH = clothGeo(TW, TD, 0.26);
const SCLOTH = clothGeo(0.62, 2.2, 0.2);

// silla plegable de metal beige con asiento de vinilo
const FoldChair: React.FC<{ p: V3; ry: number; ribbon?: boolean }> = ({ p, ry, ribbon }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.45, 0]} s={[0.4, 0.035, 0.38]} c="#8a7a62" r={0.45} rad={0.012} />
    <Box p={[0, 0.78, -0.19]} s={[0.4, 0.2, 0.025]} c="#8a7a62" r={0.45} rad={0.01} rot={[-0.08, 0, 0]} />
    {[-0.19, 0.19].map((x) => <React.Fragment key={x}>
      <Box p={[x, 0.42, -0.17]} s={[0.022, 0.84, 0.022]} c="#c8bfae" r={0.3} m={0.6} rad={0.008} rot={[-0.1, 0, 0]} />
      <Box p={[x, 0.22, 0.12]} s={[0.022, 0.46, 0.022]} c="#c8bfae" r={0.3} m={0.6} rad={0.008} rot={[0.25, 0, 0]} />
    </React.Fragment>)}
    {ribbon && <mesh position={[0, 0.82, -0.215]}><torusGeometry args={[0.05, 0.012, 8, 24]} /><meshStandardMaterial color="#f6f2ea" roughness={0.5} /></mesh>}
  </group>
);

// plato con borde azul (vajilla de la iglesia), taza de café al lado
const Setting: React.FC<{ p: V3; face: number }> = ({ p, face }) => (
  <group position={[p[0], TABLE[1] + 0.012, TABLE[2] + face * 0.24]}>
    <mesh receiveShadow castShadow><cylinderGeometry args={[0.12, 0.1, 0.014, 40]} /><meshStandardMaterial color="#f7f4ec" roughness={0.16} /></mesh>
    <mesh position={[0, 0.0078, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.093, 0.1, 40]} /><meshStandardMaterial color="#5f86b8" roughness={0.3} /></mesh>
    <mesh position={[0.17, 0.035, -face * 0.06]} castShadow><cylinderGeometry args={[0.035, 0.03, 0.07, 20]} /><meshStandardMaterial color="#f2efe8" roughness={0.2} /></mesh>
    <Chrome p={[-0.15, 0.002, 0]} s={[0.016, 0.005, 0.17]} />
  </group>
);

// fuente de 9x13 tapada con papel aluminio o descubierta
const Pan: React.FC<{ p: V3; top: string; foil?: boolean; map?: Tx; ry?: number }> = ({ p, top, foil, map, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.035, 0]} s={[0.36, 0.07, 0.25]} c="#b4b7bb" r={0.3} m={0.85} rad={0.012} />
    {foil ? <Box p={[0, 0.075, 0]} s={[0.375, 0.02, 0.265]} c="#e8ebee" r={0.25} m={0.8} map={map} rad={0.008} />
      : <Box p={[0, 0.065, 0]} s={[0.33, 0.02, 0.22]} c={top} r={0.55} map={map} rad={0.006} />}
  </group>
);

// vela (llama lenta ≤2 Hz)
const Candle: React.FC<{ p: V3; t: number; on: number; h?: number; col?: string }> = ({ p, t, on, h = 0.16, col = "#f3ead6" }) => (
  <group position={p}>
    <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, h, 16]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>
    <mesh position={[0, h + 0.016 + 0.002 * Math.sin(t * 9), 0]} scale={[1, 1.9, 1]} visible={on > 0.02}><sphereGeometry args={[0.011, 12, 10]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} transparent opacity={on} /></mesh>
  </group>
);

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useHallTex = () => useMemo(() => ({
  // baldosa vinílica de salón (crema con motas), juntas finas
  tile: mk(256, 256, (g) => {
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { g.fillStyle = (r + c) % 2 ? "#e2d8c3" : "#d9cdb4"; g.fillRect(c * 128, r * 128, 128, 128); }
    for (let i = 0; i < 1600; i++) { const v = rnd(i, 1); g.fillStyle = v > 0.6 ? `rgba(120,96,70,${0.35 * rnd(i, 2)})` : `rgba(250,246,236,${0.4 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
    g.strokeStyle = "rgba(90,70,50,.35)"; g.lineWidth = 1.2; g.strokeRect(0, 0, 128, 128); g.strokeRect(128, 128, 128, 128); g.strokeRect(128, 0, 128, 128); g.strokeRect(0, 128, 128, 128);
  }, [10, 9]),
  // bloque de hormigón pintado crema (sótano)
  block: mk(256, 256, (g) => {
    g.fillStyle = "#ece4d2"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(150,130,100,.45)"; g.lineWidth = 2;
    for (let r = 0; r < 4; r++) { g.beginPath(); g.moveTo(0, r * 64); g.lineTo(256, r * 64); g.stroke(); for (let c = 0; c < 2; c++) { const x = c * 128 + (r % 2) * 64; g.beginPath(); g.moveTo(x, r * 64); g.lineTo(x, r * 64 + 64); g.stroke(); } }
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(160,140,110,${0.07 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 0, 6.3); g.fill(); }
  }, [7, 3]),
  // friso de madera (revestimiento de la mitad de abajo)
  panel: mk(512, 128, (g) => {
    g.fillStyle = "#7a5232"; g.fillRect(0, 0, 512, 128);
    for (let x = 0; x < 512; x += 64) { g.fillStyle = "rgba(40,22,8,.55)"; g.fillRect(x, 0, 3, 128); }
    for (let i = 0; i < 300; i++) { g.strokeStyle = `rgba(${rnd(i, 1) > 0.5 ? "60,34,14" : "170,120,70"},${0.18 * rnd(i, 2)})`; g.lineWidth = 1; g.beginPath(); const x = rnd(i, 3) * 512; g.moveTo(x, 0); g.bezierCurveTo(x + 6, 40, x - 6, 80, x + 3, 128); g.stroke(); }
  }, [6, 1]),
  // mantel blanco de la iglesia con la crucecita bordada
  cloth: mk(1400, 512, (g) => {
    g.fillStyle = "#f5f2ea"; g.fillRect(0, 0, 1400, 512);
    for (let y = 0; y < 512; y += 3) { g.fillStyle = `rgba(190,180,160,${0.07 + 0.04 * rnd(y, 1)})`; g.fillRect(0, y, 1400, 1); }
    g.strokeStyle = "rgba(170,160,140,.55)"; g.lineWidth = 3; g.strokeRect(14, 14, 1372, 484);
    const cx = 150, cy = 400, u = 6;
    const st = (i: number, j: number) => { g.strokeStyle = "#a3171c"; g.lineWidth = 2; const x = cx + i * u, y = cy + j * u; g.beginPath(); g.moveTo(x, y); g.lineTo(x + u, y + u); g.moveTo(x + u, y); g.lineTo(x, y + u); g.stroke(); };
    for (let j = -6; j <= 7; j++) st(0, j);
    for (let i = -4; i <= 4; i++) if (i) st(i, -2);
  }),
  // papel aluminio arrugado
  foil: mk(256, 256, (g) => {
    g.fillStyle = "#b9bcc0"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 220; i++) { const v = 150 + rnd(i, 1) * 105; g.fillStyle = `rgba(${v},${v},${v + 4},.55)`; g.beginPath(); const x = rnd(i, 2) * 256, y = rnd(i, 3) * 256; g.moveTo(x, y); g.lineTo(x + 30 * (rnd(i, 4) - 0.5), y + 30 * (rnd(i, 5) - 0.5)); g.lineTo(x + 30 * (rnd(i, 6) - 0.5), y + 30 * (rnd(i, 7) - 0.5)); g.closePath(); g.fill(); }
  }),
  // gratinado dorado (las fuentes)
  crust: mk(256, 256, (g) => {
    g.fillStyle = "#d9973c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { const r = 2 + rnd(i, 1) * 9; g.fillStyle = rnd(i, 2) > 0.55 ? `rgba(122,58,14,${0.35 + 0.4 * rnd(i, 3)})` : `rgba(245,200,110,${0.35 + 0.4 * rnd(i, 3)})`; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, r, r * (0.6 + rnd(i, 6) * 0.6), rnd(i, 7) * 3, 0, 6.3); g.fill(); }
  }),
  // ventana de sótano: pasto a la altura del vidrio y cielo (la nieve en xmas)
  win: mk(256, 96, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 96); gr.addColorStop(0, THEME === "xmas" ? "#c9d6e6" : "#bcd3ea"); gr.addColorStop(1, "#eef2f2"); g.fillStyle = gr; g.fillRect(0, 0, 256, 96);
    g.fillStyle = THEME === "xmas" ? "#f4f6f8" : "#6d8a4a"; g.fillRect(0, 62, 256, 34);
    for (let i = 0; i < 160; i++) { g.strokeStyle = THEME === "xmas" ? "rgba(200,210,220,.8)" : `rgba(${60 + 40 * rnd(i, 1)},${100 + 50 * rnd(i, 2)},40,.9)`; g.lineWidth = 1.5; const x = rnd(i, 3) * 256; g.beginPath(); g.moveTo(x, 70); g.lineTo(x + (rnd(i, 4) - 0.5) * 6, 52 + rnd(i, 5) * 14); g.stroke(); }
  }),
  // el pizarrón de anuncios: corcho con papeles
  cork: mk(512, 320, (g) => {
    g.fillStyle = "#b98a56"; g.fillRect(0, 0, 512, 320);
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${rnd(i, 1) > 0.5 ? "90,56,26" : "220,180,120"},${0.25 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 320, 2, 2); }
    const notes = [[30, 30, 130, 170, "#fbf7ea"], [180, 40, 150, 110, "#fff2a8"], [350, 24, 130, 150, "#fbf7ea"], [190, 170, 120, 120, "#cfe6f7"], [340, 190, 140, 100, "#fbf7ea"], [40, 215, 120, 85, "#f9d5d2"]] as const;
    notes.forEach(([x, y, w, h, c], k) => {
      g.save(); g.translate(x + w / 2, y + h / 2); g.rotate((rnd(k, 7) - 0.5) * 0.12); g.fillStyle = c; g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 6; g.fillRect(-w / 2, -h / 2, w, h); g.shadowBlur = 0;
      g.strokeStyle = "rgba(50,50,60,.6)"; g.lineWidth = 2; for (let r = 0; r < 5; r++) { g.beginPath(); const yy = -h / 2 + 22 + r * (h - 30) / 5; g.moveTo(-w / 2 + 12, yy); for (let xx = -w / 2 + 12; xx < w / 2 - 14 - rnd(r + k, 2) * 30; xx += 4) g.lineTo(xx, yy + Math.sin(xx * 0.5 + r) * 2); g.stroke(); }
      g.fillStyle = "#c0392b"; g.beginPath(); g.arc(0, -h / 2 + 8, 5, 0, 6.3); g.fill(); g.restore();
    });
  }),
}), []);

// ---------------- decoración por tema ----------------
const Pumpkin: React.FC<{ p: V3; s: number; c?: string }> = ({ p, s, c = "#d9772a" }) => (
  <group position={p} scale={[s, s * 0.78, s]}>
    {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.035, 0.06, Math.sin(a) * 0.035]} scale={[0.75, 1, 0.75]} castShadow><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color={c} roughness={0.45} /></mesh>; })}
    <mesh position={[0, 0.125, 0]} rotation={[0.2, 0, 0.2]}><cylinderGeometry args={[0.008, 0.012, 0.05, 8]} /><meshStandardMaterial color="#4f5a2a" roughness={0.8} /></mesh>
  </group>
);
const Turkey: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <mesh scale={[1.5, 0.12, 1.05]} receiveShadow><cylinderGeometry args={[0.13, 0.12, 0.1, 40]} /><meshStandardMaterial color="#f4f0e6" roughness={0.18} /></mesh>
    <mesh position={[0, 0.08, 0]} scale={[1.25, 0.72, 0.95]} castShadow><sphereGeometry args={[0.11, 28, 20]} /><meshStandardMaterial color="#b8682a" roughness={0.32} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0.11, 0.08, k * 0.06]} rotation={[0, 0, -0.9]} castShadow><capsuleGeometry args={[0.025, 0.07, 6, 12]} /><meshStandardMaterial color="#a85a22" roughness={0.35} /></mesh>)}
    {[-0.13, 0.13].map((x) => <mesh key={x} position={[x, 0.02, 0.12]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#4c7a2c" roughness={0.6} /></mesh>)}
  </group>
);
const XmasTree: React.FC<{ p: V3; t: number }> = ({ p, t }) => (
  <group position={p}>
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.04, 0.05, 0.24, 12]} /><meshStandardMaterial color="#5a3a20" roughness={0.8} /></mesh>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0.42 + i * 0.3, 0]} castShadow><coneGeometry args={[0.55 - i * 0.12, 0.55, 24]} /><meshStandardMaterial color={i % 2 ? "#1f4a2c" : "#245633"} roughness={0.85} /></mesh>)}
    {/* mitones y gorritos de lana colgados (el árbol de mitones) */}
    {Array.from({ length: 22 }, (_, i) => { const y = 0.35 + rnd(i, 1) * 1.0, rr = (0.5 - (y - 0.35) * 0.38) * 0.92, a = rnd(i, 2) * 6.28; const c = ["#b3261e", "#f2ede1", "#2f5d9b", "#d9a23a", "#7a2a6a"][i % 5];
      return <mesh key={"m" + i} position={[Math.cos(a) * rr, y, Math.sin(a) * rr]} rotation={[0, -a, 0.2]} castShadow><boxGeometry args={[0.05, 0.075, 0.02]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>; })}
    {Array.from({ length: 30 }, (_, i) => { const y = 0.3 + (i / 30) * 1.05, rr = (0.53 - (y - 0.3) * 0.4), a = i * 1.7; const on = 0.6 + 0.4 * Math.sin(t * 1.2 + i);
      return <mesh key={"l" + i} position={[Math.cos(a) * rr, y, Math.sin(a) * rr]}><sphereGeometry args={[0.011, 8, 6]} /><meshBasicMaterial color={["#ffd27a", "#ff8a7a", "#9fd0ff"][i % 3]} toneMapped={false} transparent opacity={on} /></mesh>; })}
    <mesh position={[0, 1.62, 0]}><octahedronGeometry args={[0.06, 0]} /><meshBasicMaterial color="#ffe08a" toneMapped={false} /></mesh>
  </group>
);
const Lilies: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.05, 0.035, 0.2, 24]} /><meshStandardMaterial color="#dfe8ea" roughness={0.05} transparent opacity={0.6} /></mesh>
    {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * 6.28, r = 0.05 + rnd(i, 1) * 0.05, y = 0.3 + rnd(i, 2) * 0.12;
      return <group key={i}>
        <mesh position={[Math.cos(a) * r * 0.5, 0.2 + (y - 0.2) / 2, Math.sin(a) * r * 0.5]} rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]}><cylinderGeometry args={[0.003, 0.003, y - 0.2, 6]} /><meshStandardMaterial color="#4c7a2c" /></mesh>
        <group position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation={[Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6]}>
          {Array.from({ length: 6 }, (_, j) => <mesh key={j} rotation={[0.9, (j / 6) * 6.28, 0]} position={[0, 0.01, 0]}><coneGeometry args={[0.012, 0.07, 6, 1, true]} /><meshStandardMaterial color="#fbfaf4" roughness={0.55} side={THREE.DoubleSide} /></mesh>)}
        </group>
      </group>; })}
  </group>
);
const Cake: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 40]} /><meshStandardMaterial color="#e8ecf0" metalness={0.9} roughness={0.15} /></mesh>
    {[[0.16, 0.12], [0.12, 0.1], [0.08, 0.09]].map(([r, h], i) => { const y = 0.02 + [0, 0.12, 0.22][i] + h / 2;
      return <group key={i}>
        <mesh position={[0, y, 0]} castShadow><cylinderGeometry args={[r, r, h, 48]} /><meshStandardMaterial color="#fbf8f1" roughness={0.42} /></mesh>
        {Array.from({ length: Math.round(r * 120) }, (_, j) => { const a = (j / Math.round(r * 120)) * 6.28; return <mesh key={j} position={[Math.cos(a) * r, y - h / 2 + 0.008, Math.sin(a) * r]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#fffdf8" roughness={0.4} /></mesh>; })}
      </group>; })}
    {[0, 1, 2].map((i) => <mesh key={"f" + i} position={[Math.cos(i * 2.1) * 0.03, 0.4, Math.sin(i * 2.1) * 0.03]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color={["#f2c6c8", "#fbf6ee", "#e8b6ba"][i]} roughness={0.7} /></mesh>)}
  </group>
);

// ---------------- LA ESCENA ----------------
export const HallWorld: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useTextures(), kt = useHallTex(), pg = usePages();
  const L = sc.light ?? 1, hi = sc.hiChair ?? 0;
  const fl = 0.92 + 0.08 * Math.sin(t * 1.7) * Math.sin(t * 1.1 + 1);   // llama lenta
  const wed = THEME === "wedding", xm = THEME === "xmas", fun = THEME === "funeral", th = THEME === "thanks";
  const bulbs = wed || xm;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam k={{ p: v3(sc.cam.p), l: v3(sc.cam.l), fov: sc.cam.fov }} />
      <Post bloom={0.24} threshold={0.9} exposure={lerp(0.7, 0.86, L)} env={0.45} />
      <color attach="background" args={["#0d0f14"]} />
      <hemisphereLight args={["#efe9dd", "#6b5a44", lerp(0.2, 0.42, L)]} />
      {/* luz de las ventanitas altas (fría) */}
      <directionalLight position={[1.0, 3.4, -6]} intensity={0.85} color="#b9cbe6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-camera-far={20} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* las tres lámparas de escuela sobre la mesa */}
      {[-0.75, 0.2, 1.15].map((x, i) => <pointLight key={"pl" + i} position={[x, 2.05, -0.6]} intensity={lerp(0.15, 0.95, L)} distance={4.5} color="#ffd9a8" decay={1.6} castShadow={i === 1} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />)}
      <pointLight position={[2.2, 2.2, 1.6]} intensity={0.5} distance={8} color="#ffe6c4" decay={1.6} />
      {/* cocina detrás del pasaplatos (tibia) */}
      <pointLight position={[-1.6, 1.8, -3.6]} intensity={1.1} distance={3} color="#ffcf8f" decay={1.7} />
      {/* vela de la silla vacía / del tema */}
      <pointLight position={[HEAD[0] - 0.32, 1.0, HEAD[2]]} intensity={(th || fun ? 0.7 : 0.25) * fl + 0.6 * hi} distance={1.8} color="#ffb35a" decay={1.8} />

      {/* piso, paredes y cantos de la maqueta */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.2]} receiveShadow><planeGeometry args={[7.2, 6.4]} /><meshStandardMaterial map={kt.tile} roughness={0.38} /></mesh>
      {/* pared del fondo armada alrededor del hueco del pasaplatos */}
      <mesh position={[1.3, 1.3, -3]} receiveShadow><planeGeometry args={[4.4, 2.6]} /><meshStandardMaterial map={kt.block} roughness={0.95} /></mesh>
      <mesh position={[-2.68, 1.3, -3]} receiveShadow><planeGeometry args={[0.76, 2.6]} /><meshStandardMaterial map={kt.block} roughness={0.95} /></mesh>
      <mesh position={[(PASS.x0 + PASS.x1) / 2, (PASS.y1 + 2.6) / 2, -3]} receiveShadow><planeGeometry args={[PASS.x1 - PASS.x0, 2.6 - PASS.y1]} /><meshStandardMaterial map={kt.block} roughness={0.95} /></mesh>
      <mesh position={[(PASS.x0 + PASS.x1) / 2, PASS.y0 / 2, -3]} receiveShadow><planeGeometry args={[PASS.x1 - PASS.x0, PASS.y0]} /><meshStandardMaterial map={kt.block} roughness={0.95} /></mesh>
      <mesh position={[-3.05, 1.3, -0.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[6.4, 2.6]} /><meshStandardMaterial map={kt.block} roughness={0.95} /></mesh>
      {/* friso de madera hasta la cintura (fondo e izquierda) */}
      <Box p={[0.75, 0.45, -2.985]} s={[5.5, 0.9, 0.025]} c="#7a5232" map={kt.panel} r={0.5} />
      <Box p={[-2.68, 0.45, -2.985]} s={[0.76, 0.9, 0.025]} c="#7a5232" map={kt.panel} r={0.5} />
      <Box p={[-3.035, 0.45, -0.2]} s={[0.025, 0.9, 6.4]} c="#7a5232" map={kt.panel} r={0.5} rot={[0, 0, 0]} />
      <Box p={[0.75, 0.91, -2.975]} s={[5.5, 0.03, 0.05]} c="#5e3c20" r={0.45} />
      <Box p={[3.5, 1.3, -3]} s={[0.04, 2.6, 0.08]} c="#efe6d4" r={1} />
      <Box p={[-3.05, 1.3, 3.0]} s={[0.08, 2.6, 0.04]} c="#efe6d4" r={1} />

      {/* ventanitas altas de sótano (luz de afuera, pasto a la altura del vidrio) */}
      {[0.15, 1.25, 2.35].map((x, i) => <group key={"w" + i} position={[x, 2.22, -2.975]}>
        <mesh><planeGeometry args={[0.8, 0.3]} /><meshStandardMaterial map={kt.win} emissiveMap={kt.win} emissive="#ffffff" emissiveIntensity={0.85} roughness={0.2} /></mesh>
        <Box p={[0, 0.17, 0.02]} s={[0.88, 0.04, 0.06]} c="#f1ece2" /><Box p={[0, -0.17, 0.03]} s={[0.9, 0.04, 0.09]} c="#f1ece2" />
        {[-0.42, 0, 0.42].map((xx) => <Box key={xx} p={[xx, 0, 0.02]} s={[0.035, 0.36, 0.05]} c="#f1ece2" />)}
      </group>)}

      {/* PASAPLATOS: marco, repisa, y la cocina detrás con la cafetera grande de cromo */}
      <Box p={[(PASS.x0 + PASS.x1) / 2, PASS.y0 - 0.02, -2.94]} s={[PASS.x1 - PASS.x0 + 0.12, 0.04, 0.24]} c="#d9cdb2" r={0.35} />
      {[PASS.x0 - 0.03, PASS.x1 + 0.03].map((x) => <Box key={x} p={[x, (PASS.y0 + PASS.y1) / 2, -2.97]} s={[0.06, PASS.y1 - PASS.y0 + 0.06, 0.08]} c="#f1ece2" />)}
      <Box p={[(PASS.x0 + PASS.x1) / 2, PASS.y1 + 0.03, -2.97]} s={[PASS.x1 - PASS.x0 + 0.12, 0.06, 0.08]} c="#f1ece2" />
      <mesh position={[-1.6, 1.3, -3.9]}><planeGeometry args={[2.2, 2.6]} /><meshStandardMaterial color="#f2e6cc" roughness={0.9} /></mesh>
      <Box p={[-1.6, 0.46, -3.6]} s={[1.9, 0.92, 0.55]} c="#e9e3d6" r={0.5} />
      <Box p={[-1.6, 0.94, -3.6]} s={[1.95, 0.04, 0.6]} c="#c9bfa8" r={0.3} />
      <group position={URN}>
        <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.4, 32]} /><meshStandardMaterial color="#e8ecf0" metalness={1} roughness={0.14} /></mesh>
        <mesh position={[0, 0.42, 0]}><sphereGeometry args={[0.13, 24, 12, 0, 6.29, 0, 1.2]} /><meshStandardMaterial color="#e8ecf0" metalness={1} roughness={0.14} /></mesh>
        <Box p={[0, 0.06, 0.15]} s={[0.04, 0.03, 0.06]} c="#1c1c1c" r={0.5} />
        <mesh position={[0.06, 0.2, 0.125]}><boxGeometry args={[0.012, 0.22, 0.008]} /><meshStandardMaterial color="#5a3a20" transparent opacity={0.65} roughness={0.1} /></mesh>
      </group>
      {[-2.05, -0.95].map((x, i) => <Box key={"cab" + i} p={[x, 1.95, -3.75]} s={[0.6, 0.5, 0.3]} c="#f4f1e8" r={0.5} />)}
      {/* tazas boca abajo en la repisa del pasaplatos */}
      {Array.from({ length: 6 }, (_, i) => <mesh key={"cup" + i} position={[PASS.x0 + 0.18 + i * 0.2, PASS.y0 + 0.035, -2.92]} castShadow><cylinderGeometry args={[0.03, 0.036, 0.07, 18]} /><meshStandardMaterial color="#f4f1ea" roughness={0.2} /></mesh>)}

      {/* la cruz de madera del salón */}
      <group position={CROSS}>
        <Box p={[0, 0, 0]} s={[0.07, 0.62, 0.04]} c="#5a3a20" r={0.55} />
        <Box p={[0, 0.13, 0]} s={[0.36, 0.07, 0.04]} c="#5a3a20" r={0.55} />
      </group>
      {/* piano vertical */}
      <group position={PIANO}>
        <Box p={[0, 0.62, 0]} s={[1.3, 1.24, 0.5]} c="#3a1f12" r={0.18} m={0.1} rad={0.02} />
        <Box p={[0, 0.74, 0.3]} s={[1.24, 0.06, 0.2]} c="#2f190e" r={0.2} />
        <Box p={[0, 0.775, 0.33]} s={[1.14, 0.02, 0.14]} c="#f4f1e8" r={0.3} />
        {Array.from({ length: 22 }, (_, i) => <Box key={i} p={[-0.54 + i * 0.052, 0.79, 0.3]} s={[0.022, 0.015, 0.08]} c="#151515" r={0.3} rad={0.003} />)}
        <Box p={[0, 1.02, 0.27]} s={[0.4, 0.26, 0.015]} c="#f6f0e0" r={0.8} rot={[-0.25, 0, 0]} />
      </group>
      {/* pizarrón de anuncios en la pared izquierda */}
      <group position={BOARD} rotation={[0, Math.PI / 2, 0]}>
        <Box p={[0, 0, 0]} s={[1.3, 0.82, 0.03]} c="#6a4426" r={0.6} />
        <mesh position={[0, 0, 0.017]}><planeGeometry args={[1.22, 0.74]} /><meshStandardMaterial map={kt.cork} roughness={0.95} /></mesh>
      </group>

      {/* MESA DE SERVIR contra la pared izquierda, con las fuentes */}
      <group>
        {[[-2.95, -1.45], [-2.45, -1.45], [-2.95, 0.65], [-2.45, 0.65]].map(([x, z], i) => <Box key={"sl" + i} p={[x, 0.37, z]} s={[0.04, 0.74, 0.04]} c="#9a958a" m={0.6} r={0.35} />)}
        <Box p={[SERVE[0], 0.745, SERVE[2]]} s={[0.62, 0.03, 2.2]} c="#7a5434" r={0.6} />
        <mesh geometry={SCLOTH} position={[SERVE[0], 0.762, SERVE[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow><meshStandardMaterial map={kt.cloth} roughness={0.92} side={THREE.DoubleSide} /></mesh>
        <Pan p={[SERVE[0], 0.77, -1.2]} top="#e8c79a" map={kt.crust} />
        <Pan p={[SERVE[0], 0.77, -0.75]} top="#c9873a" foil map={kt.foil} ry={0.05} />
        <Pan p={[SERVE[0], 0.77, -0.3]} top="#d9973c" map={kt.crust} ry={-0.04} />
        <Pan p={[SERVE[0], 0.77, 0.15]} top="#a8c46a" />
        {/* jarra de té helado y la pila de platos */}
        <mesh position={[SERVE[0] + 0.1, 0.88, 0.55]} castShadow><cylinderGeometry args={[0.07, 0.06, 0.22, 24]} /><meshStandardMaterial color="#8a4a1a" roughness={0.05} transparent opacity={0.7} /></mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={"pp" + i} position={[SERVE[0] - 0.12, 0.775 + i * 0.012, 0.55]}><cylinderGeometry args={[0.12, 0.1, 0.01, 32]} /><meshStandardMaterial color="#f7f4ec" roughness={0.16} /></mesh>)}
      </group>

      {/* LA MESA LARGA con el mantel blanco */}
      <group>
        {[[-1.05, -0.92], [1.45, -0.92], [-1.05, -0.28], [1.45, -0.28]].map(([x, z], i) => <Box key={"tl" + i} p={[x, 0.37, z]} s={[0.04, 0.74, 0.04]} c="#9a958a" m={0.6} r={0.35} />)}
        <Box p={[TABLE[0], 0.745, TABLE[2]]} s={[TW, 0.03, TD]} c="#7a5434" r={0.6} />
        <mesh geometry={CLOTH} position={[TABLE[0], 0.762, TABLE[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow><meshStandardMaterial map={kt.cloth} roughness={0.92} side={THREE.DoubleSide} /></mesh>
        {[-0.85, -0.2, 0.45, 1.1].flatMap((x) => [-1, 1].map((f) => <Setting key={x + "_" + f} p={[x, 0, 0]} face={f} />))}
        {SEATS.map((s, i) => <FoldChair key={"ch" + i} p={[s[0], 0, s[2] + (s[2] < TABLE[2] ? -0.08 : 0.08)]} ry={s[2] < TABLE[2] ? 0 : Math.PI} ribbon={wed} />)}
        {/* la cabecera: la silla (vacía en thanks/funeral) con su plato y su vela */}
        <FoldChair p={[HEAD[0] - 0.1 + 0.12, 0, HEAD[2]]} ry={-Math.PI / 2} ribbon={wed} />
        <Setting p={[HEAD[0] - 0.5, 0, 0]} face={0} />
        <Candle p={[HEAD[0] - 0.33, TABLE[1] + 0.01, HEAD[2] - 0.2]} t={t} on={th || fun ? 1 : 0.0} />
        {hi > 0.01 && <mesh position={[HEAD[0] + 0.02, 0.47, HEAD[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.3, 0.315, 64]} /><meshBasicMaterial color="#ffcf7a" toneMapped={false} transparent opacity={hi} /></mesh>}
        {/* centro de mesa según el tema */}
        {th && <><Turkey p={[CENTER[0] - 0.35, CENTER[1], CENTER[2]]} /><Pumpkin p={[CENTER[0] + 0.25, CENTER[1], CENTER[2] - 0.05]} s={0.9} /><Pumpkin p={[CENTER[0] + 0.42, CENTER[1], CENTER[2] + 0.08]} s={0.55} c="#e8c25a" /><Pumpkin p={[CENTER[0] + 0.1, CENTER[1], CENTER[2] + 0.1]} s={0.45} c="#f1ead6" />
          {Array.from({ length: 14 }, (_, i) => <mesh key={"lf" + i} position={[CENTER[0] - 0.6 + i * 0.09, CENTER[1] + 0.004, CENTER[2] + (rnd(i, 3) - 0.5) * 0.2]} rotation={[-Math.PI / 2, 0, rnd(i, 4) * 6]}><circleGeometry args={[0.022, 5]} /><meshStandardMaterial color={["#c0521c", "#d98a2a", "#9a3a16"][i % 3]} roughness={0.8} side={THREE.DoubleSide} /></mesh>)}</>}
        {xm && <>{[-0.3, 0, 0.3].map((x, i) => <Candle key={i} p={[CENTER[0] + x, CENTER[1], CENTER[2]]} t={t + i} on={1} h={0.22} col="#b3261e" />)}
          {Array.from({ length: 24 }, (_, i) => <mesh key={"gl" + i} position={[CENTER[0] - 0.6 + i * 0.05, CENTER[1] + 0.02, CENTER[2] + Math.sin(i * 0.8) * 0.06]}><sphereGeometry args={[0.028, 8, 6]} /><meshStandardMaterial color="#24502e" roughness={0.9} /></mesh>)}</>}
        {fun && <><Lilies p={[CENTER[0], CENTER[1], CENTER[2]]} /><Pan p={[CENTER[0] - 0.55, CENTER[1], CENTER[2]]} top="#e9cf9a" map={kt.crust} /></>}
        {wed && <Cake p={[CENTER[0], CENTER[1], CENTER[2]]} />}
        {sc.book && <Book open={sc.book.open} page={pg[sc.book.page]} cover={pg["001"]} turn={sc.book.turn} from={sc.book.from ? pg[sc.book.from] : undefined} />}
      </group>

      {/* árbol de mitones (xmas) en el rincón del piano · mesa de recuerdo con la foto (funeral) */}
      {xm && <XmasTree p={[1.95, 0, -2.45]} t={t} />}
      {fun && <group position={[2.0, 0, -2.6]}>
        <Box p={[0, 0.37, 0]} s={[0.8, 0.74, 0.4]} c="#3a2a1e" r={0.5} />
        <Box p={[0, 0.98, -0.06]} s={[0.32, 0.42, 0.03]} c="#c9a45a" m={0.8} r={0.25} rot={[-0.12, 0, 0]} />
        <mesh position={[0, 0.98, -0.04]} rotation={[-0.12, 0, 0]}><planeGeometry args={[0.26, 0.36]} /><meshStandardMaterial color="#9a9488" roughness={0.6} /></mesh>
        <Lilies p={[0.27, 0.74, 0.05]} />
      </group>}

      {/* lámparas de escuela + guirnalda de lamparitas (wedding / xmas) */}
      {[-0.75, 0.2, 1.15].map((x, i) => <group key={"lamp" + i} position={[x, 0, -0.6]}>
        <mesh position={[0, 2.42, 0]}><cylinderGeometry args={[0.004, 0.004, 0.36, 6]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0, 2.2, 0]}><sphereGeometry args={[0.12, 24, 16]} /><meshStandardMaterial color="#fff6e6" emissive="#ffd9a8" emissiveIntensity={lerp(0.05, 1.1, L)} roughness={0.3} transparent opacity={0.95} /></mesh>
      </group>)}
      {bulbs && Array.from({ length: 34 }, (_, i) => { const x = -2.6 + i * 0.17, y = 2.45 - 0.1 * Math.sin(((i % 11) / 11) * Math.PI);
        return <mesh key={"bl" + i} position={[x, y, -2.85]}><sphereGeometry args={[0.018, 10, 8]} /><meshBasicMaterial color={wed ? "#ffe2a8" : ["#ffd27a", "#ff8a7a", "#9fd0ff", "#a8f0a0"][i % 4]} toneMapped={false} transparent opacity={0.75 + 0.25 * Math.sin(t * 0.9 + i)} /></mesh>; })}
      {/* polvo en el aire de la luz de las ventanas (siempre montado; se mueve lento) */}
      <Motes t={t} map={tx.flake} />
    </ThreeCanvas>
  );
};

// motas lentas en el aire, entre las ventanas y la mesa
const Motes: React.FC<{ t: number; map: Tx }> = ({ t, map }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pts: number[] = [];
  for (let i = 0; i < 140; i++) { const ph = (t * (0.012 + rnd(i, 1) * 0.01) + rnd(i, 2)) % 1; pts.push(-1.5 + rnd(i, 3) * 4 + Math.sin(t * 0.2 + i) * 0.05, 2.3 - ph * 1.9, -2.6 + rnd(i, 4) * 2.4); }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color="#fff4dc" size={0.012} transparent opacity={0.35} depthWrite={false} map={map} alphaMap={map} sizeAttenuation /></points>;
};

// el libro sobre el mantel: tapa con bisagra en el lomo, página derecha con la página REAL
const Book: React.FC<{ open: number; page: THREE.Texture; cover: THREE.Texture; turn?: number; from?: THREE.Texture }> = ({ open, page, cover, turn = 0, from }) => (
  <group position={BOOK}>
    <Box p={[0, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />
    {open > 0.55 && <Box p={[-BW, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />}
    <mesh position={[0, BT + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={page} color="#e6e1d6" toneMapped={false} /></mesh>
    {turn > 0.001 && turn < 0.999 && from && (
      <group position={[-BW / 2, BT + 0.0016, 0]} rotation={[0, 0, turn * Math.PI]}>
        <mesh position={[BW / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={from} color="#e6e1d6" toneMapped={false} /></mesh>
      </group>
    )}
    <group position={[-BW / 2, BT + 0.002, 0]} rotation={[0, 0, open * Math.PI * 0.995]}>
      <Box p={[BW / 2, 0, 0]} s={[BW + 0.006, 0.004, BD + 0.006]} c="#1f3554" r={0.5} rad={0.0015} />
      <mesh position={[BW / 2, 0.0022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={cover} roughness={0.55} /></mesh>
      <mesh position={[BW / 2, -0.0022, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f4efe2" roughness={0.85} /></mesh>
    </group>
  </group>
);
