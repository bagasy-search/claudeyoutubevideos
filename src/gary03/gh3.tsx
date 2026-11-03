// gary03 · componentes únicos 3/4 (min 14-21).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tubeG } from "./h3d";
import { Bulb, Fridge, PBox, PI, Plug, Thermo, Txt3, cl, eio, lerp, phys, pop, roll } from "./gk";
import { Spark } from "./gh1";

type V = [number, number, number];
// cosas chicas reconocibles (sin rótulo): teléfono, router, máquina de CPAP, lamparita de mesa
const MiniPhone: React.FC<{ p: V; s?: number; on?: number }> = ({ p, s = 1, on = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.05, 0.1, 0.008]} p={[0, 0.05, 0]} r={0.006}>{M.matte({ col: "#151618" })}</RBox>
  <mesh position={[0, 0.05, 0.0045]}><planeGeometry args={[0.044, 0.088]} /><meshStandardMaterial color="#0a1420" emissive="#4aa8ff" emissiveIntensity={0.5 * on} /></mesh></group>;
const MiniRouter: React.FC<{ p: V; s?: number; on?: number }> = ({ p, s = 1, on = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.12, 0.03, 0.08]} p={[0, 0.015, 0]} r={0.006}>{M.plastic({ col: "#f1efe9" })}</RBox>
  {[-0.04, 0.04].map((x) => <mesh key={x} position={[x, 0.07, -0.03]}><cylinderGeometry args={[0.004, 0.004, 0.09, 8]} />{M.matte({ col: "#222" })}</mesh>)}
  {[0, 1, 2].map((i) => <mesh key={i} position={[-0.03 + i * 0.02, 0.018, 0.041]}><circleGeometry args={[0.004, 10]} />{M.glow({ col: "#6fe39a", op: on })}</mesh>)}</group>;
const MiniCpap: React.FC<{ p: V; s?: number; on?: number }> = ({ p, s = 1, on = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.1, 0.07, 0.1]} p={[0, 0.035, 0]} r={0.015}>{M.plastic({ col: "#9aa3ad" })}</RBox>
  <mesh position={[0, 0.071, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02, 16]} />{M.glow({ col: "#4aa8ff", op: 0.3 + 0.7 * on })}</mesh>
  <mesh geometry={tubeG("cpaph", [[0.05, 0.04, 0], [0.1, 0.07, 0.02], [0.14, 0.03, 0.05]], 0.009, 30, 8)}>{M.plastic({ col: "#cfd6dc" })}</mesh></group>;
const MiniLamp: React.FC<{ p: V; s?: number; on?: number }> = ({ p, s = 1, on = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.03, 0.035, 0.02, 20]} />{M.brass()}</mesh>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.004, 0.004, 0.09, 8]} />{M.brass()}</mesh>
  <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.03, 0.05, 0.05, 20, 1, true]} /><meshStandardMaterial color="#f3e7cc" side={THREE.DoubleSide} emissive="#ffcf7a" emissiveIntensity={0.9 * on} /></mesh></group>;

// 14:25 · EL SELLO DEL LABORATORIO: la caja pasa por las tres pruebas (placa al rojo, caída, cortocircuito) y baja el sello UL grande
export const HStamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0f0d0b"
  cam={{ at: [0, 0.2, 0.02], az: [-0.3, 0.1], el: [0.3, 0.5], r: [0.98, 0.86], fov: 30 }} lamp={[0, 0.7, 0.2]}>{(tt) => {
  const heat = cl(1 - Math.abs(tt - 0.85) / 0.55), lift = tt < 1.4 ? 0 : tt < 1.85 ? 0.28 * eio(tt, 1.4, 1.85) : fall(tt, 1.85, 0.28, 10, 0.32), land = tt > 2.15 && tt < 2.45 ? 0.01 * Math.sin((tt - 2.15) * 60) : 0;
  const down = tt < 3.6 ? cl(phys(tt, 3.1, 11, 0.3)) : 1 - 0.55 * eio(tt, 3.9, 4.5), ink = cl((tt - 3.5) / 0.1), hitF = cl(1 - Math.abs(tt - 3.55) / 0.15);
  return <>
    {/* placa caliente debajo */}
    <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.46, 0.02, 0.32]} /><meshStandardMaterial color="#2a1a14" emissive="#ff4a10" emissiveIntensity={1.4 * heat} toneMapped={false} /></mesh>
    <pointLight position={[0, 0.06, 0.2]} intensity={2 * heat} distance={0.9} color="#ff6a2a" />
    {Array.from({ length: 22 }, (_, i) => { const a = i / 22 * 2 * PI, x = Math.cos(a) * 0.25, z = Math.sin(a) * 0.19; return <mesh key={i} position={[x, 0.09, z]} scale={[1, Math.max(0.001, heat * (0.7 + 0.3 * Math.sin(tt * 20 + i))), 1]}><coneGeometry args={[0.028, 0.2 + 0.06 * (i % 3), 10]} />{M.glow({ col: i % 2 ? "#ffb02a" : "#ff6a2a", op: 0.85 })}</mesh>; })}
    <group position={[0, 0.02 + lift + land, 0]}><PBox w={0.36} h={0.22} d={0.24} col="#45484c" asa={false} /></group>
    {/* polvo del golpe contra el piso */}
    <Spark p={[-0.16, 0.03, 0.12]} k={(tt - 2.15) / 0.3} s={1.0} />
    {/* cortocircuito: un destornillador cruza las dos tomas y salta la chispa */}
    <group position={[0.24, 0.12, 0.13]} rotation={[0, 0, 0.3]} scale={Math.max(0.001, cl((tt - 2.4) / 0.2) * (1 - cl((tt - 3.1) / 0.2)))}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.16, 10]} />{M.steel()}</mesh>
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.014, 0.014, 0.07, 14]} />{M.plastic({ col: "#d8361f" })}</mesh>
    </group>
    <Spark p={[0.16, 0.1, 0.13]} k={(tt - 2.5) / 0.5} s={1.6} />
    <Spark p={[0, 0.27, 0.05]} k={(tt - 3.5) / 0.45} s={1.3} />
    {/* tinta UL en la tapa */}
    <group position={[0, 0.2415 + lift, 0]} rotation={[-PI / 2, 0, 0.08]} scale={1.25}>
      <mesh><circleGeometry args={[0.1, 48]} /><meshBasicMaterial color="#e9f2e6" transparent opacity={ink} /></mesh>
      <mesh position={[0, 0, 0.0003]}><ringGeometry args={[0.085, 0.1, 48]} /><meshBasicMaterial color="#1f6b3a" transparent opacity={ink} /></mesh>
      <Txt3 txt="UL" w={0.13} h={0.1} col="#1f6b3a" bg="#e9f2e6" p={[0, 0, 0.0006]} op={ink} />
    </group>
    <pointLight position={[0, 0.4, 0.15]} intensity={3 * hitF} distance={0.9} color="#e9fff0" />
    {/* el sello grande con mango de madera */}
    <group position={[0, lerp(0.75, 0.245, down), 0]} scale={[1.1, 1, 1.1]}>
      <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.088, 0.088, 0.03, 48]} />{M.rubber({ col: "#1f6b3a" })}</mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.095, 0.095, 0.04, 48]} />{M.wood({ base: [120, 80, 46] })}</mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.022, 0.028, 0.14, 20]} />{M.wood({ base: [150, 100, 58] })}</mesh>
      <mesh position={[0, 0.23, 0]}><sphereGeometry args={[0.048, 20, 16]} />{M.wood({ base: [150, 100, 58] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// etiqueta de precio colgada de un hilo
const Tag: React.FC<{ p: V; txt: string; col: string; s?: number }> = ({ p, txt, col, s = 1 }) => <group position={p} scale={Math.max(0.001, s)}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.001, 0.001, 0.08, 4]} />{M.matte({ col: "#ddd" })}</mesh>
  <RBox s={[0.17, 0.08, 0.004]} r={0.008}>{M.matte({ col: "#f6f1e4" })}</RBox>
  <Txt3 txt={txt} w={0.15} h={0.065} col={col} p={[0, 0, 0.003]} /></group>;
// 15:50 · LA BALANZA: en un plato la batería extra, en el otro una caja entera; la balanza oscila y queda casi pareja; los precios cuelgan
export const HBalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0e0c0a"
  cam={{ at: [0, 0.37, 0], az: [0.15, -0.12], el: [0.14, 0.08], r: [2.24, 2.08], fov: 30 }} lamp={[0, 0.9, 0.3]}>{(tt) => {
  const tilt = 0.18 * Math.exp(-Math.max(0, tt - 1.6) * 1.1) * Math.cos(Math.max(0, tt - 1.6) * 5) * (tt > 1.6 ? 1 : 0) - 0.03 * cl((tt - 1.6) / 2);
  const pan = (x: number) => [x * Math.cos(tilt), 0.6 + x * Math.sin(tilt) - 0.18, 0] as V;
  return <>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.02, 0.035, 0.6, 20]} />{M.brass()}</mesh>
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.15, 0.17, 0.02, 40]} />{M.brass()}</mesh>
    <group position={[0, 0.6, 0]} rotation={[0, 0, tilt]}><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.9, 12]} />{M.brass()}</mesh></group>
    {[-0.45, 0.45].map((x, i) => { const p = pan(x); return <group key={i} position={p}>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.07, 0.09, 0]} rotation={[0, 0, -s * 0.38]}><cylinderGeometry args={[0.0015, 0.0015, 0.2, 4]} />{M.brass()}</mesh>)}
      <mesh><cylinderGeometry args={[0.15, 0.12, 0.015, 40]} />{M.brass()}</mesh>
      {/* el precio cuelga del borde del plato con una cadenita */}
      <mesh position={[0, -0.05, 0.13]}><cylinderGeometry args={[0.0015, 0.0015, 0.08, 4]} />{M.brass()}</mesh>
      <Tag p={[0, -0.14, 0.13]} txt={i === 0 ? "$699" : "$749"} col={i === 0 ? "#c62a22" : "#1f6b3a"} s={pop(tt, i === 0 ? 0.9 : 1.9) * 1.2} />
      {i === 0 ? <group position={[0, 0.008, 0]} scale={pop(tt, 0.3) * 1.35}>
          <RBox s={[0.22, 0.15, 0.14]} p={[0, 0.075, 0]} r={0.012}>{M.matte({ col: "#2c2f33" })}</RBox>
          {/* bornes rojo y negro: una batería de verdad */}
          {[-0.06, 0.06].map((zx, j) => <mesh key={zx} position={[zx, 0.162, 0]}><cylinderGeometry args={[0.016, 0.016, 0.026, 14]} />{M.plastic({ col: j ? "#c62a22" : "#1a1a1a" })}</mesh>)}
          <Txt3 txt="BATTERY" w={0.2} h={0.055} bg="#f2c21b" col="#141516" p={[0, 0.075, 0.071]} />
          
        </group>
        : <group position={[0, 0.008 + fall(tt, 1.45, 0.5, 9, 0.35), 0]} scale={(tt > 1.4 ? 1 : 0.001) * 1.35}>
          <PBox w={0.2} h={0.14} d={0.14} scr="ON" />
          
        </group>}
    </group>; })}
  </>;
}}</Scene3D>;

// 16:11 · DOS CAJAS EN LA CASA: corte de la casa; una caja en la cocina con la heladera, otra en el dormitorio; entra rodando una tercera de repuesto
export const HTwoBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0a0c11"
  cam={{ at: [0, 0.2, 0.08], az: [0.3, -0.08], el: [0.32, 0.26], r: [1.36, 1.18], fov: 30 }} warm={0.45}>{(tt) => {
  const k1 = cl((tt - 0.4) / 0.5), k2 = cl((tt - 1.2) / 0.5), roll3 = eio(tt, 2.0, 3.0), bump = tt > 3.0 && tt < 3.3 ? 0.01 * Math.sin((tt - 3.8) * 30) : 0;
  return <>
    {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.005, 0]} receiveShadow><boxGeometry args={[0.58, 0.01, 0.5]} />{M.wood({ base: i ? [150, 110, 70] : [120, 90, 60] })}</mesh>
      <mesh position={[0, 0.2, -0.25]}><boxGeometry args={[0.58, 0.4, 0.02]} /><meshStandardMaterial color={i ? "#46536a" : "#3a352c"} roughness={0.95} /></mesh>
      <pointLight position={[0, 0.32, 0.05]} intensity={0.26 * (i ? k2 : k1)} distance={0.7} color="#ffe2b0" />
    </group>)}
    <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.02, 0.4, 0.5]} /><meshStandardMaterial color="#9e978a" /></mesh>
    <mesh position={[lerp(0.8, 0.2, roll3), 0.012, 0.36]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, cl((tt - 2.0) * 4))}><circleGeometry args={[0.12, 28]} /><meshBasicMaterial color="#000" transparent opacity={0.7} depthWrite={false} /></mesh>
    <Fridge p={[-0.44, 0.01, -0.12]} s={0.5} lit={k1} />
    <PBox p={[-0.2, 0.01, -0.03]} w={0.13} h={0.09} d={0.085} scr="ON" on={k1} />
    <RBox s={[0.3, 0.07, 0.36]} p={[0.38, 0.045, -0.04]} r={0.02}>{M.matte({ col: "#e9e6de" })}</RBox>
    <RBox s={[0.3, 0.02, 0.26]} p={[0.38, 0.09, 0.02]} r={0.01}>{M.matte({ col: "#3a5a8a" })}</RBox>
    <RBox s={[0.12, 0.04, 0.08]} p={[0.36, 0.1, -0.16]} r={0.02}>{M.matte({ col: "#f3f1ea" })}</RBox>
    <PBox p={[0.13, 0.01, -0.13]} w={0.11} h={0.08} d={0.075} scr="ON" on={k2} />
    <MiniLamp p={[0.13, 0.09, -0.13]} s={0.8} on={k2} />
    {/* la de repuesto rueda hasta el frente, con su moño rojo */}
    <group position={[lerp(0.8, 0.2, roll3), 0.01 + bump, 0.36]} rotation={[0, -0.3 + 0.3 * roll3, 0]} scale={Math.max(0.001, cl((tt - 2.0) * 4)) * 1.15}>
      <PBox w={0.14} h={0.1} d={0.09} on={0} />
      <mesh position={[0, 0.115, 0]}><boxGeometry args={[0.15, 0.012, 0.02]} />{M.plastic({ col: "#d8361f" })}</mesh>
      <mesh position={[0, 0.125, 0]} rotation={[0, 0, PI / 4]}><torusGeometry args={[0.018, 0.006, 8, 20]} />{M.plastic({ col: "#d8361f" })}</mesh>
      <mesh position={[0, 0.125, 0]} rotation={[0, 0, -PI / 4]}><torusGeometry args={[0.018, 0.006, 8, 20]} />{M.plastic({ col: "#d8361f" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// 16:44 · EL PRESUPUESTO DE VATIOS: adentro del tanque de vidrio entran la heladera, la lamparita, el teléfono, el router y el CPAP; la caldera no entra y rebota afuera
export const HBudget: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0b0d12"
  cam={{ at: [0.16, 0.3, 0], az: [-0.25, 0.12], el: [0.2, 0.14], r: [1.68, 1.55], fov: 30 }} lamp={[0, 0.8, 0.3]}>{(tt) => {
  const drop = (at: number, y0: number) => lerp(0.95, y0, cl(phys(tt, at, 7, 0.5))), vis = (at: number) => Math.max(0.001, cl((tt - at) * 8));
  const fz = phys(tt, 3.2, 6, 0.4), furnX = tt < 3.6 ? 0 : 0.3 * eio(tt, 3.6, 4.4), furnY = tt < 3.6 ? lerp(1.0, 0.6, cl(fz)) : lerp(0.6, 0.0, eIn2(tt, 3.6, 4.3)) + 0.12 * Math.sin(PI * cl((tt - 3.6) / 0.7));
  return <>
    {/* el tanque de vidrio con la raya de lo que da la caja */}
    <mesh position={[0, 0.27, 0]}><boxGeometry args={[0.42, 0.52, 0.28]} />{M.glass({ op: 0.16 })}</mesh>
    <mesh position={[0, 0.005, 0]}><boxGeometry args={[0.43, 0.01, 0.29]} />{M.steel({ col: "#4a4e53" })}</mesh>
    <mesh position={[0, 0.46, 0.141]}><planeGeometry args={[0.42, 0.006]} />{M.glow({ col: "#ff5a4a" })}</mesh>
    <Txt3 txt="1000 W" w={0.22} h={0.075} bg="#b8241a" col="#ffffff" p={[-0.34, 0.46, 0.14]} />
    <group position={[-0.1, drop(0.2, 0.0), 0]} scale={vis(0.2)}><Fridge s={0.42} lit={0.6} /></group>
    <group position={[0.1, drop(0.6, 0.0), 0.02]} scale={vis(0.6)}><MiniLamp p={[0, 0, 0]} s={1.3} /></group>
    <group position={[0.11, drop(1.0, 0.15), 0.04]} scale={vis(1.0)}><MiniRouter p={[0, 0, 0]} s={1.15} /></group>
    <group position={[0.1, drop(1.4, 0.19), 0.03]} scale={vis(1.4)}><MiniCpap p={[0, 0, 0]} s={1.05} /></group>
    <group position={[-0.08, drop(1.8, 0.29), 0.05]} rotation={[0, 0, 0.3]} scale={vis(1.8)}><MiniPhone p={[0, 0, 0]} s={1.3} /></group>
    {/* la caldera grande: cae, choca con el borde y rebota afuera */}
    <group position={[furnX, furnY, 0]} rotation={[0, 0, -0.6 * cl((tt - 3.6) / 0.6)]} scale={vis(3.2)}>
      <RBox s={[0.26, 0.3, 0.2]} p={[0, 0.15, 0]} r={0.015}>{M.matte({ col: "#8a8f96" })}</RBox>
      <mesh position={[0, 0.12, 0.101]}><planeGeometry args={[0.1, 0.06]} />{M.glow({ col: "#ff6a2a" })}</mesh>
    </group>
  </>;
}}</Scene3D>;
const eIn2 = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c; };

// 17:49 · LA DE US$300: lamparita, teléfono, router y CPAP se enchufan de a uno y prenden; la heladera grande se acerca, chispa y la caja se pone roja
export const HBox300: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0f0c0a"
  cam={{ at: [0.05, 0.24, 0.05], az: [-0.2, 0.08], el: [0.26, 0.2], r: [1.55, 1.42], fov: 30 }} lamp={[0, 0.6, 0.2]}>{(tt) => {
  const fr = eio(tt, 2.8, 3.5), red = tt > 3.6, fl = red ? (Math.floor(tt * 8) % 2 ? 1 : 0.3) : 1;
  const on = (i: number) => cl((tt - 0.5 - i * 0.5) / 0.2);
  const spots: V[] = [[-0.34, 0, 0.06], [-0.28, 0, 0.24], [-0.1, 0, 0.3], [0.08, 0, 0.3]];
  return <>
    <PBox p={[-0.08, 0, -0.08]} w={0.32} h={0.22} d={0.2} col={red ? "#8a2a22" : "#4a4e53"} scr={red ? "OVER" : "$300"} scrCol={red ? "#ff3b2a" : "#f2c21b"} on={fl} />
    <MiniLamp p={spots[0]} s={pop(tt, 0.4) * 1.6} on={on(0)} />
    <MiniPhone p={spots[1]} s={pop(tt, 0.9) * 1.5} on={on(1)} />
    <MiniRouter p={spots[2]} s={pop(tt, 1.4) * 1.4} on={on(2)} />
    <MiniCpap p={spots[3]} s={pop(tt, 1.9) * 1.4} on={on(3)} />
    {spots.map((s, i) => <mesh key={i} geometry={tubeG("b3c" + i, [[s[0], 0.01, s[2] - 0.02], [lerp(s[0], -0.08, 0.5), 0.005, lerp(s[2], 0.0, 0.5)], [-0.08 + (i - 1.5) * 0.03, 0.06, 0.0]], 0.012, 30, 8)} visible={tt > 0.45 + i * 0.5}>{M.rubber({ col: "#1c1d20" })}</mesh>)}
    {/* la heladera de la cocina, grande, se acerca con su ficha */}
    <Fridge p={[lerp(0.9, 0.42, fr), 0, -0.05]} r={[0, -0.5, 0]} s={1.0} />
    <Plug p={[lerp(0.6, 0.1, fr) + 0.16 * eio(tt, 3.6, 3.85), 0.06, 0.05]} to={[lerp(0.9, 0.42, fr), 0.05, 0.05]} r={[0, -PI / 2, 0]} k="b3f" />
    <Spark p={[0.08, 0.08, 0.05]} k={(tt - 3.55) / 0.5} s={2.6} />
    <pointLight position={[-0.08, 0.3, 0.2]} intensity={red ? 1.4 * fl : 0} distance={0.8} color="#ff3a2a" />
    <pointLight position={[0.08, 0.15, 0.15]} intensity={2.5 * cl(1 - Math.abs(tt - 3.62) / 0.15)} distance={0.7} color="#ff3a2a" />
  </>;
}}</Scene3D>;

// 18:54 · CATORCE HORAS: la heladera entreabierta con la comida, el reloj de pared da 14 vueltas de hora, la caja baja de 100 a 8 % y el termómetro sigue en frío
export const HFourteen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" bg="#0d1014"
  cam={{ at: [0.0, 0.4, 0], az: [0.3, 0.08], el: [0.16, 0.1], r: [2.0, 1.85], fov: 30 }}>{(tt) => {
  const hrs = 14 * eio(tt, 0.3, 4.6), cyc = Math.floor(hrs * 1.5) % 2 === 0, pct = Math.max(8, Math.round(100 - hrs * 6.6)), bars = Math.round(pct / 10), deg = 38 + Math.round(3 * eio(tt, 3.0, 4.8));
  return <>
    {/* sombra de contacto: la heladera pesa */}
    <mesh position={[-0.4, 0.002, -0.08]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.32, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
    <Fridge p={[-0.4, 0, -0.1]} r={[0, 0.25, 0]} lit={(cyc ? 0.14 : 0.08) * (1 - 0.85 * eio(tt, 0.5, 4.6))} door={0.8} />
    <group position={[-0.4, 0, -0.1]} rotation={[0, 0.25, 0]}>
      {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[-0.11 + (i % 3) * 0.035, 0.47 + Math.floor(i / 3) * 0.004, 0.17 + Math.floor(i / 3) * 0.03]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.016, 14, 10]} /><meshStandardMaterial color="#f3e6cf" roughness={0.6} /></mesh>)}
      <mesh position={[0.06, 0.53, 0.19]}><cylinderGeometry args={[0.035, 0.035, 0.13, 20]} />{M.glass({ op: 0.5 })}</mesh>
      <mesh position={[0.06, 0.51, 0.19]}><cylinderGeometry args={[0.032, 0.032, 0.09, 20]} /><meshStandardMaterial color="#f6f6f0" /></mesh>
      <mesh position={[0.06, 0.605, 0.19]}><cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />{M.plastic({ col: "#2f74c4" })}</mesh>
    </group>
    <pointLight position={[-0.2, 0.35, 0.15]} intensity={0.12} distance={0.5} color={deg > 39 ? "#ffc070" : "#9fd4ff"} />
    {/* termómetro grande adelante: frío todo el tiempo */}
    <group position={[-0.4, 0, 0.26]}><Thermo k={0.3 + 0.4 * eio(tt, 3.0, 4.8)} col={deg > 39 ? "#e2352a" : "#58a8ff"} s={1.85} />
      <Txt3 txt={`${deg}°F`} w={0.24} h={0.09} bg="#141516" col={deg > 39 ? "#ffc070" : "#8fd0ff"} p={[0, 0.66, 0]} /></group>
    {/* reloj de pared grande mirando a cámara */}
    <group position={[0.5, 0.56, -0.45]} scale={1.1}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.03, 48]} />{M.porcelain({ col: "#f6f3ea" })}</mesh>
      <mesh position={[0, 0, 0.016]}><ringGeometry args={[0.16, 0.175, 48]} />{M.matte({ col: "#1b1b1b" })}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * 2 * PI) * 0.14, Math.cos(i / 12 * 2 * PI) * 0.14, 0.017]}><boxGeometry args={[0.006, 0.02, 0.002]} /><meshBasicMaterial color="#222" /></mesh>)}
      <group rotation={[0, 0, -hrs / 12 * 2 * PI]}><mesh position={[0, 0.045, 0.019]}><boxGeometry args={[0.012, 0.09, 0.003]} /><meshBasicMaterial color="#111" /></mesh></group>
      <group rotation={[0, 0, -hrs * 2 * PI]}><mesh position={[0, 0.065, 0.02]}><boxGeometry args={[0.006, 0.13, 0.003]} /><meshBasicMaterial color="#c62a22" /></mesh></group>
      <Txt3 txt={`${Math.floor(hrs)} HOURS`} w={0.4} h={0.12} bg="#141516" col="#f2c21b" p={[0, 0.26, 0.02]} />
    </group>
    {/* la caja con la barra de batería grande que baja */}
    <group position={[0.2, 0, 0.12]} rotation={[0, -0.15, 0]} scale={1.6}>
      <PBox w={0.26} h={0.3} d={0.16} />
      <RBox s={[0.22, 0.26, 0.01]} p={[0, 0.15, 0.088]} r={0.008}>{M.matte({ col: "#0b0d0f" })}</RBox>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 0.035 + i * 0.019, 0.094]}><planeGeometry args={[0.18, 0.014]} />{M.glow({ col: i < bars ? (pct < 20 ? "#ff5a4a" : "#6fe39a") : "#22302a" })}</mesh>)}
      <Txt3 txt={`${pct}%`} w={0.2} h={0.075} col={pct < 20 ? "#ff6a5a" : "#f2c21b"} bg="#0b0d0f" glow p={[0, 0.25, 0.095]} />
    </group>
  </>;
}}</Scene3D>;

// 19:34 · LA ENTRADA CORRECTA: el cable del generador encaja con un clic en la toma de entrada de la pared y prende la luz verde; al lado, el cable de dos machos tirado echa una chispa
export const HInlet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#0e1014"
  cam={{ at: [0.04, 0.28, 0.05], az: [-0.18, 0.1], el: [0.2, 0.14], r: [1.32, 1.14], fov: 30 }} warm={1.2} lamp={[0, 0.8, 0.5]}>{(tt) => {
  const lid = eio(tt, 0.3, 0.9), push = eio(tt, 0.9, 1.7), click = tt > 1.7, ok = cl((tt - 1.75) / 0.2);
  return <>
    {/* pared de tablas de la casa */}
    <mesh position={[0, 0.45, -0.12]} receiveShadow><boxGeometry args={[1.8, 0.95, 0.04]} />{M.matte({ col: "#8a8476" })}</mesh>
    {/* la toma de entrada con tapa abatible */}
    <group position={[-0.25, 0.42, -0.09]}>
      <RBox s={[0.16, 0.2, 0.05]} r={0.012}>{M.matte({ col: "#7c8288" })}</RBox>
      <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.045, 32]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0.06, 0.08, 0.027]}><circleGeometry args={[0.01, 16]} />{M.glow({ col: ok > 0.5 ? "#6fe39a" : "#2a3a30" })}</mesh>
      <pointLight position={[0.06, 0.08, 0.08]} intensity={0.35 * ok} distance={0.35} color="#6fe39a" />
      <group position={[0, 0.1, 0.03]} rotation={[-1.7 * lid, 0, 0]}><RBox s={[0.14, 0.18, 0.012]} p={[0, -0.09, 0]} r={0.008}>{M.matte({ col: "#8a9096" })}</RBox></group>
    </group>
    {/* el cable del generador: la ficha redonda avanza y encaja */}
    <group position={[-0.25, 0.42, lerp(0.3, -0.03, push) + (click && tt < 1.8 ? 0.004 : 0)]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.045, 0.07, 28]} />{M.rubber({ col: "#f2c21b" })}</mesh>
    </group>
    <mesh geometry={tubeG("gen", [[-0.25, 0.42, lerp(0.34, 0.01, push)], [-0.2, 0.25, 0.3], [-0.1, 0.02, 0.5]], 0.014, 40, 8)}>{M.rubber({ col: "#f2c21b" })}</mesh>
    {/* el cable de dos machos tirado en el piso: las dos fichas macho se miran, sin hembra; chispa */}
    <group position={[0.24 + 0.03 * cl(1 - Math.abs(tt - 2.7) / 0.15), 0.03, 0.14]} rotation={[0, -0.35, 0]} scale={2.2}>
      <pointLight position={[0, 0.12, 0.05]} intensity={1.4 * cl(Math.sin(tt * 6)) * cl((tt - 2.5) * 3)} distance={0.6} color="#ff4a3a" />
      <mesh geometry={tubeG("sui", [[-0.18, 0.01, 0], [-0.05, 0.01, 0.12], [0.08, 0.01, 0.05], [0.18, 0.01, 0]], 0.009, 40, 8)}>{M.rubber({ col: "#222" })}</mesh>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.2, 0.03, 0]} rotation={[0, 0, s > 0 ? PI / 2 : -PI / 2]}>
        <RBox s={[0.05, 0.06, 0.035]} r={0.008}>{M.rubber({ col: "#222" })}</RBox>
        {[-0.012, 0.012].map((x) => <mesh key={x} position={[x, 0.042, 0]}><boxGeometry args={[0.005, 0.03, 0.014]} />{M.brass()}</mesh>)}
      </group>)}
      <Spark p={[0.24, 0.04, 0]} k={(tt - 2.6) / 0.45} s={1.5} />
      <Spark p={[-0.24, 0.04, 0]} k={(tt - 3.4) / 0.45} s={1.5} />
    </group>
  </>;
}}</Scene3D>;

// 20:49 · LA ESTUFA ELÉCTRICA: las resistencias se ponen naranjas y el reloj de arena grande de la caja se vacía hacia la estufa en media hora
export const HHeater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0d0b0a"
  cam={{ at: [-0.04, 0.32, 0], az: [0.16, 0.02], el: [0.2, 0.15], r: [1.78, 1.58], fov: 30 }}>{(tt) => {
  const lvl = 1 - eio(tt, 0.4, 4.4), min = Math.round(30 * eio(tt, 0.8, 4.4)), glow = cl((tt - 0.4) / 0.8) * (1 - cl((tt - 4.45) / 0.08)), pop2 = cl(1 - Math.abs(tt - 4.47) / 0.1);
  const bars = Math.ceil(lvl * 10);
  return <>
    {/* la caja de batería al lado: la barra baja a la par de la arena y queda roja vacía */}
    <group position={[-0.04, 0, 0.04]} rotation={[0, -0.05, 0]} scale={pop(tt, 0.3) * 1.3}>
      <PBox w={0.22} h={0.26} d={0.14} />
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.06, 0.035 + i * 0.019, 0.0715]}><planeGeometry args={[0.06, 0.015]} />{M.glow({ col: i < bars ? (lvl < 0.25 ? "#ff5a4a" : "#6fe39a") : lvl < 0.02 ? "#5a1a14" : "#22302a" })}</mesh>)}
    </group>
    <pointLight position={[0.38, 0.2, 0.25]} intensity={4 * pop2} distance={1} color="#fff2d0" />

    <group position={[0.38, 0, 0]} rotation={[0, -0.3, 0]}>
      <RBox s={[0.28, 0.32, 0.12]} p={[0, 0.16, 0]} r={0.02}>{M.plastic({ col: "#b9b4aa" })}</RBox>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.1 + i * 0.06, 0.061]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.22, 12]} /><meshStandardMaterial color="#3a2a20" emissive="#ff5a10" emissiveIntensity={1.1 * glow} toneMapped={false} /></mesh>)}
      {Array.from({ length: 8 }, (_, i) => <mesh key={"g" + i} position={[-0.105 + i * 0.03, 0.16, 0.068]}><boxGeometry args={[0.004, 0.24, 0.004]} />{M.steel({ col: "#6a6d72" })}</mesh>)}
      <pointLight position={[0, 0.16, 0.25]} intensity={1.0 * glow} distance={1} color="#ff8a3a" />
      <Txt3 txt="1500 W" w={0.3} h={0.1} bg="#141516" col="#ffb07a" p={[0, 0.42, 0]} s={pop(tt, 0.6)} />
    </group>
    {/* reloj de arena grande: la carga verde cae y se va */}
    <group position={[-0.48, 0, 0.05]} scale={1.4}>
      {[0.03, 0.33].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />{M.wood({ base: [120, 80, 46] })}</mesh>)}
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.085, 0.18, 0]}><cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />{M.wood({ base: [120, 80, 46] })}</mesh>)}
      <mesh position={[0, 0.25, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.075, 0.14, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.11, 0]}><coneGeometry args={[0.075, 0.14, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.19 + 0.06 * Math.max(0.001, lvl), 0]} scale={[Math.max(0.001, lvl), Math.max(0.001, lvl), Math.max(0.001, lvl)]} rotation={[PI, 0, 0]}><coneGeometry args={[0.068, 0.12, 32]} />{M.glow({ col: "#6fe39a" })}</mesh>
      <mesh position={[0, 0.04 + 0.05 * (1 - lvl), 0]} scale={[Math.max(0.001, 1 - lvl), Math.max(0.001, 1 - lvl), Math.max(0.001, 1 - lvl)]}><coneGeometry args={[0.068, 0.1, 32]} />{M.glow({ col: "#2f7a4c" })}</mesh>
      <mesh position={[0, 0.18, 0]} scale={[1, lvl > 0.02 ? 1 : 0.001, 1]}><cylinderGeometry args={[0.002, 0.002, 0.13, 6]} />{M.glow({ col: "#6fe39a" })}</mesh>
    </group>
    <Txt3 txt={`${min} MIN`} w={0.3} h={0.1} col={min >= 30 ? "#ff5a4a" : "#f7f4ee"} glow p={[-0.48, 0.62, 0.05]} />
  </>;
}}</Scene3D>;
