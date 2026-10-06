// RhBottle3D — la botella marrón de agua oxigenada en 3D real (three.js), apoyada en la mesada del baño, girando despacio con
// la luz de la ventana. Etiqueta en BLANCO (sin marca). Reusable:
//   title/sub/tag  rótulos en el mundo (tarjeta colgada del cuello / cartel de precio)
//   sprayer        rociador de gatillo enroscado (default) o tapa común
//   compare        al lado, una botella TRANSPARENTE al sol que pierde burbujas ("se pone chata") y la marrón que las conserva
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, SERIF, HAND, rnd, clamp01 } from "./RhTheme";
import { tileBg, lin, pop } from "./RhParts";

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
function bottleGeo() {
  const p: any[] = [];
  const prof: [number, number][] = [[0, 0], [0.42, 0], [0.47, 0.04], [0.48, 0.12], [0.48, 1.25], [0.46, 1.38], [0.36, 1.58], [0.22, 1.72], [0.17, 1.8], [0.17, 1.98], [0, 1.98]];
  for (const [r, y] of prof) p.push(new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(p, 56);
}
const Bottle: React.FC<{ x: number; rotY: number; clear?: boolean; sprayer?: boolean; flat?: number }> = ({ x, rotY, clear, sprayer = true, flat = 0 }) => {
  const g = useMemo(() => bottleGeo(), []);
  const m = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial(clear ? { color: "#F2F7FA", roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1 } : { color: "#4A2810", roughness: 0.16, clearcoat: 0.8, transparent: true, opacity: 0.94 }),
    label: new THREE.MeshStandardMaterial({ color: "#FAFAF7", roughness: 0.7, side: THREE.DoubleSide }),
    white: new THREE.MeshStandardMaterial({ color: "#F4F4F2", roughness: 0.4 }),
    liquid: new THREE.MeshStandardMaterial({ color: "#EAF6FF", transparent: true, opacity: 0.5 }),
    bub: new THREE.MeshStandardMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.85 }),
  }), [clear]);
  return (
    <group position={[x, 0, 0]} rotation={[0, rotY, 0]}>
      <mesh geometry={g} material={m.body} />
      {!clear ? <mesh position={[0, 0.72, 0]} material={m.label}><cylinderGeometry args={[0.487, 0.487, 0.72, 48, 1, true]} /></mesh> : null}
      {clear ? <mesh position={[0, 0.62, 0]} material={m.liquid}><cylinderGeometry args={[0.44, 0.44, 1.2, 32]} /></mesh> : null}
      {clear ? Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[(rnd(i) - 0.5) * 0.6, 0.15 + rnd(i + 9) * 1.0, (rnd(i + 4) - 0.5) * 0.6]} scale={Math.max(0.001, 1 - flat)} material={m.bub}><sphereGeometry args={[0.03, 8, 6]} /></mesh>
      )) : null}
      {sprayer ? (
        <group position={[0, 1.98, 0]}>
          <mesh position={[0, 0.1, 0]} material={m.white}><cylinderGeometry args={[0.2, 0.2, 0.2, 24]} /></mesh>
          <mesh position={[0.05, 0.36, 0]} material={m.white}><boxGeometry args={[0.36, 0.32, 0.26]} /></mesh>
          <mesh position={[0.36, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} material={m.white}><cylinderGeometry args={[0.07, 0.09, 0.32, 16]} /></mesh>
          <mesh position={[0.2, 0.12, 0]} rotation={[0, 0, 0.35]} material={m.white}><boxGeometry args={[0.07, 0.34, 0.16]} /></mesh>
        </group>
      ) : <mesh position={[0, 2.08, 0]} material={m.white}><cylinderGeometry args={[0.2, 0.2, 0.2, 24]} /></mesh>}
    </group>
  );
};

export const RhBottle3D: React.FC<{ title?: string; sub?: string; tag?: string; sprayer?: boolean; compare?: { clear: string; brown: string } }> = ({ title = "3% hydrogen peroxide", sub = "the regular drugstore kind", tag, sprayer = true, compare }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames, fps } = useVideoConfig();
  const T = durationInFrames;
  const rot = interpolate(f, [0, T], [-0.5, 0.55]);
  const dist = interpolate(f, [0, T], [5.6, 4.7], { easing: Easing.out(Easing.quad) });
  const target = new THREE.Vector3(compare ? 0 : 0.35, 1.05, 0);
  const pos = new THREE.Vector3(Math.sin(-0.18) * dist + target.x, 1.9, Math.cos(-0.18) * dist);
  const sun = compare ? clamp01(f / (T * 0.7)) : 0;
  const p1 = pop(f, fps, 8), p2 = lin(f, 18, 34);
  return (
    <AbsoluteFill style={{ ...tileBg(), overflow: "hidden" }}>
      {/* mesada de mármol claro */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(#EDEAE4, #DCD7CE)", borderTop: "6px solid #F8F6F2" }} />
      {compare ? <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,236,170,${0.55 * sun}) 0%, rgba(255,236,170,${0.35 * sun}) 30%, rgba(255,236,170,0) 52%)` }} /> : null}
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true }}>
        <Cam pos={pos} target={target} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[-5, 5, 3]} intensity={1.4 + sun} />
        <directionalLight position={[4, 2, 4]} intensity={0.4} />
        {compare ? (
          <>
            <Bottle x={-0.85} rotY={rot} clear sprayer={false} flat={sun} />
            <Bottle x={0.85} rotY={-rot} sprayer={false} />
          </>
        ) : <Bottle x={0} rotY={rot} sprayer={sprayer} />}
      </ThreeCanvas>
      {compare ? (
        <>
          <div style={{ position: "absolute", left: "31%", top: 150, translate: "-50% 0", opacity: lin(f, T * 0.45, T * 0.55), background: RH.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 48, padding: "8px 26px", borderRadius: 10 }}>{compare.clear}</div>
          <div style={{ position: "absolute", left: "69%", top: 150, translate: "-50% 0", opacity: lin(f, T * 0.6, T * 0.7), background: RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 48, padding: "8px 26px", borderRadius: 10 }}>{compare.brown}</div>
        </>
      ) : (
        <div style={{ position: "absolute", left: 140, top: 250, opacity: p1, translate: `${(1 - p1) * -60}px 0` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: RH.ink, lineHeight: 1, maxWidth: 760 }}>{title}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: RH.blueDeep, marginTop: 14, clipPath: `inset(0 ${100 - p2 * 100}% 0 0)` }}>{sub}</div>
          {tag ? <div style={{ display: "inline-block", marginTop: 30, rotate: "-4deg", background: RH.yellow, color: RH.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 56, padding: "6px 26px", borderRadius: 10, opacity: lin(f, 30, 40), boxShadow: `0 12px 26px ${RH.shadow}` }}>{tag}</div> : null}
        </div>
      )}
    </AbsoluteFill>
  );
};
