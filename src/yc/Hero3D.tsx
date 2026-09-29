// Hero3D — escenas 3D "de película" para explicar un objeto:
//   Projector3D  → proyector de 16 mm con rollos girando, haz volumétrico con polvo, y el metraje REAL en la pantalla
//   LawnDart3D   → un dardo de jardín en cámara lenta: arco en el aire y se clava dentro del aro, cámara al ras del pasto
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Media } from "./Media";
import { SERIF, TYPE, SANS, YC, clamp, ease, easeInOut, rnd } from "./theme";

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov?: number }> = ({ pos, look, fov = 35 }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  return null;
};
let _glow: THREE.Texture | null = null;
const glow = () => {
  if (_glow) return _glow;
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,245,220,1)"); gr.addColorStop(1, "rgba(255,220,160,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow;
};

// ─── rollo de película ───────────────────────────────────────────────────────
const Reel: React.FC<{ r: number; rot: number }> = ({ r, rot }) => (
  <group rotation={[0, 0, rot]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r * 0.72, r * 0.72, 0.16, 40]} /><meshStandardMaterial color="#1E1A16" roughness={0.6} /></mesh>
    {[-0.09, 0.09].map((z, k) => (
      <group key={k} position={[0, 0, z]}>
        <mesh><torusGeometry args={[r, 0.035, 8, 48]} /><meshStandardMaterial color="#B9BCC2" metalness={0.9} roughness={0.25} /></mesh>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]} position={[0, 0, 0]}>
            <boxGeometry args={[0.07, r * 2, 0.02]} /><meshStandardMaterial color="#AEB2B8" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <mesh><cylinderGeometry args={[0.12, 0.12, 0.05, 16]} /><meshStandardMaterial color="#8C9096" metalness={1} roughness={0.2} /></mesh>
      </group>
    ))}
  </group>
);

export const Projector3D: React.FC<{ screen: string; screenStart?: number; bed?: string; caption?: string }> = ({ screen, screenStart, bed, caption }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const t = clamp(f / D);
  const on = ease(clamp((f - 18) / 10));            // la lámpara se enciende
  const rot = -f * 0.09 * (0.3 + on * 0.7);
  const a = -0.55 + t * 0.35;
  const pos = new THREE.Vector3(Math.sin(a) * 5.4, 1.5 - t * 0.3, Math.cos(a) * 5.4);
  const dust = useMemo(() => Array.from({ length: 140 }, (_, i) => ({ u: rnd(i), v: rnd(i + 3) - 0.5, w: rnd(i + 7) - 0.5, s: 0.5 + rnd(i + 11) })), []);
  const flick = 0.85 + 0.15 * rnd(Math.floor(f / 2));
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 10)) / 10));
  return (
    <AbsoluteFill style={{ background: "#07060A", opacity: fade }}>
      {bed ? <AbsoluteFill style={{ filter: "blur(14px) brightness(0.22) saturate(0.6)" }}><Media src={bed} kb="none" /></AbsoluteFill> : null}
      {/* pantalla con el metraje real, en perspectiva */}
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: 980, top: 170, width: 860, height: 560, transform: `rotateY(-24deg) translateZ(${-t * 60}px)`, transformOrigin: "0% 50%",
          background: "#EDE6D6", boxShadow: `0 0 ${140 * on}px rgba(255,236,190,${0.35 * on})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 16, overflow: "hidden", opacity: on, filter: `brightness(${flick}) sepia(0.25) contrast(1.05)` }}>
            <Media src={screen} start={screenStart} kb="none" />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill>
        <ThreeCanvas width={width} height={height} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} camera={{ fov: 35, position: [0, 1.5, 5.4] }}>
          <Cam pos={pos} look={new THREE.Vector3(0.3, 0.35, 0)} />
          <ambientLight intensity={0.35} color="#9FB0D0" />
          <pointLight position={[-2, 3, 3]} intensity={30} color="#FFD9A8" />
          <pointLight position={[2.5, 0.8, 0.2]} intensity={12 * on} color="#FFF0C8" />
          {/* mesa */}
          <mesh position={[0, -0.62, 0]}><boxGeometry args={[4.2, 0.12, 2.2]} /><meshStandardMaterial color="#4A3222" roughness={0.8} /></mesh>
          {/* cuerpo */}
          <mesh position={[0, 0, 0]}><boxGeometry args={[1.5, 1.0, 0.9]} /><meshStandardMaterial color="#5B5E57" metalness={0.5} roughness={0.45} /></mesh>
          <mesh position={[0, -0.45, 0]}><boxGeometry args={[1.7, 0.12, 1.0]} /><meshStandardMaterial color="#2E302C" metalness={0.4} roughness={0.5} /></mesh>
          {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.5 + i * 0.2, 0.1, 0.455]}><boxGeometry args={[0.08, 0.5, 0.01]} /><meshStandardMaterial color="#222" /></mesh>)}
          {/* brazos + rollos */}
          <mesh position={[-0.45, 0.9, 0]} rotation={[0, 0, 0.35]}><boxGeometry args={[0.08, 1.0, 0.08]} /><meshStandardMaterial color="#3C3E3A" metalness={0.6} /></mesh>
          <mesh position={[0.5, 0.9, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.08, 1.0, 0.08]} /><meshStandardMaterial color="#3C3E3A" metalness={0.6} /></mesh>
          <group position={[-0.72, 1.35, 0]}><Reel r={0.62} rot={rot} /></group>
          <group position={[0.78, 1.35, 0]}><Reel r={0.52} rot={rot * 1.2} /></group>
          {/* lente */}
          <mesh position={[0.95, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.16, 0.2, 0.5, 24]} /><meshStandardMaterial color="#151515" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[1.21, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><circleGeometry args={[0.14, 24]} /><meshBasicMaterial color={on > 0.1 ? "#FFF6DA" : "#333"} toneMapped={false} side={THREE.DoubleSide} /></mesh>
          {/* haz volumétrico */}
          <mesh position={[3.2, 0.2, -0.4]} rotation={[0, 0.2, Math.PI / 2]}>
            <coneGeometry args={[1.25, 4.0, 40, 1, true]} />
            <meshBasicMaterial color="#FFE9B8" transparent opacity={0.13 * on} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[3.2, 0.2, -0.4]} rotation={[0, 0.2, Math.PI / 2]}>
            <coneGeometry args={[0.8, 4.0, 40, 1, true]} />
            <meshBasicMaterial color="#FFF3D6" transparent opacity={0.1 * on} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
          {dust.map((d, i) => {
            const u = (d.u + f * 0.0025 * d.s) % 1;
            const x = 1.3 + u * 4.0, rr = u * 1.05;
            return <sprite key={i} position={[x, 0.2 + d.v * rr * 1.6 + Math.sin(f / 40 + i) * 0.03, -0.4 - u * 0.8 + d.w * rr * 1.6]} scale={[0.035, 0.035, 1]}>
              <spriteMaterial map={glow()} transparent opacity={0.7 * on} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>;
          })}
          <sprite position={[1.25, 0.05, 0]} scale={[0.9 * on, 0.9 * on, 1]}><spriteMaterial map={glow()} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />
      {caption ? <div style={{ position: "absolute", left: 100, bottom: 90, fontFamily: TYPE, fontSize: 50, color: YC.paper, textShadow: "0 3px 16px rgba(0,0,0,0.9)", opacity: ease((f - 26) / 14) }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};

// ─── dardo de jardín ────────────────────────────────────────────────────────
const Dart: React.FC = () => (
  <group>
    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 1.3, 16]} /><meshStandardMaterial color="#C8102E" roughness={0.4} /></mesh>
    <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.07, 0.35, 16]} /><meshStandardMaterial color="#D9DDE2" metalness={1} roughness={0.15} /></mesh>
    <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.07, 0.25, 16]} /><meshStandardMaterial color="#B8BCC2" metalness={0.9} roughness={0.25} /></mesh>
    {[0, 1, 2].map((k) => (
      <mesh key={k} position={[0, 0, -0.5]} rotation={[0, 0, (k / 3) * Math.PI * 2]}>
        <boxGeometry args={[0.02, 0.5, 0.42]} /><meshStandardMaterial color={k === 0 ? "#F2B705" : "#E8E1CF"} roughness={0.5} />
      </mesh>
    ))}
  </group>
);

export const LawnDart3D: React.FC<{ caption?: string }> = ({ caption }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const flyT = clamp(f / (D * 0.62));            // vuelo en cámara lenta
  const land = clamp((f - D * 0.62) / 12);
  const p = easeInOut(flyT);
  const start = new THREE.Vector3(-7, 0.6, 2), end = new THREE.Vector3(1.2, 0.55, -0.4);
  const x = THREE.MathUtils.lerp(start.x, end.x, p), z = THREE.MathUtils.lerp(start.z, end.z, p);
  const y = THREE.MathUtils.lerp(start.y, end.y, p) + Math.sin(p * Math.PI) * 4.2;
  const vy = Math.cos(p * Math.PI) * 4.2 * Math.PI + (end.y - start.y);
  const shake = land > 0 && land < 1 ? Math.sin(land * 30) * (1 - land) * 0.06 : 0;
  const camA = -0.3 + p * 0.5;
  const camTarget = new THREE.Vector3(x * 0.6 + end.x * 0.4, Math.max(0.3, y * 0.55), z);
  const camPos = new THREE.Vector3(end.x - 5.5 * Math.cos(camA), 0.55 + (1 - land) * 0.4, end.z + 5.5 * Math.sin(camA) + 2);
  const blades = useMemo(() => Array.from({ length: 900 }, (_, i) => ({ x: (rnd(i) - 0.5) * 30, z: (rnd(i + 5) - 0.5) * 30, h: 0.1 + rnd(i + 9) * 0.22, r: rnd(i + 13) * 3, c: rnd(i + 17) })), []);
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 10)) / 10));
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#9CC2E0" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 32, position: [0, 1, 6] }}>
        <Cam pos={camPos} look={camTarget} fov={32} />
        <color attach="background" args={["#A9CBE6"]} />
        <fog attach="fog" args={["#CFE0EA", 8, 34]} />
        <hemisphereLight args={["#FFF3DC", "#4E6B34", 1.1]} />
        <directionalLight position={[6, 8, 4]} intensity={2.2} color="#FFE6B8" />
        <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[80, 80]} /><meshLambertMaterial color="#5E8A3E" /></mesh>
        {blades.map((b, i) => (
          <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.r, (b.c - 0.5) * 0.3]}><planeGeometry args={[0.035, b.h]} /><meshLambertMaterial color={b.c > 0.5 ? "#6E9A48" : "#4F7A34"} side={THREE.DoubleSide} /></mesh>
        ))}
        {/* aro objetivo */}
        <mesh position={[end.x, 0.03, end.z]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.75, 0.05, 10, 48]} /><meshStandardMaterial color="#F2B705" roughness={0.4} /></mesh>
        {/* cerco y casa al fondo */}
        {Array.from({ length: 40 }, (_, i) => <mesh key={"fp" + i} position={[-10 + i * 0.5, 0.5, -7]}><boxGeometry args={[0.12, 1.0, 0.05]} /><meshLambertMaterial color="#F2EEE4" /></mesh>)}
        <mesh position={[0, 0.8, -7]}><boxGeometry args={[20, 0.08, 0.04]} /><meshLambertMaterial color="#F2EEE4" /></mesh>
        <mesh position={[4, 2, -12]}><boxGeometry args={[7, 4, 4]} /><meshLambertMaterial color="#D9C9A8" /></mesh>
        <mesh position={[4, 4.8, -12]} rotation={[0, Math.PI / 4, 0]} scale={[5.2, 1.8, 3.2]}><coneGeometry args={[1, 1, 4]} /><meshLambertMaterial color="#6B4A3A" /></mesh>
        <group position={[x, y, z]} rotation={[0, Math.atan2(end.x - start.x, end.z - start.z), 0]}>
          <group rotation={[land >= 1 ? 1.05 + shake : -Math.atan2(vy, 8.54) + shake, 0, 0]}><Dart /></group>
        </group>
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,210,150,0.12), rgba(0,0,0,0) 50%)", mixBlendMode: "screen" }} />
      {caption ? <div style={{ position: "absolute", left: 100, bottom: 90, fontFamily: TYPE, fontSize: 50, color: YC.paper, textShadow: "0 3px 16px rgba(0,0,0,0.9)", opacity: ease((f - 20) / 14) }}>{caption}</div> : null}
      {void interpolate}
    </AbsoluteFill>
  );
};
