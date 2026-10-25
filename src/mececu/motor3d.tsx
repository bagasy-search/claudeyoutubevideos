// mececu · EL MUNDO: la trompa de un sedán cortada como maqueta, con el capó levantado, en la entrada de una casa a la mañana.
// Adentro: el motor, LA BATERÍA con su borne negativo (la grampa sube y baja), la llave de 10 mm, y LA COMPUTADORA (ECU)
// con la tapa cortada: un cerebro de 36 luces que se desordena (naranja), se apaga y vuelve a aprender en orden (celeste).
// UNA escena y UNA cámara; eventos clavados a la voz con at(). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import PLAN from "./plan.json";
import { manoCam } from "../kits/camara/CamaraMano";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- tiempos: TODO sale de plan.json (plan.py resuelve cada frase de la voz) ----------------
type WP = { keys: { t: number; p: V3; l: V3; fov?: number; arc?: number }[]; clamp: [number, number][]; wrench: [number, number][]; brain: [number, string][]; warn: [number, number][] };
const WD = (PLAN as unknown as { world: WP }).world;

// ---------------- geometría (trompa hacia -z, el auto termina en el corte de z = -0.45) ----------------
const BATT = { p: [-0.48, 0.86, -1.72] as V3, s: [0.32, 0.24, 0.2] as V3 };
const NEG: V3 = [BATT.p[0] + 0.1, BATT.p[1] + BATT.s[1] / 2 + 0.025, BATT.p[2] + 0.04];
const POS: V3 = [BATT.p[0] - 0.1, BATT.p[1] + BATT.s[1] / 2 + 0.025, BATT.p[2] + 0.04];
const ECU = { p: [0.52, 0.9, -1.78] as V3, s: [0.36, 0.06, 0.27] as V3 };
export const PT = {
  neg: NEG, pos: POS, batt: [BATT.p[0], BATT.p[1] + 0.14, BATT.p[2]] as V3, ecu: [ECU.p[0], ECU.p[1] + 0.06, ECU.p[2]] as V3,
  engine: [0.05, 1.0, -1.3] as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = WD.keys;
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const v = (q: V3) => new THREE.Vector3(q[0], q[1], q[2]);
  const p = v(a.p).lerp(v(b.p), k), l = v(a.l).lerp(v(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // cámara a mano: balanceo lento (pan/tilt de décimas de grado) sobre la mirada
  const m = manoCam(t, 0.8, 3), d = p.distanceTo(l), dir = l.clone().sub(p).normalize();
  const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(right, dir);
  l.add(right.multiplyScalar(Math.tan((m.pan * Math.PI) / 180) * d)).add(up.multiplyScalar(Math.tan((m.tilt * Math.PI) / 180) * d));
  return { p, l, fov: lerp(a.fov ?? 50, b.fov ?? 50, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), new THREE.Vector3(q[0], q[1], q[2]));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- estados (todo clavado a la voz) ----------------
const inAny = (t: number, L: [number, number][], up = 0.6, dn = 0.45) => Math.max(0, ...L.map(([a, b]) => win(t, a, a + up) * (1 - win(t, b - dn, b))));
// grampa del borne negativo: 0 = puesta, 1 = levantada y corrida
export const clampAt = (t: number) => inAny(t, WD.clamp);
// la llave de 10: visible y girando sobre la tuerca del borne
const wrenchAt = (t: number) => {
  const v = inAny(t, WD.wrench, 0.35, 0.35);
  const cur = WD.wrench.find(([a, b]) => t >= a - 0.4 && t <= b + 0.4);
  return { v, turn: cur ? win(t, cur[0] + 0.2, cur[0] + 1.0) : 0 };
};
// el cerebro: modo y cuántas luces aprendieron ("lost" = las 3 que parpadean en rojo)
type Brain = { mode: "ok" | "caos" | "off" | "learn"; k: number; lost: number };
export const brainAt = (t: number): Brain => {
  let i = -1;
  for (let j = 0; j < WD.brain.length; j++) if (WD.brain[j][0] <= t) i = j;
  if (i < 0) return { mode: "caos", k: 0, lost: 0 };
  const [t0, m] = WD.brain[i], t1 = WD.brain[i + 1]?.[0] ?? t0 + 3;
  if (m === "learn") return { mode: "learn", k: win(t, t0, Math.max(t0 + 0.8, t1 - 0.2)), lost: 0 };
  if (m === "lost") return { mode: "ok", k: 1, lost: win(t, t0 - 0.2, t0 + 0.3) };
  return { mode: m as Brain["mode"], k: 1, lost: 0 };
};

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => {
  const concrete = mk(512, 512, (g) => {
    g.fillStyle = "#8d8a84"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { const v = 110 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v - 3},${v - 8},.45)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(40,36,30,${0.05 + rnd(i, 4) * 0.08})`; g.beginPath(); g.ellipse(rnd(i, 5) * 512, rnd(i, 6) * 512, 20 + rnd(i, 7) * 60, 10 + rnd(i, 8) * 30, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
    g.strokeStyle = "rgba(50,46,40,.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 256); g.lineTo(512, 256); g.stroke();
  }, [8, 8]);
  const siding = mk(256, 256, (g) => {
    for (let y = 0; y < 256; y += 32) { g.fillStyle = y % 64 ? "#d9d4c8" : "#d2ccbf"; g.fillRect(0, y, 256, 32); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, y + 29, 256, 3); }
  }, [6, 3]);
  const plastic = mk(128, 128, (g) => {
    g.fillStyle = "#1b1c1e"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 700; i++) { const v = 22 + rnd(i, 3) * 16; g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(rnd(i, 1) * 128, rnd(i, 2) * 128, 2, 2); }
  }, [3, 2]);
  const alu = mk(256, 64, (g) => {
    g.fillStyle = "#a9adb2"; g.fillRect(0, 0, 256, 64);
    for (let y = 0; y < 64; y++) { g.fillStyle = `rgba(255,255,255,${rnd(y, 3) * 0.12})`; g.fillRect(0, y, 256, 1); }
  });
  const label = mk(256, 128, (g) => { // etiqueta de la batería
    g.fillStyle = "#16181b"; g.fillRect(0, 0, 256, 128);
    g.fillStyle = "#e8b923"; g.fillRect(0, 18, 256, 26);
    g.fillStyle = "#16181b"; g.font = "bold 20px Arial"; g.fillText("12V  60Ah", 70, 38);
    g.fillStyle = "#c9ccd0"; g.font = "bold 46px Arial"; g.fillText("—    +", 50, 100);
  });
  const board = mk(256, 192, (g) => { // placa verde de la computadora
    g.fillStyle = "#0e3b2a"; g.fillRect(0, 0, 256, 192);
    g.strokeStyle = "rgba(190,160,80,.55)"; g.lineWidth = 1.5;
    for (let i = 0; i < 40; i++) { g.beginPath(); let x = rnd(i, 1) * 256, y = rnd(i, 2) * 192; g.moveTo(x, y); for (let k = 0; k < 3; k++) { if (k % 2) y = rnd(i * 5 + k, 3) * 192; else x = rnd(i * 5 + k, 4) * 256; g.lineTo(x, y); } g.stroke(); }
    for (let i = 0; i < 22; i++) { g.fillStyle = "#111"; g.fillRect(rnd(i, 5) * 230, rnd(i, 6) * 170, 14 + rnd(i, 7) * 18, 8 + rnd(i, 8) * 10); }
  });
  return { concrete, siding, plastic, alu, label, board };
}, []);

// ---------------- piezas ----------------
type BP = { p: V3; s: V3; c?: string; r?: number; m?: number; map?: THREE.Texture; rad?: number; e?: string; ei?: number; rot?: V3; cast?: boolean; o?: number };
const Box: React.FC<BP> = ({ p, s, c = "#888", r = 0.6, m = 0, map, rad = 0.01, e, ei = 0, rot, cast = true, o }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow>
    <meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o !== undefined} opacity={o ?? 1} />
  </mesh>
);
const Tube: React.FC<{ pts: V3[]; r: number; c: string; rough?: number }> = ({ pts, r, c, rough = 0.55 }) => {
  const g = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 40, r, 10, false), [JSON.stringify(pts), r]);
  return <mesh geometry={g} castShadow><meshStandardMaterial color={c} roughness={rough} /></mesh>;
};
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rot?: V3; m?: number; rough?: number; e?: string; ei?: number }> = ({ p, r, h, c, rot, m = 0.2, rough = 0.5, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r, h, 28]} /><meshStandardMaterial color={c} metalness={m} roughness={rough} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const PAINT = { c: "#7d1f1c", m: 0.55, r: 0.35 }; // sedán bordó

// la llave de 10 mm combinada (boca + estrella), girando en la tuerca del borne
const Wrench: React.FC<{ v: number; turn: number; lift: number }> = ({ v, turn, lift }) => v <= 0.01 ? null : (
  <group position={[NEG[0], NEG[1] + 0.05 + lift * 0.09 + (1 - v) * 0.25, NEG[2] + 0.02]} rotation={[0, 0.6 + turn * 1.2, 0]} scale={v * 1.4}>
    <group position={[0.11, 0, 0]}>
      <Box p={[0, 0, 0]} s={[0.2, 0.008, 0.022]} c="#c9cdd2" m={0.95} r={0.22} rad={0.004} />
      <mesh position={[-0.105, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.007, 10, 24]} /><meshStandardMaterial color="#d3d7dc" metalness={0.95} roughness={0.2} /></mesh>
      <mesh position={[0.11, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.019, 0.008, 10, 24, 4.6]} /><meshStandardMaterial color="#d3d7dc" metalness={0.95} roughness={0.2} /></mesh>
    </group>
  </group>
);

// el cerebro de la computadora: 6×6 luces sobre la placa, con las pistas que se prenden cuando aprenden
const BrainLights: React.FC<{ t: number; b: Brain }> = ({ t, b }) => {
  const N = 6, sx = 0.05, sz = 0.038;
  const order = useMemo(() => Array.from({ length: N * N }, (_, i) => i).sort((a, c) => (a % N + Math.floor(a / N) * 0.9) - (c % N + Math.floor(c / N) * 0.9)), []);
  const rank = useMemo(() => { const r: number[] = []; order.forEach((i, k) => (r[i] = k)); return r; }, [order]);
  const LOST = [8, 21, 27];
  const lights = Array.from({ length: N * N }, (_, i) => {
    const x = (i % N - (N - 1) / 2) * sx, z = (Math.floor(i / N) - (N - 1) / 2) * sz;
    let col = "#3fd8ff", ei = 3.2;
    if (b.mode === "caos") { const on = rnd(i, Math.floor(t * 11)) > 0.45; col = rnd(i, Math.floor(t * 5) + 7) > 0.3 ? "#ff8a1f" : "#ff3b2f"; ei = on ? 4.5 : 0.15; }
    else if (b.mode === "off") { col = "#334"; ei = 0.02; }
    else if (b.mode === "learn") { const lit = rank[i] < b.k * N * N; ei = lit ? 3.6 + (rank[i] > b.k * N * N - 3 ? 3 : 0) : 0.05; }
    if (b.lost > 0 && LOST.includes(i)) { col = "#ff3030"; ei = (Math.sin(t * 16) > 0 ? 5 : 0.4) * b.lost; }
    return { x, z, col, ei };
  });
  return (
    <group position={[ECU.p[0], ECU.p[1] + 0.02, ECU.p[2]]}>
      {lights.map((L, i) => (
        <mesh key={i} position={[L.x, 0.012, L.z]}><sphereGeometry args={[0.0085, 14, 10]} /><meshStandardMaterial color={L.ei > 0.5 ? L.col : "#1a1f24"} emissive={L.col} emissiveIntensity={L.ei} toneMapped={false} /></mesh>
      ))}
      {lights.map((L, i) => i % N < N - 1 && (
        <mesh key={"tr" + i} position={[L.x + sx / 2, 0.008, L.z]}><boxGeometry args={[sx - 0.018, 0.002, 0.003]} /><meshStandardMaterial color="#222" emissive={L.col} emissiveIntensity={Math.min(L.ei, lights[i + 1].ei) > 1 ? 1.6 : 0} toneMapped={false} /></mesh>
      ))}
      <pointLight position={[0, 0.08, 0]} intensity={b.mode === "off" ? 0 : b.mode === "caos" ? 0.5 : 0.35 * Math.max(0.2, b.k)} distance={0.6} color={b.mode === "caos" ? "#ff8a2a" : "#5fdcff"} />
    </group>
  );
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const c = clampAt(t), w = wrenchAt(t), b = brainAt(t);
  const warn = inAny(t, WD.warn, 0.5, 0.3) * (0.6 + 0.4 * Math.sin(t * 9));
  const shake = b.mode === "caos" && c < 0.01 ? Math.sin(t * 47) * 0.0025 : 0; // el motor tiembla en ralentí (con la computadora desordenada)
  const clampPos: V3 = [NEG[0] + c * 0.06, NEG[1] + 0.012 + c * 0.12, NEG[2] - c * 0.05];
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.6} threshold={0.82} exposure={1.0} env={0.42} />
      <color attach="background" args={["#c9d3dc"]} />
      <hemisphereLight args={[0xdfe8f2, 0x5a5048, 0.75]} />
      <directionalLight position={[-4, 7, -6]} intensity={2.1} color="#fff1dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} />
      <spotLight position={[0.2, 3.0, -2.6]} angle={0.5} penumbra={1} intensity={10} distance={6} color="#f4f6ff" target-position={[0, 0.85, -1.5]} castShadow />

      {/* ===== la entrada de la casa ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial map={tx.concrete} roughness={0.85} /></mesh>
      <Box p={[0, 2.0, 2.6]} s={[9, 4, 0.2]} c="#e2ddd1" r={0.9} map={tx.siding} />
      <Box p={[1.2, 1.15, 2.48]} s={[2.6, 2.3, 0.06]} c="#efede8" r={0.6} />
      {[0, 1, 2, 3].map((i) => <Box key={"gp" + i} p={[1.2, 0.3 + i * 0.57, 2.44]} s={[2.5, 0.02, 0.02]} c="#d4d1ca" r={0.7} />)}
      <Box p={[-2.6, 0.45, 1.6]} s={[1.6, 0.9, 0.6]} c="#3b5a3a" r={0.95} rad={0.25} />
      <Box p={[3.2, 0.03, -1.0]} s={[1.2, 0.06, 4]} c="#5d7d47" r={1} />

      {/* ===== la trompa cortada (maqueta) ===== */}
      <group position={[0, shake, 0]}>
        {/* guardabarros y paragolpes */}
        {[-1, 1].map((sx) => <Box key={"gb" + sx} p={[sx * 0.8, 0.62, -1.4]} s={[0.12, 0.42, 1.9]} c={PAINT.c} m={PAINT.m} r={PAINT.r} rad={0.05} />)}
        <Box p={[0, 0.5, -2.38]} s={[1.72, 0.32, 0.16]} c={PAINT.c} m={PAINT.m} r={PAINT.r} rad={0.07} />
        <Box p={[0, 0.66, -2.3]} s={[1.0, 0.08, 0.04]} c="#141414" r={0.6} />
        {[-0.6, 0.6].map((x) => <Box key={"fa" + x} p={[x, 0.74, -2.31]} s={[0.36, 0.1, 0.05]} c="#e9edf2" m={0.4} r={0.15} e="#fff" ei={0.15} />)}
        {/* canto del corte en gris claro */}
        {[-1, 1].map((sx) => <Box key={"ct" + sx} p={[sx * 0.8, 0.62, -0.44]} s={[0.13, 0.43, 0.012]} c="#e9e4da" r={0.9} rad={0.003} />)}
        <Box p={[0, 0.28, -1.4]} s={[1.5, 0.06, 1.9]} c="#2a2b2d" r={0.9} />
        {/* ruedas delanteras */}
        {[-0.82, 0.82].map((x) => <Cyl key={"rd" + x} p={[x, 0.3, -1.55]} r={0.3} h={0.2} c="#151515" rot={[0, 0, Math.PI / 2]} rough={0.85} />)}
        {/* capó levantado con su varilla */}
        <group position={[0, 0.86, -0.5]} rotation={[1.15, 0, 0]}>
          <Box p={[0, 0, -0.95]} s={[1.6, 0.035, 1.9]} c={PAINT.c} m={PAINT.m} r={PAINT.r} rad={0.02} />
          <Box p={[0, -0.025, -0.95]} s={[1.45, 0.02, 1.7]} c="#2c2d2f" r={0.9} rad={0.01} />
        </group>
        {/* torpedo + base del parabrisas (que se lea "auto") */}
        <Box p={[0, 0.88, -0.47]} s={[1.6, 0.08, 0.14]} c="#1d1e20" r={0.7} rad={0.02} />
        <group position={[0, 1.15, -0.3]} rotation={[-0.75, 0, 0]}><mesh><planeGeometry args={[1.45, 0.62]} /><meshPhysicalMaterial color="#5d7186" transparent opacity={0.35} roughness={0.05} metalness={0.3} /></mesh></group>
        {/* el motor */}
        <Box p={[0.05, 0.72, -1.3]} s={[0.72, 0.42, 0.56]} c="#5e6166" m={0.6} r={0.45} rad={0.04} />
        <Box p={[0.05, 0.98, -1.3]} s={[0.66, 0.1, 0.42]} c="#26272a" r={0.5} rad={0.04} map={tx.plastic} />
        <Box p={[0.05, 1.04, -1.3]} s={[0.4, 0.03, 0.14]} c="#8a1d1d" r={0.4} rad={0.012} />
        {[-0.18, -0.06, 0.06, 0.18].map((x) => <Cyl key={"bj" + x} p={[0.05 + x, 1.0, -1.08]} r={0.018} h={0.06} c="#111" rot={[Math.PI / 2, 0, 0]} />)}
        <Cyl p={[-0.36, 0.72, -1.2]} r={0.09} h={0.04} c="#3a3b3e" rot={[0, 0, Math.PI / 2]} m={0.7} />
        <Cyl p={[-0.36, 0.58, -1.45]} r={0.06} h={0.04} c="#3a3b3e" rot={[0, 0, Math.PI / 2]} m={0.7} />
        <Tube pts={[[0.25, 0.92, -1.58], [0.3, 0.96, -1.85], [0.12, 0.9, -2.05], [-0.05, 0.8, -2.1]]} r={0.035} c="#1c1c1e" />
        <Box p={[0.05, 0.62, -2.12]} s={[1.3, 0.36, 0.05]} c="#2b2d30" r={0.6} />
        {[...Array(10)].map((_, i) => <Box key={"rg" + i} p={[-0.55 + i * 0.12, 0.62, -2.15]} s={[0.012, 0.32, 0.02]} c="#55585c" m={0.5} r={0.4} />)}
        {/* depósitos */}
        <Box p={[0.55, 0.86, -1.1]} s={[0.16, 0.18, 0.14]} c="#e9e3d6" r={0.35} o={0.92} rad={0.03} />
        <Cyl p={[0.55, 0.98, -1.1]} r={0.03} h={0.03} c="#e2c300" />
        {/* LA BATERÍA */}
        <Box p={[BATT.p[0], BATT.p[1] - BATT.s[1] / 2 - 0.02, BATT.p[2]]} s={[0.36, 0.04, 0.24]} c="#222" r={0.8} />
        <Box p={BATT.p} s={BATT.s} c="#18191b" r={0.55} rad={0.012} />
        <mesh position={[BATT.p[0], BATT.p[1], BATT.p[2] - BATT.s[2] / 2 - 0.001]} rotation={[0, Math.PI, 0]}><planeGeometry args={[BATT.s[0] - 0.04, BATT.s[1] - 0.06]} /><meshStandardMaterial map={tx.label} roughness={0.6} /></mesh>
        <Box p={[BATT.p[0], BATT.p[1] + BATT.s[1] / 2 + 0.006, BATT.p[2]]} s={[BATT.s[0] - 0.02, 0.012, BATT.s[2] - 0.02]} c="#232427" r={0.5} rad={0.004} />
        {[NEG, POS].map((q, i) => <Cyl key={"bn" + i} p={[q[0], q[1] - 0.01, q[2]]} r={0.012} h={0.03} c="#b7a36a" m={0.8} rough={0.35} />)}
        {/* aro de advertencia en el borne negativo */}
        {warn > 0.01 && <mesh position={[NEG[0], NEG[1] + 0.005, NEG[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.04, 40]} /><meshStandardMaterial color="#ffd23f" emissive="#ffc400" emissiveIntensity={4 * warn} toneMapped={false} transparent opacity={warn} side={THREE.DoubleSide} /></mesh>}
        {/* positivo: tapa roja y cable rojo (queda puesto siempre) */}
        <Box p={[POS[0], POS[1] + 0.012, POS[2]]} s={[0.05, 0.035, 0.05]} c="#c3221b" r={0.45} rad={0.01} />
        <Tube pts={[[POS[0], POS[1] + 0.02, POS[2] - 0.02], [POS[0] - 0.05, POS[1] + 0.06, POS[2] - 0.12], [-0.3, 0.95, -1.98], [-0.2, 0.86, -1.55]]} r={0.011} c="#b5231c" />
        {/* negativo: la grampa negra que sube y se corre, con su cable a masa */}
        <Box p={clampPos} s={[0.05, 0.03, 0.05]} c="#141414" r={0.5} rad={0.008} />
        <Cyl p={[clampPos[0] + 0.03, clampPos[1] + 0.005, clampPos[2]]} r={0.007} h={0.03} c="#b8bcc0" m={0.9} rough={0.3} rot={[0, 0, Math.PI / 2]} />
        <Tube pts={[[clampPos[0], clampPos[1] + 0.01, clampPos[2] - 0.02], [clampPos[0] + 0.04, clampPos[1] + 0.05, clampPos[2] - 0.12], [-0.18, 0.95, -1.98], [-0.62, 0.82, -2.06]]} r={0.011} c="#151515" />
        <Wrench v={w.v} turn={w.turn} lift={c} />
        {/* LA COMPUTADORA (ECU) con la tapa cortada */}
        <Box p={[ECU.p[0], ECU.p[1] - 0.02, ECU.p[2]]} s={ECU.s} c="#a9adb2" m={0.85} r={0.32} map={tx.alu} rad={0.01} />
        <mesh position={[ECU.p[0], ECU.p[1] + 0.012, ECU.p[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ECU.s[0] - 0.03, ECU.s[2] - 0.03]} /><meshStandardMaterial map={tx.board} roughness={0.55} /></mesh>
        {[-1, 1].map((sx) => <Box key={"ep" + sx} p={[ECU.p[0] + sx * (ECU.s[0] / 2 - 0.005), ECU.p[1] + 0.02, ECU.p[2]]} s={[0.01, 0.03, ECU.s[2]]} c="#e9e4da" r={0.9} rad={0.002} />)}
        <Box p={[ECU.p[0], ECU.p[1] - 0.005, ECU.p[2] + ECU.s[2] / 2 + 0.03]} s={[0.16, 0.05, 0.05]} c="#202124" r={0.6} rad={0.01} />
        <Tube pts={[[ECU.p[0], ECU.p[1], ECU.p[2] + ECU.s[2] / 2 + 0.06], [0.45, 0.98, -1.45], [0.3, 1.05, -1.3], [0.05, 1.06, -1.2]]} r={0.022} c="#1b1b1d" />
        <BrainLights t={t} b={b} />
      </group>
    </ThreeCanvas>
  );
};
