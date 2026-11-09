// ohf8pb · CUADRO 0 = la miniatura sin texto, rehecha en 3D: la grieta larga, el mortero fresco y la llana, con pasto arriba a la derecha.
import React from "react";
import { H } from "./hkit";
import { RBox, Scene3D } from "./h3d";
import * as THREE from "three";
import { CONC, Conc, Slab, Trowel, Y0, Yard } from "./slabkit";

export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;
const seg = (a: number[], b: number[], w: number, c = "#1b1916") => { const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz); return <RBox key={a.join()} s={[l + 0.01, 0.003, w]} p={[(a[0] + b[0]) / 2, Y0 + 0.0255, (a[1] + b[1]) / 2]} rot={[0, -Math.atan2(dz, dx), 0]} r={0.0008} shadow={false}><meshBasicMaterial color={c} /></RBox>; };

const CRACK = [[-1.5, 0.3], [-1.18, 0.36], [-1.0, 0.33], [-0.84, 0.44], [-0.68, 0.42], [-0.56, 0.5], [-0.46, 0.5]];
const CRACK2 = [[-0.46, 0.5], [-0.28, 0.62], [-0.2, 0.74], [-0.04, 0.86], [0.02, 1.02], [0.12, 1.3]];
const BAND = (() => { const P = [[-0.5, 0.48], [-0.3, 0.46], [-0.08, 0.53], [0.18, 0.66], [0.44, 0.84], [0.62, 1.08], [0.74, 1.5], [0.08, 1.5], [0.02, 1.02], [-0.04, 0.86], [-0.2, 0.74], [-0.28, 0.62]]; const sh = new THREE.Shape(); P.forEach(([x, z], i) => (i ? sh.lineTo(x, -z) : sh.moveTo(x, -z))); sh.closePath(); return new THREE.ShapeGeometry(sh); })();

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="none" wall="none" bg="#b9cbd8" key1={[-1.2, 2.6, 1.6]}
  cam={{ at: [0.0, Y0 + 0.02, 0.32], az: [-0.2, -0.18], el: [0.74, 0.73], r: [1.9, 1.86], fov: 34 }}>{() => <>
  <Yard cut={false} />
  <Slab w={3.6} d={2.4} p={[0, Y0 - 0.08, 0]} k="f0" col={CONC.clean} />
  <mesh position={[1.45, Y0 + 0.028, -1.32]} rotation={[-Math.PI / 2, 0, 0.35]}><planeGeometry args={[2.4, 1.1]} /><meshStandardMaterial color="#6f8f3a" roughness={0.95} /></mesh>
  {CRACK.slice(1).map((q, i) => seg(CRACK[i], q, 0.03 - i * 0.002))}
  {seg([-0.42, 0.42], [0.8, -0.72], 0.006, "#6e6b62")}
  <mesh position={[0, Y0 + 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={BAND}><Conc col="#7b786e" k="f1" rough={0.62} /></mesh>
  {CRACK2.slice(1).map((q, i) => seg(CRACK2[i], q, 0.014))}
  <Trowel p={[0.08, Y0 + 0.062, 0.86]} rot={[0, 0.72, 0]} s={1.3} />
</>}</Scene3D>;
