// hdc28a · EL MUNDO: el patio de Claudio con el sol de la mañana que entra de costado. En el centro, el cajón de ajos de 30 cm de hondo
// CORTADO al medio (la mitad de adelante no está): se ve la tierra en corte con la capa de piedritas abajo y SEIS dientes enterrados a
// 5 cm, punta arriba, con sus raíces; arriba las hojas planas del ajo; la cabeza que engorda abajo, la vara floral con su rulo y el corte.
// A la izquierda, la maceta chica del AJO TIERNO (hojas finitas que se cortan y vuelven). A la derecha, la mesa de trabajo: la cabeza
// del súper en su malla y la morada de feria, los dientes separados (grandes de afuera / chicos del centro), el vaso con los dientes
// echando raíz, la bolsa de papel, los tres montoncitos de la mezcla 2-1-1 con la ceniza. En la pared, la ristra de ajos curándose.
// UNA escena y UNA cámara (KEYS en tl.ts). Luces SIEMPRE montadas (sólo cambia la intensidad). Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();
type V = [number, number, number];

// ---------------- medidas ----------------
// el cajón: de X -0,55 a 0,55, fondo z -0,2 a 0 (la cara de adelante = el corte en z 0), alto 0,62; tierra a 0,56
const BX = 0.55, BD = 0.32, BH = 0.62, SOIL = 0.56, GRAV = 0.07;
const CLOVES = [-0.4, -0.24, -0.08, 0.08, 0.24, 0.4];  // x de cada diente (10-12 cm, a escala de cuadro)
const CZ = -0.05, CY = SOIL - 0.11;                    // centro del diente: punta a 5 cm de la superficie
export const CHIVE: V = [-1.35, 0, 0.1];
export const TABLE: V = [1.55, 0.78, -0.35];
export const GLASS: V = [1.95, 0.78, -0.25];
export const BOOK: V = [0.7, 0.76, 1.15];
export const BRAID: V = [-0.4, 1.95, -2.52];

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.008; p.y += Math.sin(t * 0.71 + 1) * 0.006;
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

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  tiles: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 1); g.fillStyle = `rgb(${170 + v * 30},${92 + v * 18},${60 + v * 12})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
    g.fillStyle = "rgba(90,70,55,.9)"; for (let k = 0; k <= 4; k++) { g.fillRect(k * 64 - 2, 0, 4, 256); g.fillRect(0, k * 64 - 2, 256, 4); }
    for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(60,30,15,${0.12 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
  }, [10, 5]),
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#ece6da"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = 210 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 6},${v - 16},.35)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
    const gr = g.createLinearGradient(0, 200, 0, 256); gr.addColorStop(0, "rgba(150,130,100,0)"); gr.addColorStop(1, "rgba(150,130,100,.35)"); g.fillStyle = gr; g.fillRect(0, 200, 256, 56);
  }, [6, 1]),
  // la tierra en corte: suelta y oscura con compost (puntitos), arena clara, y la capa de piedritas abajo
  section: mk(512, 300, (g) => {
    g.fillStyle = "#4a3424"; g.fillRect(0, 0, 512, 300);
    const gy = 300 * (1 - GRAV / SOIL);
    for (let i = 0; i < 2600; i++) { const y = rnd(i, 3) * gy; g.fillStyle = rnd(i, 9) > 0.7 ? `rgba(214,196,160,${0.5 * rnd(i, 2)})` : `rgba(20,12,6,${0.4 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 4) * 512, y, 0.8 + rnd(i, 5) * 2.2, 0, 6.3); g.fill(); }
    g.fillStyle = "#6e6458"; g.fillRect(0, gy, 512, 300 - gy);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgb(${120 + rnd(i, 6) * 70},${110 + rnd(i, 6) * 60},${100 + rnd(i, 6) * 50})`; g.beginPath(); g.ellipse(rnd(i, 7) * 512, gy + 4 + rnd(i, 8) * (300 - gy - 6), 4 + rnd(i, 1) * 6, 3 + rnd(i, 2) * 4, rnd(i, 3) * 3, 0, 6.3); g.fill(); }
  }),
  wood: mk(256, 64, (g) => {
    g.fillStyle = "#8a5f3a"; g.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(60,36,18,${0.15 + 0.2 * rnd(i, 1)})`; g.lineWidth = 1 + rnd(i, 2) * 2; g.beginPath(); const y = rnd(i, 3) * 64; g.moveTo(0, y); g.bezierCurveTo(80, y + 6 * (rnd(i, 4) - 0.5), 170, y - 6 * (rnd(i, 5) - 0.5), 256, y); g.stroke(); }
  }, [2, 1]),
}), []);
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas libro"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};

// ---------------- piezas ----------------
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: THREE.Texture; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V; seg?: number; e?: string; ei?: number; op?: number; open?: boolean }> = ({ p, r, r2, h, c, rough = 0.8, m = 0, rot, seg = 32, e, ei = 0, op, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
const Seg: React.FC<{ a: V; b: V; r: number; c: string; r2?: number; e?: string; ei?: number; flat?: number }> = ({ a, b, r, c, r2, e, ei = 0, flat = 1 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), d = B.clone().sub(A), len = d.length();
  if (len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} scale={[1, 1, flat]} castShadow><cylinderGeometry args={[r2 ?? r, r, len, 8]} /><meshStandardMaterial color={c} roughness={0.7} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};

// un diente de ajo: gota con la punta arriba y el platito chato abajo (rot = 0 punta arriba · PI = al revés)
const Clove: React.FC<{ p: V; s?: number; rot?: V; col?: string; glow?: number; rotK?: number }> = ({ p, s = 1, rot, col = "#ddd0b4", glow = 0, rotK = 0 }) => {
  const c = mix(col, "#5a3a1e", rotK);
  return <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0, 0]} scale={[0.024, 0.032, 0.02]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={c} roughness={0.55} emissive="#ffe9a0" emissiveIntensity={0.03 * glow} /></mesh>
    <mesh position={[0, 0.034, 0]} castShadow><coneGeometry args={[0.012, 0.03, 12]} /><meshStandardMaterial color={c} roughness={0.55} emissive="#ffe9a0" emissiveIntensity={0.03 * glow} /></mesh>
    <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.016, 0.018, 0.006, 14]} /><meshStandardMaterial color={mix("#c8b48a", "#4a2e16", rotK)} roughness={0.9} /></mesh>
  </group>;
};
// la cabeza: dientes alrededor de un centro, envueltos en piel (k = cuánto engordó · pur = vetas moradas)
const Bulb: React.FC<{ p: V; k: number; pur?: number; glow?: number; s?: number; open?: number }> = ({ p, k, pur = 0, glow = 0, s = 1, open = 0 }) => {
  if (k < 0.02) return null;
  const sk = mix("#f3ece0", "#b77ab0", pur * 0.55);
  return <group position={p} scale={s}>
    {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2, rr = 0.03 * k * (1 + open * 0.6); return (
      <mesh key={i} position={[Math.cos(a) * rr, 0, Math.sin(a) * rr]} rotation={[Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25]} scale={[0.024 * k, 0.04 * Math.max(0.5, k), 0.024 * k]} castShadow>
        <sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={i % 3 === 0 ? sk : mix("#e2d7c2", sk, 0.5)} roughness={0.7} emissive="#ffe9a0" emissiveIntensity={0.02 * glow} />
      </mesh>); })}
    <mesh position={[0, 0.035 * Math.max(0.5, k), 0]}><coneGeometry args={[0.03 * k, 0.05, 14]} /><meshStandardMaterial color={sk} roughness={0.6} /></mesh>
    <mesh position={[0, -0.036 * Math.max(0.5, k), 0]}><cylinderGeometry args={[0.022 * k, 0.026 * k, 0.008, 14]} /><meshStandardMaterial color="#c9b386" roughness={0.9} /></mesh>
  </group>;
};
// la hoja del ajo: cinta plana que sube y se arquea (3 tramos)
const Leaf: React.FC<{ base: V; ang: number; len: number; col: string; droop?: number; w?: number }> = ({ base, ang, len, col, droop = 0.4, w = 0.012 }) => {
  if (len < 0.01) return null;
  const dx = Math.sin(ang), dz = Math.cos(ang);
  const p1: V = [base[0] + dx * len * 0.08, base[1] + len * 0.45, base[2] + dz * len * 0.08];
  const p2: V = [base[0] + dx * len * (0.25 + droop * 0.2), base[1] + len * (0.8 - droop * 0.15), base[2] + dz * len * (0.25 + droop * 0.2)];
  const p3: V = [base[0] + dx * len * (0.45 + droop * 0.35), base[1] + len * (0.95 - droop * 0.55), base[2] + dz * len * (0.45 + droop * 0.35)];
  return <>
    <Seg a={base} b={p1} r={w} r2={w * 0.95} c={col} flat={0.3} />
    <Seg a={p1} b={p2} r={w * 0.95} r2={w * 0.8} c={col} flat={0.3} />
    <Seg a={p2} b={p3} r={w * 0.8} r2={w * 0.2} c={col} flat={0.3} />
  </>;
};
// la vara floral: sube derecha, hace un rulo entero y termina en la gota cerrada
const Scape: React.FC<{ base: V; k: number; cut: number; hi: number }> = ({ base, k, cut, hi }) => {
  if (k < 0.01) return null;
  const h = 0.32 * k, pts: V[] = [base, [base[0], base[1] + h * 0.6, base[2]]];
  const loop = cl(k * 1.5 - 0.4);
  for (let i = 1; i <= 10; i++) { const a = (i / 10) * Math.PI * 2 * loop; pts.push([base[0] + Math.sin(a) * 0.05, base[1] + h * 0.6 + 0.05 - Math.cos(a) * 0.05 + 0.02 * i / 10, base[2] + 0.01 * i / 10]); }
  const top = pts[pts.length - 1];
  const cutY = base[1] + 0.03;
  return <group>
    {cut < 0.5 ? <>
      {pts.slice(1).map((q, i) => <Seg key={i} a={pts[i]} b={q} r={0.006} c="#6f9a4a" e="#c8ff7a" ei={0.6 * hi} />)}
      <mesh position={[top[0] + 0.02, top[1] + 0.03, top[2]]} scale={[0.012, 0.03, 0.012]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#a9c98a" emissive="#c8ff7a" emissiveIntensity={0.6 * hi} /></mesh>
    </> : <Seg a={base} b={[base[0], cutY, base[2]]} r={0.006} c="#8fb86a" />}
  </group>;
};

const Dust: React.FC<{ k: number; t: number; col: string; from: V; to: number; n?: number; spread?: number; size?: number }> = ({ k, t, col, from, to, n = 60, spread = 0.35, size = 0.008 }) => (
  <>{Array.from({ length: n }, (_, i) => {
    const ph = (t * (0.35 + 0.25 * rnd(i, 1)) + rnd(i, 2)) % 1, y = lerp(from[1], to, ph);
    const x = from[0] + (rnd(i, 3) - 0.5) * spread * (0.4 + ph), z = from[2] + (rnd(i, 4) - 0.5) * spread * 0.6;
    return <mesh key={i} position={[x, y, z]} visible={k > 0.01}><sphereGeometry args={[size * (0.7 + rnd(i, 5)), 6, 6]} /><meshBasicMaterial color={col} transparent opacity={k * Math.sin(Math.PI * ph)} toneMapped={false} /></mesh>;
  })}</>
);

const SidePot: React.FC<{ p: V; s: number; canopy: string; fruit?: string; tall?: number }> = ({ p, s, canopy, fruit, tall = 0 }) => (
  <group position={p} scale={s}>
    <Cyl p={[0, 0.17, 0]} r={0.2} r2={0.15} h={0.34} c="#b5653d" rough={0.85} />
    <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.19, 24]} /><meshStandardMaterial color="#3f2c1e" /></mesh>
    {tall > 0 && <Seg a={[0, 0.33, 0]} b={[0, 0.33 + tall, 0]} r={0.025} c="#6b5236" />}
    <mesh position={[0, 0.55 + tall, 0]} scale={[0.32, 0.26 + tall * 0.1, 0.3]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={canopy} roughness={0.85} /></mesh>
    {fruit && Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.5, 0.45 + tall + rnd(i, 2) * 0.25, 0.18 + rnd(i, 3) * 0.1]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color={fruit} roughness={0.35} /></mesh>)}
  </group>
);

const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  const PW = 0.29, PD = 0.438; const w = Math.max(0.001, (u1 - u0) * PW * k), c: V = [-PW / 2 + u0 * PW, 0.0009, -PD / 2 + v * PD];
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]} visible={k > 0.01}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const pg = useImgTex(["m1_p001", "m1_p028"]);
  const s = ST(t);
  // las plantas: hojas (grow), cabeza (bulb), vara (scape); "bare" = recién plantado (sin hojas)
  const grow = s.bare > 0.5 ? s.sprout * 0.18 : 1;
  const leafCol = mix("#4f8a3c", "#3a6e2c", s.lush);
  const soilCol = mix(mix("#5a4130", "#2e1d12", s.wet), "#9a7c5c", s.dry);
  const sunI = 2.2 * (1 - 0.6 * s.shade) + 0.6 * s.sunHi;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.3} threshold={0.97} exposure={1.1} env={0.45} />
      <color attach="background" args={["#a9c6dc"]} />
      <fog attach="fog" args={["#bfd2e0", 14, 40]} />
      <hemisphereLight args={["#e3edf6", "#7a5a3c", 0.75]} />
      {/* el sol de la mañana entra de costado (luz siempre montada: sólo cambia la intensidad) */}
      <directionalLight position={[5, 5.5, 3]} intensity={sunI} color="#fff0d6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[0, 1.2, 1.4]} intensity={0.9} distance={4} color="#fff4e4" />
      <pointLight position={[0, SOIL - 0.15, 0.45]} intensity={0.12 + 0.12 * s.glow} distance={1.2} color="#ffe2a0" />
      <pointLight position={[BOOK[0], 1.4, BOOK[2] + 0.4]} intensity={0.8 * s.book} distance={2.5} color="#fff4e6" />

      {/* piso de baldosa y pared encalada */}
      <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[16, 8]} /><meshStandardMaterial map={tx.tiles} roughness={0.9} /></mesh>
      <Box p={[0, 1.6, -2.65]} s={[16, 3.2, 0.2]} c="#d8cdbb" map={tx.wall} r={0.95} rad={0.01} />
      <Box p={[0, 3.24, -2.6]} s={[16, 0.1, 0.3]} c="#c9b8a0" r={0.9} rad={0.01} />

      {/* ===== EL CAJÓN DE LOS AJOS EN CORTE ===== */}
      <group>
        <Box p={[0, BH / 2, -BD - 0.02]} s={[2 * BX + 0.06, BH, 0.04]} c="#8a6a45" map={tx.wood} r={0.85} rad={0.008} />
        <Box p={[-BX - 0.02, BH / 2, -BD / 2]} s={[0.04, BH, BD + 0.04]} c="#7d603e" map={tx.wood} r={0.85} rad={0.008} />
        <Box p={[BX + 0.02, BH / 2, -BD / 2]} s={[0.04, BH, BD + 0.04]} c="#7d603e" map={tx.wood} r={0.85} rad={0.008} />
        <Box p={[0, 0.02, -BD / 2]} s={[2 * BX + 0.06, 0.04, BD + 0.04]} c="#6a5038" r={0.9} rad={0.006} />
        {/* los agujeros de abajo (con agua que sale cuando se riega hondo) */}
        {[-0.3, 0, 0.3].map((x, i) => <mesh key={i} position={[x, 0.0, -0.1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.015, 12]} /><meshStandardMaterial color="#1a120a" /></mesh>)}
        <Dust k={s.drain} t={t * 1.6} col="#9fd3ff" from={[0, 0.0, -0.08]} to={-0.02} n={30} spread={0.7} size={0.006} />
        {/* tierra de arriba */}
        <mesh position={[0, SOIL, -BD / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2 * BX, BD]} /><meshStandardMaterial color={soilCol} roughness={s.wet > 0.4 ? 0.45 : 0.95} /></mesh>
        {/* la tierra en corte */}
        <mesh position={[0, SOIL / 2 + 0.02, 0.001]} receiveShadow><planeGeometry args={[2 * BX, SOIL - 0.02]} /><meshStandardMaterial map={tx.section} color={mix("#ffffff", "#8a7a70", s.wet)} roughness={0.95} emissive="#ffe2a0" emissiveIntensity={0.08 * s.glow} /></mesh>
        {/* agua parada abajo (el cajón sin agujeros): la papilla */}
        <mesh position={[0, 0.04 + 0.05 * s.puddle, 0.003]} visible={s.puddle > 0.01}><planeGeometry args={[2 * BX, 0.1 * s.puddle + 0.001]} /><meshStandardMaterial color="#4f6a72" roughness={0.1} metalness={0.2} transparent opacity={0.75 * s.puddle} /></mesh>
        {/* la regla de profundidad pegada al corte: 5 cm iluminado */}
        <group position={[BX - 0.06, SOIL, 0.012]} visible={s.depth > 0.01}>
          <Box p={[0, -0.075, 0]} s={[0.035, 0.17, 0.006]} c="#f2d64a" r={0.5} rad={0.002} op={s.depth} />
          {[0, 1, 2, 3, 4, 5].map((k) => <Box key={k} p={[-0.008, -k * 0.024, 0.004]} s={[0.018, 0.003, 0.002]} c="#222" rad={0.0005} />)}
          <Box p={[-0.05, -0.11, 0.002]} s={[0.07, 0.004, 0.002]} c="#ff7a3d" e="#ff7a3d" ei={1.2 * s.depth} rad={0.0005} />
        </group>
        {/* el acolchado de paja */}
        {Array.from({ length: 160 }, (_, i) => (
          <mesh key={"m" + i} visible={i / 160 < s.mulch} position={[(rnd(i, 1) - 0.5) * 2 * BX * 0.95, SOIL + 0.006 + rnd(i, 3) * 0.02, -0.02 - rnd(i, 2) * (BD - 0.04)]} rotation={[rnd(i, 8) * 0.4, rnd(i, 4) * 6, rnd(i, 5) * 0.4]}>
            <boxGeometry args={[0.05 + 0.03 * rnd(i, 6), 0.003, 0.006]} /><meshStandardMaterial color={["#c9a85e", "#b8954a", "#dcc078", "#a8864a"][i % 4]} roughness={1} />
          </mesh>))}
        {/* los seis dientes y sus plantas */}
        {CLOVES.map((x, i) => {
          const up = i === 1 && s.upside > 0.5, bad = i === 4 ? s.rot : 0, deepK = i === 2 ? s.deep : 0, shallowK = i === 3 ? s.shallow : 0;
          const cy = CY - 0.09 * deepK + 0.07 * shallowK, liftK = i === 2 ? ease(s.lift) : 0;
          const bulbK = lerp(0.25, 1, s.bulb) * (bad > 0.5 ? 0 : 1), pur = s.purple;
          const base: V = [x, SOIL, CZ];
          const L = (grow * (0.42 + 0.06 * rnd(i, 3))) * (1 - 0.5 * s.thin * (i % 2));
          return <group key={i} position={[0, liftK * 0.55, 0]}>
            {/* en el corte: el diente (o la cabeza que engorda) con sus raíces */}
            {bulbK < 0.3 || s.bare > 0.5 ? <Clove p={[x, cy, CZ + 0.03]} s={1.25} rot={up ? [0, 0, Math.PI] : [0, 0, 0]} glow={s.cloveHi} rotK={bad} />
              : <Bulb p={[x, cy, CZ + 0.03]} k={bulbK} pur={pur} glow={s.bulbHi} s={1.2} open={s.overripe} />}
            {Array.from({ length: 7 }, (_, r) => { const rl = (0.04 + 0.08 * rnd(i * 7 + r, 2)) * cl(s.roots + (s.bare > 0.5 ? 0 : 1)) * (bad > 0.5 ? 0.3 : 1); const a = -0.9 + (r / 6) * 1.8;
              return <Seg key={r} a={[x, cy - 0.035, CZ + 0.035]} b={[x + Math.sin(a) * rl * 0.7, cy - 0.035 - Math.cos(a) * rl, CZ + 0.035]} r={0.0022} r2={0.0012} c="#e6d8b4" e="#ffe2a0" ei={0.3 * s.rootHi} />; })}
            {/* el brote que sube (al revés: da la vuelta) */}
            {(s.bare < 0.5 || s.sprout > 0.05) && (up
              ? <><Seg a={[x, cy - 0.04, CZ + 0.03]} b={[x + 0.05, cy - 0.06, CZ + 0.03]} r={0.004} c="#c9d98a" /><Seg a={[x + 0.05, cy - 0.06, CZ + 0.03]} b={[x + 0.07, SOIL + 0.02 * s.sprout, CZ + 0.03]} r={0.004} c="#a8c86a" /></>
              : <Seg a={[x, cy + 0.045, CZ + 0.03]} b={[x, SOIL + (s.bare > 0.5 ? 0.04 * s.sprout : 0.02), CZ + 0.02]} r={0.005} c="#dfe8b0" />)}
            {/* arriba: las hojas planas */}
            {!up && bad < 0.5 && Array.from({ length: 6 }, (_, l) => {
              const low = l < 2, col = low ? mix(leafCol, "#c9a84a", s.yellow * 1.2) : mix(leafCol, "#b59a4a", s.yellow * 0.5);
              return <Leaf key={l} base={base} ang={l * 2.4 + i} len={L * (low ? 0.8 : 1) * (1 - (l === 5 ? s.trim : 0) * 0.7)} col={col} droop={low ? 0.5 + 0.4 * s.yellow : 0.25} />;
            })}
            {/* la vara floral con su rulo (la de la planta del medio se ilumina) */}
            {!up && bad < 0.5 && <Scape base={[x + 0.01, SOIL + 0.1 * grow, CZ]} k={s.scape * grow} cut={s.scapeCut} hi={i === 2 ? s.scapeHi : 0} />}
          </group>;
        })}
        {/* el riego: la regadera inclinada y el agua que baja */}
        <group position={[-0.9 + 0.5 * s.pour, 0.3 + 0.6 * s.pour, 0.1]} rotation={[0, 0.4, -0.7 * s.pour]} visible={s.pour > 0.02}>
          <Cyl p={[0, 0.16, 0]} r={0.12} h={0.32} c="#a8acb0" rough={0.35} m={0.7} />
          <Seg a={[0.1, 0.12, 0]} b={[0.34, 0.36, 0]} r={0.016} r2={0.01} c="#a8acb0" />
        </group>
        <Dust k={s.pour} t={t * 2.2} col="#9fd3ff" from={[-0.1, 1.0, -0.1]} to={SOIL} n={70} spread={0.3} size={0.007} />
        {/* el puñado de compost alrededor (sin tocar el tallo) */}
        <Dust k={s.feed} t={t} col="#ffb84a" from={[0, 1.0, -0.1]} to={SOIL - 0.1} n={60} spread={0.8} size={0.009} />
        {/* el dedo que mide la humedad: un cilindro piel que entra 2 cm */}
        <group position={[0.16, SOIL + 0.12 - 0.1 * s.finger, -0.1]} visible={s.finger > 0.02}>
          <Seg a={[0, 0, 0]} b={[0, 0.25, 0.05]} r={0.016} c="#d6a07a" />
        </group>
      </group>

      {/* ===== LA MACETA CHICA DEL AJO TIERNO (hojas finitas que se cortan y vuelven) ===== */}
      <group position={CHIVE}>
        <Cyl p={[0, 0.16, 0]} r={0.2} r2={0.15} h={0.32} c="#b5653d" rough={0.85} />
        <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.19, 24]} /><meshStandardMaterial color="#3f2c1e" /></mesh>
        {Array.from({ length: 22 }, (_, i) => {
          const a = i * 2.39996, rr = 0.03 + 0.13 * Math.sqrt(i / 22), x = Math.cos(a) * rr, z = Math.sin(a) * rr;
          const hh = s.chiveCut > 0.5 ? 0.03 + 0.25 * s.regrow : 0.28 * s.chive * (0.85 + 0.3 * rnd(i, 4));
          return <React.Fragment key={i}>
            <Seg a={[x, 0.31, z]} b={[x + 0.02 * Math.cos(a), 0.31 + hh, z + 0.02 * Math.sin(a)]} r={0.004} r2={0.002} c="#5f9a44" e="#b8ff7a" ei={0.4 * s.chiveHi} />
          </React.Fragment>;
        })}
        {/* los recortes sobre la tierra y la tijera */}
        {Array.from({ length: 8 }, (_, i) => <mesh key={"c" + i} visible={s.chiveCut > 0.5 && s.regrow < 0.3} position={[0.3 + (rnd(i, 1) - 0.5) * 0.12, 0.012, 0.15 + rnd(i, 2) * 0.08]} rotation={[0, rnd(i, 3) * 3, Math.PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.2, 6]} /><meshStandardMaterial color="#6aa84a" /></mesh>)}
        <group position={[0.22 - 0.1 * s.snip, 0.38, 0.12]} rotation={[0, 0.6, 0.2]} visible={s.snip > 0.02}>
          <Box p={[0, 0, 0]} s={[0.16, 0.012, 0.02]} c="#c7c9cc" m={0.85} r={0.25} rad={0.003} rot={[0, 0, 0.12 * Math.sin(t * 9) * s.snip]} />
          <Box p={[0, 0, 0.004]} s={[0.16, 0.012, 0.02]} c="#c7c9cc" m={0.85} r={0.25} rad={0.003} rot={[0, 0, -0.12 * Math.sin(t * 9) * s.snip]} />
          <mesh position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.007, 8, 16]} /><meshStandardMaterial color="#c0392b" /></mesh>
        </group>
      </group>

      {/* ===== LA MESA DE TRABAJO ===== */}
      <Box p={[TABLE[0] + 0.15, TABLE[1] - 0.03, TABLE[2]]} s={[1.3, 0.06, 0.62]} c="#8a5f3a" map={tx.wood} r={0.8} />
      {[[-0.45, -0.25], [0.75, -0.25], [-0.45, 0.25], [0.75, 0.25]].map(([x, z], i) => <Box key={i} p={[TABLE[0] + x, 0.37, TABLE[2] + z]} s={[0.06, 0.74, 0.06]} c="#76502f" />)}
      {/* la cabeza del súper en su malla roja y la morada de feria */}
      <group position={[TABLE[0] - 0.32, TABLE[1] + 0.05, TABLE[2] + 0.05]} visible={s.split < 0.5}>
        <Bulb p={[0, 0, 0]} k={1} s={1.3} glow={0.6 * s.superHi} />
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, -0.01, 0]} rotation={[0, (i / 10) * Math.PI, 0.3]}><torusGeometry args={[0.062, 0.0018, 4, 24]} /><meshStandardMaterial color="#d23a2a" roughness={0.6} /></mesh>)}
      </group>
      <group position={[TABLE[0] - 0.05, TABLE[1] + 0.05, TABLE[2] + 0.05]} visible={s.split < 0.5}>
        <Bulb p={[0, 0, 0]} k={1} pur={1} s={1.35} glow={0.6 * s.feriaHi} />
      </group>
      {/* los dientes separados: los grandes de afuera adelante, los chicos del centro atrás */}
      {Array.from({ length: 11 }, (_, i) => {
        const big = i < 7, x = TABLE[0] - 0.4 + (big ? i : i - 7) * (big ? 0.075 : 0.07), z = TABLE[2] + (big ? 0.14 : -0.06);
        return <Clove key={"d" + i} p={[x, TABLE[1] + 0.03, z]} s={big ? 1.25 : 0.75} rot={[Math.PI / 2 - 0.3, rnd(i, 2) * 0.6, 0]} col={mix("#efe6d2", "#d7b2cf", 0.5)}
          glow={big ? s.bigHi : s.smallHi} />;
      }).filter(() => s.split > 0.5)}
      {/* el vaso con agua: dientes parados, sólo la base mojada; raicitas y la puntita verde */}
      <group position={GLASS}>
        <Cyl p={[0, 0.06, 0]} r={0.045} h={0.12} c="#cfe3e0" rough={0.05} m={0.1} op={0.33} />
        <Cyl p={[0, 0.02, 0]} r={0.042} h={0.035} c="#a8d2e6" rough={0.1} op={0.55} />
        {[-0.018, 0.018].map((x, i) => <group key={i}>
          <Clove p={[x, 0.075, 0]} s={0.95} />
          {Array.from({ length: 5 }, (_, r) => <Seg key={r} a={[x, 0.045, 0]} b={[x + (r - 2) * 0.006, 0.045 - 0.035 * s.glassRoots, 0.004 * (r - 2)]} r={0.0012} c="#f6f2e6" e="#ffffff" ei={0.3 * s.glassRoots} />)}
          <Seg a={[x, 0.105, 0]} b={[x, 0.105 + 0.06 * s.glassTip, 0]} r={0.003} c="#7fbf4a" e="#b8ff7a" ei={0.5 * s.glassTip} />
        </group>)}
      </group>
      {/* la bolsa de papel del truco del refrigerador */}
      <group position={[TABLE[0] + 0.62, TABLE[1] + 0.1, TABLE[2] - 0.1]} visible={s.bag > 0.02}>
        <Box p={[0, 0, 0]} s={[0.14, 0.2 * s.bag + 0.001, 0.09]} c="#c8a272" r={0.95} rad={0.004} />
      </group>
      {/* la mezcla 2-1-1: tierra, compost, arena y el puñado de ceniza */}
      {[[0, "#5a3f2a", 1.0], [0.18, "#2f2116", 0.7], [0.32, "#cdb98e", 0.7], [0.43, "#9a9a96", 0.3]].map(([x, c, sc], i) => (
        <mesh key={"mx" + i} position={[TABLE[0] + 0.1 + (x as number), TABLE[1] + 0.02, TABLE[2] - 0.17]} scale={[0.07 * (sc as number), 0.05 * (sc as number) * s.mix + 0.0001, 0.06 * (sc as number)]} visible={s.mix > 0.02}>
          <sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={c as string} roughness={1} emissive="#ffe2a0" emissiveIntensity={0.25 * s.mixHi} />
        </mesh>))}
      {/* el tallo floral cortado sobre la mesa (se come salteado) */}
      <group position={[TABLE[0] + 0.25, TABLE[1] + 0.012, TABLE[2] + 0.18]} visible={s.scapeCut > 0.5}>
        {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[i * 0.05, 0, (i % 2) * 0.02]} rotation={[0, 0.2 * i, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.04, 8]} /><meshStandardMaterial color="#8fb86a" /></mesh>)}
      </group>

      {/* ===== LA PARED: la ristra de ajos curados y la rejilla de curado ===== */}
      <group position={BRAID} visible={s.braid > 0.02}>
        <Seg a={[0, 0.25, 0]} b={[0, -0.45 * s.braid, 0.02]} r={0.012} c="#cdb88e" />
        {Array.from({ length: 9 }, (_, i) => <Bulb key={i} p={[(i % 2 ? 0.05 : -0.05), 0.15 - i * 0.065, 0.06]} k={i / 9 < s.braid ? 1 : 0} pur={i % 3 === 0 ? 0.6 : 0.1} s={1.1} glow={0.4 * s.braidHi} />)}
      </group>
      <group position={[0.9, 1.25, -2.45]} visible={s.cure > 0.02}>
        <Box p={[0, 0, 0]} s={[0.9, 0.02, 0.35]} c="#9a7a56" r={0.8} rad={0.004} />
        {Array.from({ length: 6 }, (_, i) => <group key={i}><Bulb p={[-0.35 + i * 0.14, 0.05, 0.05]} k={i / 6 < s.cure ? 1 : 0} s={1.1} /><Seg a={[-0.35 + i * 0.14, 0.08, 0.05]} b={[-0.3 + i * 0.14, 0.11, -0.12]} r={0.006} c={mix("#9a8a4a", "#c9b07a", s.cure)} /></group>)}
      </group>

      {/* macetas de adorno del patio */}
      <SidePot p={[-2.2, 0, -1.7]} s={1.2} canopy="#3d6e2e" fruit="#2f8a2a" />
      <SidePot p={[2.9, 0, -2.0]} s={1.5} canopy="#2f5f26" fruit="#e2c22a" tall={0.5} />
      <SidePot p={[-3.0, 0, -0.9]} s={1.0} canopy="#3a7a33" fruit="#d8261c" />
      <SidePot p={[3.7, 0, -1.2]} s={1.3} canopy="#2c5a24" fruit="#e2c22a" tall={0.4} />
      <SidePot p={[-3.8, 0, -2.0]} s={1.4} canopy="#2f6328" tall={0.6} />

      {/* la mesita con el LIBRO 3 de la colección: se abre en la página del ajo */}
      <Box p={[BOOK[0], 0.72, BOOK[2]]} s={[0.9, 0.04, 0.6]} c="#9a7a56" r={0.6} rad={0.01} />
      {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z], i) => <Box key={"m" + i} p={[BOOK[0] + x, 0.35, BOOK[2] + z]} s={[0.04, 0.7, 0.04]} c="#5a3e28" r={0.6} rad={0.006} />)}
      {s.book > 0.01 && pg.m1_p001 && <Book p={[BOOK[0] - 0.12, BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.08} open={s.open} cover={pg.m1_p001} inside={pg.m1_p028_r} right={pg.m1_p028} spine="#4f8a3c">
        {s.open > 0.9 && <>
          <PageHi k={s.hi[0]} u0={0.07} u1={0.93} v={0.2} h={0.08} />
          <PageHi k={s.hi[1]} u0={0.07} u1={0.93} v={0.5} h={0.09} col="#7dff9e" />
        </>}
      </Book>}
    </ThreeCanvas>
  );
};
