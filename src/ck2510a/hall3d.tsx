// ck2510a · EL MUNDO: el salón del sótano de la iglesia (Iowa) la mañana de un funeral. Una sola escena 3D, cámara por toma.
// Mesa larga con mantel blanco y las SIETE fuentes tapadas en papel aluminio, cada una con su tarjetita doblada con el apellido
// (Kettleson · Loretta · Ohnstad · Thorson · Lindgren · Brekke · Sorensen) · la escalera con la puerta de arriba que se abre ·
// la ventana de la cocina con las fuentes de repuesto al calor · la mesa principal de la familia · la cafetera grande · el reloj
// a las 10:45 · el libro "Loretta's Church Supper Cookbook" con sus páginas REALES. Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export type V3 = [number, number, number];
type Tx = THREE.Texture | undefined;

// ---------------- puntos fijos ----------------
export const TABLE_Z = -0.8, TABLE_Y = 0.762;
export const PAN = (i: number): V3 => [-1.8 + i * 0.6, TABLE_Y, TABLE_Z];        // i = 0..6
export const CARD = (i: number): V3 => [PAN(i)[0], TABLE_Y + 0.035, TABLE_Z + 0.2];
export const NAMES = ["KETTLESON", "LORETTA", "OHNSTAD", "THORSON", "LINDGREN", "BREKKE", "SORENSEN"];
export const DOOR: V3 = [3.05, 1.46, -3.45];
export const CLOCK: V3 = [-0.6, 2.05, -3.47];
export const BOOK: V3 = [0.78, 0.762, -2.42];   // sobre la mesa de la familia
export const URN: V3 = [2.2, TABLE_Y, -0.72];
export const SERVE: V3 = [-3.95, 1.2, -1.2];   // ventana de la cocina (pared izquierda)
export const HEAD: V3 = [0.2, 0.76, -2.55];     // mesa de la familia
export const PT = { pan: PAN, card: CARD, door: DOOR, clock: CLOCK, book: BOOK, urn: URN, serve: SERVE, head: HEAD };

// ---------------- cámara ----------------
export type Cam = { p: V3; l: V3; fov: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9): Cam => {
  const k = sm(u / dur);
  const p = mix(p0, p1, k);
  // respiración de cámara en mano, lenta (CamaraMano), nunca temblor
  p[0] += Math.sin(u * 0.7) * 0.004; p[1] += Math.sin(u * 0.93 + 1) * 0.003;
  return { p, l: mix(l0, l1, k), fov: f0 + (f1 - f0) * k };
};
export const project = (c: Cam, q: V3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 600); cam.position.copy(v3(c.p)); cam.lookAt(v3(c.l)); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
const CamSet: React.FC<{ k: Cam }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(v3(k.p)); c.up.set(0, 1, 0); c.lookAt(v3(k.l)); c.fov = k.fov; c.near = 0.02; c.far = 600; c.updateProjectionMatrix();
  return null;
};

// ---------------- ESCENA = cámara + estado ----------------
export type Scene = {
  cam: Cam;
  pans?: number;          // cuántas fuentes hay en la mesa (0-7), en orden
  setting?: number;       // 0-1: la fuente número `pans` está bajando a la mesa (la están dejando)
  open?: number[];        // 0-1 por fuente: el papel aluminio levantado
  hi?: number;            // fuente resaltada (0-6) — las otras se apagan un poco
  door?: number;          // 0-1 la puerta de arriba de la escalera
  book?: { open: number; page: string; turn?: number; from?: string };
  empty?: boolean;        // fuentes vacías, lavadas, con la tarjeta adentro (vuelven a casa)
  coffee?: number;        // vapor de la cafetera
  dim?: number;           // 0 = luz de mañana · 1 = tarde, sólo la luz de la cocina
};
const PAGES = ["001", "028", "030", "031", "032", "033", "034", "035", "036"];
const usePages = () => {
  const [h] = useState(() => delayRender("páginas del libro"));
  return useMemo(() => {
    let n = PAGES.length;
    const done = () => { n -= 1; if (n === 0) continueRender(h); };
    const L = new THREE.TextureLoader();
    return Object.fromEntries(PAGES.map((pg) => {
      const tx = L.load(staticFile(`ck2510a/book_p${pg}.jpg`), done, undefined, done);
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return [pg, tx];
    })) as Record<string, THREE.Texture>;
  }, [h]);
};

// ---------------- geometría ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, cast = true, map, rad = 0.012, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} />
  </mesh>
);
const Chrome: React.FC<{ p: V3; s: V3; rot?: V3 }> = ({ p, s, rot }) => <Box p={p} s={s} c="#e8ecf0" r={0.14} m={1} rad={Math.min(s[0], s[1], s[2]) / 2.2} rot={rot} />;
const Puffs: React.FC<{ pts: number[]; col: string; size: number; o: number; map?: Tx }> = ({ pts, col, size, o, map }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color={col} size={size} transparent opacity={o} depthWrite={false} map={map} alphaMap={map} sizeAttenuation /></points>;
};
// mantel con caída
const clothGeo = (w: number, d: number, drop: number) => {
  const g = new THREE.PlaneGeometry(w + 2 * drop, d + 2 * drop, 160, 40);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const ox = Math.max(0, Math.abs(x) - w / 2), oy = Math.max(0, Math.abs(y) - d / 2), o = Math.max(ox, oy);
    if (o <= 0) continue;
    const fold = 0.012 * Math.min(1, o / 0.08) * Math.sin((ox > oy ? y : x) * 40 + (ox > oy ? 1 : 2));
    const nx = ox > 0 ? Math.sign(x) * (w / 2 + 0.006 + (ox >= oy ? fold : 0)) : x;
    const ny = oy > 0 ? Math.sign(y) * (d / 2 + 0.006 + (oy > ox ? fold : 0)) : y;
    p.setX(i, nx); p.setY(i, ny); p.setZ(i, -o + 0.002);
  }
  g.computeVertexNormals(); return g;
};
const LONG = clothGeo(5.2, 0.78, 0.3);
const HEADC = clothGeo(1.8, 0.7, 0.3);

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const crustTex = (base: string, dark: string, light: string, n = 260) => mk(256, 256, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < n; i++) { const r = 2 + rnd(i, 1) * 9; g.fillStyle = rnd(i, 2) > 0.55 ? dark : light; g.globalAlpha = 0.35 + 0.4 * rnd(i, 3); g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, r, r * (0.6 + rnd(i, 6) * 0.6), rnd(i, 7) * 3, 0, 6.3); g.fill(); }
  g.globalAlpha = 1;
});
const cardTex = (name: string) => mk(512, 256, (g) => {
  g.fillStyle = "#fbf8ee"; g.fillRect(0, 0, 512, 256);
  g.strokeStyle = "rgba(200,80,80,.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 62); g.lineTo(512, 62); g.stroke();
  g.strokeStyle = "rgba(120,150,190,.35)"; g.lineWidth = 1; for (let y = 96; y < 256; y += 34) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  g.fillStyle = "#22304a"; g.font = "italic 700 74px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(name === "LORETTA" ? "Loretta" : name[0] + name.slice(1).toLowerCase(), 256, 150);
});
const useHallTex = () => useMemo(() => ({
  // baldosas de vinilo crema y gris, gastadas
  tile: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = (r + c) % 2 ? "#d9d3c4" : "#bdb6a6"; g.fillRect(c * 64, r * 64, 64, 64); }
    for (let i = 0; i < 1200; i++) { g.fillStyle = `rgba(90,80,60,${0.07 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
  }, [14, 12]),
  // boiserie de madera (mitad de abajo de la pared)
  panel: mk(512, 256, (g) => {
    g.fillStyle = "#7a5131"; g.fillRect(0, 0, 512, 256);
    for (let x = 0; x < 512; x += 64) { g.fillStyle = "rgba(40,22,10,.45)"; g.fillRect(x, 0, 3, 256); }
    for (let i = 0; i < 400; i++) { g.strokeStyle = `rgba(${rnd(i, 1) > 0.5 ? "50,28,12" : "150,100,60"},${0.12 * rnd(i, 2)})`; g.lineWidth = 1; const x = rnd(i, 3) * 512; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 6, 80, x - 6, 170, x + 3, 256); g.stroke(); }
  }, [6, 1]),
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#ece6d6"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(150,130,100,${0.05 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 2 + rnd(i, 5) * 6, 0, 6.3); g.fill(); }
  }, [5, 1]),
  ceil: mk(256, 256, (g) => {
    g.fillStyle = "#efece4"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,110,100,${0.12 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
    g.strokeStyle = "#c9c4b8"; g.lineWidth = 6; g.strokeRect(0, 0, 256, 256);
  }, [12, 10]),
  cloth: mk(1024, 256, (g) => {
    g.fillStyle = "#f5f2ea"; g.fillRect(0, 0, 1024, 256);
    for (let y = 0; y < 256; y += 3) { g.fillStyle = `rgba(190,180,160,${0.07 + 0.04 * rnd(y, 1)})`; g.fillRect(0, y, 1024, 1); }
    for (let x = 0; x < 1024; x += 64) { g.fillStyle = "rgba(180,170,150,.18)"; g.fillRect(x, 0, 2, 256); }   // dobleces de planchado
  }),
  foil: mk(256, 256, (g) => {
    g.fillStyle = "#b9bcc0"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { const v = 150 + rnd(i, 1) * 105; g.fillStyle = `rgba(${v},${v},${v + 4},.55)`; g.beginPath(); const x = rnd(i, 2) * 256, y = rnd(i, 3) * 256; g.moveTo(x, y); g.lineTo(x + 30 * (rnd(i, 4) - 0.5), y + 30 * (rnd(i, 5) - 0.5)); g.lineTo(x + 30 * (rnd(i, 6) - 0.5), y + 30 * (rnd(i, 7) - 0.5)); g.closePath(); g.fill(); }
  }),
  towel: mk(128, 128, (g) => {
    g.fillStyle = "#f3efe2"; g.fillRect(0, 0, 128, 128);
    g.fillStyle = "rgba(170,40,40,.7)"; g.fillRect(0, 18, 128, 8); g.fillRect(0, 34, 128, 4); g.fillRect(0, 100, 128, 8);
  }),
  clockFace: mk(256, 256, (g) => {
    g.fillStyle = "#fbf7ec"; g.beginPath(); g.arc(128, 128, 120, 0, 6.3); g.fill();
    g.fillStyle = "#1f1d1a";
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; g.save(); g.translate(128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100); g.rotate(a); g.fillRect(-3, -10, 6, k % 3 ? 14 : 22); g.restore(); }
  }),
  // cada cazuela con su costra
  c1: crustTex("#c9862c", "rgba(110,55,12,1)", "rgba(240,190,90,1)"),               // potato puffs
  c2: crustTex("#efe2c2", "rgba(200,170,120,1)", "rgba(255,250,235,1)", 400),        // arroz cremoso
  c3: crustTex("#e3b25a", "rgba(150,90,20,1)", "rgba(250,215,120,1)"),              // papitas + queso
  c4: crustTex("#d98e2e", "rgba(150,70,10,1)", "rgba(250,190,80,1)", 420),           // corn flakes
  c5: crustTex("#e5bb62", "rgba(140,80,20,1)", "rgba(250,225,150,1)"),              // queso gratinado
  c6: crustTex("#b8402a", "rgba(120,30,20,1)", "rgba(240,190,90,1)"),               // goulash
  c7: crustTex("#6e3418", "rgba(50,20,8,1)", "rgba(150,70,30,1)", 500),             // porotos
  cards: NAMES.map(cardTex),
}), []);

// ---------------- las 7 cazuelas ----------------
const PW = 0.34, PD = 0.24;
const Pan9x13: React.FC<{ k: number; t: number; open: number; o: number; empty?: boolean; tx: ReturnType<typeof useHallTex> }> = ({ k, t, open, o, empty, tx }) => {
  const top = [tx.c1, tx.c2, tx.c3, tx.c4, tx.c5, tx.c6, tx.c7][k];
  const dim = 0.35 + 0.65 * o;
  const glass = k === 3 || k === 6;                            // Pyrex (funeral potatoes, beans) · las demás chapa
  const bub = (n: number, y: number, col: string) => !empty && open > 0.2 && Array.from({ length: n }, (_, i) => {
    const kk = Math.max(0, Math.sin(t * (1.5 + rnd(i + k * 13, 4) * 2) + rnd(i + k * 13, 3) * 6.28)) * open;
    return <mesh key={"b" + i} position={[(rnd(i + k * 7, 1) - 0.5) * PW * 0.92, y, (rnd(i + k * 7, 2) - 0.5) * PD * 0.92]} scale={[kk, kk * 0.7, kk]}><sphereGeometry args={[0.006, 10, 8]} /><meshStandardMaterial color={col} roughness={0.08} /></mesh>;
  });
  if (k === 5) {
    // goulash en la olla de hierro (Dutch oven), tapa que se corre
    return (
      <group>
        <mesh position={[0, 0.075, 0]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.14, 0.15, 40, 1, true]} /><meshStandardMaterial color="#1d1d20" roughness={0.45} metalness={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[0.14, 0.14, 0.008, 40]} /><meshStandardMaterial color="#1d1d20" roughness={0.5} /></mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.165, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.022, 0.007, 8, 16, Math.PI]} /><meshStandardMaterial color="#1d1d20" roughness={0.45} metalness={0.4} /></mesh>)}
        {!empty && <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.145, 40]} /><meshStandardMaterial map={top} color={new THREE.Color(dim, dim, dim)} roughness={0.35} /></mesh>}
        {!empty && Array.from({ length: 26 }, (_, i) => <mesh key={"mc" + i} position={[Math.cos(i * 2.4) * 0.11 * Math.sqrt(rnd(i, 5)), 0.135, Math.sin(i * 2.4) * 0.11 * Math.sqrt(rnd(i, 5))]} rotation={[Math.PI / 2, 0, rnd(i, 6) * 6]}><torusGeometry args={[0.009, 0.004, 6, 10, Math.PI]} /><meshStandardMaterial color="#e9b866" roughness={0.4} /></mesh>)}
        {bub(8, 0.136, "#d0603a")}
        <group position={[0, 0.152, 0]} rotation={[0, 0, open * 0.9]}>
          <group position={[open * 0.12, open * 0.04, 0]}>
            <mesh castShadow><cylinderGeometry args={[0.155, 0.155, 0.014, 40]} /><meshStandardMaterial color="#232327" roughness={0.4} metalness={0.45} /></mesh>
            <mesh position={[0, 0.018, 0]}><cylinderGeometry args={[0.022, 0.026, 0.022, 16]} /><meshStandardMaterial color="#232327" roughness={0.4} metalness={0.45} /></mesh>
          </group>
        </group>
      </group>
    );
  }
  return (
    <group>
      {/* la fuente */}
      <Box p={[0, 0.03, 0]} s={[PW, 0.06, PD]} c={glass ? "#dfe8e6" : "#b6b9bd"} r={glass ? 0.05 : 0.3} m={glass ? 0 : 0.85} rad={0.012} o={glass ? 0.75 : 1} />
      {[-1, 1].map((s) => <Box key={"h" + s} p={[s * (PW / 2 + 0.012), 0.05, 0]} s={[0.025, 0.012, 0.12]} c={glass ? "#dfe8e6" : "#b6b9bd"} r={0.3} m={glass ? 0 : 0.85} rad={0.005} />)}
      {/* la comida */}
      {!empty && <Box p={[0, 0.064, 0]} s={[PW - 0.016, 0.012, PD - 0.016]} c={`rgb(${Math.round(255 * dim)},${Math.round(255 * dim)},${Math.round(255 * dim)})`} map={top} r={k === 6 ? 0.25 : 0.55} rad={0.004} />}
      {!empty && k === 0 && Array.from({ length: 9 }, (_, r) => Array.from({ length: 6 }, (_, c) => <mesh key={"tt" + r + c} position={[(r - 4) * 0.034, 0.078, (c - 2.5) * 0.034]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.026, 12]} /><meshStandardMaterial color="#c9862c" roughness={0.55} map={tx.c1} /></mesh>))}
      {!empty && k === 1 && Array.from({ length: 8 }, (_, i) => <mesh key={"th" + i} position={[((i % 4) - 1.5) * 0.075, 0.074, (Math.floor(i / 4) - 0.5) * 0.1]} rotation={[0, rnd(i, 3) * 2, 0]} scale={[0.036, 0.014, 0.024]} castShadow><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color="#d9a35e" roughness={0.35} map={tx.c1} /></mesh>)}
      {!empty && k === 2 && Array.from({ length: 22 }, (_, i) => <mesh key={"pe" + i} position={[(rnd(i, 1) - 0.5) * 0.3, 0.072, (rnd(i, 2) - 0.5) * 0.2]}><sphereGeometry args={[0.005, 8, 6]} /><meshStandardMaterial color="#5f9a3a" roughness={0.4} /></mesh>)}
      {!empty && k === 3 && Array.from({ length: 70 }, (_, i) => <mesh key={"cf" + i} position={[(rnd(i, 1) - 0.5) * 0.31, 0.072 + rnd(i, 5) * 0.004, (rnd(i, 2) - 0.5) * 0.21]} rotation={[rnd(i, 3) * 0.6, rnd(i, 4) * 6, 0]}><circleGeometry args={[0.009 + rnd(i, 6) * 0.006, 6]} /><meshStandardMaterial color="#e09a3a" roughness={0.5} side={THREE.DoubleSide} /></mesh>)}
      {!empty && k === 4 && Array.from({ length: 18 }, (_, i) => <Box key={"hm" + i} p={[(rnd(i, 1) - 0.5) * 0.29, 0.072, (rnd(i, 2) - 0.5) * 0.19]} s={[0.014, 0.008, 0.014]} c="#d98b86" r={0.5} rad={0.002} />)}
      {!empty && k === 6 && Array.from({ length: 30 }, (_, i) => <Box key={"bc" + i} p={[(rnd(i, 1) - 0.5) * 0.3, 0.073, (rnd(i, 2) - 0.5) * 0.2]} rot={[0, rnd(i, 3) * 3, 0]} s={[0.03, 0.006, 0.01]} c="#7a2a18" r={0.35} rad={0.002} />)}
      {k === 0 || k === 2 || k === 3 || k === 4 ? bub(10, 0.073, "#e9a64a") : bub(10, 0.073, k === 6 ? "#5a2410" : "#f2e6c8")}
      {/* el papel aluminio: bisagra en el borde de atrás, se levanta hacia la cámara-fondo */}
      {open < 0.999 && (
        <group position={[0, 0.072, -PD / 2]} rotation={[-open * 2.2, 0, 0]}>
          <Box p={[0, 0.004, PD / 2]} s={[PW + 0.02, 0.008, PD + 0.02]} c="#e6e9ec" r={0.28} m={0.8} map={tx.foil} rad={0.004} />
        </group>
      )}
    </group>
  );
};

// libro sobre la mesa
const BW = 0.17, BD = 0.22, BT = 0.018;
const Book: React.FC<{ open: number; page: THREE.Texture; cover: THREE.Texture; turn?: number; from?: THREE.Texture }> = ({ open, page, cover, turn = 0, from }) => (
  <group position={BOOK} rotation={[0, -0.25, 0]}>
    <Box p={[0, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />
    {open > 0.55 && <Box p={[-BW, BT / 2, 0]} s={[BW, BT, BD]} c="#f4efe2" r={0.8} rad={0.002} />}
    <mesh position={[0, BT + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={page} color="#e6e1d6" toneMapped={false} /></mesh>
    {turn > 0.001 && turn < 0.999 && from && (
      <group position={[-BW / 2, BT + 0.0016, 0]} rotation={[0, 0, turn * Math.PI]}>
        <mesh position={[BW / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={from} color="#e6e1d6" toneMapped={false} /></mesh>
        <mesh position={[BW / 2, -0.0004, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f4efe2" roughness={0.85} /></mesh>
      </group>
    )}
    <group position={[-BW / 2, BT + 0.002, 0]} rotation={[0, 0, open * Math.PI * 0.995]}>
      <Box p={[BW / 2, 0, 0]} s={[BW + 0.006, 0.004, BD + 0.006]} c="#4b2a5a" r={0.5} rad={0.0015} />
      <mesh position={[BW / 2, 0.0022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW, BD]} /><meshStandardMaterial map={cover} roughness={0.55} /></mesh>
      <mesh position={[BW / 2, -0.0022, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f4efe2" roughness={0.85} /></mesh>
    </group>
  </group>
);

const FoldChair: React.FC<{ p: V3; ry: number }> = ({ p, ry }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.45, 0]} s={[0.4, 0.03, 0.4]} c="#6e6a64" r={0.5} m={0.4} />
    <Box p={[0, 0.75, -0.19]} s={[0.4, 0.22, 0.03]} c="#6e6a64" r={0.5} m={0.4} />
    {[-1, 1].map((s) => <Box key={"a" + s} p={[s * 0.18, 0.42, 0]} rot={[0.18, 0, 0]} s={[0.025, 0.86, 0.025]} c="#3e3c3a" r={0.4} m={0.6} />)}
    {[-1, 1].map((s) => <Box key={"b" + s} p={[s * 0.18, 0.4, 0.05]} rot={[-0.3, 0, 0]} s={[0.025, 0.8, 0.025]} c="#3e3c3a" r={0.4} m={0.6} />)}
  </group>
);

// ---------------- EL SALÓN ----------------
export const HallWorld: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useTextures(), ht = useHallTex(), pg = usePages();
  const npan = sc.pans ?? 7, setting = sc.setting ?? 1, dim = sc.dim ?? 0;
  const door = sc.door ?? 0;
  const steamAt = (q: V3, n: number, o: number, spread = 0.12) => { const pts: number[] = []; for (let i = 0; i < n; i++) { const ph = (t * (0.2 + rnd(i, 5) * 0.15) + rnd(i, 6)) % 1; pts.push(q[0] + (rnd(i, 7) - 0.5) * spread + Math.sin(ph * 5 + i) * 0.02 * (1 + ph * 3), q[1] + 0.03 + ph * 0.4, q[2] + (rnd(i, 8) - 0.5) * spread * 0.6 + Math.cos(ph * 4 + i) * 0.02 * (1 + ph * 3)); } return <Puffs pts={pts} col="#f6f2ea" size={0.024} o={o} map={tx.flake} />; };
  const amb = lerp(0.55, 0.22, dim);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <CamSet k={sc.cam} />
      <Post bloom={0.22} threshold={0.9} exposure={lerp(0.9, 0.74, dim)} env={lerp(0.3, 0.14, dim)} />
      <color attach="background" args={["#0d0f14"]} />
      <hemisphereLight args={["#eef0f2", "#6b5a44", amb]} />
      {/* tubos fluorescentes del techo */}
      {[[-1.6, -0.8], [0.6, -0.8], [2.6, -0.8], [-1.6, 1.2], [0.6, 1.2]].map(([x, z], i) => <pointLight key={"fl" + i} position={[x, 2.45, z]} intensity={(0.55 - 0.4 * dim) * (i < 3 ? 1 : 0.7)} distance={5} color="#f4f1e6" decay={1.5} castShadow={i === 1} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />)}
      {/* las ventanitas altas del sótano (luz de mañana, fría) */}
      <directionalLight position={[1, 3.5, 4]} intensity={lerp(0.5, 0.15, dim)} color="#cfdcf0" />
      {/* la cocina: luz cálida por la ventana de servir */}
      <pointLight position={[-4.3, 1.3, -1.2]} intensity={0.9 + 0.4 * dim} distance={3.4} color="#ffc27a" decay={1.6} />
      {/* la puerta de arriba: luz de afuera que baja por la escalera */}
      {door > 0.01 && <spotLight position={[DOOR[0], DOOR[1] + 0.3, DOOR[2] + 0.3]} target-position={[2.4, 0.2, -1.6]} angle={0.55} penumbra={0.6} intensity={door * 6} distance={7} color="#fff3dc" />}

      {/* piso, techo, paredes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow><planeGeometry args={[9, 7.5]} /><meshStandardMaterial map={ht.tile} roughness={0.5} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.6, -0.5]}><planeGeometry args={[9, 7.5]} /><meshStandardMaterial map={ht.ceil} roughness={0.95} /></mesh>
      {[[-1.6, -0.8], [0.6, -0.8], [2.6, -0.8], [-1.6, 1.2], [0.6, 1.2]].map(([x, z], i) => <mesh key={"tb" + i} position={[x, 2.59, z]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[1.1, 0.3]} /><meshBasicMaterial color={dim > 0.5 && i > 2 ? "#8a8780" : "#fffdf4"} toneMapped={false} /></mesh>)}
      <mesh position={[0, 1.75, -3.5]} receiveShadow><planeGeometry args={[9, 1.7]} /><meshStandardMaterial map={ht.wall} roughness={0.95} /></mesh>
      <mesh position={[0, 0.45, -3.49]} receiveShadow><planeGeometry args={[9, 0.9]} /><meshStandardMaterial map={ht.panel} roughness={0.7} /></mesh>
      <Box p={[0, 0.91, -3.47]} s={[9, 0.04, 0.04]} c="#5a3a20" r={0.6} />
      <mesh position={[-4.0, 1.75, -0.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[7.5, 1.7]} /><meshStandardMaterial map={ht.wall} roughness={0.95} /></mesh>
      <mesh position={[-3.99, 0.45, -0.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[7.5, 0.9]} /><meshStandardMaterial map={ht.panel} roughness={0.7} /></mesh>
      <mesh position={[3.52, 1.3, -0.5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[7.5, 2.6]} /><meshStandardMaterial map={ht.wall} roughness={0.95} /></mesh>
      <mesh position={[3.51, 0.45, -0.5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[7.5, 0.9]} /><meshStandardMaterial map={ht.panel} roughness={0.7} /></mesh>
      {/* ventanitas altas del sótano (fondo) */}
      {[-2.6, 1.0].map((x, i) => <mesh key={"bw" + i} position={[x, 2.25, -3.48]}><planeGeometry args={[0.9, 0.36]} /><meshBasicMaterial color={dim > 0.5 ? "#4a5670" : "#dfe9f4"} toneMapped={false} /></mesh>)}
      {/* reloj a las 10:45 */}
      <group position={CLOCK}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 48]} /><meshStandardMaterial color="#2a2a2a" roughness={0.4} /></mesh>
        <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.18, 48]} /><meshStandardMaterial map={ht.clockFace} roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.026]} rotation={[0, 0, -((10 + 45 / 60) / 12) * Math.PI * 2]}><mesh position={[0, 0.05, 0]}><boxGeometry args={[0.014, 0.1, 0.003]} /><meshStandardMaterial color="#1a1a1a" /></mesh></mesh>
        <mesh position={[0, 0, 0.029]} rotation={[0, 0, -((45 + t / 60) / 60) * Math.PI * 2]}><mesh position={[0, 0.07, 0]}><boxGeometry args={[0.009, 0.145, 0.003]} /><meshStandardMaterial color="#1a1a1a" /></mesh></mesh>
        <mesh position={[0, 0, 0.032]} rotation={[0, 0, -(Math.floor(t) / 60) * Math.PI * 2]}><mesh position={[0, 0.065, 0]}><boxGeometry args={[0.003, 0.15, 0.002]} /><meshStandardMaterial color="#b3261e" /></mesh></mesh>
      </group>
      {/* cruz de madera grande */}
      <group position={[1.0, 1.55, -3.47]}>
        <Box p={[0, 0, 0]} s={[0.06, 0.55, 0.03]} c="#5a3a20" r={0.6} />
        <Box p={[0, 0.1, 0]} s={[0.32, 0.06, 0.03]} c="#5a3a20" r={0.6} />
      </group>

      {/* ESCALERA (derecha, contra el fondo) con la puerta de arriba */}
      {Array.from({ length: 9 }, (_, i) => <Box key={"st" + i} p={[3.05, (0.16 * (i + 1)) / 2, -0.9 - i * 0.28]} s={[0.9, 0.16 * (i + 1), 0.28]} c="#8a6a4a" r={0.65} rad={0.006} />)}
      <Box p={[2.58, 0.85, -2.0]} s={[0.04, 0.04, 2.8]} rot={[0.5, 0, 0]} c="#5a3a20" r={0.5} />
      <Box p={[3.05, 1.44, -3.18]} s={[0.9, 0.04, 0.6]} c="#8a6a4a" r={0.65} />
      {/* la puerta: marco + hoja que se abre hacia adentro, luz de afuera */}
      <Box p={[3.05, DOOR[1] + 0.98, -3.46]} s={[0.98, 0.06, 0.06]} c="#5a3a20" r={0.6} />
      {[-1, 1].map((s) => <Box key={"dj" + s} p={[3.05 + s * 0.46, DOOR[1] + 0.5, -3.46]} s={[0.06, 1.0, 0.06]} c="#5a3a20" r={0.6} />)}
      <mesh position={[3.05, DOOR[1] + 0.48, -3.495]}><planeGeometry args={[0.86, 0.96]} /><meshBasicMaterial color={door > 0.01 ? "#fff8e8" : "#2a2420"} toneMapped={false} /></mesh>
      <group position={[2.62, DOOR[1] + 0.48, -3.44]} rotation={[0, door * 1.4, 0]}>
        <Box p={[0.43, 0, 0]} s={[0.86, 0.96, 0.04]} c="#7a5434" r={0.55} />
        <Chrome p={[0.78, 0, 0.04]} s={[0.04, 0.04, 0.04]} />
      </group>
      {door > 0.01 && <Puffs pts={Array.from({ length: 180 }, (_, i) => [3.05 + (rnd(i, 1) - 0.5) * 0.8, 0.4 + rnd(i, 2) * 2.0 + Math.sin(t * 0.3 + i) * 0.04, -1.2 - rnd(i, 3) * 2.2]).flat()} col="#fff4dc" size={0.012} o={0.35 * door} map={tx.flake} />}

      {/* ventana de servir de la cocina (pared izquierda) con las fuentes de repuesto al calor */}
      <group position={SERVE}>
        <mesh position={[0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.6, 0.8]} /><meshBasicMaterial color="#f2b56a" toneMapped={false} /></mesh>
        <Box p={[0.12, -0.42, 0]} s={[0.3, 0.04, 1.7]} c="#cfd3d6" r={0.25} m={0.85} />
        {[-0.5, 0, 0.5].map((z, i) => <group key={"sp" + i} position={[0.12, -0.38, z]} rotation={[0, Math.PI / 2, 0]}><Box p={[0, 0.02, 0]} s={[0.34, 0.05, 0.24]} c="#b6b9bd" r={0.3} m={0.85} rad={0.01} /><Box p={[0, 0.05, 0]} s={[0.35, 0.008, 0.25]} c="#e6e9ec" r={0.28} m={0.8} map={ht.foil} rad={0.004} /></group>)}
        {[-1, 1].map((s) => <Box key={"sf" + s} p={[0.04, 0, s * 0.83]} s={[0.08, 0.9, 0.06]} c="#5a3a20" r={0.6} />)}
      </group>
      {steamAt([SERVE[0] + 0.15, SERVE[1] - 0.35, SERVE[2]], 70, 0.12, 0.8)}

      {/* MESA LARGA con mantel blanco */}
      {[-2.5, -0.85, 0.85, 2.5].map((x, i) => [-1, 1].map((s) => <Box key={"tl" + i + s} p={[x, 0.37, TABLE_Z + s * 0.32]} s={[0.04, 0.74, 0.04]} c="#4a4a4a" r={0.4} m={0.6} />))}
      <Box p={[0, 0.745, TABLE_Z]} s={[5.2, 0.03, 0.76]} c="#7a5434" r={0.6} />
      <mesh geometry={LONG} position={[0, TABLE_Y, TABLE_Z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow><meshStandardMaterial map={ht.cloth} roughness={0.92} side={THREE.DoubleSide} /></mesh>
      {/* las 7 fuentes, cada una sobre su repasador, con su tarjetita */}
      {Array.from({ length: 7 }, (_, i) => {
        if (i >= npan) return null;
        const landing = i === npan - 1 ? setting : 1;
        const op = sc.open?.[i] ?? 0;
        const o = sc.hi === undefined || sc.hi === i ? 1 : 0.55;
        const pp = PAN(i);
        return (
          <group key={"pan" + i}>
            <mesh position={[pp[0], TABLE_Y + 0.003, pp[2]]} rotation={[-Math.PI / 2, 0, 0.04 * (rnd(i, 2) - 0.5)]} receiveShadow><planeGeometry args={[0.46, 0.34]} /><meshStandardMaterial map={ht.towel} roughness={0.9} /></mesh>
            <group position={[pp[0], TABLE_Y + 0.006 + (1 - landing) * 0.35, pp[2]]} rotation={[0, 0.03 * (rnd(i, 4) - 0.5) + (1 - landing) * 0.15, 0]}>
              <Pan9x13 k={i} t={t} open={op} o={o} empty={sc.empty} tx={ht} />
            </group>
            {/* tarjetita doblada (carpa) con el apellido */}
            {landing > 0.98 && (
              <group position={CARD(i)} rotation={[0, 0.06 * (rnd(i, 6) - 0.5), 0]}>
                <mesh position={[0, 0, 0.012]} rotation={[-0.42, 0, 0]} castShadow><planeGeometry args={[0.13, 0.065]} /><meshStandardMaterial map={ht.cards[i]} roughness={0.85} side={THREE.DoubleSide} /></mesh>
                <mesh position={[0, 0, -0.012]} rotation={[0.42, 0, 0]}><planeGeometry args={[0.13, 0.065]} /><meshStandardMaterial color="#f6f2e6" roughness={0.85} side={THREE.DoubleSide} /></mesh>
              </group>
            )}
            {!sc.empty && op > 0.3 && steamAt([pp[0], TABLE_Y + 0.07, pp[2]], 90, 0.2 * op)}
          </group>
        );
      })}
      {/* los jamones-bollos a la izquierda (canasta) y las barritas a la derecha */}
      <group position={[-2.38, TABLE_Y, TABLE_Z]}>
        <Box p={[0, 0.03, 0]} s={[0.36, 0.06, 0.26]} c="#a0763e" r={0.8} />
        {Array.from({ length: 8 }, (_, i) => <mesh key={"bun" + i} position={[((i % 4) - 1.5) * 0.08, 0.075, (Math.floor(i / 4) - 0.5) * 0.1]} scale={[0.036, 0.024, 0.036]} castShadow><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#c88a42" roughness={0.45} /></mesh>)}
      </group>
      {/* cafetera grande de la iglesia + tazas */}
      <group position={URN}>
        <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.1, 0.11, 0.44, 32]} /><meshStandardMaterial color="#d8dcdf" roughness={0.18} metalness={0.95} /></mesh>
        <mesh position={[0, 0.46, 0]}><sphereGeometry args={[0.1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#d8dcdf" roughness={0.18} metalness={0.95} /></mesh>
        <Box p={[0, 0.08, 0.12]} s={[0.03, 0.03, 0.05]} c="#222" r={0.4} />
        {Array.from({ length: 6 }, (_, i) => <mesh key={"cup" + i} position={[0.2 + (i % 3) * 0.07, 0.03 + Math.floor(i / 3) * 0.055, 0.05]}><cylinderGeometry args={[0.03, 0.025, 0.055, 18]} /><meshStandardMaterial color="#f7f4ec" roughness={0.2} /></mesh>)}
      </group>
      {(sc.coffee ?? 0.4) > 0.01 && steamAt([URN[0], URN[1] + 0.56, URN[2]], 60, 0.14 * (sc.coffee ?? 0.4), 0.05)}
      {sc.book && <Book open={sc.book.open} page={pg[sc.book.page]} cover={pg["001"]} turn={sc.book.turn} from={sc.book.from ? pg[sc.book.from] : undefined} />}

      {/* mesa de la familia (al fondo) con mantel, florero y sillas */}
      {[-1, 1].map((s) => [-1, 1].map((r) => <Box key={"hl" + s + r} p={[HEAD[0] + s * 0.85, 0.37, HEAD[2] + r * 0.3]} s={[0.04, 0.74, 0.04]} c="#4a4a4a" r={0.4} m={0.6} />))}
      <Box p={[HEAD[0], 0.745, HEAD[2]]} s={[1.8, 0.03, 0.7]} c="#7a5434" r={0.6} />
      <mesh geometry={HEADC} position={[HEAD[0], 0.762, HEAD[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial map={ht.cloth} roughness={0.92} side={THREE.DoubleSide} /></mesh>
      <mesh position={[HEAD[0], 0.84, HEAD[2]]}><cylinderGeometry args={[0.04, 0.05, 0.15, 20]} /><meshStandardMaterial color="#e6eef0" roughness={0.05} transparent opacity={0.6} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={"fw" + i} position={[HEAD[0] + Math.cos(i * 0.9) * 0.05, 0.96 + rnd(i, 2) * 0.05, HEAD[2] + Math.sin(i * 0.9) * 0.05]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color={["#f4f0f6", "#e9d6ea", "#fff6dc"][i % 3]} roughness={0.7} /></mesh>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={"hp" + i} position={[HEAD[0] - 0.62 + i * 0.25, 0.77, HEAD[2] - 0.2]}><cylinderGeometry args={[0.1, 0.085, 0.012, 32]} /><meshStandardMaterial color="#f7f4ec" roughness={0.2} /></mesh>)}
      {Array.from({ length: 6 }, (_, i) => <FoldChair key={"hc" + i} p={[HEAD[0] - 0.62 + i * 0.25, 0, HEAD[2] - 0.6]} ry={0} />)}
      {/* sillas plegables en fila de este lado */}
      {Array.from({ length: 8 }, (_, i) => <FoldChair key={"fc" + i} p={[-2.1 + i * 0.6, 0, 0.9]} ry={Math.PI} />)}
      {Array.from({ length: 8 }, (_, i) => <FoldChair key={"fd" + i} p={[-2.1 + i * 0.6, 0, 1.8]} ry={Math.PI} />)}
    </ThreeCanvas>
  );
};

// ---------------- ESCENAS con nombre (u = segundos desde que entra la toma) ----------------
// "hook" las fuentes llegan una por una y la cámara corre a lo largo de la mesa · "row" la fila de las 7 de costado
// "table" plano general del salón · "stairs" la puerta de arriba se abre, baja la luz · "clock" 10:45 · "pan:N" (0-6) el aluminio
// se levanta · "pan:Nc" cerrada, sólo la tarjetita · "card:N" macro de la tarjetita · "book:PG" / "book:PGfFROM" (da vuelta la hoja)
// · "book:001" tapa cerrada · "serve" la ventana de la cocina · "head" la mesa de la familia · "coffee" la cafetera · "empty" vuelven a casa
const ALLOPEN = [1, 1, 1, 1, 1, 1, 1];
// "~k" = misma escena con otra cámara (gira alrededor de lo que mira, otra altura y otro lente): el relleno no se repite igual
export const sceneOf = (full: string, u: number): Scene => {
  const [name, vs] = full.split("~"), v = parseInt(vs ?? "") || 0;
  const sc = sceneBase(name, u);
  if (!v) return sc;
  const { p, l, fov } = sc.cam, ang = [0, 0.32, -0.3, 0.55][v % 4], dy = [0, -0.08, 0.12, 0.04][v % 4];
  const dx = p[0] - l[0], dz = p[2] - l[2], c = Math.cos(ang), s = Math.sin(ang);
  return { ...sc, cam: { p: [l[0] + dx * c - dz * s, p[1] + dy, l[2] + dx * s + dz * c], l, fov: fov * [1, 0.88, 1.1, 0.8][v % 4] } };
};
const sceneBase = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const n = parseInt(arg) || 0, side = n % 2 ? 1 : -1;
  if (kind === "hook") {
    // 7 fuentes que van llegando (0,9 s c/u) · cámara baja que corre de la 1 a la 7
    const k = Math.min(7, 1 + Math.floor(u / 0.9)), set = sm((u % 0.9) / 0.6);
    return { cam: drift([-2.3, 1.02, TABLE_Z + 0.75], [1.6, 0.98, TABLE_Z + 0.62], [-1.6, TABLE_Y + 0.05, TABLE_Z], [1.9, TABLE_Y + 0.05, TABLE_Z], 40, 36, u, 7), pans: u > 6.3 ? 7 : k, setting: u > 6.3 ? 1 : set, coffee: 0.5 };
  }
  if (kind === "row") return { cam: drift([2.6, 1.15, TABLE_Z + 0.9], [2.1, 1.05, TABLE_Z + 0.7], [-1.4, TABLE_Y, TABLE_Z], [-1.8, TABLE_Y, TABLE_Z], 34, 30, u, 10), open: arg === "open" ? ALLOPEN : undefined };
  if (kind === "table") return { cam: drift([-3.2, 1.75, 2.6], [-2.6, 1.6, 2.2], [0.4, 0.8, -1.4], [0.6, 0.8, -1.5], 46, 42, u, 10), dim: arg === "late" ? 0.8 : 0, open: arg === "open" ? ALLOPEN : undefined };
  if (kind === "stairs") return { cam: drift([2.75, 1.45, 1.5], [2.8, 1.5, 0.9], [3.0, 1.4, -3.0], [3.05, 1.75, -3.3], 46, 40, u, 7), door: sm((u - 0.5) / 1.4) };
  if (kind === "clock") return { cam: drift([-0.5, 1.75, -2.2], [-0.58, 1.95, -2.75], CLOCK, CLOCK, 36, 30, u, 6) };
  if (kind === "pan" || kind === "card") {
    const p = PAN(n), c = CARD(n);
    if (kind === "card") return { cam: drift([c[0] + 0.06 * side, c[1] + 0.12, c[2] + 0.38], [c[0] + 0.02 * side, c[1] + 0.06, c[2] + 0.22], c, c, 30, 24, u, 6), hi: n };
    const closed = arg.endsWith("c");
    const op = closed ? 0 : sm((u - 0.6) / 1.1);
    const open = ALLOPEN.map((_, i) => (i === n ? op : i < n ? 1 : 0));
    return { cam: drift([p[0] + 0.28 * side, p[1] + 0.5, p[2] + 0.62], [p[0] + 0.1 * side, p[1] + 0.34, p[2] + 0.38], [p[0], p[1] + 0.03, p[2]], [p[0], p[1] + 0.05, p[2]], 34, 28, u, 8), open, hi: n };
  }
  if (kind === "book") {
    const pg = arg.slice(0, 3), from = arg.includes("f") ? arg.split("f")[1] : undefined;
    const B: V3 = [BOOK[0] + 0.02, BOOK[1] + 0.02, BOOK[2] + 0.02];
    const cam = drift([B[0] + 0.08, B[1] + 0.44, B[2] + 0.3], [B[0] - 0.02, B[1] + 0.32, B[2] + 0.12], B, [B[0], B[1], B[2] - 0.01], 34, 30, u, 8);
    if (pg === "001") return { cam, book: { open: 0, page: "028" } };
    return { cam, book: from ? { open: 1, page: pg, from, turn: sm((u - 0.3) / 1.2) } : { open: sm((u - 0.4) / 1.3), page: pg } };
  }
  if (kind === "serve") return { cam: drift([-2.4, 1.3, -0.2], [-2.9, 1.22, -0.7], SERVE, [SERVE[0], SERVE[1] - 0.2, SERVE[2]], 40, 34, u, 8) };
  if (kind === "head") return { cam: drift([0.9, 1.75, -0.95], [0.6, 1.55, -1.35], [HEAD[0], 0.8, HEAD[2]], [HEAD[0], 0.82, HEAD[2]], 40, 36, u, 8), dim: arg === "late" ? 0.6 : 0 };
  if (kind === "coffee") return { cam: drift([1.5, 1.25, 0.25], [1.7, 1.2, 0.0], [URN[0], URN[1] + 0.3, URN[2]], [URN[0], URN[1] + 0.35, URN[2]], 34, 30, u, 7), coffee: 1 };
  if (kind === "empty") return { cam: drift([0.3, 1.6, 0.6], [0.0, 1.35, 0.25], [0.0, TABLE_Y, TABLE_Z], [-0.1, TABLE_Y, TABLE_Z], 44, 38, u, 10), empty: true, dim: 0.85, open: ALLOPEN, coffee: 0 };
  return { cam: drift([-3.2, 1.75, 2.6], [-2.6, 1.6, 2.2], [0.4, 0.8, -1.4], [0.6, 0.8, -1.5], 46, 42, u, 10) };
};
export const screenOfScene = (name: string, u: number, q: V3) => project(sceneOf(name, u).cam, q);
