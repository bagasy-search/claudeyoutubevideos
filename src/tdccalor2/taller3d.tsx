// tdccalor2 · EL MUNDO: el taller de Claudio de noche en pleno invierno, en corte (le falta la pared del frente).
// Ventana con escarcha que crece por dentro, nieve afuera, luna. En la pared del fondo, el TERMÓMETRO GIGANTE
// (sube con cada calor oculto). La estufa de hierro con su caño que sale por el techo (la boca de la estufa es el portal).
// Los 7 calores ocultos, cada uno en su puesto numerado: 1 víbora de la puerta · 2 aletas de latas en el caño ·
// 3 pared de ladrillos alrededor de la estufa · 4 cajón solar de latas · 5 bidones negros · 6 el cuarto tibio (carpa sobre el catre)
// · 7 el ladrillo refractario. El calor que se escapa se ve: brasas de luz que salen por la rendija, el caño y la ventana.
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

// ---------------- puntos del mundo (portales y rótulos HTML) ----------------
export const STOVE: V = [2.7, 0, -1.6];
export const PT = {
  thermoTop: [-0.2, 2.95, -2.86] as V,
  thermoBulb: [-0.2, 0.55, -2.86] as V,
  thermoAt: (v: number) => [-0.2, 0.78 + (2.85 - 0.78) * cl(v / 25), -2.84] as V, // punta de la columna para un valor
  window: [-2.6, 1.75, -2.9] as V,
  stoveMouth: [2.7, 0.52, -1.32] as V,   // la boca de la estufa = el portal
  flue: [2.7, 2.2, -1.6] as V,
  flueTop: [2.7, 3.45, -1.6] as V,
  doorGap: [4.88, 0.03, 0.9] as V,
  door: [4.88, 1.05, 0.9] as V,
  bricks: [2.7, 0.6, -1.0] as V,
  solar: [-4.0, 1.25, -2.2] as V,
  jugs: [-2.6, 0.3, -2.5] as V,
  cot: [-3.4, 0.55, 1.2] as V,
  brick7: [2.75, 0.84, -1.6] as V,
  bench: (n: number) => BENCH[n - 1].sign,
  outside: [0, 1.2, 6] as V,
};
// los carteles numerados de cada puesto (cuelgan del techo sobre cada invento)
const BENCH: { sign: V }[] = [
  { sign: [4.3, 2.55, 0.9] }, { sign: [3.55, 2.75, -1.6] }, { sign: [1.75, 2.35, -0.9] }, { sign: [-4.0, 2.55, -2.0] },
  { sign: [-1.7, 2.35, -2.3] }, { sign: [-3.4, 2.45, 1.3] }, { sign: [2.0, 1.9, -2.2] },
];

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
  // ladrillo macizo
  brick: mk(256, 128, (g) => {
    g.fillStyle = "#8d4a33"; g.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${90 + rnd(i, 1) * 90},${40 + rnd(i, 2) * 30},${25 + rnd(i, 3) * 20},.5)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 128, 3, 3); }
    g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, 120, 256, 8);
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
    g.fillStyle = "rgba(220,235,255,0)"; g.fillRect(0, 0, 512, 512);
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
  // cartel numerado de cada puesto
  num: Array.from({ length: 7 }, (_, i) => mk(256, 256, (g) => {
    g.fillStyle = "#1d1a16"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#ffb257"; g.lineWidth = 12; g.strokeRect(12, 12, 232, 232);
    g.font = "900 190px Arial"; g.textAlign = "center"; g.fillStyle = "#ffb257"; g.fillText(String(i + 1), 128, 200);
  })),
  // etiqueta de lata de gaseosa (sin marca)
  can: [["#b8202a", "#f2f2f2"], ["#1f6b3a", "#e9e9e9"], ["#c7c9cc", "#2a5fa8"], ["#e3b21c", "#1b1b1b"]].map(([a, b]) => mk(256, 128, (g) => {
    g.fillStyle = a; g.fillRect(0, 0, 256, 128); g.fillStyle = b; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(40 + k * 90, 64, 26, 42, 0.4, 0, 6.3); g.fill(); }
    g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(0, 14, 256, 6);
  })),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 20, r2, op, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} map={map} /></mesh>
);

// lata de gaseosa (abierta = chapa en U para las aletas)
const Can: React.FC<{ p: V; i: number; tex: THREE.Texture[]; black?: number; rot?: V; s?: number }> = ({ p, i, tex, black = 0, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh castShadow><cylinderGeometry args={[0.033, 0.033, 0.122, 18]} /><meshStandardMaterial map={black > 0.5 ? undefined : tex[i % tex.length]} color={black > 0.5 ? "#0c0c0d" : "#ffffff"} roughness={black > 0.5 ? 0.92 : 0.3} metalness={black > 0.5 ? 0.1 : 0.55} /></mesh>
    <mesh position={[0, 0.063, 0]}><cylinderGeometry args={[0.028, 0.033, 0.006, 18]} /><meshStandardMaterial color={black > 0.5 ? "#101010" : "#c9cdd2"} metalness={0.8} roughness={0.3} /></mesh>
  </group>
);

// partículas de calor que se escapan (brasas de luz) a lo largo de un camino
// nube de puntos (THREE.Points: el pase de oclusión GTAO los esconde; con sprites salían CUADRADOS oscuros)
// cada punto: posición + brillo (el brillo hace de opacidad porque la mezcla es aditiva)
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

// partículas de calor que se escapan (brasas de luz) a lo largo de un camino
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

// nieve que cae afuera (frente y detrás de la ventana)
const Snow: React.FC<{ t: number; glow: THREE.Texture }> = ({ t, glow }) => {
  const pts = Array.from({ length: 220 }, (_, i) => {
    const x = (rnd(i, 1) - 0.5) * 26, z = rnd(i, 2) < 0.6 ? 4 + rnd(i, 3) * 12 : -3.6 - rnd(i, 3) * 6;
    const y = 6 - ((t * (0.35 + rnd(i, 4) * 0.3) + rnd(i, 5) * 6) % 6.2);
    return [x + Math.sin(t * 0.8 + i) * 0.15, y, z, 0.8] as [number, number, number, number];
  });
  return <Dots pts={pts} col="#dfe9ff" size={0.09} glow={glow} />;
};

// llamas dentro de la estufa (lenguas de luz) + brasas
const Fire: React.FC<{ t: number; on: number; glow: THREE.Texture }> = ({ t, on, glow }) => {
  if (on < 0.01) return null;
  return <group>
    {Array.from({ length: 14 }, (_, i) => {
      const ph = (t * (1.4 + rnd(i, 1)) + rnd(i, 2)) % 1;
      return <sprite key={i} position={[(rnd(i, 3) - 0.5) * 0.36, 0.08 + ph * 0.32, (rnd(i, 4) - 0.5) * 0.25]} scale={[0.22 * (1 - ph * 0.6), 0.3 * (1 - ph * 0.5), 1]}>
        <spriteMaterial map={glow} color={ph < 0.4 ? "#ffd27a" : "#ff6a1f"} transparent opacity={on * (1 - ph) * 0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>;
    })}
    {Array.from({ length: 10 }, (_, i) => <mesh key={"b" + i} position={[(rnd(i, 7) - 0.5) * 0.4, 0.04, (rnd(i, 8) - 0.5) * 0.3]}><sphereGeometry args={[0.03 + rnd(i, 9) * 0.03, 8, 6]} /><meshBasicMaterial color={new THREE.Color("#3a0d04").lerp(new THREE.Color("#ff7a1a"), on * (0.6 + 0.4 * Math.sin(t * 3 + i)))} toneMapped={false} /></mesh>)}
  </group>;
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
export const BOOK: V = [-0.02, 0.94, -1.74];          // dónde queda el manual abierto (frente del banco)
const ROW: V[] = [-0.42, -0.07, 0.28, 0.63, 0.98].map((x) => [x, 0.94, -1.95] as V);
const SPINE = ["#e05a8a", "#2fb37a", "#e8a21a", "#3d7fd9", "#7b4fd0"];
// resaltador sobre la página (coordenadas de página: u 0-1 a lo ancho, v 0-1 de arriba abajo)
const PW = 0.29, PD = 0.438;
const uv = (u: number, v: number): V => [-PW / 2 + u * PW, 0.0009, -PD / 2 + v * PD];
const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  if (k <= 0.01) return null;
  const w = (u1 - u0) * PW * k, c = uv(u0, v);
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};
// ladrillitos que se paran sobre la página: la pared de 2 de alto a 10 cm de una estufita
const MiniWall: React.FC<{ k: number; tex: THREE.Texture }> = ({ k, tex }) => {
  if (k <= 0.01) return null;
  const [x0, , z0] = uv(0.62, 0.66);
  return <group position={[x0, 0, z0]}>
    <mesh position={[0, 0.022, 0]} castShadow><boxGeometry args={[0.034, 0.044, 0.03]} /><meshStandardMaterial color="#1c1c1d" metalness={0.6} roughness={0.5} /></mesh>
    {Array.from({ length: 10 }, (_, i) => { const kk = cl(k * 10 - i); if (kk <= 0) return null;
      const row = Math.floor(i / 5), c = i % 5, drop = (1 - ease(kk)) * 0.08;
      return <mesh key={i} position={[-0.05 + c * 0.025, 0.007 + row * 0.0135 + drop, -0.035]} castShadow><boxGeometry args={[0.024, 0.013, 0.011]} /><meshStandardMaterial map={tex} color="#c06a4c" roughness={0.9} /></mesh>; })}
  </group>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useTallerTex();
  const pg = useImgTex(["m1_p001", "m2_p001", "m3_p001", "m4_p001", "m5_p001", "m2_p054", "m2_p055", "m1_p070", "m1_p071"]);
  const s = ST(t);                // estado del taller en este instante (tl.ts)
  const fireL = s.fire * (0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 5.3));
  const tempV = s.temp;           // valor del termómetro gigante
  const colH = 0.78 + (2.85 - 0.78) * cl(tempV / 25);
  const hot = new THREE.Color("#2a2420").lerp(new THREE.Color("#ff5a1a"), s.brickHeat);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.7} threshold={0.85} exposure={1.4} env={0.2} />
      <color attach="background" args={["#060a12"]} />
      <fogExp2 attach="fog" args={["#0a1120", 0.03]} />
      <hemisphereLight args={[0x6a86c0, 0x2a2420, 0.85]} />
      {/* luna (luz fría por la ventana y el frente) */}
      <directionalLight position={[-9, 12, -14]} intensity={0.75} color="#9fb8ff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <Snow t={t} glow={tx.flake} />
      {/* relleno frío de luna dentro del taller + recorte azul sobre la estufa (que se lea aunque esté apagada) */}
      <pointLight position={[0, 2.7, 2.2]} intensity={2.2} distance={13} color="#9fb8ff" />
      <pointLight position={[2.2, 1.4, -0.4]} intensity={1.1} distance={3.2} color="#8fb0ff" />
      <pointLight position={[-3.2, 1.6, 0.8]} intensity={0.9} distance={4} color="#9fb8ff" />
      <mesh position={[-30, 26, -70]}><circleGeometry args={[2.6, 40]} /><meshBasicMaterial color="#f3f0e2" fog={false} toneMapped={false} /></mesh>
      <sprite position={[-30, 26, -69.5]} scale={[26, 26, 1]}><spriteMaterial map={tx.flake} color="#8fa8ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></sprite>

      {/* suelo nevado afuera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial color="#c9d6ea" roughness={0.95} /></mesh>

      {/* ===== EL TALLER (frente abierto en z=+3) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow><planeGeometry args={[10, 6]} /><meshStandardMaterial map={tt.floor} color="#8a857c" roughness={0.9} /></mesh>
      {/* pared del fondo con el hueco de la ventana */}
      <Box p={[-4.0, 1.6, -3.05]} s={[2.0, 3.2, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[1.4, 1.6, -3.05]} s={[7.2, 3.2, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[-2.6, 0.55, -3.05]} s={[0.8, 1.1, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[-2.6, 2.85, -3.05]} s={[0.8, 0.7, 0.1]} c="#9a8f80" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      {/* paredes laterales (la derecha con la puerta) */}
      <Box p={[-5.05, 1.6, 0]} s={[0.1, 3.2, 6.2]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[5.05, 1.6, -1.42]} s={[0.1, 3.2, 3.36]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[5.05, 1.6, 2.32]} s={[0.1, 3.2, 1.56]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      <Box p={[5.05, 2.65, 0.9]} s={[0.1, 1.1, 1.4]} c="#8e8476" map={tt.tin} r={0.7} m={0.35} rad={0.01} />
      {/* techo con vigas (sólo la mitad de atrás: la cámara mira desde el frente) */}
      <Box p={[0, 3.25, -1.6]} s={[10.2, 0.08, 3.2]} c="#5d564c" map={tt.tin} r={0.8} m={0.3} rad={0.01} />
      {[-4, -2, 0, 2, 4].map((x) => <Box key={x} p={[x, 3.1, 0]} s={[0.12, 0.16, 6.1]} c="#4a3626" r={0.9} rad={0.01} />)}

      {/* la puerta (cerrada) con la RENDIJA de abajo; la víbora de cámara de bici del puesto 1 */}
      <group position={[5.0, 0, 0.9]}>
        <Box p={[0, 1.07, 0]} s={[0.06, 2.0, 1.28]} c="#5b3b26" r={0.8} rad={0.01} />
        <Box p={[0.0, 1.07, -0.52]} s={[0.09, 0.08, 0.08]} c="#888" m={0.7} r={0.4} />
        <mesh position={[-0.02, 0.035, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.28, 0.05]} /><meshBasicMaterial color="#cfe0ff" transparent opacity={0.55 * (1 - s.snake)} toneMapped={false} /></mesh>
        {s.snake > 0.01 && <mesh position={[-0.12, 0.06, (1 - ease(s.snake)) * 1.6]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.055, 1.2 * ease(s.snake), 6, 14]} /><meshStandardMaterial color="#151515" roughness={0.65} /></mesh>}
      </group>
      {/* aire helado que entra por la rendija (azul) */}
      <Leak t={t} from={[5.0, 0.04, 0.9]} to={[2.6, 0.12, 0.6]} amt={s.coldIn} col="#7fc8ff" n={30} glow={tx.flake} spread={0.9} size={t > 123.3 ? 0.07 : 0.2} />

      {/* LA VENTANA del fondo: marco, vidrio, escarcha que crece por dentro, la luna azul detrás */}
      <group position={[-2.6, 1.75, -3.02]}>
        <Box p={[0, 0, 0]} s={[0.86, 1.16, 0.08]} c="#3a2c22" r={0.8} rad={0.01} />
        <mesh position={[0, 0, 0.045]}><planeGeometry args={[0.76, 1.06]} /><meshBasicMaterial color="#5f86c9" transparent opacity={0.55} toneMapped={false} /></mesh>
        <mesh position={[0, 0, 0.05]}><planeGeometry args={[0.76, 1.06]} /><meshBasicMaterial map={tt.frost} transparent opacity={s.frost} depthWrite={false} toneMapped={false} /></mesh>
        <Box p={[0, 0, 0.06]} s={[0.03, 1.06, 0.03]} c="#3a2c22" r={0.8} rad={0.005} />
        <Box p={[0, 0, 0.06]} s={[0.76, 0.03, 0.03]} c="#3a2c22" r={0.8} rad={0.005} />
        <pointLight position={[0, 0, 0.6]} intensity={0.9} distance={4} color="#8fb0ff" />
        {/* manguera cortada calzada en el borde de la hoja (puesto 1, ventanas) */}
        {s.hose > 0.01 && <mesh position={[0, -0.56, 0.08]} rotation={[0, 0, Math.PI / 2]} scale={[1, ease(s.hose), 1]}><cylinderGeometry args={[0.018, 0.018, 0.8, 10]} /><meshStandardMaterial color="#2f7a3a" roughness={0.5} /></mesh>}
      </group>
      {/* calor que se escapa por la ventana (al principio) */}
      <Leak t={t} from={[-2.6, 1.6, -2.4]} to={[-2.6, 2.2, -3.2]} amt={s.leakWin} glow={tx.flake} n={18} spread={0.5} />

      {/* ===== EL TERMÓMETRO GIGANTE (pared del fondo) ===== */}
      <group position={[-0.2, 0, -2.97]}>
        <Box p={[0, 1.72, 0]} s={[0.46, 2.66, 0.04]} c="#efe7d6" map={tt.scale} r={0.6} rad={0.012} />
        <Box p={[0, 1.72, -0.01]} s={[0.52, 2.72, 0.03]} c="#5a3a24" r={0.8} rad={0.012} />
        {/* tubo de vidrio */}
        <Cyl p={[0.0, 1.8, 0.08]} r={0.045} h={2.2} c="#dfefff" rough={0.05} m={0} op={0.25} seg={24} />
        {/* columna roja (sube) */}
        <mesh position={[0, (0.6 + colH) / 2, 0.08]}><cylinderGeometry args={[0.028, 0.028, colH - 0.6, 16]} /><meshStandardMaterial color="#d3201a" emissive="#ff2a1a" emissiveIntensity={0.9} roughness={0.3} toneMapped={false} /></mesh>
        <mesh position={[0, 0.55, 0.08]}><sphereGeometry args={[0.1, 24, 18]} /><meshStandardMaterial color="#d3201a" emissive="#ff2a1a" emissiveIntensity={0.9} roughness={0.25} toneMapped={false} /></mesh>
        <pointLight position={[0, colH - 0.1, 0.4]} intensity={0.6 + 0.04 * tempV} distance={2.2} color="#ff5a3a" />
        {/* la meta: rayita dorada en 20 °C */}
        {s.goal > 0.01 && <mesh position={[0, 0.78 + (2.85 - 0.78) * 0.8, 0.09]}><boxGeometry args={[0.6 * ease(s.goal), 0.02, 0.01]} /><meshBasicMaterial color="#ffd60a" toneMapped={false} /></mesh>}
      </group>

      {/* tablero perforado con herramientas */}
      <Box p={[2.7, 2.15, -2.97]} s={[1.6, 1.0, 0.03]} c="#3b2a1e" r={0.9} rad={0.005} />
      {Array.from({ length: 10 }, (_, i) => <Box key={i} p={[2.05 + i * 0.145, 2.1 + (i % 3) * 0.06, -2.93]} s={[0.035, 0.36 + rnd(i, 3) * 0.2, 0.025]} c={["#9aa3ad", "#c9302c", "#6f6f6f", "#d4a017"][i % 4]} r={0.4} m={0.7} rad={0.008} />)}

      {/* ===== LA ESTUFA de hierro + el caño que sale por el techo ===== */}
      <group position={STOVE}>
        {[[-0.25, -0.18], [0.25, -0.18], [-0.25, 0.18], [0.25, 0.18]].map(([x, z], i) => <Cyl key={i} p={[x, 0.09, z]} r={0.025} h={0.18} c="#1a1a1a" m={0.6} />)}
        <Box p={[0, 0.48, 0]} s={[0.62, 0.6, 0.48]} c="#1e1e1f" r={0.55} m={0.65} rad={0.03} />
        <Box p={[0, 0.8, 0]} s={[0.68, 0.04, 0.54]} c="#151515" r={0.5} m={0.7} rad={0.01} />
        {/* la boca (puerta con rejilla) */}
        <Box p={[0, 0.47, 0.245]} s={[0.38, 0.3, 0.02]} c="#121212" r={0.5} m={0.7} rad={0.01} />
        <mesh position={[0, 0.47, 0.257]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial color={new THREE.Color("#1a0602").lerp(new THREE.Color("#ff8a2a"), fireL)} toneMapped={false} /></mesh>
        {[-0.1, -0.03, 0.04, 0.11].map((x) => <Box key={x} p={[x, 0.47, 0.262]} s={[0.014, 0.21, 0.01]} c="#0c0c0c" m={0.7} r={0.5} rad={0.003} />)}
        <group position={[0, 0.3, 0]}><Fire t={t} on={s.fire} glow={tx.flake} /></group>
        {s.fire > 0.02 && <pointLight position={[0, 0.5, 0.7]} intensity={fireL * 5} distance={7} color="#ff8a3d" castShadow />}
        {/* caño */}
        <Cyl p={[0, 2.08, 0]} r={0.075} h={2.5} c="#2a2a2b" rough={0.45} m={0.8} e="#ff3a10" ei={0.05 * s.fire} />
        <Cyl p={[0, 3.6, 0]} r={0.12} r2={0.09} h={0.12} c="#2a2a2b" m={0.8} />
        {/* aletas de latas abiertas en U alrededor del caño (puesto 2) */}
        {Array.from({ length: 16 }, (_, i) => {
          const k = cl(s.fins * 16 - i); if (k <= 0) return null;
          const a = (i % 8) * (Math.PI / 4), y = 1.55 + Math.floor(i / 8) * 0.55;
          return <group key={i} position={[0, y, 0]} rotation={[0, a, 0]}><mesh position={[0.075 + 0.06, 0, 0]} scale={[1, k, 1]} castShadow><boxGeometry args={[0.12, 0.36, 0.004]} /><meshStandardMaterial color="#c9cdd2" metalness={0.85} roughness={0.28} /></mesh></group>;
        })}
        {[1.55, 2.1].map((y) => s.fins > 0.2 && <mesh key={y} position={[0, y + 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.08, 0.004, 6, 24]} /><meshStandardMaterial color="#777" metalness={0.8} /></mesh>)}
        {/* la PARED DE LADRILLOS alrededor de la estufa, parados, a 10 cm de la chapa (puesto 3) */}
        {Array.from({ length: 40 }, (_, i) => {
          const k = cl(s.bricks * 40 - i); if (k <= 0) return null;
          const side = i < 14 ? 0 : i < 27 ? 1 : 2, j = side === 0 ? i : side === 1 ? i - 14 : i - 27, row = j % 2, col = Math.floor(j / 2);
          const drop = (1 - ease(k)) * 1.2;
          // lado 0: izquierda, lado 1: derecha (x = ±0.48), lado 2: atrás (z = -0.42)
          const p: V = side === 2 ? [-0.36 + col * 0.12, 0.13 + row * 0.25 + drop, -0.42] : [side === 0 ? -0.48 : 0.48, 0.13 + row * 0.25 + drop, -0.3 + col * 0.12 * (7 / 7)];
          return <Box key={i} p={p} s={side === 2 ? [0.11, 0.24, 0.065] : [0.065, 0.24, 0.11]} c="#8d4a33" map={tt.brick} r={0.95} e={hot.getStyle()} ei={0.09 * s.brickHeat} rad={0.006} />;
        })}
        {/* ladrillo refractario arriba de la estufa (puesto 7) */}
        {s.brick7 > 0.01 && <Box p={[0.05, 0.86 + (1 - ease(s.brick7)) * 0.5, 0]} s={[0.23, 0.065, 0.11]} c="#d8c39a" r={0.9} e="#ff7a2a" ei={0.12 * s.brick7Heat} rad={0.006} />}
      </group>
      {/* el humo caliente que se va por el caño (rojo) / el calor robado por las aletas (al cuarto) */}
      <Leak t={t} from={[2.7, 1.1, -1.6]} to={[2.7, 4.6, -1.6]} amt={s.leakFlue} glow={tx.flake} n={30} spread={0.18} size={t > 123.3 ? 0.08 : 0.2} />
      <Leak t={t} from={[2.7, 2.0, -1.6]} to={[1.2, 2.4, -0.3]} amt={s.finHeat} glow={tx.flake} n={24} spread={0.6} col="#ffb257" size={0.07} />
      {/* aire que pasa entre ladrillos y estufa y sale arriba */}
      <Leak t={t} from={[2.7, 0.15, -1.0]} to={[2.7, 1.5, -1.4]} amt={s.brickFlow} glow={tx.flake} n={20} spread={0.5} col="#ff9a4a" size={0.06} />

      {/* ===== PUESTO 4 · el cajón solar de latas (apoyado contra la pared, junto a la ventana) ===== */}
      <group position={[-4.0, 0, -2.6]} rotation={[-0.12, 0, 0]}>
        <Box p={[0, 1.25, 0]} s={[1.0, 1.0 * ease(s.solar), 0.12]} c="#3a2b1f" r={0.85} rad={0.01} />
        {s.solar > 0.3 && Array.from({ length: 64 }, (_, i) => {
          const c = i % 8, r = Math.floor(i / 8); if (i > s.cans * 64) return null;
          return <Can key={i} p={[-0.42 + c * 0.12, 0.83 + r * 0.122, 0.07]} i={i} tex={tt.can} black={s.paint > (c + r * 0.3) / 10 ? 1 : 0} />;
        })}
        {s.glass > 0.01 && <mesh position={[0, 1.25, 0.12]}><planeGeometry args={[1.0, 1.0]} /><meshStandardMaterial color="#cfe4ff" transparent opacity={0.18 * s.glass} roughness={0.05} metalness={0.2} /></mesh>}
      </group>
      <Leak t={t} from={[-4.0, 0.85, -2.45]} to={[-4.0, 1.8, -2.4]} amt={s.solarFlow} glow={tx.flake} n={20} spread={0.4} col="#ffb257" size={0.07} />

      {/* ===== PUESTO 5 · bidones negros detrás de la ventana ===== */}
      {Array.from({ length: 6 }, (_, i) => { const k = cl(s.jugs * 6 - i); if (k <= 0) return null;
        return <group key={i} position={[-3.0 + (i % 3) * 0.32, 0, -2.7 + Math.floor(i / 3) * 0.3]}><Box p={[0, 0.2 * ease(k), 0]} s={[0.26, 0.4 * ease(k), 0.2]} c="#121314" r={0.6} rad={0.04} /><Cyl p={[0.06, 0.42 * ease(k), 0]} r={0.035} h={0.05} c="#1c1c1c" /></group>; })}

      {/* ===== PUESTO 6 · el catre y el CUARTO TIBIO (carpa de listones + cobijas) ===== */}
      <group position={[-3.4, 0, 1.2]}>
        <Box p={[0, 0.4, 0]} s={[0.9, 0.08, 1.9]} c="#5a4632" r={0.9} rad={0.01} />
        {[[-0.4, -0.9], [0.4, -0.9], [-0.4, 0.9], [0.4, 0.9]].map(([x, z], i) => <Box key={i} p={[x, 0.2, z]} s={[0.05, 0.4, 0.05]} c="#3a2a1a" />)}
        <Box p={[0, 0.5, 0]} s={[0.84, 0.12, 1.84]} c="#7b7466" r={1} rad={0.04} />
        <Box p={[0, 0.6, -0.72]} s={[0.5, 0.1, 0.32]} c="#d9d2c4" r={1} rad={0.04} />
        {s.tent > 0.01 && <group scale={[1, ease(s.tent), 1]}>
          {[-0.95, 0, 0.95].map((z) => <group key={z} position={[0, 0.55, z]}>
            <Box p={[-0.46, 0.5, 0]} s={[0.04, 1.0, 0.04]} c="#a07a52" r={0.9} rad={0.005} />
            <Box p={[0.46, 0.5, 0]} s={[0.04, 1.0, 0.04]} c="#a07a52" r={0.9} rad={0.005} />
            <Box p={[0, 1.0, 0]} s={[0.96, 0.04, 0.04]} c="#a07a52" r={0.9} rad={0.005} />
          </group>)}
          {s.blankets > 0.01 && <>
            <Box p={[0, 1.57, 0]} s={[1.02, 0.05, 2.0 * ease(s.blankets)]} c="#6b2f2a" map={tx.rug} r={1} rad={0.02} />
            <Box p={[-0.5, 1.05, 0]} s={[0.05, 1.05 * ease(s.blankets), 2.0]} c="#3f4f6b" r={1} rad={0.02} />
            <Box p={[0.5, 1.05, 0]} s={[0.05, 1.05 * ease(s.blankets), 2.0]} c="#7a5a2f" r={1} rad={0.02} />
          </>}
        </group>}
        {s.warmBed > 0.01 && <pointLight position={[0, 0.9, 0.2]} intensity={s.warmBed * 1.6} distance={1.6} color="#ff9a4a" />}
      </group>

      {/* ===== los CARTELES NUMERADOS de cada puesto (se encienden de a uno) ===== */}
      {BENCH.map((b, i) => { const on = s.signs[i]; if (on <= 0.01) return null;
        return <group key={i} position={b.sign}>
          <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.004, 0.004, 0.5, 4]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh scale={[ease(on), ease(on), 1]}><planeGeometry args={[0.24, 0.24]} /><meshBasicMaterial map={tt.num[i]} toneMapped={false} /></mesh>
          {s.signHi[i] > 0.01 && <pointLight position={[0, 0, 0.3]} intensity={s.signHi[i] * 1.4} distance={1.4} color="#ffb257" />}
        </group>; })}

      {/* utilería del taller: estante con frascos, pila de diarios y ladrillos de papel (el video anterior), el tambor de 200 L (el próximo) */}
      <Box p={[-4.82, 1.55, -0.6]} s={[0.36, 0.04, 1.6]} c="#5a3d28" r={0.9} rad={0.008} />
      <Box p={[-4.82, 2.05, -0.6]} s={[0.36, 0.04, 1.6]} c="#5a3d28" r={0.9} rad={0.008} />
      {Array.from({ length: 12 }, (_, i) => <Cyl key={"j" + i} p={[-4.82, (i < 6 ? 1.57 : 2.07) + 0.09, -1.25 + (i % 6) * 0.26]} r={0.06} h={0.18} c={["#8a6a3a", "#5d7a4a", "#a0522d", "#6b6b6b"][i % 4]} rough={0.15} m={0.1} op={0.85} />)}
      <group position={[1.75, 0, -0.95]}>
        {Array.from({ length: 9 }, (_, i) => <Box key={"pb" + i} p={[(i % 3) * 0.17 - 0.17, 0.05 + Math.floor(i / 3) * 0.1, 0]} s={[0.15, 0.09, 0.1]} c="#7d7a72" r={1} rad={0.01} />)}
        <Box p={[0.45, 0.12, 0.05]} s={[0.36, 0.24, 0.26]} c="#c9c2b0" r={1} rad={0.01} />
      </group>
      <group position={[4.3, 0, -2.45]}>
        <Cyl p={[0, 0.45, 0]} r={0.29} h={0.9} c="#1f3d5a" rough={0.6} m={0.5} seg={28} />
        {[0.15, 0.45, 0.75].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.292, 0.012, 6, 32]} /><meshStandardMaterial color="#16304a" metalness={0.6} roughness={0.5} /></mesh>)}
      </group>
      {/* lámpara colgante de trabajo */}
      <group position={[0.6, 2.75, -0.4]}>
        <Cyl p={[0, 0.2, 0]} r={0.004} h={0.4} c="#111" />
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.26, 0.18, 24, 1, true]} /><meshStandardMaterial color="#2c332c" side={THREE.DoubleSide} metalness={0.5} roughness={0.5} /></mesh>
        <mesh position={[0, -0.04, 0]}><sphereGeometry args={[0.05, 12, 10]} /><meshBasicMaterial color={new THREE.Color("#333").lerp(new THREE.Color("#fff1cf"), s.lamp)} toneMapped={false} /></mesh>
        {s.lamp > 0.02 && <spotLight position={[0, -0.05, 0]} angle={1.0} penumbra={0.8} intensity={s.lamp * 22} distance={8} color="#ffd7a0" castShadow target-position={[0.6, 0, -0.4]} />}
      </group>
      {/* banco de trabajo largo (centro) */}
      <Box p={[0.6, 0.9, -1.9]} s={[2.4, 0.08, 0.8]} c="#7a5236" map={tx.planks} r={0.8} rad={0.01} />
      {[[-0.5, -1.55], [1.7, -1.55], [-0.5, -2.25], [1.7, -2.25]].map(([x, z], i) => <Box key={i} p={[x, 0.45, z]} s={[0.08, 0.9, 0.08]} c="#4a3220" />)}
      {/* lo que hay sobre el banco: rollo de cobre, cámaras de bici, tijera de chapa, latas */}
      {s.books < 0.5 && <>
      <mesh position={[-0.1, 0.98, -1.95]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.16, 0.035, 10, 30]} /><meshStandardMaterial color="#111" roughness={0.6} /></mesh>
      <mesh position={[1.3, 0.97, -2.0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.012, 8, 40]} /><meshStandardMaterial color="#b8733a" metalness={0.85} roughness={0.3} /></mesh>
      {Array.from({ length: 5 }, (_, i) => <Can key={i} p={[0.4 + i * 0.08, 1.0, -1.7 + (i % 2) * 0.05]} i={i} tex={tt.can} />)}
      </>}
      {/* ===== LA GUÍA «El Invierno Sin Gas»: 5 manuales; el del tema avanza y se abre en su página real ===== */}
      {s.books > 0.01 && [0, 1, 2, 3, 4].map((i) => {
        const isHero = s.set === "m2" ? i === 1 : i === 0;
        const stack: V = [0.28, 0.94 + i * 0.05, -1.95], rowP = ROW[i];
        let p: V = [lerp(stack[0], rowP[0], ease(s.row)), lerp(stack[1], rowP[1], ease(s.row)) + Math.sin(Math.PI * s.row) * 0.08 * (i % 2 ? 1 : 0.6), lerp(stack[2], rowP[2], ease(s.row))];
        let rot = lerp(0.05 * (i - 2), 0.02 * (i - 2), s.row);
        if (isHero) { p = [lerp(p[0], BOOK[0], ease(s.hero)), p[1] + Math.sin(Math.PI * s.hero) * 0.09, lerp(p[2], BOOK[2], ease(s.hero))]; rot = lerp(rot, 0, s.hero); }
        else { const j = [0, 1, 2, 3, 4].filter((k) => k !== (s.set === "m2" ? 1 : 0)).indexOf(i); p = [lerp(p[0], 0.55 + j * 0.33, ease(s.hero)), p[1], lerp(p[2], -2.02, ease(s.hero))]; }
        p = [p[0], p[1] + (1 - ease(s.books)) * 0.6, p[2]];
        const cover = pg[`m${i + 1}_p001`];
        const left = s.set === "m2" ? pg.m2_p054_r : pg.m1_p070_r, right = s.set === "m2" ? pg.m2_p055 : pg.m1_p071;
        return <Book key={i} p={p} rotY={rot} open={isHero ? s.open : 0} cover={cover} inside={left} right={right} spine={SPINE[i]}>
          {isHero && s.open > 0.9 && s.set === "m2" && <>
            <PageHi k={s.hi[0]} u0={0.1} u1={0.93} v={0.09} h={0.045} />
            <PageHi k={s.hi[1]} u0={0.1} u1={0.6} v={0.415} h={0.05} col="#ff9a4a" />
            <PageHi k={s.hi[2]} u0={0.08} u1={0.4} v={0.183} h={0.03} />
            <PageHi k={s.hi[3]} u0={0.47} u1={0.95} v={0.52} h={0.04} />
          </>}
          {isHero && s.open > 0.9 && s.set === "m1" && <>
            <PageHi k={s.hi[0]} u0={0.1} u1={0.93} v={0.1} h={0.08} />
            <PageHi k={s.hi[1]} u0={0.5} u1={0.95} v={0.39} h={0.08} />
            <PageHi k={s.hi[2]} u0={0.5} u1={0.95} v={0.46} h={0.06} col="#7dff9e" />
          </>}
        </Book>;
      })}

      {/* ambiente cálido (sube con la temperatura) */}
      <pointLight position={[0.5, 2.0, 0.8]} intensity={0.4 + s.warm * 3.2} distance={10} color="#ffb877" />
    </ThreeCanvas>
  );
};
