// hdc28c · EL MUNDO: el patio de Claudio con el sol de la mañana que entra de costado. En el centro, el LIMONERO en su maceta de barro
// de 40 litros CORTADA al medio (la mitad de adelante no está): se ve la tierra suelta en corte, la capa de piedritas abajo, los agujeros,
// las raíces finitas blancas cerca del borde (las que comen), la maceta levantada sobre dos ladrillos. Arriba el árbol: el tronco con la
// marca del injerto, la copa redonda, las flores de azahar, los limoncitos, los limones (de 4 arriba de todo a 60 hasta la rodilla) y las
// dos ramas de abajo dobladas con una tira de tela. A la izquierda, la maceta chica de 10 litros del error 1. A la derecha, la mesa de
// trabajo: las cáscaras de plátano secándose, el frasco del polvo, la ceniza, la borra de café, la cáscara de huevo, el compost, el sulfato
// y el quelato de hierro, el abono de cítricos y el de pasto. En la pared, el calendario. Adelante a la izquierda, el libro de la colección.
// UNA escena y UNA cámara (KEYS en tl.ts). Luces SIEMPRE montadas (sólo cambia la intensidad). Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();
type V = [number, number, number];

// ---------------- medidas ----------------
// la maceta: centro en x 0 z PZ, boca de radio RT, base RB, alto PH, apoyada en dos ladrillos (Y0); la tierra a SOIL
export const PZ = -0.3;
const RT = 0.24, RB = 0.17, PH = 0.42, Y0 = 0.07, SOIL = Y0 + PH - 0.03, GRAV = 0.075;
const TRUNK = 0.5;                       // alto del tronco sobre la tierra hasta la cruz
export const CC: V = [0, SOIL + TRUNK + 0.36, PZ];   // centro de la copa
const CR: V = [0.44, 0.38, 0.38];        // radios de la copa
export const SMALL: V = [-1.1, 0, -0.2];
export const TABLE: V = [1.5, 0.78, -0.35];
export const BOOK: V = [-1.72, 0.76, 0.6];
export const CAL: V = [-0.9, 1.6, -2.54];

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.008; p.y += Math.sin(t * 0.71 + 1) * 0.006;
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

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => {
  // la tierra en corte: suelta y oscura con corteza y arena (puntitos), y la capa de piedritas abajo. UV = metros (ShapeGeometry)
  const section = mk(512, 512, (g) => {
    g.fillStyle = "#4a3424"; g.fillRect(0, 0, 512, 512);
    const gy = 512 * (1 - GRAV / (SOIL - Y0));
    for (let i = 0; i < 4200; i++) { const y = rnd(i, 3) * gy; g.fillStyle = rnd(i, 9) > 0.72 ? `rgba(214,196,160,${0.55 * rnd(i, 2)})` : rnd(i, 9) > 0.6 ? `rgba(150,92,48,${0.6 * rnd(i, 2)})` : `rgba(20,12,6,${0.4 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 4) * 512, y, 0.8 + rnd(i, 5) * 2.6, 0, 6.3); g.fill(); }
    g.fillStyle = "#6e6458"; g.fillRect(0, gy, 512, 512 - gy);
    for (let i = 0; i < 420; i++) { g.fillStyle = i % 5 === 0 ? `rgb(${170 + rnd(i, 6) * 40},${90 + rnd(i, 6) * 30},${60 + rnd(i, 6) * 20})` : `rgb(${120 + rnd(i, 6) * 70},${110 + rnd(i, 6) * 60},${100 + rnd(i, 6) * 50})`; g.beginPath(); g.ellipse(rnd(i, 7) * 512, gy + 4 + rnd(i, 8) * (512 - gy - 6), 5 + rnd(i, 1) * 8, 4 + rnd(i, 2) * 5, rnd(i, 3) * 3, 0, 6.3); g.fill(); }
  });
  section.repeat.set(1 / (2 * RT), 1 / (SOIL - Y0)); section.offset.set(0.5, -Y0 / (SOIL - Y0));
  return {
    tiles: mk(256, 256, (g) => {
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 1); g.fillStyle = `rgb(${170 + v * 30},${92 + v * 18},${60 + v * 12})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
      g.fillStyle = "rgba(90,70,55,.9)"; for (let k = 0; k <= 4; k++) { g.fillRect(k * 64 - 2, 0, 4, 256); g.fillRect(0, k * 64 - 2, 256, 4); }
      for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(60,30,15,${0.12 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
    }, [10, 5]),
    wall: mk(256, 256, (g) => {
      g.fillStyle = "#ece6da"; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1800; i++) { const v = 210 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 6},${v - 16},.35)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
      const gr = g.createLinearGradient(0, 200, 0, 256); gr.addColorStop(0, "rgba(150,130,100,0)"); gr.addColorStop(1, "rgba(150,130,100,.35)"); g.fillStyle = gr; g.fillRect(0, 200, 256, 56);
    }, [6, 1]),
    section,
    clay: mk(256, 128, (g) => {
      g.fillStyle = "#b5653d"; g.fillRect(0, 0, 256, 128);
      for (let i = 0; i < 900; i++) { g.fillStyle = rnd(i, 1) > 0.5 ? `rgba(120,60,30,${0.18 * rnd(i, 2)})` : `rgba(230,170,130,${0.18 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 128, 2 + rnd(i, 5) * 3, 1 + rnd(i, 6) * 2); }
      g.fillStyle = "rgba(240,235,225,.25)"; for (let i = 0; i < 30; i++) g.fillRect(rnd(i, 7) * 256, 100 + rnd(i, 8) * 28, 8 + rnd(i, 9) * 20, 2);
    }, [3, 1]),
    wood: mk(256, 64, (g) => {
      g.fillStyle = "#8a5f3a"; g.fillRect(0, 0, 256, 64);
      for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(60,36,18,${0.15 + 0.2 * rnd(i, 1)})`; g.lineWidth = 1 + rnd(i, 2) * 2; g.beginPath(); const y = rnd(i, 3) * 64; g.moveTo(0, y); g.bezierCurveTo(80, y + 6 * (rnd(i, 4) - 0.5), 170, y - 6 * (rnd(i, 5) - 0.5), 256, y); g.stroke(); }
    }, [2, 1]),
    brick: mk(128, 64, (g) => {
      g.fillStyle = "#a94f32"; g.fillRect(0, 0, 128, 64);
      for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${rnd(i, 1) > 0.5 ? "70,30,15" : "220,140,100"},${0.2 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 128, rnd(i, 4) * 64, 2, 2); }
    }),
    cal: mk(256, 320, (g) => {
      g.fillStyle = "#fbf8f1"; g.fillRect(0, 0, 256, 320);
      g.fillStyle = "#3f7a3a"; g.fillRect(0, 0, 256, 54);
      const M = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
      g.font = "bold 22px sans-serif"; g.textAlign = "center";
      for (let i = 0; i < 12; i++) { const x = 16 + (i % 3) * 78, y = 66 + Math.floor(i / 3) * 62; g.strokeStyle = "#c9c1b0"; g.lineWidth = 2; g.strokeRect(x, y, 70, 54); g.fillStyle = "#6a5a48"; g.fillText(M[i], x + 35, y + 35); }
    }),
  };
}, []);
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas libro"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};

// ---------------- piezas ----------------
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: THREE.Texture; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V; seg?: number; e?: string; ei?: number; op?: number; open?: boolean; map?: THREE.Texture; th?: number }> = ({ p, r, r2, h, c, rough = 0.8, m = 0, rot, seg = 32, e, ei = 0, op, open, map, th = Math.PI * 2 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open, th === Math.PI * 2 ? 0 : Math.PI / 2, th]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
const Seg: React.FC<{ a: V; b: V; r: number; c: string; r2?: number; e?: string; ei?: number; flat?: number; rough?: number }> = ({ a, b, r, c, r2, e, ei = 0, flat = 1, rough = 0.7 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), d = B.clone().sub(A), len = d.length();
  if (len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} scale={[1, 1, flat]} castShadow><cylinderGeometry args={[r2 ?? r, r, len, 8]} /><meshStandardMaterial color={c} roughness={rough} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};
const Dust: React.FC<{ k: number; t: number; col: string; from: V; to: number; n?: number; spread?: number; size?: number }> = ({ k, t, col, from, to, n = 60, spread = 0.35, size = 0.008 }) => (
  <>{Array.from({ length: n }, (_, i) => {
    const ph = (t * (0.35 + 0.25 * rnd(i, 1)) + rnd(i, 2)) % 1, y = lerp(from[1], to, ph);
    const x = from[0] + (rnd(i, 3) - 0.5) * spread * (0.4 + ph), z = from[2] + (rnd(i, 4) - 0.5) * spread * 0.6;
    return <mesh key={i} position={[x, y, z]} visible={k > 0.01}><sphereGeometry args={[size * (0.7 + rnd(i, 5)), 6, 6]} /><meshBasicMaterial color={col} transparent opacity={k * Math.sin(Math.PI * ph)} toneMapped={false} /></mesh>;
  })}</>
);
// el limón: elipsoide con las dos puntitas (k = tamaño 0-1 · g = verde→amarillo)
const Lemon: React.FC<{ p: V; k?: number; g?: number; glow?: number; rot?: number }> = ({ p, k = 1, g = 1, glow = 0, rot = 0 }) => {
  const c = mix("#5e9a35", "#f2d33a", g), s = 0.034 * k;
  return <group position={p} rotation={[0.2, rot, 0.3 + rot * 0.2]}>
    <Seg a={[0, s * 1.1, 0]} b={[0, s * 1.1 + 0.03, 0]} r={0.0016} c="#5d7a33" />
    <mesh scale={[s * 0.82, s * 1.12, s * 0.82]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={c} roughness={0.42} emissive={g > 0.5 ? "#ffe86a" : "#b8ff7a"} emissiveIntensity={0.55 * glow} /></mesh>
    <mesh position={[0, -s * 1.12, 0]} scale={[s * 0.2, s * 0.26, s * 0.2]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={c} roughness={0.45} /></mesh>
  </group>;
};
// la flor de azahar: cinco pétalos blancos con la punta morada y el centro amarillo
const Flower: React.FC<{ p: V; k: number; rot: number; glow?: number }> = ({ p, k, rot, glow = 0 }) => k < 0.02 ? null : (
  <group position={p} rotation={[rot * 0.7, rot, 0.4]} scale={k}>
    {Array.from({ length: 5 }, (_, j) => { const a = (j / 5) * Math.PI * 2; return <mesh key={j} position={[Math.cos(a) * 0.009, 0.003, Math.sin(a) * 0.009]} rotation={[0, -a, 0.5]} scale={[0.011, 0.0022, 0.0055]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={j % 2 ? "#fbf7f2" : "#f6eef4"} roughness={0.5} emissive="#ffffff" emissiveIntensity={0.25 + 0.5 * glow} /></mesh>; })}
    <mesh position={[0, 0.006, 0]} scale={[0.004, 0.006, 0.004]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f2d64a" emissive="#ffd84a" emissiveIntensity={0.3 + 0.6 * glow} /></mesh>
    <mesh position={[0.004, -0.004, 0]} scale={[0.005, 0.007, 0.005]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#d9b8d6" roughness={0.5} /></mesh>
  </group>
);

// las hojas de la copa (posiciones fijas): u = alto relativo 0 abajo · 1 arriba; tip = hoja nueva de punta
const LEAVES = Array.from({ length: 300 }, (_, i) => {
  const th = rnd(i, 1) * Math.PI * 2, u = 0.08 + 0.92 * Math.pow(rnd(i, 2), 0.8), ph = Math.acos(1 - 2 * u * 0.95);
  const rr = 0.78 + 0.22 * rnd(i, 3);
  const p: V = [CC[0] + Math.sin(ph) * Math.cos(th) * CR[0] * rr, CC[1] + Math.cos(ph) * CR[1] * rr * -1 + 0.0, CC[2] + Math.sin(ph) * Math.sin(th) * CR[2] * rr];
  return { p, rot: [rnd(i, 4) * 3, th, rnd(i, 5) * 1.2] as V, s: 0.85 + 0.35 * rnd(i, 6), tip: rnd(i, 7) > 0.62 && p[1] > CC[1], low: p[1] < CC[1] - 0.15, third: Math.cos(th) > 0.45 && rnd(i, 8) > 0.2, inner: rr < 0.84 };
});
// 60 limones sobre la copa, ordenados de arriba a abajo (los 4 primeros = el árbol que daba 4, arriba de todo)
const LEMONS = Array.from({ length: 70 }, (_, i) => {
  const th = rnd(i, 11) * Math.PI * 2, u = rnd(i, 12), ph = 0.35 + u * 2.5;
  return { p: [CC[0] + Math.sin(ph) * Math.cos(th) * CR[0] * 0.98, CC[1] + Math.cos(ph) * CR[1] * 1.02 - 0.03, CC[2] + Math.sin(ph) * Math.sin(th) * CR[2] * 0.98 + 0.02] as V, rot: rnd(i, 13) * 3 };
}).sort((a, b) => b.p[1] - a.p[1]).slice(0, 52);
// las dos ramas de abajo, dobladas hasta casi horizontal (cargan 8 limones a la altura de la rodilla)
const LOWB = [{ a: -0.6, len: 0.52 }, { a: 0.9, len: 0.5 }];
const FLOWERS = Array.from({ length: 90 }, (_, i) => {
  const th = rnd(i, 21) * Math.PI * 2, u = rnd(i, 22), ph = 0.25 + u * 2.4;
  return { p: [CC[0] + Math.sin(ph) * Math.cos(th) * CR[0] * 1.02, CC[1] + Math.cos(ph) * CR[1] * 1.04, CC[2] + Math.sin(ph) * Math.sin(th) * CR[2] * 1.02] as V, rot: rnd(i, 23) * 3 };
});
const FRUITLETS = FLOWERS.filter((_, i) => i % 3 === 0);
// la raíz: polilínea en el plano del corte (z = PZ) con brotes finitos
const ROOTS = Array.from({ length: 16 }, (_, i) => {
  const side = i % 2 ? 1 : -1, y0 = SOIL - 0.05 - rnd(i, 31) * 0.05;
  const pts: V[] = [[side * 0.02, y0, PZ + 0.004]];
  for (let k = 1; k <= 4; k++) pts.push([side * (0.02 + k * 0.045 * (0.8 + 0.5 * rnd(i, 32 + k))), y0 - k * (0.05 + 0.04 * rnd(i, 40 + k)), PZ + 0.004]);
  return pts;
});

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const pg = useImgTex(["m1_p001", "m1_p028"]);
  const s = ST(t);
  const leafCol = mix("#3f7a32", "#2c5e26", s.lush);
  const soilCol = mix(mix("#5a4130", "#2e1d12", s.wet), "#9a7c5c", s.dry);
  const sunI = 2.3 * (1 - 0.65 * s.shade) * (1 - 0.35 * s.shadeNet) + 0.7 * s.sunHi;
  const nLemons = Math.round(lerp(lerp(24, 4, s.few), 52, s.load) * (1 - 0.8 * s.topLemons) + 8 * s.topLemons);
  const potY = Y0 - 0.04 * s.saucer;
  const turn = s.turn * Math.PI / 2 * cl(s.turnK);
  const shape = useMemo(() => { const sh = new THREE.Shape(); sh.moveTo(-RB + 0.012, Y0 + 0.012); sh.lineTo(RB - 0.012, Y0 + 0.012); sh.lineTo(RT - 0.014, SOIL); sh.lineTo(-RT + 0.014, SOIL); sh.closePath(); return new THREE.ShapeGeometry(sh); }, []);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.3} threshold={0.97} exposure={1.1} env={0.45} />
      <color attach="background" args={["#a9c6dc"]} />
      <fog attach="fog" args={["#bfd2e0", 14, 40]} />
      <hemisphereLight args={["#e3edf6", "#7a5a3c", 0.75]} />
      {/* el sol de la mañana entra de costado (luz siempre montada: sólo cambia la intensidad) */}
      <directionalLight position={[5, 5.5, 3]} intensity={sunI} color={mix("#fff0d6", "#ffd9a0", s.heat)} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-2} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[0, 1.4, 1.4]} intensity={0.9} distance={4} color="#fff4e4" />
      <pointLight position={[0, 0.3, 0.4]} intensity={0.35 + 0.25 * s.cutLight} distance={1.4} color="#ffe9c8" />
      <pointLight position={[BOOK[0], 1.4, BOOK[2] + 0.4]} intensity={0.8 * s.book} distance={2.5} color="#fff4e6" />

      {/* piso de baldosa y pared encalada */}
      <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[16, 8]} /><meshStandardMaterial map={tx.tiles} roughness={0.9} /></mesh>
      <Box p={[0, 1.6, -2.65]} s={[16, 3.2, 0.2]} c="#d8cdbb" map={tx.wall} r={0.95} rad={0.01} />
      <Box p={[0, 3.24, -2.6]} s={[16, 0.1, 0.3]} c="#c9b8a0" r={0.9} rad={0.01} />
      {/* la mancha de óxido del sulfato en la baldosa */}
      <mesh position={[0.42, 0.002, PZ + 0.25]} rotation={[-Math.PI / 2, 0, 0.4]} scale={[1, 0.6, 1]} visible={s.stain > 0.01}><circleGeometry args={[0.09, 24]} /><meshStandardMaterial color="#c56a2a" roughness={0.9} transparent opacity={0.75 * s.stain} /></mesh>
      {/* el calendario del año en la pared */}
      <group position={CAL}>
        <Box p={[0, 0, 0]} s={[0.4, 0.5, 0.01]} c="#ffffff" map={tx.cal} r={0.9} rad={0.003} e="#fff6dc" ei={0.15 * s.calendar} />
        {[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]].flat().map((m) => { const on = m <= 1 ? 0 : s.calendar; const x = -0.15 + (m % 3) * 0.122, y = 0.13 - Math.floor(m / 3) * 0.097; return <mesh key={m} position={[x, y - 0.035, 0.008]} visible={on > 0.01 && m % 2 === 0}><planeGeometry args={[0.1, 0.075]} /><meshBasicMaterial color={m < 6 ? "#7dd87d" : "#ffd84a"} transparent opacity={0.45 * on} toneMapped={false} /></mesh>; })}
      </group>

      {/* ===== EL PLATO CON AGUA (error 2) o LOS DOS LADRILLOS ===== */}
      <group position={[0, 0, PZ]}>
        {[-0.11, 0.11].map((x, i) => <Box key={i} p={[x, 0.033, 0]} s={[0.1, 0.066, 0.22]} c="#a94f32" map={tx.brick} r={0.9} rad={0.006} e="#ffcf7a" ei={0.35 * s.bricksHi} />)}
        <group visible={s.saucer > 0.01}>
          <Cyl p={[0, 0.012, 0]} r={0.27} r2={0.25} h={0.024} c="#8a8f94" rough={0.5} />
          <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.255, 32]} /><meshStandardMaterial color="#4f6a72" roughness={0.08} metalness={0.25} transparent opacity={0.85} emissive="#7ab8d0" emissiveIntensity={0.15 * s.saucer} /></mesh>
          <Dust k={s.saucer} t={t * 0.7} col="#2a2a2a" from={[0, 0.05, 0]} to={0.22} n={14} spread={0.5} size={0.004} />
        </group>
        {/* el agua que sale por abajo cuando se riega hondo */}
        <Dust k={s.drain} t={t * 1.6} col="#9fd3ff" from={[0, Y0 - 0.005, 0.02]} to={0.0} n={40} spread={0.3} size={0.006} />
        <mesh position={[0.02, 0.002, 0.04]} rotation={[-Math.PI / 2, 0, 0]} visible={s.drain > 0.01}><circleGeometry args={[0.18 * s.drain + 0.001, 24]} /><meshStandardMaterial color="#6f8a92" roughness={0.1} transparent opacity={0.5 * s.drain} /></mesh>
        {/* la base con rueditas */}
        <group visible={s.wheels > 0.01}>
          {[0, 1, 2, 3].map((k) => { const a = k * Math.PI / 2 + 0.6; return <mesh key={k} position={[Math.cos(a) * 0.2, 0.022, Math.sin(a) * 0.2]} rotation={[0, a, Math.PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.018, 16]} /><meshStandardMaterial color="#2a2a2a" roughness={0.5} /></mesh>; })}
        </group>
      </group>

      {/* ===== LA MACETA EN CORTE + EL ÁRBOL (todo gira junto con el cuarto de vuelta) ===== */}
      <group position={[0, potY - Y0, PZ]} rotation={[0, turn, 0]}>
        <group position={[0, 0, -PZ]}>
          {/* la mitad de atrás de la maceta (barro) y el borde grueso */}
          <Cyl p={[0, Y0 + PH / 2, PZ]} r={RT} r2={RB} h={PH} c="#c46d42" map={tx.clay} rough={0.85} open th={Math.PI} e="#ffcf7a" ei={0.3 * s.sizeHi} />
          <mesh position={[0, Y0 + PH, PZ]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[RT + 0.006, 0.014, 8, 40, Math.PI]} /><meshStandardMaterial color="#b5653d" roughness={0.8} emissive="#ffcf7a" emissiveIntensity={0.3 * s.sizeHi} /></mesh>
          <mesh position={[0, Y0 + 0.006, PZ]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[RB, 32, 0, Math.PI]} /><meshStandardMaterial color="#9a5634" side={THREE.DoubleSide} /></mesh>
          {/* el grosor de la pared en el corte (dos franjas de barro a los costados) */}
          {[-1, 1].map((sd) => <Seg key={sd} a={[sd * (RB - 0.006), Y0, PZ]} b={[sd * (RT - 0.006), Y0 + PH, PZ]} r={0.012} c="#a85a36" flat={0.5} />)}
          <Box p={[0, Y0 + 0.006, PZ]} s={[2 * RB, 0.012, 0.024]} c="#a85a36" rad={0.002} />
          {/* la tierra en corte */}
          <mesh geometry={shape} position={[0, 0, PZ + 0.001]} receiveShadow><meshStandardMaterial map={tx.section} color={mix("#ffffff", "#8a7a70", s.wet)} roughness={0.95} emissive="#ffe2a0" emissiveIntensity={0.08 * s.gravelHi} /></mesh>
          {/* la capa de piedritas iluminada */}
          <mesh position={[0, Y0 + 0.012 + GRAV / 2, PZ + 0.003]} visible={s.gravelHi > 0.01}><planeGeometry args={[2 * RB + 0.02, GRAV]} /><meshBasicMaterial color="#ffd84a" transparent opacity={0.25 * s.gravelHi} toneMapped={false} /></mesh>
          {/* los agujeros de abajo (varios) */}
          {[-0.11, -0.04, 0.04, 0.11].map((x, i) => <mesh key={i} position={[x, Y0 + 0.001, PZ - 0.02 - (i % 2) * 0.05]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.012, 12]} /><meshStandardMaterial color="#1a120a" emissive="#ffcf7a" emissiveIntensity={0.9 * s.holes} side={THREE.DoubleSide} /></mesh>)}
          {/* agua parada abajo (la maceta sin drenaje): la papilla que pudre */}
          <mesh position={[0, Y0 + 0.012 + 0.05 * s.puddle, PZ + 0.004]} visible={s.puddle > 0.01}><planeGeometry args={[2 * RB, 0.1 * s.puddle + 0.001]} /><meshStandardMaterial color="#4f6a72" roughness={0.1} metalness={0.2} transparent opacity={0.72 * s.puddle} /></mesh>
          {/* las raíces: gruesas del centro + las finitas blancas del borde (las que comen) */}
          {ROOTS.map((pts, i) => {
            const shallow = s.shallowRoots > 0.5, rotK = s.rot;
            const c = mix(mix("#d8c39a", "#3a2614", rotK), "#f4ead2", s.rootHi * (i > 7 ? 1 : 0.4));
            return <group key={i}>{pts.slice(1).map((q, k) => {
              if (shallow && k > 1) return null;
              const a = pts[k], bq: V = shallow ? [q[0] * 1.3, Math.max(q[1], SOIL - 0.07), q[2]] : q;
              return <Seg key={k} a={a} b={bq} r={0.0045 - k * 0.0008} r2={0.004 - k * 0.0009} c={c} e="#ffe9b0" ei={0.6 * s.rootHi * (k >= 2 ? 1 : 0.3)} />;
            })}
              {/* pelitos finitos al final */}
              {!shallow && [0, 1, 2].map((h) => { const e = pts[4]; return <Seg key={"h" + h} a={e} b={[e[0] + (h - 1) * 0.02, e[1] - 0.025, e[2]]} r={0.0012} c={c} e="#ffffff" ei={0.6 * s.rootHi} />; })}
            </group>;
          })}
          {/* las raíces que dan vueltas pegadas al borde (maceta chica / sin recortar) */}
          {[0, 1, 2].map((k) => <mesh key={"cr" + k} position={[0, Y0 + 0.03 + k * 0.035, PZ]} rotation={[-Math.PI / 2, 0, 0]} visible={s.circle > 0.01}><torusGeometry args={[RB - 0.012 + k * 0.012, 0.005, 6, 30, Math.PI]} /><meshStandardMaterial color={mix("#d8c39a", "#ff9a5a", s.circleHi)} emissive="#ff8a4a" emissiveIntensity={0.6 * s.circleHi} transparent opacity={s.circle} /></mesh>)}
          {/* el hierro trabado: puntitos naranjas alrededor de la raíz que no entran */}
          {Array.from({ length: 40 }, (_, i) => { const r = ROOTS[i % 16][2 + (i % 3)]; return <mesh key={"fe" + i} position={[r[0] + (rnd(i, 51) - 0.5) * 0.04, r[1] + (rnd(i, 52) - 0.5) * 0.04, PZ + 0.006]} visible={s.cutIron > 0.01}><sphereGeometry args={[0.0035, 6, 6]} /><meshBasicMaterial color="#ff7a2a" transparent opacity={s.cutIron} toneMapped={false} /></mesh>; })}
          {/* la tierra de arriba (mojada / seca con grietas) */}
          <mesh position={[0, SOIL, PZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[RT - 0.012, 40, 0, Math.PI]} /><meshStandardMaterial color={soilCol} roughness={s.wet > 0.4 ? 0.45 : 0.95} side={THREE.DoubleSide} /></mesh>
          {Array.from({ length: 9 }, (_, i) => <Seg key={"gr" + i} a={[(rnd(i, 61) - 0.5) * 0.3, SOIL + 0.001, PZ - 0.02 - rnd(i, 62) * 0.15]} b={[(rnd(i, 63) - 0.5) * 0.3, SOIL + 0.001, PZ - 0.02 - rnd(i, 64) * 0.15]} r={0.0016} c="#3a2a1c" />).filter(() => s.dry > 0.5)}
          {/* el anillo de la mezcla, a 10 cm del borde (y el error: el montón contra el tronco) */}
          <mesh position={[0, SOIL + 0.004, PZ]} rotation={[-Math.PI / 2, 0, 0]} visible={s.ring > 0.01}><torusGeometry args={[RT - 0.08, 0.022 * s.ring + 0.001, 6, 40, Math.PI]} /><meshStandardMaterial color="#6a4a2c" roughness={1} emissive="#ffb84a" emissiveIntensity={0.35 * s.ringHi} /></mesh>
          <mesh position={[0.03, SOIL + 0.01, PZ - 0.02]} scale={[0.05, 0.03 * s.trunkFeed + 0.001, 0.04]} visible={s.trunkFeed > 0.01}><sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#6a4a2c" emissive="#ff4a3d" emissiveIntensity={0.5 * s.trunkFeed} /></mesh>
          <Dust k={s.feed} t={t} col="#ffb84a" from={[0.12, SOIL + 0.4, PZ - 0.05]} to={SOIL} n={50} spread={0.35} size={0.007} />
          {/* el tenedor que rasca dos dedos */}
          <group position={[0.15 + 0.02 * Math.sin(t * 5), SOIL + 0.09 - 0.02 * Math.abs(Math.sin(t * 5)), PZ - 0.06]} rotation={[0.5, 0.3, 0.2]} visible={s.fork > 0.02}>
            <Box p={[0, 0.07, 0]} s={[0.018, 0.13, 0.006]} c="#c7c9cc" m={0.85} r={0.25} rad={0.002} />
            {[-0.006, -0.002, 0.002, 0.006].map((x, i) => <Box key={i} p={[x, -0.01, 0]} s={[0.0025, 0.04, 0.003]} c="#c7c9cc" m={0.85} r={0.25} rad={0.0008} />)}
          </group>
          {/* el acolchado de paja, dejando libre un anillo alrededor del tronco */}
          {Array.from({ length: 130 }, (_, i) => { const a = rnd(i, 71) * Math.PI, rr = 0.06 + rnd(i, 72) * (RT - 0.08); return (
            <mesh key={"m" + i} visible={i / 130 < s.mulch} position={[Math.cos(a) * rr, SOIL + 0.006 + rnd(i, 73) * 0.018, PZ - Math.sin(a) * rr]} rotation={[rnd(i, 74) * 0.4, rnd(i, 75) * 6, rnd(i, 76) * 0.4]}>
              <boxGeometry args={[0.05 + 0.03 * rnd(i, 77), 0.003, 0.006]} /><meshStandardMaterial color={["#c9a85e", "#b8954a", "#dcc078", "#a8864a"][i % 4]} roughness={1} />
            </mesh>); })}
          <mesh position={[0, SOIL + 0.003, PZ]} rotation={[-Math.PI / 2, 0, 0]} visible={s.mulchRing > 0.01}><torusGeometry args={[0.045, 0.004, 6, 30, Math.PI]} /><meshBasicMaterial color="#7dff9e" transparent opacity={s.mulchRing} toneMapped={false} /></mesh>
          {/* la botella boca abajo enterrada */}
          <group position={[-0.13, SOIL + 0.06, PZ - 0.08]} visible={s.bottle > 0.02}>
            <Cyl p={[0, 0.06, 0]} r={0.04} h={0.16} c="#cfe3e0" rough={0.05} op={0.4} e="#9fd3ff" ei={0.3 * s.bottleHi} />
            <Cyl p={[0, 0.06 - 0.03 * s.bottleK, 0]} r={0.037} h={Math.max(0.005, 0.12 * (1 - 0.6 * s.bottleK))} c="#a8d2e6" rough={0.1} op={0.6} />
            <Cyl p={[0, -0.04, 0]} r={0.012} r2={0.016} h={0.05} c="#3f8a4a" />
          </group>
          {/* el dedo que mide la humedad */}
          <group position={[0.1, SOIL + 0.13 - 0.06 * s.finger, PZ - 0.08]} visible={s.finger > 0.02}><Seg a={[0, 0, 0]} b={[0, 0.25, 0.05]} r={0.016} c="#d6a07a" /></group>
          {/* la regla de 40 cm (ancho y hondo) */}
          <group visible={s.sizeHi > 0.01}>
            <Box p={[0, Y0 + PH + 0.05, PZ + 0.02]} s={[2 * RT * s.sizeHi + 0.001, 0.012, 0.004]} c="#f2d64a" e="#f2d64a" ei={0.8} rad={0.002} />
            <Box p={[RT + 0.07, Y0 + PH / 2, PZ + 0.02]} s={[0.012, PH * s.sizeHi + 0.001, 0.004]} c="#f2d64a" e="#f2d64a" ei={0.8} rad={0.002} />
          </group>

          {/* ===== EL ÁRBOL ===== */}
          {/* el tronco con el codito del injerto y el brote del pie (chupón de abajo) */}
          <Seg a={[0, SOIL - 0.04, PZ]} b={[0.01, SOIL + TRUNK, PZ]} r={0.024} r2={0.018} c="#7a6a52" rough={0.9} />
          <mesh position={[0.006, SOIL + 0.09, PZ]} scale={[0.032, 0.022, 0.03]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#6e5e48" roughness={0.9} emissive="#ffcf7a" emissiveIntensity={0.9 * s.graftHi} /></mesh>
          <mesh position={[0.006, SOIL + 0.09, PZ]} rotation={[Math.PI / 2, 0, 0]} visible={s.graftHi > 0.01}><torusGeometry args={[0.042, 0.003, 6, 30]} /><meshBasicMaterial color="#ffd84a" transparent opacity={s.graftHi} toneMapped={false} /></mesh>
          <group visible={s.sucker > 0.01}>
            <Seg a={[-0.015, SOIL + 0.04, PZ + 0.01]} b={[-0.08, SOIL + 0.04 + 0.22 * (s.suckerCut > 0.5 ? 0.05 : s.sucker), PZ + 0.03]} r={0.006} c="#5f8a3a" e="#ff4a3d" ei={0.5 * s.sucker * (1 - s.suckerCut)} />
            {s.suckerCut < 0.5 && [0, 1, 2].map((k) => <mesh key={k} position={[-0.05 - k * 0.012, SOIL + 0.1 + k * 0.05, PZ + 0.03]} rotation={[0, k, 0.6]} scale={[0.02, 0.003, 0.012]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#5a8a3a" /></mesh>)}
          </group>
          {/* las ramas madre */}
          {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + 0.3; const end: V = [CC[0] + Math.cos(a) * CR[0] * 0.7, CC[1] - 0.05 + (rnd(i, 81) - 0.5) * 0.2, CC[2] + Math.sin(a) * CR[2] * 0.7]; return <Seg key={"b" + i} a={[0.01, SOIL + TRUNK, PZ]} b={end} r={0.012} r2={0.006} c="#6f604a" rough={0.9} />; })}
          {/* las dos ramas que se cruzan (iluminadas) */}
          <group visible={s.cross > 0.01}>
            <Seg a={[-0.12, CC[1] - 0.12, PZ + 0.15]} b={[0.2, CC[1] + 0.12, PZ + 0.2]} r={0.008} c="#6f604a" e="#ff7a3d" ei={0.9 * s.cross} />
            <Seg a={[0.18, CC[1] - 0.1, PZ + 0.18]} b={[-0.15, CC[1] + 0.1, PZ + 0.22]} r={0.008} c="#6f604a" e="#ff7a3d" ei={0.9 * s.cross} />
          </group>
          {/* el chupón: derecho para arriba, grueso, con espinas */}
          <group visible={s.chupon > 0.01}>
            <Seg a={[0.05, CC[1] + 0.05, PZ + 0.05]} b={[0.07, CC[1] + CR[1] + 0.32 * s.chupon, PZ + 0.07]} r={0.009} r2={0.006} c="#5f8a3a" e="#ff4a3d" ei={0.7 * s.chuponHi} />
            {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[0.06 + (k % 2 ? 0.012 : -0.012), CC[1] + 0.2 + k * 0.07 * s.chupon, PZ + 0.06]} rotation={[0, 0, k % 2 ? -1.1 : 1.1]}><coneGeometry args={[0.003, 0.026, 6]} /><meshStandardMaterial color="#4a6a2a" /></mesh>)}
            {Array.from({ length: 5 }, (_, k) => <mesh key={"cl" + k} position={[0.07 + (k % 2 ? 0.04 : -0.04), CC[1] + CR[1] + 0.06 + k * 0.06 * s.chupon, PZ + 0.07]} rotation={[0.3, k, 0.5]} scale={[0.05, 0.004, 0.024]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#4f8a3a" /></mesh>)}
          </group>
          {/* LAS HOJAS */}
          {LEAVES.map((L, i) => {
            if (L.inner && s.openUp > 0.5 && i % 2 === 0) return null;
            const chl = (s.chlor * (L.tip ? 1 : 0.15)) * (1 - s.regreen * (L.tip ? 1 : 0)), nit = s.nitroLow * (L.low ? 1 : 0);
            let c = mix(mix(leafCol, "#d9d36a", chl), "#e0c24a", nit);
            if (s.regreen > 0.01 && L.tip) c = mix(c, "#2f8a2a", s.regreen);
            const third = s.third * (L.third ? 1 : 0);
            return <mesh key={i} position={L.p} rotation={L.rot} scale={[0.038 * L.s * (1 + 0.25 * s.closed), 0.0042, 0.017 * L.s]} castShadow>
              <sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={c} roughness={0.38} emissive={third > 0.01 ? "#ff8a3d" : "#c8ff7a"} emissiveIntensity={third > 0.01 ? 0.5 * third : 0.25 * s.leafHi + 0.35 * s.sunLeaf * (L.p[1] > CC[1] ? 1 : 0)} />
            </mesh>;
          })}
          {/* la copa cerrada como un paraguas: hojas extra por fuera y la sombra adentro */}
          {Array.from({ length: 90 }, (_, i) => { const L = LEAVES[i * 3]; return <mesh key={"x" + i} visible={s.closed > 0.01} position={[L.p[0] * 1.08, L.p[1] + 0.04, PZ + (L.p[2] - PZ) * 1.08]} rotation={L.rot} scale={[0.04 * s.closed + 0.001, 0.0042, 0.018]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#2a5a22" roughness={0.45} emissive="#ff4a3d" emissiveIntensity={0.25 * s.closedHi} /></mesh>; })}
          <mesh position={CC} scale={[CR[0] * 0.8, CR[1] * 0.8, CR[2] * 0.8]} visible={s.closed > 0.01}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#14240f" roughness={1} transparent opacity={0.6 * s.closed} /></mesh>
          {/* LOS LIMONES: de 4 arriba de todo a 52 en la copa (+8 en las ramas de abajo) */}
          {LEMONS.map((L, i) => <group key={"l" + i} visible={i < nLemons}><Lemon p={L.p} rot={L.rot} g={0.85} glow={s.lemonHi + (i < 4 ? s.few * 0.4 : 0)} /></group>)}
          {/* las ramas de abajo: derechas para arriba o dobladas casi horizontales con la tira de tela */}
          {LOWB.map((B, i) => {
            const bend = cl(s.bend), dir: V = [Math.cos(B.a), 0, Math.sin(B.a) * 0.6];
            const base: V = [0.01, SOIL + TRUNK * 0.55, PZ];
            const tip: V = [base[0] + dir[0] * B.len * lerp(0.35, 0.95, bend), base[1] + B.len * lerp(0.9, 0.12, bend), base[2] + dir[2] * B.len * lerp(0.35, 0.95, bend)];
            const mid: V = [(base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2 + 0.04 * bend, (base[2] + tip[2]) / 2];
            const lowLemons = s.low * (1 - s.topLemons);
            return <group key={"lb" + i}>
              <Seg a={base} b={mid} r={0.009} r2={0.007} c="#6f604a" e="#7dff9e" ei={0.6 * s.bendHi} />
              <Seg a={mid} b={tip} r={0.007} r2={0.004} c="#6f604a" e="#7dff9e" ei={0.6 * s.bendHi} />
              {Array.from({ length: 7 }, (_, k) => { const u = (k + 1) / 8; const q: V = [lerp(base[0], tip[0], u), lerp(base[1], tip[1], u) + 0.02, lerp(base[2], tip[2], u)]; return <mesh key={k} position={q} rotation={[k, B.a, 0.6]} scale={[0.036, 0.004, 0.016]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={leafCol} roughness={0.4} /></mesh>; })}
              {Array.from({ length: 4 }, (_, k) => { const u = 0.35 + k * 0.17; const q: V = [lerp(base[0], tip[0], u), lerp(base[1], tip[1], u) - 0.05, lerp(base[2], tip[2], u) + 0.01]; return <group key={"ll" + k} visible={lowLemons > 0.5}><Lemon p={q} rot={k} g={0.9} glow={s.lowHi} /></group>; })}
              {Array.from({ length: 6 }, (_, k) => { const u = 0.25 + k * 0.13; const q: V = [lerp(base[0], tip[0], u), lerp(base[1], tip[1], u) + 0.025, lerp(base[2], tip[2], u)]; return <Flower key={"bf" + k} p={q} k={s.bendFlower} rot={k * 1.3} glow={s.bendFlower} />; })}
              {/* la tira de tela atada al borde de la maceta */}
              <group visible={s.tie > 0.01 && bend > 0.5}>
                <Seg a={tip} b={[Math.cos(B.a) * (RT + 0.01), Y0 + PH, PZ + Math.sin(B.a) * 0.6 * (RT + 0.01)]} r={0.005} c="#3a6aa8" flat={0.4} />
              </group>
            </group>;
          })}
          {/* LAS FLORES y los limoncitos recién cuajados */}
          {FLOWERS.map((F, i) => <Flower key={"f" + i} p={F.p} k={s.flower * (s.drop > 0.5 && i % 3 !== 0 ? 1 - s.dropK : 1)} rot={F.rot} glow={s.flowerHi} />)}
          {FRUITLETS.map((F, i) => { const gone = s.thinout > 0.5 && i % 3 !== 0 ? s.thinK : 0; return <group key={"fl" + i} visible={s.set > 0.01 && gone < 0.95}><Lemon p={[F.p[0], F.p[1] - 0.012, F.p[2]]} k={0.32 * s.set * (1 - gone)} g={0.05} glow={s.thinoutHi * (i % 3 === 0 ? 1 : 0)} rot={F.rot} /></group>; })}
          {/* lo que cae: flores (blanco) y limoncitos (verde) */}
          <Dust k={s.drop} t={t} col="#ffffff" from={[CC[0], CC[1] - 0.1, CC[2] + 0.1]} to={SOIL + 0.02} n={50} spread={0.9} size={0.006} />
          <Dust k={s.setDrop} t={t * 0.8} col="#7fbf4a" from={[CC[0], CC[1] - 0.1, CC[2] + 0.1]} to={SOIL + 0.02} n={26} spread={0.8} size={0.009} />
          {/* el agua que se va por las hojas en el calor */}
          <Dust k={s.heat} t={t * 0.5} col="#cfe9ff" from={[CC[0], CC[1] + 0.1, CC[2] + 0.1]} to={CC[1] + 0.8} n={40} spread={0.9} size={0.006} />
          {/* el pincel que pasa de flor en flor */}
          <group position={[FLOWERS[3].p[0] + 0.06 * Math.sin(t * 1.3), FLOWERS[3].p[1] + 0.02, FLOWERS[3].p[2] + 0.06]} rotation={[0.4, 0, 0.7]} visible={s.brush > 0.02}>
            <Seg a={[0, 0, 0]} b={[0, 0.16, 0]} r={0.004} c="#c9a26a" />
            <mesh position={[0, -0.012, 0]} scale={[0.006, 0.016, 0.006]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f2d64a" emissive="#ffd84a" emissiveIntensity={0.5} /></mesh>
          </group>
          {/* la tijera de podar */}
          <group position={[0.32 - 0.06 * s.snip, CC[1] - 0.05, PZ + 0.32]} rotation={[0, 0.6, 0.2]} visible={s.snip > 0.02}>
            <Box p={[0, 0, 0]} s={[0.16, 0.012, 0.02]} c="#c7c9cc" m={0.85} r={0.25} rad={0.003} rot={[0, 0, 0.14 * Math.sin(t * 7) * s.snip]} />
            <Box p={[0, 0, 0.004]} s={[0.16, 0.012, 0.02]} c="#c7c9cc" m={0.85} r={0.25} rad={0.003} rot={[0, 0, -0.14 * Math.sin(t * 7) * s.snip]} />
            <mesh position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.007, 8, 16]} /><meshStandardMaterial color="#c0392b" /></mesh>
          </group>
          {/* el plástico de las noches de helada (no toca las hojas) y la escarcha */}
          <mesh position={[CC[0], CC[1] - 0.05, CC[2]]} scale={[CR[0] * 1.25, CR[1] * 1.55, CR[2] * 1.25]} visible={s.frost > 0.01}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#eaf4ff" roughness={0.15} transparent opacity={0.28 * s.frost} depthWrite={false} side={THREE.DoubleSide} /></mesh>
          {/* la media sombra de los días de calor */}
          <Box p={[CC[0], CC[1] + CR[1] + 0.3, CC[2]]} s={[1.2 * s.shadeNet + 0.001, 0.01, 1.0]} c="#2f5a32" r={0.9} op={0.75} rad={0.002} />
        </group>
      </group>
      {/* el riego: la regadera inclinada y el agua que baja (sin girar con la maceta) */}
      <group position={[-0.62 + 0.3 * s.pour, 0.55 + 0.45 * s.pour, PZ + 0.08]} rotation={[0, 0.4, -0.7 * s.pour]} visible={s.pour > 0.02 || s.sip > 0.02}>
        <Cyl p={[0, 0.16, 0]} r={0.12 * (s.sip > 0.5 ? 0.45 : 1)} h={0.32 * (s.sip > 0.5 ? 0.5 : 1)} c={s.sip > 0.5 ? "#e9e3d6" : "#a8acb0"} rough={0.35} m={s.sip > 0.5 ? 0 : 0.7} />
        <Seg a={[0.1, 0.12, 0]} b={[0.34, 0.36, 0]} r={0.016} r2={0.01} c="#a8acb0" />
      </group>
      <Dust k={Math.max(s.pour, 0.5 * s.sip)} t={t * 2.2} col={s.pourIron > 0.5 ? "#7ac0b0" : "#9fd3ff"} from={[-0.12, 1.0, PZ]} to={SOIL} n={s.sip > 0.5 ? 18 : 70} spread={0.3} size={0.007} />

      {/* ===== LA MACETA CHICA DE 10 LITROS (error 1) ===== */}
      <group position={SMALL}>
        <Cyl p={[0, 0.11, 0]} r={0.12} r2={0.09} h={0.22} c="#2a2a2a" rough={0.6} e="#ff4a3d" ei={0.3 * s.small} />
        <mesh position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.115, 24]} /><meshStandardMaterial color="#3f2c1e" /></mesh>
        <Seg a={[0, 0.2, 0]} b={[0, 0.45, 0]} r={0.008} c="#7a6a52" />
        {Array.from({ length: 40 }, (_, i) => { const th = rnd(i, 91) * 6.28, u = rnd(i, 92); return <mesh key={i} position={[Math.cos(th) * 0.12 * Math.sin(u * 3), 0.55 + (u - 0.5) * 0.2, Math.sin(th) * 0.11 * Math.sin(u * 3)]} rotation={[rnd(i, 93) * 3, th, 0.5]} scale={[0.03, 0.004, 0.014]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={mix("#6a8a3a", "#c9b84a", 0.4)} roughness={0.5} /></mesh>; })}
        {/* raíces que salen por abajo */}
        {[0, 1, 2, 3].map((k) => <Seg key={k} a={[(k - 1.5) * 0.04, 0.01, 0]} b={[(k - 1.5) * 0.07, 0.0, 0.08]} r={0.003} c="#d8c39a" />)}
      </group>

      {/* ===== LA MESA DE TRABAJO ===== */}
      <Box p={[TABLE[0] + 0.15, TABLE[1] - 0.03, TABLE[2]]} s={[1.3, 0.06, 0.62]} c="#8a5f3a" map={tx.wood} r={0.8} />
      {[[-0.45, -0.25], [0.75, -0.25], [-0.45, 0.25], [0.75, 0.25]].map(([x, z], i) => <Box key={i} p={[TABLE[0] + x, 0.37, TABLE[2] + z]} s={[0.06, 0.74, 0.06]} c="#76502f" />)}
      {/* la bandeja con las cáscaras de plátano: frescas amarillas → negras crujientes */}
      <group position={[TABLE[0] - 0.32, TABLE[1] + 0.005, TABLE[2] + 0.08]}>
        <Box p={[0, 0.004, 0]} s={[0.36, 0.008, 0.24]} c="#b9bcc0" m={0.6} r={0.35} rad={0.004} />
        {Array.from({ length: 5 }, (_, i) => { const k = s.peelDry; return <group key={i} position={[-0.12 + i * 0.06, 0.018, (i % 2 ? 0.04 : -0.04)]} rotation={[0, i * 0.7, 0]} visible={s.banana > 0.01 || s.peelDry > 0.01}>
          {[0, 1, 2].map((j) => <mesh key={j} position={[Math.cos(j * 2.1) * 0.03, 0, Math.sin(j * 2.1) * 0.03]} rotation={[0, j * 2.1, 0.15 + 0.4 * k]} scale={[0.05 * (1 - 0.25 * k), 0.006, 0.018 * (1 - 0.3 * k)]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color={mix("#e8c93a", "#1c140c", k)} roughness={lerp(0.5, 0.9, k)} emissive="#ffd84a" emissiveIntensity={0.3 * s.spoonHi} /></mesh>)}
        </group>; })}
      </group>
      {/* el frasco con el polvo marrón de las cáscaras */}
      <group position={[TABLE[0] - 0.05, TABLE[1], TABLE[2] - 0.12]} visible={s.bananaJar > 0.01}>
        <Cyl p={[0, 0.08, 0]} r={0.05} h={0.16} c="#cfe3e0" rough={0.05} op={0.35} />
        <Cyl p={[0, 0.05, 0]} r={0.047} h={0.1} c="#4a3220" rough={1} e="#ffb84a" ei={0.3 * s.spoonHi} />
        <Cyl p={[0, 0.17, 0]} r={0.052} h={0.02} c="#b8a07a" rough={0.6} />
      </group>
      {/* la ceniza de leña en un bol */}
      <group position={[TABLE[0] + 0.12, TABLE[1], TABLE[2] + 0.1]} visible={s.ash > 0.01}>
        <Cyl p={[0, 0.03, 0]} r={0.07} r2={0.045} h={0.06} c="#d8d2c6" rough={0.6} open />
        <mesh position={[0, 0.045, 0]} scale={[0.062, 0.03 * (1 - 0.7 * s.ashNo), 0.062]}><sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#9a9a96" roughness={1} emissive={s.ashNo > 0.5 ? "#ff4a3d" : "#ffffff"} emissiveIntensity={0.25 * s.ashHi + 0.4 * s.ashNo} /></mesh>
      </group>
      {/* la borra de café en un plato */}
      <group position={[TABLE[0] + 0.3, TABLE[1], TABLE[2] + 0.12]} visible={s.coffee > 0.01}>
        <Cyl p={[0, 0.005, 0]} r={0.08} h={0.01} c="#f2eee6" rough={0.4} />
        <mesh position={[0, 0.012, 0]} scale={[0.06, 0.015, 0.06]}><sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#2a1a10" roughness={1} emissive="#ffb84a" emissiveIntensity={0.25 * s.spoonHi} /></mesh>
      </group>
      {/* la cáscara de huevo: entera rota → molida casi polvo */}
      <group position={[TABLE[0] + 0.48, TABLE[1], TABLE[2] + 0.08]} visible={s.egg > 0.01}>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rnd(i, 101) - 0.5) * 0.1, 0.012, (rnd(i, 102) - 0.5) * 0.08]} rotation={[rnd(i, 103) * 3, rnd(i, 104) * 3, 0]} scale={[0.022 * (1 - 0.8 * s.eggHi), 0.012 * (1 - 0.8 * s.eggHi), 0.018 * (1 - 0.8 * s.eggHi)]}><sphereGeometry args={[1, 10, 6, 0, Math.PI]} /><meshStandardMaterial color="#f6f1e6" roughness={0.6} side={THREE.DoubleSide} /></mesh>)}
        <mesh position={[0, 0.006, 0]} scale={[0.05, 0.012 * s.eggHi + 0.0005, 0.05]}><sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f3eee2" roughness={1} emissive="#ffffff" emissiveIntensity={0.3 * s.eggHi} /></mesh>
      </group>
      {/* el compost (la base) */}
      <mesh position={[TABLE[0] + 0.62, TABLE[1] + 0.005, TABLE[2] - 0.12]} scale={[0.1, 0.06 * s.compost + 0.0005, 0.09]} visible={s.compost > 0.01}><sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#2f2116" roughness={1} emissive="#ffe2a0" emissiveIntensity={0.25 * s.spoonHi} /></mesh>
      {/* la mezcla de la tierra 1-1-1 */}
      {[[0, "#5a3f2a"], [0.17, "#2f2116"], [0.34, "#cdb98e"]].map(([x, c], i) => (
        <mesh key={"mx" + i} position={[TABLE[0] - 0.4 + (x as number), TABLE[1] + 0.02, TABLE[2] - 0.17]} scale={[0.07, 0.05 * s.mix111 + 0.0001, 0.06]} visible={s.mix111 > 0.02}>
          <sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={c as string} roughness={1} emissive="#ffe2a0" emissiveIntensity={0.2 * s.mix111} />
        </mesh>))}
      {/* el hierro: sulfato (cristalitos verde azulado) y quelato (polvo rojo oscuro) */}
      <group position={[TABLE[0] + 0.05, TABLE[1], TABLE[2] - 0.2]} visible={s.sulfate > 0.01}>
        <Cyl p={[0, 0.06, 0]} r={0.045} h={0.12} c="#cfe3e0" rough={0.05} op={0.35} />
        {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[(rnd(i, 111) - 0.5) * 0.06, 0.012 + rnd(i, 112) * 0.07, (rnd(i, 113) - 0.5) * 0.06]} rotation={[rnd(i, 114) * 3, rnd(i, 115) * 3, 0]}><octahedronGeometry args={[0.009, 0]} /><meshStandardMaterial color="#4fb8a8" roughness={0.2} metalness={0.1} emissive="#4fe8d0" emissiveIntensity={0.4 * s.sulfateHi} /></mesh>)}
      </group>
      <group position={[TABLE[0] + 0.25, TABLE[1], TABLE[2] - 0.2]} visible={s.chelate > 0.01}>
        <Cyl p={[0, 0.06, 0]} r={0.045} h={0.12} c="#ffffff" rough={0.4} />
        <Box p={[0, 0.07, 0.046]} s={[0.07, 0.05, 0.002]} c="#8a2a1a" rad={0.001} />
        <mesh position={[0.09, 0.006, 0.03]} scale={[0.035, 0.01, 0.03]}><sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#7a1a10" roughness={1} emissive="#ff4a2a" emissiveIntensity={0.3 * s.chelate} /></mesh>
      </group>
      {/* las bolsas: abono de cítricos (con el limón dibujado) y el de pasto (verde, prohibido) */}
      <group position={[TABLE[0] + 0.55, TABLE[1] + 0.14, TABLE[2] - 0.05]} visible={s.bag > 0.01}>
        <Box p={[0, 0, 0]} s={[0.18, 0.28, 0.08]} c="#f2e6c8" r={0.7} rad={0.02} />
        <mesh position={[0, 0.03, 0.041]} scale={[0.04, 0.05, 0.001]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#f2d33a" /></mesh>
        <Box p={[0, -0.08, 0.041]} s={[0.12 * (1 - 0.5 * s.bagHalf), 0.02, 0.002]} c="#3f7a3a" e="#7dff9e" ei={0.6 * s.bagHalf} rad={0.002} />
      </group>
      <group position={[TABLE[0] + 0.76, TABLE[1] + 0.14, TABLE[2] - 0.05]} visible={s.grass > 0.01}>
        <Box p={[0, 0, 0]} s={[0.18, 0.28, 0.08]} c="#2f8a3a" r={0.7} rad={0.02} e="#ff4a3d" ei={0.25 * s.grass} />
        <Box p={[0, 0, 0.042]} s={[0.17, 0.02, 0.002]} c="#ff3b30" rot={[0, 0, 0.8]} rad={0.002} e="#ff3b30" ei={0.6} />
        <Box p={[0, 0, 0.043]} s={[0.17, 0.02, 0.002]} c="#ff3b30" rot={[0, 0, -0.8]} rad={0.002} e="#ff3b30" ei={0.6} />
      </group>
      {/* el limonero de semilla en un vasito (7-8 años) */}
      <group position={[TABLE[0] - 0.42, TABLE[1], TABLE[2] - 0.15]} visible={s.seedTree > 0.01}>
        <Cyl p={[0, 0.04, 0]} r={0.03} r2={0.024} h={0.08} c="#f2f2ee" rough={0.4} />
        <Seg a={[0, 0.08, 0]} b={[0, 0.16, 0]} r={0.002} c="#5f8a3a" />
        {[0, 1, 2, 3].map((k) => <mesh key={k} position={[(k % 2 ? 0.015 : -0.015), 0.12 + k * 0.012, 0]} rotation={[0, k, k % 2 ? -0.5 : 0.5]} scale={[0.016, 0.002, 0.008]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#3f7a32" /></mesh>)}
      </group>

      {/* macetas de adorno del patio */}
      {([[-2.4, 0, -1.7, 1.2, "#3d6e2e", "#2f8a2a", 0], [2.9, 0, -2.0, 1.5, "#2f5f26", "#e2c22a", 0.5], [-3.1, 0, -0.9, 1.0, "#3a7a33", "#d8261c", 0], [3.7, 0, -1.2, 1.3, "#2c5a24", "#e88a2a", 0.4]] as [number, number, number, number, string, string, number][]).map(([x, y, z, sc, can, fr, tall], i) => (
        <group key={"sp" + i} position={[x, y, z]} scale={sc}>
          <Cyl p={[0, 0.17, 0]} r={0.2} r2={0.15} h={0.34} c="#b5653d" rough={0.85} />
          {tall > 0 && <Seg a={[0, 0.33, 0]} b={[0, 0.33 + tall, 0]} r={0.025} c="#6b5236" />}
          <mesh position={[0, 0.55 + tall, 0]} scale={[0.32, 0.26, 0.3]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={can} roughness={0.85} /></mesh>
          {Array.from({ length: 7 }, (_, k) => <mesh key={k} position={[(rnd(k + i * 9, 1) - 0.5) * 0.5, 0.45 + tall + rnd(k + i * 9, 2) * 0.25, 0.18 + rnd(k + i * 9, 3) * 0.1]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color={fr} roughness={0.35} /></mesh>)}
        </group>))}

      {/* la mesita con el LIBRO 1 de la colección: se abre en la página del árbol en maceta */}
      <Box p={[BOOK[0], 0.72, BOOK[2]]} s={[0.9, 0.04, 0.6]} c="#9a7a56" r={0.6} rad={0.01} />
      {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z], i) => <Box key={"m" + i} p={[BOOK[0] + x, 0.35, BOOK[2] + z]} s={[0.04, 0.7, 0.04]} c="#5a3e28" r={0.6} rad={0.006} />)}
      {s.book > 0.01 && pg.m1_p001 && <Book p={[BOOK[0] - 0.12, BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.08} open={s.open} cover={pg.m1_p001} inside={pg.m1_p028_r} right={pg.m1_p028} spine="#4f8a3c" />}
    </ThreeCanvas>
  );
};
