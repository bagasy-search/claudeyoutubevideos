// lsm29d · componentes únicos 28-33 (algo chico y verdadero, la caja de zapatos, la carta de Arizona, contar 30 días, sesenta años de delantales, los nombres en el cuarto banco).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, paperTex } from "./tg";
import { Envelope, Pew } from "./xg";

const PI = Math.PI;

// ---- 17:58 · ALGO CHICO Y VERDADERO: tres recuerdos de Walter llegan de a uno al estante — la gorra naranja, el himnario abierto en la última estrofa, el choclo de agosto ----
export const HSmalltrue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.55}
  cam={{ at: [0, 0.5, 0], at1: [0.05, 0.52, 0], az: [-0.25, 0.15], el: [0.12, 0.1], r: [1.4, 1.15], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="IT HAS TO BE REAL" col={AMB} size={42} />}>{(tt) => {
  const on = (i: number) => phys(tt, 0.5 + i * 1.1, 7, 0.45);
  return <>
    <RBox s={[1.2, 0.035, 0.3]} r={0.008} p={[0, 0.4, 0]}>{M.wood({ base: [130, 88, 52] })}</RBox>
    {[-0.5, 0.5].map((x) => <RBox key={x} s={[0.04, 0.12, 0.2]} r={0.006} p={[x, 0.33, -0.05]}>{M.wood({ base: [110, 74, 44] })}</RBox>)}
    {/* la gorra naranja de la semillera */}
    <group position={[-0.38, 0.42 + 0.5 * (1 - cl(on(0))), 0.02]} rotation={[0, 0.4, 0]} scale={1.4} visible={tt > 0.5}>
      <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.07, 24, 14, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#e8661e" roughness={0.85} /></mesh>
      <mesh position={[0.07, 0.042, 0]} rotation={[0, 0, -0.12]} scale={[1, 0.08, 0.8]}><cylinderGeometry args={[0.06, 0.06, 0.05, 24, 1, false, -PI / 2, PI]} /><meshStandardMaterial color="#d85a18" roughness={0.85} /></mesh>
      <mesh position={[-0.01, 0.07, 0.065]} rotation={[-0.35, 0, 0]}><planeGeometry args={[0.06, 0.03]} /><meshStandardMaterial map={paperTex("dseed", ["PIONEER"], { w: 256, h: 120, font: "900", bg: "#f4f2ea", ink: "#2a5a2a" })} roughness={0.8} /></mesh>
    </group>
    {/* el himnario abierto, la última estrofa subrayada */}
    <group position={[0, 0.42 + 0.5 * (1 - cl(on(1))), 0.02]} rotation={[-0.2, 0, 0]} visible={tt > 1.6}>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.085, 0.01, 0]} rotation={[-PI / 2, k * 0.12, 0]}><planeGeometry args={[0.16, 0.22]} /><meshStandardMaterial map={paperTex("dhymn" + k, k < 0 ? ["Abide with me,", "fast falls the", "eventide"] : ["", "", "LAST VERSE", "— sing it loud —"], { w: 400, h: 560, font: "700", bg: "#efe6d2", ink: "#3a2a1a" })} roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
      <RBox s={[0.34, 0.012, 0.23]} r={0.004} p={[0, 0.0, 0]}><meshStandardMaterial color="#1f3a5a" roughness={0.7} /></RBox>
    </group>
    {/* el choclo de agosto */}
    <group position={[0.38, 0.45 + 0.5 * (1 - cl(on(2))), 0.03]} rotation={[0, 0, PI / 2 - 0.15]} scale={1.3} visible={tt > 2.7}>
      <mesh><capsuleGeometry args={[0.03, 0.14, 8, 16]} /><meshStandardMaterial color="#f0d050" roughness={0.6} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.02, -0.03, Math.sin(i * 2.1) * 0.02]} rotation={[0, i * 2.1, 0.25]}><coneGeometry args={[0.035, 0.18, 8, 1, true]} /><meshStandardMaterial color="#7aa048" roughness={0.8} side={THREE.DoubleSide} /></mesh>)}
    </group>
    <pointLight position={[0, 0.9, 0.6]} intensity={1.0} distance={2.2} color="#ffe0b8" />
  </>; }}</Scene3D>;

// ---- 19:00 · LA CAJA DE ZAPATOS: se levanta la tapa y las tarjetas de pésame salen en abanico, una detrás de otra, cada una con un nombre ----
export const HShoebox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1e1a18" warm={0.9}
  cam={{ at: [0, 0.1, 0], at1: [0, 0.16, 0], az: [-0.3, 0.12], el: [0.5, 0.4], r: [1.0, 0.88], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="KEPT FOR THE REST OF HER LIFE" col={AMB} size={40} />}>{(tt) => {
  const lid = eio(tt, 0.4, 1.2), fan = eio(tt, 1.2, 3.6);
  const NAMES = ["Bob", "Marge", "Dennis", "June", "Pastor Al", "Edna", "the Hansens"];
  return <>
    {/* el acolchado de la cama */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial map={tex.text("dquilt", 512, 512, (g) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = ["#c8a0a0", "#e8dcc0", "#a0b0c8", "#e0c8a0"][(r + c) % 4]; g.fillRect(c * 64, r * 64, 64, 64); } })} roughness={1} /></mesh>
    {/* la caja */}
    <RBox s={[0.36, 0.012, 0.2]} r={0.004} p={[0, 0.006, 0]}><meshStandardMaterial color="#c8b8a0" roughness={0.95} /></RBox>
    {[[0, 0.06, -0.1, 0.36, 0.12, 0.008], [0, 0.06, 0.1, 0.36, 0.12, 0.008], [-0.18, 0.06, 0, 0.008, 0.12, 0.2], [0.18, 0.06, 0, 0.008, 0.12, 0.2]].map(([x, y, z, w, hh, d], i) => <RBox key={i} s={[w, hh, d]} r={0.003} p={[x, y, z]}><meshStandardMaterial color="#d8c8b0" roughness={0.95} /></RBox>)}
    <group position={[lerp(0, -0.42, lid), 0.125 + 0.15 * Math.sin(PI * lid) - 0.115 * lid, lerp(0, 0.05, lid)]} rotation={[0, 0.3 * lid, 0]}>
      <RBox s={[0.37, 0.03, 0.21]} r={0.004} p={[0, 0, 0]}><meshStandardMaterial color="#e2d4bc" roughness={0.9} /></RBox>
    </group>
    {/* la caja llena de tarjetas paradas */}
    {Array.from({ length: 14 }, (_, i) => <RBox key={"in" + i} s={[0.3, 0.1, 0.004]} r={0.001} p={[0, 0.055, -0.085 + i * 0.012]}><meshStandardMaterial color={["#e8a0a8", "#a8c4e8", "#f0d890", "#b8dca8", "#f4f0e6", "#d0b0e0"][i % 6]} roughness={0.8} /></RBox>)}
    {/* las tarjetas en abanico */}
    {NAMES.map((n, i) => { const k = cl(fan * 7 - i), a = (i - 3) * 0.28 * k;
      return <group key={i} position={[0, 0.03 + 0.002 * i, 0.03 - i * 0.012]} rotation={[0, 0, 0]} visible={k > 0.01}>
        <group rotation={[-0.5 * k, 0, a]} position={[0, 0.06 + 0.16 * k, 0]}>
          <Card map={paperTex("dsym2" + i, ["With sympathy", n], { w: 512, h: 360, font: "italic 900", bg: ["#f6c8cc", "#c8daf4", "#f6e6a8", "#cfe8c4", "#e4cdf0", "#f8dcc0", "#f4efe2"][i % 7], ink: "#2a2a4a" })} w={0.17} h={0.12} rot={[0, 0, 0]} />
        </group>
      </group>; })}
    <pointLight position={[0.2, 0.6, 0.5]} intensity={2.4} distance={2} color="#ffe2c0" />
  </>; }}</Scene3D>;

const mapTex = () => tex.text("dusmap", 1024, 640, (g) => {
  g.fillStyle = "#b8cce0"; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#e8dcc0"; g.beginPath();
  [[80, 120], [300, 90], [560, 100], [820, 90], [960, 160], [930, 330], [880, 470], [760, 560], [600, 520], [430, 580], [300, 540], [160, 460], [90, 300]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill();
  g.strokeStyle = "rgba(120,100,70,.45)"; g.lineWidth = 2;
  for (let x = 160; x < 960; x += 110) { g.beginPath(); g.moveTo(x, 100); g.lineTo(x + 10, 560); g.stroke(); }
  for (let y = 180; y < 560; y += 100) { g.beginPath(); g.moveTo(90, y); g.lineTo(930, y); g.stroke(); }
  g.fillStyle = "#d89a5a"; g.fillRect(270, 380, 110, 110); g.fillStyle = "#8ab060"; g.fillRect(560, 220, 100, 80);
  g.fillStyle = "#3a2a1a"; g.font = "700 30px Georgia"; g.fillText("ARIZONA", 262, 520); g.fillText("IOWA", 575, 205);
});
// ---- 19:51 · OCHO MESES DESPUÉS, DESDE ARIZONA: el sobre despega del desierto, cruza el mapa en arco y aterriza en la mesa de Iowa ----
export const HAirmail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.5}
  cam={{ at: [0, 0.05, 0], at1: [0.1, 0.05, -0.02], az: [-0.1, 0.1], el: [0.8, 0.7], r: [1.2, 1.0], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="8 MONTHS LATE · STILL KIND" col={AMB} size={40} />}>{(tt) => {
  const k = eio(tt, 0.6, 3.4), W = 1.0, Hh = 0.625;
  const ax = -W / 2 + 325 / 1024 * W, az = -Hh / 2 + 435 / 640 * Hh, bx = -W / 2 + 610 / 1024 * W, bz = -Hh / 2 + 260 / 640 * Hh;
  return <>
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={mapTex()} roughness={0.9} /></mesh>
    {/* la línea punteada del viaje */}
    {Array.from({ length: 24 }, (_, i) => { const u = i / 23; return <mesh key={i} position={[lerp(ax, bx, u), 0.006, lerp(az, bz, u)]} rotation={[-PI / 2, 0, 0]} visible={k > u}><circleGeometry args={[0.005, 10]} /><meshBasicMaterial color="#9a1f18" /></mesh>; })}
    <group position={[lerp(ax, bx, k), 0.02 + 0.22 * Math.sin(PI * k), lerp(az, bz, k)]} rotation={[-PI / 2 + 0.4 * Math.sin(PI * k), 0, -0.6 + 0.6 * k]}>
      <Envelope p={[0, 0, 0]} rot={[0, 0, 0]} s={0.6} front={paperTex("daz", ["Loretta", "Ames, Iowa"], { w: 512, h: 300, font: "italic 700", bg: "#f2ecdc", ink: "#1f2c56" })} />
    </group>
    <mesh position={[bx, 0.007, bz]} rotation={[-PI / 2, 0, 0]} visible={k > 0.95}><ringGeometry args={[0.03, 0.04 + 0.03 * cl((tt - 3.4) * 2), 32]} /><meshBasicMaterial color="#ffd890" transparent opacity={0.7} depthWrite={false} /></mesh>
  </>; }}</Scene3D>;

const calTex = (n: number) => tex.text("dcal" + n, 768, 640, (g) => {
  g.fillStyle = "#f6f2e6"; g.fillRect(0, 0, 768, 640);
  g.fillStyle = "#3f5f7a"; g.fillRect(0, 0, 768, 80); g.fillStyle = "#fff"; g.font = "900 54px Georgia"; g.textAlign = "center"; g.fillText("COUNT 30 DAYS", 384, 60);
  for (let i = 0; i < 35; i++) { const r = Math.floor(i / 7), c = i % 7, x = 14 + c * 106, y = 92 + r * 106;
    g.strokeStyle = "rgba(60,50,40,.35)"; g.lineWidth = 2; g.strokeRect(x, y, 106, 106);
    if (i < 31) { g.fillStyle = i < n ? "#9a1f18" : "#4a4038"; g.font = "700 30px Georgia"; g.textAlign = "left"; g.fillText(String(i + 1), x + 8, y + 32); }
    if (i < n && i < 29) { g.strokeStyle = "rgba(154,31,24,.6)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 20, y + 60); g.lineTo(x + 86, y + 86); g.stroke(); }
  }
  if (n >= 30) { const x = 14 + 1 * 106, y = 92 + 4 * 106; g.strokeStyle = "#9a1f18"; g.lineWidth = 7; g.beginPath(); g.ellipse(x + 53, y + 53, 48, 44, 0, 0, 6.3); g.stroke(); g.fillStyle = "#1f2c56"; g.font = "italic 700 24px Georgia"; g.textAlign = "center"; g.fillText("Walter", x + 53, y + 82); }
});
// ---- 20:30 · CONTÁ TREINTA DÍAS: el lápiz salta casillero por casillero del almanaque; en el 30 encierra el día y escribe el nombre ----
export const HCount30: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.55}
  cam={{ at: [0, 0.95, 0], at1: [0.04, 0.9, 0], az: [-0.2, 0.08], el: [0.04, 0.02], r: [1.3, 1.0], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="ON DAY 30, CALL" col={AMB} size={44} />}>{(tt) => {
  const k = cl((tt - 0.5) / 3.4), n = Math.min(30, Math.floor(k * 30.99)), q = Math.ceil(n / 3) * 3;
  const c = Math.max(0, n - 1) % 7, r = Math.floor(Math.max(0, n - 1) / 7), W = 0.84, Hh = 0.7;
  const px = -W / 2 + (14 + c * 106 + 70) / 768 * W, py = 0.95 + Hh / 2 - (92 + r * 106 + 60) / 640 * Hh;
  return <>
    <mesh position={[0, 0.95, 0.001]}><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={calTex(n >= 30 ? 30 : q)} roughness={0.85} /></mesh>
    <RBox s={[0.9, 0.76, 0.01]} r={0.004} p={[0, 0.95, -0.006]}><meshStandardMaterial color="#d8d0c0" roughness={0.9} /></RBox>
    {/* el lápiz amarillo, que salta */}
    <group position={[px + 0.04, py + 0.04 + 0.02 * Math.abs(Math.sin(k * 30 * PI)), 0.05]} rotation={[0.3, 0, 0.7]}>
      <mesh><cylinderGeometry args={[0.009, 0.009, 0.2, 6]} /><meshStandardMaterial color="#f0c030" roughness={0.6} /></mesh>
      <mesh position={[0, -0.11, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.009, 0.025, 6]} /><meshStandardMaterial color="#e8c8a0" roughness={0.8} /></mesh>
      <mesh position={[0, 0.105, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.015, 8]} /><meshStandardMaterial color="#e8909a" roughness={0.9} /></mesh>
    </group>
  </>; }}</Scene3D>;

// ---- 21:40 · SESENTA AÑOS, NOVECIENTAS CENAS: en la cocina de la iglesia los delantales cuelgan de los ganchos; la fila crece y los colores se van gastando hasta el de hoy ----
export const HAprons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" warm={0.85}
  cam={{ at: [0, 0.95, -1.2], at1: [0.2, 0.95, -1.2], az: [-0.3, 0.25], el: [0.06, 0.04], r: [1.95, 1.7], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="60 YEARS · 900 DINNERS" col={AMB} size={42} />}>{(tt) => {
  const COLS = ["#c8506a", "#5a8ac8", "#e8b040", "#6aa060", "#b07ac0", "#d87a50", "#70b0b0", "#c8a080", "#9a6a8a"];
  return <>
    {/* la pared de la cocina de la iglesia: pintura crema, zócalo de madera, ventana con luz de la tarde */}
    <mesh position={[0, 1.1, -1.585]}><planeGeometry args={[4, 2.2]} /><meshStandardMaterial color="#efdcb8" roughness={0.9} /></mesh>
    <RBox s={[4, 0.6, 0.02]} r={0.004} p={[0, 0.3, -1.575]}>{M.wood({ base: [150, 100, 60] })}</RBox>
    <mesh position={[1.45, 1.35, -1.58]}><planeGeometry args={[0.5, 0.6]} />{M.glow({ col: "#ffe2a8", op: 0.6 })}</mesh>
    <RBox s={[2.4, 0.05, 0.04]} r={0.008} p={[0, 1.6, -1.56]}>{M.wood({ base: [120, 80, 48] })}</RBox>
    {COLS.map((c, i) => { const k = phys(tt, 0.4 + i * 0.4, 7, 0.4), age = 1 - i / 8, col = new THREE.Color(c).lerp(new THREE.Color("#d8d0c4"), 0.55 * age), sw = 0.05 * Math.sin(tt * 1.6 + i) * (1 - cl(k - 0.5));
      return <group key={i} position={[-1.08 + i * 0.27, 1.58, -1.52]} rotation={[0, 0, sw]} visible={tt > 0.4 + i * 0.4}>
        <mesh position={[0, 0.0, 0.0]}><cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />{M.steel()}</mesh>
        <group position={[0, -0.3 * cl(k) - 0.02, 0.01]} scale={[1, Math.max(0.05, cl(k)), 1]}>
          <mesh position={[0, -0.24, 0]}><planeGeometry args={[0.25, 0.56, 4, 6]} /><meshStandardMaterial color={col} roughness={0.9} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, -0.36, 0.002]}><planeGeometry args={[0.18, 0.11]} /><meshStandardMaterial color={col.clone().multiplyScalar(0.85)} roughness={0.9} /></mesh>
        </group>
      </group>; })}
    <pointLight position={[0, 1.8, -0.6]} intensity={1.6} distance={3} color="#ffe6c4" />
  </>; }}</Scene3D>;

// ---- 22:20 · SUS NOMBRES EN EL CUARTO BANCO: los bancos de la nave se cuentan de a uno; en el cuarto de la izquierda, sobre el boletín, los nombres aparecen escritos a mano ----
export const HPewnames: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#1a1512" warm={0.8} key1={[-0.6, 2.4, 1.6]}
  cam={{ at: [0, 0.5, -1.0], at1: [-0.55, 0.52, 0.38], az: [0.1, 0.75], el: [0.3, 0.62], r: [2.6, 0.75], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="FOURTH PEW ON THE LEFT" col={AMB} size={42} />}>{(tt) => {
  const NAMES = ["Walter", "Ruth", "Harold", "June", "Arnie"], ink = cl((tt - 2.4) / 2.6), cnt = Math.min(4, Math.floor(cl((tt - 0.4) / 1.8) * 4.99));
  return <>
    {[0, 1, 2, 3, 4, 5].map((i) => <React.Fragment key={i}>
      <Pew p={[-0.55, 0, -1.4 + i * 0.6]} w={0.9} />
      <Pew p={[0.55, 0, -1.4 + i * 0.6]} w={0.9} />
      <mesh position={[-1.06, 0.6, -1.4 + i * 0.6]} visible={i < cnt}><sphereGeometry args={[0.025, 12, 8]} />{M.glow({ col: "#ffd890", op: i === 3 ? 0.95 : 0.45 })}</mesh>
    </React.Fragment>)}
    {/* el boletín doblado sobre el cuarto banco de la izquierda */}
    <group position={[-0.55, 0.5, -1.4 + 3 * 0.6 + 0.04]} rotation={[0.45, 0, 0.08]}>
      <Card map={paperTex("dpewn" + Math.floor(ink * 5.99), NAMES.map((n, i) => ink * 5 > i ? n : ""), { w: 480, h: 640, font: "italic 700", bg: "#f6f1e4", ink: "#101a44" })} w={0.3} h={0.4} rot={[0, 0, 0]} />
    </group>
    <spotLight position={[-0.55, 2.2, 0.6]} target-position={[-0.55, 0.45, 0.4]} angle={0.3} penumbra={0.8} intensity={0.5 + 4 * eio(tt, 1.8, 2.6)} distance={3.5} color="#ffe0a8" />
  </>; }}</Scene3D>;
