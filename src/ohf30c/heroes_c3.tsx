// ohf30c · componentes únicos 15-24 (masilla, plomo y el lado de la V): el cordón que el pulgar aprieta en la rendija y en primavera
// se despega, las capas de pintura, ni lija ni pistola de calor, el plástico que se pliega con las escamas adentro y va a la bolsa,
// aspiradora común contra HEPA, el hisopo que se pone rojo, trapo húmedo en la guía (sin raspar) y la tira autoadhesiva,
// medir y cortar con la tijera, la V contra el viento y «firme, no trabado» con la mano levantando la hoja.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Puffs, Shock, Tape } from "./okit";
import { OH, OW, OldWin, RopeCaulk, VStrip , RoomBack } from "./winkit";
import { Hand, Say, Snow, Stream, TapeRoll, oldPaint, wpMat } from "./rkit";

const PI = Math.PI;
type V3 = [number, number, number];
const wood = (c = "#ece5d6") => <meshStandardMaterial color={c} roughness={0.55} />;
// el «no»: aro rojo con barra cruzada
const NoSign: React.FC<{ p: V3; k: number; r?: number }> = ({ p, k, r = 0.13 }) => <group position={p} scale={Math.max(0.001, k)} visible={k > 0.01}>
  <mesh><torusGeometry args={[r, r * 0.12, 12, 48]} />{M.glow({ col: "#e5402f" })}</mesh>
  <mesh rotation={[0, 0, PI / 4]}><boxGeometry args={[r * 1.9, r * 0.2, r * 0.1]} />{M.glow({ col: "#e5402f" })}</mesh>
</group>;
// pared alrededor del vano de la ventana (deja ver el cielo)
const WallAround: React.FC<{ mat: React.ReactNode; z?: number }> = ({ mat, z = 0.075 }) => <group>
  <RBox s={[1.6, 2.2, 0.02]} p={[-1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[1.6, 2.2, 0.02]} p={[1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.7, 0.02]} p={[0, 1.25, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.8, 0.02]} p={[0, -0.43, z]} r={0.002} shadow={false}>{mat}</RBox>
</group>;

// ---- 8:40 · MASILLA EN CORDÓN: macro en el cabezal; el pulgar va apretando el cordón gris en la rendija de arriba y el aire se corta
//      donde pasa; llega la primavera (luz tibia) y la mano lo despega entero ----
const rcPts = Array.from({ length: 30 }, (_, i) => [-OW / 2 + 0.02 + i * (OW - 0.04) / 29, OH - 0.047, 0.06]);
export const HRopeCaulk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.6, 1.8, 1.4]} bg="#17110c"
  cam={{ at: [-0.04, 0.72, 0.05], at1: [0.04, 0.7, 0.06], az: [-0.42, -0.2], el: [-0.1, -0.04], r: [0.72, 0.62], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={3.7} txt="PRESS IT IN WITH YOUR THUMB" /><Say tt={tt} a={3.9} txt="SPRING: IT PEELS RIGHT OFF" col="#1f6a3a" /></>}>{(tt) => {
  const grow = eio(tt, 0.7, 3.6), peel = eio(tt, 4.3, 5.5), sun = eio(tt, 3.6, 4.3);
  const n = rcPts.length - 1, f = Math.min(n, grow * n), fx = lerp(rcPts[0][0], rcPts[n][0], grow);
  // la mano: aprieta en el frente del cordón; en primavera toma la punta izquierda y tira hacia el cuarto
  const L = rcPts[n][0] - rcPts[0][0], th = 0.28 * peel, back = eio(tt, 3.6, 4.2);
  const lx = rcPts[n][0] - L * Math.cos(th), ly = OH - 0.047 - L * Math.sin(th);
  const hp: V3 = [lerp(fx, lx + 0.01, back), lerp(OH - 0.047 - 0.07, ly - 0.075, back), 0.08 + 0.006 * Math.sin(tt * 11) * (1 - back) + 0.1 * peel];
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#b98f7d", "#b0857a", "#efd9b8", 5, 5)} roughness={0.9} />} />
    <OldWin p={[0, 0, 0]} gap={{ top: 0.6 * (1 - grow * 0.95) + 0.4 * peel }} sky="#14233a" />
    <group position={[rcPts[rcPts.length - 1][0], OH - 0.047, 0.06]}><group position={[0, 0, peel * 0.1]} rotation={[0, 0, th]}><group position={[-rcPts[rcPts.length - 1][0], -(OH - 0.047), -0.06]}>
      <RopeCaulk id="ohc_top" pts={rcPts} grow={Math.max(0.02, grow)} r={0.011} col="#6f6a62" />
    </group></group></group>
    {/* el aire que entra por la rendija se corta donde ya hay cordón */}
    {[-0.16, -0.06, 0.04, 0.14].map((x, i) => <Stream key={i} id={"rcs" + i} tt={tt + i} pts={[[x, OH - 0.04, -0.06], [x + 0.01, OH - 0.07, 0.08], [x + 0.03, OH - 0.2, 0.32]]} n={9} k={cl((x - fx) / 0.05 + 0.5) * (1 - peel) + 0.6 * peel * (i % 2)} w={0.0035} len={0.05} spread={0.02} />)}
    <Hand p={hp} rot={[0, -PI / 2, PI / 2 + 0.15]} s={1} curl={0.15 + 0.5 * peel} thumb={0.4} />
    {/* el rollo de masilla sobre el antepecho, desenrollándose */}
    <group position={[0.17, 0.53, 0.12]} rotation={[0.3, 0, 0]}>{[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0, i * 0.012]} castShadow><torusGeometry args={[0.03 + i * 0.004, 0.006, 10, 36]} /><meshStandardMaterial color="#8f8b85" roughness={0.85} /></mesh>)}</group>
    {/* primavera: entra el sol tibio (rampa, siempre montada) */}
    <pointLight position={[0.1, 0.9, -0.5]} intensity={3 * sun} distance={2.4} color="#ffd690" />
  </>;
}}</Scene3D>;

// ---- 9:15 · LAS CAPAS: una escama de pintura en corte, gigante; se apilan cinco manos, la de abajo es la vieja con plomo ----
const LAY = [{ c: "#c9c3b4", n: "1920s · LEAD", lead: true }, { c: "#8a3a2c", n: "1940s · LEAD", lead: true }, { c: "#cdbf8a", n: "1960s", lead: false }, { c: "#5f7f5a", n: "1980s", lead: false }, { c: "#f2efe8", n: "TODAY", lead: false }];
export const HPaintLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none" key1={[-0.7, 1.8, 1.4]} warm={0.5}
  cam={{ at: [0, 0.3, 0], az: [-0.4, -0.15], el: [0.2, 0.12], r: [1.85, 1.7], fov: 32 }}
  over={(tt) => <Say tt={tt} a={3.2} txt="BUILT BEFORE 1978? ASSUME LEAD" col="#b3261e" />}>{(tt) => <>
    <RoomBack p={[0, 0.25, -0.9]} wx={0.5} mat={<meshStandardMaterial map={wpMat("#5a3a4a", "#644152", "#e6cf9e", 6, 5)} roughness={0.9} />} />
  <RBox s={[0.6, 0.08, 0.3]} p={[0, 0.04, 0]} r={0.004}>{M.wood({ base: [150, 104, 60] })}</RBox>
  {LAY.map((l, i) => { const k = eio(tt, 0.3 + i * 0.45, 0.6 + i * 0.45); return k > 0.01 ? <group key={i}>
    <RBox s={[0.6, 0.088 * k, 0.3]} p={[0, 0.08 + i * 0.092 + 0.044 * k, 0]} r={0.002}><meshStandardMaterial color={l.c} roughness={l.lead ? 0.15 : 0.5} metalness={l.lead ? 0.2 : 0} emissive={l.lead ? "#e5402f" : "#000"} emissiveIntensity={l.lead ? 0.25 * eio(tt, 3.0, 3.4) : 0} /></RBox>
    <Tape txt={l.n} col={l.lead ? "#b3261e" : "#1c2a3a"} p={[(i % 2 ? -1 : 1) * (l.lead ? 0.53 : 0.47), 0.124 + i * 0.092, 0.15]} w={l.lead ? 0.42 : 0.3} k={phys(tt, 0.4 + i * 0.45, 9, 0.45)} />
  </group> : null; })}
</>}</Scene3D>;

// ---- 9:58 · NI LIJA NI CALOR: la lijadora levanta su nube y el soplador de calor humea; a cada uno le cae el «no» rojo ----
export const HNoDrySand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.6, 2.0, 1.4]}
  cam={{ at: [0, 0.14, 0], az: [-0.2, 0.12], el: [0.3, 0.24], r: [1.3, 1.18], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={0.9} b={2.95} txt="NO DRY SANDING" col="#b3261e" /><Say tt={tt} a={3.1} txt="NO HEAT GUN, NO TORCH" col="#b3261e" /></>}>{(tt) => {
  const run = eio(tt, 0.3, 0.6), no1 = phys(tt, 0.9, 8, 0.4), no2 = phys(tt, 3.1, 8, 0.4);
  return <>
    <RoomBack p={[0, 0.25, -0.45]} wx={-0.45} mat={<meshStandardMaterial map={wpMat("#7a5a3a", "#84623f", "#ecd7a6", 6, 5)} roughness={0.9} />} />
    {/* lijadora orbital */}
    <group position={[-0.28, 0, 0]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.07, 0.07, 0.02, 32]} /><meshStandardMaterial color="#2a2a2c" roughness={0.6} /></mesh>
      <RBox s={[0.1, 0.09, 0.12]} p={[0.01 * Math.sin(tt * 40) * run, 0.085, 0]} r={0.025}>{M.plastic({ col: "#e0a020" })}</RBox>
      <Puffs tt={tt} n={14} a={[0, 0.03, 0]} b={[0.05, 0.3, 0.1]} r={0.03} col="#d9d3c4" op={0.55 * run} v={0.6} wob={0.06} />
      <NoSign p={[0, 0.18, 0.15]} k={no1} />
    </group>
    {/* soplador de calor */}
    <group position={[0.28, 0, 0]}>
      <RBox s={[0.05, 0.12, 0.05]} p={[0, 0.06, 0]} r={0.012}>{M.plastic({ col: "#c2302a" })}</RBox>
      <mesh position={[0, 0.14, 0.06]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.035, 0.18, 24]} />{M.plastic({ col: "#c2302a" })}</mesh>
      <mesh position={[0, 0.14, 0.16]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.026, 0.03, 20]} />{M.steel()}</mesh>
      <mesh position={[0, 0.14, 0.176]} rotation={[0, 0, 0]}><circleGeometry args={[0.02, 20]} />{M.glow({ col: "#ff7a2a", op: run })}</mesh>
      <Puffs tt={tt} n={10} a={[0, 0.14, 0.18]} b={[0, 0.34, 0.32]} r={0.02} col="#8a8478" op={0.5 * run} v={0.7} wob={0.03} />
      <NoSign p={[0, 0.18, 0.2]} k={no2} />
    </group>
  </>;
}}</Scene3D>;

// ---- 10:25 · EL PLÁSTICO ABAJO: bajo la ventana, la mano desenrolla el plástico sobre el piso de roble con sus pliegues de verdad,
//      lo sube contra la pared y lo pega con cinta azul bajo el faldón del antepecho; las escamas que caen quedan arriba del plástico ----
const plasTex = () => tex.text("plasCrink", 256, 256, (g) => {
  g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 120; i++) { g.strokeStyle = `rgba(${rn(i, 1) < 0.5 ? 255 : 0},${rn(i, 1) < 0.5 ? 255 : 0},${rn(i, 1) < 0.5 ? 255 : 0},${0.15 + 0.2 * rn(i, 2)})`; g.lineWidth = 1 + 2 * rn(i, 3);
    g.beginPath(); const x = rn(i, 4) * 256, y = rn(i, 5) * 256, a = rn(i, 6) * PI; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 60, y + Math.sin(a) * 60); g.stroke(); }
});
const CG = new Map<string, THREE.BufferGeometry>();
// lámina con pliegues: arrugas largas en diagonal + ondas suaves (desplaza en +z del plano)
const creaseG = (key: string, w: number, l: number, amp: number) => {
  if (CG.has(key)) return CG.get(key)!;
  const g = new THREE.PlaneGeometry(w, l, 64, 40), a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i); let z = 0;
    for (let k = 0; k < 7; k++) { const an = rn(k, 31) * PI, d = Math.cos(an) * x + Math.sin(an) * y - (rn(k, 32) - 0.5) * w, r = 0.012 + 0.03 * rn(k, 33); z += amp * (0.5 + rn(k, 34)) * Math.exp(-(d * d) / (r * r)); }
    z += amp * 0.25 * Math.sin(x * 23 + y * 7) * Math.sin(y * 17); a.setZ(i, z); }
  g.computeVertexNormals(); CG.set(key, g); return g;
};
export const HDropCloth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.5, 2.0, -1.2]} bg="#140e0a" warm={1.1} lamp={[-0.7, 0.6, 0.8]}
  cam={{ at: [-0.05, 0.3, 0.3], at1: [0.06, 0.48, 0.2], az: [-0.45, -0.22], el: [0.55, 0.32], r: [2.0, 1.75], fov: 38 }}
  over={(tt) => <><Say tt={tt} a={0.6} b={2.9} txt="PLASTIC DOWN FIRST" size={100} /><Say tt={tt} a={3.1} txt="TAPE IT UP UNDER THE SILL" col="#1f4f8a" size={96} /></>}>{(tt) => {
  const unf = eio(tt, 0.7, 2.5), up = eio(tt, 2.7, 3.5), tape = eio(tt, 3.6, 5.1), W = 0.86, Lf = lerp(0.07, 0.78, unf), Hf = lerp(0.02, 0.66, up), ZW = 0.085;
  const nm = plasTex(); nm.repeat.set(3, 3);
  const plas = <meshPhysicalMaterial color="#eef4f6" roughness={0.22} transparent opacity={0.55} side={THREE.DoubleSide} clearcoat={0.9} bumpMap={nm} bumpScale={0.5} depthWrite={false} />;
  const tx = lerp(-W / 2, W / 2, tape), wall = <meshStandardMaterial map={wpMat("#2f5a5a", "#356464", "#d9c9a0", 5, 3)} roughness={0.9} />;
  const hx = up < 0.99 ? 0 : tx, hy = up < 0.99 ? (unf < 0.99 ? 0.035 : lerp(0.035, Hf, up)) : Hf - 0.075, hz = up < 0.99 ? (unf < 0.99 ? ZW + Lf + 0.06 : ZW + 0.06) : ZW + 0.035;
  return <>
    <OldWin s={1} p={[0, 0.8, -0.02]} sky="#9ab8cf" />
    {/* pared de empapelado verde petróleo, zócalo y faldón bajo el antepecho */}
    <RBox s={[1.4, 2.6, 0.02]} p={[-1.0, 1.0, 0.055]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.4, 2.6, 0.02]} p={[1.0, 1.0, 0.055]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[0.6, 0.8, 0.02]} p={[0, 0.4, 0.055]} r={0.002} shadow={false}><meshStandardMaterial map={wpMat("#2f5a5a", "#356464", "#d9c9a0", 2.14, 0.92)} roughness={0.9} /></RBox>
    <RBox s={[0.6, 0.6, 0.02]} p={[0, 2.0, 0.055]} r={0.002} shadow={false}><meshStandardMaterial map={wpMat("#2f5a5a", "#356464", "#d9c9a0", 2.14, 0.69)} roughness={0.9} /></RBox>
    <RBox s={[0.62, 0.07, 0.022]} p={[0, 0.735, 0.08]} r={0.004}><meshStandardMaterial color="#e9e1cf" roughness={0.5} /></RBox>
    <RBox s={[2.8, 0.12, 0.022]} p={[0, 0.06, 0.07]} r={0.004}><meshStandardMaterial color="#efe8da" roughness={0.45} /></RBox>
    {/* el plástico en el piso, con sus pliegues; adelante el rollo que se achica */}
    <mesh geometry={creaseG("dcf", W, 0.8, 0.012)} position={[0, 0.004, ZW + Lf / 2]} rotation={[-PI / 2, 0, 0]} scale={[1, Lf / 0.8, 1]}>{plas}</mesh>
    <mesh position={[0, 0.006 + 0.03 * (1 - unf), ZW + Lf + 0.02 * (1 - unf)]} rotation={[0, 0, PI / 2]} visible={unf < 0.995}><cylinderGeometry args={[0.012 + 0.025 * (1 - unf), 0.012 + 0.025 * (1 - unf), W, 28]} /><meshPhysicalMaterial color="#e6eef1" roughness={0.3} transparent opacity={0.8} clearcoat={0.8} /></mesh>
    {/* la solapa que sube contra la pared */}
    <mesh geometry={creaseG("dcw", W, 0.66, 0.008)} position={[0, 0.004 + Hf / 2, ZW + 0.012]} scale={[1, Hf / 0.66, 1]} visible={Hf > 0.03}>{plas}</mesh>
    {/* la cinta azul que la mano va tendiendo arriba de la solapa */}
    {tape > 0.01 && <RBox s={[Math.max(0.003, tx + W / 2), 0.04, 0.003]} p={[(-W / 2 + tx) / 2, Hf - 0.008, ZW + 0.016]} r={0.001}><meshStandardMaterial color="#3d8bd9" roughness={0.75} /></RBox>}
    {tape > 0.01 && tape < 0.99 && <TapeRoll p={[tx + 0.045, Hf - 0.008, ZW + 0.04]} rot={[PI / 2, 0, 0]} s={0.9} />}
    {/* la mano: tira del borde, sube la solapa y después aprieta la cinta */}
    <Hand p={[hx - (tape > 0.01 ? 0.02 : 0), hy, hz]} rot={up < 0.99 ? [0, PI / 2, 0] : [0, PI / 2, PI / 2 - 0.35]} s={1.1} curl={tape > 0.01 ? 0.25 : 0.6} thumb={0.6} />
    {/* escamas que caen del antepecho y quedan sobre el plástico */}
    {Array.from({ length: 12 }, (_, i) => { const a0 = 5.0 + 0.08 * i, k = cl((tt - a0) / 0.5), x = (rn(i, 61) - 0.5) * 0.5, z = ZW + 0.09 + 0.25 * rn(i, 62);
      return <RBox key={i} s={[0.014 + 0.01 * rn(i, 63), 0.0018, 0.012]} p={[x, lerp(0.76, 0.008, k * k), lerp(ZW + 0.1, z, k)]} rot={[0, rn(i, 64) * 6, (1 - k) * 3 * rn(i, 65)]} r={0.0005}><meshStandardMaterial color={i % 3 ? "#eee6d3" : "#8a3a2c"} roughness={0.6} /></RBox>; })}
  </>;
}}</Scene3D>;

// ---- 10:38 · ASPIRADORA COMÚN CONTRA HEPA: la común tira el polvo fino otra vez al aire; la HEPA sopla limpio ----
const Vac: React.FC<{ p: V3; col: string; hepa?: boolean }> = ({ p, col, hepa }) => <group position={p}>
  <RBox s={[0.2, 0.13, 0.13]} p={[0, 0.075, 0]} r={0.04}>{M.plastic({ col })}</RBox>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.07, 0.022, 0.06]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.02, 20]} /><meshStandardMaterial color="#1d1d1f" /></mesh>)}
  <mesh position={[-0.12, 0.09, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.05, 16]} /><meshStandardMaterial color="#2a2a2c" /></mesh>
  {hepa && <mesh position={[0, 0.142, 0]}><boxGeometry args={[0.12, 0.004, 0.06]} /><meshBasicMaterial map={tex.text("hepa", 256, 128, (g) => { g.fillStyle = "#1f6a3a"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#fff"; g.font = "800 72px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("HEPA", 128, 68); })} /></mesh>}
</group>;
export const HHepa: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.7, 2.0, 1.4]}
  cam={{ at: [0, 0.32, 0], az: [-0.25, 0.1], el: [0.2, 0.16], r: [1.7, 1.5], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={1.0} b={2.7} txt="REGULAR VAC: DUST GOES BACK UP" col="#b3261e" /><Say tt={tt} a={2.9} txt="TRUE HEPA, OR A WET RAG" col="#1f6a3a" /></>}>{(tt) => {
  const on = eio(tt, 0.4, 0.8), roll = 0.04 * Math.sin(tt * 1.6) * on;
  return <>
    <RoomBack p={[0, 0.25, -0.5]} wx={0.5} mat={<meshStandardMaterial map={wpMat("#4f4a6a", "#575275", "#e2cf9a", 6, 5)} roughness={0.9} />} />
    <group scale={1.7}>
    <Vac p={[-0.27 + roll, 0, 0]} col="#5c6ea8" />
    <Puffs tt={tt} n={22} a={[-0.2 + roll, 0.12, 0]} b={[-0.05, 0.5, 0.1]} r={0.03} col="#bdb6a6" op={0.6 * on} v={0.55} wob={0.07} />
    <Vac p={[0.27 - roll, 0, 0]} col="#d9d5cc" hepa />
    <Puffs tt={tt} n={8} a={[0.34, 0.12, 0]} b={[0.45, 0.3, 0.05]} r={0.01} col="#e8f6ff" op={0.18 * on} v={0.9} />
    </group>
  </>;
}}</Scene3D>;

// ---- 10:58 · EL HISOPO: la mano enguantada lo frota sobre la pintura vieja del antepecho; la punta amarilla se pone roja ----
export const HSwab: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" key1={[-0.6, 1.8, 1.2]} bg="#15110d" lamp={[0.3, 0.4, 0.4]}
  cam={{ at: [0, 0.08, 0.02], az: [-0.5, -0.32], el: [0.42, 0.32], r: [0.72, 0.6], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={3.7} txt="LEAD TEST SWAB: RUB THE PAINT" /><Say tt={tt} a={3.9} txt="TURNS RED = LEAD" col="#b3261e" size={100} /></>}>{(tt) => {
  const rub = eio(tt, 0.7, 1.1) * (1 - eio(tt, 3.9, 4.3)), turn = eio(tt, 2.0, 3.9), x = 0.035 * Math.sin(tt * 7) * rub;
  const tip = new THREE.Color("#f2d34a").lerp(new THREE.Color("#d3262a"), turn), op = oldPaint(1);
  return <>
    <RBox s={[0.5, 0.05, 0.2]} p={[0, 0.025, 0]} r={0.006}><meshStandardMaterial map={op} roughness={0.45} /></RBox>
    <RBox s={[0.5, 0.3, 0.03]} p={[0, 0.17, -0.11]} r={0.004}><meshStandardMaterial map={wpMat("#5d4a3c", "#665241", "#cdb489", 3, 2)} roughness={0.9} /></RBox>
    {/* la mancha roja que deja el reactivo en la pintura */}
    <mesh position={[0, 0.0505, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03 * turn + 0.001, 24]} /><meshStandardMaterial color="#b3262a" transparent opacity={0.55 * turn} roughness={0.3} /></mesh>
    <group position={[x, 0.062 + 0.05 * (1 - rub), 0.02]} rotation={[0.2, 0, -0.9]}>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.004, 0.004, 0.16, 10]} />{M.plastic({ col: "#f4f1ea" })}</mesh>
      <mesh position={[0, 0.0, 0]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color={tip} roughness={0.9} emissive={tip} emissiveIntensity={0.25} /></mesh>
      <Hand p={[0.0, 0.2, 0.0]} rot={[0, 0, -PI / 2]} s={0.75} curl={0.7} thumb={0.8} glove col="#4a8a5a" />
    </group>
    {turn > 0.98 && <Shock tt={tt} a={3.9} p={[0, 0.07, 0.02]} r={0.045} col="#ff5a4a" />}
  </>;
}}</Scene3D>;

// ---- 11:22 · SIN RASPAR: el antepecho de verdad bajo la hoja levantada, con escamas de pintura vieja que se levantan; la mano
//      pasa el paño húmedo y las escamas se asientan oscuras y mojadas (nada se raspa ni se lija); después la tira autoadhesiva
//      entra a lo largo del antepecho, su papel se enrula, y la hoja baja y la aplasta ----
const Chip: React.FC<{ i: number; p: V3; lift: number; wet: number }> = ({ i, p, lift, wet }) => {
  const w = 0.014 + 0.02 * rn(i, 1), d = 0.01 + 0.016 * rn(i, 2), c = wet > 0.5 ? "#c9bea6" : "#f1e9d6";
  return <group position={p} rotation={[0, rn(i, 3) * 6.28, 0]}>
    <RBox s={[w, 0.0016, d]} p={[0, 0.0008, 0]} r={0.0006}><meshStandardMaterial color={c} roughness={0.5 - 0.35 * wet} /></RBox>
    <group position={[w / 2, 0.0016, 0]} rotation={[0, 0, lift]}><RBox s={[w * 0.8, 0.0016, d * 0.9]} p={[w * 0.4, 0, 0]} r={0.0006}><meshStandardMaterial color={c} roughness={0.5 - 0.35 * wet} /></RBox>
      <RBox s={[w * 0.8, 0.0008, d * 0.9]} p={[w * 0.4, -0.0011, 0]} r={0.0004}><meshStandardMaterial color="#6f8a6a" roughness={0.7} /></RBox></group>
  </group>;
};
export const HNoScrape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[0.9, 1.4, -1.1]} bg="#2a201a" warm={0.75} lamp={[-0.5, 0.4, 0.6]}
  cam={{ at: [-0.12, 0.05, 0.04], at1: [0.1, 0.06, 0.0], az: [-0.5, -0.18], el: [0.72, 0.52], r: [0.95, 0.88], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={3.3} txt="NO SCRAPING: WIPE IT DAMP" col="#1f6a3a" size={96} /><Say tt={tt} a={3.4} b={4.4} txt="THEN PEEL & STICK" col="#1f4f8a" size={100} /><Say tt={tt} a={4.45} txt="SASH CLOSES: SEALED" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const wipe = eio(tt, 0.7, 3.3), stick = eio(tt, 3.4, 4.5), close = eio(tt, 4.6, 5.2), X0 = -0.5, X1 = 0.5;
  const rx = lerp(X0 + 0.02, X1 - 0.02, wipe), sx = lerp(X0, X1, stick), ZS = -0.03;
  const wall = <meshStandardMaterial map={wpMat("#b98f86", "#c49c92", "#f1e2c8", 4, 3)} roughness={0.9} />;
  return <>
    <OldWin s={1.5} p={[0, 0, -0.06]} lo={0.24 * (1 - close)} sky="#9fbcd2" />
    {/* la pared de empapelado rosa viejo alrededor del vano */}
    <RBox s={[1.4, 2.4, 0.02]} p={[-1.25, 0.6, 0.02]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.4, 2.4, 0.02]} p={[1.25, 0.6, 0.02]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.2, 0.8, 0.02]} p={[0, -0.42, 0.02]} r={0.002} shadow={false}>{wall}</RBox>
    {/* el antepecho con su pintura vieja, de nariz redondeada, y su faldón */}
    <RBox s={[1.12, 0.026, 0.27]} p={[0, -0.01, 0.06]} r={0.008}><meshStandardMaterial map={oldPaint(1)} roughness={0.55} /></RBox>
    <RBox s={[0.96, 0.07, 0.02]} p={[0, -0.06, 0.17]} r={0.004}><meshStandardMaterial color="#e6dccb" roughness={0.55} /></RBox>
    {/* escamas: se levantan secas; donde pasó el paño quedan asentadas y mojadas */}
    {Array.from({ length: 46 }, (_, i) => { const x = X0 + 0.04 + rn(i, 7) * (X1 - X0 - 0.08), z = -0.0 + rn(i, 8) * 0.17, wet = cl((rx - x) / 0.04) * (wipe > 0.002 ? 1 : 0);
      return <Chip key={i} i={i} p={[x, 0.003, z]} lift={lerp(0.5 + 0.6 * rn(i, 9), 0.02, wet)} wet={wet} />; })}
    {/* brillo húmedo detrás del paño */}
    {wipe > 0.01 && <mesh position={[(X0 + rx) / 2, 0.0045, 0.075]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.001, rx - X0), 0.19]} /><meshPhysicalMaterial color="#9fb3bd" transparent opacity={0.32 * (1 - 0.5 * stick)} roughness={0.02} clearcoat={1} depthWrite={false} /></mesh>}
    {/* la mano con el paño de microfibra azul empapado, que gotea */}
    <group position={[rx, 0, 0.08]} visible={wipe > 0.005 && wipe < 0.995}>
      <RBox s={[0.13, 0.024, 0.11]} p={[0, 0.014, 0]} rot={[0, 0.2 * Math.sin(tt * 4), 0]} r={0.012}><meshPhysicalMaterial color="#2f6fc0" roughness={0.9} sheen={1} sheenColor="#9cc6ff" clearcoat={0.4} /></RBox>
      <Hand p={[-0.01, 0.05, 0.01]} rot={[0, 1.15, 0]} s={1.05} curl={0.35} thumb={0.4} />
      {[0, 1, 2].map((j) => { const k = ((tt * 1.3 + j / 3) % 1); return <mesh key={j} position={[0.05 - j * 0.03, 0.01 - 0.01 * k, 0.06]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.004, 10, 8]} />{M.glass({ op: 0.6 * (1 - k), col: "#cfeaff" })}</mesh>; })}
    </group>
    {/* la tira autoadhesiva gris a lo largo del antepecho, donde apoya la hoja; el papel protector se enrula y la mano la aprieta */}
    {stick > 0.01 && <group>
      <RBox s={[Math.max(0.002, sx - X0 - 0.02), 0.012 * (1 - 0.55 * close), 0.03]} p={[(X0 + 0.02 + sx) / 2, 0.006 * (1 - 0.55 * close), ZS]} r={0.003}><meshStandardMaterial color="#4b4a48" roughness={0.85} /></RBox>
      <group position={[sx, 0.014, ZS]} rotation={[0, 0, 1.0 + 0.8 * stick]} visible={stick < 0.99}><mesh position={[0.05, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.03]} /><meshStandardMaterial color="#f4f1e6" roughness={0.6} side={THREE.DoubleSide} /></mesh></group>
      <group visible={stick < 0.985}><Hand p={[sx - 0.02, 0.04, ZS + 0.085]} rot={[0, 1.2, -0.25]} s={1.0} curl={0.45} thumb={0.6} /></group>
    </group>}
    {close > 0.9 && <Shock tt={tt} a={5.15} p={[0.15, 0.02, ZS + 0.03]} r={0.07} col="#7cd38a" />}
  </>;
}}</Scene3D>;

// ---- 12:00 · MEDIR Y CORTAR: la cinta métrica sube por la guía desde el antepecho; la cámara baja a la tijera de hojalata,
//      que muerde la tira dos veces y el sobrante cae ----
export const HMeasureCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-0.6, 1.8, 1.4]} bg="#141210" lamp={[0.6, 0.5, 0.6]}
  cam={{ at: [0.05, 0.4, 0.04], at1: [0.34, 0.14, 0.14], az: [-0.45, -0.25], el: [0.1, 0.22], r: [1.35, 0.78], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.9} b={2.8} txt="SILL TO SASH TOP + 2 INCHES" /><Say tt={tt} a={3.0} txt="BRONZE? TIN SNIPS" col="#b3561e" size={100} /></>}>{(tt) => {
  const ext = eio(tt, 0.5, 2.0), c1 = eio(tt, 3.2, 3.5) * (1 - eio(tt, 3.6, 3.9)), c2 = eio(tt, 4.0, 4.3), cut = Math.max(c1, c2), fall = eio(tt, 4.35, 5.0), Lm = OH / 2 + 0.06;
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#4c5a4a", "#55644f", "#c4b480", 5, 5)} roughness={0.9} />} />
    <OldWin p={[0, 0, 0]} lo={0.85} sky="#2a3b52" />
    {/* cinta métrica: caja amarilla en el antepecho y la hoja que sube por la guía izquierda */}
    <RBox s={[0.07, 0.07, 0.03]} p={[-OW / 2 + 0.05, 0.035, 0.06]} r={0.012}>{M.plastic({ col: "#f2c21a" })}</RBox>
    <mesh position={[-OW / 2 + 0.03, 0.06 + Lm * ext / 2, 0.06]}><boxGeometry args={[0.018, Math.max(0.001, Lm * ext), 0.002]} /><meshStandardMaterial color="#f5d23a" metalness={0.4} roughness={0.35} /></mesh>
    <mesh position={[-OW / 2 + 0.03, 0.06 + Lm, 0.062]} visible={ext > 0.97}><boxGeometry args={[0.05, 0.004, 0.003]} />{M.glow({ col: "#e5533d" })}</mesh>
    {/* la tira de bronce sobre el antepecho y la tijera grande mordiéndola */}
    <group position={[0.34, 0.12, 0.17]} rotation={[0, -0.25, 0]} scale={2.2}>
      <RBox s={[0.2, 0.003, 0.02]} p={[-0.1, 0, 0]} r={0.001}>{M.brass({ col: "#d8a057" })}</RBox>
      <group position={[0.02 + 0.04 * fall, -0.12 * fall * fall, 0.02 * fall]} rotation={[0.8 * fall, 0, -1.2 * fall]}><RBox s={[0.04, 0.003, 0.02]} p={[0, 0, 0]} r={0.001}>{M.brass({ col: "#d8a057" })}</RBox></group>
      <group position={[0, 0.0, 0]} rotation={[0, 0, -0.15]}>
        {[-1, 1].map((k) => <group key={k} rotation={[0, 0, k * lerp(0.32, 0.02, cut)]}><RBox s={[0.1, 0.014, 0.006]} p={[-0.03, 0, k * 0.004]} r={0.002}>{M.steel()}</RBox>
          <RBox s={[0.13, 0.024, 0.014]} p={[0.07, 0, k * 0.004]} r={0.007}>{M.plastic({ col: "#d3262a" })}</RBox></group>)}
        <mesh position={[0.02, 0, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.02, 14]} />{M.steel({ col: "#9aa0a6" })}</mesh>
      </group>
    </group>
    {fall > 0.05 && <Shock tt={tt} a={4.35} p={[0.4, 0.1, 0.18]} r={0.05} col="#ffd27a" />}
  </>;
}}</Scene3D>;

// ---- 12:25 · EL LADO DE LA V: corte de la jamba visto desde arriba, grande: arriba la vereda nevada de afuera, abajo el piso de madera
//      del cuarto. Primero la V bien puesta: el viento entra en la V, la abre y la sella. La cámara corre y la misma V al revés: el viento
//      pega en el pliegue, la aplasta y el aire pasa ----
export const HVWind: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[0.4, 2.2, 0.8]} bg="#14171b" warm={0.35}
  cam={{ at: [0, 0, 0.03], az: [-0.06, 0.06], el: [1.12, 1.05], r: [0.95, 0.85], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.7} b={2.75} txt="OPEN SIDE OUT = SEALS" col="#1f6a3a" size={115} /><Say tt={tt} a={3.0} txt="BACKWARDS = FOLDS FLAT" col="#b3261e" size={115} /></>}>{(tt) => {
  const pan = eio(tt, 2.75, 3.25), w1 = eio(tt, 0.8, 1.5), w2 = eio(tt, 3.3, 4.0), D = 0.75;
  const Case: React.FC<{ ok: boolean; w: number; x: number }> = ({ ok, w, x }) => {
    const wob = 0.8 + 0.2 * Math.sin(tt * 1.7), open = ok ? lerp(0.6, 1, w * wob) : lerp(0.75, 0.03, w), leak = ok ? 0 : w;
    return <group position={[x, 0, 0]}>
      {/* afuera: vereda nevada, con nieve cayendo; adentro: tablas de piso con la luz tibia del cuarto */}
      <RBox s={[0.78, 0.01, 0.8]} p={[0, -0.07, -0.4]} r={0.002} shadow={false}>{M.matte({ col: "#dfe8f2" })}</RBox>
      <RBox s={[0.78, 0.01, 0.8]} p={[0, -0.07, 0.4]} r={0.002} shadow={false}>{M.wood({ rx: 3, ry: 1, base: [150, 98, 56] })}</RBox>
      <Snow tt={tt} n={40} box={[-0.33, 0.33, -0.06, 0.25, -0.36, -0.06]} r={0.0035} />
      <group scale={3}>
        <RBox s={[0.05, 0.03, 0.14]} p={[-0.044, 0, 0]} r={0.002}>{M.wood({ rx: 1, ry: 1, base: [222, 210, 186] })}</RBox>
        <RBox s={[0.05, 0.03, 0.14]} p={[0.044, 0, 0]} r={0.002}>{M.wood({ rx: 1, ry: 1, base: [236, 226, 206] })}</RBox>
        <VStrip L={0.03} open={open} p={[0, -0.015, ok ? 0.03 : -0.03]} rot={[0, ok ? PI : 0, 0]} wing={0.06} amax={0.33} />
        <Puffs tt={tt + (ok ? 0 : 1)} n={9} a={[0, 0.02, -0.12]} b={[0, 0.02, ok ? -0.045 : 0.13]} r={0.006} col="#8fd6ff" op={0.8 * w} v={0.9} />
      </group>
      {ok ? <Shock tt={tt} a={1.6} p={[0, 0.06, 0]} r={0.12} col="#7cd38a" /> : <Shock tt={tt} a={3.9} p={[0, 0.06, 0]} r={0.12} col="#e05a4a" />}
      <pointLight position={[0, 0.3, 0.3]} intensity={0.8 + 0.6 * leak} distance={1} color={ok ? "#ffc27a" : "#9fd0ff"} />
    </group>;
  };
  return <group position={[-lerp(-D / 2, D / 2, pan), 0, 0]}>
    <Case ok={true} w={w1} x={-D / 2} />
    <Case ok={false} w={w2} x={D / 2} />
  </group>;
}}</Scene3D>;

// ---- 13:15 · LA PRUEBA DEL BILLETE: primer plano del antepecho en un cuarto de friso verde; la mano mete un billete bajo la hoja,
//      la hoja baja y lo pisa; la mano tira: el billete se estira, aguanta y recién sale de un tirón = firme, no trabado ----
export const HSnugTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.9, 1.6, 1.4]} bg="#0f130f" warm={0.6} lamp={[-0.4, 0.5, 0.6]}
  cam={{ at: [0.0, 0.04, 0.1], at1: [0.02, 0.12, 0.2], az: [-0.55, -0.35], el: [0.38, 0.25], r: [0.5, 0.66], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={3.4} txt="THE DOLLAR TEST" size={110} /><Say tt={tt} a={3.6} txt="IT TUGS = SNUG, NOT STUCK" col="#1f6a3a" size={110} /></>}>{(tt) => {
  const ins = eio(tt, 0.4, 1.4), lo = 0.12 * (1 - eio(tt, 1.6, 2.3)), pull = eio(tt, 2.5, 3.5), out = eio(tt, 3.6, 4.3);
  const bz = lerp(0.24, 0.02, ins) + 0.015 * pull + 0.3 * out, by = 0.004 + 0.2 * out, bend = pull * (1 - out);
  const front: V3 = [0, by + 0.003 + 0.02 * bend, bz + 0.065];
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#2f4a3a", "#2a4334", "#9fb08a", 8, 6)} roughness={0.85} />} />
    <OldWin p={[0, 0, 0]} lo={lo} sky="#5d7e9e" />
    {/* el billete: verde, con su óvalo y el número; se arquea cuando la mano tira y la hoja lo aguanta */}
    <group position={[0, by, bz]} rotation={[-0.3 * bend - 0.15 * out, 0.3 * out, 0.1 * out]}>
      <RBox s={[0.15, 0.0015, 0.065]} r={0.0005}>{M.matte({ col: "#8fb08a" })}</RBox>
      <mesh position={[0, 0.0009, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.012, 0.017, 32]} />{M.matte({ col: "#3f6a45" })}</mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.058, 0.0009, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.007, 20]} />{M.matte({ col: "#3f6a45" })}</mesh>)}
    </group>
    <Hand p={front} rot={[0.25 * bend, PI / 2, 0.1]} s={0.75} curl={0.62 + 0.15 * pull} thumb={0.9} />
    {pull > 0.05 && out < 0.9 && <Shock tt={tt} a={2.9} p={[0, 0.01, 0.06]} r={0.04} col="#ffd27a" />}
    {out > 0.95 && <Shock tt={tt} a={4.3} p={[0, 0.05, 0.12]} r={0.08} col="#7cd38a" />}
  </>;
}}</Scene3D>;
