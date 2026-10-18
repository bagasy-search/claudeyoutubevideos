// Maqueta.tsx — ESTILO 1 (ref. creador 17-oct): maqueta de arcilla blanca vista desde arriba, luz pastel rosa/celeste,
// sombras suaves, desenfoque tilt-shift y un anillo HUD que marca el objetivo. Adaptado: pueblo romano en un valle alpino nevado.
import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { FPS, W, H, k01, lerp, ease, easeOut, rnd, SANS, shadow, interp } from "./lib";

const CLAY = "#efe9e4";
let _roof: THREE.CanvasTexture | null = null;
const roofTex = () => { if (_roof) return _roof; const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!; g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#d9dadd";
  for (let i = 0; i < 128; i += 10) g.fillRect(0, i, 128, 2); for (let i = 0; i < 128; i += 12) g.fillRect(i, 0, 2, 128); _roof = new THREE.CanvasTexture(c); _roof.wrapS = _roof.wrapT = THREE.RepeatWrapping; _roof.repeat.set(0.6, 0.6); return _roof; };
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};
// ruido suave determinista para el terreno
const n2 = (x: number, z: number) => Math.sin(x * 0.11 + 1.3) * Math.cos(z * 0.13 - 0.7) + 0.5 * Math.sin(x * 0.23 + z * 0.17) + 0.25 * Math.sin(x * 0.51 - z * 0.43 + 2);
// valle a lo largo de X: llano en el medio (|z| < 18), montañas a los costados
export const ground = (x: number, z: number) => {
  const d = Math.max(0, Math.abs(z + 2 * Math.sin(x * 0.05)) - 17);
  return Math.pow(d, 1.35) * 0.55 + (d > 0 ? n2(x, z) * d * 0.35 : 0) + 0.15 * n2(x * 2, z * 2);
};
const RIVER_Z = (x: number) => 9 + 2 * Math.sin(x * 0.07);

const Terrain: React.FC = () => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(220, 160, 220, 160); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); let y = ground(x, z); if (Math.abs(z - RIVER_Z(x)) < 1.6) y -= 0.35 * (1 - Math.abs(z - RIVER_Z(x)) / 1.6); p.setY(i, y); }
    g.computeVertexNormals(); return g;
  }, []);
  return <mesh geometry={geo} receiveShadow castShadow><meshStandardMaterial color={CLAY} roughness={1} /></mesh>;
};
const River: React.FC<{ t: number }> = ({ t }) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = []; for (let x = -110; x <= 110; x += 2) pts.push(new THREE.Vector3(x, -0.12, RIVER_Z(x)));
    const shape = new THREE.PlaneGeometry(220, 2.4, 110, 1); shape.rotateX(-Math.PI / 2);
    const p = shape.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setZ(i, z + RIVER_Z(x)); p.setY(i, -0.12); }
    return shape;
  }, []);
  return <mesh geometry={geo} receiveShadow><meshStandardMaterial color="#cfe3ef" roughness={0.35} metalness={0.05} /></mesh>;
};

// casa con techo a dos aguas
const House: React.FC<{ x: number; z: number; w: number; d: number; h: number; r?: number }> = ({ x, z, w, d, h, r = 0 }) => {
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-w / 2 - 0.08, 0); s.lineTo(w / 2 + 0.08, 0); s.lineTo(0, w * 0.32); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: d + 0.16, bevelEnabled: false }); }, [w, d]);
  const y = ground(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, r, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, h, d]} /><meshStandardMaterial color={CLAY} roughness={0.95} /></mesh>
      <mesh geometry={roof} position={[0, h, -d / 2 - 0.08]} castShadow receiveShadow><meshStandardMaterial map={roofTex()} color="#fbf8f4" roughness={0.9} /></mesh>
      {Array.from({ length: Math.max(1, Math.floor(w / 0.55)) }, (_, k) => { const nw = Math.max(1, Math.floor(w / 0.55)), nx = (k - (nw - 1) / 2) * 0.55; return [-1, 1].map((sd) =>
        <mesh key={k + "" + sd} position={[nx, h * 0.62, sd * (d / 2 + 0.005)]}><boxGeometry args={[0.2, 0.28, 0.02]} /><meshStandardMaterial color="#cfd3d8" roughness={1} /></mesh>); })}
      <mesh position={[0, 0.25, d / 2 + 0.005]}><boxGeometry args={[0.3, 0.5, 0.02]} /><meshStandardMaterial color="#c4c8ce" /></mesh>
      <mesh position={[0, h + w * 0.32, 0]} castShadow><boxGeometry args={[0.07, 0.07, d + 0.2]} /><meshStandardMaterial color={CLAY} /></mesh>
    </group>
  );
};
// casa con patio (domus): cuatro alas alrededor de un patio
const Domus: React.FC<{ x: number; z: number; s: number; r?: number }> = ({ x, z, s, r = 0 }) => (
  <group position={[x, 0, z]} rotation={[0, r, 0]}>
    <House x={0} z={-s / 2} w={s} d={1.1} h={1.1} />
    <House x={0} z={s / 2} w={s} d={1.1} h={1.1} />
    <group rotation={[0, Math.PI / 2, 0]}><House x={0} z={-s / 2} w={s - 2.2} d={1.1} h={1.0} /><House x={0} z={s / 2} w={s - 2.2} d={1.1} h={1.0} /></group>
  </group>
);
const Temple: React.FC<{ x: number; z: number }> = ({ x, z }) => {
  const y = ground(x, z);
  const roof = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-1.9, 0); s.lineTo(1.9, 0); s.lineTo(0, 0.9); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: 6.2, bevelEnabled: false }); }, []);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[4.2, 1, 6.6]} /><meshStandardMaterial color={CLAY} /></mesh>
      {Array.from({ length: 12 }, (_, i) => { const side = i < 6 ? -1 : 1, k = i % 6; return <mesh key={i} position={[side * 1.65, 2.1, -2.7 + k * 1.08]} castShadow><cylinderGeometry args={[0.16, 0.18, 2.2, 12]} /><meshStandardMaterial color={CLAY} /></mesh>; })}
      <mesh position={[0, 2.0, 0.4]} castShadow><boxGeometry args={[2.6, 2.0, 4.4]} /><meshStandardMaterial color={CLAY} /></mesh>
      <mesh position={[0, 3.3, 0]} castShadow><boxGeometry args={[3.8, 0.3, 6.2]} /><meshStandardMaterial color={CLAY} /></mesh>
      <mesh geometry={roof} position={[0, 3.45, -3.1]} castShadow><meshStandardMaterial color="#fbf8f4" /></mesh>
    </group>
  );
};
// termas: sala larga con ábside, cúpulas chicas y respiraderos que echan vapor
export const BATH: [number, number] = [6, -3];
const Baths: React.FC = () => {
  const [x, z] = BATH, y = ground(x, z);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow><boxGeometry args={[9, 2.2, 4]} /><meshStandardMaterial color={CLAY} /></mesh>
      <mesh position={[4.5, 1.1, 0]} castShadow><cylinderGeometry args={[2, 2, 2.2, 24, 1, false, 0, Math.PI]} /><meshStandardMaterial color={CLAY} side={THREE.DoubleSide} /></mesh>
      {[-2.5, 0.5, 3.2].map((dx, i) => <mesh key={i} position={[dx, 2.2, 0]} castShadow><sphereGeometry args={[1.25, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#fbf8f4" /></mesh>)}
      <mesh position={[-6.2, 0.8, 0.6]} castShadow receiveShadow><boxGeometry args={[3.4, 1.6, 5.4]} /><meshStandardMaterial color={CLAY} /></mesh>
      {Array.from({ length: 9 }, (_, k) => <mesh key={"w" + k} position={[-3.6 + k * 0.9, 1.2, 2.01]}><boxGeometry args={[0.42, 0.9, 0.03]} /><meshStandardMaterial color="#c9ced6" /></mesh>)}
      {Array.from({ length: 9 }, (_, k) => <mesh key={"a" + k} position={[-3.6 + k * 0.9, 1.65, 2.01]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.21, 0.21, 0.03, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#c9ced6" /></mesh>)}
      {Array.from({ length: 12 }, (_, k) => <mesh key={"c" + k} position={[-4.2 + k * 0.76, 0.9, 2.7]} castShadow><cylinderGeometry args={[0.09, 0.1, 1.6, 10]} /><meshStandardMaterial color={CLAY} /></mesh>)}
      <mesh position={[0, 1.75, 2.7]} castShadow><boxGeometry args={[9.2, 0.14, 1.5]} /><meshStandardMaterial color={CLAY} /></mesh>
      {[-3.8, -1.2, 1.8].map((dx, i) => <mesh key={"v" + i} position={[dx, 2.6, -1.5]} castShadow><boxGeometry args={[0.35, 0.8, 0.35]} /><meshStandardMaterial color={CLAY} /></mesh>)}
      <mesh position={[0, 0.25, 3.6]} receiveShadow><boxGeometry args={[12, 0.1, 3]} /><meshStandardMaterial color="#ece6de" /></mesh>
    </group>
  );
};
const Forum: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, ground(x, z), z]}>
    <mesh position={[0, 0.05, 0]} receiveShadow><boxGeometry args={[10, 0.1, 7]} /><meshStandardMaterial color="#ebe5dc" /></mesh>
    {Array.from({ length: 34 }, (_, i) => { const e = i < 10 ? [-4.6 + i * 1.02, -3.2] : i < 20 ? [-4.6 + (i - 10) * 1.02, 3.2] : i < 27 ? [-4.8, -2.4 + (i - 20) * 0.8] : [4.8, -2.4 + (i - 27) * 0.8];
      return <mesh key={i} position={[e[0], 0.6, e[1]]} castShadow><cylinderGeometry args={[0.1, 0.1, 1.1, 10]} /><meshStandardMaterial color={CLAY} /></mesh>; })}
  </group>
);
const Pine: React.FC<{ x: number; z: number; s: number }> = ({ x, z, s }) => (
  <group position={[x, ground(x, z), z]}>
    <mesh position={[0, 0.9 * s, 0]} castShadow><coneGeometry args={[0.55 * s, 1.8 * s, 8]} /><meshStandardMaterial color="#f7f4ef" roughness={1} /></mesh>
    <mesh position={[0, 1.6 * s, 0]} castShadow><coneGeometry args={[0.38 * s, 1.2 * s, 8]} /><meshStandardMaterial color="#f7f4ef" roughness={1} /></mesh>
  </group>
);
// carros/personas en las calles (lo oscuro, como los autos de la referencia)
const ROADS: [number, number, number, number][] = [[-40, 1, 40, 1], [6, -16, 6, 16], [-14, -12, -14, 12], [18, -12, 22, 12]];
const Movers: React.FC<{ t: number }> = ({ t }) => (
  <>{Array.from({ length: 26 }, (_, i) => {
    const r = ROADS[i % ROADS.length], u = ((t * (0.012 + rnd(i, 3) * 0.02) * (i % 2 ? 1 : -1) + rnd(i, 4)) % 1 + 1) % 1;
    const x = lerp(r[0], r[2], u), z = lerp(r[1], r[3], u) + (i % 2 ? 0.35 : -0.35), ang = Math.atan2(r[3] - r[1], r[2] - r[0]);
    const cart = i % 3 === 0;
    return <mesh key={i} position={[x, ground(x, z) + 0.18, z]} rotation={[0, -ang, 0]} castShadow>
      <boxGeometry args={cart ? [0.7, 0.32, 0.38] : [0.18, 0.36, 0.18]} /><meshStandardMaterial color={cart ? "#3a3236" : "#2a2428"} roughness={0.6} /></mesh>;
  })}</>
);
const Steam: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!; const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,.9)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); }, []);
  const [bx, bz] = BATH, by = ground(bx, bz);
  return <>{Array.from({ length: 40 }, (_, i) => {
    const life = ((t * 0.18 + rnd(i, 9)) % 1), src = [-2.5, 0.5, 3.2, -6][i % 4];
    return <sprite key={i} position={[bx + src + life * 1.5, by + 3 + life * 5, bz + (rnd(i, 2) - 0.5) + life * 0.8]} scale={[0.8 + life * 2.6, 0.8 + life * 2.6, 1]}>
      <spriteMaterial map={tex} transparent opacity={0.55 * Math.sin(Math.PI * life)} depthWrite={false} /></sprite>;
  })}</>;
};

const Lamps: React.FC = () => (
  <>{ROADS.flatMap((r, k) => Array.from({ length: 14 }, (_, i) => { const u = (i + 0.5) / 14, x = lerp(r[0], r[2], u) + (i % 2 ? 0.9 : -0.9) * (k === 0 ? 0 : 1), z = lerp(r[1], r[3], u) + (i % 2 ? 0.9 : -0.9) * (k === 0 ? 1 : 0), y = ground(x, z);
    return <group key={k + "-" + i} position={[x, y, z]}><mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.7, 6]} /><meshStandardMaterial color={CLAY} /></mesh>
      <mesh position={[0, 0.72, 0]}><sphereGeometry args={[0.07, 10, 8]} /><meshBasicMaterial color="#ff9ccf" /></mesh></group>; }))}</>
);
const TOWN = (() => {
  const h: { x: number; z: number; w: number; d: number; hh: number; r: number }[] = [];
  for (let i = 0; i < 140; i++) {
    const x = -34 + rnd(i, 1) * 64, z = -14 + rnd(i, 2) * 21;
    if (Math.abs(x - BATH[0]) < 9 && Math.abs(z - BATH[1]) < 5) continue;          // termas
    if (Math.abs(x + 6) < 6 && Math.abs(z + 4) < 5) continue;                      // foro
    if (Math.abs(x + 20) < 3.5 && Math.abs(z - 3) < 4.5) continue;                 // templo
    if ([1, -12, 12, 3].some((rz, k) => k === 0 ? Math.abs(z - rz) < 1.2 : false) || Math.abs(x - 6) < 1 || Math.abs(x + 14) < 1) continue; // calles
    h.push({ x, z, w: 1.4 + rnd(i, 3) * 1.8, d: 1.2 + rnd(i, 4) * 1.2, hh: 0.8 + rnd(i, 5) * 0.9, r: Math.round(rnd(i, 6)) * Math.PI / 2 });
  }
  return h;
})();
const PINES = Array.from({ length: 160 }, (_, i) => ({ x: -100 + rnd(i, 7) * 200, z: (rnd(i, 8) > 0.5 ? 1 : -1) * (19 + rnd(i, 9) * 22), s: 0.8 + rnd(i, 10) * 0.9 }));

const Scene: React.FC<{ t: number; cam: { pos: THREE.Vector3; look: THREE.Vector3; fov: number } }> = ({ t, cam }) => (
  <>
    <Cam {...cam} />
    <color attach="background" args={["#8fb6c8"]} />
    <fog attach="fog" args={["#9cc0d0", 90, 220]} />
    <hemisphereLight args={["#6fa9c4", "#4e8aa6", 1.15]} /><ambientLight color="#5d9bb8" intensity={0.35} />
    <directionalLight position={[-34, 18, 14]} intensity={3.4} color="#ffb8d4" castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096}
      shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-bias={-0.0003} shadow-radius={6} />
    <Terrain /><River t={t} />
    {TOWN.map((h, i) => <House key={i} x={h.x} z={h.z} w={h.w} d={h.d} h={h.hh} r={h.r} />)}
    <Domus x={-26} z={-8} s={5} /><Domus x={20} z={-9} s={4.5} r={0.1} />
    <Temple x={-20} z={3} /><Forum x={-6} z={-4} /><Baths />
    {PINES.map((p, i) => <Pine key={i} {...p} />)}
    {/* puente */}
    <mesh position={[6, 0.25, RIVER_Z(6)]} castShadow receiveShadow><boxGeometry args={[1.6, 0.25, 4]} /><meshStandardMaterial color={CLAY} /></mesh>
    <Movers t={t} /><Steam t={t} /><Lamps />
  </>
);

export type MKey = { at: number; pos: [number, number, number]; look: [number, number, number]; fov?: number };
// anillo HUD sobre un punto del mundo, como el de la referencia
export const Maqueta: React.FC<{ t0: number; keys: MKey[]; ring?: { at: number; out?: number; x: number; z: number; label?: string; sub?: string } }> = ({ t0, keys, ring }) => {
  const f = useCurrentFrame(), t = f / FPS - t0;
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1].at) i++;
  const A = keys[i], B = keys[Math.min(i + 1, keys.length - 1)];
  const u = lerp(k01(t, A.at, B.at), ease(k01(t, A.at, B.at)), 0.35);            // movimiento casi lineal: vuelo continuo
  const pos = new THREE.Vector3(...A.pos.map((v, n) => lerp(v, B.pos[n], u)) as [number, number, number]);
  const look = new THREE.Vector3(...A.look.map((v, n) => lerp(v, B.look[n], u)) as [number, number, number]);
  const fov = lerp(A.fov ?? 32, B.fov ?? 32, u);
  const cam = useMemo(() => new THREE.PerspectiveCamera(32, W / H, 0.1, 400), []);
  cam.fov = fov; cam.position.copy(pos); cam.lookAt(look); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  let ringEl: React.ReactNode = null;
  if (ring) {
    const a = interp(t, [ring.at, ring.at + 0.3, (ring.out ?? 99) - 0.3, ring.out ?? 99], [0, 1, 1, 0]);
    if (a > 0) {
      const c = new THREE.Vector3(ring.x, ground(ring.x, ring.z), ring.z).project(cam), e = new THREE.Vector3(ring.x + 6, ground(ring.x, ring.z), ring.z).project(cam);
      const sx = (c.x * 0.5 + 0.5) * W, sy = (-c.y * 0.5 + 0.5) * H, rx = Math.abs((e.x - c.x) * 0.5 * W) + 10;
      const pulse = 1 + 0.06 * Math.sin(t * 4), grow = easeOut(k01(t, ring.at, ring.at + 0.5));
      ringEl = (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
          <svg width={W} height={H} style={{ position: "absolute" }}>
            <ellipse cx={sx} cy={sy} rx={rx * grow * pulse} ry={rx * 0.55 * grow * pulse} fill="none" stroke="#eaf7ff" strokeWidth={4} style={{ filter: "drop-shadow(0 0 10px #7fd0ff)" }} />
            <ellipse cx={sx} cy={sy} rx={rx * 1.25 * grow} ry={rx * 0.69 * grow} fill="none" stroke="rgba(234,247,255,.45)" strokeWidth={2} strokeDasharray="10 12" />
          </svg>
          {ring.label && <div style={{ position: "absolute", left: sx, top: sy + rx * 0.69 * grow + 26, transform: "translateX(-50%)", textAlign: "center", color: "#fff", textShadow: shadow, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 6 }}>{ring.label}</div>
            {ring.sub && <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 28 }}>{ring.sub}</div>}</div>}
        </div>
      );
    }
  }
  // tilt-shift: franjas arriba y abajo cada vez más borrosas
  const band = (top: boolean, px: number, h: number, from: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, [top ? "top" : "bottom"]: 0, height: h, backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`,
      maskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black ${from}%, transparent 100%)`, WebkitMaskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black ${from}%, transparent 100%)` }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 32, position: [0, 30, 40], near: 0.1, far: 400 }}>
        <Scene t={t} cam={{ pos, look, fov }} />
      </ThreeCanvas>
      {band(true, 6, 420, 20)}{band(true, 14, 260, 30)}{band(false, 6, 420, 20)}{band(false, 14, 260, 30)}
      {ringEl}
    </div>
  );
};
