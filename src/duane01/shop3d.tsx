// duane01 · EL MUNDO: dos garajes en corte, lado a lado, sobre la nieve de Wisconsin.
// Izquierda: el garaje del vecino, helado (bowl del perro hecho hielo, escarcha, todo azul).
// Derecha: el taller de chapa de Duane con la ventana SUR, los 4 tambores negros sobre pallet + espuma, el banco con el
// termómetro de dial, la alarma de CO y la cajita de ladrillos refractarios con el quemador de alcohol.
// Encima, el MAPA DE TEMPERATURA (paleta de cámara térmica): una nube de puntos suaves en el aire + el piso pintado por
// la temperatura, que sale de los tambores cargados por el sol. Una sola escena y UNA cámara por tramo (keyframes).
// Render SÓLO en el farm (acá sólo stills).
import React, { createContext, useContext, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
type V3 = [number, number, number];

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const camAt = (t: number, KF: Key[]) => {
  let i = 0; while (i < KF.length - 1 && KF[i + 1].t <= t) i++;
  const a = KF[i], b = KF[Math.min(i + 1, KF.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: (a.fov ?? 38) + ((b.fov ?? 38) - (a.fov ?? 38)) * k };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.05, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3, KF: Key[]) => project(camAt(t, KF), v3(q));
export const camSpeed = (t: number, KF: Key[]) => {
  const a = camAt(t, KF), b = camAt(t + 1 / FPS, KF);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number; KF: Key[] }> = ({ t, KF }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = camAt(t, KF);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.05; c.far = 400; c.updateProjectionMatrix(); return null;
};

// ---------------- ESTADO de la escena (lo arma cada tramo como función del tiempo) ----------------
export type FX = {
  day: number;        // 0 noche · 1 día claro de enero (sol bajo entrando por la ventana sur)
  heat: number;       // 0..1 opacidad del mapa de temperatura (visión térmica)
  charge: number;     // 0..1 calor guardado en los tambores (sube con el sol, baja de noche)
  blanket: number;    // 0 arriba · 1 frazada bajada tapando el vidrio
  flame: number;      // 0..1 quemador de alcohol en la caja de ladrillos
  alarm: number;      // 0..1 luz roja de la alarma de CO (prueba)
  door: number;       // 0..1 puerta lateral entreabierta (2 pulgadas = 1)
  drums: number;      // cuántos tambores hay (2 → 4)
  frost: number;      // 0..1 escarcha/hielo en el garaje del vecino
  storm: number;      // 0..1 tormenta de nieve gris (sin sol)
  flow: number;       // 0..1 corriente de aire caliente que sube detrás de los tambores y rueda al cuarto
  shopTemp: number;   // °F del taller (para el color del aire)
  nbTemp: number;     // °F del garaje del vecino
  out: number;        // °F afuera
  pot: number;        // 0..1 la maceta de las velas (prueba) sobre el banco
  brick: number;      // 0..1 calor guardado en los ladrillos refractarios (sigue después de apagar la llama)
};
export const FX0: FX = { day: 0, heat: 0, charge: 0.4, blanket: 0, flame: 0, alarm: 0, door: 0, drums: 4, frost: 1, storm: 0, flow: 0, shopTemp: 41, nbTemp: -4, out: -8, pot: 0, brick: 0 };

// paleta de cámara térmica ("iron"): azul profundo → violeta → rojo → naranja → amarillo → blanco
const IRON = ["#05062b", "#1c0b6e", "#5a0f9e", "#a8177e", "#e23a2a", "#ff8a1d", "#ffd23a", "#fff6c8"].map((c) => new THREE.Color(c));
export const ironCol = (u: number) => { const x = cl(u) * (IRON.length - 1), i = Math.min(IRON.length - 2, Math.floor(x)); return IRON[i].clone().lerp(IRON[i + 1], x - i); };
export const ironCss = (u: number) => "#" + ironCol(u).getHexString();
// °F → 0..1 en la escala térmica (−15 °F = azul profundo · 95 °F = blanco)
export const tU = (f: number) => cl((f + 15) / 110);
// temperatura (°F) en un punto del mundo, para la VISIÓN TÉRMICA de superficies (cada caja toma el color de su temperatura)
type TC = { th: number; fx: FX };
const ThermCtx = createContext<TC>({ th: 0, fx: undefined as unknown as FX });
const tempAt = (x: number, y: number, z: number, fx: FX) => {
  if (z < -3.3 || z > 3.3) return fx.out;
  if (x > -11.8 && x < -3.2) return fx.nbTemp + (y / 3.4) * 2 - 1;
  if (x > -1.3 && x < 7.3) {
    let f = fx.shopTemp - (1 - y / 3.4) * 3;
    for (let d = 0; d < Math.round(fx.drums); d++) { const dx = x - DRUM_X[d], dz = (z - DRUM_Z) * 0.8, dy = Math.max(0, DRUM_Y0 + DRUM_H * 0.5 - y) * 1.6; f += fx.charge * 34 / (1 + 3.2 * (dx * dx + dz * dz + dy * dy)); }
    if (fx.flame > 0.01) { const dx = x - 6.2, dz = z + 0.2, dy = y - 1.2; f += fx.flame * 30 / (1 + 6 * (dx * dx + dz * dz + dy * dy)); }
    if (fx.brick > 0.01) { const dx = x - 6.2, dz = z + 0.25, dy = y - 1.15; f += fx.brick * 45 / (1 + 40 * (dx * dx + dz * dz + dy * dy)); }
    if (fx.pot > 0.01) { const dx = x - 6.25, dz = z - 0.15, dy = y - 1.13; f += fx.pot * 55 / (1 + 90 * (dx * dx + dz * dz + dy * dy)); }
    return f;
  }
  return fx.out;
};
const useTherm = (base: string, p: number[], tw?: number) => {
  const T = useContext(ThermCtx);
  if (!T.th) return { c: base, e: undefined as string | undefined, k: 0 };
  const ic = ironCol(tU(tw ?? tempAt(p[0], p[1], p[2], T.fx)));
  return { c: "#" + new THREE.Color(base).lerp(ic, T.th).getHexString(), e: "#" + ic.getHexString(), k: T.th };
};

// ---------------- geometría del taller ----------------
const SX0 = -1, SX1 = 7, SZ0 = -3, SZ1 = 3, SH = 3.4;         // taller de Duane
const NX0 = -11.5, NX1 = -3.5;                                   // garaje del vecino
export const DRUM_X = [1.05, 1.72, 2.39, 3.06], DRUM_Z = -2.5, DRUM_R = 0.29, DRUM_H = 0.88, DRUM_Y0 = 0.1 + 0.05 + 0.14; // piso + espuma + pallet
const WIN_C: V3 = [2.05, 1.75, -2.93], WIN_W = 2.9, WIN_H = 1.7;

// textura de chapa acanalada + textura de escarcha (deterministas)
const mkTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useShopTex = () => useMemo(() => ({
  tin: mkTex(256, 256, (g) => {
    for (let x = 0; x < 256; x++) { const s = Math.sin((x / 256) * Math.PI * 2 * 8); const v = 150 + s * 38; g.fillStyle = `rgb(${v + 6},${v + 4},${v - 2})`; g.fillRect(x, 0, 1, 256); }
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(120,70,30,${0.05 + rnd(i, 2) * 0.12})`; g.beginPath(); g.ellipse(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 3 + rnd(i, 6) * 14, 0, 0, 6.3); g.fill(); }
    g.fillStyle = "rgba(40,40,40,.4)"; for (let y = 0; y < 256; y += 64) for (let x = 4; x < 256; x += 32) { g.beginPath(); g.arc(x, y + 6, 1.6, 0, 6.3); g.fill(); }
  }, [4, 1.4]),
  ice: mkTex(256, 256, (g) => {
    const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, "#d8eeff"); gr.addColorStop(0.7, "#a9d2f2"); gr.addColorStop(1, "#7fb2dc");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,255,255,${0.15 + rnd(i, 7) * 0.5})`; g.beginPath(); g.arc(rnd(i, 1) * 256, rnd(i, 2) * 256, 0.6 + rnd(i, 3) * 2.2, 0, 6.3); g.fill(); } // burbujas atrapadas
    g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1.4;
    for (let i = 0; i < 7; i++) { let x = 128, y = 128, a = (i / 7) * 6.3 + rnd(i, 4); g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += Math.cos(a) * 22; y += Math.sin(a) * 22; a += (rnd(i * 7 + k, 5) - 0.5) * 0.9; g.lineTo(x, y); } g.stroke(); }
  }, [1, 1]),
  rime: mkTex(256, 256, (g) => {
    // escarcha del piso: polvo de cristales que se apaga hacia el borde (nada de ramitas)
    for (let i = 0; i < 3200; i++) { const a = rnd(i, 1) * 6.3, r = Math.sqrt(rnd(i, 2)) * 124, x = 128 + Math.cos(a) * r, y = 128 + Math.sin(a) * r;
      g.fillStyle = `rgba(235,246,255,${(0.25 + rnd(i, 3) * 0.6) * (1 - r / 128)})`; g.beginPath(); g.arc(x, y, 0.3 + rnd(i, 4) * 0.7, 0, 6.3); g.fill(); }
  }, [1, 1]),
  frost: mkTex(256, 256, (g) => {
    g.fillStyle = "rgba(220,240,255,0.15)"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(240,250,255,.85)"; g.lineCap = "round";
    for (let i = 0; i < 70; i++) {
      let x = rnd(i, 1) * 256, y = rnd(i, 2) * 256, a = rnd(i, 3) * 6.3;
      for (let k = 0; k < 9; k++) { const L = 6 + rnd(i * 9 + k, 4) * 16; const nx = x + Math.cos(a) * L, ny = y + Math.sin(a) * L; g.lineWidth = 1.6 - k * 0.12; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke();
        const b = a + (rnd(i * 9 + k, 5) > 0.5 ? 0.9 : -0.9); g.lineWidth = 0.8; g.beginPath(); g.moveTo(nx, ny); g.lineTo(nx + Math.cos(b) * L * 0.5, ny + Math.sin(b) * L * 0.5); g.stroke(); x = nx; y = ny; a += (rnd(i * 9 + k, 6) - 0.5) * 0.8; }
    }
  }, [1, 1]),
  pallet: mkTex(256, 128, (g) => {
    for (let i = 0; i < 7; i++) { const v = 150 + rnd(i, 1) * 40; g.fillStyle = `rgb(${v},${v - 25},${v - 70})`; g.fillRect(i * 37, 0, 31, 128); g.fillStyle = "rgba(60,40,20,.3)"; for (let k = 0; k < 6; k++) g.fillRect(i * 37 + 3 + k * 5, 0, 1, 128); }
  }, [1, 1]),
}), []);

type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number; tw?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o = 1, tw }) => {
  const T = useTherm(c, p, tw);
  return (
    <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
      <meshStandardMaterial color={T.c} roughness={r} metalness={m * (1 - T.k)} emissive={T.e ?? e ?? "#000"} emissiveIntensity={T.e ? T.k * 0.6 : ei} map={T.k > 0.5 ? undefined : map} transparent={o < 1} opacity={o} />
    </mesh>
  );
};
// muro de chapa cortado: chapa afuera, montantes y aislación vista en el canto, chapa adentro. Núcleo un pelo más fino (sin z-fighting).
const TinWall: React.FC<{ p: V3; s: V3; tin?: Tx; inner?: string; insul?: boolean }> = ({ p, s, tin, inner = "#b9b2a4", insul }) => {
  const T0 = useContext(ThermCtx), tw = T0.th ? tempAt(p[0], p[1], p[2], T0.fx) - 16 : 0;
  const Ti = useTherm(inner, p, tw), To = useTherm("#ffffff", p, tw), Tc = useTherm(insul ? "#e9c9a0" : "#8d867a", p, tw);
  const thin = s[2] < s[0] ? 2 : 0; // eje del espesor
  const core = s.map((v, i) => (i === thin ? v - 0.006 : v - 0.002)) as V3;
  return (
    <group position={p}>
      <mesh castShadow receiveShadow><boxGeometry args={core} /><meshStandardMaterial color={Tc.c} roughness={1} emissive={Tc.e ?? "#000"} emissiveIntensity={Tc.k * 0.85} /></mesh>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={thin === 2 ? [0, 0, (sd * s[2]) / 2] : [(sd * s[0]) / 2, 0, 0]} rotation={thin === 2 ? [0, sd < 0 ? Math.PI : 0, 0] : [0, (sd * Math.PI) / 2, 0]} receiveShadow>
          <planeGeometry args={[thin === 2 ? s[0] : s[2], s[1]]} /><meshStandardMaterial color={sd > 0 ? To.c : Ti.c} map={Ti.k > 0.5 ? undefined : tin} roughness={0.55} metalness={0.45 * (1 - Ti.k)} emissive={Ti.e ?? "#000"} emissiveIntensity={Ti.k * 0.6} side={THREE.FrontSide} />
        </mesh>
      ))}
    </group>
  );
};

// tambor de 55 galones: negro mate, aros, tapa con tapón; brilla en ámbar cuando está "cargado" (sólo en visión térmica)
const Drum: React.FC<{ x: number; heat: number; charge: number; i: number }> = ({ x, heat, charge, i }) => {
  const glow = ironCol(0.45 + charge * 0.45);
  return (
    <group position={[x, DRUM_Y0, DRUM_Z]}>
      <mesh position={[0, DRUM_H / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[DRUM_R, DRUM_R, DRUM_H, 40]} />
        <meshStandardMaterial color="#121314" roughness={0.88} metalness={0.25} emissive={glow} emissiveIntensity={heat * (0.3 + charge * 0.55)} /></mesh>
      {[0.3, 0.6].map((h) => <mesh key={h} position={[0, DRUM_H * h, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[DRUM_R + 0.008, 0.012, 8, 40]} /><meshStandardMaterial color="#1c1d1f" roughness={0.6} metalness={0.4} emissive={glow} emissiveIntensity={heat * charge * 0.45} /></mesh>)}
      <mesh position={[0, DRUM_H + 0.003, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[DRUM_R - 0.01, 0.014, 8, 40]} /><meshStandardMaterial color="#1a1b1d" roughness={0.6} metalness={0.4} /></mesh>
      <mesh position={[0.12, DRUM_H + 0.012, 0.05 + rnd(i, 3) * 0.04]}><cylinderGeometry args={[0.035, 0.035, 0.02, 16]} /><meshStandardMaterial color="#2a2b2d" metalness={0.6} roughness={0.4} /></mesh>
    </group>
  );
};

// nube de temperatura: puntos suaves (textura redonda, nunca cuadrados) con color térmico y aditivo
const HeatCloud: React.FC<{ fx: FX; map?: Tx; t: number; cam: THREE.Vector3 }> = ({ fx, map, t, cam }) => {
  const N = 6000;
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const nDrums = Math.round(fx.drums);
  for (let i = 0; i < N; i++) {
    const nb = i < 2000; // los primeros 2000 en el garaje del vecino
    const x0 = nb ? NX0 + 0.3 : SX0 + 0.3, x1 = nb ? NX1 - 0.3 : SX1 - 0.3;
    const x = x0 + rnd(i, 1) * (x1 - x0), z = SZ0 + 0.25 + rnd(i, 2) * (SZ1 - SZ0 - 0.5);
    let y = 0.15 + rnd(i, 3) * (SH - 0.4);
    // deriva suave: el aire caliente sube y rueda hacia el cuarto
    const drift = Math.sin(t * 0.7 + i) * 0.04;
    y += drift;
    let f = nb ? fx.nbTemp : fx.shopTemp;
    if (!nb) {
      let add = 0;
      for (let d = 0; d < nDrums; d++) { const dx = x - DRUM_X[d], dz = (z - DRUM_Z) * 0.8, dy = Math.max(0, DRUM_Y0 + DRUM_H * 0.5 - y) * 1.6; add += 1 / (1 + 3.2 * (dx * dx + dz * dz + dy * dy)); }
      f += add * fx.charge * 34 - (1 - y / SH) * 3;                 // cerca de los tambores, más caliente; el aire frío baja
      if (fx.flame > 0.01) { const dx = x - 6.2, dz = z + 0.2, dy = y - 1.2; f += fx.flame * 30 / (1 + 6 * (dx * dx + dz * dz + dy * dy)); }
      const gw = 1 - cl((WIN_C[2] + 0.6 - z) * -1) ; void gw;
      if (fx.blanket < 0.5 && fx.day < 0.3) { const dz = z - SZ0; f -= (1 - fx.blanket * 2) * 14 / (1 + 4 * dz * dz) * (1 - fx.day); } // vidrio sin frazada de noche: chupa calor
    } else f += (y / SH) * 2 - 1;
    const c = ironCol(tU(f));
    // cerca de la cámara se apaga (nada de manchones gigantes delante del lente)
    const dc = Math.hypot(x - cam.x, y - cam.y, z - cam.z), fade = cl((dc - 0.9) / 1.6);
    pos.set([x, y, z], i * 3); col.set([c.r * fade, c.g * fade, c.b * fade], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  if (fx.heat < 0.01) return null;
  return <points geometry={geo}><pointsMaterial vertexColors size={0.2} map={map} alphaTest={0.01} sizeAttenuation transparent opacity={0.22 * fx.heat} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></points>;
};

// piso pintado por la temperatura (canvas 128x96 recalculado por cuadro)
const HeatFloor: React.FC<{ fx: FX; nb?: boolean }> = ({ fx, nb }) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 128; cv.height = 96; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!; const img = g.createImageData(128, 96);
  const x0 = nb ? NX0 : SX0, x1 = nb ? NX1 : SX1;
  for (let j = 0; j < 96; j++) for (let i = 0; i < 128; i++) {
    const x = x0 + ((i + 0.5) / 128) * (x1 - x0), z = SZ0 + ((j + 0.5) / 96) * (SZ1 - SZ0);
    let f = nb ? fx.nbTemp - 2 : fx.shopTemp - 4;
    if (!nb) { for (let d = 0; d < Math.round(fx.drums); d++) { const dx = x - DRUM_X[d], dz = z - DRUM_Z; f += fx.charge * 30 / (1 + 2.6 * (dx * dx + dz * dz)); }
      if (fx.day > 0.2 && fx.blanket < 0.5) { // mancha de sol que entra por la ventana sur
        const sx = (x - WIN_C[0]) / (WIN_W * 0.62), sz = (z - (SZ0 + 1.6)) / 1.5; f += fx.day * (1 - fx.storm) * 18 * Math.exp(-(sx * sx + sz * sz) * 2.2); }
      if (fx.flame > 0.01) { const dx = x - 6.2, dz = z + 0.2; f += fx.flame * 14 / (1 + 5 * (dx * dx + dz * dz)); } }
    const c = ironCol(tU(f)), k = (j * 128 + i) * 4;
    img.data[k] = c.r * 255; img.data[k + 1] = c.g * 255; img.data[k + 2] = c.b * 255; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0); tex.needsUpdate = true;
  if (fx.heat < 0.01) return null;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(x0 + x1) / 2, 0.235, 0]}><planeGeometry args={[x1 - x0 - 0.2, SZ1 - SZ0 - 0.1]} /><meshBasicMaterial map={tex} transparent opacity={0.82 * fx.heat} toneMapped={false} depthWrite={false} /></mesh>;
};

// ondas de calor que suben de los tambores (puntos suaves ámbar) y ruedan hacia el cuarto por arriba
const Rise: React.FC<{ t: number; o: number; map?: Tx; drums: number }> = ({ t, o, map, drums }) => {
  const N = 520; const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const d = i % Math.max(1, Math.round(drums)), ph = (rnd(i, 1) + t * (0.16 + rnd(i, 2) * 0.1)) % 1;
    // sube por detrás del tambor (hueco de 2") y al llegar arriba rueda hacia +z
    const up = Math.min(1, ph * 1.6), roll = Math.max(0, ph * 1.6 - 1) / 0.6;
    const x = DRUM_X[d] + (rnd(i, 3) - 0.5) * 0.5 + Math.sin(t * 2 + i) * 0.03;
    const y = DRUM_Y0 + 0.1 + up * (SH - 0.9) + Math.sin(roll * 3) * 0.1;
    const z = DRUM_Z - 0.24 + (rnd(i, 4) - 0.5) * 0.1 + roll * 4.6;
    const c = ironCol(0.78 - roll * 0.25);
    pos.set([x, y, z], i * 3); col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  if (o < 0.01) return null;
  return <points geometry={geo}><pointsMaterial vertexColors size={0.16} map={map} alphaTest={0.01} sizeAttenuation transparent opacity={0.7 * o} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></points>;
};

// rayo de sol que entra por la ventana sur (cono aditivo con polvo)
const SunBeam: React.FC<{ o: number }> = ({ o }) => o < 0.01 ? null : (
  <group position={[WIN_C[0], WIN_C[1] - 0.2, WIN_C[2] + 0.9]} rotation={[-1.15, 0, 0]}>
    <mesh><boxGeometry args={[WIN_W * 0.95, 2.2, WIN_H * 0.7]} /><meshBasicMaterial color="#ffd89a" transparent opacity={o * 0.075} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
  </group>
);

const Snow: React.FC<{ t: number; n?: number; map?: Tx; rate?: number }> = ({ t, n = 2400, map, rate = 1 }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []); const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = -24 + rnd(i, 1) * 44 + Math.sin(t * 0.6 + i) * 0.25, Y = 18;
    const y = Y - ((rnd(i, 2) * Y + t * (0.6 + rnd(i, 3) * 0.5) * rate) % Y) - 1;
    let z = -16 + rnd(i, 4) * 34; if (z > SZ0 - 0.2 && z < SZ1 + 0.2 && ((x > SX0 - 0.2 && x < SX1 + 0.2) || (x > NX0 - 0.2 && x < NX1 + 0.2)) && y < SH + 1.2) z += 7; // nada de nieve dentro
    p.set([x, y, z], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color="#f4f8ff" size={0.09} map={map} alphaTest={0.02} sizeAttenuation transparent opacity={0.85} depthWrite={false} /></points>;
};

const Pine: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.15, 0.2, 1, 8]} /><meshStandardMaterial color="#3b2b20" /></mesh>
    {[0, 1, 2].map((k) => (
      <group key={k}>
        <mesh position={[0, 1.6 + k * 1.1, 0]} castShadow><coneGeometry args={[1.5 - k * 0.38, 1.9, 9]} /><meshStandardMaterial color="#1f3a2c" roughness={0.95} flatShading /></mesh>
        <mesh position={[0, 1.75 + k * 1.1, 0]}><coneGeometry args={[1.38 - k * 0.38, 1.5, 9]} /><meshStandardMaterial color="#eef3f8" roughness={1} transparent opacity={0.55} flatShading /></mesh>
      </group>
    ))}
  </group>
);

// dial del termómetro (CanvasTexture que muestra la aguja en °F)
const useDial = (f: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#f3efe4"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
  g.strokeStyle = "#222"; g.lineWidth = 3; for (let v = -40; v <= 120; v += 10) { const a = (-225 + ((v + 40) / 160) * 270) * Math.PI / 180; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke(); }
  g.fillStyle = "#c22"; const a0 = (-225 + ((32 + 40) / 160) * 270) * Math.PI / 180; g.beginPath(); g.arc(128, 128, 108, a0 - 0.04, a0 + 0.04); g.lineTo(128, 128); g.fill();
  const a = (-225 + ((f + 40) / 160) * 270) * Math.PI / 180;
  g.strokeStyle = "#111"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); g.stroke();
  g.fillStyle = "#111"; g.beginPath(); g.arc(128, 128, 10, 0, 6.3); g.fill();
  tex.needsUpdate = true; return tex;
};

// pantallita del termómetro pegado al tambor (lee la temperatura del taller)
const useLcd = (f: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 136; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#9fb08a"; g.fillRect(0, 0, 256, 136); g.fillStyle = "#1d2416"; g.font = "bold 92px monospace"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(`${Math.round(f)}°F`, 128, 72); tex.needsUpdate = true; return tex;
};

// ---------------- LA ESCENA ----------------
export const ShopWorld: React.FC<{ t: number; KF: Key[]; fx: (t: number) => Partial<FX> }> = ({ t, KF, fx: fxf }) => {
  const fx: FX = { ...FX0, ...fxf(t) };
  const tx = useTextures(), st = useShopTex();
  const day = fx.day * (1 - fx.storm * 0.55);
  const skyN = new THREE.Color("#0a1222"), skyD = new THREE.Color("#a9c4e6"), skyS = new THREE.Color("#9aa3ad");
  const sky = skyN.clone().lerp(fx.storm > 0.5 ? skyS : skyD, fx.day);
  const sun = day * (1 - fx.storm) * 3.2, moon = 0.5 * (1 - fx.day);
  const dial = useDial(fx.shopTemp);
  const lcd = useLcd(fx.shopTemp);
  const th = fx.heat; // visión térmica: oscurece el mundo "visible" para que se lea el color
  const dim = 1 - th * 0.55;
  const k = camAt(t, KF);
  const blanketDrop = fx.blanket;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <ThermCtx.Provider value={{ th, fx }}>
      <Cam t={t} KF={KF} />
      <Post bloom={(0.25 + 0.6 * (1 - fx.day)) * (1 - th * 0.75) + th * 0.12} threshold={0.8 + 0.9 * fx.day + th * 0.6} exposure={(0.85 + 0.35 * (1 - fx.day)) * dim + th * 0.25} env={(0.12 + 0.15 * fx.day) * dim} />
      <color attach="background" args={[sky.clone().multiplyScalar(dim).getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.016 + 0.02 * fx.storm]} />
      <hemisphereLight args={[new THREE.Color("#7f98c4").lerp(new THREE.Color("#e6ecf2"), fx.day).getHex(), new THREE.Color("#1a1d24").lerp(new THREE.Color("#8a8f96"), fx.day).getHex(), (0.5 + fx.day * 0.8) * dim]} />
      {/* sol BAJO de enero desde el sur (−z): entra casi horizontal por la ventana y llega hasta los tambores */}
      <directionalLight position={[3, 5.2, -18]} intensity={sun * dim + moon * 0.4} color={new THREE.Color("#a9c3ff").lerp(new THREE.Color("#ffe2b0"), fx.day)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={12} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <directionalLight position={[-8, 14, 16]} intensity={(0.35 + 0.4 * fx.day) * dim} color="#c9d6ea" />
      <pointLight position={[3, 2.6, 2.2]} intensity={(5 * (1 - fx.day) + 1.5) * dim} distance={12} color="#9fb6dc" />
      <pointLight position={[-7.5, 2.4, 2.2]} intensity={(4 * (1 - fx.day) + 1) * dim} distance={10} color="#8fb0e8" />

      {/* terreno nevado + corte de tierra bajo las losas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[160, 160]} /><meshStandardMaterial color={new THREE.Color("#e9eef4").lerp(ironCol(tU(fx.out)), th).getHex()} roughness={1} /></mesh>
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-20 + i * 2.6 + rnd(i, 2), 0.12, 4.6 + rnd(i, 3) * 1.2]} scale={[1.4, 0.32, 0.7]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color={new THREE.Color("#f2f5f9").lerp(ironCol(tU(fx.out)), th).getHex()} roughness={1} /></mesh>)}

      {/* ======= TALLER DE DUANE ======= */}
      <Box p={[(SX0 + SX1) / 2, 0.05, 0]} s={[SX1 - SX0, 0.2, SZ1 - SZ0]} c="#8e9093" map={tx.concrete} r={0.9} rad={0.01} />
      {/* pared sur (fondo) con el hueco de la ventana */}
      {(() => { const wl = WIN_C[0] - WIN_W / 2, wr = WIN_C[0] + WIN_W / 2, wb = WIN_C[1] - WIN_H / 2, wt = WIN_C[1] + WIN_H / 2; return (<>
        <TinWall p={[(SX0 + wl) / 2, SH / 2, SZ0]} s={[wl - SX0, SH, 0.14]} tin={st.tin} insul />
        <TinWall p={[(wr + SX1) / 2, SH / 2, SZ0]} s={[SX1 - wr, SH, 0.14]} tin={st.tin} insul />
        <TinWall p={[WIN_C[0], wb / 2, SZ0]} s={[WIN_W, wb, 0.14]} tin={st.tin} insul />
        <TinWall p={[WIN_C[0], (wt + SH) / 2, SZ0]} s={[WIN_W, SH - wt, 0.14]} tin={st.tin} insul />
        {/* vidrio + marco */}
        <mesh position={[WIN_C[0], WIN_C[1], SZ0]}><planeGeometry args={[WIN_W, WIN_H]} /><meshBasicMaterial color={new THREE.Color("#6f93c9").lerp(new THREE.Color("#fff1d0"), day * (1 - fx.storm)).lerp(new THREE.Color("#c7ccd2"), fx.storm * fx.day)} transparent opacity={(0.3 + fx.day * 0.6) * dim} toneMapped={false} /></mesh>
        {[[0, WIN_H / 2, WIN_W + 0.1, 0.08], [0, -WIN_H / 2, WIN_W + 0.1, 0.08], [-WIN_W / 2, 0, 0.08, WIN_H], [WIN_W / 2, 0, 0.08, WIN_H], [0, 0, 0.05, WIN_H], [-WIN_W / 4, 0, 0.04, WIN_H], [WIN_W / 4, 0, 0.04, WIN_H]].map(([x, y, a, b], i) => (
          <mesh key={i} position={[WIN_C[0] + x, WIN_C[1] + y, SZ0 + 0.075]}><boxGeometry args={[a, b, 0.05]} /><meshStandardMaterial color="#e8e2d6" roughness={0.7} /></mesh>))}
        {/* palo de escoba en dos ganchos + frazada azul acolchada que baja */}
        <mesh position={[WIN_C[0], wt + 0.14, SZ0 + 0.16]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.018, 0.018, WIN_W + 0.5, 10]} /><meshStandardMaterial color="#b88a52" roughness={0.6} /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[WIN_C[0] + sd * (WIN_W / 2 + 0.15), wt + 0.1, SZ0 + 0.1]}><boxGeometry args={[0.04, 0.12, 0.12]} /><meshStandardMaterial color="#555" metalness={0.7} /></mesh>)}
        {blanketDrop > 0.01 && <mesh position={[WIN_C[0], wt + 0.14 - (WIN_H + 0.3) * blanketDrop / 2, SZ0 + 0.18]} castShadow>
          <planeGeometry args={[WIN_W + 0.4, (WIN_H + 0.3) * blanketDrop, 12, 8]} /><meshStandardMaterial color="#2d4f86" roughness={1} side={THREE.DoubleSide} /></mesh>}
        {blanketDrop < 0.99 && <mesh position={[WIN_C[0], wt + 0.1, SZ0 + 0.18]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.09, 0.09, WIN_W + 0.4, 16]} /><meshStandardMaterial color="#2d4f86" roughness={1} /></mesh>}
      </>); })()}
      <TinWall p={[SX0, SH / 2, 0]} s={[0.14, SH, SZ1 - SZ0]} tin={st.tin} insul />
      <TinWall p={[SX1, SH / 2, -0.5]} s={[0.14, SH, SZ1 - SZ0 - 1.0]} tin={st.tin} insul />
      {/* puerta lateral (pared este, al frente): se entreabre 2" */}
      <group position={[SX1, 0.1, SZ1 - 1.0]} rotation={[0, -fx.door * 0.12, 0]}>
        <Box p={[0, 1.05, 0.48]} s={[0.06, 2.1, 0.94]} c="#6b6f73" m={0.4} r={0.5} />
        <mesh position={[-0.05, 1.05, 0.85]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#c9a14a" metalness={1} roughness={0.25} /></mesh>
      </group>
      <TinWall p={[SX1, 2.65, SZ1 - 0.5]} s={[0.14, 1.5, 1.0]} tin={st.tin} insul />
      {/* cerchas del techo cortado (se ve el armazón) + techo de chapa con nieve atrás */}
      {[SX0 + 0.1, 1.2, 3.4, 5.6, SX1 - 0.1].map((x, i) => (
        <group key={i} position={[x, SH, 0]}>
          {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.45, sd * 1.5]} rotation={[sd * 0.3, 0, 0]} castShadow><boxGeometry args={[0.08, 0.12, 3.15]} /><meshStandardMaterial color="#6d5a44" roughness={0.9} /></mesh>)}
          <mesh position={[0, 0.02, 0]} castShadow><boxGeometry args={[0.08, 0.1, SZ1 - SZ0]} /><meshStandardMaterial color="#6d5a44" roughness={0.9} /></mesh>
        </group>
      ))}
      <group position={[(SX0 + SX1) / 2, SH + 0.47, SZ0 + 1.5]} rotation={[0.3, 0, 0]}>
        <Box p={[0, 0, 0]} s={[SX1 - SX0 + 0.4, 0.06, 3.2]} c="#7d8186" m={0.5} r={0.5} map={st.tin} />
        <Box p={[0, 0.07, 0]} s={[SX1 - SX0 + 0.4, 0.1, 3.2]} c="#f1f5f9" r={1} />
      </group>

      {/* tambores sobre pallet sobre espuma rosa de 2" */}
      <Box p={[2.06, 0.125, DRUM_Z]} s={[2.9, 0.05, 0.85]} c="#e98fa6" r={0.95} rad={0.008} />
      <Box p={[2.06, 0.22, DRUM_Z]} s={[2.8, 0.14, 0.8]} c="#c8a26b" map={st.pallet} r={0.9} rad={0.01} />
      {DRUM_X.slice(0, Math.round(fx.drums)).map((x, i) => <Drum key={i} x={x} heat={th} charge={fx.charge} i={i} />)}
      {/* termómetro con sonda pegado al 1er tambor */}
      <Box p={[DRUM_X[0] + 0.2, DRUM_Y0 + 0.6, DRUM_Z + 0.24]} s={[0.1, 0.06, 0.02]} c="#e9e9e4" r={0.5} rot={[0, 0.6, 0]} />
      <mesh position={[DRUM_X[0] + 0.207, DRUM_Y0 + 0.6, DRUM_Z + 0.252]} rotation={[0, 0.6, 0]}><planeGeometry args={[0.085, 0.045]} /><meshBasicMaterial map={lcd} toneMapped={false} /></mesh>
      <SunBeam o={day * (1 - fx.storm) * (1 - blanketDrop) * dim} />

      {/* banco de soldador a lo largo de la pared este + morsa + casco + caja de ladrillos refractarios con el quemador */}
      <Box p={[6.35, 0.95, -0.6]} s={[0.9, 0.08, 3.2]} c="#4b4f55" m={0.6} r={0.45} />
      {[[-2.1], [0.9]].map(([dz], i) => <Box key={i} p={[6.35, 0.5, -0.6 + dz + 0.7]} s={[0.8, 0.85, 0.06]} c="#3a3d42" m={0.5} />)}
      <Box p={[6.2, 1.1, -1.8]} s={[0.22, 0.2, 0.3]} c="#3b5d8a" m={0.5} r={0.4} />
      <mesh position={[6.45, 1.13, 1.25]} castShadow><sphereGeometry args={[0.16, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial color="#1b1c1e" roughness={0.35} metalness={0.4} /></mesh>
      <group position={[6.2, 0.99, -0.25]}>
        {/* caja de chapa soldada, abierta al frente (−x) */}
        {([[[0.23, 0.17, 0], [0.04, 0.34, 0.42]], [[0, 0.33, 0], [0.5, 0.03, 0.42]], [[0, 0.015, 0], [0.5, 0.03, 0.42]], [[0, 0.17, -0.2], [0.5, 0.34, 0.03]], [[0, 0.17, 0.2], [0.5, 0.34, 0.03]]] as [V3, V3][]).map(([pp, ss], i) =>
          <Box key={"c" + i} p={pp} s={ss} c="#3e3f41" m={0.6} r={0.45} rad={0.008} tw={fx.shopTemp + fx.brick * 22 + fx.flame * 8} />)}
        {[[-0.15, 0.1], [0.15, 0.1], [-0.15, 0.22], [0.15, 0.22]].map(([dz, y], i) => <Box key={i} p={[0.02, y, dz]} s={[0.36, 0.1, 0.07]} c="#d8b56d" r={0.95} rad={0.01} tw={fx.shopTemp + fx.brick * 40 + fx.flame * 12} />)}
        <mesh position={[-0.05, 0.08, 0]}><cylinderGeometry args={[0.06, 0.07, 0.06, 20]} /><meshStandardMaterial color="#a8acb2" metalness={0.8} roughness={0.3} /></mesh>
        {fx.flame > 0.01 && <>
          <mesh position={[-0.05, 0.15 + Math.sin(t * 13) * 0.004, 0]}><coneGeometry args={[0.045, 0.14 + Math.sin(t * 9) * 0.015, 14]} /><meshBasicMaterial color="#5fa8ff" transparent opacity={0.75 * fx.flame} toneMapped={false} /></mesh>
          <pointLight position={[-0.3, 0.3, 0]} intensity={fx.flame * 1.1} distance={2.4} color="#ffb06a" />
        </>}
      </group>
      {/* dial del termómetro + alarma de CO en la pared, al lado del banco */}
      <group position={[SX1 - 0.08, 1.75, -0.9]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 40]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[0, 0, 0.022]} rotation={[0, 0, 0]}><circleGeometry args={[0.18, 40]} /><meshBasicMaterial map={dial} toneMapped={false} /></mesh>
      </group>
      <group position={[SX1 - 0.08, 1.75, -0.15]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.04, 32]} /><meshStandardMaterial color="#f3f3f0" roughness={0.5} /></mesh>
        <mesh position={[0.04, 0, 0.023]}><circleGeometry args={[0.012, 12]} /><meshBasicMaterial color={fx.alarm > 0.5 ? "#ff2a1a" : "#2a7a2a"} toneMapped={false} /></mesh>
        {fx.alarm > 0.05 && <pointLight position={[0, 0, 0.2]} intensity={fx.alarm * 0.35} distance={0.8} color="#ff3a2a" />}
      </group>
      {/* la maceta de las velas (prueba) */}
      {fx.pot > 0.01 && <group position={[6.25, 0.99, 0.15]}>
        <Box p={[0, 0.015, 0]} s={[0.26, 0.03, 0.16]} c="#9ba0a6" m={0.7} r={0.35} tw={fx.shopTemp + 25} />
        <mesh position={[0, 0.14, 0]} castShadow><cylinderGeometry args={[0.065, 0.11, 0.2, 24]} /><meshStandardMaterial color={new THREE.Color("#b4613b").lerp(ironCol(tU(fx.shopTemp + 50)), th).getHex()} emissive={ironCol(tU(fx.shopTemp + 50)).getHex()} emissiveIntensity={th * 0.9} roughness={0.9} /></mesh>
        <pointLight position={[0, 0.06, 0]} intensity={0.3 * fx.pot} distance={0.8} color="#ffb060" />
      </group>}
      {/* latas de nafta y trapos lejos del banco (en el gabinete del rincón opuesto) */}
      <Box p={[SX0 + 0.45, 0.6, SZ1 - 0.6]} s={[0.7, 1.0, 0.5]} c="#7a1f1a" m={0.4} r={0.5} />
      {/* soldadora + carro, estante con tubos, mesa de soldar en el medio */}
      <Box p={[4.6, 0.55, -2.3]} s={[0.55, 0.9, 0.45]} c="#2e5aa0" m={0.3} r={0.5} />
      <Box p={[4.3, 0.85, 0.6]} s={[1.4, 0.06, 0.9]} c="#55595e" m={0.7} r={0.4} />
      {[[-0.6, -0.4], [0.6, -0.4], [-0.6, 0.4], [0.6, 0.4]].map(([dx, dz], i) => <Box key={i} p={[4.3 + dx, 0.45, 0.6 + dz]} s={[0.06, 0.8, 0.06]} c="#3a3d42" m={0.5} />)}
      {/* aire caliente que sube detrás de los tambores y rueda al cuarto */}
      <Rise t={t} o={fx.flow} map={tx.flake} drums={fx.drums} />
      <HeatFloor fx={fx} />
      <HeatCloud fx={fx} map={tx.flake} t={t} cam={k.p} />

      {/* ======= GARAJE DEL VECINO (helado) ======= */}
      <Box p={[(NX0 + NX1) / 2, 0.05, 0]} s={[NX1 - NX0, 0.2, SZ1 - SZ0]} c="#8a8f96" map={tx.concrete} r={0.9} rad={0.01} />
      <TinWall p={[(NX0 + NX1) / 2, SH / 2, SZ0]} s={[NX1 - NX0, SH, 0.2]} inner="#c9c6be" />
      <TinWall p={[NX0, SH / 2, 0]} s={[0.2, SH, SZ1 - SZ0]} inner="#c9c6be" />
      <TinWall p={[NX1, SH / 2, 0]} s={[0.2, SH, SZ1 - SZ0]} inner="#c9c6be" />
      <Box p={[(NX0 + NX1) / 2, SH + 0.1, 0]} s={[NX1 - NX0 + 0.4, 0.2, SZ1 - SZ0 + 0.3]} c="#30333a" />
      <Box p={[(NX0 + NX1) / 2, SH + 0.25, 0]} s={[NX1 - NX0 + 0.4, 0.12, SZ1 - SZ0 + 0.3]} c="#f1f5f9" r={1} />
      {/* ventanita escarchada */}
      <mesh position={[-7.5, 1.9, SZ0 + 0.11]}><planeGeometry args={[1.2, 0.8]} /><meshBasicMaterial color="#9fb4d4" transparent opacity={0.6 * dim} toneMapped={false} /></mesh>
      <mesh position={[-7.5, 1.9, SZ0 + 0.12]}><planeGeometry args={[1.2, 0.8]} /><meshBasicMaterial map={st.frost} transparent opacity={fx.frost} toneMapped={false} depthWrite={false} /></mesh>
      {/* banco con taladro, estantes, manguera dura, bowl del perro con el disco de hielo */}
      <Box p={[-10.7, 0.95, -1.0]} s={[0.9, 0.08, 2.6]} c="#7a5e45" r={0.9} />
      <Box p={[-10.7, 0.5, -1.0]} s={[0.8, 0.85, 2.4]} c="#5e4834" r={0.95} o={0.95} />
      <group position={[-10.6, 1.0, -0.6]} rotation={[0, 0.6, 0]}>
        {/* taladro acostado: cuerpo, mandril, empuñadura y batería */}
        <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.06, 0.24, 20]} /><meshStandardMaterial color="#d9a514" roughness={0.45} /></mesh>
        <mesh position={[0.15, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.03, 0.04, 0.07, 16]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.35} /></mesh>
        <mesh position={[0.22, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.09, 8]} /><meshStandardMaterial color="#c9ccd0" metalness={1} roughness={0.2} /></mesh>
        <Box p={[-0.04, 0.07, 0.11]} s={[0.07, 0.07, 0.16]} c="#262626" r={0.6} rot={[0, 0, 0]} tw={-5} />
        <Box p={[-0.04, 0.06, 0.22]} s={[0.12, 0.09, 0.1]} c="#1c1c1c" r={0.6} tw={-5} />
        {/* escarcha sobre el banco */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.8]} /><meshBasicMaterial map={st.rime} transparent opacity={0.7 * fx.frost} depthWrite={false} toneMapped={false} /></mesh>
      </group>
      <group position={[-6.4, 0.15, 1.2]}>
        <mesh position={[0, 0.055, 0]} castShadow receiveShadow><cylinderGeometry args={[0.2, 0.15, 0.11, 40, 1, true]} /><meshStandardMaterial color="#b9bec4" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.012, 10, 40]} /><meshStandardMaterial color="#d6dade" metalness={0.9} roughness={0.25} /></mesh>
        <mesh position={[0, 0.088, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.188, 40]} /><meshStandardMaterial map={st.ice} color="#ffffff" roughness={0.12} metalness={0.05} emissive="#2a5a88" emissiveIntensity={0.25 * fx.frost} /></mesh>
        {/* escarcha alrededor del bowl */}
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.6, 40]} /><meshBasicMaterial map={st.rime} transparent opacity={0.8 * fx.frost} depthWrite={false} toneMapped={false} /></mesh>
        {/* cama del perro vacía + bolsa de alimento */}
        <mesh position={[0.75, 0.07, -0.25]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]} castShadow><torusGeometry args={[0.38, 0.11, 14, 36]} /><meshStandardMaterial color="#6e4b3a" roughness={1} /></mesh>
        <mesh position={[0.75, 0.03, -0.25]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]}><circleGeometry args={[0.36, 30]} /><meshStandardMaterial color="#8a6a52" roughness={1} /></mesh>
        <Box p={[-0.55, 0.28, -0.55]} s={[0.36, 0.56, 0.16]} c="#b7472f" r={0.8} rot={[0, 0.4, 0.06]} tw={-5} />
      </group>
      <mesh position={[-11.25, 1.6, 0.6]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[0.35, 0.035, 10, 32]} /><meshStandardMaterial color="#2f6b3a" roughness={0.7} /></mesh>
      {[0.6, 1.3, 2.0].map((y) => <Box key={y} p={[-8.0, y, SZ0 + 0.4]} s={[2.0, 0.04, 0.5]} c="#8c9198" m={0.5} r={0.4} />)}
      {[[-8.6, 0.78], [-7.9, 0.78], [-7.4, 1.48], [-8.3, 2.18]].map(([x, y], i) => <Box key={i} p={[x, y, SZ0 + 0.4]} s={[0.4, 0.32, 0.36]} c={["#a68a62", "#6d7c8c", "#8b4e3c", "#b9a77e"][i]} r={0.9} />)}
      <HeatFloor fx={fx} nb />

      {[[-14, 0, -6], [10, 0, -7], [-2, 0, -8], [13, 0, 2], [-15, 0, 3], [6, 0, -9.5]].map((p, i) => <Pine key={i} p={p as V3} s={1 + rnd(i, 9) * 0.5} />)}
      <Snow t={t} map={tx.flake} rate={1 + fx.storm * 2.5} n={fx.storm > 0.3 ? 4200 : 2400} />
      {void k}
      </ThermCtx.Provider>
    </ThreeCanvas>
  );
};

// marcadores 3D (para portales y rótulos HTML)
export const PT = {
  bowl: [-6.4, 0.25, 1.2] as V3,
  nbWin: [-7.5, 1.9, -2.9] as V3,
  drill: [-10.6, 1.05, -0.6] as V3,
  dial: [SX1 - 0.1, 1.75, -0.9] as V3,
  co: [SX1 - 0.1, 1.75, -0.15] as V3,
  burner: [6.15, 1.2, -0.25] as V3,
  pot: [6.25, 1.15, 0.15] as V3,
  window: [WIN_C[0], WIN_C[1], WIN_C[2]] as V3,
  drums: [2.05, DRUM_Y0 + DRUM_H * 0.6, DRUM_Z] as V3,
  drum0: [DRUM_X[0], DRUM_Y0 + DRUM_H * 0.6, DRUM_Z + 0.3] as V3,
  drumTop: [DRUM_X[3], DRUM_Y0 + DRUM_H, DRUM_Z] as V3,
  gap: [DRUM_X[3] + 0.2, DRUM_Y0 + 0.5, DRUM_Z - 0.32] as V3,
  foam: [3.55, 0.13, DRUM_Z + 0.4] as V3,
  pallet: [3.4, 0.22, DRUM_Z + 0.4] as V3,
  blanket: [WIN_C[0], WIN_C[1] + 0.5, SZ0 + 0.2] as V3,
  door: [SX1, 1.1, SZ1 - 0.55] as V3,
  cans: [SX0 + 0.45, 1.0, SZ1 - 0.6] as V3,
  shop: [3, 1.5, 0] as V3,
  nb: [-7.5, 1.5, 0] as V3,
};
