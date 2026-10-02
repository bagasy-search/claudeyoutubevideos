// LorDevilTray3D — una fuente de vidrio (Pyrex) donde se van llenando las mitades de huevo, de a una, con su
// montículo de relleno y la lluvia de paprika; la cámara orbita. Contador en pantalla (texto por props, inglés).
// three.js real, todo por useCurrentFrame. Reusable por el canal (huevos, canapés, bandejas de potluck).
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOR, SERIF, HAND } from "./LorTheme";
import { canvasTex, dots } from "./lor3dutil";

const PX = 0.56, PZ = 0.8; // paso entre mitades

const Half: React.FC<{ x: number; z: number; p: number; pap: number; mats: any; geos: any; rot: number }> = ({ x, z, p, pap, mats, geos, rot }) => {
  const drop = (1 - p);
  return (
    <group position={[x, 0.3 + drop * 1.6, z]} rotation={[0, rot, 0]} scale={Math.max(0.001, p)}>
      <mesh geometry={geos.bowl} material={mats.white} scale={[0.42, 0.34, 0.66]} position={[0, 0.02, 0]} />
      <mesh geometry={geos.dome} material={mats.filling} scale={[0.34, 0.3 * (0.4 + 0.6 * Math.min(1, p * 1.4)), 0.56]} position={[0, 0.06, 0]} />
      {pap > 0.01 ? <mesh geometry={geos.disc} material={mats.pap} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06 + 0.3 * 0.62, 0]} scale={[0.5, 0.78, 1]} /> : null}
    </group>
  );
};

export const LorDevilTray3D: React.FC<{ count?: number; cols?: number; startAt?: number; every?: number; paprika?: boolean; label?: string; title?: string; sub?: string }> = ({ count = 24, cols = 6, startAt = 8, every = 3, paprika = true, label = "halves", title, sub }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const rows = Math.ceil(count / cols);
  const geos = useMemo(() => ({
    bowl: new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    dome: new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    disc: new THREE.CircleGeometry(1, 20),
  }), []);
  const mats = useMemo(() => {
    const fillTex = canvasTex((c, S) => {
      const g = c.createRadialGradient(S * 0.45, S * 0.4, S * 0.05, S / 2, S / 2, S * 0.6); g.addColorStop(0, "#FFD968"); g.addColorStop(1, "#E9A92B"); c.fillStyle = g; c.fillRect(0, 0, S, S);
      c.strokeStyle = "rgba(190,120,20,0.35)"; c.lineWidth = 3; for (let k = 0; k < 14; k++) { c.beginPath(); c.arc(S / 2, S / 2, 10 + k * 17, 0, Math.PI * 2); c.stroke(); }
      dots(c, S, 4, 160, "#FFE7A0", 1, 3, 0.5);
    }, 256, 1);
    const papTex = canvasTex((c, S) => { c.clearRect(0, 0, S, S); dots(c, S, 9, 420, "#B8321E", 1, 3.2, 0.9); dots(c, S, 19, 260, "#D9552C", 1, 2.4, 0.8); }, 256, 1);
    return {
      white: new THREE.MeshStandardMaterial({ color: "#FFFBF0", roughness: 0.55, side: THREE.DoubleSide }),
      filling: new THREE.MeshStandardMaterial({ map: fillTex, roughness: 0.5 }),
      pap: new THREE.MeshStandardMaterial({ map: papTex, transparent: true, opacity: 0, roughness: 1, depthWrite: false }),
      glass: new THREE.MeshStandardMaterial({ color: "#CFE3E8", roughness: 0.12, metalness: 0.05, transparent: true, opacity: 0.55 }),
      glassFloor: new THREE.MeshStandardMaterial({ color: "#E4F0F2", roughness: 0.2 }),
      table: new THREE.MeshStandardMaterial({ map: canvasTex((c, S) => { c.fillStyle = "#FFFDF7"; c.fillRect(0, 0, S, S); c.fillStyle = "rgba(200,50,58,0.5)"; const q = S / 8; for (let k = 0; k < 8; k += 2) { c.fillRect(k * q, 0, q, S); c.fillRect(0, k * q, S, q); } dots(c, S, 5, 700, "#FFFFFF", 1, 2, 0.25); }, 512, 5), roughness: 0.9 }),
    };
  }, []);
  const W = cols * PX + 0.5, D = rows * PZ + 0.5;
  const t = frame / 30;
  const ang = 0.35 + t * 0.22;
  const dist = interpolate(frame, [0, durationInFrames], [6.2, 5.0], { extrapolateRight: "clamp" });
  const elev = interpolate(frame, [0, durationInFrames], [0.95, 0.8], { extrapolateRight: "clamp" });
  const camPos: [number, number, number] = [Math.sin(ang) * dist * Math.cos(elev), dist * Math.sin(elev), Math.cos(ang) * dist * Math.cos(elev)];
  const done = Math.min(count, Math.max(0, Math.floor((frame - startAt) / every) + 1));
  const lastAt = startAt + (count - 1) * every + 14;
  const papP = paprika ? interpolate(frame, [lastAt, lastAt + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  mats.pap.opacity = papP;
  const titleIn = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE3C8" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: camPos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={camPos} />
        <color attach="background" args={["#EFE3C8"]} />
        <hemisphereLight args={["#FFF6E0", "#B98A5A", 0.95]} />
        <directionalLight position={[3, 6, 3]} intensity={2.0} color="#FFF1D6" />
        <directionalLight position={[-4, 3, -2]} intensity={0.55} color="#DDE8FF" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.table}><planeGeometry args={[20, 20]} /></mesh>
        <mesh position={[0, 0.07, 0]} material={mats.glassFloor}><boxGeometry args={[W, 0.12, D]} /></mesh>
        {[[0, 0.3, D / 2, W, 0.6, 0.06], [0, 0.3, -D / 2, W, 0.6, 0.06], [W / 2, 0.3, 0, 0.06, 0.6, D], [-W / 2, 0.3, 0, 0.06, 0.6, D]].map((s, i) => (
          <mesh key={i} position={[s[0], s[1], s[2]]} material={mats.glass}><boxGeometry args={[s[3], s[4], s[5]]} /></mesh>
        ))}
        {Array.from({ length: count }).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const p = interpolate(frame, [startAt + i * every, startAt + i * every + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
          return <Half key={i} x={(c - (cols - 1) / 2) * PX} z={(r - (rows - 1) / 2) * PZ} p={p} pap={papP} mats={mats} geos={geos} rot={0} />;
        })}
      </ThreeCanvas>
      <div style={{ position: "absolute", right: 90, top: 70, textAlign: "right", opacity: titleIn }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: 0.9, color: LOR.ink, textShadow: "0 3px 0 rgba(255,255,255,0.6)" }}>{done}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: LOR.gingham }}>{label}</div>
      </div>
      {title ? (
        <div style={{ position: "absolute", left: 90, bottom: 70, opacity: titleIn }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LOR.ink, lineHeight: 1, textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>{title}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: LOR.greenDeep, marginTop: 6 }}>{sub}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Cam: React.FC<{ pos: [number, number, number] }> = ({ pos }) => {
  const { camera } = useThree();
  camera.position.set(pos[0], pos[1], pos[2]); camera.lookAt(0, 0.1, 0); camera.updateProjectionMatrix();
  return null;
};
