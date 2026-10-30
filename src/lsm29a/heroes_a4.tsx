// lsm29a · componentes únicos 19-24 (la ventisca del 36, la canasta del pan, la foto de la mesa, el borde oscuro, los platos de cera).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Basket, Dots, Pie, Plate, Roll, Steam, Table, checkTex, linenTex, paperTex } from "./tg";

const PI = Math.PI;

// ---- 14:26 · EL ALAMBRE DEL CERCO: ventisca de 1936; tres vacas avanzan en fila siguiendo el alambre del cerco entre la nieve ----
const Cow: React.FC<{ step: number }> = ({ step }) => <group>
  <mesh position={[0, 0.12, 0]} scale={[1.6, 0.9, 0.85]} castShadow><sphereGeometry args={[0.07, 24, 16]} /><meshStandardMaterial color="#5a3a26" roughness={0.9} /></mesh>
  <mesh position={[-0.05, 0.13, 0.05]} scale={[1, 0.8, 0.3]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#efeae0" roughness={0.9} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[0.14, 0.19, k * 0.025]} rotation={[0, 0, -0.6]}><coneGeometry args={[0.006, 0.025, 6]} /><meshStandardMaterial color="#d8cbb0" /></mesh>)}
  <mesh position={[0.02, 0.15, 0.055]} scale={[1, 0.8, 0.2]}><sphereGeometry args={[0.04, 14, 10]} /><meshStandardMaterial color="#efeae0" roughness={0.8} /></mesh>
  <mesh position={[0.12, 0.15, 0]} scale={[1.2, 0.85, 0.8]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#5a3a26" roughness={0.9} /></mesh>
  <mesh position={[0.155, 0.14, 0]} scale={[0.7, 0.6, 0.8]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color="#e9d6c4" roughness={0.8} /></mesh>
  {[[-0.06, 0.03], [-0.06, -0.03], [0.06, 0.03], [0.06, -0.03]].map(([x, z], i) => <mesh key={i} position={[x, 0.04, z]} rotation={[0, 0, 0.3 * Math.sin(step * PI * 2 + (i % 2) * PI)]}><cylinderGeometry args={[0.009, 0.008, 0.08, 6]} /><meshStandardMaterial color="#2a2522" roughness={0.8} /></mesh>)}
  {/* nieve sobre el lomo */}
  <mesh position={[0, 0.175, 0]} scale={[1.4, 0.25, 0.7]}><sphereGeometry args={[0.06, 14, 8]} /><meshStandardMaterial color="#f6f8fb" roughness={0.9} /></mesh>
</group>;
export const HFencewire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#aeb6bf" warm={0.7}
  cam={{ at: [-0.1, 0.14, 0], at1: [0.0, 0.14, 0], az: [0.7, 0.5], el: [0.18, 0.14], r: [1.35, 1.15], fov: 32 }} over={(tt) => <Tag tt={tt} at={3.4} x={1400} y={860} txt="BLIZZARD OF 1936" col="#ffffff" size={38} />}>{(tt) => {
  const walk = tt * 0.04, pull = Math.sin(tt * 1.6) * 0.006;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#eef2f6" roughness={0.95} /></mesh>
    {/* los postes y el alambre que se pierden en la nieve */}
    {Array.from({ length: 11 }, (_, i) => { const x = -1.2 + i * 0.3; return <group key={i}><mesh position={[x, 0.13, -0.08]} castShadow><cylinderGeometry args={[0.012, 0.015, 0.26, 8]} />{M.wood({ base: [96, 72, 52], rx: 1 })}</mesh></group>; })}
    {[0.2, 0.12].map((y) => <mesh key={y} position={[0.3, y, -0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0018, 0.0018, 3.0, 6]} />{M.steel({ col: "#5c6064" })}</mesh>)}
    {[0, 1, 2].map((i) => <group key={i} position={[-0.75 + i * 0.3 + walk, 0, 0.04]}><Cow step={tt * 0.9 + i * 0.3} /></group>)}
    {/* la mano con guante de lana agarrada al alambre, en primer plano, que tira */}
    <group position={[0.36, 0.2 + pull, -0.04]} rotation={[0, 0, PI / 2]} scale={1.15}>
      <mesh scale={[0.9, 1, 1.1]} castShadow><sphereGeometry args={[0.04, 18, 14]} /><meshStandardMaterial color="#8a2a26" roughness={0.95} /></mesh>
      {[0, 1, 2, 3].map((f) => <mesh key={f} position={[-0.012 + f * 0.012, 0.022, 0.03]} rotation={[0.9, 0, 0]}><capsuleGeometry args={[0.009, 0.025, 4, 8]} /><meshStandardMaterial color="#8a2a26" roughness={0.95} /></mesh>)}
      <mesh position={[0.03, -0.09, 0.0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.032, 0.045, 0.18, 14]} /><meshStandardMaterial color="#5a4632" roughness={0.9} /></mesh>
    </group>
    {/* el copo que cruza de costado */}
    <Dots n={260} r={0.0028} col="#ffffff" pos={(i) => { const ph = (tt * (0.5 + rn(i, 2) * 0.3) + rn(i, 3)) % 1; return [lerp(-1.4, 1.6, ph), 0.7 * rn(i, 4) - 0.3 * ph + 0.05, (rn(i, 5) - 0.5) * 1.6]; }} op={0.85} />
    <mesh position={[0, 0.5, -1.4]}><planeGeometry args={[8, 2]} /><meshBasicMaterial color="#c9d0d8" transparent opacity={0.7} /></mesh>
  </>;
}}</Scene3D>;

// teléfono: tabla oscura con la pantalla que se prende un instante
const Phone: React.FC<{ glow: number; c?: string }> = ({ glow, c = "#1c1d20" }) => <group>
  <RBox s={[0.07, 0.008, 0.14]} r={0.004}><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={1} /></RBox>
  <mesh position={[0, 0.0042, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.062, 0.128]} /><meshStandardMaterial color="#0d1218" emissive="#9cc4ff" emissiveIntensity={2.2 * glow} roughness={0.1} /></mesh>
</group>;

// ---- 14:59 · LA CANASTA DEL PAN: junto a la puerta, cinco teléfonos caen de a uno adentro de la canasta forrada con servilleta ----
export const HPhonebasket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.82, 0], az: [-0.45, 0.2], el: [0.75, 0.68], r: [0.8, 0.62], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.8} x={1420} y={300} txt="AT THE TABLE, IT'S FACES" col={AMB} size={34} />}>{(tt) => <>
    {/* mesita de la entrada */}
    <RBox s={[0.7, 0.03, 0.4]} r={0.008} p={[0, 0.735, 0]}>{M.wood({ base: [128, 82, 44] })}</RBox>
    {[[-0.32, -0.17], [0.32, -0.17], [-0.32, 0.17], [0.32, 0.17]].map(([x, z], i) => <mesh key={i} position={[x, 0.36, z]}><cylinderGeometry args={[0.015, 0.015, 0.72, 8]} />{M.wood({ base: [110, 70, 40] })}</mesh>)}
    <Basket p={[0, 0.75, 0]} s={1.1} />
    {Array.from({ length: 5 }, (_, i) => { const a = 0.5 + i * 0.55, k = phys(tt, a, 8, 0.4); return tt > a - 0.05 && <group key={i} position={[(rn(i, 2) - 0.5) * 0.12, 0.77 + i * 0.012 + (1 - cl(k)) * 0.4, (rn(i, 3) - 0.5) * 0.06]} rotation={[0.15 * (rn(i, 4) - 0.5) + (1 - cl(k)) * 0.8, rn(i, 5) * 2, 0.1 * (rn(i, 6) - 0.5)]}>
      <Phone glow={cl(k) < 0.9 ? 1 : Math.max(0, 1 - (tt - a - 0.25) * 3)} c={["#1c1d20", "#e9e5dc", "#2a3b52", "#1c1d20", "#7a2a2a"][i]} />
    </group>; })}
  </>}</Scene3D>;

// la foto de la mesa entera, pintada como copia de papel que se va revelando
const photoTex = () => tex.text("tablephoto", 512, 400, (g) => {
  g.fillStyle = "#f4f2ec"; g.fillRect(0, 0, 512, 400); g.fillStyle = "#3e3226"; g.fillRect(24, 24, 464, 300);
  g.fillStyle = "#e8e1d0"; g.fillRect(60, 170, 392, 90);
  for (let i = 0; i < 6; i++) { g.fillStyle = "#fbf9f4"; g.beginPath(); g.ellipse(90 + i * 66, 200, 22, 10, 0, 0, 6.3); g.fill(); g.beginPath(); g.ellipse(90 + i * 66, 238, 22, 10, 0, 0, 6.3); g.fill(); }
  for (let i = 0; i < 12; i++) { const x = 70 + (i % 6) * 70, y = i < 6 ? 130 : 290; g.fillStyle = ["#a8352d", "#4f78b0", "#6f9a5a", "#d8a24a", "#7a5a8a", "#c25a4a"][i % 6]; g.beginPath(); g.ellipse(x, y, 22, 32, 0, 0, 6.3); g.fill(); g.fillStyle = "#e6c3a5"; g.beginPath(); g.arc(x, y - 44, 15, 0, 6.3); g.fill(); }
  g.fillStyle = "#b0611f"; g.beginPath(); g.ellipse(256, 214, 40, 24, 0, 0, 6.3); g.fill();
});
// ---- 15:17 · UNA FOTO DE LA MESA ENTERA: sale la copia de la cámara instantánea y se revela de a poco sobre el mantel ----
export const HPolaroid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [-0.06, 0.8, -0.02], at1: [-0.02, 0.78, 0.0], az: [0.25, -0.05], el: [0.75, 1.0], r: [1.05, 0.78], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.8} x={960} y={970} txt="THEN BACK IN THE BASKET" col={AMB} size={34} />}>{(tt) => {
  const out = eio(tt, 0.4, 1.4), drop = eio(tt, 1.5, 2.2), dev = eio(tt, 2.0, 5.0);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.2} d={0.8} /></group>
    {/* la cámara instantánea */}
    <mesh position={[-0.24, 0.86, -0.04]}><sphereGeometry args={[0.05 + 0.25 * eio(tt, 0.2, 0.32) * (1 - eio(tt, 0.32, 0.7)), 18, 12]} />{M.glow({ col: "#ffffff", op: 0.9 * eio(tt, 0.2, 0.32) * (1 - eio(tt, 0.32, 0.7)) })}</mesh>
    <group position={[-0.24, 0.82, -0.12]} rotation={[0, 0.3, 0]} scale={1.8}>
      <RBox s={[0.16, 0.06, 0.12]} r={0.012}>{M.plastic({ col: "#e9e5dc" })}</RBox>
      <mesh position={[0, 0.0, 0.062]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 30]} />{M.plastic({ col: "#1a1a1a" })}</mesh>
      <mesh position={[0, 0.0, 0.068]}><circleGeometry args={[0.02, 30]} />{M.glass({ op: 0.7, col: "#24303c" })}</mesh>
      {[["#c4302a", -0.05], ["#e8a23a", -0.03], ["#e8d43a", -0.01], ["#4caa4c", 0.01], ["#3c78c8", 0.03]].map(([c, x], i) => <mesh key={i} position={[x as number, 0.031, 0.04]}><boxGeometry args={[0.018, 0.002, 0.03]} /><meshStandardMaterial color={c as string} /></mesh>)}
    </group>
    {/* la copia: sale de la ranura y cae sobre el mantel */}
    <group position={[lerp(-0.24, 0.08, drop), 0.775 + (1 - drop) * 0.08, lerp(-0.12 + 0.2 * out, 0.06, drop)]} scale={1.25} rotation={[-PI / 2 * (1 - drop) * 0, lerp(0.3, -0.15, drop), 0]}>
      <mesh rotation={[-PI / 2, 0, 0]} castShadow><planeGeometry args={[0.2, 0.16]} /><meshStandardMaterial map={photoTex()} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      {/* el gris del revelado que se va yendo */}
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, -0.01]}><planeGeometry args={[0.18, 0.12]} /><meshBasicMaterial color="#5a5c5a" transparent opacity={0.95 * (1 - dev)} /></mesh>
    </group>
    <Pie p={[0.3, 0.76, -0.12]} />
  </>;
}}</Scene3D>;

// ---- 16:01 · EL BORDE OSCURO: el borde del pastel se tuesta de más… y el cuchillo igual corta la porción y la sirve ----
export const HDarkcrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none"
  cam={{ at: [0, 0.8, 0], az: [-0.3, 0.25], el: [0.5, 0.42], r: [0.8, 0.68], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.6} x={1400} y={300} txt="SHE SERVED IT" col={AMB} size={42} />}>{(tt) => {
  const dark = eio(tt, 0.4, 1.8), cut = eio(tt, 2.0, 2.8), lift = eio(tt, 3.0, 4.2);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.2} d={0.8} /></group>
    <Pie p={[0, 0.76, 0]} crust={dark} cut={lift > 0.02 ? 1 : 0} />
    {/* la porción que sale hacia el plato */}
    {lift > 0.02 && <group position={[lerp(0.05, 0.3, lift), 0.762 + 0.08 * Math.sin(PI * lift), lerp(0.05, 0.12, lift)]} rotation={[0, PI / 8 - PI / 8, 0]}>
      <mesh rotation={[0, -PI / 8 + PI / 2, 0]}><cylinderGeometry args={[0.125, 0.11, 0.035, 12, 1, false, 0, PI / 4]} /><meshStandardMaterial color="#c4702a" roughness={0.45} side={THREE.DoubleSide} /></mesh>
    </group>}
    <group position={[0.3, 0.76, 0.12]}><Plate r={0.1} /></group>
    {/* el cuchillo */}
    <group position={[0.06, 0.82 - 0.03 * cut + 0.06 * lift, 0.06 - 0.06 * cut]} rotation={[0, -0.7, 0.2]}>
      <RBox s={[0.16, 0.003, 0.025]} r={0.001} p={[0.05, 0, 0]}>{M.steel()}</RBox>
      <RBox s={[0.09, 0.014, 0.02]} r={0.005} p={[-0.075, 0, 0]}>{M.wood({ base: [96, 60, 34], rx: 1 })}</RBox>
    </group>
    {/* el humito del borde tostado */}
    <Steam p={[0.08, 0.8, -0.05]} tt={tt} on={dark * (1 - 0.6 * cut)} n={18} w={0.2} hgt={0.26} />
  </>;
}}</Scene3D>;

// ---- 17:40 · ENVUELTO EN PAPEL ENCERADO: el plato se arma de a uno (pavo, relleno, arándano, dos bollos, porción de pastel), lo envuelve el papel y lleva su nombre ----
export const HWaxedplate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" warm={0.85}
  cam={{ at: [0, 0.05, 0.02], az: [0.35, -0.05], el: [0.75, 0.62], r: [0.75, 0.62], fov: 30 }}>{(tt) => {
  const it = (i: number) => phys(tt, 0.4 + i * 0.45, 8, 0.45), tape = phys(tt, 5.0, 7, 0.5);
  const fall = (i: number) => (1 - cl(it(i))) * 0.25;
  return <>
    <Plate r={0.13} />
    <mesh position={[-0.04, 0.02 + fall(0), -0.02]} rotation={[0, 0.4, 0]} visible={tt > 0.35}><boxGeometry args={[0.09, 0.012, 0.06]} /><meshStandardMaterial color="#e9d9b8" roughness={0.6} /></mesh>
    <mesh position={[0.05, 0.03 + fall(1), -0.03]} scale={[1, 0.6, 1]} visible={tt > 0.8}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#b88a4e" roughness={0.7} /></mesh>
    <mesh position={[0.05, 0.022 + fall(2), 0.05]} scale={[1, 0.5, 1]} visible={tt > 1.25}><sphereGeometry args={[0.022, 14, 10]} /><meshPhysicalMaterial color="#8e1f2a" roughness={0.15} clearcoat={1} /></mesh>
    <group visible={tt > 1.7}><Roll p={[-0.06, 0.03 + fall(3), 0.05]} s={0.8} /><Roll p={[-0.01, 0.03 + fall(3), 0.07]} s={0.75} /></group>
    <mesh position={[0.0, 0.024 + fall(4), 0.0]} rotation={[0, 1.2, 0]} visible={tt > 2.15}><cylinderGeometry args={[0.07, 0.07, 0.02, 10, 1, false, 0, PI / 6]} /><meshStandardMaterial color="#c4702a" roughness={0.45} side={THREE.DoubleSide} /></mesh>
    {/* el papel encerado: la hoja baja sobre el plato y sus cuatro alas se doblan hacia abajo, una por una */}
    <group position={[0, 0.075 + 0.2 * (1 - eio(tt, 2.9, 3.4)), 0]} visible={tt > 2.85}>
      <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.24, 0.24]} /><meshPhysicalMaterial color="#efe3bf" roughness={0.45} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      {[0, 1, 2, 3].map((i) => { const f = eio(tt, 3.4 + i * 0.25, 3.9 + i * 0.25); return <group key={i} rotation={[0, i * PI / 2, 0]}><group position={[0, 0, 0.12]} rotation={[PI / 2 * 0.92 * f, 0, 0]}>
        <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0, 0.035]}><planeGeometry args={[0.24, 0.07]} /><meshPhysicalMaterial color="#dccb98" roughness={0.5} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>
      </group></group>; })}
      {/* el hilo rojo que lo cierra en cruz */}
      {[0, 1].map((j) => <mesh key={j} position={[0, 0.003, 0]} rotation={[0, j * PI / 2, 0]} scale={[1, 1, Math.max(0.01, eio(tt, 4.4 + j * 0.2, 4.8 + j * 0.2))]}><boxGeometry args={[0.018, 0.012, 0.25]} /><meshStandardMaterial color="#b3261e" roughness={0.6} /></mesh>)}
    </group>
    {/* la etiqueta con el nombre, grande, atada al hilo y mirando a cámara */}
    <group position={[0.02, 0.09 + (1 - cl(tape)) * 0.15, 0.06]} rotation={[-0.75, 0, 0.06]} visible={tt > 4.95}>
      <mesh><boxGeometry args={[0.15, 0.055, 0.002]} /><meshStandardMaterial map={paperTex("tagEdna", ["Edna Mae"], { w: 640, h: 230, bg: "#f1e6c4", ink: "#2c2a33" })} roughness={0.8} /></mesh>
      <mesh position={[-0.064, 0.016, 0.002]}><torusGeometry args={[0.006, 0.0015, 6, 14]} />{M.brass()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 18:45 · 34 PLATOS: la fila de platos con papel aluminio crece por todo el mostrador; el contador llega a 34 ----
export const HThirtyfour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="tile"
  cam={{ at: [0.35, 0.95, -0.35], at1: [0.45, 0.95, -0.35], az: [0.1, 0.25], el: [1.0, 0.9], r: [2.2, 1.9], fov: 30 }} over={(tt) => <Tag tt={tt} at={4.2} x={1460} y={300} txt="LAST YEAR" col={AMB} size={48} />}>{(tt) => {
  const N = 34, at = (i: number) => 0.4 + i * 0.12, n = Array.from({ length: N }, (_, i) => i).filter((i) => tt > at(i)).length;
  return <>
    <RBox s={[3.0, 0.9, 0.6]} r={0.01} p={[0.5, 0.45, -0.4]}><meshStandardMaterial map={tex.counter(4, 1)} roughness={0.6} /></RBox>
    {Array.from({ length: N }, (_, i) => { const k = phys(tt, at(i), 9, 0.5), row = i % 2, x = -0.9 + Math.floor(i / 2) * 0.165; return tt > at(i) - 0.05 && <group key={i} position={[x, 0.9 + (1 - cl(k)) * 0.2, -0.53 + row * 0.24]} scale={Math.max(0.001, 0.75 + 0.35 * cl(k))}>
      <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.075, 0.065, 0.01, 24]} /><meshStandardMaterial color="#f6f4ee" roughness={0.6} /></mesh>
      <mesh position={[0, 0.018, 0]} scale={[1, 0.32, 1]} rotation={[0, i * 0.9, 0]}><sphereGeometry args={[0.072, 11, 5, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#cfd4d8" metalness={0.75} roughness={0.42} flatShading /></mesh>
      <mesh position={[0, 0.0405, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.07, 0.016]} /><meshStandardMaterial color="#e9dcb2" roughness={0.8} /></mesh>
    </group>; })}
    <group position={[0.45, 1.06, -0.02]} rotation={[-0.62, 0, 0]} scale={3.0}>
      <RBox s={[0.17, 0.1, 0.08]} r={0.012}>{M.brass()}</RBox><RBox s={[0.14, 0.075, 0.01]} r={0.005} p={[0, 0, 0.038]}><meshStandardMaterial color="#1b1712" roughness={0.5} /></RBox>
      <DigitDrum v={Math.floor(n / 10)} p={[-0.028, 0, 0.042]} r={0.032} w={0.045} /><DigitDrum v={n % 10} p={[0.028, 0, 0.042]} r={0.032} w={0.045} />{[-1, 1].map((k) => <RBox key={k} s={[0.17, 0.03, 0.006]} r={0.003} p={[0, k * 0.031, 0.077]}>{M.brass()}</RBox>)}
    </group>
  </>;
}}</Scene3D>;
