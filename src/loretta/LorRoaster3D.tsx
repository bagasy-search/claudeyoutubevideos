// LorRoaster3D — la fuente de aluminio con el jamón puesto con el corte hacia abajo: (stage "juice") entra UNA taza de líquido
// dorado en el fondo; (stage "foil") una hoja de aluminio baja, cubre el jamón y se crimpa alrededor del borde mientras
// sube el vapor. three.js real, todo por useCurrentFrame. Texto por props (inglés). Reusable (asados, pavo, pot roast).
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { LOR, SERIF, HAND } from "./LorTheme";
import { canvasTex } from "./lor3dutil";
import { Cam, HamMesh, PanMesh, PAN, domeH, useHamMats } from "./lorHamParts";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FW = 4.9, FD = 3.8, SX = 70, SZ = 54;

export const LorRoaster3D: React.FC<{ stage?: "juice" | "foil"; title?: string; sub?: string }> = ({ stage = "foil", title, sub }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const mats = useHamMats();
  const table = useMemo(() => new THREE.MeshStandardMaterial({ map: canvasTex((c, S) => { c.fillStyle = "#FFFDF7"; c.fillRect(0, 0, S, S); c.fillStyle = "rgba(200,50,58,0.5)"; const q = S / 8; for (let k = 0; k < 8; k += 2) { c.fillRect(k * q, 0, q, S); c.fillRect(0, k * q, S, q); } }, 512, 5), roughness: 0.9 }), []);
  const foilGeo = useMemo(() => new THREE.PlaneGeometry(FW, FD, SX, SZ), []);
  const grid = useMemo(() => { const a = foilGeo.attributes.position as any; return Array.from({ length: a.count }).map((_, i) => [a.getX(i), -a.getY(i)] as [number, number]); }, [foilGeo]); // la malla ORIGINAL (se reescribe cada cuadro)
  const foilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#D9DCE0", roughness: 0.3, metalness: 0.85, side: THREE.DoubleSide }), []);
  const juiceGeo = useMemo(() => new THREE.PlaneGeometry(PAN.w - 0.2, PAN.d - 0.2), []);
  const isFoil = stage === "foil";
  // ── vapor / jugo
  const T = durationInFrames;
  const pourP = interpolate(f, [10, 70], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const level = isFoil ? 0.1 : 0.04 + pourP * 0.07;
  const drop = interpolate(f, [10, T * 0.52], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const crimp = interpolate(f, [T * 0.5, T * 0.78], [0, 1], cl);
  // ── hoja de aluminio: de arriba (con ondas) a cubrir el domo y caer por el borde con el crimpado
  if (isFoil) {
    const pos = foilGeo.attributes.position as any;
    for (let i = 0; i < pos.count; i++) {
      const [x, z] = grid[i]; // el plano está en XY: lo acostamos
      const ox = Math.abs(x) - PAN.w / 2, oz = Math.abs(z) - PAN.d / 2;
      const out = Math.max(ox, oz);
      let yEnd = Math.max(PAN.wall + 0.06, domeH(x, z) + PAN.thick + 0.05);
      if (out > 0) yEnd = PAN.wall + 0.02 - out * 1.1;
      const rip = Math.sin(x * 2.3 + z * 1.7 + 1.3) * 0.12 * (1 - drop) + Math.sin(x * 5 + z * 4) * 0.03 * (1 - drop);
      const yStart = 2.6 + rip + Math.sin(x * 1.1) * 0.25;
      let y = yStart + (yEnd - yStart) * drop;
      if (out > -0.25 && out < 0.5) y += Math.sin((Math.abs(x) > Math.abs(z) * (PAN.w / PAN.d) ? z : x) * 14) * 0.02 * crimp; // el crimpado
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true; foilGeo.computeVertexNormals();
  }
  const steam = isFoil ? interpolate(f, [T * 0.74, T * 0.9], [0, 1], cl) : 0;
  const ang = 0.5 + f * 0.012, dist = interpolate(f, [0, T], [9.2, 7.6], cl), elev = 0.62;
  const camPos: [number, number, number] = [Math.sin(ang) * dist * Math.cos(elev), dist * Math.sin(elev), Math.cos(ang) * dist * Math.cos(elev)];
  const titleIn = interpolate(f, [8, 26], [0, 1], { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE3C8" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: camPos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={camPos} target={[0, 0.5, 0]} />
        <color attach="background" args={["#EFE3C8"]} />
        <hemisphereLight args={["#FFF6E0", "#B98A5A", 0.95]} />
        <directionalLight position={[3, 6, 4]} intensity={2.1} color="#FFF1D6" />
        <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#DDE8FF" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={table}><planeGeometry args={[18, 18]} /></mesh>
        <PanMesh mats={mats} />
        <mesh geometry={juiceGeo} material={mats.juice} rotation={[-Math.PI / 2, 0, 0]} position={[0, level, 0]} />
        <HamMesh mats={mats} glaze={0.55} score={0} cloves={0} />
        {!isFoil && pourP < 1 ? <mesh material={mats.juice} position={[-1.1, (2.6 + level) / 2, 0.9]}><cylinderGeometry args={[0.07, 0.07, 2.6 - level, 12]} /></mesh> : null}
        {isFoil ? <mesh geometry={foilGeo} material={foilMat} /> : null}
        {isFoil ? Array.from({ length: 16 }).map((_, i) => { const u = (f * 0.012 + i * 0.37) % 1; const side = i % 4; const px = side < 2 ? (i % 2 ? 1 : -1) * (PAN.w / 2 + 0.1) : ((i * 0.53) % 1 - 0.5) * 3.2; const pz = side >= 2 ? (i % 2 ? 1 : -1) * (PAN.d / 2 + 0.1) : ((i * 0.31) % 1 - 0.5) * 2.4; return (
          <mesh key={i} position={[px, 0.6 + u * 1.7, pz]}><sphereGeometry args={[0.1 + u * 0.18, 10, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={steam * 0.5 * (1 - u)} roughness={1} depthWrite={false} /></mesh>); }) : null}
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
