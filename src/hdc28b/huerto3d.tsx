// hdc28b · EL MUNDO: la mesa de la cocina de Claudio con la luz de la mañana entrando por la ventana. En el centro, la BANDEJA de
// semillero CORTADA al medio (la mitad de adelante no está): se ve el sustrato liviano en corte y arriba las semillas de fresa apoyadas
// (nunca enterradas), que brotan con sus dos cotiledones redondos y después la hoja de tres con el borde dentado. Encima, el film con
// gotitas; abajo, la bandeja con un dedo de agua. A la izquierda, la tabla con la fresa más roja, el cuchillo y las tiritas secándose en
// la servilleta; la licuadora y el vaso donde las semillas buenas se van al fondo. A la derecha, el sobrecito y el frasco que van a la
// HELADERA (al fondo, con la puerta que se abre). Adelante, el vasito de yogur del trasplante con la CORONA al ras. Junto a la ventana,
// en el banco, la planta madre en su maceta de 20 con la paja, las flores, las fresas colgando por el borde y el ESTOLÓN prendido con
// un clip en la maceta chica de al lado. UNA escena y UNA cámara (KEYS en tl.ts). Luces SIEMPRE montadas. Render SÓLO en el farm.
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
export const TOP = 0.78;                                  // tapa de la mesa
const TX0 = 0.3, TZ0 = -0.26, TZ1 = 0.0, TB = TOP + 0.012, SOIL = TOP + 0.07;   // bandeja: x ±0,3, fondo z -0,26 → corte en z 0
export const BERRY: V = [-0.72, TOP, 0.08];
export const GLASS: V = [-0.78, TOP, -0.4];
export const BLEND: V = [-1.08, TOP, -0.36];
export const ENV: V = [0.58, TOP, -0.36];
export const CUP: V = [0.68, TOP, 0.2];
export const FRIDGE: V = [2.25, 0, -1.95];
export const BENCH = 0.55;
export const PLANT: V = [-2.05, BENCH, -0.95];
export const RUNPOT: V = [-1.58, BENCH, -0.78];
export const BOOK: V = [0.02, TOP + 0.01, 0.3];

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.006; p.y += Math.sin(t * 0.71 + 1) * 0.005;
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
  // baldosa de cocina, blanca y verde agua
  tiles: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 1); g.fillStyle = (r + c) % 2 ? `rgb(${226 + v * 14},${222 + v * 12},${210 + v * 10})` : `rgb(${150 + v * 14},${184 + v * 12},${172 + v * 10})`; g.fillRect(c * 64 + 1, r * 64 + 1, 62, 62); }
    g.fillStyle = "rgba(120,110,95,.7)"; for (let k = 0; k <= 4; k++) { g.fillRect(k * 64 - 1, 0, 2, 256); g.fillRect(0, k * 64 - 1, 256, 2); }
  }, [12, 6]),
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#efe7d6"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = 214 + rnd(i, 1) * 36; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.3)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }, [6, 1]),
  // azulejos de la pared de la mesada
  backsplash: mk(256, 128, (g) => {
    g.fillStyle = "#7a8f86"; g.fillRect(0, 0, 256, 128);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const v = rnd(r * 8 + c, 5); g.fillStyle = `rgb(${236 - v * 10},${240 - v * 8},${236 - v * 10})`; g.fillRect(c * 32 + 1 + (r % 2) * 16, r * 32 + 1, 30, 30); }
  }, [8, 1]),
  // el sustrato liviano en corte: oscuro, con perlitas blancas y fibra de coco
  section: mk(512, 128, (g) => {
    g.fillStyle = "#4b3424"; g.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 1400; i++) { const r = rnd(i, 9); g.fillStyle = r > 0.82 ? `rgba(240,236,226,${0.7 * rnd(i, 2)})` : r > 0.6 ? `rgba(150,96,52,${0.6 * rnd(i, 2)})` : `rgba(20,12,6,${0.45 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 4) * 512, rnd(i, 3) * 128, 0.8 + rnd(i, 5) * 2.2, 0, 6.3); g.fill(); }
  }),
  wood: mk(256, 64, (g) => {
    g.fillStyle = "#a07448"; g.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(70,42,20,${0.12 + 0.18 * rnd(i, 1)})`; g.lineWidth = 1 + rnd(i, 2) * 2; g.beginPath(); const y = rnd(i, 3) * 64; g.moveTo(0, y); g.bezierCurveTo(80, y + 6 * (rnd(i, 4) - 0.5), 170, y - 6 * (rnd(i, 5) - 0.5), 256, y); g.stroke(); }
  }, [3, 1]),
  // el mantel de cuadritos debajo de la tabla
  napkin: mk(128, 128, (g) => {
    g.fillStyle = "#fbf8f2"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(200,190,170,${0.2 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 128, rnd(i, 3) * 128, 1, 1); }
    g.strokeStyle = "rgba(210,200,180,.6)"; g.lineWidth = 1; for (let k = 8; k < 128; k += 16) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 128); g.stroke(); }
  }),
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
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined || op > 0.6} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V; seg?: number; e?: string; ei?: number; op?: number; open?: boolean; th0?: number; thL?: number }> = ({ p, r, r2, h, c, rough = 0.8, m = 0, rot, seg = 32, e, ei = 0, op, open, th0, thL }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open, th0 ?? 0, thL ?? Math.PI * 2]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined || op > 0.6} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
const Seg: React.FC<{ a: V; b: V; r: number; c: string; r2?: number; e?: string; ei?: number; flat?: number }> = ({ a, b, r, c, r2, e, ei = 0, flat = 1 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), d = B.clone().sub(A), len = d.length();
  if (len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} scale={[1, 1, flat]} castShadow><cylinderGeometry args={[r2 ?? r, r, len, 8]} /><meshStandardMaterial color={c} roughness={0.7} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};

// la FRESA: perfil de corazón en torno (punta abajo), con sus semillitas por fuera y el cáliz verde arriba
const berryGeo = (() => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) { const y = -1 + (i / 16) * 2; const r = Math.sin(Math.acos(Math.max(-1, Math.min(1, y)))) * (0.55 + 0.45 * (y + 1) / 2) * (y > 0.7 ? 1 - (y - 0.7) * 1.2 : 1); pts.push(new THREE.Vector2(Math.max(0.001, r), y)); }
  return new THREE.LatheGeometry(pts, 28);
})();
const Berry: React.FC<{ p: V; s?: number; ripe?: number; rot?: V; glow?: number; cut?: number }> = ({ p, s = 1, ripe = 1, rot, glow = 0, cut = 0 }) => {
  const c = mix("#e9f0c8", "#d2202a", ripe);
  return <group position={p} rotation={rot} scale={s}>
    <mesh geometry={berryGeo} scale={[0.026, 0.032, 0.026]} castShadow><meshStandardMaterial color={c} roughness={0.32} metalness={0.02} emissive="#ff6a50" emissiveIntensity={0.05 * glow} /></mesh>
    {/* las semillas (aquenios): puntitos amarillos hundidos en la piel; las de la tirita que se sacó (cut) faltan */}
    {Array.from({ length: 46 }, (_, i) => {
      const y = -0.85 + 1.5 * rnd(i, 1), a = i * 2.39996; if (cut > 0.5 && Math.cos(a) > 0.55 && y > -0.4) return null;
      const r = Math.sin(Math.acos(y)) * (0.55 + 0.45 * (y + 1) / 2) * 1.01;
      return <mesh key={i} position={[Math.sin(a) * r * 0.026, y * 0.032, Math.cos(a) * r * 0.026]} scale={[0.0016, 0.0024, 0.0016]}><sphereGeometry args={[1, 6, 5]} /><meshStandardMaterial color={mix("#f0e080", "#c9a640", ripe)} roughness={0.5} emissive="#ffe080" emissiveIntensity={0.25 * glow} /></mesh>;
    })}
    {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return <mesh key={"k" + i} position={[Math.sin(a) * 0.012, 0.03, Math.cos(a) * 0.012]} rotation={[Math.cos(a) * 1.1, 0, -Math.sin(a) * 1.1]} scale={[0.006, 0.0015, 0.016]} castShadow><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#4f8a2e" roughness={0.7} /></mesh>; })}
    <Seg a={[0, 0.03, 0]} b={[0.003, 0.05, 0]} r={0.0018} c="#5f8a3a" />
  </group>;
};
// un foliolo: hoja ovalada aplastada con la vena (la hoja de la fresa = 3 foliolos sobre un peciolo)
const Leaflet: React.FC<{ p: V; ang: number; tilt: number; s: number; col: string; e?: number }> = ({ p, ang, tilt, s, col, e = 0 }) => (
  <group position={p} rotation={[0, ang, 0]}>
    <mesh position={[0, 0, s * 0.9]} rotation={[tilt, 0, 0]} scale={[s * 0.62, s * 0.08, s]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={col} roughness={0.6} emissive="#b8ff7a" emissiveIntensity={e} /></mesh>
  </group>
);
const Trifol: React.FC<{ base: V; ang: number; len: number; s: number; col: string; e?: number; up?: number }> = ({ base, ang, len, s, col, e = 0, up = 0.85 }) => {
  if (len < 0.004) return null;
  const tip: V = [base[0] + Math.sin(ang) * len * 0.55, base[1] + len * up, base[2] + Math.cos(ang) * len * 0.55];
  return <>
    <Seg a={base} b={tip} r={0.0025 * s / 0.03} r2={0.0018 * s / 0.03} c="#6f9a4a" />
    {[-0.75, 0, 0.75].map((d, i) => <Leaflet key={i} p={tip} ang={ang + d} tilt={-0.35 + Math.abs(d) * 0.2} s={s} col={col} e={e} />)}
  </>;
};
// la plantita del semillero: tallito, los dos cotiledones redondos y (después) la primera hoja de tres
const Seedling: React.FC<{ p: V; k: number; tru: number; leggy: number; fall: number; col: string; hi: number; i: number }> = ({ p, k, tru, leggy, fall, col, hi, i }) => {
  if (k < 0.02) return null;
  const h = (0.012 + 0.022 * k) * (1 + 1.6 * leggy), ang = rnd(i, 7) * 6.28;
  const stem = mix("#c9e09a", "#e8f0c8", leggy);
  // cotiledones en V (abiertos ~30° hacia arriba) y tallo con una curvita: de costado se leen como hojitas, no como clavos
  const lean = (rnd(i, 9) - 0.5) * 0.35, hl = h * (0.8 + 0.4 * rnd(i, 11));
  return <group position={p} rotation={[fall * 1.35 * Math.cos(ang) + lean * 0.5, 0, fall * 1.35 * Math.sin(ang) + lean]}>
    <Seg a={[0, 0, 0]} b={[0.002 * Math.sin(ang), hl, 0.002 * Math.cos(ang)]} r={0.0016} r2={0.0011} c={stem} />
    <group position={[0.002 * Math.sin(ang), hl, 0.002 * Math.cos(ang)]} rotation={[0, ang, 0]}>
      {[1, -1].map((d, j) => <group key={j} rotation={[0, 0, d * (0.55 + 0.15 * rnd(i, 12 + j))]}>
        <mesh position={[d * 0.0062 * k, 0.0004, 0]} scale={[0.0062 * k, 0.0016, 0.0046 * k]} castShadow>
          <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={col} roughness={0.5} emissive="#c8ff7a" emissiveIntensity={0.35 * hi} />
        </mesh>
      </group>)}
    </group>
    {tru > 0.02 && <Trifol base={[0, hl, 0]} ang={ang + 1.57} len={0.016 * tru} s={0.006 * tru} col={mix(col, "#3f7a2c", 0.5)} e={0.25 * hi} />}
  </group>;
};
// la planta adulta: corona, hojas de tres, flores blancas de centro amarillo y fresas colgando por el borde
const Flower: React.FC<{ p: V; s?: number; hi?: number }> = ({ p, s = 1, hi = 0 }) => (
  <group position={p} scale={s} rotation={[-0.5, 0, 0]}>
    {Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.011, 0, Math.sin(a) * 0.011]} scale={[0.009, 0.0015, 0.009]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#fbfaf4" roughness={0.6} emissive="#fff6d0" emissiveIntensity={0.15 * hi} /></mesh>; })}
    <mesh position={[0, 0.002, 0]} scale={[0.006, 0.004, 0.006]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#f2c230" roughness={0.6} /></mesh>
  </group>
);

const Dust: React.FC<{ k: number; t: number; col: string; from: V; to: number; n?: number; spread?: number; size?: number }> = ({ k, t, col, from, to, n = 60, spread = 0.35, size = 0.008 }) => (
  <>{Array.from({ length: n }, (_, i) => {
    const ph = (t * (0.35 + 0.25 * rnd(i, 1)) + rnd(i, 2)) % 1, y = lerp(from[1], to, ph);
    const x = from[0] + (rnd(i, 3) - 0.5) * spread * (0.4 + ph), z = from[2] + (rnd(i, 4) - 0.5) * spread * 0.6;
    return <mesh key={i} position={[x, y, z]} visible={k > 0.01}><sphereGeometry args={[size * (0.7 + rnd(i, 5)), 6, 6]} /><meshBasicMaterial color={col} transparent opacity={k * 0.7 * Math.sin(Math.PI * ph)} toneMapped={false} depthWrite={false} /></mesh>;
  })}</>
);

const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  const PW = 0.29, PD = 0.438; const w = Math.max(0.001, (u1 - u0) * PW * k), c: V = [-PW / 2 + u0 * PW, 0.0009, -PD / 2 + v * PD];
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]} visible={k > 0.01}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};

// las 140 posiciones del semillero (grilla con temblor) y las plantas de la bandeja
const SEEDS = Array.from({ length: 140 }, (_, i) => {
  const c = i % 20, r = Math.floor(i / 20);
  return { x: -TX0 + 0.02 + (c + 0.5) * ((2 * TX0 - 0.04) / 20) + (rnd(i, 1) - 0.5) * 0.012, z: TZ0 + 0.02 + (r + 0.5) * ((TZ1 - TZ0 - 0.035) / 7) + (rnd(i, 2) - 0.5) * 0.012, i };
});

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const pg = useImgTex(["m1_p001", "m1_p028"]);
  const s = ST(t);
  // el semillero: "bare" = recién sembrado (semillas sin brotar); si no, la bandeja llena de plantitas
  const bareK = s.bare > 0.5;
  const sproutK = bareK ? s.germ * 0.35 : 1;
  const tru = bareK ? 0 : Math.max(s.trueLeaf, s.cup > 0.5 ? 1 : 0);
  const soilCol = mix(mix("#5a4130", "#2e1d12", Math.max(s.wet, s.bottomUp)), "#8f7458", s.dry);
  const sunI = 2.0 + 0.7 * s.sunHi;
  const doorA = -1.6 * ease(s.fridge);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.3} threshold={0.97} exposure={1.1} env={0.45} />
      <color attach="background" args={["#d9e4ea"]} />
      <fog attach="fog" args={["#e4ebee", 14, 40]} />
      <hemisphereLight args={["#eef3f6", "#8a6a4c", 0.75]} />
      {/* la luz de la mañana por la ventana (luces siempre montadas: sólo cambia la intensidad) */}
      <directionalLight position={[-3.5, 4.5, 2.2]} intensity={sunI} color="#fff0d6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-2} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[0, 1.5, 1.2]} intensity={0.8} distance={4} color="#fff4e4" />
      <pointLight position={[0, SOIL + 0.25, 0.35]} intensity={0.1 + 0.12 * s.glow} distance={1.0} color="#fff2d0" />
      <pointLight position={[FRIDGE[0] - 0.05, 0.9, FRIDGE[2] + 0.2]} intensity={0.7 * ease(s.fridge)} distance={1.4} color="#d8ecff" />
      <pointLight position={[BOOK[0], 1.4, BOOK[2] + 0.4]} intensity={0.8 * s.book} distance={2.5} color="#fff4e6" />

      {/* piso, pared con azulejos y la ventana luminosa */}
      <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[16, 8]} /><meshStandardMaterial map={tx.tiles} roughness={0.7} /></mesh>
      <Box p={[0, 1.6, -2.65]} s={[16, 3.2, 0.2]} c="#e6dccb" map={tx.wall} r={0.95} rad={0.01} />
      <Box p={[0.9, 1.2, -2.54]} s={[3.6, 0.6, 0.02]} c="#ffffff" map={tx.backsplash} r={0.4} rad={0.003} />
      <group position={[-1.95, 1.55, -2.54]}>
        <Box p={[0, 0, 0]} s={[1.2, 1.1, 0.04]} c="#f4f1ea" r={0.6} rad={0.01} />
        <mesh position={[0, 0, 0.025]}><planeGeometry args={[1.08, 0.98]} /><meshBasicMaterial color={mix("#dcefff", "#fff6dc", 0.35 + 0.4 * s.sunHi)} toneMapped={false} /></mesh>
        <Box p={[0, 0, 0.04]} s={[0.035, 1.0, 0.03]} c="#f4f1ea" r={0.6} rad={0.004} />
        <Box p={[0, 0, 0.04]} s={[1.1, 0.035, 0.03]} c="#f4f1ea" r={0.6} rad={0.004} />
        <Box p={[0, -0.58, 0.08]} s={[1.3, 0.04, 0.18]} c="#e8e2d6" r={0.6} rad={0.006} />
      </group>
      {/* la mesada del fondo con la pileta */}
      <Box p={[0.9, 0.45, -2.28]} s={[3.6, 0.9, 0.55]} c="#d9cfbf" r={0.7} rad={0.01} />
      <Box p={[0.9, 0.92, -2.28]} s={[3.7, 0.04, 0.6]} c="#3a3a3c" r={0.35} m={0.1} rad={0.008} />

      {/* ===== LA MESA DE LA COCINA ===== */}
      <Box p={[-0.2, TOP - 0.025, -0.08]} s={[2.4, 0.05, 1.2]} c="#a07448" map={tx.wood} r={0.7} rad={0.012} />
      {[[-1.3, -0.6], [0.9, -0.6], [-1.3, 0.45], [0.9, 0.45]].map(([x, z], i) => <Box key={i} p={[x, (TOP - 0.05) / 2, z]} s={[0.06, TOP - 0.05, 0.06]} c="#7a5434" />)}

      {/* ===== LA BANDEJA DE SEMILLERO EN CORTE ===== */}
      <group>
        {/* la bandeja de afuera con un dedo de agua (riego desde abajo) */}
        <group visible={s.bottom > 0.02}>
          <Box p={[0, TOP + 0.004, (TZ0 + TZ1) / 2 - 0.01]} s={[2 * TX0 + 0.1, 0.008, TZ1 - TZ0 + 0.08]} c="#2d2f33" r={0.5} rad={0.004} />
          <Box p={[-TX0 - 0.05, TOP + 0.03, (TZ0 + TZ1) / 2 - 0.01]} s={[0.008, 0.05, TZ1 - TZ0 + 0.08]} c="#2d2f33" r={0.5} rad={0.002} />
          <Box p={[TX0 + 0.05, TOP + 0.03, (TZ0 + TZ1) / 2 - 0.01]} s={[0.008, 0.05, TZ1 - TZ0 + 0.08]} c="#2d2f33" r={0.5} rad={0.002} />
          <mesh position={[0, TOP + 0.009 + 0.012 * s.bottom, (TZ0 + TZ1) / 2 - 0.01]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2 * TX0 + 0.09, TZ1 - TZ0 + 0.07]} /><meshStandardMaterial color="#8fc4dc" roughness={0.08} metalness={0.2} transparent opacity={0.55 * s.bottom} depthWrite={false} /></mesh>
        </group>
        {/* el fondo y los costados de la bandeja (plástico negro, con los agujeritos) */}
        <Box p={[0, TB - 0.004, (TZ0 + TZ1) / 2]} s={[2 * TX0 + 0.012, 0.008, TZ1 - TZ0]} c="#1f2124" r={0.45} rad={0.003} />
        <Box p={[0, (TB + SOIL) / 2 + 0.006, TZ0 - 0.004]} s={[2 * TX0 + 0.012, SOIL - TB + 0.02, 0.008]} c="#1f2124" r={0.45} rad={0.003} />
        <Box p={[-TX0 - 0.002, (TB + SOIL) / 2 + 0.006, (TZ0 + TZ1) / 2]} s={[0.008, SOIL - TB + 0.02, TZ1 - TZ0]} c="#1f2124" r={0.45} rad={0.003} />
        <Box p={[TX0 + 0.002, (TB + SOIL) / 2 + 0.006, (TZ0 + TZ1) / 2]} s={[0.008, SOIL - TB + 0.02, TZ1 - TZ0]} c="#1f2124" r={0.45} rad={0.003} />
        {/* el sustrato: arriba y en corte (se moja de abajo hacia arriba cuando chupa el agua) */}
        <mesh position={[0, SOIL, (TZ0 + TZ1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2 * TX0, TZ1 - TZ0]} /><meshStandardMaterial color={soilCol} roughness={s.wet > 0.4 ? 0.5 : 0.95} /></mesh>
        <mesh position={[0, (TB + SOIL) / 2, TZ1 + 0.001]} receiveShadow><planeGeometry args={[2 * TX0, SOIL - TB]} /><meshStandardMaterial map={tx.section} color={mix("#ffffff", "#9a8a80", s.wet)} roughness={0.95} emissive="#fff2d0" emissiveIntensity={0.06 * s.glow} /></mesh>
        <mesh position={[0, TB + (SOIL - TB) * s.bottomUp / 2, TZ1 + 0.002]} visible={s.bottomUp > 0.01}><planeGeometry args={[2 * TX0, (SOIL - TB) * s.bottomUp + 0.0005]} /><meshBasicMaterial color="#1a2a3a" transparent opacity={0.35} depthWrite={false} /></mesh>
        {/* la capa de tierra encima (el error: enterrarlas) */}
        <mesh position={[0, SOIL + 0.006, (TZ0 + TZ1) / 2]} rotation={[-Math.PI / 2, 0, 0]} visible={s.buried > 0.02}><planeGeometry args={[2 * TX0, TZ1 - TZ0]} /><meshStandardMaterial color="#3a2a1c" roughness={1} transparent opacity={s.buried} /></mesh>
        <mesh position={[0, SOIL + 0.003, TZ1 + 0.0015]} visible={s.buried > 0.02}><planeGeometry args={[2 * TX0, 0.012 * s.buried + 0.0005]} /><meshStandardMaterial color="#3a2a1c" roughness={1} /></mesh>
        {/* la arenita fina espolvoreada */}
        {Array.from({ length: 220 }, (_, i) => <mesh key={"a" + i} visible={i / 220 < s.sand} position={[(rnd(i, 3) - 0.5) * 2 * TX0 * 0.97, SOIL + 0.0012, TZ0 + 0.01 + rnd(i, 4) * (TZ1 - TZ0 - 0.02)]}><sphereGeometry args={[0.0018, 5, 4]} /><meshStandardMaterial color="#e6dcc0" roughness={1} /></mesh>)}
        {/* las semillas apoyadas arriba (y la plantita que sale de cada una) */}
        {SEEDS.map(({ x, z, i }) => {
          const thinOut = s.thin > 0.5 && i % 3 === 1, corner = x > 0.12 && z < -0.13;
          const pale = x > 0.05 ? s.pale * cl((x - 0.05) / 0.2) : 0;
          const col = mix(mix("#7fbf4a", "#d9e48a", pale), "#cfe0a0", s.leggy);
          const fall = corner ? s.damp : 0;
          return <group key={i}>
            <mesh position={[x, SOIL + 0.0016, z]} visible={i / 140 < s.sow && s.buried < 0.5} rotation={[0, rnd(i, 5) * 3, 0]} scale={[0.0026, 0.0017, 0.0018]}><sphereGeometry args={[1, 7, 5]} /><meshStandardMaterial color="#d9b25a" roughness={0.5} emissive="#ffe080" emissiveIntensity={0.3 * s.seedHi} /></mesh>
            {!thinOut && <Seedling p={[x, SOIL, z]} k={sproutK * (bareK ? (i % 4 === 0 ? 1 : 0) : 0.75 + 0.25 * rnd(i, 6))} tru={tru * (0.6 + 0.4 * rnd(i, 8))} leggy={s.leggy} fall={fall} col={col} hi={s.cotyHi} i={i} />}
          </group>;
        })}
        {/* la pelucita blanca del hongo en el rincón */}
        {Array.from({ length: 14 }, (_, i) => <mesh key={"f" + i} visible={s.fuzz > 0.02} position={[0.16 + rnd(i, 1) * 0.12, SOIL + 0.004, -0.16 - rnd(i, 2) * 0.08]} scale={[0.012 + 0.01 * rnd(i, 3), 0.004, 0.012 + 0.01 * rnd(i, 4)]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#f6f4ee" roughness={1} transparent opacity={0.85 * s.fuzz} depthWrite={false} /></mesh>)}
        {/* el FILM plástico estirado arriba, con las gotitas de la condensación; se levanta de a poco para ventilar */}
        <group position={[0, SOIL + 0.07, TZ0]} rotation={[-0.55 * ease(s.vent), 0, 0]} visible={s.film > 0.02}>
          <mesh position={[0, 0, (TZ1 - TZ0) / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2 * TX0 + 0.02, TZ1 - TZ0 + 0.01]} /><meshStandardMaterial color="#eef6fa" roughness={0.05} metalness={0.1} transparent opacity={0.22 * s.film} depthWrite={false} side={THREE.DoubleSide} /></mesh>
          {Array.from({ length: 90 }, (_, i) => <mesh key={"d" + i} visible={i / 90 < s.drops} position={[(rnd(i, 6) - 0.5) * 2 * TX0 * 0.95, -0.003, 0.01 + rnd(i, 7) * (TZ1 - TZ0 - 0.02)]} scale={[0.0035 + 0.003 * rnd(i, 8), 0.0025, 0.0035 + 0.003 * rnd(i, 8)]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#dff0ff" roughness={0.02} metalness={0.3} transparent opacity={0.7 * s.film} depthWrite={false} /></mesh>)}
        </group>
        {[[-TX0, TZ0], [TX0, TZ0], [-TX0, TZ1], [TX0, TZ1]].map(([x, z], i) => <mesh key={"fp" + i} visible={s.film > 0.02 && s.vent < 0.3} position={[x, SOIL + 0.035, z]}><planeGeometry args={[0.002, 0.07]} /><meshStandardMaterial color="#eef6fa" transparent opacity={0.25 * s.film} depthWrite={false} /></mesh>)}
        {/* el palillo de dientes que lleva una semilla en la punta */}
        <group position={[0.12, SOIL + 0.004 + 0.03 * (1 - s.pick), -0.1]} rotation={[0.5, 0.3, 0.3]} visible={s.pick > 0.02}>
          <Seg a={[0, 0, 0]} b={[0, 0.12, 0]} r={0.0016} r2={0.001} c="#e8d3a8" />
          <mesh position={[0, -0.001, 0]} scale={[0.0026, 0.0017, 0.0018]}><sphereGeometry args={[1, 7, 5]} /><meshStandardMaterial color="#d9b25a" roughness={0.5} /></mesh>
        </group>
        {/* el fondo del vaso que aprieta suave toda la superficie */}
        <group position={[-0.1, SOIL + 0.025 + 0.06 * (1 - s.press), -0.12]} visible={s.press > 0.02}>
          <Cyl p={[0, 0.05, 0]} r={0.04} h={0.1} c="#d8eef0" rough={0.05} op={0.4} />
          <Cyl p={[0, 0.0, 0]} r={0.041} h={0.008} c="#cfe3e8" rough={0.05} op={0.6} />
        </group>
        {/* el rociador que tira una niebla finita */}
        <group position={[0.42, SOIL + 0.12, -0.02]} rotation={[0, -0.6, 0.35]} visible={s.spray > 0.02}>
          <Cyl p={[0, 0, 0]} r={0.032} r2={0.036} h={0.13} c="#f2f6f8" rough={0.15} op={0.7} />
          <Cyl p={[0, -0.02, 0]} r={0.031} h={0.07} c="#bfe4f2" rough={0.1} op={0.6} />
          <Box p={[0, 0.085, 0]} s={[0.05, 0.04, 0.035]} c="#2f7ad6" r={0.4} rad={0.008} />
          <Box p={[-0.03, 0.095, 0]} s={[0.025, 0.01, 0.012]} c="#2f7ad6" r={0.4} rad={0.003} />
        </group>
        <Dust k={s.spray} t={t * 1.5} col="#e6f6ff" from={[0.2, SOIL + 0.16, -0.08]} to={SOIL} n={60} spread={0.35} size={0.003} />
        {/* el palito de helado que levanta la plantita con su terroncito */}
        <group position={[0.22, SOIL + 0.07 * ease(s.lift), -0.06]} visible={s.lift > 0.02}>
          <Box p={[0, -0.012, 0]} s={[0.026, 0.024, 0.026]} c="#3f2c1e" r={1} rad={0.006} />
          <Seedling p={[0, 0, 0]} k={1} tru={1} leggy={0} fall={0} col="#7fbf4a" hi={0} i={3} />
          <Box p={[0.03, 0.0, 0.01]} s={[0.012, 0.1, 0.003]} rot={[0, 0, -0.5]} c="#e8d3a8" r={0.8} rad={0.002} />
        </group>
      </group>

      {/* ===== LA TABLA CON LA FRESA, EL CUCHILLO Y LA SERVILLETA ===== */}
      <Box p={[BERRY[0], TOP + 0.01, BERRY[2]]} s={[0.34, 0.02, 0.22]} c="#c69c6d" map={tx.wood} r={0.6} rad={0.008} />
      <Berry p={[BERRY[0] - 0.05, TOP + 0.05, BERRY[2]]} s={1.5} ripe={1} rot={[0, 0.4, -0.15]} glow={s.berryHi} cut={s.strip} />
      <Berry p={[BERRY[0] + 0.08, TOP + 0.045, BERRY[2] - 0.04]} s={1.25} ripe={0.45} rot={[0, -0.6, 0.2]} glow={0} />
      {/* el cuchillo chico */}
      <group position={[BERRY[0] + 0.06, TOP + 0.024, BERRY[2] + 0.07]} rotation={[0, 0.35 + 0.2 * s.strip, 0]}>
        <Box p={[0.04, 0, 0]} s={[0.09, 0.003, 0.016]} c="#d0d4d8" m={0.9} r={0.2} rad={0.001} />
        <Box p={[-0.04, 0.002, 0]} s={[0.07, 0.012, 0.018]} c="#2b2b2b" r={0.5} rad={0.004} />
      </group>
      {/* la servilleta con las tiritas de piel y semillas secándose; el platito con las semillas juntas */}
      <group position={[BERRY[0] - 0.02, TOP, BERRY[2] + 0.25]} visible={s.napkin > 0.02}>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0.1]}><planeGeometry args={[0.26, 0.18]} /><meshStandardMaterial map={tx.napkin} roughness={1} /></mesh>
        {Array.from({ length: 5 }, (_, i) => <group key={i} position={[-0.08 + i * 0.04, 0.005, (rnd(i, 1) - 0.5) * 0.04]} rotation={[0, 0.2 * (rnd(i, 2) - 0.5), 0]}>
          <Box p={[0, 0, 0]} s={[0.012, 0.003, 0.1 * (1 - 0.15 * s.dryStrip)]} c={mix("#d42a30", "#7a1a1c", s.dryStrip)} r={0.5} rad={0.001} />
          {Array.from({ length: 7 }, (_, j) => <mesh key={j} position={[0, 0.002, -0.042 + j * 0.014]} scale={[0.0016, 0.0012, 0.0022]}><sphereGeometry args={[1, 5, 4]} /><meshStandardMaterial color="#e6c860" /></mesh>)}
        </group>)}
      </group>
      <group position={[BERRY[0] + 0.2, TOP + 0.006, BERRY[2] + 0.24]} visible={s.plate > 0.02}>
        <Cyl p={[0, 0, 0]} r={0.05} r2={0.04} h={0.01} c="#f4f1ea" rough={0.3} />
        {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.04, 0.007 + rnd(i, 3) * 0.003, (rnd(i, 2) - 0.5) * 0.04]} scale={[0.0024, 0.0016, 0.0017]}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#d6ac56" emissive="#ffe080" emissiveIntensity={0.3 * s.seedHi} /></mesh>)}
      </group>

      {/* ===== LA LICUADORA Y EL VASO DONDE LAS BUENAS SE VAN AL FONDO ===== */}
      <group position={BLEND} visible={s.blend > 0.02}>
        <Box p={[0, 0.05, 0]} s={[0.15, 0.1, 0.15]} c="#e9e6e0" r={0.4} rad={0.02} />
        <Cyl p={[0, 0.06, 0.077]} r={0.012} h={0.006} rot={[Math.PI / 2, 0, 0]} c="#c0392b" />
        <Cyl p={[0, 0.2, 0]} r={0.07} r2={0.055} h={0.2} c="#e8f2f4" rough={0.05} op={0.3} />
        <group rotation={[0, t * 3 * s.spin, 0]}>
          <Cyl p={[0, 0.15, 0]} r={0.064} r2={0.056} h={0.1} c="#e2584e" rough={0.3} op={0.85} />
        </group>
        <Cyl p={[0, 0.31, 0]} r={0.072} h={0.02} c="#2b2b2b" rough={0.5} />
      </group>
      <group position={GLASS} visible={s.glass > 0.02}>
        <Cyl p={[0, 0.065, 0]} r={0.045} r2={0.04} h={0.13} c="#e8f4f6" rough={0.04} op={0.3} />
        <Cyl p={[0, 0.055, 0]} r={0.042} r2={0.038} h={0.105} c={mix("#f2b0a8", "#d8eef4", s.clean)} rough={0.1} op={0.45} />
        {/* la pulpa que flota arriba */}
        {Array.from({ length: 12 }, (_, i) => <mesh key={"p" + i} visible={s.clean < 0.6} position={[(rnd(i, 1) - 0.5) * 0.06, 0.103 + rnd(i, 2) * 0.004, (rnd(i, 3) - 0.5) * 0.06]} scale={[0.008, 0.004, 0.006]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#c9343a" roughness={0.6} /></mesh>)}
        {/* las semillas: las llenas bajan al fondo, las vacías se quedan flotando */}
        {Array.from({ length: 40 }, (_, i) => { const good = i % 4 !== 0; const y = good ? lerp(0.1, 0.008 + rnd(i, 4) * 0.004, ease(s.settle)) : 0.104; return (
          <mesh key={"s" + i} visible={good || s.clean < 0.6} position={[(rnd(i, 5) - 0.5) * 0.06, y, (rnd(i, 6) - 0.5) * 0.06]} scale={[0.0026, 0.0017, 0.0018]}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color={good ? "#d6ac56" : "#b8a882"} emissive="#ffe080" emissiveIntensity={good ? 0.35 * s.seedHi : 0} /></mesh>); })}
      </group>
      {/* el colador de té */}
      <group position={[GLASS[0] + 0.12, TOP + 0.02, GLASS[2] + 0.06]} visible={s.sieve > 0.02}>
        <mesh rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.035, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#b8bcc0" metalness={0.8} roughness={0.35} wireframe /></mesh>
        <Seg a={[0.035, 0, 0]} b={[0.14, 0.01, 0]} r={0.003} c="#8a8e92" />
      </group>

      {/* ===== EL SOBRECITO DE PAPEL Y EL FRASQUITO (van a la heladera) ===== */}
      <group position={ENV} visible={s.env > 0.02 && s.fridge < 0.5}>
        <Box p={[0, 0.004, 0]} s={[0.1, 0.006, 0.07]} c="#e9dcc0" r={0.95} rad={0.002} rot={[0, 0.25, 0]} />
        <Box p={[0.004, 0.008, -0.02]} s={[0.1, 0.002, 0.035]} c="#ddcfb0" r={0.95} rad={0.001} rot={[0.2, 0.25, 0]} />
        <Cyl p={[0.11, 0.035, 0.02]} r={0.022} h={0.07} c="#e8f4f6" rough={0.04} op={0.35} />
        <Cyl p={[0.11, 0.075, 0.02]} r={0.024} h={0.012} c="#c9a640" rough={0.35} m={0.6} />
        {Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[0.11 + (rnd(i, 1) - 0.5) * 0.025, 0.006 + rnd(i, 2) * 0.006, 0.02 + (rnd(i, 3) - 0.5) * 0.025]} scale={[0.0022, 0.0015, 0.0016]}><sphereGeometry args={[1, 5, 4]} /><meshStandardMaterial color="#d6ac56" /></mesh>)}
      </group>

      {/* ===== LA HELADERA: la puerta se abre, el cajón de las verduras con el frasco ===== */}
      <group position={FRIDGE}>
        <Box p={[0, 0.9, 0]} s={[0.8, 1.8, 0.7]} c="#f2f2f0" r={0.3} m={0.05} rad={0.03} />
        <Box p={[0, 0.9, 0.351]} s={[0.72, 1.7, 0.004]} c="#dfe7ea" r={0.5} rad={0.002} />
        {[0.45, 0.85, 1.25].map((y, i) => <Box key={i} p={[0, y, 0.2]} s={[0.7, 0.012, 0.3]} c="#e8f2f6" r={0.1} op={0.6} rad={0.002} />)}
        <Box p={[0, 0.2, 0.22]} s={[0.66, 0.2, 0.26]} c="#e4eef2" r={0.1} op={0.5} rad={0.01} />
        <group position={[0.1, 0.16, 0.22]} visible={s.jarIn > 0.02}>
          <Cyl p={[0, 0.035, 0]} r={0.022} h={0.07} c="#e8f4f6" rough={0.04} op={0.4} />
          <Cyl p={[0, 0.075, 0]} r={0.024} h={0.012} c="#c9a640" rough={0.35} m={0.6} />
          <Box p={[-0.1, 0.006, 0]} s={[0.1, 0.008, 0.07]} c="#e9dcc0" r={0.95} rad={0.002} />
        </group>
        {/* la escarcha azulada del frío */}
        <mesh position={[0, 0.9, 0.36]} visible={s.frost > 0.02}><planeGeometry args={[0.7, 1.6]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.12 * s.frost} depthWrite={false} toneMapped={false} /></mesh>
        <group position={[0.4, 0, 0.36]} rotation={[0, doorA, 0]}>
          <Box p={[-0.4, 0.9, 0.03]} s={[0.8, 1.78, 0.06]} c="#f6f6f4" r={0.3} m={0.05} rad={0.02} />
          <Box p={[-0.74, 1.1, 0.07]} s={[0.025, 0.4, 0.03]} c="#b8bcc0" m={0.8} r={0.3} rad={0.008} />
          {/* los estantes de la puerta (adentro) */}
          {[0.4, 0.8, 1.2].map((y, i) => <Box key={i} p={[-0.4, y, -0.04]} s={[0.66, 0.06, 0.07]} c="#e6eef2" r={0.2} op={0.7} rad={0.004} />)}
        </group>
      </group>

      {/* ===== EL VASITO DE YOGUR DEL TRASPLANTE (en corte): la CORONA al ras ===== */}
      <group position={CUP} visible={s.cup > 0.02}>
        <Cyl p={[0, 0.05, 0]} r={0.045} r2={0.036} h={0.1} c="#f4f2ec" rough={0.4} open th0={Math.PI / 2} thL={Math.PI} />
        <mesh position={[0, 0.045, 0.001]}><planeGeometry args={[0.082, 0.09]} /><meshStandardMaterial map={tx.section} roughness={0.95} /></mesh>
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.044, 24, 0, Math.PI]} /><meshStandardMaterial color="#4a3424" roughness={0.95} /></mesh>
        {(() => {
          const dy = -0.028 * s.crownDeep + 0.022 * s.crownHigh, cy = 0.09 + dy;
          return <group>
            {/* raíces finitas en el corte */}
            {Array.from({ length: 9 }, (_, r) => { const a = -1 + (r / 8) * 2; return <Seg key={r} a={[0, cy - 0.004, 0.004]} b={[Math.sin(a) * 0.03, cy - 0.04 - 0.02 * rnd(r, 2), 0.004]} r={0.0012} r2={0.0006} c="#efe6cc" />; })}
            {/* la corona: el corazón gordito de la planta */}
            <mesh position={[0, cy + 0.003, 0.004]} scale={[0.009, 0.007, 0.009]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#9a5a3a" roughness={0.6} emissive="#ffb070" emissiveIntensity={0.4 * s.crownHi} /></mesh>
            <mesh position={[0, cy + 0.003, 0.0045]} visible={s.crownHi > 0.02} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.013, 0.016, 24]} /><meshBasicMaterial color="#ffd060" transparent opacity={s.crownHi} toneMapped={false} depthWrite={false} /></mesh>
            {[0, 2.1, 4.2].map((a, i) => <Trifol key={i} base={[0, cy + 0.008, 0.004]} ang={a} len={0.05} s={0.011} col="#4f8a3c" />)}
          </group>;
        })()}
        {/* la línea del ras (el nivel de la tierra) */}
        <mesh position={[0, 0.0905, 0.0015]} visible={s.crownHi > 0.02 || s.crownDeep > 0.02 || s.crownHigh > 0.02}><planeGeometry args={[0.09, 0.0015]} /><meshBasicMaterial color="#ffd060" toneMapped={false} /></mesh>
      </group>

      {/* ===== EL BANCO JUNTO A LA VENTANA: la planta madre y la maceta del estolón ===== */}
      <Box p={[-1.95, BENCH / 2, -0.85]} s={[1.2, BENCH, 0.5]} c="#8a6a45" map={tx.wood} r={0.8} rad={0.01} />
      <group position={PLANT}>
        <Cyl p={[0, 0.11, 0]} r={0.13} r2={0.1} h={0.22} c="#b5653d" rough={0.85} />
        <Cyl p={[0, 0.215, 0]} r={0.138} h={0.02} c="#a65a34" rough={0.85} />
        <mesh position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.125, 28]} /><meshStandardMaterial color={soilCol} roughness={0.95} /></mesh>
        {/* la cama de paja */}
        {Array.from({ length: 90 }, (_, i) => <mesh key={"m" + i} visible={i / 90 < Math.max(s.straw, s.winter)} position={[(rnd(i, 1) - 0.5) * 0.22, 0.22 + rnd(i, 3) * 0.008, (rnd(i, 2) - 0.5) * 0.22]} rotation={[rnd(i, 8) * 0.4, rnd(i, 4) * 6, rnd(i, 5) * 0.4]}><boxGeometry args={[0.05 + 0.02 * rnd(i, 6), 0.002, 0.004]} /><meshStandardMaterial color={["#d9b862", "#c9a050", "#e6cc80", "#b8904a"][i % 4]} roughness={1} /></mesh>)}
        {/* la corona y las hojas de tres (en invierno, más pocas y marrones) */}
        <mesh position={[0, 0.235, 0]} scale={[0.022, 0.016, 0.022]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#8a5a3a" roughness={0.7} emissive="#ffb070" emissiveIntensity={0.35 * s.crownHi} /></mesh>
        {Array.from({ length: 11 }, (_, i) => {
          const a = i * 2.39996, dead = s.winter > 0.5 && i % 2 === 0;
          if (dead && s.winterCut > 0.5) return null;
          return <Trifol key={i} base={[0, 0.24, 0]} ang={a} len={0.16 + 0.05 * rnd(i, 2)} s={0.034} col={dead ? "#8a6a3a" : mix("#3f7a2c", "#5f9a3c", rnd(i, 3))} up={0.75} e={0.15 * s.leafHi} />;
        })}
        {/* las flores blancas (las primeras se cortan con los dedos) */}
        {[0, 1, 2, 3].map((i) => { const a = 0.6 + i * 1.6, cut = s.snipFlower > 0.5 && i < 3; if (cut || s.flower < 0.02) return null;
          return <React.Fragment key={"fl" + i}><Seg a={[0, 0.24, 0]} b={[Math.sin(a) * 0.09, 0.36, Math.cos(a) * 0.09]} r={0.0018} c="#6f9a4a" /><Flower p={[Math.sin(a) * 0.09, 0.365, Math.cos(a) * 0.09]} s={s.flower} hi={s.flowerHi} /></React.Fragment>; })}
        {/* las fresas colgando por el borde de la maceta (verdes → rojas) */}
        {[0, 1, 2, 3, 4].map((i) => { const a = -0.5 + i * 0.32; if (s.fruit < 0.02) return null;
          const end: V = [Math.sin(a) * 0.17, 0.12 + 0.03 * rnd(i, 2), Math.cos(a) * 0.17];
          return <React.Fragment key={"fr" + i}>
            <Seg a={[0, 0.24, 0]} b={[Math.sin(a) * 0.14, 0.24, Math.cos(a) * 0.14]} r={0.0018} c="#6f9a4a" />
            <Seg a={[Math.sin(a) * 0.14, 0.24, Math.cos(a) * 0.14]} b={[end[0], end[1] + 0.045, end[2]]} r={0.0018} c="#6f9a4a" />
            <Berry p={end} s={0.75 * s.fruit} ripe={i < 3 ? s.ripe : s.ripe * 0.4} rot={[Math.PI, 0, 0.2 * (i - 2)]} glow={s.fruitHi} />
          </React.Fragment>; })}
        {/* los caracoles y el anillo de cáscara de huevo molida */}
        {[0, 1].map((i) => <group key={"c" + i} visible={s.snail > 0.02} position={[(i ? 0.19 : -0.17), 0.002, 0.08 + 0.05 * i]} rotation={[0, i ? 2.4 : 0.6, 0]} scale={s.snail}>
          <mesh position={[0, 0.006, 0]} scale={[0.03, 0.006, 0.01]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#8a8274" roughness={0.3} /></mesh>
          <mesh position={[-0.005, 0.018, 0]}><torusGeometry args={[0.011, 0.006, 8, 16]} /><meshStandardMaterial color="#8a5a32" roughness={0.45} /></mesh>
        </group>)}
        {Array.from({ length: 120 }, (_, i) => { const a = (i / 120) * Math.PI * 2, r = 0.2 + 0.03 * rnd(i, 1); return <mesh key={"e" + i} visible={s.shell > 0.02 && i / 120 < s.shell} position={[Math.cos(a) * r, -BENCH + BENCH + 0.002, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, rnd(i, 2) * 3]}><planeGeometry args={[0.012, 0.008]} /><meshStandardMaterial color="#f4ece0" roughness={0.9} /></mesh>; })}
        {/* la red fina tendida sobre palitos */}
        <group visible={s.net > 0.02}>
          {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([x, z], i) => <Seg key={i} a={[x, 0.0, z]} b={[x, 0.5, z]} r={0.004} c="#a08060" />)}
          <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.4, 16, 16]} /><meshBasicMaterial color="#e8e4dc" wireframe transparent opacity={0.6 * s.net} /></mesh>
        </group>
        {/* el disco viejo que brilla colgado de un palito */}
        <group visible={s.disc > 0.02}>
          <Seg a={[0.24, 0.0, -0.05]} b={[0.24, 0.62, -0.05]} r={0.004} c="#a08060" />
          <Seg a={[0.24, 0.62, -0.05]} b={[0.24, 0.5, -0.05]} r={0.0008} c="#555" />
          <mesh position={[0.24, 0.45, -0.05]} rotation={[0, Math.sin(t * 0.9) * 0.9, 0]}><circleGeometry args={[0.05, 32]} /><meshStandardMaterial color="#e8eef4" metalness={0.95} roughness={0.12} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      {/* el ESTOLÓN: de la corona hacia la maceta chica, la plantita hija prendida con un clip */}
      <group position={RUNPOT}>
        <Cyl p={[0, 0.06, 0]} r={0.07} r2={0.055} h={0.12} c="#b5653d" rough={0.85} />
        <mesh position={[0, 0.118, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.065, 24]} /><meshStandardMaterial color="#4a3424" roughness={0.95} /></mesh>
      </group>
      {(() => {
        if (s.runner < 0.02) return null;
        const a: V = [PLANT[0] + 0.03, PLANT[1] + 0.24, PLANT[2] + 0.02], b: V = [RUNPOT[0], RUNPOT[1] + 0.125, RUNPOT[2]];
        const mid: V = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 0.08, (a[2] + b[2]) / 2];
        const k = ease(s.runner), endp: V = [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
        const cutK = s.cutRunner > 0.5;
        return <group>
          <Seg a={a} b={k < 0.5 ? [lerp(a[0], mid[0], k * 2), lerp(a[1], mid[1], k * 2), lerp(a[2], mid[2], k * 2)] : mid} r={0.0022} c="#b04a3a" e="#ff9070" ei={0.3 * s.runnerHi} />
          {k >= 0.5 && !cutK && <Seg a={mid} b={endp} r={0.0022} c="#b04a3a" e="#ff9070" ei={0.3 * s.runnerHi} />}
          {k >= 0.5 && cutK && <Seg a={[lerp(mid[0], b[0], 0.75), lerp(mid[1], b[1], 0.75), lerp(mid[2], b[2], 0.75)]} b={b} r={0.0022} c="#b04a3a" />}
          {/* la plantita hija con sus raicitas esperando tocar la tierra */}
          <group position={endp}>
            {[0, 2.1, 4.2].map((ang, i) => <Trifol key={i} base={[0, 0.004, 0]} ang={ang} len={0.06 * k} s={0.012 * k} col="#5f9a3c" e={0.2 * s.runnerHi} />)}
            {Array.from({ length: 5 }, (_, r) => <Seg key={r} a={[0, 0, 0]} b={[(r - 2) * 0.006, -0.008 - 0.012 * s.pin, 0.004 * (r - 2)]} r={0.001} c="#efe6cc" />)}
          </group>
          {/* el clip abierto que la sujeta contra la tierra */}
          <group position={[b[0] + 0.012, b[1] + 0.006, b[2]]} visible={s.pin > 0.02}>
            <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.012, 0.0015, 6, 16, Math.PI]} /><meshStandardMaterial color="#b8bcc0" metalness={0.9} roughness={0.25} /></mesh>
          </group>
          {/* la tijera que corta el estolón cuando ya agarró */}
          <group position={[lerp(mid[0], b[0], 0.6), lerp(mid[1], b[1], 0.6) + 0.03, lerp(mid[2], b[2], 0.6)]} visible={s.snip > 0.02} rotation={[0, 0.6, 0.2]}>
            <Box p={[0, 0, 0]} s={[0.1, 0.008, 0.014]} c="#c7c9cc" m={0.85} r={0.25} rad={0.002} rot={[0, 0, 0.12 * s.snip]} />
            <Box p={[0, 0, 0.003]} s={[0.1, 0.008, 0.014]} c="#c7c9cc" m={0.85} r={0.25} rad={0.002} rot={[0, 0, -0.12 * s.snip]} />
            <mesh position={[-0.065, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.016, 0.005, 8, 16]} /><meshStandardMaterial color="#c0392b" /></mesh>
          </group>
        </group>;
      })()}
      {/* el frasco del agua de cáscaras de plátano y el balde del té de compost */}
      <group position={[-2.45, BENCH, -0.72]} visible={s.banana > 0.02}>
        <Cyl p={[0, 0.08, 0]} r={0.05} h={0.16} c="#e8f4f6" rough={0.04} op={0.35} />
        <Cyl p={[0, 0.065, 0]} r={0.047} h={0.13} c="#c9a85a" rough={0.2} op={0.55} />
        {[0, 1, 2].map((i) => <Box key={i} p={[(i - 1) * 0.018, 0.07 + i * 0.02, 0]} s={[0.012, 0.09, 0.025]} rot={[0, i, 0.3 * (i - 1)]} c={mix("#e6c43a", "#5a3a1a", 0.5)} r={0.7} rad={0.004} />)}
      </group>
      <group position={[-2.75, 0, -0.35]} visible={s.tea > 0.02}>
        <Cyl p={[0, 0.15, 0]} r={0.14} r2={0.12} h={0.3} c="#5a7a8a" rough={0.5} open />
        <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.135, 24]} /><meshStandardMaterial color="#5a3a1e" roughness={0.2} /></mesh>
      </group>

      {/* el LIBRO 3 de la colección cae sobre la mesa y se abre */}
      {s.book > 0.01 && pg.m1_p001 && <Book p={[BOOK[0], BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.06} open={s.open} cover={pg.m1_p001} inside={pg.m1_p028_r} right={pg.m1_p028} spine="#c0392b">
        {s.open > 0.9 && <>
          <PageHi k={s.hi[0]} u0={0.07} u1={0.93} v={0.2} h={0.08} />
          <PageHi k={s.hi[1]} u0={0.07} u1={0.93} v={0.5} h={0.09} col="#7dff9e" />
        </>}
      </Book>}
    </ThreeCanvas>
  );
};
