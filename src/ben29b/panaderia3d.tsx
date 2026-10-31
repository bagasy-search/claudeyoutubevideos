// ben29 · EL MUNDO: la panadería de Benito en corte (pueblo de Castilla). UN mundo y UNA cámara para todo el video:
// el horno de leña de cúpula cortado (sarmientos, ladrillo que brilla con el calor, la olla de hierro), la mesa de amasar
// con el bol cortado (la masa sube y se le ven las burbujas), la balanza, el pan del video (hogaza / panecillos / focaccia /
// baguettes) y, aparte en x=40, el MACRO adentro de la masa (gluten, levadura, burbujas).
// La cámara y el estado salen de plan.ts (beats "w:<vista>" de plan_t.json, resueltos a la voz). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { estado, KEYS2, PROD } from "./plan";
import { corteza, Hogaza, P2 } from "./kitpan";
import { ctex } from "./estudio3d";
const stencil = () => ctex("stencilHarina", 256, 160, (g) => { g.fillStyle = "rgba(60,70,110,.75)"; g.textAlign = "center"; g.font = "900 54px Georgia, serif"; g.fillText("HARINA", 128, 70); g.font = "700 34px Georgia, serif"; g.fillText("50 kg", 128, 120); });

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const fr = (x: number) => x - Math.floor(x);


// ---------------- POSICIONES (mundo) ----------------
// panadería: piso y=0, x -8..6, pared del fondo z=-4, frente abierto (z=+4). Mesa: tapa en y=0,92.
type V3 = [number, number, number];
export const OV: V3 = [-4.2, 0, -1.6];          // horno: pie del plinto; solera en y=1,0
const HEARTH = 1.0;
export const TOP = 0.92;
export const BW: V3 = [1.2, TOP, 0.45];          // bol
export const LF: V3 = [2.6, TOP, 0.05];          // tabla con el pan cortado
export const CA: V3 = [1.95, TOP, 0.78];         // taza a cucharón (apretada)
export const CB: V3 = [2.25, TOP, 0.78];         // taza a cuchara (suelta)
export const SC: V3 = [0.4, TOP, -0.15];         // balanza
export const MC: V3 = [40, 2, 0];                // el macro (adentro de la masa)
const add = (a: V3, x: number, y: number, z: number): V3 => [a[0] + x, a[1] + y, a[2] + z];
export const POT: V3 = [OV[0], HEARTH, OV[2] + 0.05];
export const PT = {
  bowl: add(BW, 0, 0.12, 0),
  dough: add(BW, 0, 0.16, 0),
  loaf: add(LF, 0, 0.07, 0),
  cupA: add(CA, 0, 0.06, 0),
  cupB: add(CB, 0, 0.06, 0),
  scale: add(SC, 0, 0.3, 0),
  dome: [OV[0], HEARTH + 0.9, OV[2]] as V3,
  fire: [OV[0], HEARTH + 0.2, OV[2] - 0.3] as V3,
  pot: add(POT, 0, 0.18, 0),
  potLoaf: add(POT, 0, 0.14, 0),
  crust: add(POT, 0, 0.22, 0),
  macro: MC,
  window: [-0.4, 1.9, -3.95] as V3,
  prod: [2.05, 0.98, 0.62] as V3,
  shelf: [3.4, 1.9, -3.75] as V3,
  sacks: [-6.25, 0.5, 0.9] as V3,
  peel: [-1.6, 1.8, -3.75] as V3,
};

// ---------------- CÁMARA (llaves de plan.ts: llega a la vista del plano y deriva; curva bezier + mano lenta) ----------------
type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const KEYS: Key[] = [...KEYS2].sort((a, b) => a.t - b.t);
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const pa = v3(a.p), pb = v3(b.p), far = pa.distanceTo(pb);
  // vuelo curvo: punto de control levantado y corrido al costado (nunca una recta)
  const ctrl = pa.clone().lerp(pb, 0.5).add(new THREE.Vector3(0.18 * far * (i % 2 ? 1 : -1), 0.22 * far, 0.1 * far));
  const p = pa.clone().multiplyScalar((1 - k) * (1 - k)).add(ctrl.multiplyScalar(2 * k * (1 - k))).add(pb.clone().multiplyScalar(k * k));
  const l = v3(a.l).lerp(v3(b.l), k);
  // CamaraMano lenta (0,4-1,8 Hz, mm): nunca queda congelada
  p.x += Math.sin(t * 2.6) * 0.004 + Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 3.1 + 1) * 0.003 + Math.sin(t * 0.71 + 1) * 0.008; p.z += Math.sin(t * 0.37 + 2) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.01, 300); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const CamRig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.01; c.far = 300; c.updateProjectionMatrix();
  return null;
};

// ---------------- ESTADO DEL MUNDO (de plan.ts: cada plano de mundo trae el suyo, se funde en 0,8 s) ----------------
const doughState = (t: number) => {
  const S = estado(t);
  return { show: S.dough > 0.5, L: 0.07 + 0.12 * S.rise, bub: 0.15 + 0.85 * S.rise, lump: S.lump, cover: S.cover, dent: S.dent, flour: S.flour };
};
const ovenState = (t: number) => {
  const S = estado(t);
  return { fire: S.fire, brickHeat: S.glow, heatIn: S.heat, pot: S.pot > 0.5, loafIn: S.pot > 0.5 && S.loafin > 0.5, lid: S.lid, spring: S.spring, crust: S.crust,
    steamIn: S.steam > 0.5, probe: S.probe, sparkle: S.sparkle };
};
const macroState = (t: number) => {
  const S = estado(t);
  return { yeastOn: S.yeast > 0.01, awake: S.yeast, die: S.die, prot: Math.min(1, 0.35 + S.net * 1.4), water: S.water, pairs: Math.min(1, S.net * 1.6), netK: S.net, torn: S.torn,
    gas: S.gas, align: S.align, yeastShow: S.yeast > 0.01 || S.gas > 0.01 ? 1 : 0 };
};

// ---------------- GEOMETRÍAS COMPARTIDAS ----------------
const SPH = new THREE.SphereGeometry(1, 16, 12);
const CIR = new THREE.CircleGeometry(1, 22);
const CYLG = new THREE.CylinderGeometry(1, 1, 1, 8);
const UP = new THREE.Vector3(0, 1, 0);
// media pieza de torno (mitad de atrás, z<=0) + la tapa del corte en z=0 — perfil [r, y]
const halfLathe = (prof: [number, number][], seg = 40) => new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y)), seg, Math.PI / 2, Math.PI);
const capShape = (prof: [number, number][]) => {
  // perfil abierto desde el eje (r=0) → lado derecho; se espeja para el izquierdo → un solo corte
  const s = new THREE.Shape();
  prof.forEach(([r, y], i) => (i === 0 ? s.moveTo(r, y) : s.lineTo(r, y)));
  for (let i = prof.length - 1; i >= 0; i--) s.lineTo(-prof[i][0], prof[i][1]);
  return new THREE.ShapeGeometry(s);
};
const ringCap = (prof: [number, number][], sign: 1 | -1) => {
  const s = new THREE.Shape();
  prof.forEach(([r, y], i) => (i === 0 ? s.moveTo(sign * r, y) : s.lineTo(sign * r, y)));
  s.closePath(); return new THREE.ShapeGeometry(s);
};

// ---------------- TEXTURAS PROPIAS ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(rep[0], rep[1]); tx.anisotropy = 8; return tx;
};
const useBakeryTex = () => useMemo(() => ({
  brick: mk(512, 256, (g) => {
    g.fillStyle = "#4a2a1e"; g.fillRect(0, 0, 512, 256);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++) {
      const i = r * 5 + c, off = (r % 2) * 51;
      const v = rnd(i, 1);
      g.fillStyle = `rgb(${150 + v * 50},${62 + v * 28},${40 + v * 18})`;
      g.fillRect(c * 102 + off - 102 + 3, r * 32 + 3, 96, 26); g.fillRect(c * 102 + off + 3, r * 32 + 3, 96, 26);
      g.fillStyle = `rgba(20,10,5,${0.15 + 0.3 * rnd(i, 4)})`; g.fillRect(c * 102 + off + 3, r * 32 + 3, 96 * rnd(i, 5), 26);
    }
  }, [3, 2]),
  plaster: mk(256, 256, (g) => {
    g.fillStyle = "#cfc5b2"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { const v = 170 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v},${v - 8},${v - 22},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 3); }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(90,70,50,${0.05 + 0.06 * rnd(i, 6)})`; g.beginPath(); g.arc(rnd(i, 7) * 256, rnd(i, 8) * 256, 6 + rnd(i, 9) * 18, 0, 6.3); g.fill(); }
  }, [4, 2]),
  terracotta: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 2); g.fillStyle = `rgb(${150 + v * 30},${78 + v * 18},${52 + v * 12})`; g.fillRect(c * 64, r * 64, 64, 64); }
    g.strokeStyle = "rgba(60,40,30,.6)"; g.lineWidth = 3; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, k * 64); g.lineTo(256, k * 64); g.stroke(); }
    for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(240,235,225,.10)"; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
  }, [8, 6]),
  crumb: mk(256, 256, (g) => {
    g.fillStyle = "#efe3c6"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(190,165,120,${0.15 + 0.2 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 0.6 + rnd(i, 4) * 1.6, 0, 6.3); g.fill(); }
  }, [3, 3]),
  sack: mk(256, 256, (g) => {
    g.fillStyle = "#c9b48a"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) { g.fillStyle = "rgba(90,70,40,.18)"; g.fillRect(0, y, 256, 1); }
    for (let x = 0; x < 256; x += 4) { g.fillStyle = "rgba(255,250,235,.12)"; g.fillRect(x, 0, 1, 256); }
  }, [2, 2]),
}), []);

// ---------------- PIEZAS ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} />
  </mesh>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rot?: V3; m?: number; ro?: number; e?: string; ei?: number; seg?: number; r2?: number; map?: Tx }> = ({ p, r, h, c, rot, m = 0.1, ro = 0.6, e, ei = 0, seg = 24, r2, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r2 ?? r, r, h, seg]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Ball: React.FC<{ p: V3; s: V3 | number; c: string; e?: string; ei?: number; r?: number; m?: number; o?: number }> = ({ p, s, c, e, ei = 0, r = 0.7, m = 0, o = 1 }) => (
  <mesh position={p} scale={typeof s === "number" ? [s, s, s] : s} geometry={SPH} castShadow receiveShadow>
    <meshStandardMaterial color={c} emissive={e ?? "#000"} emissiveIntensity={ei} roughness={r} metalness={m} transparent={o < 1} opacity={o} depthWrite={o >= 1} />
  </mesh>
);
// barra entre dos puntos (eslabón de gluten, rama de sarmiento)
const Rod: React.FC<{ a: THREE.Vector3; b: THREE.Vector3; r: number; c: string; e?: string; ei?: number; o?: number }> = ({ a, b, r, c, e, ei = 0, o = 1 }) => {
  const d = b.clone().sub(a), L = d.length();
  if (L < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  const m = a.clone().add(b).multiplyScalar(0.5);
  return <mesh position={m} quaternion={q} scale={[r, L, r]} geometry={CYLG}><meshStandardMaterial color={c} emissive={e ?? "#000"} emissiveIntensity={ei} roughness={0.5} transparent={o < 1} opacity={o} /></mesh>;
};
// nube de puntos suaves (harina que cae, vapor, calor, chispas)
const Pts: React.FC<{ pos: number[]; size: number; col: string; o?: number; map?: Tx; addB?: boolean }> = ({ pos, size, col, o = 1, map, addB }) => {
  if (pos.length < 3 || o <= 0.01) return null;
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return <points geometry={geo}><pointsMaterial size={size} map={map} color={col} transparent opacity={o} depthWrite={false} sizeAttenuation blending={addB ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={!addB} /></points>;
};

// ---------- el BOL cortado con la masa ----------
const RI = 0.29, RO = 0.315, BY = 0.3;   // radio interior/exterior y centro de la curva del bol (sobre la mesa)
const bowlInner = (n = 14): [number, number][] => Array.from({ length: n + 1 }, (_, i) => { const a = -Math.PI / 2 + (i / n) * (Math.PI / 2 - 0.12); return [RI * Math.cos(a), BY + RI * Math.sin(a) + 0.02]; });
const bowlOuter = (n = 14): [number, number][] => Array.from({ length: n + 1 }, (_, i) => { const a = -Math.PI / 2 + (i / n) * (Math.PI / 2 - 0.12); return [RO * Math.cos(a), BY + RO * Math.sin(a)]; });
const rInAt = (y: number) => { const s = (y - 0.02 - BY) / RI; return RI * Math.sqrt(Math.max(0, 1 - s * s)); };
const BOWL_PROF: [number, number][] = (() => { const o = bowlOuter(), i = bowlInner(); return [[0.11, 0.0], [0.12, 0.0], ...o.filter(([r]) => r > 0.12), ...i.slice().reverse()]; })();
const Bowl: React.FC<{ t: number; tex: ReturnType<typeof useBakeryTex> }> = ({ t, tex }) => {
  const D = doughState(t);
  const geoBowl = useMemo(() => halfLathe(BOWL_PROF, 48), []);
  const capR = useMemo(() => ringCap(BOWL_PROF, 1), []), capL = useMemo(() => ringCap(BOWL_PROF, -1), []);
  // perfil de la masa: del eje por el fondo del bol hasta el nivel L, y la cúpula arriba
  const yb = 0.02 + 0.006, yL = yb + D.L, rL = rInAt(yL) - 0.003;
  const dome = 0.018 + D.L * 0.35;
  const prof: [number, number][] = [[0, yb]];
  for (let i = 1; i <= 10; i++) { const y = yb + (yL - yb) * (i / 10); prof.push([Math.max(0.002, rInAt(y) - 0.003), y]); }
  for (let i = 1; i <= 8; i++) { const u = i / 8; prof.push([rL * Math.cos(u * Math.PI / 2), yL + dome * Math.sin(u * Math.PI / 2) - D.dent * 0.03 * Math.exp(-Math.pow((1 - u) * 6, 2))]); }
  const geoD = halfLathe(prof, 40), capD = capShape(prof);
  // burbujas del corte (fijas en coordenadas relativas → se estiran con el nivel)
  const bubbles: React.ReactNode[] = [];
  if (D.show && D.flour < 0.5) {
    for (let i = 0; i < 110; i++) {
      const v = Math.pow(rnd(i, 3), 0.8), y = yb + 0.008 + v * (yL + dome * 0.6 - yb - 0.016);
      const rr = (y < yL ? rInAt(y) : rL * Math.cos(Math.asin(Math.min(1, (y - yL) / dome)))) - 0.012;
      if (rr <= 0.004) continue;
      const x = (rnd(i, 4) * 2 - 1) * rr;
      const big = rnd(i, 5) > 0.82 ? 2.2 : 1;
      const r = (0.0016 + 0.0075 * D.bub * rnd(i, 6) * big) * (1 - 0.25 * D.lump);
      bubbles.push(<mesh key={i} position={[x, y, 0.0015]} scale={[r, r * (0.8 + 0.3 * rnd(i, 7)), 1]} geometry={CIR}><meshStandardMaterial color="#9c8256" roughness={0.9} /></mesh>);
    }
    // burbujas grandes pegadas al vidrio del costado (se ven "a los costados del bol")
  }
  // grumos de la masa fea
  const lumps: React.ReactNode[] = [];
  if (D.show && D.lump > 0.02) for (let i = 0; i < 26; i++) {
    const a = Math.PI * (0.5 + rnd(i, 1)), rr = rL * 0.85 * Math.sqrt(rnd(i, 2));
    lumps.push(<Ball key={i} p={[rr * Math.sin(a), yL + dome * 0.6, rr * Math.cos(a)]} s={[0.025 * D.lump, 0.014 * D.lump, 0.025 * D.lump]} c={rnd(i, 3) > 0.6 ? "#f3ead8" : "#dccaa4"} r={0.9} />);
  }
  const dc = D.flour > 0.5 ? "#f6f2ea" : "#e8d7b2";
  return (
    <group position={BW}>
      <mesh geometry={geoBowl} castShadow receiveShadow><meshStandardMaterial color="#7d4a2c" roughness={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={capR}><meshStandardMaterial color="#c99a72" roughness={0.9} /></mesh>
      <mesh geometry={capL}><meshStandardMaterial color="#c99a72" roughness={0.9} /></mesh>
      {/* esmalte crema por dentro */}
      <mesh geometry={useMemo(() => halfLathe(bowlInner().map(([r, y]) => [r - 0.0015, y] as [number, number]), 48), [])}><meshStandardMaterial color="#cdbd9c" roughness={0.85} side={THREE.BackSide} /></mesh>
      {D.show && <>
        <mesh geometry={geoD} castShadow receiveShadow><meshStandardMaterial color={dc} roughness={D.lump > 0.3 ? 0.55 : 0.75} side={THREE.DoubleSide} map={tex.crumb} /></mesh>
        <mesh geometry={capD} position={[0, 0, 0.0008]}><meshStandardMaterial color={D.flour > 0.5 ? "#fbf8f2" : "#f1e4c4"} roughness={0.95} map={tex.crumb} /></mesh>
        {bubbles}{lumps}
      </>}
      {/* plato encima (tapado) */}
      {D.cover > 0.02 && <group position={[0, 0.27 + 0.25 * (1 - D.cover), 0]}><Cyl p={[0, 0, 0]} r={0.33} r2={0.34} h={0.018} c="#b3a894" ro={0.9} m={0} seg={40} /></group>}
    </group>
  );
};

// ---------- las dos TAZAS cortadas: a cucharón (apretada, +¼) vs a cuchara (suelta) ----------
const Cup: React.FC<{ p: V3; t: number; dense: boolean; fill: number; show: number }> = ({ p, t, dense, fill, show }) => {
  if (show <= 0.01) return null;
  const R = 0.06, Hc = 0.11;
  const hf = Hc * fill * (dense ? 1.0 : 0.98);
  const pockets: React.ReactNode[] = [];
  const n = dense ? 26 : 120;
  for (let i = 0; i < n; i++) {
    const y = 0.006 + rnd(i, dense ? 11 : 12) * (hf - 0.01), x = (rnd(i, 13) * 2 - 1) * (R - 0.006);
    if (y < 0.004) continue;
    const r = dense ? 0.0012 + 0.0008 * rnd(i, 14) : 0.0018 + 0.0028 * rnd(i, 15);
    pockets.push(<mesh key={i} position={[x, y, 0.0012]} scale={[r, r, 1]} geometry={CIR}><meshStandardMaterial color={dense ? "#cfc7b6" : "#b9b1a2"} roughness={1} /></mesh>);
  }
  // líneas de compresión (apretada)
  const lines: React.ReactNode[] = [];
  if (dense) for (let k = 1; k < 6; k++) lines.push(<mesh key={k} position={[0, hf * (k / 6), 0.0013]} scale={[R * 1.9, 0.0012, 1]}><planeGeometry args={[1, 1]} /><meshStandardMaterial color="#d6cfbf" roughness={1} /></mesh>);
  void t;
  return (
    <group position={p} scale={[show, show, show]}>
      {/* vidrio (mitad de atrás) */}
      <mesh position={[0, Hc / 2, 0]}><cylinderGeometry args={[R + 0.004, R + 0.002, Hc, 32, 1, true, Math.PI / 2, Math.PI]} /><meshPhysicalMaterial color="#dfe9ee" roughness={0.35} transmission={0.3} transparent opacity={0.18} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[R + 0.002, R + 0.002, 0.004, 32, 1, false, Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#cfdbe0" roughness={0.2} /></mesh>
      {/* harina */}
      {hf > 0.002 && <>
        <mesh position={[0, hf / 2 + 0.004, 0]}><cylinderGeometry args={[R, R, hf, 32, 1, false, Math.PI / 2, Math.PI]} /><meshStandardMaterial color={dense ? "#f4f1ea" : "#fbfaf6"} roughness={1} /></mesh>
        <mesh position={[0, hf / 2 + 0.004, 0.0005]}><planeGeometry args={[2 * R, hf]} /><meshStandardMaterial color={dense ? "#ece7db" : "#faf8f2"} roughness={1} /></mesh>
        <group position={[0, 0.004, 0]}>{pockets}{lines}</group>
      </>}
    </group>
  );
};

// ---------- la BALANZA de hierro (platillo con la harina vs pesas) ----------
const Scale: React.FC<{ t: number }> = ({ t }) => {
  const tilt = lerp(-0.2, 0, estado(t).weigh) + 0.006 * Math.sin(t * 1.3);
  const arm = 0.22;
  const pans = [-1, 1].map((s) => {
    const x = s * arm * Math.cos(tilt), y = 0.42 - s * arm * Math.sin(tilt);
    return (
      <group key={s} position={[x, y, 0]}>
        {[0, 1, 2].map((k) => { const a = (k / 3) * Math.PI * 2; return <Rod key={k} a={new THREE.Vector3(0, 0, 0)} b={new THREE.Vector3(Math.cos(a) * 0.08, -0.2, Math.sin(a) * 0.08)} r={0.0015} c="#2b2b2b" />; })}
        <Cyl p={[0, -0.205, 0]} r={0.095} r2={0.1} h={0.014} c="#8a7a5c" m={0.7} ro={0.35} />
        {s < 0 ? <mesh position={[0, -0.17, 0]}><coneGeometry args={[0.075, 0.06, 28]} /><meshStandardMaterial color="#f6f3ec" roughness={1} /></mesh> : <>
          <Cyl p={[0, -0.18, 0]} r={0.035} h={0.035} c="#3a3a3a" m={0.8} ro={0.4} />
          <Cyl p={[0.05, -0.185, 0.03]} r={0.022} h={0.025} c="#3a3a3a" m={0.8} ro={0.4} />
        </>}
      </group>
    );
  });
  return (
    <group position={SC}>
      <Box p={[0, 0.02, 0]} s={[0.36, 0.04, 0.2]} c="#2c2a28" m={0.6} r={0.45} />
      <Cyl p={[0, 0.22, 0]} r={0.016} h={0.4} c="#2c2a28" m={0.7} ro={0.4} />
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, -tilt]} castShadow><boxGeometry args={[arm * 2 + 0.02, 0.016, 0.02]} /><meshStandardMaterial color="#2c2a28" metalness={0.7} roughness={0.4} /></mesh>
      <mesh position={[0, 0.46, 0]} rotation={[0, 0, -tilt]}><coneGeometry args={[0.008, 0.07, 8]} /><meshStandardMaterial color="#b08a3a" metalness={0.8} roughness={0.3} /></mesh>
      {pans}
    </group>
  );
};

// ---------- el PAN cortado: ladrillo (pálido, denso) o bueno (castaño, miga abierta) ----------
const Loaf: React.FC<{ p: V3; t: number; brick: number; crust: number; spring: number; ear: number; scale?: number; squash?: number; tex: ReturnType<typeof useBakeryTex> }> = ({ p, t, brick, crust, spring, ear, scale = 1, squash = 0, tex }) => {
  const Rr = 0.16, Hh = 0.06 + 0.055 * spring;
  // perfil: eje → borde de abajo → cúpula hasta el tope (el corte del greñado baja la punta)
  const pr: [number, number][] = [[0, 0], [Rr * (1 + 0.06 * spring), 0.004], ...Array.from({ length: 14 }, (_, i) => { const u = (i + 1) / 14, a = u * Math.PI / 2; return [Rr * (1 + 0.06 * spring) * Math.cos(a), Hh * Math.sin(a) - (u > 0.8 ? ear * 0.018 * (u - 0.8) * 5 : 0)] as [number, number]; })];
  const geo = halfLathe(pr, 40);
  const pale = new THREE.Color("#e3c48c"), brown = new THREE.Color("#6e3a17");
  const cc = pale.clone().lerp(brown, crust);
  const holes: React.ReactNode[] = [];
  const nH = brick > 0.5 ? 34 : 130;
  for (let i = 0; i < nH; i++) {
    const v = Math.pow(rnd(i, 21), 0.9), y = 0.008 + v * (Hh * 0.88 - 0.012);
    const rr = Rr * (1 + 0.06 * spring) * Math.sqrt(Math.max(0, 1 - Math.pow(y / Hh, 2))) - 0.014;
    if (rr <= 0.004) continue;
    const x = (rnd(i, 22) * 2 - 1) * rr;
    const r = brick > 0.5 ? 0.0012 + 0.0012 * rnd(i, 23) : (0.002 + 0.008 * Math.pow(rnd(i, 24), 2) * (rnd(i, 25) > 0.9 ? 2 : 1)) * (1 - 0.6 * squash);
    holes.push(<mesh key={i} position={[x, y * (1 - 0.25 * squash), 0.0016]} scale={[r * (1.1 + 0.5 * rnd(i, 26)), r, 1]} geometry={CIR}><meshStandardMaterial color={brick > 0.5 ? "#b9ab8e" : "#a88b5a"} roughness={0.85} /></mesh>);
  }
  // corteza: anillo oscuro al borde del corte
  const crustRing = capShape(pr.map(([r, y]) => [r, y] as [number, number]));
  const inner = capShape(pr.map(([r, y]) => [Math.max(0, r - 0.009), Math.max(0.006, y - 0.009)] as [number, number]));
  void t;
  return (
    <group position={p} scale={[scale, scale * (1 - 0.25 * squash), scale]}>
      <mesh geometry={geo} castShadow receiveShadow><meshStandardMaterial color={cc} roughness={0.55 + 0.3 * brick} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={crustRing} position={[0, 0, 0.0006]}><meshStandardMaterial color={cc.clone().multiplyScalar(0.9)} roughness={0.7} /></mesh>
      <mesh geometry={inner} position={[0, 0, 0.0011]}><meshStandardMaterial color={brick > 0.5 ? "#d9ceb4" : "#f1e2c0"} roughness={brick > 0.5 ? 0.95 : 0.6} map={tex.crumb} /></mesh>
      {holes}
    </group>
  );
};

// ---------- el HORNO de cúpula cortado (mitad de atrás) ----------
const DOME_R = 1.35, DOME_T = 0.32;
const Oven: React.FC<{ t: number; tex: ReturnType<typeof useBakeryTex>; flake: Tx }> = ({ t, tex, flake }) => {
  const S = ovenState(t);
  const c: V3 = [OV[0], HEARTH, OV[2]];
  // fuego de sarmientos: ramas + llamas que titilan + brasas
  const branches: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rnd(i, 31) * Math.PI, L = 0.35 + 0.3 * rnd(i, 32);
    const x0 = (rnd(i, 33) - 0.5) * 0.5, z0 = -0.35 + (rnd(i, 34) - 0.5) * 0.4;
    branches.push(<Rod key={i} a={new THREE.Vector3(c[0] + x0 - Math.cos(a) * L / 2, c[1] + 0.03 + rnd(i, 35) * 0.08, c[2] + z0 - Math.sin(a) * L / 2)} b={new THREE.Vector3(c[0] + x0 + Math.cos(a) * L / 2, c[1] + 0.05 + rnd(i, 36) * 0.12, c[2] + z0 + Math.sin(a) * L / 2)} r={0.012} c="#2a1a10" e="#ff5a14" ei={S.fire * (0.3 + 0.3 * rnd(i, 37))} />);
  }
  const flames: React.ReactNode[] = [];
  if (S.fire > 0.02) for (let i = 0; i < 9; i++) {
    const fl = 0.75 + 0.35 * Math.sin(t * (3.5 + 0.4 * i) + i * 2.1) + 0.15 * Math.sin(t * 8 + i);
    const x = (rnd(i, 41) - 0.5) * 0.55, z = -0.35 + (rnd(i, 42) - 0.5) * 0.35, h = (0.13 + 0.12 * rnd(i, 43)) * fl * S.fire;
    flames.push(<mesh key={i} position={[c[0] + x, c[1] + 0.08 + h / 2, c[2] + z]} rotation={[0, t * 0.5 + i, Math.sin(t * 2.2 + i) * 0.12]} scale={[0.04 + 0.025 * rnd(i, 44), h / 2 + 0.001, 0.04 + 0.025 * rnd(i, 44)]}><sphereGeometry args={[1, 14, 10]} /><meshBasicMaterial color={i % 3 === 0 ? "#ffc070" : "#ff6a1a"} transparent opacity={0.22 * S.fire} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>);
  }
  // brasas que suben
  const emb: number[] = [];
  if (S.fire > 0.02) for (let i = 0; i < 70; i++) { const ph = fr(t * (0.35 + 0.3 * rnd(i, 51)) + rnd(i, 52)); emb.push(c[0] + (rnd(i, 53) - 0.5) * 0.6 + Math.sin(ph * 6 + i) * 0.05, c[1] + 0.1 + ph * 1.1, c[2] - 0.35 + (rnd(i, 54) - 0.5) * 0.4); }
  // calor: de la pared de ladrillo hacia el centro (la olla)
  const heat: number[] = [];
  if (S.heatIn > 0.02) for (let i = 0; i < 260; i++) {
    const th = rnd(i, 61) * Math.PI * 0.48, ph = Math.PI + rnd(i, 62) * Math.PI;
    const sx = c[0] + DOME_R * Math.sin(th) * Math.cos(ph) * 0.98, sy = c[1] + DOME_R * Math.cos(th) * 0.98, sz = c[2] + DOME_R * Math.sin(th) * Math.sin(ph) * 0.98;
    const floor = rnd(i, 63) > 0.75; // también desde la solera
    const f0 = floor ? [c[0] + (rnd(i, 64) - 0.5) * 2.2, c[1] + 0.01, c[2] - rnd(i, 65) * 1.2] : [sx, sy, sz];
    const k = fr(t * 0.45 + rnd(i, 66)), tgt = [POT[0], POT[1] + 0.16, POT[2]];
    const kk = k * 0.82;
    heat.push(lerp(f0[0], tgt[0], kk), lerp(f0[1], tgt[1], kk), lerp(f0[2], tgt[2], kk));
  }
  // vapor dentro de la olla
  const steam: number[] = [];
  if (S.steamIn && S.pot) for (let i = 0; i < 90; i++) { const k = fr(t * 0.3 + rnd(i, 71)), a = rnd(i, 72) * Math.PI + Math.PI + k * 3; steam.push(POT[0] + Math.cos(a) * 0.2 * (0.4 + 0.6 * rnd(i, 73)), POT[1] + 0.12 + k * 0.12, POT[2] + Math.sin(a) * 0.12 * rnd(i, 74)); }
  // chispas doradas (azúcares y proteínas que se cocinan juntos)
  const spk: number[] = [];
  if (S.sparkle > 0.02) for (let i = 0; i < 120; i++) { const a = rnd(i, 81) * Math.PI * 2, rr = 0.17 * Math.sqrt(rnd(i, 82)); const k = fr(t * 0.8 + rnd(i, 83)); spk.push(POT[0] + Math.cos(a) * rr, POT[1] + 0.13 + 0.06 * Math.sin(a * 3) + k * 0.08, POT[2] + Math.sin(a) * rr * 0.3 - 0.02); }
  const glow = S.brickHeat;
  return (
    <group>
      {/* plinto de piedra revocada */}
      <Box p={[OV[0], 0.5, OV[2]]} s={[3.6, 1.0, 3.4]} c="#8f877b" r={0.95} map={tex.plaster} />
      <Box p={[OV[0], 0.985, OV[2]]} s={[3.7, 0.05, 3.5]} c="#6e655a" r={0.9} />
      {/* solera de ladrillo (cara de arriba, sólo la mitad de atrás) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[c[0], c[1] + 0.012, c[2]]} receiveShadow><circleGeometry args={[DOME_R, 48, 0, Math.PI]} /><meshStandardMaterial map={tex.brick} color="#a76a4a" roughness={0.95} emissive="#ff4a10" emissiveIntensity={0.08 * glow} /></mesh>
      {/* la cúpula: cáscara de afuera (revoque gris) + adentro (ladrillo tiznado que brilla con el calor) */}
      <mesh position={c} castShadow receiveShadow><sphereGeometry args={[DOME_R + DOME_T, 56, 28, Math.PI, Math.PI, 0, Math.PI / 2]} /><meshStandardMaterial color="#8d8a84" roughness={0.95} map={tex.plaster} side={THREE.DoubleSide} /></mesh>
      <mesh position={c} receiveShadow><sphereGeometry args={[DOME_R, 56, 28, Math.PI, Math.PI, 0, Math.PI / 2]} /><meshStandardMaterial color="#6a3a26" roughness={0.9} map={tex.brick} side={THREE.BackSide} emissive="#ff5a1e" emissiveIntensity={0.12 + 0.55 * glow} /></mesh>
      {/* el corte de la cúpula: hilada de ladrillos a la vista */}
      <mesh position={[c[0], c[1], c[2] + 0.002]}><ringGeometry args={[DOME_R, DOME_R + DOME_T, 56, 2, 0, Math.PI]} /><meshStandardMaterial map={tex.brick} color="#b07050" roughness={0.95} emissive="#ff4a10" emissiveIntensity={0.1 * glow} /></mesh>
      <mesh position={[c[0], c[1], c[2] + 0.004]}><ringGeometry args={[DOME_R + DOME_T - 0.05, DOME_R + DOME_T, 56, 1, 0, Math.PI]} /><meshStandardMaterial color="#9a958c" roughness={1} /></mesh>
      {/* chimenea */}
      <Cyl p={[c[0] + 0.5, c[1] + DOME_R + 0.9, c[2] - 0.7]} r={0.16} h={1.6} c="#7b766d" ro={0.95} />
      {/* fuego */}
      {branches}{flames}<pointLight position={[c[0], c[1] + 0.4, c[2] - 0.3]} intensity={9 * S.fire * (0.88 + 0.12 * Math.sin(t * 9))} distance={6} color="#ff8a3a" castShadow />
      <pointLight position={[c[0], c[1] + 0.6, c[2] - 0.2]} intensity={7 * glow * (1 - S.fire)} distance={4} color="#ff7a3a" />
      <Pts pos={emb} size={0.025} col="#ffb35a" o={0.9 * S.fire} map={flake} addB />
      <Pts pos={heat} size={0.05} col="#ff8a3a" o={0.75 * S.heatIn} map={flake} addB />
      {/* la olla de hierro (mitad de atrás) con su tapa */}
      {S.pot && (
        <group position={POT}>
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow><cylinderGeometry args={[0.24, 0.23, 0.2, 40, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#1f1e1d" metalness={0.6} roughness={0.55} side={THREE.DoubleSide} emissive="#ff3a10" emissiveIntensity={0.12 * S.heatIn} /></mesh>
          <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.23, 0.23, 0.012, 40, 1, false, Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#1f1e1d" metalness={0.6} roughness={0.55} /></mesh>
          {/* corte de la pared de la olla */}
          {[-1, 1].map((s) => <mesh key={s} position={[s * 0.235, 0.1, 0.001]}><planeGeometry args={[0.014, 0.2]} /><meshStandardMaterial color="#5a5450" roughness={0.6} metalness={0.4} /></mesh>)}
          {/* tapa */}
          {S.lid > 0.02 && <group position={[0, 0.205 + (1 - S.lid) * 0.5, -(1 - S.lid) * 0.3]} rotation={[-(1 - S.lid) * 0.6, 0, 0]}>
            <mesh><sphereGeometry args={[0.245, 40, 12, Math.PI, Math.PI, 0, 0.42]} /><meshStandardMaterial color="#232120" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
            <Cyl p={[0, 0.235, -0.01]} r={0.03} h={0.03} c="#2a2826" m={0.6} ro={0.5} />
          </group>}
          {S.loafIn && <Loaf p={[0, 0.012, 0]} t={t} brick={0} crust={S.crust} spring={S.spring} ear={S.spring} scale={1.15} tex={tex} />}
          {/* termómetro de pinchar */}
          {S.probe > 0.02 && <group position={[0.04, 0.12 + 0.2 * (1 - S.probe), 0.0]}>
            <Cyl p={[0, 0.06, 0]} r={0.003} h={0.16} c="#d8dadc" m={0.9} ro={0.2} />
            <Cyl p={[0, 0.15, 0]} r={0.028} h={0.012} c="#e9e9e9" m={0.6} ro={0.3} rot={[Math.PI / 2, 0, 0]} />
          </group>}
        </group>
      )}
      <Pts pos={steam} size={0.06} col="#f4f1ea" o={0.45} map={flake} />
      <Pts pos={spk} size={0.02} col="#ffc65a" o={0.95 * S.sparkle} map={flake} addB />
    </group>
  );
};

// ---------- la artesa de madera de la noche (la masa respira) ----------
const Trough: React.FC<{ t: number }> = ({ t }) => {
  const br = 0.006 * Math.sin(t * 1.3);
  return (
    <group position={[-7.0, 0, -2.6]}>
      <Box p={[0, 0.35, 0]} s={[1.6, 0.7, 0.7]} c="#6a4a30" r={0.8} />
      <Box p={[0, 0.72, 0]} s={[1.5, 0.05, 0.6]} c="#e6d5b0" r={0.8} />
      <Box p={[0, 0.76 + br, 0]} s={[1.52, 0.04, 0.62]} c="#b59a6a" r={1} />
    </group>
  );
};

// ---------- el MACRO: adentro de la masa ----------
type Prot = { p: THREE.Vector3; kind: number; d: number };
const PROT: Prot[] = Array.from({ length: 150 }, (_, i) => ({ p: new THREE.Vector3((rnd(i, 101) - 0.5) * 7.2, (rnd(i, 102) - 0.5) * 3.8, (rnd(i, 103) - 0.5) * 2.4), kind: i % 2, d: rnd(i, 104) }));
// manos: cada proteína con su vecina más cercana de la OTRA clase (cadenas); red: 2ª y 3ª vecina
const LINKS: { a: number; b: number; net: boolean; d: number }[] = (() => {
  const L: { a: number; b: number; net: boolean; d: number }[] = []; const seen = new Set<string>();
  PROT.forEach((q, i) => {
    const near = PROT.map((r, j) => ({ j, d: q.p.distanceTo(r.p) })).filter((x) => x.j !== i).sort((x, y) => x.d - y.d);
    const other = near.filter((x) => PROT[x.j].kind !== q.kind);
    const pushL = (j: number, net: boolean) => { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (seen.has(k)) return; seen.add(k); L.push({ a: i, b: j, net, d: rnd(i * 7 + j, 105) }); };
    pushL(other[0].j, false);
    pushL(near[1].j, true); if (near[2].d < 1.3) pushL(near[2].j, true);
  });
  return L;
})();
const BUB = Array.from({ length: 9 }, (_, i) => ({ c: new THREE.Vector3((rnd(i, 111) - 0.5) * 5.4, (rnd(i, 112) - 0.5) * 2.6, (rnd(i, 113) - 0.5) * 1.2), r: 0.45 + 0.4 * rnd(i, 114), d: rnd(i, 115) }));
const YEAST = Array.from({ length: 14 }, (_, i) => ({ p: new THREE.Vector3((rnd(i, 121) - 0.5) * 6, (rnd(i, 122) - 0.5) * 3, (rnd(i, 123) - 0.2) * 1.6), d: rnd(i, 124), dies: rnd(i, 125) < 0.8 }));
const Macro: React.FC<{ t: number; flake: Tx }> = ({ t, flake }) => {
  const M = macroState(t);
  const pos = PROT.map((q, i) => {
    const p = q.p.clone();
    p.x += Math.sin(t * 0.6 + i) * 0.04; p.y += Math.cos(t * 0.5 + i * 1.3) * 0.04;
    if (M.align > 0) { const row = Math.round(p.y / 0.55) * 0.55; p.y = lerp(p.y, row, 0.75 * M.align); p.z *= 1 - 0.5 * M.align; }
    // las burbujas empujan la red hacia afuera
    BUB.forEach((b) => { const r = b.r * M.gas * (0.6 + 0.4 * b.d); if (r < 0.02) return; const v = p.clone().sub(b.c); const dd = v.length(); if (dd < r + 0.12) p.copy(b.c.clone().add(v.normalize().multiplyScalar(r + 0.12))); });
    return p.add(new THREE.Vector3(MC[0], MC[1], MC[2]));
  });
  const prots = PROT.map((q, i) => {
    const s = (q.kind ? 0.075 : 0.06) * sm((M.prot - q.d * 0.6) / 0.4);
    if (s < 0.004) return null;
    return <mesh key={i} position={pos[i]} scale={[s * (q.kind ? 1.6 : 1), s, s]} rotation={[0, 0, q.d * 3]} geometry={SPH}><meshStandardMaterial color={q.kind ? "#e6a443" : "#f4deaa"} roughness={0.45} emissive={q.kind ? "#7a4a10" : "#5a4a20"} emissiveIntensity={0.25} /></mesh>;
  });
  const links = LINKS.map((L, i) => {
    const g = L.net ? sm((M.netK - L.d * 0.7) / 0.3) : sm((M.pairs - L.d * 0.7) / 0.3);
    const tornK = M.torn * (rnd(i, 131) > 0.55 ? 1 : 0);
    const gg = g * (1 - tornK * 0.85);
    if (gg < 0.02) return null;
    const a = pos[L.a], b = pos[L.b];
    const m = a.clone().add(b).multiplyScalar(0.5);
    const a2 = m.clone().lerp(a, gg), b2 = m.clone().lerp(b, gg);
    return <Rod key={i} a={a2} b={b2} r={L.net ? 0.012 : 0.017} c={L.net ? "#f0c476" : "#ffd27a"} e="#c07a20" ei={0.35 + 0.4 * (1 - gg)} />;
  });
  // agua que llega
  const wat: number[] = [];
  if (M.water > 0.02) for (let i = 0; i < 260; i++) { const k = fr(t * 0.18 + rnd(i, 141)); wat.push(MC[0] - 4.5 + k * 9, MC[1] + (rnd(i, 142) - 0.5) * 3.6 + Math.sin(k * 9 + i) * 0.1, MC[2] + (rnd(i, 143) - 0.5) * 2.2); }
  // levaduras: vivas (doradas, laten, sueltan gas) o muertas (grises, achicadas)
  const yeast = M.yeastShow > 0 ? YEAST.map((y, i) => {
    const dead = y.dies ? M.die : 0, alive = M.awake * (1 - dead);
    const pulse = 1 + 0.08 * Math.sin(t * 4 + i) * alive;
    const s = 0.16 * pulse * (1 - 0.35 * dead);
    const col = new THREE.Color("#c99a55").lerp(new THREE.Color("#6d6a66"), dead);
    const p = y.p.clone().add(new THREE.Vector3(MC[0], MC[1], MC[2]));
    return (
      <group key={i}>
        <mesh position={p} scale={[s * 1.25, s, s]} geometry={SPH}><meshStandardMaterial color={col} roughness={0.5} emissive="#ffb04a" emissiveIntensity={0.5 * alive} /></mesh>
        <mesh position={p.clone().add(new THREE.Vector3(s * 1.1, s * 0.5, 0))} scale={[s * 0.45, s * 0.45, s * 0.45]} geometry={SPH}><meshStandardMaterial color={col} roughness={0.5} emissive="#ffb04a" emissiveIntensity={0.4 * alive} /></mesh>
      </group>
    );
  }) : null;
  // gas: burbujitas que salen de las levaduras vivas
  const co2: number[] = [];
  if (M.yeastShow > 0) YEAST.forEach((y, i) => { const alive = M.awake * (1 - (y.dies ? M.die : 0)); if (alive < 0.1) return; for (let k = 0; k < 10; k++) { const ph = fr(t * 0.5 + k / 10 + y.d); co2.push(MC[0] + y.p.x + Math.sin(k * 2.3 + i) * ph * 0.5, MC[1] + y.p.y + ph * 0.7, MC[2] + y.p.z + Math.cos(k * 1.7) * ph * 0.3); } });
  // burbujas grandes dentro de la red
  const bubs = M.gas > 0.02 ? BUB.map((b, i) => { const r = b.r * M.gas * (0.6 + 0.4 * b.d); return <mesh key={i} position={b.c.clone().add(new THREE.Vector3(MC[0], MC[1], MC[2]))} scale={[r, r, r]} geometry={SPH}><meshPhysicalMaterial color="#fff6e0" roughness={0.05} transmission={0.8} transparent opacity={0.35} clearcoat={1} depthWrite={false} /></mesh>; }) : null;
  return (
    <group>
      {/* el "adentro": una esfera crema-dorada que encierra la escena */}
      <mesh position={MC}><sphereGeometry args={[10, 40, 24]} /><meshStandardMaterial color="#4a3418" emissive="#3a2408" emissiveIntensity={0.6} roughness={1} side={THREE.BackSide} /></mesh>
      <pointLight position={[MC[0] + 2, MC[1] + 3, MC[2] + 4]} intensity={60} distance={18} color="#ffe2b0" />
      <pointLight position={[MC[0] - 3, MC[1] - 1, MC[2] + 2]} intensity={25} distance={12} color="#ffb060" />
      {prots}{links}{yeast}{bubs}
      <Pts pos={wat} size={0.09} col="#8fd0ff" o={0.85 * M.water} map={flake} addB />
      <Pts pos={co2} size={0.07} col="#fff4d6" o={0.8} map={flake} />
      {/* motas de harina flotando (profundidad) */}
      <Pts pos={Array.from({ length: 160 }, (_, i) => [MC[0] + (rnd(i, 151) - 0.5) * 12, MC[1] + (rnd(i, 152) - 0.5) * 7 + Math.sin(t * 0.3 + i) * 0.1, MC[2] + (rnd(i, 153) - 0.5) * 6]).flat()} size={0.05} col="#f6e7c6" o={0.35} map={flake} />
    </group>
  );
};

// ---------- el PAN DEL VIDEO sobre la mesa (hogaza / panecillos / focaccia / baguettes) ----------
const Prod: React.FC<{ t: number; k: number; bake: number; tex: ReturnType<typeof useBakeryTex> }> = ({ t, k, bake, tex }) => {
  if (k <= 0.01) return null;
  const raw = new THREE.Color("#efe2c2"), gold = new THREE.Color("#b8692a"), dark = new THREE.Color("#7a3c14");
  const cc = raw.clone().lerp(gold, Math.min(1, bake * 1.3)).lerp(dark, Math.max(0, bake - 0.75) * 2);
  const hex = "#" + cc.getHexString();
  const sc = 0.92 + 0.08 * k;
  if (PROD === "rolls") return (
    <group position={PT.prod} scale={[sc, sc, sc]}>
      <Box p={[0, 0.008, 0]} s={[0.82, 0.016, 0.54]} c="#2a2724" m={0.6} r={0.45} />
      {Array.from({ length: 12 }, (_, i) => { const x = -0.29 + (i % 4) * 0.195, z = -0.16 + Math.floor(i / 4) * 0.16, h = 0.045 + 0.02 * bake;
        return <Ball key={i} p={[x, 0.016 + h * 0.55, z]} s={[0.072 + 0.006 * rnd(i, 3), h, 0.068]} c={hex} r={0.55 - 0.15 * bake} />; })}
    </group>);
  if (PROD === "focaccia") return (
    <group position={PT.prod} scale={[sc, sc, sc]}>
      <Box p={[0, 0.03, 0]} s={[0.8, 0.06, 0.52]} c="#232120" m={0.6} r={0.4} rad={0.012} />
      <Box p={[0, 0.058, 0]} s={[0.74, 0.04 + 0.025 * bake, 0.46]} c={hex} r={0.35} rad={0.02} />
      {Array.from({ length: 40 }, (_, i) => { const x = -0.32 + (i % 8) * 0.092, z = -0.18 + Math.floor(i / 8) * 0.09;
        return <Ball key={i} p={[x + 0.02 * rnd(i, 4), 0.08 + 0.025 * bake, z]} s={[0.018, 0.006, 0.018]} c="#8a4a18" r={0.2} m={0.1} />; })}
      {Array.from({ length: 26 }, (_, i) => <Ball key={"r" + i} p={[-0.34 + 0.68 * rnd(i, 7), 0.085 + 0.025 * bake, -0.2 + 0.4 * rnd(i, 8)]} s={[0.012, 0.004, 0.004]} c="#3f5a24" r={0.6} />)}
    </group>);
  if (PROD === "baguette") return (
    <group position={PT.prod} scale={[sc, sc, sc]}>
      <Box p={[0, 0.006, 0]} s={[0.86, 0.012, 0.5]} c="#bdb3a2" r={1} map={tex.sack} />
      {[0, 1, 2].map((j) => { const z = -0.15 + j * 0.15, h = 0.035 + 0.015 * bake;
        return <group key={j} position={[0, 0.02 + h, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.9]} castShadow receiveShadow><capsuleGeometry args={[0.042 + 0.006 * bake, 0.62, 8, 20]} /><meshStandardMaterial color={cc} roughness={0.5} /></mesh>
          {[-0.2, 0, 0.2].map((x, q) => <mesh key={q} position={[x, 0.04 + 0.006 * bake, 0]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.13, 0.006, 0.014 + 0.012 * bake]} /><meshStandardMaterial color={raw.clone().lerp(gold, bake * 0.5)} roughness={0.8} /></mesh>)}
        </group>; })}
    </group>);
  return (
    <group position={PT.prod}>
      <Box p={[0, 0.01, 0]} s={[0.5, 0.02, 0.36]} c="#b08a5a" r={0.7} />
      <Loaf p={[0, 0.02, 0]} t={t} brick={0} crust={0.3 + 0.62 * bake} spring={bake} ear={bake} tex={tex} />
    </group>);
};

// ---------------- LA ESCENA ----------------
export const BakeryWorld: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const bt = useBakeryTex();
  const S = estado(t);
  const flake = tx.flake;
  const dawn = S.dawn;
  // vapor del pan caliente, humo gris del horno, nieve en la ventana
  const st: number[] = [];
  if (S.hot > 0.02) for (let i = 0; i < 120; i++) { const k = fr(t * 0.25 + rnd(i, 241)); st.push(PT.prod[0] + (rnd(i, 242) - 0.5) * 0.5, PT.prod[1] + 0.06 + k * 0.5, PT.prod[2] + (rnd(i, 243) - 0.5) * 0.3 + Math.sin(k * 7 + i) * 0.02); }
  const smoke: number[] = [];
  if (S.smoke > 0.01) for (let i = 0; i < 220; i++) { const k = fr(t * 0.12 + rnd(i, 261)); smoke.push(OV[0] + (rnd(i, 262) - 0.5) * (0.9 + 1.6 * k) + Math.sin(k * 5 + i) * 0.15, OV[1] + 1.5 + k * 2.6, OV[2] + 1.1 + (rnd(i, 263) - 0.5) * 0.6 + k * 0.5); }
  const snw: number[] = [];
  if (S.snow > 0.01) for (let i = 0; i < 160; i++) { const k = fr(t * 0.09 + rnd(i, 271)); snw.push(PT.window[0] + (rnd(i, 272) - 0.5) * 1.05 + Math.sin(t * 0.8 + i) * 0.03, PT.window[1] + 0.5 - k * 1.0, PT.window[2] + 0.012); }
  // harina suspendida en el aire (profundidad, siempre viva)
  const dust = Array.from({ length: 140 }, (_, i) => [-6 + 11 * rnd(i, 281), 0.6 + 2.6 * fr(rnd(i, 282) + t * 0.006), -3.6 + 7 * rnd(i, 283)]).flat();
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <CamRig t={t} />
      <Post bloom={0.5} threshold={0.97} exposure={1.0 + 0.15 * dawn} env={0.45 + 0.1 * dawn} />
      <color attach="background" args={["#1a120c"]} />
      <fogExp2 attach="fog" args={["#1a120c", 0.012]} />
      <hemisphereLight args={["#ffe2c0", "#3a2a1e", 0.45 + 0.4 * dawn]} />
      {/* bombita sobre la mesa + luz de la ventana (siempre montadas: sólo cambia la intensidad) */}
      <pointLight position={[1.4, 2.6, 0.6]} intensity={11} distance={7} color="#ffd8a0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
      <Ball p={[1.4, 2.62, 0.6]} s={0.05} c="#fff2d0" e="#ffd8a0" ei={3} />
      <Rod a={new THREE.Vector3(1.4, 2.66, 0.6)} b={new THREE.Vector3(1.4, 3.6, 0.6)} r={0.004} c="#222" />
      <directionalLight position={[-1, 4, -8]} intensity={0.25 + 1.6 * dawn} color="#ffd9a8" />
      <pointLight position={[2.5, 1.6, 3.5]} intensity={5} distance={8} color="#ffe6c8" />

      {/* ===== LA PANADERÍA ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[16, 10]} /><meshStandardMaterial map={bt.terracotta} roughness={0.85} /></mesh>
      <mesh position={[-1, 2.0, -4]} receiveShadow><planeGeometry args={[16, 4]} /><meshStandardMaterial map={bt.plaster} color="#e2d6c0" roughness={0.95} /></mesh>
      <mesh position={[-8, 2.0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[10, 4]} /><meshStandardMaterial map={bt.plaster} color="#d8ccb4" roughness={0.95} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[-6.5 + i * 2.1, 3.85, 0]} s={[0.22, 0.26, 8]} c="#4a3220" r={0.9} />)}
      <mesh position={PT.window}><planeGeometry args={[1.1, 1.0]} /><meshBasicMaterial color={new THREE.Color("#1b2a48").lerp(new THREE.Color("#ffc888"), dawn)} toneMapped={false} /></mesh>
      <Box p={[PT.window[0], PT.window[1], -3.93]} s={[1.2, 0.06, 0.06]} c="#5a3e28" />
      <Box p={[PT.window[0], PT.window[1], -3.93]} s={[0.06, 1.1, 0.06]} c="#5a3e28" />
      {/* estantes con panes */}
      <Box p={[3.4, 1.6, -3.75]} s={[3.2, 0.05, 0.42]} c="#5e4028" />
      <Box p={[3.4, 2.3, -3.75]} s={[3.2, 0.05, 0.42]} c="#5e4028" />
      {/* ménsulas de hierro y panes de verdad (hogazas con greña y harina, alguna barra) */}
      {[2.0, 3.4, 4.8].map((x, i) => <Box key={"m" + i} p={[x, 1.45, -3.82]} s={[0.04, 0.3, 0.3]} c="#2a2420" m={0.6} r={0.5} />)}
      {Array.from({ length: 12 }, (_, i) => { const row = i < 6 ? 0 : 1, j = i % 6, bar = (i === 2 || i === 9);
        return bar ? <group key={i} position={[2.05 + j * 0.55, row ? 2.38 : 1.68, -3.72]} rotation={[0, 0.15, P2]}><mesh scale={[0.06, 0.26, 0.06]} castShadow><sphereGeometry args={[1, 24, 12]} /><meshPhysicalMaterial color={corteza(0.8)} roughness={0.6} clearcoat={0.2} /></mesh></group>
          : <Hogaza key={i} p={[2.05 + j * 0.55, row ? 2.33 : 1.63, -3.72 + (rnd(i, 253) - 0.5) * 0.06]} rot={[0, rnd(i, 254) * 3, 0]} s={0.42 + 0.08 * rnd(i, 251)} bake={0.7 + 0.3 * rnd(i, 252)} open={1} flour={0.25 + 0.3 * rnd(i, 255)} />; })}
      {/* bolsas de harina */}
      {Array.from({ length: 6 }, (_, i) => { const x = -7.0 + (i % 3) * 0.72 + (Math.floor(i / 3) ? 0.36 : 0), y = Math.floor(i / 3) ? 0.62 : 0.24, z = 0.9 + (rnd(i, 261) - 0.5) * 0.12;
        return <group key={i} position={[x, y, z]} rotation={[0, (rnd(i, 262) - 0.5) * 0.5, (rnd(i, 263) - 0.5) * 0.12]}>
          <mesh scale={[0.34, 0.24, 0.27]} castShadow receiveShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#d8c8a4" map={bt.sack} roughness={1} /></mesh>
          {Math.floor(i / 3) === 1 && <group><mesh position={[0, 0.24, 0]} scale={[0.09, 0.1, 0.09]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#d8c8a4" map={bt.sack} roughness={1} /></mesh>
            <mesh position={[0, 0.27, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.06, 0.008, 6, 20]} /><meshStandardMaterial color="#8a6a3a" roughness={1} /></mesh>
            <mesh position={[0, 0.36, 0]} scale={[0.07, 0.06, 0.07]}><coneGeometry args={[1, 1, 10]} /><meshStandardMaterial color="#d8c8a4" map={bt.sack} roughness={1} /></mesh></group>}
          <mesh position={[0, 0.0, 0.27]}><planeGeometry args={[0.28, 0.16]} /><meshStandardMaterial map={stencil()} transparent roughness={1} depthWrite={false} /></mesh>
        </group>; })}
      {/* la pala de madera de Don Aurelio, apoyada */}
      <group position={[-1.6, 0, -3.75]} rotation={[0.18, 0, 0]}>
        <Box p={[0, 1.2, 0]} s={[0.05, 2.0, 0.04]} c="#8a6038" />
        <Box p={[0, 2.35, 0]} s={[0.4, 0.45, 0.02]} c="#9a6c40" rad={0.01} />
      </group>
      <Trough t={t} />
      {/* la mesa de amasar */}
      <Box p={[1.6, TOP - 0.03, 0.4]} s={[2.9, 0.06, 1.45]} c="#9a7650" map={tx.planks} r={0.8} />
      {[[-1.3, -0.6], [1.3, -0.6], [-1.3, 0.6], [1.3, 0.6]].map(([x, z], i) => <Box key={i} p={[1.6 + x, (TOP - 0.06) / 2, 0.4 + z]} s={[0.09, TOP - 0.06, 0.09]} c="#6a4a30" />)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.9, TOP + 0.001, 0.35]}><circleGeometry args={[0.3, 32]} /><meshStandardMaterial color="#f4efe4" transparent opacity={0.22} roughness={1} /></mesh>
      <Bowl t={t} tex={bt} />
      <Cup p={CA} t={t} dense fill={1.18} show={S.cups} />
      <Cup p={CB} t={t} dense={false} fill={0.95} show={S.cups} />
      <Scale t={t} />
      {/* tabla con la hogaza cortada (ladrillo vs miga abierta) */}
      <Box p={[LF[0], TOP + 0.01, LF[2] + 0.02]} s={[0.5, 0.02, 0.36]} c="#b08a5a" r={0.7} />
      {S.slice > 0.5 && <Loaf p={add(LF, 0, 0.02, 0)} t={t} brick={S.brick} crust={S.brick > 0.5 ? 0.12 : 0.92} spring={S.brick > 0.5 ? 0 : 1} ear={S.brick > 0.5 ? 0 : 1} tex={bt} />}
      <Prod t={t} k={S.prod} bake={S.bake} tex={bt} />
      <Pts pos={st} size={0.07} col="#f6f3ee" o={0.45 * S.hot} map={flake} />
      <Pts pos={smoke} size={0.32} col="#6e6862" o={0.55 * S.smoke} map={flake} />
      <Pts pos={snw} size={0.03} col="#ffffff" o={0.95 * S.snow} map={flake} />
      <Pts pos={dust} size={0.018} col="#f6e7c6" o={0.35} map={flake} />
      <Oven t={t} tex={bt} flake={flake} />

      {/* ===== EL MACRO ===== */}
      <Macro t={t} flake={flake} />
    </ThreeCanvas>
  );
};

// el mundo con desenfoque de movimiento real (velocidad de cámara proyectada)
export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><BakeryWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
