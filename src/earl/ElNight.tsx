// Componentes de "una noche en el barco" (Earl): reloj de la noche sobre el mar (sol/luna cruzan, la hora avanza
// hasta `to`), cascada de la cuenta (de lo que paga el muelle a lo que le queda al capitán) y el excluidor de tortugas
// en 3D real (red + rejilla + tortuga que sale por la tapa).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EL, LABEL, MARKER, STENCIL, BODY } from "./ElTheme";
import { Stamp, Tape, ease } from "./ElParts";

const toMin = (s: string) => { const m = s.match(/(\d+):(\d+)\s*(am|pm)/i)!; let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return h * 60 + +m[2]; };
const fmt = (min: number) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = m % 60; return `${h % 12 || 12}:${String(mm).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };

// reloj de la noche: el cielo pasa de tarde a noche a amanecer; label = lo que pasa a esa hora
export const ElNightClock: React.FC<{ from: string; to: string; label?: string; seed?: number }> = ({ from, to, label }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const a = toMin(from); let b = toMin(to); if (b <= a) b += 1440;
  const k = interpolate(f, [0, durationInFrames - 6], [0, 1], { ...ease, easing: Easing.inOut(Easing.quad) });
  const t = a + (b - a) * k; const hour = ((t / 60) % 24 + 24) % 24;
  const night = hour >= 19 || hour < 6 ? 1 : hour >= 17 ? (hour - 17) / 2 : hour >= 6 && hour < 7.5 ? 1 - (hour - 6) / 1.5 : 0;
  const sky = `linear-gradient(${night > 0.5 ? "#0b1530" : "#f2a65a"}, ${night > 0.5 ? "#1e3a5f" : "#f7d9a8"})`;
  const sunA = interpolate(hour >= 12 ? hour : hour + 24, [12, 20, 29, 31], [0.2, 1, 0, 0.3], ease);
  const moonX = interpolate((hour + 24 - 18) % 24, [0, 12], [8, 52], ease);
  return (
    <AbsoluteFill style={{ background: sky }}>
      <AbsoluteFill style={{ background: "linear-gradient(#f2a65a, #f7d9a8)", opacity: 1 - night }} />
      <div style={{ position: "absolute", left: `${moonX}%`, top: 160, width: 90, height: 90, borderRadius: 45, background: "#f4f1e0", boxShadow: "0 0 40px rgba(255,255,230,0.6)", opacity: night }} />
      <div style={{ position: "absolute", left: "70%", top: `${20 + sunA * 40}%`, width: 140, height: 140, borderRadius: 70, background: "#ffcf5a", boxShadow: "0 0 80px #ffb347", opacity: 1 - night }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, background: `linear-gradient(${night > 0.5 ? "#15284a" : "#3f7fa0"}, ${night > 0.5 ? "#0a1426" : "#245a78"})` }} />
      {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 157 + f * 2) % 1920, bottom: 80 + (i % 5) * 60, width: 120, height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 2 }} />)}
      <div style={{ position: "absolute", left: 200, bottom: 300, width: 300, height: 70, background: "#e8e8e2", clipPath: "polygon(0 30%, 100% 30%, 92% 100%, 6% 100%)" }} />
      <div style={{ position: "absolute", left: 300, bottom: 360, width: 70, height: 50, background: "#f4f6f4" }} />
      <div style={{ position: "absolute", left: 230, bottom: 340, width: 6, height: 230, background: "#ddd", transform: "rotate(-35deg)", transformOrigin: "bottom" }} />
      <div style={{ position: "absolute", left: 460, bottom: 340, width: 6, height: 230, background: "#ddd", transform: "rotate(35deg)", transformOrigin: "bottom" }} />
      {night > 0.4 ? <div style={{ position: "absolute", left: 255, bottom: 380, width: 220, height: 80, background: "radial-gradient(ellipse, rgba(255,250,200,0.6), transparent 70%)" }} /> : null}
      <div style={{ position: "absolute", right: 140, top: 140, textAlign: "right" }}>
        <div style={{ fontFamily: STENCIL, fontSize: 150, color: EL.white, lineHeight: 1, textShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>{fmt(t)}</div>
        {label ? <div style={{ fontFamily: MARKER, fontSize: 58, color: "#ffe9a8", textShadow: "0 3px 10px rgba(0,0,0,0.6)", marginTop: 10 }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// cascada: barra inicial y restas que van comiendo hasta lo que le queda al capitán
export const ElMoneyFall: React.FC<{ start: { label: string; amount: number }; minus: { label: string; amount: number }[]; endLabel?: string; every?: number; title?: string; note?: string }> = ({ start, minus, endLabel = "left for the boat & captain", every = 40, title = "a good night · the math", note }) => {
  const f = useCurrentFrame();
  const W = 1500, X0 = 210, max = start.amount; const px = (v: number) => (v / max) * W;
  let run = start.amount;
  const rows = minus.map((m) => { const r = { ...m, from: run - m.amount }; run -= m.amount; return r; });
  const end = run;
  const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${EL.cooler}, ${EL.cooler2})` }}>
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 56, color: EL.navy, textTransform: "uppercase" }}>{title}</div>
      {[{ label: start.label, from: 0, amount: start.amount, plus: true }, ...rows.map((r) => ({ ...r, plus: false }))].map((r, i) => {
        const at = 10 + i * every; const k = interpolate(f, [at, at + 14], [0, 1], ease); const y = 180 + i * 118;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: y, width: "100%", opacity: interpolate(f, [at, at + 4], [0, 1], ease) }}>
            <div style={{ position: "absolute", left: X0 + px(r.from), top: 0, width: px(r.amount) * k, height: 80, background: r.plus ? EL.green : EL.red, borderRadius: 8 }} />
            <div style={{ position: "absolute", left: X0, top: 84, fontFamily: MARKER, fontSize: 36, color: EL.marker }}>{r.label} <span style={{ color: r.plus ? EL.green : EL.red }}>{r.plus ? "" : "−"}{money(r.amount)}</span></div>
          </div>
        );
      })}
      {(() => { const at = 10 + (minus.length + 1) * every; const y = 180 + (minus.length + 1) * 118; return (
        <div style={{ position: "absolute", left: X0, top: y, opacity: interpolate(f, [at, at + 6], [0, 1], ease), display: "flex", alignItems: "baseline", gap: 30 }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 86, color: EL.navy }}>{money(end)}</div>
          <div style={{ fontFamily: MARKER, fontSize: 44, color: EL.marker }}>{endLabel}</div>
          {note ? <Tape text={note} size={36} rot={-3} /> : null}
        </div>); })()}
    </AbsoluteFill>
  );
};

// excluidor de tortugas 3D: red en embudo (wireframe), rejilla metálica y una tortuga que entra, choca y sale por arriba
const CamLook: React.FC<{ pos: [number, number, number] }> = ({ pos }) => { const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); return null; };
export const ElTED3D: React.FC<{ title?: string; label?: string; enterAt?: number }> = ({ title = "the turtle excluder", label = "the turtle slides out · the shrimp go on", enterAt = 10 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const m = useMemo(() => ({
    net: new THREE.MeshBasicMaterial({ color: "#2e6b4f", wireframe: true, transparent: true, opacity: 0.55 }),
    grid: new THREE.MeshStandardMaterial({ color: "#c9ccd0", metalness: 0.8, roughness: 0.3 }),
    shell: new THREE.MeshStandardMaterial({ color: "#6b5a2e", roughness: 0.7 }),
    skin: new THREE.MeshStandardMaterial({ color: "#8a9a5b", roughness: 0.8 }),
    shrimp: new THREE.MeshStandardMaterial({ color: "#d9b8a8", roughness: 0.6 }),
  }), []);
  const p = interpolate(f, [enterAt, enterAt + 60], [0, 1], { ...ease, easing: Easing.inOut(Easing.cubic) });
  const out = interpolate(f, [enterAt + 60, enterAt + 100], [0, 1], { ...ease, easing: Easing.out(Easing.cubic) });
  const tx = -3 + p * 3.1, ty = out * 1.8, rot = out * -0.9;
  const cam: [number, number, number] = [0.5, 1.6, 6.2];
  const shr = Array.from({ length: 10 }, (_, i) => ({ x: -3.5 + ((f * 0.04 + i * 0.7) % 7), y: -0.3 + (i % 3) * 0.25, z: -0.3 + (i % 4) * 0.2 }));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2f6f8f, #0f2a3f)" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: cam }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamLook pos={cam} />
        <hemisphereLight args={["#cfe8ff", "#0b1d2a", 1.0]} />
        <directionalLight position={[2, 5, 4]} intensity={1.6} />
        <mesh material={m.net} rotation={[0, 0, Math.PI / 2]} position={[0.5, 0, 0]}><cylinderGeometry args={[0.9, 1.6, 7, 16, 8, true]} /></mesh>
        <group position={[0.2, 0, 0]} rotation={[0, 0.9, -0.35]}>
          {Array.from({ length: 6 }).map((_, i) => <mesh key={i} material={m.grid} position={[0, -0.75 + i * 0.3, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 1.75, 8]} /></mesh>)}
          {Array.from({ length: 6 }).map((_, i) => <mesh key={"v" + i} material={m.grid} position={[-0.75 + i * 0.3, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 1.75, 8]} /></mesh>)}
          <mesh material={m.grid}><torusGeometry args={[0.95, 0.06, 8, 32]} /></mesh>
        </group>
        <group position={[tx, ty, 0]} rotation={[0, 0, rot]}>
          <mesh material={m.shell} scale={[0.55, 0.22, 0.45]}><sphereGeometry args={[1, 24, 16]} /></mesh>
          <mesh material={m.skin} position={[0.62, 0, 0]} scale={[0.18, 0.13, 0.14]}><sphereGeometry args={[1, 16, 12]} /></mesh>
          {[[0.25, 0.42], [0.25, -0.42], [-0.3, 0.38], [-0.3, -0.38]].map(([x, z], i) => <mesh key={i} material={m.skin} position={[x, -0.02, z]} rotation={[0, (i % 2 ? -1 : 1) * 0.6 + Math.sin(f / 5 + i) * 0.3, 0]} scale={[0.28, 0.04, 0.1]}><sphereGeometry args={[1, 12, 8]} /></mesh>)}
        </group>
        {shr.map((s, i) => <mesh key={"s" + i} material={m.shrimp} position={[s.x, s.y, s.z]} scale={[0.12, 0.05, 0.05]}><sphereGeometry args={[1, 10, 8]} /></mesh>)}
      </ThreeCanvas>
      <div style={{ position: "absolute", top: 56, width: "100%", textAlign: "center" }}><span style={{ background: EL.navy, color: EL.white, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 9, padding: "8px 28px", textTransform: "uppercase" }}>{title}</span></div>
      <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center", opacity: interpolate(f, [enterAt + 70, enterAt + 80], [0, 1], ease) }}><Stamp text={label} at={enterAt + 70} size={46} color={EL.green} rot={-2} style={{ background: "rgba(255,255,255,0.9)", mixBlendMode: "normal" }} /></div>
    </AbsoluteFill>
  );
};
