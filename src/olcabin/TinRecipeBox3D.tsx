// TinRecipeBox3D — la caja de lata de recetas (three.js real): la tapa se abre con bisagra y las fichas manuscritas
// (pilas de tarjetas con renglones) asoman y una sube hasta la cámara. Sin texto quemado: `cards` son props.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HAND, rnd, fontsReady } from "./OleTheme";

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};

function cardTex(lines: string[], seed: number) {
  const cv = document.createElement("canvas"); cv.width = 1280; cv.height = 800; const c = cv.getContext("2d")!;
  c.fillStyle = "#F4EBD3"; c.fillRect(0, 0, 1280, 800);
  for (let i = 0; i < 4; i++) { const x = rnd(seed + i) * 1280, y = rnd(seed + i + 9) * 800, r = 60 + rnd(seed + i + 3) * 120;
    const g = c.createRadialGradient(x, y, 4, x, y, r); g.addColorStop(0, "rgba(180,130,60,0.16)"); g.addColorStop(1, "rgba(180,130,60,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  c.strokeStyle = "rgba(190,60,60,0.55)"; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 140); c.lineTo(1280, 140); c.stroke();
  c.strokeStyle = "rgba(90,130,190,0.35)"; c.lineWidth = 2; for (let y = 210; y < 800; y += 78) { c.beginPath(); c.moveTo(0, y); c.lineTo(1280, y); c.stroke(); }
  c.fillStyle = "#2B3A6B"; c.font = `700 84px ${HAND}`; lines.forEach((l, i) => c.fillText(l, 60, 104 + i * 78, 1160));
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const TinRecipeBox3D: React.FC<{ cards?: string[][]; openAt?: number; liftAt?: number; bg?: string }> = ({
  cards = [["", "", ""]], openAt = 0.4, liftAt = 1.6, bg = "#3A2A1C",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender("fonts tinbox"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const texes = useMemo(() => (ready ? cards.map((l, i) => cardTex(l, 40 + i)) : []), [ready, cards]);
  const lid = interpolate(t, [openAt, openAt + 0.9], [0, 1.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lift = interpolate(t, [liftAt, liftAt + 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const camPos: [number, number, number] = [0, 3.3 - lift * 0.6, 4.6 - lift * 0.9];
  const N = 22;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {ready ? (
        <ThreeCanvas width={width} height={height} shadows camera={{ fov: 36, position: camPos, near: 0.05, far: 30 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <Cam pos={camPos} target={[0, 0.5 + lift * 0.4, 0]} />
          <color attach="background" args={[bg]} />
          <hemisphereLight args={["#F2D9AE", "#4B3520", 0.7]} />
          <directionalLight position={[-3, 5, 4]} intensity={2.2} color="#FFE2B0" castShadow />
          <pointLight position={[2.5, 2, 1]} intensity={9} color="#FF9B3D" distance={8} />
          {/* mesa */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#8A6539" roughness={0.95} /></mesh>
          {/* caja de lata */}
          <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[2.6, 0.6, 1.4]} /><meshStandardMaterial color="#5C6B4A" metalness={0.55} roughness={0.55} /></mesh>
          <mesh position={[0, 0.605, 0]}><boxGeometry args={[2.5, 0.01, 1.3]} /><meshStandardMaterial color="#1A130C" /></mesh>
          {/* fichas asomando */}
          {Array.from({ length: N }).map((_, i) => {
            const own = i === N - 1;
            const x = -1.0 + (i / (N - 1)) * 2.0;
            const tex = own && texes[0] ? texes[0] : texes[(i % Math.max(1, texes.length))];
            return (
              <mesh key={i} position={[own ? x * (1 - lift) : x, own ? 0.98 + lift * 0.75 : 0.9 + rnd(i) * 0.05, own ? lift * 0.35 : -0.1 + rnd(i + 3) * 0.1]}
                rotation={[own ? -0.15 - lift * 0.9 : -0.12 + rnd(i + 6) * 0.05, 0, (rnd(i + 9) - 0.5) * 0.06 * (1 - (own ? lift : 0))]} castShadow>
                <boxGeometry args={[own ? 1.6 + lift * 0.2 : 1.6, own ? 1.0 + lift * 0.12 : 1.0, 0.01]} />
                <meshStandardMaterial map={tex} color={tex ? "#FFFFFF" : ["#F1E7CB", "#EADFBF", "#F6EDD6"][i % 3]} roughness={0.95} />
              </mesh>
            );
          })}
          {/* tapa con bisagra atrás */}
          <group position={[0, 0.6, -0.7]} rotation={[-lid, 0, 0]}>
            <mesh position={[0, 0.02, 0.7]} castShadow><boxGeometry args={[2.62, 0.05, 1.42]} /><meshStandardMaterial color="#5C6B4A" metalness={0.55} roughness={0.5} /></mesh>
            <mesh position={[0, 0.06, 0.7]}><boxGeometry args={[0.5, 0.02, 0.18]} /><meshStandardMaterial color="#B08A4A" metalness={0.8} roughness={0.35} /></mesh>
          </group>
        </ThreeCanvas>
      ) : null}
    </AbsoluteFill>
  );
};
