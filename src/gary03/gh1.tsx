// gary03 · componentes únicos 1/4 (min 0-7). Cada uno es UN objeto que hace la idea sin leer; el texto va sobre la pieza.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tubeG } from "./h3d";
import { Fridge, PBox, PI, Plug, Thermo, Txt3, WattMeter, cl, eio, lerp, phys, pop, roll } from "./gk";

// chispa corta: rayitos amarillos que salen de un punto y se apagan (k 0..1); la luz queda montada siempre
export const Spark: React.FC<{ p: [number, number, number]; k: number; s?: number }> = ({ p, k, s = 1 }) => {
  const on = k > 0 && k < 1 ? 1 : 0;
  return <group position={p} scale={s}>
    {on ? Array.from({ length: 9 }, (_, i) => { const a = i * 2.4, l = 0.03 + 0.05 * Math.sin(k * PI) * (0.6 + 0.4 * ((i * 7) % 3) / 2);
      return <mesh key={i} position={[Math.cos(a) * l / 2, Math.sin(a) * l / 2 + 0.01, Math.sin(a * 1.7) * 0.01]} rotation={[0, 0, a]}><boxGeometry args={[l, 0.004, 0.004]} />{M.glow({ col: i % 2 ? "#fff3a0" : "#ffb02a", op: 1 - k })}</mesh>; }) : null}
    <pointLight intensity={2.5 * (1 - cl(k)) * on} distance={0.6} color="#ffcf6a" />
  </group>;
};

// 0:19 · OVERLOAD: el compresor de atrás arranca con una sacudida, el cable se pone rojo, el aro de vatios cruza la raya y la caja se apaga
export const HOverload: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="tile" bg="#0d1014" warm={1.1}
  over={(tt) => <AbsoluteFill style={{ pointerEvents: "none" }}><AbsoluteFill style={{ background: "#ff2a1a", opacity: 0.4 * cl(1 - Math.abs(tt - 3.5) / 0.05) }} /></AbsoluteFill>}
  cam={{ at: [-0.08, 0.3, 0], at1: [0.0, 0.3, 0], az: [-0.62, -0.38], el: [0.26, 0.2], r: [1.8, 1.6], fov: 32 }}>{(tt) => {
  const w = roll(tt, 1.0, 3.0, 0, 1850), over = tt > 3.05, dead = cl((tt - 3.6) / 0.25);
  const kick = tt > 0.9 && tt < 3.6 ? Math.sin(tt * 80) * 0.004 * (1 - cl((tt - 1.3) / 2)) + (tt < 1.15 ? 0.012 * Math.sin((tt - 0.9) * 25) : 0) : 0;
  const ring = cl(w / 1850) * 1.62 * PI, hot = cl((w - 600) / 1200);
  return <>
    <group position={[kick, 0, 0]}>
      <Fridge p={[-0.5, 0, -0.3]} r={[0, 0.5, 0]} lit={tt > 0.6 ? 1 - dead : 0} door={0.45 * eio(tt, 0.2, 0.9)} />
      {/* compresor negro abajo atrás de la heladera: se ve vibrar */}
      {/* rejilla del compresor que se pone naranja */}
    </group>
    <group position={[-0.2 + (tt > 1.0 && tt < 3.6 ? 0.008 * Math.sin(tt * 2 * PI * 6) * (0.4 + hot) : 0), 0, 0.02]} rotation={[0, 0.3, 0]} scale={1.25}>
      <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.1, 0.1, 0.01, 32]} />{M.steel({ col: "#55585c" })}</mesh>
      <mesh position={[0, 0.085, 0]} castShadow><capsuleGeometry args={[0.065, 0.05, 12, 32]} /><meshStandardMaterial color="#2a2c30" metalness={0.5} roughness={0.4} emissive="#ff4a10" emissiveIntensity={0.5 * hot * (1 - dead)} /></mesh>
      {[0, 1].map((i) => <mesh key={"ct" + i} geometry={tubeG("ovt" + i, [[-0.03 + i * 0.03, 0.15, 0], [-0.08 + i * 0.02, 0.2, -0.05], [-0.2, 0.18 - i * 0.04, -0.15]], 0.007, 40, 8)}><meshStandardMaterial color="#b8733a" metalness={0.9} roughness={0.3} emissive="#ff5a1a" emissiveIntensity={0.6 * hot * (1 - dead)} /></mesh>)}
      {/* ventilador que gira al lado del compresor */}
      <group position={[0.11, 0.08, 0.02]} rotation={[0, PI / 2, 0]}>
        <mesh><torusGeometry args={[0.055, 0.006, 8, 32]} />{M.matte({ col: "#1b1c1e" })}</mesh>
        <group rotation={[0, 0, tt > 1.0 && dead < 0.5 ? (tt - 1.0) * 22 : 0]}>{[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[0, 0.4, i * PI / 2]} position={[0, 0, 0]}><boxGeometry args={[0.012, 0.1, 0.003]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}</group>
      </group>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={"cg" + i} position={[-0.04 + i * 0.02, 0.085, 0.07]}><boxGeometry args={[0.008, 0.08, 0.006]} /><meshStandardMaterial color="#2a2c30" emissive="#ff6a20" emissiveIntensity={1.2 * hot * (1 - dead)} /></mesh>)}
    </group>
    {/* chispas de corriente que corren por el cable hacia la caja, más rápidas cuanto más tira */}
    {[0, 1, 2].map((i) => { const u = (tt * (0.8 + 1.6 * hot) + i / 3) % 1; return <mesh key={"cs" + i} position={[lerp(-0.4, 0.13, u), 0.05 + 0.04 * Math.sin(PI * u), lerp(-0.3, 0.18, u)]} scale={tt > 1.0 && dead < 0.3 ? 1 : 0.001}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: hot > 0.5 ? "#ff6a3a" : "#ffe08a" })}</mesh>; })}
    <pointLight position={[0.2, 0.6, 0.4]} intensity={0.9 * dead} distance={2} color="#2a4a9a" />
    <group position={[0.24, 0, 0.05]} rotation={[0, -0.35, 0]} scale={1.36}>
      <PBox w={0.44} h={0.3} d={0.28} scr={over ? (dead > 0.5 ? "" : "OVERLOAD") : `${w} W`} scrCol={over ? "#ff3b2a" : "#4dff9a"} on={over ? (Math.floor(tt * 8) % 2 ? 1 : 0.2) * (1 - dead) : 1} />
      {/* aro grande de vatios pegado detrás de la caja: verde → rojo al pasar la raya blanca de 1000 W; al apagarse queda gris */}
      <group position={[0, 0.36, -0.16]} scale={w > 1000 && dead < 0.5 ? 1 + 0.06 * Math.abs(Math.sin(tt * 9)) : 1}>
        <mesh rotation={[0, 0, PI * 1.31]}><torusGeometry args={[0.17, 0.012, 12, 90, 1.62 * PI]} /><meshStandardMaterial color="#3a3d42" /></mesh>
        <mesh rotation={[0, 0, PI * 1.31 + 1.62 * PI - Math.max(0.001, ring)]}><torusGeometry args={[0.17, 0.02, 12, 90, Math.max(0.001, ring)]} />{M.glow({ col: dead > 0.5 ? "#3a3d42" : w > 1000 ? "#ff4a3a" : "#6fe39a" })}</mesh>
        <mesh position={[Math.cos(PI * 1.31 + 1.62 * PI * (1 - 1000 / 1850)) * 0.17, Math.sin(PI * 1.31 + 1.62 * PI * (1 - 1000 / 1850)) * 0.17, 0.01]} rotation={[0, 0, PI * 1.31 + 1.62 * PI * (1 - 1000 / 1850)]}><boxGeometry args={[0.07, 0.008, 0.01]} />{M.glow({ col: "#ffffff" })}</mesh>
        <Txt3 txt={over ? "OVERLOAD" : `${w} W`} w={0.3} h={0.09} col={over ? "#ff5a4a" : "#f7f4ee"} glow op={1 - 0.25 * dead} p={[0, 0, 0.01]} />
      </group>
    </group>
    {/* el cable se pone al rojo a medida que tira; chispa en la caja cuando corta */}
    <Plug p={[0.13, 0.09, 0.18]} to={[-0.4, 0.05, -0.3]} r={[0, -0.35, 0]} col={hot > 0.6 && dead < 0.5 ? "#7a1c10" : "#1c1d20"} />
    <Spark p={[0.12, 0.12, 0.2]} k={(tt - 3.55) / 0.5} s={1.4} />
  </>;
}}</Scene3D>;

// 1:50 · EL TEST DE DIEZ MINUTOS: caja → medidor de US$20 → secador; el medidor sube a 1500 W y el reloj de cocina corre a 10
export const HTestKit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0.0, 0.17, 0], at1: [0.12, 0.18, 0], az: [0.3, 0.1], el: [0.3, 0.24], r: [1.32, 1.36], fov: 30 }} lamp={[0, 0.6, 0.3]}>{(tt) => {
  const a = pop(tt, 0.2), b = pop(tt, 0.9), c = pop(tt, 1.6), on = tt > 2.0, wv = on ? roll(tt, 2.0, 3.4, 0, 1497) + (tt > 3.4 ? Math.round(Math.sin(tt * 7) * 2) : 0) : 0;
  const dial = -2 * PI * (10 / 60) * eio(tt, 2.2, 4.6);
  return <>
    <PBox p={[-0.42, 0, -0.18]} r={[0, 0.35, 0]} w={0.26} h={0.19} d={0.18} scr="1800 W" scrCol="#ff4a3a" />
    <WattMeter val={on ? `${wv} W` : "$20"} p={[-0.1, 0, 0.14]} r={[0, 0.18, 0]} s={a * 2.7 * (1 + 0.06 * Math.sin(PI * cl((tt - 3.35) / 0.3)))} warn={tt > 3.3 ? 1 : 0} />
    <group position={[-0.3, 0.2, 0.2]}rotation={[0, 0.18, 0.12 + 0.06 * Math.sin(tt * 2.2)]} scale={a}>
      <mesh position={[-0.04, 0.05, 0]}><cylinderGeometry args={[0.002, 0.002, 0.1, 6]} />{M.matte({ col: "#d8c9a0" })}</mesh>
      <Txt3 txt="$20" w={0.13} h={0.07} bg="#f2c21b" col="#141516" weight={900} />
    </group>
    <Plug p={[-0.12, 0.08, 0.13]} to={[-0.3, 0.05, 0.02]} r={[0, 0.2, 0]} k="tk1" />
    {/* secador de pelo: cuerpo, boca, mango; con aire tibio que sale cuando anda */}
    <group position={[0.1 + 0.5 * (1 - b), 0.06 * b, -0.16]} rotation={[0, -0.5, 0.1]} scale={Math.max(0.001, b) * 1.4}>
      <mesh rotation={[0, 0, PI / 2]} position={[0, 0.14, 0]} castShadow><cylinderGeometry args={[0.055, 0.06, 0.2, 32]} />{M.plastic({ col: "#3a4a5c" })}</mesh>
      <mesh rotation={[0, 0, PI / 2]} position={[0.13, 0.14, 0]}><cylinderGeometry args={[0.035, 0.045, 0.07, 32]} />{M.matte({ col: "#2a2a2c" })}</mesh>
      <mesh rotation={[0, 0, -0.25]} position={[-0.03, 0.04, 0]} castShadow><boxGeometry args={[0.04, 0.17, 0.05]} />{M.plastic({ col: "#3a4a5c" })}</mesh>
      <mesh rotation={[0, 0, PI / 2]} position={[-0.1, 0.14, 0]}><cylinderGeometry args={[0.05, 0.05, 0.004, 32]} />{M.matte({ col: "#151515" })}</mesh>
      {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 1.6 + i / 8) % 1; return <mesh key={i} position={[0.18 + ph * 0.3, 0.14 + Math.sin(i * 3 + tt * 4) * 0.02 * ph, Math.cos(i * 2) * 0.02 * ph]}><sphereGeometry args={[0.008 + ph * 0.02, 8, 6]} /><meshBasicMaterial color="#ffb878" transparent opacity={on ? 0.28 * (1 - ph) : 0} depthWrite={false} /></mesh>; })}
    </group>
    <Plug p={[0.03, 0.03, 0.12]} to={[-0.1, 0.05, 0.1]} r={[0, -0.3, 0]} k="tk2" />
    {/* reloj de cocina grande: la aguja roja corre hasta 10 minutos */}
    <group position={[0.3 + 0.5 * (1 - c), 0, 0.06]} rotation={[0, -0.45, 0]} scale={Math.max(0.001, c) * 1.45}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.07, 0.075, 0.12, 40]} />{M.porcelain({ col: "#c8321f" })}</mesh>
      <mesh position={[0, 0.135, 0]}><cylinderGeometry args={[0.018, 0.022, 0.03, 20]} />{M.matte({ col: "#1c1c1c" })}</mesh>
      <mesh position={[0, 0.06, 0.071]}><circleGeometry args={[0.062, 40]} /><meshStandardMaterial color="#fbf8f0" /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * 2 * PI) * 0.052, 0.06 + Math.cos(i / 12 * 2 * PI) * 0.052, 0.072]}><boxGeometry args={[0.003, 0.01, 0.001]} /><meshBasicMaterial color={i === 2 ? "#d8361f" : "#333"} /></mesh>)}
      <group position={[0, 0.06, 0.074]} rotation={[0, 0, dial]}><mesh position={[0, 0.022, 0]}><boxGeometry args={[0.005, 0.045, 0.002]} /><meshBasicMaterial color="#d8361f" /></mesh></group>
      <Txt3 txt="10 MIN" w={0.2} h={0.065} col="#f2c21b" bg="#141516" p={[0, -0.03, 0.09]} s={cl((tt - 4.4) / 0.4)} />
    </group>
  </>;
}}</Scene3D>;

// 2:56 · PURE SINE vs BLOCKY: de la toma de la pared sale una onda lisa; de la caja barata, una escalera que tiembla
const sineG = (key: string, k: number, step: boolean, o = 0) => {
  const pts: number[][] = [], N = 90, L = 0.6;
  for (let i = 0; i <= N; i++) { const u = i / N, x = -L / 2 + L * u * Math.max(0.02, k), ph = u * Math.max(0.02, k) * 4 * PI - o; let y = Math.sin(ph) * 0.09; if (step) y = Math.abs(Math.sin(ph)) < 0.38 ? 0 : Math.sign(Math.sin(ph)) * 0.09; pts.push([x, y, 0]); }
  return tubeG(key + k.toFixed(2) + o.toFixed(2), pts, 0.012, 260, 8);
};
export const HWaves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="tile" bg="#0d0e10"
  cam={{ at: [0.0, 0.24, 0], az: [-0.18, 0.14], el: [0.14, 0.08], r: [1.72, 1.56], fov: 32 }}>{(tt) => {
  const k1 = cl(Math.round(eio(tt, 0.05, 2.0) * 60) / 60), k2 = cl(Math.round(eio(tt, 0.9, 3.0) * 60) / 60), jit = tt > 3.6 ? Math.sin(tt * 40) * 0.006 : 0;
  const o = Math.round(Math.max(0, tt - 3.0) * 2.4 * 20) / 20;   // ya dibujadas, las dos ondas corren: la lisa fluye, la escalera salta
  // punto brillante en la punta de cada onda mientras se dibuja
  const tip = (k: number, step: boolean) => { const ph = k * 4 * PI - o, s = Math.sin(ph); return [-0.3 + 0.6 * k, step ? (Math.abs(s) < 0.38 ? 0 : Math.sign(s) * 0.09) : s * 0.09, 0.01] as [number, number, number]; };
  return <>
    {[[k1, false, 0.5, "#c8ffd8"], [k2, true, 0.17, "#ffd0c8"]].map(([k, st, y, c], i) => (k as number) > 0.02 && (k as number) < 0.99 ? <group key={i} position={[0.06, y as number, 0]}><mesh position={tip(k as number, st as boolean)}><sphereGeometry args={[0.022, 16, 12]} />{M.glow({ col: c as string })}</mesh></group> : null)}
    {/* cable verde luminoso de la toma a la onda lisa */}
    <mesh geometry={tubeG("wva", [[-0.37, 0.5, 0.02], [-0.3, 0.52, 0.02], [-0.24, 0.5, 0.0]], 0.01, 20, 8)}>{M.glow({ col: "#6fe39a" })}</mesh>
    {/* arriba: la toma de la pared → onda lisa verde */}
    <group position={[0.06, 0.5, 0]}><mesh geometry={sineG("sa", k1, false, o)}>{M.glow({ col: "#6fe39a" })}</mesh>
      <Txt3 txt="WALL: PURE SINE" w={0.5} h={0.09} col="#6fe39a" bg="#141516" p={[0.0, 0.14, 0]} s={pop(tt, 1.2)} /></group>
    <group position={[-0.43, 0.5, 0.0]}><RBox s={[0.12, 0.17, 0.03]} r={0.012}>{M.porcelain({ col: "#f1eee6" })}</RBox>
      {[-0.035, 0.035].map((y) => <group key={y} position={[0, y, 0.016]}>{[-0.016, 0.016].map((x) => <mesh key={x} position={[x, 0.004, 0]}><planeGeometry args={[0.007, 0.022]} /><meshBasicMaterial color="#222" /></mesh>)}</group>)}</group>
    {/* abajo: la caja barata → escalera roja que tiembla */}
    <group position={[0.06 + jit, 0.17, 0]}><mesh geometry={sineG("sb", k2, true, o)}>{M.glow({ col: "#ff5a4a" })}</mesh>
      <Txt3 txt="CHEAP BOX: BLOCKY" w={0.5} h={0.09} col="#ff6a5a" bg="#141516" p={[0.12, -0.13, 0.04]} s={pop(tt, 2.4)} /></group>
    <group position={[-0.44, 0.0, 0.05]} scale={1.3}><PBox w={0.3} h={0.21} d={0.18} col="#5d6166" sticker="$129" /></group>
    <mesh geometry={tubeG("wvc", [[-0.27, 0.12, 0.05], [-0.25, 0.17, 0.02], [-0.24, 0.17, 0]], 0.012, 20, 8)}>{M.glow({ col: "#ff5a4a" })}</mesh>
  </>;
}}</Scene3D>;

// la onda escalonada que viaja por el cable hacia el motor (k = avance)
const stepWave = (key: string, x0: number, x1: number, k: number) => {
  const pts: number[][] = [], N = 70;
  for (let i = 0; i <= N; i++) { const u = i / N, x = lerp(x0, x1, u * Math.max(0.02, k)), ph = u * Math.max(0.02, k) * 6 * PI; const sv = Math.sin(ph); pts.push([x, Math.abs(sv) < 0.38 ? 0 : Math.sign(sv) * 0.035, 0]); }
  return tubeG(key + k.toFixed(2), pts, 0.006, 200, 6);
};
// 3:27 · EL MOTOR SE CALIENTA: la onda escalonada entra por el cable y el compresor pasa de gris a rojo; el termómetro grande trepa
export const HHotMotor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0b0a"
  cam={{ at: [0.0, 0.24, 0], az: [0.42, 0.1], el: [0.26, 0.18], r: [1.35, 1.18], fov: 30 }}>{(tt) => {
  const wk = eio(tt, 0.3, 1.6), heat = eio(tt, 1.2, 4.6), bz = Math.sin(tt * 70) * 0.003 * (0.3 + heat);
  const mcol = new THREE.Color("#55585c").lerp(new THREE.Color("#c2401a"), heat);
  return <>
    <group position={[0.34, 0.12, 0.02]}><mesh geometry={stepWave("hw", 0.0, -0.26, wk)}>{M.glow({ col: "#ff8a3a" })}</mesh></group>
    <mesh geometry={tubeG("hcab", [[0.62, 0.05, 0.02], [0.45, 0.1, 0.02], [0.1, 0.1, 0.02]], 0.007, 40, 8)}>{M.rubber({ col: "#1c1d20" })}</mesh>
    <group position={[bz, 0, 0]} scale={1.25}>
      <mesh position={[0, 0.11, 0]} castShadow><capsuleGeometry args={[0.1, 0.07, 12, 32]} /><meshStandardMaterial color={mcol} roughness={0.45} metalness={0.4} emissive="#ff4a10" emissiveIntensity={0.9 * heat} /></mesh>
      <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />{M.steel({ col: "#55585c" })}</mesh>
      {[0, 1].map((i) => <mesh key={i} geometry={tubeG("cu" + i, [[0.05 + i * 0.03, 0.2, 0], [0.12 + i * 0.03, 0.27, 0.02], [0.2, 0.22 - i * 0.05, 0.05], [0.26, 0.14 - i * 0.05, 0.02]], 0.008, 60, 10)} castShadow>
        <meshStandardMaterial color="#b8733a" metalness={0.9} roughness={0.3} emissive="#ff5a1a" emissiveIntensity={0.8 * heat} /></mesh>)}
    </group>
    {/* vapor blanco que sube del motor caliente */}
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.5 + i / 12) % 1; return <mesh key={i} position={[Math.sin(i * 2.1) * 0.05 + ph * 0.03, 0.26 + ph * 0.32, Math.cos(i * 1.3) * 0.04]}><sphereGeometry args={[0.015 + ph * 0.035, 10, 8]} /><meshBasicMaterial color="#f2f0ec" transparent opacity={0.22 * heat * (1 - ph)} depthWrite={false} /></mesh>; })}
    {/* termómetro grande con zona roja arriba */}
    <group position={[-0.3, 0, 0.04]}>
      <Thermo k={0.2 + 0.78 * heat} s={pop(tt, 0.3) * 1.3} />
      <mesh position={[0.035, 0.33, 0]}><boxGeometry args={[0.012, 0.08, 0.004]} />{M.glow({ col: "#ff4a3a" })}</mesh>
      <Txt3 txt={`${roll(tt, 1.2, 4.6, 110, 190)}°F`} w={0.2} h={0.07} col={heat > 0.7 ? "#ff6a4a" : "#f7f4ee"} glow p={[0.12, 0.4, 0.04]} s={pop(tt, 0.8) * 1.2} />
    </group>
  </>;
}}</Scene3D>;

// 4:06 · LA HOJA DE DATOS: la lupa salta renglón por renglón y bajo el vidrio el renglón del inversor crece: PURE SINE WAVE
const SHEET = ["CAPACITY ........ 1024 Wh", "AC OUTPUT ....... 1200 W", "SURGE ........... 2400 W", "WAVEFORM ........ PURE SINE WAVE", "CELLS ........... LiFePO4", "CYCLES .......... 3000+"];
export const HSpecSheet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#110d0a" warm={0.3}
  cam={{ at: [0, 0.06, 0.02], az: [0.0, 0.12], el: [0.95, 0.82], r: [1.2, 1.1], fov: 30 }}>{(tt) => {
  // la hoja entra inclinada desde abajo; la lupa baja renglón por renglón (CAPACITY, AC, SURGE) hasta WAVEFORM
  const row = lerp(0, 3, eio(tt, 0.9, 2.6)), inn = phys(tt, 0.2, 6, 0.6);
  const ly = 0.13 - row * 0.05, hit = cl((tt - 2.7) / 0.4), mag = phys(tt, 2.7, 7, 0.5), ri = Math.round(row);
  return <group rotation={[-PI / 2 + 0.28 + 0.5 * (1 - cl(inn)), 0, 0.04 + 0.12 * (1 - cl(inn))]} position={[0, 0.07, 0.35 * (1 - inn)]}>
    <mesh receiveShadow><planeGeometry args={[0.44, 0.56]} /><meshStandardMaterial color="#bdb4a0" roughness={0.95} /></mesh>
    <Txt3 txt="SPEC SHEET" w={0.3} h={0.05} col="#1b1b1b" p={[0, 0.235, 0.001]} />
    {SHEET.map((s, i) => <Txt3 key={i} txt={s} w={0.38} h={0.032} col={i === 3 ? (hit > 0.5 ? "#0f7a3a" : "#111") : "#111"} font="Courier New" weight={900} p={[0, 0.13 - i * 0.05, 0.001]} />)}
    <mesh position={[0, 0.13 - 3 * 0.05, 0.0008]} scale={[Math.max(0.001, hit), 1, 1]}><planeGeometry args={[0.4, 0.038]} /><meshBasicMaterial color="#4fae70" transparent opacity={0.35} toneMapped={false} /></mesh>
    {/* la lupa; bajo el vidrio, el renglón agrandado */}
    <group position={[0.1 + 0.2 * cl(mag), ly - 0.12 * cl(mag), 0.05 + 0.03 * cl(mag)]} scale={0.75}>
      <mesh><torusGeometry args={[0.1, 0.01, 12, 56]} />{M.brass()}</mesh>
      <mesh position={[0.14, -0.1, 0]} rotation={[0, 0, PI / 4]}><cylinderGeometry args={[0.016, 0.018, 0.14, 16]} />{M.wood({ base: [80, 40, 20] })}</mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[0.095, 56]} /><meshBasicMaterial color="#cfe6ff" transparent opacity={0.05} depthWrite={false} /></mesh>
      <mesh position={[-0.035, 0.04, 0.002]} rotation={[0, 0, 0.7]}><planeGeometry args={[0.04, 0.006]} /><meshBasicMaterial color="#fff" transparent opacity={0.3} depthWrite={false} /></mesh>
      <Txt3 txt={SHEET[ri].split(" ")[0]} w={0.17} h={0.05} col="#222" p={[0, 0, 0.002]} op={1 - cl(mag)} s={0.85} />
    </group>
    {/* el renglón encontrado se despega de la hoja y queda flotando como sello */}
    <group position={[0, -0.03, 0.01 + 0.09 * cl(mag)]} rotation={[0.2 * (1 - cl(mag)), 0, -0.04]} scale={Math.max(0.001, mag * 0.85)}>
      <RBox s={[0.42, 0.16, 0.02]} p={[0, -0.02, -0.012]} r={0.01}>{M.matte({ col: "#0b5a2a" })}</RBox>
      <Txt3 txt="PURE SINE WAVE" w={0.4} h={0.06} bg="#0f7a3a" col="#ffffff" weight={900} p={[0, 0.02, 0]} />
      <group position={[0, -0.055, 0.004]} scale={[0.62, 0.3, 1]}><mesh geometry={sineG("ssw", 1, false, Math.round(tt * 2.4 * 20) / 20)}>{M.glow({ col: "#9af0b4" })}</mesh></group>
    </group>
    <mesh position={[0.012, -0.042, 0.002]} scale={[Math.max(0.001, cl(mag)), Math.max(0.001, cl(mag)), 1]}><planeGeometry args={[0.43, 0.1]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
    <pointLight position={[0, -0.03, 0.2]} intensity={0.25 * cl(hit)} distance={0.4} color="#9af0b4" />
  </group>;
}}</Scene3D>;

// 5:16 · LOS CICLOS: dos celdas con su cuentavueltas; la barata se cansa en 800 (se apaga y se raja), la LFP sigue hasta 3000
export const HCycles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0c0a" lamp={[0, 0.7, 0.3]}
  cam={{ at: [0, 0.27, 0], az: [-0.2, 0.18], el: [0.2, 0.13], r: [1.36, 1.22], fov: 30 }}>{(tt) => {
  const n1 = roll(tt, 0.5, 2.0, 0, 800), n2 = roll(tt, 0.5, 4.4, 0, 3000), tired = cl((tt - 2.0) / 0.8);
  const crack = eio(tt, 2.0, 2.7);
  const cell = (x: number, col: string, wid: number, n: number, dim: number, lab: string, s: number, split = false) => <group position={[x, 0, 0]} scale={s}>
    {/* la celda en dos mitades: la barata se parte al llegar a 800 */}
    <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[wid, wid, 0.16, 40]} /><meshPhysicalMaterial color={new THREE.Color(col).lerp(new THREE.Color("#3a3c40"), dim)} roughness={0.35} clearcoat={0.6} /></mesh>
    <group position={[split ? 0.05 * crack : 0, 0.16 + (split ? 0.03 * crack : 0), 0]} rotation={[0, 0, split ? -0.5 * crack : 0]}>
      <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[wid, wid, 0.16, 40]} /><meshPhysicalMaterial color={new THREE.Color(col).lerp(new THREE.Color("#3a3c40"), dim)} roughness={0.35} clearcoat={0.6} /></mesh>
      <mesh position={[0, 0.165, 0]}><cylinderGeometry args={[wid * 0.4, wid * 0.4, 0.014, 24]} />{M.steel()}</mesh>
      <mesh position={[0, 0.0, wid + 0.001]}><planeGeometry args={[wid * 0.8, 0.12]} />{M.glow({ col: "#6fe39a", op: 0.85 * (1 - dim) })}</mesh>
    </group>
    <mesh position={[0, 0.08, wid + 0.001]}><planeGeometry args={[wid * 0.8, 0.12]} />{M.glow({ col: "#6fe39a", op: 0.85 * (1 - dim) })}</mesh>
    <Txt3 txt={lab} w={0.2} h={0.07} col="#ffffff" bg="#151515" weight={900} p={[0, 0.06, wid + 0.006]} />
    {/* cuentavueltas negro arriba con el número grande */}
    <RBox s={[0.28, 0.09, 0.05]} p={[0, 0.42, 0]} r={0.012}>{M.matte({ col: "#141516" })}</RBox>
    <Txt3 txt={`${n}`} w={0.25} h={0.075} col={dim > 0.5 ? "#ff6a4a" : "#f2c21b"} glow font="Courier New" p={[0, 0.42, 0.026]} />
  </group>;
  return <>
    {cell(-0.27, "#2a5aa8", 0.075, n1, tired, "CHEAP", pop(tt, 0.2) * 1.3, true)}
    <Spark p={[-0.27, 0.22 * 1.3, 0.1]} k={(tt - 2.0) / 0.5} s={1.5} />
    {cell(0.27, "#2e7d4f", 0.095, n2, 0, "LFP", pop(tt, 0.4) * 1.3)}
  </>;
}}</Scene3D>;

// 5:51 · CONGELADA NO CARGA: la escarcha tapa la caja, el termómetro baja a 32°F, el enchufe avanza y un candado grande cae y lo frena
export const HFrostLock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0a0f15"
  cam={{ at: [-0.02, 0.18, 0], az: [0.22, -0.05], el: [0.24, 0.16], r: [1.22, 1.12], fov: 30 }} warm={0.75}>{(tt) => {
  const frost = eio(tt, 0.2, 1.6), tug = tt > 3.0 ? 0.03 * Math.abs(Math.sin((tt - 3.0) * 7)) * Math.exp(-(tt - 3.0) * 0.8) : 0, plugX = lerp(0.46, 0.27, eio(tt, 1.0, 2.55)) + 0.05 * eio(tt, 2.7, 3.0) + tug, drop = cl((tt - 2.2) / 0.08), y = 0.1 + fall(tt, 2.2, 0.45, 11, 0.3), close = eio(tt, 2.8, 3.0);
  return <>
    <PBox p={[-0.08, 0, 0]} w={0.34} h={0.25} d={0.22} col="#8d969e" scr="32°F" scrCol="#8fd0ff" />
    {/* la escarcha sube como una capa blanca desde abajo */}
    <mesh position={[-0.08, 0.13 * frost, 0.114]} scale={[1, Math.max(0.001, frost), 1]}><planeGeometry args={[0.35, 0.26]} /><meshStandardMaterial color="#f2f9ff" transparent opacity={0.42} roughness={0.2} emissive="#bfe2ff" emissiveIntensity={0.2} depthWrite={false} /></mesh>
    <mesh position={[-0.12, 0.226, 0]} scale={[1, Math.max(0.001, frost), 1]}><boxGeometry args={[0.31, 0.014, 0.21]} /><meshStandardMaterial color="#eaf6ff" roughness={0.3} emissive="#9fd4ff" emissiveIntensity={0.15} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.26 + (i % 7) * 0.045, 0.236 + (i % 3) * 0.004, -0.07 + Math.floor(i / 7) * 0.12]} rotation={[i, i * 0.7, 0]} scale={Math.max(0.001, cl(frost * 1.4 - i / 20))}><octahedronGeometry args={[0.012 + (i % 3) * 0.004]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.85} roughness={0.05} /></mesh>)}
    <Thermo k={lerp(0.6, 0.15, frost)} col={frost > 0.6 ? "#58a8ff" : "#e2352a"} p={[-0.38, 0, 0.1]} s={pop(tt, 0.2) * 1.45} />
    <Plug p={[plugX, 0.1, 0.13]} to={[0.55, 0.04, 0.1]} r={[0, -PI / 2, 0]} />
    {Array.from({ length: 18 }, (_, i) => { const yy = 0.02 + (i % 6) * 0.04, xx = -0.23 + Math.floor(i / 6) * 0.13 + (i % 2) * 0.03; return <mesh key={"fc" + i} position={[xx, yy, 0.116]} rotation={[0, 0, i * 0.9]} scale={Math.max(0.001, cl(frost * 1.3 - yy * 2.6))}><octahedronGeometry args={[0.014 + (i % 3) * 0.004]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.8} roughness={0.05} /></mesh>; })}
    <pointLight position={[0.16, 0.16, 0.25]} intensity={1.4 * cl(1 - Math.abs(tt - 3.0) / 0.25)} distance={0.6} color="#9fd4ff" />
    <mesh position={[0.16, 0.1, 0.16]} scale={tt > 2.9 && tt < 3.5 ? 0.5 + (tt - 2.9) * 3 : 0.001}><ringGeometry args={[0.06, 0.068, 40]} />{M.glow({ col: "#bfe6ff", op: 0.8 * cl(1 - (tt - 2.9) / 0.6) })}</mesh>
    {/* candado grande que cae de golpe sobre el enchufe y rebota */}
    <group position={[0.16, y, 0.13]} scale={Math.max(0.001, drop) * 1.9}>
      <RBox s={[0.07, 0.06, 0.025]} r={0.008}>{M.brass()}</RBox>
      <group position={[0.011 * (1 - close), 0.04 + 0.022 * (1 - close), 0]} rotation={[0, 1.2 * (1 - close), 0]}><mesh><torusGeometry args={[0.022, 0.006, 10, 24, PI]} />{M.steel()}</mesh></group>
      <mesh position={[0, -0.005, 0.0135]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#2a1a08" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// 6:10 · LA CAJA DEL GARAJE FRÍO: la etiqueta de afuera dice 1000 Wh; cinco de las diez celdas titilan, se apagan y se hunden; las otras cinco siguen brillando
export const HHalfBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0, 0.2, 0], az: [-0.3, -0.08], el: [0.22, 0.16], r: [1.3, 1.18], fov: 30 }}>{(tt) => {
  const half = phys(tt, 3.6, 8, 0.45);
  return <group scale={1.3} position={[0, 0, -0.06]}>
    <mesh position={[0, 0.14, 0]}><boxGeometry args={[0.56, 0.28, 0.22]} />{M.glass({ op: 0.2 })}</mesh>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.58, 0.24]} />{M.matte({ col: "#202226" })}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const top = i >= 5, at = 1.0 + (i - 5) * 0.45, fl = top && tt > at && tt < at + 0.35 ? (Math.floor(tt * 16) % 2) : 1, off = top ? cl((tt - at - 0.35) / 0.15) : 0;
      const lit = top ? (tt < at ? 1 : off > 0 ? 0 : fl) : 1, sink = top ? 0.018 * off : 0;
      return <mesh key={i} position={[-0.22 + (i % 5) * 0.11, (top ? 0.205 : 0.075) - sink, 0]} castShadow>
      <cylinderGeometry args={[0.038, 0.038, 0.11, 24]} /><meshStandardMaterial color={off > 0.5 ? "#2c2e32" : "#3a8a5a"} roughness={0.5} emissive="#6fe39a" emissiveIntensity={0.55 * lit} /></mesh>; })}
    <pointLight position={[0, 0.1, 0.3]} intensity={0.5} distance={0.6} color="#6fe39a" />
    {/* la etiqueta pegada afuera, abajo a la derecha del vidrio */}
    <group position={[0.17, 0.03, 0.112]} rotation={[0, 0, -0.04]}><Txt3 txt="1000 Wh" w={0.17} h={0.045} col="#141516" bg="#f2efe8" weight={900} /></group>
    {/* arriba aparece lo que queda de verdad */}
    <Txt3 txt="~500 Wh" w={0.3} h={0.08} col="#6fe39a" glow weight={900} p={[0, 0.36, 0]} s={Math.max(0.001, half)} />
  </group>;
}}</Scene3D>;

// 7:11 · LA LETRA CHICA: la caja gira; adelante un 2000 W gigante, atrás la chapita: la cámara se acerca y se lee CONTINUOUS 1000W
export const HFlipBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0e0c0a"
  cam={{ at: [0, 0.16, 0], at1: [0, 0.14, 0], az: [-0.15, 0.12], el: [0.2, 0.12], r: [1.0, 0.72], fov: 30 }} lamp={[0, 0.5, 0.4]}>{(tt) => {
  // giro de 180° con inercia (se pasa un poco y vuelve); en el dorso la aguja roja trepa a 2000 con rebote y se queda
  const rot = PI * phys(tt, 0.4, 3.0, 0.5), lift = 0.06 * Math.sin(PI * eio(tt, 0.3, 1.5)), peak = cl(phys(tt, 3.0, 9, 0.35));
  return <group position={[0, lift, 0]} rotation={[0, rot, 0]}>
    <PBox w={0.4} h={0.26} d={0.24} col="#3b3e42" />
    <Txt3 txt="2000W" w={0.34} h={0.1} bg="#d8361f" col="#fff6e6" p={[0, 0.115, 0.1215]} />
    {/* atrás: la chapita de datos, con letra que la cámara alcanza a leer */}
    <group position={[0, 0.14, -0.1215]} rotation={[0, PI, 0]}>
      {/* chapa de aluminio atornillada con la letra en relieve */}
      <RBox s={[0.37, 0.2, 0.006]} p={[0, 0, -0.002]} r={0.006}>{M.steel({ col: "#b9bec5" })}</RBox>
      {[[-0.17, 0.09], [0.17, 0.09], [-0.17, -0.09], [0.17, -0.09]].map(([x, y]) => <mesh key={x + "" + y} position={[x, y, 0.002]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.003, 12]} />{M.steel({ col: "#7a7f86" })}</mesh>)}
      <Txt3 txt="CONTINUOUS 1000W" w={0.27} h={0.055} col="#141516" weight={900} p={[-0.025, 0.045, 0.002]} />
      <mesh position={[-0.025, 0.012, 0.003]} scale={[Math.max(0.001, cl((tt - 2.2) / 0.4)), 1, 1]}><planeGeometry args={[0.26, 0.008]} /><meshBasicMaterial color="#1f8a4a" /></mesh>
      <Txt3 txt="PEAK 2000W" w={0.27} h={0.055} col="#a8231a" weight={900} p={[-0.025, -0.035, 0.002]} />
      {/* medidor vertical a la derecha: la aguja roja trepa a 2000 con rebote y queda arriba */}
      <mesh position={[0.145, 0, 0.003]}><planeGeometry args={[0.028, 0.16]} /><meshBasicMaterial color="#2a2c30" /></mesh>
      <mesh position={[0.145, -0.075 + 0.075 * peak, 0.005]} scale={[1, Math.max(0.001, peak), 1]}><boxGeometry args={[0.02, 0.15, 0.004]} />{M.glow({ col: "#ff4a3a" })}</mesh>

    </group>
  </group>;
}}</Scene3D>;
