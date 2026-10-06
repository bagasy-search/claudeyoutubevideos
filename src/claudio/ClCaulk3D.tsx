// ClCaulk3D — corte 3D (three.js) del rincón bañera-azulejo con el CORDÓN DE SILICONA semitransparente, apoyado en el baño del hotel (cama
// real + sombra + luz). El moho vive ADENTRO de la silicona (hilitos negros que se ven a través) y a veces DEBAJO, en la unión. Modos:
//   "inside"  el moho se ve a través de la silicona, latiendo (desde afuera parece una mancha)
//   "spray"   gotas de rocío caen sobre el cordón y chorrean al fondo de la bañera en un segundo: el moho sigue igual
//   "strips"  tiras de papel empapado + film encima; la humedad azul se mete en la silicona, luna → sol, el moho de adentro se apaga
//   "under"   el moho está DEBAJO, en la unión: las tiras no llegan (la humedad azul se frena en el cordón)
//   "seal"    silicona nueva encima de una unión húmeda: el agua queda encerrada y el moho rebrota por debajo
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin } from "./ClParts";

type Mode = "inside" | "spray" | "strips" | "under" | "seal";
const LEN = 3.2, R = 0.32;   // largo y radio del cordón (cuarto de cilindro en el rincón)
const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

export const ClCaulk3D: React.FC<{ mode?: Mode; labels?: { a?: string; b?: string }; bed?: string }> = ({ mode = "inside", labels = {}, bed }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const u = clamp01((f - 6) / Math.max(1, T * 0.8 - 6));
  const a = interpolate(f, [0, T], [0.55, 0.25], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [4.6, 3.9]);
  const target = new THREE.Vector3(0.2, 0.2, 0);
  const camPos = new THREE.Vector3(target.x + Math.sin(a) * dist, 1.7, target.z + Math.cos(a) * dist);
  // hilitos de moho: dentro del cordón (inside/spray/strips) o en la unión (under/seal)
  const hyph = useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const x = -LEN / 2 + 0.15 + rnd(i) * (LEN - 0.3), r0 = 0.05 + rnd(i + 3) * 0.2, th = Math.PI * (0.08 + 0.3 * rnd(i + 5));
    const P = Array.from({ length: 5 }, (_, k) => { const t = k / 4, rr = r0 * (1 - 0.5 * t); return new THREE.Vector3(x + 0.05 * Math.sin(t * 6 + i), rr * Math.sin(th + 0.2 * t), rr * Math.cos(th + 0.2 * t)); });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), 10, 0.012, 5, false);
  }), []);
  const deep = mode === "under" || mode === "seal";
  const nightK = mode === "strips" || mode === "under" ? clamp01((u - 0.2) / 0.65) : 0;
  const moldK = mode === "strips" ? 1 - ease(nightK) : mode === "seal" ? 0.3 + 0.7 * ease(clamp01((u - 0.35) / 0.55)) : 1;
  const stripK = mode === "strips" || mode === "under" ? ease(lin(f, 4, 22)) : 0;
  const filmK = mode === "strips" || mode === "under" ? ease(lin(f, 18, 34)) : 0;
  const wetDepth = mode === "strips" ? ease(nightK) : mode === "under" ? Math.min(0.55, ease(nightK)) : mode === "seal" ? 1 : 0;
  const mats = useMemo(() => ({
    tile: new THREE.MeshStandardMaterial({ color: "#EFE8DC", roughness: 0.15 }),
    grout: new THREE.MeshStandardMaterial({ color: "#CFC6B6", roughness: 0.9 }),
    tub: new THREE.MeshStandardMaterial({ color: "#FAFAF8", roughness: 0.12 }),
    caulk: new THREE.MeshStandardMaterial({ color: "#F3F3EE", roughness: 0.35, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }),
    hypha: new THREE.MeshStandardMaterial({ color: "#16170F", roughness: 0.5, transparent: true, opacity: 1 }),
    wet: new THREE.MeshStandardMaterial({ color: "#8EC3E6", transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }),
    strip: new THREE.MeshStandardMaterial({ color: "#F4EFE2", roughness: 0.95, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
    film: new THREE.MeshStandardMaterial({ color: "#E8F3FA", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }),
    drop: new THREE.MeshStandardMaterial({ color: "#DDEFFF", roughness: 0.05, transparent: true, opacity: 0.9 }),
    water: new THREE.MeshStandardMaterial({ color: "#7FB3D9", transparent: true, opacity: 0.5, depthWrite: false }),
  }), []);
  mats.hypha.opacity = clamp01(moldK);
  // cuarto de cilindro del cordón, eje X, en el rincón (y=0 bañera, z=0 pared)
  const caulkGeo = useMemo(() => new THREE.CylinderGeometry(R, R, LEN, 32, 1, true, 0, Math.PI / 2), []);
  const wetGeo = useMemo(() => new THREE.CylinderGeometry(R * 0.98, R * 0.98, LEN * 0.98, 32, 1, true, 0, Math.PI / 2), []);
  const drops = mode === "spray" ? Array.from({ length: 24 }, (_, i) => { const t = ((u * 2.2 + rnd(i)) % 1); const x = -LEN / 2 + 0.2 + rnd(i + 1) * (LEN - 0.4); const ph = t < 0.35 ? t / 0.35 : 1; const y = t < 0.35 ? 1.2 - 0.9 * ph : 0.3 - 0.25 * (t - 0.35) / 0.65; const z = t < 0.35 ? 0.5 - 0.2 * ph : 0.35 + 0.9 * (t - 0.35) / 0.65; return { p: new THREE.Vector3(x, Math.max(0.02, y), z), i }; }) : [];
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(32, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const base = proj(new THREE.Vector3(0, -0.1, 0.6));
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  if (labels.a) L.push({ at: deep ? new THREE.Vector3(0.3, 0.02, 0.02) : new THREE.Vector3(0.3, 0.12, 0.12), text: labels.a, dx: -260, dy: 200, t0: 10, alert: mode !== "strips" });
  if (labels.b) L.push({ at: new THREE.Vector3(-0.6, 0.25, 0.25), text: labels.b, dx: -300, dy: -180, t0: Math.round(T * 0.45) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={23} dim={0.38} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,252,246,0.72), rgba(255,252,246,0) 62%)" }} />
      <Contact x={base.x} y={base.y + 30} w={1100} o={0.32} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#FFFFFF", "#BFAE96", 0.45]} />
        <directionalLight position={[2, 6, 4]} intensity={1.1} color="#FFF1DA" />
        <directionalLight position={[-3, 2, 3]} intensity={0.35} />
        {/* pared de azulejos (plano z=0, hacia arriba) y borde de la bañera (plano y=0, hacia adelante) */}
        {Array.from({ length: 3 }, (_, i) => <mesh key={"t" + i} material={mats.tile} position={[-LEN / 2 + 0.55 + i * 1.07, 0.85, -0.03]}><boxGeometry args={[1.03, 1.6, 0.06]} /></mesh>)}
        {Array.from({ length: 2 }, (_, i) => <mesh key={"g" + i} material={mats.grout} position={[-LEN / 2 + 1.07 + i * 1.07, 0.85, -0.035]}><boxGeometry args={[0.04, 1.6, 0.05]} /></mesh>)}
        <mesh material={mats.tub} position={[0, -0.04, 0.9]}><boxGeometry args={[LEN + 0.2, 0.08, 1.8]} /></mesh>
        {/* el cordón de silicona + la humedad que entra + los hilitos de moho */}
        <mesh geometry={caulkGeo} material={mats.caulk} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]} />
        {wetDepth > 0.01 ? <mesh geometry={wetGeo} material={mats.wet} rotation={[0, 0, Math.PI / 2]} scale={[deep && mode === "under" ? 0.98 : 0.98, 1, 1]} /> : null}
        <group position={deep ? [0, -0.02, -0.02] : [0, 0, 0]} scale={deep ? [1, 0.35, 0.35] : [1, 1, 1]}>
          {hyph.map((g, i) => <mesh key={i} geometry={g} material={mats.hypha} scale={1 + 0.06 * Math.sin(f * 0.18 + i)} />)}
        </group>
        {mode === "seal" ? <mesh material={mats.water} position={[0, 0.02, 0.02]}><boxGeometry args={[LEN * 0.95, 0.03, 0.03]} /></mesh> : null}
        {/* tiras de papel y film encima del cordón */}
        {stripK > 0.01 ? Array.from({ length: 6 }, (_, i) => { const k = clamp01(stripK * 6 - i); if (k < 0.02) return null; return <mesh key={"s" + i} material={mats.strip} position={[-LEN / 2 + 0.3 + i * 0.52, R * 0.72, R * 0.72]} rotation={[-Math.PI / 4, 0, 0]} scale={[0.5, 0.55 * k, 1]}><planeGeometry args={[1, 1]} /></mesh>; }) : null}
        {filmK > 0.01 ? <mesh material={mats.film} position={[-LEN / 2 + LEN * filmK / 2, R * 0.78, R * 0.78]} rotation={[-Math.PI / 4, 0, 0]} scale={[LEN * filmK, 0.75, 1]}><planeGeometry args={[1, 1]} /></mesh> : null}
        {drops.map((d) => <mesh key={d.i} position={d.p} material={mats.drop}><sphereGeometry args={[0.035, 8, 6]} /></mesh>)}
      </ThreeCanvas>
      <RoomLight k={0.6} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={10} fill={l.alert ? CL.red : CL.yellow} stroke={CL.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={CL.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        return (<div key={i} style={{ position: "absolute", left: p.x + l.dx, top: p.y + l.dy, translate: `${l.dx < 0 ? "-100%" : "0%"} -50%`, opacity: k, background: l.alert ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${l.alert ? "#8E1F17" : CL.yellow}` }}>{l.text}</div>);
      })}
      {mode === "strips" || mode === "under" ? (
        <div style={{ position: "absolute", right: 140, top: 110, width: 170, height: 170, borderRadius: "50%", opacity: lin(f, 4, 14), background: `radial-gradient(circle at 40% 40%, ${nightK < 0.8 ? "#F6F0D8" : "#FFE07A"}, ${nightK < 0.8 ? "#C9C2A6" : "#F2B330"})`, boxShadow: nightK < 0.8 ? "0 0 0 12px rgba(30,45,79,0.85)" : "0 0 70px rgba(242,194,48,0.8)" }}>
          {nightK < 0.8 ? <div style={{ position: "absolute", left: 60, top: -6, width: 130, height: 130, borderRadius: "50%", background: "rgba(30,45,79,0.95)" }} /> : null}
          <div style={{ position: "absolute", top: 190, left: -40, width: 250, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CL.navy }}>{nightK < 0.8 ? "8 horas" : "a la mañana"}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
