// ClWasher3D — lavarropas de carga frontal en 3D (three.js) apoyado en el lavadero del hotel (cama real + sombra + luz del cuarto).
// Modos (reusable por el canal):
//   "peel"   un dedo de guante azul tira del labio de abajo de la goma → aparece el PLIEGUE negro con moho
//   "spray"  igual, con el rocío y la espuma blanca encima del moho, que se va aclarando
//   "cycle"  puerta cerrada, el tambor vacío gira detrás del vidrio con agua caliente y vapor; rótulo de temperatura + "1 taza"
//   "ajar"   puerta entreabierta: entra el aire (flechas) y las gotas del pliegue se secan
//   "filter" la tapita de abajo se abre, el filtro se desenrosca y el agua cae a la bandeja baja
// labels.{a,b} = rótulos dentro del mundo (proyectados desde el punto 3D real).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin } from "./ClParts";

type Mode = "peel" | "spray" | "cycle" | "ajar" | "filter";
const DOOR = new THREE.Vector3(0, 0.15, 0.5);   // centro de la boca (frente del gabinete z=0.5)
const RG = 0.62;                                 // radio de la goma
const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
const arcPt = (t: number, r = RG, z = DOOR.z + 0.02) => new THREE.Vector3(DOOR.x + r * Math.cos(t), DOOR.y + r * Math.sin(t), z);

export const ClWasher3D: React.FC<{ mode?: Mode; labels?: { a?: string; b?: string }; temp?: string; bed?: string }> = ({ mode = "peel", labels = {}, temp = "El más caliente", bed }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const u = clamp01((f - 6) / Math.max(1, T * 0.8 - 6));
  const close = mode === "peel" || mode === "spray";
  const a = interpolate(f, [0, T], close ? [-0.18, 0.08] : [-0.35, 0.2], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], close ? [2.6, 2.0] : mode === "filter" ? [3.4, 2.9] : [4.6, 4.0]);
  const target = close ? new THREE.Vector3(0, -0.28, 0.5) : mode === "filter" ? new THREE.Vector3(-0.35, -0.75, 0.5) : new THREE.Vector3(0, 0.05, 0.3);
  const camPos = new THREE.Vector3(target.x + Math.sin(a) * dist, target.y + (close ? 0.7 : mode === "filter" ? 0.35 : 0.9), target.z + Math.cos(a) * dist);
  const peelK = close ? ease(clamp01((f - 8) / Math.max(1, T * 0.35))) : mode === "ajar" ? 0 : 0;
  const foamK = mode === "spray" ? clamp01((f - T * 0.22) / (T * 0.3)) : 0;
  const moldLeft = mode === "spray" ? 1 - 0.85 * clamp01((f - T * 0.45) / (T * 0.4)) : mode === "ajar" ? 0 : 1;
  const doorAng = mode === "cycle" ? 0 : mode === "ajar" ? -0.32 : mode === "filter" ? 0 : -1.75;
  const drumRot = mode === "cycle" ? f * 0.22 * clamp01(f / 20) : 0;
  const filterK = mode === "filter" ? ease(clamp01((f - 10) / (T * 0.35))) : 0;
  const waterK = mode === "filter" ? clamp01((f - T * 0.35) / (T * 0.5)) : 0;

  const geo = useMemo(() => ({
    gasketTop: new THREE.TorusGeometry(RG, 0.085, 16, 64, Math.PI * 1.2),
    gasketLip: new THREE.TorusGeometry(RG, 0.085, 16, 48, Math.PI * 0.8),
    fold: new THREE.TorusGeometry(RG - 0.05, 0.06, 12, 48, Math.PI * 0.8),
    drum: new THREE.CylinderGeometry(0.56, 0.56, 0.8, 48, 1, true),
    door: new THREE.TorusGeometry(0.66, 0.1, 16, 64),
    glass: new THREE.CircleGeometry(0.58, 48),
  }), []);
  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: "#F4F4F2", roughness: 0.35 }),
    panel: new THREE.MeshStandardMaterial({ color: "#DADCDF", roughness: 0.4 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#8E9399", roughness: 0.75, side: THREE.DoubleSide }),
    fold: new THREE.MeshStandardMaterial({ color: "#2A2A26", roughness: 0.8, side: THREE.DoubleSide }),
    mold: new THREE.MeshStandardMaterial({ color: "#151510", roughness: 0.6 }),
    drum: new THREE.MeshStandardMaterial({ color: "#C9CED4", metalness: 0.4, roughness: 0.3, side: THREE.DoubleSide }),
    drumHole: new THREE.MeshStandardMaterial({ color: "#6E747B", roughness: 0.6 }),
    door: new THREE.MeshStandardMaterial({ color: "#E8EAEC", roughness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: "#BFD3E3", transparent: true, opacity: 0.32, roughness: 0.05, depthWrite: false, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: "#A9CBE3", transparent: true, opacity: 0.55, roughness: 0.05, depthWrite: false }),
    foam: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.6, transparent: true, opacity: 0.95 }),
    glove: new THREE.MeshStandardMaterial({ color: CL.nitrile, roughness: 0.45 }),
    drop: new THREE.MeshStandardMaterial({ color: "#DDEFFF", roughness: 0.05, transparent: true, opacity: 0.9 }),
    tray: new THREE.MeshStandardMaterial({ color: "#B9BEC4", metalness: 0.3, roughness: 0.4 }),
    steam: new THREE.MeshStandardMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.35, depthWrite: false }),
  }), []);
  mats.mold.opacity = moldLeft; mats.mold.transparent = true;

  // el labio de abajo (de 200° a 340°) se dobla hacia afuera y abajo con el dedo
  const lipRot = peelK * 0.9;
  const fingerP = arcPt(-Math.PI / 2, RG + 0.05 + 0.15 * peelK, DOOR.z + 0.12 + 0.22 * peelK);
  const molds = Array.from({ length: 26 }, (_, i) => { const t = Math.PI * 1.12 + (i / 25) * Math.PI * 0.76 + (rnd(i) - 0.5) * 0.05; return { p: arcPt(t, RG - 0.05 - 0.02 * rnd(i + 3), DOOR.z - 0.02 + 0.03 * rnd(i + 5)), s: 0.018 + 0.03 * rnd(i + 7), i }; });
  const foams = Array.from({ length: 34 }, (_, i) => { const t = Math.PI * 1.15 + rnd(i * 3) * Math.PI * 0.7; const k = clamp01(foamK * 1.6 - rnd(i) * 0.6); return { p: arcPt(t, RG - 0.04, DOOR.z + 0.01 + 0.03 * rnd(i + 2)), s: k * (0.02 + 0.025 * rnd(i + 9)), i }; });
  const mist = mode === "spray" ? Array.from({ length: 40 }, (_, i) => { const t = ((f * 0.03 + rnd(i)) % 1); if (f > T * 0.45) return null; return { p: new THREE.Vector3(0.35 - 0.4 * t + (rnd(i + 1) - 0.5) * 0.2, 0.2 - 0.55 * t + (rnd(i + 2) - 0.5) * 0.15, 1.3 - 0.75 * t), i }; }).filter(Boolean) as any[] : [];
  const steam = mode === "cycle" ? Array.from({ length: 18 }, (_, i) => { const t = ((f * 0.012 + rnd(i)) % 1); return { p: new THREE.Vector3(DOOR.x + (rnd(i + 3) - 0.5) * 0.5, DOOR.y - 0.2 + 0.6 * t, DOOR.z - 0.25), s: 0.08 + 0.12 * t, o: Math.sin(Math.PI * t), i }; }) : [];
  const drops = mode === "ajar" ? Array.from({ length: 16 }, (_, i) => { const t = Math.PI * 1.15 + (i / 15) * Math.PI * 0.7; return { p: arcPt(t, RG - 0.02, DOOR.z + 0.05), s: (0.02 + 0.015 * rnd(i)) * (1 - ease(clamp01((f - T * 0.25 - rnd(i) * T * 0.3) / (T * 0.3)))), i }; }) : [];

  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(32, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const base = proj(new THREE.Vector3(0, -1.2, 0.2));
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  if (labels.a) L.push({ at: close ? arcPt(-Math.PI * 0.62, RG - 0.04) : mode === "filter" ? new THREE.Vector3(-0.6, -0.95, 0.52) : DOOR.clone().add(new THREE.Vector3(0.3, 0.3, 0)), text: labels.a, dx: close ? -360 : 300, dy: close ? 120 : -160, t0: Math.round(T * (close ? 0.3 : 0.15)), alert: close && mode === "peel" });
  if (labels.b) L.push({ at: close ? arcPt(-Math.PI * 0.35, RG - 0.04) : mode === "filter" ? new THREE.Vector3(-0.6, -1.15, 0.9) : DOOR.clone(), text: labels.b, dx: 300, dy: 160, t0: Math.round(T * 0.55) });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={13} dim={0.36} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,252,246,0.7), rgba(255,252,246,0) 62%)" }} />
      <Contact x={base.x} y={base.y} w={900} o={0.4} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#FFFFFF", "#BFAE96", 0.5]} />
        <directionalLight position={[-2, 5, 4]} intensity={1.1} color="#FFF1DA" />
        <directionalLight position={[3, 1, 3]} intensity={0.35} />
        {/* gabinete: frente con la boca (4 paneles alrededor), costados, tapa, panel de mandos */}
        <mesh material={mats.body} position={[0, 0.95, 0]}><boxGeometry args={[1.7, 0.1, 1.0]} /></mesh>
        <mesh material={mats.body} position={[-0.85, -0.15, 0]}><boxGeometry args={[0.02, 2.1, 1.0]} /></mesh>
        <mesh material={mats.body} position={[0.85, -0.15, 0]}><boxGeometry args={[0.02, 2.1, 1.0]} /></mesh>
        <mesh material={mats.panel} position={[0, 0.78, 0.5]}><boxGeometry args={[1.7, 0.25, 0.04]} /></mesh>
        <mesh material={mats.body} position={[0, -0.85, 0.5]}><boxGeometry args={[1.7, 0.7, 0.04]} /></mesh>
        <mesh material={mats.body} position={[-0.78, 0.15, 0.5]}><boxGeometry args={[0.14, 1.3, 0.04]} /></mesh>
        <mesh material={mats.body} position={[0.78, 0.15, 0.5]}><boxGeometry args={[0.14, 1.3, 0.04]} /></mesh>
        <mesh material={mats.body} position={[0, 0.72, 0.5]}><boxGeometry args={[1.42, 0.06, 0.04]} /></mesh>
        {[0, 1, 2].map((i) => <mesh key={i} material={mats.drumHole} position={[0.35 + i * 0.13, 0.78, 0.53]}><cylinderGeometry args={[0.035, 0.035, 0.03, 16]} /></mesh>)}
        <mesh material={mats.panel} position={[-0.45, 0.78, 0.52]}><boxGeometry args={[0.45, 0.13, 0.02]} /></mesh>
        {/* tambor (gira en el ciclo) */}
        <group position={[DOOR.x, DOOR.y, 0.05]} rotation={[Math.PI / 2, drumRot, 0]}>
          <mesh geometry={geo.drum} material={mats.drum} />
          {Array.from({ length: 36 }, (_, i) => { const t = (i % 12) / 12 * Math.PI * 2, y = -0.25 + Math.floor(i / 12) * 0.25; return <mesh key={i} material={mats.drumHole} position={[0.55 * Math.cos(t), y, 0.55 * Math.sin(t)]} rotation={[0, -t, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.02, 8]} /></mesh>; })}
        </group>
        {mode === "cycle" ? <mesh material={mats.water} position={[DOOR.x, DOOR.y - 0.33, 0.1]}><boxGeometry args={[1.0, 0.22, 0.7]} /></mesh> : null}
        {steam.map((s) => <mesh key={s.i} position={s.p} scale={s.s * 6} material={mats.steam}><sphereGeometry args={[0.05, 8, 6]} /></mesh>)}
        {/* goma: arco de arriba fijo + labio de abajo que se dobla; el pliegue negro detrás del labio */}
        <mesh geometry={geo.gasketTop} material={mats.rubber} position={[DOOR.x, DOOR.y, DOOR.z]} rotation={[0, 0, -Math.PI * 0.1]} />
        <mesh geometry={geo.fold} material={mats.fold} position={[DOOR.x, DOOR.y, DOOR.z - 0.02]} rotation={[0, 0, Math.PI * 1.1]} />
        <group position={[DOOR.x, DOOR.y - RG, DOOR.z]} rotation={[lipRot, 0, 0]}>
          <mesh geometry={geo.gasketLip} material={mats.rubber} position={[0, RG, 0]} rotation={[0, 0, Math.PI * 1.1]} />
        </group>
        {moldLeft > 0.02 ? molds.map((m) => <mesh key={m.i} position={m.p} scale={1 + 0.15 * Math.sin(f * 0.15 + m.i)} material={mats.mold}><sphereGeometry args={[m.s, 10, 8]} /></mesh>) : null}
        {foams.map((b) => (b.s > 0.003 ? <mesh key={b.i} position={b.p} scale={b.s * 30} material={mats.foam}><sphereGeometry args={[0.03, 8, 6]} /></mesh> : null))}
        {mist.map((m) => <mesh key={m.i} position={m.p} material={mats.drop}><sphereGeometry args={[0.012, 6, 4]} /></mesh>)}
        {drops.map((d) => (d.s > 0.002 ? <mesh key={d.i} position={d.p} material={mats.drop}><sphereGeometry args={[d.s, 8, 6]} /></mesh> : null))}
        {close ? <group position={fingerP} rotation={[0.9, 0, 0]}><mesh material={mats.glove}><capsuleGeometry args={[0.07, 0.4, 6, 12]} /></mesh><mesh material={mats.glove} position={[0, 0.35, -0.12]} rotation={[0.6, 0, 0]}><capsuleGeometry args={[0.16, 0.25, 6, 12]} /></mesh></group> : null}
        {/* puerta con bisagra a la izquierda */}
        <group position={[DOOR.x - 0.7, DOOR.y, DOOR.z + 0.08]} rotation={[0, doorAng, 0]}>
          <mesh geometry={geo.door} material={mats.door} position={[0.7, 0, 0]} />
          <mesh geometry={geo.glass} material={mats.glass} position={[0.7, 0, 0.02]} />
        </group>
        {/* filtro: tapita abajo a la izquierda, tapón que se desenrosca, bandeja y chorro */}
        {mode === "filter" ? <>
          <group position={[-0.62, -0.95, 0.53]} rotation={[-1.7 * filterK, 0, 0]}><mesh material={mats.panel} position={[0, -0.09, 0]}><boxGeometry args={[0.3, 0.2, 0.02]} /></mesh></group>
          <group position={[-0.62, -0.95, 0.53 + 0.25 * filterK]} rotation={[Math.PI / 2, f * 0.15 * (filterK < 1 ? 1 : 0), 0]}>
            <mesh material={mats.drumHole}><cylinderGeometry args={[0.09, 0.09, 0.08, 20]} /></mesh>
            <mesh material={mats.body} position={[0, 0.05, 0]}><boxGeometry args={[0.16, 0.03, 0.04]} /></mesh>
          </group>
          <mesh material={mats.tray} position={[-0.55, -1.2, 0.85]}><boxGeometry args={[0.9, 0.05, 0.5]} /></mesh>
          <mesh material={mats.water} position={[-0.55, -1.17, 0.85]} scale={[waterK, 1, waterK]}><boxGeometry args={[0.85, 0.02, 0.45]} /></mesh>
          {waterK > 0 && waterK < 0.95 ? <mesh material={mats.water} position={[-0.62, -1.07, 0.7]}><cylinderGeometry args={[0.03, 0.05, 0.22, 10]} /></mesh> : null}
        </> : null}
      </ThreeCanvas>
      <RoomLight k={0.6} />
      {mode === "ajar" ? (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: lin(f, 8, 18) }}>
          {[0, 1, 2].map((i) => { const k = ((f * 0.02 + i / 3) % 1); const p = proj(new THREE.Vector3(0.9 - 0.9 * k, 0.4 - 0.15 * i, 1.2 - 0.6 * k)); return <path key={i} d={`M ${p.x} ${p.y} q 60 -30 120 0 t 120 0`} stroke={CL.navy} strokeWidth={8} fill="none" strokeLinecap="round" opacity={Math.sin(Math.PI * k)} />; })}
        </svg>
      ) : null}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={10} fill={l.alert ? CL.red : CL.yellow} stroke={CL.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={CL.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        return (<div key={i} style={{ position: "absolute", left: p.x + l.dx, top: p.y + l.dy, translate: `${l.dx < 0 ? "-100%" : "0%"} -50%`, opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${l.alert ? "#8E1F17" : CL.yellow}` }}>{l.text}</div>);
      })}
      {mode === "cycle" ? (
        <div style={{ position: "absolute", left: 120, top: 120, display: "flex", gap: 22, alignItems: "flex-end", opacity: lin(f, 6, 16) }}>
          <svg width={120} height={360} viewBox="0 0 120 360">
            <rect x={40} y={20} width={40} height={270} rx={20} fill="#FFFFFF" stroke={CL.navy} strokeWidth={6} />
            <rect x={50} y={30 + 250 * (1 - ease(u))} width={20} height={250 * ease(u)} rx={10} fill={CL.red} />
            <circle cx={60} cy={310} r={40} fill={CL.red} stroke={CL.navy} strokeWidth={6} />
            {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={84} x2={100} y1={60 + i * 52} y2={60 + i * 52} stroke={CL.navy} strokeWidth={4} />)}
          </svg>
          <div>
            <div style={{ background: CL.yellow, color: CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 70, padding: "2px 28px", borderRadius: 14, boxShadow: `0 14px 30px ${CL.shadow}` }}>1 taza</div>
            <div style={{ marginTop: 14, background: CL.white, color: CL.navy, fontFamily: HAND, fontWeight: 700, fontSize: 56, padding: "0 24px", borderRadius: 14, boxShadow: `0 14px 30px ${CL.shadow}` }}>{temp}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
