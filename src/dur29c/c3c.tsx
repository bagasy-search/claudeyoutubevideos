// dur29c · bloque C (Pittsburgh, Chicago, Calcuta y el cierre): el humo del mediodía, la bola de hierro, el agua tibia, la línea de
// ganchos, la línea al revés, corazón/estómago, el hombre más rápido, la última ciudad, el rickshaw en equilibrio, la postal sostenida
// y las ocho herramientas.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { Lantern, PI, Postal, sm } from "./c3k";

type UP = { d: number; p: any };
const IMG = (id: string) => `img/dur29c/ag/dur29c_${id}.png`;

// rickshaw: caja con capota, dos ruedas altas y dos varas largas
const Rickshaw: React.FC<{ tilt?: number; wheel?: number; s?: number }> = ({ tilt = 0, wheel = 0, s = 1 }) =>
  <group scale={sm(s)}><group rotation={[0, 0, tilt]}>
    <RBox s={[0.24, 0.16, 0.28]} r={0.02} p={[0, 0.3, 0]}><meshStandardMaterial color="#2a2a2e" roughness={0.6} /></RBox>
    <mesh position={[-0.04, 0.45, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.3, 20, 1, true, 0, PI]} /><meshStandardMaterial color="#1a1a1c" side={THREE.DoubleSide} roughness={0.8} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0.42, 0.3, k * 0.12]} rotation={[0, 0, PI / 2 - 0.08]}><cylinderGeometry args={[0.01, 0.012, 0.6, 8]} />{M.wood({ base: [110, 80, 46] })}</mesh>)}
  </group>
    {[-1, 1].map((k) => <group key={k} position={[0, 0.25, k * 0.17]} rotation={[0, 0, -wheel]}><mesh><torusGeometry args={[0.24, 0.012, 8, 36]} /><meshStandardMaterial color="#1a1612" /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} rotation={[0, 0, (i * PI) / 10]}><boxGeometry args={[0.48, 0.006, 0.006]} />{M.wood({ base: [120, 90, 56] })}</mesh>)}</group>)}
  </group>;

// ---- HumoMediodia · la ciudad en maqueta con un reloj enorme: las agujas van a las 12, el sol arriba, y el humo de las chimeneas va
// tapando todo; en «mediodia» los faroles de la calle se prenden de a uno ----
const HumoMediodia: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mediodia", 2.0);
  return <U3 d={d} bg={p.bg} ground={[60, 54, 48]} mode="wipe" sky="#2a2622" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.4, 0], az: [-0.2, -0.05], el: [0.12, 0.1], r: [2.1, 1.9], fov: 36 }}>{(tt) => {
    const smoke = eio(tt, 0, aM + 0.5);
    return <>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-1.0 + i * 0.25, 0, -0.3 - (i % 2) * 0.15]}>
        <RBox s={[0.2, 0.18 + rn(i, 1) * 0.15, 0.18]} r={0.01} p={[0, 0.12, 0]}><meshStandardMaterial map={dirtT([90, 70, 60])} /></RBox>
        <mesh position={[0.04, 0.42, 0]}><cylinderGeometry args={[0.02, 0.025, 0.3, 8]} /><meshStandardMaterial color="#3a2e28" /></mesh>
        {Array.from({ length: 4 }, (_, j) => { const ph = (tt * 0.25 + j / 4) % 1; return <mesh key={j} position={[0.04 + ph * 0.3, 0.6 + ph * 0.5, 0]}><sphereGeometry args={[0.06 + ph * 0.14, 10, 8]} /><meshStandardMaterial color="#1e1a18" transparent opacity={0.55 * (1 - ph * 0.6) * (0.3 + 0.7 * smoke)} depthWrite={false} /></mesh>; })}
      </group>)}
      <mesh position={[0.8, 1.15, -0.8]}><sphereGeometry args={[0.12, 20, 14]} />{M.glow({ col: "#fff0c0", op: 1 - 0.85 * smoke })}</mesh>
      <group position={[0, 0.62, 0.15]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.03, 40]} />{M.brass({ col: "#b88a3a" })}</mesh>
        <mesh position={[0, 0, 0.017]}><circleGeometry args={[0.18, 40]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.155, Math.cos(i * PI / 6) * 0.155, 0.02]}><boxGeometry args={[0.008, 0.02, 0.003]} /><meshBasicMaterial color="#2a1a10" /></mesh>)}
        <mesh position={[0, 0, 0.022]} rotation={[0, 0, -lerp(PI * 1.5, 2 * PI, eio(tt, 0, aM))]}><group /><boxGeometry args={[0.008, 0.11, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
        <mesh position={[0, 0, 0.024]} rotation={[0, 0, -lerp(0, 2 * PI, eio(tt, 0, aM)) * 3]}><boxGeometry args={[0.005, 0.15, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
      </group>
      {Array.from({ length: 6 }, (_, i) => { const on = eio(tt, aM + i * 0.25, aM + i * 0.25 + 0.3); return <group key={"l" + i} position={[-0.9 + i * 0.36, 0, 0.45]}>
        <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.006, 0.008, 0.3, 6]} />{M.steel({ col: "#2a2826" })}</mesh>
        <mesh position={[0, 0.31, 0]}><boxGeometry args={[0.03, 0.04, 0.03]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb050" emissiveIntensity={2 * on} /></mesh>
        <pointLight position={[0, 0.31, 0.05]} intensity={0.8 * on} distance={0.6} color="#ffc070" /></group>; })}
    </>;
  }}</U3>;
};

// ---- BolaHierro · la puerta del horno de pudelar abierta: la barra revuelve el hierro fundido y la bola esponjosa crece pegada a la
// barra; en «cincuenta» sale por la puerta colgando y la balanza de abajo marca 50 kg ----
const BolaHierro: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cincuenta", 2.5);
  return <U3 over={(tt) => <Drums v={50 * eio(tt, aC + 0.6, aC + 1.4)} n={2} x={1450} y={120} s={1.1} unit="kg" op={eio(tt, aC, aC + 0.3)} />} d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#120a06" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0.1, 0.35, 0], az: [-0.45, -0.25], el: [0.12, 0.1], r: [1.5, 1.3], fov: 34 }}>{(tt) => {
    const grow = eio(tt, 0, aC), out = eio(tt, aC, aC + 0.9), stir = Math.sin(tt * 2.4) * 0.08 * (1 - out);
    return <>
      <RBox s={[0.8, 0.6, 0.5]} r={0.03} p={[-0.25, 0.3, -0.25]}><meshStandardMaterial map={dirtT([70, 50, 40])} roughness={0.95} /></RBox>
      <mesh position={[-0.25, 0.3, 0.005]}><planeGeometry args={[0.26, 0.2]} />{M.glow({ col: "#ff9a30" })}</mesh>
      <pointLight position={[-0.25, 0.3, 0.2]} intensity={4} distance={2} color="#ff8a30" />
      <group position={[lerp(-0.2, 0.25, out), 0.3 + 0.02 * Math.sin(tt * 3), lerp(-0.05, 0.25, out)]} rotation={[0, stir, -0.1 + 0.2 * out]}>
        <mesh position={[0.4, 0.05, 0]} rotation={[0, 0, PI / 2 - 0.1]}><cylinderGeometry args={[0.012, 0.012, 0.8, 10]} />{M.steel({ col: "#4a4644" })}</mesh>
        <mesh position={[0, 0, 0]} scale={sm(0.3 + 0.7 * grow)}><icosahedronGeometry args={[0.1, 2]} /><meshStandardMaterial color="#ffb060" emissive="#ff6010" emissiveIntensity={1.4 - 0.6 * out} roughness={0.85} flatShading /></mesh>
      </group>
      <group position={[0.25, 0, 0.25]}>
        <RBox s={[0.3, 0.05, 0.3]} r={0.01} p={[0, 0.025, 0]}>{M.steel({ col: "#5a5e62" })}</RBox>
      </group>
    </>;
  }}</U3>;
};

// ---- AguaTibia · dos jarros sobre el banco frente al horno: en «helada» el del hielo (con escarcha) se ilumina en azul y un rayo de
// frío baja por la silueta que se dobla; en «tibia» el jarro de avena con agua tibia se ilumina cálido y la silueta se endereza ----
const AguaTibia: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "helada", 1.2), aT = sec(p, "tibia", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#140c08" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0, 0.3, 0], az: [-0.15, 0.08], el: [0.12, 0.1], r: [1.35, 1.2], fov: 34 }}>{(tt) => {
    const cold = eio(tt, aH, aH + 0.5) * (1 - eio(tt, aT, aT + 0.5)), warm = eio(tt, aT, aT + 0.5);
    const jar = (x: number, col: string, k: string, on: number, glow: string) => <group key={k} position={[x, 0, 0.1]}>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.07, 0.06, 0.22, 24, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.064, 0.056, 0.17, 24]} /><meshStandardMaterial color={col} transparent opacity={0.75} emissive={glow} emissiveIntensity={on} /></mesh>
      <pointLight position={[0, 0.2, 0.1]} intensity={1.6 * on} distance={0.8} color={glow} /></group>;
    return <>
      {jar(-0.32, "#c8e4f4", "f", cold, "#60a8ff")}
      {jar(-0.12, "#d8c49a", "w", warm, "#ffa850")}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.32 + (rn(i, 1) - 0.5) * 0.08, 0.18 + rn(i, 2) * 0.05, 0.1]}><boxGeometry args={[0.03, 0.03, 0.03]} /><meshPhysicalMaterial color="#e8f6ff" transparent opacity={0.6} roughness={0.1} /></mesh>)}
      <group position={[0.35, 0, 0.05]} rotation={[0, 0, -0.5 * cold]}><Stickman escala={0.11} rotY={-30} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aH + 0.3, accion: "asustarse", expr: "asustado" }, { t: aT + 0.3, accion: "idle", expr: "feliz" as any }]} semilla={52} contacto={0} color="#8a7a6a" /></group>
      <mesh position={[0.35, 0.25, 0.08]} scale={[1, sm(cold), 1]}><cylinderGeometry args={[0.012, 0.012, 0.35, 8]} /><meshBasicMaterial color="#9ad0ff" transparent opacity={0.7 * cold} toneMapped={false} /></mesh>
    </>;
  }}</U3>;
};

// ---- LineaGanchos · el riel del techo con decenas de ganchos que avanzan; cada uno pasa frente a un obrero y en «corte» cada obrero
// hace un solo movimiento; en «cientos» el contador de ganchos por hora gira rápido ----
const LineaGanchos: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corte", 1.5), aX = sec(p, "cientos", 3.0);
  return <U3 over={(tt) => <Drums v={Math.floor(lerp(40, 400, eio(tt, aX, aX + 1.5)))} n={3} x={1350} y={110} s={1.0} unit="/h" op={eio(tt, aX - 0.2, aX + 0.2)} />} d={d} bg={p.bg} ground={null} floor="tile" mode="wipe" sky="#1a1c1e" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.5, 0], az: [-0.55, -0.35], el: [0.12, 0.1], r: [1.9, 1.7], fov: 34 }}>{(tt) => {
    const mv = tt * 0.22 * (1 + eio(tt, aX, aX + 1));
    return <>
      <mesh position={[0, 1.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.015, 0.015, 3.2, 10]} />{M.steel({ col: "#6a6e72" })}</mesh>
      {Array.from({ length: 16 }, (_, i) => { const x = ((i * 0.2 + mv) % 3.2) - 1.6; return <group key={i} position={[x, 0.98, 0]}>
        <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />{M.steel({ col: "#8a8e92" })}</mesh>
        <mesh position={[0, -0.18, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.025, 0.004, 6, 16, PI * 1.4]} />{M.steel({ col: "#8a8e92" })}</mesh>
        <mesh position={[0, -0.32, 0]} scale={[0.8, 1.3, 0.6]}><sphereGeometry args={[0.08, 12, 10]} /><meshStandardMaterial color="#b85a4a" roughness={0.6} /></mesh></group>; })}
      {[-0.75, -0.25, 0.25, 0.75].map((x, i) => <group key={i} position={[x, 0, 0.32]}><Stickman escala={0.1} rotY={180} guion={[{ t: 0, accion: "idle", expr: "cansado" as any }, { t: aC + i * 0.15, accion: "senalar", expr: "decidido" }]} semilla={60 + i} contacto={0} color="#e8e4dc" />
        <mesh position={[0.05, 0.42, -0.1]} rotation={[0.4 * Math.sin(tt * 4 + i) * cl(tt - aC), 0, 0]}><boxGeometry args={[0.012, 0.012, 0.12]} />{M.chrome()}</mesh></group>)}
    </>;
  }}</U3>;
};

// ---- LineaReves · dos cintas lado a lado: arriba (Chicago) un bulto entra entero y salen piezas que se separan; abajo (Ford) piezas
// sueltas entran y sale un auto armado; en «reves» la cámara pasa de una a la otra, en «desarmaba» las piezas de arriba se abren ----
const LineaReves: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "reves", 1.5), aD = sec(p, "desarmaba", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#14161a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.45, 0], at1: [0, 0.25, 0], az: [-0.3, -0.1], el: [0.26, 0.22], r: [1.9, 1.75], fov: 36 }}>{(tt) => {
    const u = cl(tt / 6), op = eio(tt, aD, aD + 1.0);
    const belt = (y: number, k: string) => <group key={k} position={[0, y, 0]}><RBox s={[2.4, 0.04, 0.3]} r={0.01}><meshStandardMaterial color="#2a2c2e" roughness={0.7} /></RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-1.1 + i * 0.2, -0.04, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3, 10]} />{M.steel()}</mesh>)}</group>;
    return <>
      {belt(0.6, "a")}{belt(0.1, "b")}
      {/* arriba: entra entero, salen partes */}
      <mesh position={[lerp(-1.0, -0.2, u), 0.7, 0]} scale={[1.4, 0.8, 0.8]} visible={u < 0.6}><sphereGeometry args={[0.08, 14, 10]} /><meshStandardMaterial color="#b85a4a" /></mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.0 + i * 0.18 * (0.4 + op), 0.68 + 0.04 * Math.sin(i), (i - 2) * 0.05 * op]} scale={sm(u > 0.5 ? 1 : 0)}><boxGeometry args={[0.06, 0.05, 0.06]} /><meshStandardMaterial color={["#b85a4a", "#c87a5a", "#e8d8c0", "#a84a3a", "#d8a080"][i]} /></mesh>)}
      {/* abajo: entran partes, sale el auto */}
      {Array.from({ length: 5 }, (_, i) => <mesh key={"p" + i} position={[-1.0 + i * 0.16 + u * 0.7, 0.18, (i - 2) * 0.04 * (1 - u)]} visible={u < 0.7}><boxGeometry args={[0.06, 0.05, 0.06]} />{M.steel({ col: ["#1a1a1a", "#3a3a3a", "#c8c8c8", "#1a1a1a", "#2a2a2a"][i] })}</mesh>)}
      <group position={[lerp(0.2, 0.8, cl((u - 0.6) / 0.4)), 0.17, 0]} scale={sm(cl((u - 0.6) * 5))}>
        <RBox s={[0.26, 0.07, 0.13]} r={0.02} p={[0, 0.05, 0]}><meshStandardMaterial color="#141414" metalness={0.4} roughness={0.3} /></RBox>
        <RBox s={[0.14, 0.07, 0.12]} r={0.02} p={[-0.02, 0.11, 0]}><meshStandardMaterial color="#141414" metalness={0.4} roughness={0.3} /></RBox>
        {[[-0.08, -1], [0.08, -1], [-0.08, 1], [0.08, 1]].map(([x, z], i) => <mesh key={i} position={[x, 0.02, z * 0.065]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 14]} /><meshStandardMaterial color="#0a0a0a" /></mesh>)}
      </group>
      <spotLight position={[0, 1.6, 0.8]} angle={0.5} penumbra={0.6} intensity={6 + 3 * eio(tt, aR, aR + 0.5)} distance={4} color="#fff0e0" />
    </>;
  }}</U3>;
};

// ---- CorazonEstomago · el libro abierto con una flecha que vuela hacia el corazón (rojo, latiendo) pero en «estomago» se curva y da en
// la lata de carne; la lata se abre y salen moscas ----
const CorazonEstomago: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corazon", 1.2), aE = sec(p, "estomago", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#120e0c" key1={[-0.8, 2.4, 1.5]}
    cam={{ at: [0.1, 0.3, 0], az: [-0.12, 0.06], el: [0.14, 0.12], r: [1.6, 1.45], fov: 34 }}>{(tt) => {
    const fly = eio(tt, aC, aE + 0.3), bend = eio(tt, aE - 0.4, aE + 0.3), hit = eio(tt, aE + 0.3, aE + 0.6);
    const x = lerp(-0.55, 0.45, fly), y = 0.45 + Math.sin(fly * PI) * 0.15 - bend * 0.3 * fly, z = 0.05;
    return <>
      <group position={[-0.6, 0.02, 0.1]}>{[-1, 1].map((k) => <mesh key={k} position={[k * 0.12, 0.02, 0]} rotation={[-PI / 2, k * 0.12, 0]}><planeGeometry args={[0.24, 0.32]} /><meshStandardMaterial map={tex.paper()} side={THREE.DoubleSide} /></mesh>)}</group>
      <group position={[0.45, 0.62, -0.1]} scale={sm(1 + 0.08 * Math.sin(tt * 2 * PI * 1.2))}>
        {[-1, 1].map((k) => <mesh key={k} position={[k * 0.045, 0.02, 0]}><sphereGeometry args={[0.065, 16, 12]} /><meshStandardMaterial color="#c8202a" emissive="#801010" emissiveIntensity={0.4} /></mesh>)}
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.09, 0.09, 0.09]} /><meshStandardMaterial color="#c8202a" emissive="#801010" emissiveIntensity={0.4} /></mesh>
      </group>
      <group position={[0.45, 0.0, 0.1]}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.08, 0.08, 0.16, 24]} />{M.steel({ col: "#b8b0a0" })}</mesh>
        <mesh position={[0, 0.16 + 0.04 * hit, 0]} rotation={[-1.2 * hit, 0, 0]}><cylinderGeometry args={[0.081, 0.081, 0.01, 24]} />{M.steel({ col: "#c8c0b0" })}</mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.sin(tt * 3 + i) * 0.12 * hit, 0.2 + rn(i, 1) * 0.2 * hit, Math.cos(tt * 2.5 + i) * 0.1 * hit]} visible={hit > 0.1}><sphereGeometry args={[0.008, 6, 6]} /><meshStandardMaterial color="#141414" /></mesh>)}
      </group>
      <group position={[x, y, z]} rotation={[0, 0, -0.3 * Math.cos(fly * PI) - bend * 0.9]} visible={tt > aC - 0.1}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />{M.wood({ base: [120, 90, 56] })}</mesh>
        <mesh position={[0.16, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.018, 0.05, 8]} />{M.steel()}</mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- HombreMasRapido · la calle de Calcuta en 1900 de costado: un tranvía, un carro de bueyes y el tirador de rickshaw corriendo;
// en «corriendo» el rickshaw pasa a los otros dos ----
const HombreMasRapido: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corriendo", 2.0);
  return <U3 d={d} bg={p.bg} ground={[150, 120, 90]} mode="wipe" sky="#3a3026" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.1, 0.0], el: [0.14, 0.12], r: [2.2, 2.0], fov: 36 }}>{(tt) => {
    const slow = tt * 0.12, fast = tt * 0.12 + 0.35 * Math.max(0, tt - aC);
    return <>
      <group position={[-1.2 + slow, 0, -0.45]}><RBox s={[0.6, 0.3, 0.25]} r={0.03} p={[0, 0.25, 0]}><meshStandardMaterial color="#6a4a2a" /></RBox>
        {[-0.2, 0.2].map((x, i) => <mesh key={i} position={[x, 0.07, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.27, 14]} /><meshStandardMaterial color="#1a1a1a" /></mesh>)}</group>
      <group position={[-1.0 + slow * 0.8, 0, 0.0]}><RBox s={[0.3, 0.12, 0.2]} r={0.01} p={[0, 0.2, 0]}>{M.wood({ base: [110, 80, 50] })}</RBox>
        <mesh position={[0.32, 0.18, 0]} scale={[1.6, 0.9, 0.7]}><sphereGeometry args={[0.08, 12, 10]} /><meshStandardMaterial color="#d8d0c0" /></mesh></group>
      <group position={[-1.3 + fast, 0, 0.38]}><Rickshaw wheel={fast * 4} s={0.8} />
        <group position={[0.42, 0, 0]}><Stickman escala={0.09} rotY={90} guion={[{ t: 0, accion: "correr", expr: "decidido" }]} semilla={70} contacto={0} color="#5a4030" /></group></group>
    </>;
  }}</U3>;
};

// ---- UltimaCiudad · el globo terráqueo gira y una a una se apagan las luces de las ciudades con rickshaw de tiro a mano; en «ultima» queda
// una sola encendida (Calcuta); en «hoy» la cámara se acerca y la luz late ----
const UltimaCiudad: React.FC<UP> = ({ d, p }) => {
  const aU = sec(p, "ultima", 2.0), aH = sec(p, "hoy", 3.5);
  const cities = [[35.7, 139.7], [31.2, 121.5], [1.3, 103.8], [13.7, 100.5], [-26.2, 28.0], [19.1, 72.9], [28.6, 77.2], [22.57, 88.36]];
  return <U3 d={d} bg={p.bg} ground={null} floor="none" mode="drop" sky="#06080c" key1={[-1, 1.6, 1.8]}
    cam={{ at: [0, 0.5, 0], az: [0.1, 0.1], el: [0.2, 0.25], r: [1.9, 1.3 - 0.2 * eio(0, 0, 1)], fov: 34 }}>{(tt) => {
    const rot = -1.4 - 0.25 * eio(tt, 0, aU + 1);
    return <group position={[0, 0.5, 0]} rotation={[0.3, rot, 0]}>
      <mesh><sphereGeometry args={[0.42, 48, 32]} /><meshStandardMaterial color="#1c3a52" roughness={0.7} /></mesh>
      {cities.map(([la, lo], i) => { const last = i === cities.length - 1, off = last ? 0 : eio(tt, 0.3 + i * (aU - 0.3) / 7, 0.5 + i * (aU - 0.3) / 7), phi = (90 - la) * PI / 180, th = (lo + 180) * PI / 180;
        const pos = [-0.425 * Math.sin(phi) * Math.cos(th), 0.425 * Math.cos(phi), 0.425 * Math.sin(phi) * Math.sin(th)];
        return <mesh key={i} position={pos as any} scale={sm(last ? 1 + 0.4 * eio(tt, aH, aH + 0.3) * (0.5 + 0.5 * Math.sin(tt * 2 * PI * 1.0)) : 1 - off)}><sphereGeometry args={[0.02, 10, 8]} />{M.glow({ col: last ? "#ffcf6a" : "#ffe0a0" })}</mesh>; })}
    </group>;
  }}</U3>;
};

// ---- RickshawPalanca · el rickshaw de costado como una balanza: el tirador baja las varas y el peso queda justo sobre el eje; en
// «equilibrio» aparece la línea de equilibrio sobre la rueda; en «campana» la campanita de bronce suena contra la vara ----
const RickshawPalanca: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "equilibrio", 1.5), aC = sec(p, "campana", 3.5);
  return <U3 d={d} bg={p.bg} ground={[120, 100, 80]} mode="wipe" sky="#2a2620" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0.15, 0.35, 0], az: [-0.05, 0.08], el: [0.1, 0.08], r: [1.5, 1.35], fov: 34 }}>{(tt) => {
    const tilt = lerp(0.35, 0.0, eio(tt, 0.3, aE)) + 0.02 * Math.sin(tt * 2), ring = tt > aC ? Math.sin((tt - aC) * 30) * Math.exp(-(tt - aC) * 2) : 0;
    return <>
      <Rickshaw tilt={tilt} />
      <group position={[0.68, 0, 0]}><Stickman escala={0.11} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={72} contacto={0} color="#5a4030" /></group>
      <mesh position={[0, 0.25 + 0.4, 0.18]} scale={[1, sm(eio(tt, aE, aE + 0.5)), 1]}><boxGeometry args={[0.006, 0.8, 0.006]} /><meshBasicMaterial color="#ffd060" toneMapped={false} /></mesh>
      <mesh position={[0, 0.25, 0.2]} scale={sm(eio(tt, aE, aE + 0.5))}><circleGeometry args={[0.025, 20]} /><meshBasicMaterial color="#ffd060" toneMapped={false} /></mesh>
      <group position={[0.55, 0.36 - tilt * 0.3, 0.13]} rotation={[0, 0, ring * 0.6]}>
        <mesh position={[0, -0.03, 0]}><sphereGeometry args={[0.025, 14, 10, 0, 2 * PI, 0, PI / 2]} />{M.brass({ col: "#d8a84a" })}</mesh></group>
      {[0, 1, 2].map((i) => { const ph = tt > aC ? ((tt - aC) * 0.8 + i / 3) % 1 : 0; return <mesh key={i} position={[0.55, 0.34, 0.13]} visible={tt > aC} scale={sm(0.05 + ph * 0.3)}><ringGeometry args={[0.9, 1, 32]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.5 * (1 - ph)} depthWrite={false} side={THREE.DoubleSide} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- PostalSostenida · la postal grande de la ciudad (foto) parada sobre la mesa; en «debajo» la cámara baja y se ve que la sostienen
// ocho figuritas de obreros con los brazos arriba ----
const PostalSostenida: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "debajo", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#120e0c" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.5, 0], at1: [0, 0.22, 0], az: [-0.1, 0.12], el: [0.15, -0.02], r: [1.6, 1.3], fov: 34 }}>{(tt) => <>
      <Postal src={IMG("f04_brooklyn_s1")} p={[0, 0.48, 0]} rot={[-PI / 2 + 0.02, 0, 0]} w={1.1} />
      {Array.from({ length: 8 }, (_, i) => { const x = -0.42 + (i % 4) * 0.28, z = i < 4 ? -0.15 : 0.15; return <group key={i} position={[x, 0, z]}>
        <Stickman escala={0.1} rotY={rn(i, 1) * 60 - 30} guion={[{ t: 0, accion: "festejar", expr: "decidido" }]} semilla={80 + i} contacto={0} color="#7a6a5a" /></group>; })}
      <spotLight position={[0, 1.8, 1.0]} angle={0.5} penumbra={0.6} intensity={6} distance={4} color="#fff0d8" />
      <pointLight position={[0, 0.2, 0.6]} intensity={1.8 * eio(tt, aD, aD + 0.8)} distance={1.5} color="#ffc070" />
    </>}</U3>;
};

// ---- OchoHerramientas · las ocho herramientas en fila sobre el piso de madera, cada una se ilumina con su ciudad: palo con gancho,
// pala, matoi, caña de vidrio, pico, barra, cuchillo, campanita ----
const OchoHerramientas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30;
  const tool = (i: number) => i === 0 ? <><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />{M.wood({ base: [110, 80, 46] })}</mesh><mesh position={[0.25, 0, 0]}><boxGeometry args={[0.03, 0.06, 0.01]} />{M.steel()}</mesh></>
    : i === 1 ? <><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.4, 8]} />{M.wood({ base: [110, 80, 46] })}</mesh><mesh position={[0.24, 0, 0]}><boxGeometry args={[0.1, 0.008, 0.07]} />{M.steel()}</mesh></>
    : i === 2 ? <><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.007, 0.45, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh><mesh position={[0.25, 0, 0]}><sphereGeometry args={[0.04, 12, 10]} /><meshStandardMaterial color="#f2eee4" /></mesh></>
    : i === 3 ? <><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.007, 0.45, 8]} />{M.steel({ col: "#6a6660" })}</mesh><mesh position={[0.24, 0, 0]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#ffb050" emissive="#ff6a10" emissiveIntensity={0.8} /></mesh></>
    : i === 4 ? <><mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.35, 8]} />{M.wood({ base: [110, 80, 46] })}</mesh><mesh position={[0.18, 0, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.02, 0.016, 0.16]} />{M.steel()}</mesh></>
    : i === 5 ? <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />{M.steel({ col: "#3a3634" })}</mesh>
    : i === 6 ? <><mesh><boxGeometry args={[0.16, 0.004, 0.03]} />{M.chrome()}</mesh><mesh position={[-0.11, 0, 0]}><boxGeometry args={[0.07, 0.016, 0.025]} />{M.wood({ base: [60, 40, 24] })}</mesh></>
    : <mesh><sphereGeometry args={[0.03, 14, 10, 0, 2 * PI, 0, PI / 2]} />{M.brass({ col: "#d8a84a" })}</mesh>;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.05, 0], az: [-0.25, 0.25], el: [0.65, 0.55], r: [1.6, 1.4], fov: 36 }}>{(tt) => <>
      {Array.from({ length: 8 }, (_, i) => { const a = 0.2 + i * Math.max(0.3, (D - 1.5) / 9), on = eio(tt, a, a + 0.4); return <group key={i} position={[-0.1, 0.02 + 0.03 * pop(tt, a), -0.56 + i * 0.16]} scale={pop(tt, a)}>
        {tool(i)}<pointLight position={[0, 0.2, 0]} intensity={0.9 * on} distance={0.45} color="#ffd8a0" /></group>; })}
    </>}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { HumoMediodia, BolaHierro, AguaTibia, LineaGanchos, LineaReves, CorazonEstomago, HombreMasRapido, UltimaCiudad, RickshawPalanca, PostalSostenida, OchoHerramientas };
