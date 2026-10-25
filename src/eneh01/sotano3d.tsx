// Enzo (Enzo the HVAC Tech) · EL MUNDO: el sótano de ladrillo de un bungalow de Chicago en corte de casa de muñecas (frente y
// lado derecho abiertos, la tierra cortada a los costados), visto como maqueta. Adentro: el HORNO a gas en corte (la puerta de
// arriba se saca y queda apoyada; quemadores con llama azul que prende y se apaga, el SENSOR de llama que brilla, el encendedor
// naranja, el inductor que gira, el intercambiador de calor con la GRIETA marcada, el LED de la puerta de abajo que parpadea N
// veces, el filtro que se desliza), la llave del horno con tapa roja, la bomba de condensado, el ducto principal en corte con el
// aire tibio que corre, el termostato redondo de pared, el caño de cobre bajo la ventana que se escarcha y revienta, la escalera
// de madera con la lamparita, y el BANCO de Enzo (termo, servilleta, los 3 libritos, caja de habanos). Afuera, por la ventana:
// nieve, la camioneta blanca de Enzo y el bungalow de enfrente. Noche de invierno por defecto.
// UNA escena y UNA cámara (balanceo de mano). Cámara y eventos vienen de cam.json / ev.json (plan.py, at() sobre la voz).
// Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
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

// ---------------- transformaciones fijas (las repite views.py) ----------------
const FURN = [-1.6, 0, -3.3] as V3;          // centro de la base del horno; el frente mira a +z (cara en z = -2.9)
const GROUND = 1.9;                           // nivel del patio (el sótano asoma 1 m: ventanas arriba)
const VAN = [6.5, GROUND, -8.2] as V3;
const f = (l: V3): V3 => [FURN[0] + l[0], FURN[1] + l[1], FURN[2] + l[2]];

// ---------------- puntos del mundo ----------------
export const PT = {
  furn: f([0, 0.9, 0.4]),
  burner: f([0, 0.95, 0.25]),
  sensor: f([0.33, 1.0, 0.3]),
  ign: f([-0.34, 1.0, 0.3]),
  hx: f([0, 1.25, 0.15]),
  crack: f([-0.09, 1.28, 0.3]),
  ind: f([0.22, 1.36, 0.42]),
  led: f([0.2, 0.52, 0.41]),
  filter: f([-0.48, 0.4, 0]),
  sw: [-0.85, 1.35, -2.98] as V3,
  pump: [-0.9, 0.12, -2.65] as V3,
  duct: [1.5, 2.3, -3.3] as V3,
  thermo: [2.5, 1.5, -4.43] as V3,
  pipe: [1.8, 2.0, -4.33] as V3,
  window: [0.9, 2.33, -4.5] as V3,
  stairs: [4.0, 1.3, -2.2] as V3,
  bulb: [2.9, 2.3, -1.6] as V3,
  bench: [-5.3, 1.0, 0.4] as V3,
  thermos: [-5.3, 1.08, -0.45] as V3,
  napkin: [-5.2, 0.937, 0.2] as V3,
  books: [-5.35, 1.02, 0.95] as V3,
  cigar: [-5.25, 0.95, 1.5] as V3,
  van: [VAN[0], VAN[1] + 1.1, VAN[2]] as V3,
  vanside: [VAN[0], VAN[1] + 1.2, VAN[2] + 1.0] as V3,
  house: [0, GROUND + 3, -16] as V3,
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
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.01, 600); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t), m = manoCam(t, 1, 7);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l);
  cm.rotateY((m.pan * Math.PI) / 180); cm.rotateX((m.tilt * Math.PI) / 180); cm.rotateZ((m.roll * Math.PI) / 180);
  cm.fov = k.fov; cm.near = 0.01; cm.far = 600; cm.updateProjectionMatrix();
  return null;
};

// ---------------- eventos ----------------
// rangos: panel (puerta afuera), flame, sensor (brilla), dirty (sensor sucio), ign, ind, crack, heat (aire tibio), ice (escarcha),
// burst (chorro), filter (filtro afuera), sw (llave apagada), pump, lamp (lámpara del banco), books, napkin, vdoor (puerta de la van)
// kf: night (0 día → 1 noche), snow (0..1), tset / tnow (termostato), ice (0..1 grosor) · blink: [a, b, n]
const E = EV as unknown as Record<string, [number, number][]> & { blink?: [number, number, number][]; tset?: [number, number][]; tnow?: [number, number][]; night?: [number, number][]; snow?: [number, number][]; icek?: [number, number][] };
const onR = (t: number, k: string, fi = 0.5, fo = 0.5) => { for (const [a, b] of (E[k] as [number, number][]) || []) if (t >= a - fi && t < b + fo) return win(t, a - fi, a) * (1 - win(t, b, b + fo)); return 0; };
const kf = (t: number, pts: [number, number][] | undefined, d = 0) => {
  if (!pts || !pts.length) return d; if (t <= pts[0][0]) return pts[0][1];
  // cada llave arranca EN su frase: del valor anterior al suyo en 1,2 s
  for (let i = pts.length - 1; i > 0; i--) if (t >= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], sm(Math.min(1, (t - pts[i][0]) / 1.2)));
  return pts[0][1];
};

// ---------------- texturas (canvas, cacheadas por contenido) ----------------
const CACHE = new Map<string, THREE.CanvasTexture>();
const mk = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const hit = CACHE.get(key); if (hit) return hit;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8;
  CACHE.set(key, t); return t;
};
const thermoTex = (set: number, now: number) => mk(`th${set}|${now}`, 512, 512, (g) => {
  g.fillStyle = "#e9e4d8"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill();
  g.strokeStyle = "#b9b2a2"; g.lineWidth = 10; g.stroke();
  g.fillStyle = "#f7f4ec"; g.beginPath(); g.arc(256, 256, 200, 0, 6.3); g.fill();
  g.textAlign = "center"; g.fillStyle = "#333";
  for (let v = 50; v <= 90; v += 5) { const a = -Math.PI * 0.75 + ((v - 50) / 40) * Math.PI * 1.5; g.font = "800 30px Arial"; g.fillText(String(v), 256 + Math.sin(a) * 160, 266 - Math.cos(a) * 160); }
  const na = -Math.PI * 0.75 + ((now - 50) / 40) * Math.PI * 1.5;
  g.strokeStyle = "#222"; g.lineWidth = 6; g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + Math.sin(na) * 120, 256 - Math.cos(na) * 120); g.stroke();
  const sa = -Math.PI * 0.75 + ((set - 50) / 40) * Math.PI * 1.5;
  g.fillStyle = "#c62828"; g.beginPath(); g.moveTo(256 + Math.sin(sa) * 205, 256 - Math.cos(sa) * 205); g.lineTo(256 + Math.sin(sa - 0.08) * 235, 256 - Math.cos(sa - 0.08) * 235); g.lineTo(256 + Math.sin(sa + 0.08) * 235, 256 - Math.cos(sa + 0.08) * 235); g.fill();
  g.fillStyle = "#c62828"; g.font = "900 64px Arial"; g.fillText(`${Math.round(set)}°`, 256, 380);
  g.fillStyle = "#444"; g.beginPath(); g.arc(256, 256, 14, 0, 6.3); g.fill();
});
const vanTex = () => mk("van", 1024, 384, (g) => {
  g.clearRect(0, 0, 1024, 384); g.textAlign = "left";
  g.fillStyle = "#1d3f7a"; g.font = "900 96px Arial"; g.fillText("RUSSO", 40, 130);
  g.fillStyle = "#c62828"; g.font = "800 54px Arial"; g.fillText("HEATING & COOLING", 40, 200);
  g.fillStyle = "#1d3f7a"; g.font = "700 40px Arial"; g.fillText("Family owned · Since 1981", 40, 260);
  g.fillStyle = "#c62828"; g.fillRect(40, 290, 940, 12); g.fillStyle = "#1d3f7a"; g.fillRect(40, 310, 940, 12);
});
const stickerTex = () => mk("ledsticker", 256, 320, (g) => {
  g.fillStyle = "#f2efe4"; g.fillRect(0, 0, 256, 320); g.strokeStyle = "#333"; g.lineWidth = 4; g.strokeRect(4, 4, 248, 312);
  g.fillStyle = "#111"; g.font = "900 24px Arial"; g.fillText("LED CODES", 20, 40);
  g.font = "700 18px Courier New"; ["1 LOCKOUT", "2 PRESS SW", "3 VENT", "4 LIMIT", "5 FLAME"].forEach((l, i) => { g.fillText("●".repeat(i + 1), 20, 80 + i * 48); g.fillText(l.slice(2), 120, 80 + i * 48); });
});
const tex = () => ({
  brick: mk("brick", 512, 512, (g) => {
    g.fillStyle = "#b9b1a4"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 16; r++) for (let c = -1; c < 8; c++) { const x = c * 72 + (r % 2) * 36, y = r * 32; const v = rnd(r * 9 + c, 3);
      g.fillStyle = `rgb(${142 + v * 40},${66 + v * 22},${48 + v * 16})`; g.fillRect(x + 3, y + 3, 66, 26);
      if (rnd(r * 9 + c, 7) > 0.8) { g.fillStyle = "rgba(240,235,220,.25)"; g.fillRect(x + 3, y + 20, 66, 9); } }  // eflorescencia de sótano viejo
  }, [5, 2]),
  conc: mk("conc", 512, 512, (g) => {
    g.fillStyle = "#8e8b85"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) { const v = 110 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v - 3},${v - 8},.5)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    g.strokeStyle = "rgba(40,40,40,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(40, 200); g.lineTo(190, 260); g.lineTo(330, 240); g.stroke();
    g.fillStyle = "rgba(70,60,50,.18)"; g.beginPath(); g.ellipse(360, 380, 110, 60, 0.3, 0, 6.3); g.fill();  // mancha de agua vieja
  }, [5, 4]),
  wood: mk("wood", 256, 512, (g) => {
    g.fillStyle = "#a27d52"; g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(90,60,30,${0.15 + rnd(i, 2) * 0.25})`; g.lineWidth = 1 + rnd(i, 3) * 3; g.beginPath(); const x = rnd(i, 1) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 10, 170, x - 12, 340, x + 4, 512); g.stroke(); }
  }),
  dirt: mk("dirt", 512, 512, (g) => {
    g.fillStyle = "#5b4330"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) { const v = rnd(i, 1); g.fillStyle = v > 0.85 ? "#8a7a68" : `rgba(${60 + v * 40},${42 + v * 25},${28 + v * 18},.9)`; g.beginPath(); g.arc(rnd(i, 2) * 512, rnd(i, 3) * 512, 1 + rnd(i, 4) * 5, 0, 6.3); g.fill(); }
  }, [3, 1]),
  peg: mk("peg", 256, 256, (g) => { g.fillStyle = "#c9a878"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#6b5236"; for (let y = 8; y < 256; y += 21) for (let x = 8; x < 256; x += 21) { g.beginPath(); g.arc(x, y, 3, 0, 6.3); g.fill(); } }, [3, 2]),
  hbrick: mk("hbrick", 512, 512, (g) => {
    g.fillStyle = "#6e3a2a"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 24; r++) for (let c = -1; c < 12; c++) { const v = rnd(r * 13 + c, 5); g.fillStyle = `rgb(${120 + v * 40},${55 + v * 20},${38 + v * 12})`; g.fillRect(c * 48 + (r % 2) * 24 + 2, r * 21 + 2, 44, 17); }
  }, [3, 2]),
});

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rot?: V3; m?: number; ro?: number; e?: string; ei?: number; seg?: number }> = ({ p, r, h, c, rot, m = 0, ro = 0.6, e, ei = 0, seg = 20 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r, h, seg]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const GALV = "#b8bec2", COPPER = "#c47a45";

// el horno en corte: gabinete beige sin la tapa de adelante del cuerpo de arriba (se ve adentro)
const Furnace: React.FC<{ t: number; panel: number; flame: number; sensor: number; dirty: number; ign: number; ind: number; crack: number; filter: number; led: boolean; sw: number }> = ({ t, panel, flame, sensor, dirty, ign, ind, crack, filter, led, sw }) => {
  const BEIGE = "#d9cfb8", ON = flame * (1 - sw);
  return (
    <group position={FURN}>
      {/* gabinete: lados, fondo, techo; el frente de abajo (puerta del ventilador) queda puesto */}
      <Box p={[-0.45, 0.75, 0]} s={[0.03, 1.5, 0.8]} c={BEIGE} r={0.45} m={0.3} rad={0.008} />
      <Box p={[0.45, 0.75, 0]} s={[0.03, 1.5, 0.8]} c={BEIGE} r={0.45} m={0.3} rad={0.008} />
      <Box p={[0, 0.75, -0.39]} s={[0.9, 1.5, 0.03]} c="#bdb39c" r={0.6} m={0.3} rad={0.008} />
      <Box p={[0, 0.06, 0]} s={[0.92, 0.12, 0.82]} c="#7d7666" r={0.7} m={0.3} rad={0.01} />
      <Box p={[0, 0.39, 0.39]} s={[0.88, 0.66, 0.025]} c={BEIGE} r={0.45} m={0.3} rad={0.008} />
      <mesh position={[0.3, 0.6, 0.404]}><planeGeometry args={[0.16, 0.2]} /><meshStandardMaterial map={stickerTex()} roughness={0.6} /></mesh>
      {/* ventanita del LED */}
      <Box p={[0.2, 0.52, 0.4]} s={[0.06, 0.04, 0.01]} c="#0d120e" r={0.2} />
      <mesh position={[0.2, 0.52, 0.407]}><circleGeometry args={[0.009, 16]} /><meshBasicMaterial color={led ? "#59ff7a" : "#1d3a22"} toneMapped={false} /></mesh>
      {led && <pointLight position={[0.2, 0.52, 0.45]} intensity={0.6} distance={0.5} color="#59ff7a" />}
      {/* separador + quemadores (4 tubos) */}
      <Box p={[0, 0.8, 0]} s={[0.86, 0.025, 0.76]} c="#6f6a60" r={0.6} m={0.5} />
      <Cyl p={[0, 0.9, 0.26]} r={0.018} h={0.8} c="#222" rot={[0, 0, Math.PI / 2]} m={0.7} ro={0.4} />{/* múltiple de gas */}
      {[-0.27, -0.09, 0.09, 0.27].map((x, i) => <group key={i}>
        <Cyl p={[x, 0.93, 0.1]} r={0.03} h={0.3} c="#5d5a55" rot={[Math.PI / 2, 0, 0]} m={0.7} ro={0.45} />
        {ON > 0.01 && <mesh position={[x, 0.95 + 0.07 * ON, -0.04]} rotation={[-Math.PI / 2 + 0.35, 0, 0]}><coneGeometry args={[0.028, 0.16 * ON * (1 + 0.12 * Math.sin(t * 23 + i * 2)), 14, 1, true]} /><meshBasicMaterial color="#5aa8ff" transparent opacity={0.85 * ON} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
        {ON > 0.01 && <mesh position={[x, 0.97 + 0.07 * ON, -0.06]} rotation={[-Math.PI / 2 + 0.35, 0, 0]}><coneGeometry args={[0.014, 0.11 * ON, 10, 1, true]} /><meshBasicMaterial color="#d6ecff" transparent opacity={0.9 * ON} toneMapped={false} depthWrite={false} /></mesh>}
      </group>)}
      {ON > 0.01 && <pointLight position={[0, 1.0, 0]} intensity={1.1 * ON} distance={1.4} color="#7ab8ff" />}
      {/* sensor de llama (varilla) y encendedor */}
      <group position={[0.33, 1.0, 0.3]} rotation={[0.4, 0, 0]}>
        <Cyl p={[0, 0, 0]} r={0.004} h={0.12} c={dirty > 0.5 ? "#4a3d2a" : "#c9c9c9"} m={0.9} ro={0.25} e="#ffd60a" ei={1.4 * sensor} seg={8} />
        <Box p={[0, 0.07, 0]} s={[0.03, 0.025, 0.02]} c="#e6e1d6" r={0.5} />
        {sensor > 0.01 && <mesh><sphereGeometry args={[0.02, 16, 12]} /><meshBasicMaterial color="#ffd60a" transparent opacity={0.3 * sensor} toneMapped={false} depthWrite={false} /></mesh>}
      </group>
      <group position={[-0.34, 1.0, 0.3]} rotation={[0.4, 0, 0]}>
        <Box p={[0, 0, 0]} s={[0.012, 0.06, 0.02]} c={ign > 0.05 ? "#ff7a1a" : "#7c6a55"} e="#ff6a00" ei={3.5 * ign} r={0.5} />
        <Box p={[0, 0.05, 0]} s={[0.03, 0.03, 0.025]} c="#e6e1d6" r={0.5} />
        {ign > 0.05 && <pointLight intensity={1.4 * ign} distance={0.7} color="#ff8a2a" />}
      </group>
      {/* intercambiador: 4 "almejas" de acero sobre los quemadores; la grieta brilla en rojo */}
      {[-0.27, -0.09, 0.09, 0.27].map((x, i) => <mesh key={i} position={[x, 1.25, 0.05]} castShadow geometry={rbox(0.16, 0.42, 0.5, 0.07)}><meshStandardMaterial color={i === 1 && crack > 0.01 ? "#7a6a60" : "#6f7275"} metalness={0.75} roughness={0.42} /></mesh>)}
      {crack > 0.01 && <group position={[-0.09, 1.28, 0.305]}>
        {[[0, 0, 0.5], [0.025, -0.06, -0.3], [-0.02, -0.11, 0.6]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0]} rotation={[0, 0, r]}><planeGeometry args={[0.008, 0.07 * crack]} /><meshBasicMaterial color="#ff3b2a" toneMapped={false} /></mesh>)}
        <mesh><ringGeometry args={[0.1, 0.115, 40]} /><meshBasicMaterial color="#ff3b2a" transparent opacity={crack * (0.6 + 0.4 * Math.sin(t * 6))} toneMapped={false} /></mesh>
      </group>}
      {/* inductor: motor + rueda que gira, y el caño de humos */}
      <group position={[0.22, 1.36, 0.36]}>
        <Cyl p={[0, 0, 0]} r={0.09} h={0.08} c="#2b2d30" rot={[Math.PI / 2, 0, 0]} m={0.4} ro={0.5} />
        <group position={[0, 0, 0.045]} rotation={[0, 0, t * 30 * ind]}>{Array.from({ length: 8 }, (_, k) => <mesh key={k} rotation={[0, 0, (k / 8) * Math.PI * 2]} position={[Math.cos((k / 8) * 6.283) * 0.04, Math.sin((k / 8) * 6.283) * 0.04, 0]}><boxGeometry args={[0.05, 0.008, 0.005]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} /></mesh>)}</group>
        <Cyl p={[-0.12, 0.02, -0.02]} r={0.05} h={0.08} c="#1d1d1d" rot={[0, 0, Math.PI / 2]} m={0.3} />
      </group>
      {/* techo y plenum de impulsión */}
      <Box p={[0, 1.51, 0]} s={[0.92, 0.03, 0.82]} c={BEIGE} r={0.45} m={0.3} rad={0.008} />
      <Box p={[0, 1.8, -0.02]} s={[0.86, 0.55, 0.76]} c={GALV} m={0.85} r={0.35} rad={0.01} />
      <Cyl p={[0.22, 2.05, -0.2]} r={0.07} h={1.0} c={GALV} m={0.85} ro={0.3} />
      {/* filtro: entra por el costado izquierdo */}
      <group position={[-0.48 - 0.55 * filter, 0.4, 0]}>
        <Box p={[0, 0, 0]} s={[0.03, 0.55, 0.72]} c="#e8e2d0" r={0.9} rad={0.004} />
        <mesh position={[-0.017, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.68, 0.5]} /><meshStandardMaterial color={dirty > 0.5 ? "#6b5e4a" : "#efe9d9"} roughness={1} /></mesh>
      </group>
      {/* la tapa del cuerpo de arriba: puesta o apoyada en el piso */}
      <group position={[lerp(0, -0.95, panel), lerp(1.15, 0.38, panel), lerp(0.405, 0.85, panel)]} rotation={[lerp(0, -0.22, panel), lerp(0, 0.5, panel), 0]}>
        <Box p={[0, 0, 0]} s={[0.88, 0.68, 0.025]} c={BEIGE} r={0.45} m={0.3} rad={0.008} op={1} />
        {Array.from({ length: 5 }, (_, k) => <Box key={k} p={[-0.25, 0.2 - k * 0.04, 0.014]} s={[0.25, 0.012, 0.005]} c="#5e5848" r={0.6} />)}
      </group>
      {/* caño de gas negro con la llave amarilla */}
      <Cyl p={[0.55, 0.9, 0.26]} r={0.018} h={0.25} c="#222" rot={[0, 0, Math.PI / 2]} m={0.7} ro={0.4} />
      <Cyl p={[0.68, 1.45, 0.26]} r={0.018} h={1.15} c="#222" m={0.7} ro={0.4} />
      <Box p={[0.68, 1.1, 0.31]} s={[0.12, 0.025, 0.03]} c="#f2c230" r={0.4} />
    </group>
  );
};

const Van: React.FC<{ door: number; night: number }> = ({ door, night }) => (
  <group position={VAN} rotation={[0, 0, 0]}>
    <mesh position={[0, 1.15, 0]} castShadow receiveShadow geometry={rbox(4.8, 1.9, 2.0, 0.12)}><meshPhysicalMaterial color="#f4f4f1" roughness={0.35} metalness={0.2} clearcoat={0.8} /></mesh>
    <mesh position={[2.75, 0.95, 0]} castShadow geometry={rbox(0.9, 1.5, 1.96, 0.18)}><meshPhysicalMaterial color="#f4f4f1" roughness={0.35} metalness={0.2} clearcoat={0.8} /></mesh>
    <Box p={[2.95, 1.4, 0]} s={[0.5, 0.6, 1.8]} c="#1a2430" r={0.05} m={0.6} />
    <mesh position={[0, 1.25, 1.005]}><planeGeometry args={[3.9, 1.46]} /><meshStandardMaterial map={vanTex()} transparent roughness={0.4} /></mesh>
    {/* escalera en el techo */}
    {[-0.6, 0.6].map((z, i) => <Cyl key={i} p={[0, 2.2, z]} r={0.025} h={4.2} c="#9aa0a6" rot={[0, 0, Math.PI / 2]} m={0.9} ro={0.3} />)}
    {Array.from({ length: 9 }, (_, k) => <Cyl key={k} p={[-1.9 + k * 0.48, 2.2, 0]} r={0.018} h={1.2} c="#9aa0a6" rot={[Math.PI / 2, 0, 0]} m={0.9} ro={0.3} />)}
    {[[1.9, 1.0], [1.9, -1.0], [-1.5, 1.0], [-1.5, -1.0]].map(([x, z], i) => <group key={i} position={[x, 0.36, z]} rotation={[Math.PI / 2, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.36, 0.36, 0.26, 28]} /><meshStandardMaterial color="#141414" roughness={0.85} /></mesh></group>)}
    {/* puerta trasera que se abre (estanterías con repuestos adentro) */}
    <group position={[-2.42, 1.15, 0.98]} rotation={[0, 1.6 * door, 0]}><mesh position={[0, 0, -0.49]} geometry={rbox(0.05, 1.8, 0.96, 0.02)}><meshStandardMaterial color="#efefec" roughness={0.4} /></mesh></group>
    {door > 0.01 && [0.5, 1.0, 1.5].map((y, i) => <Box key={i} p={[-2.1, y, 0.4]} s={[0.5, 0.04, 1.0]} c="#7c7f84" m={0.6} r={0.4} />)}
    {door > 0.01 && Array.from({ length: 9 }, (_, k) => <Box key={"b" + k} p={[-2.1, 0.58 + Math.floor(k / 3) * 0.5, 0.05 + (k % 3) * 0.32]} s={[0.25, 0.12, 0.22]} c={["#c62828", "#1d3f7a", "#e0a43a"][k % 3]} r={0.7} />)}
    <Box p={[3.21, 0.75, 0.7]} s={[0.04, 0.16, 0.3]} c="#fffbe6" e="#fff2c0" ei={0.5 + 2 * night} r={0.2} />
    <Box p={[3.21, 0.75, -0.7]} s={[0.04, 0.16, 0.3]} c="#fffbe6" e="#fff2c0" ei={0.5 + 2 * night} r={0.2} />
  </group>
);

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useMemo(tex, []);
  const night = kf(t, E.night, 1);
  const snow = kf(t, E.snow, 0.6);
  const panel = onR(t, "panel", 0.8, 0.8);
  const flame = onR(t, "flame", 0.35, 0.4);
  const sensor = onR(t, "sensor", 0.3, 0.3);
  const dirty = onR(t, "dirty", 0.05, 0.05);
  const ign = onR(t, "ign", 0.15, 0.2);
  const ind = Math.max(onR(t, "ind", 0.6, 0.8), flame);
  const crack = onR(t, "crack", 0.5, 0.5);
  const heat = onR(t, "heat", 0.8, 0.8);
  const filter = onR(t, "filter", 0.8, 0.8);
  const sw = onR(t, "sw", 0.2, 0.2);
  const pump = onR(t, "pump", 0.3, 0.3);
  const lamp = Math.max(0.15, onR(t, "lamp", 0.4, 0.4));
  const books = onR(t, "books", 0.4, 0.4);
  const napkin = onR(t, "napkin", 0.3, 0.3);
  const vdoor = onR(t, "vdoor", 0.7, 0.7);
  const burst = onR(t, "burst", 0.1, 0.6);
  const ice = Math.max(onR(t, "ice", 1.2, 0.8), kf(t, E.icek, 0));
  const bl = (E.blink || []).find(([a, b]) => t >= a && t < b);
  let led = true;
  if (bl) { const n = bl[2], cyc = n * 0.6 + 1.4, u = ((t - bl[0]) % cyc + cyc) % cyc; led = u < n * 0.6 && (u % 0.6) < 0.32; }
  const thermo = thermoTex(Math.round(kf(t, E.tset, 68)), Math.round(kf(t, E.tnow, 68)));
  const sky = new THREE.Color("#a9c4d8").lerp(new THREE.Color("#0b1220"), night);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35 + 0.25 * night} threshold={0.9} exposure={0.95 - 0.1 * night} env={0.3 - 0.1 * night} />
      <color attach="background" args={[sky.getStyle()]} />
      <mesh><sphereGeometry args={[300, 32, 16]} /><meshBasicMaterial color={sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xdfe8f2, 0x3a2e24, 0.28 + 0.4 * (1 - night)]} />
      <directionalLight position={[8, 14, 10]} intensity={0.3 + 1.6 * (1 - night)} color={night > 0.5 ? "#9fb6d8" : "#fff1d8"} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} />
      {/* la lamparita de la escalera (bombita pelada con cadenita) y la del banco */}
      <group position={PT.bulb}>
        <Cyl p={[0, 0.2, 0]} r={0.004} h={0.4} c="#333" />
        <mesh><sphereGeometry args={[0.06, 20, 14]} /><meshStandardMaterial color="#fff5d6" emissive="#ffdca0" emissiveIntensity={2.2} /></mesh>
        <pointLight intensity={6} distance={9} color="#ffd9a0" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      </group>
      <pointLight position={[-4.9, 1.7, 0.3]} intensity={5 * lamp} distance={4} color="#ffe2b0" />
      <spotLight position={[0.5, 2.4, 0.6]} angle={0.55} penumbra={0.85} intensity={10} distance={6} color="#fff0dc" target-position={PT.furn} />

      {/* ===== EL SÓTANO ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow><planeGeometry args={[12, 9]} /><meshStandardMaterial map={tx.conc} roughness={0.92} /></mesh>
      <Box p={[0, -0.15, 0]} s={[12.2, 0.3, 9.2]} c="#6d6a64" r={0.95} rad={0.02} />
      <Box p={[0, 1.45, -4.55]} s={[12.2, 2.9, 0.2]} c="#ffffff" map={tx.brick} r={0.9} rad={0.01} />
      <Box p={[-6.05, 1.45, 0]} s={[0.2, 2.9, 9.2]} c="#ffffff" map={tx.brick} r={0.9} rad={0.01} />
      {/* la ventana del sótano (arriba, a nivel del patio) con nieve contra el vidrio */}
      <Box p={[PT.window[0], PT.window[1], -4.43]} s={[1.1, 0.55, 0.06]} c="#e9e6df" r={0.6} />
      <mesh position={[PT.window[0], PT.window[1], -4.39]}><planeGeometry args={[0.98, 0.43]} /><meshStandardMaterial color="#1a2a40" emissive="#2b4870" emissiveIntensity={0.6 + 0.4 * (1 - night)} roughness={0.1} /></mesh>
      <mesh position={[PT.window[0], PT.window[1] - 0.17, -4.4]}><planeGeometry args={[0.98, 0.1 + 0.08 * snow]} /><meshStandardMaterial color="#f4f7fa" roughness={0.9} /></mesh>
      {snow > 0.01 && Array.from({ length: 24 }, (_, i) => { const u = (t * 0.18 + rnd(i, 6)) % 1; return <mesh key={"w" + i} position={[PT.window[0] - 0.45 + rnd(i, 7) * 0.9, PT.window[1] + 0.2 - u * 0.36, -4.37]}><circleGeometry args={[0.008, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * snow} /></mesh>; })}
      {/* vigas del techo + piso de arriba */}
      {Array.from({ length: 14 }, (_, k) => <Box key={k} p={[-5.6 + k * 0.85, 2.72, -1.5]} s={[0.06, 0.26, 6.2]} c="#9d7b55" map={tx.wood} r={0.85} rad={0.004} />)}
      <Box p={[0, 2.9, -1.5]} s={[12.2, 0.08, 6.2]} c="#8d6c4a" map={tx.wood} r={0.9} rad={0.004} />
      {/* columna de acero */}
      <Cyl p={[1.2, 1.3, -0.8]} r={0.06} h={2.6} c="#5a3c32" m={0.6} ro={0.5} />
      {/* ducto principal en corte (tapa de adelante abierta: se ve el aire tibio que corre) */}
      <Box p={[1.8, 2.36, -3.45]} s={[6.2, 0.36, 0.04]} c={GALV} m={0.85} r={0.32} />
      <Box p={[1.8, 2.54, -3.3]} s={[6.2, 0.04, 0.34]} c={GALV} m={0.85} r={0.32} />
      <Box p={[1.8, 2.18, -3.3]} s={[6.2, 0.04, 0.34]} c={GALV} m={0.85} r={0.32} />
      <Box p={[-1.6, 2.36, -3.3]} s={[0.86, 0.36, 0.34]} c={GALV} m={0.85} r={0.32} />
      {[0.4, 2.0, 3.6].map((x, i) => <Cyl key={i} p={[x, 2.62, -2.6]} r={0.08} h={0.12} c={GALV} m={0.85} ro={0.3} />)}
      {[0.4, 2.0, 3.6].map((x, i) => <Cyl key={"r" + i} p={[x, 2.54, -2.95]} r={0.08} h={0.7} c={GALV} m={0.85} ro={0.3} rot={[Math.PI / 2, 0, 0]} />)}
      {heat > 0.01 && Array.from({ length: 46 }, (_, i) => { const u = (t * 0.45 + rnd(i, 1)) % 1; return <mesh key={i} position={[-1.2 + u * 6.0, 2.24 + rnd(i, 2) * 0.24, -3.3 + (rnd(i, 3) - 0.5) * 0.2]}><sphereGeometry args={[0.02 + 0.015 * rnd(i, 4), 8, 6]} /><meshBasicMaterial color="#ff9a4a" transparent opacity={heat * (0.75 - 0.5 * u)} toneMapped={false} depthWrite={false} /></mesh>; })}
      {heat > 0.01 && <pointLight position={[1.5, 2.36, -3.1]} intensity={1.6 * heat} distance={3.5} color="#ff9a4a" />}

      <Furnace t={t} panel={panel} flame={flame} sensor={sensor} dirty={dirty} ign={ign} ind={ind} crack={crack} filter={filter} led={led} sw={sw} />
      {/* llave del horno: caja con tapa roja en el poste */}
      <Box p={[-0.85, 1.3, -3.05]} s={[0.08, 2.6, 0.08]} c="#9d7b55" map={tx.wood} r={0.85} />
      <group position={PT.sw}>
        <Box p={[0, 0, 0]} s={[0.12, 0.18, 0.02]} c="#c62828" r={0.4} rad={0.008} />
        <Box p={[0, 0.03 - 0.06 * sw, 0.018]} s={[0.025, 0.05, 0.02]} c="#f2f2ef" r={0.3} rot={[0.5 - 1.0 * sw, 0, 0]} />
        {sw > 0.01 && <mesh position={[0, 0, 0.02]}><ringGeometry args={[0.14, 0.16, 40]} /><meshBasicMaterial color="#ffd60a" transparent opacity={sw} toneMapped={false} /></mesh>}
      </group>
      {/* bomba de condensado (con limo verde adentro cuando hay evento) */}
      <group position={PT.pump}>
        <Box p={[0, 0, 0]} s={[0.26, 0.16, 0.16]} c="#f0eee8" r={0.5} rad={0.02} />
        <mesh position={[0, 0.05, 0.081]}><planeGeometry args={[0.2, 0.06]} /><meshStandardMaterial color={pump > 0.3 ? "#5f8a3a" : "#dce6ea"} transparent opacity={0.85} /></mesh>
        <Cyl p={[0.05, 1.0, -0.05]} r={0.008} h={1.8} c="#e8f2f2" ro={0.3} />
        {pump > 0.01 && <mesh position={[0, 0, 0]}><ringGeometry args={[0.2, 0.22, 40]} /><meshBasicMaterial color="#ffd60a" transparent opacity={pump} toneMapped={false} side={THREE.DoubleSide} /></mesh>}
      </group>
      {/* termostato redondo en la pared del fondo */}
      <group position={PT.thermo}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.035, 40]} /><meshStandardMaterial color="#d9d3c4" roughness={0.5} /></mesh>
        <mesh position={[0, 0, 0.019]}><circleGeometry args={[0.095, 40]} /><meshStandardMaterial map={thermo} roughness={0.4} /></mesh>
      </group>
      {/* el caño de cobre bajo la ventana: escarcha que crece y el chorro cuando revienta */}
      <Cyl p={[1.3, 2.0, -4.33]} r={0.016} h={3.2} c={COPPER} rot={[0, 0, Math.PI / 2]} m={0.9} ro={0.3} />
      <Cyl p={[2.9, 1.0, -4.33]} r={0.016} h={2.0} c={COPPER} m={0.9} ro={0.3} />
      {ice > 0.01 && <mesh position={[1.3, 2.0, -4.33]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.016 + 0.03 * ice, 0.016 + 0.03 * ice, 3.2, 18]} /><meshPhysicalMaterial color="#e8f6ff" roughness={0.35} transmission={0.4} transparent opacity={0.55 * ice} /></mesh>}
      {ice > 0.2 && Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0.0 + i * 0.24, 1.97 - 0.04 * ice, -4.32]}><coneGeometry args={[0.008, 0.06 + 0.08 * ice * rnd(i, 2), 6]} /><meshPhysicalMaterial color="#eef8ff" roughness={0.2} transparent opacity={0.8 * ice} /></mesh>)}
      {burst > 0.01 && Array.from({ length: 70 }, (_, i) => { const u = (t * 2.2 + rnd(i, 1)) % 1; return <mesh key={i} position={[PT.pipe[0] + u * (0.9 * rnd(i, 2) - 0.2), PT.pipe[1] + u * 0.5 - u * u * 1.6, PT.pipe[2] + u * (0.6 + 0.6 * rnd(i, 3))]}><sphereGeometry args={[0.012, 6, 5]} /><meshBasicMaterial color="#cfe9ff" transparent opacity={burst * (1 - u) * 0.9} depthWrite={false} /></mesh>; })}
      {burst > 0.3 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.9, 0.004, -3.8]}><circleGeometry args={[0.4 + 0.9 * burst, 40]} /><meshPhysicalMaterial color="#6f8796" roughness={0.04} transparent opacity={0.55} /></mesh>}

      {/* la escalera de madera (sube hacia el fondo) */}
      {Array.from({ length: 12 }, (_, k) => <Box key={k} p={[4.0, 0.2 + k * 0.225, -0.2 - k * 0.33]} s={[1.0, 0.04, 0.3]} c="#a27d52" map={tx.wood} r={0.8} rad={0.006} />)}
      {[3.48, 4.52].map((x, i) => <Box key={i} p={[x, 1.45, -2.0]} s={[0.05, 0.28, 4.6]} c="#8d6c4a" map={tx.wood} r={0.85} rot={[0.6, 0, 0]} />)}
      <Box p={[3.45, 1.95, -2.0]} s={[0.04, 0.04, 4.0]} c="#6b4f33" r={0.6} rot={[0.6, 0, 0]} />

      {/* ===== EL BANCO DE ENZO ===== */}
      <group>
        <Box p={[-5.35, 0.9, 0.4]} s={[0.9, 0.06, 2.6]} c="#8d6c4a" map={tx.wood} r={0.8} rad={0.01} />
        {[[-5.7, -0.8], [-5.0, -0.8], [-5.7, 1.6], [-5.0, 1.6]].map(([x, z], i) => <Box key={i} p={[x, 0.44, z]} s={[0.07, 0.88, 0.07]} c="#6b4f33" r={0.8} />)}
        <Box p={[-5.9, 1.6, 0.4]} s={[0.03, 1.1, 2.4]} c="#ffffff" map={tx.peg} r={0.9} />
        {/* herramientas colgadas */}
        {[[-0.5, "#c62828"], [-0.2, "#1d3f7a"], [0.15, "#e0a43a"], [0.5, "#333"], [0.9, "#c62828"], [1.3, "#2b8a57"]].map(([z, c], i) => <Box key={i} p={[-5.86, 1.55 + rnd(i, 2) * 0.3, 0.4 + (z as number)]} s={[0.04, 0.32, 0.05]} c={c as string} r={0.5} m={0.3} />)}
        {/* lámpara de banco */}
        <Cyl p={[-5.6, 1.15, 1.75]} r={0.012} h={0.5} c="#2b2d30" rot={[0, 0, 0.3]} />
        <mesh position={[-5.5, 1.42, 1.65]} rotation={[0.5, 0, -0.6]}><coneGeometry args={[0.12, 0.16, 20, 1, true]} /><meshStandardMaterial color="#2a5a3a" side={THREE.DoubleSide} emissive="#ffe2b0" emissiveIntensity={0.4 * lamp} /></mesh>
        {/* el termo abollado y su tapa-taza */}
        <group position={PT.thermos}>
          <Cyl p={[0, 0, 0]} r={0.055} h={0.3} c="#8a9aa0" m={0.8} ro={0.35} />
          <Cyl p={[0, 0.18, 0]} r={0.045} h={0.06} c="#2f4a3a" ro={0.5} />
          <Cyl p={[0.16, -0.11, 0.05]} r={0.045} h={0.08} c="#2f4a3a" ro={0.5} />
        </group>
        {/* la servilleta con números */}
        <group position={PT.napkin} rotation={[-Math.PI / 2, 0, 0.3 + 0.2 * napkin]}>
          <mesh><planeGeometry args={[0.24, 0.24]} /><meshStandardMaterial color="#fbfaf5" roughness={1} emissive="#fff6d0" emissiveIntensity={0.25 * napkin} /></mesh>
          {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.02 + 0.02 * rnd(i, 3), 0.07 - i * 0.035, 0.001]}><planeGeometry args={[0.12 + 0.06 * rnd(i, 2), 0.006]} /><meshBasicMaterial color="#3a4a6a" /></mesh>)}
        </group>
        {/* los 3 libritos (paradas) */}
        {[["#c62828", 0], ["#1d3f7a", 0.07], ["#e0a43a", 0.14]].map(([c, dz], i) => <group key={i} position={[PT.books[0], PT.books[1] + books * 0.08, PT.books[2] + (dz as number) - 0.07 + books * (i - 1) * 0.06]} rotation={[0, 0, books * (i - 1) * 0.12]}>
          <Box p={[0, 0, 0]} s={[0.17, 0.24, 0.05]} c={c as string} r={0.7} rad={0.006} e={c as string} ei={0.25 * books} />
        </group>)}
        {books > 0.01 && <mesh position={[PT.books[0] + 0.1, PT.books[1], PT.books[2]]} rotation={[0, -Math.PI / 2, 0]}><ringGeometry args={[0.26, 0.29, 40]} /><meshBasicMaterial color="#ffd60a" transparent opacity={books} toneMapped={false} /></mesh>}
        {/* caja de habanos */}
        <Box p={PT.cigar} s={[0.24, 0.07, 0.16]} c="#7a3f22" r={0.6} rad={0.006} />
        {/* banquito (balde dado vuelta) */}
        <Cyl p={[-4.4, 0.2, 0.4]} r={0.16} h={0.4} c="#e88a2a" ro={0.6} />
      </group>
      {/* detalles: lavarropas viejo y estante con frascos */}
      <Box p={[-5.3, 0.45, -2.6]} s={[0.7, 0.9, 0.7]} c="#ecebe6" r={0.4} m={0.2} rad={0.04} />
      <Box p={[-5.3, 1.75, -3.6]} s={[0.4, 0.04, 1.4]} c="#8d6c4a" map={tx.wood} r={0.8} />
      {Array.from({ length: 6 }, (_, i) => <Cyl key={i} p={[-5.3, 1.86, -4.1 + i * 0.2]} r={0.045} h={0.18} c={["#c9a24a", "#9c3a2a", "#c9a24a", "#6a8a3a", "#c9a24a", "#9c3a2a"][i]} ro={0.2} />)}

      {/* ===== AFUERA: la tierra cortada, el patio con nieve, la van y el bungalow de enfrente ===== */}
      <Box p={[-9.15, GROUND / 2, -1.0]} s={[6.0, GROUND, 11.2]} c="#ffffff" map={tx.dirt} r={1} rad={0.01} />
      <Box p={[0, GROUND / 2, -7.65]} s={[24.4, GROUND, 6.0]} c="#ffffff" map={tx.dirt} r={1} rad={0.01} />
      <Box p={[-9.15, GROUND + 0.04, -1.0]} s={[6.0, 0.08 + 0.06 * snow, 11.2]} c="#f4f7fa" r={0.9} rad={0.02} />
      <Box p={[0, GROUND + 0.04, -7.65]} s={[24.4, 0.08 + 0.06 * snow, 6.0]} c="#f4f7fa" r={0.9} rad={0.02} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND + 0.002, -24]}><planeGeometry args={[60, 28]} /><meshStandardMaterial color="#e9eef3" roughness={0.9} /></mesh>
      {/* la calle (asfalto con huellas) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND + 0.006, -11.4]}><planeGeometry args={[60, 3.0]} /><meshStandardMaterial color="#6a6e73" roughness={0.85} /></mesh>
      <Van door={vdoor} night={night} />
      {/* el bungalow de enfrente: ladrillo, porche, ventanas con luz */}
      <group position={[0, GROUND, -16]}>
        <Box p={[0, 2.2, 0]} s={[9, 4.4, 6]} c="#ffffff" map={tx.hbrick} r={0.9} />
        <mesh position={[0, 5.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[6.6, 2.2, 4]} /><meshStandardMaterial color="#3a3a3d" roughness={0.8} /></mesh>
        {[-2.8, 0, 2.8].map((x, i) => <Box key={i} p={[x, 2.6, 3.02]} s={[1.3, 1.2, 0.05]} c="#ffd99a" e="#ffc46a" ei={night * (i === 1 ? 2.2 : 1.2)} r={0.3} />)}
        <Box p={[0, 0.5, 3.6]} s={[4, 0.18, 1.2]} c="#d9d2c4" r={0.9} />
        {[-1.8, 1.8].map((x, i) => <Box key={i} p={[x, 1.3, 4.1]} s={[0.14, 1.6, 0.14]} c="#efeae0" r={0.7} />)}
      </group>
      {/* poste de luz de la vereda */}
      <Cyl p={[2.5, GROUND + 2.5, -10]} r={0.07} h={5} c="#3c4044" m={0.6} />
      <Box p={[2.9, GROUND + 5.0, -10]} s={[0.9, 0.12, 0.3]} c="#3c4044" e="#ffd28a" ei={2.5 * night} m={0.6} />
      <pointLight position={[2.9, GROUND + 4.8, -10]} intensity={14 * night} distance={14} color="#ffc878" />
      {/* nieve que cae afuera (y un poco delante de la ventana) */}
      {snow > 0.01 && Array.from({ length: 320 }, (_, i) => { const u = (t * (0.1 + 0.05 * rnd(i, 4)) + rnd(i, 1)) % 1; return <mesh key={i} position={[-14 + rnd(i, 2) * 28 + Math.sin(t + i) * 0.2, GROUND + 7 - u * 7, -4.7 - rnd(i, 3) * 16]}><sphereGeometry args={[0.025, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85 * snow} depthWrite={false} /></mesh>; })}
    </ThreeCanvas>
  );
};
