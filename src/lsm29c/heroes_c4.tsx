// lsm29c · componentes únicos 19-24 (la casita de jengibre que se cayó dos veces, tres cosas en la heladera, en ese orden, la navaja y el pino del granero, ponelo vos, los 41 dólares).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Candle, Table, paperTex } from "./tg";
import { Figure, Manger, Mitten, Sheep } from "./xg";
import { Bill } from "./pg";

const PI = Math.PI;
const gb = <meshStandardMaterial color="#9c5a2c" roughness={0.75} />;
const icing = <meshStandardMaterial color="#fbf7ee" roughness={0.5} />;

// ---- 15:10 · SE CAYÓ DOS VECES: la casita de jengibre de la revista se arma, se derrumba, se vuelve a armar y se vuelve a caer; las gomitas ruedan ----
const Wall: React.FC<{ p: number[]; ry: number; w: number; fall: number; dir: number }> = ({ p, ry, w, fall, dir }) => <group position={p as [number, number, number]} rotation={[0, ry, 0]}>
  <group rotation={[dir * fall * PI * 0.48, 0, 0]}><RBox s={[w, 0.14, 0.012]} r={0.003} p={[0, 0.07, 0]}>{gb}</RBox>
    <RBox s={[w, 0.01, 0.014]} r={0.004} p={[0, 0.14, 0]}>{icing}</RBox>
    <mesh position={[0, 0.07, 0.007]}><planeGeometry args={[0.04, 0.05]} /><meshStandardMaterial color="#f0c43a" emissive="#5a3a00" emissiveIntensity={0.3} /></mesh></group>
</group>;
export const HGingerbread: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.08, 0], at1: [0.03, 0.06, 0], az: [-0.35, 0.25], el: [0.42, 0.36], r: [0.95, 0.75], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="IT FELL DOWN TWICE" col={RED} size={40} />}>{(tt) => {
  // se arma (0-0.8), cae 1 (1.0-1.5), se rearma (1.8-2.4), cae 2 (2.8-3.3), queda caída
  const f1 = eio(tt, 0.9, 1.3) * (1 - eio(tt, 1.6, 2.1)), f2 = eio(tt, 3.3, 3.8), fall = Math.max(f1, f2), up = eio(tt, 0.0, 0.7);
  const roofF = Math.max(eio(tt, 0.85, 1.2) * (1 - eio(tt, 1.6, 2.1)), eio(tt, 3.25, 3.65));
  return <>
    <Table w={1.6} d={1.0} top={0.003} />
    <RBox s={[0.42, 0.012, 0.36]} r={0.004} p={[0, 0.006, 0]}><meshStandardMaterial color="#e9e4da" roughness={0.6} /></RBox>
    <group position={[0, 0.012 + 0.3 * (1 - up), 0]}>
      <Wall p={[0, 0, 0.1]} ry={0} w={0.24} fall={fall} dir={1} />
      <Wall p={[0, 0, -0.1]} ry={PI} w={0.24} fall={fall * 0.8} dir={1} />
      <Wall p={[0.12, 0, 0]} ry={PI / 2} w={0.2} fall={fall * 0.9} dir={1} />
      <Wall p={[-0.12, 0, 0]} ry={-PI / 2} w={0.2} fall={fall} dir={1} />
      {/* el techo: dos placas que se deslizan y caen */}
      {[-1, 1].map((k) => <group key={k} position={[0, 0.15 + 0.05 * (1 - roofF) - 0.13 * roofF, k * (0.055 + 0.12 * roofF)]} rotation={[k * (PI / 4) * (1 - roofF) + k * 0.1 * roofF, 0.3 * k * roofF, 0]}>
        <RBox s={[0.28, 0.012, 0.15]} r={0.003}>{gb}</RBox>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.11 + i * 0.044, 0.01, 0]}><sphereGeometry args={[0.009, 10, 8]} /><meshStandardMaterial color={["#d8342a", "#3f8f4a", "#f0c43a"][i % 3]} roughness={0.3} /></mesh>)}
      </group>)}
    </group>
    {/* gomitas que ruedan por la mesa cuando cae */}
    {Array.from({ length: 10 }, (_, i) => { const r = 0.15 + 0.55 * rn(i, 2) * fall, a = i * 0.63; return <mesh key={i} visible={fall > 0.05} position={[Math.cos(a) * r, 0.012, Math.sin(a) * r]}><sphereGeometry args={[0.016, 10, 8]} /><meshStandardMaterial color={["#d8342a", "#3f8f4a", "#f0c43a", "#e48a9a"][i % 4]} roughness={0.3} /></mesh>; })}
    {/* la revista abierta con la casita perfecta, al costado */}
    <mesh position={[-0.5, 0.006, 0.1]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.3, 0.22]} /><meshStandardMaterial map={paperTex("xmag", ["BETTER HOMES", "Gingerbread", "Perfect!"], { w: 512, h: 380, font: "900", bg: "#f9efe0", ink: "#a8261d" })} roughness={0.5} /></mesh>
    <group position={[0.42, 0.06, 0.3]}><DigitDrum v={f2 > 0.5 ? 2 : f1 > 0.5 || tt > 1.3 ? 1 : 0} r={0.045} w={0.055} /></group>
  </>; }}</Scene3D>;

// ---- 16:13 · TRES COSAS EN LA HELADERA: la tarjeta en blanco se pega con el imán del cardenal y las tres líneas aparecen escritas una por una ----
const L3 = ["1. Luke 2 out loud", "2. One person alone", "3. Hold the little light"];
const cardTex = (n: number) => tex.text("x3c" + n, 640, 400, (g) => {
  g.fillStyle = "#fbf8ef"; g.fillRect(0, 0, 640, 400); g.strokeStyle = "rgba(90,140,200,.35)"; g.lineWidth = 2;
  for (let y = 120; y < 400; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(640, y); g.stroke(); }
  g.strokeStyle = "rgba(210,80,80,.45)"; g.beginPath(); g.moveTo(0, 70); g.lineTo(640, 70); g.stroke();
  g.fillStyle = "#2b2a5a"; g.font = "italic 700 44px Georgia"; g.textAlign = "left";
  L3.forEach((l, i) => { const c = Math.round(cl(n - i) * l.length); g.fillText(l.slice(0, c), 34, 110 + i * 80); });
});
export const HThreecard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="wood" warm={0.95}
  cam={{ at: [0.0, 1.05, 0.04], at1: [0.02, 1.03, 0.04], az: [0.22, 0.05], el: [0.05, 0.02], r: [1.6, 1.15], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="WHEN YOU FEEL LIKE MARTHA · READ IT" col={AMB} size={38} />}>{(tt) => {
  const stick = phys(tt, 0.3, 6, 0.5), n = cl((tt - 1.0) / 3.0) * 3;
  return <>
    {/* la puerta de la heladera blanca esmaltada con su manija cromada */}
    <RBox s={[0.9, 1.7, 0.08]} r={0.04} p={[0, 0.85, -0.04]}><meshPhysicalMaterial color="#f4f1e8" roughness={0.25} clearcoat={0.7} /></RBox>
    <RBox s={[0.04, 0.5, 0.05]} r={0.015} p={[0.38, 1.05, 0.03]}>{M.chrome()}</RBox>
    {/* la tarjeta que llega volando y queda */}
    <group position={[0, 1.02 + 0.3 * (1 - cl(stick)), 0.006]} rotation={[0, 0, 0.04 * (1 - cl(stick))]}>
      <mesh><planeGeometry args={[0.4, 0.25]} /><meshStandardMaterial map={cardTex(n)} roughness={0.85} /></mesh>
      {/* el imán del cardenal rojo */}
      <group position={[0.12, 0.11, 0.016]} scale={1.6 * cl(stick)}>
        <mesh scale={[1, 0.8, 0.5]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#c4231c" roughness={0.4} /></mesh>
        <mesh position={[0.025, 0.012, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.009, 0.02, 6]} /><meshStandardMaterial color="#f0a33a" /></mesh>
        <mesh position={[0.008, 0.032, 0]}><coneGeometry args={[0.012, 0.025, 6]} /><meshStandardMaterial color="#c4231c" roughness={0.4} /></mesh>
        <mesh position={[-0.035, -0.01, 0]} rotation={[0, 0, 0.8]} scale={[1, 0.4, 0.3]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#9a1a14" roughness={0.5} /></mesh>
      </group>
    </group>
    {/* otros recuerdos en la heladera: un dibujo de nieto y una foto */}
    <mesh position={[-0.25, 1.45, 0.004]} rotation={[0, 0, 0.08]}><planeGeometry args={[0.22, 0.18]} /><meshStandardMaterial map={paperTex("xdraw", ["MERRY", "XMAS", "GRANDMA"], { w: 256, h: 200, font: "900", ink: "#2f6d8a", bg: "#fffaf0" })} roughness={0.9} /></mesh>
    <mesh position={[0.22, 0.62, 0.004]} rotation={[0, 0, -0.05]}><planeGeometry args={[0.18, 0.14]} /><meshStandardMaterial map={paperTex("xgro", ["flour", "butter", "sugar"], { w: 256, h: 200 })} roughness={0.9} /></mesh>
  </>; }}</Scene3D>;

// ---- 17:06 · EN ESE ORDEN: sobre la mesa de la granja se encienden, uno tras otro, el balde del tambo, el plato del desayuno, la Biblia en Lucas 2 y recién al final el regalo ----
export const HInorder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.7}
  cam={{ at: [0, 0.1, 0.08], at1: [0.02, 0.1, 0.08], az: [-0.04, 0.04], el: [0.5, 0.45], r: [1.6, 1.5], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.6} x={960} y={1010} txt="CHORES · BREAKFAST · LUKE 2 · PRESENTS" col={AMB} size={34} />}>{(tt) => {
  const on = (i: number) => phys(tt, 0.4 + i * 0.95, 6, 0.5), X = [-0.48, -0.16, 0.16, 0.48];
  return <>
    <Table w={2.0} d={0.9} top={0.003} />
    {/* 1. el balde de leche y el banquito */}
    <group position={[X[0], 0, 0]} scale={1.25 * (0.6 + 0.4 * cl(on(0)))}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.07, 0.06, 0.16, 28, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.15, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.066, 28]} /><meshStandardMaterial color="#fbfaf4" roughness={0.3} /></mesh>
      <mesh position={[0, 0.17, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.07, 0.003, 6, 24, PI]} />{M.steel()}</mesh>
    </group>
    {/* 2. el desayuno: huevos y tostada */}
    <group position={[X[1], 0, 0]} scale={1.25 * (0.6 + 0.4 * cl(on(1)))}>
      <mesh position={[0, 0.007, 0]}><cylinderGeometry args={[0.1, 0.08, 0.014, 40]} />{M.porcelain()}</mesh>
      {[-1, 1].map((k) => <group key={k}><mesh position={[k * 0.035, 0.016, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.032, 20]} /><meshStandardMaterial color="#fbf8ee" /></mesh><mesh position={[k * 0.035, 0.022, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.013, 14, 10]} /><meshStandardMaterial color="#f2a81a" roughness={0.3} /></mesh></group>)}
      <RBox s={[0.06, 0.012, 0.06]} r={0.006} p={[0, 0.02, -0.05]} rot={[0, 0.3, 0]}><meshStandardMaterial color="#c88a44" roughness={0.8} /></RBox>
    </group>
    {/* 3. la Biblia en Lucas 2 */}
    <group position={[X[2], 0.012, 0]} scale={1.25 * (0.6 + 0.4 * cl(on(2)))}>
      <RBox s={[0.26, 0.022, 0.19]} r={0.005}><meshStandardMaterial color="#3b1d14" roughness={0.6} /></RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.062, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.17]} /><meshStandardMaterial map={paperTex("xl2" + k, k < 0 ? ["LUKE", "2"] : ["Glory", "to God"], { w: 256, h: 360 })} roughness={0.85} /></mesh>)}
    </group>
    {/* 4. el regalo, último */}
    <group position={[X[3], 0, 0]} scale={1.25 * (0.6 + 0.4 * cl(on(3)))}>
      <RBox s={[0.13, 0.11, 0.13]} r={0.005} p={[0, 0.055, 0]}><meshStandardMaterial color="#b52a22" roughness={0.5} /></RBox>
      <RBox s={[0.014, 0.113, 0.133]} r={0.002} p={[0, 0.055, 0]}>{M.brass()}</RBox>
      <RBox s={[0.133, 0.113, 0.014]} r={0.002} p={[0, 0.055, 0]}>{M.brass()}</RBox>
    </group>
    {/* números del orden, que se prenden de a uno */}
    {X.map((x, i) => <group key={i} position={[x, 0.006, 0.26]} scale={1.3}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.045, 30]} />{M.glow({ col: cl(on(i)) > 0.5 ? "#ffcf7a" : "#5a4a38", op: 0.35 + 0.65 * cl(on(i)) })}</mesh>
      <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.06, 0.06]} /><meshBasicMaterial map={tex.text("xn" + i, 128, 128, (g) => { g.fillStyle = "#2b2420"; g.font = "900 100px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(i + 1), 64, 70); })} transparent /></mesh>
      {i < 3 && <mesh position={[0.12, 0, 0]} rotation={[-PI / 2, 0, -PI / 2]} visible={cl(on(i + 1)) > 0.1}><coneGeometry args={[0.02, 0.05, 3]} />{M.glow({ col: "#ffcf7a", op: cl(on(i + 1)) })}</mesh>}
    </group>)}
  </>; }}</Scene3D>;

// ---- 17:52 · LA NAVAJA Y EL PINO DEL GRANERO: el taco de pino cruje bajo la navaja, saltan rulos de viruta y debajo aparece la ovejita con la pata torcida ----
export const HCarving: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.95} lamp={[0.1, 0.45, 0.15]}
  cam={{ at: [0, 0.07, 0], at1: [0.01, 0.06, 0], az: [-0.4, 0.15], el: [0.38, 0.3], r: [0.72, 0.52], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="SCRAP PINE · A POCKETKNIFE" col={AMB} size={44} />}>{(tt) => {
  const c = cl((tt - 0.3) / 3.6), cut = c * 8, knife = Math.sin(cut * PI) ** 2;
  return <>
    <RBox s={[1.4, 0.05, 0.8]} r={0.02} p={[0, -0.025, 0]}>{M.wood({ base: [96, 58, 30] })}</RBox>
    {/* el taco que se achica revelando la oveja */}
    <RBox s={[0.16 * (1 - 0.75 * c), 0.12 * (1 - 0.7 * c), 0.09 * (1 - 0.7 * c)]} r={0.005} p={[0, 0.06 * (1 - 0.7 * c), 0]}><meshStandardMaterial map={tex.wood(1, 1, [214, 176, 124])} roughness={0.7} transparent opacity={1 - eio(c, 0.75, 1)} /></RBox>
    <group visible={c > 0.3}><Sheep p={[0, 0, 0]} s={1.5 * (0.6 + 0.4 * eio(c, 0.3, 1))} ry={0.6} crooked={0.45} /></group>
    {/* la navaja: hoja de acero, cachas de hueso, va y viene */}
    <group position={[0.07 + 0.03 * knife, 0.1 - 0.03 * knife, 0.03]} rotation={[0.2, -0.5, -0.9 + 0.35 * knife]}>
      <RBox s={[0.1, 0.018, 0.012]} r={0.005} p={[-0.06, 0, 0]}><meshStandardMaterial color="#e6dcc8" roughness={0.5} /></RBox>
      <mesh position={[0.025, 0, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.08, 0.014, 0.002]} />{M.steel({ col: "#dfe3e7" })}</mesh>
    </group>
    {/* virutas: rulos que se desprenden y caen por cada pasada */}
    {Array.from({ length: 16 }, (_, i) => { const k = cl(cut - i * 0.5), y = 0.1 - 0.09 * eio(k, 0, 1), a = i * 1.7;
      return <mesh key={i} visible={k > 0.02} position={[0.06 + 0.18 * rn(i, 2) * k * Math.cos(a), Math.max(0.006, y), 0.04 + 0.16 * rn(i, 3) * k * Math.sin(a)]} rotation={[k * 3, a, 1.2]}><torusGeometry args={[0.012, 0.0035, 6, 14, PI * 1.6]} /><meshStandardMaterial color="#e3c08a" roughness={0.8} side={THREE.DoubleSide} /></mesh>; })}
    {/* las figuras ya talladas, esperando en fila */}
    {[[-0.32, "#d8b483"], [-0.24, "#c9a27a"], [-0.4, "#b48a62"]].map(([x, col], i) => <Figure key={i} p={[x as number, 0, -0.12]} s={1.6} col={col as string} />)}
  </>; }}</Scene3D>;

// ---- 18:27 · PONELO VOS, ES SU CUMPLEAÑOS (revelación): el pesebre tallado entre María y José; el bebito de pino baja despacio sobre la paja y una luz tibia lo envuelve ----
export const HManger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.45}
  cam={{ at: [0, 0.1, 0], at1: [0, 0.08, 0], az: [-0.1, 0.08], el: [0.32, 0.38], r: [0.85, 0.5], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="IT'S HIS BIRTHDAY" col={AMB} size={50} />}>{(tt) => {
  const down = eio(tt, 0.8, 3.0), shine = eio(tt, 2.8, 4.0);
  return <>
    <RBox s={[1.4, 0.04, 0.8]} r={0.01} p={[0, -0.016, 0]}>{M.wood({ base: [120, 74, 40] })}</RBox>
    {/* el establo de tablitas */}
    <RBox s={[0.6, 0.012, 0.3]} r={0.004} p={[0, 0.006, -0.02]}>{M.wood({ base: [170, 128, 80] })}</RBox>
    {[-1, 1].map((k) => <RBox key={k} s={[0.015, 0.32, 0.015]} r={0.003} p={[k * 0.28, 0.16, -0.15]}>{M.wood({ base: [130, 90, 50] })}</RBox>)}
    {[-1, 1].map((k) => <RBox key={k} s={[0.36, 0.012, 0.3]} r={0.003} p={[k * 0.15, 0.36 - 0.06, -0.02]} rot={[0, 0, -k * 0.4]}>{M.wood({ base: [150, 106, 62] })}</RBox>)}
    <Manger p={[0, 0.012, 0]} s={1.3} />
    <Figure p={[-0.16, 0.012, -0.02]} s={1.6} col="#c9a27a" ry={0.4} />
    <Figure p={[0.16, 0.012, -0.04]} s={1.8} col="#b48a62" ry={-0.4} />
    {[0.3, 0.38, 0.46].map((x, i) => <Figure key={i} p={[x, 0.012, 0.08 + i * 0.02]} s={1.4} col="#a87a52" ry={-0.8} />)}
    <Sheep p={[-0.34, 0.012, 0.1]} s={1.3} ry={0.5} crooked={0.45} />
    {/* el bebito envuelto que baja a la paja */}
    <group position={[0, 0.098 + 0.22 * (1 - down), 0.002]} rotation={[0, 0, PI / 2]}>
      <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.016, 16, 12]} /><meshStandardMaterial map={tex.wood(1, 1, [226, 190, 140])} roughness={0.7} /></mesh>
      <mesh scale={[1, 0.6, 0.6]}><capsuleGeometry args={[0.022, 0.05, 6, 12]} /><meshStandardMaterial color="#efe6d2" roughness={0.9} emissive="#ffcf7a" emissiveIntensity={0.25 * shine} /></mesh>
    </group>
    <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.09, 20, 14]} />{M.glow({ col: "#ffcf7a", op: 0.1 * shine })}</mesh>
    <Candle p={[-0.45, 0, 0.18]} tt={tt} on={1} h={0.14} />
    <pointLight position={[0, 0.25, 0.15]} intensity={0.3 + 0.7 * shine} distance={1.0} color="#ffcf7a" />
  </>; }}</Scene3D>;

// ---- 19:01 · LOS 41 DÓLARES: los billetes caen sobre la mesa y se convierten en naranjas, bastones de menta y un par de mitones para cada nieto ----
const Orange: React.FC<{ p: number[] }> = ({ p }) => <mesh position={p as [number, number, number]} castShadow><sphereGeometry args={[0.034, 20, 14]} /><meshStandardMaterial color="#f08a1e" roughness={0.6} /></mesh>;
const Peppermint: React.FC<{ p: number[]; rz: number }> = ({ p, rz }) => <mesh position={p as [number, number, number]} rotation={[PI / 2, 0, rz]}><cylinderGeometry args={[0.006, 0.006, 0.14, 12]} /><meshStandardMaterial map={tex.text("xpep", 64, 256, (g) => { g.fillStyle = "#fbf8f2"; g.fillRect(0, 0, 64, 256); g.fillStyle = "#d22a26"; for (let y = -64; y < 256; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(64, y + 32); g.lineTo(64, y + 44); g.lineTo(0, y + 12); g.fill(); } })} roughness={0.3} /></mesh>;
export const HFortyone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.05, 0], at1: [0.03, 0.05, 0], az: [-0.25, 0.1], el: [0.6, 0.5], r: [1.05, 0.82], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="$41 · THEIR FAVORITE CHRISTMAS" col={AMB} size={42} />}>{(tt) => {
  const bills = eio(tt, 0.2, 1.0), swap = eio(tt, 1.4, 2.0), items = cl((tt - 1.9) / 2.2);
  return <>
    <Table w={1.8} d={1.0} top={0.003} />
    {/* los billetes: 20 + 20 + 1 */}
    {["20", "20", "1"].map((v, i) => <group key={i} visible={swap < 0.98}><Bill v={v} p={[-0.1 + i * 0.1, 0.004 + 0.3 * (1 - bills) + i * 0.002, -0.02 * i]} rot={[-PI / 2, 0, 0.3 - i * 0.3 + (1 - bills) * 2]} s={0.9 * (1 - swap)} /></group>)}
    {/* el bol de naranjas */}
    <mesh position={[-0.3, 0.04, -0.05]} visible={items > 0.01}><sphereGeometry args={[0.13, 32, 14, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    {Array.from({ length: 7 }, (_, i) => { const g = cl(items * 7 - i); return <group key={i} visible={g > 0.01}><Orange p={[-0.3 + 0.06 * Math.cos(i * 1.1) * (i ? 1 : 0), 0.05 + 0.25 * (1 - eio(g, 0, 1)) + (i > 3 ? 0.03 : 0), -0.05 + 0.06 * Math.sin(i * 1.1) * (i ? 1 : 0)]} /></group>; })}
    {/* los bastones de menta en fila */}
    {Array.from({ length: 6 }, (_, i) => { const g = cl(items * 6 - i - 0.5); return <group key={i} visible={g > 0.01}><Peppermint p={[0.0 + i * 0.03, 0.008 + 0.2 * (1 - g), 0.12]} rz={0.15} /></group>; })}
    {/* los pares de mitones, uno por nieto */}
    {Array.from({ length: 4 }, (_, i) => { const g = cl(items * 4 - i - 1); return <group key={i} visible={g > 0.01} position={[0.3 + (i % 2) * 0.13, 0.015 + 0.25 * (1 - eio(g, 0, 1)), -0.1 + Math.floor(i / 2) * 0.16]}>
      <Mitten p={[-0.025, 0, 0]} rot={[-PI / 2, 0, 0.2]} col={["#b52a22", "#2f5a3a", "#24395e", "#c9a24a"][i]} s={1.2} />
      <Mitten p={[0.03, 0.004, 0.01]} rot={[-PI / 2, 0, -0.1]} col={["#b52a22", "#2f5a3a", "#24395e", "#c9a24a"][i]} s={1.2} />
    </group>; })}
    <group position={[0.0, 0.08, -0.32]}><DigitDrum v={Math.floor(Math.round(41 * Math.max(bills * 0.4, items)) / 10)} p={[-0.05, 0, 0]} r={0.06} w={0.07} /><DigitDrum v={Math.round(41 * Math.max(bills * 0.4, items)) % 10} p={[0.05, 0, 0]} r={0.06} w={0.07} /></group>
  </>; }}</Scene3D>;
