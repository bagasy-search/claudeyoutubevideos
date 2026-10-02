// ElCO3D — la regla de la mamá de Earl en 3D real: un camarón (segmentos + cola en abanico) que pasa de crudo gris
// y casi recto a rosado curvado en "C" (cocido) y, si se pasa, cerrado en "O" (pasado). Cada estado con su rótulo a
// marcador. Props: cAt / oAt (cuadros), labels.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EL, MARKER, LABEL } from "./ElTheme";

const CamLook: React.FC<{ pos: [number, number, number] }> = ({ pos }) => { const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); return null; };
const lerpC = (a: string, b: string, k: number) => { const A = new THREE.Color(a), B = new THREE.Color(b); return A.lerp(B, k); };

export const ElCO3D: React.FC<{ cAt?: number; oAt?: number; cLabel?: string; oLabel?: string; title?: string }> = ({ cAt = 20, oAt = 110, cLabel = "C = cooked", oLabel = "O = overdone", title = "Mama's rule" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const e = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  const toC = interpolate(f, [cAt, cAt + 30], [0, 1], e), toO = interpolate(f, [oAt, oAt + 30], [0, 1], e);
  const sweep = 1.2 + 2.3 * toC + 1.9 * toO; // ángulo total del arco (rad): casi recto → C → O
  const geo = useMemo(() => new THREE.SphereGeometry(1, 28, 20), []);
  const col = lerpC("#9aa7a6", "#F28A5C", toC);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.0 }), []);
  mat.color = col; mat.emissive = lerpC("#000000", "#3a0f00", toC * 0.4);
  const tailMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide }), []);
  tailMat.color = lerpC("#7f8b8a", "#E8603A", toC);
  const N = 15, R = 0.95;
  const segs = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1), a = -sweep / 2 + sweep * t + Math.PI / 2;
    const s = 0.36 * (1 - t * 0.6);
    return { x: Math.cos(a) * R, y: Math.sin(a) * R, a, s };
  });
  const last = segs[N - 1];
  const cam: [number, number, number] = [0, 0, 6.2];
  const op = (at: number) => interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #ffffff, ${EL.ice})` }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: cam }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamLook pos={cam} />
        <hemisphereLight args={["#ffffff", "#9fb7c2", 1.1]} />
        <directionalLight position={[2, 3, 4]} intensity={1.7} />
        <group position={[0, -0.45, 0]} rotation={[0.35, 0.25 + f * 0.004, 0]}>
          {segs.map((g, i) => <mesh key={i} geometry={geo} material={mat} position={[g.x, g.y, 0]} rotation={[0, 0, g.a + Math.PI / 2]} scale={[g.s * 1.25, g.s * 0.85, g.s * 0.9]} />)}
          <mesh material={tailMat} position={[last.x + Math.cos(last.a + Math.PI / 2) * 0.18, last.y + Math.sin(last.a + Math.PI / 2) * 0.18, 0]} rotation={[0, 0, last.a]}><coneGeometry args={[0.26, 0.38, 3, 1]} /></mesh>
          <mesh material={mat} position={[segs[0].x, segs[0].y, 0]} rotation={[0, 0, segs[0].a]} scale={[0.42, 0.3, 0.34]} geometry={geo} />
        </group>
      </ThreeCanvas>
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}><span style={{ background: EL.navy, color: EL.white, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, padding: "8px 28px", textTransform: "uppercase" }}>{title}</span></div>
      <div style={{ position: "absolute", left: 160, bottom: 50, fontFamily: MARKER, fontSize: 92, color: EL.green, opacity: op(cAt + 26) * (1 - toO * 0.6), transform: "rotate(-4deg)" }}>{cLabel}</div>
      <div style={{ position: "absolute", right: 160, bottom: 50, fontFamily: MARKER, fontSize: 92, color: EL.red, opacity: op(oAt + 26), transform: "rotate(3deg)" }}>{oLabel}</div>
    </AbsoluteFill>
  );
};
