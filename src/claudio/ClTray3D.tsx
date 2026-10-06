// ClTray3D — una BANDEJA de horno en 3D (three.js) cortada en una esquina para ver las capas de barniz (aceite cocinado) apiladas sobre
// el metal, apoyada sobre la mesada de acero de la cocina del hotel (cama real + sombra + luz). Modos (reusable por el canal):
//   "layers"    las capas se apilan una por horneada (contador) y se oscurecen de miel a marrón
//   "detergent" gotas de agua con espuma resbalan por encima de la costra y caen: la costra queda igual (como un paraguas)
//   "paste"     una capa gruesa de pasta blanca encima; burbujitas bajan por el borde y se meten ENTRE la costra y el metal
//   "flake"     la esponja hace circulitos y la costra salta en escamas que se van; aparece el metal limpio
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin } from "./ClParts";

type Mode = "layers" | "detergent" | "paste" | "flake";
const TW = 3.2, TD = 2.2, LIP = 0.16, NL = 8, LH = 0.028;
const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

export const ClTray3D: React.FC<{ mode?: Mode; labels?: { a?: string; b?: string }; count?: number; bed?: string }> = ({ mode = "layers", labels = {}, count = 100, bed }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const u = clamp01((f - 6) / Math.max(1, T * 0.8 - 6));
  const a = interpolate(f, [0, T], [-0.55, -0.2], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [4.6, 3.6]);
  const target = new THREE.Vector3(0.9, 0.05, 0.55);
  const camPos = new THREE.Vector3(target.x + Math.sin(a) * dist, 2.0, target.z + Math.cos(a) * dist);
  const nL = mode === "layers" ? Math.max(1, Math.round(NL * ease(u))) : NL;
  const pasteK = mode === "paste" ? lin(f, 4, 18) : 0;
  const under = mode === "paste" ? clamp01((u - 0.35) / 0.55) : 0;           // las burbujas se meten debajo
  const lift = mode === "paste" ? 0.02 * under : 0;
  const flakeK = mode === "flake" ? clamp01((u - 0.1) / 0.8) : 0;
  const mats = useMemo(() => ({
    metal: new THREE.MeshStandardMaterial({ color: "#C4C8CC", metalness: 0.55, roughness: 0.35 }),
    metalCut: new THREE.MeshStandardMaterial({ color: "#9EA3A8", metalness: 0.5, roughness: 0.4 }),
    layers: Array.from({ length: NL }, (_, k) => new THREE.MeshStandardMaterial({ color: new THREE.Color("#C99A4C").lerp(new THREE.Color("#4E2A10"), k / (NL - 1)), roughness: 0.55, metalness: 0.05 })),
    paste: new THREE.MeshStandardMaterial({ color: "#F7F6F1", roughness: 0.95 }),
    water: new THREE.MeshStandardMaterial({ color: "#D6EAF7", roughness: 0.05, transparent: true, opacity: 0.8 }),
    foam: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.4, transparent: true, opacity: 0.9 }),
    sponge: new THREE.MeshStandardMaterial({ color: "#F2C230", roughness: 0.9 }),
    spongeTop: new THREE.MeshStandardMaterial({ color: "#3D7F4A", roughness: 0.9 }),
    flake: new THREE.MeshStandardMaterial({ color: "#5A3214", roughness: 0.7, side: THREE.DoubleSide }),
  }), []);
  // la costra = losetas en grilla (para poder saltar en escamas); la esquina de adelante-derecha está cortada (se ve el canto)
  const tiles = useMemo(() => { const out: { x: number; z: number; i: number }[] = []; let i = 0; for (let gx = 0; gx < 8; gx++) for (let gz = 0; gz < 6; gz++) { const x = -TW / 2 + 0.2 + gx * (TW - 0.4) / 8 + (TW - 0.4) / 16, z = -TD / 2 + 0.2 + gz * (TD - 0.4) / 6 + (TD - 0.4) / 12; out.push({ x, z, i: i++ }); } return out; }, []);
  const tw = (TW - 0.4) / 8, td = (TD - 0.4) / 6;
  const sx = 0.5 + 0.6 * Math.cos(f * 0.35), sz = 0.3 + 0.4 * Math.sin(f * 0.35);
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(32, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const base = proj(new THREE.Vector3(0, -0.1, 0));
  const edge = new THREE.Vector3(TW / 2 - 0.2, 0.05 + NL * LH * 0.5, TD / 2 - 0.2);
  const L: { at: any; text: string; dx: number; dy: number; t0: number }[] = [];
  if (labels.a) L.push({ at: edge, text: labels.a, dx: 300, dy: -150, t0: 10 });
  if (labels.b) L.push({ at: new THREE.Vector3(TW / 2 - 0.2, 0.04, TD / 2 - 0.2), text: labels.b, dx: 300, dy: 120, t0: Math.round(T * 0.4) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={19} dim={0.36} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,252,246,0.7), rgba(255,252,246,0) 62%)" }} />
      <Contact x={base.x} y={base.y + 40} w={1300} o={0.4} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#FFFFFF", "#BFAE96", 0.45]} />
        <directionalLight position={[-2, 6, 4]} intensity={1.15} color="#FFF1DA" />
        <directionalLight position={[4, 2, 3]} intensity={0.4} />
        {/* bandeja: fondo + cuatro bordes */}
        <mesh material={mats.metal} position={[0, 0, 0]}><boxGeometry args={[TW, 0.05, TD]} /></mesh>
        <mesh material={mats.metal} position={[0, LIP / 2, -TD / 2]}><boxGeometry args={[TW, LIP, 0.04]} /></mesh>
        <mesh material={mats.metal} position={[-TW / 2, LIP / 2, 0]}><boxGeometry args={[0.04, LIP, TD]} /></mesh>
        <mesh material={mats.metalCut} position={[TW / 2, LIP / 2, 0]}><boxGeometry args={[0.04, LIP, TD]} /></mesh>
        <mesh material={mats.metalCut} position={[0, LIP / 2, TD / 2]}><boxGeometry args={[TW, LIP, 0.04]} /></mesh>
        {/* costra en capas, por loseta */}
        {tiles.map((t) => {
          const fly = mode === "flake" ? clamp01((flakeK * 1.4 - rnd(t.i) * 0.5) / 0.4) : 0;
          if (fly >= 1) return null;
          const yLift = lift + fly * 0.9, rot = fly * 2.2 * (rnd(t.i + 3) - 0.5);
          return (
            <group key={t.i} position={[t.x + fly * (rnd(t.i + 5) - 0.3) * 1.5, 0.025 + yLift, t.z + fly * (rnd(t.i + 7) - 0.5) * 1.2]} rotation={[rot, 0, rot * 0.7]}>
              {Array.from({ length: nL }, (_, k) => <mesh key={k} material={fly > 0 ? mats.flake : mats.layers[k]} position={[0, LH * (k + 0.5), 0]}><boxGeometry args={[tw * 0.99, LH * 0.96, td * 0.99]} /></mesh>)}
            </group>
          );
        })}
        {/* pasta blanca gruesa encima */}
        {pasteK > 0.01 ? <mesh material={mats.paste} position={[0, 0.025 + NL * LH + 0.06 + lift, 0]} scale={[1, pasteK, 1]}><boxGeometry args={[TW - 0.4, 0.12, TD - 0.4]} /></mesh> : null}
        {/* burbujas que bajan por el canto y se meten debajo */}
        {mode === "paste" ? Array.from({ length: 30 }, (_, i) => { const t = clamp01(under * 1.5 - rnd(i) * 0.5); if (t <= 0) return null; const x = TW / 2 - 0.22, z = -TD / 2 + 0.3 + rnd(i + 2) * (TD - 0.6); const y = 0.025 + NL * LH * (1 - t) + 0.01; return <mesh key={"b" + i} material={mats.foam} position={[x + 0.02 - 0.3 * t * rnd(i + 4), y, z]} scale={0.6 + 0.6 * Math.sin(Math.PI * t)}><sphereGeometry args={[0.025, 8, 6]} /></mesh>; }) : null}
        {/* agua con espuma que resbala (detergente) */}
        {mode === "detergent" ? Array.from({ length: 18 }, (_, i) => { const t = ((u * 1.6 + rnd(i)) % 1); const x = -TW / 2 + 0.3 + rnd(i + 1) * (TW - 0.6); const z = -TD / 2 + 0.3 + t * (TD + 0.2); const y = 0.025 + NL * LH + 0.04 - (z > TD / 2 - 0.2 ? (z - TD / 2 + 0.2) * 1.5 : 0); return <group key={"w" + i}><mesh material={mats.water} position={[x, y, z]} scale={[1, 0.55, 1.3]}><sphereGeometry args={[0.06, 12, 8]} /></mesh><mesh material={mats.foam} position={[x + 0.03, y + 0.03, z - 0.04]}><sphereGeometry args={[0.025, 8, 6]} /></mesh></group>; }) : null}
        {/* esponja en circulitos */}
        {mode === "flake" ? <group position={[sx, 0.025 + NL * LH * (1 - flakeK) + 0.12, sz]} rotation={[0, f * 0.05, 0]}><mesh material={mats.sponge}><boxGeometry args={[0.6, 0.18, 0.4]} /></mesh><mesh material={mats.spongeTop} position={[0, 0.11, 0]}><boxGeometry args={[0.6, 0.04, 0.4]} /></mesh></group> : null}
      </ThreeCanvas>
      <RoomLight k={0.6} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={10} fill={CL.yellow} stroke={CL.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={CL.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        return (<div key={i} style={{ position: "absolute", left: p.x + l.dx, top: p.y + l.dy, translate: `${l.dx < 0 ? "-100%" : "0%"} -50%`, opacity: k, background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${CL.yellow}` }}>{l.text}</div>);
      })}
      {mode === "layers" ? (
        <div style={{ position: "absolute", left: 110, bottom: 110, opacity: lin(f, 4, 14), background: CL.white, borderRadius: 14, padding: "10px 30px 14px", boxShadow: `0 14px 30px ${CL.shadow}`, borderTop: `10px solid ${CL.brown}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 3, color: CL.inkSoft }}>HORNEADAS</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.max(1, Math.round(count * ease(u)))}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
