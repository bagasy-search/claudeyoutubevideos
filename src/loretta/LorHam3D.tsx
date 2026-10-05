// LorHam3D — el jamón en 3D: (stage "score") el corte de rombos en la grasa aparece línea por línea y se le clava un clavo
// en cada rombo; (stage "juice") la fuente con las lonchas superpuestas como tejas y la cuchara que baja los jugos: las
// lonchas pasan de secas a brillantes. three.js real, todo por useCurrentFrame. Texto por props (inglés). Reusable.
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { LOR, SERIF, HAND } from "./LorTheme";
import { canvasTex } from "./lor3dutil";
import { Cam, HamMesh, useHamMats } from "./lorHamParts";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ROWS = 3, COLS = 6;

export const LorHam3D: React.FC<{ stage?: "score" | "juice"; title?: string; sub?: string }> = ({ stage = "score", title, sub }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const mats = useHamMats();
  const table = useMemo(() => new THREE.MeshStandardMaterial({ map: canvasTex((c, S) => { c.fillStyle = "#FFFDF7"; c.fillRect(0, 0, S, S); c.fillStyle = "rgba(200,50,58,0.5)"; const q = S / 8; for (let k = 0; k < 8; k += 2) { c.fillRect(k * q, 0, q, S); c.fillRect(0, k * q, S, q); } }, 512, 5), roughness: 0.9 }), []);
  const slice = useMemo(() => new THREE.SphereGeometry(1, 28, 18), []);
  const slMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#E58C84", roughness: 0.8 }), []);
  const sheen = useMemo(() => new THREE.MeshStandardMaterial({ color: "#B8782E", roughness: 0.1, metalness: 0.05, transparent: true, opacity: 0, depthWrite: false }), []);
  const plate = useMemo(() => new THREE.MeshStandardMaterial({ color: "#FFFDF7", roughness: 0.3 }), []);
  const rim = useMemo(() => new THREE.MeshStandardMaterial({ color: "#E8C45A", roughness: 0.4, metalness: 0.2 }), []);
  const T = durationInFrames;
  const ang = stage === "score" ? 0.25 + f * 0.014 : 0.1 + f * 0.007, dist = interpolate(f, [0, T], [11.6, 9.4], cl), elev = stage === "score" ? 0.55 : 0.78;
  const camPos: [number, number, number] = [Math.sin(ang) * dist * Math.cos(elev), dist * Math.sin(elev), Math.cos(ang) * dist * Math.cos(elev)];
  const titleIn = interpolate(f, [8, 26], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const scoreP = interpolate(f, [18, T * 0.48], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const clovesP = interpolate(f, [T * 0.5, T * 0.86], [0, 1], cl);
  const juiceP = interpolate(f, [30, T * 0.78], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  sheen.opacity = 0.3 * juiceP; slMat.color.set(juiceP > 0.5 ? "#E8918A" : "#D9A097");
  const spoonY = 2.4 - Math.min(1, interpolate(f, [8, 30], [0, 1], cl)) * 0.9;
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE3C8" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: camPos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={camPos} target={[0, 0.5, 0]} />
        <color attach="background" args={["#EFE3C8"]} />
        <hemisphereLight args={["#FFF6E0", "#B98A5A", 0.95]} />
        <directionalLight position={[3, 6, 4]} intensity={2.1} color="#FFF1D6" />
        <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#DDE8FF" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={table}><planeGeometry args={[18, 18]} /></mesh>
        {stage === "score" ? (
          <>
            <mesh material={plate} position={[0, 0.06, 0]}><cylinderGeometry args={[2.5, 2.3, 0.12, 48]} /></mesh>
            <HamMesh mats={mats} glaze={1} score={scoreP} cloves={clovesP} capTheta={0.95} position={[0, 0.12, 0]} />
          </>
        ) : (
          <>
            <mesh material={plate} position={[0, 0.06, 0]}><cylinderGeometry args={[3.9, 3.6, 0.12, 64]} /></mesh>
            <mesh material={rim} position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[3.55, 3.8, 64]} /></mesh>
            {Array.from({ length: ROWS * COLS }).map((_, i) => { const r = Math.floor(i / COLS), c = i % COLS; const x = (c - (COLS - 1) / 2) * 1.0 + (r % 2 ? 0.2 : 0), z = (r - (ROWS - 1) / 2) * 1.25; const lift = 0.07 + c * 0.012; const appear = interpolate(f, [4 + i * 1.5, 12 + i * 1.5], [0, 1], cl); return (
              <group key={i} position={[x, 0.2 + lift, z]} rotation={[-0.2, 0, 0]} scale={appear}>
                <mesh geometry={slice} material={slMat} scale={[0.6, 0.07, 0.48]} />
                <mesh geometry={slice} material={sheen} scale={[0.64, 0.075, 0.52]} position={[0, 0.006, 0]} />
              </group>); })}
            <mesh material={mats.juice} position={[0.2, (spoonY + 0.3) / 2, 0.1]} scale={[1, juiceP > 0 && juiceP < 1 ? 1 : 0.001, 1]}><cylinderGeometry args={[0.06, 0.06, spoonY - 0.3, 12]} /></mesh>
            <mesh material={rim} position={[0.2, spoonY, 0.1]} scale={[0.34, 0.1, 0.22]}><sphereGeometry args={[1, 16, 10]} /></mesh>
          </>
        )}
      </ThreeCanvas>
      {title ? (
        <div style={{ position: "absolute", left: 90, top: 70, opacity: titleIn, translate: `${(1 - titleIn) * -30}px 0px` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: LOR.ink, lineHeight: 1, letterSpacing: -1, textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>{title}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LOR.gingham, marginTop: 8, maxWidth: 1100 }}>{sub}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
