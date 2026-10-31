// ohf30a · componentes únicos 8-14: orden de purga en la casa en corte, el tornillito que se sale, pinza vs llave, raspado húmedo,
// la válvula de llenado, los 30 psi y la válvula que no se toca, el reloj de arena mientras el radiador se calienta de abajo arriba
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { BleedKey, Cup, FlowPath, Gauge, IronRad, OldBoiler, Pipe, RadH, Rag, Tape, dialTex } from "./okit";

const PI = Math.PI;
const D30 = () => dialTex("hw30", 30, 12, 15, "PSI", 27);
// gota que viaja por una recta (para chorros y caños)
const along = (a: number[], b: number[], k: number): [number, number, number] => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// ---- 5:30 · EL ORDEN: la casa en corte con sus pisos; los radiadores se numeran solos, del más bajo y cercano al más alto y lejano ----
const SPOTS: [number, number][] = [[-0.25, 0], [0.35, 0], [-0.25, 1], [0.35, 1], [0.35, 2]];
export const HBleedOrder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="brick" wallZ={-0.3} bg="#1b1815" key1={[-1, 2.6, 1.8]} warm={0.85}
  cam={{ at: [0.05, 0.66, 0], az: [-0.3, 0.25], el: [0.12, 0.2], r: [2.6, 2.3], fov: 34 }}>{(tt) => <>
  {/* los pisos de la casa: losas de madera; la caldera en el sótano, a la izquierda */}
  {[0, 1, 2].map((f) => <RBox key={f} s={[1.3, 0.035, 0.42]} p={[0.05, 0.2 + f * 0.42, 0]} r={0.008}>{M.wood({ base: [120, 80, 46] })}</RBox>)}
  <RBox s={[0.035, 1.3, 0.42]} p={[-0.6, 0.62, 0]} r={0.008}><meshStandardMaterial color="#d8cbb0" roughness={0.9} /></RBox>
  <RBox s={[0.035, 1.3, 0.42]} p={[0.7, 0.62, 0]} r={0.008}><meshStandardMaterial color="#d8cbb0" roughness={0.9} /></RBox>
  <RBox s={[0.16, 0.17, 0.14]} p={[-0.45, 0.09, 0]} r={0.01}><meshStandardMaterial color="#7a2c22" metalness={0.3} roughness={0.5} /></RBox>
  <Pipe a={[-0.45, 0.17, 0]} b={[-0.45, 0.25, 0]} r={0.012} />
  <Pipe a={[-0.45, 0.25, -0.12]} b={[0.45, 1.08, -0.12]} r={0.01} />
  {SPOTS.map(([x, f], i) => { const on = eio(tt, 0.8 + i * 0.75, 1.3 + i * 0.75), pop = phys(tt, 0.8 + i * 0.75, 9, 0.4);
    return <group key={i} position={[x, 0.22 + f * 0.42, 0.02]}>
      <RadH n={5} w={0.03} h={0.14} heat={() => 0.25 + 0.6 * on} glow={0.8} />
      <Tape txt={String(i + 1)} p={[0, 0.25, 0.05]} w={0.24} col="#b3261e" k={cl(pop)} />
    </group>; })}
  <Tape txt="LOW + CLOSE FIRST" p={[0.05, 0.1, 0.23]} rot={[0, 0, 0.02]} w={0.85} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) / 0.8)} />
</>}</Scene3D>;

// ---- 6:08 · NO SIGAS GIRANDO: el tornillito del purgador del radiador de hierro sale girando, cae al piso y rebota;
// por el agujero sale el chorro y el charco crece en el roble ----
export const HScrewOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="peel" wallZ={-0.24} bg="#1b1815" key1={[-0.9, 1.5, 1.3]} warm={0.85}
  cam={{ at: [0.02, 0.55, -0.1], at1: [0.1, 0.24, -0.04], az: [0.62, 0.22], el: [0.08, 0.34], r: [0.42, 1.45], fov: 32 }}>{(tt) => {
  const out = eio(tt, 0.4, 2.2), f = cl((tt - 2.2) / 0.45), b = Math.max(0, tt - 2.65), jet = eio(tt, 2.25, 2.7), pud = eio(tt, 2.6, 5.6);
  const sx = 0.03 + out * 0.04 + f * 0.08 + Math.min(b, 0.8) * 0.06, sy = tt < 2.65 ? 0.6 - 0.588 * f * f : 0.012 + 0.08 * Math.abs(Math.sin(b * 6.5)) * Math.exp(-b * 3.2);
  const L = 5 * 0.06 * 1.12;
  return <>
    <IronRad n={5} w={0.06} h={0.62} p={[-L / 2 - 0.012, 0, -0.1]} heat={() => 0.25} bleed={false} />
    <CShadow p={[-L / 2 - 0.012, 0, -0.1]} s={[L + 0.1, 0.16]} o={0.6} />
    {/* el cuerpo del purgador en la punta de la última sección */}
    <mesh position={[0.0, 0.6, -0.1]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.05, 24]} />{M.brass({ col: "#b8892e" })}</mesh>
    <mesh position={[0.026, 0.6, -0.1]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.009, 20]} /><meshStandardMaterial color="#0d0b08" /></mesh>
    {/* el tornillito: sale girando, cae y rebota */}
    <group scale={1.5} position={[sx, sy, -0.1 + f * 0.04 + Math.min(b, 0.8) * 0.03]} rotation={[out * 10 + f * 2 + Math.min(b, 0.6) * 3, 0, PI / 2 + f * 1.4]}>
      <mesh><cylinderGeometry args={[0.008, 0.008, 0.03, 14]} />{M.brass()}</mesh>
      <mesh position={[0, -0.013, 0]}><cylinderGeometry args={[0.0085, 0.0085, 0.005, 20]} />{M.brass({ col: "#e8c070" })}</mesh>
      <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.009, 0.01, 0.009]} />{M.brass()}</mesh>
    </group>
    {/* el chorro en arco hasta el piso */}
    {Array.from({ length: 30 }, (_, i) => { const u = ((tt * 1.5 + i / 30) % 1), x = 0.03 + u * 0.2, y = 0.6 + u * 0.04 - u * u * 0.62;
      return <mesh key={i} position={[x, Math.max(0.01, y), -0.1 + 0.004 * Math.sin(i)]} scale={Math.max(0.001, jet)} visible={jet > 0.01}><sphereGeometry args={[0.006 + 0.004 * rn(i, 2), 10, 8]} />{M.water({ op: 0.75 })}</mesh>; })}
    <mesh position={[0.2, 0.003, -0.08]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, pud), Math.max(0.001, pud * 0.8), 1]} visible={pud > 0.01}><circleGeometry args={[0.16, 40]} />{M.water({ op: 0.55, col: "#9cc4dc" })}</mesh>
    <Tape txt="QUARTER TURN, NO MORE" p={[0.36, 0.5, -0.235]} rot={[0, 0, 0.02]} w={0.36} k={phys(tt, 2.9, 8, 0.45)} rev={cl((tt - 2.9) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 6:45 · PINZA NO: dos purgadores de frente a cámara; la pinza muerde el de la izquierda, gira, se resbala y le come las
// esquinas (viruta de bronce); a la derecha la llave cuadrada calza entera y gira un cuarto ----
const Stem: React.FC<{ p: [number, number, number]; round: number; rot?: number }> = ({ p, round, rot = 0 }) => <group position={p}>
  <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.024, 0.024, 0.05, 28]} />{M.brass({ col: "#b8892e" })}</mesh>
  <group position={[0, 0, 0.035]} rotation={[0, 0, rot]}>
    <mesh visible={round < 0.5}><boxGeometry args={[0.02, 0.02, 0.022]} />{M.brass()}</mesh>
    <mesh visible={round >= 0.5} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.011, 0.012, 0.022, 18]} />{M.brass({ col: "#8a6a2a" })}</mesh>
  </group>
</group>;
export const HPliers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="paper" wallZ={-0.16} bg="#191714" key1={[-0.6, 1.5, 1.2]} warm={0.85}
  cam={{ at: [-0.12, 0.5, 0.0], at1: [0.0, 0.52, 0.0], az: [0.3, -0.18], el: [0.12, 0.08], r: [0.55, 0.78], fov: 32 }}>{(tt) => {
  const inP = eio(tt, 0.2, 0.8), bite = eio(tt, 0.8, 1.2), tw = Math.sin(eio(tt, 1.2, 2.4) * PI * 3) * 0.35 * cl((tt - 1.2) * 4) * (1 - eio(tt, 2.4, 2.6)), round = eio(tt, 1.5, 2.3), outP = eio(tt, 2.5, 3.0);
  const key = eio(tt, 2.9, 3.7), turn = eio(tt, 3.9, 4.6) * PI / 2, jaw = 0.3 * (1 - bite) + 0.25 * outP;
  const L = 3 * 0.06 * 1.12, SL: [number, number, number] = [-0.16, 0.5, -0.02], SR: [number, number, number] = [0.16, 0.5, -0.02];
  return <>
    {[SL, SR].map((q, i) => <React.Fragment key={i}>
      <IronRad n={3} w={0.06} h={0.5} p={[q[0] - L / 2, 0, -0.08]} heat={() => 0.2 + 0.5 * (i === 1 ? eio(tt, 4.4, 5.6) : 0)} bleed={false} valve={false} />
      <CShadow p={[q[0], 0, -0.08]} s={[L + 0.08, 0.15]} o={0.6} />
    </React.Fragment>)}
    <Stem p={SL} round={round} rot={tw} />
    <Stem p={SR} round={0} rot={turn} />
    {/* virutas de bronce que caen */}
    {Array.from({ length: 14 }, (_, i) => { const a = 1.5 + i * 0.06, k = cl((tt - a) / 0.7);
      return <mesh key={i} position={[SL[0] + (rn(i, 1) - 0.5) * 0.04, SL[1] - k * k * 0.48, SL[2] + 0.04 + rn(i, 3) * 0.04]} rotation={[k * 6 + i, k * 4, 0]} visible={k > 0 && k < 1}><boxGeometry args={[0.005, 0.002, 0.004]} />{M.brass({ col: "#f0c060" })}</mesh>; })}
    {/* la pinza: entra en diagonal, muerde, gira y se resbala, se va */}
    <group position={[SL[0] - 0.012 - 0.3 * (1 - inP) - 0.3 * outP, SL[1], SL[2] + 0.035]} rotation={[0, PI, tw]}>
      {[-1, 1].map((sg) => <group key={sg} rotation={[0, 0, sg * jaw]}>
        <RBox s={[0.07, 0.012, 0.016]} p={[0.035, sg * 0.014, 0]} r={0.004}>{M.steel({ col: "#7d8288" })}</RBox>
        <RBox s={[0.14, 0.014, 0.016]} p={[0.14, sg * 0.026, 0]} r={0.006}>{M.rubber({ col: "#b8302a" })}</RBox>
      </group>)}
      <mesh position={[0.07, 0, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.03, 16]} />{M.steel()}</mesh>
    </group>
    {/* la llave cuadrada: entra derecho y gira */}
    <group position={[SR[0], SR[1], SR[2] + 0.046 + 0.25 * (1 - key)]} rotation={[0, 0, turn]}>
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow><cylinderGeometry args={[0.019, 0.019, 0.06, 28]} />{M.brass({ col: "#d0a04a" })}</mesh>
      <RBox s={[0.11, 0.022, 0.014]} p={[0, 0, 0.065]} r={0.006}>{M.brass({ col: "#c4943e" })}</RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.056, 0, 0.065]}><sphereGeometry args={[0.012, 16, 12]} />{M.brass({ col: "#c4943e" })}</mesh>)}
    </group>
    <Tape txt="NO PLIERS" col="#b3261e" p={[-0.16, 0.65, -0.155]} rot={[0, 0, 0.03]} w={0.2} k={phys(tt, 2.1, 8, 0.45)} rev={cl((tt - 2.1) / 0.6)} />
    <Tape txt="A KEY THAT FITS" col="#1f6a3a" p={[0.16, 0.65, -0.155]} rot={[0, 0, -0.02]} w={0.26} k={phys(tt, 3.7, 8, 0.45)} rev={cl((tt - 3.7) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 7:20 · PINTURA VIEJA = RASPAR HÚMEDO: el rociador moja, la espátula levanta las escamas y caen sobre el trapo mojado ----
export const HWetScrape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="peel" wallZ={-0.11} bg="#1b1815" key1={[-1.0, 1.6, 1.2]}
  cam={{ at: [0, 0.26, 0], az: [-0.35, 0.3], el: [0.3, 0.22], r: [1.1, 0.95], fov: 32 }}>{(tt) => {
  const mist = cl((tt - 0.5) / 1.0), sc = eio(tt, 1.8, 3.6);
  return <>
    {/* r4: un radiador de hierro de verdad, pintado de crema viejo; la espátula raspa su última columna */}
    <IronRad n={6} w={0.06} h={0.5} p={[-0.13, 0, -0.05]} paint="#e2d6b8" heat={() => 0.5} glow={0} valve={false} />
    <CShadow p={[-0.13, 0, -0.05]} s={[0.5, 0.14]} o={0.6} />
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.3 + rn(i, 2) * 0.36, 0.12 + rn(i, 3) * 0.36, -0.05 + 0.034]}><circleGeometry args={[0.006 + 0.01 * rn(i, 4), 7]} /><meshStandardMaterial color="#5a4a3a" roughness={0.9} /></mesh>)}
    {/* el rociador */}
    <group position={[0.42, 0.42, 0.05]} rotation={[0, 0, 0.5]}>
      <RBox s={[0.07, 0.15, 0.05]} r={0.015}>{M.plastic({ col: "#3a7ac8", op: 0.85 })}</RBox>
      <RBox s={[0.05, 0.04, 0.03]} p={[-0.02, 0.09, 0]} r={0.008}>{M.plastic({ col: "#f2f2f2" })}</RBox>
    </group>
    {mist > 0 && mist < 1 && Array.from({ length: 30 }, (_, i) => <mesh key={i} position={along([0.37, 0.48, 0.05], [0.16 + (rn(i, 2) - 0.5) * 0.12, 0.3 + (rn(i, 3) - 0.5) * 0.12, 0.01], cl(mist * 1.4 - rn(i, 4) * 0.4))}><sphereGeometry args={[0.003, 6, 6]} />{M.water({ op: 0.6 })}</mesh>)}
    {/* espátula que avanza */}
    <group position={[lerp(0.32, 0.08, sc), 0.29, 0.02]} rotation={[0, 0, 0.25]}>
      <RBox s={[0.09, 0.004, 0.06]} p={[-0.04, 0, 0]} r={0.001}>{M.steel()}</RBox>
      <RBox s={[0.12, 0.022, 0.03]} p={[0.06, 0.004, 0]} r={0.008}>{M.wood({ base: [130, 80, 40] })}</RBox>
    </group>
    {/* escamas que caen mojadas sobre el trapo */}
    {Array.from({ length: 14 }, (_, i) => { const a = 1.9 + i * 0.12, k = cl((tt - a) / 0.6);
      return k > 0 && <mesh key={i} position={[0.18 - i * 0.012 + rn(i, 5) * 0.03, 0.29 - k * 0.27, 0.03 + rn(i, 6) * 0.05]} rotation={[rn(i, 7) * 3 + k * 2, rn(i, 8) * 3, 0]}><planeGeometry args={[0.012, 0.009]} /><meshStandardMaterial color="#efe6cc" side={THREE.DoubleSide} roughness={0.9} /></mesh>; })}
    <Rag p={[0.1, 0.012, 0.06]} s={[0.24, 0.02, 0.14]} />
    <Tape txt="SCRAPE WET · NEVER SAND" p={[-0.13, 0.13, 0.0]} rot={[0, 0, 0.02]} w={0.42} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 7:55 · AIRE QUE SALE = AGUA QUE ENTRA: el caño de agua fría baja por la pared, la palanca de la válvula de llenado se abre,
// las gotas azules corren hasta la caldera y la aguja vuelve a 14 ----
const DFV = () => dialTex("fv30", 30, 12, 15, "PSI", 27, "aged");
export const HFillValve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="sage" wallZ={-0.4} bg="#171714" key1={[-0.8, 1.8, 1.4]} warm={0.85}
  cam={{ at: [-0.16, 0.56, -0.12], at1: [0.0, 0.54, -0.14], az: [-0.35, 0.18], el: [0.08, 0.06], r: [0.8, 1.05], fov: 32 }}>{(tt) => {
  const flow = eio(tt, 0.7, 1.3), v = lerp(7, 14, eio(tt, 1.4, 4.4)) + 0.3 * Math.sin(tt * 4) * (1 - eio(tt, 4.0, 4.8)) * cl(tt - 1.4);
  const PTS: [number, number, number][] = [[-0.5, 0.95, -0.36], [-0.5, 0.56, -0.36], [-0.44, 0.56, -0.2], [-0.02, 0.56, -0.2]];
  return <>
    <OldBoiler p={[0.2, 0, -0.2]} col="#4a3c2c" s={[0.42, 0.68, 0.32]} tt={tt}>
      <Gauge v={v} max={30} tx={DFV()} p={[-0.04, 0.46, 0.012]} r={0.085} look="iron" needle="#1d1d1d" />
    </OldBoiler>
    <CShadow p={[0.2, 0, -0.2]} s={[0.6, 0.5]} o={0.7} />
    <Pipe a={PTS[0]} b={PTS[1]} r={0.014} col="#b87333" />
    <Pipe a={PTS[1]} b={PTS[2]} r={0.014} col="#b87333" />
    <Pipe a={PTS[2]} b={[-0.24, 0.56, -0.2]} r={0.014} col="#b87333" />
    <Pipe a={[-0.16, 0.56, -0.2]} b={PTS[3]} r={0.014} col="#b87333" />
    {/* abrazaderas de la pared */}
    {[0.85, 0.7].map((y, i) => <RBox key={i} s={[0.04, 0.012, 0.03]} p={[-0.5, y, -0.385]} r={0.003}>{M.steel({ col: "#8c9096" })}</RBox>)}
    {/* la válvula de llenado de bronce: cuerpo, bonete, palanca roja que gira */}
    <group position={[-0.2, 0.56, -0.2]} scale={1.25}>
      <mesh castShadow><sphereGeometry args={[0.04, 24, 18]} />{M.brass()}</mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.045, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.02, 6]} />{M.brass({ col: "#b8892e" })}</mesh>)}
      <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.024, 0.03, 0.06, 18]} />{M.brass({ col: "#c9973f" })}</mesh>
      <group position={[0, 0.09, 0]} rotation={[0, -1.3 * flow, 0]}><RBox s={[0.1, 0.012, 0.018]} p={[0.045, 0, 0]} r={0.005}>{M.rubber({ col: "#c2302a" })}</RBox></group>
    </group>
    <FlowPath tt={tt} pts={PTS} n={16} k={flow} col="#7cc8ff" r={0.0095} v={0.35} />
    <Tape txt="AIR OUT = WATER IN" p={[-0.2, 0.4, -0.395]} rot={[0, 0, 0.02]} w={0.34} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 8:55 · 30 PSI: en el frente de la caldera, el reloj negro trepa hasta la franja roja y tiembla; la válvula de alivio queda
// detrás de su jaula; la luz roja late (≤1 Hz) ----
const DRED = () => dialTex("hw30r", 30, 12, 15, "PSI", 27, "black");
export const HThirty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="plaster" wallZ={-0.46} bg="#17140f" key1={[-0.8, 1.4, 1.4]} warm={0.85}
  cam={{ at: [-0.14, 0.6, -0.04], at1: [0.04, 0.58, -0.04], az: [0.25, -0.18], el: [0.06, 0.1], r: [0.62, 1.12], fov: 32 }}>{(tt) => {
  const v = lerp(14, 29.5, eio(tt, 0.4, 2.6)) + 0.3 * Math.sin(tt * 9) * cl(tt - 2.6), alarm = cl(tt - 2.6) * (0.5 + 0.5 * Math.sin(tt * 5));
  return <>
    <OldBoiler p={[0.04, 0, -0.24]} col="#2f4a5c" s={[0.8, 0.9, 0.36]} tt={tt}>
      <Gauge v={v} max={30} tx={DRED()} p={[-0.18, 0.62, 0.012]} r={0.12} look="black" needle="#ff3a1a" />
      {/* válvula de alivio con su palanca y el caño de descarga */}
      <group position={[0.2, 0.62, 0.05]}>
        <mesh><cylinderGeometry args={[0.035, 0.04, 0.13, 22]} />{M.brass()}</mesh>
        <RBox s={[0.012, 0.09, 0.012]} p={[0.04, 0.07, 0]} rot={[0, 0, -0.5]} r={0.003}>{M.brass({ col: "#c9973f" })}</RBox>
        <Pipe a={[0, -0.065, 0]} b={[0, -0.2, 0]} r={0.016} col="#b87333" />
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.09 + i * 0.03, 0.0, 0.07]} scale={Math.max(0.001, phys(tt, 1.0 + i * 0.05, 9, 0.5))}><cylinderGeometry args={[0.003, 0.003, 0.24, 6]} />{M.steel()}</mesh>)}
        {[-0.12, 0.12].map((y, i) => <RBox key={i} s={[0.2, 0.008, 0.08]} p={[0, y, 0.035]} r={0.003}>{M.steel()}</RBox>)}
      </group>
      <Tape txt="NEVER TOUCH" col="#b3261e" p={[0.2, 0.81, 0.008]} rot={[0, 0, -0.02]} w={0.2} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) / 0.6)} />
      <Tape txt="NEAR 30 = CALL TODAY" p={[-0.12, 0.43, 0.006]} rot={[0, 0, 0.015]} w={0.36} k={phys(tt, 2.9, 8, 0.45)} rev={cl((tt - 2.9) / 1.0)} />
    </OldBoiler>
    <pointLight position={[-0.14, 0.62, 0.2]} color="#ff3a1a" intensity={0.35 * alarm} distance={1.2} decay={2} />
    <CShadow p={[0.04, 0, -0.24]} s={[1.0, 0.55]} o={0.7} />
  </>;
}}</Scene3D>;

// ---- 9:15 · UNA HORA: el reloj de arena corre y el radiador se calienta de abajo hacia arriba, columna por columna ----
export const HHourWarm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1.2, 1.8, 1.5]}
  cam={{ at: [0.05, 0.32, 0], az: [-0.4, 0.15], el: [0.18, 0.12], r: [1.45, 1.25], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.6, 5.2), flip = phys(tt, 0.05, 5, 0.6);
  return <>
    <RadH n={10} p={[-0.12, 0, 0]} heat={(i, y) => cl((k * 1.4 - y) * 3) * 0.95 + 0.1} />
    {/* reloj de arena con marco de madera */}
    <group position={[0.42, 0.0, 0.12]} rotation={[0, 0, (1 - cl(flip)) * PI]}>
      {[0.005, 0.255].map((y, i) => <RBox key={i} s={[0.13, 0.014, 0.13]} p={[0, y, 0]} r={0.004}>{M.wood({ base: [110, 66, 34] })}</RBox>)}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.05, 0.13, z * 0.05]}><cylinderGeometry args={[0.005, 0.005, 0.25, 8]} />{M.wood({ base: [110, 66, 34] })}</mesh>)}
      <mesh position={[0, 0.19, 0]}><coneGeometry args={[0.045, 0.11, 24, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.07, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.045, 0.11, 24, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.16 + 0.03 * (1 - k), 0]} rotation={[PI, 0, 0]} scale={Math.max(0.01, 1 - k * 0.9)}><coneGeometry args={[0.036, 0.07, 20]} /><meshStandardMaterial color="#d8b77a" roughness={0.9} /></mesh>
      <mesh position={[0, 0.02 + 0.025 * k, 0]} scale={Math.max(0.01, 0.15 + k * 0.85)}><coneGeometry args={[0.04, 0.06, 20]} /><meshStandardMaterial color="#d8b77a" roughness={0.9} /></mesh>
      {k > 0.02 && k < 0.98 && <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.08, 6]} /><meshStandardMaterial color="#d8b77a" /></mesh>}
    </group>
    <Tape txt="WAIT AN HOUR" p={[0.42, 0.4, 0.12]} w={0.24} k={phys(tt, 1.6, 8, 0.45)} rev={cl((tt - 1.6) / 0.7)} />
    <Tape txt="FEEL IT BOTTOM TO TOP" p={[-0.12, 0.7, 0.05]} w={0.38} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 1.0)} />
  </>;
}}</Scene3D>;
