// dur29c · bloque B (Edo, Murano, la pausa de las cinco cosas, Brooklyn y el ranking): la ciudad de madera y papel, el corta fuego,
// el matoi en el techo, el viento, la isla jaula, la copa con cadena, el horno de mil grados, la caña que gira, las cinco cosas, el
// cajón bajo el río, la botella de gaseosa, el catalejo en la ventana, la subida lenta y el ranking de relojes.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { Goblet, Lantern, PI, ramp, sm, Water } from "./c3k";

type UP = { d: number; p: any };
const paperT = () => { const t = tex.text("shoji", 256, 256, (g) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#5a3a20"; g.lineWidth = 8;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(256, i * 64); g.stroke(); } }); return t; };
const tileT = () => { const t = tex.text("kawara", 256, 256, (g) => { g.fillStyle = "#3e4246"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) { const gr = g.createLinearGradient(i * 32, 0, i * 32 + 32, 0); gr.addColorStop(0, "#2a2e32"); gr.addColorStop(0.5, "#6a7076"); gr.addColorStop(1, "#2a2e32"); g.fillStyle = gr; g.fillRect(i * 32, 0, 32, 256); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t; };

// casita de Edo: postes, paredes de papel y techo de tejas a dos aguas; burn 0..1 la pone negra y la baja
const Casa: React.FC<{ p: number[]; s?: number; burn?: number; fire?: number; down?: number }> = ({ p, s = 1, burn = 0, fire = 0, down = 0 }) =>
  <group position={[p[0], p[1] - 0.12 * down * s, p[2]]} scale={sm(s)} rotation={[0, 0, 0.5 * down]}>
    <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.2, 0.14, 0.16]} /><meshStandardMaterial map={paperT()} color={new THREE.Color().setRGB(1 - 0.85 * burn, 1 - 0.88 * burn, 1 - 0.9 * burn)} roughness={0.9} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0, 0.17, k * 0.045]} rotation={[k * 0.6, 0, 0]}><boxGeometry args={[0.24, 0.01, 0.12]} /><meshStandardMaterial map={tileT()} color={burn > 0.5 ? "#222" : "#fff"} roughness={0.6} /></mesh>)}
    <mesh position={[0, 0.25, 0]} scale={[1, sm(fire), 1]}><coneGeometry args={[0.08, 0.22, 10]} />{M.glow({ col: "#ff8a30", op: 0.85 * fire })}</mesh>
  </group>;

// ---- CiudadMadera · Edo en maqueta: cientos de casitas apretadas; en «flores» una chispa prende una y el fuego salta de techo en
// techo; en «mil» el contador de 1657 y media ciudad queda negra ----
const CiudadMadera: React.FC<UP> = ({ d, p }) => {
  const aF = sec(p, "flores", 1.5), aM = sec(p, "mil", 3.5);
  const N = 120, pos = Array.from({ length: N }, (_, i) => [((i % 12) - 5.5) * 0.24 + rn(i, 1) * 0.05, ((Math.floor(i / 12)) - 4.5) * 0.24 + rn(i, 2) * 0.05]);
  return <U3 over={(tt) => <Drums v={1657 * eio(tt, aM, aM + 1.0)} n={4} x={1300} y={110} s={1.0} op={eio(tt, aM, aM + 0.3)} />} d={d} bg={p.bg} ground={[96, 80, 60]} mode="drop" sky="#1a1410" key1={[-1, 2.6, 1.6]}
    cam={{ at: [0, 0, 0], az: [-0.4, -0.2], el: [0.62, 0.72], r: [2.4, 3.0], fov: 34 }}>{(tt) => {
    const front = Math.max(0, (tt - aF) * 0.55);
    return <>
      {pos.map(([x, z], i) => { const dist = Math.hypot(x - 0.9, z - 0.6), b = cl((front - dist) / 0.4), f = cl((front - dist) / 0.15) * (1 - cl((front - dist - 0.5) / 0.4));
        return <Casa key={i} p={[x, 0, z]} s={0.9} burn={b} fire={f} />; })}
      <pointLight position={[0.9 - 0.3 * front, 0.5, 0.6 - 0.3 * front]} intensity={4 * cl(tt - aF)} distance={2.5} color="#ff8a30" />
    </>;
  }}</U3>;
};

// ---- CortaFuego · la fila de casas con el fuego de un lado: en «destruian» los ganchos tiran abajo tres casas y en «hueco» queda el
// claro; el fuego llega al hueco y se frena, las casas del otro lado quedan blancas ----
const CortaFuego: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "destruian", 1.5), aH = sec(p, "hueco", 3.0);
  return <U3 d={d} bg={p.bg} ground={[96, 80, 60]} mode="wipe" sky="#1a1410" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.12, 0], az: [-0.3, -0.12], el: [0.3, 0.26], r: [2.0, 1.8], fov: 34 }}>{(tt) => {
    const fire = lerp(-1.4, -0.25, cl(tt / (aH + 1.5)));
    return <>
      {Array.from({ length: 11 }, (_, i) => { const x = -1.25 + i * 0.25, gap = i >= 5 && i <= 7, dn = gap ? eio(tt, aD + (i - 5) * 0.3, aD + (i - 5) * 0.3 + 0.7) : 0, b = cl((fire - x + 0.1) / 0.3);
        return gap && dn >= 1 ? <mesh key={i} position={[x, 0.01, 0]}><boxGeometry args={[0.2, 0.02, 0.16]} />{M.wood({ base: [80, 56, 34] })}</mesh>
          : <Casa key={i} p={[x, 0, 0]} s={1.1} burn={x < 0 ? b : 0} fire={x < 0 ? cl(b * 2) * (1 - cl((fire - x - 0.4) / 0.3)) : 0} down={dn} />; })}
      {[0.0, 0.25].map((x, i) => <group key={i} position={[x + 0.2, 0.0, 0.3]} visible={tt > aD - 0.3 && tt < aH + 1}><mesh position={[-0.1, 0.18, -0.1]} rotation={[0.6, 0, 0.7]}><cylinderGeometry args={[0.006, 0.006, 0.5, 6]} />{M.wood({ base: [110, 80, 46] })}</mesh>
        <Stickman escala={0.06} rotY={180} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={30 + i} contacto={0} color="#2a3a5a" /></group>)}
      <pointLight position={[fire, 0.4, 0.2]} intensity={3.5} distance={1.6} color="#ff8030" />
    </>;
  }}</U3>;
};

// ---- MatoiTecho · el bombero sube al techo con el matoi (el estandarte de tiras blancas); en «techo» lo clava en la cumbrera y las
// tiras giran; en «honor» la cámara rodea y el humo pasa detrás ----
const MatoiTecho: React.FC<UP> = ({ d, p }) => {
  const aT = sec(p, "techo", 1.5), aH = sec(p, "honor", 3.5);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#2a2420" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.55, 0], az: [-0.5, 0.35], el: [0.06, 0.12], r: [1.4, 1.3], fov: 34 }}>{(tt) => {
    const up = eio(tt, 0.2, aT), spin = tt > aT ? (tt - aT) * 2.4 : 0;
    return <>
      {[-1, 1].map((k) => <mesh key={k} position={[0, 0.3, k * 0.18]} rotation={[k * 0.75, 0, 0]}><boxGeometry args={[1.4, 0.02, 0.5]} /><meshStandardMaterial map={tileT()} roughness={0.6} /></mesh>)}
      <mesh position={[0, 0.48, 0]}><boxGeometry args={[1.4, 0.04, 0.05]} /><meshStandardMaterial color="#2a2e32" /></mesh>
      <group position={[lerp(-0.55, -0.1, up), lerp(0.2, 0.5, up), 0.0]}><Stickman escala={0.09} rotY={90} guion={[{ t: 0, accion: "caminar", expr: "decidido" }, { t: aT, accion: "idle", expr: "decidido" }]} semilla={33} contacto={0} color="#2a3a5a" /></group>
      <group position={[lerp(-0.45, 0.02, up), lerp(0.35, 0.5, up), 0]}>
        <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.008, 0.008, 0.7, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh>
        <group position={[0, 0.72, 0]} rotation={[0, spin, 0]}>
          <mesh><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color="#f2eee4" roughness={0.6} /></mesh>
          <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.12, 0.05, 0.04]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
          {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * 2 * PI, fl = 0.15 * Math.min(1, spin * 0.3); return <mesh key={i} position={[Math.cos(a) * (0.05 + fl * 0.5), -0.1, Math.sin(a) * (0.05 + fl * 0.5)]} rotation={[Math.sin(a) * fl * 3, 0, -Math.cos(a) * fl * 3]}><boxGeometry args={[0.012, 0.16, 0.002]} /><meshStandardMaterial color="#f8f6f0" side={THREE.DoubleSide} /></mesh>; })}
        </group>
      </group>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.8 - ((tt * 0.15 + i * 0.2) % 2), 0.7 + rn(i, 1) * 0.4, -0.7 - rn(i, 2) * 0.3]}><sphereGeometry args={[0.18 + rn(i, 3) * 0.12, 12, 10]} /><meshStandardMaterial color="#4a4440" transparent opacity={0.35 * eio(tt, aH - 1, aH)} depthWrite={false} /></mesh>)}
      <pointLight position={[0.6, 0.3, -0.6]} intensity={2.5} distance={2} color="#ff7a30" />
    </>;
  }}</U3>;
};

// ---- VientoNoFuego · la manga de viento (tira de tela en un palo) al frente y el fuego detrás: en «viento» la tira apunta a la
// izquierda y las llamas se inclinan igual; en «cambia» la tira gira y las llamas se vuelven hacia vos ----
const VientoNoFuego: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "viento", 1.2), aC = sec(p, "cambia", 3.0);
  return <U3 d={d} bg={p.bg} ground={[90, 74, 56]} mode="wipe" sky="#1c1612" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.35, 0], az: [-0.12, 0.1], el: [0.1, 0.08], r: [1.6, 1.4], fov: 34 }}>{(tt) => {
    const dir = lerp(-1, 0.25, eio(tt, aC, aC + 0.9)), wob = 0.08 * Math.sin(tt * 2 * PI * 1.2);
    return <>
      <group position={[-0.3, 0, 0.35]}><mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.008, 0.008, 0.7, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh>
        <group position={[0, 0.66, 0]} rotation={[0, -PI / 2 * dir + PI / 2, 0]}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.05 + i * 0.05, -i * 0.006, Math.sin(tt * 5 + i) * 0.01 * i]} rotation={[0, wob * i, 0]}><boxGeometry args={[0.05, 0.05, 0.002]} /><meshStandardMaterial color="#f4f0e6" side={THREE.DoubleSide} /></mesh>)}</group></group>
      {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.6 + i * 0.2, 0, -0.4]}>
        <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.16, 0.14, 0.14]} /><meshStandardMaterial color="#2a201a" /></mesh>
        <mesh position={[dir * -0.06, 0.24, 0.08 * cl(-dir)]} rotation={[cl(-dir) * -0.5, 0, dir * 0.5]} scale={[1, 1.1 + 0.1 * Math.sin(tt * 2 * PI * 1.5 + i), 1]}><coneGeometry args={[0.07, 0.24, 10]} />{M.glow({ col: "#ff8a30", op: 0.85 })}</mesh></group>)}
      <pointLight position={[0, 0.4, -0.2]} intensity={3.5 + eio(tt, aC, aC + 0.9) * 2} distance={2} color="#ff8030" />
      <group position={[0.35, 0, 0.3]}><Stickman escala={0.08} rotY={-20} guion={[{ t: 0, accion: "senalar", expr: "decidido" }, { t: aC + 0.3, accion: "asustarse", expr: "asustado" }]} semilla={36} contacto={0} color="#2a3a5a" /></group>
    </>;
  }}</U3>;
};

// ---- IslaJaula · la laguna en maqueta: Venecia grande a un lado y la isla chica con sus chimeneas; en «isla» los hornos cruzan el
// agua en barcas hasta la isla; en «vigilados» aparecen las barcas de guardia en ronda alrededor ----
const IslaJaula: React.FC<UP> = ({ d, p }) => {
  const aI = sec(p, "isla", 1.0), aV = sec(p, "vigilados", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#1a2228" key1={[-1, 2.8, 1.6]}
    cam={{ at: [0.2, 0, 0], az: [-0.3, -0.05], el: [0.55, 0.5], r: [2.2, 2.0], fov: 34 }}>{(tt) => {
    const cross = eio(tt, aI, aI + 1.6);
    return <>
      <Water w={6} dpt={6} y={0} col="#3a5a64" op={0.95} />
      <mesh position={[-1.0, 0.03, 0]}><cylinderGeometry args={[0.6, 0.65, 0.06, 32]} /><meshStandardMaterial color="#b8a888" /></mesh>
      {Array.from({ length: 22 }, (_, i) => <RBox key={i} s={[0.1, 0.08 + rn(i, 1) * 0.1, 0.1]} r={0.005} p={[-1.0 + (rn(i, 2) - 0.5) * 0.9, 0.1, (rn(i, 3) - 0.5) * 0.9]}><meshStandardMaterial color={`hsl(${20 + rn(i, 4) * 20},40%,${50 + rn(i, 5) * 15}%)`} /></RBox>)}
      <mesh position={[0.75, 0.03, 0.1]}><cylinderGeometry args={[0.3, 0.33, 0.06, 28]} /><meshStandardMaterial color="#a89878" /></mesh>
      {[0, 1, 2].map((i) => <group key={i} position={[0.65 + i * 0.1, 0.06, 0.05 + (i % 2) * 0.1]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.08, 0.1, 0.08]} /><meshStandardMaterial map={tex.wood(1, 1, [140, 70, 50])} /></mesh>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.012, 0.015, 0.12, 8]} /><meshStandardMaterial color="#5a3a2a" /></mesh>
        <mesh position={[0, 0.24, 0]} scale={sm(cross)}><sphereGeometry args={[0.03, 8, 6]} />{M.glow({ col: "#ff9040", op: 0.9 })}</mesh></group>)}
      {[0, 1, 2].map((i) => <group key={"b" + i} position={[lerp(-0.45, 0.5, cl(cross * 1.2 - i * 0.1)), 0.02, -0.1 + i * 0.12]}>
        <mesh scale={[1, 0.3, 0.4]}><sphereGeometry args={[0.06, 10, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh>
        <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.04, 0.04, 0.03]} /><meshStandardMaterial color="#ff9040" emissive="#ff6020" emissiveIntensity={1} /></mesh></group>)}
      {Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * 2 * PI + tt * 0.35, r = 0.48; return <group key={"g" + i} position={[0.75 + Math.cos(a) * r, 0.02, 0.1 + Math.sin(a) * r]} rotation={[0, -a, 0]} scale={sm(eio(tt, aV + i * 0.12, aV + i * 0.12 + 0.5))}>
        <mesh scale={[1.2, 0.3, 0.4]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color="#1a1a1e" /></mesh>
        <Lantern p={[0, 0.06, 0]} s={0.35} on={eio(tt, aV, aV + 0.5)} col="#ffd080" /></group>; })}
    </>;
  }}</U3>;
};

// ---- CopaCadena · la copa de cristal de Murano girando en su pedestal; en «nunca» una cadena se enrosca alrededor del pie y la ata al
// pedestal; en «traidor» la luz se vuelve roja ----
const CopaCadena: React.FC<UP> = ({ d, p }) => {
  const aN = sec(p, "nunca", 1.5), aT = sec(p, "traidor", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0b0a" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0, 0.32, 0], az: [-0.25, 0.15], el: [0.14, 0.1], r: [1.0, 0.85], fov: 32 }}>{(tt) => {
    const ch = eio(tt, aN, aN + 1.2), red = eio(tt, aT, aT + 0.6);
    return <>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.14, 0.16, 0.12, 32]} /><meshStandardMaterial color="#2a2420" roughness={0.5} /></mesh>
      <group position={[0, 0.12, 0]} rotation={[0, tt * 0.5 * (1 - ch), 0]}><Goblet s={1.6} col="#cfe8ff" op={0.5} />
        <mesh position={[0, 0.25, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.004, 8, 40]} />{M.brass({ col: "#d8b060" })}</mesh></group>
      {Array.from({ length: 26 }, (_, i) => { const u = i / 26, on = cl(ch * 26 - i), a = u * 6 * PI, r = 0.035 + 0.06 * (1 - u);
        return <mesh key={i} position={[Math.cos(a) * r * 1.1, 0.13 + u * 0.12, Math.sin(a) * r * 1.1]} rotation={[a, i % 2 ? PI / 2 : 0, 0]} scale={sm(on)}><torusGeometry args={[0.011, 0.003, 6, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>; })}
      <spotLight position={[0, 1.5, 0.6]} angle={0.4} penumbra={0.6} intensity={8} distance={3} color={new THREE.Color().lerpColors(new THREE.Color("#fff4e0"), new THREE.Color("#ff3a2a"), red)} />
    </>;
  }}</U3>;
};

// ---- HornoMil · el termómetro de mercurio gigante delante de la boca del horno sube hasta 1000; en «ojos» el aire tiembla y unas
// gotas de sudor caen ----
const HornoMil: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mil", 1.5), aO = sec(p, "ojos", 3.0);
  return <U3 over={(tt) => <Drums v={1000 * eio(tt, 0.3, aM + 0.8)} n={4} x={1320} y={120} s={1.0} unit="°C" />} d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#120a06" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0, 0.4, 0], az: [-0.2, -0.05], el: [0.08, 0.06], r: [1.4, 1.2], fov: 34 }}>{(tt) => {
    const lv = eio(tt, 0.3, aM + 0.8);
    return <>
      <RBox s={[1.2, 0.8, 0.4]} r={0.04} p={[0, 0.4, -0.5]}><meshStandardMaterial color="#6a3a2a" roughness={0.95} /></RBox>
      <mesh position={[0, 0.4, -0.29]}><circleGeometry args={[0.2, 32]} />{M.glow({ col: "#ffb040" })}</mesh>
      <pointLight position={[0, 0.4, -0.1]} intensity={6} distance={2.5} color="#ff9030" />
      <group position={[0.45, 0, 0.1]}>
        <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />{M.glass({ op: 0.35 })}</mesh>
        <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.055, 16, 12]} /><meshStandardMaterial color="#c8202a" emissive="#a01010" emissiveIntensity={0.6} /></mesh>
        <mesh position={[0, 0.07 + 0.37 * lv, 0]} scale={[1, sm(lv), 1]}><cylinderGeometry args={[0.014, 0.014, 0.74, 10]} /><meshStandardMaterial color="#d8282a" emissive="#a01010" emissiveIntensity={0.6} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.04, 0.12 + i * 0.13, 0]}><boxGeometry args={[0.03, 0.004, 0.004]} /><meshBasicMaterial color="#e8e0d0" /></mesh>)}
      </group>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.35 + i * 0.1, 0.55 - ((tt - aO - i * 0.2) * 0.5 % 0.6), 0.25]} visible={tt > aO + i * 0.2} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 8, 6]} />{M.water({ op: 0.6 })}</mesh>)}
      {Array.from({ length: 4 }, (_, i) => <mesh key={"h" + i} position={[0, 0.4 + Math.sin(tt * 3 + i) * 0.02, -0.15 + i * 0.08]}><planeGeometry args={[0.9, 0.5]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.04 * eio(tt, aO, aO + 0.6)} depthWrite={false} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- CanaGira · la caña con la bola de vidrio rojo vivo: mientras gira la bola queda redonda; en «quieto» deja de girar y la gota
// cuelga y se estira hacia el piso; en «girando» vuelve a girar y la bola se recupera ----
const CanaGira: React.FC<UP> = ({ d, p }) => {
  const aQ = sec(p, "quieto", 1.5), aG = sec(p, "girando", 3.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0806" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0.2, 0.35, 0], az: [-0.35, -0.15], el: [0.1, 0.08], r: [1.15, 1.0], fov: 32 }}>{(tt) => {
    const stop = eio(tt, aQ, aQ + 0.3) * (1 - eio(tt, aG, aG + 0.4)), sag = eio(tt, aQ, aG) * (1 - eio(tt, aG, aG + 0.8)), rot = tt * 6 * (1 - stop);
    return <>
      <mesh position={[-0.2, 0.35, 0]} rotation={[rot, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.9, 10]} />{M.steel({ col: "#6a6660" })}</mesh>
      <group position={[0.27, 0.35, 0]} rotation={[rot, 0, 0]}>
        <mesh scale={[1, 1 + 0.6 * sag, 1]} position={[0, -0.06 * sag, 0]}><sphereGeometry args={[0.07, 24, 18]} /><meshStandardMaterial color="#ffb050" emissive="#ff6a10" emissiveIntensity={1.4} roughness={0.2} /></mesh>
        <mesh position={[0, -0.13 - 0.12 * sag, 0]} scale={[1, sm(sag) * 2.4, 1]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color="#ffb050" emissive="#ff6a10" emissiveIntensity={1.4} /></mesh>
      </group>
      <pointLight position={[0.27, 0.35, 0.15]} intensity={2.4} distance={1.2} color="#ff8a30" />
      <RBox s={[0.6, 0.04, 0.3]} r={0.01} p={[-0.3, 0.15, 0]}>{M.wood({ base: [80, 56, 34] })}</RBox>
      {[-0.55, -0.05].map((x, i) => <mesh key={i} position={[x, 0.07, 0]}><boxGeometry args={[0.04, 0.14, 0.26]} />{M.wood({ base: [70, 48, 30] })}</mesh>)}
    </>;
  }}</U3>;
};

// ---- TopCincoCiudad · cinco pedestales en arco; cada número levanta su objeto bajo un foco: 5 el pañuelo con el olor (vapor verde),
// 4 la llama, 3 el farol apagado, 2 la ola de agua, 1 el reloj de engranajes girando rápido ----
const TopCincoCiudad: React.FC<UP> = ({ d, p }) => {
  const keys = ["cinco", "cuatro", "tres", "dos", "uno"], A = keys.map((k, i) => sec(p, k, 0.5 + i * 2));
  const obj = (i: number, tt: number) => i === 0 ? <group>{Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Math.sin(tt * 1.5 + j) * 0.03, 0.06 + ((tt * 0.12 + j * 0.05) % 0.3), 0]}><sphereGeometry args={[0.04 + j * 0.005, 10, 8]} /><meshBasicMaterial color="#8ab060" transparent opacity={0.35} depthWrite={false} /></mesh>)}<mesh scale={[1, 0.3, 1]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color="#e8e0d0" /></mesh></group>
    : i === 1 ? <mesh position={[0, 0.1, 0]} scale={[1, 1 + 0.1 * Math.sin(tt * 2 * PI * 1.5), 1]}><coneGeometry args={[0.06, 0.2, 12]} />{M.glow({ col: "#ff8a30" })}</mesh>
    : i === 2 ? <Lantern p={[0, 0.08, 0]} s={1.4} on={0.05} />
    : i === 3 ? <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.sin(tt * 2) * 0.2]} scale={[1, 0.6, 1]}><torusGeometry args={[0.07, 0.03, 10, 24, PI]} />{M.water({ op: 0.8 })}</mesh>
    : <group position={[0, 0.1, 0]}>{[0, 1].map((j) => <mesh key={j} position={[j * 0.07 - 0.035, 0, 0]} rotation={[PI / 2, (j ? -1 : 1) * tt * 4, 0]}><cylinderGeometry args={[0.045, 0.045, 0.015, 12]} />{M.brass()}</mesh>)}</group>;
  return <U3 over={(tt) => <Drums v={5 - Math.max(0, A.filter((a) => tt >= a).length - 1)} n={1} x={1600} y={110} s={1.0} op={1} />} d={d} bg={p.bg} ground={null} floor="dark" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.38, 0], az: [-0.08, 0.06], el: [0.2, 0.17], r: [2.2, 2.05], fov: 36 }}>{(tt) => <>
      {keys.map((_, i) => { const x = (i - 2) * 0.42, z = -Math.abs(i - 2) * 0.12, k = pop(tt, A[i]), on = eio(tt, A[i], A[i] + 0.4);
        return <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.11, 0.12, 0.3, 24]} /><meshStandardMaterial color="#d8d0c0" roughness={0.6} /></mesh>
          <group position={[0, 0.3, 0]} scale={k}>{obj(i, tt)}</group>
          <spotLight position={[x * 0.2, 1.5, 0.6]} angle={0.2} penumbra={0.6} intensity={7 * on} distance={3} color="#fff0d8" />
        </group>; })}
    </>}</U3>;
};

// ---- CajonCorte · el cajón bajo el río visto en corte: el agua arriba, el cajón de madera hundiéndose en el lecho, los obreros adentro
// con faroles; en «empuja» las flechas de aire empujan el agua afuera por los bordes; en «veinticuatro» el cajón baja hasta la
// marca de 24 m ----
const CajonCorte: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "empuja", 1.5), aV = sec(p, "veinticuatro", 3.0);
  return <U3 over={(tt) => <Drums v={24 * eio(tt, aV, aV + 1.0)} n={2} x={1450} y={110} s={1.0} unit="m" op={eio(tt, aV, aV + 0.3)} />} d={d} bg={p.bg} ground={null} mode="wipe" sky="#14202a" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.35, 0], az: [-0.05, 0.05], el: [0.06, 0.05], r: [2.0, 1.85], fov: 36 }}>{(tt) => {
    const sink = 0.3 * eio(tt, 0.3, aV + 1.0), push = eio(tt, aE, aE + 0.8);
    return <>
      <mesh position={[0, 0.85, -0.1]}><boxGeometry args={[3, 0.5, 0.4]} /><meshPhysicalMaterial color="#3a5a6a" transparent opacity={0.6} roughness={0.1} depthWrite={false} /></mesh>
      <mesh position={[0, 0.3, -0.12]}><boxGeometry args={[3, 0.6, 0.4]} /><meshStandardMaterial map={dirtT([84, 70, 52])} roughness={1} /></mesh>
      <group position={[0, 0.5 - sink, 0]}>
        <RBox s={[1.1, 0.06, 0.42]} r={0.01} p={[0, 0.3, 0]}>{M.wood({ base: [90, 62, 36] })}</RBox>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.53, 0.1, 0]} rotation={[0, 0, s * 0.15]}><boxGeometry args={[0.05, 0.4, 0.42]} />{M.wood({ base: [90, 62, 36] })}</mesh>)}
        <mesh position={[0, 0.1, -0.02]}><boxGeometry args={[1.0, 0.36, 0.36]} /><meshStandardMaterial color="#1a1612" roughness={1} /></mesh>
        {[-0.3, 0.0, 0.3].map((x, i) => <group key={i} position={[x, -0.08, 0.1]}><Stickman escala={0.05} rotY={0} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={40 + i} contacto={0} color="#4a4038" /><Lantern p={[0.06, 0.12, 0]} s={0.45} /></group>)}
        <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />{M.steel({ col: "#5a5e62" })}</mesh>
        {[-1, 1].map((s) => Array.from({ length: 4 }, (_, j) => <mesh key={s + "a" + j} position={[s * (0.45 + 0.12 * push + j * 0.04), -0.12, 0.2]} rotation={[0, 0, -s * PI / 2]} scale={sm(push)}><coneGeometry args={[0.02, 0.06, 8]} /><meshStandardMaterial color="#e8f4ff" emissive="#80c0ff" emissiveIntensity={1} /></mesh>))}
      </group>
      {[0, 6, 12, 18, 24].map((m, i) => <group key={m} position={[1.25, 0.6 - i * 0.075, 0.25]}><mesh><boxGeometry args={[0.08, 0.006, 0.006]} /><meshBasicMaterial color={m === 24 ? "#ff5a3a" : "#e8e0d0"} /></mesh></group>)}
    </>;
  }}</U3>;
};

// ---- BotellaBurbujas · botella de vidrio con el tapón: en «burbujas» el tapón salta y el líquido se llena de burbujas que suben y
// se escapan; al lado, una silueta de hombre se llena de las mismas burbujas en las rodillas y el pecho ----
const BotellaBurbujas: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "burbujas", 1.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#0d0b0a" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.1, 0.32, 0], az: [-0.2, 0.05], el: [0.12, 0.1], r: [1.25, 1.1], fov: 32 }}>{(tt) => {
    const pop2 = eio(tt, aB, aB + 0.25);
    return <>
      <group position={[-0.2, 0, 0]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.08, 0.08, 0.36, 28, 1, true]} />{M.glass({ col: "#b0e0c0", op: 0.35 })}</mesh>
        <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.025, 0.08, 0.1, 24, 1, true]} />{M.glass({ col: "#b0e0c0", op: 0.35 })}</mesh>
        <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.075, 0.075, 0.3, 24]} /><meshStandardMaterial color="#8a5a2a" transparent opacity={0.65} /></mesh>
        <mesh position={[0.06 * pop2, 0.49 + 0.35 * pop2 - 0.4 * pop2 * pop2, 0]} rotation={[0, 0, -pop2 * 3]}><cylinderGeometry args={[0.028, 0.028, 0.03, 16]} />{M.brass({ col: "#c8a040" })}</mesh>
        {Array.from({ length: 40 }, (_, i) => { const st = aB + rn(i, 1) * 1.5, y = 0.05 + ((tt - st) * (0.3 + rn(i, 2) * 0.3)) % 0.5; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.12, y, (rn(i, 4) - 0.5) * 0.12]} visible={tt > st}><sphereGeometry args={[0.006 + rn(i, 5) * 0.006, 8, 6]} /><meshPhysicalMaterial color="#fff" transparent opacity={0.6} roughness={0.05} /></mesh>; })}
      </group>
      <group position={[0.3, 0, 0]}>
        <Stickman escala={0.11} rotY={-20} guion={[{ t: 0, accion: "idle", expr: "neutral" as any }, { t: aB + 0.6, accion: "asustarse", expr: "asustado" }]} semilla={44} contacto={0} color="#9aa0a6" />
        {Array.from({ length: 24 }, (_, i) => { const st = aB + 0.5 + rn(i, 1); const zone = i % 3; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.06, zone === 0 ? 0.08 : zone === 1 ? 0.12 : 0.25 + rn(i, 3) * 0.05, 0.03]} scale={sm(eio(tt, st, st + 0.4))}><sphereGeometry args={[0.007, 8, 6]} /><meshStandardMaterial color="#cfe8ff" emissive="#80c0ff" emissiveIntensity={0.8} /></mesh>; })}
      </group>
    </>;
  }}</U3>;
};

// ---- CatalejoVentana · la ventana con el catalejo apuntando al puente: en «ventana» la cámara se pone detrás del catalejo y se ve el
// puente lejos; en «emily» aparece la mano con la carta que va y viene en un hilo de luz entre la ventana y el puente ----
const CatalejoVentana: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "ventana", 1.0), aE = sec(p, "emily", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#1a1c22" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.1, 0.42, 0], at1: [0.3, 0.45, -0.6], az: [-0.5, -0.1], el: [0.08, 0.04], r: [1.3, 0.9], fov: 34 }}>{(tt) => {
    const run = ((tt - aE) * 0.5) % 1;
    return <>
      <group position={[0, 0, -0.1]}>{[[-0.4, 0.45, 0.05, 0.9], [0.4, 0.45, 0.05, 0.9], [0, 0.92, 0.85, 0.05], [0, 0.0, 0.85, 0.05], [0, 0.45, 0.85, 0.03], [0, 0.45, 0.03, 0.9]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.05]} r={0.005} p={[x, y, 0]}>{M.wood({ base: [110, 80, 50] })}</RBox>)}</group>
      <group position={[0.05, 0.42, 0.25]} rotation={[0.05, 0.4, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.026, 0.4, 20]} />{M.brass({ col: "#c89a4a" })}</mesh>
        <mesh position={[0, -0.18, 0.05]}><cylinderGeometry args={[0.006, 0.006, 0.36, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh></group>
      <group position={[0.3, 0.2, -2.4]}>
        {[-0.6, 0.6].map((x, i) => <mesh key={i} position={[x, 0.4, 0]}><boxGeometry args={[0.14, 0.8, 0.1]} /><meshStandardMaterial color="#9a8a72" /></mesh>)}
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.3, 0.5, 0]} rotation={[0, 0, s * -0.25]}><cylinderGeometry args={[0.004, 0.004, 0.7, 6]} /><meshStandardMaterial color="#d8d0c0" /></mesh>)}
        <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.8, 0.03, 0.08]} /><meshStandardMaterial color="#8a7a62" /></mesh></group>
      <mesh position={[lerp(0.1, 0.3, run), lerp(0.42, 0.45, run), lerp(0.1, -2.3, run)]} visible={tt > aE} rotation={[0.3, run * 4, 0]}><boxGeometry args={[0.06, 0.04, 0.003]} /><meshStandardMaterial map={tex.paper()} emissive="#fff0c0" emissiveIntensity={0.4} /></mesh>
      <pointLight position={[0.2, 0.6, 0.3]} intensity={1.8 * eio(tt, aV, aV + 0.6) + 0.6} distance={2} color="#ffe0b0" />
    </>;
  }}</U3>;
};

// ---- SubidaLenta · la escalera de caracol del cajón: dos subidas a la vez; el de la izquierda (en «corrian») sube de un tirón y al
// llegar arriba se dobla; el de la derecha (en «viejos») sube un escalón, se detiene, otro escalón... y llega derecho ----
const SubidaLenta: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corrian", 1.0), aV = sec(p, "viejos", 3.0), D = d / 30;
  const stair = (x: number, k: string) => <group key={k} position={[x, 0, 0]}>
    <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />{M.steel({ col: "#6a6e72" })}</mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.7) * 0.08, 0.04 + i * 0.075, Math.sin(i * 0.7) * 0.08]} rotation={[0, -i * 0.7, 0]}><boxGeometry args={[0.16, 0.012, 0.05]} />{M.steel({ col: "#8a8e92" })}</mesh>)}</group>;
  const pos = (u: number, x: number) => { const i = u * 11; return [x + Math.cos(i * 0.7) * 0.12, 0.05 + i * 0.075, Math.sin(i * 0.7) * 0.12]; };
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.5, 0], az: [-0.1, 0.1], el: [0.08, 0.1], r: [1.9, 1.75], fov: 36 }}>{(tt) => {
    const uF = eio(tt, aC, aC + 1.0), steps = Math.max(0, (tt - aV) / Math.max(1, D - aV - 0.8)), uS = cl(Math.floor(steps * 6) / 6 + eio(steps * 6 % 1, 0, 0.4) / 6), bend = eio(tt, aC + 1.0, aC + 1.5);
    const pf = pos(uF, -0.45), ps = pos(uS, 0.45);
    return <>
      {stair(-0.45, "a")}{stair(0.45, "b")}
      <group position={pf as any} rotation={[0, 0, -0.8 * bend]}><Stickman escala={0.07} rotY={0} guion={[{ t: 0, accion: "correr", expr: "decidido" }, { t: aC + 1.0, accion: "asustarse", expr: "asustado" }]} semilla={46} contacto={0} color="#7a5a4a" /></group>
      <group position={ps as any}><Stickman escala={0.07} rotY={0} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={47} contacto={0} color="#4a5a6a" /></group>
      <mesh position={[-0.45, 0.95, 0]}><circleGeometry args={[0.18, 24]} /><meshBasicMaterial color="#dceaff" transparent opacity={0.6} toneMapped={false} /></mesh>
      <mesh position={[0.45, 0.95, 0]}><circleGeometry args={[0.18, 24]} /><meshBasicMaterial color="#dceaff" transparent opacity={0.6} toneMapped={false} /></mesh>
      <pointLight position={[0, 1.1, 0.4]} intensity={2.2} distance={2.5} color="#e0eaff" />
    </>;
  }}</U3>;
};

// ---- RankingCiudades · cinco relojes de arena en fila, uno por ciudad con su herramienta delante: cada uno se vacía hasta el tiempo
// de renuncia (más corto = más rápido); el de Murano no se vacía nunca y le cae una cadena ----
const RankingCiudades: React.FC<UP> = ({ d, p }) => {
  const keys = ["londres", "paris", "edo", "murano", "brooklyn"], A = keys.map((k, i) => sec(p, k, 0.5 + i * 2.2));
  const speed = [1.6, 3.0, 2.2, 0.0, 0.6];
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.32, 0], az: [-0.08, 0.08], el: [0.16, 0.14], r: [2.1, 1.95], fov: 36 }}>{(tt) => <>
      {keys.map((_, i) => { const x = (i - 2) * 0.42, k = pop(tt, A[i]), fl = speed[i] ? cl((tt - A[i]) * speed[i] * 0.4) : 0.1, on = eio(tt, A[i], A[i] + 0.4);
        return <group key={i} position={[x, 0, -Math.abs(i - 2) * 0.1]} scale={k}>
          {[0.02, 0.42].map((y, j) => <mesh key={j} position={[0, y, 0]}><cylinderGeometry args={[0.1, 0.1, 0.03, 20]} />{M.wood({ base: [90, 60, 34] })}</mesh>)}
          {[-1, 1].map((s) => <mesh key={s} position={[0, 0.22 + s * 0.09, 0]} rotation={[s > 0 ? PI : 0, 0, 0]}><coneGeometry args={[0.08, 0.17, 20, 1, true]} />{M.glass({ op: 0.3 })}</mesh>)}
          <mesh position={[0, 0.06 + 0.04 * fl, 0]} scale={[1, sm(fl), 1]}><coneGeometry args={[0.07, 0.08, 18]} /><meshStandardMaterial color="#d8b070" /></mesh>
          <mesh position={[0, 0.34 - 0.04 * fl, 0]} rotation={[PI, 0, 0]} scale={[sm(1 - fl), sm(1 - fl), sm(1 - fl)]}><coneGeometry args={[0.07, 0.1, 18]} /><meshStandardMaterial color="#d8b070" /></mesh>
          {i === 3 && Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[Math.cos(j) * 0.1, 0.12 + j * 0.03 - 0.6 * (1 - eio(tt, A[3] + 0.5, A[3] + 1.0)), Math.sin(j) * 0.1]} rotation={[j, j % 2 ? PI / 2 : 0, 0]}><torusGeometry args={[0.014, 0.004, 6, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>)}
          <spotLight position={[0, 1.5, 0.5]} angle={0.18} penumbra={0.6} intensity={6 * on} distance={3} color="#fff0d8" />
        </group>; })}
    </>}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CiudadMadera, CortaFuego, MatoiTecho, VientoNoFuego, IslaJaula, CopaCadena, HornoMil, CanaGira, TopCincoCiudad, CajonCorte, BotellaBurbujas, CatalejoVentana, SubidaLenta, RankingCiudades };
