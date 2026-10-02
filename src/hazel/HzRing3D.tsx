// HzRing3D — un anillo de oro en 3D real (three.js) que gira y se inclina hasta mostrar el INTERIOR de la banda, donde
// está estampada la ley (14K · 585). Al costado, la cuenta: qué quiere decir el número. Reusable: mark, sub, line1, line2,
// gold (color del metal).
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HZ, LABEL, SERIF, TYPE, fontsReady, paperBg } from "./HzTheme";
import { Stamp, Tag } from "./HzParts";

const CamLook: React.FC<{ pos: [number, number, number] }> = ({ pos }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); return null;
};
function envTex() {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256; const c = cv.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, "#fff8e8"); g.addColorStop(0.5, "#c9b48c"); g.addColorStop(1, "#3a2c1c"); c.fillStyle = g; c.fillRect(0, 0, 512, 256);
  c.fillStyle = "#ffffff"; c.fillRect(80, 30, 80, 110); c.fillRect(360, 50, 50, 70);
  const t = new THREE.CanvasTexture(cv); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
function bandTex(mark: string, sub: string) {
  const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 128; const c = cv.getContext("2d")!;
  c.fillStyle = "#c9a043"; c.fillRect(0, 0, 1024, 128);
  for (let i = 0; i < 60; i++) { c.strokeStyle = `rgba(90,60,10,${0.05 + (i % 5) * 0.02})`; c.beginPath(); c.moveTo(0, 10 + i * 2); c.lineTo(1024, 12 + i * 2); c.stroke(); }
  c.fillStyle = "#5a3d0e"; c.font = `700 92px ${LABEL}`; c.textAlign = "center"; c.textBaseline = "middle";
  c.save(); c.translate(512, 64); c.scale(-1, 1); c.fillText(`${mark} · ${sub}`, 0, 4); c.restore();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t;
}

export const HzRing3D: React.FC<{ mark?: string; sub?: string; line1?: string; line2?: string; gold?: string; title?: string }> = ({ mark = "14K", sub = "585", line1 = "14K = 585", line2 = "58.5% gold", gold = "#d9a93c", title = "look inside the band" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const [ready, setReady] = useState(false); const [h] = useState(() => delayRender("hz ring fonts"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const m = useMemo(() => {
    if (!ready) return null;
    const env = envTex();
    const metal = new THREE.MeshStandardMaterial({ color: gold, metalness: 0.95, roughness: 0.2, envMap: env, envMapIntensity: 1.3 });
    const inner = new THREE.MeshStandardMaterial({ map: bandTex(mark, sub), metalness: 0.6, roughness: 0.35, envMap: env, envMapIntensity: 0.7, side: THREE.BackSide });
    const outer = new THREE.TorusGeometry(1.0, 0.17, 48, 160);
    const band = new THREE.CylinderGeometry(0.835, 0.835, 0.3, 160, 1, true);
    return { metal, inner, outer, band };
  }, [ready, mark, sub, gold]);
  const e = Easing.inOut(Easing.cubic);
  const tilt = interpolate(f, [10, 50], [0.15, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const spin = interpolate(f, [0, 60], [-2.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) + Math.sin(f / 40) * 0.05;
  const cam: [number, number, number] = [0, 0.1, interpolate(f, [0, 60], [5.4, 3.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e })];
  const txt = interpolate(f, [48, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ ...paperBg(HZ.manila) }}>
      <div style={{ position: "absolute", left: -200, right: -200, bottom: -100, height: 520, background: "radial-gradient(ellipse at 40% 0%, rgba(80,50,20,0.25), transparent 70%)" }} />
      {m ? (
        <AbsoluteFill style={{ left: -320 }}>
          <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: cam, near: 0.05, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
            <CamLook pos={cam} />
            <hemisphereLight args={["#FFF6E6", "#7a5a34", 0.9]} />
            <directionalLight position={[2.5, 3, 4]} intensity={2.2} color="#FFF0D0" />
            <directionalLight position={[-3, -1, 2]} intensity={0.7} color="#E6EEFF" />
            <group rotation={[tilt, spin, 0]}>
              <mesh geometry={m.outer} material={m.metal} rotation={[Math.PI / 2, 0, 0]} />
              <mesh geometry={m.band} material={m.inner} />
            </group>
          </ThreeCanvas>
        </AbsoluteFill>
      ) : null}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, color: HZ.inkSoft, textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", right: 140, top: 330, opacity: txt, transform: `translateX(${(1 - txt) * 60}px) rotate(2deg)` }}>
        <Tag w={620} h={340}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 96, color: HZ.ink, lineHeight: 1 }}>{line1}</div>
            <div style={{ fontFamily: TYPE, fontSize: 52, color: HZ.redDeep, marginTop: 14 }}>{line2}</div>
          </div>
        </Tag>
        <div style={{ marginTop: 26, marginLeft: 120 }}><Stamp text="real gold" at={62} size={60} color={HZ.green} rot={-6} /></div>
      </div>
    </AbsoluteFill>
  );
};
