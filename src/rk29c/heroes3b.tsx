// rk29c · componentes 3D 16-30 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// Lección EVALUADOR rk29b r1: objetos GRANDES en cuadro, cámara cerca, sin halos rojos ni emisivos que quemen.
import React from "react";
import { H, Stage } from "./hkit";
import { Studio, Wall3, RB, Mat, sm, spr, c01, rnd, useTex3 } from "./studio3d";
import { AMB, RED, GRN, useTxt, Person3, Hand3, Arrow3 } from "./lock3d";
import { Safe3, Slab3, Peg3, Dolly3, Box3 } from "./garage3d";

type P = { t: number; h: H };

// herramientas sueltas (palanca, maza, amoladora)
export const Bar3: React.FC<{ p?: [number, number, number]; rot?: [number, number, number]; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.025, 0.025, 0.8, 12]} /><Mat c="#b8302a" m={0.6} r={0.35} /></mesh>
  <mesh position={[0.05, 0.82, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.022, 0.012, 0.16, 10]} /><Mat c="#b8302a" m={0.6} r={0.35} /></mesh>
</group>;
export const Sledge3: React.FC<{ p?: [number, number, number]; rot?: [number, number, number]; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.022, 0.026, 0.7, 12]} /><Mat c="#c89a5a" r={0.7} /></mesh>
  <RB p={[0, 0.74, 0]} s={[0.28, 0.12, 0.12]} rad={0.02} c="#2a2c31" m={0.8} r={0.4} />
</group>;
export const Grinder3: React.FC<{ p?: [number, number, number]; rot?: [number, number, number]; s?: number; spin?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, spin = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.07, 0.38, 20]} /><Mat c="#2f6fb0" r={0.5} /></mesh>
  <group position={[0.22, 0, 0]} rotation={[spin, 0, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.14, 0.14, 0.012, 40]} /><Mat c="#8a8f96" m={0.9} r={0.3} /></mesh></group>
</group>;
export const House3: React.FC<{ p?: [number, number, number]; s?: number; col?: string; dim?: number }> = ({ p = [0, 0, 0], s = 1, col = "#e8dcc6", dim = 0 }) => <group position={p} scale={s}>
  <RB p={[0, 0.4, 0]} s={[1.0, 0.8, 0.9]} rad={0.02} c={col} r={0.9} />
  <mesh position={[0, 0.98, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.78, 0.4, 4]} /><Mat c="#6a3a2e" r={0.85} /></mesh>
  <RB p={[0.18, 0.28, 0.452]} s={[0.5, 0.52, 0.02]} rad={0.004} c={dim > 0.5 ? "#55524c" : "#c8c2b4"} r={0.6} />
</group>;

// 16 · el taller del ladrón: diez pasos entre el tablero y la caja; las huellas se pintan de a una con un número que sube
export const H3Workshop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const n = Math.min(10, Math.floor(c01((tt - 0.8) / 5.0) * 10.99));
  const num = useTxt([`${n}`], 256, 256, "#00000000", "#f6f3ec", 190, "Arial Black");
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 3.0, 3.2], l: [0, 0.3, -0.4], fov: 42 }, { t: 10, p: [0.6, 2.7, 2.8], l: [0.3, 0.3, -0.3], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -1.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Peg3 p={[-1.2, 1.3, -1.82]} />
    <Safe3 p={[1.4, 0, -0.2]} rot={[0, -0.5, 0]} s={0.8} />
    {[...Array(10)].map((_, i) => { const k = i / 9, x = -1.1 + 2.2 * k, z = -1.3 + 1.0 * Math.sin(Math.PI * k) + (i % 2 ? 0.12 : -0.12); return i < n ? <mesh key={i} position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, -0.5 + k]}><planeGeometry args={[0.12, 0.26]} /><meshStandardMaterial color="#2a2016" roughness={1} transparent opacity={0.85} /></mesh> : null; })}
    <mesh position={[0, 1.2, -0.2]}><planeGeometry args={[0.7, 0.7]} /><meshBasicMaterial map={num} transparent /></mesh>
  </Studio>;
}}</Stage>;

// 17 · para un ladrón son llaves: palanca, maza y amoladora giran y se funden en tres siluetas de llave doradas
export const H3Toolkeys: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const m = sm(tt, 2.2, 3.6);
  const Key = ({ x }: { x: number }) => <group position={[x, 1.0, 0]} scale={m}>
    <mesh position={[0, 0.25, 0]}><torusGeometry args={[0.13, 0.04, 12, 32]} /><Mat c="#d4a84a" m={1} r={0.25} /></mesh>
    <RB p={[0, -0.1, 0]} s={[0.06, 0.55, 0.04]} rad={0.01} c="#d4a84a" m={1} r={0.25} />
    {[0, 1, 2].map((j) => <RB key={j} p={[0.06, -0.3 + j * 0.09, 0]} s={[0.07, 0.04, 0.04]} rad={0.005} c="#d4a84a" m={1} r={0.25} />)}
  </group>;
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 1.15, 2.6], l: [0, 1.0, 0], fov: 38 }, { t: 10, p: [0.4, 1.1, 2.3], l: [0.1, 1.0, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="brick" />
    <group scale={1 - m} position={[0, 0.6, 0]}>
      <Bar3 p={[-0.7, 0, 0]} rot={[0, 0, 0.2 + tt]} />
      <Sledge3 p={[0, 0, 0]} rot={[0, 0, -0.2 - tt * 0.8]} />
      <Grinder3 p={[0.7, 0.4, 0]} rot={[0, 0, tt * 0.6]} spin={tt * 20} />
    </group>
    {[-0.7, 0, 0.7].map((x, i) => <Key key={i} x={x} />)}
  </Studio>;
}}</Stage>;

// 18 · la cadena larga: la cadena se enhebra en la palanca, la escalera y el cortapernos y un candado grande se cierra
export const H3Chainloop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = sm(tt, 0.6, 4.4), shut = sm(tt, 4.6, 5.2);
  const links = 36, shown = Math.floor(links * k);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 1.3, 2.7], l: [0, 0.9, 0], fov: 40 }, { t: 10, p: [0.5, 1.2, 2.4], l: [0.2, 0.85, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.5]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[-0.8, 0, -0.3]}><mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.03, 0.03, 1.8, 10]} /><Mat c="#c9ced4" m={0.8} r={0.3} /></mesh><mesh position={[0.4, 0.9, 0]}><cylinderGeometry args={[0.03, 0.03, 1.8, 10]} /><Mat c="#c9ced4" m={0.8} r={0.3} /></mesh>{[0.3, 0.7, 1.1, 1.5].map((y, i) => <RB key={i} p={[0.2, y, 0]} s={[0.4, 0.03, 0.05]} rad={0.005} c="#c9ced4" m={0.8} r={0.3} />)}</group>
    <Bar3 p={[0.2, 0.0, -0.25]} rot={[0, 0, 0.15]} s={1.3} />
    <group position={[0.8, 0.5, -0.25]} rotation={[0, 0, 0.3]}><mesh><cylinderGeometry args={[0.025, 0.025, 0.9, 10]} /><Mat c="#d8a030" r={0.4} /></mesh><RB p={[0, 0.5, 0]} s={[0.1, 0.12, 0.05]} rad={0.01} c="#2a2c31" m={0.8} r={0.3} /></group>
    {[...Array(shown)].map((_, i) => { const u = i / links, x = -1.0 + 2.0 * u, y = 0.8 + 0.25 * Math.sin(u * Math.PI * 3), z = -0.05 + 0.15 * Math.cos(u * Math.PI * 3); return <mesh key={i} position={[x, y, z]} rotation={[i % 2 ? Math.PI / 2 : 0, 0, Math.PI / 2]}><torusGeometry args={[0.03, 0.009, 6, 14]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>; })}
    {k > 0.95 && <group position={[1.05, 0.65, 0.05]} scale={1.4}>
      <RB p={[0, 0, 0]} s={[0.16, 0.14, 0.06]} rad={0.02} c="#d4a84a" m={1} r={0.25} />
      <mesh position={[0, 0.09 + 0.04 * (1 - shut), 0]}><torusGeometry args={[0.05, 0.012, 8, 20, Math.PI]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
    </group>}
  </Studio>;
}}</Stage>;

// 19 · cuatro casas sobre el camino: de tres salen volando caja, generador y herramientas; de la suya, una bolsa de tierra
export const H3Fourhouses: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 2.4, 4.2], l: [0, 0.6, 0], fov: 42 }, { t: 10, p: [0.5, 2.1, 3.8], l: [0.2, 0.6, 0], arc: 0.03 }]}>
    <RB p={[0, 0.005, 1.0]} s={[6, 0.01, 0.8]} rad={0.002} c="#3a3c40" r={0.9} />
    {[-1.65, -0.55, 0.55, 1.65].map((x, i) => {
      const k = sm(tt, 1.0 + i * 1.0, 2.2 + i * 1.0), mine = i === 3;
      return <group key={i}>
        <House3 p={[x, 0, -0.4]} s={0.9} col={mine ? "#f0e4c8" : "#d8ccb6"} dim={!mine && k > 0.6 ? 1 : 0} />
        <group position={[x + 0.15, 0.25 + 0.6 * Math.sin(Math.PI * k), 0.1 + 0.9 * k]} scale={0.55}>
          {mine ? <RB p={[0, 0.15, 0]} s={[0.45, 0.3, 0.3]} rad={0.08} c="#6a5a3a" r={1} /> : i === 0 ? <Safe3 s={0.55} /> : i === 1 ? <group><RB p={[0, 0.25, 0]} s={[0.6, 0.45, 0.4]} rad={0.03} c="#d8a030" r={0.5} /><RB p={[0, 0.25, 0]} s={[0.62, 0.3, 0.3]} rad={0.02} c="#2a2c31" r={0.5} /></group> : <Box3 p={[0, 0, 0]} s={[0.55, 0.35, 0.4]} open={0.4} />}
        </group>
      </group>;
    })}
  </Studio>;
}}</Stage>;

// 20 · el camino de vuelta a la camioneta: cada viaje suma minutos y en las ventanas vecinas se prenden caras
export const H3Truckwalk: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const trips = Math.min(4, Math.floor(c01((tt - 0.5) / 6) * 4.99)), u = ((tt - 0.5) % 1.5) / 1.5, back = Math.floor((tt - 0.5) / 0.75) % 2;
  const px = back ? 1.4 - 2.8 * c01(u * 2 - 1) : -1.4 + 2.8 * c01(u * 2);
  const clock = useTxt([`+${trips * 3} min`], 512, 160, "#151515", AMB, 110, "Courier New");
  return <Studio tt={tt} floor="concrete" night={0.8} photo={0} bg="#08080c" keys={[{ t: 0, p: [0, 1.8, 4.0], l: [0, 0.8, 0], fov: 42 }, { t: 10, p: [0.4, 1.6, 3.6], l: [0.1, 0.8, 0], arc: 0.03 }]}>
    <House3 p={[-1.8, 0, -1.0]} s={1.3} />
    <group position={[1.9, 0, -0.3]} rotation={[0, -0.3, 0]}><RB p={[0, 0.5, 0]} s={[1.6, 0.6, 0.8]} rad={0.08} c="#2a3a4e" r={0.4} m={0.3} /><RB p={[-0.3, 0.95, 0]} s={[0.7, 0.4, 0.78]} rad={0.08} c="#2a3a4e" r={0.4} m={0.3} /></group>
    {[-0.6, 0.4].map((x, i) => <group key={i} position={[x, 0, -2.0]}><RB p={[0, 0.8, 0]} s={[0.9, 1.6, 0.4]} rad={0.02} c="#3a3630" r={0.9} /><mesh position={[0, 1.05, 0.205]}><planeGeometry args={[0.4, 0.35]} /><meshBasicMaterial color={trips > i + 1 ? "#ffd29f" : "#1a1a20"} toneMapped={false} /></mesh>{trips > i + 1 && <mesh position={[0, 1.02, 0.21]}><circleGeometry args={[0.07, 20]} /><meshBasicMaterial color="#3a2a1e" /></mesh>}</group>)}
    <Person3 p={[px, 0, 0.4]} yaw={back ? -Math.PI / 2 : Math.PI / 2} s={0.9} col="#1a1c22" step={tt * 6} />
    <mesh position={[0, 2.0, -0.5]}><planeGeometry args={[1.1, 0.34]} /><meshBasicMaterial map={clock} toneMapped={false} /></mesh>
  </Studio>;
}}</Stage>;

// 21 · la caja vista de arriba: cuatro flechas de ataque; suben dos paredes y dos flechas chocan
export const H3Cornertop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const walls = sm(tt, 2.0, 3.4), sl = sm(tt, 0.8, 2.0);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0, 3.4, 1.2], l: [0, 0, 0], fov: 40 }, { t: 10, p: [0.4, 3.1, 1.1], l: [0, 0, 0], arc: 0.03 }]}>
    <Safe3 p={[0, 0, 0]} s={0.9} />
    {[[0, -1, 0], [1, 0, -Math.PI / 2], [0, 1, Math.PI], [-1, 0, Math.PI / 2]].map(([x, z, r], i) => { const blocked = i < 2 && walls > 0.5; const d = blocked ? 0.75 : 1.2 - 0.3 * sl; return <Arrow3 key={i} p={[x * d, 0.5, z * d]} rot={[-Math.PI / 2, 0, r + Math.PI]} L={0.55} col={blocked ? "#5a5a5a" : RED} />; })}
    <RB p={[0, 0.6 * walls, -0.55]} s={[2.4, 1.2 * walls + 0.001, 0.1]} rad={0.005} c="#d8d2c4" r={0.9} />
    <RB p={[0.55, 0.6 * walls, 0]} s={[0.1, 1.2 * walls + 0.001, 2.4]} rad={0.005} c="#d8d2c4" r={0.9} />
  </Studio>;
}}</Stage>;

// 22 · el lugar para atacar: palanca atrás, empujón, maza al costado, carrito abajo; la caja va a la esquina y cada herramienta cae al piso
export const H3Attackroom: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const go = sm(tt, 2.4, 3.6), cx = 0.9 * go, cz = -0.6 * go;
  const fall = (i: number) => sm(tt, 3.8 + i * 0.4, 4.3 + i * 0.4);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [-1.0, 1.7, 2.6], l: [0.2, 0.4, -0.3], fov: 42 }, { t: 10, p: [-0.6, 1.6, 2.3], l: [0.4, 0.4, -0.4], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -1.35]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Wall3 p={[1.7, 1.6, 0]} rot={[0, Math.PI / 2, 0]} s={[3, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[cx, 0, cz]} s={0.75} bolts={go} />
    <group rotation={[0, 0, -1.4 * fall(0)]} position={[cx - 0.2, 0.05, cz - 0.4]}><Bar3 s={1.2} /></group>
    <group rotation={[0, 0, 1.4 * fall(1)]} position={[cx + 0.45, 0.05, cz]}><Sledge3 s={1.2} /></group>
    <group position={[cx - 0.6 - 0.3 * fall(2), 0, cz + 0.2]} rotation={[0, 0, 0.9 * fall(2)]}><Dolly3 s={0.75} tilt={0.3} /></group>
    {go < 0.5 && <group position={[cx - 0.75, 1.0, cz]}><Arrow3 rot={[0, 0, -Math.PI / 2]} L={0.4} col={RED} /></group>}
  </Studio>;
}}</Stage>;

// 23 · las marcas: rayones que se dibujan solos sobre el canto y el piso; la caja no se movió ni una pulgada
export const H3Gouges: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = c01((tt - 0.6) / 4.5);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0.9, 0.85, 1.4], l: [0, 0.35, 0], fov: 38 }, { t: 10, p: [1.1, 0.7, 1.15], l: [0.05, 0.3, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[0, 0, 0]} s={0.8} bolts={1} />
    {[...Array(14)].map((_, i) => { const on = c01(k * 14 - i); const y = 0.1 + rnd(i) * 0.65, onFloor = i > 8; return on > 0 ? <mesh key={i} position={onFloor ? [0.35 + rnd(i, 2) * 0.4, 0.003, 0.3 + rnd(i, 3) * 0.3] : [0.282, y, -0.1 + rnd(i, 2) * 0.3]} rotation={onFloor ? [-Math.PI / 2, 0, rnd(i, 4) * 3] : [0, Math.PI / 2, -0.4 + rnd(i, 4) * 0.8]}><planeGeometry args={[0.2 * on, 0.008]} /><meshBasicMaterial color="#e8e8ea" /></mesh> : null; })}
    {[0, 1].map((i) => <mesh key={i} position={[-0.33 + i * 0.66, 0.004, 0.4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.1]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>)}
  </Studio>;
}}</Stage>;

// 24 · el mueble se arma alrededor: laterales, tapa y puertas caen con peso y la caja desaparece adentro
export const H3Cabwrap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const t3 = useTex3();
  const d = (i: number) => 1 - spr(tt, 1.0 + i * 0.6, 8, 0.5);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0.9, 1.2, 2.2], l: [0, 0.5, 0], fov: 40 }, { t: 10, p: [1.2, 1.1, 1.9], l: [0.1, 0.5, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[0, 0, 0]} s={0.7} />
    <RB p={[-0.32, 0.45 + 1.5 * d(0), 0]} s={[0.04, 0.9, 0.55]} rad={0.004} c="#fff" r={0.8} map={t3.wood} />
    <RB p={[0.32, 0.45 + 1.5 * d(1), 0]} s={[0.04, 0.9, 0.55]} rad={0.004} c="#fff" r={0.8} map={t3.wood} />
    <RB p={[0, 0.92 + 1.5 * d(2), 0]} s={[0.7, 0.04, 0.6]} rad={0.004} c="#fff" r={0.8} map={t3.wood} />
    {[-1, 1].map((sd, i) => <RB key={i} p={[sd * 0.155, 0.45 + 1.5 * d(3 + i), 0.29]} s={[0.3, 0.88, 0.03]} rad={0.004} c="#e8d4b0" r={0.8} map={t3.wood} />)}
    {[-1, 1].map((sd, i) => <RB key={"k" + i} p={[sd * 0.03, 0.55 + 1.5 * d(4), 0.31]} s={[0.015, 0.1, 0.015]} rad={0.005} c="#2a2c31" m={0.8} r={0.3} />)}
  </Studio>;
}}</Stage>;

// 25 · rayos X: el mueble y la caja se vuelven fantasma y lo único sólido son los cuatro pernos hundidos en el concreto
export const H3Xraybolts: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const t3 = useTex3(), g = sm(tt, 1.0, 2.6);
  return <Studio tt={tt} floor="none" night={0.4 * g} photo={0} bg="#0a0d12" keys={[{ t: 0, p: [1.1, 0.9, 2.0], l: [0, 0.2, 0], fov: 40 }, { t: 10, p: [1.3, 0.6, 1.7], l: [0, 0.0, 0], arc: 0.03 }]}>
    <Slab3 p={[0, -0.25, 0]} s={[2.4, 0.5, 1.6]} cut />
    <mesh position={[0, -0.25, 0]}><boxGeometry args={[2.41, 0.5, 1.61]} /><meshStandardMaterial color="#9a978f" transparent opacity={1 - 0.7 * g} roughness={0.95} /></mesh>
    <Safe3 p={[0, 0, 0]} s={0.75} ghost={g} />
    <group position={[0, 0.39, 0]}><RB s={[0.6, 0.8, 0.55]} rad={0.004} c="#fff" r={0.8} map={t3.wood} op={1 - 0.9 * g} /></group>
    {[[-0.21, -0.19], [0.21, -0.19], [-0.21, 0.19], [0.21, 0.19]].map(([x, z], i) => <mesh key={i} position={[x, -0.12, z]}><cylinderGeometry args={[0.03, 0.03, 0.36, 14]} /><meshStandardMaterial color="#d4a84a" metalness={1} roughness={0.25} /></mesh>)}
  </Studio>;
}}</Stage>;

// 26 · derecho contra torcido: dos agujeros en corte; tiran de los dos pernos y el torcido sale con la cuña rota
export const H3Straighthole: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const pull = sm(tt, 2.6, 3.6), out = sm(tt, 3.6, 4.6);
  const Bolt = ({ x, tilt, fails }: { x: number; tilt: number; fails: boolean }) => <group position={[x, 0.1 + (fails ? 0.9 * out : 0.02 * pull), 0.25]} rotation={[0, 0, tilt]}>
    <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.035, 0.035, 0.8, 16]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    <mesh position={[0, -0.65, 0]}><cylinderGeometry args={[0.05, 0.035, 0.14, 16]} /><Mat c={fails ? "#7a4a3a" : "#d4a84a"} m={1} r={0.3} /></mesh>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.07, 0.07, 0.05, 6]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
  </group>;
  return <Studio tt={tt} floor="none" photo={0.2} keys={[{ t: 0, p: [0, 0.0, 2.6], l: [0, -0.15, 0], fov: 40 }, { t: 10, p: [0.3, 0.1, 2.3], l: [0, -0.1, 0], arc: 0.03 }]}>
    <RB p={[0, -0.45, 0]} s={[2.2, 0.9, 0.5]} rad={0.01} c="#9a978f" r={0.95} />
    <mesh position={[-0.5, -0.38, 0.252]}><planeGeometry args={[0.1, 0.84]} /><meshBasicMaterial color="#3a3830" /></mesh>
    <mesh position={[0.5, -0.38, 0.252]} rotation={[0, 0, 0.35]}><planeGeometry args={[0.1, 0.84]} /><meshBasicMaterial color="#3a3830" /></mesh>
    <Bolt x={-0.5} tilt={0} fails={false} />
    <Bolt x={0.5 - 0.0} tilt={0.35} fails />
    {[-0.5, 0.5].map((x, i) => <Arrow3 key={i} p={[x, 0.5 + 0.15 * pull, 0.25]} rot={[0, 0, 0]} L={0.35} col={i ? RED : GRN} />)}
  </Studio>;
}}</Stage>;

// 27 · el polvo: el ancla aprieta contra polvo y patina; se aspira el agujero y la cuña muerde la piedra
export const H3Dustgrip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const dust = 1 - sm(tt, 3.0, 4.4), slip = tt < 3.0 ? 0.04 * Math.sin(tt * 18) * sm(tt, 1.0, 1.4) : 0, bite = sm(tt, 4.8, 5.6);
  return <Studio tt={tt} floor="none" photo={0.2} keys={[{ t: 0, p: [0.3, 0.0, 1.6], l: [0, -0.2, 0], fov: 38 }, { t: 10, p: [0.45, -0.05, 1.4], l: [0, -0.22, 0], arc: 0.03 }]}>
    <RB p={[0, -0.4, 0]} s={[1.4, 0.9, 0.4]} rad={0.01} c="#9a978f" r={0.95} />
    <mesh position={[0, -0.38, 0.202]}><planeGeometry args={[0.14, 0.75]} /><meshBasicMaterial color="#2a2820" /></mesh>
    {[...Array(60)].map((_, i) => <mesh key={i} position={[-0.06 + rnd(i) * 0.12, -0.72 + rnd(i, 2) * 0.5 * (0.4 + 0.6 * dust) + (1 - dust) * 1.5 * rnd(i, 3), 0.205]}><circleGeometry args={[0.008 + 0.008 * rnd(i, 4), 6]} /><meshBasicMaterial color="#d8d2c4" transparent opacity={dust} /></mesh>)}
    <group position={[0, -0.32 + slip, 0.21]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.7, 14]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
      {[-1, 1].map((sd) => <RB key={sd} p={[sd * (0.04 + 0.025 * bite), -0.28, 0]} s={[0.02, 0.12, 0.04]} rad={0.004} c="#d4a84a" m={1} r={0.3} />)}
    </group>
    {dust < 0.98 && dust > 0.02 && <group position={[0, 0.25, 0.21]}><mesh><cylinderGeometry args={[0.07, 0.07, 0.4, 20]} /><Mat c="#2f6fb0" r={0.5} /></mesh></group>}
  </Studio>;
}}</Stage>;

// 28 · la prueba: dos manos tiran del borde de la caja; la caja ni se mueve y los pernos se tensan con un brillo cálido
export const H3Pulltest: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const tug = sm(tt, 1.0, 1.6) * (1 - sm(tt, 5.0, 5.6)), shake = 0.015 * Math.sin(tt * 30) * tug;
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0.6, 1.0, 1.9], l: [0, 0.45, 0], fov: 40 }, { t: 10, p: [0.85, 0.9, 1.6], l: [0.05, 0.45, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[0, 0, 0]} s={0.8} bolts={1} boltGlow={0.35 * tug} />
    <Hand3 p={[-0.42 + shake, 0.62, 0.15]} rot={[0, Math.PI / 2, 0]} s={1.9} />
    <Hand3 p={[0.42 + shake, 0.62, 0.15]} rot={[0, -Math.PI / 2, 0]} s={1.9} />
  </Studio>;
}}</Stage>;

// 29 · taquito de plástico contra perno de expansión: el taco sale entero con un tirón, el de acero no se mueve
export const H3Sleeves: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const p = sm(tt, 2.0, 3.0);
  return <Studio tt={tt} floor="none" photo={0.2} keys={[{ t: 0, p: [0, 0.1, 2.1], l: [0, -0.1, 0], fov: 40 }, { t: 10, p: [0.3, 0.15, 1.9], l: [0, -0.1, 0], arc: 0.03 }]}>
    <RB p={[0, -0.45, 0]} s={[1.8, 0.9, 0.4]} rad={0.01} c="#9a978f" r={0.95} />
    <group position={[-0.45, -0.2 + 0.9 * p, 0.21]} rotation={[0, 0, 0.6 * p]}>
      <mesh><cylinderGeometry args={[0.05, 0.045, 0.5, 16]} /><Mat c="#3a7ad0" r={0.6} /></mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.025, 0.025, 0.3, 12]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    </group>
    <group position={[0.45, -0.2 + 0.015 * p, 0.21]}>
      <mesh><cylinderGeometry args={[0.04, 0.04, 0.6, 16]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
      <mesh position={[0, -0.22, 0]}><cylinderGeometry args={[0.055, 0.04, 0.14, 16]} /><Mat c="#d4a84a" m={1} r={0.3} /></mesh>
      <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.07, 0.07, 0.05, 6]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    </group>
    {[-0.45, 0.45].map((x, i) => <Arrow3 key={i} p={[x, 0.45 + 0.2 * p, 0.21]} L={0.3} col={AMB} />)}
  </Studio>;
}}</Stage>;

// 30 · el borde: un agujero pegado al canto de la losa; al apretar, se desprende un triángulo de concreto
export const H3Edgespall: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const tight = sm(tt, 1.2, 2.6), pop = sm(tt, 2.8, 3.6);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [1.0, 0.6, 1.4], l: [0.4, 0.0, 0], fov: 38 }, { t: 10, p: [1.2, 0.5, 1.2], l: [0.45, -0.05, 0], arc: 0.03 }]}>
    <RB p={[0, -0.2, 0]} s={[1.4, 0.4, 1.0]} rad={0.01} c="#9a978f" r={0.95} />
    <group position={[0.62 + 0.2 * pop, -0.15 - 0.6 * pop * pop, 0.2 + 0.2 * pop]} rotation={[0.6 * pop, 0, -1.2 * pop]}>
      <mesh rotation={[0, 0, 0]}><coneGeometry args={[0.14, 0.32, 3]} /><Mat c="#a8a59c" r={0.95} /></mesh>
    </group>
    <group position={[0.6, 0.03 + 0.2 * pop, 0.2]} rotation={[0, tight * 6, 0]}>
      <mesh><cylinderGeometry args={[0.07, 0.07, 0.05, 6]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
      <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.4, 12]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    </group>
    {[...Array(10)].map((_, i) => pop > 0.05 ? <mesh key={i} position={[0.7 + rnd(i) * 0.3 * pop, 0.0 - pop * 0.5 * rnd(i, 2), 0.25 + rnd(i, 3) * 0.3 * pop]}><boxGeometry args={[0.025, 0.025, 0.025]} /><Mat c="#a8a59c" r={1} /></mesh> : null)}
  </Studio>;
}}</Stage>;

export const HEROES_3B = { workshop: H3Workshop, toolkeys: H3Toolkeys, chainloop: H3Chainloop, fourhouses: H3Fourhouses, truckwalk: H3Truckwalk, cornertop: H3Cornertop, attackroom: H3Attackroom, gouges: H3Gouges, cabwrap: H3Cabwrap, xraybolts: H3Xraybolts, straighthole: H3Straighthole, dustgrip: H3Dustgrip, pulltest: H3Pulltest, sleeves: H3Sleeves, edgespall: H3Edgespall };
