// CabinCutaway3D — la cabaña de la abuela en CORTE (three.js real): paredes de troncos, estufa de leña con caño,
// vigas, mesa larga con bancos y un estante. Los platos "se llenan" (aparecen con rebote suave) según `fill`:
// [{at: segundos, n: cuántos platos hay}]. Cámara en órbita lenta. Sin texto quemado: todo por props.
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { OLE, rnd } from "./OleTheme";

const FOOD = ["#C9893F", "#E7D9B0", "#8E2B2B", "#5B3A22", "#D9A441", "#F0E6CF", "#A4552B", "#7A8F4B", "#E2B96B", "#B5651D"];

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number]; fov: number }> = ({ pos, target, fov }) => {
  const { camera } = useThree();
  (camera as any).fov = fov;
  camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};

// posiciones de los 25 platos: 2 filas x 10 en la mesa + 5 en el estante
const SLOTS: [number, number, number][] = (() => {
  const a: [number, number, number][] = [];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 10; i++) a.push([-1.62 + i * 0.36, 0.86, -0.28 + r * 0.56]);
  for (let i = 0; i < 5; i++) a.push([-1.0 + i * 0.5, 1.42, -2.02]);
  return a;
})();
// orden de aparición: mezcla determinista (no de izquierda a derecha, se siente "llenarse")
const ORDER = SLOTS.map((_, i) => i).sort((a, b) => rnd(a * 7 + 3) - rnd(b * 7 + 3));

const Log: React.FC<{ p: [number, number, number]; len: number; axis: "x" | "z"; r?: number; c?: string }> = ({ p, len, axis, r = 0.17, c = "#6B4A2C" }) => (
  <mesh position={p} rotation={axis === "x" ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]} castShadow receiveShadow>
    <cylinderGeometry args={[r, r, len, 10]} /><meshStandardMaterial color={c} roughness={0.92} />
  </mesh>
);

export const CabinCutaway3D: React.FC<{
  fill?: { at: number; n: number }[]; orbit?: number; startAngle?: number; fov?: number; bg?: string; lantern?: number;
}> = ({ fill = [{ at: 0.5, n: 0 }, { at: 9, n: 25 }], orbit = 0.22, startAngle = -0.35, fov = 38, bg = "#2B1E14", lantern = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  // n(t) interpolado entre keyframes
  const n = interpolate(t, fill.map(f => f.at), fill.map(f => f.n), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const ang = startAngle + t * orbit * 0.18;
  const R = 8.2;
  const camPos: [number, number, number] = [Math.sin(ang) * R, 3.7 - Math.min(0.5, t * 0.03), Math.cos(ang) * R];
  const plates = useMemo(() => SLOTS.map((s, i) => ({ s, rank: ORDER.indexOf(i), c: FOOD[Math.floor(rnd(i + 21) * FOOD.length)], big: rnd(i + 5) > 0.55 })), []);
  const logsBack = Array.from({ length: 9 }).map((_, i) => 0.18 + i * 0.3);
  const flick = 1 + Math.sin(frame * 0.7) * 0.05 + Math.sin(frame * 0.23) * 0.05;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov, position: camPos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={camPos} target={[0, 1.2, -0.3]} fov={fov} />
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 14, 30]} />
        <hemisphereLight args={["#E8C9A0", "#3A2A1C", 0.55]} />
        <pointLight position={[0.2, 2.6, 0.2]} intensity={lantern * 22 * flick} color="#FFC46B" distance={11} decay={2} castShadow />
        <pointLight position={[2.5, 0.9, -1.9]} intensity={10 * flick} color="#FF7A2B" distance={5} decay={2} />
        <directionalLight position={[-4, 6, 6]} intensity={0.7} color="#FFE7C4" />
        {/* suelo de tablones */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[0, -0.05, -2.3 + i * 0.4]} receiveShadow><boxGeometry args={[6.4, 0.1, 0.38]} /><meshStandardMaterial color={i % 2 ? "#7A5A38" : "#6C4E30"} roughness={0.95} /></mesh>
        ))}
        {/* paredes de troncos: fondo, izquierda, derecha (el frente queda abierto = corte) */}
        {logsBack.map((y, i) => <Log key={"b" + i} p={[0, y, -2.4]} len={6.6} axis="x" c={i % 2 ? "#6B4A2C" : "#5E4127"} />)}
        {logsBack.map((y, i) => <Log key={"l" + i} p={[-3.2, y, 0]} len={4.9} axis="z" c={i % 2 ? "#6B4A2C" : "#5E4127"} />)}
        {logsBack.map((y, i) => <Log key={"r" + i} p={[3.2, y, 0]} len={4.9} axis="z" c={i % 2 ? "#5E4127" : "#6B4A2C"} />)}
        {/* techo: vigas y cumbrera */}
        {Array.from({ length: 5 }).map((_, i) => (
          <React.Fragment key={i}>
            <mesh position={[-1.7, 3.35, -2.2 + i * 1.1]} rotation={[0, 0, 0.6]}><boxGeometry args={[3.8, 0.1, 0.12]} /><meshStandardMaterial color="#4B331E" roughness={0.9} /></mesh>
            <mesh position={[1.7, 3.35, -2.2 + i * 1.1]} rotation={[0, 0, -0.6]}><boxGeometry args={[3.8, 0.1, 0.12]} /><meshStandardMaterial color="#4B331E" roughness={0.9} /></mesh>
          </React.Fragment>
        ))}
        <mesh position={[0, 4.4, 0]}><boxGeometry args={[0.14, 0.14, 5]} /><meshStandardMaterial color="#4B331E" /></mesh>
        {/* estufa de leña */}
        <group position={[2.35, 0, -1.7]}>
          <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[1.1, 1.0, 0.8]} /><meshStandardMaterial color="#1B1A18" roughness={0.5} metalness={0.5} /></mesh>
          <mesh position={[0, 0.5, 0.41]}><boxGeometry args={[0.42, 0.3, 0.02]} /><meshStandardMaterial color="#FF8A2B" emissive="#FF6A10" emissiveIntensity={1.6 * flick} /></mesh>
          <mesh position={[0, 2.3, 0]}><cylinderGeometry args={[0.08, 0.08, 3.4, 12]} /><meshStandardMaterial color="#22201D" metalness={0.5} roughness={0.5} /></mesh>
          <mesh position={[0, 1.13, 0.05]}><boxGeometry args={[1.25, 0.08, 0.95]} /><meshStandardMaterial color="#2A2825" metalness={0.6} roughness={0.4} /></mesh>
          {/* olla sobre la estufa */}
          <mesh position={[0, 1.33, 0]} castShadow><cylinderGeometry args={[0.24, 0.22, 0.32, 16]} /><meshStandardMaterial color={OLE.iron} metalness={0.6} roughness={0.4} /></mesh>
        </group>
        {/* estante de fondo */}
        <mesh position={[-0.3, 1.38, -2.2]}><boxGeometry args={[3.2, 0.06, 0.4]} /><meshStandardMaterial color="#8A6539" roughness={0.85} /></mesh>
        {/* mesa larga + bancos */}
        <mesh position={[0, 0.78, 0.05]} castShadow receiveShadow><boxGeometry args={[3.9, 0.08, 1.3]} /><meshStandardMaterial color="#A67C4B" roughness={0.9} /></mesh>
        {[-1.7, 1.7].flatMap(x => [-0.5, 0.6].map(z => (
          <mesh key={x + "_" + z} position={[x, 0.38, z]}><boxGeometry args={[0.1, 0.76, 0.1]} /><meshStandardMaterial color="#6B4A2C" /></mesh>
        )))}
        <mesh position={[0, 0.42, 1.0]}><boxGeometry args={[3.7, 0.08, 0.36]} /><meshStandardMaterial color="#8A6539" roughness={0.9} /></mesh>
        <mesh position={[0, 0.42, -0.95]}><boxGeometry args={[3.7, 0.08, 0.36]} /><meshStandardMaterial color="#8A6539" roughness={0.9} /></mesh>
        {/* lámpara de farol colgando */}
        <mesh position={[0.2, 2.75, 0.2]}><cylinderGeometry args={[0.09, 0.11, 0.26, 10]} /><meshStandardMaterial color="#D9A441" emissive="#FFC46B" emissiveIntensity={1.2} /></mesh>
        {/* platos que se llenan */}
        {plates.map((p, i) => {
          const local = interpolate(n, [p.rank, p.rank + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.7)) });
          if (local <= 0.001) return null;
          return (
            <group key={i} position={p.s} scale={[local, local, local]}>
              <mesh castShadow><cylinderGeometry args={[0.17, 0.14, 0.035, 16]} /><meshStandardMaterial color={i % 3 === 0 ? OLE.enamel : "#E9EEF3"} roughness={0.35} metalness={0.15} /></mesh>
              <mesh position={[0, 0.05, 0]} scale={[1, p.big ? 0.7 : 0.45, 1]} castShadow><sphereGeometry args={[0.11, 12, 8]} /><meshStandardMaterial color={p.c} roughness={0.8} /></mesh>
            </group>
          );
        })}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
