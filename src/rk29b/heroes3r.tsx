// rk29b · REDISEÑO de los 12 componentes que el EVALUADOR dejó ≤4 en la 2ª vuelta (29-oct).
// Regla de la vuelta: UN objeto grande que se entiende sin leer, fondo de pared clara (nunca negro), cámara cerca, acción con peso.
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Fob3, RB, Mat, sm, spr, c01, rnd} from "./studio3d";
import { AMB, GRN, useTxt, Lock3, Door3, Person3, Hand3, Screw3, Hourglass3 } from "./lock3d";

type P = { t: number; h: H };
const BRASS = "#d4a84a";

// glasslock · la carcasa se vuelve vidrio: adentro el motor gira y el pestillo de latón sale
export const R3Glasslock: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const g = sm(tt, 1.0, 3.0), spin = sm(tt, 3.6, 6.0), bolt = sm(tt, 4.6, 6.2);
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0} keys={[{ t: 0, p: [0.35, 1.15, 1.7], l: [0.1, 1.05, 0], fov: 38 }, { t: 10, p: [0.55, 1.1, 1.45], l: [0.2, 1.05, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.3]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[0, 1.05, 0]} scale={1.6}>
      <RB p={[0, 0, 0]} s={[0.36, 0.72, 0.14]} rad={0.05} c="#2a2d33" r={0.35} m={0.4} op={1 - 0.86 * g} />
      <mesh><boxGeometry args={[0.37, 0.73, 0.15]} /><meshPhysicalMaterial color="#e8f2ff" transmission={0.9 * g} roughness={0.05} thickness={0.2} transparent opacity={0.25 * g} /></mesh>
      <group position={[0, -0.12, 0]} rotation={[0, 0, spin * 9]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.09, 24]} /><Mat c="#b87333" m={1} r={0.3} /></mesh>{[0, 1, 2, 3, 4, 5].map((i) => <RB key={i} p={[Math.cos(i) * 0.075, Math.sin(i) * 0.075, 0]} s={[0.02, 0.02, 0.09]} rad={0.004} c="#c9ced4" m={1} r={0.3} />)}</group>
      <RB p={[0, 0.12, 0]} s={[0.1, 0.16, 0.08]} rad={0.01} c="#3a6ea5" r={0.4} />
      <RB p={[0.12 + 0.2 * bolt, 0.05, 0]} s={[0.26, 0.08, 0.07]} rad={0.012} c={BRASS} m={1} r={0.25} />
    </group>
    <RB p={[0.62, 1.13, -0.02]} s={[0.08, 0.3, 0.14]} rad={0.01} c="#efe9dd" r={0.6} />
  </Studio>;
}}</Stage>;

// owner · la mano del nieto suelta un llavero, la del abuelo lo atrapa y el led pasa a verde
export const R3Owner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const f = sm(tt, 1.6, 2.8), catchK = sm(tt, 2.8, 3.2), lit = sm(tt, 3.6, 4.2);
  const y = 1.25 - 0.5 * f * f;
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0.15} keys={[{ t: 0, p: [0, 1.05, 1.6], l: [0, 0.95, 0], fov: 40 }, { t: 10, p: [0.25, 1.0, 1.4], l: [0.05, 0.92, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Hand3 p={[-0.05, 1.38, 0.05]} rot={[Math.PI / 2 + 0.2, 0, 0]} s={2.1} skin="#e3bf9e" sleeve="#3a6ea5" />
    <Hand3 p={[0.02, 0.6 + 0.04 * catchK, 0.1]} rot={[-Math.PI / 2 + 0.3, 0, Math.PI]} s={2.1} skin="#c9a080" sleeve="#7a6450" />
    <group position={[0, y, 0.12]} rotation={[0.3 + 1.6 * f * (1 - catchK), 0.2, 0]}><Fob3 s={0.55} led={0} ring={false} /></group>
    <mesh position={[0.13, y + 0.06, 0.25]}><sphereGeometry args={[0.03, 16, 16]} /><meshBasicMaterial color={lit > 0.5 ? GRN : "#2a3a2e"} toneMapped={false} /></mesh>
  </Studio>;
}}</Stage>;

// ghosts · pasillo claro: cuatro siluetas de vidrio cruzan la puerta de a una y cada una deja una tecla verde prendida
export const R3Ghosts: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const lit = [0, 1, 2, 3].filter((i) => tt > 1.4 + i * 1.6).map((i) => [1, 5, 7, 10][i]);
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [1.3, 1.3, 2.6], l: [0, 1.0, 0], fov: 40 }, { t: 9, p: [1.5, 1.25, 2.3], l: [0.1, 1.0, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.12]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Door3 p={[0, 0, -0.04]} col="#5a3a2a" open={0.6} lock={false} frame />
    <Lock3 p={[0.62, 1.2, 0.0]} s={0.55} led={1} ledCol={GRN} lit={lit} />
    {[0, 1, 2, 3].map((i) => { const k = c01((tt - 0.4 - i * 1.6) / 2.2); if (k <= 0 || k >= 1) return null; return <group key={i}>
      <Person3 p={[-0.2 + 0.4 * k, 0, 1.3 - 2.4 * k]} yaw={Math.PI} s={0.95} col="#cfe4ff" op={0.55 * Math.sin(Math.PI * k) + 0.15} />
    </group>; })}
  </Studio>;
}}</Stage>;

// sandglass · reloj de arena gigante + contador 30 s; al caer el último grano la manija de la cerradura baja con golpe
export const R3Sandglass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const k = c01((tt - 0.3) / 4.5), sec = Math.max(0, Math.ceil(30 * (1 - k))), lever = sm(tt, 4.9, 5.3);
  const tx = useTxt([`0:${String(sec).padStart(2, "0")}`], 512, 200, "#1b1b1e", AMB, 150, "Courier New");
  return <Studio tt={tt} floor="wood" warm={0.8} photo={0} keys={[{ t: 0, p: [-0.1, 1.0, 2.0], l: [0.15, 0.75, 0], fov: 40 }, { t: 7, p: [0.25, 1.0, 1.6], l: [0.35, 0.85, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.4]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.4, 0]} s={[1.8, 0.8, 0.6]} rad={0.02} c="#7a4a2a" r={0.6} />
    <Hourglass3 p={[-0.35, 0.8, 0.05]} s={1.1} k={k} />
    <group position={[-0.35, 1.85, -0.2]}><RB s={[0.62, 0.26, 0.06]} rad={0.02} c="#1b1b1e" r={0.5} /><mesh position={[0, 0, 0.031]}><planeGeometry args={[0.56, 0.22]} /><meshBasicMaterial map={tx} toneMapped={false} /></mesh></group>
    <group position={[0.55, 1.2, -0.3]}>
      <RB s={[0.3, 0.5, 0.08]} rad={0.03} c="#c9ced4" m={0.9} r={0.25} />
      <group position={[0, -0.05, 0.06]} rotation={[0, 0, -1.3 * lever]}><RB p={[0.15, 0, 0]} s={[0.32, 0.06, 0.06]} rad={0.025} c="#c9ced4" m={1} r={0.2} /></group>
    </group>
  </Studio>;
}}</Stage>;

// clock11 · esfera entera: once fichas rojas caen de a una con rebote sobre las horas de 12 a 5
export const R3Clock11: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const nums = React.useMemo(() => [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], []);
  const tex = nums.map((n) => useTxt([`${n}`], 128, 128, "#00000000", "#2a2c31", 92, "Arial Black"));
  return <Studio tt={tt} floor="none" warm={0.8} photo={0.15} keys={[{ t: 0, p: [0, 2.3, 1.1], l: [0, 0, 0], fov: 42 }, { t: 11, p: [0.25, 2.1, 1.0], l: [0, 0, 0], arc: 0.03 }]}>
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.95, 0.95, 0.04, 64]} /><Mat c="#f2ede2" r={0.7} /></mesh>
    <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[1.0, 1.0, 0.03, 64]} /><Mat c={BRASS} m={1} r={0.3} /></mesh>
    {nums.map((_, i) => { const a = Math.PI / 2 - (i / 12) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.8, 0.002, -Math.sin(a) * 0.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.18, 0.18]} /><meshBasicMaterial map={tex[i]} transparent /></mesh>; })}
    {[...Array(11)].map((_, i) => { const d = tt - (0.6 + i * 0.6); if (d < 0) return null; const a = Math.PI / 2 - ((i % 6) / 12) * Math.PI * 2, r = 0.55 - Math.floor(i / 6) * 0.17; const yb = Math.max(0, 1.2 * (1 - spr(tt, 0.6 + i * 0.6, 9, 0.35))); return <mesh key={i} position={[Math.cos(a) * r, 0.03 + yb, -Math.sin(a) * r]}><cylinderGeometry args={[0.07, 0.07, 0.03, 32]} /><Mat c="#c62a22" r={0.45} /></mesh>; })}
    <group rotation={[0, -(tt / 11) * Math.PI * 0.8, 0]}><RB p={[0, 0.03, -0.3]} s={[0.04, 0.02, 0.6]} rad={0.008} c="#1a1a1a" r={0.4} /></group>
  </Studio>;
}}</Stage>;

// kick · pasillo con luz: la bota pega, el pestillo de metal queda entero y el marco de madera estalla en astillas largas
export const R3Kick: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const hitT = 2.2, a = sm(tt, 0.6, hitT), d = Math.max(0, tt - hitT), burst = c01(d / 1.2), open = sm(tt, hitT, hitT + 0.6) * 0.5;
  const shake = d > 0 && d < 0.4 ? 0.02 * Math.sin(d * 80) * (1 - d / 0.4) : 0;
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [1.6 + shake, 1.25, 2.4], l: [0.3, 1.0, 0], fov: 40 }, { t: 3, p: [1.4, 1.2, 1.9], l: [0.45, 1.05, 0] }, { t: 11, p: [1.3, 1.15, 1.7], l: [0.5, 1.05, 0], arc: 0.03 }]}>
    <Wall3 p={[-1.1, 1.3, -0.12]} s={[1.3, 2.6, 0.12]} kind="drywall" />
    <Wall3 p={[1.6, 1.3, -0.12]} s={[1.9, 2.6, 0.12]} kind="drywall" />
    <Door3 p={[0, 0, -0.06]} col="#6a3a2a" open={open} lock={false} frame={false} />
    <RB p={[-0.5, 1.05, -0.06]} s={[0.1, 2.2, 0.16]} rad={0.01} c="#e8dcc6" r={0.6} />
    <RB p={[0, 2.12, -0.06]} s={[1.1, 0.1, 0.16]} rad={0.01} c="#e8dcc6" r={0.6} />
    {d <= 0 && <RB p={[0.5, 1.05, -0.06]} s={[0.1, 2.2, 0.16]} rad={0.01} c="#e8dcc6" r={0.6} />}
    {d > 0 && [...Array(10)].map((_, i) => <RB key={i} p={[0.5 + 0.9 * burst * rnd(i), 0.6 + i * 0.12 - 1.1 * burst * burst * rnd(i, 2), -0.06 + 0.8 * burst * rnd(i, 3)]} rot={[burst * 3 * rnd(i, 4), 0, burst * 4 * rnd(i, 5)]} s={[0.05, 0.28, 0.06]} rad={0.004} c="#e8dcc6" r={0.7} />)}
    <RB p={[0.42 + 0.0 * open, 1.08, 0.0]} s={[0.12, 0.06, 0.06]} rad={0.01} c="#c9ced4" m={1} r={0.2} />
    {tt < hitT + 0.5 && <group position={[0.2, 0.55, 1.4 - 1.3 * a + 0.35 * sm(tt, hitT, hitT + 0.5)]} rotation={[0.15, 0, 0]}>
      <RB p={[0, 0, 0]} s={[0.2, 0.17, 0.42]} rad={0.05} c="#3a2a1e" r={0.8} />
      <RB p={[0, 0.25, 0.12]} s={[0.17, 0.38, 0.17]} rad={0.05} c="#3a2a1e" r={0.8} />
      <RB p={[0, -0.09, 0]} s={[0.21, 0.035, 0.44]} rad={0.01} c="#1a1a1a" r={0.9} />
      <mesh position={[0, 0.72, 0.14]}><capsuleGeometry args={[0.09, 0.55, 4, 12]} /><Mat c="#2c3e5a" r={0.9} /></mesh>
    </group>}
  </Studio>;
}}</Stage>;

// strikeexplode · placa cromada grande en el marco: sale volando con sus 2 tornillos cortos; al lado un tornillo de 3" del mismo tamaño en pantalla
export const R3Strikeexplode: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const pop = sm(tt, 1.6, 2.6), cmp = sm(tt, 3.4, 4.4);
  return <Studio tt={tt} floor="none" warm={0.8} photo={0} keys={[{ t: 0, p: [0, 1.05, 1.5], l: [0, 1.0, 0], fov: 40 }, { t: 11, p: [0.2, 1.0, 1.3], l: [0.05, 1.0, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.4, -0.12]} s={[4, 3, 0.1]} kind="wood" />
    <group position={[-0.3, 1.0 + 0.1 * pop, 0.0 + 0.35 * pop]} rotation={[0, -0.6 * pop, 0.3 * pop]}>
      <RB s={[0.16, 0.6, 0.02]} rad={0.01} c="#d8dde4" m={1} r={0.15} />
      <RB p={[0, 0, 0.012]} s={[0.08, 0.18, 0.006]} rad={0.004} c="#3a3d44" m={0.8} r={0.3} />
    </group>
    {[0.22, -0.22].map((y, i) => <group key={i} position={[-0.3 + 0.18 * pop * (i ? -1 : 1), 1.0 + y + 0.12 * pop, 0.02 + 0.5 * pop]} scale={2.2}><Screw3 rot={[Math.PI / 2, 0, 0]} L={0.08} spin={pop * 8} /></group>)}
    <group position={[0.4, 1.0, 0.1]} scale={2.2 * cmp}><Screw3 rot={[0, 0, 0]} L={0.34} c={BRASS} /></group>
  </Studio>;
}}</Stage>;

// badcodes · cuatro objetos grandes (torta de cumpleaños, patente, almanaque, 1-2-3-4) caen de a uno al tacho
export const R3Badcodes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const plate = useTxt(["4025"], 512, 256, "#f6f3ec", "#1e3a6a", 170, "Arial Black"), cal = useTxt(["JUN", "12"], 256, 256, "#f6f3ec", "#c62a22", 90, "Arial Black"), seq = useTxt(["1234"], 512, 256, "#2a2c31", AMB, 170, "Arial Black");
  const objs: React.ReactNode[] = [
    <group key="c"><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.22, 0.22, 0.2, 32]} /><Mat c="#f2d6e0" r={0.7} /></mesh><mesh position={[0, 0.26, 0]}><cylinderGeometry args={[0.015, 0.015, 0.12, 8]} /><Mat c="#3a6ea5" r={0.5} /></mesh></group>,
    <group key="p"><RB s={[0.5, 0.25, 0.02]} rad={0.02} c="#f6f3ec" r={0.5} m={0.3} /><mesh position={[0, 0, 0.011]}><planeGeometry args={[0.46, 0.22]} /><meshBasicMaterial map={plate} /></mesh></group>,
    <group key="k"><RB s={[0.32, 0.34, 0.03]} rad={0.01} c="#f6f3ec" r={0.8} /><mesh position={[0, 0, 0.016]}><planeGeometry args={[0.3, 0.32]} /><meshBasicMaterial map={cal} /></mesh></group>,
    <group key="s"><RB s={[0.5, 0.25, 0.04]} rad={0.02} c="#2a2c31" r={0.5} /><mesh position={[0, 0, 0.021]}><planeGeometry args={[0.46, 0.22]} /><meshBasicMaterial map={seq} toneMapped={false} /></mesh></group>,
  ];
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.6, 1.9], l: [0, 0.55, 0], fov: 42 }, { t: 10, p: [0.25, 1.75, 1.6], l: [0, 0.45, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.45, 0.36, 0.7, 40, 1, true]} /><meshStandardMaterial color="#5a6a5a" roughness={0.6} metalness={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.36, 0.36, 0.02, 40]} /><Mat c="#4a5a4a" r={0.6} /></mesh>
    {objs.map((o, i) => { const a = 0.5 + i * 1.6, f = sm(tt, a, a + 0.9), land = 0.2 + i * 0.1; const y = f < 1 ? 1.45 - (1.45 - land) * f * f : land + 0.03 * Math.max(0, 1 - spr(tt, a + 0.9, 10, 0.3)); return tt > a - 0.3 ? <group key={i} position={[(-0.9 + i * 0.1) * (1 - f), y, 0.2 * (1 - f)]} rotation={[0.5 + f * 1.0, 0, (i - 1.5) * 0.3 * f]}>{o}</group> : null; })}
  </Studio>;
}}</Stage>;

// warnweeks · seis teclados en fila con su número de semana; el led ámbar parpadea en cada uno y el sexto se apaga
export const R3Warnweeks: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const wk = [1, 2, 3, 4, 5, 6].map((i) => useTxt([`WEEK ${i}`], 256, 96, "#f6f3ec", "#2a2c31", 54, "Arial Black"));
  const cur = Math.min(5, Math.floor(c01((tt - 0.6) / 7) * 6));
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.25, 2.6], l: [0, 1.0, 0], fov: 42 }, { t: 11, p: [0.3, 1.2, 2.3], l: [0.2, 1.0, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.2]} s={[6, 3.4, 0.1]} kind="drywall" />
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = -1.25 + i * 0.5, blink = i === cur && i < 5 ? (Math.sin(tt * Math.PI * 2 * 1.5) > 0 ? 1 : 0.15) : i < cur ? 0.6 : 0.15, dead = i === 5 && tt > 7.8; return <group key={i}>
      <Lock3 p={[x, 1.05, -0.1]} s={0.5} led={dead ? 0 : blink} ledCol={AMB} dead={dead} />
      <mesh position={[x, 0.68, -0.14]}><planeGeometry args={[0.4, 0.15]} /><meshBasicMaterial map={wk[i]} /></mesh>
    </group>; })}
  </Studio>;
}}</Stage>;

// rolodex · fichero giratorio de tarjetas crema con nombres grandes; pasan de a una y GUEST sale al frente con sello rojo
export const R3Rolodex: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const names = ["PAINTER", "DOG WALKER", "PLUMBER", "NEPHEW", "CLEANER", "GUEST"];
  const tx = names.map((n) => useTxt([n], 512, 256, "#efe6cf", "#1e2026", 78, "Arial Black"));
  const stamp = useTxt(["STILL WORKS"], 512, 160, "#00000000", "#c62a22", 76, "Arial Black");
  const rot = c01((tt - 0.6) / 7.5) * 5, out = sm(tt, 8.6, 9.6), st = spr(tt, 10.0, 9, 0.45);
  return <Studio tt={tt} floor="wood" warm={0.75} photo={0} keys={[{ t: 0, p: [0.0, 0.9, 1.6], l: [0, 0.6, 0], fov: 40 }, { t: 14, p: [0.2, 0.85, 1.35], l: [0, 0.65, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.06, 0]} s={[0.7, 0.12, 0.4]} rad={0.02} c="#2a2c31" r={0.4} m={0.5} />
    {[-1, 1].map((sd) => <RB key={sd} p={[sd * 0.3, 0.35, 0]} s={[0.04, 0.5, 0.04]} rad={0.01} c="#c9ced4" m={1} r={0.3} />)}
    <group position={[0, 0.5, 0]}>
      {names.map((_, i) => { const a = (i - rot) * 0.6; if (i === 5 && out > 0) return null; return Math.abs(a) < 1.6 ? <group key={i} rotation={[a, 0, 0]}><mesh position={[0, 0.0, 0.22]} rotation={[0, 0, 0]}><planeGeometry args={[0.52, 0.28]} /><meshStandardMaterial map={tx[i]} roughness={1} metalness={0} envMapIntensity={0.2} side={THREE.DoubleSide} /></mesh></group> : null; })}
    </group>
    {out > 0 && <group position={[0, 0.6 + 0.25 * out, 0.22 + 0.45 * out]} rotation={[-0.2 * (1 - out), 0, 0]}>
      <mesh><planeGeometry args={[0.52, 0.28]} /><meshStandardMaterial map={tx[5]} roughness={1} envMapIntensity={0.2} /></mesh>
      <mesh position={[0.02, -0.06, 0.003]} rotation={[0, 0, -0.15]} scale={Math.max(0.01, 1.6 - 0.6 * st)}><planeGeometry args={[0.4, 0.12]} /><meshBasicMaterial map={stamp} transparent opacity={c01(st * 2)} /></mesh>
    </group>}
  </Studio>;
}}</Stage>;

// owncodes · cuatro llaves grandes caen con resorte; la de la limpiadora cae en una valija que se cierra y se va rodando
export const R3Owncodes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const names = ["CLEANER", "IN-LAW", "NEIGHBOR", "GRANDSON"].map((n) => useTxt([n], 256, 96, "#f6f3ec", "#2a2c31", 50, "Arial Black"));
  const cols = ["#c62a22", "#2f6fb0", "#3a9a5a", BRASS];
  const lid = sm(tt, 5.4, 6.0), roll = sm(tt, 6.4, 9.0);
  const Key = ({ c }: { c: string }) => <group>
    <mesh position={[0, 0.18, 0]}><torusGeometry args={[0.09, 0.03, 12, 32]} /><Mat c={c} m={0.6} r={0.3} /></mesh>
    <RB p={[0, -0.06, 0]} s={[0.045, 0.36, 0.03]} rad={0.008} c={c} m={0.6} r={0.3} />
    {[0, 1].map((j) => <RB key={j} p={[0.045, -0.18 + j * 0.07, 0]} s={[0.05, 0.03, 0.03]} rad={0.004} c={c} m={0.6} r={0.3} />)}
  </group>;
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [0, 1.1, 2.4], l: [0, 0.75, 0], fov: 42 }, { t: 11, p: [0.4, 1.05, 2.2], l: [0.3, 0.7, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    {[0, 1, 2, 3].map((i) => { const x = -0.9 + i * 0.6, y = 1.0 + 0.9 * (1 - c01(spr(tt, 0.5 + i * 0.7, 9, 0.4))); if (i === 0 && tt > 4.2) return null; return <group key={i}><group position={[x, y, 0]} scale={1.3}><Key c={cols[i]} /></group><mesh position={[x, 0.55, 0.02]}><planeGeometry args={[0.5, 0.18]} /><meshBasicMaterial map={names[i]} /></mesh></group>; })}
    {tt > 3.2 && tt <= 4.2 && <group position={[-0.9, 1.0 - 0.7 * sm(tt, 3.2, 4.2), 0.25 * sm(tt, 3.2, 4.2)]} scale={1.3}><Key c={cols[0]} /></group>}
    <group position={[-0.9 - 2.5 * roll, 0, 0.45]}>
      <RB p={[0, 0.2, 0]} s={[0.6, 0.3, 0.4]} rad={0.04} c="#3a4a5e" r={0.5} />
      <group position={[0, 0.35, -0.2]} rotation={[-1.4 * (1 - lid), 0, 0]}><RB p={[0, 0, 0.2]} s={[0.6, 0.04, 0.4]} rad={0.02} c="#3a4a5e" r={0.5} /></group>
      {[-0.22, 0.22].map((x, i) => <mesh key={i} position={[x, 0.04, 0.12]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.03, 16]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}
    </group>
  </Studio>;
}}</Stage>;

// wedge · pared clara: la puerta empujada choca contra una cuña amarilla grande que la frena con sacudida; después baja la barra del pomo al piso
export const R3Wedge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const push = sm(tt, 0.8, 1.8), stop = tt > 1.8 ? 0.02 * Math.sin((tt - 1.8) * 40) * Math.max(0, 1 - (tt - 1.8) / 0.5) : 0, bar = sm(tt, 4.0, 5.2);
  return <Studio tt={tt} floor="wood" warm={0.85} photo={0} keys={[{ t: 0, p: [1.9, 1.2, 1.5], l: [0.1, 0.6, -0.2], fov: 42 }, { t: 9, p: [2.0, 1.1, 1.2], l: [0.2, 0.6, -0.2], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.12]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Door3 p={[0, 0, -0.04]} col="#5a3a2a" open={0.08 + 0.12 * push + stop} lock={false} frame />
    <group position={[0.15, 0, 0.32]} rotation={[0, -0.5, 0]}><mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.0, 0.12, 0.42, 3]} /><Mat c="#f2c230" r={0.5} /></mesh></group>
    {bar > 0 && <group position={[0.3, 0.98 - 0.0, 0.25]} rotation={[0.55 * bar, 0, 0]}><mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.025, 0.025, 1.0, 12]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh><RB p={[0, -1.0, 0]} s={[0.12, 0.03, 0.12]} rad={0.01} c="#1a1a1a" r={0.8} /></group>}
  </Studio>;
}}</Stage>;

export const HEROES_3R = { glasslock: R3Glasslock, owner: R3Owner, ghosts: R3Ghosts, sandglass: R3Sandglass, clock11: R3Clock11, kick: R3Kick, strikeexplode: R3Strikeexplode, badcodes: R3Badcodes, warnweeks: R3Warnweeks, rolodex: R3Rolodex, owncodes: R3Owncodes, wedge: R3Wedge };
