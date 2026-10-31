// lsm29e · componentes únicos 8-14 (los 11 minutos en el reloj de la cocina, el brindis de dos minutos, cuatro horas hasta Sioux City, el muelle de Saylorville, 23 años de oraciones, la ponchera tamaño bañera, el reloj de pie en el tráiler).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, Candle, Glass, paperTex } from "./tg";
import { PunchBowl } from "./xg";

const PI = Math.PI;

const faceTex = tex.text("eclockface", 512, 512, (g) => {
  g.fillStyle = "#fbf8f0"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  g.fillStyle = "#1e1e22"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "700 58px Georgia";
  for (let i = 1; i <= 12; i++) { const a = i / 12 * PI * 2 - PI / 2; g.fillText(String(i), 256 + Math.cos(a) * 195, 256 + Math.sin(a) * 195); }
  for (let i = 0; i < 60; i++) { const a = i / 60 * PI * 2; g.fillRect(256 + Math.cos(a) * 232 - 2, 256 + Math.sin(a) * 232 - 2, i % 5 ? 4 : 8, i % 5 ? 4 : 8); }
});
// ---- 4:39 · ONCE MINUTOS: el reloj de pared de la cocina de la iglesia; el minutero barre once minutos y detrás crece la cuña roja del tiempo perdido ----
export const HClock11: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="tile" warm={0.75}
  cam={{ at: [0, 1.6, -1.55], at1: [0, 1.6, -1.55], az: [-0.18, 0.14], el: [0.04, -0.02], r: [1.25, 0.95], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="11 MINUTES · I TIMED IT" col={AMB} size={42} />}>{(tt) => {
  const k = eio(tt, 0.6, 4.4), m0 = 38, mm = m0 + 11 * k, wedge = (11 * k) / 60 * PI * 2;
  return <group position={[0, 1.6, -1.55]}>
    <mesh position={[0, 0, -0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.06, 64]} />{M.chrome({ col: "#d8dce0" })}</mesh>
    <mesh position={[0, 0, 0.012]}><circleGeometry args={[0.33, 64]} /><meshStandardMaterial map={faceTex} roughness={0.5} /></mesh>
    {/* la cuña roja: de los 38 minutos hasta donde va */}
    <mesh position={[0, 0, 0.014]} rotation={[0, 0, PI / 2 - m0 / 60 * PI * 2 - Math.max(0.01, wedge)]}><circleGeometry args={[0.27, 48, 0, Math.max(0.01, wedge)]} /><meshBasicMaterial color={RED} transparent opacity={0.42} depthWrite={false} /></mesh>
    {/* agujas */}
    <mesh position={[0, 0, 0.02]} rotation={[0, 0, -((7 + mm / 60) / 12) * PI * 2]}><boxGeometry args={[0.018, 0.17, 0.006]} /><meshStandardMaterial color="#1a1a1e" /></mesh>
    <group position={[0, 0, 0.024]} rotation={[0, 0, -(mm / 60) * PI * 2]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.012, 0.26, 0.005]} /><meshStandardMaterial color="#1a1a1e" /></mesh></group>
    <group position={[0, 0, 0.028]} rotation={[0, 0, -(tt * 0.9) * PI * 2 * 0.25]}><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.004, 0.28, 0.003]} /><meshStandardMaterial color={RED} /></mesh></group>
    <mesh position={[0, 0, 0.034]}><cylinderGeometry args={[0.012, 0.012, 0.01, 16]} />{M.brass()}</mesh>
    {/* vidrio */}
    <mesh position={[0, 0, 0.04]}><circleGeometry args={[0.335, 64]} />{M.glass({ op: 0.08 })}</mesh>
  </group>; }}</Scene3D>;

// ---- 4:57 · EL BRINDIS: la ficha se escribe sola (una historia, su nombre, un deseo) y al lado el aro de dos minutos se completa; al final el vaso se levanta ----
export const HToast2min: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#2c2420" warm={0.85}
  cam={{ at: [0.05, 0.04, 0], at1: [0.1, 0.06, 0], az: [-0.15, 0.1], el: [0.78, 0.6], r: [0.85, 0.72], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="TWO MINUTES · ONE STORY · ONE WISH" col={AMB} size={38} />}>{(tt) => {
  const lines = ["One story", "Their names", "One wish", "Raise your glass"], ink = eio(tt, 0.4, 3.6), ring = eio(tt, 0.4, 4.0), lift = eio(tt, 4.2, 5.0);
  return <>
    <Card map={tex.text("etoastL" + Math.round(ink * 8), 512, 320, (g) => {
      g.fillStyle = "#fbf7ec"; g.fillRect(0, 0, 512, 320); g.strokeStyle = "rgba(90,140,200,.35)"; g.lineWidth = 2;
      for (let y = 80; y < 320; y += 64) { g.beginPath(); g.moveTo(0, y + 14); g.lineTo(512, y + 14); g.stroke(); }
      g.fillStyle = "#1f2c56"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.font = "italic 700 40px Georgia";
      lines.forEach((l, i) => { if (ink * 4.2 > i + 0.4) { g.fillText("✓", 40, 80 + i * 64); g.fillText(l, 90, 80 + i * 64); } });
    })} w={0.34} h={0.2125} p={[-0.07, 0.004, 0]} rot={[0, 0.06, 0]} />
    {/* el aro de dos minutos */}
    <group position={[0.24, 0.004, -0.02]} rotation={[-PI / 2, 0, 0]}>
      <mesh><ringGeometry args={[0.07, 0.085, 64]} /><meshStandardMaterial color="#3a3430" roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, PI / 2]}><ringGeometry args={[0.07, 0.085, 64, 1, 0, -Math.max(0.01, ring) * PI * 2]} /><meshBasicMaterial color={AMB} side={THREE.DoubleSide} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.11, 0.05]} /><meshBasicMaterial map={tex.text("etimer" + Math.floor(ring * 120 / 5), 256, 128, (g) => { const s = Math.floor(ring * 120 / 5) * 5; g.clearRect(0, 0, 256, 128); g.fillStyle = "#f6efe0"; g.font = "900 86px Georgia"; g.textAlign = "center"; g.fillText(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, 128, 98); })} transparent depthWrite={false} /></mesh>
    </group>
    {/* el vaso de ponche que se levanta */}
    <group position={[0.24, 0.002 + 0.12 * lift, 0.16]} rotation={[0, 0, -0.1 * lift]}><Glass lv={0.7} col="#c4172a" /></group>
    <pointLight position={[0.1, 0.5, 0.3]} intensity={1.2} distance={1.6} color="#ffe2b8" />
  </>; }}</Scene3D>;

type V3 = [number, number, number];
// cilindro de a hasta b (caña, línea)
const Seg: React.FC<{ a: V3; b: V3; r0: number; r1: number; children: React.ReactNode }> = ({ a, b, r0, r1, children }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return <mesh position={A.clone().add(B).multiplyScalar(0.5)} quaternion={q}><cylinderGeometry args={[r1, r0, d.length(), 8]} />{children}</mesh>;
};
// el mapa de Iowa (silueta aproximada) con Ames y Sioux City
const MAP = { ames: [0.12, 0.02], sioux: [-0.36, 0.04] };
const iowaTex = tex.text("eiowa", 1024, 640, (g) => {
  g.fillStyle = "#e9e1cc"; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#cfd8b0"; g.beginPath(); g.moveTo(90, 120); g.lineTo(880, 110); g.bezierCurveTo(900, 170, 960, 220, 930, 300); g.bezierCurveTo(980, 380, 900, 440, 900, 520); g.lineTo(150, 530); g.bezierCurveTo(110, 420, 80, 300, 50, 200); g.closePath(); g.fill();
  g.strokeStyle = "#7a8a5a"; g.lineWidth = 6; g.stroke();
  g.strokeStyle = "rgba(120,110,90,.25)"; g.lineWidth = 2; for (let x = 120; x < 900; x += 70) { g.beginPath(); g.moveTo(x, 115); g.lineTo(x, 525); g.stroke(); } for (let y = 150; y < 520; y += 60) { g.beginPath(); g.moveTo(70, y); g.lineTo(920, y); g.stroke(); }
  g.fillStyle = "#3a2e22"; g.font = "700 40px Georgia"; g.textAlign = "center"; g.fillText("AMES", 512 + 0.12 * 1024 + 20, 280); g.textAlign = "left"; g.fillText("SIOUX CITY", 105, 270);
});
// ---- 5:34 · CUATRO HORAS: el mapa de Iowa sobre la mesa; el autito sale de Ames y dibuja la ruta hasta Sioux City mientras el reloj gira cuatro vueltas ----
export const HFourhours: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#2a2420" warm={0.8}
  cam={{ at: [0.08, 0.02, 0.06], at1: [0.06, 0.02, 0.06], az: [0.06, -0.04], el: [1.0, 0.9], r: [1.5, 1.38], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="FOUR HOURS TO SIOUX CITY" col={AMB} size={40} />}>{(tt) => {
  const k = eio(tt, 0.6, 4.8), P = (u: number): [number, number] => [lerp(MAP.ames[0], MAP.sioux[0], u), lerp(MAP.ames[1], MAP.sioux[1], u) + 0.05 * Math.sin(u * PI * 2.2)];
  const [cx, cz] = P(k), [nx, nz] = P(Math.min(1, k + 0.01));
  return <>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.0, 0.625]} /><meshStandardMaterial map={iowaTex} roughness={0.85} /></mesh>
    {/* la ruta que se va dibujando */}
    {Array.from({ length: 40 }, (_, i) => { const u = i / 40, [x, z] = P(u); return <mesh key={i} position={[x, 0.004, z]} rotation={[-PI / 2, 0, 0]} visible={u < k}><circleGeometry args={[0.006, 10]} /><meshBasicMaterial color={RED} /></mesh>; })}
    {/* los alfileres */}
    {[MAP.ames, MAP.sioux].map(([x, z], i) => <group key={i} position={[x, 0, z]}><mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.002, 0.002, 0.06, 6]} />{M.steel()}</mesh><mesh position={[0, 0.062, 0]}><sphereGeometry args={[0.012, 14, 10]} /><meshStandardMaterial color={i ? "#2a5a9a" : RED} roughness={0.3} /></mesh></group>)}
    {/* el autito */}
    <group position={[cx, 0.012, cz]} rotation={[0, Math.atan2(-(nz - cz), nx - cx), 0]}>
      <RBox s={[0.05, 0.014, 0.024]} r={0.005}><meshPhysicalMaterial color="#2e6a8a" roughness={0.3} clearcoat={1} /></RBox>
      <RBox s={[0.026, 0.012, 0.022]} r={0.004} p={[-0.004, 0.012, 0]}><meshPhysicalMaterial color="#cfe2ee" roughness={0.1} clearcoat={1} /></RBox>
    </group>
    {/* el reloj de mesa que da cuatro vueltas */}
    <group position={[0.62, 0.01, 0.1]} rotation={[-PI / 2, 0, 0]} scale={1.35}>
      <mesh><circleGeometry args={[0.07, 48]} /><meshStandardMaterial map={faceTex} roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, -k * 4 * PI * 2]}><planeGeometry args={[0.004, 0.11]} /><meshBasicMaterial color="#1a1a1e" /></mesh>
      <mesh position={[0, 0, 0.003]} rotation={[0, 0, -(k * 4 / 12) * PI * 2]}><planeGeometry args={[0.006, 0.07]} /><meshBasicMaterial color="#1a1a1e" /></mesh>
    </group>
    <pointLight position={[0, 0.6, 0.2]} intensity={1.0} distance={1.8} color="#ffe6c4" />
  </>; }}</Scene3D>;

// ---- 5:48 · EL LAGO DE SAYLORVILLE: amanece sobre el muelle; dos cañas chicas y una grande, los corchos rojiblancos que se mecen y los anillos en el agua ----
export const HFishing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#e7b88a" warm={0.7} key1={[-2.0, 1.2, -2.0]}
  cam={{ at: [0.0, 0.18, -0.55], at1: [0.0, 0.16, -0.7], az: [0.4, 0.28], el: [0.32, 0.27], r: [2.1, 1.85], fov: 36 }}>{(tt) => {
  const dip = (i: number) => 0.012 * Math.sin(tt * 1.6 + i * 1.7) - 0.02 * eio(((tt + i * 1.3) % 4), 2.6, 2.9) * (1 - eio(((tt + i * 1.3) % 4), 3.0, 3.6));
  return <>
    {/* el lago y el cielo del amanecer */}
    <mesh position={[0, 0, -2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[12, 10]} />{M.water({ col: "#8fa8b8", op: 0.95, emI: 0.15 })}</mesh>
    <mesh position={[0, 1.4, -6]}><planeGeometry args={[16, 4]} /><meshBasicMaterial color="#f2c89a" /></mesh>
    <mesh position={[-1.2, 0.3, -5.8]}><circleGeometry args={[0.35, 40]} />{M.glow({ col: "#ffe2a8", op: 0.95 })}</mesh>
    <mesh position={[0, 0.12, -5.6]}><planeGeometry args={[16, 0.25]} /><meshStandardMaterial color="#5a6a4a" roughness={1} /></mesh>
    {/* el muelle */}
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.7, 0.03, 0.12]} r={0.006} p={[0, 0.12, 0.6 - i * 0.13]}>{M.wood({ base: [120, 88, 56] })}</RBox>)}
    {[-0.32, 0.32].map((x) => [0.5, -0.4].map((z) => <mesh key={x + "_" + z} position={[x, 0.0, z]}><cylinderGeometry args={[0.03, 0.03, 0.36, 12]} />{M.wood({ base: [90, 64, 40] })}</mesh>))}
    {/* tres cañas: grande al medio, dos chicas a los costados */}
    {[[-0.2, 0.7, 0], [0.0, 1.0, 1], [0.2, 0.7, 2]].map(([x, L, i]) => { const tug = i === 1 ? 0.05 * eio(tt % 3, 2.0, 2.2) * (1 - eio(tt % 3, 2.3, 2.9)) : 0, sway = 0.01 * Math.sin(tt * 0.7 + i);
      const base: V3 = [x, 0.15, 0.3], tip: V3 = [x * 1.8 + sway, 0.16 + L * 0.5 - tug, 0.3 - L * 0.85], bz = -1.0 - i * 0.12 - 0.15 * (i % 2), bx = x * 3.0, bob: V3 = [bx, 0.03 + dip(i), bz];
      return <group key={i}>
        <Seg a={base} b={tip} r0={0.009} r1={0.0035}><meshStandardMaterial color="#6a4a2a" roughness={0.5} /></Seg>
        <Seg a={tip} b={bob} r0={0.0009} r1={0.0009}><meshBasicMaterial color="#f4f4f0" transparent opacity={0.7} /></Seg>
        <group position={[bx, 0.015 + dip(i), bz]}>
          <mesh position={[0, 0.012, 0]}><sphereGeometry args={[0.026, 14, 10, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#d42a22" roughness={0.4} /></mesh>
          <mesh><sphereGeometry args={[0.026, 14, 10, 0, PI * 2, PI / 2, PI / 2]} /><meshStandardMaterial color="#f4f2ea" roughness={0.4} /></mesh>
        </group>
        {[0, 1, 2].map((r) => { const ph = ((tt * 0.4 + i * 0.3 + r / 3) % 1); return <mesh key={r} position={[bx, 0.004, bz]} rotation={[-PI / 2, 0, 0]} scale={0.6 + 2.6 * ph}><ringGeometry args={[0.03, 0.036, 48]} /><meshBasicMaterial color="#fff8ec" transparent opacity={0.75 * (1 - ph)} depthWrite={false} /></mesh>; })}
      </group>; })}
    {/* el balde */}
    <mesh position={[0.24, 0.2, 0.42]}><cylinderGeometry args={[0.06, 0.05, 0.12, 24, 1, true]} />{M.steel({ col: "#a8aeb4", side: THREE.DoubleSide })}</mesh>
  </>; }}</Scene3D>;

// ---- 6:24 · VEINTITRÉS AÑOS DE ORACIONES: una vela en la ventana de noche; las tarjetitas de oración caen de a una sobre el alféizar, año tras año, hasta hacer la pila de 23 ----
export const HPrayed23: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#141a26" warm={0.45} key1={[0.4, 1.8, 1.2]}
  cam={{ at: [0, 0.98, 0], at1: [0.05, 0.98, 0], az: [-0.28, 0.12], el: [0.12, 0.1], r: [1.05, 0.85], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="23 YEARS OF PRAYERS" col={AMB} size={42} />}>{(tt) => {
  const n = Math.round(23 * eio(tt, 0.6, 4.4));
  return <>
    {/* la ventana: marco, vidrio de noche con estrellas */}
    <mesh position={[0, 1.3, -0.25]}><planeGeometry args={[1.0, 0.7]} /><meshBasicMaterial color="#1c2640" /></mesh>
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.9, 1.0 + rn(i, 2) * 0.6, -0.248]}><circleGeometry args={[0.003 + 0.003 * rn(i, 3), 6]} /><meshBasicMaterial color="#f4f0dc" transparent opacity={0.5 + 0.3 * Math.sin(tt * 1.2 + i)} /></mesh>)}
    {[[0, 1.66, 1.06, 0.04], [0, 0.94, 1.06, 0.04], [-0.52, 1.3, 0.04, 0.76], [0.52, 1.3, 0.04, 0.76], [0, 1.3, 0.03, 0.72]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.05]} r={0.006} p={[x, y, -0.22]}><meshStandardMaterial color="#efe9dc" roughness={0.7} /></RBox>)}
    {/* el alféizar */}
    <RBox s={[1.2, 0.04, 0.3]} r={0.008} p={[0, 0.9, -0.1]}><meshStandardMaterial color="#efe9dc" roughness={0.7} /></RBox>
    <Candle p={[-0.25, 0.92, -0.08]} tt={tt} on={1} h={0.14} />
    {/* las tarjetas */}
    {Array.from({ length: 23 }, (_, i) => { const k = phys(tt, 0.6 + i * 0.165, 8, 0.5);
      return <group key={i} visible={i < n && k > 0.05}><RBox s={[0.12, 0.004, 0.08]} r={0.001} p={[0.18 + 0.01 * (rn(i, 1) - 0.5), 0.922 + i * 0.0045 + 0.25 * (1 - cl(k)), -0.08 + 0.01 * (rn(i, 2) - 0.5)]} rot={[0, 0.3 * (rn(i, 3) - 0.5), 0]}><meshStandardMaterial color={i % 2 ? "#f6f0e2" : "#efe4cc"} roughness={0.85} /></RBox></group>; })}
    <pointLight position={[-0.25, 1.1, 0.05]} intensity={1.6} distance={1.6} color="#ffc880" />
  </>; }}</Scene3D>;

// regalo chico envuelto con cinta
export const Gift: React.FC<{ p: number[]; s?: number[]; col: string; rib?: string; ry?: number }> = ({ p, s = [0.1, 0.08, 0.1], col, rib = "#f4ecd8", ry = 0 }) => <group position={p as [number, number, number]} rotation={[0, ry, 0]}>
  <RBox s={s} r={0.004} p={[0, s[1] / 2, 0]}><meshStandardMaterial color={col} roughness={0.55} /></RBox>
  <mesh position={[0, s[1] / 2, 0]}><boxGeometry args={[s[0] * 1.02, s[1] * 1.02, 0.014]} /><meshStandardMaterial color={rib} roughness={0.4} /></mesh>
  <mesh position={[0, s[1] / 2, 0]}><boxGeometry args={[0.014, s[1] * 1.02, s[2] * 1.02]} /><meshStandardMaterial color={rib} roughness={0.4} /></mesh>
  <mesh position={[0, s[1] + 0.008, 0]} scale={[1, 0.5, 1]}><torusKnotGeometry args={[0.012, 0.004, 32, 6]} /><meshStandardMaterial color={rib} roughness={0.4} /></mesh>
</group>;
// ---- 6:54 · LA PONCHERA TAMAÑO BAÑERA: la mesa de regalos con sus cajitas; baja una ponchera de cristal gigante y los regalos se corren para hacerle lugar ----
export const HBigbowl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0, 0.75, 0], at1: [0, 0.85, 0], az: [-0.3, 0.2], el: [0.3, 0.22], r: [1.6, 2.0], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THE SIZE OF A BATHTUB" col={AMB} size={42} />}>{(tt) => {
  const d = phys(tt, 1.2, 4.5, 0.6), push = eio(tt, 1.6, 2.4);
  const G = [[-0.5, -0.1, "#c43a3a"], [-0.3, 0.12, "#3a6aa8"], [-0.1, -0.12, "#f2e6c8"], [0.1, 0.1, "#6a9a5a"], [0.3, -0.1, "#d4a63e"], [0.5, 0.12, "#e8c8d0"]] as [number, number, string][];
  return <>
    <RBox s={[1.5, 0.04, 0.7]} r={0.01} p={[0, 0.72, 0]}><meshStandardMaterial color="#f3eee2" roughness={0.9} /></RBox>
    {[[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]].map(([x, z], i) => <mesh key={i} position={[x, 0.36, z]}><cylinderGeometry args={[0.02, 0.02, 0.72, 10]} />{M.steel()}</mesh>)}
    {G.map(([x, z, c], i) => { const away = Math.sign(x) * 0.3 * push * (Math.abs(x) < 0.35 ? 1 : 0.5); return <Gift key={i} p={[x + away, 0.74, z + 0.03 * Math.sin(i)]} col={c} s={[0.09 + 0.02 * (i % 2), 0.07 + 0.02 * (i % 3), 0.09]} ry={0.3 * i} />; })}
    <group position={[0, 0.74 + 0.9 * (1 - cl(d)), 0]} scale={2.6}><PunchBowl tt={tt} scoops={0} /></group>
    <pointLight position={[0.3, 1.6, 0.6]} intensity={1.8} distance={3} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 7:09 · UN RELOJ DE PIE EN EL TRÁILER: el living chiquito del tráiler en corte; el reloj de dos metros entra, la corona topa el techo bajo, el péndulo va y viene y cada tanto suena ----
export const HGrandclock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#2a2622" warm={0.8} key1={[0.8, 2.4, 2.0]}
  cam={{ at: [0, 0.95, 0], at1: [0.15, 1.0, 0], az: [-0.4, -0.2], el: [-0.06, -0.1], r: [2.5, 2.1], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="SEVEN FEET TALL · IN A TRAILER" col={AMB} size={40} />}>{(tt) => {
  const inn = eio(tt, 0.4, 1.8), bump = eio(tt, 1.8, 2.1) * (1 - eio(tt, 2.1, 2.6)), sw = Math.sin(tt * PI * 1.1) * 0.22, chime = (tt % 2.2) / 2.2;
  return <>
    {/* el tráiler en corte: piso de linóleo, paredes de madera prensada, techo bajo */}
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial map={tex.tile(8, 5, "#c9b98e", "#a8996e")} roughness={0.6} /></mesh>
    <mesh position={[0, 0.75, -0.7]}><planeGeometry args={[2.4, 1.5]} />{M.wood({ base: [150, 112, 70] })}</mesh>
    <mesh position={[-1.2, 0.75, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[1.4, 1.5]} />{M.wood({ base: [150, 112, 70] })}</mesh>
    <mesh position={[0, 1.5 + 0.015 * bump, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial color="#e6e0d2" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <RBox s={[2.4, 0.06, 0.06]} r={0.01} p={[0, 1.47 + 0.015 * bump, 0.68]}>{M.wood({ base: [120, 84, 50] })}</RBox>
    <mesh position={[0.55, 1.495, -0.45]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.22 + 0.1 * bump, 32]} /><meshBasicMaterial color="#ffcf8a" transparent opacity={0.6 * bump} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
    {/* la ventanita y el sofá de flores */}
    <mesh position={[-0.6, 0.95, -0.69]}><planeGeometry args={[0.5, 0.32]} />{M.glow({ col: "#dfe8f0", op: 0.9 })}</mesh>
    <RBox s={[0.9, 0.36, 0.42]} r={0.06} p={[-0.55, 0.18, -0.45]}><meshStandardMaterial color="#b58a7a" roughness={0.9} /></RBox>
    <RBox s={[0.9, 0.3, 0.12]} r={0.05} p={[-0.55, 0.48, -0.62]}><meshStandardMaterial color="#a87a6a" roughness={0.9} /></RBox>
    {/* el reloj de pie */}
    <group position={[lerp(1.3, 0.55, inn), 0, -0.45]}>
      <RBox s={[0.36, 1.2, 0.24]} r={0.02} p={[0, 0.6, 0]}>{M.wood({ base: [86, 44, 24] })}</RBox>
      <RBox s={[0.42, 0.3, 0.28]} r={0.02} p={[0, 1.33, 0]}>{M.wood({ base: [86, 44, 24] })}</RBox>
      <mesh position={[0, 1.33, 0.142]}><circleGeometry args={[0.12, 48]} /><meshStandardMaterial map={faceTex} roughness={0.5} /></mesh>
      <mesh position={[0, 0.65, 0.122]}><planeGeometry args={[0.2, 0.75]} />{M.glass({ op: 0.18 })}</mesh>
      <group position={[0, 1.05, 0.08]} rotation={[0, 0, sw]}>
        <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.004, 0.004, 0.6, 6]} />{M.brass()}</mesh>
        <mesh position={[0, -0.6, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.01, 32]} />{M.brass()}</mesh>
      </group>
      {/* el anillo del campanazo */}
      <mesh position={[0, 1.33, 0.16]} scale={0.3 + 2.2 * chime}><ringGeometry args={[0.12, 0.13, 48]} /><meshBasicMaterial color="#ffe2a8" transparent opacity={0.5 * (1 - chime) * cl(inn * 2 - 1)} depthWrite={false} /></mesh>
    </group>
    <pointLight position={[0, 1.3, 0.4]} intensity={1.6} distance={2.6} color="#ffe2b8" />
    <pointLight position={[0.55, 0.8, 0.5]} intensity={1.2} distance={1.4} color="#fff0d8" />
  </>; }}</Scene3D>;
