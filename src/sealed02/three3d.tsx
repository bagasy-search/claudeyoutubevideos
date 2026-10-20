// sealed02 · escenas 3D REALES (three.js) del minuto 1 v2: galería con focos volumétricos y polvo, globo con 7 pilares
// de luz que pica a Perú, balanza con el bloque y dos jumbos, diorama del arrastre → sillón. Todo con luz, sombra,
// niebla de profundidad y cámara que nunca queda quieta (nada plano). Sólo stills locales; el video sale del farm.
import React, { useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { C, FONT, KeyLine } from "../kits/btg/kit";

const FPS = 30, W = 1920, H = 1080;
const s = (t: number) => Math.round(t * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sm = (x: number) => x * x * (3 - 2 * x);
const e = (f: number, a: number, b: number) => sm(interpolate(f, [a, b], [0, 1], cl));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// la cámara se fija desde adentro del canvas en cada cuadro
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov?: number }> = ({ pos, look, fov = 35 }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(pos); c.up.set(0, 1, 0); c.lookAt(look);
  if (c.fov !== fov) c.fov = fov; c.near = 0.01; c.far = 300; c.updateProjectionMatrix();
  return null;
};
// cámara gemela fuera del canvas: para proyectar rótulos HTML exactamente sobre los objetos 3D
const project = (pos: THREE.Vector3, look: THREE.Vector3, fov: number, p: THREE.Vector3) => {
  const c = new THREE.PerspectiveCamera(fov, W / H, 0.01, 300); c.position.copy(pos); c.lookAt(look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = p.clone().project(c); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
const useTex = (src: string) => {
  const [h] = useState(() => delayRender("tex " + src));
  const [ok, setOk] = useState(false);
  const t = useMemo(() => {
    const x = new THREE.TextureLoader().load(staticFile(src), () => { setOk(true); continueRender(h); }, undefined, () => { setOk(true); continueRender(h); });
    x.colorSpace = THREE.SRGBColorSpace; x.anisotropy = 8; return x;
  }, [src, h]);
  return ok ? t : null;
};

// polvo que flota dentro de un cono de luz (puntos aditivos, deriva lenta y determinista)
const Dust: React.FC<{ x: number; on: number; n?: number; seed?: number; top?: number; r?: number }> = ({ x, on, n = 260, seed = 1, top = 8.5, r = 2.6 }) => {
  const f = useCurrentFrame();
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const yy = ((rnd(i, seed) * top + f * 0.004 * (0.4 + rnd(i, seed + 3))) % top);
    const rr = (1 - yy / top) * r * Math.sqrt(rnd(i, seed + 1)) + 0.1, a = rnd(i, seed + 2) * 6.283 + f * 0.003;
    p.set([x + Math.cos(a) * rr, yy, 0.2 + Math.sin(a) * rr * 0.7], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color="#ffe6c2" size={0.035} sizeAttenuation transparent opacity={0.85 * on} blending={THREE.AdditiveBlending} depthWrite={false} /></points>;
};
// cono volumétrico (dos capas aditivas) + foco real con sombra
const LightCone: React.FC<{ x: number; on: number; color?: string; top?: number }> = ({ x, on, color = "#ffd6a0", top = 9 }) => {
  const tgt = useMemo(() => { const o = new THREE.Object3D(); o.position.set(x, 0, 0.3); return o; }, [x]);
  return (
    <>
      <primitive object={tgt} />
      <spotLight position={[x, top, 0.3]} target={tgt} angle={0.36} penumbra={0.65} intensity={on * 900} distance={30} decay={2} color={color} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0005} />
      {[2.9, 2.2].map((rb, i) => (
        <mesh key={i} position={[x, top / 2, 0.3]}><cylinderGeometry args={[0.12, rb, top, 48, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={on * (i ? 0.05 : 0.035)} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} /></mesh>
      ))}
      {/* charco de luz en el piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, 0.3]}><circleGeometry args={[3.1, 64]} />
        <meshBasicMaterial color={color} transparent opacity={on * 0.07} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    </>
  );
};

// ============ 1. GALERÍA 3D (piedra → acero → láser) y su vuelta "de museo" ============
const PX = [-7, 0, 7];
const stone = (i: number) => new THREE.Color().setHSL((26 + rnd(i, 4) * 12) / 360, 0.18 + rnd(i, 5) * 0.1, 0.3 + rnd(i, 6) * 0.12);
const Lumpy: React.FC<{ x: number; a: number }> = ({ x, a }) => {
  const f = useCurrentFrame();
  const rocks = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const i = r * 4 + c, t = a < -50 ? 1 : spring({ frame: f - a - i * 1.4, fps: FPS, config: { damping: 11 } });
    const sx = 0.42 + rnd(i, 1) * 0.2, sy = 0.3 + rnd(i, 2) * 0.12, sz = 0.36 + rnd(i, 3) * 0.12;
    rocks.push(<mesh key={i} castShadow receiveShadow position={[x - 1.25 + c * 0.82 + (r % 2) * 0.22 + rnd(i, 7) * 0.1, 0.5 + 0.3 + r * 0.6 + (1 - t) * 3, (rnd(i, 8) - 0.5) * 0.2]}
      rotation={[rnd(i, 9) * 3, rnd(i, 10) * 3, rnd(i, 11) * 3]} scale={[sx * t, sy * t, sz * t]}>
      <dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={stone(i)} roughness={0.95} flatShading /></mesh>);
  }
  return <>{rocks}</>;
};
const Bricks: React.FC<{ x: number; a: number }> = ({ x, a }) => {
  const f = useCurrentFrame();
  const b = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < (r % 2 ? 3 : 4); c++) {
    const i = r * 4 + c, t = a < -50 ? 1 : spring({ frame: f - a - i * 1.1, fps: FPS, config: { damping: 14 } });
    b.push(<mesh key={i} castShadow receiveShadow position={[x - 1.35 + c * 0.9 + (r % 2 ? 0.45 : 0), 0.5 + 0.25 + r * 0.5 + (1 - t) * 2.5, 0]} scale={t}>
      <boxGeometry args={[0.86, 0.46, 0.6]} /><meshStandardMaterial color="#8a7a66" roughness={0.8} /></mesh>);
  }
  return <>{b}</>;
};
const Perfect: React.FC<{ x: number; a: number; on: number }> = ({ x, a, on }) => {
  const f = useCurrentFrame();
  const cut = a < -50 ? 1 : e(f, a, a + 22);
  const beam = a > -50 && f >= a - 4 && f < a + 34;
  const sparks = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 70, p = new Float32Array(n * 3), cy = 0.5 + 2 - 2 * cut;
  for (let i = 0; i < n; i++) {
    const k = ((f - a) * 0.09 + rnd(i, 2)) % 1, dir = rnd(i, 3) * 6.283;
    p.set([x + Math.cos(dir) * 1.6 * k, cy + 1.2 * k - 2.6 * k * k, 0.81 + Math.abs(Math.sin(dir)) * 1.4 * k], i * 3);
  }
  sparks.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return (
    <group>
      <mesh castShadow receiveShadow position={[x, 1.5, 0]}><boxGeometry args={[3, 2, 1.6]} /><meshStandardMaterial color="#c4bdb1" roughness={0.28} metalness={0.05} /></mesh>
      {/* la línea de corte en la cara frontal */}
      <mesh position={[x, 2.5 - cut, 0.805]}><planeGeometry args={[0.035, 2 * cut + 0.001]} /><meshBasicMaterial color="#ff3b30" toneMapped={false} /></mesh>
      {beam && <>
        <mesh position={[x, (9 + cy) / 2, 0.81]}><cylinderGeometry args={[0.02, 0.02, 9 - cy, 8]} /><meshBasicMaterial color="#ff5040" toneMapped={false} /></mesh>
        <mesh position={[x, (9 + cy) / 2, 0.81]}><cylinderGeometry args={[0.09, 0.09, 9 - cy, 12, 1, true]} /><meshBasicMaterial color="#ff2a1a" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        <pointLight position={[x, cy, 1.1]} intensity={3 * on} distance={4} color="#ff4a30" />
        <points geometry={sparks}><pointsMaterial color="#ffc46a" size={0.06} sizeAttenuation transparent blending={THREE.AdditiveBlending} depthWrite={false} /></points>
      </>}
    </group>
  );
};
const Pedestal: React.FC<{ x: number }> = ({ x }) => (
  <mesh castShadow receiveShadow position={[x, 0.25, 0]}><boxGeometry args={[4, 0.5, 2.4]} /><meshStandardMaterial color="#161b22" roughness={0.35} metalness={0.3} /></mesh>
);
// vitrina de museo: vidrio + aristas
const Glass: React.FC<{ x: number; o: number }> = ({ x, o }) => {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(4.2, 3.4, 2.6)), []);
  return (
    <group position={[x, 2.2, 0]}>
      <mesh><boxGeometry args={[4.2, 3.4, 2.6]} /><meshStandardMaterial color="#cfe6ff" transparent opacity={0.07 * o} roughness={0.05} metalness={0.4} depthWrite={false} /></mesh>
      <lineSegments geometry={edges}><lineBasicMaterial color="#bfe0ff" transparent opacity={0.45 * o} /></lineSegments>
    </group>
  );
};
export const Gallery3D: React.FC<{ museum?: boolean; d: number }> = ({ museum, d }) => {
  const f = useCurrentFrame();
  const T = (t: number) => s(t - (museum ? 11.0 : 2.4));
  const on = (i: number) => (museum ? 1 - e(f, T(12.95) + i * 4, T(12.95) + i * 4 + 5) : i === 0 ? e(f, 0, 10) : e(f, T(i === 1 ? 7.3 : 8.95), T(i === 1 ? 7.6 : 9.2)));
  let pos: THREE.Vector3, look: THREE.Vector3, fov = 34;
  if (!museum) {
    const k1 = e(f, T(7.25), T(7.85)), k2 = e(f, T(8.95), T(9.4));
    const cx = lerp(lerp(PX[0], PX[1], k1), PX[2], k2);
    const push = e(f, 0, d);
    const crane = 1 - e(f, 0, s(2.2));
    // travelling lateral con un leve arco (la cámara va un poco por delante del foco cuando se mueve)
    const lead = Math.sin(Math.PI * k1) * 1.2 + Math.sin(Math.PI * k2) * 1.2;
    pos = V(cx - 2.2 + lead, 2.3 + crane * 2.4 - push * 0.3, 8.2 - push * 1.4);
    look = V(cx + lead * 0.4, 1.35 + crane * 0.4, 0);
  } else {
    const k = e(f, 0, d);
    pos = V(lerp(-6, -2.5, k), lerp(8.5, 7.6, k), lerp(19, 17, k)); look = V(0.5, 1.2, 0); fov = 38;
  }
  const labels = ["STONE HAMMER", "STEEL CHISEL", "LASER"];
  return (
    <AbsoluteFill style={{ background: "#05080c" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov, position: [0, 3, 9] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <color attach="background" args={["#05080c"]} />
        <fog attach="fog" args={["#05080c", 9, 26]} />
        <ambientLight intensity={0.14} />
        <hemisphereLight args={["#2a3a52", "#000000", 0.25]} />
        <directionalLight position={[0, 3, 12]} intensity={0.55} color="#ffe2c0" />
        {/* piso pulido (refleja los focos) y pared del fondo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 40]} /><meshStandardMaterial color="#0c1016" roughness={0.32} metalness={0.45} /></mesh>
        <mesh position={[0, 6, -4]} receiveShadow><planeGeometry args={[80, 14]} /><meshStandardMaterial color="#0a0e14" roughness={0.9} /></mesh>
        {PX.map((x, i) => <React.Fragment key={i}><Pedestal x={x} /><LightCone x={x} on={on(i)} color={i === 2 ? "#e8f0ff" : "#ffd6a0"} /><Dust x={x} on={on(i)} seed={i + 1} /></React.Fragment>)}
        <Lumpy x={PX[0]} a={museum ? -99 : T(5.3)} />
        {/* piedra de golpear (percutor) */}
        <mesh castShadow position={[PX[0] + 1.6, 0.68, 0.7]} scale={[0.22, 0.18, 0.2]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#6d6357" roughness={1} flatShading /></mesh>
        <Bricks x={PX[1]} a={museum ? -99 : T(7.5)} />
        {/* cincel de acero */}
        <group position={[PX[1] + 1.6, 0.56, 0.75]} rotation={[0, 0.4, Math.PI / 2]}>
          <mesh castShadow><cylinderGeometry args={[0.05, 0.05, 0.7, 12]} /><meshStandardMaterial color="#b9c2cc" metalness={0.9} roughness={0.25} /></mesh>
        </group>
        <Perfect x={PX[2]} a={museum ? -99 : T(9.22)} on={on(2)} />
        {museum && PX.map((x, i) => <Glass key={i} x={x} o={on(i)} />)}
      </ThreeCanvas>
      {/* rótulos anclados a cada pedestal */}
      {PX.map((x, i) => {
        const q = project(pos, look, fov, V(x, 0.02, 1.35));
        const o = on(i) * (museum ? 0.85 : 1);
        return <div key={i} style={{ position: "absolute", left: q.x - 300, width: 600, top: q.y + 8, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: museum ? 22 : 30, letterSpacing: 5, color: "rgba(244,239,230,.75)", opacity: o, textShadow: "0 2px 10px #000" }}>{labels[i]}</div>;
      })}
      {museum && (() => {
        const a = project(pos, look, fov, V(PX[0] - 1.5, 0.02, 2.6)), b = project(pos, look, fov, V(PX[2] + 1.5, 0.02, 2.6));
        const o = on(1);
        return <div style={{ position: "absolute", left: a.x, top: (a.y + b.y) / 2 + 95, width: b.x - a.x, height: 6, background: "rgba(244,239,230,.45)", opacity: o, transform: `rotate(${Math.atan2(b.y - a.y, b.x - a.x)}rad)`, transformOrigin: "0 50%" }}>
          <div style={{ position: "absolute", right: -18, top: -14, borderLeft: "30px solid rgba(244,239,230,.45)", borderTop: "17px solid transparent", borderBottom: "17px solid transparent" }} />
          <div style={{ position: "absolute", left: 0, top: 22, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.dim, letterSpacing: 3 }}>OLDER · ROUGH</div>
          <div style={{ position: "absolute", right: 0, top: 22, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.dim, letterSpacing: 3 }}>NEWER · PERFECT</div>
        </div>;
      })()}
      {museum && <KeyLine a={s(11.6 - 11.0)} text="every museum on Earth *agrees.*" align="center" y={110} size={50} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// ============ 2. GLOBO: 7 pilares de luz → picada a Perú (termina con Perú en el centro exacto) ============
const D2R = Math.PI / 180;
const onSphere = (lat: number, lon: number, r = 1) => {
  const phi = (lon + 180) * D2R, th = (90 - lat) * D2R;
  return V(-r * Math.cos(phi) * Math.sin(th), r * Math.cos(th), r * Math.sin(phi) * Math.sin(th));
};
const SITES = [[-13.5, -72], [-16.5, -68.7], [34, 36.2], [29.9, 31.1], [37.2, 38.9], [37.7, 22.7], [51.2, -1.8]];
const ATMO_V = `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 p = modelViewMatrix*vec4(position,1.0); vP = p.xyz; gl_Position = projectionMatrix*p; }`;
const ATMO_F = `varying vec3 vN; varying vec3 vP; uniform float uI; void main(){ float f = pow(1.0 - abs(dot(normalize(-vP), vN)), 2.6); gl_FragColor = vec4(vec3(0.35,0.62,1.0)*f*uI, f*uI); }`;
const Pillar: React.FC<{ lat: number; lon: number; t: number; red: number; grow: number }> = ({ lat, lon, t, red, grow }) => {
  const n = onSphere(lat, lon, 1), q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n.clone().normalize());
  const h = 0.13 * t * (1 + grow * 0.5);
  const col = red > 0.5 ? "#ff3b30" : "#ffcf86";
  return (
    <group position={n} quaternion={q}>
      <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.004, 0.012, h + 0.0001, 10]} /><meshBasicMaterial color={col} toneMapped={false} transparent opacity={t} /></mesh>
      <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.008, 0.022, h + 0.0001, 16, 1, true]} /><meshBasicMaterial color={col} transparent opacity={0.22 * t} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <mesh><sphereGeometry args={[0.012 * (1 + grow * 0.6) * t + 0.0001, 16, 12]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}><ringGeometry args={[0.02 + grow * 0.012, 0.028 + grow * 0.016, 40]} /><meshBasicMaterial color={col} transparent opacity={0.7 * t} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};
export const Globe3D: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 12.90
  const T = (t: number) => s(t - 12.9);
  const tex = useTex("sealed02/earth.jpg");
  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry(), n = 1600, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const v = V(rnd(i) - 0.5, rnd(i, 9) - 0.5, rnd(i, 37) - 0.5).normalize().multiplyScalar(60); p.set([v.x, v.y, v.z], i * 3); }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3)); return g;
  }, []);
  // órbita lenta → picada a Perú (dirección primero, distancia después; termina con Perú centrado)
  const dive = e(f, T(13.75), T(14.38));
  const dir = e(f, T(13.6), T(14.2));
  const lat = lerp(14 - f * 0.05, -13.5, dir), lon = lerp(-18 - f * 0.12, -72, dir);
  const dist = Math.exp(lerp(Math.log(3.5), Math.log(1.32), Math.pow(dive, 1.3)));
  const pos = onSphere(lat, lon, dist), look = onSphere(-13.5, -72, 1).multiplyScalar(dir);
  const bg = e(f, 2, 11);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#03060b", opacity: bg }} />
      <AbsoluteFill style={{ opacity: bg }}>
        {tex && <ThreeCanvas width={W} height={H} gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov: 35, position: [0, 0, 4] }}>
          <Cam pos={pos} look={look} fov={35} />
          <points geometry={stars}><pointsMaterial color="#cfd8ff" size={0.1} sizeAttenuation transparent opacity={0.7} /></points>
          <ambientLight intensity={0.12} />
          {/* luz rasante: medio globo en sombra → los pilares brillan en la noche */}
          <directionalLight position={[onSphere(18, -38, 5).x, onSphere(18, -38, 5).y, onSphere(18, -38, 5).z]} intensity={2.4} color="#fff1dc" />
          <mesh><sphereGeometry args={[1, 128, 96]} /><meshStandardMaterial map={tex} roughness={0.95} color="#9aa6b8" /></mesh>
          <mesh scale={1.03}><sphereGeometry args={[1, 96, 64]} /><shaderMaterial key={f} vertexShader={ATMO_V} fragmentShader={ATMO_F} uniforms={{ uI: { value: 1.1 - dive * 0.6 } }} transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
          {SITES.map(([la, lo], i) => {
            const t = e(f, T(12.98) + i * 1.6, T(12.98) + i * 1.6 + 6);
            return <Pillar key={i} lat={la} lon={lo} t={t * (1 - e(f, T(14.05), T(14.3)) * (i === 0 ? 0.6 : 1))} red={e(f, T(13.36), T(13.45))} grow={i === 0 ? e(f, T(14.0), T(14.3)) : 0} />;
          })}
        </ThreeCanvas>}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 160, color: C.red, letterSpacing: 6,
        opacity: e(f, T(13.36), T(13.42)) * (1 - e(f, T(13.95), T(14.15))), transform: `perspective(900px) translateZ(${(1 - e(f, T(13.36), T(13.7))) * 220}px) rotateX(${8 - 8 * e(f, T(13.36), T(13.7))}deg)`,
        textShadow: "0 1px 0 #b0201a, 0 2px 0 #a01c16, 0 3px 0 #901913, 0 4px 0 #801610, 0 5px 0 #70130d, 0 6px 0 #60100a, 0 18px 40px rgba(255,59,48,.45)" }}>SEVEN.</div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// ============ 3. BALANZA 3D: el bloque de Baalbek vs dos jumbos cargados ============
const Jet: React.FC<{ y: number; drop: number }> = ({ y, drop }) => (
  <group position={[0, y + (1 - drop) * 3, 0]} rotation={[0, -0.5, 0]} scale={0.95}>
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.2, 2.6, 8, 20]} /><meshStandardMaterial color="#e9eef3" metalness={0.35} roughness={0.35} /></mesh>
    <mesh castShadow position={[0.1, -0.05, 0]} rotation={[0, 0.35, 0]}><boxGeometry args={[0.6, 0.04, 2.8]} /><meshStandardMaterial color="#c9d2dc" metalness={0.4} roughness={0.4} /></mesh>
    <mesh castShadow position={[-1.35, 0.32, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.45, 0.6, 0.04]} /><meshStandardMaterial color="#c9d2dc" metalness={0.4} roughness={0.4} /></mesh>
    <mesh castShadow position={[-1.35, 0.05, 0]}><boxGeometry args={[0.3, 0.03, 1.0]} /><meshStandardMaterial color="#c9d2dc" /></mesh>
    {[-0.75, 0.75].map((z, i) => <mesh key={i} castShadow position={[0.2, -0.2, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.11, 0.45, 16]} /><meshStandardMaterial color="#7a8a9c" metalness={0.6} roughness={0.3} /></mesh>)}
    <mesh position={[1.42, 0.06, 0]}><sphereGeometry args={[0.13, 16, 12, 0, Math.PI]} /><meshStandardMaterial color="#1e2a38" metalness={0.8} roughness={0.15} /></mesh>
  </group>
);
export const Scale3D: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 27.70
  const T = (t: number) => s(t - 27.7);
  const inn = e(f, 0, 12);
  const j1 = spring({ frame: f - T(28.4), fps: FPS, config: { damping: 13 } }), j2 = spring({ frame: f - T(28.55), fps: FPS, config: { damping: 13 } });
  // primero los jets bajan un poco el brazo; después el bloque gana de golpe
  const ang = interpolate(spring({ frame: f - T(29.7), fps: FPS, config: { damping: 8, mass: 1.3 } }), [0, 1], [0, 9]) - 2.5 * (j1 + j2) / 2 * (1 - e(f, T(29.7), T(29.9)));
  const a = (ang * Math.PI) / 180;
  const k = e(f, 0, s(2.9));
  const pos = V(lerp(3.2, -1.6, k), lerp(2.0, 3.0, k), lerp(10.5, 9.4, k)), look = V(0, 1.6, 0), fov = 36;
  const lbl = project(pos, look, fov, V(-3 * Math.cos(a), 2.08 - 3 * Math.sin(a) + 1.85, 0.8));
  return (
    <AbsoluteFill style={{ opacity: inn }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov, position: [0, 2, 10] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#ffe2b8", "#2a1c14", 0.6]} />
        <directionalLight position={[-6, 9, 6]} intensity={2.8} color="#ffd9a8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0005} />
        <pointLight position={[5, 3, 4]} intensity={18} color="#9fc4ff" distance={20} />
        {/* atrapa-sombras: el piso no se ve, sólo la sombra sobre la foto */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><shadowMaterial opacity={0.45} /></mesh>
        {/* fulcro */}
        <mesh castShadow receiveShadow position={[0, 1, 0]}><coneGeometry args={[0.75, 2, 4]} /><meshStandardMaterial color="#3a2a1e" roughness={0.7} /></mesh>
        <group position={[0, 2.08, 0]} rotation={[0, 0, a]}>
          <mesh castShadow receiveShadow><boxGeometry args={[9, 0.16, 0.9]} /><meshStandardMaterial color="#a5713f" roughness={0.6} /></mesh>
          <mesh castShadow receiveShadow position={[-3, 0.8, 0]}><boxGeometry args={[2.6, 1.45, 1.6]} /><meshStandardMaterial color="#b98a58" roughness={0.95} /></mesh>
          <group position={[3.1, 0.35, 0]}><Jet y={0} drop={j1} /><Jet y={0.62} drop={j2} /></group>
        </group>
      </ThreeCanvas>
      <div style={{ position: "absolute", left: lbl.x - 250, width: 500, top: lbl.y - 30, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff4e6", textShadow: "0 3px 0 #6a4a2a, 0 6px 18px rgba(0,0,0,.7)" }}>~1,000 TONS</div>
      <KeyLine a={T(28.3)} text="two fully loaded *jumbo* jets" align="center" y={900} size={52} />
    </AbsoluteFill>
  );
};

// ============ 4. DIORAMA: la cuadrilla arrastra el bloque… y dos tipos mueven un sillón igual ============
const Guy: React.FC<{ x: number; z?: number; f: number; i: number; lean?: number; flip?: boolean }> = ({ x, z = 0, f, i, lean = 0.25, flip }) => {
  const st = Math.sin(f / 5 + i * 1.3);
  return (
    <group position={[x, Math.abs(st) * 0.05, z]} rotation={[0, flip ? Math.PI : 0, (flip ? -1 : 1) * -lean]}>
      <mesh castShadow position={[0, 0.85, 0]}><capsuleGeometry args={[0.2, 0.75, 6, 14]} /><meshStandardMaterial color="#5a3424" roughness={0.9} /></mesh>
      <mesh castShadow position={[0.05, 1.55, 0]}><sphereGeometry args={[0.17, 16, 12]} /><meshStandardMaterial color="#3a2218" roughness={0.9} /></mesh>
      {[-1, 1].map((sg) => <mesh key={sg} castShadow position={[sg * st * 0.12, 0.3, sg * 0.1]} rotation={[0, 0, sg * st * 0.35]}><capsuleGeometry args={[0.07, 0.45, 4, 8]} /><meshStandardMaterial color="#3a2218" /></mesh>)}
    </group>
  );
};
export const Diorama3D: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 51.90
  const T = (t: number) => s(t - 51.9);
  const go = f * 0.018;
  const tr = e(f, T(52.15), T(53.5));
  const camX = lerp(-1, 12.5, tr);
  const pos = V(camX - 2.5, lerp(3.4, 2.6, tr), 9.5 - Math.sin(Math.PI * tr) * 1.5), look = V(camX + 0.5, 1.0, 0), fov = 34;
  const ropeLen = 7.5;
  const couchX = 13 + go;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#2b1d3a 0%,#7a3b3a 40%,#e0874a 70%,#f2b46a 100%)" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} camera={{ fov, position: [0, 3, 10] }}>
        <Cam pos={pos} look={look} fov={fov} />
        <fog attach="fog" args={["#d98a52", 14, 40]} />
        <ambientLight intensity={0.35} color="#ffd2a8" />
        <hemisphereLight args={["#ffb27a", "#3a2216", 0.6]} />
        {/* sol bajo → sombras largas */}
        <directionalLight position={[14, 4.5, 12]} intensity={3.4} color="#ffb070" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-20} shadow-camera-right={30} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.0006} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[6, 0, 0]}><planeGeometry args={[90, 60, 1, 1]} /><meshStandardMaterial color="#c9935c" roughness={1} /></mesh>
        {/* dunas de fondo */}
        {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-8 + i * 9, -1.8, -12 - rnd(i) * 6]} scale={[6 + rnd(i, 2) * 4, 3, 3]}><sphereGeometry args={[1, 24, 12]} /><meshStandardMaterial color="#b97c4c" roughness={1} /></mesh>)}
        {/* bloque sobre trineo */}
        <group position={[-2.5 + go, 0, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.15, 0]}><boxGeometry args={[3.4, 0.3, 1.8]} /><meshStandardMaterial color="#5a3a22" roughness={0.9} /></mesh>
          <mesh castShadow receiveShadow position={[0, 1.25, 0]}><boxGeometry args={[3, 1.9, 1.6]} /><meshStandardMaterial color="#b98d5c" roughness={0.95} flatShading /></mesh>
          <mesh position={[1.5 + ropeLen / 2, 0.75, 0]} rotation={[0, 0, Math.PI / 2 - 0.08]}><cylinderGeometry args={[0.025, 0.025, ropeLen, 6]} /><meshStandardMaterial color="#c9a46a" /></mesh>
          {Array.from({ length: 7 }).map((_, i) => <Guy key={i} x={2.4 + i * 1.0} z={(i % 2 ? 0.25 : -0.25)} f={f} i={i} />)}
        </group>
        {/* el chiste: el sillón, mismo método */}
        <group position={[couchX, 0, 0.3]}>
          <group position={[0, 0.75 + Math.abs(Math.sin(f / 5)) * 0.05, 0]}>
            <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[2.2, 0.45, 0.9]} /><meshStandardMaterial color="#3f6fa8" roughness={0.8} /></mesh>
            <mesh castShadow position={[0, 0.45, -0.32]}><boxGeometry args={[2.2, 0.55, 0.26]} /><meshStandardMaterial color="#4b80bf" roughness={0.8} /></mesh>
            {[-1.15, 1.15].map((x) => <mesh key={x} castShadow position={[x, 0.18, 0]}><boxGeometry args={[0.24, 0.6, 0.9]} /><meshStandardMaterial color="#365f92" roughness={0.8} /></mesh>)}
          </group>
          <Guy x={-1.6} f={f} i={1} lean={-0.15} flip />
          <Guy x={1.6} f={f} i={4} lean={0.1} />
        </group>
      </ThreeCanvas>
      <KeyLine a={T(54.6)} text="how most of us move a *couch.*" align="center" y={130} size={54} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(30,10,10,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
