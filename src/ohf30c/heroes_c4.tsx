// ohf30c · componentes únicos 26-34 (el travesaño de encuentro, abajo y arriba): la rendija en corte con su testa entre tarjeta
// y lápiz, la mano que gira el cierre (una prensa), la V de bronce del travesaño vista desde el cuarto, la rendija en cuña al nivel
// del sillón, el grosor justo (un burlete por vez bajo la misma hoja), el antepecho podrido, el pulgar que mete la masilla (en corte),
// el frío que sale por las roldanas y el cordón que se deshilacha y corta.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Puffs, Shock, Tape } from "./okit";
import { Bulb, FR, GAPC, OH, OW, OldWin, RopeCaulk , RoomBack } from "./winkit";
import { Bokeh, Hand, MR_H, MeetRails, Prof, Say, Snow, Stream, wpMat } from "./rkit";

const PI = Math.PI;
type V3 = [number, number, number];
const paint = (c = "#e8e0cf") => <meshStandardMaterial color={c} roughness={0.5} />;
// pared alrededor del vano de la ventana (deja ver el cielo)
const WallAround: React.FC<{ mat: React.ReactNode; z?: number }> = ({ mat, z = 0.075 }) => <group>
  <RBox s={[1.6, 2.2, 0.02]} p={[-1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[1.6, 2.2, 0.02]} p={[1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.7, 0.02]} p={[0, 1.25, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.8, 0.02]} p={[0, -0.43, z]} r={0.002} shadow={false}>{mat}</RBox>
</group>;

// ---- 14:13 · LA RENDIJA DEL MEDIO: los dos travesaños cortados en el banco, con su testa; la tarjeta entra justa en la rendija
//      inclinada, sale, la rendija se abre y cae un lápiz adentro ----
export const HRailGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[1.4, 1.6, 0.8]} bg="#1a130d" warm={1.05} lamp={[0.6, 0.4, 0.5]}
  cam={{ at: [0.4, 0.04, 0.0], at1: [0.38, 0.05, 0.0], az: [1.15, 0.9], el: [0.42, 0.3], r: [0.42, 0.34], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.6} b={2.95} txt="THIN AS A CREDIT CARD" col="#1f4f8a" /><Say tt={tt} a={3.1} txt="THICK AS A PENCIL" col="#b3261e" size={100} /></>}>{(tt) => {
  const g = lerp(0.003, 0.02, eio(tt, 3.1, 4.1)), card = phys(tt, 0.6, 6, 0.4) * (1 - eio(tt, 2.8, 3.1)), pen = phys(tt, 4.1, 6.5, 0.35);
  const X = 0.38;
  return <>
    <Bokeh tt={tt} z={-1.8} y={0.3} />
    {/* banco de trabajo */}
    <RBox s={[1.6, 0.04, 1.0]} p={[0.2, -0.04, 0]} r={0.004}>{M.wood({ base: [128, 86, 50] })}</RBox>
    <group position={[0, 0, 0]}>
      <MeetRails gap={g} lift={-0.01} L={0.9} glass={0.07}>
        {/* la tarjeta (azul, con su borde) entrando de canto en la rendija */}
        <group position={[X, MR_H + 0.09 - 0.11 * card, 0]} rotation={[0, 0, 0]} visible={card > 0.01}>
          <RBox s={[0.12, 0.075, 0.0018]} r={0.0008}><meshPhysicalMaterial color="#2a5fb0" roughness={0.25} clearcoat={1} /></RBox>
          <RBox s={[0.02, 0.016, 0.0022]} p={[-0.03, 0.01, 0]} r={0.002}>{M.brass({ col: "#d8b45a" })}</RBox>
        </group>
        {/* el lápiz cae acostado en la rendija abierta */}
        <group position={[X, MR_H + 0.12 - 0.12 * pen, 0]} rotation={[0, 0, PI / 2]} visible={pen > 0.01}>
          <mesh castShadow><cylinderGeometry args={[0.0085, 0.0085, 0.16, 6]} />{M.plastic({ col: "#f2c21a" })}</mesh>
          <mesh position={[0, -0.09, 0]}><coneGeometry args={[0.0085, 0.022, 6]} /><meshStandardMaterial color="#e3c69a" /></mesh>
          <mesh position={[0, 0.085, 0]}><cylinderGeometry args={[0.009, 0.009, 0.012, 12]} />{M.brass({ col: "#c9a24a" })}</mesh>
        </group>
        {pen > 0.95 && <Shock tt={tt} a={3.5} p={[X, MR_H, 0]} r={0.05} col="#ff8a5a" />}
        {/* el frío cruza por la rendija */}
        <Stream id="rg" tt={tt} pts={[[X + 0.04, MR_H * 0.5, -0.18], [X + 0.06, MR_H * 0.55, 0], [X + 0.08, MR_H * 0.8, 0.2]]} n={12} k={0.5 + 0.5 * eio(tt, 2.5, 3.1)} w={0.003} len={0.045} spread={0.02 + g} />
      </MeetRails>
    </group>
  </>;
}}</Scene3D>;

// ---- 14:29 · EL CIERRE ES UNA PRENSA: macro de la leva de bronce sobre un friso mostaza; la mano la gira, las hojas se juntan y el frío se corta ----
export const HSashLock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.7, 1.6, 1.2]} bg="#120d08" warm={1.0} lamp={[0.35, OH / 2 + 0.3, 0.45]}
  cam={{ at: [0.0, OH / 2 + 0.0, 0.05], at1: [0.02, OH / 2 + 0.03, 0.05], az: [-0.55, -0.15], el: [0.3, 0.55], r: [0.62, 0.3], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={3.0} txt="NOT JUST A LOCK" /><Say tt={tt} a={3.2} txt="IT'S A CLAMP" col="#1f6a3a" size={110} /></>}>{(tt) => {
  const lk = eio(tt, 3.0, 4.0), cold = 1 - lk;
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#9a7a2e", "#8f7029", "#efd9a0", 6, 6)} roughness={0.85} />} />
    <OldWin p={[0, 0, 0]} lock={lk} gap={{ rail: 1 - lk }} sky="#d89a5a" />
    <Stream id="sl" tt={tt} pts={[[-0.12, OH / 2 + 0.01, -0.05], [-0.08, OH / 2 + 0.02, 0.08], [-0.02, OH / 2 - 0.04, 0.3]]} n={10} k={cold} w={0.003} len={0.045} spread={0.06} />
    <Stream id="sl2" tt={tt + 1} pts={[[0.14, OH / 2 + 0.01, -0.05], [0.12, OH / 2 + 0.02, 0.08], [0.16, OH / 2 - 0.04, 0.3]]} n={10} k={cold} w={0.003} len={0.045} spread={0.06} />
    {/* flechas: las hojas se aprietan una contra otra mientras gira */}
    {[-1, 1].map((k) => <group key={k} position={[0.13 * k, OH / 2 + 0.07, 0.06]} rotation={[0, 0, k > 0 ? PI / 2 : -PI / 2]} scale={Math.max(0.001, Math.sin(PI * lk))} visible={lk > 0.03 && lk < 0.97}>
      <mesh position={[0, 0.02, 0]}><coneGeometry args={[0.012, 0.03, 12]} />{M.glow({ col: "#ffd27a" })}</mesh></group>)}
    <Hand p={[0.035 + 0.04 * Math.cos(lk * PI * 0.6) + 0.12 * eio(tt, 4.1, 4.8), OH / 2 + 0.06 + 0.06 * eio(tt, 4.1, 4.8), 0.07 + 0.03 * Math.sin(lk * PI * 0.6) + 0.12 * eio(tt, 4.1, 4.8)]} rot={[0, -0.6 - lk * 1.2, -0.25]} s={0.85} curl={0.55} thumb={0.8} />
    {lk > 0.98 && <Shock tt={tt} a={4.0} p={[0, OH / 2 + 0.03, 0.05]} r={0.06} col="#7cd38a" />}
  </>;
}}</Scene3D>;

// ---- 15:40 · LA V DEL TRAVESAÑO, EN CORTE Y EN LA PARED: los dos travesaños de encuentro cortados donde están (afuera nieva, adentro
//      el cuarto tibio); la V de bronce clavada al de arriba queda abierta pero no llega: el frío pasa. La mano gira la traba, el de abajo
//      se aprieta contra el de arriba, la V se comprime brillando y la corriente se corta ----
export const HRailVStrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[1.0, 1.4, 1.2]} bg="#0d1420" warm={1.0} lamp={[0.45, 0.25, 0.5]}
  cam={{ at: [0.45, 0.045, 0.0], at1: [0.45, 0.04, 0.0], az: [1.05, 1.32], el: [0.3, 0.2], r: [0.34, 0.27], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={2.95} txt="V OPEN, BUT IT DOESN'T REACH" col="#b3261e" size={92} /><Say tt={tt} a={3.05} txt="LOCK IT: RAIL PRESSES IN = SEALED" col="#1f6a3a" size={92} /></>}>{(tt) => {
  const close = eio(tt, 3.0, 4.6), g = lerp(0.034, 0.011, close), W = 0.05, X = 0.45, L = 0.9;
  const reach = Math.atan2(g, W), ang = Math.min(0.62, reach), touch = reach < 0.62, leak = 1 - cl((0.62 - reach) / 0.25) * (touch ? 1 : 0);
  const glint = Math.exp(-((tt - 4.7) ** 2) * 3), br = <meshStandardMaterial color="#d8a057" metalness={1} roughness={0.22} emissive="#ffb36a" emissiveIntensity={0.08 + 0.5 * close + 0.6 * glint} />;
  return <>
    {/* afuera: la noche azul con nieve; adentro: el cuarto tibio con el empapelado */}
    <mesh position={[0, 0.3, -1.4]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color="#14223a" toneMapped={false} /></mesh>
    <Snow tt={tt} n={70} box={[-0.6, 1.2, -0.3, 0.9, -1.2, -0.25]} r={0.005} />
    <mesh position={[-1.2, 0.3, 0.6]} rotation={[0, PI / 2, 0]}><planeGeometry args={[3, 3]} /><meshStandardMaterial map={wpMat("#6b3a34", "#76423b", "#e6c79a", 6, 6)} roughness={0.9} /></mesh>
    <MeetRails gap={g} L={L} glass={0.24}>
      {/* la V: ala clavada en la cara del de arriba y ala que se abre hacia el de abajo */}
      <group position={[0, 0.008, -g / 2 - 0.0004]}>
        <RBox s={[L - 0.02, W, 0.0016]} p={[0, W / 2, 0]} r={0.0006}>{br}</RBox>
        <group rotation={[-ang, 0, 0]}><RBox s={[L - 0.02, W, 0.0016]} p={[0, W / 2, 0.0008]} r={0.0006}>{br}</RBox></group>
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <mesh key={i} position={[x, W * 0.7, -0.0012]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0028, 0.0028, 0.002, 12]} />{M.steel({ col: "#7a6a52" })}</mesh>)}
      </group>
      {/* la traba de bronce arriba, junto al corte; la mano la gira */}
      <group position={[X - 0.08, MR_H + 0.004, 0.0]}>
        <RBox s={[0.06, 0.008, 0.028]} p={[0, 0, 0.03 + g / 2]} r={0.003}>{M.brass()}</RBox>
        <group position={[0.014, 0.008, 0.03 + g / 2]} rotation={[0, -close * PI * 0.85, 0]}><RBox s={[0.06, 0.007, 0.014]} p={[-0.024, 0, 0]} r={0.003}>{M.brass()}</RBox>
          <mesh position={[-0.055, 0.007, 0]}><sphereGeometry args={[0.008, 14, 10]} />{M.brass()}</mesh></group>
        <RBox s={[0.05, 0.01, 0.022]} p={[0, 0, -0.03]} r={0.003}>{M.brass()}</RBox>
      </group>
      <group visible={tt > 2.4 && tt < 5.3}><Hand p={[X - 0.11, MR_H + 0.06, 0.1 + g / 2]} rot={[0, PI / 2 + 0.4 - 1.2 * close, 0]} s={0.85} curl={0.55} thumb={0.7} /></group>
      {/* el frío entra por la rendija mientras la V no llega */}
      {[0.12, 0.3].map((x, i) => <Stream key={i} id={"rvs" + i} tt={tt + i * 0.6} pts={[[x, MR_H * 0.3, -0.25], [x + 0.01, MR_H * 0.45, 0], [x + 0.04, MR_H * 0.75, 0.25]]} n={11} k={leak * (1 - close)} w={0.0035} len={0.045} spread={0.01 + g * 0.5} />)}
      {close > 0.98 && <Shock tt={tt} a={4.6} p={[X - 0.02, MR_H * 0.5, 0]} r={0.05} col="#7cd38a" />}
    </MeetRails>
  </>;
}}</Scene3D>;

// ---- 16:44 · LA CUÑA: la hoja de abajo ya no apoya derecha; la rendija es más ancha de un lado y el frío sale a la altura del sillón ----
export const HWedgeGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.6, 1.8, 1.4]} warm={0.7} lamp={[0.9, 0.9, 0.9]}
  cam={{ at: [-0.1, 0.52, 0.05], at1: [0.3, 0.45, 0.3], az: [-0.2, -0.45], el: [0.18, 0.12], r: [0.42, 2.0], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={1.0} b={2.7} txt="BIGGER ON ONE SIDE" col="#b3261e" /><Say tt={tt} a={2.9} txt="RIGHT AT CHAIR LEVEL" /></>}>{(tt) => {
  const tl = eio(tt, 0.3, 1.0), reach = eio(tt, 2.4, 4.4), shp = new THREE.Shape([new THREE.Vector2(-OW / 2 + 0.02, 0), new THREE.Vector2(OW / 2 - 0.02, 0), new THREE.Vector2(OW / 2 - 0.02, 0.004), new THREE.Vector2(-OW / 2 + 0.02, 0.03 * tl + 0.004)]);
  return <>
    <group position={[0, 0.5, 0]}>
      <WallAround mat={<meshStandardMaterial map={wpMat("#5d6b4a", "#667453", "#e4d6a8", 8, 8)} roughness={0.9} />} />
      <OldWin p={[0, 0, 0]} tilt={0.06 * tl} lo={0.02} sky="#3d5a80" />
      <mesh position={[0, 0, 0.046]}><shapeGeometry args={[shp]} />{M.glow({ col: GAPC, op: tl })}</mesh>
      <Puffs tt={tt} n={14} a={[-0.12, 0.012, 0.05]} b={[0.25, -0.15, 0.7]} r={0.016} col="#8fd6ff" op={0.5 * tl} v={0.55} wob={0.04} />
    </group>
    <Stream id="wg" tt={tt} pts={[[-0.15, 0.51, 0.06], [0.2, 0.46, 0.3], [0.6, 0.4, 0.45]]} n={14} k={reach} w={0.005} len={0.08} spread={0.06} />
    {/* el sillón: asiento y respaldo a la altura del antepecho */}
    <group position={[0.7, 0, 0.4]} rotation={[0, -0.6, 0]}>
      <RBox s={[0.42, 0.14, 0.4]} p={[0, 0.25, 0]} r={0.05}><meshStandardMaterial color="#6e2f2a" roughness={0.85} /></RBox>
      <RBox s={[0.42, 0.42, 0.1]} p={[0, 0.48, 0.17]} r={0.05}><meshStandardMaterial color="#6e2f2a" roughness={0.85} /></RBox>
      {[-1, 1].map((k) => <RBox key={k} s={[0.07, 0.22, 0.4]} p={[k * 0.22, 0.35, 0]} r={0.03}><meshStandardMaterial color="#5f2622" roughness={0.85} /></RBox>)}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <mesh key={i} position={[a * 0.17, 0.09, b * 0.15]}><cylinderGeometry args={[0.015, 0.012, 0.18, 10]} />{M.wood({ base: [70, 44, 24] })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 17:18 · EL GROSOR, EN LA RENDIJA DE VERDAD: la hoja de abajo queda a dos centímetros del antepecho y por ahí se cuela el frío;
//      la mano prueba tres muestras: la fina entra floja y el frío sigue, la gruesa choca y se dobla, la justa entra apretada y lo corta ----
export const HThickness: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.7, 1.4, 1.3]} bg="#1a1510" warm={0.72} lamp={[0.45, 0.3, 0.6]}
  cam={{ at: [-0.02, 0.04, 0.06], at1: [0.02, 0.035, 0.05], az: [-0.55, -0.38], el: [0.48, 0.38], r: [0.52, 0.45], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={1.35} txt="TOO THIN: AIR STILL GETS BY" col="#b3261e" size={96} /><Say tt={tt} a={1.7} b={3.65} txt="TOO THICK: IT WON'T GO IN" col="#b3261e" size={96} /><Say tt={tt} a={3.95} txt="MATCH THE GAP = SEALED" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const S = 1.6, lo = 0.035, G = lo * (OH / 2 - 0.03) * S, ph = tt < 2.2 ? 0 : tt < 3.8 ? 1 : 2, a = [0.4, 2.3, 3.9][ph];
  const inn = eio(tt, a + 0.1, a + 0.8), out = ph < 2 ? eio(tt, a + 1.15, a + 1.45) : 0, bend = ph === 1 ? eio(tt, a + 0.7, a + 1.0) : 0;
  const hS = [0.008, 0.04, 0.027][ph], zStop = ph === 1 ? 0.082 : 0.036, z = lerp(0.3, zStop, inn) + 0.3 * out;
  const seal = ph === 2 ? eio(tt, a + 0.65, a + 0.85) : 0, hh = ph === 2 ? lerp(hS, G, seal) : hS, leak = 1 - seal;
  const col = ["#a8a090", "#2a2a2c", "#5b5f66"][ph], wall = <meshStandardMaterial map={wpMat("#dfd6c2", "#d4cab3", "#3c4a6b", 4, 3)} roughness={0.9} />;
  return <>
    <OldWin s={S} lo={lo} sky="#2a3b55" gap={{ bot: 0 }} />
    <RBox s={[1.3, 2.4, 0.02]} p={[-1.12, 0.6, 0.13]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.3, 2.4, 0.02]} p={[1.12, 0.6, 0.13]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.0, 0.6, 0.02]} p={[0, -0.33, 0.13]} r={0.002} shadow={false}>{wall}</RBox>
    {/* la luz fría que entra por la rendija bajo la hoja (siempre montada; se apaga con la muestra justa) */}
    <mesh position={[0, G / 2, 0.035]}><boxGeometry args={[(OW - 0.04) * S, Math.max(0.002, (G - (ph === 0 ? hS : 0)) * 0.7), 0.05]} />{M.glow({ col: "#8fd6ff", op: 0.75 * leak })}</mesh>
    {[-0.14, 0.05, 0.2].map((x, i) => <Stream key={i} id={"th" + i} tt={tt + i * 0.5} pts={[[x, (ph === 0 ? hS + 0.006 : G * 0.5), -0.2], [x, G * 0.6, 0.04], [x + 0.03, 0.03, 0.3]]} n={9} k={leak * (ph === 1 && bend > 0.5 ? 1 : 1)} w={0.003} len={0.04} spread={0.008} />)}
    {/* la muestra de burlete, empujada por la mano desde el cuarto */}
    <group position={[0.02, 0, z]} visible={out < 0.98}>
      <group position={[0, 0, -0.015]} rotation={[bend * 0.55, 0, 0]}>
        <RBox s={[0.22, hh, 0.03]} p={[0, hh / 2, 0.015]} r={Math.min(0.004, hh / 2.2)}><meshStandardMaterial color={col} roughness={0.92} /></RBox>
      </group>
      <Hand p={[0.1, 0.035, 0.1]} rot={[0, 2.2, -0.12]} s={0.85} curl={0.45} thumb={0.5} />
    </group>
    {ph === 1 && bend > 0.9 && <Shock tt={tt} a={a + 1.0} p={[0.02, 0.03, 0.07]} r={0.05} col="#ff5a4a" />}
    {seal > 0.95 && <Shock tt={tt} a={a + 0.85} p={[0.02, 0.015, 0.06]} r={0.08} col="#7cd38a" />}
  </>;
}}</Scene3D>;

// ---- 17:34 · EL ANTEPECHO PODRIDO: madera gris y rajada; el destornillador se hunde sin esfuerzo y saltan migas ----
export const HRotSill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.6, 1.8, 1.2]}
  cam={{ at: [0, 0.06, 0.02], az: [-0.5, -0.32], el: [0.4, 0.32], r: [0.85, 0.76], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={1.7} b={3.4} txt="SOFT, GRAY, CRACKED = ROT" col="#b3261e" /><Say tt={tt} a={3.6} txt="REPAIR IT IN SPRING" /></>}>{(tt) => {
  const push = eio(tt, 1.0, 1.6) * (1 - eio(tt, 2.6, 3.0)) + eio(tt, 3.4, 4.0) * 1.15, cr = eio(tt, 1.4, 2.0), cr2 = eio(tt, 3.8, 4.5);
  return <>
    <RoomBack p={[0, 0.1, -0.38]} wx={0.45} mat={<meshStandardMaterial map={wpMat("#3f5a4a", "#466352", "#e2d3a0", 6, 5)} roughness={0.9} />} />
    <RBox s={[0.6, 0.06, 0.2]} p={[0, 0.03, 0]} r={0.006}>{M.wood({ base: [138, 128, 112] })}</RBox>
    <RBox s={[0.22, 0.004, 0.12]} p={[0.05, 0.061, 0]} r={0.002}><meshStandardMaterial color="#6d6658" roughness={1} /></RBox>
    {Array.from({ length: 7 }, (_, i) => <RBox key={i} s={[0.1 + 0.06 * rn(i, 1), 0.002, 0.002]} p={[0.05 + (rn(i, 2) - 0.5) * 0.18, 0.064, (rn(i, 3) - 0.5) * 0.1]} rot={[0, rn(i, 4) * 0.6 - 0.3, 0]} r={0.0005}><meshStandardMaterial color="#2d2a24" /></RBox>)}
    <group position={[0.05 + 0.04 * eio(tt, 2.6, 3.2), lerp(0.2, 0.08, push), 0.0]} rotation={[0.1, 0, 0.25]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.004, 0.004, 0.1, 10]} />{M.steel()}</mesh>
      <RBox s={[0.012, 0.012, 0.002]} p={[0, -0.002, 0]} r={0.0005}>{M.steel()}</RBox>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.016, 0.014, 0.09, 16]} />{M.plastic({ col: "#e0a020" })}</mesh>
    </group>
    {[cr, cr2].map((c, j) => Array.from({ length: 10 }, (_, i) => { const u = cl(c * 1.2 - rn(i + j * 10, 5) * 0.2); return u > 0.01 ? <RBox key={"c" + j + i} s={[0.008, 0.005, 0.008]} p={[0.05 + 0.04 * j + (rn(i + j * 10, 6) - 0.5) * 0.12 * u, 0.064 + 0.05 * Math.sin(u * PI), 0.03 + (rn(i + j * 10, 7) - 0.3) * 0.1 * u]} rot={[rn(i, 8) * 3, rn(i, 9) * 3, 0]} r={0.001}><meshStandardMaterial color="#5e584c" /></RBox> : null; }))}
  </>;
}}</Scene3D>;

// ---- 18:29 · EL PULGAR, EN CORTE Y EN LA PARED: el cabezal y el travesaño de arriba cortados dentro de la pared empapelada, con la
//      noche detrás del vidrio; la masilla gris en cordón redondo; el pulgar avanza apretando a golpes y atrás suyo la masilla queda
//      aplastada DENTRO de la rendija, con la marca de cada apretón; adelante sigue redonda y el aire pasa ----
const HEADP = [[-0.09, 0.006], [0.06, 0.006], [0.06, 0.1], [-0.09, 0.1]];
const RAILP = [[-0.07, -0.006], [0.034, -0.006], [0.034, -0.1], [-0.07, -0.1]];
export const HRopePress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[1.0, 1.3, 1.2]} bg="#0f1520" warm={0.95} lamp={[0.35, 0.15, 0.45]}
  cam={{ at: [0.12, 0.0, 0.04], at1: [-0.08, 0.0, 0.04], az: [1.0, 0.8], el: [0.26, 0.18], r: [0.55, 0.46], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.6} txt="PRESS IT IN, FIRMLY" size={100} /><Say tt={tt} a={2.8} txt="SQUASHED INTO THE GAP = NO DRAFT" col="#1f6a3a" size={92} /></>}>{(tt) => {
  const L = 0.7, x1 = L / 2 - 0.02, x0 = -L / 2 + 0.02, run = eio(tt, 0.5, 5.0), xt = lerp(x1, x0 + 0.06, run), push = 0.5 + 0.5 * Math.sin(tt * 9);
  const wall = <meshStandardMaterial map={wpMat("#4d5b3f", "#566548", "#d8c89a", 3, 2)} roughness={0.9} />;
  return <>
    {/* la noche detrás del vidrio y el empapelado arriba del cabezal */}
    <mesh position={[0, -0.1, -0.5]}><planeGeometry args={[3, 2]} /><meshBasicMaterial color="#17253d" toneMapped={false} /></mesh>
    <Snow tt={tt} n={40} box={[-0.5, 0.5, -0.4, 0.2, -0.45, -0.2]} r={0.003} />
    <RBox s={[L, 0.3, 0.02]} p={[0, 0.25, 0.07]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[L, 0.03, 0.03]} p={[0, 0.1, 0.075]} r={0.004}>{paint("#efe8da")}</RBox>
    <Prof id="rpHead" pts={HEADP} L={L} />
    <Prof id="rpRail" pts={RAILP} L={L} />
    <mesh position={[0, -0.25, -0.03]}><boxGeometry args={[L, 0.3, 0.004]} />{M.glass({ op: 0.14 })}</mesh>
    {/* la masilla: redonda adelante; detrás del pulgar, aplastada y metida en la rendija, con la marca de cada apretón */}
    {x1 - xt > 0.02 && <group position={[0, 0, 0.046]} scale={[1, 0.55, 1.45]}><RopeCaulk id={"rpA" + Math.round(xt * 200)} pts={Array.from({ length: 24 }, (_, i) => [lerp(xt, x1, i / 23), 0, 0])} r={0.013} col="#5d5953" /></group>}
    {xt - x0 > 0.02 && <RopeCaulk id={"rpB" + Math.round(xt * 200)} pts={Array.from({ length: 24 }, (_, i) => [lerp(x0, xt, i / 23), -0.002 * Math.sin(i * 0.9), 0.074])} r={0.013} col="#6a655e" />}
    {Array.from({ length: 14 }, (_, i) => { const x = x1 - 0.02 - i * 0.045; return x > xt + 0.02 ? <mesh key={i} position={[x, 0.0, 0.065]} scale={[1.4, 0.45, 0.35]}><sphereGeometry args={[0.009, 12, 8]} /><meshStandardMaterial color="#45423d" roughness={0.6} /></mesh> : null; })}
    {/* el frío entra por donde la masilla todavía no está metida */}
    <Stream id="rp" tt={tt} pts={[[x0 + 0.1, 0, -0.15], [x0 + 0.12, 0, 0.0], [x0 + 0.16, -0.05, 0.2]]} n={10} k={1 - eio(tt, 4.4, 5.0)} w={0.003} len={0.045} spread={0.03} />
    {/* la mano: el pulgar empuja hacia adentro de la rendija, a golpes */}
    <Hand p={[xt + 0.06, -0.035 + 0.006 * push, 0.13 - 0.012 * push]} rot={[0.2, PI * 0.62, 0.1]} s={0.85} curl={0.7} thumb={0.9} />
  </>;
}}</Scene3D>;

// ---- 19:18 · LAS ROLDANAS: primer plano de la roldana arriba de la jamba, en un cuarto de empapelado malva; el frío sale a chorros
//      por el agujero; la mano calza encima la tapita blanca y el chorro se corta ----
export const HPulleyDraft: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.8, 1.9, 1.3]} bg="#160f12" warm={0.6} lamp={[0.0, 0.95, 0.5]}
  cam={{ at: [0.3, 0.98, 0.0], at1: [0.31, 0.99, 0.0], az: [-1.25, -1.0], el: [0.1, 0.04], r: [0.42, 0.34], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={3.85} txt="COLD AIR OUT OF THE PULLEY" col="#1f4f8a" size={100} /><Say tt={tt} a={4.0} txt="A LITTLE COVER FIXES IT" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const S = 1.4, cov = eio(tt, 2.9, 4.5), seat = eio(tt, 4.1, 4.5), flow = 1 - seat, P: V3 = [(OW / 2 + 0.001) * S, (OH - 0.07) * S, -0.022 * S];
  const cp: V3 = [lerp(0.12, P[0] - 0.02, cov), lerp(0.82, P[1], cov), lerp(0.2, P[2], cov)], ox = (OW / 2 + FR + 0.07) * S;
  const wall = <meshStandardMaterial map={wpMat("#6e4656", "#784e5f", "#e3c8a0", 4, 3)} roughness={0.9} />;
  return <>
    <OldWin s={S} hi={0.6} sky="#3a5476" />
    <RBox s={[1.4, 3, 0.02]} p={[-ox - 0.7, 0.6, 0.08 * S]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[1.4, 3, 0.02]} p={[ox + 0.7, 0.6, 0.08 * S]} r={0.002} shadow={false}>{wall}</RBox>
    <RBox s={[2 * ox, 0.8, 0.02]} p={[0, (OH + FR) * S + 0.48, 0.08 * S]} r={0.002} shadow={false}>{wall}</RBox>
    {/* el frío sale del agujero de la roldana */}
    {[0, 1, 2].map((i) => <Stream key={i} id={"pd" + i} tt={tt + i * 0.45} pts={[[P[0] - 0.01, P[1] + 0.02 - i * 0.02, P[2]], [P[0] - 0.08, P[1] - 0.02 - i * 0.02, P[2] + 0.06], [P[0] - 0.25, P[1] - 0.18 - i * 0.03, P[2] + 0.35]]} n={12} k={flow} w={0.006} len={0.07} spread={0.02} />)}
    {/* la tapita blanca de plástico, de canto hacia la roldana, y la mano que la calza */}
    <group position={cp} rotation={[0, 0, 0]}>
      <RBox s={[0.008, 0.14, 0.07]} r={0.006}>{M.brass()}</RBox>
      <group visible={tt < 4.95}><Hand p={[-0.035, -0.02, 0.0]} rot={[0, 0, PI / 2]} s={0.85} curl={0.25} thumb={0.4} /></group>
    </group>
    {seat > 0.98 && <Shock tt={tt} a={4.5} p={[P[0] - 0.01, P[1], P[2]]} r={0.06} col="#7cd38a" />}
  </>;
}}</Scene3D>;

// ---- 19:53 · EL CORDÓN CORTADO: macro en la roldana; el cordón viejo se deshilacha fibra por fibra y se corta; la cámara baja
//      con la punta que cae hasta la hoja, que queda torcida con su rendija en cuña ----
export const HBrokenCord: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-0.6, 1.8, 1.4]} bg="#120c0a" warm={0.95} lamp={[-0.1, 0.8, 0.5]}
  cam={{ at: [-OW / 2 + 0.03, OH - 0.16, 0.06], at1: [-0.02, 0.36, 0.05], az: [-0.35, -0.12], el: [0.05, 0.04], r: [0.3, 1.25], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={2.0} b={3.9} txt="ONE CORD SNAPS" col="#b3261e" size={100} /><Say tt={tt} a={4.2} txt="SASH SITS CROOKED = GAP" /></>}>{(tt) => {
  const fray = eio(tt, 0.4, 2.2), snap = eio(tt, 2.25, 2.4), fall = eio(tt, 2.3, 3.0), tl = eio(tt, 2.6, 3.6), lo = 0.35, yTop = lo * (OH / 2 - 0.03) + OH / 2 + 0.012;
  const cordM = <meshStandardMaterial color="#8a6a3a" roughness={0.95} />;
  const cord = (x0: number, y0: number, x1: number, y1: number, k: string, r = 0.006) => { const L = Math.hypot(x1 - x0, y1 - y0); return <mesh key={k} position={[(x0 + x1) / 2, (y0 + y1) / 2, 0.06]} rotation={[0, 0, Math.atan2(y1 - y0, x1 - x0) - PI / 2]}><cylinderGeometry args={[r, r, Math.max(0.001, L), 8]} />{cordM}</mesh>; };
  const xl = -OW / 2 + 0.025, xr = OW / 2 - 0.025, yl = yTop - 0.09 * tl - 0.02, yr = yTop - 0.02, yb = OH - 0.16;
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#6a2a2a", "#5f2525", "#d8b48a", 6, 6)} roughness={0.85} />} />
    <OldWin p={[0, 0, 0]} lo={lo} tilt={-0.11 * tl} gap={{ side: tl }} sky="#8aa3bf" />
    {cord(xr, OH - 0.07, xr, yr, "r")}
    {snap < 0.5 ? <>{cord(xl, OH - 0.07, xl, yb + 0.012, "la")}{cord(xl, yb - 0.012, xl, yl, "lb")}
      {/* el punto gastado: se adelgaza y le salen fibras */}
      {cord(xl, yb - 0.013, xl, yb + 0.013, "lm", 0.006 * (1 - 0.65 * fray))}
      {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * PI * 2, y = yb + (rn(i, 2) - 0.5) * 0.026, L = (0.02 + 0.045 * rn(i, 3)) * fray;
        return <mesh key={"f" + i} position={[xl + Math.cos(a) * (0.004 + L / 2), y, 0.06 + Math.sin(a) * (0.004 + L / 2)]} rotation={[Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3 + 0.4 * (rn(i, 4) - 0.5)]} visible={fray > 0.05}><cylinderGeometry args={[0.0016, 0.0008, Math.max(0.001, L), 4]} /><meshStandardMaterial color="#d2b483" roughness={1} /></mesh>; })}
    </> : <>{cord(xl, OH - 0.07, xl - 0.006 * tl, yb + 0.006, "lt")}{cord(xl + 0.002, yl + 0.16 * (1 - fall * 0.7) - 0.04 * fall, xl, yl, "lb")}</>}
    {snap > 0.5 && <Shock tt={tt} a={2.35} p={[xl, yb, 0.06]} r={0.05} col="#ff8a5a" />}
    <Stream id="bc" tt={tt} pts={[[-OW / 2 + 0.03, 0.3, -0.04], [-OW / 2 + 0.06, 0.32, 0.1], [-0.05, 0.3, 0.35]]} n={12} k={tl} w={0.004} len={0.06} spread={0.08} />
  </>;
}}</Scene3D>;
