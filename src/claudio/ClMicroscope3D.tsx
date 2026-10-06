// ClMicroscope3D — "zoom de microscopio" en 3D real (three.js): la cámara arranca mirando la parte de abajo del borde del inodoro
// (porcelana con la fila de agujeros y los chorretes negros), se acerca a UN agujero y entra por el túnel; las paredes están
// tapizadas de biopelícula VIVA (bastoncitos y cocos que laten y se mueven, hilos de baba) iluminada por la lucecita del
// microscopio. Encima: el ocular (viñeta circular), la retícula y el aumento que corre x1 → x400.
//   label  rótulo corto dentro del ocular (≤6 palabras) · zoomTo aumento final
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, HAND, rnd, clamp01 } from "./ClTheme";
import { lin } from "./ClParts";

const Cam: React.FC<{ z: number; y: number; fov: number }> = ({ z, y, fov }) => {
  const { camera } = useThree() as any; camera.position.set(0, y, z); camera.fov = fov; camera.lookAt(0, y * 0.4, z - 5); camera.updateProjectionMatrix(); return null;
};
const HOLE_R = 0.55, TUN = 14;

export const ClMicroscope3D: React.FC<{ label?: string; zoomTo?: number }> = ({ label = "Bacterias y moho, juntos", zoomTo = 400 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T } = useVideoConfig();
  const k = interpolate(f, [0, T * 0.82], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const z = interpolate(k, [0, 0.45, 1], [7.5, 1.2, -9]);
  const y = interpolate(k, [0, 0.45, 1], [0.9, 0.12, 0]);
  const fov = interpolate(k, [0, 1], [46, 34]);
  const inside = clamp01((0.6 - z) / 2.2);         // 0 afuera → 1 dentro del túnel
  const mag = Math.round(interpolate(k, [0, 0.35, 1], [1, 10, zoomTo]));

  const geo = useMemo(() => ({
    tunnel: new THREE.CylinderGeometry(HOLE_R, HOLE_R * 0.92, TUN, 40, 30, true),
    rod: new THREE.CapsuleGeometry(0.035, 0.14, 4, 8),
    coc: new THREE.SphereGeometry(0.05, 10, 8),
    streak: new THREE.CapsuleGeometry(0.11, 1, 4, 10),
    holeDisc: new THREE.CircleGeometry(HOLE_R * 0.98, 40),
  }), []);
  const mats = useMemo(() => ({
    porcelain: new THREE.MeshStandardMaterial({ color: "#F7F6F2", roughness: 0.22 }),
    tunnel: new THREE.MeshStandardMaterial({ color: "#9E9787", roughness: 0.75, side: THREE.BackSide }),
    dark: new THREE.MeshBasicMaterial({ color: "#0C0B08" }),
    slime: new THREE.MeshStandardMaterial({ color: "#1E1C15", roughness: 0.35 }),
    rodA: new THREE.MeshStandardMaterial({ color: "#3C4A22", roughness: 0.35, emissive: "#16200A", emissiveIntensity: 0.5 }),
    rodB: new THREE.MeshStandardMaterial({ color: "#5E4A24", roughness: 0.35, emissive: "#20160A", emissiveIntensity: 0.4 }),
    coc: new THREE.MeshStandardMaterial({ color: "#2C3A1C", roughness: 0.3, emissive: "#0F1806", emissiveIntensity: 0.5 }),
    eps: new THREE.MeshStandardMaterial({ color: "#B9C38E", roughness: 0.2, transparent: true, opacity: 0.35, depthWrite: false }),
  }), []);
  // fila de agujeros en la porcelana (el del centro es el nuestro, en x=0)
  const holes = Array.from({ length: 9 }, (_, i) => ({ x: (i - 4) * 1.6, y: -Math.pow((i - 4) * 0.22, 2), i }));
  // células sobre la pared del túnel
  const cells = useMemo(() => Array.from({ length: 360 }, (_, i) => ({ a: rnd(i) * Math.PI * 2, d: 0.6 + rnd(i + 11) * (TUN - 1.2), kind: rnd(i + 5) < 0.6 ? 0 : 1, s: 0.7 + rnd(i + 3) * 0.9, rot: rnd(i + 9) * Math.PI, ph: rnd(i + 13) * 6.28, i })), []);
  const strands = useMemo(() => Array.from({ length: 34 }, (_, i) => ({ a: rnd(i * 7) * Math.PI * 2, d: 1 + rnd(i * 5) * (TUN - 2), len: 0.3 + rnd(i * 3) * 0.6, i })), []);

  const cx = width / 2, cy = height / 2, R = Math.min(width, height) * 0.46;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0D12", overflow: "hidden" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 46, position: [0, 0.9, 7.5] }} gl={{ antialias: true }}>
        <Cam z={z} y={y} fov={fov} />
        <color attach="background" args={[inside > 0.5 ? "#0C0E0A" : "#E9E7E1"]} />
        <fog attach="fog" args={["#0A0C08", 2 + 6 * (1 - inside), 9 + 30 * (1 - inside)]} />
        <ambientLight intensity={0.55 - 0.3 * inside} />
        <directionalLight position={[2, 6, 6]} intensity={1.1 * (1 - inside)} color="#FFF1DA" />
        <pointLight position={[0.2, 0.25, z - 0.4]} intensity={6 * inside + 0.2} distance={6} decay={1.6} color="#FFF4DC" />
        {/* la porcelana de abajo del borde, con los agujeros y los chorretes */}
        <mesh position={[0, 0, -0.02]} material={mats.porcelain}><planeGeometry args={[30, 10]} /></mesh>
        {holes.map((h) => (
          <group key={h.i} position={[h.x, h.y, 0]}>
            {h.i !== 4 ? <mesh geometry={geo.holeDisc} material={mats.dark} position={[0, 0, 0.001]} /> : null}
            <mesh geometry={geo.streak} material={mats.slime} position={[0.05 * (rnd(h.i) - 0.5), -0.9 - rnd(h.i + 1) * 0.5, 0.06]} scale={[0.7 + 0.12 * Math.sin(f * 0.2 + h.i), 0.8 + rnd(h.i + 2) * 0.9 + 0.06 * Math.sin(f * 0.15 + h.i), 0.3]} />
            <mesh material={mats.slime} position={[0, 0, 0.03]}><torusGeometry args={[HOLE_R, 0.09, 8, 30]} /></mesh>
          </group>
        ))}
        {/* el túnel (va hacia -z desde el agujero central) */}
        <mesh geometry={geo.tunnel} material={mats.tunnel} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -TUN / 2]} />
        {cells.map((c) => {
          const r = HOLE_R * (1 - 0.08 * (c.d / TUN)) - 0.04, w = 1 + 0.25 * Math.sin(f * 0.25 + c.ph);
          const px = Math.cos(c.a + 0.02 * Math.sin(f * 0.07 + c.ph)) * r, py = Math.sin(c.a) * r;
          return <mesh key={c.i} geometry={c.kind ? geo.coc : geo.rod} material={c.kind ? mats.coc : c.i % 3 ? mats.rodA : mats.rodB} position={[px, py, -c.d]} rotation={[c.rot + f * 0.01, c.a, c.rot]} scale={c.s * w} />;
        })}
        {strands.map((s) => { const r = HOLE_R - 0.06; return (
          <mesh key={"s" + s.i} material={mats.eps} position={[Math.cos(s.a) * r * 0.7, Math.sin(s.a) * r * 0.7, -s.d]} rotation={[0.3 * Math.sin(f * 0.05 + s.i), 0, s.a]} scale={[1, 1 + 0.15 * Math.sin(f * 0.12 + s.i), 1]}>
            <cylinderGeometry args={[0.012, 0.02, s.len, 6]} />
          </mesh>); })}
      </ThreeCanvas>
      {/* ocular del microscopio: viñeta circular que se cierra al entrar + retícula + aumento */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs><mask id="eye"><rect width={width} height={height} fill="white" /><circle cx={cx} cy={cy} r={R + (1 - inside) * 900} fill="black" /></mask></defs>
        <rect width={width} height={height} fill="#07090D" mask="url(#eye)" opacity={0.96} />
        <circle cx={cx} cy={cy} r={R + (1 - inside) * 900} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={6} />
        <g opacity={0.55 * inside} stroke="rgba(255,255,255,0.75)" strokeWidth={2}>
          <line x1={cx - R * 0.9} y1={cy} x2={cx - 40} y2={cy} /><line x1={cx + 40} y1={cy} x2={cx + R * 0.9} y2={cy} />
          <line x1={cx} y1={cy - R * 0.9} x2={cx} y2={cy - 40} /><line x1={cx} y1={cy + 40} x2={cx} y2={cy + R * 0.9} />
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1={cx - R * 0.5 + i * R * 0.125} y1={cy + R * 0.72} x2={cx - R * 0.5 + i * R * 0.125} y2={cy + R * 0.72 - (i % 4 === 0 ? 26 : 14)} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", right: 120, top: 110, fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: "#fff", letterSpacing: 2, textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
        <span style={{ fontSize: 46, opacity: 0.7, marginRight: 8 }}>x</span>{mag}
      </div>
      {label ? (
        <div style={{ position: "absolute", left: "50%", bottom: 120, translate: "-50% 0", opacity: lin(f, T * 0.55, T * 0.65), scale: String(0.9 + 0.1 * lin(f, T * 0.55, T * 0.65)), background: CL.yellow, color: CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 56, padding: "10px 34px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>{label}</div>
      ) : null}
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.yellowSoft, opacity: lin(f, 8, 20) * (1 - inside * 0.4) }}>adentro de un agujerito</div>
    </AbsoluteFill>
  );
};
