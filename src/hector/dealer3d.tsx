// hector · EL MUNDO del canal: BIRD ROAD AUTO PLAZA (Miami) como maqueta en corte, sobre un bloque de asfalto.
// Adelante el LOTE (autos con precio en el parabrisas, banderines, palmeras, el cartel alto sobre Bird Road).
// En el medio el SHOWROOM de vidrio: dos autos de piso, los escritorios de los vendedores (en uno, el bloc amarillo con
// el FOUR-SQUARE de Abe), la TORRE del gerente (tarima alta en el centro) y la máquina de café. Al fondo a la derecha
// THE BOX, la oficina F&I sin ventanas: escritorio, cuadro del velero, bowl de mentas, el CAJÓN de arriba a la derecha
// (menús, lapicera dorada, calculadora gris, rate sheets boca abajo) y la puerta que se cierra.
// UNA escena y UNA cámara (balanceo de mano encima). Cámara y eventos llegan por props (cam.json / ev.json de cada video,
// armados con at() sobre la voz). Lo usan todos los videos del canal (ver D:/rtmp/hector/MUNDO.md). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo (para rótulos, portales y cámara) ----------------
export const PT = {
  sign: [-4.6, 3.3, 3.2] as V3,       // el cartel alto sobre Bird Road
  lot: [-1.5, 0.5, 3.0] as V3,        // los autos del lote
  price: [-1.8, 0.48, 3.22] as V3,    // el precio en el parabrisas
  door: [0.2, 1.0, 1.55] as V3,       // la puerta de vidrio del showroom
  floorcar: [-1.4, 0.6, 0.2] as V3,   // el auto de piso
  desk: [1.2, 0.8, 0.5] as V3,        // escritorio del vendedor
  pad: [1.25, 0.79, 0.45] as V3,      // el bloc amarillo con el four-square
  keys: [1.6, 0.8, 0.35] as V3,       // las llaves del cliente
  chair: [1.2, 0.5, 1.1] as V3,       // la sillita de plástico del cliente
  tower: [0.0, 1.55, -0.9] as V3,     // la torre del gerente
  coffee: [-3.0, 1.0, -1.1] as V3,    // la máquina de café
  clock: [-1.0, 2.35, -1.62] as V3,   // el reloj de pared del showroom
  box: [3.6, 1.0, -0.6] as V3,        // THE BOX (oficina F&I)
  boxdoor: [2.55, 1.0, 0.2] as V3,    // la puerta de la oficina
  fidesk: [3.7, 0.78, -0.75] as V3,   // escritorio F&I
  drawer: [4.15, 0.62, -0.95] as V3,  // el cajón de arriba a la derecha
  pen: [3.55, 0.8, -0.6] as V3,       // la lapicera dorada
  calc: [3.95, 0.8, -0.85] as V3,     // la calculadora gris
  papers: [3.35, 0.8, -0.7] as V3,    // la pila de contratos
  mints: [3.2, 0.82, -1.05] as V3,    // el bowl de mentas
  boat: [3.7, 1.75, -1.58] as V3,     // el cuadro del velero
};
export type PtK = keyof typeof PT;

// ---------------- CÁMARA (llaves; balanceo de mano encima) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const camAt = (keys: Key[], t: number) => {
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t <= t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (keys: Key[], t: number, q: V3) => project(camAt(keys, t), v3(q));
const Cam: React.FC<{ t: number; keys: Key[] }> = ({ t, keys }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(keys, t), m = manoCam(t, 1, 7);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l);
  cm.rotateY((m.pan * Math.PI) / 180); cm.rotateX((m.tilt * Math.PI) / 180); cm.rotateZ((m.roll * Math.PI) / 180);
  cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- eventos (rangos en segundos globales) ----------------
// drawer = cajón abierto · door = puerta de the box cerrada · keys = llaves "desaparecen" del escritorio
// pad = el four-square se ilumina (q = celda 0..3 en ev.padq) · night = el lote de noche · rain = tormenta (Andrew)
// sale = banderines + globos en el lote · papers = la pila de contratos crece · sign = la lapicera firma
export type Ev = Record<string, [number, number][]> & { padq?: { a: number; q: number }[]; tag?: { a: number; txt: string }[] };
const onR = (E: Ev, t: number, k: string, fi = 0.5, fo = 0.5) => { for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a - fi && t < b + fo) return win(t, a - fi, a) * (1 - win(t, b, b + fo)); return 0; };
const since = (E: Ev, t: number, k: string) => { for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a && t < b) return t - a; return -1; };

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  asphalt: mk(512, 512, (g) => {
    g.fillStyle = "#3b3d40"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4000; i++) { const v = 45 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v},${v + 3},.55)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(20,20,22,${0.12 + 0.1 * rnd(i, 4)})`; g.beginPath(); g.ellipse(rnd(i, 5) * 512, rnd(i, 6) * 512, 30 + rnd(i, 7) * 60, 14 + rnd(i, 8) * 30, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
  }, [4, 3]),
  showfloor: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = 228 + rnd(r * 8 + c, 3) * 14; g.fillStyle = `rgb(${v},${v - 2},${v - 6})`; g.fillRect(c * 64, r * 64, 64, 64); }
    g.strokeStyle = "rgba(120,110,100,.35)"; g.lineWidth = 2; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 512); g.stroke(); g.beginPath(); g.moveTo(0, k * 64); g.lineTo(512, k * 64); g.stroke(); }
  }, [3, 3]),
  carpet: mk(256, 256, (g) => {
    g.fillStyle = "#3d4a5c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) { const v = rnd(i, 1) * 30; g.fillStyle = `rgba(${40 + v},${55 + v},${75 + v},.5)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }, [3, 3]),
  wall: mk(256, 256, (g) => { g.fillStyle = "#efe9de"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(150,140,120,${0.06 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 3); } }, [2, 2]),
  sky: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f86c8"); gr.addColorStop(0.42, "#9fcbe8"); gr.addColorStop(0.55, "#e9ddc6"); gr.addColorStop(1, "#5b6168"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
  skyN: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#06080f"); gr.addColorStop(0.45, "#1b2340"); gr.addColorStop(0.55, "#3a2c3e"); gr.addColorStop(1, "#0a0b0e"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
  sign: mk(1024, 384, (g) => {
    g.fillStyle = "#0f2a44"; g.fillRect(0, 0, 1024, 384);
    g.fillStyle = "#ff6b4a"; g.fillRect(0, 300, 1024, 84);
    g.fillStyle = "#fdf6e8"; g.font = "900 128px Montserrat, Arial Black, sans-serif"; g.textAlign = "center"; g.fillText("BIRD ROAD", 512, 150);
    g.font = "800 92px Montserrat, Arial, sans-serif"; g.fillStyle = "#ffd36b"; g.fillText("AUTO PLAZA", 512, 262);
    g.font = "800 50px Montserrat, Arial, sans-serif"; g.fillStyle = "#0f2a44"; g.fillText("SINCE 1971 · MIAMI", 512, 358);
  }),
  pad: mk(512, 640, (g) => {
    g.fillStyle = "#f7e27a"; g.fillRect(0, 0, 512, 640);
    g.strokeStyle = "rgba(60,110,190,.45)"; g.lineWidth = 2; for (let y = 90; y < 640; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
    g.strokeStyle = "rgba(200,60,60,.6)"; g.beginPath(); g.moveTo(60, 0); g.lineTo(60, 640); g.stroke();
    g.strokeStyle = "#1c2433"; g.lineWidth = 7; g.lineCap = "round";
    g.beginPath(); g.moveTo(256, 120); g.lineTo(258, 600); g.stroke(); g.beginPath(); g.moveTo(40, 360); g.lineTo(480, 356); g.stroke();
    g.fillStyle = "#1c2433"; g.font = "italic 700 38px Georgia, serif";
    g.fillText("PRICE", 90, 170); g.fillText("TRADE", 300, 170); g.fillText("DOWN", 90, 410); g.fillText("PAYMENT", 290, 410);
    g.font = "italic 700 46px Georgia, serif"; g.fillText("24,900", 80, 260); g.fillText("?", 350, 260); g.fillText("1,000", 90, 500); g.fillStyle = "#b3261e"; g.fillText("$489", 320, 500);
    g.strokeStyle = "#b3261e"; g.lineWidth = 4; g.beginPath(); g.ellipse(380, 485, 110, 52, -0.05, 0, 6.3); g.stroke();
  }),
  boat: mk(512, 384, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 384); gr.addColorStop(0, "#8ec5e6"); gr.addColorStop(0.6, "#d8eef7"); gr.addColorStop(0.62, "#2f7fb0"); gr.addColorStop(1, "#1c5a85"); g.fillStyle = gr; g.fillRect(0, 0, 512, 384);
    g.fillStyle = "#fbfbf7"; g.beginPath(); g.moveTo(250, 70); g.lineTo(250, 230); g.lineTo(150, 230); g.closePath(); g.fill(); g.beginPath(); g.moveTo(262, 90); g.lineTo(262, 230); g.lineTo(340, 230); g.closePath(); g.fill();
    g.fillStyle = "#7a3b22"; g.beginPath(); g.moveTo(140, 240); g.lineTo(360, 240); g.lineTo(330, 265); g.lineTo(165, 265); g.closePath(); g.fill();
    g.strokeStyle = "#b8893a"; g.lineWidth = 22; g.strokeRect(0, 0, 512, 384);
  }),
  menu: mk(512, 680, (g) => {
    g.fillStyle = "#fbf8f1"; g.fillRect(0, 0, 512, 680);
    const cols = [["PLATINUM", "#1c2433"], ["GOLD", "#b8893a"], ["PREFERRED", "#4b6a88"], ["BASIC", "#8a8a8a"]];
    cols.forEach(([n, c], i) => { g.fillStyle = c; g.fillRect(10 + i * 124, 30, 118, 60); g.fillStyle = "#fff"; g.font = "800 20px Montserrat, Arial"; g.textAlign = "center"; g.fillText(n, 69 + i * 124, 68);
      for (let r = 0; r < 9 - i * 2; r++) { g.fillStyle = "rgba(28,36,51,.7)"; g.fillRect(24 + i * 124, 120 + r * 50, 90, 8); g.fillStyle = "#2a8f5a"; g.fillRect(24 + i * 124, 136 + r * 50, 14, 14); } });
    g.fillStyle = "#b3261e"; g.font = "800 30px Montserrat, Arial"; g.textAlign = "center"; ["$612", "$571", "$538", "$489"].forEach((x, i) => g.fillText(x, 69 + i * 124, 640));
  }),
  rate: mk(256, 340, (g) => { g.fillStyle = "#f2efe8"; g.fillRect(0, 0, 256, 340); g.fillStyle = "rgba(40,40,40,.25)"; for (let r = 0; r < 18; r++) g.fillRect(20, 20 + r * 17, 200 - rnd(r, 2) * 60, 5); }),
  stripe: mk(64, 64, (g) => { g.fillStyle = "#f4f1e8"; g.fillRect(0, 0, 64, 64); }),
}), []);
type Tx = ReturnType<typeof useTex>;

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: THREE.Texture; rad?: number; rot?: V3; op?: number; tr?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1, tr = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    {tr > 0
      ? <meshPhysicalMaterial color={c} roughness={0.05} metalness={0} transmission={tr} transparent opacity={op} thickness={0.02} />
      : <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} />}
  </mesh>
);
const Plane: React.FC<{ p: V3; s: [number, number]; rot?: V3; map?: THREE.Texture; c?: string; r?: number; e?: number }> = ({ p, s, rot = [-Math.PI / 2, 0, 0], map, c = "#ffffff", r = 0.8, e = 0 }) => (
  <mesh position={p} rotation={rot} receiveShadow><planeGeometry args={s} /><meshStandardMaterial map={map} color={c} roughness={r} emissive={e ? "#ffffff" : "#000"} emissiveMap={e ? map : undefined} emissiveIntensity={e} /></mesh>
);
const CHROME = { color: "#e9edf0", metalness: 1, roughness: 0.15 };

// un auto (sedán o SUV) hecho de cajas redondeadas: carrocería, cabina de vidrio, ruedas, faros
const Car: React.FC<{ p: V3; ry?: number; col: string; suv?: boolean; tag?: string; tx?: Tx; night?: number }> = ({ p, ry = 0, col, suv = false, tag, night = 0 }) => {
  const L = suv ? 1.15 : 1.25, Wd = 0.5, hb = suv ? 0.3 : 0.24, hc = suv ? 0.26 : 0.2, y0 = 0.12;
  const tagTex = useMemo(() => tag ? mk(256, 128, (g) => { g.fillStyle = "#ffd23f"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1c2433"; g.font = "900 64px Montserrat, Arial Black"; g.textAlign = "center"; g.fillText(tag, 128, 90); }) : undefined, [tag]);
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box p={[0, y0 + hb / 2, 0]} s={[L, hb, Wd]} c={col} r={0.25} m={0.55} rad={0.08} />
      <Box p={[suv ? -0.04 : -0.05, y0 + hb + hc / 2 - 0.01, 0]} s={[suv ? L * 0.78 : L * 0.55, hc, Wd * 0.9]} c="#1a2129" r={0.08} m={0.3} rad={0.07} op={0.92} />
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b], i) => (
        <mesh key={i} position={[a * L * 0.33, y0, b * (Wd / 2 - 0.02)]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.11, 0.11, 0.09, 24]} /><meshStandardMaterial color="#141414" roughness={0.9} /></mesh>))}
      {[[-1], [1]].map(([b], i) => <Box key={i} p={[L / 2 + 0.001, y0 + hb * 0.7, b * 0.16]} s={[0.02, 0.05, 0.1]} c="#fff7e0" e="#fff1c4" ei={0.6 + 2 * night} r={0.2} rad={0.01} />)}
      {[[-1], [1]].map(([b], i) => <Box key={"r" + i} p={[-L / 2 - 0.001, y0 + hb * 0.7, b * 0.17]} s={[0.02, 0.04, 0.09]} c="#a01818" e="#ff2a2a" ei={0.3 + 1.5 * night} r={0.3} rad={0.01} />)}
      {tagTex && <Plane p={[suv ? L * 0.26 : L * 0.17, y0 + hb + hc * 0.55, 0]} s={[0.22, 0.11]} rot={[0, Math.PI / 2, 0]} map={tagTex} r={0.6} />}
    </group>
  );
};

const Palm: React.FC<{ p: V3; h?: number; t: number; i: number }> = ({ p, h = 2.6, t, i }) => (
  <group position={p}>
    {Array.from({ length: 10 }, (_, k) => <mesh key={k} position={[Math.sin(k * 0.3) * 0.04 * k / 10, (k + 0.5) * h / 10, 0]} castShadow><cylinderGeometry args={[0.07 - k * 0.003, 0.08 - k * 0.003, h / 10, 12]} /><meshStandardMaterial color={k % 2 ? "#8c7556" : "#7a6449"} roughness={0.95} /></mesh>)}
    {Array.from({ length: 9 }, (_, k) => { const a = (k / 9) * Math.PI * 2, sway = Math.sin(t * 0.8 + k + i) * 0.06;
      return <group key={k} position={[0.03, h, 0]} rotation={[0, a, -0.55 - 0.25 * rnd(k, i) + sway]}><mesh position={[0.45, 0, 0]} rotation={[0, 0, 0]} castShadow><boxGeometry args={[0.9, 0.012, 0.16]} /><meshStandardMaterial color={k % 2 ? "#3f7d3a" : "#4f8f43"} roughness={0.8} side={THREE.DoubleSide} /></mesh></group>; })}
  </group>
);

const Desk: React.FC<{ p: V3; ry?: number; top?: string; w?: number }> = ({ p, ry = 0, top = "#6b4a33", w = 0.9 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.74, 0]} s={[w, 0.04, 0.5]} c={top} r={0.4} rad={0.01} />
    <Box p={[w / 2 - 0.18, 0.37, 0]} s={[0.32, 0.72, 0.46]} c={top} r={0.6} rad={0.01} />
    <Box p={[-w / 2 + 0.03, 0.37, 0]} s={[0.04, 0.72, 0.46]} c={top} r={0.6} rad={0.01} />
  </group>
);
const Chair: React.FC<{ p: V3; ry?: number; c?: string }> = ({ p, ry = 0, c = "#e8e6e0" }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.44, 0]} s={[0.4, 0.04, 0.4]} c={c} r={0.5} rad={0.02} />
    <Box p={[0, 0.7, -0.19]} s={[0.4, 0.46, 0.04]} c={c} r={0.5} rad={0.02} />
    {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b], i) => <mesh key={i} position={[a * 0.17, 0.22, b * 0.17]}><cylinderGeometry args={[0.012, 0.012, 0.44, 8]} /><meshStandardMaterial {...CHROME} /></mesh>)}
  </group>
);

// ======================= EL MUNDO =======================
export const World: React.FC<{ t: number; keys: Key[]; ev: Ev }> = ({ t, keys, ev }) => {
  const tx = useTex();
  const night = onR(ev, t, "night", 1.2, 1.2), rain = onR(ev, t, "rain", 0.8, 0.8), sale = onR(ev, t, "sale", 0.6, 0.6);
  const drawer = onR(ev, t, "drawer", 0.6, 0.6), door = onR(ev, t, "door", 0.9, 0.9), keysGone = onR(ev, t, "keys", 0.4, 0.6);
  const padHi = onR(ev, t, "pad", 0.4, 0.5), papers = onR(ev, t, "papers", 0.5, 0.5);
  const signS = since(ev, t, "sign");
  const pq = (ev.padq || []).filter((x) => x.a <= t).pop();
  const day = 1 - night;
  const clockA = -t * 0.9;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} keys={keys} />
      <Post bloom={0.22 + 0.5 * night} threshold={0.9 - 0.2 * night} exposure={0.95 - 0.35 * night - 0.2 * rain} env={0.42 - 0.25 * night} />
      <color attach="background" args={[night > 0.5 ? "#0a0c12" : "#9fcbe8"]} />
      <mesh><sphereGeometry args={[60, 32, 16]} /><meshBasicMaterial map={night > 0.5 ? tx.skyN : tx.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xe3efff, 0x4a4136, 0.55 * day + 0.12]} />
      <directionalLight position={[-6, 10, 8]} intensity={2.1 * day * (1 - 0.6 * rain) + 0.05} color="#fff1d9" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0003} />
      {/* luces del showroom (siempre prendidas: de noche brilla como pecera) */}
      {[-2.2, -0.6, 1.0].map((x, i) => <pointLight key={i} position={[x, 2.3, -0.2]} intensity={1.4 + 1.6 * night} distance={4.5} color="#fff4e2" />)}
      <pointLight position={[3.6, 2.1, -0.6]} intensity={2.2} distance={3} color="#ffe2b8" castShadow />

      {/* ===== bloque de asfalto (maqueta) ===== */}
      <mesh position={[-0.5, -0.6, 1.0]} receiveShadow geometry={rbox(11.2, 1.2, 7.2, 0.03)}><meshStandardMaterial color="#5a544b" roughness={0.95} /></mesh>
      <Plane p={[-0.5, 0.003, 2.9]} s={[11.1, 3.4]} map={tx.asphalt} r={0.92} c="#8a8a8a" />
      {/* líneas del estacionamiento */}
      {Array.from({ length: 8 }, (_, i) => <Plane key={i} p={[-4.9 + i * 1.2, 0.006, 3.05]} s={[0.05, 1.6]} c="#f4f1e8" r={0.6} />)}
      {/* vereda + Bird Road */}
      <Box p={[-0.5, 0.03, 4.75]} s={[11.1, 0.06, 0.5]} c="#b9b2a5" r={0.9} rad={0.01} />
      <Plane p={[-0.5, 0.004, 5.9]} s={[11.1, 1.8]} c="#2f3134" r={0.9} />
      {Array.from({ length: 10 }, (_, i) => <Plane key={"y" + i} p={[-5.4 + i * 1.1, 0.007, 5.9]} s={[0.55, 0.06]} c="#e8c547" r={0.6} />)}

      {/* el cartel alto sobre Bird Road */}
      <group position={[-4.6, 0, 4.4]}>
        <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 2.8, 16]} /><meshStandardMaterial color="#5d6670" metalness={0.6} roughness={0.4} /></mesh>
        <Box p={[0, 3.2, 0]} s={[1.9, 0.75, 0.12]} c="#0f2a44" r={0.4} rad={0.03} />
        <Plane p={[0, 3.2, 0.065]} s={[1.84, 0.69]} rot={[0, 0, 0]} map={tx.sign} r={0.5} e={0.25 + 0.9 * night} />
      </group>
      <Palm p={[-5.5, 0, 3.6]} t={t} i={1} h={2.9} />
      <Palm p={[4.6, 0, 4.2]} t={t} i={2} h={2.5} />
      <Palm p={[-3.4, 0, 4.4]} t={t} i={3} h={2.3} />
      <Palm p={[3.2, 0, 4.45]} t={t} i={4} h={2.7} />

      {/* los autos del lote, con el precio en el parabrisas */}
      <Car p={[-4.2, 0, 3.0]} ry={-Math.PI / 2} col="#c9ced3" tag="$18,995" night={night} />
      <Car p={[-3.0, 0, 3.0]} ry={-Math.PI / 2} col="#7d1f22" suv tag="$27,450" night={night} />
      <Car p={[-1.8, 0, 3.0]} ry={-Math.PI / 2} col="#f2f0ea" tag="$24,900" night={night} />
      <Car p={[-0.6, 0, 3.0]} ry={-Math.PI / 2} col="#203a5c" suv tag="$31,200" night={night} />
      <Car p={[0.6, 0, 3.0]} ry={-Math.PI / 2} col="#3b3f44" tag="$21,750" night={night} />
      <Car p={[1.8, 0, 3.0]} ry={-Math.PI / 2} col="#9bb7cf" tag="$22,300" night={night} />
      {/* banderines (siempre) + globos en las ofertas */}
      {Array.from({ length: 22 }, (_, i) => { const x = -5.4 + i * 0.47, y = 1.65 - Math.sin((i / 21) * Math.PI) * 0.25;
        return <mesh key={i} position={[x, y + Math.sin(t * 3 + i) * 0.015, 2.1]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.07, 0.16, 3]} /><meshStandardMaterial color={["#ff6b4a", "#ffd23f", "#1fa39a", "#f4f1e8"][i % 4]} roughness={0.6} side={THREE.DoubleSide} /></mesh>; })}
      {sale > 0.01 && Array.from({ length: 7 }, (_, i) => <group key={i} position={[-4.6 + i * 1.1, 1.3 + sale * (0.6 + 0.1 * Math.sin(t * 2 + i)), 3.6]}>
        <mesh><sphereGeometry args={[0.12 * sale, 16, 12]} /><meshPhysicalMaterial color={["#ff3b3b", "#ffd23f", "#2b7de9"][i % 3]} roughness={0.2} clearcoat={1} /></mesh>
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.003, 0.003, 0.9, 4]} /><meshBasicMaterial color="#ddd" /></mesh></group>)}

      {/* ===== SHOWROOM ===== */}
      <Plane p={[-0.6, 0.012, 0.0]} s={[6.2, 3.2]} map={tx.showfloor} r={0.18} />
      <Box p={[-0.6, 1.35, -1.65]} s={[6.3, 2.7, 0.1]} c="#efe9de" map={tx.wall} r={0.8} rad={0.01} />
      <Box p={[-3.75, 1.35, 0]} s={[0.1, 2.7, 3.3]} c="#efe9de" map={tx.wall} r={0.8} rad={0.01} />
      {/* frente de vidrio con montantes */}
      <Box p={[-0.6, 1.35, 1.6]} s={[6.3, 2.7, 0.03]} c="#cfe6f3" tr={0.92} op={0.35} rad={0.005} />
      {Array.from({ length: 8 }, (_, i) => <Box key={i} p={[-3.7 + i * 0.885, 1.35, 1.6]} s={[0.05, 2.7, 0.06]} c="#9aa3ab" m={0.7} r={0.3} rad={0.005} />)}
      <Box p={[-0.6, 2.72, 0]} s={[6.4, 0.08, 3.4]} c="#d9d4ca" r={0.9} rad={0.01} op={0.18} />
      <Box p={[-0.6, 2.55, 1.62]} s={[6.3, 0.3, 0.08]} c="#0f2a44" r={0.5} rad={0.01} />
      {[-3.0, -1.6, 0.0, 1.4].map((x, i) => <Box key={"l" + i} p={[x, 2.66, -0.2]} s={[0.6, 0.03, 0.18]} c="#fffaf0" e="#fff3d6" ei={1.4} r={0.3} rad={0.005} />)}
      {/* autos de piso */}
      <Car p={[-2.4, 0.012, 0.4]} ry={0.5} col="#2a6fb0" night={0} />
      <Car p={[-1.0, 0.012, -0.4]} ry={-0.35} col="#c7372f" suv night={0} />
      {/* la torre del gerente */}
      <group position={[0.15, 0, -1.0]}>
        <Box p={[0, 0.3, 0]} s={[1.1, 0.6, 0.7]} c="#2b3440" r={0.6} rad={0.02} />
        <Box p={[0, 0.95, 0.15]} s={[1.0, 0.7, 0.08]} c="#3a4554" r={0.5} rad={0.02} />
        <Box p={[0, 1.32, 0]} s={[1.05, 0.04, 0.6]} c="#6b4a33" r={0.4} rad={0.01} />
        <Box p={[-0.3, 1.45, -0.05]} s={[0.28, 0.2, 0.03]} c="#1d2228" e="#7fb6ff" ei={0.3} r={0.3} rad={0.01} />
        <Box p={[0.3, 1.37, 0.05]} s={[0.16, 0.05, 0.1]} c="#141414" r={0.5} rad={0.01} />
      </group>
      {/* escritorios de vendedores + el bloc amarillo del four-square */}
      <Desk p={[1.2, 0, 0.45]} ry={0} />
      <Chair p={[1.2, 0, 1.05]} ry={Math.PI} />
      <Chair p={[1.55, 0, 1.05]} ry={Math.PI} c="#e2ded5" />
      <Chair p={[1.25, 0, -0.1]} ry={0} c="#2d2f33" />
      <group position={[PT.pad[0], 0.765, PT.pad[2]]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <mesh receiveShadow><planeGeometry args={[0.26, 0.33]} /><meshStandardMaterial map={tx.pad} roughness={0.9} emissive="#ffe27a" emissiveIntensity={0.25 * padHi} /></mesh>
        {pq && padHi > 0.01 && <mesh position={[pq.q % 2 ? 0.065 : -0.065, pq.q < 2 ? 0.07 : -0.08, 0.001]}><planeGeometry args={[0.12, 0.13]} /><meshBasicMaterial color="#ff6b4a" transparent opacity={0.35 * padHi} depthWrite={false} /></mesh>}
      </group>
      {/* las llaves del cliente (desaparecen = locking up the customer) */}
      {keysGone < 0.95 && <group position={[PT.keys[0], 0.77, PT.keys[2]]} scale={1 - keysGone}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.004, 8, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
        <Box p={[0.045, 0, 0.0]} s={[0.05, 0.012, 0.025]} c="#141414" r={0.4} rad={0.005} />
        <Box p={[-0.02, 0, 0.03]} s={[0.045, 0.004, 0.012]} c="#d8c06a" m={0.9} r={0.3} rad={0.002} />
      </group>}
      <Desk p={[-0.4, 0, 1.0]} ry={0.2} w={0.8} top="#5e4330" />
      <Chair p={[-0.4, 0, 1.45]} ry={Math.PI + 0.2} />
      {/* máquina de café + vasitos */}
      <group position={[-3.3, 0, -1.25]}>
        <Box p={[0, 0.45, 0]} s={[0.6, 0.9, 0.45]} c="#6b4a33" r={0.6} rad={0.01} />
        <Box p={[0, 1.08, -0.02]} s={[0.32, 0.36, 0.28]} c="#1d1f22" m={0.4} r={0.35} rad={0.02} />
        <Box p={[0.06, 1.13, 0.13]} s={[0.05, 0.04, 0.01]} c="#ff3b2f" e="#ff3b2f" ei={1.5} r={0.3} rad={0.003} />
        {[-0.18, -0.1].map((x, i) => <mesh key={i} position={[x, 0.95, 0.12]}><cylinderGeometry args={[0.03, 0.024, 0.08, 16]} /><meshStandardMaterial color="#f4f1e8" roughness={0.6} /></mesh>)}
      </group>
      {/* reloj de pared */}
      <group position={PT.clock}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.03, 32]} /><meshStandardMaterial color="#f8f6f0" roughness={0.5} /></mesh>
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, clockA]}><boxGeometry args={[0.012, 0.16, 0.005]} /><meshStandardMaterial color="#1c2433" /></mesh>
        <mesh position={[0, 0, 0.022]} rotation={[0, 0, clockA / 12]}><boxGeometry args={[0.018, 0.1, 0.005]} /><meshStandardMaterial color="#1c2433" /></mesh>
      </group>

      {/* ===== THE BOX (oficina F&I, sin ventanas) ===== */}
      <Plane p={[3.6, 0.014, -0.4]} s={[2.2, 2.6]} map={tx.carpet} r={0.95} />
      <Box p={[3.6, 1.35, -1.65]} s={[2.3, 2.7, 0.1]} c="#e7dfd0" map={tx.wall} r={0.85} rad={0.01} />
      <Box p={[4.7, 1.35, -0.4]} s={[0.1, 2.7, 2.6]} c="#e7dfd0" map={tx.wall} r={0.85} rad={0.01} />
      <Box p={[2.5, 1.35, -1.05]} s={[0.1, 2.7, 1.2]} c="#e7dfd0" map={tx.wall} r={0.85} rad={0.01} />
      <Box p={[2.5, 2.35, 0.15]} s={[0.1, 0.7, 1.2]} c="#e7dfd0" map={tx.wall} r={0.85} rad={0.01} />
      <Box p={[2.5, 1.35, 0.8]} s={[0.1, 2.7, 0.1]} c="#e7dfd0" r={0.85} rad={0.01} />
      {/* la puerta (se cierra en "door") */}
      <group position={[2.52, 0, -0.45]} rotation={[0, -door * Math.PI / 2, 0]}>
        <Box p={[0.55, 1.0, 0]} s={[1.08, 2.0, 0.05]} c="#7a5638" r={0.55} rad={0.01} />
        <mesh position={[1.0, 1.0, 0.04]}><sphereGeometry args={[0.03, 12, 10]} /><meshStandardMaterial color="#c9a35a" metalness={0.9} roughness={0.25} /></mesh>
        <Box p={[0.55, 1.6, 0.03]} s={[0.4, 0.12, 0.01]} c="#c9a35a" m={0.9} r={0.3} rad={0.005} />
      </group>
      <Plane p={[PT.boat[0], PT.boat[1], PT.boat[2]]} s={[0.7, 0.52]} rot={[0, 0, 0]} map={tx.boat} r={0.5} />
      <Desk p={[3.7, 0, -0.85]} ry={0} w={1.2} top="#4e3424" />
      <Chair p={[3.7, 0, -1.35]} ry={0} c="#2b2b2b" />
      <Chair p={[3.45, 0, -0.15]} ry={Math.PI} c="#5b3d2b" />
      <Chair p={[3.95, 0, -0.15]} ry={Math.PI} c="#5b3d2b" />
      {/* el cajón de arriba a la derecha (se abre) */}
      <group position={[4.12, 0.64, -0.85 + drawer * 0.32]}>
        <Box p={[0, 0, 0]} s={[0.3, 0.12, 0.44]} c="#5a3d2a" r={0.5} rad={0.01} />
        <Box p={[0, 0, 0.225]} s={[0.07, 0.02, 0.02]} c="#c9a35a" m={0.9} r={0.3} rad={0.005} />
        {drawer > 0.05 && <>
          <Plane p={[-0.04, 0.065, 0.02]} s={[0.17, 0.22]} map={tx.menu} r={0.8} />
          <Box p={[0.09, 0.07, -0.05]} s={[0.07, 0.015, 0.11]} c="#8f9399" r={0.5} rad={0.008} />
          <mesh position={[0.08, 0.072, 0.1]} rotation={[0, 0.3, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.13, 12]} /><meshStandardMaterial color="#d6b154" metalness={1} roughness={0.2} /></mesh>
        </>}
      </group>
      {/* sobre el escritorio F&I: contratos, lapicera dorada, calculadora gris, mentas, rate sheets boca abajo */}
      {Array.from({ length: 6 + Math.round(papers * 10) }, (_, i) => <Box key={i} p={[PT.papers[0] + rnd(i, 1) * 0.01, 0.765 + i * 0.004, PT.papers[2] + rnd(i, 2) * 0.01]} s={[0.21, 0.004, 0.28]} c="#fbf8f1" r={0.85} rad={0.001} cast={false} />)}
      <Plane p={[3.95, 0.763, -1.15]} s={[0.2, 0.26]} rot={[-Math.PI / 2, 0, 0.3]} map={tx.rate} r={0.9} />
      <Plane p={[4.05, 0.764, -1.12]} s={[0.2, 0.26]} rot={[-Math.PI / 2, 0, -0.15]} map={tx.rate} r={0.9} />
      <group position={[PT.calc[0], 0.775, PT.calc[2]]} rotation={[0, -0.2, 0]}>
        <Box p={[0, 0, 0]} s={[0.12, 0.02, 0.17]} c="#8f9399" r={0.5} rad={0.01} />
        <Box p={[0, 0.012, -0.05]} s={[0.09, 0.005, 0.035]} c="#a8b59a" e="#c8d8b0" ei={0.2} r={0.3} rad={0.003} />
      </group>
      <group position={[PT.pen[0] + (signS >= 0 ? Math.sin(signS * 9) * 0.03 : 0), 0.78 + (signS >= 0 ? 0.01 : 0), PT.pen[2]]} rotation={[0, 0.6, Math.PI / 2 - (signS >= 0 ? 0.5 : 0)]}>
        <mesh><cylinderGeometry args={[0.008, 0.006, 0.15, 14]} /><meshStandardMaterial color="#d6b154" metalness={1} roughness={0.18} /></mesh>
      </group>
      <group position={PT.mints}>
        <mesh><sphereGeometry args={[0.08, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshPhysicalMaterial color="#e6f2f6" transmission={0.8} roughness={0.05} transparent opacity={0.6} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.09, -0.04 + rnd(i, 3) * 0.03, (rnd(i, 2) - 0.5) * 0.09]}><sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#e8333a" : "#f6f6f6"} roughness={0.3} /></mesh>)}
      </group>

      {/* lluvia (Andrew, Irma) */}
      {rain > 0.01 && Array.from({ length: 260 }, (_, i) => { const u = (t * 2.6 + rnd(i, 1)) % 1;
        return <mesh key={i} position={[-5.8 + rnd(i, 2) * 10.6, 3.6 - u * 3.6, 1.8 + rnd(i, 3) * 4.0]} rotation={[0, 0, 0.25]}><boxGeometry args={[0.006, 0.2, 0.006]} /><meshBasicMaterial color="#cfe0f0" transparent opacity={0.45 * rain} depthWrite={false} /></mesh>; })}
    </ThreeCanvas>
  );
};
