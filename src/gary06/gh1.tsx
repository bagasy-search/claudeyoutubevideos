// gary06 · componentes únicos 1/4 (min 0-5). Cada uno es UN objeto que hace la idea sin leer; el texto va sobre la pieza.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, curve, lerp, tubeG } from "./h3d";
import { PI, Txt3, Mark, Fridge, Bulb, PBox } from "./gk";
import { Fan } from "./fk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);
const q = (x: number, s = 0.02) => Math.round(x / s) * s;
// los primeros u (0..1) de un camino, en puntos (para cables y humo que avanzan)
export const part = (key: string, pts: number[][], u: number, n = 24) => { const c = curve(pts), uu = Math.max(0.02, q(cl(u))); return { k: key + uu.toFixed(2), p: Array.from({ length: n + 1 }, (_, i) => c.getPoint(uu * i / n).toArray()) }; };
const Tube: React.FC<{ id: string; pts: number[][]; u?: number; r: number; children: React.ReactNode }> = ({ id, pts, u = 1, r, children }) => {
  const p = part(id, pts, u); return <mesh geometry={tubeG(p.k, p.p, r, 60, 8)} castShadow>{children}</mesh>;
};
// enchufe macho (dos patas planas + tierra); heat = las patas al rojo (vivas)
export const MalePlug: React.FC<{ heat?: number; p?: V; r?: V; s?: number; col?: string }> = ({ heat = 0, p = [0, 0, 0], r = [0, 0, 0], s = 1, col = "#e07a1f" }) =>
  <group position={p} rotation={r} scale={s}>
    <RBox s={[0.06, 0.07, 0.05]} r={0.01}>{M.rubber({ col })}</RBox>
    {[-0.014, 0.014].map((x) => <mesh key={x} position={[x, 0.008, 0.045]}><boxGeometry args={[0.005, 0.016, 0.042]} /><meshStandardMaterial color="#d9a84a" metalness={1} roughness={0.25} emissive="#ff3a1a" emissiveIntensity={3 * heat} toneMapped={false} /></mesh>)}
    <mesh position={[0, -0.016, 0.045]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0045, 0.0045, 0.042, 10]} /><meshStandardMaterial color="#d9a84a" metalness={1} roughness={0.25} emissive="#ff3a1a" emissiveIntensity={3 * heat} toneMapped={false} /></mesh>
  </group>;
// toma de pared (placa blanca con dos bocas)
export const Outlet: React.FC<{ p?: V; r?: V; s?: number; dead?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, dead = 0 }) =>
  <group position={p} rotation={r} scale={s}>
    <RBox s={[0.1, 0.16, 0.012]} r={0.006}>{M.plastic({ col: "#efece4" })}</RBox>
    {[0.035, -0.035].map((y) => <group key={y} position={[0, y, 0.007]}>
      <mesh><circleGeometry args={[0.024, 24]} /><meshStandardMaterial color="#e2ddd2" /></mesh>
      {[-0.009, 0.009].map((x) => <mesh key={x} position={[x, 0.004, 0.001]}><planeGeometry args={[0.004, 0.012]} /><meshBasicMaterial color="#111" /></mesh>)}
      <mesh position={[0, -0.01, 0.001]}><circleGeometry args={[0.004, 10]} /><meshBasicMaterial color="#111" /></mesh>
    </group>)}
    <mesh position={[0, 0.072, 0.008]}><circleGeometry args={[0.005, 10]} /><meshStandardMaterial color="#300" emissive="#ff3a2a" emissiveIntensity={2 * dead} toneMapped={false} /></mesh>
  </group>;
// generador portátil (marco negro, tanque naranja, caño de escape); run = vibra
export const Gen: React.FC<{ t: number; run?: number; p?: V; r?: V; s?: number }> = ({ t, run = 1, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={r} scale={s}>
    <group position={[0.003 * run * Math.sin(t * 60), 0, 0]}>
      <RBox s={[0.42, 0.26, 0.28]} p={[0, 0.17, 0]} r={0.03}>{M.plastic({ col: "#e5761c" })}</RBox>
      <RBox s={[0.3, 0.06, 0.2]} p={[0, 0.32, 0]} r={0.02}>{M.plastic({ col: "#d06814" })}</RBox>
      {[-1, 1].map((x) => <mesh key={x} position={[x * 0.23, 0.2, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.12, 0.012, 8, 24, PI]} />{M.steel({ col: "#2a2c30" })}</mesh>)}
      <mesh position={[0.24, 0.12, 0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.08, 12]} />{M.steel({ col: "#5a5d62" })}</mesh>
      <mesh position={[0, 0.17, 0.142]}><planeGeometry args={[0.16, 0.08]} />{M.matte({ col: "#1c1d20" })}</mesh>
    </group>
    {[-1, 1].map((x) => <mesh key={"w" + x} position={[x * 0.17, 0.04, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.3, 18]} />{M.rubber({ col: "#1c1d20" })}</mesh>)}
  </group>;
// bocanada de humo gris que sube y se abre desde [x,y,z] (ciclo cada per s)
export const Puffs: React.FC<{ tt: number; p: V; n?: number; per?: number; dir?: V; op?: number; col?: string; s?: number }> = ({ tt, p, n = 5, per = 1.4, dir = [0.25, 0.35, 0], op = 0.5, col = "#9aa0a6", s = 1 }) => <>
  {Array.from({ length: n }, (_, i) => { const u = ((tt + i * per / n) % per) / per;
    return <mesh key={i} position={[p[0] + dir[0] * u, p[1] + dir[1] * u, p[2] + dir[2] * u]} scale={z1(s * (0.03 + 0.09 * u))}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color={col} transparent opacity={op * Math.sin(PI * u)} depthWrite={false} roughness={1} /></mesh>; })}
</>;

// 0:05 · EL CABLE QUE ENGORDA DE HIELO: dos postes en el amanecer; el hielo crece en capas alrededor del cable, que se comba;
// se corta y cae; atrás las tres granjas se apagan de a una. «COUNTY DARK · 2 DAYS».
export const HIceLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1a2230"
  cam={{ at: [0, 0.5, 0], az: [-0.18, 0.12], el: [0.1, 0.06], r: [2.2, 1.95], fov: 36 }}>{(tt) => {
  const g = eio(tt, 0.4, 3.6), sag = q(lerp(0.06, 0.26, eio(tt, 0.5, 4.0)), 0.01), snap = tt > 4.3, fall = phys(tt, 4.3, 5, 0.5);
  const span = Array.from({ length: 13 }, (_, j) => { const x = -0.7 + 1.4 * j / 12, u = 2 * j / 12 - 1; return [x, 0.92 - sag * (1 - u * u), 0]; });
  const half = (sd: number) => [[sd * 0.7, 0.92, 0], [sd * lerp(0.4, 0.62, fall), lerp(0.7, 0.45, fall), 0.02], [sd * lerp(0.1, 0.56, fall), lerp(0.62, 0.02, fall), 0.04]];
  const off = (i: number) => (tt > 4.7 + i * 0.35 ? 0 : 1);
  return <>
    <mesh position={[0, 0.7, -1.4]}><planeGeometry args={[5, 2.2]} /><meshBasicMaterial color="#3a4a66" toneMapped={false} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#dfe8f2" roughness={0.9} /></mesh>
    {[-0.7, 0.7].map((x) => <group key={x}>
      <mesh position={[x, 0.5, 0]}><cylinderGeometry args={[0.025, 0.032, 1.0, 14]} />{M.wood({ base: [92, 70, 50] })}</mesh>
      <mesh position={[x, 0.94, 0]}><boxGeometry args={[0.32, 0.03, 0.03]} />{M.wood({ base: [92, 70, 50] })}</mesh>
    </group>)}
    {!snap ? <>
      <mesh geometry={tubeG("ice_w" + sag, span, 0.005, 60, 6)}>{M.matte({ col: "#1c1d20" })}</mesh>
      <mesh geometry={tubeG("ice_i" + sag + q(g, 0.05), span, 0.006 + 0.026 * q(g, 0.05), 60, 12)}>{M.glass({ col: "#dff3ff", op: 0.6 })}</mesh>
    </> : [-1, 1].map((sd) => <mesh key={sd} geometry={tubeG("ice_h" + sd + q(fall, 0.05), half(sd), 0.008, 40, 8)}>{M.matte({ col: "#2a2c30" })}</mesh>)}
    {[-0.6, 0, 0.6].map((x, i) => <group key={i} position={[x, 0, -0.75]}>
      <RBox s={[0.26, 0.18, 0.2]} p={[0, 0.09, 0]} r={0.01}>{M.matte({ col: "#7a5a46" })}</RBox>
      <mesh position={[0, 0.22, 0]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.2, 0.2, 0.21]} />{M.matte({ col: "#3a3f48" })}</mesh>
      {[-0.06, 0.06].map((wx) => <mesh key={wx} position={[wx, 0.1, 0.101]}><planeGeometry args={[0.07, 0.07]} /><meshStandardMaterial color="#1a1a1a" emissive="#ffc46a" emissiveIntensity={3.2 * off(i)} toneMapped={false} /></mesh>)}
    </group>)}
    <Txt3 txt="COUNTY DARK · 2 DAYS" w={1.1} h={0.13} col="#ffffff" bg="#c4161c" p={[0, 0.68, 0.3]} op={cl((tt - 4.9) / 0.25)} />
  </>;
}}</Scene3D>;

export const mini = (i: number, tt: number) => {
  switch (i) {
    case 0: return <><MalePlug s={0.7} p={[-0.03, 0.03, 0]} r={[0, -0.6, 0]} /><MalePlug s={0.7} p={[0.03, 0.03, 0]} r={[0, 0.6 + PI, 0]} /></>;
    case 1: return <Gen t={tt} s={0.25} />;
    case 2: return <><RBox s={[0.1, 0.09, 0.08]} p={[0, 0.045, 0]} r={0.006}>{M.porcelain({ col: "#e6e3dc" })}</RBox><mesh position={[0, 0.03, 0.05]} rotation={[-1.2, 0, 0]}><planeGeometry args={[0.08, 0.05]} /><meshStandardMaterial color="#1c1d20" emissive="#ff6a20" emissiveIntensity={0.8} /></mesh></>;
    case 3: return <Fridge s={0.18} />;
    case 4: return <><RBox s={[0.1, 0.08, 0.04]} p={[0, 0.05, 0]} r={0.008}>{M.plastic({ col: "#c62a22" })}</RBox><mesh position={[0, 0.05, 0.021]}><planeGeometry args={[0.07, 0.045]} /><meshStandardMaterial color="#3a2a22" emissive="#ff6a20" emissiveIntensity={1.4} toneMapped={false} /></mesh></>;
    case 5: return <><mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />{M.porcelain({ col: "#f3ead6" })}</mesh><mesh position={[0, 0.095, 0]} scale={[1, 1 + 0.1 * Math.sin(tt * 9), 1]}><coneGeometry args={[0.01, 0.03, 10]} />{M.glow({ col: "#ffb34a" })}</mesh></>;
    default: return <><RBox s={[0.12, 0.08, 0.012]} p={[0, 0.06, 0]} r={0.004}>{M.matte({ col: "#1c1d20" })}</RBox><mesh position={[0, 0.06, 0.007]}><planeGeometry args={[0.105, 0.065]} /><meshStandardMaterial color="#0d1218" emissive="#3a6aff" emissiveIntensity={0.5} /></mesh><mesh position={[0, 0.01, 0]}><boxGeometry args={[0.03, 0.02, 0.03]} />{M.matte({ col: "#1c1d20" })}</mesh></>;
  }
};
// 0:58 · LAS SIETE GAVETAS: un mueble de taller con siete cajones numerados; se abren de a uno con su cosa adentro
// (cable de dos machos, generador, horno, heladera, estufa, vela, tele) y a cada uno le cae la X roja. «7 THINGS I'LL NEVER DO».
export const HSevenDrawers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="wood" bg="#0f0d0b"
  cam={{ at: [0, 0.32, 0.1], az: [-0.08, 0.06], el: [0.36, 0.3], r: [2.3, 2.1], fov: 34 }}>{(tt) => <>
  <RBox s={[1.62, 0.36, 0.36]} p={[0, 0.18, -0.02]} r={0.015}>{M.wood({ base: [110, 74, 44] })}</RBox>
  {Array.from({ length: 7 }, (_, i) => { const x = -0.69 + i * 0.23, a = 0.4 + i * 0.62, op = eio(tt, a, a + 0.35), mk = cl((tt - a - 0.35) / 0.3);
    return <group key={i}>
      <group position={[x, 0.2, 0.17 + 0.22 * op]}>
        <RBox s={[0.21, 0.26, 0.02]} p={[0, 0, 0]} r={0.008}>{M.wood({ base: [138, 96, 60] })}</RBox>
        <mesh position={[0, 0.07, 0.014]}><boxGeometry args={[0.07, 0.014, 0.014]} />{M.brass()}</mesh>
        <Txt3 txt={String(i + 1)} w={0.08} h={0.08} col="#f2e6cc" p={[0, -0.04, 0.012]} />
        <mesh position={[0, -0.12, -0.11]}><boxGeometry args={[0.2, 0.01, 0.22]} />{M.wood({ base: [96, 64, 38] })}</mesh>
        <group position={[0, -0.115 + 0.31 * op, -0.04]} scale={z1(2.4 * op)}>{mini(i, tt)}</group>
        <Mark k={mk} p={[0, 0.0, 0.03]} s={0.9} />
      </group>
    </group>; })}
  <Txt3 txt="7 THINGS I'LL NEVER DO" w={1.2} h={0.13} col="#f2c21b" glow p={[0, 0.02, 0.62]} r={[-PI / 2 + 0.5, 0, 0]} op={cl((tt - 0.3) / 0.35)} />
</>}</Scene3D>;

// 2:03 · EL CABLE DE DOS MACHOS: el cable naranja en S sobre el banco con un enchufe macho en cada punta; una punta entra en la
// toma de la pared y las patas de la otra se ponen al rojo, desnudas en el aire. «BOTH ENDS LIVE».
export const HTwoPlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0f1012"
  cam={{ at: [0.05, 0.2, 0.05], az: [-0.25, 0.05], el: [0.32, 0.24], r: [1.45, 1.3], fov: 34 }}>{(tt) => {
  const ins = eio(tt, 1.2, 2.0), live = cl((tt - 2.1) / 0.5) * (0.75 + 0.25 * Math.sin(tt * 5));
  const px = lerp(-0.42, -0.56, ins);
  const cord = [[px + 0.04, 0.24, 0.0], [-0.3, 0.05, 0.12], [-0.05, 0.012, 0.25], [0.2, 0.012, 0.05], [0.38, 0.03, 0.12], [0.46, 0.05, 0.16]];
  return <>
    <mesh position={[-0.62, 0.4, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[1.2, 0.8]} /><meshStandardMaterial color="#d8d0c0" roughness={0.9} /></mesh>
    <Outlet p={[-0.615, 0.25, 0]} r={[0, PI / 2, 0]} s={1.4} />
    <mesh geometry={tubeG("tp_c" + q(ins), cord, 0.012, 80, 10)} castShadow>{M.rubber({ col: "#e07a1f" })}</mesh>
    <MalePlug p={[px, 0.25, 0]} r={[0, -PI / 2, 0]} s={1.4} />
    <MalePlug p={[0.5, 0.06, 0.18]} r={[0.2, 0.9, 0]} s={1.6} heat={live} />
    <pointLight position={[0.56, 0.1, 0.26]} intensity={1.4 * live} distance={0.5} color="#ff6a3a" />
    <Txt3 txt="MALE" w={0.2} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[-0.4, 0.38, 0.05]} op={cl((tt - 0.4) / 0.3)} />
    <Txt3 txt="MALE" w={0.2} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0.36, 0.2, 0.2]} op={cl((tt - 0.7) / 0.3)} />
    <Txt3 txt="BOTH ENDS LIVE" w={0.62} h={0.09} col="#f7f4ee" bg="#b3221b" p={[0.25, 0.44, 0.1]} op={cl((tt - 2.6) / 0.3)} />
  </>;
}}</Scene3D>;

// 2:47 · EL CARTEL «DEAD» DEL LINIERO: en la cruceta del poste cuelga la tarjeta roja «DEAD»; desde la casa llega por el cable un pulso
// de luz y la tarjeta gira con resorte: del otro lado dice «LIVE». El casco amarillo del liniero en la cruceta.
export const HDeadTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#141a24"
  cam={{ at: [0.12, 0.82, 0], az: [-0.3, 0.1], el: [0.05, 0.02], r: [1.2, 1.05], fov: 34 }}>{(tt) => {
  const fl = phys(tt, 2.6, 6, 0.35), rot = PI * fl, pul = (u: number) => lerp(1.2, 0.0, u);
  return <>
    <mesh position={[0, 0.8, -1.2]}><planeGeometry args={[5, 3]} /><meshBasicMaterial color="#2a3550" toneMapped={false} /></mesh>
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.035, 0.04, 1.2, 16]} />{M.wood({ base: [92, 70, 50] })}</mesh>
    <mesh position={[0, 0.95, 0]}><boxGeometry args={[0.7, 0.04, 0.04]} />{M.wood({ base: [92, 70, 50] })}</mesh>
    {[-0.3, 0.3].map((x) => <mesh key={x} position={[x, 0.99, 0]}><cylinderGeometry args={[0.015, 0.022, 0.05, 12]} />{M.porcelain({ col: "#7aa7c8" })}</mesh>)}
    <mesh geometry={tubeG("dt_w", [[0.3, 1.02, 0], [0.8, 0.98, 0.05], [1.4, 0.9, 0.1]], 0.005, 40, 6)}>{M.matte({ col: "#1c1d20" })}</mesh>
    <mesh geometry={tubeG("dt_w2", [[-0.3, 1.02, 0], [-0.8, 0.98, 0.05], [-1.4, 0.9, 0.1]], 0.005, 40, 6)}>{M.matte({ col: "#1c1d20" })}</mesh>
    {[0, 1, 2].map((i) => { const u = cl((tt - 0.8 - i * 0.55) / 0.9); return <mesh key={i} position={[0.3 + pul(1 - u) * 0.9, 1.02 - 0.06 * (1 - u), 0.06 * (1 - u)]} scale={z1(u > 0 && u < 1 ? 1 : 0.001)}><sphereGeometry args={[0.014, 12, 10]} />{M.glow({ col: "#ffd25a" })}</mesh>; })}
    <group position={[0.3, 0.93, 0.02]}>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />{M.matte({ col: "#1c1d20" })}</mesh>
      <group position={[0, -0.2, 0]} rotation={[0, rot, 0.06 * Math.sin(tt * 3)]} scale={1.7}>
        <mesh><boxGeometry args={[0.2, 0.13, 0.004]} />{M.matte({ col: "#f3efe6" })}</mesh>
        <Txt3 txt="DEAD" w={0.18} h={0.1} col="#f7f4ee" bg="#2a6a3a" p={[0, 0, 0.003]} />
        <Txt3 txt="LIVE" w={0.18} h={0.1} col="#f7f4ee" bg="#b3221b" p={[0, 0, -0.003]} r={[0, PI, 0]} />
      </group>
    </group>
    <group position={[-0.18, 0.99, 0]} scale={1.6}>
      <mesh scale={[1, 0.75, 1]}><sphereGeometry args={[0.06, 24, 14, 0, 2 * PI, 0, PI / 2]} />{M.plastic({ col: "#f2c21b" })}</mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.055, 0.078, 30]} />{M.plastic({ col: "#e0b010", side: 2 })}</mesh>
    </group>
    <Txt3 txt="FROM A HOUSE" w={0.5} h={0.07} col="#ffd25a" glow p={[0.45, 1.1, 0.08]} op={cl((tt - 1.0) / 0.3) * (1 - cl((tt - 2.4) / 0.3))} />
  </>;
}}</Scene3D>;

// 3:06 · LAS PATAS DESNUDAS Y LOS TRES CABLES: la punta suelta con las patas vivas; el buscapolo se acerca y se enciende rojo.
// Después, tres cables en fila sobre el banco: en cada uno se abre una quemadura negra con humito, de a una. «3 OF 3 MELTED».
export const HThreeCords: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0f11"
  cam={{ at: [-0.3, 0.12, 0], at1: [0.25, 0.08, 0], az: [-0.2, 0.15], el: [0.42, 0.36], r: [1.25, 1.35], fov: 34 }}>{(tt) => {
  const pen = eio(tt, 0.6, 1.4), touch = cl((tt - 1.35) / 0.15) * (1 - cl((tt - 2.6) / 0.2));
  return <>
    <mesh geometry={tubeG("tc_free", [[-1.0, 0.012, -0.2], [-0.7, 0.012, 0.0], [-0.55, 0.04, 0.05]], 0.018, 40, 8)}>{M.rubber({ col: "#e07a1f" })}</mesh>
    <MalePlug p={[-0.5, 0.05, 0.06]} r={[0, PI / 2, 0]} s={1.5} heat={0.8 + 0.2 * Math.sin(tt * 6)} />
    <group position={[lerp(-0.1, -0.38, pen), 0.07, 0.06]} rotation={[0, 0, PI / 2]}>
      <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.012, 0.012, 0.18, 14]} />{M.plastic({ col: "#2b6fd6" })}</mesh>
      <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.011, 0.06, 14]} /><meshPhysicalMaterial color="#ffd0c8" transparent opacity={0.8} emissive="#ff2a1a" emissiveIntensity={3 * touch} toneMapped={false} /></mesh>
    </group>
    <Txt3 txt="LIVE · BARE" w={0.4} h={0.07} col="#f7f4ee" bg="#b3221b" p={[-0.36, 0.24, 0.06]} op={cl((tt - 1.5) / 0.3)} />
    {[0, 1, 2].map((i) => { const z = -0.15 + i * 0.14, a = 2.9 + i * 0.75, b = eio(tt, a, a + 0.5), xb = [0.1, 0.32, 0.2][i];
      return <group key={i}>
        <mesh geometry={tubeG("tc_c" + i, [[-0.1, 0.012, z], [0.2, 0.014, z + 0.01], [0.6, 0.018, z]], 0.019, 40, 8)} receiveShadow>{M.rubber({ col: ["#7a5a3a", "#efece4", "#7a5a3a"][i] })}</mesh>
        <mesh position={[xb, 0.014, z]} scale={[z1(b * 1.6), z1(b * 0.9), z1(b * 1.1)]}><sphereGeometry args={[0.022, 16, 12]} />{M.matte({ col: "#151210" })}</mesh>
        <mesh position={[xb, 0.002, z]} rotation={[-PI / 2, 0, 0]} scale={z1(b)}><circleGeometry args={[0.05, 24]} /><meshStandardMaterial color="#2a1a10" transparent opacity={0.7} depthWrite={false} /></mesh>
        <Puffs tt={tt} p={[xb, 0.03, z]} n={3} per={1.6} dir={[0.03, 0.18, 0]} op={0.35 * b} s={0.6} />
        <Txt3 txt={String(i + 1)} w={0.07} h={0.07} col="#ffb34a" glow p={[xb, 0.1, z]} op={b} />
      </group>; })}
    <Txt3 txt="3 OF 3 MELTED" w={0.5} h={0.08} col="#f7f4ee" bg="#1b1d21" p={[0.25, 0.25, -0.05]} op={cl((tt - 4.9) / 0.3)} />
  </>;
}}</Scene3D>;

const Breaker: React.FC<{ on: number; p: V; w?: number; label: string; tint?: string }> = ({ on, p, w = 0.12, label, tint = "#1c1d20" }) => <group position={p}>
  <RBox s={[w, 0.16, 0.05]} r={0.008}>{M.plastic({ col: tint })}</RBox>
  <group position={[0, 0, 0.03]} rotation={[lerp(0.55, -0.55, on), 0, 0]}><mesh position={[0, 0, 0.025]}><boxGeometry args={[w * 0.5, 0.03, 0.05]} />{M.plastic({ col: "#2a2c30" })}</mesh></group>
  <Txt3 txt={label} w={0.27} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[0, -0.17, 0.09]} />
  <Txt3 txt={on > 0.5 ? "ON" : "OFF"} w={0.12} h={0.055} col={on > 0.5 ? "#6fe39a" : "#ff6a5a"} glow p={[0, 0.11, 0.03]} />
</group>;
// 3:22 · EL INTERLOCK: el tablero con la llave MAIN arriba y la del GENERATOR al lado; MAIN baja, la chapa de acero sube deslizando y
// tapa la palanca de MAIN; recién ahí sube GENERATOR. MAIN intenta subir y choca con la chapa: X. «ONLY ONE CAN BE ON».
export const HInterlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#0e1013"
  cam={{ at: [0.02, 0.6, 0], az: [-0.16, 0.1], el: [0.06, 0.03], r: [1.1, 1.0], fov: 34 }}>{(tt) => {
  const mOff = eio(tt, 0.5, 0.9), sl = eio(tt, 1.2, 1.9), gOn = eio(tt, 2.2, 2.6), tryk = tt > 3.2 && tt < 4.2 ? 0.25 * Math.abs(Math.sin((tt - 3.2) * 9)) * (1 - (tt - 3.2)) : 0;
  const main = cl(1 - mOff + tryk);
  return <>
    <RBox s={[0.7, 0.8, 0.06]} p={[0, 0.5, -0.04]} r={0.02}>{M.steel({ col: "#9aa0a6" })}</RBox>
    <mesh position={[0, 0.5, -0.008]}><planeGeometry args={[0.6, 0.7]} />{M.matte({ col: "#3a3d42" })}</mesh>
    <Breaker on={main} p={[-0.15, 0.62, 0.02]} w={0.16} label="MAIN" />
    <Breaker on={gOn} p={[0.17, 0.62, 0.02]} label="GENERATOR" tint="#5a1a14" />
    <group position={[lerp(0.17, -0.04, sl), 0.62, 0.075]}>
      <RBox s={[0.1, 0.24, 0.008]} r={0.006}>{M.steel({ col: "#d9dcdf" })}</RBox>
      {[-0.09, 0.09].map((y) => <mesh key={y} position={[0, y, 0.006]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.006, 12]} />{M.chrome()}</mesh>)}
      <Txt3 txt="INTERLOCK" w={0.09} h={0.025} col="#1b1d21" p={[0, 0, 0.0055]} r={[0, 0, PI / 2]} />
    </group>
    <Mark k={cl((tt - 3.5) / 0.4)} p={[-0.15, 0.62, 0.12]} s={0.5} />
    <Txt3 txt="ONLY ONE CAN BE ON" w={0.66} h={0.085} col="#0e1013" bg="#6fe39a" p={[0.02, 0.35, 0.1]} op={cl((tt - 4.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 3:41 · CABLES DIRECTOS: la batería en el piso; tres cables salen como víboras hasta la heladera, la lámpara y el ventilador y cada
// uno se prende al llegar; la toma de la pared queda con su X. «NO HOUSE WIRING».
export const HStraightCords: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0f0f10"
  cam={{ at: [0, 0.22, 0], az: [-0.2, 0.15], el: [0.42, 0.34], r: [1.85, 1.65], fov: 34 }}>{(tt) => {
  const T = [0.6, 1.4, 2.2], u = (i: number) => eio(tt, T[i], T[i] + 0.8), on = (i: number) => cl((tt - T[i] - 0.8) / 0.2);
  const P: number[][][] = [[[0, 0.02, 0.1], [-0.25, 0.012, 0.15], [-0.48, 0.012, -0.05], [-0.55, 0.05, -0.2]],
    [[0.05, 0.02, 0.1], [0.05, 0.012, 0.32], [0.05, 0.03, 0.42]], [[0.1, 0.02, 0.05], [0.35, 0.012, 0.1], [0.5, 0.012, -0.1], [0.55, 0.05, -0.2]]];
  return <>
    <PBox p={[0, 0, 0]} s={0.9} scr="78%" on={1} />
    {P.map((pts, i) => <Tube key={i} id={"sc" + i} pts={pts} u={u(i)} r={0.009}>{M.rubber({ col: "#1c1d20" })}</Tube>)}
    <group position={[-0.6, 0, -0.3]}><Fridge s={0.9} lit={on(0)} /></group>
    <group position={[0.05, 0, 0.45]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />{M.brass()}</mesh>
      <Bulb on={on(1)} p={[0, 0.22, 0]} s={1.4} />
      <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.05, 0.05, 0.012, 20]} />{M.brass()}</mesh>
    </group>
    <group position={[0.6, 0.16, -0.3]}>
      <Fan rot={tt * 14 * on(2)} r={0.09} />
      <mesh position={[0, -0.08, -0.02]}><cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />{M.matte({ col: "#2a2c30" })}</mesh>
    </group>
    <mesh position={[0, 0.5, -0.7]}><planeGeometry args={[2.4, 1.2]} /><meshStandardMaterial color="#cbbfa8" roughness={0.9} /></mesh>
    <Outlet p={[-0.1, 0.35, -0.69]} s={1.5} />
    <Mark k={cl((tt - 3.2) / 0.4)} p={[-0.1, 0.35, -0.66]} s={1.0} />
    <Txt3 txt="NO HOUSE WIRING" w={0.62} h={0.09} col="#0e1013" bg="#6fe39a" p={[0.2, 0.62, -0.66]} op={cl((tt - 3.6) / 0.3)} />
  </>;
}}</Scene3D>;

const Car: React.FC<{ p: V; col: string; s?: number }> = ({ p, col, s = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.3, 0.07, 0.14]} p={[0, 0.06, 0]} r={0.02}>{M.plastic({ col })}</RBox>
  <RBox s={[0.16, 0.06, 0.12]} p={[-0.02, 0.12, 0]} r={0.02}>{M.glass({ col: "#9fb8d0", op: 0.7 })}</RBox>
  {[[-0.1, -0.07], [-0.1, 0.07], [0.1, -0.07], [0.1, 0.07]].map(([x, z], i) => <mesh key={i} position={[x, 0.03, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 14]} />{M.rubber({ col: "#1c1d20" })}</mesh>)}
</group>;
// 4:13 · DOCENAS DE AUTOS: el generador naranja adelante largando humo; atrás aparecen autos en fila, de a uno, cada uno con su
// bocanada, hasta llenar el estacionamiento. «1 GENERATOR = DOZENS OF IDLING CARS».
export const HDozenCars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#101216"
  cam={{ at: [0, 0.12, -0.3], az: [-0.35, 0.2], el: [0.32, 0.26], r: [2.0, 1.85], fov: 36 }}>{(tt) => {
  const C = ["#7a8a9a", "#a03a2a", "#3a5a8a", "#d9d5cc", "#2a2c30", "#5a7a4a"];
  return <>
    <Gen t={tt} p={[0, 0, 0.45]} s={1.1} />
    <Puffs tt={tt} p={[0.28, 0.14, 0.53]} n={6} per={1.5} dir={[0.3, 0.4, -0.1]} op={0.55} />
    {Array.from({ length: 18 }, (_, i) => { const r = Math.floor(i / 6), c = i % 6, a = 0.6 + i * 0.2, k = phys(tt, a, 8, 0.5);
      return <group key={i}>
        <Car p={[-0.95 + c * 0.38, 0, -0.1 - r * 0.32]} col={C[(i * 5) % 6]} s={z1(k)} />
        <Puffs tt={tt + i * 0.3} p={[-0.95 + c * 0.38 + 0.16, 0.05, -0.1 - r * 0.32]} n={3} per={1.8} dir={[0.12, 0.2, 0]} op={0.35 * cl(k)} s={0.6} />
      </group>; })}
    <Txt3 txt="1 GENERATOR" w={0.5} h={0.08} col="#f7f4ee" bg="#c25a12" p={[0, 0.55, 0.45]} op={cl((tt - 0.4) / 0.3) * (1 - cl((tt - 4.3) / 0.25))} />
    <Txt3 txt="1 GENERATOR = DOZENS OF CARS" w={1.15} h={0.11} col="#f7f4ee" bg="#b3221b" p={[0, 0.52, 0.45]} op={cl((tt - 4.5) / 0.3)} />
  </>;
}}</Scene3D>;

// 4:25 · CUATRO CAMINOS: corte del garaje pegado a la casa; el gas gris del generador sale en cuatro lenguas que encuentran la puerta,
// la pared, el ático y el conducto, y cada una se nombra al llegar a la casa.
export const HFourPaths: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none" bg="#0f1014"
  cam={{ at: [0.0, 0.52, 0], az: [-0.08, 0.08], el: [0.1, 0.06], r: [2.15, 1.95], fov: 36 }}>{(tt) => {
  const T = [0.6, 1.3, 2.0, 2.7], L = ["DOOR", "WALLS", "ATTIC", "DUCTS"];
  const P: number[][][] = [[[-0.4, 0.2, 0], [-0.15, 0.25, 0.02], [0.05, 0.25, 0.02], [0.3, 0.2, 0]],
    [[-0.45, 0.4, 0], [-0.1, 0.5, 0.03], [0.05, 0.5, 0.03], [0.3, 0.45, 0]],
    [[-0.5, 0.5, 0], [-0.3, 0.88, 0], [0.1, 1.0, 0], [0.4, 0.88, 0]],
    [[-0.4, 0.12, 0], [-0.1, 0.03, 0.02], [0.2, 0.03, 0.02], [0.4, 0.15, 0]]];
  const tp: V[] = [[0.3, 0.3, 0.32], [0.3, 0.58, 0.32], [0.62, 0.86, 0.32], [0.62, 0.08, 0.34]];
  return <>
    <RBox s={[0.9, 0.04, 0.6]} p={[-0.45, 0.78, 0]} r={0.01}>{M.matte({ col: "#4a4e55" })}</RBox>
    <RBox s={[0.04, 0.78, 0.6]} p={[-0.9, 0.39, 0]} r={0.01}>{M.matte({ col: "#6a6e75" })}</RBox>
    <RBox s={[0.05, 0.78, 0.6]} p={[0.0, 0.39, -0.02]} r={0.01}>{M.matte({ col: "#b9ab92" })}</RBox>
    <RBox s={[0.12, 0.3, 0.02]} p={[0.0, 0.18, 0.29]} r={0.005}>{M.wood({ base: [120, 84, 50] })}</RBox>
    <RBox s={[0.9, 0.04, 0.6]} p={[0.45, 0.78, 0]} r={0.01}>{M.matte({ col: "#8a7a62" })}</RBox>
    <mesh position={[0.2, 1.0, 0]} rotation={[0, 0, 0.5]}><boxGeometry args={[1.0, 0.03, 0.6]} />{M.matte({ col: "#5a3a2a" })}</mesh>
    <mesh position={[-0.6, 1.0, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.7, 0.03, 0.6]} />{M.matte({ col: "#5a3a2a" })}</mesh>
    <mesh position={[0.25, 0.02, 0.05]}><boxGeometry args={[0.5, 0.03, 0.08]} />{M.steel({ col: "#8a9096" })}</mesh>
    <Gen t={tt} p={[-0.55, 0, 0.05]} s={0.8} />
    <Puffs tt={tt} p={[-0.36, 0.12, 0.1]} n={5} per={1.4} dir={[0.05, 0.4, 0]} op={0.45} />
    {P.map((pts, i) => <Tube key={i} id={"fp" + i} pts={pts} u={eio(tt, T[i], T[i] + 0.9)} r={0.03}><meshStandardMaterial color="#8a9096" transparent opacity={0.55} depthWrite={false} roughness={1} /></Tube>)}
    {L.map((l, i) => <Txt3 key={l} txt={l} w={0.3} h={0.07} col="#ffffff" bg="#b3221b" p={tp[i]} op={cl((tt - T[i] - 0.85) / 0.3)} />)}
    <Txt3 txt="GARAGE" w={0.3} h={0.065} col="#c9ced3" p={[-0.45, 0.68, 0.32]} />
    <Txt3 txt="HOUSE" w={0.26} h={0.065} col="#e8dcc0" p={[0.5, 0.68, 0.32]} />
  </>;
}}</Scene3D>;

// 4:41 · LA PUERTA A MEDIAS: el portón del garaje sube y se clava a la mitad; adentro el gas gris baja desde el techo como una
// marea y llega al borde del portón, y por la puerta de la casa entra igual. «DOOR HALF OPEN · GAS STAYS IN».
export const HHalfDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" bg="#0d0f13"
  cam={{ at: [0.05, 0.4, 0.05], az: [-1.05, -0.85], el: [0.14, 0.1], r: [1.9, 1.7], fov: 34 }}>{(tt) => {
  const up = phys(tt, 0.4, 6, 0.5) * 0.5, lvl = eio(tt, 1.4, 4.2), seep = cl((tt - 3.4) / 0.8);
  return <>
    <RBox s={[1.0, 0.04, 0.8]} p={[0, 0.8, 0]} r={0.01}>{M.matte({ col: "#4a4e55" })}</RBox>
    <RBox s={[0.04, 0.8, 0.8]} p={[0.5, 0.4, 0]} r={0.01}>{M.matte({ col: "#b9ab92" })}</RBox>
    <RBox s={[1.0, 0.8, 0.04]} p={[0, 0.4, -0.4]} r={0.01}>{M.matte({ col: "#5a5e65" })}</RBox>
    <group position={[0, 0.4 + 0.78 * up, 0.4]}>{[0, 1, 2, 3].map((i) => <RBox key={i} s={[0.96, 0.19, 0.03]} p={[0, -0.29 + i * 0.195, 0]} r={0.008}>{M.porcelain({ col: "#e9e6de" })}</RBox>)}</group>
    <Gen t={tt} p={[-0.15, 0, 0]} s={0.8} />
    <Puffs tt={tt} p={[0.04, 0.12, 0.05]} n={5} per={1.4} dir={[0, 0.55, 0]} op={0.4} />
    <mesh position={[0, 0.8 - 0.21 * lvl, 0]} scale={[1, z1(lvl), 1]}><boxGeometry args={[0.94, 0.42, 0.76]} /><meshStandardMaterial color="#8a9096" transparent opacity={0.45} depthWrite={false} roughness={1} /></mesh>
    <RBox s={[0.02, 0.32, 0.16]} p={[0.49, 0.18, -0.15]} r={0.004}>{M.wood({ base: [120, 84, 50] })}</RBox>
    <Puffs tt={tt} p={[0.5, 0.3, -0.15]} n={4} per={1.6} dir={[0.35, 0.05, 0]} op={0.45 * seep} />
    <Txt3 txt="DOOR HALF OPEN" w={0.5} h={0.07} col="#f7f4ee" bg="#1b1d21" p={[-0.62, 0.12, 0.3]} r={[0, -0.95, 0]} op={cl((tt - 1.0) / 0.3)} />
    <Txt3 txt="GAS STAYS IN" w={0.5} h={0.08} col="#f7f4ee" bg="#b3221b" p={[-0.66, 0.66, -0.1]} r={[0, -0.95, 0]} op={cl((tt - 3.0) / 0.3)} />
    <Txt3 txt="INTO THE HOUSE" w={0.42} h={0.07} col="#0e1013" bg="#ffd25a" p={[0.3, 0.14, 0.3]} r={[0, -0.95, 0]} op={seep} />
  </>;
}}</Scene3D>;
