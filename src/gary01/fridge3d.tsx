// gary01 · LA HELADERA EN CORTE (three.js): "It's about cold and where cold goes when nobody's watching it".
// Una heladera real cortada al costado (se ve la espuma aislante en el espesor de las paredes), el enchufe que se
// desconecta con chispa en "electricity", el aire frío (partículas azules) que se acumula abajo y se DERRAMA por la
// junta de la puerta, y el calor (partículas ámbar) que empuja desde afuera por paredes, techo y junta.
// Cámara: del enchufe → 3/4 → órbita al corte → frente; la puerta se abre hacia cámara al final (rima con la puerta-avatar).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FPS, W, H, win } from "./house3d";
import { Post } from "./fx3d";

const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

export type K = { t: number; p: number[]; l: number[]; fov: number };
const KF0: K[] = [
  { t: 55.9, p: [1.02, 0.5, -0.28], l: [0.95, 0.47, -0.6], fov: 30 },
  { t: 56.4, p: [1.1, 0.55, 0.15], l: [0.9, 0.5, -0.6], fov: 32 },
  { t: 57.6, p: [-2.1, 1.55, 3.0], l: [0.05, 0.95, 0], fov: 36 },
  { t: 59.4, p: [-2.6, 1.45, 2.4], l: [0, 0.95, 0], fov: 36 },
  { t: 62.6, p: [-3.3, 1.25, 0.4], l: [0, 0.9, 0], fov: 36 },
  { t: 64.6, p: [-1.6, 1.2, 2.9], l: [0, 0.95, 0], fov: 35 },
  { t: 65.6, p: [-0.15, 1.05, 2.7], l: [0, 1.0, 0], fov: 34 },
  { t: 66.5, p: [0.0, 1.0, 0.9], l: [0, 1.0, -1], fov: 40 },
];
export const fcamAt = (t: number, KF: K[] = KF0) => {
  let i = 0; while (i < KF.length - 1 && KF[i + 1].t <= t) i++;
  const a = KF[i], b = KF[Math.min(i + 1, KF.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  return { p: v3(a.p).lerp(v3(b.p), k), l: v3(a.l).lerp(v3(b.l), k), fov: a.fov + (b.fov - a.fov) * k };
};
export const fproject = (t: number, q: [number, number, number], kf?: K[]) => {
  const c = fcamAt(t, kf), cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 100); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
const Cam: React.FC<{ t: number; kf?: K[] }> = ({ t, kf }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = fcamAt(t, kf);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 100; c.updateProjectionMatrix(); return null;
};

// medidas de la heladera (metros): ancho 0.9, alto 1.8, fondo 0.75, pared 0.06; el costado IZQUIERDO está cortado
const FW = 0.9, FH = 1.8, FD = 0.75, T = 0.06, FZ = 0.12; // freezer arriba: 0.55 de alto
const Wall: React.FC<{ p: number[]; s: number[] }> = ({ p, s }) => (
  <group position={p as [number, number, number]}>
    <mesh castShadow receiveShadow><boxGeometry args={s as [number, number, number]} /><meshStandardMaterial color="#eef0f2" roughness={0.55} metalness={0.02} /></mesh>
  </group>
);
// pared cortada: piel blanca afuera, espuma amarilla en el espesor, plástico gris claro adentro
const CutWall: React.FC<{ p: number[]; s: number[]; axis: "x" | "y" | "z" }> = ({ p, s, axis }) => {
  const skin = 0.008;
  return (
    <group position={p as [number, number, number]}>
      {/* núcleo de espuma un pelo más finito que las pieles: si comparten plano hay z-fighting (rayas) */}
      <mesh castShadow receiveShadow><boxGeometry args={s.map((v, i) => (["x", "y", "z"][i] === axis ? v - 0.006 : v - 0.002)) as [number, number, number]} /><meshStandardMaterial color="#e6d48a" roughness={1} /></mesh>
      {/* piel exterior e interior (finitas) para que el canto muestre las 3 capas */}
      {axis === "y" && <>
        <mesh position={[0, s[1] / 2 - skin / 2, 0]}><boxGeometry args={[s[0] + 0.002, skin, s[2] + 0.002]} /><meshStandardMaterial color="#f3f4f6" roughness={0.3} /></mesh>
        <mesh position={[0, -s[1] / 2 + skin / 2, 0]}><boxGeometry args={[s[0] + 0.002, skin, s[2] + 0.002]} /><meshStandardMaterial color="#dfe6ec" roughness={0.5} /></mesh>
      </>}
      {axis === "z" && <>
        <mesh position={[0, 0, s[2] / 2 - skin / 2]}><boxGeometry args={[s[0] + 0.002, s[1] + 0.002, skin]} /><meshStandardMaterial color="#dfe6ec" roughness={0.5} /></mesh>
        <mesh position={[0, 0, -s[2] / 2 + skin / 2]}><boxGeometry args={[s[0] + 0.002, s[1] + 0.002, skin]} /><meshStandardMaterial color="#f3f4f6" roughness={0.3} /></mesh>
      </>}
      {axis === "x" && <>
        <mesh position={[-s[0] / 2 + skin / 2, 0, 0]}><boxGeometry args={[skin, s[1] + 0.002, s[2] + 0.002]} /><meshStandardMaterial color="#dfe6ec" roughness={0.5} /></mesh>
        <mesh position={[s[0] / 2 - skin / 2, 0, 0]}><boxGeometry args={[skin, s[1] + 0.002, s[2] + 0.002]} /><meshStandardMaterial color="#f3f4f6" roughness={0.3} /></mesh>
      </>}
    </group>
  );
};

// copo redondo con borde suave (los puntos cuadrados se veían píxel)
let dot: THREE.Texture | null = null;
const softDot = () => {
  if (dot) return dot;
  const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.75)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); dot = new THREE.CanvasTexture(cv); return dot;
};
const Particles: React.FC<{ pts: Float32Array; color: string; size: number; opacity: number }> = ({ pts, color, size, opacity }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  return <points geometry={geo}><pointsMaterial map={softDot()} alphaTest={0.01} color={color} size={size * 2.2} sizeAttenuation transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></points>;
};

// fx: niveles de efecto por cuadro (para reusar la heladera en otras frases con OTRA cámara `kf`)
export type FX = { unplug?: number; lightOn?: number; cold?: number; leak?: number; heat?: number; jugs?: number; door?: number; motor?: number; hot?: number; fall?: number };
export const FridgeCut: React.FC<{ t: number; kf?: K[]; fx?: FX; post?: boolean }> = ({ t, kf, fx, post = true }) => {
  const unplug = fx ? fx.unplug ?? 1 : win(t, 57.55, 57.85);    // "...nothing to do with electricity"
  const lightOn = fx ? fx.lightOn ?? 0 : 1 - win(t, 57.6, 57.75);
  const cold = fx ? fx.cold ?? 0 : win(t, 59.3, 60.1);          // "It's about cold"
  const leak = fx ? fx.leak ?? 0 : win(t, 60.9, 61.6);          // "...and where cold goes"
  const heat = fx ? fx.heat ?? 0 : win(t, 61.6, 62.6);          // "...when nobody's watching it"
  const jugs = fx ? fx.jugs ?? 0 : win(t, 63.4, 64.2);          // "let me show you exactly how I set it up" → las jarras brillan
  const door = fx ? fx.door ?? 0 : win(t, 65.55, 66.35);        // la puerta se abre hacia cámara
  const motor = fx?.motor ?? 0, hot = fx?.hot ?? 0, fall = fx?.fall ?? 0;
  const fl = Math.round(t * FPS);

  // aire frío: dentro del gabinete, más denso abajo (el frío cae)
  const nC = 900, cp = new Float32Array(nC * 3);
  for (let i = 0; i < nC; i++) {
    const inFreezer = rnd(i, 1) < 0.35;
    const y0 = inFreezer ? FH - 0.55 + rnd(i, 2) * 0.48 : 0.12 + Math.pow(rnd(i, 2), 1.8) * (FH - 0.75);
    const x = -FW / 2 + T + 0.03 + rnd(i, 3) * (FW - 2 * T - 0.06), z = -FD / 2 + T + 0.03 + rnd(i, 4) * (FD - 2 * T - 0.06);
    cp.set([x + Math.sin(fl * 0.02 + i) * 0.01, y0 + Math.sin(fl * 0.015 + i * 2) * 0.012, z], i * 3);
  }
  // derrame: sale por la junta de abajo de la puerta y cae al piso como agua, se abre en abanico
  const nL = 520, lp = new Float32Array(nL * 3);
  for (let i = 0; i < nL; i++) {
    const ph = ((fl * 0.012 + rnd(i, 5)) % 1);
    const x = -FW / 2 + 0.08 + rnd(i, 6) * (FW - 0.16);
    const out = ph * 0.9, fall = Math.min(0.28, ph * ph * 1.6);
    lp.set([x + (rnd(i, 7) - 0.5) * ph * 0.6, 0.3 - fall, FD / 2 + 0.02 + out], i * 3);
  }
  // calor: viene de afuera hacia las paredes y la junta (y se detiene en la piel)
  const nH = 700, hp = new Float32Array(nH * 3);
  for (let i = 0; i < nH; i++) {
    const ph = ((fl * 0.01 + rnd(i, 8)) % 1), side = Math.floor(rnd(i, 9) * 4);
    const dist = 0.65 * (1 - ph) + 0.02;
    let p: number[];
    if (side === 0) p = [-FW / 2 - dist, 0.2 + rnd(i, 10) * (FH - 0.3), -FD / 2 + rnd(i, 11) * FD];          // costado
    else if (side === 1) p = [-FW / 2 + rnd(i, 10) * FW, FH + dist, -FD / 2 + rnd(i, 11) * FD];               // techo (el aire caliente se junta arriba)
    else if (side === 2) p = [-FW / 2 + rnd(i, 10) * FW, 0.2 + rnd(i, 11) * (FH - 0.3), FD / 2 + dist + 0.05]; // frente / junta
    else p = [FW / 2 + dist, 0.2 + rnd(i, 10) * (FH - 0.3), -FD / 2 + rnd(i, 11) * FD];
    hp.set(p, i * 3);
  }
  // frío que CAE desde la jarra del estante de arriba sobre la comida
  const nF = 420, fp = new Float32Array(nF * 3);
  for (let i = 0; i < nF; i++) {
    const ph = ((fl * 0.009 + rnd(i, 15)) % 1), r = 0.05 + ph * 0.28, a = rnd(i, 16) * 6.283;
    fp.set([0.2 + Math.cos(a) * r * 0.9, 1.0 - ph * 0.85, 0.05 + Math.sin(a) * r * 0.6], i * 3);
  }
  // chispa del enchufe
  const nS = 60, sp = new Float32Array(nS * 3), sparkK = t > 57.55 && t < 58.1 ? (t - 57.55) / 0.55 : -1;
  for (let i = 0; i < nS; i++) { const a = rnd(i, 12) * 6.283, r = sparkK * (0.08 + rnd(i, 13) * 0.25); sp.set([0.95 + Math.cos(a) * r, 0.47 + Math.sin(a) * r * 0.8 - sparkK * sparkK * 0.15, -0.6 + 0.04 + rnd(i, 14) * r], i * 3); }

  const plugZ = -0.6 + 0.035 + unplug * 0.32, plugY = 0.47 - unplug * 0.08;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} kf={kf} />
      {post && <Post bloom={0.35} threshold={0.95} exposure={0.78} env={0.12} />}
      <color attach="background" args={["#0d1218"]} />
      <fog attach="fog" args={["#0d1218", 5, 13]} />
      <hemisphereLight args={["#9fb4d6", "#1a1c20", 0.55]} />
      <spotLight position={[-2.5, 3.6, 2.5]} angle={0.55} penumbra={0.7} intensity={60} distance={12} castShadow color="#f2f4ff" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[2.2, 1.6, 2.2]} intensity={6} distance={7} color="#ffb070" />
      {/* cocina: piso de madera, pared con enchufe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[12, 12]} /><meshStandardMaterial color="#5b4636" roughness={0.75} /></mesh>
      <mesh position={[0, 2, -0.62]} receiveShadow><planeGeometry args={[12, 4]} /><meshStandardMaterial color="#c9c2b4" roughness={0.95} /></mesh>
      <mesh position={[0.95, 0.47, -0.615]}><boxGeometry args={[0.08, 0.12, 0.01]} /><meshStandardMaterial color="#f4f2ee" /></mesh>
      {/* enchufe + cable */}
      <mesh position={[0.95, plugY, plugZ]}><boxGeometry args={[0.04, 0.05, 0.05]} /><meshStandardMaterial color="#f0f0f0" /></mesh>
      <mesh position={[0.72 + unplug * 0.1, 0.25 + plugY * 0.3, (plugZ - 0.42) / 2]} rotation={[0.3, 0.6, 0.9]}><cylinderGeometry args={[0.008, 0.008, 0.62, 6]} /><meshStandardMaterial color="#e8e8e8" /></mesh>
      {sparkK >= 0 && <><Particles pts={sp} color="#ffd27a" size={0.018} opacity={1 - sparkK} /><pointLight position={[0.95, 0.47, -0.5]} intensity={(1 - sparkK) * 3} distance={1.5} color="#ffcf7a" /></>}

      {/* LA HELADERA: centro en x=0, apoyada en y=0; frente en z=+FD/2 */}
      <group>
        <Wall p={[FW / 2 - T / 2, FH / 2, 0]} s={[T, FH, FD]} />
        <CutWall p={[0, FH - T / 2, 0]} s={[FW, T, FD]} axis="y" />
        <CutWall p={[0, T / 2 + 0.06, 0]} s={[FW, T, FD]} axis="y" />
        <CutWall p={[0, FH / 2, -FD / 2 + T / 2]} s={[FW, FH, T]} axis="z" />
        <CutWall p={[0, FH - 0.58, 0]} s={[FW - 2 * T, 0.05, FD - T]} axis="y" />
        {/* zócalo + rejilla */}
        <mesh position={[0, 0.03, FD / 2 - 0.04]}><boxGeometry args={[FW, 0.06, 0.05]} /><meshStandardMaterial color="#26292d" /></mesh>
        {/* estantes de vidrio */}
        {[0.42, 0.72, 0.98].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[FW - 2 * T, 0.012, FD - 2 * T]} /><meshStandardMaterial color="#cfe6f2" transparent opacity={0.35} roughness={0.05} /></mesh>)}
        {/* comida: leche, carne, sobras, huevos */}
        <mesh position={[-0.2, 0.86, 0.08]} castShadow><boxGeometry args={[0.15, 0.26, 0.15]} /><meshStandardMaterial color="#f7f7f5" roughness={0.4} /></mesh>
        <mesh position={[0.12, 0.48, -0.05]} castShadow><boxGeometry args={[0.3, 0.08, 0.2]} /><meshStandardMaterial color="#b44a46" roughness={0.6} /></mesh>
        <mesh position={[0.12, 0.535, -0.05]}><boxGeometry args={[0.31, 0.02, 0.21]} /><meshStandardMaterial color="#e9eef2" transparent opacity={0.5} /></mesh>
        <mesh position={[0.12, 0.78, 0.0]} castShadow><cylinderGeometry args={[0.09, 0.09, 0.1, 20]} /><meshStandardMaterial color="#d6dde2" transparent opacity={0.75} /></mesh>
        <mesh position={[-0.15, 1.03, -0.05]} castShadow><boxGeometry args={[0.25, 0.06, 0.18]} /><meshStandardMaterial color="#f0e6cf" /></mesh>
        {/* jarras de agua con sal en el freezer (brillan en "how I set it up") */}
        {[-0.24, -0.04, 0.16].map((x, i) => (
          <mesh key={i} position={[x, FH - 0.36, 0.02]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.28, 18]} />
            <meshStandardMaterial color="#cfe9ff" transparent opacity={0.8} roughness={0.15} emissive="#6fc3ff" emissiveIntensity={jugs * 1.4} /></mesh>
        ))}
        {/* compresor (abajo atrás) + serpentín: tiembla cuando "achica agua"; se pone al rojo si lo dejan tapado */}
        <group position={[0.18 + (motor > 0 ? Math.sin(fl * 2.1) * 0.003 * motor : 0), 0.13, -FD / 2 - 0.13]}>
          <mesh castShadow><capsuleGeometry args={[0.09, 0.08, 6, 16]} /><meshStandardMaterial color={new THREE.Color("#1d2024").lerp(new THREE.Color("#ff3a1a"), hot * 0.6)} metalness={0.6} roughness={0.35} emissive="#ff3a10" emissiveIntensity={hot * 1.6} /></mesh>
          {motor > 0.02 && <pointLight position={[0, 0.1, -0.1]} intensity={motor * 0.8 + hot * 3} distance={1.2} color={hot > 0.3 ? "#ff6a2a" : "#9fd0ff"} />}
        </group>
        {Array.from({ length: 9 }, (_, i) => <mesh key={"co" + i} position={[0, 0.35 + i * 0.13, -FD / 2 - 0.05]}><boxGeometry args={[FW - 0.18, 0.012, 0.012]} /><meshStandardMaterial color={new THREE.Color("#2a2d31").lerp(new THREE.Color("#ff5a24"), hot)} metalness={0.7} roughness={0.4} emissive="#ff4a1a" emissiveIntensity={hot * 1.2} /></mesh>)}
        {[-0.38, 0.38].map((x) => <mesh key={"cv" + x} position={[x, 0.87, -FD / 2 - 0.05]}><boxGeometry args={[0.014, 1.06, 0.014]} /><meshStandardMaterial color="#2a2d31" metalness={0.7} roughness={0.4} /></mesh>)}
        {/* jarra salada pasada al estante de arriba (paso 4) */}
        {fall > 0.01 && <mesh position={[0.2, 1.12, 0.05]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.26, 18]} /><meshStandardMaterial color="#cfe9ff" transparent opacity={0.85} roughness={0.15} emissive="#6fc3ff" emissiveIntensity={1.3 * fall} /></mesh>}
        {/* luz interior que muere al desenchufar */}
        <pointLight position={[0, 1.1, 0.1]} intensity={lightOn * 2.2} distance={1.6} color="#fff6e6" />
        {/* puerta(s): bisagra en el lado derecho; se abre hacia cámara al final */}
        <group position={[FW / 2, 0, FD / 2]} rotation={[0, door * 1.7, 0]}>
          <mesh position={[-FW / 2, (FH - 0.58) / 2 + 0.03, 0.035]} castShadow><boxGeometry args={[FW, FH - 0.62, 0.07]} /><meshStandardMaterial color="#eef0f2" roughness={0.55} metalness={0.02} /></mesh>
          <mesh position={[-FW / 2, FH - 0.28, 0.035]} castShadow><boxGeometry args={[FW, 0.54, 0.07]} /><meshStandardMaterial color="#eef0f2" roughness={0.55} metalness={0.02} /></mesh>
          <mesh position={[-FW + 0.06, 0.9, 0.09]}><boxGeometry args={[0.025, 0.4, 0.03]} /><meshStandardMaterial color="#a7adb4" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[-FW + 0.06, FH - 0.32, 0.09]}><boxGeometry args={[0.025, 0.22, 0.03]} /><meshStandardMaterial color="#a7adb4" metalness={0.7} roughness={0.3} /></mesh>
          {/* junta (se pone roja donde entra el calor) */}
          <mesh position={[-FW / 2, 0.08, 0.0]}><boxGeometry args={[FW - 0.04, 0.012, 0.012]} /><meshBasicMaterial color={new THREE.Color("#3a3d42").lerp(new THREE.Color("#ff6a3d"), heat)} toneMapped={false} /></mesh>
        </group>
        {door > 0.01 && <pointLight position={[0, 1.0, FD / 2 + 0.2]} intensity={door * (fx ? 2.2 : 9)} distance={3} color="#eaf6ff" />}
      </group>

      <Particles pts={cp} color="#6fc8ff" size={0.022} opacity={cold * 0.85} />
      <Particles pts={lp} color="#8fd6ff" size={0.02} opacity={leak * 0.75 * (1 - door)} />
      <Particles pts={hp} color="#ff9a4a" size={0.02} opacity={heat * 0.6 * (1 - door)} />
      {fall > 0.01 && <Particles pts={fp} color="#9fe0ff" size={0.024} opacity={fall * 0.9} />}
    </ThreeCanvas>
  );
};
export const FPT = { outlet: [0.95, 0.47, -0.6] as [number, number, number], seal: [0, 0.1, 0.42] as [number, number, number], top: [0, 1.85, 0] as [number, number, number], jugs: [-0.04, 1.44, 0.1] as [number, number, number] };
