// apa30b · componentes únicos, minutos 14-26 (conocerlos, cerrarles la puerta, el plan de los días y el repaso).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Rodent, Sign, Jug, barnT, grassT } from "./farmkit";
import { TBucket, SodaCan, Ramp, MicePile, Droppings, FeedSack, MetalCan, Owl, RIM, BR } from "./bkit";

const PI = Math.PI;
const Ring: React.FC<{ p: number[]; r: number; op: number; col?: string }> = ({ p, r, op, col = "#ffcf7a" }) =>
  <mesh position={p as [number, number, number]}><torusGeometry args={[r, r * 0.08, 8, 40]} />{M.glow({ col, op })}</mesh>;

// ---- 14:49 · EL RATÓN DE CASA: gira en el plato; se marcan la oreja mediana y el ojo chico; gris parejo, sin panza blanca ----
export const HHouseMouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#121315" key1={[-0.6, 1.3, 1.2]}
  cam={{ at: [0, 0.05, 0], az: [0.9, 0.5], el: [0.25, 0.18], r: [0.48, 0.4], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="HOUSE MOUSE · SMALL EYES · GRAY ALL OVER" col={TX} />}>{(tt) => <>
  <mesh position={[0, -0.005, 0]}><cylinderGeometry args={[0.16, 0.16, 0.01, 48]} />{M.porcelain({ col: "#d9d4ca" })}</mesh>
  <Rodent s={1.6} rot={[0, 0.4 * Math.sin(tt * 0.6), 0]} walk={tt * 0.2} />
</>}</Scene3D>;

// ---- 15:12 · MOJADO EN LECHE: el ratón de campo baja despacio a un plato de leche y la panza y las patas le quedan blancas, con línea marcada ----
export const HDeerMouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#141210" key1={[-0.6, 1.3, 1.2]}
  cam={{ at: [0, 0.06, 0], az: [-0.8, -0.45], el: [0.22, 0.16], r: [0.5, 0.42], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="DEER MOUSE · BIG EYES · WHITE BELLY AND FEET" col={AMB} />}>{(tt) => {
  const dip = eio(tt, 0.4, 1.4) * (1 - eio(tt, 1.8, 2.6)), white = eio(tt, 1.2, 1.8);
  return <>
    <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.15, 0.13, 0.03, 48]} />{M.porcelain({ col: "#6a8aa8" })}</mesh>
    <mesh position={[0, 0.012 + 0.01 * dip, 0]}><cylinderGeometry args={[0.135, 0.135, 0.004, 48]} />{M.porcelain({ col: "#fbf8f0" })}</mesh>
    <group position={[0, 0.016 - 0.006 * dip, 0]}><Rodent s={1.5} deer={white > 0.5} rot={[0, 0.5, 0]} walk={tt * 0.2} /></group>
  </>;
}}</Scene3D>;

// ---- 16:18 · 31 MÁS PARA LA PRIMAVERA: una pareja; cada pocas semanas una camada nueva aparece al lado y la fila crece mes a mes ----
export const HBreedMath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#100e0b" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0, 0], az: [0.1, -0.1], el: [0.95, 0.8], r: [1.5, 1.25], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="DO NOTHING ELSE = 31 MORE BY SPRING" col={RED} />}>{(tt) => {
  const n = Math.round(2 + 29 * eio(tt, 0.6, 3.8));
  return <>
    {["OCT", "NOV", "DEC", "JAN", "FEB", "MAR"].map((m, i) => <group key={m}>
      <Sign id={"bm" + m} txt={m} p={[-0.6 + i * 0.24, 0.006, -0.42]} rot={[-PI / 2, 0, 0]} w={0.16} h={0.07} />
      {tt > 0.6 + i * 0.55 && <mesh position={[-0.6 + i * 0.24, 0.004, -0.36]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.006]} />{M.glow({ col: "#ffb35a", op: 0.7 })}</mesh>}
    </group>)}
    {Array.from({ length: n }, (_, i) => <Rodent key={i} p={[-0.62 + (i % 8) * 0.17, 0, -0.22 + Math.floor(i / 8) * 0.17]} rot={[0, PI + 0.3 * Math.sin(i * 2.3), 0]} s={0.55}
      walk={tt * 0.4 + i} />)}
  </>;
}}</Scene3D>;

// ---- 17:11 · LA LECHUZA DE LAS VIGAS: arriba en la viga, con las marcas de todo lo que cazó; abajo el veneno queda en el estante ----
export const HOwlRafters: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" bg="#0d0b09" key1={[-0.8, 1.8, 1]}
  cam={{ at: [0, 0.5, 0], az: [-0.35, 0.2], el: [0.12, 0.08], r: [1.45, 1.25], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="THAT OWL ATE MORE MICE THAN ANY TRAP" col={AMB} />}>{(tt) => <>
  <RBox s={[1.6, 0.1, 0.12]} p={[0, 0.38, 0]} r={0.01}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
  <Owl p={[0.1, 0.43, 0]} rot={[0, -0.3 + 0.25 * Math.sin(tt * 0.7), 0]} s={1.15} blink={Math.max(0, Math.sin(tt * 2.2) > 0.96 ? 1 : 0)} />
  {Array.from({ length: 24 }, (_, i) => cl((tt - 0.5) * 7 - i) > 0 && <mesh key={i} position={[-0.68 + (i % 5) * 0.025 + Math.floor(i / 5) * 0.13, 0.38, 0.061]} rotation={[0, 0, i % 5 === 4 ? 1.1 : 0]}>
    <planeGeometry args={[0.004, i % 5 === 4 ? 0.1 : 0.06]} /><meshBasicMaterial color="#f1e6cc" /></mesh>)}
  <pointLight position={[0.4, 0.9, 0.6]} intensity={1.4} distance={2} color="#c8d4ff" />
</>}</Scene3D>;

// ---- 18:20 · SI VES LUZ, PASA: la franja de luz por debajo de la puerta, el ratón se aplasta y pasa; el burlete baja y la luz desaparece ----
export const HDoorGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0a0907" warm={0.3} key1={[-0.6, 1.0, 1]}
  cam={{ at: [0, 0.05, 0], az: [0.3, 0.15], el: [0.14, 0.1], r: [0.75, 0.62], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="DAYLIGHT UNDER A DOOR? PUT A SWEEP ON" col={TX} />}>{(tt) => {
  const sq = eio(tt, 0.4, 1.4), sw = eio(tt, 2.0, 2.8), x = 0.3 - 0.26 * sq;
  return <>
    <RBox s={[0.9, 0.7, 0.04]} p={[0, 0.375, -0.02]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <mesh position={[0, 0.0125, -0.045]}><planeGeometry args={[0.9, 0.025]} />{M.glow({ col: "#fff0c8", op: 1 - sw })}</mesh>
    <pointLight position={[0, 0.012, -0.1]} intensity={2.2 * (1 - sw)} distance={0.7} color="#fff0c8" />
    <Rodent p={[0.05, 0, x + 0.12 * sw]} rot={[0, PI * (1 - sw), 0]} s={0.8} walk={tt * 2} />
    <RBox s={[0.9, 0.02 * sw + 0.001, 0.012]} p={[0, 0.025 - 0.0125 * sw, 0.006]} r={0.002}><meshStandardMaterial color="#2a2a2a" roughness={0.7} /></RBox>
  </>;
}}</Scene3D>;

// ---- 18:42 · LANA DE ACERO, Y MEJOR COBRE: el agujero en la tabla se llena de lana de acero bien apretada; después se cambia por malla de cobre ----
export const HSteelWool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#12100d" key1={[-0.5, 1.2, 1.2]}
  cam={{ at: [0, 0.2, 0], az: [0.4, -0.2], el: [0.12, 0.08], r: [0.5, 0.42], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={930} txt={tt < 2.2 ? "STEEL WOOL · PACKED TIGHT" : "COPPER MESH DOES NOT RUST"} col={tt < 2.2 ? TX : AMB} />}>{(tt) => {
  const f = eio(tt, 0.3, 1.4), cu = eio(tt, 2.0, 2.6);
  const col = new THREE.Color("#b8bec4").lerp(new THREE.Color("#c87a3a"), cu).getStyle();
  return <>
    <RBox s={[0.6, 0.4, 0.04]} p={[0, 0.2, -0.02]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <mesh position={[0, 0.18, 0.001]}><circleGeometry args={[0.04, 24]} /><meshBasicMaterial color="#050403" /></mesh>
    {Array.from({ length: 28 }, (_, i) => <mesh key={i} position={[0.03 * Math.cos(i * 2.4) * f, 0.18 + 0.03 * Math.sin(i * 1.7) * f, 0.004 + 0.012 * (1 - f) + 0.004 * rn(i, 1)]} rotation={[rn(i, 2) * PI, rn(i, 3) * PI, 0]} scale={f}>
      <torusGeometry args={[0.016 + 0.01 * rn(i, 4), 0.0012, 4, 20]} /><meshStandardMaterial color={col} metalness={0.9} roughness={0.35} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 19:02 · SIN ALMUERZO GRATIS: la bolsa mordida en el piso se reemplaza por la lata galvanizada con tapa; el ratón olfatea y se va ----
export const HMetalCans: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0.05, 0.3, 0], az: [0.45, 0.25], el: [0.3, 0.22], r: [1.4, 1.2], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="FEED IN A METAL CAN · TIGHT LID" col={GRN} />}>{(tt) => {
  const sw = eio(tt, 1.0, 1.8), lid = eio(tt, 1.9, 2.5), go = eio(tt, 2.8, 3.8);
  return <>
    {sw < 1 && <group scale={1 - sw}><FeedSack bite={1} /></group>}
    {sw > 0 && <group scale={sw}><MetalCan lid={lid} /></group>}
    <Rodent p={[0.25 + 0.3 * go, 0, 0.18]} rot={[0, -PI / 2 + PI * go, 0]} s={0.75} walk={tt * (go > 0 ? 1.5 : 0.3)} />
  </>;
}}</Scene3D>;

// ---- 19:24 · LIMPIAR LAS PAREDES: los cajones y bolsas apoyados en la pared se corren y aparece la línea de bosta a lo largo ----
export const HClutter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.08, -0.35], az: [0.25, -0.2], el: [0.75, 0.62], r: [1.7, 1.45], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="CLEAR THE WALLS · SEE THE PATH" col={TX} />}>{(tt) => <>
  <Droppings n={60} c={[0, 0, -0.62]} spread={[1.1, 0.05]} />
  {[-0.45, -0.15, 0.15, 0.45].map((x, i) => { const m = eio(tt, 0.4 + i * 0.4, 1.2 + i * 0.4); return <group key={i} position={[x + 0.1 * m * Math.sign(x || 1), 0, -0.6 + 0.55 * m]}>
    <RBox s={[0.24, 0.2 + 0.06 * (i % 2), 0.18]} p={[0, 0.11, 0]} r={0.01}><meshStandardMaterial map={barnT()} color={i % 2 ? "#c8a878" : "#ffffff"} roughness={0.95} /></RBox>
  </group>; })}
  <Rodent p={[lerp(-0.62, 0.62, cl((tt - 1.6) / 2.4)), 0, -0.62]} rot={[0, PI / 2, 0]} s={0.9} walk={tt * 2} />
</>}</Scene3D>;

// ---- 19:48 · EL PIZARRÓN DE LA PUERTA: cuatro columnas que se escriben de a una: día uno, dos, tres, y la noche de sacar la cinta ----
export const HChalkDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0e0c0a" key1={[-0.8, 1.4, 1.4]}
  cam={{ at: [0, 0.3, 0], az: [-0.15, 0.12], el: [0.05, 0.04], r: [1.5, 1.32], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={950} txt="BUILD · SEAL · PRE-BAIT · SET" col={AMB} />}>{(tt) => <>
  <RBox s={[1.2, 0.6, 0.02]} p={[0, 0.3, -0.02]} r={0.006}><meshStandardMaterial color="#1f2a24" roughness={0.95} /></RBox>
  {[["DAY 1", "build"], ["DAY 2", "seal gaps"], ["DAY 3", "pre-bait"], ["NIGHT 4", "set"]].map(([a, b], i) =>
    <group key={i} position={[-0.45 + i * 0.3, 0.32, 0.002]} scale={cl(phys(tt, 0.4 + i * 0.6, 7, 0.5))}>
      <Sign id={"cd2" + i} txt={a} sub={b} w={0.26} h={0.18} col="#24302a" ink="#f1ece0" />
    </group>)}
</>}</Scene3D>;

// ---- 20:52 · LAMIDA LIMPIA: amanece sobre la lata; la banda de manteca se fue achicando hasta brillar el aluminio pelado ----
export const HLickedClean: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16110a" key1={[-0.5, 1.0, 1.2]}
  cam={{ at: [0, RIM - 0.03, 0], az: [0.5, 0.25], el: [0.28, 0.2], r: [0.5, 0.42], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={930} txt="LICKED CLEAN = TONIGHT IS THE NIGHT" col={GRN} />}>{(tt) => {
  const l = eio(tt, 0.3, 2.2), sun = eio(tt, 1.6, 3.0);
  return <>
    <TBucket /><SodaCan pb={1} licked={l} tape={1} />
    <pointLight position={[-0.4, RIM + 0.15, 0.3]} intensity={0.4 + 2.2 * sun} distance={1.2} color="#ffd9a0" />
  </>;
}}</Scene3D>;

// ---- 22:11 · CUANDO CORTAN EL CAMPO: las hileras de pasto alto caen bajo la cortadora y la fila de ratones cruza hacia el granero ----
export const HFallFields: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f120c" key1={[-1.4, 2.2, 1]}
  cam={{ at: [0.2, 0.05, 0], az: [-0.5, -0.25], el: [0.65, 0.52], r: [1.7, 1.45], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="FIELDS CUT · THEY ALL MOVE INSIDE" col={AMB} />}>{(tt) => {
  const cut = eio(tt, 0.3, 2.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial map={grassT()} color="#c8b070" roughness={0.95} /></mesh>
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 10 }, (_, c) => { const x = -0.9 + c * 0.13, z = -0.4 + r * 0.16, down = cl(cut * 12 - c * 1.0); return <mesh key={r * 10 + c}
      position={[x, 0.08 * (1 - 0.85 * down), z]} scale={[1, 1 - 0.85 * down, 1]}><boxGeometry args={[0.1, 0.16, 0.05]} /><meshStandardMaterial color={new THREE.Color("#c9ad52").lerp(new THREE.Color("#a68a44"), down).getStyle()} roughness={1} /></mesh>; }))}
    <group position={[0.75, 0, 0]}><RBox s={[0.42, 0.34, 0.5]} p={[0, 0.17, 0]} r={0.01}><meshStandardMaterial color="#8a2e22" roughness={0.9} /></RBox>
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.32, 0.32, 0.52]} /><meshStandardMaterial color="#5a1e16" roughness={0.9} /></mesh>
      <mesh position={[-0.211, 0.07, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.12, 0.14]} /><meshStandardMaterial color="#1a0f0a" /></mesh></group>
    {Array.from({ length: 8 }, (_, i) => { const k = cl((tt - 1.4 - i * 0.2) / 1.8); return k > 0 && k < 1 && <Rodent key={i} p={[lerp(-0.3, 0.52, k), 0, lerp(-0.2 + 0.06 * i, 0, k)]} rot={[0, PI / 2, 0]} s={0.6} walk={tt * 2 + i} />; })}
  </>;
}}</Scene3D>;

// ---- 22:31 · LA MEJOR CARNADA: tres frascos en la repisa; la manteca de maní se adelanta; el de avellanas y la grasa quedan para la casa con alergia ----
export const HBaitJars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [-0.3, 0.2], el: [0.3, 0.22], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={150} txt="PEANUT BUTTER · STICKY, HARD TO CARRY OFF" col={AMB} />}>{(tt) => {
  const win = eio(tt, 1.0, 1.8);
  return <>
    {[["#a8692e", "PEANUT"], ["#6a3a1e", "HAZEL"], ["#e8dcc0", "LARD"]].map(([c, n], i) => <group key={i} position={[-0.26 + i * 0.26, 0, i === 0 ? 0.12 * win : 0]} scale={i === 0 ? 1 + 0.15 * win : 1 - 0.1 * win}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.06, 0.06, 0.16, 32]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.065, 0]}><cylinderGeometry args={[0.055, 0.055, 0.12, 32]} /><meshPhysicalMaterial color={c} roughness={0.5} clearcoat={0.3} /></mesh>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.062, 0.062, 0.02, 32]} />{M.steel()}</mesh>
      <Sign id={"bj2" + i} txt={n} p={[0, 0.08, 0.063]} w={0.11} h={0.045} />
    </group>)}
  </>;
}}</Scene3D>;

// ---- 22:54 · CUÁNTO TARDA: el reloj de arena corre tres o cuatro noches de cebado; la cuarta se marca como la grande ----
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#100d0a" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0, 0.18, 0], az: [0.4, 0.15], el: [0.18, 0.12], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="3-4 NIGHTS PRE-BAIT · FIRST SET NIGHT IS THE BIG ONE" col={TX} />}>{(tt) => {
  const s = eio(tt, 0.3, 3.0);
  return <>
    <group position={[-0.15, 0, 0]}>
      {[0.02, 0.32].map((y) => <RBox key={y} s={[0.2, 0.02, 0.2]} p={[0, y, 0]} r={0.006}>{M.wood({ base: [120, 80, 46] })}</RBox>)}
      {[0.24, 0.1].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[i ? 0 : PI, 0, 0]}><coneGeometry args={[0.075, 0.14, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>)}
      <mesh position={[0, 0.27 - 0.04 * s, 0]} rotation={[PI, 0, 0]} scale={[1 - s * 0.85, 1 - s * 0.85, 1 - s * 0.85]}><coneGeometry args={[0.06, 0.08, 32]} /><meshStandardMaterial color="#d8b878" roughness={0.9} /></mesh>
      <mesh position={[0, 0.03 + 0.025 * s, 0]} scale={[s, s, s]}><coneGeometry args={[0.065, 0.06, 32]} /><meshStandardMaterial color="#d8b878" roughness={0.9} /></mesh>
    </group>
    {[0, 1, 2, 3].map((i) => <group key={i} position={[0.12 + i * 0.09, 0.03, 0]} scale={cl(s * 4 - i)}>
      <mesh><sphereGeometry args={[0.025, 20, 14]} />{i === 3 ? M.glow({ col: "#ffcf7a" }) : <meshStandardMaterial color="#cfd6e8" roughness={0.6} />}</mesh>
    </group>)}
  </>;
}}</Scene3D>;

// ---- 24:00 · TODO EN UN MINUTO: vista despiezada; las piezas llegan en orden y encastran: balde, alambre, lata, manteca, rampa, cama ----
export const HOneMin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0.1, 0.22, 0], az: [0.8, 0.3], el: [0.4, 0.3], r: [1.15, 0.95], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={150} txt="SAVE THIS ONE" col={AMB} />}>{(tt) => {
  const st = (i: number) => cl(phys(tt, 0.3 + i * 0.45, 7, 0.5));
  return <>
    <group position={[0, (1 - st(0)) * 0.4, 0]}><TBucket op={0.4} /></group>
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.2, 0.012 + (1 - st(5)) * 0.4, (rn(i, 3) - 0.5) * 0.2]} rotation={[0, rn(i, 4) * PI, PI / 2]}><boxGeometry args={[0.022, 0.002, 0.008]} /><meshStandardMaterial color="#e0c690" /></mesh>)}
    <group position={[0, (1 - st(1)) * 0.3, (1 - st(2)) * 0.3]}><SodaCan pb={st(3)} spin={tt * 0.2} wire={st(1) > 0.5} /></group>
  </>;
}}</Scene3D>;

// ---- 25:09 · SI ENTRA UN LÁPIZ, ENTRA UN RATÓN: el lápiz se mete en la rendija de la tabla y detrás pasa el ratón aplastándose ----
export const HPencil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#110f0c" key1={[-0.6, 1.2, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [0.55, 0.3], el: [0.15, 0.1], r: [0.55, 0.46], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="A PENCIL FITS = A MOUSE FITS" col={RED} />}>{(tt) => {
  const p = eio(tt, 0.3, 1.2) * (1 - eio(tt, 1.5, 2.0)), m = eio(tt, 2.0, 3.4);
  return <>
    <RBox s={[0.5, 0.3, 0.04]} p={[0, 0.15, -0.02]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <mesh position={[0, 0.12, 0.001]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#050403" /></mesh>
    {tt < 1.95 && <group position={[0, 0.12, 0.2 - 0.18 * p]} rotation={[PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.0075, 0.0075, 0.18, 6]} /><meshStandardMaterial color="#e8b828" roughness={0.6} /></mesh>
      <mesh position={[0, -0.1, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.0075, 0.02, 6]} /><meshStandardMaterial color="#e8d0a0" /></mesh>
    </group>}
    {m > 0 && m < 1 && <group position={[0, 0.12 - 0.03, 0.12 - 0.18 * m]} scale={[1 - 0.5 * Math.sin(m * PI), 1 - 0.55 * Math.sin(m * PI), 1]}><Rodent rot={[0, PI, 0]} s={0.7} walk={tt * 2} /></group>}
  </>;
}}</Scene3D>;
