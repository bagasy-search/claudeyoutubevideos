// ohf30 · EL MUNDO: la casa vieja en corte de maqueta (sala arriba, sótano abajo), compartido por los 4 videos.
// Sala: ventana de guillotina con noche de invierno y nieve, radiador de hierro de columnas abajo (válvula de rueda a la
// izquierda, purgador de bronce arriba a la derecha), zócalo calefactor por la pared izquierda, sillón verde con la mesita,
// la lámpara y el Winter Manual. Sótano: caldera vieja con manómetro, visor de nivel y válvula de seguridad, caños que
// suben al radiador, tanque de expansión y el banco de trabajo. Luces SIEMPRE montadas (rampas, nunca cond && <Light>).
import React, { useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../kits/yanqui3d/fx3d";
import { P } from "./lib";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
type Tx = THREE.Texture | undefined;

// ---------------- puntos fijos ----------------
export const RAD: V3 = [-0.2, 0, -2.74];          // radiador (base, centro)
export const WINDOW: V3 = [-0.2, 1.55, -2.965];    // ventana (centro)
export const BASEB: V3 = [-2.97, 0, -0.8];        // zócalo calefactor (centro, contra la pared izquierda)
export const BOILER: V3 = [1.3, -2.6, -2.42];     // caldera (base)
export const BENCH: V3 = [-1.9, -2.6, -2.55];     // banco de trabajo
export const BOOK: V3 = [0.94, 0.625, -1.92];     // el manual sobre la mesita
const BW = 0.17, BD = 0.22, BT = 0.018;
const RAD_N = 13, RAD_W = 0.062, RAD_G = 0.014, RAD_H = 0.72, RAD_D = 0.2;
const RAD_L = RAD_N * RAD_W + (RAD_N - 1) * RAD_G;

export type Scene = {
  cam: { p: V3; l: V3; fov: number };
  book?: { open: number; page: string };
  heat?: number;      // 0 frío · 1 radiador caliente (brillo tibio + vaho)
  gauge?: number;     // aguja del manómetro (psi, 0-30)
};

// ---------------- texturas pintadas (cache de módulo, deterministas) ----------------
const TXC = new Map<string, THREE.Texture>();
const canv = (k: string, w: number, h: number, rep: [number, number], draw: (g: CanvasRenderingContext2D) => void) => {
  const key = k + rep.join("x"); const c = TXC.get(key); if (c) return c;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; TXC.set(key, t); return t;
};
const useHouseTex = () => useMemo(() => ({
  // papel tapiz salvia con rayas finas y florcitas
  paper: canv("paper", 256, 256, [6, 3], (g) => {
    g.fillStyle = "#8f9a7c"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(240,232,205,.16)"; g.fillRect(x, 0, 3, 256); g.fillStyle = "rgba(60,70,50,.12)"; g.fillRect(x + 14, 0, 1, 256); }
    for (let i = 0; i < 16; i++) { const x = (i % 4) * 64 + 30, y = Math.floor(i / 4) * 64 + 30 + (i % 2) * 20; g.fillStyle = "rgba(232,214,170,.35)"; for (let a = 0; a < 5; a++) { g.beginPath(); g.arc(x + 6 * Math.cos(a * 1.26), y + 6 * Math.sin(a * 1.26), 3.4, 0, 6.3); g.fill(); } g.fillStyle = "rgba(150,80,60,.4)"; g.beginPath(); g.arc(x, y, 2.4, 0, 6.3); g.fill(); }
  }),
  // tablas de pino viejo, encerado
  planks: canv("planks", 512, 512, [4, 4], (g) => {
    for (let r = 0; r < 8; r++) { const v = 118 + rnd(r, 2) * 30; g.fillStyle = `rgb(${v + 22},${v - 18},${v - 58})`; g.fillRect(0, r * 64, 512, 64); g.fillStyle = "rgba(40,20,8,.55)"; g.fillRect(0, r * 64, 512, 2); g.fillRect(((r * 197) % 400) + 40, r * 64, 2, 64);
      for (let i = 0; i < 24; i++) { g.strokeStyle = `rgba(60,30,12,${0.06 + 0.1 * rnd(i, r)})`; g.lineWidth = 1 + 2 * rnd(i, r + 5); g.beginPath(); const y = r * 64 + rnd(i, r + 9) * 64; g.moveTo(0, y); g.bezierCurveTo(170, y + 6 * rnd(i, 4), 340, y - 6 * rnd(i, 6), 512, y + 3); g.stroke(); } }
  }),
  wains: canv("wains", 256, 128, [8, 1], (g) => {
    g.fillStyle = "#e9e0cb"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "rgba(120,100,70,.35)"; g.lineWidth = 3; g.strokeRect(14, 14, 100, 100); g.strokeRect(142, 14, 100, 100);
    g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(16, 16, 96, 4); g.fillRect(144, 16, 96, 4);
  }),
  stone: canv("stone", 512, 256, [4, 2], (g) => {
    g.fillStyle = "#5e5a52"; g.fillRect(0, 0, 512, 256);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) { const v = 85 + rnd(r * 7 + c, 3) * 40, x = c * 88 + (r % 2) * 44 - 20, y = r * 44; g.fillStyle = `rgb(${v + 6},${v},${v - 8})`; g.beginPath(); g.roundRect(x + 3, y + 3, 82, 38, 10); g.fill(); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x + 6, y + 34, 76, 5); }
  }),
  concrete: canv("conc", 256, 256, [5, 5], (g) => {
    g.fillStyle = "#77736b"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1500; i++) { const v = 90 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v},${v - 3},${v - 9},.35)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }),
  rug: canv("rug", 256, 256, [1, 1], (g) => {
    g.fillStyle = "#6e2a24"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#d9b87a"; g.lineWidth = 6; g.strokeRect(14, 14, 228, 228); g.strokeStyle = "#1f3550"; g.lineWidth = 10; g.strokeRect(30, 30, 196, 196);
    g.fillStyle = "#c9a35e"; for (let i = 0; i < 4; i++) { g.save(); g.translate(128, 128); g.rotate(i * Math.PI / 2); g.beginPath(); g.moveTo(0, -60); g.lineTo(26, 0); g.lineTo(0, 60); g.lineTo(-26, 0); g.fill(); g.restore(); }
  }),
  night: canv("night", 256, 384, [1, 1], (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 384); gr.addColorStop(0, "#0d1a33"); gr.addColorStop(0.65, "#28426b"); gr.addColorStop(1, "#c6d3e6"); g.fillStyle = gr; g.fillRect(0, 0, 256, 384);
    g.fillStyle = "#121a26"; g.beginPath(); g.moveTo(0, 300); for (let x = 0; x <= 256; x += 16) g.lineTo(x, 270 + 30 * rnd(x, 2)); g.lineTo(256, 384); g.lineTo(0, 384); g.fill();
    g.fillStyle = "#e9eef6"; g.fillRect(0, 330, 256, 54); g.fillStyle = "rgba(255,214,140,.9)"; g.fillRect(60, 282, 10, 12); g.fillRect(190, 290, 8, 10);
    // escarcha en las esquinas
    for (let i = 0; i < 160; i++) { const a = rnd(i, 4) * 6.3, d = Math.pow(rnd(i, 5), 2) * 70, cx = i % 2 ? 0 : 256, cy = i % 3 ? 384 : 0; g.strokeStyle = "rgba(225,238,255,.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d); g.lineTo(cx + Math.cos(a) * (d + 14), cy + Math.sin(a) * (d + 14)); g.stroke(); }
  }),
  gauge: canv("gauge", 256, 256, [1, 1], (g) => {
    g.fillStyle = "#f3eee2"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill(); g.strokeStyle = "#222"; g.lineWidth = 3;
    for (let i = 0; i <= 30; i++) { const a = (-225 + i * 9) * Math.PI / 180, r0 = i % 5 ? 100 : 88; g.beginPath(); g.moveTo(128 + Math.cos(a) * r0, 128 + Math.sin(a) * r0); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); }
    g.fillStyle = "#1c1c1c"; g.font = "700 22px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 0; i <= 30; i += 10) { const a = (-225 + i * 9) * Math.PI / 180; g.fillText(String(i), 128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70); }
    g.fillStyle = "rgba(60,140,70,.55)"; g.beginPath(); g.arc(128, 128, 108, (-225 + 12 * 9) * Math.PI / 180, (-225 + 15 * 9) * Math.PI / 180); g.arc(128, 128, 92, (-225 + 15 * 9) * Math.PI / 180, (-225 + 12 * 9) * Math.PI / 180, true); g.fill();
    g.font = "700 18px Arial"; g.fillText("PSI", 128, 186);
  }),
  enamel: canv("enamel", 128, 256, [1, 1], (g) => {
    g.fillStyle = "#5f6d5c"; g.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${120 + rnd(i, 2) * 60},${70 + rnd(i, 3) * 30},30,${0.12 + 0.2 * rnd(i, 4)})`; g.beginPath(); g.arc(rnd(i, 5) * 128, 180 + rnd(i, 6) * 76, 1 + rnd(i, 7) * 5, 0, 6.3); g.fill(); }
  }),
}), []);

// las páginas REALES del manual (public/<slug>/book_p001.jpg = tapa, book_cta.jpg = el capítulo del video)
const PAGES = ["001", "cta"];
const usePages = () => {
  const [h] = useState(() => delayRender("páginas del manual"));
  return useMemo(() => {
    let n = PAGES.length;
    const done = () => { n -= 1; if (n === 0) continueRender(h); };
    const L = new THREE.TextureLoader();
    return Object.fromEntries(PAGES.map((pg) => {
      const tx = L.load(staticFile(P + "book_" + (pg === "cta" ? "cta" : "p001") + ".jpg"), done, undefined, done);
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return [pg, tx];
    })) as Record<string, THREE.Texture>;
  }, [h]);
};

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V3; cast?: boolean }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, map, rad = 0.012, rot, cast = true }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], Math.min(rad, s[0] / 2.1, s[1] / 2.1, s[2] / 2.1))}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} />
  </mesh>
);
const Pipe: React.FC<{ a: V3; b: V3; r?: number; c?: string; m?: number }> = ({ a, b, r = 0.022, c = "#4a4d50", m = 0.7 }) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), mid = va.clone().add(vb).multiplyScalar(0.5), len = va.distanceTo(vb);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  return <mesh position={mid} quaternion={q} castShadow receiveShadow><cylinderGeometry args={[r, r, len, 20]} /><meshStandardMaterial color={c} metalness={m} roughness={0.42} /></mesh>;
};
const Elbow: React.FC<{ p: V3; r?: number; c?: string }> = ({ p, r = 0.03, c = "#4a4d50" }) => <mesh position={p} castShadow><sphereGeometry args={[r, 16, 12]} /><meshStandardMaterial color={c} metalness={0.7} roughness={0.42} /></mesh>;
const dot = () => canv("dot", 64, 64, [1, 1], (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.5, "rgba(255,255,255,.6)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
const Puffs: React.FC<{ pts: number[]; col: string; size: number; o: number; round?: boolean }> = ({ pts, col, size, o }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color={col} size={size} transparent opacity={o} depthWrite={false} sizeAttenuation map={dot()} alphaMap={dot()} /></points>;
};

// columna del radiador: perfil torneado (cintura en el medio, cabezas redondas)
const COL_G = (() => {
  const pts = [[0, 0], [0.026, 0], [0.031, 0.02], [0.031, 0.06], [0.024, 0.09], [0.022, RAD_H - 0.12], [0.03, RAD_H - 0.07], [0.031, RAD_H - 0.03], [0.022, RAD_H], [0, RAD_H]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, 28); g.scale(1, 1, RAD_D / 0.062); return g;
})();
export const Radiator: React.FC<{ heat: number; t: number }> = ({ heat, t }) => {
  const x0 = -RAD_L / 2 + RAD_W / 2;
  return <group position={RAD}>
    {Array.from({ length: RAD_N }, (_, i) => <mesh key={i} geometry={COL_G} position={[x0 + i * (RAD_W + RAD_G), 0.06, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#b9b29f" metalness={0.55} roughness={0.42} emissive="#ff8a3a" emissiveIntensity={0.05 * heat} /></mesh>)}
    {/* cabezales que unen las columnas, arriba y abajo */}
    {[0.11, RAD_H - 0.02].map((y, i) => <Box key={i} p={[0, y, 0]} s={[RAD_L - 0.01, 0.045, 0.05]} c="#aea793" m={0.5} r={0.45} rad={0.02} />)}
    {/* patas */}
    {[-1, 1].map((sx) => <Box key={sx} p={[sx * (RAD_L / 2 - 0.05), 0.03, 0]} s={[0.05, 0.06, 0.16]} c="#8f8a7b" m={0.5} r={0.5} />)}
    {/* válvula de rueda (entrada) abajo a la izquierda, con el caño que baja al piso */}
    <Pipe a={[-RAD_L / 2 - 0.08, 0.12, 0]} b={[-RAD_L / 2, 0.12, 0]} r={0.024} c="#5a5650" />
    <group position={[-RAD_L / 2 - 0.1, 0.12, 0]}>
      <mesh castShadow><sphereGeometry args={[0.04, 20, 14]} /><meshStandardMaterial color="#b88a3a" metalness={1} roughness={0.3} /></mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.008, 0.008, 0.08, 10]} /><meshStandardMaterial color="#b88a3a" metalness={1} roughness={0.3} /></mesh>
      <mesh position={[0, 0.115, 0]} rotation={[0, t * 0.0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.022, 24]} /><meshStandardMaterial color="#1b1b1b" roughness={0.35} /></mesh>
    </group>
    <Pipe a={[-RAD_L / 2 - 0.1, 0.09, 0]} b={[-RAD_L / 2 - 0.1, -0.01, 0]} r={0.024} c="#5a5650" />
    {/* purgador de bronce arriba a la derecha */}
    <group position={[RAD_L / 2 + 0.02, RAD_H - 0.02, 0.0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.04, 16]} /><meshStandardMaterial color="#c9973f" metalness={1} roughness={0.25} /></mesh>
      <mesh position={[0.024, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.012, 6]} /><meshStandardMaterial color="#d9a84a" metalness={1} roughness={0.2} /></mesh>
    </group>
  </group>;
};

// ventana de guillotina de 2 hojas (2 sobre 2) con la noche de invierno detrás y nieve que cae
const Sash: React.FC<{ y: number; z: number; night: THREE.Texture; v0: number }> = ({ y, z, night, v0 }) => {
  const w = 0.86, h = 0.66, f = 0.045;
  const tex = useMemo(() => { const t = night.clone(); t.needsUpdate = true; t.repeat.set(1, 0.5); t.offset.set(0, v0); return t; }, [night, v0]);
  return <group position={[0, y, z]}>
    <mesh><planeGeometry args={[w - f, h - f]} /><meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.15} /></mesh>
    {[[0, h / 2, w, f], [0, -h / 2, w, f], [0, 0, w, 0.02]].map(([x, yy, ww, hh], i) => <Box key={"h" + i} p={[x, yy, 0.012]} s={[ww, hh, 0.04]} c="#efe8da" r={0.55} rad={0.004} />)}
    {[[-w / 2, 0, f, h], [w / 2, 0, f, h], [0, 0, 0.02, h]].map(([x, yy, ww, hh], i) => <Box key={"v" + i} p={[x, yy, 0.012]} s={[ww, hh, 0.04]} c="#efe8da" r={0.55} rad={0.004} />)}
  </group>;
};
const WindowFrame: React.FC<{ t: number; night: THREE.Texture }> = ({ t, night }) => {
  const snow: number[] = [];
  for (let i = 0; i < 140; i++) { const ph = (t * (0.08 + rnd(i, 1) * 0.06) + rnd(i, 2)) % 1; snow.push(WINDOW[0] + (rnd(i, 3) - 0.5) * 0.76 + 0.03 * Math.sin(t * 0.6 + i), WINDOW[1] + 0.62 - ph * 1.26, WINDOW[2] + 0.004 + rnd(i, 4) * 0.006); }
  return <>
    <group position={WINDOW}>
      <Sash y={0.34} z={0.0} night={night} v0={0.5} />
      <Sash y={-0.33} z={0.03} night={night} v0={0} />
      {/* marco, contramarco y alféizar */}
      {[[-0.5, 0, 0.08, 1.48], [0.5, 0, 0.08, 1.48]].map(([x, y, w, h], i) => <Box key={"j" + i} p={[x, y, 0.03]} s={[w, h, 0.09]} c="#f2ebdc" r={0.5} />)}
      <Box p={[0, 0.74, 0.03]} s={[1.12, 0.1, 0.09]} c="#f2ebdc" r={0.5} />
      <Box p={[0, -0.7, 0.09]} s={[1.18, 0.04, 0.2]} c="#efe6d4" r={0.45} />
      <Box p={[0, -0.75, 0.04]} s={[1.08, 0.08, 0.06]} c="#e9dfca" r={0.5} />
      {/* cerrojo de bronce en el encuentro */}
      <Box p={[0, 0.0, 0.07]} s={[0.07, 0.018, 0.03]} c="#c9973f" m={1} r={0.25} rad={0.006} />
      {/* cortinas */}
      {[-0.66, 0.66].map((x, i) => <mesh key={"cu" + i} position={[x, 0.05, 0.12]} castShadow><boxGeometry args={[0.24, 1.75, 0.03]} /><meshStandardMaterial color="#7d2f2a" roughness={0.9} /></mesh>)}
      <Box p={[0, 0.92, 0.13]} s={[1.7, 0.03, 0.03]} c="#6b4a2a" m={0.3} r={0.5} />
    </group>
    <Puffs pts={snow} col="#f4f8ff" size={0.007} o={0.75} round />
  </>;
};

const BaseboardHeater: React.FC = () => <group position={BASEB}>
  <Box p={[0.04, 0.1, 0]} s={[0.08, 0.2, 2.6]} c="#dcd6c7" m={0.3} r={0.45} rad={0.01} />
  {/* rejilla de arriba (la salida del aire tibio) */}
  {Array.from({ length: 40 }, (_, i) => <Box key={i} p={[0.05, 0.201, -1.25 + i * 0.064]} s={[0.05, 0.004, 0.04]} c="#5a564c" r={0.6} rad={0.001} cast={false} />)}
  {/* tapa del extremo */}
  <Box p={[0.045, 0.1, 1.31]} s={[0.09, 0.21, 0.03]} c="#cfc8b6" m={0.35} r={0.4} rad={0.008} />
  {/* caño de cobre que asoma por el piso */}
  <Pipe a={[0.04, 0.05, 1.36]} b={[0.04, -0.01, 1.36]} r={0.012} c="#b5673a" m={1} />
</group>;

const Armchair: React.FC = () => <group position={[1.62, 0, -1.6]} rotation={[0, -0.75, 0]}>
  <Box p={[0, 0.25, 0]} s={[0.78, 0.26, 0.74]} c="#3f5a3a" r={0.9} rad={0.06} />
  <Box p={[0, 0.42, 0.04]} s={[0.6, 0.1, 0.6]} c="#476544" r={0.92} rad={0.05} />
  <Box p={[0, 0.72, -0.32]} s={[0.76, 0.66, 0.16]} c="#3f5a3a" r={0.9} rad={0.07} />
  {[-0.36, 0.36].map((x) => <Box key={x} p={[x, 0.5, 0.0]} s={[0.12, 0.26, 0.72]} c="#3a5435" r={0.9} rad={0.05} />)}
  {[[-0.3, -0.28], [0.3, -0.28], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => <Box key={i} p={[x, 0.05, z]} s={[0.05, 0.1, 0.05]} c="#3b2614" r={0.5} />)}
  {/* manta tejida doblada en el brazo */}
  <Box p={[0.36, 0.66, 0.1]} s={[0.16, 0.05, 0.4]} c="#c9a86a" r={0.95} rad={0.02} />
</group>;

const SideTable: React.FC<{ lamp: number }> = ({ lamp }) => <group position={[1.02, 0, -2.0]}>
  <mesh position={[0, 0.6, 0]} castShadow receiveShadow><cylinderGeometry args={[0.26, 0.26, 0.03, 40]} /><meshStandardMaterial color="#5a3a20" roughness={0.45} /></mesh>
  <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.03, 0.04, 0.58, 16]} /><meshStandardMaterial color="#4a2f19" roughness={0.5} /></mesh>
  <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.16, 0.18, 0.04, 24]} /><meshStandardMaterial color="#4a2f19" roughness={0.5} /></mesh>
  {/* lámpara de pantalla plisada */}
  <group position={[0.14, 0.615, -0.14]}>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.06, 0.075, 0.08, 24]} /><meshStandardMaterial color="#8a6a3a" metalness={0.6} roughness={0.35} /></mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.012, 0.012, 0.25, 10]} /><meshStandardMaterial color="#b89a5a" metalness={0.9} roughness={0.3} /></mesh>
    <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.09, 0.15, 0.18, 32, 1, true]} /><meshStandardMaterial color="#efe0bd" roughness={0.8} side={THREE.DoubleSide} emissive="#ffcf8a" emissiveIntensity={0.55 * lamp} /></mesh>
  </group>
  {/* taza de café */}
  <mesh position={[0.17, 0.66, 0.11]} castShadow><cylinderGeometry args={[0.035, 0.03, 0.08, 24]} /><meshStandardMaterial color="#f4f1ea" roughness={0.2} /></mesh>
</group>;

const Book: React.FC<{ open: number; page: THREE.Texture; cover: THREE.Texture }> = ({ open, page, cover }) => (
  <group position={BOOK} rotation={[0, 0.25, 0]}>
    <Box p={[0, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />
    {open > 0.55 && <Box p={[-BW, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />}
    <mesh position={[0, BT + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={page} color="#e6e1d6" toneMapped={false} /></mesh>
    <group position={[-BW / 2, BT + 0.002, 0]} rotation={[0, 0, open * Math.PI * 0.995]}>
      <Box p={[BW / 2, 0, 0]} s={[BW + 0.006, 0.004, BD + 0.006]} c="#1d2b3a" r={0.5} rad={0.0015} />
      <mesh position={[BW / 2, 0.0022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={cover} roughness={0.55} /></mesh>
      <mesh position={[BW / 2, -0.0022, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f4efe2" roughness={0.85} /></mesh>
    </group>
  </group>
);

// ---------------- sótano ----------------
const Boiler: React.FC<{ t: number; gauge: number; tx: ReturnType<typeof useHouseTex> }> = ({ t, gauge, tx }) => {
  const [bx, by, bz] = BOILER, fl = 0.85 + 0.15 * Math.sin(t * 1.7) * Math.sin(t * 1.1);
  const nd = (-225 + cl(gauge / 30) * 270) * Math.PI / 180 + 0.01 * Math.sin(t * 1.3);
  return <group position={[bx, by, bz]}>
    <Box p={[0, 0.58, 0]} s={[0.78, 1.16, 0.62]} c="#ffffff" map={tx.enamel} r={0.5} m={0.15} rad={0.03} />
    <Box p={[0, 0.03, 0]} s={[0.84, 0.06, 0.68]} c="#2a2a2a" r={0.7} />
    {[0.42, 0.74].map((y) => <Box key={y} p={[0, y, 0.312]} s={[0.76, 0.008, 0.006]} c="#3a4438" r={0.6} rad={0.002} cast={false} />)}
    <Box p={[0.0, 0.31, 0.314]} s={[0.24, 0.08, 0.004]} c="#c9a24a" m={1} r={0.3} rad={0.003} cast={false} />
    <Box p={[-0.26, 0.56, 0.314]} s={[0.05, 0.12, 0.01]} c="#2a2a2a" r={0.5} rad={0.004} />
    <Pipe a={[0.15, 1.16, -0.15]} b={[0.15, 1.42, -0.15]} r={0.075} c="#6e6a62" />
    <Elbow p={[0.15, 1.42, -0.15]} r={0.078} c="#6e6a62" />
    <Pipe a={[0.15, 1.42, -0.15]} b={[0.15, 1.42, -0.58]} r={0.075} c="#6e6a62" />
    {/* mirilla del quemador: luz baja que respira lento (≤2 Hz) */}
    <Box p={[0.12, 0.18, 0.312]} s={[0.12, 0.06, 0.01]} c="#ff9a3a" e="#ff7a1a" ei={1.2 * fl} r={0.4} rad={0.004} cast={false} />
    {/* manómetro (presión y temperatura) */}
    <group position={[-0.2, 0.92, 0.32]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.03, 40]} /><meshStandardMaterial color="#c9a24a" metalness={1} roughness={0.3} /></mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.075, 40]} /><meshStandardMaterial map={tx.gauge} roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.02]} rotation={[0, 0, nd + Math.PI / 2]}><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.005, 0.062, 0.002]} /><meshStandardMaterial color="#b3261e" /></mesh></mesh>
      <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.078, 40]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
    </group>
    {/* visor de nivel (sight glass): tubo de vidrio con el agua por la mitad */}
    <group position={[0.43, 0.78, 0.2]}>
      <mesh><cylinderGeometry args={[0.012, 0.012, 0.22, 16]} /><meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.3} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.009, 0.009, 0.11, 16]} /><meshStandardMaterial color="#7fb7d8" transparent opacity={0.8} emissive="#1d4a66" emissiveIntensity={0.4} /></mesh>
      {[-0.12, 0.12].map((y) => <Box key={y} p={[0, y, 0]} s={[0.04, 0.03, 0.04]} c="#c9973f" m={1} r={0.3} rad={0.006} />)}
    </group>
    {/* válvula de seguridad con palanca, arriba (no se toca) */}
    <group position={[0.22, 1.2, 0.05]}>
      <mesh castShadow><cylinderGeometry args={[0.035, 0.04, 0.09, 20]} /><meshStandardMaterial color="#c9973f" metalness={1} roughness={0.3} /></mesh>
      <Box p={[0.05, 0.06, 0]} s={[0.12, 0.012, 0.02]} c="#a8792e" m={1} r={0.3} rad={0.004} />
    </group>
    {/* caño de alimentación: sube por detrás hasta el radiador de la sala */}
    <Pipe a={[-0.25, 1.16, -0.1]} b={[-0.25, 1.75, -0.1]} r={0.03} c="#3e4042" />
    <Elbow p={[-0.25, 1.75, -0.1]} r={0.034} c="#3e4042" />
  </group>;
};
const Bench: React.FC = () => <group position={BENCH}>
  <Box p={[0, 0.85, 0]} s={[1.4, 0.06, 0.62]} c="#8a6238" r={0.75} />
  {[[-0.64, -0.26], [0.64, -0.26], [-0.64, 0.26], [0.64, 0.26]].map(([x, z], i) => <Box key={i} p={[x, 0.42, z]} s={[0.07, 0.84, 0.07]} c="#6b4a2a" r={0.7} />)}
  <Box p={[0, 0.25, 0]} s={[1.3, 0.04, 0.55]} c="#7a5631" r={0.75} />
  {/* tablero perforado con herramientas */}
  <Box p={[0, 1.42, -0.28]} s={[1.3, 0.9, 0.03]} c="#b48d5e" r={0.85} />
  <Box p={[-0.35, 1.5, -0.25]} s={[0.04, 0.32, 0.02]} c="#9aa0a6" m={0.9} r={0.3} rad={0.006} />
  <Box p={[-0.15, 1.55, -0.25]} s={[0.05, 0.26, 0.02]} c="#b3261e" r={0.5} rad={0.008} />
  <Box p={[0.15, 1.45, -0.25]} s={[0.22, 0.04, 0.02]} c="#4d5258" m={0.8} r={0.35} rad={0.008} />
  <mesh position={[0.42, 1.48, -0.24]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.012, 10, 28]} /><meshStandardMaterial color="#e2c23a" roughness={0.5} /></mesh>
  {/* cajonera chica con el cajón de la llavecita */}
  <Box p={[0.45, 0.94, -0.12]} s={[0.36, 0.12, 0.26]} c="#5e4024" r={0.6} />
  {[-0.1, 0.0, 0.1].map((x) => <Box key={x} p={[0.45 + x, 0.94, 0.012]} s={[0.08, 0.06, 0.01]} c="#7a5631" r={0.6} rad={0.004} />)}
</group>;

// ---------------- mundo ----------------
const Cam: React.FC<{ p: V3; l: V3; fov: number }> = ({ p, l, fov }) => {
  const { camera } = useThree();
  camera.position.set(p[0], p[1], p[2]); camera.lookAt(l[0], l[1], l[2]);
  (camera as THREE.PerspectiveCamera).fov = fov; (camera as THREE.PerspectiveCamera).near = 0.02; (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  return null;
};

export const HouseWorld: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useHouseTex(), pg = usePages();
  const heat = cl(sc.heat ?? 0.6), lamp = 1, below = cl((1.2 - sc.cam.p[1]) / 1.4);
  // vaho tibio que sube del radiador cuando calienta
  const haze: number[] = [];
  for (let i = 0; i < 90; i++) { const ph = (t * (0.18 + rnd(i, 5) * 0.1) + rnd(i, 6)) % 1; haze.push(RAD[0] + (rnd(i, 7) - 0.5) * RAD_L, RAD[1] + RAD_H + ph * 0.7, RAD[2] + 0.05 + ph * 0.18); }
  const dust: number[] = [];
  for (let i = 0; i < 70; i++) { const ph = (t * 0.02 + rnd(i, 8)) % 1; dust.push(-2 + rnd(i, 9) * 4.5, -2.4 + ph * 2.0, -2.6 + rnd(i, 10) * 3); }
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam {...sc.cam} />
      <Post bloom={0.24} threshold={0.9} exposure={0.86} env={0.22} />
      <color attach="background" args={["#0b0d11"]} />
      <fog attach="fog" args={["#0b0d11", 6, 16]} />
      <hemisphereLight args={["#dfe4ee", "#5a4632", 0.2]} />
      {/* luna fría por la ventana */}
      <directionalLight position={[-0.4, 3.4, -6]} intensity={0.55} color="#9fb6dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-camera-far={20} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* lámpara de la mesita (cálida) */}
      <pointLight position={[1.16, 1.0, -2.14]} intensity={1.6 * lamp} distance={5} color="#ffc887" decay={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[1.4, 2.3, 1.6]} intensity={0.55} distance={8} color="#ffe6c4" decay={1.6} />
      {/* el radiador tibio: luz naranja muy suave que sube por la pared */}
      <pointLight position={[RAD[0], 0.5, RAD[2] + 0.35]} intensity={0.5 * heat} distance={1.8} color="#ff9c5a" decay={1.8} />
      {/* sótano: foco pelado + brillo de la caldera */}
      <pointLight position={[-0.4, -0.55, -1.6]} intensity={1.5} distance={5.5} color="#ffd59a" decay={1.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[BOILER[0] + 0.12, BOILER[1] + 0.25, BOILER[2] + 0.6]} intensity={0.6 + 0.08 * Math.sin(t * 1.7)} distance={1.6} color="#ff8a3a" decay={1.8} />
      <pointLight position={[0.2, -1.4, 1.4]} intensity={0.35 + 0.25 * below} distance={6} color="#cfd8e6" decay={1.6} />

      {/* ===== sala ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0, -0.3]} receiveShadow><planeGeometry args={[6.6, 5.6]} /><meshStandardMaterial map={tx.planks} roughness={0.5} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.1]} position={[0.6, 0.004, -1.3]} receiveShadow><planeGeometry args={[2.2, 1.6]} /><meshStandardMaterial map={tx.rug} roughness={0.95} /></mesh>
      <mesh position={[0.2, 1.75, -3]} receiveShadow><planeGeometry args={[6.6, 1.9]} /><meshStandardMaterial map={tx.paper} roughness={0.95} /></mesh>
      <mesh position={[0.2, 0.4, -2.995]} receiveShadow><planeGeometry args={[6.6, 0.8]} /><meshStandardMaterial map={tx.wains} roughness={0.7} /></mesh>
      <mesh position={[-3.05, 1.75, -0.3]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[5.6, 1.9]} /><meshStandardMaterial map={tx.paper} roughness={0.95} /></mesh>
      <mesh position={[-3.045, 0.4, -0.3]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[5.6, 0.8]} /><meshStandardMaterial map={tx.wains} roughness={0.7} /></mesh>
      <Box p={[0.2, 0.82, -2.975]} s={[6.6, 0.05, 0.05]} c="#cdbf9f" r={0.5} />
      <Box p={[-3.03, 0.82, -0.3]} s={[0.05, 0.05, 5.6]} c="#cdbf9f" r={0.5} />
      <Box p={[0.2, 0.05, -2.98]} s={[6.6, 0.1, 0.03]} c="#5a3a20" r={0.6} />
      {/* cuadro en la pared */}
      <Box p={[1.85, 1.75, -2.97]} s={[0.5, 0.38, 0.03]} c="#6b4a2a" r={0.5} />
      <Box p={[1.85, 1.75, -2.952]} s={[0.42, 0.3, 0.01]} c="#a7b39a" r={0.9} rad={0.002} />
      <Radiator heat={heat} t={t} />
      <WindowFrame t={t} night={tx.night} />
      <BaseboardHeater />
      <Armchair />
      <SideTable lamp={lamp} />
      {sc.book && <Book open={sc.book.open} page={pg[sc.book.page] ?? pg.cta} cover={pg["001"]} />}
      <Puffs pts={haze} col="#ffe8cf" size={0.03} o={0.06 + 0.1 * heat} />

      {/* ===== losa en corte (canto claro) ===== */}
      <Box p={[0.2, -0.137, -0.3]} s={[6.6, 0.26, 5.6]} c="#a99c84" r={0.9} rad={0.004} />
      <Box p={[0.2, -0.13, 2.5]} s={[6.6, 0.27, 0.02]} c="#b8ab92" r={1} rad={0.002} cast={false} />
      {/* vigas del techo del sótano */}
      {Array.from({ length: 9 }, (_, i) => <Box key={"j" + i} p={[-2.6 + i * 0.62, -0.36, -0.3]} s={[0.08, 0.2, 5.5]} c="#7a5a36" r={0.8} />)}

      {/* ===== sótano ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -2.6, -0.3]} receiveShadow><planeGeometry args={[6.6, 5.6]} /><meshStandardMaterial map={tx.concrete} roughness={0.85} /></mesh>
      <mesh position={[0.2, -1.43, -3]} receiveShadow><planeGeometry args={[6.6, 2.34]} /><meshStandardMaterial map={tx.stone} roughness={0.95} /></mesh>
      <mesh position={[-3.05, -1.43, -0.3]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[5.6, 2.34]} /><meshStandardMaterial map={tx.stone} roughness={0.95} /></mesh>
      <Boiler t={t} gauge={sc.gauge ?? 13} tx={tx} />
      {/* caño principal por el techo del sótano, del cabezal de la caldera al radiador de arriba */}
      <Pipe a={[BOILER[0] - 0.25, -0.85, BOILER[2] - 0.1]} b={[RAD[0] - RAD_L / 2 - 0.1, -0.85, BOILER[2] - 0.1]} r={0.03} c="#3e4042" />
      <Elbow p={[RAD[0] - RAD_L / 2 - 0.1, -0.85, BOILER[2] - 0.1]} r={0.034} c="#3e4042" />
      <Pipe a={[RAD[0] - RAD_L / 2 - 0.1, -0.85, BOILER[2] - 0.1]} b={[RAD[0] - RAD_L / 2 - 0.1, 0.0, RAD[2]]} r={0.026} c="#3e4042" />
      {/* retorno, más bajo */}
      <Pipe a={[BOILER[0] + 0.35, -2.3, BOILER[2] + 0.1]} b={[-2.4, -2.3, BOILER[2] + 0.1]} r={0.022} c="#55585b" />
      {/* tanque de expansión colgado */}
      <group position={[0.35, -0.72, -2.55]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.14, 0.14, 0.6, 28]} /><meshStandardMaterial color="#8d9196" metalness={0.5} roughness={0.45} /></mesh>
        <Pipe a={[0, -0.14, 0]} b={[0, -0.4, 0]} r={0.012} />
      </group>
      <Bench />
      {/* foco pelado colgando */}
      <mesh position={[-0.4, -0.5, -1.6]}><sphereGeometry args={[0.035, 16, 12]} /><meshBasicMaterial color="#fff1cf" toneMapped={false} /></mesh>
      <mesh position={[-0.4, -0.4, -1.6]}><cylinderGeometry args={[0.003, 0.003, 0.2, 6]} /><meshStandardMaterial color="#222" /></mesh>
      <Puffs pts={dust} col="#ffe6c0" size={0.008} o={0.35} />
    </ThreeCanvas>
  );
};
