// hal01 · EL MUNDO: la cocina de Hal en un bungalow de ladrillo de Chicago, en corte (maqueta de arquitecto).
// La mesa de madera oscura con el teléfono crema de teclas, el cable rizado, la libreta amarilla, la taza; la puerta de
// atrás con cadena (la misma del avatar), el calendario de hojas y el reloj de pared. Afuera: el poste de teléfono y la
// línea que sale de la casa. UNA cámara para todo el video: vuela de un punto al otro y nunca corta.
// Los eventos (sonar, levantar, colgar, escribir, marcar el #4) llegan como segundos de at("frase") en EV.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- eventos del mundo (los llena Min1/Rest con at()) ----------------
export type Ev = {
  ring: [number, number][];    // tramos en que el teléfono suena [desde, hasta]
  lift: number[];              // segundos en que se levanta el tubo
  hang: number[];              // segundos en que se cuelga (golpe)
  cal: number;                 // la hoja del calendario pasa de MONDAY a TUESDAY
  write: [number, number];     // la libreta se llena de las 12 líneas
  circle: number;              // círculo rojo alrededor del #4
  hl: [number, number][];      // [segundo, renglón 0-11]: el resaltador amarillo pasa por ese renglón de la libreta
  done: [number, number][];    // [segundo, renglón]: tilde verde al terminar cada llamada
};
export const EV: Ev = { ring: [], lift: [], hang: [], cal: 1e9, write: [1e9, 1e9], circle: 1e9, hl: [], done: [] };

// ---------------- CÁMARA: keyframes [t, pos, look, fov]; easing cúbico + arco en los traslados largos ----------------
export type Key = { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number; lin?: boolean };
export const KEYS: Key[] = [];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([0, 1.6, 3]), l: v3([0, 0.8, 0]), fov: 38 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const u = b.t > a.t ? cl((t - a.t) / (b.t - a.t)) : 0;
  const k = b.lin ? u : ease(u);
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.01, 300); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: [number, number, number]) => project(camAt(t), v3(q));
// velocidad de la cámara en píxeles de pantalla → blur de movimiento real
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 90 + a.l.distanceTo(b.l) * 40;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.01; c.far = 300; c.updateProjectionMatrix();
  return null;
};

// ---------------- puntos de interés (para portales y rótulos HTML) ----------------
export const TABLE_Y = 0.76;
export const PT = {
  phone: [0.34, TABLE_Y + 0.07, 0.02] as [number, number, number],
  handset: [0.34, TABLE_Y + 0.12, -0.02] as [number, number, number],
  pad: [-0.14, TABLE_Y + 0.006, 0.1] as [number, number, number],
  padL4: [-0.14, TABLE_Y + 0.006, 0.1 - 0.15 + 0.06 + 3 * 0.0205] as [number, number, number],
  mug: [0.02, TABLE_Y + 0.05, -0.2] as [number, number, number],
  cal: [-1.05, 1.62, -2.17] as [number, number, number],
  clock: [-1.05, 2.12, -2.17] as [number, number, number],
  door: [0.95, 1.05, -2.15] as [number, number, number],
  jack: [0.45, 0.32, -2.17] as [number, number, number],
  window: [-2.57, 1.45, -0.6] as [number, number, number],
  pole: [-6.2, 4.6, -1.4] as [number, number, number],
  cc: [-6.2, 1.2, -40] as [number, number, number],
};

// ---------------- texturas de canvas (deterministas) ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  oak: mk(512, 512, (g) => {   // tabla de la mesa: nogal oscuro con veta
    g.fillStyle = "#3b2416"; g.fillRect(0, 0, 512, 512);
    for (let k = 0; k < 140; k++) { g.strokeStyle = `rgba(${20 + rnd(k) * 30},${10 + rnd(k, 2) * 14},4,${0.15 + rnd(k, 3) * 0.25})`; g.lineWidth = 1 + rnd(k, 4) * 3; g.beginPath(); const y = rnd(k, 5) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 9 * (rnd(k, 6) - 0.5), 340, y - 7, 512, y + 4 * rnd(k, 7)); g.stroke(); }
    for (let k = 0; k < 6; k++) { g.fillStyle = "rgba(255,220,180,.03)"; g.fillRect(0, k * 85 + 20, 512, 14); }
  }),
  floor: mk(512, 512, (g) => {  // linóleo a cuadros gastado (cocina de los 60 en Chicago)
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const w = (r + c) % 2; const v = rnd(r * 8 + c) * 14; g.fillStyle = w ? `rgb(${226 - v},${219 - v},${204 - v})` : `rgb(${120 - v},${44 - v / 2},${38 - v / 2})`; g.fillRect(c * 64, r * 64, 64, 64); }
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(0,0,0,${rnd(i, 2) * 0.05})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 2, 2); }
  }, [4, 4]),
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#e9dfcc"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(120,100,70,${rnd(i, 2) * 0.05})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 3, 3); }
  }, [3, 2]),
  door: mk(256, 512, (g) => {
    g.fillStyle = "#4a2b1a"; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 60; k++) { g.strokeStyle = `rgba(20,8,2,${0.12 + rnd(k) * 0.2})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const x = rnd(k, 3) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 6, 170, x - 6, 340, x + 3, 512); g.stroke(); }
    const pan = (x: number, y: number, w: number, h: number) => { g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 6; g.strokeRect(x, y, w, h); g.strokeStyle = "rgba(255,210,170,.12)"; g.lineWidth = 2; g.strokeRect(x + 5, y + 5, w - 10, h - 10); };
    pan(30, 120, 196, 130); pan(30, 280, 90, 200); pan(136, 280, 90, 200);
    g.fillStyle = "#b9cde0"; g.fillRect(34, 18, 188, 80); g.strokeStyle = "#2b190e"; g.lineWidth = 8; g.strokeRect(34, 18, 188, 80);
  }),
  brick: mk(512, 512, (g) => {  // ladrillo común de Chicago
    g.fillStyle = "#b8ab97"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 16; r++) for (let c = 0; c < 9; c++) { const off = (r % 2) * 32; const v = rnd(r * 9 + c) * 40; g.fillStyle = `rgb(${150 + v},${92 + v * 0.5},${62 + v * 0.3})`; g.fillRect(c * 64 - off + 2, r * 32 + 2, 60, 28); }
  }, [3, 3]),
  cab: mk(256, 256, (g) => {
    g.fillStyle = "#6b4a2c"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(0,0,0,.5)"; g.lineWidth = 6; g.strokeRect(14, 14, 228, 228); g.strokeStyle = "rgba(255,220,180,.12)"; g.lineWidth = 2; g.strokeRect(24, 24, 208, 208);
  }),
}), []);

// libreta amarilla: renglones azules, margen rojo, 12 líneas que se escriben solas y el círculo rojo del #4
const PAD_LINES = ["Grandpa, it's me", "Medicare - new card", "SSN suspended", "Bank fraud dept", "IRS - back taxes", "Warrant / jury duty", "Power shut off 45 min", "Tech support", "You won!", "$849.99 charge", "Can you hear me?", "One ring"];
const usePad = (wk: number, circ: number, hl: number, hlk: number, done: number[]) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 640; cv.height = 1050; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#f6e27a"; g.fillRect(0, 0, 640, 1050);
  g.fillStyle = "#8a2f2f"; g.fillRect(0, 0, 640, 46);                                  // tira de goma de arriba
  for (let i = 0; i < 26; i++) { g.strokeStyle = "rgba(70,120,190,.55)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 130 + i * 35); g.lineTo(640, 130 + i * 35); g.stroke(); }
  g.strokeStyle = "rgba(200,40,40,.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(92, 46); g.lineTo(92, 1050); g.moveTo(98, 46); g.lineTo(98, 1050); g.stroke();
  g.fillStyle = "#1d2c63"; g.font = "italic 30px 'Segoe Print','Bradley Hand','Comic Sans MS',cursive"; g.textBaseline = "alphabetic";
  g.fillText("12 CALLS - HANG UP", 120, 118);
  const n = wk * PAD_LINES.length;                                                       // cuántas líneas van escritas
  PAD_LINES.forEach((ln, i) => {
    const part = cl(n - i); if (part <= 0) return;
    const txt = `${i + 1}. ${ln}`; const chars = Math.ceil(txt.length * part);
    g.fillText(txt.slice(0, chars), 108, 160 + i * 70);
  });
  if (hl >= 0 && hlk > 0) {                                                            // resaltador fosforescente sobre el renglón de la llamada
    g.fillStyle = "rgba(255,120,200,.38)"; g.fillRect(104, 160 + hl * 70 - 36, 500 * hlk, 46);
  }
  done.forEach((i) => { g.strokeStyle = "#1f8a3a"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(560, 160 + i * 70 - 14); g.lineTo(578, 160 + i * 70); g.lineTo(612, 160 + i * 70 - 40); g.stroke(); });
  if (circ > 0) {                                                                        // círculo rojo a mano alrededor del #4
    g.strokeStyle = "#c81e1e"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath();
    const steps = Math.ceil(80 * circ);
    for (let k = 0; k <= steps; k++) { const a = -0.4 + (k / 80) * Math.PI * 2.15; const x = 300 + Math.cos(a) * 225 * (1 + 0.03 * Math.sin(a * 3)); const y = 360 + Math.sin(a) * 50; if (k === 0) g.moveTo(x, y); else g.lineTo(x, y); }
    g.stroke();
  }
  tex.needsUpdate = true;
  return tex;
};
// calendario de hojas: MONDAY → la hoja se levanta → TUESDAY
const useCalPage = (txt: string) => useMemo(() => mk(256, 300, (g) => {
  g.fillStyle = "#fbf8f1"; g.fillRect(0, 0, 256, 300);
  g.fillStyle = "#b3261e"; g.fillRect(0, 0, 256, 64);
  g.fillStyle = "#fff"; g.font = "bold 38px Arial"; g.textAlign = "center"; g.fillText("OCTOBER", 128, 46);
  g.fillStyle = "#1c1c1c"; g.font = "bold 46px Arial"; g.fillText(txt, 128, 190);
  g.fillStyle = "rgba(0,0,0,.35)"; g.font = "22px Arial"; g.fillText("— 2026 —", 128, 250);
}), [txt]);
// esfera del reloj de pared
const useClockFace = () => useMemo(() => mk(256, 256, (g) => {
  g.fillStyle = "#f7f2e6"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
  g.strokeStyle = "#1c1c1c"; for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2, r0 = i % 5 ? 112 : 100; g.lineWidth = i % 5 ? 2 : 6; g.beginPath(); g.moveTo(128 + Math.sin(a) * r0, 128 - Math.cos(a) * r0); g.lineTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); g.stroke(); }
  g.fillStyle = "#1c1c1c"; g.font = "bold 30px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let h = 1; h <= 12; h++) { const a = (h / 12) * Math.PI * 2; g.fillText(String(h), 128 + Math.sin(a) * 82, 128 - Math.cos(a) * 82); }
}), []);

// ---------------- piezas ----------------
type V3 = [number, number, number];
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; map?: THREE.Texture; rad?: number; rot?: V3; e?: string; ei?: number; cast?: boolean }> = ({ p, s, c, r = 0.8, m = 0, map, rad = 0.01, rot, e, ei = 0, cast = true }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} />
  </mesh>
);
// muro con canto claro en el corte (se ve el espesor, como maqueta)
const Slab: React.FC<{ p: V3; s: V3; map?: THREE.Texture; c?: string }> = ({ p, s, map, c = "#ffffff" }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.95} map={map} /></mesh>
  </group>
);

// teléfono crema de teclas: base inclinada, 12 teclas, horquilla; el tubo se levanta / se cuelga de un golpe
const CREAM = "#e9dcc0";
const Phone: React.FC<{ t: number }> = ({ t }) => {
  // estado del tubo: 0 = colgado, 1 = en la oreja (fuera de cuadro, arriba)
  let up = 0, slam = 0;
  const evs = [...EV.lift.map((x) => ({ x, k: 1 })), ...EV.hang.map((x) => ({ x, k: 0 }))].sort((a, b) => a.x - b.x);
  for (const ev of evs) { if (t >= ev.x) { up = ev.k; } }
  // transición suave de 0,35 s alrededor del último evento
  const last = evs.filter((v) => v.x <= t).pop();
  let lift = up;
  if (last) { const prev = evs.filter((v) => v.x < last.x).pop(); const from = prev ? prev.k : 0; const k = last.k === 0 ? win(t, last.x - 0.18, last.x) : win(t, last.x, last.x + 0.45); lift = lerp(from, last.k, k); if (last.k === 0) slam = Math.max(0, 1 - (t - last.x) / 0.35) * (t >= last.x ? 1 : 0); }
  const ringing = EV.ring.some(([a, b]) => t >= a && t < b) && lift < 0.05;
  const shake = ringing ? Math.sin(t * 95) * 0.0035 : 0;
  const hop = slam * Math.sin(slam * 9) * 0.004;
  // tubo: de la horquilla a la "oreja" (sube y gira)
  const hp = new THREE.Vector3(0, 0.105 + hop, -0.02).lerp(new THREE.Vector3(-0.05, 0.62, 0.32), ease(lift));
  const hr = lerp(0, -1.1, ease(lift));
  return (
    <group position={[PT.phone[0], TABLE_Y, PT.phone[2]]} rotation={[0, -0.32, 0]}>
      <group position={[shake, 0, 0]}>
        {/* base */}
        <Box p={[0, 0.03, 0]} s={[0.22, 0.06, 0.21]} c={CREAM} r={0.45} rad={0.008} />
        <Box p={[0, 0.072, 0.04]} s={[0.2, 0.02, 0.12]} c={CREAM} r={0.45} rad={0.008} rot={[-0.38, 0, 0]} />
        {/* teclas 4x3 */}
        {Array.from({ length: 12 }, (_, i) => (
          <Box key={i} p={[-0.045 + (i % 3) * 0.045, 0.086 - Math.floor(i / 3) * 0.008, 0.012 + Math.floor(i / 3) * 0.022]} s={[0.032, 0.012, 0.016]} c="#f3ecdc" r={0.35} rad={0.004} rot={[-0.38, 0, 0]} />
        ))}
        {/* horquilla */}
        {[-0.085, 0.085].map((x) => <Box key={x} p={[x, 0.09, -0.06]} s={[0.035, 0.04, 0.05]} c={CREAM} r={0.45} rad={0.01} />)}
      </group>
      {/* tubo */}
      <group position={hp} rotation={[hr * 0.4, 0, hr]}>
        <Box p={[0, 0, 0]} s={[0.15, 0.022, 0.036]} c={CREAM} r={0.4} rad={0.006} />
        <Box p={[-0.095, -0.008, 0]} s={[0.055, 0.03, 0.052]} c={CREAM} r={0.4} rad={0.008} />
        <Box p={[0.095, -0.008, 0]} s={[0.055, 0.03, 0.052]} c={CREAM} r={0.4} rad={0.008} />
      </group>
      <Coil a={new THREE.Vector3(-0.1, 0.02, 0.06)} b={hp.clone().add(new THREE.Vector3(-0.12, -0.03, 0))} />
      {/* anillos del timbre */}
      {ringing && [0, 1, 2].map((k) => { const ph = (t * 1.6 + k / 3) % 1; return (
        <mesh key={k} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.1 + ph * 0.22}>
          <ringGeometry args={[0.92, 1, 64]} /><meshBasicMaterial color="#ffd27a" transparent opacity={(1 - ph) * 0.7} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>); })}
    </group>
  );
};
// cable rizado (hélice a lo largo de la recta entre la base y el tubo; se estira cuando se levanta)
const Coil: React.FC<{ a: THREE.Vector3; b: THREE.Vector3 }> = ({ a, b }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const g = useMemo(() => {
    const d = b.clone().sub(a), L = d.length(), n = 36;
    const ax = d.clone().normalize(), up = Math.abs(ax.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const u = new THREE.Vector3().crossVectors(ax, up).normalize(), v = new THREE.Vector3().crossVectors(ax, u).normalize();
    const sag = Math.max(0, 0.12 - L * 0.12);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n * 12; i++) { const s = i / (n * 12), ang = s * n * Math.PI * 2; pts.push(a.clone().addScaledVector(d, s).addScaledVector(u, Math.cos(ang) * 0.009).addScaledVector(v, Math.sin(ang) * 0.009).add(new THREE.Vector3(0, -Math.sin(s * Math.PI) * sag, 0))); }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 12, 0.0028, 5, false);
  }, [a.x, a.y, a.z, b.x, b.y, b.z]);
  void geo;
  return <mesh geometry={g} castShadow><meshStandardMaterial color={CREAM} roughness={0.5} /></mesh>;
};
// cable de línea: de la base del teléfono, por la mesa y el piso, a la ficha de la pared
const LineCord: React.FC = () => {
  const g = useMemo(() => {
    const p = [[0.42, TABLE_Y + 0.02, -0.06], [0.5, TABLE_Y + 0.004, -0.3], [0.6, TABLE_Y + 0.004, -0.43], [0.66, TABLE_Y - 0.1, -0.46], [0.66, 0.01, -0.6], [0.6, 0.01, -1.4], [0.48, 0.01, -2.1], [PT.jack[0], PT.jack[1] - 0.02, PT.jack[2] + 0.01]].map((q) => v3(q));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), 120, 0.0035, 6, false);
  }, []);
  return <mesh geometry={g} castShadow><meshStandardMaterial color="#d8ccb2" roughness={0.6} /></mesh>;
};

const Mug: React.FC = () => (
  <group position={[PT.mug[0], TABLE_Y, PT.mug[2]]}>
    <mesh position={[0, 0.05, 0]} castShadow receiveShadow><cylinderGeometry args={[0.042, 0.038, 0.1, 32, 1, true]} /><meshStandardMaterial color="#f4f1ea" roughness={0.25} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.038, 0.038, 0.004, 32]} /><meshStandardMaterial color="#f4f1ea" roughness={0.25} /></mesh>
    <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04, 32]} /><meshStandardMaterial color="#2b1608" roughness={0.15} /></mesh>
    <mesh position={[0.05, 0.05, 0]} castShadow><torusGeometry args={[0.025, 0.007, 10, 24, Math.PI]} /><meshStandardMaterial color="#f4f1ea" roughness={0.25} /></mesh>
  </group>
);

const Pad: React.FC<{ t: number }> = ({ t }) => {
  const wk = ease(cl((t - EV.write[0]) / Math.max(0.1, EV.write[1] - EV.write[0])));
  const circ = ease(cl((t - EV.circle) / 0.7));
  const lastHl = EV.hl.filter(([x]) => x <= t).pop();
  const done = EV.done.filter(([x]) => x <= t).map(([, i]) => i);
  const tex = usePad(wk, circ, lastHl ? lastHl[1] : -1, lastHl ? ease(cl((t - lastHl[0]) / 0.6)) : 0, done);
  return (
    <group position={[PT.pad[0], TABLE_Y, PT.pad[2]]} rotation={[0, 0.06, 0]}>
      <Box p={[0, 0.004, 0]} s={[0.216, 0.008, 0.356]} c="#f1dc77" r={0.9} rad={0.002} />
      <mesh position={[0, 0.0085, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.214, 0.352]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
      {/* birome */}
      <group position={[0.15, 0.008, 0.02]} rotation={[0, 0.45, Math.PI / 2]}>
        <mesh castShadow><cylinderGeometry args={[0.0045, 0.0045, 0.14, 12]} /><meshStandardMaterial color="#141414" roughness={0.3} metalness={0.2} /></mesh>
        <mesh position={[0, 0.075, 0]}><coneGeometry args={[0.0045, 0.012, 12]} /><meshStandardMaterial color="#c9c9c9" metalness={0.9} roughness={0.2} /></mesh>
      </group>
    </group>
  );
};

const Calendar: React.FC<{ t: number }> = ({ t }) => {
  const mon = useCalPage("MONDAY"), tue = useCalPage("TUESDAY");
  const f = ease(cl((t - EV.cal) / 0.55));
  return (
    <group position={PT.cal}>
      <Box p={[0, 0.0, -0.01]} s={[0.3, 0.36, 0.02]} c="#3a2a1e" r={0.7} rad={0.005} />
      <mesh position={[0, -0.01, 0.002]}><planeGeometry args={[0.26, 0.3]} /><meshStandardMaterial map={tue} roughness={0.9} /></mesh>
      {f < 0.999 && (
        <group position={[0, 0.14, 0.006]} rotation={[-f * 2.6, 0, f * 0.25]}>
          <mesh position={[0, -0.15, 0]}><planeGeometry args={[0.26, 0.3]} /><meshStandardMaterial map={mon} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>
      )}
    </group>
  );
};
const Clock: React.FC<{ t: number }> = ({ t }) => {
  const face = useClockFace();
  const sec = Math.floor(t) + 12, min = 42 + sec / 60, hr = 10 + min / 60;
  return (
    <group position={PT.clock}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.17, 0.17, 0.04, 48]} /><meshStandardMaterial color="#1e1e1e" roughness={0.4} metalness={0.5} /></mesh>
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.155, 48]} /><meshStandardMaterial map={face} roughness={0.6} /></mesh>
      {[[hr / 12, 0.08, 0.012], [min / 60, 0.125, 0.008], [sec / 60, 0.135, 0.003]].map(([f, L, w], i) => (
        <mesh key={i} position={[0, 0, 0.026 + i * 0.002]} rotation={[0, 0, -f * Math.PI * 2]}>
          <mesh position={[0, L / 2 - 0.015, 0]}><boxGeometry args={[w, L, 0.002]} /><meshStandardMaterial color={i === 2 ? "#b3261e" : "#141414"} /></mesh>
        </mesh>
      ))}
    </group>
  );
};

// puerta de atrás con cadena y picaporte de bronce (la del avatar)
const BackDoor: React.FC<{ tx: ReturnType<typeof useTex> }> = ({ tx }) => (
  <group position={[PT.door[0], 0, -2.16]}>
    <Box p={[0, 1.02, 0]} s={[0.86, 2.04, 0.05]} c="#ffffff" r={0.6} map={tx.door} rad={0.005} />
    {[[-0.47, 1.05, 0.06, 2.14], [0.47, 1.05, 0.06, 2.14], [0, 2.12, 1.0, 0.07]].map(([x, y, w, h], i) => <Box key={i} p={[x, y, 0.02]} s={[w, h, 0.05]} c="#f0ebe0" r={0.6} rad={0.008} />)}
    <mesh position={[0.33, 0.98, 0.05]} castShadow><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#b98d3e" metalness={1} roughness={0.25} /></mesh>
    <mesh position={[0.33, 1.25, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.026, 0.026, 0.02, 20]} /><meshStandardMaterial color="#b98d3e" metalness={1} roughness={0.3} /></mesh>
    {/* cadena */}
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.34 + i * 0.006, 1.62 - i * 0.022 - Math.sin((i / 8) * Math.PI) * 0.02, 0.05]} rotation={[0, i % 2 ? Math.PI / 2 : 0, Math.PI / 2]}><torusGeometry args={[0.009, 0.0025, 6, 12]} /><meshStandardMaterial color="#9d9fa3" metalness={1} roughness={0.3} /></mesh>)}
    <Box p={[0.34, 1.64, 0.035]} s={[0.05, 0.02, 0.012]} c="#b98d3e" m={1} r={0.3} />
  </group>
);

// ventana del costado: luz de mañana y, afuera, el ladrillo del vecino y el poste de teléfono
const SideWindow: React.FC = () => (
  <group position={[-2.55, 1.45, -0.6]} rotation={[0, Math.PI / 2, 0]}>
    <mesh><planeGeometry args={[1.05, 1.15]} /><meshBasicMaterial color="#cfe0f2" transparent opacity={0.18} toneMapped={false} /></mesh>
    {[[0, 0.6, 1.17, 0.07], [0, -0.6, 1.2, 0.1], [-0.55, 0, 0.07, 1.25], [0.55, 0, 0.07, 1.25], [0, 0, 1.1, 0.05], [0, 0, 0.05, 1.15]].map(([x, y, w, h], i) => <Box key={i} p={[x, y, 0.03]} s={[w, h, 0.06]} c="#f1ece2" r={0.55} rad={0.006} />)}
  </group>
);
const Pole: React.FC = () => (
  <group position={[PT.pole[0], 0, PT.pole[2]]}>
    <mesh position={[0, 4.2, 0]} castShadow><cylinderGeometry args={[0.13, 0.17, 8.4, 12]} /><meshStandardMaterial color="#5a4433" roughness={0.95} /></mesh>
    <Box p={[0, 7.6, 0]} s={[1.6, 0.12, 0.14]} c="#5a4433" r={0.95} />
    {[-0.65, -0.25, 0.25, 0.65].map((x) => <mesh key={x} position={[x, 7.72, 0]}><cylinderGeometry args={[0.035, 0.045, 0.14, 10]} /><meshStandardMaterial color="#2d5a3d" roughness={0.2} /></mesh>)}
    <Box p={[0.22, 6.3, 0.12]} s={[0.25, 0.32, 0.18]} c="#6f7378" m={0.4} r={0.5} />
  </group>
);
const Wire: React.FC<{ a: V3; b: V3; sag?: number; c?: string; r?: number }> = ({ a, b, sag = 0.5, c = "#151515", r = 0.012 }) => {
  const g = useMemo(() => { const A = v3(a), B = v3(b), M = A.clone().lerp(B, 0.5); M.y -= sag; return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(A, M, B), 40, r, 5, false); }, [a.join(), b.join(), sag]);
  return <mesh geometry={g}><meshStandardMaterial color={c} roughness={0.6} /></mesh>;
};
// polvo en el haz de luz de la ventana
const Dust: React.FC<{ t: number }> = ({ t }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 260, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const s = rnd(i, 1); p.set([-2.3 + s * 2.4 + Math.sin(t * 0.2 + i) * 0.05, 0.9 + rnd(i, 2) * 1.3 - s * 0.55 + Math.sin(t * 0.3 + i * 2) * 0.04, -1.1 + rnd(i, 3) * 1.0], i * 3); }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color="#fff4dc" size={0.006} sizeAttenuation transparent opacity={0.65} depthWrite={false} /></points>;
};


// ---------------- LA SALA DE LOS ESTAFADORES: al final del cable, un galpón con filas de puestos, guiones y un supervisor ----------------
export const CC: V3 = [-6.2, 0, -40];
const SCRIPT_TXT = ["1. \"Grandpa, it's me\"", "2. Don't give your name", "3. Let HIM say it", "4. Accident / jail", "5. \"Don't tell Mom\"", "6. Lawyer gets on", "7. Courier at 3 PM"];
const useScript = () => useMemo(() => mk(512, 640, (g) => {
  g.fillStyle = "#fbfbf6"; g.fillRect(0, 0, 512, 640);
  g.fillStyle = "#b3261e"; g.font = "bold 44px Arial"; g.fillText("SCRIPT  v7", 30, 70);
  g.fillStyle = "#222"; g.font = "30px 'Courier New'"; SCRIPT_TXT.forEach((s, i) => g.fillText(s, 30, 140 + i * 66));
}), []);
const useShifts = () => useMemo(() => mk(512, 256, (g) => {
  g.fillStyle = "#f2f4f6"; g.fillRect(0, 0, 512, 256);
  g.fillStyle = "#1c2a48"; g.font = "bold 40px Arial"; g.fillText("SHIFT  B   06:00-14:00", 24, 60);
  g.fillStyle = "#333"; g.font = "30px Arial"; g.fillText("TARGET TODAY:  $40,000", 24, 120); g.fillText("CALLS / HR:  60", 24, 170);
  g.fillStyle = "#1f8a3a"; g.fillRect(24, 200, 330, 24); g.strokeStyle = "#333"; g.strokeRect(24, 200, 460, 24);
}), []);
// maniquí de persona (cápsula + cabeza + auricular), sentado o de pie
const Person: React.FC<{ p: V3; ry?: number; sit?: boolean; c?: string; t: number; k: number }> = ({ p, ry = 0, sit = true, c = "#4a5568", t, k }) => {
  const nod = Math.sin(t * 2.2 + k * 1.7) * 0.05;
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <mesh position={[0, sit ? 0.78 : 1.12, 0]} castShadow><capsuleGeometry args={[0.17, sit ? 0.42 : 0.7, 6, 12]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh>
      <group position={[0, sit ? 1.22 : 1.72, 0]} rotation={[nod, 0, 0]}>
        <mesh castShadow><sphereGeometry args={[0.12, 20, 16]} /><meshStandardMaterial color="#c9a184" roughness={0.7} /></mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.13, 0.012, 8, 24, Math.PI]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[-0.13, -0.02, 0.03]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color="#111" /></mesh>
      </group>
    </group>
  );
};
const CallCenter: React.FC<{ t: number }> = ({ t }) => {
  const scr = useScript(), sh = useShifts();
  const sup = Math.sin(t * 0.35) * 3.2;                       // el supervisor camina entre las filas
  return (
    <group position={CC}>
      {/* galpón en corte: piso de cemento, muro del fondo y techo bajo con tubos fluorescentes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow><planeGeometry args={[10, 8]} /><meshStandardMaterial color="#6d6f73" roughness={0.9} /></mesh>
      <Box p={[0, 1.6, -4]} s={[10, 3.2, 0.15]} c="#8a8f96" r={0.9} />
      <Box p={[-5, 1.6, 0]} s={[0.15, 3.2, 8]} c="#7d828a" r={0.9} />
      {[-2.4, 0, 2.4].map((z) => <group key={z}><mesh position={[0, 3.05, z]}><boxGeometry args={[6, 0.05, 0.14]} /><meshBasicMaterial color="#e9f3ff" toneMapped={false} /></mesh></group>)}
      <pointLight position={[0, 2.8, 0]} intensity={3} distance={12} color="#e3ecff" castShadow />
      {/* 3 filas de mesas largas con 5 puestos cada una */}
      {[-2.2, 0, 2.2].map((z, r) => (
        <group key={r} position={[0, 0, z]}>
          <Box p={[0, 0.74, 0]} s={[7, 0.05, 0.8]} c="#d8d4cb" r={0.6} />
          {[-3.2, 3.2].map((x) => <Box key={x} p={[x, 0.37, 0]} s={[0.06, 0.74, 0.7]} c="#555" />)}
          {[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <Box p={[0, 0.98, -0.22]} s={[0.5, 0.32, 0.03]} c="#111" r={0.4} />
              <mesh position={[0, 0.98, -0.203]}><planeGeometry args={[0.46, 0.28]} /><meshBasicMaterial color={(r + i) % 3 ? "#8fb6e8" : "#a8e0b0"} toneMapped={false} /></mesh>
              <mesh position={[0.12, 0.765, 0.12]} rotation={[-Math.PI / 2, 0, 0.1 * i]}><planeGeometry args={[0.2, 0.26]} /><meshStandardMaterial map={scr} roughness={0.9} /></mesh>
              <Person p={[0, 0, 0.55]} ry={Math.PI} t={t} k={r * 5 + i} c={["#4a5568", "#6b4f3a", "#2f4858", "#5a3d5c", "#3d5a40"][(r + i) % 5]} />
            </group>
          ))}
        </group>
      ))}
      <Person p={[sup, 0, 1.1]} ry={Math.cos(t * 0.35) > 0 ? -Math.PI / 2 : Math.PI / 2} sit={false} c="#1f3b63" t={t} k={99} />
      <mesh position={[sup + 0.22, 1.25, 1.1]}><boxGeometry args={[0.03, 0.3, 0.22]} /><meshStandardMaterial color="#c9a26a" /></mesh>
      {/* pizarra con el turno y la meta del día */}
      <mesh position={[-1.5, 1.9, -3.9]}><planeGeometry args={[2.4, 1.2]} /><meshStandardMaterial map={sh} roughness={0.8} /></mesh>
      <mesh position={[2.2, 1.9, -3.9]}><planeGeometry args={[1.0, 1.25]} /><meshStandardMaterial map={scr} roughness={0.8} /></mesh>
    </group>
  );
};

// ---------------- LA ESCENA ----------------
export const KitchenWorld: React.FC<{ t: number; ct?: number }> = ({ t, ct }) => {
  const tx = useTex();
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={ct ?? t} />
      <Post bloom={0.35} threshold={0.9} exposure={1.0} env={0.32} />
      <color attach="background" args={["#d9e3ec"]} />
      <fog attach="fog" args={["#d9e3ec", 14, 60]} />
      <hemisphereLight args={["#f3efe6", "#5b4a3c", 0.55]} />
      {/* sol de mañana entrando por la ventana del costado */}
      <directionalLight position={[-9, 6.5, 1.5]} intensity={3.1} color="#fff1da" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* lámpara colgante sobre la mesa (cálida) */}
      <pointLight position={[0.05, 1.95, 0]} intensity={2.4} distance={4.5} color="#ffd9a0" castShadow shadow-bias={-0.0004} />
      <group position={[0.05, 2.1, 0]}>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.004, 0.004, 0.5, 6]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh><coneGeometry args={[0.2, 0.16, 32, 1, true]} /><meshStandardMaterial color="#2f4f3c" roughness={0.5} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.045, 16, 12]} /><meshBasicMaterial color="#fff2cc" toneMapped={false} /></mesh>
      </group>

      {/* piso, paredes en corte (canto claro visible desde afuera) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.1, 0, -0.1]} receiveShadow><planeGeometry args={[5.0, 4.2]} /><meshStandardMaterial map={tx.floor} roughness={0.55} /></mesh>
      <Slab p={[-0.1, 1.3, -2.25]} s={[5.2, 2.6, 0.16]} map={tx.wall} />
      <Slab p={[-2.62, 1.3, -0.1]} s={[0.16, 2.6, 4.4]} map={tx.wall} />
      {/* zócalo */}
      <Box p={[-0.1, 0.05, -2.16]} s={[5.0, 0.1, 0.02]} c="#efe9dc" r={0.5} />
      {/* exterior: ladrillo de la casa (vista desde afuera en los planos abiertos) */}
      <Slab p={[-0.1, 1.3, -2.36]} s={[5.4, 2.8, 0.06]} map={tx.brick} />
      <Slab p={[-2.73, 1.3, -0.1]} s={[0.06, 2.8, 4.6]} map={tx.brick} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, -0.01, -3]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#8d9a7a" roughness={1} /></mesh>
      {/* casa vecina de ladrillo y poste con la línea que sale de la cocina */}
      <Slab p={[-9.5, 3.5, -0.5]} s={[0.4, 7, 10]} map={tx.brick} />
      <Pole />
      <Wire a={[-2.76, 2.35, -1.9]} b={[PT.pole[0] + 0.25, 7.6, PT.pole[2]]} sag={0.4} />
      <Wire a={[PT.pole[0] - 0.65, 7.76, PT.pole[2]]} b={[CC[0] - 1.2, 4.6, CC[2] + 4.5]} sag={1.0} />
      <CallCenter t={t} />
      <Wire a={[PT.pole[0] + 0.65, 7.76, PT.pole[2]]} b={[-6.2, 7.0, 25]} sag={1.0} />

      {/* mesa */}
      <Box p={[0, TABLE_Y - 0.02, 0]} s={[1.3, 0.04, 0.86]} c="#ffffff" map={tx.oak} r={0.45} rad={0.012} />
      {[[-0.58, -0.36], [0.58, -0.36], [-0.58, 0.36], [0.58, 0.36]].map(([x, z], i) => <Box key={i} p={[x, (TABLE_Y - 0.04) / 2, z]} s={[0.05, TABLE_Y - 0.04, 0.05]} c="#2c1a0f" r={0.6} />)}
      {/* silla de Hal (del otro lado) */}
      <group position={[0, 0, -0.62]}>
        <Box p={[0, 0.46, 0]} s={[0.44, 0.04, 0.42]} c="#4a2e1c" r={0.6} />
        <Box p={[0, 0.88, -0.2]} s={[0.44, 0.5, 0.04]} c="#4a2e1c" r={0.6} />
        {[[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]].map(([x, z], i) => <Box key={i} p={[x, 0.23, z]} s={[0.035, 0.46, 0.035]} c="#3a2416" />)}
      </group>
      <Phone t={t} />
      <LineCord />
      <Box p={[PT.jack[0], PT.jack[1], PT.jack[2]]} s={[0.07, 0.11, 0.02]} c="#f1ece0" r={0.5} rad={0.006} />
      <Mug />
      <Pad t={t} />
      {/* mesada y alacenas a la izquierda */}
      <group position={[-2.2, 0, -1.3]}>
        <Box p={[0, 0.45, 0]} s={[0.62, 0.9, 1.6]} c="#ffffff" map={tx.cab} r={0.6} />
        <Box p={[0.02, 0.92, 0]} s={[0.66, 0.04, 1.64]} c="#f2f0ea" r={0.35} />
        <Box p={[0.1, 1.95, 0.3]} s={[0.36, 0.7, 1.0]} c="#ffffff" map={tx.cab} r={0.6} />
        <mesh position={[0.05, 1.0, -0.45]} castShadow><cylinderGeometry args={[0.1, 0.12, 0.16, 20]} /><meshStandardMaterial color="#c9a26a" roughness={0.8} /></mesh>
      </group>
      <BackDoor tx={tx} />
      <Calendar t={t} />
      <Clock t={t} />
      {/* interruptor y cuadrito (como en el avatar) */}
      <Box p={[-0.3, 1.32, -2.165]} s={[0.08, 0.12, 0.01]} c="#f4efe4" r={0.4} />
      <Box p={[-1.75, 1.85, -2.165]} s={[0.46, 0.36, 0.02]} c="#1b1b1b" r={0.5} />
      <mesh position={[-1.75, 1.85, -2.153]}><planeGeometry args={[0.38, 0.28]} /><meshStandardMaterial color="#d8d2c4" roughness={0.9} /></mesh>
      <SideWindow />
      <Dust t={t} />
    </ThreeCanvas>
  );
};
