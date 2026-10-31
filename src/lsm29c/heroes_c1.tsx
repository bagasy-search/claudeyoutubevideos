// lsm29c · componentes únicos 1-6 (la tarjeta de crédito de 1983, el sobre de la plata, tachar montos, el regalo más notado, el frasco de Wanda, los regalos sin firma).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, Table, paperTex } from "./tg";
import { Envelope } from "./xg";
import { Bill } from "./pg";

const PI = Math.PI;
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT"];
const monthTex = (i: number) => tex.text("xmon" + i, 512, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#8f1d18"; g.fillRect(0, 0, 512, 110);
  g.fillStyle = "#fff"; g.font = "900 78px Georgia"; g.textAlign = "center"; g.fillText(MON[i] + " 1984", 256, 82);
  g.strokeStyle = "rgba(60,40,30,.35)"; g.lineWidth = 2;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(22 + c * 67, 130 + r * 72, 67, 72);
  // la cuota marcada en rojo en el día 15
  g.strokeStyle = "#c0261d"; g.lineWidth = 7; g.beginPath(); g.arc(22 + 0 * 67 + 33 + 67 * 0, 130 + 2 * 72 + 36, 30, 0, 6.3); g.stroke();
  g.fillStyle = "#c0261d"; g.font = "italic 700 34px Georgia"; g.textAlign = "left"; g.fillText("pay the card", 90, 130 + 2 * 72 + 48);
});

// ---- 2:50 · LA NAVIDAD QUE DURÓ 10 MESES: el almanaque de la cocina pasa sus hojas de enero a octubre, cada una con la cuota en rojo, y el tambor cuenta los meses ----
export const HBillmonths: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.85} key1={[-1.0, 2.2, 1.8]}
  cam={{ at: [0, 0.62, 0], at1: [0.04, 0.6, 0], az: [-0.18, 0.12], el: [0.05, 0.02], r: [1.55, 1.25], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="10 MONTHS OF PAYMENTS" col={RED} size={44} />}>{(tt) => {
  const k = cl((tt - 0.5) / 3.6), n = Math.min(9, Math.floor(k * 10));
  return <>
    {/* el clavo y el almanaque colgado */}
    <mesh position={[0, 1.0, 0.02]}><cylinderGeometry args={[0.006, 0.006, 0.03, 8]} />{M.steel()}</mesh>
    <RBox s={[0.5, 0.03, 0.012]} r={0.004} p={[0, 0.97, 0.02]}>{M.wood({ base: [96, 58, 30] })}</RBox>
    {MON.map((_, i) => { const f = i < n ? 1 : i === n ? cl((k * 10 - i) * 1.4) * (i === 9 ? 0 : 1) : 0, lift = eio(f, 0, 1);
      return <group key={i} position={[0, 0.955, 0.03 + (9 - i) * 0.0012]} rotation={[-PI * 0.97 * lift, 0, 0.02 * Math.sin(i)]}>
        <mesh position={[0, -0.25, 0]} visible={lift < 0.985}><planeGeometry args={[0.48, 0.5]} /><meshStandardMaterial map={monthTex(i)} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      </group>; })}
    {/* la factura abierta y la tarjeta en la mesada */}
    <RBox s={[1.4, 0.04, 0.5]} r={0.01} p={[0, 0.42, 0.35]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    <Card map={paperTex("xbill", ["STATEMENT", "BALANCE DUE  $1,186.40", "MINIMUM  $40"], { w: 512, h: 400, font: "700", bg: "#f2efe6" })} w={0.26} h={0.2} p={[-0.28, 0.443, 0.36]} rot={[0, 0.25, 0]} />
    <RBox s={[0.15, 0.003, 0.095]} r={0.008} p={[0.3, 0.443, 0.4]} rot={[0, -0.3, 0]}><meshPhysicalMaterial color="#c9b37a" metalness={0.5} roughness={0.35} clearcoat={0.6} /></RBox>
    {/* el tambor de meses */}
    <group position={[0.4, 0.62, 0.15]}><DigitDrum v={Math.floor((n + 1) / 10)} p={[-0.045, 0, 0]} r={0.05} w={0.06} /><DigitDrum v={(n + 1) % 10} p={[0.045, 0, 0]} r={0.05} w={0.06} /></group>
  </>; }}</Scene3D>;

// ---- 3:06 · EL SOBRE BLANCO: un sobre común en la mesa, el lápiz escribe «Christmas» y los billetes que de verdad hay entran adentro ----
const xmasFront = (n: number) => tex.text("xenvf" + n, 512, 224, (g) => {
  g.fillStyle = "#f6f3ea"; g.fillRect(0, 0, 512, 224);
  g.fillStyle = "#3a332c"; g.font = "italic 700 76px Georgia"; g.textAlign = "left"; g.fillText("Christmas".slice(0, n), 60, 138);
});
export const HCashenvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [-0.04, 0.03, 0.1], at1: [0.0, 0.02, 0.06], az: [-0.12, 0.05], el: [1.0, 0.95], r: [0.82, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="ONLY THE CASH YOU HAVE" col={AMB} size={44} />}>{(tt) => {
  const wr = cl((tt - 0.4) / 1.6), nl = Math.round(wr * 9), px = lerp(-0.08, 0.1, wr);
  return <>
    <Table w={1.6} d={1.0} top={0.003} />
    <Envelope p={[0, 0.004, 0]} front={xmasFront(nl)} s={2.1} rot={[-PI / 2, 0, 0]} />
    {/* el lápiz amarillo escribe y después se aparta */}
    <group position={[px, 0.02 + 0.006 * Math.abs(Math.sin(tt * 9)) * (wr < 1 ? 1 : 0) + 0.1 * eio(tt, 2.0, 2.5), 0.02 + 0.08 * eio(tt, 2.0, 2.5)]} rotation={[0.9, 0.2, 0.5]}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.17, 6]} /><meshStandardMaterial color="#f0c43a" roughness={0.5} /></mesh>
      <mesh position={[0, -0.09, 0]}><coneGeometry args={[0.006, 0.02, 6]} /><meshStandardMaterial color="#e2c39a" /></mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.0062, 0.0062, 0.015, 8]} /><meshStandardMaterial color="#e48a9a" /></mesh>
    </group>
    {/* los billetes que hay, de a uno, deslizándose dentro del sobre */}
    {[20, 20, 10, 5, 1].map((v, i) => { const a = 2.5 + i * 0.38, k = eio(tt, a, a + 0.55);
      return <group key={i} visible={k < 0.97}><Bill v={String(v)} p={[lerp(-0.26 + i * 0.03, 0, k), lerp(0.016, 0.008, k) + 0.03 * Math.sin(PI * k) + i * 0.001, lerp(0.24, -0.06, k)]} rot={[-PI / 2, 0, lerp(0.4 - i * 0.12, 0, k)]} s={lerp(1.0, 0.8, k)} /></group>; })}
  </>; }}</Scene3D>;

// ---- 3:39 · TACHAR MONTOS, NO NOMBRES: el dorso del sobre con la lista; el lápiz raya cada monto y escribe uno más chico, y ningún nombre se toca ----
const NAMES = [["Harold", 40, 25], ["Emily", 30, 20], ["Daniel", 30, 20], ["June", 25, 15], ["Pastor Ray", 20, 10]];
const listTex = (st: number) => tex.text("xlist" + st, 512, 512, (g) => {
  g.fillStyle = "#f6f3ea"; g.fillRect(0, 0, 512, 512);
  g.font = "italic 700 50px Georgia"; g.textBaseline = "middle";
  NAMES.forEach(([n, a, b], i) => { const y = 70 + i * 92; g.fillStyle = "#3a332c"; g.textAlign = "left"; g.fillText(String(n), 34, y);
    g.textAlign = "right"; g.fillText("$" + a, 340, y);
    if (st > i) { g.strokeStyle = "#b0261d"; g.lineWidth = 13; g.lineCap = "round"; g.beginPath(); g.moveTo(240, y + 6); g.lineTo(352, y - 8); g.stroke(); g.fillStyle = "#1f7a3a"; g.font = "900 58px Georgia"; g.fillText("$" + b, 492, y); g.font = "italic 700 50px Georgia"; } });
});
export const HCrossamounts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.02, 0.07], at1: [0.01, 0.02, 0.07], az: [0.1, -0.03], el: [1.2, 1.15], r: [0.95, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="CROSS OFF AMOUNTS · NOT NAMES" col={AMB} size={36} />}>{(tt) => {
  const st = Math.min(5, Math.floor(cl((tt - 0.4) / 3.4) * 5.99)), lr = (cl((tt - 0.4) / 3.4) * 5) % 1, row = Math.min(4, st);
  return <>
    <Table w={1.6} d={1.0} top={0.003} />
    <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]} castShadow><planeGeometry args={[0.42, 0.42]} /><meshStandardMaterial map={listTex(st)} roughness={0.85} /></mesh>
    <group position={[lerp(0.0, 0.13, lr) + (st >= 5 ? 0.25 : 0), 0.03 + (st >= 5 ? 0.06 : 0.004 * Math.abs(Math.sin(tt * 10))), -0.155 + row * 0.077]} rotation={[0.9, 0.2, 0.6]}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.17, 6]} /><meshStandardMaterial color="#f0c43a" roughness={0.5} /></mesh>
      <mesh position={[0, -0.09, 0]}><coneGeometry args={[0.006, 0.02, 6]} /><meshStandardMaterial color="#e2c39a" /></mesh>
    </group>
    {/* los nombres quedan bajo una luz tibia, intactos */}
    <mesh position={[-0.11, 0.008, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.18, 0.42]} />{M.glow({ col: "#ffd890", op: 0.1 * eio(tt, 3.6, 4.4) })}</mesh>
  </>; }}</Scene3D>;

// ---- 5:00 · EL MÁS NOTADO, NO EL MÁS CARO: la caja dorada con moño grande se apaga y se hunde; el paquetito de papel madera con lana roja recibe la luz y sube ----
export const HNoticed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.5} lamp={[0.22, 0.5, 0.2]}
  cam={{ at: [-0.05, 0.12, 0], at1: [0.18, 0.1, 0.05], az: [-0.2, 0.2], el: [0.32, 0.28], r: [1.15, 0.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THE MOST NOTICED THING" col={AMB} size={44} />}>{(tt) => {
  const sw = eio(tt, 1.4, 3.4), dim = 1 - 0.85 * sw, rise = 0.12 * sw;
  const gold = <meshStandardMaterial color="#d8b04a" metalness={0.75} roughness={0.25} emissive="#3a2a00" emissiveIntensity={0.3 * dim} />;
  return <>
    <Table w={1.8} d={1.0} top={0.003} />
    {/* la caja cara: brilla primero y después se queda en sombra */}
    <group position={[-0.24, -0.02 * sw, -0.06 * sw]} scale={[1 - 0.25 * sw, 1 - 0.45 * sw, 1 - 0.25 * sw]}>
      <RBox s={[0.26, 0.2, 0.22]} r={0.006} p={[0, 0.1, 0]}><meshStandardMaterial color={new THREE.Color("#1d3d6e").multiplyScalar(0.4 + 0.6 * dim)} roughness={0.35} metalness={0.2} /></RBox>
      <RBox s={[0.035, 0.205, 0.225]} r={0.003} p={[0, 0.1, 0]}>{gold}</RBox>
      <RBox s={[0.265, 0.205, 0.035]} r={0.003} p={[0, 0.1, 0]}>{gold}</RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.04, 0.215, 0]} rotation={[PI / 2, k * 0.5, 0]} scale={[1, 1, 0.5]}><torusGeometry args={[0.04, 0.012, 10, 24]} />{gold}</mesh>)}
      <Card map={paperTex("xprice", ["$89.00"], { w: 256, h: 128, font: "900", bg: "#fff" })} w={0.08} h={0.04} p={[0.15, 0.02, 0.12]} rot={[0, -0.4, 0]} />
    </group>
    {/* el paquetito notado */}
    <group position={[0.2, rise, 0.05]} rotation={[0, -0.3 + 0.2 * sw, 0]}>
      <RBox s={[0.13, 0.09, 0.11]} r={0.006} p={[0, 0.045, 0]}><meshStandardMaterial color="#a77b4c" roughness={0.9} /></RBox>
      <RBox s={[0.012, 0.093, 0.113]} r={0.003} p={[0, 0.045, 0]}><meshStandardMaterial color="#b52a22" roughness={1} /></RBox>
      <RBox s={[0.133, 0.093, 0.012]} r={0.003} p={[0, 0.045, 0]}><meshStandardMaterial color="#b52a22" roughness={1} /></RBox>
      <mesh position={[0, 0.098, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.005, 8, 18]} /><meshStandardMaterial color="#b52a22" roughness={1} /></mesh>
      <Card map={paperTex("xtagm", ["for June", "cardinals"], { w: 256, h: 160 })} w={0.07} h={0.045} p={[0.085, 0.01, 0.06]} rot={[0, -0.5, 0]} />
    </group>
    <spotLight position={[0.2, 0.9, 0.3]} target-position={[0.2, 0, 0.05]} angle={0.35} penumbra={0.6} intensity={0.15 + 1.8 * sw} distance={2} color="#ffc98a" />
    <mesh position={[0.2, 0.007, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 40]} />{M.glow({ col: "#ffcf7a", op: 0.1 * sw })}</mesh>
  </>; }}</Scene3D>;

// ---- 4:43 · EL FRASCO DE WANDA: el frasco de mermelada de ruibarbo; la cinta de papel se despliega sobre la tapa y aparece la letra «for Loretta · because you always wave» ----
const tapeTex = (n: number) => tex.text("xtape" + n, 1024, 160, (g) => {
  g.fillStyle = "#efe3c4"; g.fillRect(0, 0, 1024, 160);
  for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(150,120,70,${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 1024, rn(i, 4) * 160, 3, 3); }
  g.fillStyle = "#2b2a5a"; g.font = "italic 700 62px Georgia"; g.textAlign = "left"; g.fillText("for Loretta, because you always wave".slice(0, n), 26, 102);
});
export const HJarlid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.95}
  cam={{ at: [0, 0.07, 0.08], at1: [0, 0.08, 0.1], az: [-0.25, 0.0], el: [0.45, 0.7], r: [0.85, 0.66], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="BECAUSE YOU ALWAYS WAVE" col={AMB} size={42} />}>{(tt) => {
  const un = eio(tt, 0.5, 1.6), wr = Math.round(cl((tt - 1.7) / 2.2) * 36);
  return <>
    <RBox s={[1.6, 0.04, 0.9]} r={0.01} p={[0, -0.016, 0]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    {/* frasco con mermelada roja y la tapa dorada */}
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.07, 0.07, 0.16, 40, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.066, 0.066, 0.145, 40]} /><meshPhysicalMaterial color="#8a1424" roughness={0.15} clearcoat={1} transparent opacity={0.92} /></mesh>
    <mesh position={[0, 0.172, 0]}><cylinderGeometry args={[0.074, 0.074, 0.025, 40]} />{M.brass({ col: "#c9a24a" })}</mesh>
    {/* la cinta: se estira sobre la tapa de izquierda a derecha */}
    <mesh position={[-0.065 + 0.065 * un, 0.1855, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.02, un), 1, 1]}><planeGeometry args={[0.13, 0.03]} /><meshStandardMaterial map={tapeTex(wr)} roughness={0.9} /></mesh>
    {/* la etiqueta grande, legible, aparece apoyada al frente */}
    <group position={[0, 0.12, 0.12]} rotation={[-0.5, 0, 0]} scale={phys(tt, 1.6, 6, 0.5)} visible={tt > 1.6}>
      <mesh><planeGeometry args={[0.42, 0.066]} /><meshStandardMaterial map={tapeTex(wr)} roughness={0.9} /></mesh>
    </group>
  </>; }}</Scene3D>;

// ---- 5:28 · LOS QUE NADIE FIRMA: la factura de la calefacción con «PAID», la bolsa del almacén y el sobre de cien; la tarjetita «From:» queda en blanco mientras el lápiz se va ----
export const HUnsigned: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.85}
  cam={{ at: [0, 0.08, 0.02], at1: [0.0, 0.06, 0.06], az: [-0.1, 0.03], el: [0.62, 0.7], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="FROM: NOBODY" col={AMB} size={46} />}>{(tt) => {
  const st = phys(tt, 0.9, 7, 0.45), pen = eio(tt, 2.6, 3.6);
  return <>
    <Table w={1.8} d={1.0} top={0.003} />
    {/* 1. la factura con el sello PAID que cae */}
    <group position={[-0.36, 0.005, -0.06]} rotation={[0, 0.2, 0]} scale={1.3}>
      <Card map={paperTex("xheat", ["IOWA GAS & LIGHT", "Elm Street", "$212.60"], { w: 512, h: 400, font: "700", bg: "#eef0ea" })} w={0.24} h={0.19} />
      <mesh position={[0, 0.004 + 0.2 * (1 - st), 0]} rotation={[-PI / 2, 0, 0.3]} scale={0.6 + 0.4 * st} visible={tt > 0.9}><planeGeometry args={[0.17, 0.06]} /><meshBasicMaterial map={paperTex("xpaid", ["PAID"], { w: 256, h: 96, font: "900", bg: "#eef0ea", ink: "#c0261d" })} transparent opacity={0.9 * cl(st)} /></mesh>
    </group>
    {/* 2. la bolsa del almacén llena */}
    <group position={[-0.02, 0, -0.16]} scale={0.95}>
      <RBox s={[0.2, 0.26, 0.13]} r={0.005} p={[0, 0.13, 0]}><meshStandardMaterial color="#b88d5c" roughness={0.95} /></RBox>
      <mesh position={[-0.04, 0.28, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.025, 0.03, 0.12, 14]} /><meshStandardMaterial color="#e8dcc2" roughness={0.7} /></mesh>
      <mesh position={[0.04, 0.275, 0.01]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#c43a2a" roughness={0.5} /></mesh>
      <mesh position={[0.0, 0.27, -0.03]} rotation={[0.3, 0, -0.4]}><boxGeometry args={[0.12, 0.04, 0.03]} /><meshStandardMaterial color="#d8a85c" roughness={0.6} /></mesh>
    </group>
    {/* 3. el sobre de cien */}
    <group position={[0.34, 0.004, -0.06]} rotation={[0, -0.2, 0]} scale={1.3}>
      <Envelope p={[0, 0, 0]} s={1.1} front={paperTex("xhund", ["for the mission trip"], { w: 512, h: 224 })} />
      <Bill v="100" p={[0.03, 0.006, -0.03]} rot={[-PI / 2, 0, 0.25]} s={0.7} />
    </group>
    {/* la tarjetita de «From:» en blanco al frente y el lápiz que se aleja sin firmar */}
    <Card map={paperTex("xfrom", ["From:", "____________"], { w: 512, h: 256 })} w={0.4} h={0.2} p={[0.0, 0.007, 0.15]} rot={[0, 0.0, 0]} />
    <group position={[0.1 + 0.28 * pen, 0.03 + 0.06 * pen, 0.18 + 0.06 * pen]} rotation={[0.9, 0.2, 0.6 + pen]} scale={1.4}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.17, 6]} /><meshStandardMaterial color="#f0c43a" roughness={0.5} /></mesh>
      <mesh position={[0, -0.09, 0]}><coneGeometry args={[0.006, 0.02, 6]} /><meshStandardMaterial color="#e2c39a" /></mesh>
    </group>
  </>; }}</Scene3D>;
