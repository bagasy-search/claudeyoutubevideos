// lfh29b · componentes únicos 13-18 (la colita de hilo por la tapa, el rodillo que estampa flores, la gomita que abre el frasco, la gomita sobre la lata de pintura, los clips con fecha, el clip en la punta de la cinta).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Can, Hand } from "./bk";

const PI = Math.PI;

// ---- 8:23 · LA COLITA: el ovillo baja a la lata, la tapa con agujero se cierra y la punta del hilo asoma y se mueve ----
export const HStringtail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0, 0.15, 0], az: [-0.3, 0.2], el: [0.3, 0.36], r: [0.5, 0.4], fov: 30 }}>{(tt) => {
  const ball = phys(tt, 0.3, 7, 0.45), lid = phys(tt, 1.5, 7, 0.4), tail = eio(tt, 2.4, 3.4), pull = eio(tt, 3.8, 5.2);
  const L = 0.03 + 0.05 * tail + 0.12 * pull, w = Math.sin(tt * 3.4) * 0.012 * (1 - pull);
  const pts = [[0.02, 0.15, 0.0], [0.02 + w, 0.15 + L * 0.4, 0], [0.025 + w * 1.6 + 0.08 * pull, 0.15 + L * 0.75, 0.01], [0.03 + w * 2 + 0.16 * pull, 0.15 + L, 0.02]];
  return <>
    <Can col="#2d5d9a" r={0.065} h={0.15} side />
    <mesh position={[0, 0.15 + (1 - ball) * 0.3 - 0.07 * ball, 0]}><sphereGeometry args={[0.05, 28, 20]} /><meshStandardMaterial map={tex.text("twine2", 256, 256, (g) => { g.fillStyle = "#d8c49a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#a88d5c"; g.lineWidth = 2.5; for (let k = 0; k < 60; k++) { g.beginPath(); g.moveTo(0, k * 5); g.bezierCurveTo(80, k * 5 - 20, 170, k * 5 + 30, 256, k * 5 + 8); g.stroke(); } })} roughness={0.95} /></mesh>
    {/* tapa con el agujero */}
    <group position={[0, 0.155 + (1 - lid) * 0.2, 0]} rotation={[(1 - cl(lid)) * 0.6, 0, 0]}>
      <mesh rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.006, 0.068, 40]} /><meshStandardMaterial color="#2d5d9a" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.068, 0.004, 6, 40]} /><meshStandardMaterial color="#2d5d9a" metalness={0.4} roughness={0.4} /></mesh>
    </group>
    {tt > 2.4 && <mesh geometry={tubeG("tail" + Math.round(tt * 15), pts.map(([x, y, z]) => [x - 0.02, y, z]), 0.0048, 30, 8)}><meshStandardMaterial color="#8a5a2b" roughness={0.95} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 8:56 · FLORES EN LAS BOLSAS: un rodillo de imprenta pasa sobre la tela lisa y deja el estampado detrás ----
export const HFeedprint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0, 0.04, 0], az: [-0.2, 0.15], el: [0.7, 0.6], r: [0.86, 0.76], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.2), x = lerp(-0.26, 0.22, k);
  const flowers = tex.text("flw", 512, 256, (g) => { g.fillStyle = "#efe2c4"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 40; i++) { const cx = rn(i, 2) * 512, cy = rn(i, 3) * 256, c = ["#d9677a", "#5d86c4", "#e4a23a"][i % 3]; g.fillStyle = c; for (let p = 0; p < 5; p++) { g.beginPath(); g.arc(cx + Math.cos(p * 1.26) * 11, cy + Math.sin(p * 1.26) * 11, 8, 0, 6.3); g.fill(); } g.fillStyle = "#f6e27a"; g.beginPath(); g.arc(cx, cy, 5, 0, 6.3); g.fill(); g.fillStyle = "#5c8a4a"; g.fillRect(cx + 8, cy + 10, 14, 5); } });
  return <>
    {/* la tela lisa entera y, encima, la parte ya estampada que crece detrás del rodillo */}
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.3]} /><meshStandardMaterial color="#e8dcc0" roughness={0.95} /></mesh>
    <mesh position={[(x - 0.3) / 2, 0.0035, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, (x + 0.3) / 0.6), 1, 1]}><planeGeometry args={[0.6, 0.3]} /><meshStandardMaterial map={flowers} roughness={0.95} /></mesh>
    {/* rodillo con el grabado, mango y horquilla */}
    <group position={[x, 0.04, 0]}>
      <mesh rotation={[PI / 2, 0, -k * 12]}><cylinderGeometry args={[0.038, 0.038, 0.32, 40]} /><meshStandardMaterial map={flowers} roughness={0.5} metalness={0.2} /></mesh>
      {[-0.17, 0.17].map((z) => <RBox key={z} s={[0.012, 0.09, 0.01]} p={[0, 0.045, z]} r={0.003}>{M.steel()}</RBox>)}
      <mesh position={[0, 0.09, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.35, 8]} />{M.steel()}</mesh>
      <mesh position={[-0.1, 0.17, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.012, 0.012, 0.18, 14]} />{M.wood({ base: [150, 100, 58] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 9:34 · EL FRASCO TRABADO: la gomita roja calza en la tapa, la tapa gira y salta ----
export const HJargrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0, 0.2, 0], az: [0.3, -0.1], el: [0.42, 0.34], r: [0.92, 0.8], fov: 30 }}>{(tt) => {
  const band = eio(tt, 0.5, 1.5), turn = eio(tt, 2.0, 3.4), pop = phys(tt, 3.5, 6, 0.35), shake = tt > 1.6 && tt < 2.0 ? Math.sin(tt * 60) * 0.03 : 0;
  return <>
    {/* frasco de pickles */}
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.06, 0.06, 0.16, 40]} />{M.glass({ op: 0.3 })}</mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.3) * 0.03, 0.07, Math.sin(i * 1.3) * 0.03]} rotation={[0.1 * i, 0, 0.1]}><capsuleGeometry args={[0.012, 0.09, 8, 14]} /><meshStandardMaterial color="#5f7d2e" roughness={0.6} /></mesh>)}
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.057, 0.057, 0.13, 32]} />{M.water({ col: "#c8c96a", op: 0.35 })}</mesh>
    <group position={[0, 0.172 + 0.08 * cl(pop), 0]} rotation={[0.4 * cl(pop), turn * PI * 1.5 + shake, 0.2 * cl(pop)]}>
      <mesh><cylinderGeometry args={[0.064, 0.064, 0.025, 40]} /><meshStandardMaterial map={tex.text("ridge", 256, 32, (g) => { g.fillStyle = "#c9a43a"; g.fillRect(0, 0, 256, 32); g.fillStyle = "#7d6520"; for (let i = 0; i < 256; i += 8) g.fillRect(i, 0, 3, 32); })} metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[0, 0.0126, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.064, 40]} /><meshStandardMaterial color="#d6b44c" metalness={0.7} roughness={0.3} /></mesh>
      {/* marca roja en la tapa para que se vea girar */}
      <mesh position={[0.035, 0.0135, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.05, 0.012]} /><meshStandardMaterial color="#c2302a" roughness={0.5} /></mesh>
      {/* la gomita gruesa que baja y se estira alrededor */}
      <mesh position={[0, 0.06 * (1 - band), 0]} rotation={[PI / 2, 0, 0]} scale={[lerp(0.6, 1, band), lerp(0.6, 1, band), 1]}><torusGeometry args={[0.066, 0.006, 10, 48]} />{M.rubber({ col: "#c2302a" })}</mesh>
    </group>
    {/* la mano que gira (sólo dedos sobre la tapa) */}
    <group position={[0, 0.2 + 0.08 * cl(pop), 0]} rotation={[0, turn * PI * 1.5, 0]}>
      <group visible={tt > 1.2} position={[0, 0.03 + 0.12 * (1 - eio(tt, 1.2, 1.7)), 0.02]} rotation={[0, 2.4, 0]} scale={1.25}><Hand curl={0.9} /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 9:50 · LA LATA DE PINTURA: la gomita cruzada en la boca; el pincel se escurre ahí y el borde queda limpio ----
export const HPaintrim: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [0, 0.22, 0], az: [0.3, -0.05], el: [0.5, 0.4], r: [0.98, 0.86], fov: 30 }}>{(tt) => {
  const band = phys(tt, 0.4, 8, 0.4), wipe = Math.max(0, Math.sin((tt - 1.6) * 2.6)) * (tt > 1.6 && tt < 4.6 ? 1 : 0), by = 0.25 - 0.06 * wipe + 0.05 * eio(tt, 4.6, 5.4);
  return <>
    {/* lata de pintura con la pintura azul */}
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.09, 0.09, 0.16, 48, 1, true]} />{M.steel({ col: "#c4c7ca", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.14, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.088, 48]} /><meshPhysicalMaterial color="#2f6fb0" roughness={0.15} clearcoat={1} /></mesh>
    <mesh position={[0, 0.16, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.089, 0.005, 8, 48]} />{M.steel()}</mesh>
    {/* gomita cruzada de lado a lado, que se estira cuando el pincel la usa */}
    <mesh position={[0, 0.163 - 0.008 * wipe, 0]} rotation={[0, 0, PI / 2]} scale={[1, Math.max(0.02, band), 1]}><cylinderGeometry args={[0.0055, 0.0055, 0.185, 10]} />{M.rubber({ col: "#c2302a" })}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.09, 0.12, 0]}><cylinderGeometry args={[0.003, 0.003, 0.085, 8]} />{M.rubber({ col: "#c2302a" })}</mesh>)}
    {/* pincel */}
    <group position={[0.01, by, 0.01]} rotation={[0.1, 0, 0.12]}>
      <RBox s={[0.06, 0.04, 0.012]} p={[0, 0, 0]} r={0.003}><meshStandardMaterial color="#2f6fb0" roughness={0.6} /></RBox>
      <RBox s={[0.062, 0.025, 0.014]} p={[0, 0.032, 0]} r={0.002}>{M.steel()}</RBox>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.01, 0.014, 0.09, 14]} />{M.wood({ base: [196, 150, 96] })}</mesh>
    </group>
    {/* las gotas vuelven a la lata (nunca al borde) */}
    {Array.from({ length: 6 }, (_, i) => { const u = ((tt - 1.6) * 1.3 + i / 6) % 1; return tt < 1.7 || tt > 4.8 ? null : <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.04, lerp(0.16, 0.14, u), (rn(i, 3) - 0.5) * 0.03]}><sphereGeometry args={[0.004, 10, 8]} /><meshPhysicalMaterial color="#2f6fb0" roughness={0.1} clearcoat={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 10:42 · LOS CLIPS CON FECHA: bolsas de choclo en el freezer; el lápiz escribe la fecha en el clip y la más vieja sale primero ----
const DATES = ["JUL 12", "AUG 3", "AUG 21", "SEP 9"];
export const HDateclip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#24323c" key1={[-0.6, 1.8, 1.4]}
  cam={{ at: [0.1, 0.03, 0.08], az: [0.45, -0.2], el: [0.9, 0.78], r: [0.86, 0.78], fov: 30 }}>{(tt) => {
  const write = eio(tt, 0.6, 2.4), first = eio(tt, 3.0, 4.2);
  const corn = tex.text("cornbag", 256, 128, (g) => { g.fillStyle = "#e8f0f2"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 520; i++) { g.fillStyle = ["#f2c430", "#e8b52a", "#f6d45a"][i % 3]; g.beginPath(); g.ellipse(rn(i, 2) * 256, 10 + rn(i, 3) * 108, 5, 4, rn(i, 4) * 3, 0, 6.3); g.fill(); } g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(0, 0, 256, 10); g.fillRect(0, 118, 256, 10); });
  return <>
    {/* el estante del freezer con escarcha */}
    <RBox s={[0.9, 0.02, 0.55]} p={[0, -0.01, 0]} r={0.004}><meshStandardMaterial color="#eef4f7" roughness={0.3} /></RBox>
    {DATES.map((d, i) => { const z = -0.17 + i * 0.11 + (i === 0 ? 0.2 * first : 0), y = i === 0 ? 0.11 * first : 0; return <group key={i} position={[0, y, z]}>
      {/* bolsa transparente llena de granos de choclo, con el cuello retorcido */}
      <RBox s={[0.28, 0.035, 0.09]} p={[-0.02, 0.018, 0]} r={0.016}><meshPhysicalMaterial map={corn} roughness={0.25} clearcoat={0.8} /></RBox>
      <mesh position={[0.135, 0.018, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.02, 0.04, 12]} /><meshPhysicalMaterial color="#e8f0f2" roughness={0.3} transparent opacity={0.7} /></mesh>
      {/* el clip de pan grande con la fecha a lápiz */}
      <group position={[0.21, 0.02, 0]} scale={1.45}>
        <RBox s={[0.075, 0.005, 0.06]} p={[0, 0, 0]} r={0.004}><meshStandardMaterial color="#ffe36a" roughness={0.5} /></RBox>
        <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.072, 0.056]} /><meshBasicMaterial transparent map={tex.text("clipb" + i + (i === 3 ? Math.floor(write * 6) : 9), 160, 128, (g) => { g.fillStyle = "#26231f"; g.font = "800 40px 'Comic Sans MS', cursive"; g.textAlign = "center"; g.fillText(i === 3 ? d.slice(0, Math.floor(write * 6)) : d, 80, 78); })} /></mesh>
      </group>
    </group>; })}
    {/* lápiz escribiendo en el clip de adelante */}
    <group visible={tt < 2.8} position={[0.19 + 0.02 * Math.sin(tt * 14), 0.035, 0.16 - 0.02 + 0.04 * write]} rotation={[0.4, 0, -0.8]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.006, 0.006, 0.12, 6]} /><meshStandardMaterial color="#e8b52a" roughness={0.5} /></mesh>
      <mesh position={[0, -0.005, 0]}><coneGeometry args={[0.006, 0.016, 6]} /><meshStandardMaterial color="#e9cfa2" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 10:55 · NUNCA MÁS PERDER LA PUNTA: el clip de pan se calza en la punta del rollo de cinta, que gira y la deja a la vista ----
export const HTapeend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#1a1714" key1={[-0.5, 1.4, 1.2]}
  cam={{ at: [0.02, 0.06, 0], az: [-0.35, 0.2], el: [0.3, 0.18], r: [0.52, 0.42], fov: 30 }}>{(tt) => {
  const clip = phys(tt, 0.8, 7, 0.4), roll = eio(tt, 2.4, 4.8), spin = -roll * 0.16 / 0.055;
  return <group position={[-0.08 + 0.16 * roll, 0.055, 0]} rotation={[0, 0, spin]}>
    {/* rollo de cinta de papel: cartón adentro, cinta afuera */}
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.035, 48, 1, true]} /><meshStandardMaterial color="#e6d3a6" roughness={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.032, 0.032, 0.036, 40, 1, true]} /><meshStandardMaterial color="#a88a5c" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0, sd * 0.0176]} rotation={[sd > 0 ? 0 : PI, 0, 0]}><ringGeometry args={[0.032, 0.055, 48]} /><meshStandardMaterial map={tex.text("tapes", 128, 128, (g) => { g.fillStyle = "#dcc89a"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "rgba(150,120,70,.35)"; for (let r = 4; r < 64; r += 3) { g.beginPath(); g.arc(64, 64, r, 0, 6.3); g.stroke(); } })} roughness={0.8} /></mesh>)}
    {/* la punta de la cinta, levantadita */}
    <mesh position={[0.012, 0.06, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.03, 0.0015, 0.035]} /><meshStandardMaterial color="#e6d3a6" roughness={0.8} /></mesh>
    {/* clip de pan azul que llega y la pellizca */}
    <group position={[0.03 + (1 - clip) * 0.12, 0.064 + (1 - clip) * 0.08, 0]} rotation={[0, 0, -0.35]} scale={2.6}>
      <RBox s={[0.03, 0.003, 0.034]} p={[0, 0, 0]} r={0.003}><meshStandardMaterial color="#2d6fd0" roughness={0.4} /></RBox>
      <mesh position={[-0.008, 0.0016, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.006, 16]} /><meshBasicMaterial color="#c6a874" /></mesh>
    </group>
  </group>;
}}</Scene3D>;
