// ssl29 · EL MUNDO: la casa de Sachiko en corte (le falta la pared del frente), de mañana, con la luz del shoji de costado.
// Living de tatami a la izquierda (el chabudai redondo, la pila de zabuton, el rincón liso de la pared, la repisa con la radio
// vieja y el timer de cocina, el reloj), el bastón apoyado en la pared (que ella nunca usó) y el sillón reclinable (que se va).
// A la derecha el dormitorio (futón bajo, ventana) y el rincón de la ropa (el colgador pulpo y el tendedero).
// Sirve a los 5 videos de la tanda: cada video prende SUS estados (tl.ts). UNA escena y UNA cámara. Render SÓLO en el farm.
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

// ---------------- medidas ----------------
// pared del fondo: cara de adentro en z=-2.9; living x -4..1.2, tabique en x 1.2, dormitorio hasta x 4
const ZW = -2.9, HW = 2.5;
const SH0 = -3.0, SH1 = -1.4, SY0 = 0.75, SY1 = 2.0;       // el shoji del living
const BW0 = 2.1, BW1 = 3.3, BY0 = 1.0, BY1 = 1.9;           // la ventana del dormitorio
export const TABLE: V = [-1.2, 0, -0.9];                    // el chabudai (radio 0,45, alto 0,33)
export const CUSH: V = [-0.15, 0, -0.45];                   // la pila de zabuton
export const CORNER: V = [-3.45, 0, -2.45];                 // el rincón liso (sentarse contra la pared)
export const BOOK: V = [-0.98, 0.335, -0.78];
const TH = 0.33;

export const PT = {
  table: [TABLE[0], TH, TABLE[2]] as V, cush: [CUSH[0], 0.2, CUSH[2]] as V, corner: [CORNER[0], 0.4, CORNER[2]] as V,
  radio: [0.35, 1.18, -2.72] as V, timer: [0.85, 1.1, -2.72] as V, clock: [-0.35, 2.05, -2.86] as V,
  cane: [-3.9, 0.5, 0.7] as V, recliner: [-2.85, 0.5, 1.1] as V, bed: [2.7, 0.35, -1.9] as V, hanger: [3.55, 1.75, -0.4] as V, book: BOOK,
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
  p.x += Math.sin(t * 0.53) * 0.01; p.y += Math.sin(t * 0.71 + 1) * 0.007;
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
export const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
export const useCasaTex = () => useMemo(() => ({
  // tatami: paja tejida verde-dorada (una estera = 1 x 2), el borde de tela azul oscuro va aparte
  tatami: mk(256, 512, (g) => {
    g.fillStyle = "#c9c08a"; g.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 4) { const v = 175 + rnd(y, 1) * 30; g.fillStyle = `rgba(${v},${v - 6},${v - 70},.55)`; g.fillRect(0, y, 256, 2); }
    for (let x = 0; x < 256; x += 22) { g.fillStyle = "rgba(90,80,40,.18)"; g.fillRect(x, 0, 1.5, 512); }
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(120,110,50,${0.12 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 512, 3, 1); }
  }),
  // shoji: papel blanco con la grilla de madera clara
  shoji: mk(256, 320, (g) => {
    g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 256, 320);
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(200,185,150,${0.12 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 320, 4, 2); }
    g.fillStyle = "#c9a878"; for (let x = 0; x <= 256; x += 64) g.fillRect(x - 3, 0, 6, 320); for (let y = 0; y <= 320; y += 53) g.fillRect(0, y - 3, 256, 6);
  }),
  // pared de yeso tibio (tsuchikabe liso)
  wall: mk(512, 512, (g) => {
    g.fillStyle = "#e9dfcc"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5200; i++) { const v = 205 + rnd(i, 1) * 35; g.fillStyle = `rgba(${v},${v - 10},${v - 30},.3)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [3, 2]),
  // tela del zabuton (índigo con rayitas)
  cloth: mk(128, 128, (g) => {
    g.fillStyle = "#3b4f7a"; g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 8) { g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(0, y, 128, 2); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(20,30,60,${0.2 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 128, rnd(i, 3) * 128, 2, 2); }
  }, [2, 2]),
  // la esfera del timer de cocina (0-60 con rayas)
  dial: mk(256, 256, (g) => {
    g.fillStyle = "#fbf7ee"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
    g.strokeStyle = "#333"; for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2, r0 = i % 5 ? 108 : 96; g.lineWidth = i % 5 ? 2 : 4; g.beginPath(); g.moveTo(128 + Math.sin(a) * r0, 128 - Math.cos(a) * r0); g.lineTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); g.stroke(); }
    g.fillStyle = "#222"; g.font = "bold 22px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillText(String(i * 5), 128 + Math.sin(a) * 78, 128 - Math.cos(a) * 78); }
  }),
  // la esfera del reloj de pared
  clock: mk(256, 256, (g) => {
    g.fillStyle = "#fffaf0"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
    g.fillStyle = "#2a2a2a"; g.font = "bold 30px serif"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillText(String(i), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
  }),
  // la regla de 15 cm (amarilla, con números)
  ruler: mk(512, 64, (g) => {
    g.fillStyle = "#f2c94c"; g.fillRect(0, 0, 512, 64); g.fillStyle = "#222";
    for (let i = 0; i <= 150; i++) { const x = 6 + i * 3.33, h = i % 10 ? (i % 5 ? 12 : 20) : 30; g.fillRect(x, 0, 1.4, h); }
    g.font = "bold 18px sans-serif"; for (let i = 0; i <= 15; i++) g.fillText(String(i), 2 + i * 33.3, 52);
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
export const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
export const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 32, r2, op, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
// aro de luz en el piso (lo que la voz nombra se ilumina sin corte): anillo ámbar que respira con el estado, nunca parpadea
export const Halo: React.FC<{ p: V; r: number; k: number; col?: string; rotX?: number }> = ({ p, r, k, col = "#ffb347", rotX = -Math.PI / 2 }) =>
  k < 0.01 ? null : <mesh position={p} rotation={[rotX, 0, 0]}><ringGeometry args={[r * 0.82, r, 64]} /><meshBasicMaterial color={col} transparent opacity={0.6 * k} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
// un zabuton (almohadón cuadrado, inflado)
export const Zabuton: React.FC<{ p: V; rotY?: number; glow?: number; map?: Tx; c?: string; fold?: number }> = ({ p, rotY = 0, glow = 0, map, c = "#ffffff", fold = 0 }) => (
  <group position={p} rotation={[0, rotY, 0]}>
    {fold < 0.5
      ? <Box p={[0, 0.04, 0]} s={[0.56, 0.08, 0.6]} c={c} map={map} r={0.95} rad={0.035} e="#ffb347" ei={0.35 * glow} />
      : <Box p={[0, 0.08, 0]} s={[0.56, 0.16, 0.3]} c={c} map={map} r={0.95} rad={0.05} e="#ffb347" ei={0.35 * glow} />}
    <mesh position={[0, fold < 0.5 ? 0.081 : 0.161, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.012, 12]} /><meshStandardMaterial color="#d8c27a" /></mesh>
  </group>
);
// paso numerado en el tatami (bajar en 4 tiempos): un círculo con el número que se enciende de a uno
const numTex = (n: number) => { const cv = document.createElement("canvas"); cv.width = cv.height = 128; const g = cv.getContext("2d")!; g.fillStyle = "#fff"; g.font = "bold 92px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 64, 70); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; };

// ---------------- las páginas REALES de la guía (el render espera a que carguen) ----------------
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
const PW = 0.29, PD = 0.438;
const uv = (u: number, v: number): V => [-PW / 2 + u * PW, 0.0009, -PD / 2 + v * PD];
const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string }> = ({ k, u0, u1, v, h, col = "#ffd60a" }) => {
  if (k <= 0.01) return null;
  const w = (u1 - u0) * PW * k, c = uv(u0, v);
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={0.42} depthWrite={false} toneMapped={false} /></mesh>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useCasaTex();
  const pg = useImgTex(["km_p001", "km_p012"]);
  const nums = useMemo(() => [1, 2, 3, 4].map(numTex), []);
  const s = ST(t);
  const sun = s.eve;                                   // 0 = mañana · 1 = tarde (la luz se entibia)
  const nCush = s.cush;                                // cuántos zabuton hay en la pila (0..3, con decimales al subir)
  const reclX = ease(s.recl) * 3.2;                    // el sillón reclinable se va por el frente
  const timerA = s.timerRun * Math.PI * 2;             // la perilla del timer gira mientras corre
  const radioOn = s.radio;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.4} threshold={0.92} exposure={1.2} env={0.45} />
      <color attach="background" args={[new THREE.Color("#cfdbe6").lerp(new THREE.Color("#e8c9a0"), sun * 0.6).getStyle()]} />
      <fog attach="fog" args={["#d8e0e6", 14, 40]} />
      <hemisphereLight args={[0xf2ece0, 0x7a6650, 1.0]} />
      {/* el sol de la mañana: entra por el shoji de COSTADO (siempre montado; sólo cambia el color con la hora) */}
      <directionalLight position={[-8, 6, -7]} intensity={2.2} color={new THREE.Color("#fff0d6").lerp(new THREE.Color("#ffc890"), sun).getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[-1.2, 2.2, 0.4]} intensity={1.5} distance={8} color="#fff1dc" />
      <pointLight position={[2.7, 2.1, -0.6]} intensity={1.0} distance={6} color="#fff1dc" />
      {/* el foco cálido que marca lo que se nombra (siempre montado; sube con el estado) */}
      <spotLight position={[s.spot[0], 2.4, s.spot[2] + 0.6]} target-position={[s.spot[0], 0, s.spot[2]]} angle={0.45} penumbra={0.8} intensity={0.2 + 5 * s.spotK} distance={5} color="#ffd9a0" />

      {/* el jardín de afuera y el suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#9fa98a" roughness={0.97} /></mesh>
      {/* ===== LA CASA (frente abierto) ===== */}
      {/* piso: 6 esteras de tatami en el living (bordes de tela azul) y madera en el dormitorio */}
      <Box p={[-1.4, 0.02, -0.85]} s={[5.4, 0.04, 4.15]} c="#6b5236" map={tx.planks} r={0.7} rad={0.005} />
      {[[-3.4, -2.35, 0], [-3.4, -0.35, 0], [-2.4, -2.35, 0], [-1.4, -1.35, 1], [0.2, -2.35, 1], [0.2, 0.15, 1], [-2.4, 0.65, 1], [-0.6, 0.65, 0]].map(([x, z, r], i) => {
        const w = r ? 1.6 : 0.95, d = r ? 0.95 : 1.9;
        return <group key={"tt" + i}>
          <Box p={[x, 0.055, z]} s={[w, 0.03, d]} c="#ffffff" map={tt.tatami} r={0.9} rad={0.008} rot={[0, r ? Math.PI / 2 : 0, 0]} />
          {(r ? [[0, d / 2 - 0.02], [0, -d / 2 + 0.02]] : [[w / 2 - 0.02, 0], [-w / 2 + 0.02, 0]]).map(([ox, oz], j) => <Box key={j} p={[x + ox, 0.072, z + oz]} s={r ? [w, 0.006, 0.035] : [0.035, 0.006, d]} c="#1f2a40" r={0.8} rad={0.002} />)}
        </group>;
      })}
      <Box p={[2.6, 0.02, -0.85]} s={[2.8, 0.04, 4.15]} c="#8a6a4a" map={tx.planks} r={0.55} rad={0.005} />
      {/* pared del fondo con el hueco del shoji (living) y de la ventana (dormitorio) */}
      <Box p={[-3.55, HW / 2, ZW - 0.1]} s={[1.1, HW, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(SH0 + SH1) / 2, SY0 / 2, ZW - 0.1]} s={[SH1 - SH0, SY0, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(SH0 + SH1) / 2, (SY1 + HW) / 2, ZW - 0.1]} s={[SH1 - SH0, HW - SY1, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[0.35, HW / 2, ZW - 0.1]} s={[3.5, HW, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(2.1 + 1.2) / 2 + 0.05, HW / 2, ZW - 0.1]} s={[0.9, HW, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(BW0 + BW1) / 2, BY0 / 2, ZW - 0.1]} s={[BW1 - BW0, BY0, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(BW0 + BW1) / 2, (BY1 + HW) / 2, ZW - 0.1]} s={[BW1 - BW0, HW - BY1, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[3.65, HW / 2, ZW - 0.1]} s={[0.7, HW, 0.2]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      {/* el shoji: dos hojas de papel (la de la derecha corrida un poco: entra el sol) */}
      <mesh position={[SH0 + 0.4, (SY0 + SY1) / 2, ZW - 0.06]}><planeGeometry args={[0.8, SY1 - SY0]} /><meshStandardMaterial map={tt.shoji} emissive="#fff3dc" emissiveIntensity={0.35} roughness={0.9} /></mesh>
      <mesh position={[SH1 - 0.55, (SY0 + SY1) / 2, ZW - 0.03]}><planeGeometry args={[0.8, SY1 - SY0]} /><meshStandardMaterial map={tt.shoji} emissive="#fff3dc" emissiveIntensity={0.35} roughness={0.9} /></mesh>
      <Box p={[(SH0 + SH1) / 2, SY0 - 0.03, ZW + 0.02]} s={[SH1 - SH0 + 0.08, 0.05, 0.1]} c="#a9845a" r={0.6} rad={0.008} />
      <Box p={[(SH0 + SH1) / 2, SY1 + 0.03, ZW + 0.02]} s={[SH1 - SH0 + 0.08, 0.05, 0.1]} c="#a9845a" r={0.6} rad={0.008} />
      {/* ventana del dormitorio (marco y vidrio) */}
      {[BW0, BW1].map((x, i) => <Box key={"bw" + i} p={[x, (BY0 + BY1) / 2, ZW - 0.05]} s={[0.05, BY1 - BY0, 0.08]} c="#a9845a" r={0.7} rad={0.008} />)}
      <Box p={[(BW0 + BW1) / 2, BY1, ZW - 0.05]} s={[BW1 - BW0, 0.05, 0.08]} c="#a9845a" r={0.7} rad={0.008} />
      <Box p={[(BW0 + BW1) / 2, BY0, ZW - 0.02]} s={[BW1 - BW0 + 0.08, 0.05, 0.14]} c="#a9845a" r={0.7} rad={0.008} />
      <mesh position={[(BW0 + BW1) / 2, (BY0 + BY1) / 2, ZW - 0.07]}><planeGeometry args={[BW1 - BW0, BY1 - BY0]} /><meshStandardMaterial color="#d6e8f4" transparent opacity={0.2} roughness={0.05} metalness={0.2} /></mesh>
      {/* pared izquierda, tabique con el vano, pared derecha; viga de madera arriba (nageshi) */}
      <Box p={[-4.1, HW / 2, -0.85]} s={[0.2, HW, 4.15]} c="#e5dbc6" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.2, HW / 2, -2.35]} s={[0.12, HW, 1.1]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.2, HW / 2, 0.15]} s={[0.12, HW, 1.9]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[1.2, 2.25, -1.3]} s={[0.12, 0.5, 1.0]} c="#e9dfcc" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[4.1, HW / 2, -0.85]} s={[0.2, HW, 4.15]} c="#e5dbc6" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[0, 1.95, ZW + 0.02]} s={[8.2, 0.07, 0.05]} c="#8a6440" r={0.6} rad={0.006} />
      <Box p={[0, 0.1, ZW + 0.02]} s={[8.2, 0.08, 0.03]} c="#8a6440" r={0.6} rad={0.004} />
      <Box p={[0, HW + 0.07, -2.1]} s={[8.4, 0.14, 1.75]} c="#a9845a" map={tx.planks} r={0.8} rad={0.01} />

      {/* ===== EL LIVING ===== */}
      {/* EL CHABUDAI: mesa redonda y baja de madera (el apoyo para EMPUJAR, nunca tirar) */}
      <group position={TABLE}>
        <Cyl p={[0, TH - 0.02, 0]} r={0.46} h={0.04} c="#7a4e2c" rough={0.35} e="#ffb347" ei={0.25 * s.table} />
        <Cyl p={[0, TH - 0.045, 0]} r={0.43} h={0.012} c="#5a3820" rough={0.5} />
        {[0, 1, 2, 3].map((i) => <Box key={i} p={[Math.cos(i * Math.PI / 2 + 0.78) * 0.3, (TH - 0.05) / 2 + 0.04, Math.sin(i * Math.PI / 2 + 0.78) * 0.3]} s={[0.05, TH - 0.05, 0.05]} c="#5a3820" r={0.5} rad={0.008} />)}
        {/* la taza de té verde (siempre está) */}
        <Cyl p={[0.22, TH + 0.04, 0.12]} r={0.035} r2={0.03} h={0.07} c="#6f8a5a" rough={0.4} />
        {/* la bandeja de la comida (una comida al día en el piso) */}
        {s.meal > 0.01 && <group position={[-0.05, TH + 0.005 + (1 - ease(s.meal)) * 0.3, -0.08]} scale={[1, 1, 1]}>
          <Box p={[0, 0.012, 0]} s={[0.5, 0.025, 0.34]} c="#3a1f14" r={0.25} rad={0.01} />
          <Cyl p={[-0.13, 0.055, 0.05]} r={0.065} r2={0.045} h={0.06} c="#f4f0e6" rough={0.3} />
          <Cyl p={[-0.13, 0.088, 0.05]} r={0.058} h={0.01} c="#ffffff" rough={0.9} />
          <Cyl p={[0.06, 0.055, 0.06]} r={0.06} r2={0.04} h={0.06} c="#7a2e1a" rough={0.3} />
          <Cyl p={[0.06, 0.087, 0.06]} r={0.052} h={0.006} c="#a8763a" rough={0.6} />
          <Box p={[0.15, 0.04, -0.08]} s={[0.12, 0.03, 0.08]} c="#e8e2d0" r={0.5} rad={0.008} />
          <Box p={[0.15, 0.06, -0.08]} s={[0.09, 0.02, 0.05]} c="#e07a5a" r={0.7} rad={0.008} />
          <Box p={[0.05, 0.03, -0.12]} s={[0.22, 0.008, 0.012]} c="#c9a878" r={0.6} rad={0.002} rot={[0, 0.1, 0]} />
        </group>}
      </group>
      <Halo p={[TABLE[0], 0.08, TABLE[2]]} r={0.62} k={s.table} />
      {/* los dos dedos sobre la mesa (lo que queda del apoyo cuando ya casi no lo necesitás) */}
      {s.fingers > 0.01 && [0, 1].map((i) => <mesh key={"fg" + i} position={[TABLE[0] + 0.32 + i * 0.05, TH + 0.003, TABLE[2] + 0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.018 * ease(s.fingers), 24]} /><meshBasicMaterial color="#ff8a3d" transparent opacity={0.9} toneMapped={false} /></mesh>)}
      {/* LA PILA DE ZABUTON: 1, 2 o 3 (empezás alto y vas bajando) + la regla de 15 cm */}
      {[0, 1, 2].map((i) => {
        const k = cl(nCush - i); if (k < 0.01) return null;
        return <Zabuton key={"zb" + i} p={[CUSH[0] + (1 - ease(k)) * 0.5, 0.07 + i * 0.08 + (1 - ease(k)) * 0.35, CUSH[2]]} rotY={0.08 * (i - 1)} map={tt.cloth} c={i === 1 ? "#ffd9c8" : "#ffffff"} glow={s.cushGlow} fold={i === 0 ? s.fold : 0} />;
      })}
      <Halo p={[CUSH[0], 0.08, CUSH[2]]} r={0.48} k={s.cushGlow} />
      {s.ruler > 0.01 && <mesh position={[CUSH[0] + 0.33, 0.075 + 0.075 * ease(s.ruler), CUSH[2] + 0.2]} rotation={[0, -0.25, Math.PI / 2]}><planeGeometry args={[0.15 * ease(s.ruler) + 0.001, 0.03]} /><meshStandardMaterial map={tt.ruler} roughness={0.6} side={THREE.DoubleSide} /></mesh>}
      {/* EL RINCÓN LISO: un zabuton contra la pared (cruzar las piernas con la espalda apoyada) */}
      <Zabuton p={[CORNER[0], 0.07, CORNER[2]]} rotY={0.6} map={tt.cloth} glow={s.wall} />
      <Box p={[-3.98, 0.7, -2.3]} s={[0.02, 1.1, 0.9]} c="#f6ecd8" r={0.95} rad={0.004} e="#ffb347" ei={0.3 * s.wall} />
      <Halo p={[CORNER[0], 0.08, CORNER[2]]} r={0.5} k={s.wall} />
      {/* los 4 tiempos: cuatro pasos numerados en el tatami, entre el almohadón y la mesa */}
      {[0, 1, 2, 3].map((i) => {
        const k = cl(s.count * 4 - i); if (k < 0.01) return null;
        const x = lerp(CUSH[0] - 0.2, TABLE[0] + 0.6, i / 3), z = lerp(CUSH[2] + 0.45, TABLE[2] + 0.55, i / 3) + (i % 2 ? 0.12 : 0);
        return <group key={"st" + i} position={[x, 0.08, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh><circleGeometry args={[0.11 * ease(k), 40]} /><meshBasicMaterial color="#e2572b" transparent opacity={0.9} toneMapped={false} /></mesh>
          <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.16 * ease(k), 0.16 * ease(k)]} /><meshBasicMaterial map={nums[i]} transparent depthWrite={false} toneMapped={false} /></mesh>
        </group>;
      })}
      {/* nariz sobre los dedos: las pantuflas y la línea de luz vertical que baja de la nariz a la punta del pie */}
      <group position={[TABLE[0] + 0.75, 0.075, TABLE[2] + 0.55]} rotation={[0, -0.5, 0]}>
        {[-0.07, 0.07].map((x, i) => <Box key={i} p={[x, 0.025, 0]} s={[0.1, 0.05, 0.25]} c="#c75b5b" r={0.9} rad={0.03} />)}
        {s.nose > 0.01 && <mesh position={[0, 0.6 * ease(s.nose), 0.11]}><cylinderGeometry args={[0.006, 0.006, 1.2 * ease(s.nose), 8]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.85} toneMapped={false} /></mesh>}
        <Halo p={[0, 0.002, 0.11]} r={0.08} k={s.nose} col="#ffd27a" />
      </group>
      {/* sin manos: el aro grande en el medio del tatami (pararse sin apoyar nada) */}
      <Halo p={[-1.9, 0.08, 0.35]} r={0.55} k={s.noHands} col="#7fd1ff" />
      <Halo p={[-1.9, 0.08, 0.35]} r={0.35} k={s.noHands * 0.7} col="#7fd1ff" />
      {/* LA REPISA con la radio vieja (NHK) y el timer de cocina; el reloj arriba */}
      <Box p={[0.6, 0.98, -2.72]} s={[1.1, 0.04, 0.32]} c="#7a4e2c" r={0.5} rad={0.008} />
      {[0.1, 1.1].map((x, i) => <Box key={"mn" + i} p={[x, 0.92, -2.8]} s={[0.04, 0.1, 0.18]} c="#5a3820" r={0.5} rad={0.006} />)}
      <group position={[0.35, 1.12, -2.72]}>
        <Box p={[0, 0, 0]} s={[0.36, 0.24, 0.16]} c="#6e4a2a" r={0.35} rad={0.025} e="#ffb347" ei={0.15 * radioOn} />
        <mesh position={[-0.06, 0.01, 0.081]}><planeGeometry args={[0.18, 0.15]} /><meshStandardMaterial color="#d8c8a0" roughness={0.95} emissive="#ffcf7a" emissiveIntensity={0.6 * radioOn} /></mesh>
        <Cyl p={[0.12, 0.03, 0.085]} r={0.025} h={0.02} c="#e8dcc0" rot={[Math.PI / 2, 0, 0]} />
        <Cyl p={[0.12, -0.05, 0.085]} r={0.018} h={0.02} c="#e8dcc0" rot={[Math.PI / 2, radioOn * 2, 0]} />
        {/* la lucecita de encendido (sube y baja con el estado, sin parpadear) */}
        <mesh position={[0.12, 0.09, 0.082]}><circleGeometry args={[0.008, 12]} /><meshBasicMaterial color="#ff6a3a" transparent opacity={0.15 + 0.85 * radioOn} toneMapped={false} /></mesh>
      </group>
      <group position={[0.85, 1.07, -2.7]} scale={1 + 0.25 * s.timer}>
        <Cyl p={[0, 0, 0]} r={0.075} h={0.07} c="#e8e2d2" rough={0.35} rot={[Math.PI / 2, 0, 0]} e="#ffb347" ei={0.2 * s.timer} />
        <mesh position={[0, 0, 0.036]} rotation={[0, 0, -timerA]}><circleGeometry args={[0.065, 48]} /><meshStandardMaterial map={tt.dial} roughness={0.5} /></mesh>
        <mesh position={[0, 0.06, 0.04]}><coneGeometry args={[0.008, 0.016, 3]} /><meshBasicMaterial color="#c0392b" /></mesh>
      </group>
      <group position={PT.clock}>
        <Cyl p={[0, 0, 0]} r={0.17} h={0.04} c="#7a4e2c" rough={0.4} rot={[Math.PI / 2, 0, 0]} />
        <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.15, 48]} /><meshStandardMaterial map={tt.clock} roughness={0.5} /></mesh>
        <mesh position={[0, 0, 0.024]} rotation={[0, 0, -(t / 60) * Math.PI * 2 * 0.02 - 1.2]}><planeGeometry args={[0.008, 0.2]} /><meshBasicMaterial color="#222" /></mesh>
        <mesh position={[0, 0, 0.025]} rotation={[0, 0, -t * 0.105]}><planeGeometry args={[0.004, 0.24]} /><meshBasicMaterial color="#b03a2e" /></mesh>
      </group>
      {/* EL BASTÓN apoyado en la pared (nunca lo necesitó): la X roja aparece al lado cuando ella lo dice */}
      <group position={[-3.93, 0, 0.7]} rotation={[0, 0, -0.12]}>
        <Cyl p={[0, 0.45, 0]} r={0.013} h={0.9} c="#4a2e1a" rough={0.4} e="#ffb347" ei={0.3 * s.cane} />
        <mesh position={[0.06, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.06, 0.013, 12, 24, Math.PI]} /><meshStandardMaterial color="#4a2e1a" roughness={0.4} /></mesh>
      </group>
      {s.caneX > 0.01 && [0.8, -0.8].map((r, i) => <mesh key={"cx" + i} position={[-3.97, 0.5, 0.72]} rotation={[0, Math.PI / 2, r]}><planeGeometry args={[0.05, 0.75 * ease(s.caneX)]} /><meshBasicMaterial color="#d63a2a" transparent opacity={0.9} toneMapped={false} /></mesh>)}
      {/* EL SILLÓN RECLINABLE (el que su madre nunca tuvo): se va por el frente cuando ella lo dice */}
      {reclX < 3.1 && <group position={[-2.85 - reclX * 0.2, 0, 1.1 + reclX]} rotation={[0, 0.35 + reclX * 0.2, 0]}>
        <Box p={[0, 0.25, 0]} s={[0.85, 0.4, 0.8]} c="#7a5a48" r={0.9} rad={0.08} e="#ffb347" ei={0.2 * s.reclGlow} />
        <Box p={[0, 0.7, -0.38]} s={[0.85, 0.75, 0.2]} c="#7a5a48" r={0.9} rad={0.08} rot={[-0.25, 0, 0]} />
        {[-0.45, 0.45].map((x, i) => <Box key={i} p={[x, 0.5, 0]} s={[0.16, 0.25, 0.8]} c="#6a4a3a" r={0.9} rad={0.06} />)}
      </group>}
      {/* plantita y un florero en el tokonoma (rincón izquierdo de atrás, sobre una tarima) */}
      <Box p={[-2.25, 0.12, -2.6]} s={[1.0, 0.1, 0.5]} c="#8a6440" r={0.4} rad={0.01} />
      <Cyl p={[-2.4, 0.3, -2.62]} r={0.06} r2={0.08} h={0.26} c="#2f4a5a" rough={0.25} />
      {[0, 1, 2].map((i) => <Cyl key={"rm" + i} p={[-2.4 + (i - 1) * 0.04, 0.55, -2.62]} r={0.004} h={0.3} c="#5a7a3a" rot={[0, 0, (i - 1) * 0.3]} />)}
      <mesh position={[-2.2, 1.15, ZW + 0.012]}><planeGeometry args={[0.36, 1.0]} /><meshStandardMaterial color="#efe6d0" roughness={0.95} /></mesh>
      <mesh position={[-2.2, 1.2, ZW + 0.014]}><planeGeometry args={[0.05, 0.6]} /><meshBasicMaterial color="#2a2a2a" transparent opacity={0.75} /></mesh>

      {/* ===== EL DORMITORIO ===== */}
      <group position={[2.7, 0, -1.9]}>
        <Box p={[0, 0.12, 0]} s={[1.3, 0.16, 2.0]} c="#8a6440" r={0.5} rad={0.02} />
        <Box p={[0, 0.25, 0.05]} s={[1.2, 0.12, 1.85]} c="#f4efe4" r={0.95} rad={0.05} e="#ffb347" ei={0.25 * s.bed} />
        <Box p={[0, 0.34, 0.25]} s={[1.18, 0.08, 1.4]} c="#d9c4a0" map={tx.paper} r={0.95} rad={0.05} />
        <Box p={[0, 0.36, -0.7]} s={[0.55, 0.1, 0.3]} c="#ffffff" r={0.95} rad={0.05} />
      </group>
      <Box p={[3.75, 0.2, -2.55]} s={[0.4, 0.4, 0.4]} c="#7a4e2c" r={0.5} rad={0.01} />
      <Cyl p={[3.75, 0.55, -2.55]} r={0.1} r2={0.13} h={0.3} c="#f4ead4" rough={0.9} e="#ffdca0" ei={0.5} />
      {/* EL RINCÓN DE LA ROPA: la barra, el colgador pulpo con medias y el tendedero */}
      <Box p={[3.0, 1.95, -0.3]} s={[1.6, 0.03, 0.03]} c="#c8ccd0" m={0.6} r={0.3} rad={0.01} />
      <group position={[3.55, 1.6, -0.3]}>
        <Cyl p={[0, 0.3, 0]} r={0.004} h={0.1} c="#d8dde2" />
        <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.008, 8, 48]} /><meshStandardMaterial color="#8ab4d8" roughness={0.4} emissive="#ffb347" emissiveIntensity={0.4 * s.laundry} /></mesh>
        {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; const on = s.socks * 10 > i;
          return <group key={"pz" + i} position={[Math.cos(a) * 0.22, 0.12, Math.sin(a) * 0.22]}>
            <Box p={[0, 0.08, 0]} s={[0.018, 0.04, 0.012]} c="#f2c94c" r={0.6} rad={0.003} />
            {on && <Box p={[0, -0.04, 0]} s={[0.05, 0.18, 0.012]} c={["#e8e2d4", "#c75b5b", "#3b4f7a", "#8a9a6a"][i % 4]} r={0.95} rad={0.01} />}
          </group>; })}
      </group>
      {[[2.55, "#f4efe4"], [2.85, "#b8cde0"], [3.15, "#e8d4c4"]].map(([x, c], i) => s.shirts * 3 > i && <group key={"sh" + i} position={[x as number, 1.6, -0.3]} rotation={[0, Math.sin(t * 0.6 + i) * 0.04, 0]}>
        <Box p={[0, 0.33, 0]} s={[0.36, 0.015, 0.015]} c="#d8dde2" r={0.4} rad={0.005} />
        <Box p={[0, 0.02, 0]} s={[0.38, 0.6, 0.03]} c={c as string} r={0.95} rad={0.02} />
      </group>)}
      <Halo p={[3.0, 0.08, -0.3]} r={0.75} k={s.laundry} />

      {/* ===== LA GUÍA (The Osaka Walk) sobre el chabudai: se abre en la página real ===== */}
      {s.book > 0.01 && pg.km_p001 && <Book p={[BOOK[0], BOOK[1] + (1 - ease(s.book)) * 0.5, BOOK[2]]} rotY={0.25} open={s.open} cover={pg.km_p001} inside={pg.km_p012_r} right={pg.km_p012} spine="#5bbcf0">
        {s.open > 0.9 && <>
          <PageHi k={s.hi[0]} u0={0.52} u1={0.95} v={0.3} h={0.05} />
          <PageHi k={s.hi[1]} u0={0.06} u1={0.48} v={0.58} h={0.05} col="#ff9a4a" />
          <PageHi k={s.hi[2]} u0={0.52} u1={0.95} v={0.58} h={0.05} col="#7dff9e" />
        </>}
      </Book>}
    </ThreeCanvas>
  );
};
