// lfh29b · componentes únicos 25-30 (el imán que barre el pasto, la marca de media lata, el aluminio que se alisa y se dobla, la docena que se vuelve monedas, el raso que se desenrolla, los tres frascos con destino).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Can, Coin, Egg, Hand } from "./bk";

const PI = Math.PI;

// ---- 15:41 · EL IMÁN CON HILO: se arrastra por el pasto y los tornillos perdidos saltan a pegarse ----
const SCR = [[-0.18, 0.03], [-0.09, -0.04], [-0.01, 0.03], [0.07, -0.03], [0.14, 0.04]];
export const HMagnet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#9fb4c2" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [-0.16, 0.03, 0], at1: [0.16, 0.03, 0], az: [0.2, 0.05], el: [0.42, 0.34], r: [0.52, 0.46], fov: 30 }}>{(tt) => {
  const mx = lerp(-0.26, 0.2, eio(tt, 0.3, 5.0)), my = 0.03 + 0.008 * Math.sin(tt * 7);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 1.2]} /><meshStandardMaterial map={tex.text("dirtm", 256, 256, (g) => { g.fillStyle = "#5a3f28"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${70 + rn(i, 2) * 50},${48 + rn(i, 3) * 30},${28 + rn(i, 4) * 16},.7)`; g.beginPath(); g.arc(rn(i, 5) * 256, rn(i, 6) * 256, 1 + rn(i, 7) * 3, 0, 6.3); g.fill(); } })} roughness={1} /></mesh>
    {Array.from({ length: 90 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 1.1, z = -0.12 - rn(i, 3) * 0.25; return <mesh key={i} position={[x, 0.015, z]} rotation={[(rn(i, 4) - 0.5) * 0.5, 0, (rn(i, 5) - 0.5) * 0.5]}><coneGeometry args={[0.0028, 0.015 + 0.01 * rn(i, 6), 3]} /><meshStandardMaterial color={`hsl(${88 + rn(i, 7) * 22},48%,${30 + rn(i, 8) * 14}%)`} /></mesh>; })}
    {/* hilo hacia la mano que tira (fuera de cuadro arriba a la izquierda) */}
    <mesh geometry={tubeG("mgs" + Math.round(mx * 100), [[mx, my + 0.03, 0], [mx - 0.1, my + 0.12, 0.02], [mx - 0.25, my + 0.3, 0.05]], 0.0015, 20, 5)}><meshStandardMaterial color="#efe6cf" /></mesh>
    {/* imán de herradura rojo con puntas de acero */}
    <group position={[mx, my, 0]} rotation={[0, 0, PI]} scale={1.5}>
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.009, 12, 28, PI]} />{M.plastic({ col: "#c8281e" })}</mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.025, -0.012, 0]}><cylinderGeometry args={[0.009, 0.009, 0.024, 14]} />{M.steel()}</mesh>)}
    </group>
    {/* tornillos: quedan en el pasto hasta que el imán pasa cerca y saltan */}
    {SCR.map(([x, z], i) => { const j = cl((mx - x + 0.05) / 0.06), stuck = j >= 1; return <group key={i} position={stuck ? [mx + (i % 2 ? 0.035 : -0.035) + 0.008 * (i % 3), my - 0.04 - 0.008 * (i % 3), 0.006 * i - 0.012] : [lerp(x, mx, j), 0.008 + 0.03 * j, lerp(z, 0, j)]} rotation={[stuck ? 0.2 * i : PI / 2, i, 0]}>
      <mesh><cylinderGeometry args={[0.0045, 0.003, 0.045, 8]} />{M.steel({ col: "#d4d8dc" })}</mesh>
      <mesh position={[0, 0.024, 0]}><cylinderGeometry args={[0.009, 0.009, 0.004, 14]} />{M.steel({ col: "#d4d8dc" })}</mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 16:57 · LA MARCA DE MEDIA LATA: las latas de vidrio se llenan; la de jabón toca la raya de la mitad y se enciende ----
export const HLevels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-0.8, 1.5, 1.3]}
  cam={{ at: [0.03, 0.1, 0], az: [-0.15, 0.1], el: [0.12, 0.1], r: [0.84, 0.76], fov: 30 }}>{(tt) => {
  const L = [eio(tt, 0.4, 2.6) * 0.5, eio(tt, 0.4, 4.2) * 0.85, eio(tt, 0.4, 3.0) * 0.3];
  const COL = ["#e8638a", "#d9c49a", "#2d5d9a"], HH = 0.18;
  return <>
    <RBox s={[0.7, 0.02, 0.2]} p={[0, -0.01, 0]} r={0.004}>{M.wood({ base: [128, 86, 50] })}</RBox>
    {[-0.2, 0, 0.2].map((x, i) => { const lit = i === 0 && L[0] >= 0.49; return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, HH / 2, 0]}><cylinderGeometry args={[0.06, 0.06, HH, 40, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
      <mesh position={[0, HH + 0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.004, 6, 40]} />{M.steel()}</mesh>
      {/* el contenido: astillas, cabos de vela, botones — en capas que suben */}
      {Array.from({ length: Math.floor(L[i] * 14) }, (_, k) => <mesh key={k} position={[(rn(i * 20 + k, 2) - 0.5) * 0.07, 0.008 + k * (HH / 14), (rn(i * 20 + k, 3) - 0.5) * 0.07]} rotation={[rn(k, 4), rn(k, 5) * 3, 0]}>
        {i === 1 ? <cylinderGeometry args={[0.01, 0.01, 0.035, 10]} /> : i === 0 ? <boxGeometry args={[0.04, 0.008, 0.02]} /> : <cylinderGeometry args={[0.011, 0.011, 0.004, 14]} />}
        <meshStandardMaterial color={COL[i]} roughness={0.5} /></mesh>)}
      {/* la raya de la mitad (jabón) y la de lleno (velas) */}
      <mesh position={[0, i === 1 ? HH - 0.005 : HH / 2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.0605, i === 0 ? 0.0035 : 0.0015, 6, 40]} /><meshStandardMaterial color={lit ? "#ffcf6a" : i === 0 ? "#2a2622" : "#8a7a68"} emissive={lit ? "#ffb23a" : "#000"} emissiveIntensity={lit ? 1.4 : 0} /></mesh>
      <mesh visible={lit} position={[0, i === 1 ? HH - 0.005 : HH / 2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.01, 6, 40]} />{M.glow({ col: "#ffcf7a", op: 0.35 })}</mesh>
    </group>; })}
  </>;
}}</Scene3D>;

const Sheet: React.FC<{ w: number; d: number; key2: string; flat: number }> = ({ w, d, key2, flat }) => {
  const g = React.useMemo(() => new THREE.PlaneGeometry(w, d, 24, 18), [w, d]);
  const pos = g.attributes.position as THREE.BufferAttribute, base = React.useMemo(() => Float32Array.from(pos.array as Float32Array), [g]);
  for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1]; pos.setZ(i, (1 - flat * 0.92) * 0.022 * (Math.sin(x * 90 + key2.length) * Math.cos(y * 70) + 0.6 * Math.sin((x + y) * 140))); }
  pos.needsUpdate = true; g.computeVertexNormals();
  return <mesh geometry={g} rotation={[-PI / 2, 0, 0]}><meshStandardMaterial color="#d9dde0" metalness={0.95} roughness={0.22 + 0.2 * (1 - flat)} side={THREE.DoubleSide} /></mesh>;
};

// ---- 17:33 · EL ALUMINIO: la hoja arrugada se alisa, el trapo la pasa y se dobla en cuatro ----
export const HFoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none"
  cam={{ at: [0, 0.02, 0], az: [0.3, 0.1], el: [0.62, 0.52], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const flat = eio(tt, 0.3, 1.8), wipe = eio(tt, 1.6, 2.8), f1 = eio(tt, 3.0, 3.7), f2 = eio(tt, 3.9, 4.6);
  return <>
    {/* mitad izquierda fija; la derecha se dobla encima; después la mitad de arriba se dobla hacia abajo */}
    <group position={[0, 0.003, 0]} rotation={[-PI * f2, 0, 0]}>
      <group position={[0, 0, -0.06]}>
        <group position={[-0.08, 0, 0]}><Sheet w={0.16} d={0.12} key2="a" flat={flat} /></group>
        <group rotation={[0, 0, PI * f1]}><group position={[0.08, 0.0005, 0]}><Sheet w={0.16} d={0.12} key2="bb" flat={flat} /></group></group>
        <mesh visible={f1 > 0.02} position={[0, 0.002, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 8]} /><meshStandardMaterial color="#f4f6f8" metalness={0.9} roughness={0.15} /></mesh>
      </group>
    </group>
    <group position={[0, 0.002, 0]}>
      <group position={[0, 0, 0.06]}>
        <group position={[-0.08, 0, 0]}><Sheet w={0.16} d={0.12} key2="ccc" flat={flat} /></group>
        <group rotation={[0, 0, PI * f1]}><group position={[0.08, 0.0005, 0]}><Sheet w={0.16} d={0.12} key2="dddd" flat={flat} /></group></group>
      </group>
    </group>
    {/* trapo a cuadros que pasa una vez */}
    <group visible={tt > 1.2 && tt < 3.0} position={[lerp(-0.2, 0.2, wipe), 0.03, 0.02 * Math.sin(tt * 9)]}>
      <RBox s={[0.12, 0.03, 0.14]} p={[0, 0, 0]} r={0.008}><meshStandardMaterial map={tex.text("rag", 128, 128, (g) => { g.fillStyle = "#f4efe6"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(45,93,154,.7)"; for (let i = 0; i < 128; i += 24) { g.fillRect(i, 0, 10, 128); g.fillRect(0, i, 128, 10); } })} roughness={0.95} /></RBox>
    </group>
  </>;
}}</Scene3D>;

// ---- 18:57 · 35 CENTAVOS LA DOCENA: los doce huevos saltan de la caja y caen en la lata marrón hechos monedas ----
export const HEggcoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.6, 1.4, 1.2]} warm={0.6}
  cam={{ at: [0.0, 0.1, 0], az: [-0.35, 0.25], el: [0.36, 0.28], r: [0.66, 0.56], fov: 30 }}>{(tt) => {
  const C = (i: number) => [-0.3 + (i % 6) * 0.045, (Math.floor(i / 6) - 0.5) * 0.045];
  return <>
    <RBox s={[0.29, 0.02, 0.1]} p={[-0.19, 0.01, 0]} r={0.004}><meshStandardMaterial color="#c4bcae" roughness={1} /></RBox>
    <group position={[0.2, 0, 0]}><Can col="#6b4a1f" r={0.065} h={0.15} /></group>
    {Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 0.5 - i * 0.36) / 1.0), x0 = C(i)[0], z0 = C(i)[1]; const p = [lerp(x0, 0.2, k), 0.04 + Math.sin(k * PI) * 0.24 + 0.11 * k, lerp(z0, 0, k)];
      return <group key={i} position={p as [number, number, number]} rotation={[k * 6, 0, k * 3]}>
        {k < 0.5 ? <group scale={1.6}><Egg col={i % 3 ? "#c98d5a" : "#e7d3b4"} /></group> : k < 1 ? <group scale={2.6}><Coin col={i % 4 === 0 ? "#b8733a" : "#c9cbcf"} r={0.016} /></group> : null}
        <mesh visible={k > 0.42 && k < 0.62} scale={Math.max(0.001, 1 - Math.abs(k - 0.52) * 9)}><sphereGeometry args={[0.05, 16, 12]} />{M.glow({ col: "#fff2b0", op: 0.7 })}</mesh>
      </group>; })}
    {/* la pila de monedas que crece adentro (asoma por la boca) */}
    <group position={[0.2, 0.13 + 0.025 * cl((tt - 1.2) / 3.4), 0]}>{Array.from({ length: Math.floor(cl((tt - 1.2) / 3.4) * 8) }, (_, k) => <group key={k} position={[(rn(k, 2) - 0.5) * 0.04, k * 0.002, (rn(k, 3) - 0.5) * 0.04]} rotation={[0.2 * rn(k, 4), 0, 0]}><Coin col={k % 3 ? "#c9cbcf" : "#b8733a"} r={0.02} /></group>)}</group>
  </>;
}}</Scene3D>;

// ---- 19:41 · EL RASO Y LA PUNTILLA: la lata se vuelca con los billetes y el rollo de raso blanco se desenrolla por la mesa ----
export const HSatin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" lamp={[-0.3, 0.5, 0.1]}
  cam={{ at: [0.0, 0.04, 0.03], az: [-0.2, 0.15], el: [0.5, 0.42], r: [0.72, 0.62], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 0.3, 1.0), un = eio(tt, 1.6, 4.6), rx = lerp(-0.08, 0.36, un), rr = lerp(0.045, 0.022, un);
  return <>
    <group position={[-0.3, 0.065 * tip, 0.08]} rotation={[0, 0.3, PI / 2 * tip]}><Can col="#6b4a1f" r={0.065} h={0.15} /></group>
    {/* billetes doblados y monedas que salen */}
    {Array.from({ length: 6 }, (_, i) => { const k = phys(tt, 0.7 + i * 0.12, 7, 0.4); return <group key={i} position={[-0.2 + 0.12 * k + (rn(i, 2) - 0.5) * 0.05, 0.004 + i * 0.001, 0.08 + (rn(i, 3) - 0.5) * 0.08]} rotation={[0, rn(i, 4) * 2, 0]}>
      {i < 3 ? <RBox s={[0.13, 0.003, 0.06]} p={[0, 0, 0]} r={0.001}><meshStandardMaterial map={tex.text("bill", 256, 128, (g) => { g.fillStyle = "#a9c08f"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#4d6b3a"; g.lineWidth = 6; g.strokeRect(10, 10, 236, 108); g.fillStyle = "#4d6b3a"; g.beginPath(); g.ellipse(128, 64, 30, 38, 0, 0, 6.3); g.fill(); g.font = "800 34px Georgia"; g.fillText("1", 24, 50); g.fillText("1", 212, 110); })} roughness={0.9} /></RBox> : <group scale={1.5}><Coin col={i % 2 ? "#c9cbcf" : "#b8733a"} /></group>}
    </group>; })}
    {/* el raso: tela plana que crece detrás del rollo, con brillo y puntilla en el borde */}
    <mesh position={[(rx - 0.08) / 2, 0.003, -0.08]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, rx + 0.08), 1, 1]}><planeGeometry args={[1, 0.18]} /><meshPhysicalMaterial color="#e6dcc8" roughness={0.3} sheen={0.6} sheenColor="#fff4dc" clearcoat={0.2} /></mesh>
    <mesh position={[(rx - 0.08) / 2, 0.0035, 0.012]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, rx + 0.08), 1, 1]}><planeGeometry args={[1, 0.022]} /><meshStandardMaterial transparent alphaTest={0.4} map={tex.text("lace", 256, 32, (g) => { g.clearRect(0, 0, 256, 32); g.fillStyle = "#f3ecdc"; for (let x = 0; x < 256; x += 16) { g.beginPath(); g.arc(x + 8, 10, 8, 0, PI); g.fill(); g.clearRect(x + 6, 6, 4, 4); } g.fillRect(0, 0, 256, 6); })} side={THREE.DoubleSide} /></mesh>
    <mesh position={[rx, rr, -0.08]} rotation={[PI / 2, 0, -un * 18]}><cylinderGeometry args={[rr, rr, 0.2, 40]} /><meshPhysicalMaterial color="#e2d8c4" roughness={0.3} sheen={0.6} sheenColor="#fff4dc" /></mesh>
  </>;
}}</Scene3D>;

// ---- 20:01 · CADA FRASCO CON SU DESTINO: un viaje, un cumpleaños, Navidad; caen monedas en cada uno y la tapa no deja meter la mano ----
export const HCoinyear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0, 0.15, 0], az: [0.15, -0.1], el: [0.2, 0.16], r: [0.86, 0.74], fov: 30 }}>{(tt) => {
  const grab = eio(tt, 3.6, 4.3) * (1 - eio(tt, 4.6, 5.2)), slam = phys(tt, 4.25, 9, 0.35);
  return <>
    {[-0.2, 0, 0.2].map((x, i) => { const n = Math.floor(cl((tt - 0.4 - i * 0.3) / 2.6) * 6), lidUp = i === 1 ? 0.07 * eio(tt, 3.3, 3.7) * (1 - cl(slam)) : 0; return <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.055, 0.055, 0.14, 40]} />{M.glass({ op: 0.2 })}</mesh>
      {Array.from({ length: n }, (_, k) => <group key={k} position={[(rn(i * 9 + k, 2) - 0.5) * 0.05, 0.006 + k * 0.004, (rn(i * 9 + k, 3) - 0.5) * 0.05]} rotation={[0.2 * rn(k, 4), 0, 0.2]} scale={1.5}><Coin col={k % 3 ? "#c9cbcf" : "#b8733a"} /></group>)}
      {/* la tapa lleva el destino encima: autito, torta con vela, arbolito */}
      <group position={[0, 0.145 + lidUp, 0]}>
        <mesh><cylinderGeometry args={[0.058, 0.058, 0.012, 40]} /><meshStandardMaterial color={["#2d5d9a", "#c0392b", "#3d6e3a"][i]} metalness={0.4} roughness={0.4} /></mesh>
        {i === 0 && <group position={[0, 0.02, 0]}><RBox s={[0.06, 0.018, 0.03]} p={[0, 0, 0]} r={0.006}>{M.plastic({ col: "#e8c43a" })}</RBox><RBox s={[0.032, 0.014, 0.026]} p={[-0.004, 0.014, 0]} r={0.005}>{M.glass({ op: 0.5 })}</RBox>{[-0.02, 0.02].map((xx) => [-0.016, 0.016].map((z) => <mesh key={xx + "" + z} position={[xx, -0.009, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.007, 0.007, 0.005, 14]} /><meshStandardMaterial color="#1c1a18" /></mesh>))}</group>}
        {i === 1 && <group position={[0, 0.02, 0]}><mesh><cylinderGeometry args={[0.026, 0.026, 0.025, 28]} /><meshStandardMaterial color="#f6e7d2" roughness={0.6} /></mesh><mesh position={[0, 0.014, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.024, 0.004, 6, 24]} /><meshStandardMaterial color="#e9a9b9" /></mesh><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.002, 0.002, 0.02, 6]} /><meshStandardMaterial color="#5d86c4" /></mesh><mesh position={[0, 0.044, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.004, 8, 6]} />{M.glow({ col: "#ffcf6a" })}</mesh></group>}
        {i === 2 && <group position={[0, 0.006, 0]}>{[0, 1, 2].map((k) => <mesh key={k} position={[0, 0.018 + k * 0.014, 0]}><coneGeometry args={[0.026 - k * 0.007, 0.024, 16]} /><meshStandardMaterial color="#2f6b34" roughness={0.6} /></mesh>)}<mesh position={[0, 0.06, 0]}><octahedronGeometry args={[0.005, 0]} />{M.glow({ col: "#ffd34a" })}</mesh></group>}
      </group>
      {/* moneda que cae en cada frasco (la tapa se abre un instante) */}
      {Array.from({ length: 3 }, (_, k) => { const u = cl((tt - 0.5 - i * 0.3 - k * 0.9) / 0.6); return u <= 0 || u >= 1 ? null : <group key={"c" + k} position={[0, lerp(0.38, 0.05, u), 0]} rotation={[u * 8, 0, 0]} scale={1.6}><Coin col={k % 2 ? "#c9cbcf" : "#b8733a"} /></group>; })}
    </group>; })}
    {/* la mano que se acerca al del medio y la tapa que se cierra de un golpe */}
    <group visible={tt > 3.3} position={[0.1 - 0.06 * grab, 0.3 - 0.07 * grab, 0.08 - 0.05 * grab]} rotation={[-0.4, 0.8, 0]} scale={1.3}><Hand curl={0.3 + 0.5 * cl(slam)} /></group>
  </>;
}}</Scene3D>;
