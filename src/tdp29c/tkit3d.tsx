// tdp29 · piezas 3D de la tanda (Japón / Corea, lado oculto): puerta corrediza de papel, figuras de madera tipo maniquí,
// casa y edificio con ventanas que se prenden/apagan, libreta de banco, tren de cercanías, carta que se despliega, balanza,
// calendario de pared, reloj de 24 h, cuenco y taza. Todo sale de h3d/lkit3d (materiales en caché); escala nunca 0.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, rn, tex } from "./h3d";
import { PI, txt, HANDF } from "./lkit3d";

type V = number[];
const g3 = (p?: V) => (p ?? [0, 0, 0]) as [number, number, number];

// ---- puerta corrediza de papel (fusuma/shoji): marco de madera, reja fina, papel que deja pasar luz; open 0..1 la corre a la derecha
export const Shoji: React.FC<{ p?: V; r?: V; s?: number; open?: number; light?: number; w?: number; h?: number }> = ({ p, r, s = 1, open = 0, light = 0.4, w = 0.5, h = 0.9 }) =>
  <group position={g3(p)} rotation={g3(r)} scale={s}>
    {/* el cuarto de atrás: luz cálida que se ve por la rendija */}
    <mesh position={[0, h / 2, -0.03]}><planeGeometry args={[w * 0.98, h * 0.98]} /><meshBasicMaterial color={new THREE.Color("#ffcf8a").multiplyScalar(0.25 + 1.2 * light)} toneMapped={false} /></mesh>
    <group position={[open * w * 0.92, 0, 0]}>
      <mesh position={[0, h / 2, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#efe6d0" roughness={0.95} emissive="#ffb766" emissiveIntensity={0.12 + 0.35 * light} side={THREE.DoubleSide} /></mesh>
      {[[0, h - 0.01, w, 0.02], [0, 0.01, w, 0.02], [-w / 2 + 0.01, h / 2, 0.02, h], [w / 2 - 0.01, h / 2, 0.02, h]].map(([x, y, ww, hh], i) => <RBox key={i} s={[ww, hh, 0.025]} r={0.003} p={[x, y, 0.008]}>{M.wood({ base: [92, 60, 36] })}</RBox>)}
      {Array.from({ length: 3 }, (_, i) => <mesh key={"v" + i} position={[-w / 2 + (i + 1) * w / 4, h / 2, 0.006]}><boxGeometry args={[0.006, h, 0.008]} />{M.wood({ base: [110, 74, 44] })}</mesh>)}
      {Array.from({ length: 5 }, (_, i) => <mesh key={"h" + i} position={[0, (i + 1) * h / 6, 0.006]}><boxGeometry args={[w, 0.006, 0.008]} />{M.wood({ base: [110, 74, 44] })}</mesh>)}
      <mesh position={[-w / 2 + 0.05, h / 2, 0.014]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.004, 20]} />{M.matte({ col: "#2a2420" })}</mesh>
    </group>
    {/* el riel y el dintel */}
    <RBox s={[w * 2.1, 0.02, 0.06]} r={0.004} p={[w * 0.5, -0.01, 0]}>{M.wood({ base: [80, 52, 30] })}</RBox>
    <RBox s={[w * 2.1, 0.04, 0.06]} r={0.004} p={[w * 0.5, h + 0.02, 0]}>{M.wood({ base: [80, 52, 30] })}</RBox>
  </group>;

// ---- figura de madera tipo maniquí (sin cara): col = tono, bow = reverencia, sit = sentado, arm = brazo levantado
export const Fig: React.FC<{ p?: V; r?: V; s?: number; col?: string; bow?: number; sit?: number; arm?: number; head?: number; cloth?: string; hat?: string; arm2?: number }> = ({ p, r, s = 1, col = "#c9a27a", bow = 0, sit = 0, arm = 0, head = 0, cloth, hat, arm2 = 0 }) => {
  const skin = M.wood({ base: col === "#c9a27a" ? [201, 162, 122] : [150, 112, 80] }), mat = cloth ? M.matte({ col: cloth }) : skin, hip = 0.16 - 0.07 * sit;
  return <group position={g3(p)} rotation={g3(r)} scale={s * 0.57}>
    {/* piernas */}
    {[-0.022, 0.022].map((x, i) => <group key={i} position={[x, hip, 0]} rotation={[-PI / 2 * sit, 0, 0]}><mesh position={[0, -0.075, 0]} castShadow><capsuleGeometry args={[0.013, 0.12, 6, 12]} />{mat}</mesh></group>)}
    <group position={[0, hip, 0]} rotation={[bow, 0, 0]}>
      <mesh position={[0, 0.07, 0]} castShadow><capsuleGeometry args={[0.032, 0.08, 8, 16]} />{mat}</mesh>
      <group position={[0, 0.165, 0]} rotation={[head, 0, 0]}><mesh castShadow><sphereGeometry args={[0.03, 24, 16]} />{skin}</mesh>
        {hat ? <group position={[0, 0.022, 0]}><mesh><cylinderGeometry args={[0.045, 0.045, 0.004, 24]} />{M.matte({ col: hat })}</mesh><mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.026, 0.03, 0.024, 20]} />{M.matte({ col: hat })}</mesh></group> : null}</group>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.042, 0.11, 0]} rotation={[sd > 0 ? -arm * 2.4 : -arm2 * 2.4, 0, sd * 0.12]}><mesh position={[0, -0.05, 0]} castShadow><capsuleGeometry args={[0.01, 0.09, 6, 10]} />{mat}</mesh></group>)}
    </group>
  </group>;
};

// ---- casa de dos plantas con ventanas (lit[i] 0..1 prende la ventana i)
export const House: React.FC<{ p?: V; r?: V; s?: number; lit?: number[]; col?: string; roof?: string }> = ({ p, r, s = 1, lit = [], col = "#e8e0cf", roof = "#3a3d44" }) =>
  <group position={g3(p)} rotation={g3(r)} scale={s}>
    <RBox s={[0.36, 0.34, 0.28]} r={0.006} p={[0, 0.17, 0]}>{M.matte({ col })}</RBox>
    <mesh position={[0, 0.39, 0]} rotation={[0, PI / 4, 0]} castShadow><coneGeometry args={[0.28, 0.12, 4]} />{M.matte({ col: roof })}</mesh>
    {[[-0.09, 0.25], [0.09, 0.25], [-0.09, 0.09], [0.09, 0.09]].map(([x, y], i) => <group key={i} position={[x, y, 0.141]}>
      <mesh><planeGeometry args={[0.07, 0.07]} /><meshBasicMaterial color={new THREE.Color("#1a1d24").lerp(new THREE.Color("#ffcf8a"), cl(lit[i] ?? 0))} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.074, 0.004, 0.004]} />{M.matte({ col: "#f2efe8" })}</mesh>
    </group>)}
  </group>;

// ---- edificio de departamentos: cols×rows ventanas; on(i) 0..1 decide la luz de cada una
export const Block: React.FC<{ p?: V; r?: V; s?: number; cols?: number; rows?: number; on: (i: number) => number; col?: string }> = ({ p, r, s = 1, cols = 6, rows = 8, on, col = "#c9c2b4" }) => {
  const W = cols * 0.07 + 0.04, Hh = rows * 0.07 + 0.04;
  return <group position={g3(p)} rotation={g3(r)} scale={s}>
    <RBox s={[W, Hh, 0.2]} r={0.004} p={[0, Hh / 2, 0]}>{M.matte({ col })}</RBox>
    {Array.from({ length: cols * rows }, (_, i) => { const c = i % cols, rr = Math.floor(i / cols), k = cl(on(i));
      return <mesh key={i} position={[-W / 2 + 0.055 + c * 0.07, 0.055 + rr * 0.07, 0.101]}><planeGeometry args={[0.045, 0.045]} /><meshBasicMaterial color={new THREE.Color("#161a22").lerp(new THREE.Color(rn(i, 4) > 0.7 ? "#cfe0ff" : "#ffd59a"), k)} toneMapped={false} /></mesh>; })}
  </group>;
};

// ---- libreta de banco abierta: renglones que se escriben de a uno (n visibles)
export const Passbook: React.FC<{ p?: V; r?: V; s?: number; lines: string[]; n: number; key0: string }> = ({ p, r, s = 1, lines, n, key0 }) => {
  const shown = lines.map((l, i) => (i < Math.floor(n) ? l : ""));
  return <group position={g3(p)} rotation={g3(r)} scale={s}>
    <RBox s={[0.34, 0.012, 0.22]} r={0.004} p={[0, 0.006, 0]}>{M.matte({ col: "#2f5d4a" })}</RBox>
    <mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.32, 0.2]} /><meshStandardMaterial map={txt(key0 + Math.floor(n), shown, { w: 1024, h: 640, bg: "#f4f1e6", fg: "#253046", size: 54, lh: 92, align: "left", pad: 60, font: "700 {s}px Courier New", rule: true })} roughness={0.95} /></mesh>
    <mesh position={[0, 0.013, 0]}><boxGeometry args={[0.004, 0.002, 0.2]} />{M.matte({ col: "#c9c2b0" })}</mesh>
  </group>;
};

// ---- vagón de tren de cercanías (x = posición sobre la vía)
export const TrainCar: React.FC<{ p?: V; r?: V; s?: number; col?: string; lit?: number }> = ({ p, r, s = 1, col = "#c9ccd0", lit = 1 }) =>
  <group position={g3(p)} rotation={g3(r)} scale={s}>
    <RBox s={[0.8, 0.16, 0.14]} r={0.03} p={[0, 0.11, 0]}>{M.steel({ col })}</RBox>
    <mesh position={[0, 0.07, 0.0705]}><planeGeometry args={[0.8, 0.012]} /><meshStandardMaterial color="#2f7a3a" roughness={0.4} /></mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.35 + i * 0.1, 0.135, 0.0705]}><planeGeometry args={[0.07, 0.05]} /><meshBasicMaterial color={new THREE.Color("#20262e").lerp(new THREE.Color("#f6edd2"), lit)} toneMapped={false} /></mesh>)}
    {[-0.3, 0.3].map((x, i) => <mesh key={"w" + i} position={[x, 0.025, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.15, 16]} />{M.steel({ col: "#3a3a3e" })}</mesh>)}
  </group>;

// ---- carta: hoja doblada en tres que se despliega (u 0..1) con texto a mano
export const Letter: React.FC<{ p?: V; r?: V; s?: number; u: number; lines: string[]; key0: string }> = ({ p, r, s = 1, u, lines, key0 }) => {
  const m = txt(key0, lines, { w: 600, h: 840, bg: "#fbf8f0", fg: "#22304e", size: 46, lh: 70, align: "left", pad: 46, font: HANDF, rule: true });
  const W = 0.21, Hh = 0.098, pan = (k: number) => { const t = m.clone(); t.needsUpdate = true; t.repeat.set(1, 1 / 3); t.offset.set(0, (2 - k) / 3); return t; };
  const a = eio(u, 0, 0.5), b = eio(u, 0.5, 1);
  return <group position={g3(p)} rotation={g3(r)} scale={s}>
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow castShadow><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={pan(1)} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <group position={[0, 0, -Hh / 2]} rotation={[-(PI - 0.02) * (1 - a), 0, 0]}><mesh position={[0, 0, -Hh / 2]} rotation={[-PI / 2, 0, 0]} castShadow><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={pan(0)} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
    <group position={[0, 0.001, Hh / 2]} rotation={[(PI - 0.04) * (1 - b), 0, 0]}><mesh position={[0, 0, Hh / 2]} rotation={[-PI / 2, 0, 0]} castShadow><planeGeometry args={[W, Hh]} /><meshStandardMaterial map={pan(2)} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
  </group>;
};

// ---- balanza de platillos de bronce (tilt -1..1 hacia la izquierda/derecha)
export const Balance: React.FC<{ p?: V; s?: number; tilt: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ p, s = 1, tilt, left, right }) => {
  const a = tilt * 0.32, L = 0.22;
  return <group position={g3(p)} scale={s}>
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.07, 0.08, 0.02, 40]} />{M.wood({ base: [70, 44, 26] })}</mesh>
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.008, 0.01, 0.32, 16]} />{M.brass()}</mesh>
    <group position={[0, 0.33, 0]} rotation={[0, 0, a]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 2 * L, 12]} />{M.brass()}</mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * L, 0, 0]} rotation={[0, 0, -a]}>
        <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.14, 6]} />{M.brass()}</mesh>
        <mesh position={[0, -0.145, 0]}><cylinderGeometry args={[0.075, 0.06, 0.012, 40]} />{M.brass()}</mesh>
        <group position={[0, -0.138, 0]}>{sd < 0 ? left : right}</group>
      </group>)}
    </group>
  </group>;
};

// ---- calendario de pared: n días tachados con birome roja
export const Calendar: React.FC<{ p?: V; r?: V; s?: number; n: number; title: string }> = ({ p, r, s = 1, n, title }) =>
  <group position={g3(p)} rotation={g3(r)} scale={s}>
    <RBox s={[0.3, 0.32, 0.006]} r={0.003}>{M.matte({ col: "#f7f4ec" })}</RBox>
    <mesh position={[0, 0.125, 0.004]}><planeGeometry args={[0.3, 0.06]} /><meshStandardMaterial map={txt("calT" + title, [title], { w: 512, h: 100, bg: "#b8302a", fg: "#fbf6ea", size: 60 })} /></mesh>
    {Array.from({ length: 35 }, (_, i) => { const x = -0.12 + (i % 7) * 0.04, y = 0.07 - Math.floor(i / 7) * 0.045, k = cl(n - i);
      return <group key={i} position={[x, y, 0.004]}>
        <mesh><planeGeometry args={[0.034, 0.038]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
        {k > 0 && [1, -1].map((d) => <mesh key={d} position={[0, 0, 0.001]} rotation={[0, 0, d * 0.8]} scale={[Math.max(0.001, k), 1, 1]}><planeGeometry args={[0.04, 0.004]} /><meshBasicMaterial color="#c0392b" /></mesh>)}
      </group>; })}
  </group>;

// ---- reloj de 24 h (aguja en la hora h, de 0 a 24) con la mitad de noche sombreada
export const Clock24: React.FC<{ p?: V; r?: V; s?: number; h: number }> = ({ p, r, s = 1, h }) =>
  <group position={g3(p)} rotation={g3(r)} scale={s}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.03, 64]} />{M.steel({ col: "#2b2d31" })}</mesh>
    <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.185, 64]} /><meshStandardMaterial map={tex.text("c24face", 512, 512, (g) => {
      g.fillStyle = "#f2ede1"; g.fillRect(0, 0, 512, 512); g.textAlign = "center"; g.textBaseline = "middle";
      for (let k = 0; k < 24; k++) { const a = k / 24 * 2 * PI, big = k % 6 === 0; g.strokeStyle = "#2a2a30"; g.lineWidth = big ? 6 : 3;
        g.beginPath(); g.moveTo(256 + Math.sin(a) * 236, 256 - Math.cos(a) * 236); g.lineTo(256 + Math.sin(a) * (big ? 200 : 218), 256 - Math.cos(a) * (big ? 200 : 218)); g.stroke(); }
      g.fillStyle = "#2a2a30"; g.font = "900 46px Arial";
      [["24", 0], ["6", 6], ["12", 12], ["18", 18]].forEach(([l, k]) => { const a = (k as number) / 24 * 2 * PI; g.fillText(l as string, 256 + Math.sin(a) * 160, 256 - Math.cos(a) * 160); });
    })} roughness={0.6} /></mesh>
    <mesh position={[0, 0, 0.017]} rotation={[0, 0, PI / 2]}><circleGeometry args={[0.185, 64, 0, PI]} /><meshBasicMaterial color="#1d2540" transparent opacity={0.35} /></mesh>
    <mesh position={[0, 0, 0.02]} rotation={[0, 0, -h / 24 * 2 * PI]}><boxGeometry args={[0.008, 0.16, 0.004]} />{M.matte({ col: "#c0392b" })}</mesh>
    <mesh position={[0, 0, 0.024]}><cylinderGeometry args={[0.012, 0.012, 0.008, 20]} />{M.brass()}</mesh>
  </group>;

// ---- cuenco de arroz / sopa y lata de café
export const Bowl: React.FC<{ p?: V; s?: number; soup?: boolean; steam?: number }> = ({ p, s = 1, soup = false }) =>
  <group position={g3(p)} scale={s}>
    <mesh position={[0, 0.035, 0]} castShadow><sphereGeometry args={[0.045, 32, 16, 0, 2 * PI, PI / 2, PI / 2]} />{soup ? M.plastic({ col: "#3a1a10" }) : M.porcelain({ col: "#f2efe8" })}</mesh>
    <mesh position={[0, 0.033, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.041, 32]} /><meshStandardMaterial color={soup ? "#b98a4a" : "#fbfaf4"} roughness={soup ? 0.25 : 0.9} /></mesh>
  </group>;
export const Can: React.FC<{ p?: V; s?: number; col?: string }> = ({ p, s = 1, col = "#6b3a22" }) =>
  <group position={g3(p)} scale={s}>
    <mesh position={[0, 0.055, 0]} castShadow><cylinderGeometry args={[0.026, 0.026, 0.11, 32]} />{M.steel({ col })}</mesh>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0262, 0.0262, 0.05, 32, 1, true]} /><meshStandardMaterial color="#efe3c8" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.111, 0]}><cylinderGeometry args={[0.022, 0.026, 0.006, 32]} />{M.chrome()}</mesh>
  </group>;
// ---- onigiri envuelto (triángulo de arroz con alga)
export const Onigiri: React.FC<{ p?: V; r?: V; s?: number; price?: string }> = ({ p, r, s = 1, price }) =>
  <group position={g3(p)} rotation={g3(r)} scale={s}>
    <mesh rotation={[PI / 2, 0, PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.03, 3]} /><meshPhysicalMaterial color="#f7f4ec" roughness={0.5} transmission={0.05} clearcoat={0.4} /></mesh>
    <mesh position={[0, -0.022, 0]}><boxGeometry args={[0.045, 0.035, 0.032]} /><meshStandardMaterial color="#1c2a1c" roughness={0.6} /></mesh>
    {price && <mesh position={[0, 0.005, 0.0165]}><planeGeometry args={[0.04, 0.018]} /><meshStandardMaterial map={txt("og" + price, [price], { w: 256, h: 110, bg: "#f4d03f", fg: "#7a1d12", size: 64 })} /></mesh>}
  </group>;
// ---- piso de tatami para las escenas (esteras con borde negro)
export const Tatami: React.FC<{ p?: V; w?: number; d?: number }> = ({ p, w = 1.8, d = 1.8 }) =>
  <group position={g3(p)}>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial color="#b8ad7c" roughness={0.9} /></mesh>
    {[-w / 4, w / 4].map((x, i) => <mesh key={i} position={[x, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.012, d]} /><meshStandardMaterial color="#2a2b26" /></mesh>)}
  </group>;
