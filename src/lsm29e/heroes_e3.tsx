// lsm29e · componentes únicos 15-21 (la balanza de las toallas, los repasadores con su consejo, la lata de los ahorros, el panal, la mesa del café primero, la tarjetita del RSVP, los tres sin silla).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, FoldChair, Plate, paperTex } from "./tg";
import { Envelope, Person } from "./xg";
import { Mug, Bill } from "./pg";

const PI = Math.PI;

// ---- 7:38 · LO QUE ELLOS ELIGIERON PESA MÁS: la balanza vieja de la cocina; en un plato las toallas lisas de la lista, en el otro el cuadro dorado de sorpresa; ganan las toallas ----
export const HTowelscale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.75}
  cam={{ at: [0, 0.6, 0], at1: [0, 0.6, 0], az: [-0.22, 0.18], el: [0.12, 0.08], r: [1.8, 1.5], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="WHAT THEY CHOSE WEIGHS MORE" col={AMB} size={40} />}>{(tt) => {
  const towels = phys(tt, 0.4, 7, 0.5), frame = phys(tt, 1.0, 7, 0.5), tilt = 0.28 * (eio(tt, 1.8, 3.4) - 0.5 * eio(tt, 1.0, 1.6));
  const L = 0.42, yl = 0.82 - Math.sin(tilt) * L, yr = 0.82 + Math.sin(tilt) * L;
  return <>
    {/* el pie de la balanza, de bronce */}
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.16, 0.18, 0.04, 40]} />{M.brass()}</mesh>
    <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.018, 0.024, 0.8, 16]} />{M.brass()}</mesh>
    <group position={[0, 0.82, 0]} rotation={[0, 0, tilt]}><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.86, 12]} />{M.brass()}</mesh></group>
    <mesh position={[0, 0.86, 0]} rotation={[0, 0, tilt]}><coneGeometry args={[0.02, 0.08, 12]} />{M.brass()}</mesh>
    {/* los platos colgando */}
    {[[-L, yl], [L, yr]].map(([x, y], i) => <group key={i} position={[x * Math.cos(tilt), y - 0.18, 0]}>
      {[0, 1, 2].map((j) => { const a = j * 2.1; return <mesh key={j} position={[Math.cos(a) * 0.06, 0.09, Math.sin(a) * 0.06]} rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]}><cylinderGeometry args={[0.0015, 0.0015, 0.19, 4]} />{M.brass()}</mesh>; })}
      <mesh><cylinderGeometry args={[0.15, 0.12, 0.02, 40]} />{M.brass()}</mesh>
    </group>)}
    {/* las toallas lisas con su cinta */}
    <group position={[-L * Math.cos(tilt), yl - 0.168, 0]} visible={towels > 0.01} scale={Math.max(0.05, cl(towels))}>
      {[0, 1, 2].map((j) => <RBox key={j} s={[0.2, 0.04, 0.14]} r={0.018} p={[0, 0.022 + j * 0.042, 0]}><meshStandardMaterial color="#f6f4ee" roughness={1} /></RBox>)}
      <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.022, 0.13, 0.145]} /><meshStandardMaterial color="#e8dcc0" roughness={0.4} /></mesh>
    </group>
    {/* el cuadro dorado de sorpresa */}
    <group position={[L * Math.cos(tilt), yr - 0.17, 0]} visible={frame > 0.01} scale={Math.max(0.05, cl(frame))}>
      <RBox s={[0.2, 0.22, 0.03]} r={0.008} p={[0, 0.11, 0]} rot={[-0.2, 0, 0]}>{M.brass({ col: "#e0b04a" })}</RBox>
      <mesh position={[0, 0.11, 0.017]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.15, 0.17]} /><meshStandardMaterial color="#6a7a5a" roughness={0.6} /></mesh>
    </group>
    <pointLight position={[0, 1.5, 0.7]} intensity={1.5} distance={3} color="#ffe6c4" />
  </>; }}</Scene3D>;

// ---- 7:58 · LOS REPASADORES DE LA ABUELA: la pila de repasadores lisos; el de arriba se despliega y adentro está la tarjeta con los dos consejos, que se escriben solos ----
export const HDishtowels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#2a2420" warm={0.55}
  cam={{ at: [0, 0.04, 0], at1: [0.05, 0.05, 0], az: [-0.12, 0.12], el: [0.95, 0.85], r: [0.72, 0.58], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="50 YEARS OF GOOD ADVICE" col={AMB} size={40} />}>{(tt) => {
  const op = eio(tt, 0.5, 1.6), ink = eio(tt, 1.8, 4.2);
  const lineTex = paperTex("etowel" + Math.round(ink * 6), ["Never go to bed angry.", ink > 0.5 ? "Never go to the grocery" : "", ink > 0.75 ? "store hungry." : ""], { w: 640, h: 380, font: "italic 700", bg: "#fbf7ec", ink: "#1f2c56" });
  return <>
    {[0, 1, 2].map((j) => <RBox key={j} s={[0.34, 0.016, 0.22]} r={0.008} p={[0.02 * (j - 1), 0.008 + j * 0.017, 0.01 * j]}><meshStandardMaterial map={tex.text("estripe", 256, 256, (g) => { g.fillStyle = "#f6f3ec"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#c8d4e4"; g.fillRect(0, 28, 256, 10); g.fillRect(0, 218, 256, 10); })} roughness={1} /></RBox>)}
    {/* la tarjeta que aparece */}
    <Card map={lineTex} w={0.3} h={0.178} p={[0.02, 0.068, 0.02]} rot={[0, 0.04, 0]} />
    {/* el repasador de arriba que se abre como un libro hacia la izquierda */}
    <group position={[-0.17, 0.064, 0]} rotation={[0, 0, PI * 0.96 * op]}>
      <mesh position={[0.17, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.34, 0.22]} /><meshStandardMaterial map={tex.text("estripe", 256, 256, () => {})} roughness={1} side={THREE.DoubleSide} /></mesh>
    </group>
    <pointLight position={[0, 0.5, 0.3]} intensity={0.45} distance={1.6} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 8:45 · CUATRO AÑOS AHORRANDO: la lata de café en el estante; caen los billetes y las monedas mes a mes y el almanaque pasa de 1994 a 1998 ----
export const HSavingscan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" warm={0.75}
  cam={{ at: [0, 0.98, 0], at1: [0.05, 0.98, 0], az: [-0.25, 0.15], el: [0.2, 0.16], r: [1.1, 0.9], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="4 YEARS ON A SECRETARY'S SALARY" col={AMB} size={38} />}>{(tt) => {
  const k = eio(tt, 0.4, 4.6), yr = 1994 + Math.min(4, Math.floor(k * 4.999));
  return <>
    <RBox s={[1.2, 0.04, 0.3]} r={0.008} p={[0, 0.8, 0]}>{M.wood({ base: [130, 86, 48] })}</RBox>
    {/* la lata de café, abierta */}
    <group position={[-0.1, 0.82, 0]}>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.08, 0.08, 0.2, 40, 1, true]} /><meshStandardMaterial map={tex.text("ecan", 512, 256, (g) => { g.fillStyle = "#b4332a"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#f2e2b8"; g.fillRect(0, 90, 512, 70); g.fillStyle = "#4a2a1a"; g.font = "900 50px Georgia"; g.textAlign = "center"; g.fillText("COFFEE", 256, 142); })} metalness={0.5} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.08, 40]} />{M.steel()}</mesh>
      {/* lo ahorrado sube adentro */}
      <mesh position={[0, 0.01 + 0.09 * k, 0]}><cylinderGeometry args={[0.077, 0.077, Math.max(0.01, 0.18 * k), 32]} /><meshStandardMaterial color="#7a9a6a" roughness={0.8} /></mesh>
      {/* billetes y monedas cayendo */}
      {Array.from({ length: 10 }, (_, i) => { const ph = ((tt * 0.9 + i * 0.1) % 1), on = k < 0.98;
        return <group key={i} visible={on} position={[0.03 * (rn(i, 1) - 0.5), 0.5 - ph * 0.42, 0.03 * (rn(i, 2) - 0.5)]} rotation={[ph * 4 + i, ph * 3, 0]}>
          {i % 2 ? <Bill v="20" s={0.5} rot={[0, 0, 0]} /> : <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.002, 18]} />{M.chrome({ col: "#c9ced3" })}</mesh>}
        </group>; })}
    </group>
    {/* el almanaque de escritorio */}
    <group position={[0.32, 0.82, 0.02]} rotation={[0, -0.3, 0]}>
      <RBox s={[0.22, 0.2, 0.02]} r={0.006} p={[0, 0.1, 0]} rot={[-0.2, 0, 0]}><meshStandardMaterial color="#f4efe2" roughness={0.85} /></RBox>
      <mesh position={[0, 0.11, 0.012]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.2, 0.17]} /><meshStandardMaterial map={tex.text("ecal" + yr, 256, 220, (g) => { g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 256, 220); g.fillStyle = RED; g.fillRect(0, 0, 256, 44); g.fillStyle = "#2a2420"; g.font = "900 100px Georgia"; g.textAlign = "center"; g.fillText(String(yr), 128, 160); })} roughness={0.85} /></mesh>
    </group>
    <pointLight position={[0, 1.4, 0.5]} intensity={1.4} distance={2.2} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 8:59 · DULCE AL ALMA: el panal de cera; las celdas se llenan de miel de a una, del centro hacia afuera, y la cuchara de madera gotea arriba ----
const hexes: [number, number, number][] = [];
for (let q = -3; q <= 3; q++) for (let r = -3; r <= 3; r++) { const s = -q - r; if (Math.abs(s) <= 3) hexes.push([0.06 * (q + r / 2), 0.052 * r, Math.max(Math.abs(q), Math.abs(r), Math.abs(s))]); }
export const HHoneycomb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#2a1e12" warm={0.9}
  cam={{ at: [0, 0.03, 0], at1: [0, 0.03, 0], az: [-0.3, 0.2], el: [0.7, 0.55], r: [0.7, 0.55], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="SWEET TO THE SOUL" col={AMB} size={42} />}>{(tt) => {
  const fill = eio(tt, 0.4, 4.4) * 3.2;
  return <>
    {hexes.map(([x, z, ring], i) => { const k = cl(fill - ring - rn(i, 1) * 0.3);
      return <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.02, 0]} rotation={[0, PI / 6, 0]}><cylinderGeometry args={[0.032, 0.032, 0.04, 6, 1, true]} /><meshStandardMaterial color="#d8a840" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.002 + 0.034 * k, 0]} rotation={[-PI / 2, 0, PI / 6]}><circleGeometry args={[0.03, 6]} /><meshPhysicalMaterial color={k > 0.95 ? "#e8b84a" : "#c88a1a"} roughness={0.15} clearcoat={1} transmission={0.2} /></mesh>
      </group>; })}
    {/* la cuchara de madera que gotea */}
    <group position={[0.1, 0.2, -0.05]} rotation={[0, 0, 0.5]}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.25, 10]} />{M.wood({ base: [170, 120, 70] })}</mesh>
      {[0, 1, 2].map((j) => <mesh key={j} position={[0, -0.13 - j * 0.014, 0]}><torusGeometry args={[0.016, 0.005, 8, 20]} />{M.wood({ base: [170, 120, 70] })}</mesh>)}
    </group>
    {(() => { const ph = (tt * 0.6) % 1; return <mesh position={[0.035, 0.08 - 0.07 * ph * ph, -0.05]} scale={[1, 1 + ph, 1]}><sphereGeometry args={[0.007, 12, 10]} /><meshPhysicalMaterial color="#e0a030" roughness={0.1} clearcoat={1} /></mesh>; })()}
    <pointLight position={[0.1, 0.4, 0.2]} intensity={1.6} distance={1.4} color="#ffd890" />
  </>; }}</Scene3D>;

// ---- 9:16 · LA MEJOR MESA DEL SALÓN: el salón visto de arriba; la puerta de la cocina se abre y la primera taza de café sale derecho a la mesa de al lado de la puerta ----
export const HCoffeefirst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#2a2420" warm={0.8}
  cam={{ at: [0.3, 0, 0.1], at1: [0.5, 0, 0.15], az: [-0.2, 0.05], el: [1.05, 0.95], r: [2.4, 1.6], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="THE BEST TABLE IN THE ROOM" col={AMB} size={40} />}>{(tt) => {
  const door = eio(tt, 0.6, 1.2) * (1 - eio(tt, 3.6, 4.2)), go = eio(tt, 1.2, 2.6), glow = eio(tt, 2.6, 3.4);
  const T = [[-0.6, -0.4], [0.0, -0.4], [-0.6, 0.35], [0.0, 0.35], [0.62, 0.35]];
  return <>
    {/* la pared de la cocina con su puerta vaivén */}
    <mesh position={[0.95, 0.4, 0]} rotation={[0, -PI / 2, 0]}><planeGeometry args={[2.2, 0.8]} /><meshStandardMaterial color="#d9d2c2" roughness={0.9} /></mesh>
    <group position={[0.94, 0, 0.55]} rotation={[0, -PI / 2 + 1.2 * door, 0]}><RBox s={[0.36, 0.7, 0.03]} r={0.01} p={[0.18, 0.35, 0]}>{M.wood({ base: [150, 104, 60] })}</RBox></group>
    {/* las mesas redondas con sus sillas */}
    {T.map(([x, z], i) => <group key={i} position={[x, 0, z]}>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.24, 0.24, 0.02, 40]} /><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />{M.steel()}</mesh>
      {Array.from({ length: 6 }, (_, j) => { const a = j / 6 * PI * 2; return <RBox key={j} s={[0.12, 0.02, 0.12]} r={0.004} p={[Math.cos(a) * 0.32, 0.24, Math.sin(a) * 0.32]}><meshStandardMaterial color="#9c8c72" roughness={0.8} /></RBox>; })}
      <mesh position={[0, 0.375, 0]}><cylinderGeometry args={[0.03, 0.035, 0.04, 16]} /><meshStandardMaterial color="#e8f0ff" transparent opacity={0.5} /></mesh>
    </group>)}
    {/* la luz tibia sobre la mesa de la puerta */}
    <mesh position={[0.62, 0.381, 0.35]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.25, 0.3, 48]} /><meshBasicMaterial color={AMB} transparent opacity={0.7 * glow} depthWrite={false} toneMapped={false} /></mesh>
    {/* la taza que viaja desde la cocina */}
    <group position={[lerp(1.05, 0.7, go), 0.38 + 0.12 * Math.sin(PI * go), lerp(0.55, 0.3, go)]} visible={go > 0.01} scale={2.2}><Mug col="#f2efe8" /></group>
    {Array.from({ length: 16 }, (_, j) => { const u = j / 15; return <mesh key={j} position={[lerp(1.05, 0.7, u), 0.42 + 0.12 * Math.sin(PI * u), lerp(0.55, 0.3, u)]} visible={go > u + 0.01}><sphereGeometry args={[0.018, 8, 6]} /><meshBasicMaterial color="#fff2dc" transparent opacity={0.55 * (1 - 0.5 * u)} depthWrite={false} toneMapped={false} /></mesh>; })}
    <pointLight position={[0.62, 1.2, 0.35]} intensity={0.4 + 2.2 * glow} distance={2.2} color="#ffd8a0" />
  </>; }}</Scene3D>;

// ---- 10:37 · LA TARJETITA DEL RSVP: el sobre con la estampilla ya puesta se abre, sube la tarjetita y la lapicera marca «sí» y «2»; vuelve al sobre ----
const rsvpTex = (yes: boolean, two: boolean) => tex.text("ersvp" + (yes ? 1 : 0) + (two ? 1 : 0), 640, 400, (g) => {
  g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 640, 400);
  g.strokeStyle = "#c8b080"; g.lineWidth = 4; g.strokeRect(16, 16, 608, 368);
  g.fillStyle = "#3a2e22"; g.textAlign = "left"; g.font = "italic 700 46px Georgia"; g.fillText("Will you attend?", 60, 110);
  g.font = "700 40px Georgia"; g.fillText("Yes  ___      No  ___", 60, 200); g.fillText("How many?  ____", 60, 290);
  g.strokeStyle = "#1f2c56"; g.lineWidth = 7; g.lineCap = "round";
  if (yes) { g.beginPath(); g.moveTo(150, 190); g.lineTo(165, 205); g.lineTo(195, 165); g.stroke(); }
  if (two) { g.fillStyle = "#1f2c56"; g.font = "italic 900 64px Georgia"; g.fillText("2", 300, 292); }
});
export const HRsvpcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#2a2420" warm={0.85}
  cam={{ at: [0, 0.06, 0], at1: [0.02, 0.06, 0], az: [-0.2, 0.1], el: [0.62, 0.55], r: [0.7, 0.58], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.5} x={960} y={1010} txt="ARE YOU COMING? HOW MANY?" col={AMB} size={40} />}>{(tt) => {
  const flap = eio(tt, 0.4, 1.0) * (1 - eio(tt, 4.4, 5.0)), up = eio(tt, 1.0, 1.8) * (1 - eio(tt, 3.9, 4.6)), yes = tt > 2.3, two = tt > 3.1, pen = eio(tt, 2.0, 2.4) * (1 - eio(tt, 3.4, 3.8));
  const front = tex.text("eenvf", 512, 220, (g) => { g.fillStyle = "#f6f3ea"; g.fillRect(0, 0, 512, 220); g.fillStyle = "#b4332a"; g.fillRect(420, 20, 70, 84); g.strokeStyle = "#fff"; g.lineWidth = 3; g.strokeRect(426, 26, 58, 72); g.fillStyle = "#3a2e22"; g.font = "italic 700 34px Georgia"; g.fillText("Mr. & Mrs. Olson", 60, 150); });
  return <>
    <Envelope p={[0, 0.003, 0.05]} rot={[-PI / 2, 0, 0]} front={front} flap={flap} s={1.5} />
    <group position={[0, 0.006 + 0.01 * up, 0.05 - 0.17 * up]} rotation={[0.55 * up, 0, 0]}>
      <Card map={rsvpTex(yes, two)} w={0.36} h={0.225} />
    </group>
    {/* la lapicera */}
    <group position={[lerp(0.3, two ? 0.04 : -0.06, pen), 0.08 + 0.04 * (1 - pen), lerp(0.1, -0.12, pen)]} rotation={[0.9, 0.6, 0.3]} visible={pen > 0.01}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.15, 12]} /><meshStandardMaterial color="#1a1a22" metalness={0.4} roughness={0.3} /></mesh>
      <mesh position={[0, -0.085, 0]}><coneGeometry args={[0.006, 0.02, 12]} />{M.brass()}</mesh>
    </group>
    <pointLight position={[0, 0.5, 0.3]} intensity={1.2} distance={1.6} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 10:56 · TRES SIN SILLA: la mesa redonda de ocho, todas las sillas con su plato; llegan tres con el plato en la mano y en el piso quedan los tres huecos marcados ----
export const HNochair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0.5, 0.45, 0.35], at1: [0.6, 0.45, 0.4], az: [0.35, 0.5], el: [0.48, 0.4], r: [3.1, 2.7], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THREE PEOPLE · NO CHAIR" col={AMB} size={42} />}>{(tt) => {
  const walk = eio(tt, 0.6, 2.8), mark = eio(tt, 2.8, 3.6);
  return <>
    <mesh position={[0, 0.74, 0]}><cylinderGeometry args={[0.55, 0.55, 0.025, 48]} /><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></mesh>
    <mesh position={[0, 0.37, 0]}><cylinderGeometry args={[0.04, 0.06, 0.74, 12]} />{M.steel()}</mesh>
    {Array.from({ length: 8 }, (_, j) => { const a = j / 8 * PI * 2 + 0.2; return <group key={j}>
      <FoldChair p={[Math.cos(a) * 0.72, 0, Math.sin(a) * 0.72]} ry={-a - PI / 2} />
      <Plate p={[Math.cos(a) * 0.4, 0.755, Math.sin(a) * 0.4]} r={0.09} />
    </group>; })}
    {/* los tres que llegan con su plato */}
    {[0, 1, 2].map((i) => { const tx = 0.9 + i * 0.32, tz = 0.75 - i * 0.12;
      return <group key={i}>
        <Person p={[lerp(2.4, tx, walk), 0, lerp(1.6, tz, walk)]} s={[1, 1.05, 0.7][i]} ry={-2.3} coat={["#3a5a7a", "#6a3a3a", "#4a5a3a"][i]} hair={["#3a2a22", "#2a1a12", "#6a5a4a"][i]} hold={1} />
        <mesh position={[tx - 0.3, 0.006, tz - 0.18]} rotation={[-PI / 2, 0, 0]} visible={mark > 0.01}><ringGeometry args={[0.12, 0.15, 40]} /><meshBasicMaterial color={AMB} toneMapped={false} transparent opacity={0.8 * mark} depthWrite={false} /></mesh>
      </group>; })}
    <pointLight position={[0.3, 1.8, 0.6]} intensity={1.6} distance={3.4} color="#fff0dc" />
  </>; }}</Scene3D>;
