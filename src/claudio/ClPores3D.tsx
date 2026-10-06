// ClPores3D — corte 3D (three.js) de una JUNTA entre dos azulejos esmaltados, apoyada en el baño del hotel (cama real + sombra + luz):
// la junta es porosa (huecos esféricos), el moho tiene puntas negras arriba y RAÍCES finas que bajan por los poros. Modos (reusable):
//   "roots"    las raíces crecen hacia abajo por los poros y las puntas negras salen arriba
//   "bleach"   el cloro moja SÓLO la superficie: las puntas se ponen blancas, las raíces de adentro siguen latiendo (y rebrotan al final)
//   "peroxide" el líquido baja por los poros, burbujas en cada raíz, y las raíces se deshacen de arriba hacia abajo
//   "spores"   un cepillo seco frota y las esporas (polvito) salen volando del moho hacia la cámara
// labels.{top,roots,liquid} = rótulos dentro del mundo (proyectados desde el punto 3D real).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin } from "./ClParts";

type Mode = "roots" | "bleach" | "peroxide" | "spores";
const GW = 0.7, GH = 1.6, GD = 1.4;       // junta: ancho (x), alto (y, profundidad hacia abajo), largo (z)
const TW = 1.6;                           // azulejo a cada lado
const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
// raíz = curva que baja serpenteando desde la superficie (y=0) hacia y=-depth
function rootCurve(i: number) {
  const x0 = (rnd(i) - 0.5) * GW * 0.75, z0 = GD / 2 + 0.01, d = 0.6 + rnd(i + 5) * 0.85;
  const P: any[] = []; for (let k = 0; k <= 6; k++) { const t = k / 6; P.push(new THREE.Vector3(x0 + Math.sin(t * 5 + i) * 0.07 * t, -d * t, z0)); }
  return { c: new THREE.CatmullRomCurve3(P), d, x0, z0 };
}

export const ClPores3D: React.FC<{ mode?: Mode; labels?: { top?: string; roots?: string; liquid?: string }; bed?: string }> = ({ mode = "roots", labels = {}, bed }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const u = clamp01((f - 6) / Math.max(1, T * 0.8 - 6));
  const a = interpolate(f, [0, T], [-0.5, 0.15], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [5.0, 4.3]);
  const target = new THREE.Vector3(0, -0.55, 0.2);
  const camPos = new THREE.Vector3(Math.sin(a) * dist, 1.3, 0.2 + Math.cos(a) * dist);
  const R = useMemo(() => Array.from({ length: 16 }, (_, i) => rootCurve(i)), []);
  const geo = useMemo(() => ({ roots: R.map((r) => new THREE.TubeGeometry(r.c, 24, 0.018, 6, false)) }), [R]);
  const pores = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ p: new THREE.Vector3((rnd(i * 7) - 0.5) * GW * 0.9, -rnd(i * 7 + 1) * GH * 0.95, GD / 2 + 0.001), r: 0.03 + rnd(i * 7 + 2) * 0.05 })), []);
  const mats = useMemo(() => ({
    tile: new THREE.MeshStandardMaterial({ color: "#F1ECE2", roughness: 0.12 }),
    tileCut: new THREE.MeshStandardMaterial({ color: "#C9B9A0", roughness: 0.85 }),
    grout: new THREE.MeshStandardMaterial({ color: "#D9D3C6", roughness: 0.95 }),
    pore: new THREE.MeshStandardMaterial({ color: "#8E877A", roughness: 1 }),
    root: new THREE.MeshStandardMaterial({ color: "#20221A", roughness: 0.5, emissive: "#0E1608", emissiveIntensity: 0.4, transparent: true, opacity: 1 }),
    tip: new THREE.MeshStandardMaterial({ color: "#16170F", roughness: 0.6 }),
    liquid: new THREE.MeshStandardMaterial({ color: "#BFDDF2", transparent: true, opacity: 0.5, roughness: 0.05, depthWrite: false }),
    bubble: new THREE.MeshStandardMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.85, roughness: 0.2 }),
    spore: new THREE.MeshStandardMaterial({ color: "#3A3A2C", transparent: true, opacity: 0.8 }),
    brush: new THREE.MeshStandardMaterial({ color: CL.nitrile, roughness: 0.5 }),
    bristle: new THREE.MeshStandardMaterial({ color: "#EFEFEF", roughness: 0.7 }),
  }), []);
  // estado
  const grow = mode === "roots" ? ease(clamp01(u * 1.2)) : 1;
  const bleachTop = mode === "bleach" ? ease(clamp01((u - 0.1) / 0.35)) : 0;           // puntas blancas
  const regrow = mode === "bleach" ? clamp01((u - 0.75) / 0.25) : 0;                    // al final rebrotan negras
  const liquidD = mode === "peroxide" ? ease(clamp01(u / 0.55)) * 1.45 : mode === "bleach" ? 0.12 * clamp01(u / 0.2) : 0; // hasta dónde baja el líquido
  const killFront = mode === "peroxide" ? clamp01((u - 0.35) / 0.55) * 1.6 : -1;         // profundidad hasta la que las raíces murieron
  const tipCol = new THREE.Color("#16170F").lerp(new THREE.Color("#F4F2EC"), bleachTop * (1 - regrow));
  mats.tip.color.copy(tipCol);
  const sporeK = mode === "spores" ? clamp01((f - 10) / (T * 0.7)) : 0;
  const bx = mode === "spores" ? Math.sin(f * 0.45) * 0.25 : 0;

  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const base = proj(new THREE.Vector3(0, -GH - 0.1, 0));
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  if (labels.top) L.push({ at: new THREE.Vector3(0.05, 0.08, GD / 2 - 0.1), text: labels.top, dx: -420, dy: -150, t0: 8 });
  if (labels.roots) L.push({ at: new THREE.Vector3(R[2].x0, -0.7, GD / 2), text: labels.roots, dx: 380, dy: 120, t0: Math.round(T * 0.35), alert: mode !== "peroxide" });
  if (labels.liquid) L.push({ at: new THREE.Vector3(-0.1, -Math.min(liquidD, 1.2) * 0.6, GD / 2), text: labels.liquid, dx: -420, dy: 80, t0: Math.round(T * 0.2) });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={17} dim={0.4} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,252,246,0.75), rgba(255,252,246,0) 62%)" }} />
      <Contact x={base.x} y={base.y + 20} w={980} o={0.38} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#FFFFFF", "#BFAE96", 0.45]} />
        <directionalLight position={[-2, 6, 4]} intensity={1.15} color="#FFF1DA" />
        <directionalLight position={[3, 2, 3]} intensity={0.35} />
        {/* dos azulejos (esmalte arriba + bizcocho cortado al frente) y la junta porosa en el medio */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * (GW / 2 + TW / 2), 0, 0]}>
            <mesh material={mats.tile} position={[0, -0.04, 0]}><boxGeometry args={[TW, 0.08, GD]} /></mesh>
            <mesh material={mats.tileCut} position={[0, -0.45, 0]}><boxGeometry args={[TW, 0.75, GD]} /></mesh>
          </group>
        ))}
        <mesh material={mats.grout} position={[0, -GH / 2, 0]}><boxGeometry args={[GW, GH, GD]} /></mesh>
        {pores.map((p, i) => <mesh key={i} material={mats.pore} position={p.p} scale={[1, 1, 0.25]}><sphereGeometry args={[p.r, 10, 8]} /></mesh>)}
        {/* líquido que baja por la cara cortada */}
        {liquidD > 0.01 ? <mesh material={mats.liquid} position={[0, -liquidD / 2 + 0.01, GD / 2 + 0.02]}><boxGeometry args={[GW * 0.98, liquidD, 0.02]} /></mesh> : null}
        {/* raíces (crecen / se deshacen) */}
        {R.map((r, i) => {
          const visDepth = r.d * grow; const dead = killFront > 0 && killFront * 0.9 > r.d * 0.3;
          const sc = Math.max(0.001, visDepth / r.d) * (mode === "peroxide" ? 1 - clamp01((killFront - rnd(i) * 0.4) / 1.1) : 1);
          if (sc < 0.02) return null;
          const pulse = mode === "bleach" ? 1 + 0.25 * Math.sin(f * 0.25 + i) : 1;
          return <mesh key={i} geometry={geo.roots[i]} material={mats.root} scale={[pulse, sc, pulse]} visible={!(mode === "peroxide" && dead && sc < 0.05)} />;
        })}
        {/* puntas negras arriba (se blanquean con cloro, rebrotan) */}
        {R.map((r, i) => {
          const k = mode === "roots" ? clamp01(grow * 1.5 - 0.3) : mode === "peroxide" ? 1 - clamp01((u - 0.25 - rnd(i) * 0.2) / 0.35) : 1;
          if (k < 0.02) return null;
          return <mesh key={"t" + i} material={mats.tip} position={[r.x0, 0.03, r.z0]} scale={k * (1 + 0.3 * regrow)}><sphereGeometry args={[0.06 + rnd(i + 9) * 0.04, 10, 8]} /></mesh>;
        })}
        {/* burbujas en las raíces (agua oxigenada) */}
        {mode === "peroxide" ? R.flatMap((r, i) => Array.from({ length: 3 }, (_, b) => { const t = clamp01((u - 0.3 - rnd(i * 5 + b) * 0.4) / 0.25); if (t <= 0 || t >= 1) return null; const p = r.c.getPointAt(clamp01(0.2 + rnd(i + b) * 0.7)); return <mesh key={"b" + i + b} material={mats.bubble} position={[p.x + 0.02, p.y + 0.15 * t, GD / 2 + 0.03]} scale={Math.sin(Math.PI * t)}><sphereGeometry args={[0.035, 8, 6]} /></mesh>; })) : null}
        {/* esporas: cepillo seco + nube de polvito */}
        {mode === "spores" ? (
          <group position={[bx, 0.18, 0.3]} rotation={[0, 0, 0.1]}>
            <mesh material={mats.brush} position={[0, 0.08, 0]}><boxGeometry args={[0.5, 0.12, 0.25]} /></mesh>
            {Array.from({ length: 16 }, (_, i) => <mesh key={i} material={mats.bristle} position={[-0.2 + (i % 8) * 0.057, -0.03, -0.06 + Math.floor(i / 8) * 0.12]}><cylinderGeometry args={[0.012, 0.012, 0.12, 6]} /></mesh>)}
          </group>
        ) : null}
        {mode === "spores" ? Array.from({ length: 140 }, (_, i) => { const t = (sporeK * 1.6 - rnd(i) * 0.6); if (t <= 0) return null; const tt = Math.min(1.4, t); return <mesh key={"s" + i} material={mats.spore} position={[(rnd(i + 1) - 0.5) * 0.8 + (rnd(i + 2) - 0.5) * 2.5 * tt, 0.1 + 1.6 * tt * rnd(i + 3), 0.3 + 2.2 * tt * rnd(i + 4)]}><sphereGeometry args={[0.01 + 0.012 * rnd(i + 5), 6, 4]} /></mesh>; }) : null}
      </ThreeCanvas>
      <RoomLight k={0.6} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={10} fill={l.alert ? CL.red : CL.yellow} stroke={CL.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={CL.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        return (<div key={i} style={{ position: "absolute", left: p.x + l.dx, top: p.y + l.dy, translate: `${l.dx < 0 ? "-100%" : "0%"} -50%`, opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${l.alert ? "#8E1F17" : CL.yellow}` }}>{l.text}</div>);
      })}
    </AbsoluteFill>
  );
};
