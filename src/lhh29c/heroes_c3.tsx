// lhh29c · componentes únicos 17-24: el calor que rebota bajo la funda, el reloj que baja de 2:00 a 1:15, el horno en corte,
// la lasaña que agujerea el aluminio, la tarta que se quema por el borde, el anillo de tres pulgadas, el apio de goma y el gas que se escapa.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG, DigitDrum } from "./h3d";
import { Foil, FoilSheet, Pie } from "./foilkit";

const PI = Math.PI;
const Arrow: React.FC<{ p: number[]; dir: number[]; col: string; op?: number; s?: number }> = ({ p, dir, col, op = 1, s = 1 }) => {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dir[0], dir[1], dir[2]).normalize());
  return <group position={p as [number, number, number]} quaternion={q} scale={s}>
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.003, 0.003, 0.04, 8]} />{M.glow({ col, op })}</mesh>
    <mesh position={[0, 0.005, 0]}><coneGeometry args={[0.008, 0.016, 12]} />{M.glow({ col, op })}</mesh></group>;
};
const Check: React.FC<{ p: number[]; k: number; col?: string }> = ({ p, k, col = GRN }) => k > 99 ? <group position={p as [number, number, number]} scale={k}>
  <mesh position={[-0.012, -0.004, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.022, 0.006, 0.004]} />{M.glow({ col })}</mesh>
  <mesh position={[0.012, 0.008, 0]} rotation={[0, 0, -PI / 3.2]}><boxGeometry args={[0.042, 0.006, 0.004]} />{M.glow({ col })}</mesh></group> : null;
const Cross: React.FC<{ p: number[]; k: number; s?: number }> = ({ p, k, s = 1 }) => k > 0 ? <group position={p as [number, number, number]} scale={k * s}>
  {[1, -1].map((d) => <mesh key={d} rotation={[0, 0, d * PI / 4]}><boxGeometry args={[0.05, 0.007, 0.004]} />{M.glow({ col: RED })}</mesh>)}</group> : null;

// ---- 7:28 · EL CALOR REBOTA: corte de la tabla de planchar: tabla, aluminio, funda y lino; la plancha manda calor hacia abajo y el aluminio lo devuelve ----
export const HBounce: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [0.15, 0.3], el: [0.5, 0.42], r: [0.78, 0.68], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HEAT FROM BOTH SIDES" col={AMB} />
    <Tag tt={tt} at={1.0} x={420} y={880} txt="LINEN" col={ICE} size={38} />
    <Tag tt={tt} at={1.4} x={1480} y={880} txt="FOIL · SHINY UP" col={AMB} size={38} /></>}>{(tt) => {
  const ir = lerp(-0.12, 0.08, eio(tt, 0.4, 5.5));
  return <>
    <RBox s={[0.6, 0.012, 0.16]} p={[0, -0.01, 0]} r={0.002}>{M.steel({ col: "#8d949a" })}</RBox>
    <RBox s={[0.6, 0.002, 0.16]} p={[0, -0.003, 0]} r={0.0005}><Foil /></RBox>
    <RBox s={[0.6, 0.012, 0.16]} p={[0, 0.005, 0]} r={0.003}><meshStandardMaterial color="#d6cbb4" roughness={1} /></RBox>
    <RBox s={[0.52, 0.003, 0.15]} p={[0, 0.0125, 0]} r={0.001}><meshStandardMaterial color="#fbf7ee" roughness={0.9} /></RBox>
    {/* la plancha */}
    <group position={[ir, 0.04, 0]}>
      <mesh scale={[1.6, 0.35, 1]} position={[0, 0, 0]}><sphereGeometry args={[0.06, 32, 16, 0, PI * 2, 0, PI / 2]} />{M.chrome({})}</mesh>
      <RBox s={[0.17, 0.008, 0.1]} p={[0, -0.004, 0]} r={0.004}>{M.chrome({})}</RBox>
      <RBox s={[0.1, 0.02, 0.025]} p={[-0.01, 0.045, 0]} r={0.008}><meshPhysicalMaterial color="#2a2a2a" roughness={0.4} /></RBox></group>
    <pointLight position={[ir, 0.02, 0.08]} color="#ff8a3a" intensity={1.6} distance={0.4} />
    {Array.from({ length: 8 }, (_, i) => { const ph = ((tt * 0.9 + i / 8) % 1), x = ir - 0.06 + (i % 4) * 0.04;
      const down = ph < 0.5, k = down ? ph / 0.5 : (ph - 0.5) / 0.5, y = down ? lerp(0.03, -0.001, k) : lerp(-0.001, 0.03, k);
      return <Arrow key={i} p={[x + (down ? 0 : 0.01), y, 0.095]} dir={down ? [0, -1, 0] : [0, 1, 0]} col={down ? "#ff8a3a" : "#ffd36a"} op={Math.sin(k * PI)} s={3} />; })}
  </>;
}}</Scene3D>;

// ---- 7:41 · DE DOS HORAS A UNA Y CUARTO: el reloj de tambores rueda de 2:00 a 1:15 mientras la plancha barre el mantel del altar ----
export const HHourQuarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0, 0.07, 0], az: [-0.2, 0.15], el: [0.18, 0.14], r: [0.55, 0.46], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="2 HOURS → 1¼" col={GRN} />
    <Tag tt={tt} at={4.2} x={1460} y={840} txt="EVERY SATURDAY" col={AMB} size={40} /></>}>{(tt) => {
  const k = eio(tt, 1.2, 3.8), hh = lerp(2, 1, k), m1 = lerp(0, 1, k), m2 = lerp(0, 5, k);
  return <>
    <RBox s={[0.32, 0.09, 0.08]} p={[0, 0.07, 0]} r={0.012}><meshStandardMaterial color="#5a3a22" roughness={0.6} /></RBox>
    <DigitDrum v={hh} p={[-0.09, 0.07, 0.03]} r={0.032} w={0.05} />
    <mesh position={[-0.045, 0.085, 0.045]}><sphereGeometry args={[0.005, 10, 8]} />{M.brass({})}</mesh>
    <mesh position={[-0.045, 0.055, 0.045]}><sphereGeometry args={[0.005, 10, 8]} />{M.brass({})}</mesh>
    <DigitDrum v={m1} p={[0.01, 0.07, 0.03]} r={0.032} w={0.05} />
    <DigitDrum v={m2} p={[0.08, 0.07, 0.03]} r={0.032} w={0.05} />
    <mesh position={[0, 0.002, 0.15]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.12]} /><meshStandardMaterial color="#fbf7ee" roughness={0.95} /></mesh>
    <mesh position={[0, 0.003, 0.15]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.034, 4]} /><meshStandardMaterial color="#c9a24a" /></mesh>
  </>;
}}</Scene3D>;

// ---- 8:45 · EN LA REJILLA DE ABAJO, NUNCA EN EL PISO: corte del horno; el aluminio en el piso se cruza en rojo, sube a la rejilla de abajo y ataja el goteo ----
export const HRackBelow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" lamp={[0.1, 0.5, 0.45]}
  cam={{ at: [0, 0.17, 0], az: [0.15, 0.3], el: [0.16, 0.14], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="RACK BELOW · NOT THE FLOOR" col={AMB} /></>}>{(tt) => {
  const up = eio(tt, 2.4, 3.4), y = lerp(0.012, 0.12, up), heat = 0.6 + 0.2 * Math.sin(tt * 3);
  return <>
    {/* caja del horno abierta de frente */}
    {[[0, 0, 0, 0.6, 0.012, 0.3], [0, 0.4, 0, 0.6, 0.012, 0.3], [-0.3, 0.2, 0, 0.012, 0.4, 0.3], [0.3, 0.2, 0, 0.012, 0.4, 0.3], [0, 0.2, -0.15, 0.6, 0.4, 0.012]].map(([x, yy, z, w, hh, d], i) =>
      <RBox key={i} s={[w, hh, d]} p={[x, yy, z]} r={0.003}><meshStandardMaterial color="#2a2522" roughness={0.6} emissive="#ff4a10" emissiveIntensity={i === 4 ? 0.08 * heat : 0} /></RBox>)}
    <mesh position={[0, 0.02, -0.02]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.004, 0.003, 6, 20]} /></mesh>
    {[0.12, 0.24].map((ry, j) => <group key={j}>{Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.26 + i * 0.065, ry, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.28, 6]} />{M.chrome({})}</mesh>)}</group>)}
    <mesh position={[0, 0.015, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.012]} />{M.glow({ col: "#ff5a1a", op: heat })}</mesh>
    <Pie p={[0, 0.245, 0]} s={1.2} edge={0.5} mid={0.7} fill="#7a2a4a" />
    <FoilSheet w={0.4} d={0.22} p={[0, y, 0]} crumple={0.08} />
    
    <Check p={[0.2, 0.16, 0.16]} k={cl((tt - 3.5) * 3)} />
    {tt > 3.6 && Array.from({ length: 5 }, (_, i) => { const ph = ((tt - 3.6) * 0.8 + i * 0.21) % 1;
      return <mesh key={i} position={[-0.08 + i * 0.04, lerp(0.24, y + 0.01, ph), 0.02]} scale={[0.7, 1.3, 0.7]}><sphereGeometry args={[0.005, 10, 8]} /><meshPhysicalMaterial color="#8a1838" roughness={0.2} clearcoat={1} /></mesh>; })}
    {tt > 3.8 && <mesh position={[0, y + 0.004, 0.02]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, cl((tt - 3.8) / 1.5))}><circleGeometry args={[0.06, 32]} /><meshPhysicalMaterial color="#7a1430" roughness={0.15} clearcoat={1} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 9:01 · LA LASAÑA AGUJEREA EL ALUMINIO: la fuente tapada; aparecen agujeritos y caen motitas; entra el papel manteca en el medio y no aparecen más ----
export const HPinholes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.05, 0], az: [0.45, 0.2], el: [0.45, 0.38], r: [0.52, 0.44], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ACID EATS LITTLE HOLES" col={RED} />
    </>}>{(tt) => {
  const pa = eio(tt, 3.2, 4.2), holes = Math.min(1, tt / 3.0);
  return <>
    <RBox s={[0.36, 0.06, 0.24]} p={[0, 0.03, 0]} r={0.01}><meshStandardMaterial color="#e9e3d6" roughness={0.3} /></RBox>
    <RBox s={[0.34, 0.012, 0.22]} p={[0, 0.058, 0]} r={0.004}><meshStandardMaterial color="#b8321e" roughness={0.45} /></RBox>
    {/* el papel manteca que se mete entre la comida y el aluminio */}
    {pa > 0 && <mesh position={[lerp(-0.5, 0, pa), 0.0675, 0.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.44, 0.3]} /><meshStandardMaterial color="#d9c08a" roughness={0.9} side={THREE.DoubleSide} /></mesh>}
    <FoilSheet w={0.38} d={0.26} p={[0, 0.072 + 0.06 * pa * (1 - eio(tt, 4.3, 5.0)), 0]} crumple={0.12} />
    {Array.from({ length: 18 }, (_, i) => { const k = cl(holes * 18 - i); if (k <= 0) return null;
      return <mesh key={i} position={[-0.15 + rn(i, 2) * 0.3, 0.0745, -0.1 + rn(i, 3) * 0.2]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.003 + 0.004 * rn(i, 4) * k, 12]} /><meshBasicMaterial color="#14100c" /></mesh>; })}
    {Array.from({ length: 18 }, (_, i) => { const k = cl(holes * 18 - i); if (k <= 0) return null; const fl = 0.6 + 0.4 * Math.sin(tt * 3 + i);
      return <mesh key={"lb" + i} position={[-0.15 + rn(i, 2) * 0.3, 0.0745 + 0.03, -0.1 + rn(i, 3) * 0.2]}><cylinderGeometry args={[0.001, 0.005, 0.06, 10, 1, true]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.16 * k * fl} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>; })}
    
    <Check p={[0.13, 0.12, 0.08]} k={cl((tt - 4.2) * 3)} />
  </>;
}}</Scene3D>;

// ---- 9:52 · EL BORDE SE QUEMA PRIMERO: la tarta de zapallo en el horno; el borde se oscurece mientras el centro sigue crudo y tiembla ----
export const HEdgeBurn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0.25, 0.6, 0.3]}
  cam={{ at: [0, 0.03, 0], az: [0.3, 0.1], el: [0.6, 0.5], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="EDGES BURN FIRST" col={RED} />
    
    </>}>{(tt) => {
  const e = eio(tt, 0.6, 4.0) * (1 - 0.0 * tt), wob = 1 + 0.02 * Math.sin(tt * 9) * (1 - e * 0.3);
  return <>
    <pointLight position={[0, 0.3, 0]} color="#ff7a2a" intensity={0.35} distance={1} />
    <group scale={[1, wob, 1]}><Pie s={1.5} edge={0.3 + e * 0.7} mid={0.2} fill="#b8621e" /></group>
    {(() => { const rg = phys(tt, 4.2, 6, 0.45); return rg > 0 && <mesh position={[0, 0.07 + (1 - cl(rg)) * 0.2, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.16, 0.235, 64]} /><Foil dull /></mesh>; })()}
  </>;
}}</Scene3D>;

// ---- 10:07 · UN ANILLO DE TRES PULGADAS: el cuadrado de aluminio; el círculo del medio sale volando, queda el anillo, la cota marca 3 IN y el anillo baja sobre la tarta ----
const ringG = (hole: number) => { const s = new THREE.Shape(); s.moveTo(-0.17, -0.17); s.lineTo(0.17, -0.17); s.lineTo(0.17, 0.17); s.lineTo(-0.17, 0.17); s.lineTo(-0.17, -0.17);
  const p = new THREE.Path(); p.absarc(0, 0, hole, 0, PI * 2, true); s.holes.push(p); return new THREE.ShapeGeometry(s, 48); };
const RG = new Map<number, THREE.ShapeGeometry>();
const ringGeo = (hole: number) => { const k = Math.round(hole * 400); let g = RG.get(k); if (!g) { g = ringG(k / 400); RG.set(k, g); } return g; };
export const HRingCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.04, 0], az: [0.2, -0.1], el: [0.9, 0.75], r: [0.7, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="A RING · 3 INCHES WIDE" col={AMB} />
    <Tag tt={tt} at={2.4} x={1500} y={540} txt="3 IN" col={AMB} size={52} /></>}>{(tt) => {
  const cut = eio(tt, 0.5, 1.6), fly = eio(tt, 1.4, 2.6), low = eio(tt, 3.6, 5.2), dim = eio(tt, 2.2, 3.0);
  return <>
    <Pie p={[0, 0, 0]} s={1.15} edge={0.35} mid={0.5} />
    <group position={[0, lerp(0.16, 0.05, low), 0]}>
      <mesh geometry={ringGeo(0.02 + 0.08 * cut)} rotation={[-PI / 2, 0, 0]} castShadow><Foil /></mesh>
      {fly < 1 && cut > 0.95 && <mesh position={[fly * 0.5, fly * 0.25, -fly * 0.2]} rotation={[-PI / 2 + fly * 2, fly * 3, 0]}><circleGeometry args={[0.1, 48]} /><Foil /></mesh>}
      {dim > 0 && <group position={[0.135, 0.004, 0]}>
        <mesh scale={[dim, 1, 1]}><boxGeometry args={[0.07, 0.002, 0.003]} />{M.glow({ col: AMB })}</mesh>
        {[-1, 1].map((k) => <mesh key={k} position={[k * 0.035 * dim, 0, 0]}><boxGeometry args={[0.002, 0.002, 0.02]} />{M.glow({ col: AMB })}</mesh>)}</group>}
    </group>
  </>;
}}</Scene3D>;

// ---- 10:42 · SE DOBLA COMO UNA GOMITA: el tallo de apio se curva y se cae; aparece el frasco de agua fría y el tallo se para derecho otra vez ----
export const HRubberBand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.3, 0.2], el: [0.16, 0.12], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LIMP AS A RUBBER BAND" col={RED} />
    <Tag tt={tt} at={4.4} x={1460} y={830} txt="COLD WATER · OVERNIGHT" col={GRN} size={40} /></>}>{(tt) => {
  const bend = eio(tt, 0.4, 2.4) * (1 - eio(tt, 4.0, 5.6)), jar = phys(tt, 3.2, 6, 0.5), b = Math.round(bend * 30) / 30;
  const pts = Array.from({ length: 12 }, (_, i) => { const u = i / 11, a = u * b * 2.4; return [Math.sin(a) * 0.12 * u, 0.02 + Math.cos(a) * 0.26 * u, 0]; });
  const col = new THREE.Color("#7fbf4a").lerp(new THREE.Color("#b3c27a"), bend * 0.6);
  return <>
    <mesh geometry={tubeG("celery" + b, pts, (u) => 0.012 - 0.003 * u, 60, 12)} castShadow><meshPhysicalMaterial color={col} roughness={0.4} clearcoat={0.4} /></mesh>
    {[0, 1, 2].map((k) => { const p = pts[11]; return <mesh key={k} position={[p[0] + (k - 1) * 0.012, p[1] + 0.01, 0]} rotation={[0, 0, (k - 1) * 0.5 + b]} scale={[0.6, 1, 0.3]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color="#5f9e32" roughness={0.6} /></mesh>; })}
    {jar > 0 && <group scale={cl(jar)}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.05, 0.05, 0.16, 40, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.047, 0.047, 0.12, 40]} />{M.water({ op: 0.35, col: "#bfe4ff" })}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.03 + rn(i, 2) * 0.06, 0.03 + rn(i, 3) * 0.08, 0.04]}><boxGeometry args={[0.012, 0.012, 0.012]} />{M.glass({ op: 0.5, col: "#ffffff" })}</mesh>)}</group>}
  </>;
}}</Scene3D>;

// ---- 11:12 · EL GAS SE ESCAPA: a la izquierda la bolsa de plástico encierra el gas que rebota y el apio se ablanda; a la derecha el aluminio lo deja salir y el apio sigue firme ----
export const HGasAway: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0.1, 0.5, 0.4]}
  cam={{ at: [0, 0.12, 0], az: [0.0, 0.1], el: [0.16, 0.12], r: [1.0, 0.88], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LET THE GAS GET AWAY" col={GRN} />
    <Tag tt={tt} at={0.8} x={620} y={240} txt="BAG · TRAPPED" col={RED} size={40} />
    <Tag tt={tt} at={1.4} x={1300} y={240} txt="FOIL · LETS IT GO" col={GRN} size={40} /></>}>{(tt) => {
  const droop = eio(tt, 1.0, 5.0);
  const stalk = (x: number, d: number, key: string) => { const b = Math.round(d * 20) / 20; const pts = Array.from({ length: 8 }, (_, i) => { const u = i / 7; return [x + Math.sin(u * b * 1.6) * 0.06 * u, 0.02 + Math.cos(u * b * 1.6) * 0.22 * u, 0]; });
    return [-0.015, 0, 0.015].map((o, j) => <mesh key={key + j} geometry={tubeG(key + j + b, pts.map((p) => [p[0] + o, p[1], p[2] + o * 0.5]), 0.009, 40, 10)}><meshPhysicalMaterial color={d > 0.3 ? "#a9bf6a" : "#7fbf4a"} roughness={0.45} /></mesh>); };
  return <>
    {stalk(-0.2, droop * 0.9, "bag")}
    <mesh position={[-0.2, 0.13, 0]} scale={[1, 1, 0.8]}><cylinderGeometry args={[0.07, 0.06, 0.26, 32]} /><meshPhysicalMaterial color="#e8f2ff" roughness={0.15} transparent opacity={0.22} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {Array.from({ length: 20 }, (_, i) => { const a = tt * (1.5 + rn(i, 2)) + rn(i, 3) * 6;
      return <mesh key={i} position={[-0.2 + Math.sin(a) * 0.05, 0.03 + ((Math.sin(a * 0.7 + i) + 1) / 2) * 0.22, Math.cos(a * 1.3) * 0.04]}><sphereGeometry args={[0.005, 8, 6]} />{M.glow({ col: "#e8d86a", op: 0.85 })}</mesh>; })}
    {stalk(0.2, 0, "foil")}
    <mesh position={[0.2, 0.1, 0]} scale={[1, 1, 0.8]}><cylinderGeometry args={[0.055, 0.05, 0.18, 32]} /><Foil /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const ph = ((tt * 0.5 + rn(i, 4)) % 1);
      return <mesh key={i} position={[0.2 + (rn(i, 5) - 0.5) * 0.08 + Math.sin(ph * 6 + i) * 0.02, 0.12 + ph * 0.35, (rn(i, 6) - 0.5) * 0.06]}><sphereGeometry args={[0.005, 8, 6]} />{M.glow({ col: "#e8d86a", op: 0.85 * (1 - ph) })}</mesh>; })}
  </>;
}}</Scene3D>;
