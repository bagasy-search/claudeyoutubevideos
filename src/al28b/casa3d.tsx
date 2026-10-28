// al28b · EL MUNDO: el baño y la cocina de Doña Marta en corte (sin la pared del frente), de mañana, con la luz de las ventanitas de costado.
// Baño a la izquierda: la ducha en la esquina y, en el TECHO, el moho de puntitos negros donde la losa se junta con la pared de afuera
// (la firma de la condensación); el aluminio 30 x 30 pegado con cinta, la escalera, el vinagre, el cepillo, el fijador, las dos manos
// de antihongos, el extractor con temporizador y la ventanita. Cocina a la derecha: la AUREOLA marrón con anillos (la filtración), y
// arriba la terraza con el desagüe tapado de hojas. Adelante, EL TECHO GIGANTE EN CORTE (losa fría, revoque, pintura): el vapor que se
// hace gota, las raíces del moho, la lavandina que sólo blanquea, el vinagre, la pintura esponja vs antihongos, el aislante y el agua que camina.
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
// pared de afuera (fondo): cara de adentro en z=-2.9; baño x -4/0 (ducha en la esquina x -4/-2.9), tabique en x 0, cocina x 0/4; losa abajo en y=HW
const ZW = -2.9, HW = 2.5, LZ0 = -3.0, LZ1 = -0.55, LT = 0.18;
// la ventanita del baño (alta, en la pared de afuera) y la de la cocina
const BW0 = -2.25, BW1 = -1.45, BY0 = 1.75, BY1 = 2.25;
const KW0 = 2.9, KW1 = 3.7, KY0 = 1.05, KY1 = 2.05;
// la esquina del moho (techo + pared de afuera, arriba de la ducha) y la aureola de la cocina
const MX = -3.45, MZ = -2.45, RX = 2.65, RZ = -2.2;
// el techo GIGANTE en corte (adelante, al centro): losa de hormigón, revoque y pintura abajo, la terraza arriba
export const GIANT: V = [0, 0, 1.3];
const GW = 2.6, GD = 0.7, GY = 1.12, GS = 0.4, GR = 0.07, GP = 0.014;   // ancho, profundidad, piso de la losa, losa, revoque, pintura
export const BOOK: V = [2.55, 0.76, 0.6];

// ---------------- puntos del mundo (rótulos HTML) ----------------
export const PT = {
  mold: [MX, HW - 0.01, MZ] as V,
  foil: [MX, HW - 0.01, MZ] as V,
  ring: [RX, HW - 0.01, RZ] as V,
  fan: [-3.4, 2.15, ZW + 0.05] as V,
  window: [(BW0 + BW1) / 2, (BY0 + BY1) / 2, ZW] as V,
  drain: [2.9, HW + LT + 0.05, -2.6] as V,
  giant: [GIANT[0], GY, GIANT[2] + GD / 2] as V,
  book: BOOK,
};

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
const useCasaTex = () => useMemo(() => ({
  // pintura blanca del baño (látex con el grano del revoque)
  wall: mk(512, 512, (g) => {
    g.fillStyle = "#eeeae2"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5200; i++) { const v = 215 + rnd(i, 1) * 35; g.fillStyle = `rgba(${v},${v - 4},${v - 12},.35)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [3, 2]),
  // azulejo blanco 15x15 del baño (con la junta gris)
  tile: mk(512, 512, (g) => {
    g.fillStyle = "#9da3a6"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = 236 + rnd(r * 8 + c, 1) * 14; g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(c * 64 + 6, r * 64 + 5, 22, 6); }
  }, [6, 4]),
  // azulejo verde agua de la cocina (años 70)
  ktile: mk(512, 512, (g) => {
    g.fillStyle = "#7d8a83"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = rnd(r * 8 + c, 2) * 14; g.fillStyle = `rgb(${150 + v},${196 + v},${182 + v})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
  }, [6, 2]),
  // EL MOHO: puntitos negros parejos, más apretados en la esquina (abajo a la izquierda del lienzo = la esquina con la pared de afuera)
  mold: mk(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    const gr = g.createRadialGradient(0, 512, 20, 0, 512, 460); gr.addColorStop(0, "rgba(70,74,60,.42)"); gr.addColorStop(1, "rgba(70,74,60,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      const d = Math.pow(rnd(i, 1), 1.7) * 470, a = rnd(i, 2) * Math.PI / 2, x = Math.cos(a) * d, y = 512 - Math.sin(a) * d;
      const r = 0.8 + rnd(i, 3) * (2.6 - d / 300); if (r <= 0.3) continue;
      g.fillStyle = `rgba(${18 + rnd(i, 4) * 20},${22 + rnd(i, 5) * 22},${16 + rnd(i, 6) * 14},${0.55 + 0.45 * rnd(i, 7)})`; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
    }
  }),
  // la AUREOLA de la filtración: anillos marrón amarillento con el centro más claro (cada anillo = una lluvia)
  ring: mk(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    const inner = g.createRadialGradient(256, 256, 10, 256, 256, 230); inner.addColorStop(0, "rgba(214,196,150,.35)"); inner.addColorStop(1, "rgba(214,196,150,0)"); g.fillStyle = inner; g.fillRect(0, 0, 512, 512);
    g.lineCap = "round";
    for (let k = 0; k < 3; k++) {
      const R = 120 + k * 50; g.beginPath();
      for (let i = 0; i <= 90; i++) { const a = (i / 90) * Math.PI * 2, rr = R + 14 * Math.sin(a * 3 + k) + 9 * Math.sin(a * 7 + k * 2); const x = 256 + Math.cos(a) * rr, y = 256 + Math.sin(a) * rr * 0.86; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.strokeStyle = `rgba(140,96,40,${0.75 - k * 0.12})`; g.lineWidth = 9 - k * 2; g.stroke(); g.strokeStyle = "rgba(190,150,80,.35)"; g.lineWidth = 22 - k * 4; g.stroke();
    }
  }),
  // piso de cerámico gris del baño / calcáreo de la cocina
  floor: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#a9a49a" : "#8f897e"; g.fillRect(c * 64, r * 64, 64, 64); }
    g.strokeStyle = "rgba(40,30,20,.4)"; g.lineWidth = 2; for (let k = 0; k <= 512; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 512); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(512, k); g.stroke(); }
  }, [4, 3]),
  // baldosa de la terraza (cerámico rojo gastado) y las hojas secas del árbol del vecino
  terr: mk(512, 512, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 3) * 24; g.fillStyle = `rgb(${150 + v},${78 + v * 0.5},${58 + v * 0.3})`; g.fillRect(c * 128 + 3, r * 128 + 3, 122, 122); }
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(60,40,30,${0.15 * rnd(i, 4)})`; g.fillRect(rnd(i, 5) * 512, rnd(i, 6) * 512, 3, 3); }
  }, [4, 3]),
  leaves: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) { g.save(); g.translate(30 + rnd(i, 1) * 196, 30 + rnd(i, 2) * 196); g.rotate(rnd(i, 3) * 6.3); g.fillStyle = `rgb(${120 + rnd(i, 4) * 60},${80 + rnd(i, 5) * 50},${30 + rnd(i, 6) * 20})`; g.beginPath(); g.ellipse(0, 0, 14, 6, 0, 0, 6.3); g.fill(); g.restore(); }
  }),
  // revoque (corte del techo gigante) y la placa de aislante
  rev: mk(256, 256, (g) => {
    g.fillStyle = "#c9c2b4"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) { const v = 150 + rnd(i, 1) * 80; g.fillStyle = `rgba(${v},${v - 6},${v - 16},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 2.5, 1 + rnd(i, 5) * 2.5); }
  }, [3, 1]),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 24, r2, op }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
// plano pegado a una pared (z fijo, mirando +z o girado)
const Decal: React.FC<{ p: V; w: number; h: number; map: THREE.Texture; op: number; rotY?: number; rotX?: number; col?: string }> = ({ p, w, h, map, op, rotY = 0, rotX = 0, col = "#fff" }) =>
  op < 0.01 ? null : <mesh position={p} rotation={[rotX, rotY, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={map} color={col} transparent opacity={op} depthWrite={false} roughness={0.9} polygonOffset polygonOffsetFactor={-2} /></mesh>;

// partículas (gotas de lluvia de la canaleta, polvo de la V)
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

// ---------------- EL TECHO GIGANTE EN CORTE ----------------
// la losa de hormigón (fría), el revoque y la pintura abajo, la terraza arriba. Abajo el aire tibio del baño con vapor.
// cond: el vapor sube y se hace gotitas en la losa fría · roots: las raíces del moho dentro del revoque · bleachG: la lavandina
// blanquea los puntitos pero las raíces siguen y toman el agua · vin: el vinagre llega a la raíz · sponge: pintura barata que chupa
// · anti: antihongos, el agua resbala · insulG: placa de aislante · filt: el agua que entra por la terraza y camina por la losa
// · foilG + side: la prueba del aluminio (0 = gotitas abajo, condensación · 1 = mojado arriba, filtración)
const Giant: React.FC<{ t: number; s: ReturnType<typeof ST>; tt: ReturnType<typeof useCasaTex>; glow: THREE.Texture; conc?: THREE.Texture }> = ({ t, s, tt, glow, conc }) => {
  const k = ease(s.giant);
  const bot = GY - GR - GP;                                           // la cara de abajo (la pintura)
  const vap = useMemo(() => Array.from({ length: 90 }, (_, i) => i), []);
  const roots = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ x: -1.15 + rnd(i, 1) * 1.6, z: (rnd(i, 2) - 0.5) * GD * 0.8, h: 0.35 + rnd(i, 3) * 0.6, a: (rnd(i, 4) - 0.5) * 0.5 })), []);
  const spots = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ x: -1.2 + Math.pow(rnd(i, 5), 1.3) * 1.7, z: (rnd(i, 6) - 0.5) * GD * 0.9, r: 0.008 + rnd(i, 7) * 0.012 })), []);
  const drops = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ x: -1.2 + (i / 21) * 2.4 + (rnd(i, 8) - 0.5) * 0.06, z: (rnd(i, 9) - 0.5) * GD * 0.8, d: rnd(i, 10) })), []);
  if (k < 0.01) return null;
  const condK = s.cond * (1 - 0.85 * s.insulG);
  const pz = GD / 2;
  const paintCol = new THREE.Color("#f3f0ea").lerp(new THREE.Color("#a9c6e2"), s.sponge * 0.75).getStyle();
  // el camino del agua de la filtración: entra por la fisura de la terraza (x 0,75), baja, camina por adentro de la losa y sale en x -0,45
  const path = (u: number): V => {
    if (u < 0.3) { const q = u / 0.3; return [0.75, GY + GS + 0.02 - q * GS * 0.7, 0]; }
    if (u < 0.8) { const q = (u - 0.3) / 0.5; return [0.75 - q * 1.2, GY + GS * 0.3 - 0.03 * Math.sin(q * 6), 0]; }
    const q = (u - 0.8) / 0.2; return [-0.45, GY + GS * 0.3 - q * (GS * 0.3 + GR + GP + 0.02), 0];
  };
  return <group position={[GIANT[0], (1 - k) * -0.6, GIANT[2]]} scale={[1, k, 1]}>
    {/* pie de exhibición */}
    <Box p={[0, (GY - 0.3) / 2, 0]} s={[0.12, GY - 0.3, 0.12]} c="#3a3d42" r={0.5} m={0.6} rad={0.01} />
    <Box p={[0, 0.03, 0]} s={[0.9, 0.06, 0.6]} c="#3a3d42" r={0.5} m={0.6} rad={0.02} />
    {/* la losa de hormigón; con «cold» se pone azulada (está fría como una heladera) */}
    <Box p={[0, GY + GS / 2, 0]} s={[GW, GS, GD]} c="#b4b6b8" map={conc} r={0.95} rad={0.008} e="#5aa0ff" ei={0.22 * s.cold} />
    {/* la terraza arriba (baldosa) con la fisura finita */}
    <Box p={[0, GY + GS + 0.02, 0]} s={[GW, 0.04, GD]} c="#c98a6c" map={tt.terr} r={0.8} rad={0.006} />
    <Box p={[0.75, GY + GS + 0.035, pz - 0.001]} s={[0.012, 0.05, 0.004]} c="#120c08" r={1} rad={0.001} />
    {/* revoque y pintura (la cara que ves desde el baño) */}
    <Box p={[0, GY - GR / 2, 0]} s={[GW, GR, GD]} c="#cbc3b4" map={tt.rev} r={1} rad={0.004} />
    <Box p={[0, GY - GR - GP / 2, 0]} s={[GW, GP + 0.006 * s.sponge, GD + 0.004]} c={paintCol} r={1 - 0.75 * s.anti} rad={0.003} />
    {/* LAS RAÍCES del moho dentro del revoque (se ven en el corte); el vinagre las seca */}
    {Math.max(s.roots, s.bleachG, s.vin) > 0.01 && roots.map((r, i) => {
      const L = GR * r.h * ease(Math.max(s.roots, s.bleachG, s.vin)) * (1 - 0.6 * s.vin);
      return <Box key={"r" + i} p={[r.x + Math.sin(r.a) * L / 2, bot + L / 2, r.z]} s={[0.006, L, 0.006]} rot={[0, 0, -r.a]} c={s.vin > 0.5 ? "#8d8a80" : "#1f2a18"} r={1} rad={0.001} cast={false} />;
    })}
    {/* los puntitos negros en la pintura: la lavandina los BLANQUEA (desaparecen) pero las raíces siguen */}
    {spots.map((p, i) => { const op = (1 - 0.95 * s.bleachG) * (1 - 0.8 * s.vin) * (1 - s.anti); return op > 0.02 ? <mesh key={"s" + i} position={[p.x, bot - 0.003, p.z]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[p.r, 10]} /><meshBasicMaterial color="#141810" transparent opacity={op} depthWrite={false} /></mesh> : null; })}
    {/* la lavandina es casi toda agua: gotitas azules que suben por las raíces (les da de tomar) */}
    {s.bleachG > 0.01 && <Dots pts={roots.slice(0, 14).map((r, i) => { const ph = (t * 0.5 + rnd(i, 11)) % 1; return [r.x, bot + ph * GR * r.h * 0.9, r.z, s.bleachG * 0.9] as [number, number, number, number]; })} col="#5fb4ff" size={0.035} glow={glow} />}
    {/* el aire tibio con vapor que sube de la ducha */}
    {condK > 0.01 && <Dots pts={vap.map((i) => { const ph = (t * (0.18 + rnd(i, 1) * 0.12) + rnd(i, 2)) % 1; return [(rnd(i, 3) - 0.5) * GW * 0.95, 0.25 + ph * (bot - 0.3), (rnd(i, 4) - 0.5) * GD, condK * 0.55 * Math.sin(Math.PI * ph)] as [number, number, number, number]; })} col="#ffd9b0" size={0.09} glow={glow} />}
    {/* LAS GOTITAS: el vapor toca la losa fría y se hace agua (con antihongos resbalan hacia el costado) */}
    {(condK > 0.01 || s.foilG > 0.01) && drops.map((d, i) => {
      const underFoil = Math.abs(d.x) < 0.3;
      const amt = Math.max(condK, underFoil ? s.foilG * (1 - s.side) * 0.9 : 0) * (0.55 + 0.45 * d.d);
      if (amt < 0.02) return null;
      const slide = s.anti * ((t * 0.15 + d.d) % 1) * 0.3;
      const y = underFoil && s.foilG > 0.01 ? bot - 0.012 : bot;
      return <mesh key={"d" + i} position={[d.x + slide, y - 0.012 * amt, d.z]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.012 + 0.016 * amt, 14, 10]} /><meshStandardMaterial color="#cfe6ff" roughness={0.05} metalness={0.1} transparent opacity={0.75} /></mesh>;
    })}
    {/* la PLACA DE AISLANTE pegada abajo: el aire tibio ya no toca el hormigón frío */}
    {s.insulG > 0.01 && <Box p={[0, bot - 0.028, 0]} s={[GW * ease(s.insulG), 0.05, GD * 0.98]} c="#efe2a8" r={0.9} rad={0.006} />}
    {/* LA FILTRACIÓN: el agua entra por la fisura, camina por adentro de la losa y aparece lejos */}
    {s.filt > 0.01 && <Dots pts={Array.from({ length: 50 }, (_, i) => { const u = (t * 0.12 + i / 50) % 1; const p = path(u); return [p[0], p[1], p[2] + (rnd(i, 12) - 0.5) * 0.3, s.filt * 0.95] as [number, number, number, number]; })} col="#4f9dff" size={0.05} glow={glow} />}
    {s.filt > 0.01 && <mesh position={[-0.45, bot - 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.28 * ease(s.filt), 32]} /><meshBasicMaterial color="#7a5426" transparent opacity={0.55 * s.filt} depthWrite={false} /></mesh>}
    {/* LA PRUEBA DEL ALUMINIO en el corte: la hoja pegada abajo; side 1 = el techo de atrás mojado (filtración) */}
    {s.foilG > 0.01 && <>
      <Box p={[0, bot - 0.008, 0]} s={[0.6, 0.004, GD * 0.8]} c="#e4e7ea" r={0.22} m={0.95} rad={0.001} op={ease(s.foilG)} />
      {s.side > 0.01 && <Box p={[0, bot - 0.002, 0]} s={[0.58, 0.004, GD * 0.78]} c="#4a3a26" r={0.4} rad={0.001} op={0.8 * s.side * s.foilG} />}
    </>}
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
const Ladder: React.FC<{ p: V; k: number }> = ({ p, k }) => k < 0.01 ? null : <group position={[p[0], p[1] + (1 - ease(k)) * 0.6, p[2]]} rotation={[0, 0.35, 0]}>
  {[-1, 1].map((sd) => <group key={sd} position={[0, 0, sd * 0.32]} rotation={[sd * -0.17, 0, 0]}>
    {[-0.22, 0.22].map((x) => <Box key={x} p={[x, 0.85, 0]} s={[0.04, 1.75, 0.05]} c="#b8bcc0" r={0.35} m={0.8} rad={0.008} />)}
    {sd < 0 && [0.35, 0.75, 1.15, 1.55].map((y) => <Box key={y} p={[0, y, 0]} s={[0.46, 0.035, 0.09]} c="#9ea3a8" r={0.4} m={0.8} rad={0.006} />)}
  </group>)}
  <Box p={[0, 1.74, 0]} s={[0.5, 0.05, 0.22]} c="#e05a2a" r={0.5} rad={0.01} />
</group>;

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useCasaTex();
  const pg = useImgTex(["m1_p001", "m1_p009"]);
  const s = ST(t);
  const N = useMemo(() => Array.from({ length: 160 }, (_, i) => i), []);
  const mold = s.mold * (1 - 0.92 * s.bleach);                  // la lavandina lo «borra» un rato (después vuelve)
  const dn: V = [Math.PI / 2, 0, 0];                             // plano mirando para abajo (cara del techo)
  const fanAng = t * 5 * s.fanOn;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.45} threshold={0.9} exposure={1.2} env={0.45} />
      <color attach="background" args={["#bcd0e2"]} />
      <fog attach="fog" args={["#c8d6e4", 14, 40]} />
      <hemisphereLight args={[0xe4ecf6, 0x7a6a58, 1.0]} />
      {/* la luz de la mañana entra de COSTADO por la ventanita del baño y la de la cocina */}
      <directionalLight position={[-6, 7, -9]} intensity={2.2} color="#ffe6c2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[-2.0, 2.2, -0.8]} intensity={1.7} distance={7} color="#fff3e2" />
      <pointLight position={[2.0, 2.2, -0.8]} intensity={1.4} distance={7} color="#fff1dc" />
      <pointLight position={[0, 1.9, 2.8]} intensity={1.2 * s.giant} distance={5} color="#fff4e6" />

      {/* afuera: pasto, la medianera y el árbol del vecino (el de las hojas) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#7d8a5a" roughness={0.97} /></mesh>
      <Box p={[0, 0.95, -6.4]} s={[16, 1.9, 0.22]} c="#b9a48a" map={tx.concrete} r={0.95} rad={0.01} />
      <Cyl p={[4.9, 1.8, -4.6]} r={0.16} r2={0.22} h={3.6} c="#5d4632" rough={0.95} />
      <mesh position={[4.9, 4.1, -4.6]} castShadow><sphereGeometry args={[1.5, 24, 18]} /><meshStandardMaterial color="#5f7d3e" roughness={0.95} /></mesh>

      {/* ===== EL BAÑO Y LA COCINA (frente abierto) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -0.15]} receiveShadow><planeGeometry args={[8.2, 5.5]} /><meshStandardMaterial map={tt.floor} roughness={0.5} /></mesh>
      {/* pared de afuera con las dos ventanas */}
      <Box p={[(-4.1 + BW0) / 2, HW / 2, ZW - 0.1]} s={[BW0 + 4.1, HW, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(BW0 + BW1) / 2, BY0 / 2, ZW - 0.1]} s={[BW1 - BW0, BY0, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(BW0 + BW1) / 2, (BY1 + HW) / 2, ZW - 0.1]} s={[BW1 - BW0, HW - BY1, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(BW1 + KW0) / 2, HW / 2, ZW - 0.1]} s={[KW0 - BW1, HW, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(KW0 + KW1) / 2, KY0 / 2, ZW - 0.1]} s={[KW1 - KW0, KY0, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(KW0 + KW1) / 2, (KY1 + HW) / 2, ZW - 0.1]} s={[KW1 - KW0, HW - KY1, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(KW1 + 4.1) / 2, HW / 2, ZW - 0.1]} s={[4.1 - KW1, HW, 0.2]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      {/* ventanita del baño: marco y el vidrio que se abre (banderola) */}
      {[BW0, BW1].map((x, i) => <Box key={"bw" + i} p={[x, (BY0 + BY1) / 2, ZW - 0.05]} s={[0.05, BY1 - BY0, 0.08]} c="#f4f2ee" r={0.5} rad={0.008} />)}
      {[BY0, BY1].map((y, i) => <Box key={"bh" + i} p={[(BW0 + BW1) / 2, y, ZW - 0.05]} s={[BW1 - BW0, 0.05, 0.08]} c="#f4f2ee" r={0.5} rad={0.008} />)}
      <group position={[(BW0 + BW1) / 2, BY1 - 0.02, ZW - 0.06]} rotation={[-0.75 * ease(s.winOpen), 0, 0]}>
        <mesh position={[0, -(BY1 - BY0) / 2 + 0.02, 0]}><planeGeometry args={[BW1 - BW0 - 0.05, BY1 - BY0 - 0.05]} /><meshStandardMaterial color="#dfe9f0" transparent opacity={0.45} roughness={0.15} metalness={0.1} /></mesh>
      </group>
      {/* ventana de la cocina */}
      {[KW0, KW1, (KW0 + KW1) / 2].map((x, i) => <Box key={"kw" + i} p={[x, (KY0 + KY1) / 2, ZW - 0.05]} s={[0.05, KY1 - KY0, 0.08]} c="#6a4a32" r={0.7} rad={0.008} />)}
      {[KY0, KY1].map((y, i) => <Box key={"kh" + i} p={[(KW0 + KW1) / 2, y, ZW - 0.05]} s={[KW1 - KW0, 0.05, 0.08]} c="#6a4a32" r={0.7} rad={0.008} />)}
      <mesh position={[(KW0 + KW1) / 2, (KY0 + KY1) / 2, ZW - 0.07]}><planeGeometry args={[KW1 - KW0, KY1 - KY0]} /><meshStandardMaterial color="#cfe3f2" transparent opacity={0.18} roughness={0.05} metalness={0.2} /></mesh>
      {/* paredes de los costados y el tabique entre baño y cocina (con la puerta del baño) */}
      <Box p={[-4.1, HW / 2, -0.15]} s={[0.2, HW, 5.5]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[4.1, HW / 2, -0.15]} s={[0.2, HW, 5.5]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[0, HW / 2, -2.15]} s={[0.1, HW, 1.5]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[0, HW / 2, 0.15]} s={[0.1, HW, 1.5]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[0, 2.35, -1.0]} s={[0.1, 0.3, 0.8]} c="#eeeae2" map={tt.wall} r={0.92} rad={0.01} />
      <group position={[0, 1.0, -0.6]} rotation={[0, -1.35 * ease(s.door), 0]}><Box p={[0, 0, -0.38]} s={[0.04, 2.0, 0.76]} c="#e9e4da" r={0.55} rad={0.008} /></group>
      {/* azulejos: la ducha (esquina) y, en la cocina, la guarda verde agua */}
      <Box p={[-3.45, 0.95, ZW + 0.007]} s={[1.3, 1.9, 0.014]} c="#ffffff" map={tt.tile} r={0.25} rad={0.002} />
      <Box p={[-3.993, 0.95, -2.3]} s={[0.014, 1.9, 1.2]} c="#ffffff" map={tt.tile} r={0.25} rad={0.002} />
      <Box p={[1.6, 1.2, ZW + 0.007]} s={[2.6, 0.6, 0.014]} c="#ffffff" map={tt.ktile} r={0.3} rad={0.002} />
      {/* la ducha: plato, caño, flor y la mampara de vidrio */}
      <Box p={[-3.45, 0.04, -2.35]} s={[1.1, 0.08, 1.05]} c="#f2f2f0" r={0.3} rad={0.02} />
      <Cyl p={[-3.45, 1.55, ZW + 0.05]} r={0.015} h={1.0} c="#c9ccd0" m={0.9} rough={0.25} />
      <Cyl p={[-3.45, 2.04, ZW + 0.16]} r={0.07} r2={0.05} h={0.03} c="#c9ccd0" m={0.9} rough={0.25} rot={[0.35, 0, 0]} />
      <mesh position={[-2.9, 1.0, -2.35]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.05, 1.9]} /><meshStandardMaterial color="#e6f1f6" transparent opacity={0.16} roughness={0.05} metalness={0.3} /></mesh>
      {/* pileta con el espejo, el inodoro y la toalla */}
      <Box p={[-1.0, 0.82, -2.65]} s={[0.6, 0.12, 0.42]} c="#f6f6f4" r={0.25} rad={0.04} />
      <Cyl p={[-1.0, 0.4, -2.65]} r={0.08} h={0.76} c="#f0f0ee" rough={0.3} />
      <Box p={[-1.0, 1.5, ZW + 0.02]} s={[0.55, 0.7, 0.02]} c="#cfd8de" r={0.05} m={0.6} rad={0.01} />
      <Box p={[-2.15, 0.22, -2.55]} s={[0.4, 0.44, 0.55]} c="#f4f4f2" r={0.3} rad={0.08} />
      <Box p={[-2.15, 0.62, -2.82]} s={[0.4, 0.4, 0.16]} c="#f4f4f2" r={0.3} rad={0.04} />
      <Box p={[-0.15, 1.2, -2.0]} s={[0.04, 0.5, 0.3]} c="#c87f5a" r={0.95} rad={0.02} />
      {/* la ropa colgada adentro del baño (lo que no hay que hacer) */}
      {s.clothes > 0.01 && <group position={[-2.3, 1.75, -1.2]} scale={[1, ease(s.clothes), 1]}>
        <Box p={[0, 0.18, 0]} s={[1.6, 0.012, 0.012]} c="#888888" m={0.6} r={0.4} rad={0.002} />
        {["#3e6db5", "#d9534f", "#f0c419", "#6aa86a", "#e6e6e6"].map((c, i) => <Box key={i} p={[-0.6 + i * 0.3, -0.12, 0]} s={[0.24, 0.55 - (i % 2) * 0.15, 0.02]} c={c} r={0.95} rad={0.01} />)}
      </group>}
      {/* la cocina: mesada, anafe con la olla, alacena */}
      <Box p={[1.5, 0.45, -2.55]} s={[2.6, 0.9, 0.6]} c="#c9b89a" r={0.6} rad={0.01} />
      <Box p={[1.5, 0.92, -2.55]} s={[2.62, 0.04, 0.62]} c="#5a5c5e" r={0.35} rad={0.006} />
      <Cyl p={[1.15, 1.02, -2.5]} r={0.15} h={0.16} c="#9aa0a6" m={0.85} rough={0.3} />
      <Box p={[1.5, 2.0, -2.72]} s={[2.4, 0.6, 0.34]} c="#d8c8a8" r={0.6} rad={0.01} />
      {/* la losa (techo de hormigón): de la pared de afuera hasta la mitad, que la cámara entre */}
      <Box p={[0, HW + LT / 2, (LZ0 + LZ1) / 2]} s={[8.4, LT, LZ1 - LZ0]} c="#f1eee8" r={0.95} rad={0.01} />

      {/* ===== EL TECHO DEL BAÑO: el moho de la esquina, el vinagre, la pintura ===== */}
      <Decal p={[MX - 0.1, HW - 0.004, MZ + 0.05]} w={1.35} h={1.0} map={tt.mold} op={mold} rotX={dn[0]} col={s.moldGlow > 0.05 ? "#ffd9a8" : "#ffffff"} />
      <Decal p={[MX - 0.1, HW - 0.28, ZW + 0.003]} w={1.35} h={0.55} map={tt.mold} op={mold * 0.85} />
      {/* el vapor de la ducha sube y se junta en la esquina; las gotitas en el techo */}
      {s.steam > 0.01 && <Dots pts={N.map((i) => { const ph = (t * (0.12 + rnd(i, 1) * 0.1) + rnd(i, 2)) % 1; return [-3.45 + (rnd(i, 3) - 0.5) * (0.5 + ph * 1.6), 1.6 + ph * 0.88, -2.35 + (rnd(i, 4) - 0.5) * (0.5 + ph * 1.2), s.steam * 0.45 * Math.sin(Math.PI * ph)] as [number, number, number, number]; })} col="#f4f6f8" size={0.22} glow={tx.flake} />}
      {s.drops > 0.01 && <Dots pts={N.slice(0, 90).map((i) => [MX + (rnd(i, 5) - 0.6) * 1.1, HW - 0.012, MZ + (rnd(i, 6) - 0.4) * 0.8, s.drops * 0.9] as [number, number, number, number])} col="#d6ecff" size={0.03} glow={tx.flake} />}
      {/* el vinagre: el rociador, la niebla, la mancha bien mojada (brillante) y un palmo más alrededor */}
      {s.spray > 0.01 && <>
        <group position={[-3.1, 1.95, -2.05]} rotation={[0.9, 0.3, 0]}><Cyl p={[0, 0, 0]} r={0.045} h={0.2} c="#f4f4f4" rough={0.3} /><Box p={[0, 0.13, 0.02]} s={[0.05, 0.06, 0.07]} c="#d23c3c" r={0.4} rad={0.01} /></group>
        <Dots pts={N.slice(0, 70).map((i) => { const ph = (t * 1.6 + rnd(i, 7)) % 1; return [-3.1 - ph * 0.35 + (rnd(i, 8) - 0.5) * ph * 0.4, 2.05 + ph * 0.42, -2.12 - ph * 0.35 + (rnd(i, 9) - 0.5) * ph * 0.4, s.spray * 0.8 * (1 - ph)] as [number, number, number, number]; })} col="#e8f4ff" size={0.04} glow={tx.flake} />
      </>}
      {s.wetV > 0.01 && <mesh position={[MX - 0.1, HW - 0.006, MZ + 0.05]} rotation={dn}><planeGeometry args={[1.6, 1.25]} /><meshStandardMaterial color="#dfe8ee" roughness={0.08} metalness={0.15} transparent opacity={0.32 * s.wetV} depthWrite={false} /></mesh>}
      {/* el cepillo de cerdas plásticas (suave, en círculos) y después el trapo */}
      {Math.max(s.brush, s.rag) > 0.01 && <group position={[MX + 0.18 * Math.cos(t * 2.2), HW - 0.05, MZ + 0.12 * Math.sin(t * 2.2)]}>
        {s.brush > s.rag ? <><Box p={[0, 0.0, 0]} s={[0.22, 0.05, 0.09]} c="#2f7dd1" r={0.5} rad={0.015} /><Box p={[0, 0.03, 0]} s={[0.2, 0.025, 0.08]} c="#f2f2f2" r={0.9} rad={0.004} /><Box p={[0.1, -0.2, 0]} s={[0.03, 0.4, 0.03]} c="#2f7dd1" r={0.5} rad={0.01} rot={[0, 0, 0.5]} /></>
          : <Box p={[0, 0.0, 0]} s={[0.26, 0.04, 0.2]} c="#e7d9b8" r={1} rad={0.03} />}
      </group>}
      {/* el fijador (película lechosa) y las DOS manos de pintura antihongos (blanco limpio) */}
      {s.fij > 0.01 && <mesh position={[MX - 0.1, HW - 0.007, MZ + 0.05]} rotation={dn}><planeGeometry args={[1.7, 1.3]} /><meshStandardMaterial color="#f4f2ec" roughness={0.4} transparent opacity={0.45 * s.fij} depthWrite={false} /></mesh>}
      {s.paint > 0.01 && <mesh position={[-2.0, HW - 0.008, -1.75]} rotation={dn}><planeGeometry args={[4.0 * ease(s.paint) + 0.01, 2.4]} /><meshStandardMaterial color={s.paint2 > 0.5 ? "#fbfbf9" : "#f5f4f0"} roughness={0.85} /></mesh>}
      {/* placas de aislante pegadas al techo (punto 9) */}
      {s.insul > 0.01 && <Box p={[-2.0, HW - 0.03, -1.8]} s={[3.9 * ease(s.insul) + 0.01, 0.04, 2.3]} c="#f2ead2" r={0.9} rad={0.004} />}
      {/* LA PRUEBA DEL ALUMINIO: 30 x 30 cm, cinta por los cuatro lados; se despega de un lado y se mira */}
      {s.foil > 0.01 && <group position={[MX - 0.15, HW - 0.005, MZ]} rotation={[0, 0, 1.25 * ease(s.peel)]} scale={ease(cl(s.foil * 1.5))}>
        <mesh position={[0.15, 0, 0]} rotation={dn}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color="#e6e9ec" roughness={0.25} metalness={0.95} side={THREE.DoubleSide} /></mesh>
        {[[0.15, -0.15, 0.32, 0.05], [0.15, 0.15, 0.32, 0.05], [0, 0, 0.05, 0.32], [0.3, 0, 0.05, 0.32]].map(([x, z, w, h], i) => <mesh key={i} position={[x, -0.001, z]} rotation={dn}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#d9c38f" roughness={0.4} transparent opacity={0.85 * (1 - ease(s.peel))} /></mesh>)}
        {s.foilDrops > 0.01 && <Dots pts={N.slice(0, 40).map((i) => [0.02 + rnd(i, 10) * 0.26, -0.008, -0.13 + rnd(i, 11) * 0.26, s.foilDrops] as [number, number, number, number])} col="#d6ecff" size={0.028} glow={tx.flake} />}
      </group>}
      <Ladder p={[-2.85, 0, -1.85]} k={s.ladder} />
      {/* EL EXTRACTOR con temporizador, en la pared de afuera arriba de la ducha: tira el vapor AFUERA */}
      {s.fan > 0.01 && <group position={[-3.35, 2.15, ZW + 0.03]} scale={ease(s.fan)}>
        <Box p={[0, 0, 0]} s={[0.3, 0.3, 0.05]} c="#f6f6f4" r={0.35} rad={0.02} />
        <group position={[0, 0, 0.03]} rotation={[0, 0, fanAng]}>{[0, 1, 2, 3, 4].map((b) => <Box key={b} p={[Math.cos(b * 1.2566) * 0.06, Math.sin(b * 1.2566) * 0.06, 0]} s={[0.1, 0.035, 0.008]} rot={[0.3, 0, b * 1.2566]} c="#d9dadc" r={0.4} rad={0.004} />)}</group>
        {[-0.09, -0.045, 0, 0.045, 0.09].map((y) => <Box key={y} p={[0, y, 0.04]} s={[0.24, 0.012, 0.008]} c="#e2e2e0" r={0.4} rad={0.002} />)}
      </group>}
      {s.fanOn > 0.01 && <Dots pts={N.slice(0, 60).map((i) => { const ph = (t * 0.5 + rnd(i, 12)) % 1; return [-3.35 + (rnd(i, 13) - 0.5) * (0.2 + ph * 0.8), 2.15 + ph * 0.5, ZW - 0.25 - ph * 1.4, s.fanOn * 0.5 * (1 - ph)] as [number, number, number, number]; })} col="#f4f6f8" size={0.2} glow={tx.flake} />}

      {/* ===== EL TECHO DE LA COCINA: la aureola marrón (un anillo por lluvia) ===== */}
      <Decal p={[RX, HW - 0.004, RZ]} w={0.95} h={0.95} map={tt.ring} op={1 - s.paintK} rotX={dn[0]} col={s.ringGlow > 0.05 ? "#ffcf8a" : "#ffffff"} />
      <Decal p={[RX, HW - 0.0045, RZ]} w={1.3} h={1.3} map={tt.ring} op={s.ring3 * (1 - s.paintK)} rotX={dn[0]} />
      <Decal p={[RX, HW - 0.005, RZ]} w={1.65} h={1.65} map={tt.ring} op={s.ring4} rotX={dn[0]} col="#ffb090" />
      {s.wetK > 0.01 && <mesh position={[RX, HW - 0.006, RZ]} rotation={dn}><circleGeometry args={[0.3, 32]} /><meshStandardMaterial color="#7a6040" roughness={0.2} transparent opacity={0.55 * s.wetK} depthWrite={false} /></mesh>}
      {s.foilK > 0.01 && <mesh position={[RX + 0.25, HW - 0.007, RZ]} rotation={dn}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color="#e6e9ec" roughness={0.25} metalness={0.95} transparent opacity={ease(s.foilK)} /></mesh>}
      {s.bulge > 0.01 && <mesh position={[RX, HW - 0.002, RZ]} scale={[0.55, 0.16 * ease(s.bulge), 0.48]}><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#e8dcc6" roughness={0.9} /></mesh>}
      {s.drip > 0.01 && <Dots pts={N.slice(0, 12).map((i) => { const ph = (t * 0.7 + i / 12) % 1; return [RX + (rnd(i, 14) - 0.5) * 0.05, HW - 0.02 - ph * 1.55, RZ, s.drip * 0.9] as [number, number, number, number]; })} col="#7fb8ff" size={0.035} glow={tx.flake} />}
      {s.paintK > 0.01 && <mesh position={[RX, HW - 0.008, RZ]} rotation={dn}><planeGeometry args={[2.0 * ease(s.paintK) + 0.01, 1.6]} /><meshStandardMaterial color="#f7f6f2" roughness={0.85} /></mesh>}

      {/* ===== LA TERRAZA: el desagüe tapado con hojas, el agua estancada y la fisura; la prueba de la manguera ===== */}
      <Box p={[0, HW + LT + 0.02, (LZ0 + LZ1) / 2]} s={[8.4, 0.04, LZ1 - LZ0]} c="#c98a6c" map={tt.terr} r={0.75} rad={0.006} />
      <Box p={[0, HW + LT + 0.25, LZ0 + 0.06]} s={[8.4, 0.5, 0.12]} c="#e6dfd2" map={tt.wall} r={0.9} rad={0.01} />
      <Cyl p={[2.9, HW + LT + 0.045, -2.6]} r={0.09} h={0.012} c="#2a2a2c" m={0.6} rough={0.5} />
      <mesh position={[2.9, HW + LT + 0.06, -2.6]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.55, 0.55]} /><meshStandardMaterial map={tt.leaves} transparent opacity={s.leaves} depthWrite={false} roughness={0.9} /></mesh>
      {s.puddle > 0.01 && <mesh position={[2.75, HW + LT + 0.043, -2.25]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.85 * ease(s.puddle), 40]} /><meshStandardMaterial color="#6d8496" roughness={0.38} metalness={0.05} transparent opacity={0.55} /></mesh>}
      <Box p={[2.62, HW + LT + 0.042, -2.15]} s={[0.5, 0.006, 0.01]} rot={[0, 0.6, 0]} c="#1a120c" r={1} rad={0.001} />
      {s.path > 0.01 && <Dots pts={N.slice(0, 40).map((i) => { const u = (t * 0.2 + i / 40) % 1; return [2.9 - u * 0.25, HW + LT * (1 - u) * 0.8, -2.6 + u * 0.4, s.path * 0.9] as [number, number, number, number]; })} col="#4f9dff" size={0.05} glow={tx.flake} />}
      {s.hose > 0.01 && <>
        <Cyl p={[3.6, HW + LT + 0.4, -1.1]} r={0.02} h={0.8} c="#2e8b3a" rough={0.5} rot={[0.5, 0, 0.3]} />
        <Dots pts={N.slice(0, 60).map((i) => { const ph = (t * 1.2 + rnd(i, 15)) % 1; return [3.55 - ph * 0.6, HW + LT + 0.75 - ph * ph * 0.7, -1.3 - ph * 0.9 + (rnd(i, 16) - 0.5) * 0.06, s.hose * 0.9] as [number, number, number, number]; })} col="#9fd0ff" size={0.035} glow={tx.flake} />
      </>}

      {/* ===== EL TECHO GIGANTE EN CORTE ===== */}
      <Giant t={t} s={s} tt={tt} glow={tx.flake} conc={tx.concrete} />

      {/* mesa de trabajo de Claudio (el rociador, el rollo de aluminio) + EL MANUAL DEL ALBAÑIL: se abre en la página 9 */}
      <Box p={[2.55, 0.72, 0.6]} s={[1.2, 0.05, 0.7]} c="#9a7a56" r={0.6} rad={0.01} />
      {[[2.0, 0.3], [3.1, 0.3], [2.0, 0.9], [3.1, 0.9]].map(([x, z], i) => <Box key={"m" + i} p={[x, 0.36, z]} s={[0.05, 0.72, 0.05]} c="#5a3e28" r={0.6} rad={0.006} />)}
      <Cyl p={[3.0, 0.86, 0.78]} r={0.05} r2={0.045} h={0.24} c="#f4f4f4" rough={0.3} />
      <Cyl p={[2.1, 0.79, 0.8]} r={0.035} h={0.3} c="#d9dde0" m={0.9} rough={0.25} rot={[0, 0, Math.PI / 2]} />
      {s.book > 0.01 && pg.m1_p001 && <Book p={[BOOK[0] - 0.15, BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.08} open={s.open} cover={pg.m1_p001} inside={pg.m1_p009_r} right={pg.m1_p009} spine="#e8a21a">
        {s.open > 0.9 && <>
          <PageHi k={s.hi[0]} u0={0.07} u1={0.92} v={0.355} h={0.05} />
          <PageHi k={s.hi[1]} u0={0.07} u1={0.93} v={0.455} h={0.03} col="#ff9a4a" />
          <PageHi k={s.hi[2]} u0={0.07} u1={0.93} v={0.567} h={0.035} col="#7dff9e" />
        </>}
      </Book>}
    </ThreeCanvas>
  );
};
