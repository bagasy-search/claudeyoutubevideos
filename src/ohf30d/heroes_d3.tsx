// ohf30d · componentes únicos 19-27 (presión y purga en la caldera: lo que pasa abajo cuando arriba no hay purgas)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bubbles, Gauge, Puffs, Tape, dialTex } from "./okit";
import { BD, BallValve, Baseboard, Boiler, Bucket, CU, Cu, FlowDots, Hose, PY } from "./bbkit";

const PI = Math.PI;
type V3 = [number, number, number];
const D30 = () => dialTex("hw30", 30, 12, 15, "PSI", 27);

// ---- 11:27 · PRESIÓN BAJA = EL AGUA NO LLEGA ARRIBA (rehecho r2): casa en corte con dos pisos empapelados; la aguja se queda en lo
// bajo, la columna de agua empuja una y otra vez y no pasa la losa; abajo el zócalo arde, arriba se escarcha y el termómetro cae ----
const lpPaper = (k: string, a: string, b: string) => tex.text("lp_" + k, 256, 256, (g) => {
  g.fillStyle = a; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 16; i++) { const x = (i % 4) * 64 + 32, y = Math.floor(i / 4) * 64 + 32; g.fillStyle = b; g.beginPath(); g.arc(x, y, 6, 0, 6.3); g.fill(); }
});
export const HLowPressure: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#11141a" key1={[-0.8, 2.0, 1.8]}
  cam={{ at: [0.06, 0.5, 0.0], az: [-0.28, 0.06], el: [0.12, 0.05], r: [1.6, 1.42], fov: 32 }}>{(tt) => {
  const rise = eio(tt, 0.4, 2.0), surge = tt > 2.0 ? Math.max(0, Math.sin((tt - 2.0) * PI * 1.1)) : 0;
  const lvl = lerp(0.04, 0.34, rise) + 0.06 * surge, v = lerp(3, 6, rise) + 0.8 * surge, cold = eio(tt, 2.2, 5.4), temp = Math.round(lerp(66, 54, cold));
  return <>
    {/* casa en corte: abajo empapelado cálido, arriba frío; losa, techo y laterales */}
    <RBox s={[1.3, 0.46, 0.02]} p={[0.05, 0.23, -0.06]} r={0.004}><meshStandardMaterial map={lpPaper("a", "#c9ae86", "rgba(140,90,50,.35)")} roughness={0.9} /></RBox>
    <RBox s={[1.3, 0.4, 0.02]} p={[0.05, 0.7, -0.06]} r={0.004}><meshStandardMaterial map={lpPaper("b", "#9fb2bf", "rgba(255,255,255,.35)")} roughness={0.9} /></RBox>
    <RBox s={[1.34, 0.04, 0.24]} p={[0.05, 0.48, 0.04]} r={0.006}><meshStandardMaterial map={tex.wood(3, 1, [140, 92, 54])} roughness={0.6} /></RBox>
    <RBox s={[1.34, 0.04, 0.24]} p={[0.05, -0.02, 0.04]} r={0.006}><meshStandardMaterial map={tex.wood(3, 1, [140, 92, 54])} roughness={0.6} /></RBox>
    {[-1, 1].map((s) => <RBox key={s} s={[0.04, 0.94, 0.24]} p={[0.05 + s * 0.67, 0.45, 0.04]} r={0.006}><meshStandardMaterial color="#efe7d6" roughness={0.6} /></RBox>)}
    {[-1, 1].map((s) => <RBox key={"r" + s} s={[0.78, 0.045, 0.28]} p={[0.05 + s * 0.33, 1.08, 0.04]} rot={[0, 0, -s * 0.5]} r={0.006}><meshStandardMaterial color="#5a3c28" roughness={0.7} /></RBox>)}
    {/* caldera con su manómetro grande, clavado en lo bajo */}
    <Boiler p={[-0.42, 0.0, 0.02]} s={0.42} fire={0.6} />
    <Gauge v={v} max={30} tx={D30()} p={[-0.42, 0.33, 0.13]} r={0.085} />
    {/* el caño que sube: agua hasta donde la presión alcanza; aire arriba con burbujas que tiemblan */}
    <mesh position={[0.25, 0.395, 0.06]}><cylinderGeometry args={[0.026, 0.026, 0.65, 24, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0.25, 0.08 + lvl / 2, 0.06]}><cylinderGeometry args={[0.022, 0.022, Math.max(0.001, lvl), 24]} />{M.water({ op: 0.85, col: "#5aa7e0" })}</mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.25 + 0.01 * Math.sin(tt * 3 + i), 0.08 + lvl + 0.012 + i * 0.012, 0.075]} scale={Math.max(0.001, 1 - i * 0.18)}><sphereGeometry args={[0.005, 8, 6]} /><meshBasicMaterial color="#e9f5ff" transparent opacity={0.8} /></mesh>)}
    <Cu a={[-0.24, 0.12, 0.06]} b={[0.25, 0.12, 0.06]} r={0.016} />
    {/* el tope: la losa; una marca roja donde el agua no pasa */}
    <RBox s={[0.1, 0.008, 0.01]} p={[0.25, 0.47, 0.1]} r={0.002}><meshBasicMaterial color="#d33a2c" toneMapped={false} /></RBox>
    {/* abajo: zócalo encendido y calor; arriba: zócalo azul, escarcha y termómetro que cae */}
    <RBox s={[0.32, 0.09, 0.06]} p={[0.5, 0.06, 0.06]} r={0.01}><meshStandardMaterial color="#e7dfcf" roughness={0.42} emissive="#ff7a2a" emissiveIntensity={0.6 * rise} /></RBox>
    <Puffs tt={tt} n={6} a={[0.5, 0.12, 0.08]} b={[0.52, 0.4, 0.1]} r={0.016} col="#ff9a4a" op={0.3 * rise} v={0.4} />
    <RBox s={[0.32, 0.09, 0.06]} p={[0.5, 0.55, 0.06]} r={0.01}><meshStandardMaterial color="#c9d9ec" roughness={0.42} emissive="#3a6ab0" emissiveIntensity={0.4 * cold} /></RBox>
    <Cu a={[0.25, 0.55, 0.06]} b={[0.34, 0.55, 0.06]} r={0.016} />
    {Array.from({ length: 14 }, (_, i) => { const on = cold * 1.4 - rn(i, 4) * 0.5; return on > 0.01 ? <mesh key={i} position={[0.36 + rn(i, 1) * 0.28, 0.6 + rn(i, 2) * 0.012, 0.06 + (rn(i, 3) - 0.5) * 0.05]} scale={Math.min(1, on)}><octahedronGeometry args={[0.008, 0]} /><meshPhysicalMaterial color="#e6f4ff" roughness={0.1} emissive="#9cc8ff" emissiveIntensity={0.35} /></mesh> : null; })}
    <group position={[-0.36, 0.66, -0.045]}>
      <RBox s={[0.06, 0.24, 0.012]} r={0.01}><meshStandardMaterial color="#f1ead9" roughness={0.5} /></RBox>
      <mesh position={[0, -0.09 + lerp(0.15, 0.05, cold) / 2, 0.008]}><cylinderGeometry args={[0.005, 0.005, lerp(0.15, 0.05, cold), 10]} /><meshBasicMaterial color={temp > 60 ? "#d33a2c" : "#3a6ab0"} toneMapped={false} /></mesh>
      <mesh position={[0, -0.095, 0.008]}><sphereGeometry args={[0.011, 12, 10]} /><meshBasicMaterial color={temp > 60 ? "#d33a2c" : "#3a6ab0"} toneMapped={false} /></mesh>
    </group>
    <Tape txt={`${temp}°F`} col="#2a5c9a" p={[-0.24, 0.6, -0.03]} w={0.14} k={phys(tt, 0.8, 8, 0.45)} />
    <Tape txt="TOO LOW = TOP FLOOR STAYS COLD" p={[0.2, 0.73, 0.1]} w={0.62} k={phys(tt, 0.9, 8, 0.45)} rev={cl((tt - 0.9) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 11:49 · LA VÁLVULA DE ALIVIO ABRE SOLA A 30: su caño baja al piso; una etiqueta de papel cuelga de la palanca y dice que es del técnico ----
export const HReliefHands: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" key1={[-0.7, 1.6, 1.3]}
  cam={{ at: [0.0, 0.5, 0.05], az: [-0.42, -0.2], el: [0.12, 0.1], r: [1.15, 1.04], fov: 32 }}>{(tt) => {
  const sw = 0.25 * Math.sin(tt * 2.2) * Math.exp(-tt * 0.25), drip = (tt * 0.7) % 1;
  return <>
    <Cu a={[-0.5, 0.52, 0]} b={[0.0, 0.52, 0]} r={0.02} />
    <group position={[0.06, 0.52, 0]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.12, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
      <mesh position={[0.02, 0.07, 0]}><cylinderGeometry args={[0.035, 0.04, 0.12, 20]} />{M.brass()}</mesh>
      {/* palanca de prueba, y de ella cuelga la etiqueta */}
      <group position={[0.03, 0.13, 0]} rotation={[0, 0, -0.35]}>
        <RBox s={[0.1, 0.012, 0.014]} p={[0.05, 0, 0]} r={0.004}>{M.brass({ col: "#c9973f" })}</RBox>
        <mesh geometry={tubeG("rhstring", [[0.095, 0, 0], [0.1, -0.04, 0.005], [0.1, -0.08, 0]], 0.0012, 20, 6)}><meshStandardMaterial color="#d8d0bd" /></mesh>
        <group position={[0.1, -0.08, 0]} rotation={[0, 0, sw]}>
          <RBox s={[0.08, 0.12, 0.002]} p={[0, -0.06, 0]} r={0.004}><meshStandardMaterial color="#f2e2a8" roughness={0.8} /></RBox>
          <Tape txt="TECH ONLY" col="#b3261e" p={[0, -0.06, 0.003]} w={0.075} k={phys(tt, 1.0, 8, 0.45)} />
        </group>
      </group>
      {/* caño de descarga hasta cerca del piso */}
      <Cu a={[0.07, 0.04, 0]} b={[0.16, 0.04, 0]} r={0.016} /><Cu a={[0.16, 0.04, 0]} b={[0.16, -0.44, 0]} r={0.016} />
      <mesh position={[0.16, -0.44 - drip * 0.06, 0]} scale={Math.max(0.001, 1 - drip)}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ op: 0.85 })}</mesh>
    </group>
    <Gauge v={12 + 0.3 * Math.sin(tt)} max={30} tx={D30()} p={[-0.3, 0.52, 0.03]} r={0.08} />
    <Tape txt="AT 30 PSI IT OPENS BY ITSELF" p={[-0.08, 0.71, 0.05]} w={0.5} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.9)} />
    <Tape txt="HANDS OFF" col="#b3261e" p={[-0.3, 0.32, 0.06]} rot={[0, 0, 0.05]} w={0.2} k={phys(tt, 3.0, 8, 0.45)} />
  </>;
}}</Scene3D>;

// ---- 12:59 · SIN PURGAS ARRIBA: EL AIRE SE EMPUJA HASTA LA CALDERA (rehecho r3): casa en corte, zócalo de vidrio arriba sin purga;
// abajo se abre la llave de purga y la cámara baja siguiendo las burbujas por el caño hasta la manguera y el balde ----
const piPaper = () => tex.text("pi_wp", 512, 512, (g) => {
  g.fillStyle = "#7a3b3b"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) for (let x = 0; x < 512; x += 32) { g.fillStyle = "rgba(240,215,170,.22)"; g.beginPath(); g.arc(x + ((y / 32) % 2) * 16, y, 4, 0, 6.3); g.fill(); }
});
export const HPurgeIdea: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121416" key1={[-0.7, 1.8, 1.6]} warm={0.85}
  cam={{ at: [0.05, 0.62, 0.05], at1: [0.05, -0.05, 0.12], az: [-0.42, -0.12], el: [0.12, 0.2], r: [1.7, 1.5], fov: 32 }}>{(tt) => {
  const open = eio(tt, 0.9, 1.5), Y = 0.6, P: V3[] = [[-0.35, Y + PY, BD / 2], [0.43, Y + PY, BD / 2], [0.43, 0.12, BD / 2], [0.1, 0.12, BD / 2], [0.1, 0.12, 0.09], [0.12, 0.06, 0.2], [0.26, 0.2, 0.32]];
  const seg = P.slice(1).map((b, i) => Math.hypot(b[0] - P[i][0], b[1] - P[i][1], b[2] - P[i][2])), tot = seg.reduce((a, b) => a + b, 0);
  const at = (u: number): V3 => { let d = u * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const q = d / seg[i], a = P[i], b = P[i + 1]; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q)]; } d -= seg[i]; } return P[P.length - 1]; };
  return <>
    {/* arriba: cuarto empapelado con piso de madera; abajo: sótano de bloque */}
    <mesh position={[0, Y + 0.45, -0.012]}><planeGeometry args={[2.2, 0.9]} /><meshStandardMaterial map={piPaper()} roughness={0.85} /></mesh>
    <RBox s={[2.2, 0.06, 0.5]} p={[0, Y - 0.03, 0.2]} r={0.004}>{M.wood({ rx: 4, ry: 1, base: [120, 80, 46] })}</RBox>
    <mesh position={[0, (Y - 0.06) / 2 - 0.1, -0.012]}><planeGeometry args={[2.2, Y + 0.14]} /><meshStandardMaterial map={tex.tile(8, 4, "#8b8a86", "#5f5e5a")} roughness={0.9} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.1, 0.3]}><planeGeometry args={[2.2, 0.8]} /><meshStandardMaterial color="#5c5a56" roughness={0.9} /></mesh>
    <group position={[0, Y, 0]}><Baseboard len={0.7} ghost={0.22} heat={() => 0.7} /></group>
    <Boiler p={[-0.55, -0.1, 0.05]} s={0.42} fire={0.5} />
    <Cu a={[-0.43, 0.2, BD / 2]} b={[-0.43, Y + 0.02, BD / 2]} r={0.012} />
    <Cu a={[0.43, Y + 0.02, BD / 2]} b={[0.43, 0.12, BD / 2]} r={0.012} />
    <Cu a={[0.43, 0.12, BD / 2]} b={[-0.36, 0.12, BD / 2]} r={0.012} />
    <BallValve p={[0.1, 0.12, BD / 2]} open={open} s={1.3} col="#2a62b0" />
    <Hose id="pi3" pts={[[0.1, 0.12, 0.08], [0.12, 0.05, 0.2], [0.2, 0.0, 0.3], [0.26, 0.2, 0.32]]} r={0.009} />
    <Bucket p={[0.3, -0.1, 0.34]} s={0.75} />
    <Bubbles tt={tt} n={12} box={[0.07, 0.06, 0.07]} p={[0.3, 0.02, 0.34]} v={0.15} r={0.007} op={0.8 * cl(tt - 3.6)} />
    {/* el agua empuja: puntos azules y las burbujas plateadas que bajan hasta el balde */}
    <FlowDots tt={tt} pts={P.map((p) => [p[0], p[1], p[2] + 0.02] as V3)} n={40} v={0.14} r={0.006} col="#7fc4ff" k={open} />
    {Array.from({ length: 7 }, (_, i) => { const u = cl((tt - 1.4) * 0.24 - i * 0.05); return u > 0 && u < 1 ? <mesh key={i} position={[at(u)[0], at(u)[1], at(u)[2] + 0.024]}><sphereGeometry args={[0.016, 14, 10]} /><meshPhysicalMaterial color="#f4f9ff" emissive="#9fd2ff" emissiveIntensity={0.4} roughness={0.03} metalness={0.45} clearcoat={1} /></mesh> : null; })}
    <Tape txt="NO BLEEDER UP HERE" col="#7a1f1f" p={[0.0, Y + 0.29, 0.06]} w={0.5} k={phys(tt, 0.4, 8, 0.45)} rev={cl((tt - 0.4) / 0.6)} />
    <Tape txt="PUSH IT OUT AT THE BOILER" col="#1f4f8a" p={[-0.1, 0.36, 0.1]} w={0.62} k={phys(tt, 2.0, 8, 0.45)} rev={cl((tt - 2.0) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 13:28 · LAS CINCO PIEZAS DE LA CALDERA (rehecho r3): un tramo de caño real sobre el tablero perforado del sótano; se abre la llave
// de llenado y el agua avanza activando cada pieza por turno: zonas, purga que escupe, tanque que se infla y alivio que suelta vapor ----
const fpBoard = () => tex.text("fp_peg", 1024, 512, (g) => {
  g.fillStyle = "#8a6a46"; g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(60,40,20,${0.05 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 1024, rn(i, 3) * 512, 6, 1); }
  for (let y = 16; y < 512; y += 32) for (let x = 16; x < 1024; x += 32) { g.fillStyle = "#3a2a1a"; g.beginPath(); g.arc(x, y, 4, 0, 6.3); g.fill(); }
});
export const HFiveParts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none" bg="#15171a" key1={[-0.6, 1.6, 1.5]} warm={0.9}
  cam={{ at: [0.0, 0.3, 0.0], az: [-0.3, 0.08], el: [0.14, 0.1], r: [1.55, 1.42], fov: 32 }}>{(tt) => {
  const T = (i: number) => 0.6 + i * 0.95, on = (i: number) => eio(tt, T(i), T(i) + 0.5), X = [-0.52, -0.26, 0, 0.26, 0.52], Y = 0.2;
  const front = cl((tt - T(0)) / (T(4) - T(0) + 0.3));
  const N = ["1 FILL", "2 ZONE VALVES", "3 PURGE", "4 EXPANSION TANK", "5 RELIEF"];
  return <>
    <mesh position={[0, 0.4, -0.06]} receiveShadow><planeGeometry args={[1.8, 0.9]} /><meshStandardMaterial map={fpBoard()} roughness={0.8} /></mesh>
    <Cu a={[-0.75, Y, 0]} b={[0.68, Y, 0]} r={0.014} />
    {X.map((x, i) => <RBox key={"c" + i} s={[0.02, 0.05, 0.06]} p={[x + 0.1, Y, -0.03]} r={0.004}>{M.steel({ col: "#6d7177" })}</RBox>)}
    <FlowDots tt={tt} pts={[[-0.75, Y, 0.016], [0.68, Y, 0.016]]} n={46} v={0.2} r={0.006} col="#6ab8ff" stop={front} k={cl((tt - T(0)) * 3)} />
    {/* 1 llenado: la palanca roja gira */}
    <group position={[X[0], Y, 0]}><mesh><sphereGeometry args={[0.04, 20, 16]} />{M.brass()}</mesh><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.025, 0.03, 0.06, 18]} />{M.brass({ col: "#c9973f" })}</mesh>
      <group position={[0, 0.085, 0]} rotation={[0, on(0) * PI / 2, 0]}><RBox s={[0.1, 0.01, 0.016]} p={[0.04, 0, 0]} r={0.004}>{M.rubber({ col: "#c2302a" })}</RBox></group></group>
    {/* 2 válvulas de zona: dos ramales que suben y sus palancas se ponen en línea */}
    <group position={[X[1], Y, 0]}>{[-0.05, 0.05].map((dx, j) => <group key={j}><Cu a={[dx, 0, 0]} b={[dx, 0.17, 0]} r={0.011} /><BallValve p={[dx, 0.1, 0]} rot={[0, 0, PI / 2]} open={eio(tt, T(1) + j * 0.25, T(1) + j * 0.25 + 0.4)} s={0.9} col="#e0b52a" /></group>)}</group>
    {/* 3 purga: la palanca azul gira y la manguerita escupe */}
    <group position={[X[2], Y, 0]}><BallValve p={[0, -0.05, 0]} rot={[0, 0, PI / 2]} open={on(2)} s={1.0} col="#2a62b0" /><Cu a={[0, 0, 0]} b={[0, -0.03, 0]} r={0.011} />
      {Array.from({ length: 6 }, (_, j) => { const u = (tt * 1.8 + j / 6) % 1; return <mesh key={j} position={[0.01 * Math.sin(j), -0.09 - u * 0.12, 0.01]} visible={on(2) > 0.5}><sphereGeometry args={[0.0045, 8, 6]} />{M.water({ op: 0.9 })}</mesh>; })}</group>
    {/* 4 tanque de expansión: cuelga y se infla */}
    <group position={[X[3], Y, 0]}><Cu a={[0, 0, 0]} b={[0, -0.06, 0]} r={0.01} />
      <mesh position={[0, -0.15, 0]} scale={[1 + 0.12 * on(3) + 0.03 * on(3) * Math.sin(tt * 4), 1 + 0.06 * on(3), 1 + 0.12 * on(3)]}><capsuleGeometry args={[0.052, 0.08, 10, 24]} /><meshStandardMaterial color="#c9ccd1" metalness={0.55} roughness={0.32} /></mesh></group>
    {/* 5 alivio: la palanquita salta y suelta vapor */}
    <group position={[X[4], Y, 0]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.035, 0.1, 20]} />{M.brass()}</mesh>
      <RBox s={[0.01, 0.07, 0.01]} p={[0.03, 0.13, 0]} rot={[0, 0, -0.5 - 0.6 * on(4)]} r={0.003}>{M.brass({ col: "#c9973f" })}</RBox>
      <Puffs tt={tt} n={7} a={[0.03, 0.12, 0.0]} b={[0.17, 0.2, 0.08]} r={0.016} col="#ffffff" op={0.55 * on(4)} v={0.9} k={on(4)} /></group>
    {/* aro de luz en la pieza que se activa */}
    {X.map((x, i) => <mesh key={"r" + i} position={[x, Y, -0.05]} visible={on(i) > 0.01}><ringGeometry args={[0.09, 0.1, 40]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.7 * on(i) * (1 - 0.6 * on(i + 1))} toneMapped={false} depthWrite={false} /></mesh>)}
    {N.map((n, i) => <Tape key={"t" + i} txt={n} p={[X[i], i % 2 ? 0.53 : 0.42, 0.03]} w={[0.21, 0.38, 0.24, 0.42, 0.24][i]} k={phys(tt, Math.max(0.3, T(i) - 0.4), 8, 0.45)} />)}
  </>;
}}</Scene3D>;

// ---- 14:06 · PALANCA EN LÍNEA = ABIERTA: la válvula esférica en corte; la bola gira con la palanca y el agua pasa o se corta ----
export const HBallValve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[-0.6, 1.4, 1.3]}
  cam={{ at: [0.0, 0.06, 0.0], az: [-0.5, -0.3], el: [0.36, 0.3], r: [0.9, 0.8], fov: 32 }}>{(tt) => {
  const open = 1 - eio(tt, 3.0, 3.9), a = (1 - open) * PI / 2;
  return <>
    {/* cuerpo cortado: media cáscara de bronce para ver la bola */}
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.26, 32, 1, true, 0, PI]} />{M.brass({ col: "#c99a45" })}</mesh>
    <Cu a={[-0.42, 0, 0]} b={[-0.13, 0, 0]} r={0.03} /><Cu a={[0.13, 0, 0]} b={[0.42, 0, 0]} r={0.03} />
    <group rotation={[0, a, 0]}>
      <mesh><sphereGeometry args={[0.046, 32, 24]} />{M.chrome()}</mesh>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.024, 0.024, 0.094, 24]} /><meshStandardMaterial color="#0b0d10" /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />{M.steel()}</mesh>
      <RBox s={[0.16, 0.01, 0.024]} p={[0.07, 0.078, 0]} r={0.005}>{M.rubber({ col: "#c2302a" })}</RBox>
    </group>
    <FlowDots tt={tt} pts={[[-0.42, 0, 0], [0.42, 0, 0]]} n={22} v={0.35} r={0.009} col="#7fc4ff" k={open} />
    <FlowDots tt={tt} pts={[[-0.42, 0, 0], [-0.06, 0, 0]]} n={12} v={0.35} r={0.009} col="#7fc4ff" k={1 - open} />
    <Tape txt="LEVER IN LINE = OPEN" col="#1f6a3a" p={[0.0, 0.16, 0.0]} w={0.42} k={phys(tt, 0.6, 8, 0.45) * (1 - eio(tt, 2.9, 3.2))} rev={cl((tt - 0.6) / 0.8)} />
    <Tape txt="LEVER ACROSS = CLOSED" col="#b3261e" p={[0.0, 0.16, 0.0]} w={0.44} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 15:32 · LAS BURBUJAS SALEN POR LA MANGUERA: la boca de la manguera bajo el agua del balde larga bocanadas de aire ----
export const HHoseBucket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0.0, 0.24, 0.0], az: [-0.3, -0.12], el: [0.62, 0.56], r: [1.1, 1.0], fov: 32 }}>{(tt) => {
  const burst = (i: number) => (tt * 0.9 + rn(i, 2)) % 1;
  return <>
    <Bucket p={[0, 0, 0]} s={1.3} fill={0.75} water="#7aa9c9" />
    <Hose id="hb" pts={[[-0.5, 0.42, -0.1], [-0.3, 0.38, -0.05], [-0.1, 0.3, 0.0], [0.0, 0.16, 0.02]]} r={0.014} />
    {/* bocanadas grandes que suben desde la boca y revientan en la superficie */}
    {Array.from({ length: 14 }, (_, i) => { const u = burst(i), y = lerp(0.15, 0.215, u);
      return <mesh key={i} position={[0.0 + (rn(i, 3) - 0.5) * 0.06 * u, y + 0.004, 0.02 + (rn(i, 4) - 0.5) * 0.06 * u]} scale={Math.max(0.001, (0.6 + rn(i, 5)) * (u < 0.9 ? 1 : (1 - u) * 10))}><sphereGeometry args={[0.02, 14, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0.03} clearcoat={1} transparent opacity={0.9} emissive="#bfe4ff" emissiveIntensity={0.4} /></mesh>; })}
    {/* anillos donde revientan */}
    {[0, 1, 2].map((i) => { const q = (tt * 1.1 + i / 3) % 1; return <mesh key={i} position={[0, 0.218, 0.02]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.01 + q * 0.06, 0.013 + q * 0.06, 32]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * (1 - q)} depthWrite={false} /></mesh>; })}
    <Tape txt="BUBBLES = AIR LEAVING THE PIPES" p={[0.0, 0.34, -0.22]} rot={[-0.4, 0, 0]} w={0.5} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) / 1.1)} />
  </>;
}}</Scene3D>;

// ---- 15:44 · CERRADA LA DEL RETORNO, EL AGUA SALE POR LA MANGUERA: la flecha que volvía a la caldera choca con la válvula y dobla hacia la purga ----
export const HDivert: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" key1={[-0.7, 1.6, 1.4]}
  cam={{ at: [0.1, 0.44, 0.1], az: [-0.2, -0.04], el: [0.2, 0.16], r: [1.55, 1.42], fov: 32 }}>{(tt) => {
  const cls = eio(tt, 0.8, 1.6);
  return <>
    <Boiler p={[-0.38, 0, -0.05]} s={0.6} fire={0} />
    {/* retorno: viene de la casa por la derecha, pasa la purga y la válvula, y entra a la caldera */}
    <Cu a={[0.6, 0.55, 0.05]} b={[-0.2, 0.55, 0.05]} r={0.018} />
    <BallValve p={[-0.05, 0.55, 0.05]} open={1 - cls} s={1.3} />
    <group position={[0.18, 0.55, 0.05]}>
      <mesh><sphereGeometry args={[0.03, 18, 14]} />{M.brass()}</mesh>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
    </group>
    <Hose id="dv" pts={[[0.18, 0.48, 0.05], [0.2, 0.3, 0.1], [0.28, 0.12, 0.2], [0.42, 0.18, 0.28]]} r={0.012} />
    <Bucket p={[0.45, 0, 0.28]} s={0.6} />
    <FlowDots tt={tt} pts={[[0.6, 0.55, 0.075], [-0.2, 0.55, 0.075]]} n={22} v={0.3} col="#7fc4ff" k={1 - cls} />
    <FlowDots tt={tt} pts={[[0.6, 0.55, 0.075], [0.18, 0.55, 0.075], [0.18, 0.48, 0.075], [0.2, 0.3, 0.12], [0.28, 0.12, 0.22], [0.42, 0.18, 0.3]]} n={24} v={0.3} col="#7fc4ff" k={cls} />
    <Tape txt="CLOSED" col="#b3261e" p={[-0.05, 0.7, 0.06]} w={0.13} k={phys(tt, 0.8, 8, 0.45)} />
    <Tape txt="SO IT GOES OUT THE HOSE" p={[0.25, 0.76, 0.06]} w={0.42} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 16:32 · DE OSCURA A TRANSPARENTE, UN MINUTO: el chorro cae en un frasco; el agua sale turbia con burbujas y se aclara mientras corre el minuto ----
export const HDarkClear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" key1={[-0.6, 1.5, 1.2]}
  cam={{ at: [0.0, 0.16, 0.0], az: [-0.25, 0.0], el: [0.16, 0.12], r: [0.9, 0.8], fov: 32 }}>{(tt) => {
  const clr = eio(tt, 0.8, 3.4), col = new THREE.Color("#5a4630").lerp(new THREE.Color("#9fd2f0"), clr), sec = Math.round(60 * eio(tt, 0.8, 4.4));
  return <>
    <Hose id="dc" pts={[[-0.5, 0.42, 0], [-0.28, 0.44, 0], [-0.14, 0.4, 0], [-0.08, 0.34, 0]]} r={0.012} />
    <mesh geometry={tubeG("dcjet", [[-0.08, 0.33, 0], [-0.06, 0.26, 0], [-0.05, 0.16, 0]], 0.006, 20, 8)}><meshPhysicalMaterial color={col} roughness={0.05} transparent opacity={0.8} clearcoat={1} /></mesh>
    <group position={[-0.05, 0, 0]}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.06, 0.06, 0.16, 36, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh position={[0, 0.065, 0]}><cylinderGeometry args={[0.057, 0.057, 0.13, 36]} /><meshPhysicalMaterial color={col} roughness={0.05} transparent opacity={0.75} /></mesh>
      <Bubbles tt={tt} n={Math.round(18 * (1 - clr)) + 1} box={[0.09, 0.12, 0.09]} p={[0, 0.0, 0]} v={0.1} r={0.004} op={0.8 * (1 - clr)} />
    </group>
    {/* cronómetro */}
    <group position={[0.24, 0.16, 0.0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.02, 40]} /><meshStandardMaterial color="#f1ead9" roughness={0.5} /></mesh>
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.08, 0.008, 10, 40]} />{M.chrome()}</mesh>
      <mesh position={[0, 0, 0.012]}><ringGeometry args={[0.06, 0.07, 48, 1, PI / 2 - (sec / 60) * 2 * PI, Math.max(0.001, (sec / 60) * 2 * PI)]} /><meshBasicMaterial color="#1f6a3a" toneMapped={false} side={THREE.DoubleSide} /></mesh>
      <group rotation={[0, 0, -(sec / 60) * 2 * PI]}><RBox s={[0.004, 0.06, 0.003]} p={[0, 0.03, 0.014]} r={0.001}><meshStandardMaterial color="#1b1b1b" /></RBox></group>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.01, 0.01, 0.025, 12]} />{M.chrome()}</mesh>
    </group>
    <Tape txt="CLEAR FOR A MINUTE = DONE" p={[0.06, 0.33, 0.03]} w={0.44} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 16:49 · LA AGUJA TREPA → CERRÁ EL LLENADO: el manómetro sube hacia 30 y la palanca del llenado se cierra; la aguja afloja ----
// ---- 16:49 · LA AGUJA TREPA → CERRÁ EL LLENADO (rehecho r4): en el sótano, el manómetro montado en su caño sobre la caldera; entra
// agua fría por el llenado, la aguja trepa hacia 30 y titila; la palanca gira 90°, el agua se corta y la aguja afloja ----
export const HNeedleClimb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none" bg="#121416" key1={[-0.7, 1.5, 1.4]} warm={0.9}
  cam={{ at: [0.02, 0.4, 0.0], az: [-0.4, -0.1], el: [0.14, 0.08], r: [1.55, 1.36], fov: 32 }}>{(tt) => {
  const shut = eio(tt, 3.7, 4.3), v = lerp(12, 27, eio(tt, 0.4, 3.7)) - 5 * eio(tt, 4.3, 5.4), alarm = cl((v - 21) / 5) * (0.5 + 0.5 * Math.sin(tt * 9));
  const Y = 0.3;
  return <>
    <mesh position={[0, 0.5, -0.1]}><planeGeometry args={[2.4, 1.3]} /><meshStandardMaterial map={tex.tile(8, 4, "#8b8a86", "#5f5e5a")} roughness={0.9} /></mesh>
    <Boiler p={[-0.5, 0.0, 0.05]} s={0.5} fire={0.6} />
    <Cu a={[-0.38, Y, 0.06]} b={[0.5, Y, 0.06]} r={0.016} />
    <Cu a={[0.38, Y, 0.06]} b={[0.38, 0.95, 0.06]} r={0.014} />
    {/* el manómetro montado sobre una T del caño */}
    <mesh position={[0.02, Y, 0.06]}><sphereGeometry args={[0.026, 16, 12]} />{M.brass({ col: "#c99a45" })}</mesh>
    <Cu a={[0.02, Y, 0.06]} b={[0.02, Y + 0.12, 0.06]} r={0.008} col="#c99a45" />
    <Gauge v={v} max={30} tx={D30()} p={[0.02, Y + 0.22, 0.07]} r={0.11} />
    <mesh position={[0.02, Y + 0.22, 0.04]}><circleGeometry args={[0.16, 40]} /><meshBasicMaterial color="#ff3a2a" transparent opacity={0.35 * alarm} toneMapped={false} depthWrite={false} /></mesh>
    {/* la válvula de llenado en el caño de agua fría: la palanca gira 90° */}
    <BallValve p={[0.38, 0.62, 0.06]} rot={[0, 0, PI / 2]} open={1 - shut} s={1.5} col="#c2302a" />
    <FlowDots tt={tt} pts={[[0.38, 0.95, 0.09], [0.38, Y, 0.09], [-0.36, Y, 0.09]]} n={36} v={0.22} r={0.007} col="#6ab8ff" k={1 - shut} />
    <Tape txt="NEAR 30? SHUT THE FILL" col="#b3261e" p={[-0.1, 0.16, 0.2]} w={0.56} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.8)} />
  </>;
}}</Scene3D>;
