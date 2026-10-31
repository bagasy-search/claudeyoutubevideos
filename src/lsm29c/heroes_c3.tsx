// lsm29c · componentes únicos 13-18 (el árbol de mitones, la segunda vela del Adviento, cuatro minutos de Lucas 2, el ponche con sorbete, «vení a sentarte», cien lucecitas).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, FoldChair, Plate, Table, paperTex } from "./tg";
import { Hourglass, Mitten, Pew, Person, PunchBowl, TierPine } from "./xg";

const PI = Math.PI;
const MCOL = ["#b52a22", "#2f5a3a", "#24395e", "#efe6d2", "#c9a24a"];

// ---- 9:52 · EL ÁRBOL DE MITONES: un pino común en el atrio; semana a semana los mitones, gorros y bufandas vuelan a colgarse hasta taparlo entero ----
export const HMittentree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.55, 0], at1: [0, 0.6, 0], az: [-0.3, 0.25], el: [0.12, 0.1], r: [1.7, 1.3], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="BY CHRISTMAS IT'S COVERED" col={AMB} size={42} />}>{(tt) => {
  const N = 34, k = cl((tt - 0.3) / 3.8);
  return <>
    <TierPine p={[0, 0, 0]} s={1.45} />
    {/* la caja de cartón de donaciones, de donde salen volando */}
    <RBox s={[0.36, 0.22, 0.26]} r={0.01} p={[0.75, 0.11, 0.35]}><meshStandardMaterial color="#b88d5c" roughness={0.95} /></RBox>
    <mesh position={[0.75, 0.222, 0.35]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.34, 0.24]} /><meshStandardMaterial color="#3a2a1a" roughness={1} /></mesh>
    {Array.from({ length: N }, (_, i) => { const lv = i % 4, a = i * 2.39 + rn(i, 2), y = 0.36 + lv * 0.23 + 0.05 * rn(i, 3), r = (0.33 - lv * 0.075) * 1.45 * 0.95, g = cl(k * N - i);
      const fx = Math.sin(a) * r, fz = Math.cos(a) * r + 0.03, fly = 1 - eio(g, 0, 1);
      return <group key={i} visible={g > 0.01} position={[lerp(fx, 0.75, fly), lerp(y, 0.24, fly) + Math.sin(PI * fly) * (0.35 + 0.3 * rn(i, 4)), lerp(fz, 0.35, fly)]} rotation={[0, a, 0.25 * Math.sin(i) + fly * 3]}>
        {i % 5 === 4 ? <mesh scale={[1, 0.7, 1]}><sphereGeometry args={[0.04, 14, 10, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color={MCOL[(i + 1) % 5]} roughness={1} side={THREE.DoubleSide} /></mesh>
          : <Mitten col={MCOL[i % 5]} s={0.9} />}
      </group>; })}
    {/* el perchero de madera y el cartel del atrio */}
    <RBox s={[0.04, 1.4, 0.04]} r={0.01} p={[-0.85, 0.7, -0.2]}>{M.wood({ base: [110, 66, 34] })}</RBox>
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.12, 0.02, 0.02]} r={0.005} p={[-0.85 + (i - 1) * 0.04, 1.3, -0.2]} rot={[0, i * 2.1, 0.5]}>{M.wood({ base: [110, 66, 34] })}</RBox>)}
    <mesh position={[0.8, 0.95, -0.3]}><planeGeometry args={[0.4, 0.28]} /><meshStandardMaterial map={paperTex("xmitsign", ["MITTEN TREE", "new or hand-knit"], { w: 512, h: 360, font: "900", ink: "#8f1d18" })} roughness={0.8} /></mesh>
  </>; }}</Scene3D>;

// ---- 10:13 · LA SEGUNDA SEMANA, HORNEAMOS: la corona de Adviento enciende su segunda vela y a su alrededor aparecen las bandejas de estrellas, campanas y fudge ----
const Star: React.FC<{ p: number[]; s: number; col: string }> = ({ p, s, col }) => <mesh position={p as [number, number, number]} rotation={[-PI / 2, 0, rn(p[0] * 50, 2) * PI]} scale={s} castShadow><cylinderGeometry args={[0.024, 0.024, 0.008, 5]} /><meshStandardMaterial color={col} roughness={0.7} /></mesh>;
export const HAdvent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.5}
  cam={{ at: [0, 0.06, 0], at1: [0, 0.08, 0], az: [-0.1, 0.25], el: [0.55, 0.45], r: [1.0, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="WEEK TWO · WE BAKE" col={AMB} size={46} />}>{(tt) => {
  const c2 = eio(tt, 0.8, 1.4), trays = cl((tt - 1.5) / 2.6);
  return <>
    <RBox s={[2.0, 0.04, 1.2]} r={0.01} p={[0, -0.016, 0]}>{M.wood({ base: [120, 80, 50] })}</RBox>
    {/* la corona: anillo de ramas, cuatro velas, la primera encendida, la segunda se prende ahora */}
    <mesh position={[0, 0.02, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.12, 0.03, 10, 36]} /><meshStandardMaterial color="#2a5a3a" roughness={0.9} /></mesh>
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.285) * 0.12, 0.035, Math.sin(i * 0.285) * 0.12]} rotation={[0.5, i * 0.285, 0.4]}><coneGeometry args={[0.012, 0.05, 5]} /><meshStandardMaterial color="#336b44" roughness={0.9} /></mesh>)}
    {[0, 1, 2, 3].map((i) => <group key={i}><Candle p={[Math.cos(i * PI / 2 + PI / 4) * 0.12, 0.02, Math.sin(i * PI / 2 + PI / 4) * 0.12]} tt={tt} on={i === 0 ? 1 : i === 1 ? c2 : 0} h={0.13} /></group>)}
    <pointLight position={[0, 0.3, 0]} intensity={0.35 + 0.6 * c2} distance={1.2} color="#ffc070" />
    <mesh position={[-0.02, 0.06, 0.13]} rotation={[0, 0, 0.3]}><torusGeometry args={[0.02, 0.006, 6, 14]} /><meshStandardMaterial color="#b52a22" roughness={0.8} /></mesh>
    {/* las bandejas que llegan: estrellas, campanas (arbolitos verdes) y cuadraditos de fudge */}
    {[[-0.45, -0.05, "#e9cf8f"], [0.45, -0.05, "#3f8f4a"], [0, -0.38, "#5a3420"]].map(([x, z, col], j) => { const g = phys(trays * 3 - j, 0, 6, 0.5);
      return <group key={j} position={[x as number, 0.004 + 0.3 * (1 - cl(g)), z as number]} visible={trays * 3 - j > 0.01}>
        <RBox s={[0.36, 0.01, 0.24]} r={0.004} p={[0, 0.005, 0]}>{M.steel({ col: "#b8bcc0" })}</RBox>
        {Array.from({ length: 12 }, (_, i) => j === 2
          ? <RBox key={i} s={[0.05, 0.022, 0.05]} r={0.004} p={[-0.13 + (i % 4) * 0.085, 0.022, -0.07 + Math.floor(i / 4) * 0.07]}><meshStandardMaterial color={col as string} roughness={0.5} /></RBox>
          : <Star key={i} p={[-0.13 + (i % 4) * 0.085, 0.015, -0.07 + Math.floor(i / 4) * 0.07]} s={1} col={col as string} />)}
      </group>; })}
  </>; }}</Scene3D>;

// ---- 11:21 · CUATRO MINUTOS: el reloj de arena se da vuelta junto a la Biblia abierta en Lucas 2 y los regalos sin abrir esperan; el tambor marca 4 ----
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.85} lamp={[-0.1, 0.5, 0.15]}
  cam={{ at: [0.05, 0.12, 0.05], at1: [0.05, 0.12, 0.05], az: [-0.15, 0.08], el: [0.45, 0.4], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="LUKE 2 · IT TAKES 4 MINUTES" col={AMB} size={42} />}>{(tt) => {
  const flip = eio(tt, 0.3, 1.1), sand = cl((tt - 1.2) / 3.6);
  return <>
    <Table w={1.8} d={1.0} top={0.003} />
    <group position={[0.18, 0.12, 0]} rotation={[0, 0, PI * (1 - flip)]}><group position={[0, -0.12, 0]}><Hourglass sand={flip < 1 ? 0 : sand} s={1.3} /></group></group>
    {/* la Biblia abierta en Lucas 2 */}
    <group position={[-0.25, 0.012, 0.05]} rotation={[0, 0.2, 0]}>
      <RBox s={[0.42, 0.024, 0.3]} r={0.006} p={[0, 0, 0]}><meshStandardMaterial color="#3b1d14" roughness={0.6} /></RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.1, 0.0135, 0]} rotation={[-PI / 2, 0, k * -0.03]}><planeGeometry args={[0.19, 0.27]} /><meshStandardMaterial map={paperTex("xluke" + k, k < 0 ? ["LUKE 2", "And it came", "to pass in", "those days"] : ["...she brought", "forth her", "firstborn son"], { w: 384, h: 512 })} roughness={0.85} /></mesh>)}
    </group>
    {/* los regalos esperando, sin abrir */}
    {[[0.42, -0.18, "#b52a22", 0.12], [0.5, 0.02, "#2f5a3a", 0.09], [0.38, 0.18, "#24395e", 0.1]].map(([x, z, c, s], i) => <group key={i} position={[x as number, 0, z as number]} rotation={[0, i * 0.5, 0]}>
      <RBox s={[s as number, s as number, s as number]} r={0.005} p={[0, (s as number) / 2, 0]}><meshStandardMaterial color={c as string} roughness={0.5} /></RBox>
      <RBox s={[0.012, (s as number) + 0.003, (s as number) + 0.003]} r={0.002} p={[0, (s as number) / 2, 0]}>{M.brass()}</RBox>
    </group>)}
    <group position={[0.0, 0.09, 0.3]}><DigitDrum v={4} r={0.08} w={0.1} /></group>
  </>; }}</Scene3D>;

// ---- 12:03 · EL PONCHE ROJO CON SORBETE: la ponchera de vidrio del sótano recibe las bochas de sorbete rosa y amarillo, que caen y flotan, y el cucharón espera ----
export const HPunchbowl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="wood" warm={0.9}
  cam={{ at: [0, 0.12, 0], at1: [0, 0.1, 0], az: [-0.2, 0.15], el: [0.5, 0.7], r: [0.95, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="RED PUNCH · SHERBET ON TOP" col={AMB} size={42} />}>{(tt) => {
  const sc = cl((tt - 0.4) / 3.2);
  return <>
    {/* la salpicadura de cada bocha al caer: anillos que se abren en la superficie */}
    {Array.from({ length: 6 }, (_, i) => { const at = 0.4 + (i + 0.85) * 3.2 / 6, k = cl((tt - at) / 0.5), a = i * 1.05 + 0.4, r = 0.04 + 0.07 * rn(i, 2);
      return <mesh key={i} visible={k > 0 && k < 1} position={[Math.cos(a) * r, 0.103, Math.sin(a) * r]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03 + 0.06 * k, 0.036 + 0.06 * k, 32]} /><meshBasicMaterial color="#ffd0d8" transparent opacity={0.7 * (1 - k)} depthWrite={false} /></mesh>; })}
    <Table w={1.8} d={1.0} top={0.003} />
    <PunchBowl p={[0, 0, 0]} scoops={sc} tt={tt} />
    {/* el cucharón de vidrio y los vasitos de papel en fila */}
    <group position={[0.36, 0.03, 0.05]} rotation={[0, 0, -PI / 2 + 0.08]}><mesh><cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />{M.glass({ op: 0.5 })}</mesh><mesh position={[0, -0.16, 0]}><sphereGeometry args={[0.03, 16, 10, 0, PI * 2, PI / 2, PI / 2]} />{M.glass({ op: 0.5 })}</mesh></group>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.4 + i * 0.07, 0.04, 0.3]}><cylinderGeometry args={[0.025, 0.018, 0.08, 16, 1, true]} /><meshStandardMaterial color={i % 2 ? "#f4efe2" : "#e9dcc6"} roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
  </>; }}</Scene3D>;

// ---- 12:20 · VENÍ A SENTARTE: en el borde del salón alguien queda parado con el plato; en la mesa una silla plegable se corre sola hacia afuera y le hace lugar ----
export const HComesit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="wood" warm={0.85}
  cam={{ at: [0.8, 0.5, 0.65], at1: [0.62, 0.45, 0.55], az: [0.55, 0.35], el: [0.2, 0.18], r: [1.3, 1.1], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="COME SIT WITH US · WE'VE GOT ROOM" col={AMB} size={40} />}>{(tt) => {
  const pull = eio(tt, 1.6, 2.8), walk = eio(tt, 2.9, 4.4);
  return <>
    {/* la mesa larga con mantel de papel y la gente ya sentada (figuras talladas, sin cara) */}
    <group position={[-0.2, 0.45, 0]}><Table w={1.6} d={0.6} top={0.003} /></group>
    {[-0.75, -0.45, -0.15, 0.15].map((x, i) => <group key={i}><FoldChair p={[x - 0.2, 0, -0.42]} ry={0} /><Person p={[x - 0.2, 0.0, -0.42]} s={0.62} coat={["#7a4a3a", "#3a5a4a", "#6a5a8a", "#8a7a5a"][i]} hair={["#d8d4cc", "#6a4a2a", "#e8e4dc", "#9a8a7a"][i]} hold={0.6} /></group>)}
    {[-0.7, -0.3, 0.1].map((x, i) => <Plate key={i} p={[x - 0.2, 0.455, -0.15]} r={0.07} />)}
    {/* la silla vacía que se corre */}
    <group position={[0.42 + 0.22 * pull, 0, 0.42 + 0.1 * pull]} rotation={[0, PI + 0.5 * pull, 0]}><FoldChair p={[0, 0, 0]} /></group>
    <mesh position={[0.62, 0.007, 0.5]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.3, 32]} />{M.glow({ col: "#ffcf7a", op: 0.16 * pull })}</mesh>
    {/* quien estaba al borde, con su plato, camina hasta la silla */}
    <group position={[lerp(1.35, 0.68, walk), 0, lerp(0.95, 0.62, walk)]}>
      <Person p={[0, 0, 0]} s={0.82} ry={-0.6 - 0.4 * walk} coat="#4a5f80" hair="#cfc9bf" hold={1} />
      <group rotation={[0, -0.6 - 0.4 * walk, 0]}><Plate p={[0, 0.6, 0.27]} r={0.08} /></group>
    </group>
    {/* copos de papel en las ventanas altas */}
    {[-0.9, -0.2, 0.5].map((x) => <mesh key={x} position={[x, 1.25, -0.9]}><planeGeometry args={[0.36, 0.3]} />{M.glow({ col: "#b7c6dc", op: 0.4 })}</mesh>)}
    <mesh position={[0, 1.0, -0.92]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#e2d6c0" roughness={0.9} /></mesh>
  </>; }}</Scene3D>;

// ---- 13:27 · CIEN LUCECITAS (revelación): la iglesia a oscuras; una vela adelante y la llama baja banco por banco, de vela en vela, hasta que la nave entera brilla ----
const ROWSC = 6, PER = 9;
export const HCandlestar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0f0d14" warm={0.25} key1={[0, 2.4, -2.4]}
  cam={{ at: [0, 0.6, -1.6], at1: [0, 0.5, 0.0], az: [0.0, 0.15], el: [0.2, 0.42], r: [1.2, 3.1], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={5.0} x={960} y={1010} txt="SILENT NIGHT · 100 LITTLE LIGHTS" col={AMB} size={40} />}>{(tt) => {
  const wave = cl((tt - 0.5) / 3.0) * (ROWSC + 1.2), glow = eio(tt, 2.6, 4.0);
  return <>
    {/* paredes tenues de la nave para que no quede el vacío: el yeso apenas se ve con las velas */}
    <mesh position={[0, 1.2, -2.4]}><planeGeometry args={[5, 2.6]} /><meshStandardMaterial color="#3a3026" roughness={0.95} emissive="#ffb060" emissiveIntensity={0.3 * glow} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 1.8, 1.2, 0]} rotation={[0, -k * PI / 2, 0]}><planeGeometry args={[6, 2.6]} /><meshStandardMaterial color="#332a22" roughness={0.95} emissive="#ffb060" emissiveIntensity={0.25 * glow} /></mesh>)}
    {[-1.2, 0, 1.2].map((x) => <mesh key={x} position={[x, 1.35, -2.38]}><planeGeometry args={[0.32, 0.9]} />{M.glow({ col: "#2a3550", op: 0.6 })}</mesh>)}
    {/* la primera vela al frente */}
    <Candle p={[0, 0.5, -1.9]} tt={tt} on={1} h={0.3} />
    {Array.from({ length: ROWSC }, (_, r) => [-1, 1].map((k) => <group key={r + "" + k}>
      <Pew p={[k * 0.8, 0, -1.3 + r * 0.5]} w={1.2} />
      {Array.from({ length: PER }, (_, j) => { const order = r + (k > 0 ? j : PER - 1 - j) / PER * 0.9, on = cl((wave - order) * 3);
        return <Candle key={j} p={[k * 0.8 - 0.55 + j * 0.137, 0.62, -1.3 + r * 0.5 + 0.06]} tt={tt + j * 0.3} on={on} h={0.06} />; })}
    </group>))}
    {/* el resplandor general crece en rampa (luz siempre montada) */}
    <pointLight position={[0, 1.0, 0]} intensity={6 * cl(wave / (ROWSC + 1.2))} distance={5} color="#ffb860" />
    <pointLight position={[0, 0.9, 1.4]} intensity={4 * glow} distance={3.5} color="#ffb860" />
    <mesh position={[0, 0.008, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3.6, 4]} />{M.glow({ col: "#ffb060", op: 0.12 * glow })}</mesh>
    <pointLight position={[0, 0.9, -1.8]} intensity={1.6} distance={2} color="#ffc070" />
  </>; }}</Scene3D>;
