// lsm29d · componentes únicos 8-14 (seis años fuera, el versículo más corto, la ventana, «at least» que achica, el abrigo en el frío, una sola mano, la silla plegable).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, paperTex } from "./tg";
import { Person } from "./xg";
import { Book } from "./pg";

const PI = Math.PI;

const yearTex = (y: number) => tex.text("dyear" + y, 512, 256, (g) => {
  g.fillStyle = "#f3eee2"; g.fillRect(0, 0, 512, 256);
  g.fillStyle = "#2a2a2a"; g.font = "900 150px Georgia"; g.textAlign = "center"; g.fillText(String(y), 256, 190);
});
// ---- 5:53 · SEIS AÑOS SIN VOLVER: la escalera del sótano y la puerta de arriba con luz; al costado el almanaque de escritorio da vuelta los años de 1982 a 1988 ----
export const HSixyears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" warm={0.7} bg="#141210"
  cam={{ at: [0.1, 0.62, -0.1], at1: [0.18, 0.62, 0.1], az: [0.38, 0.28], el: [0.12, 0.1], r: [1.9, 1.6], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="SHE DIDN'T COME BACK FOR SIX YEARS" col={RED} size={38} />}>{(tt) => {
  const k = cl((tt - 0.8) / 3.4), n = Math.min(6, Math.floor(k * 7)), door = eio(tt, 0.2, 0.9);
  return <>
    {/* la escalera de madera que sube a la puerta */}
    {Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.7, 0.04, 0.22]} r={0.006} p={[-0.3, 0.1 + i * 0.13, -0.1 - i * 0.18]}>{M.wood({ base: [110, 74, 44] })}</RBox>)}
    <RBox s={[0.04, 1.4, 1.5]} r={0.004} p={[-0.67, 0.65, -0.75]}>{M.wood({ base: [90, 60, 36] })}</RBox>
    {/* las paredes de bloque del sótano */}
    <mesh position={[0, 1.0, -1.62]}><planeGeometry args={[3, 2.4]} /><meshStandardMaterial map={tex.text("dblock", 512, 512, (g) => { g.fillStyle = "#8a847a"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#6a655c"; g.lineWidth = 6; for (let y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); for (let x = (y / 64) % 2 ? 0 : 64; x < 512; x += 128) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } } })} roughness={0.95} /></mesh>
    <mesh position={[1.1, 1.0, -0.4]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[2.6, 2.4]} /><meshStandardMaterial color="#7e786e" roughness={0.95} /></mesh>
    <RBox s={[0.7, 0.04, 0.05]} r={0.004} p={[-0.3, 1.92, -1.56]}>{M.wood({ base: [90, 60, 36] })}</RBox>
    {/* la puerta de arriba, abierta, con la luz del día que baja */}
    <mesh position={[-0.3, 1.45, -1.55]}><planeGeometry args={[0.6, 0.9]} />{M.glow({ col: "#fff1d6", op: 0.9 * door })}</mesh>
    <spotLight position={[-0.3, 1.5, -1.45]} target-position={[-0.3, 0.1, 0.2]} angle={0.5} penumbra={0.9} intensity={1 + 5 * door} distance={4} color="#fff1d6" />
    {/* el almanaque de escritorio */}
    <RBox s={[0.8, 0.34, 0.5]} r={0.01} p={[0.22, 0.17, 0.42]} rot={[0, -0.25, 0]}>{M.wood({ base: [96, 66, 40] })}</RBox>
    <group position={[0.22, 0.34, 0.42]} rotation={[0, -0.25, 0]} scale={1.8}>
      <RBox s={[0.36, 0.03, 0.22]} r={0.006} p={[0, 0.015, 0]}>{M.wood({ base: [70, 46, 30] })}</RBox>
      {[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.2, -0.06]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.014, 0.003, 8, 16]} />{M.steel()}</mesh>)}
      {[1982, 1983, 1984, 1985, 1986, 1987, 1988].map((y, i) => { const flip = i < n ? 1 : 0, f = i === n - 1 ? eio(k * 7 - i, 0, 1) : flip;
        return <group key={y} position={[0, 0.2, -0.06 + (6 - i) * 0.0008]} rotation={[-PI * 0.95 * (i < n ? 1 : 0) * (i === n - 1 ? f : 1), 0, 0]} visible={i >= n || i === 6 || (i === n - 1 && f < 0.5)}>
          <mesh position={[0, -0.09, 0.0]}><planeGeometry args={[0.32, 0.16]} /><meshStandardMaterial map={yearTex(y)} roughness={0.8} side={THREE.DoubleSide} /></mesh>
        </group>; })}
    </group>
  </>; }}</Scene3D>;

const verseTex = () => tex.text("djohn11", 1024, 1024, (g) => {
  g.fillStyle = "#f2ead6"; g.fillRect(0, 0, 1024, 1024);
  g.fillStyle = "#3a3026"; g.font = "700 36px Georgia"; g.fillText("JOHN 11", 40, 60);
  g.fillStyle = "rgba(60,48,38,.55)";
  for (let r = 0; r < 18; r++) { const w = 860 - (r % 3) * 60; g.fillRect(40, 110 + r * 48, r === 8 ? 0 : w, 14); }
  g.fillStyle = "#3a3026"; g.font = "700 40px Georgia"; g.fillText("35  Jesus wept.", 40, 110 + 8 * 48 + 16);
});
// ---- 6:25 · EL VERSÍCULO MÁS CORTO: la Biblia abierta en Juan 11; una regla de bronce se acerca y mide el renglón de dos palabras, que se ilumina ----
export const HShortverse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.28}
  cam={{ at: [0, 0.03, 0], at1: [-0.08, 0.03, 0.02], az: [-0.1, 0.05], el: [0.95, 0.88], r: [0.75, 0.6], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="JOHN 11:35 — TWO WORDS" col={AMB} size={40} />}>{(tt) => {
  const rule = eio(tt, 0.8, 2.0), hi = eio(tt, 2.3, 3.0);
  return <>
    <RBox s={[0.62, 0.03, 0.42]} r={0.01} p={[0, 0.015, 0]}><meshStandardMaterial color="#3a1a14" roughness={0.6} /></RBox>
    <mesh position={[0, 0.032, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.58, 0.39]} /><meshStandardMaterial map={verseTex()} color="#a89f8e" roughness={0.9} /></mesh>
    <mesh position={[0, 0.0322, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.004, 0.39]} /><meshBasicMaterial color="#8a7a60" /></mesh>
    {/* el resaltado amarillo sobre «Jesus wept.» */}
    <mesh position={[-0.233 + 0.068 * hi, 0.0335, -0.195 + (110 + 8 * 48 + 4) / 1024 * 0.39]} rotation={[-PI / 2, 0, 0]} visible={hi > 0.01}><planeGeometry args={[0.136 * hi + 0.001, 0.02]} /><meshBasicMaterial color="#ffc93a" transparent opacity={0.6} depthWrite={false} /></mesh>
    <mesh position={[-0.165, 0.034, -0.195 + (110 + 8 * 48 + 4) / 1024 * 0.39]} rotation={[-PI / 2, 0, 0]} visible={hi > 0.01}><planeGeometry args={[0.24, 0.07]} />{M.glow({ col: "#ffb040", op: 0.28 * hi })}</mesh>
    {/* la regla de bronce */}
    <group position={[lerp(0.6, -0.17, rule), 0.036, -0.195 + (110 + 8 * 48 + 66) / 1024 * 0.39]}>
      <RBox s={[0.3, 0.004, 0.022]} r={0.001} p={[0, 0, 0]}>{M.brass()}</RBox>
      {Array.from({ length: 15 }, (_, i) => <mesh key={i} position={[-0.14 + i * 0.02, 0.0025, -0.006]}><boxGeometry args={[0.0015, 0.001, i % 5 ? 0.006 : 0.011]} /><meshBasicMaterial color="#3a2a10" /></mesh>)}
    </group>
    <pointLight position={[-0.16, 0.14, 0.0]} intensity={0.08 + 0.3 * hi} distance={0.45} color="#ffd890" />
  </>; }}</Scene3D>;

// ---- 6:42 · COMO ABRIR UNA VENTANA: la ventana de guillotina sube, la cortina de encaje se infla con el aire y entra la luz ----
export const HWindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.22}
  cam={{ at: [0, 0.95, -1.4], at1: [0, 0.92, -1.35], az: [-0.3, 0.15], el: [0.04, 0.02], r: [1.3, 1.0], fov: 32 }}>{(tt) => {
  const up = eio(tt, 0.6, 2.0), air = eio(tt, 1.6, 2.6), bl = air * (0.8 + 0.2 * Math.sin(tt * 1.8));
  return <>
    {/* el marco blanco y el cielo de afuera */}
    <mesh position={[0, 0.95, -1.585]}><planeGeometry args={[0.7, 1.0]} /><meshBasicMaterial color={new THREE.Color("#5a6e80").lerp(new THREE.Color("#e8c48a"), up)} /></mesh>
    {[[-0.37, 0.95, 0.06, 1.12], [0.37, 0.95, 0.06, 1.12], [0, 1.48, 0.8, 0.06], [0, 0.42, 0.86, 0.07]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.06]} r={0.008} p={[x, y, -1.56]}>{M.wood({ base: [96, 64, 40] })}</RBox>)}
    {/* la hoja de abajo que sube */}
    <group position={[0, 0.7 + 0.46 * up, -1.53]}>
      {[[0, 0.235, 0.7, 0.04], [0, -0.235, 0.7, 0.04], [-0.33, 0, 0.04, 0.5], [0.33, 0, 0.04, 0.5], [0, 0, 0.62, 0.02], [0, 0, 0.02, 0.44]].map(([x, y, w, hh], i) => <RBox key={"sh" + i} s={[w, hh, 0.03]} r={0.004} p={[x, y, 0]}>{M.wood({ base: [120, 82, 50] })}</RBox>)}
      <mesh position={[0, 0, 0.004]}><planeGeometry args={[0.62, 0.43]} /><meshPhysicalMaterial color="#c8d8e4" roughness={0.05} transparent opacity={0.28} clearcoat={1} /></mesh>
      <mesh position={[-0.12, 0.05, 0.006]} rotation={[0, 0, 0.6]}><planeGeometry args={[0.03, 0.5]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} /></mesh>
    </group>
    {/* la cortina de encaje que se infla hacia adentro */}
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.3, 0.98, -1.48 + 0.3 * bl]} rotation={[0.6 * bl, k * 0.4 * bl, 0]}><planeGeometry args={[0.24, 0.96, 6, 12]} /><meshStandardMaterial map={tex.text("dlace", 256, 512, (g) => { g.clearRect(0, 0, 256, 512); g.strokeStyle = "rgba(250,246,236,.95)"; g.lineWidth = 3; for (let y = 16; y < 512; y += 32) for (let x = 16; x < 256; x += 32) { g.beginPath(); g.arc(x + ((y / 32) % 2) * 16, y, 11, 0, 6.3); g.stroke(); } g.fillStyle = "rgba(250,246,236,.35)"; g.fillRect(0, 0, 256, 512); })} roughness={0.9} transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} /></mesh>)}
    <spotLight position={[0, 1.0, -2.2]} target-position={[0, 0, 0.4]} angle={0.5} penumbra={0.9} intensity={0.4 + 3.2 * up} distance={5} color="#ffd9a0" />
    <mesh position={[0, 0.006, -0.9]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 1.2]} />{M.glow({ col: "#ffd890", op: 0.22 * up })}</mesh>
    {/* el haz dorado que entra por la ventana */}
    <mesh position={[0, 0.72, -1.15]} rotation={[-0.75, 0, 0]}><planeGeometry args={[0.66, 0.9]} />{M.glow({ col: "#ffc870", op: 0.2 * up })}</mesh>
    {Array.from({ length: 24 }, (_, i) => <mesh key={"m" + i} position={[(rn(i, 1) - 0.5) * 0.6, 0.5 + 0.8 * ((rn(i, 2) + tt * 0.04) % 1), -1.3 + 0.5 * rn(i, 3)]}><sphereGeometry args={[0.003, 6, 4]} />{M.glow({ col: "#fff2c8", op: 0.8 * up })}</mesh>)}
  </>; }}</Scene3D>;

const photoTex = () => tex.text("dphoto", 400, 500, (g) => {
  g.fillStyle = "#e9e1cf"; g.fillRect(0, 0, 400, 500);
  const gr = g.createLinearGradient(0, 30, 0, 470); gr.addColorStop(0, "#9aa6b0"); gr.addColorStop(1, "#6a6a5a"); g.fillStyle = gr; g.fillRect(30, 30, 340, 380);
  g.fillStyle = "#4a3c30"; g.beginPath(); g.ellipse(200, 190, 62, 74, 0, 0, 6.3); g.fill(); g.fillRect(120, 260, 160, 150);
  g.fillStyle = "#3a3026"; g.font = "italic 700 34px Georgia"; g.textAlign = "center"; g.fillText("Dad", 200, 455);
});
// ---- 7:12 · «AT LEAST» ACHICA LA PÉRDIDA: el retrato enmarcado; cada papelito «AT LEAST…» que cae lo hace más chico ----
export const HShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.5}
  cam={{ at: [0, 0.12, 0.12], at1: [0, 0.12, 0.14], az: [-0.12, 0.06], el: [0.62, 0.56], r: [1.25, 1.1], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="«AT LEAST» SHRINKS THE LOSS" col={AMB} size={46} />}>{(tt) => {
  const LINES = ["AT LEAST IT WAS QUICK", "AT LEAST 50 GOOD YEARS", "AT LEAST YOU'RE YOUNG", "AT LEAST NO PAIN"];
  const hits = LINES.map((_, i) => phys(tt, 0.7 + i * 0.9, 9, 0.5));
  const sc = 1 - 0.16 * hits.reduce((a, b) => a + cl(b), 0);
  return <>
    <group position={[0, 0.0, -0.1]} scale={sc}>
      <RBox s={[0.36, 0.44, 0.03]} r={0.008} p={[0, 0.24, 0]} rot={[-0.35, 0, 0]}>{M.wood({ base: [80, 50, 28] })}</RBox>
      <mesh position={[0, 0.245, 0.018]} rotation={[-0.35, 0, 0]}><planeGeometry args={[0.3, 0.375]} /><meshStandardMaterial map={photoTex()} roughness={0.7} /></mesh>
    </group>
    {LINES.map((l, i) => { const k = hits[i], x = [-0.22, 0.22, -0.18, 0.2][i], z = [0.18, 0.26, 0.38, 0.48][i];
      return <group key={i} position={[x, 0.006 + i * 0.002 + 0.22 * (1 - cl(k)), z]} rotation={[0, (rn(i, 3) - 0.5) * 0.4, 0]} visible={tt > 0.6 + i * 0.9 && k > 0.02}>
        <Card map={paperTex("dleast3" + i, [l], { w: 768, h: 170, font: "900", bg: "#fbf8f0", ink: "#9a1f18" })} w={0.42} h={0.093} rot={[0, 0, 0]} />
      </group>; })}
  </>; }}</Scene3D>;

// ---- 7:50 · SACARLE EL ABRIGO EN EL FRÍO: el abrigo cuelga del perchero del porche nevado; una mano se lo lleva y entra la escarcha ----
export const HCoatcold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1d2632" warm={0.45} key1={[-0.6, 2.2, 1.8]}
  cam={{ at: [0.15, 1.0, -0.2], at1: [0.25, 0.98, -0.2], az: [-0.2, 0.08], el: [0.1, 0.08], r: [2.2, 2.0], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="A GARMENT IN COLD WEATHER" col={AMB} size={40} />}>{(tt) => {
  const reach = eio(tt, 0.3, 1.0), take = eio(tt, 1.3, 2.6), frost = eio(tt, 2.2, 4.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#5e6a7a" roughness={0.9} /></mesh>
    <mesh position={[0, 1.0, -0.7]}><planeGeometry args={[4, 2.4]} /><meshStandardMaterial map={tex.text("dsiding2", 256, 512, (g) => { g.fillStyle = "#3e4a5c"; g.fillRect(0, 0, 256, 512); for (let y = 0; y < 512; y += 32) { g.fillStyle = "#2c3646"; g.fillRect(0, y + 27, 256, 5); } })} roughness={0.8} /></mesh>
    {/* la ventana de la casa con luz adentro, los postes y la baranda con nieve */}
    <mesh position={[-0.75, 1.15, -0.69]}><planeGeometry args={[0.5, 0.65]} />{M.glow({ col: "#ffcf8a", op: 0.7 })}</mesh>
    {[[-0.75, 1.15, 0.56, 0.04], [-0.75, 1.15, 0.04, 0.7], [-0.75, 1.48, 0.58, 0.05], [-0.75, 0.82, 0.58, 0.05], [-1.03, 1.15, 0.05, 0.7], [-0.47, 1.15, 0.05, 0.7]].map(([x, y, w, hh], i) => <RBox key={"wf" + i} s={[w, hh, 0.03]} r={0.004} p={[x, y, -0.675]}><meshStandardMaterial color="#e8e4dc" roughness={0.7} /></RBox>)}
    {[-1.2, 1.2].map((x) => <RBox key={x} s={[0.08, 2.0, 0.08]} r={0.008} p={[x, 1.0, 0.2]}><meshStandardMaterial color="#f2f0ea" roughness={0.7} /></RBox>)}
    <RBox s={[2.4, 0.05, 0.06]} r={0.008} p={[0, 0.62, 0.2]}><meshStandardMaterial color="#f2f0ea" roughness={0.7} /></RBox>
    <RBox s={[2.4, 0.03, 0.08]} r={0.012} p={[0, 0.66, 0.2]}><meshStandardMaterial color="#ffffff" roughness={0.9} /></RBox>
    {Array.from({ length: 13 }, (_, i) => <RBox key={"b" + i} s={[0.025, 0.55, 0.025]} r={0.004} p={[-1.1 + i * 0.183, 0.33, 0.2]}><meshStandardMaterial color="#f2f0ea" roughness={0.7} /></RBox>)}
    {/* el perchero de bronce */}
    <mesh position={[0, 0.7, -0.4]}><cylinderGeometry args={[0.015, 0.02, 1.4, 12]} />{M.brass()}</mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.08, 1.35, -0.4 + Math.sin(i * 2.1) * 0.08]} rotation={[0, -i * 2.1, 0.8]}><cylinderGeometry args={[0.006, 0.006, 0.12, 8]} />{M.brass()}</mesh>)}
    {/* el abrigo que se va */}
    <group position={[lerp(0.06, 0.5, take), lerp(1.0, 1.12, take), -0.33]} rotation={[0, 0, -0.25 * take]}>
      <mesh><cylinderGeometry args={[0.13, 0.19, 0.7, 24, 1, true]} /><meshStandardMaterial color="#a8241c" roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.34, 0]}><sphereGeometry args={[0.13, 20, 10, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#8f1d16" roughness={1} /></mesh>
      {[0.2, 0.05, -0.1].map((y) => <mesh key={y} position={[0, y, 0.15]}><sphereGeometry args={[0.012, 10, 8]} />{M.brass()}</mesh>)}
    </group>
    <Hand p={[lerp(0.85, 0.2, reach) + 0.44 * take, 1.36 + 0.12 * take, -0.22]} ry={PI} rz={0.15} s={1.7} sleeve="#2a2c34" />
    {/* la nieve que cae y la escarcha que se forma en el piso */}
    {Array.from({ length: 70 }, (_, i) => { const ph = (tt * 0.25 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 3, 2.0 - ph * 2.0, (rn(i, 4) - 0.3) * 1.4]}><sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
    <mesh position={[0, 0.004, -0.2]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2 + 0.7 * frost, 40]} /><meshStandardMaterial color="#f4f8ff" roughness={0.5} transparent opacity={0.75 * frost} /></mesh>
    <pointLight position={[0, 1.6, 0.6]} intensity={0.6 + 1.8 * frost} distance={3} color="#9fc0ea" />
    {/* la escarcha que cubre el perchero vacío */}
    <mesh position={[0, 0.7 + 0.35 * frost, -0.4]} scale={[1, frost + 0.001, 1]} visible={frost > 0.02}><cylinderGeometry args={[0.03, 0.036, 1.4, 12]} /><meshStandardMaterial color="#ffffff" roughness={0.6} emissive="#cfe0ff" emissiveIntensity={0.15} /></mesh>
    {Array.from({ length: 18 }, (_, i) => <mesh key={"fx" + i} position={[Math.cos(i * 2.4) * 0.034, 0.1 + i * 0.07, -0.4 + Math.sin(i * 2.4) * 0.034]} visible={frost > 0.3 + i * 0.03}><octahedronGeometry args={[0.014, 0]} /><meshStandardMaterial color="#ffffff" emissive="#dfeaff" emissiveIntensity={0.4} roughness={0.3} /></mesh>)}
    {[0, 1, 2].map((i) => <mesh key={"fr" + i} position={[Math.cos(i * 2.1) * 0.08, 1.35, -0.4 + Math.sin(i * 2.1) * 0.08]} rotation={[0, -i * 2.1, 0.8]} visible={frost > 0.5}><cylinderGeometry args={[0.014, 0.014, 0.13, 8]} /><meshStandardMaterial color="#ffffff" roughness={0.6} transparent opacity={cl((frost - 0.5) * 2)} /></mesh>)}
  </>; }}</Scene3D>;

const Hand: React.FC<{ p: number[]; ry?: number; rz?: number; col?: string; sleeve?: string; s?: number }> = ({ p, ry = 0, rz = 0, col = "#e2b48e", sleeve = "#2a2c34", s = 1 }) => <group position={p as [number, number, number]} rotation={[0, ry, rz]} scale={s}>
  <mesh scale={[1, 0.42, 0.75]} castShadow><sphereGeometry args={[0.055, 20, 14]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.06, 0, -0.03 + i * 0.02]} rotation={[0, 0, -PI / 2]} castShadow><capsuleGeometry args={[0.009, 0.04, 4, 8]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>)}
  <mesh position={[-0.13, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.04, 0.16, 6, 12]} /><meshStandardMaterial color={sleeve} roughness={0.95} /></mesh>
</group>;
// ---- 8:25 · UNA MANO, NO LAS DOS: llega una mano, aprieta suave la mano de ella y la suelta; la segunda mano que iba a encerrarla se detiene y se retira ----
export const HOnehand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2a241e" warm={1.1} key1={[-0.6, 1.8, 1.4]}
  cam={{ at: [0, 0.0, 0], at1: [0, 0.0, 0], az: [-0.3, 0.1], el: [0.5, 0.42], r: [0.7, 0.55], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="ONE HAND · A GENTLE SQUEEZE · LET GO" col={AMB} size={36} />}>{(tt) => {
  const come = eio(tt, 0.3, 1.2), sq = Math.sin(cl((tt - 1.4) / 0.8) * PI), go = eio(tt, 3.4, 4.4), two = eio(tt, 1.6, 2.2) * (1 - eio(tt, 2.4, 3.0));
  return <>
    <mesh position={[0, -0.05, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial color="#6a5a48" roughness={1} /></mesh>
    <spotLight position={[0.1, 0.9, 0.5]} target-position={[0, 0, 0]} angle={0.4} penumbra={0.7} intensity={3} distance={2.5} color="#ffe6c8" />
    {/* la mano de ella, quieta, con el pañuelo */}
    <Hand p={[-0.09, 0.0, 0]} ry={0} col="#e6c2a0" sleeve="#16161c" />
    <mesh position={[-0.12, -0.02, 0.05]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.07, 0.07]} /><meshStandardMaterial color="#f5f3ee" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {/* la mano que llega desde la derecha */}
    <Hand p={[lerp(0.5, 0.06, come * (1 - go)) + lerp(0, 0.4, go), 0.02 + 0.004 * sq, 0.0]} ry={PI} s={1 + 0.04 * sq} />
    {/* la segunda mano, que no llega */}
    <group visible={two > 0.02}><Hand p={[lerp(0.6, 0.18, two), 0.07, 0.12]} ry={PI + 0.4} /></group>
    
  </>; }}</Scene3D>;

// ---- 8:57 · LA SILLA PLEGABLE: la silla de metal se abre sola con su clic, viaja por el salón y se acomoda detrás de la viuda, que se sienta ----
export const HFoldchair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0.8, 0.45, 0.3], at1: [0.05, 0.5, -0.25], az: [0.55, 0.45], el: [0.16, 0.14], r: [1.3, 1.45], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="SAY NOTHING. SHE'LL KNOW." col={AMB} size={40} />}>{(tt) => {
  const open = eio(tt, 0.4, 1.4), slide = eio(tt, 1.6, 3.0), sit = eio(tt, 3.4, 4.4);
  const cx = lerp(1.0, 0.0, slide), cz = lerp(0.4, -0.38, slide);
  const back = lerp(0.05, -0.08, open), seat = lerp(-PI / 2 + 0.05, 0, open);
  return <>
    <group position={[cx, 0, cz]} rotation={[0, lerp(-0.8, 0, slide), 0]}>
      {/* respaldo y patas traseras */}
      <group rotation={[back, 0, 0]}>
        <RBox s={[0.4, 0.2, 0.025]} r={0.01} p={[0, 0.8, -0.17]}>{M.matte({ col: "#9c8c72" })}</RBox>
        {[-0.19, 0.19].map((x) => <mesh key={x} position={[x, 0.42, -0.17]}><cylinderGeometry args={[0.011, 0.011, 0.86, 8]} />{M.steel()}</mesh>)}
      </group>
      {/* el asiento que baja al abrirse */}
      <group position={[0, 0.45, -0.17]} rotation={[seat, 0, 0]}>
        <RBox s={[0.4, 0.035, 0.36]} r={0.012} p={[0, 0, 0.18]}>{M.matte({ col: "#9c8c72" })}</RBox>
      </group>
      {/* patas delanteras que se abren en tijera */}
      {[-0.19, 0.19].map((x) => <mesh key={x} position={[x, 0.23, lerp(-0.15, 0.13, open)]} rotation={[lerp(0, 0.25, open), 0, 0]}><cylinderGeometry args={[0.011, 0.011, 0.48, 8]} />{M.steel()}</mesh>)}
    </group>
    {/* la viuda: de pie y después sentada */}
    <Person p={[0, lerp(0, -0.27, sit), -0.2 + 0.08 * sit]} s={0.92} ry={0} coat="#1c1c22" hair="#e2ded6" hold={0.2 * sit} />
    {/* el destello del clic de la traba */}
    <group position={[1.19, 0.45, 0.4]} visible={open > 0.9 && tt < 2.0}><mesh><sphereGeometry args={[0.03, 12, 8]} />{M.glow({ col: "#ffffff", op: 0.9 * (1 - cl((tt - 1.4) * 1.6)) })}</mesh><mesh><ringGeometry args={[0.05 + 0.1 * cl((tt - 1.4) * 1.6), 0.06 + 0.1 * cl((tt - 1.4) * 1.6), 32]} />{M.glow({ col: "#ffffff", op: 0.6 * (1 - cl((tt - 1.4) * 1.6)) })}</mesh></group>
  </>; }}</Scene3D>;
