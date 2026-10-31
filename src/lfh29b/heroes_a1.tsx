// lfh29b · componentes únicos 1-6 (la repisa de latas con su tarea, la lata que paga el vestido, el colador de alambre, el caño que se tapa, las astillas de jabón que se funden, el molde de muffins).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Button, Can, Coin } from "./bk";

const PI = Math.PI;
const CANCOL = ["#a8322a", "#2d5d9a", "#c98a1e", "#3d6e3a", "#7a4a2c", "#8a2a5a", "#2a6f78", "#6b4a1f"];

// ---- 0:36 · UNA FILA DE LATAS VIEJAS: caen de a una en la repisa del porche y de cada una asoma lo que guarda ----
export const HCanshelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood"
  cam={{ at: [0, 0.15, 0], az: [0.12, -0.12], el: [0.16, 0.12], r: [1.42, 1.3], fov: 30 }}>{(tt) => {
  const X = (i: number) => -0.56 + i * 0.16, Y = (i: number) => (1 - phys(tt, 0.15 + i * 0.32, 8, 0.4)) * 0.45, U = (i: number) => phys(tt, 1.2 + i * 0.32, 6, 0.45);
  return <>
    <RBox s={[1.5, 0.03, 0.22]} p={[0, -0.015, 0]} r={0.004}>{M.wood({ base: [128, 86, 50] })}</RBox>
    {[-0.6, 0.6].map((x) => <RBox key={x} s={[0.04, 0.12, 0.16]} p={[x, -0.09, -0.03]} r={0.004}>{M.wood({ base: [110, 72, 40] })}</RBox>)}
    {CANCOL.map((c, i) => <group key={i} position={[X(i), Y(i), 0]} rotation={[0, rn(i, 2) * 0.6, 0]}>
      <Can col={c} r={0.055} h={0.13 + 0.03 * rn(i, 3)} />
      {/* lo que guarda cada lata asoma de a una */}
      <group position={[0, 0.13 + 0.09 * U(i), 0]} scale={Math.max(0.001, 1.9 * cl(U(i)))}>
        {i === 0 && <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.045, 0.003, 6, 30]} />{M.steel()}</mesh>}
        {i === 1 && [0, 1, 2].map((k) => <RBox key={k} s={[0.05, 0.008, 0.025]} p={[0, k * 0.01, 0]} rot={[0, k, 0.2]} r={0.003}><meshStandardMaterial color={["#f3c6d2", "#cfe8c4", "#fbf3dc"][k]} roughness={0.5} /></RBox>)}
        {i === 2 && <mesh rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.012, 0.012, 0.05, 16]} /><meshStandardMaterial color="#f2ead2" roughness={0.6} /></mesh>}
        {i === 3 && [0, 1, 2].map((k) => <group key={k} position={[(k - 1) * 0.022, k * 0.006, 0]} rotation={[0.9, 0, 0]}><Button col={["#c0392b", "#f2efe6", "#2d5d9a"][k]} /></group>)}
        {i === 4 && <mesh><sphereGeometry args={[0.03, 20, 14]} /><meshStandardMaterial map={tex.text("twine", 128, 128, (g) => { g.fillStyle = "#cdb58a"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#9c8256"; g.lineWidth = 3; for (let k = 0; k < 22; k++) { g.beginPath(); g.moveTo(0, k * 6); g.lineTo(128, k * 6 + 30); g.stroke(); } })} roughness={0.9} /></mesh>}
        {i === 5 && <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.03, 0.004, 8, 30]} />{M.rubber({ col: "#c2302a" })}</mesh>}
        {i === 6 && <RBox s={[0.05, 0.065, 0.004]} p={[0, 0.01, 0]} r={0.002}><meshStandardMaterial map={tex.text("seedp", 128, 160, (g) => { g.fillStyle = "#efe2bf"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#c0392b"; g.beginPath(); g.arc(64, 70, 34, 0, 6.3); g.fill(); g.fillStyle = "#3d6e3a"; g.fillRect(56, 26, 16, 14); })} roughness={0.9} /></RBox>}
        {i === 7 && [0, 1, 2, 3].map((k) => <group key={k} position={[0, k * 0.004, 0]} rotation={[0.1 * k, 0, 0]}><Coin col={k % 2 ? "#b8733a" : "#c9cbcf"} /></group>)}
      </group>
    </group>)}
  </>;
}}</Scene3D>;

// ---- 0:57 · LA LATA PAGÓ EL VESTIDO: maniquí de costurera; las monedas saltan de la lata y la falda de raso crece con la puntilla ----
const _formG: { g?: THREE.LatheGeometry } = {};
const formG = () => _formG.g || (_formG.g = new THREE.LatheGeometry([[0.001, 0], [0.05, 0.005], [0.062, 0.04], [0.05, 0.1], [0.044, 0.13], [0.058, 0.19], [0.066, 0.22], [0.05, 0.255], [0.02, 0.27], [0.016, 0.29], [0.001, 0.295]].map(([x, y]) => new THREE.Vector2(x, y)), 48));
export const HDressform: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[-0.9, 1.6, 1.4]}
  cam={{ at: [0.05, 0.33, 0], az: [-0.35, 0.1], el: [0.12, 0.1], r: [1.12, 1.04], fov: 30 }}>{(tt) => {
  const g = eio(tt, 0.9, 4.9);
  return <>
    <group position={[-0.3, 0, 0.08]}><Can col="#7a4a2c" r={0.062} h={0.15} /></group>
    {/* monedas grandes en arco de la lata a la falda; quedan pegadas como lentejuelas hasta que el raso las cubre */}
    {Array.from({ length: 18 }, (_, i) => { const k = cl((tt - 0.5 - i * 0.2) / 0.65); if (k <= 0) return null; const ang = rn(i, 2) * 2 - 1, yy = 0.08 + 0.12 * rn(i, 3);
      const rr = 0.055 + 0.11 * g * (1 - yy / 0.32);
      const p: [number, number, number] = k < 1 ? [lerp(-0.3, 0.18 + Math.sin(ang) * rr, k), 0.16 + Math.sin(k * PI) * 0.26 + (yy - 0.16) * k, lerp(0.08, Math.cos(ang) * rr, k)] : [0.18 + Math.sin(ang) * rr, yy, Math.cos(ang) * rr];
      return <group key={i} visible={k < 1 || g < 0.85} position={p} rotation={k < 1 ? [k * 9, k * 4, 0] : [PI / 2 - 0.3, ang, 0]}><Coin col={i % 3 ? "#d8b445" : "#b8733a"} r={0.02} /></group>; })}
    {/* maniquí: trípode de madera, varilla de bronce, torso de lino con perilla */}
    {[0, 1, 2].map((k) => <mesh key={k} position={[0.18 + Math.cos(k * 2.1) * 0.06, 0.03, Math.sin(k * 2.1) * 0.06]} rotation={[Math.sin(k * 2.1) * 0.5, 0, -Math.cos(k * 2.1) * 0.5]}><cylinderGeometry args={[0.006, 0.008, 0.11, 10]} />{M.wood({ base: [96, 62, 36] })}</mesh>)}
    <mesh position={[0.18, 0.17, 0]}><cylinderGeometry args={[0.006, 0.006, 0.26, 10]} />{M.brass()}</mesh>
    <mesh geometry={formG()} position={[0.18, 0.28, 0]} scale={[1, 1, 0.78]}><meshStandardMaterial map={tex.text("linen2", 128, 128, (q) => { q.fillStyle = "#c2a982"; q.fillRect(0, 0, 128, 128); q.strokeStyle = "rgba(150,120,80,.25)"; for (let i = 0; i < 128; i += 3) { q.beginPath(); q.moveTo(i, 0); q.lineTo(i, 128); q.stroke(); } q.fillStyle = "#b08a52"; q.fillRect(62, 0, 4, 128); })} roughness={0.85} /></mesh>
    <mesh position={[0.18, 0.585, 0]}><sphereGeometry args={[0.018, 16, 12]} />{M.wood({ base: [80, 50, 30] })}</mesh>
    {/* falda de raso que crece desde la cintura */}
    <mesh position={[0.18, 0.31 - 0.13 * g, 0]} scale={[1, Math.max(0.02, g), 0.85]}><cylinderGeometry args={[0.048, 0.05 + 0.12 * g, 0.26, 18, 1, true]} /><meshPhysicalMaterial color="#b98478" roughness={0.3} sheen={0.8} sheenColor="#ffe2d8" clearcoat={0.5} flatShading side={THREE.DoubleSide} /></mesh>
    <mesh visible={g > 0.6} position={[0.18, 0.31 - 0.26 * g, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 0.85, 1]}><torusGeometry args={[0.05 + 0.12 * g, 0.005, 6, 64]} /><meshStandardMaterial color="#e6dac0" roughness={0.9} /></mesh>
  </>;
}}</Scene3D>;

// ---- 1:45 · EL COLADOR DE ALAMBRE: la sartén vuelca la grasa dorada, el colador ataja los pedacitos y la lata se llena ----
export const HStrainer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="tile" bg="#1d1a17" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.14, 0], az: [0.4, 0.15], el: [0.55, 0.45], r: [0.62, 0.5], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 0.6, 1.6) * (1 - eio(tt, 4.4, 5.2)), pour = cl((tt - 1.3) / 3.2), flow = tt > 1.3 && tt < 4.6;
  const mesh = tex.text("wire", 256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.strokeStyle = "#cfd3d6"; g.lineWidth = 3; for (let i = 0; i <= 256; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } });
  return <>
    {/* cocina blanca enlozada */}
    <RBox s={[1.2, 0.05, 0.6]} p={[0, -0.025, 0]} r={0.01}>{M.wood({ base: [72, 46, 28] })}</RBox>
    <group position={[0, 0, 0]}><Can col="#a8322a" r={0.065} h={0.16} /></group>
    {/* nivel de grasa que sube adentro de la lata */}
    <mesh position={[0, 0.02 + 0.12 * pour, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.063, 40]} />{M.grease({ col: "#d9b35a" })}</mesh>
    {/* colador: aro y malla */}
    <mesh position={[0, 0.162, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.068, 0.003, 8, 40]} />{M.steel()}</mesh>
    <mesh position={[0, 0.145, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.066, 28, 12, 0, 6.3, PI / 2, PI / 2]} /><meshStandardMaterial map={mesh} transparent alphaTest={0.3} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} /></mesh>
    {/* pedacitos de panceta que quedan arriba */}
    {Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 1.6 - i * 0.2) / 0.4); return <mesh key={i} visible={k > 0} position={[(rn(i, 2) - 0.5) * 0.08, 0.135 + 0.06 * (1 - k), (rn(i, 3) - 0.5) * 0.08]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]}><boxGeometry args={[0.012, 0.004, 0.007]} /><meshStandardMaterial color="#7a3b1c" roughness={0.6} /></mesh>; })}
    {/* sartén de hierro que se inclina */}
    <group position={[-0.17, 0.27, 0]} rotation={[0, 0, -1.0 * tip]}>
      <mesh position={[0.05, 0, 0]}><cylinderGeometry args={[0.1, 0.085, 0.04, 40, 1, true]} /><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.05, -0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.085, 40]} /><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.05, -0.012, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.08 * (1 - 0.8 * pour), 40]} />{M.grease({ col: "#d9a84a" })}</mesh>
      <RBox s={[0.16, 0.014, 0.03]} p={[-0.12, 0.004, 0]} r={0.006}><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} /></RBox>
    </group>
    {flow && <mesh geometry={tubeG("gr" + Math.round(tip * 20), [[-0.05, 0.25 - 0.01 * tip, 0], [-0.025, 0.24, 0], [-0.008, 0.2, 0], [0, 0.15, 0]], 0.006, 40, 10)}>{M.grease({ col: "#e0b95c", op: 0.85 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 2:33 · DURA COMO CERA: la boca de un caño de hierro; la grasa ámbar se pega en la pared, se vuelve blanca y casi lo cierra ----
export const HPipeclog: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#1a1c1f" key1={[0.8, 1.4, 1.4]}
  cam={{ at: [0.12, 0.02, 0], az: [0.95, 0.75], el: [0.22, 0.16], r: [0.7, 0.58], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.6), rin = lerp(0.068, 0.016, k), col = new THREE.Color("#d9a441").lerp(new THREE.Color("#f4efe2"), cl(k * 1.3)).getStyle();
  const tip = eio(tt, 0.2, 0.8) * (1 - eio(tt, 3.6, 4.3));
  return <>
    {/* caño entero de hierro oxidado, la boca mira a cámara */}
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.085, 0.085, 0.7, 48, 1, true]} /><meshStandardMaterial map={tex.rust()} metalness={0.6} roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.35, 0, 0]} rotation={[0, PI / 2, 0]}><ringGeometry args={[0.071, 0.085, 48]} /><meshStandardMaterial color="#5a4030" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.071, 0.071, 0.7, 48, 1, true]} /><meshStandardMaterial color="#2e3134" metalness={0.4} roughness={0.8} side={THREE.BackSide} /></mesh>
    {/* la grasa: un anillo que se engrosa hacia el centro, de ámbar líquida a cera blanca */}
    <mesh position={[0.05, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[rin, rin, 0.6, 48, 1, true]} /><meshStandardMaterial color={col} roughness={0.75} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.349, 0, 0]} rotation={[0, PI / 2, 0]}><ringGeometry args={[rin, 0.0712, 48]} /><meshStandardMaterial color={col} roughness={0.7} side={THREE.DoubleSide} /></mesh>
    {/* gotas de agua que salen por la boca, cada vez menos */}
    {Array.from({ length: 6 }, (_, i) => { const u = (tt * (1.1 - 0.9 * k) + i / 6) % 1; return <mesh key={i} position={[0.36 + 0.04 * u, -rin * 0.6 - 0.25 * u * u, (rn(i, 2) - 0.5) * rin]}><sphereGeometry args={[0.008, 12, 8]} />{M.water()}</mesh>; })}
    {/* la sartén que vuelca grasa dorada en la otra punta */}
    <group position={[-0.3, 0.17, 0]} rotation={[0, 0, -0.9 * tip]}>
      <mesh><cylinderGeometry args={[0.07, 0.06, 0.03, 32, 1, true]} /><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.015, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 32]} /><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <RBox s={[0.12, 0.012, 0.024]} p={[-0.12, 0.004, 0]} r={0.005}><meshStandardMaterial color="#1c1b1a" metalness={0.6} roughness={0.5} /></RBox>
    </group>
    {tip > 0.5 && <mesh geometry={tubeG("pcg" + Math.round(tip * 10), [[-0.25, 0.15, 0], [-0.27, 0.1, 0], [-0.29, 0.05, 0]], 0.005, 12, 8)}>{M.grease({ col: "#e0b95c", op: 0.9 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 3:38 · SE PONE BLANDO COMO AVENA: las astillas de colores en la olla, la cuchara de madera gira y se funden en una pasta ----
export const HSoapmelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#201a15" key1={[-0.8, 1.4, 1.0]} warm={0.7}
  cam={{ at: [0, 0.05, 0], az: [0.3, 0.5], el: [0.95, 0.85], r: [0.45, 0.38], fov: 30 }}>{(tt) => {
  const m = eio(tt, 0.4, 3.6), a = tt * 2.2;
  return <>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.12, 0.11, 0.1, 48, 1, true]} /><meshStandardMaterial color="#2b2927" metalness={0.55} roughness={0.55} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.01, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.11, 48]} /><meshStandardMaterial color="#232120" metalness={0.5} roughness={0.6} /></mesh>
    <mesh position={[0, 0.09, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.12, 0.004, 8, 48]} />{M.steel()}</mesh>
    {/* la pasta que crece con pintitas */}
    <mesh position={[0, 0.02 + 0.015 * m, 0]} scale={[1, 0.22, 1]}><sphereGeometry args={[0.105 * (0.3 + 0.7 * m), 36, 18]} /><meshStandardMaterial map={tex.text("speck2", 256, 256, (g) => { g.fillStyle = "#cdb89c"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 260; i++) { g.fillStyle = ["#e9a9b9", "#a9d39a", "#f6e6a8"][i % 3]; g.beginPath(); g.arc(rn(i, 2) * 256, rn(i, 3) * 256, 2 + 4 * rn(i, 4), 0, 6.3); g.fill(); } })} roughness={0.6} /></mesh>
    {/* astillas que se achican y se hunden */}
    {Array.from({ length: 14 }, (_, i) => { const s = 1 - cl((m - rn(i, 5) * 0.4) / 0.6); const r = 0.03 + 0.06 * rn(i, 6), b = rn(i, 7) * 6.3 + a * 0.3 * (1 - s); return s <= 0.02 ? null : <RBox key={i} s={[0.05 * s + 0.004, 0.006, 0.022 * s + 0.003]} p={[Math.cos(b) * r, 0.04, Math.sin(b) * r]} rot={[0, b, 0.15]} r={0.002}><meshStandardMaterial color={["#ef7f9c", "#7fc46b", "#f1cf45", "#6fa6dc"][i % 4]} roughness={0.4} /></RBox>; })}
    {/* cuchara de madera que revuelve */}
    <group position={[Math.cos(a) * 0.05, 0.1, Math.sin(a) * 0.05]} rotation={[0.35 * Math.sin(a), 0, -0.35 * Math.cos(a)]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.006, 0.007, 0.26, 12]} />{M.wood({ base: [196, 150, 96] })}</mesh>
      <mesh position={[0, -0.02, 0]} scale={[1, 1.4, 0.45]}><sphereGeometry args={[0.022, 16, 12]} />{M.wood({ base: [196, 150, 96] })}</mesh>
    </group>
    {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.4 + i / 8) % 1; return <mesh key={"v" + i} position={[(rn(i, 9) - 0.5) * 0.12, 0.1 + u * 0.25, (rn(i, 8) - 0.5) * 0.12]}><sphereGeometry args={[0.02 + 0.03 * u, 12, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.12 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 3:44 · EL MOLDE DE MUFFINS: el cucharón llena hueco por hueco, el molde se da vuelta y caen seis jaboncitos de a uno ----
export const HMuffintin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.03, 0], az: [-0.2, 0.15], el: [0.62, 0.55], r: [0.68, 0.6], fov: 30 }}>{(tt) => {
  const flip = eio(tt, 3.0, 3.8), up = Math.sin(flip * PI) * 0.12, gone = eio(tt, 3.9, 4.8);
  const C = (i: number) => [(i % 3 - 1) * 0.085, (Math.floor(i / 3) - 0.5) * 0.085];
  const li = Math.min(5, Math.floor(cl((tt - 0.3) / 2.2) * 6));
  const spk = (i: number) => tex.text("speck2" + (i % 3), 128, 128, (g) => { g.fillStyle = ["#f6dfe4", "#e3f0dc", "#f7f0dc"][i % 3]; g.fillRect(0, 0, 128, 128); for (let k = 0; k < 90; k++) { g.fillStyle = ["#e9a9b9", "#a9d39a", "#e8cf7a"][k % 3]; g.fillRect(rn(k + i, 2) * 128, rn(k, 3 + i) * 128, 3, 3); } });
  return <>
    <RBox s={[0.42, 0.004, 0.3]} p={[0, 0.002, 0]} r={0.002}><meshStandardMaterial map={tex.text("towelb", 256, 256, (g) => { g.fillStyle = "#f4efe6"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#c0392b"; for (let i = 0; i < 256; i += 32) { g.fillRect(i, 0, 8, 256); g.fillRect(0, i, 256, 8); } })} roughness={0.95} /></RBox>
    {/* molde: marco con borde y seis copas hundidas con su labio */}
    <group position={[0.45 * gone, up + 0.045, -0.3 * gone]} rotation={[PI * flip, 0, 0]}>
      {[[0, 0.105, 0.3, 0.012], [0, -0.105, 0.3, 0.012], [0.145, 0, 0.012, 0.22], [-0.145, 0, 0.012, 0.22]].map(([x, z, w, d], k) => <RBox key={k} s={[w, 0.014, d]} p={[x, 0.017, z]} r={0.003}>{M.steel({ col: "#a7abaf" })}</RBox>)}
      {Array.from({ length: 6 }, (_, i) => <group key={i} position={[C(i)[0], 0, C(i)[1]]}>
        <mesh position={[0, 0.017, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.036, 0.004, 8, 32]} />{M.steel({ col: "#b5b9bd" })}</mesh>
        <mesh><cylinderGeometry args={[0.035, 0.026, 0.035, 28, 1, true]} />{M.steel({ col: "#7d8185", side: THREE.DoubleSide })}</mesh>
        <mesh position={[0, -0.017, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.026, 24]} />{M.steel({ col: "#6d7175", side: THREE.DoubleSide })}</mesh>
        <mesh visible={flip < 0.5 && tt > 0.4 + i * 0.36} position={[0, -0.016 + 0.028 * cl((tt - 0.4 - i * 0.36) / 0.3), 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.031, 24]} /><meshStandardMaterial map={spk(i)} roughness={0.55} /></mesh>
      </group>)}
    </group>
    {/* cucharón que pasa de hueco en hueco */}
    <group visible={tt < 2.8} position={[C(li)[0] - 0.02, 0.1, C(li)[1]]} rotation={[0, 0, 0.6]}>
      <mesh rotation={[PI, 0, 0]}><sphereGeometry args={[0.028, 20, 12, 0, 6.3, 0, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[-0.07, 0.07, 0]} rotation={[0, 0, 0.8]}><cylinderGeometry args={[0.004, 0.004, 0.18, 8]} />{M.steel()}</mesh>
    </group>
    {/* los jaboncitos caen de a uno con rebote */}
    {Array.from({ length: 6 }, (_, i) => { const p = phys(tt, 3.6 + i * 0.12, 9, 0.35); return <mesh key={i} visible={tt > 3.55 + i * 0.12} position={[C(i)[0], 0.017 + (1 - p) * 0.1, -C(i)[1]]} castShadow><cylinderGeometry args={[0.03, 0.025, 0.03, 28]} /><meshStandardMaterial map={spk(i)} roughness={0.55} /></mesh>; })}
  </>;
}}</Scene3D>;

