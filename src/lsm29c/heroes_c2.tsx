// lsm29c · componentes únicos 7-12 (el banco de atrás, los cinco nombres, las spritz de June, el teléfono amarillo, antes de que se ponga el sol, 17 Navidades más).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, Plate, paperTex } from "./tg";
import { Bauble, Pew, Pine, SnowGround, XSky, YellowPhone } from "./xg";

const PI = Math.PI;

// ---- 6:33 · EL BANCO DE ATRÁS: la cámara recorre la nave desde las velas del altar hasta el último banco, donde quedó sólo un abrigo doblado y el himnario; la luz tibia no llega ----
export const HBackpew: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" warm={0.55} bg="#1a1512" key1={[0.4, 2.2, -2.2]}
  cam={{ at: [0.4, 0.5, 0.2], at1: [0.82, 0.49, 1.07], az: [0.15, 0.3], el: [0.45, 0.62], r: [3.2, 0.95], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="SHE SLIPPED OUT · NOBODY NOTICED" col={AMB} size={40} />}>{(tt) => {
  const cold = eio(tt, 2.4, 4.0);
  return <>
    {/* altar con dos velas y la cruz al fondo */}
    <RBox s={[0.9, 0.5, 0.35]} r={0.01} p={[0, 0.25, -2.4]}>{M.wood({ base: [120, 74, 40] })}</RBox>
    <RBox s={[0.03, 0.5, 0.03]} r={0.004} p={[0, 0.85, -2.5]}>{M.brass()}</RBox><RBox s={[0.24, 0.03, 0.03]} r={0.004} p={[0, 0.95, -2.5]}>{M.brass()}</RBox>
    <Candle p={[-0.3, 0.5, -2.3]} tt={tt} on={1} h={0.22} /><Candle p={[0.3, 0.5, -2.3]} tt={tt} on={1} h={0.22} />
    <pointLight position={[0, 0.9, -2.1]} intensity={3.2} distance={3.4} color="#ffc070" />
    {/* hileras de bancos */}
    {[0, 1, 2, 3, 4, 5].map((r) => [-1, 1].map((k) => <Pew key={r + "" + k} p={[k * 0.82, 0, -1.7 + r * 0.55]} w={1.25} />))}
    {/* el último banco: el abrigo azul doblado y el himnario, en luz fría */}
    <group position={[0.82, 0.465, 1.05]}>
      {/* el abrigo de lana doblado en tres, con el cuello de piel */}
      {[0, 1, 2].map((k) => <RBox key={k} s={[0.42 - k * 0.02, 0.035, 0.26 - k * 0.01]} r={0.014} p={[0.08, 0.015 + k * 0.028, 0]} rot={[0, 0.2, 0]}><meshStandardMaterial color="#2c3d5c" roughness={0.95} /></RBox>)}
      <RBox s={[0.12, 0.03, 0.27]} r={0.014} p={[0.24, 0.09, 0.03]} rot={[0, 0.2, 0]}><meshStandardMaterial color="#9a8a76" roughness={1} /></RBox>
      {/* el himnario rojo con la cruz dorada */}
      <group position={[-0.24, 0, 0.03]} rotation={[0, -0.3, 0]}>
        <RBox s={[0.15, 0.035, 0.21]} r={0.006} p={[0, 0.018, 0]}><meshStandardMaterial color="#5a1e1a" roughness={0.6} /></RBox>
        <RBox s={[0.012, 0.002, 0.07]} r={0.001} p={[0, 0.036, -0.01]}>{M.brass()}</RBox><RBox s={[0.045, 0.002, 0.012]} r={0.001} p={[0, 0.036, -0.025]}>{M.brass()}</RBox>
      </group>
    </group>
    <spotLight position={[0.9, 2.0, 1.6]} target-position={[0.82, 0.45, 1.05]} angle={0.35} penumbra={0.8} intensity={0.5 + 5 * cold} distance={4} color="#9fb8e0" />
    {/* el charco de luz tibia que se queda adelante, sin llegar atrás */}
    <mesh position={[0, 0.006, -1.5]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[1.0, 40]} />{M.glow({ col: "#ffb860", op: 0.16 })}</mesh>
    {/* ventanas altas con nieve afuera */}
    {[-1.3, -0.4, 0.5].map((z) => <mesh key={z} position={[-1.6, 1.0, z]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.32, 0.7]} />{M.glow({ col: "#a9bcd8", op: 0.35 })}</mesh>)}
    <mesh position={[0, 1.2, -2.8]}><planeGeometry args={[4, 2.6]} /><meshStandardMaterial color="#e8dcc6" roughness={0.9} /></mesh>
    <mesh position={[-1.65, 1.2, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[6, 2.6]} /><meshStandardMaterial color="#d8ccb6" roughness={0.9} /></mesh>
  </>; }}</Scene3D>;

// ---- 7:08 · CINCO NOMBRES: el directorio de la iglesia abierto; el lápiz rodea un nombre tras otro y el tambor cuenta hasta 5 ----
const DIR = ["Abbott, Ruth", "Baker, Elsie", "Carlson, Vern", "Dahl, Marion", "Engel, Walt", "Fisher, June", "Grant, Lois", "Hale, Arthur", "Ivers, Edna", "Jensen, Hal"];
const CIRC = [1, 3, 5, 6, 8];
const dirTex = (n: number) => tex.text("xdir" + n, 512, 720, (g) => {
  g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 512, 720);
  g.fillStyle = "#6b2a20"; g.font = "900 34px Georgia"; g.textAlign = "center"; g.fillText("FIRST METHODIST · DIRECTORY", 256, 48);
  g.font = "600 38px Georgia"; g.textAlign = "left"; g.fillStyle = "#2b2420";
  DIR.forEach((d, i) => { const y = 112 + i * 62; g.fillText(d, 50, y); g.fillStyle = "rgba(43,36,32,.55)"; g.font = "500 28px Georgia"; g.fillText("555-01" + (10 + i * 7), 340, y); g.font = "600 38px Georgia"; g.fillStyle = "#2b2420"; });
  g.strokeStyle = "#b52a22"; g.lineWidth = 6;
  CIRC.slice(0, n).forEach((i) => { g.beginPath(); g.ellipse(160, 100 + i * 62, 140, 30, -0.03, 0, 6.3); g.stroke(); });
});
export const HFivenames: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.02, 0.06], at1: [0.06, 0.02, 0.07], az: [-0.08, 0.08], el: [1.15, 1.1], r: [0.95, 0.82], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1012} txt="FIVE PEOPLE ALONE AT CHRISTMAS" col={AMB} size={36} />}>{(tt) => {
  const k = cl((tt - 0.5) / 3.4), n = Math.min(5, Math.floor(k * 5.99)), row = CIRC[Math.min(4, n)], fr = (k * 5) % 1;
  return <>
    <RBox s={[1.6, 0.04, 1.0]} r={0.01} p={[0, -0.016, 0]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    {/* el directorio anillado: página izquierda gris de fondo, derecha la lista */}
    <RBox s={[0.64, 0.006, 0.45]} r={0.002} p={[0, 0.007, 0]}><meshStandardMaterial color="#5a1e1a" roughness={0.7} /></RBox>
    <mesh position={[-0.155, 0.0112, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.42]} /><meshStandardMaterial map={paperTex("xdirL", ["Members", "1984"], { w: 512, h: 720 })} roughness={0.85} /></mesh>
    <mesh position={[0.155, 0.0112, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.42]} /><meshStandardMaterial map={dirTex(n)} roughness={0.85} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0, 0.014, -0.195 + i * 0.03]} rotation={[0, PI / 2, PI / 2]}><torusGeometry args={[0.008, 0.0015, 6, 16]} />{M.steel()}</mesh>)}
    {/* el lápiz dibuja el óvalo alrededor del nombre que toca */}
    <group position={[0.08 + 0.07 * Math.cos(fr * PI * 2), 0.03 + (n >= 5 ? 0.08 : 0), -0.2 + row * 0.036 + 0.015 * Math.sin(fr * PI * 2) + (n >= 5 ? 0.15 : 0)]} rotation={[0.9, 0.2, 0.5]}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.17, 6]} /><meshStandardMaterial color="#f0c43a" roughness={0.5} /></mesh>
      <mesh position={[0, -0.09, 0]}><coneGeometry args={[0.006, 0.02, 6]} /><meshStandardMaterial color="#e2c39a" /></mesh>
    </group>
    <group position={[0.42, 0.06, -0.12]}><DigitDrum v={n} r={0.05} w={0.06} /></group>
  </>; }}</Scene3D>;

// ---- 7:44 · LAS SPRITZ DE JUNE: la manga de galletas aprieta y sobre la placa salen arbolitos de Navidad uno por uno, y el azúcar verde les llueve encima ----
const Spritz: React.FC<{ p: number[]; s: number; sug: number }> = ({ p, s, sug }) => <group position={p as [number, number, number]} scale={[s, s, s]}>
  {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.008 + i * 0.012, 0]} castShadow><coneGeometry args={[0.03 - i * 0.008, 0.02, 7]} /><meshStandardMaterial color={new THREE.Color("#e9cf8f").lerp(new THREE.Color("#3f8f4a"), sug)} roughness={0.75} /></mesh>)}
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.005, 0.005, 0.006, 8]} /><meshStandardMaterial color="#c9964f" /></mesh>
</group>;
export const HSpritz: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.07, 0.02], at1: [0.03, 0.06, 0.02], az: [-0.2, 0.05], el: [0.6, 0.55], r: [0.9, 0.78], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="SPRITZ TREES · FOR JUNE" col={AMB} size={44} />}>{(tt) => {
  const N = 12, k = cl((tt - 0.4) / 3.0), made = k * N, idx = Math.min(N - 1, Math.floor(made));
  const pos = (i: number) => [-0.2 + (i % 4) * 0.13, 0.016, -0.1 + Math.floor(i / 4) * 0.12];
  const px = pos(idx), sug = eio(tt, 3.4, 4.6);
  return <>
    <RBox s={[1.6, 0.04, 0.9]} r={0.01} p={[0, -0.016, 0]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    <RBox s={[0.62, 0.012, 0.42]} r={0.004} p={[0, 0.006, 0]}>{M.steel({ col: "#b8bcc0" })}</RBox>
    {Array.from({ length: N }, (_, i) => { const g = cl(made - i); return <group key={i} visible={g > 0.01}><Spritz p={pos(i)} s={phys(g, 0, 7, 0.45) || g} sug={sug} /></group>; })}
    {/* la prensa de galletas que viaja de lugar en lugar */}
    <group position={[k < 1 ? px[0] : 0.4, 0.13 + 0.02 * Math.cos(made * PI * 2) + (k >= 1 ? 0.1 : 0), k < 1 ? px[2] : 0.2]}>
      {/* la manga de tela, apretada arriba, con la boquilla de estrella */}
      <mesh position={[0, 0.06, 0]} scale={[1 - 0.08 * Math.abs(Math.sin(made * PI)), 1, 1]}><coneGeometry args={[0.06, 0.16, 28, 1, true]} /><meshStandardMaterial color="#f1ece0" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.15, 0]}><sphereGeometry args={[0.045, 20, 12]} /><meshStandardMaterial color="#efe6d0" roughness={0.9} /></mesh>
      <mesh position={[0, -0.03, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.014, 0.03, 8]} />{M.steel({ col: "#d8dde2" })}</mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <mesh key={i} position={[0.012 * Math.cos(i * PI / 4), -0.046, 0.012 * Math.sin(i * PI / 4)]}><boxGeometry args={[0.004, 0.006, 0.004]} />{M.steel({ col: "#c8cdd2" })}</mesh>)}
    </group>
    {/* el azúcar verde cayendo como lluvia fina */}
    {Array.from({ length: 160 }, (_, i) => { const ph = (tt * 0.9 + rn(i, 2)) % 1; return <mesh key={i} visible={sug > 0.05 && sug < 0.98} position={[-0.25 + 0.5 * rn(i, 3), 0.25 - 0.22 * ph, -0.15 + 0.3 * rn(i, 4)]}><boxGeometry args={[0.006, 0.006, 0.006]} /><meshStandardMaterial color="#5bc06a" emissive="#2e8a34" emissiveIntensity={0.7} /></mesh>; })}
    <Plate p={[0.42, 0, 0.22]} r={0.1} rim="#3f8f4a" />
  </>; }}</Scene3D>;

// ---- 8:35 · EL TELÉFONO AMARILLO (revelación): la mano duda veinte minutos; el reloj corre, al final levanta el tubo, el cable en espiral se estira y el disco gira ----
const clockTex = () => tex.text("xclock", 256, 256, (g) => { g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill(); g.fillStyle = "#2b2420"; g.font = "700 30px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 1; i <= 12; i++) g.fillText(String(i), 128 + 96 * Math.sin(i * PI / 6), 128 - 96 * Math.cos(i * PI / 6)); });
export const HYellowphone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="wood" warm={0.95}
  cam={{ at: [0.05, 0.98, 0.05], at1: [0.1, 0.92, 0.1], az: [-0.25, -0.1], el: [0.1, 0.05], r: [1.2, 0.95], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="20 MINUTES · THEN I DIALED" col={AMB} size={42} />}>{(tt) => {
  const mins = cl((tt - 0.3) / 2.6), lift = eio(tt, 3.0, 3.9), dial = 1.6 * eio(tt, 4.0, 4.5) * (1 - eio(tt, 4.6, 5.1));
  return <>
    {/* el empapelado de la cocina y el almanaque de diciembre */}
    <mesh position={[0, 1.0, -0.02]}><planeGeometry args={[3, 2.2]} /><meshStandardMaterial map={tex.text("xwallp", 256, 256, (g) => { g.fillStyle = "#e9dfc6"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(160,70,50,.35)"; g.lineWidth = 6; for (let x = 0; x < 256; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); } })} roughness={0.9} /></mesh>
    <YellowPhone p={[0, 1.0, 0]} lift={lift} dial={dial} hand={[0.32, -0.12, 0.25]} />
    <mesh position={[-0.42, 1.05, 0.005]}><planeGeometry args={[0.3, 0.38]} /><meshStandardMaterial map={paperTex("xdec", ["DECEMBER", "1993"], { w: 256, h: 320, font: "900", ink: "#8f1d18" })} roughness={0.85} /></mesh>
    {/* el reloj de pared: 20 minutos que pasan */}
    <group position={[0.48, 1.25, 0.01]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.02, 40]} /><meshStandardMaterial color="#6b2a20" roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.011]}><circleGeometry args={[0.1, 40]} /><meshStandardMaterial map={clockTex()} roughness={0.7} /></mesh>
      <group position={[0, 0, 0.014]} rotation={[0, 0, -PI * 2 * (20 / 60) * mins]}><RBox s={[0.006, 0.085, 0.003]} r={0.002} p={[0, 0.04, 0]}><meshStandardMaterial color="#1b1b1b" /></RBox></group>
      <group position={[0, 0, 0.016]} rotation={[0, 0, -PI * 2 * (8.33 / 12) - PI * 2 * (20 / 720) * mins]}><RBox s={[0.009, 0.055, 0.003]} r={0.002} p={[0, 0.026, 0]}><meshStandardMaterial color="#1b1b1b" /></RBox></group>
    </group>
    {/* el repasador en la manija del horno, abajo */}
    {/* la mano que se acerca, duda y se retira, hasta que agarra el tubo */}
    <group position={[lerp(0.42 - 0.12 * Math.max(0, Math.sin(tt * 2.2)), 0.32, lift), lerp(0.98, 0.88, lift), 0.14 + 0.1 * lift]} rotation={[0, 0, 0.6]}>
      <mesh scale={[1, 0.6, 0.45]}><sphereGeometry args={[0.05, 18, 12]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>
      <mesh position={[0.07, -0.09, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.034, 0.16, 6, 12]} /><meshStandardMaterial color="#e8e2d4" roughness={0.95} /></mesh>
    </group>
    <group position={[0.48, 1.0, 0.04]}><DigitDrum v={Math.floor(mins * 20 / 10)} p={[-0.04, 0, 0]} r={0.045} w={0.05} /><DigitDrum v={Math.floor(mins * 20) % 10} p={[0.04, 0, 0]} r={0.045} w={0.05} /></group>
  </>; }}</Scene3D>;

// ---- 9:04 · ANTES DE QUE SE PONGA EL SOL: el sol baja sobre el campo nevado de Iowa; en primer plano el almanaque con el 20 encerrado se ilumina mientras el sol toca el horizonte ----
export const HSundown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#2a2638" warm={0.8} key1={[0, 1.2, -3]}
  cam={{ at: [0, 0.5, -1.5], at1: [0, 0.42, -1.8], az: [0.12, -0.08], el: [0.08, 0.05], r: [2.2, 1.9], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="CALL BEFORE THE SUN GOES DOWN" col={AMB} size={40} />}>{(tt) => {
  const sun = eio(tt, 0.2, 4.4);
  return <>
    <XSky z={-6} y={1.4} />
    <SnowGround w={14} d={10} />
    {/* el sol enorme bajando */}
    <mesh position={[0.6, lerp(1.3, 0.05, sun), -5.5]}><circleGeometry args={[0.42, 48]} />{M.glow({ col: "#ffb35a", op: 0.95 })}</mesh>
    <mesh position={[0.6, lerp(1.3, 0.05, sun), -5.52]}><circleGeometry args={[0.9, 48]} />{M.glow({ col: "#ff8a4a", op: 0.22 })}</mesh>
    {/* la línea de árboles pelados y el granero */}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-4 + i * 0.38, 0.28 + 0.12 * rn(i, 2), -4.6]}><coneGeometry args={[0.1, 0.6 + 0.3 * rn(i, 3), 5]} /><meshStandardMaterial color="#3a2e2a" roughness={1} /></mesh>)}
    <group position={[-1.4, 0, -3.6]}>
      <RBox s={[0.6, 0.42, 0.45]} r={0.01} p={[0, 0.21, 0]}><meshStandardMaterial color="#8f2a20" roughness={0.8} /></RBox>
      {[-1, 1].map((k) => <RBox key={k} s={[0.66, 0.025, 0.36]} r={0.004} p={[0, 0.49, k * 0.12]} rot={[k * PI / 4, 0, 0]}><meshStandardMaterial color="#e9eef3" roughness={0.9} /></RBox>)}
    </group>
    {/* el almanaque en la ventana con el 20 encerrado */}
    <group position={[-0.16, 0.5, -0.95]} rotation={[0, 0.08, 0]}>
      <RBox s={[0.42, 0.42, 0.02]} r={0.006} p={[0, 0, -0.015]}>{M.wood({ base: [110, 70, 40] })}</RBox>
      <mesh position={[0, 0, -0.03]}><planeGeometry args={[0.6, 0.6]} />{M.glow({ col: "#ffb35a", op: 0.16 * eio(tt, 3.6, 4.4) })}</mesh>
      <pointLight position={[0, 0.1, 0.45]} intensity={0.15 + 0.35 * eio(tt, 3.6, 4.4)} distance={0.9} color="#ffd9a8" />
      <mesh><planeGeometry args={[0.38, 0.38]} /><meshStandardMaterial map={tex.text("xd20", 512, 512, (g) => { g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#8f1d18"; g.fillRect(0, 0, 512, 100); g.fillStyle = "#fff"; g.font = "900 70px Georgia"; g.textAlign = "center"; g.fillText("DECEMBER", 256, 76); g.fillStyle = "#2b2420"; g.font = "900 230px Georgia"; g.fillText("20", 256, 360); g.strokeStyle = "#c0261d"; g.lineWidth = 14; g.beginPath(); g.ellipse(256, 290, 180, 130, 0, 0, 6.3); g.stroke(); })} roughness={0.8} transparent={false} depthWrite emissive="#ffb35a" emissiveIntensity={0.01 + 0.04 * eio(tt, 3.6, 4.4)} /></mesh>
    </group>
  </>; }}</Scene3D>;

// ---- 9:36 · 17 NAVIDADES MÁS: el pino de June recibe un adorno de vidrio por cada Navidad que les quedó, y el tambor cuenta hasta 17 ----
const BCOL = ["#b3261e", "#d4a63e", "#2f6d8a", "#3f8f4a", "#c6c9cc"];
export const HOrnaments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.85}
  cam={{ at: [0.1, 0.6, 0], at1: [0.12, 0.6, 0], az: [-0.1, 0.08], el: [0.12, 0.1], r: [2.15, 1.95], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="17 MORE CHRISTMASES" col={AMB} size={46} />}>{(tt) => {
  const k = cl((tt - 0.3) / 3.6), n = Math.min(17, Math.floor(k * 17.99));
  return <>
    <Pine p={[0, 0, 0]} s={1.25} />
    {Array.from({ length: 17 }, (_, i) => { const lv = i % 4, a = i * 2.4, y = 0.3 + lv * 0.2 + 0.04 * rn(i, 3), r = (0.36 - lv * 0.085) * 1.15 * 0.92, g = cl(k * 17 - i);
      return <group key={i} visible={g > 0.01} position={[Math.sin(a) * r, y + 0.3 * (1 - phys(g, 0, 5, 0.3)), Math.cos(a) * r + 0.02]}><Bauble col={BCOL[i % 5]} r={0.028} /></group>; })}
    {/* la estrella dorada cuando llega la 17 */}
    <mesh position={[0, 1.08, 0]} rotation={[0, 0, PI / 10]} scale={n >= 17 ? 1 : 0.0001} visible={n >= 17}><circleGeometry args={[0.06, 5]} />{M.glow({ col: "#ffd27a" })}</mesh>
    <group position={[0.48, 0.3, 0.3]}><DigitDrum v={Math.floor(n / 10)} p={[-0.045, 0, 0]} r={0.05} w={0.06} /><DigitDrum v={n % 10} p={[0.045, 0, 0]} r={0.05} w={0.06} /></group>
  </>; }}</Scene3D>;
