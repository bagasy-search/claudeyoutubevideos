// BooyahKettle3D — el caldero gigante de booyah (three.js real) sobre el fuego del picnic de iglesia: humo, pala de madera
// que revuelve, chispas, y una fila de tazones que se van llenando en la mesa (el pueblo que aparece). Sin texto.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { rnd } from "./OleTheme";

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};

export const BooyahKettle3D: React.FC<{ bowls?: number; bg?: string; pours?: { at: number }[] }> = ({ bowls = 16, bg = "#2A3B2F" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const flick = 1 + Math.sin(frame * 0.8) * 0.06 + Math.sin(frame * 0.31) * 0.05;
  const ang = -0.5 + t * 0.05;
  const R = interpolate(t, [0, 12], [8.2, 5.6], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const camPos: [number, number, number] = [Math.sin(ang) * R, interpolate(t, [0, 12], [3.6, 2.5], { extrapolateRight: "clamp" }), Math.cos(ang) * R];
  const nB = Math.floor(interpolate(t, [3, 13], [0, bowls], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const paddle = t * 1.6;
  const flames = React.useMemo(() => Array.from({ length: 9 }).map((_, i) => ({ a: (i / 9) * Math.PI * 2, r: 0.7 + rnd(i) * 0.55, h: 0.6 + rnd(i + 5) * 0.7 })), []);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 36, position: camPos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={camPos} target={[0, 1.3, 0]} />
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 16, 34]} />
        <hemisphereLight args={["#DCE8F5", "#5B4630", 1.6]} />
        <directionalLight position={[-5, 8, 4]} intensity={3.0} color="#FFF0D8" castShadow />
        <pointLight position={[0, 0.8, 0]} intensity={70 * flick} color="#FF7A2B" distance={12} decay={2} castShadow />
        {/* pasto / estacionamiento de tierra */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><circleGeometry args={[18, 48]} /><meshStandardMaterial color="#7D8B5E" roughness={1} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><circleGeometry args={[2.4, 32]} /><meshStandardMaterial color="#3A2E22" roughness={1} /></mesh>
        {/* trébedes + leños */}
        {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * 1.57) * 1.15, 0.5, Math.sin(i * 1.57) * 1.15]} castShadow><boxGeometry args={[0.16, 1.0, 0.16]} /><meshStandardMaterial color="#1F1B17" metalness={0.4} roughness={0.6} /></mesh>)}
        {Array.from({ length: 7 }).map((_, i) => <mesh key={"l" + i} position={[Math.cos(i * 0.9) * 0.5, 0.12, Math.sin(i * 0.9) * 0.5]} rotation={[Math.PI / 2, 0, i * 0.9]}><cylinderGeometry args={[0.09, 0.09, 1.2, 8]} /><meshStandardMaterial color="#3A2416" roughness={1} /></mesh>)}
        {flames.map((f, i) => <mesh key={"f" + i} position={[Math.cos(f.a + t * 0.3) * f.r * 0.7, 0.25 + f.h * 0.3 * flick, Math.sin(f.a + t * 0.3) * f.r * 0.7]} scale={[1.7, f.h * flick * 1.6, 1.7]}><coneGeometry args={[0.16, 0.7, 8]} /><meshStandardMaterial color={i % 2 ? "#FF8A2B" : "#FFC24A"} emissive={i % 2 ? "#FF5A10" : "#FFA020"} emissiveIntensity={2.2} transparent opacity={0.9} /></mesh>)}
        {/* el caldero de 50 galones */}
        <mesh position={[0, 1.55, 0]} castShadow><cylinderGeometry args={[1.35, 1.0, 1.25, 40, 1, true]} /><meshStandardMaterial color="#3A3A3D" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.95, 0]}><sphereGeometry args={[1.0, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#3A3A3D" metalness={0.5} roughness={0.5} /></mesh>
        <mesh position={[0, 2.17, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.35, 0.06, 8, 48]} /><meshStandardMaterial color="#202020" metalness={0.7} roughness={0.35} /></mesh>
        <mesh position={[0, 2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.31, 40]} /><meshStandardMaterial color="#8A4B22" roughness={0.35} emissive="#3A1A08" emissiveIntensity={0.4} /></mesh>
        {/* asas */}
        {[-1, 1].map((s) => <mesh key={s} position={[s * 1.4, 1.9, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.16, 0.035, 6, 14]} /><meshStandardMaterial color="#202020" metalness={0.7} /></mesh>)}
        {/* pala de madera revolviendo */}
        <group position={[Math.cos(paddle) * 0.45, 2.0, Math.sin(paddle) * 0.45]} rotation={[Math.sin(paddle) * 0.12, 0, -Math.cos(paddle) * 0.12]}>
          <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.055, 0.055, 2.4, 8]} /><meshStandardMaterial color="#9A6F3F" roughness={0.9} /></mesh>
          <mesh position={[0, -0.25, 0]}><boxGeometry args={[0.5, 0.5, 0.05]} /><meshStandardMaterial color="#9A6F3F" roughness={0.9} /></mesh>
        </group>
        {/* vapor y humo */}
        {Array.from({ length: 10 }).map((_, q) => { const ph = ((t * 0.32 + q / 10) % 1); return <mesh key={"s" + q} position={[Math.sin(q * 2.3) * 0.8, 2.2 + ph * 3.2, Math.cos(q * 1.9) * 0.8]} scale={[1 + ph * 2.4, 1 + ph * 2.4, 1 + ph * 2.4]}><sphereGeometry args={[0.32, 8, 6]} /><meshBasicMaterial color="#E4E4E0" transparent opacity={0.22 * (1 - ph)} depthWrite={false} /></mesh>; })}
        {/* mesa larga de picnic con tazones que se llenan */}
        <mesh position={[0, 0.78, 4.2]} castShadow><boxGeometry args={[9, 0.1, 1.5]} /><meshStandardMaterial color="#B98C5A" roughness={0.9} /></mesh>
        {[-4, -1.3, 1.3, 4].map((x) => <mesh key={x} position={[x, 0.38, 4.2]}><boxGeometry args={[0.12, 0.78, 1.3]} /><meshStandardMaterial color="#6B4A2C" /></mesh>)}
        {Array.from({ length: bowls }).map((_, i) => {
          if (i >= nB) return null;
          const p = interpolate(t - (3 + i * (10 / bowls)), [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8)) });
          const x = -3.9 + (i % 8) * 1.12, z = 3.85 + Math.floor(i / 8) * 0.7;
          return (
            <group key={i} position={[x, 0.85, z]} scale={[p, p, p]}>
              <mesh castShadow><cylinderGeometry args={[0.24, 0.16, 0.16, 16]} /><meshStandardMaterial color={i % 2 ? "#2F5D8A" : "#E9EEF3"} roughness={0.35} /></mesh>
              <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.21, 0.21, 0.04, 16]} /><meshStandardMaterial color="#B5651D" roughness={0.6} /></mesh>
            </group>
          );
        })}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
