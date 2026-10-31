// lsm29d · componentes únicos 15-21 (siete días y siete noches, la tarta de ruibarbo, las estaciones, diez libras menos, la semana con clavijas, el tanque lleno, el ángel del codo).
import React from "react";
import * as THREE from "three";
import { AMB, GRN, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Pie, paperTex, Card, Plate } from "./tg";
import { Person } from "./xg";

const PI = Math.PI;

// ---- 9:31 · SIETE DÍAS Y SIETE NOCHES: tres amigos sentados en el suelo junto a Job; el sol y la luna dan siete vueltas por arriba y nadie habla ----
export const HSevennights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1a22" warm={0.6} key1={[0.4, 2.8, 1.6]}
  cam={{ at: [0, 0.55, 0], at1: [0, 0.6, 0], az: [-0.2, 0.15], el: [0.16, 0.14], r: [2.1, 2.0], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={1.0} x={960} y={1010} txt={"DAY " + Math.min(7, 1 + Math.floor(cl((tt - 0.6) / 4.4) * 7))} col={AMB} size={44} />}>{(tt) => {
  const k = cl((tt - 0.6) / 4.4), ang = k * 7 * PI * 2, day = 0.5 + 0.5 * Math.cos(ang);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><circleGeometry args={[3, 48]} /><meshStandardMaterial color={day > 0.5 ? "#7a6a52" : "#4a4238"} roughness={1} /></mesh>
    {/* Job en el centro, más chico, encorvado; los tres alrededor */}
    <mesh position={[0, 1.2, -2.2]}><planeGeometry args={[9, 4]} /><meshBasicMaterial color={new THREE.Color("#141a2c").lerp(new THREE.Color("#c9a878"), day)} /></mesh>
    <Person p={[0, -0.28, 0]} s={0.75} coat="#6a5a48" hair="#9a9488" hold={0.6} />
    {[0, 1, 2].map((i) => { const a = PI * 0.55 + i * PI * 0.45; return <Person key={i} p={[Math.cos(a) * 0.72, -0.3, Math.sin(a) * 0.5 + 0.1]} s={0.78} ry={-a - PI / 2} coat={["#5a4a3a", "#4a5a5a", "#6a4a4a"][i]} hair={["#3a2a22", "#d8d4cc", "#6a5a4a"][i]} />; })}
    {/* el sol y la luna en su órbita */}
    <mesh position={[0, 0.75, -2.15]} scale={[1.5, 0.42, 1]}><torusGeometry args={[1, 0.008, 6, 96, PI]} />{M.glow({ col: "#ffe2b0", op: 0.22 })}</mesh>
    {[1, 2, 3, 4, 5].map((j) => { const a2 = ang - j * 0.16; return <mesh key={"tr" + j} position={[1.5 * Math.sin(a2), 0.75 + 0.42 * Math.cos(a2), -2.11]} visible={Math.cos(a2) > -0.3}><sphereGeometry args={[0.1 - j * 0.012, 16, 10]} />{M.glow({ col: "#ffd890", op: 0.35 - j * 0.06 })}</mesh>; })}
    <mesh position={[1.5 * Math.sin(ang), 0.75 + 0.42 * Math.cos(ang), -2.1]} visible={Math.cos(ang) > -0.3}><sphereGeometry args={[0.12, 24, 16]} />{M.glow({ col: "#ffd890", op: 0.95 })}</mesh>
    <mesh position={[-1.5 * Math.sin(ang), 0.75 - 0.42 * Math.cos(ang), -2.1]} visible={Math.cos(ang) < 0.3}><sphereGeometry args={[0.09, 24, 16]} /><meshStandardMaterial color="#e8eef6" emissive="#b8c8e0" emissiveIntensity={0.9} /></mesh>
    <hemisphereLight args={["#ffe8c8", "#202838", 0.2 + 0.6 * day]} />
    <pointLight position={[0, 2.2, 0.6]} intensity={0.6 + 1.6 * day} distance={4.5} color={day > 0.5 ? "#ffe0b0" : "#a0b4e0"} />
    {/* las marcas de los días en la arena */}
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.42 + i * 0.14, 0.004, 1.0]} rotation={[-PI / 2, 0, 0.12]} visible={k * 7 > i + 0.5}><planeGeometry args={[0.03, 0.2]} /><meshBasicMaterial color="#efe2c4" /></mesh>)}
  </>; }}</Scene3D>;

// ---- 10:23 · LA PRIMERA TARTA DE RUIBARBO: los tallos rojos sobre la tabla, el relleno cae en la masa y las tiras del enrejado se tejen solas ----
export const HRhubarbpie: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.55}
  cam={{ at: [0, 0.04, 0], at1: [0, 0.04, 0], az: [-0.2, 0.15], el: [0.75, 0.62], r: [0.85, 0.65], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="THE FIRST RHUBARB PIE OF SPRING" col={AMB} size={38} />}>{(tt) => {
  const fill = eio(tt, 0.8, 1.8);
  return <>
    {/* la tarta: base de masa y relleno rosado */}
    <mesh position={[0, 0.02, 0]} castShadow receiveShadow><cylinderGeometry args={[0.16, 0.13, 0.04, 48]} /><meshStandardMaterial color="#d9b47a" roughness={0.8} /></mesh>
    <mesh position={[0, 0.034 + 0.006 * fill, 0]} rotation={[-PI / 2, 0, 0]} visible={fill > 0.02}><circleGeometry args={[0.145 * Math.sqrt(fill), 48]} /><meshPhysicalMaterial color="#d2607a" roughness={0.4} clearcoat={0.5} /></mesh>
    {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * PI * 2, rr = 0.125 * Math.sqrt(rn(i, 2)), k = eio(tt, 0.7 + i * 0.045, 1.05 + i * 0.045); return <mesh key={"ch" + i} visible={k > 0.01} position={[lerp(0.33, Math.cos(a) * rr, k), lerp(0.05, 0.043, k) + 0.08 * Math.sin(PI * k), lerp(0.1, Math.sin(a) * rr, k)]} rotation={[0, a, PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.022, 8]} /><meshStandardMaterial color={i % 3 ? "#c03a52" : "#8fae5a"} roughness={0.5} /></mesh>; })}
    {/* el enrejado: 5 + 5 tiras */}
    {Array.from({ length: 10 }, (_, i) => { const a = 1.9 + i * 0.25, k = eio(tt, a, a + 0.35), dir = i < 5, off = (i % 5 - 2) * 0.055, len = 2 * Math.sqrt(Math.max(0.001, 0.145 * 0.145 - off * off));
      return <mesh key={i} position={[dir ? off : 0, 0.05 + (dir ? 0 : 0.006) + 0.15 * (1 - k), dir ? 0 : off]} rotation={[0, dir ? 0 : PI / 2, 0]} visible={k > 0.01}><boxGeometry args={[0.026, 0.009, len]} /><meshStandardMaterial color="#e8c48c" roughness={0.75} /></mesh>; })}
    {/* los tallos sobre la tabla */}
    <RBox s={[0.42, 0.02, 0.2]} r={0.006} p={[0.38, 0.01, 0.12]} rot={[0, -0.3, 0]}>{M.wood({ base: [176, 132, 86] })}</RBox>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.32 + i * 0.035, 0.032, 0.1 + i * 0.01]} rotation={[PI / 2, 0, -0.3 + PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.34 - i * 0.03, 12]} /><meshStandardMaterial color={i % 2 ? "#b83246" : "#c84a5a"} roughness={0.5} /></mesh>)}
    {[0, 1, 2].map((i) => <mesh key={"c" + i} position={[0.1 + i * 0.03, 0.07 - 0.04 * fill, 0.06]} visible={fill > 0.05 && fill < 0.98}><boxGeometry args={[0.018, 0.012, 0.018]} /><meshStandardMaterial color="#c84a5a" roughness={0.5} /></mesh>)}
  </>; }}</Scene3D>;

// ---- 10:40 · UN TIEMPO DE LLORAR: una rama pasa por las cuatro estaciones — brote, verde, naranja, desnuda — y vuelve a brotar ----
export const HSeasons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#20262a" warm={0.5}
  cam={{ at: [0, 0.6, 0], at1: [0.05, 0.6, 0], az: [-0.25, 0.2], el: [0.1, 0.08], r: [1.4, 1.15], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={0.6} x={960} y={1010} txt={["A TIME TO WEEP", "A TIME TO MOURN", "A TIME TO LAUGH", "A TIME TO DANCE"][Math.min(3, Math.floor(cl((tt - 0.4) / 4.8) * 4))]} col={AMB} size={42} />}>{(tt) => {
  const s = cl((tt - 0.4) / 4.8) * 4;   // 0 invierno → 1 brote → 2 verano → 3 otoño → 4 brote
  const leaf = s < 1 ? s : s < 2 ? 1 : s < 3 ? 1 : 1 - (s - 3) * 0.6;
  const col = new THREE.Color("#7fbf5a").lerp(new THREE.Color("#3f7a35"), cl(s - 1)).lerp(new THREE.Color("#d8792a"), cl(s - 2)).lerp(new THREE.Color("#a8d878"), cl(s - 3.4) * 1.6);
  const bg = new THREE.Color("#3a4450").lerp(new THREE.Color("#6a8aa8"), cl(s - 0.5)).lerp(new THREE.Color("#8a6a4a"), cl(s - 2.3)).lerp(new THREE.Color("#4a5a6a"), cl(s - 3.2));
  return <>
    <mesh position={[0, 0.6, -1.2]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color={bg} /></mesh>
    <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0.12]}><cylinderGeometry args={[0.018, 0.03, 1.2, 12]} />{M.wood({ base: [80, 56, 38] })}</mesh>
    {Array.from({ length: 14 }, (_, i) => { const y = 0.15 + i * 0.075, side = i % 2 ? 1 : -1, fallK = cl((s - 3) * 2 - rn(i, 2)), lk = cl(leaf * 1.4 - rn(i, 1) * 0.3);
      return <group key={i} position={[side * 0.02 - 0.12 * (y - 0.6) * 0.0 + (y - 0.6) * -0.12 + fallK * side * 0.2, y - fallK * y * 0.95, 0.02 * side]} rotation={[0, 0, side * 0.9 + fallK * 3]} scale={Math.max(0.05, lk)} visible={lk > 0.03 && fallK < 0.99}>
        <mesh position={[side * 0.05, 0, 0]} scale={[1, 0.45, 0.08]}><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>
      </group>; })}
    <pointLight position={[0.5, 1.4, 0.8]} intensity={1.6} distance={3} color="#ffeccc" />
  </>; }}</Scene3D>;

// ---- 11:13 · DIEZ LIBRAS MENOS: la balanza de cocina de aguja; la bolsa pesada sale del plato y la aguja vuelve diez libras ----
export const HScale10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" warm={0.55}
  cam={{ at: [0, 0.18, 0], at1: [0, 0.2, 0], az: [-0.2, 0.08], el: [0.15, 0.1], r: [0.95, 0.75], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="10 POUNDS LIGHTER" col={GRN} size={44} />}>{(tt) => {
  const lift = eio(tt, 1.4, 2.6), needle = lerp(0.82, 0.22, phys(tt, 2.2, 6, 0.35) * 1);
  return <>
    {/* el cuerpo de la balanza */}
    <RBox s={[0.3, 0.26, 0.2]} r={0.04} p={[0, 0.13, 0]}><meshPhysicalMaterial color="#d84a3a" roughness={0.35} clearcoat={0.8} /></RBox>
    <mesh position={[0, 0.15, 0.101]}><circleGeometry args={[0.1, 48]} /><meshStandardMaterial map={tex.text("ddial", 512, 512, (g) => { g.fillStyle = "#f6f2e6"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#222"; g.font = "700 40px Georgia"; g.textAlign = "center"; for (let i = 0; i <= 10; i++) { const a = -PI * 0.8 + i * PI * 0.16; g.fillText(String(i * 2), 256 + Math.cos(a - PI / 2) * 190, 270 + Math.sin(a - PI / 2) * 190); } g.font = "700 30px Georgia"; g.fillText("LBS", 256, 380); })} roughness={0.5} /></mesh>
    <mesh position={[0, 0.15, 0.104]} rotation={[0, 0, -(-PI * 0.8 + needle * PI * 1.6)]}><boxGeometry args={[0.004, 0.16, 0.002]} /><meshBasicMaterial color="#b0121a" /></mesh>
    <mesh position={[0, 0.15, 0.106]}><circleGeometry args={[0.008, 16]} />{M.steel()}</mesh>
    {/* el plato de arriba y la bolsa de arpillera */}
    <mesh position={[0, 0.27 - 0.01 * (1 - lift), 0]}><cylinderGeometry args={[0.13, 0.11, 0.012, 40]} />{M.steel({ col: "#d8dde2" })}</mesh>
    <group position={[lerp(0, 0.38, lift), 0.376 + 0.35 * lift, lerp(0, -0.05, lift)]} rotation={[0, 0, -0.25 * lift]}>
      <RBox s={[0.17, 0.2, 0.12]} r={0.006} p={[0, 0.0, 0]}><meshStandardMaterial color="#c8a274" roughness={0.95} /></RBox>
      <RBox s={[0.172, 0.03, 0.122]} r={0.004} p={[0, 0.1, 0]} rot={[0.08, 0, 0]}><meshStandardMaterial color="#b88f60" roughness={0.95} /></RBox>
      <mesh position={[0, 0.0, 0.061]}><planeGeometry args={[0.11, 0.07]} /><meshStandardMaterial map={paperTex("dlb10", ["10 LB"], { w: 256, h: 160, font: "900", bg: "#fbf7ec", ink: "#1f2c56" })} roughness={0.8} /></mesh>
    </group>
  </>; }}</Scene3D>;

const dayTex = (d: string, lines: string[], on: number) => tex.text("dday" + d + on, 256, 380, (g) => {
  g.fillStyle = on ? "#fff8e6" : "#e6e0d2"; g.fillRect(0, 0, 256, 380);
  g.fillStyle = "#7a1d18"; g.fillRect(0, 0, 256, 70); g.fillStyle = "#fff"; g.font = "900 46px Georgia"; g.textAlign = "center"; g.fillText(d, 128, 52);
  if (on) { g.fillStyle = "#1f2c56"; g.font = "italic 900 54px Georgia"; g.fillText(lines[0], 128, 210); g.fillStyle = "#7a1d18"; g.font = "700 34px Georgia"; if (lines[1]) g.fillText(lines[1], 128, 290); }
});
// ---- 12:37 · UNA COSA, UN DÍA, UNA HORA: el tablero de la semana; tres clavijas se encienden con lo que vas a hacer — martes cena a las 5, sábado cortar el pasto, domingo la iglesia a las 9:30 ----
export const HWeekpegs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.55}
  cam={{ at: [0, 0.95, 0], at1: [0.05, 0.95, 0], az: [-0.2, 0.15], el: [0.05, 0.03], r: [1.75, 1.6], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="ONE THING · A DAY · A TIME" col={AMB} size={42} />}>{(tt) => {
  const D = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"], ON: Record<number, [string[], number]> = { 1: [["Supper", "5:00"], 0.8], 5: [["Mow", ""], 2.2], 6: [["Church", "9:30"], 3.4] };
  return <>
    <RBox s={[1.5, 0.6, 0.03]} r={0.01} p={[0, 0.95, -0.01]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    {D.map((d, i) => { const o = ON[i], k = o ? phys(tt, o[1], 7, 0.45) : 0, on = o ? tt > o[1] : false;
      return <group key={d} position={[-0.63 + i * 0.21, 0.95, 0.01 + 0.03 * cl(k)]} rotation={[0, 0, on ? 0.04 * Math.sin(i) : 0]} scale={1 + 0.12 * cl(k) * (1 - cl((tt - (o ? o[1] : 0) - 0.8) * 2))}>
        <mesh><planeGeometry args={[0.18, 0.27]} /><meshStandardMaterial map={dayTex(d, o ? o[0] : [], on ? 1 : 0)} roughness={0.8} emissive="#ffd890" emissiveIntensity={on ? 0.08 : 0} /></mesh>
        <mesh position={[0, 0.16, 0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.05, 16]} />{on ? M.brass() : M.wood({ base: [110, 74, 44] })}</mesh>
        <mesh position={[0, 0.16, 0.048]}><sphereGeometry args={[0.02, 14, 10]} />{M.glow({ col: "#ffd27a", op: o ? 0.9 * cl((tt - o[1]) * 3) : 0 })}</mesh>
        <pointLight position={[0, 0.1, 0.25]} intensity={o ? 1.2 * cl((tt - o[1]) * 3) : 0} distance={0.6} color="#ffd890" />
      </group>; })}
  </>; }}</Scene3D>;

// ---- 13:07 · EL TANQUE LLENO CADA MES: el tablero del auto; la aguja de la nafta sube de E a F y la luz de las ruedas pasa a verde; 24 marquitas, dos años ----
export const HGasgauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121416" warm={0.45} key1={[-0.4, 1.4, 1.4]}
  cam={{ at: [0, 0.0, 0], at1: [0, 0.0, 0], az: [-0.15, 0.08], el: [0.05, 0.03], r: [1.05, 0.92], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="EVERY MONTH FOR TWO YEARS" col={AMB} size={40} />}>{(tt) => {
  const fuel = Math.min(1.06, phys(tt, 0.6, 4, 0.35)), tire = eio(tt, 2.6, 3.0), marks = Math.min(24, Math.floor(cl((tt - 2.8) / 2.2) * 24 + 0.001));
  return <>
    <RBox s={[1.0, 0.4, 0.06]} r={0.04} p={[0, 0, -0.03]}><meshStandardMaterial color="#1e2024" roughness={0.6} /></RBox>
    {/* el reloj de la nafta */}
    <mesh position={[-0.18, 0.02, 0.002]}><circleGeometry args={[0.13, 48]} /><meshStandardMaterial map={tex.text("dfuel", 512, 512, (g) => { g.fillStyle = "#0e0f12"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#e8e8e8"; g.lineWidth = 6; for (let i = 0; i <= 8; i++) { const a = -PI * 0.75 + i * PI * 0.1875; g.beginPath(); g.moveTo(256 + Math.cos(a - PI / 2) * 200, 256 + Math.sin(a - PI / 2) * 200); g.lineTo(256 + Math.cos(a - PI / 2) * (i % 4 ? 180 : 160), 256 + Math.sin(a - PI / 2) * (i % 4 ? 180 : 160)); g.stroke(); } g.fillStyle = "#e8e8e8"; g.font = "900 60px Arial"; g.fillText("E", 90, 330); g.fillText("F", 390, 330); g.fillStyle = "#f0a020"; g.font = "700 40px Arial"; g.fillText("FUEL", 210, 420); })} roughness={0.4} /></mesh>
    <mesh position={[-0.18, 0.02, 0.006]} rotation={[0, 0, -(-PI * 0.75 + fuel * PI * 1.5)]}><boxGeometry args={[0.005, 0.2, 0.002]} /><meshBasicMaterial color="#ff5a2a" /></mesh>
    <mesh position={[-0.18, 0.02, 0.008]}><circleGeometry args={[0.012, 16]} />{M.steel()}</mesh>
    {/* la luz de las ruedas */}
    <mesh position={[0.18, 0.08, 0.002]}><circleGeometry args={[0.04, 32]} />{M.glow({ col: tire > 0.5 ? "#4ae08a" : "#e0a020", op: 0.9 })}</mesh>
    <pointLight position={[0.18, 0.08, 0.12]} intensity={0.6} distance={0.5} color={tire > 0.5 ? "#4ae08a" : "#e0a020"} />
    {/* las 24 marquitas de los meses */}
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[0.04 + (i % 12) * 0.024, -0.06 - Math.floor(i / 12) * 0.05, 0.003]} visible={i < marks}><planeGeometry args={[0.012, 0.035]} /><meshBasicMaterial color="#e8e8e8" /></mesh>)}
  </>; }}</Scene3D>;

// ---- 14:13 · EL ÁNGEL DE LA TARDE: en la mesa de la familia alguien se queda de más; la señora del círculo lo toma del codo y se lo lleva, despacio, y la familia vuelve a comer ----
export const HAngel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0.75, 0.62, 0.3], at1: [1.05, 0.62, 0.45], az: [0.12, 0.05], el: [0.18, 0.16], r: [2.3, 2.1], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={1010} txt="«LET'S LET THEM EAT WHILE IT'S HOT»" col={AMB} size={36} />}>{(tt) => {
  const come = eio(tt, 0.6, 1.6), away = eio(tt, 2.0, 4.4);
  return <>
    {/* la mesa redonda con mantel blanco */}
    <mesh position={[0, 0.71, 0]} castShadow receiveShadow><cylinderGeometry args={[0.5, 0.5, 0.02, 48]} /><meshStandardMaterial color="#f4f1ea" roughness={0.85} /></mesh>
    <mesh position={[0, 0.64, 0]}><cylinderGeometry args={[0.505, 0.505, 0.12, 48, 1, true]} /><meshStandardMaterial color="#f4f1ea" roughness={0.85} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.04, 0.06, 0.6, 16]} />{M.wood({ base: [90, 60, 36] })}</mesh>
    {[0, 1, 2].map((i) => { const a = PI * 0.9 + i * 0.6; return <React.Fragment key={i}>
      <Person p={[Math.cos(a) * 0.72, -0.25, Math.sin(a) * 0.72]} s={0.82} ry={-a + PI / 2 + PI} coat={["#1c1c22", "#2a2a30", "#232028"][i]} hair={["#d8d4cc", "#6a5a4a", "#3a2a22"][i]} hold={0.5 * away} />
      <Plate p={[Math.cos(a) * 0.36, 0.722, Math.sin(a) * 0.36]} r={0.08} />
    </React.Fragment>; })}
    {/* el que se quedó de más y el ángel (delantal) que lo lleva del codo */}
    <Person p={[lerp(0.75, 1.35, away), 0, lerp(0.15, 0.45, away)]} s={0.9} ry={PI * 1.2 + away * 0.8} coat="#5a5a40" hair="#9a9488" />
    {/* el brazo de ella que lo toma del codo */}
    {(() => { const mx = lerp(0.75, 1.35, away), mz = lerp(0.15, 0.45, away), ax = lerp(1.5, 1.0, come) + lerp(0, 0.6, away), az = lerp(0.6, 0.38, come) + lerp(0, 0.3, away), dx = mx - ax, dz = mz - az, L = Math.max(0.05, Math.hypot(dx, dz)), reach = eio(tt, 1.4, 1.9);
      return <group position={[ax + dx * 0.5 * reach, 0.6, az + dz * 0.5 * reach]} rotation={[0, Math.atan2(dx, dz), 0]} visible={reach > 0.02}>
        <mesh rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.03, Math.max(0.02, L * reach - 0.06), 6, 12]} /><meshStandardMaterial color="#a0607a" roughness={0.9} /></mesh>
        <mesh position={[0, 0, L * reach * 0.5]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>
      </group>; })()}
    <group position={[lerp(1.5, 1.0, come) + lerp(0, 0.6, away), 0, lerp(0.6, 0.38, come) + lerp(0, 0.3, away)]}>
      <Person p={[0, 0, 0]} s={0.86} ry={PI * 1.3 + away * 0.6} coat="#a0607a" hair="#e8e4dc" hold={0.4} />
      <mesh position={[0, 0.55, 0.11]} rotation={[0, PI * 1.3 + away * 0.6, 0]}><planeGeometry args={[0.18, 0.3]} /><meshStandardMaterial color="#f6f0e0" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    </group>
    <pointLight position={[0, 1.6, 0]} intensity={1.8} distance={3} color="#ffe0b8" />
    <spotLight position={[1.4, 2.0, 1.4]} target-position={[1.2, 0.5, 0.6]} angle={0.5} penumbra={0.8} intensity={4} distance={3.5} color="#ffe6c8" />
  </>; }}</Scene3D>;
