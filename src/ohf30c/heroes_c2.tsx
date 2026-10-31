// ohf30c · componentes únicos 7-14 (las partes y los cuatro burletes): la ventana que se despiece, el corte de la jamba visto
// desde arriba, el contrapeso en su bolsillo, los tres movimientos, la V que se abre, bronce contra vinilo, la felpa y el bulbo.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Puffs, Shock, Tape } from "./okit";
import { Bulb, FR, OH, OW, OldWin, Pile, VStrip , RoomBack } from "./winkit";
import { Bokeh, Hand, Say, Stream, wpMat } from "./rkit";

const PI = Math.PI;
type V3 = [number, number, number];
const wood = (c = "#ece5d6") => <meshStandardMaterial color={c} roughness={0.55} />;
const glowBox = (s: V3, p: V3, k: number, col = "#ffb13a") => k > 0.01 ? <mesh position={p}><boxGeometry args={s} />{M.glow({ col, op: 0.85 * k })}</mesh> : null;

// ---- 4:30 · LA GUILLOTINA DESPIEZADA: las dos hojas se separan del marco; se encienden el riel de encuentro y las jambas ----
export const HAnatomy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.8, 1.8, 1.6]}
  cam={{ at: [0, 0.44, 0.05], az: [0.35, 0.6], el: [0.14, 0.22], r: [1.75, 1.5], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.8} b={2.7} txt="TWO SASHES" /><Say tt={tt} a={2.95} b={4.05} txt="THE MEETING RAIL" col="#b3561e" /><Say tt={tt} a={4.15} txt="THE JAMBS: THEIR CHANNELS" col="#1f4f8a" /></>}>{(tt) => {
  const ex = eio(tt, 0.4, 1.6), rail = eio(tt, 2.9, 3.4) * (1 - eio(tt, 4.0, 4.3)), jamb = eio(tt, 4.2, 4.7);
  return <>
    <RoomBack p={[0, 0.1, -0.5]} wx={-0.5} mat={<meshStandardMaterial map={wpMat("#6b5a3a", "#76643f", "#e9d6a0", 6, 5)} roughness={0.9} />} />
    <OldWin p={[0, 0, 0]} ex={ex} />
    {glowBox([OW - 0.02, 0.012, 0.03], [0, OH / 2 + 0.03 - ex * 0.03, 0.04 + ex * 0.2], rail)}
    {glowBox([OW - 0.02, 0.012, 0.03], [0, OH / 2 - 0.01 + ex * 0.06, -0.04 - ex * 0.16], rail)}
    {[-1, 1].map((k) => <React.Fragment key={k}>{glowBox([0.008, OH, 0.11], [k * (OW / 2 + FR + 0.002), OH / 2, 0], jamb, "#7cc4ff")}</React.Fragment>)}
  </>;
}}</Scene3D>;

// ---- 4:58 · LAS PIEZAS CHICAS: el marco acostado en el banco del taller; cada pieza que se nombra se levanta del marco
//      (vista explotada) y brilla: listón separador, junquillo, antepecho y cabezal ----
const BS = { jx: 0.3, L: 0.9, d: 0.12 };
const BenchFrame: React.FC<{ up: number[]; lit: number[] }> = ({ up, lit }) => {
  const pm = (c: string, k: number, e = "#ffb13a") => <meshPhysicalMaterial color={c} roughness={0.5} clearcoat={0.3} emissive={e} emissiveIntensity={0.8 * k} />;
  const Y = (i: number) => 0.13 * up[i];
  return <group>
    {/* jambas (acostadas): profundidad en Y, largo en Z */}
    {[-1, 1].map((k) => <RBox key={k} s={[0.04, BS.d, BS.L]} p={[k * (BS.jx + 0.02), BS.d / 2, 0]} r={0.004}>{pm("#e2dac9", 0)}</RBox>)}
    {/* tope exterior (blind stop) abajo */}
    {[-1, 1].map((k) => <RBox key={"bl" + k} s={[0.016, 0.02, BS.L - 0.02]} p={[k * (BS.jx - 0.008), 0.01, 0]} r={0.002}>{pm("#d8cfbc", 0)}</RBox>)}
    {/* 0 · listón separador: al medio de la jamba */}
    {[-1, 1].map((k) => <RBox key={"pb" + k} s={[0.014, 0.014, BS.L - 0.04]} p={[k * (BS.jx - 0.007), BS.d / 2 + Y(0), 0]} r={0.002}>{pm("#d9cfba", lit[0])}</RBox>)}
    {/* 1 · junquillo: arriba (lado del cuarto) */}
    {[-1, 1].map((k) => <RBox key={"st" + k} s={[0.018, 0.022, BS.L - 0.04]} p={[k * (BS.jx - 0.009), BS.d - 0.011 + Y(1), 0]} r={0.003}>{pm("#efe8da", lit[1], "#3fae5a")}</RBox>)}
    {/* 2 · antepecho con su nariz (hacia la cámara) */}
    <group position={[0, Y(2), BS.L / 2 + 0.03]}>
      <RBox s={[2 * BS.jx + 0.2, 0.15, 0.06]} p={[0, 0.06, 0]} r={0.006}>{pm("#ddd3bf", lit[2], "#7cc4ff")}</RBox>
      <RBox s={[2 * BS.jx + 0.26, 0.035, 0.1]} p={[0, 0.135, 0.03]} r={0.008}>{pm("#e6dccb", lit[2], "#7cc4ff")}</RBox>
    </group>
    {/* 3 · cabezal */}
    <RBox s={[2 * BS.jx + 0.08, BS.d, 0.045]} p={[0, BS.d / 2 + Y(3), -BS.L / 2 - 0.02]} r={0.004}>{pm("#e2dac9", lit[3], "#e9a0ff")}</RBox>
  </group>;
};
export const HBeadStop: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const A = [0.5, 1.7, 2.9, 4.1];
  return <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-0.7, 2.0, 0.9]} bg="#1b130d" warm={1.05} lamp={[0.5, 0.7, 0.3]}
    cam={{ at: [0, 0.05, 0.05], at1: [0, 0.08, 0.0], az: [-0.75, -0.2], el: [0.82, 0.62], r: [1.75, 1.45], fov: 34 }}
    over={(tt) => <>{["PARTING BEAD", "STOP", "SILL", "HEAD"].map((w, i) => <Say key={i} tt={tt} a={A[i] + 0.15} b={i < 3 ? A[i + 1] : undefined} txt={w} col={["#b3561e", "#1f6a3a", "#1f4f8a", "#6a2a8a"][i]} size={110} />)}</>}>{(tt) => {
    const up = A.map((a) => phys(tt, a, 6.5, 0.38)), lit = A.map((a, i) => eio(tt, a, a + 0.3) * (i < 3 ? 1 - eio(tt, A[i + 1], A[i + 1] + 0.4) * 0.7 : 1));
    return <>
      <BenchFrame up={up} lit={lit} />
      {/* el banco: lápiz de carpintero, cinta métrica y aserrín */}
      <RBox s={[0.16, 0.012, 0.022]} p={[0.55, 0.006, 0.25]} rot={[0, 0.5, 0]} r={0.003}>{M.plastic({ col: "#d64a2a" })}</RBox>
      <RBox s={[0.08, 0.06, 0.08]} p={[-0.6, 0.03, 0.2]} rot={[0, -0.3, 0]} r={0.015}>{M.plastic({ col: "#f2c21a" })}</RBox>
      {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.4, 0.002, (rn(i, 2) - 0.5) * 1.2]} rotation={[-PI / 2, 0, rn(i, 3) * 3]}><circleGeometry args={[0.004 + 0.006 * rn(i, 4), 5]} /><meshStandardMaterial color="#e3c38e" roughness={1} /></mesh>)}
    </>;
  }}</Scene3D>;
};

// ---- 5:20 · EL CONTRAPESO: de costado, con el bolsillo abierto en el revoque; la hoja sube y baja, el plomo de hierro corre por su cuerda
//      y por el agujero de la roldana entra frío ----
export const HWeights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[1.2, 1.8, 1.0]} bg="#16110d" warm={0.95}
  cam={{ at: [0.25, 0.48, 0.0], at1: [OW / 2 + 0.09, OH - 0.12, -0.02], az: [0.95, 0.6], el: [0.14, 0.04], r: [1.2, 0.5], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.9} b={3.0} txt="AN IRON WEIGHT ON A ROPE" /><Say tt={tt} a={3.2} txt="AND THE POCKET LEAKS TOO" col="#1f4f8a" /></>}>{(tt) => {
  const lo = 0.85 * eio(tt, 0.4, 2.0) - 0.85 * eio(tt, 3.1, 4.3), wy = 0.52 - lo * 0.4, px = OW / 2 + 0.085, cold = eio(tt, 2.6, 3.4);
  return <>
    {/* revoque viejo con el listoneado a la vista alrededor del bolsillo */}
    <RBox s={[0.9, 1.5, 0.03]} p={[px + 0.62, 0.45, -0.02]} r={0.002}><meshStandardMaterial map={wpMat("#7d6e58", "#857560", "#b9a77c", 4, 6)} roughness={0.95} /></RBox>
    <RBox s={[0.9, 1.5, 0.03]} p={[-OW / 2 - FR - 0.45, 0.45, 0.06]} r={0.002}><meshStandardMaterial map={wpMat("#7d6e58", "#857560", "#b9a77c", 4, 6)} roughness={0.95} /></RBox>
    <RBox s={[0.03, 1.5, 0.035]} p={[px + 0.17, 0.45, -0.02]} r={0.004}><meshStandardMaterial color="#e9e0cc" roughness={0.9} /></RBox>
    {Array.from({ length: 22 }, (_, i) => <RBox key={i} s={[0.2, 0.026, 0.01]} p={[px + 0.05 + 0.01 * rn(i, 1), -0.2 + i * 0.058, -0.075]} rot={[0, 0, 0.02 * (rn(i, 2) - 0.5)]} r={0.002}>{M.wood({ base: [128, 96, 62] })}</RBox>)}
    <RBox s={[0.24, 1.5, 0.01]} p={[px + 0.04, 0.45, -0.095]} r={0.002}><meshStandardMaterial color="#1c140e" roughness={1} /></RBox>
    <OldWin p={[0, 0, 0]} lo={lo} pulley trim={false} sky="#8fb0cf" />
    <pointLight position={[px + 0.1, 0.5, 0.25]} intensity={1.2} distance={0.9} color="#ffe2b8" />
    <mesh position={[OW / 2 - 0.01, (lo * (OH / 2 - 0.03) + 0.3 + OH - 0.07) / 2, 0.022]}><cylinderGeometry args={[0.0035, 0.0035, OH - 0.07 - lo * (OH / 2 - 0.03) - 0.3, 8]} /><meshStandardMaterial color="#b9a476" roughness={0.9} /></mesh>
    <mesh position={[px, (OH - 0.07 + wy + 0.11) / 2, -0.03]}><cylinderGeometry args={[0.0035, 0.0035, OH - 0.07 - wy - 0.11, 8]} /><meshStandardMaterial color="#b9a476" roughness={0.9} /></mesh>
    <mesh position={[(OW / 2 + px) / 2, OH - 0.06, -0.005]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0035, 0.0035, px - OW / 2 + 0.01, 8]} /><meshStandardMaterial color="#b9a476" roughness={0.9} /></mesh>
    <mesh position={[px, OH - 0.06, -0.015]} rotation={[PI / 2, 0, tt * 2]}><cylinderGeometry args={[0.022, 0.022, 0.01, 24]} />{M.brass({ col: "#9a7a3a" })}</mesh>
    <mesh position={[px, wy, -0.03]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.22, 24]} /><meshStandardMaterial color="#4f5052" metalness={0.8} roughness={0.55} /></mesh>
    <mesh position={[px, wy + 0.118, -0.03]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.008, 0.003, 8, 16]} />{M.steel({ col: "#55575a" })}</mesh>
    <Stream id="wt" tt={tt} pts={[[px, OH - 0.06, -0.01], [px - 0.08, OH - 0.1, 0.15], [px - 0.25, OH - 0.2, 0.4]]} n={16} k={cold} w={0.005} len={0.07} spread={0.05} />
  </>;
}}</Scene3D>;

// ---- 6:08 · TRES MOVIMIENTOS, EN LA VENTANA DE VERDAD: la cámara viaja por la misma ventana (empapelado ocre, luz de día) y se
//      detiene en cada lugar mientras pasa su movimiento: en la guía la hoja sube y baja (desliza), en el antepecho baja y aprieta,
//      y en el medio la mano gira la traba y los rieles se juntan. Cada lugar se enciende cuando le toca ----
const MS = 1.4;
export const HMotions: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.9, 1.6, 1.6]} bg="#1b140e" warm={1.0} lamp={[0.6, 0.3, 0.7]}
  cam={{ at: [0, 0, 0], az: [-0.3, -0.12], el: [0.2, 0.26], r: [1.3, 1.15], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.3} b={1.85} txt="SIDES: THE WOOD SLIDES PAST" size={96} /><Say tt={tt} a={1.9} b={3.75} txt="BOTTOM: IT PRESSES DOWN" col="#b3561e" size={96} /><Say tt={tt} a={3.8} txt="MIDDLE: THE RAILS SQUEEZE" col="#1f6a3a" size={96} /></>}>{(tt) => {
  const g1 = eio(tt, 1.9, 2.5), g2 = eio(tt, 3.7, 4.3);
  const P1 = [0.3, 0.5, 0], P2 = [0.0, 0.05, 0], P3 = [0.04, 0.58, 0];
  const f = P1.map((v, i) => lerp(lerp(v, P2[i], g1), P3[i], g2)), ry = lerp(lerp(-0.35, 0.1, g1), -0.15, g2);
  const slide = tt < 2.2 ? 0.42 + 0.2 * Math.sin((tt - 0.4) * 3.2) * eio(tt, 0.3, 0.7) : 0;
  const press = eio(tt, 2.3, 3.2), lo = tt < 2.2 ? slide : lerp(0.42 + 0.2 * Math.sin(1.8 * 3.2), 0, press);
  const lock = eio(tt, 4.3, 5.1), b1 = eio(tt, 0.5, 0.8) * (1 - eio(tt, 2.0, 2.3)), b2 = eio(tt, 2.9, 3.2) * (1 - eio(tt, 3.9, 4.2)), b3 = eio(tt, 4.6, 5.0);
  const wall = <meshStandardMaterial map={wpMat("#b48a3c", "#be9445", "#f3e3b8", 3, 4)} roughness={0.9} />, ox = (OW / 2 + FR + 0.07) * MS;
  return <group rotation={[0, ry, 0]}><group position={[-f[0], -f[1], -f[2]]}>
    <OldWin s={MS} lo={lo} lock={lock} sky="#7d9cb6" gap={{ side: b1, bot: b2, rail: b3 }} gapCol="#ffb13a">
      {/* la mano que gira la traba */}
      <group visible={tt > 4.0}><Hand p={[0.07 - 0.03 * lock, OH / 2 + 0.05 - 0.025 * eio(tt, 4.0, 4.3), 0.05]} rot={[0, 0.5 - 0.9 * lock, 0]} s={0.72} curl={0.55} thumb={0.7} /></group>
    </OldWin>
    {/* pared de empapelado ocre alrededor del vano, y el faldón bajo el antepecho */}
    <RBox s={[1.2, 2.6, 0.02]} p={[-ox - 0.6, 0.6, 0.11]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.2, 2.6, 0.02]} p={[ox + 0.6, 0.6, 0.11]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[2 * ox, 0.7, 0.02]} p={[0, -0.39, 0.11]} r={0.002} shadow={false}><meshStandardMaterial map={wpMat("#b48a3c", "#be9445", "#f3e3b8", 1.6, 1.1)} roughness={0.9} /></RBox>
    <RBox s={[(OW + 2 * FR) * MS, 0.08, 0.02]} p={[0, -0.075, 0.125]} r={0.004}>{wood("#e9e1cf")}</RBox>
    {/* flechas del movimiento de cada lugar */}
    {b1 > 0.01 && [-1, 1].map((k) => <mesh key={k} position={[(OW / 2 + 0.02) * MS, 0.55 + k * 0.1 + 0.02 * Math.sin(tt * 3.2), 0.16]} rotation={[0, 0, k > 0 ? 0 : PI]} scale={b1}><coneGeometry args={[0.018, 0.045, 14]} />{M.glow({ col: "#ffb13a" })}</mesh>)}
    {b2 > 0.01 && <mesh position={[0, 0.12, 0.16]} rotation={[PI, 0, 0]} scale={b2}><coneGeometry args={[0.022, 0.05, 14]} />{M.glow({ col: "#ff8a3a" })}</mesh>}
    {b3 > 0.01 && [-1, 1].map((k) => <mesh key={k} position={[0.22, 0.58 + k * 0.05, 0.08]} rotation={[0, 0, k > 0 ? PI : 0]} scale={b3}><coneGeometry args={[0.016, 0.04, 14]} />{M.glow({ col: "#7cd38a" })}</mesh>)}
    {press > 0.98 && <Shock tt={tt} a={3.2} p={[0, 0.02, 0.06]} r={0.12} col="#ffb13a" />}
  </group></group>;
}}</Scene3D>;

// ---- 6:40 · LA V: el burlete plegado en V dentro de la rendija; se abre como resorte, la tapa, y la hoja pasa sin despegarlo ----
export const HVStrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-0.6, 1.6, 1.4]} bg="#1a140f" lamp={[0.4, 0.5, 0.6]}
  cam={{ at: [0, 0.05, 0.02], az: [-0.32, -0.1], el: [0.26, 0.18], r: [1.3, 1.1], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={2.9} txt="FOLDED INTO A V" /><Say tt={tt} a={3.05} txt="IT SPRINGS OPEN = SEALED" col="#1f6a3a" /></>}>{(tt) => {
  const sq = eio(tt, 3.9, 4.5), open = (tt < 3.0 ? 0.08 : phys(tt, 3.0, 9, 0.28)) * (1 - 0.7 * sq), slide = -0.06 * sq, leak = 1 - cl(tt < 3.0 ? 0 : phys(tt, 3.0, 9, 0.28));
  return <>
    <RoomBack p={[0, 0.15, -0.38]} wx={0.4} mat={<meshStandardMaterial map={wpMat("#4a5d6e", "#52677a", "#e0cf9a", 6, 5)} roughness={0.9} />} />
    <group scale={2.6}>
    {/* jamba a la izquierda, hoja a la derecha; la V vista de punta, con el pliegue abajo */}
    <RBox s={[0.06, 0.08, 0.2]} p={[-0.049, 0.02, 0.0]} r={0.002}>{wood("#d8cfbc")}</RBox>
    <RBox s={[0.06, 0.08, 0.2]} p={[0.049, 0.02, slide]} r={0.002}>{wood()}</RBox>
    <VStrip L={0.2} open={open} p={[0, -0.016, 0.1]} rot={[-PI / 2, 0, 0]} wing={0.05} amax={0.38} />
    <Puffs tt={tt} n={8} a={[0, 0.02, -0.14]} b={[0, 0.04, 0.16]} r={0.006} col="#8fd6ff" op={0.7 * leak} v={0.8} />
  </group></>;
}}</Scene3D>;

// pared empapelada alrededor de una ventana de escala s (deja el vano libre)
const WallS: React.FC<{ s: number; mat: React.ReactNode }> = ({ s, mat }) => { const ox = (OW / 2 + FR + 0.07) * s; return <group>
  <RBox s={[1.4, 3, 0.02]} p={[-ox - 0.7, 0.6, 0.08 * s]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[1.4, 3, 0.02]} p={[ox + 0.7, 0.6, 0.08 * s]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[2 * ox, 0.8, 0.02]} p={[0, -0.42, 0.08 * s]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[2 * ox, 0.8, 0.02]} p={[0, (OH + FR) * s + 0.48, 0.08 * s]} r={0.002} shadow={false}>{mat}</RBox>
</group>; };
// ---- 7:05 · BRONCE CONTRA VINILO, DOS GUÍAS DE VERDAD LADO A LADO: sobre el empapelado violeta, dos tramos de jamba con su burlete;
//      la hoja pasa por las dos. La V de bronce clavada brilla y se vuelve a abrir; la de vinilo se escarcha, se raja y se despega ----
export const HBronzeVinyl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.2, 1.6, 1.2]} bg="#1a140e" warm={0.45}
  cam={{ at: [-0.06, 0.34, 0.0], at1: [0.07, 0.36, 0.0], az: [0.32, -0.3], el: [0.1, 0.05], r: [0.9, 0.78], fov: 38 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.65} txt="BRONZE: LASTS ~100 YEARS" col="#b3561e" size={100} /><Say tt={tt} a={2.85} txt="VINYL: A FEW WINTERS" col="#1f4f8a" size={100} /></>}>{(tt) => {
  const press = eio(tt, 2.8, 3.4) * (1 - eio(tt, 4.2, 4.7)), wob = tt > 4.7 ? 0.14 * Math.sin((tt - 4.7) * 16) * Math.exp(-(tt - 4.7) * 4) : 0, ang = 0.75 * (1 - press) + wob;
  const frost = eio(tt, 2.2, 3.3), crack = eio(tt, 3.0, 3.6), peel = eio(tt, 3.4, 5.0), sw = (tt * 0.4) % 1, H2 = 0.5, W = 0.05;
  return <>
    <RBox s={[3, 2, 0.02]} p={[0, 0.3, -0.06]} r={0.002} shadow={false}><meshStandardMaterial map={wpMat("#3d3a5a", "#46426a", "#d6c08a", 5, 3.4)} roughness={0.9} /></RBox>
    {/* izquierda: jamba vieja con la V de bronce clavada y un brillo que la recorre */}
    <group position={[-0.17, 0, 0]}>
      <RBox s={[0.13, H2 + 0.08, 0.06]} p={[0, 0.29, 0]} r={0.004}>{M.wood({ rx: 1, ry: 2, base: [214, 196, 160] })}</RBox>
      <RBox s={[W, H2, 0.006]} p={[0, 0.3, 0.033]} r={0.001}><meshStandardMaterial color="#c9874a" metalness={1} roughness={0.22} emissive="#ffcf8a" emissiveIntensity={0.18} /></RBox>
      <mesh position={[0, 0.05 + sw * H2, 0.037]}><boxGeometry args={[W, 0.05, 0.002]} />{M.glow({ col: "#ffe2a8", op: 0.6 })}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-W * 0.32, 0.1 + i * 0.08, 0.037]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0045, 0.0045, 0.003, 12]} />{M.brass()}</mesh>)}
      {/* el ala de la V: bisagra en el borde, la hoja la aplasta y al soltarla salta de nuevo */}
      <group position={[W / 2, 0.3, 0.036]} rotation={[0, -ang, 0]}><RBox s={[0.04, H2, 0.003]} p={[0.02, 0, 0]} r={0.001}><meshStandardMaterial color="#d08f52" metalness={1} roughness={0.2} emissive="#ffcf8a" emissiveIntensity={0.12} /></RBox></group>
      {/* canto de la hoja que entra y aprieta */}
      <RBox s={[0.09, H2 * 0.9, 0.05]} p={[W / 2 + 0.05, 0.3, 0.04 + 0.03 + 0.11 * (1 - press)]} r={0.004}>{M.wood({ rx: 1, ry: 2, base: [176, 132, 92] })}</RBox>
      <pointLight position={[-0.15, 0.6, 0.35]} intensity={1.4} distance={1.3} color="#ffc070" />
    </group>
    {/* derecha: la de vinilo, que se escarcha, se raja y se le despega la punta de arriba */}
    <group position={[0.17, 0, 0]}>
      <RBox s={[0.13, H2 + 0.08, 0.06]} p={[0, 0.29, 0]} r={0.004}>{M.wood({ rx: 1, ry: 2, base: [205, 192, 168] })}</RBox>
      <RBox s={[W, H2 * 0.62, 0.006]} p={[0, 0.05 + H2 * 0.31, 0.033]} r={0.001}>{M.plastic({ col: "#8f8a80" })}</RBox>
      <group position={[0, 0.05 + H2 * 0.62, 0.033]} rotation={[0.9 * peel, 0, -0.35 * peel]}><RBox s={[W, H2 * 0.3, 0.006]} p={[0, H2 * 0.15, 0]} r={0.001}>{M.plastic({ col: "#857f74" })}</RBox></group>
      <mesh position={[0, 0.05 + H2 * 0.62, 0.0375]}><boxGeometry args={[W * crack, 0.004, 0.001]} />{M.matte({ col: "#3a3a3a" })}</mesh>
      <mesh position={[0, 0.05 + H2 * 0.31 * frost, 0.0372]}><planeGeometry args={[W + 0.02, Math.max(0.001, H2 * 0.62 * frost)]} /><meshBasicMaterial color="#cfeaff" transparent opacity={0.3 * frost} depthWrite={false} /></mesh>
      <Stream id="bvv" tt={tt} pts={[[0, 0.05 + H2 * 0.8, 0.0], [0.0, 0.05 + H2 * 0.8, 0.06], [-0.08, 0.4, 0.35]]} n={9} k={peel} w={0.004} len={0.05} spread={0.02} />
      <pointLight position={[0.15, 0.6, 0.35]} intensity={1.5 * frost} distance={1.3} color="#9fd0ff" />
    </group>
  </>;
}}</Scene3D>;

// ---- 7:42 · LA FELPA, EN LA GUÍA: primer plano del costado de la ventana con sol de tarde; la felpa corre a lo largo de la guía y la
//      hoja sube y baja rozándola: las cerdas se doblan para el lado que va la hoja y se vuelven a parar, sin agarrar la madera ----
export const HPile: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.0, 1.4, 1.2]} bg="#1c130b" warm={0.55}
  cam={{ at: [0.3, 0.3, 0.04], at1: [0.32, 0.22, 0.04], az: [-0.75, -0.55], el: [0.18, 0.14], r: [0.7, 0.56], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={2.9} txt="SHORT, DENSE BRUSH" size={100} /><Say tt={tt} a={3.05} txt="SLIDES, DOESN'T GRAB" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const S = 1.6, lo = 0.62 - 0.55 * eio(tt, 2.8, 5.0), vel = -1.7 * Math.sin(PI * cl((tt - 2.8) / 2.2));
  return <>
    <OldWin s={S} lo={lo} sky="#8fb0cf" />
    <WallS s={S} mat={<meshStandardMaterial map={wpMat("#7a8f6a", "#839873", "#efe2bf", 4, 3)} roughness={0.9} />} />
    {/* la felpa: base pegada a la jamba, cerdas que miran a la hoja */}
    <group position={[(OW / 2 - 0.004) * S, 0.03, 0.022 * S]} rotation={[0, 0, PI / 2]}>
      <Pile L={OH * S * 0.9} p={[OH * S * 0.45, 0, 0]} n={160} hgt={0.03} bend={-vel * 1.1} col="#55545c" />
    </group>
    {/* el sol de la tarde (siempre montado) */}
    <spotLight position={[-0.6, 1.2, 0.9]} angle={0.4} penumbra={0.8} intensity={2.5} distance={4} color="#ffc27a" />
  </>;
}}</Scene3D>;

// ---- 8:15 · EL BULBO, EN EL ANTEPECHO: luz fría de la mañana; el tubo de goma en el antepecho, el frío que pasa bajo la hoja;
//      la hoja baja, lo aplasta y el chorro se corta ----
export const HBulb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.6, 1.4, 1.2]} bg="#0f1419" warm={0.5}
  cam={{ at: [-0.2, 0.06, 0.05], at1: [-0.12, 0.03, 0.05], az: [-0.95, -0.7], el: [0.22, 0.14], r: [0.52, 0.44], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.6} b={2.95} txt="THE SASH COMES DOWN ON IT" size={100} /><Say tt={tt} a={3.0} txt="SQUASHED = SEALED" col="#1f6a3a" size={110} /></>}>{(tt) => {
  const S = 1.6, down = eio(tt, 1.0, 3.5), sq = eio(tt, 2.9, 3.5), leak = 1 - sq, r = 0.016;
  const lo = lerp(0.2, (2 * r * (1 - 0.55 * sq)) / ((OH / 2 - 0.03) * S), down);
  return <>
    <OldWin s={S} lo={lo} sky="#6f8fae" />
    <WallS s={S} mat={<meshStandardMaterial map={wpMat("#9aa7a0", "#a3b0a9", "#f2ecd9", 4, 3)} roughness={0.9} />} />
    <Bulb L={(OW - 0.02) * S} p={[0, 0, 0.022 * S]} squash={sq} r={r} col="#2a2a2c" />
    {[-0.25, -0.05, 0.15].map((x, i) => <Stream key={i} id={"bu" + i} tt={tt + i * 0.5} pts={[[x, 0.02, -0.2], [x, 0.02, 0.04], [x + 0.03, 0.05, 0.35]]} n={9} k={leak} w={0.0035} len={0.04} spread={0.012} />)}
    <spotLight position={[0.3, 1.2, -1.2]} angle={0.5} penumbra={0.8} intensity={2} distance={4} color="#cfe4ff" />
    {sq > 0.95 && <Shock tt={tt} a={3.5} p={[-0.1, 0.03, 0.06]} r={0.07} col="#7cd38a" />}
  </>;
}}</Scene3D>;

