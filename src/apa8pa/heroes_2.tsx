// MIO apa8pa · componentes únicos 5-14 min: bajo la nieve, la cadena de empleados gratis, y la estación en T medida por medida.
import React from "react";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn } from "./h3d";
import { Flag, SoilBlock, Sign } from "./farmkit";
import { Owl } from "./bkit";
import { CatPaw, DogNose, Hawk, I, Lawn, PI, Robin, Shingle, Snow, SnapTrap, Stick, Tee, Trunk, Vole } from "./akit";

type P_ = { t: number; h: H };

// ---- 5:24 · LAS BANDERAS SON EL MAPA: el patio de arriba, las tejas mordidas reciben bandera; las otras se apagan ----
export const HFlagsMap: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 3, 1]}
  cam={{ at: [0, 0, 0], az: [0.15, -0.15], el: [1.0, 0.82], r: [1.95, 1.62], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="THOSE FLAGS ARE YOUR MAP" col={AMB} />}>{(tt) => <>
  <Lawn />
  {Array.from({ length: 10 }, (_, i) => { const bit = [1, 3, 4, 8].includes(i), x = -1 + (i % 5) * 0.5 + (rn(i, 2) - 0.5) * 0.1, z = i < 5 ? -0.3 : 0.32, fg = phys(tt, 1.0 + i * 0.2, 6, 0.4), dead = eio(tt, 2.8, 3.4);
    return <group key={i}>
      <group position={[x, 0.008, z]} scale={bit ? 1 : Math.max(0.001, 1 - dead)}><Shingle s={0.65} /></group>
      {bit && <group position={[x + 0.13, 0.5 * (1 - fg), z]}><Flag p={[0, 0, 0]} tt={tt} i={i} s={1.3} /></group>}
    </group>; })}
</>}</Scene3D>;

// ---- 6:10 · EL ALTILLO BAJO LA NIEVE: corte; la nieve se apoya y por abajo se abre un hueco; arriba viento y sombra del halcón, abajo pasea tranquilo ----
export const HCrawlSpace: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.2, 2, 1.4]}
  cam={{ at: [0, 0.2, 0], az: [-0.1, 0.1], el: [0.05, 0.08], r: [1.62, 1.36], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="NO WIND. NO HAWK." col={TX} />}>{(tt) => {
  const sn = phys(tt, 0.2, 4, 0.75), gap = eio(tt, 1.5, 2.6), v = eio(tt, 2.3, 5.2), yb = 0.02 + 0.075 * gap;
  return <>
    <SoilBlock w={3.8} h={0.3} d={0.8} p={[0, 0, 0]} />
    <mesh position={[0, 0.07, -0.38]}><planeGeometry args={[3.8, 0.15]} /><meshBasicMaterial color="#26343f" /></mesh>
    <Snow s={[3.8, 0.12, 0.8]} p={[0, yb + 0.06 + 0.6 * (1 - sn), 0]} />
    <Vole p={[lerp(-0.7, 0.3, v), 0, 0.3]} s={0.62} walk={tt * 1.4} />
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[((tt * 1.2 + i * 0.2) % 3) - 1.5, 0.26 + rn(i, 2) * 0.12, 0.2]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0014, 0.0014, 0.12 + rn(i, 3) * 0.16, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.55} /></mesh>)}
    <Hawk p={[lerp(0.8, -0.4, eio(tt, 3.0, 5.4)), 0.36, 0.05]} rot={[0, PI, 0]} s={0.34} />
  </>;
}}</Scene3D>;

// ---- 6:56 · LA SAVIA QUE BAJA: gotas doradas bajan por la corteza, y en el anillo comido se frenan y se apagan ----
export const HGirdle: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 1.8, 1.2]}
  cam={{ at: [0, 0.55, 0], az: [0.3, -0.2], el: [0.08, 0.14], r: [1.3, 1.1], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="FOOD CAN'T REACH THE ROOTS" col={RED} />}>{(tt) => {
  const r = eio(tt, 0.6, 2.2);
  return <>
    <Lawn y={0} /><Trunk r={0.11} h={1.4} ring={r} band={0.2} y0={0.35} />
    {Array.from({ length: 24 }, (_, i) => { const a = i * 0.26, ph = (tt * 0.42 + i * 0.13) % 1, y0 = 1.3, sp = lerp(0.05, 0.58, r), y = Math.max(y0 - ph * 1.25, sp), st = y <= sp + 0.005 && r > 0.8, o = st ? 0.35 : 1;
      return <mesh key={i} position={[0.118 * Math.sin(a), y, 0.118 * Math.cos(a)]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.0105, 14, 10]} />{M.glow({ col: st ? "#ff7b52" : "#ffc95a", op: o })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 7:30 · ASOMA EN MARZO: la nieve baja como un telón y deja la banda blanca, una regla mide lo que da una mano ----
export const HMarchMelt: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2.2, 1.3]}
  cam={{ at: [0, 0.32, 0], az: [0.55, 0.12], el: [0.2, 0.14], r: [1.2, 0.94], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="A BAND A HAND HIGH" col={AMB} />}>{(tt) => {
  const m = eio(tt, 0.3, 2.4), R = phys(tt, 2.4, 6, 0.5);
  return <>
    <Lawn /><Trunk r={0.1} h={1.5} ring={1} band={0.22} y0={0.04} />
    <mesh position={[0, 0.34 * (1 - m), 0]} scale={[1, Math.max(0.03, 1 - m), 1]}><cylinderGeometry args={[1.3, 1.5, 0.68, 56]} /><meshPhysicalMaterial color="#eef3f8" roughness={0.8} /></mesh>
    <group position={[0.16, 0.14, 0.05]} scale={[1, Math.max(0.02, R), 1]}><RBox s={[0.022, 0.26, 0.006]} r={0.002}><meshStandardMaterial color="#e6c978" roughness={0.6} /></RBox>
      {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[-0.004, -0.12 + i * 0.024, 0.0035]}><planeGeometry args={[i % 2 ? 0.008 : 0.016, 0.002]} /><meshBasicMaterial color="#26221c" /></mesh>)}</group>
  </>;
}}</Scene3D>;

// ---- 9:06 · EMPLEADOS GRATIS: el halcón y la lechuza en la baranda, con el cartel de contratados ----
export const HHiredHand: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.8, 1.8, 1.4]}
  cam={{ at: [0, 0.48, 0], az: [-0.2, 0.22], el: [0.1, 0.05], r: [2.0, 1.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="YOUR BEST HIRED HAND" col={AMB} />}>{(tt) => {
  const h1 = phys(tt, 0.2, 6, 0.5), h2 = phys(tt, 0.7, 6, 0.5);
  return <>
    <Lawn />
    <RBox s={[0.1, 0.5, 0.1]} p={[-0.4, 0.2, 0.05]} r={0.012}>{M.wood({ base: [96, 72, 48] })}</RBox>
    <group position={[-0.4, 0.45 + 0.7 * (1 - h1), 0.05]}><Hawk s={1.2} rot={[0, 0.3, 0]} head={0.5 * Math.sin(tt * 1.1)} /></group>
    <group position={[0.34, 0.05 + 0.7 * (1 - h2), 0.08]}><RBox s={[0.24, 0.14, 0.2]} p={[0, 0.06, 0]} r={0.02}>{M.wood({ base: [120, 86, 52] })}</RBox><Owl p={[0, 0.13, 0]} rot={[0, -0.25, 0]} s={1.0} blink={Math.sin(tt * 2.1) > 0.96 ? 1 : 0} /></group>
    <Sign id="hh1" txt="HIRED" p={[0.02, 0.86, -0.1]} w={0.42} h={0.14} />
  </>;
}}</Scene3D>;

// ---- 10:35 · EL DESPIECE: la T desarmada en el aire y cada parte encaja: brazos, tee, tapas, chimenea ----
export const HPartsFly: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-1, 2, 1.3]}
  cam={{ at: [0, 0.18, 0], az: [-0.55, 0.35], el: [0.28, 0.2], r: [1.5, 1.2], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="THREE-INCH PIPE · 14-INCH ARMS" col={TX} />}>{(tt) => {
  const a = eio(tt, 0.3, 3.6), g = 1 - a;
  return <group position={[0, 0.2, 0]}>
    <Tee arm={14} capGone={g} riser={false} rot={[0, 0.2 * g, 0.02 * g]} />
    <group position={[0, 0.4 * g, 0]}><Tee arm={0} riser door={false} /></group>
  </group>;
}}</Scene3D>;

// ---- 10:51 · EN CAÑO DE DOS, SE TRANCA: dos cortes; en el chico la barra pega contra el techo, en el grande pasa limpia ----
export const HTwoInchJam: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" key1={[-1, 1.9, 1.4]}
  cam={{ at: [0, 0.04, 0], az: [0.14, -0.1], el: [0.5, 0.42], r: [0.84, 0.68], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.7} x={960} y={940} txt="TWO-INCH PIPE JAMS IT" col={RED} />}>{(tt) => {
  const s = eio(tt, 1.1, 1.24), sL = Math.min(s, 0.62), rr = (z: number, r: number) => <group position={[0, 0, z]}><Tee cut arm={7} riser={false} door={false} r={r} /></group>;
  return <>
    {rr(-0.13, 1.0 * I)}{rr(0.13, 1.5 * I)}
    <SnapTrap p={[0, 0.012, -0.13]} snap={1 - sL} s={1.0} />
    <SnapTrap p={[0, 0.012, 0.13]} snap={1 - s} s={1.0} />
    {s >= 0.61 && tt < 2 && <mesh position={[0, 0.1, -0.13]}><sphereGeometry args={[0.01 + 0.03 * (tt - 1.2), 16, 12]} />{M.glow({ col: "#ff6a4a", op: Math.max(0, 1 - (tt - 1.2) * 1.5) })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 11:42 · LA PUERTA: la tapa con el agujero; el topillo pasa, el petirrojo se choca, y la nariz del perro se frena en seco ----
export const HDoorSize: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 1.8, 1.2]}
  cam={{ at: [0.18, 0.05, 0], az: [0.98, 0.72], el: [0.18, 0.12], r: [0.9, 0.72], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="INCH AND A HALF" col={AMB} />}>{(tt) => {
  const v = eio(tt, 0.2, 1.6), rb = eio(tt, 1.8, 2.6) * (1 - 0.5 * eio(tt, 2.6, 3.1)), d = phys(tt, 3.3, 7, 0.45);
  return <>
    <Lawn />
    <Tee p={[-0.3, 0, 0]} arm={14} />
    {v < 1 && <Vole p={[lerp(0.6, 0.32, v), 0.0, 0]} rot={[0, PI, 0]} s={0.42} walk={tt * 2} />}
    <Robin p={[lerp(0.75, 0.37, rb) + 1.1 * eio(tt, 2.9, 3.4), 0, 0.03]} rot={[0, PI, 0]} s={0.9} />
    <DogNose p={[lerp(1.05, 0.44, d), 0.075, -0.02]} rot={[0, PI, 0]} s={0.66} />
  </>;
}}</Scene3D>;

// ---- 12:28 · TODO EL SECRETO ES EL PALITO: corte del caño; el palito empuja la trampa y los dedos nunca entran ----
export const HPaintStick: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" key1={[-1, 1.9, 1.3]}
  cam={{ at: [0.05, 0.05, 0], az: [0.08, -0.08], el: [0.32, 0.24], r: [0.92, 0.75], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="YOUR FINGERS NEVER GO IN" col={GRN} />}>{(tt) => {
  const p = eio(tt, 0.4, 3.0), x = lerp(0.56, 0.2, p);
  return <>
    <Tee cut arm={14} riser={false} p={[-0.18, 0, 0]} />
    <group position={[x, 0.016, 0]}><Stick p={[0.14, 0, 0]} mark /><SnapTrap p={[-0.03, 0.002, 0]} rot={[0, PI, 0]} /></group>
    <mesh position={[x + 0.34, 0.06, 0.012]} rotation={[0, 0, 0.5]} castShadow><capsuleGeometry args={[0.022, 0.13, 8, 16]} /><meshStandardMaterial color="#c79a7a" roughness={0.6} /></mesh>
  </>;
}}</Scene3D>;

// ---- 13:02 · LA PATA DEL GATO NO LLEGA: el brazo del caño abierto, la pata entra toda y se queda corta frente a la trampa ----
export const HCatArm: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" key1={[-1, 1.9, 1.3]}
  cam={{ at: [-0.03, 0.05, 0], az: [-0.1, 0.1], el: [0.2, 0.14], r: [0.98, 0.78], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.1} x={960} y={940} txt="OUT OF A CAT'S REACH" col={GRN} />}>{(tt) => {
  const r = phys(tt, 0.8, 4.2, 0.62);
  return <>
    <Tee cut arm={14} riser={false} door />
    <SnapTrap p={[-0.08, 0.012, 0]} s={1} snap={0} />
    <group position={[0.355, 0.03, 0]}><CatPaw rot={[0, PI, 0]} reach={r * 0.53} /></group>
    <mesh position={[0.12, 0.0015, 0.06]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.24, 0.006]} />{M.glow({ col: "#ffcf7a", op: eio(tt, 2.4, 3.0) })}</mesh>
  </>;
}}</Scene3D>;

// ---- 13:38 · UNA ARVEJA: al lado de la bola grande de maní, la arveja; la bola se va y queda la gota apretada en la madera ----
export const HPeaSize: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" key1={[-0.7, 1.4, 1]}
  cam={{ at: [0.02, 0.02, 0], az: [-0.5, -0.1], el: [0.42, 0.3], r: [0.44, 0.34], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="A PEA. THAT'S ALL." col={AMB} />}>{(tt) => {
  const g = eio(tt, 0.2, 0.8) * (1 - eio(tt, 1.9, 2.6)), d = eio(tt, 2.4, 3.0);
  return <>
    <SnapTrap s={2.5} />
    <mesh visible={g > 0.01} position={[0.08, 0.1, 0]} scale={[Math.max(0.01, 1.2 * g), Math.max(0.01, 0.72 * g), Math.max(0.01, 1.1 * g)]}><sphereGeometry args={[0.06, 32, 24]} />{M.grease({ col: "#b98238" })}</mesh>
    <mesh visible={d > 0.01} position={[0.075, 0.042, 0]} scale={[Math.max(0.01, d), Math.max(0.01, d * 0.62), Math.max(0.01, d)]}><sphereGeometry args={[0.018, 24, 16]} />{M.grease({ col: "#b98238" })}</mesh>
    <mesh position={[0.19, 0.016, 0.1]} castShadow><sphereGeometry args={[0.016, 24, 18]} /><meshStandardMaterial color="#5f9a3e" roughness={0.45} /></mesh>
  </>;
}}</Scene3D>;
