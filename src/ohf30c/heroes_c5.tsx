// ohf30c · componentes únicos 35-45 (la recta final): el listón separador flojo en corte (la masilla lo calla), el film que se tensa
// en una cocina soleada, la salida del dormitorio, el aire que necesita la llama, las alarmas de CO por piso, la contraventana
// por fuera en la nieve, los agujeros de desagote, la ventana terminada en un cuarto al atardecer, el orden del sábado,
// la trampa del ático y el vidrio viejo.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Puffs, Shock, Tape } from "./okit";
import { Bulb, GAPC, OH, OW, OldWin, RopeCaulk } from "./winkit";
import { Hand, Prof, Say, Snow, Stream, wpMat } from "./rkit";

const PI = Math.PI;
type V3 = [number, number, number];
const paint = (c = "#e8e0cf") => <meshStandardMaterial color={c} roughness={0.5} />;
const NoSign: React.FC<{ p: V3; k: number; r?: number; rot?: V3 }> = ({ p, k, r = 0.1, rot = [0, 0, 0] }) => <group position={p} rotation={rot} scale={Math.max(0.001, k)} visible={k > 0.01}>
  <mesh><torusGeometry args={[r, r * 0.12, 12, 48]} />{M.glow({ col: "#e5402f" })}</mesh>
  <mesh rotation={[0, 0, PI / 4]}><boxGeometry args={[r * 1.9, r * 0.2, r * 0.1]} />{M.glow({ col: "#e5402f" })}</mesh>
</group>;
const Flame: React.FC<{ tt: number; p: V3; k: number; col?: string }> = ({ tt, p, k, col = "#4aa8ff" }) => <group position={p} visible={k > 0.01}>
  {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[(i - 2) * 0.03, 0.02 * k, 0]} scale={[1, Math.max(0.001, k * (1 + 0.15 * Math.sin(tt * 1.8 + i * 1.3))), 1]}>
    <coneGeometry args={[0.016, 0.07, 10]} />{M.glow({ col })}</mesh>)}
</group>;
// pared alrededor del vano de la ventana (deja ver el cielo)
const WallAround: React.FC<{ mat: React.ReactNode; z?: number; y0?: number }> = ({ mat, z = 0.075, y0 = 0 }) => <group position={[0, y0, 0]}>
  <RBox s={[1.6, 2.2, 0.02]} p={[-1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[1.6, 2.2, 0.02]} p={[1.15, 0.4, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.7, 0.02]} p={[0, 1.25, z]} r={0.002} shadow={false}>{mat}</RBox>
  <RBox s={[0.7, 0.8, 0.02]} p={[0, -0.43, z]} r={0.002} shadow={false}>{mat}</RBox>
</group>;

// ---- 20:44 · EL LISTÓN SEPARADOR FLOJO: la jamba cortada (con su testa) en una noche helada; el listón baila en su ranura y el frío
//      lo rodea; la masilla en cordón corre a lo largo de su canto, el listón se queda quieto y el aire se corta ----
const JAMB = [[-0.13, 0], [0.13, 0], [0.13, 0.026], [0.007, 0.026], [0.007, 0.014], [-0.007, 0.014], [-0.007, 0.026], [-0.13, 0.026]];
const BLIND = [[-0.13, 0.026], [-0.1, 0.026], [-0.1, 0.07], [-0.13, 0.07]];
const STOP = [[0.1, 0.026], [0.13, 0.026], [0.13, 0.062], [0.1, 0.062]];
const BEAD = [[-0.0065, 0.014], [0.0065, 0.014], [0.0065, 0.07], [-0.0065, 0.07]];
export const HPartingBead: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[1.0, 1.6, 0.9]} bg="#0d1420" warm={0.6}
  cam={{ at: [0.2, 0.04, 0.0], at1: [-0.05, 0.04, 0.0], az: [1.0, 0.7], el: [0.62, 0.5], r: [0.72, 0.6], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.8} txt="LOOSE BEAD = AIR GOES AROUND IT" col="#b3261e" /><Say tt={tt} a={3.0} txt="WINTER FIX: ROPE CAULK" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const L = 0.8, run = eio(tt, 2.9, 5.6), fix = eio(tt, 4.8, 5.6), loose = 1 - fix, wob = 0.13 * Math.sin(tt * 6.5) * loose;
  const xs = L / 2 - 0.02, xe = lerp(xs, -L / 2 + 0.02, run), N = 26;
  const pts = Array.from({ length: N }, (_, i) => [lerp(xs, xe, i / (N - 1)), 0.073, 0.013]);
  return <>
    <Prof id="pbJ" pts={JAMB} L={L} paint="#cfc4ad" />
    <Prof id="pbB" pts={BLIND} L={L} paint="#ddd3bf" />
    <Prof id="pbS" pts={STOP} L={L} paint="#efe8da" />
    <group position={[0, 0.014, 0]} rotation={[wob, 0, 0]}><group position={[0, -0.014, 0]}><Prof id="pbP" pts={BEAD} L={L} paint="#7d8f72" /></group></group>
    {/* los cantos de las dos hojas, a cada lado del listón */}
    <RBox s={[L, 0.04, 0.07]} p={[0, 0.05, -0.05]} r={0.004}>{paint("#b9ad95")}</RBox>
    <RBox s={[L, 0.04, 0.07]} p={[0, 0.05, 0.05]} r={0.004}>{paint("#c9bea7")}</RBox>
    {/* afuera nieva (lado -z) */}
    <Snow tt={tt} n={50} box={[-0.4, 0.4, -0.1, 0.6, -0.6, -0.2]} />
    {[-0.24, -0.08, 0.08, 0.24].map((x, i) => <Stream key={i} id={"pb" + i} tt={tt + i * 0.6} pts={[[x, 0.03, -0.32], [x, 0.09, -0.01], [x + 0.03, 0.04, 0.3]]} n={8} k={x > xe ? loose : 1 - run * 0.9} w={0.003} len={0.045} spread={0.02} />)}
    <RopeCaulk id={"pbr" + Math.round(run * 40)} pts={pts} grow={Math.max(0.02, run)} r={0.009} col="#6f6a62" />
    <group visible={tt > 2.7 && run < 0.999}><Hand p={[xe + 0.1, 0.085 + 0.1 * (1 - eio(tt, 2.8, 3.1)), 0.05]} rot={[0.5, PI, 0.1]} s={0.8} curl={0.45} thumb={0.8} /></group>
  </>;
}}</Scene3D>;

// ---- 21:46 · EL FILM: en una cocina de azulejos con sol de la mañana; el film arrugado se tensa bajo el secador que pasa de lado a lado ----
const wavyG = (() => { let g: THREE.PlaneGeometry | null = null; return () => {
  if (g) return g; g = new THREE.PlaneGeometry(OW + 0.14, OH + 0.14, 40, 60); const a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i); a.setZ(i, 0.012 * Math.sin(x * 38 + y * 9) * Math.cos(y * 23 - x * 6)); }
  g.computeVertexNormals(); return g; }; })();
export const HShrinkFilm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.9, 1.6, 1.4]} bg="#1a1712" warm={1.1}
  cam={{ at: [0.0, 0.42, 0.05], at1: [0.05, 0.42, 0.05], az: [-0.42, -0.22], el: [0.05, 0.08], r: [1.25, 1.08], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={2.6} txt="TAPE ON THE TRIM, FILM OVER IT" /><Say tt={tt} a={2.8} txt="HAIR DRYER: TIGHT AS A DRUM" col="#1f6a3a" /></>}>{(tt) => {
  const heat = eio(tt, 1.2, 4.6), xd = lerp(-0.28, 0.28, heat), ydr = OH / 2 + 0.22 * Math.sin(heat * PI * 3), tight = heat;
  return <>
    <WallAround mat={<meshStandardMaterial map={tex.tile(10, 14)} roughness={0.3} />} />
    {/* la mesada bajo la ventana con un frasco y una planta */}
    <RBox s={[2.2, 0.05, 0.4]} p={[0, -0.12, 0.27]} r={0.006}><meshPhysicalMaterial color="#2e3338" roughness={0.25} clearcoat={0.8} /></RBox>
    <mesh position={[-0.45, -0.04, 0.25]}><cylinderGeometry args={[0.05, 0.045, 0.12, 24]} /><meshStandardMaterial color="#b55a3a" roughness={0.8} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.45 + 0.03 * Math.cos(i), 0.06 + 0.02 * rn(i, 1), 0.25 + 0.03 * Math.sin(i)]} rotation={[0.4 * Math.sin(i), i, 0.4 * Math.cos(i)]} scale={[1, 2.2, 0.4]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#4f7a3a" roughness={0.7} /></mesh>)}
    <OldWin p={[0, 0, 0]} sky="#a9cbe6" />
    <pointLight position={[0.3, 0.9, -0.6]} intensity={3.2} distance={3} color="#fff0c8" />
    <mesh position={[0, OH / 2, 0.088]} scale={[1, 1, Math.max(0.03, 1 - tight * 0.97)]} geometry={wavyG()}>
      <meshPhysicalMaterial color="#d6ecf8" transparent opacity={0.42} roughness={0.08} clearcoat={1} metalness={0.15} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
    {[[0, OH + 0.07, OW + 0.14, 0.012], [0, -0.07 + 0.006, OW + 0.14, 0.012], [-(OW / 2 + 0.07), OH / 2, 0.012, OH + 0.14], [OW / 2 + 0.07, OH / 2, 0.012, OH + 0.14]].map(([x, y, w, hh], i) =>
      <mesh key={i} position={[x, y, 0.09]}><planeGeometry args={[w, hh]} /><meshStandardMaterial color="#f7f2e4" roughness={0.6} /></mesh>)}
    {/* el secador en la mano */}
    <group position={[xd, ydr, 0.3]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.03, 0.14, 24]} />{M.plastic({ col: "#d64a6a" })}</mesh>
      <RBox s={[0.03, 0.12, 0.04]} p={[0, -0.07, 0.04]} r={0.012}>{M.plastic({ col: "#d64a6a" })}</RBox>
      <Hand p={[0.0, -0.1, 0.07]} rot={[0, -PI / 2, PI / 2]} s={0.8} curl={0.75} thumb={0.8} />
      <Puffs tt={tt} n={8} a={[0, 0, -0.08]} b={[0, 0, -0.2]} r={0.012} col="#ffb07a" op={0.35 * (heat > 0.02 && heat < 0.98 ? 1 : 0)} v={1.2} />
    </group>
  </>;
}}</Scene3D>;

// ---- 22:21 · LA SALIDA: el dormitorio, la ventana sube y una flecha verde sale por ella; la ventana del dormitorio no se sella cerrada ----
export const HEgress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.6, 2.0, 1.4]}
  cam={{ at: [0.1, 0.72, 0.25], at1: [0.0, 0.8, 0.1], az: [-0.55, -0.3], el: [0.1, 0.06], r: [1.45, 1.2], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.9} txt="EVERY BEDROOM: A WAY OUT" col="#1f6a3a" size={110} /><Say tt={tt} a={3.0} txt="NEVER SEAL IT SHUT" col="#b3261e" size={120} /></>}>{(tt) => {
  const op = eio(tt, 1.0, 2.6), ar = eio(tt, 2.8, 4.6);
  return <>
    <WallAround y0={0.42} z={0.06} mat={<meshStandardMaterial map={wpMat("#c9bfa8", "#c1b69d", "#e9dfc4", 5, 5)} roughness={0.9} />} />
    <OldWin p={[0, 0.42, 0]} lo={0.9 * op} sky="#2a3f5c" />
    <Snow tt={tt} n={50} box={[-0.4, 0.4, 0.4, 1.4, -0.6, -0.2]} r={0.004} />
    {/* la cama */}
    <group position={[0.75, 0, 0.55]}>
      <RBox s={[0.6, 0.18, 1.0]} p={[0, 0.2, 0]} r={0.03}><meshStandardMaterial color="#f1ece2" roughness={0.9} /></RBox>
      <RBox s={[0.62, 0.08, 0.6]} p={[0, 0.31, 0.15]} r={0.03}><meshStandardMaterial color="#5c7fa8" roughness={0.9} /></RBox>
      <RBox s={[0.36, 0.08, 0.18]} p={[0, 0.33, -0.36]} r={0.04}><meshStandardMaterial color="#fffaf0" roughness={0.9} /></RBox>
      <RBox s={[0.64, 0.5, 0.05]} p={[0, 0.3, -0.52]} r={0.01}>{M.wood({ base: [110, 70, 40] })}</RBox>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <mesh key={i} position={[a * 0.27, 0.06, b * 0.46]}><cylinderGeometry args={[0.02, 0.02, 0.12, 10]} />{M.wood({ base: [90, 56, 30] })}</mesh>)}
    </group>
    {/* la mano que sube la hoja */}
    <group visible={tt < 2.9}><Hand p={[0.05, 0.42 + 0.04 + 0.9 * op * (OH / 2 - 0.03), 0.09]} rot={[0, PI / 2, PI / 2 - 0.3]} s={1.0} curl={0.5} thumb={0.5} /></group>
    {/* la flecha de salida, grande, que pasa por la abertura */}
    <group position={[0, 0.62, lerp(1.0, -0.02, ar)]} rotation={[-PI / 2, 0, 0]} scale={1.6} visible={ar > 0.01}>
      <mesh position={[0, -0.08, 0]}><boxGeometry args={[0.06, 0.18, 0.02]} />{M.glow({ col: "#3fae5a" })}</mesh>
      <mesh position={[0, 0.05, 0]}><coneGeometry args={[0.07, 0.1, 3]} />{M.glow({ col: "#3fae5a" })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- 22:55 · EL AIRE DE LA LLAMA: el calentador toma aire por las rendijas; sellado de más, la llama azul se achica y amarillea ----
export const HCombustAir: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" key1={[-0.6, 1.8, 1.4]} warm={0.5}
  cam={{ at: [-0.15, 0.4, 0], at1: [0, 0.1, 0.15], az: [-0.3, -0.05], el: [0.12, 0.08], r: [1.45, 0.5], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.6} b={2.8} txt="THEY NEED AIR TO BURN" /><Say tt={tt} a={3.0} txt="SEALED A LOT? HAVE IT CHECKED" col="#b3261e" /></>}>{(tt) => {
  const seal = eio(tt, 2.4, 4.0), fk = lerp(1, 0.45, seal), col = new THREE.Color("#4aa8ff").lerp(new THREE.Color("#ffb02a"), seal).getStyle();
  return <>
    {/* calentador de agua: tanque, puerta del quemador con su llama, y el conducto */}
    <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.16, 0.16, 0.6, 40]} />{M.steel({ col: "#c9c6c0" })}</mesh>
    <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.1, 0.16, 0.06, 40]} />{M.steel({ col: "#b4b0aa" })}</mesh>
    <mesh position={[0, 0.85, 0]}><cylinderGeometry args={[0.045, 0.045, 0.34, 20]} />{M.steel({ col: "#8a8680" })}</mesh>
    <RBox s={[0.12, 0.08, 0.02]} p={[0, 0.1, 0.155]} r={0.006}><meshStandardMaterial color="#141414" /></RBox>
    <Flame tt={tt} p={[0, 0.07, 0.17]} k={fk} col={col} />
    {/* el aire que llega por las rendijas de la ventana */}
    <Puffs tt={tt} n={16} a={[-0.55, 0.5, 0.2]} b={[-0.05, 0.1, 0.18]} r={0.012} col={GAPC} op={0.6 * (1 - seal)} v={0.5} wob={0.03} />
    <mesh position={[-0.56, 0.5, 0.2]}><boxGeometry args={[0.014, 0.3 * (1 - seal) + 0.004, 0.04]} />{M.glow({ col: GAPC, op: 1 - seal })}</mesh>
  </>;
}}</Scene3D>;

// ---- 23:24 · LAS ALARMAS DE CO: la casa en corte, dos pisos; una alarma aparece en cada piso, cerca de los dormitorios, y late su aviso ----
const Alarm: React.FC<{ p: V3; k: number; tt: number }> = ({ p, k, tt }) => <group position={p} scale={Math.max(0.001, k)} visible={k > 0.01}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.075, 0.03, 32]} />{M.plastic({ col: "#f4f1ea" })}</mesh>
  <mesh position={[0.03, -0.016, 0.0]}><sphereGeometry args={[0.009, 12, 10]} />{M.glow({ col: (tt * 0.8) % 1 < 0.5 ? "#3fdc6a" : "#1f6a3a" })}</mesh>
  <mesh position={[0, -0.016, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.035, 0.042, 32]} /><meshStandardMaterial color="#b9b4aa" /></mesh>
</group>;
export const HCOAlarm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-0.6, 2.0, 1.6]} bg="#0f1318"
  cam={{ at: [0, 0.62, 0], az: [-0.28, -0.16], el: [0.16, 0.12], r: [2.6, 2.4], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.6} txt="CO ALARM ON EVERY FLOOR" col="#1f6a3a" /><Say tt={tt} a={2.8} txt="NEAR THE BEDROOMS" /></>}>{(tt) => {
  const a1 = phys(tt, 1.0, 8, 0.45), a2 = phys(tt, 1.6, 8, 0.45);
  const room = (x: number, y: number, w: number, c: string) => <RBox s={[w, 0.56, 0.5]} p={[x, y + 0.28, -0.25]} r={0.004}><meshStandardMaterial color={c} roughness={0.95} side={THREE.BackSide} /></RBox>;
  return <>
    {room(-0.4, 0, 0.8, "#d9cdb4")}{room(0.4, 0, 0.8, "#cdbf9f")}{room(-0.4, 0.62, 0.8, "#c9d0c4")}{room(0.4, 0.62, 0.8, "#d6c8b8")}
    {[0, 0.6, 1.2].map((y, i) => <RBox key={i} s={[1.66, 0.04, 0.54]} p={[0, y, -0.25]} r={0.004}>{M.wood({ base: [120, 84, 50] })}</RBox>)}
    {/* techo a dos aguas */}
    {[-1, 1].map((k) => <RBox key={k} s={[0.98, 0.04, 0.56]} p={[k * 0.42, 1.44, -0.25]} rot={[0, 0, -k * 0.5]} r={0.004}><meshStandardMaterial color="#6e3a2c" /></RBox>)}
    {/* camas en los dormitorios de arriba */}
    {[-0.4, 0.4].map((x, i) => <RBox key={i} s={[0.4, 0.1, 0.3]} p={[x, 0.7, -0.3]} r={0.02}><meshStandardMaterial color={i ? "#5c7fa8" : "#8a5a8a"} roughness={0.9} /></RBox>)}
    {/* el calentador abajo */}
    <mesh position={[0.6, 0.2, -0.3]}><cylinderGeometry args={[0.07, 0.07, 0.34, 24]} />{M.steel({ col: "#c9c6c0" })}</mesh>
    <Alarm p={[0.0, 1.14, -0.05]} k={a1} tt={tt} />
    <Alarm p={[0.0, 0.54, -0.05]} k={a2} tt={tt} />
    {/* el aviso: ondas que salen de cada alarma hacia los dormitorios */}
    {[3.0, 3.8, 4.6].map((a, i) => <React.Fragment key={i}><Shock tt={tt} a={a} p={[0, 1.12, -0.04]} r={0.3} col="#3fdc6a" /><Shock tt={tt} a={a + 0.2} p={[0, 0.52, -0.04]} r={0.3} col="#3fdc6a" /></React.Fragment>)}
  </>;
}}</Scene3D>;

// ---- 24:13 · LA CONTRAVENTANA AL REVÉS: por fuera, en la nieve, con la casa tibia adentro; la mano enguantada aprieta las trabas,
//      baja el vidrio, sube el mosquitero y el vidrio hace clic abajo ----
export const HStormSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.6, 1.8, 1.4]} bg="#7f98b0" warm={0.85}
  cam={{ at: [0, 0.48, 0.04], at1: [0.0, 0.08, 0.04], az: [0.32, 0.05], el: [0.06, 0.2], r: [1.25, 0.55], fov: 34 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={2.95} txt="GLASS UP = DOING NOTHING" col="#b3261e" /><Say tt={tt} a={3.1} b={3.9} txt="GLASS DOWN, SCREEN UP" col="#1f6a3a" /><Say tt={tt} a={4.2} txt="CLICK" size={130} /></>}>{(tt) => {
  const sw = eio(tt, 3.0, 4.3), Hh = OH / 2 + 0.02, gy = lerp(Hh, 0, sw), xw = OW / 2 + 0.035;
  return <>
    {/* el revestimiento de tablas de la casa, con el vano de la ventana */}
    {Array.from({ length: 15 }, (_, i) => { const y = -0.15 + i * 0.1, inW = y > -0.06 && y < OH + 0.04;
      return inW ? <React.Fragment key={i}><RBox s={[0.8, 0.11, 0.02]} p={[-xw - 0.4, y, -0.06]} rot={[0.08, 0, 0]} r={0.003}><meshStandardMaterial color="#58705f" roughness={0.75} /></RBox>
        <RBox s={[0.8, 0.11, 0.02]} p={[xw + 0.4, y, -0.06]} rot={[0.08, 0, 0]} r={0.003}><meshStandardMaterial color="#58705f" roughness={0.75} /></RBox></React.Fragment>
        : <RBox key={i} s={[1.8, 0.11, 0.02]} p={[0, y, -0.06]} rot={[0.08, 0, 0]} r={0.003}><meshStandardMaterial color="#58705f" roughness={0.75} /></RBox>; })}
    {/* la casa tibia adentro */}
    <mesh position={[0, OH / 2, -0.3]}><planeGeometry args={[OW + 0.2, OH + 0.2]} /><meshBasicMaterial color="#ffb36a" toneMapped={false} /></mesh>
    <mesh position={[0.08, OH / 2 - 0.1, -0.25]}><cylinderGeometry args={[0.04, 0.08, 0.07, 20, 1, true]} /><meshBasicMaterial color="#fff0c8" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    {/* marco de aluminio de tres guías */}
    {[-1, 1].map((k) => <RBox key={k} s={[0.03, OH + 0.06, 0.06]} p={[k * (OW / 2 + 0.015), OH / 2, 0.0]} r={0.003}>{M.steel({ col: "#c8ccd0" })}</RBox>)}
    <RBox s={[OW + 0.06, 0.03, 0.06]} p={[0, OH + 0.015, 0]} r={0.003}>{M.steel({ col: "#c8ccd0" })}</RBox>
    <RBox s={[OW + 0.06, 0.03, 0.07]} p={[0, -0.015, 0]} r={0.003}>{M.steel({ col: "#c8ccd0" })}</RBox>
    {/* nieve en el alféizar y arbustos */}
    <RBox s={[OW + 0.3, 0.025, 0.12]} p={[0, -0.04, 0.05]} r={0.012}><meshStandardMaterial color="#f4f7fb" roughness={0.9} /></RBox>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.6 + i * 0.15, -0.28 + 0.05 * rn(i, 1), 0.15 + 0.08 * rn(i, 2)]}><sphereGeometry args={[0.1 + 0.04 * rn(i, 3), 16, 12]} /><meshStandardMaterial color={i % 2 ? "#2f4a2c" : "#38562f"} roughness={0.9} /></mesh>)}
    <Snow tt={tt} n={90} box={[-0.8, 0.8, -0.3, 1.1, 0.0, 0.5]} />
    {/* vidrio: arriba → abajo (guía de atrás) */}
    <group position={[0, gy, -0.012]}>
      <RBox s={[OW, Hh, 0.012]} p={[0, Hh / 2, 0]} r={0.003}>{M.steel({ col: "#b4b8bc" })}</RBox>
      <mesh position={[0, Hh / 2, 0.007]}><planeGeometry args={[OW - 0.03, Hh - 0.03]} />{M.glass()}</mesh>
      {[-1, 1].map((k) => <RBox key={k} s={[0.03, 0.012, 0.016]} p={[k * (OW / 2 - 0.06), Hh - 0.01, 0.01]} r={0.004}>{M.steel({ col: "#7d8288" })}</RBox>)}
    </group>
    {/* mosquitero: abajo → arriba (guía de adelante) */}
    <group position={[0, lerp(0, Hh, sw), 0.014]}>
      <RBox s={[OW, 0.02, 0.01]} p={[0, 0.01, 0]} r={0.002}>{M.steel({ col: "#9aa0a6" })}</RBox><RBox s={[OW, 0.02, 0.01]} p={[0, Hh - 0.01, 0]} r={0.002}>{M.steel({ col: "#9aa0a6" })}</RBox>
      <mesh position={[0, Hh / 2, 0]}><planeGeometry args={[OW - 0.02, Hh - 0.02]} /><meshStandardMaterial color="#3a3f44" transparent opacity={0.55} /></mesh></group>
    {/* las dos manos enguantadas pellizcan las trabas del vidrio y lo bajan */}
    {tt < 4.5 && [-1, 1].map((k) => <Hand key={k} p={[k * (OW / 2 - 0.06), gy + Hh + 0.1, 0.05]} rot={[0, 0, -PI / 2]} s={0.75} curl={0.6} thumb={0.9} glove col="#9a6a38" />)}
    {sw > 0.98 && <Shock tt={tt} a={4.3} p={[0, 0.02, 0.06]} r={0.1} col="#ffd27a" />}
  </>;
}}</Scene3D>;

// ---- 24:31 · LOS AGUJEROS DE DESAGOTE: el riel de abajo de la contraventana; el agua sale por las ranuras; a la pistola de silicona, el «no» ----
export const HWeepHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[0.6, 1.8, 1.4]} bg="#9fb6c8"
  cam={{ at: [0, 0.02, 0.04], az: [0.32, 0.18], el: [0.22, 0.16], r: [0.85, 0.76], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.8} txt="WEEP HOLES: WATER OUT" col="#1f4f8a" /><Say tt={tt} a={3.0} txt="DON'T CAULK THEM SHUT" col="#b3261e" /></>}>{(tt) => {
  const gun = eio(tt, 2.4, 3.4), no = phys(tt, 3.4, 8, 0.4);
  return <>
    <RBox s={[0.8, 0.06, 0.18]} p={[0, -0.04, 0]} r={0.006}>{paint("#e2dac9")}</RBox>
    <RBox s={[0.6, 0.05, 0.07]} p={[0, 0.025, 0]} r={0.003}>{M.steel({ col: "#c8ccd0" })}</RBox>
    {[-0.18, 0, 0.18].map((x, i) => <React.Fragment key={i}>
      <mesh position={[x, 0.012, 0.036]}><boxGeometry args={[0.04, 0.008, 0.002]} /><meshBasicMaterial color="#111" /></mesh>
      {Array.from({ length: 5 }, (_, j) => { const u = (tt * 0.7 + j / 5 + i * 0.13) % 1; return <mesh key={j} position={[x, 0.012 - 0.03 * u * u, 0.04 + 0.05 * u]} scale={[1, 1.3, 1]}>
        <sphereGeometry args={[0.006, 10, 8]} />{M.water()}</mesh>; })}
    </React.Fragment>)}
    {/* pistola de silicona que se acerca */}
    <group position={[lerp(0.6, 0.12, gun), 0.06, 0.12]} rotation={[0, 0.3, 0.15]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.2, 18]} />{M.plastic({ col: "#f2efe8" })}</mesh>
      <mesh position={[-0.13, 0, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.008, 0.07, 12]} />{M.plastic({ col: "#f2efe8" })}</mesh>
      <RBox s={[0.02, 0.1, 0.02]} p={[0.08, -0.06, 0]} r={0.006}>{M.steel({ col: "#c2302a" })}</RBox>
    </group>
    <NoSign p={[0.14, 0.08, 0.14]} k={no} r={0.08} />
  </>;
}}</Scene3D>;

// ---- 24:50 · LA CASA, CUATRO VENTANAS: la fachada de tablas azul pizarra al anochecer, vista desde la vereda; cada ventana tiene la
//      escarcha fría en los bordes; cuando se nombra su arreglo, el lugar se enciende dorado, la escarcha se va, adentro se prende la luz
//      tibia y aparece el tilde verde. La cámara camina por la vereda de la primera a la última ----
const clapTex = () => { const t = tex.text("clap5d6f80", 256, 256, (g) => {
  g.fillStyle = "#5d6f80"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) { const y = i * 32; const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, "#4b5b6a"); gr.addColorStop(0.18, "#6a7d8f"); gr.addColorStop(1, "#5a6c7d"); g.fillStyle = gr; g.fillRect(0, y, 256, 32);
    g.fillStyle = "rgba(20,26,34,.55)"; g.fillRect(0, y + 30, 256, 2); }
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${0.03 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 6 + 10 * rn(i, 5), 1); }
}); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 9); return t; };
// la fachada en piezas, con los cuatro vanos abiertos (la luz de adentro se ve por el vidrio)
const FAC: number[][] = [[-1.3, -0.9, -0.25, 2.25], [-0.34, 0.34, -0.25, 2.25], [0.9, 1.3, -0.25, 2.25],
  ...[[-0.9, -0.34], [0.34, 0.9]].flatMap(([x0, x1]) => [[x0, x1, -0.25, 0.29], [x0, x1, 1.15, 1.41], [x0, x1, 2.27, 2.25 + 0.03]])];
const CP = new Map<string, THREE.Texture>();
const clapPiece = (base: THREE.Texture, x0: number, x1: number, y0: number, y1: number) => { const k = [x0, x1, y0, y1].join(); if (CP.has(k)) return CP.get(k)!;
  const t = base.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set((x1 - x0) * 1.54, (y1 - y0) * 3.6); t.offset.set(x0 * 1.54, y0 * 3.6); CP.set(k, t); return t; };
const Check: React.FC<{ p: V3; k: number }> = ({ p, k }) => <group position={p} scale={Math.max(0.001, k) * 1.0} visible={k > 0.01}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02, 40]} /><meshPhysicalMaterial color="#2f8a4a" roughness={0.3} clearcoat={1} emissive="#1f6a3a" emissiveIntensity={0.5} /></mesh>
  <RBox s={[0.06, 0.022, 0.012]} p={[-0.03, -0.01, 0.014]} rot={[0, 0, -0.8]} r={0.006}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} /></RBox>
  <RBox s={[0.11, 0.022, 0.012]} p={[0.022, 0.012, 0.014]} rot={[0, 0, 0.9]} r={0.006}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} /></RBox>
</group>;
const RW: { x: number; y: number; a: number; gap: "side" | "rail" | "bot" | "top" }[] = [{ x: -0.62, y: 0.3, a: 0.4, gap: "side" }, { x: 0.62, y: 0.3, a: 1.6, gap: "rail" }, { x: -0.62, y: 1.42, a: 2.8, gap: "bot" }, { x: 0.62, y: 1.42, a: 4.0, gap: "top" }];
export const HRecapWindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1.6, 2.4, 2.4]} bg="#2a2338" warm={0.55} lamp={[1.7, 0.6, 1.0]}
  cam={{ at: [-0.35, 0.8, 0], at1: [0.3, 1.25, 0], az: [-0.42, 0.3], el: [-0.1, -0.04], r: [3.7, 3.3], fov: 40 }}
  over={(tt) => <><Say tt={tt} a={0.4} b={1.5} txt="1 · SIDES: V STRIP" col="#b3561e" size={100} /><Say tt={tt} a={1.6} b={2.7} txt="2 · MIDDLE: LOCK + V" size={100} /><Say tt={tt} a={2.8} b={3.9} txt="3 · BOTTOM: BULB" col="#1f4f8a" size={100} /><Say tt={tt} a={4.0} txt="4 · TOP: ROPE CAULK" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const cw = clapTex(), cold = new THREE.Color("#1c2638"), warmC = new THREE.Color("#ffb45e");
  return <>
    {/* el cielo del anochecer: franja naranja abajo, violeta arriba, y la luna */}
    <mesh position={[0, 1.2, -1.2]}><planeGeometry args={[12, 6]} /><meshBasicMaterial color="#2d2742" toneMapped={false} /></mesh>
    <mesh position={[0, -0.1, -1.15]}><planeGeometry args={[12, 1.2]} /><meshBasicMaterial color="#c8714a" transparent opacity={0.55} toneMapped={false} /></mesh>
    <mesh position={[2.0, 2.6, -1.1]}><circleGeometry args={[0.14, 40]} /><meshBasicMaterial color="#f4ecd2" toneMapped={false} /></mesh>
    {/* la fachada de tablas con sus esquineros blancos, el alero y el zócalo de piedra */}
    {FAC.map(([x0, x1, y0, y1], i) => <mesh key={i} position={[(x0 + x1) / 2, (y0 + y1) / 2, -0.03]} receiveShadow castShadow><boxGeometry args={[x1 - x0, y1 - y0, 0.04]} /><meshStandardMaterial map={clapPiece(cw, x0, x1, y0, y1)} roughness={0.75} /></mesh>)}
    {[-1, 1].map((k) => <RBox key={k} s={[0.1, 2.5, 0.06]} p={[k * 1.3, 1.0, -0.02]} r={0.006}>{paint("#efe9dc")}</RBox>)}
    <RBox s={[2.9, 0.12, 0.3]} p={[0, 2.28, 0.06]} r={0.01}>{paint("#efe9dc")}</RBox>
    <RBox s={[3.0, 0.06, 0.7]} p={[0, 2.36, -0.12]} rot={[0.35, 0, 0]} r={0.01}><meshStandardMaterial color="#26262c" roughness={0.9} /></RBox>
    <RBox s={[2.7, 0.3, 0.08]} p={[0, -0.16, -0.01]} r={0.01}><meshStandardMaterial map={tex.tile(10, 1.2, "#8c8478", "#5b554d")} roughness={0.9} /></RBox>
    {/* césped y vereda */}
    <mesh position={[0, -0.31, 1.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[8, 2.2]} /><meshStandardMaterial color="#2c3b2a" roughness={1} /></mesh>
    {/* las cuatro ventanas: escarcha azul en el borde del arreglo hasta que llega su turno; después luz tibia adentro y tilde */}
    {RW.map((w, i) => { const k = eio(tt, w.a, w.a + 0.7), glow = Math.exp(-((tt - w.a - 0.35) ** 2) * 5);
      const sky = "#" + cold.clone().lerp(warmC, k).getHexString(), gap = { [w.gap]: 1 } as Record<string, number>;
      return <group key={i} position={[w.x, w.y, 0.02]}>
        <OldWin s={1} sky={sky} gap={k < 0.6 ? gap : { [w.gap]: glow }} gapCol={k < 0.6 ? "#9fdcff" : "#ffcf5a"} lock={i === 1 ? k : 0} />
        {/* cortina tibia a medio correr, se ve sólo con la luz prendida */}
        <mesh position={[-OW / 2 + 0.1, OH / 2 + 0.06, -0.1]}><planeGeometry args={[0.16, OH - 0.1]} /><meshBasicMaterial color="#e6c79a" transparent opacity={0.85 * k} toneMapped={false} /></mesh>
        <Check p={[OW / 2 + 0.13, OH * 0.55, 0.12]} k={phys(tt, w.a + 0.5, 8, 0.45)} />
      </group>; })}
    {/* el farol de la vereda (siempre montado) */}
    <group position={[1.75, -0.3, 0.9]}>
      <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.02, 0.025, 1.2, 12]} /><meshStandardMaterial color="#1c1c1e" roughness={0.5} /></mesh>
      <mesh position={[0, 1.25, 0]}><boxGeometry args={[0.1, 0.14, 0.1]} /><meshBasicMaterial color="#ffd796" toneMapped={false} /></mesh>
    </group>
    <pointLight position={[1.75, 0.95, 0.9]} intensity={2.2} distance={3.0} color="#ffcf8a" />
  </>;
}}</Scene3D>;

// ---- 25:43 · EL ORDEN DEL SÁBADO: sobre la mesa de trabajo, las seis cosas en fila; cada una se levanta y brilla cuando le toca, con su número ----
export const HWeekendOrder: React.FC<{ t: number; h: H }> = ({ t, h }) => {
  const lab = ["1 · INCENSE TEST", "2 · SASH LOCKS", "3 · BOTTOMS", "4 · SIDES", "5 · ROPE CAULK", "6 · STORMS"], A = (i: number) => 0.5 + i * 0.8;
  return <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" key1={[-0.6, 2.0, 1.4]} bg="#17110c" warm={1.05} lamp={[0.3, 0.5, 0.4]}
    cam={{ at: [-0.2, 0.03, 0.02], at1: [0.32, 0.03, 0.02], az: [-0.3, 0.12], el: [0.62, 0.5], r: [1.05, 1.18], fov: 32 }}
    over={(tt) => <>{lab.map((l, i) => <Say key={i} tt={tt} a={[0.3, 1.0, 1.7, 2.95, 3.4, 4.0][i]} b={[0.95, 1.35, 2.9, 3.35, 3.85, undefined][i]} txt={l} col={["#1f6a3a", "#b3561e", "#1f4f8a", "#b3561e", "#1c2a3a", "#1f4f8a"][i]} size={110} />)}</>}>{(tt) => {
    const X = (i: number) => -0.5 + i * 0.2, k = (i: number) => phys(tt, A(i) - 0.2, 8, 0.45), on = (i: number) => Math.exp(-((tt - A(i) - 0.35) ** 2) * 2.5);
    const items: React.ReactNode[] = [
      <group><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.002, 0.002, 0.12, 6]} /><meshStandardMaterial color="#6e3d23" /></mesh><mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.025, 0.03, 0.01, 20]} />{M.brass({ col: "#7a5a2a" })}</mesh>
        <Puffs tt={tt} n={6} a={[0, 0.12, 0]} b={[0.01, 0.24, 0]} r={0.008} col="#eef1f4" op={0.5} v={0.4} /></group>,
      <group><RBox s={[0.06, 0.012, 0.03]} p={[0, 0.006, 0]} r={0.004}>{M.brass()}</RBox><RBox s={[0.05, 0.008, 0.014]} p={[-0.01, 0.016, 0]} r={0.003}>{M.brass()}</RBox></group>,
      <group>{[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.015, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.025 + i * 0.006, 0.006, 10, 30]} /><meshStandardMaterial color="#2a2a2c" roughness={0.8} /></mesh>)}</group>,
      <group>{[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.012, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022 + i * 0.006, 0.004, 6, 30]} />{M.brass({ col: "#d8a057" })}</mesh>)}</group>,
      <group>{[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.012, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022 + i * 0.007, 0.006, 10, 30]} /><meshStandardMaterial color="#6a655e" roughness={0.85} /></mesh>)}</group>,
      <group><RBox s={[0.08, 0.1, 0.01]} p={[0, 0.05, 0]} r={0.003}>{M.steel({ col: "#c8ccd0" })}</RBox><mesh position={[0, 0.05, 0.006]}><planeGeometry args={[0.064, 0.084]} />{M.glass()}</mesh></group>,
    ];
    return <>
      <RBox s={[1.4, 0.04, 0.5]} p={[0, -0.02, 0]} r={0.008}>{M.wood({ base: [150, 104, 60] })}</RBox>
      {items.map((it, i) => <group key={i} position={[X(i), 0.04 * on(i), -0.05]} rotation={[0, 0.6 * on(i), 0]} scale={Math.max(0.001, (1.7 + 0.5 * on(i)) * k(i))} visible={k(i) > 0.01}>{it}</group>)}
      {items.map((_, i) => <mesh key={"l" + i} position={[X(i), 0.002, -0.05]} rotation={[-PI / 2, 0, 0]} visible={on(i) > 0.05}><circleGeometry args={[0.085, 32]} />{M.glow({ col: "#ffd27a", op: 0.25 * on(i) })}</mesh>)}
      {lab.map((l, i) => <Tape key={i} txt={String(i + 1)} col={i === 0 ? "#1f6a3a" : "#1c2a3a"} p={[X(i), 0.005, 0.12]} rot={[-PI / 2, 0, 0]} w={0.07} k={k(i)} />)}
    </>;
  }}</Scene3D>;
};

// ---- 26:53 · LA TRAMPA DEL ÁTICO, DESDE ARRIBA: adentro del ático, entre las vigas y la lana rosa; por los bordes de la tapa sube el
//      calor de la casa (luz tibia y vaho). La tapa se levanta, la mano pega el burlete en el marco y la tapa cae sobre él; después las
//      dos manos apoyan la placa de espuma rígida encima y el calor se corta ----
const Batt: React.FC<{ x: number; w: number }> = ({ x, w }) => <group position={[x, 0, 0]}>
  <RBox s={[w, 0.1, 1.6]} p={[0, 0.05, 0]} r={0.03}><meshStandardMaterial color="#e3a29a" roughness={1} /></RBox>
  {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[(rn(i, 71) - 0.5) * w * 0.8, 0.1, (rn(i, 72) - 0.5) * 1.5]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.05 + 0.04 * rn(i, 73), 12, 8]} /><meshStandardMaterial color={i % 2 ? "#eaa9a0" : "#d9958c"} roughness={1} /></mesh>)}
</group>;
export const HAtticHatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.9, 1.5, 0.9]} bg="#120d0a" warm={0.4}
  cam={{ at: [0, 0.02, 0.02], at1: [0, 0.04, 0.0], az: [-0.5, -0.25], el: [0.9, 0.78], r: [1.35, 1.2], fov: 36 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.9} txt="WEATHERSTRIP ON THE FRAME" size={100} /><Say tt={tt} a={3.05} txt="RIGID FOAM LAID ON TOP" col="#1f6a3a" size={100} /></>}>{(tt) => {
  const open = eio(tt, 0.3, 0.9) * (1 - eio(tt, 1.9, 2.4)), ws = eio(tt, 0.9, 1.8), fm = eio(tt, 3.1, 4.9), leak = (1 - 0.55 * eio(tt, 2.2, 2.5)) * (1 - fm);
  const HW = 0.25, HD = 0.32, yb = lerp(0.6, 0.032, fm);
  return <>
    {/* vigas del piso del ático, lana rosa a los costados, cabeceras de la abertura y los cabios inclinados al fondo */}
    {[-0.29, 0.29, -0.9, 0.9].map((x, i) => <RBox key={i} s={[0.045, 0.18, 1.8]} p={[x, 0.0, 0]} r={0.004}>{M.wood({ base: [176, 134, 86] })}</RBox>)}
    {[-1, 1].map((k) => <RBox key={"hd" + k} s={[0.54, 0.18, 0.045]} p={[0, 0.0, k * (HD + 0.02)]} r={0.004}>{M.wood({ base: [168, 126, 80] })}</RBox>)}
    <Batt x={-0.6} w={0.55} /><Batt x={0.6} w={0.55} />
    {[-1, 1].map((k) => <group key={"bz" + k} position={[0, 0, k * 0.62]}><RBox s={[0.52, 0.1, 0.5]} p={[0, 0.05, 0]} r={0.03}><meshStandardMaterial color="#e3a29a" roughness={1} /></RBox></group>)}
    {/* el burlete negro que la mano tiende en el borde del marco */}
    {ws > 0.01 && [[-HW, 0, 0.012, 2 * HD], [HW, 0, 0.012, 2 * HD], [0, -HD, 2 * HW, 0.012], [0, HD, 2 * HW, 0.012]].map(([x, z, w, d], i) => <RBox key={"ws" + i} s={[Math.max(0.002, w * (w > 0.1 ? ws : 1)), 0.01, Math.max(0.002, d * (d > 0.1 ? ws : 1))]} p={[x, -0.02, z]} r={0.003}><meshStandardMaterial color="#1e1e20" roughness={0.9} /></RBox>)}
    <group visible={ws > 0.01 && ws < 0.99}><Hand p={[lerp(-HW + 0.05, HW - 0.05, ws), 0.1, HD - 0.02]} rot={[0, PI / 2, -0.6]} s={1.0} curl={0.4} thumb={0.6} /></group>
    {/* la tapa de terciado, con bisagra en el borde de atrás */}
    <group position={[0, -0.035, -HD]} rotation={[-open * 1.0, 0, 0]}>
      <RBox s={[2 * HW - 0.01, 0.02, 2 * HD - 0.01]} p={[0, 0, HD]} r={0.003}>{M.wood({ base: [196, 160, 112] })}</RBox>
    </group>
    {/* el calor que sube por los bordes: rendija encendida tibia y vaho (siempre montados, con rampa) */}
    {[[-HW, 0, 0.008, 2 * HD], [HW, 0, 0.008, 2 * HD], [0, -HD, 2 * HW, 0.008], [0, HD, 2 * HW, 0.008]].map(([x, z, w, d], i) => <mesh key={"lk" + i} position={[x, -0.012, z]}><boxGeometry args={[w + 0.008, 0.012, d + 0.008]} />{M.glow({ col: "#ffb060", op: 0.9 * leak })}</mesh>)}
    {[-1, 1].map((k) => <Puffs key={k} tt={tt + k} n={9} a={[k * HW, 0.0, 0]} b={[k * HW * 1.1, 0.5, 0]} r={0.02} col="#ffbf80" op={0.45 * leak} v={0.5} wob={0.03} />)}
    <pointLight position={[0, -0.25, 0]} intensity={2.5 * Math.max(leak, open)} distance={1.4} color="#ffb060" />
    {/* la placa de espuma rígida (celeste, con su impresión) que bajan las dos manos */}
    <group position={[0, yb, 0]} visible={tt > 2.6}>
      <RBox s={[0.6, 0.05, 0.72]} r={0.004}><meshStandardMaterial color="#9fc6e4" roughness={0.75} /></RBox>
      {[-0.2, 0, 0.2].map((z, i) => <mesh key={i} position={[0, 0.0255, z]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.012]} /><meshBasicMaterial color="#3d6f9c" /></mesh>)}
      <group visible={fm < 0.97}><Hand p={[-0.34, 0.03, 0.05]} s={1.0} curl={0.6} thumb={0.5} />
      <Hand p={[0.34, 0.03, -0.05]} rot={[0, PI, 0]} s={1.0} curl={0.6} thumb={0.5} /></group>
    </group>
    {fm > 0.98 && <Shock tt={tt} a={4.0} p={[0, 0.06, 0]} r={0.2} col="#7cd38a" />}
  </>;
}}</Scene3D>;

const wavyPane = (() => { let g: THREE.PlaneGeometry | null = null; return () => {
  if (g) return g; g = new THREE.PlaneGeometry(OW - 0.08, OH / 2 - 0.08, 60, 50); const a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i); a.setZ(i, 0.004 * Math.sin(y * 70 + Math.sin(x * 12) * 2) + 0.002 * Math.sin(x * 45)); }
  g.computeVertexNormals(); return g; }; })();
// ---- 27:23 · EL VIDRIO VIEJO: primer plano del vidrio ondulado de cien años; en el antepecho, un rollo de V y el sábado ----
export const HWavyGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.7, 1.6, 1.4]} warm={0.7}
  cam={{ at: [-0.02, 0.36, 0.05], at1: [0.02, -0.05, 0.1], az: [-0.3, -0.5], el: [0.06, 0.5], r: [0.8, 0.5], fov: 32 }}
  over={(tt) => <><Say tt={tt} a={0.5} b={2.8} txt="A HUNDRED YEARS IN THIS HOUSE" /><Say tt={tt} a={3.0} txt="A SATURDAY AND A ROLL OF V STRIP" col="#1f6a3a" /></>}>{(tt) => <>
  <OldWin p={[0, 0, 0]} sky="#c98f55" />
  {/* afuera: el árbol y el cerco que el vidrio viejo deforma */}
  <mesh position={[-0.08, 0.2, -0.12]}><cylinderGeometry args={[0.02, 0.026, 0.4, 12]} />{M.wood({ base: [60, 40, 26] })}</mesh>
  <mesh position={[-0.08, 0.5, -0.13]}><sphereGeometry args={[0.16, 20, 16]} /><meshStandardMaterial color="#3f5a2a" roughness={0.9} /></mesh>
  {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.02, 0.14, 0.01]} p={[-0.2 + i * 0.05, 0.1, -0.11]} r={0.002}><meshStandardMaterial color="#f2efe8" /></RBox>)}
  <mesh position={[0, 0.2, 0.05]} geometry={wavyPane()}><meshPhysicalMaterial transmission={1} ior={1.52} thickness={0.04} roughness={0.0} color="#f2fbf4" transparent opacity={1} /></mesh>
  <WallAround mat={<meshStandardMaterial map={wpMat("#3e5a5a", "#466262", "#e0cf9a", 8, 8)} roughness={0.9} />} />
  {/* el sábado: la mano desenrolla la V de bronce a lo largo del antepecho, para medirla */}
  {(() => { const g = eio(tt, 3.0, 5.2), x0 = 0.2, xr = x0 - 0.38 * g; return <group visible={tt > 2.9}>
    <RBox s={[Math.max(0.002, x0 - xr), 0.003, 0.026]} p={[(x0 + xr) / 2, 0.012, 0.1]} r={0.001} visible={g > 0.01}><meshStandardMaterial color="#c9874a" metalness={1} roughness={0.25} /></RBox>
    <group position={[xr, 0.034, 0.1]} rotation={[0, 0, g * 9]}>
      {[0, 1, 2, 3].map((i) => <mesh key={i}><torusGeometry args={[0.012 + i * 0.005, 0.0035, 6, 30]} />{M.brass({ col: "#d8a057" })}</mesh>)}
    </group>
    <Hand p={[xr - 0.01, 0.075, 0.11]} rot={[0, PI / 2, 0]} s={0.55} curl={0.6} thumb={0.5} />
  </group>; })()}
</>}</Scene3D>;
