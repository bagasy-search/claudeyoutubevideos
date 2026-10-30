// scr29 · EL MUNDO de la serie: el garage del Scrap Workshop en una madrugada de invierno, en corte (le falta la pared del frente).
// En el centro, sobre una base de ladrillos, LA ESTUFA DEL VIDEO (plan.kind): tanque de compresor · 2 tambores de freno ·
// matafuego · lata de pintura con aserrín · caja de munición. Se ARMA por estados (tl.ts → plan.st) y puede verse EN CORTE
// (rayos X) para mostrar el cuenco, el tubo con agujeros y el aire. Datos DENTRO de la escena: termómetro °F de la pared,
// reloj, rótulos con tiza sobre el acero (plan.labs). UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import PLAN from "./plan.json";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];
type Lab = { at: number; out: number; txt: string; p: V; s?: number; col?: string; ry?: number };
const PL = PLAN as unknown as { kind: string; labs?: Lab[] };
export const KIND = PL.kind ?? "tank";

// ---------------- medidas ----------------
export const STOVE: V = [0.6, 0.12, -1.3];      // centro de la base (arriba de los ladrillos)
export const JUG: V = [-0.15, 1.55, -2.93];      // bidón de goteo colgado en la pared, a un costado
export const BUCKET: V = [1.5, 0, -0.95];
export const THERMO: V = [2.45, 1.6, -2.97];
export const CLOCK: V = [-0.75, 2.45, -2.95];
export const PANEL: V = [3.1, 3.38, -2.1];
// la boca de la chimenea según la estufa (arriba)
const TOPY: Record<string, number> = { tank: 0.95, drums: 0.62, ext: 0.78, can: 0.36, ammo: 0.5 };
export const PIPE_Y = (STOVE[1] + (TOPY[KIND] ?? 0.9));

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
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
const useGarageTex = () => useMemo(() => ({
  // tablero OSB de las paredes (virutas)
  osb: mk(512, 512, (g) => {
    g.fillStyle = "#a88a5c"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) { const c = 120 + rnd(i, 1) * 80; g.fillStyle = `rgba(${c},${c * 0.78},${c * 0.5},.55)`; g.save(); g.translate(rnd(i, 2) * 512, rnd(i, 3) * 512); g.rotate(rnd(i, 4) * 6.3); g.fillRect(-14, -4, 18 + rnd(i, 5) * 26, 5 + rnd(i, 6) * 6); g.restore(); }
    g.fillStyle = "rgba(40,28,16,.5)"; g.fillRect(0, 0, 512, 3); g.fillRect(0, 0, 3, 512);
  }, [2, 1]),
  // piso de cemento con manchas de aceite
  floor: mk(512, 512, (g) => {
    g.fillStyle = "#5c5953"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { const v = 62 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v - 2},${v - 6},.4)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 14; i++) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, 60); gr.addColorStop(0, "rgba(10,8,6,.55)"); gr.addColorStop(1, "rgba(10,8,6,0)"); g.save(); g.translate(rnd(i, 4) * 512, rnd(i, 5) * 512); g.scale(1 + rnd(i, 6), 0.6 + rnd(i, 7)); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 60, 0, 6.3); g.fill(); g.restore(); }
    g.strokeStyle = "rgba(20,20,20,.35)"; g.lineWidth = 3; g.beginPath(); g.moveTo(256, 0); g.lineTo(256, 512); g.stroke();
  }, [3, 2]),
  brick: mk(256, 256, (g) => {
    g.fillStyle = "#8d4a33"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${90 + rnd(i, 1) * 90},${40 + rnd(i, 2) * 30},${25 + rnd(i, 3) * 20},.5)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 3, 3); }
    g.fillStyle = "rgba(196,170,130,.55)"; g.fillRect(0, 0, 256, 7); g.fillRect(0, 0, 7, 256);
  }),
  // acero gris gastado con óxido (tanques, tambores)
  steel: mk(512, 256, (g) => {
    g.fillStyle = "#5d6166"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${110 + rnd(i, 1) * 70},${48 + rnd(i, 2) * 25},20,${0.12 + rnd(i, 3) * 0.32})`; g.beginPath(); g.ellipse(rnd(i, 4) * 512, rnd(i, 5) * 256, 3 + rnd(i, 6) * 22, 2 + rnd(i, 7) * 14, 0, 0, 6.3); g.fill(); }
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(255,255,255,${0.04 + rnd(i, 8) * 0.06})`; g.beginPath(); const y = rnd(i, 9) * 256; g.moveTo(0, y); g.lineTo(512, y + (rnd(i, 10) - 0.5) * 6); g.stroke(); }
  }),
  // pintura roja del matafuego (con raspones)
  red: mk(512, 256, (g) => {
    g.fillStyle = "#b3241c"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(60,58,56,${0.2 + rnd(i, 1) * 0.4})`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 256, 2 + rnd(i, 4) * 20, 1 + rnd(i, 5) * 3); }
    g.fillStyle = "rgba(240,235,220,.85)"; g.fillRect(200, 70, 112, 120); g.fillStyle = "rgba(40,40,40,.6)"; for (let k = 0; k < 6; k++) g.fillRect(212, 86 + k * 16, 88 - (k % 2) * 30, 6);
  }),
  // verde oliva de la caja de munición con su estarcido
  olive: mk(512, 256, (g) => {
    g.fillStyle = "#4c5233"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${30 + rnd(i, 1) * 40},${32 + rnd(i, 2) * 30},20,${0.2 + rnd(i, 3) * 0.3})`; g.fillRect(rnd(i, 4) * 512, rnd(i, 5) * 256, 2 + rnd(i, 6) * 14, 2 + rnd(i, 7) * 5); }
    g.fillStyle = "rgba(230,215,150,.75)"; g.font = "900 52px Arial"; g.textAlign = "center"; g.fillText("CAL .50  M2A1", 256, 140);
  }),
  // lata de pintura (gris con etiqueta gastada)
  can: mk(512, 256, (g) => {
    g.fillStyle = "#9aa0a4"; g.fillRect(0, 0, 512, 256);
    g.fillStyle = "#c8c1a8"; g.fillRect(0, 60, 512, 130); g.fillStyle = "#2c5a8a"; g.fillRect(0, 60, 512, 26);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(120,70,30,${0.15 + rnd(i, 1) * 0.3})`; g.beginPath(); g.ellipse(rnd(i, 2) * 512, rnd(i, 3) * 256, 3 + rnd(i, 4) * 16, 2 + rnd(i, 5) * 10, 0, 0, 6.3); g.fill(); }
  }),
  // aserrín apretado (corte de la lata)
  dust: mk(256, 256, (g) => {
    g.fillStyle = "#c79a5a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2400; i++) { const c = 150 + rnd(i, 1) * 80; g.fillStyle = `rgba(${c},${c * 0.75},${c * 0.42},.8)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 3, 1); }
  }, [2, 2]),
  // panel de clavijas con herramientas pintadas
  peg: mk(512, 256, (g) => {
    g.fillStyle = "#b99a6e"; g.fillRect(0, 0, 512, 256);
    g.fillStyle = "rgba(40,30,20,.55)"; for (let x = 8; x < 512; x += 16) for (let y = 8; y < 256; y += 16) { g.beginPath(); g.arc(x, y, 2.4, 0, 6.3); g.fill(); }
  }),
  // escala del termómetro de pared (30-90 °F)
  scale: mk(256, 1024, (g) => {
    g.fillStyle = "#e9e2d2"; g.fillRect(0, 0, 256, 1024);
    const y = (v: number) => 990 - ((v - 30) / 60) * 930;
    for (let v = 30; v <= 90; v += 2) { g.fillStyle = "#1b1b1b"; const big = v % 10 === 0; g.fillRect(big ? 150 : 175, y(v) - 2, big ? 80 : 50, big ? 6 : 3); if (big) { g.font = "900 62px Arial"; g.textAlign = "right"; g.fillText(String(v), 140, y(v) + 22); } }
    g.font = "900 54px Arial"; g.textAlign = "center"; g.fillStyle = "#b3261e"; g.fillText("°F", 128, 1020);
  }),
  frost: mk(512, 512, (g) => {
    const fern = (x: number, y: number, a: number, len: number, d: number) => {
      if (d > 4 || len < 6) return;
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      g.strokeStyle = `rgba(235,245,255,${0.55 - d * 0.08})`; g.lineWidth = Math.max(0.6, 3 - d * 0.6);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
      for (let k = 1; k < 5; k++) { const px = x + Math.cos(a) * len * k / 5, py = y + Math.sin(a) * len * k / 5; fern(px, py, a + 0.9, len * 0.42, d + 1); fern(px, py, a - 0.9, len * 0.42, d + 1); }
    };
    for (let i = 0; i < 26; i++) { const edge = i % 4; const x = edge === 0 ? 0 : edge === 1 ? 512 : rnd(i, 1) * 512, y = edge === 2 ? 0 : edge === 3 ? 512 : rnd(i, 2) * 512; const a = Math.atan2(256 - y, 256 - x) + (rnd(i, 3) - 0.5) * 1.2; fern(x, y, a, 90 + rnd(i, 4) * 120, 0); }
  }),
  clock: mk(512, 512, (g) => {
    g.fillStyle = "#efe7d6"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill();
    g.strokeStyle = "#2a2018"; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 240, 0, 6.3); g.stroke();
    g.fillStyle = "#1b1b1b"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2 - Math.PI / 2; g.font = "900 64px Arial"; g.fillText(String(h), 256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180); }
  }),
  // celdas del panel solar
  cells: mk(512, 256, (g) => {
    g.fillStyle = "#0e1b33"; g.fillRect(0, 0, 512, 256);
    for (let x = 0; x < 9; x++) for (let y = 0; y < 4; y++) { g.fillStyle = "#16305c"; g.fillRect(6 + x * 56.6, 6 + y * 62, 52, 58); g.strokeStyle = "rgba(200,210,230,.35)"; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(6 + x * 56.6 + k * 13, 6 + y * 62); g.lineTo(6 + x * 56.6 + k * 13, 64 + y * 62); g.stroke(); } }
  }),
}), []);
// rótulo «con tiza» (texto en una textura, apoyado en el acero o la pared)
const labTex = new Map<string, THREE.Texture>();
const chalk = (txt: string, col: string) => {
  const k = txt + col; const c = labTex.get(k); if (c) return c;
  const t = mk(1024, 256, (g) => { g.clearRect(0, 0, 1024, 256); g.font = "900 150px 'Arial Black', Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; g.shadowColor = "rgba(0,0,0,.45)"; g.shadowBlur = 8; g.fillText(txt, 512, 136); });
  labTex.set(k, t); return t;
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined || op > 0.95} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx; open?: boolean }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 28, r2, op, map, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} depthWrite={op === undefined || op > 0.95} map={map} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
const Dots: React.FC<{ pts: [number, number, number, number][]; col: string; size: number; glow: THREE.Texture; add?: boolean }> = ({ pts, col, size, glow, add = true }) => {
  const g = useMemo(() => {
    const geo = new THREE.BufferGeometry(), c = new THREE.Color(col);
    const pos = new Float32Array(pts.length * 3), cc = new Float32Array(pts.length * 3);
    pts.forEach(([x, y, z, o], i) => { pos.set([x, y, z], i * 3); cc.set([c.r * o, c.g * o, c.b * o], i * 3); });
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(cc, 3));
    return geo;
  }, [pts, col]);
  return <points geometry={g}><pointsMaterial map={glow} size={size} sizeAttenuation vertexColors transparent depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};
// partículas que viajan de A a B (calor, aire, agua, energía)
const Leak: React.FC<{ t: number; from: V; to: V; amt: number; col?: string; n?: number; glow: THREE.Texture; spread?: number; size?: number; speed?: number }> = ({ t, from, to, amt, col = "#ff8a3d", n = 26, glow, spread = 0.25, size = 0.16, speed = 1 }) => {
  if (amt < 0.01) return null;
  const A = v3(from), B = v3(to);
  const pts = Array.from({ length: n }, (_, i) => {
    const ph = ((t * (0.22 + rnd(i, 1) * 0.18) * speed + rnd(i, 2)) % 1);
    const q = A.clone().lerp(B, ph);
    q.x += (rnd(i, 3) - 0.5) * spread + Math.sin(t * 2 + i) * 0.03; q.y += (rnd(i, 4) - 0.5) * spread * 0.5; q.z += (rnd(i, 5) - 0.5) * spread;
    return [q.x, q.y, q.z, amt * Math.sin(ph * Math.PI) * 0.9] as [number, number, number, number];
  });
  return <Dots pts={pts} col={col} size={size * 2.0} glow={glow} />;
};
// partículas por un camino de puntos (cable, caño, serpentín)
const PathFlow: React.FC<{ t: number; path: V[]; amt: number; col: string; glow: THREE.Texture; n?: number; size?: number; speed?: number }> = ({ t, path, amt, col, glow, n = 30, size = 0.07, speed = 0.25 }) => {
  if (amt < 0.01) return null;
  const segs = path.slice(1).map((b, i) => v3(path[i]).distanceTo(v3(b))); const L = segs.reduce((a, b) => a + b, 0);
  const at = (u: number) => { let d = u * L; for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) return v3(path[i]).lerp(v3(path[i + 1]), d / segs[i]); d -= segs[i]; } return v3(path[path.length - 1]); };
  const pts = Array.from({ length: n }, (_, i) => { const u = (t * speed + i / n) % 1; const q = at(u); return [q.x, q.y, q.z, amt] as [number, number, number, number]; });
  return <Dots pts={pts} col={col} size={size} glow={glow} />;
};
// la llama: lenguas de luz que pasan de naranja perezoso a azul (blue 0-1); titileo ≤2 Hz
const Flame: React.FC<{ t: number; on: number; blue: number; glow: THREE.Texture; w?: number; h?: number }> = ({ t, on, blue, glow, w = 0.16, h = 0.3 }) => {
  if (on < 0.01) return null;
  const hot = new THREE.Color("#ffb347").lerp(new THREE.Color("#7fb8ff"), blue), tip = new THREE.Color("#ff5a1a").lerp(new THREE.Color("#2a6bff"), blue);
  return <group>{Array.from({ length: 14 }, (_, i) => {
    const ph = (t * (0.9 + rnd(i, 1) * 0.8) + rnd(i, 2)) % 1;
    return <sprite key={i} position={[(rnd(i, 3) - 0.5) * w, ph * h * (1 + blue * 0.4), (rnd(i, 4) - 0.5) * w]} scale={[0.12 * (1 - ph * 0.6) * (1 - blue * 0.3), 0.2 * (1 - ph * 0.4), 1]}>
      <spriteMaterial map={glow} color={(ph < 0.4 ? hot : tip).getStyle()} transparent opacity={on * (1 - ph) * 0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>;
  })}</group>;
};
// tubo con agujeros (secundario): los agujeros se encienden azules con el fuego
const HoleTube: React.FC<{ p: V; r: number; h: number; on: number; blue: number; rows: number; op?: number; t: number }> = ({ p, r, h, on, blue, rows, op, t }) => (
  <group position={p}>
    <Cyl p={[0, h / 2, 0]} r={r} h={h} c="#3b3d40" m={0.75} rough={0.45} op={op} />
    {Array.from({ length: rows * 8 }, (_, i) => {
      const row = Math.floor(i / 8), a = (i % 8) / 8 * Math.PI * 2 + row * 0.39;
      const lit = on * (0.55 + 0.45 * Math.sin(t * 1.7 + i));
      return <mesh key={i} position={[Math.cos(a) * (r + 0.002), h * 0.12 + row * (h * 0.8 / Math.max(1, rows - 1)), Math.sin(a) * (r + 0.002)]} rotation={[0, -a + Math.PI / 2, 0]}>
        <circleGeometry args={[0.009, 10]} /><meshBasicMaterial color={new THREE.Color("#140a06").lerp(new THREE.Color(blue > 0.5 ? "#6fb0ff" : "#ff9a3a"), lit).getStyle()} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
    })}
  </group>
);

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), gt = useGarageTex();
  const s = ST(t);
  const fl = s.fire * (0.94 + 0.06 * Math.sin(t * 1.7) * Math.sin(t * 1.1 + 0.7));
  const shell = 1 - 0.78 * s.cut;                                  // rayos X: la chapa se vuelve vidrio
  const flameCol = new THREE.Color("#ff8a3d").lerp(new THREE.Color("#6fa8ff"), s.blue).getStyle();
  const colH = 0.78 + (2.45 - 0.78) * cl((s.temp - 30) / 60);
  const smokeCol = new THREE.Color("#cfd6e0").lerp(new THREE.Color("#0a0a0a"), s.smokeBlack);
  const [X, Y, Z] = STOVE;
  const hot = (k: number) => new THREE.Color("#000").lerp(new THREE.Color("#ff3a10"), k).getStyle();
  const drop = (i: number) => (t * s.dripRate + i * 0.5) % 1;
  // ------- la estufa de cada video -------
  const stove = (() => {
    if (KIND === "drums") {
      const r1 = 0.24, h1 = 0.24, r2 = 0.2, h2 = 0.22;
      return <group>
        <Cyl p={[X, Y + h1 / 2, Z]} r={r1} h={h1} c="#4a4440" map={gt.steel} m={0.6} rough={0.5} e="#ff3a10" ei={0.12 * fl} op={shell < 1 ? shell : undefined} seg={36} />
        <mesh position={[X, Y + h1 + 0.004, Z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r1, 0.02, 10, 48]} /><meshStandardMaterial color="#3a3532" metalness={0.7} roughness={0.5} /></mesh>
        <group position={[0, (1 - ease(s.top)) * 1.2, 0]}>
          <Cyl p={[X, Y + h1 + h2 / 2 + 0.01, Z]} r={r2} h={h2} c="#4f4944" map={gt.steel} m={0.6} rough={0.5} e="#ff3a10" ei={0.1 * fl} op={s.top < 0.02 ? 0 : shell < 1 ? shell : undefined} seg={36} />
          {s.plate > 0.01 && <Cyl p={[X, Y + h1 + h2 + 0.02, Z]} r={r2 + 0.01} h={0.012} c="#2b2b2c" m={0.8} rough={0.35} e="#ff3a10" ei={0.18 * fl} />}
        </group>
        <HoleTube p={[X, Y + 0.02, Z]} r={0.045} h={0.4 * ease(s.tube)} on={fl} blue={s.blue} rows={4} op={s.tube < 0.02 ? 0 : undefined} t={t} />
        <Cyl p={[X - 0.08, Y + 0.03, Z + 0.05]} r={0.08} h={0.05} c="#232324" m={0.7} rough={0.5} op={s.bowl < 0.02 ? 0 : undefined} />
        {/* el ventilador en su caja fría, a un pie, con el caño flexible y el cable hasta la batería y la perilla */}
        {s.fan > 0.01 && <group position={[X - 0.62, 0, Z + 0.32]} scale={ease(s.fan)}>
          <Box p={[0, 0.1, 0]} s={[0.16, 0.16, 0.16]} c="#8a8f94" m={0.6} r={0.4} />
          <group position={[0.081, 0.1, 0]} rotation={[0, 0, t * 9 * s.fanOn]}>{[0, 1, 2, 3, 4].map((k) => <mesh key={k} rotation={[k * 1.256, 0, 0]} position={[0.001, 0, 0]}><boxGeometry args={[0.004, 0.06, 0.018]} /><meshStandardMaterial color="#222" /></mesh>)}</group>
          <Cyl p={[0.32, 0.06, -0.15]} r={0.035} h={0.62} c="#c9ccd0" m={0.85} rough={0.35} rot={[0, -0.45, Math.PI / 2]} />
        </group>}
        {s.batt > 0.01 && <group position={[X - 1.05, 0, Z + 0.45]} scale={ease(s.batt)}>
          <Box p={[0, 0.08, 0]} s={[0.15, 0.16, 0.1]} c="#1d1f22" r={0.5} />
          <Box p={[-0.04, 0.17, 0]} s={[0.025, 0.02, 0.025]} c="#c0392b" /><Box p={[0.04, 0.17, 0]} s={[0.025, 0.02, 0.025]} c="#222" />
          <Box p={[0.16, 0.05, 0.02]} s={[0.07, 0.05, 0.05]} c="#e5e5e5" r={0.4} />
          <mesh position={[0.16, 0.085, 0.02]} rotation={[0, s.knob * 4, 0]}><cylinderGeometry args={[0.018, 0.018, 0.025, 20]} /><meshStandardMaterial color="#d33" roughness={0.4} /></mesh>
        </group>}
      </group>;
    }
    if (KIND === "ext") {
      const r = 0.12, h = 0.62;
      return <group>
        <Cyl p={[X, Y + h / 2 + 0.02, Z]} r={r} h={h} c="#ffffff" map={gt.red} m={0.35} rough={0.4} e="#ff3a10" ei={0.1 * fl} op={shell < 1 ? shell : undefined} seg={36} />
        <mesh position={[X, Y + h + 0.02, Z]}><sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={gt.red} metalness={0.35} roughness={0.4} transparent={shell < 1} opacity={shell} /></mesh>
        <HoleTube p={[X, Y + 0.06, Z]} r={0.035} h={0.46 * ease(s.tube)} on={fl} blue={s.blue} rows={3} op={s.tube < 0.02 ? 0 : undefined} t={t} />
        <Cyl p={[X, Y + 0.05, Z]} r={0.09} h={0.04} c="#232324" m={0.7} rough={0.5} op={s.bowl < 0.02 ? 0 : undefined} />
        {/* la persiana: arandela que tapa la entrada de aire de abajo */}
        <mesh position={[X, Y + 0.012, Z + r + 0.01]} rotation={[0, 0, s.shutter * 2.2]}><ringGeometry args={[0.012, 0.035, 24, 1, 0, Math.PI * 2 * (1 - s.shutter * 0.6)]} /><meshStandardMaterial color="#b9bcc0" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} /></mesh>
        {/* 3 patas de varilla */}
        {[0, 1, 2].map((k) => <Cyl key={k} p={[X + Math.cos(k * 2.09) * 0.1, Y - 0.04, Z + Math.sin(k * 2.09) * 0.1]} r={0.008} h={0.14} c="#333" m={0.8} />)}
      </group>;
    }
    if (KIND === "can") {
      const r = 0.1, h = 0.19;
      return <group>
        <Cyl p={[X, Y + h / 2, Z]} r={r} h={h} c="#ffffff" map={gt.can} m={0.6} rough={0.35} e="#ff3a10" ei={0.06 * fl} op={shell < 1 ? shell : undefined} seg={36} />
        {/* el aserrín apretado (se ve en corte) y el agujero del medio; el aceite que sube como mecha (wick) */}
        {s.sawdust > 0.01 && <Cyl p={[X, Y + 0.004 + h * 0.43 * ease(s.sawdust), Z]} r={r - 0.004} h={h * 0.86 * ease(s.sawdust)} c="#c79a5a" map={gt.dust} rough={0.95} />}
        {s.wick > 0.01 && <Cyl p={[X, Y + 0.004 + h * 0.43 * s.wick, Z]} r={r - 0.003} h={h * 0.86 * s.wick} c="#2a1a0a" rough={0.3} m={0.2} op={0.55} />}
        {s.hole > 0.01 && <Cyl p={[X, Y + h * 0.5, Z]} r={0.022} h={h * 0.9 * ease(s.hole)} c="#0b0806" rough={1} />}
        {/* la tapa como control: se corre y deja una rendija */}
        {s.lid > 0.01 && <Cyl p={[X + 0.12 * s.lidOpen, Y + h + 0.006 + (1 - ease(s.lid)) * 0.5, Z]} r={r + 0.004} h={0.01} c="#a9aeb2" m={0.8} rough={0.3} />}
        <group position={[X, Y + h, Z]}><Flame t={t} on={fl * (1 - 0.6 * s.lidOpen * 0)} blue={s.blue} glow={tx.flake} w={0.12} h={0.22 * (1 - 0.5 * s.lid * (1 - s.lidOpen))} /></group>
      </group>;
    }
    if (KIND === "ammo") {
      const w = 0.32, hh = 0.2, d = 0.16;
      return <group>
        <Box p={[X, Y + hh / 2, Z]} s={[w, hh, d]} c="#ffffff" map={gt.olive} m={0.45} r={0.55} e="#ff3a10" ei={0.08 * fl} op={shell < 1 ? shell : undefined} rad={0.012} />
        {/* la tapa con bisagra (se levanta cuando se saca la junta) */}
        <group position={[X, Y + hh + 0.005, Z - d / 2]} rotation={[-1.2 * s.lidOpen, 0, 0]}>
          <Box p={[0, 0.012, d / 2]} s={[w + 0.01, 0.025, d + 0.01]} c="#ffffff" map={gt.olive} m={0.45} r={0.55} rad={0.008} />
          {s.gasket > 0.01 && <Box p={[0, -0.002, d / 2]} s={[w - 0.02, 0.006, d - 0.02]} c="#111" r={0.9} op={s.gasket} />}
        </group>
        <HoleTube p={[X, Y + 0.02, Z]} r={0.03} h={0.16 * ease(s.tube)} on={fl} blue={s.blue} rows={3} op={s.tube < 0.02 ? 0 : undefined} t={t} />
        <Cyl p={[X, Y + 0.02, Z]} r={0.065} h={0.03} c="#232324" m={0.7} rough={0.5} op={s.bowl < 0.02 ? 0 : undefined} />
        {/* la puertita de abajo */}
        {s.door > 0.01 && <mesh position={[X - w / 2 - 0.002, Y + 0.06, Z]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.07 * s.door + 0.001, 0.07 * s.door + 0.001]} /><meshBasicMaterial color={new THREE.Color("#120402").lerp(new THREE.Color(flameCol), fl).getStyle()} toneMapped={false} /></mesh>}
        {/* el ventilador en su caja fría con el caño de secadora */}
        {s.fan > 0.01 && <group position={[X - 0.62, 0, Z + 0.25]} scale={ease(s.fan)}>
          <Box p={[0, 0.09, 0]} s={[0.14, 0.14, 0.14]} c="#8a8f94" m={0.6} r={0.4} />
          <group position={[0.071, 0.09, 0]} rotation={[t * 9 * s.fanOn, 0, 0]}>{[0, 1, 2, 3, 4].map((k) => <mesh key={k} rotation={[k * 1.256, 0, 0]}><boxGeometry args={[0.004, 0.055, 0.016]} /><meshStandardMaterial color="#222" /></mesh>)}</group>
          <Cyl p={[0.3, 0.05, -0.12]} r={0.035} h={0.5} c="#c9ccd0" m={0.85} rough={0.35} rot={[0, -0.4, Math.PI / 2]} />
        </group>}
      </group>;
    }
    // tank: tanque de compresor de 20 galones, parado
    const r = 0.2, h = 0.78;
    return <group>
      <Cyl p={[X, Y + h / 2, Z]} r={r} h={h} c="#ffffff" map={gt.steel} m={0.6} rough={0.45} e="#ff3a10" ei={0.1 * fl} op={shell < 1 ? shell : undefined} seg={40} />
      <mesh position={[X, Y + h, Z]}><sphereGeometry args={[r, 40, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={gt.steel} metalness={0.6} roughness={0.45} transparent={shell < 1} opacity={shell * 0.999} scale={[1, 0.35, 1]} /></mesh>
      {/* la puerta cortada a 4" del piso (se dobla para arriba) */}
      {s.door > 0.01 && <group position={[X, Y + 0.16, Z + r + 0.002]}>
        <mesh><planeGeometry args={[0.15 * s.door + 0.001, 0.12 * s.door + 0.001]} /><meshBasicMaterial color={new THREE.Color("#120402").lerp(new THREE.Color(flameCol), fl).getStyle()} toneMapped={false} /></mesh>
        <group position={[0, 0.06, 0.004]} rotation={[-1.3 * s.doorOpen, 0, 0]}><mesh position={[0, -0.06, 0]}><boxGeometry args={[0.15, 0.12, 0.004]} /><meshStandardMaterial color="#45484c" metalness={0.7} roughness={0.5} /></mesh></group>
      </group>}
      {/* el cuenco (fondo de otro tanque) y el tubo secundario de 2" con agujeros de 1/4" */}
      <Cyl p={[X, Y + 0.05, Z]} r={0.1} h={0.075} c="#232324" m={0.7} rough={0.5} op={s.bowl < 0.02 ? 0 : undefined} />
      <HoleTube p={[X, Y + 0.025, Z]} r={0.025} h={0.36 * ease(s.tube)} on={fl} blue={s.blue} rows={8} op={s.tube < 0.02 ? 0 : undefined} t={t} />
      {/* la plancha de 1/4" arriba (cocina) con la zona caliente junto al caño */}
      {s.plate > 0.01 && <group position={[0, (1 - ease(s.plate)) * 0.8, 0]}>
        <Box p={[X + 0.06, Y + h + 0.075, Z]} s={[0.36, 0.014, 0.26]} c="#2b2b2c" m={0.8} r={0.35} e="#ff3a10" ei={0.12 * fl * s.plateHot} rad={0.004} />
        {s.kettle > 0.01 && <group position={[X + 0.1, Y + h + 0.1, Z]} scale={ease(s.kettle)}>
          <Cyl p={[0, 0.06, 0]} r={0.075} r2={0.09} h={0.12} c="#c8ccd0" m={0.9} rough={0.25} />
          <Cyl p={[0.09, 0.08, 0]} r={0.01} h={0.1} c="#c8ccd0" m={0.9} rough={0.25} rot={[0, 0, -0.9]} />
        </group>}
      </group>}
      {/* el estante para botas con el escudo de chapa, del lado izquierdo */}
      {s.rack > 0.01 && <group position={[X - r - 0.06, Y + 0.45, Z]} scale={[ease(s.rack), 1, 1]}>
        <Box p={[0, 0, 0]} s={[0.006, 0.42, 0.34]} c="#9aa0a6" m={0.85} r={0.3} rad={0.002} />
        {[0.12, -0.02, -0.14].map((y, k) => <Cyl key={k} p={[-0.15, y, 0]} r={0.006} h={0.34} c="#3a3a3a" m={0.8} rot={[Math.PI / 2, 0, 0]} />)}
        {s.boots > 0.01 && [-0.08, 0.08].map((z, k) => <group key={k} position={[-0.16, 0.06 + (1 - ease(s.boots)) * 0.4, z]} rotation={[Math.PI, 0, 0]}>
          <Box p={[0, 0.05, 0]} s={[0.08, 0.16, 0.07]} c="#6b4423" r={0.75} />
          <Box p={[0.04, 0.12, 0]} s={[0.14, 0.04, 0.07]} c="#4a2f18" r={0.8} />
        </group>)}
      </group>}
    </group>;
  })();
  const topY = PIPE_Y;
  const pipeX = KIND === "tank" ? X : KIND === "ammo" ? X + 0.08 : X;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.62} threshold={0.97} exposure={1.25 + 0.2 * s.dawn} env={0.45 + 0.1 * s.dawn} />
      <color attach="background" args={[new THREE.Color("#0a0f1a").lerp(new THREE.Color("#55688a"), s.dawn).getStyle()]} />
      <fogExp2 attach="fog" args={["#0d1422", 0.025]} />
      <hemisphereLight args={[0x8aa0c8, 0x3a3028, 0.95 + 0.5 * s.dawn]} />
      <directionalLight position={[-9, 12, -14]} intensity={0.6} color="#a9c0ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* foco colgante del taller (siempre montado; la intensidad sube con lamp) */}
      <pointLight position={[0.2, 2.75, -0.6]} intensity={2.4 * s.lamp} distance={9} color="#ffd9a0" castShadow />
      <pointLight position={[0, 2.4, 2.6]} intensity={1.6} distance={10} color="#b9ccff" />
      <pointLight position={[-3.2, 1.8, -0.8]} intensity={0.8} distance={4.5} color="#ffe2b0" />
      {/* nieve y suelo afuera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial color="#c9d6ea" roughness={0.95} /></mesh>

      {/* ===== EL GARAGE (frente abierto en z=+3) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow><planeGeometry args={[10, 6]} /><meshStandardMaterial map={gt.floor} color="#8f8a80" roughness={0.88} /></mesh>
      <Box p={[-3.9, 1.6, -3.05]} s={[2.2, 3.2, 0.1]} c="#c9b28a" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[1.95, 1.6, -3.05]} s={[6.1, 3.2, 0.1]} c="#c9b28a" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[-1.7, 0.6, -3.05]} s={[0.9, 1.2, 0.1]} c="#c9b28a" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[-1.7, 2.85, -3.05]} s={[0.9, 0.7, 0.1]} c="#c9b28a" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[-5.05, 1.6, 0]} s={[0.1, 3.2, 6.2]} c="#bfa781" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[5.05, 1.6, -1.42]} s={[0.1, 3.2, 3.36]} c="#bfa781" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[5.05, 1.6, 2.32]} s={[0.1, 3.2, 1.56]} c="#bfa781" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[5.05, 2.65, 0.9]} s={[0.1, 1.1, 1.4]} c="#bfa781" map={gt.osb} r={0.85} rad={0.01} />
      <Box p={[0, 3.25, -1.6]} s={[10.2, 0.08, 3.2]} c="#6d6253" r={0.85} rad={0.01} />
      {[-4, -2, 0, 2, 4].map((x) => <Box key={x} p={[x, 3.12, 0]} s={[0.1, 0.18, 6.1]} c="#7a5c3c" r={0.8} rad={0.01} />)}
      {/* la puerta lateral con su rendija de luz (se entreabre: aire fresco) */}
      <group position={[5.0, 0, 0.9]}>
        <group position={[0, 0, -0.64]} rotation={[0, -0.5 * s.doorAir, 0]}><Box p={[0, 1.07, 0.64]} s={[0.06, 2.0, 1.28]} c="#6e4a2e" r={0.75} rad={0.01} /><Box p={[0.0, 1.07, 0.12]} s={[0.09, 0.08, 0.08]} c="#aaa" m={0.8} r={0.3} /></group>
        <mesh position={[-0.02, 1.0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.04 + 0.5 * s.doorAir, 2.0]} /><meshBasicMaterial color="#d6e4ff" transparent opacity={0.25 + 0.4 * s.doorAir} toneMapped={false} /></mesh>
      </group>
      {/* LA VENTANA con escarcha */}
      <group position={[-1.7, 1.75, -3.02]}>
        <Box p={[0, 0, 0]} s={[0.96, 1.16, 0.08]} c="#e8e4dc" r={0.6} rad={0.01} />
        <mesh position={[0, 0, 0.045]}><planeGeometry args={[0.86, 1.06]} /><meshBasicMaterial color={new THREE.Color("#5f86c9").lerp(new THREE.Color("#cfdcf2"), s.dawn).getStyle()} transparent opacity={0.6} toneMapped={false} /></mesh>
        <mesh position={[0, 0, 0.05]}><planeGeometry args={[0.86, 1.06]} /><meshBasicMaterial map={gt.frost} transparent opacity={s.frost} depthWrite={false} toneMapped={false} /></mesh>
        <Box p={[0, 0, 0.06]} s={[0.03, 1.06, 0.03]} c="#e8e4dc" r={0.6} rad={0.005} />
        <pointLight position={[0, 0, 0.6]} intensity={0.8} distance={4} color="#a9c0ff" />
      </group>
      {/* banco de trabajo con morsa, panel de clavijas con herramientas, carro rojo, estantes con bidones */}
      <group position={[-3.4, 0, -2.62]}>
        <Box p={[0, 0.9, 0]} s={[2.4, 0.07, 0.7]} c="#7a5634" r={0.75} />
        {[[-1.12, -0.3], [1.12, -0.3], [-1.12, 0.3], [1.12, 0.3]].map(([x, z], i) => <Box key={i} p={[x, 0.45, z]} s={[0.08, 0.9, 0.08]} c="#5d4127" r={0.8} />)}
        <Box p={[0, 0.25, 0]} s={[2.3, 0.04, 0.6]} c="#6a4a2c" r={0.8} />
        <Box p={[0.7, 1.0, 0.2]} s={[0.22, 0.12, 0.14]} c="#2d5aa0" m={0.5} r={0.4} />
        <Box p={[0, 1.75, -0.31]} s={[2.2, 1.1, 0.03]} c="#ffffff" map={gt.peg} r={0.8} rad={0.005} />
        {[-0.8, -0.5, -0.2, 0.15, 0.5, 0.85].map((x, i) => <Box key={i} p={[x, 1.7 + (i % 2) * 0.12, -0.27]} s={[0.04, 0.32 - (i % 3) * 0.06, 0.02]} c={i % 2 ? "#b8bcc2" : "#c0392b"} m={0.6} r={0.35} />)}
        <Cyl p={[-0.6, 0.98, 0.1]} r={0.07} h={0.11} c="#e8e2d6" rough={0.4} />
      </group>
      <group position={[-1.55, 0, -2.6]}>
        <Box p={[0, 0.5, 0]} s={[0.7, 0.85, 0.45]} c="#b3241c" m={0.4} r={0.35} />
        {[0.2, 0.4, 0.6, 0.78].map((y) => <Box key={y} p={[0, y, 0.228]} s={[0.62, 0.012, 0.01]} c="#d8d8d8" m={0.9} r={0.2} />)}
        {[[-0.28, -0.18], [0.28, -0.18], [-0.28, 0.18], [0.28, 0.18]].map(([x, z], i) => <Cyl key={i} p={[x, 0.04, z]} r={0.035} h={0.03} c="#111" rot={[Math.PI / 2, 0, 0]} />)}
      </group>
      <group position={[4.62, 0, -2.0]}>
        {[0.35, 0.95, 1.55].map((y) => <Box key={y} p={[0, y, 0]} s={[0.7, 0.03, 1.4]} c="#7d8287" m={0.7} r={0.4} />)}
        {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[(rnd(i, 1) - 0.5) * 0.3, 0.5 + Math.floor(i / 3) * 0.6, -0.5 + (i % 3) * 0.45]} s={[0.16, 0.26, 0.1]} c={["#e8d24a", "#2f6db5", "#d9d4c8"][i % 3]} r={0.5} rad={0.03} />)}
      </group>
      {/* el CO y el matafuego junto a la puerta */}
      <Box p={[4.95, 1.5, -0.1]} s={[0.04, 0.12, 0.12]} c="#f0f0f0" r={0.5} e="#22ff66" ei={0.2} />
      <Cyl p={[4.85, 0.62, 1.85]} r={0.07} h={0.42} c="#c0392b" m={0.35} rough={0.4} />

      {/* ===== TERMÓMETRO DE PARED (°F) ===== */}
      <group position={THERMO}>
        <Box p={[0, 0, 0]} s={[0.4, 2.0, 0.04]} c="#efe7d6" map={gt.scale} r={0.6} rad={0.012} />
        <Box p={[0, 0, -0.01]} s={[0.46, 2.06, 0.03]} c="#5a3a24" r={0.8} rad={0.012} />
        <mesh position={[0, -1.0 + (colH - 0.6) / 2 + 0.2, 0.06]}><cylinderGeometry args={[0.024, 0.024, Math.max(0.01, colH - 0.6), 16]} /><meshStandardMaterial color="#d3201a" emissive="#ff2a1a" emissiveIntensity={0.8} roughness={0.3} toneMapped={false} /></mesh>
        <mesh position={[0, -0.86, 0.06]}><sphereGeometry args={[0.07, 24, 18]} /><meshStandardMaterial color="#d3201a" emissive="#ff2a1a" emissiveIntensity={0.8} roughness={0.25} toneMapped={false} /></mesh>
      </group>
      {/* ===== EL RELOJ ===== */}
      <group position={CLOCK}>
        <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.05, 48]} /><meshStandardMaterial color="#2a2018" roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.018]}><circleGeometry args={[0.3, 48]} /><meshStandardMaterial map={gt.clock} roughness={0.5} emissive="#fff4dd" emissiveIntensity={0.1} /></mesh>
        <group position={[0, 0, 0.03]} rotation={[0, 0, -((s.clock % 12) / 12) * Math.PI * 2]}><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.024, 0.17, 0.008]} /><meshStandardMaterial color="#111" /></mesh></group>
        <group position={[0, 0, 0.038]} rotation={[0, 0, -(s.clock % 1) * Math.PI * 2]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.014, 0.24, 0.008]} /><meshStandardMaterial color="#b3261e" /></mesh></group>
      </group>

      {/* ===== LA BASE DE LADRILLOS y LA ESTUFA ===== */}
      {[[-0.22, -0.16], [0.0, -0.16], [0.22, -0.16], [-0.22, 0.16], [0.0, 0.16], [0.22, 0.16]].map(([dx, dz], i) => <Box key={i} p={[X + dx, 0.06, Z + dz]} s={[0.215, 0.11, 0.3]} c="#8d4a33" map={gt.brick} r={0.9} rad={0.008} />)}
      <group position={[0, (1 - ease(s.stove)) * 2.0, 0]}>{stove}</group>
      {/* la llama dentro (en el cuenco) */}
      {KIND !== "can" && <group position={[X, Y + 0.08, Z]}><Flame t={t} on={fl} blue={s.blue} glow={tx.flake} w={KIND === "drums" ? 0.22 : 0.14} h={KIND === "ammo" ? 0.14 : 0.32} /></group>}
      <pointLight position={[X, Y + 0.25, Z + 0.45]} intensity={fl * 3.5} distance={6} color={flameCol} />
      {/* la chimenea: sube recto y sale por el techo, con su damper */}
      {s.pipe > 0.01 && <group>
        <Cyl p={[pipeX, topY + (3.3 - topY) * ease(s.pipe) / 2, Z]} r={0.05} h={(3.3 - topY) * ease(s.pipe)} c="#2a2a2b" rough={0.45} m={0.8} e="#ff3a10" ei={0.03 * fl} />
        {s.damper > 0.01 && <mesh position={[pipeX + 0.07, topY + 0.6, Z]} rotation={[0, 0, Math.PI / 2 - s.damperAng * 1.2]}><cylinderGeometry args={[0.006, 0.006, 0.12, 8]} /><meshStandardMaterial color="#c0392b" /></mesh>}
      </group>}
      {s.smoke > 0.01 && <Leak t={t} from={[pipeX, 3.35, Z]} to={[pipeX + 0.5, 5.4, Z - 0.6]} amt={s.smoke} glow={tx.flake} n={34} spread={0.35} col={smokeCol.getStyle()} size={0.2} />}
      {/* el calor que sale de la chapa (ondas naranjas hacia el cuarto) */}
      <Leak t={t} from={[X, Y + 0.4, Z]} to={[X - 1.6, 1.6, Z + 1.6]} amt={s.radiate * fl} glow={tx.flake} n={30} spread={0.7} col="#ff9a4a" size={0.08} />
      {/* el aire nuevo que entra por los agujeros del tubo (azul) */}
      <Leak t={t} from={[X, Y + 0.03, Z + 0.35]} to={[X, Y + 0.3, Z]} amt={s.air} glow={tx.flake} n={24} spread={0.12} col="#7fc0ff" size={0.05} />

      {/* ===== EL GOTEO: bidón colgado a un costado, válvula de aguja y línea de cobre que entra por el agujero chico ===== */}
      {s.jug > 0.01 && <group>
        <group position={[JUG[0], JUG[1] + (1 - ease(s.jug)) * 1.2, JUG[2]]}>
          <Box p={[0, 0, 0.06]} s={[0.16, 0.24, 0.1]} c="#e9e3cf" r={0.4} op={0.92} rad={0.03} />
          <Box p={[0, -0.04, 0.06]} s={[0.14, 0.12 * s.oil, 0.08]} c="#1c130b" r={0.3} rad={0.02} />
          <Cyl p={[0, -0.15, 0.06]} r={0.012} h={0.05} c="#c9a24a" m={0.95} rough={0.25} />
          <mesh position={[0.025, -0.15, 0.06]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.02, 12]} /><meshStandardMaterial color="#c9a24a" metalness={0.95} roughness={0.25} /></mesh>
        </group>
        <PathFlow t={t} path={[[JUG[0], JUG[1] - 0.18, JUG[2] + 0.06], [JUG[0], Y + 0.62, JUG[2] + 0.06], [X - 0.25, Y + 0.62, Z], [X - 0.05, Y + 0.24, Z]]} amt={s.drip * 0.8} col="#ffb066" glow={tx.flake} n={14} size={0.035} speed={0.12} />
        <mesh><tubeGeometry args={[new THREE.CatmullRomCurve3([v3([JUG[0], JUG[1] - 0.18, JUG[2] + 0.06]), v3([JUG[0], Y + 0.62, JUG[2] + 0.06]), v3([X - 0.25, Y + 0.62, Z]), v3([X - 0.05, Y + 0.24, Z])]), 40, 0.006, 8, false]} /><meshStandardMaterial color="#c47a45" metalness={0.95} roughness={0.3} /></mesh>
        {/* la gota (una por segundo) que cae y se hace vapor */}
        {s.drip > 0.01 && [0, 1].map((i) => { const u = drop(i); return u < 0.6 ? <mesh key={i} position={[X - 0.05, Y + 0.22 - u / 0.6 * 0.14, Z]}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color="#1c130b" roughness={0.2} /></mesh> : null; })}
      </group>}

      {/* ===== EL SERPENTÍN en la chimenea y el balde abierto (termosifón) ===== */}
      {s.coil > 0.01 && <group>
        {Array.from({ length: Math.floor(14 * ease(s.coil)) }, (_, i) => <mesh key={i} position={[pipeX, topY + 0.12 + i * 0.028, Z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.062, 0.007, 8, 32]} /><meshStandardMaterial color="#c47a45" metalness={0.95} roughness={0.3} emissive="#ff6a2a" emissiveIntensity={0.15 * s.flow} /></mesh>)}
      </group>}
      {s.bucket > 0.01 && <group position={[BUCKET[0], (1 - ease(s.bucket)) * 1.0, BUCKET[2]]}>
        <Cyl p={[0, 0.2, 0]} r={0.15} r2={0.13} h={0.4} c="#e9e7e1" rough={0.5} open op={0.96} />
        <Cyl p={[0, 0.002, 0]} r={0.13} h={0.004} c="#d8d6d0" />
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.145, 32]} /><meshStandardMaterial color={new THREE.Color("#4a6f8a").lerp(new THREE.Color("#c9604a"), s.waterHot).getStyle()} roughness={0.1} metalness={0.2} transparent opacity={0.85} /></mesh>
        <Leak t={t} from={[0, 0.38, 0]} to={[0.05, 0.9, 0.05]} amt={s.waterHot * 0.6} glow={tx.flake} n={14} spread={0.2} col="#eef2f8" size={0.08} />
      </group>}
      {s.bucket > 0.01 && s.coil > 0.01 && <>
        <mesh><tubeGeometry args={[new THREE.CatmullRomCurve3([v3([BUCKET[0] - 0.1, 0.05, BUCKET[2]]), v3([BUCKET[0] - 0.25, 0.1, BUCKET[2] - 0.15]), v3([pipeX + 0.05, topY + 0.1, Z + 0.05])]), 30, 0.007, 8, false]} /><meshStandardMaterial color="#c47a45" metalness={0.95} roughness={0.3} /></mesh>
        <mesh><tubeGeometry args={[new THREE.CatmullRomCurve3([v3([pipeX + 0.05, topY + 0.5, Z + 0.05]), v3([BUCKET[0] - 0.2, 0.6, BUCKET[2] - 0.1]), v3([BUCKET[0] - 0.08, 0.36, BUCKET[2]])]), 30, 0.007, 8, false]} /><meshStandardMaterial color="#c47a45" metalness={0.95} roughness={0.3} /></mesh>
        <PathFlow t={t} path={[[BUCKET[0] - 0.1, 0.05, BUCKET[2]], [BUCKET[0] - 0.25, 0.1, BUCKET[2] - 0.15], [pipeX + 0.05, topY + 0.1, Z + 0.05]]} amt={s.flow} col="#5fb8ff" glow={tx.flake} n={16} size={0.05} speed={0.2} />
        <PathFlow t={t} path={[[pipeX + 0.05, topY + 0.5, Z + 0.05], [BUCKET[0] - 0.2, 0.6, BUCKET[2] - 0.1], [BUCKET[0] - 0.08, 0.36, BUCKET[2]]]} amt={s.flow} col="#ff7a4a" glow={tx.flake} n={16} size={0.05} speed={0.2} />
      </>}

      {/* ===== SOLAR (caja de munición): panel en el techo, cable que baja, controlador y batería en el estante ===== */}
      {s.panel > 0.01 && <group position={[PANEL[0], PANEL[1] + (1 - ease(s.panel)) * 1.5, PANEL[2]]} rotation={[-0.95 * s.tilt - 0.15, 0, 0]}>
        <Box p={[0, 0, 0]} s={[0.62, 0.025, 0.42]} c="#ffffff" map={gt.cells} m={0.4} r={0.15} rad={0.006} e="#7fb0ff" ei={0.25 * s.sun} />
        <Box p={[0, -0.015, 0]} s={[0.64, 0.01, 0.44]} c="#c0c4c8" m={0.9} r={0.3} rad={0.004} />
      </group>}
      {s.sun > 0.01 && <sprite position={[PANEL[0] + 3, PANEL[1] + 4, PANEL[2] + 6]} scale={[5, 5, 1]}><spriteMaterial map={tx.flake} color="#ffe7a8" transparent opacity={0.5 * s.sun} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} toneMapped={false} /></sprite>}
      {s.ctrl > 0.01 && <group position={[4.88, 1.2, -1.2]} scale={ease(s.ctrl)}>
        <Box p={[0, 0, 0]} s={[0.04, 0.14, 0.2]} c="#2b5fa8" m={0.3} r={0.4} />
        {[[-0.05, "#3ae86a"], [0.0, "#ffcc33"], [0.05, "#ff4a3a"]].map(([z, c], i) => <mesh key={i} position={[-0.022, 0.04, z as number]} rotation={[0, -Math.PI / 2, 0]}><circleGeometry args={[0.008, 12]} /><meshBasicMaterial color={c as string} toneMapped={false} transparent opacity={i === 0 ? 0.3 + 0.7 * s.charge : 0.25} /></mesh>)}
        <Box p={[0, -0.24, 0]} s={[0.12, 0.13, 0.16]} c="#1d1f22" r={0.5} />
      </group>}
      {s.cable > 0.01 && <>
        <mesh><tubeGeometry args={[new THREE.CatmullRomCurve3([v3([PANEL[0], PANEL[1] - 0.05, PANEL[2]]), v3([4.4, 3.1, -1.6]), v3([4.86, 2.2, -1.25]), v3([4.86, 1.28, -1.2])]), 40, 0.006, 8, false]} /><meshStandardMaterial color="#111" roughness={0.5} /></mesh>
        <PathFlow t={t} path={[[PANEL[0], PANEL[1] - 0.05, PANEL[2]], [4.4, 3.1, -1.6], [4.86, 2.2, -1.25], [4.86, 1.28, -1.2]]} amt={s.cable * s.sun} col="#ffd36a" glow={tx.flake} n={22} size={0.05} speed={0.3} />
        <mesh><tubeGeometry args={[new THREE.CatmullRomCurve3([v3([4.86, 1.0, -1.2]), v3([4.5, 0.06, -0.9]), v3([X - 0.62 + 0.0, 0.06, Z + 0.25])]), 40, 0.006, 8, false]} /><meshStandardMaterial color="#111" roughness={0.5} /></mesh>
        <PathFlow t={t} path={[[4.86, 1.0, -1.2], [4.5, 0.06, -0.9], [X - 0.62, 0.06, Z + 0.25]]} amt={s.cable * s.fanOn} col="#ffd36a" glow={tx.flake} n={22} size={0.04} speed={0.25} />
      </>}

      {/* ===== RÓTULOS CON TIZA (datos dentro de la escena) ===== */}
      {(PL.labs ?? []).map((L, i) => {
        const k = cl((t - L.at) / 0.5) * (1 - cl((t - L.out) / 0.5)); if (k <= 0.01) return null;
        const sc = (L.s ?? 0.5);
        return <mesh key={i} position={L.p} rotation={[0, L.ry ?? 0, 0]} scale={[sc * (0.9 + 0.1 * k), sc * 0.25 * (0.9 + 0.1 * k), 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={chalk(L.txt, L.col ?? "#fff3c4")} transparent opacity={k} depthWrite={false} toneMapped={false} /></mesh>;
      })}
      {/* el ambiente se entibia con la temperatura */}
      <pointLight position={[0, 1.2, 0.5]} intensity={0.9 * s.warm} distance={8} color="#ff9a5a" />
    </ThreeCanvas>
  );
};
