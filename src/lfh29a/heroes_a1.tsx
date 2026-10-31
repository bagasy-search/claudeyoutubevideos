// lfh29a · componentes únicos 1-7 (caja verde contra la factura, tambor de precio, las 20 mulas, dos polvos, reloj de arena, estante alto, fila por la pata).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Ant, BoraxBox, Jar, Powder, SugarBowl } from "./lf";

const PI = Math.PI;

const billTex = () => tex.text("bill150", 384, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 384, 512); g.fillStyle = "#2a2622"; g.textAlign = "left";
  g.font = "700 30px Georgia"; g.fillText("PEST SERVICE", 30, 60); g.font = "20px Georgia";
  ["Inspection", "Spray, interior", "Spray, perimeter", "Return visit"].forEach((l, i) => { g.fillText(l, 30, 130 + i * 44); g.fillText("...........", 230, 130 + i * 44); });
  g.fillRect(30, 330, 324, 3); g.font = "900 72px Georgia"; g.fillStyle = "#b3271c"; g.fillText("$150", 120, 430);
});

// factura de papel: grilla de vértices que se arruga (puntas que se levantan + pliegues) según «crush»
const Bill: React.FC<{ crush: number }> = ({ crush }) => {
  const geo = React.useMemo(() => new THREE.PlaneGeometry(0.24, 0.32, 24, 32), []);
  const base = React.useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const a = geo.attributes.position.array as Float32Array;
  for (let i = 0; i < a.length; i += 3) {
    const x = base[i], y = base[i + 1], edge = Math.max(Math.abs(x) / 0.12, Math.abs(y) / 0.16);
    a[i + 2] = crush * (0.03 * Math.pow(edge, 3) + 0.007 * Math.sin(x * 90 + y * 40) * edge);
  }
  geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo} receiveShadow castShadow><meshStandardMaterial map={billTex()} roughness={0.85} side={2} /></mesh>;
};

// ---- 0:21 · LA FACTURA Y LA CAJA: la factura de $150 cae girando sobre la mesa; la caja verde de un dólar le cae encima, la aplasta y la arruga ----
export const HBill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.08, 0], at1: [0.02, 0.12, 0], az: [-0.4, 0.2], el: [0.62, 0.45], r: [0.95, 0.8], fov: 30 }}
>{(tt) => {
  const a = phys(tt, 0.0, 5, 0.5), b = phys(tt, 2.2, 9, 0.3), hit = eio(tt, 2.55, 2.9), sq = Math.sin(cl((tt - 2.55) * 4) * PI);
  return <>
    <group position={[-0.02, 0.003 + (1 - a) * 0.3, 0.02]} rotation={[-PI / 2 + (1 - cl(a)) * 0.8, 0, 0.35 + (1 - cl(a)) * 2.2]}><Bill crush={hit} /></group>
    <group position={[0.02, (1 - b) * 0.8 + 0.006, 0.02]} rotation={[0, -0.45 + (1 - cl(b)) * 0.6, (1 - cl(b)) * 0.25]} scale={[1 + 0.06 * sq, 1 - 0.08 * sq, 1]}><BoraxBox s={0.95} /><mesh position={[0.045, 0.06, 0.0335]}><circleGeometry args={[0.03, 32]} /><meshStandardMaterial map={tex.text("price1", 128, 128, (g) => { g.fillStyle = "#f2a73a"; g.beginPath(); g.arc(64, 64, 64, 0, 6.3); g.fill(); g.fillStyle = "#3a2410"; g.font = "900 70px Georgia"; g.textAlign = "center"; g.fillText("$1", 64, 88); })} roughness={0.6} /></mesh></group>
    {/* soplo de polvo al aterrizar */}
    {Array.from({ length: 40 }, (_, i) => { const k = cl((tt - 2.6) / 1.4), a2 = rn(i, 2) * 6.3; return <mesh key={i} visible={k > 0 && k < 1} position={[0.02 + Math.cos(a2) * (0.1 + 0.15 * k), 0.01 + 0.05 * Math.sin(k * PI) * rn(i, 3), 0.02 + Math.sin(a2) * (0.07 + 0.12 * k)]}><icosahedronGeometry args={[0.003, 0]} /><meshStandardMaterial color="#f4f0e4" transparent opacity={1 - k} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 0:39 · 39 CENTAVOS EN 1952: una caja registradora de bronce hace rodar sus tambores y frena con un golpe en 0·39 ----
export const HPricedrum: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.3, 0.6, 0.4]}
  cam={{ at: [0, 0.17, 0], az: [0.35, -0.05], el: [0.2, 0.12], r: [1.05, 0.78], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={190} txt="1952" col={AMB} size={84} />}>{(tt) => {
  const roll = eio(tt, 0.5, 3.2), bump = Math.sin(cl((tt - 3.2) * 5) * PI) * 0.006;
  return <>
    <RBox s={[0.42, 0.2, 0.3]} p={[0, 0.1, 0]} r={0.03}>{M.brass({ col: "#b88a3c" })}</RBox>
    <RBox s={[0.34, 0.12, 0.1]} p={[0, 0.25 + bump, -0.06]} r={0.02}>{M.brass({ col: "#c99a48" })}</RBox>
    <mesh position={[0, 0.25 + bump, -0.009]}><planeGeometry args={[0.3, 0.085]} /><meshStandardMaterial color="#14110d" /></mesh>
    <group position={[0, 0.25 + bump, 0.004]}>
      <DigitDrum v={0} p={[-0.1, 0, 0]} r={0.035} w={0.06} />
      <mesh position={[-0.05, -0.026, 0.035]}><sphereGeometry args={[0.007, 10, 8]} />{M.brass()}</mesh>
      <DigitDrum v={lerp(0, 13, roll) % 10} p={[0, 0, 0]} r={0.035} w={0.06} />
      <DigitDrum v={lerp(0, 39, roll) % 10} p={[0.08, 0, 0]} r={0.035} w={0.06} />
    </group>
    {/* persianas de bronce arriba y abajo: se lee una sola fila de dígitos */}
    {[1, -1].map((s) => <RBox key={s} s={[0.31, 0.03, 0.014]} p={[0, 0.25 + bump + s * 0.034, 0.045]} r={0.004}>{M.brass({ col: "#a87a32" })}</RBox>)}
    <mesh position={[0, 0.25 + bump, 0.052]}><planeGeometry args={[0.3, 0.036]} />{M.glow({ col: "#ffe2a0", op: 0.12 * cl((tt - 3.2) * 3) })}</mesh>
    {Array.from({ length: 12 }, (_, i) => { const d = Math.max(0, Math.sin(cl((tt - 0.4 - i * 0.22) / 0.3) * PI)); return <mesh key={i} position={[-0.15 + (i % 6) * 0.06, 0.205 - 0.012 * d, 0.1 + Math.floor(i / 6) * 0.05]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.02, 20]} />{M.porcelain({ col: "#f2ead8" })}</mesh>; })}
  </>;
}}</Scene3D>;

// mula de juguete de madera (cuerpo, cabeza, orejas, arnés y cuatro patas que trotan)
const Mule: React.FC<{ ph: number; lit?: number }> = ({ ph, lit = 0 }) => <group>
  <RBox s={[0.07, 0.03, 0.025]} p={[0, 0.045, 0]} r={0.01}><meshStandardMaterial color="#6e4a2c" roughness={0.7} /></RBox>
  <RBox s={[0.03, 0.018, 0.016]} p={[0.045, 0.065, 0]} rot={[0, 0, 0.6]} r={0.006}><meshStandardMaterial color="#5c3d24" roughness={0.7} /></RBox>
  {[-1, 1].map((s) => <mesh key={s} position={[0.04, 0.085, s * 0.005]} rotation={[s * 0.3, 0, 0.2]}><coneGeometry args={[0.004, 0.02, 6]} /><meshStandardMaterial color="#5c3d24" /></mesh>)}
  {[0, 1, 2, 3].map((i) => <mesh key={i} castShadow position={[i < 2 ? 0.025 : -0.025, 0.017, i % 2 ? 0.008 : -0.008]} rotation={[0, 0, 0.4 * Math.sin(ph * 2 * PI + (i % 2 ? PI : 0) + (i < 2 ? 0 : PI / 2))]}><cylinderGeometry args={[0.004, 0.003, 0.034, 6]} /><meshStandardMaterial color="#4a3020" /></mesh>)}
  <mesh position={[0.02, 0.05, 0]}><torusGeometry args={[0.017, 0.004, 6, 16]} /><meshStandardMaterial color="#9a2a1c" emissive="#ffc35a" emissiveIntensity={1.4 * lit} /></mesh>
</group>;

// ---- 2:20 · VEINTE MULAS: diez parejas tiran la carreta cargada por el lago seco; la cámara recorre la fila de la cola a la punta ----
export const HMules: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#c9d6de" key1={[-1.6, 2.2, 1.2]}
  cam={{ at: [-0.3, 0.06, 0], at1: [0.95, 0.06, 0], az: [0.7, 0.35], el: [0.26, 0.2], r: [0.9, 0.85], fov: 30 }}
>{(tt) => {
  const x = 0.06 * tt, ph = tt * 1.6, nv = 20 * cl((tt - 0.5) / 4.1), on = nv % 10, te = Math.floor(nv / 10) + Math.max(0, on - 9);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[12, 12]} /><meshStandardMaterial map={tex.text("crust2", 512, 512, (g) => { g.fillStyle = "#d6c39e"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(150,135,110,${0.08 * rn(i, 9)})`; g.fillRect(rn(i, 7) * 512, rn(i, 8) * 512, 3, 3); } g.strokeStyle = "rgba(96,74,50,.7)"; g.lineWidth = 3; for (let i = 0; i < 260; i++) { g.beginPath(); const a = rn(i, 2) * 512, b = rn(i, 3) * 512; g.moveTo(a, b); g.lineTo(a + (rn(i, 4) - 0.5) * 70, b + (rn(i, 5) - 0.5) * 70); g.stroke(); } })} roughness={0.95} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-3 + i * 1.3, 0, -3.4]} scale={[1.6, 0.28 + 0.2 * rn(i, 2), 1]}><sphereGeometry args={[0.9, 24, 12, 0, 6.3, 0, 1.57]} /><meshStandardMaterial color="#8a6e55" roughness={1} /></mesh>)}
    <group position={[x, 0, 0]} scale={1.25}>
      {Array.from({ length: 20 }, (_, i) => <group key={i} position={[0.02 + Math.floor(i / 2) * 0.085, 0, i % 2 ? 0.03 : -0.03]}><Mule ph={ph + rn(i, 2) * 0.3} lit={cl((tt - 0.6 - Math.floor(i / 2) * 0.42) * 3)} />
        {i % 2 === 0 && Array.from({ length: 4 }, (_, j) => { const k = (tt * 1.3 + j / 4 + rn(i, j)) % 1; return <mesh key={j} position={[-0.03 - 0.06 * k, 0.005 + 0.03 * k, 0.03 * (rn(i * 4 + j, 5) - 0.5)]}><sphereGeometry args={[0.006 + 0.012 * k, 8, 6]} /><meshBasicMaterial color="#e6dccb" transparent opacity={0.4 * (1 - k)} depthWrite={false} /></mesh>; })}
      </group>)}
      <mesh position={[0.4, 0.04, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.002, 0.002, 0.84, 6]} />{M.steel()}</mesh>
      <group position={[-0.16, 0, 0]}>
        <RBox s={[0.26, 0.1, 0.14]} p={[0, 0.11, 0]} r={0.01}><meshStandardMaterial map={tex.wood(2, 1, [140, 96, 58])} roughness={0.8} /></RBox>
        <RBox s={[0.1, 0.07, 0.012]} p={[0.0, 0.11, 0.074]} r={0.004}>{M.brass({ col: "#b8862e" })}</RBox>
        <DigitDrum v={te} p={[-0.019, 0.11, 0.084]} r={0.026} w={0.034} />
        <DigitDrum v={on} p={[0.019, 0.11, 0.084]} r={0.026} w={0.034} />
        <mesh position={[0, 0.17, 0]} scale={[0.12, 0.05, 0.06]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#f4f1e8" roughness={0.9} /></mesh>
        {[[-0.09, 0.075], [0.09, 0.075], [-0.09, -0.075], [0.09, -0.075]].map(([wx, wz], i) => <group key={i} position={[wx, 0.06, wz]} rotation={[PI / 2, 0, -tt * 1.6]}>
          <mesh><torusGeometry args={[0.05, 0.007, 8, 24]} /><meshStandardMaterial color="#3a2a1c" /></mesh>
          {[0, 1, 2].map((k) => <mesh key={k} rotation={[0, 0, k * PI / 3]}><boxGeometry args={[0.1, 0.004, 0.004]} /><meshStandardMaterial color="#3a2a1c" /></mesh>)}
        </group>)}
      </group>
    </group>
  </>;
}}</Scene3D>;

const canLabel = (txt: string, col: string) => tex.text("can" + txt, 768, 160, (g) => { g.fillStyle = "#f3ead2"; g.fillRect(0, 0, 768, 160); g.fillStyle = col; g.fillRect(0, 0, 768, 14); g.fillRect(0, 146, 768, 14); g.font = "900 " + (txt.length > 6 ? 84 : 104) + "px Georgia"; g.textAlign = "center"; g.fillText(txt, 384, 116); });

// ---- 2:31 · DOS POLVOS QUE NO SON IGUALES: dos latas abiertas; una de cristales que brillan (borax), otra de polvo fino que flota (boric acid); una placa de vidrio baja entre las dos ----
export const HTwopowders: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [-0.3, 0.25], el: [0.55, 0.45], r: [0.7, 0.56], fov: 30 }}
>{(tt) => {
  const wall = phys(tt, 2.8, 7, 0.4), a = phys(tt, 0.2, 8, 0.4), b = phys(tt, 0.9, 8, 0.4);
  return <>
    <group position={[-0.14, (1 - a) * 0.4, 0]}>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.07, 0.07, 0.09, 40, 1, true]} />{M.steel({ col: "#2f7d4a", side: 2 })}</mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} />{M.steel({ col: "#2f7d4a" })}</mesh>
      <mesh position={[0, 0.042, 0]}><cylinderGeometry args={[0.0712, 0.0712, 0.05, 48, 1, true, -1.1, 2.2]} /><meshStandardMaterial map={canLabel("BORAX", "#2f7d4a")} roughness={0.7} side={2} /></mesh>
      {Array.from({ length: 90 }, (_, i) => { const r = Math.sqrt(rn(i, 2)) * 0.062, a2 = rn(i, 4) * 6.3; return <mesh key={i} position={[Math.cos(a2) * r, 0.07 + rn(i, 3) * 0.02 - r * 0.15, Math.sin(a2) * r]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, 0]}><octahedronGeometry args={[0.008 + 0.006 * rn(i, 7), 0]} /><meshPhysicalMaterial color="#f8f6f0" roughness={0.08} clearcoat={1} emissive="#ffffff" emissiveIntensity={0.08 + 0.25 * Math.max(0, Math.sin(tt * 3 + i))} /></mesh>; })}
    </group>
    <group position={[0.14, (1 - b) * 0.4, 0]}>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.07, 0.07, 0.09, 40, 1, true]} />{M.steel({ col: "#8a2a22", side: 2 })}</mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} />{M.steel({ col: "#8a2a22" })}</mesh>
      <mesh position={[0, 0.042, 0]}><cylinderGeometry args={[0.0712, 0.0712, 0.05, 48, 1, true, -1.1, 2.2]} /><meshStandardMaterial map={canLabel("BORIC ACID", "#8a2a22")} roughness={0.7} side={2} /></mesh>
      <mesh position={[0, 0.072, 0]} scale={[1, 0.22, 1]}><sphereGeometry args={[0.066, 30, 12, 0, 6.3, 0, 1.57]} /><meshStandardMaterial color="#fdfcf8" roughness={1} /></mesh>
      {Array.from({ length: 30 }, (_, i) => { const k = (tt * 0.25 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.1, 0.09 + k * 0.12, (rn(i, 4) - 0.5) * 0.1]}><sphereGeometry args={[0.004 + 0.008 * k, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.3 * (1 - k)} depthWrite={false} /></mesh>; })}
    </group>
    <group position={[0, 0.1 + (1 - wall) * 0.5, 0]}>
      <mesh><boxGeometry args={[0.008, 0.2, 0.32]} />{M.glass({ op: 0.4 })}</mesh>
      <mesh position={[0, 0.101, 0]}><boxGeometry args={[0.012, 0.004, 0.32]} />{M.glow({ col: "#ffd9a0" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:08 · TRABAJA DESPACIO: un reloj de arena con polvo blanco; una hormiga grande baja sin apuro por el vidrio curvo mientras el polvo cae ----
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.25, 0.45, 0.3]}
  cam={{ at: [0, 0.15, 0.02], az: [-0.12, 0.12], el: [0.1, 0.14], r: [0.66, 0.52], fov: 28 }}>{(tt) => {
  const k = cl(tt / 5.6), top = 1 - k, bot = k, a = lerp(0.3, 2.45, eio(tt, 0.2, 5.4));
  return <>
    {[0.005, 0.275].map((y) => <RBox key={y} s={[0.2, 0.012, 0.2]} p={[0, y, 0]} r={0.004}>{M.wood({ base: [120, 78, 44] })}</RBox>)}
    {[[-0.085, -0.085], [0.085, -0.085], [-0.085, 0.085], [0.085, 0.085]].map(([x, z], i) => <mesh key={i} position={[x, 0.14, z]}><cylinderGeometry args={[0.007, 0.007, 0.27, 12]} />{M.wood({ base: [120, 78, 44] })}</mesh>)}
    <mesh position={[0, 0.205, 0]}><sphereGeometry args={[0.07, 32, 20]} />{M.glass({ op: 0.12 })}</mesh>
    <mesh position={[0, 0.075, 0]}><sphereGeometry args={[0.07, 32, 20]} />{M.glass({ op: 0.12 })}</mesh>
    <mesh position={[0, 0.16 + 0.03 * top, 0]} scale={[top * 0.9 + 0.1, top + 0.02, top * 0.9 + 0.1]}><sphereGeometry args={[0.055, 24, 12, 0, 6.3, PI / 2, PI / 2]} /><meshStandardMaterial color="#f6f3ea" roughness={1} /></mesh>
    <mesh position={[0, 0.012, 0]} scale={[0.5 + 0.5 * bot, 0.15 + 1.1 * bot, 0.5 + 0.5 * bot]}><coneGeometry args={[0.06, 0.06, 32]} /><meshStandardMaterial color="#f6f3ea" roughness={1} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0, 0.14 - ((tt * 0.6 + i / 14) % 1) * 0.11, 0]}><icosahedronGeometry args={[0.0022, 0]} /><meshStandardMaterial color="#ffffff" /></mesh>)}
    {/* la hormiga camina de perfil por el contorno del vidrio, de arriba hacia el cuello, sin apuro */}
    <group position={[0.073 * Math.sin(a), 0.205 + 0.073 * Math.cos(a), 0.012]} rotation={[0, 0, -a]}><Ant ph={tt * 1.4} s={1.7} /></group>
  </>;
}}</Scene3D>;

// ---- 3:26 · BIEN ARRIBA: la caja sube estante por estante hasta el último; abajo una manito de bebé se estira y no llega ----
export const HHighshelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [-0.12, 0.34, 0], at1: [0.04, 0.98, 0], az: [0.35, 0.2], el: [0.1, 0.02], r: [1.45, 1.35], fov: 34 }}>{(tt) => {
  const up = eio(tt, 0.9, 4.6), reach = eio(tt, 0.3, 2.0), wig = Math.sin(tt * 5) * 0.04 * reach;
  const y = lerp(0.03, 1.13, up);
  return <>
    {[0, 0.38, 0.76, 1.12].map((sy, i) => <RBox key={i} s={[0.6, 0.02, 0.28]} p={[0, sy + 0.01, -0.02]} r={0.004}>{M.wood({ base: [176, 132, 86] })}</RBox>)}
    {[-0.31, 0.31].map((x) => <RBox key={x} s={[0.02, 1.2, 0.28]} p={[x, 0.6, -0.02]} r={0.004}>{M.wood({ base: [160, 118, 76] })}</RBox>)}
    <group position={[0.1, y, -0.02]} rotation={[0, -0.3 + 0.3 * up, 0]}><BoraxBox s={1.2} /></group>
    {[0.39, 0.77].map((sy, i) => <group key={i} position={[-0.17, sy + 0.02, -0.02]}><Jar r={0.04} h={0.1} lv={0.7} liq={i ? "#c9733a" : "#e7c95c"} /></group>)}
    {/* brazo de bebé parado desde abajo: manga, muñeca gordita, palma y cinco deditos estirados que no llegan al primer estante */}
    <group position={[-0.47, -0.12, 0.3]} rotation={[0, 0, -0.22 + 0.1 * (1 - reach) + wig]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.06, 0.065, 0.2, 20]} /><meshStandardMaterial color="#9cc3e0" roughness={0.9} /></mesh>
      <mesh position={[0, 0.3, 0]}><capsuleGeometry args={[0.045, 0.18, 8, 16]} /><meshStandardMaterial color="#f0c0a0" roughness={0.6} /></mesh>
      <group position={[0, 0.44, 0]}>
        <mesh scale={[1, 1.05, 0.6]}><sphereGeometry args={[0.048, 20, 14]} /><meshStandardMaterial color="#f0c0a0" roughness={0.6} /></mesh>
        {[-0.03, -0.011, 0.008, 0.027].map((x, i) => <mesh key={i} position={[x, 0.065 - Math.abs(i - 1.5) * 0.006, 0]} rotation={[0, 0, (i - 1.5) * 0.12 * (1 + 0.5 * Math.sin(tt * 6 + i))]}><capsuleGeometry args={[0.0105, 0.035, 4, 8]} /><meshStandardMaterial color="#f0c0a0" roughness={0.6} /></mesh>)}
        <mesh position={[0.05, 0.015, 0]} rotation={[0, 0, -0.9]}><capsuleGeometry args={[0.011, 0.028, 4, 8]} /><meshStandardMaterial color="#f0c0a0" roughness={0.6} /></mesh>
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:56 · POR LA PATA DE LA MESA: una fila de hormigas, cada una con su granito, sube derecho por la pata, dobla al borde y llega a la azucarera ----
const antPos = (d: number): { p: number[]; r: number[] } => d < 0.815 ? { p: [0.0, d, 0.049], r: [0, PI / 2, PI / 2] } : { p: [0.0, 0.816, 0.049 - (d - 0.815)], r: [0, PI / 2, 0] };
export const HAntmarch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.2, 0.9, 0.4]}
  cam={{ at: [0, 0.5, 0.02], at1: [0, 0.8, -0.1], az: [0.45, 0.3], el: [0.12, 0.42], r: [0.55, 0.62], fov: 30 }}>{(tt) => <>
    {/* pata cuadrada: la cara plana deja ver las seis patas de cada hormiga */}
    <RBox s={[0.074, 0.8, 0.074]} p={[0, 0.4, 0.012]} r={0.006}>{M.wood({ base: [150, 104, 64], rx: 1, ry: 3 })}</RBox>
    <RBox s={[1.2, 0.03, 0.7]} p={[0.3, 0.8, -0.3]} r={0.004}>{M.wood({ base: [170, 120, 74] })}</RBox>
    <group position={[0.0, 0.815, -0.16]}><SugarBowl /></group>
    <group position={[0.0, 0, -0.16]}><Powder n={40} w={0.1} d={0.06} y={0.818} /></group>
    {Array.from({ length: 14 }, (_, i) => { const d = tt * 0.15 - i * 0.09 + 0.3; if (d < 0 || d > 0.96) return null; const q = antPos(d); return <group key={i} position={q.p as [number, number, number]} rotation={q.r as [number, number, number]}>
      <Ant ph={tt * 3 + i * 0.3} s={2.1} />
      <mesh position={[0.036, 0.016, 0]}><icosahedronGeometry args={[0.0055, 0]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} /></mesh>
    </group>; })}
  </>}</Scene3D>;
