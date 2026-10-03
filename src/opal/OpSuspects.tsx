// OpSuspects — tablero de corcho con fichas de "sospechosos" (predadores) y su pista, clavadas con chinches; una a una
// se tachan con lápiz rojo y la culpable queda encerrada. Props: cards [{who, clue}], culprit (índice), every, title.
// OpWire3D — dos paneles de alambre en 3D real: malla hexagonal de gallinero vs malla cuadrada chica (hardware cloth);
// una moneda (≈ el agujero que necesita un visón) pasa por la hexagonal y rebota en la cuadrada.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OP, LABEL, HAND, SLAB, rnd } from "./OpTheme";
import { Pin, PencilCircle, Stamp, ease } from "./OpParts";

export const OpSuspects: React.FC<{ cards: { who: string; clue: string }[]; culprit?: number; every?: number; strikeAt?: number; title?: string }> = ({ cards, culprit = -1, every = 8, strikeAt = 9999, title = "who did it?" }) => {
  const f = useCurrentFrame();
  const cols = 3, W = 500, H = 230, X0 = 175, Y0 = 170;
  return (
    <AbsoluteFill style={{ backgroundColor: "#b98a55", backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1.5px), radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.5px)", backgroundSize: "9px 9px, 13px 13px" }}>
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 10, color: OP.white, textTransform: "uppercase", textShadow: "0 3px 8px rgba(0,0,0,0.4)" }}>{title}</div>
      {cards.map((c, i) => {
        const at = 8 + i * every; const x = X0 + (i % cols) * (W + 60), y = Y0 + Math.floor(i / cols) * (H + 40);
        const k = interpolate(f, [at, at + 8], [0, 1], ease); const rot = (rnd(i + 3) - 0.5) * 6;
        const struck = i !== culprit && f > strikeAt + i * 4; const sk = interpolate(f, [strikeAt + i * 4, strikeAt + i * 4 + 8], [0, 1], ease);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: `rotate(${rot}deg) scale(${0.8 + 0.2 * k})`, opacity: k * (struck ? 0.55 : 1), background: OP.paper, boxShadow: "0 12px 22px rgba(0,0,0,0.35)", padding: "40px 28px 20px" }}>
            <Pin x={W / 2} y={18} />
            <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 52, color: i === culprit && f > strikeAt + cards.length * 4 ? OP.red : OP.pencil }}>{c.who}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OP.pencilSoft, lineHeight: 1.05 }}>{c.clue}</div>
            {struck ? <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}><line x1={20} y1={H - 30} x2={20 + (W - 40) * sk} y2={30 + (H - 60) * (1 - sk)} stroke={OP.red} strokeWidth={8} strokeLinecap="round" /></svg> : null}
          </div>
        );
      })}
      {culprit >= 0 && f > strikeAt + cards.length * 4 ? (() => { const x = X0 + (culprit % cols) * (W + 60) + W / 2, y = Y0 + Math.floor(culprit / cols) * (H + 40) + H / 2; return <PencilCircle cx={x} cy={y} rx={W * 0.62} ry={H * 0.72} at={strikeAt + cards.length * 4} color={OP.red} width={12} />; })() : null}
    </AbsoluteFill>
  );
};

const CamLook: React.FC<{ pos: [number, number, number] }> = ({ pos }) => { const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); return null; };
export const OpWire3D: React.FC<{ left?: string; right?: string; title?: string; coin?: string }> = ({ left = "chicken wire", right = "1/2\" hardware cloth", title = "a mink needs an inch", coin = "about a quarter" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const wire = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b9bdc2", metalness: 0.85, roughness: 0.35 }), []);
  const coinM = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d4b25a", metalness: 0.9, roughness: 0.3 }), []);
  const hexSegs = useMemo(() => { const s: [number, number, number, number][] = []; const R = 0.36; for (let r = -3; r <= 3; r++) for (let q = -2; q <= 2; q++) { const cx = q * R * 1.75 + (r % 2 ? R * 0.87 : 0), cy = r * R * 1.5; for (let k = 0; k < 6; k++) { const a1 = Math.PI / 6 + k * Math.PI / 3, a2 = a1 + Math.PI / 3; s.push([cx + R * Math.cos(a1), cy + R * Math.sin(a1), cx + R * Math.cos(a2), cy + R * Math.sin(a2)]); } } return s; }, []);
  const bar = (x1: number, y1: number, x2: number, y2: number, key: string, thick = 0.018) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return <mesh key={key} material={wire} position={[(x1 + x2) / 2, (y1 + y2) / 2, 0]} rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}><cylinderGeometry args={[thick, thick, L, 6]} /></mesh>; };
  const p = interpolate(f, [30, 80], [0, 1], { ...ease, easing: Easing.inOut(Easing.quad) });
  const zL = 2.5 - p * 5; const zR = interpolate(f, [30, 60, 75], [2.5, 0.12, 0.6], { ...ease, easing: Easing.out(Easing.quad) });
  const cam: [number, number, number] = [0, 0.3, 9.5];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e9dcc0, #cdb78f)" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: cam }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamLook pos={cam} />
        <hemisphereLight args={["#fffaf0", "#7a5a30", 1.1]} />
        <directionalLight position={[2, 3, 5]} intensity={1.6} />
        <group position={[-2.2, 0, 0]} rotation={[0, 0.35, 0]}>{hexSegs.map((s, i) => bar(s[0], s[1], s[2], s[3], "h" + i))}</group>
        <group position={[2.2, 0, 0]} rotation={[0, -0.35, 0]}>
          {Array.from({ length: 21 }).map((_, i) => bar(-1.8, -2.4 + i * 0.24, 1.8, -2.4 + i * 0.24, "x" + i, 0.02))}
          {Array.from({ length: 16 }).map((_, i) => bar(-1.8 + i * 0.24, -2.4, -1.8 + i * 0.24, 2.4, "y" + i, 0.02))}
        </group>
        <mesh material={coinM} position={[-2.2 + 0.0, 0.0, zL]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.23, 0.23, 0.04, 32]} /></mesh>
        <mesh material={coinM} position={[2.2, 0.0, zR]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.23, 0.23, 0.04, 32]} /></mesh>
      </ThreeCanvas>
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 9, color: OP.red, textTransform: "uppercase" }}>{title}</div>
      <div style={{ position: "absolute", left: 230, bottom: 70, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: OP.pencil }}>{left}</div>
      <div style={{ position: "absolute", right: 200, bottom: 70, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: OP.pencil }}>{right}</div>
      <div style={{ position: "absolute", left: "50%", top: 150, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: OP.pencilSoft }}>{coin}</div>
      <div style={{ position: "absolute", left: 300, top: 230, opacity: interpolate(f, [80, 88], [0, 1], ease) }}><Stamp text="goes right through" at={80} size={46} color={OP.red} rot={-6} style={{ background: "rgba(255,253,247,0.9)", mixBlendMode: "normal" }} /></div>
      <div style={{ position: "absolute", right: 280, top: 230, opacity: interpolate(f, [66, 74], [0, 1], ease) }}><Stamp text="stopped" at={66} size={56} color={OP.green} rot={-6} style={{ background: "rgba(255,253,247,0.9)", mixBlendMode: "normal" }} /></div>
    </AbsoluteFill>
  );
};
