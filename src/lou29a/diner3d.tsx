// lou29 · EL MUNDO: el diner de Lou en corte (le falta la pared del frente). Piso de damero, la barra larga de fórmica con
// canto cromado y 7 taburetes de vinilo rojo; atrás la plancha con su campana y el riel de comandas, las jarras de café
// en el calentador, la vitrina giratoria de pies sobre la barra, el reloj y el TABLERO DE LETRAS que muestra el plato y el
// precio del número que se está contando (plan.json → board). La hora del día sale de plan.json (mood: 0 noche → 1 día).
// UNA escena y UNA cámara (KEYS en tl.ts). Luces SIEMPRE montadas (rampas de intensidad, nunca `cond && <Light>`).
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { KEYS, ST, BOARD, MOOD } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];
type Tx = THREE.Texture;

// ---------------- medidas ----------------
const CZ = 0.35;            // frente de la barra (los taburetes van delante, en z ≈ 1)
const CH = 1.02;            // alto de la barra
const BACKZ = -2.95;        // pared del fondo
export const PIE: V = [3.0, CH, CZ - 0.25];
export const PT = {
  board: [0.2, 2.25, BACKZ + 0.06] as V,
  griddle: [-1.6, 0.98, -2.2] as V,
  rail: [-1.6, 1.75, -1.85] as V,
  pie: [PIE[0], PIE[1] + 0.35, PIE[2]] as V,
  coffee: [2.0, 1.1, -2.35] as V,
  clock: [2.6, 2.45, BACKZ + 0.05] as V,
  stools: [0, 0.75, 1.0] as V,
  window: [-4.9, 1.6, -0.5] as V,
  register: [-3.4, CH + 0.2, CZ - 0.25] as V,
};

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  // vuelo en CURVA (nunca línea recta): arco hacia arriba y al costado según el sentido del viaje
  if (b.arc) { const s = Math.sin(Math.PI * k) * b.arc; p.y += s * 2.2; p.x += s * (b.p[2] > a.p[2] ? 1.4 : -1.4); }
  // cámara en mano orgánica: senos lentos de amplitud chica, sumados también al aterrizar (la pose sigue viva)
  p.x += Math.sin(t * 0.53) * 0.014 + Math.sin(t * 1.37 + 2) * 0.003; p.y += Math.sin(t * 0.71 + 1) * 0.009 + Math.sin(t * 1.9) * 0.002;
  l.x += Math.sin(t * 0.41 + 0.4) * 0.01;
  return { p, l, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
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
const useDinerTex = () => useMemo(() => ({
  // damero blanco y negro gastado
  checker: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const w = (r + c) % 2 === 0; const v = w ? 222 - rnd(r * 8 + c) * 26 : 24 + rnd(r * 8 + c, 2) * 16; g.fillStyle = `rgb(${v},${v - 2},${v - 8})`; g.fillRect(c * 64, r * 64, 64, 64); }
    for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(90,80,60,${0.05 + rnd(i, 3) * 0.08})`; g.fillRect(rnd(i, 4) * 512, rnd(i, 5) * 512, 2, 2); }
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 2; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(512, i * 64); g.stroke(); }
  }, [8, 5]),
  // fórmica salpicada
  formica: mk(512, 512, (g) => {
    g.fillStyle = "#e9e0cc"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) { const c = ["#c9b28a", "#9fb7b9", "#d48d7a", "#8a8170"][i % 4]; g.fillStyle = c; g.globalAlpha = 0.35 + rnd(i, 2) * 0.4; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 2 + rnd(i, 5) * 5, 1.5 + rnd(i, 6) * 2); }
    g.globalAlpha = 1;
    for (let i = 0; i < 26; i++) { g.strokeStyle = "rgba(120,100,80,.18)"; g.lineWidth = 3; g.beginPath(); const x = rnd(i, 7) * 512, y = rnd(i, 8) * 512; g.moveTo(x, y); g.quadraticCurveTo(x + 20, y - 18, x + 40, y); g.stroke(); }
  }, [6, 1]),
  // acero inoxidable cepillado
  steel: mk(256, 256, (g) => {
    g.fillStyle = "#b9bdc2"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) { const v = 170 + rnd(y, 1) * 40; g.fillStyle = `rgba(${v},${v + 3},${v + 6},.5)`; g.fillRect(0, y, 256, 1); }
  }, [4, 2]),
  // azulejo crema de la pared
  tile: mk(256, 256, (g) => {
    g.fillStyle = "#ece2c8"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = `rgba(255,250,235,${0.2 + rnd(r * 4 + c) * 0.2})`; g.fillRect(c * 64 + 3, r * 64 + 3, 58, 58); }
    g.fillStyle = "rgba(120,110,90,.5)"; for (let i = 0; i <= 4; i++) { g.fillRect(i * 64 - 1, 0, 2, 256); g.fillRect(0, i * 64 - 1, 256, 2); }
  }, [10, 3]),
  clock: mk(256, 256, (g) => {
    g.fillStyle = "#f5efe0"; g.beginPath(); g.arc(128, 128, 126, 0, 6.3); g.fill();
    g.fillStyle = "#1b1b1b"; g.font = "bold 30px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(String(i), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
    g.strokeStyle = "#b3261e"; g.lineWidth = 5; g.beginPath(); g.arc(128, 128, 120, 0, 6.3); g.stroke();
  }),
  glow: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
}), []);

// el tablero de fieltro negro con letras blancas de plástico (cambia con el número que se cuenta)
const boardTex = (lines: string[]) => mk(1024, 512, (g) => {
  g.fillStyle = "#151515"; g.fillRect(0, 0, 1024, 512);
  for (let y = 0; y < 512; y += 8) { g.fillStyle = "rgba(255,255,255,.035)"; g.fillRect(0, y, 1024, 1); }
  g.fillStyle = "#f2efe6"; g.textAlign = "center"; g.textBaseline = "middle";
  const n = lines.length;
  lines.forEach((l, i) => {
    const big = i === n - 1 && /[¢$]/.test(l);
    g.font = `bold ${big ? 150 : 84}px Arial Narrow, Arial`;
    const y = n === 1 ? 256 : 110 + i * (290 / Math.max(1, n - 1));
    // letras sueltas apenas torcidas, como las de plástico de verdad
    let x = 512 - g.measureText(l).width / 2;
    for (const ch of l) { const w = g.measureText(ch).width; g.save(); g.translate(x + w / 2, y + (rnd(x, 3) - 0.5) * 4); g.rotate((rnd(x, 9) - 0.5) * 0.04); g.fillText(ch, 0, 0); g.restore(); x += w; }
  });
});

// ---------------- primitivas ----------------
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 28, r2, op, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} map={map} /></mesh>
);
const Dots: React.FC<{ pts: [number, number, number, number][]; col: string; size: number; glow: Tx }> = ({ pts, col, size, glow }) => {
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry(), c = new THREE.Color(col);
    const pos = new Float32Array(pts.length * 3), cc = new Float32Array(pts.length * 3);
    pts.forEach(([x, y, z, o], i) => { pos.set([x, y, z], i * 3); cc.set([c.r * o, c.g * o, c.b * o], i * 3); });
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(cc, 3));
    return geo;
  }, [pts, col]);
  return <points geometry={g}><pointsMaterial map={glow} size={size} sizeAttenuation vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></points>;
};
// vapor que sube (plancha y café): puntos deterministas por t
const steam = (t: number, o: V, n: number, w: number, hgt: number, amt: number): [number, number, number, number][] =>
  Array.from({ length: n }, (_, i) => { const ph = (t * (0.22 + rnd(i, 1) * 0.12) + rnd(i, 2)) % 1; return [o[0] + (rnd(i, 3) - 0.5) * w * (0.4 + ph), o[1] + ph * hgt, o[2] + (rnd(i, 4) - 0.5) * 0.15, amt * Math.sin(Math.PI * ph) * 0.5]; });

const PIES = ["#d9a35a", "#c2412f", "#f1e7c9", "#6b3a22", "#e8c86a", "#f6f0dd"];
const Stool: React.FC<{ x: number; spin: number }> = ({ x, spin }) => (
  <group position={[x, 0, CZ + 0.62]}>
    <Cyl p={[0, 0.02, 0]} r={0.2} h={0.04} c="#9aa0a6" rough={0.25} m={0.9} />
    <Cyl p={[0, 0.36, 0]} r={0.035} h={0.68} c="#c9ced3" rough={0.15} m={1} />
    <group position={[0, 0.74, 0]} rotation={[0, spin, 0]}>
      <Cyl p={[0, 0, 0]} r={0.22} h={0.05} c="#c9ced3" rough={0.15} m={1} />
      <Cyl p={[0, 0.06, 0]} r={0.215} r2={0.2} h={0.1} c="#b3201c" rough={0.42} />
      {/* botón de la costura: deja ver que gira */}
      <mesh position={[0.2, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.03, 8]} /><meshStandardMaterial color="#6d1210" /></mesh>
    </group>
  </group>
);

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useDinerTex();
  const s = ST(t);
  let bi = 0; for (let i = 0; i < BOARD.length; i++) if (t >= BOARD[i][0]) bi = i;
  const bLines = BOARD[bi]?.[1] ?? ["LOU'S", "DINER"];
  const bKey = bLines.join("|");
  const bTex = useMemo(() => boardTex(bLines), [bKey]); // eslint-disable-line react-hooks/exhaustive-deps
  // el número nuevo «se enciende» suave al entrar
  const bAge = t - (BOARD[bi]?.[0] ?? -9), bPulse = Math.exp(-Math.max(0, bAge) * 2.2) * 0.35;
  const m = MOOD;
  const sky = new THREE.Color("#0b1530").lerp(new THREE.Color("#bcd3ea"), m).getStyle();
  const hr = s.clock % 12, hA = -(hr / 12) * Math.PI * 2, mA = -((s.clock % 1)) * Math.PI * 2;
  const pieRot = t * 0.35;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55} threshold={0.86} exposure={1.25 + 0.2 * m} env={0.45} />
      <color attach="background" args={[sky]} />
      <fogExp2 attach="fog" args={[new THREE.Color("#120e0b").lerp(new THREE.Color("#c9d6e2"), m * 0.6).getStyle(), 0.018]} />
      <hemisphereLight args={[0xfff1dc, 0x2a2018, 0.55 + 0.45 * m]} />
      <directionalLight position={[-9, 8, 6]} intensity={0.25 + 1.4 * m} color={m > 0.5 ? "#fff3df" : "#8fa8ff"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* globos del techo sobre la barra (siempre montados) */}
      {[-3, -1, 1, 3].map((x, i) => <group key={x} position={[x, 2.75, CZ - 0.1]}>
        <Cyl p={[0, 0.3, 0]} r={0.008} h={0.6} c="#222" />
        <mesh><sphereGeometry args={[0.16, 24, 16]} /><meshStandardMaterial color="#fff6e0" emissive="#ffd9a0" emissiveIntensity={1.6} roughness={0.3} toneMapped={false} /></mesh>
        <pointLight position={[0, -0.25, 0]} intensity={2.4 + 0.08 * Math.sin(t * 0.6 + i)} distance={4.5} color="#ffd29a" castShadow={i === 1} />
      </group>)}

      {/* ===== piso, paredes y techo ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[10, 7]} /><meshStandardMaterial map={tx.checker} roughness={0.35} metalness={0.05} /></mesh>
      <Box p={[0, 1.9, BACKZ - 0.05]} s={[10, 3.8, 0.1]} c="#efe4c8" map={tx.tile} r={0.5} rad={0.005} />
      <Box p={[0, 0.5, BACKZ + 0.02]} s={[10, 1.0, 0.06]} c="#b9bdc2" map={tx.steel} r={0.28} m={0.85} rad={0.005} />
      <Box p={[-5.0, 1.9, 0]} s={[0.1, 3.8, 7]} c="#e6d9bb" map={tx.tile} r={0.5} rad={0.005} />
      <Box p={[0, 3.82, 0]} s={[10, 0.06, 7]} c="#d8cfbd" r={0.8} rad={0.005} />
      {/* ventana grande de la izquierda: afuera la noche (o el día) y el camión rojo cuando el plan lo pide */}
      <group position={[-4.94, 1.65, -0.5]}>
        <mesh rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[3.2, 1.5]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
        {[-1.6, -0.53, 0.53, 1.6].map((z) => <Box key={z} p={[0.02, 0, z]} s={[0.05, 1.56, 0.06]} c="#c9ced3" m={0.9} r={0.2} />)}
        <Box p={[0.02, 0.78, 0]} s={[0.05, 0.06, 3.3]} c="#c9ced3" m={0.9} r={0.2} />
        <Box p={[0.02, -0.78, 0]} s={[0.05, 0.06, 3.3]} c="#c9ced3" m={0.9} r={0.2} />
        <group position={[-3.2, -0.5, 0.4]} scale={Math.max(0.001, s.truck)}>
          <Box p={[0, 0.35, 0]} s={[0.9, 0.7, 1.0]} c="#a3161a" r={0.35} m={0.3} />
          <Box p={[0, 0.45, -1.4]} s={[0.95, 0.9, 1.8]} c="#d8d8d2" r={0.6} />
          <mesh position={[0.46, 0.25, 0.48]}><sphereGeometry args={[0.05, 12, 8]} /><meshBasicMaterial color="#fff2c0" toneMapped={false} /></mesh>
        </group>
      </group>

      {/* ===== la línea de cocina: plancha, campana, riel de comandas, calentador de café ===== */}
      <Box p={[-1.6, 0.45, -2.25]} s={[2.4, 0.9, 0.9]} c="#a9adb2" map={tx.steel} r={0.3} m={0.85} />
      <Box p={[-1.6, 0.93, -2.25]} s={[2.3, 0.06, 0.8]} c="#1c1c1e" r={0.18 - 0.08 * s.sizzle} m={0.9} e="#ff5a1a" ei={0.05 + 0.1 * s.sizzle} />
      <Box p={[-1.6, 2.55, -2.35]} s={[2.6, 0.5, 1.1]} c="#b9bdc2" map={tx.steel} r={0.25} m={0.9} />
      <pointLight position={[-1.6, 2.2, -2.0]} intensity={1.6} distance={3.2} color="#ffcf8f" />
      <Dots pts={steam(t, [-1.6, 1.0, -2.1], 46, 1.8, 1.2, 0.6 + 0.6 * s.sizzle)} col="#ffffff" size={0.12} glow={tx.glow} />
      <Box p={[-1.6, 1.78, -1.86]} s={[2.4, 0.03, 0.03]} c="#d0d4d8" m={1} r={0.2} />
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-2.6 + i * 0.32 + 0.02 * Math.sin(t * 0.8 + i), 1.62, -1.85]} rotation={[0, 0, 0.03 * Math.sin(t * 0.6 + i * 2)]}><planeGeometry args={[0.16, 0.26]} /><meshStandardMaterial color="#f4efe0" roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
      <Box p={[2.0, 0.45, -2.35]} s={[3.2, 0.9, 0.8]} c="#a9adb2" map={tx.steel} r={0.3} m={0.85} />
      <Box p={[2.0, 0.92, -2.35]} s={[3.2, 0.04, 0.8]} c="#e9e0cc" map={tx.formica} r={0.4} />
      {[1.75, 2.25].map((x, i) => <group key={x} position={[x, 0.95, -2.35]}>
        <Cyl p={[0, 0.02, 0]} r={0.12} h={0.03} c="#d33" e="#ff3a1a" ei={0.8} />
        <Cyl p={[0, 0.17, 0]} r={0.1} r2={0.12} h={0.26} c="#2a160a" op={0.85} rough={0.05} />
        <Cyl p={[0, 0.33, 0]} r={0.05} r2={0.08} h={0.07} c={i ? "#e06a10" : "#222"} rough={0.4} />
      </group>)}
      <Dots pts={steam(t, [2.0, 1.25, -2.3], 18, 0.6, 0.7, 0.5)} col="#ffffff" size={0.07} glow={tx.glow} />

      {/* ===== EL TABLERO DE LETRAS ===== */}
      <group position={PT.board}>
        <Box p={[0, 0, -0.02]} s={[2.3, 1.2, 0.05]} c="#4a2e1c" r={0.6} />
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.18, 1.08]} /><meshStandardMaterial map={bTex} roughness={0.85} emissive="#ffffff" emissiveMap={bTex} emissiveIntensity={0.08 + bPulse} /></mesh>
        <spotLight position={[0, 0.9, 0.9]} angle={0.9} penumbra={0.7} intensity={3.2} distance={3} color="#ffe2b0" target-position={[0.2, 2.0, BACKZ]} />
      </group>
      <group position={PT.clock}>
        <Cyl p={[0, 0, -0.02]} r={0.3} h={0.05} c="#b3261e" rot={[Math.PI / 2, 0, 0]} />
        <mesh position={[0, 0, 0.01]}><circleGeometry args={[0.27, 48]} /><meshStandardMaterial map={tx.clock} roughness={0.5} emissive="#fff4dd" emissiveIntensity={0.15} /></mesh>
        <group position={[0, 0, 0.02]} rotation={[0, 0, hA]}><mesh position={[0, 0.07, 0]}><boxGeometry args={[0.022, 0.15, 0.006]} /><meshStandardMaterial color="#111" /></mesh></group>
        <group position={[0, 0, 0.026]} rotation={[0, 0, mA]}><mesh position={[0, 0.1, 0]}><boxGeometry args={[0.014, 0.21, 0.006]} /><meshStandardMaterial color="#111" /></mesh></group>
      </group>

      {/* ===== LA BARRA ===== */}
      <Box p={[0, CH / 2 - 0.02, CZ - 0.2]} s={[8.4, CH - 0.04, 0.5]} c="#b9bdc2" map={tx.steel} r={0.3} m={0.85} />
      <Box p={[0, 0.42, CZ + 0.06]} s={[8.42, 0.12, 0.02]} c="#a3161a" r={0.35} m={0.2} />
      <Box p={[0, CH - 0.01, CZ - 0.25]} s={[8.6, 0.05, 0.8]} c="#efe6d2" map={tx.formica} r={0.32} />
      <Box p={[0, CH - 0.01, CZ + 0.15]} s={[8.62, 0.06, 0.03]} c="#d5dadf" m={1} r={0.12} />
      {[-2.4, -0.6, 1.2].map((x) => <group key={x} position={[x, CH + 0.02, CZ - 0.1]}>
        <Cyl p={[0, 0.06, 0]} r={0.05} r2={0.042} h={0.11} c="#f6f1e6" rough={0.25} />
        <Cyl p={[0, 0.112, 0]} r={0.043} h={0.004} c="#2a160a" rough={0.1} />
        <Box p={[0.35, 0.07, -0.05]} s={[0.12, 0.13, 0.07]} c="#d5dadf" m={1} r={0.15} />
      </group>)}
      <Dots pts={steam(t, [-0.6, CH + 0.16, CZ - 0.1], 10, 0.15, 0.45, 0.5)} col="#ffffff" size={0.05} glow={tx.glow} />
      <group position={PT.register}>
        <Box p={[0, 0, 0]} s={[0.45, 0.3, 0.4]} c="#7a7d80" m={0.9} r={0.25} />
        <Box p={[0, 0.2, -0.1]} s={[0.4, 0.14, 0.12]} c="#3a3c3e" m={0.6} r={0.3} />
      </group>
      {/* LA VITRINA GIRATORIA de pies */}
      <group position={PIE}>
        <Cyl p={[0, 0.04, 0]} r={0.36} h={0.06} c="#c9ced3" m={1} r2={0.38} rough={0.15} />
        {[0.12, 0.38, 0.62].map((y, k) => <group key={y} position={[0, y, 0]} rotation={[0, pieRot + k * 0.7, 0]}>
          <Cyl p={[0, 0, 0]} r={0.31} h={0.01} c="#e8eef2" op={0.6} rough={0.05} />
          {[0, 1, 2].map((j) => <group key={j} rotation={[0, j * 2.09, 0]}><Cyl p={[0.17, 0.035, 0]} r={0.11} h={0.06} c={PIES[(k * 3 + j) % PIES.length]} rough={0.7} /></group>)}
        </group>)}
        <Cyl p={[0, 0.42, 0]} r={0.35} h={0.8} c="#dfeff8" op={0.18} rough={0.02} />
        <Cyl p={[0, 0.84, 0]} r={0.36} h={0.04} c="#c9ced3" m={1} rough={0.15} />
        <pointLight position={[0, 0.72, 0]} intensity={0.9} distance={1.4} color="#ffe6b8" />
      </group>
      {[-3, -2, -1, 0, 1, 2, 3].map((x, i) => <Stool key={x} x={x} spin={s.spin * (2.2 + i * 0.4) + Math.sin(i * 1.7) * 0.4} />)}
      <pointLight position={[0, 1.8, 3.2]} intensity={1.2} distance={9} color="#ffe0b8" />
    </ThreeCanvas>
  );
};
