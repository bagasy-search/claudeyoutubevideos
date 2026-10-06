// RhGasketFold3D — 3D real (three.js) de la boca de un lavarropas de carga frontal: el frente blanco del gabinete, el tambor de acero
// al fondo y la GOMA de la puerta (anillo gris) con su pliegue. Vive en el mundo: lavadero, luz de ventana desde la izquierda.
// Modos:
//   "fold"   un dedo con guante amarillo tira de la goma: el pliegue se abre abajo y aparece la mugre negra + agua gris estancada
//   "clean"  spray (gotas) + cepillo: la mugre se va y queda limpio
//   "closed" la puerta se cierra: el pliegue queda en la oscuridad y una nube de humedad crece (reloj de horas)
//   "crack"  la puerta queda entreabierta: entra aire (flechas), el agua del pliegue se evapora
// Rótulos: labels.{fold,water,drum,door}.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, rnd, clamp01, ease } from "./RhTheme";
import { lin } from "./RhParts";

type Mode = "fold" | "clean" | "closed" | "crack";
type Labels = { fold?: string; water?: string; drum?: string; door?: string };
const RO = 1.25, RT = 0.22;   // radio del anillo de goma, grosor del tubo

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

export const RhGasketFold3D: React.FC<{ mode?: Mode; labels?: Labels }> = ({ mode = "fold", labels = {} }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const t0 = 8, t1 = Math.max(t0 + 10, T * 0.78), u = clamp01((f - t0) / (t1 - t0)), ue = ease(u);
  const a = interpolate(f, [0, T], [-0.25, 0.12], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [5.2, 4.2], { easing: Easing.out(Easing.cubic) });
  const target = new THREE.Vector3(0, -0.45, 0);
  const camPos = new THREE.Vector3(Math.sin(a) * dist, 0.9, Math.cos(a) * dist);
  const mats = useMemo(() => ({
    cab: new THREE.MeshStandardMaterial({ color: "#F7F7F5", roughness: 0.35 }),
    drum: new THREE.MeshStandardMaterial({ color: "#B9C0C6", roughness: 0.25, metalness: 0.75, side: THREE.BackSide }),
    hole: new THREE.MeshStandardMaterial({ color: "#5D646B", roughness: 0.6 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#8F9499", roughness: 0.7 }),
    rubberIn: new THREE.MeshStandardMaterial({ color: "#6F757A", roughness: 0.8, side: THREE.DoubleSide }),
    gunk: new THREE.MeshStandardMaterial({ color: "#16130E", roughness: 0.55 }),
    water: new THREE.MeshStandardMaterial({ color: "#8F9A8C", roughness: 0.05, transparent: true, opacity: 0.75 }),
    drop: new THREE.MeshStandardMaterial({ color: "#D8ECF8", roughness: 0.05, transparent: true, opacity: 0.85 }),
    glove: new THREE.MeshStandardMaterial({ color: "#F5C518", roughness: 0.45 }),
    door: new THREE.MeshStandardMaterial({ color: "#DDE8EE", roughness: 0.05, transparent: true, opacity: 0.45 }),
    doorRim: new THREE.MeshStandardMaterial({ color: "#EDEDEB", roughness: 0.3 }),
    fog: new THREE.MeshStandardMaterial({ color: "#C9D3D8", transparent: true, opacity: 0.25, depthWrite: false }),
    lint: new THREE.MeshStandardMaterial({ color: "#B7AFA2", roughness: 1 }),
  }), []);
  const fold = mode === "fold" ? ue : 1;                                 // cuánto se abre el pliegue
  const clean = mode === "clean" ? clamp01((u - 0.3) / 0.55) : 0;        // la mugre se va
  const doorAng = mode === "closed" ? -Math.PI / 2 * (1 - ue) : mode === "crack" ? -0.35 : -Math.PI / 2;
  const fogK = mode === "closed" ? clamp01((u - 0.4) / 0.5) : 0;
  const waterK = mode === "crack" ? 1 - clamp01((u - 0.3) / 0.6) : mode === "clean" ? 1 - clean : 1;
  // pliegue: la mitad de abajo del anillo se "abre" bajando (labio que se tira hacia afuera)
  const lip = useMemo(() => new THREE.TorusGeometry(RO, RT * 0.5, 14, 64, Math.PI), []);
  const gunk = Array.from({ length: 26 }, (_, i) => { const th = Math.PI + 0.25 + (i / 25) * (Math.PI - 0.5); return { x: Math.cos(th) * (RO - 0.04), y: Math.sin(th) * (RO - 0.04), s: 0.05 + rnd(i * 7) * 0.06 }; });
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  const lt = (k: number) => Math.round(t0 + (t1 - t0) * k);
  if (labels.fold) L.push({ at: new THREE.Vector3(0.4, -RO + 0.05, 0.25), text: labels.fold, dx: 320, dy: 120, t0: lt(0.45), alert: mode === "fold" || mode === "closed" });
  if (labels.water) L.push({ at: new THREE.Vector3(-0.2, -RO + 0.02, 0.22), text: labels.water, dx: -340, dy: 130, t0: lt(0.6) });
  if (labels.drum) L.push({ at: new THREE.Vector3(0.3, 0.3, -1.2), text: labels.drum, dx: 300, dy: -180, t0: lt(0.1) });
  if (labels.door) L.push({ at: new THREE.Vector3(-1.2, 0.6, 0.6), text: labels.door, dx: -280, dy: -160, t0: lt(0.2) });
  const drops: any[] = [];
  if (mode === "clean") for (let i = 0; i < 18; i++) { const ph = ((f - 10 - i * 2) / 30); if (ph < 0 || ph > 1 || u > 0.45) continue; drops.push(new THREE.Vector3((rnd(i) - 0.5) * 1.6, -RO + 0.5 - ph * 0.45, 0.9 - ph * 0.6)); }
  const brushX = mode === "clean" && u > 0.3 && u < 0.9 ? Math.sin(f / 3) * 0.5 : null;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#EDEAE4 0%,#E2DED6 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(255,249,232,0.9), rgba(255,255,255,0) 55%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.8 - fogK * 0.3} />
        <directionalLight position={[-5, 5, 6]} intensity={1.2} color="#FFF4E0" />
        <directionalLight position={[4, 2, 4]} intensity={0.35} />
        {/* frente del gabinete con el agujero de la boca (anillo plano) */}
        <mesh position={[0, 0, 0]} material={mats.cab}><ringGeometry args={[RO + RT, 3.6, 64]} /></mesh>
        {/* tambor de acero con sus agujeritos */}
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]} material={mats.drum}><cylinderGeometry args={[RO - 0.05, RO - 0.05, 2.2, 48, 1, true]} /></mesh>
        <mesh position={[0, 0, -2.2]} material={mats.hole}><circleGeometry args={[RO - 0.05, 48]} /></mesh>
        {Array.from({ length: 40 }, (_, i) => { const th = (i / 40) * Math.PI * 2; return <mesh key={i} position={[Math.cos(th) * (RO - 0.08), Math.sin(th) * (RO - 0.08), -0.6 - (i % 4) * 0.4]} material={mats.hole}><sphereGeometry args={[0.025, 6, 4]} /></mesh>; })}
        {/* la goma: anillo arriba fijo; mitad de abajo con el labio que se abre */}
        <mesh position={[0, 0, 0.12]} material={mats.rubber}><torusGeometry args={[RO, RT, 18, 72]} /></mesh>
        <mesh geometry={lip} position={[0, -0.02 - fold * 0.1, 0.32 + fold * 0.18]} rotation={[0, 0, Math.PI]} scale={[1, 1, 1]} material={mats.rubberIn} />
        {/* lo que hay dentro del pliegue (visible al abrirse) */}
        {fold > 0.2 ? gunk.map((g, i) => { const vis = (1 - clean * clamp01(1.3 - rnd(i) * 0.5)) * clamp01((fold - 0.2) * 2); return vis > 0.03 ? <mesh key={"g" + i} position={[g.x, g.y, 0.26]} scale={vis} material={i % 5 === 0 ? mats.lint : mats.gunk}><sphereGeometry args={[g.s, 8, 6]} /></mesh> : null; }) : null}
        {fold > 0.3 && waterK > 0.05 ? <mesh position={[0, -RO + 0.04, 0.26]} rotation={[-Math.PI / 2, 0, 0]} scale={[waterK, 1, 1]} material={mats.water}><planeGeometry args={[1.5, 0.22]} /></mesh> : null}
        {/* dedo con guante que tira (fold) / cepillo (clean) */}
        {mode === "fold" ? <mesh position={[0.15, -RO - 0.05 - fold * 0.12, 0.62 + fold * 0.18]} rotation={[0.6, 0, 0]} material={mats.glove}><capsuleGeometry args={[0.09, 0.42, 6, 10]} /></mesh> : null}
        {brushX !== null ? <mesh position={[brushX, -RO + 0.12, 0.42]} rotation={[0.9, 0, 0.2]} material={mats.glove}><boxGeometry args={[0.5, 0.08, 0.12]} /></mesh> : null}
        {drops.map((p, i) => <mesh key={"d" + i} position={p} material={mats.drop}><sphereGeometry args={[0.035, 8, 6]} /></mesh>)}
        {/* puerta de vidrio con bisagra a la izquierda */}
        <group position={[-RO - 0.35, 0, 0.45]} rotation={[0, doorAng, 0]}>
          <mesh position={[RO + 0.35, 0, 0]} material={mats.doorRim}><torusGeometry args={[RO + 0.12, 0.14, 12, 64]} /></mesh>
          <mesh position={[RO + 0.35, 0, -0.05]} material={mats.door}><circleGeometry args={[RO + 0.05, 48]} /></mesh>
        </group>
        {/* humedad atrapada (closed) */}
        {fogK > 0.02 ? <mesh position={[0, -0.3, -0.3]} scale={0.6 + fogK * 0.6} material={mats.fog}><sphereGeometry args={[RO * 0.9, 20, 14]} /></mesh> : null}
      </ThreeCanvas>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={9} fill={l.alert ? RH.red : RH.yellow} stroke={RH.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={RH.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
        {/* aire que entra (crack) */}
        {mode === "crack" ? [0, 1, 2, 3].map((i) => { const ph = ((f * 0.02 + i * 0.25) % 1); return <path key={i} d={`M ${1500 - ph * 600} ${300 + i * 90} q 80 -30 160 0 t 160 0`} fill="none" stroke={RH.blue} strokeWidth={8} strokeLinecap="round" opacity={0.8 * (1 - ph)} />; }) : null}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        const est = l.text.length * 25 + 50; let x = l.dx < 0 ? p.x + l.dx - est : p.x + l.dx; x = Math.max(30, Math.min(width - est - 30, x));
        return (<div key={i} style={{ position: "absolute", left: x, top: Math.max(40, Math.min(height - 90, p.y + l.dy)), translate: "0 -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${RH.shadow}` }}>{l.text}</div>);
      })}
    </AbsoluteFill>
  );
};
