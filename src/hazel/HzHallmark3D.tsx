// HzHallmark3D — la jarrita de crema de plata en 3D real (three.js): gira mostrando el cuerpo, se da vuelta y la cámara
// baja a la base, donde está el sello estampado (STERLING / 925 o E P N S). Una lupa dibujada encuadra el sello y cae el
// veredicto. Reusable: stamp, sub, verdict, good (sterling) / !good (plateado), tint del metal.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HZ, LABEL, TYPE, fontsReady, manilaBg } from "./HzTheme";
import { Stamp } from "./HzParts";

const CamLook: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};

function envTex() {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256; const c = cv.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, "#fffaf0"); g.addColorStop(0.45, "#d9cfc0"); g.addColorStop(0.55, "#6b5a48"); g.addColorStop(1, "#2a2420"); c.fillStyle = g; c.fillRect(0, 0, 512, 256);
  c.fillStyle = "rgba(255,255,255,0.95)"; c.fillRect(60, 40, 90, 120); c.fillRect(330, 30, 60, 90); // ventanas que se reflejan
  const t = new THREE.CanvasTexture(cv); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
function baseTex(stamp: string, sub: string) {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512; const c = cv.getContext("2d")!;
  const g = c.createRadialGradient(256, 256, 30, 256, 256, 256); g.addColorStop(0, "#d7d7d2"); g.addColorStop(1, "#9c9c96"); c.fillStyle = g; c.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 160; i++) { c.strokeStyle = `rgba(80,80,80,${0.04 + (i % 7) * 0.01})`; c.beginPath(); c.arc(256, 256, 40 + i * 1.4, 0, 6.3); c.stroke(); }
  c.fillStyle = "#3b3833"; c.textAlign = "center"; c.font = `700 70px ${LABEL}`; c.fillText(stamp, 256, 250);
  c.font = `400 46px ${TYPE}`; c.fillText(sub, 256, 320);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const HzHallmark3D: React.FC<{ stamp?: string; sub?: string; verdict?: string; good?: boolean; title?: string; flipAt?: number }> = ({ stamp = "STERLING", sub = "925", verdict = "solid silver", good = true, title = "turn it over", flipAt = 40 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const [ready, setReady] = useState(false); const [h] = useState(() => delayRender("hz hallmark fonts"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const mats = useMemo(() => {
    if (!ready) return null;
    const env = envTex();
    const metal = new THREE.MeshStandardMaterial({ color: good ? "#e4e4e0" : "#e8dcc4", metalness: 0.92, roughness: 0.22, envMap: env, envMapIntensity: 1.25 });
    const base = new THREE.MeshStandardMaterial({ map: baseTex(stamp, sub), metalness: 0.5, roughness: 0.45, envMap: env, envMapIntensity: 0.6 });
    // perfil de la jarrita (radio, altura) → LatheGeometry
    const prof = [[0.0, 0], [0.42, 0], [0.46, 0.04], [0.40, 0.10], [0.52, 0.30], [0.60, 0.62], [0.55, 0.92], [0.46, 1.10], [0.48, 1.22], [0.56, 1.30]].map(([r, y]) => new THREE.Vector2(r, y));
    const body = new THREE.LatheGeometry(prof, 72);
    const handle = new THREE.TorusGeometry(0.30, 0.045, 16, 48, Math.PI * 1.15);
    const spout = new THREE.ConeGeometry(0.16, 0.34, 32, 1, true);
    const disk = new THREE.CircleGeometry(0.41, 64);
    return { metal, base, body, handle, spout, disk };
  }, [ready, stamp, sub, good]);
  const e = Easing.inOut(Easing.cubic);
  const flip = interpolate(f, [flipAt, flipAt + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const spin = interpolate(f, [0, flipAt + 28], [-Math.PI * 1.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cam: [number, number, number] = [0, interpolate(flip, [0, 1], [1.2, 0.55]), interpolate(flip, [0, 1], [3.8, 2.0])];
  const lensOp = interpolate(f, [flipAt + 26, flipAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ ...manilaBg(HZ.paper) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, background: "linear-gradient(#cbb58a, #a88a5a)" }} />
      {mats ? (
        <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: cam, near: 0.05, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamLook pos={cam} target={[0, 0.55, 0]} />
          <hemisphereLight args={["#FFF6E6", "#8a6a44", 0.9]} />
          <directionalLight position={[2.5, 4, 3]} intensity={2.0} color="#FFF3DC" />
          <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#DCE6FF" />
          <group position={[0, 0.55, 0]} rotation={[-flip * Math.PI * 0.5, spin, 0]}>
            <group position={[0, -0.6, 0]}>
              <mesh geometry={mats.body} material={mats.metal} />
              <mesh geometry={mats.handle} material={mats.metal} position={[-0.6, 0.68, 0]} rotation={[0, 0, Math.PI * 0.42]} />
              <mesh geometry={mats.spout} material={mats.metal} position={[0.55, 1.28, 0]} rotation={[0, 0, -Math.PI * 0.62]} />
              <mesh geometry={mats.disk} material={mats.base} position={[0, 0.002, 0]} rotation={[Math.PI / 2, 0, 0]} />
            </group>
          </group>
        </ThreeCanvas>
      ) : null}
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, color: HZ.inkSoft, textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 640, height: 640, marginLeft: -320, marginTop: -300, borderRadius: 320, border: `22px solid ${HZ.ink}`, boxShadow: "0 0 0 8px rgba(255,255,255,0.4) inset", opacity: lensOp * 0.85 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 260, marginLeft: 210, marginTop: 280, background: HZ.ink, transform: "rotate(-40deg)", transformOrigin: "top", opacity: lensOp * 0.85 }} />
      <div style={{ position: "absolute", right: 120, bottom: 120, opacity: lensOp }}>
        <Stamp text={verdict} at={flipAt + 38} size={78} color={good ? HZ.green : HZ.red} rot={-7} style={{ background: "rgba(255,253,246,0.8)" }} />
      </div>
    </AbsoluteFill>
  );
};
