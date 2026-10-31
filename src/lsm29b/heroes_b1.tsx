// lsm29b · componentes únicos 1-6 (kit h3d + pg: el porche de Ruth en maqueta, la línea compartida, la camioneta de Lyle).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Plate, Steam, Table, Teacup, linenTex, paperTex } from "./tg";
import { Bill, House, Mug, Pickup, Porch, Rocker, SideTable, Sky, WallPhone } from "./pg";

const PI = Math.PI;

// ---- 0:26 · EL PESO EN EL PORCHE: una pesa de hierro cae sobre las tablas, el piso se hunde y la mecedora se mece sola ----
const w50 = () => tex.text("w50b", 256, 160, (g) => { g.fillStyle = "#2a2826"; g.fillRect(0, 0, 256, 160); g.fillStyle = "#e9e1cf"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 110px Georgia"; g.fillText("50", 128, 70); g.font = "900 34px Georgia"; g.fillText("POUNDS", 128, 138); });
export const HPorchweight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#2b3550" warm={0.85} key1={[-1.0, 2.4, 1.4]}
  cam={{ at: [0.05, 0.26, 0.0], at1: [0.1, 0.22, 0.08], az: [0.35, 0.2], el: [0.26, 0.2], r: [1.7, 1.3], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={1010} txt="THE WEIGHT ON THE PORCH" col={AMB} size={40} />}>{(tt) => {
  const T0 = 1.25, k = phys(tt, 0.75, 8, 0.32), land = tt > T0 ? 1 : 0, u = Math.max(0, tt - T0);
  const dip = land * (0.012 + 0.035 * Math.exp(-u * 2.2));
  const rock = 0.28 * land * Math.exp(-u * 0.45) * Math.sin(u * 3.6);
  return <>
    <Porch w={2.8} d={1.6} dip={dip} crack={cl(u / 0.25)} />
    <Rocker p={[-0.62, 0.03, -0.2]} ry={0.55} rock={rock} />
    <SideTable p={[0.32, 0.03, -0.5]} h={0.46} />
    <Mug p={[0.3, 0.52 + 0.006 * land * Math.exp(-u * 3) * Math.abs(Math.sin(u * 30)), -0.5]} />
    {/* la pesa: hierro fundido redondo con argolla y el 50 en relieve claro */}
    <group position={[0.15, 0.03 + 0.12 - dip + (1 - cl(k)) * 1.5, 0.12]} rotation={[0.04 * (1 - cl(k)), 0, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.15, 0.17, 0.24, 48]} /><meshStandardMaterial color="#2a2826" metalness={0.7} roughness={0.5} /></mesh>
      <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.12, 0.15, 0.03, 48]} /><meshStandardMaterial color="#2a2826" metalness={0.7} roughness={0.5} /></mesh>
      <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.065, 0.02, 14, 32]} /><meshStandardMaterial color="#2a2826" metalness={0.75} roughness={0.45} /></mesh>
      <mesh position={[0, 0, 0.162]}><planeGeometry args={[0.17, 0.106]} /><meshStandardMaterial map={w50()} roughness={0.6} metalness={0.3} /></mesh>
    </group>
    {/* astillas y polvo de madera que saltan de las tablas */}
    {Array.from({ length: 36 }, (_, i) => { if (u <= 0 || u > 1.6) return null; const a = rn(i, 2) * PI * 2, sp = 0.4 + 0.5 * rn(i, 3), d = 0.16 + sp * u;
      const y = Math.max(0.035, 0.04 + 1.4 * sp * u * 0.5 - 1.6 * u * u);
      return <mesh key={i} position={[0.15 + Math.cos(a) * d, y, 0.12 + Math.sin(a) * d]} rotation={[u * 9 * rn(i, 5), a, u * 7]}><boxGeometry args={[0.05 * (0.5 + rn(i, 4)), 0.009, 0.014]} /><meshStandardMaterial color={i % 3 ? "#9c6a3e" : "#c9a274"} roughness={0.8} transparent opacity={cl((1.4 - u) / 0.4)} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 0:58 · A UN BRAZO DE DISTANCIA: dos mecedoras frente a frente; una regla de carpintero se despliega entre las dos y en el medio queda la taza ----
const ruleTex = () => tex.text("rule2", 512, 64, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 512, 64); g.fillStyle = "#1e1810"; for (let i = 0; i <= 64; i++) g.fillRect(i * 8, 0, 3, i % 8 === 0 ? 30 : i % 4 === 0 ? 20 : 11); g.font = "900 24px Georgia"; for (let i = 1; i < 8; i++) g.fillText(String(i), i * 64 - 7, 56); });
export const HArmslength: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2b3550" warm={0.8}
  cam={{ at: [0, 0.5, 0.05], at1: [0, 0.55, 0.05], az: [0.1, -0.08], el: [0.2, 0.14], r: [2.4, 1.95], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={1010} txt="AN ARM'S LENGTH" col={AMB} size={42} />}>{(tt) => {
  const N = 6, L = 0.2, cupK = phys(tt, 2.9, 7, 0.4), push = eio(tt, 0.2, 1.2);
  // cada tramo se abre con su resorte, empujando al siguiente (zigzag que se estira de silla a silla)
  const rel = Array.from({ length: N }, (_, i) => i === 0 ? 0 : (i % 2 ? 1 : -1) * PI * 0.94 * (1 - cl(phys(tt, 0.6 + i * 0.3, 9, 0.5))));
  let x = 0, y = 0, acc = 0; const segs = rel.map((rl) => { acc += rl; const r = { x, y, a: acc }; x += Math.cos(acc) * L; y += Math.sin(acc) * L; return r; });
  return <>
    <Porch w={3.0} d={1.6} />
    <Rocker p={[-0.8 - 0.12 * (1 - push), 0.03, 0.1]} ry={PI / 2} rock={0.05 * Math.sin(tt * 1.3)} />
    <Rocker p={[0.8 + 0.12 * (1 - push), 0.03, 0.1]} ry={-PI / 2} rock={0.05 * Math.sin(tt * 1.3 + 1.4)} />
    {/* la regla plegable amarilla con números: la cara ancha mira a cámara */}
    <group position={[-0.6, 0.72, 0.12]}>
      {segs.map((sg, i) => <group key={i} position={[sg.x, sg.y, i * 0.008]} rotation={[0, 0, sg.a]}>
        <mesh position={[L / 2, 0, 0]} castShadow><boxGeometry args={[L, 0.05, 0.012]} /><meshStandardMaterial map={ruleTex()} roughness={0.45} /></mesh>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.013, 0.013, 0.016, 14]} />{M.brass()}</mesh>
      </group>)}
    </group>
    <SideTable p={[0, 0.03, 0.1]} h={0.42} />
    {tt > 2.85 && <group position={[0, 0.45 + (1 - cl(cupK)) * 0.35, 0.1]} scale={1.3}><Teacup tt={tt} steam={cl(cupK)} /></group>}
  </>;
}}</Scene3D>;

// ---- 2:22 · LA LÍNEA COMPARTIDA: ocho granjas colgadas del mismo cable; suena «dos largos y uno corto» y se prenden TODAS las cocinas ----
const FARMS = Array.from({ length: 8 }, (_, i) => { const a = -1.05 + i * 0.3; return [a, 0, -0.35 + 0.22 * Math.sin(i * 1.9)] as [number, number, number]; });
const RINGS = [[0.9, 1.6], [1.9, 2.6], [2.9, 3.15]];
const furrows = () => tex.text("furrows", 512, 512, (g) => { g.fillStyle = "#3e3a24"; g.fillRect(0, 0, 512, 512); for (let k = 0; k < 48; k++) { g.fillStyle = k % 2 ? "rgba(20,18,10,.55)" : "rgba(110,100,60,.35)"; g.fillRect(0, k * 10.7, 512, 5); } });
export const HPartyline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#141a2a" warm={0.6} key1={[-1.5, 2.6, 1.2]}
  cam={{ at: [0.1, 0.3, 0.0], at1: [0.15, 0.3, -0.05], az: [-0.2, -0.08], el: [0.22, 0.18], r: [1.75, 1.55], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={1010} txt="8 FARMS · 1 WIRE" col={AMB} size={42} />}>{(tt) => {
  const ringOn = RINGS.reduce((m, [a, b]) => Math.max(m, tt > a && tt < b ? 1 : 0), 0), lit = Math.max(0.15 + 0.85 * ringOn, 1.4 * cl((tt - 3.3) / 0.6));
  const wire = FARMS.map(([x, , z]) => [x, 0.42, z - 0.14]);
  const ph = RINGS.reduce((m, [a, b]) => tt > a && tt < b ? (tt - a) / (b - a) : m, -1), pulse = ph * (FARMS.length - 1), pi = Math.max(0, Math.floor(pulse)), pf = pulse - pi;
  const pa = wire[Math.min(pi, wire.length - 1)], pb = wire[Math.min(pi + 1, wire.length - 1)];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial map={furrows()} roughness={1} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, -0.62]}><planeGeometry args={[6, 0.09]} /><meshStandardMaterial color="#9d917a" roughness={0.95} /></mesh>
    {/* la luna */}
    <mesh position={[1.4, 1.5, -2.6]}><circleGeometry args={[0.12, 40]} />{M.glow({ col: "#f6efd8", op: 0.95 })}</mesh>
    {FARMS.map((p, i) => <group key={i}>
      <House p={p} ry={0.2 * (rn(i, 2) - 0.5)} s={1.25} lit={lit * (0.85 + 0.15 * rn(i, 5))} />
      <RBox s={[0.016, 0.44, 0.016]} r={0.004} p={[p[0], 0.22, p[2] - 0.14]}><meshStandardMaterial color="#5a4532" roughness={0.9} /></RBox>
      <RBox s={[0.08, 0.01, 0.01]} r={0.003} p={[p[0], 0.425, p[2] - 0.14]}><meshStandardMaterial color="#5a4532" roughness={0.9} /></RBox>
    </group>)}
    <mesh geometry={tubeG("pline2", wire, 0.006, 200, 8)}><meshStandardMaterial color="#111" roughness={0.5} emissive="#ffb54a" emissiveIntensity={1.2 * ringOn} /></mesh>
    {/* el timbre viaja por el cable: dos largos y uno corto */}
    <mesh visible={ph >= 0} position={[lerp(pa[0], pb[0], pf), 0.42, lerp(pa[2], pb[2], pf)]}><sphereGeometry args={[0.05, 16, 12]} />{M.glow({ col: "#ffd27a", op: 0.95 })}</mesh>
    <mesh visible={ph >= 0} position={[lerp(pa[0], pb[0], pf), 0.42, lerp(pa[2], pb[2], pf)]}><sphereGeometry args={[0.12, 16, 12]} />{M.glow({ col: "#ffb54a", op: 0.25 })}</mesh>
    <pointLight position={[0, 0.6, 0]} intensity={1.2 * lit} distance={3} color="#ffc070" />
    {/* el teléfono de pared en primer plano, sonando */}
    <group position={[-0.42, 0.3, 0.62]} rotation={[0, 0.45, 0]} scale={0.95}><WallPhone ring={ringOn ? tt : 0} off={0} /></group>
  </>;
}}</Scene3D>;

// ---- 3:57 · LA TORTA SÍ, EL VENENO NO: la coffee cake llega con un frasquito de veneno que gotea encima; al cortar, el veneno se vuelve luz y la porción se sirve ----
export const HCoffeecake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.85} key1={[-1.2, 2.0, 0.6]}
  cam={{ at: [0.05, 0.86, 0.03], at1: [0.1, 0.84, 0.05], az: [0.45, 0.25], el: [0.45, 0.4], r: [1.35, 1.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={1010} txt="THE CAKE, NOT THE POISON" col={AMB} size={40} />}>{(tt) => {
  const slide = eio(tt, 0.0, 0.9), cut = eio(tt, 1.9, 2.6), lift = eio(tt, 2.7, 3.6), bottle = eio(tt, 0.7, 1.1) * (1 - eio(tt, 2.4, 2.9));
  const crumb = tex.text("crumb2", 256, 256, (g) => { g.fillStyle = "#c08a4e"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${130 + 90 * rn(i, 1)},${80 + 60 * rn(i, 2)},34,.85)`; g.beginPath(); g.arc(rn(i, 3) * 256, rn(i, 4) * 256, 2 + 6 * rn(i, 5), 0, 6.3); g.fill(); } });
  const lbl = tex.text("poisonlbl", 128, 128, (g) => { g.fillStyle = "#e9e1cc"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#3a1410"; g.font = "900 34px Georgia"; g.textAlign = "center"; g.fillText("XX", 64, 80); });
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.4} d={0.9} /></group>
    <group position={[lerp(-0.6, -0.1, slide), 0.76, -0.04]}>
      <RBox s={[0.34, 0.03, 0.34]} r={0.012} p={[0, 0.015, 0]}>{M.glass({ op: 0.4, col: "#e2efe9" })}</RBox>
      <mesh position={[-0.04, 0.055, 0]} castShadow><boxGeometry args={[0.22, 0.06, 0.3]} /><meshStandardMaterial map={crumb} roughness={0.85} /></mesh>
      <mesh position={[0.11, 0.055, -0.075]} castShadow><boxGeometry args={[0.08, 0.06, 0.15]} /><meshStandardMaterial map={crumb} roughness={0.85} /></mesh>
      {/* la porción que sale al plato */}
      <group position={[lerp(0.11, 0.42, lift), 0.055 + 0.1 * Math.sin(PI * lift) - 0.035 * lift, lerp(0.075, 0.2, lift)]} rotation={[0, 0.3 * lift, 0]}><mesh castShadow><boxGeometry args={[0.08, 0.06, 0.15]} /><meshStandardMaterial map={crumb} roughness={0.85} /></mesh></group>
      {/* manchas del veneno sobre la torta: se apagan en luz cuando corta el cuchillo */}
      {[0, 1, 2].map((i) => { const on = cl((tt - 1.2 - i * 0.25) / 0.2), gone = eio(tt, 2.3, 2.9), k = on * (1 - gone); return <mesh key={i} visible={k > 0.02} position={[-0.06 + i * 0.05, 0.0865 + i * 0.0005, -0.03 + 0.03 * i]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.02, k)}><circleGeometry args={[0.022, 24]} /><meshStandardMaterial color="#2a0f1c" roughness={0.1} /></mesh>; })}
      {Array.from({ length: 16 }, (_, i) => { const u = tt - 2.4 - rn(i, 3) * 0.3; if (u < 0 || u > 1.0) return null; return <mesh key={"s" + i} position={[-0.05 + 0.12 * rn(i, 4), 0.09 + 0.25 * u, -0.05 + 0.1 * rn(i, 5)]}><sphereGeometry args={[0.006, 8, 6]} />{M.glow({ col: "#ffe2a0", op: 0.9 * (1 - u) })}</mesh>; })}
      {/* el cuchillo de torta con mango de madera */}
      <group visible={tt > 1.7 && tt < 3.0} position={[0.07, 0.11 - 0.05 * Math.sin(PI * cut), lerp(-0.2, 0.2, cut)]} rotation={[0, PI / 2, 0]}>
        <RBox s={[0.17, 0.035, 0.003]} r={0.001} p={[0, 0, 0]}>{M.steel()}</RBox>
        <RBox s={[0.11, 0.024, 0.02]} r={0.008} p={[-0.14, 0.004, 0]}>{M.wood({ base: [110, 66, 34] })}</RBox>
      </group>
    </group>
    {/* el frasquito oscuro del chisme, que gotea y se va */}
    <group position={[-0.1, 0.94 + 0.3 * (1 - bottle), -0.06]} rotation={[0, 0, 2.2 * bottle]} visible={bottle > 0.01}>
      <mesh><cylinderGeometry args={[0.028, 0.028, 0.09, 24]} />{M.glass({ op: 0.75, col: "#3a1426" })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />{M.matte({ col: "#1a1a1a" })}</mesh>
      <mesh position={[0, 0, 0.029]}><planeGeometry args={[0.04, 0.04]} /><meshStandardMaterial map={lbl} roughness={0.8} /></mesh>
    </group>
    {/* las gotas oscuras que caen del frasco a la torta */}
    {Array.from({ length: 6 }, (_, i) => { const u = (tt - 1.1 - i * 0.18) / 0.35; if (u < 0 || u > 1 || tt > 2.4) return null; return <mesh key={"d" + i} position={[-0.14 + 0.03 * (i % 3), lerp(0.9, 0.85, u), -0.04 + 0.02 * (i % 2)]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color="#2a0f1c" roughness={0.1} /></mesh>; })}
    <Plate p={[0.32, 0.76, 0.16]} r={0.12} />
    <Mug p={[-0.38, 0.76, 0.26]} />
  </>;
}}</Scene3D>;

// ---- 4:31 · SÓLO CUANDO SE ROMPE: pasan los meses en el almanaque sin nadie en el camino; recién cuando humea el capó, llega la camioneta ----
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST"];
export const HLyletruck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2b3550" warm={0.95}
  cam={{ at: [0.0, 0.25, 0], at1: [0.25, 0.2, 0.05], az: [0.45, 0.6], el: [0.3, 0.24], r: [2.0, 1.75], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="ONLY WHEN IT BREAKS" col={AMB} size={40} />}>{(tt) => {
  const drive = eio(tt, 2.6, 4.0), arrived = tt > 4.0, m = Math.min(MONTHS.length - 1, Math.floor(tt / 0.32));
  return <>
    <Sky />
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 6]} /><meshStandardMaterial map={furrows()} color="#c8b48a" roughness={0.95} /></mesh>
    {/* el alambrado y los postes del campo */}
    {Array.from({ length: 9 }, (_, i) => <RBox key={"fp" + i} s={[0.025, 0.22, 0.025]} r={0.004} p={[-1.6 + i * 0.4, 0.11, -0.9]}>{M.wood({ base: [96, 72, 48] })}</RBox>)}
    <mesh position={[0, 0.17, -0.9]}><boxGeometry args={[3.3, 0.006, 0.006]} /><meshStandardMaterial color="#3a3530" roughness={0.6} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0.15]}><planeGeometry args={[4, 0.42]} /><meshStandardMaterial map={tex.counter(8, 1)} color="#c2b59a" roughness={0.95} /></mesh>
    {/* los escalones del porche de la granja */}
    <group position={[0.7, 0, -0.35]}>
      {[0, 1, 2].map((i) => <RBox key={i} s={[0.6, 0.06, 0.12]} r={0.006} p={[0, 0.03 + i * 0.06, 0.12 - i * 0.1]}>{M.wood({ base: [150, 140, 126] })}</RBox>)}
      <group position={[0, 0.18, -0.3]} scale={0.6}><Porch w={1.4} d={0.6} yard={false} /></group>
    </group>
    {/* el almanaque de la cocina pasa las hojas: meses vacíos */}
    <group position={[-0.55, 0.42, -0.5]}>
      <RBox s={[0.34, 0.42, 0.02]} r={0.006}>{M.matte({ col: "#f3efe3" })}</RBox>
      <mesh position={[0, 0, 0.0115]}><planeGeometry args={[0.32, 0.4]} /><meshStandardMaterial map={paperTex("cal" + m, [MONTHS[m], "· · · · · · ·", "· · · · · · ·", "· · · · · · ·"], { w: 320, h: 400, ink: "#7a2a22", font: "900" })} roughness={0.8} /></mesh>
      {tt < 2.6 && <group position={[0, 0.2, 0.013]} rotation={[-PI * cl(((tt % 0.32) / 0.32) * 1.4), 0, 0]}><mesh position={[0, -0.2, 0]}><planeGeometry args={[0.32, 0.4]} /><meshStandardMaterial map={paperTex("calf" + m, [MONTHS[m]], { w: 320, h: 400, ink: "#7a2a22", font: "900" })} side={THREE.DoubleSide} roughness={0.8} /></mesh></group>}
    </group>
    <Pickup p={[lerp(-2.3, 0.15, drive), 0.0 + (drive < 1 ? 0.006 * Math.abs(Math.sin(tt * 18)) : 0), 0.15]} col="#56708a" wheel={-drive * 30} hood={arrived ? eio(tt, 4.1, 4.6) : 0} />
    {/* humo oscuro del motor roto */}
    {Array.from({ length: 22 }, (_, i) => { const ph = ((tt - 4.1) * 0.5 + rn(i, 2)) % 1, dk = 1; return <mesh key={i} visible={arrived} position={[0.45 + 0.06 * (rn(i, 3) - 0.5) + 0.08 * ph, 0.26 + 0.5 * ph, 0.15 + 0.06 * (rn(i, 4) - 0.5)]} scale={0.03 + 0.07 * ph}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#24201c" roughness={1} transparent opacity={0.75 * dk * Math.sin(PI * ph) * cl((tt - 4.1) / 0.4)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:53 · VEINTE, NO CINCUENTA: de la lata de café sale el de 20 y cruza la mesa hasta el sombrero de Lyle; el de 50 asoma y vuelve a la lata ----
export const HTwentybill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0.04, 0.84, 0.05], at1: [0.06, 0.83, 0.06], az: [-0.12, 0.05], el: [0.5, 0.45], r: [1.3, 1.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="$20, NOT $50" col={AMB} size={44} />}>{(tt) => {
  const up50 = eio(tt, 0.4, 1.1) * (1 - eio(tt, 1.8, 2.4)), up20 = eio(tt, 1.9, 2.5), slide20 = eio(tt, 2.6, 3.8), drop = eio(tt, 3.8, 4.2);
  const can = tex.text("cancan", 512, 128, (g) => { g.fillStyle = "#b8352b"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#f2d58a"; g.font = "900 54px Georgia"; g.textAlign = "center"; g.fillText("COFFEE", 256, 82); g.fillRect(0, 10, 512, 6); g.fillRect(0, 112, 512, 6); });
  const hx = 0.36, hz = 0.16;
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.4} d={1.0} /></group>
    {/* la lata de café donde Ruth guardaba la plata */}
    <group position={[-0.28, 0.76, -0.06]}>
      <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.14, 40, 1, true]} /><meshStandardMaterial map={can} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.07, 0.07, 0.004, 40]} />{M.steel()}</mesh>
      <mesh position={[0, 0.14, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.003, 8, 40]} />{M.steel()}</mesh>
      {/* el de 50 (anaranjado) asoma y se vuelve a meter */}
      <Bill v="$50" p={[-0.015, 0.08 + 0.2 * up50, 0.0]} rot={[0, 0.3, PI / 2]} s={1.9} tint="#f0c48a" />
    </group>
    {/* el de 20 sube, se acuesta en el aire, cruza la mesa y cae en el sombrero */}
    <group position={[lerp(-0.28, hx, slide20), 0.76 + lerp(0.08 + 0.15 * up20, 0.06 - 0.03 * drop, slide20) + 0.1 * Math.sin(PI * slide20), lerp(-0.06, hz, slide20)]}
      rotation={[lerp(0, -PI / 2, slide20), 0.3 * (1 - slide20) + 0.4 * slide20, lerp(PI / 2, 0, slide20)]}><Bill v="$20" rot={[0, 0, 0]} s={2.3} /></group>
    {/* el sombrero de fieltro de Lyle, boca arriba */}
    <group position={[hx, 0.76, hz]}>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.15, 0.15, 0.014, 40]} /><meshStandardMaterial color="#6f5638" roughness={0.9} /></mesh>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.09, 0.085, 0.06, 32, 1, true]} /><meshStandardMaterial color="#6f5638" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.092, 0.092, 0.016, 32, 1, true]} /><meshStandardMaterial color="#3a2a1a" roughness={0.7} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* la estela del recorrido del 20, de la lata al sombrero */}
    {Array.from({ length: 14 }, (_, i) => { const u = i / 13; return <mesh key={"tr" + i} visible={slide20 > u} position={[lerp(-0.28, hx, u), 0.76 + 0.09 + 0.1 * Math.sin(PI * u), lerp(-0.06, hz, u)]}><sphereGeometry args={[0.013, 10, 8]} />{M.glow({ col: "#ffd27a", op: 0.9 })}</mesh>; })}
    <Mug p={[-0.05, 0.76, -0.3]} col="#d9cfb8" />
  </>;
}}</Scene3D>;
