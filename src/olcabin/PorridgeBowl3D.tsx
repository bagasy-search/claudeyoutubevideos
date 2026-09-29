// PorridgeBowl3D — el tazón de rømmegrøt en 3D real (three.js), cámara cenital que baja: crema espesa → pozo en el
// medio → la manteca dorada llena el pozo (chorro que cae) → canela y azúcar espolvoreadas. `stages` por props (sin texto).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { rnd } from "./OleTheme";

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};
type Stage = "cream" | "well" | "butter" | "cinnamon";
const ORDER: Stage[] = ["cream", "well", "butter", "cinnamon"];

export const PorridgeBowl3D: React.FC<{ stages?: { at: number; stage: Stage }[]; bg?: string }> = ({ stages = [{ at: 0, stage: "cream" }, { at: 3, stage: "butter" }, { at: 5.5, stage: "cinnamon" }], bg = "#5B3F26" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  let cur = 0;
  stages.forEach((s) => { if (t >= s.at) { cur = ORDER.indexOf(s.stage); } });
  const tOf = (name: Stage) => { const s = stages.find((x) => x.stage === name); return s ? t - s.at : -1; };
  const wellP = cur >= 1 ? 1 : 0;                       // hay pozo desde "well" (o desde "butter", que lo trae)
  const butterT = tOf("butter");
  const butter = interpolate(butterT, [0, 2.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cinT = tOf("cinnamon");
  const camY = interpolate(t, [0, 14], [6.4, 4.0], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const camZ = interpolate(t, [0, 14], [1.1, 1.5], { extrapolateRight: "clamp" });
  const dots = React.useMemo(() => Array.from({ length: 260 }).map((_, i) => ({ a: rnd(i * 3 + 1) * Math.PI * 2, r: Math.sqrt(rnd(i * 3 + 2)) * 1.32, d: rnd(i * 3 + 3), s: 0.02 + rnd(i * 7) * 0.03 })), []);
  const prof = React.useMemo(() => [new THREE.Vector2(0.01, 0), new THREE.Vector2(0.9, 0.02), new THREE.Vector2(1.5, 0.45), new THREE.Vector2(1.72, 0.85), new THREE.Vector2(1.7, 0.9), new THREE.Vector2(1.6, 0.86), new THREE.Vector2(1.4, 0.5), new THREE.Vector2(0.85, 0.09), new THREE.Vector2(0.01, 0.07)], []);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 38, position: [0, camY, camZ], near: 0.1, far: 30 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={[0, camY, camZ]} target={[0, 0.5, 0]} />
        <color attach="background" args={[bg]} />
        <hemisphereLight args={["#FFE8C4", "#5B3F26", 0.8]} />
        <directionalLight position={[-2, 5, 3]} intensity={2.4} color="#FFE2B0" castShadow />
        <pointLight position={[2.6, 2, 1]} intensity={14} color="#FF9B3D" distance={9} />
        {/* mesa de pino */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><planeGeometry args={[16, 16]} /><meshStandardMaterial color="#A67C4B" roughness={0.95} /></mesh>
        {Array.from({ length: 9 }).map((_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, -4 + i * 1]}><planeGeometry args={[16, 0.03]} /><meshStandardMaterial color="#5B3F26" /></mesh>)}
        {/* tazón enlozado azul */}
        <mesh castShadow receiveShadow><latheGeometry args={[prof, 48]} /><meshStandardMaterial color="#2F5D8A" roughness={0.3} metalness={0.15} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.885, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.66, 0.045, 8, 48]} /><meshStandardMaterial color="#E9EEF3" roughness={0.35} /></mesh>
        {/* crema espesa */}
        <mesh position={[0, 0.72, 0]} receiveShadow><cylinderGeometry args={[1.5, 1.42, 0.06, 48]} /><meshStandardMaterial color="#F4EEDC" roughness={0.5} /></mesh>
        <mesh position={[0, 0.76, 0]} scale={[1, 0.05, 1]}><sphereGeometry args={[1.48, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#F7F1E0" roughness={0.42} /></mesh>
        {/* pozo en el centro */}
        {wellP > 0 && <mesh position={[0, 0.79, 0]}><cylinderGeometry args={[0.55, 0.45, 0.06, 32]} /><meshStandardMaterial color="#D9CCA8" roughness={0.6} /></mesh>}
        {/* manteca dorada que llena el pozo */}
        {butter > 0 && <mesh position={[0, 0.83, 0]} scale={[butter, 1, butter]}><cylinderGeometry args={[0.5, 0.48, 0.05, 32]} /><meshStandardMaterial color="#E9B430" roughness={0.18} metalness={0.05} emissive="#8A5A00" emissiveIntensity={0.25} /></mesh>}
        {/* chorro de manteca desde una cuchara */}
        {butterT > -0.01 && butterT < 2.4 && <group position={[0.35, 0, 0]}>
          <mesh position={[0.55, 2.1, -0.15]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.9, 0.06, 0.28]} /><meshStandardMaterial color="#B0B5BA" metalness={0.8} roughness={0.3} /></mesh>
          <mesh position={[0.02, 1.45, 0]}><cylinderGeometry args={[0.045, 0.06, 1.3, 10]} /><meshStandardMaterial color="#E9B430" emissive="#8A5A00" emissiveIntensity={0.3} /></mesh>
        </group>}
        {/* canela y azúcar cayendo y asentándose */}
        {cinT > 0 && dots.map((p, i) => {
          const life = Math.min(1, Math.max(0, (cinT - p.d * 1.6) / 0.9)); if (life <= 0) return null;
          const y = 0.86 + (1 - life) * 1.6;
          return <mesh key={i} position={[Math.cos(p.a) * p.r, y, Math.sin(p.a) * p.r]}><sphereGeometry args={[p.s, 5, 4]} /><meshStandardMaterial color={i % 4 === 0 ? "#F4E3C2" : "#8A4B1F"} roughness={1} /></mesh>;
        })}
        {/* vapor */}
        {[0, 1, 2, 3, 4].map((q) => { const ph = ((t * 0.3 + q / 5) % 1); return <mesh key={q} position={[Math.sin(q * 2.1) * 0.7, 1.0 + ph * 1.1, Math.cos(q * 1.7) * 0.6]} scale={[1 + ph * 2, 1 + ph * 2, 1 + ph * 2]}><sphereGeometry args={[0.16, 8, 6]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.16 * (1 - ph)} depthWrite={false} /></mesh>; })}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
