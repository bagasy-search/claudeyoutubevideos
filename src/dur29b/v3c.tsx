// dur29b · componentes únicos en 3D, bloque C: la bala de plomo blando, el mito que se da vuelta, los gérmenes que viajan, el
// bombardero y su torreta, el traje que se apaga, el paracaídas del otro lado, el pateador de arcilla, las 19 minas, la regla del
// tiempo y las ocho puertas.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, Plate, latheG, pop, rockT } from "./kb";
import { Stickman } from "../stickman3d";
import { Casco } from "./v3a";

type UP = { d: number; p: any };
const PI = Math.PI;
const CLAY = [112, 118, 124];

// ---- BalaPlomo · «una bala de plomo blando, grande, que al pegar en un hueso no lo rompía limpio»: en cámara lenta, la bala cónica
// entra en la tabla, se aplasta como un hongo y la madera revienta en astillas ----
export const BalaPlomo3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aI = Math.min(sec(p, "pegar", 1.6), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-1.0, 2.2, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.55, -0.35], el: [0.12, 0.08], r: [1.4, 1.2], fov: 32 }}>{(tt) => {
    const fly = cl((tt - 0.2) / Math.max(0.2, aI - 0.2)), hit = eio(tt, aI, aI + 0.35), sh = eio(tt, aI, aI + 1.6);
    const bx = lerp(-1.2, -0.06, fly) + 0.04 * hit;
    return <>
      {/* la tabla (en lugar del hueso): una viga de madera clara */}
      <RBox s={[0.08, 0.5, 0.3]} r={0.005} p={[0.0, 0.3, 0]}><meshStandardMaterial map={tex.wood(1, 2, [200, 168, 120])} roughness={0.7} /></RBox>
      <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.3, 0.06, 0.4]} /><meshStandardMaterial color="#3a2a1a" roughness={1} /></mesh>
      {/* la bala: cónica, gris mate; al pegar se ensancha y se acorta */}
      <group position={[bx, 0.32, 0]} rotation={[0, 0, -PI / 2]} scale={[1 + 1.3 * hit, 1 - 0.55 * hit, 1 + 1.3 * hit]}>
        <mesh geometry={latheG("minie", [[0.0, 0.07], [0.012, 0.06], [0.022, 0.035], [0.025, 0.0], [0.025, -0.03], [0.02, -0.035], [0.0, -0.035]], 28)}><meshStandardMaterial color="#7a7e84" metalness={0.6} roughness={0.55} /></mesh>
      </group>
      {/* la estela del aire */}
      <mesh position={[(bx - 1.2) / 2, 0.32, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, Math.max(0.01, bx + 1.2), 6]} /><meshBasicMaterial color="#e8e0d0" transparent opacity={0.2 * (1 - hit)} depthWrite={false} /></mesh>
      {/* las astillas que salen por detrás */}
      {Array.from({ length: 18 }, (_, i) => { const a = (rn(i, 1) - 0.5) * 1.6, sp = 0.3 + rn(i, 2) * 0.5, x = 0.05 + Math.cos(a) * sp * sh, y = 0.32 + Math.sin(a) * sp * sh - 0.4 * sh * sh, z = (rn(i, 3) - 0.5) * 0.4 * sh;
        return <mesh key={i} position={[x, Math.max(0.065, y), z]} rotation={[rn(i, 4) * 6 * sh, rn(i, 5) * 6 * sh, 0]} visible={tt > aI}><boxGeometry args={[0.04 * (0.5 + rn(i, 6)), 0.006, 0.01]} /><meshStandardMaterial color="#d8b880" roughness={0.8} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- MitoVuelta · «En las películas, un trago de whisky y una bala para morder. En la realidad… cloroformo o éter»: una vitrina con
// la botella y la bala marcada MITO; gira sobre su eje y del otro lado está el frasco marrón y el paño ----
export const MitoVuelta3D: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "realidad", 2.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.0, 2.4, 1.8]}
    cam={{ at: [0, 0.45, 0], az: [-0.2, 0.15], el: [0.1, 0.06], r: [1.7, 1.5], fov: 34 }}>{(tt) => {
    const rot = PI * eio(tt, aR - 0.3, aR + 0.6);
    return <>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.05, 0.12, 0.1, 20]} />{M.brass({ col: "#8a6a30" })}</mesh>
      <group position={[0, 0.48, 0]} rotation={[0, rot, 0]}>
        <RBox s={[0.8, 0.7, 0.06]} r={0.015}><meshStandardMaterial map={tex.wood(2, 2, [86, 54, 28])} roughness={0.7} /></RBox>
        {/* cara A: el mito */}
        <group position={[0, 0, 0.035]}>
          <mesh position={[-0.12, -0.02, 0.06]} geometry={latheG("whisky", [[0.0, -0.16], [0.06, -0.16], [0.065, 0.04], [0.025, 0.1], [0.022, 0.16], [0.0, 0.16]], 28)}><meshPhysicalMaterial color="#c88a3a" roughness={0.1} transparent opacity={0.75} clearcoat={1} /></mesh>
          <mesh position={[0.15, -0.08, 0.03]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.06, 16]} /><meshStandardMaterial color="#7a7e84" metalness={0.6} roughness={0.5} /></mesh>
          <Plate k="mito" txt="MITO" w={0.3} h={0.09} p={[0, 0.26, 0.01]} mat="brass" />
        </group>
        {/* cara B: lo que se usaba de verdad */}
        <group position={[0, 0, -0.035]} rotation={[0, PI, 0]}>
          <mesh position={[-0.12, -0.04, 0.06]} geometry={latheG("clorof", [[0.0, -0.12], [0.055, -0.12], [0.06, 0.04], [0.025, 0.08], [0.025, 0.12], [0.0, 0.12]], 28)}><meshPhysicalMaterial color="#5a2e10" roughness={0.1} transparent opacity={0.85} clearcoat={1} /></mesh>
          <RBox s={[0.2, 0.012, 0.14]} r={0.004} p={[0.15, -0.14, 0.07]}><meshStandardMaterial color="#efe8da" roughness={1} /></RBox>
          <Plate k="realidad" txt="CLOROFORMO" w={0.46} h={0.09} p={[0, 0.26, 0.01]} mat="brass" />
        </group>
      </group>
    </>;
  }}</U3>;
};

// ---- ManosGermenes · «operaban sin lavarse las manos… iban de un paciente al otro»: la sierra pasa de camilla en camilla y en cada
// pasada se le pegan más puntitos verdes, que caen en la siguiente ----
export const ManosGermenes3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, per = Math.max(0.9, (D - 0.8) / 4);
  return <U3 d={d} bg={p.bg} ground={[120, 130, 80]} mode="drop" key1={[-1.2, 2.6, 1.8]}
    cam={{ at: [0, 0.3, 0], az: [-0.25, 0.15], el: [0.34, 0.26], r: [2.2, 1.9], fov: 34 }}>{(tt) => {
    const k = Math.max(0, tt - 0.4) / per, cur = Math.min(3, Math.floor(k)), fr = k - Math.floor(k), sx = -0.9 + Math.min(3, k) * 0.6;
    const load = (n: number) => Math.min(40, Math.floor(6 * Math.pow(1.8, n)));
    return <>
      {Array.from({ length: 4 }, (_, i) => { const x = -0.9 + i * 0.6, inf = i <= cur ? eio(tt, 0.4 + i * per + 0.3, 0.4 + i * per + 0.9) : 0;
        return <group key={i} position={[x, 0, 0]}>
          {[-1, 1].map((s) => <mesh key={s} position={[0, 0.2, s * 0.17]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.62, 8]} />{M.wood({ base: [120, 84, 50] })}</mesh>)}
          <RBox s={[0.56, 0.01, 0.32]} r={0.003} p={[0, 0.205, 0]}><meshStandardMaterial color="#c8bc9a" roughness={1} /></RBox>
          {[[-0.2, -0.12], [0.2, -0.12], [-0.2, 0.12], [0.2, 0.12]].map(([lx, lz], j) => <mesh key={j} position={[lx, 0.1, lz]}><cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />{M.wood({ base: [120, 84, 50] })}</mesh>)}
          {Array.from({ length: load(i) }, (_, j) => <mesh key={j} position={[(rn(j + i * 50, 1) - 0.5) * 0.5, 0.215, (rn(j + i * 50, 2) - 0.5) * 0.28]} scale={Math.max(0.001, inf)}><sphereGeometry args={[0.009, 8, 6]} /><meshBasicMaterial color="#8af05a" transparent opacity={0.85} toneMapped={false} /></mesh>)}
        </group>; })}
      {/* la sierra que viaja, cargada de puntos */}
      <group position={[sx, 0.42 + 0.08 * Math.sin(fr * PI), 0]} rotation={[0, 0, -0.2]}>
        <RBox s={[0.26, 0.05, 0.004]} r={0.002}>{M.steel({ col: "#9a9ea2" })}</RBox>
        <RBox s={[0.08, 0.06, 0.03]} r={0.01} p={[-0.16, 0.0, 0]}>{M.wood({ base: [90, 56, 30] })}</RBox>
        {Array.from({ length: load(cur) }, (_, j) => <mesh key={j} position={[(rn(j, 7) - 0.5) * 0.24, (rn(j, 8) - 0.5) * 0.05, 0.004]}><sphereGeometry args={[0.006, 6, 6]} /><meshBasicMaterial color="#8af05a" toneMapped={false} /></mesh>)}
      </group>
      {/* el balde de agua turbia donde «se limpiaba» */}
      <group position={[1.35, 0, 0.3]}><mesh geometry={latheG("baldeG", [[0.0, 0], [0.09, 0], [0.11, 0.16], [0.1, 0.16], [0.08, 0.01], [0.0, 0.01]], 28)}>{M.wood({ base: [120, 84, 50] })}</mesh>
        <mesh position={[0, 0.13, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.1, 28]} /><meshStandardMaterial color="#6a5a3a" roughness={0.2} /></mesh></group>
    </>;
  }}</U3>;
};

// ---- el bombardero de cuatro motores (primitivas) ----
const Bomber: React.FC<{ tt: number }> = ({ tt }) => {
  const skin = <meshStandardMaterial color="#2a2c2a" metalness={0.4} roughness={0.6} />;
  return <group>
    <mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.11, 1.5, 10, 24]} />{skin}</mesh>
    <RBox s={[0.42, 0.025, 2.6]} r={0.01} p={[0.15, 0.02, 0]}>{skin}</RBox>
    {[-0.9, -0.45, 0.45, 0.9].map((z, i) => <group key={i} position={[0.32, 0.0, z]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.06, 0.26, 16]} />{skin}</mesh>
      <group position={[0.15, 0, 0]} rotation={[tt * 2 * PI * 0.35, 0, 0]}>{[0, 1, 2].map((b) => <RBox key={b} s={[0.008, 0.3, 0.03]} r={0.004} rot={[b * 2 * PI / 3, 0, 0]}><meshStandardMaterial color="#111" /></RBox>)}</group>
    </group>)}
    <RBox s={[0.25, 0.02, 0.8]} r={0.01} p={[-0.78, 0.04, 0]}>{skin}</RBox>
    {[-1, 1].map((s) => <RBox key={s} s={[0.18, 0.28, 0.02]} r={0.01} p={[-0.82, 0.12, s * 0.4]}>{skin}</RBox>)}
    {/* la torreta de cola: la burbuja de plexiglás al final de todo */}
    <mesh position={[-0.95, 0.0, 0]}><sphereGeometry args={[0.1, 24, 18]} />{M.glass({ op: 0.35, col: "#b8d0e0" })}</mesh>
    {[-1, 1].map((s) => [0, 1].map((j) => <mesh key={s + "_" + j} position={[-1.08, -0.01 + j * 0.03, s * 0.03]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.18, 6]} /><meshStandardMaterial color="#111" /></mesh>))}
    <mesh position={[0.82, 0.02, 0]}><sphereGeometry args={[0.1, 20, 14]} />{M.glass({ op: 0.35, col: "#b8d0e0" })}</mesh>
  </group>;
};

// ---- TorretaCola · «una burbuja de metal y plexiglás… en la cola de un bombardero… Atrás de todo»: el bombardero en la noche; la
// cámara se va hasta la punta de la cola, donde el artillero va solo en su burbuja ----
export const TorretaCola3D: React.FC<UP> = ({ d, p }) => {
  return <U3 d={d} bg={p.bg} ground={null} sky="#0a0e18" mode="iris" key1={[0.8, 2.0, 1.2]}
    cam={{ at: [0, 0.6, 0], at1: [-0.95, 0.6, 0], az: [0.6, -0.9], el: [0.3, 0.06], r: [3.2, 0.7], fov: 38 }}>{(tt) => <>
    <group position={[0, 0.6, 0]} rotation={[0, 0, 0.02 * Math.sin(tt * 0.8)]}>
      <Bomber tt={tt} />
      <group position={[-0.95, -0.06, 0]}><Stickman escala={0.045} rotY={-90} guion={[{ t: 0, accion: "quieto", expr: "nervioso" }]} semilla={44} contacto={0} /></group>
      <pointLight position={[-0.95, 0.02, 0.05]} intensity={0.25} distance={0.4} color="#7aa0ff" />
    </group>
    {Array.from({ length: 140 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 12, 1 + rn(i, 2) * 5, -3 - rn(i, 3) * 4]}><sphereGeometry args={[0.012, 6, 6]} /><meshBasicMaterial color="#e8eef8" /></mesh>)}
    <mesh position={[3, 3.5, -6]}><sphereGeometry args={[0.35, 24, 16]} />{M.glow({ col: "#e8eef8", op: 0.9 })}</mesh>
    <directionalLight position={[3, 3.5, -2]} intensity={0.6} color="#9ab0e0" />
  </>}</U3>;
};

// ---- TrajeCalefaccion · «Tenías un traje con calefacción eléctrica, cuando funcionaba»: el artillero sentado; los cables del traje
// brillan naranja, se apagan de a poco y la escarcha cubre el plexiglás mientras el termómetro baja a 40 bajo cero ----
export const TrajeCalefaccion3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aF = Math.min(sec(p, "funcionaba", 1.6), D - 1.6);
  const temp = (tt: number) => 40 * eio(tt, 0.2, aF + 1.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#0a0e18" mode="iris" key1={[0.6, 2.0, 1.6]}
    cam={{ at: [0, 0.35, 0], az: [-0.35, -0.1], el: [0.14, 0.08], r: [1.3, 1.1], fov: 34 }}
    over={(tt) => <Drums v={Math.round(temp(tt))} n={2} x={1180} y={140} s={1.3} unit="° bajo 0" />}>{(tt) => {
    const off = eio(tt, aF, aF + 1.2), heat = 1 - off, frost = eio(tt, aF + 0.2, D - 0.2);
    const wire = (k: string, pts: number[][]) => <mesh geometry={tubeG(k, pts, 0.004, 40, 6)}><meshStandardMaterial color="#3a1a10" emissive="#ff7a2a" emissiveIntensity={1.4 * heat} roughness={0.5} /></mesh>;
    return <>
      <RBox s={[0.26, 0.03, 0.24]} r={0.01} p={[0, 0.2, 0]}><meshStandardMaterial color="#3a3e40" metalness={0.6} roughness={0.5} /></RBox>
      <group position={[0, 0.215, 0]}><Stickman escala={0.12} rotY={0} guion={[{ t: 0, accion: "sentarse", expr: "decidido" }, { t: aF + 0.6, accion: "sentarse", expr: "asustado" }]} semilla={45} contacto={0} color="#6a5a40" /></group>
      {wire("w1", [[-0.06, 0.48, 0.05], [-0.07, 0.38, 0.06], [-0.05, 0.28, 0.08], [-0.04, 0.22, 0.16]])}
      {wire("w2", [[0.06, 0.48, 0.05], [0.07, 0.38, 0.06], [0.05, 0.28, 0.08], [0.04, 0.22, 0.16]])}
      {wire("w3", [[-0.1, 0.45, 0.02], [-0.14, 0.38, 0.04], [-0.12, 0.3, 0.08]])}
      {wire("w4", [[0.1, 0.45, 0.02], [0.14, 0.38, 0.04], [0.12, 0.3, 0.08]])}
      <pointLight position={[0, 0.4, 0.2]} intensity={0.9 * heat} distance={0.8} color="#ff9a5a" />
      {/* la burbuja de plexiglás que se escarcha */}
      <mesh position={[0, 0.32, 0.05]}><sphereGeometry args={[0.38, 40, 24, 0, 2 * PI, 0, PI * 0.7]} />{M.glass({ op: 0.1 + 0.35 * frost, col: "#dfeaf2" })}</mesh>
      {Array.from({ length: 60 }, (_, i) => { const a = rn(i, 1) * 2 * PI, b = rn(i, 2) * PI * 0.6, s = cl((frost - rn(i, 3) * 0.7) * 3);
        return <mesh key={i} position={[Math.sin(b) * Math.cos(a) * 0.375, 0.32 + Math.cos(b) * 0.375, 0.05 + Math.sin(b) * Math.sin(a) * 0.375]} scale={Math.max(0.001, s)}><octahedronGeometry args={[0.012, 0]} /><meshStandardMaterial color="#f4fbff" roughness={0.3} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- ParacaidasPuerta · «el paracaídas no entra en la torreta. Va del otro lado de la puerta»: corte de la cola; el artillero en
// su burbuja, una puertita, y el paracaídas colgado del gancho del otro lado ----
export const ParacaidasPuerta3D: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "puerta", 1.2);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" sky="#0a0e18" mode="split" key1={[0.4, 2.2, 1.8]}
    cam={{ at: [0, 0.4, 0], az: [-0.15, 0.12], el: [0.12, 0.08], r: [1.8, 1.6], fov: 34 }}>{(tt) => {
    const open = 0.9 * eio(tt, aP, aP + 0.6) * (1 - eio(tt, aP + 1.8, aP + 2.4));
    return <>
      {/* el fuselaje cortado a lo largo */}
      <mesh position={[0.35, 0.4, -0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.32, 0.32, 1.1, 32, 1, true, PI, PI]} /><meshStandardMaterial color="#5a5e5a" metalness={0.5} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[-0.45, 0.4, 0]}><sphereGeometry args={[0.3, 32, 20]} />{M.glass({ op: 0.18, col: "#b8d0e0" })}</mesh>
      <group position={[-0.45, 0.2, 0]}><Stickman escala={0.1} rotY={-60} guion={[{ t: 0, accion: "sentarse", expr: "nervioso" }]} semilla={46} contacto={0} /></group>
      {/* la puertita, que se abre y se cierra */}
      <group position={[-0.17, 0.2, 0.12]} rotation={[0, -open, 0]}><RBox s={[0.02, 0.42, 0.24]} r={0.005} p={[0, 0.21, -0.12]}><meshStandardMaterial color="#4a4e4a" metalness={0.6} roughness={0.5} /></RBox></group>
      <RBox s={[0.02, 0.42, 0.24]} r={0.005} p={[-0.17, 0.41, -0.15]}><meshStandardMaterial color="#4a4e4a" metalness={0.6} roughness={0.5} /></RBox>
      {/* del otro lado: el gancho y el paracaídas */}
      <group position={[0.15, 0.4, -0.15]} scale={pop(tt, aP + 0.4)}>
        <mesh position={[0, 0.14, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.02, 0.005, 8, 16, PI * 1.5]} />{M.steel()}</mesh>
        <RBox s={[0.16, 0.2, 0.08]} r={0.02} p={[0, 0.0, 0]}><meshStandardMaterial color="#b8ac88" roughness={0.9} /></RBox>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.05, 0.0, 0.045]}><boxGeometry args={[0.015, 0.22, 0.004]} /><meshStandardMaterial color="#6a5a3a" /></mesh>)}
      </group>
      <Plate k="lejos" txt="DEL OTRO LADO" w={0.42} h={0.08} p={[0.15, 0.1, -0.1]} />
      <pointLight position={[0.1, 0.6, 0.2]} intensity={0.8} distance={1.4} color="#c8d0e0" />
    </>;
  }}</U3>;
};

// ---- ClayKicker · «Te acuestas boca arriba sobre una tabla… Y pateas. Con las dos piernas»: el pateador en la cruz empuja la pala
// con los pies, cae el terrón y el de atrás lo pasa a la bolsa, que se llena ----
export const ClayKicker3D: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "pateas", 1.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-0.6, 1.8, 1.8]} backZ={-1.0}
    cam={{ at: [0.05, 0.3, 0], az: [-0.25, -0.05], el: [0.12, 0.06], r: [1.5, 1.3], fov: 36 }}>{(tt) => {
    const ph = Math.max(0, tt - aP) * 0.8, cyc = ph % 1, kick = cyc < 0.35 ? eio(cyc, 0, 0.35) : 1 - eio(cyc, 0.35, 0.8), n = Math.floor(ph);
    return <>
      {/* el túnel de arcilla gris azulada */}
      <mesh position={[0, 0.32, -0.3]}><boxGeometry args={[2.6, 0.9, 0.3]} /><meshStandardMaterial map={rockT("klei", CLAY, 3, 1)} roughness={0.95} /></mesh>
      <mesh position={[0, -0.02, 0]}><boxGeometry args={[2.6, 0.04, 0.6]} /><meshStandardMaterial map={rockT("kleipiso", CLAY.map((v) => v * 0.8), 3, 1)} roughness={1} /></mesh>
      <mesh position={[0.95, 0.32, 0]}><boxGeometry args={[0.2, 0.9, 0.6]} /><meshStandardMaterial map={rockT("kleifrente", CLAY.map((v) => v * 1.05), 1, 1)} roughness={0.95} /></mesh>
      {[-0.9, -0.5, -0.1, 0.3, 0.7].map((x, i) => <group key={i} position={[x, 0, 0]}>{[-1, 1].map((s) => <RBox key={s} s={[0.04, 0.6, 0.04]} p={[0, 0.3, s * 0.27]}>{M.wood({ base: [130, 92, 54] })}</RBox>)}<RBox s={[0.04, 0.04, 0.6]} p={[0, 0.6, 0]}>{M.wood({ base: [130, 92, 54] })}</RBox></group>)}
      {/* la cruz: tabla inclinada, el pateador acostado con los pies hacia el frente */}
      <group position={[0.35, 0.12, 0]} rotation={[0, 0, 0.42]}>
        <RBox s={[0.62, 0.025, 0.1]} r={0.004}>{M.wood({ base: [150, 108, 64] })}</RBox>
        <RBox s={[0.025, 0.12, 0.25]} r={0.004} p={[-0.3, -0.06, 0]}>{M.wood({ base: [150, 108, 64] })}</RBox>
        <group position={[-0.28, 0.03, 0]} rotation={[0, 0, -PI / 2]}><Stickman escala={0.09} rotY={0} guion={[{ t: 0, accion: "quieto", expr: "decidido" }]} semilla={51} contacto={0} /></group>
      </group>
      {/* la pala entre los pies: avanza con la patada */}
      <group position={[0.74 + 0.08 * kick, 0.3 + 0.03 * kick, 0]} rotation={[0, 0, -PI / 2 + 0.4]}>
        <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />{M.wood({ base: [120, 84, 50] })}</mesh>
        <RBox s={[0.07, 0.1, 0.008]} r={0.003} p={[0, 0.05, 0]}>{M.steel({ col: "#8a8e92" })}</RBox>
      </group>
      {/* el terrón viaja atrás hasta la bolsa */}
      {(() => { const m = cl((cyc - 0.4) / 0.5), x = lerp(0.82, -0.55, m), y = 0.3 + 0.12 * Math.sin(m * PI); return <mesh position={[x, y, 0.05]} visible={tt > aP + 0.4}><dodecahedronGeometry args={[0.035, 0]} /><meshStandardMaterial map={rockT("terron", CLAY, 1, 1)} roughness={0.95} /></mesh>; })()}
      <group position={[-0.45, 0, -0.05]}><Stickman escala={0.09} rotY={90} guion={[{ t: 0, accion: "cargar_caja", expr: "decidido" }]} semilla={52} contacto={0.3} colorContacto="#1a1410" /></group>
      <mesh position={[-0.7, 0.08 + 0.002 * n, 0.05]} scale={[1, 1 + Math.min(0.8, n * 0.15), 1]}><sphereGeometry args={[0.08, 18, 14]} /><meshStandardMaterial color="#b8a882" roughness={1} /></mesh>
      <mesh position={[0.2, 0.62, 0.1]}><sphereGeometry args={[0.016, 10, 8]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[0.2, 0.55, 0.2]} intensity={1.0} distance={1.6} color="#ffc070" />
    </>;
  }}</U3>;
};

// ---- Messines19 · «a las tres y diez de la mañana, se detonaron diecinueve de esas minas»: la cresta en corte con sus 19 cámaras;
// el reloj marca las 3:10, las cámaras se encienden una tras otra y la cresta se levanta y queda con cráteres ----
export const Messines193D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aT = sec(p, "toneladas", 0.6), aX = Math.min(sec(p, "diecinueve", 2.0), D - 2.2);
  const tons = (tt: number) => 450 * eio(tt, aT, aT + 1.0);
  return <U3 d={d} bg={p.bg} ground={null} sky="#20222a" mode="drop" key1={[-1.2, 2.4, 2.0]} backZ={-1.6}
    cam={{ at: [0, 0.3, 0], az: [-0.1, 0.08], el: [0.16, 0.1], r: [2.9, 2.6], fov: 36 }}
    over={(tt) => <Drums v={Math.round(tons(tt))} n={3} x={1180} y={140} s={1.3} unit="t" />}>{(tt) => {
    const W = 3.2, N = 64;
    const ridge = (x: number) => 0.28 * Math.exp(-x * x * 1.4);
    const boom = (i: number) => eio(tt, aX + i * 0.06, aX + i * 0.06 + 0.4);
    const cx = Array.from({ length: 19 }, (_, i) => -1.35 + i * 0.15);
    const heave = (x: number) => cx.reduce((s, c, i) => s + 0.18 * boom(i) * (1 - eio(tt, aX + 1.0 + i * 0.03, aX + 1.8 + i * 0.03)) * Math.exp(-Math.pow((x - c) * 18, 2)) - 0.06 * eio(tt, aX + 1.0, aX + 1.8) * boom(i) * Math.exp(-Math.pow((x - c) * 16, 2)), 0);
    const pos: number[] = []; const idx: number[] = [];
    for (let i = 0; i <= N; i++) { const x = -W / 2 + W * i / N, y = 0.2 + ridge(x) + heave(x); pos.push(x, -0.4, 0, x, y, 0); if (i < N) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return <>
      <mesh geometry={g}><meshStandardMaterial map={rockT("messines", [104, 96, 80], 3, 1)} roughness={1} side={THREE.DoubleSide} /></mesh>
      {/* las 19 cámaras: brillan naranja de a una (rampa, nunca destello) */}
      {cx.map((x, i) => <mesh key={i} position={[x, -0.18 + 0.03 * Math.sin(i), 0.01]}><boxGeometry args={[0.06, 0.04, 0.01]} /><meshStandardMaterial color="#3a2a1a" emissive="#ff8a3a" emissiveIntensity={0.15 + 1.4 * boom(i) * (1 - eio(tt, aX + 1.2, aX + 2.0))} /></mesh>)}
      <pointLight position={[0, 0.0, 0.6]} intensity={2.4 * eio(tt, aX, aX + 0.6) * (1 - eio(tt, aX + 1.0, aX + 2.0))} distance={3} color="#ff9a4a" />
      {/* el polvo que sube de la cresta */}
      {Array.from({ length: 24 }, (_, i) => { const c = cx[i % 19], b = boom(i % 19), r = eio(tt, aX + (i % 19) * 0.06, aX + 2.4);
        return <mesh key={i} position={[c + (rn(i, 1) - 0.5) * 0.1, 0.45 + r * (0.2 + 0.5 * rn(i, 2)), (rn(i, 3) - 0.5) * 0.3]} scale={Math.max(0.001, b * (0.6 + rn(i, 4)) * (1 - 0.5 * eio(tt, aX + 1.6, aX + 3)))}><sphereGeometry args={[0.07, 12, 10]} /><meshStandardMaterial color="#6a6458" roughness={1} transparent opacity={0.7} depthWrite={false} /></mesh>; })}
      {/* el reloj de bolsillo: las tres y diez */}
      <group position={[1.2, 0.85, 0.2]} rotation={[0, -0.25, 0]} scale={pop(tt, 0.3)}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.03, 40]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.145, 40]} /><meshStandardMaterial color="#efe6d2" /></mesh>
        <group position={[0, 0, 0.02]} rotation={[0, 0, -(3 + 10 / 60) / 12 * 2 * PI]}><RBox s={[0.012, 0.08, 0.004]} r={0.002} p={[0, 0.04, 0]}><meshStandardMaterial color="#1e1610" /></RBox></group>
        <group position={[0, 0, 0.022]} rotation={[0, 0, -10 / 60 * 2 * PI]}><RBox s={[0.008, 0.12, 0.004]} r={0.002} p={[0, 0.06, 0]}><meshStandardMaterial color="#1e1610" /></RBox></group>
        <Plate k="hora" txt="3:10" w={0.18} h={0.06} p={[0, -0.22, 0]} mat="brass" />
      </group>
    </>;
  }}</U3>;
};

// ---- TiraTiempo · «En total, en ocho guerras, no llegas ni a dos horas… Tenían años»: una regla de madera de 0 a 2 horas con las
// ocho fichas en su lugar; después la regla de los años se desenrolla y se va lejos del cuadro ----
const TT = [["HOPLITA", 3], ["ARQUERO", 10], ["ZAPADOR", 0.5], ["TAMBOR", 60], ["ORDENANZA", 20], ["CIRUJANO", 1], ["COLA", 5], ["ARCILLA", 0.13]] as const;
export const TiraTiempo3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aA = Math.min(sec(p, "años", 2.6), D - 1.4);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="wipe" key1={[-1.2, 2.6, 2.0]}
    cam={{ at: [-0.1, 0.1, 0], at1: [0.6, 0.1, 0], az: [-0.1, 0.05], el: [0.7, 0.55], r: [2.3, 2.4], fov: 36 }}>{(tt) => {
    const ext = eio(tt, aA, aA + 1.4);
    return <>
      <RBox s={[2.4, 0.03, 0.18]} r={0.006} p={[0, 0.015, 0]}><meshStandardMaterial map={tex.wood(4, 1, [196, 160, 110])} roughness={0.6} /></RBox>
      {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[-1.15 + i * 2.3 / 12, 0.031, -0.06]}><boxGeometry args={[0.006, 0.002, i % 6 ? 0.04 : 0.08]} /><meshStandardMaterial color="#3a2210" /></mesh>)}
      <Plate k="cero" txt="0" w={0.08} h={0.07} p={[-1.15, 0.032, -0.13]} rot={[-PI / 2, 0, 0]} />
      <Plate k="dosh" txt="2 HORAS" w={0.3} h={0.07} p={[1.15, 0.032, -0.13]} rot={[-PI / 2, 0, 0]} />
      {TT.map(([w, m], i) => { const x = -1.15 + 2.3 * (m as number) / 120, a = 0.2 + i * 0.22;
        return <group key={i} position={[x, 0.03, 0.03 + (i % 2) * 0.0]} scale={pop(tt, a)}>
          <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.012, 0.012, 0.08, 10]} />{M.brass()}</mesh>
          <Plate k={"tt" + i} txt={w} w={0.24} h={0.06} p={[0, 0.09 + 0.07 * (i % 4), 0]} rot={[-0.9, 0, 0]} />
        </group>; })}
      {/* la regla de los años: se desenrolla hacia la derecha y no termina */}
      <group position={[1.22, 0.015, 0.3]}>
        <RBox s={[Math.max(0.02, 6 * ext), 0.03, 0.14]} r={0.006} p={[3 * ext, 0, 0]}><meshStandardMaterial map={tex.wood(12, 1, [150, 96, 52])} roughness={0.6} /></RBox>
        <group scale={pop(tt, aA + 0.4)}><Plate k="anios" txt="AÑOS" w={0.26} h={0.07} p={[0.25, 0.02, 0]} rot={[-PI / 2, 0, 0]} mat="brass" /></group>
      </group>
    </>;
  }}</U3>;
};

// ---- OchoPuertas · «¿En qué guerra durabas más? … ¿cuál elegirías?»: un carrusel de ocho arcos de piedra, cada uno con su objeto
// delante; gira despacio y frena frente a la cámara ----
export const OchoPuertas3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30;
  return <U3 d={d} bg={p.bg} ground={[120, 100, 80]} mode="iris" key1={[-1.0, 2.8, 1.6]}
    cam={{ at: [0, 0.35, 0], az: [0.0, 0.0], el: [0.32, 0.22], r: [2.6, 2.2], fov: 38 }}>{(tt) => {
    const rot = 2 * PI * 0.62 * eio(tt, 0.2, D - 0.4);
    return <group rotation={[0, rot, 0]}>
      {Array.from({ length: 8 }, (_, i) => { const a = i / 8 * 2 * PI, R = 1.0;
        return <group key={i} position={[Math.sin(a) * R, 0, Math.cos(a) * R]} rotation={[0, a, 0]}>
          {[-1, 1].map((s) => <RBox key={s} s={[0.07, 0.5, 0.08]} r={0.01} p={[s * 0.16, 0.25, -0.1]}><meshStandardMaterial map={dirtT([180, 170, 152])} roughness={0.95} /></RBox>)}
          <mesh position={[0, 0.5, -0.1]}><torusGeometry args={[0.16, 0.04, 8, 20, PI]} /><meshStandardMaterial map={dirtT([180, 170, 152])} roughness={0.95} /></mesh>
          <mesh position={[0, 0.3, -0.12]}><planeGeometry args={[0.26, 0.6]} /><meshBasicMaterial color="#0c0907" /></mesh>
          <group position={[0, 0.0, 0.08]} scale={1.3}><Casco i={i} /></group>
          <mesh position={[0, 0.005, 0.08]}><cylinderGeometry args={[0.12, 0.13, 0.01, 24]} />{M.wood({ base: [100, 64, 34] })}</mesh>
          <Plate k={"puerta" + i} txt={String(i + 1)} w={0.1} h={0.08} p={[0, 0.66, -0.06]} mat="brass" font={90} />
        </group>; })}
      <pointLight position={[0, 0.8, 0]} intensity={1.6} distance={2.6} color="#ffd8a0" />
    </group>;
  }}</U3>;
};
