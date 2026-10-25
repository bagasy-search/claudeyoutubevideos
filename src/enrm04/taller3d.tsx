// Ramón the Mechanic · EL MUNDO: Treviño Auto Repair, el taller de 3 bahías de S. Zarzamora en corte de casa de muñecas (frente abierto, sin techo
// adelante). Bahía 1: el elevador de 2 columnas con el sedán arriba (se ve la panza: cárter, caja, escape). Bahía 2: la SUV
// con el capot abierto; con rayos X la carrocería se vuelve vidrio y se ve el motor y la caja (la pieza que falla se enciende).
// Bahía 3: la F-150 blanca 2004 de Kowalski. Atrás: el banco de trabajo con la libreta verde, el tablero de herramientas,
// el carro rojo, los tubos fluorescentes y el portón levantado que da a Zarzamora St. UNA escena y UNA cámara (con balanceo
// de mano). Cámara y eventos vienen de cam.json / ev.json (plan_<slug>.py con at() sobre la voz). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";
import CAM from "./cam.json";
import EV from "./ev.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo (x = bahías: -4.2 / 0 / 4.2; z negativo = fondo) ----------------
export const PT = {
  lift: [-4.2, 2.1, 0] as V3,       // panza del sedán en el elevador
  pan: [-4.2, 1.72, 0.55] as V3,    // cárter
  trans: [-4.2, 1.72, -0.2] as V3,  // caja de cambios (vista de abajo)
  suv: [0, 1.0, 0] as V3,
  engine: [0, 1.15, 1.25] as V3,    // motor de la SUV (capot abierto)
  gearbox: [0, 0.75, 0.45] as V3,   // caja de la SUV (rayos X)
  floodline: [0, 0.55, -0.6] as V3, // la marca del agua en la SUV
  truck: [4.2, 1.0, 0] as V3,
  odo: [4.0, 1.25, 0.1] as V3,      // tablero de la F-150
  bench: [-1.9, 1.0, -3.2] as V3,
  notebook: [-1.75, 0.98, -3.15] as V3,
  board: [1.6, 1.9, -3.55] as V3,   // tablero de herramientas
  door: [0, 1.6, -3.7] as V3,       // portón al fondo
  sign: [0, 3.55, -3.6] as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = (CAM as { keys: Key[] }).keys;
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.01, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t), m = manoCam(t, 1, 7);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l);
  cm.rotateY((m.pan * Math.PI) / 180); cm.rotateX((m.tilt * Math.PI) / 180); cm.rotateZ((m.roll * Math.PI) / 180);
  cm.fov = k.fov; cm.near = 0.01; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- eventos ----------------
type Ev = Record<string, [number, number][]>;
const E = EV as unknown as Ev & { lift: [number, number][]; odo: [number, number][]; bad?: { a: number; b: number; part: string }[] };
const onR = (t: number, k: string, fi = 0.5, fo = 0.5) => { for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a - fi && t < b + fo) return win(t, a - fi, a) * (1 - win(t, b, b + fo)); return 0; };
const kf = (t: number, pts: [number, number][]) => {
  if (!pts || !pts.length) return 0; if (t <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], sm((t - pts[i][0]) / (pts[i + 1][0] - pts[i][0])));
  return pts[pts.length - 1][1];
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  // piso de taller: concreto gris con manchas de aceite y la junta de dilatación
  floor: mk(1024, 1024, (g) => {
    g.fillStyle = "#77736d"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 9000; i++) { const v = 95 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 3},${v - 8},.35)`; g.fillRect(rnd(i, 2) * 1024, rnd(i, 3) * 1024, 2, 2); }
    for (let i = 0; i < 26; i++) { const x = rnd(i, 4) * 1024, y = rnd(i, 5) * 1024, r = 20 + rnd(i, 6) * 70; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(25,20,15,.55)"); gr.addColorStop(1, "rgba(25,20,15,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rnd(i, 7) * 0.4), rnd(i, 8) * 3, 0, 6.3); g.fill(); }
    g.strokeStyle = "rgba(40,38,35,.6)"; g.lineWidth = 3; for (const p of [341, 682]) { g.beginPath(); g.moveTo(p, 0); g.lineTo(p, 1024); g.stroke(); }
    g.strokeStyle = "rgba(230,190,40,.75)"; g.lineWidth = 10; for (const p of [170, 512, 853]) { g.setLineDash([40, 30]); g.beginPath(); g.moveTo(p, 0); g.lineTo(p, 1024); g.stroke(); }
  }),
  // pared de bloques pintada
  wall: mk(512, 512, (g) => {
    g.fillStyle = "#c9c3b5"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 8; r++) for (let c2 = -1; c2 < 4; c2++) { const x = c2 * 160 + (r % 2) * 80, y = r * 64, v = 196 + rnd(r * 7 + c2, 2) * 18; g.fillStyle = `rgb(${v},${v - 5},${v - 16})`; g.fillRect(x + 3, y + 3, 154, 58); }
    const gr = g.createLinearGradient(0, 380, 0, 512); gr.addColorStop(0, "rgba(60,50,40,0)"); gr.addColorStop(1, "rgba(60,50,40,.35)"); g.fillStyle = gr; g.fillRect(0, 380, 512, 132);
  }, [5, 2]),
  peg: mk(512, 256, (g) => { g.fillStyle = "#b08a5c"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#4a3824"; for (let y = 8; y < 256; y += 16) for (let x = 8; x < 512; x += 16) { g.beginPath(); g.arc(x, y, 2.2, 0, 6.3); g.fill(); } }),
  sign: mk(1024, 192, (g) => {
    g.fillStyle = "#0f2a4a"; g.fillRect(0, 0, 1024, 192); g.strokeStyle = "#f2e6c8"; g.lineWidth = 8; g.strokeRect(10, 10, 1004, 172);
    g.fillStyle = "#f2e6c8"; g.font = "900 92px sans-serif"; g.textAlign = "center"; g.fillText("TREVIÑO AUTO REPAIR", 512, 112);
    g.font = "700 38px sans-serif"; g.fillStyle = "#ffb257"; g.fillText("S. ZARZAMORA ST · SAN ANTONIO · SINCE 1988", 512, 164);
  }),
  street: mk(512, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#f2c58a"); gr.addColorStop(0.55, "#e8a668"); gr.addColorStop(0.56, "#59534d"); gr.addColorStop(1, "#3d3935"); g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(70,55,45,${0.6 + rnd(i) * 0.3})`; const x = i * 60 + rnd(i, 2) * 20, h = 30 + rnd(i, 3) * 40; g.fillRect(x, 140 - h, 50, h); }
    g.fillStyle = "#2f4a24"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(40 + i * 110, 112, 22 + rnd(i, 5) * 10, 0, 6.3); g.fill(); }
  }),
  notebook: mk(512, 360, (g) => {
    g.fillStyle = "#f4efdf"; g.fillRect(0, 0, 512, 360); g.strokeStyle = "rgba(80,120,190,.45)"; g.lineWidth = 2; for (let y = 40; y < 360; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
    g.strokeStyle = "rgba(200,60,60,.6)"; g.beginPath(); g.moveTo(52, 0); g.lineTo(52, 360); g.stroke(); g.beginPath(); g.moveTo(256, 0); g.lineTo(256, 360); g.stroke();
    g.fillStyle = "#1d2a5a"; g.font = "italic 600 17px serif";
    const L = ["3/14/04  bought  41,220", "6/02/04  oil+filt 44,180", "9/19/04  oil  47,050", "1/08/05  coolant  50,310", "4/22/05  oil  53,400", "8/30/05  trans fl 57,900", "12/1/05  belt  61,020", "3/15/06  oil  64,200", "7/04/06  tires  68,880", "10/9/06  oil  71,300", "2/11/07  plugs  75,010", "5/30/07  oil  78,450", "9/02/07  hoses  82,100"];
    L.forEach((s, i) => g.fillText(s, i < 7 ? 58 : 262, 34 + (i % 7) * 24 * 2 + 24));
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rot?: V3; m?: number; ro?: number; e?: string; ei?: number; op?: number; seg?: number }> = ({ p, r, h, c, rot, m = 0, ro = 0.6, e, ei = 0, op = 1, seg = 28 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r, h, seg]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const Wheel: React.FC<{ p: V3; r?: number; w?: number }> = ({ p, r = 0.36, w = 0.26 }) => (
  <group position={p}>
    <Cyl p={[0, 0, 0]} r={r} h={w} c="#141414" rot={[0, 0, Math.PI / 2]} ro={0.9} />
    <Cyl p={[w / 2 + 0.002, 0, 0]} r={r * 0.6} h={0.02} c="#b9bcc0" rot={[0, 0, Math.PI / 2]} m={0.9} ro={0.3} />
    <Cyl p={[-w / 2 - 0.002, 0, 0]} r={r * 0.6} h={0.02} c="#b9bcc0" rot={[0, 0, Math.PI / 2]} m={0.9} ro={0.3} />
  </group>
);

// carrocería genérica: cuerpo bajo + cabina con vidrio. xr = rayos X (la chapa se vuelve vidrio)
const Body: React.FC<{ len: number; wid: number; h: number; cab: [number, number, number]; col: string; xr?: number; mud?: number; pickup?: boolean }> = ({ len, wid, h, cab, col, xr = 0, mud = 0, pickup }) => {
  const op = 1 - 0.82 * xr;
  return (
    <group>
      <Box p={[0, h / 2, 0]} s={[wid, h, len]} c={col} r={0.32} m={0.35} rad={0.12} op={op} />
      {pickup
        ? <><Box p={[0, h + cab[1] / 2, cab[2]]} s={[wid * 0.96, cab[1], cab[0]]} c={col} r={0.3} m={0.35} rad={0.1} op={op} />
            <Box p={[0, h + 0.18, -len * 0.27]} s={[wid * 0.98, 0.36, len * 0.44]} c={col} r={0.35} m={0.3} rad={0.04} op={op} />
            <Box p={[0, h + 0.05, -len * 0.27]} s={[wid * 0.88, 0.06, len * 0.42]} c="#2a2a2a" r={0.9} rad={0.01} op={op} /></>
        : <Box p={[0, h + cab[1] / 2, cab[2]]} s={[wid * 0.9, cab[1], cab[0]]} c={col} r={0.3} m={0.35} rad={0.14} op={op} />}
      {/* vidrios */}
      <Box p={[0, h + cab[1] * 0.55, cab[2] + cab[0] / 2 + 0.005]} s={[wid * 0.8, cab[1] * 0.7, 0.02]} c="#1b2633" r={0.05} m={0.6} rad={0.01} op={0.85 * op} />
      <Box p={[wid * 0.455, h + cab[1] * 0.55, cab[2]]} s={[0.02, cab[1] * 0.6, cab[0] * 0.8]} c="#1b2633" r={0.05} m={0.6} rad={0.01} op={0.85 * op} />
      <Box p={[-wid * 0.455, h + cab[1] * 0.55, cab[2]]} s={[0.02, cab[1] * 0.6, cab[0] * 0.8]} c="#1b2633" r={0.05} m={0.6} rad={0.01} op={0.85 * op} />
      {/* faros y luces */}
      <Box p={[wid * 0.33, h * 0.72, len / 2]} s={[0.3, 0.12, 0.03]} c="#fff8e8" e="#fff2cc" ei={0.5} rad={0.02} />
      <Box p={[-wid * 0.33, h * 0.72, len / 2]} s={[0.3, 0.12, 0.03]} c="#fff8e8" e="#fff2cc" ei={0.5} rad={0.02} />
      <Box p={[wid * 0.36, h * 0.75, -len / 2]} s={[0.24, 0.14, 0.03]} c="#7a0c0c" e="#ff2a1a" ei={0.35} rad={0.02} />
      <Box p={[-wid * 0.36, h * 0.75, -len / 2]} s={[0.24, 0.14, 0.03]} c="#7a0c0c" e="#ff2a1a" ei={0.35} rad={0.02} />
      <Box p={[0, h * 0.3, len / 2 + 0.03]} s={[wid * 0.95, 0.16, 0.06]} c="#222" r={0.7} rad={0.03} />
      {/* la marca del agua (auto inundado): franja de barro y la línea */}
      {mud > 0.01 && <>
        <Box p={[0, 0.33, 0]} s={[wid + 0.012, 0.42, len + 0.012]} c="#5b4a35" r={0.95} rad={0.1} op={0.55 * mud} />
        <Box p={[0, 0.55, 0]} s={[wid + 0.02, 0.025, len + 0.02]} c="#3a2e20" r={1} rad={0.01} op={0.9 * mud} />
      </>}
    </group>
  );
};

// el tren motriz visto por dentro: bloque, tapa de válvulas, la caja y el cárter. hot = la pieza que falla se enciende
const Drivetrain: React.FC<{ t: number; hot: string; heat: number; vis: number }> = ({ t, hot, heat, vis }) => {
  const glow = (k: string) => (hot === k ? heat * (0.75 + 0.25 * Math.sin(t * 6)) : 0);
  const o = vis;
  return (
    <group>
      <Box p={[0, 0.82, 1.2]} s={[0.62, 0.5, 0.62]} c="#5d6268" m={0.7} r={0.45} e="#ff5a1f" ei={2.2 * glow("engine")} op={o} />
      <Box p={[0, 1.12, 1.2]} s={[0.5, 0.1, 0.56]} c="#1d1f22" m={0.4} r={0.5} op={o} />
      <Box p={[0.36, 0.95, 1.2]} s={[0.1, 0.2, 0.5]} c="#8a8f95" m={0.8} r={0.35} op={o} />
      {/* caja: CVT / doble embrague / automática (la misma forma, se enciende) */}
      <Box p={[0, 0.7, 0.62]} s={[0.4, 0.4, 0.62]} c="#9aa0a6" m={0.85} r={0.3} e="#ff3d1f" ei={2.4 * glow("trans")} op={o} />
      <Cyl p={[0, 0.7, 0.62]} r={0.2} h={0.42} c="#a6abb1" rot={[0, 0, Math.PI / 2]} m={0.85} ro={0.3} e="#ff3d1f" ei={2.4 * glow("trans")} op={o} />
      <Cyl p={[0, 0.6, -0.4]} r={0.05} h={1.6} c="#3b3e42" rot={[Math.PI / 2, 0, 0]} m={0.7} ro={0.4} op={o} />
      {/* cárter y aceite */}
      <Box p={[0, 0.5, 1.2]} s={[0.5, 0.14, 0.5]} c="#3c3f43" m={0.6} r={0.5} e="#ffb000" ei={2.0 * glow("oil")} op={o} />
      {/* suspensión neumática (los fuelles) */}
      {[[-0.62, 1.2], [0.62, 1.2], [-0.62, -1.15], [0.62, -1.15]].map(([x, z], i) => (
        <Cyl key={i} p={[x, 0.5, z]} r={0.09} h={0.22} c="#202224" ro={0.9} e="#3fb6ff" ei={2.2 * glow("air")} op={o} />
      ))}
      {/* radiador y mangueras (refrigeración) */}
      <Box p={[0, 0.85, 1.7]} s={[0.9, 0.5, 0.06]} c="#6c7a84" m={0.6} r={0.4} e="#ff2a1a" ei={2.2 * glow("cool")} op={o} />
      <Cyl p={[0.3, 1.0, 1.48]} r={0.035} h={0.4} c="#111" rot={[Math.PI / 2, 0, 0]} e="#ff2a1a" ei={1.6 * glow("cool")} op={o} />
    </group>
  );
};

// ---------------- el mundo ----------------
export const World: React.FC<{ t: number }> = ({ t }) => {
  const bt = useTex();
  const tx = useTextures();
  const lift = kf(t, E.lift || []);            // 0 = abajo, 1 = arriba
  const xr = onR(t, "xray", 0.6, 0.6);
  const hood = onR(t, "hood", 0.8, 0.8);
  const mud = onR(t, "flood", 0.8, 0.8);
  const drip = onR(t, "drip", 0.3, 0.3);
  const smoke = onR(t, "smoke", 0.5, 1.0);
  const book = onR(t, "book", 0.6, 0.6);
  const lamp = onR(t, "night", 1.0, 1.0);      // de noche: portón oscuro, fluorescentes más fuertes
  const badNow = (E.bad || []).find((x) => t >= x.a - 0.6 && t < x.b + 0.6);
  const heat = badNow ? win(t, badNow.a - 0.6, badNow.a + 0.4) * (1 - win(t, badNow.b, badNow.b + 0.6)) : 0;
  const ly = 0.12 + lift * 1.55;               // altura del sedán
  const pages = Math.floor(kf(t, E.odo || []) * 100) / 100;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.3} threshold={0.92} exposure={0.9 - 0.15 * lamp} env={0.36} />
      <color attach="background" args={["#10151c"]} />
      <hemisphereLight args={[0xf3ead8, 0x2a2622, 0.45]} />
      <directionalLight position={[5, 10, 8]} intensity={1.3 * (1 - 0.6 * lamp)} color="#ffe9cc" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0003} />
      {[-4.2, 0, 4.2].map((x, i) => <pointLight key={i} position={[x, 3.6, 0]} intensity={2.6 + 1.4 * lamp} distance={8} color="#eef6ff" castShadow={i === 1} />)}
      <spotLight position={[0, 3.2, 3.2]} angle={0.7} penumbra={1} intensity={6 * Math.max(xr, hood * 0.5)} distance={7} color="#ffffff" target-position={PT.engine} />
      <spotLight position={[-4.2, 0.2, 2.2]} angle={0.6} penumbra={1} intensity={5 * lift} distance={5} color="#fff4e0" target-position={PT.lift} />

      {/* ===== losa del taller (maqueta cortada) ===== */}
      <Box p={[0, -0.35, -0.3]} s={[13.6, 0.7, 8.6]} c="#8d8a84" r={0.95} map={tx.concrete} rad={0.02} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -0.3]} receiveShadow><planeGeometry args={[13.4, 8.4]} /><meshStandardMaterial map={bt.floor} roughness={0.55} metalness={0.05} /></mesh>
      {/* paredes: fondo con el portón, laterales bajas */}
      <Box p={[-4.6, 1.9, -3.75]} s={[4.4, 3.8, 0.2]} c="#c9c3b5" r={0.9} map={bt.wall} rad={0.01} />
      <Box p={[4.6, 1.9, -3.75]} s={[4.4, 3.8, 0.2]} c="#c9c3b5" r={0.9} map={bt.wall} rad={0.01} />
      <Box p={[0, 3.35, -3.75]} s={[4.8, 0.9, 0.2]} c="#c9c3b5" r={0.9} map={bt.wall} rad={0.01} />
      <Box p={[-6.75, 1.9, -0.3]} s={[0.2, 3.8, 8.4]} c="#c9c3b5" r={0.9} map={bt.wall} rad={0.01} />
      <Box p={[6.75, 1.9, -0.3]} s={[0.2, 3.8, 8.4]} c="#c9c3b5" r={0.9} map={bt.wall} rad={0.01} />
      {/* portón levantado → Zarzamora St (de día cálida, de noche azul) */}
      <mesh position={[0, 1.45, -4.4]}><planeGeometry args={[6, 3.2]} /><meshBasicMaterial map={bt.street} color={lamp > 0.5 ? "#3a4f7a" : "#ffffff"} toneMapped={false} /></mesh>
      <Box p={[0, 2.95, -3.6]} s={[4.6, 0.35, 0.3]} c="#7c8288" m={0.6} r={0.45} rad={0.03} />
      {/* el cartel */}
      <mesh position={[0, 3.55, -3.63]}><planeGeometry args={[3.6, 0.675]} /><meshStandardMaterial map={bt.sign} roughness={0.5} emissive="#ffffff" emissiveMap={bt.sign} emissiveIntensity={0.18} /></mesh>
      {/* fluorescentes */}
      {[-4.2, 0, 4.2].map((x, i) => <Box key={i} p={[x, 3.75, 0]} s={[0.16, 0.06, 2.4]} c="#ffffff" e="#eaf4ff" ei={2.2} cast={false} rad={0.02} />)}

      {/* ===== fondo izquierdo: banco + libreta verde ===== */}
      <Box p={[-2.6, 0.92, -3.2]} s={[2.6, 0.08, 0.8]} c="#6b4a2c" r={0.8} map={tx.planks} rad={0.01} />
      {[[-3.8, -2.9], [-1.4, -2.9], [-3.8, -3.5], [-1.4, -3.5]].map(([x, z], i) => <Box key={i} p={[x, 0.45, z]} s={[0.07, 0.9, 0.07]} c="#3a3e44" m={0.6} r={0.5} rad={0.01} />)}
      <Box p={[-3.3, 1.06, -3.35]} s={[0.4, 0.22, 0.25]} c="#2b5fa8" m={0.4} r={0.5} rad={0.02} />
      <Cyl p={[-2.9, 1.06, -3.3]} r={0.07} h={0.22} c="#c7a23a" m={0.3} ro={0.5} />
      {/* la libreta: tapa verde que se abre y hojas */}
      <group position={PT.notebook}>
        <Box p={[0, 0.0, 0]} s={[0.34, 0.02, 0.24]} c="#f4efdf" r={0.9} rad={0.005} />
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.33, 0.23]} /><meshStandardMaterial map={bt.notebook} roughness={0.9} transparent opacity={book} /></mesh>
        <group position={[-0.17, 0.015, 0]} rotation={[0, 0, Math.PI * (1 - book) * 0.98]}>
          <Box p={[0.17, 0, 0]} s={[0.35, 0.012, 0.25]} c="#2f6b3a" r={0.7} rad={0.004} />
        </group>
      </group>
      {/* ===== fondo derecho: tablero de herramientas + carro rojo ===== */}
      <mesh position={[1.9, 1.85, -3.64]}><planeGeometry args={[2.2, 1.1]} /><meshStandardMaterial map={bt.peg} roughness={0.85} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <Box key={i} p={[1.0 + (i % 7) * 0.3, 2.15 - Math.floor(i / 7) * 0.5, -3.6]} s={[0.04, 0.26 + rnd(i) * 0.12, 0.02]} c="#c9ccd0" m={0.95} r={0.25} rad={0.005} />)}
      <Box p={[2.9, 0.55, -3.2]} s={[1.1, 1.1, 0.55]} c="#b3201c" m={0.45} r={0.35} rad={0.03} />
      {[0, 1, 2, 3].map((i) => <Box key={i} p={[2.9, 0.25 + i * 0.25, -2.92]} s={[1.0, 0.012, 0.01]} c="#d9dcdf" m={1} r={0.2} rad={0.002} />)}
      {/* bidones y llantas */}
      {[0, 1, 2].map((i) => <Cyl key={i} p={[6.1, 0.42, -2.9 + i * 0.7]} r={0.28} h={0.84} c={["#2a4f8f", "#1f6b3a", "#8f2a2a"][i]} m={0.4} ro={0.45} />)}
      {[0, 1, 2, 3].map((i) => <Cyl key={i} p={[-6.1, 0.13 + i * 0.25, -2.6]} r={0.36} h={0.24} c="#151515" ro={0.95} />)}

      {/* ===== BAHÍA 1: elevador de 2 columnas con el sedán ===== */}
      <Box p={[-5.55, 1.6, 0]} s={[0.26, 3.2, 0.32]} c="#c8302a" m={0.4} r={0.4} rad={0.02} />
      <Box p={[-2.85, 1.6, 0]} s={[0.26, 3.2, 0.32]} c="#c8302a" m={0.4} r={0.4} rad={0.02} />
      <Box p={[-4.2, ly - 0.06, 0]} s={[2.5, 0.06, 0.16]} c="#555b61" m={0.7} r={0.4} rad={0.01} />
      <group position={[-4.2, ly, 0]}>
        <Body len={4.5} wid={1.75} h={0.62} cab={[2.2, 0.5, -0.15]} col="#5d6e86" />
        <group position={[0, -0.02, 0]}><Drivetrain t={t} hot={badNow?.part ?? ""} heat={heat * lift} vis={lift > 0.3 ? 1 : 0} /></group>
        <Wheel p={[0.82, 0.06, 1.42]} /><Wheel p={[-0.82, 0.06, 1.42]} /><Wheel p={[0.82, 0.06, -1.42]} /><Wheel p={[-0.82, 0.06, -1.42]} />
      </group>
      {/* goteo de aceite del cárter a la bandeja */}
      <Cyl p={[-4.2, 0.04, 0.7]} r={0.32} h={0.07} c="#1a1a1a" m={0.4} ro={0.5} />
      {drip > 0.01 && Array.from({ length: 8 }, (_, i) => { const u = (t * 1.3 + i / 8) % 1; return <mesh key={i} position={[-4.2, lerp(ly + 0.45, 0.1, u), 0.7]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color="#2a1a05" metalness={0.6} roughness={0.15} transparent opacity={drip} /></mesh>; })}
      {/* humo azul del escape (el auto que quema aceite) */}
      {smoke > 0.01 && Array.from({ length: 22 }, (_, i) => { const u = (t * 0.35 + i / 22) % 1; return <mesh key={i} position={[-4.2 + 0.4 + (rnd(i, 1) - 0.5) * u * 1.2, ly + 0.25 + u * 1.1, -2.3 - u * 1.4]}><sphereGeometry args={[0.1 + u * 0.35, 12, 10]} /><meshStandardMaterial color="#9fb3cc" transparent opacity={0.32 * smoke * (1 - u)} depthWrite={false} /></mesh>; })}

      {/* ===== BAHÍA 2: SUV con capot y rayos X ===== */}
      <group position={[0, 0.38, 0]}>
        <Body len={4.8} wid={1.95} h={0.85} cab={[2.6, 0.72, -0.35]} col="#6f2a2a" xr={xr} mud={mud} />
        <group position={[0, -0.35, 0]}><Drivetrain t={t} hot={badNow?.part ?? ""} heat={heat * Math.max(xr, hood)} vis={Math.max(xr, hood)} /></group>
        {/* capot que se abre */}
        <group position={[0, 0.86, 0.9]} rotation={[-hood * 1.05, 0, 0]}>
          <Box p={[0, 0.02, 0.75]} s={[1.85, 0.05, 1.5]} c="#6f2a2a" r={0.3} m={0.35} rad={0.03} op={1 - 0.82 * xr} />
        </group>
        <Wheel p={[0.92, 0, 1.55]} r={0.4} /><Wheel p={[-0.92, 0, 1.55]} r={0.4} /><Wheel p={[0.92, 0, -1.55]} r={0.4} /><Wheel p={[-0.92, 0, -1.55]} r={0.4} />
      </group>

      {/* ===== BAHÍA 3: la F-150 blanca de Kowalski ===== */}
      <group position={[4.2, 0.4, 0]}>
        <Body len={5.3} wid={1.95} h={0.8} cab={[1.9, 0.7, 0.85]} col="#e9e9e4" pickup />
        <Wheel p={[0.92, 0, 1.8]} r={0.4} /><Wheel p={[-0.92, 0, 1.8]} r={0.4} /><Wheel p={[0.92, 0, -1.7]} r={0.4} /><Wheel p={[-0.92, 0, -1.7]} r={0.4} />
        {/* tablero: el odómetro (el número lo escribe la pieza 2D) */}
        <Box p={[-0.2, 1.15, 1.55]} s={[0.5, 0.14, 0.04]} c="#0a0d10" e="#7cff9a" ei={0.25 + 0.6 * pages} rad={0.01} />
      </group>
    </ThreeCanvas>
  );
};
