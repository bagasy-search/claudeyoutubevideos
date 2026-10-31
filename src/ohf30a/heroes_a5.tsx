// ohf30a · componentes únicos 29-35: las cuatro huellas de calor en fila, el respiradero tapado, abierta o cerrada nunca a medias,
// el manómetro de vapor de 0 a 3, olor a gas = afuera, la foto de la caldera, el cajón de siempre con la llave
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { BleedKey, Gauge, IronRad, OldBoiler, Pipe, RadH, Rag, Tape, Wheel, dialTex } from "./okit";

const PI = Math.PI;

// ---- 21:52 · LAS CUATRO HUELLAS: una cámara térmica en primer plano apunta al radiador de la pared; en su pantalla la imagen
// en falso color cambia cuatro veces (AIR, VALVE, SLUDGE, BALANCE) y el radiador real la copia ----
const PAT: [(i: number, y: number) => number, string, string][] = [
  [(i, y) => (y > 0.55 ? 0.12 : 0.85), "AIR", "#7cc0ff"],
  [() => 0.1, "VALVE", "#ff6a5a"],
  [(i, y) => (y > 0.45 ? 0.88 : 0.15), "SLUDGE", "#e0b070"],
  [(i, y) => 0.5 + 0.06 * Math.sin(i * 1.7), "BALANCE", "#7fe39a"],
];
const IRON = ["#12002a", "#4a0a7a", "#b0206a", "#f0502a", "#ffb020", "#fff2a0"].map((c) => new THREE.Color(c));
const ironbow = (v: number) => { const x = cl(v) * (IRON.length - 1), i = Math.min(IRON.length - 2, Math.floor(x)); return IRON[i].clone().lerp(IRON[i + 1], x - i); };
const nameTex = (s: string, col: string) => tex.text("thn" + s, 512, 96, (g) => { g.fillStyle = "rgba(0,0,0,0)"; g.clearRect(0, 0, 512, 96); g.font = "bold 64px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; g.fillText(s, 256, 52); });
export const HThermalFour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="sage" wallZ={-0.42} bg="#171815" key1={[-0.6, 1.8, 1.4]} warm={0.8}
  cam={{ at: [0.06, 0.36, 0.05], at1: [0.08, 0.36, 0.05], az: [0.22, -0.08], el: [0.1, 0.06], r: [1.05, 0.92], fov: 32 }}>{(tt) => {
  const ph = Math.max(0, Math.min(3, Math.floor((tt - 0.3) / 1.3))), loc = tt - 0.3 - ph * 1.3, k = ph === 0 ? eio(tt, 0.3, 0.8) : eio(loc, 0, 0.45);
  const prev = ph === 0 ? (() => 0.3) : PAT[ph - 1][0], cur = PAT[ph][0], val = (c: number, y: number) => lerp(prev(c, y), cur(c, y), k);
  const C = 9, R = 12, W = 0.24, Hs = 0.18, sway = 0.012 * Math.sin(tt * 0.9);
  return <>
    <IronRad n={9} w={0.05} h={0.5} p={[0, 0, -0.32]} heat={(i, y) => val(i, y)} glow={0.5} />
    <CShadow p={[0, 0, -0.32]} s={[0.65, 0.16]} o={0.6} />
    {/* la cámara térmica en mano, en primer plano */}
    <group position={[0.24 + sway, 0.33 + sway * 0.5, 0.34]} rotation={[0.04, -0.3, 0.03]} scale={0.85}>
      <RBox s={[0.3, 0.24, 0.07]} r={0.02}><meshStandardMaterial color="#2b2e33" roughness={0.55} /></RBox>
      <RBox s={[0.3, 0.05, 0.075]} p={[0, -0.11, 0]} r={0.015}><meshStandardMaterial color="#e0a020" roughness={0.6} /></RBox>
      <RBox s={[0.08, 0.2, 0.06]} p={[0.04, -0.2, -0.01]} r={0.02}><meshStandardMaterial color="#1c1e21" roughness={0.8} /></RBox>
      <mesh position={[0, 0.0, 0.036]}><planeGeometry args={[W + 0.012, Hs + 0.012]} /><meshBasicMaterial color="#050506" /></mesh>
      {Array.from({ length: C * R }, (_, j) => { const c = j % C, r = Math.floor(j / C), v = val(c * 1.0, (r + 0.5) / R) + 0.05 * (rn(j, 3) - 0.5) + 0.04 * Math.sin(c * 1.3 + r * 0.7);
        return <mesh key={j} position={[-W / 2 + (c + 0.5) * W / C, -Hs / 2 + 0.02 + (r + 0.5) * (Hs - 0.03) / R, 0.037]}><planeGeometry args={[W / C, (Hs - 0.03) / R]} /><meshBasicMaterial color={ironbow(v)} toneMapped={false} /></mesh>; })}
      <mesh position={[0, -0.11, 0.039]}><planeGeometry args={[0.29, 0.055]} /><meshBasicMaterial map={nameTex(PAT[ph][1], "#141414")} transparent toneMapped={false} opacity={k} /></mesh>
      {/* retícula */}
      <mesh position={[0, 0.01, 0.038]}><ringGeometry args={[0.012, 0.014, 24]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
      <pointLight position={[0, 0, 0.12]} intensity={0.15} distance={0.4} color="#ff8a4a" />
    </group>
  </>;
}}</Scene3D>;

// ---- 22:45 · NUEVE DE CADA DIEZ: en la mesa del taller, una bandeja de madera con diez respiraderos viejos, todos distintos
// (bala cromada, recto, en ángulo, de bronce, con costra); nueve reciben su etiqueta roja ----
const VentAny: React.FC<{ p: [number, number, number]; kind: number; s: number; crust: number }> = ({ p, kind, s, crust }) => <group position={p} scale={s}>
  <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.011, 0.011, 0.03, 6]} />{M.brass({ col: "#a8823a" })}</mesh>
  {kind === 0 && <><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.03, 0.03, 0.08, 24]} />{M.chrome({ col: "#dfe4e8" })}</mesh><mesh position={[0, 0.11, 0]}><sphereGeometry args={[0.03, 24, 12, 0, PI * 2, 0, PI / 2]} />{M.chrome({ col: "#dfe4e8" })}</mesh></>}
  {kind === 1 && <><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.024, 0.028, 0.06, 20]} />{M.brass()}</mesh>{[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.04 + i * 0.018, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.027, 0.003, 6, 20]} />{M.brass({ col: "#c49a46" })}</mesh>)}<mesh position={[0, 0.098, 0]}><cylinderGeometry args={[0.006, 0.006, 0.02, 8]} />{M.brass()}</mesh></>}
  {kind === 2 && <><mesh position={[0, 0.045, 0]}><sphereGeometry args={[0.018, 14, 10]} />{M.chrome({ col: "#cfd4d8" })}</mesh><group position={[0, 0.045, 0]} rotation={[0, 0, -0.9]}><mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.022, 0.022, 0.07, 20]} />{M.chrome({ col: "#cfd4d8" })}</mesh></group></>}
  {kind === 3 && <><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.034, 0.03, 0.09, 6]} /><meshStandardMaterial color="#6a6560" metalness={0.6} roughness={0.55} /></mesh><mesh position={[0, 0.12, 0]}><coneGeometry args={[0.02, 0.02, 12]} /><meshStandardMaterial color="#6a6560" metalness={0.6} roughness={0.55} /></mesh></>}
  {/* costra blanca de cal en los viejos */}
  {crust > 0 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[(rn(i, kind + 3) - 0.5) * 0.04, 0.05 + rn(i, kind + 7) * 0.06, 0.022 + rn(i, 9) * 0.01]}><dodecahedronGeometry args={[0.0025 + 0.0025 * rn(i, 2), 0]} /><meshStandardMaterial color="#efe9da" roughness={1} /></mesh>)}
</group>;
export const HNineOfTen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="brick" wallZ={-0.4} bg="#15130f" key1={[-0.6, 2.0, 1.2]} warm={0.85}
  cam={{ at: [-0.05, 0.08, 0.0], at1: [0.03, 0.1, 0.02], az: [-0.5, 0.25], el: [0.75, 0.55], r: [0.8, 0.95], fov: 32 }}>{(tt) => <>
  {/* bandeja de madera con divisiones */}
  <RBox s={[0.66, 0.012, 0.32]} p={[0, 0.006, 0]} r={0.004}>{M.wood({ base: [150, 100, 58] })}</RBox>
  {[-1, 1].map((k) => <RBox key={k} s={[0.66, 0.05, 0.014]} p={[0, 0.025, k * 0.153]} r={0.004}>{M.wood({ base: [130, 86, 50] })}</RBox>)}
  {[-1, 1].map((k) => <RBox key={k} s={[0.014, 0.05, 0.32]} p={[k * 0.323, 0.025, 0]} r={0.004}>{M.wood({ base: [130, 86, 50] })}</RBox>)}
  <RBox s={[0.64, 0.03, 0.008]} p={[0, 0.02, 0]} r={0.002}>{M.wood({ base: [130, 86, 50] })}</RBox>
  <CShadow p={[0, 0, 0]} s={[0.8, 0.45]} o={0.6} />
  {Array.from({ length: 10 }, (_, i) => { const row = Math.floor(i / 5), col = i % 5, x = -0.24 + col * 0.12 + (rn(i, 1) - 0.5) * 0.02, z = row ? 0.075 : -0.075;
    const drop = phys(tt, 0.2 + i * 0.1, 9, 0.42), kind = [0, 1, 2, 3, 0, 2, 1, 3, 0, 1][i], sc = 0.85 + 0.35 * rn(i, 4), bad = i !== 6;
    const tag = bad ? phys(tt, 2.0 + i * 0.16, 10, 0.4) : 0;
    return <group key={i}>
      <VentAny p={[x, 0.012 + 0.3 * (1 - cl(drop)), z]} kind={kind} s={sc} crust={rn(i, 8) > 0.5 ? 1 : 0} />
      {/* etiqueta roja colgada de un hilo */}
      <group position={[x + 0.035, 0.012, z + 0.03]} rotation={[-0.5, 0, 0.3 * (rn(i, 5) - 0.5)]} scale={Math.max(0.001, tag)} visible={tag > 0.01}>
        <RBox s={[0.06, 0.036, 0.002]} p={[0, 0.02, 0]} r={0.003}><meshStandardMaterial color="#c0392b" roughness={0.7} /></RBox>
        <mesh position={[-0.022, 0.02, 0.002]}><circleGeometry args={[0.004, 10]} /><meshBasicMaterial color="#f2efe6" /></mesh>
      </group>
    </group>; })}
  <Tape txt="9 OUT OF 10 = THE VENT" p={[0, 0.03, 0.162]} w={0.46} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.9)} />
</>}</Scene3D>;

// ---- 22:55 · EL RESPIRADERO TAPADO: el aire sale por el agujerito y el vapor entra detrás; la costra mineral lo cierra y todo se frena ----
export const HVentClog: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="brick" wallZ={-0.25} bg="#15130f" key1={[-0.8, 1.4, 1.3]}
  cam={{ at: [0.0, 0.36, 0], at1: [0.0, 0.4, 0], az: [0.4, -0.15], el: [0.1, 0.16], r: [0.7, 0.62], fov: 30 }}>{(tt) => {
  // r4: se tapa (1,6-2,8); a los 3,4 el tapón SALTA volando y el aire escupe un chorro blanco fuerte
  const clog = eio(tt, 1.6, 2.8), pop = cl((tt - 3.4) / 0.9), jet = eio(tt, 3.4, 3.7) * (1 - 0.4 * eio(tt, 4.8, 5.8)), airOut = (1 - clog) * (tt < 3.4 ? 1 : 0);
  const px = pop * 0.22, py = pop * 0.32 - pop * pop * 0.3, pr = pop * 9;
  return <group position={[0, 0.28, 0]}>
    {Array.from({ length: 22 }, (_, i) => { const u = (tt * 2.2 + i / 22) % 1, o = 0.5 * (1 - u) * jet; return <mesh key={'j' + i} position={[0.006 * Math.sin(i * 2.1), 0.12 + u * 0.3, 0.006 * Math.cos(i * 1.7)]} scale={0.5 + u * 2.4} visible={o > 0.004}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={o} depthWrite={false} /></mesh>; })}
    {/* el respiradero cromado con forma de bala, sobre su niple */}
    <Pipe a={[-0.3, -0.1, 0]} b={[0, -0.1, 0]} r={0.016} col="#8a8f94" />
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.045, 0.045, 0.12, 28, 1, true, 0, PI * 1.3]} />{M.chrome({ col: "#dfe4e8" })}</mesh>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.045, 0.045, 0.12, 28, 1, true, PI * 1.3, PI * 0.7]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.045, 28, 14, 0, PI * 2, 0, PI / 2]} />{M.chrome({ col: "#dfe4e8" })}</mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.005, 0.005, 0.02, 8]} />{M.brass()}</mesh>
      {/* la costra blanca que crece en el agujero */}
      {/* el tapón de sarro: sale del agujero como un corcho blanco y se le pega costra alrededor */}
      <mesh position={[px, 0.1 + 0.018 * clog + py, 0]} rotation={[0, 0, -pr]} scale={[1, Math.max(0.001, clog), 1]} visible={clog > 0.01}><cylinderGeometry args={[0.011, 0.013, 0.036, 16]} /><meshStandardMaterial color="#efe9da" roughness={1} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.012 * Math.cos(i * 1.3) + px * (0.6 + 0.3 * i), 0.1 + 0.03 * clog * rn(i, 2) + py * (0.8 + 0.1 * i), 0.012 * Math.sin(i * 1.3) + pop * 0.05 * (i - 2)]} scale={Math.max(0.001, clog * (0.6 + 0.6 * rn(i, 3)))} visible={clog > 0.01}><dodecahedronGeometry args={[0.009, 0]} /><meshStandardMaterial color="#e6dcc6" roughness={1} /></mesh>)}
    </group>
    {/* el aire que sale (mientras puede) */}
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.8 + i / 12) % 1; return <mesh key={i} position={[0.01 * Math.sin(i * 3), 0.1 + u * 0.22, 0.01 * Math.cos(i)]} scale={Math.max(0.001, airOut)}><sphereGeometry args={[0.008 + 0.01 * u, 8, 8]} /><meshBasicMaterial color="#d6ecff" transparent opacity={0.5 * (1 - u)} depthWrite={false} /></mesh>; })}
    {/* el frente de vapor por el caño: avanza y se frena */}
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.3 + Math.min(0.26, eio(tt, 0.2, 1.8) * 0.3) - i * 0.03, -0.1 + 0.01 * Math.sin(tt * 4 + i), 0]}><sphereGeometry args={[0.022 - i * 0.002, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} /></mesh>)}
    <Tape txt="CLOGGED VENT = COLD" p={[0.16, -0.04, -0.245]} rot={[0, 0, 0.02]} w={0.3} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.7)} />
  </group>;
}}</Scene3D>;

// ---- 23:35 · NUNCA A MEDIAS: UNA sola válvula de vapor en corte al pie del radiador; el volante gira y la compuerta pasa por
// ABIERTA (el vapor cruza: ✓), CERRADA (nada pasa: ✓) y A MEDIAS (el agua queda atrapada y golpea: ✗) ----
export const HNoHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="plaster" wallZ={-0.3} bg="#1b1815" key1={[-0.6, 1.8, 1.3]} warm={0.85}
  cam={{ at: [-0.02, 0.25, 0.0], at1: [0.0, 0.24, 0.0], az: [-0.35, 0.15], el: [0.18, 0.12], r: [0.75, 0.68], fov: 32 }}>{(tt) => {
  const st = tt < 1.75 ? 0 : tt < 3.3 ? 1 : 2, open = tt < 1.75 ? 1 : tt < 3.3 ? 1 - eio(tt, 1.75, 2.3) : eio(tt, 3.3, 3.85) * 0.5;
  const steam = st === 0 ? eio(tt, 0.2, 0.6) : st === 1 ? 1 - eio(tt, 1.9, 2.3) : eio(tt, 3.6, 4.0) * 0.4, water = st === 2 ? eio(tt, 3.7, 4.6) : 0;
  const bang = st === 2 ? 0.004 * Math.max(0, Math.sin(tt * PI * 1.6)) ** 8 * water : 0, wheelA = -open * PI * 3;
  const TXT = ["OPEN ✓", "CLOSED ✓", "HALF ✗"][st], COL = ["#1f6a3a", "#1f6a3a", "#b3261e"][st], t0 = [0.5, 2.3, 3.9][st];
  return <group position={[bang, 0, 0]}>
    <IronRad n={6} w={0.05} h={0.48} p={[0.34, 0, -0.12]} valve={false} heat={(i, y) => 0.12 + 0.7 * (st === 0 ? eio(tt, 0.6, 1.6) : st === 1 ? 1 - eio(tt, 2.3, 3.2) : 0.15)} />
    <CShadow p={[0.34, 0, -0.12]} s={[0.45, 0.15]} o={0.6} />
    <Pipe a={[-0.2, 0.0, 0.0]} b={[-0.2, 0.14, 0.0]} r={0.026} col="#3a3a3a" />
    <Pipe a={[0.07, 0.14, 0.0]} b={[0.16, 0.14, 0.0]} r={0.026} col="#3a3a3a" />
    <Pipe a={[0.16, 0.14, 0.0]} b={[0.16, 0.14, -0.12]} r={0.026} col="#3a3a3a" />
    <Pipe a={[-0.2, 0.14, 0.0]} b={[-0.07, 0.14, 0.0]} r={0.026} col="#3a3a3a" />
    <group position={[0, 0.14, 0]}>
      <mesh><sphereGeometry args={[0.075, 32, 24]} />{M.glass({ op: 0.22 })}</mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.075, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.034, 0.034, 0.02, 6]} />{M.brass({ col: "#b8892e" })}</mesh>)}
      {/* compuerta y vástago */}
      <mesh position={[0, 0.0 + 0.075 * open, 0]}><boxGeometry args={[0.014, 0.1, 0.08]} />{M.brass({ col: "#b8892e" })}</mesh>
      <mesh position={[0, 0.11 + 0.075 * open, 0]}><cylinderGeometry args={[0.008, 0.008, 0.12, 12]} />{M.brass()}</mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.03, 0.036, 0.04, 22]} />{M.brass({ col: "#a8823a" })}</mesh>
      <Wheel p={[0, 0.17 + 0.075 * open, 0]} a={wheelA} r={0.06} col="#9a2a1e" />
      {/* el agua atrapada en la media vuelta */}
      <mesh position={[0, -0.05 + 0.015 * water, 0]} scale={[1, Math.max(0.001, water), 1]} visible={water > 0.01}><cylinderGeometry args={[0.06, 0.06, 0.03, 28]} />{M.water({ op: 0.8 })}</mesh>
    </group>
    {/* vapor que cruza */}
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.6 + i / 12) % 1, x = -0.2 + u * 0.36 * (st === 2 ? 0.55 : 1);
      return <mesh key={i} position={[x, 0.14 + 0.012 * Math.sin(i * 2 + tt), 0.0]} visible={steam > 0.02}><sphereGeometry args={[0.018 + 0.006 * Math.sin(i), 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * steam * (1 - u * 0.5)} depthWrite={false} /></mesh>; })}
    {/* el sello: la cinta cambia en cada estado */}
    <group key={st}><Tape txt={TXT} col={COL} p={[-0.2, 0.3, -0.29]} rot={[0, 0, st === 2 ? -0.05 : 0.03]} w={0.24} k={phys(tt, t0, 10, 0.4)} rev={cl((tt - t0) / 0.4)} /></group>
  </group>;
}}</Scene3D>;

// ---- 24:10 · VAPOR: MEDIA LIBRA A DOS (r3: sin caldera): el caño maestro de vapor de hierro negro corre por la pared descascarada
// del sótano; de una T baja el rulo de cobre y cuelga el manómetro de esmalte verde con bisel de bronce; la aguja sube y se queda en verde ----
const DST = () => dialTex("st3c", 3, 0.5, 2, "PSI", 2.6, "cream");
export const HSteamGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="peel" wallZ={-0.3} bg="#15120f" key1={[-0.8, 1.6, 1.2]} warm={0.9}
  cam={{ at: [-0.02, 0.62, -0.15], at1: [0.04, 0.66, -0.16], az: [-0.42, 0.18], el: [0.04, 0.1], r: [0.92, 1.18], fov: 30 }}>{(tt) => {
  const v = lerp(0, 1.3, eio(tt, 0.5, 2.4)) + 0.1 * Math.sin(tt * 1.7) * cl(tt - 2.4), hiss = cl((tt - 1.0) / 1.2), sweat = eio(tt, 2.6, 4.0);
  const IR = "#2a2b2d", Y = 0.9, Z = -0.2;
  return <>
    {/* el caño maestro de vapor, con su codo y la bajada; abrazaderas a la pared */}
    <Pipe a={[-1.2, Y, Z]} b={[0.62, Y, Z]} r={0.034} col={IR} />
    <mesh position={[0.62, Y, Z]} castShadow><sphereGeometry args={[0.044, 20, 14]} /><meshStandardMaterial color={IR} metalness={0.6} roughness={0.55} /></mesh>
    <Pipe a={[0.62, Y, Z]} b={[0.62, 0.0, Z]} r={0.034} col={IR} />
    {[-0.55, 0.25].map((x) => <RBox key={x} s={[0.03, 0.09, 0.1]} p={[x, Y + 0.03, -0.25]} r={0.004}><meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.6} /></RBox>)}
    {/* la T, el niple y el rulo de cobre de dos vueltas */}
    <mesh position={[0, Y, Z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.044, 0.044, 0.09, 20]} /><meshStandardMaterial color={IR} metalness={0.6} roughness={0.55} /></mesh>
    <Pipe a={[0, Y - 0.04, Z]} b={[0, Y - 0.1, Z]} r={0.011} col={IR} />
    {[0, 1].map((k) => <mesh key={k} position={[0.004 * k, Y - 0.14 - k * 0.012, Z]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.034, 0.0075, 12, 36]} /><meshStandardMaterial color="#c07a40" metalness={0.85} roughness={0.28} /></mesh>)}
    <Pipe a={[0, Y - 0.19, Z]} b={[0, Y - 0.24, Z]} r={0.009} col="#c07a40" />
    {/* el manómetro: caja de esmalte verde, bisel de bronce, esfera crema con franja verde */}
    <Gauge v={v} max={3} tx={DST()} p={[0, Y - 0.37, Z + 0.02]} r={0.13} look="enamel" needle="#1d1d1d" />
    {/* la purga de aire del caño: un hilo de vapor que silba y después se calma */}
    <mesh position={[-0.42, Y + 0.06, Z]}><cylinderGeometry args={[0.018, 0.022, 0.05, 16]} />{M.chrome()}</mesh>
    {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.45 + i / 7) % 1, o = 0.16 * (1 - u) * hiss * (1 - 0.6 * sweat); return <mesh key={i} position={[-0.42 + 0.03 * Math.sin(i * 2.3 + u * 3), Y + 0.1 + u * 0.28, Z + 0.02]} scale={0.4 + u * 1.6} visible={o > 0.003}><sphereGeometry args={[0.03, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={o} depthWrite={false} /></mesh>; })}
    <pointLight position={[0.1, 0.75, 0.2]} intensity={0.35} distance={1.2} color="#ffd9a8" />
    <Tape txt="½ TO 2 PSI" col="#1f6a3a" p={[0.34, 0.65, -0.295]} rot={[0, 0, 0.03]} w={0.27} k={phys(tt, 1.9, 8, 0.45)} rev={cl((tt - 1.9) / 0.6)} />
    <Tape txt="WAY UP = CALL" col="#b3261e" p={[0.34, 0.5, -0.295]} rot={[0, 0, -0.03]} w={0.27} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 24:40 · OLOR A GAS = AFUERA: el pasillo de la casa a escala real, con la bruma de gas flotando baja; la puerta de entrada
// se abre a la luz del día, la bruma sale y en el escalón de afuera el teléfono se enciende ----
const callTex = () => tex.text("call911", 128, 256, (g) => { g.fillStyle = "#0e1a12"; g.fillRect(0, 0, 128, 256); g.fillStyle = "#2fc25a"; g.beginPath(); g.arc(64, 180, 30, 0, PI * 2); g.fill();
  g.fillStyle = "#ffffff"; g.font = "bold 40px Arial"; g.textAlign = "center"; g.fillText("CALL", 64, 72); g.font = "bold 26px Arial"; g.fillText("GAS CO.", 64, 112); g.font = "bold 30px Arial"; g.fillText("✆", 64, 191); });
export const HGasOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="none" bg="#15130f" key1={[-0.8, 1.8, 1.4]} warm={0.8}
  cam={{ at: [0.1, 0.5, -0.35], at1: [0.12, 0.46, -0.5], az: [-0.28, -0.04], el: [0.06, 0.1], r: [1.05, 0.92], fov: 36 }}>{(tt) => {
  const door = eio(tt, 2.3, 3.7), ph = eio(tt, 3.9, 4.4), WZ = -0.7, DW = 0.42, DH = 0.92;
  const plaster = <meshStandardMaterial map={tex.plaster("#cfc3ab", 2, 2)} roughness={0.9} />;
  return <>
    {/* la pared del frente con el vano de la puerta */}
    <RBox s={[1.4, 1.6, 0.06]} p={[-0.7 - DW / 2 + 0.0, 0.8, WZ]} r={0.004}>{plaster}</RBox>
    <RBox s={[1.4, 1.6, 0.06]} p={[0.7 + DW / 2, 0.8, WZ]} r={0.004}>{plaster}</RBox>
    <RBox s={[DW + 0.02, 1.6 - DH, 0.06]} p={[0, DH + (1.6 - DH) / 2, WZ]} r={0.004}>{plaster}</RBox>
    {/* marco de la puerta */}
    {[-1, 1].map((k) => <RBox key={k} s={[0.03, DH + 0.03, 0.08]} p={[k * (DW / 2 + 0.015), DH / 2, WZ]} r={0.004}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>)}
    <RBox s={[DW + 0.09, 0.035, 0.08]} p={[0, DH + 0.015, WZ]} r={0.004}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>
    {[-1, 1].map((k) => <RBox key={k} s={[1.4, 0.08, 0.02]} p={[k * (0.7 + DW / 2), 0.04, WZ + 0.035]} r={0.003}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>)}
    {/* la puerta, con bisagra a la izquierda, se abre hacia adentro */}
    <group position={[-DW / 2, 0, WZ + 0.01]} rotation={[0, door * 1.45, 0]}>
      <RBox s={[DW, DH, 0.035]} p={[DW / 2, DH / 2, 0.02]} r={0.006}>{M.wood({ base: [120, 70, 40] })}</RBox>
      {[0.28, 0.66].map((y, i) => <RBox key={i} s={[DW * 0.7, 0.24, 0.01]} p={[DW / 2, y, 0.04]} r={0.004}>{M.wood({ base: [104, 60, 34] })}</RBox>)}
      <mesh position={[DW - 0.05, 0.46, 0.05]}><sphereGeometry args={[0.018, 16, 12]} />{M.brass()}</mesh>
    </group>
    {/* afuera: el porche, el escalón, el pasto y la luz del día */}
    <RBox s={[1.2, 0.04, 0.6]} p={[0, 0.02, WZ - 0.33]} r={0.004}><meshStandardMaterial color="#9a958c" roughness={0.9} /></RBox>
    <mesh position={[0, 0.8, WZ - 1.4]}><planeGeometry args={[3, 2]} /><meshBasicMaterial color={new THREE.Color("#cfe6ff").multiplyScalar(0.25 + 0.95 * door)} toneMapped={false} /></mesh>
    <mesh position={[0, 0.12, WZ - 1.2]}><boxGeometry args={[2.4, 0.24, 0.3]} /><meshStandardMaterial color="#3f6a34" roughness={0.9} emissive="#3f6a34" emissiveIntensity={0.4 * door} /></mesh>
    <pointLight position={[0, 0.7, WZ - 0.3]} intensity={2.2 * door} distance={2.2} color="#e6f0ff" />
    {/* el teléfono en el porche */}
    <group position={[0.04, 0.05 + ph * 0.004, WZ - 0.2]} rotation={[-PI / 2 + 0.75 * ph, 0, 0.15]} scale={1.9}>
      <RBox s={[0.07, 0.14, 0.008]} r={0.008}><meshStandardMaterial color="#111" roughness={0.3} /></RBox>
      <mesh position={[0, 0, 0.0046]}><planeGeometry args={[0.062, 0.128]} /><meshBasicMaterial map={callTex()} color={new THREE.Color(1, 1, 1).multiplyScalar(0.15 + 0.85 * ph)} toneMapped={false} /></mesh>
    </group>
    <pointLight position={[0.1, 0.12, WZ - 0.18]} intensity={0.25 * ph} distance={0.4} color="#5aff8a" />
    {/* la bruma de gas: baja, amarillenta, lenta; al abrir se va por la puerta */}
    {Array.from({ length: 26 }, (_, i) => { const x0 = (rn(i, 1) - 0.5) * 1.3, z0 = WZ + 0.15 + rn(i, 2) * 0.9, y0 = 0.08 + rn(i, 3) * 0.4, out = door * eio(tt, 2.8 + rn(i, 4) * 0.8, 4.8 + rn(i, 4) * 0.8);
      return <mesh key={i} position={[lerp(x0, x0 * 0.2, out) + 0.04 * Math.sin(tt * 0.6 + i), y0 + 0.02 * Math.sin(tt * 0.8 + i * 2), lerp(z0, WZ - 0.5, out)]} scale={0.16 + 0.16 * rn(i, 5)}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#c9d68a" transparent opacity={0.05 * (1 - 0.6 * out)} depthWrite={false} /></mesh>; })}
    <Tape txt="SMELL GAS? GET OUT" col="#b3261e" p={[0.45, 0.68, WZ + 0.035]} rot={[0, 0, -0.02]} w={0.46} k={phys(tt, 0.6, 8, 0.45)} rev={cl((tt - 0.6) / 0.9)} />
    <Tape txt="CALL FROM OUTSIDE" p={[0.45, 0.5, WZ + 0.035]} rot={[0, 0, 0.02]} w={0.44} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 25:22 · SACALE UNA FOTO: por encima del hombro, el celular encuadra el manómetro de la caldera vieja del sótano;
// el foco se cierra sobre la aguja, FLASH (la caldera se ilumina), y la foto queda guardada en la esquina de la pantalla ----
const phoneTex = (shot: boolean) => tex.text("phone" + shot, 256, 512, (g) => {
  g.fillStyle = "#0b0b0c"; g.fillRect(0, 0, 256, 512);
  // visor: el frente esmaltado verde de la caldera con el manómetro
  g.fillStyle = "#3d5646"; g.fillRect(8, 60, 240, 330);
  g.fillStyle = "#2c3f33"; for (let i = 0; i < 5; i++) g.fillRect(30, 300 + i * 14, 196, 6);
  g.fillStyle = "#e6d6b0"; g.beginPath(); g.arc(128, 190, 70, 0, 6.3); g.fill(); g.strokeStyle = "#222"; g.lineWidth = 8; g.stroke();
  g.strokeStyle = "#3f9a52"; g.lineWidth = 12; g.beginPath(); g.arc(128, 190, 52, Math.PI * 0.75 + 0.25 * Math.PI * 1.5 / 1.5, Math.PI * 0.75 + (2 / 3) * Math.PI * 1.5); g.stroke();
  g.strokeStyle = "#b3261e"; g.lineWidth = 5; g.beginPath(); g.moveTo(128, 190); const a = Math.PI * 0.75 + (1.1 / 3) * Math.PI * 1.5; g.lineTo(128 + Math.cos(a) * 58, 190 + Math.sin(a) * 58); g.stroke();
  // barra de arriba y botón de disparo
  g.fillStyle = "#f2f2f2"; g.font = "600 18px Arial"; g.textAlign = "center"; g.fillText("PHOTO", 128, 430);
  g.beginPath(); g.arc(128, 472, 26, 0, 6.3); g.fillStyle = "#f2f2f2"; g.fill(); g.lineWidth = 4; g.strokeStyle = "#0b0b0c"; g.beginPath(); g.arc(128, 472, 21, 0, 6.3); g.stroke();
  if (shot) { g.fillStyle = "#3d5646"; g.fillRect(24, 452, 40, 40); g.fillStyle = "#e6d6b0"; g.beginPath(); g.arc(44, 472, 11, 0, 6.3); g.fill(); }
});
const DST2 = () => dialTex("st3b", 3, 0.5, 2, "PSI", undefined, "aged");
export const HSnapPhoto: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="brick" wallZ={-0.62} bg="#14120f" key1={[-0.9, 1.7, 0.6]} warm={0.8}
  cam={{ at: [0.04, 0.57, -0.25], at1: [0.05, 0.56, -0.25], az: [0.36, 0.22], el: [0.06, 0.03], r: [1.08, 0.96], fov: 34 }}>{(tt) => {
  const up = phys(tt, 0.2, 5.5, 0.6), foc = eio(tt, 1.0, 2.3), press = Math.max(0, 1 - Math.abs(tt - 2.6) * 8), flash = cl(1.4 - Math.abs(tt - 2.78) * 2.6);
  const shot = tt > 2.65, fly = eio(tt, 2.85, 3.6), saved = phys(tt, 3.6, 9, 0.45);
  const pilot = 0.75 + 0.25 * Math.sin(tt * PI * 1.6);
  return <>
    {/* la luz del flash, siempre montada: sólo sube su intensidad */}
    <pointLight position={[0.2, 0.52, 0.2]} intensity={1.1 * flash} distance={1.6} color="#f4f8ff" />
    {/* caldera de hierro vieja con frente esmaltado verde */}
    <group position={[0, 0, -0.32]}>
      <RBox s={[0.52, 0.78, 0.42]} p={[0, 0.39, 0]} r={0.03}><meshPhysicalMaterial color="#3d5646" roughness={0.42} clearcoat={0.5} /></RBox>
      {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.4, 0.012, 0.01]} p={[0, 0.12 + i * 0.03, 0.212]} r={0.003}><meshStandardMaterial color="#25352b" roughness={0.6} /></RBox>)}
      <mesh position={[0.15, 0.2, 0.212]}><circleGeometry args={[0.03, 24]} /><meshBasicMaterial color={new THREE.Color("#ff8a2a").multiplyScalar(pilot)} toneMapped={false} /></mesh>
      <mesh position={[0.15, 0.2, 0.211]} rotation={[0, 0, 0]}><ringGeometry args={[0.03, 0.04, 24]} />{M.brass()}</mesh>
      <Gauge v={1.1 + 0.03 * Math.sin(tt * 2)} max={3} tx={DST2()} p={[0, 0.58, 0.215]} r={0.085} look="black" />
      <Pipe a={[-0.16, 0.78, 0]} b={[-0.16, 1.5, 0]} r={0.035} col="#2c2c2c" />
      <Pipe a={[0.16, 0.78, 0]} b={[0.16, 1.5, 0]} r={0.025} col="#b87333" />
    </group>
    <CShadow p={[0, 0, -0.32]} s={[0.75, 0.6]} o={0.7} />
    {/* el celular, por encima del hombro: pantalla con el visor; atrás, la cámara y el flash */}
    <group position={[0.3, lerp(0.25, 0.53, cl(up)), 0.3]} rotation={[0.05, 0.3, 0.04 - 0.04 * cl(up)]}>
      <RBox s={[0.078, 0.158, 0.009]} r={0.011}><meshPhysicalMaterial color="#1c1d20" roughness={0.3} clearcoat={1} metalness={0.4} /></RBox>
      <mesh position={[0, 0, 0.0047]}><planeGeometry args={[0.072, 0.15]} /><meshBasicMaterial map={phoneTex(shot)} toneMapped={false} /></mesh>
      {/* cuadro de foco amarillo que se cierra sobre el reloj */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => { const s2 = lerp(0.03, 0.019, foc), cxy = [0, 0.024];
        return <group key={i} position={[cxy[0] + sx * s2, cxy[1] + sy * s2, 0.0052]}>
          <mesh position={[-sx * 0.004, 0, 0]}><planeGeometry args={[0.008, 0.0012]} /><meshBasicMaterial color="#ffd23a" toneMapped={false} transparent opacity={cl(foc * 3) * (shot ? 0 : 1)} /></mesh>
          <mesh position={[0, -sy * 0.004, 0]}><planeGeometry args={[0.0012, 0.008]} /><meshBasicMaterial color="#ffd23a" toneMapped={false} transparent opacity={cl(foc * 3) * (shot ? 0 : 1)} /></mesh>
        </group>; })}
      {/* la foto que vuela a la esquina */}
      {shot && <mesh position={[lerp(0, -0.0225, fly), lerp(0.012, -0.0565, fly), 0.0056]} scale={lerp(1, 0.16, fly)}><planeGeometry args={[0.07, 0.096]} /><meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.9 * (1 - fly)} /></mesh>}
      <mesh position={[0, 0, 0.0058]}><planeGeometry args={[0.072, 0.15]} /><meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.3 * flash} depthWrite={false} /></mesh>
      {/* el pulgar que dispara */}
      <mesh position={[0.0, -0.06 - 0.004 * press, 0.014 - 0.006 * press]} rotation={[0.9, 0, 0]} scale={[1, 1.5, 0.8]} castShadow><sphereGeometry args={[0.012, 18, 12]} /><meshPhysicalMaterial color="#d79e84" roughness={0.55} sheen={0.6} sheenColor="#ffb39a" /></mesh>
      <mesh position={[0.024, 0.06, -0.006]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.007, 0.007, 0.004, 20]} /><meshStandardMaterial color="#111" roughness={0.2} /></mesh>
      <mesh position={[0.012, 0.064, -0.0055]}><circleGeometry args={[0.003, 12]} /><meshBasicMaterial color="#fff6d8" toneMapped={false} transparent opacity={0.3 + 0.7 * flash} side={THREE.DoubleSide} /></mesh>
    </group>
    <Tape txt="SHOW SOMEONE WHO KNOWS" p={[0, 0.715, -0.103]} rot={[0, 0, -0.015]} w={0.44} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 26:15 · EL MISMO CAJÓN: en la cocina, el cajón se abre; la llave de bronce cae girando sobre el trapo y rebota; al lado
// la cinta y el marcador; el cajón se cierra un poco ----
export const HDrawer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="sage" wallZ={-0.4} bg="#171815" key1={[-0.6, 1.6, 1.2]} warm={0.85}
  cam={{ at: [0, 0.3, 0.16], at1: [-0.02, 0.24, 0.16], az: [-0.45, 0.3], el: [0.88, 0.62], r: [0.95, 0.84], fov: 32 }}>{(tt) => {
  // r4: abre, cae la llave, se CIERRA (un año), y se vuelve a abrir: la llave sigue ahí y brilla
  const open = eio(tt, 0.2, 1.0) - eio(tt, 1.9, 2.5) + phys(tt, 3.3, 7, 0.55), f = cl((tt - 1.1) / 0.45), b = Math.max(0, tt - 1.55);
  const ky = tt < 1.55 ? 0.45 - 0.45 * f * f : 0.035 * Math.abs(Math.sin(b * 7)) * Math.exp(-b * 4.5), spin = tt < 1.55 ? f * 5 : 5 + Math.min(b, 0.5) * 2;
  const glint = Math.max(0, 1 - Math.abs(tt - 4.7) * 1.6);
  return <>
    {/* mueble de cocina con mesada y salpicadero de azulejos */}
    <RBox s={[1.2, 0.4, 0.5]} p={[0, 0.2, -0.15]} r={0.01}><meshStandardMaterial color="#e6dcc4" roughness={0.75} /></RBox>
    <RBox s={[1.24, 0.03, 0.54]} p={[0, 0.415, -0.15]} r={0.006}><meshStandardMaterial map={tex.counter(3, 2)} roughness={0.35} /></RBox>
    <mesh position={[0, 0.62, -0.395]}><planeGeometry args={[1.24, 0.38]} /><meshStandardMaterial map={tex.tile(10, 4, "#f2f0ea", "#c8c4ba")} roughness={0.25} /></mesh>
    {[-0.42, 0.42].map((x, i) => <RBox key={i} s={[0.34, 0.12, 0.02]} p={[x, 0.31, 0.105]} r={0.006}><meshStandardMaterial color="#e6dcc4" roughness={0.75} /></RBox>)}
    {/* el cajón */}
    <group position={[0, 0.3, -0.12 + open * 0.3]}>
      <RBox s={[0.42, 0.012, 0.42]} p={[0, -0.05, 0]} r={0.004}>{M.wood({ base: [160, 110, 66] })}</RBox>
      {[-1, 1].map((k) => <RBox key={k} s={[0.012, 0.1, 0.42]} p={[k * 0.205, 0, 0]} r={0.003}>{M.wood({ base: [160, 110, 66] })}</RBox>)}
      <RBox s={[0.42, 0.1, 0.012]} p={[0, 0, -0.205]} r={0.003}>{M.wood({ base: [160, 110, 66] })}</RBox>
      <RBox s={[0.44, 0.13, 0.025]} p={[0, 0.01, 0.222]} r={0.008}><meshStandardMaterial color="#e6dcc4" roughness={0.75} /></RBox>
      <RBox s={[0.12, 0.014, 0.02]} p={[0, 0.058, 0.245]} r={0.006}>{M.brass()}</RBox>
      <Rag p={[-0.06, -0.035, 0.02]} s={[0.2, 0.02, 0.15]} />
      <group position={[-0.06, -0.012 + ky, 0.02]} rotation={[-PI / 2, spin, 0.4]}><BleedKey s={1.5} /></group>
      <mesh position={[-0.04, 0.0, 0.03]} visible={glint > 0.01} scale={1 + 1.5 * glint}><sphereGeometry args={[0.01, 10, 10]} /><meshBasicMaterial color="#fff2c0" toneMapped={false} transparent opacity={glint} /></mesh>
      <mesh position={[0.11, -0.025, 0.06]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.035, 0.018, 12, 28]} /><meshStandardMaterial color="#efe0b0" roughness={0.85} /></mesh>
      <group position={[0.11, -0.035, -0.1]} rotation={[PI / 2, 0, 0.3]}><mesh><cylinderGeometry args={[0.008, 0.008, 0.12, 12]} /><meshStandardMaterial color="#141414" /></mesh></group>
      <Tape txt="SAME DRAWER EVERY YEAR" p={[0, -0.018, 0.236]} w={0.4} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.8)} />
    </group>
    <CShadow p={[0, 0, -0.15]} s={[1.3, 0.6]} o={0.5} />
  </>;
}}</Scene3D>;
