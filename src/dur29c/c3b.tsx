// dur29c · bloque B (Edo, Murano, la pausa de las cinco cosas, Brooklyn y el ranking): la ciudad de madera y papel, el corta fuego,
// el matoi en el techo, el viento, la isla jaula, la copa con cadena, el horno de mil grados, la caña que gira, las cinco cosas, el
// cajón bajo el río, la botella de gaseosa, el catalejo en la ventana, la subida lenta y el ranking de faroles.
// v2 (ev1): llamas de verdad (capas que titilan ≤2 Hz), casas de papel con ventanas encendidas, objetos grandes y cerca, podio de alturas
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { Goblet, Lantern, PI, Skull, brickT, sm } from "./c3k";

type UP = { d: number; p: any };
const paperT = () => { const t = tex.text("shoji", 256, 256, (g) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#5a3a20"; g.lineWidth = 8;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(256, i * 64); g.stroke(); } }); return t; };
const tileT = () => { const t = tex.text("kawara", 256, 256, (g) => { g.fillStyle = "#3e4246"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) { const gr = g.createLinearGradient(i * 32, 0, i * 32 + 32, 0); gr.addColorStop(0, "#2a2e32"); gr.addColorStop(0.5, "#6a7076"); gr.addColorStop(1, "#2a2e32"); g.fillStyle = gr; g.fillRect(i * 32, 0, 32, 256); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t; };

// llama de verdad: tres capas (rojo afuera, naranja, centro amarillo) que titilan lento (≤2 Hz); k 0..1 = tamaño; lean = inclinación
export const Llama: React.FC<{ p?: number[]; k: number; s?: number; lean?: number; ph?: number; tt: number }> = ({ p = [0, 0, 0], k, s = 1, lean = 0, ph = 0, tt }) => {
  const f = (w: number) => 1 + 0.14 * Math.sin(tt * 2 * PI * 1.6 + ph + w) + 0.07 * Math.sin(tt * 2 * PI * 0.9 + ph * 2 + w);
  const sw = 0.12 * Math.sin(tt * 2 * PI * 1.1 + ph);
  const L: [number, number, string, number][] = [[0.075, 0.075, "#e0401a", 0.72], [0.055, 0.065, "#ff8a24", 0.86], [0.032, 0.048, "#ffe08a", 0.96]];
  return <group position={p as any} scale={sm(k * s)}>
    {L.map(([r, y, c, o], j) => <group key={j} rotation={[0, 0, lean * (0.7 + 0.35 * j) + sw * (0.5 + 0.4 * j)]}>
      <mesh position={[0, y, 0]} scale={[1, 1.5 * f(j * 1.3), 1]}><sphereGeometry args={[r, 16, 12]} />{M.glow({ col: c, op: o })}</mesh>
      <mesh position={[0, y + r * 1.9 * f(j * 1.3), 0]}><coneGeometry args={[r * 0.75, r * 2.2 * f(j * 0.7 + 1), 12]} />{M.glow({ col: c, op: o })}</mesh></group>)}
    {[0, 1, 2].map((e) => { const c = (tt * 0.6 + e * 0.33 + ph * 0.13) % 1; return <mesh key={"e" + e} position={[0.04 * Math.sin(e * 2 + ph) - lean * 0.12 * c, 0.16 + 0.3 * c, 0.03 * Math.cos(e * 3 + ph)]} scale={sm(1 - c)}><sphereGeometry args={[0.011, 6, 6]} />{M.glow({ col: "#ffb040" })}</mesh>; })}
  </group>;
};

// casita de Edo: paredes de papel con ventanas encendidas, postes y techo de tejas a dos aguas; burn la pone negra, fire = llama arriba
const Casa: React.FC<{ p: number[]; s?: number; burn?: number; fire?: number; down?: number; tt?: number; i?: number }> = ({ p, s = 1, burn = 0, fire = 0, down = 0, tt = 0, i = 0 }) =>
  <group position={[p[0], p[1] - 0.12 * down * s, p[2]]} scale={sm(s)} rotation={[0, 0, 0.5 * down]}>
    <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.2, 0.14, 0.16]} /><meshStandardMaterial map={paperT()} color={new THREE.Color().setRGB(1 - 0.85 * burn, 0.95 - 0.85 * burn, 0.85 - 0.8 * burn)} roughness={0.9} /></mesh>
    {[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.075, 0.081]}><planeGeometry args={[0.05, 0.05]} /><meshStandardMaterial color="#ffd890" emissive="#ffa040" emissiveIntensity={(rn(i, 3) > 0.4 ? 0.9 : 0.15) * (1 - burn)} /></mesh>)}
    {[-1, 1].map((k) => <mesh key={k} position={[0, 0.17, k * 0.045]} rotation={[k * 0.6, 0, 0]}><boxGeometry args={[0.24, 0.01, 0.12]} /><meshStandardMaterial map={tileT()} color={burn > 0.5 ? "#222" : "#c8b8a8"} roughness={0.6} /></mesh>)}
    <Llama p={[0, 0.19, 0]} k={fire} s={1.3} lean={0.3} ph={i} tt={tt} />
  </group>;

// ---- CiudadMadera · Edo en maqueta: cien casitas de papel con ventanas encendidas; en «flores» una chispa prende una y el fuego salta
// de techo en techo; en «mil» el contador llega a 1657 y media ciudad queda negra ----
const CiudadMadera: React.FC<UP> = ({ d, p }) => {
  const aF = sec(p, "flores", 1.5), aM = sec(p, "mil", 3.5);
  const N = 100, pos = Array.from({ length: N }, (_, i) => [((i % 10) - 4.5) * 0.25 + rn(i, 1) * 0.05, ((Math.floor(i / 10)) - 4.5) * 0.25 + rn(i, 2) * 0.05]);
  return <U3 over={(tt) => <Drums v={1657 * eio(tt, aM, aM + 1.0)} n={4} x={1180} y={110} s={1.0} op={eio(tt, aM, aM + 0.3)} />} d={d} bg={p.bg} ground={[96, 80, 60]} mode="drop" sky="#1a1410" key1={[-1, 2.6, 1.6]}
    cam={{ at: [0.4, 0, 0.3], at1: [0, 0, 0], az: [-0.4, -0.2], el: [0.45, 0.68], r: [1.3, 2.5], fov: 34 }}>{(tt) => {
    const front = Math.max(0, (tt - aF) * 0.55);
    return <>
      {pos.map(([x, z], i) => { const dist = Math.hypot(x - 0.9, z - 0.6), b = cl((front - dist) / 0.4), f = cl((front - dist) / 0.15) * (1 - cl((front - dist - 0.5) / 0.4));
        return <Casa key={i} p={[x, 0, z]} s={0.95} burn={b} fire={f} tt={tt} i={i} />; })}
      <pointLight position={[0.9 - 0.3 * front, 0.5, 0.6 - 0.3 * front]} intensity={0.0001 + 5 * cl(tt - aF)} distance={2.5} color="#ff8a30" />
      {Array.from({ length: 16 }, (_, i) => { const th = PI + (i / 16) * 1.6 - 0.3, u = (tt * 0.7 + rn(i, 7)) % 1, r = Math.max(0, front - 0.15) + 0.3 * u;
        return <mesh key={"s" + i} position={[0.9 + Math.cos(th) * r, 0.22 + 0.3 * Math.sin(PI * u), 0.6 + Math.sin(th) * r * 0.9]} scale={sm(cl((front - 0.05) * 4) * (1 - 0.6 * u))}><sphereGeometry args={[0.014, 6, 6]} />{M.glow({ col: "#ffc050" })}</mesh>; })}
    </>;
  }}</U3>;
};

// ---- CortaFuego · la fila de casas con el fuego de un lado: en «destruian» los bomberos con ganchos tiran abajo tres casas y en «hueco»
// queda el claro de tierra; el fuego llega al hueco y se frena, las casas del otro lado quedan blancas ----
const CortaFuego: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "destruian", 1.5), aH = sec(p, "hueco", 3.0);
  return <U3 d={d} bg={p.bg} ground={[96, 80, 60]} mode="wipe" sky="#1a1410" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0.0, 0.3, 0], az: [-0.1, 0.0], el: [0.26, 0.22], r: [2.8, 2.65], fov: 36 }}>{(tt) => {
    const fire = lerp(-1.4, -0.12, cl(tt / (aH + 1.5))), gapK = eio(tt, aD, aD + 1.4);
    return <>
      <mesh position={[0.22, 0.004, 0]} rotation={[-PI / 2, 0, 0]} scale={[sm(gapK), 1, 1]}><planeGeometry args={[0.72, 0.5]} /><meshStandardMaterial map={dirtT([92, 62, 36])} roughness={1} /></mesh>
      <mesh position={[0.0, 0.006, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, sm(gapK), 1]}><planeGeometry args={[0.06, 0.6]} /><meshStandardMaterial color="#1e140c" roughness={1} /></mesh>
      <mesh position={[0.0, 0.02, 0]} scale={[1, 1, sm(gapK)]}><boxGeometry args={[0.02, 0.04, 0.6]} /><meshStandardMaterial map={dirtT([70, 48, 28])} roughness={1} /></mesh>
      <mesh position={[-0.08, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.14, 0.5]} /><meshStandardMaterial color="#1a1410" roughness={1} transparent opacity={0.7 * cl((fire + 0.4) / 0.3)} /></mesh>
      {Array.from({ length: 11 }, (_, i) => { const x = -1.1 + i * 0.22, gap = i >= 5 && i <= 7, dn = gap ? eio(tt, aD + (i - 5) * 0.3, aD + (i - 5) * 0.3 + 0.7) : 0, b = cl((fire - x + 0.1) / 0.3);
        return gap && dn >= 1 ? <group key={i}>{Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[x + (rn(i * 5 + j, 1) - 0.5) * 0.18, 0.012, (rn(i * 5 + j, 2) - 0.5) * 0.14]} rotation={[0, rn(i * 5 + j, 3) * 3, 0]}><boxGeometry args={[0.16, 0.012, 0.02]} />{M.wood({ base: [90, 62, 36] })}</mesh>)}</group>
          : <Casa key={i} p={[x, 0, 0]} s={1.3} burn={x < 0 ? b : 0} fire={x < 0 ? cl(b * 2) * (1 - 0.5 * cl((fire - x - 0.4) / 0.3)) : 0} down={dn} tt={tt} i={i} />; })}
      {[0.0, 0.25].map((x, i) => <group key={i} position={[x + 0.22, 0.0, 0.3]} visible={tt > aD - 0.3 && tt < aH + 1.5}><mesh position={[-0.08, 0.2, -0.12]} rotation={[0.6, 0, 0.7]}><cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />{M.wood({ base: [110, 80, 46] })}</mesh>
        <Stickman escala={0.13} rotY={180} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={30 + i} contacto={0} color="#2a3a5a" /></group>)}
      <pointLight position={[fire, 0.4, 0.2]} intensity={4} distance={1.6} color="#ff8030" />
    </>;
  }}</U3>;
};

// ---- MatoiTecho · el bombero sube por el techo de tejas con el matoi (bola blanca y borlas de tiras); en «techo» lo clava en la
// cumbrera y lo hace girar con las dos manos, las tiras se abren; en «honor» el humo cruza detrás con el viento ----
const MatoiTecho: React.FC<UP> = ({ d, p }) => {
  const aT = sec(p, "techo", 1.5), aH = sec(p, "honor", 3.5);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#2a2420" key1={[-1, 2.6, 1.8]}
    cam={{ at: [-0.1, 0.62, 0], az: [-0.35, 0.15], el: [0.12, 0.14], r: [1.85, 1.7], fov: 34 }}>{(tt) => {
    const up = eio(tt, 0.2, aT), spin = tt > aT ? (tt - aT) * 2.2 : 0, open = cl(spin * 0.5);
    const hx = lerp(-0.5, -0.12, up), hy = lerp(0.22, 0.47, up);
    return <>
      {[-1, 1].map((k) => <mesh key={k} position={[0, 0.3, k * 0.18]} rotation={[k * 0.75, 0, 0]}><boxGeometry args={[1.6, 0.02, 0.5]} /><meshStandardMaterial map={tileT()} color="#9a8a82" roughness={0.55} /></mesh>)}
      <mesh position={[0, 0.48, 0]}><boxGeometry args={[1.6, 0.05, 0.06]} /><meshStandardMaterial color="#3a3430" /></mesh>
      {[-0.7, 0.7].map((x) => <mesh key={x} position={[x, 0.53, 0]}><boxGeometry args={[0.08, 0.08, 0.08]} /><meshStandardMaterial color="#2a2624" /></mesh>)}
      <group position={[hx, hy, 0.14]}><Stickman enSitio escala={0.15} rotY={60} guion={[{ t: 0, accion: "caminar", expr: "decidido" }, { t: aT, accion: "festejar", expr: "decidido" }]} semilla={33} contacto={0} color="#2a3a5a" /></group>
      <group position={[hx + 0.12, hy + 0.02, 0.16]}>
        <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.011, 0.011, 0.54, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh>
        <group position={[0, 0.58, 0]} rotation={[0, spin, 0]}>
          <mesh><sphereGeometry args={[0.075, 18, 14]} /><meshStandardMaterial color="#f2eee4" roughness={0.6} /></mesh>
          <mesh position={[0, 0.09, 0]}><boxGeometry args={[0.18, 0.07, 0.06]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
          <mesh position={[0, -0.06, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.08, 0.008, 8, 24]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
          {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * 2 * PI, fl = 0.5 * open; return <mesh key={i} position={[Math.cos(a) * (0.08 + fl * 0.1), -0.16 + fl * 0.04, Math.sin(a) * (0.08 + fl * 0.1)]} rotation={[Math.sin(a) * fl, 0, -Math.cos(a) * fl]}><boxGeometry args={[0.02, 0.2, 0.003]} /><meshStandardMaterial color="#f8f6f0" side={THREE.DoubleSide} /></mesh>; })}
          {[0, 1, 2, 3].map((i) => <mesh key={"b" + i} position={[Math.cos(i * PI / 2) * (0.1 + 0.08 * open), -0.3 + open * 0.06, Math.sin(i * PI / 2) * (0.1 + 0.08 * open)]}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#c8302a" /></mesh>)}
        </group>
      </group>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[1.0 - ((tt * 0.22 + i * 0.18) % 2.2), 0.8 + rn(i, 1) * 0.4, -1.1 - rn(i, 2) * 0.3]}><sphereGeometry args={[0.2 + rn(i, 3) * 0.12, 12, 10]} /><meshStandardMaterial color="#4a4440" transparent opacity={0.06 + 0.14 * eio(tt, aH - 1, aH)} depthWrite={false} /></mesh>)}
      <pointLight position={[0.6, 0.3, -0.6]} intensity={2.8} distance={2.2} color="#ff7a30" />
      <pointLight position={[-0.4, 1.2, 0.8]} intensity={1.4} distance={2.5} color="#ffe0c0" />
    </>;
  }}</U3>;
};

// ---- VientoNoFuego · la veleta grande al centro (flecha de hierro con la cola de tela) y la fila de casas ardiendo detrás: en «viento»
// la flecha apunta a la izquierda y todas las llamas se inclinan igual; en «cambia» la veleta gira y las llamas se vuelven hacia vos ----
const VientoNoFuego: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "viento", 1.2), aC = sec(p, "cambia", 3.0);
  return <U3 d={d} bg={p.bg} ground={[90, 74, 56]} mode="wipe" sky="#1c1612" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.36, 0], az: [-0.1, 0.06], el: [0.1, 0.08], r: [1.55, 1.45], fov: 34 }}>{(tt) => {
    const turn = eio(tt, aC, aC + 0.9), ang = lerp(0, PI * 0.85, turn), wob = 0.06 * Math.sin(tt * 2 * PI * 1.2), lean = lerp(0.85, -0.25, turn) * eio(tt, aV, aV + 0.5);
    return <>
      <group position={[0, 0, 0.3]}><mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.016, 0.6, 10]} />{M.steel({ col: "#2a2826" })}</mesh>
        <group position={[0, 0.6, 0]} rotation={[0, ang + wob * eio(tt, aV, aV + 0.3), 0]}>
          <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />{M.steel({ col: "#2a2826" })}</mesh>
          <mesh position={[-0.27, 0, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.035, 0.08, 4]} />{M.steel({ col: "#2a2826" })}</mesh>
          {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.24 + i * 0.05, Math.sin(tt * 4 + i) * 0.006, Math.sin(tt * 3 + i) * 0.012 * i]}><boxGeometry args={[0.05, 0.1 - i * 0.012, 0.003]} /><meshStandardMaterial color={i % 2 ? "#c8302a" : "#f4f0e6"} side={THREE.DoubleSide} /></mesh>)}
        </group></group>
      {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.6 + i * 0.2, 0, -0.4]}>
        <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.16, 0.14, 0.14]} /><meshStandardMaterial color="#2a201a" /></mesh>
        <Llama p={[0, 0.14, 0]} k={1} s={1.4} lean={lean} ph={i * 1.7} tt={tt} /></group>)}
      <pointLight position={[0, 0.4, -0.2]} intensity={3.5 + turn * 2} distance={2} color="#ff8030" />
      <group position={[0.2, 0, 0.42]}><Stickman escala={0.13} rotY={-30} guion={[{ t: 0, accion: "senalar", expr: "decidido" }, { t: aC + 0.3, accion: "asustarse", expr: "asustado" }]} semilla={36} contacto={0} color="#2a3a5a" /></group>
    </>;
  }}</U3>;
};

// ---- IslaJaula · la laguna vista desde arriba: Venecia grande a un lado y la isla chica con sus chimeneas; en «isla» los hornos cruzan
// en barcas; en «vigilados» un anillo cerrado de diez botes de guardia con farolitos rodea la isla ----
const IslaJaula: React.FC<UP> = ({ d, p }) => {
  const aI = sec(p, "isla", 1.0), aV = sec(p, "vigilados", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" sky="#1a2228" key1={[-1, 2.8, 1.6]}
    cam={{ at: [0.0, 0, 0.05], at1: [0.55, 0, 0.1], az: [-0.2, -0.05], el: [0.95, 1.1], r: [2.2, 1.75], fov: 34 }}>{(tt) => {
    const cross = eio(tt, aI, aI + 1.6);
    return <>
      <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#2e4a56" roughness={0.55} /></mesh>
      <mesh position={[-0.7, 0.03, 0]}><cylinderGeometry args={[0.45, 0.5, 0.06, 32]} /><meshStandardMaterial color="#b8a888" /></mesh>
      {Array.from({ length: 22 }, (_, i) => <RBox key={i} s={[0.1, 0.08 + rn(i, 1) * 0.1, 0.1]} r={0.005} p={[-0.7 + (rn(i, 2) - 0.5) * 0.65, 0.1, (rn(i, 3) - 0.5) * 0.65]}><meshStandardMaterial color={`hsl(${20 + rn(i, 4) * 20},40%,${50 + rn(i, 5) * 15}%)`} /></RBox>)}
      <mesh position={[0.75, 0.03, 0.1]}><cylinderGeometry args={[0.3, 0.33, 0.06, 28]} /><meshStandardMaterial color="#a89878" /></mesh>
      {[0, 1, 2].map((i) => <group key={i} position={[0.65 + i * 0.1, 0.06, 0.05 + (i % 2) * 0.1]}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.08, 0.1, 0.08]} /><meshStandardMaterial map={tex.wood(1, 1, [140, 70, 50])} /></mesh>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.012, 0.015, 0.12, 8]} /><meshStandardMaterial color="#5a3a2a" /></mesh>
        <mesh position={[0, 0.24, 0]} scale={sm(cross)}><sphereGeometry args={[0.03, 8, 6]} /><meshStandardMaterial color="#ff9040" emissive="#ff6020" emissiveIntensity={1.2} /></mesh></group>)}
      {[0, 1, 2].map((i) => <group key={"b" + i} position={[lerp(-0.45, 0.5, cl(cross * 1.2 - i * 0.1)), 0.02, -0.1 + i * 0.12]}>
        <mesh scale={[1, 0.3, 0.4]}><sphereGeometry args={[0.06, 10, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh>
        <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.04, 0.04, 0.03]} /><meshStandardMaterial color="#ff9040" emissive="#ff6020" emissiveIntensity={1} /></mesh></group>)}
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 2 * PI + tt * 0.25, r = 0.55, k = eio(tt, aV + i * 0.08, aV + i * 0.08 + 0.5); return <group key={"g" + i} position={[0.75 + Math.cos(a) * r, 0.02, 0.1 + Math.sin(a) * r]} rotation={[0, -a, 0]} scale={sm(2 * k)}>
        <mesh scale={[0.4, 0.3, 1.2]}><sphereGeometry args={[0.06, 10, 8]} /><meshStandardMaterial color="#1a1a1e" /></mesh>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.02, 0.025, 0.02]} /><meshStandardMaterial color="#ffd890" emissive="#ffb050" emissiveIntensity={1.2} /></mesh></group>; })}
      {/* el anillo que los une: la ronda cerrada */}
      <mesh position={[0.75, 0.012, 0.1]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.535, 0.565, 64]} /><meshBasicMaterial color="#ffd890" transparent opacity={0.5 * eio(tt, aV + 0.8, aV + 1.4)} /></mesh>
      <pointLight position={[0.75, 0.6, 0.1]} intensity={1.5} distance={2} color="#ffd8a0" />
    </>;
  }}</U3>;
};

// ---- CopaCadena · la copa de cristal de Murano girando en su pedestal; en «nunca» una cadena gruesa se tensa desde el pie de la copa
// hasta el ancla clavada en la piedra de la isla y la copa deja de girar; en «traidor» la luz se vuelve roja ----
const CopaCadena: React.FC<UP> = ({ d, p }) => {
  const aN = sec(p, "nunca", 1.5), aT = sec(p, "traidor", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0b0a" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.33, 0.24, 0], az: [-0.08, 0.04], el: [0.16, 0.12], r: [1.6, 1.5], fov: 32 }}>{(tt) => {
    const ch = eio(tt, aN, aN + 1.2), ten = eio(tt, aN + 1.3, aN + 1.6), red = eio(tt, aT, aT + 0.6), A = [0.06, 0.16], B = [0.62, 0.18], NL = 16;
    return <>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.14, 0.16, 0.12, 32]} /><meshStandardMaterial color="#2a2420" roughness={0.5} /></mesh>
      <group position={[0, 0.12, 0]} rotation={[0, tt * 0.6 * (1 - ten), 0]}><Goblet s={1.7} col="#cfe8ff" op={0.5} />
        <mesh position={[0, 0.27, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.11, 0.005, 8, 40]} />{M.brass({ col: "#d8b060" })}</mesh></group>
      {/* la piedra de la isla con el ancla de hierro */}
      <RBox s={[0.3, 0.08, 0.3]} r={0.03} p={[0.68, 0.04, 0]}><meshStandardMaterial map={dirtT([110, 104, 96])} roughness={0.95} /></RBox>
      <group position={[0.66, 0.08, 0]}>
        <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.016, 0.016, 0.22, 10]} />{M.steel({ col: "#4a4642" })}</mesh>
        <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.16, 0.02, 0.02]} />{M.steel({ col: "#4a4642" })}</mesh>
        <mesh position={[0, 0.24, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.03, 0.008, 8, 18]} />{M.steel({ col: "#4a4642" })}</mesh>
        <mesh position={[0, 0.06, 0]} rotation={[0, 0, PI]}><torusGeometry args={[0.07, 0.013, 8, 24, PI]} />{M.steel({ col: "#4a4642" })}</mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.07, 0.07, 0]} rotation={[0, 0, sd * 0.5]}><coneGeometry args={[0.025, 0.05, 4]} />{M.steel({ col: "#4a4642" })}</mesh>)}
      </group>
      {Array.from({ length: NL }, (_, i) => { const u = (i + 0.5) / NL, on = cl(ch * NL * 1.2 - i), sag = 0.09 * Math.sin(PI * u) * (1 - ten);
        return <mesh key={i} position={[lerp(A[0], B[0] + 0.04, u), lerp(A[1], B[1] + 0.13, u) - sag, 0]} rotation={[i % 2 ? PI / 2 : 0, 0, Math.atan2(0.01, 0.56)]} scale={sm(on)}><torusGeometry args={[0.018, 0.006, 8, 14]} />{M.steel({ col: "#6a6e72" })}</mesh>; })}
      <mesh position={[0, 0.17, 0]} rotation={[PI / 2, 0, 0]} scale={sm(ch)}><torusGeometry args={[0.045, 0.008, 8, 20]} />{M.steel({ col: "#6a6e72" })}</mesh>
      <pointLight position={[0.66, 0.4, 0.3]} intensity={1.4} distance={1} color="#e8eef4" />
      <spotLight position={[0, 1.5, 0.6]} angle={0.45} penumbra={0.6} intensity={8} distance={3} color={new THREE.Color().lerpColors(new THREE.Color("#fff4e0"), new THREE.Color("#ff3a2a"), red)} />
    </>;
  }}</U3>;
};

// ---- HornoMil · el horno de ladrillo en cúpula con la boca incandescente; al lado el termómetro de mercurio entero, de la bola al tope,
// sube hasta 1000; en «ojos» el aire tiembla delante de la boca y caen gotas de sudor ----
const HornoMil: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "mil", 1.5), aO = sec(p, "ojos", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#120a06" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0.1, 0.36, 0], az: [-0.3, -0.12], el: [0.1, 0.08], r: [1.45, 1.25], fov: 34 }}>{(tt) => {
    const lv = eio(tt, 0.3, aM + 0.8), glow = 1 + 0.12 * Math.sin(tt * 2 * PI * 0.8);
    return <>
      <mesh position={[-0.15, 0.2, -0.2]}><cylinderGeometry args={[0.5, 0.52, 0.4, 40]} /><meshStandardMaterial map={brickT([120, 64, 44], 6, 2)} roughness={0.95} /></mesh>
      <mesh position={[-0.15, 0.4, -0.2]}><sphereGeometry args={[0.5, 40, 20, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial map={brickT([120, 64, 44], 6, 2)} roughness={0.95} /></mesh>
      <mesh position={[-0.15, 0.95, -0.25]}><cylinderGeometry args={[0.07, 0.08, 0.3, 16]} /><meshStandardMaterial map={brickT([100, 54, 40], 1, 2)} /></mesh>
      {/* la boca en arco, con el resplandor y las brasas */}
      <group position={[-0.15, 0.28, 0.31]}><mesh><circleGeometry args={[0.16, 32, 0, PI]} /><meshBasicMaterial color={new THREE.Color(1, 0.62, 0.22).multiplyScalar(glow)} toneMapped={false} /></mesh>
        <mesh position={[0, -0.06, 0]}><planeGeometry args={[0.32, 0.12]} /><meshBasicMaterial color={new THREE.Color(1, 0.5, 0.15).multiplyScalar(glow)} toneMapped={false} /></mesh>
        <mesh position={[0, 0.01, 0.005]}><ringGeometry args={[0.16, 0.2, 32, 1, 0, PI]} /><meshStandardMaterial map={brickT([90, 50, 36], 2, 1)} /></mesh></group>
      <pointLight position={[-0.15, 0.3, 0.55]} intensity={5 * glow} distance={2.5} color="#ff9030" />
      {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.35 + rn(i, 1)) % 1; return <mesh key={"br" + i} position={[-0.15 + (rn(i, 2) - 0.5) * 0.25 + 0.06 * Math.sin(u * 5 + i), 0.24 + 0.55 * u, 0.36 + 0.12 * u]} scale={sm(1 - u)}><sphereGeometry args={[0.01 + 0.006 * rn(i, 3), 6, 6]} />{M.glow({ col: "#ffa040" })}</mesh>; })}
      <group position={[0.4, 0.02, 0.2]} scale={0.75}>
        <RBox s={[0.12, 0.86, 0.02]} r={0.01} p={[0, 0.45, -0.03]}>{M.wood({ base: [150, 110, 70] })}</RBox>
        <mesh position={[0, 0.47, 0]}><cylinderGeometry args={[0.022, 0.022, 0.72, 16]} />{M.glass({ op: 0.35 })}</mesh>
        <mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.045, 16, 12]} /><meshStandardMaterial color="#c8202a" emissive="#a01010" emissiveIntensity={0.6} /></mesh>
        <mesh position={[0, 0.11 + 0.34 * lv, 0]} scale={[1, sm(lv), 1]}><cylinderGeometry args={[0.013, 0.013, 0.68, 10]} /><meshStandardMaterial color="#ff3a2a" emissive="#ff2010" emissiveIntensity={1.4} toneMapped={false} /></mesh>
        {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[-0.035, 0.13 + i * 0.066, 0.012]}><boxGeometry args={[i % 5 === 0 ? 0.03 : 0.018, 0.004, 0.002]} /><meshBasicMaterial color="#2a1c10" /></mesh>)}
      </group>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.15 + i * 0.03, 0.6 - ((tt - aO - i * 0.2) * 0.5 % 0.6), 0.4]} visible={tt > aO + i * 0.2} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 8, 6]} />{M.water({ op: 0.6 })}</mesh>)}
      {Array.from({ length: 4 }, (_, i) => <mesh key={"h" + i} position={[-0.15 + Math.sin(tt * 3 + i) * 0.02, 0.42, 0.35 + i * 0.06]}><planeGeometry args={[0.5, 0.4]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.05 * eio(tt, aO, aO + 0.6)} depthWrite={false} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- CanaGira · el soplador sostiene la caña larga y la hace girar; en la punta la gota de vidrio al rojo, con una espiral que muestra
// que gira; en «quieto» deja de girar y la gota se estira y cae hacia el piso; en «girando» vuelve a girar y se recupera ----
const CanaGira: React.FC<UP> = ({ d, p }) => {
  const aQ = sec(p, "quieto", 1.5), aG = sec(p, "girando", 3.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0806" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0.15, 0.4, 0], az: [-0.3, -0.12], el: [0.08, 0.06], r: [1.2, 0.95], fov: 32 }}>{(tt) => {
    const stop = eio(tt, aQ, aQ + 0.3) * (1 - eio(tt, aG, aG + 0.4)), sag = eio(tt, aQ, aG) * (1 - eio(tt, aG, aG + 0.8)), rot = tt * 5 * (1 - stop);
    return <>
      <group position={[-0.42, 0.0, 0.05]}><Stickman escala={0.17} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }, { t: aQ + 0.2, accion: "asustarse", expr: "asustado" }, { t: aG + 0.3, accion: "empujar", expr: "decidido" }]} semilla={38} contacto={0} color="#5a4a3a" /></group>
      <mesh position={[-0.05, 0.4, 0]} rotation={[rot, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.9, 12]} />{M.steel({ col: "#b8b4ae" })}</mesh>
      <RBox s={[0.5, 0.04, 0.06]} r={0.01} p={[-0.25, 0.36, 0]}>{M.wood({ base: [80, 56, 34] })}</RBox>
      <group position={[0.45, 0.4, 0]}>
        <group rotation={[rot, 0, 0]}><mesh scale={[1, 1 + 0.25 * sag, 1]}><sphereGeometry args={[0.09, 28, 20]} /><meshStandardMaterial color="#e87a30" emissive="#ff5a10" emissiveIntensity={0.55} roughness={0.2} /></mesh>
          <mesh rotation={[0, PI / 2, 0]}><torusGeometry args={[0.09, 0.007, 8, 32]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffc060" emissiveIntensity={1.6} /></mesh></group>
        <mesh position={[0, -0.09 - 0.14 * sag, 0]} scale={[1, sm(0.2 + sag * 2.6), 1]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color="#ffb050" emissive="#ff6a10" emissiveIntensity={1.4} /></mesh>
        <mesh position={[0, -0.38 * eio(tt, aQ + 1.0, aQ + 1.4) - 0.2, 0]} visible={tt > aQ + 1.0 && tt < aG} scale={[1, 1.5, 1]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color="#ff8a30" emissive="#ff5a10" emissiveIntensity={1.4} /></mesh>
      </group>
      <pointLight position={[0.45, 0.4, 0.2]} intensity={2.6} distance={1.2} color="#ff8a30" />
    </>;
  }}</U3>;
};

// ---- TopCincoCiudad · podio de cinco alturas (5 el más bajo, 1 el más alto) con un objeto grande arriba de cada uno: 5 el pañuelo con el
// vapor verde, 4 la llama, 3 el farol apagado, 2 el cántaro que se ilumina y derrama, 1 el reloj de engranajes; el actual crece y se
// ilumina, los demás bajan la luz ----
const TopCincoCiudad: React.FC<UP> = ({ d, p }) => {
  const keys = ["cinco", "cuatro", "tres", "dos", "uno"], A = keys.map((k, i) => sec(p, k, 0.5 + i * 2));
  const cur = (tt: number) => A.reduce((c, a, i) => (tt >= a ? i : c), -1);
  const obj = (i: number, tt: number, on: number) => i === 0 ? <group>{Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Math.sin(tt * 1.5 + j) * 0.04, 0.06 + ((tt * 0.12 + j * 0.05) % 0.3), 0]}><sphereGeometry args={[0.05 + j * 0.006, 10, 8]} /><meshBasicMaterial color="#8ab060" transparent opacity={0.35} depthWrite={false} /></mesh>)}<mesh scale={[1.2, 0.25, 1.2]}><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color="#e8e0d0" /></mesh></group>
    : i === 1 ? <Llama p={[0, 0, 0]} k={1} s={1.4} tt={tt} />
    : i === 2 ? <Lantern p={[0, 0.1, 0]} s={1.9} on={0.05} />
    : i === 3 ? <group rotation={[0, 0, -0.9 * on]}><mesh position={[0, 0.08, 0]}>{/* cántaro */}<sphereGeometry args={[0.08, 18, 14]} /><meshStandardMaterial color="#9a5a3a" roughness={0.7} /></mesh>
        <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.035, 0.05, 0.06, 14]} /><meshStandardMaterial color="#9a5a3a" roughness={0.7} /></mesh>
        <mesh position={[-0.03, 0.23, 0]} rotation={[0, 0, 0.9 * on]} scale={[1, sm(on), 1]}><cylinderGeometry args={[0.018, 0.03, 0.3, 10]} />{M.water({ op: 0.75 })}</mesh></group>
    : <group position={[0, 0.1, 0]}>{[0, 1].map((j) => <mesh key={j} position={[j * 0.1 - 0.05, j * 0.04, 0]} rotation={[PI / 2, (j ? -1 : 1) * tt * 2, 0]}><cylinderGeometry args={[0.07 - j * 0.02, 0.07 - j * 0.02, 0.02, 14]} />{M.brass()}</mesh>)}</group>;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.5, 0], az: [-0.08, 0.06], el: [0.16, 0.14], r: [2.35, 2.2], fov: 36 }}>{(tt) => { const c = cur(tt); return <>
      {keys.map((_, i) => { const x = (2 - i) * 0.42, z = -Math.abs(i - 2) * 0.1, h = 0.12 + i * 0.09, k = pop(tt, A[i]), on = eio(tt, A[i], A[i] + 0.4), isC = c === i ? 1 : 0, past = c > i ? 1 : 0;
        return <group key={i} position={[x, 0, z + 0.18 * isC * on]}>
          <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.15, 0.17, h, 32]} /><meshStandardMaterial map={dirtT([96, 88, 78])} roughness={0.7} /></mesh>
          <group position={[0, h, 0]} scale={sm(1.9 * k * (1 + 0.35 * isC * on) * (1 - 0.15 * past))}>{obj(i, tt, isC ? on : past)}</group>
          <spotLight position={[x * 0.2, 1.6, 0.6]} angle={0.22} penumbra={0.6} intensity={1 + 9 * isC * on + 2 * past} distance={3} color="#fff0d8" />
        </group>; })}
    </>; }}</U3>;
};

// ---- CajonCorte · el cajón bajo el río en corte: el agua azul arriba, el lecho, y el cajón de madera hundiéndose; adentro la cámara de
// aire iluminada con tres obreros cavando; en «empuja» flechas blancas empujan el agua hacia afuera por los bordes; en «veinticuatro»
// el cajón llega a la marca roja de 24 m ----
const CajonCorte: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "empuja", 1.5), aV = sec(p, "veinticuatro", 3.0);
  return <U3 over={(tt) => <Drums v={24 * eio(tt, 0.3, aV + 1.0)} n={2} x={1450} y={110} s={1.0} unit="m" op={1} />} d={d} bg={p.bg} ground={null} mode="wipe" sky="#14202a" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.06, 0.05], el: [0.06, 0.05], r: [1.55, 1.4], fov: 36 }}>{(tt) => {
    const sink = 0.3 * eio(tt, 0.3, aV + 1.0), push = eio(tt, aE, aE + 0.8), ph = (tt * 0.8) % 1;
    return <>
      <mesh position={[0, 0.85, -0.1]}><boxGeometry args={[3, 0.6, 0.4]} /><meshPhysicalMaterial color="#2a6a8a" transparent opacity={0.7} roughness={0.1} depthWrite={false} /></mesh>
      <mesh position={[0, 1.15, 0.1]}><planeGeometry args={[3, 0.01]} /><meshBasicMaterial color="#cfe8ff" /></mesh>
      <mesh position={[0, 0.25, -0.12]}><boxGeometry args={[3, 0.7, 0.4]} /><meshStandardMaterial map={dirtT([84, 70, 52])} roughness={1} /></mesh>
      <group position={[0, 0.5 - sink, 0]}>
        <RBox s={[1.1, 0.07, 0.42]} r={0.01} p={[0, 0.3, 0]}>{M.wood({ base: [90, 62, 36] })}</RBox>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.53, 0.1, 0]} rotation={[0, 0, s * 0.15]}><boxGeometry args={[0.06, 0.42, 0.42]} />{M.wood({ base: [90, 62, 36] })}</mesh>)}
        <mesh position={[0, 0.1, -0.02]}><boxGeometry args={[1.0, 0.36, 0.36]} /><meshStandardMaterial color="#8a7458" roughness={1} /></mesh>
        {[-0.3, 0.0, 0.3].map((x, i) => <group key={i} position={[x, -0.08, 0.12]}><Stickman escala={0.13} rotY={i === 1 ? 0 : (i ? -30 : 30)} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={40 + i} contacto={0} color="#3a3028" /><Lantern p={[0.08, 0.18, 0]} s={0.55} /></group>)}
        <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />{M.steel({ col: "#5a5e62" })}</mesh>
        {[-1, 1].map((s) => Array.from({ length: 3 }, (_, j) => <mesh key={s + "a" + j} position={[s * (0.62 + 0.1 * push + j * 0.09 + 0.05 * ph), -0.1, 0.2]} rotation={[0, 0, -s * PI / 2]} scale={sm(push * 2.4)}><coneGeometry args={[0.03, 0.08, 10]} /><meshStandardMaterial color="#ffffff" emissive="#cfe8ff" emissiveIntensity={1.2} /></mesh>))}
        <pointLight position={[0, 0.12, 0.25]} intensity={1.2} distance={1.0} color="#ffd090" />
      </group>
      <group position={[1.25, 0, 0.25]}><mesh position={[0, 0.5, 0]}><boxGeometry args={[0.03, 0.6, 0.01]} />{M.wood({ base: [190, 150, 90] })}</mesh>
        {[0, 6, 12, 18, 24].map((m, i) => <mesh key={m} position={[-0.03, 0.78 - i * 0.075, 0.006]}><boxGeometry args={[0.07, 0.008, 0.004]} /><meshBasicMaterial color={m === 24 ? "#ff3a2a" : "#2a1c10"} /></mesh>)}</group>
    </>;
  }}</U3>;
};

// ---- BotellaBurbujas · la botella de gaseosa verde: en «burbujas» salta el tapón y el líquido se llena de burbujas; un hilo de las
// mismas burbujas viaja hasta el obrero de al lado y se le prende en las rodillas, los codos y el pecho; se dobla de dolor ----
const BotellaBurbujas: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "burbujas", 1.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#0d0b0a" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.0, 0.28, 0], az: [-0.16, 0.04], el: [0.12, 0.1], r: [1.1, 1.0], fov: 32 }}>{(tt) => {
    const pop2 = eio(tt, aB, aB + 0.25), JT = [[0.04, 0.08], [-0.04, 0.08], [0.06, 0.2], [-0.06, 0.2], [0, 0.26]];
    return <>
      <group position={[-0.3, 0, 0]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.09, 0.09, 0.38, 28, 1, true]} />{M.glass({ col: "#8ad0a0", op: 0.22 })}</mesh>
        <mesh position={[0, 0.43, 0]}><cylinderGeometry args={[0.028, 0.09, 0.1, 24, 1, true]} />{M.glass({ col: "#8ad0a0", op: 0.22 })}</mesh>
        <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.083, 0.083, 0.32, 24]} /><meshPhysicalMaterial color="#e0a050" transparent opacity={0.45} roughness={0.1} transmission={0.3} /></mesh>
        <pointLight position={[0, 0.2, 0.2]} intensity={0.8} distance={0.6} color="#ffd080" />
        <mesh position={[0.08 * pop2, 0.5 + 0.35 * pop2 - 0.4 * pop2 * pop2, 0]} rotation={[0, 0, -pop2 * 3]}><cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />{M.brass({ col: "#c8a040" })}</mesh>
        {Array.from({ length: 40 }, (_, i) => { const st = aB + rn(i, 1) * 1.5, y = 0.05 + ((tt - st) * (0.3 + rn(i, 2) * 0.3)) % 0.5; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.13, y, (rn(i, 4) - 0.5) * 0.13]} visible={tt > st}><sphereGeometry args={[0.007 + rn(i, 5) * 0.007, 8, 6]} /><meshPhysicalMaterial color="#fff" transparent opacity={0.6} roughness={0.05} /></mesh>; })}
      </group>
      {/* el hilo de burbujas que viaja de la botella al cuerpo */}
      {Array.from({ length: 16 }, (_, i) => { const u = ((tt - aB - 0.4) * 0.5 + i / 16) % 1, on = tt > aB + 0.4 ? 1 : 0; return <mesh key={"h" + i} position={[lerp(-0.3, 0.28, u), 0.5 + Math.sin(u * PI) * 0.12 - u * 0.25, 0]} scale={sm(on * Math.sin(PI * u))}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#cfe8ff" emissive="#80c0ff" emissiveIntensity={0.8} /></mesh>; })}
      <group position={[0.3, 0, 0]}>
        <Stickman escala={0.15} rotY={-20} guion={[{ t: 0, accion: "idle", expr: "neutral" }, { t: aB + 0.9, accion: "encogerse_de_hombros", expr: "llorando" }]} semilla={44} contacto={0} color="#4a5a6e" />
        {Array.from({ length: 25 }, (_, i) => { const j = JT[i % 5], st = aB + 0.9 + rn(i, 1) * 0.8; return <mesh key={i} position={[j[0] + (rn(i, 2) - 0.5) * 0.04, j[1] + (rn(i, 3) - 0.5) * 0.04, 0.05]} scale={sm(eio(tt, st, st + 0.4))}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#cfe8ff" emissive="#80c0ff" emissiveIntensity={1} /></mesh>; })}
      </group>
      <pointLight position={[0, 0.6, 0.5]} intensity={1.6} distance={2} color="#fff0d8" />
    </>;
  }}</U3>;
};

// ---- CatalejoVentana · por encima del hombro de Roebling, sentado en la ventana con el catalejo apoyado: allá, cruzando el río, el
// puente en obra con sus dos torres de arcos góticos y andamios; en «emily» una carta va y viene en un hilo de luz entre los dos ----
const CatalejoVentana: React.FC<UP> = ({ d, p }) => {
  const aV = sec(p, "ventana", 1.0), aE = sec(p, "emily", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" sky="#1a1c22" key1={[-0.8, 2.2, 1.4]}
    cam={{ at: [0.1, 0.5, -0.8], at1: [0.25, 0.5, -1.6], az: [-0.3, -0.12], el: [0.1, 0.06], r: [1.9, 1.5], fov: 34 }}>{(tt) => {
    const run = ((tt - aE) * 0.45) % 1;
    return <>
      <group position={[0, 0, -0.1]}>{[[-0.45, 0.5, 0.06, 1.0], [0.45, 0.5, 0.06, 1.0], [0, 1.0, 0.96, 0.06], [0, 0.0, 0.96, 0.06], [0, 0.5, 0.96, 0.03]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.06]} r={0.005} p={[x, y, 0]}>{M.wood({ base: [110, 80, 50] })}</RBox>)}</group>
      <group position={[-0.36, 0.0, 0.3]}><Stickman escala={0.13} rotY={150} guion={[{ t: 0, accion: "pensar", expr: "pensativo" }]} semilla={48} contacto={0} color="#3a3430" /></group>
      <group position={[-0.22, 0.36, 0.16]} rotation={[0.05, 0.4, 0]} scale={0.7}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.03, 0.42, 20]} />{M.brass({ col: "#c89a4a" })}</mesh>
        <mesh position={[0, -0.2, 0.05]}><cylinderGeometry args={[0.007, 0.007, 0.4, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh></group>
      <mesh position={[0.3, -0.05, -1.6]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[5, 1.6]} /><meshStandardMaterial color="#34505c" roughness={0.4} /></mesh>
      <group position={[0.3, 0.0, -2.4]}>
        {[-0.7, 0.7].map((x, i) => <group key={i} position={[x, 0, 0]}><mesh position={[0, 0.5, 0]}><boxGeometry args={[0.22, 1.0, 0.14]} /><meshStandardMaterial map={dirtT([170, 156, 132])} /></mesh>
          {[-0.05, 0.05].map((ax) => <mesh key={ax} position={[ax, 0.72, 0.075]}><planeGeometry args={[0.05, 0.22]} /><meshBasicMaterial color="#1a1c22" /></mesh>)}
          {Array.from({ length: 6 }, (_, j) => <mesh key={"s" + j} position={[0.14, 0.1 + j * 0.16, 0.08]}><boxGeometry args={[0.004, 0.004, 0.2]} />{M.wood({ base: [90, 70, 50] })}</mesh>)}
          <mesh position={[0.14, 0.5, 0.08]}><boxGeometry args={[0.004, 1.0, 0.004]} />{M.wood({ base: [90, 70, 50] })}</mesh></group>)}
        {[-1, 1].map((s) => Array.from({ length: 4 }, (_, j) => <mesh key={s + "c" + j} position={[s * (0.36 - j * 0.02), 0.62 - j * 0.04, 0]} rotation={[0, 0, s * (-0.42 + j * 0.06)]}><cylinderGeometry args={[0.003, 0.003, 0.85, 6]} /><meshStandardMaterial color="#d8d0c0" /></mesh>))}
        <mesh position={[0, 0.25, 0]}><boxGeometry args={[2.2, 0.04, 0.1]} /><meshStandardMaterial color="#8a7a62" /></mesh></group>
      <mesh position={[lerp(-0.2, 0.3, run), lerp(0.36, 0.75, Math.sin(PI * run)), lerp(0.14, -2.3, run)]} visible={tt > aE} rotation={[0.3, run * 4, 0]}><boxGeometry args={[0.08, 0.055, 0.003]} /><meshStandardMaterial map={tex.paper()} emissive="#fff0c0" emissiveIntensity={0.5} /></mesh>
      <pointLight position={[0.2, 0.6, 0.3]} intensity={1.8 * eio(tt, aV, aV + 0.6) + 0.6} distance={2} color="#ffe0b0" />
      <pointLight position={[0.3, 1.2, -2.0]} intensity={1.4} distance={3} color="#dce6ff" />
    </>;
  }}</U3>;
};

// ---- SubidaLenta · dos escaleras de piedra rectas, lado a lado: el de la izquierda (en «corrian») sube de un tirón, llega arriba, se
// marea (estrellitas girando sobre la cabeza) y se cae; el de la derecha (en «viejos») sube parejo, escalón por escalón, y llega bien ----
const SubidaLenta: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corrian", 1.0), aV = sec(p, "viejos", 3.0), D = d / 30, NS = 10, SH = 0.07, SD = 0.1;
  const stair = (x: number, k: string) => <group key={k} position={[x, 0, 0]}>
    {Array.from({ length: NS }, (_, i) => <RBox key={i} s={[0.32, SH * (i + 1), SD]} r={0.006} p={[0, SH * (i + 1) / 2, -i * SD]}><meshStandardMaterial map={dirtT([128 + rn(i, 1) * 20, 120, 106])} roughness={0.95} /></RBox>)}</group>;
  const pos = (u: number, x: number) => { const s = u * (NS - 1); return [x, SH * (Math.floor(s) + 1) + SH * eio(s % 1, 0.3, 0.7), -s * SD]; };
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.38, -0.45], az: [-0.5, -0.4], el: [0.16, 0.2], r: [2.1, 1.95], fov: 36 }}>{(tt) => {
    const uF = eio(tt, aC, aC + 0.9), uS = 0.1 + 0.9 * cl((tt - aV) / Math.max(1, D - aV - 0.8)), dizzy = eio(tt, aC + 0.9, aC + 1.2), fall = eio(tt, aC + 2.0, aC + 2.5);
    const pf = pos(uF, -0.3), ps = pos(uS, 0.3);
    return <>
      {stair(-0.3, "a")}{stair(0.3, "b")}
      <group position={pf as any} rotation={[0, 0, 0.9 * fall]}><Stickman enSitio escala={0.15} rotY={180} guion={[{ t: 0, accion: "correr", expr: "decidido" }, { t: aC + 0.9, accion: "asustarse", expr: "confundido" }, { t: aC + 2.0, accion: "caerse_y_levantarse", expr: "asustado" }]} semilla={46} contacto={0} color="#7a5a4a" />
        {Array.from({ length: 5 }, (_, i) => { const a = tt * 2 * PI * 0.8 + i * 2 * PI / 5; return <mesh key={i} position={[Math.cos(a) * 0.06, 0.28, Math.sin(a) * 0.06]} scale={sm(dizzy * (1 - fall))}><octahedronGeometry args={[0.012]} /><meshStandardMaterial color="#ffe060" emissive="#ffc020" emissiveIntensity={1.2} /></mesh>; })}</group>
      <group position={ps as any}><Stickman enSitio escala={0.15} rotY={180} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={47} contacto={0} color="#4a5a6a" /></group>
      <pointLight position={[0, 1.2, -0.6]} intensity={2.4} distance={2.5} color="#e0eaff" />
      <pointLight position={[0, 0.4, 0.6]} intensity={1.2} distance={2} color="#ffd8a8" />
    </>;
  }}</U3>;
};

// ---- RankingCiudades · cinco postes con su farol, la altura = cuánto aguanta el que renuncia (2 min, 30 s, 45 s, una hora de por vida,
// una hora); debajo de cada uno, su ciudad en miniatura: el caño de Londres, la calavera de París, la casita de Edo, la copa de Murano,
// la torre de Brooklyn; cada farol se enciende y sube a su altura en su nombre ----
const RankingCiudades: React.FC<UP> = ({ d, p }) => {
  const keys = ["londres", "paris", "edo", "murano", "brooklyn"], A = keys.map((k, i) => sec(p, k, 0.5 + i * 2.2));
  const H = [120, 30, 45, 3600, 3600].map((s) => 0.18 + 0.75 * Math.log10(s / 20) / Math.log10(3600 / 20));
  const city = (i: number) => i === 0 ? <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.16, 20, 1, true, 0, PI]} /><meshStandardMaterial map={brickT([120, 74, 52], 1, 1)} side={THREE.DoubleSide} /></mesh>
    : i === 1 ? <Skull p={[0, 0.05, 0]} s={1.5} />
    : i === 2 ? <Casa p={[0, 0, 0]} s={0.75} />
    : i === 3 ? <Goblet s={0.9} col="#cfe8ff" op={0.5} />
    : <group>{[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.09, 0]}><boxGeometry args={[0.035, 0.18, 0.04]} /><meshStandardMaterial map={dirtT([170, 156, 132])} /></mesh>)}<mesh position={[0, 0.15, 0]}><boxGeometry args={[0.14, 0.02, 0.04]} /><meshStandardMaterial color="#8a7a62" /></mesh></group>;
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" sky="#0d0b0a" key1={[-1, 2.6, 1.8]}
    cam={{ at: [0, 0.4, 0], az: [-0.1, 0.08], el: [0.14, 0.1], r: [2.35, 2.2], fov: 36 }}>{(tt) => <>
      {keys.map((_, i) => { const x = (i - 2) * 0.42, k = pop(tt, A[i]), on = eio(tt, A[i], A[i] + 0.9), h = 0.12 + (H[i] - 0.12) * on;
        return <group key={i} position={[x, 0, -Math.abs(i - 2) * 0.08]}>
          <group scale={sm(3.0 * k)}>{city(i)}</group>
          <group position={[0.06, 0, -0.16]} scale={sm(k)}>
          <mesh position={[0.11, (h + 0.12) / 2, 0]} scale={[1, sm(h + 0.12), 1]}><cylinderGeometry args={[0.012, 0.015, 1, 8]} />{M.steel({ col: "#2a2826" })}</mesh>
          <mesh position={[0.11 - 0.025, h + 0.12, 0]}><boxGeometry args={[0.05, 0.006, 0.006]} />{M.steel({ col: "#2a2826" })}</mesh>
          <Lantern p={[0.06, h + 0.05, 0]} s={1.4} on={on} />
          <mesh position={[0.06, h + 0.105, 0]}><cylinderGeometry args={[0.002, 0.002, 0.03, 4]} />{M.steel({ col: "#2a2826" })}</mesh>
          <pointLight position={[0.06, h + 0.05, 0.1]} intensity={0.0001 + 1.2 * on} distance={0.8} color="#ffb860" />
          {i === 3 && Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[0.11, h + 0.02 - j * 0.04, 0.012]} rotation={[0, j % 2 ? PI / 2 : 0, 0]} scale={sm(eio(tt, A[3] + 0.9, A[3] + 1.4))}><torusGeometry args={[0.012, 0.004, 6, 12]} />{M.steel({ col: "#7a7e82" })}</mesh>)}
          </group>
        </group>; })}
    </>}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CiudadMadera, CortaFuego, MatoiTecho, VientoNoFuego, IslaJaula, CopaCadena, HornoMil, CanaGira, TopCincoCiudad, CajonCorte, BotellaBurbujas, CatalejoVentana, SubidaLenta, RankingCiudades };
