// ohf30c · CUADRO 0 = la miniatura sin texto, rehecha en 3D: la ventana guillotina vieja con el día nevado afuera, la tira de
// bronce en V a lo largo de la jamba derecha, el chiflete de aire frío entrando por la rendija y el rollo de bronce en el antepecho.
// A la derecha queda el lugar de él. F0 s después: CORTE SECO al avatar.
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, rn } from "./h3d";
import { OH, OW, OldWin, VStrip } from "./winkit";

const PI = Math.PI;
export const F0 = 1.2;
const H0 = { k: "f0", at: -4, out: 2 } as unknown as H;
const wall = <meshStandardMaterial color="#9a8c74" roughness={0.92} />;

export const Frame0: React.FC<{ t: number }> = ({ t }) => <Scene3D t={t} h={H0} mode="iris" floor="none" wall="none" bg="#cfd8de" key1={[0.9, 1.2, 1.4]} warm={0.75}
  cam={{ at: [0.1, 0.32, 0.05], az: [0.34, 0.28], el: [0.04, 0.03], r: [1.08, 1.0], fov: 32 }}>{(tt) => <>
  {/* la pared del cuarto alrededor de la ventana */}
  <RBox s={[1.2, 1.6, 0.02]} p={[-0.95, 0.4, 0.08]} r={0.002} shadow={false}>{wall}</RBox>
  <RBox s={[1.4, 1.6, 0.02]} p={[1.05, 0.4, 0.08]} r={0.002} shadow={false}>{wall}</RBox>
  <RBox s={[0.9, 0.6, 0.02]} p={[0, 1.2, 0.08]} r={0.002} shadow={false}>{wall}</RBox>
  <RBox s={[0.9, 0.6, 0.02]} p={[0, -0.33, 0.08]} r={0.002} shadow={false}>{wall}</RBox>
  {/* afuera: nieve que cae, árboles pelados y el jardín blanco */}
  <mesh position={[0, 0.12, -0.15]}><planeGeometry args={[1.2, 0.35]} /><meshBasicMaterial color="#f6f9fb" toneMapped={false} /></mesh>
  {Array.from({ length: 7 }, (_, i) => <mesh key={"tr" + i} position={[-0.3 + i * 0.1 + 0.03 * rn(i, 1), 0.5, -0.145]}><planeGeometry args={[0.012 + 0.01 * rn(i, 2), 0.6]} /><meshBasicMaterial color="#56606a" transparent opacity={0.8} toneMapped={false} /></mesh>)}
  {Array.from({ length: 90 }, (_, i) => { const u = (tt * (0.05 + 0.04 * rn(i, 3)) + rn(i, 4)) % 1;
    return <mesh key={"sn" + i} position={[-0.25 + 0.5 * rn(i, 5) + 0.01 * Math.sin(tt + i), 0.85 - u * 0.85, -0.1 + 0.06 * rn(i, 6)]}><circleGeometry args={[0.003 + 0.003 * rn(i, 7), 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>; })}
  <OldWin sky="#c9d7e2" gap={{ side: 0.9 }} gapCol="#7fd0ff" />
  {/* nieve pegada en el vidrio de abajo y sobre el antepecho */}
  {Array.from({ length: 40 }, (_, i) => <mesh key={"fr" + i} position={[-OW / 2 + 0.04 + (OW - 0.08) * rn(i, 8), 0.04 + 0.05 * rn(i, 9) ** 2, 0.03]}><circleGeometry args={[0.004 + 0.006 * rn(i, 10), 7]} /><meshBasicMaterial color="#f3f8fb" transparent opacity={0.85} /></mesh>)}
  {Array.from({ length: 30 }, (_, i) => <mesh key={"sl" + i} position={[-0.2 + 0.55 * rn(i, 11), 0.004, 0.07 + 0.06 * rn(i, 12)]}><sphereGeometry args={[0.006 + 0.008 * rn(i, 13), 8, 6]} /><meshStandardMaterial color="#f7fafc" roughness={0.6} /></mesh>)}
  {/* la tira de bronce en V a lo largo de la jamba derecha */}
  <VStrip L={OH * 0.62} open={0.6} p={[OW / 2 - 0.02, 0.05, 0.05]} rot={[0, -PI / 2, 0]} wing={0.016} col="#c98a4e" />
  {/* el chiflete: aire frío que entra por la rendija y cruza el vidrio */}
  {Array.from({ length: 14 }, (_, i) => { const u = (tt * (0.5 + 0.3 * rn(i, 20)) + rn(i, 21)) % 1, L = 0.08 + 0.1 * rn(i, 22), y = 0.2 + 0.2 * rn(i, 23);
    return <mesh key={"wd" + i} position={[OW / 2 - 0.03 - u * 0.3 - L / 2, y + 0.02 * u, 0.06 + 0.04 * u]}><boxGeometry args={[L, 0.006 + 0.004 * rn(i, 24), 0.001]} />{M.glow({ col: "#7ccdff", op: Math.sin(PI * u) })}</mesh>; })}
  {/* el rollo de bronce en el antepecho */}
  <group position={[0.17, 0.09, 0.17]} rotation={[PI / 2 - 0.6, 0, 0.3]} scale={1.3}>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0, -0.004 * i]}><torusGeometry args={[0.05 - 0.004 * i, 0.0035, 8, 48]} />{M.brass({ col: "#c98a4e" })}</mesh>)}
  </group>
</>}</Scene3D>;
