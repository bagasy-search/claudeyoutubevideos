// OleCoalOven3D — 3D real: Dutch oven de campamento de 12" con la regla de las briquetas (diámetro ×2, 2/3 arriba y 1/3 abajo).
// Secuencia (todo por el cuadro): la olla sobre sus patas → entran las briquetas de abajo (glow) → la tapa → caen las de arriba → 1/4 de giro
// (olla y tapa en sentidos opuestos). Contadores y rótulos por props (inglés). Reusa la olla/tapa de OleDutchOven3D (hierro fundido).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, LABEL, HAND, SERIF, hexA, rnd } from "./OleTheme";
import { CamRig, clamp01, easeOut, ease, makeIronMats, usePotGeoms, RIM, projectTo, canvasTex, dots } from "./OleDutchOven3D";

export type OleCoalOven3DProps = {
  top?: number; bottom?: number;
  labels?: { top?: string; bottom?: string; temp?: string; turn?: string; rule?: string };
  /** segundos: [abajo, tapa, arriba, giro] */
  beats?: [number, number, number, number];
};

const ringPts = (n: number, r: number, off = 0) => Array.from({ length: n }).map((_, i) => { const a = off + (i / n) * Math.PI * 2; return [Math.cos(a) * r, Math.sin(a) * r] as [number, number]; });

const Briq: React.FC<{ x: number; y: number; z: number; rot: number; glow: number; geo: any; mats: { ash: any; hot: any } }> = ({ x, y, z, rot, glow, geo, mats }) => (
  <mesh geometry={geo} material={glow > 0.5 ? mats.hot : mats.ash} position={[x, y, z]} rotation={[0, rot, 0]} />
);

export const OleCoalOven3D: React.FC<OleCoalOven3DProps> = ({ top = 16, bottom = 8, labels = {}, beats = [0.6, 2.2, 3.0, 5.6] }) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig(); const t = f / fps;
  const mats = useMemo(() => makeIronMats(), []); const geo = usePotGeoms();
  const bg = useMemo(() => new THREE.BoxGeometry(0.26, 0.13, 0.26), []);
  const bm = useMemo(() => ({
    ash: new THREE.MeshStandardMaterial({ map: canvasTex((c, W, H) => { c.fillStyle = "#6f6a64"; c.fillRect(0, 0, W, H); dots(c, W, H, 7, 300, "#a9a49d", 0.6, 2, 0.6); dots(c, W, H, 3, 200, "#3a3733", 0.6, 2.2, 0.5); }, 128, 128), roughness: 0.95 }),
    hot: new THREE.MeshStandardMaterial({ color: "#3a2a22", emissive: "#ff6a1e", emissiveIntensity: 1.0, roughness: 0.8 }),
  }), []);
  const [tB, tL, tT, tR] = beats;
  const under = ringPts(bottom, 0.62); const topR = [...ringPts(Math.ceil(top * 0.55), 0.78, 0.2), ...ringPts(Math.floor(top * 0.45), 0.4, 0.5)].slice(0, top);
  const turn = ease(clamp01((t - tR) / 1.6)) * (Math.PI / 2);
  const camPos: [number, number, number] = [3.2 - 0.8 * ease(clamp01(t / 6)), 3.4, 4.8]; const tgt: [number, number, number] = [0, 0.75, 0]; const fov = 34;
  const lidY = (1 - easeOut(clamp01((t - tL) / 0.8))) * 2.4;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4b3a2b, #1d130a 85%)" }}>
      <ThreeCanvas width={width} height={height} camera={{ position: camPos, fov, near: 0.1, far: 60 }}>
        <CamRig pos={camPos} target={tgt} fov={fov} />
        <ambientLight intensity={0.7} color="#ffe2bd" />
        <directionalLight position={[3, 6, 4]} intensity={1.6} />
        <pointLight position={[0, 0.2, 0]} intensity={t > tB ? 26 : 0} color="#ff7a2a" distance={6} decay={1.6} />
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[4.4, 48]} /><meshStandardMaterial color="#2a2118" roughness={1} /></mesh>
        <group rotation={[0, turn, 0]} position={[0, 0.5, 0]}>
          {[0, 1, 2].map((k) => { const a = (k / 3) * Math.PI * 2 + 0.5; return <mesh key={k} position={[Math.cos(a) * 0.7, -0.22, Math.sin(a) * 0.7]} material={mats.iron}><cylinderGeometry args={[0.07, 0.05, 0.5, 10]} /></mesh>; })}
          <mesh geometry={geo.body} material={mats.iron} />
          <mesh geometry={geo.hL} material={mats.iron} /><mesh geometry={geo.hR} material={mats.iron} />
        </group>
        {under.map(([x, z], i) => { const a = easeOut(clamp01((t - tB - i * 0.08) / 0.5)); if (a <= 0) return null;
          return <Briq key={i} x={x * 1.05} y={0.06 + (1 - a) * 2} z={z * 1.05} rot={rnd(i) * 3} glow={1} geo={bg} mats={bm} />; })}
        <group rotation={[0, -turn, 0]} position={[0, 0.5 + RIM + lidY, 0]}>
          <mesh geometry={geo.lid} material={mats.ironLid} />
          <mesh geometry={geo.knob} material={mats.ironLid} position={[0, 0.1, 0]} />
        </group>
        {topR.map(([x, z], i) => { const a = easeOut(clamp01((t - tT - i * 0.1) / 0.5)); if (a <= 0) return null;
          return <group key={i} rotation={[0, -turn, 0]}><Briq x={x} y={0.5 + RIM + 0.19 + (1 - a) * 2.4} z={z} rot={rnd(i + 20) * 3} glow={i % 2} geo={bg} mats={bm} /></group>; })}
      </ThreeCanvas>
      {(() => { const tp = projectTo([0, 0.5 + RIM + 0.6, 0], camPos, tgt, fov, width, height); const bt = projectTo([-1.35, 0.35, 0.9], camPos, tgt, fov, width, height);
        const Lb: React.FC<{ n: number; txt?: string; x: number; y: number; a: number; c: string }> = ({ n, txt, x, y, a, c }) => (
          <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: a, scale: String(0.9 + 0.1 * a), display: "flex", gap: 18, alignItems: "center", background: hexA(OLE.cream, 0.96), padding: "10px 24px", borderRadius: 8, border: `4px solid ${c}`, boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: c, lineHeight: 0.9 }}>{n}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: OLE.pencil, whiteSpace: "nowrap" }}>{txt}</div></div>);
        return (<>
          <Lb n={top} txt={labels.top} x={tp[0] + 380} y={tp[1] + 30} a={easeOut(clamp01((t - tT - 1.0) / 0.6))} c={OLE.fire} />
          <Lb n={bottom} txt={labels.bottom} x={bt[0] - 250} y={bt[1] + 40} a={easeOut(clamp01((t - tB - 1.0) / 0.6))} c={OLE.enamel} />
          {labels.temp ? <div style={{ position: "absolute", top: 150, left: 80, fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 6, color: OLE.ember, opacity: easeOut(clamp01((t - tT - 2) / 0.6)) }}>{labels.temp}</div> : null}
          {labels.turn ? <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: OLE.paper, textShadow: "0 3px 8px rgba(0,0,0,0.8)", opacity: easeOut(clamp01((t - tR) / 0.6)) }}>{labels.turn}</div> : null}
          {labels.rule ? <div style={{ position: "absolute", top: 60, left: 80, fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: hexA(OLE.kraftL, 0.95), opacity: easeOut(clamp01(t / 0.6)) }}>{labels.rule}</div> : null}
        </>); })()}
    </AbsoluteFill>
  );
};
export default OleCoalOven3D;
