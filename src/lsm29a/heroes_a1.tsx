// lsm29a · componentes únicos 1-6 (kit h3d + tg: la mesa de Thanksgiving en maqueta, cámara que orbita en curva).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, Dots, Fork, Glass, OakChair, Plate, Roll, Steam, Table, Turkey, checkTex, linenTex, paperTex } from "./tg";

const PI = Math.PI;

// ---- 0:23 · LA SERVILLETA: el tenedor baja al plato, la servilleta se dobla sola en dos y la silla se corre hacia atrás ----
export const HNapkinfold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.7}
  cam={{ at: [-0.22, 0.77, -0.12], at1: [-0.05, 0.8, -0.3], az: [0.45, 0.15], el: [0.55, 0.4], r: [0.5, 1.3], fov: 32 }}>{(tt) => {
  const fk = phys(tt, 0.4, 7, 0.5), fold = eio(tt, 1.0, 4.2), push = phys(tt, 3.0, 5, 0.75), lin = linenTex();
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.4} d={0.8} /></group>
    <group position={[0, 0.76, -0.12]}>
      <Plate r={0.13} />
      {/* comida a medio comer */}
      <mesh position={[-0.03, 0.025, 0.02]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.04, 16, 12]} /><meshStandardMaterial color="#efe7d2" roughness={0.6} /></mesh>
      <mesh position={[0.04, 0.02, -0.03]} scale={[1.4, 0.3, 1]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#9a5a26" roughness={0.5} /></mesh>
      <mesh position={[0.03, 0.02, 0.05]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.022, 14, 10]} /><meshPhysicalMaterial color="#8e1f2a" roughness={0.2} clearcoat={1} /></mesh>
      {/* el tenedor (grande, de plata) que baja y queda cruzado en el plato */}
      <group position={[0.05, 0.02 + (1 - cl(fk)) * 0.2, 0.0]} rotation={[(1 - cl(fk)) * -0.7, 0.7, 0]}>
        <RBox s={[0.016, 0.005, 0.12]} r={0.003} p={[0, 0.003, 0.05]}>{M.chrome()}</RBox>
        <RBox s={[0.034, 0.004, 0.03]} r={0.004} p={[0, 0.003, -0.02]}>{M.chrome()}</RBox>
        {[-0.012, -0.004, 0.004, 0.012].map((x) => <RBox key={x} s={[0.005, 0.004, 0.05]} r={0.0015} p={[x, 0.003, -0.058]}>{M.chrome()}</RBox>)}
      </group>
      <Glass p={[0.2, 0, -0.12]} lv={0.5} />
    </group>
    {/* la servilleta de tela gruesa: la mitad de adelante gira por el doblez y cae sobre la otra */}
    <group position={[lerp(-0.27, -0.01, eio(tt, 4.3, 5.3)), 0.768 + 0.03 * eio(tt, 4.3, 4.8), lerp(-0.1, -0.06, eio(tt, 4.3, 5.3))]}>
      <mesh position={[0, 0.003, -0.075]}><boxGeometry args={[0.22, 0.006, 0.15]} /><meshStandardMaterial color="#8f2430" map={lin} roughness={0.95} /></mesh>
      <group position={[0, 0.006, 0]} rotation={[PI * 0.985 * fold, 0, 0]}>
        <mesh position={[0, 0.003, 0.075]}><boxGeometry args={[0.22, 0.006, 0.15]} /><meshStandardMaterial color="#a32c38" map={lin} roughness={0.95} /></mesh>
        <mesh position={[0, 0.003, 0.151]}><boxGeometry args={[0.22, 0.007, 0.004]} /><meshStandardMaterial color="#d9b25a" roughness={0.6} /></mesh>
      </group>
    </group>
    {/* la silla se arrastra hacia atrás, con su sombra en el piso */}
    <group position={[0.05, 0, -0.55 - 0.35 * cl(push)]} rotation={[0, -0.25 * cl(push), 0]}><OakChair /></group>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.05, 0.002, -0.62 - 0.35 * cl(push)]}><circleGeometry args={[0.3, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.28} depthWrite={false} /></mesh>
    {[-0.5].map((x) => <group key={x} position={[x, 0.76, -0.15]}><Plate r={0.11} /></group>)}
  </>;
}}</Scene3D>;

// ---- 2:20 · SIETE PALABRAS: siete fichas de madera caen de golpe en fila, el contador llega a 7 en un suspiro ----
const WORDS = ["BLESS", "THIS", "FOOD", "AMEN", "AND", "SIT", "DOWN"];
export const HSevenwords: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.05, 0.05], az: [-0.2, 0.15], el: [0.72, 0.62], r: [1.5, 1.32], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.8} x={960} y={975} txt="SEVEN WORDS. I COUNTED." col={AMB} size={40} />}>{(tt) => {
  const n = WORDS.filter((_, i) => tt > 0.5 + i * 0.5).length;
  return <>
    <group position={[0, 0.0, 0]}><mesh position={[0, 0.006, 0]} receiveShadow><boxGeometry args={[1.5, 0.012, 0.6]} /><meshStandardMaterial map={linenTex()} roughness={0.85} /></mesh></group>
    {WORDS.map((w, i) => { const a = 0.5 + i * 0.5, k = phys(tt, a, 9, 0.35), x = -0.54 + i * 0.18; return tt > a - 0.05 && <group key={w} position={[x, 0.034 + (1 - cl(k)) * 0.4, -0.05]} rotation={[-0.25 * (1 - cl(k)), 0.05 * (rn(i, 2) - 0.5), 0]}>
      <RBox s={[0.17, 0.045, 0.1]} r={0.008}><meshStandardMaterial map={tex.wood(1, 1, [196, 150, 96])} roughness={0.55} /></RBox>
      <mesh position={[0, 0.0231, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.07]} /><meshStandardMaterial map={paperTex("w" + w, [w], { w: 256, h: 120, bg: "#c99a60", ink: "#3a2412", font: "900" })} roughness={0.6} transparent /></mesh>
    </group>; })}
    {/* el contador de la caja: 0 → 7 */}
    <group position={[0.0, 0.085, 0.24]} rotation={[-0.62, 0, 0]} scale={1 + 0.06 * Math.max(0, 1 - ((tt - 0.5) % 0.5) / 0.12) * (tt > 0.5 && tt < 3.7 ? 1 : 0)}><RBox s={[0.26, 0.16, 0.12]} r={0.016}>{M.brass()}</RBox><RBox s={[0.2, 0.12, 0.01]} r={0.006} p={[0, 0, 0.058]}><meshStandardMaterial color="#1b1712" roughness={0.5} /></RBox><DigitDrum v={Math.min(7, n)} p={[0, 0.0, 0.064]} r={0.06} w={0.1} />{[-1, 1].map((k) => <RBox key={k} s={[0.26, 0.05, 0.01]} r={0.004} p={[0, k * 0.058, 0.13]}>{M.brass()}</RBox>)}</group>
  </>;
}}</Scene3D>;

// ---- 3:07 · TRES RENGLONES: la tarjeta de la gracia se escribe sola, un renglón por cosa ----
const LN = ["For the food, and the hands", "For the people at this table", "For the ones who aren't"];
export const HThreelines: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.6, 1.8, 1.0]}
  cam={{ at: [0, 0.02, 0.04], at1: [0.0, 0.02, 0.01], az: [0.2, -0.1], el: [0.95, 1.02], r: [0.9, 0.84], fov: 30 }} warm={0.7}>{(tt) => {
  const n = [1.0, 2.6, 4.2].filter((a) => tt > a).length, wr = (tt - [1.0, 2.6, 4.2][Math.max(0, n - 1)]) / 1.4;
  const px = lerp(-0.1, 0.1, cl(wr)), py = [-0.045, 0, 0.045][Math.max(0, n - 1)];
  return <>
    <mesh position={[0, 0.0135, 0]} rotation={[-PI / 2, 0, 0.04]} castShadow receiveShadow><planeGeometry args={[0.3, 0.18]} /><meshStandardMaterial map={paperTex("grace" + n, [...LN.slice(0, n), ...Array(3 - n).fill(" ")], { w: 640, h: 384, rule: true, ink: "#14100c", bg: "#efe6d0", font: "italic 800" })} roughness={0.8} /></mesh>
    {/* el lápiz que sigue el renglón */}
    {tt < 5.8 && <group position={[px + 0.03, 0.03, py + 0.045]} rotation={[0.4, 0.6, 0.9]}><mesh><cylinderGeometry args={[0.005, 0.005, 0.07, 6]} /><meshStandardMaterial color="#e8b92c" roughness={0.5} /></mesh><mesh position={[0, -0.042, 0]}><coneGeometry args={[0.005, 0.014, 6]} /><meshStandardMaterial color="#e3c8a0" /></mesh></group>}
    {/* con cada renglón llega su cosa: el pan, las tarjetas de la mesa, la vela por los que no están */}
    {(() => { const k1 = phys(tt, 1.0, 8, 0.45), k2 = phys(tt, 2.6, 8, 0.45), k3 = phys(tt, 4.2, 8, 0.45); return <>
      <group position={[-0.25, 0.0 + (1 - cl(k1)) * 0.1, 0.03]} visible={tt > 0.95} scale={1.35}><Roll s={1.1} p={[0, 0.02, 0]} /><Roll s={0.9} p={[0.035, 0.015, 0.02]} /></group>
      <group position={[0.25, 0.0 + (1 - cl(k2)) * 0.1, -0.04]} visible={tt > 2.55} scale={3.6}>{[0, 1].map((j) => <mesh key={j} position={[j * 0.03 - 0.015, 0.012, 0]} rotation={[0, 0.2 - j * 0.4, 0]}><boxGeometry args={[0.025, 0.022, 0.002]} /><meshStandardMaterial color="#f3ead6" roughness={0.8} /></mesh>)}</group>
      <group position={[0.25, 0.0 + (1 - cl(k3)) * 0.1, 0.06]} visible={tt > 4.15} scale={1.95}><Candle tt={tt} on={eio(tt, 4.6, 5.2)} h={0.05} /></group>
    </>; })()}
  </>;
}}</Scene3D>;

// ---- 3:27 · PAPEL Y REPASADOR: cae el papel aluminio sobre el pavo, después el repasador; el reloj marca 40 minutos y el vapor sigue ----
export const HFoiltowel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" warm={0.85}
  cam={{ at: [0.08, 0.1, 0.06], az: [0.45, 0.15], el: [0.34, 0.28], r: [1.0, 0.85], fov: 30 }} over={(tt) => <Tag tt={tt} at={3.0} x={1300} y={260} txt="HOLDS 40 MIN" col={AMB} size={44} />}>{(tt) => {
  const foil = phys(tt, 1.2, 8, 0.45), towel = phys(tt, 2.3, 7, 0.45), clk = eio(tt, 3.0, 5.6);
  return <>
    <Turkey p={[0, 0, 0]} s={1.0} />
    {/* la carpa de papel aluminio */}
    <group position={[0, 0.06 + (1 - cl(foil)) * 0.35, 0]} visible={tt > 1.1} rotation={[0, 0.4, 0]}>
      <mesh scale={[1.95, 1.05, 1.45]}><sphereGeometry args={[0.12, 48, 18, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#d3d7da" metalness={0.75} roughness={0.38} bumpMap={tex.text("crinkle", 256, 256, (g) => { g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 260; i++) { g.strokeStyle = i % 2 ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)"; g.lineWidth = 1 + (i % 3); g.beginPath(); const x = (i * 97) % 256, y = (i * 53) % 256; g.moveTo(x, y); g.lineTo(x + ((i * 37) % 60) - 30, y + ((i * 71) % 60) - 30); g.stroke(); } })} bumpScale={6} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* el repasador encima */}
    <group position={[0, 0.17 + (1 - cl(towel)) * 0.35, 0]} visible={tt > 2.2} rotation={[0, 0.3, 0]}>
      <mesh scale={[2.05, 0.5, 1.55]} position={[0, -0.035, 0]}><sphereGeometry args={[0.12, 40, 16, 0, PI * 2, 0, PI / 2.4]} /><meshStandardMaterial map={checkTex()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    </group>
    <Steam p={[0, 0.18, -0.06]} tt={tt} on={2.4 * (1 - 0.3 * cl(foil))} n={40} w={0.3} hgt={0.7} sz={3} />
    {/* el reloj de cocina: la aguja barre 40 minutos */}
    <group position={[0.3, 0.1, 0.22]} rotation={[0, 0.35, 0]}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.09, 0.09, 0.03, 40]} />{M.plastic({ col: "#c9352b" })}</mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.078, 40]} /><meshStandardMaterial map={tex.text("timer40", 256, 256, (g) => { g.fillStyle = "#f7f3ea"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#222"; g.font = "700 30px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2 - PI / 2; g.fillText(String(i * 5), 128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); } })} roughness={0.4} /></mesh>
      {/* sector de 40 minutos que se llena */}
      <mesh position={[0, 0, 0.0175]} rotation={[0, 0, PI / 2]}><circleGeometry args={[0.06, 40, 0, -Math.max(0.01, clk * PI * 2 * (40 / 60))]} /><meshBasicMaterial color="#ffb347" transparent opacity={0.55} /></mesh>
      <mesh position={[0, 0, 0.02]} rotation={[0, 0, -clk * PI * 2 * (40 / 60)]}><boxGeometry args={[0.005, 0.07, 0.003]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 4:43 · LA SILLA QUE QUEDA: la silla de roble en la cabecera, una vela blanca baja frente a ella y se enciende ----
export const HEmptychair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#2b1d14" warm={0.75}
  cam={{ at: [0.6, 0.82, 0], at1: [0.85, 0.9, 0], az: [-1.3, -1.45], el: [0.16, 0.08], r: [1.1, 0.42], fov: 32 }}>{(tt) => {
  const c = phys(tt, 0.8, 6, 0.6), lit = eio(tt, 2.6, 3.4);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.6} d={0.8} /></group>
    <group position={[1.05, 0, 0]} rotation={[0, -PI / 2, 0]}><OakChair /></group>
    {[-0.5, 0.0].map((x) => [-1, 1].map((k) => <group key={x + "" + k} position={[x, 0.76, k * 0.22]}><Plate r={0.1} /></group>))}
    <group position={[0.62, 0.76, 0]}><Plate r={0.11} /></group>
    {/* la vela baja con su peso y se prende */}
    <group position={[0.62, 0.776 + (1 - cl(c)) * 0.25, 0]}><Candle tt={tt} on={lit} h={0.2} /></group>
    <pointLight position={[0.62, 1.0, 0]} intensity={0.45 * lit} distance={1.6} decay={2} color="#ffb860" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    {/* el fósforo */}
    {tt > 2.0 && tt < 3.8 && <group position={[0.58 + 0.04 * eio(tt, 2.0, 2.6), 0.95 - 0.02 * eio(tt, 2.0, 2.6), 0.05]} rotation={[0, 0, 0.9]}>
      <mesh><cylinderGeometry args={[0.0022, 0.0022, 0.06, 6]} /><meshStandardMaterial color="#d8b47a" /></mesh>
      <mesh position={[0, 0.034, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.006, 10, 8]} />{M.glow({ col: "#ffcf6a", op: 1 - eio(tt, 3.2, 3.8) })}</mesh>
    </group>}
    <Dots n={24} r={0.003} col="#ffe2a8" glow pos={(i) => [0.62 + (rn(i, 2) - 0.5) * 0.5, 0.9 + ((tt * 0.04 + rn(i, 3)) % 1) * 0.5, (rn(i, 4) - 0.5) * 0.5]} op={() => 0.35 * lit} />
  </>;
}}</Scene3D>;

// ---- 5:07 · 1972: el pavo se resbala de la fuente, rebota en el linóleo a cuadros, salpica la salsa… y vuelve a la fuente ----
const lino = () => tex.text("lino", 256, 256, (g) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#e9dcc0" : "#a8352d"; g.fillRect(c * 32, r * 32, 32, 32); } });
export const HTurkeyfloor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none"
  cam={{ at: [0, 0.12, 0], az: [-0.5, 0.25], el: [0.5, 0.42], r: [1.15, 0.95], fov: 30 }} over={(tt) => <Tag tt={tt} at={2.2} x={1400} y={250} txt="AND SERVED IT ANYWAY" col={AMB} size={36} />}>{(tt) => {
  const f = phys(tt, 0.4, 6, 0.28), up = eio(tt, 3.2, 4.6), sp = eio(tt, 1.0, 1.6);
  const y = lerp(0.62 - 0.6 * cl(f) - 0.04 * Math.max(0, Math.sin(PI * cl((tt - 1.0) / 0.6))), 0.12, up), x = lerp(-0.05, 0.02, cl(f)), rz = lerp((1 - cl(f)) * 0.8 + 0.4 * cl(f), 0, up);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 3]} /><meshStandardMaterial map={(() => { const tx = lino(); tx.repeat.set(4, 4); return tx; })()} roughness={0.35} /></mesh>
    {/* charco de salsa que se abre al golpe */}
    <mesh position={[0.02, 0.002, 0.05]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, sp) * (1 - 0.3 * up)}><circleGeometry args={[0.3, 28]} /><meshPhysicalMaterial color="#6a3a16" roughness={0.1} clearcoat={1} transparent opacity={0.9} /></mesh>
    <Dots n={26} r={0.022} col="#6a3a16" pos={(i) => { const a = rn(i, 2) * PI * 2, k = cl((tt - 1.0) / 0.5); return [Math.cos(a) * 0.3 * k, 0.12 * Math.sin(PI * k) * rn(i, 3) + 0.004, Math.sin(a) * 0.25 * k + 0.05]; }} op={(i) => (tt > 1.0 ? 0.9 : 0)} />
    <group position={[x, y, 0]} rotation={[0, 0.4, rz]}><Turkey platter={false} s={1.3} /></group>
    {/* la fuente vuelve a buscarlo */}
    <group position={[0.02, 0.12 * up + 0.004, 0]} visible={up > 0.02}><mesh scale={[1.5, 1, 1.05]}><cylinderGeometry args={[0.2, 0.17, 0.014, 48]} />{M.porcelain()}</mesh></group>
    <Roll p={[-0.35, 0.02, 0.2]} /><Roll p={[0.38, 0.02, -0.15]} s={0.9} />
  </>;
}}</Scene3D>;
