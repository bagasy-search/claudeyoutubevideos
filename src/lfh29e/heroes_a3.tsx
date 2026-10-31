// lfh29e · componentes únicos 15-21 (el foso del azucarero, los túneles del hormiguero, las raíces del rosal, la lámpara de las pulgas, la cuenta de la mañana, los pimientos quemados, las colmenas)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Leaf, Ant } from "./ek";

const PI = Math.PI;

// ---- 9:05 · EL FOSO DEL AZUCARERO: el azucarero se apoya en una fuente con agua; las hormigas llegan al borde y dan la vuelta ----
export const HSugarmoat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none" bg="#1c1814" key1={[-0.6, 1.6, 1.2]} warm={0.8}
  cam={{ at: [0, 0.04, 0], az: [0.4, 0.1], el: [0.6, 0.45], r: [0.7, 0.58], fov: 30 }}>{(tt) => {
  const set = phys(tt, 0.4, 6, 0.45), fill = eio(tt, 1.2, 2.2);
  return <>
    {/* la fuente de enlozado azul y el agua que la llena */}
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.16, 0.14, 0.04, 48, 1, true]} />{M.porcelain({ col: "#3f6684", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.14, 48]} />{M.porcelain({ col: "#4d7898" })}</mesh>
    <mesh position={[0, 0.004 + 0.028 * fill, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.065, 0.155, 48]} />{M.water({ col: "#bcd8ec", op: 0.65 })}</mesh>
    {/* el azucarero que baja al centro */}
    <group position={[0, 0.12 * (1 - cl(set)), 0]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.06, 0.05, 0.1, 32]} />{M.porcelain({ col: "#f2ead8" })}</mesh>
      <mesh position={[0, 0.112, 0]}><cylinderGeometry args={[0.062, 0.062, 0.012, 32]} />{M.porcelain({ col: "#c8a24a" })}</mesh>
      <mesh position={[0, 0.125, 0]}><sphereGeometry args={[0.012, 12, 10]} />{M.porcelain({ col: "#c8a24a" })}</mesh>
    </group>
    {/* hormigas que llegan desde afuera, tocan el agua y se dan vuelta */}
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * PI * 2 + 0.3, ph = ((tt - 2.2 - i * 0.18) / 1.6), u = ph < 0 ? 0 : ph < 1 ? ph : 1 - Math.min(1, ph - 1), r = lerp(0.36, 0.165, u), back = ph > 1;
      return <group key={i} visible={tt > 2.2 + i * 0.18} position={[Math.cos(a) * r, 0.002, Math.sin(a) * r]} rotation={[0, -a + (back ? 0 : PI), 0]} scale={2.2}><Ant step={tt + i} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 9:40 · LOS TÚNELES: corte del hormiguero en la tierra; el agua jabonosa baja por cada galería ----
export const HTunnels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16110c" key1={[-0.6, 1.4, 1.6]}
  cam={{ at: [0, 0.0, 0], az: [0.05, -0.05], el: [0.06, 0.04], r: [0.86, 0.76], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.5, 1.4) * (1 - eio(tt, 4.4, 5.0)), flow = eio(tt, 1.2, 5.4);
  const G = [[[0, 0.2], [0.02, 0.1], [-0.06, 0.02], [-0.16, -0.06]], [[0.02, 0.1], [0.12, 0.04], [0.2, -0.04]], [[-0.06, 0.02], [-0.02, -0.1], [0.06, -0.18]], [[-0.16, -0.06], [-0.26, -0.14]]];
  return <>
    {/* el bloque de tierra en corte, con capas */}
    <mesh position={[0, -0.02, -0.02]}><boxGeometry args={[0.8, 0.46, 0.02]} /><meshStandardMaterial map={tex.text("soilcut", 256, 160, (g) => { const gr = g.createLinearGradient(0, 0, 0, 160); gr.addColorStop(0, "#9a7148"); gr.addColorStop(1, "#6a4a2c"); g.fillStyle = gr; g.fillRect(0, 0, 256, 160); for (let i = 0; i < 300; i++) { g.fillStyle = rn(i, 2) > 0.5 ? "rgba(160,130,90,.5)" : "rgba(30,20,10,.5)"; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 160, 2, 2); } })} roughness={1} /></mesh>
    <mesh position={[0, 0.215, 0]}><boxGeometry args={[0.8, 0.012, 0.06]} /><meshStandardMaterial color="#4c6a2c" roughness={1} /></mesh>
    {/* las galerías oscuras y el agua azul que las va llenando */}
    {G.map((g, i) => { const pts = g.map(([x, y]) => [x, y, 0.0]); const kf = cl(flow * 1.6 - i * 0.25);
      return <group key={i}>
        <mesh geometry={tubeG("tun" + i, pts, 0.024, 40, 8)}><meshStandardMaterial color="#20140a" roughness={1} /></mesh>
        {kf > 0.02 && <mesh geometry={tubeG("tunw" + i + Math.round(kf * 20), pts.slice(0, Math.max(2, Math.ceil(kf * pts.length))).map(([x, y, z]) => [x, y, z + 0.012]), 0.02, 40, 8)}><meshStandardMaterial color="#6cc4ff" emissive="#2a78c0" emissiveIntensity={0.7} roughness={0.15} /></mesh>}
      </group>; })}
    {/* el balde que vuelca arriba */}
    <group position={[0.06, 0.36, 0]} rotation={[0, 0, 0.9 * pour]}>
      <mesh><cylinderGeometry args={[0.07, 0.06, 0.1, 32, 1, true]} />{M.steel({ col: "#9aa1a6", side: THREE.DoubleSide })}</mesh>
    </group>
    <mesh visible={pour > 0.3} position={[0.0, 0.27, 0]}><cylinderGeometry args={[0.008, 0.012, 0.12, 10]} />{M.water({ col: "#9fd0f2", op: 0.8 })}</mesh>
    {/* hormigas que suben y escapan por arriba */}
    {Array.from({ length: 8 }, (_, i) => { const u = cl((tt - 2 - i * 0.3) / 1.4); return <group key={i} visible={u > 0 && u < 1} position={[lerp(-0.1 + i * 0.03, 0.3 + i * 0.03, u), 0.222, 0.01]} rotation={[PI / 2, 0, 0]} scale={2}><Ant step={tt + i} col="#2a1510" /></group>; })}
  </>;
}}</Scene3D>;

// ---- 10:17 · LAS RAÍCES DEL ROSAL: corte del cantero; el agua jabonosa avanza por la tierra y las raíces se ponen marrones donde llega ----
export const HRoots: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16110c" key1={[-0.7, 1.4, 1.4]}
  cam={{ at: [0, 0.1, 0], az: [-0.1, 0.08], el: [0.06, 0.04], r: [1.0, 0.9], fov: 30 }}>{(tt) => {
  const soak = eio(tt, 0.8, 4.2), stop = eio(tt, 4.4, 5.4);
  const R = Array.from({ length: 9 }, (_, i) => { const a = -PI / 2 + (i - 4) * 0.28; return [[0, 0.06, 0], [Math.cos(a) * 0.08, 0.06 + Math.sin(a) * 0.08, 0.005], [Math.cos(a) * 0.18 + 0.02 * rn(i, 2), 0.06 + Math.sin(a) * 0.2, 0.01]]; });
  return <>
    <mesh position={[0, -0.04, -0.03]}><boxGeometry args={[0.8, 0.36, 0.02]} /><meshStandardMaterial color="#8a6440" roughness={1} /></mesh>
    {/* la mancha de agua jabonosa que se expande desde la izquierda (donde estaba el hormiguero) */}
    <mesh position={[-0.4 + 0.33 * soak, -0.04, -0.019]} scale={[soak + 0.001, 1, 1]}><planeGeometry args={[0.66, 0.36]} /><meshStandardMaterial map={tex.text("wetfront", 256, 140, (g) => { g.clearRect(0, 0, 256, 140); g.fillStyle = "rgba(52,32,16,0.9)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(200, 0); for (let y = 0; y <= 140; y += 10) g.lineTo(200 + 40 * Math.sin(y * 0.07) + 14 * Math.sin(y * 0.23), y); g.lineTo(0, 140); g.closePath(); g.fill(); for (let i = 0; i < 120; i++) { g.fillStyle = "rgba(200,220,235,.25)"; g.fillRect(rn(i, 2) * 200, rn(i, 3) * 140, 2, 2); } })} roughness={0.3} transparent depthWrite={false} /></mesh>
    {/* raíces que se tiñen de marrón a medida que el agua las toca */}
    {R.map((pts, i) => { const reach = pts[2][0] < -0.36 + 0.2 * soak + 0.32 * soak - 0.1; return <mesh key={i} geometry={tubeG("root" + i, pts, (u: number) => 0.007 * (1 - u * 0.7), 30, 6)}><meshStandardMaterial color={reach ? "#4a2a14" : "#e8d2a8"} roughness={0.8} /></mesh>; })}
    {/* el rosal arriba: hojas que se ponen mustias con las raíces dañadas */}
    <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.006, 0.008, 0.36, 10]} /><meshStandardMaterial color="#3c6a28" /></mesh>
    <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.8, 0.012, 0.06]} /><meshStandardMaterial color="#4c6a2c" roughness={1} /></mesh>
    {[[-0.05, 0.28, 0.8], [0.05, 0.32, -0.8], [-0.04, 0.38, 0.6], [0.04, 0.4, -0.5]].map(([x, y, r], i) => <group key={i} position={[x, y, 0.01]} rotation={[0, 0, r + 0.5 * soak * Math.sign(r)]}><group scale={1.4}><Leaf dull={soak * 0.8} /></group></group>)}
    {/* la flecha de «acá no» que se cierra: una pala que traza la línea de distancia */}
  </>;
}}</Scene3D>;

// ---- 10:57 · A LA LUZ Y AL CALOR: noche oscura, la lamparita sobre el plato; las pulgas saltan desde la alfombra al agua ----
export const HLampfleas: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#07080b" key1={[-0.4, 0.8, 1.0]} warm={0.25}
  cam={{ at: [0, 0.06, 0], az: [0.4, 0.1], el: [0.3, 0.22], r: [0.7, 0.58], fov: 30 }}>{(tt) => {
  const on = eio(tt, 0.3, 0.9), F = 14;
  return <>
    {/* el plato blanco con agua jabonosa */}
    <mesh position={[0, 0.008, 0]}><cylinderGeometry args={[0.1, 0.08, 0.016, 40]} />{M.porcelain({ col: "#e8e2d4" })}</mesh>
    <mesh position={[0, 0.0165, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.088, 40]} />{M.water({ col: "#cfe0e8", op: 0.7 })}</mesh>
    {/* la lamparita de escritorio inclinada sobre el plato */}
    <group position={[-0.12, 0, -0.06]}>
      <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.04, 0.045, 0.012, 24]} /><meshStandardMaterial color="#2a2a2a" roughness={0.4} /></mesh>
      <mesh position={[0.03, 0.1, 0.02]} rotation={[0, 0, -0.4]}><cylinderGeometry args={[0.004, 0.004, 0.2, 8]} />{M.brass()}</mesh>
      <mesh position={[0.08, 0.19, 0.04]} rotation={[0, 0, -2.2]}><coneGeometry args={[0.04, 0.05, 24, 1, true]} /><meshStandardMaterial color="#2f6a3a" roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.095, 0.175, 0.045]}><sphereGeometry args={[0.012, 12, 10]} />{M.glow({ col: "#ffd890", op: on })}</mesh>
    </group>
    <pointLight position={[0, 0.16, 0]} intensity={0.9 * on} distance={0.6} color="#ffcf88" />
    {/* el cono de luz cálida sobre el plato */}
    <mesh position={[-0.01, 0.09, 0]} rotation={[0, 0, 0.35]}><cylinderGeometry args={[0.01, 0.11, 0.17, 24, 1, true]} /><meshBasicMaterial color="#ffd890" transparent opacity={0.12 * on} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {/* las pulgas: saltan en arco desde la alfombra y caen al agua */}
    {Array.from({ length: F }, (_, i) => { const a = rn(i, 2) * PI * 2, r0 = 0.24 + 0.08 * rn(i, 3), k = cl((tt - 1.2 - i * 0.3) / 0.5), r = lerp(r0, 0.05 * rn(i, 4), k);
      return <mesh key={i} position={[Math.cos(a) * r, 0.004 + Math.sin(k * PI) * 0.14 + (k >= 1 ? 0.014 : 0), Math.sin(a) * r]} scale={[1.2, 0.8, 0.8]}><sphereGeometry args={[0.0045, 8, 6]} /><meshStandardMaterial color="#1a100a" roughness={0.4} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 11:25 · LA CUENTA DE LA MAÑANA: amanece; en el plato flotan los puntitos y se van contando en el tambor ----
export const HFleacount: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#2a2420" key1={[-0.8, 1.4, 1.2]} warm={0.9}
  cam={{ at: [0.04, 0.04, 0], az: [0.1, -0.15], el: [0.9, 0.7], r: [0.52, 0.44], fov: 30 }}>{(tt) => {
  const dawn = eio(tt, 0.2, 1.4), count = Math.floor(eio(tt, 1.6, 5.0) * 12);
  return <>
    <mesh position={[0, 0.008, 0]}><cylinderGeometry args={[0.12, 0.095, 0.016, 40]} />{M.porcelain({ col: "#e8e2d4" })}</mesh>
    <mesh position={[0, 0.0165, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.106, 40]} />{M.water({ col: "#cfe0e8", op: 0.7 })}</mesh>
    {/* la franja de sol de la mañana que entra por la ventana */}
    <mesh position={[0.06, 0.018, -0.02]} rotation={[-PI / 2, 0, 0.5]} scale={[dawn + 0.001, 1, 1]}><planeGeometry args={[0.5, 0.12]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.25 * dawn} depthWrite={false} /></mesh>
    {/* doce puntitos negros; cada uno que se cuenta tiene un aro */}
    {Array.from({ length: 12 }, (_, i) => { const a = i * 2.4, r = 0.075 * Math.sqrt((i + 0.5) / 12), x = Math.cos(a) * r, z = Math.sin(a) * r;
      return <group key={i} position={[x, 0.018, z]}>
        <mesh scale={[1.2, 0.7, 0.8]}><sphereGeometry args={[0.005, 8, 6]} /><meshStandardMaterial color="#1a100a" /></mesh>
        <mesh rotation={[-PI / 2, 0, 0]} visible={i < count} scale={i === count - 1 ? 1.4 : 1}><ringGeometry args={[0.009, 0.0115, 20]} /><meshBasicMaterial color="#c2302a" /></mesh>
      </group>; })}
    {/* el contador mecánico de tambor */}
    <group position={[0.2, 0.03, 0.06]} rotation={[-0.5, -0.3, 0]}>
      <RBox s={[0.08, 0.05, 0.04]} p={[0, 0, 0]} r={0.008}>{M.wood({ base: [120, 76, 40] })}</RBox>
      {[0, 1].map((d) => { const v = d === 0 ? Math.floor(count / 10) : count % 10; return <group key={d} position={[-0.016 + d * 0.032, 0, 0.021]}>
        <RBox s={[0.026, 0.034, 0.004]} p={[0, 0, 0]} r={0.003}><meshStandardMaterial color="#f6f1e4" /></RBox>
        <mesh position={[0, 0, 0.003]}><planeGeometry args={[0.024, 0.032]} /><meshBasicMaterial transparent map={tex.text("fc" + v, 64, 80, (g) => { g.fillStyle = "#1c1a16"; g.font = "800 64px Georgia"; g.textAlign = "center"; g.fillText(String(v), 32, 64); })} /></mesh>
      </group>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 12:04 · DEMASIADO JABÓN QUEMA: tres hojas de pimiento; la de la dosis justa sigue verde, la cargada se arruga y se tuesta ----
export const HPeppers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2a2216" key1={[-0.6, 1.6, 1.2]} warm={0.9}
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.1], el: [0.12, 0.08], r: [0.72, 0.62], fov: 30 }}>{(tt) => {
  const burn = eio(tt, 1.6, 4.6);
  const P = [{ x: -0.18, dose: 1, d: 0 }, { x: 0.18, dose: 4, d: 1 }];
  return <>
    <mesh position={[0, -0.02, -0.1]} rotation={[-PI / 2 + 0.05, 0, 0]}><planeGeometry args={[3, 1]} /><meshStandardMaterial color="#5a4024" roughness={1} /></mesh>
    {P.map((p, i) => <group key={i} position={[p.x, 0, 0]}>
      {/* la planta: tallo, hojas, un pimiento rojo */}
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.006, 0.008, 0.2, 10]} /><meshStandardMaterial color="#3c6a28" /></mesh>
      {[[0.04, 0.12, -0.8], [-0.04, 0.16, 0.8], [0.03, 0.2, -0.5], [-0.03, 0.22, 0.6]].map(([x, y, r], j) => <group key={j} position={[x, y, 0.01]} rotation={[0, 0, r * (1 + 0.6 * burn * p.d)]} scale={[1, 1 - 0.35 * burn * p.d, 1]}><group scale={1.5}><Leaf dull={burn * p.d} /></group></group>)}
      <mesh position={[0.02, 0.08, 0.02]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.018, 16, 12]} /><meshPhysicalMaterial color={p.d ? new THREE.Color("#c8281e").lerp(new THREE.Color("#5a2a14"), burn).getStyle() : "#c8281e"} roughness={0.2} clearcoat={1} /></mesh>
      {/* la cucharita encima con la dosis: 1 o 4 */}
      {Array.from({ length: p.dose }, (_, k) => <mesh key={k} position={[-0.05 + k * 0.033, 0.36, 0]} scale={cl((tt - 0.3 - k * 0.2) / 0.3)}><sphereGeometry args={[0.013, 14, 10]} /><meshPhysicalMaterial color="#58b86a" roughness={0.15} clearcoat={1} /></mesh>)}
      {/* humito de quemado en la cargada */}
      {p.d > 0 && Array.from({ length: 6 }, (_, k) => { const u = (tt * 0.5 + k / 6) % 1; return <mesh key={"s" + k} visible={burn > 0.3} position={[(rn(k, 2) - 0.5) * 0.08, 0.2 + u * 0.12, 0]} scale={0.6 + u}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#8a8070" transparent opacity={0.3 * (1 - u) * burn} depthWrite={false} /></mesh>; })}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 12:33 · LAS COLMENAS DETRÁS DEL GRANERO: dos colmenas blancas; las abejas vuelven al atardecer y recién ahí se rocía ----
export const HBeesgone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#3a2a22" key1={[-0.8, 1.4, 1.2]} warm={0.8}
  cam={{ at: [0, 0.1, 0], az: [0.25, -0.1], el: [0.14, 0.1], r: [1.01, 0.87], fov: 30 }}>{(tt) => {
  const home = eio(tt, 0.6, 3.8), dusk = eio(tt, 2.0, 4.4);
  return <>
    <mesh position={[0, 0.2, -0.5]}><planeGeometry args={[3, 1.2]} /><meshBasicMaterial color={new THREE.Color("#8ab4d8").lerp(new THREE.Color("#d07848"), dusk)} /></mesh>
    <mesh position={[0, -0.02, -0.1]} rotation={[-PI / 2 + 0.05, 0, 0]}><planeGeometry args={[3, 1]} /><meshStandardMaterial color="#4c6a2c" roughness={1} /></mesh>
    {/* el granero rojo de fondo */}
    <group position={[0.1, 0.0, -0.32]}>
      <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.5, 0.24, 0.1]} /><meshStandardMaterial color="#9a2a22" roughness={0.8} /></mesh>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.26, 0.26, 0.1]} /><meshStandardMaterial color="#5a2a1e" roughness={0.8} /></mesh>
    </group>
    {/* dos colmenas de cajones blancos con techito */}
    {[-0.2, -0.04].map((x, i) => <group key={i} position={[x, 0, 0]}>
      {[0, 1, 2].map((k) => <RBox key={k} s={[0.12, 0.05, 0.1]} p={[0, 0.026 + k * 0.052, 0]} r={0.004}><meshStandardMaterial color={k % 2 ? "#f0ead8" : "#e6dcc4"} roughness={0.7} /></RBox>)}
      <RBox s={[0.14, 0.014, 0.12]} p={[0, 0.165, 0]} r={0.003}><meshStandardMaterial color="#8a8f94" metalness={0.5} roughness={0.4} /></RBox>
      <mesh position={[0, 0.012, 0.051]}><planeGeometry args={[0.06, 0.008]} /><meshBasicMaterial color="#120e0a" /></mesh>
    </group>)}
    {/* las abejas: vuelan desde las flores a la piquera */}
    {Array.from({ length: 18 }, (_, i) => { const k = cl(home * 1.4 - (i / 18) * 0.4), from = [0.3 + 0.1 * rn(i, 2), 0.1 + 0.15 * rn(i, 3), 0.1 * rn(i, 4)], to = [i % 2 ? -0.2 : -0.04, 0.012, 0.06];
      return <group key={i} visible={k < 1} position={[lerp(from[0], to[0], k), lerp(from[1], to[1], k) + Math.sin(k * PI * 3 + i) * 0.02, lerp(from[2], to[2], k)]}>
        <mesh scale={[1.4, 1, 1]}><sphereGeometry args={[0.006, 10, 8]} /><meshStandardMaterial color="#e2a82a" roughness={0.5} /></mesh>
        <mesh position={[0, 0, 0]} scale={[0.5, 1.02, 1.02]}><sphereGeometry args={[0.006, 10, 8]} /><meshStandardMaterial color="#1a1410" /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.005, sd * 0.004]} rotation={[PI / 2 + sd * 0.5 * Math.sin(tt * 80), 0, 0]}><planeGeometry args={[0.008, 0.006]} />{M.glass({ op: 0.5 })}</mesh>)}
      </group>; })}
    {/* recién cuando no queda ninguna: el rociador entra por la derecha */}
    <mesh position={[0.32, 0.1, 0.05]} visible={dusk > 0.9} rotation={[0, 0, 0.4]}><cylinderGeometry args={[0.02, 0.022, 0.1, 20]} /><meshPhysicalMaterial color="#e6ecf2" roughness={0.3} clearcoat={0.6} /></mesh>
  </>;
}}</Scene3D>;
