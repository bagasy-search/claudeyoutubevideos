// HzPyrex3D — juego de bowls de vidrio opal (estilo Pyrex de los 50) anidados, en 3D real: giran despacio, el de
// arriba se levanta y muestra el patrón; a mitad pasa de colores vivos a lavados ("dishwasher") si `fadeAt` > 0.
// Patrón genérico (bandas + puntitos), sin marcas. Props: colors, pattern label, fadeAt, verdict.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HZ, LABEL, TYPE, fontsReady, manilaBg } from "./HzTheme";
import { Stamp } from "./HzParts";

const CamLook: React.FC<{ pos: [number, number, number] }> = ({ pos }) => { const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(0, 0.45, 0); camera.updateProjectionMatrix(); return null; };
function patTex(color: string, faded: boolean) {
  const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 256; const c = cv.getContext("2d")!;
  c.fillStyle = "#fbf8f0"; c.fillRect(0, 0, 1024, 256);
  const col = faded ? "rgba(150,150,140,0.35)" : color;
  c.fillStyle = col; c.fillRect(0, 60, 1024, 26); c.fillRect(0, 170, 1024, 26);
  for (let i = 0; i < 32; i++) { c.beginPath(); c.arc(16 + i * 32, 128, 9, 0, 6.3); c.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t;
}
export const HzPyrex3D: React.FC<{ colors?: string[]; title?: string; fadeAt?: number; verdict?: string; fadedLabel?: string }> = ({ colors = ["#2f7fa8", "#d9a02b", "#c84a3a", "#3f8a55"], title = "the mixing bowls", fadeAt = 0, verdict = "bright & glossy", fadedLabel = "dishwasher-faded" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const [ready, setReady] = useState(false); const [h] = useState(() => delayRender("hz pyrex fonts"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const faded = fadeAt > 0 && f >= fadeAt;
  const geo = useMemo(() => { const pts: any[] = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new (THREE as any).Vector2(0.32 + 0.58 * Math.sin(t * Math.PI * 0.5) + (i === 20 ? 0.04 : 0), t * 0.85)); } return new THREE.LatheGeometry(pts, 64); }, []);
  const mats = useMemo(() => !ready ? null : colors.map((c) => ({ on: new THREE.MeshStandardMaterial({ map: patTex(c, false), roughness: 0.25, metalness: 0.0, side: THREE.DoubleSide }), off: new THREE.MeshStandardMaterial({ map: patTex(c, true), roughness: 0.75, metalness: 0.0, side: THREE.DoubleSide }) })), [ready, colors]);
  const lift = interpolate(f, [20, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.3)) });
  const cam: [number, number, number] = [0, 1.25, 4.8];
  return (
    <AbsoluteFill style={{ ...manilaBg(HZ.paper) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(#cbb58a, #a88a5a)" }} />
      {mats ? (
        <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: cam }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamLook pos={cam} />
          <hemisphereLight args={["#fff8ea", "#8a6a44", 1.1]} />
          <directionalLight position={[2, 4, 3]} intensity={1.8} />
          {mats.map((m, i) => { const s = 1 - i * 0.16; const y = i * 0.12 + (i === mats.length - 1 ? lift * 0.5 : 0); const x = i === mats.length - 1 ? lift * 1.5 : 0;
            return <mesh key={i} geometry={geo} material={faded ? m.off : m.on} position={[x, y, 0]} scale={[s * 1.15, s, s * 1.15]} rotation={[i === mats.length - 1 ? lift * 0.35 : 0, f * 0.01 + i * 0.6, 0]} />; })}
        </ThreeCanvas>
      ) : null}
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, color: HZ.inkSoft, textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", right: 120, bottom: 120 }}>
        {fadeAt > 0 && faded ? <Stamp text={fadedLabel} at={fadeAt + 4} size={64} color={HZ.red} rot={-6} style={{ background: "rgba(255,253,246,0.9)", mixBlendMode: "normal" }} /> : <Stamp text={verdict} at={50} size={64} color={HZ.green} rot={-6} style={{ background: "rgba(255,253,246,0.9)", mixBlendMode: "normal" }} />}
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 130, fontFamily: TYPE, fontSize: 44, color: HZ.ink, opacity: interpolate(f, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{faded ? "dull, chalky = less value" : "glossy color = value"}</div>
    </AbsoluteFill>
  );
};
