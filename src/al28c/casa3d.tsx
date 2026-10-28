// al28c · EL MUNDO: la cocina de Doña Marta, de mañana, con la luz de la ventana que entra de costado sobre la pared de azulejos crema 15x15 de 1979.
// La pared de azulejos (34 x 6) arriba de la mesada: la estufa enlozada a la izquierda, el fregadero a la derecha y la esquina bajo la ventana.
// Los SEIS azulejos huecos (4 atrás de la estufa = se inyectan · el del fregadero = se rompe · el de la esquina = sale entero con la ventosa):
// la prueba del golpecito (ondas), la cinta de pintor, la mano que empuja, los agujeros en la junta, el taladro, la jeringa con epoxi,
// la cinta en cruz y el palo de escoba, el rascador, la espátula, el hueco limpio, el adhesivo peinado, el azulejo de la caja del garaje,
// el nivel, las crucetas, la lechada y el velo. Adelante, LA PARED GIGANTE EN CORTE (ladrillo, revoque, adhesivo, azulejo): pelotitas vs
// adhesivo lleno, el calor que estira, la humedad que sube, la silicona, el epoxi que llena el aire, el adhesivo viejo, el doble encolado.
// UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- medidas ----------------
// pared del fondo (cara) en z=ZW; mesada a 0,9; la franja de azulejos de X0 a X1 y de Y0 a Y1 (34 columnas x 6 filas de 15 cm + junta)
const ZW = -1.2, HW = 2.6, TOP = 0.9, CD = 0.6;
const TP = 0.153, TW = 0.147, X0 = -2.6, NC = 34, NR = 6, Y0 = 0.92, X1 = X0 + NC * TP, Y1 = Y0 + NR * TP;
const SX0 = -1.8, SX1 = -1.05;                   // la estufa
const KX0 = 0.7, KX1 = 1.25;                     // la pileta del fregadero
const WX0 = 2.0, WX1 = 2.52, WY0 = 1.98, WY1 = 2.5;   // la ventana
export const tc = (c: number, r: number): V => [X0 + (c + 0.5) * TP, Y0 + (r + 0.5) * TP, ZW + 0.006];
// los seis huecos: inj = se inyecta (atrás de la estufa) · brk = el del fregadero (se rompe) · out = el de la esquina (sale entero)
const SP: { c: number; r: number; k: "inj" | "brk" | "out" }[] = [
  { c: 6, r: 2, k: "inj" }, { c: 7, r: 1, k: "inj" }, { c: 8, r: 2, k: "inj" }, { c: 9, r: 1, k: "inj" }, { c: 24, r: 1, k: "brk" }, { c: 33, r: 0, k: "out" },
];
export const GIANT: V = [0.2, 0, 1.45];
export const BOOK: V = [1.55, 0.76, 1.05];
const GAR: V = [7.5, 0, -0.4];                   // el garaje (a la derecha, fuera del encuadre de la cocina)

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.01; p.y += Math.sin(t * 0.71 + 1) * 0.007;
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

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
// un azulejo crema de 1979 (64 px + junta), con el esmalte apenas cuarteado y el brillo de la ventana
const tileCell = (g: CanvasRenderingContext2D, x: number, y: number, s: number, i: number, grout: string) => {
  g.fillStyle = grout; g.fillRect(x, y, s, s);
  const v = rnd(i, 1) * 10; g.fillStyle = `rgb(${236 - v},${226 - v},${200 - v * 1.4})`; g.fillRect(x + 2, y + 2, s - 4, s - 4);
  const gr = g.createLinearGradient(x, y, x + s, y + s); gr.addColorStop(0, "rgba(255,255,255,.28)"); gr.addColorStop(0.45, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(120,100,60,.08)"); g.fillStyle = gr; g.fillRect(x + 2, y + 2, s - 4, s - 4);
  g.strokeStyle = "rgba(150,130,90,.12)"; g.lineWidth = 0.6;
  for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x + 2 + rnd(i, k + 4) * (s - 4), y + 2); g.lineTo(x + 2 + rnd(i, k + 9) * (s - 4), y + s - 2); g.stroke(); }
};
const useCasaTex = () => useMemo(() => ({
  wall: mk(512, 512, (g) => {
    g.fillStyle = "#efe9dc"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5200; i++) { const v = 215 + rnd(i, 1) * 35; g.fillStyle = `rgba(${v},${v - 6},${v - 18},.35)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [3, 2]),
  tiles: mk(512, 512, (g) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) tileCell(g, c * 64, r * 64, 64, r * 8 + c, "#a59d8b"); }, [NC / 8, NR / 8]),
  one: mk(128, 128, (g) => tileCell(g, 0, 0, 128, 3, "#efe4c8")),
  // el dorso del azulejo: bizcocho con rayitas y las 4 pelotitas secas de 1979
  back: mk(256, 256, (g) => {
    g.fillStyle = "#c98f6a"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(120,70,40,.5)"; g.lineWidth = 3; for (let k = 12; k < 256; k += 16) { g.beginPath(); g.moveTo(k, 6); g.lineTo(k, 250); g.stroke(); }
    [[48, 48], [208, 48], [48, 208], [208, 208]].forEach(([x, y], i) => { const r = 26 + rnd(i, 2) * 6; const gg = g.createRadialGradient(x - 6, y - 6, 2, x, y, r); gg.addColorStop(0, "#b8b2a6"); gg.addColorStop(1, "#7f796e"); g.fillStyle = gg; g.beginPath(); g.ellipse(x, y, r, r * 0.88, rnd(i, 3), 0, 6.3); g.fill(); });
  }),
  // el hueco en la pared: revoque gris con los restos de adhesivo viejo
  hole: mk(256, 256, (g) => {
    g.fillStyle = "#8d877d"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1500; i++) { const v = 110 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v},${v - 4},${v - 10},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
    [[50, 50], [206, 50], [50, 206], [206, 206], [128, 128]].forEach(([x, y], i) => { const gg = g.createRadialGradient(x - 5, y - 5, 2, x, y, 30); gg.addColorStop(0, "#c2bcb0"); gg.addColorStop(1, "#97917f"); g.fillStyle = gg; g.beginPath(); g.ellipse(x, y, 30, 26, rnd(i, 4), 0, 6.3); g.fill(); });
  }),
  clean: mk(256, 256, (g) => {
    g.fillStyle = "#9b958a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = 125 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v - 4},${v - 10},.55)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }),
  // adhesivo peinado con la llana dentada: surcos acostados de lado a lado
  comb: mk(256, 256, (g) => {
    g.fillStyle = "#77736c"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 21) { const gg = g.createLinearGradient(0, y, 0, y + 21); gg.addColorStop(0, "#5f5b55"); gg.addColorStop(0.45, "#b9b4aa"); gg.addColorStop(0.7, "#9a958c"); gg.addColorStop(1, "#5f5b55"); g.fillStyle = gg; g.fillRect(0, y, 256, 21); }
  }),
  // la mancha de humedad alrededor del fregadero con el salitre blanco
  damp: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    const gg = g.createRadialGradient(128, 230, 10, 128, 200, 170); gg.addColorStop(0, "rgba(70,62,48,.55)"); gg.addColorStop(0.7, "rgba(90,80,60,.25)"); gg.addColorStop(1, "rgba(90,80,60,0)"); g.fillStyle = gg; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { const a = rnd(i, 1) * 6.3, d = 60 + rnd(i, 2) * 70; g.fillStyle = `rgba(250,250,245,${0.4 * rnd(i, 3)})`; g.fillRect(128 + Math.cos(a) * d, 200 + Math.sin(a) * d * 0.6, 2, 2); }
  }),
  // la grieta diagonal que cruza varios azulejos (la pared que se mueve)
  crack: mk(512, 256, (g) => {
    g.clearRect(0, 0, 512, 256); g.strokeStyle = "rgba(40,30,20,.85)"; g.lineWidth = 3; g.beginPath(); let x = 20, y = 236; g.moveTo(x, y);
    for (let i = 0; i < 24; i++) { x += 20; y -= 9 + (rnd(i, 1) - 0.5) * 10; g.lineTo(x + (rnd(i, 2) - 0.5) * 8, y); } g.stroke();
  }),
  floor: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = rnd(r * 8 + c, 5) * 18; g.fillStyle = (r + c) % 2 ? `rgb(${178 + v},${86 + v / 2},${64})` : `rgb(${226 - v},${214 - v},${190 - v})`; g.fillRect(c * 64, r * 64, 64, 64); }
    g.strokeStyle = "rgba(40,30,20,.35)"; g.lineWidth = 2; for (let k = 0; k <= 512; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 512); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(512, k); g.stroke(); }
  }, [5, 4]),
  brick: mk(256, 256, (g) => {
    g.fillStyle = "#9a948a"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 6; r++) for (let c = -1; c < 3; c++) { const v = rnd(r * 4 + c + 8, 6) * 30; g.fillStyle = `rgb(${168 + v},${82 + v / 2},${56})`; g.fillRect(c * 120 + (r % 2) * 60 + 4, r * 43 + 4, 112, 35); }
  }, [2, 2]),
  rev: mk(256, 256, (g) => {
    g.fillStyle = "#c9c2b4"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) { const v = 150 + rnd(i, 1) * 80; g.fillStyle = `rgba(${v},${v - 6},${v - 16},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 2.5, 1 + rnd(i, 5) * 2.5); }
  }, [2, 2]),
  // el rótulo de la caja del garaje, en lápiz grueso
  label: mk(256, 128, (g) => {
    g.fillStyle = "#b48c5c"; g.fillRect(0, 0, 256, 128); g.fillStyle = "rgba(40,28,16,.9)"; g.font = "bold 46px Georgia"; g.textAlign = "center"; g.fillText("COCINA 79", 128, 78);
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 24, r2, op }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Decal: React.FC<{ p: V; w: number; h: number; map?: THREE.Texture; op: number; rotY?: number; rotX?: number; col?: string; add?: boolean }> = ({ p, w, h, map, op, rotY = 0, rotX = 0, col = "#fff", add = false }) =>
  op < 0.01 ? null : <mesh position={p} rotation={[rotX, rotY, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} color={col} transparent opacity={op} depthWrite={false} roughness={0.9} polygonOffset polygonOffsetFactor={-2} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} /></mesh>;
const Ring: React.FC<{ p: V; r: number; op: number; col?: string }> = ({ p, r, op, col = "#ffd27a" }) =>
  op < 0.01 ? null : <mesh position={p}><ringGeometry args={[r, r + 0.008, 48]} /><meshBasicMaterial color={col} transparent opacity={op} depthWrite={false} toneMapped={false} /></mesh>;
const Dots: React.FC<{ pts: [number, number, number, number][]; col: string; size: number; glow: THREE.Texture; add?: boolean }> = ({ pts, col, size, glow, add = false }) => {
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry(), c = new THREE.Color(col);
    const pos = new Float32Array(pts.length * 3), cc = new Float32Array(pts.length * 3);
    pts.forEach(([x, y, z, o], i) => { pos.set([x, y, z], i * 3); cc.set([c.r * o, c.g * o, c.b * o], i * 3); });
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(cc, 3));
    return geo;
  }, [pts, col]);
  return <points geometry={g}><pointsMaterial map={glow} size={size} sizeAttenuation vertexColors transparent depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};
// el destornillador (mango rojo y amarillo) agarrado al revés, golpeando con el mango
const Driver: React.FC<{ p: V; rot?: V }> = ({ p, rot = [0, 0, 0] }) => <group position={p} rotation={rot}>
  <Cyl p={[0, 0, 0.06]} r={0.016} r2={0.019} h={0.11} c="#c8321e" rough={0.35} rot={[Math.PI / 2, 0, 0]} />
  <Cyl p={[0, 0, 0.125]} r={0.019} h={0.02} c="#f2c230" rough={0.35} rot={[Math.PI / 2, 0, 0]} />
  <Cyl p={[0, 0, 0.21]} r={0.004} h={0.15} c="#c9ccd0" m={0.9} rough={0.25} rot={[Math.PI / 2, 0, 0]} />
</group>;
// la cinta de pintor azul (pedacito o tira)
const Tape: React.FC<{ p: V; w: number; h: number; rz?: number; op?: number }> = ({ p, w, h, rz = 0, op = 1 }) => op < 0.01 ? null :
  <mesh position={p} rotation={[0, 0, rz]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#3d8fe0" roughness={0.75} transparent opacity={0.92 * op} polygonOffset polygonOffsetFactor={-4} /></mesh>;

// ---------------- LA PARED GIGANTE EN CORTE ----------------
// de atrás para adelante: ladrillo, revoque, adhesivo y tres azulejos apilados (con su junta). Se ve el corte de costado.
// full = adhesivo lleno (suena sordo) · blob = las 5 pelotitas y el aire · heat = el calor que estira y afloja · wet = el agua que sube
// · sil = la silicona (goma) · inj = el epoxi que llena el aire del azulejo del medio · drill = la broca por la junta · loose = el que se mueve
// · old = adhesivo nuevo sobre el viejo · gap = los 5 mm · comb = surcos + capa fina en el dorso que se aprietan
type S = ReturnType<typeof ST>;
const GW = 1.5, GH = 1.38, GB = 0.34, GR = 0.08, GA = 0.09, GT = 0.05, GJ = 0.018;   // ancho, alto, ladrillo, revoque, adhesivo, azulejo, junta
const Giant: React.FC<{ t: number; s: S; tt: ReturnType<typeof useCasaTex>; glow: THREE.Texture }> = ({ t, s, tt, glow }) => {
  const k = ease(s.giant);
  const wet = useMemo(() => Array.from({ length: 70 }, (_, i) => i), []);
  if (k < 0.01) return null;
  const th = (GH - 2 * GJ) / 3;                                    // alto de cada azulejo
  const zR = GR, zA = GR + GA, zT = zA + GT;                        // caras (z) del revoque, adhesivo y azulejo
  const blob = cl(s.blob + s.heat + s.loose + s.old * 0.0), full = cl(1 - blob - s.sil - s.comb);
  const tileZ = (j: number) => {
    let dz = 0, rx = 0;
    if (j === 1) { dz += 0.012 * s.heat * Math.sin(t * 2.4); dz += 0.05 * s.loose; rx -= 0.08 * s.loose; rx -= 0.05 * s.sil * (0.6 + 0.4 * Math.sin(t * 3)); }
    if (s.comb > 0.01) dz += 0.16 * (1 - ease(s.combIn));
    return { dz, rx };
  };
  const injH = s.inj > 0.01 ? th * ease(s.injK) : 0;
  return <group position={[GIANT[0], GIANT[1] + (1 - k) * -1.8, GIANT[2]]}>
    {/* base que lo sostiene */}
    <Box p={[0, 0.15, -GB / 2 + 0.05]} s={[GW + 0.2, 0.3, GB + 0.5]} c="#2e2a26" r={0.7} rad={0.02} />
    <group position={[0, 0.3, 0]}>
      {/* ladrillo + revoque */}
      <Box p={[0, GH / 2, -GB / 2]} s={[GW, GH, GB]} c="#b0644a" map={tt.brick} r={0.9} rad={0.006} />
      <Box p={[0, GH / 2, GR / 2]} s={[GW, GH, GR]} c="#c9c2b4" map={tt.rev} r={0.95} rad={0.004} />
      {/* humedad que sube desde abajo y moja el adhesivo (puntitos azules que caminan) */}
      {s.wet > 0.01 && <Dots pts={wet.map((i) => { const u = (t * 0.12 + rnd(i, 3)) % 1; return [(rnd(i, 4) - 0.5) * GW * 0.9, u * GH * 0.8, -GB + rnd(i, 5) * (GB + GR + GA), s.wet * (1 - u) * 0.9] as [number, number, number, number]; })} col="#4f9dff" size={0.05} glow={glow} />}
      {[0, 1, 2].map((j) => {
        const y0 = j * (th + GJ), yc = y0 + th / 2, { dz, rx } = tileZ(j);
        const blobs = [[-0.5, -0.32], [0.5, -0.32], [-0.5, 0.32], [0.5, 0.32], [0, 0]].slice(0, j === 1 && s.old > 0.5 ? 4 : 5);
        return <group key={j}>
          {/* adhesivo: lleno (macizo) o en pelotitas (aire en el medio) */}
          {full > 0.01 && <Box p={[0, yc, zR + GA / 2]} s={[GW * 0.98, th * 0.98, GA]} c={s.wet > 0.3 ? "#5f625e" : "#8f8a80"} r={0.9} rad={0.003} op={full} />}
          {blob > 0.01 && blobs.map(([bx, by], q) => {
            const cr = s.heat * 0.5 + s.loose;                    // pelotitas que se van rompiendo
            return <mesh key={q} position={[bx * GW * 0.8, yc + by * th * 1.0, zR + GA / 2]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1 - 0.35 * cr * (q % 2)]}>
              <cylinderGeometry args={[0.07, 0.085, GA * (1 - 0.4 * s.loose * (j === 1 ? 1 : 0)), 20]} />
              <meshStandardMaterial color={cr > 0.5 && q % 2 ? "#b58a6a" : "#9d978a"} roughness={0.9} transparent opacity={blob} />
            </mesh>;
          })}
          {/* silicona: goma blanca brillante que cuelga */}
          {s.sil > 0.01 && [[-0.45, 0.2], [0.4, -0.25], [0, 0.1]].map(([bx, by], q) => <mesh key={"s" + q} position={[bx * GW * 0.8, yc + by * th, zR + GA / 2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.05, GA, 16]} /><meshStandardMaterial color="#f4f6f8" roughness={0.25} transparent opacity={0.9 * s.sil} /></mesh>)}
          {/* el epoxi ámbar que llena el aire del azulejo del medio, de abajo hacia arriba */}
          {j === 1 && injH > 0.004 && <Box p={[0, y0 + injH / 2, zR + GA / 2]} s={[GW * 0.97, injH, GA * 0.96]} c="#e0a640" r={0.25} e="#a8641a" ei={0.25} rad={0.002} op={0.92} />}
          {/* adhesivo viejo pegado al revoque + el nuevo encima que sólo agarra los terrones */}
          {s.old > 0.01 && j === 1 && [[-0.4, -0.2], [0.35, 0.25], [0.1, -0.3], [-0.2, 0.3]].map(([bx, by], q) => <Box key={"o" + q} p={[bx * GW * 0.8, yc + by * th, zR + 0.012]} s={[0.16, 0.12, 0.024]} c="#7d776c" r={0.95} rad={0.01} op={s.old} />)}
          {/* surcos peinados en el revoque + la capa fina del dorso */}
          {s.comb > 0.01 && Array.from({ length: 8 }, (_, q) => <mesh key={"c" + q} position={[0, y0 + (q + 0.5) * th / 8, zR + 0.004]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1 - 0.6 * ease(s.combIn)]}><cylinderGeometry args={[0.012, 0.012, GW * 0.96, 10]} /><meshStandardMaterial color="#8b867c" roughness={0.9} transparent opacity={s.comb} /></mesh>)}
          {s.comb > 0.01 && <Box p={[0, yc, zA - 0.004 + 0.16 * (1 - ease(s.combIn))]} s={[GW * 0.97, th * 0.97, 0.006]} c="#8f8a80" r={0.9} rad={0.002} op={s.comb} />}
          {/* el azulejo (esmalte crema adelante, bizcocho atrás) */}
          <group position={[-GW * 0.19, yc, zA + GT / 2 + dz]} rotation={[rx, 0, 0]}>
            <Box p={[0, 0, 0]} s={[GW * 0.62, th, GT]} c="#c98f6a" r={0.85} rad={0.004} />
            <Box p={[0, 0, GT / 2 - 0.004]} s={[GW * 0.617, th * 0.995, 0.01]} c="#eee3c6" r={0.22} rad={0.003} e={j === 1 ? "#ff7a2a" : "#000"} ei={j === 1 ? 0.35 * s.heat * (0.5 + 0.5 * Math.sin(t * 2.4)) : 0} />
          </group>
          {/* junta de lechada entre azulejos (con los dos agujeros del taladro en la del medio) */}
          {j < 2 && <Box p={[-GW * 0.19, y0 + th + GJ / 2, zA + GT / 2]} s={[GW * 0.62, GJ, GT]} c="#a59d8b" r={0.95} rad={0.002} />}
        </group>;
      })}
      {/* la broca entrando por la junta de abajo del azulejo del medio hasta el aire de atrás */}
      {s.drill > 0.01 && <group position={[-GW * 0.3, th + GJ / 2, zT + 0.22 - 0.2 * ease(s.drillIn)]}>
        <Cyl p={[0, 0, 0]} r={0.006} h={0.3} c="#c9ccd0" m={0.9} rough={0.25} rot={[Math.PI / 2, 0, 0]} />
        <Box p={[0, 0, 0.22]} s={[0.08, 0.1, 0.14]} c="#2f6fd0" r={0.5} rad={0.015} op={s.drill} />
      </group>}
      {/* la medida de 5 mm: dos topes y la regla apoyada */}
      {s.gap > 0.01 && <>
        <Box p={[0, GH + 0.05, zT + 0.04]} s={[GW + 0.3, 0.02, 0.04]} c="#e8c27a" r={0.5} rad={0.004} op={s.gap} />
        <Box p={[GW / 2 + 0.06, GH / 2, zR + GA / 2]} s={[0.012, GH * 0.6, GA + 0.004]} c="#ffd60a" e="#ffb000" ei={0.6} r={0.4} rad={0.002} op={s.gap} />
      </>}
    </group>
  </group>;
};

// ---------------- EL MANUAL: páginas REALES del PDF (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas manual"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};
const PW = 0.29, PD = 0.438;
const uv = (u: number, v: number): V => [-PW / 2 + u * PW, 0.0009, -PD / 2 + v * PD];
const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  if (k <= 0.01) return null;
  const w = (u1 - u0) * PW * k, c = uv(u0, v);
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useCasaTex();
  const pg = useImgTex(["m1_p001", "m1_p016"]);
  const s = ST(t);
  const N = useMemo(() => Array.from({ length: 120 }, (_, i) => i), []);
  const zt = ZW + 0.006;
  // el golpecito recorre la pared azulejo por azulejo (centro y esquinas); el que suena hueco se ilumina
  const tapI = Math.floor(t / 0.62), tapPh = (t / 0.62) % 1;
  const tapC = s.tapC > 0.5 ? [7, 1] : [(4 + (tapI * 5) % 22), 1 + (tapI % 3)];
  const tapP = tc(tapC[0], tapC[1]), tapOff = s.tapCorner > 0.5 ? [((tapI % 2) - 0.5) * 0.09, (((tapI >> 1) % 2) - 0.5) * 0.09] : [0, 0];
  const hit = Math.max(0, 1 - Math.abs(tapPh - 0.35) * 6);
  const out = SP[5], brk = SP[4], st0 = SP[1];
  const outP = tc(out.c, out.r), brkP = tc(brk.c, brk.r), stP = tc(st0.c, st0.r);
  // el de la esquina: sale en la ventosa (outK) y queda boca abajo sobre la mesada; vuelve el de la caja (newT)
  const oK = ease(s.outK), back: V = [1.9, TOP + 0.036, ZW + 0.35];
  const outPos: V = [lerp(outP[0], back[0], ease(cl(oK * 1.6 - 0.6))), lerp(outP[1], back[1], ease(cl(oK * 1.6 - 0.6))), lerp(zt, back[2], ease(cl(oK * 2.2)))];
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.4} threshold={0.92} exposure={1.15} env={0.45} />
      <color attach="background" args={["#c9d6e2"]} />
      <fog attach="fog" args={["#d2dce6", 14, 40]} />
      <hemisphereLight args={[0xeef2f6, 0x7a6a58, 0.95]} />
      {/* la luz de la mañana entra de COSTADO por la ventana (derecha) y rasa los azulejos */}
      <directionalLight position={[6, 4.5, 1.5]} intensity={2.3} color="#ffe6c2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[-1.2, 2.3, 0.4]} intensity={1.4} distance={6} color="#fff3e2" />
      <pointLight position={[1.4, 2.3, 0.6]} intensity={1.2} distance={6} color="#fff1dc" />
      <pointLight position={[-1.42, TOP + 0.12, ZW + 0.3]} intensity={0.9 * s.heat} distance={1.6} color="#ff9a4a" />
      <pointLight position={[GIANT[0] + 1.2, 1.6, GIANT[2] + 1.0]} intensity={1.1 * s.giant} distance={4.5} color="#fff4e6" />
      <pointLight position={[GAR[0], 2.3, GAR[2] + 1.0]} intensity={1.3} distance={5} color="#ffe0b0" />

      {/* piso calcáreo, paredes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0.8]} receiveShadow><planeGeometry args={[6.4, 4.4]} /><meshStandardMaterial map={tt.floor} roughness={0.55} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#8a8578" roughness={0.97} /></mesh>
      <Box p={[0, HW / 2, ZW - 0.1]} s={[WX0 - X0 + 0.2, HW, 0.2]} c="#efe9dc" map={tt.wall} r={0.92} rad={0.01} rot={[0, 0, 0]} />
      <Box p={[(WX0 + WX1) / 2, WY0 / 2, ZW - 0.1]} s={[WX1 - WX0, WY0, 0.2]} c="#efe9dc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WX0 + WX1) / 2, (WY1 + HW) / 2, ZW - 0.1]} s={[WX1 - WX0, HW - WY1, 0.2]} c="#efe9dc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WX1 + X1 + 0.1) / 2, HW / 2, ZW - 0.1]} s={[X1 + 0.1 - WX1, HW, 0.2]} c="#efe9dc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[X1 + 0.1, HW / 2, ZW + 1.1]} s={[0.2, HW, 2.4]} c="#e8e1d2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[X0 - 0.1, HW / 2, ZW + 1.1]} s={[0.2, HW, 2.4]} c="#e8e1d2" map={tt.wall} r={0.92} rad={0.01} />
      {/* la ventana: marco de madera y el vidrio */}
      {[WX0, WX1, (WX0 + WX1) / 2].map((x, i) => <Box key={"wx" + i} p={[x, (WY0 + WY1) / 2, ZW - 0.05]} s={[0.05, WY1 - WY0, 0.08]} c="#7a5434" r={0.7} rad={0.008} />)}
      {[WY0, WY1].map((y, i) => <Box key={"wy" + i} p={[(WX0 + WX1) / 2, y, ZW - 0.05]} s={[WX1 - WX0, 0.05, 0.08]} c="#7a5434" r={0.7} rad={0.008} />)}
      <mesh position={[(WX0 + WX1) / 2, (WY0 + WY1) / 2, ZW - 0.07]}><planeGeometry args={[WX1 - WX0, WY1 - WY0]} /><meshStandardMaterial color="#e9f2f8" emissive="#fff6e4" emissiveIntensity={0.55} roughness={0.2} /></mesh>
      {/* reloj de cocina arriba */}
      <Cyl p={[-0.4, 2.25, ZW + 0.02]} r={0.13} h={0.03} c="#f4efe4" rough={0.4} rot={[Math.PI / 2, 0, 0]} />
      <Box p={[-0.4, 2.25 + 0.04, ZW + 0.04]} s={[0.008, 0.09, 0.004]} c="#222" r={0.5} rad={0.001} rot={[0, 0, -t * 0.002]} />

      {/* ===== LA PARED DE AZULEJOS ===== */}
      <mesh position={[(X0 + X1) / 2, (Y0 + Y1) / 2, ZW + 0.002]} receiveShadow><planeGeometry args={[X1 - X0, Y1 - Y0]} /><meshStandardMaterial map={tt.tiles} roughness={0.28} metalness={0.02} /></mesh>
      {/* la lechada nueva y el velo (punto 9): las juntas alrededor de los dos repuestos y un velo blanco que se limpia */}
      <Decal p={[brkP[0], brkP[1], zt + 0.008]} w={0.22} h={0.22} op={0.55 * s.haze} col="#f4f2ec" />
      <Decal p={[outP[0], outP[1], zt + 0.008]} w={0.22} h={0.22} op={0.55 * s.haze} col="#f4f2ec" />
      {/* la humedad del fregadero (punto 10) y la grieta diagonal */}
      <Decal p={[(KX0 + KX1) / 2, Y0 + 0.25, zt + 0.003]} w={1.2} h={0.6} map={tt.damp} op={s.wet} />
      <Decal p={[-0.4, (Y0 + Y1) / 2, zt + 0.003]} w={1.4} h={0.8} map={tt.crack} op={s.crack} />
      {/* el calor de la estufa en la pared (rasante naranja que respira) */}
      <Decal p={[-1.42, Y0 + 0.35, zt + 0.004]} w={1.0} h={0.75} op={0.28 * s.heat * (0.8 + 0.2 * Math.sin(t * 2))} col="#ff8a3a" add />

      {/* los seis azulejos huecos (piezas sueltas por delante del lienzo) */}
      {SP.map((q, i) => {
        const p = tc(q.c, q.r);
        const gone = q.k === "out" ? 1 : q.k === "brk" ? s.brokeK : 0;
        const holeOp = q.k === "inj" ? 0 : (q.k === "out" ? cl(oK * 3) : s.brokeK) * (1 - ease(s.newT));
        const wig = (q.k !== "inj" ? s.push : 0) * 0.004 * Math.sin(t * 9 + i);
        const pry = q.k === "brk" ? s.pry * (1 - s.brokeK) : 0;
        const glowK = s.glow * (0.6 + 0.4 * Math.sin(t * 4 + i));
        const tapeK = s.tape * (1 - s.tapeOff) * (q.k === "out" ? 1 - cl(oK * 4) : q.k === "brk" ? 1 - s.brokeK : 1);
        return <group key={i}>
          {/* el hueco: restos de adhesivo viejo → revoque limpio → adhesivo peinado */}
          {holeOp > 0.01 && <>
            <Decal p={[p[0], p[1], zt - 0.001]} w={TW} h={TW} map={tt.hole} op={holeOp * (1 - s.cleanW)} />
            <Decal p={[p[0], p[1], zt - 0.0005]} w={TW} h={TW} map={tt.clean} op={holeOp * s.cleanW * (1 - s.combW)} />
            <Decal p={[p[0], p[1], zt]} w={TW} h={TW} map={tt.comb} op={holeOp * s.combW} />
          </>}
          {/* el azulejo (el de la esquina viaja aparte) */}
          {q.k !== "out" && gone < 0.99 && <group position={[p[0] - TW / 2, p[1] - TW / 2, zt + wig + pry * 0.02]} rotation={[0, -pry * 0.25, 0]}>
            <Box p={[TW / 2, TW / 2, 0]} s={[TW, TW, 0.008]} c="#ffffff" map={tt.one} r={0.25} rad={0.002} e="#ffb347" ei={0.55 * glowK} op={1 - gone} />
          </group>}
          {q.k === "out" && s.newT < 0.99 && <group position={oK > 0.01 ? outPos : [p[0], p[1], zt + wig]} rotation={[Math.PI / 2 * ease(cl(oK * 1.6 - 0.6)), 0, 0]}>
            <Box p={[0, 0, 0]} s={[TW, TW, 0.008]} c="#ffffff" map={tt.one} r={0.25} rad={0.002} e="#ffb347" ei={0.55 * glowK * (1 - oK)} />
            <Box p={[0, 0, -0.0045]} s={[TW * 0.98, TW * 0.98, 0.001]} c="#ffffff" map={tt.back} r={0.9} rad={0.0005} op={cl(oK * 3)} />
            {/* el dorso con las cuatro pelotitas (se ve cuando queda boca abajo... y lo damos vuelta en «back») */}
            <mesh position={[0, 0, -0.0045]} rotation={[0, Math.PI, 0]}><planeGeometry args={[TW, TW]} /><meshStandardMaterial map={tt.back} roughness={0.9} /></mesh>
            {s.suction > 0.01 && <group position={[0, 0, 0.004]}>
              <Cyl p={[0, 0, 0.012]} r={0.05} r2={0.055} h={0.02} c="#d23a2a" rough={0.5} rot={[Math.PI / 2, 0, 0]} op={s.suction} />
              <Cyl p={[0, 0, 0.06]} r={0.012} h={0.09} c="#3a3a3c" rough={0.4} rot={[Math.PI / 2, 0, 0]} op={s.suction} />
            </group>}
          </group>}
          {/* el repuesto de la caja del garaje (mismo crema) */}
          {q.k !== "inj" && s.newT > 0.01 && <group position={[p[0], p[1], zt + 0.15 * (1 - ease(s.newT)) + (s.slide > 0 ? -0.0 : 0)]}>
            <Box p={[0, -0.012 * s.slide * Math.max(0, Math.sin(t * 1.5)), 0]} s={[TW, TW, 0.008]} c="#ffffff" map={tt.one} r={0.25} rad={0.002} />
          </group>}
          {/* la cinta de pintor (y la cinta nueva que sostiene el repuesto) */}
          <Tape p={[p[0] + 0.02, p[1] + 0.03, zt + 0.006]} w={0.06} h={0.03} rz={0.2} op={tapeK} />
          {q.k !== "inj" && <Tape p={[p[0], p[1], zt + 0.007]} w={0.03} h={0.24} op={s.tapeNew * (1 - s.tapeOff)} />}
          {/* cinta en cruz de lado a lado (sostiene el inyectado 24 h) */}
          {q.k === "inj" && <><Tape p={[p[0], p[1], zt + 0.007]} w={0.42} h={0.035} rz={0.785} op={s.cross} /><Tape p={[p[0], p[1], zt + 0.0072]} w={0.42} h={0.035} rz={-0.785} op={s.cross} /></>}
          {/* los dos agujeros en la junta, esquinas opuestas (abajo-izquierda y arriba-derecha) */}
          {q.k === "inj" && s.holes > 0.01 && [[-1, -1], [1, 1]].map(([sx, sy], h2) => <mesh key={h2} position={[p[0] + sx * TP / 2 * 0.86, p[1] + sy * TP / 2, zt + 0.005]}><circleGeometry args={[0.0045, 16]} /><meshBasicMaterial color={s.fill > 0.5 && h2 === 1 ? "#e0a640" : "#2a2622"} transparent opacity={s.holes * (1 - s.groutK)} /></mesh>)}
          {/* el epoxi que asoma por el agujero de arriba */}
          {q.k === "inj" && s.inject > 0.01 && <mesh position={[p[0] + TP / 2 * 0.86, p[1] + TP / 2, zt + 0.007]}><sphereGeometry args={[0.008 * ease(s.injK), 12, 10]} /><meshStandardMaterial color="#e0a640" roughness={0.2} /></mesh>}
          {/* crucetas en las juntas del repuesto */}
          {q.k !== "inj" && s.spacer > 0.01 && [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1]].map(([sx, sy], h2) => <group key={"x" + h2} position={[p[0] + sx * TP / 2, p[1] + sy * TP / 2, zt + 0.007]}>
            <Box p={[0, 0, 0]} s={[0.028, 0.004, 0.006]} c="#f8f8f6" r={0.5} rad={0.001} op={s.spacer} /><Box p={[0, 0, 0]} s={[0.004, 0.028, 0.006]} c="#f8f8f6" r={0.5} rad={0.001} op={s.spacer} />
          </group>)}
        </group>;
      })}
      {/* el azulejo del fregadero partido en dos, sobre la mesada */}
      {s.brokeK > 0.01 && s.newT < 0.99 && [[-1, 0.15], [1, -0.2]].map(([sd, r], i) => <Box key={"bk" + i} p={[brkP[0] + 0.32 + sd * 0.06, TOP + 0.035, ZW + 0.3 + sd * 0.02]} s={[TW / 2 - 0.004, 0.008, TW]} rot={[0, r, 0]} c="#ffffff" map={tt.one} r={0.25} rad={0.002} op={s.brokeK} />)}

      {/* el golpecito: el destornillador al revés y las ondas (sordo = cortas; hueco = largas y doradas) */}
      {s.tap > 0.01 && <>
        <Driver p={[tapP[0] + tapOff[0], tapP[1] + tapOff[1], zt + 0.01 + 0.03 * (1 - hit)]} rot={[0.2, -0.15, 0]} />
        {[0, 1, 2].map((r) => { const ph = (tapPh + r * 0.18) % 1; return <Ring key={r} p={[tapP[0] + tapOff[0], tapP[1] + tapOff[1], zt + 0.004]} r={0.02 + ph * (s.tapC > 0.5 ? 0.2 : 0.07)} op={s.tap * (1 - ph) * 0.8} col={s.tapC > 0.5 ? "#ffcf5a" : "#cfd8de"} />; })}
      </>}
      {/* la palma que empuja el azulejo (punto 1: ¿se mueve o no?) */}
      {s.push > 0.01 && <group position={[outP[0] - 0.02, outP[1] + 0.06, zt + 0.05 + 0.02 * Math.sin(t * 3)]}>
        <Box p={[0, 0, 0]} s={[0.1, 0.12, 0.03]} c="#c99a78" r={0.65} rad={0.02} op={s.push} />
        {[0, 1, 2, 3].map((f) => <Box key={f} p={[-0.036 + f * 0.024, 0.1, 0]} s={[0.018, 0.08, 0.02]} c="#c99a78" r={0.65} rad={0.008} op={s.push} />)}
      </group>}
      {/* el taladro derecho contra la junta */}
      {s.drillW > 0.01 && <group position={[stP[0] - TP / 2 * 0.86, stP[1] - TP / 2, zt + 0.22 - 0.04 * Math.abs(Math.sin(t * 1.2))]}>
        <Cyl p={[0, 0, -0.1]} r={0.003} h={0.12} c="#c9ccd0" m={0.9} rough={0.25} rot={[Math.PI / 2, 0, 0]} />
        <Box p={[0, 0, 0.0]} s={[0.07, 0.08, 0.14]} c="#2f6fd0" r={0.5} rad={0.015} op={s.drillW} />
        <Box p={[0, -0.09, 0.03]} s={[0.05, 0.13, 0.05]} c="#1e1e20" r={0.6} rad={0.012} op={s.drillW} />
      </group>}
      {/* la jeringa de 20 ml con el epoxi ámbar, apoyada en el agujero de abajo */}
      {s.inject > 0.01 && <group position={[stP[0] - TP / 2 * 0.86, stP[1] - TP / 2 - 0.01, zt + 0.1]} rotation={[0.35, 0, 0]}>
        <Cyl p={[0, 0, 0]} r={0.014} h={0.14} c="#e9f2f6" rough={0.1} rot={[Math.PI / 2, 0, 0]} op={0.45 * s.inject} />
        <Cyl p={[0, 0, -0.01 - 0.04 * ease(s.injK)]} r={0.012} h={0.1 * (1 - 0.6 * ease(s.injK))} c="#e0a640" rough={0.3} rot={[Math.PI / 2, 0, 0]} op={s.inject} />
        <Cyl p={[0, 0, -0.085]} r={0.003} h={0.03} c="#e9f2f6" rough={0.1} rot={[Math.PI / 2, 0, 0]} op={0.7 * s.inject} />
        <Cyl p={[0, 0, 0.08 - 0.06 * ease(s.injK)]} r={0.016} h={0.01} c="#d8dde0" rough={0.4} rot={[Math.PI / 2, 0, 0]} op={s.inject} />
      </group>}
      {/* el palo de escoba en diagonal con el trapo (sostiene el inyectado) */}
      {s.brace > 0.01 && <group>
        <Cyl p={[stP[0], (stP[1] + TOP) / 2 + 0.02, (zt + ZW + 0.5) / 2]} r={0.013} h={Math.hypot(stP[1] - TOP, 0.5)} c="#c49a64" rough={0.7} rot={[-Math.atan2(0.5, stP[1] - TOP), 0, 0]} op={s.brace} />
        <Box p={[stP[0], stP[1], zt + 0.016]} s={[0.12, 0.1, 0.02]} c="#d9c9a8" r={0.95} rad={0.01} op={s.brace} />
      </group>}
      {/* el rascador de juntas que recorre los cuatro costados del azulejo del fregadero, con polvito */}
      {s.scrape > 0.01 && (() => { const u = (t * 0.35) % 1, side = Math.floor(u * 4), f = (u * 4) % 1;
        const pts: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]];
        const a = pts[side], b = pts[side + 1], x = brkP[0] + lerp(a[0], b[0], f) * TP / 2, y = brkP[1] + lerp(a[1], b[1], f) * TP / 2;
        return <group>
          <group position={[x, y, zt + 0.05]} rotation={[0.5, 0.4, 0]}><Box p={[0, 0, 0]} s={[0.03, 0.03, 0.12]} c="#e2a21a" r={0.5} rad={0.008} op={s.scrape} /><Box p={[0, 0, -0.07]} s={[0.004, 0.02, 0.04]} c="#c9ccd0" m={0.9} r={0.3} rad={0.001} op={s.scrape} /></group>
          <Dots pts={N.slice(0, 50).map((i) => { const ph = (t * 0.9 + rnd(i, 21)) % 1; return [x + (rnd(i, 22) - 0.5) * 0.1, y - ph * 0.35, zt + 0.02 + ph * 0.1, s.scrape * (1 - ph) * 0.8] as [number, number, number, number]; })} col="#cfc8ba" size={0.012} glow={tx.flake} />
        </group>; })()}
      {/* la espátula fina haciendo palanca contra la pared */}
      {s.pry > 0.01 && <group position={[brkP[0] + TP / 2, brkP[1], zt + 0.03]} rotation={[0, -0.9, 0]}><Box p={[0, 0, 0.06]} s={[0.07, 0.002, 0.12]} c="#c9ccd0" m={0.85} r={0.3} rad={0.001} rot={[Math.PI / 2, 0, 0]} op={s.pry} /><Box p={[0, 0, 0.15]} s={[0.03, 0.025, 0.09]} c="#3a2a1a" r={0.6} rad={0.008} op={s.pry} /></group>}
      {/* la llana dentada peinando el hueco */}
      {s.combT > 0.01 && <group position={[outP[0] + 0.05 * Math.sin(t * 2), outP[1], zt + 0.04]} rotation={[0, 0, 0.1]}><Box p={[0, 0, 0]} s={[0.16, 0.1, 0.004]} c="#c9ccd0" m={0.85} r={0.3} rad={0.001} op={s.combT} /><Box p={[0, 0, 0.04]} s={[0.1, 0.03, 0.05]} c="#5a3e28" r={0.6} rad={0.008} op={s.combT} /></group>}
      {/* el nivel / la tablita cruzada sobre el repuesto */}
      {s.level > 0.01 && <group position={[outP[0] - 0.12, outP[1], zt + 0.018]}><Box p={[0, 0, 0]} s={[0.5, 0.05, 0.025]} c="#f0c419" r={0.4} rad={0.006} op={s.level} /><Box p={[0, 0, 0.013]} s={[0.05, 0.022, 0.003]} c="#7dff9e" e="#2aff7a" ei={0.5} r={0.2} rad={0.002} op={s.level} /></group>}
      {/* la lechada nueva: llana de goma en diagonal */}
      {s.grout > 0.01 && <group position={[brkP[0] + 0.06 * Math.sin(t * 1.8), brkP[1] + 0.04 * Math.cos(t * 1.8), zt + 0.03]} rotation={[0, 0, 0.785]}><Box p={[0, 0, 0]} s={[0.2, 0.09, 0.012]} c="#2e2e30" r={0.7} rad={0.01} op={s.grout} /><Box p={[0, 0, 0.03]} s={[0.06, 0.03, 0.05]} c="#e05a2a" r={0.5} rad={0.01} op={s.grout} /></group>}

      {/* la mesada, la estufa enlozada, la pileta y la canilla */}
      <Box p={[(X0 + SX0) / 2, TOP / 2, ZW + CD / 2]} s={[SX0 - X0, TOP, CD]} c="#e9e2d2" r={0.6} rad={0.01} />
      <Box p={[(SX1 + X1) / 2, TOP / 2, ZW + CD / 2]} s={[X1 - SX1, TOP, CD]} c="#e9e2d2" r={0.6} rad={0.01} />
      <Box p={[(X0 + SX0) / 2, TOP + 0.015, ZW + CD / 2 + 0.02]} s={[SX0 - X0, 0.03, CD + 0.04]} c="#6f6a62" r={0.35} rad={0.006} />
      <Box p={[(SX1 + KX0) / 2, TOP + 0.015, ZW + CD / 2 + 0.02]} s={[KX0 - SX1, 0.03, CD + 0.04]} c="#6f6a62" r={0.35} rad={0.006} />
      <Box p={[(KX1 + X1) / 2, TOP + 0.015, ZW + CD / 2 + 0.02]} s={[X1 - KX1, 0.03, CD + 0.04]} c="#6f6a62" r={0.35} rad={0.006} />
      <Box p={[(KX0 + KX1) / 2, TOP - 0.08, ZW + CD / 2]} s={[KX1 - KX0, 0.16, CD - 0.1]} c="#c9cdd0" m={0.85} r={0.25} rad={0.01} />
      <Cyl p={[(KX0 + KX1) / 2, TOP + 0.16, ZW + 0.08]} r={0.012} h={0.3} c="#d9dde0" m={0.9} rough={0.2} />
      <Cyl p={[(KX0 + KX1) / 2, TOP + 0.3, ZW + 0.16]} r={0.011} h={0.18} c="#d9dde0" m={0.9} rough={0.2} rot={[Math.PI / 2, 0, 0]} />
      {/* la estufa: cuerpo blanco enlozado, horno y cuatro hornallas (las llamas suben con el calor) */}
      <Box p={[(SX0 + SX1) / 2, TOP / 2, ZW + CD / 2]} s={[SX1 - SX0 - 0.01, TOP, CD]} c="#f2f0ea" r={0.18} m={0.05} rad={0.02} />
      <Box p={[(SX0 + SX1) / 2, 0.42, ZW + CD + 0.005]} s={[0.56, 0.4, 0.01]} c="#2a2a2c" r={0.15} m={0.3} rad={0.01} />
      <Box p={[(SX0 + SX1) / 2, TOP + 0.1, ZW + 0.04]} s={[SX1 - SX0 - 0.01, 0.2, 0.06]} c="#f2f0ea" r={0.2} rad={0.015} />
      {[[-0.17, 0.18], [0.17, 0.18], [-0.17, 0.42], [0.17, 0.42]].map(([dx, dz], i) => <group key={"hb" + i} position={[(SX0 + SX1) / 2 + dx, TOP + 0.012, ZW + dz]}>
        <Cyl p={[0, 0, 0]} r={0.07} h={0.012} c="#1e1e20" rough={0.4} m={0.4} />
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.035, 0.05, 24]} /><meshBasicMaterial color="#4f8dff" transparent opacity={0.85 * s.heat * (i < 2 ? 1 : 0.6)} toneMapped={false} /></mesh>
      </group>)}
      {/* la pava y una olla */}
      <Cyl p={[(SX0 + SX1) / 2 - 0.17, TOP + 0.1, ZW + 0.18]} r={0.08} r2={0.1} h={0.16} c="#c9cdd0" m={0.85} rough={0.25} />
      <Cyl p={[(SX0 + SX1) / 2 + 0.17, TOP + 0.08, ZW + 0.42]} r={0.11} h={0.13} c="#b8452e" rough={0.35} />
      {/* frasco, tabla y rollo de cinta sobre la mesada */}
      <Cyl p={[-2.2, TOP + 0.09, ZW + 0.2]} r={0.05} h={0.16} c="#d9c9a0" rough={0.3} />
      <Box p={[-0.4, TOP + 0.04, ZW + 0.2]} s={[0.35, 0.02, 0.22]} c="#b88b58" r={0.7} rad={0.006} rot={[0, 0.1, 0]} />
      <mesh position={[0.2, TOP + 0.045, ZW + 0.32]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.035, 0.014, 10, 24]} /><meshStandardMaterial color="#3d8fe0" roughness={0.7} /></mesh>
      {/* la mesita con el MANUAL DEL ALBAÑIL: se abre en la página 16 */}
      <Box p={[BOOK[0], 0.72, BOOK[2]]} s={[0.9, 0.04, 0.6]} c="#9a7a56" r={0.6} rad={0.01} />
      {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z], i) => <Box key={"m" + i} p={[BOOK[0] + x, 0.35, BOOK[2] + z]} s={[0.04, 0.7, 0.04]} c="#5a3e28" r={0.6} rad={0.006} />)}
      {s.book > 0.01 && pg.m1_p001 && <Book p={[BOOK[0] - 0.12, BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.08} open={s.open} cover={pg.m1_p001} inside={pg.m1_p016_r} right={pg.m1_p016} spine="#e8a21a">
        {s.open > 0.9 && <>
          <PageHi k={s.hi[0]} u0={0.07} u1={0.93} v={0.786} h={0.11} />
          <PageHi k={s.hi[1]} u0={0.07} u1={0.93} v={0.51} h={0.095} col="#ff9a4a" />
          <PageHi k={s.hi[2]} u0={0.07} u1={0.93} v={0.596} h={0.065} col="#7dff9e" />
        </>}
      </Book>}

      {/* ===== EL GARAJE: el estante, las latas viejas y la caja «COCINA 79» ===== */}
      <group position={GAR}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.6]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial color="#8d887e" map={tx.concrete} roughness={0.95} /></mesh>
        <Box p={[0, 1.4, -0.9]} s={[3.2, 2.8, 0.15]} c="#b8ae9c" map={tt.rev} r={0.95} rad={0.01} />
        {[0.5, 1.15, 1.8].map((y, i) => <Box key={"sh" + i} p={[0, y, -0.6]} s={[2.2, 0.04, 0.5]} c="#8a6a48" r={0.75} rad={0.006} />)}
        {[-0.9, 0.9].map((x, i) => <Box key={"sp" + i} p={[x, 1.0, -0.6]} s={[0.05, 2.0, 0.5]} c="#6a5038" r={0.75} rad={0.006} />)}
        {[[-0.6, 0.62], [-0.35, 0.62], [0.5, 1.27], [-0.2, 1.92], [0.15, 1.92]].map(([x, y], i) => <Cyl key={"lt" + i} p={[x, y + 0.1, -0.55 + (i % 2) * 0.1]} r={0.1} h={0.2} c={["#8a8f94", "#a07a52", "#7a8a6a", "#9a9ea2", "#b08a5a"][i]} m={0.6} rough={0.5} />)}
        {/* la caja, atrás de las latas de arriba; se baja y se abre (12 → 11) */}
        <group position={[lerp(0.45, 0.2, ease(s.boxK)), lerp(1.95, 1.2, ease(s.boxK)), lerp(-0.68, -0.3, ease(s.boxK))]}>
          <Box p={[0, 0, 0]} s={[0.36, 0.2, 0.36]} c="#a8814f" r={0.9} rad={0.01} />
          <mesh position={[0, 0, 0.181]}><planeGeometry args={[0.32, 0.16]} /><meshStandardMaterial map={tt.label} roughness={0.95} /></mesh>
          {s.boxOpen > 0.01 && Array.from({ length: s.boxLeft }, (_, i) => <Box key={"bt" + i} p={[-0.08 + (i % 2) * 0.16, 0.06 + Math.floor(i / 2) * 0.004 + 0.06 * ease(s.boxOpen), 0]} s={[TW, 0.008, TW]} c="#ffffff" map={tt.one} r={0.25} rad={0.002} op={s.boxOpen} />)}
        </group>
      </group>

      {/* ===== LA PARED GIGANTE EN CORTE ===== */}
      <Giant t={t} s={s} tt={tt} glow={tx.flake} />
    </ThreeCanvas>
  );
};
