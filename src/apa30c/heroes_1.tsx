// apa30c · componentes únicos, minutos 0-9 (las señales y la comida: kit h3d + farmkit + ckit).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Rodent, SoilBlock, barnT, grassT, soilT } from "./farmkit";
import { NestBox, Feeder, Treadle, Coop, Hen } from "./ckit";

const PI = Math.PI;
const Grass: React.FC<{ w?: number; d?: number; dim?: number }> = ({ w = 3, d = 2, dim = 1 }) => <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={grassT()} color={new THREE.Color(1, 1, 1).multiplyScalar(dim).getStyle()} roughness={0.95} /></mesh>;
// boca de cueva: anillo de tierra removida y el hueco negro
const Burrow: React.FC<{ p: [number, number, number]; r?: number }> = ({ p, r = 0.05 }) => <group position={p}>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0]}><ringGeometry args={[r, r * 1.9, 28]} /><meshStandardMaterial map={soilT()} roughness={1} /></mesh>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.003, 0]}><circleGeometry args={[r, 28]} /><meshBasicMaterial color="#070503" /></mesh>
</group>;
export { Grass, Burrow };

// ---- 0:08 · TENDRÍAN QUE SER SIETE: el nido con siete huevos; uno a uno se van, y de los dos que quedan uno tiene el agujero ----
export const HNestSeven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#120e0a" key1={[-0.8, 1.6, 1.0]}
  cam={{ at: [0, 0.05, 0], az: [0.2, -0.1], el: [0.85, 0.7], r: [0.85, 0.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="SHOULD BE 7 · THERE WERE 2" col={RED} />}>{(tt) => {
  const eggs = 7 - Math.floor(5 * eio(tt, 0.6, 2.8));
  return <><NestBox eggs={eggs} bad={tt > 2.9 ? 0 : -1} />
    <pointLight position={[0.2, 0.5, 0.4]} intensity={1.2} distance={1.5} color="#ffd9a0" /></>;
}}</Scene3D>;

// ---- 0:25 · DEL AGUJERO AL COMEDERO: la boca de la cueva bajo el gallinero y un sendero apisonado que se dibuja derecho hasta el comedero ----
export const HHoleToFeeder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0e100b" key1={[-1.2, 2, 1]}
  cam={{ at: [0, 0.05, 0.1], az: [-0.3, 0.2], el: [0.85, 0.7], r: [1.7, 1.45], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="A HOLE · A PACKED PATH · TO THE FEED" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.6, 2.6);
  return <>
    <Grass />
    <Coop p={[-0.45, 0, -0.35]} s={0.8} />
    <Burrow p={[-0.12, 0, -0.08]} r={0.055} />
    {Array.from({ length: 30 }, (_, i) => { const u = i / 29; if (u > k) return null; const x = lerp(-0.12, 0.6, u), z = lerp(-0.08, 0.3, u) + 0.04 * Math.sin(u * 5);
      return <mesh key={i} position={[x, 0.002, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 14]} /><meshStandardMaterial color="#7a6244" roughness={1} /></mesh>; })}
    <Feeder p={[0.68, 0, 0.32]} s={0.8} />
  </>;
}}</Scene3D>;

// ---- 2:13 · ¿MIEL BAJO TIERRA?: corte del suelo; el nido de avispas es de papel gris en pisos, y el panal dorado de miel se tacha ----
export const HHoneyQ: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#120f0b" key1={[-0.7, 1.4, 1.2]}
  cam={{ at: [0, -0.1, 0], az: [0.25, -0.1], el: [0.15, 0.1], r: [1.1, 0.92], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="PAPER NEST · NO HONEY" col={AMB} />}>{(tt) => {
  const x = cl((tt - 1.6) * 2);
  return <>
    <SoilBlock w={1.3} h={0.42} d={0.5} p={[0, 0, -0.25]} />
    <group position={[-0.28, -0.2, 0.03]}>{[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0.07 - i * 0.045, 0]} scale={cl(phys(tt, 0.3 + i * 0.25, 7, 0.5))}><cylinderGeometry args={[0.1 - 0.012 * Math.abs(i - 1.5), 0.1 - 0.012 * Math.abs(i - 1.5), 0.025, 6]} /><meshStandardMaterial color="#9a958c" roughness={0.95} /></mesh>)}
      <mesh scale={[0.13, 0.13, 0.1]}><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#b5afa2" roughness={0.95} transparent opacity={0.35} /></mesh></group>
    <group position={[0.3, -0.2, 0.03]} scale={cl(phys(tt, 0.9, 7, 0.5))}>
      {/* frasco de miel de verdad: vidrio, miel ámbar, tapa a cuadros */}
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.13, 32]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.056, 0.056, 0.1, 32]} /><meshPhysicalMaterial color="#d98a14" roughness={0.15} clearcoat={1} transmission={0.2} /></mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.064, 0.064, 0.022, 32]} /><meshStandardMaterial color="#b8322a" roughness={0.6} /></mesh>
      {[1, -1].map((sd) => <mesh key={sd} position={[0, 0, 0.08]} rotation={[0, 0, sd * PI / 4]}><planeGeometry args={[0.26 * x, 0.02]} /><meshBasicMaterial color="#ff5a4a" /></mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 3:06 · CUATRO DÍAS O DOS: dos comederos iguales; el de antes baja despacio, el de ahora se vacía al doble de velocidad ----
export const HFeedGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.18, 0], az: [0.1, -0.1], el: [0.25, 0.2], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.2} x={600} y={930} txt="USED TO: 4 DAYS" col={TX} /><Tag tt={tt} at={1.5} x={1320} y={930} txt="NOW: 2 DAYS" col="#ff8a6a" /></>}>{(tt) => {
  const k = eio(tt, 0.6, 3.6);
  return <><Feeder p={[-0.25, 0, 0]} fill={1 - 0.5 * k} /><Feeder p={[0.25, 0, 0]} fill={1 - k} /></>;
}}</Scene3D>;

// ---- 3:40 · EL SENDERO DE OVEJA EN MINIATURA: de noche, desde arriba, la rata corre siempre por la misma huella gastada en el pasto ----
export const HSheepTrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#06070a" warm={0.35} key1={[-0.8, 2, 0.6]}
  cam={{ at: [0, 0, 0], az: [0.5, 0.2], el: [1.1, 0.95], r: [1.5, 1.3], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="SAME TRAIL · EVERY NIGHT" col={TX} />}>{(tt) => {
  const P = (u: number) => [lerp(-0.6, 0.6, u), 0, 0.25 * Math.sin(u * PI * 1.6) - 0.05] as [number, number, number];
  const u = (tt * 0.32) % 1, [x, , z] = P(u), [x2, , z2] = P(Math.min(1, u + 0.02));
  return <>
    <Grass dim={0.55} />
    {Array.from({ length: 50 }, (_, i) => { const [a, , b] = P(i / 49); return <mesh key={i} position={[a, 0.002, b]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03, 12]} /><meshStandardMaterial color="#5a4a36" roughness={1} /></mesh>; })}
    <Burrow p={[-0.62, 0, -0.05]} />
    <Feeder p={[0.68, 0, -0.05]} s={0.6} />
    <Rodent rat p={[x, 0, z]} rot={[0, Math.atan2(x2 - x, z2 - z), 0]} s={1.4} walk={tt * 2} />
    <pointLight position={[0, 1.2, 0.4]} intensity={0.9} distance={2.5} color="#9fb2e8" />
  </>;
}}</Scene3D>;

// ---- 3:51 · LA DE RATA ES GORDA Y ROMA: sobre una regla, la bosta de rata de tres cuartos de pulgada al lado de la de ratón, chica y en punta ----
export const HDropSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15120e" key1={[-0.5, 1.2, 1]}
  cam={{ at: [0, 0.01, 0], az: [0.15, -0.1], el: [0.95, 0.8], r: [0.4, 0.33], fov: 28 }}
  over={(tt) => <><Tag tt={tt} at={1.4} x={640} y={930} txt="RAT · ¾ IN · BLUNT" col={AMB} /><Tag tt={tt} at={2.4} x={1300} y={930} txt="MOUSE · SMALL · POINTY" col={TX} /></>}>{(tt) => <>
  <RBox s={[0.4, 0.004, 0.06]} p={[0, 0.002, -0.06]} r={0.001}><meshStandardMaterial map={tex.wood(1, 1, [214, 180, 110])} roughness={0.7} /></RBox>
  {Array.from({ length: 17 }, (_, i) => <mesh key={i} position={[-0.19 + i * 0.0238, 0.0045, -0.045]}><boxGeometry args={[0.0012, 0.0005, i % 4 === 0 ? 0.03 : 0.015]} /><meshBasicMaterial color="#2a1a0c" /></mesh>)}
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.001, 0]}><planeGeometry args={[1.2, 0.8]} /><meshStandardMaterial map={tex.wood(3, 2, [176, 140, 96])} roughness={0.85} /></mesh>
  {[0, 1, 2].map((i) => <mesh key={i} position={[-0.12 + i * 0.035, 0.009, 0.02 + 0.01 * i]} rotation={[0, 0.3 * i, PI / 2]} scale={cl(phys(tt, 0.4 + i * 0.15, 7, 0.5))}><capsuleGeometry args={[0.0095, 0.008, 6, 12]} /><meshStandardMaterial color="#2a1e14" roughness={0.75} /></mesh>)}
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.08 + i * 0.02, 0.003, 0.02 + 0.008 * i]} rotation={[0, 0.4 * i, PI / 2]} scale={[0.6, 1, 0.6].map((v) => v * cl(phys(tt, 1.6 + i * 0.12, 7, 0.5))) as [number, number, number]}><capsuleGeometry args={[0.0045, 0.013, 4, 10]} /><meshStandardMaterial color="#2a1e14" roughness={0.75} /></mesh>)}
</>}</Scene3D>;

// ---- 4:12 · ESQUINAS ROÍDAS: la esquina de la puerta del gallinero; aparecen las mordidas y saltan las astillas ----
export const HGnawCorner: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#12100d" key1={[-0.6, 1.2, 1.2]}
  cam={{ at: [0.05, 0.1, 0], az: [-0.35, -0.15], el: [0.2, 0.15], r: [0.55, 0.46], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="GNAWED CORNERS · BOTTOM EDGES" col={TX} />}>{(tt) => {
  const g = eio(tt, 0.5, 2.6);
  return <>
    <RBox s={[0.5, 0.4, 0.03]} p={[-0.1, 0.2, 0]} r={0.003}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <RBox s={[0.03, 0.4, 0.3]} p={[0.15, 0.2, 0.135]} r={0.003}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    {Array.from({ length: 9 }, (_, i) => cl(g * 9 - i) > 0 && <mesh key={i} position={[0.135, 0.02 + 0.012 * i + 0.006 * rn(i, 1), 0.016]} rotation={[0, 0, 0.4]} scale={cl(g * 9 - i)}>
      <sphereGeometry args={[0.026 + 0.01 * rn(i, 2), 10, 8]} /><meshStandardMaterial color="#f0d6a6" roughness={0.9} /></mesh>)}
    {Array.from({ length: 16 }, (_, i) => { const k = cl((tt - 0.6 - i * 0.12) / 0.7); return k > 0 && k < 1 && <mesh key={i} position={[0.13 + 0.12 * k * rn(i, 3), 0.06 + 0.1 * k - 0.16 * k * k, 0.03 + 0.15 * k * rn(i, 4)]} rotation={[k * 6, k * 4, 0]}>
      <boxGeometry args={[0.024, 0.005, 0.012]} /><meshStandardMaterial color="#e8c894" /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:43 · SI LO VES DE DÍA, HAY MUCHAS: arriba una rata al sol; la cámara baja por el corte del suelo y abajo están todas las demás ----
export const HDaytime: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0e100b" key1={[-1, 2, 1]}
  cam={{ at: [0, -0.05, 0], az: [0.3, 0.1], el: [0.45, -0.05], r: [1.2, 1.0], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="SEE ONE BY DAY = MANY MORE BELOW" col={RED} />}>{(tt) => <>
  <SoilBlock w={1.4} h={0.45} d={0.6} p={[0, 0, -0.3]} />
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, -0.3]}><planeGeometry args={[1.4, 0.6]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
  <Rodent rat p={[0.05, 0, -0.15]} rot={[0, 0.6, 0]} s={1.4} walk={tt} />
  {Array.from({ length: 12 }, (_, i) => <Rodent key={i} rat p={[-0.55 + (i % 6) * 0.22, -0.32 + 0.12 * Math.floor(i / 6), 0.02]} rot={[0, 1.4 + 0.5 * rn(i, 2), 0]} s={1.1 * cl(phys(tt, 0.8 + i * 0.12, 7, 0.5))} walk={tt + i} />)}
  <directionalLight position={[1, 2, 1]} intensity={0.8} color="#fff1d0" />
</>}</Scene3D>;

// ---- 5:18 · DÍAS ANDANDO, CADA VEZ MÁS LENTO: el sol cruza cinco veces; la rata camina cada vez más despacio y más gris, presa fácil ----
export const HSlowDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0d0f0b" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.05, 0], az: [-0.2, 0.15], el: [0.3, 0.22], r: [1.2, 1.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="BLOOD THINNER · LIVES FOR DAYS · EASY PREY" col={AMB} />}>{(tt) => {
  const d = Math.min(4, Math.floor(tt / 0.8)), sp = 1 - d * 0.2, x = -0.5 + 0.9 * cl(tt / 4) ** 0.8;
  return <>
    <Grass dim={0.8} />
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.5 + i * 0.25, 0.5, -0.4]}><sphereGeometry args={[0.03, 20, 14]} />{M.glow({ col: "#ffcf7a", op: i <= d ? 0.95 : 0.15 })}</mesh>)}
    <Rodent rat p={[x, 0, 0.05]} rot={[0, PI / 2, 0.15 * d]} s={1.4} walk={tt * sp} />
  </>;
}}</Scene3D>;

// ---- 6:35 · SIN CENA NO SE QUEDA: el alimento derramado bajo el comedero se levanta grano a grano y la rata da media vuelta ----
export const HSupper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.12, 0], az: [0.4, 0.2], el: [0.4, 0.3], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="NO SUPPER · NO REASON TO STAY" col={GRN} />}>{(tt) => {
  const c = eio(tt, 0.6, 2.2), go = eio(tt, 2.3, 3.5);
  return <>
    <Feeder p={[-0.15, 0, 0]} fill={0.6} />
    {Array.from({ length: 60 }, (_, i) => rn(i, 9) > c && <mesh key={i} position={[-0.15 + (rn(i, 1) - 0.5) * 0.5, 0.004, 0.1 + rn(i, 2) * 0.2]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color="#c9a45a" /></mesh>)}
    <Rodent rat p={[0.2 + 0.35 * go, 0, 0.2]} rot={[0, -PI / 2 + PI * go, 0]} s={1.4} walk={tt * (go > 0 ? 2 : 0.6)} />
  </>;
}}</Scene3D>;

// ---- 7:08 · EL COMEDERO SALE AL ATARDECER: la luz se pone naranja y azul, las gallinas ya están en la percha y el comedero se va por la puerta ----
export const HDuskFeeder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.6} key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.25, 0], az: [-0.35, -0.1], el: [0.3, 0.22], r: [1.2, 1.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="HENS GO UP · FEEDER GOES OUT" col={AMB} />}>{(tt) => {
  const dusk = eio(tt, 0.2, 2.0), out = eio(tt, 1.6, 3.4);
  return <>
    <RBox s={[0.9, 0.025, 0.025]} p={[0, 0.45, -0.25]} r={0.005}>{M.wood({ base: [120, 80, 46] })}</RBox>
    {[-0.25, 0, 0.25].map((x, i) => <Hen key={i} p={[x, 0.46 - 0.4 * (1 - cl(phys(tt, 0.3 + i * 0.3, 6, 0.5))), -0.25]} s={1.1} />)}
    <Feeder p={[0.1 + 0.8 * out, 0.15 * Math.sin(out * PI), 0.15]} />
    <pointLight position={[1.2, 0.5, 0.6]} intensity={2.2 * (1 - dusk) + 0.4} distance={3} color={new THREE.Color("#ffb060").lerp(new THREE.Color("#6a7ac8"), dusk).getStyle()} />
  </>;
}}</Scene3D>;

// ---- 7:40 · EL COMEDERO A PEDAL: la gallina pisa el escalón, la varilla sube la tapa y come; se baja y la tapa cae ----
export const HTreadle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.15, 0.1], az: [0.7, 0.45], el: [0.3, 0.22], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="HEN STEPS ON · LID OPENS" col={GRN} />}>{(tt) => {
  const on = eio(tt, 0.6, 1.2) * (1 - eio(tt, 3.0, 3.6)), st = phys(tt, 1.0, 7, 0.5) * (1 - eio(tt, 3.0, 3.4));
  return <><Treadle step={cl(st)} />
    <Hen p={[0, 0.03 * on - 0.025 * cl(st), 0.24 + 0.4 * (1 - on)]} rot={[0, PI, 0]} s={1.3} peck={Math.max(0, Math.sin(tt * 5)) * on} /></>;
}}</Scene3D>;

// ---- 7:57 · MEDIA LIBRA CONTRA CINCO: la rata sube al escalón y no pasa nada; sube la gallina y la tapa se abre ----
export const HWeighs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.12, 0.15], az: [-0.7, -0.45], el: [0.3, 0.22], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.0} x={620} y={150} txt="RAT ½ LB · SHUT" col={RED} /><Tag tt={tt} at={2.8} x={1320} y={150} txt="HEN 5 LB · OPEN" col={GRN} /></>}>{(tt) => {
  const rat = eio(tt, 0.3, 0.9), off = eio(tt, 1.8, 2.3), hen = eio(tt, 2.3, 2.9), st = cl(phys(tt, 2.8, 7, 0.5));
  return <><Treadle step={st} />
    {rat > 0.01 && <Rodent rat p={[0.02 - 0.32 * off, 0.05 * (1 - off), 0.24 + 0.3 * (1 - rat) + 0.08 * off]} rot={[0, PI - 1.2 * off, 0]} s={1.3} walk={tt} />}
    {hen > 0.01 && <Hen p={[0, 0.04 - 0.025 * st, 0.24 + 0.4 * (1 - hen)]} rot={[0, PI, 0]} s={1.3} />}</>;
}}</Scene3D>;

// ---- 8:44 · LA TAPA CALZADA: un palito tiene la tapa abierta los primeros días; las gallinas comen y aprenden; después se saca ----
export const HPropOpen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.15, 0.1], az: [0.35, 0.2], el: [0.35, 0.28], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="PROP IT OPEN · THE FIRST FEW DAYS" col={AMB} />}>{(tt) => {
  const pr = tt < 3.0 ? 1 : 1 - eio(tt, 3.0, 3.6) * 0.5;
  return <><Treadle prop={pr} />
    {[-0.24, 0.26].map((x, i) => <Hen key={i} p={[x, 0, 0.34]} rot={[0, PI + (i ? -0.5 : 0.5), 0]} s={1.0} peck={Math.max(0, Math.sin(tt * 4 + i * 2))} />)}</>;
}}</Scene3D>;
