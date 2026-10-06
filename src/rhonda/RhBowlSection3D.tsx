// RhBowlSection3D — corte 3D real (three.js) de la pared de la taza del inodoro EN la línea de agua, como una rebanada de porcelana
// apoyada en la mesada: cuerpo de cerámica, esmalte brillante encima, el agua con su nivel, y en la línea de agua las capas del
// anillo: costra mineral (el ancla, rugosa, crece una capa por día) y la biopelícula marrón encima (el inquilino). Modos:
//   "grow"   el agua baja un poquito, se seca, y deja una capa de mineral; se repite: el anillo crece día a día
//   "layers" el anillo armado: rótulos ancla / inquilino
//   "paste"  la pasta blanca cubre el anillo, burbujea y la biopelícula se levanta y se va
//   "pumice" la piedra mojada pasa con agua y se lleva la costra; el esmalte queda liso
//   "dry"    la piedra SECA raya el esmalte: chispas y surcos (el error que no se deshace)
//   "glaze"  esmalte grueso (inodoro viejo) vs fino (nuevo): dos rebanadas lado a lado
// Rótulos dentro del mundo: labels.{crust,film,glaze,water,stone}.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, rnd, clamp01, ease } from "./RhTheme";
import { tileBg, lin } from "./RhParts";

type Mode = "grow" | "layers" | "paste" | "pumice" | "dry" | "glaze";
type Labels = { crust?: string; film?: string; glaze?: string; water?: string; stone?: string };
const W = 3.2, H = 1.8, D = 0.9;      // rebanada: ancho (a lo largo de la taza), alto, espesor de pared
const WL = 0.15;                       // línea de agua (y)
const NL = 7;                          // capas de mineral

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

const Slice: React.FC<{ x: number; glazeT: number; mats: any; crustK: number; filmK: number; scratchK: number; ringW: number }> = ({ x, glazeT, mats, crustK, filmK, scratchK, ringW }) => {
  const front = D / 2;
  return (
    <group position={[x, 0, 0]}>
      {/* cuerpo de cerámica (bizcocho) + esmalte en la cara interior (z+) */}
      <mesh material={mats.body}><boxGeometry args={[W, H, D]} /></mesh>
      <mesh position={[0, 0, front + glazeT / 2]} material={mats.glaze}><boxGeometry args={[W, H, glazeT]} /></mesh>
      {/* capas de mineral en la línea de agua: cada una un poco más ancha (crece) */}
      {Array.from({ length: NL }, (_, i) => {
        const k = clamp01(crustK * NL - i); if (k <= 0) return null;
        const th = 0.018 + rnd(i * 5) * 0.01, y = WL + (rnd(i * 3) - 0.5) * 0.05;
        return (
          <mesh key={i} position={[0, y, front + glazeT + i * 0.017 + th / 2]} scale={[k, 1, 1]} material={i % 2 ? mats.crust : mats.crust2}>
            <boxGeometry args={[W * 0.98, ringW * (1 - i * 0.06), th]} />
          </mesh>
        );
      })}
      {/* grumos ásperos de la costra */}
      {crustK > 0.3 ? Array.from({ length: 40 }, (_, i) => (
        <mesh key={"g" + i} position={[(rnd(i * 7) - 0.5) * W * 0.95, WL + (rnd(i * 11) - 0.5) * ringW * 0.9, front + glazeT + NL * 0.017 * crustK + 0.005]} scale={clamp01(crustK * 1.5 - 0.4)} material={mats.crust2}>
          <sphereGeometry args={[0.012 + rnd(i * 13) * 0.02, 6, 5]} />
        </mesh>
      )) : null}
      {/* biopelícula marrón encima de la costra */}
      {filmK > 0.01 ? <mesh position={[0, WL, front + glazeT + NL * 0.017 * crustK + 0.03]} scale={[1, 1, 1]} material={mats.film}><boxGeometry args={[W * 0.96 * filmK, ringW * 1.05, 0.03]} /></mesh> : null}
      {/* surcos del rayón (piedra seca) */}
      {scratchK > 0.01 ? Array.from({ length: 6 }, (_, i) => (
        <mesh key={"s" + i} position={[-W / 2 + (W * scratchK) / 2, WL - 0.25 + i * 0.1, front + glazeT - 0.004]} rotation={[0, 0, (rnd(i) - 0.5) * 0.15]} material={mats.scratch}>
          <boxGeometry args={[W * scratchK, 0.012, 0.012]} />
        </mesh>
      )) : null}
    </group>
  );
};

export const RhBowlSection3D: React.FC<{ mode?: Mode; labels?: Labels }> = ({ mode = "layers", labels = {} }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const t0 = 8, t1 = Math.max(t0 + 10, T * 0.78), u = clamp01((f - t0) / (t1 - t0)), ue = ease(u);
  const a = interpolate(f, [0, T], [-0.42, 0.12], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [6.4, 5.3], { easing: Easing.out(Easing.cubic) });
  const target = new THREE.Vector3(mode === "glaze" ? 0 : 0, 0.1, 0.4);
  const camPos = new THREE.Vector3(Math.sin(a) * dist, mode === "glaze" ? 3.4 : 1.6, Math.cos(a) * dist);
  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: "#B59C7E", roughness: 0.95 }),
    glaze: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.04, metalness: 0.05, emissive: "#F3F1EC", emissiveIntensity: 0.2 }),
    crust: new THREE.MeshStandardMaterial({ color: "#E4DCCB", roughness: 1 }),
    crust2: new THREE.MeshStandardMaterial({ color: "#CFC3AA", roughness: 1 }),
    film: new THREE.MeshStandardMaterial({ color: "#6B4A2B", roughness: 0.4, transparent: true, opacity: 0.88 }),
    water: new THREE.MeshStandardMaterial({ color: "#BFDDF2", roughness: 0.05, transparent: true, opacity: 0.42, depthWrite: false }),
    paste: new THREE.MeshStandardMaterial({ color: "#FAFAF6", roughness: 0.8 }),
    bubble: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.15, transparent: true, opacity: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: "#9C968A", roughness: 1 }),
    spark: new THREE.MeshBasicMaterial({ color: "#FFE9A8" }),
    scratch: new THREE.MeshStandardMaterial({ color: "#8A7A66", roughness: 1 }),
  }), []);
  // estado
  const crustK = mode === "grow" ? ue : mode === "pumice" ? 1 - clamp01((u - 0.2) / 0.6) : 1;
  const filmK = mode === "grow" ? clamp01(u * 1.3 - 0.4) : mode === "paste" ? 1 - clamp01((u - 0.45) / 0.4) : mode === "pumice" || mode === "dry" || mode === "glaze" ? 0 : 1;
  const ringW = 0.32;
  const waterY = mode === "grow" ? WL - 0.02 - 0.05 * Math.abs(Math.sin(u * Math.PI * NL)) : mode === "pumice" || mode === "paste" || mode === "dry" ? -0.75 : WL;
  const pasteK = mode === "paste" ? clamp01(u / 0.25) : 0;
  const stoneX = mode === "pumice" || mode === "dry" ? -W / 2 + W * clamp01((u - 0.15) / 0.7) : 99;
  const scratchK = mode === "dry" ? clamp01((u - 0.15) / 0.7) : 0;
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const front = D / 2 + 0.06;
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  const lt = (k: number) => Math.round(t0 + (t1 - t0) * k);
  if (labels.crust) L.push({ at: new THREE.Vector3(0.6, WL - 0.08, front + 0.1), text: labels.crust, dx: 300, dy: 170, t0: lt(mode === "grow" ? 0.55 : 0.1) });
  if (labels.film) L.push({ at: new THREE.Vector3(-0.6, WL + 0.08, front + 0.16), text: labels.film, dx: -300, dy: -170, t0: lt(mode === "grow" ? 0.8 : 0.3) });
  if (labels.glaze) L.push({ at: new THREE.Vector3(mode === "glaze" ? -1.9 : -1.2, -0.5, D / 2 + 0.05), text: labels.glaze, dx: -220, dy: 170, t0: lt(0.15), alert: mode === "dry" });
  if (labels.water) L.push({ at: new THREE.Vector3(1.2, waterY, front + 0.3), text: labels.water, dx: 260, dy: -150, t0: lt(0.1) });
  if (labels.stone) L.push({ at: new THREE.Vector3(Math.min(1.4, stoneX), WL + 0.25, front + 0.25), text: labels.stone, dx: 120, dy: -200, t0: lt(0.25), alert: mode === "dry" });
  // burbujas de la pasta / chispas de la piedra seca / gotas de la piedra mojada
  const parts: { p: any; s: number; m: any }[] = [];
  if (mode === "paste") for (let i = 0; i < 46; i++) { const ph = (f * 0.03 + rnd(i * 7)) % 1, on = clamp01((u - 0.2) / 0.15) * (1 - clamp01((u - 0.9) / 0.1)); if (on > 0) parts.push({ p: new THREE.Vector3((rnd(i * 3) - 0.5) * W * 0.9, WL + (rnd(i * 5) - 0.5) * 0.2 + ph * 0.35, front + 0.22 + ph * 0.1), s: on * (0.5 + rnd(i) * 0.7) * (1 - ph * 0.4), m: mats.bubble }); }
  if (mode === "dry" && stoneX < W / 2) for (let i = 0; i < 18; i++) { const ph = (f * 0.09 + rnd(i * 9)) % 1; parts.push({ p: new THREE.Vector3(stoneX + 0.25 + ph * (0.5 + rnd(i) * 0.6), WL - 0.15 + ph * (rnd(i * 3) * 0.9), front + 0.1 + ph * 0.4), s: 1 - ph, m: mats.spark }); }
  if (mode === "pumice" && stoneX < W / 2) for (let i = 0; i < 14; i++) { const ph = (f * 0.05 + rnd(i * 9)) % 1; parts.push({ p: new THREE.Vector3(stoneX - 0.2 - rnd(i) * 0.3, WL + 0.1 - ph * 0.7, front + 0.12), s: (1 - ph) * 0.8, m: mats.water }); }
  const slices = mode === "glaze" ? [{ x: -1.75, g: 0.34 }, { x: 1.75, g: 0.05 }] : [{ x: 0, g: 0.09 }];
  return (
    <AbsoluteFill style={{ ...tileBg(200, 100), overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 20% 25%, rgba(255,250,235,0.9), rgba(255,255,255,0.12) 55%, rgba(30,42,54,0.10) 100%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[-5, 6, 5]} intensity={1.3} color="#FFF4E0" />
        <directionalLight position={[4, 2, 3]} intensity={0.35} color="#DCE9F5" />
        {slices.map((s, i) => (
          <Slice key={i} x={s.x} glazeT={s.g} mats={mats} crustK={crustK} filmK={filmK} scratchK={i === 0 ? scratchK : 0} ringW={ringW} />
        ))}
        {/* el agua (sólo hasta su nivel), delante del esmalte */}
        {waterY > -H / 2 + 0.02 ? <mesh position={[0, (waterY - H / 2) / 2, D / 2 + 0.35]} material={mats.water}><boxGeometry args={[mode === "glaze" ? W * 2.3 : W, waterY + H / 2, 0.55]} /></mesh> : null}
        {/* la pasta */}
        {pasteK > 0.01 ? <mesh position={[-W / 2 + (W * pasteK) / 2, WL, front + 0.17]} material={mats.paste}><boxGeometry args={[W * pasteK, ringW * 1.5, 0.1]} /></mesh> : null}
        {/* la piedra pómez */}
        {stoneX < W / 2 + 0.5 ? <mesh position={[stoneX, WL + 0.02, front + 0.24]} rotation={[0.2, 0.3, 0.1]} material={mats.stone}><boxGeometry args={[0.55, 0.38, 0.32]} /></mesh> : null}
        {parts.map((p, i) => (<mesh key={"p" + i} position={p.p} scale={p.s} material={p.m}><sphereGeometry args={[0.03, 8, 6]} /></mesh>))}
        <mesh position={[0, -H / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[9, 3]} /><meshBasicMaterial color="#000000" transparent opacity={0.1} /></mesh>
      </ThreeCanvas>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null;
          const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={9} fill={l.alert ? RH.red : RH.yellow} stroke={RH.ink} strokeWidth={3} />
            <line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={RH.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        const est = l.text.length * 25 + 50; let x = l.dx < 0 ? p.x + l.dx - est : p.x + l.dx; x = Math.max(30, Math.min(width - est - 30, x));
        return (<div key={i} style={{ position: "absolute", left: x, top: Math.max(40, Math.min(height - 90, p.y + l.dy)), translate: "0 -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${RH.shadow}` }}>{l.text}</div>);
      })}
      {mode === "glaze" ? (
        <>
          <div style={{ position: "absolute", left: 260, bottom: 120, opacity: lin(f, 10, 22), fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: RH.ink, background: "rgba(255,255,255,0.85)", padding: "6px 22px", borderRadius: 10 }}>OLD, HEAVY GLAZE</div>
          <div style={{ position: "absolute", right: 260, bottom: 120, opacity: lin(f, 18, 30), fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: RH.red, background: "rgba(255,255,255,0.85)", padding: "6px 22px", borderRadius: 10 }}>NEWER, THIN GLAZE</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
