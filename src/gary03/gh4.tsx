// gary03 · componentes únicos 4/4 (min 21-26).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tubeG } from "./h3d";
import { Fridge, Mark, PBox, PI, Plug, Txt3, WattMeter, cl, eio, lerp, phys, pop, roll } from "./gk";
import { Spark } from "./gh1";

type V = [number, number, number];

// 21:36 · EL DETECTOR: la bruma sin olor sale por la puerta del garaje; el detector de CO grande sube las ppm, pasa de verde a rojo y suena
export const HCO: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#262b30"
  cam={{ at: [0.1, 0.44, 0], az: [0.24, -0.06], el: [0.1, 0.06], r: [1.42, 1.26], fov: 30 }} warm={0.9} lamp={[0.2, 0.9, 0.4]}>{(tt) => {
  const adv = eio(tt, 0.3, 3.0), ppm = roll(tt, 1.0, 3.2, 0, 420), alarm = tt > 2.6, blink = alarm && Math.floor(tt * 4) % 2 === 0;
  return <>
    {/* pasillo: pared pintada, zócalo y la puerta del garaje entreabierta */}
    <mesh position={[0, 0.45, -0.12]} receiveShadow><boxGeometry args={[1.9, 0.95, 0.03]} /><meshStandardMaterial color="#6d7a72" roughness={0.9} /></mesh>
    <mesh position={[0, 0.03, -0.1]}><boxGeometry args={[1.9, 0.06, 0.02]} /><meshStandardMaterial color="#e8e2d4" /></mesh>
    <group position={[-0.5, 0, -0.1]}>
      <mesh position={[0, 0.36, 0]}><boxGeometry args={[0.36, 0.72, 0.02]} /><meshStandardMaterial color="#2c2824" /></mesh>
      {/* marco de la puerta */}
      {[-0.19, 0.19].map((x) => <mesh key={x} position={[x, 0.37, 0.012]}><boxGeometry args={[0.025, 0.76, 0.02]} /><meshStandardMaterial color="#e8e2d4" /></mesh>)}
      <mesh position={[0, 0.74, 0.012]}><boxGeometry args={[0.4, 0.025, 0.02]} /><meshStandardMaterial color="#e8e2d4" /></mesh>
      <group position={[-0.17, 0.36, 0.01]} rotation={[0, 0.5, 0]}><RBox s={[0.34, 0.7, 0.025]} p={[0.17, 0, 0]} r={0.004}>{M.matte({ col: "#d9d2c3" })}</RBox>
        <mesh position={[0.3, 0, 0.02]}><sphereGeometry args={[0.012, 12, 10]} />{M.brass()}</mesh></group>
    </group>
    {/* la bruma: bolas grises que salen del garaje y cruzan el pasillo */}
    {Array.from({ length: 140 }, (_, i) => { const d = cl(adv * 1.4 - (i % 7) * 0.07), x = Math.min(0.12, -0.5 + d * (0.35 + (i % 9) * 0.06) + 0.03 * Math.sin(tt * 0.9 + i)); return <mesh key={i} position={[x, 0.05 + (i % 13) * 0.05 + 0.02 * Math.sin(tt * 0.7 + i * 1.3), -0.07 + (i % 3) * 0.015]}>
      <sphereGeometry args={[0.007 + (i % 4) * 0.004, 8, 6]} /><meshBasicMaterial color="#d6dbe0" transparent opacity={0.35 * d} depthWrite={false} /></mesh>; })}
    {/* el detector grande en la pared */}
    <group position={[0.3, 0.48, -0.085]} scale={1.35}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.16, 0.04, 48]} />{M.plastic({ col: "#f3f1ea" })}</mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.09 + i * 0.03, -0.09, 0.021]}><boxGeometry args={[0.008, 0.035, 0.002]} /><meshBasicMaterial color="#9aa0a4" /></mesh>)}
      <RBox s={[0.16, 0.08, 0.006]} p={[0, 0.02, 0.021]} r={0.006}>{M.matte({ col: "#1b1d1f" })}</RBox>
      <Txt3 txt={`${ppm} PPM`} w={0.14} h={0.06} col={alarm ? "#ff4a3a" : "#4dff9a"} bg="#0e1612" font="Courier New" p={[0, 0.02, 0.025]} />
      <mesh position={[0.1, 0.1, 0.021]}><circleGeometry args={[0.014, 16]} />{M.glow({ col: alarm ? (blink ? "#ff2a1a" : "#3a0a08") : "#2bd46a" })}</mesh>
      <pointLight position={[0.1, 0.1, 0.12]} intensity={blink ? 2.2 : 0} distance={0.9} color="#ff3a2a" />
      {[0, 1, 2].map((i) => { const ph = alarm ? ((tt - 2.6) * 1.1 + i / 3) % 1 : 0; return <mesh key={"w" + i} position={[0, 0, 0.03]} scale={[1 + ph * 1.6, 1 + ph * 1.6, 1]}><ringGeometry args={[0.16, 0.168, 48]} />{M.glow({ col: "#ff5a4a", op: alarm ? 0.6 * (1 - ph) : 0 })}</mesh>; })}
    </group>
    <Txt3 txt="NO SMELL" w={0.36} h={0.1} bg="#141516" col="#e9eef4" p={[-0.22, 0.72, 0]} s={pop(tt, 0.9)} />
    {/* «esta noche»: dos pilas AA grandes entran de a una al detector */}
    {[0, 1].map((i) => { const k = cl(phys(tt, 3.5 + i * 0.45, 8, 0.45)); return <group key={"aa" + i} position={[lerp(0.75, 0.24 + i * 0.12, k), lerp(0.2, 0.2, k), 0.12]} rotation={[0, 0, PI / 2]} scale={Math.max(0.001, cl((tt - 3.5 - i * 0.45) * 6)) * 1.3}>
      <mesh><cylinderGeometry args={[0.022, 0.022, 0.09, 24]} />{M.plastic({ col: "#1b1b1b" })}</mesh>
      <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.0222, 0.0222, 0.04, 24]} />{M.plastic({ col: "#c9a227" })}</mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.007, 0.007, 0.01, 12]} />{M.steel()}</mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// 21:58 · LA REGLA DE WALT: la etiqueta grande «2000 W» se despega un poco; al lado, el medidor de aguja frena en 1000
export const HWalt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#120e0b"
  cam={{ at: [-0.15, 0.15, 0.08], az: [-0.22, 0.12], el: [0.26, 0.2], r: [1.5, 1.36], fov: 30 }} lamp={[-0.1, 0.6, 0.3]} warm={1.1}>{(tt) => {
  const peel = 0.3 * eio(tt, 0.4, 1.0) + 0.9 * eio(tt, 3.1, 3.5), drop = eio(tt, 3.3, 3.8), bnc = tt > 3.8 ? 0.03 * Math.abs(Math.sin((tt - 3.8) * 12)) * Math.exp(-(tt - 3.8) * 6) : 0, sw = eio(tt, 2.0, 3.0), ang = lerp(-1.0, 0, sw) + 0.18 * Math.exp(-Math.max(0, tt - 3.0) * 3) * Math.sin(Math.max(0, tt - 3.0) * 14) * (tt > 3 ? 1 : 0);
  return <>
    <PBox p={[-0.2, 0, 0]} r={[0, 0.2, 0]} w={0.4} h={0.26} d={0.22} col="#3b3e42" />
    {/* la etiqueta roja, legible, despegándose desde el borde izquierdo */}
    <group position={[-0.2, 0, 0]} rotation={[0, 0.2, 0]}>
      <group position={[-0.16, 0.245, 0.112 + 0.025 * peel]} rotation={[0.12 * peel, -0.2 * peel, -0.7 * drop + (tt > 3.8 ? 0.16 * Math.sin((tt - 3.8) * 8) * Math.exp(-(tt - 3.8) * 2.2) : 0) + bnc * 0]}>
        <group position={[0.17, -0.06, 0.002]}><Txt3 txt="2000 W" w={0.34} h={0.11} bg="#d8361f" col="#fff6e6" /></group>
      </group>
    </group>
    {/* el medidor analógico amarillo parado al lado */}
    <group position={[0.15, 0, 0.08]} rotation={[0, -0.3, 0]} scale={pop(tt, 0.4) * 1.12}>
      <RBox s={[0.24, 0.32, 0.06]} p={[0, 0.16, 0]} r={0.02}>{M.plastic({ col: "#f2c21b" })}</RBox>
      <mesh position={[0, 0.21, 0.031]}><planeGeometry args={[0.2, 0.15]} /><meshStandardMaterial color="#f7f3e6" roughness={0.6} /></mesh>
      {Array.from({ length: 11 }, (_, i) => { const a = -1.0 + i * 0.2; return <mesh key={i} position={[Math.sin(a) * 0.085, 0.165 + Math.cos(a) * 0.085, 0.032]} rotation={[0, 0, -a]}><boxGeometry args={[0.003, i % 5 ? 0.012 : 0.022, 0.001]} /><meshBasicMaterial color="#1b1b1b" /></mesh>; })}
      <Txt3 txt="0" w={0.02} h={0.02} col="#1b1b1b" bg="#f7f3e6" p={[-0.09, 0.2, 0.033]} />
      <Txt3 txt="1000" w={0.04} h={0.02} col="#1b1b1b" bg="#f7f3e6" p={[0, 0.27, 0.033]} />
      <Txt3 txt="2000" w={0.04} h={0.02} col="#1b1b1b" bg="#f7f3e6" p={[0.09, 0.2, 0.033]} />
      <group position={[0, 0.165, 0.034]} rotation={[0, 0, -ang]}><mesh position={[0, 0.045, 0]}><boxGeometry args={[0.003, 0.09, 0.001]} /><meshBasicMaterial color="#c62a22" /></mesh></group>
      <mesh position={[0, 0.165, 0.035]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#111" /></mesh>
      <Txt3 txt={`${Math.round(1000 * sw)} W`} w={0.22} h={0.1} col="#14231a" bg="#a9c3a2" font="Courier New" weight={900} p={[0, 0.07, 0.032]} />
      {[-0.04, 0.04].map((x, i) => <mesh key={i} geometry={tubeG("wl" + i, [[x, 0.01, 0.03], [x * 2, 0.0, 0.12], [x * 4 - 0.25, 0.005, 0.1]], 0.012, 30, 8)}>{M.rubber({ col: i ? "#c62a22" : "#1b1b1b" })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// piezas reales del interior de una caja
const Cells: React.FC = () => <>{[0, 1, 2, 3].map((i) => <group key={i} position={[-0.075 + i * 0.05, 0, 0]}>
  <RBox s={[0.046, 0.1, 0.08]} p={[0, 0.05, 0]} r={0.004}>{M.matte({ col: "#2a5fb0" })}</RBox>
  {[-0.022, 0.022].map((z) => <mesh key={z} position={[0, 0.104, z]}><cylinderGeometry args={[0.007, 0.007, 0.008, 12]} />{M.steel()}</mesh>)}</group>)}
</>;
const Inverter: React.FC = () => <>
  <RBox s={[0.15, 0.06, 0.1]} p={[0, 0.03, 0]} r={0.006}>{M.matte({ col: "#202226" })}</RBox>
  {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.064 + i * 0.016, 0.075, 0]}><boxGeometry args={[0.004, 0.03, 0.095]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}
  <mesh position={[0, 0.032, 0.051]}><planeGeometry args={[0.07, 0.03]} /><meshStandardMaterial color="#062" emissive="#3aff6a" emissiveIntensity={1.2} toneMapped={false} /></mesh></>;
const AnlFuse: React.FC = () => <>
  <RBox s={[0.12, 0.02, 0.05]} p={[0, 0.01, 0]} r={0.004}>{M.plastic({ col: "#c62a22" })}</RBox>
  {[-0.04, 0.04].map((x) => <mesh key={x} position={[x, 0.03, 0]}><cylinderGeometry args={[0.008, 0.008, 0.024, 12]} />{M.brass()}</mesh>)}
  <RBox s={[0.1, 0.004, 0.022]} p={[0, 0.024, 0]} r={0.001}>{M.steel({ col: "#d8dde2" })}</RBox>
  <RBox s={[0.12, 0.022, 0.052]} p={[0, 0.03, 0]} r={0.004}>{M.glass({ op: 0.35 })}</RBox></>;
const Outlets: React.FC = () => <>
  <RBox s={[0.12, 0.08, 0.012]} p={[0, 0.04, 0]} r={0.004}>{M.plastic({ col: "#f1efe9" })}</RBox>
  {[-0.03, 0.03].map((x) => <group key={x} position={[x, 0.04, 0.007]}>
    {[-0.007, 0.007].map((s) => <mesh key={s} position={[s, 0.006, 0]}><boxGeometry args={[0.003, 0.012, 0.001]} /><meshBasicMaterial color="#222" /></mesh>)}
    <mesh position={[0, -0.01, 0]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#222" /></mesh></group>)}</>;

// 22:47 · TODO EN UNA CAJA: las celdas, el inversor con disipador, el portafusible ANL y las tomas vuelan de a una a la caja de aluminio; la tapa cierra
export const HAllInOne: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0b0c10"
  cam={{ at: [0, 0.16, 0.04], az: [0.32, -0.06], el: [0.56, 0.46], r: [1.08, 0.96], fov: 30 }} lamp={[0, 0.7, 0.2]}>{(tt) => {
  // las 4 piezas que uno compraría suelto caen de a una (con peso y destello al encajar) y la tapa cierra: una sola caja probada
  const parts: [React.ReactNode, V][] = [[<Cells />, [-0.07, 0.012, -0.03]], [<Inverter />, [0.1, 0.012, -0.04]], [<AnlFuse />, [-0.07, 0.012, 0.075]], [<Outlets />, [0.1, 0.02, 0.1]]];
  const T = (i: number) => 0.4 + i * 0.8, lid = eio(tt, 3.9, 4.5), thud = tt > 4.5 && tt < 4.8 ? 0.006 * Math.sin((tt - 4.5) * 40) : 0;
  const fl = parts.reduce((m, _, i) => Math.max(m, cl(1 - Math.abs(tt - T(i) - 0.28) / 0.12)), 0) + cl(1 - Math.abs(tt - 4.5) / 0.12);
  return <>
    <group position={[0, thud, 0]} scale={1.25}>
      <mesh position={[0, 0.006, 0]}><boxGeometry args={[0.42, 0.012, 0.3]} />{M.steel({ col: "#b8bec4" })}</mesh>
      {([[0, 0.08, 0.15, 0.42, 0.16, 0.008], [0, 0.08, -0.15, 0.42, 0.16, 0.008], [0.21, 0.08, 0, 0.008, 0.16, 0.3], [-0.21, 0.08, 0, 0.008, 0.16, 0.3]] as number[][]).map((b, i) =>
        <mesh key={i} position={[b[0], b[1], b[2]]}><boxGeometry args={[b[3], b[4], b[5]]} />{M.steel({ col: "#c3c9cf" })}</mesh>)}
      {parts.map(([el, dst], i) => { const k = cl(phys(tt, T(i), 9, 0.42)), on = tt > T(i);
        return <group key={i}>
          <group position={[dst[0], lerp(0.75, dst[1], k), dst[2]]} rotation={[0, (1 - k) * 0.5, 0]} scale={on ? 1.45 : 0.001}>{el}</group>
          <mesh position={[dst[0], 0.0135, dst[2]]} rotation={[-PI / 2, 0, 0]} scale={on ? 0.4 + 0.6 * k : 0.001}><circleGeometry args={[0.08, 20]} /><meshBasicMaterial color="#000" transparent opacity={0.4 * k} depthWrite={false} /></mesh>
        </group>; })}
      {/* el frente terminado: dos tomas y el LED verde que prende cuando cierra la tapa */}
      {[-0.08, 0.06].map((x) => <group key={x} position={[x, 0.085, 0.155]}>
        <RBox s={[0.07, 0.09, 0.006]} r={0.008}>{M.plastic({ col: "#e8e4da" })}</RBox>
        {[-0.012, 0.012].map((sx) => <mesh key={sx} position={[sx, 0.012, 0.004]}><planeGeometry args={[0.006, 0.018]} /><meshBasicMaterial color="#111" /></mesh>)}
      </group>)}
      <mesh position={[0.16, 0.11, 0.156]}><circleGeometry args={[0.012, 20]} /><meshStandardMaterial color="#062" emissive="#3aff6a" emissiveIntensity={3 * cl((tt - 4.5) / 0.2)} toneMapped={false} /></mesh>
      <group position={[0, 0.16, -0.15]} rotation={[-1.9 * (1 - lid), 0, 0]}>
        <RBox s={[0.43, 0.012, 0.31]} p={[0, 0.006, 0.155]} r={0.004}>{M.steel({ col: "#aeb4ba" })}</RBox>
        {[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.016, 0.29]}><boxGeometry args={[0.05, 0.008, 0.02]} />{M.matte({ col: "#2a2c30" })}</mesh>)}
      </group>
    </group>
    <pointLight position={[0, 0.5, 0.3]} intensity={2.2 * Math.min(1, fl)} distance={1.2} color="#fff1d6" />
  </>;
}}</Scene3D>;

// 23:08 · EL FUSIBLE EN LA BATERÍA: llega el cable rojo al borne, se abre el portafusible, el fusible entra con un clic y se prende el halo verde
export const HDiy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0f0c0a"
  cam={{ at: [-0.22, 0.22, 0.04], az: [-0.45, 0.15], el: [0.5, 0.38], r: [0.82, 0.62], fov: 30 }} lamp={[0, 0.6, 0.2]}>{(tt) => {
  const cab = eio(tt, 0.0, 0.8), lid = eio(tt, 0.6, 0.95) - eio(tt, 2.15, 2.35), fz = cl(phys(tt, 1.7, 8, 0.45)), ok = cl((tt - 2.4) / 0.2);
  return <>
    {/* batería de ciclo profundo */}
    <RBox s={[0.34, 0.2, 0.2]} p={[-0.22, 0.1, 0]} r={0.014}>{M.plastic({ col: "#1d1f22" })}</RBox>
    <RBox s={[0.35, 0.02, 0.21]} p={[-0.22, 0.2, 0]} r={0.006}>{M.plastic({ col: "#2a2c30" })}</RBox>
    {([[-0.33, "#c62a22"], [-0.11, "#1b1b1b"]] as [number, string][]).map(([x, c]) => <group key={x} position={[x, 0.215, 0.04]}>
      <mesh><cylinderGeometry args={[0.016, 0.018, 0.03, 16]} />{M.steel({ col: "#c8b58a" })}</mesh>
      <mesh position={[0, -0.006, 0]}><cylinderGeometry args={[0.026, 0.026, 0.006, 16]} />{M.plastic({ col: c })}</mesh></group>)}
    {/* el fusible de vidrio grande entra deslizando desde afuera y encaja en el borne positivo */}
    <group position={[-0.2, 0.25 + 0.24 * (1 - eio(tt, 1.0, 2.0)) + (tt > 2.0 && tt < 2.07 ? -0.02 : tt >= 2.07 && tt < 2.14 ? 0.006 : 0), 0.04]} rotation={[0, 0, PI / 2]} scale={Math.max(0.001, cl((tt - 0.9) / 0.15)) * 1.25}>
      <mesh><cylinderGeometry args={[0.02, 0.02, 0.09, 24]} /><meshPhysicalMaterial color="#e0584a" transparent opacity={0.6} roughness={0.15} clearcoat={1} /></mesh>
      {[-0.05, 0.05].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.022, 0.022, 0.018, 24]} />{M.steel({ col: "#d8dde2" })}</mesh>)}
      <mesh><cylinderGeometry args={[0.003, 0.003, 0.085, 6]} /><meshStandardMaterial color="#d8c8a0" metalness={0.6} roughness={0.3} /></mesh>
    </group>
    <pointLight position={[-0.2, 0.32, 0.15]} intensity={0.2 * cl(1 - Math.abs(tt - 2.05) / 0.2)} distance={0.3} color="#ffd88a" />
    {/* tramo corto de cable rojo del portafusible al borne positivo */}
    <mesh geometry={tubeG("dyp", [[-0.27, 0.245, 0.04], [-0.31, 0.25, 0.04], [-0.33, 0.232, 0.04]], 0.011, 16, 8)}>{M.rubber({ col: "#c62a22" })}</mesh>
    {/* el cable rojo grueso que llega desde la derecha */}
    {(() => { const q = Math.round(cab * 16); if (q < 1) return null; const P: V[] = [[0.9, 0.02, 0.5], [0.08, 0.04, 0.12], [-0.06, 0.18, 0.06], [-0.12, 0.25, 0.04]];
      const at = (u: number): V => { const f = u * 3, i = Math.min(2, Math.floor(f)), k = f - i; return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k), lerp(P[i][2], P[i + 1][2], k)]; };
      return <mesh geometry={tubeG("dyr" + q, Array.from({ length: 8 }, (_, j) => at(j / 7 * q / 16)), 0.013, 40, 10)}>{M.rubber({ col: "#c62a22" })}</mesh>; })()}
    {/* portafusible entre el cable y el borne */}
    <group position={[-0.2, 0.24, 0.04]} scale={1.3}>
      <RBox s={[0.12, 0.03, 0.05]} r={0.006}>{M.matte({ col: "#151618" })}</RBox>
      <group position={[0, 0.015, -0.025]} rotation={[-1.7 * lid, 0, 0]}><RBox s={[0.12, 0.02, 0.05]} p={[0, 0.01, 0.025]} r={0.006}>{M.plastic({ col: "#c62a22", op: 0.85 })}</RBox></group>

    </group>
    <pointLight position={[-0.2, 0.3, 0.1]} intensity={0.1 * ok} distance={0.25} color="#4dff9a" />
    <mesh position={[-0.13, 0.27, 0.075]}><sphereGeometry args={[0.009, 12, 10]} /><meshStandardMaterial color="#062" emissive="#3aff6a" emissiveIntensity={1.4 * ok} /></mesh>
    {/* aro verde que se enciende alrededor del portafusible cuando el fusible hace clic */}
    {[0].map((j) => { const q = ((tt - 2.4) * 0.8 + j * 0.5) % 1; return <mesh key={j} position={[-0.33, 0.236, 0.04]} rotation={[-PI / 2, 0, 0]} scale={ok > 0.02 ? 1 + 0.2 * q : 0.001}><torusGeometry args={[0.026, 0.0025, 8, 32]} /><meshStandardMaterial color="#3aff6a" emissive="#3aff6a" emissiveIntensity={1.2} transparent opacity={0.85 * ok * (1 - q)} depthWrite={false} /></mesh>; })}
    <mesh position={[-0.33, 0.232, 0.04]} rotation={[-PI / 2, 0, 0]}><torusGeometry args={[0.02, 0.006, 8, 20]} />{M.steel({ col: "#c8b58a" })}</mesh>
    <Spark p={[-0.2, 0.29, 0.06]} k={(tt - 2.0) / 0.35} s={0.6} />

  </>;
}}</Scene3D>;

// curva del tirón: 0 → pico 1200 al arrancar el compresor → se asienta en 150
const draw = (u: number) => u < 0.18 ? 0 : u < 0.24 ? lerp(0, 1200, (u - 0.18) / 0.06) : u < 0.5 ? lerp(1200, 150, 1 - Math.pow(1 - (u - 0.24) / 0.26, 3)) : 150 + 6 * Math.sin(u * 60);
// 24:24 · EL TIRÓN MEDIDO: la heladera enchufada al medidor; el registrador de papel dibuja el pico de 1200 y el asiento en 150; la libreta anota los dos
export const HMeterTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile" bg="#0d1014"
  cam={{ at: [0.1, 0.22, 0.08], az: [0.12, 0.02], el: [0.3, 0.24], r: [1.1, 0.98], fov: 30 }}>{(tt) => {
  const u = cl((tt - 0.3) / 4.0), v = Math.round(draw(u)), uq = Math.round(u * 80) / 80;
  const pts: number[][] = []; for (let i = 0; i <= 60; i++) { const w = uq * i / 60; pts.push([-0.15 + 0.3 * w, -0.075 + 0.15 * draw(w) / 1200, 0]); }
  const tip = pts[pts.length - 1];
  return <>
    <Fridge p={[-0.42, 0, -0.14]} r={[0, 0.35, 0]} s={0.9} lit={u > 0.18 ? 1 : 0} />
    <WattMeter val={`${v} W`} p={[-0.08, 0, 0.16]} r={[0, 0.05, 0]} s={2.2} warn={v > 600 ? 1 : 0} />
    <Plug p={[-0.08, 0.08, 0.24]} to={[-0.38, 0.04, -0.05]} r={[0, -0.1, 0]} k="mt" />
    {/* el registrador de rollo: la pluma dibuja el pico y el asiento */}
    <group position={[0.3, 0, -0.05]} rotation={[0, -0.25, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.38, 0.06, 0.16]} p={[0, 0.03, 0]} r={0.01}>{M.matte({ col: "#2a2c30" })}</RBox>
      <RBox s={[0.38, 0.22, 0.03]} p={[0, 0.17, -0.06]} r={0.01}>{M.steel({ col: "#9aa0a6" })}</RBox>
      <group position={[0, 0.17, -0.043]}>
        <mesh><planeGeometry args={[0.33, 0.19]} /><meshStandardMaterial color="#f6f2e6" roughness={0.9} /></mesh>
        {[-0.05, 0, 0.05].map((y) => <mesh key={y} position={[0, y, 0.0005]}><planeGeometry args={[0.33, 0.002]} /><meshBasicMaterial color="#c9d4de" /></mesh>)}
        <mesh position={[0, -0.075 + 0.15, 0.0006]}><planeGeometry args={[0.33, 0.003]} /><meshBasicMaterial color="#e2a09a" /></mesh>
        {uq > 0.01 && <mesh position={[0, 0, 0.002]} geometry={tubeG("rec" + uq.toFixed(3), pts, 0.0035, 120, 6)}><meshBasicMaterial color="#c62a22" /></mesh>}
        <group scale={Math.max(0.001, cl((u - 0.26) / 0.06))}><Txt3 txt="1200" w={0.09} h={0.04} col="#c62a22" weight={900} p={[-0.05, 0.088, 0.003]} /></group>
        <group scale={Math.max(0.001, cl((u - 0.55) / 0.06))}><Txt3 txt="150" w={0.07} h={0.04} col="#c62a22" weight={900} p={[0.1, -0.035, 0.003]} /></group>
        <group position={[tip[0], tip[1], 0.012]}><mesh rotation={[0, 0, -2.4]} position={[0.02, 0.02, 0]}><cylinderGeometry args={[0.004, 0.0015, 0.06, 10]} />{M.steel({ col: "#3a3d42" })}</mesh></group>
      </group>
    </group>
    {/* la libreta: el lápiz anota los dos números */}
    <group position={[0.16, 0.006, 0.3]} rotation={[-PI / 2, 0, 0.1]}>
      <mesh><planeGeometry args={[0.2, 0.14]} /><meshStandardMaterial color="#f4efd8" roughness={0.9} /></mesh>
      {[0.03, -0.02].map((y) => <mesh key={y} position={[0, y - 0.018, 0.0005]}><planeGeometry args={[0.18, 0.0015]} /><meshBasicMaterial color="#9ab4d0" /></mesh>)}
      <group scale={Math.max(0.001, cl((u - 0.3) / 0.08))}><Txt3 txt="START 1200" w={0.17} h={0.035} col="#1b2a44" weight={900} p={[0, 0.03, 0.001]} /></group>
      <group scale={Math.max(0.001, cl((u - 0.7) / 0.08))}><Txt3 txt="RUN 150" w={0.13} h={0.035} col="#1b2a44" weight={900} p={[-0.02, -0.02, 0.001]} /></group>
      <mesh position={[0.07, u < 0.7 ? 0.04 : -0.01, 0.03]} rotation={[0.4, 0.3, 0.6 + 0.2 * Math.sin(tt * 12)]}><cylinderGeometry args={[0.005, 0.005, 0.11, 8]} />{M.plastic({ col: "#f2c21b" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// 24:56 · DOS PANTALLAS: la caja dice 520 W, el medidor dice 700 W; dos columnas suben y el hueco entre ellas titila en rojo
export const HScreens: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0f0c0a"
  cam={{ at: [0.0, 0.36, 0.02], az: [-0.3, 0.22], el: [0.12, 0.06], r: [1.6, 1.5], fov: 30 }} lamp={[0, 0.6, 0.3]}>{(tt) => {
  const a = roll(tt, 0.3, 1.4, 0, 520), b = roll(tt, 0.5, 1.6, 0, 700), lie = cl((tt - 2.4) / 0.4), fl = lie * (Math.floor(tt * 4) % 2 ? 1 : 0.35), band = cl(phys(tt, 2.5, 8, 0.45));
  const bn = (t0: number) => tt > t0 ? 1 + 0.07 * Math.sin((tt - t0) * 13) * Math.exp(-(tt - t0) * 4) : 1;
  const H = (w: number) => 0.8 * w / 1000, ha = H(a) * bn(1.4), hb = H(b) * bn(1.6), pul = band * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(tt * PI * 4)));
  return <>
    <PBox p={[-0.24, 0, 0.08]} r={[0, 0.2, 0]} w={0.38} h={0.26} d={0.24} scr={`${a} W`} scrCol={lie > 0.5 ? "#ff3b2a" : "#4dff9a"} />
    <WattMeter val={`${b} W`} p={[0.26, 0, 0.12]} r={[0, -0.2, 0]} s={2.2} />
    <pointLight position={[0.4, 0.6, -0.5]} intensity={1.2} distance={1.6} color="#ffb070" />
    {/* dos columnas detrás de cada pantalla */}
    <mesh position={[-0.24, ha / 2 + 0.001, -0.14]} scale={[1, Math.max(0.001, ha), 1]}><boxGeometry args={[0.15, 1, 0.1]} /><meshStandardMaterial color="#3fae6a" emissive="#2a8a52" emissiveIntensity={0.4} /></mesh>
    <mesh position={[0.24, hb / 2 + 0.001, -0.14]} scale={[1, Math.max(0.001, hb), 1]}><boxGeometry args={[0.15, 1, 0.1]} /><meshStandardMaterial color="#d8641a" emissive="#c06a10" emissiveIntensity={0.4} /></mesh>
    {/* el número grande arriba de cada columna */}
    <Txt3 txt={`${a} W`} w={0.2} h={0.075} col="#bfffd2" glow weight={900} p={[-0.24, ha + 0.06, -0.07]} s={Math.max(0.001, cl((ha - 0.28) / 0.05))} />
    <Txt3 txt={`${b} W`} w={0.2} h={0.075} col="#ffd9a0" glow weight={900} p={[0.24, hb + 0.06, -0.07]} s={Math.max(0.001, cl((hb - 0.34) / 0.05))} />
    {/* la banda roja que llena el hueco entre las dos puntas */}
    <group position={[0, ha + (hb - ha) / 2, -0.14]} scale={[Math.max(0.001, band), 1, 1]}>
      <mesh scale={[1, Math.max(0.001, hb - ha), 1]}><boxGeometry args={[0.3, 1, 0.1]} /><meshStandardMaterial color="#c01810" emissive="#ff2a10" emissiveIntensity={0.15 + 0.55 * pul} transparent opacity={0.55 + 0.35 * pul} /></mesh>
      <Txt3 txt="180 W" w={0.2} h={0.07} col="#ffffff" weight={900} p={[0, 0, 0.06]} s={1 + 0.08 * pul} />
      <pointLight position={[0, 0, 0.25]} intensity={1.6 * pul} distance={0.9} color="#ff3a2a" />
    </group>
  </>;
}}</Scene3D>;

// estación con ventana lateral que deja ver la carga de adentro
const Station: React.FC<{ p: V; fill: number; scr: string; scrCol: string; fillCol: string; s?: number }> = ({ p, fill, scr, scrCol, fillCol, s = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.26, 0.3, 0.17]} p={[0, 0.15, 0]} r={0.02}>{M.glass({ op: 0.22 })}</RBox>
  <RBox s={[0.16, 0.025, 0.04]} p={[0, 0.315, 0]} r={0.01}>{M.matte({ col: "#1b1d20" })}</RBox>
  <mesh position={[0, 0.015 + 0.13 * fill, 0]} scale={[1, Math.max(0.001, fill), 1]}><boxGeometry args={[0.22, 0.26, 0.13]} /><meshStandardMaterial color={fillCol} emissive={fillCol} emissiveIntensity={0.55} transparent opacity={0.9} /></mesh>
  <mesh position={[0, 0.015 + 0.26 * fill, 0.088]}><planeGeometry args={[0.26, 0.006]} />{M.glow({ col: "#ffffff" })}</mesh>
  <RBox s={[0.14, 0.07, 0.006]} p={[0, 0.2, 0.087]} r={0.006}>{M.matte({ col: "#0b0d0f" })}</RBox>
  <Txt3 txt={scr} w={0.12} h={0.055} col={scrCol} bg="#0b0d0f" font="Courier New" p={[0, 0.2, 0.091]} /></group>;
// 25:32 · DIEZ MINUTOS DE SECADOR: dos cajas iguales; la honesta baja de 100 a 87 por dentro y en pantalla; la otra sigue diciendo 100 mientras por dentro cae a 80 y titila rojo
export const HPercent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0b0d12"
  cam={{ at: [0.06, 0.22, 0], az: [0.22, -0.12], el: [0.22, 0.15], r: [1.4, 1.24], fov: 30 }} lamp={[0, 0.7, 0.3]}>{(tt) => {
  const g = 1 - 0.13 * eio(tt, 0.4, 2.4), b = 1 - 0.2 * eio(tt, 0.5, 2.8), bad = tt > 3.6, fl = bad && Math.floor(tt * 4) % 2 === 0;
  return <>
    <Station p={[-0.22, 0, 0]} fill={3 * g - 2} scr={`${Math.round(g * 100)}%`} scrCol="#4dff9a" fillCol="#3fae6a" s={pop(tt, 0.1) * 1.1} />
    <Station p={[0.22, 0, 0]} fill={3 * b - 2} scr="100%" scrCol="#4dff9a" fillCol={fl ? "#ff3b2a" : bad ? "#a03028" : "#3fae6a"} s={pop(tt, 0.3) * 1.1} />
    <pointLight position={[0.22, 0.3, 0.25]} intensity={fl ? 0.25 : 0} distance={0.5} color="#ff3a2a" />
    <mesh position={[0.22, 0.17, 0.12]} scale={bad ? 1 : 0.001}><torusGeometry args={[0.19, 0.007, 10, 64]} />{M.glow({ col: fl ? "#ff3b2a" : "#7a1c14" })}</mesh>
    <mesh position={[0.22, 0.36 * 1.1 * pop(tt, 0.3), 0]} scale={pop(tt, 0.3) * 1.1}><torusGeometry args={[0.06, 0.012, 10, 32, PI]} />{M.plastic({ col: "#d8361f" })}</mesh>
    {[-0.22, 0.22].map((x) => <mesh key={x} position={[x, 1.1 * 0.275, 0.1]}><planeGeometry args={[0.27, 0.005]} /><meshBasicMaterial color="#f7f4ee" /></mesh>)}
    {/* la raya de lo que dice la pantalla (100 %) y el hueco del 20 % que falta, marcado en el vidrio */}
    <group position={[0.22, 0, 0.1]} scale={1.1}>
      <mesh position={[0, 0.275, 0]} scale={[1, cl((tt - 3.6) / 0.3) > 0 ? 1 : 0.001, 1]}><planeGeometry args={[0.24, 0.006]} />{M.glow({ col: "#ffffff" })}</mesh>
      <mesh position={[0.15, 0.015 + 0.26 * b, 0]} scale={[1, Math.max(0.001, cl((tt - 3.6) / 0.3)), 1]}><boxGeometry args={[0.012, 0.52 * (1 - b), 0.006]} />{M.glow({ col: "#ff5a4a" })}</mesh>
      <Txt3 txt="–20%" w={0.13} h={0.07} bg="#b8241a" col="#ffffff" weight={900} p={[-0.2, 0.36, 0]} s={phys(tt, 3.7, 8, 0.45)} />
    </group>
  </>;
}}</Scene3D>;

// 26:01 · EL REPASO: el portapapeles grande con las cosas que no se compran; el marcador rojo las tacha de a una y la tabla salta con cada raya
const REC = ["MODIFIED SINE WAVE", "NO COLD CHARGE GUARD", "SURGE ON THE FRONT", "FAKE CAPACITY"];
export const HClipboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0f0c0a"
  cam={{ at: [-0.01, 0.03, 0.0], az: [0.0, 0.08], el: [1.05, 0.95], r: [0.82, 0.74], fov: 30 }} lamp={[0, 0.8, 0.5]} warm={0.8}>{(tt) => {
  const LN = ["MODIFIED SINE", "NO COLD GUARD", "SURGE IN FRONT", "FAKE CAPACITY"], T = (i: number) => 1.0 + i * 0.75, Y = (i: number) => 0.13 - i * 0.095;
  const land = phys(tt, 0.15, 5, 0.55), cur = Math.min(3, Math.max(0, Math.floor((tt - 1.0) / 0.75))), u = cl((tt - T(cur)) / 0.4);
  const jump = LN.reduce((acc, _, i) => acc + (tt > T(i) + 0.4 ? 0.04 * Math.abs(Math.sin((tt - T(i) - 0.4) * 16)) * Math.exp(-(tt - T(i) - 0.4) * 7) : 0), 0);
  const mx = tt < 0.9 ? 0.5 : tt > T(3) + 0.6 ? lerp(-0.17 + 0.34, 0.55, eio(tt, T(3) + 0.6, T(3) + 1.1)) : -0.17 + 0.34 * u, my = tt < 0.9 ? Y(0) : Y(cur);
  return <group position={[0.7 * (1 - land), jump, 0]} rotation={[0, 0.25 * (1 - land), 0]}>
    <mesh position={[0.025, -jump + 0.001, 0.03]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.56, 0.56]} /><meshBasicMaterial color="#000" transparent opacity={0.5} depthWrite={false} /></mesh>
    <RBox s={[0.5, 0.012, 0.5]} p={[0, 0.006, 0]} r={0.02}>{M.wood({ base: [150, 104, 62] })}</RBox>
    <RBox s={[0.44, 0.003, 0.44]} p={[0, 0.0135, 0.0]} r={0.002}>{M.matte({ col: "#f6f3ea" })}</RBox>
    {/* el clip metálico */}
    <RBox s={[0.2, 0.02, 0.07]} p={[0, 0.022, -0.235]} r={0.008}>{M.chrome()}</RBox>
    <mesh position={[0, 0.034, -0.235]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.16, 16]} />{M.chrome()}</mesh>
    {LN.map((ln, i) => { const st = cl((tt - T(i)) / 0.4);
      return <group key={i} position={[0, 0.016, -Y(i)]} rotation={[-PI / 2, 0, 0]}>
        {/* el objeto de cada renglón, chico y en relieve: onda cuadrada, copo, rayo, batería */}
        <group position={[-0.175, 0, 0.012 + 0.05 * Math.max(0, 1 - phys(tt, 0.5 + i * 0.18, 9, 0.35))]} scale={1.3 - 0.3 * st}>
          {i === 0 && <mesh geometry={tubeG("cbsq", [[-0.03, -0.012, 0], [-0.03, 0.012, 0], [-0.01, 0.012, 0], [-0.01, -0.012, 0], [0.01, -0.012, 0], [0.01, 0.012, 0], [0.03, 0.012, 0], [0.03, -0.012, 0]], 0.0035, 40, 6)}>{M.plastic({ col: "#2a5ad8" })}</mesh>}
          {i === 1 && [0, 1, 2].map((k) => <mesh key={k} rotation={[0, 0, k * PI / 3]}><boxGeometry args={[0.05, 0.007, 0.006]} />{M.plastic({ col: "#5ab4ff" })}</mesh>)}
          {i === 2 && <mesh geometry={tubeG("cbzz", [[0.008, 0.026, 0], [-0.01, 0.002, 0], [0.01, -0.002, 0], [-0.008, -0.026, 0]], 0.005, 20, 6)}>{M.plastic({ col: "#f2b21b" })}</mesh>}
          {i === 3 && <><RBox s={[0.05, 0.026, 0.012]} r={0.004}>{M.plastic({ col: "#3a3d42" })}</RBox><RBox s={[0.006, 0.012, 0.01]} p={[0.028, 0, 0]} r={0.002}>{M.steel()}</RBox><RBox s={[0.014, 0.018, 0.013]} p={[-0.014, 0, 0.001]} r={0.002}>{M.plastic({ col: "#e0201a" })}</RBox></>}
        </group>
        <mesh position={[-0.175, 0, 0.0005]} scale={Math.max(0.001, st)}><ringGeometry args={[0.032, 0.038, 24]} /><meshBasicMaterial color="#e0201a" /></mesh>
        <group position={[0.03, 0, 0.001]}><Txt3 txt={ln} w={0.34} h={0.062} col={st > 0.95 ? "#7a7f88" : "#1b2a44"} bg="#f6f3ea" weight={900} /></group>
        <mesh position={[-0.14 + 0.17 * st, 0, 0.002]} scale={[Math.max(0.001, st), 1, 1]}><planeGeometry args={[0.34, 0.006]} /><meshBasicMaterial color="#e0201a" transparent opacity={0.85} /></mesh>
      </group>; })}
    {/* el marcador rojo grueso que tacha */}
    <group position={[mx + 0.04, 0.1, -my + 0.03]} rotation={[0.5, 0.2, -0.5]} visible={tt > 0.5} scale={1.5}>
      <mesh><cylinderGeometry args={[0.013, 0.013, 0.13, 18]} />{M.plastic({ col: "#c62a22" })}</mesh>
      <mesh position={[0, -0.075, 0]}><coneGeometry args={[0.012, 0.025, 16]} />{M.matte({ col: "#2a2a2a" })}</mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.014, 0.014, 0.025, 18]} />{M.plastic({ col: "#e8e4dc" })}</mesh>
    </group>
  </group>;
}}</Scene3D>;
