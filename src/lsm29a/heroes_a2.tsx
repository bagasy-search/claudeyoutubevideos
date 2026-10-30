// lsm29a · componentes únicos 7-12 (las hermanas Pruitt, la taza de la madre, la cocinera y la mañana hora por hora).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, Dots, FoldChair, Plate, Roll, Steam, Teacup, Turkey, checkTex, linenTex, paperTex } from "./tg";

const PI = Math.PI;

// ---- 6:10 · SALSA EN CUATRO REGAZOS: el mantel sale arrastrado de un tirón; la salsera vuelca y caen cuatro manchas en cuatro servilletas ----
export const HTablecloth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" warm={0.85}
  cam={{ at: [0.05, 0.62, 0.3], at1: [0.0, 0.5, 0.55], az: [Math.PI - 0.25, Math.PI - 0.1], el: [1.12, 1.18], r: [2.8, 2.6], fov: 32 }} over={(tt) => <Tag tt={tt} at={3.3} x={960} y={950} txt="GRAVY ON FOUR LAPS" col={AMB} size={40} />}>{(tt) => {
  const yank = eio(tt, 0.6, 1.5), tip = eio(tt, 0.85, 1.35);
  const LAPS = [[-0.72, 0.62], [-0.24, 0.62], [0.24, 0.62], [0.72, 0.62]];
  const cloth = checkTex("#b8463a");
  return <>
    {/* tablero de madera que queda al descubierto */}
    <RBox s={[1.7, 0.04, 0.9]} r={0.01} p={[0, 0.74, 0]}>{M.wood({ base: [120, 78, 44] })}</RBox>
    {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([x, z], i) => <mesh key={i} position={[x, 0.36, z]}><cylinderGeometry args={[0.025, 0.025, 0.72, 10]} />{M.wood({ base: [110, 70, 40] })}</mesh>)}
    {/* el mantel a cuadros: diez franjas que se arrugan en ondas mientras sale de un tirón */}
    {Array.from({ length: 10 }, (_, i) => { const x0 = -0.81 + i * 0.18, w = Math.sin(i * 1.7 + yank * 7) * yank * (1 - yank) * 4;
      return <mesh key={i} position={[x0 + yank * (1.8 - i * 0.07), 0.762 + 0.06 * w + 0.12 * Math.sin(PI * yank) * (i / 9), 0]} rotation={[-PI / 2 + 0.15 * w, 0.2 * w, 0]}><planeGeometry args={[0.19, 1.0 - 0.25 * yank * (i / 9)]} /><meshStandardMaterial map={cloth} roughness={0.85} side={THREE.DoubleSide} /></mesh>; })}
    {/* la salsera, grande y con salsa, vuelca */}
    <group position={[0.1 + 0.35 * yank, 0.82 + 0.12 * Math.sin(PI * tip) - 0.03 * tip, 0.12]} rotation={[1.6 * tip, 0, 0]} scale={1.0}>
      <mesh scale={[2.8, 1.3, 1.8]}><sphereGeometry args={[0.06, 28, 14, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.006, 0]} rotation={[-PI / 2, 0, 0]} scale={[2.6, 1.7, 1]}><circleGeometry args={[0.056, 24]} /><meshPhysicalMaterial color="#5a2e0e" roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0.2, 0.0, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.03, 0.08, 16, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[-0.18, 0.02, 0]}><torusGeometry args={[0.035, 0.009, 8, 20, PI]} />{M.porcelain()}</mesh>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.05, 0.06, 0.014, 24]} />{M.porcelain()}</mesh>
    </group>
    {/* el charco de salsa que corre por la madera hacia los regazos */}
    <mesh position={[0.45, 0.762, 0.3]} rotation={[-PI / 2, 0, 0.3]} scale={[0.5 + 1.2 * eio(tt, 1.1, 2.2), 0.4 + 2.2 * eio(tt, 1.1, 2.2), 1]} visible={tt > 1.1}><circleGeometry args={[0.08, 24]} /><meshPhysicalMaterial color="#4a2408" roughness={0.1} clearcoat={1} /></mesh>
    {/* chorro de salsa en el aire */}
    {Array.from({ length: 14 }, (_, j) => { const u = cl((tt - 1.1 - j * 0.04) / 0.8); return <mesh key={j} position={[0.45 - 0.9 * u * ((j % 4) / 3 - 0.5), lerp(0.85, 0.5, u * u), 0.2 + 0.42 * u]} visible={u > 0 && u < 1}><sphereGeometry args={[0.016, 10, 8]} /><meshPhysicalMaterial color="#5a3010" roughness={0.1} clearcoat={1} /></mesh>; })}
    {LAPS.map(([x, z], i) => { const a = 1.4 + i * 0.35, k = phys(tt, a, 8, 0.5); return <group key={i}>
      <FoldChair p={[x, 0, z]} ry={z > 0 ? PI : 0} />
      {/* la servilleta blanca en el regazo y su mancha que se expande */}
      <mesh position={[x, 0.475, z]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.22]} /><meshStandardMaterial map={linenTex()} color="#d8d2c6" roughness={1} /></mesh>
      <mesh position={[x + 0.02, 0.479, z]} rotation={[-PI / 2, 0, rn(i, 2) * 3]} scale={[Math.max(0.02, k) * 1.2, Math.max(0.02, k), 1]} visible={tt > a}><circleGeometry args={[0.1, 20]} /><meshStandardMaterial color="#4a2408" roughness={0.6} /></mesh>
      {[0, 1, 2].map((d) => <mesh key={d} position={[x + 0.1 * Math.cos(d * 2 + i), 0.479, z + 0.08 * Math.sin(d * 2 + i)]} rotation={[-PI / 2, 0, 0]} visible={tt > a + 0.1}><circleGeometry args={[0.018 * cl(k), 10]} /><meshStandardMaterial color="#4a2408" roughness={0.6} /></mesh>)}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 6:24 · TRES PIEDRAS LISAS: tres piedras de río se apilan una sobre otra; cada una trae lo que decidís antes de ir ----
const STONES0 = [{ txt: "WHAT I WON'T BRING UP", s: [0.17, 0.06, 0.13], c: "#6d7278" }, { txt: "WHO I'M KIND TO FIRST", s: [0.13, 0.05, 0.1], c: "#8a8378" }, { txt: "MY SOFT ANSWER", s: [0.09, 0.04, 0.075], c: "#b3aa9a" }];
const STONES = STONES0.map((x) => ({ ...x, s: [x.s[0], x.s[1], x.s[2]] }));
export const HSoftstone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-1, 1.8, 1.2]} warm={0.8}
  cam={{ at: [0, 0.13, 0], az: [-0.4, 0.35], el: [0.18, 0.22], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.0} x={1430} y={880} txt="DECIDE BEFORE YOU GO" col={AMB} size={38} />}>{(tt) => {
  let y = 0;
  return <>
    <mesh position={[0, 0.012, 0]} castShadow receiveShadow><cylinderGeometry args={[0.32, 0.33, 0.024, 6]} /><meshStandardMaterial color="#3e4246" roughness={0.75} /></mesh>
    {STONES.map((s, i) => { const a = 0.5 + i * 1.6, k = phys(tt, a, 7, 0.4), base = y + s.s[1] * 1.1; y += s.s[1] * 2.0;
      return tt > a - 0.05 && <mesh key={i} position={[0.004 * i, base + (1 - cl(k)) * 0.45, 0]} rotation={[0, i * 0.7 + (1 - cl(k)) * 0.6, 0.04 * (rn(i, 2) - 0.5)]} scale={s.s.map((v) => v * 2.2) as [number, number, number]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 40, 24]} /><meshPhysicalMaterial color={s.c} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.4} /></mesh>; })}
    {/* una línea de luz que baja sobre la torre cuando la última piedra se asienta */}
    <mesh position={[0, 0.007, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.15, 0.2, 48]} />{M.glow({ col: "#ffcf7a", op: 0.3 * eio(tt, 4.2, 5.0) })}</mesh>
  </>;
}}</Scene3D>;

// ---- 7:20 · LA TAZA DE MAMÁ: el repasador a cuadros se abre como un pétalo sobre la bandeja del hospital; aparece una taza con rositas ----
export const HTeacup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#2a1d14" warm={0.85}
  cam={{ at: [0.05, 0.06, 0.02], az: [0.3, -0.1], el: [0.62, 0.5], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const open = (i: number) => eio(tt, 0.6 + i * 0.25, 1.6 + i * 0.25), two = phys(tt, 3.6, 6, 0.55);
  return <>
    {/* bandeja beige del hospital */}
    <RBox s={[0.7, 0.025, 0.42]} r={0.01} p={[0, -0.012, 0]}>{M.plastic({ col: "#d9cdb4" })}</RBox>
    <mesh position={[-0.27, 0.035, -0.12]}><cylinderGeometry args={[0.028, 0.022, 0.07, 18]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.16]} /><meshStandardMaterial map={checkTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * PI / 2, 0]}><group position={[0, 0.003, 0.08]} rotation={[PI * 0.92 * (1 - open(i)), 0, 0]}>
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0, 0.08]}><planeGeometry args={[0.16, 0.16]} /><meshStandardMaterial map={checkTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh></group></group>)}
    <group scale={0.4 + 0.6 * eio(tt, 0.4, 1.4)}><Teacup p={[0, 0.003, 0]} ry={0.4} steam={eio(tt, 2.2, 3.0)} tt={tt} /></group>
    {/* la segunda taza que se acerca: las dos hermanas */}
    <group position={[lerp(0.5, 0.17, cl(two)), 0.003, 0.05]} visible={tt > 3.5}><Teacup ry={-0.5} steam={eio(tt, 4.2, 5.0)} tt={tt} /></group>
  </>;
}}</Scene3D>;

// ---- 8:27 · EL BANQUITO: el banquito de cocina junto al pasaplatos; llega un plato caliente con su vapor y se apoya ----
export const HStepstool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0.0, 0.8, -0.3], at1: [0.15, 0.62, -0.2], az: [0.75, 0.55], el: [0.26, 0.24], r: [2.6, 2.2], fov: 32 }} over={(tt) => <Tag tt={tt} at={3.4} x={1380} y={300} txt="HOT. ONE TIME." col={AMB} size={40} />}>{(tt) => {
  const st = phys(tt, 0.3, 6, 0.5), pl = eio(tt, 1.6, 2.8);
  return <>
    {/* el mostrador de acero del pasaplatos */}
    <RBox s={[1.0, 0.9, 0.45]} r={0.01} p={[-0.35, 0.45, -0.6]}>{M.wood({ base: [140, 92, 54] })}</RBox>
    <RBox s={[1.0, 0.03, 0.47]} r={0.008} p={[-0.35, 0.9, -0.6]}>{M.steel({ col: "#c9ced4" })}</RBox>
    {/* la ventanilla del pasaplatos: pared con el hueco iluminado */}
    <RBox s={[1.2, 0.08, 0.16]} r={0.008} p={[-0.35, 1.42, -0.76]}>{M.wood({ base: [120, 78, 44] })}</RBox>
    {[-1, 1].map((k) => <RBox key={k} s={[0.08, 0.56, 0.16]} r={0.008} p={[-0.35 + k * 0.56, 1.16, -0.76]}>{M.wood({ base: [120, 78, 44] })}</RBox>)}
    <RBox s={[1.2, 0.035, 0.26]} r={0.006} p={[-0.35, 0.93, -0.7]}>{M.steel({ col: "#c9ced4" })}</RBox>
    <mesh position={[-0.35, 1.16, -0.98]}><planeGeometry args={[1.04, 0.5]} /><meshStandardMaterial color="#3a2a1c" emissive="#ff9a4a" emissiveIntensity={0.35} roughness={0.9} /></mesh>
    {/* la lámpara de calor del pasaplatos */}
    <RBox s={[0.9, 0.05, 0.2]} r={0.01} p={[-0.35, 1.32, -0.62]}>{M.steel({ col: "#9aa0a6" })}</RBox>
    <mesh position={[-0.35, 1.294, -0.62]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.12]} />{M.glow({ col: "#ff8a3a", op: 0.85 })}</mesh>
    <mesh position={[-0.35, 0.917, -0.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.9, 0.35]} />{M.glow({ col: "#ff9a4a", op: 0.12 })}</mesh>
    {[-0.7, -0.45, -0.2].map((x, i) => <group key={i} position={[x, 0.9, -0.55]}><Plate r={0.1} /><mesh position={[0, 0.03, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color={["#efe7d2", "#b9763c", "#8e1f2a"][i]} roughness={0.5} /></mesh></group>)}
    {/* el banquito de cocina: asiento redondo de vinilo rojo, patas cromadas y el escalón que se despliega */}
    <group position={[0.45, (1 - cl(st)) * 0.4, 0.05]} rotation={[0, -0.3, 0]}>
      <mesh position={[0, 0.47, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.05, 40]} /><meshPhysicalMaterial color="#b3261e" roughness={0.35} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0.445, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.16, 0.008, 8, 40]} />{M.chrome()}</mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * PI / 2 + PI / 4) * 0.13, 0.22, Math.sin(i * PI / 2 + PI / 4) * 0.13]} rotation={[Math.sin(i * PI / 2 + PI / 4) * -0.12, 0, Math.cos(i * PI / 2 + PI / 4) * 0.12]}><cylinderGeometry args={[0.011, 0.011, 0.45, 10]} />{M.chrome()}</mesh>)}
      <mesh position={[0, 0.2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.135, 0.007, 8, 40]} />{M.chrome()}</mesh>
      {/* el plato caliente */}
      <group position={[lerp(-0.85, 0, cl(pl)) * 1, 0.495 + 0.42 * (1 - cl(pl)) + 0.08 * Math.sin(PI * cl(pl)), lerp(-0.6, 0, cl(pl))]} visible={tt > 1.5}><Plate r={0.1} />
        <mesh position={[-0.02, 0.028, 0]} scale={[1.3, 0.35, 1]}><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#efe7d2" roughness={0.6} /></mesh>
        <mesh position={[0.04, 0.022, 0.03]} scale={[1.6, 0.25, 0.9]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#c7c0b0" roughness={0.5} /></mesh>
        <Steam p={[0, 0.03, 0]} tt={tt} on={eio(tt, 2.0, 2.6)} n={14} w={0.06} hgt={0.24} /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 9:00 · LA COCINERA SE SIENTA PRIMERO: vista de arriba de la mesa larga; la silla del medio se ilumina y un plato llega deslizándose hasta ella ----
export const HCookseat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [-0.1, 0.6, 0.3], at1: [-0.22, 0.55, 0.5], az: [0.25, 0.1], el: [0.78, 0.62], r: [2.2, 1.5], fov: 32 }} over={(tt) => <Tag tt={tt} at={2.6} x={960} y={960} txt="THE MIDDLE, NOT THE END" col={AMB} size={38} />}>{(tt) => {
  const glow = eio(tt, 0.8, 1.6), slide = phys(tt, 1.8, 6, 0.7), pull = eio(tt, 0.6, 1.4);
  const xs = [-1.1, -0.66, -0.22, 0.22, 0.66, 1.1];
  return <>
    <group position={[0, 0.76, 0]}><RBox s={[2.6, 0.03, 0.8]} r={0.01} p={[0, -0.015, 0]}><meshStandardMaterial map={linenTex()} roughness={0.85} /></RBox></group>
    {xs.map((x) => [-1, 1].map((k) => { const mid = k === 1 && Math.abs(x + 0.22) < 0.01; return <group key={x + "" + k}>
      <FoldChair p={[x, 0, k * (0.62 + (mid ? 0.18 * pull : 0))]} ry={k > 0 ? PI : 0} col={mid ? "#c79a52" : "#9c8c72"} />
      {!mid && <group position={[x, 0.76, k * 0.24]}><Plate r={0.1} /></group>}
      {mid && <mesh position={[x, 0.8, k * 0.75]}><cylinderGeometry args={[0.08, 0.38, 1.6, 40, 1, true]} /><meshBasicMaterial color="#ffcf7a" transparent opacity={0.16 * glow} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>}
      {mid && [0].map((j) => <mesh key={j} position={[x, 0.02, k * 0.75]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.36 - j * 0.035, 40]} />{M.glow({ col: "#ffcf7a", op: (j === 0 ? 0.38 : 0.09) * glow })}</mesh>)}
    </group>; }))}
    {/* el plato que trae otra persona */}
    <group position={[lerp(-1.6, -0.22, cl(slide)) + 0.02 * (slide - cl(slide)), 0.76, 0.24]}><Plate r={0.1} /><mesh position={[0, 0.03, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color="#b9763c" roughness={0.5} /></mesh><Steam tt={tt} on={slide} n={8} /></group>
    <Turkey p={[0.66, 0.76, 0]} s={0.8} /><Roll p={[-0.66, 0.79, 0]} /><Roll p={[-0.6, 0.79, 0.05]} s={0.9} />
  </>;
}}</Scene3D>;

// ---- 9:47 · LA MAÑANA HORA POR HORA: el reloj rojo de la cocina avanza de 6 a 12:30 y en el estante aparece lo de cada hora ----
const HOURS = [{ h: 6, lbl: "6:00" }, { h: 7, lbl: "7:00" }, { h: 9, lbl: "9:00" }, { h: 10, lbl: "10:00" }, { h: 11, lbl: "11:00" }, { h: 12.5, lbl: "12:30" }];
const clockFace = () => tex.text("clk12", 256, 256, (g) => { g.fillStyle = "#f7f3ea"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#1e1e1e"; g.font = "700 34px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 1; i <= 12; i++) { const a = i / 12 * PI * 2 - PI / 2; g.fillText(String(i), 128 + Math.cos(a) * 98, 128 + Math.sin(a) * 98); } });
export const HMorningclock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="tile"
  cam={{ at: [-0.4, 0.44, -1.45], at1: [0.4, 0.44, -1.45], az: [-0.2, 0.2], el: [0.06, 0.08], r: [1.45, 1.38], fov: 30 }}
  over={(tt) => { const i = HOURS.filter((_, j) => tt > 0.6 + j * 1.05).length - 1; return i >= 0 ? <Tag key={i} tt={tt - (0.6 + i * 1.05)} at={0} x={230} y={990} txt={HOURS[i].lbl} col={AMB} size={44} /> : null; }}>{(tt) => {
  const hr = lerp(6, 12.5, eio(tt, 0.5, 6.9)), mn = (hr % 1) * 60;
  const items = [
    <><Turkey s={0.55} p={[-0.05, 0, 0]} /><Turkey s={0.55} p={[0.08, 0, 0.03]} /></>,
    <>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[(i - 2) * 0.03, 0.02, (rn(i, 2) - 0.5) * 0.04]} scale={[1.2, 0.9, 1]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#c9a46a" roughness={0.8} /></mesh>)}</>,
    <mesh rotation={[0, 0, PI / 2]} position={[0, 0.04, 0]}><cylinderGeometry args={[0.04, 0.04, 0.2, 24]} /><meshStandardMaterial map={linenTex()} color="#ffffff" roughness={0.8} /></mesh>,
    <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.1, 0.06, 0.003]} /><meshStandardMaterial map={paperTex("pcInez", ["Inez"])} roughness={0.8} /></mesh>,
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0.1]}><planeGeometry args={[0.14, 0.09]} /><meshStandardMaterial map={paperTex("idx", ["Lord, thank you", "for the food…"], { rule: true })} roughness={0.8} /></mesh>,
    <group><RBox s={[0.12, 0.2, 0.012]} r={0.004} p={[0, 0.1, 0]}>{M.wood({ base: [150, 100, 58], rx: 1 })}</RBox><mesh position={[0.04, 0.1, 0.008]}><sphereGeometry args={[0.007, 10, 8]} />{M.brass()}</mesh></group>,
  ];
  return <>
    {/* el reloj de pared */}
    <group position={[0, 0.62, -1.58]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05, 48]} />{M.plastic({ col: "#c4302a" })}</mesh>
      <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.175, 48]} /><meshStandardMaterial map={clockFace()} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.034]} rotation={[0, 0, -(hr / 12) * PI * 2]}><boxGeometry args={[0.012, 0.2, 0.004]} /><meshStandardMaterial color="#141414" /></mesh>
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, -(mn / 60) * PI * 2]}><boxGeometry args={[0.008, 0.29, 0.004]} /><meshStandardMaterial color="#141414" /></mesh>
      <mesh position={[0, 0, 0.038]}><sphereGeometry args={[0.012, 12, 10]} />{M.brass()}</mesh>
    </group>
    {/* el estante con lo de cada hora */}
    <RBox s={[1.5, 0.03, 0.3]} r={0.006} p={[0, 0.16, -1.42]}>{M.wood({ base: [128, 82, 44] })}</RBox>
    {items.map((it, i) => { const a = 0.6 + i * 1.05, k = phys(tt, a, 7, 0.45); return tt > a - 0.05 && <group key={i} position={[-0.65 + i * 0.26, 0.177 + (1 - cl(k)) * 0.25, -1.36]} scale={Math.max(0.001, 1.2 + 0.6 * cl(k))}>{it}</group>; })}
  </>;
}}</Scene3D>;
