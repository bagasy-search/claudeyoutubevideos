// lch29c · componentes únicos 1-7 (salpicadura, el kit, la llave térmica, el pestillo, el ventilador, la prueba de la luz, el carbón).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Blob, Bottle, Burner, Charcoal, Filter, Hand, Hood, Pot, SodaBox } from "./hood";

const PI = Math.PI;

// ---- 0:10 · CADA CHULETA DESDE REAGAN: la sartén salta gotitas que suben y se quedan pegadas abajo de la campana, capa sobre capa ----
export const HSpatterUp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="tile" bg="#14110d" key1={[-1.0, 1.6, 1.2]}
  cam={{ at: [0, 0.36, 0], az: [0.35, 0.2], el: [-0.02, 0.04], r: [1.45, 1.25], fov: 34 }}>{(tt) => {
  const film = eio(tt, 0.8, 5.0);
  return <>
    <Burner on={1} />
    {/* sartén de hierro con la chuleta */}
    <group position={[0, 0.03, 0]}>
      <mesh><cylinderGeometry args={[0.13, 0.11, 0.04, 40, 1, true]} /><meshStandardMaterial color="#1b1b1c" metalness={0.6} roughness={0.5} side={2} /></mesh>
      <mesh position={[0, -0.018, 0]}><cylinderGeometry args={[0.11, 0.11, 0.006, 40]} /><meshStandardMaterial color="#1b1b1c" metalness={0.6} roughness={0.5} /></mesh>
      <mesh position={[0.24, 0.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.014, 0.2, 12]} /><meshStandardMaterial color="#1b1b1c" metalness={0.6} roughness={0.5} /></mesh>
      <mesh position={[0, -0.006, 0]} scale={[1.4, 0.25, 1]}><sphereGeometry args={[0.06, 24, 14]} /><meshStandardMaterial color="#9a5a2c" roughness={0.6} /></mesh>
    </group>
    {/* gotitas que suben en arco y se pegan */}
    {Array.from({ length: 34 }, (_, i) => { const t0 = rn(i, 2) * 4.6, ph = cl((tt - t0) / 0.8); if (ph <= 0) return null; const x = (rn(i, 3) - 0.5) * 0.5, z = (rn(i, 4) - 0.5) * 0.3;
      return ph < 1 ? <mesh key={i} position={[x * ph, 0.05 + 0.55 * Math.sin(ph * PI / 2), z * ph]}><sphereGeometry args={[0.01, 10, 8]} />{M.grease({ col: "#e4b75a" })}</mesh>
        : <group key={i} position={[x, 0.598, z]}><Blob s={0.009} col="#8a5a22" /></group>; })}
    {/* la campana, con una película marrón que se espesa abajo */}
    <group position={[0, 0.6, -0.05]}><Hood /></group>
    <mesh position={[0, 0.598, -0.05]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.88, 0.48]} /><meshStandardMaterial color="#6b4318" roughness={0.4} transparent opacity={0.85 * film} /></mesh>
  </>;
}}</Scene3D>;

// ---- 0:45 · OLLA, BICARBONATO, DETERGENTE Y ACEITE: llegan de a uno sobre la mesada, con su peso ----
export const HHoodKit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" bg="#14110d"
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.15], el: [0.3, 0.36], r: [1.15, 0.95], fov: 32 }}>{(tt) => {
  const a = phys(tt, 0.4, 8, 0.5), b = phys(tt, 1.4, 9, 0.45), c = phys(tt, 2.3, 9, 0.45), d = phys(tt, 3.2, 9, 0.45);
  return <>
    {a > 0.01 && <group position={[-0.28, 0.4 * (1 - cl(a)), -0.02]}><Pot level={0} /></group>}
    {b > 0.01 && <group position={[0.0, 0.4 * (1 - cl(b)), 0.05]} rotation={[0, -0.3, 0.2 * (1 - cl(b))]}><SodaBox /></group>}
    {c > 0.01 && <group position={[0.16, 0.4 * (1 - cl(c)), -0.02]}><Bottle col="#3fae4a" /></group>}
    {d > 0.01 && <group position={[0.3, 0.4 * (1 - cl(d)), 0.06]}><Bottle col="#e9c13a" glass h={0.24} r={0.034} cap="#d23a2a" /></group>}
  </>;
}}</Scene3D>;

// ---- 2:10 · LA LLAVE DE LA COCINA: en la caja de la llave térmica, la palanca KITCHEN baja y la luz de la campana se apaga ----
const lbl = (s: string) => tex.text("lbl" + s, 128, 32, (g) => { g.fillStyle = "#f1ead9"; g.fillRect(0, 0, 128, 32); g.fillStyle = "#2a2622"; g.font = "bold 20px Courier New"; g.fillText(s, 8, 23); });
export const HBreaker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#121212" key1={[-0.8, 1.2, 1.4]}
  cam={{ at: [0.05, 0.02, 0], at1: [0.14, 0.0, 0], az: [0.25, 0.15], el: [0.05, 0.02], r: [0.75, 0.55], fov: 30 }}>{(tt) => {
  const flip = eio(tt, 2.0, 2.4), L = ["PORCH", "BATH", "KITCHEN", "FURNACE"];
  return <>
    <RBox s={[0.36, 0.5, 0.06]} p={[0, 0, -0.03]} r={0.008}>{M.steel({ col: "#8c9196" })}</RBox>
    {L.map((s, i) => { const y = 0.15 - i * 0.1, me = s === "KITCHEN";
      return <group key={s} position={[0, y, 0.005]}>
        <RBox s={[0.1, 0.06, 0.02]} p={[0, 0, 0.005]} r={0.004}>{M.plastic({ col: "#2b2b2b" })}</RBox>
        <RBox s={[0.03, 0.04, 0.03]} p={[0, me ? lerp(0.012, -0.012, flip) : 0.012, 0.02]} rot={[me ? lerp(-0.35, 0.35, flip) : -0.35, 0, 0]} r={0.004}>{M.plastic({ col: me ? "#d33a2c" : "#3a3a3a" })}</RBox>
        <mesh position={[0.13, 0, 0.002]}><planeGeometry args={[0.12, 0.03]} /><meshStandardMaterial map={lbl(s)} /></mesh>
      </group>; })}
    {/* la campana al fondo, con la lucecita que se apaga */}
    <group position={[0.75, 0.25, -0.9]} scale={0.6}><Hood light={1 - flip} /></group>
  </>;
}}</Scene3D>;

// ---- 2:40 · EL PESTILLO: se corre el resorte y el filtro baja a la mano, pesado y goteando ----
export const HLatchDrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#14110d" key1={[-0.8, 0.3, 1.4]}
  cam={{ at: [0, 0.48, 0.1], az: [0.35, 0.25], el: [-0.12, -0.05], r: [0.66, 0.56], fov: 32 }}>{(tt) => {
  const slide = eio(tt, 0.6, 1.2), drop = phys(tt, 1.4, 6, 0.38);
  return <>
    <group position={[0, 0.6, 0]}><Hood /></group>
    {/* el pestillo que se corre */}
    <RBox s={[0.05, 0.012, 0.02]} p={[0.12 + 0.05 * slide, 0.592, 0.13]} r={0.003}>{M.chrome()}</RBox>
    <group position={[0, 0.592 - 0.16 * cl(drop), 0.02]} rotation={[0.2 * cl(drop), 0, 0]}><Filter dirt={0.75} /></group>
    {/* la mano que lo recibe: se hunde un poco con el peso */}
    <group position={[0.02, 0.405 - 0.02 * Math.sin(cl((tt - 1.8) / 0.6) * PI), 0.1]} rotation={[0.1, 0.3, 0]} scale={1.3}><Hand grip={0.25 * cl((tt - 2.0) / 0.5)} /></group>
    {Array.from({ length: 5 }, (_, i) => { const ph = cl((tt - 2.2 - i * 0.6) / 0.8); return ph > 0 && ph < 1 && <mesh key={i} position={[-0.15 + i * 0.06, 0.42 - 0.35 * ph * ph, 0.12]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.007, 10, 8]} />{M.grease({ col: "#8a5a22" })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 3:05 · VENTILADOR APAGADO: las paletas giran a centímetros de los dedos; la palanca baja y frenan ----
export const HFanOff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f1012" key1={[-0.6, -0.8, 1.2]}
  cam={{ at: [0, 0, 0], az: [0.15, 0.05], el: [-0.95, -1.1], r: [0.75, 0.62], fov: 30 }}>{(tt) => {
  const stop = eio(tt, 2.2, 4.2), ang = tt * 22 * (1 - 0.5 * stop) - 6 * stop * stop;
  return <>
    {/* la boca del ventilador vista desde abajo */}
    <mesh position={[0, 0.05, 0]} rotation={[PI / 2, 0, 0]}><ringGeometry args={[0.15, 0.4, 48]} /><meshStandardMaterial color="#9da2a7" metalness={0.8} roughness={0.35} side={2} /></mesh>
    <mesh position={[0, 0.08, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.15, 40]} /><meshStandardMaterial color="#1a1a1a" side={2} /></mesh>
    <group position={[0, 0.06, 0]} rotation={[0, ang, 0]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.02, 20]} />{M.steel({ col: "#55595e" })}</mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} rotation={[0.35, (i / 5) * PI * 2, 0]} position={[Math.cos((i / 5) * PI * 2) * 0.075, 0, -Math.sin((i / 5) * PI * 2) * 0.075]}><boxGeometry args={[0.1, 0.004, 0.05]} />{M.steel({ col: "#8a8f94" })}</mesh>)}
    </group>
    {/* la mano, que no entra hasta que paran */}
    <group position={[0.24 - 0.08 * eio(tt, 4.3, 5.2), -0.02, 0.05]} rotation={[0, 0, 0]}>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.04, 0.02, -0.03 + i * 0.022]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.0095, 0.06, 8, 14]} /><meshStandardMaterial color="#dcb08e" roughness={0.6} /></mesh>)}
      <RBox s={[0.08, 0.03, 0.09]} p={[0.04, 0.02, 0.003]} r={0.014}><meshStandardMaterial color="#dcb08e" roughness={0.6} /></RBox>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:50 · LA PRUEBA DE LA LUZ: el filtro de malla contra la ventana: la luz pasa por cada agujerito ----
export const HLightTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f0d0b" key1={[0.4, 0.6, -1.2]}
  cam={{ at: [0, 0.3, 0], az: [0.4, 0.1], el: [0.05, 0.1], r: [0.9, 0.7], fov: 32 }}>{(tt) => {
  const up = eio(tt, 0.3, 1.6), sun = eio(tt, 1.4, 2.4);
  return <>
    {/* la ventana: rectángulo de luz con parteluz */}
    <mesh position={[0, 0.35, -0.35]}><planeGeometry args={[0.8, 0.6]} />{M.glow({ col: "#fff6e4", op: 0.15 + 0.85 * sun })}</mesh>
    <RBox s={[0.02, 0.62, 0.02]} p={[0, 0.35, -0.34]} r={0.004}>{M.wood({ base: [230, 226, 214] })}</RBox>
    <RBox s={[0.82, 0.02, 0.02]} p={[0, 0.35, -0.34]} r={0.004}>{M.wood({ base: [230, 226, 214] })}</RBox>
    {/* el filtro, de pie, subiendo frente a la ventana */}
    <group position={[0, lerp(0.05, 0.33, up), 0]} rotation={[PI / 2 - 0.1, 0, 0.05]}><Filter dirt={0} dark={0.55} /></group>
  </>;
}}</Scene3D>;

// ---- 4:30 · EL FILTRO DE CARBÓN NO SE LAVA: la almohadilla negra de fieltro; el dedo la aprieta y se hunde, blanda ----
export const HCharcoal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#121110" key1={[-0.6, 1.0, 1.2]}
  cam={{ at: [0, 0.3, 0], az: [0.35, 0.15], el: [0.15, 0.22], r: [0.75, 0.62], fov: 32 }}>{(tt) => {
  const up = eio(tt, 0.3, 1.6), squish = 0.25 * Math.sin(cl((tt - 2.4) / 1.2) * Math.PI);
  return <>
    {/* la ventana atrás: la luz NO pasa por el carbón */}
    <mesh position={[0, 0.35, -0.35]}><planeGeometry args={[0.8, 0.6]} />{M.glow({ col: "#fff6e4", op: 0.9 })}</mesh>
    <group position={[0, lerp(0.05, 0.34, up), 0]} rotation={[PI / 2 - 0.08, 0, -0.04]} scale={[1, 1 - squish, 1]}><Charcoal /></group>
    {/* dedo que lo aprieta: es blando */}
    {tt > 2.2 && <mesh position={[0.06, 0.34, 0.04 - 0.012 * Math.sin(cl((tt - 2.4) / 1.2) * PI)]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.012, 0.06, 8, 14]} /><meshStandardMaterial color="#dcb08e" roughness={0.6} /></mesh>}
  </>;
}}</Scene3D>;
