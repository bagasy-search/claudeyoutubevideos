// lsm29d · componentes únicos 22-27 (el tractor en el arroyo, la caja de sobras, cruzar la calle, la botella de lágrimas, la cadena de 1978, la pieza que faltaba).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, Roll, paperTex } from "./tg";
import { Person, SnowGround, XSky } from "./xg";
import { Pickup } from "./pg";

const PI = Math.PI;

// ---- 14:34 · EL TRACTOR EN EL ARROYO: el tractorcito rojo baja la loma, mete la trompa en el agua con su salpicadura, y la mesa ríe: anillos de luz que se abren ----
export const HTractor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#7fa6c8" warm={0.8} key1={[-1.2, 2.6, 1.8]}
  cam={{ at: [0, 0.1, 0], at1: [0.2, 0.05, 0.05], az: [0.55, 0.35], el: [0.3, 0.24], r: [1.4, 1.1], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THE WHOLE TABLE LAUGHS" col={AMB} size={42} />}>{(tt) => {
  const roll = eio(tt, 0.4, 2.2), dip = eio(tt, 2.0, 2.4), splash = cl((tt - 2.2) / 0.9);
  const x = lerp(-0.7, 0.12, roll), y = lerp(0.18, -0.02, roll) - 0.04 * dip;
  return <>
    {/* el pasto, las dos lomas y el arroyo */}
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#5f8a3a" roughness={1} /></mesh>
    <mesh position={[-0.7, -0.15, 0]} rotation={[0, 0, -0.25]} receiveShadow><boxGeometry args={[1.2, 0.5, 1.6]} /><meshStandardMaterial color="#6a8f40" roughness={1} /></mesh>
    <mesh position={[0.3, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 3]} /><meshPhysicalMaterial color="#5a7f9a" roughness={0.15} clearcoat={1} transparent opacity={0.9} /></mesh>
    <mesh position={[0.3, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 3]} /><meshStandardMaterial color="#6a5236" roughness={1} /></mesh>
    {/* el tractor */}
    <group position={[x, y + 0.06, 0]} rotation={[0, 0, -0.25 * (1 - roll) - 0.5 * dip]} scale={1.3}>
      <RBox s={[0.2, 0.08, 0.1]} r={0.02} p={[0.03, 0.06, 0]}><meshPhysicalMaterial color="#b8231a" roughness={0.4} clearcoat={0.6} /></RBox>
      <RBox s={[0.09, 0.1, 0.1]} r={0.012} p={[-0.06, 0.14, 0]}><meshPhysicalMaterial color="#b8231a" roughness={0.4} clearcoat={0.6} /></RBox>
      <mesh position={[0.07, 0.12, 0]}><cylinderGeometry args={[0.006, 0.006, 0.08, 8]} /><meshStandardMaterial color="#222" /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[-0.06, 0.05, k * 0.07]} rotation={[PI / 2, 0, roll * 20]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.03, 20]} /><meshStandardMaterial color="#1a1a1a" roughness={0.9} /></mesh>)}
      {[-1, 1].map((k) => <mesh key={"f" + k} position={[0.1, 0.03, k * 0.055]} rotation={[PI / 2, 0, roll * 30]}><cylinderGeometry args={[0.032, 0.032, 0.02, 16]} /><meshStandardMaterial color="#1a1a1a" roughness={0.9} /></mesh>)}
    </group>
    {/* la salpicadura: gotas que suben y caen */}
    {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * PI * 2, v = 0.2 + 0.3 * rn(i, 2), k = splash;
      return <mesh key={i} position={[0.28 + Math.cos(a) * v * k * 0.6, 0.02 + (v * 1.6 * k - 1.6 * k * k * 0.9) * 0.5, Math.sin(a) * v * k * 0.6]} visible={k > 0 && k < 1}><sphereGeometry args={[0.008, 8, 6]} /><meshPhysicalMaterial color="#cfe6f6" roughness={0.05} transparent opacity={0.85} /></mesh>; })}
    {/* la risa: anillos que se abren en el agua */}
    {[0, 1, 2].map((i) => { const k = cl((tt - 2.6 - i * 0.5) / 1.4); return <mesh key={"r" + i} position={[0.3, 0.008, 0]} rotation={[-PI / 2, 0, 0]} visible={k > 0 && k < 1}><ringGeometry args={[0.05 + 0.5 * k, 0.06 + 0.5 * k, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * (1 - k)} depthWrite={false} /></mesh>; })}
    <hemisphereLight args={["#e8f2ff", "#4a6a2a", 0.6]} />
  </>; }}</Scene3D>;

const Foil: React.FC<{ p: number[]; s: number[] }> = ({ p, s }) => <RBox s={s} r={0.012} p={p}><meshStandardMaterial color="#d8dce2" metalness={0.85} roughness={0.32} /></RBox>;
// ---- 15:37 · LA CAJA PARA LA FAMILIA: entran el jamón envuelto, los bollos y la torta; las solapas de la caja se cierran solas ----
export const HLeftoverbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile" warm={0.85}
  cam={{ at: [0, 0.1, 0], at1: [0, 0.1, 0], az: [-0.25, 0.1], el: [0.95, 0.85], r: [1.25, 1.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="SUPPER FOR TONIGHT" col={AMB} size={42} />}>{(tt) => {
  const IN = [0.3, 1.0, 1.7], k = IN.map((a) => eio(tt, a, a + 0.6)), fl = eio(tt, 2.7, 3.6);
  const CB = "#b98d5c";
  return <>
    {/* la caja de cartón */}
    <RBox s={[0.44, 0.012, 0.32]} r={0.004} p={[0, 0.006, 0]}><meshStandardMaterial color={CB} roughness={0.95} /></RBox>
    {[[0, 0.1, -0.16, 0.44, 0.2, 0.012], [0, 0.1, 0.16, 0.44, 0.2, 0.012], [-0.22, 0.1, 0, 0.012, 0.2, 0.32], [0.22, 0.1, 0, 0.012, 0.2, 0.32]].map(([x, y, z, w, hh, d], i) => <RBox key={i} s={[w, hh, d]} r={0.003} p={[x, y, z]}><meshStandardMaterial color={CB} roughness={0.95} /></RBox>)}
    {/* lo que entra */}
    <group position={[lerp(-0.6, -0.08, k[0]), lerp(0.5, 0.06, k[0]) + 0.12 * Math.sin(PI * k[0]), 0]}><Foil p={[0, -0.025, 0]} s={[0.19, 0.03, 0.15]} /><mesh position={[0, 0.02, 0]} scale={[1.25, 0.75, 0.95]}><sphereGeometry args={[0.07, 24, 16]} /><meshPhysicalMaterial color="#c8645c" roughness={0.4} clearcoat={0.5} /></mesh>{[-0.03, 0, 0.03].map((x) => <mesh key={x} position={[x, 0.07, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.003, 0.002, 0.11]} /><meshStandardMaterial color="#7a2e22" /></mesh>)}</group>
    <group position={[lerp(0.6, 0.11, k[1]), lerp(0.5, 0.05, k[1]) + 0.1 * Math.sin(PI * k[1]), -0.06]}>{[0, 1, 2].map((i) => <Roll key={i} p={[(i - 1) * 0.045, 0.0, 0]} s={0.75} />)}</group>
    <group position={[lerp(0.6, 0.1, k[2]), lerp(0.6, 0.06, k[2]) + 0.12 * Math.sin(PI * k[2]), 0.08]}><mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.065, 0.065, 0.05, 32]} /><meshStandardMaterial color="#8a5a32" roughness={0.7} /></mesh><mesh position={[0, 0.027, 0]}><cylinderGeometry args={[0.067, 0.067, 0.008, 32]} /><meshPhysicalMaterial color="#fbf6ec" roughness={0.3} clearcoat={0.6} /></mesh><mesh position={[0, 0.036, 0]}><sphereGeometry args={[0.009, 12, 8]} /><meshPhysicalMaterial color="#c0201a" roughness={0.2} clearcoat={1} /></mesh></group>
    {/* las cuatro solapas */}
    {[[0, 0.2, -0.16, 1, 0], [0, 0.2, 0.16, -1, 0], [-0.22, 0.2, 0, 0, 1], [0.22, 0.2, 0, 0, -1]].map(([x, y, z, ax, az], i) => { const a = (1 - eio(tt, 2.7 + i * 0.2, 3.3 + i * 0.2)) * 1.9;
      return <group key={"f" + i} position={[x, y, z]} rotation={[ax ? -ax * a : 0, 0, az ? az * a : 0]}>
        <RBox s={ax ? [0.44, 0.006, 0.16] : [0.16, 0.006, 0.32]} r={0.002} p={ax ? [0, 0, ax * 0.08] : [az * 0.08, 0, 0]}><meshStandardMaterial color={CB} roughness={0.95} /></RBox>
      </group>; })}
    <group position={[0, 0.21, 0]} visible={fl > 0.95}><Card map={paperTex("dbox", ["For the Hansens"], { w: 512, h: 160, font: "italic 700", bg: "#f4efe2", ink: "#1f2c56" })} w={0.2} h={0.06} rot={[-PI / 2, 0, 0.05]} /></group>
  </>; }}</Scene3D>;

// ---- 16:40 · CRUZAN LA CALLE: en la vereda del pueblo, alguien la ve venir y cruza a la otra vereda; ella sigue sola bajo la marquesina ----
export const HCrossstreet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2a3038" warm={0.8} key1={[0.4, 2.6, 1.8]}
  cam={{ at: [0.1, 0.45, 0.0], at1: [0.3, 0.45, 0.0], az: [0.0, 0.08], el: [0.3, 0.26], r: [2.5, 2.3], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THEY CROSS THE STREET" col={RED} size={42} />}>{(tt) => {
  const w = cl(tt / 5.4), cross = eio(tt, 1.2, 3.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshStandardMaterial color="#3a3c40" roughness={0.95} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0, 0.02, k * 0.75]} receiveShadow><boxGeometry args={[6, 0.04, 0.6]} /><meshStandardMaterial color="#9a988f" roughness={0.9} /></mesh>)}
    {Array.from({ length: 8 }, (_, i) => <mesh key={"l" + i} position={[-2.6 + i * 0.75, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.35, 0.04]} /><meshBasicMaterial color="#e8d070" /></mesh>)}
    {/* la viuda camina por la vereda de abajo */}
    {/* la vidriera y la marquesina de la vereda de enfrente */}
    <mesh position={[0, 0.6, -1.06]}><planeGeometry args={[6, 1.2]} /><meshStandardMaterial color="#8a6a52" roughness={0.9} /></mesh>
    {[-1.2, 0, 1.2].map((x) => <mesh key={"vd" + x} position={[x, 0.45, -1.05]}><planeGeometry args={[0.8, 0.5]} />{M.glow({ col: "#ffd890", op: 0.55 })}</mesh>)}
    <RBox s={[3.6, 0.03, 0.3]} r={0.006} p={[0, 0.82, -0.92]} rot={[0.25, 0, 0]}><meshStandardMaterial color="#9a2a22" roughness={0.8} /></RBox>
    <Person p={[lerp(-1.6, 0.4, w), 0.04, 0.78]} s={0.82} ry={PI / 2} coat="#1c1c22" hair="#e2ded6" />
    {/* el otro venía de frente por la misma vereda y cruza */}
    <Person p={[lerp(1.4, 0.5, cl(tt / 1.4)) - lerp(0, 0.6, cross), 0.04, lerp(0.78, -0.76, cross)]} s={0.84} ry={-PI / 2 + 1.2 * Math.sin(PI * cross)} coat="#4a4a3a" hair="#6a5a4a" />
    {/* la trayectoria que se dibuja del cruce */}
    {Array.from({ length: 12 }, (_, i) => { const u = i / 11; return <mesh key={"p" + i} position={[1.4 - 0.9 - 0.6 * u, 0.045, lerp(0.78, -0.76, u)]} visible={cross > u + 0.02}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color={RED} transparent opacity={0.7} /></mesh>; })}
    <pointLight position={[0, 1.4, 0.6]} intensity={1.4} distance={3.5} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 17:16 · PON MIS LÁGRIMAS EN TU REDOMA: la botellita antigua de vidrio sobre el terciopelo; caen gotas de luz, una por una, y el nivel sube ----
export const HTearbottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1c1420" warm={0.75} key1={[-0.6, 1.6, 1.2]}
  cam={{ at: [0, 0.2, 0], at1: [0, 0.2, 0], az: [-0.2, 0.15], el: [0.14, 0.12], r: [0.95, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="GOD KEEPS EVERY TEAR" col={AMB} size={42} />}>{(tt) => {
  const N = 9, lv = cl((tt - 0.6) / 4.0);
  const prof = [[0.0, 0], [0.04, 0.0], [0.05, 0.04], [0.045, 0.1], [0.02, 0.15], [0.014, 0.2], [0.018, 0.22]].map(([x, y]) => new THREE.Vector2(x, y));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.8, 48]} /><meshPhysicalMaterial color="#5a1c4a" roughness={0.9} sheen={1} sheenColor="#c070a8" sheenRoughness={0.4} /></mesh>
    <group scale={1.5}>
    <mesh><latheGeometry args={[prof, 40]} /><meshPhysicalMaterial color="#b8d4ec" roughness={0.05} clearcoat={1} transparent opacity={0.24} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.005 + 0.06 * lv, 0]} scale={[1, Math.max(0.02, lv), 1]}><cylinderGeometry args={[0.044, 0.041, 0.12, 32]} /><meshStandardMaterial color="#8ec4f0" emissive="#6aaee8" emissiveIntensity={0.15} roughness={0.2} transparent opacity={0.75} /></mesh>
    <mesh position={[0, 0.006 + 0.12 * lv, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.044, 32]} />{M.glow({ col: "#dff0ff", op: 0.3 })}</mesh>
    <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.016, 0.013, 0.04, 16]} /><meshStandardMaterial color="#a0784a" roughness={0.9} /></mesh>
    </group>
    {/* las gotas que caen */}
    {Array.from({ length: N }, (_, i) => { const a = 0.6 + i * 0.45, k = cl((tt - a) / 0.5);
      return <mesh key={i} position={[0, lerp(0.78, 0.37, k * k), 0]} scale={[1, 1.5, 1]} visible={k > 0 && k < 1}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#cfe8ff", op: 0.95 })}</mesh>; })}
    <pointLight position={[0, 0.15, 0.25]} intensity={0.15 + 0.45 * lv} distance={0.9} color="#bfe0ff" />
    <spotLight position={[0.3, 1.2, 0.6]} target-position={[0, 0.15, 0]} angle={0.35} penumbra={0.8} intensity={1.5} distance={2.5} color="#fff0e0" />
  </>; }}</Scene3D>;

// ---- 17:36 · NOCHEBUENA DE 1978: la camioneta de Harold tensa la cadena y saca el auto de la zanja entre la nieve ----
export const HTowchain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#10141c" warm={0.65} key1={[0.4, 2.6, 1.6]}
  cam={{ at: [0.45, 0.22, 0], at1: [0.55, 0.22, 0], az: [0.32, 0.24], el: [0.22, 0.2], r: [1.95, 1.8], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="CHRISTMAS EVE, 1978" col={AMB} size={42} />}>{(tt) => {
  const tense = eio(tt, 0.8, 1.6), pull = eio(tt, 1.8, 4.0);
  const carX = lerp(-0.45, 0.25, pull), carY = lerp(-0.12, 0.0, pull), carR = lerp(-0.3, 0, pull);
  return <>
    <XSky z={-5} y={1.0} />
    <SnowGround />
    <mesh position={[-0.5, -0.06, 0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.9, 0.6]} /><meshStandardMaterial color="#c8d0dc" roughness={1} /></mesh>
    {/* la camioneta adelante */}
    <group position={[1.25 + 0.3 * pull, 0, 0]} scale={1.4}><Pickup p={[0, 0, 0]} ry={0} col="#7a3a24" wheel={pull * 8} /></group>
    {/* el sedán en la zanja, con los faros encendidos */}
    <group position={[carX, carY, 0]} rotation={[0, 0, carR]}>
      <RBox s={[0.52, 0.14, 0.26]} r={0.04} p={[0, 0.1, 0]}><meshPhysicalMaterial color="#2a4a6a" roughness={0.4} clearcoat={0.7} /></RBox>
      <RBox s={[0.3, 0.1, 0.24]} r={0.04} p={[-0.03, 0.2, 0]}><meshPhysicalMaterial color="#2a4a6a" roughness={0.4} clearcoat={0.7} /></RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[-0.27, 0.11, k * 0.08]}><circleGeometry args={[0.02, 16]} />{M.glow({ col: "#ffe8b0", op: 0.95 })}</mesh>)}
    </group>
    <spotLight position={[carX - 0.3, carY + 0.12, 0]} target-position={[carX - 2, -0.2, 0]} angle={0.4} penumbra={0.7} intensity={4} distance={3} color="#ffe8b0" />
    {/* la cadena: eslabones entre los dos */}
    {Array.from({ length: 9 }, (_, i) => { const u = i / 8, x0 = carX + 0.27, x1 = 1.25 + 0.3 * pull - 0.56, sag = 0.1 * (1 - tense) * Math.sin(PI * u);
      return <mesh key={i} position={[lerp(x0, x1, u), lerp(carY + 0.08, 0.12, u) - sag, 0]} rotation={[i % 2 ? PI / 2 : 0, PI / 2, 0]} scale={[1, 1.55, 1]} castShadow><torusGeometry args={[0.045, 0.015, 12, 20]} /><meshPhysicalMaterial color="#9aa0a8" metalness={0.9} roughness={0.28} clearcoat={0.6} /></mesh>; })}
    {/* los ganchos en cada punta */}
    {[[carX + 0.27, carY + 0.08], [1.25 + 0.3 * pull - 0.56, 0.12]].map(([x, y], i) => <mesh key={"hk" + i} position={[x, y, 0]} rotation={[0, 0, i ? -0.6 : 0.6]}><torusGeometry args={[0.035, 0.014, 10, 18, PI * 1.4]} /><meshPhysicalMaterial color="#6a6e74" metalness={0.9} roughness={0.35} /></mesh>)}
    <pointLight position={[0.4, 0.45, 0.45]} intensity={1.2 * tense} distance={1.2} color="#ffffff" />
    <pointLight position={[0.6, 0.6, 0.5]} intensity={1.5} distance={2} color="#e8eef8" />
    {/* la nieve que cae */}
    {Array.from({ length: 80 }, (_, i) => { const ph = (tt * 0.22 + rn(i, 2)) % 1; return <mesh key={"s" + i} position={[(rn(i, 1) - 0.4) * 3.6, 1.8 - ph * 1.9, (rn(i, 4) - 0.5) * 1.6]}><sphereGeometry args={[0.006, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
  </>; }}</Scene3D>;

const puzzleTex = () => tex.text("dpuzzle", 1024, 768, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 768); gr.addColorStop(0, "#8aa2b8"); gr.addColorStop(1, "#d8c8a0"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 768);
  g.fillStyle = "#6a8a50"; g.fillRect(0, 520, 1024, 248);
  g.fillStyle = "#5a3a2a"; g.fillRect(600, 330, 260, 200); g.fillStyle = "#3a2418"; g.fillRect(640, 300, 180, 40);
  // Harold: campera a cuadros, cara, gorra naranja de cazador
  g.fillStyle = "#8a2a22"; g.beginPath(); g.moveTo(190, 768); g.lineTo(220, 470); g.quadraticCurveTo(320, 420, 420, 470); g.lineTo(450, 768); g.fill();
  g.strokeStyle = "rgba(20,10,10,.55)"; g.lineWidth = 6; for (let x = 200; x < 460; x += 36) { g.beginPath(); g.moveTo(x, 450); g.lineTo(x, 768); g.stroke(); } for (let y = 480; y < 768; y += 36) { g.beginPath(); g.moveTo(190, y); g.lineTo(450, y); g.stroke(); }
  g.fillStyle = "#d9a882"; g.fillRect(295, 400, 50, 50);
  g.fillStyle = "#e2b48e"; g.beginPath(); g.ellipse(320, 340, 64, 78, 0, 0, 6.3); g.fill();
  g.fillStyle = "#c89070"; g.beginPath(); g.ellipse(256, 345, 10, 18, 0, 0, 6.3); g.fill(); g.beginPath(); g.ellipse(384, 345, 10, 18, 0, 0, 6.3); g.fill();
  g.fillStyle = "#2a1e16"; g.beginPath(); g.arc(296, 330, 7, 0, 6.3); g.fill(); g.beginPath(); g.arc(344, 330, 7, 0, 6.3); g.fill();
  g.strokeStyle = "#5a3a2a"; g.lineWidth = 5; g.beginPath(); g.moveTo(284, 312); g.lineTo(306, 310); g.moveTo(334, 310); g.lineTo(356, 312); g.stroke();
  g.strokeStyle = "#9a5a44"; g.lineWidth = 5; g.beginPath(); g.arc(320, 368, 26, 0.25, PI - 0.25); g.stroke();
  g.strokeStyle = "#b07a5a"; g.lineWidth = 4; g.beginPath(); g.moveTo(320, 336); g.lineTo(314, 358); g.lineTo(324, 360); g.stroke();
  g.fillStyle = "#e86a2a"; g.beginPath(); g.ellipse(320, 282, 72, 40, 0, PI, 0); g.fill(); g.fillRect(248, 272, 144, 22);
  g.fillStyle = "#c4521c"; g.beginPath(); g.ellipse(336, 294, 70, 12, 0, 0, 6.3); g.fill();
  g.strokeStyle = "rgba(40,30,20,.35)"; g.lineWidth = 3;
  for (let x = 0; x <= 1024; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 768); g.stroke(); }
  for (let y = 0; y <= 768; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
});
const pieceTex = () => tex.text("dpiece", 256, 256, (g) => { const src = puzzleTex().image as HTMLCanvasElement; g.drawImage(src, 256, 256, 128, 128, 0, 0, 256, 256); });
// ---- 17:50 · LA PIEZA QUE NO TENÍA: el rompecabezas del retrato de Harold con su gorra está casi entero; la última pieza llega por el aire y encaja ----
export const HPuzzle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.5}
  cam={{ at: [0, 0.02, 0], at1: [0, 0.02, 0], az: [-0.2, 0.08], el: [0.85, 0.78], r: [0.95, 0.78], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="A PIECE OF HIM I'D NEVER HAD" col={AMB} size={40} />}>{(tt) => {
  const k = eio(tt, 1.0, 3.2), snap = phys(tt, 3.2, 10, 0.5), glow = eio(tt, 3.2, 3.8) * (1 - eio(tt, 4.4, 5.4));
  const W = 0.64, Hh = 0.48, cw = W / 8, ch = Hh / 6, px = -W / 2 + cw * 2.5, pz = -Hh / 2 + ch * 2.5;
  return <>
    <RBox s={[0.7, 0.012, 0.54]} r={0.004} p={[0, 0.006, 0]}>{M.wood({ base: [70, 46, 30] })}</RBox>
    <mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={puzzleTex()} roughness={0.8} /></mesh>
    {/* el hueco, oscuro */}
    <mesh position={[px, 0.013, pz]} rotation={[-PI / 2, 0, 0]} visible={k < 0.99}><planeGeometry args={[cw, ch]} /><meshStandardMaterial color="#120a06" roughness={1} /></mesh>
    <mesh position={[px, 0.0132, pz]} rotation={[-PI / 2, 0, 0]} visible={k < 0.99}><ringGeometry args={[cw * 0.52, cw * 0.6, 4, 1, PI / 4]} />{M.glow({ col: "#ffd890", op: 0.5 + 0.3 * Math.sin(tt * 4) })}</mesh>
    {/* la pieza que llega */}
    <group position={[lerp(0.42, px, k), lerp(0.25, 0.016, k) + 0.08 * Math.sin(PI * k) + 0.004 * (1 - cl(snap)), lerp(0.22, pz, k)]} rotation={[-PI / 2, 0, (1 - k) * 2.2]} scale={1 + 0.6 * (1 - k)}>
      <mesh position={[0, 0, -0.002]}><planeGeometry args={[cw * 1.08, ch * 1.08]} /><meshBasicMaterial color="#fff2c8" /></mesh>
      <mesh><planeGeometry args={[cw, ch]} /><meshStandardMaterial map={pieceTex()} roughness={0.8} /></mesh>
    </group>
    <mesh position={[px, 0.015, pz]} rotation={[-PI / 2, 0, 0]} visible={glow > 0.01}><planeGeometry args={[cw * 1.6, ch * 1.6]} />{M.glow({ col: "#ffd890", op: 0.4 * glow })}</mesh>
    <pointLight position={[px, 0.3, pz + 0.1]} intensity={0.4 + 1.2 * glow} distance={1} color="#ffd890" />
  </>; }}</Scene3D>;
