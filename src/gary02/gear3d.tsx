// gary02 · LOS TRES CONTENDIENTES en three.js (se usan en la casa en corte y en la arena del garaje):
// generador a nafta de marco abierto (vibra y larga humo), estación de batería (pantalla que marca %),
// batería de auto + inversor con pinzas. Más la niebla de monóxido (puntos suaves) que avanza por la casa.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import * as THREE from "three";
import { rbox } from "./fx3d";

type V3 = [number, number, number];
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const cl = (x: number) => Math.max(0, Math.min(1, x));

const B: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} />
  </mesh>
);
// caño entre dos puntos (marco del generador, cables)
const Pipe: React.FC<{ a: V3; b: V3; r?: number; c: string; m?: number }> = ({ a, b, r = 0.022, c, m = 0.4 }) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), mid = va.clone().add(vb).multiplyScalar(0.5);
  const len = va.distanceTo(vb), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, len, 12]} /><meshStandardMaterial color={c} metalness={m} roughness={0.35} /></mesh>;
};

// pantalla con texto (CanvasTexture)
const useScreen = (txt: string, col: string, glow: number, w = 256, h = 128) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, [w, h]);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#06090d"; g.fillRect(0, 0, w, h);
  if (glow > 0.02) {
    g.globalAlpha = glow; g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 14;
    g.font = `bold ${Math.round(h * 0.55)}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h * 0.52);
    g.globalAlpha = 1; g.shadowBlur = 0;
  }
  tex.needsUpdate = true;
  return tex;
};

// ---------------- GENERADOR a nafta, marco abierto (~0,6 x 0,5 x 0,55 m) ----------------
export const Generator: React.FC<{ p: V3; rotY?: number; run?: number; t: number; scale?: number }> = ({ p, rotY = 0, run = 0, t, scale = 1 }) => {
  const j = run * 0.006;
  const jit: V3 = [Math.sin(t * 97) * j, Math.abs(Math.sin(t * 131)) * j, Math.cos(t * 83) * j];
  const RED = "#c7271d", FR = "#1d1f22";
  const X = 0.34, Y = 0.5, Z = 0.27;
  const frame: [V3, V3][] = [
    [[-X, 0.03, -Z], [X, 0.03, -Z]], [[-X, 0.03, Z], [X, 0.03, Z]], [[-X, 0.03, -Z], [-X, 0.03, Z]], [[X, 0.03, -Z], [X, 0.03, Z]],
    [[-X, 0.03, -Z], [-X, Y, -Z]], [[X, 0.03, -Z], [X, Y, -Z]], [[-X, 0.03, Z], [-X, Y, Z]], [[X, 0.03, Z], [X, Y, Z]],
    [[-X, Y, -Z], [-X, Y, Z]], [[X, Y, -Z], [X, Y, Z]],
  ];
  return (
    <group position={p} rotation={[0, rotY, 0]} scale={scale}>
      <group position={jit}>
        {frame.map(([a, b], i) => <Pipe key={i} a={a} b={b} r={0.024} c={FR} m={0.5} />)}
        {/* tanque rojo arriba */}
        <B p={[0, Y + 0.08, 0]} s={[0.6, 0.15, 0.46]} c={RED} r={0.35} m={0.1} rad={0.05} />
        <mesh position={[-0.16, Y + 0.17, 0.05]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.04, 20]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
        <mesh position={[0.12, Y + 0.165, -0.05]}><cylinderGeometry args={[0.035, 0.035, 0.02, 16]} /><meshStandardMaterial color="#ddd" metalness={0.8} roughness={0.25} /></mesh>
        {/* motor negro + aletas + filtro */}
        <B p={[-0.08, 0.24, 0]} s={[0.3, 0.3, 0.32]} c="#24262a" r={0.5} m={0.4} />
        {Array.from({ length: 6 }, (_, i) => <B key={i} p={[-0.08, 0.13 + i * 0.045, 0.17]} s={[0.26, 0.012, 0.03]} c="#3a3d42" m={0.6} r={0.4} rad={0.004} />)}
        <B p={[-0.26, 0.33, 0.08]} s={[0.07, 0.14, 0.16]} c="#3b3e44" r={0.6} />
        {/* alternador (cilindro rojo) */}
        <mesh position={[0.18, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.24, 28]} /><meshStandardMaterial color={RED} roughness={0.35} /></mesh>
        <mesh position={[0.3, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.02, 28]} /><meshStandardMaterial color="#2a2c30" metalness={0.6} /></mesh>
        {/* panel de control con tomas */}
        <B p={[0.2, 0.36, 0.24]} s={[0.24, 0.16, 0.03]} c="#2d3035" r={0.5} />
        {[-0.06, 0.06].map((dx) => <B key={dx} p={[0.2 + dx, 0.36, 0.258]} s={[0.07, 0.07, 0.01]} c="#e8e2d6" r={0.6} rad={0.006} />)}
        <mesh position={[0.29, 0.42, 0.258]}><sphereGeometry args={[0.012, 8, 8]} /><meshBasicMaterial color={run > 0.1 ? "#5dff7a" : "#163"} toneMapped={false} /></mesh>
        {/* silenciador */}
        <mesh position={[-0.24, 0.13, -0.18]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.2, 16]} /><meshStandardMaterial color="#6b6f75" metalness={0.8} roughness={0.35} /></mesh>
        {/* ruedas */}
        {[-0.2, 0.2].map((z) => <mesh key={z} position={[-X - 0.02, 0.07, z * 1.3]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.05, 18]} /><meshStandardMaterial color="#141414" roughness={0.9} /></mesh>)}
      </group>
    </group>
  );
};
// humo de escape (puntos suaves que salen del silenciador y suben/derivan)
export const Exhaust: React.FC<{ t: number; from: V3; dir?: V3; run: number; map?: THREE.Texture; n?: number; col?: string }> = ({ t, from, dir = [-0.6, 0.35, 0.2], run, map, n = 90, col = "#9a9ea6" }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = new Float32Array(n * 3), cols = new Float32Array(n * 3);
  const c = new THREE.Color(col);
  for (let i = 0; i < n; i++) {
    const life = 2.4, ph = ((t + rnd(i, 2) * life) % life) / life;
    const sp = 1.2 + rnd(i, 3) * 0.8;
    const x = from[0] + dir[0] * ph * sp + (rnd(i, 4) - 0.5) * ph * 0.5 + Math.sin(t * 1.3 + i) * 0.05 * ph;
    const y = from[1] + dir[1] * ph * sp + ph * ph * 0.5;
    const z = from[2] + dir[2] * ph * sp + (rnd(i, 5) - 0.5) * ph * 0.5;
    pos.set([x, y, z], i * 3);
    const a = run * (1 - ph) * Math.min(1, ph * 6);
    cols.set([c.r * a, c.g * a, c.b * a], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  return <points geometry={geo}><pointsMaterial vertexColors size={0.32} map={map} alphaTest={0.01} sizeAttenuation transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
};

// ---------------- ESTACIÓN DE BATERÍA (~0,32 x 0,26 x 0,22 m) ----------------
export const PowerStation: React.FC<{ p: V3; rotY?: number; pct?: string; glow?: number; scale?: number }> = ({ p, rotY = 0, pct = "100%", glow = 1, scale = 1 }) => {
  const scr = useScreen(pct, "#7fd8ff", glow);
  return (
    <group position={p} rotation={[0, rotY, 0]} scale={scale}>
      <B p={[0, 0.14, 0]} s={[0.4, 0.27, 0.26]} c="#5d636b" r={0.45} m={0.2} rad={0.035} />
      <B p={[0, 0.14, 0]} s={[0.41, 0.2, 0.265]} c="#3a3f46" r={0.5} rad={0.02} />
      {/* asa */}
      <Pipe a={[-0.15, 0.27, 0]} b={[-0.15, 0.33, 0]} r={0.018} c="#2b2f35" />
      <Pipe a={[0.15, 0.27, 0]} b={[0.15, 0.33, 0]} r={0.018} c="#2b2f35" />
      <Pipe a={[-0.15, 0.33, 0]} b={[0.15, 0.33, 0]} r={0.02} c="#2b2f35" />
      {/* pantalla + tomas */}
      <mesh position={[-0.09, 0.17, 0.134]}><planeGeometry args={[0.13, 0.065]} /><meshBasicMaterial map={scr} toneMapped={false} /></mesh>
      {[0.03, 0.11].map((x) => <B key={x} p={[x, 0.17, 0.133]} s={[0.055, 0.06, 0.006]} c="#e7e3da" rad={0.005} />)}
      {[-0.12, -0.07, -0.02].map((x) => <B key={x} p={[x, 0.08, 0.133]} s={[0.03, 0.018, 0.006]} c="#15171a" rad={0.003} />)}
      <mesh position={[0.15, 0.08, 0.134]}><circleGeometry args={[0.016, 16]} /><meshBasicMaterial color="#7fd8ff" toneMapped={false} transparent opacity={0.3 + 0.7 * glow} /></mesh>
      {glow > 0.05 && <pointLight position={[0, 0.17, 0.3]} intensity={glow * 0.25} distance={0.9} color="#7fd8ff" />}
    </group>
  );
};

// ---------------- BATERÍA DE AUTO + INVERSOR con pinzas ----------------
export const CarBattery: React.FC<{ p: V3; rotY?: number; scale?: number; cables?: number }> = ({ p, rotY = 0, scale = 1, cables = 1 }) => (
  <group position={p} rotation={[0, rotY, 0]} scale={scale}>
    {/* batería */}
    <B p={[-0.2, 0.1, 0]} s={[0.26, 0.19, 0.17]} c="#17181a" r={0.55} rad={0.012} />
    <B p={[-0.2, 0.2, 0]} s={[0.265, 0.025, 0.175]} c="#24262a" r={0.5} rad={0.008} />
    <mesh position={[-0.29, 0.225, 0.04]}><cylinderGeometry args={[0.015, 0.017, 0.03, 12]} /><meshStandardMaterial color="#b9a46a" metalness={0.9} roughness={0.3} /></mesh>
    <mesh position={[-0.11, 0.225, 0.04]}><cylinderGeometry args={[0.015, 0.017, 0.03, 12]} /><meshStandardMaterial color="#b9a46a" metalness={0.9} roughness={0.3} /></mesh>
    <mesh position={[-0.29, 0.243, 0.04]}><boxGeometry args={[0.03, 0.02, 0.05]} /><meshStandardMaterial color="#c62a20" roughness={0.4} /></mesh>
    <mesh position={[-0.11, 0.243, 0.04]}><boxGeometry args={[0.03, 0.02, 0.05]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
    {/* inversor plateado con aletas */}
    <B p={[0.2, 0.05, 0]} s={[0.22, 0.09, 0.13]} c="#b8bdc4" m={0.85} r={0.3} rad={0.012} />
    {Array.from({ length: 7 }, (_, i) => <B key={i} p={[0.11 + i * 0.03, 0.1, 0]} s={[0.008, 0.015, 0.13]} c="#a5aab1" m={0.85} r={0.3} rad={0.002} />)}
    <B p={[0.312, 0.05, 0]} s={[0.006, 0.07, 0.1]} c="#2b2e33" rad={0.003} />
    <B p={[0.315, 0.055, 0.025]} s={[0.004, 0.03, 0.03]} c="#e7e3da" rad={0.002} />
    {/* cables */}
    {cables > 0.01 && <>
      <Pipe a={[-0.29, 0.25, 0.04]} b={[0.09, 0.07, 0.03]} r={0.011} c="#c62a20" m={0.1} />
      <Pipe a={[-0.11, 0.25, 0.04]} b={[0.09, 0.05, -0.03]} r={0.011} c="#1a1a1a" m={0.1} />
    </>}
  </group>
);

// ---------------- MONÓXIDO: niebla gris que avanza por la casa ----------------
// k = 0..1 avance; path = puntos por donde viaja el frente (garaje → bajo la puerta → living/cocina → escalera → dormitorio)
export const CoFog: React.FC<{ t: number; k: number; path: V3[]; spread?: V3; n?: number; map?: THREE.Texture; o?: number; col?: string }> = ({ t, k, path, spread = [1.4, 0.7, 1.6], n = 700, map, o = 1, col = "#aab0b8" }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = new Float32Array(n * 3), cols = new Float32Array(n * 3);
  const c = new THREE.Color(col);
  const seg = path.length - 1;
  for (let i = 0; i < n; i++) {
    const u = rnd(i, 1);                 // dónde vive esta partícula a lo largo del camino
    const reach = cl((k * 1.15 - u) * 5); // aparece cuando el frente la pasa
    const f = u * seg, s0 = Math.min(seg - 1, Math.floor(f)), w = f - s0;
    const a = path[s0], b = path[s0 + 1];
    const drift = Math.sin(t * 0.5 + i) * 0.12;
    const x = a[0] + (b[0] - a[0]) * w + (rnd(i, 2) - 0.5) * spread[0] + drift;
    const y = a[1] + (b[1] - a[1]) * w + rnd(i, 3) * spread[1] * (0.4 + 0.6 * reach) + Math.sin(t * 0.7 + i * 0.3) * 0.05;
    const z = a[2] + (b[2] - a[2]) * w + (rnd(i, 4) - 0.5) * spread[2] + Math.cos(t * 0.4 + i) * 0.1;
    pos.set([x, y, z], i * 3);
    const al = reach * o * (0.5 + 0.5 * rnd(i, 6));
    cols.set([c.r * al, c.g * al, c.b * al], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  return <points geometry={geo}><pointsMaterial vertexColors size={1.35} map={map} alphaTest={0.002} sizeAttenuation transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
};

// alarma de CO en la pared (disco blanco + LED rojo que titila)
export const CoAlarm: React.FC<{ p: V3; blink: number }> = ({ p, blink }) => (
  <group position={p}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.12, 0.04, 32]} /><meshStandardMaterial color="#eeece6" roughness={0.5} /></mesh>
    <mesh position={[0.05, 0, 0.025]}><sphereGeometry args={[0.016, 10, 8]} /><meshBasicMaterial color={new THREE.Color("#3a0b08").lerp(new THREE.Color("#ff2a1a"), blink)} toneMapped={false} /></mesh>
    {blink > 0.05 && <pointLight position={[0, 0, 0.25]} intensity={blink * 3} distance={3.2} color="#ff3020" />}
  </group>
);
