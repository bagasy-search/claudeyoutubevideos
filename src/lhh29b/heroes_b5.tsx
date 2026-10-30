// lhh29b · componentes únicos 33-40 (kit h3d): el vitral con el limón, los tres limones del sábado, las capas de la cáscara,
// la botellita de jugo desde Carter, los 40 dólares de aerosoles, la botella mitad y mitad, los 35 frascos del alféizar y el rollo de aluminio del próximo.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Lemon, LemonHalf, Spray, QuartJar, lathe, rindTex, SERIF } from "./lemonkit";

const PI = Math.PI;

// ---- 17:59 · LOS LIMONES DEL SEÑOR: un vitral en arco se enciende paño por paño; en el centro, un limón de vidrio amarillo; rayos de luz caen sobre el altar ----
export const HLordsLemons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.22, 0.1], az: [-0.12, 0.12], el: [0.2, 0.3], r: [1.0, 0.86], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE LORD'S OWN LEMONS" col={AMB} /></>}>{(tt, u) => {
  const cols = ["#2f5fb8", "#b3241c", "#2f8a4a", "#7a3fa6", "#2f5fb8", "#d9822a", "#2f8a4a", "#b3241c"], sun = eio(u, 0.45, 0.6);
  const seed = tex.text("glassseed", 256, 256, (g) => { g.fillStyle = "#d8d8d8"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(255,255,255,${0.25 * rn(i, 2)})`; g.lineWidth = 6 + 10 * rn(i, 3); g.beginPath(); g.moveTo(0, rn(i, 4) * 256); g.bezierCurveTo(90, rn(i, 5) * 256, 170, rn(i, 6) * 256, 256, rn(i, 7) * 256); g.stroke(); }
    for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,255,${0.5 * rn(i, 8)})`; g.beginPath(); g.arc(rn(i, 9) * 256, rn(i, 10) * 256, 1 + 3 * rn(i, 11), 0, 6.3); g.fill(); g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.arc(rn(i, 12) * 256, rn(i, 13) * 256, 6 + 14 * rn(i, 14), 0, 6.3); g.fill(); } });
  return <group position={[0, 0.08, -0.1]}>
    {Array.from({ length: 16 }, (_, i) => { const c = i % 4, r = Math.floor(i / 4), k = cl((u - 0.04 - i * 0.025) / 0.08), ctr = (c === 1 || c === 2) && (r === 1 || r === 2);
      return !ctr && <mesh key={i} position={[-0.165 + c * 0.11, 0.06 + r * 0.11, 0]}><planeGeometry args={[0.1, 0.1]} /><meshBasicMaterial color={cols[(i * 3) % 8]} map={seed} transparent opacity={0.15 + 0.8 * k} toneMapped={false} /></mesh>; })}
    {Array.from({ length: 16 }, (_, i) => { const c = i % 4, r = Math.floor(i / 4), ctr = (c === 1 || c === 2) && (r === 1 || r === 2); return !ctr && <mesh key={"pool" + i} position={[(-0.165 + c * 0.11) * 1.3, -0.075, 0.18 + (3 - r) * 0.09]} rotation={[-PI / 2, 0, 0]} scale={[1.3, 1, 1]}><circleGeometry args={[0.05, 24]} />{M.glow({ col: cols[(i * 3) % 8], op: 0.55 * sun })}</mesh>; })}
    <mesh position={[0, -0.074, 0.31]} rotation={[-PI / 2, 0, 0]} scale={[1.4, 1, 1]}><circleGeometry args={[0.09, 32]} />{M.glow({ col: "#ffd83a", op: 0.4 * sun })}</mesh>
    <mesh position={[0, 0.5, 0]}><circleGeometry args={[0.22, 48, 0, PI]} /><meshBasicMaterial color="#d9a84a" transparent opacity={0.2 + 0.6 * sun} toneMapped={false} /></mesh>
    {[[-0.22, 0.25, 0.012, 0.5], [0.22, 0.25, 0.012, 0.5], [0, 0.005, 0.46, 0.012], [0, 0.17, 0.46, 0.006], [0, 0.28, 0.46, 0.006], [0, 0.39, 0.46, 0.006], [-0.055, 0.23, 0.006, 0.45], [0.055, 0.23, 0.006, 0.45]].map((b, i) =>
      <RBox key={i} s={[b[2], b[3], 0.012]} p={[b[0], b[1], 0.004]} r={0.002}><meshStandardMaterial color="#1a1612" roughness={0.6} /></RBox>)}
    <mesh position={[0, 0.225, 0.01]} scale={[1.3 * Math.max(0.001, eio(u, 0.3, 0.45)), Math.max(0.001, eio(u, 0.3, 0.45)), 0.4]}><sphereGeometry args={[0.08, 40, 24]} /><meshBasicMaterial color="#ffd83a" map={seed} toneMapped={false} transparent opacity={0.95} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.12 + i * 0.05, 0.05, 0.25]} rotation={[-0.9, 0, (i - 2.5) * 0.06]}><planeGeometry args={[0.035, 0.7]} />{M.glow({ col: "#ffe9a0", op: 0.08 * sun })}</mesh>)}
  </group>;
}}</Scene3D>;

// ---- 18:18 · TRES LIMONES, UN SÁBADO: tres limones en fila sobre la tabla; cada uno se enciende con su trabajo: jugo, microondas y canillas, tabla y rallador ----
const SAT = [["LEMON 1", "JUICE FOR THE WEEK"], ["LEMON 2", "MICROWAVE · FAUCETS"], ["LEMON 3", "BOARD · GRATER"]];
export const HSatLemons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="tile"
  cam={{ at: [0, 0.05, 0], az: [-0.2, 0.15], el: [0.5, 0.42], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SATURDAY, THREE LEMONS" col={AMB} />
    {SAT.length < 0 && null}</>}>{(tt) => {
  const lit = [0, 1, 2].map((i) => eio(tt, 1.2 + i * 1.4, 1.5 + i * 1.4) * (i < 2 ? 1 - eio(tt, 2.4 + i * 1.4, 2.7 + i * 1.4) : 1));
  return <>
    <RBox s={[0.6, 0.03, 0.2]} p={[0, 0.015, 0]} r={0.01}>{M.wood({ rx: 1, ry: 1, base: [196, 150, 98] })}</RBox>
    {[0, 1, 2].map((i) => { const k = phys(tt, 0.2 + i * 0.3, 7, 0.45);
      return <group key={i} position={[-0.2 + i * 0.2, 0.03, 0]}>
        {k > 0 && <Lemon p={[0, 0.04 + (1 - cl(k)) * 0.3, 0]} rot={[0, 0.5 + i, 0]} s={1.1 * (1 + 0.12 * lit[i] * Math.abs(Math.sin(tt * 3)))} />}
        <pointLight position={[0, 0.16, 0.06]} color="#ffd36a" intensity={0.5 * lit[i]} distance={0.35} />
        <mesh position={[0, 0.003, 0.085]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.035]} /><meshBasicMaterial map={tex.text("sat" + i, 256, 76, (g) => { g.fillStyle = "#f1ead9"; g.fillRect(0, 0, 256, 76); g.fillStyle = "#3b2512"; g.font = "bold 44px " + SERIF; g.fillText(SAT[i][0], 30, 56); })} toneMapped={false} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 18:55 · SÓLO LO AMARILLO: una cuña de limón en corte muestra sus capas; el rallador pasa por la cáscara y saltan rulos amarillos; la capa blanca se marca «amarga» ----
export const HPeelLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" lamp={[0.2, 0.4, 0.4]}
  cam={{ at: [0, 0.08, 0], az: [0.25, -0.15], el: [0.25, 0.18], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ONLY THE YELLOW" col={AMB} />
    
    </>}>{(tt) => {
  const sw = Math.sin(Math.max(0, tt - 0.8) * 3.2), wh = cl((tt - 3.2) * 2);
  return <group position={[0, 0.08, 0]} scale={2.2}>
    <mesh><cylinderGeometry args={[0.04, 0.04, 0.05, 40, 1, false, 0, PI * 1.5]} /><meshPhysicalMaterial map={rindTex()} roughness={0.45} clearcoat={0.5} /></mesh>
    <mesh><cylinderGeometry args={[0.037, 0.037, 0.0502, 40, 1, false, 0, PI * 1.5]} /><meshStandardMaterial color="#fbf4dc" roughness={0.8} side={THREE.BackSide} /></mesh>
    {[0, PI * 1.5].map((a, i) => <group key={i} rotation={[0, a, 0]}>
      <mesh position={[0, 0, 0.0185]} rotation={[0, i ? -PI / 2 : PI / 2, 0]}><planeGeometry args={[0.001, 0.05]} /><meshStandardMaterial color="#f2cf2c" /></mesh>
      <mesh position={[0, 0, 0.0001]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.08, 0.05]} /><meshStandardMaterial color="#fbf6e2" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, 0.0002]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[0.064, 0.044]} /><meshPhysicalMaterial color="#f7e06a" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh></group>)}
    {wh > 0 && <mesh position={[0, 0.0255, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.032, 0.0372, 48, 1, PI * 0.5, PI * 1.5]} />{M.glow({ col: "#ff3b2a", op: 0.8 * wh })}</mesh>}
    <group position={[0.05, 0.01 + 0.015 * sw, 0.025]} rotation={[0, -0.4, 0.2]}>
      <RBox s={[0.005, 0.07, 0.022]} r={0.002}>{M.steel({})}</RBox>
      <RBox s={[0.008, 0.05, 0.016]} p={[0, -0.06, 0]} r={0.004}><meshStandardMaterial color="#1b1b1b" roughness={0.5} /></RBox></group>
    {Array.from({ length: 14 }, (_, i) => { const d = cl((tt - 1.0 - i * 0.18) / 1.2); if (d <= 0 || d >= 1) return null;
      return <mesh key={i} position={[0.05 + d * 0.05, 0.01 - d * 0.06 + 0.02 * Math.sin(d * 5), 0.03 + (rn(i, 2) - 0.5) * 0.03]} rotation={[d * 6, i, d * 4]}><torusGeometry args={[0.004, 0.0009, 4, 12, PI * 1.4]} /><meshStandardMaterial color="#f5d331" roughness={0.5} /></mesh>; })}
  </group>;
}}</Scene3D>;

// ---- 19:27 · DESDE CARTER: la botellita plástica de jugo de limón en el estante junta polvo mientras el almanaque corre de 1977 a hoy ----
export const HCarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0.2, 0.4, 0.4]}
  cam={{ at: [0, 0.08, 0], az: [0.3, 0.1], el: [0.2, 0.15], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NOT SINCE CARTER" col={AMB} />
    </>}>{(tt) => {
  const dust = eio(tt, 0.8, 4.8), yr = Math.round(lerp(1977, 2026, dust));
  const cal = tex.text("cal" + Math.round(dust * 12), 256, 300, (g) => { g.fillStyle = "#fbf7ec"; g.fillRect(0, 0, 256, 300); g.fillStyle = "#b3241c"; g.fillRect(0, 0, 256, 70); g.fillStyle = "#fff"; g.font = "bold 44px " + SERIF; g.fillText("YEAR", 70, 52);
    g.fillStyle = "#1b1b1b"; g.font = "bold 92px " + SERIF; g.fillText(String(yr - (yr % 4)), 22, 200); });
  return <>
    <RBox s={[0.5, 0.02, 0.16]} p={[0, 0.0, 0]} r={0.004}>{M.wood({ base: [140, 100, 64] })}</RBox>
    <group position={[-0.08, 0.01, 0]} rotation={[0, 0.5, 0]}>
      <mesh scale={[1.35, 1.05, 1]} position={[0, 0.045, 0]}><sphereGeometry args={[0.04, 32, 20]} /><meshPhysicalMaterial color="#f3d23a" roughness={0.35} clearcoat={0.6} transparent opacity={0.92} /></mesh>
      <mesh position={[0.058, 0.045, 0]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.006, 0.012, 0.025, 16]} /><meshStandardMaterial color="#2f8a3a" roughness={0.4} /></mesh>
      <mesh position={[0, 0.087, 0]} scale={[1.3, 0.2, 1]}><sphereGeometry args={[0.036, 24, 12, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#cfc7b6" roughness={1} transparent opacity={0.85 * dust} /></mesh></group>
    {Array.from({ length: 24 }, (_, i) => { const d = ((tt * 0.12 + rn(i, 2)) % 1); return <mesh key={i} position={[-0.25 + rn(i, 3) * 0.5, 0.3 - d * 0.3, (rn(i, 4) - 0.5) * 0.2]}><sphereGeometry args={[0.0018, 6, 4]} />{M.glow({ col: "#fff3d6", op: 0.5 * dust })}</mesh>; })}
    <mesh position={[0.14, 0.12, -0.07]} rotation={[0, -0.25, 0]}><planeGeometry args={[0.12, 0.14]} /><meshStandardMaterial map={cal} roughness={0.9} /></mesh>
  </>;
}}</Scene3D>;

// ---- 19:44 · CUARENTA DÓLARES AL AÑO: tres aerosoles (cocina, baño, vidrios) y al lado de cada uno sube su pila de monedas hasta sumar 40 dólares ----
export const HSpray40: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0.02, 0.15, 0], az: [-0.25, 0.15], el: [0.24, 0.18], r: [0.95, 0.82], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ALMOST $40 A YEAR" col={RED} />
    </>}>{(tt, u) => {
  const f = eio(u, 0.08, 0.7), cols = ["#e2523a", "#27b5b0", "#3f8fd8"], val = Math.round(40 * f), dr = u < 0.5 ? 0 : 1 - Math.exp(-(u - 0.5) * 18) * Math.cos((u - 0.5) * 34);
  const sign = tex.text("s40_" + val, 512, 256, (g) => { g.fillStyle = "#b3241c"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#f6e7c8"; g.lineWidth = 10; g.strokeRect(14, 14, 484, 228); g.fillStyle = "#f6e7c8"; g.font = "bold 150px " + SERIF; const s = "$" + val; g.fillText(s, 256 - g.measureText(s).width / 2, 185); });
  return <>
    {cols.map((c, i) => { const n = Math.round(14 * cl(f * 3 - i)), k = phys(tt, 0.2 + i * 0.2, 7, 0.45);
      return <group key={i} position={[-0.22 + i * 0.22, 0, 0]}>
        {k > 0 && <Spray col={c} p={[-0.04, (1 - cl(k)) * 0.3, 0]} rot={[0, 0.6, 0]} />}
        {Array.from({ length: n }, (_, j) => <mesh key={j} position={[0.05 + 0.002 * Math.sin(j), 0.003 + j * 0.0045, 0.02]}><cylinderGeometry args={[0.018, 0.018, 0.004, 28]} />{M.brass({ col: j % 2 ? "#d8d8d2" : "#d9c27a" })}</mesh>)}
      </group>; })}
    <group position={[0, 0.62 - 0.36 * dr, 0.04]} rotation={[0, 0, 0.08 * Math.sin(u * 20) * (1 - eio(u, 0.7, 1))]}>
      {[-0.11, 0.11].map((x, i) => <mesh key={i} position={[x, 0.2, 0]}><cylinderGeometry args={[0.0012, 0.0012, 0.32, 6]} /><meshStandardMaterial color="#e8e2d2" /></mesh>)}
      <RBox s={[0.3, 0.15, 0.012]} r={0.008}><meshStandardMaterial color="#7a1610" roughness={0.6} /></RBox>
      <mesh position={[0, 0, 0.0065]}><planeGeometry args={[0.29, 0.145]} /><meshStandardMaterial map={sign} roughness={0.5} /></mesh></group>
    <pointLight position={[0, 0.3, 0.3]} intensity={0.8 * cl(dr)} distance={0.8} color="#ffd9a0" />
  </>;
}}</Scene3D>;

// ---- 20:14 · MITAD Y MITAD: una botella de aerosol transparente se llena: abajo el vinagre de limón amarillo, arriba el agua; la raya del medio marca ½ ----
export const HHalfHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.2, 0.4, 0.4]}
  cam={{ at: [0, 0.12, 0], az: [0.2, -0.15], el: [0.12, 0.08], r: [0.55, 0.46], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HALF AND HALF" col={AMB} />
    
    
    </>}>{(tt, u) => {
  const a = eio(u, 0.06, 0.42) * 0.5, b = eio(u, 0.5, 0.88) * 0.5, ar = u < 0.4 ? 0 : 1 - Math.exp(-(u - 0.4) * 20) * Math.cos((u - 0.4) * 36);
  return <>
    <Spray clear col="#f0d24a" fill={a} fill2={b} c2="#cfe9f7" s={1.7} />
    <mesh position={[0, 0.005 + 0.125 * 0.5 * 1.7, 0.062]}><boxGeometry args={[0.13, 0.002, 0.001]} />{M.glow({ col: "#ffffff", op: cl((u - 0.1) * 5) })}</mesh>
    {ar > 0 && <group position={[0.1 + 0.25 * (1 - cl(ar)) + 0.01 * Math.sin(u * 30), 0.005 + 0.125 * 0.5 * 1.7, 0.06]} rotation={[0, 0, PI / 2]} scale={Math.max(0.001, ar)}>
      <mesh position={[0, 0.015, 0]}><coneGeometry args={[0.016, 0.03, 24]} /><meshPhysicalMaterial color="#d8322a" roughness={0.3} clearcoat={0.8} /></mesh>
      <mesh position={[0, -0.025, 0]}><cylinderGeometry args={[0.006, 0.006, 0.05, 16]} /><meshPhysicalMaterial color="#d8322a" roughness={0.3} clearcoat={0.8} /></mesh></group>}
    {a > 0 && a < 0.5 && <mesh position={[0.0, 0.33, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 8]} /><meshPhysicalMaterial color="#f0d24a" transparent opacity={0.8} /></mesh>}
    {b > 0 && b < 0.5 && <mesh position={[0.0, 0.33, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 8]} />{M.water({ op: 0.6, col: "#cfe9f7" })}</mesh>}
    <QuartJar p={[0.18, 0, -0.05]} peel={0.3} liq={0.5} s={0.9} />
  </>;
}}</Scene3D>;

// ---- 21:03 · 35 AÑOS DE FRASCOS: el alféizar con el frasco de cáscaras; atrás, en fila hacia el fondo, aparecen uno por uno los frascos de cada año desde 1991 ----
export const HJars35: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#cfe3ef"
  cam={{ at: [0, 0.1, -0.4], az: [-0.55, -0.4], el: [0.18, 0.14], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="35 YEARS ON THE SILL" col={AMB} />
    </>}>{(tt, u) => {
  const nf = eio(u, 0.05, 0.85) * 35, n = Math.min(35, Math.ceil(nf));
  const yl = (y: number) => tex.text("yl" + y, 128, 64, (g) => { g.fillStyle = "#f6efdc"; g.fillRect(0, 0, 128, 64); g.strokeStyle = "#7a5a2a"; g.lineWidth = 4; g.strokeRect(2, 2, 124, 60); g.fillStyle = "#3a2608"; g.font = "bold 40px " + SERIF; g.fillText(String(y), 14, 46); });
  return <>
    <RBox s={[0.2, 0.025, 2.2]} p={[0, -0.0125, -0.95]} r={0.006}>{M.porcelain({ col: "#f2efe6" })}</RBox>
    <QuartJar p={[0, 0, 0.08]} s={1.0} peel={0.8} liq={0.85} />
    {Array.from({ length: n }, (_, i) => { const k = cl(nf - i); return <QuartJar key={i} p={[0, 0, -0.06 - i * 0.055]} s={Math.max(0.001, 0.8 * k)} peel={0.6} liq={0.7} op={0.55} />; })}
    {Array.from({ length: 4 }, (_, j) => { const i = j * 10, y = 1991 + i, k = cl(nf - i); return k > 0 && <mesh key={"y" + j} position={[0.11, 0.2, -0.06 - i * 0.055]} rotation={[0, -0.55, 0]} scale={k}><planeGeometry args={[0.2, 0.1]} /><meshStandardMaterial map={yl(Math.min(2026, y))} roughness={0.8} /></mesh>; })}
    <group position={[0, 0.25, -2.1]}>
      <mesh><planeGeometry args={[0.7, 0.55]} />{M.glow({ col: "#ffe6b0", op: 0.6 })}</mesh>
      {[[0, 0.28, 0.76, 0.03], [0, -0.28, 0.76, 0.03], [-0.36, 0, 0.03, 0.58], [0.36, 0, 0.03, 0.58], [0, 0, 0.02, 0.55], [0, 0, 0.7, 0.02]].map((b, i) => <RBox key={i} s={[b[2], b[3], 0.03]} p={[b[0], b[1], 0.01]} r={0.004}>{M.wood({ base: [230, 225, 214] })}</RBox>)}</group>
    <pointLight position={[0, 0.3, -1.6]} intensity={1.2} distance={2.5} color="#fff2d8" />
  </>;
}}</Scene3D>;

// ---- 22:40 · PRÓXIMO: PAPEL DE ALUMINIO: el rollo sale de su caja, el papel se desenrolla arrugado y una tijera vieja lo corta de un tijeretazo ----
export const HNextFoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0.2, 0.4, 0.4]}
  cam={{ at: [0, 0.04, 0.02], az: [0.35, 0.1], el: [0.5, 0.42], r: [0.7, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEXT TIME · ALUMINUM FOIL" col={ICE} />
    </>}>{(tt, u) => {
  const un = eio(u, 0.05, 0.38), cut = eio(u, 0.5, 0.58), sp = cl((u - 0.57) / 0.18), go = eio(u, 0.62, 0.95);
  const crinkle = tex.text("foilc", 256, 256, (g) => { g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(${rn(i, 2) > 0.5 ? 255 : 0},${rn(i, 2) > 0.5 ? 255 : 0},${rn(i, 2) > 0.5 ? 255 : 0},.35)`; g.lineWidth = 1 + 2 * rn(i, 3); g.beginPath(); g.moveTo(rn(i, 4) * 256, rn(i, 5) * 256); g.lineTo(rn(i, 6) * 256, rn(i, 7) * 256); g.stroke(); } });
  return <>
    <RBox s={[0.36, 0.05, 0.06]} p={[0, 0.025, -0.12]} r={0.004}><meshStandardMaterial map={tex.text("foilbox", 256, 64, (g) => { g.fillStyle = "#2a5db0"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#e8eef8"; g.fillRect(0, 26, 256, 12); })} roughness={0.7} /></RBox>
    <mesh position={[0, 0.03, -0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.33, 32]} /><meshStandardMaterial color="#d8dde2" metalness={1} roughness={0.25} /></mesh>
    <mesh position={[0, 0.003, -0.1 + 0.15 * un]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.33, 0.3 * un + 0.001, 12, 12]} /><meshStandardMaterial color="#e3e7ea" metalness={1} roughness={0.3} bumpMap={crinkle} bumpScale={1.5} /></mesh>
    {u > 0.38 && <group position={[0.12 - 0.12 * eio(u, 0.6, 0.9), 0.02 + 0.15 * (1 - eio(u, 0.38, 0.46)), 0.1]} rotation={[-PI / 2, 0, 0.3 + PI / 2 * eio(u, 0.4, 0.48)]} scale={3.2}>
      {[1, -1].map((s) => <group key={s} rotation={[0, 0, s * (0.35 - 0.33 * cut)]}>
        <RBox s={[0.012, 0.13, 0.004]} p={[0, 0.06, 0]} r={0.002}>{M.chrome({})}</RBox>
        <mesh position={[0, -0.04, 0]}><torusGeometry args={[0.012, 0.0035, 10, 24]} /><meshStandardMaterial color="#8a1f1f" roughness={0.5} /></mesh></group>)}</group>}
    {sp > 0 && sp < 1 && Array.from({ length: 14 }, (_, i) => { const a = i / 14 * 6.3; return <mesh key={i} position={[0.06 + Math.cos(a) * 0.08 * sp, 0.03 + 0.04 * Math.sin(PI * sp) * rn(i, 3), 0.1 + Math.sin(a) * 0.08 * sp]} scale={0.006 * (1 - sp) + 0.0001}><octahedronGeometry args={[1, 0]} />{M.glow({ col: "#ffffff", op: 0.95 })}</mesh>; })}
    {sp > 0 && sp < 1 && <pointLight position={[0.06, 0.08, 0.1]} intensity={1.6 * Math.sin(PI * sp)} distance={0.5} color="#e8f2ff" />}
    {cut > 0.95 && <group position={[0, 0.004 + 0.05 * go, 0.12 + 0.12 * go]} rotation={[-PI / 2 + 0.9 * go, 0, 0.2 * go]}><mesh><planeGeometry args={[0.33, 0.07, 12, 4]} /><meshStandardMaterial color="#9aa0a5" metalness={0.75} roughness={0.55} bumpMap={crinkle} bumpScale={1.5} side={THREE.DoubleSide} /></mesh></group>}
  </>;
}}</Scene3D>;
