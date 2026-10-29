// rk29c · componentes 3D 1-15 (29-oct). Cada uno UNA vez en toda la tanda (registro D:/rtmp/rk29_COMPONENTES.md).
// La caja fuerte del garage: dónde se apoya, quién la ve desde la calle, cómo se la llevan dos hombres con un carrito…
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Rings3, RB, Mat, sm, spr, c01, rnd, useTex3 } from "./studio3d";
import { AMB, RED, ICE, GRN, useTxt, Person3, Hand3, Arrow3 } from "./lock3d";
import { Safe3, GDoor3, Peg3, Dolly3, Heater3 } from "./garage3d";

type P = { t: number; h: H };

// 1 · la losa: corte de la casa; arriba la caja sobre alfombra y tablas finas que se doblan, abajo la caja abrazada por 4" de concreto
export const H3Slabcore: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const t3 = useTex3(), sag = 0.05 * sm(tt, 1.2, 2.6), pour = sm(tt, 3.0, 4.6);
  return <Studio tt={tt} floor="none" photo={0.2} keys={[{ t: 0, p: [0, 1.9, 4.2], l: [0, 1.25, 0], fov: 42 }, { t: 3.0, p: [0.2, 0.9, 3.6], l: [0, 0.35, 0] }, { t: 10, p: [0.5, 0.8, 3.2], l: [0.1, 0.3, 0], arc: 0.03 }]}>
    {/* arriba: tablas finas sobre vigas con alfombra */}
    <group position={[0, 1.6, 0]}>
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => <RB key={i} p={[x, -0.18, 0]} s={[0.1, 0.3, 1.4]} rad={0.004} c="#fff" r={0.8} map={t3.wood} />)}
      <mesh position={[0, -0.02 - sag * 0.5, 0]} rotation={[0, 0, 0]}><boxGeometry args={[3.0, 0.04, 1.4, 20, 1, 1]} /><meshStandardMaterial color="#d8c49a" roughness={0.8} /></mesh>
      <RB p={[0, 0.01 - sag, 0]} s={[3.0, 0.03, 1.4]} rad={0.004} c="#7a4a4a" r={1} />
      <Safe3 p={[0, 0.03 - sag, 0]} s={0.75} />
    </group>
    {/* abajo: la losa que la abraza */}
    <group position={[0, 0.2, 0]}>
      <RB p={[0, -0.12, 0]} s={[3.0, 0.24, 1.4]} rad={0.01} c="#9a978f" r={0.95} />
      <Safe3 p={[0, 0, 0]} s={0.75} bolts={1} boltGlow={0.4 * pour} />
      {[-1, 1].map((sd) => <RB key={sd} p={[sd * 0.55, 0.05 * pour, 0]} s={[0.36, 0.1 * pour + 0.001, 0.8]} rad={0.004} c="#a8a59c" r={0.95} />)}
    </group>
  </Studio>;
}}</Stage>;

// 2 · el portón baja detrás de él: la luz de la calle se achica hasta una raya y queda el garage cerrado
export const H3Doordown: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = 1 - sm(tt, 0.6, 4.2);
  const tgt = React.useMemo(() => { const o = new THREE.Object3D(); o.position.set(0, 0, 1.5); return o; }, []);
  return <Studio tt={tt} floor="concrete" night={0.85} photo={0} bg="#0a0a0c" keys={[{ t: 0, p: [0, 1.5, -3.6], l: [0, 0.9, 1], fov: 46 }, { t: 6, p: [0.3, 1.4, -3.2], l: [0, 0.6, 1], arc: 0.03 }]}>
    <primitive object={tgt} />
    <group rotation={[0, Math.PI, 0]}><GDoor3 p={[0, 0, -0.2]} up={up} win={false} /></group>
    <spotLight position={[0, 1.2, 3.5]} target={tgt} angle={0.6} penumbra={0.3} intensity={60 * (0.05 + 0.95 * up)} distance={9} color="#ffd9a8" />
    <Person3 p={[0.4, 0, -0.8]} yaw={Math.PI} s={0.95} col="#1a1c22" />
    <Safe3 p={[-1.2, 0, -2.0]} rot={[0, 0.4, 0]} s={0.9} />
  </Studio>;
}}</Stage>;

// 3 · el ojo del ladrón recorre la pared: cada silueta del tablero se prende de a una y al final el bulto tapado en el piso
export const H3Eyescan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const n = Math.min(6, Math.floor(c01((tt - 0.5) / 4.0) * 6.99)), lit = [...Array(n)].map((_, i) => i), tarp = sm(tt, 4.8, 5.6);
  const tgt = React.useMemo(() => new THREE.Object3D(), []), ang = -0.6 + 1.2 * sm(tt, 0.5, 4.5);
  tgt.position.set(Math.sin(ang) * 1.0, tarp > 0.5 ? 0.25 : 1.35, -0.6);
  return <Studio tt={tt} floor="concrete" night={0.9} photo={0} keys={[{ t: 0, p: [0, 1.35, 2.8], l: [0, 1.15, -0.6], fov: 40 }, { t: 5, p: [0.3, 1.0, 2.6], l: [0.4, 0.5, -0.4] }, { t: 10, p: [0.5, 0.9, 2.3], l: [0.55, 0.35, -0.4], arc: 0.03 }]}>
    <primitive object={tgt} />
    <Wall3 p={[0, 1.6, -0.75]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Peg3 p={[0, 1.35, -0.68]} lit={lit} />
    <spotLight position={[0, 1.5, 2.4]} target={tgt} angle={0.18} penumbra={0.4} intensity={50} distance={6} color="#fff1d0" />
    <group position={[0.7, 0, -0.3]}>
      <Safe3 s={0.55} />
      <mesh position={[0, 0.32, 0]}><boxGeometry args={[0.48, 0.6, 0.42]} /><meshStandardMaterial color="#3a4a5a" roughness={1} transparent opacity={1 - 0.0 * tarp} /></mesh>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0.3, 0]}><coneGeometry args={[0.32, 0.08, 4]} /><Mat c="#3a4a5a" r={1} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 4 · una docena de veces: el portón sube y baja en loop, el contador del sábado llega a 12; el uno más de un martes suena igual
export const H3Dozencycles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const per = 0.55, cyc = Math.min(13, Math.floor(c01((tt - 0.3) / (per * 13)) * 13) + (tt > 0.3 ? 1 : 0)), ph = ((tt - 0.3) % per) / per, up = tt < 0.3 ? 0 : Math.sin(Math.PI * ph);
  const lab = cyc > 12 ? useTxt(["TUE", "1"], 256, 256, "#2a2c31", RED, 90) : useTxt(["SAT", String(cyc)], 256, 256, "#2a2c31", AMB, 90);
  return <Studio tt={tt} floor="concrete" photo={0.3} keys={[{ t: 0, p: [0, 1.6, 5.2], l: [0, 1.2, 0], fov: 42 }, { t: 10, p: [0.6, 1.5, 4.8], l: [0.2, 1.2, 0], arc: 0.03 }]}>
    <GDoor3 up={up * 0.85} />
    <group position={[2.2, 1.2, 0.3]}><RB s={[0.6, 0.6, 0.06]} rad={0.02} c="#2a2c31" r={0.5} /><mesh position={[0, 0, 0.032]}><planeGeometry args={[0.55, 0.55]} /><meshBasicMaterial map={lab} toneMapped={false} /></mesh></group>
    <Wall3 p={[0, 1.6, -2.4]} s={[6, 3.4, 0.1]} kind="drywall" />
  </Studio>;
}}</Stage>;

// 5 · las ventanitas son un cuadro: la fila de vidrios se convierte en un marco dorado y adentro la caja fuerte es «la pintura»
export const H3Picframe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const gold = sm(tt, 1.6, 2.8);
  return <Studio tt={tt} floor="concrete" photo={0.35} keys={[{ t: 0, p: [0, 1.5, 5.0], l: [0, 1.4, 0], fov: 42 }, { t: 3.5, p: [0.2, 1.42, 2.2], l: [0.05, 1.42, 0] }, { t: 10, p: [0.3, 1.42, 1.9], l: [0.05, 1.42, 0], arc: 0.02 }]}>
    <GDoor3 />
    <group position={[0, 1.41, 0.07]}>
      {[[0, 0.2, 2.9, 0.07], [0, -0.2, 2.9, 0.07], [-1.42, 0, 0.07, 0.47], [1.42, 0, 0.07, 0.47]].map(([x, y, w, hh], i) => <RB key={i} p={[x, y, 0.02 * gold]} s={[w, hh, 0.05 + 0.04 * gold]} rad={0.01} c="#d4af37" m={gold} r={0.3} op={gold < 0.02 ? 0 : gold} />)}
    </group>
    <pointLight position={[0, 1.4, -1.2]} intensity={3} distance={3} color="#ffe6c4" />
    <Safe3 p={[0.15, 0.62, -1.6]} rot={[0, -0.3, 0]} s={0.9} />
    <RB p={[0.15, 0.31, -1.6]} s={[0.9, 0.62, 0.8]} rad={0.02} c="#8a7a64" r={0.7} />
    <Wall3 p={[0, 1.6, -2.4]} s={[6, 3.4, 0.1]} kind="drywall" />
  </Studio>;
}}</Stage>;

// 6 · el cono de vista desde la entrada: mientras la caja está en el cono, brilla; se corre a la esquina ciega y desaparece de la vista
export const H3Sightcone: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const mv = sm(tt, 2.4, 4.6), x = 0.1 - 1.55 * mv, z = -1.0 - 0.6 * mv, seen = x > -0.75;
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [1.4, 4.4, 3.6], l: [0, 0, -0.8], fov: 42 }, { t: 9.4, p: [0.8, 4.1, 3.2], l: [-0.3, 0, -0.9], arc: 0.03 }]}>
    <RB p={[-2.0, 0.5, -0.8]} s={[0.1, 1.0, 3.0]} rad={0.01} c="#ece7dc" r={0.9} />
    <RB p={[2.0, 0.5, -0.8]} s={[0.1, 1.0, 3.0]} rad={0.01} c="#ece7dc" r={0.9} />
    <RB p={[0, 0.5, -2.3]} s={[4.1, 1.0, 0.1]} rad={0.01} c="#ece7dc" r={0.9} />
    <RB p={[0, 0.03, 0.7]} s={[2.8, 0.06, 0.1]} rad={0.01} c="#d8d2c4" r={0.8} />
    <group position={[0.4, 0.02, 2.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2 - 0.42 + 0.0]}><circleGeometry args={[4.0, 40, 0, 0.66]} /><meshBasicMaterial color={ICE} transparent opacity={0.16} depthWrite={false} /></mesh>
    </group>
    <Person3 p={[0.4, 0, 2.6]} yaw={Math.PI} s={0.7} col="#2a2c31" />
    <group position={[x, 0, z]}>
      <Safe3 s={0.55} />
      {seen && <pointLight position={[0, 0.7, 0.4]} intensity={1.2} distance={1} color={RED} />}
    </group>
  </Studio>;
}}</Stage>;

// 7 · film esmerilado: una lámina blanca se desliza sobre cada vidrio y la caja de adentro se vuelve sombra lechosa
export const H3Frostfilm: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const fr = sm(tt, 0.8, 4.0);
  return <Studio tt={tt} floor="concrete" photo={0.35} keys={[{ t: 0, p: [0.3, 1.45, 2.4], l: [0, 1.41, 0], fov: 40 }, { t: 9, p: [-0.2, 1.42, 2.1], l: [0, 1.41, 0], arc: 0.02 }]}>
    <GDoor3 frost={fr} />
    {[0, 1, 2, 3].map((j) => { const k = c01((fr - j * 0.18) / 0.4), x = -1.05 + j * 0.7; return k > 0 ? <mesh key={j} position={[x - 0.26 + 0.26 * k, 1.41, 0.07]} scale={[k, 1, 1]}><planeGeometry args={[0.52, 0.3]} /><meshStandardMaterial color="#f4f6f8" transparent opacity={0.82} roughness={1} /></mesh> : null; })}
    <pointLight position={[0, 1.4, -1.2]} intensity={3} distance={3} color="#ffe6c4" />
    <Safe3 p={[0.2, 0.62, -1.4]} rot={[0, -0.3, 0]} s={0.9} />
    <RB p={[0.2, 0.31, -1.4]} s={[0.9, 0.62, 0.8]} rad={0.02} c="#8a7a64" r={0.7} />
  </Studio>;
}}</Stage>;

// 8 · dos hombres y un carrito: la palanca del carrito levanta 400 libras casi con un dedo
export const H3Twomen: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const tilt = 0.75 * sm(tt, 1.8, 3.6), lb = useTxt(["400 LB"], 256, 96, "#2a2c31", AMB, 64);
  return <Studio tt={tt} floor="concrete" night={0.4} photo={0.2} keys={[{ t: 0, p: [2.4, 1.4, 2.6], l: [0, 0.6, 0], fov: 40 }, { t: 10, p: [2.0, 1.25, 2.2], l: [0, 0.6, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -1.4]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[0, 0, 0]} rotation={[-tilt, 0, 0]}>
      <Safe3 p={[0, 0.03, 0.15]} rot={[0, Math.PI, 0]} s={0.75} />
      <mesh position={[0, 0.55, 0.42]}><planeGeometry args={[0.3, 0.12]} /><meshStandardMaterial map={lb} /></mesh>
    </group>
    <Dolly3 p={[0, 0, -0.18]} rot={[0, Math.PI, 0]} tilt={tilt} />
    <Person3 p={[0, 0, -0.9 + 0.3 * tilt]} yaw={0} s={0.95} col="#1a1c22" arm={0.7} />
    <Person3 p={[0.85, 0, 0.3]} yaw={-Math.PI / 2} s={0.95} col="#2a2c34" arm={0.3} />
    {tilt > 0.05 && <Arrow3 p={[0, 1.55, -0.55]} rot={[0.8, 0, 0]} L={0.35} col={GRN} />}
  </Studio>;
}}</Stage>;

// 9 · la volcaron sobre la manta, la deslizaron al carrito y subió la rampa a la camioneta
export const H3Tipslide: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const tip = sm(tt, 0.4, 1.8), slide = sm(tt, 2.0, 3.6), ramp = sm(tt, 4.0, 7.0);
  const sx = 0 + 1.2 * slide + 1.8 * ramp, sy = 0.06 + 0.9 * ramp;
  return <Studio tt={tt} floor="concrete" night={0.5} photo={0.15} keys={[{ t: 0, p: [0.5, 2.0, 4.2], l: [0.6, 0.4, 0], fov: 44 }, { t: 11, p: [2.4, 1.8, 3.6], l: [2.0, 0.6, 0], arc: 0.04 }]}>
    <RB p={[0.4, 0.008, 0]} s={[1.4, 0.016, 1.0]} rad={0.004} c="#3a5a8a" r={1} />
    <group position={[sx, sy, 0]} rotation={[0, 0, -Math.PI / 2 * tip + Math.atan2(0.9, 1.8) * ramp * 1]}>
      <Safe3 p={[0, 0, 0]} s={0.7} />
    </group>
    <RB p={[2.2, 0.48, 0]} s={[2.0, 0.04, 0.8]} rad={0.01} rot={[0, 0, Math.atan2(0.9, 1.8)]} c="#9aa0a8" m={1} r={0.4} />
    <group position={[4.0, 0, 0]}>
      <RB p={[0.4, 0.95, 0]} s={[1.6, 0.1, 1.9]} rad={0.02} c="#3a3e46" r={0.5} m={0.4} />
      <RB p={[0.4, 0.5, 0]} s={[1.6, 0.8, 1.9]} rad={0.05} c="#2b4a6b" r={0.4} m={0.4} />
      {[-0.7, 0.7].map((z, i) => <mesh key={i} position={[0.1, 0.32, z * 1.2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.22, 24]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}
    </group>
  </Studio>;
}}</Stage>;

// 10 · una caja con manijas: a la caja suelta le brotan dos manijas de mudanza a los costados
export const H3Handles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const hd = c01(spr(tt, 1.2, 7, 0.45)), hands = sm(tt, 2.8, 3.8), lift = sm(tt, 4.0, 5.0) * 0.12;
  return <Studio tt={tt} floor="concrete" photo={0.25} keys={[{ t: 0, p: [0, 1.3, 2.4], l: [0, 0.55, 0], fov: 38 }, { t: 8, p: [0.5, 1.2, 2.1], l: [0, 0.55, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Safe3 p={[0, lift, 0]} s={0.9} handles={hd} />
    {[-1, 1].map((sd) => <Hand3 key={sd} p={[sd * (0.48 + 0.4 * (1 - hands)), 0.55 + lift, 0]} rot={[0, sd * Math.PI / 2, 0.3]} s={1.2} sleeve="#1a1c22" />)}
  </Studio>;
}}</Stage>;

// 11 · el tope de la póliza: una tapa baja sobre las pilas de efectivo y joyas; lo que queda arriba del tope se cae afuera
export const H3Policycap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const lid = sm(tt, 1.2, 2.6), cap = useTxt(["POLICY LIMIT  $1,500"], 1024, 96, "rgba(0,0,0,0)", RED, 66);
  return <Studio tt={tt} floor="wood" photo={0.25} keys={[{ t: 0, p: [0, 1.4, 2.6], l: [0, 0.5, 0], fov: 38 }, { t: 11, p: [0.5, 1.3, 2.3], l: [0, 0.5, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    {[0, 1, 2, 3, 4].map((i) => { const x = -0.8 + i * 0.4, hgt = [0.25, 0.7, 0.45, 0.9, 0.35][i], cutH = 0.32;
      return <group key={i} position={[x, 0, 0]}>
        {[...Array(Math.round(hgt / 0.04))].map((_, j) => { const y = 0.02 + j * 0.04, over = y > cutH && lid > 0.95, d = Math.max(0, tt - 2.6 - j * 0.03);
          return <RB key={j} p={[over ? 0.05 * (rnd(i * 30 + j) - 0.5) + d * 0.4 : 0, over ? Math.max(0.02, y - 1.5 * d * d) : y, over ? 0.3 * d + 0.4 * d * rnd(j) : 0]} rot={[over ? d * 3 : 0, rnd(i + j) * 0.3, over ? d * 2 : 0]} s={[0.3, 0.035, 0.14]} rad={0.004} c={i % 2 ? "#6a9a5a" : "#d4af37"} r={0.6} m={i % 2 ? 0 : 0.8} />; })}
      </group>; })}
    <RB p={[0, 0.34 + 0.8 * (1 - lid), 0]} s={[2.0, 0.03, 0.4]} rad={0.01} c="#9aa0a8" m={1} r={0.3} op={0.85} />
    {lid > 0.5 && <mesh position={[0, 0.42 + 0.8 * (1 - lid), 0.2]}><planeGeometry args={[1.6, 0.15]} /><meshBasicMaterial map={cap} transparent toneMapped={false} /></mesh>}
  </Studio>;
}}</Stage>;

// 12 · la foto con fecha: el obturador se cierra en iris sobre la mesa de la cocina y queda una polaroid con la fecha
export const H3Tablephoto: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const shut = c01(1 - Math.abs(tt - 2.0) / 0.35), out = sm(tt, 2.4, 3.6), dt = useTxt(["OCT 29 2026"], 512, 96, "#fbfaf6", "#2a2c31", 54);
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 2.0, 1.6], l: [0, 0.1, 0], fov: 40 }, { t: 10, p: [0.3, 1.8, 1.4], l: [0, 0.1, 0.1], arc: 0.03 }]}>
    {[0, 1, 2, 3, 4].map((i) => <RB key={i} p={[-0.5 + i * 0.22, 0.02 + (i % 2) * 0.01, -0.2 + rnd(i) * 0.2]} rot={[0, rnd(i, 2), 0]} s={[0.18, 0.02, 0.1]} rad={0.004} c={["#d4af37", "#6a9a5a", "#c9ced4", "#2a2c31", "#d4af37"][i]} r={0.5} m={0.6} />)}
    <RB p={[0.55, 0.02, 0.0]} s={[0.24, 0.04, 0.3]} rad={0.01} c="#3a2a20" r={0.6} />
    {/* polaroid que sale */}
    <group position={[0, 0.03 + 0.25 * out, 0.3 + 0.2 * out]} rotation={[-Math.PI / 2 + 1.0 * out, 0, 0.1]} scale={out > 0 ? 1 : 0.001}>
      <RB s={[0.36, 0.42, 0.006]} rad={0.004} c="#fbfaf6" r={0.8} />
      <mesh position={[0, 0.03, 0.004]}><planeGeometry args={[0.32, 0.3]} /><meshStandardMaterial color="#5a6a70" roughness={0.6} /></mesh>
      {[0, 1, 2].map((i) => <RB key={i} p={[-0.08 + i * 0.08, 0.03, 0.006]} s={[0.06, 0.03, 0.004]} rad={0.002} c={["#d4af37", "#6a9a5a", "#c9ced4"][i]} r={0.5} />)}
      <mesh position={[0, -0.16, 0.004]}><planeGeometry args={[0.3, 0.06]} /><meshBasicMaterial map={dt} /></mesh>
    </group>
    {/* las hojas del iris del obturador, alrededor del cuadro */}
    {shut > 0 && [...Array(6)].map((_, i) => { const a = (i / 6) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * (1.4 - 1.0 * shut), 1.2, Math.sin(a) * (1.4 - 1.0 * shut) + 0.0]} rotation={[-Math.PI / 2, 0, a + 1.2]}><planeGeometry args={[1.6, 0.9]} /><meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} /></mesh>; })}
  </Studio>;
}}</Stage>;

// 13 · la esquina baja: el piso del garage se inclina apenas y las gotas ruedan todas hacia la esquina donde está la caja
export const H3Lowcorner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const tilt = 0.06 * sm(tt, 0.4, 1.6), roll = c01((tt - 1.6) / 4.5);
  return <Studio tt={tt} floor="none" photo={0} keys={[{ t: 0, p: [1.8, 3.2, 3.0], l: [0, 0, 0], fov: 40 }, { t: 10, p: [1.2, 2.6, 2.4], l: [-0.6, 0, -0.5], arc: 0.03 }]}>
    <group rotation={[tilt, 0, tilt]}>
      <RB p={[0, -0.05, 0]} s={[3, 0.1, 2.4]} rad={0.01} c="#a8a59c" r={0.95} />
      <Safe3 p={[-1.15, 0, -0.85]} s={0.55} />
      {[...Array(14)].map((_, i) => { const x0 = -1.2 + rnd(i) * 2.6, z0 = -1.0 + rnd(i, 2) * 2.0, k = c01(roll * (0.8 + 0.4 * rnd(i, 3))); const x = x0 + (-1.0 - x0) * k, z = z0 + (-0.55 - z0) * k;
        return <mesh key={i} position={[x, 0.02, z]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.04, 16, 12]} /><meshPhysicalMaterial color="#9fd3ff" transmission={0.6} roughness={0.05} transparent opacity={0.8} /></mesh>; })}
      <mesh position={[-1.0, 0.003, -0.55]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05 + roll}><circleGeometry args={[0.5, 32]} /><meshPhysicalMaterial color="#6fa8d8" roughness={0.05} transparent opacity={0.55} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 14 · la pared de la caja es una esponja: corte de la puerta; el relleno gris guarda gotitas que salen hacia adentro, donde están los papeles
export const H3Sponge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const show = sm(tt, 0.4, 1.4), drip = c01((tt - 2.0) / 5);
  return <Studio tt={tt} floor="none" photo={0.25} keys={[{ t: 0, p: [0.2, 0.25, 2.1], l: [0, 0, 0], fov: 36 }, { t: 10, p: [0.5, 0.2, 1.8], l: [0.1, 0, 0], arc: 0.03 }]}>
    <RB p={[-0.55, 0, 0]} s={[0.04, 1.2, 0.5]} rad={0.004} c="#3d4148" m={0.6} r={0.35} />
    <RB p={[0.05, 0, 0]} s={[0.04, 1.2, 0.5]} rad={0.004} c="#3d4148" m={0.6} r={0.35} />
    <RB p={[-0.25, 0, 0]} s={[0.56, 1.2 * show, 0.48]} rad={0.004} c="#9a9a94" r={1} />
    {[...Array(40)].map((_, i) => <mesh key={i} position={[-0.5 + rnd(i) * 0.5, -0.55 + rnd(i, 2) * 1.1, 0.245]}><circleGeometry args={[0.012 + 0.012 * rnd(i, 3), 8]} /><meshBasicMaterial color="#6e6e68" /></mesh>)}
    {[...Array(9)].map((_, i) => { const k = c01(drip * 1.6 - i * 0.07), y0 = 0.45 - i * 0.1; return k > 0 ? <mesh key={i} position={[0.07 + 0.35 * k, y0 - 0.25 * k * k, 0.1]}><sphereGeometry args={[0.022, 12, 10]} /><meshPhysicalMaterial color="#9fd3ff" transmission={0.5} roughness={0.05} transparent opacity={0.9} /></mesh> : null; })}
    {[0, 1, 2].map((i) => <RB key={i} p={[0.45, -0.25 + i * 0.012, 0.0]} rot={[0, 0, -0.04 * i]} s={[0.4, 0.008, 0.3]} rad={0.002} c={drip > 0.6 ? "#d8cfb8" : "#fbfaf6"} r={0.9} />)}
  </Studio>;
}}</Stage>;

// 15 · los círculos mojados: termotanque, lavarropas y pileta irradian anillos de agua por el piso; la caja salta afuera de todos
export const H3Wetrings: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const jump = sm(tt, 3.6, 4.6), jx = -0.1 + 1.6 * jump, jy = 0.6 * Math.sin(Math.PI * jump);
  return <Studio tt={tt} floor="concrete" photo={0} keys={[{ t: 0, p: [0.4, 3.6, 3.2], l: [0.1, 0, -0.3], fov: 42 }, { t: 10, p: [0.9, 3.2, 2.8], l: [0.4, 0, -0.3], arc: 0.03 }]}>
    <Heater3 p={[-1.4, 0, -0.9]} s={0.9} />
    <group position={[-0.4, 0, -1.0]}><RB p={[0, 0.42, 0]} s={[0.6, 0.84, 0.6]} rad={0.04} c="#f2f2f0" r={0.4} /><mesh position={[0, 0.5, 0.301]}><circleGeometry args={[0.18, 32]} /><Mat c="#2a2c31" m={0.6} r={0.2} /></mesh></group>
    <group position={[0.6, 0, -1.0]}><RB p={[0, 0.4, 0]} s={[0.6, 0.8, 0.5]} rad={0.03} c="#e8e6e0" r={0.4} /></group>
    {[[-1.4, -0.9], [-0.4, -1.0], [0.6, -1.0]].map(([x, z], i) => <Rings3 key={i} p={[x, 0.02, z]} k={(tt * 0.5 + i * 0.3) % 1} n={3} r={1.3} col={ICE} op={0.7} />)}
    <Safe3 p={[jx, jy, 0.4]} s={0.5} />
  </Studio>;
}}</Stage>;

export const HEROES_3 = { slabcore: H3Slabcore, doordown: H3Doordown, eyescan: H3Eyescan, dozencycles: H3Dozencycles, picframe: H3Picframe, sightcone: H3Sightcone, frostfilm: H3Frostfilm, twomen: H3Twomen, tipslide: H3Tipslide, handles: H3Handles, policycap: H3Policycap, tablephoto: H3Tablephoto, lowcorner: H3Lowcorner, sponge: H3Sponge, wetrings: H3Wetrings };
