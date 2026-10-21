// ctrsarten · EL MUNDO: cocina-laboratorio en corte (maqueta de arquitecto) con la estufa como mesa de trabajo,
// la sartén quemada en la hornalla del frente y un CRONÓMETRO GIGANTE colgado en la pared ("en 10 minutos se cae solo").
// Una sola escena y UNA cámara (keyframes que vienen de Min1 anclados a la voz). Eventos por parámetro (EV):
// llama, costra que se agrieta y se levanta en láminas, espuma de la pastilla, vapor, aguja del cronómetro, noche→día.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[]) => {
  const camAt = (t: number) => {
    let i = 0;
    while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
    const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
  };
  const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.01, 200); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const a = camAt(t), b = camAt(t + 1 / FPS);
    const pa = project(a, b.l), pb = project(b, b.l);
    const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
    return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
  };
  return { camAt, screenOf, camSpeed };
};

// marcadores 3D (para portales y rótulos)
export const PT = {
  pan: [0.55, 1.02, 0.25] as V3,       // centro de la sartén (hornalla del frente derecha)
  panRim: [0.55, 1.06, 0.62] as V3,
  clock: [0.2, 2.55, -1.42] as V3,      // centro del cronómetro de pared
  window: [-2.35, 2.0, -0.4] as V3,
  sink: [-1.35, 0.95, -0.95] as V3,
  cabinet: [-1.35, 0.4, -0.55] as V3,
  shelf: [2.35, 1.95, -1.25] as V3,
  knob: [0.55, 0.88, 0.62] as V3,
  rack: [1.35, 1.35, -1.38] as V3,
  magnet: [1.0, 1.0, -1.0] as V3,
};

// ---------------- texturas propias ----------------
const mkTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
// costra quemada: carbón negro brillante con grietas tipo barro seco (las celdas = las láminas que se levantan)
const CELLS = 72;
const cellSeeds = Array.from({ length: CELLS }, (_, i) => { const a = rnd(i, 1) * Math.PI * 2, r = Math.sqrt(rnd(i, 2)) * 0.92; return [Math.cos(a) * r, Math.sin(a) * r] as [number, number]; });
const useCrust = () => useMemo(() => mkTex(1024, 1024, (g) => {
  const N = 1024, cx = N / 2;
  const img = g.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = (x - cx) / cx, v = (y - cx) / cx;
    let d1 = 9, d2 = 9;
    for (const [sx, sy] of cellSeeds) { const d = Math.hypot(u - sx, v - sy); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
    const edge = d2 - d1; const crack = edge < 0.012 ? 1 : edge < 0.03 ? (0.03 - edge) / 0.018 : 0;
    const n = rnd(x * 0.37 + y * 13.1, 3) * 18 + Math.sin(u * 40 + v * 23) * 6;
    const base = 14 + n * 0.6, brown = Math.max(0, 1 - Math.hypot(u, v) * 1.1) * 22;
    const i = (y * N + x) * 4;
    img.data[i] = Math.max(0, base + brown * 0.9 - crack * 10); img.data[i + 1] = Math.max(0, base * 0.85 + brown * 0.45 - crack * 10); img.data[i + 2] = Math.max(0, base * 0.7 - crack * 10); img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}), []);
// acero cepillado (fondo de la sartén que aparece debajo de la costra)
const useSteel = () => useMemo(() => mkTex(512, 512, (g) => {
  g.fillStyle = "#b9bcc0"; g.fillRect(0, 0, 512, 512);
  for (let r = 4; r < 256; r += 2) { g.strokeStyle = `rgba(${200 + rnd(r, 1) * 55},${200 + rnd(r, 1) * 55},${205 + rnd(r, 1) * 50},.35)`; g.lineWidth = 1.2; g.beginPath(); g.arc(256, 256, r, 0, 6.3); g.stroke(); }
}), []);
// esfera del cronómetro (se redibuja: minutos que faltan + escala de 10 min)
const drawClock = (g: CanvasRenderingContext2D, rem: number, hot: number) => {
  const N = 1024, c = N / 2;
  g.clearRect(0, 0, N, N);
  const gr = g.createRadialGradient(c, c * 0.8, 50, c, c, c); gr.addColorStop(0, "#fbfaf6"); gr.addColorStop(1, "#e2ddd2");
  g.fillStyle = gr; g.beginPath(); g.arc(c, c, c - 4, 0, 6.3); g.fill();
  // arco de lo que ya corrió (naranja que se llena)
  const run = 1 - rem / 600;
  if (run > 0.001) { g.strokeStyle = `rgba(255,${120 - hot * 40},40,.85)`; g.lineWidth = 46; g.beginPath(); g.arc(c, c, c - 70, -Math.PI / 2, -Math.PI / 2 + run * Math.PI * 2); g.stroke(); }
  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * Math.PI * 2 - Math.PI / 2, big = k % 6 === 0;
    g.strokeStyle = big ? "#1d1f22" : "#55585d"; g.lineWidth = big ? 12 : 4;
    g.beginPath(); g.moveTo(c + Math.cos(a) * (c - (big ? 130 : 110)), c + Math.sin(a) * (c - (big ? 130 : 110))); g.lineTo(c + Math.cos(a) * (c - 96), c + Math.sin(a) * (c - 96)); g.stroke();
    if (big) { g.fillStyle = "#1d1f22"; g.font = "bold 74px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(k / 6 || 10), c + Math.cos(a) * (c - 200), c + Math.sin(a) * (c - 200)); }
  }
  const m = Math.floor(rem / 60), s = Math.floor(rem % 60);
  g.fillStyle = "#111"; g.fillRect(c - 190, c + 130, 380, 130); g.fillStyle = `rgb(255,${90 + 60 * (1 - hot)},60)`; g.font = "bold 112px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`, c, c + 198);
  g.fillStyle = "#6b6e73"; g.font = "bold 40px Arial"; g.fillText("MIN", c, c - 150);
};
const useClockTex = (rem: number, hot: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 1024; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { cv, tex }; }, []);
  drawClock(cv.getContext("2d")!, rem, hot); tex.needsUpdate = true; return tex;
};
// punto suave (espuma, vapor) — nunca partículas cuadradas
const useDot = () => useMemo(() => mkTex(64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.65)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.8, m = 0, e, ei = 0, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Slab: React.FC<{ p: V3; s: V3; c: string; cut?: string; map?: Tx }> = ({ p, s, c, cut = "#efe8da", map }) => (
  <group position={p}>
    <mesh receiveShadow castShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.92} map={map} /></mesh>
    <mesh position={[0, 0, s[2] / 2 + 0.002]}><planeGeometry args={[s[0], s[1]]} /><meshStandardMaterial color={cut} roughness={1} /></mesh>
  </group>
);

// llama azul de la hornalla (corona de conos emisivos que respiran)
const Flame: React.FC<{ p: V3; on: number; t: number; r?: number }> = ({ p, on, t, r = 0.16 }) => on < 0.02 ? null : (
  <group position={p}>
    {Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2, h = (0.045 + 0.02 * Math.sin(t * 13 + i * 2.1)) * (0.5 + Math.min(on, 1) * 0.5) * (on > 1 ? 1 + (on - 1) * 1.6 : 1);
      return <mesh key={i} position={[Math.cos(a) * r, h / 2, Math.sin(a) * r]} rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}>
        <coneGeometry args={[0.012, h, 6]} /><meshBasicMaterial color="#5aa8ff" transparent opacity={0.85 * Math.min(on, 1)} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>;
    })}
    <pointLight position={[0, 0.0, 0.25]} intensity={on * 0.35} distance={0.5} color="#7db8ff" />
  </group>
);

// LA SARTÉN: cuerpo de acero (torno), costra en celdas que se agrietan y levantan, agua, espuma y vapor
const Pan: React.FC<{ t: number; ev: Ev; crust: THREE.Texture; steel: THREE.Texture; dot: THREE.Texture }> = ({ t, ev, crust, steel, dot }) => {
  const R = 0.36;
  const body = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) { const k = i / 16; pts.push(new THREE.Vector2(R * 0.82 + (R - R * 0.82) * Math.pow(k, 1.6), k * 0.075)); }
    pts.push(new THREE.Vector2(R + 0.012, 0.078));
    return new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(R * 0.82, 0), ...pts], 96);
  }, []);
  // geometría de cada lámina: un polígono irregular alrededor de su semilla (sólo el borde de la celda Voronoi aproximado)
  const flakes = useMemo(() => cellSeeds.map(([sx, sy], i) => {
    const sh = new THREE.Shape(), n = 16, rr = 0.03 + rnd(i, 7) * 0.022;
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + rnd(i, k) * 0.35, q = rr * (0.55 + rnd(i, k + 9) * 0.75); const x = Math.cos(a) * q, y = Math.sin(a) * q; k ? sh.lineTo(x, y) : sh.moveTo(x, y); }
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.0025, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.0015, bevelSegments: 1 });
    return { g, x: sx * R * 0.78, z: sy * R * 0.78, d: Math.hypot(sx, sy) };
  }), []);
  const crustOn = ev.crust;            // 1 = costra entera; baja mientras se levantan
  const lift = ev.lift;                 // 0..1: progreso de las láminas que se despegan (de afuera hacia adentro)
  const water = ev.water, foam = ev.foam, steam = ev.steam;
  // espuma: puntos suaves sobre el agua que crecen desde la pastilla
  const foamGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const nF = 1600, fp = new Float32Array(nF * 3);
  for (let i = 0; i < nF; i++) {
    const a = rnd(i, 1) * Math.PI * 2 + Math.sin(i * 0.37) * 0.4, r = Math.pow(rnd(i, 2), 2.6) * R * 0.8 * Math.min(1, foam * 1.3);
    fp.set([Math.cos(a) * r + Math.sin(t * 1.3 + i) * 0.004, 0.05 + water * 0.012 + rnd(i, 3) * 0.006, Math.sin(a) * r], i * 3);
  }
  foamGeo.setAttribute("position", new THREE.BufferAttribute(fp, 3));
  const steamGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const nS = 260, sp = new Float32Array(nS * 3);
  for (let i = 0; i < nS; i++) {
    const ph = (rnd(i, 4) + t * (0.18 + rnd(i, 5) * 0.12)) % 1;
    sp.set([(rnd(i, 6) - 0.5) * R * 1.2 + Math.sin(t * 0.8 + i) * 0.08 * ph, 0.22 + ph * 1.1, (rnd(i, 7) - 0.5) * R * 1.2 - ph * 0.15], i * 3);
  }
  steamGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  return (
    <group position={[PT.pan[0], 0.985 + Math.abs(Math.sin(t * 11)) * 0.012 * (ev.wobble ?? 0), PT.pan[2]]} rotation={[Math.sin(t * 11) * 0.07 * (ev.wobble ?? 0), 0, Math.cos(t * 11) * 0.07 * (ev.wobble ?? 0)]}>
      <mesh geometry={body} castShadow receiveShadow><meshStandardMaterial color="#c9ccd0" metalness={0.92} roughness={0.28} side={THREE.DoubleSide} /></mesh>
      {/* fondo de acero limpio debajo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><circleGeometry args={[R * 0.82, 64]} /><meshStandardMaterial map={steel} metalness={0.9} roughness={0.22} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} /></mesh>
      {/* costra entera (se desvanece por celdas a medida que levantan) */}
      {crustOn > 0.01 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}><circleGeometry args={[R * 0.8, 64]} /><meshStandardMaterial map={crust} color="#8f775c" roughness={0.5} metalness={0} envMapIntensity={0.25} transparent={crustOn < 0.99} opacity={crustOn} depthWrite={crustOn >= 0.99} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} /></mesh>}
      {(ev.island ?? 0) > 0.01 && <mesh rotation={[-Math.PI / 2, 0, 0.6]} position={[0.02, 0.008, -0.01]} scale={[1, 0.8, 1]}><circleGeometry args={[R * 0.24 * (ev.island ?? 0), 24]} /><meshStandardMaterial map={crust} color="#8f775c" roughness={0.5} metalness={0} envMapIntensity={0.25} polygonOffset polygonOffsetFactor={-3} polygonOffsetUnits={-3} /></mesh>}
      {(ev.shine ?? 0) > 0.01 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]}><circleGeometry args={[R * 0.8, 64]} /><meshStandardMaterial color="#e8ecef" metalness={1} roughness={0.12} transparent opacity={ev.shine} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-4} /></mesh>}
      {/* láminas: se agrietan (suben 1-2 mm), se despegan, flotan y se van a la deriva */}
      {lift > 0.001 && flakes.map((f, i) => {
        const start = (1 - f.d) * 0.55 + rnd(i, 11) * 0.25;  // las del borde primero
        const k = cl((lift - start) / 0.35);
        if (k <= 0) return null;
        const up = k < 0.3 ? k / 0.3 * 0.003 : 0.003 + (k - 0.3) * 0.028 * water;
        const dr = (k - 0.3) > 0 ? (k - 0.3) * 0.09 : 0;
        return <mesh key={i} geometry={f.g} position={[f.x + Math.cos(i) * dr + Math.sin(t * 0.8 + i) * 0.004 * k, 0.012 + up, f.z + Math.sin(i) * dr]} rotation={[-Math.PI / 2 + (rnd(i, 12) - 0.5) * 0.6 * k, (rnd(i, 13) - 0.5) * 0.5 * k, rnd(i, 14) * 6]} castShadow>
          <meshStandardMaterial map={crust} color="#4a3d32" roughness={0.7} metalness={0} envMapIntensity={0.25} />
        </mesh>;
      })}
      {/* agua: disco translúcido con ondas */}
      {water > 0.01 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03 + water * 0.012, 0]}><circleGeometry args={[R * 0.86, 64]} /><meshStandardMaterial color="#6f8a94" roughness={0.08} metalness={0} envMapIntensity={0.3} transparent opacity={0.1 * water} depthWrite={false} /></mesh>}
      {foam > 0.01 && [0, 1, 2, 3].map((k) => { const ph = (t * 0.45 + k / 4) % 1; return <mesh key={"rw" + k} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.043 + water * 0.012, 0]}><ringGeometry args={[0.04 + ph * R * 0.75, 0.046 + ph * R * 0.75, 64]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.18 * (1 - ph) * foam} depthWrite={false} /></mesh>; })}
      {/* la pastilla: se deshace */}
      {ev.tab > 0.01 && <mesh position={[0, 0.03 + (1 - ev.tabDrop) * 0.5, 0]} rotation={[0, 0.4, (1 - ev.tabDrop) * 2]} scale={[ev.tab, ev.tab * 0.8, ev.tab]} castShadow><boxGeometry args={[0.07, 0.03, 0.05]} /><meshStandardMaterial color="#f3f2ee" roughness={0.7} /></mesh>}
      {foam > 0.01 && <points geometry={foamGeo}><pointsMaterial map={dot} color="#f4f8fa" size={0.011} transparent opacity={0.8 * foam} depthWrite={false} sizeAttenuation /></points>}
      {steam > 0.01 && <points geometry={steamGeo}><pointsMaterial map={dot} color="#eef4f8" size={0.09} transparent opacity={0.07 * steam} depthWrite={false} sizeAttenuation /></points>}
      {/* mango */}
      <mesh position={[0, 0.06, R + 0.22]} rotation={[0.1, 0, 0]} castShadow><boxGeometry args={[0.05, 0.03, 0.42]} /><meshStandardMaterial color="#1c1c1e" roughness={0.6} /></mesh>
    </group>
  );
};

// CRONÓMETRO GIGANTE de pared: bisel de acero, corona, esfera que se redibuja, aguja roja que barre
const Stopwatch: React.FC<{ rem: number; hot: number; glow: number }> = ({ rem, hot, glow }) => {
  const tex = useClockTex(rem, hot);
  const a = -(1 - rem / 600) * Math.PI * 2;
  return (
    <group position={PT.clock}>
      <mesh rotation={[0, 0, 0]} castShadow><torusGeometry args={[0.62, 0.07, 24, 96]} /><meshStandardMaterial color="#d7dadf" metalness={0.95} roughness={0.2} /></mesh>
      <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.64, 0.64, 0.08, 96]} /><meshStandardMaterial color="#2a2c30" metalness={0.6} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.012]}><circleGeometry args={[0.6, 96]} /><meshStandardMaterial map={tex} roughness={0.5} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.04 + glow * 0.22} /></mesh>
      <mesh position={[0, 0.74, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.16, 24]} /><meshStandardMaterial color="#d7dadf" metalness={0.95} roughness={0.2} /></mesh>
      <mesh position={[0, 0.85, 0]} castShadow><cylinderGeometry args={[0.11, 0.11, 0.06, 24]} /><meshStandardMaterial color="#c8402f" roughness={0.4} /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, a]}>
        <mesh position={[0, 0.24, 0]}><boxGeometry args={[0.022, 0.5, 0.01]} /><meshBasicMaterial color="#e3392b" toneMapped={false} /></mesh>
        <mesh><cylinderGeometry args={[0.035, 0.035, 0.02, 20]} /><meshStandardMaterial color="#e3392b" /></mesh>
      </group>
      {/* vidrio */}
      <mesh position={[0, 0, 0.05]}><circleGeometry args={[0.6, 64]} /><meshStandardMaterial color="#ffffff" roughness={0.02} metalness={0.3} transparent opacity={0.05} depthWrite={false} /></mesh>
    </group>
  );
};

// frascos/probetas del "laboratorio" (vidrio con líquido)
const Beaker: React.FC<{ p: V3; h?: number; r?: number; fill?: number; col?: string }> = ({ p, h = 0.22, r = 0.07, fill = 0.5, col = "#cfe6ef" }) => (
  <group position={p}>
    <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r, r, h, 32, 1, true]} /><meshPhysicalMaterial transmission={0.95} roughness={0.05} thickness={0.01} transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, (h * fill) / 2, 0]}><cylinderGeometry args={[r * 0.95, r * 0.95, h * fill, 32]} /><meshStandardMaterial color={col} transparent opacity={0.7} roughness={0.1} /></mesh>
    {[0.25, 0.5, 0.75].map((q) => <mesh key={q} position={[0, h * q, r + 0.001]}><planeGeometry args={[0.03, 0.004]} /><meshBasicMaterial color="#6b7480" /></mesh>)}
  </group>
);


// colgador de la pared: las 4 sartenes (acero · aluminio · antiadherente · hierro) + el imán que se pega o no
const miniPan = (() => { const pts: THREE.Vector2[] = [new THREE.Vector2(0, 0)]; for (let i = 0; i <= 10; i++) { const k = i / 10; pts.push(new THREE.Vector2(0.1 + 0.025 * Math.pow(k, 1.6), k * 0.035)); } return new THREE.LatheGeometry(pts, 48); })();
const PanRack: React.FC<{ t: number; mag: number; hi: number }> = ({ t, mag, hi }) => {
  const P4 = [
    { x: 0.98, c: "#c9ccd0", m: 0.92, r: 0.26, ok: 1 },
    { x: 1.24, c: "#d9dadb", m: 0.55, r: 0.5, ok: 0 },
    { x: 1.5, c: "#2b2c30", m: 0.1, r: 0.55, ok: 0 },
    { x: 1.76, c: "#1a1a1a", m: 0.35, r: 0.75, ok: 0 },
  ];
  return (
    <group>
      <mesh position={[1.37, 1.62, -1.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 1.1, 12]} /><meshStandardMaterial color="#c9ccd0" metalness={0.95} roughness={0.2} /></mesh>
      <group rotation={[0, 0, Math.PI / 2]} position={[1.37, 1.62, -1.45]} />
      {P4.map((q, i) => {
        const sw = Math.sin(t * 1.4 + i) * 0.03;
        const lit = hi > 0 ? cl(hi * 4 - i) : 0;
        return <group key={i} position={[q.x, 1.6, -1.42]} rotation={[0, 0, sw]}>
          <mesh position={[0, -0.04, 0]}><torusGeometry args={[0.02, 0.005, 8, 16]} /><meshStandardMaterial color="#888" metalness={0.9} /></mesh>
          <mesh position={[0, -0.18, 0.01]} castShadow><boxGeometry args={[0.03, 0.2, 0.015]} /><meshStandardMaterial color={i === 3 ? "#1a1a1a" : "#202022"} roughness={0.6} /></mesh>
          <mesh position={[0, -0.4, 0.0]} rotation={[Math.PI / 2, 0, 0]} geometry={miniPan} castShadow><meshStandardMaterial color={q.c} metalness={q.m} roughness={q.r} side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={lit * 0.04} /></mesh>
        </group>;
      })}
      {/* el imán: vuela de la mesada y se pega en la de acero */}
      <group position={[lerp(1.0, 0.98, ei2(mag)), lerp(1.0, 1.2, ei2(mag)), lerp(-1.0, -1.37, ei2(mag))]} rotation={[0, 0, mag * 0.3]}>
        <mesh castShadow><torusGeometry args={[0.035, 0.014, 12, 24, Math.PI]} /><meshStandardMaterial color="#d8322a" roughness={0.4} /></mesh>
        <mesh position={[-0.035, -0.012, 0]}><boxGeometry args={[0.028, 0.026, 0.03]} /><meshStandardMaterial color="#c9ccd0" metalness={0.9} roughness={0.2} /></mesh>
        <mesh position={[0.035, -0.012, 0]}><boxGeometry args={[0.028, 0.026, 0.03]} /><meshStandardMaterial color="#c9ccd0" metalness={0.9} roughness={0.2} /></mesh>
      </group>
    </group>
  );
};
const ei2 = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
// espátula de madera que empuja desde el borde (paso 5)
const Spatula: React.FC<{ k: number }> = ({ k }) => k <= 0.001 ? null : (
  <group position={[PT.pan[0] + 0.32 - k * 0.42, 1.03 + 0.06 * (1 - Math.min(1, k * 3)), PT.pan[2] + 0.05]} rotation={[0, 0.2, 0.35]}>
    <mesh castShadow><boxGeometry args={[0.1, 0.008, 0.07]} /><meshStandardMaterial color="#b88a56" roughness={0.6} /></mesh>
    <mesh position={[0.24, 0.05, 0]} rotation={[0, 0, 0.35]} castShadow><boxGeometry args={[0.42, 0.018, 0.022]} /><meshStandardMaterial color="#a77b4c" roughness={0.6} /></mesh>
  </group>
);

// ---------------- LA ESCENA ----------------
export type Ev = { flame: number; crust: number; lift: number; water: number; foam: number; steam: number; tab: number; tabDrop: number; rem: number; hot: number; glow: number; day: number; smoke: number; mag?: number; spat?: number; rackHi?: number; island?: number; wobble?: number; big?: number; shine?: number };
export const EV0: Ev = { flame: 0, crust: 1, lift: 0, water: 0, foam: 0, steam: 0, tab: 0, tabDrop: 0, rem: 600, hot: 0, glow: 0, day: 0.6, smoke: 0 };
export const KitchenWorld: React.FC<{ t: number; ev: Ev; cam: ReturnType<typeof makeCam> }> = ({ t, ev, cam }) => {
  const tx = useTextures(); const crust = useCrust(); const steel = useSteel(); const dot = useDot();
  const boxTex = useMemo(() => mkTex(512, 320, (g) => { const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, "#3a86e0"); gr.addColorStop(1, "#1d4f9a"); g.fillStyle = gr; g.fillRect(0, 0, 512, 320); g.fillStyle = "#fff"; g.font = "bold 62px Arial"; g.textAlign = "center"; g.fillText("PASTILLAS", 256, 120); g.font = "bold 34px Arial"; g.fillText("LAVAVAJILLAS · 30", 256, 175); for (let i = 0; i < 3; i++) { g.fillStyle = "#fff"; g.fillRect(150 + i * 80, 215, 60, 40); g.fillStyle = "#2f7fe0"; g.fillRect(150 + i * 80, 238, 60, 17); } }), []);
  const tileTex = useMemo(() => { const c = tx.tile.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(10, 7); c.needsUpdate = true; return c; }, [tx]);
  const k = cam.camAt(t);
  const day = ev.day;
  const sunCol = new THREE.Color("#9fb6e6").lerp(new THREE.Color("#fff1dc"), day);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <CamRig k={k} />
      <Post bloom={0.45} threshold={0.93} exposure={0.95 + 0.1 * day} env={0.22 + 0.1 * day} />
      <color attach="background" args={[new THREE.Color("#0f141b").lerp(new THREE.Color("#1d232b"), day).getHex()]} />
      <hemisphereLight args={[sunCol.getHex(), 0x24201c, 0.45 + 0.35 * day]} />
      <directionalLight position={[-6, 6, 3]} intensity={0.6 + 1.6 * day} color={sunCol} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <spotLight position={[0.6, 3.2, 1.6]} angle={0.5} penumbra={0.8} intensity={2.6} distance={7} color="#fff4e6" castShadow target-position={[0.55, 1, 0.2]} shadow-bias={-0.0004} />
      {/* ===== maqueta en corte: piso, pared del fondo, pared izquierda con ventana ===== */}
      <Slab p={[0, -0.1, 0]} s={[5.2, 0.2, 3.4]} c="#b7a07f" cut="#d9cbb3" map={tx.planks} />
      <Slab p={[0, 1.6, -1.6]} s={[5.2, 3.4, 0.2]} c="#e9e6df" map={tileTex} />
      <Slab p={[-2.6, 1.6, 0]} s={[0.2, 3.4, 3.4]} c="#e2ddd2" />
      {/* ventana (luz de afuera: noche azul → día cálido) */}
      <group position={[-2.49, 2.0, -0.4]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><planeGeometry args={[1.1, 1.0]} /><meshBasicMaterial color={new THREE.Color("#3b5684").lerp(new THREE.Color("#fff0cf"), day)} toneMapped={false} /></mesh>
        {[[0, 0.52, 1.2, 0.06], [0, -0.52, 1.2, 0.06], [-0.58, 0, 0.06, 1.1], [0.58, 0, 0.06, 1.1], [0, 0, 0.04, 1.0], [0, 0, 1.1, 0.04]].map(([x, y, a, b], i) => <mesh key={i} position={[x, y, 0.02]}><boxGeometry args={[a, b, 0.05]} /><meshStandardMaterial color="#f1ece2" /></mesh>)}
      </group>
      {/* mesada izquierda con pileta */}
      <Box p={[-1.35, 0.45, -1.2]} s={[1.9, 0.9, 0.7]} c="#6f8f8a" r={0.7} />
      <Box p={[-1.35, 0.93, -1.2]} s={[1.95, 0.06, 0.74]} c="#d9d5cc" r={0.35} />
      <Box p={[-1.35, 0.9, -1.15]} s={[0.7, 0.04, 0.46]} c="#8d9298" m={0.85} r={0.25} />
      <mesh position={[-1.35, 1.2, -1.48]} rotation={[0.3, 0, 0]}><torusGeometry args={[0.12, 0.018, 12, 32, Math.PI]} /><meshStandardMaterial color="#c9ccd0" metalness={0.95} roughness={0.2} /></mesh>
      {/* puertas del mueble bajo (el fondo del mueble donde se esconde la sartén) */}
      {[-1.8, -0.9].map((x) => <Box key={x} p={[x, 0.45, -0.84]} s={[0.84, 0.8, 0.03]} c="#7d9d97" r={0.6} />)}
      {/* ===== LA ESTUFA (mesa de trabajo) ===== */}
      <Box p={[0.3, 0.45, -0.25]} s={[1.3, 0.9, 1.6]} c="#eceae5" r={0.3} m={0.1} />
      <Box p={[0.3, 0.915, -0.25]} s={[1.32, 0.03, 1.62]} c="#1d1f22" r={0.25} m={0.4} />
      <Box p={[0.3, 0.45, 0.56]} s={[1.0, 0.55, 0.02]} c="#222428" r={0.15} m={0.3} />
      {[[0.0, -0.75], [0.55, -0.75], [0.0, 0.25]].map(([x, z], i) => <group key={i} position={[x, 0.94, z]}>
        <mesh><cylinderGeometry args={[0.13, 0.15, 0.02, 32]} /><meshStandardMaterial color="#2c2e32" metalness={0.6} roughness={0.4} /></mesh>
        {[0, 1, 2, 3].map((q) => <mesh key={q} position={[0, 0.02, 0]} rotation={[0, (q * Math.PI) / 4, 0]}><boxGeometry args={[0.36, 0.015, 0.025]} /><meshStandardMaterial color="#151619" /></mesh>)}
      </group>)}
      <Flame p={[PT.pan[0], 0.945, PT.pan[2]]} on={ev.flame * (1 + (ev.big ?? 0))} t={t} />
      {[-0.15, 0.1, 0.35, 0.6].map((x, i) => <mesh key={i} position={[x, 0.85, 0.58]} rotation={[Math.PI / 2, 0, i === 3 ? -ev.flame * 1.2 : 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.04, 20]} /><meshStandardMaterial color="#d8d6d0" roughness={0.4} /></mesh>)}
      <Pan t={t} ev={ev} crust={crust} steel={steel} dot={dot} />
      <PanRack t={t} mag={ev.mag ?? 0} hi={ev.rackHi ?? 0} />
      <Spatula k={ev.spat ?? 0} />
      {/* humo del quemado (gancho) */}
      {ev.smoke > 0.01 && <SmokeCol t={t} amt={ev.smoke} dot={dot} />}
      {/* ===== pared del fondo: el cronómetro gigante y el estante del laboratorio ===== */}
      <Stopwatch rem={ev.rem} hot={ev.hot} glow={ev.glow} />
      <Box p={[2.35, 1.82, -1.32]} s={[1.0, 0.04, 0.42]} c="#9a7a55" r={0.7} />
      <Beaker p={[2.0, 1.84, -1.3]} h={0.26} fill={0.4} />
      <Beaker p={[2.22, 1.84, -1.28]} h={0.2} r={0.055} fill={0.65} col="#e9d8a8" />
      <Beaker p={[2.48, 1.84, -1.3]} h={0.3} r={0.06} fill={0.3} col="#d6eef7" />
      <mesh position={[2.72, 1.98, -1.3]} castShadow><boxGeometry args={[0.14, 0.28, 0.1]} /><meshStandardMaterial color="#5b3a1f" roughness={0.3} /></mesh>
      {/* la caja de pastillas sobre la mesada derecha */}
      <Box p={[1.35, 0.45, -1.2]} s={[0.8, 0.9, 0.7]} c="#6f8f8a" r={0.7} />
      <Box p={[1.35, 0.93, -1.2]} s={[0.84, 0.06, 0.74]} c="#d9d5cc" r={0.35} />
      <mesh position={[1.4, 1.04, -1.25]} castShadow><boxGeometry args={[0.26, 0.16, 0.14]} /><meshStandardMaterial map={boxTex} roughness={0.5} /></mesh>
    </ThreeCanvas>
  );
};
const CamRig: React.FC<{ k: { p: THREE.Vector3; l: THREE.Vector3; fov: number } }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.01; c.far = 200; c.updateProjectionMatrix();
  return null;
};
const SmokeCol: React.FC<{ t: number; amt: number; dot: THREE.Texture }> = ({ t, amt, dot }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 320, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const ph = (rnd(i, 4) + t * (0.12 + rnd(i, 5) * 0.08)) % 1;
    p.set([PT.pan[0] + (rnd(i, 6) - 0.5) * 0.3 * (1 + ph) + Math.sin(t * 0.9 + i) * 0.08 * ph, 1.05 + ph * 1.6, PT.pan[2] + (rnd(i, 7) - 0.5) * 0.3 * (1 + ph)], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial map={dot} color="#8a8784" size={0.34} transparent opacity={0.22 * amt} depthWrite={false} sizeAttenuation /></points>;
};
