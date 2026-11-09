// gary8pa · componentes únicos 1/2 (min 2-9): la cuenta de la batería de auto contra la heladera. Render SÓLO en el farm.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { Fridge, Mark, PI, Plug, Txt3, WattMeter, pop, roll } from "./gk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);
const AMB = "#ffb547", GRN = "#6fe39a", RED = "#ff5a4a", INK = "#0e1013", CRM = "#f7f4ee";

// la batería de auto: caja negra (o de vidrio con líquido hasta lvl), tapa, dos bornes y la calcomanía
export const CarBat: React.FC<{ p?: V; r?: V; s?: number; label?: string; lvl?: number; glass?: boolean; liq?: string; plates?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, label, lvl = 0, glass, liq = AMB, plates = 0 }) => {
  const W = 0.5, H_ = 0.32, D = 0.26;
  return <group position={p} rotation={r} scale={z1(s)}>
    {glass ? <mesh position={[0, H_ / 2, 0]}><boxGeometry args={[W, H_, D]} />{M.glass({ op: 0.22 })}</mesh>
      : <RBox s={[W, H_, D]} p={[0, H_ / 2, 0]} r={0.016}>{M.matte({ col: "#17181b" })}</RBox>}
    {glass && lvl > 0.003 && <mesh position={[0, 0.006 + (H_ - 0.012) * lvl / 2, 0]} scale={[1, z1(lvl), 1]}><boxGeometry args={[W - 0.018, H_ - 0.012, D - 0.018]} /><meshStandardMaterial color={liq} emissive={liq} emissiveIntensity={0.55} transparent opacity={0.82} roughness={0.3} /></mesh>}
    {Array.from({ length: plates }, (_, i) => <mesh key={i} position={[-W / 2 + 0.03 + i * (W - 0.06) / Math.max(1, plates - 1), H_ / 2 - 0.01, 0]}><boxGeometry args={[0.004, H_ - 0.05, D - 0.05]} />{M.steel({ col: "#6d7278" })}</mesh>)}
    <RBox s={[W + 0.012, 0.03, D + 0.012]} p={[0, H_ + 0.015, 0]} r={0.008}>{M.matte({ col: "#222428" })}</RBox>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.17, H_ + 0.03, 0.05]}>
      <mesh position={[0, 0.022, 0]}><cylinderGeometry args={[0.024, 0.028, 0.044, 20]} />{M.steel({ col: "#a8acae" })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.044, 0.044, 0.004, 24]} /><meshStandardMaterial color={sd > 0 ? "#c62a22" : "#23262b"} roughness={0.5} /></mesh>
    </group>)}
    {label && <Txt3 txt={label} w={0.3} h={0.1} col={INK} bg="#f2c21b" p={[0, H_ + 0.0312, -0.045]} r={[-PI / 2, 0, 0]} />}
  </group>;
};
// inversor: caja gris, rejilla de ventilador, luz verde/roja, nombre en la cara
export const Inv: React.FC<{ p?: V; r?: V; s?: number; led?: string; on?: number; txt?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, led = GRN, on = 1, txt }) => <group position={p} rotation={r} scale={z1(s)}>
  <RBox s={[0.42, 0.16, 0.24]} p={[0, 0.08, 0]} r={0.016}>{M.steel({ col: "#70767c" })}</RBox>
  <mesh position={[-0.13, 0.08, 0.1205]}><circleGeometry args={[0.052, 28]} />{M.matte({ col: "#17181b" })}</mesh>
  {[0, 1, 2].map((i) => <mesh key={i} position={[-0.13, 0.08, 0.122]}><torusGeometry args={[0.018 + i * 0.014, 0.0022, 6, 28]} />{M.chrome()}</mesh>)}
  <mesh position={[0.17, 0.12, 0.1205]}><circleGeometry args={[0.011, 16]} /><meshStandardMaterial color="#201" emissive={led} emissiveIntensity={0.1 + 2.6 * on} toneMapped={false} /></mesh>
  <mesh position={[0.09, 0.07, 0.1205]}><planeGeometry args={[0.1, 0.08]} /><meshStandardMaterial color="#e8e6e0" roughness={0.6} /></mesh>
  {txt && <Txt3 txt={txt} w={0.3} h={0.07} col={CRM} p={[0, 0.2, 0.1]} glow />}
</group>;

// 1:58 · CALCOMANÍA: la batería desde arriba con «700 CCA»; una columna de luz salta enorme, dura un instante y se cae. Abajo aparece la
// pregunta que importa: cuánto dura.
export const HSticker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0e0f12"
  cam={{ at: [0, 0.34, 0], az: [-0.28, 0.1], el: [0.42, 0.26], r: [1.55, 1.3], fov: 34 }}>{(tt) => {
  const up = eio(tt, 1.2, 1.8) * (1 - eio(tt, 3.2, 3.9));
  return <>
    <CarBat s={1.25} label="700 CCA" />
    <mesh position={[0.21, 0.5 + 0.55 * up, 0.06]} scale={[1, z1(up), 1]}><cylinderGeometry args={[0.04, 0.06, 1.1, 24]} />{M.glow({ col: "#ffd25a" })}</mesh>
    <pointLight position={[0.21, 0.8, 0.2]} intensity={3.4 * up} distance={2.4} color="#ffd25a" />
    <Txt3 txt="30 SECONDS" w={0.56} h={0.11} col="#ffd25a" glow p={[-0.42, 0.86, 0.05]} op={cl((tt - 1.7) / 0.3) * (1 - cl((tt - 3.5) / 0.3))} />
    <Txt3 txt="HOW LONG?" w={0.62} h={0.13} col={INK} bg={AMB} p={[0, 0.72, 0.12]} s={pop(tt, 4.1)} op={cl((tt - 4.0) / 0.2)} />
  </>;
}}</Scene3D>;

// 2:14 · EL TANQUE: la batería de vidrio vacía; caen dos bloques (50 AH y 12 V), se funden y el líquido ámbar sube hasta 600 WH.
export const HTank600: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.34, 0], az: [0.22, -0.1], el: [0.16, 0.12], r: [1.6, 1.38], fov: 34 }}>{(tt) => {
  const fill = eio(tt, 2.7, 4.5), a = phys(tt, 0.7, 7, 0.5), b = phys(tt, 1.5, 7, 0.5), go = eio(tt, 2.4, 2.9);
  return <>
    <CarBat s={1.35} glass lvl={fill} />
    {[{ x: -0.5, t: "50 AH", k: a, c: "#2b6fd6" }, { x: 0.5, t: "12 V", k: b, c: "#d8361f" }].map((q) => <group key={q.t} position={[lerp(q.x, 0, go), 0.09 + 0.9 * (1 - q.k) + go * 0.42, 0.28 * (1 - go)]} scale={z1((1 - go) * 1 + 0.001)}>
      <RBox s={[0.32, 0.16, 0.16]} r={0.016}>{M.plastic({ col: q.c })}</RBox>
      <Txt3 txt={q.t} w={0.27} h={0.1} col={CRM} p={[0, 0, 0.083]} />
    </group>)}
    <Txt3 txt={`${roll(tt, 2.7, 4.5, 0, 600)} WH`} w={0.72} h={0.17} col="#ffd25a" glow p={[0, 0.74, 0.1]} op={cl((tt - 2.8) / 0.3)} />
    <Txt3 txt="THE WHOLE TANK" w={0.56} h={0.08} col={CRM} p={[0, 0.03, 0.34]} r={[-1.1, 0, 0]} op={cl((tt - 4.7) / 0.3)} />
  </>;
}}</Scene3D>;

// 2:40 · EL VELOCÍMETRO DE FRANK: la aguja vuela hasta 800, pero el cuentakilómetros debajo no se mueve de cero.
export const HSpeedo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#0b0c10"
  cam={{ at: [0, 0.03, 0], az: [-0.2, 0.14], el: [0.08, 0.02], r: [1.5, 1.28], fov: 34 }}>{(tt) => {
  const n = phys(tt, 1.0, 3.4, 0.46), a = lerp(2.2, -0.95, n), v = Math.round(800 * cl(n));
  return <group position={[0, 0.02, 0]}>
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.52, 0.52, 0.04, 80]} />{M.matte({ col: "#111317" })}</mesh>
    <mesh position={[0, 0, 0.02]}><torusGeometry args={[0.515, 0.018, 12, 96]} />{M.chrome()}</mesh>
    {Array.from({ length: 9 }, (_, i) => { const q = lerp(2.2, -0.95, i / 8); return <group key={i}>
      <mesh position={[Math.cos(q) * 0.43, Math.sin(q) * 0.43, 0.024]} rotation={[0, 0, q - PI / 2]}><boxGeometry args={[0.012, 0.06, 0.003]} /><meshBasicMaterial color={i > 6 ? RED : "#ece8dd"} /></mesh>
      <Txt3 txt={String(i * 100)} w={0.08} h={0.042} col="#ece8dd" p={[Math.cos(q) * 0.34, Math.sin(q) * 0.34, 0.024]} />
    </group>; })}
    <group position={[0, 0, 0.03]} rotation={[0, 0, a - PI / 2]}><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.016, 0.42, 0.006]} />{M.glow({ col: RED })}</mesh></group>
    <mesh position={[0, 0, 0.036]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.038, 0.038, 0.014, 24]} />{M.chrome()}</mesh>
    <Txt3 txt={`${v} AMPS`} w={0.34} h={0.09} col="#ffd25a" glow p={[0, 0.17, 0.026]} op={cl((tt - 1.1) / 0.2)} />
    <RBox s={[0.34, 0.09, 0.012]} p={[0, -0.24, 0.024]} r={0.004}>{M.matte({ col: "#050608" })}</RBox>
    <Txt3 txt="0 MILES" w={0.28} h={0.07} col={tt > 3.5 ? RED : "#d8d4c8"} glow p={[0, -0.24, 0.032]} />
    <Mark k={cl((tt - 3.9) / 0.5)} p={[0.34, -0.24, 0.06]} s={0.8} />
    <Txt3 txt="WRONG NUMBER" w={0.62} h={0.1} col={INK} bg={RED} p={[0, -0.72, 0.12]} s={pop(tt, 4.4)} op={cl((tt - 4.3) / 0.2)} />
  </group>;
}}</Scene3D>;

// 3:22 · LA MITAD CON CANDADO: vidrio con las placas finas adentro; una raya roja se traza al 50 %, un candado cae sobre la mitad de abajo
// y el número baja de 600 a 300.
export const HLockHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0d0e11"
  cam={{ at: [0, 0.3, 0], az: [-0.16, 0.2], el: [0.12, 0.08], r: [1.55, 1.34], fov: 34 }}>{(tt) => {
  const ln = eio(tt, 1.4, 2.1), dr = phys(tt, 2.4, 6.5, 0.46), dim = eio(tt, 2.6, 3.1);
  return <>
    <CarBat s={1.45} glass lvl={1} plates={24} liq={AMB} />
    <mesh position={[0, 0.03 + 0.116, 0]}><boxGeometry args={[0.72, 0.232, 0.375]} /><meshBasicMaterial color="#0a0c10" transparent opacity={0.76 * dim} depthWrite={false} /></mesh>
    <mesh position={[-0.42 + 0.42 * ln, 0.25, 0.2]} scale={[z1(ln), 1, 1]}><boxGeometry args={[0.84, 0.012, 0.012]} />{M.glow({ col: RED })}</mesh>
    <group position={[0, 0.13 + 0.85 * (1 - dr), 0.215]}>
      <RBox s={[0.13, 0.11, 0.04]} r={0.012}>{M.brass()}</RBox>
      <mesh position={[0, 0.09, 0]}><torusGeometry args={[0.042, 0.012, 12, 32, PI]} />{M.chrome()}</mesh>
    </group>
    <Txt3 txt={`${roll(tt, 3.1, 4.3, 600, 300)} WH`} w={0.68} h={0.16} col="#ffd25a" glow p={[0, 0.8, 0.05]} />
    <Txt3 txt="YOU GET HALF" w={0.6} h={0.1} col={INK} bg={AMB} p={[0, 0.03, 0.42]} r={[-1.05, 0, 0]} s={pop(tt, 4.5)} op={cl((tt - 4.4) / 0.2)} />
  </>;
}}</Scene3D>;

// 3:58 · EL PEAJE: una barra larga de luz entra al inversor y sale más corta; lo que falta se va en humo rojo por arriba.
export const HToll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0d0f12"
  cam={{ at: [0, 0.2, 0], az: [-0.08, 0.1], el: [0.2, 0.14], r: [2.05, 1.8], fov: 32 }}>{(tt) => {
  const go = eio(tt, 0.9, 4.0), lenL = 1.0 * (1 - go), lenR = 0.85 * go;
  return <>
    <mesh position={[-0.28 - lenL / 2, 0.16, 0]} scale={[z1(lenL), 1, 1]}><boxGeometry args={[1, 0.09, 0.09]} />{M.glow({ col: "#ffd25a" })}</mesh>
    <mesh position={[0.28 + lenR / 2, 0.16, 0]} scale={[z1(lenR), 1, 1]}><boxGeometry args={[1, 0.09, 0.09]} />{M.glow({ col: GRN })}</mesh>
    <Inv s={1.35} p={[0, 0, 0]} />
    {Array.from({ length: 9 }, (_, i) => { const u = ((tt * 0.55 + i / 9) % 1); return <mesh key={i} position={[0.05 * Math.sin(i * 2.1 + tt), 0.26 + u * 0.75, 0.04 * Math.cos(i)]} scale={z1(0.03 + 0.09 * u)}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#ff6a3a" emissive="#ff5a2a" emissiveIntensity={0.7} transparent opacity={0.5 * Math.sin(PI * u) * cl(go * 6)} depthWrite={false} /></mesh>; })}
    <Txt3 txt="100" w={0.26} h={0.13} col="#ffd25a" glow p={[-0.86, 0.36, 0]} op={1 - cl((tt - 3.6) / 0.4)} />
    <Txt3 txt={`${roll(tt, 0.9, 4.0, 0, 85)}`} w={0.26} h={0.13} col={GRN} glow p={[0.86, 0.36, 0]} op={cl((tt - 1.0) / 0.3)} />
    <Txt3 txt="15% HEAT" w={0.4} h={0.09} col="#ff8a6a" glow p={[0, 1.08, 0]} op={cl((tt - 2.2) / 0.3)} />
    <Txt3 txt="NOTHING IS FREE" w={0.74} h={0.1} col={INK} bg="#ff8a6a" p={[0, 0.03, 0.62]} r={[-1.1, 0, 0]} s={pop(tt, 4.5)} op={cl((tt - 4.4) / 0.2)} />
  </>;
}}</Scene3D>;

// 4:34 · LA ETIQUETA AMARILLA: se despega de la heladera con su punta curva y queda en el aire; la cuenta se hace sobre ella.
export const HPeel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#0f0d0b"
  cam={{ at: [0.05, 0.42, 0], az: [-0.12, 0.08], el: [0.08, 0.06], r: [1.5, 1.24], fov: 34 }}>{(tt) => {
  const fly = eio(tt, 0.7, 1.7), s1 = cl((tt - 1.9) / 0.3), s2 = cl((tt - 3.1) / 0.3), s3 = cl((tt - 4.2) / 0.3);
  return <>
    <Fridge p={[-0.42, 0, -0.1]} s={1.3} />
    <group position={[lerp(-0.42, 0.28, fly), lerp(0.55, 0.46, fly), lerp(0.1, 0.24, fly)]} rotation={[0, lerp(0, -0.16, fly), lerp(0.03, -0.03, fly)]} scale={lerp(0.34, 1, fly)}>
      <RBox s={[0.8, 0.62, 0.008]} r={0.004}>{M.matte({ col: "#f2c21b" })}</RBox>
      <Txt3 txt="PER YEAR" w={0.42} h={0.06} col={INK} p={[0, 0.25, 0.006]} />
      <Txt3 txt="500 KWH" w={0.56} h={0.14} col={INK} p={[0, 0.1, 0.006]} op={1 - 0.65 * s2} />
      <Txt3 txt="1.37 KWH A DAY" w={0.62} h={0.09} col={INK} p={[0, -0.04, 0.006]} op={s1 * (1 - 0.65 * s3)} />
      <Txt3 txt="57 WATTS" w={0.68} h={0.17} col="#b3221b" p={[0, -0.2, 0.006]} op={s3} s={0.4 + 0.6 * phys(tt, 4.2, 7, 0.5)} />
    </group>
  </>;
}}</Scene3D>;

// 5:06 · EL ALIENTO DEL COMPRESOR: 24 columnas se prenden y apagan (120 W o nada) y una raya verde se queda en el promedio.
export const HCycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0.1, 0.32, 0], az: [-0.3, -0.06], el: [0.16, 0.12], r: [2.05, 1.8], fov: 32 }}>{(tt) => {
  const on = (i: number) => (i % 5 < 2 ? 1 : 0), line = eio(tt, 3.9, 4.6);
  return <>
    <Fridge p={[-1.02, 0, -0.15]} s={1.05} lit={Math.max(0, Math.sin(tt * 1.6))} />
    {Array.from({ length: 24 }, (_, i) => { const k = phys(tt, 0.6 + i * 0.12, 7, 0.5) * on(i); const x = -0.5 + i * 0.07;
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.055, 0.1]} /><meshStandardMaterial color="#2b2e33" /></mesh>
        <mesh position={[0, 0.3 * Math.max(0, k), 0]} scale={[1, z1(k), 1]}><boxGeometry args={[0.055, 0.6, 0.09]} /><meshStandardMaterial color="#ff8a3a" emissive="#ff7a2a" emissiveIntensity={0.55} roughness={0.5} /></mesh>
      </group>; })}
    <mesh position={[-0.5 + 0.81 * line, 0.285, 0.07]} scale={[z1(line), 1, 1]}><boxGeometry args={[1.66, 0.016, 0.016]} />{M.glow({ col: GRN })}</mesh>
    <Txt3 txt="120 W RUNNING" w={0.56} h={0.09} col="#ffb07a" glow p={[0.25, 0.76, 0]} op={cl((tt - 2.0) / 0.3)} />
    <Txt3 txt="57 W AVERAGE" w={0.62} h={0.1} col={INK} bg={GRN} p={[0.36, 0.17, 0.18]} s={pop(tt, 4.5)} op={cl((tt - 4.4) / 0.2)} />
  </>;
}}</Scene3D>;

// 5:36 · VEINTICUATRO HORAS POR EL MEDIDOR: alrededor del medidor enchufado se encienden 24 velitas de hora y la pantalla cuenta.
export const HMeter24: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.3, 0], az: [0.2, -0.16], el: [0.26, 0.16], r: [1.45, 1.22], fov: 34 }}>{(tt) => {
  const k = eio(tt, 0.9, 4.4), n = Math.floor(24 * k + 0.001), v = (1.37 * k).toFixed(2);
  return <>
    <WattMeter val={v} s={3.1} p={[0, 0, 0]} />
    <Plug p={[0, 0.22, -0.18]} to={[0.8, 0.05, -0.75]} k="m24" r={[0, PI, 0]} />
    {Array.from({ length: 24 }, (_, i) => { const a = i / 24 * 2 * PI - PI / 2, lit = i < n ? 1 : 0;
      return <group key={i} position={[Math.cos(a) * 0.62, 0.02, Math.sin(a) * 0.5]}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.018, 0.022, 0.06, 14]} /><meshStandardMaterial color="#3a3d42" emissive="#ffd25a" emissiveIntensity={2.1 * lit} toneMapped={false} /></mesh>
      </group>; })}
    <Txt3 txt={`${n} HOURS`} w={0.46} h={0.11} col="#ffd25a" glow p={[0, 0.6, -0.12]} op={cl((tt - 1.0) / 0.3)} />
    <Txt3 txt="YOUR REAL NUMBER" w={0.8} h={0.1} col={INK} bg={GRN} p={[0, 0.03, 0.5]} r={[-1.1, 0, 0]} s={pop(tt, 4.6)} op={cl((tt - 4.5) / 0.2)} />
  </>;
}}</Scene3D>;

// 6:04 · LA TORRE DE LOS 77: tres cubos caen sobre una balanza (57, 10 y 10); a la derecha, los 300 WH entre 77 dan menos de cuatro horas.
export const HStack77: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0d0e11"
  cam={{ at: [0.12, 0.42, 0], az: [-0.2, 0.08], el: [0.14, 0.1], r: [1.85, 1.6], fov: 32 }}>{(tt) => {
  const B = [{ t: "57", c: "#2b6fd6", h: 0.34, a: 0.6 }, { t: "+10", c: "#e5761c", h: 0.12, a: 1.5 }, { t: "+10", c: "#2f9a55", h: 0.12, a: 2.3 }];
  let y = 0.1;
  const sq = 0.012 * (phys(tt, 2.3, 8, 0.4) > 0 ? 1 : 0), res = cl((tt - 3.5) / 0.3);
  return <>
    <mesh position={[-0.42, 0.04, 0]}><cylinderGeometry args={[0.28, 0.3, 0.08, 40]} />{M.steel({ col: "#5c6066" })}</mesh>
    {B.map((b) => { const k = phys(tt, b.a, 7, 0.48), yy = y; y += b.h; return <group key={b.a} position={[-0.42, yy - sq + b.h / 2 + 1.1 * (1 - k), 0]} scale={z1(cl(k * 3))}>
      <RBox s={[0.34, b.h - 0.006, 0.3]} r={0.014}>{M.plastic({ col: b.c })}</RBox>
      <Txt3 txt={b.t} w={0.2} h={Math.min(0.1, b.h * 0.72)} col={CRM} p={[0, 0, 0.152]} />
    </group>; })}
    <Txt3 txt={`${roll(tt, 2.5, 3.3, 57, 77)} W`} w={0.42} h={0.12} col="#ffd25a" glow p={[-0.42, 0.86, 0]} op={cl((tt - 0.8) / 0.3)} />
    <CarBat p={[0.5, 0, -0.04]} s={1.05} glass lvl={0.5} />
    <Txt3 txt="300 ÷ 77" w={0.5} h={0.12} col={CRM} p={[0.5, 0.56, 0]} op={res} />
    <Txt3 txt="UNDER 4 HOURS" w={0.72} h={0.12} col={INK} bg={AMB} p={[0.5, 0.74, 0.05]} s={pop(tt, 4.4)} op={cl((tt - 4.3) / 0.2)} />
  </>;
}}</Scene3D>;

// 6:32 · LA LUNA DE LAS NUEVE A LA UNA: la casa nevada; la luna cruza el cielo y, cuando llega, la ventana encendida se apaga.
export const HMoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0a1020"
  cam={{ at: [0, 0.48, 0], az: [-0.06, 0.08], el: [0.02, 0.05], r: [2.3, 2.0], fov: 36 }}>{(tt) => {
  const k = eio(tt, 0.7, 4.0), a = lerp(2.5, 0.65, k), off = eio(tt, 4.0, 4.3), hr = k < 0.25 ? "9 PM" : k < 0.5 ? "10 PM" : k < 0.75 ? "11 PM" : k < 0.97 ? "MIDNIGHT" : "1 AM";
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 5]} /><meshStandardMaterial color="#cdd8e8" roughness={0.9} /></mesh>
    <mesh position={[0, 0.3, -0.35]} castShadow><boxGeometry args={[0.92, 0.6, 0.6]} /><meshStandardMaterial color="#47525f" roughness={0.9} /></mesh>
    <mesh position={[0, 0.82, -0.35]} rotation={[0, PI / 4, 0]} scale={[1, 0.62, 0.72]}><coneGeometry args={[0.76, 0.7, 4]} /><meshStandardMaterial color="#e6edf5" roughness={0.8} /></mesh>
    <mesh position={[-0.18, 0.32, -0.048]}><planeGeometry args={[0.2, 0.22]} /><meshStandardMaterial color="#10141d" emissive="#ffc97a" emissiveIntensity={2.3 * (1 - off)} toneMapped={false} /></mesh>
    <pointLight position={[-0.18, 0.32, 0.25]} intensity={1.5 * (1 - off)} distance={1.5} color="#ffc97a" />
    <mesh position={[Math.cos(a) * 1.15, 0.45 + Math.sin(a) * 1.0, -1.4]}><sphereGeometry args={[0.13, 32, 24]} />{M.glow({ col: "#f4f7ff" })}</mesh>
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[-2.2 + ((i * 37) % 44) / 10, 0.55 + ((i * 53) % 18) / 10, -2.2]}><sphereGeometry args={[0.008 + 0.006 * (i % 3), 6, 6]} /><meshBasicMaterial color="#e8eeff" /></mesh>)}
    <Txt3 txt={hr} w={0.56} h={0.13} col={k >= 0.97 ? RED : "#ffd25a"} glow p={[0.72, 0.28, 0.02]} />
    <Txt3 txt="THE HONEST STOP" w={0.72} h={0.1} col={INK} bg={AMB} p={[0, 0.05, 0.72]} r={[-1.15, 0, 0]} s={pop(tt, 4.5)} op={cl((tt - 4.4) / 0.2)} />
  </>;
}}</Scene3D>;

// 7:22 · EL PUÑETAZO DEL ARRANQUE: la columna de 1000 W sale del compresor y le pega al inversor chico, que salta y se apaga en rojo.
// Entra el grande, y aguanta.
export const HPunch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0e0d10"
  cam={{ at: [0.05, 0.28, 0], az: [0.2, -0.1], el: [0.14, 0.1], r: [1.85, 1.6], fov: 32 }}>{(tt) => {
  const hit = eio(tt, 1.0, 1.45) * (1 - eio(tt, 1.8, 2.4)), jump = tt > 1.45 ? Math.max(0, Math.sin((tt - 1.45) * 7) * Math.exp(-(tt - 1.45) * 3)) : 0, dead = cl((tt - 1.5) / 0.2);
  const nw = phys(tt, 3.2, 6, 0.55), small = 1 - eio(tt, 2.9, 3.3), hit2 = eio(tt, 4.0, 4.4) * (1 - eio(tt, 4.7, 5.2));
  return <>
    <group position={[-0.68, 0, 0]}>
      <mesh position={[0, 0.17, 0]} scale={[1, 0.86, 1]}><sphereGeometry args={[0.2, 36, 24]} />{M.matte({ col: "#1b1c20" })}</mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.22, 0.24, 0.04, 32]} />{M.steel({ col: "#44484e" })}</mesh>
      <mesh position={[-0.13, 0.3, 0.05]}><cylinderGeometry args={[0.016, 0.016, 0.3, 14]} />{M.steel({ col: "#c9793f" })}</mesh>
      <mesh position={[0.1, 0.3, 0.08]}><cylinderGeometry args={[0.016, 0.016, 0.34, 14]} />{M.steel({ col: "#c9793f" })}</mesh>
      <RBox s={[0.13, 0.09, 0.05]} p={[0.15, 0.13, 0.17]} r={0.012}>{M.plastic({ col: "#3f4349" })}</RBox>
      <Txt3 txt="COMPRESSOR" w={0.5} h={0.08} col={CRM} glow p={[0, 0.52, 0]} op={1} />
    </group>
    <mesh position={[-0.68 + 0.4 * Math.max(hit, hit2), 0.22, 0]} rotation={[0, 0, -PI / 2]} scale={[1, z1(Math.max(hit, hit2)), 1]}><cylinderGeometry args={[0.04, 0.07, 0.8, 20]} />{M.glow({ col: "#ffb547" })}</mesh>
    <Txt3 txt="1000 W PUNCH" w={0.56} h={0.09} col="#ffd25a" glow p={[-0.2, 0.72, 0]} op={cl((tt - 1.0) / 0.2)} />
    <group position={[0.2, 0.2 * jump, 0]} rotation={[0, 0, -0.5 * jump]} scale={z1(small)}><Inv s={0.75} led={dead > 0.5 ? RED : GRN} /><Txt3 txt="300 W" w={0.22} h={0.08} col={CRM} p={[0, 0.2, 0.06]} /></group>
    <Txt3 txt="SHUTS DOWN" w={0.46} h={0.09} col={RED} glow p={[0.28, 0.44, 0]} op={dead * small} />
    <group position={[0.2, 1.1 * (1 - nw), 0]} scale={z1(cl(nw * 4))}><Inv s={1.5} /><Txt3 txt="1000 W" w={0.36} h={0.11} col={CRM} p={[0, 0.34, 0.12]} /></group>
    <Txt3 txt="IT HOLDS" w={0.46} h={0.1} col={INK} bg={GRN} p={[0.25, 0.03, 0.5]} r={[-1.1, 0, 0]} s={pop(tt, 4.8)} op={cl((tt - 4.7) / 0.2)} />
  </>;
}}</Scene3D>;

// 7:58 · EL FUSIBLE DEL ENCENDEDOR: fusible de vidrio de cerca; el filamento se pone naranja, blanco, y se parte. Quince amperios y se acabó.
export const HSocketFuse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0a0b0e"
  cam={{ at: [0, 0.03, 0], az: [-0.24, 0.18], el: [0.1, 0.04], r: [1.3, 1.08], fov: 32 }}>{(tt) => {
  const heat = eio(tt, 0.8, 3.0), br = cl((tt - 3.1) / 0.08), gap = 0.05 * br;
  return <group position={[0, 0, 0]}>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.42, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.125, 0.125, 0.16, 40]} />{M.chrome()}</mesh>)}
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.105, 0.105, 0.72, 40, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
    {[-1, 1].map((s) => <mesh key={"f" + s} position={[s * (0.17 + gap), 0.004 * s, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.34 - 2 * gap, 12]} /><meshStandardMaterial color="#7a7a7a" emissive={heat > 0.7 ? "#fff0c8" : "#ff7a2a"} emissiveIntensity={(0.2 + 3.4 * heat) * (1 - br * Math.min(1, (tt - 3.1) * 2))} toneMapped={false} /></mesh>)}
    <pointLight position={[0, 0, 0.3]} intensity={2.4 * heat * (1 - br)} distance={1.4} color="#ffc78a" />
    <Txt3 txt="15 AMPS" w={0.42} h={0.1} col="#ffd25a" glow p={[0, 0.3, 0.02]} op={cl((tt - 0.6) / 0.3)} />
    <Txt3 txt="180 WATTS. TOPS." w={0.74} h={0.11} col={RED} glow p={[0, -0.3, 0.02]} op={cl((tt - 3.5) / 0.3)} />
  </group>;
}}</Scene3D>;

// 8:42 · LOS SIETE PULGADAS: borne positivo, cable rojo grueso y una regla de carpintero que se despliega hasta el fusible.
export const HRuler7: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.12, 0.22, 0], az: [-0.2, 0.08], el: [0.46, 0.32], r: [1.35, 1.12], fov: 34 }}>{(tt) => {
  const u = eio(tt, 1.2, 3.0), fz = phys(tt, 3.2, 7, 0.5), X0 = -0.21, X1 = 0.42;
  const col = "#c62a22";
  return <>
    <CarBat p={[-0.3, 0, -0.12]} s={0.8} />
    <mesh geometry={tubeG("r7a", [[X0 + 0.04, 0.3, -0.08], [0.0, 0.27, 0.0], [X1 - 0.02, 0.14, 0.06]], 0.02, 40, 10)} castShadow>{M.rubber({ col })}</mesh>
    <mesh geometry={tubeG("r7b", [[X1 + 0.1, 0.14, 0.06], [0.78, 0.12, 0.12], [1.05, 0.06, 0.1]], 0.02, 30, 10)} castShadow>{M.rubber({ col })}</mesh>
    <group position={[X1 + 0.04, 0.14, 0.06]} scale={z1(fz)}>
      <RBox s={[0.15, 0.08, 0.09]} r={0.012}>{M.plastic({ col: "#222428" })}</RBox>
      <Txt3 txt="FUSE" w={0.12} h={0.05} col="#ffd25a" glow p={[0, 0.042, 0]} r={[-PI / 2, 0, 0]} />
    </group>
    <group position={[X0 + 0.02, 0.02, 0.26]}>
      <mesh position={[0.32 * u, 0.005, 0]} scale={[z1(u), 1, 1]}><boxGeometry args={[0.64, 0.01, 0.07]} />{M.wood({ base: [214, 176, 96] })}</mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[i * 0.0914, 0.011, 0.016]} scale={z1(cl(u * 7.2 - i + 1))}><boxGeometry args={[0.005, 0.002, 0.038]} /><meshBasicMaterial color="#1b1205" /></mesh>)}
      {Array.from({ length: 8 }, (_, i) => <Txt3 key={"n" + i} txt={String(i)} w={0.036} h={0.024} col="#1b1205" p={[i * 0.0914 + 0.02, 0.0115, -0.018]} r={[-PI / 2, 0, 0]} op={cl(u * 7.2 - i + 1)} />)}
    </group>
    <Txt3 txt="7 INCHES" w={0.46} h={0.13} col={INK} bg={AMB} p={[0.1, 0.46, 0.05]} r={[-0.5, 0, 0]} s={pop(tt, 4.0)} op={cl((tt - 3.9) / 0.2)} />
  </>;
}}</Scene3D>;

// 9:04 · EL HIDRÓGENO SUBE: alacena cerrada en corte con la batería; las burbujas se juntan arriba. Una chispa chica la pinta de amarillo.
// Sale la alacena y queda la bandeja al lado de la ventana abierta.
export const HClosetGas: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.44, 0], az: [-0.16, 0.12], el: [0.12, 0.08], r: [1.8, 1.55], fov: 32 }}>{(tt) => {
  const g = eio(tt, 0.7, 2.6), fl = Math.exp(-Math.pow((tt - 2.9) / 0.14, 2)), out = eio(tt, 3.5, 4.1), B = 14;
  return <>
    <group position={[0, 1.8 * out, 0]}>
      <mesh position={[-0.42, 0.5, 0]}><boxGeometry args={[0.03, 1, 0.5]} />{M.wood({ base: [130, 92, 56] })}</mesh>
      <mesh position={[0.42, 0.5, 0]}><boxGeometry args={[0.03, 1, 0.5]} />{M.wood({ base: [130, 92, 56] })}</mesh>
      <mesh position={[0, 1.0, 0]}><boxGeometry args={[0.87, 0.03, 0.5]} />{M.wood({ base: [130, 92, 56] })}</mesh>
      <mesh position={[0, 0.5, -0.25]}><boxGeometry args={[0.87, 1, 0.02]} />{M.wood({ base: [108, 76, 46] })}</mesh>
      <mesh position={[0, 0.92, 0]} scale={[1, z1(g), 1]}><boxGeometry args={[0.8, 0.14, 0.44]} /><meshStandardMaterial color="#ffe08a" transparent opacity={0.2 + 0.6 * fl} emissive="#ffd25a" emissiveIntensity={0.25 + 2.6 * fl} depthWrite={false} /></mesh>
      {Array.from({ length: B }, (_, i) => { const u = ((tt * 0.4 + i / B) % 1); return <mesh key={i} position={[-0.2 + (i % 5) * 0.1, 0.42 + u * 0.48, 0.04 * Math.sin(i * 3)]} scale={z1(0.011 * (1 + (i % 3) * 0.4))}><sphereGeometry args={[1, 10, 8]} />{M.glass({ op: 0.55 * (1 - u * 0.3), col: "#e8f6ff" })}</mesh>; })}
      <Txt3 txt="HYDROGEN" w={0.42} h={0.09} col="#ffd25a" glow p={[0, 0.78, 0.2]} op={cl((tt - 1.0) / 0.3)} />
    </group>
    <RBox s={[0.7, 0.03, 0.42]} p={[0, 0.02, 0]} r={0.008}>{M.plastic({ col: "#17181b" })}</RBox>
    <CarBat p={[0, 0.03, 0]} s={0.92} />
    <group position={[0.92, 0.72, -0.5]} scale={z1(out)}>
      <mesh><planeGeometry args={[0.6, 0.7]} /><meshBasicMaterial color="#8db2d8" toneMapped={false} /></mesh>
      {[[-0.31, 0, 0.03, 0.74], [0.31, 0, 0.03, 0.74], [0, -0.36, 0.64, 0.03], [0, 0.36, 0.64, 0.03], [0, 0.14, 0.62, 0.03]].map(([x, y, a, b], i) => <mesh key={i} position={[x, y, 0.012]}><boxGeometry args={[a, b, 0.03]} />{M.matte({ col: "#efece4" })}</mesh>)}
    </group>
    {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.5 + i / 7) % 1; return <mesh key={"a" + i} position={[lerp(0.9, -0.2, u), 0.55 - 0.05 * Math.sin(u * 6 + i), -0.2 + i * 0.06]} scale={[z1(0.14 * (1 - u) * out), 0.004, 0.004]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#cfe2f8" transparent opacity={0.55} depthWrite={false} /></mesh>; })}
    <Txt3 txt="MOVING AIR" w={0.56} h={0.1} col={INK} bg={GRN} p={[0, 0.03, 0.5]} r={[-1.1, 0, 0]} s={pop(tt, 4.4)} op={cl((tt - 4.3) / 0.2)} />
  </>;
}}</Scene3D>;
