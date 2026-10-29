// tdc30agua (desde tdccalor3) · EL MUNDO: el taller de Claudio de noche en pleno invierno, en corte (le falta la pared del frente).
// En el centro, la ESTUFA DE TAMBOR de 200 L ACOSTADO sobre ladrillos, con su caño de 12 cm que sube 4 m por el techo.
// Alrededor, LA BATERÍA: 48 ladrillos en 3 filas de fondo a cada lado, a 10 cm de la chapa, con la tira de chapa arriba;
// cada fila se carga (brilla) a su ritmo y descarga de a poco toda la noche. Pared del fondo: el termómetro gigante,
// el RELOJ de la noche (22 h → 6 h) y la chapa reflectora detrás de la estufa. Adelante aparece EL LADRILLO GIGANTE
// EN CORTE: el calor entra como lava por los poros y sale despacito (y el hueco, que lo deja escapar). La guía sobre el banco.
// UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- medidas del mundo ----------------
// el tambor: radio 0,29, largo 0,88, acostado con el eje en z; la tapa con la puerta mira al frente (+z)
export const DR = 0.29, DL = 0.88;
export const DRUM: V = [1.4, 0.41, -1.6];
const FRONT_Z = DRUM[2] + DL / 2;          // tapa de adelante (puerta)
const PIPE_Z = DRUM[2] - 0.26;              // agujero de 12 cm arriba, hacia atrás
// la batería: ladrillo (x 0,065 · alto 0,24 · largo 0,22), 3 filas de fondo, 4 a lo largo, 2 de alto, a cada lado
const BW = 0.065, BH = 0.24, BLn = 0.22, GAP = 0.10, ROWSTEP = 0.078;
const rowX = (side: number, r: number) => DRUM[0] + side * (DR + GAP + BW / 2 + r * ROWSTEP);
// el ladrillo gigante en corte (10 veces el real, parado de canto, la cara cortada mira a la cámara)
export const GIANT: V = [-1.35, 0, 1.15];
const GW = 2.3, GH = 1.1, GD = 0.65;
// la guía: sobre el banco de la izquierda, debajo de la ventana
export const BOOK: V = [-3.25, 0.94, -1.72];
const ROW: V[] = [-3.95, -3.6, -3.25, -2.9, -2.55].map((x) => [x, 0.94, -1.95] as V);
const SPINE = ["#e05a8a", "#2fb37a", "#e8a21a", "#3d7fd9", "#7b4fd0"];
export const CLOCK: V = [-1.45, 2.5, -2.95];
// el tanque de la pared (termosifón) y la caja de heno
export const TANK: V = [2.35, 1.72, -2.55];
export const HAY: V = [-0.8, 0, -0.85];

// ---------------- puntos del mundo (portales y rótulos HTML) ----------------
export const PT = {
  thermoTop: [-0.35, 2.95, -2.86] as V,
  thermoAt: (v: number) => [-0.35, 0.78 + (2.85 - 0.78) * cl(v / 25), -2.84] as V,
  window: [-2.6, 1.75, -2.9] as V,
  drumDoor: [DRUM[0], DRUM[1] - DR + 0.175, FRONT_Z + 0.01] as V,   // la puerta del tambor = el portal
  drum: [DRUM[0], DRUM[1] + 0.1, DRUM[2] + 0.2] as V,
  drumTop: [DRUM[0], DRUM[1] + DR, DRUM[2]] as V,
  pipeHole: [DRUM[0], DRUM[1] + DR + 0.02, PIPE_Z] as V,
  pipe: [DRUM[0], 2.2, PIPE_Z] as V,
  pipeTop: [DRUM[0], 3.6, PIPE_Z] as V,
  legs: [DRUM[0] + 0.22, 0.06, FRONT_Z - 0.1] as V,
  holes: [DRUM[0], DRUM[1] - DR - 0.01, DRUM[2] + 0.1] as V,
  gap: [DRUM[0] - DR - GAP / 2, 0.3, FRONT_Z - 0.05] as V,
  row: (side: number, r: number) => [rowX(side, r), 0.5, DRUM[2] + 0.2] as V,
  battery: [rowX(-1, 1), 0.3, FRONT_Z] as V,
  strip: [rowX(-1, 1), 0.49, DRUM[2]] as V,
  giant: [GIANT[0], GIANT[1] + GH / 2, GIANT[2] + GD / 2] as V,
  giantHot: [GIANT[0] + GW / 2 - 0.15, GIANT[1] + GH / 2, GIANT[2] + GD / 2] as V,
  clock: CLOCK,
  chair: [-0.35, 0.75, -1.05] as V,
  reflector: [DRUM[0], 1.0, -2.85] as V,
  cup: [rowX(-1, 1), 0.56, DRUM[2] + 0.15] as V,
  door: [4.88, 1.05, 0.9] as V,
  doorGap: [4.88, 0.03, 0.9] as V,
  bucket: [3.6, 0.2, 1.1] as V,
  outside: [0, 1.2, 6] as V,
  pot: [DRUM[0] - 0.1, DRUM[1] + DR + 0.3, DRUM[2] + 0.2] as V,
  tank: [2.35, 1.72, -2.3] as V,
  coil: [DRUM[0] + 0.08, DRUM[1] + DR + 0.75, DRUM[2] - 0.26] as V,
  hay: [-0.8, 0.46, -0.6] as V,
};

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de cámara en mano (muy suave)
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
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

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTallerTex = () => useMemo(() => ({
  // chapa acanalada oxidada (paredes)
  tin: mk(512, 512, (g) => {
    for (let x = 0; x < 512; x++) { const v = 0.5 + 0.5 * Math.sin(x / 512 * Math.PI * 2 * 14); const c = 112 + v * 62; g.fillStyle = `rgb(${c},${c + 4},${c + 8})`; g.fillRect(x, 0, 1, 512); }
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${120 + rnd(i, 1) * 60},${55 + rnd(i, 2) * 30},20,${0.12 + rnd(i, 3) * 0.25})`; g.beginPath(); g.ellipse(rnd(i, 4) * 512, rnd(i, 5) * 512, 6 + rnd(i, 6) * 40, 4 + rnd(i, 7) * 70, 0, 0, 6.3); g.fill(); }
    for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(20,20,20,.5)"; g.fillRect(0, i * 86 + 40, 512, 2); for (let k = 0; k < 14; k++) { g.beginPath(); g.arc(k * 36.6 + 18, i * 86 + 41, 2.2, 0, 6.3); g.fill(); } }
  }, [3, 1]),
  // piso de cemento con manchas de aceite
  floor: mk(512, 512, (g) => {
    g.fillStyle = "#55524c"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { const v = 60 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v - 2},${v - 6},.4)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 14; i++) { const gr = g.createRadialGradient(0, 0, 0, 0, 0, 60); gr.addColorStop(0, "rgba(10,8,6,.55)"); gr.addColorStop(1, "rgba(10,8,6,0)"); g.save(); g.translate(rnd(i, 4) * 512, rnd(i, 5) * 512); g.scale(1 + rnd(i, 6), 0.6 + rnd(i, 7)); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 60, 0, 6.3); g.fill(); g.restore(); }
  }, [3, 2]),
  // ladrillo macizo con la junta de barro marcada
  brick: mk(256, 256, (g) => {
    g.fillStyle = "#8d4a33"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${90 + rnd(i, 1) * 90},${40 + rnd(i, 2) * 30},${25 + rnd(i, 3) * 20},.5)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 3, 3); }
    g.fillStyle = "rgba(196,170,130,.55)"; g.fillRect(0, 0, 256, 7); g.fillRect(0, 0, 7, 256);
  }),
  // óxido + pintura de fábrica del tambor
  drum: mk(512, 256, (g) => {
    g.fillStyle = "#2c2f33"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 220; i++) { g.fillStyle = `rgba(${110 + rnd(i, 1) * 70},${45 + rnd(i, 2) * 25},18,${0.15 + rnd(i, 3) * 0.35})`; g.beginPath(); g.ellipse(rnd(i, 4) * 512, rnd(i, 5) * 256, 4 + rnd(i, 6) * 26, 3 + rnd(i, 7) * 18, 0, 0, 6.3); g.fill(); }
    g.fillStyle = "rgba(0,0,0,.35)"; [40, 128, 216].forEach((y) => g.fillRect(0, y, 512, 5));
  }),
  // escala del termómetro (0-25 °C)
  scale: mk(256, 1024, (g) => {
    g.fillStyle = "#e9e2d2"; g.fillRect(0, 0, 256, 1024);
    g.fillStyle = "#c7bda8"; g.fillRect(0, 0, 10, 1024); g.fillRect(246, 0, 10, 1024);
    const y = (v: number) => 990 - (v / 25) * 930;
    for (let v = 0; v <= 25; v++) { g.fillStyle = "#1b1b1b"; const big = v % 5 === 0; g.fillRect(big ? 150 : 175, y(v) - 2, big ? 80 : 50, big ? 6 : 3); if (big) { g.font = "900 62px Arial"; g.textAlign = "right"; g.fillText(String(v), 140, y(v) + 22); } }
    g.fillStyle = "#2a6fb0"; g.fillRect(150, y(0) - 1, 80, 4);
    g.font = "900 54px Arial"; g.textAlign = "center"; g.fillStyle = "#b3261e"; g.fillText("°C", 128, 1020);
  }),
  // escarcha (helechos de hielo) — la cantidad visible la controla la opacidad
  frost: mk(512, 512, (g) => {
    const fern = (x: number, y: number, a: number, len: number, d: number) => {
      if (d > 4 || len < 6) return;
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      g.strokeStyle = `rgba(235,245,255,${0.55 - d * 0.08})`; g.lineWidth = Math.max(0.6, 3 - d * 0.6);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
      for (let k = 1; k < 5; k++) { const px = x + Math.cos(a) * len * k / 5, py = y + Math.sin(a) * len * k / 5; fern(px, py, a + 0.9, len * 0.42, d + 1); fern(px, py, a - 0.9, len * 0.42, d + 1); }
    };
    for (let i = 0; i < 26; i++) { const edge = i % 4; const x = edge === 0 ? 0 : edge === 1 ? 512 : rnd(i, 1) * 512, y = edge === 2 ? 0 : edge === 3 ? 512 : rnd(i, 2) * 512; const a = Math.atan2(256 - y, 256 - x) + (rnd(i, 3) - 0.5) * 1.2; fern(x, y, a, 90 + rnd(i, 4) * 120, 0); }
    const gr = g.createRadialGradient(256, 256, 80, 256, 256, 360); gr.addColorStop(0, "rgba(230,242,255,0)"); gr.addColorStop(1, "rgba(230,242,255,.55)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  }),
  // esfera del reloj de pared (las horas de la noche)
  clock: mk(512, 512, (g) => {
    g.fillStyle = "#efe7d6"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill();
    g.strokeStyle = "#2a2018"; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 240, 0, 6.3); g.stroke();
    g.fillStyle = "#1b1b1b"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2 - Math.PI / 2; g.font = "900 64px Arial"; g.fillText(String(h), 256 + Math.cos(a) * 180, 256 + Math.sin(a) * 180); }
    for (let m = 0; m < 60; m++) { const a = m / 60 * Math.PI * 2; const r0 = m % 5 ? 222 : 210; g.lineWidth = m % 5 ? 3 : 7; g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * 232, 256 + Math.sin(a) * 232); g.stroke(); }
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx; open?: boolean }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 20, r2, op, map, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} map={map} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);

// nube de puntos (THREE.Points: el pase GTAO esconde los sprites; con sprites salían CUADRADOS oscuros)
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
// partículas de calor que viajan de A a B (brasas de luz)
const Leak: React.FC<{ t: number; from: V; to: V; amt: number; col?: string; n?: number; glow: THREE.Texture; spread?: number; size?: number }> = ({ t, from, to, amt, col = "#ff8a3d", n = 26, glow, spread = 0.25, size = 0.16 }) => {
  if (amt < 0.01) return null;
  const A = v3(from), B = v3(to);
  const pts = Array.from({ length: n }, (_, i) => {
    const ph = ((t * (0.22 + rnd(i, 1) * 0.18) + rnd(i, 2)) % 1);
    const q = A.clone().lerp(B, ph);
    q.x += (rnd(i, 3) - 0.5) * spread + Math.sin(t * 2 + i) * 0.04; q.y += (rnd(i, 4) - 0.5) * spread + Math.sin(ph * 6 + i) * 0.05; q.z += (rnd(i, 5) - 0.5) * spread;
    return [q.x, q.y, q.z, amt * Math.sin(ph * Math.PI) * 0.9] as [number, number, number, number];
  });
  return <Dots pts={pts} col={col} size={size * 2.0} glow={glow} />;
};
// nieve que cae afuera
const Snow: React.FC<{ t: number; glow: THREE.Texture }> = ({ t, glow }) => {
  const pts = Array.from({ length: 220 }, (_, i) => {
    const x = (rnd(i, 1) - 0.5) * 26, z = rnd(i, 2) < 0.6 ? 4 + rnd(i, 3) * 12 : -3.6 - rnd(i, 3) * 6;
    const y = 6 - ((t * (0.35 + rnd(i, 4) * 0.3) + rnd(i, 5) * 6) % 6.2);
    return [x + Math.sin(t * 0.8 + i) * 0.15, y, z, 0.8] as [number, number, number, number];
  });
  return <Dots pts={pts} col="#dfe9ff" size={0.09} glow={glow} />;
};
// llamas dentro del tambor (lenguas de luz) + brasas sobre la rejilla
const Fire: React.FC<{ t: number; on: number; glow: THREE.Texture }> = ({ t, on, glow }) => {
  if (on < 0.01) return null;
  return <group>
    {Array.from({ length: 16 }, (_, i) => {
      const ph = (t * (1.4 + rnd(i, 1)) + rnd(i, 2)) % 1;
      return <sprite key={i} position={[(rnd(i, 3) - 0.5) * 0.36, 0.02 + ph * 0.26, (rnd(i, 4) - 0.5) * 0.6]} scale={[0.2 * (1 - ph * 0.6), 0.26 * (1 - ph * 0.5), 1]}>
        <spriteMaterial map={glow} color={ph < 0.4 ? "#ffd27a" : "#ff6a1f"} transparent opacity={on * (1 - ph) * 0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>;
    })}
    {Array.from({ length: 12 }, (_, i) => <mesh key={"b" + i} position={[(rnd(i, 7) - 0.5) * 0.34, 0.0, (rnd(i, 8) - 0.5) * 0.6]}><sphereGeometry args={[0.025 + rnd(i, 9) * 0.025, 8, 6]} /><meshBasicMaterial color={new THREE.Color("#3a0d04").lerp(new THREE.Color("#ff7a1a"), on * (0.6 + 0.4 * Math.sin(t * 3 + i)))} toneMapped={false} /></mesh>)}
  </group>;
};

// ---------------- EL LADRILLO GIGANTE EN CORTE: el calor entra como lava por los poros ----------------
// fill: hasta dónde llegó el calor (0 = frío, 1 = lleno); out: cuánto ya devolvió; hollow: el ladrillo hueco (el calor se va por los agujeros)
const LAVA_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const LAVA_FS = `
uniform float uT, uFill, uOut, uHollow; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int k=0;k<5;k++){ v+=a*n(p); p*=2.03; a*=0.5; } return v; }
void main(){
  vec2 uv = vUv;
  // el calor llega por la derecha (la cara que mira al tambor) y avanza hacia la izquierda como lava
  float x = 1.0 - uv.x;
  float flow = fbm(vec2(uv.x*6.0 + uT*0.35, uv.y*3.0 - uT*0.12));
  float front = uFill*1.15 - x + (flow-0.5)*0.28;
  float heat = smoothstep(-0.02, 0.22, front);
  heat *= (1.0 - uOut*0.82);
  // venas que corren (lava) y poros (puntitos oscuros que se encienden al último)
  float veins = smoothstep(0.55, 0.75, fbm(vec2(uv.x*14.0 - uT*0.6, uv.y*9.0 + uT*0.2)));
  vec2 pc = uv*vec2(46.0, 22.0); float pore = step(0.86, h(floor(pc))) * smoothstep(0.42, 0.18, length(fract(pc)-0.5));
  vec3 cold = vec3(0.42,0.20,0.13) * (0.82 + 0.3*fbm(uv*22.0));
  vec3 hot = mix(vec3(1.0,0.32,0.05), vec3(1.0,0.82,0.35), veins*0.9);
  vec3 col = mix(cold, hot*1.6, heat);
  col = mix(col, col*0.35, pore*(1.0-heat*0.6));
  // el ladrillo hueco: tres agujeros grandes; el calor pasa derecho y se escapa
  if (uHollow > 0.5) {
    for (int k=0;k<3;k++){ vec2 c = vec2(0.22 + float(k)*0.28, 0.5); vec2 d = abs(uv - c) - vec2(0.09, 0.28);
      if (max(d.x,d.y) < 0.0) { float esc = smoothstep(0.0, 0.3, front); col = mix(vec3(0.02,0.02,0.03), vec3(1.0,0.45,0.1)*0.6, esc*(0.5+0.5*sin(uT*4.0+uv.y*20.0))*0.35); } }
    col *= 0.85;
  }
  // borde del corte (canto más oscuro)
  float edge = smoothstep(0.0, 0.015, min(min(uv.x,1.0-uv.x), min(uv.y,1.0-uv.y)));
  gl_FragColor = vec4(col*mix(0.45,1.0,edge), 1.0);
}`;
const LavaFace: React.FC<{ t: number; fill: number; out: number; hollow: number; w: number; h: number }> = ({ t, fill, out, hollow, w, h }) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: LAVA_VS, fragmentShader: LAVA_FS, uniforms: { uT: { value: 0 }, uFill: { value: 0 }, uOut: { value: 0 }, uHollow: { value: 0 } }, toneMapped: false }), []);
  mat.uniforms.uT.value = t; mat.uniforms.uFill.value = fill; mat.uniforms.uOut.value = out; mat.uniforms.uHollow.value = hollow;
  return <mesh material={mat}><planeGeometry args={[w, h]} /></mesh>;
};

// ---------------- LA GUÍA: páginas REALES del PDF (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};
// resaltador sobre la página (u 0-1 a lo ancho, v 0-1 de arriba abajo)
const PW = 0.29, PD = 0.438;
const uv = (u: number, v: number): V => [-PW / 2 + u * PW, 0.0009, -PD / 2 + v * PD];
const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  if (k <= 0.01) return null;
  const w = (u1 - u0) * PW * k, c = uv(u0, v);
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useTallerTex();
  const pg = useImgTex(["m1_p001", "m2_p001", "m3_p001", "m4_p001", "m5_p001", "m2_p055", "m4_p065"]);
  const s = ST(t);                // estado del taller en este instante (tl.ts)
  const fireL = s.fire * (0.93 + 0.07 * Math.sin(t * 2.1) * Math.sin(t * 1.3 + 0.7));
  const colH = 0.78 + (2.85 - 0.78) * cl(s.temp / 25);
  const heatCol = (k: number) => new THREE.Color("#2a2420").lerp(new THREE.Color("#ff5a1a"), k).getStyle();
  // el reloj: s.clock = hora decimal (22 → 30 = 6 de la mañana)
  const hr = s.clock % 12, hA = -(hr / 12) * Math.PI * 2, mA = -((s.clock % 1)) * Math.PI * 2;
  const smokeCol = new THREE.Color("#cfd6e0").lerp(new THREE.Color("#0a0a0a"), s.smokeBlack);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.7} threshold={0.85} exposure={1.4 + 0.25 * s.dawn} env={0.2 + 0.15 * s.dawn} />
      <color attach="background" args={[new THREE.Color("#060a12").lerp(new THREE.Color("#4a5f80"), s.dawn).getStyle()]} />
      <fogExp2 attach="fog" args={["#0a1120", 0.03]} />
      <hemisphereLight args={[0x6a86c0, 0x2a2420, 0.85 + 0.6 * s.dawn]} />
      {/* luna (luz fría por la ventana y el frente) */}
      <directionalLight position={[-9, 12, -14]} intensity={0.75} color="#9fb8ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <Snow t={t} glow={tx.flake} />
      <pointLight position={[0, 2.7, 2.2]} intensity={2.2} distance={13} color="#9fb8ff" />
      <pointLight position={[2.6, 1.4, -0.4]} intensity={1.0} distance={3.2} color="#8fb0ff" />
      <pointLight position={[-3.2, 1.6, 0.8]} intensity={0.9} distance={4} color="#9fb8ff" />
      <mesh position={[-30, 26, -70]}><circleGeometry args={[2.6, 40]} /><meshBasicMaterial color="#f3f0e2" fog={false} toneMapped={false} /></mesh>
      <sprite position={[-30, 26, -69.5]} scale={[26, 26, 1]}><spriteMaterial map={tx.flake} color="#8fa8ff" transparent opacity={0.4 * (1 - s.dawn)} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></sprite>

      {/* suelo nevado afuera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial color="#c9d6ea" roughness={0.95} /></mesh>

      {/* ===== EL TALLER (frente abierto en z=+3) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow><planeGeometry args={[10, 6]} /><meshStandardMaterial map={tt.floor} color="#8a857c" roughness={0.9} /></mesh>
      <Box p={[-4.0, 1.6, -3.05]} s={[2.0, 3.2, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[1.4, 1.6, -3.05]} s={[7.2, 3.2, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[-2.6, 0.55, -3.05]} s={[0.8, 1.1, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[-2.6, 2.85, -3.05]} s={[0.8, 0.7, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[-5.05, 1.6, 0]} s={[0.1, 3.2, 6.2]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[5.05, 1.6, -1.42]} s={[0.1, 3.2, 3.36]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[5.05, 1.6, 2.32]} s={[0.1, 3.2, 1.56]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[5.05, 2.65, 0.9]} s={[0.1, 1.1, 1.4]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[0, 3.25, -1.6]} s={[10.2, 0.08, 3.2]} c="#5d564c" map={tt.tin} r={0.8} m={0.3} rad={0.01} />
      {[-4, -2, 0, 2, 4].map((x) => <Box key={x} p={[x, 3.1, 0]} s={[0.12, 0.16, 6.1]} c="#4a3626" r={0.9} rad={0.01} />)}
      {/* la puerta (cerrada) con su rendija */}
      <group position={[5.0, 0, 0.9]}>
        <Box p={[0, 1.07, 0]} s={[0.06, 2.0, 1.28]} c="#5b3b26" r={0.8} rad={0.01} />
        <Box p={[0.0, 1.07, -0.52]} s={[0.09, 0.08, 0.08]} c="#888" m={0.7} r={0.4} />
        <mesh position={[-0.02, 0.035, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.28, 0.05]} /><meshBasicMaterial color="#cfe0ff" transparent opacity={0.3} toneMapped={false} /></mesh>
      </group>

      {/* LA VENTANA del fondo: escarcha por dentro (se derrite al amanecer con la batería) */}
      <group position={[-2.6, 1.75, -3.02]}>
        <Box p={[0, 0, 0]} s={[0.86, 1.16, 0.08]} c="#3a2c22" r={0.8} rad={0.01} />
        <mesh position={[0, 0, 0.045]}><planeGeometry args={[0.76, 1.06]} /><meshBasicMaterial color={new THREE.Color("#5f86c9").lerp(new THREE.Color("#c9d9f0"), s.dawn).getStyle()} transparent opacity={0.55} toneMapped={false} /></mesh>
        <mesh position={[0, 0, 0.05]}><planeGeometry args={[0.76, 1.06]} /><meshBasicMaterial map={tt.frost} transparent opacity={s.frost} depthWrite={false} toneMapped={false} /></mesh>
        <Box p={[0, 0, 0.06]} s={[0.03, 1.06, 0.03]} c="#3a2c22" r={0.8} rad={0.005} />
        <Box p={[0, 0, 0.06]} s={[0.76, 0.03, 0.03]} c="#3a2c22" r={0.8} rad={0.005} />
        <pointLight position={[0, 0, 0.6]} intensity={0.9} distance={4} color="#8fb0ff" />
      </group>

      {/* ===== EL TERMÓMETRO GIGANTE (pared del fondo) ===== */}
      <group position={[-0.35, 0, -2.97]}>
        <Box p={[0, 1.72, 0]} s={[0.46, 2.66, 0.04]} c="#efe7d6" map={tt.scale} r={0.6} rad={0.012} />
        <Box p={[0, 1.72, -0.01]} s={[0.52, 2.72, 0.03]} c="#5a3a24" r={0.8} rad={0.012} />
        <Cyl p={[0.0, 1.8, 0.08]} r={0.045} h={2.2} c="#dfefff" rough={0.05} m={0} op={0.25} seg={24} />
        <mesh position={[0, (0.6 + colH) / 2, 0.08]}><cylinderGeometry args={[0.028, 0.028, colH - 0.6, 16]} /><meshStandardMaterial color="#d3201a" emissive="#ff2a1a" emissiveIntensity={0.9} roughness={0.3} toneMapped={false} /></mesh>
        <mesh position={[0, 0.55, 0.08]}><sphereGeometry args={[0.1, 24, 18]} /><meshStandardMaterial color="#d3201a" emissive="#ff2a1a" emissiveIntensity={0.9} roughness={0.25} toneMapped={false} /></mesh>
        <pointLight position={[0, colH - 0.1, 0.4]} intensity={0.6 + 0.04 * s.temp} distance={2.2} color="#ff5a3a" />
        {/* la marca fantasma: dónde estaría SIN ladrillos (línea azul) */}
        {s.ghost > 0.01 && <mesh position={[0, 0.78 + (2.85 - 0.78) * cl(s.ghostTemp / 25), 0.09]}><boxGeometry args={[0.6 * ease(s.ghost), 0.022, 0.01]} /><meshBasicMaterial color="#5fb8ff" toneMapped={false} /></mesh>}
      </group>

      {/* ===== EL RELOJ DE LA NOCHE ===== */}
      {s.clockOn > 0.01 && <group position={CLOCK} scale={ease(s.clockOn)}>
        <mesh position={[0, 0, -0.01]}><cylinderGeometry args={[0.36, 0.36, 0.05, 48]} /><meshStandardMaterial color="#2a2018" roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.33, 48]} /></mesh>
        <mesh position={[0, 0, 0.018]}><circleGeometry args={[0.33, 48]} /><meshStandardMaterial map={tt.clock} roughness={0.5} emissive="#fff4dd" emissiveIntensity={0.12} /></mesh>
        <group position={[0, 0, 0.03]} rotation={[0, 0, hA]}><mesh position={[0, 0.09, 0]}><boxGeometry args={[0.026, 0.19, 0.008]} /><meshStandardMaterial color="#111" /></mesh></group>
        <group position={[0, 0, 0.038]} rotation={[0, 0, mA]}><mesh position={[0, 0.13, 0]}><boxGeometry args={[0.016, 0.27, 0.008]} /><meshStandardMaterial color="#b3261e" /></mesh></group>
        <mesh position={[0, 0, 0.045]}><circleGeometry args={[0.02, 16]} /><meshBasicMaterial color="#111" /></mesh>
      </group>}

      {/* ===== LA ESTUFA DE TAMBOR ACOSTADO ===== */}
      <group position={[0, (1 - ease(s.drum)) * 2.4, 0]}>
        {/* patas de ladrillo (el aire entra por abajo) */}
        {s.legs > 0.01 && [[-0.18, -0.3], [0.18, -0.3], [-0.18, 0.3], [0.18, 0.3]].map(([x, z], i) => <Box key={i} p={[DRUM[0] + x, 0.06, DRUM[2] + z]} s={[0.11, 0.12 * ease(s.legs), 0.22]} c="#8d4a33" map={tt.brick} r={0.95} rad={0.006} />)}
        {/* el tambor (la chapa se pone al rojo oscuro con el fuego; sin ladrillos se enfría rápido) */}
        <mesh position={DRUM} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><cylinderGeometry args={[DR, DR, DL, 40, 1, true]} /><meshStandardMaterial map={tt.drum} color="#ffffff" roughness={0.55} metalness={0.6} emissive="#ff3a10" emissiveIntensity={0.28 * s.drumHot} side={THREE.DoubleSide} /></mesh>
        {/* aros del tambor */}
        {[-0.29, 0, 0.29].map((dz) => <mesh key={dz} position={[DRUM[0], DRUM[1], DRUM[2] + dz]}><torusGeometry args={[DR + 0.006, 0.012, 8, 48]} /><meshStandardMaterial color="#1d1f22" metalness={0.7} roughness={0.5} emissive="#ff3a10" emissiveIntensity={0.2 * s.drumHot} /></mesh>)}
        {/* tapa de atrás */}
        <mesh position={[DRUM[0], DRUM[1], DRUM[2] - DL / 2]} rotation={[0, Math.PI, 0]}><circleGeometry args={[DR, 40]} /><meshStandardMaterial color="#26282b" metalness={0.6} roughness={0.55} /></mesh>
        {/* tapa de adelante con la PUERTA de 20 × 15 (borde de abajo a 10 cm del piso del tambor) */}
        <group position={[DRUM[0], DRUM[1], FRONT_Z]}>
          <mesh><circleGeometry args={[DR, 40]} /><meshStandardMaterial color="#26282b" metalness={0.6} roughness={0.55} emissive="#ff3a10" emissiveIntensity={0.15 * s.drumHot} /></mesh>
          {/* la boca encendida */}
          <mesh position={[0, -DR + 0.175, 0.003]}><planeGeometry args={[0.2 * s.doorCut + 0.001, 0.15 * s.doorCut + 0.001]} /><meshBasicMaterial color={new THREE.Color("#120402").lerp(new THREE.Color("#ff8a2a"), fireL)} toneMapped={false} /></mesh>
          {/* la hoja de la puerta (bisagra a la izquierda; a medio abrir) */}
          {s.doorCut > 0.5 && <group position={[-0.1, -DR + 0.175, 0.006]} rotation={[0, -1.1 * s.doorOpen, 0]}><mesh position={[0.1, 0, 0]}><boxGeometry args={[0.2, 0.15, 0.004]} /><meshStandardMaterial color="#1b1c1e" metalness={0.7} roughness={0.5} /></mesh><Box p={[0.17, 0, 0.012]} s={[0.04, 0.014, 0.02]} c="#777" m={0.8} r={0.4} rad={0.003} /></group>}
          {/* las medidas, dibujadas con tiza sobre la tapa */}
          {s.measure > 0.01 && <group position={[0, 0, 0.008]}>
            <mesh position={[0, -DR + 0.175, 0]}><ringGeometry args={[0.0, 0.001, 4]} /></mesh>
            <mesh position={[0, -DR + 0.175 - 0.075 - 0.05, 0]}><planeGeometry args={[0.004, 0.1 * ease(s.measure)]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>
            <mesh position={[0, -DR + 0.175 + 0.095, 0]}><planeGeometry args={[0.2 * ease(s.measure), 0.004]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>
          </group>}
        </group>
        {/* la rejilla de varillas de 6 mm a 8 cm del fondo y el fuego encima */}
        {s.grate > 0.01 && <group position={[DRUM[0], DRUM[1] - DR + 0.08, DRUM[2]]}>
          {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.15 + i * 0.05, 0, (1 - ease(s.grate)) * 0.6]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, DL - 0.08, 6]} /><meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.4} /></mesh>)}
        </group>}
        <group position={[DRUM[0], DRUM[1] - DR + 0.1, DRUM[2]]}><Fire t={t} on={s.fire} glow={tx.flake} /></group>
        <pointLight position={[DRUM[0], 0.35, FRONT_Z + 0.4]} intensity={fireL * 5} distance={7} color="#ff8a3d" castShadow />
        {/* los 6 agujeros de 3 cm de abajo (se ven encendidos desde abajo) */}
        {s.holes > 0.01 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[DRUM[0] + (i % 2 ? 0.06 : -0.06), DRUM[1] - DR + 0.004 + 0.02, DRUM[2] - 0.2 + Math.floor(i / 2) * 0.2]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.015 * ease(s.holes), 16]} /><meshBasicMaterial color={new THREE.Color("#110402").lerp(new THREE.Color("#ff9a3a"), 0.3 + fireL * 0.7)} toneMapped={false} side={THREE.DoubleSide} /></mesh>)}
        {/* el caño de 12 cm: 4 m hacia afuera por el techo */}
        {s.pipe > 0.01 && <>
          <Cyl p={[DRUM[0], DRUM[1] + DR + 2.0 * ease(s.pipe), PIPE_Z]} r={0.06} h={4.0 * ease(s.pipe)} c="#2a2a2b" rough={0.45} m={0.8} e="#ff3a10" ei={0.04 * s.fire} />
          <Cyl p={[DRUM[0], DRUM[1] + DR + 4.0 * ease(s.pipe) + 0.05, PIPE_Z]} r={0.11} r2={0.08} h={0.1} c="#2a2a2b" m={0.8} />
        </>}
      </group>
      {/* lo que sale por el caño: transparente (bien) o negro (le falta aire) */}
      {s.smoke > 0.01 && <Leak t={t} from={[DRUM[0], DRUM[1] + DR + 4.1, PIPE_Z]} to={[DRUM[0] + 0.6, DRUM[1] + DR + 6.5, PIPE_Z - 0.4]} amt={s.smoke} glow={tx.flake} n={34} spread={0.35} col={smokeCol.getStyle()} size={0.35} />}
      {/* el calor que se va por la chapa SIN ladrillos (rojo, hacia arriba y afuera) */}
      <Leak t={t} from={[DRUM[0], DRUM[1] + 0.2, DRUM[2]]} to={[DRUM[0] - 0.4, 3.1, DRUM[2] + 0.6]} amt={s.leakUp} glow={tx.flake} n={30} spread={0.6} col="#ff6a3a" size={0.12} />
      {/* el aire de los 10 cm: sube por la rendija entre chapa y ladrillo y lame la cara del ladrillo */}
      {[-1, 1].map((sd) => <Leak key={sd} t={t} from={[DRUM[0] + sd * (DR + GAP / 2), 0.05, DRUM[2]]} to={[DRUM[0] + sd * (DR + GAP / 2 + 0.03), 0.75, DRUM[2]]} amt={s.gapFlow} glow={tx.flake} n={22} spread={0.5} col="#ffb257" size={0.06} />)}
      {/* la batería devolviendo el calor al cuarto (de noche) */}
      {[-1, 1].map((sd) => <Leak key={"r" + sd} t={t} from={[rowX(sd, 2), 0.3, DRUM[2]]} to={[rowX(sd, 2) + sd * 1.4, 1.2, DRUM[2] + 1.0]} amt={s.release} glow={tx.flake} n={24} spread={0.6} col="#ff9a4a" size={0.07} />)}

      {/* ===== LA BATERÍA: 48 ladrillos (2 lados × 3 filas × 4 de largo × 2 de alto), a 10 cm de la chapa ===== */}
      {Array.from({ length: 48 }, (_, i) => {
        // orden de armado: primero la fila pegada al aire (r=0), de abajo arriba, los dos lados
        const r = Math.floor(i / 16), j = i % 16, side = j < 8 ? -1 : 1, jj = j % 8, h = Math.floor(jj / 4), k = jj % 4;
        const kk = cl(s.battery * 48 - i); if (kk <= 0) return null;
        const drop = (1 - ease(kk)) * 1.0;
        const heat = s.charge[r];
        return <Box key={i} p={[rowX(side, r), 0.12 + h * (BH + 0.004) + drop, DRUM[2] + (k - 1.5) * (BLn + 0.006)]} s={[BW, BH, BLn]} c="#8d4a33" map={tt.brick} r={0.95} e={heatCol(heat)} ei={0.35 * heat} rad={0.006} />;
      })}
      {/* la tira de chapa arriba */}
      {s.strip > 0.01 && [-1, 1].map((sd) => <Box key={sd} p={[rowX(sd, 1), 0.49 + (1 - ease(s.strip)) * 0.4, DRUM[2]]} s={[3 * ROWSTEP + 0.01, 0.006, DL + 0.04]} c="#9aa1a8" m={0.8} r={0.35} rad={0.002} />)}
      {/* la regla de los 10 cm (amarilla) entre la chapa y la primera fila */}
      {s.ruler > 0.01 && <group position={[DRUM[0] - DR - GAP / 2, 0.52, FRONT_Z - 0.02]}>
        <mesh><boxGeometry args={[GAP * ease(s.ruler), 0.03, 0.006]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>
        {[-1, 1].map((d) => <mesh key={d} position={[d * GAP / 2 * ease(s.ruler), 0, 0]}><boxGeometry args={[0.006, 0.08, 0.006]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>)}
      </group>}
      {/* la taza de café sobre la fila de arriba (6:30 de la mañana) */}
      {s.cup > 0.01 && <group position={[rowX(-1, 1), 0.495, DRUM[2] + 0.15]} scale={ease(s.cup)}>
        <Cyl p={[0, 0.045, 0]} r={0.04} h={0.09} c="#f2efe8" rough={0.3} />
        <mesh position={[0, 0.086, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.036, 24]} /><meshStandardMaterial color="#2a160a" roughness={0.2} /></mesh>
        <mesh position={[0.05, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.022, 0.006, 6, 14, Math.PI]} /><meshStandardMaterial color="#f2efe8" /></mesh>
        <Leak t={t} from={[0, 0.1, 0]} to={[0.05, 0.5, -0.03]} amt={s.cup} glow={tx.flake} n={14} spread={0.05} col="#e8eef7" size={0.05} />
      </group>}

      {/* la CHAPA REFLECTORA detrás de la estufa, con aire atrás */}
      {s.reflector > 0.01 && <Box p={[DRUM[0], 0.8, -2.85]} s={[1.6 * ease(s.reflector), 1.4, 0.008]} c="#c9cdd2" m={0.9} r={0.18} rad={0.003} />}
      {s.reflector > 0.3 && <Leak t={t} from={[DRUM[0], 0.6, -2.8]} to={[DRUM[0], 0.9, -1.0]} amt={s.reflector * s.fire} glow={tx.flake} n={18} spread={0.6} col="#ffb257" size={0.07} />}

      {/* ===== LA SILLA a un metro y medio de la batería (secreto 6) ===== */}
      {s.chair > 0.01 && <group position={[-0.35, 0, DRUM[2] + 0.45]} rotation={[0, Math.PI / 2 + 0.25, 0]} scale={ease(s.chair)}>
        <Box p={[0, 0.45, 0]} s={[0.46, 0.05, 0.44]} c="#6b4a2c" map={tx.planks} r={0.8} rad={0.01} />
        <Box p={[0, 0.78, -0.2]} s={[0.46, 0.6, 0.04]} c="#6b4a2c" map={tx.planks} r={0.8} rad={0.01} />
        {[[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].map(([x, z], i) => <Box key={i} p={[x, 0.22, z]} s={[0.04, 0.44, 0.04]} c="#4a3220" />)}
        <Box p={[0, 0.5, 0.05]} s={[0.5, 0.06, 0.5]} c="#6b2f2a" map={tx.rug} r={1} rad={0.03} />
      </group>}
      {/* la distancia: 1,5 m dibujado en el piso */}
      {s.dist > 0.01 && <mesh position={[(rowX(-1, 2) - 0.35) / 2 - 0.05, 0.012, DRUM[2] + 0.45]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[(rowX(-1, 2) + 0.35) * ease(s.dist), 0.02]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>}

      {/* ===== EL LADRILLO GIGANTE EN CORTE (aparece adelante, en medio del taller) ===== */}
      {s.giant > 0.01 && <group position={[GIANT[0], GIANT[1], GIANT[2]]} scale={[ease(s.giant), ease(s.giant), ease(s.giant)]}>
        <Box p={[0, GH / 2, 0]} s={[GW, GH, GD]} c="#7d3f2a" map={tt.brick} r={0.95} rad={0.02} />
        <group position={[0, GH / 2, GD / 2 + 0.002]}><LavaFace t={t} fill={s.lava} out={s.lavaOut} hollow={s.hollow} w={GW - 0.01} h={GH - 0.01} /></group>
        <pointLight position={[0, GH / 2, GD / 2 + 0.8]} intensity={s.lava * (1 - s.lavaOut * 0.8) * 3} distance={4} color="#ff7a2a" />
        {/* lo que entra por la derecha (del tambor) y lo que devuelve despacito hacia adelante */}
        <Leak t={t} from={[GW / 2 + 1.2, GH / 2, 0]} to={[GW / 2 - 0.1, GH / 2, 0.1]} amt={s.lavaIn} glow={tx.flake} n={30} spread={0.7} col="#ffb257" size={0.12} />
        <Leak t={t} from={[0, GH / 2, GD / 2]} to={[0, GH / 2 + 0.6, GD / 2 + 1.8]} amt={s.lavaOut * s.lava * (1 - s.hollow)} glow={tx.flake} n={30} spread={1.6} col="#ff9a4a" size={0.1} />
        {/* el hueco: el calor se le escapa derecho por los agujeros */}
        <Leak t={t} from={[-0.2, GH / 2, 0]} to={[-GW / 2 - 1.2, GH / 2 + 0.4, 0.2]} amt={s.hollow * s.lava} glow={tx.flake} n={36} spread={0.5} col="#ff6a3a" size={0.12} />
      </group>}

      {/* ===== EL LADRILLO HÚMEDO que revienta (secreto 1 / seguridad) ===== */}
      {s.damp > 0.01 && <group position={[DRUM[0] + 0.7, 0, FRONT_Z + 0.35]}>
        {s.boom < 0.02 && <Box p={[0, 0.06, 0]} s={[0.23, 0.11, 0.065]} c="#6a3424" map={tt.brick} r={0.6} rad={0.006} />}
        <Leak t={t} from={[0, 0.12, 0]} to={[0.05, 0.6, 0]} amt={s.damp * (1 - s.boom) * 0.45} glow={tx.flake} n={10} spread={0.1} col="#c9d2dc" size={0.045} />
        {s.boom > 0.01 && Array.from({ length: 9 }, (_, i) => {
          const a = rnd(i, 1) * Math.PI * 2, v = 0.8 + rnd(i, 2) * 1.4, k = ease(s.boom);
          return <Box key={i} p={[Math.cos(a) * v * k, 0.06 + Math.sin(Math.PI * k) * (0.4 + rnd(i, 3) * 0.5), Math.sin(a) * v * k * 0.6]} s={[0.05 + rnd(i, 4) * 0.05, 0.04, 0.04]} rot={[k * 6 * rnd(i, 5), k * 4, 0]} c="#6a3424" r={0.9} rad={0.004} />;
        })}
      </group>}

      {/* los ladrillos de papel (parte 1) en una pila, y el balde de cenizas con tapa */}
      <group position={[0.35, 0, -0.55]}>
        {Array.from({ length: 9 }, (_, i) => <Box key={"pb" + i} p={[(i % 3) * 0.17 - 0.17, 0.05 + Math.floor(i / 3) * 0.1, 0]} s={[0.15, 0.09, 0.1]} c="#7d7a72" r={1} rad={0.01} />)}
      </group>
      <group position={[3.6, 0, 1.1]}>
        <Cyl p={[0, 0.17, 0]} r={0.15} r2={0.13} h={0.34} c="#8a9097" m={0.8} rough={0.35} />
        <Cyl p={[0, 0.35 + (1 - ease(s.lid)) * 0.2, 0]} r={0.16} h={0.02} c="#7a8087" m={0.8} rough={0.35} />
      </group>
      {/* la leña seca apilada */}
      <group position={[3.3, 0, -2.5]}>
        {Array.from({ length: 14 }, (_, i) => <Cyl key={i} p={[(i % 5) * 0.13 - 0.26, 0.06 + Math.floor(i / 5) * 0.11, 0]} r={0.055} h={0.5} rot={[Math.PI / 2, 0, 0]} c={["#6e4a2c", "#7d5734", "#5e3e24"][i % 3]} rough={0.95} />)}
      </group>

      {/* tablero perforado con herramientas */}
      <Box p={[3.4, 2.15, -2.97]} s={[1.4, 1.0, 0.03]} c="#3b2a1e" r={0.9} rad={0.005} />
      {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[2.85 + i * 0.14, 2.1 + (i % 3) * 0.06, -2.93]} s={[0.035, 0.36 + rnd(i, 3) * 0.2, 0.025]} c={["#9aa3ad", "#c9302c", "#6f6f6f", "#d4a017"][i % 4]} r={0.4} m={0.7} rad={0.008} />)}
      {/* lámpara colgante de trabajo */}
      <group position={[0.2, 2.75, -0.6]}>
        <Cyl p={[0, 0.2, 0]} r={0.004} h={0.4} c="#111" />
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.26, 0.18, 24, 1, true]} /><meshStandardMaterial color="#2c332c" side={THREE.DoubleSide} metalness={0.5} roughness={0.5} /></mesh>
        <mesh position={[0, -0.04, 0]}><sphereGeometry args={[0.05, 12, 10]} /><meshBasicMaterial color={new THREE.Color("#333").lerp(new THREE.Color("#fff1cf"), s.lamp)} toneMapped={false} /></mesh>
        <spotLight position={[0, -0.05, 0]} angle={1.0} penumbra={0.8} intensity={s.lamp * 22} distance={8} color="#ffd7a0" castShadow target-position={[0.6, 0, -0.4]} />
      </group>
      {/* banco de trabajo (izquierda, bajo la ventana) */}
      <Box p={[-3.25, 0.9, -1.9]} s={[2.4, 0.08, 0.8]} c="#7a5236" map={tx.planks} r={0.8} rad={0.01} />
      {[[-4.35, -1.55], [-2.15, -1.55], [-4.35, -2.25], [-2.15, -2.25]].map(([x, z], i) => <Box key={i} p={[x, 0.45, z]} s={[0.08, 0.9, 0.08]} c="#4a3220" />)}
      {s.books < 0.5 && <>
        <mesh position={[-3.9, 0.97, -1.95]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.012, 8, 40]} /><meshStandardMaterial color="#b8733a" metalness={0.85} roughness={0.3} /></mesh>
        <Box p={[-2.7, 1.0, -1.85]} s={[0.23, 0.065, 0.11]} c="#8d4a33" map={tt.brick} r={0.95} rad={0.006} />
        <Box p={[-2.45, 1.0, -1.95]} s={[0.23, 0.065, 0.11]} c="#8d4a33" map={tt.brick} r={0.95} rad={0.006} rot={[0, 0.4, 0]} />
      </>}
      {/* ===== LA GUÍA «El Invierno Sin Gas»: 5 manuales; el 1 (Ladrillos de calor) avanza y se abre en su página real ===== */}
      {s.books > 0.01 && [0, 1, 2, 3, 4].map((i) => {
        const isHero = i === s.hb;
        const stack: V = [-3.25, 0.94 + i * 0.05, -1.95], rowP = ROW[i];
        let p: V = [lerp(stack[0], rowP[0], ease(s.row)), lerp(stack[1], rowP[1], ease(s.row)) + Math.sin(Math.PI * s.row) * 0.08 * (i % 2 ? 1 : 0.6), lerp(stack[2], rowP[2], ease(s.row))];
        let rot = lerp(0.05 * (i - 2), 0.02 * (i - 2), s.row);
        if (isHero) { p = [lerp(p[0], BOOK[0], ease(s.hero)), p[1] + Math.sin(Math.PI * s.hero) * 0.09, lerp(p[2], BOOK[2], ease(s.hero))]; rot = lerp(rot, 0, s.hero); }
        else { const j = i < s.hb ? i : i - 1; p = [lerp(p[0], -3.9 + j * 0.36 + (j > 1 ? 0.75 : 0), ease(s.hero)), p[1], lerp(p[2], -2.08, ease(s.hero))]; }
        p = [p[0], p[1] + (1 - ease(s.books)) * 0.6, p[2]];
        const cover = pg[`m${i + 1}_p001`];
        const left = s.set === "p55" ? pg.m2_p055_r : pg.m4_p065_r, right = s.set === "p55" ? pg.m2_p055 : pg.m4_p065;
        return <Book key={i} p={p} rotY={rot} open={isHero ? s.open : 0} cover={cover} inside={left} right={right} spine={SPINE[i]}>
          {/* p74: el título · la columna de tu cuarto · la fila de tu frío · p71: el título · medio kilo de leña · la garrafa = 60 */}
          {isHero && s.open > 0.9 && s.set === "p74" && <>
            <PageHi k={s.hi[0]} u0={0.08} u1={0.9} v={0.075} h={0.055} />
            <PageHi k={s.hi[1]} u0={0.08} u1={0.31} v={0.345} h={0.115} col="#ff9a4a" />
            <PageHi k={s.hi[2]} u0={0.31} u1={0.92} v={0.262} h={0.045} col="#7dff9e" />
          </>}
          {isHero && s.open > 0.9 && s.set === "p71" && <>
            <PageHi k={s.hi[0]} u0={0.08} u1={0.93} v={0.075} h={0.085} />
            <PageHi k={s.hi[1]} u0={0.42} u1={0.95} v={0.36} h={0.04} col="#ff9a4a" />
            <PageHi k={s.hi[2]} u0={0.42} u1={0.95} v={0.442} h={0.045} col="#7dff9e" />
          </>}
        </Book>;
      })}

      {/* ===== EL AGUA: la olla arriba del tambor · el serpentín adentro + el tanque en la pared (termosifón) · el serpentín del caño + su bidón · la caja de heno ===== */}
      {s.pot > 0.01 && <group position={[DRUM[0] - 0.1, DRUM[1] + DR, DRUM[2] + 0.2]} scale={ease(s.pot)}>
        <Cyl p={[0, 0.13, 0]} r={0.15} h={0.26} c="#b9bdc3" m={0.85} rough={0.32} />
        <Cyl p={[0, 0.268, 0]} r={0.156} h={0.014} c="#a5a9af" m={0.85} rough={0.3} />
        <Cyl p={[0, 0.29, 0]} r={0.02} h={0.03} c="#222" />
        <Box p={[0.168, 0.2, 0]} s={[0.04, 0.016, 0.05]} c="#8a8e94" m={0.8} r={0.4} rad={0.004} />
        <Box p={[-0.168, 0.2, 0]} s={[0.04, 0.016, 0.05]} c="#8a8e94" m={0.8} r={0.4} rad={0.004} />
        {s.potTap > 0.01 && <Cyl p={[0, 0.04, 0.165]} r={0.012} h={0.06 * ease(s.potTap)} c="#c9a24a" m={0.9} rough={0.3} rot={[Math.PI / 2, 0, 0]} />}
      </group>}
      {s.pot > 0.3 && <Leak t={t} from={[DRUM[0] - 0.1, DRUM[1] + DR + 0.3, DRUM[2] + 0.2]} to={[DRUM[0] - 0.25, DRUM[1] + DR + 1.4, DRUM[2] + 0.1]} amt={s.pot * (0.3 + 0.7 * s.fire)} glow={tx.flake} n={22} spread={0.18} col="#e6edf5" size={0.13} />}
      {s.tank > 0.01 && <group>
        {/* el tanque de 60 L colgado en la pared, más alto que la salamandra, con su caño de ventilación abierto */}
        <Cyl p={[TANK[0], TANK[1] + (1 - ease(s.tank)) * 0.6, TANK[2]]} r={0.24} h={0.78} c="#9aa3ab" m={0.7} rough={0.42} op={ease(s.tank)} />
        <Cyl p={[TANK[0], TANK[1] + 0.4 + (1 - ease(s.tank)) * 0.6, TANK[2]]} r={0.245} h={0.03} c="#7d858d" m={0.7} rough={0.4} op={ease(s.tank)} />
        <Cyl p={[TANK[0], TANK[1] + 1.05, TANK[2]]} r={0.018} h={1.3 * ease(s.tank)} c="#9aa3ab" m={0.7} rough={0.4} />
        <Box p={[TANK[0], TANK[1] - 0.47, TANK[2] + 0.1]} s={[0.5, 0.04, 0.35]} c="#4a3a2a" r={0.8} rad={0.005} />
        {/* caño caliente: sale de arriba del tambor, SUBE siempre y entra arriba del tanque */}
        <Box p={[1.56, (DRUM[1] + DR + 1.98) / 2, -1.88]} s={[0.032, (1.98 - DRUM[1] - DR) * ease(s.tank), 0.032]} c="#c26a3a" m={0.9} r={0.32} rad={0.008} e="#ff4a10" ei={0.25 * s.flow} />
        <Box p={[(1.56 + TANK[0]) / 2, 1.98, -1.88]} s={[(TANK[0] - 1.56) * ease(s.tank), 0.032, 0.032]} c="#c26a3a" m={0.9} r={0.32} rad={0.008} e="#ff4a10" ei={0.25 * s.flow} />
        <Box p={[TANK[0], 1.98, (-1.88 + TANK[2]) / 2]} s={[0.032, 0.032, Math.abs(TANK[2] + 1.88)]} c="#c26a3a" m={0.9} r={0.32} rad={0.008} />
        {/* caño frío: sale del fondo del tanque y baja al serpentín */}
        <Box p={[(1.74 + TANK[0]) / 2, 1.42, -1.84]} s={[(TANK[0] - 1.74) * ease(s.tank), 0.032, 0.032]} c="#c26a3a" m={0.9} r={0.32} rad={0.008} />
        <Box p={[1.74, (DRUM[1] + DR + 1.42) / 2, -1.84]} s={[0.032, (1.42 - DRUM[1] - DR) * ease(s.tank), 0.032]} c="#c26a3a" m={0.9} r={0.32} rad={0.008} />
        <Box p={[TANK[0], 1.42, (-1.84 + TANK[2]) / 2]} s={[0.032, 0.032, Math.abs(TANK[2] + 1.84)]} c="#c26a3a" m={0.9} r={0.32} rad={0.008} />
        {/* el termómetro de reloj en el caño que sube */}
        <Cyl p={[1.56, 1.6, -1.85]} r={0.05} h={0.02} c="#f2efe6" rot={[Math.PI / 2, 0, 0]} />
      </group>}
      {s.flow > 0.01 && <>
        <Leak t={t} from={[1.56, DRUM[1] + DR + 0.05, -1.85]} to={[1.56, 1.98, -1.85]} amt={s.flow} glow={tx.flake} n={18} spread={0.02} col="#ff7a2a" size={0.06} />
        <Leak t={t} from={[1.56, 1.98, -1.85]} to={[TANK[0], 1.98, -1.85]} amt={s.flow} glow={tx.flake} n={14} spread={0.02} col="#ff7a2a" size={0.06} />
        <Leak t={t} from={[TANK[0], 1.42, -1.81]} to={[1.74, 1.42, -1.81]} amt={s.flow} glow={tx.flake} n={14} spread={0.02} col="#5fb8ff" size={0.06} />
        <Leak t={t} from={[1.74, 1.42, -1.81]} to={[1.74, DRUM[1] + DR + 0.05, -1.81]} amt={s.flow} glow={tx.flake} n={14} spread={0.02} col="#5fb8ff" size={0.06} />
      </>}
      {/* el serpentín ADENTRO del tambor, visto como en rayos X */}
      {s.coilIn > 0.01 && Array.from({ length: 11 }, (_, i) => <mesh key={"ci" + i} position={[DRUM[0], DRUM[1], DRUM[2] - 0.36 + i * 0.072]} renderOrder={5}>
        <torusGeometry args={[DR - 0.045, 0.012, 8, 40]} />
        <meshBasicMaterial color={new THREE.Color("#c26a3a").lerp(new THREE.Color("#ffb257"), s.flow)} transparent opacity={s.coilIn * cl(s.coilIn * 11 - i)} depthTest={false} toneMapped={false} />
      </mesh>)}
      {/* el serpentín de AFUERA, enrollado en el caño del humo, y su bidón de 20 L más arriba */}
      {s.coil > 0.01 && Array.from({ length: 26 }, (_, i) => i < s.coil * 26 ? <mesh key={"co" + i} position={[DRUM[0], DRUM[1] + DR + 0.3 + i * 0.036, PIPE_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.074, 0.011, 8, 28]} />
        <meshStandardMaterial color="#c26a3a" metalness={0.9} roughness={0.32} emissive="#ff4a10" emissiveIntensity={0.15 * s.fire} />
      </mesh> : null)}
      {s.wool > 0.01 && <Cyl p={[DRUM[0], DRUM[1] + DR + 0.3 + 0.47, PIPE_Z]} r={0.105} h={0.98 * ease(s.wool)} c="#e3c76a" rough={0.95} />}
      {s.bidon > 0.01 && <group scale={ease(s.bidon)} position={[DRUM[0] + 0.5, DRUM[1] + DR + 1.8, PIPE_Z]}>
        <Box p={[0, 0, 0]} s={[0.24, 0.34, 0.17]} c="#141414" r={0.55} rad={0.02} />
        <Cyl p={[0.06, 0.2, 0]} r={0.03} h={0.05} c="#141414" />
        <Box p={[-0.31, -0.05, 0]} s={[0.38, 0.022, 0.022]} c="#c26a3a" m={0.9} r={0.32} rad={0.006} />
        <Box p={[-0.31, -0.38, 0]} s={[0.022, 0.62, 0.022]} c="#c26a3a" m={0.9} r={0.32} rad={0.006} />
      </group>}
      {/* la caja de heno: cajón de madera con paja apretada, la olla adentro y la tapa */}
      {s.hay > 0.01 && <group position={HAY} scale={ease(s.hay)}>
        <Box p={[0, 0.23, 0]} s={[0.72, 0.46, 0.52]} c="#8a6a44" r={0.85} rad={0.01} />
        <Box p={[0, 0.462, 0]} s={[0.66, 0.012, 0.46]} c="#d9c27a" r={1} rad={0.004} />
        <Cyl p={[0, 0.44, 0]} r={0.13} h={0.06} c="#b9bdc3" m={0.85} rough={0.32} />
        <group position={[0, 0.47, -0.26]} rotation={[-1.9 * s.hayOpen, 0, 0]}><Box p={[0, 0.012, 0.26]} s={[0.74, 0.024, 0.54]} c="#7a5c3a" r={0.85} rad={0.008} /></group>
      </group>}

      {/* ambiente cálido (sube con la temperatura) */}
      <pointLight position={[0.5, 2.0, 0.8]} intensity={0.4 + s.warm * 3.2} distance={10} color="#ffb877" />
    </ThreeCanvas>
  );
};
