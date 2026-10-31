// lsm29e · componentes únicos 29-36 (los 364 días, la última pareja en la pista, el círculo de los primos, la última foto, el billete de veinte con su nota, el pañuelo en el ramo, el granero, la promesa).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, paperTex } from "./tg";
import { Person } from "./xg";
import { Bill } from "./pg";

const PI = Math.PI;

// ---- 15:18 · 364 DÍAS PARA ELLA: la grilla del año entero; los cuadraditos se tachan de a semanas y queda UNO solo encendido, el de la boda ----
export const HDays364: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#2a2420" warm={0.45}
  cam={{ at: [0.02, 0.02, 0], at1: [0.2, 0.03, 0.02], az: [-0.12, 0.08], el: [1.0, 0.86], r: [1.35, 1.0], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="364 DAYS FOR YOU · ONE FOR THEM" col={AMB} size={38} />}>{(tt) => {
  const n = Math.min(364, Math.floor(eio(tt, 0.4, 3.4) * 364 / 7) * 7), glow = eio(tt, 3.4, 4.0);
  const grid = tex.text("edays" + n, 1040, 600, (g) => {
    g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 1040, 600);
    for (let i = 0; i < 364; i++) { const c = i % 28, r = Math.floor(i / 28), x = 18 + c * 36, y = 16 + r * 44;
      g.strokeStyle = "#8a7a62"; g.lineWidth = 2; g.strokeRect(x, y, 32, 38);
      if (i < n) { g.fillStyle = "#e2d6c0"; g.fillRect(x, y, 32, 38); g.strokeStyle = "#5a3a26"; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 6, y + 6); g.lineTo(x + 26, y + 32); g.moveTo(x + 26, y + 6); g.lineTo(x + 6, y + 32); g.stroke(); }
    }
  });
  return <>
    <RBox s={[0.84, 0.01, 0.5]} r={0.004} p={[-0.08, 0.005, 0]}><meshStandardMaterial map={grid} roughness={0.85} /></RBox>
    {/* la luz baja sobre los 364 */}
    <mesh position={[-0.08, 0.0115, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.86, 0.52]} /><meshBasicMaterial color="#0a0806" transparent opacity={0.62 * glow} depthWrite={false} /></mesh>
    {/* EL día: la tarjeta dorada aparte, que se levanta encendida */}
    <group position={[0.46, 0.012 + 0.05 * glow, 0]} rotation={[-PI / 2 + 0.5 * glow, 0, 0]}>
      <RBox s={[0.19, 0.22, 0.008]} r={0.005}><meshStandardMaterial color="#e8a820" emissive="#d08a10" emissiveIntensity={0.1 + 0.35 * glow} roughness={0.4} /></RBox>
      <mesh position={[0, 0, 0.0045]}><planeGeometry args={[0.175, 0.205]} /><meshBasicMaterial map={tex.text("eoneday", 240, 280, (g) => { g.clearRect(0, 0, 240, 280); g.fillStyle = "#3a2410"; g.textAlign = "center"; g.font = "900 120px Georgia"; g.fillText("1", 120, 150); g.font = "italic 700 34px Georgia"; g.fillText("their day", 120, 230); })} transparent depthWrite={false} /></mesh>
    </group>
    <pointLight position={[0.44, 0.35, 0.25]} intensity={0.3 + 1.0 * glow} distance={0.9} color="#ffd890" />
    <pointLight position={[0, 1.2, 0.4]} intensity={0.3} distance={2.2} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 16:53 · LA ÚLTIMA PAREJA: la pista bajo las guirnaldas; las parejas se van yendo de a una hasta que queda bailando sólo la pareja de pelo blanco ----
const Bulbs: React.FC<{ tt: number }> = ({ tt }) => <>{Array.from({ length: 22 }, (_, i) => { const x = -1.3 + i * 0.124, y = 1.55 - 0.12 * Math.sin(PI * (i / 21));
  return <mesh key={i} position={[x, y, -0.6]}><sphereGeometry args={[0.018, 10, 8]} /><meshBasicMaterial color="#ffe6a0" toneMapped={false} transparent opacity={0.85 + 0.1 * Math.sin(tt * 1.2 + i)} /></mesh>; })}</>;
export const HLastcouple: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" warm={0.7}
  cam={{ at: [0, 0.6, 0], at1: [0, 0.55, 0], az: [-0.2, 0.15], el: [0.32, 0.26], r: [2.8, 2.0], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THE LAST COUPLE ON THE FLOOR" col={AMB} size={40} />}>{(tt) => {
  const C = [[-0.9, -0.3, "#3a5a7a", "#6a3a3a"], [0.9, -0.2, "#4a5a3a", "#8a6a9a"], [-0.6, 0.5, "#5a4a6a", "#c86a5a"], [0.7, 0.55, "#7a6a3a", "#4a7a8a"]] as const;
  return <>
    <Bulbs tt={tt} />
    {C.map(([x, z, a, b], i) => { const out = eio(tt, 0.6 + i * 0.6, 1.4 + i * 0.6), sw = Math.sin(tt * 1.4 + i) * 0.1;
      return <group key={i} position={[x * (1 + 1.6 * out), 0, z - 1.2 * out]} rotation={[0, sw, 0]} visible={out < 0.99}>
        <Person p={[-0.09, 0, 0]} s={0.95} ry={PI / 2} coat={a} hair="#3a2a1a" /><Person p={[0.09, 0, 0]} s={0.88} ry={-PI / 2} coat={b} hair="#6a4a2a" />
      </group>; })}
    {/* la pareja de pelo blanco, en el centro, bailando lento */}
    <group position={[0, 0, 0.05]} rotation={[0, tt * 0.35, 0]}>
      <Person p={[-0.08, 0, 0]} s={0.92} ry={PI / 2} coat="#2a2a30" hair="#e8e4dc" /><Person p={[0.08, 0, 0]} s={0.85} ry={-PI / 2} coat="#8a6a8a" hair="#f0ece4" />
    </group>
    <mesh position={[0, 0.004, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.45, 48]} /><meshBasicMaterial color="#fff2cc" transparent opacity={0.15 + 0.25 * eio(tt, 2.8, 3.6)} depthWrite={false} toneMapped={false} /></mesh>
    <pointLight position={[0, 1.8, 0.4]} intensity={1.0 + 1.0 * eio(tt, 2.8, 3.6)} distance={3} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 17:57 · EL CÍRCULO: los dos abuelos bailando en el centro; los primos llegan de todos lados y se toman de las manos alrededor, el anillo de gente se cierra y palmea ----
export const HCircle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" warm={0.75}
  cam={{ at: [0, 0.3, 0], at1: [0, 0.3, 0], az: [-0.3, 0.3], el: [0.75, 0.62], r: [2.6, 2.2], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="EVERYBODY AROUND THEM" col={AMB} size={42} />}>{(tt) => {
  const N = 12, close = eio(tt, 0.4, 2.6), clap = tt > 2.8 ? Math.abs(Math.sin(tt * 5)) * 0.03 : 0;
  return <>
    <group rotation={[0, tt * 0.3, 0]}>
      <Person p={[-0.08, 0, 0]} s={0.92} ry={PI / 2} coat="#2a2a30" hair="#e8e4dc" /><Person p={[0.08, 0, 0]} s={0.85} ry={-PI / 2} coat="#8a6a8a" hair="#f0ece4" />
    </group>
    {Array.from({ length: N }, (_, i) => { const a = i / N * PI * 2, r = lerp(1.6 + rn(i, 1) * 0.6, 0.7, close);
      return <group key={i} position={[Math.cos(a) * r, clap, Math.sin(a) * r]}><Person s={0.78 + 0.12 * rn(i, 2)} ry={-a - PI / 2} coat={["#3a5a7a", "#6a3a3a", "#4a5a3a", "#5a4a6a", "#7a6a3a", "#4a7a8a"][i % 6]} hair={["#3a2a22", "#2a1a12", "#6a5a4a", "#c8a87a"][i % 4]} /></group>; })}
    {/* las manos tomadas: el anillo dorado que se dibuja cuando se cierra */}
    <mesh position={[0, 0.55, 0]} rotation={[-PI / 2, 0, 0]}><torusGeometry args={[0.7, 0.006, 8, 96, PI * 2 * Math.max(0.02, eio(tt, 2.0, 2.8))]} /><meshBasicMaterial color={AMB} toneMapped={false} transparent opacity={0.85} /></mesh>
    <pointLight position={[0, 1.8, 0]} intensity={2.0} distance={3.2} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 18:27 · LA ÚLTIMA FOTO: el portarretratos en el estante; la foto aparece de a poco como revelándose y queda la pareja chica, lejos, delante de la iglesia ----
export const HLastpicture: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" warm={0.8}
  cam={{ at: [0, 0.98, 0], at1: [0, 0.98, 0], az: [-0.22, 0.08], el: [0.1, 0.06], r: [0.85, 0.55], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="THE LAST PICTURE OF THEM" col={AMB} size={42} />}>{(tt) => {
  const dev = eio(tt, 0.6, 3.6);
  const photo = tex.text("elastpic" + Math.round(dev * 8), 480, 360, (g) => {
    const v = dev; g.fillStyle = "#f2eee6"; g.fillRect(0, 0, 480, 360); g.globalAlpha = v;
    const sky = g.createLinearGradient(0, 0, 0, 300); sky.addColorStop(0, "#8fa6b8"); sky.addColorStop(1, "#d8d2c2"); g.fillStyle = sky; g.fillRect(0, 0, 480, 300);
    g.fillStyle = "#6a7a4a"; g.fillRect(0, 290, 480, 70);
    g.fillStyle = "#ece4d2"; g.beginPath(); g.moveTo(130, 200); g.lineTo(240, 90); g.lineTo(350, 200); g.fill(); g.fillRect(145, 200, 190, 100); g.fillRect(230, 30, 20, 70);
    g.fillStyle = "#b8ac94"; g.fillRect(290, 200, 45, 100); g.fillStyle = "#4a3426"; g.beginPath(); g.moveTo(215, 300); g.lineTo(215, 238); g.arc(240, 238, 25, PI, 0); g.lineTo(265, 300); g.fill();
    // la pareja, grande, delante de la puerta
    g.fillStyle = "#24242a"; g.beginPath(); g.moveTo(178, 345); g.lineTo(222, 345); g.lineTo(216, 262); g.lineTo(184, 262); g.fill();
    g.fillStyle = "#8a6a90"; g.beginPath(); g.moveTo(232, 345); g.lineTo(288, 345); g.lineTo(272, 270); g.lineTo(246, 270); g.fill();
    g.fillStyle = "#e2c4a4"; g.beginPath(); g.arc(200, 246, 15, 0, 7); g.fill(); g.beginPath(); g.arc(259, 254, 14, 0, 7); g.fill();
    g.fillStyle = "#fbfaf6"; g.beginPath(); g.arc(200, 240, 15, PI, 0); g.fill(); g.beginPath(); g.arc(259, 250, 15, PI * 0.95, PI * 0.05); g.fill();
    g.strokeStyle = "#e2c4a4"; g.lineWidth = 6; g.beginPath(); g.moveTo(216, 290); g.lineTo(246, 292); g.stroke();
    g.globalAlpha = 1; g.fillStyle = `rgba(150,110,60,${0.12 * v})`; g.fillRect(0, 0, 480, 360);
  });
  return <>
    <RBox s={[1.0, 0.03, 0.26]} r={0.008} p={[0, 0.82, 0]}>{M.wood({ base: [120, 80, 46] })}</RBox>
    <group position={[0, 0.98, 0]} rotation={[-0.08, 0, 0]}>
      <RBox s={[0.3, 0.24, 0.025]} r={0.006} p={[0, 0, 0]}>{M.brass({ col: "#c8a050" })}</RBox>
      <mesh position={[0, 0, 0.014]}><planeGeometry args={[0.24, 0.18]} /><meshBasicMaterial map={photo} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.016]}><planeGeometry args={[0.24, 0.18]} />{M.glass({ op: 0.05 })}</mesh>
    </group>
    {/* el florerito y una vela al lado */}
    <mesh position={[0.28, 0.88, 0]}><cylinderGeometry args={[0.03, 0.035, 0.1, 20]} />{M.glass()}</mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[0.28 + 0.02 * (i - 1), 0.97 + 0.02 * i, 0]}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#fbf8f2" roughness={0.8} /></mesh>)}
    <pointLight position={[0.3, 1.3, 0.4]} intensity={1.4} distance={1.8} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 19:02 · VEINTE DÓLARES Y UN VERSÍCULO: la tarjetita escrita a mano se abre; adentro el billete de veinte y la nota, que valen más que la ponchera ----
export const HGift20: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#2a2420" warm={0.85}
  cam={{ at: [0, 0.03, 0], at1: [0.02, 0.03, 0], az: [-0.18, 0.12], el: [0.85, 0.7], r: [0.7, 0.56], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="A TWENTY · AND A NOTE" col={AMB} size={42} />}>{(tt) => {
  const op = eio(tt, 0.4, 1.4), bill = phys(tt, 1.4, 7, 0.5), ink = eio(tt, 2.0, 4.2);
  const note = paperTex("enote" + Math.round(ink * 5), ["Dear kids,", ink > 0.3 ? "1 Corinthians 13:7" : "", ink > 0.6 ? "Love bears all things." : "", ink > 0.9 ? "Love, Grandma" : ""], { w: 560, h: 420, font: "italic 700", bg: "#fbf8f0", ink: "#1f2c56" });
  const cover = tex.text("ecover", 280, 420, (g) => { g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 280, 420); g.strokeStyle = "#c8a050"; g.lineWidth = 6; g.strokeRect(16, 16, 248, 388); g.fillStyle = "#c8a050"; g.font = "italic 700 40px Georgia"; g.textAlign = "center"; g.fillText("With Love", 140, 220); });
  return <>
    {/* la mitad derecha de la tarjeta, con la nota */}
    <Card map={note} w={0.2} h={0.15} p={[0.1, 0.002, 0]} />
    {/* la tapa que se abre hacia la izquierda */}
    <group position={[0, 0.003, 0]} rotation={[0, 0, PI * 0.97 * op]}>
      <mesh position={[0.05, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.15]} /><meshStandardMaterial map={cover} roughness={0.85} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* el billete de veinte que se asoma */}
    <group visible={bill > 0.01} position={[0.1, 0.01 + 0.01 * cl(bill), -0.06 + 0.03 * cl(bill)]}><Bill v="20" tint="#8fbf74" s={Math.max(0.05, cl(bill)) * 1.3} rot={[-PI / 2, 0, 0.18]} /></group>
    <pointLight position={[0.05, 0.4, 0.2]} intensity={0.7} distance={1.4} color="#ffc890" />
  </>; }}</Scene3D>;

// ---- 19:47 · EL PAÑUELO DE LA ABUELA: el pañuelo de encaje viejo se despliega y envuelve el tallo del ramo blanco; un moño lo ata ----
const laceTex = () => tex.text("elace", 512, 512, (g) => {
  g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#a88a5a"; g.lineWidth = 6;
  for (let i = 0; i < 16; i++) { g.beginPath(); g.arc(32 + i * 32, 16, 14, 0, PI); g.stroke(); g.beginPath(); g.arc(32 + i * 32, 496, 14, PI, 2 * PI); g.stroke(); }
  for (let r = 40; r < 220; r += 30) { g.beginPath(); g.arc(256, 256, r, 0, 2 * PI); g.stroke(); }
  g.fillStyle = "#c8b48a"; g.font = "italic 700 60px Georgia"; g.textAlign = "center"; g.fillText("M", 256, 276);
});
export const HHandkerchief: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#2a2420" warm={0.85}
  cam={{ at: [0, 0.08, 0], at1: [0, 0.1, 0], az: [-0.3, 0.15], el: [0.45, 0.38], r: [0.75, 0.6], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="SOMETHING OLD" col={AMB} size={44} />}>{(tt) => {
  const unf = eio(tt, 0.3, 1.4), wrap = eio(tt, 1.6, 3.2), bow = phys(tt, 3.3, 7, 0.5);
  return <>
    {/* el ramo de rosas blancas, apoyado de costado */}
    <group position={[0, 0.06, 0]} rotation={[0, 0, PI / 2 - 0.15]}>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.03 * Math.cos(i * 2.4) * (i ? 1 : 0), 0.14 + 0.01 * rn(i, 1), 0.03 * Math.sin(i * 2.4) * (i ? 1 : 0)]}><sphereGeometry args={[0.032, 14, 10]} /><meshPhysicalMaterial color="#fbf8f2" roughness={0.6} sheen={1} /></mesh>)}
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.022, 0.018, 0.18, 14]} /><meshStandardMaterial color="#5a7a3a" roughness={0.7} /></mesh>
      {/* el pañuelo envolviendo el tallo */}
      <mesh position={[0, 0.03, 0]} visible={wrap > 0.01}><cylinderGeometry args={[0.03, 0.026, 0.12 * Math.max(0.05, wrap), 24, 1, true, 0, PI * 2 * Math.max(0.05, wrap)]} /><meshStandardMaterial map={laceTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <group position={[0.034, 0.03, 0]} visible={bow > 0.01} scale={Math.max(0.05, cl(bow))}>
        {[-1, 1].map((k) => <mesh key={k} position={[0, k * 0.018, 0]} rotation={[0, 0, k * 0.6]}><torusGeometry args={[0.022, 0.006, 8, 16]} /><meshStandardMaterial color="#e8c88a" roughness={0.4} /></mesh>)}
      </group>
    </group>
    {/* el pañuelo plano que se despliega antes de envolver */}
    <mesh position={[0.18, 0.003 + 0.06 * wrap, 0.1]} rotation={[-PI / 2 + 1.2 * wrap, 0, 0.3]} scale={[Math.max(0.05, lerp(0.4, 1, unf) * (1 - 0.95 * wrap)), Math.max(0.05, lerp(0.4, 1, unf) * (1 - 0.95 * wrap)), 1]}><planeGeometry args={[0.2, 0.2]} /><meshStandardMaterial map={laceTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <pointLight position={[0.1, 0.5, 0.3]} intensity={1.3} distance={1.5} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 20:32 · EL GRANERO: el granero rojo de noche, las guirnaldas se prenden de a una, las sillas blancas en fila y una sola silla con el moño reservada adelante ----
export const HBarn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#141a26" warm={0.4}
  cam={{ at: [0, 0.7, 0], at1: [0, 0.75, 0], az: [-0.35, 0.2], el: [0.22, 0.18], r: [4.2, 3.4], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="A SEAT RESERVED UP FRONT" col={AMB} size={40} />}>{(tt) => {
  const lit = eio(tt, 0.4, 2.6), seat = eio(tt, 2.8, 3.6);
  return <>
    <mesh position={[0, -0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[10, 8]} /><meshStandardMaterial color="#2a3a22" roughness={1} /></mesh>
    {/* el granero */}
    <group position={[0, 0, -1.4]}>
      <RBox s={[1.6, 1.1, 1.2]} r={0.02} p={[0, 0.55, 0]}><meshStandardMaterial color="#8a2a22" roughness={0.85} /></RBox>
      <mesh position={[0, 1.38, 0]} rotation={[0, 0, PI / 4]} scale={[1, 1, 1]}><boxGeometry args={[1.18, 1.18, 1.22]} /><meshStandardMaterial color="#3a3432" roughness={0.8} /></mesh>
      <RBox s={[0.6, 0.8, 0.02]} r={0.01} p={[0, 0.4, 0.61]}><meshStandardMaterial color="#f4ecd8" roughness={0.8} emissive="#ffcf7a" emissiveIntensity={0.6 * lit} /></RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.15, 0.4, 0.625]} rotation={[0, 0, k * 0.93]}><boxGeometry args={[0.02, 0.98, 0.01]} /><meshStandardMaterial color="#f4ecd8" /></mesh>)}
    </group>
    {/* guirnaldas que van del granero a los postes */}
    {[-1, 1].map((k) => Array.from({ length: 14 }, (_, i) => { const u = i / 13, on = lit > u;
      return <mesh key={k + "" + i} position={[k * lerp(0.6, 1.5, u), 1.2 - 0.35 * Math.sin(PI * u), lerp(-0.8, 1.0, u)]}><sphereGeometry args={[0.025, 8, 6]} /><meshBasicMaterial color={on ? "#ffe6a0" : "#3a3426"} toneMapped={false} /></mesh>; }))}
    {[-1, 1].map((k) => <mesh key={k} position={[k * 1.5, 0.6, 1.0]}><cylinderGeometry args={[0.02, 0.025, 1.2, 8]} />{M.wood({ base: [110, 80, 50] })}</mesh>)}
    {/* sillas blancas en filas y la reservada adelante */}
    {Array.from({ length: 3 }, (_, r) => Array.from({ length: 6 }, (_, c) => { const x = (c < 3 ? -1 : 1) * (0.25 + (c % 3) * 0.22), z = 0.1 + r * 0.3;
      return <group key={r + "-" + c} position={[x, 0, z]}><RBox s={[0.14, 0.02, 0.14]} r={0.004} p={[0, 0.22, 0]}><meshStandardMaterial color="#f4f2ec" roughness={0.6} /></RBox><RBox s={[0.14, 0.18, 0.015]} r={0.004} p={[0, 0.32, -0.07]}><meshStandardMaterial color="#f4f2ec" roughness={0.6} /></RBox>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], j) => <mesh key={j} position={[a * 0.06, 0.11, b * 0.06]}><cylinderGeometry args={[0.006, 0.006, 0.22, 6]} /><meshStandardMaterial color="#f4f2ec" /></mesh>)}
      </group>; }))}
    <group position={[-0.25, 0, -0.25]}>
      <RBox s={[0.14, 0.02, 0.14]} r={0.004} p={[0, 0.22, 0]}><meshStandardMaterial color="#f4f2ec" roughness={0.6} /></RBox><RBox s={[0.14, 0.18, 0.015]} r={0.004} p={[0, 0.32, -0.07]}><meshStandardMaterial color="#f4f2ec" roughness={0.6} /></RBox>
      <mesh position={[0, 0.36, -0.06]}><torusGeometry args={[0.035, 0.012, 8, 20]} /><meshStandardMaterial color="#c9a24a" roughness={0.4} emissive={AMB} emissiveIntensity={0.4 * seat} /></mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.13, 0.16, 40]} /><meshBasicMaterial color={AMB} transparent opacity={0.7 * seat} depthWrite={false} toneMapped={false} /></mesh>
    </group>
    {/* una estrella suave */}
    <mesh position={[1.4, 2.6, -3]}><sphereGeometry args={[0.03, 8, 6]} /><meshBasicMaterial color="#fff6dc" toneMapped={false} /></mesh>
    <pointLight position={[0, 1.3, 0.2]} intensity={0.4 + 1.8 * lit} distance={4} color="#ffd890" />
    <pointLight position={[0, 3, 2]} intensity={0.35} distance={6} color="#9ab0d8" />
  </>; }}</Scene3D>;

// ---- 21:28 · LA PROMESA: los dos anillos sobre la Biblia abierta; de cada uno sale un hilo de luz que va hasta cada persona del círculo de alrededor ----
export const HPromise: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#1e1a16" warm={0.8}
  cam={{ at: [0, 0.3, 0], at1: [0, 0.32, 0], az: [-0.2, 0.25], el: [0.62, 0.5], r: [1.7, 1.35], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="THE PROMISE IS TO ALL OF US" col={AMB} size={40} />}>{(tt) => {
  const N = 10, thr = eio(tt, 1.0, 3.4), page = tex.text("ebible", 512, 360, (g) => { g.fillStyle = "#f6efdc"; g.fillRect(0, 0, 512, 360); g.fillStyle = "#6a5a48"; for (let i = 0; i < 18; i++) { g.fillRect(24, 24 + i * 18, 210, 4); g.fillRect(278, 24 + i * 18, 210, 4); } g.fillStyle = "#3a2e22"; g.fillRect(254, 0, 4, 360); });
  return <>
    <RBox s={[0.5, 0.04, 0.36]} r={0.01} p={[0, 0.22, 0]}><meshStandardMaterial color="#3a2218" roughness={0.6} /></RBox>
    <mesh position={[0, 0.244, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.46, 0.32]} /><meshStandardMaterial map={page} roughness={0.85} /></mesh>
    <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.18, 0.2, 0.22, 24]} />{M.wood({ base: [120, 80, 46] })}</mesh>
    {[-0.04, 0.04].map((x, i) => <mesh key={i} position={[x, 0.255, 0]} rotation={[PI / 2 - 0.3, 0, 0.3 * (i ? 1 : -1)]}><torusGeometry args={[0.045, 0.01, 12, 40]} />{M.brass({ col: "#e6c060" })}</mesh>)}
    {Array.from({ length: N }, (_, i) => { const a = i / N * PI * 2, x = Math.cos(a) * 1.2, z = Math.sin(a) * 1.2, k = cl(thr * 1.4 - i * 0.04);
      const pts = [[0, 0.27, 0], [x * 0.5, 0.65, z * 0.5], [x * 0.95, 0.85, z * 0.95]];
      return <group key={i}>
        <Person p={[x, 0, z]} s={0.8 + 0.1 * rn(i, 2)} ry={-a - PI / 2} coat={["#3a5a7a", "#6a3a3a", "#4a5a3a", "#5a4a6a", "#7a6a3a"][i % 5]} hair={["#e8e4dc", "#3a2a22", "#6a5a4a", "#c8a87a"][i % 4]} />
        {/* el hilo de luz: segmentos que se encienden de a poco */}
        {Array.from({ length: 16 }, (_, j) => { const u = j / 15, p = u < 0.5 ? [lerp(pts[0][0], pts[1][0], u * 2), lerp(pts[0][1], pts[1][1], u * 2), lerp(pts[0][2], pts[1][2], u * 2)] : [lerp(pts[1][0], pts[2][0], u * 2 - 1), lerp(pts[1][1], pts[2][1], u * 2 - 1), lerp(pts[1][2], pts[2][2], u * 2 - 1)];
          return <mesh key={j} position={p as any} visible={k > u + 0.01}><sphereGeometry args={[0.014, 6, 5]} /><meshBasicMaterial color={AMB} toneMapped={false} transparent opacity={0.85} /></mesh>; })}
      </group>; })}
    <pointLight position={[0, 0.8, 0]} intensity={0.6 + 1.6 * thr} distance={3} color="#ffd890" />
    <pointLight position={[0, 2.4, 1.2]} intensity={0.6} distance={5} color="#fff0dc" />
  </>; }}</Scene3D>;
