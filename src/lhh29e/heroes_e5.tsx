// lhh29e · componentes únicos 40-48: bicarbonato contra maicena en la bota, el estante de los cuatro frascos, las seis cintas de Edna,
// la pasta clara como cola, de pico blando a firme, el sello hasta el borde, el merengue que no llora, los 47 agostos y la próxima: vinagre blanco.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { card, lg, SERIF } from "./saltkit";
import { Boot, CornBox, MeringuePie, Mound, Pot, Puff, Sprayer, powderMat } from "./cornkit";

const PI = Math.PI;

// ---- 17:52 · CADA UNO A LO SUYO: dos medidores sobre las botas de Harold: el bicarbonato baja el olor, la maicena baja lo mojado; mitad y mitad baja los dos ----
export const HBootsDry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.1], el: [0.2, 0.16], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="HAROLD'S BOOTS IN AUGUST" title="HALF AND HALF" col={AMB} /><Tag tt={tt} at={0.8} x={560} y={880} txt="SODA: SMELL" col={ICE} size={40} /><Tag tt={tt} at={1.4} x={1360} y={880} txt="CORNSTARCH: WET" col={GRN} size={40} /></>}>{(tt) => {
  const k = eio(tt, 1.0, 4.4);
  const Meter: React.FC<{ x: number; v: number; col: string; lab: string }> = ({ x, v, col, lab }) => <group position={[x, 0.26, -0.05]}>
    <RBox s={[0.03, 0.12, 0.012]} r={0.004}><meshStandardMaterial color="#2a2420" /></RBox>
    <mesh position={[0, -0.055 + 0.055 * v, 0.007]} scale={[1, v + 0.001, 1]}><planeGeometry args={[0.02, 0.11]} />{M.glow({ col })}</mesh>
    <mesh position={[0, -0.075, 0.007]}><planeGeometry args={[0.07, 0.022]} /><meshStandardMaterial map={card("lab" + lab, 160, 50, [lab], 28, "#f4ead2", "#2a2420")} /></mesh></group>;
  return <>
    {[-1, 1].map((s) => <Boot key={s} p={[s * 0.1, 0, 0]} rot={[0, s * 0.2, 0]} s={1.1} wet={1 - k} />)}
    {[-1, 1].map((s) => <group key={s}>
      <Mound p={[s * 0.1, 0.155, -0.022]} r={0.024} h={0.008} col={s < 0 ? "#f2f6f8" : "#fbfaf6"} />
      {Array.from({ length: 5 }, (_, i) => { const u = ((tt * 0.7 + i / 5) % 1); return <mesh key={i} position={[s * 0.1 + Math.sin(i * 2) * 0.02, 0.16 + u * 0.1, -0.02]} scale={0.6 + u}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#8a9a6a" transparent opacity={0.25 * (1 - u) * (1 - k)} depthWrite={false} /></mesh>; })}
    </group>)}
    <Meter x={-0.25} v={1 - 0.8 * k} col="#7ac06a" lab="SMELL" />
    <Meter x={0.25} v={1 - 0.85 * k} col="#4aa8e8" lab="WET" />
  </>; }}</Scene3D>;

// ---- 18:29 · UNA CAJA LLENA CUATRO: la caja amarilla se inclina y llena en orden el frasco de la cocina, el rociador del planchado, la lata de talco y la lata de café del placard ----
export const HShelf4: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.1], el: [0.12, 0.08], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => { const L = ["KITCHEN JAR", "IRONING SPRAY", "POWDER TIN", "HALL CLOSET CAN"], i = Math.min(3, Math.max(0, Math.floor((tt - 0.5) / 1.4)));
    return <><Head tt={tt} kick="ONE BOX, $1 AND SOMETHING" title="FILLS ALL FOUR" col={AMB} /><Tag key={i} tt={tt - i * 1.4} at={0.5} x={1450} y={880} txt={L[i]} col={GRN} size={38} /></>; }}>{(tt) => {
  const step = cl((tt - 0.5) / 5.6) * 4, si = Math.min(3, Math.floor(step)), fr = step - si, X = [-0.27, -0.09, 0.09, 0.27];
  const fill = (i: number) => cl(step - i);
  return <>
    <RBox s={[0.8, 0.02, 0.18]} p={[0, 0.0, 0]} r={0.004}>{M.wood({ base: [160, 116, 70] })}</RBox>
    <group position={[X[0], 0.01, 0]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.04, 0.04, 0.12, 40]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.003 + 0.055 * fill(0), 0]} scale={[1, fill(0) + 0.01, 1]}><cylinderGeometry args={[0.038, 0.038, 0.11, 40]} />{powderMat()}</mesh>
      <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.042, 0.042, 0.012, 40]} />{M.brass({})}</mesh>
      <mesh position={[0, 0.06, 0.041]}><planeGeometry args={[0.05, 0.03]} /><meshStandardMaterial map={card("jarlab", 128, 70, ["CORNSTARCH"], 20, "#2a1e12", "#f4ead2")} /></mesh></group>
    <group position={[X[1], 0.01, 0]}><Sprayer s={0.6} fill={0.15 + 0.6 * fill(1)} cloud={0.7} /></group>
    <group position={[X[2], 0.01, 0]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.05, 0.05, 0.06, 40]} /><meshStandardMaterial color="#e6d6b0" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0, 0.0605 + 0.001 * fill(2), 0]} rotation={[-PI / 2, 0, 0]} scale={fill(2) + 0.01}><circleGeometry args={[0.047, 32]} />{powderMat()}</mesh>
      <mesh position={[0.07, 0.02, 0.02]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.03, 20, 14]} /><meshStandardMaterial color="#fbf2f0" roughness={1} /></mesh></group>
    <group position={[X[3], 0.01, 0]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.045, 0.045, 0.12, 40]} /><meshStandardMaterial map={tex.text("coffeecan", 256, 128, (g) => { g.fillStyle = "#b8322a"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#f4ead2"; g.font = "bold 34px " + SERIF; g.textAlign = "center"; g.fillText("COFFEE", 128, 76); })} metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[0, 0.115 * fill(3) + 0.005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.043, 32]} />{powderMat()}</mesh></group>
    <group position={[X[si] - 0.07, 0.24, 0]} rotation={[0, 0, -(fr < 0.85 ? eio(fr, 0, 0.25) : 1 - eio(fr, 0.85, 1)) * 1.9]}><CornBox s={0.8} p={[0, -0.056, 0]} lid={1} /></group>
    {fr > 0.2 && fr < 0.85 && Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[X[si] + (rn(i, 2) - 0.5) * 0.01, 0.2 - ((tt * 1.8 + rn(i, 3)) % 1) * 0.07, 0]}><sphereGeometry args={[0.0028, 6, 5]} />{powderMat()}</mesh>)}
  </>; }}</Scene3D>;

// ---- 18:46 · SEIS AÑOS SEGUIDOS: seis cintas azules de Edna caen colgadas en fila en la pared del pabellón, una por año, del 73 al 78 ----
export const HSixInRow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0, 0.16, 0], az: [0.1, -0.1], el: [0.04, 0.02], r: [0.82, 0.7], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="EDNA PRUITT" title="SIX YEARS IN A ROW" col={ICE} /></>}>{(tt) => <>
  <RBox s={[0.9, 0.5, 0.02]} p={[0, 0.2, -0.05]} r={0.004}>{M.wood({ base: [150, 104, 64], rx: 4, ry: 1 })}</RBox>
  {Array.from({ length: 6 }, (_, i) => { const a = 0.3 + i * 0.45, k = phys(tt, a, 8, 0.4); if (tt < a - 0.05) return null;
    return <group key={i} position={[-0.3 + i * 0.12, 0.26 + (1 - cl(k)) * 0.25, -0.03]} rotation={[0, 0, Math.sin(tt * 2 + i) * 0.05]}>
      {Array.from({ length: 14 }, (_, j) => <mesh key={j} rotation={[0, 0, (j / 14) * PI * 2]} position={[0, 0, -0.002]}><boxGeometry args={[0.01, 0.07, 0.002]} /><meshStandardMaterial color="#1e4aa8" roughness={0.5} /></mesh>)}
      <mesh><circleGeometry args={[0.026, 32]} /><meshStandardMaterial map={card("e" + i, 128, 128, ["'" + (73 + i)], 54, "#ffd84a", "#1e4aa8")} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.012, -0.07, -0.003]} rotation={[0, 0, s * 0.15]}><planeGeometry args={[0.02, 0.09]} /><meshStandardMaterial color="#1e4aa8" side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.004, 8, 6]} />{M.brass({})}</mesh>
    </group>; })}
</>}</Scene3D>;

// ---- 19:22 · CLARA Y ESPESA COMO COLA: la cacerolita con la mezcla lechosa sobre la hornalla; se aclara y se espesa; la cuchara de madera sube y la pasta cuelga en un hilo grueso ----
export const HPaste: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.14, 0], az: [0.3, 0.1], el: [0.22, 0.18], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="1 TBSP + ⅓ CUP COLD WATER" title="CLEAR AND THICK" col={AMB} /><Tag tt={tt} at={4.0} x={1450} y={860} txt="LIKE GLUE" col={GRN} size={44} /></>}>{(tt) => {
  const k = eio(tt, 0.6, 3.4), lift = eio(tt, 3.6, 4.8);
  return <>
    <Pot s={0.8} level={0.5} thick={k} col={new THREE.Color("#f6f4ee").lerp(new THREE.Color("#e6eef0"), k).getStyle()} />
    <mesh position={[0, 0.0345, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} /><meshPhysicalMaterial color="#ffffff" transmission={0.7 * k} thickness={0.02} roughness={0.05} clearcoat={1} transparent opacity={0.4 + 0.3 * k} /></mesh>
    <group position={[0.01, 0.06 + 0.13 * lift, 0]} rotation={[0, 0, 0.5]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.005, 0.005, 0.15, 10]} />{M.wood({ base: [190, 150, 100] })}</mesh>
      <mesh scale={[1, 0.35, 0.8]}><sphereGeometry args={[0.018, 20, 12]} />{M.wood({ base: [190, 150, 100] })}</mesh></group>
    {lift > 0.05 && <mesh position={[0.01, (0.035 + 0.055 + 0.13 * lift) / 2, 0]} scale={[1, (0.02 + 0.13 * lift) / 0.1, 1]}><cylinderGeometry args={[0.005, 0.009, 0.1, 14]} /><meshPhysicalMaterial color="#f2f7f8" roughness={0.08} clearcoat={1} transparent opacity={0.85} /></mesh>}
    <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.075, 32]} />{M.glow({ col: "#ff5a2a", op: 0.5 })}</mesh>
    <pointLight position={[0, 0.01, 0]} color="#ff6a2a" intensity={1} distance={0.35} />
  </>; }}</Scene3D>;

// ---- 19:52 · DE PICO BLANDO A FIRME: el batidor levantado; el pico de merengue primero se dobla como ola y, con cada cucharada de pasta, se para derecho y brillante ----
export const HSoftStiff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.17, 0], az: [0.15, -0.1], el: [0.12, 0.1], r: [0.85, 0.75], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="4 WHITES · ½ CUP SUGAR" title="STIFF AND GLOSSY" col={ICE} /><Tag tt={tt} at={0.6} x={560} y={880} txt="SOFT PEAK" col={AMB} size={40} /><Tag tt={tt} at={3.6} x={1360} y={880} txt="STIFF PEAK" col={GRN} size={40} /></>}>{(tt) => {
  const k = eio(tt, 1.2, 4.0), bend = (1 - k) * 1.3;
  const pts: number[][] = Array.from({ length: 12 }, (_, i) => { const u = i / 11; return [Math.sin(u * bend) * 0.04 * u, 0.1 + u * 0.08 * (1 - 0.3 * (1 - k)), 0]; });
  return <>
    <group position={[0, 0.2, 0]}>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[0, (i / 6) * PI, 0]} position={[0, 0.04, 0]}><torusGeometry args={[0.03, 0.0015, 6, 40, PI]} />{M.steel({})}</mesh>)}
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.008, 0.008, 0.12, 12]} />{M.wood({ base: [150, 104, 64] })}</mesh>
    </group>
    {pts.map((p, i) => <mesh key={i} position={[p[0], 0.31 - p[1] + 0.02, 0]}><sphereGeometry args={[0.03 * (1 - i / 12) + 0.004, 16, 12]} />
      <meshPhysicalMaterial color="#fffbf2" roughness={lerp(0.6, 0.12, k)} clearcoat={k} /></mesh>)}
    <mesh position={[0, 0.0, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.12, 40, 20, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#fffbf2" roughness={lerp(0.6, 0.15, k)} clearcoat={k} /></mesh>
    {Array.from({ length: 3 }, (_, i) => { const a = 1.0 + i * 0.9, u = cl((tt - a) / 0.5); if (u <= 0 || u >= 1) return null;
      return <mesh key={i} position={[0.06, lerp(0.22, 0.05, u), 0.03]}><sphereGeometry args={[0.008, 12, 10]} /><meshPhysicalMaterial color="#ffffff" transmission={0.6} thickness={0.01} roughness={0.05} /></mesh>; })}
  </>; }}</Scene3D>;

// ---- 20:05 · SELLADO AL BORDE: vista de arriba de la tarta; el merengue se esparce desde el centro y una línea verde corre el círculo cuando toca la masa por todo el borde ----
export const HSeal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none"
  cam={{ at: [0, 0.03, 0], az: [0, 0.25], el: [0.9, 0.8], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="ON THE HOT FILLING" title="SEAL IT TO THE CRUST" col={GRN} /></>}>{(tt) => { const k = eio(tt, 0.2, 2.0), ring = eio(tt, 1.8, 3.2);
  return <>
    <MeringuePie s={1.2} mer={k} gap={1 - k} peaks={0.4} />
    {ring > 0 && ring < 1 && <group position={[Math.cos(ring * PI * 2 + PI / 2) * 0.14, 0.06 + 0.012 * Math.abs(Math.sin(tt * 14)), -Math.sin(ring * PI * 2 + PI / 2) * 0.14]} rotation={[0, ring * PI * 2 + PI / 2, 0]}>
      <group rotation={[0, 0, -0.5]}><RBox s={[0.12, 0.004, 0.016]} p={[0.07, 0, 0]} r={0.002}>{M.steel({})}</RBox>
        {[0, 1, 2, 3].map((k) => <RBox key={k} s={[0.03, 0.002, 0.0025]} p={[-0.004, 0, -0.006 + k * 0.004]} r={0.001}>{M.steel({})}</RBox>)}</group></group>}
    {Array.from({ length: 40 }, (_, i) => { const a = i / 40 * PI * 2, on = ring * 40 > i; return on && <mesh key={i} position={[Math.cos(a + PI / 2) * 0.139, 0.052, -Math.sin(a + PI / 2) * 0.139]} rotation={[-PI / 2, 0, a]}><boxGeometry args={[0.003, 0.012, 0.002]} /><meshStandardMaterial color="#d8c8a8" roughness={0.8} /></mesh>; })}
    {Array.from({ length: 6 }, (_, i) => { const u = ((tt * 0.6 + i / 6) % 1); return <mesh key={i} position={[Math.cos(i) * 0.05, 0.06 + u * 0.1, Math.sin(i) * 0.05]} scale={0.6 + u}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.18 * (1 - u)} depthWrite={false} /></mesh>; })}
  </>; }}</Scene3D>;

// ---- 20:09 · NO LLORA: dos tartas en la mesa del jurado bajo el calor de agosto; a la izquierda gotitas de almíbar y charco; a la derecha, la de la pasta, seca y dorada ----
export const HNoWeep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.05, 0], az: [-0.1, 0.1], el: [0.4, 0.34], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="2 HOURS IN AUGUST" title="NOT ONE TEAR" col={AMB} /><Tag tt={tt} at={0.8} x={560} y={880} txt="WEEPING" col={RED} size={42} /><Tag tt={tt} at={1.6} x={1360} y={880} txt="CORNSTARCH PASTE" col={GRN} size={40} /></>}>{(tt) => { const w = eio(tt, 0.6, 4.0);
  return <>
    <RBox s={[0.7, 0.02, 0.32]} p={[0, 0.01, 0]} r={0.004}><meshStandardMaterial color="#f4efe4" roughness={0.8} /></RBox>
    <MeringuePie p={[-0.13, 0.02, 0]} s={0.95} gold={0.7} weep={w} gap={w * 0.6} />
    <MeringuePie p={[0.13, 0.02, 0]} s={0.95} gold={0.85} />
    {Array.from({ length: 10 }, (_, i) => { const a = 0.5 + i * 0.55, q = ((tt * 0.7 + rn(i, 51)) % 1); return w > 0.15 && <mesh key={"wd" + i} position={[-0.13 + Math.cos(a) * 0.11, 0.085 - q * 0.064, Math.sin(a) * 0.11]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.0055, 12, 10]} />{M.water({ col: "#e8b84a", op: 0.9 })}</mesh>; })}
    <mesh position={[-0.13, 0.0205, 0.02]} rotation={[-PI / 2, 0, 0]} scale={[1.2, 1, 1]}><circleGeometry args={[0.15 * w + 0.001, 40]} />{M.water({ col: "#e0b04a", op: 0.6 * w })}</mesh>
    <group position={[0.13, 0.12, 0.11]} rotation={[-0.4, 0, 0]} scale={Math.max(0.001, eio(tt, 3.6, 4.2))}><mesh><circleGeometry args={[0.022, 24]} /><meshStandardMaterial color="#1e4aa8" /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[0.012, 24]} /><meshStandardMaterial color="#f2d65a" /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.008, -0.03, -0.001]} rotation={[0, 0, s * 0.2]}><planeGeometry args={[0.012, 0.04]} /><meshStandardMaterial color="#1e4aa8" side={THREE.DoubleSide} /></mesh>)}</group>
    <mesh position={[0, 0.5, 0.2]}><sphereGeometry args={[0.05, 20, 14]} />{M.glow({ col: "#ffcf6a", op: 0.8 })}</mesh>
    <pointLight position={[0, 0.5, 0.2]} color="#ffcf6a" intensity={1.6} distance={1.2} />
  </>; }}</Scene3D>;

// ---- 21:12 · CUARENTA Y SIETE AGOSTOS: hojas de almanaque de agosto vuelan una tras otra desde 1979; el contador llega a 47 y la última dice 2026 ----
export const HYears47: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0.03, 0.14, 0], az: [-0.12, 0.08], el: [0.06, 0.04], r: [0.74, 0.64], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="EDNA STILL ASKS" title="47 AUGUSTS" col={AMB} /><Tag tt={tt} at={3.8} x={1450} y={860} txt="DON'T TELL EDNA" col={RED} size={44} /></>}>{(tt) => { const n = 47 * eio(tt, 0.3, 3.6), yr = 1979 + Math.round(n);
  return <>
    <RBox s={[0.6, 0.4, 0.02]} p={[0, 0.16, -0.06]} r={0.004}>{M.wood({ base: [150, 104, 64] })}</RBox>
    <group position={[-0.06, 0.14, -0.04]} scale={1.3}>
      <RBox s={[0.16, 0.2, 0.01]} r={0.004}><meshStandardMaterial color="#f4efe4" /></RBox>
      <mesh position={[0, 0, 0.006]}><planeGeometry args={[0.15, 0.19]} /><meshStandardMaterial map={card("aug" + yr, 160, 200, ["AUGUST", String(yr)], 34, "#b8322a", "#f6f1e2")} /></mesh>
      {Array.from({ length: 5 }, (_, i) => { const u = ((n + i / 5) % 1); return n < 46.5 && <mesh key={i} position={[u * 0.3, u * 0.12, 0.012 + u * 0.1]} rotation={[u * 2, u * 3, u * 1.5]} scale={Math.max(0.001, 1 - u)}><planeGeometry args={[0.15, 0.19]} /><meshStandardMaterial color="#f6f1e2" side={THREE.DoubleSide} /></mesh>; })}
    </group>
    <group position={[0.17, 0.15, -0.02]} scale={1.7}><RBox s={[0.1, 0.07, 0.03]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(n / 10)} p={[-0.02, 0, 0.016]} r={0.024} w={0.032} /><DigitDrum v={n % 10} p={[0.02, 0, 0.016]} r={0.024} w={0.032} /></group>
  </>; }}</Scene3D>;

// ---- 22:37 · EL DE VINAGRE BLANCO: la botella de vinagre blanco cae con peso al lado de la caja amarilla y se le prende un brillo; el que se mandan las señoras ----
export const HNextVinegar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.06], el: [0.18, 0.14], r: [0.74, 0.64], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="IF YOU MISSED IT" title="THE WHITE VINEGAR ONE" col={AMB} /><Tag tt={tt} at={3.0} x={1450} y={860} txt="THE LADIES' FAVORITE" col={GRN} size={34} /></>}>{(tt) => { const k = phys(tt, 0.4, 7, 0.4), glow = eio(tt, 1.6, 2.4);
  return <>
    <CornBox p={[-0.1, 0, 0]} rot={[0, 0.45, 0]} s={1.3} />
    <group position={[0.1, (1 - cl(k)) * 0.4, 0.02]} rotation={[0, -0.45, 0]}>
      <mesh geometry={lg("vinb", [[0, 0], [0.04, 0], [0.042, 0.01], [0.042, 0.17], [0.02, 0.21], [0.014, 0.24], [0.014, 0.26]], 48)}>{M.glass({ col: "#dfe6dc", op: 0.25 })}</mesh>
      <mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.039, 0.039, 0.16, 40]} />{M.water({ col: "#d8d6c4", op: 0.35 })}</mesh>
      <mesh position={[0, 0.265, 0]}><cylinderGeometry args={[0.016, 0.016, 0.02, 24]} />{M.plastic({ col: "#b8322a" })}</mesh>
      <mesh position={[0, 0.1, 0.043]}><planeGeometry args={[0.06, 0.07]} /><meshStandardMaterial map={card("vin2", 140, 160, ["WHITE", "VINEGAR", "5%"], 28, "#2a1e12", "#f4ead2")} /></mesh>
    </group>
    <pointLight position={[0.08, 0.2, 0.15]} color="#ffe08a" intensity={0.04 + 0.04 * glow} distance={0.6} />
    <pointLight position={[-0.4, 0.05, 0.12]} color="#ffcf90" intensity={0.25 + 0.45 * glow} distance={1.0} />
    <pointLight position={[0.4, 0.05, 0.12]} color="#cfe0ff" intensity={0.2 + 0.3 * glow} distance={1.0} />
  </>; }}</Scene3D>;
