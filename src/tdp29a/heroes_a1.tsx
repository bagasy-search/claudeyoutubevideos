// tdp29a · componentes 1-11 (hikikomori): cada idea es un objeto 3D con material y luz que se entiende sin leer.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Balance, Bowl, Fig, House, Shoji, Tatami } from "./tkit3d";

// bandeja laqueada roja con arroz, sopa y pescado (la de la señora Mori)
export const Tray: React.FC<{ p?: number[]; r?: number[]; s?: number; chip?: boolean; food?: boolean }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, chip = false, food = true }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.3, 0.012, 0.2]} r={0.006} p={[0, 0.006, 0]}><meshPhysicalMaterial color="#6e1414" roughness={0.18} clearcoat={1} clearcoatRoughness={0.06} /></RBox>
    {[[0, 0.1], [0, -0.1]].map(([x, z], i) => <RBox key={i} s={[0.3, 0.02, 0.008]} r={0.003} p={[x, 0.018, z]}><meshPhysicalMaterial color="#5a1010" roughness={0.2} clearcoat={1} /></RBox>)}
    {chip && <mesh position={[0.148, 0.02, 0.098]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#3a2a1e" roughness={0.9} /></mesh>}
    {food && <>
      <Bowl p={[-0.07, 0.012, 0.03]} s={0.9} />
      <Bowl p={[0.02, 0.012, 0.04]} s={0.85} soup />
      <mesh position={[0.08, 0.016, -0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.09, 0.05]} />{M.porcelain({ col: "#f3efe6" })}</mesh>
      <mesh position={[0.08, 0.024, -0.05]} rotation={[0, 0.2, PI / 2]} scale={[1, 1, 0.45]}><capsuleGeometry args={[0.012, 0.05, 6, 12]} /><meshStandardMaterial color="#b9773e" roughness={0.5} /></mesh>
    </>}
  </group>;

// ---- 0:21 · CADA NOCHE, ONCE AÑOS: las bandejas se apilan junto a la puerta cerrada y el contador de bronce rueda hasta 4.000 noches ----
export const HTrays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0.2, 0.5, 0.4]}
  cam={{ at: [0.05, 0.16, 0], at1: [0.05, 0.22, 0], az: [-0.45, -0.2], el: [0.18, 0.28], r: [1.3, 1.15], fov: 32 }}>{(tt) => {
  const n = 4015 * eio(tt, 0.4, 5.6), k = Math.floor(18 * eio(tt, 0.4, 5.6));
  return <>
    <Shoji p={[0.05, 0, -0.18]} s={0.9} light={0.45} />
    {Array.from({ length: 18 }, (_, i) => <group key={i} position={[-0.12, 0.016 * i + (i === k ? fallY(tt, 0.4 + i * 0.29, 0.25, 9) : 0), 0.05]} rotation={[0, (rn(i, 3) - 0.5) * 0.25, 0]}>
      {i <= k && <Tray s={0.9} food={i === k} chip={i % 5 === 2} />}
    </group>)}
    <group position={[0.24, 0.13, 0.14]} rotation={[0, -0.4, 0]} scale={1.55 * pop(tt, 0.2)}>
      <RBox s={[0.26, 0.1, 0.09]} r={0.012}>{M.brass({ col: "#b88a34" })}</RBox>
      {[0, 1, 2, 3].map((d) => { const v = Math.floor(n / Math.pow(10, 3 - d)) % 10 + (d === 3 ? n % 1 : 0); return <DigitDrum key={d} v={v} p={[-0.075 + d * 0.05, 0.005, 0.046]} r={0.03} w={0.04} />; })}
      <Sheet map={txt("trn", ["NIGHTS"], { w: 256, h: 64, bg: "#b88a34", fg: "#2a1c08", size: 44 })} w={0.12} h={0.03} p={[0, -0.07, 0.046]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 0:39 · UN MILLÓN Y MEDIO DE PUERTAS: un pasillo de puertas de papel que no termina, cada una con su luz; el contador sube ----
export const HDoors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#0b0d12"
  cam={{ at: [0, 0.32, -1.2], at1: [0, 0.32, -1.8], az: [0.02, -0.02], el: [0.02, 0.05], r: [1.8, 1.5], fov: 38 }}>{(tt) => {
  const n = 1460000 * eio(tt, 0.6, 5.2);
  return <>
    {Array.from({ length: 22 }, (_, i) => { const sd = i % 2 ? 1 : -1, z = 0.2 - Math.floor(i / 2) * 0.42, a = 0.2 + i * 0.12;
      return <group key={i} scale={pop(tt, a, 8, 0.55)}><Shoji p={[sd * 0.32, 0, z]} r={[0, -sd * PI / 2, 0]} s={0.8} open={0.5 * (1 - eio(tt, 1.0 + i * 0.17, 1.35 + i * 0.17))} light={0.25 + 0.4 * rn(i, 2)} /></group>; })}
    <group position={[0, 0.36, -0.7]} scale={1.2 * pop(tt, 0.3)}>
      {[0, 1, 2, 3, 4, 5, 6].map((d) => { const v = Math.floor(n / Math.pow(10, 6 - d)) % 10; return <DigitDrum key={d} v={v} p={[-0.18 + d * 0.06, 0, 0]} r={0.035} w={0.05} />; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 0:59 · NO SON LOS JUEGOS: el joystick y la almohada se hunden en el tatami; queda una figurita arrodillada frente a la puerta, inclinándose de más ----
export const HNotThis: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15130f" lamp={[0, 0.5, 0.2]}
  cam={{ at: [0, 0.1, -0.05], az: [-0.35, 0.2], el: [0.35, 0.22], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const sink = (a: number) => -0.25 * eio(tt, a - 0.3, a + 0.5), bow = 0.9 * eio(tt, 3.9, 5.0);
  return <>
    <Tatami w={1.2} d={0.9} />
    <group position={[-0.2 - 0.12 * eio(tt, 1.1, 1.6), 0.02 + sink(1.6), 0.06 + 0.08 * eio(tt, 1.1, 1.6)]} rotation={[0, 0.4 + 1.2 * eio(tt, 1.1, 1.6), 0.3 * eio(tt, 1.3, 2.0)]} scale={1.4 * pop(tt, 0.2)}>
      <RBox s={[0.14, 0.03, 0.08]} r={0.02}>{M.plastic({ col: "#2b2d31" })}</RBox>
      {[[-0.04, 0], [0.04, 0.01], [0.05, -0.012]].map(([x, z], i) => <mesh key={i} position={[x, 0.018, z]}><cylinderGeometry args={[0.009, 0.009, 0.008, 16]} />{M.plastic({ col: ["#c0392b", "#2f7a3a", "#d9a84a"][i] })}</mesh>)}
    </group>
    <group position={[0.2, 0.035 + sink(2.1), 0.04]} rotation={[0, 0, -0.3 * eio(tt, 2.1, 2.8)]} scale={pop(tt, 0.45)}><RBox s={[0.24, 0.07, 0.15]} r={0.035}>{M.matte({ col: "#e9e2d2" })}</RBox></group>
    <group position={[0, 0, -0.3]} scale={pop(tt, 0.2)}><Shoji s={0.6} light={0.45 * eio(tt, 2.8, 3.6)} /></group>
    <group position={[0, 0, 0.0]} rotation={[0, PI, 0]} scale={1.7 * pop(tt, 0.3)}><Fig sit={1} bow={bow + 0.3 * eio(tt, 0.8, 1.2) * (1 - eio(tt, 1.8, 2.3))} head={0.3 * bow} arm={0.9 * eio(tt, 0.8, 1.3) * (1 - eio(tt, 2.4, 3.0))} /></group>
  </>;
}}</Scene3D>;

// ---- 1:44 · LA CASA DE SAITAMA, EN CORTE: abajo la madre sube la escalera con la bandeja; arriba, detrás del shoji, la única luz que nunca se apaga ----
export const HHouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#101624" warm={0.6}
  cam={{ at: [0, 0.24, 0], az: [-0.35, 0.22], el: [0.12, 0.18], r: [1.3, 1.12], fov: 30 }}>{(tt) => {
  const a = eio(tt, 0.5, 1.3), b = eio(tt, 1.3, 3.5), set = eio(tt, 3.7, 4.3), back = eio(tt, 4.6, 5.6);
  const mx = b > 0 ? lerp(-0.13, 0.11, b) : lerp(-0.28, -0.13, a), my = 0.012 + 0.205 * b;
  const wall = (s: number[], p: number[], col = "#e8e0cf") => <RBox s={s} r={0.004} p={p}>{M.matte({ col })}</RBox>;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.8, 48]} /><meshStandardMaterial color="#33402c" roughness={0.95} /></mesh>
    <group scale={pop(tt, 0.1)}>
      {wall([0.72, 0.012, 0.32], [0, 0.006, 0], "#8a6440")}{wall([0.72, 0.012, 0.32], [0, 0.222, 0], "#8a6440")}
      {wall([0.72, 0.46, 0.012], [0, 0.23, -0.16])}{wall([0.012, 0.46, 0.32], [-0.36, 0.23, 0])}{wall([0.012, 0.46, 0.32], [0.36, 0.23, 0])}
      <mesh position={[0, 0.5, 0.0]} rotation={[0, PI / 4, 0]} scale={[1.45, 1, 0.65]} castShadow><coneGeometry args={[0.36, 0.13, 4]} />{M.matte({ col: "#3a3d44" })}</mesh>
      {/* escalera de 7 escalones contra la pared del fondo */}
      {Array.from({ length: 7 }, (_, i) => wall([0.04, 0.03 * (i + 1), 0.09], [-0.11 + i * 0.037, 0.012 + 0.015 * (i + 1), -0.1], "#6e4c30"))}
      {/* arriba: tabique de shoji; del otro lado el hijo sentado y la ventana que no se apaga */}
      <group position={[0.17, 0.228, 0.01]} rotation={[0, PI / 2, 0]}><Shoji s={0.26} light={0.7} /></group>
      <group position={[0.27, 0.228, 0.02]} rotation={[0, -0.6, 0]} scale={0.8}><Fig sit={1} bow={0.35} col="#8a6a4a" /></group>
      <mesh position={[0.27, 0.34, -0.153]}><planeGeometry args={[0.09, 0.08]} />{M.glow({ col: "#ffcf8a" })}</mesh>
      <pointLight position={[0.27, 0.36, 0.0]} intensity={0.35} distance={0.35} color="#ffcf8a" />
      {/* abajo: la cocina, con la luz que se prende y se apaga */}
      <mesh position={[-0.22, 0.12, -0.153]}><planeGeometry args={[0.09, 0.08]} />{M.glow({ col: "#ffcf8a", op: 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(tt * 2.2)) })}</mesh>
      {wall([0.1, 0.05, 0.07], [-0.26, 0.037, 0.03], "#7a5536")}
    </group>
    <group position={[lerp(mx, -0.2, back), back > 0 ? lerp(my, 0.012, back) : my, 0.03]} rotation={[0, back > 0.01 ? -PI / 2 : PI / 2, 0]} scale={0.95 * pop(tt, 0.4)}>
      <Fig col="#8a6a4a" arm={0.35 * (1 - set)} bow={0.15 + 0.25 * set} />
    </group>
    <group position={set > 0 ? [lerp(mx + 0.01, 0.14, set), lerp(my + 0.12, 0.232, set), 0.03] : [mx + 0.01, my + 0.12, 0.03]} scale={0.32 * pop(tt, 0.4)}><Tray food /></group>
  </>;
}}</Scene3D>;

// ---- 2:17 · GOLPEAR PARA AVISAR, NO PARA HABLAR: la madre arrodillada golpea dos veces, deja la bandeja junto a la puerta y baja la cabeza ----
export const HKnock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" lamp={[0.3, 0.55, 0.45]}
  cam={{ at: [0.07, 0.16, 0.1], az: [0.55, 0.3], el: [0.2, 0.15], r: [1.2, 1.05], fov: 32 }}>{(tt) => {
  const knk = (a: number) => Math.exp(-Math.pow((tt - a) * 9, 2)), hit = knk(0.9) + knk(1.25) + knk(4.4) + knk(4.75), put = eio(tt, 2.2, 3.0);
  return <>
    <Shoji p={[0, 0, -0.05]} s={0.75} light={0.3} />
    {[0.9, 1.25, 4.4, 4.75].map((a, i) => { const k = cl((tt - a) / 0.9); return k > 0 && k < 1 ? <mesh key={i} position={[0.06, 0.2, -0.03]} scale={0.05 + 0.35 * k}><torusGeometry args={[0.5, 0.012, 8, 64]} />{M.glow({ col: "#ffd59a", op: 1 - k })}</mesh> : null; })}
    <group position={[0.16, 0, 0.17]} rotation={[0, PI + 0.5, 0]} scale={1.55 * pop(tt, 0.2)}>
      <Fig col="#8a6a4a" sit={1} arm={0.5 + 0.12 * hit} bow={0.1 + 0.35 * eio(tt, 3.2, 3.9)} head={0.3 * eio(tt, 3.2, 3.9)} />
    </group>
    <group position={[lerp(0.24, 0.05, put), 0, lerp(0.3, 0.1, put)]} scale={0.75 * pop(tt, 0.3)}><Tray food /></group>
  </>;
}}</Scene3D>;

// ---- 2:32 · LA BANDEJA PESA MÁS QUE LA CARTERA: balanza de bronce; de un lado la bandeja astillada, del otro su cartera; gana la bandeja ----
export const HTrayChip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0, 0.7, 0.4]}
  cam={{ at: [0, 0.22, 0], az: [-0.15, 0.15], el: [0.12, 0.2], r: [0.95, 0.8], fov: 30 }}>{(tt) => {
  const tilt = -0.85 * phys(tt, 2.2, 5, 0.35) + 0.4 * (1 - eio(tt, 0.4, 1.4));
  return <>
    <Balance p={[0, 0, 0]} s={1.2} tilt={tilt}
      left={<group scale={0.42 * pop(tt, 0.5)}>{[0, 1, 2, 3, 4].map((i) => <Tray key={i} p={[0, i * 0.025, 0]} r={[0, rn(i, 4) * 0.3, 0]} chip={i === 4} food={false} />)}</group>}
      right={<group scale={pop(tt, 1.0)} position={[0, -0.03, 0]}>
        <RBox s={[0.1, 0.06, 0.035]} r={0.012} p={[0, 0.03, 0]}>{M.matte({ col: "#3a2a20" })}</RBox>
        <mesh position={[0, 0.07, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.03, 0.004, 8, 24, PI]} />{M.matte({ col: "#3a2a20" })}</mesh>
      </group>} />
    <Sheet map={txt("hb", ["more than my own handbag"], { w: 768, h: 90, bg: "#5e3d24", fg: "#f6ead0", size: 50, font: HANDF })} w={0.5} h={0.058} p={[0, 0.58, -0.05]} s={pop(tt, 3.0)} />
  </>;
}}</Scene3D>;

// ---- 3:07 · DOS DE CADA CIEN: cien figuritas en la vereda; dos se sientan y a su alrededor se levantan cuatro paredes de papel ----
export const HHundred: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#121418"
  cam={{ at: [0, 0.08, -0.05], at1: [0.03, 0.08, 0], az: [0.5, 0.15], el: [0.7, 0.55], r: [1.45, 1.25], fov: 32 }}>{(tt) => {
  const two = [34, 77], wall = eio(tt, 2.6, 3.8);
  return <>
    {Array.from({ length: 100 }, (_, i) => { const x = -0.45 + (i % 10) * 0.1, z = -0.45 + Math.floor(i / 10) * 0.1, me = two.includes(i), a = 0.1 + rn(i, 7) * 1.2;
      return <group key={i} position={[x, 0, z]} scale={0.55 * pop(tt, a, 9, 0.5)}>
        <Fig sit={me ? eio(tt, 2.0, 2.8) : 0} col={me ? "#8a6a4a" : "#c9a27a"} r={[0, rn(i, 2) * 6, 0]} />
        {me && [0, 1, 2, 3].map((k) => <mesh key={k} position={[Math.sin(k * PI / 2) * 0.09, 0.11 * wall, Math.cos(k * PI / 2) * 0.09]} rotation={[0, k * PI / 2, 0]} scale={[1, Math.max(0.001, wall), 1]}>
          <planeGeometry args={[0.18, 0.22]} /><meshStandardMaterial color="#efe6d0" emissive="#ffb766" emissiveIntensity={0.25} side={THREE.DoubleSide} roughness={0.9} /></mesh>)}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 3:23 · EL LIBRO DE 1998: un libro se abre sobre el escritorio del psiquiatra y de sus páginas se levantan la puerta y la bandeja ----
export const HBook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0.25, 0.55, 0.3]}
  cam={{ at: [0, 0.08, 0], az: [-0.2, 0.15], el: [0.6, 0.48], r: [0.75, 0.65], fov: 30 }}>{(tt) => {
  const open = eio(tt, 0.4, 1.6), up = pop(tt, 2.2, 6, 0.5);
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.02, 0.28]} r={0.006} p={[-0.1, 0.01, 0]}>{M.matte({ col: "#2c3b55" })}</RBox>
      <group position={[0, 0.02, 0]} rotation={[0, 0, PI * (1 - open)]}>
        <RBox s={[0.2, 0.012, 0.28]} r={0.006} p={[0.1, 0, 0]}>{M.matte({ col: "#2c3b55" })}</RBox>
        <mesh position={[0.1, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.19, 0.27]} /><meshStandardMaterial map={txt("bk2", ["HIKIKOMORI", "", "1998"], { w: 380, h: 540, bg: "#f6f1e3", fg: "#2a2a30", size: 46, lh: 70 })} roughness={0.9} /></mesh>
      </group>
      <mesh position={[-0.1, 0.0205, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.19, 0.27]} /><meshStandardMaterial map={txt("bk1", ["", "", ""], { w: 380, h: 540, bg: "#f6f1e3", fg: "#46506a", size: 34, lh: 90, font: HANDF })} roughness={0.9} /></mesh>
    </group>
    <group position={[0, 0.02, -0.06]} rotation={[-PI / 2 * (1 - eio(tt, 2.2, 3.0)), 0, 0]} scale={0.55 * pop(tt, 2.1)}><Shoji s={0.4} light={0.4} /></group>
    <group position={[-0.1, 0.04 + 0.1 * eio(tt, 2.8, 3.6), 0.03]} scale={0.45 * pop(tt, 2.8)}><Tray /></group>
  </>;
}}</Scene3D>;

// ---- 3:58 · SE DUPLICÓ: dos columnas de vidrio; la de 15-39 ya estaba llena, la de 40-64 se llena igual y el total salta al doble ----
export const HDoubled: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark"
  cam={{ at: [0, 0.42, 0], az: [-0.3, 0.2], el: [0.15, 0.2], r: [1.95, 1.75], fov: 30 }}>{(tt) => {
  const col = (x: number, n: number, a: number, dt: number, hgt: number, lab: string, seed: number) => <group position={[x, 0, 0]}>
    <mesh position={[0, hgt / 2, 0]}><cylinderGeometry args={[0.08, 0.08, hgt, 40, 1, true]} />{M.glass({})}</mesh>
    {Array.from({ length: n }, (_, i) => { const ai = a + i * dt; return tt > ai ? <mesh key={i} position={[(rn(i, seed) - 0.5) * 0.06, 0.012 + i * 0.026 + fallY(tt, ai, 0.35), (rn(i, seed + 1) - 0.5) * 0.06]} rotation={[0, rn(i, seed + 2) * 3, 0]}><cylinderGeometry args={[0.03, 0.03, 0.022, 24]} />{M.wood({ base: [190, 150, 110] })}</mesh> : null; })}
    <Sheet map={txt("dl" + lab, [lab], { w: 256, h: 80, bg: "#24262a", fg: "#f2e3c0", size: 54 })} w={0.14} h={0.044} p={[0, hgt + 0.05, 0]} />
  </group>;
  return <>
    {col(-0.13, 11, 0.3, 0.1, 0.36, "15-39", 3)}
    {col(0.13, 24, 1.8, 0.13, 0.7, "40-64", 9)}
  </>;
}}</Scene3D>;

// ---- 4:31 · MEIWAKU: una figurita en el tatami se achica para no ocupar lugar; el círculo de su espacio se cierra ----
export const HMeiwaku: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.08, 0.04], az: [0.2, -0.2], el: [0.55, 0.65], r: [1.08, 0.95], fov: 30 }}>{(tt) => {
  const k = 1 - 0.5 * eio(tt, 1.0, 5.0);
  return <>
    <Tatami w={1.4} d={1.0} />
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]} scale={k}><ringGeometry args={[0.2, 0.208, 64]} />{M.glow({ col: "#ffcf8a" })}</mesh>
    <group scale={1.4 * k * pop(tt, 0.2)}><Fig bow={0.5 * eio(tt, 1.2, 2.4)} /></group>
    {[[-0.36, 0.16], [0.38, -0.14], [0.24, 0.2], [-0.28, -0.22]].map(([x, z], i) => <group key={i} position={[x, 0, z]} scale={pop(tt, 0.6 + i * 0.2)}><Fig r={[0, Math.atan2(-x, -z), 0]} col="#8a6a4a" bow={0.35 * eio(tt, 2.0 + i * 0.4, 2.8 + i * 0.4)} /></group>)}
    <Sheet map={txt("mw", ["MEIWAKU", "being a bother"], { w: 512, h: 180, bg: "#16130f", fg: "#f2e3c0", size: 70, font: HANDF })} w={0.36} h={0.12} p={[0, 0.006, 0.28]} r={[-PI / 2, 0, 0]} s={pop(tt, 2.2)} />
  </>;
}}</Scene3D>;

// ---- 5:22 · CERRADA DE LOS DOS LADOS: la cámara rodea la puerta; de un lado el hijo y «haji», del otro los padres y «sekentei»; dos pasadores se corren ----
export const HBothSides: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#101114" lamp={[0, 0.7, 0]}
  cam={{ at: [0.2, 0.3, 0], az: [0.9, 2.4], el: [0.18, 0.18], r: [1.3, 1.25], fov: 34 }}>{(tt) => {
  const b1 = eio(tt, 1.6, 2.2), b2 = eio(tt, 4.4, 5.0);
  const bolt = (z: number, k: number) => <group position={[0.42, 0.4, z]}><RBox s={[0.08, 0.02, 0.02]} r={0.004}>{M.brass()}</RBox>
    <mesh position={[0.02 - 0.06 * k, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.007, 0.09, 12]} />{M.brass()}</mesh></group>;
  return <>
    <Shoji p={[0, 0, 0]} s={0.85} light={0.2} />
    {bolt(0.03, b1)}{bolt(-0.03, b2)}
    <group position={[0.2, 0, 0.35]} rotation={[0, PI, 0]} scale={1.5 * pop(tt, 0.4)}><Fig sit={1} bow={0.5} /></group>
    <group position={[0.12, 0, -0.35]} scale={1.5 * pop(tt, 3.2)}><Fig bow={0.35} /></group>
    <group position={[0.3, 0, -0.38]} scale={1.45 * pop(tt, 3.4)}><Fig bow={0.35} col="#8a6a4a" /></group>
    {[[-0.1, -0.5], [0.14, -0.56], [0.36, -0.52]].map(([x, z], i) => <group key={"n" + i}><group position={[x, 0, z]} rotation={[0, 0.1 * (i - 1), 0]} scale={1.6 * pop(tt, 3.9 + i * 0.25)}><Fig col="#3a3430" head={-0.15} /></group>
      <mesh position={[x * 0.6 + 0.08, 0.004, z + 0.55]} rotation={[-PI / 2, 0, -0.12 * (i - 1)]} scale={[1, Math.max(0.001, eio(tt, 3.9 + i * 0.25, 4.7 + i * 0.25)), 1]}><planeGeometry args={[0.09, 1.1]} /><meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} /></mesh></group>)}
  </>;
}}</Scene3D>;
