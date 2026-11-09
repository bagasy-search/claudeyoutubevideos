// gary8pa · componentes únicos 3/3: la 1 de la mañana, las manos en los bolsillos, el litro de nafta y el enchufe de la camioneta. Render SÓLO en el farm.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { Fridge, PI, Txt3, pop, roll } from "./gk";
import { CarBat, Inv } from "./gh8a";

const z1 = (k: number) => Math.max(0.001, k);
const AMB = "#ffb547", GRN = "#6fe39a", RED = "#ff5a4a", INK = "#0e1013", CRM = "#f7f4ee";

// 0:42 · «TE VAS A DORMIR»: reloj de pared gigante que corre de las 9 a la 1 mientras la batería enchufada se vacía; a la 1 el inversor se pone rojo.
export const HOneAm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0b0d11"
  cam={{ at: [0.05, 0.5, 0], az: [-0.22, 0.1], el: [0.08, 0.1], r: [1.9, 1.62], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.6, 3.9), hrs = lerp(9, 13, k), a = -((hrs % 12) / 12) * 2 * PI, am = -(hrs % 1) * 2 * PI, late = cl((tt - 3.9) / 0.3);
  return <>
    <group position={[-0.42, 0.68, -0.05]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.44, 0.44, 0.05, 56]} />{M.porcelain({ col: "#f0ede4" })}</mesh>
      <mesh position={[0, 0, 0.03]}><torusGeometry args={[0.44, 0.022, 12, 64]} />{M.steel({ col: "#50545a" })}</mesh>
      {Array.from({ length: 12 }, (_, i) => { const b = i / 12 * 2 * PI; return <mesh key={i} position={[Math.sin(b) * 0.37, Math.cos(b) * 0.37, 0.032]} rotation={[0, 0, -b]}><boxGeometry args={[0.018, 0.06, 0.006]} /><meshStandardMaterial color="#26282c" /></mesh>; })}
      <group position={[0, 0, 0.04]} rotation={[0, 0, a]}><mesh position={[0, 0.11, 0]}><boxGeometry args={[0.03, 0.24, 0.008]} /><meshStandardMaterial color="#16181b" /></mesh></group>
      <group position={[0, 0, 0.05]} rotation={[0, 0, am]}><mesh position={[0, 0.16, 0]}><boxGeometry args={[0.018, 0.34, 0.008]} /><meshStandardMaterial color="#16181b" /></mesh></group>
      <mesh position={[0, 0, 0.056]}><cylinderGeometry args={[0.024, 0.024, 0.012, 20]} />{M.brass({ col: "#b48a3a" })}</mesh>
    </group>
    <CarBat p={[0.5, 0, 0.1]} s={1.05} glass lvl={lerp(0.92, 0.22, k)} />
    <Inv p={[0.5, 0.36, 0.06]} s={0.8} led={late > 0.5 ? RED : GRN} />
    <pointLight position={[0.5, 0.5, 0.5]} intensity={2.4 * late} distance={1.6} color={RED} />
    <Txt3 txt="1 A.M." w={0.46} h={0.14} col={INK} bg={RED} p={[-0.42, 0.03, 0.56]} r={[-1.1, 0, 0]} s={pop(tt, 4.1)} op={cl((tt - 4.0) / 0.2)} />
  </>;
}}</Scene3D>;

// 14:30 · LAS MANOS EN LOS BOLSILLOS: la palanca del inversor rodeada de diez luces que se prenden de a una; recién con la décima baja la palanca.
export const HPockets: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0, 0.34, 0], az: [0.2, -0.12], el: [0.3, 0.2], r: [1.32, 1.1], fov: 32 }}>{(tt) => {
  const n = Math.floor(cl((tt - 0.6) / 3.6) * 10 + 0.001), flip = eio(tt, 4.3, 4.6);
  return <>
    <RBox s={[0.66, 0.66, 0.08]} p={[0, 0.34, 0]} r={0.03}>{M.steel({ col: "#5e6268" })}</RBox>
    {Array.from({ length: 10 }, (_, i) => { const b = i / 10 * 2 * PI, on = i < n ? 1 : 0; return <mesh key={i} position={[Math.sin(b) * 0.25, 0.34 + Math.cos(b) * 0.25, 0.045]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.024, 0.012, 20]} /><meshStandardMaterial color="#2a1c10" emissive={AMB} emissiveIntensity={0.05 + 3 * on} toneMapped={false} /></mesh>; })}
    <RBox s={[0.12, 0.2, 0.03]} p={[0, 0.34, 0.05]} r={0.012}>{M.plastic({ col: "#17181b" })}</RBox>
    <group position={[0, 0.34, 0.07]} rotation={[lerp(-0.62, 0.62, flip), 0, 0]}><RBox s={[0.05, 0.05, 0.17]} p={[0, 0, 0.08]} r={0.018}>{M.plastic({ col: flip > 0.5 ? "#2f9a55" : "#d8361f" })}</RBox></group>
    <Txt3 txt={`${n}`} w={0.26} h={0.17} col={AMB} glow p={[0.62, 0.42, 0]} />
    <Txt3 txt="HANDS IN POCKETS" w={0.82} h={0.11} col={INK} bg={AMB} p={[0, 0.03, 0.2]} r={[-1.1, 0, 0]} s={pop(tt, 4.7)} op={cl((tt - 4.6) / 0.2)} />
  </>;
}}</Scene3D>;

// 16:58 · EL LITRO QUE CARGA: una botella de nafta se vacía por el tubo y la batería de vidrio vuelve a subir: una hora de marcha.
export const HQuart: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0d0f12"
  cam={{ at: [0, 0.34, 0], az: [-0.16, 0.12], el: [0.14, 0.1], r: [1.72, 1.46], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.8, 4.2);
  return <>
    <group position={[-0.58, 0, 0]}>
      <mesh position={[0, 0.26, 0]}><cylinderGeometry args={[0.15, 0.15, 0.52, 36, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, 0.54, 0]}><cylinderGeometry args={[0.05, 0.15, 0.1, 30, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, 0.25 * (1 - k * 0.85) + 0.004, 0]} scale={[1, z1(1 - k * 0.85), 1]}><cylinderGeometry args={[0.142, 0.142, 0.5, 32]} /><meshStandardMaterial color="#d99a2b" emissive="#b8741a" emissiveIntensity={0.5} transparent opacity={0.85} /></mesh>
      <Txt3 txt="1 QUART" w={0.34} h={0.09} col="#ffd25a" glow p={[0, 0.72, 0]} />
    </group>
    <mesh geometry={tubeG("qtube", [[-0.5, 0.55, 0], [-0.22, 0.72, 0.03], [0.1, 0.62, 0.03], [0.36, 0.34, 0.06]], 0.012, 40, 10)}>{M.glass({ op: 0.35 })}</mesh>
    {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.8 + i / 6) % 1, x = lerp(-0.5, 0.36, u), y = 0.55 + 0.2 * Math.sin(PI * u) - 0.21 * u; return <mesh key={i} position={[x, y, 0.03]}><sphereGeometry args={[0.014, 12, 10]} /><meshStandardMaterial color={AMB} emissive={AMB} emissiveIntensity={1.2} transparent opacity={k > 0.02 && k < 0.98 ? 1 : 0} /></mesh>; })}
    <CarBat p={[0.5, 0, 0]} s={1.25} glass lvl={lerp(0.35, 0.72, k)} />
    <Txt3 txt={`${roll(tt, 0.8, 4.2, 0, 1)} HOUR`} w={0.42} h={0.11} col={GRN} glow p={[0.5, 0.62, 0]} />
    <Txt3 txt="OUTDOORS ONLY" w={0.68} h={0.11} col={INK} bg={GRN} p={[0, 0.03, 0.56]} r={[-1.08, 0, 0]} s={pop(tt, 4.6)} op={cl((tt - 4.5) / 0.2)} />
  </>;
}}</Scene3D>;

// 18:30 · EL ENCHUFE DE LA CAMIONETA: la etiqueta dice 150 W; la aguja intenta arrancar el motor de la heladera, tiembla y se cae.
export const HConsole: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#101216"
  cam={{ at: [0, 0.36, 0], az: [0.14, -0.1], el: [0.08, 0.06], r: [1.6, 1.36], fov: 32 }}>{(tt) => {
  const up = eio(tt, 1.8, 2.5), fall = eio(tt, 2.9, 3.4), a = lerp(1.15, -0.1, up) + (tt > 2.4 && tt < 3 ? Math.sin(tt * 44) * 0.05 : 0) + 1.25 * fall, sh = tt > 2.2 && tt < 3 ? Math.sin(tt * 52) * 0.008 : 0;
  return <>
    <RBox s={[1.8, 0.86, 0.1]} p={[0, 0.36, -0.08]} r={0.05}>{M.matte({ col: "#24262b" })}</RBox>
    <group position={[-0.52, 0.38, -0.02]}>
      <RBox s={[0.28, 0.36, 0.02]} r={0.02}>{M.plastic({ col: "#111215" })}</RBox>
      {[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.05, 0.012]}><boxGeometry args={[0.018, 0.06, 0.002]} /><meshBasicMaterial color="#000" /></mesh>)}
      <mesh position={[0, -0.04, 0.012]}><circleGeometry args={[0.018, 16]} /><meshBasicMaterial color="#000" /></mesh>
      <group position={[0, -0.27, 0.012]} scale={1 + 0.1 * eio(tt, 0.6, 1.1)}><mesh><planeGeometry args={[0.3, 0.12]} /><meshStandardMaterial color="#f2efe6" roughness={0.7} /></mesh><Txt3 txt="150 W" w={0.26} h={0.09} col="#17181b" p={[0, 0, 0.003]} /></group>
    </group>
    <group position={[0.3, 0.42, -0.02]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.03, 50]} />{M.porcelain({ col: "#f0ede4" })}</mesh>
      <mesh position={[0.2, 0.2, 0.018]} rotation={[0, 0, 0]}><boxGeometry args={[0.05, 0.05, 0.003]} /><meshStandardMaterial color={RED} /></mesh>
      <group position={[0, -0.14, 0.03]} rotation={[0, 0, a]}><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.013, 0.4, 0.006]} /><meshStandardMaterial color="#b3221b" /></mesh></group>
      <Txt3 txt="1000 W TO START" w={0.38} h={0.06} col="#17181b" p={[0, -0.17, 0.02]} />
    </group>
    <mesh position={[0.86, 0.14 + sh, 0.05]}><cylinderGeometry args={[0.13, 0.13, 0.22, 32]} />{M.steel({ col: "#3a3d42" })}</mesh>
    <Txt3 txt="WON'T START" w={0.62} h={0.12} col={INK} bg={RED} p={[0.22, 0.76, 0.08]} s={pop(tt, 3.7)} op={cl((tt - 3.6) / 0.2)} />
  </>;
}}</Scene3D>;
