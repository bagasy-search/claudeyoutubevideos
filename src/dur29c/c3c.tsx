// dur29c · bloque C (Pittsburgh, Chicago, Calcuta y el cierre): el humo del mediodía, la bola de hierro en la balanza, el agua tibia,
// la línea de ganchos, la línea al revés, corazón/estómago, el hombre más rápido, la última ciudad, el rickshaw en equilibrio, la
// postal sostenida y las ocho herramientas.
// v2 (ev1): reloj grande, balanza de platillos, vasos con hielo y vapor, cintas con carne y auto claros, flecha grande, rickshaw vs
// caballo, mapa con alfileres dorados, fulcro bajo la rueda, herramientas de a una con su luz
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, Horse, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { PI, Postal, sm } from "./c3k";

type UP = { d: number; p: any };
const IMG = (id: string) => `img/dur29c/ag/dur29c_${id}.png`;

// rickshaw: caja con capota, dos ruedas altas y dos varas largas; load = pasajero y bulto
const Rickshaw: React.FC<{ tilt?: number; wheel?: number; s?: number; load?: boolean }> = ({ tilt = 0, wheel = 0, s = 1, load }) =>
  <group scale={sm(s)}><group rotation={[0, 0, tilt]}>
    <RBox s={[0.24, 0.16, 0.28]} r={0.02} p={[0, 0.3, 0]}><meshStandardMaterial color="#6a2a22" roughness={0.6} /></RBox>
    <mesh position={[-0.04, 0.45, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.3, 20, 1, true, 0, PI]} /><meshStandardMaterial color="#1a1a1c" side={THREE.DoubleSide} roughness={0.8} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0.42, 0.3, k * 0.12]} rotation={[0, 0, PI / 2 - 0.08]}><cylinderGeometry args={[0.01, 0.012, 0.6, 8]} />{M.wood({ base: [110, 80, 46] })}</mesh>)}
    {load && <group position={[-0.02, 0.38, 0]}><Stickman escala={0.09} rotY={90} guion={[{ t: 0, accion: "sentarse", expr: "neutral" }]} semilla={73} contacto={0} color="#d8d0c0" />
      <RBox s={[0.1, 0.08, 0.1]} r={0.01} p={[-0.06, 0.04, 0.08]}>{M.wood({ base: [150, 110, 70] })}</RBox></group>}
  </group>
    {[-1, 1].map((k) => <group key={k} position={[0, 0.25, k * 0.17]} rotation={[0, 0, -wheel]}><mesh><torusGeometry args={[0.24, 0.012, 8, 36]} /><meshStandardMaterial color="#1a1612" /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} rotation={[0, 0, (i * PI) / 10]}><boxGeometry args={[0.48, 0.006, 0.006]} />{M.wood({ base: [120, 90, 56] })}</mesh>)}</group>)}
  </group>;

// las ocho herramientas (una por ciudad), paradas: gancho, pala, matoi, caña de vidrio, pico, barra de pudelar, cuchillo, campanita
const Tool: React.FC<{ i: number }> = ({ i }) => {
  const W = M.wood({ base: [130, 92, 54] });
  return i === 0 ? <group><mesh><cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />{W}</mesh><mesh position={[0.03, 0.25, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.03, 0.007, 8, 16, PI * 1.3]} />{M.steel({ col: "#4a4644" })}</mesh></group>
    : i === 1 ? <group><mesh><cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />{W}</mesh><mesh position={[0, -0.26, 0]}><boxGeometry args={[0.1, 0.13, 0.012]} />{M.steel({ col: "#6a6662" })}</mesh></group>
    : i === 2 ? <group><mesh><cylinderGeometry args={[0.009, 0.009, 0.46, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh><mesh position={[0, 0.26, 0]}><sphereGeometry args={[0.045, 14, 10]} /><meshStandardMaterial color="#f2eee4" /></mesh>
        {Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[Math.cos(j * PI / 4) * 0.045, 0.17, Math.sin(j * PI / 4) * 0.045]}><boxGeometry args={[0.014, 0.12, 0.002]} /><meshStandardMaterial color="#f8f6f0" side={THREE.DoubleSide} /></mesh>)}</group>
    : i === 3 ? <group><mesh><cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />{M.steel({ col: "#6a6660" })}</mesh><mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.045, 16, 12]} /><meshStandardMaterial color="#ffb050" emissive="#ff6a10" emissiveIntensity={1.2} /></mesh></group>
    : i === 4 ? <group><mesh><cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />{W}</mesh><mesh position={[0, 0.21, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.004, 0.24, 8]} />{M.steel({ col: "#5a5652" })}</mesh></group>
    : i === 5 ? <group><mesh><cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />{M.steel({ col: "#3a3634" })}</mesh><mesh position={[0, 0.29, 0]}><icosahedronGeometry args={[0.04, 1]} /><meshStandardMaterial color="#ff8a30" emissive="#ff5010" emissiveIntensity={1} flatShading /></mesh></group>
    : i === 6 ? <group><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.035, 0.22, 0.005]} />{M.chrome()}</mesh><mesh position={[0, -0.1, 0]}><boxGeometry args={[0.03, 0.1, 0.025]} />{M.wood({ base: [60, 40, 24] })}</mesh></group>
    : <group><mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.05, 16, 10, 0, 2 * PI, 0, PI / 2]} />{M.brass({ col: "#d8a84a" })}</mesh><mesh position={[0, 0.12, 0]}><torusGeometry args={[0.015, 0.004, 6, 12]} />{M.brass({ col: "#d8a84a" })}</mesh></group>;
};
const TOOLCOL = ["#ffcf8a", "#d8e0ff", "#ff9a5a", "#ffb060", "#cfe8ff", "#ff7a3a", "#ffd8d8", "#ffe08a"];

// ---- HumoMediodia · el reloj de la torre bien grande al frente marca las doce; detrás, las chimeneas largan un humo negro que crece y
// tapa el sol; en «mediodia» los faroles de la calle se encienden de a uno, de día ----
const HumoMediodia: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mediodia", 2.0);
  return <U3 d={d} bg={p.bg} ground={[60, 54, 48]} mode="wipe" sky="#a89c88" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.68, 0], az: [-0.2, -0.05], el: [0.06, 0.05], r: [2.0, 1.85], fov: 36 }}>{(tt) => {
    const smoke = eio(tt, 0, aM + 0.5);
    return <>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-1.0 + i * 0.25, 0, -0.5 - (i % 2) * 0.15]}>
        <RBox s={[0.2, 0.2 + rn(i, 1) * 0.15, 0.18]} r={0.01} p={[0, 0.12, 0]}><meshStandardMaterial map={dirtT([90, 70, 60])} /></RBox>
        <mesh position={[0.04, 0.45, 0]}><cylinderGeometry args={[0.022, 0.028, 0.36, 8]} /><meshStandardMaterial map={dirtT([110, 60, 44])} /></mesh>
        {Array.from({ length: 8 }, (_, j) => { const ph = (tt * 0.18 + j / 8) % 1; return <mesh key={j} position={[0.04 + ph * 0.14 + 0.03 * Math.sin(ph * 5 + i), 0.62 + ph * 1.05, 0]}><sphereGeometry args={[0.06 + ph * 0.2 * (0.5 + smoke), 12, 10]} /><meshStandardMaterial color="#141210" transparent opacity={0.85 * (1 - ph * 0.4) * (0.35 + 0.65 * smoke)} depthWrite={false} /></mesh>; })}
      </group>)}
      <mesh position={[0.7, 1.25, -1.0]}><sphereGeometry args={[0.13, 20, 14]} />{M.glow({ col: "#fff0c0", op: 1 - 0.9 * smoke })}</mesh>
      <group position={[0, 0.6, 0.15]}>
        <RBox s={[0.6, 0.6, 0.06]} r={0.02} p={[0, 0, -0.04]}><meshStandardMaterial map={dirtT([120, 100, 80])} /></RBox>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.26, 0.26, 0.04, 48]} />{M.brass({ col: "#b88a3a" })}</mesh>
        <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.235, 48]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.205, Math.cos(i * PI / 6) * 0.205, 0.025]}><boxGeometry args={[i % 3 === 0 ? 0.016 : 0.009, 0.035, 0.003]} /><meshBasicMaterial color="#2a1a10" /></mesh>)}
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, -lerp(PI * 1.5, 2 * PI, eio(tt, 0, aM))]}><boxGeometry args={[0.014, 0.26, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
        <mesh position={[0, 0, 0.03]} rotation={[0, 0, -lerp(0, 2 * PI, eio(tt, 0, aM)) * 3]}><boxGeometry args={[0.008, 0.38, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
        <mesh position={[0, 0, 0.033]}><circleGeometry args={[0.014, 16]} /><meshBasicMaterial color="#1a1410" /></mesh>
      </group>
      {Array.from({ length: 6 }, (_, i) => { const on = eio(tt, aM + i * 0.25, aM + i * 0.25 + 0.3); return <group key={"l" + i} position={[-0.9 + i * 0.36, 0, 0.45]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.008, 0.01, 0.4, 6]} />{M.steel({ col: "#2a2826" })}</mesh>
        <mesh position={[0, 0.42, 0]}><boxGeometry args={[0.05, 0.06, 0.05]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb050" emissiveIntensity={0.1 + 2 * on} /></mesh>
        <pointLight position={[0, 0.42, 0.06]} intensity={1 * on} distance={0.7} color="#ffc070" /></group>; })}
    </>;
  }}</U3>;
};

// ---- BolaHierro · la boca del horno de pudelar y la balanza de platillos al frente: la barra revuelve y la bola esponjosa al rojo crece;
// en «cincuenta» la pinza la saca y la deja en el platillo, que baja de golpe contra las pesas; el contador llega a 50 kg ----
const BolaHierro: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cincuenta", 2.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#120a06" key1={[-0.6, 2, 1.4]}
    cam={{ at: [-0.14, 0.3, 0.05], az: [-0.25, -0.12], el: [0.14, 0.12], r: [1.2, 1.05], fov: 34 }}>{(tt) => {
    const grow = eio(tt, 0, aC), out = eio(tt, aC, aC + 0.8), land = eio(tt, aC + 0.75, aC + 1.0), stir = Math.sin(tt * 2 * PI * 0.6) * 0.1 * (1 - out);
    const tilt = lerp(0.18, -0.34, land) + 0.03 * Math.sin((tt - aC - 1) * 12) * Math.exp(-Math.max(0, tt - aC - 1) * 3) * land;
    const pan = [-0.22, 0.27 + 0.22 * Math.sin(tilt) - 0.08 + 0.07, 0.2], src = [-0.4, 0.32, -0.05];
    const bx = lerp(src[0], pan[0], out), by = land > 0 ? pan[1] : lerp(src[1], pan[1], out) + 0.15 * Math.sin(PI * out), bz = lerp(src[2], pan[2], out);
    return <>
      <RBox s={[0.8, 0.6, 0.5]} r={0.03} p={[-0.45, 0.3, -0.35]}><meshStandardMaterial map={dirtT([80, 52, 40])} roughness={0.95} /></RBox>
      <RBox s={[0.36, 0.3, 0.04]} r={0.01} p={[-0.45, 0.3, -0.09]}>{M.steel({ col: "#2a2624" })}</RBox>
      <mesh position={[-0.45, 0.3, -0.12]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.12, 32, 1, true]} /><meshStandardMaterial color="#2a1a10" emissive="#ff5a10" emissiveIntensity={0.9} side={THREE.BackSide} /></mesh>
      <mesh position={[-0.45, 0.3, -0.175]}><circleGeometry args={[0.11, 32]} /><meshBasicMaterial color="#ff9a30" toneMapped={false} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={"c" + i} position={[-0.53 + i * 0.027, 0.215 + rn(i, 3) * 0.02, -0.06]}><icosahedronGeometry args={[0.018, 0]} /><meshStandardMaterial color="#2a1a10" emissive="#ff5010" emissiveIntensity={0.8 + 0.4 * Math.sin(tt * 2 + i)} flatShading /></mesh>)}
      <pointLight position={[-0.45, 0.3, 0.15]} intensity={4} distance={2} color="#ff8a30" />
      <mesh position={[0.05, 0.35, -0.05]} rotation={[0, stir, PI / 2 - 0.2]} visible={out < 0.5}><cylinderGeometry args={[0.012, 0.012, 0.9, 10]} />{M.steel({ col: "#4a4644" })}</mesh>
      <mesh position={[bx, by, bz]} scale={sm(0.6 + 0.8 * grow)}><icosahedronGeometry args={[0.075, 2]} /><meshStandardMaterial color="#ffb060" emissive="#ff6010" emissiveIntensity={1.5 - 0.5 * land} roughness={0.85} flatShading /></mesh>
      <group position={[bx + 0.08, by + 0.02, bz]} visible={out > 0.02 && land < 0.95}>{[-1, 1].map((k) => <mesh key={k} position={[0.13, k * 0.035, 0]} rotation={[0, 0, k * 0.15]}><boxGeometry args={[0.32, 0.024, 0.024]} />{M.steel({ col: "#9a9690" })}</mesh>)}</group>
      <group position={[0.0, 0, 0.2]}>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.012, 0.03, 0.26, 10]} />{M.steel({ col: "#5a5e62" })}</mesh>
        <group position={[0, 0.27, 0]} rotation={[0, 0, tilt]}>
          <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.46, 8]} />{M.brass({ col: "#b8902a" })}</mesh>
          {[-1, 1].map((k) => <group key={k} position={[k * 0.22, 0, 0]} rotation={[0, 0, -tilt]}>
            <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.002, 0.002, 0.08, 4]} />{M.steel()}</mesh>
            <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.09, 0.07, 0.015, 24]} />{M.brass({ col: "#c89a3a" })}</mesh>
            {k > 0 && [0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.04, -0.055, 0]}><cylinderGeometry args={[0.018, 0.022, 0.035, 12]} />{M.steel({ col: "#4a4644" })}</mesh>)}</group>)}
        </group>
      </group>
    </>;
  }}</U3>;
};

// ---- AguaTibia · dos vasos grandes sobre el banco frente al horno: el de agua helada con cubitos y escarcha blanca, el de agua tibia con
// avena y un hilo de vapor; en «helada» al obrero se le prende un rayo rojo en la panza y se dobla del calambre; en «tibia» se endereza ----
const AguaTibia: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "helada", 1.2), aT = sec(p, "tibia", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#140c08" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [-0.05, 0.25, 0], az: [-0.15, 0.08], el: [0.16, 0.12], r: [1.3, 1.15], fov: 34 }}>{(tt) => {
    const cold = eio(tt, aH, aH + 0.5) * (1 - eio(tt, aT, aT + 0.5)), warm = eio(tt, aT, aT + 0.5), cramp = cold * (0.85 + 0.15 * Math.sin(tt * 2 * PI * 1.5));
    const glass = (x: number, liq: string, k: string, on: number, glow: string, frost: boolean) => <group key={k} position={[x, 0, 0.1]} scale={1.35}>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.09, 0.075, 0.26, 28, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.084, 0.07, 0.19, 28]} /><meshStandardMaterial color={liq} transparent opacity={0.75} emissive={glow} emissiveIntensity={0.2 + on} /></mesh>
      {frost && Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[Math.sin(j * 2.4) * 0.088, 0.04 + (j % 5) * 0.045, Math.cos(j * 2.4) * 0.088]}><sphereGeometry args={[0.012, 6, 5]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>)}
      <pointLight position={[0, 0.25, 0.12]} intensity={1.6 * on} distance={0.8} color={glow} /></group>;
    return <>
      <RBox s={[1.3, 0.04, 0.45]} r={0.01} p={[0, -0.02, 0.05]}>{M.wood({ base: [110, 76, 44] })}</RBox>
      {glass(-0.4, "#c8e4f4", "f", cold, "#60a8ff", true)}
      {glass(-0.08, "#d8c49a", "w", warm, "#ffa850", false)}
      {Array.from({ length: 5 }, (_, i) => <RBox key={i} s={[0.085, 0.085, 0.085]} r={0.014} p={[-0.4 + (rn(i, 1) - 0.5) * 0.1, 0.3 + rn(i, 2) * 0.04, 0.1 + (rn(i, 3) - 0.5) * 0.1]} rot={[rn(i, 4), rn(i, 5), 0]}><meshStandardMaterial color="#f2faff" emissive="#9acfff" emissiveIntensity={0.25} roughness={0.25} /></RBox>)}
      {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.35 + i / 6) % 1; return <mesh key={"v" + i} position={[-0.08 + Math.sin(ph * 6 + i) * 0.025, 0.36 + ph * 0.3, 0.1]} scale={sm(0.04 + ph * 0.08)}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * (1 - ph)} depthWrite={false} /></mesh>; })}
      <group position={[0.3, 0, 0.05]} rotation={[0, 0, -0.45 * cold]}><Stickman escala={0.16} rotY={-30} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aH + 0.3, accion: "encogerse_de_hombros", expr: "llorando" }, { t: aT + 0.3, accion: "idle", expr: "feliz" }]} semilla={52} contacto={0} color="#8a7a6a" />
        <mesh position={[0.0, 0.17, 0.05]} scale={sm(cramp)}><octahedronGeometry args={[0.035]} /><meshBasicMaterial color="#ff3a2a" transparent opacity={0.85} toneMapped={false} /></mesh></group>
      <pointLight position={[0.3, 0.3, 0.3]} intensity={1.4 * cold} distance={0.8} color="#ff4a3a" />
    </>;
  }}</U3>;
};

// ---- LineaGanchos · el riel del techo con decenas de ganchos que avanzan con medias reses; cada uno pasa frente a un obrero y en
// «corte» cada obrero hace un solo movimiento de cuchillo; en «cientos» el contador de ganchos por hora gira rápido ----
const LineaGanchos: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corte", 1.5), aX = sec(p, "cientos", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="tile" mode="wipe" sky="#1a1c1e" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.48, 0.1], az: [-0.4, -0.25], el: [0.14, 0.12], r: [1.85, 1.7], fov: 34 }}>{(tt) => {
    const mv = tt * 0.22 * (1 + eio(tt, aX, aX + 1));
    return <>
      <mesh position={[0, 1.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.015, 0.015, 3.2, 10]} />{M.steel({ col: "#6a6e72" })}</mesh>
      {Array.from({ length: 16 }, (_, i) => { const x = ((i * 0.2 + mv) % 3.2) - 1.6; return <group key={i} position={[x, 0.98, 0]}>
        <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />{M.steel({ col: "#8a8e92" })}</mesh>
        <mesh position={[0, -0.18, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.025, 0.004, 6, 16, PI * 1.4]} />{M.steel({ col: "#8a8e92" })}</mesh>
        <mesh position={[0, -0.34, 0]} scale={[0.75, 1.5, 0.55]}><sphereGeometry args={[0.08, 14, 10]} /><meshStandardMaterial color="#b85a4a" roughness={0.55} /></mesh>
        <mesh position={[0.01, -0.34, 0.035]} scale={[0.5, 1.3, 0.3]}><sphereGeometry args={[0.07, 12, 8]} /><meshStandardMaterial color="#efe0cc" roughness={0.6} /></mesh></group>; })}
      {[-0.54, -0.18, 0.18, 0.54].map((x, i) => <group key={i} position={[x, 0, 0.3]}><Stickman escala={0.15} rotY={180} guion={[{ t: 0, accion: "idle", expr: "aburrido" }, { t: aC + i * 0.15, accion: "senalar", expr: "decidido" }]} semilla={60 + i} contacto={0} color="#e8e4dc" />
        <mesh position={[0.05, 0.5, -0.12]} rotation={[0.5 * Math.sin(tt * 2 * PI * 0.9 + i) * cl(tt - aC), 0, 0]}><boxGeometry args={[0.014, 0.014, 0.16]} />{M.chrome()}</mesh></group>)}
      <spotLight position={[0, 1.8, 0.8]} angle={0.6} penumbra={0.6} intensity={5} distance={4} color="#f0f4ff" />
    </>;
  }}</U3>;
};

// ---- LineaReves · dos cintas grandes, una sobre otra: arriba (Chicago) entra una media res colgada y salen los cortes que se separan;
// abajo (Ford) entran chasis, ruedas y motor y sale un auto armado, crema y bien iluminado; en «reves» la cámara baja de una a la otra,
// en «desarmaba» los cortes de arriba se abren en abanico ----
const LineaReves: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "reves", 1.5), aD = sec(p, "desarmaba", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="tile" mode="wipe" sky="#3a3e44" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.55, 0], at1: [0.1, 0.2, 0], az: [-0.3, -0.1], el: [0.2, 0.16], r: [1.55, 1.4], fov: 36 }}>{(tt) => {
    const u = cl(tt / 6), op = eio(tt, aD, aD + 1.0), mv = (tt * 0.2) % 0.2;
    const belt = (y: number, k: string) => <group key={k} position={[0, y, 0]}><RBox s={[2.4, 0.05, 0.36]} r={0.01}><meshStandardMaterial color="#3a3c3e" roughness={0.7} /></RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-1.1 + i * 0.2 + mv, 0.027, 0]}><boxGeometry args={[0.01, 0.003, 0.36]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}</group>;
    return <>
      {belt(0.62, "a")}{belt(0.08, "b")}
      <group position={[lerp(-1.0, -0.2, cl(u / 0.55)), 0.86, 0]} visible={u < 0.55}>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.004, 0.004, 0.1, 6]} />{M.steel()}</mesh>
        <mesh scale={[1.6, 1.0, 0.8]}><sphereGeometry args={[0.1, 16, 12]} /><meshStandardMaterial color="#b85a4a" roughness={0.55} /></mesh></group>
      {Array.from({ length: 5 }, (_, i) => <group key={i} visible={u > 0.5}><RBox s={[0.1, 0.07, 0.1]} r={0.02} p={[-0.1 + i * 0.16 * (0.6 + op), 0.69 + 0.04 * rn(i, 1), (i - 2) * 0.06 * op]} rot={[0, (i - 2) * 0.3 * op, 0]}>
        <meshStandardMaterial color={["#b85a4a", "#c87a5a", "#efe0cc", "#a84a3a", "#d8a080"][i]} roughness={0.6} /></RBox></group>)}
      {Array.from({ length: 5 }, (_, i) => <group key={"p" + i} position={[-1.0 + i * 0.17 + cl(u / 0.65) * 0.75, 0.16, (i - 2) * 0.05 * (1 - u)]} visible={u < 0.65}>
        {i % 2 ? <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.025, 16]} /><meshStandardMaterial color="#1a1a1a" /></mesh> : <RBox s={[0.1, 0.05, 0.08]} r={0.01}>{M.steel({ col: ["#c8c8c8", "#8a8e92", "#2a3a5a"][i / 2] })}</RBox>}</group>)}
      <group position={[lerp(0.15, 0.6, cl((u - 0.6) / 0.4)), 0.11, 0]} scale={sm(cl((u - 0.6) * 5) * 2.3)}>
        <RBox s={[0.3, 0.08, 0.15]} r={0.025} p={[0, 0.06, 0]}><meshPhysicalMaterial color="#d8c8a8" metalness={0.3} roughness={0.35} clearcoat={0.6} /></RBox>
        <RBox s={[0.15, 0.08, 0.14]} r={0.025} p={[-0.03, 0.13, 0]}><meshPhysicalMaterial color="#e8dcc0" metalness={0.3} roughness={0.25} clearcoat={1} /></RBox>
        {[[-0.09, -1], [0.09, -1], [-0.09, 1], [0.09, 1]].map(([x, z], i) => <mesh key={i} position={[x, 0.025, z * 0.075]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.025, 16]} /><meshStandardMaterial color="#141414" /></mesh>)}
        {[-1, 1].map((k) => <mesh key={k} position={[0.152, 0.07, k * 0.045]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.014, 12]} /><meshBasicMaterial color="#fff6d0" toneMapped={false} /></mesh>)}
      </group>
      <spotLight position={[0, 1.6, 0.8]} angle={0.55} penumbra={0.6} intensity={5 + 1.5 * eio(tt, aR, aR + 0.5)} distance={4} color="#fff0e0" />
      <pointLight position={[0.6, 0.4, 0.5]} intensity={1.3} distance={1.8} color="#ffe8c0" />
      <pointLight position={[-0.6, 0.9, 0.6]} intensity={1.1} distance={1.8} color="#ffe8d0" />
    </>;
  }}</U3>;
};

// ---- CorazonEstomago · de cerca: el libro abierto a la izquierda; una flecha grande sale volando hacia el corazón rojo que late, pero en
// «estomago» se curva hacia abajo y se clava en la lata de carne; la lata se abre y salen moscas ----
const CorazonEstomago: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corazon", 1.2), aE = sec(p, "estomago", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#120e0c" key1={[-0.8, 2.4, 1.5]}
    cam={{ at: [0.0, 0.3, 0], az: [-0.1, 0.05], el: [0.1, 0.08], r: [1.4, 1.25], fov: 34 }}>{(tt) => {
    const fly = eio(tt, aC, aE + 0.3), bend = eio(tt, aE - 0.4, aE + 0.3), hit = eio(tt, aE + 0.3, aE + 0.6);
    const x = lerp(-0.4, 0.33, fly), y = 0.42 + Math.sin(fly * PI) * 0.1 - bend * 0.3 * fly, z = 0.12;
    return <>
      <group position={[-0.45, 0.02, 0.1]}>{[-1, 1].map((k) => <mesh key={k} position={[k * 0.11, 0.02, 0]} rotation={[-PI / 2 + 0.3, k * 0.15, 0]}><planeGeometry args={[0.22, 0.3]} /><meshStandardMaterial map={tex.paper()} side={THREE.DoubleSide} /></mesh>)}</group>
      <group position={[0.36, 0.48, -0.05]} scale={sm(1.25 * (1 + 0.08 * Math.sin(tt * 2 * PI * 1.2)))}>
        {[-1, 1].map((k) => <mesh key={k} position={[k * 0.045, 0.02, 0]}><sphereGeometry args={[0.065, 16, 12]} /><meshStandardMaterial color="#c8202a" emissive="#801010" emissiveIntensity={0.4} /></mesh>)}
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.09, 0.09, 0.09]} /><meshStandardMaterial color="#c8202a" emissive="#801010" emissiveIntensity={0.4} /></mesh>
      </group>
      <group position={[0.36, 0.0, 0.12]}>
        <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.09, 0.09, 0.18, 28]} />{M.steel({ col: "#b8b0a0" })}</mesh>
        <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.093, 0.093, 0.08, 28]} /><meshStandardMaterial color="#c83a2a" roughness={0.5} /></mesh>
        <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.095, 0.095, 0.012, 28]} />{M.brass({ col: "#e8c060" })}</mesh>
        <mesh position={[0, 0.18 + 0.04 * hit, -0.06 * hit]} rotation={[-1.2 * hit, 0, 0]}><cylinderGeometry args={[0.091, 0.091, 0.01, 28]} />{M.steel({ col: "#c8c0b0" })}</mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(tt * 2.5 + i) * 0.15 * hit, 0.22 + rn(i, 1) * 0.25 * hit, Math.cos(tt * 2 + i) * 0.12 * hit]} visible={hit > 0.1}><sphereGeometry args={[0.01, 6, 6]} /><meshStandardMaterial color="#141414" /></mesh>)}
      </group>
      <group position={[x, y, z]} rotation={[0, 0, -0.25 * Math.cos(fly * PI) - bend * 1.1]} visible={tt > aC - 0.1} scale={sm(1.8)}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.3, 8]} />{M.wood({ base: [190, 140, 80] })}</mesh>
        <mesh position={[0.16, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.026, 0.06, 8]} />{M.chrome()}</mesh>
        {[-1, 1].map((k) => <mesh key={k} position={[-0.13, k * 0.012, 0]} rotation={[0, 0, k * 0.4]}><boxGeometry args={[0.05, 0.018, 0.002]} /><meshStandardMaterial color="#c8302a" side={THREE.DoubleSide} /></mesh>)}
      </group>
      <spotLight position={[0, 1.4, 0.8]} angle={0.5} penumbra={0.6} intensity={5} distance={3} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- HombreMasRapido · la calle de Calcuta en 1900, de costado y a la altura del piso: el carruaje de caballo trota; en «corriendo» el
// tirador de rickshaw lo alcanza y lo pasa, y la cámara lo sigue ----
const HombreMasRapido: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corriendo", 2.0);
  return <U3 d={d} bg={p.bg} ground={[150, 120, 90]} mode="wipe" sky="#3a3026" key1={[-1, 2.6, 1.8]}
    cam={{ at: [-0.3, 0.25, 0.05], at1: [0.45, 0.25, 0.05], az: [-0.05, 0.0], el: [0.22, 0.18], r: [2.2, 2.05], fov: 36 }}>{(tt) => {
    const horse = -0.5 + tt * 0.14, rick = -1.1 + tt * 0.1 + 0.36 * Math.max(0, tt - aC) * eio(tt, aC, aC + 0.6);
    return <>
      {Array.from({ length: 8 }, (_, i) => <RBox key={i} s={[0.38, 0.4 + rn(i, 1) * 0.3, 0.2]} r={0.01} p={[-1.6 + i * 0.45, 0.25, -0.65]}><meshStandardMaterial map={dirtT([200 - rn(i, 2) * 40, 170, 130])} /></RBox>)}
      <group position={[horse, 0, -0.12]}>
        <group position={[0.35, 0, 0]}><Horse tt={tt} s={0.55} gallop={0.6} /></group>
        <RBox s={[0.34, 0.2, 0.22]} r={0.03} p={[0, 0.27, 0]}><meshStandardMaterial color="#2a2018" /></RBox>
        {[-1, 1].map((k) => <mesh key={k} position={[0, 0.13, k * 0.13]} rotation={[0, 0, -tt * 3]}><torusGeometry args={[0.12, 0.01, 6, 24]} /><meshStandardMaterial color="#1a1612" /></mesh>)}</group>
      <group position={[rick, 0, 0.3]}><Rickshaw wheel={rick * 4} s={0.85} />
        <group position={[0.56, 0, 0]}><Stickman escala={0.16} rotY={90} guion={[{ t: 0, accion: "correr", expr: "decidido" }]} semilla={70} contacto={0} color="#5a4030" /></group></group>
    </>;
  }}</U3>;
};

// ---- UltimaCiudad · el mapa del mundo sobre la mesa con alfileres dorados en las ciudades que tuvieron rickshaw de tiro a mano; uno a uno
// se apagan y se hunden; en «ultima» queda uno solo: Calcuta; en «hoy» la cámara baja hasta él y su luz late ----
const CITIES = [[35.7, 139.7], [31.2, 121.5], [1.3, 103.8], [13.7, 100.5], [-26.2, 28.0], [19.1, 72.9], [28.6, 77.2], [39.9, 116.4], [10.8, 106.6], [22.57, 88.36]];
const LL = (la: number, lo: number) => [lo / 180 * 1.0, -la / 90 * 0.5];
const mundoT = () => tex.text("mundo", 1024, 512, (g) => {
  g.fillStyle = "#24465a"; g.fillRect(0, 0, 1024, 512);
  const blob = (pts: number[][]) => { g.beginPath(); pts.forEach(([lo, la], i) => { const x = (lo + 180) / 360 * 1024, y = (90 - la) / 180 * 512; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); g.fill(); };
  g.fillStyle = "#c8b48a";
  blob([[-165, 68], [-60, 72], [-55, 50], [-80, 25], [-97, 17], [-80, 8], [-105, 20], [-125, 40], [-165, 60]]);
  blob([[-80, 10], [-35, -5], [-40, -22], [-70, -55], [-75, -20], [-80, 0]]);
  blob([[-10, 36], [30, 32], [50, 12], [40, -15], [20, -35], [10, -5], [-17, 15]]);
  blob([[-10, 36], [0, 60], [30, 70], [100, 77], [180, 66], [140, 40], [120, 22], [105, 10], [90, 22], [78, 8], [70, 22], [55, 25], [35, 35]]);
  blob([[113, -22], [153, -27], [145, -38], [116, -34]]);
  g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 1; for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo(i * 1024 / 12, 0); g.lineTo(i * 1024 / 12, 512); g.stroke(); } for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * 512 / 6); g.lineTo(1024, i * 512 / 6); g.stroke(); }
});
const UltimaCiudad: React.FC<UP> = ({ d, p }) => {
  const aU = sec(p, "ultima", 2.0), aH = sec(p, "hoy", 3.5), K = LL(22.57, 88.36);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" sky="#06080c" key1={[-1, 2.2, 1.8]}
    cam={{ at: [0.25, 0, -0.05], at1: [K[0], 0.02, K[1]], az: [0.05, 0.1], el: [0.75, 0.55], r: [1.7, 0.75], fov: 34 }}>{(tt) => <>
      <mesh position={[0, 0.01, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.0, 1.0]} /><meshStandardMaterial map={mundoT()} roughness={0.8} /></mesh>
      <RBox s={[2.08, 0.04, 1.08]} r={0.01} p={[0, -0.012, 0]}>{M.wood({ base: [90, 60, 36] })}</RBox>
      {CITIES.map(([la, lo], i) => { const last = i === CITIES.length - 1, SP = Math.max(aU, d / 30 * 0.7) - 0.3, off = last ? 0 : eio(tt, 0.3 + i * SP / CITIES.length, 0.75 + i * SP / CITIES.length), q = LL(la, lo);
        const beat = last ? 1 + 0.35 * eio(tt, aH, aH + 0.3) * (0.5 + 0.5 * Math.sin(tt * 2 * PI * 1.0)) : 1;
        return <group key={i} position={[q[0], 0.01 - 0.04 * off, q[1]]}>
          <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.005, 0.005, 0.14, 12]} />{M.steel({ col: "#9a9ea2" })}</mesh>
          <mesh position={[0, 0.2 + 0.12 * off, 0]} scale={sm(off * (1 - off) * 4 * 0.05)}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#8a8680" transparent opacity={0.6} depthWrite={false} /></mesh>
          <mesh position={[0, 0.15, 0]} scale={sm(beat)}><sphereGeometry args={[0.034, 24, 18]} /><meshStandardMaterial color={off > 0.5 ? "#4a4038" : "#ffd060"} emissive="#ffb020" emissiveIntensity={(1 - off) * 1.4} metalness={0.6} roughness={0.3} /></mesh>
        </group>; })}
      <pointLight position={[K[0], 0.24, K[1]]} intensity={0.6 + 1.2 * eio(tt, aU, aU + 0.5)} distance={0.6} color="#ffcf6a" />
      <pointLight position={[0, 1.2, 0.6]} intensity={1.6} distance={3} color="#e8eaff" />
    </>}</U3>;
};

// ---- RickshawPalanca · el rickshaw cargado (pasajero y bulto) de costado: bajo el eje de la rueda, un triángulo de bronce marca el punto de
// apoyo; el tirador baja las varas y el peso queda justo encima; en «equilibrio» la línea de luz sube del triángulo al pasajero; en
// «campana» la campanita de bronce golpea la vara ----
const RickshawPalanca: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "equilibrio", 1.5), aC = sec(p, "campana", 3.5);
  return <U3 d={d} bg={p.bg} ground={[120, 100, 80]} mode="wipe" sky="#2a2620" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0.15, 0.3, 0], az: [-0.5, -0.32], el: [0.16, 0.14], r: [1.65, 1.5], fov: 34 }}>{(tt) => {
    const tilt = lerp(0.35, 0.0, eio(tt, 0.3, aE)) + 0.015 * Math.sin(tt * 2), ring = tt > aC ? Math.sin((tt - aC) * 2 * PI * 1.8) * Math.exp(-(tt - aC) * 1.5) : 0;
    return <>
      <Rickshaw tilt={tilt} load />
      <group position={[0.7, 0, 0]}><Stickman escala={0.14} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={72} contacto={0} color="#5a4030" /></group>
      <mesh position={[0, 0.045, 0.2]}><coneGeometry args={[0.07, 0.09, 3]} /><meshStandardMaterial color="#d8a84a" metalness={0.6} roughness={0.3} emissive="#ffb030" emissiveIntensity={1.2 * eio(tt, aE, aE + 0.6)} /></mesh>
      <pointLight position={[0, 0.12, 0.32]} intensity={0.0001 + 1.6 * eio(tt, aE, aE + 0.6)} distance={0.7} color="#ffd060" />
      <group position={[0.58, 0.37 - tilt * 0.3, 0.13]} rotation={[0, 0, ring * 0.5]}>
        <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.002, 0.002, 0.04, 4]} />{M.steel()}</mesh>
        <mesh position={[0, -0.05, 0]} rotation={[PI, 0, 0]}><sphereGeometry args={[0.032, 16, 10, 0, 2 * PI, 0, PI / 2]} />{M.brass({ col: "#d8a84a" })}</mesh></group>
      <pointLight position={[0.58, 0.4, 0.3]} intensity={1.2 * Math.abs(ring)} distance={0.6} color="#ffe0a0" />
    </>;
  }}</U3>;
};

// ---- PostalSostenida · la postal grande de la ciudad (la foto del puente) parada sobre la mesa; en «debajo» la cámara baja y se ve que la
// sostienen ocho obreros, cada uno con su herramienta al lado ----
const PostalSostenida: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "debajo", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#120e0c" key1={[-0.8, 2.4, 1.6]}
    cam={{ at: [0, 0.48, 0], at1: [0, 0.3, 0], az: [-0.1, 0.12], el: [0.2, 0.08], r: [1.7, 1.45], fov: 34 }}>{(tt) => <>
      <Postal src={IMG("f04_brooklyn_s1")} p={[0, 0.5, 0]} rot={[-PI / 2 + 0.6, 0, 0]} w={1.1} />
      {Array.from({ length: 8 }, (_, i) => { const x = -0.42 + (i % 4) * 0.28, z = i < 4 ? -0.15 : 0.15; return <group key={i} position={[x, 0, z]}>
        <Stickman escala={0.11} rotY={rn(i, 1) * 60 - 30} guion={[{ t: 0, accion: "festejar", expr: "decidido" }]} semilla={80 + i} contacto={0} color="#7a6a5a" />
        <group position={[0.07, 0.17, 0.03]} rotation={[0, 0, -0.2]} scale={0.7}><Tool i={i} /></group></group>; })}
      <spotLight position={[0, 1.8, 1.0]} angle={0.5} penumbra={0.6} intensity={6} distance={4} color="#fff0d8" />
      <pointLight position={[0, 0.2, 0.6]} intensity={1.8 * eio(tt, aD, aD + 0.8)} distance={1.5} color="#ffc070" />
    </>}</U3>;
};

// ---- OchoHerramientas · las ocho herramientas pasan de a una al centro sobre un pedestal, grandes y con su propia luz de color; al pasar la
// siguiente, la anterior se va a la fila de atrás, donde quedan todas juntas iluminadas al final ----
const OchoHerramientas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, step = Math.max(0.5, (D - 1.0) / 8.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.46, 0], az: [-0.12, 0.1], el: [0.12, 0.14], r: [1.25, 1.32], fov: 36 }}>{(tt) => <>
      <mesh position={[0, 0.06, 0.15]}><cylinderGeometry args={[0.16, 0.18, 0.12, 32]} /><meshStandardMaterial map={dirtT([150, 140, 126])} roughness={0.7} /></mesh>
      {Array.from({ length: 8 }, (_, i) => { const a = 0.2 + i * step, inC = eio(tt, a, a + 0.4), toBack = i === 7 ? 0 : eio(tt, a + step, a + step + 0.5), k = pop(tt, a);
        const bx = -0.63 + i * 0.18, bz = -0.35;
        return <group key={i} position={[lerp(0, bx, toBack), lerp(0.47, 0.3, toBack), lerp(0.15, bz, toBack)]} rotation={[0, (1 - toBack) * (tt - a) * 0.8, 0]} scale={sm(k * lerp(1.5, 0.9, toBack))}>
          <Tool i={i} /></group>; })}
      {Array.from({ length: 8 }, (_, i) => { const a = 0.2 + i * step, inC = eio(tt, a, a + 0.4), toBack = i === 7 ? 0 : eio(tt, a + step, a + step + 0.5);
        return <pointLight key={"L" + i} position={[lerp(0, -0.63 + i * 0.18, toBack), 0.5, lerp(0.4, -0.1, toBack)]} intensity={(2.4 * (1 - toBack) + 0.5 * toBack) * inC} distance={0.9} color={TOOLCOL[i]} />; })}
      <spotLight position={[0, 1.6, 0.8]} angle={0.3} penumbra={0.6} intensity={4} distance={3} color="#fff0d8" />
    </>}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { HumoMediodia, BolaHierro, AguaTibia, LineaGanchos, LineaReves, CorazonEstomago, HombreMasRapido, UltimaCiudad, RickshawPalanca, PostalSostenida, OchoHerramientas };
