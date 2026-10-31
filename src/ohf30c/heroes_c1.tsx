// ohf30c · componentes únicos 1-6 (la ventana que respira): la cortina que flamea sola, las cuatro rendijas con su chiflete,
// la casa en depresión, el sahumerio cuyo humo se tuerce, la MANO que pega cinta azul en cada fuga (macro de la esquina,
// cuarto empapelado) y la linterna de afuera. Vuelta 2 (eval r1_c): rótulo GRANDE único (Say), acción entre el 45 y el 85 %.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Puffs, Shock } from "./okit";
import { BlueTape, Incense, OH, OW, OldWin } from "./winkit";
import { Hand, Say, Snow, Stream, TapeRoll, wpMat } from "./rkit";

const PI = Math.PI;
type V3 = [number, number, number];

// sillón de lectura (tela bordó gastada) — compartido sólo dentro de este archivo
const Chair: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => {
  const f = <meshStandardMaterial color="#7a3b2c" roughness={0.85} />;
  return <group position={p} rotation={[0, ry, 0]}>
    <RBox s={[0.42, 0.12, 0.4]} p={[0, 0.2, 0]} r={0.04}>{f}</RBox>
    <RBox s={[0.42, 0.42, 0.1]} p={[0, 0.45, -0.17]} r={0.05}>{f}</RBox>
    {[-1, 1].map((k) => <RBox key={k} s={[0.07, 0.2, 0.38]} p={[k * 0.21, 0.32, 0]} r={0.03}>{f}</RBox>)}
    {[-1, 1].map((k) => [-1, 1].map((j) => <mesh key={k + "" + j} position={[k * 0.17, 0.07, j * 0.15]}><cylinderGeometry args={[0.014, 0.01, 0.14, 10]} />{M.wood({ base: [70, 44, 28] })}</mesh>))}
  </group>;
};

// pared alrededor de la ventana (hueco de ±0.35 en x, de -0.03 a 0.9 en y), con material propio
const WallAround: React.FC<{ mat: React.ReactNode; z?: number; y0?: number }> = ({ mat, z = 0.075, y0 = 0 }) => <group position={[0, y0, 0]}>
  <RBox s={[1.6, 2.2, 0.02]} p={[-1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[1.6, 2.2, 0.02]} p={[1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.7, 0.02]} p={[0, 1.25, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.8, 0.02]} p={[0, -0.43, z]} r={0.002} shadow={false}>{mat}</RBox>
</group>;

// cortina de tela: plano con pliegues cuyo borde de abajo flamea hacia el cuarto con la corriente
const Cloth: React.FC<{ tt: number; amp: number; w?: number; h?: number; p: V3 }> = ({ tt, amp, w = 0.34, h = 1.0, p }) => {
  const g = React.useMemo(() => new THREE.PlaneGeometry(w, h, 34, 40), [w, h]);
  const base = React.useMemo(() => Float32Array.from((g.attributes.position as THREE.BufferAttribute).array as Float32Array), [g]);
  const a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1], d = cl((h / 2 - y) / h), dd = d * d;
    const pleat = 0.016 * Math.sin((x / w) * PI * 9);
    const wave = Math.sin(tt * 2.3 - y * 5 + x * 6) * 0.5 + Math.sin(tt * 3.7 + x * 11) * 0.25;
    a.setXYZ(i, x + amp * dd * 0.25 * Math.sin(tt * 1.7 + y * 3), y + amp * dd * 0.12 * (0.5 + 0.5 * wave), pleat * (1 - 0.4 * dd) + amp * dd * (0.9 + 0.5 * wave));
  }
  a.needsUpdate = true; g.computeVertexNormals();
  return <mesh geometry={g} position={p} castShadow receiveShadow><meshPhysicalMaterial color="#e2d3ad" roughness={0.9} sheen={1} sheenColor="#fff1cf" side={THREE.DoubleSide} /></mesh>;
};

// ---- 0:08 · LA CORTINA SE MUEVE SOLA: el sillón junto a la ventana cerrada; la cortina flamea hacia el cuarto con cada ráfaga ----
export const HCurtain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.8, 1.8, 1.4]} warm={0.8} lamp={[0.6, 0.9, 0.5]}
  cam={{ at: [0.12, 0.7, 0], at1: [0.22, 0.8, 0.1], az: [-0.55, -0.22], el: [0.12, 0.08], r: [2.9, 2.2], fov: 34 }}
  over={(tt) => <Say tt={tt} a={2.0} txt="CLOSED. LOCKED. STILL MOVING." col="#b3261e" />}>{(tt) => {
  const sway = eio(tt, 0.6, 1.6), gust = sway * (0.05 + 0.13 * eio(tt, 1.4, 3.2) * (0.75 + 0.25 * Math.sin(tt * 1.3)));
  return <>
    <RBox s={[3, 2.2, 0.04]} p={[0, 1.1, -0.06]} r={0.002}><meshStandardMaterial map={wpMat("#b39a6e", "#a88f64", "#e8d5a0", 6, 4)} roughness={0.9} /></RBox>
    <OldWin p={[0, 0.42, 0]} lock={1} gap={{ bot: 0.3 * sway, rail: 0.25 * sway }} sky="#101a2c" />
    <Cloth tt={tt} amp={gust} p={[0.4, 0.83, 0.12]} />
    <mesh position={[0.3, 1.34, 0.12]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.9, 10]} />{M.brass()}</mesh>
    {[-0.15, 0.75].map((x) => <mesh key={x} position={[x, 1.34, 0.12]}><sphereGeometry args={[0.018, 14, 10]} />{M.brass()}</mesh>)}
    <Chair p={[-0.55, 0, 0.55]} ry={0.5} />
    {/* el aire frío: de la rendija de abajo hacia la cortina y la nuca del que está sentado */}
    <Stream id="cu" tt={tt} pts={[[0.05, 0.44, 0.06], [0.2, 0.5, 0.25], [-0.2, 0.7, 0.45], [-0.55, 0.78, 0.55]]} n={16} k={0.9 * sway} w={0.005} len={0.09} v={0.35} spread={0.05} />
  </>;
}}</Scene3D>;

// ---- 0:22 · NO ES EL VIDRIO: cuarto empapelado de noche, cámara baja; el vidrio se tacha y cada rendija suelta su chiflete ----
export const HGaps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[-0.6, 1.6, 1.6]} bg="#120f0c" warm={0.6} lamp={[0.55, 0.3, 0.6]}
  cam={{ at: [0, 0.5, 0.05], at1: [0.04, 0.64, 0.08], az: [0.45, 0.2], el: [-0.12, 0.02], r: [1.7, 0.62], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.6} b={2.7} txt="NOT THE GLASS" col="#b3261e" /><Say tt={tt} a={2.9} txt="IT'S THE GAPS AROUND IT" col="#1f4f8a" /></>}>{(tt) => {
  const x = eio(tt, 0.3, 0.9), g = [eio(tt, 1.2, 1.6), eio(tt, 1.9, 2.3), eio(tt, 2.6, 3.0), eio(tt, 3.3, 3.7)];
  return <group position={[0, 0.25, 0]}>
    <WallAround mat={<meshStandardMaterial map={wpMat("#7a4848", "#844f4f", "#e9cf9e", 4, 4)} roughness={0.85} />} />
    <RBox s={[3.2, 0.14, 0.03]} p={[0, -0.18, 0.1]} r={0.004}><meshStandardMaterial color="#efe8da" roughness={0.5} /></RBox>
    <OldWin p={[0, 0, 0]} gap={{ rail: g[0], side: g[1], bot: g[2], top: g[3] }} sky="#33507a" />
    <Snow tt={tt} n={60} box={[-0.3, 0.3, -0.05, 0.85, -0.15, -0.1]} />
    {[-1, 1].map((k) => <mesh key={k} position={[0, 0.62, 0.06]} rotation={[0, 0, k * 0.6]} scale={[Math.max(0.001, x), 1, 1]} visible={x > 0}><boxGeometry args={[0.3, 0.012, 0.002]} />{M.glow({ col: "#e5533d" })}</mesh>)}
    <Stream id="g1" tt={tt} pts={[[0, OH / 2 + 0.012, 0.05], [0.05, OH / 2 - 0.02, 0.25], [0.15, OH / 2 - 0.1, 0.5]]} k={g[0]} n={12} spread={0.2} />
    <Stream id="g2" tt={tt + 1} pts={[[-OW / 2 + 0.02, 0.4, 0.05], [-OW / 2 + 0.08, 0.38, 0.25], [-OW / 2 + 0.2, 0.3, 0.5]]} k={g[1]} n={12} spread={0.25} />
    <Stream id="g3" tt={tt + 2} pts={[[0, 0.01, 0.05], [0.04, 0.0, 0.25], [0.1, -0.06, 0.5]]} k={g[2]} n={12} spread={0.2} />
    <Stream id="g4" tt={tt + 3} pts={[[0, OH - 0.01, 0.0], [0.02, OH - 0.06, 0.22], [0.06, OH - 0.16, 0.45]]} k={g[3]} n={10} spread={0.2} />
  </group>;
}}</Scene3D>;

// ---- 2:03 · LA CASA EN DEPRESIÓN: maqueta en corte; el extractor del baño y la campana sacan aire y por las rendijas entra el de afuera ----
const Fan: React.FC<{ p: V3; tt: number; on: number; r?: number }> = ({ p, tt, on, r = 0.05 }) => <group position={p}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r * 1.15, r * 1.15, 0.012, 28, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
  <group rotation={[0, tt * 14 * on, 0]}>{[0, 1, 2, 3].map((i) => <RBox key={i} s={[r, 0.003, 0.018]} p={[Math.cos(i * PI / 2) * r / 2, 0, Math.sin(i * PI / 2) * r / 2]} rot={[0.4, -i * PI / 2, 0]} r={0.001}>{M.steel({ col: "#9aa1a8" })}</RBox>)}</group>
</group>;
export const HDepress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" key1={[-1, 2.2, 1.6]}
  cam={{ at: [0, 0.36, 0], az: [-0.55, -0.15], el: [0.42, 0.3], r: [2.3, 1.85], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={1.0} b={3.0} txt="FANS PULL AIR OUT" /><Say tt={tt} a={3.2} txt="SO EVERY LEAK PULLS COLD IN" col="#1f4f8a" /></>}>{(tt) => {
  const on = eio(tt, 0.6, 1.2), suck = eio(tt, 1.4, 2.0) * (0.75 + 0.25 * eio(tt, 3.0, 4.5));
  const wall = <meshStandardMaterial color="#d8cdb6" roughness={0.85} />;
  return <>
    <RBox s={[1.2, 0.03, 0.7]} p={[0, 0.015, 0]} r={0.004}>{M.wood({ base: [120, 80, 46] })}</RBox>
    <RBox s={[1.2, 0.5, 0.03]} p={[0, 0.27, -0.34]} r={0.003}>{wall}</RBox>
    {[-1, 1].map((k) => <RBox key={k} s={[0.03, 0.5, 0.7]} p={[k * 0.6, 0.27, 0]} r={0.003}>{wall}</RBox>)}
    <RBox s={[0.03, 0.5, 0.7]} p={[0.05, 0.27, 0]} r={0.003}>{wall}</RBox>
    {[-1, 1].map((k) => <RBox key={"r" + k} s={[0.68, 0.025, 0.37]} p={[k * 0.3, 0.64, -0.185]} rot={[0, 0, -k * 0.55]} r={0.004}><meshStandardMaterial color="#5a3a2a" roughness={0.8} /></RBox>)}
    {[-0.32, 0.34].map((x, i) => <group key={i} position={[x, 0.14, -0.322]} scale={0.32}><OldWin trim={false} gap={{ bot: suck, side: suck * 0.7 }} pulley={false} /></group>)}
    <Fan p={[0.33, 0.5, 0]} tt={tt} on={on} />
    <RBox s={[0.22, 0.08, 0.14]} p={[-0.3, 0.42, -0.24]} r={0.01}>{M.steel()}</RBox>
    <Fan p={[-0.3, 0.385, -0.24]} tt={tt} on={on} r={0.04} />
    <Puffs tt={tt} n={10} a={[0.33, 0.48, 0]} b={[0.33, 0.95, 0]} r={0.022} col="#d4d8de" op={0.55 * on} v={0.8} />
    <Puffs tt={tt} n={10} a={[-0.3, 0.46, -0.24]} b={[-0.3, 0.95, -0.3]} r={0.02} col="#d4d8de" op={0.55 * on} v={0.8} />
    {[-0.32, 0.34].map((x, i) => <Stream key={i} id={"dp" + i} tt={tt + i} pts={[[x, 0.15, -0.34], [x + 0.03, 0.14, -0.15], [x + 0.08, 0.12, 0.12]]} n={14} k={suck} w={0.006} len={0.07} spread={0.06} />)}
  </>;
}}</Scene3D>;

// ---- 2:30 · EL SAHUMERIO: de costado, junto al riel de encuentro; el humo sube recto y, al llegar a la rendija, se acuesta y se va ----
const Smoke: React.FC<{ tt: number; p: V3; pull: number }> = ({ tt, p, pull }) => <group position={p}>
  {Array.from({ length: 130 }, (_, i) => {
    const u = (tt * 0.3 + i / 130) % 1, up = u * 0.3, side = pull * Math.pow(u, 0.8) * 0.34;
    const curl = (0.01 + 0.03 * u) * Math.sin(tt * 1.4 + i * 2.39 + u * 8) * (1 - 0.6 * pull), dz = (rn(i, 3) - 0.5) * 0.02 * u;
    return <mesh key={i} position={[-side + curl, 0.004 + up * (1 - 0.82 * pull) + 0.025 * pull * u * Math.sin(u * 10 + tt + i), -0.25 * side + dz]} scale={0.5 + 2.6 * u}>
      <sphereGeometry args={[0.007, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.5 * (1 - u) * (u < 0.05 ? u * 20 : 1)} depthWrite={false} /></mesh>;
  })}
</group>;
export const HIncense: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.5, 1.4, 1.2]} warm={0.7} bg="#0b0d10"
  cam={{ at: [0.1, 0.3, 0.08], at1: [0.04, OH / 2 + 0.02, 0.08], az: [0.5, 0.3], el: [0.06, 0.03], r: [0.6, 0.45], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={0.7} b={3.1} txt="STRAIGHT UP = TIGHT" col="#1f6a3a" /><Say tt={tt} a={3.5} txt="PULLED SIDEWAYS = LEAK" col="#b3261e" /></>}>{(tt) => {
  const mv = eio(tt, 3.0, 3.6), pull = eio(tt, 3.4, 4.2);
  const px = lerp(0.12, 0.06, mv), py = lerp(0.2, OH / 2 - 0.03, mv);
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#7a4a3a", "#84523f", "#e6c79a", 6, 6)} roughness={0.9} />} />
    <OldWin p={[0, 0, 0]} gap={{ rail: 0.45 * pull }} sky="#121a28" />
    <pointLight position={[0.0, 0.5, -0.2]} intensity={1.2} distance={0.8} color="#cfe0ff" />
    <Incense tt={tt} p={[px, py, 0.1]} n={0} />
    <Smoke tt={tt} p={[px, py, 0.1]} pull={pull} />
    <Hand p={[px + 0.012, py - 0.2, 0.1]} rot={[0, 0.6, PI / 2 + 0.2]} s={0.75} curl={0.75} thumb={0.6} />
  </>;
}}</Scene3D>;

// ---- 2:47 · LA CINTA AZUL: macro de la esquina, cuarto empapelado; una mano arranca un pedazo y lo aprieta sobre cada fuga ----
const SPOTS: { p: V3; rot: V3; air: number[][] }[] = [
  { p: [-OW / 2 + 0.012, 0.58, 0.065], rot: [0, 0, PI / 2], air: [[-OW / 2 + 0.012, 0.58, 0.06], [-OW / 2 + 0.06, 0.56, 0.2], [-OW / 2 + 0.14, 0.5, 0.36]] },
  { p: [-0.1, OH / 2 + 0.03, 0.07], rot: [0, 0, 0.04], air: [[-0.1, OH / 2 + 0.02, 0.06], [-0.06, OH / 2 - 0.01, 0.2], [0.0, OH / 2 - 0.06, 0.36]] },
  { p: [-OW / 2 + 0.012, 0.2, 0.065], rot: [0, 0, PI / 2 + 0.05], air: [[-OW / 2 + 0.012, 0.2, 0.06], [-OW / 2 + 0.06, 0.19, 0.2], [-OW / 2 + 0.14, 0.14, 0.36]] },
];
export const HTapeMarks: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const A = [0.5, 2.1, 3.7];
  return <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.9, 1.5, 1.2]} warm={0.9} bg="#1a120c"
    cam={{ at: [-0.14, 0.6, 0.06], at1: [-0.06, 0.4, 0.06], az: [0.62, 0.3], el: [0.1, 0.06], r: [0.55, 1.25], fov: 34 }}
    over={(tt) => <Say tt={tt} a={1.3} txt="FOUND A LEAK? MARK IT WITH TAPE" col="#1f4f8a" />}>{(tt) => {
    // la mano: viene, aprieta, vuelve (un ciclo por fuga)
    let hp: V3 = [0.25, 0.3, 0.4], cu = 0.25, holding = -1;
    A.forEach((a, i) => { if (tt >= a - 0.1 && tt < a + 1.5) { const S = SPOTS[i].p, go = eio(tt, a - 0.1, a + 0.55), back = eio(tt, a + 0.95, a + 1.5), press = Math.sin(PI * cl((tt - a - 0.55) / 0.4));
      const tgt: V3 = [S[0] + 0.012, S[1] + 0.01, S[2] + 0.1 - 0.012 * press], off: V3 = [S[0] + 0.32, S[1] - 0.1, S[2] + 0.42];
      hp = [lerp(lerp(off[0], tgt[0], go), off[0], back), lerp(lerp(off[1], tgt[1], go), off[1], back), lerp(lerp(off[2], tgt[2], go), off[2], back)];
      cu = 0.25 + 0.35 * press; if (tt < a + 0.75) holding = i; } });
    return <>
      <WallAround mat={<meshStandardMaterial map={wpMat("#6b2f2a", "#76352f", "#d9b878", 5, 5)} roughness={0.85} />} />
      <OldWin p={[0, 0, 0]} sky="#5a7aa0" />
      <pointLight position={[0.5, 0.9, 0.7]} intensity={1.6} distance={2.5} color="#ffcf8f" />
      {SPOTS.map((s, i) => { const stuck = cl((tt - A[i] - 0.7) / 0.08); return <React.Fragment key={i}>
        <Stream id={"tm" + i} tt={tt + i} pts={s.air} k={1 - stuck} n={9} w={0.003} len={0.04} spread={0.03} />
        {stuck > 0 && <BlueTape p={s.p} rot={s.rot} k={1} w={0.06} />}
        {stuck > 0 && <Shock tt={tt} a={A[i] + 0.72} p={[s.p[0], s.p[1], s.p[2] + 0.01]} r={0.035} col="#7cc4ff" />}
      </React.Fragment>; })}
      {/* el pedazo de cinta que lleva la mano, en la punta de los dedos */}
      {holding >= 0 && <BlueTape p={[hp[0] - 0.012, hp[1] - 0.01, hp[2] - 0.1]} rot={SPOTS[holding].rot} k={1} w={0.06} />}
      <Hand p={hp} rot={[0.15, PI / 2, -0.25]} curl={cu} thumb={0.5} />
      <TapeRoll p={[0.12, 0.03, 0.12]} rot={[0, 0, 0]} />
    </>;
  }}</Scene3D>;
};

// ---- 3:30 · LA LINTERNA RASANTE: cuarto en penumbra, la linterna en primer plano en la mano; el haz barre de costado la jamba y después
//      el antepecho, y sólo donde pega se enciende la rendija, nítida: arriba una línea fina, abajo una franja ancha ----
export const HFlashlight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.6, 1.4, 1.4]} warm={0.25} bg="#140c0b"
  cam={{ at: [0.1, 0.1, 0.1], at1: [0.08, 0.06, 0.1], az: [-0.42, -0.3], el: [0.14, 0.18], r: [0.66, 0.6], fov: 40 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={3.1} txt="THIN LINE = THIN STRIP" size={100} /><Say tt={tt} a={3.35} txt="WIDE BAND = THICKER ONE" col="#1f4f8a" size={100} /></>}>{(tt) => {
  const k1 = eio(tt, 0.4, 3.0), k2 = eio(tt, 3.3, 5.0), X = OW / 2 - 0.017;
  // dónde pega el haz: baja por la jamba derecha y después corre por el antepecho
  const G: V3 = tt < 3.15 ? [X, lerp(0.34, 0.08, k1), 0.042] : [lerp(0.16, -0.1, k2), 0.006, 0.042];
  const F: V3 = [G[0] + 0.07, G[1] + 0.05, G[2] + 0.15];
  const d = new THREE.Vector3(G[0] - F[0], G[1] - F[1], G[2] - F[2]), L = d.length(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const on = cl(tt / 0.4), lit = (y: number) => Math.max(0, 1 - Math.abs(y) / 0.07);
  const amb = (c: string, i: number) => <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} roughness={0.6} />;
  return <>
    <WallAround mat={<meshStandardMaterial map={wpMat("#5a2a2a", "#652f2f", "#c9a26a", 4, 4)} roughness={0.9} />} />
    <OldWin p={[0, 0, 0]} sky="#0b1220" />
    {/* la rendija del costado: una línea fina que se enciende sólo donde pasa el haz */}
    {Array.from({ length: 24 }, (_, i) => { const y = 0.04 + i * 0.022, k = tt < 3.15 ? lit(y - G[1]) * on : 0;
      return <mesh key={"s" + i} position={[X - 0.002, y, 0.047]} visible={k > 0.02}><boxGeometry args={[0.007, 0.023, 0.004]} />{amb("#ffb347", 2.2 * k)}</mesh>; })}
    {/* la franja de abajo: ancha */}
    {Array.from({ length: 20 }, (_, i) => { const x = -OW / 2 + 0.03 + i * 0.021, k = tt >= 3.15 ? lit(x - G[0]) : 0;
      return <mesh key={"b" + i} position={[x, 0.009, 0.043]} visible={k > 0.02}><boxGeometry args={[0.022, 0.02, 0.005]} />{amb("#ffb347", 3 * k)}</mesh>; })}
    {/* la linterna en la mano, en primer plano, y su haz rasante (cono tenue, sin quemar) */}
    <group position={F} quaternion={q}>
      <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.016, 0.016, 0.11, 20]} /><meshStandardMaterial color="#2b2d31" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.024, 0.017, 0.035, 24]} /><meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 0.028, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.021, 24]} /><meshStandardMaterial color="#fff4d6" emissive="#fff0c8" emissiveIntensity={0.6 * on} /></mesh>
      <mesh position={[0, 0.028 + L / 2, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.035, L, 32, 1, true]} /><meshBasicMaterial color="#fff1c8" transparent opacity={0.035 * on} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    </group>
    <pointLight position={[G[0] + 0.03, G[1] + 0.02, G[2] + 0.05]} intensity={0.25 * on} distance={0.15} color="#ffe2a8" />
  </>;
}}</Scene3D>;
