// RhCaulkSection3D — corte 3D real (three.js) del rincón donde el azulejo se encuentra con la bañera, con el cordón de silicona
// (cuarto de caño, liso y brillante) entre los dos. Vive en el mundo: azulejo blanco arriba, borde de bañera abajo, luz de ventana.
// Modos:
//   "spray"  gotas de spray caen sobre el cordón y RESBALAN a la bañera en segundos (cronómetro): casi nada se queda
//   "strips" una tira de papel empapada se apoya sobre el cordón + film encima; luna→sol; las raíces negras se apagan
//   "roots"  los puntitos negros de la superficie con sus raíces metidas en la silicona
//   "under"  el moho está DEBAJO del cordón (entre silicona y bañera): la tira de arriba no llega (cruz roja)
//   "gap"    el cordón se despega de la bañera y el agua se mete por detrás
//   "redo"   sale el cordón viejo, la junta se seca (24 h) y entra uno nuevo blanco
// Rótulos dentro del mundo: labels.{bead,roots,strip,under,water}.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, SERIF, rnd, clamp01, ease } from "./RhTheme";
import { tileBg, lin } from "./RhParts";

type Mode = "spray" | "strips" | "roots" | "under" | "gap" | "redo";
type Labels = { bead?: string; roots?: string; strip?: string; under?: string; water?: string };
const L = 4.2, BR = 0.32;   // largo del tramo, radio del cordón
const ND = 9;

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
// geometría del cordón: cuarto de cilindro en el rincón (eje X), centrado en (0,0,0); la pared en z<0, la bañera en y<0
function beadGeo(r: number) { return new THREE.CylinderGeometry(r, r, L, 40, 1, false); }  // cilindro entero en el rincón: pared y bañera tapan 3/4
const surf = (x: number, a: number, r = BR) => new THREE.Vector3(x, Math.sin(a) * r * 1.0, Math.cos(a) * r); // a∈[0,π/2]: punto sobre el cordón

export const RhCaulkSection3D: React.FC<{ mode?: Mode; labels?: Labels }> = ({ mode = "roots", labels = {} }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const t0 = 8, t1 = Math.max(t0 + 10, T * 0.78), u = clamp01((f - t0) / (t1 - t0)), ue = ease(u);
  const a = interpolate(f, [0, T], [-0.5, 0.15]);
  const dist = interpolate(f, [0, T], [3.6, 2.9]);
  const target = new THREE.Vector3(0, 0.15, 0.25);
  const camPos = new THREE.Vector3(Math.sin(a) * dist * 0.8, 1.15, 0.3 + Math.cos(a) * dist);
  const mats = useMemo(() => ({
    tile: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.08, emissive: "#F2F0EB", emissiveIntensity: 0.2 }),
    grout: new THREE.MeshStandardMaterial({ color: "#CFCAC0", roughness: 1 }),
    tub: new THREE.MeshStandardMaterial({ color: "#F2EEE6", roughness: 0.2 }),
    bead: new THREE.MeshStandardMaterial({ color: "#EEF3F7", roughness: 0.18, emissive: "#DCE6EE", emissiveIntensity: 0.15, transparent: mode === "under" || mode === "roots" || mode === "strips", opacity: mode === "under" ? 0.62 : mode === "roots" || mode === "strips" ? 0.7 : 1, depthWrite: !(mode === "under" || mode === "roots" || mode === "strips") }),
    newBead: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.15 }),
    dot: new THREE.MeshStandardMaterial({ color: "#14120C", roughness: 0.7 }),
    root: new THREE.MeshStandardMaterial({ color: "#1A1710", roughness: 0.6 }),
    drop: new THREE.MeshStandardMaterial({ color: "#D8ECF8", roughness: 0.05, transparent: true, opacity: 0.85 }),
    strip: new THREE.MeshStandardMaterial({ color: "#F3EFE6", roughness: 0.95, side: THREE.DoubleSide }),
    film: new THREE.MeshStandardMaterial({ color: "#EAF4FA", roughness: 0.05, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }),
    water: new THREE.MeshStandardMaterial({ color: "#9CCBEA", roughness: 0.05, transparent: true, opacity: 0.7 }),
    under: new THREE.MeshStandardMaterial({ color: "#16130D", roughness: 0.8 }),
  }), [mode]);
  // estado por modo
  const fade = mode === "strips" ? clamp01((u - 0.35) / 0.5) : mode === "redo" ? 1 : 0;     // las raíces se apagan
  const showDots = mode !== "under" && mode !== "redo";
  const stripK = mode === "strips" ? clamp01(u / 0.25) : 0;
  const night = mode === "strips" ? Math.sin(Math.PI * clamp01((u - 0.25) / 0.6)) : 0;
  const gapK = mode === "gap" ? ue : 0;
  const redoOld = mode === "redo" ? 1 - clamp01(u / 0.3) : 1, redoNew = mode === "redo" ? clamp01((u - 0.65) / 0.25) : 0;
  const dryK = mode === "redo" ? clamp01((u - 0.3) / 0.35) : 0;
  const dots = Array.from({ length: ND }, (_, i) => ({ x: -L / 2 + 0.3 + (i / (ND - 1)) * (L - 0.6) + (rnd(i * 3) - 0.5) * 0.2, a: 0.35 + rnd(i * 7) * 0.9 }));
  // raíces: cortitas, hacia adentro del cordón
  const roots = dots.map((d, i) => { const p0 = surf(d.x, d.a, BR + 0.005), p1 = surf(d.x + (rnd(i) - 0.5) * 0.06, d.a + 0.1, BR * 0.55); return { p: p0.clone().lerp(p1, 0.5), len: p0.distanceTo(p1), q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()) }; });
  // gotas del spray: caen sobre el cordón y resbalan hacia la bañera (se van en ~1 s)
  const drops: any[] = [];
  if (mode === "spray") for (let i = 0; i < 26; i++) { const ph = ((f - 6 - i * 3) / 40); if (ph < 0 || ph > 1) continue; const x = -L / 2 + 0.2 + rnd(i * 5) * (L - 0.4); const aa = Math.PI / 2 * (1 - ph); const p = ph < 0.85 ? surf(x, aa, BR + 0.03) : new THREE.Vector3(x, -0.02, BR + (ph - 0.85) * 4); drops.push({ p, s: 1 - ph * 0.4 }); }
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const LB: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  const lt = (k: number) => Math.round(t0 + (t1 - t0) * k);
  if (labels.bead) LB.push({ at: surf(1.2, 0.8, BR + 0.02), text: labels.bead, dx: 260, dy: -180, t0: lt(0.05) });
  if (labels.roots) LB.push({ at: roots[3].p, text: labels.roots, dx: -320, dy: -160, t0: lt(0.2), alert: mode === "under" });
  if (labels.strip) LB.push({ at: surf(-0.6, 0.8, BR + 0.06), text: labels.strip, dx: -280, dy: -200, t0: lt(0.25) });
  if (labels.under) LB.push({ at: new THREE.Vector3(0.4, -0.01, BR * 0.6), text: labels.under, dx: 260, dy: 170, t0: lt(0.3), alert: true });
  if (labels.water) LB.push({ at: new THREE.Vector3(-0.5, 0.05, -0.05), text: labels.water, dx: -260, dy: 170, t0: lt(0.4), alert: true });
  const secs = mode === "spray" ? Math.min(10, Math.floor(clamp01((f - 6) / (T * 0.7)) * 10)) : 0;
  return (
    <AbsoluteFill style={{ ...tileBg(200, 100), overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 20% 22%, rgba(255,250,235,${0.9 - night * 0.6}), rgba(255,255,255,0.1) 55%, rgba(30,42,54,${0.1 + night * 0.35}) 100%)` }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={1.0 - night * 0.4} />
        <directionalLight position={[-5, 6, 5]} intensity={1.3 - night * 0.7} color={night > 0.5 ? "#C8D4F0" : "#FFF4E0"} />
        <directionalLight position={[4, 2, 4]} intensity={0.35} color="#DCE9F5" />
        {/* pared de azulejo (z<0) con juntas, borde de bañera (y<0) */}
        <mesh position={[0, 1.1, -0.06]} material={mats.tile}><boxGeometry args={[L, 2.2, 0.12]} /></mesh>
        {[0.55, 1.1, 1.65].map((y) => <mesh key={y} position={[0, y, 0.002]} material={mats.grout}><boxGeometry args={[L, 0.025, 0.01]} /></mesh>)}
        <mesh position={[0, -0.08, 0.9]} material={mats.tub}><boxGeometry args={[L, 0.16, 1.9]} /></mesh>
        {/* el cordón: viejo (sale en redo) y nuevo */}
        {redoOld > 0.02 ? <mesh geometry={beadGeo(BR)} rotation={[0, 0, Math.PI / 2]} position={[0, gapK * 0.06, gapK * 0.05]} scale={[1, redoOld, 1]} material={mats.bead} /> : null}
        {redoNew > 0.02 ? <mesh geometry={beadGeo(BR)} rotation={[0, 0, Math.PI / 2]} scale={[1, redoNew, 1]} material={mats.newBead} /> : null}
        {/* junta mojada que se seca (redo) */}
        {mode === "redo" && redoOld < 0.5 && redoNew < 0.5 ? <mesh position={[0, 0.005, 0.03]} material={mats.water}><boxGeometry args={[L, 0.02, 0.06 * (1 - dryK) + 0.001]} /></mesh> : null}
        {/* moho debajo del cordón */}
        {mode === "under" ? Array.from({ length: 22 }, (_, i) => <mesh key={"u" + i} position={[-L / 2 + 0.15 + rnd(i * 7) * (L - 0.3), 0.01, 0.05 + rnd(i * 9) * BR * 0.6]} material={mats.under}><sphereGeometry args={[0.03 + rnd(i) * 0.03, 8, 6]} /></mesh>) : null}
        {/* agua que se mete por detrás (gap) */}
        {gapK > 0.1 ? Array.from({ length: 12 }, (_, i) => { const ph = ((f * 0.03 + rnd(i * 5)) % 1); return <mesh key={"w" + i} position={[-L / 2 + 0.3 + rnd(i * 3) * (L - 0.6), 0.25 - ph * 0.3, -0.01 - ph * 0.04]} material={mats.water}><sphereGeometry args={[0.028, 8, 6]} /></mesh>; }) : null}
        {/* puntitos + raíces */}
        {showDots ? dots.map((d, i) => { const vis = 1 - fade * clamp01(1.2 - rnd(i) * 0.4); if (vis < 0.03) return null; const p = surf(d.x, d.a, BR + 0.008);
          return (<group key={i}>
            <mesh position={p} scale={vis} material={mats.dot}><sphereGeometry args={[0.035 + rnd(i * 11) * 0.02, 10, 8]} /></mesh>
            {mode !== "spray" ? <mesh position={roots[i].p} quaternion={roots[i].q} scale={[vis, 1, vis]} material={mats.root}><cylinderGeometry args={[0.02, 0.01, roots[i].len, 6]} /></mesh> : null}
          </group>); }) : null}
        {drops.map((d, i) => <mesh key={"d" + i} position={d.p} scale={d.s} material={mats.drop}><sphereGeometry args={[0.04, 8, 6]} /></mesh>)}
        {/* tira de papel empapada + film */}
        {stripK > 0.01 ? <mesh geometry={beadGeo(BR + 0.03)} rotation={[0, 0, Math.PI / 2]} scale={[stripK, 1, 1]} position={[-(1 - stripK) * L / 2, 0, 0]} material={mats.strip} /> : null}
        {stripK > 0.6 ? <mesh geometry={beadGeo(BR + 0.07)} rotation={[0, 0, Math.PI / 2]} scale={[clamp01((stripK - 0.6) / 0.4), 1.05, 1.05]} material={mats.film} /> : null}
      </ThreeCanvas>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {LB.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={9} fill={l.alert ? RH.red : RH.yellow} stroke={RH.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={RH.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
        {mode === "under" && u > 0.55 ? (() => { const p = proj(surf(0.2, 0.8, BR + 0.08)); const k = lin(f, t0 + (t1 - t0) * 0.55, t0 + (t1 - t0) * 0.7); return <g opacity={k}><line x1={p.x - 60} y1={p.y - 60} x2={p.x + 60} y2={p.y + 60} stroke={RH.red} strokeWidth={16} strokeLinecap="round" /><line x1={p.x + 60} y1={p.y - 60} x2={p.x - 60} y2={p.y + 60} stroke={RH.red} strokeWidth={16} strokeLinecap="round" /></g>; })() : null}
      </svg>
      {LB.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        const est = l.text.length * 25 + 50; let x = l.dx < 0 ? p.x + l.dx - est : p.x + l.dx; x = Math.max(30, Math.min(width - est - 30, x));
        return (<div key={i} style={{ position: "absolute", left: x, top: Math.max(40, Math.min(height - 90, p.y + l.dy)), translate: "0 -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${RH.shadow}` }}>{l.text}</div>);
      })}
      {mode === "spray" ? <div style={{ position: "absolute", right: 110, top: 90, background: RH.white, borderRadius: 18, padding: "14px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: secs >= 10 ? RH.red : RH.ink }}>0:{String(secs).padStart(2, "0")}</div> : null}
      {mode === "strips" ? <div style={{ position: "absolute", right: 110, top: 90, width: 150, height: 150, borderRadius: "50%", background: night > 0.5 ? "#F3F0D8" : RH.yellow, boxShadow: night > 0.5 ? "0 0 40px rgba(240,235,200,0.8)" : `0 0 50px ${RH.yellow}`, opacity: 0.95 }} /> : null}
      {mode === "redo" && dryK > 0 && dryK < 1 ? <div style={{ position: "absolute", left: "50%", top: 80, translate: "-50% 0", background: RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 56, padding: "8px 30px", borderRadius: 12 }}>DRY IT: 24 HOURS</div> : null}
    </AbsoluteFill>
  );
};
