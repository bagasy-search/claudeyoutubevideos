// gary05 · componentes únicos 1/4 (min 0-5). Cada uno es UN objeto que hace la idea sin leer; el texto va sobre la pieza.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { PI, Txt3, Mark, WattMeter, roll } from "./gk";
import { Board, Cage, Fan, Flame, Furnace, Igniter, Clamp } from "./fk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);

// 0:23 · HAY GAS, NO HAY LLAMA: el caño de vidrio trae el gas azul hasta la válvula y ahí se amontona; el encendedor sigue gris,
// el enchufe del calefactor cuelga junto a una toma muerta que se tacha. Gas sí; chispa no.
export const HGasNoFlame: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0b0d11"
  key1={[-1.0, 2.0, 1.4]} cam={{ at: [-0.25, 0.5, 0], at1: [0.05, 0.55, 0.05], az: [-0.75, -0.25], el: [0.16, 0.1], r: [2.3, 1.7], fov: 32 }}>{(tt) => {
  const N = 46, x0 = -1.15, x1 = 0.12;
  const xs = Array.from({ length: N }, (_, i) => { const ph = cl((tt * 0.55 - i * 0.03) % 1.6); const pile = 0.012 * (i % 12); return Math.min(x1 - pile, lerp(x0, x1, ph * 1.4)); });
  const dead = eio(tt, 3.2, 3.8), xk = cl((tt - 4.0) / 0.8);
  return <>
    <Furnace t={tt} p={[0.3, 0, -0.1]} k={{ open: 1, fl: 0, ign: 0 }} s={0.75} />
    {/* el caño de gas de vidrio: el gas azul corre y se apila contra la válvula cerrada */}
    <mesh position={[(x0 + x1) / 2, 0.45, 0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, x1 - x0, 24, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
    {xs.map((x, i) => <mesh key={i} position={[x, 0.45 + 0.012 * Math.sin(i * 2.3 + tt * 3), 0.02 + 0.012 * Math.cos(i * 1.7)]}><sphereGeometry args={[0.009, 10, 8]} />{M.glow({ col: "#5aa8ff", op: 0.9 })}</mesh>)}
    <RBox s={[0.07, 0.07, 0.07]} p={[0.17, 0.45, 0.02]} r={0.008}>{M.steel({ col: "#a9adb1" })}</RBox>
    <Txt3 txt="GAS" w={0.2} h={0.07} col="#6fe39a" glow p={[-0.2, 0.56, 0.05]} />
    {/* la pared con la toma y el enchufe del calefactor colgando */}
    <mesh position={[-0.75, 0.42, -0.45]}><planeGeometry args={[0.45, 0.55]} /><meshStandardMaterial color="#7f7a72" roughness={0.95} /></mesh>
    <RBox s={[0.09, 0.13, 0.02]} p={[-0.75, 0.3, -0.44]} r={0.006}>{M.plastic({ col: "#efece4" })}</RBox>
    {[-0.02, 0.02].map((y) => <group key={y} position={[-0.75, 0.3 + y * 1.4, -0.428]}>{[-1, 1].map((s) => <mesh key={s} position={[s * 0.01, 0.004, 0]}><boxGeometry args={[0.004, 0.012, 0.002]} /><meshBasicMaterial color="#111" /></mesh>)}</group>)}
    <mesh position={[-0.75, 0.4, -0.43]}><circleGeometry args={[0.008, 16]} /><meshStandardMaterial color="#300" emissive="#ff3a2a" emissiveIntensity={1.5 * (1 - dead)} toneMapped={false} /></mesh>
    <mesh geometry={tubeG("gnfc", [[0.02, 0.62, -0.05], [-0.3, 0.12, 0.05], [-0.55, 0.08, -0.1], [-0.66, 0.18, -0.36]], 0.008, 60, 8)}>{M.rubber({ col: "#18191b" })}</mesh>
    <group position={[-0.66, 0.2 + 0.01 * Math.sin(tt * 2), -0.36]} rotation={[0.4, 0.3, 0]}><RBox s={[0.045, 0.05, 0.03]} r={0.008}>{M.rubber({ col: "#18191b" })}</RBox>
      {[-0.011, 0.011].map((x) => <mesh key={x} position={[x, 0.006, 0.026]}><boxGeometry args={[0.004, 0.012, 0.025]} />{M.brass()}</mesh>)}</group>
    <Txt3 txt="POWER" w={0.3} h={0.095} col="#ff6a5a" glow p={[-0.75, 0.5, -0.42]} op={dead} />
    <Mark k={xk} p={[-0.75, 0.3, -0.4]} s={1.0} />
  </>;
}}</Scene3D>;

// 2:16 · LAS CUATRO COSAS ELÉCTRICAS: con la tapa afuera, el inductor, el encendedor, la placa y el soplador salen del
// calefactor de a uno con resorte y aterrizan en fila adelante, cada uno con su rótulo.
export const HFourParts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0, 0.42, 0.15], az: [-0.25, 0.2], el: [0.22, 0.16], r: [2.75, 2.4], fov: 34 }}>{(tt) => {
  const P = [{ from: [-0.14, 1.0, 0.12], to: [-0.6, 0.12, 0.55], at: 0.7, lab: "INDUCER" }, { from: [-0.1, 0.66, 0.06], to: [-0.2, 0.12, 0.6], at: 1.7, lab: "IGNITER" },
    { from: [0.12, 1.0, 0.12], to: [0.2, 0.12, 0.6], at: 2.7, lab: "BOARD" }, { from: [0, 0.25, 0.02], to: [0.62, 0.12, 0.55], at: 3.7, lab: "BLOWER" }];
  const fz = [0, 0, -0.35];
  return <>
    <Furnace t={tt} p={fz as V} k={{ open: 1, led: tt > 2.7 ? 0 : 1 }} s={0.9} />
    {P.map((q, i) => {
      const k = cl((tt - q.at) / 0.7), land = phys(tt, q.at + 0.7, 9, 0.45), arc = Math.sin(PI * k) * 0.35;
      const p: V = [lerp(q.from[0] * 0.9, q.to[0], eio(tt, q.at, q.at + 0.7)), lerp(q.from[1] * 0.9, q.to[1], eio(tt, q.at, q.at + 0.7)) + arc, lerp(q.from[2] * 0.9 - 0.35, q.to[2], eio(tt, q.at, q.at + 0.7))];
      const sq = tt > q.at + 0.7 ? 1 + 0.12 * (1 - land) : 1;
      return <group key={i} position={p} scale={[sq, 2 - sq, sq]}>
        {i === 0 && <group rotation={[0, 0, 0]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.06, 32]} />{M.plastic({ col: "#2a2c30" })}</mesh><group position={[0, 0, 0.032]}><Fan rot={tt * 12} r={0.07} /></group></group>}
        {i === 1 && <Igniter heat={0.5 + 0.5 * Math.sin(tt * 3) ** 2} s={2.2} p={[0, 0.06, 0]} />}
        {i === 2 && <Board t={tt} on={1} s={1.4} p={[0, 0.06, 0]} r={[-0.3, 0, 0]} />}
        {i === 3 && <group scale={0.75}><Cage rot={tt * 6} r={0.14} w={0.2} /></group>}
        <Txt3 txt={q.lab} w={0.24} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[0, -0.1, 0.12]} op={cl((tt - q.at - 0.6) / 0.3)} />
      </group>;
    })}
  </>;
}}</Scene3D>;

// 2:32 · EL INDUCTOR VA PRIMERO: el ventilador chico arranca, el humo que espera en los quemadores se va por el
// intercambiador y sale por el caño blanco; recién con el tiraje el presostato hace clic y se prende la luz verde.
export const HInducer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0d0f13"
  cam={{ at: [0, 0.35, 0], at1: [0.02, 0.45, 0], az: [-0.35, -0.1], el: [0.1, 0.06], r: [1.55, 1.25], fov: 34 }}>{(tt) => {
  const spin = eio(tt, 0.6, 1.6), drawK = cl((tt - 1.4) / 1.6), click = cl(phys(tt, 3.3, 12, 0.4));
  const path: number[][] = [[-0.35, -0.05, 0.05], [-0.15, -0.05, 0.05], [-0.05, 0.25, 0.04], [0.15, 0.32, 0.03], [0.15, 0.55, 0.03], [0.15, 0.9, 0.03]];
  const pt = (u: number): V => { const s = u * (path.length - 1), i = Math.min(path.length - 2, Math.floor(s)), f = s - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f), lerp(path[i][2], path[i + 1][2], f)]; };
  return <>
    {/* caja de quemadores en corte (vidrio) y el intercambiador */}
    <RBox s={[0.5, 0.2, 0.18]} p={[-0.18, -0.05, 0]} r={0.01}>{M.glass({ op: 0.18 })}</RBox>
    {[-0.34, -0.24, -0.14, -0.04].map((x) => <mesh key={x} position={[x, -0.1, 0.0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.14, 14]} />{M.steel({ col: "#8a8f94" })}</mesh>)}
    <mesh geometry={tubeG("indhx", path.slice(1, 5), 0.05, 60, 16)}>{M.glass({ op: 0.14 })}</mesh>
    {/* el inductor: voluta con su ventilador, girando */}
    <group position={[0.15, 0.5, 0.03]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.07, 36]} />{M.plastic({ col: "#2a2c30" })}</mesh>
      <group position={[0, 0, 0.037]}><Fan rot={tt * 50 * spin} r={0.085} /></group>
      <Txt3 txt="50–100 W" w={0.2} h={0.05} col="#f2c21b" p={[0.24, 0.0, 0.05]} op={cl((tt - 1.2) / 0.4)} />
    </group>
    {/* el caño blanco del escape */}
    <mesh position={[0.15, 0.88, 0.03]}><cylinderGeometry args={[0.04, 0.04, 0.6, 24]} />{M.pvc()}</mesh>
    {/* humo: hilos que viajan por el camino cuando el ventilador tira */}
    {Array.from({ length: 30 }, (_, i) => { const u = ((tt * 0.35 + i / 30) % 1) * drawK, p = pt(u); return <mesh key={i} position={[p[0] + 0.01 * Math.sin(i), p[1], p[2] + 0.01 * Math.cos(i)]}><sphereGeometry args={[0.014 + 0.01 * u, 10, 8]} /><meshBasicMaterial color="#b8bcc4" transparent opacity={0.45 * drawK * (u < 0.98 ? 1 : 0)} depthWrite={false} /></mesh>; })}
    {/* presostato: el botón redondo con la manguerita; clic y luz verde */}
    <group position={[-0.32, 0.45, 0.05]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 0.03, 32]} />{M.plastic({ col: "#e9e7e1" })}</mesh>
      <mesh position={[0, 0, 0.018 - 0.008 * click]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.01, 24]} />{M.plastic({ col: "#2b6fd6" })}</mesh>
      <mesh geometry={tubeG("indhose", [[0.0, -0.03, 0], [0.12, -0.2, 0.02], [0.35, 0.02, 0.0], [0.45, 0.05, 0.0]], 0.006, 40, 8)}>{M.rubber({ col: "#d8d4c8" })}</mesh>
      <mesh position={[0, 0.09, 0.0]}><sphereGeometry args={[0.018, 16, 12]} /><meshStandardMaterial color="#132" emissive="#3aff6a" emissiveIntensity={3 * click} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.09, 0.08]} intensity={0.8 * click} distance={0.5} color="#3aff6a" />
      <Txt3 txt="OK TO LIGHT" w={0.22} h={0.05} col="#6fe39a" glow p={[0, 0.16, 0.0]} op={click} />
    </group>
  </>;
}}</Scene3D>;

// 2:50 · EL ENCENDEDOR: la cerámica pasa de gris a naranja y el medidor de al lado trepa a 400 W; con el rojo se abre la
// válvula y las llamas se prenden de una a la otra; después el encendedor se apaga y el medidor baja.
export const HIgniter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#090a0d"
  cam={{ at: [0.1, 0.05, 0], az: [-0.4, 0.15], el: [0.18, 0.1], r: [1.3, 1.1], fov: 32 }}>{(tt) => {
  const heat = eio(tt, 0.5, 2.3) * (1 - eio(tt, 4.4, 5.2)), w = roll(tt, 0.5, 2.2, 0, 400) * (tt < 4.4 ? 1 : 0) + (tt >= 4.4 ? roll(tt, 4.4, 5.2, 400, 0) : 0);
  return <>
    {[-0.24, -0.08, 0.08, 0.24].map((x, i) => <group key={i} position={[x, -0.1, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.22, 16]} />{M.steel({ col: "#8a8f94" })}</mesh>
      <Flame k={cl((tt - 2.6 - i * 0.22) / 0.25)} t={tt} i={i} s={2.0} p={[0, 0.04, -0.08]} />
    </group>)}
    <pointLight position={[0, 0.1, 0.2]} intensity={3 * cl((tt - 2.6) / 0.8)} distance={1.2} color="#6aa0ff" />
    <Igniter heat={heat} p={[-0.16, 0.07, -0.06]} s={2.2} />
    <WattMeter val={`${w} W`} p={[0.42, -0.1, 0.05]} r={[0, -0.4, 0]} s={1.8} warn={w > 300 ? 1 : 0} />
  </>;
}}</Scene3D>;

// 3:36 · EL SOPLADOR, VIEJO CONTRA NUEVO: dos jaulas de ardilla girando sobre su columna de vatios; la estándar trepa y
// se mueve entre 300 y 700; la de velocidad variable gira más tranquila entre 100 y 300.
export const HBlower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0, 0.5, 0], az: [-0.2, 0.2], el: [0.12, 0.08], r: [2.1, 1.9], fov: 34 }}>{(tt) => {
  const on = eio(tt, 0.5, 1.4), wOld = on * (500 + 200 * Math.sin(tt * 1.6)), wNew = on * (200 + 100 * Math.sin(tt * 1.3 + 1)), sc = 0.0011;
  const Col: React.FC<{ x: number; w: number; col: string; lab: string; rng: string }> = ({ x, w, col, lab, rng }) => <group position={[x, 0, 0]}>
    <RBox s={[0.36, 0.06, 0.3]} p={[0, 0.03, 0]} r={0.01}>{M.matte({ col: "#2a2c30" })}</RBox>
    <mesh position={[0, 0.06 + w * sc / 2, -0.1]} scale={[1, z1(w * sc), 1]}><boxGeometry args={[0.08, 1, 0.06]} />{M.glow({ col, op: 0.85 })}</mesh>
    <mesh position={[0, 0.06 + 0.4, -0.1]}><boxGeometry args={[0.1, 0.8, 0.07]} />{M.glass({ op: 0.12 })}</mesh>
    {[100, 300, 700].map((v) => <Txt3 key={v} txt={String(v)} w={0.08} h={0.03} col="#cfd5dc" p={[-0.1, 0.06 + v * sc, -0.06]} />)}
    <group position={[0, 0.3, 0.06]}><Cage rot={tt * (x < 0 ? 14 : 7) * on} r={0.12} w={0.16} /></group>
    <Txt3 txt={lab} w={0.34} h={0.05} col="#f7f4ee" bg="#1b1d21" p={[0, 0.032, 0.152]} />
    <Txt3 txt={rng} w={0.24} h={0.06} col={col} glow p={[0, 0.98, -0.1]} op={on} />
  </group>;
  return <>
    <Col x={-0.42} w={wOld} col="#ff8a3a" lab="STANDARD MOTOR" rng="300–700 W" />
    <Col x={0.42} w={wNew} col="#5ab8ff" lab="VARIABLE SPEED" rng="100–300 W" />
  </>;
}}</Scene3D>;

// 3:54 · SUMALO: cuatro bloques (inductor, encendedor, placa, soplador) caen uno sobre otro en un tubo de vidrio con la
// franja de 400 a 800 W; el del encendedor se prende arriba un momento y se va; la pila queda en la franja verde.
export const HAddUp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0, 0.48, 0], az: [-0.35, -0.1], el: [0.1, 0.08], r: [1.95, 1.72], fov: 34 }}>{(tt) => {
  const B = [{ w: 80, c: "#9aa0a6", l: "INDUCER 80" }, { w: 20, c: "#3f9a5a", l: "BOARD 20" }, { w: 450, c: "#ff8a3a", l: "BLOWER 450" }, { w: 300, c: "#ffb02a", l: "IGNITER 300" }];
  const sc = 0.001; let y = 0.05;
  const band = cl((tt - 4.2) / 0.5), ignOut = eio(tt, 3.9, 4.4);
  return <>
    <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.36, 0.9, 0.36]} />{M.glass({ op: 0.12 })}</mesh>
    <mesh position={[0, 0.05 + 0.6 * sc * 1000 / 1, 0]}><boxGeometry args={[0.37, 0.4, 0.37]} /><meshBasicMaterial color="#3aff6a" transparent opacity={0.08 + 0.14 * band} depthWrite={false} /></mesh>
    {[400, 800].map((v) => <group key={v}><mesh position={[0, 0.05 + v * sc, 0.181]}><boxGeometry args={[0.38, 0.004, 0.004]} />{M.glow({ col: "#6fe39a" })}</mesh>
      <Txt3 txt={`${v} W`} w={0.16} h={0.05} col="#6fe39a" glow p={[0.3, 0.05 + v * sc, 0.18]} /></group>)}
    {B.map((b, i) => {
      const at = 0.5 + i * 0.85, hgt = b.w * sc, y0 = y; y += i === 3 ? 0 : hgt;
      const drop = (1 - phys(tt, at, 9, 0.45)) * 0.9, gone = i === 3 ? ignOut : 0;
      return <group key={i} position={[0, y0 + hgt / 2 + Math.max(0, drop), 0]} scale={[1, z1(1 - gone), 1]}>
        <RBox s={[0.32, Math.max(0.012, hgt - 0.004), 0.32]} r={0.006}>{i === 3 ? <meshStandardMaterial color={b.c} emissive="#ff6a10" emissiveIntensity={1.2} /> : M.plastic({ col: b.c })}</RBox>
        <Txt3 txt={b.l} w={0.28} h={0.05} col="#ffffff" p={[0, 0, 0.162]} op={tt > at ? 1 : 0} />
      </group>;
    })}
  </>;
}}</Scene3D>;

// 4:34 · LA PLACA DE DATOS: la linterna barre la chapa remachada (120 V · 7.0 A); un sello de acero baja con peso y deja
// grabado «× 120 = 840 W» con un golpe.
export const HDataPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0b0c0f"
  cam={{ at: [0, 0.0, 0], az: [-0.3, 0.12], el: [0.1, 0.06], r: [1.05, 0.85], fov: 32 }}>{(tt) => {
  const beam = lerp(-0.4, 0.4, eio(tt, 0.4, 2.0)), hit = 3.0, down = tt < hit ? lerp(0.5, 0.02, eio(tt, 2.2, hit)) : 0.02 + 0.15 * eio(tt, hit + 0.2, hit + 0.9);
  const shake = tt > hit && tt < hit + 0.25 ? 0.004 * Math.sin(tt * 120) : 0, eng = cl((tt - hit) / 0.08);
  return <group position={[shake, 0, 0]}>
    <RBox s={[0.7, 0.42, 0.012]} r={0.01}>{M.steel({ col: "#b9bec2" })}</RBox>
    {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, y], i) => <mesh key={i} position={[x * 0.32, y * 0.18, 0.008]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.006, 16]} />{M.steel({ col: "#8a8f94" })}</mesh>)}
    <Txt3 txt="VOLTS   120" w={0.5} h={0.07} col="#2a2a2a" p={[0, 0.11, 0.007]} font="Courier New" />
    <Txt3 txt="FULL LOAD AMPS   7.0" w={0.56} h={0.07} col="#2a2a2a" p={[0, 0.02, 0.007]} font="Courier New" />
    <mesh position={[0, -0.11, 0.0065]}><planeGeometry args={[0.56, 0.1]} /><meshStandardMaterial color="#8d9296" metalness={0.7} roughness={0.35} /></mesh>
    <Txt3 txt="7.0 × 120 = 840 W" w={0.52} h={0.08} col="#c62a22" p={[0, -0.11, 0.008]} op={eng} font="Courier New" />
    {/* el haz de la linterna barriendo */}
    <pointLight position={[beam, 0.05, 0.25]} intensity={0.8} distance={0.6} color="#fff1d0" />
    {/* el sello de acero */}
    <group position={[0, -0.11, 0.06 + down]}>
      <RBox s={[0.58, 0.12, 0.08]} p={[0, 0, 0.04]} r={0.01}>{M.steel({ col: "#6f757b" })}</RBox>
      <mesh position={[0, 0, 0.2]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.24, 20]} />{M.wood({ base: [120, 84, 50] })}</mesh>
    </group>
    {Array.from({ length: 10 }, (_, i) => { const k = cl((tt - hit) / 0.5), a = i * 0.63; return <mesh key={i} position={[Math.cos(a) * 0.32 * k, -0.11 + Math.sin(a) * 0.1 * k, 0.04]}><sphereGeometry args={[0.004, 6, 4]} />{M.glow({ col: "#ffd27a", op: 1 - k })}</mesh>; })}
  </group>;
}}</Scene3D>;

// 4:52 · LA PINZA: el cable del calefactor se abre en negro, blanco y verde; la pinza amarilla abre la boca, abraza SÓLO el
// negro y cierra con un clic; adentro de la mordaza late el anillo del campo y la pantalla rueda hasta 4.8 A.
export const HClamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#0d0f12"
  cam={{ at: [0, -0.04, 0], az: [-0.5, -0.15], el: [0.12, 0.08], r: [1.15, 0.98], fov: 32 }}>{(tt) => {
  const move = eio(tt, 0.6, 1.9), jaw = tt < 1.9 ? 0 : cl(phys(tt, 1.9, 12, 0.4)), a = roll(tt, 2.3, 3.6, 0, 48) / 10;
  const W = [{ c: "#141416", z: 0 }, { c: "#efece4", z: -0.06 }, { c: "#2f8a3f", z: 0.06 }];
  return <>
    <mesh geometry={tubeG("clc", [[-0.8, 0.0, 0], [-0.45, 0.0, 0]], 0.035, 20, 16)}>{M.rubber({ col: "#8a8478" })}</mesh>
    {W.map((w, i) => <mesh key={i} geometry={tubeG("clw" + i, [[-0.45, 0.0, 0], [-0.3, 0.0, w.z], [0.2, 0.0, w.z], [0.8, 0.0, w.z]], 0.012, 60, 10)}>{M.rubber({ col: w.c })}</mesh>)}
    {[0.4, 0.75].map((s) => <mesh key={s} position={[0.05, 0, 0]} rotation={[0, PI / 2, 0]} scale={z1(jaw) * (0.6 + 0.4 * Math.sin(tt * 6 + s * 9) ** 2)}><torusGeometry args={[0.045 * s + 0.01, 0.003, 8, 40]} />{M.glow({ col: "#7ad0ff", op: 0.7 * jaw })}</mesh>)}
    <Clamp jaw={jaw} val={`${a.toFixed(1)}A`} p={[0.05, lerp(0.6, -0.045, move), 0.0]} r={[0, 0, 0]} s={1.6} />
  </>;
}}</Scene3D>;
