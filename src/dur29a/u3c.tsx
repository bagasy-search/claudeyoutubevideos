// dur29a · componentes únicos en 3D, bloque C: la ración, el trineo, el muro de capas, las postas, el odómetro del día,
// el fajado, sin rueda y el mecapal.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums } from "./u3a";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const fallY = (tt: number, a: number, h = 0.8) => (1 - cl(phys(tt, a, 8, 0.36))) * h;
const seen = (tt: number, a: number) => tt > a - 0.05;
const clayJar = new Map<string, THREE.LatheGeometry>();
const latheG = (k: string, P: number[][], seg = 40) => { let g = clayJar.get(k); if (!g) { g = new THREE.LatheGeometry(P.map(([r, y]) => new THREE.Vector2(r, y)), seg); clayJar.set(k, g); } return g; };

// caballo de arcilla (cuerpo, cuello, cabeza, patas que galopan, cola). col: pelaje; tired = más bajo y lento
export const Horse: React.FC<{ tt: number; col?: string; gallop?: number; ears?: number; horns?: boolean; s?: number; op?: number }> = ({ tt, col = "#8a5a36", gallop = 1, ears = 0.04, horns = false, s = 1, op = 1 }) => {
  const ph = tt * 2 * PI * 1.8 * gallop, bob = 0.012 * Math.sin(ph * 2) * gallop;
  const mat = <meshStandardMaterial color={col} roughness={0.7} transparent={op < 1} opacity={op} depthWrite={op > 0.5} />;
  return <group scale={s} position={[0, bob, 0]}>
    <mesh position={[0, 0.34, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.085, 0.26, 10, 20]} />{mat}</mesh>
    <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, -0.7]} castShadow><capsuleGeometry args={[0.045, 0.14, 8, 16]} />{mat}</mesh>
    <mesh position={[0.28, 0.52, 0]} rotation={[0, 0, -1.9]} castShadow><capsuleGeometry args={[0.035, 0.09, 8, 16]} />{mat}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[0.25, 0.58, sd * 0.02]} rotation={[0, 0, horns ? -0.2 : -0.1]} castShadow><coneGeometry args={[0.012, horns ? 0.09 : ears, 8]} />{horns ? <meshStandardMaterial color="#e8dcc0" roughness={0.5} /> : mat}</mesh>)}
    {[[0.13, 0.04], [0.13, -0.04], [-0.13, 0.04], [-0.13, -0.04]].map(([x, z], i) => { const a = Math.sin(ph + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * 0.5 * gallop; return <group key={i} position={[x, 0.3, z]} rotation={[0, 0, a]}>
      <mesh position={[0, -0.14, 0]} castShadow><cylinderGeometry args={[0.018, 0.014, 0.28, 10]} />{mat}</mesh>
      <mesh position={[0, -0.285, 0]}><cylinderGeometry args={[0.02, 0.02, 0.025, 10]} /><meshStandardMaterial color="#2a1d14" roughness={0.6} /></mesh>
    </group>; })}
    <mesh position={[-0.22, 0.34, 0]} rotation={[0, 0, 0.9 + 0.2 * Math.sin(ph)]} castShadow><coneGeometry args={[0.03, 0.18, 10]} /><meshStandardMaterial color="#2a1d14" roughness={0.8} /></mesh>
  </group>;
};

// ---- RacionPan · «Les pagaban con comida: pan, cebolla… litros de cerveza»: sobre la estera caen de a uno el pan, la cebolla y la jarra
// de barro; la jarra se llena de cerveza espesa hasta el borde con espuma ----
export const RacionPan3D: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "pan", 0.6), aC = sec(p, "cebolla", 1.4), aL = sec(p, "litros", 3);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.3, 2.2, 1.4]}
    cam={{ at: [0, 0.16, 0], az: [-0.45, 0.2], el: [0.42, 0.28], r: [1.7, 1.35], fov: 32 }}>{(tt) => {
    const fill = eio(tt, aL - 0.2, aL + 2.2);
    return <>
      {/* la estera de juncos */}
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 0.9]} /><meshStandardMaterial map={tex.text("estera", 256, 256, (g) => { g.fillStyle = "#c8a865"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 256; i += 8) { g.fillStyle = `rgba(110,80,35,${0.25 + 0.15 * rn(i, 1)})`; g.fillRect(0, i, 256, 3); } })} roughness={0.9} /></mesh>
      {seen(tt, aP) && <group position={[-0.42, 0.07 + fallY(tt, aP), 0.05]} rotation={[0, 0.4, 0]}>
        <mesh scale={[1.25, 0.62, 1]} castShadow><sphereGeometry args={[0.13, 32, 24]} /><meshStandardMaterial color="#b9773b" roughness={0.75} /></mesh>
        {[-0.06, 0, 0.06].map((x, i) => <mesh key={i} position={[x, 0.075, 0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.012, 0.01, 0.12]} /><meshStandardMaterial color="#e8c88c" roughness={0.8} /></mesh>)}
      </group>}
      {seen(tt, aC) && <group position={[-0.06, 0.06 + fallY(tt, aC), 0.2]}>
        <mesh castShadow scale={[1, 0.92, 1]}><sphereGeometry args={[0.065, 28, 20]} /><meshStandardMaterial color="#e6d6b0" roughness={0.45} /></mesh>
        <mesh position={[0, 0.075, 0]} castShadow><coneGeometry args={[0.018, 0.06, 10]} /><meshStandardMaterial color="#9b8a5a" roughness={0.6} /></mesh>
        {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[0, i * PI / 4, 0]}><torusGeometry args={[0.064, 0.0016, 6, 40, PI]} /><meshStandardMaterial color="#b9a578" /></mesh>)}
      </group>}
      {/* la jarra de barro: cuerpo de torno, cerveza que sube con espuma */}
      <group position={[0.36, fallY(tt, 0.2, 0.6), -0.05]}>
        <mesh castShadow geometry={latheG("jarra", [[0, 0], [0.09, 0.0], [0.13, 0.08], [0.14, 0.18], [0.11, 0.28], [0.08, 0.32], [0.09, 0.36], [0.085, 0.37]])}><meshStandardMaterial color="#a2552e" roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.02 + 0.3 * fill, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[lerp(0.1, 0.085, fill), 32]} /><meshStandardMaterial color={fill > 0.9 ? "#f3ead6" : "#c8963c"} roughness={0.4} /></mesh>
        {fill > 0.85 && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.05, 0.33 + 0.015 * Math.sin(tt * 3 + i), Math.sin(i) * 0.05]}><sphereGeometry args={[0.02 + 0.01 * rn(i, 2), 12, 10]} /><meshStandardMaterial color="#f6efe0" roughness={0.6} /></mesh>)}
        {/* el chorro que cae de arriba mientras se llena */}
        <mesh position={[0.0, 0.62, 0]} scale={[1, fill > 0.02 && fill < 0.98 ? 1 : 0.0001, 1]}><cylinderGeometry args={[0.012, 0.016, 0.5, 12]} /><meshStandardMaterial color="#c8963c" transparent opacity={0.85} roughness={0.3} /></mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- TrineoFriccion · «La arena mojada… la mitad»: el bloque de caliza en su trineo; la soga va a un dinamómetro de bronce; un cántaro
// moja la arena delante y la aguja cae a la mitad mientras el trineo empieza a deslizarse ----
const dialT = () => tex.text("dial", 512, 512, (g) => {
  g.fillStyle = "#f1e6cc"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  for (let i = 0; i <= 20; i++) { const a = -PI * 0.75 + i / 20 * PI * 1.5; g.strokeStyle = i === 10 ? "#b0301e" : "#2a1a0a"; g.lineWidth = i % 5 ? 4 : 10; g.beginPath(); g.moveTo(256 + Math.sin(a) * 200, 256 - Math.cos(a) * 200); g.lineTo(256 + Math.sin(a) * (i % 5 ? 180 : 160), 256 - Math.cos(a) * (i % 5 ? 180 : 160)); g.stroke(); }
  g.font = "900 54px Arial"; g.textAlign = "center"; g.fillStyle = "#2a1a0a"; g.fillText("100", 256 + Math.sin(PI * 0.18) * 120, 256 - Math.cos(PI * 0.18) * 120 + 18); g.fillStyle = "#b0301e"; g.fillText("50", 256 + Math.sin(-PI * 0.75) * 120 + 20, 256 - Math.cos(-PI * 0.75) * 120);
});
export const TrineoFriccion3D: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "agua", 1.5), aM = sec(p, "mitad", 4);
  return <U3 d={d} bg={p.bg} ground={[214, 184, 136]} mode="wipe" key1={[-1.6, 2.6, 1.2]}
    cam={{ at: [0.15, 0.25, 0], az: [-0.3, 0.12], el: [0.25, 0.16], r: [2.5, 2.1], fov: 32 }}>{(tt) => {
    const wet = eio(tt, aA, aA + 1.6), drop = eio(tt, aM - 0.3, aM + 0.8), slide = eio(tt, aM, aM + 3) * 0.35, needle = lerp(0.62, 0.31, drop) + 0.03 * Math.sin(tt * 5) * (1 - drop);
    return <>
      {/* franja de arena mojada que se oscurece delante del trineo */}
      <mesh position={[0.15 - 0.45 * (1 - wet), 0.003, 0]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, wet), 1, 1]}><planeGeometry args={[0.9, 0.5]} /><meshPhysicalMaterial map={dirtT([78, 58, 40])} roughness={0.25} clearcoat={0.6} /></mesh>
      <group position={[-0.45 + slide, 0, 0]}>
        {[-0.16, 0.16].map((z, i) => <mesh key={i} position={[0, 0.03, z]} castShadow><boxGeometry args={[0.8, 0.04, 0.05]} /><meshStandardMaterial map={tex.wood(2, 1, [130, 92, 54])} roughness={0.8} /></mesh>)}
        <RBox s={[0.6, 0.38, 0.42]} r={0.03} p={[0, 0.25, 0]}><meshStandardMaterial map={dirtT([178, 160, 128])} roughness={0.9} /></RBox>
      </group>
      {/* la soga tensa hasta el dinamómetro */}
      <mesh geometry={tubeG("sogaT", [[-0.12, 0.12, 0], [0.4, 0.2, 0], [0.82, 0.32, 0]], 0.01, 20, 6)}><meshStandardMaterial color="#c9a46a" roughness={0.85} /></mesh>
      <group position={[0.95, 0.42, 0]} rotation={[0, -0.45, 0]}>
        <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.06, 48]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.032]}><circleGeometry args={[0.175, 48]} /><meshStandardMaterial map={dialT()} roughness={0.6} /></mesh>
        <group position={[0, 0, 0.04]} rotation={[0, 0, -(needle * PI * 1.5 - PI * 0.75) + 0]}><mesh position={[0, 0.07, 0]}><boxGeometry args={[0.01, 0.15, 0.006]} /><meshStandardMaterial color="#1a1a1a" /></mesh></group>
        <mesh position={[0, 0, 0.045]}><cylinderGeometry args={[0.012, 0.012, 0.01, 16]} />{M.brass()}</mesh>
        <mesh position={[0, -0.42, 0]}><cylinderGeometry args={[0.02, 0.02, 0.5, 10]} /><meshStandardMaterial map={tex.wood(1, 1)} /></mesh>
      </group>
      {/* el cántaro que vuelca agua delante del trineo */}
      <group position={[0.5, 0, 0.32]} rotation={[0, 0, 1.45 * eio(tt, aA - 0.5, aA + 0.1)]}>
        <mesh position={[-0.08, 0.09, 0]} castShadow><cylinderGeometry args={[0.085, 0.07, 0.18, 24, 1, true]} /><meshStandardMaterial map={tex.wood(3, 1, [140, 98, 58])} roughness={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-0.08, 0.005, 0]}><cylinderGeometry args={[0.07, 0.07, 0.01, 24]} /><meshStandardMaterial map={tex.wood(1, 1, [120, 84, 50])} /></mesh>
        {[0.05, 0.13].map((y) => <mesh key={y} position={[-0.08, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.08 + (0.13 - y) * 0.1, 0.006, 6, 30]} />{M.steel({ col: "#5a5550" })}</mesh>)}
      </group>
      <mesh position={[0.3, 0.004, 0.25]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.01, wet), Math.max(0.01, wet), 1]}><circleGeometry args={[0.32, 40]} />{M.water({ col: "#7a6a52", op: 0.7 })}</mesh>
    </>;
  }}</U3>;
};

// ---- MuroCapas · «Se armaba un cajón de tablas… con un pisón… una capa»: el encofrado de tablas; cada palada cae, el pisón la aplasta y
// queda una franja; el muro sube contra una regla de madera marcada cada 10 cm ----
export const MuroCapas3D: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cajon", 0.3), aP = sec(p, "pison", 2.5), D = d / 30, per = Math.max(1.0, (D - aP - 1) / 7);
  return <U3 d={d} bg={p.bg} ground={[160, 132, 96]} mode="split" key1={[-1.4, 2.6, 1.4]}
    cam={{ at: [0, 0.3, 0], az: [-0.5, -0.25], el: [0.62, 0.5], r: [2.6, 2.2], fov: 32 }}>{(tt) => {
    const box = cl(phys(tt, aC, 7, 0.45)), n = tt < aP ? 0 : Math.floor((tt - aP) / per) + 1, ph = tt < aP ? 0 : ((tt - aP) % per) / per, L = 0.07;
    const top = Math.min(n, 8) * L, ram = ph < 0.35 ? 0.03 + eio(ph, 0, 0.35) * 0.32 : ph < 0.5 ? 0.35 - eio(ph, 0.35, 0.5) * 0.32 : 0.03, cur = n > 0 ? cl((ph - 0.05) / 0.3) : 0;
    return <>
      {/* el cajón: dos tablones laterales que se cierran */}
      {[-0.24, 0.24].map((z, i) => <RBox key={i} s={[1.3, i ? 0.16 : 0.62, 0.035]} r={0.008} p={[0, i ? 0.08 : 0.31, z + (1 - box) * (i ? 0.5 : -0.5)]}>{M.wood({ base: [146, 104, 62], rx: 3 })}</RBox>)}
      {/* las capas ya apisonadas, cada una de un tono */}
      {Array.from({ length: Math.min(n, 8) }, (_, i) => { const last = i === Math.min(n, 8) - 1, h = last ? lerp(L * 1.6, L, cl((ph - 0.42) / 0.1)) : L;
        return <RBox key={i} s={[1.24, h, 0.44]} r={0.004} p={[0, i * L + h / 2, 0]}><meshStandardMaterial map={dirtT([170 - 10 * (i % 3), 128 - 6 * (i % 2), 86])} roughness={1} /></RBox>; })}
      {/* el pisón */}
      <group position={[0.1 + 0.2 * Math.sin(n * 2.1), top + ram, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow><cylinderGeometry args={[0.08, 0.09, 0.08, 24]} /><meshStandardMaterial map={dirtT([120, 116, 110])} roughness={0.85} /></mesh>
        <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.85, 12]} /><meshStandardMaterial map={tex.wood(1, 2, [150, 108, 64])} roughness={0.75} /></mesh>
      </group>
      {cur > 0 && cur < 1 && <mesh position={[0.1 + 0.2 * Math.sin(n * 2.1), top + 0.01, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.1 + 0.15 * cur, 0.12 + 0.2 * cur, 32]} /><meshBasicMaterial color="#d9b48a" transparent opacity={0.5 * (1 - cur)} depthWrite={false} /></mesh>}
      {/* la regla de madera marcada cada 10 cm */}
      <group position={[-0.72, 0, 0.3]}>
        <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[0.04, 0.7, 0.02]} /><meshStandardMaterial map={tex.text("regla", 64, 512, (g) => { g.fillStyle = "#e3c890"; g.fillRect(0, 0, 64, 512); for (let i = 0; i <= 10; i++) { g.fillStyle = "#3a2410"; g.fillRect(0, 512 - i * 51, i % 2 ? 26 : 50, 5); } })} roughness={0.7} /></mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- RutaPostas · «Estaciones con caballos… saltas de tu caballo»: el camino de la estepa con las yurtas de posta; el caballo cansado
// llega a cada una y sigue uno fresco (otro pelaje); la cámara acompaña ----
export const RutaPostas3D: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "postas", 0.6), aS = sec(p, "salta", 3), D = d / 30, N = 4, gap = 1.6;
  return <U3 d={d} bg={p.bg} ground={[118, 128, 74]} mode="wipe" key1={[-1.6, 2.6, 1.6]}
    cam={{ at: [0.4, 0.3, 0], at1: [gap * (N - 1) - 0.4, 0.3, 0], az: [0.6, 0.4], el: [0.42, 0.36], r: [2.8, 2.5], fov: 34 }}>{(tt) => {
    const k = 0.55 * eio(tt, 0, D + 0.6) + 0.45 * cl(tt / (D + 0.6)), x = k * gap * (N - 1), leg = Math.min(N - 2, Math.floor(x / gap + 0.02)), stn = x - leg * gap;
    const cols = ["#6b4226", "#c9b08a", "#3a2a1e", "#d6d0c4"];
    return <>
      <mesh position={[gap * 1.5, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[gap * N + 2, 0.32]} /><meshStandardMaterial map={dirtT([150, 122, 86])} roughness={1} /></mesh>
      {Array.from({ length: N }, (_, i) => { const on = cl(phys(tt, aP + i * 0.25, 7, 0.45)); return <group key={i} position={[i * gap, 0, -0.95]} scale={[1, Math.max(0.001, on), 1]}>
        <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.24, 0.25, 0.26, 32]} /><meshStandardMaterial color="#e9e1cf" roughness={0.95} /></mesh>
        <mesh position={[0, 0.33, 0]} castShadow><coneGeometry args={[0.26, 0.16, 32]} /><meshStandardMaterial color="#d8cdb6" roughness={0.95} /></mesh>
        <mesh position={[0.0, 0.1, 0.245]}><planeGeometry args={[0.1, 0.16]} /><meshStandardMaterial color="#8a2f22" /></mesh>
        {/* el caballo fresco que espera atado (el que va a salir) */}
        {i > 0 && i - 1 > leg - 0 && <group position={[0.35, 0, 0.55]} rotation={[0, PI, 0]}><Horse tt={0} col={cols[i % 4]} gallop={0} s={0.9} /></group>}
      </group>; })}
      {/* el caballo de este tramo galopa; en cada posta lo releva otro pelaje */}
      <mesh position={[x, 0.004, 0.02]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 0.6, 1]}><circleGeometry args={[0.2, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.28} depthWrite={false} /></mesh>
      <group position={[x, 0, 0.02]}><Horse tt={tt} col={cols[(leg + 1) % 4]} gallop={1.1} s={0.9} />
        <group position={[-0.02, 0.33, 0]}><Stickman escala={0.12} rotY={90} guion={[{ t: 0, accion: "neutral", expr: "decidido" }]} semilla={4} /></group></group>
      {stn < 0.4 && leg > 0 && <group position={[leg * gap - 0.15, 0, -0.15]} rotation={[0, -0.6, 0]}><Horse tt={tt * 0.2} col={cols[leg % 4]} gallop={0.15} s={0.86} /></group>}
    </>;
  }}</U3>;
};

// ---- Odometro400 · «podían hacer cuatrocientos kilómetros… en un día»: el caballo galopa por la estepa; el sol cruza el cielo y las
// sombras giran; los rodillos de bronce cuentan los kilómetros ----
export const Odometro4003D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[120, 130, 76]} sky="#1d2733" mode="iris" key1={[0, 3, 0.4]} warm={0.5}
    cam={{ at: [0, 0.3, 0], az: [0.8, 0.5], el: [0.16, 0.12], r: [1.8, 1.6], fov: 34 }}
    over={(tt) => { const k = eio(tt, 0.4, D - 0.8); return <Drums v={400 * k} x={1240} y={150} s={1.5} unit="km" />; }}>{(tt) => {
    const k = eio(tt, 0.4, D - 0.8), a = -PI / 2 + PI * k, sx = Math.sin(a) * 4, sy = 0.4 + Math.cos(a) * 3;
    return <>
      <directionalLight position={[sx, Math.max(0.3, sy), -1.5]} intensity={2.4 * Math.sin(PI * k) + 0.3} color={k < 0.15 || k > 0.85 ? "#ffb070" : "#fff2dc"} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <mesh position={[sx * 0.8, sy * 0.8, -3.2]}><sphereGeometry args={[0.22, 32, 24]} />{M.glow({ col: k < 0.15 || k > 0.85 ? "#ffb070" : "#fff0c8" })}</mesh>
      {/* la estepa pasa: matas de pasto que corren hacia atrás */}
      {Array.from({ length: 40 }, (_, i) => { const x = ((rn(i, 1) * 8 - tt * 2.2) % 8 + 8) % 8 - 4; return <mesh key={i} position={[x, 0.03, (rn(i, 2) - 0.5) * 3]}><coneGeometry args={[0.04, 0.07 + 0.05 * rn(i, 3), 6]} /><meshStandardMaterial color="#5f7a3a" roughness={0.85} /></mesh>; })}
      <group position={[0, 0, 0]}><Horse tt={tt} col="#6b4226" gallop={1.3} />
        <group position={[-0.02, 0.33, 0]}><Stickman escala={0.085} rotY={90} guion={[{ t: 0, accion: "neutral", expr: "decidido" }]} semilla={6} /></group></group>
    </>;
  }}</U3>;
};

// ---- Fajado · «vendas… los órganos»: el torso de arcilla, translúcido: adentro, los órganos rebotan con cada trote; una venda se enrolla
// vuelta a vuelta desde abajo y, cuando cierra, los órganos quedan quietos ----
export const Fajado3D: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "vendas", 1.5), aO = sec(p, "organos", 3.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [0, 0.62, 0], az: [-0.35, 0.3], el: [0.06, 0.04], r: [1.6, 1.35], fov: 32 }}>{(tt) => {
    const wrap = eio(tt, aV, aV + 2.6), calm = 1 - wrap, trot = Math.sin(tt * 2 * PI * 2.2), b = 0.03 * calm * trot;
    const turns = 7, pts: number[][] = []; const nP = Math.max(2, Math.round(240 * wrap));
    for (let i = 0; i <= nP; i++) { const u = i / 240, a = u * turns * 2 * PI; pts.push([Math.cos(a) * 0.205, 0.38 + u * 0.42, Math.sin(a) * 0.205]); }
    return <>
      {/* el torso de arcilla, semitransparente */}
      <mesh geometry={latheG("torso", [[0.0, 0.3], [0.15, 0.31], [0.18, 0.4], [0.19, 0.55], [0.21, 0.7], [0.24, 0.8], [0.25, 0.86], [0.2, 0.92], [0.07, 0.95], [0.05, 1.02], [0.0, 1.02]], 48)} castShadow><meshPhysicalMaterial color="#efe8dc" roughness={0.4} transparent opacity={0.42} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.29, 0.84, 0]} rotation={[0, 0, sd * 0.25]} castShadow><capsuleGeometry args={[0.055, 0.12, 8, 16]} /><meshPhysicalMaterial color="#efe8dc" roughness={0.6} /></mesh>)}
      <mesh position={[0, 1.12, 0]} castShadow><sphereGeometry args={[0.1, 32, 24]} /><meshPhysicalMaterial color="#efe8dc" roughness={0.45} /></mesh>
      {/* los órganos: pulmones, corazón, hígado e intestino; rebotan con el trote hasta que la venda los sujeta */}
      {[[-0.08, 0.74, 0, 0.07, 0.12, "#c86a6e"], [0.08, 0.74, 0, 0.07, 0.12, "#c86a6e"], [0.02, 0.68, 0.04, 0.045, 0.05, "#a8202a"], [-0.03, 0.56, 0.02, 0.1, 0.05, "#7a3a24"], [0.0, 0.44, 0.02, 0.11, 0.06, "#d98e7a"]].map(([x, y, z, rx, ry, c], i) =>
        <mesh key={i} position={[x as number, (y as number) + b * (1 + i * 0.4) * (i % 2 ? 1 : -1), z as number]} scale={[rx as number, ry as number, 0.06]}><sphereGeometry args={[1, 24, 18]} /><meshStandardMaterial color={c as string} roughness={0.5} /></mesh>)}
      {/* la venda que se enrolla */}
      {wrap > 0.01 && <mesh geometry={tubeG("venda" + nP, pts, 0.03, Math.max(8, nP), 6)} castShadow><meshStandardMaterial color="#b8925a" roughness={0.85} /></mesh>}
    </>;
  }}</U3>;
};

// ---- SinRueda · «no tenían caballos, ni bueyes, ni mulas… ni la rueda… Tú»: cada animal entra al camino y se va; la rueda de madera
// llega rodando y se parte en rayos; queda el camino vacío y entra el cargador con el fardo ----
export const SinRueda3D: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "caballos", 0.8), aB = sec(p, "bueyes", 1.8), aM = sec(p, "mulas", 2.8), aR = sec(p, "rueda", 4), aT = sec(p, "tu", 6);
  return <U3 d={d} bg={p.bg} ground={[150, 118, 82]} mode="split" key1={[-1.6, 2.6, 1.4]}
    cam={{ at: [0, 0.42, 0], az: [0.25, -0.2], el: [0.2, 0.14], r: [3.1, 2.8], fov: 32 }}>{(tt) => {
    const anim = (a: number, nx: number, x0: number, col: string, ears = 0.04, horns = false) => { if (tt < a - 0.6) return null; const k = eio(tt, a - 0.6, a + 0.4), out = eio(tt, nx - 0.3, nx + 1.1);
      return <group position={[lerp(-2.4, x0, k) + 4 * out, 0, -0.1]}><Horse tt={tt} col={col} gallop={(k < 1 || (out > 0 && out < 1)) ? 0.8 : 0.05} ears={ears} horns={horns} s={1.5} />
        <group position={[0.05, 0.5, 0.2]} scale={Math.max(0.001, eio(tt, nx - 0.2, nx + 0.2))} rotation={[0, 0, 0]}>{[1, -1].map((sd) => <mesh key={sd} rotation={[0, 0, sd * PI / 4]}><boxGeometry args={[0.5, 0.05, 0.02]} /><meshStandardMaterial color="#c0281e" roughness={0.5} /></mesh>)}</group></group>; };
    const roll = eio(tt, aR - 0.2, aR + 0.7), brk = cl((tt - aR - 0.75) / 0.9);
    return <>
      {anim(aC, aB, -1.1, "#6b4226")}{anim(aB, aM, -0.1, "#3d3027", 0.03, true)}{anim(aM, aR, 0.9, "#5a5048", 0.11)}
      {/* la rueda: llega rodando y se desarma */}
      {tt > aR - 0.3 && <group position={[lerp(-1.6, 0.0, roll), 0.28, 0.5]} rotation={[0, 0, -roll * 6]}>
        <mesh position={[0, -brk * 0.05, 0]} rotation={[0, 0, brk * 0.6]}><torusGeometry args={[0.26, 0.03, 12, 48, PI * 2 * (1 - 0.4 * brk)]} /><meshStandardMaterial map={tex.wood(2, 1, [130, 90, 52])} roughness={0.8} /></mesh>
        {Array.from({ length: 8 }, (_, i) => { const a = i * PI / 4, f = brk * (0.3 + 0.7 * rn(i, 2)); return <mesh key={i} position={[Math.cos(a) * 0.13 + Math.cos(a) * f * 0.6, Math.sin(a) * 0.13 - f * f * 0.5, f * 0.2 * (rn(i, 3) - 0.5)]} rotation={[0, 0, a + PI / 2 + f * 3]}><cylinderGeometry args={[0.012, 0.012, 0.25, 8]} /><meshStandardMaterial map={tex.wood(1, 1, [130, 90, 52])} roughness={0.8} /></mesh>; })}
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.08, 16]} /><meshStandardMaterial map={tex.wood(1, 1, [110, 76, 44])} /></mesh>
      </group>}
      {/* «Tú»: entra el cargador con el fardo a la espalda */}
      {tt > aT - 1.2 && <group position={[lerp(-1.6, -0.2, eio(tt, aT - 1.2, aT + 0.4)), 0, 0.3]}>
        <Stickman escala={0.2} rotY={90} guion={[{ t: 0, accion: "cargar_caja", expr: "decidido" }]} semilla={5} contacto={0.5} colorContacto="#2a1a10" />
        <RBox s={[0.2, 0.26, 0.2]} r={0.03} p={[-0.16, 0.62, 0]}><meshStandardMaterial map={tex.wood(1, 1, [176, 140, 92])} roughness={0.9} /></RBox>
      </group>}
    </>;
  }}</U3>;
};

// ---- MecapalVector · «mecapal… lo lleva tu cuello… veintitrés kilos… veinticinco kilómetros»: el cargador de perfil con la canasta;
// la banda de cuero cruza la frente y se tensa; en «el cuello» se enciende un aro de esfuerzo; caen piedras a la canasta y pasan los mojones ----
export const MecapalVector3D: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mecapal", 0.8), aC = sec(p, "cuello", 2.5), aK = sec(p, "kilos", 4), aKm = sec(p, "km", 6);
  return <U3 d={d} bg={p.bg} ground={[150, 118, 82]} mode="drop" key1={[-1.4, 2.6, 1.6]}
    cam={{ at: [-0.05, 0.55, 0], az: [0.35, 0.6], el: [0.14, 0.1], r: [2.5, 2.2], fov: 32 }}>{(tt) => {
    const band = eio(tt, aM, aM + 0.8), neck = eio(tt, aC - 0.1, aC + 0.4), stones = Math.min(6, Math.floor(cl((tt - aK) / 1.6) * 7)), walk = tt > aKm ? (tt - aKm) * 0.5 : 0;
    const pulse = 0.5 + 0.5 * Math.sin(tt * 2 * PI * 1.2);
    return <>
      <group position={[0, 0, 0]}>
        <Stickman escala={0.3} rotY={90} guion={[{ t: 0, accion: "cargar_caja", expr: tt > aK ? "nervioso" : "neutral" }]} semilla={9} contacto={0.6} colorContacto="#2a1a10" />
        {/* la canasta de varas a la espalda */}
        <group position={[-0.2, 0.62, 0]}>
          <mesh castShadow geometry={latheG("canasta", [[0, -0.16], [0.12, -0.16], [0.15, 0.1], [0.16, 0.16], [0.155, 0.16]], 24)}><meshStandardMaterial map={tex.text("cesto", 128, 128, (g) => { g.fillStyle = "#b08a52"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 128; i += 8) { g.fillStyle = "rgba(90,60,25,.35)"; g.fillRect(i, 0, 3, 128); g.fillRect(0, i + 4, 128, 2); } })} roughness={0.9} side={THREE.DoubleSide} /></mesh>
          {Array.from({ length: stones }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.12, 0.13 + i * 0.035 + fallY(tt, aK + i * 0.25, 0.5), (rn(i, 2) - 0.5) * 0.12]} castShadow><dodecahedronGeometry args={[0.05, 0]} /><meshStandardMaterial color="#8a8680" roughness={0.9} /></mesh>)}
        </group>
        {/* el mecapal: de la canasta a la frente */}
        <mesh geometry={tubeG("mecapal" + Math.round(band * 20), [[-0.2, 0.74, 0.14], [-0.08, 0.88, 0.13], [0.04, 0.98, 0.12 * band + 0.02], [0.09, 1.0, 0.0], [0.04, 0.98, -0.12 * band - 0.02], [-0.08, 0.88, -0.13], [-0.2, 0.74, -0.14]], 0.034, 60, 8)} castShadow><meshStandardMaterial color="#6a3c1a" roughness={0.6} /></mesh>
      </group>
      {/* los mojones del camino que pasan */}
    </>;
  }}</U3>;
};
