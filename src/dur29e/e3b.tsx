// dur29e · bloque B (top 5, América del Norte, América del Sur, Oceanía, Antártida y cierre):
// un mecanismo por componente, objetos grandes y enteros, sombra de contacto, sin carteles para leer. Luces siempre montadas (rampa).
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { EnSitio, fallY, latheG, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { PI, sm, Coin } from "./c3k";
import { Sh, Seg, Polvo, Balde } from "./e3a";

type UP = { d: number; p: any };
const SNOW = [226, 230, 236];

// ---------- piezas ----------
const Arbol: React.FC<{ h?: number; col?: string; leaf?: number }> = ({ h = 0.5, col = "#3a6a2a", leaf = 1 }) => <group>
  <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.025, 0.035, h, 10]} />{M.wood({ base: [110, 84, 60] })}</mesh>
  <mesh position={[0, h, 0]} scale={sm(leaf)}><dodecahedronGeometry args={[0.14, 1]} /><meshStandardMaterial color={col} roughness={0.9} /></mesh>
</group>;
const Gota: React.FC<{ p: number[]; s?: number; col?: string }> = ({ p, s = 1, col = "#f4f2ee" }) => <mesh position={p as any} scale={[s, s * 1.4, s]}><sphereGeometry args={[0.012, 12, 10]} /><meshStandardMaterial color={col} roughness={0.3} /></mesh>;

// ======================= TOP 5 =======================

// ---- CincoPeligros · un solo pedestal: el objeto del número que se dice baja; el anterior se va. Aire = frasco que se vacía,
// profundidad = plomada que baja, caída = soga cortada, clima = termómetro, deuda = libro con cadena ----
const T5 = ["cinco", "cuatro", "tres", "dos", "uno"];
const Obj5: React.FC<{ i: number; tt: number; on: number }> = ({ i, tt, on }) => {
  if (i === 0) return <group><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.07, 0.07, 0.2, 28]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.21, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />{M.brass()}</mesh>
    {Array.from({ length: 8 }, (_, k) => { const y = 0.03 + ((tt * 0.3 + k / 8) % 1) * 0.16; return <mesh key={k} position={[0.03 * Math.sin(k * 2), y, 0.03 * Math.cos(k * 2)]} scale={sm(0.012 * (1 - on))}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#d8f0ff" transparent opacity={0.6} /></mesh>; })}</group>;
  if (i === 1) return <group><mesh position={[0, 0.26, 0]}><cylinderGeometry args={[0.003, 0.003, 0.0 + 0.04, 6]} /><meshStandardMaterial color="#c8a878" /></mesh>
    <Seg a={[0, 0.3, 0]} b={[0, 0.3 - 0.18 * (0.2 + 0.8 * on), 0]} r={0.002}><meshStandardMaterial color="#c8a878" /></Seg>
    <mesh position={[0, 0.3 - 0.18 * (0.2 + 0.8 * on) - 0.03, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.03, 0.06, 20]} />{M.brass()}</mesh>
    <RBox s={[0.16, 0.012, 0.012]} r={0.003} p={[0, 0.3, 0]}>{M.wood()}</RBox><mesh position={[-0.07, 0.15, 0]}><cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />{M.wood()}</mesh></group>;
  if (i === 2) return <group>{[-1, 1].map((s) => <group key={s} position={[s * (0.02 + 0.05 * on), 0.12 - (s > 0 ? 0.08 * on : 0), 0]} rotation={[0, 0, s * 0.4 * on]}>
    <mesh position={[0, s * 0.06, 0]}><cylinderGeometry args={[0.012, 0.012, 0.12, 10]} /><meshStandardMaterial color="#b89a68" roughness={1} /></mesh>
    {[0, 1, 2].map((k) => <mesh key={k} position={[0.006 * (k - 1), s > 0 ? -0.0 : 0.0, 0]} rotation={[0, 0, (k - 1) * 0.5]}><cylinderGeometry args={[0.003, 0.003, 0.03, 4]} /><meshStandardMaterial color="#c8aa78" /></mesh>)}</group>)}</group>;
  if (i === 3) return <group><mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.018, 0.018, 0.28, 16]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#c0281e" emissive="#ff2010" emissiveIntensity={0.4 + 0.6 * on} /></mesh>
    <mesh position={[0, 0.04 + 0.12 * (0.2 + 0.8 * on) / 2, 0]}><cylinderGeometry args={[0.008, 0.008, sm(0.12 * (0.2 + 0.8 * on)), 10]} /><meshStandardMaterial color="#c0281e" emissive="#ff2010" emissiveIntensity={0.5} /></mesh></group>;
  return <group><RBox s={[0.18, 0.05, 0.13]} r={0.01} p={[0, 0.025, 0]}><meshStandardMaterial color="#5a2a1a" roughness={0.8} /></RBox>
    <RBox s={[0.17, 0.04, 0.12]} r={0.004} p={[0.004, 0.026, 0]}><meshStandardMaterial color="#efe6d0" /></RBox>
    {Array.from({ length: 9 }, (_, k) => <mesh key={k} position={[-0.12 + k * 0.03, 0.05 + 0.01 * Math.sin(k), 0.07]} rotation={[0, 0, k % 2 ? PI / 2 : 0]}><torusGeometry args={[0.012, 0.004, 6, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>)}</group>;
};
const CincoPeligros: React.FC<UP> = ({ d, p }) => {
  const at = T5.map((k, i) => sec(p, k, 0.4 + i * 3));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-0.8, 2.6, 2.0]}
    cam={{ at: [0, 0.3, 0], az: [-0.12, 0.06], el: [0.16, 0.14], r: [1.75, 1.6], fov: 34 }}>{(tt) => {
    const c = at.reduce((k, a, i) => (tt >= a ? i : k), -1), lx = (Math.max(0, c) - 2) * 0.32;
    return <>
      <RBox s={[1.7, 0.18, 0.36]} r={0.02} p={[0, 0.09, 0]}><meshStandardMaterial map={dirtT([150, 142, 128])} roughness={0.95} /></RBox>
      {at.map((a, i) => { const x = (i - 2) * 0.32, on = i === c ? eio(tt, a + 0.3, a + 0.8) : (i < c ? 0.25 : 0);
        return <group key={i} position={[x, 0.18 + fallY(tt, a, 0.7), 0]} visible={tt > a - 0.3}>
          <Sh p={[0, 0, 0]} r={0.12} op={0.5} /><group scale={1.25 + 0.15 * (i === c ? eio(tt, a + 0.3, a + 0.8) : 0)}><Obj5 i={i} tt={tt} on={on} /></group></group>; })}
      <pointLight position={[lx, 0.75, 0.35]} intensity={0.0001 + 2.2 * (c >= 0 ? 1 : 0)} distance={1.2} color="#ffe8c0" />
      <spotLight position={[0, 2.2, 0.8]} angle={0.5} penumbra={0.7} intensity={7} distance={3.5} color="#ffe8c0" />
    </>;
  }}</U3>;
};

// ======================= AMÉRICA DEL NORTE · CENTRAL PACIFIC =======================

// ---- GranitoBarra · la pared de granito en la nieve; el martillo cae sobre la barra y la barra se hunde golpe a golpe, con esquirlas ----
const GranitoBarra: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "martillo", 0.6), B = 0.7;
  return <U3 d={d} bg={p.bg} ground={SNOW} sky="#c8d4e0" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.28, 0], az: [-0.5, -0.35], el: [0.12, 0.1], r: [1.0, 0.9], fov: 34 }}>{(tt) => {
    const ph = Math.max(0, tt - aM) / B, cyc = ph % 1, n = Math.floor(ph), lift = tt > aM ? (cyc < 0.7 ? eio(cyc, 0, 0.7) : 1 - eio(cyc, 0.7, 1)) : 0.4, deep = Math.min(0.1, n * 0.012 + (cyc > 0.95 ? 0.012 : 0));
    return <>
      <mesh position={[0.2, 0.35, 0]}><boxGeometry args={[0.2, 0.75, 1.2]} /><meshStandardMaterial map={dirtT([130, 128, 126])} roughness={0.8} /></mesh>
      <group position={[0.1 + deep, 0.3, 0.05]} rotation={[0, 0, PI / 2]}><mesh><cylinderGeometry args={[0.008, 0.008, 0.26, 10]} />{M.steel({ col: "#5a5e62" })}</mesh></group>
      <group position={[-0.05, 0.3, 0.05]} rotation={[0, 0, 0.2 + 1.0 * lift]}><group position={[0, 0, 0]}>
        <mesh position={[-0.16, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />{M.wood()}</mesh>
        <RBox s={[0.04, 0.08, 0.04]} r={0.006} p={[-0.02, 0, 0]}>{M.steel({ col: "#4a4e52" })}</RBox></group></group>
      {Array.from({ length: 6 }, (_, i) => { const k = cl((tt - aM - (n) * B - 0.67 * B) / 0.4); return tt > aM ? <mesh key={i} position={[0.1 - 0.15 * k, 0.3 + 0.1 * Math.sin(i * 1.1) * k - 0.1 * k * k, 0.05 + 0.1 * Math.cos(i * 1.7) * k]} visible={k > 0 && k < 1}><tetrahedronGeometry args={[0.008, 0]} /><meshStandardMaterial color="#8a8886" /></mesh> : null; })}
      {(() => { const kk = tt > aM + B * 0.95 ? cl(((ph + 0.05) % 1) / 0.35) : 1; return <group position={[-0.03, 0.3, 0.05]}>
        {Array.from({ length: 10 }, (_, i) => { const a = i * 0.63, v = 0.12 + 0.06 * rn(i, 5); return <mesh key={i} position={[-v * kk * Math.abs(Math.cos(a)), v * kk * Math.sin(a) * 0.8 - 0.2 * kk * kk, v * kk * Math.sin(a * 1.7) * 0.5]} visible={kk > 0 && kk < 0.7}><sphereGeometry args={[0.004, 6, 4]} /><meshBasicMaterial color="#ffd27a" /></mesh>; })}
        <pointLight position={[-0.02, 0, 0.05]} intensity={0.0001 + 0.7 * (1 - cl(kk * 3))} distance={0.5} color="#ffc060" /></group>; })()}
      {Array.from({ length: 5 }, (_, i) => { const u = ((Math.max(0, tt - aM) * 0.8 + i / 5) % 1); return <mesh key={"pv" + i} position={[0.09, 0.3 + 0.06 * u, 0.06 + 0.04 * u * (i % 2 ? 1 : -1)]} scale={sm(tt > aM ? 0.015 + 0.04 * u : 0)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#b8b6b2" transparent opacity={0.4 * (1 - u)} depthWrite={false} /></mesh>; })}
      <group position={[-0.32, 0, 0.05]}><Stickman escala={0.14} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }] as any} semilla={140} contacto={0} color="#3a4a5a" /></group>
      <Sh p={[-0.32, 0, 0.05]} r={0.08} />
      {Array.from({ length: 40 }, (_, i) => { const y = 1.0 - ((tt * (0.15 + 0.05 * rn(i, 2)) + rn(i, 1)) % 1) * 1.05; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 1.4, y, (rn(i, 4) - 0.3) * 0.9]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
      <directionalLight position={[-1, 2.4, 1.4]} intensity={1.6} color="#e8eef8" />
    </>;
  }}</U3>;
};

// ---- DosVias · una franja del país: la vía del este avanza durmiente a durmiente, en «California» arranca la otra, pero delante
// de la del oeste se levanta la cordillera ----
const Loco: React.FC<{ col: string }> = ({ col }) => <group>
  <RBox s={[0.2, 0.05, 0.08]} r={0.01} p={[0, 0.045, 0]}>{M.steel({ col: "#2a2826" })}</RBox>
  <mesh position={[0.03, 0.1, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.14, 16]} /><meshStandardMaterial color={col} metalness={0.4} roughness={0.4} /></mesh>
  <RBox s={[0.06, 0.09, 0.08]} r={0.008} p={[-0.07, 0.115, 0]}><meshStandardMaterial color={col} metalness={0.3} roughness={0.5} /></RBox>
  <mesh position={[0.08, 0.16, 0]}><cylinderGeometry args={[0.012, 0.018, 0.06, 10]} />{M.steel({ col: "#1a1816" })}</mesh>
  {[-0.06, 0.0, 0.06].map((x) => [-0.042, 0.042].map((z) => <mesh key={x + "_" + z} position={[x, 0.025, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />{M.steel({ col: "#141414" })}</mesh>))}
</group>;
const DosVias: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "este", 0.5), aC = sec(p, "california", 1.6), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[176, 150, 104]} sky="#b8c8d8" mode="iris" key1={[-1.2, 3, 1.4]} backDim={0.3}
    cam={{ at: [0, 0.1, 0], az: [-0.12, 0.1], el: [0.42, 0.34], r: [2.0, 1.8], fov: 36 }}>{(tt) => {
    const e = eio(tt, aE, D - 0.2), w = eio(tt, aC, D - 0.2), xe = lerp(1.0, 0.12, e), xw = lerp(-1.0, -0.12, w);
    return <>
      {Array.from({ length: 43 }, (_, i) => { const x = -1.05 + i * 0.05, laid = x > 0 ? x >= xe - 0.02 : x <= xw + 0.02; return <mesh key={i} position={[x, 0.006, 0]} scale={sm(laid ? 1 : 0)}><boxGeometry args={[0.018, 0.012, 0.12]} />{M.wood({ base: [96, 66, 40] })}</mesh>; })}
      {[-0.035, 0.035].map((z) => <group key={z}>
        <mesh position={[(1.05 + xe) / 2, 0.016, z]} scale={[sm(1.05 - xe), 1, 1]}><boxGeometry args={[1, 0.008, 0.008]} />{M.steel({ col: "#5a5856" })}</mesh>
        <mesh position={[(-1.05 + xw) / 2, 0.016, z]} scale={[sm(xw + 1.05), 1, 1]}><boxGeometry args={[1, 0.008, 0.008]} />{M.steel({ col: "#5a5856" })}</mesh></group>)}
      <group position={[xe + 0.1, 0.02, 0]} rotation={[0, PI, 0]}><Loco col="#a83a2a" /></group>
      <group position={[xw - 0.1, 0.02, 0]}><Loco col="#2a4a8a" /></group>
      {[[-0.55, -0.35, 0.3], [-0.42, -0.5, 0.22], [-0.7, -0.45, 0.26], [-0.5, 0.35, 0.24], [-0.65, 0.3, 0.2]].map(([x, z, h], i) => <group key={i} position={[x, 0, z]}>
        <mesh position={[0, h / 2, 0]}><coneGeometry args={[h * 0.75, h, 7]} /><meshStandardMaterial map={dirtT([110, 104, 98])} roughness={1} flatShading /></mesh>
        <mesh position={[0, h * 0.84, 0]}><coneGeometry args={[h * 0.24, h * 0.32, 7]} /><meshStandardMaterial color="#f2f4f8" roughness={0.7} flatShading /></mesh></group>)}
      <directionalLight position={[1.5, 3, 1.4]} intensity={1.6} color="#fff0d8" />
      <hemisphereLight args={["#dce8f4", "#5a4a30", 0.6]} />
    </>;
  }}</U3>;
};

// ---- TunelNieve · corte de la nieve: las tormentas caen en capas y abajo quedan los túneles con faroles, y la gente adentro ----
const TunelNieve: React.FC<UP> = ({ d, p }) => {
  const aT = sec(p, "tormentas", 0.5), aV = sec(p, "tuneles", 2.2);
  return <U3 d={d} bg={p.bg} ground={null} sky="#7a8898" mode="iris" key1={[-0.8, 2.4, 1.6]} backDim={0.35}
    cam={{ at: [0, 0.32, 0], az: [-0.32, -0.16], el: [0.12, 0.1], r: [1.75, 1.55], fov: 34 }}>{(tt) => {
    const H = 0.3 + 0.55 * eio(tt, aT, aV + 0.6), lit = eio(tt, aV, aV + 0.8);
    return <>
      <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.8, 0.04, 0.8]} /><meshStandardMaterial map={dirtT([90, 80, 70])} roughness={1} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.55, H / 2, -0.05]}><boxGeometry args={[0.7, H, 0.7]} /><meshStandardMaterial map={dirtT([214, 220, 230])} roughness={0.9} /></mesh>)}
      <mesh position={[0, (H + 0.25) / 2, -0.05]}><boxGeometry args={[0.4, H - 0.25, 0.7]} /><meshStandardMaterial map={dirtT([218, 224, 234])} roughness={0.9} /></mesh>
      {[-1, 1].map((sd) => <mesh key={"c" + sd} position={[sd * 0.17, 0.21, -0.05]}><boxGeometry args={[0.06, 0.08, 0.7]} /><meshStandardMaterial map={dirtT([214, 220, 230])} roughness={0.9} /></mesh>)}
      {Array.from({ length: 8 }, (_, j) => [-1, 1].map((sd) => <mesh key={j + "_" + sd} position={[sd * 0.55, 0.1 * (j + 1), 0.302]} scale={[1, 1, sm(H > 0.1 * (j + 1) + 0.02 ? 1 : 0)]}><boxGeometry args={[0.7, 0.006, 0.004]} /><meshStandardMaterial color="#aab4c4" /></mesh>))}
      <mesh position={[0, 0.05, -0.05]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.7, 28, 1, true]} /><meshStandardMaterial color="#5a6a7a" side={THREE.BackSide} roughness={0.8} /></mesh>
      <mesh position={[0, 0.125, -0.39]}><boxGeometry args={[0.4, 0.25, 0.02]} /><meshStandardMaterial color="#2a3644" /></mesh>
      {[-0.3, -0.05, 0.2].map((z, i) => <group key={i} position={[0, 0.2, z]}><mesh><sphereGeometry args={[0.014, 12, 8]} /><meshStandardMaterial color="#fff0c0" emissive="#ffb050" emissiveIntensity={0.2 + 1.8 * lit} /></mesh>
        <pointLight intensity={0.0001 + 0.8 * lit} distance={0.5} color="#ffb860" /></group>)}
      {[-0.07, 0.07].map((x, i) => <group key={i} position={[x, 0.0, i ? -0.15 : 0.1]}><EnSitio tt={tt} accion="caminar" escala={0.08} rotY={0} semilla={141 + i} contacto={0} /></group>)}
      {Array.from({ length: 50 }, (_, i) => { const y = 1.3 - ((tt * 0.35 + rn(i, 1)) % 1) * (1.3 - H); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 1.6, y, (rn(i, 4) - 0.5) * 0.7]}><sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
      <directionalLight position={[-1, 2.4, 1.4]} intensity={0.9} color="#e8eef8" />
      <hemisphereLight args={["#c8d4e4", "#2a2a30", 0.5]} />
    </>;
  }}</U3>;
};

// ---- Avalancha · la ladera cargada de nieve sobre las cabañas; en «avalanchas» la placa se desliza y las tapa con una nube ----
const Avalancha: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "avalanchas", 0.6);
  return <U3 d={d} bg={p.bg} ground={SNOW} sky="#b8c4d0" mode="iris" key1={[-1, 3, 1.4]}
    cam={{ at: [0.1, 0.3, 0], az: [-0.55, -0.45], el: [0.14, 0.12], r: [1.7, 1.55], fov: 34 }}>{(tt) => {
    const s = eio(tt, aA, aA + 1.6);
    return <>
      <mesh position={[-0.35, 0.4, 0]} rotation={[0, 0, -0.65]}><boxGeometry args={[1.3, 0.06, 0.8]} /><meshStandardMaterial map={dirtT([120, 116, 112])} roughness={0.9} /></mesh>
      <group position={[-0.35 + 0.6 * s, 0.46 - 0.42 * s, 0]} rotation={[0, 0, -0.65 + 0.5 * s]}><mesh><boxGeometry args={[0.9, 0.1, 0.75]} /><meshStandardMaterial map={dirtT(SNOW)} roughness={0.8} /></mesh></group>
      {[0.35, 0.6].map((x, i) => <group key={i} position={[x, 0, (i - 0.5) * 0.3]}><RBox s={[0.16, 0.1, 0.12]} r={0.005} p={[0, 0.05, 0]}>{M.wood({ base: [110, 76, 44] })}</RBox>
        <mesh position={[0, 0.13, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.12, 0.07, 4]} />{M.wood({ base: [90, 60, 34] })}</mesh><Sh p={[0, 0, 0]} r={0.11} /></group>)}
      {Array.from({ length: 24 }, (_, i) => { const k = cl((tt - aA - 0.8 - rn(i, 1) * 0.6) / 1.2); return <mesh key={i} position={[0.3 + 0.4 * rn(i, 2), 0.05 + 0.25 * k * rn(i, 3), (rn(i, 4) - 0.5) * 0.6]} scale={sm(0.03 + 0.07 * k)} visible={k > 0 && k < 1}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#f4f6f8" transparent opacity={0.8 * (1 - k)} depthWrite={false} /></mesh>; })}
      <directionalLight position={[-1, 2.4, 1.4]} intensity={1.6} color="#e8eef8" />
    </>;
  }}</U3>;
};

// ---- TeHervido · la tetera sobre el fuego: en el agua flotan bichos verdes; en «hervir» sube el vapor y los bichos se apagan ----
const TeHervido: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "hervir", 1.6);
  return <U3 d={d} bg={p.bg} ground={SNOW} sky="#5a6a7a" mode="iris" key1={[-0.6, 2.2, 1.4]}
    cam={{ at: [0, 0.18, 0], az: [-0.3, -0.18], el: [0.34, 0.28], r: [0.85, 0.75], fov: 34 }}>{(tt) => {
    const boil = eio(tt, aH, aH + 1.2), fl = 0.85 + 0.15 * Math.sin(tt * 2 * PI * 1.6);
    return <>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.02, 0]} rotation={[0, i * PI / 3, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />{M.wood({ base: [70, 46, 30] })}</mesh>)}
      <mesh position={[0, 0.06, 0]} scale={[1, fl, 1]}><coneGeometry args={[0.05, 0.1, 12]} />{M.glow({ col: "#ff9a3a", op: 0.85 })}</mesh>
      <pointLight position={[0, 0.1, 0.1]} intensity={1.8 * fl} distance={1.2} color="#ff9a4a" />
      <group position={[0, 0.12, 0]}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.11, 0.1, 0.12, 32, 1, true]} />{M.steel({ col: "#7a7e82", side: THREE.DoubleSide } as any)}</mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 32]} />{M.steel({ col: "#5a5e62" })}</mesh>
        <mesh position={[0, 0.1, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.105, 32]} /><meshStandardMaterial color="#6a5a3a" roughness={0.2} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.15, 0.104, (rn(i, 2) - 0.5) * 0.15]} scale={sm(0.012 * (1 - boil))}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#5ac83a" emissive="#3a9a2a" emissiveIntensity={0.6} /></mesh>)}
        {Array.from({ length: 30 }, (_, i) => { const k = ((tt * 0.35 + i / 30) % 1); return <mesh key={"b" + i} position={[(rn(i, 3) - 0.5) * 0.1 + 0.06 * k * Math.sin(k * 5 + i), 0.12 + k * 0.5, (rn(i, 4) - 0.5) * 0.08]} scale={sm(boil * (0.025 + 0.09 * k))}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#f4f6f8" roughness={1} transparent opacity={0.16 * Math.sin(PI * k)} depthWrite={false} /></mesh>; })}
        {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 1.3 + i / 8) % 1); return <mesh key={"bb" + i} position={[(rn(i, 6) - 0.5) * 0.15, 0.103, (rn(i, 7) - 0.5) * 0.15]} scale={sm(boil * (k < 0.8 ? 0.004 + 0.01 * k : 0))}><sphereGeometry args={[1, 10, 8, 0, 2 * PI, 0, PI / 2]} /><meshPhysicalMaterial color="#8a7a4a" roughness={0.1} clearcoat={1} /></mesh>; })}
      </group>
      {[[-0.22, 0.1], [0.22, 0.08]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.025, 0.02, 0.06, 16]} />{M.porcelain({ col: "#e8e0d0" })}</mesh><Sh p={[0, 0, 0]} r={0.03} /></group>)}
      <Sh p={[0, 0, 0]} r={0.15} />
    </>;
  }}</U3>;
};

// ---- CargaDormida · el agujero perforado con la mecha quemada; el polvo se asienta; adentro un brillo late despacio: está esperando ----
const CargaDormida: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "esperando", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0806" mode="iris" key1={[-0.4, 2.0, 1.4]}
    cam={{ at: [-0.06, 0.3, 0], at1: [0.0, 0.3, 0.02], az: [-0.42, -0.3], el: [0.1, 0.08], r: [1.05, 0.8], fov: 34 }}>{(tt) => {
    const beat = 0.5 + 0.5 * Math.sin(tt * 2 * PI * 0.5), wake = eio(tt, aE, aE + 1.0), glow = (0.3 + 0.7 * beat) * (0.3 + 0.7 * wake);
    return <>
      <mesh position={[0, 0.3, -0.05]}><boxGeometry args={[1.6, 0.9, 0.1]} /><meshStandardMaterial map={dirtT([112, 100, 88])} roughness={0.9} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={"r" + i} position={[(rn(i, 1) - 0.5) * 1.5, 0.05 + rn(i, 2) * 0.75, 0.0]} rotation={[rn(i, 3) * 3, rn(i, 4) * 3, 0]} scale={[1, 0.7, 0.5]}><dodecahedronGeometry args={[0.04 + 0.05 * rn(i, 5), 0]} /><meshStandardMaterial color="#6a6058" roughness={1} flatShading /></mesh>)}
      {[[-0.3, 0.45], [-0.12, 0.52], [0.16, 0.48], [0.32, 0.38]].map(([x, y], i) => <mesh key={"h" + i} position={[x, y, 0.002]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.01, 16]} /><meshBasicMaterial color="#0a0806" /></mesh>)}
      <group position={[0.02, 0.3, 0.0]}>
        <mesh position={[0, 0, 0.001]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 16]} /><meshBasicMaterial color="#0a0806" /></mesh>
        {[[-0.012, 0], [0.012, 0], [0, 0.016]].map(([x, y], i) => <mesh key={i} position={[x, y, 0.05]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.1, 14]} /><meshStandardMaterial color="#b02a1a" roughness={0.6} /></mesh>)}
        <Seg a={[0, 0.005, 0.1]} b={[0.06, -0.08, 0.12]} r={0.0025}><meshStandardMaterial color="#2a2018" /></Seg>
        <Seg a={[0.06, -0.08, 0.12]} b={[0.09, -0.16, 0.1]} r={0.0025}><meshStandardMaterial color="#2a2018" /></Seg>
        <mesh position={[0.09, -0.16, 0.1]}><sphereGeometry args={[0.009, 10, 8]} /><meshStandardMaterial color="#ff6a2a" emissive="#ff4a1a" emissiveIntensity={0.2 + 1.8 * glow} /></mesh>
        {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.5 + i / 6) % 1; return <mesh key={"s" + i} position={[0.09 + 0.03 * u * Math.sin(i * 2.1), -0.16 + 0.22 * u, 0.1]} scale={sm(wake * (0.012 + 0.03 * u))}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#8a827a" transparent opacity={0.35 * (1 - u)} depthWrite={false} /></mesh>; })}
        <pointLight position={[0.09, -0.16, 0.2]} intensity={0.0001 + 0.8 * glow} distance={0.8} color="#ff6a2a" /></group>
      <group position={[-0.34, 0, 0.22]}><Stickman escala={0.13} rotY={40} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }, { t: aE, accion: "asustarse", expr: "asustado" }] as any} semilla={143} contacto={0} color="#3a4a5a" /></group>
      <mesh position={[0, -0.0, 0.35]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 0.8]} /><meshStandardMaterial map={dirtT([90, 84, 78])} roughness={1} /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={"g" + i} position={[(rn(i, 7) - 0.5) * 1.2, 0.01, 0.1 + rn(i, 8) * 0.5]} rotation={[rn(i, 9), rn(i, 10), 0]}><dodecahedronGeometry args={[0.015 + 0.02 * rn(i, 11), 0]} /><meshStandardMaterial color="#5a5048" roughness={1} flatShading /></mesh>)}
      <spotLight position={[-0.6, 1.2, 1.0]} angle={0.4} penumbra={0.7} intensity={4} distance={3} color="#ffc078" />
      <hemisphereLight args={["#d8c8b0", "#1a1410", 0.35]} />
    </>;
  }}</U3>;
};

// ======================= AMÉRICA DEL SUR · CAUCHO =======================

// ---- SelvaLampara · la selva oscura antes del amanecer: la lamparita de la cabeza se prende y en «mosquitos» la nube crece alrededor ----
const SelvaLampara: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mosquitos", 0.6), aL = sec(p, "lamparita", 2.0);
  return <U3 d={d} bg={p.bg} ground={[60, 54, 40]} sky="#05080a" mode="iris" key1={[0, 1.6, 1.2]}
    cam={{ at: [0, 0.25, 0], az: [-0.2, -0.08], el: [0.08, 0.06], r: [1.05, 0.9], fov: 34 }}>{(tt) => {
    const lamp = eio(tt, aL, aL + 0.5), mos = eio(tt, aM, aM + 1.5);
    return <>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[(i - 4) * 0.22 + 0.05 * rn(i, 1), 0, -0.4 - 0.4 * rn(i, 2)]}><Arbol h={0.9 + 0.3 * rn(i, 3)} col="#1a3a1a" /></group>)}
      <group position={[0, 0, 0.05]}><Stickman escala={0.15} rotY={10} guion={[{ t: 0, accion: "caminar", expr: "decidido" }, { t: aM + 1.0, accion: "manos_cabeza", expr: "enojado" }] as any} semilla={150} contacto={0} color="#7a5a3a" /></group>
      <mesh position={[0.0, 0.38, 0.08]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#fff0c0" emissive="#ffc060" emissiveIntensity={3 * lamp} /></mesh>
      <spotLight position={[0.0, 0.38, 0.1]} angle={0.5} penumbra={0.6} intensity={6 * lamp} distance={2.5} color="#ffd890" />
      {Array.from({ length: 60 }, (_, i) => { const r = 0.08 + 0.18 * rn(i, 1), a = tt * (2 + rn(i, 2) * 2) + rn(i, 3) * 6; return <mesh key={i} position={[Math.cos(a) * r, 0.25 + 0.15 * Math.sin(a * 1.3 + i), Math.sin(a) * r * 0.6 + 0.05]} visible={rn(i, 4) < mos}><sphereGeometry args={[0.003, 4, 3]} /><meshBasicMaterial color="#1a1a1a" /></mesh>; })}
      <pointLight position={[0, 0.8, 0.6]} intensity={0.4} distance={2} color="#5a7a9a" />
    </>;
  }}</U3>;
};

// ---- RuedaCaucho · la bola de caucho se convierte: rueda de bicicleta en «bicicletas», neumático de auto en «autos» ----
const RuedaCaucho: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "bicicletas", 0.8), aA = sec(p, "autos", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [-0.1, 0.22, 0], at1: [0, 0.22, 0], az: [-0.3, -0.12], el: [0.12, 0.1], r: [1.15, 0.9], fov: 34 }}>{(tt) => {
    const b = eio(tt, aB, aB + 0.6), a = eio(tt, aA, aA + 0.6), spin = tt * 1.5;
    return <>
      <group position={[lerp(-0.7, 0, eio(tt, 0, Math.max(0.6, aB))), 0.22, 0]}>
        <mesh scale={sm(1 - b)} rotation={[0, 0, -lerp(-0.7, 0, eio(tt, 0, Math.max(0.6, aB))) / 0.13]}><sphereGeometry args={[0.13, 24, 16]} /><meshStandardMaterial map={dirtT([58, 44, 30])} roughness={0.6} /></mesh>
        <group rotation={[0, 0, -spin]} scale={sm(b * (1 - a))}><mesh><torusGeometry args={[0.18, 0.014, 12, 48]} /><meshStandardMaterial color="#1a1612" roughness={0.6} /></mesh>
          {Array.from({ length: 16 }, (_, i) => <mesh key={i} rotation={[0, 0, i * PI / 8]}><boxGeometry args={[0.002, 0.34, 0.002]} />{M.chrome()}</mesh>)}
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />{M.chrome()}</mesh></group>
        <group rotation={[0, 0, -spin]} scale={sm(a)}><mesh><torusGeometry args={[0.15, 0.06, 16, 48]} /><meshStandardMaterial color="#1a1612" roughness={0.7} /></mesh>
          <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.07, 32]} />{M.steel({ col: "#9a9ea2" })}</mesh>
          {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 12) * 0.208, Math.sin(i * PI / 12) * 0.208, 0]} rotation={[0, 0, i * PI / 12]}><boxGeometry args={[0.008, 0.012, 0.1]} /><meshStandardMaterial color="#2a2620" /></mesh>)}</group>
      </group>
      <Sh p={[0, 0, 0]} r={0.16} sx={1.2} />
      <spotLight position={[0.3, 1.8, 0.9]} angle={0.4} penumbra={0.7} intensity={10} distance={3} color="#ffe6c0" />
    </>;
  }}</U3>;
};

// ---- CorteLatex · el tronco de la siringa en primer plano: el cuchillo hace los cortes diagonales y la leche blanca baja a la latita ----
const CorteLatex: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cortes", 0.5), aL = sec(p, "leche", 2.0), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[60, 54, 40]} sky="#1a2a1a" mode="iris" key1={[-0.4, 2.0, 1.4]}
    cam={{ at: [0, 0.3, 0.05], az: [-0.12, 0.0], el: [0.06, 0.04], r: [0.8, 0.7], fov: 34 }}>{(tt) => {
    const flow = eio(tt, aL, D - 0.3);
    return <>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.15, 0.17, 1.0, 32]} />{M.wood({ base: [120, 100, 76], ry: 3 })}</mesh>
      {[0, 1, 2].map((i) => { const y = 0.5 + i * 0.1, k = eio(tt, aC + i * 0.5, aC + i * 0.5 + 0.4); return <group key={i}>
        <mesh position={[0, y, 0.148]} rotation={[0, 0, -0.5]} scale={[sm(k), 1, 1]}><boxGeometry args={[0.16, 0.008, 0.006]} /><meshStandardMaterial color="#e8dcc0" roughness={0.6} /></mesh></group>; })}
      <mesh position={[0.05, 0.38 - 0.0, 0.152]} scale={[1, sm(flow), 1]}><boxGeometry args={[0.008, 0.14, 0.004]} /><meshStandardMaterial color="#f4f2ee" roughness={0.3} /></mesh>
      {Array.from({ length: 3 }, (_, i) => { const k = ((tt - aL) * 0.8 + i / 3) % 1; return tt > aL ? <Gota key={i} p={[0.05, 0.31 - 0.07 * k, 0.155]} s={0.6} /> : null; })}
      <group position={[0.05, 0.2, 0.18]}><mesh><cylinderGeometry args={[0.035, 0.03, 0.06, 20, 1, true]} />{M.steel({ col: "#a8acb0", side: THREE.DoubleSide } as any)}</mesh>
        <mesh position={[0, -0.03 + 0.05 * flow, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.031, 20]} /><meshStandardMaterial color="#f4f2ee" roughness={0.3} /></mesh></group>
      <group position={[lerp(-0.25, 0.05, eio(tt, aC - 0.2, aC + 1.6)), 0.55, 0.22]} rotation={[0, 0, 0.6]} visible={tt < aL + 0.2}><mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />{M.wood()}</mesh>
        <mesh position={[0, 0.03, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.03, 0.004, 6, 16, PI]} />{M.steel()}</mesh></group>
      <spotLight position={[0.3, 1.4, 1.0]} angle={0.4} penumbra={0.7} intensity={7} distance={3} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- BolaHumo · el palo gira sobre el humo y la bola de caucho crece capa a capa ----
const BolaHumo: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "humo", 0.5), aB = sec(p, "bola", 2.5), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[80, 66, 50]} sky="#1a1410" mode="iris" key1={[-0.6, 2.2, 1.4]}
    cam={{ at: [-0.08, 0.26, 0], az: [-0.3, -0.15], el: [0.14, 0.1], r: [1.15, 1.0], fov: 34 }}>{(tt) => {
    const g = eio(tt, aH, D - 0.2), fl = 0.85 + 0.15 * Math.sin(tt * 2 * PI * 1.4);
    return <>
      {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.02, 0]} rotation={[0, i * PI / 3, PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />{M.wood({ base: [70, 46, 30] })}</mesh>)}
      <mesh position={[0, 0.06, 0]} scale={[1, fl, 1]}><coneGeometry args={[0.05, 0.08, 12]} />{M.glow({ col: "#ff8a2a", op: 0.8 })}</mesh>
      <pointLight position={[0, 0.1, 0.1]} intensity={1.6 * fl} distance={1.2} color="#ff9a4a" />
      {Array.from({ length: 60 }, (_, i) => { const k = ((tt * 0.22 + i / 60) % 1), r = 0.03 + 0.14 * Math.sin(PI * Math.min(1, k * 1.6)), an = k * 9 + i * 0.7; return <mesh key={i} position={[r * Math.cos(an), 0.08 + k * 0.62, r * Math.sin(an)]} scale={sm(0.025 + 0.05 * k)}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={k < 0.4 ? "#9a948c" : "#c8c2b8"} roughness={1} transparent opacity={0.13 * (1 - k) * cl((tt - aH + 0.5) * 2)} depthWrite={false} /></mesh>; })}
      <group position={[-0.44, 0, 0.02]}><Stickman escala={0.14} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }] as any} semilla={161} contacto={0} color="#5a4a38" /></group>
      <group position={[0, 0.26, 0]} rotation={[tt * 1.2, 0, 0]}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.7, 8]} />{M.wood()}</mesh>
        <mesh scale={[1.3, 1, 1]}><sphereGeometry args={[0.02 + 0.09 * g, 24, 16]} /><meshPhysicalMaterial color="#3a2a1a" roughness={0.35} clearcoat={0.6} /></mesh>
        {[0.3, 0.6, 0.9].map((q, j) => <mesh key={j} rotation={[0, 0, PI / 2]} scale={sm(eio(g, q - 0.3, q))}><torusGeometry args={[(0.02 + 0.09 * g) * 1.0, 0.004, 6, 28]} /><meshStandardMaterial color="#5a4028" roughness={0.6} /></mesh>)}
        <mesh scale={[1.31, 1.01, 1.01]}><sphereGeometry args={[0.02 + 0.09 * g, 24, 16]} /><meshStandardMaterial color="#f4f2ee" transparent opacity={0.4 * (Math.sin(tt * 2 * PI * 0.5) * 0.5 + 0.5)} roughness={0.3} /></mesh>
      </group>
      {[-0.35, 0.35].map((x, i) => <RBox key={i} s={[0.03, 0.3, 0.03]} r={0.004} p={[x, 0.15, 0]}>{M.wood({ base: [110, 76, 44] })}</RBox>)}
      <Sh p={[0, 0, 0]} r={0.12} />
    </>;
  }}</U3>;
};

// ---- SemillasFilas · un saquito de semillas viaja en un arco; donde cae, brotan árboles en filas perfectas, una tras otra ----
const SemillasFilas: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "semillas", 0.6), aF = sec(p, "filas", 2.2);
  const rows = [-0.24, 0.0, 0.24];
  return <U3 d={d} bg={p.bg} ground={[120, 96, 64]} sky="#c8d8e0" mode="iris" key1={[-1, 3, 1.4]}
    cam={{ at: [0.0, 0.14, 0], az: [-0.42, -0.26], el: [0.36, 0.3], r: [1.6, 1.45], fov: 34 }}>{(tt) => {
    const wk = cl((tt - aS) / Math.max(1, d / 30 - aS - 0.6)), xm = lerp(-0.7, 0.5, wk);
    return <>
      {rows.map((z, r) => <group key={"f" + r}>
        <mesh position={[0, 0.012, z]}><boxGeometry args={[1.8, 0.024, 0.07]} /><meshStandardMaterial map={dirtT([84, 58, 36])} roughness={1} /></mesh>
        <mesh position={[0, 0.003, z + 0.06]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.8, 0.04]} /><meshStandardMaterial color="#3a2618" roughness={1} /></mesh></group>)}
      {Array.from({ length: 21 }, (_, i) => { const r = i % 3, c = Math.floor(i / 3), x = -0.6 + c * 0.2, z = rows[r] + 0.06;
        const tp = aS + (x + 0.7) / 1.45 * Math.max(1, d / 30 - aS - 0.6), drop = cl((tt - tp) / 0.35), grow = Math.max(eio(tt, tp + 0.4, tp + 1.2), eio(tt, aF + c * 0.08, aF + c * 0.08 + 0.6) * (tt > tp ? 1 : 0));
        return <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.2 * (1 - drop * drop) + 0.012, 0]} visible={tt > tp - 0.05}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#b89a68" roughness={1} /></mesh>
          <group scale={sm(pop(tt, tp + 0.4) * (0.4 + 0.6 * grow))}><Arbol h={0.16} col="#3a7a2a" leaf={0.6} /></group></group>; })}
      {Array.from({ length: 4 }, (_, i) => <group key={"j" + i} position={[-0.95 + 0.12 * (i % 2), 0, -0.55 + i * 0.12]}><Arbol h={0.5 + 0.1 * rn(i, 1)} col="#2a5a2a" /></group>)}
      <group position={[xm, 0, 0.36]}><EnSitio tt={tt} accion="caminar" escala={0.16} rotY={90} semilla={177} contacto={0} /></group>
      <directionalLight position={[1.5, 3, 1]} intensity={1.6} color="#ffe8c8" />
      <hemisphereLight args={["#d8e4f0", "#3a2a1a", 0.4]} />
    </>;
  }}</U3>;
};

// ======================= OCEANÍA · GOMA KAURI =======================

// ---- PantanoVara · el pantano hasta las rodillas: la vara de hierro se clava una y otra vez en el barro, con ondas en el agua ----
const PantanoVara: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "vara", 0.6), B = 0.9;
  return <U3 d={d} bg={p.bg} ground={[90, 80, 56]} sky="#a8b0a0" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.2, 0], az: [-0.3, -0.18], el: [0.16, 0.12], r: [1.05, 0.95], fov: 34 }}>{(tt) => {
    const ph = Math.max(0, tt - aV) / B, cyc = ph % 1, stab = tt > aV ? (cyc < 0.35 ? eio(cyc, 0, 0.35) : 1 - eio(cyc, 0.5, 1)) : 0, n = Math.floor(ph);
    return <>
      <mesh position={[0, 0.06, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[1.6, 40]} />{M.water({ op: 0.75, col: "#5a5a3a" })}</mesh>
      {Array.from({ length: 40 }, (_, i) => { const h = 0.2 + 0.25 * rn(i, 3); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.8, 0.06 + h / 2, -0.25 - rn(i, 2) * 0.6]} rotation={[0, 0, (rn(i, 4) - 0.5) * 0.3 + 0.03 * Math.sin(tt * 1.5 + i)]}><cylinderGeometry args={[0.003, 0.005, h, 5]} /><meshStandardMaterial color={i % 3 ? "#6a7a3a" : "#8a8a4a"} roughness={1} /></mesh>; })}
      {(() => { const g = n >= 2 ? cl((ph - 2.35) / 0.8) : 0; return <group position={[0.13, 0.04 + 0.12 * eio(g, 0, 1), 0.06]} scale={sm(g > 0 ? 1 : 0)}><mesh scale={[1.2, 0.9, 1]}><sphereGeometry args={[0.03, 20, 14]} /><meshPhysicalMaterial color="#d89a30" emissive="#a05a10" emissiveIntensity={0.3 + 0.9 * g} roughness={0.15} clearcoat={1} /></mesh></group>; })()}
      <pointLight position={[0.13, 0.25, 0.2]} intensity={0.0001 + 0.9 * (n >= 2 ? cl((ph - 2.35) / 0.8) : 0)} distance={0.7} color="#ffb040" />
      <group position={[-0.1, 0, 0]}><Stickman escala={0.15} rotY={20} guion={[{ t: 0, accion: "empujar", expr: "decidido" }] as any} semilla={160} contacto={0} color="#5a4a38" /></group>
      <group position={[0.1 + 0.02 * (n % 3 - 1), 0.5 - 0.3 * stab, 0.06]} rotation={[0, 0, 0.12]}><mesh><cylinderGeometry args={[0.004, 0.004, 0.75, 8]} />{M.steel({ col: "#5a5e62" })}</mesh></group>
      {[0, 1].map((k) => { const c = cl((cyc - 0.35 - k * 0.2) / 0.5); return <mesh key={k} position={[0.12 + 0.02 * (n % 3 - 1), 0.062, 0.06]} rotation={[-PI / 2, 0, 0]} scale={sm(0.2 + c)} visible={tt > aV}><ringGeometry args={[0.05, 0.056, 32]} /><meshBasicMaterial color="#e8eadc" transparent opacity={0.5 * (1 - c)} depthWrite={false} /></mesh>; })}
      <directionalLight position={[-1, 2.4, 1.4]} intensity={1.4} color="#e8eadc" />
    </>;
  }}</U3>;
};

// ---- ResinaSiglos · el kauri gigante suelta gotas de resina; el árbol se borra con los siglos y la resina queda abajo, dorada y dura ----
const ResinaSiglos: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "resina", 0.6), aE = sec(p, "enterrada", 2.4);
  return <U3 d={d} bg={p.bg} ground={null} sky="#9ab0a0" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.3, 0], az: [-0.18, -0.08], el: [0.1, 0.08], r: [1.4, 1.25], fov: 34 }}>{(tt) => {
    const gone = eio(tt, aE, aE + 1.6);
    return <>
      <mesh position={[0, -0.2, 0]}><boxGeometry args={[1.4, 0.4, 0.5]} /><meshStandardMaterial map={dirtT([90, 70, 50])} roughness={1} /></mesh>
      <group scale={[1, sm(1 - gone), 1]}><mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.1, 0.14, 0.9, 20]} />{M.wood({ base: [130, 120, 110], ry: 3 })}</mesh>
        <mesh position={[0, 0.95, 0]} scale={[1.6, 0.6, 1]}><dodecahedronGeometry args={[0.25, 1]} /><meshStandardMaterial color="#3a5a2a" roughness={0.9} /></mesh></group>
      {Array.from({ length: 5 }, (_, i) => { const a = aR + i * 0.35, k = cl((tt - a) / 0.8), y = lerp(0.5, -0.05 - 0.25 * gone * rn(i, 2), k); return tt > a ? <mesh key={i} position={[0.1 * Math.cos(i * 2), y, 0.12 * Math.sin(i * 2) + 0.06]} scale={[1, 1.2, 1]}><sphereGeometry args={[0.03, 16, 12]} /><meshPhysicalMaterial color="#d8902a" roughness={0.2} clearcoat={1} transmission={0.3} emissive="#a05a10" emissiveIntensity={0.3 * gone} /></mesh> : null; })}
      <spotLight position={[0.3, 2, 1.0]} angle={0.45} penumbra={0.7} intensity={8} distance={4} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- VaraToca · corte del barro: la punta de la vara toca algo duro; en «raíz», «piedra» y «goma» aparece cada posibilidad abajo ----
const VaraToca: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "raiz", 0.8), aP = sec(p, "piedra", 1.5), aG = sec(p, "goma", 2.2);
  const T = [aR, aP, aG], X = [-0.45, 0.0, 0.45];
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#2a3028" mode="iris" key1={[-1, 2.4, 1.6]} backDim={0.4}
    cam={{ at: [0, 0.5, 0], az: [-0.18, -0.06], el: [0.08, 0.06], r: [2.0, 1.85], fov: 34 }}>{(tt) => {
    const sg = tt < T[0] ? 0 : tt < T[1] ? 1 : 2;
    const xm = sg === 0 ? lerp(-0.8, X[0], eio(tt, 0, T[0] - 0.3)) : lerp(X[sg - 1], X[sg], eio(tt, T[sg - 1] + 0.4, T[sg] - 0.3));
    const pr = Math.max(...T.map((t) => Math.sin(PI * cl((tt - t + 0.3) / 0.9)))), yb = 0.05 - 0.27 * pr;
    const hit = T.map((t) => eio(tt, t, t + 0.4));
    return <group position={[0, 0.4, 0]}>
      <mesh position={[0, -0.2, -0.24]}><boxGeometry args={[2.2, 0.4, 0.5]} /><meshStandardMaterial map={dirtT([72, 56, 38])} roughness={1} /></mesh>
      <mesh position={[0, 0.004, -0.25]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.2, 0.5]} /><meshPhysicalMaterial color="#2a3424" roughness={0.15} clearcoat={1} transparent opacity={0.85} /></mesh>
      <group position={[X[0], -0.15, 0.02]}>{[[0, 0, 0.5], [0.05, -0.03, -0.6], [-0.05, 0.02, 1.4]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0]} rotation={[0, 0, r]}><cylinderGeometry args={[0.014, 0.02, 0.2, 8]} /><meshStandardMaterial color="#5a3a20" emissive="#ffb060" emissiveIntensity={0.0001 + 0.4 * hit[0]} roughness={0.9} /></mesh>)}</group>
      <mesh position={[X[1], -0.2, 0.02]}><dodecahedronGeometry args={[0.07, 0]} /><meshStandardMaterial color="#7a7a76" emissive="#ffffff" emissiveIntensity={0.0001 + 0.2 * hit[1]} roughness={0.8} flatShading /></mesh>
      <mesh position={[X[2], -0.17, 0.02]} scale={[1.3, 0.8, 1]}><sphereGeometry args={[0.06, 20, 14]} /><meshPhysicalMaterial color="#d89a30" emissive="#a05a10" emissiveIntensity={0.1 + 1.2 * hit[2]} roughness={0.2} clearcoat={1} /></mesh>
      <pointLight position={[X[2], -0.1, 0.2]} intensity={0.0001 + 1.2 * hit[2]} distance={0.7} color="#ffb040" />
      {T.map((t, i) => <mesh key={i} position={[X[i], -0.17, 0.03]} scale={sm(0.5 + 2 * cl((tt - t) / 0.6))}><ringGeometry args={[0.07, 0.078, 32]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.7 * (tt > t ? 1 - cl((tt - t) / 0.6) : 0)} depthWrite={false} /></mesh>)}
      <group position={[xm, 0, -0.05]}><EnSitio tt={tt} accion="caminar" escala={0.17} rotY={90} semilla={170} contacto={0} /></group>
      <mesh position={[xm + 0.07, yb + 0.225, 0.03]} rotation={[0, 0, -0.08]}><cylinderGeometry args={[0.005, 0.005, 0.45, 8]} />{M.steel({ col: "#4a4846" })}</mesh>
      <directionalLight position={[-1, 2.4, 1.6]} intensity={1.2} color="#e8e0c8" />
      <hemisphereLight args={["#c8d0c0", "#2a2018", 0.5]} />
    </group>;
  }}</U3>;
};

// ---- VelaRaspado · de noche, la vela en la mesa de la choza; el cuchillo raspa el terrón y saltan las virutas; queda dorado ----
const VelaRaspado: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "vela", 0.4), aR = sec(p, "raspas", 1.2), D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" sky="#05060a" mode="iris" key1={[0, 1.4, 0.8]}
    cam={{ at: [0, 0.1, 0], az: [-0.3, -0.18], el: [0.32, 0.26], r: [0.7, 0.62], fov: 34 }}>{(tt) => {
    const clean = eio(tt, aR, D - 0.3), scr = tt > aR ? Math.sin(tt * 2 * PI * 1.2) : 0, fl = 0.9 + 0.1 * Math.sin(tt * 2 * PI * 1.7);
    return <>
      <group position={[-0.18, 0, -0.05]}><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.015, 0.015, 0.1, 14]} /><meshStandardMaterial color="#efe6d0" /></mesh>
        <mesh position={[0, 0.115, 0]} scale={[1, fl, 1]}><coneGeometry args={[0.008, 0.03, 10]} />{M.glow({ col: "#ffb860" })}</mesh></group>
      <pointLight position={[-0.18, 0.15, -0.05]} intensity={1.8 * eio(tt, aV - 0.3, aV + 0.3) * fl + 0.2} distance={1.2} color="#ffb870" />
      <mesh position={[0.05, 0.04, 0.03]} scale={[1.3, 0.8, 1]}><dodecahedronGeometry args={[0.05, 1]} /><meshPhysicalMaterial color={"#" + new THREE.Color("#5a4a30").lerp(new THREE.Color("#d8902a"), clean).getHexString()} roughness={lerp(0.9, 0.25, clean)} clearcoat={clean} /></mesh>
      <Sh p={[0.05, 0, 0.03]} r={0.07} />
      <group position={[0.1 + 0.03 * scr, 0.08, 0.03]} rotation={[0, 0, 0.5]} visible={tt > aR - 0.3}><mesh><boxGeometry args={[0.08, 0.012, 0.003]} />{M.steel()}</mesh><mesh position={[0.06, 0, 0]}><boxGeometry args={[0.05, 0.016, 0.012]} />{M.wood()}</mesh></group>
      {Array.from({ length: 18 }, (_, i) => { const a = aR + i * 0.15; return tt > a ? <mesh key={i} position={[0.1 + 0.15 * rn(i, 1), 0.003, (rn(i, 2) - 0.3) * 0.2]} rotation={[PI / 2, 0, rn(i, 3) * 3]}><torusGeometry args={[0.006, 0.002, 4, 8, PI]} /><meshStandardMaterial color="#6a5a3a" /></mesh> : null; })}
    </>;
  }}</U3>;
};

// ======================= ANTÁRTIDA · GRYTVIKEN =======================

// ---- BahiaEstacion · la bahía entre montañas nevadas: los galpones, las calderas y en «chimeneas» sale el humo; las olas de olor ----
const BahiaEstacion: React.FC<UP> = ({ d, p }) => {
  const aG = sec(p, "galpones", 0.5), aC = sec(p, "chimeneas", 1.6);
  return <U3 d={d} bg={p.bg} ground={SNOW} sky="#a8b4c4" mode="iris" key1={[-1, 3, 1.4]}
    cam={{ at: [0, 0.2, 0], az: [-0.25, -0.1], el: [0.2, 0.16], r: [1.45, 1.3], fov: 34 }}>{(tt) => {
    const smoke = (i: number) => eio(tt, aC + i * 0.5, aC + i * 0.5 + 0.8);
    return <>
      <mesh position={[0, 0.003, 0.65]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 0.8]} />{M.water({ op: 0.9, col: "#3a5a6a" })}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-1.25 + i * 0.5, 0.2, -1.6]}><coneGeometry args={[0.32, 0.45 + 0.2 * rn(i, 1), 5]} /><meshStandardMaterial map={dirtT([200, 204, 210])} roughness={0.8} /></mesh>)}
      {Array.from({ length: 4 }, (_, i) => <group key={i} position={[-0.45 + i * 0.3, 0, 0.0]} scale={0.0001 + 0.6 + 0.4 * sm(pop(tt, Math.max(0, aG - 0.4) + i * 0.1))}>
        <RBox s={[0.24, 0.14, 0.18]} r={0.006} p={[0, 0.07, 0]}><meshStandardMaterial color={i % 2 ? "#8a3a2a" : "#6a6a62"} roughness={0.8} /></RBox>
        <mesh position={[0, 0.17, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.13, 0.13, 0.18]} /><meshStandardMaterial color="#4a4a44" roughness={0.8} /></mesh>
        <mesh position={[0.07, 0.26, 0]}><cylinderGeometry args={[0.015, 0.018, 0.18, 10]} />{M.steel({ col: "#4a4a4a" })}</mesh>
        {Array.from({ length: 6 }, (_, k) => { const q = ((tt * 0.3 + k / 6 + i * 0.1) % 1); return <mesh key={k} position={[0.07 + 0.1 * q, 0.36 + q * 0.4, 0]} scale={sm(smoke(i) * (0.03 + 0.06 * q))}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#5a5a58" transparent opacity={0.5 * (1 - q)} depthWrite={false} /></mesh>; })}
        <Sh p={[0, 0, 0]} r={0.15} sx={1.3} op={0.3} /></group>)}
      <directionalLight position={[1, 3, 1.4]} intensity={1.4} color="#e8eef8" />
    </>;
  }}</U3>;
};

// ---- AceiteUsos · el barril de aceite se abre y de él salen, de a uno, la barra de jabón, la margarina y el engranaje de una máquina ----
const AceiteUsos: React.FC<UP> = ({ d, p }) => {
  const aJ = sec(p, "jabon", 0.8), aM = sec(p, "margarina", 1.5), aQ = sec(p, "maquinas", 2.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0.0, 0.12, 0.02], az: [-0.2, -0.1], el: [0.2, 0.16], r: [0.95, 0.85], fov: 34 }}>{(tt) => {
    const land = (a: number, x: number) => { const u = eio(tt, a + 0.35, a + 0.95); return { x: lerp(-0.22, x, u), y: Math.max(0, 0.22 * Math.sin(PI * u)) + Math.abs(Math.sin(PI * 3 * cl((tt - a - 0.95) / 0.5))) * 0.03 * (1 - cl((tt - a - 0.95) / 0.5)) }; };
    const drip = (a: number) => { const u = cl((tt - a) / 0.35); return <mesh position={[-0.17, 0.16 - 0.15 * u * u, 0.07]} scale={[1, 1.5, 1]} visible={tt > a && u < 1}><sphereGeometry args={[0.012, 12, 10]} /><meshPhysicalMaterial color="#c89a30" roughness={0.1} clearcoat={1} /></mesh>; };
    const J = land(aJ, -0.02), Mg = land(aM, 0.14), Q = land(aQ, 0.3);
    return <>
      <group position={[-0.3, 0, -0.02]}><mesh position={[0, 0.12, 0]} geometry={latheG("barril_e", [[0.07, 0], [0.09, 0.06], [0.095, 0.12], [0.09, 0.18], [0.07, 0.24]], 28)}>{M.wood({ base: [110, 70, 38] })}</mesh>
        {[0.04, 0.2].map((y, i) => <mesh key={i} position={[0, y + 0.0, 0]}><torusGeometry args={[0.088, 0.004, 6, 28]} />{M.steel({ col: "#4a4a4a" })}</mesh>)}
        <mesh position={[0, 0.239, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 24]} /><meshStandardMaterial color="#c8a050" roughness={0.15} metalness={0.2} /></mesh>
        <mesh position={[0.11, 0.17, 0.09]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.008, 0.01, 0.06, 10]} />{M.steel({ col: "#7a6a4a" })}</mesh>
        <Sh p={[0, 0, 0]} r={0.1} /></group>
      <mesh position={[-0.17, 0.002, 0.07]} rotation={[-PI / 2, 0, 0]} scale={sm(0.3 + 0.7 * eio(tt, aJ + 0.3, aQ + 0.6))}><circleGeometry args={[0.035, 20]} /><meshPhysicalMaterial color="#b8862a" roughness={0.05} clearcoat={1} /></mesh>
      {drip(aJ)}{drip(aM)}{drip(aQ)}
      <group position={[J.x, J.y, 0.06]} scale={1.5 * sm(eio(tt, aJ + 0.3, aJ + 0.5))}><RBox s={[0.1, 0.04, 0.06]} r={0.012} p={[0, 0.02, 0]}><meshStandardMaterial color="#f0e8d0" roughness={0.5} /></RBox><Sh p={[0, -J.y, 0]} r={0.06} op={0.3} /></group>
      <group position={[Mg.x, Mg.y, 0.06]} scale={1.5 * sm(eio(tt, aM + 0.3, aM + 0.5))}><RBox s={[0.1, 0.05, 0.07]} r={0.006} p={[0, 0.025, 0]}><meshStandardMaterial color="#f2d870" roughness={0.6} /></RBox><Sh p={[0, -Mg.y, 0]} r={0.06} op={0.3} /></group>
      <group position={[Q.x, Q.y + 0.1, 0.06]} scale={1.5 * sm(eio(tt, aQ + 0.3, aQ + 0.5))}><group rotation={[PI / 2, 0, tt * (tt > aQ + 1.0 ? 1.5 : 0)]}><mesh><cylinderGeometry args={[0.055, 0.055, 0.02, 14]} />{M.steel({ col: "#c8ccd0" })}</mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 6) * 0.06, 0, Math.sin(i * PI / 6) * 0.06]}><boxGeometry args={[0.014, 0.02, 0.014]} />{M.steel({ col: "#c8ccd0" })}</mesh>)}</group></group>
      <spotLight position={[0.1, 1.8, 0.9]} angle={0.45} penumbra={0.7} intensity={9} distance={3.5} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- BotasClavos · la plataforma mojada y brillante: la bota con clavos se planta firme; la bota lisa patina y se va ----
const BotasClavos: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "botas", 0.6), aC = sec(p, "clavos", 1.4);
  const Bota: React.FC<{ spikes: boolean }> = ({ spikes }) => <group>
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.045, 0.05, 0.14, 18]} /><meshStandardMaterial color="#3a2618" roughness={0.6} /></mesh>
    <RBox s={[0.16, 0.04, 0.08]} r={0.015} p={[0.035, 0.02, 0]}><meshStandardMaterial color="#3a2618" roughness={0.6} /></RBox>
    {spikes && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.03 + (i % 4) * 0.04, -0.004, (Math.floor(i / 4) - 0.5) * 0.04]} rotation={[PI, 0, 0]}><coneGeometry args={[0.006, 0.016, 6]} />{M.steel()}</mesh>)}
  </group>;
  return <U3 d={d} bg={p.bg} ground={null} sky="#9aa8b8" mode="iris" key1={[-0.6, 2.4, 1.6]}
    cam={{ at: [0, 0.08, 0], az: [-0.35, -0.22], el: [0.18, 0.14], r: [0.95, 0.85], fov: 34 }}>{(tt) => {
    const slip = eio(tt, aC + 0.6, aC + 1.6);
    return <>
      <RBox s={[1.4, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}><meshPhysicalMaterial map={undefined} color="#6a5a48" roughness={0.1} clearcoat={1} /></RBox>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.6 + i * 0.2, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.005, 0.6]} /><meshBasicMaterial color="#2a2018" /></mesh>)}
      <group position={[-0.2, fallY(tt, aB, 0.4), -0.05]}><Bota spikes /></group><Sh p={[-0.2, 0, -0.05]} r={0.07} sx={1.3} />
      <group position={[0.15 + 0.5 * slip * slip, fallY(tt, aC, 0.4), 0.1]} rotation={[0, 0, -0.8 * slip]}><Bota spikes={false} /></group>
      <Sh p={[0.15 + 0.5 * slip * slip, 0, 0.1]} r={0.07} sx={1.3} />
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.2, 0.002, (rn(i, 2) - 0.5) * 0.5]} rotation={[-PI / 2, 0, 0]} scale={[1 + rn(i, 3), 0.5, 1]}><circleGeometry args={[0.04, 16]} /><meshBasicMaterial color="#e8eef4" transparent opacity={0.3} /></mesh>)}
      <spotLight position={[0.3, 1.8, 0.9]} angle={0.4} penumbra={0.7} intensity={8} distance={3} color="#e8eef8" />
    </>;
  }}</U3>;
};

// ---- ShackletonBote · el bote chiquito sube y baja en olas grises enormes; en «montañas» la cámara mira las cumbres que hay que cruzar ----
const ShackletonBote: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "bote", 0.6), aM = sec(p, "montanas", 2.6);
  return <U3 d={d} bg={p.bg} ground={null} sky="#4a5664" mode="iris" key1={[-1, 2.4, 1.4]} backDim={0.4}
    cam={{ at: [0, 0.16, -0.1], az: [-0.5, -0.3], el: [0.12, 0.1], r: [1.1, 0.95], fov: 34 }}>{(tt) => {
    const pitch = 0.22 * Math.sin(tt * 2 * PI * 0.31), roll = 0.12 * Math.sin(tt * 2 * PI * 0.23 + 1), heave = 0.04 * Math.sin(tt * 2 * PI * 0.31 + 0.6), mt = eio(tt, aM, aM + 1.6), bt = pop(tt, aB);
    return <>
      <mesh position={[0, -0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[7, 7]} /><meshPhysicalMaterial color="#2e3e4c" roughness={0.25} clearcoat={0.6} /></mesh>
      {Array.from({ length: 16 }, (_, i) => { const z = 0.4 - ((tt * 0.12 + i / 16) % 1) * 2.2, x = (rn(i, 1) - 0.5) * 1.8; return <group key={i} position={[x, -0.02, z]}>
        <mesh scale={[0.5 + rn(i, 2) * 0.6, 0.06 + 0.04 * rn(i, 3), 0.12]}><sphereGeometry args={[1, 20, 10]} /><meshStandardMaterial color="#3a4e5e" roughness={0.4} /></mesh>
        <mesh position={[0, 0.06 + 0.04 * rn(i, 3), 0]} scale={[0.25 + rn(i, 2) * 0.3, 0.012, 0.05]}><sphereGeometry args={[1, 12, 6]} /><meshStandardMaterial color="#d8e0e8" roughness={0.6} /></mesh></group>; })}
      <group position={[0, 0.06 + heave, 0]} rotation={[pitch, 0.4, roll]} scale={0.6 + 0.4 * sm(bt)}>
        <mesh position={[0, 0.05, 0]} scale={[1.6, 0.5, 0.6]}><sphereGeometry args={[0.2, 24, 12, 0, 2 * PI, PI / 2, PI / 2]} />{M.wood({ base: [120, 84, 50] })}</mesh>
        <mesh position={[0, 0.05, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 0.6, 1]}><ringGeometry args={[0.17, 0.2, 32]} />{M.wood({ base: [90, 60, 36] })}</mesh>
        <mesh position={[0.04, 0.22, 0]}><cylinderGeometry args={[0.006, 0.006, 0.36, 8]} />{M.wood({ base: [80, 56, 32] })}</mesh>
        <mesh position={[0.1, 0.24, 0]}><planeGeometry args={[0.12, 0.22]} /><meshStandardMaterial color="#d8ccb0" side={THREE.DoubleSide} roughness={0.9} /></mesh>
        {[-1, 1].map((s) => [-0.08, 0.1].map((x, j) => { const r = Math.sin(tt * 2 * PI * 0.6 + j); return <group key={s + "o" + j} position={[x, 0.08, s * 0.1]} rotation={[s * (0.5 + 0.15 * r), 0.5 * r, 0]}><mesh position={[0, 0, s * 0.14]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.28, 6]} />{M.wood({ base: [90, 64, 40] })}</mesh><mesh position={[0, 0, s * 0.27]} rotation={[PI / 2, 0, 0]} scale={[1, 1, 0.25]}><boxGeometry args={[0.035, 0.07, 0.035]} />{M.wood({ base: [90, 64, 40] })}</mesh></group>; }))}
        {[-0.16, -0.03, 0.14].map((x, i) => <group key={i} position={[x, 0.0, 0]}><Stickman escala={0.06} rotY={90} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }] as any} semilla={190 + i} contacto={0} color="#4a3e30" /></group>)}
      </group>
      {[[-0.9, 0.55], [-0.4, 0.75], [0.15, 0.6], [0.6, 0.8], [1.1, 0.5]].map(([x, h], i) => <group key={i} position={[x, lerp(-0.85, -0.02, mt), -1.8]}>
        <mesh position={[0, h / 2, 0]}><coneGeometry args={[h * 0.7, h, 6]} /><meshStandardMaterial color="#3a3c40" roughness={1} flatShading /></mesh>
        <mesh position={[0, h * 0.82, 0]}><coneGeometry args={[h * 0.25, h * 0.36, 6]} /><meshStandardMaterial color="#e8eef4" roughness={0.8} flatShading /></mesh></group>)}
      {Array.from({ length: 14 }, (_, i) => { const u = (tt * 0.9 + i / 14) % 1; return <mesh key={i} position={[0.3 + 0.2 * u * (rn(i, 1) - 0.3), heave + 0.04 + 0.2 * u - 0.25 * u * u, (rn(i, 2) - 0.5) * 0.2]} scale={sm(1 - u)}><sphereGeometry args={[0.008, 6, 4]} /><meshBasicMaterial color="#e8f0f8" /></mesh>; })}
      <directionalLight position={[-1.2, 2, 1]} intensity={1.1} color="#d8e0ec" />
      <hemisphereLight args={["#a8b4c4", "#1a2028", 0.6]} />
    </>;
  }}</U3>;
};

// ======================= CIERRE =======================

// ---- SieteObjetos · en la repisa, a medida que se nombran: sal, diamante, perla, clavo de vía, bola de caucho, goma y aceite ----
const S7 = ["sal", "diamantes", "perlas", "tren", "caucho", "goma", "aceite"];
const SieteObjetos: React.FC<UP> = ({ d, p }) => {
  const at = S7.map((k, i) => sec(p, k, 0.5 + i * 0.5));
  const Ob = ({ i }: { i: number }) => i === 0 ? <RBox s={[0.08, 0.06, 0.06]} r={0.01} p={[0, 0.03, 0]}><meshStandardMaterial color="#d8d4cc" roughness={0.5} /></RBox>
    : i === 1 ? <mesh position={[0, 0.04, 0]}><octahedronGeometry args={[0.04, 0]} /><meshPhysicalMaterial color="#eaf6ff" roughness={0.02} transmission={0.6} clearcoat={1} /></mesh>
    : i === 2 ? <mesh position={[0, 0.025, 0]}><sphereGeometry args={[0.025, 20, 16]} />{M.porcelain({ col: "#f6f0e6" })}</mesh>
    : i === 3 ? <group rotation={[0, 0, 0.3]}><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.006, 0.004, 0.1, 8]} />{M.brass({ col: "#d8b040" })}</mesh><RBox s={[0.025, 0.008, 0.015]} r={0.002} p={[0, 0.1, 0]}>{M.brass({ col: "#d8b040" })}</RBox></group>
    : i === 4 ? <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.04, 20, 14]} /><meshStandardMaterial color="#2a2018" roughness={0.5} /></mesh>
    : i === 5 ? <mesh position={[0, 0.035, 0]} scale={[1.2, 0.9, 1]}><dodecahedronGeometry args={[0.035, 1]} /><meshPhysicalMaterial color="#d8902a" roughness={0.25} clearcoat={1} /></mesh>
    : <group><mesh position={[0, 0.05, 0]} geometry={latheG("botella_e", [[0, 0], [0.03, 0], [0.032, 0.06], [0.012, 0.085], [0.01, 0.1], [0, 0.1]], 20)}>{M.glass({ op: 0.5, col: "#c8a050" })}</mesh></group>;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-0.8, 2.6, 2.0]}
    cam={{ at: [0, 0.3, 0], az: [-0.12, 0.08], el: [0.1, 0.08], r: [1.75, 1.6], fov: 34 }}>{(tt) => <>
    <RBox s={[1.6, 0.03, 0.22]} r={0.006} p={[0, 0.24, 0]}>{M.wood({ base: [110, 72, 40], rx: 4 })}</RBox>
    <RBox s={[1.6, 0.5, 0.03]} r={0.006} p={[0, 0.45, -0.12]}>{M.wood({ base: [80, 52, 30], rx: 4 })}</RBox>
    {at.map((a, i) => { const x = -0.66 + i * 0.22; return <group key={i} position={[x, 0.255 + fallY(tt, a, 0.5), 0]} visible={tt > a - 0.3}><group scale={1.4}><Ob i={i} /></group><Sh p={[0, 0, 0]} r={0.05} />
      <pointLight position={[0, 0.4, 0.3]} intensity={0.8 * eio(tt, a, a + 0.5)} distance={0.7} color="#ffd8a0" /></group>; })}
  </>}</U3>;
};

// ---- AntesAhora · cuatro cosas de antes que cambian a hoy, de a una: la ostra se vuelve bandeja de perlas, el árbol salvaje
// se vuelve fila de plantación, el arpón se apaga y sale una cola de ballena, la goma se vuelve un frasco de barniz ----
const AntesAhora: React.FC<UP> = ({ d, p }) => {
  const at = ["cultivan", "planta", "protegidas", "reemplazo"].map((k, i) => sec(p, k, 0.5 + i * 0.9));
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.2, 0], az: [-0.12, 0.06], el: [0.18, 0.14], r: [1.55, 1.4], fov: 34 }}>{(tt) => {
    const k = at.map((a) => eio(tt, a, a + 0.6));
    return <>
      {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.6 + i * 0.4, 0, 0]} scale={1.15}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.13, 0.14, 0.06, 32]} /><meshStandardMaterial map={dirtT([150, 142, 128])} roughness={0.95} /></mesh><Sh p={[0, 0, 0]} r={0.16} />
        <group position={[0, 0.06, 0]} scale={1.5}>
          <group scale={sm(1 - k[i])}>{i === 0 ? <mesh scale={[1, 0.4, 0.9]}><sphereGeometry args={[0.07, 18, 10]} /><meshStandardMaterial color="#8a8478" roughness={0.9} /></mesh>
            : i === 1 ? <Arbol h={0.2} col="#2a5a2a" /> : i === 2 ? <group rotation={[0, 0, 0.5]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.006, 0.006, 0.2, 8]} />{M.steel()}</mesh><mesh position={[0, 0.21, 0]}><coneGeometry args={[0.015, 0.04, 8]} />{M.steel()}</mesh></group>
            : <mesh position={[0, 0.03, 0]} scale={[1.2, 0.9, 1]}><dodecahedronGeometry args={[0.04, 1]} /><meshPhysicalMaterial color="#d8902a" roughness={0.25} clearcoat={1} /></mesh>}</group>
          <group scale={sm(k[i])}>{i === 0 ? <>{Array.from({ length: 9 }, (_, q) => <mesh key={q} position={[-0.05 + (q % 3) * 0.05, 0.02, -0.05 + Math.floor(q / 3) * 0.05]}><sphereGeometry args={[0.018, 14, 10]} />{M.porcelain({ col: "#f6f2ea" })}</mesh>)}</>
            : i === 1 ? <>{Array.from({ length: 6 }, (_, q) => <group key={q} position={[-0.06 + (q % 3) * 0.06, 0, -0.04 + Math.floor(q / 3) * 0.08]}><group scale={0.5}><Arbol h={0.2} col="#3a7a2a" /></group></group>)}</>
            : i === 2 ? <group position={[0, 0.02, 0]}><mesh position={[0, 0.06, 0]} scale={[0.4, 1, 0.3]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color="#3a4a5a" roughness={0.5} /></mesh>
              {[-1, 1].map((s) => <mesh key={s} position={[s * 0.04, 0.13, 0]} rotation={[0, 0, -s * 0.6]} scale={[1, 0.3, 0.5]}><sphereGeometry args={[0.04, 12, 8]} /><meshStandardMaterial color="#3a4a5a" roughness={0.5} /></mesh>)}</group>
            : <group><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.045, 0.045, 0.1, 24]} />{M.steel({ col: "#a8acb0" })}</mesh><mesh position={[0, 0.101, 0]}><cylinderGeometry args={[0.046, 0.046, 0.004, 24]} />{M.steel({ col: "#8a8e92" })}</mesh></group>}</group>
        </group>
        <pointLight position={[0, 0.5, 0.3]} intensity={0.3 + 0.8 * k[i]} distance={0.8} color="#ffd8a0" /></group>)}
      <spotLight position={[0, 2.2, 1.0]} angle={0.45} penumbra={0.7} intensity={7} distance={4} color="#ffe8c8" />
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CincoPeligros, GranitoBarra, DosVias, TunelNieve, Avalancha, TeHervido, CargaDormida, SelvaLampara, RuedaCaucho, CorteLatex, BolaHumo, SemillasFilas, PantanoVara, ResinaSiglos, VaraToca, VelaRaspado, BahiaEstacion, AceiteUsos, BotasClavos, ShackletonBote, SieteObjetos, AntesAhora };
