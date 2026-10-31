// dur29d · bloque A (gancho en el techo de Chernóbil, el trato, 1900 breaker boys, 1910 Corte Culebra, 1920 pinboys, 1930 remachadores):
// un mecanismo por componente, objetos grandes, sin carteles para leer. Luces siempre montadas (rampa), escala mínima > 0.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, fallY, latheG, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { Coin, PI, sm } from "./c3k";

type UP = { d: number; p: any };
const CONC = [132, 128, 120];

// ---------- piezas ----------
const Lump: React.FC<{ p: number[]; s?: number; i?: number; col?: string; shine?: boolean }> = ({ p, s = 1, i = 0, col = "#141416", shine = true }) =>
  <mesh position={p as any} rotation={[rn(i, 1) * 3, rn(i, 2) * 3, rn(i, 3) * 3]} scale={[sm(s), sm(s * (0.7 + 0.3 * rn(i, 4))), sm(s * (0.8 + 0.3 * rn(i, 5)))]}>
    <dodecahedronGeometry args={[0.03, 0]} /><meshStandardMaterial color={col} metalness={shine ? 0.55 : 0.05} roughness={shine ? 0.25 : 0.95} flatShading /></mesh>;
// viga doble T a lo largo de X
const IBeam: React.FC<{ L: number; p?: number[]; rot?: number[]; h?: number; col?: string }> = ({ L, p = [0, 0, 0], rot = [0, 0, 0], h = 0.09, col = "#8a4a2a" }) =>
  <group position={p as any} rotation={rot as any}>
    {[-1, 1].map((s) => <mesh key={s} position={[0, s * h / 2, 0]}><boxGeometry args={[L, 0.012, h * 0.75]} /><meshStandardMaterial color={col} metalness={0.5} roughness={0.6} /></mesh>)}
    <mesh><boxGeometry args={[L, h, 0.012]} /><meshStandardMaterial color={col} metalness={0.5} roughness={0.6} /></mesh>
    {Array.from({ length: Math.floor(L / 0.12) }, (_, i) => <mesh key={i} position={[-L / 2 + 0.06 + i * 0.12, h / 2 + 0.007, 0.02]}><sphereGeometry args={[0.006, 8, 6]} /><meshStandardMaterial color="#5a3a24" metalness={0.6} roughness={0.5} /></mesh>)}
  </group>;
const Shovel: React.FC<{ p?: number[]; rot?: number[]; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) =>
  <group position={p as any} rotation={rot as any} scale={sm(s)}>
    <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />{M.wood({ base: [130, 92, 54] })}</mesh>
    <mesh position={[0, 0.33, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />{M.wood({ base: [130, 92, 54] })}</mesh>
    <RBox s={[0.09, 0.11, 0.008]} r={0.01} p={[0, -0.04, 0]}>{M.steel({ col: "#7a7e80" })}</RBox>
  </group>;
const PinG = () => latheG("bolo29d", [[0, 0], [0.022, 0], [0.034, 0.05], [0.03, 0.09], [0.016, 0.13], [0.019, 0.155], [0.013, 0.18], [0, 0.185]], 24);
const Pin: React.FC<{ p: number[]; rot?: number[] }> = ({ p, rot = [0, 0, 0] }) =>
  <group position={p as any} rotation={rot as any}>
    <mesh geometry={PinG()}>{M.porcelain({ col: "#f4efe4" })}</mesh>
    <mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.0175, 0.0185, 0.012, 20]} /><meshStandardMaterial color="#b8281e" roughness={0.4} /></mesh>
  </group>;
const Rain: React.FC<{ tt: number; n?: number; w?: number; h?: number; z?: number; op?: number }> = ({ tt, n = 90, w = 3, h = 1.6, z = 0.6, op = 0.35 }) => <>
  {Array.from({ length: n }, (_, i) => { const ph = (tt * 1.6 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 1) - 0.5) * w, h - ph * h, (rn(i, 3) - 0.5) * z * 2]} rotation={[0, 0, 0.12]}>
    <boxGeometry args={[0.003, 0.09, 0.003]} /><meshBasicMaterial color="#c8d4e0" transparent opacity={op} depthWrite={false} /></mesh>; })}</>;
const Dust: React.FC<{ tt: number; n?: number; w?: number; h?: number; col?: string; op?: number; s?: number }> = ({ tt, n = 50, w = 2.4, h = 1.2, col = "#2a2622", op = 0.35, s = 0.05 }) => <>
  {Array.from({ length: n }, (_, i) => { const ph = (tt * 0.08 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 1) - 0.5) * w + Math.sin(tt * 0.4 + i) * 0.05, ph * h, (rn(i, 3) - 0.5) * 1.2]} scale={0.6 + rn(i, 4)}>
    <sphereGeometry args={[s, 8, 6]} /><meshBasicMaterial color={col} transparent opacity={op * Math.sin(ph * PI)} depthWrite={false} /></mesh>; })}</>;

// ---- TechoNoventa · el techo de Chernóbil: grafito negro brillante por todo el piso, la chimenea a rayas detrás, la puerta de la
// escalera entreabierta; vos con la pala; en «noventa» arranca la cuenta regresiva y el resplandor del reactor late debajo ----
const TechoNoventa: React.FC<UP> = ({ d, p }) => {
  const aN = sec(p, "noventa", 2.0);
  const left = (tt: number) => Math.max(0, 90 - Math.max(0, tt - aN));
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#3a3c40" key1={[-1.4, 2.6, 1.6]}
    cam={{ at: [-0.1, 0.22, 0.38], at1: [0.0, 0.2, 0.4], az: [-0.5, -0.32], el: [0.24, 0.2], r: [1.05, 0.9], fov: 36 }}
    over={(tt) => <Drums v={left(tt)} n={2} x={1460} y={110} s={1.15} unit="s" op={eio(tt, 0.3, 1.2)} />}>{(tt) => {
    const pulse = 0.6 + 0.4 * Math.sin(tt * 2 * PI * 0.5), go = 0.45 + 0.55 * eio(tt, aN, aN + 0.4), sw = Math.abs(Math.sin(tt * 2.4)), blow = Math.max(0, 1 - Math.abs(((tt * 2.4) / PI) % 1 - 0.5) * 6);
    return <>
      <mesh position={[0, -0.03, 0]}><boxGeometry args={[3.2, 0.06, 2.2]} /><meshStandardMaterial map={dirtT(CONC)} roughness={0.95} /></mesh>
      {/* el borde roto del techo y el agujero con el resplandor */}
      <mesh position={[0.9, -0.0, -0.75]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.32, 24]} /><meshBasicMaterial color="#1a0c06" /></mesh>
      <pointLight position={[0.9, -0.05, -0.75]} intensity={2.2 * pulse} distance={1.6} color="#ff8a3a" />
      {Array.from({ length: 70 }, (_, i) => <Lump key={i} i={i} p={[(rn(i, 7) - 0.5) * 2.8, 0.01, (rn(i, 8) - 0.5) * 1.8]} s={0.8 + rn(i, 9) * 1.6} />)}
      {/* la chimenea a rayas rojas y blancas */}
      <group position={[-0.9, 0, -1.6]}>{Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0.2 + i * 0.3, 0]}><cylinderGeometry args={[0.2 - i * 0.008, 0.2 - (i - 1) * 0.008, 0.3, 28]} /><meshStandardMaterial color={i % 2 ? "#e8e4dc" : "#b8382a"} roughness={0.8} /></mesh>)}</group>
      {/* la puerta de la escalera */}
      <group position={[-1.15, 0, 0.1]}>
        <RBox s={[0.36, 0.6, 0.4]} r={0.01} p={[0, 0.3, 0]}><meshStandardMaterial map={dirtT([118, 114, 106])} roughness={0.95} /></RBox>
        <mesh position={[0.181, 0.25, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.22, 0.42]} /><meshBasicMaterial color="#0a0908" /></mesh>
        <group position={[0.185, 0.04, -0.11]} rotation={[0, 0.9, 0]}><RBox s={[0.012, 0.42, 0.22]} r={0.004} p={[0, 0.21, 0.11]}><meshStandardMaterial color="#5a6a5a" metalness={0.5} roughness={0.5} /></RBox></group>
      </group>
      {/* vos: delantal de plomo y pala */}
      <group position={[-0.2, 0, 0.35]}>
        <Stickman escala={0.21} rotY={-20} guion={[{ t: 0, accion: "empujar", expr: "nervioso" }, { t: aN + 0.2, accion: "empujar", expr: "asustado" }] as any} semilla={3} contacto={0.4} colorContacto="#0a0a0c" color="#7a7e80" />
        <Shovel p={[0.14, 0.05, 0.08]} rot={[0.3, 0, -0.35 - 0.45 * go * sw]} s={1.9} />
        {Array.from({ length: 10 }, (_, i) => { const u = cl(1 - blow + rn(i, 1) * 0.2); return <mesh key={"k" + i} position={[0.3 + (rn(i, 2) - 0.3) * 0.25 * (1 - u), 0.03 + 0.18 * (1 - u) * rn(i, 3), 0.1 + (rn(i, 4) - 0.5) * 0.2 * (1 - u)]} scale={sm(blow * (0.6 + rn(i, 5)))}><sphereGeometry args={[0.009, 6, 6]} />{M.glow({ col: "#ffd080" })}</mesh>; })}
      </group>
      {Array.from({ length: 10 }, (_, i) => { const ph = (tt * (tt > aN ? 1.2 : 0.6) + i / 10) % 1, on = tt > 0.4 + i * 0.12 ? 1 : 0; return <Lump key={"g" + i} i={i + 90} p={[0.0 + ph * 0.7, 0.08 + Math.sin(PI * ph) * 0.3, 0.43 - ph * 0.5]} s={on ? 2.4 : 0.001} />; })}
      <hemisphereLight args={["#d8dce4", "#2a2622", 0.6]} />
      <directionalLight position={[-2, 3, 1]} intensity={0.6} color="#d8dce4" />
    </>;
  }}</U3>;
};

// ---- SigloDebajo · el siglo en dos pisos: arriba el progreso brilla (radio, avión, rascacielos, cohete) sobre una losa; la cámara
// baja y debajo de la losa, en la tierra, están las herramientas de quien lo hizo; en «debajo» se encienden de a una ----
const SigloDebajo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aD = Math.min(sec(p, "debajo", 3.0), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#16120e" key1={[-1.0, 2.8, 1.8]} backZ={-1.2}
    cam={{ at: [0, 0.75, 0], at1: [0, 0.05, 0], az: [-0.15, 0.1], el: [0.16, 0.06], r: [1.75, 1.6], fov: 36 }}>{(tt) => {
    const on = (i: number) => eio(tt, aD + i * 0.3, aD + i * 0.3 + 0.4);
    return <>
      {/* la losa del progreso */}
      <RBox s={[2.6, 0.08, 0.7]} r={0.01} p={[0, 0.48, 0]}><meshStandardMaterial map={dirtT([170, 164, 152])} roughness={0.9} /></RBox>
      <group position={[-0.85, 0.52, 0.05]} scale={pop(tt, 0.2)}><RBox s={[0.2, 0.14, 0.1]} r={0.02} p={[0, 0.07, 0]}>{M.wood({ base: [130, 80, 40] })}</RBox>
        <mesh position={[-0.04, 0.08, 0.051]}><circleGeometry args={[0.035, 20]} /><meshStandardMaterial color="#e8d8b0" /></mesh></group>
      <group position={[-0.3, 0.75 + 0.03 * Math.sin(tt * 2), 0.05]} rotation={[0, 0.4, 0.05 * Math.sin(tt * 1.5)]} scale={pop(tt, 0.4)}>
        <mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.025, 0.24, 6, 12]} />{M.steel({ col: "#c8ccd0" })}</mesh>
        <RBox s={[0.06, 0.008, 0.34]} r={0.003} p={[0.02, 0, 0]}>{M.steel({ col: "#b8bcc0" })}</RBox>
        <RBox s={[0.04, 0.06, 0.006]} r={0.003} p={[-0.13, 0.03, 0]}>{M.steel({ col: "#b8bcc0" })}</RBox></group>
      <group position={[0.3, 0.52, 0.0]} scale={pop(tt, 0.6)}>{Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.16 - i * 0.015, 0.1, 0.16 - i * 0.015]} r={0.004} p={[0, 0.05 + i * 0.1, 0]}><meshStandardMaterial color="#b8b0a0" roughness={0.6} emissive="#ffe0a0" emissiveIntensity={0.15} /></RBox>)}
        <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.003, 0.012, 0.12, 6]} />{M.steel()}</mesh></group>
      <group position={[0.85, 0.52, 0.05]} scale={pop(tt, 0.8)}>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.04, 0.05, 0.36, 20]} />{M.pvc({ col: "#ecebe6" })}</mesh>
        <mesh position={[0, 0.46, 0]}><coneGeometry args={[0.04, 0.12, 20]} /><meshStandardMaterial color="#c8382a" /></mesh></group>
      {[-0.85, -0.3, 0.3, 0.85].map((x, i) => <spotLight key={i} position={[x, 1.8, 0.6]} angle={0.25} penumbra={0.6} intensity={12} distance={2.6} color="#ffe8c8" />)}
      <hemisphereLight args={["#ffe8c8", "#3a2a1a", 0.5]} />
      {/* la tierra de abajo y las herramientas */}
      <mesh position={[0, 0.0, -0.05]}><boxGeometry args={[2.6, 0.86, 0.5]} /><meshStandardMaterial map={dirtT([84, 64, 46])} roughness={1} /></mesh>
      {[[-0.95, "pala"], [-0.55, "carbon"], [-0.15, "bolo"], [0.25, "remache"], [0.65, "mascara"], [1.0, "casco"]].map(([x, k], i) => { const o = on(i);
        return <group key={i} position={[x as number, -0.08, 0.26]} scale={1.6 + 0.3 * o}>
          {k === "pala" && <Shovel rot={[0, 0, 0.2]} s={1.0} />}
          {k === "carbon" && Array.from({ length: 5 }, (_, j) => <Lump key={j} i={j + 3} p={[(j % 3) * 0.04 - 0.04, Math.floor(j / 3) * 0.04, 0]} s={1.2} />)}
          {k === "bolo" && <Pin p={[0, -0.05, 0]} rot={[0, 0, 0.3]} />}
          {k === "remache" && <group><mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.012, 0.012, 0.08, 12]} /><meshStandardMaterial color="#c8381a" emissive="#ff4a10" emissiveIntensity={0.8 * o} /></mesh><mesh position={[0, 0.085, 0]}><sphereGeometry args={[0.022, 14, 8, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#c8381a" emissive="#ff4a10" emissiveIntensity={0.8 * o} /></mesh></group>}
          {k === "mascara" && <RBox s={[0.12, 0.14, 0.04]} r={0.02} p={[0, 0.04, 0]}><meshStandardMaterial color="#2a2a2a" roughness={0.6} /></RBox>}
          {k === "casco" && <mesh position={[0, 0.0, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.06, 20, 12, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#8a8a6a" metalness={0.4} roughness={0.5} /></mesh>}
          <pointLight position={[0, 0.1, 0.15]} intensity={0.3 + 2.4 * o} distance={0.6} color="#ffb060" />
        </group>; })}
    </>;
  }}</U3>;
};

// ---- CanaletaCarbon · el breaker por dentro: la canaleta inclinada con el río de carbón que baja sin parar; cuatro chicos sentados en
// tablas encima, con la lámpara prendida en la gorra en pleno día; el polvo negro flota; en «pizarra» las piedras grises salen al costado ----
const CanaletaCarbon: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "pizarra", 2.0), SL = -0.32;
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#3a3026" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [0.1, 0.62, 0], az: [-0.5, -0.32], el: [0.3, 0.26], r: [1.85, 1.7], fov: 36 }}>{(tt) => {
    const pick = (tt - aP) * 0.9;
    return <>
      <mesh position={[0, -0.01, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 3]} /><meshStandardMaterial map={dirtT([34, 30, 28])} roughness={0.8} metalness={0.2} /></mesh>
      {Array.from({ length: 70 }, (_, i) => <Lump key={"b" + i} i={i + 400} p={[(rn(i, 6) - 0.5) * 2.6, 0.01, 0.3 + rn(i, 7) * 0.7]} s={1.4 + rn(i, 8) * 1.4} col="#141416" shine />)}
      <group rotation={[0, 0, SL]} position={[0, 0.45, 0]}>
        <RBox s={[3.0, 0.03, 0.42]} r={0.005} p={[0, -0.02, 0]}>{M.wood({ base: [90, 66, 44], rx: 6 })}</RBox>
        {[-1, 1].map((s) => <RBox key={s} s={[3.0, 0.12, 0.025]} r={0.004} p={[0, 0.04, s * 0.21]}>{M.wood({ base: [80, 58, 38], rx: 6 })}</RBox>)}
        {Array.from({ length: 240 }, (_, i) => { const u = ((tt * 0.22 + rn(i, 1)) % 1); const slate = i % 9 === 0;
          return <Lump key={i} i={i} p={[1.45 - u * 2.9, 0.01 + rn(i, 4) * 0.05, (rn(i, 2) - 0.5) * 0.36]} s={1.2 + rn(i, 5) * 1.0} col={slate ? "#7a7c80" : "#121214"} shine={!slate} />; })}
        {/* las tablas cruzadas y los chicos */}
        {[-0.5, 0.0, 0.5, 1.0].map((x, i) => <group key={i} position={[x, 0.16, 0]}>
          <RBox s={[0.08, 0.02, 0.6]} r={0.004}>{M.wood({ base: [120, 90, 60] })}</RBox>
          <group rotation={[0, 0, -SL]} position={[0, 0.01, 0]}>
            <Stickman escala={0.15} rotY={90} guion={[{ t: 0, accion: "sentarse", expr: "triste" }]} semilla={10 + i} contacto={0} color="#8a7a6a" />
            <mesh position={[0.02, 0.27, 0]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#ffd27a" })}</mesh>
            <pointLight position={[0.06, 0.27, 0]} intensity={0.7} distance={0.5} color="#ffc070" />
          </group>
        </group>)}
      </group>
      {/* la pila de pizarra que crece al costado */}
      {Array.from({ length: 16 }, (_, i) => { const a = aP + i * 0.3; return <Lump key={"s" + i} i={i + 200} p={[-0.3 + (i % 4) * 0.06, 0.03 + Math.floor(i / 4) * 0.035 + fallY(tt, a, 0.4), 0.42 + (rn(i, 3) - 0.5) * 0.05]} s={tt > a - 0.3 ? 1.3 : 0.001} col="#7a7c80" shine={false} />; })}
      <mesh position={[-0.2, -0.0, 0.42]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2 + 0.02 * cl(pick), 20]} /><meshStandardMaterial color="#3a3632" roughness={1} /></mesh>
      <Dust tt={tt} n={40} w={3} h={1.4} op={0.25} />
      <spotLight position={[0.2, 2.2, 1.2]} angle={0.5} penumbra={0.7} intensity={14} distance={4} color="#ffe2b8" />
      <hemisphereLight args={["#e8dcc8", "#2a2420", 0.7]} />
      {[0, 1].map((k) => <mesh key={k} position={[-0.6 + k * 1.1, 1.4, -0.6]} rotation={[0.4, 0, 0.2]}><boxGeometry args={[0.12, 2.6, 0.12]} /><meshBasicMaterial color="#e8d8b0" transparent opacity={0.05} depthWrite={false} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- CapatazPalo · detrás de la fila de chicos camina el capataz con el palo; en «palo» golpea la madera al lado de tu cabeza: la
// tabla tiembla, salta el polvo y la fila entera se encoge ----
const CapatazPalo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aH = Math.min(sec(p, "palo", 2.4), D - 1.2);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#3a3026" key1={[-1.0, 2.4, 1.4]} backDim={0.55}
    cam={{ at: [0.1, 0.35, -0.2], az: [0.5, 0.3], el: [0.14, 0.1], r: [1.3, 1.05], fov: 36 }}>{(tt) => {
    const walk = eio(tt, 0, aH - 0.35), hit = Math.exp(-Math.max(0, tt - aH) * 3) * (tt > aH ? 1 : 0), raise = eio(tt, aH - 0.6, aH - 0.15) * (tt < aH ? 1 : 0);
    return <>
      <RBox s={[2.6, 0.05, 0.5]} r={0.005} p={[0, 0.12, 0.15]}>{M.wood({ base: [70, 52, 36], rx: 5 })}</RBox>
      {Array.from({ length: 60 }, (_, i) => <Lump key={i} i={i} p={[((tt * 0.3 + rn(i, 1)) % 1) * 2.4 - 1.2, 0.16, 0.15 + (rn(i, 2) - 0.5) * 0.3]} s={1} />)}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => { const you = i === 2; return <group key={i} position={[x, 0.2 + (you ? 0.01 * hit * Math.sin(tt * 60) : 0), -0.12]}>
        <RBox s={[0.3, 0.025, 0.1]} r={0.004}>{M.wood({ base: [120, 90, 60] })}</RBox>
        <group position={[0, 0.012, 0]} scale={[1, 1 - 0.12 * hit, 1]}><Stickman escala={0.12} rotY={180} guion={[{ t: 0, accion: "sentarse", expr: "triste" }, { t: aH, accion: "asustarse", expr: "asustado" }] as any} semilla={20 + i} contacto={0} color={you ? "#c8442a" : "#8a7a6a"} /></group></group>; })}
      {/* el capataz con el palo */}
      <group position={[lerp(-1.2, 0.32, walk) + 0.012 * hit * Math.sin(tt * 45), 0, -0.5]}>
        <Stickman escala={0.2} rotY={walk < 0.99 ? 90 : 160} guion={[{ t: 0, accion: "caminar", expr: "enojado" }, { t: aH - 0.4, accion: "senalar", expr: "enojado" }] as any} semilla={33} contacto={0.3} colorContacto="#0a0806" color="#2a2420" />
        <group position={[0.08, 0.38, 0.12]} rotation={[0, 0, 0.6 + 1.2 * raise - 1.3 * eio(tt, aH - 0.15, aH)]}><mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.03, 0.036, 0.62, 10]} />{M.wood({ base: [160, 108, 60] })}</mesh></group>
      </group>
      {Array.from({ length: 14 }, (_, i) => { const ph = cl((tt - aH) / 0.8); return <mesh key={"p" + i} position={[0.2 + (rn(i, 1) - 0.5) * 0.3 * ph, 0.22 + ph * 0.25 * rn(i, 2), -0.12 + (rn(i, 3) - 0.5) * 0.2 * ph]} scale={sm(ph > 0 && ph < 1 ? 1.6 * (1 - ph) : 0)}>
        <sphereGeometry args={[0.025, 8, 6]} /><meshBasicMaterial color="#3a342e" transparent opacity={0.6} depthWrite={false} /></mesh>; })}
      <pointLight position={[0.2, 0.5, 0.2]} intensity={0.4 + 2.0 * hit} distance={1.2} color="#ffd8a0" />
      <Dust tt={tt} n={30} w={2.6} h={1.2} op={0.22} />
      <spotLight position={[0.2, 2.2, 1.0]} angle={0.5} penumbra={0.7} intensity={12} distance={4} color="#ffe2b8" />
      <hemisphereLight args={["#e8dcc8", "#2a2420", 0.6]} />
    </>;
  }}</U3>;
};

// ---- PiesCanaleta · la canaleta termina abajo en dos rodillos de hierro con dientes que giran; el veterano está sentado con las
// piernas a los costados; en «maquina» una piedra grande baja, entra entre los rodillos y sale hecha polvo ----
const PiesCanaleta: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = Math.min(sec(p, "maquina", 2.2), D - 1.4);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#3a3026" key1={[-1.0, 2.4, 1.6]}
    cam={{ at: [0.5, 0.25, 0], az: [-0.3, -0.1], el: [0.16, 0.12], r: [1.4, 1.2], fov: 36 }}>{(tt) => {
    const rot = tt * 4, big = cl((tt - aM + 1.4) / 1.4), crush = cl((tt - aM) / 0.9);
    return <>
      <group rotation={[0, 0, -0.32]} position={[0, 0.5, 0]}>
        <RBox s={[2.0, 0.03, 0.4]} r={0.005} p={[0, -0.02, 0]}>{M.wood({ base: [90, 66, 44], rx: 4 })}</RBox>
        {[-1, 1].map((s) => <RBox key={s} s={[2.0, 0.1, 0.025]} r={0.004} p={[0, 0.035, s * 0.2]}>{M.wood({ base: [80, 58, 38], rx: 4 })}</RBox>)}
        {Array.from({ length: 70 }, (_, i) => <Lump key={i} i={i} p={[0.95 - ((tt * 0.25 + rn(i, 1)) % 1) * 1.9, 0.015, (rn(i, 2) - 0.5) * 0.32]} s={0.9 + rn(i, 5) * 0.6} />)}
        {tt < aM && <Lump i={77} p={[lerp(-0.9, 0.95, big), 0.04, 0]} s={3.2} col="#6a6c70" shine={false} />}
        {/* el veterano: sentado en la tabla, las piernas afuera de la canaleta */}
        <group position={[-0.3, 0.16, 0]}>
          <RBox s={[0.08, 0.02, 0.62]} r={0.004}>{M.wood({ base: [120, 90, 60] })}</RBox>
          <group rotation={[0, 0, 0.32]} position={[0, 0.01, -0.26]}><Stickman escala={0.16} rotY={90} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }]} semilla={41} contacto={0} color="#c8a070" /></group>
        </group>
      </group>
      {/* los rodillos dentados al pie */}
      {[0, 1].map((k) => <group key={k} position={[1.0 + k * 0.17, -0.02 - k * 0.02, 0]} rotation={[0, 0, (k ? 1 : -1) * rot]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.42, 24]} />{M.steel({ col: "#8a8c8e" })}</mesh>
        {Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[Math.cos(j * PI / 6) * 0.115, Math.sin(j * PI / 6) * 0.115, 0]} rotation={[0, 0, j * PI / 6]}><boxGeometry args={[0.04, 0.03, 0.4]} />{M.steel({ col: "#b8bcc0" })}</mesh>)}
      </group>)}
      {Array.from({ length: 24 }, (_, i) => { const ph = cl(crush * (0.6 + 0.6 * rn(i, 1))); return <mesh key={"c" + i} position={[1.08 + (rn(i, 2) - 0.5) * 0.3 * ph, -0.1 - ph * 0.4, (rn(i, 3) - 0.5) * 0.3]} scale={sm(tt > aM ? 1 - ph * 0.5 : 0)}>
        <dodecahedronGeometry args={[0.012, 0]} /><meshStandardMaterial color="#6a6c70" roughness={0.9} /></mesh>; })}
      <pointLight position={[1.08, 0.15, 0.3]} intensity={0.3 + 1.6 * Math.exp(-Math.max(0, tt - aM) * 3) * (tt > aM ? 1 : 0)} distance={1.0} color="#ff7a4a" />
      <Dust tt={tt} n={24} w={2.4} h={1.0} op={0.2} />
      <spotLight position={[0.9, 1.8, 0.9]} angle={0.45} penumbra={0.7} intensity={14} distance={4} color="#ffe2b8" />
      <hemisphereLight args={["#e8dcc8", "#2a2420", 0.6]} />
    </>;
  }}</U3>;
};

// ---- CorteCulebra · la zanja gigante de barro rojo bajo la lluvia: las vías en el fondo con el trencito, las palas de vapor arriba
// como juguetes; en «derrumbe» una pared entera se desliza y tapa las vías ----
const CorteCulebra: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aD = Math.min(sec(p, "derrumbe", 2.6), D - 1.8);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#5a5e62" key1={[-1.2, 2.6, 1.4]}
    cam={{ at: [0, 0.18, 0], az: [-0.12, 0.1], el: [1.0, 0.92], r: [2.0, 1.85], fov: 38 }}>{(tt) => {
    const sl = eio(tt, aD, aD + 1.1), train = (tt * 0.12) % 1;
    const RED = [150, 70, 44];
    return <>
      <mesh position={[0, -0.05, 0]}><boxGeometry args={[3.4, 0.08, 0.4]} /><meshStandardMaterial map={dirtT([120, 60, 40])} roughness={0.6} /></mesh>
      {[-0.05, 0.05].map((z, i) => <mesh key={i} position={[0, 0.0, z]}><boxGeometry args={[3.4, 0.012, 0.012]} />{M.steel({ col: "#5a5452" })}</mesh>)}
      {Array.from({ length: 4 }, (_, i) => <RBox key={i} s={[0.28, 0.12, 0.18]} r={0.01} p={[-1.6 + ((train + i * 0.095) % 1) * 3.2, 0.08, 0]}><meshStandardMaterial color={i ? "#5a4030" : "#202020"} roughness={0.8} /></RBox>)}
      {/* las dos paredes en talud */}
      <mesh position={[0, 0.35, -0.62]} rotation={[-0.75, 0, 0]}><boxGeometry args={[3.4, 1.1, 0.12]} /><meshStandardMaterial map={dirtT(RED)} roughness={0.85} /></mesh>
      <group position={[lerp(0, 0.1, sl), lerp(0, -0.42, sl), lerp(0, -0.45, sl)]} rotation={[0.75 + 0.3 * sl, 0, 0.05 * sl]}>
        <mesh position={[0, 0.35, 0.62]}><boxGeometry args={[3.4, 1.1, 0.12]} /><meshStandardMaterial map={dirtT([156, 76, 48])} roughness={0.85} /></mesh></group>
      <mesh position={[0, 0.72, 0.95]}><boxGeometry args={[3.4, 0.06, 0.6]} /><meshStandardMaterial map={dirtT([90, 96, 60])} roughness={1} /></mesh>
      <mesh position={[0, 0.72, -0.95]}><boxGeometry args={[3.4, 0.06, 0.6]} /><meshStandardMaterial map={dirtT([90, 96, 60])} roughness={1} /></mesh>
      {/* las palas de vapor arriba, chiquitas */}
      {[[-1.0, -0.9], [0.6, -0.95], [1.3, 0.9]].map(([x, z], i) => <group key={i} position={[x, 0.75, z]} rotation={[0, i ? 0.5 : -0.3, 0]} scale={1.8}>
        <RBox s={[0.16, 0.1, 0.1]} r={0.01} p={[0, 0.05, 0]}><meshStandardMaterial color="#1e1c1a" metalness={0.4} roughness={0.6} /></RBox>
        <mesh position={[-0.04, 0.16, 0]}><cylinderGeometry args={[0.012, 0.012, 0.1, 8]} /><meshStandardMaterial color="#1e1c1a" /></mesh>
        <group position={[0.06, 0.08, 0]} rotation={[0, 0, -0.6 + 0.3 * Math.sin(tt * 1.5 + i)]}><RBox s={[0.22, 0.02, 0.02]} r={0.004} p={[0.11, 0, 0]}><meshStandardMaterial color="#2a2826" /></RBox></group>
        {[0, 1, 2].map((k) => { const ph = (tt * 0.5 + k / 3 + i * 0.2) % 1; return <mesh key={k} position={[-0.04, 0.22 + ph * 0.3, 0]} scale={0.5 + ph}><sphereGeometry args={[0.03, 8, 6]} /><meshBasicMaterial color="#c8c8c4" transparent opacity={0.5 * (1 - ph)} depthWrite={false} /></mesh>; })}
      </group>)}
      {/* los obreros en el fondo, chiquitos */}
      {[-0.7, -0.35, 0.25, 0.55].map((x, i) => <group key={i} position={[x, 0, 0.17]}><Stickman escala={0.14} rotY={i % 2 ? 30 : -30} guion={[{ t: 0, accion: "empujar", expr: "triste" }, { t: aD, accion: "correr", expr: "asustado" }] as any} semilla={60 + i} contacto={0} color="#3a2a22" /></group>)}
      {Array.from({ length: 20 }, (_, i) => { const ph = cl((tt - aD - 0.3) / 1.4); return <mesh key={"d" + i} position={[(rn(i, 1) - 0.5) * 2.6, 0.1 + ph * 0.4 * rn(i, 2), 0.15 + rn(i, 3) * 0.3]} scale={sm(ph > 0 ? (0.5 + rn(i, 4)) * (1 - 0.6 * ph) : 0)}>
        <sphereGeometry args={[0.12, 10, 8]} /><meshBasicMaterial color="#9a6a50" transparent opacity={0.45} depthWrite={false} /></mesh>; })}
      <Rain tt={tt} n={120} w={3.2} h={1.6} z={1.0} op={0.3} />
    </>;
  }}</U3>;
};

// ---- OroPlata · dos ventanillas de pago: «oro» con una fila corta y una pila de monedas doradas; «plata» con una fila larguísima
// y monedas plateadas que caen de a muchas, pero valen menos (la pila dorada pesa más en la balanza del medio) ----
const OroPlata: React.FC<UP> = ({ d, p }) => {
  const aO = sec(p, "oro", 1.0), aP = sec(p, "plata", 2.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [0, 0.4, 0.1], az: [-0.1, 0.1], el: [0.24, 0.2], r: [2.1, 1.95], fov: 36 }}>{(tt) => {
    const tilt = 0.22 * eio(tt, aP + 0.8, aP + 1.8);
    return <>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.75, 0, -0.3]}>
        <RBox s={[0.5, 0.6, 0.06]} r={0.01} p={[0, 0.3, 0]}>{M.wood({ base: s < 0 ? [140, 100, 50] : [110, 110, 110] })}</RBox>
        <mesh position={[0, 0.42, 0.031]}><planeGeometry args={[0.24, 0.16]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffc060" emissiveIntensity={0.9} /></mesh>
        <mesh position={[0, 0.42, 0.05]}><sphereGeometry args={[0.03, 12, 10]} />{s < 0 ? M.brass({ col: "#e0b040", em: "#ffb020", emI: 0.4 }) : M.chrome({ col: "#d8dce0" })}</mesh>
        {Array.from({ length: s < 0 ? 2 : 9 }, (_, i) => <group key={i} position={[-s * 0.07 * i, 0, 0.2 + i * 0.075]} scale={pop(tt, (s < 0 ? aO : aP) + i * 0.05)}><Stickman escala={0.12} rotY={180} guion={[{ t: 0, accion: "idle", expr: s < 0 ? "decidido" : "triste" }]} semilla={i + (s < 0 ? 0 : 20)} contacto={0.3} colorContacto="#2a1a10" color={s < 0 ? "#e8e4dc" : "#4a3a30"} /></group>)}
      </group>)}
      {/* la balanza del medio: a la izquierda pocas de oro, a la derecha muchas de plata, y pesa más el oro */}
      <group position={[0, 0, 0.35]} scale={1.5}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.012, 0.02, 0.4, 10]} />{M.brass()}</mesh>
        <group position={[0, 0.4, 0]} rotation={[0, 0, tilt]}><RBox s={[0.6, 0.016, 0.02]} r={0.004}>{M.brass()}</RBox>
          {[-1, 1].map((s) => <group key={s} position={[s * 0.28, -0.08, 0]} rotation={[0, 0, -tilt]}>
            <mesh><cylinderGeometry args={[0.1, 0.09, 0.012, 28]} />{M.brass({ col: "#b88c40" })}</mesh>
            {Array.from({ length: s < 0 ? 5 : 22 }, (_, i) => { const a = (s < 0 ? aO : aP) + 0.2 + i * (s < 0 ? 0.15 : 0.05);
              return <group key={i} visible={tt > a - 0.3}><Coin p={[(rn(i, 1) - 0.5) * (s < 0 ? 0.02 : 0.12), 0.012 + (s < 0 ? i * 0.006 : Math.floor(i / 6) * 0.006) + fallY(tt, a, 0.4), (rn(i, 2) - 0.5) * (s < 0 ? 0.02 : 0.12)]} r={0.022} silver={s > 0} rot={[0, 0, 0]} /></group>; })}
          </group>)}</group>
      </group>
      <spotLight position={[-0.75, 1.8, 0.6]} angle={0.3} penumbra={0.6} intensity={10 * eio(tt, aO, aO + 0.4) + 3} distance={3} color="#ffd890" />
      <spotLight position={[0.75, 1.8, 0.6]} angle={0.3} penumbra={0.6} intensity={8 * eio(tt, aP, aP + 0.4) + 3} distance={3} color="#d8e4f0" />
    </>;
  }}</U3>;
};

// ---- GrietaAviso · el borde de arriba de la zanja: en «raja» se abre una grieta larga en el pasto; el viejo la mira y se va a otro
// sector; en «trueno» el borde entero se suelta y cae hacia la zanja ----
const GrietaAviso: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aR = sec(p, "raja", 1.0), aT = Math.min(Math.max(sec(p, "trueno", 3.2), aR + 1.5), D - 1.4);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#4a4e52" key1={[-1.2, 2.6, 1.4]}
    cam={{ at: [0, 0.15, 0], az: [-0.45, -0.25], el: [0.42, 0.34], r: [1.7, 1.45], fov: 36 }}>{(tt) => {
    const crack = eio(tt, aR, aR + 1.0), fall = eio(tt, aT, aT + 1.0), shake = tt > aT - 0.6 && tt < aT ? 0.004 * Math.sin(tt * 80) : 0;
    return <>
      <mesh position={[0, 0.0, -0.4]}><boxGeometry args={[3, 0.3, 0.8]} /><meshStandardMaterial map={dirtT([150, 74, 46])} roughness={0.9} /></mesh>
      <mesh position={[0, 0.151, -0.4]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 0.8]} /><meshStandardMaterial map={dirtT([88, 104, 56])} roughness={1} /></mesh>
      {/* el borde que se va a soltar */}
      <group position={[shake, -fall * 0.9, 0.25 + fall * 0.35]} rotation={[fall * 0.9, 0, 0]}>
        <mesh position={[0, 0.0, 0]}><boxGeometry args={[3, 0.3, 0.5]} /><meshStandardMaterial map={dirtT([156, 78, 48])} roughness={0.9} /></mesh>
        <mesh position={[0, 0.151, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 0.5]} /><meshStandardMaterial map={dirtT([92, 108, 58])} roughness={1} /></mesh>
        <group position={[0.4, 0.15, 0.05]} visible={fall < 0.05}><Stickman escala={0.12} rotY={20} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={71} contacto={0.3} colorContacto="#3a2a1a" color="#5a4a3e" /></group>
      </group>
      {/* la grieta: una línea zigzag que crece de izquierda a derecha */}
      {Array.from({ length: 24 }, (_, i) => { const u = i / 24, on = cl((crack - u) * 6); return <mesh key={i} position={[-1.3 + u * 2.6, 0.155, 0.005 + 0.025 * Math.sin(i * 1.7)]} rotation={[-PI / 2, 0, 0.6 * Math.sin(i * 2.3)]} scale={[sm(on), 1, 1]}>
        <planeGeometry args={[0.16, 0.05 + 0.13 * on]} /><meshBasicMaterial color="#0a0604" /></mesh>; })}
      {Array.from({ length: 14 }, (_, i) => { const u = (i + 0.5) / 14, on = cl((crack - u) * 6), dr = cl((tt - aR - 0.4 - u * 0.8) / 1.2); return <mesh key={"pz" + i} position={[-1.3 + u * 2.6, 0.16 - 0.25 * dr * dr, 0.005]} rotation={[dr * 1.2, 0, 0]} scale={sm(on * (1 - 0.8 * dr))}><boxGeometry args={[0.05, 0.02, 0.03]} /><meshStandardMaterial color="#5a6a38" roughness={1} /></mesh>; })}
      {/* el viejo mira la grieta y se va */}
      <group position={[lerp(-0.3, -0.85, eio(tt, aR + 0.8, aT)), 0.15, -0.3]}>
        <Stickman escala={0.13} rotY={tt < aR + 0.8 ? 180 : -90} guion={[{ t: 0, accion: "idle", expr: "pensativo" }, { t: aR + 0.3, accion: "senalar", expr: "nervioso" }, { t: aR + 0.8, accion: "caminar", expr: "decidido" }] as any} semilla={72} contacto={0.3} colorContacto="#3a2a1a" color="#e8e4dc" />
      </group>
      {Array.from({ length: 18 }, (_, i) => { const ph = cl((tt - aT) / 1.2); return <mesh key={"p" + i} position={[(rn(i, 1) - 0.5) * 2.6, 0.1 - ph * 0.6 + ph * 0.3 * rn(i, 2), 0.4 + ph * 0.3]} scale={sm(ph > 0 ? 0.5 + rn(i, 3) : 0)}>
        <sphereGeometry args={[0.09, 10, 8]} /><meshBasicMaterial color="#9a6a50" transparent opacity={0.5 * (1 - ph * 0.5)} depthWrite={false} /></mesh>; })}
      <Rain tt={tt} n={80} w={3} h={1.4} z={0.8} op={0.25} />
    </>;
  }}</U3>;
};

// ---- FosoBolos · al final de la pista: los diez bolos de madera, la bola negra que viene por la madera brillante; en «crash» los
// bolos vuelan para todos lados y el chico, en el hueco del costado, se cubre ----
const SPOT10 = [[0, 0], [-0.5, 1], [0.5, 1], [-1, 2], [0, 2], [1, 2], [-1.5, 3], [-0.5, 3], [0.5, 3], [1.5, 3]];
const FosoBolos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aC = Math.min(sec(p, "crash", 2.0), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-0.8, 2.4, 1.6]} backDim={0.6}
    cam={{ at: [-0.12, 0.12, -0.45], az: [0.22, 0.4], el: [0.2, 0.16], r: [1.05, 0.9], fov: 36 }}>{(tt) => {
    const ball = eio(tt, aC - 1.0, aC);
    return <>
      <mesh position={[0, -0.01, 0.9]}><boxGeometry args={[0.5, 0.02, 3.0]} /><meshPhysicalMaterial map={tex.wood(1, 8, [200, 150, 96])} roughness={0.45} clearcoat={0.3} clearcoatRoughness={0.4} /></mesh>
      <RBox s={[1.8, 0.7, 0.06]} r={0.01} p={[0, 0.25, -1.0]}>{M.wood({ base: [60, 40, 26] })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.315, -0.055, 0.9]} rotation={[0, 0, 0]}><boxGeometry args={[0.11, 0.03, 3.0]} /><meshStandardMaterial color="#1a1614" /></mesh>)}
      <mesh position={[0, -0.12, -0.7]}><boxGeometry args={[1.0, 0.2, 0.5]} /><meshStandardMaterial color="#0e0c0a" /></mesh>
      {SPOT10.map(([c, r], i) => { const x = c * 0.06, z = -0.35 - r * 0.06; const k = cl((tt - aC - 0.02 * r) / 0.9), hit = tt > aC + 0.02 * r;
        const vx = (rn(i, 1) - 0.5) * 1.4 + c * 0.3, vz = -0.4 - rn(i, 2) * 0.6, vy = 0.6 + rn(i, 3) * 0.6, t = hit ? k * 0.9 : 0;
        return <Pin key={i} p={[x + vx * t, Math.max(0, vy * t - 1.2 * t * t), z + vz * t]} rot={[hit ? -k * (3 + rn(i, 4) * 4) : 0, 0, hit ? k * (rn(i, 5) - 0.5) * 6 : 0]} />; })}
      <mesh position={[0, 0.06, lerp(0.9, -0.36, ball) - (tt > aC ? (tt - aC) * 0.5 : 0)]} rotation={[-ball * 30, 0, 0]}><sphereGeometry args={[0.06, 32, 24]} /><meshPhysicalMaterial color="#121214" roughness={0.12} clearcoat={1} /></mesh>
      {/* el chico en el hueco del costado */}
      <group position={[-0.45, -0.02, -0.55]}><Stickman escala={0.16} rotY={60} guion={[{ t: 0, accion: "idle", expr: "nervioso" }, { t: aC - 0.1, accion: "asustarse", expr: "asustado" }] as any} semilla={81} contacto={0.3} colorContacto="#0a0806" color="#e8e4dc" /></group>
      <spotLight position={[0, 1.6, 0.2]} angle={0.75} penumbra={0.8} intensity={10} distance={4} color="#ffe0b0" />
      <hemisphereLight args={["#ffe8c8", "#2a2018", 0.4]} />
      <pointLight position={[0, 0.2, -0.3]} intensity={1.5 * Math.exp(-Math.max(0, tt - aC) * 4) * (tt > aC ? 1 : 0)} distance={1.0} color="#fff0d0" />
    </>;
  }}</U3>;
};

// ---- RepisaPies · la regla del veterano: sentado en la repisa con las piernas arriba; la bola entra, los bolos vuelan por debajo de
// sus pies; espera hasta que el último deja de rodar y recién ahí baja ----
const RepisaPies: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aC = Math.min(sec(p, "impacto", 1.6), D - 2.2), aQ = Math.min(aC + 1.6, D - 0.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-0.8, 2.4, 1.6]} backDim={0.3}
    cam={{ at: [-0.15, 0.2, -0.45], az: [-0.65, -0.45], el: [0.16, 0.12], r: [1.0, 0.88], fov: 36 }}>{(tt) => {
    const down = eio(tt, aQ, aQ + 0.5), roll = (i: number) => cl((tt - aC) / (0.8 + rn(i, 6) * 0.9));
    return <>
      <mesh position={[0, -0.12, -0.6]}><boxGeometry args={[1.2, 0.2, 0.7]} /><meshStandardMaterial color="#14110e" /></mesh>
      <RBox s={[0.5, 0.02, 0.8]} r={0.004} p={[0, -0.01, 0.4]}><meshPhysicalMaterial map={tex.wood(1, 3, [200, 150, 96])} roughness={0.15} clearcoat={1} /></RBox>
      {/* la repisa a un costado */}
      <RBox s={[0.26, 0.03, 0.4]} r={0.006} p={[-0.42, 0.28, -0.55]}>{M.wood({ base: [120, 84, 50] })}</RBox>
      {[-0.1, 0.1].map((z, i) => <mesh key={i} position={[-0.52, 0.13, -0.55 + z]}><cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />{M.wood({ base: [90, 60, 34] })}</mesh>)}
      <group position={[lerp(-0.42, -0.2, down), lerp(0.295, -0.02, down), -0.55]}>
        <Stickman escala={0.1} rotY={90} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }, { t: aQ, accion: "idle", expr: "decidido" }] as any} semilla={82} contacto={0} color="#e8e4dc" /></group>
      {SPOT10.map(([c, r], i) => { const k = roll(i), hit = tt > aC, ang = rn(i, 1) * 2 * PI;
        return <Pin key={i} p={[c * 0.06 + (hit ? Math.cos(ang) * 0.35 * eio(k, 0, 1) : 0), hit ? Math.max(0, 0.25 * Math.sin(PI * cl(k * 1.6))) : 0, -0.35 - r * 0.06 + (hit ? Math.sin(ang) * 0.3 * eio(k, 0, 1) - 0.1 : 0)]}
          rot={[hit ? PI / 2 * cl(k * 2) : 0, hit ? k * 6 * (1 - k) : 0, hit ? (rn(i, 3) - 0.5) * PI * cl(k * 2) : 0]} />; })}
      <mesh position={[0, 0.06, lerp(1.2, -0.4, eio(tt, aC - 0.9, aC)) - (tt > aC ? (tt - aC) * 0.4 : 0)]} rotation={[-tt * 12, 0, 0]}><sphereGeometry args={[0.06, 32, 24]} /><meshPhysicalMaterial color="#121214" roughness={0.12} clearcoat={1} /></mesh>
      <spotLight position={[-0.3, 1.3, 0.0]} angle={0.45} penumbra={0.6} intensity={9} distance={3} color="#ffe0b0" />
      <pointLight position={[-0.42, 0.5, -0.4]} intensity={0.8 * down} distance={0.8} color="#c8f0a0" />
    </>;
  }}</U3>;
};

// ---- RelojEscuela · el reloj de la bolera corre hasta pasada la medianoche; la luz se va de amarilla a azul; y a la mañana el
// mismo chico está dormido sobre el pupitre ----
const RelojEscuela: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aE = Math.min(sec(p, "escuela", 2.6), D - 1.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" key1={[-1.0, 2.4, 1.6]} backDim={0.25}
    cam={{ at: [0, 0.55, 0], at1: [0.4, 0.32, 0.1], az: [-0.1, -0.22], el: [0.06, 0.16], r: [1.6, 1.55], fov: 36 }}>{(tt) => {
    const night = eio(tt, 0, aE), morning = eio(tt, aE - 0.4, aE + 1.8), hr = lerp(19, 24.5, night), mn = (hr % 1) * 2 * PI;
    return <>
      <RBox s={[2.4, 1.4, 0.06]} r={0.01} p={[0, 0.7, -0.4]}><meshStandardMaterial color={new THREE.Color("#5a4a38").lerp(new THREE.Color("#c8c0b0"), morning)} roughness={0.95} /></RBox>
      <group position={[-0.25, 0.8, -0.36]} scale={1.3}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.26, 0.26, 0.04, 48]} />{M.wood({ base: [90, 60, 34] })}</mesh>
        <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.23, 48]} /><meshStandardMaterial color="#f0e8d6" roughness={0.8} /></mesh>
        {Array.from({ length: 12 }, (_, i) => { const a = i * PI / 6; return <mesh key={i} position={[Math.sin(a) * 0.2, Math.cos(a) * 0.2, 0.023]}><circleGeometry args={[i % 3 ? 0.008 : 0.015, 10]} /><meshBasicMaterial color="#2a1a10" /></mesh>; })}
        <group position={[0, 0, 0.026]} rotation={[0, 0, -(hr % 12) / 12 * 2 * PI]}><RBox s={[0.016, 0.12, 0.004]} r={0.003} p={[0, 0.05, 0]}><meshStandardMaterial color="#1a1210" /></RBox></group>
        <group position={[0, 0, 0.03]} rotation={[0, 0, -mn]}><RBox s={[0.01, 0.18, 0.004]} r={0.002} p={[0, 0.08, 0]}><meshStandardMaterial color="#1a1210" /></RBox></group>
      </group>
      {/* el pupitre de la mañana */}
      <group position={[0.5, 0, 0.1]}>
        <RBox s={[0.5, 0.03, 0.34]} r={0.006} p={[0, 0.36, 0]} rot={[0.12, 0, 0]}>{M.wood({ base: [150, 110, 66] })}</RBox>
        {[[-0.22, -0.14], [0.22, -0.14], [-0.22, 0.14], [0.22, 0.14]].map(([x, z], i) => <mesh key={i} position={[x, 0.18, z]}><cylinderGeometry args={[0.01, 0.01, 0.36, 6]} />{M.steel({ col: "#2a2a2a" })}</mesh>)}
        <RBox s={[0.16, 0.025, 0.12]} r={0.004} p={[0.08, 0.39, 0]} rot={[0.12, 0, 0.1]}><meshStandardMaterial color="#6a2a1e" roughness={0.8} /></RBox>
        <group position={[-0.05, 0, 0.3]}><Stickman escala={0.15} rotY={-160} guion={[{ t: 0, accion: "dormir_de_pie", expr: "dormido" }]} semilla={83} contacto={0.3} colorContacto="#3a2a1a" color="#e8e4dc" /></group>
      </group>
      <pointLight position={[-0.3, 1.2, 0.6]} intensity={3.5 * (1 - morning)} distance={3} color={new THREE.Color("#ffc070").lerp(new THREE.Color("#7a8ac8"), night).getStyle()} />
      <directionalLight position={[1.5, 1.5, 1.2]} intensity={1.8 * morning} color="#fff4e0" />
    </>;
  }}</U3>;
};

// ---- RemacheVuelo · dos vigas a cientos de metros, la ciudad como maqueta muy abajo; a la izquierda la fragüita con los remaches al
// rojo; el calentador tira y el remache vuela en arco hasta el balde del compañero, una y otra vez ----
const RemacheVuelo: React.FC<UP> = ({ d, p }) => {
  const per = 1.5;
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#8aa4bc" key1={[-1.2, 2.8, 1.4]}
    cam={{ at: [0.0, 0.42, 0], az: [-0.26, -0.12], el: [0.34, 0.42], r: [2.3, 2.15], fov: 38 }}>{(tt) => {
    const ph = (tt % per) / per, fly = eio(ph, 0.15, 0.65), x = lerp(-0.55, 0.62, fly), y = 0.66 + Math.sin(PI * fly) * 0.32, catchK = Math.exp(-Math.max(0, ph - 0.65) * 10) * (ph > 0.65 ? 1 : 0);
    return <>
      {/* la ciudad abajo, muy lejos */}
      {Array.from({ length: 110 }, (_, i) => { const h = 0.15 + rn(i, 3) * 0.7; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 5, -2.4 + h / 2, (rn(i, 2) - 0.5) * 5]}><boxGeometry args={[0.32, h, 0.32]} /><meshStandardMaterial color="#a8a090" emissive="#ffc860" emissiveIntensity={rn(i, 5) > 0.35 ? 0.7 : 0.1} roughness={0.9} /></mesh>; })}
      <hemisphereLight args={["#d8e4f0", "#4a4a40", 0.5]} />
      <mesh position={[0, -2.62, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 8]} /><meshStandardMaterial color="#5a5a50" /></mesh>
      {/* las vigas y las columnas */}
      <IBeam L={0.7} p={[-0.6, 0.5, 0]} /><IBeam L={0.7} p={[0.62, 0.5, 0]} />
      {[-0.9, 0.95].map((x2, i) => <IBeam key={i} L={1.6} p={[x2, -0.3, 0]} rot={[0, 0, PI / 2]} />)}
      <IBeam L={1.8} p={[0, 0.5, -0.5]} rot={[0, 0, 0]} />
      {/* la fragua con brasas */}
      <group position={[-0.55, 0.55, 0.1]}>
        <mesh geometry={latheG("fragua29d", [[0, 0], [0.08, 0], [0.09, 0.06], [0.085, 0.06], [0.07, 0.01], [0, 0.01]], 24)}>{M.steel({ col: "#2a2826" })}</mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.11, 0.05, (rn(i, 2) - 0.5) * 0.11]}><dodecahedronGeometry args={[0.018, 0]} /><meshStandardMaterial color="#3a1208" emissive="#ff5a10" emissiveIntensity={0.9 + 0.3 * Math.sin(tt * 2 * PI * 1.5 + i)} /></mesh>)}
        <pointLight position={[0, 0.15, 0]} intensity={1.6} distance={1.2} color="#ff7a30" />
      </group>
      <group position={[-0.7, 0.55, 0]}><Stickman escala={0.12} rotY={90} guion={[{ t: 0, accion: "senalar", expr: "decidido" }]} semilla={91} contacto={0} color="#5a4a3e" /></group>
      <group position={[0.75, 0.55, 0]}><Stickman escala={0.12} rotY={-90} guion={[{ t: 0, accion: "idle", expr: "nervioso" }]} semilla={92} contacto={0} color="#c8442a" />
        <group position={[-0.07, 0.24 - 0.02 * catchK, 0.05]}><mesh geometry={latheG("baldeR29d", [[0, 0], [0.04, 0], [0.05, 0.07], [0.047, 0.07], [0.037, 0.005], [0, 0.005]], 20)}>{M.steel({ col: "#8a8e90" })}</mesh></group></group>
      {/* el remache al rojo en el aire */}
      <group position={[x, y, 0.05]} visible={ph > 0.12 && ph < 0.68}>
        <mesh rotation={[0, 0, tt * 14]}><cylinderGeometry args={[0.009, 0.009, 0.04, 10]} /><meshStandardMaterial color="#ff5a1a" emissive="#ff4a10" emissiveIntensity={1.8} toneMapped={false} /></mesh>
        {[1, 2, 3].map((k) => <mesh key={k} position={[-0.03 * k, -0.01 * k * (fly < 0.5 ? -1 : 1), 0]} scale={1 - k * 0.25}><sphereGeometry args={[0.008, 8, 6]} />{M.glow({ col: "#ffa040", op: 0.5 - k * 0.12 })}</mesh>)}
      </group>
      <pointLight position={[x, y, 0.15]} intensity={ph > 0.12 && ph < 0.68 ? 0.8 : 0.0001} distance={0.5} color="#ff7a30" />
    </>;
  }}</U3>;
};

// ---- RemacheCorte · corte de dos chapas con el agujero: el remache al rojo entra, el martillo le aplasta la punta (se hace cabeza),
// y al enfriarse se encoge del rojo al gris y tira de las dos chapas hasta juntarlas ----
const RemacheCorte: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = Math.min(sec(p, "martilla", 1.6), D - 2.4), aE = Math.min(Math.max(sec(p, "encoge", aM + 1.4), aM + 1.0), D - 1.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-1.0, 2.4, 1.8]} backDim={0.2}
    cam={{ at: [0, 0.3, 0], az: [-0.25, 0.15], el: [0.1, 0.06], r: [1.2, 1.05], fov: 34 }}>{(tt) => {
    const ins = eio(tt, 0.2, aM - 0.2), blows = tt > aM ? Math.min(4, Math.floor((tt - aM) / 0.25) + 1) : 0, head = cl(blows / 4), hb = tt > aM && tt < aM + 1 ? Math.exp(-(((tt - aM) % 0.25)) * 18) : 0;
    const cool = eio(tt, aE, aE + 1.2), gap = 0.03 * (1 - cool), heat = 1 - cool;
    const hot = new THREE.Color("#ff5a1a").lerp(new THREE.Color("#5a5c60"), cool);
    return <>
      {/* las dos chapas cortadas a la mitad */}
      {[1, -1].map((s) => <group key={s} position={[0, 0.3 + s * (0.06 + gap / 2), 0]}>
        {[-1, 1].map((q) => <RBox key={q} s={[0.55, 0.1, 0.4]} r={0.006} p={[q * 0.3, 0, 0]}><meshStandardMaterial color="#7a4a30" metalness={0.5} roughness={0.55} /></RBox>)}
      </group>)}
      {/* el remache: vástago + cabeza de fábrica abajo + cabeza que se forma arriba */}
      <group position={[0, lerp(1.0, 0, ins), 0]}>
        <mesh position={[0, 0.3, 0]} scale={[1, 1 - 0.06 * cool, 1]}><cylinderGeometry args={[0.026, 0.026, 0.27 + gap, 20]} /><meshStandardMaterial color={hot} emissive="#ff4010" emissiveIntensity={1.4 * heat} toneMapped={false} /></mesh>
        <mesh position={[0, 0.14 - gap / 2, 0]} rotation={[PI, 0, 0]}><sphereGeometry args={[0.05, 24, 10, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color={hot} emissive="#ff4010" emissiveIntensity={1.4 * heat} toneMapped={false} /></mesh>
        <mesh position={[0, 0.455 + gap / 2, 0]} scale={[1 + 0.9 * head, 1 - 0.45 * head, 1 + 0.9 * head]}><cylinderGeometry args={[0.026, 0.026, 0.05, 20]} /><meshStandardMaterial color={hot} emissive="#ff4010" emissiveIntensity={1.4 * heat} toneMapped={false} /></mesh>
      </group>
      <pointLight position={[0, 0.35, 0.3]} intensity={0.2 + 1.8 * heat * ins} distance={1.0} color="#ff6a2a" />
      {/* el martillo neumático */}
      <group position={[0, 0.52 + 0.06 * (1 - hb) + 0.4 * (1 - eio(tt, aM - 0.4, aM)) + 0.5 * eio(tt, aM + 1.1, aM + 1.5), 0]}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.05, 0.05, 0.16, 20]} />{M.steel({ col: "#a8acb0" })}</mesh>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.03, 0.035, 0.14, 16]} />{M.steel({ col: "#3a3e42" })}</mesh>
      </group>
      {Array.from({ length: 14 }, (_, i) => { const ph = ((tt - aM) % 0.25) / 0.25; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.3 * ph, 0.48 + 0.15 * ph * rn(i, 2), (rn(i, 3) - 0.5) * 0.2 * ph]} scale={sm(tt > aM && tt < aM + 1 ? 1 - ph : 0)}><sphereGeometry args={[0.006, 6, 6]} />{M.glow({ col: "#ffc060" })}</mesh>; })}
      {/* flechas de apriete cuando se enfría */}
      {[1, -1].map((s) => <mesh key={s} position={[0.42, 0.3 + s * 0.17, 0]} rotation={[0, 0, s > 0 ? PI : 0]} scale={sm(cool)}><coneGeometry args={[0.05, 0.12, 12]} /><meshStandardMaterial color="#e8d8b0" emissive="#e8d8b0" emissiveIntensity={0.4} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- CuatroPisos · el esqueleto del rascacielos crece: cada semana cuatro pisos de vigas nuevas aparecen de golpe; el contador de
// pisos sube y la grúa del techo sube con ellos ----
const CuatroPisos: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = Math.min(sec(p, "semana", 1.0), 0.8), W = Math.max(0.5, (D - aS - 0.8) / 6);
  const floors = (tt: number) => 4 * Math.min(6, Math.max(0, Math.floor((tt - aS) / W) + 1)) * (tt >= aS ? 1 : 0) + 8;
  return <U3 d={d} bg={p.bg} ground={[110, 104, 96]} mode="wipe" sky="#9ab0c4" key1={[-1.4, 3.0, 1.6]}
    cam={{ at: [0, 0.5, 0], at1: [0, 1.05, 0], az: [-0.5, 0.3], el: [0.12, 0.16], r: [1.7, 2.1], fov: 38 }}
    over={(tt) => <Drums v={floors(tt)} n={2} x={1500} y={110} s={1.1} unit="pisos" />}>{(tt) => {
    const nf = floors(tt), H = 0.06;
    return <>
      {Array.from({ length: 32 }, (_, f) => { const on = f < nf, born = f >= nf - 4 && tt > aS ? cl(((tt - aS) % W) / 0.3) : 1;
        return <group key={f} position={[0, f * H, 0]} visible={on} scale={[1, sm(on ? born : 0), 1]}>
          {[[-0.25, -0.2], [0.25, -0.2], [-0.25, 0.2], [0.25, 0.2], [0, -0.2], [0, 0.2]].map(([x, z], i) => <mesh key={i} position={[x, H / 2, z]}><boxGeometry args={[0.014, H, 0.014]} /><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></mesh>)}
          {[-0.2, 0.2].map((z, i) => <mesh key={"x" + i} position={[0, H, z]}><boxGeometry args={[0.52, 0.01, 0.012]} /><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></mesh>)}
          {[-0.25, 0.25].map((x, i) => <mesh key={"z" + i} position={[x, H, 0]}><boxGeometry args={[0.012, 0.01, 0.42]} /><meshStandardMaterial color="#8a4a2a" metalness={0.5} roughness={0.6} /></mesh>)}
          {f < nf - 10 && <mesh position={[0, H / 2, 0.205]}><planeGeometry args={[0.5, H * 0.9]} /><meshStandardMaterial color="#c8bca8" roughness={0.9} /></mesh>}
        </group>; })}
      {/* la grúa del techo */}
      <group position={[0.1, nf * H, 0]}>
        <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.02, 0.3, 0.02]} />{M.steel({ col: "#2a2a2a" })}</mesh>
        <group position={[0, 0.3, 0]} rotation={[0, tt * 0.6, 0]}><mesh position={[0.15, 0, 0]}><boxGeometry args={[0.4, 0.015, 0.015]} />{M.steel({ col: "#2a2a2a" })}</mesh>
          <mesh position={[0.3, -0.12, 0]}><cylinderGeometry args={[0.002, 0.002, 0.24, 4]} /><meshStandardMaterial color="#222" /></mesh>
          <IBeam L={0.2} p={[0.3, -0.25, 0]} h={0.02} /></group>
      </group>
      {Array.from({ length: 20 }, (_, i) => { const h = 0.1 + rn(i, 3) * 0.5, a = rn(i, 1) * 2 * PI, r = 1.0 + rn(i, 2) * 1.6; return <mesh key={i} position={[Math.cos(a) * r, h / 2, Math.sin(a) * r]}><boxGeometry args={[0.25, h, 0.25]} /><meshStandardMaterial color="#9a9288" roughness={0.9} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- NoEstirarse · el remache se escapa del balde; vos, en la viga, NO te estirás: gritás y lo dejás caer; la cámara lo sigue en
// caída por la estructura hasta la calle ----
const NoEstirarse: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aE = Math.min(sec(p, "escapa", 1.2), D - 2.4);
  const yR = (tt: number) => tt < aE ? 0.9 : 0.9 - 9.8 * 0.1 * Math.pow(tt - aE, 2);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#8aa4bc" key1={[-1.2, 2.8, 1.4]}
    cam={{ at: [0.1, 0.8, 0], at1: [0.3, -1.6, 0], az: [-0.3, -0.45], el: [0.1, 0.5], r: [1.65, 2.6], fov: 38 }}>{(tt) => {
    const y = Math.max(-2.55, yR(tt)), fly = eio(tt, 0.2, aE);
    return <>
      {Array.from({ length: 8 }, (_, i) => <IBeam key={i} L={1.8} p={[0, 0.7 - i * 0.45, -0.25]} />)}
      {[-0.9, 0.9].map((x, i) => <IBeam key={"c" + i} L={3.6} p={[x, -0.9, -0.25]} rot={[0, 0, PI / 2]} />)}
      <IBeam L={1.2} p={[0.2, 0.7, 0.15]} />
      {/* el borde de la viga marcado por la luz */}
      <mesh position={[0.79, 0.75, 0.15]}><boxGeometry args={[0.01, 0.02, 0.08]} />{M.glow({ col: "#ffd890", op: 0.9 })}</mesh>
      <group position={[0.55, 0.75, 0.15]}><Stickman escala={0.12} rotY={-90} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aE + 0.1, accion: "senalar", expr: "asustado" }] as any} semilla={95} contacto={0} color="#c8442a" />
        <group position={[-0.07, 0.24, 0.05]}><mesh geometry={latheG("baldeR29d", [[0, 0], [0.04, 0], [0.05, 0.07], [0.047, 0.07], [0.037, 0.005], [0, 0.005]], 20)}>{M.steel({ col: "#8a8e90" })}</mesh></group></group>
      {/* el remache: llega en arco, pega en el borde del balde y cae */}
      <group position={[tt < aE ? lerp(-0.6, 0.47, fly) : 0.47 + 0.06 * (tt - aE), tt < aE ? 0.85 + Math.sin(PI * fly) * 0.25 : y, 0.2]}>
        <mesh rotation={[0, 0, tt * 10]}><cylinderGeometry args={[0.02, 0.02, 0.08, 10]} /><meshStandardMaterial color="#ff5a1a" emissive="#ff4a10" emissiveIntensity={1.8} toneMapped={false} /></mesh>
        {[1, 2, 3, 4].map((k) => <mesh key={k} position={[0, 0.05 * k * (tt > aE ? 1 : 0), 0]} scale={1 - k * 0.2}><sphereGeometry args={[0.018, 8, 6]} />{M.glow({ col: "#ffa040", op: 0.55 - k * 0.1 })}</mesh>)}
        <pointLight intensity={1.4} distance={0.8} color="#ff7a30" />
      </group>
      {Array.from({ length: 60 }, (_, i) => { const h = 0.04 + rn(i, 3) * 0.16; return <mesh key={i} position={[(rn(i, 1) - 0.5) * 5, -2.6 + h / 2, (rn(i, 2) - 0.5) * 5]}><boxGeometry args={[0.16, h, 0.16]} /><meshStandardMaterial color="#8a8478" roughness={0.9} /></mesh>; })}
      <mesh position={[0, -2.62, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 8]} /><meshStandardMaterial color="#5a5a50" /></mesh>
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { TechoNoventa, SigloDebajo, CanaletaCarbon, CapatazPalo, PiesCanaleta, CorteCulebra, OroPlata, GrietaAviso, FosoBolos, RepisaPies, RelojEscuela, RemacheVuelo, RemacheCorte, CuatroPisos, NoEstirarse };
