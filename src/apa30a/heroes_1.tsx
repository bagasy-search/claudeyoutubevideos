// apa30a · componentes únicos, minutos 0-9 (kit h3d + farmkit: objeto real con material, luz con motivo, cámara en curva).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { SoilBlock, TunnelCut, Ridge, Mound, Mole, Worm, Can, Board, Flag, Boot, grassT, soilT } from "./farmkit";

const PI = Math.PI;

// ---- 0:08 · LA TABLA SE LEVANTA: la tabla del pozo sube con peso y abajo, en la lata, está él con las manos juntas ----
export const HCanBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130e" key1={[-1.0, 1.6, 1.2]}
  cam={{ at: [0, -0.08, 0.02], az: [0.45, 0.15], el: [0.42, 0.3], r: [1.0, 0.78], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={930} txt="ALIVE · NOT A MARK ON HIM" col={AMB} />}>{(tt) => {
  const lift = eio(tt, 0.5, 1.6), tilt = phys(tt, 0.5, 5, 0.5);
  return <>
    {/* el bloque de tierra cortado justo por el medio de la lata: la vemos enterrada, con él adentro */}
    <SoilBlock w={1.3} h={0.42} d={0.7} p={[0, 0, -0.35]} />
    <TunnelCut pts={[[-0.65, -0.1], [-0.3, -0.11], [-0.09, -0.1]]} z={0.002} r={0.032} />
    <TunnelCut pts={[[0.09, -0.1], [0.35, -0.09], [0.65, -0.1]]} z={0.002} r={0.032} />
    <Can p={[0, -0.31, 0.088]} r={0.085} h={0.2} half />
    <mesh position={[0, -0.21, 0.004]}><planeGeometry args={[0.17, 0.2]} /><meshStandardMaterial color="#1a120b" roughness={1} /></mesh>
    <group position={[0, -0.265, 0.09]}><Mole s={0.72} rot={[0.15, 0.6, 0]} paddle={0.25 + 0.05 * Math.sin(tt * 2)} nose={tt} /></group>
    <Board p={[0.04 + 0.22 * lift, 0.012 + 0.3 * lift, -0.12 - 0.05 * lift]} rot={[-0.9 * cl(tilt), 0.3 * lift, 0.25 * lift]} />
    {[0, 1, 2].map((i) => <Mound key={i} p={[-0.4 + i * 0.38, 0, -0.5 + 0.12 * Math.sin(i)]} s={0.5} />)}
    <pointLight position={[0, 0.2 * lift - 0.05, 0.15]} intensity={2.2 * lift} distance={0.8} color="#ffe2b0" />
  </>;
}}</Scene3D>;

// ---- 1:05 · 9 DE 10 ESTÁN MUERTOS: el pasto con diez lomos; nueve se apagan grises y se hunden, uno solo queda latiendo ----
export const HRidgesDead: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#11140d" key1={[-1.6, 0.9, 0.7]}
  cam={{ at: [0, 0, 0], az: [-0.5, 0.35], el: [0.46, 0.36], r: [1.8, 1.45], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={140} txt="90 % OF THE RIDGES ARE DEAD" col={RED} />}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
  {Array.from({ length: 10 }, (_, i) => {
    const x0 = -0.95 + (i % 5) * 0.45, z0 = -0.45 + Math.floor(i / 5) * 0.65, live = i === 7, die = live ? 0 : eio(tt, 1.0 + i * 0.18, 1.6 + i * 0.18);
    const pts = [[x0, 0, z0], [x0 + 0.1, 0, z0 + 0.12 * Math.sin(i)], [x0 + 0.22, 0, z0 - 0.05], [x0 + 0.34, 0, z0 + 0.1 * Math.cos(i * 2)]];
    const pulse = 2.6 * (live ? 1 + 0.25 * Math.max(0, Math.sin(tt * 3.2)) * cl(tt - 2.6) : 1 - 0.3 * die);
    return <group key={i}>
      <Ridge id={"rd2" + i} pts={pts} r={0.062} up={pulse} col={live && tt > 2.6 ? "#9a7446" : new THREE.Color("#8a6a44").lerp(new THREE.Color("#6e6a62"), die).getStyle()} />
      {live && tt > 2.6 && <pointLight position={[x0 + 0.17, 0.08, z0]} intensity={1.6 * cl(tt - 2.6)} distance={0.5} color="#ffd08a" />}
    </group>;
  })}
</>}</Scene3D>;

// ---- 2:10 · MENOS QUE UNA BARRA DE MANTECA: la balanza de cocina vieja; el topo en un plato, la manteca en el otro, y la manteca gana ----
export const HButter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1.1, 1.8, 1.2]}
  cam={{ at: [0, 0.18, 0], az: [-0.4, 0.3], el: [0.35, 0.25], r: [1.15, 0.95], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.4} x={960} y={150} txt="3 TO 5 OUNCES" col={AMB} />}>{(tt) => {
  const m = phys(tt, 0.3, 6, 0.5), b = phys(tt, 1.1, 6, 0.5), tilt = -0.18 * cl(b) * phys(tt, 1.2, 4, 0.35);
  return <>
    <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.012, 0.04, 0.24, 20]} />{M.brass()}</mesh>
    <group position={[0, 0.25, 0]} rotation={[0, 0, tilt]}>
      <RBox s={[0.62, 0.012, 0.02]} r={0.004}>{M.brass()}</RBox>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.3, -0.06 - sd * tilt * 0.3, 0]} rotation={[0, 0, -tilt]}>
        <mesh><cylinderGeometry args={[0.13, 0.11, 0.018, 40]} />{M.brass()}</mesh>
        {sd < 0 && m > 0.01 && <group position={[0, 0.01 + (1 - cl(m)) * 0.3, 0]}><Mole s={1.05} rot={[0, 0.6, 0]} paddle={tt * 0.2} /></group>}
        {sd > 0 && b > 0.01 && <group position={[0, 0.03 + (1 - cl(b)) * 0.3, 0]}>
          <RBox s={[0.17, 0.042, 0.05]} r={0.006}><meshStandardMaterial color="#f4e2a0" roughness={0.45} /></RBox>
          <RBox s={[0.1, 0.044, 0.052]} p={[0.04, 0, 0]} r={0.006}><meshStandardMaterial map={tex.paper()} roughness={0.8} /></RBox>
        </group>}
      </group>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 3:21 · TERCIOPELO SIN VETA: un parche de pelo parado; la mano lo barre hacia un lado y hacia el otro, y siempre vuelve a quedar derecho ----
export const HVelvet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#0f0e0d" key1={[-0.9, 1.4, 0.6]}
  cam={{ at: [0, 0.05, 0], az: [0.7, 0.2], el: [0.42, 0.3], r: [0.75, 0.6], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="NO GRAIN · LIES FLAT BOTH WAYS" col={TX} />}>{(tt) => {
  const sw = Math.sin((tt - 0.8) * 1.6) * cl((tt - 0.8) * 2), hx = sw * 0.32;
  return <>
    {Array.from({ length: 360 }, (_, i) => {
      const x = (i % 24) / 23 * 0.5 - 0.25, z = Math.floor(i / 24) / 14 * 0.32 - 0.16, d = Math.abs(x - hx), bend = cl(1 - d / 0.12) * Math.sign(Math.cos((tt - 0.8) * 1.6)) * 0.9;
      return <mesh key={i} position={[x + 0.005 * rn(i, 1), 0.035, z + 0.005 * rn(i, 2)]} rotation={[0, 0, -bend]}><cylinderGeometry args={[0.0018, 0.003, 0.07, 5]} /><meshStandardMaterial color={rn(i, 3) > 0.5 ? "#4d4945" : "#3c3936"} roughness={0.5} metalness={0.15} /></mesh>;
    })}
    <group position={[hx, 0.11, 0]} rotation={[0, 0, -0.3 * Math.cos((tt - 0.8) * 1.6)]}>
      <RBox s={[0.16, 0.05, 0.12]} r={0.024}><meshStandardMaterial color="#c9a184" roughness={0.6} /></RBox>
      {[0, 1, 2, 3].map((f) => <RBox key={f} s={[0.03, 0.03, 0.09]} p={[-0.06 + f * 0.04, -0.01, 0.09]} r={0.013}><meshStandardMaterial color="#c49b7e" roughness={0.6} /></RBox>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 3:58 · LA ESTRELLA DE 22 DEDOS: el hocico del topo estrellado se abre como flor; reloj de un cuarto de segundo ----
export const HStarNose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#120d0d" key1={[-0.6, 1.0, 1.2]}
  cam={{ at: [0, 0, 0], az: [-0.25, 0.3], el: [0.15, 0.05], r: [0.55, 0.42], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={1440} y={860} txt="¼ SECOND A BITE" col={AMB} />}>{(tt) => {
  const op = eio(tt, 0.6, 1.8), wig = Math.sin(tt * 9) * 0.05;
  return <>
    <mesh position={[0, 0, -0.12]} scale={[0.12, 0.1, 0.16]}><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#2d2a28" roughness={0.9} /></mesh>
    <mesh position={[0, 0, 0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.05, 0.06, 24]} /><meshStandardMaterial color="#d48a84" roughness={0.55} /></mesh>
    {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * PI * 2, len = (i % 11 === 5 || i % 11 === 6 ? 0.03 : 0.05) * (0.3 + 0.7 * op);
      return <mesh key={i} position={[Math.cos(a) * (0.03 + len / 2 * op), Math.sin(a) * (0.03 + len / 2 * op), 0.055]} rotation={[0, 0, a - PI / 2 + wig * Math.sin(i)]}><capsuleGeometry args={[0.0065, len, 4, 10]} /><meshPhysicalMaterial color="#ee9a96" roughness={0.35} clearcoat={0.5} /></mesh>; })}
    <group position={[0.2, -0.07, 0.04]} rotation={[0, -0.6, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.02, 40]} />{M.brass()}</mesh>
      <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.062, 40]} /><meshStandardMaterial color="#f4efe4" /></mesh>
      <mesh position={[0, 0, 0.013]} rotation={[0, 0, -PI / 2 * cl((tt - 2.2) / 0.25)]}><planeGeometry args={[0.004, 0.11]} /><meshStandardMaterial color="#c22a26" /></mesh>
      <mesh position={[0, 0, 0.012]} rotation={[0, 0, 0]}><ringGeometry args={[0.045, 0.06, 40, 1, 0, PI / 2 * cl((tt - 2.2) / 0.25)]} /><meshBasicMaterial color="#ffb257" transparent opacity={0.8} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 4:30 · NO ES UN ROEDOR: dos ramas de un árbol tallado; el topo de arcilla salta de la rama de los roedores a la de las musarañas ----
export const HNotRodent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-1.2, 1.9, 1.4]}
  cam={{ at: [0, 0.22, 0], az: [0.3, -0.3], el: [0.3, 0.22], r: [1.4, 1.15], fov: 32 }}>{(tt) => {
  const jump = eio(tt, 1.8, 2.8), arc = Math.sin(PI * jump) * 0.22;
  const mx = lerp(-0.42, 0.42, jump), my = 0.36 + arc;
  return <>
    <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.03, 0.05, 0.24, 12]} /><meshStandardMaterial map={tex.wood(1, 1, [92, 62, 36])} /></mesh>
    {[-1, 1].map((sd) => <group key={sd}>
      <mesh position={[sd * 0.22, 0.27, 0]} rotation={[0, 0, sd * -1.1]} castShadow><cylinderGeometry args={[0.018, 0.026, 0.5, 10]} /><meshStandardMaterial map={tex.wood(1, 1, [92, 62, 36])} /></mesh>
      <RBox s={[0.4, 0.02, 0.18]} p={[sd * 0.42, 0.33, 0]} r={0.006}><meshStandardMaterial map={tex.wood(1, 1, [120, 84, 50])} /></RBox>
    </group>)}
    {/* roedores: ratón y ardilla de tierra (izq) · musaraña (der) */}
    <group position={[-0.52, 0.34, 0.02]}><mesh scale={[0.04, 0.03, 0.055]} position={[0, 0.03, 0]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#8a8580" /></mesh></group>
    <group position={[-0.32, 0.34, 0.02]}><mesh scale={[0.05, 0.035, 0.07]} position={[0, 0.035, 0]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#9a7a52" /></mesh></group>
    <group position={[0.52, 0.34, 0.02]}><mesh scale={[0.03, 0.022, 0.05]} position={[0, 0.022, 0]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#5a504a" /></mesh><mesh position={[0, 0.02, 0.055]} rotation={[PI / 2, 0, 0]}><coneGeometry args={[0.01, 0.03, 10]} /><meshStandardMaterial color="#c88a80" /></mesh></group>
    <group position={[mx, my, 0.02]} rotation={[0, jump > 0.5 ? -PI / 2 : PI / 2, 0]}><Mole s={0.9} paddle={jump * 2} /></group>
    {tt > 2.9 && <mesh position={[-0.42, 0.42, 0.02]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.16 * eio(tt, 2.9, 3.2), 0.018, 0.01]} />{M.glow({ col: RED })}</mesh>}
    {tt > 2.9 && <mesh position={[-0.42, 0.42, 0.02]} rotation={[0, 0, -PI / 4]}><boxGeometry args={[0.16 * eio(tt, 3.0, 3.3), 0.018, 0.01]} />{M.glow({ col: RED })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 5:08 · SU PESO EN LOMBRICES POR DÍA: la balanza otra vez no: un plato hondo que se llena de lombrices hasta igualar al topo en la otra mano ----
export const HWormWeight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" key1={[-1.0, 1.6, 1.0]}
  cam={{ at: [0, 0.08, 0], az: [-0.3, 0.4], el: [0.6, 0.45], r: [0.85, 0.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={150} txt="70–100 % OF HIS WEIGHT · EVERY DAY" col={AMB} />}>{(tt) => {
  const n = Math.floor(cl((tt - 0.6) / 3.2) * 26);
  return <>
    <group position={[-0.2, 0, 0]}><mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.13, 0.1, 0.04, 40]} />{M.porcelain()}</mesh><group position={[0, 0.04, 0]}><Mole s={1.0} rot={[0, 0.8, 0]} nose={tt} /></group></group>
    <group position={[0.2, 0, 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.14, 0.1, 0.06, 40, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      {Array.from({ length: n }, (_, i) => <Worm key={i} id={"ww" + (i % 5)} p={[(rn(i, 1) - 0.5) * 0.16, 0.012 + Math.floor(i / 8) * 0.012, (rn(i, 2) - 0.5) * 0.16]} len={0.09} ph={tt * 0.6 + i} s={1} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 6:40 · VOLCÁN O MEDIALUNA: dos montículos vistos desde arriba; el redondo con el tapón al medio es topo, la medialuna con el tapón al costado es tuza ----
export const HHalfMoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#10120c"
  cam={{ at: [0, 0, 0], az: [0.2, -0.2], el: [1.15, 0.95], r: [1.1, 0.9], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.6} x={600} y={900} txt="MOLE" col={GRN} /><Tag tt={tt} at={2.6} x={1320} y={900} txt="POCKET GOPHER" col={AMB} /></>}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
  <group position={[-0.32, 0, 0]} scale={phys(tt, 0.5, 6, 0.5)}><Mound p={[0, 0, 0]} s={1.8} /></group>
  <group position={[0.32, 0, 0]} scale={phys(tt, 1.4, 6, 0.5)}>
    <mesh scale={[1.8, 0.8, 1.2]} castShadow><sphereGeometry args={[0.1, 18, 10, 0, PI, 0, PI / 2]} /><meshStandardMaterial map={soilT()} color="#7a6346" roughness={1} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.012, -0.03]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.022, 14]} /><meshStandardMaterial color="#2a1c10" /></mesh>
  </group>
  {tt > 1.9 && <mesh position={[-0.32, 0.07, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.04, 30]} />{M.glow({ col: GRN, op: 0.8 * cl((tt - 1.9) * 3) })}</mesh>}
  {tt > 2.9 && <mesh position={[0.32, 0.05, -0.03]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.04, 30]} />{M.glow({ col: AMB, op: 0.8 * cl((tt - 2.9) * 3) })}</mesh>}
</>}</Scene3D>;

// ---- 7:14 · LA PRUEBA DE LA BOTA: la bota baja sobre el lomo y lo aplasta; al lado se clava la banderita naranja ----
export const HStomp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#11140d" key1={[-1.3, 1.8, 0.8]}
  cam={{ at: [0, 0.05, 0], az: [-0.6, -0.2], el: [0.42, 0.3], r: [0.95, 0.75], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="PRESS · FLAG · WAIT A DAY" col={AMB} />}>{(tt) => {
  const down = eio(tt, 0.6, 1.1) * (1 - eio(tt, 1.7, 2.3)), flat = cl((tt - 0.95) * 6), fl = phys(tt, 2.3, 9, 0.4);
  return <>
    <SoilBlock w={1.2} h={0.3} d={0.8} />
    <Ridge id="st" pts={[[-0.5, 0, 0.05], [-0.2, 0, -0.02], [0.1, 0, 0.04], [0.5, 0, -0.03]]} r={0.055} up={1 - 0.85 * flat} />
    <group position={[-0.05, 0.02 + 0.1 * (1 - down), 0.02 - 0.12 * eio(tt, 1.7, 2.3)]}><Boot rot={[0, PI / 2, 0]} s={1.35} /></group>
    {tt > 2.3 && <group position={[0.16, 0.14 * (1 - cl(fl)), 0.12]}><Flag tt={tt} /></group>}
    {flat > 0 && flat < 1 && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.2, 0.02 + 0.05 * flat, 0.02 + (rn(i, 2) - 0.5) * 0.1]}><sphereGeometry args={[0.006, 6, 6]} /><meshStandardMaterial color="#5a4632" /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 8:15 · CAMINA PEGADO A LA PARED: el patio desde arriba; el túnel vivo corre al ras de la vereda, del cantero y del alambrado ----
export const HEdgeRoad: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#10120c"
  cam={{ at: [0, 0, 0], az: [0.0, 0.3], el: [1.2, 1.0], r: [1.9, 1.6], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="THE MAIN RUN HUGS AN EDGE" col={AMB} />}>{(tt) => {
  const k = cl((tt - 0.8) / 2.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <RBox s={[2.4, 0.03, 0.18]} p={[0, 0.015, 0.62]} r={0.005}><meshStandardMaterial map={tex.counter(6, 1)} color="#6e6a62" roughness={0.95} /></RBox>
    <mesh position={[-0.32, 0.002, -0.15]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.5]} /><meshBasicMaterial color="#000" transparent opacity={0.35} /></mesh>
    <RBox s={[0.7, 0.08, 0.4]} p={[-0.32, 0.04, -0.15]} r={0.01}><meshStandardMaterial map={tex.wood(2, 1, [110, 74, 44])} roughness={0.9} /></RBox>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-1.15 + i * 0.29, 0.12, -0.72]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.24, 8]} /><meshStandardMaterial map={tex.wood(1, 1, [96, 70, 46])} /></mesh>)}
    <Ridge id="er1" pts={[[-1.1, 0, 0.5], [-0.4, 0, 0.49], [0.3, 0, 0.5], [1.1, 0, 0.48]].slice(0, 2 + Math.round(2 * k))} r={0.03} up={k > 0 ? 1 : 0.02} col="#8a6a3e" />
    <Ridge id="er2" pts={[[-0.22, 0, 0.48], [-0.22, 0, 0.1], [-0.22, 0, -0.2], [-0.3, 0, -0.62], [0.6, 0, -0.62]]} r={0.026} up={cl(k * 2 - 0.6)} col="#8a6a3e" />
    {Array.from({ length: 5 }, (_, i) => <Ridge key={i} id={"ew" + i} pts={[[0.1 + i * 0.16, 0, 0.1], [0.18 + i * 0.16, 0, -0.05], [0.12 + i * 0.16, 0, -0.25]]} r={0.022} up={0.6} col="#5f5a50" />)}
    <pointLight position={[-0.22, 0.3, 0.1]} intensity={0.5 * k} distance={1.2} color="#ffd08a" />
  </>;
}}</Scene3D>;

// ---- 8:55 · EL TUBO CON DOS PUERTITAS: el tubo transparente; el topo empuja la puerta con el hocico, entra, y la puerta cae detrás ----
export const HTubeTrap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15110c" key1={[-1.0, 1.4, 1.0]}
  cam={{ at: [0, 0.05, 0], az: [0.55, 0.15], el: [0.3, 0.2], r: [0.95, 0.75], fov: 30 }}>{(tt) => {
  const mx = lerp(-0.55, 0.02, eio(tt, 0.6, 2.4)), door = cl((mx + 0.18) / 0.06) * (1 - eio(tt, 2.5, 2.8));
  return <>
    <SoilBlock w={1.4} h={0.35} d={0.6} p={[0, 0, -0.32]} grass />
    <mesh position={[0, 0.06, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.055, 0.055, 0.34, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.17, 0.06, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.056, 0.006, 8, 32]} />{M.plastic({ col: "#2b5d2b" })}</mesh>)}
    <group position={[-0.17, 0.115, 0]} rotation={[0, 0, -1.2 * door]}><mesh position={[0, -0.05, 0]}><boxGeometry args={[0.004, 0.1, 0.09]} />{M.steel()}</mesh></group>
    <group position={[0.17, 0.115, 0]}><mesh position={[0, -0.05, 0]}><boxGeometry args={[0.004, 0.1, 0.09]} />{M.steel()}</mesh></group>
    <group position={[mx, 0.012, 0]} rotation={[0, PI / 2, 0]}><Mole s={0.85} paddle={tt * 1.4} nose={tt} /></group>
  </>;
}}</Scene3D>;

// ---- 9:45 · LA MEDIDA DE LA LATA: la lata gira y se dibujan las dos cotas, 6-7" de boca y 8-9" de hondo; la pared lisa brilla ----
export const HCanMeasure: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[-0.8, 1.5, 1.1]}
  cam={{ at: [0, 0.12, 0], az: [-0.5, 0.5], el: [0.28, 0.18], r: [0.8, 0.66], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.4} x={960} y={150} txt={'6–7" ACROSS'} col={AMB} /><Tag tt={tt} at={2.4} x={1500} y={560} txt={'8–9" DEEP'} col={AMB} /></>}>{(tt) => {
  const a = eio(tt, 1.0, 1.6), b = eio(tt, 2.0, 2.6);
  return <>
    <group rotation={[0, tt * 0.25, 0]}><Can r={0.085} h={0.23} /></group>
    <mesh position={[0, 0.26, 0.11]}><boxGeometry args={[0.17 * a, 0.004, 0.004]} />{M.glow({ col: AMB })}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.085 * a, 0.26, 0.11]}><boxGeometry args={[0.004, 0.025, 0.004]} />{M.glow({ col: AMB, op: a })}</mesh>)}
    <mesh position={[0.13, 0.115 + 0.115 * (1 - b) * 0, 0]}><boxGeometry args={[0.004, 0.23 * b, 0.004]} />{M.glow({ col: AMB })}</mesh>
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.0855, 0.0855, 0.2, 40, 1, true, -0.3 + tt * 0.6, 0.25]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.18 * cl(tt - 2.8)} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;
export const _u = { TunnelCut, Worm };
