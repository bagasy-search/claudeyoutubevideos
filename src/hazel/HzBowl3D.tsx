// HzBowl3D — un bowl de cristal tallado (Brilliant Period) en 3D real: torneado facetado con material de cristal que
// refleja, gira despacio; una "luz de ventana" barre la superficie y, en el ángulo justo, aparece la firma al ácido
// (props.sign) tenue en el centro, que una lupa encuadra. Reusable para cualquier pieza de cristal firmada.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HZ, LABEL, SERIF } from "./HzTheme";
import { Stamp } from "./HzParts";

const CamLook: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};
function envTex() {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256; const c = cv.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, "#ffffff"); g.addColorStop(0.5, "#d8d2c4"); g.addColorStop(0.52, "#6d5f4c"); g.addColorStop(1, "#2a241e"); c.fillStyle = g; c.fillRect(0, 0, 512, 256);
  c.fillStyle = "#ffffff"; c.fillRect(40, 30, 110, 140); c.fillRect(300, 40, 70, 100); c.fillStyle = "#9fc3e0"; c.fillRect(48, 38, 94, 124);
  const t = new THREE.CanvasTexture(cv); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const HzBowl3D: React.FC<{ sign?: string; signAt?: number; title?: string; verdict?: string; good?: boolean }> = ({ sign = "Libbey", signAt = 70, title = "hold it to the window", verdict, good = true }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const m = useMemo(() => {
    const env = envTex();
    // perfil del bowl con escalones (cortes) → facetado con pocos segmentos radiales + flatShading
    const prof: any[] = []; const N = 26;
    for (let i = 0; i <= N; i++) { const t = i / N; const r = 0.35 + 0.85 * Math.sin(t * Math.PI * 0.5) + (i % 2 ? 0.035 : 0); prof.push(new THREE.Vector2(r, t * 0.9)); }
    const outer = new THREE.LatheGeometry(prof, 24);
    // dibujo del tallado (diamantes cruzados + estrellas) como textura sobre el cristal
    const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 512; const c = cv.getContext("2d")!;
    c.fillStyle = "#c9d6de"; c.fillRect(0, 0, 1024, 512); c.strokeStyle = "#ffffff"; c.lineWidth = 5;
    for (let i = -512; i < 1024; i += 40) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 512, 512); c.stroke(); c.beginPath(); c.moveTo(i + 512, 0); c.lineTo(i, 512); c.stroke(); }
    for (let k = 0; k < 8; k++) { const x = 64 + k * 128, y = 140; c.strokeStyle = "#f8fbff"; c.lineWidth = 4; for (let a = 0; a < 16; a++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a * Math.PI / 8) * 56, y + Math.sin(a * Math.PI / 8) * 56); c.stroke(); } }
    const cut = new THREE.CanvasTexture(cv); cut.colorSpace = THREE.SRGBColorSpace; cut.wrapS = THREE.RepeatWrapping; cut.repeat.set(2, 1);
    const glass = new THREE.MeshPhysicalMaterial({ map: cut, color: "#ffffff", metalness: 0.15, roughness: 0.05, envMap: env, envMapIntensity: 2.4, transparent: true, opacity: 0.82, flatShading: true, side: THREE.DoubleSide, clearcoat: 1 });
    const base = new THREE.CylinderGeometry(0.36, 0.4, 0.06, 24);
    return { outer, glass, base };
  }, []);
  const spin = f * 0.012;
  const sweep = interpolate(f, [signAt - 30, signAt + 10], [-1.2, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const signOp = interpolate(f, [signAt, signAt + 14], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lens = interpolate(f, [signAt + 10, signAt + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  const cam: [number, number, number] = [0, 2.5, interpolate(f, [0, signAt], [5.0, 4.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2b2a33, #0f0e14 70%)" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: cam, near: 0.05, far: 30 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamLook pos={cam} target={[0, 0.25, 0]} />
        <hemisphereLight args={["#ffffff", "#8a6a44", 1.0]} />
        <directionalLight position={[sweep * 4, 3, 2]} intensity={2.6} />
        <directionalLight position={[-2, 2, -3]} intensity={0.6} color="#DCE6FF" />
        <group rotation={[0, spin, 0]}>
          <mesh geometry={m.outer} material={m.glass} />
          <mesh geometry={m.base} material={m.glass} position={[0, 0.03, 0]} />
        </group>
      </ThreeCanvas>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -10%)", fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: "rgba(255,255,255,0.95)", textShadow: "0 0 18px rgba(255,255,255,0.9), 0 2px 2px rgba(60,50,40,0.6)", opacity: signOp, letterSpacing: 2 }}>{sign}</div>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 520, height: 520, marginLeft: -260, marginTop: -200, borderRadius: 260, border: `20px solid ${HZ.goldSoft}`, opacity: lens * 0.85, transform: `scale(${0.6 + 0.4 * lens})` }} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, color: HZ.goldSoft, textTransform: "uppercase" }}>{title}</div>
      {verdict ? <div style={{ position: "absolute", right: 120, bottom: 110 }}><Stamp text={verdict} at={signAt + 26} size={76} color={good ? HZ.green : HZ.red} rot={-7} style={{ background: "rgba(255,253,246,0.92)", mixBlendMode: "normal" }} /></div> : null}
    </AbsoluteFill>
  );
};
