// gary04 · componentes únicos 3/4 (min 11-16)
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, fall, tubeG } from "./h3d";
import { Fridge, PI, Txt3, cl, eio, lerp, phys, pop } from "./gk";
import { House, Spark } from "./gh1";
import { Roller } from "./gh2";

type V = [number, number, number];
const Shadow: React.FC<{ p: V; r: number; op?: number; s?: number }> = ({ p, r, op = 0.45, s = 1 }) => <mesh position={p} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, s)}><circleGeometry args={[r, 32]} /><meshBasicMaterial color="#000" transparent opacity={op} depthWrite={false} /></mesh>;

// 11:51 · LA RADIO A MANIVELA: la radio entra deslizándose por la mesa; la manivela grande gira y cada vuelta larga un anillo de sonido que viaja hasta el borde
export const HRadio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#120e0b" warm={0.7}
  cam={{ at: [0.0, 0.16, 0.04], az: [-0.42, -0.2], el: [0.2, 0.14], r: [1.12, 1.0], fov: 30 }} lamp={[0, 0.7, 0.5]}>{(tt) => {
  const slide = cl(phys(tt, 0.25, 6, 0.55)), x = lerp(0.95, 0, slide), turns = eio(tt, 0.2, 4.8) * 7, crank = turns * 2 * PI, ant = eio(tt, 0.5, 1.1), live = cl((tt - 1.0) / 0.4);
  return <>
    <Shadow p={[x, 0.002, 0.02]} r={0.3} s={1} />
    <group position={[x, 0, 0]} scale={1.25}>
      <RBox s={[0.36, 0.2, 0.12]} p={[0, 0.1, 0]} r={0.025}>{M.plastic({ col: "#d8361f" })}</RBox>
      <mesh position={[-0.08, 0.1, 0.061]}><circleGeometry args={[0.065, 40]} />{M.matte({ col: "#1c1d20" })}</mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.08, 0.1, 0.062]}><ringGeometry args={[0.012 + i * 0.012, 0.016 + i * 0.012, 40]} />{M.matte({ col: "#3a3c40" })}</mesh>)}
      <mesh position={[0.09, 0.13, 0.061]}><planeGeometry args={[0.13, 0.05]} /><meshStandardMaterial color="#1a1206" emissive="#ffb84a" emissiveIntensity={1.2 * live} /></mesh>
      <mesh position={[0.06 + 0.06 * live, 0.13, 0.062]}><planeGeometry args={[0.004, 0.045]} /><meshBasicMaterial color="#c62a22" /></mesh>
      <mesh position={[0.09, 0.06, 0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.02, 24]} />{M.matte({ col: "#2a2c30" })}</mesh>
      <mesh position={[0.15, 0.2 + 0.15 * ant, -0.03]} rotation={[0, 0, -0.25]} scale={[1, Math.max(0.001, ant), 1]}><cylinderGeometry args={[0.004, 0.006, 0.3, 8]} />{M.chrome()}</mesh>
      {/* la manivela grande, protagonista, al costado */}
      <group position={[0.19, 0.1, 0]} rotation={[crank, 0, 0]} scale={1.8}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.014, 0.014, 0.02, 16]} />{M.steel()}</mesh>
        <mesh position={[0.012, 0.035, 0]}><boxGeometry args={[0.008, 0.08, 0.016]} />{M.steel()}</mesh>
        <mesh position={[0.03, 0.07, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.045, 12]} />{M.plastic({ col: "#1c1d20" })}</mesh>
      </group>
    </group>
    {/* un anillo de sonido grande por vuelta, que viaja hasta el borde del cuadro */}
    {[0, 1, 2, 3, 4, 5, 6].map((n) => { const ph = cl((turns - n) / 1.6); return <mesh key={n} position={[x - 0.02, 0.004, 0.06]} rotation={[-PI / 2, 0, 0]} scale={ph > 0 && ph < 1 ? 1.4 + ph * 4.5 : 0.001}><ringGeometry args={[0.06, 0.068, 64]} />{M.glow({ col: "#ffae3a", op: 0.85 * (1 - ph) })}</mesh>; })}
  </>;
}}</Scene3D>;

// 12:10 · EL ORDEN PARA COMER: los muebles entran de a uno; un bloque 1, 2, 3 cae con peso sobre heladera, freezer y alacena; el activo se ilumina y los demás se apagan
export const HEatOrder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile" bg="#16181c"
  cam={{ at: [0, 0.42, 0], az: [0.0, 0.06], el: [0.16, 0.12], r: [2.3, 2.18], fov: 30 }} lamp={[0, 0.9, 0.6]}>{(tt) => {
  const T = [1.2, 2.4, 3.6], act = tt < T[1] ? 0 : tt < T[2] ? 1 : 2, lit = (i: number) => (i === act ? 1 : 0.15) * cl((tt - T[i] + 0.1) / 0.2), door = 0;
  const X = [-0.46, 0, 0.46], TOP = [0.76, 0.37, 0.62], COL = ["#c98a2a", "#9aa3ad", "#c98a2a"];
  return <>
    <group position={[X[0], 0, 0]} scale={pop(tt, 0.1)}><Fridge s={1.15} door={door} lit={lit(0)} /></group>
    <group position={[X[1], 0, 0]} scale={pop(tt, 0.3)}>
      <RBox s={[0.36, 0.32, 0.26]} p={[0, 0.16, 0]} r={0.02}>{M.porcelain()}</RBox>
      <RBox s={[0.37, 0.03, 0.27]} p={[0, 0.335, 0]} r={0.01}>{M.porcelain({ col: "#e4e8ea" })}</RBox>
      <mesh position={[0, 0.25, 0.131]}><boxGeometry args={[0.14, 0.02, 0.01]} />{M.steel()}</mesh>
      <pointLight position={[0, 0.45, 0.25]} intensity={1.2 * lit(1)} distance={0.6} color="#d8ecff" />
    </group>
    <group position={[X[2], 0, 0]} scale={pop(tt, 0.5)}>
      <RBox s={[0.32, 0.6, 0.2]} p={[0, 0.3, -0.02]} r={0.008}>{M.wood({ base: [130, 92, 58] })}</RBox>
      {[0.15, 0.32, 0.49].map((y) => <group key={y}>
        <mesh position={[0, y - 0.07, 0.04]}><boxGeometry args={[0.3, 0.012, 0.16]} />{M.wood({ base: [150, 110, 70] })}</mesh>
        {[-0.09, 0, 0.09].map((x) => <mesh key={x} position={[x, y - 0.025, 0.06]}><cylinderGeometry args={[0.032, 0.032, 0.08, 20]} />{M.steel({ col: x === 0 ? "#c62a22" : "#2f74c4" })}</mesh>)}
      </group>)}
      <pointLight position={[0, 0.5, 0.3]} intensity={1.2 * lit(2)} distance={0.6} color="#ffe2b0" />
    </group>
    <pointLight position={[X[0], 0.5, 0.4]} intensity={1.0 * lit(0)} distance={0.7} color="#eaf4ff" />
    {/* los bloques gruesos con su número, que caen con peso y rebote */}
    {X.map((x, i) => <Shadow key={"sh" + i} p={[x, TOP[i] + 0.004, 0.02]} r={0.16} op={0.55} s={cl((tt - T[i]) / 0.4)} />)}
    {X.map((x, i) => <group key={i} position={[x, TOP[i] + 0.08 + fall(tt, T[i], 0.6, 9, 0.32), 0.02]} scale={tt > T[i] - 0.02 ? 1 : 0.001}>
      <RBox s={[0.24, 0.24, 0.24]} r={0.022}>{i !== act ? M.matte({ col: "#6f7c8c" }) : i === 1 ? M.chrome({ col: COL[i] }) : M.brass({ col: COL[i] })}</RBox>
      <Txt3 txt={String(i + 1)} w={0.18} h={0.19} col={i !== act ? "#2a3240" : "#141516"} weight={900} p={[0, 0, 0.1215]} />
    </group>)}
  </>;
}}</Scene3D>;

// 13:04 · CAPAS: un maniquí con hombros y brazos recibe tres capas cada vez más gordas (azul, polar naranja, campera roja); el gorro cae último con peso
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" bg="#101114"
  cam={{ at: [0.05, 0.44, 0], az: [-0.25, 0.1], el: [0.1, 0.06], r: [1.75, 1.6], fov: 30 }} lamp={[0, 0.8, 0.6]}>{(tt) => {
  const L = (i: number) => cl(phys(tt, 0.7 + i * 0.95, 8, 0.45)), hatY = 0.63 + fall(tt, 3.7, 0.45, 9, 0.3);
  const lay: [string, number, number][] = [["#3d6fb0", 0.006, 0.55], ["#e2782a", 0.022, 0.95], ["#b8241a", 0.04, 0.5]];
  const Body: React.FC<{ g: number; mat: React.ReactNode; sy?: number }> = ({ g, mat, sy = 1.25 }) => <>
    <mesh position={[0, 0.38, 0]} scale={[1, sy, 0.75]}><capsuleGeometry args={[0.1 + g, 0.12, 8, 24]} />{mat}</mesh>
    {[-1, 1].map((sd) => <group key={sd}>
      <mesh position={[sd * (0.115 + g * 0.6), 0.5, 0]}><sphereGeometry args={[0.04 + g, 16, 12]} />{mat}</mesh>
      <mesh position={[sd * (0.15 + g * 0.6), 0.38 + (1.25 - sy) * 0.08, 0]} rotation={[0, 0, sd * 0.18]}><capsuleGeometry args={[0.03 + g * 0.8, 0.2 * sy / 1.25, 6, 16]} />{mat}</mesh>
    </group>)}
  </>;
  return <group>
    <Shadow p={[0, 0.002, 0]} r={0.22} />
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.1, 0.12, 0.03, 32]} />{M.wood({ base: [90, 60, 38] })}</mesh>
    <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.01, 0.01, 0.24, 10]} />{M.steel()}</mesh>
    <Body g={0} mat={M.matte({ col: "#e8dcc4" })} />
    <mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.07, 24, 18]} />{M.matte({ col: "#e8dcc4" })}</mesh>
    {/* cada capa baja desde arriba y se calza sobre la anterior, más gorda */}
    {lay.map(([c, g, rough], i) => { const k = L(i); return <group key={i} position={[0, lerp(0.24, 0, k), 0]} scale={tt > 0.68 + i * 0.95 ? 1 : 0.001}>
      <group position={[0, 0, i === 2 ? -0.035 : 0]}><Body g={g} sy={[1.12, 0.98, 0.82][i]} mat={<meshStandardMaterial color={c} roughness={rough} />} /></group>
    </group>; })}
    {/* pastillitas de color al costado, una por capa */}
    {lay.map(([c], i) => <RBox key={"c" + i} s={[0.08, 0.08, 0.025]} p={[0.36, 0.52 - i * 0.11, 0.05]} r={0.012}>{M.plastic({ col: c })}</RBox>).map((el, i) => <group key={i} scale={pop(tt, 0.9 + i * 0.95)}>{el}</group>)}
    <group position={[0, hatY, 0]} visible={tt > 3.68}>
      <mesh><sphereGeometry args={[0.078, 24, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#2a5a3a" roughness={0.95} /></mesh>
      <mesh position={[0, -0.005, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.076, 0.014, 10, 32]} /><meshStandardMaterial color="#e8e2d4" roughness={0.95} /></mesh>
      <mesh position={[0, 0.085, 0]}><sphereGeometry args={[0.025, 14, 12]} /><meshStandardMaterial color="#e8e2d4" roughness={1} /></mesh>
    </group>
  </group>;
}}</Scene3D>;

// 13:51 · LA BOLSA DE AGUA CALIENTE: la bolsa con forma (cuerpo ondulado, tapón) se mete bajo la frazada y la levanta; una onda naranja corre hacia los pies y el reloj llega a las 6
export const HHotBottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#120e0b" warm={0.55}
  cam={{ at: [0.12, 0.2, 0], az: [-0.35, 0.05], el: [0.45, 0.36], r: [1.5, 1.36], fov: 30 }} lamp={[0, 0.7, 0.4]}>{(tt) => {
  const slide = eio(tt, 0.4, 1.5), bx = 0.1, bz = lerp(0.5, 0, slide), under = cl((0.25 - bz) / 0.15), wave = eio(tt, 1.6, 4.0), hrs = 6 * eio(tt, 1.6, 4.4);
  return <>
    <RBox s={[0.7, 0.12, 0.42]} p={[0, 0.06, 0]} r={0.02}>{M.wood({ base: [110, 72, 44] })}</RBox>
    <RBox s={[0.66, 0.06, 0.4]} p={[0, 0.15, 0]} r={0.03}>{M.matte({ col: "#b3aa9a" })}</RBox>
    <RBox s={[0.16, 0.05, 0.3]} p={[-0.25, 0.205, 0]} r={0.025}>{M.matte({ col: "#f6f1e6" })}</RBox>
    {/* la bolsa de goma: cuerpo con estrías, cuello y tapón */}
    <group position={[bx, 0.235 + 0.04 * (1 - under), bz]} rotation={[0, 0, 0]} scale={1.9}>
      <mesh scale={[1.25, 0.42, 0.85]}><sphereGeometry args={[0.085, 32, 20]} /><meshStandardMaterial color="#c62a22" roughness={0.45} /></mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.05 + i * 0.025, 0.032, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05 - Math.abs(i - 2) * 0.008, 0.003, 6, 24, PI]} /><meshStandardMaterial color="#a8221c" roughness={0.5} /></mesh>)}
      <mesh position={[0.115, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.03, 0.03, 16]} />{M.rubber({ col: "#c62a22" })}</mesh>
      <mesh position={[0.14, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.025, 16]} />{M.plastic({ col: "#1c1d20" })}</mesh>
    </group>
    {/* la frazada: tramos que se levantan sobre la bolsa y se encienden cuando pasa la onda de calor */}
    <RBox s={[0.5, 0.03, 0.42]} p={[0.08, 0.205, 0]} r={0.012}><meshStandardMaterial color="#a8987c" emissive="#ff8a3a" emissiveIntensity={0.05 * cl(wave * 2)} roughness={0.95} /></RBox>
    {[-0.12, -0.04, 0.04, 0.12].map((z) => <mesh key={"pl" + z} position={[0.12, 0.222, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.4, 10]} /><meshStandardMaterial color="#d6c4a2" roughness={0.95} /></mesh>)}
    <mesh position={[Math.max(-0.12, bx - 0.04), 0.215, 0]} scale={[2.3, Math.max(0.001, 1.1 * under), 1.5]}><sphereGeometry args={[0.1, 28, 14, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#a8987c" emissive="#ff8a3a" emissiveIntensity={0.06 * cl(wave * 2)} roughness={0.95} /></mesh>
    {[0, 1].map((i) => { const k = ((tt - 1.6) * 0.45 + i / 2 + 10) % 1; return <mesh key={"hw" + i} position={[lerp(-0.05, 0.32, k), 0.226, 0]} rotation={[-PI / 2, 0, 0]} scale={wave > 0.02 ? 1 : 0.001}><planeGeometry args={[0.15, 0.4]} /><meshBasicMaterial color="#ff6a10" transparent opacity={0.75 * Math.sin(PI * k)} depthWrite={false} toneMapped={false} /></mesh>; })}
    <pointLight position={[lerp(-0.05, 0.3, wave), 0.3, 0.1]} intensity={0.3 * cl(wave * 3)} distance={0.6} color="#ff8a3a" />
    {/* reloj despertador en la mesita: la aguja corta llega a las 6 */}
    <group position={[0.56, 0, -0.16]} scale={1.4}>
      <RBox s={[0.16, 0.12, 0.16]} p={[0, 0.06, 0]} r={0.01}>{M.wood({ base: [96, 62, 36] })}</RBox>
      <group position={[0, 0.2, 0]} rotation={[0, -0.5, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 40]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.062, 40]} /><meshStandardMaterial color="#f4f1ea" /></mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.052, Math.cos(i * PI / 6) * 0.052, 0.017]}><boxGeometry args={[0.004, 0.008, 0.001]} /><meshBasicMaterial color="#1b1b1b" /></mesh>)}
        <group position={[0, 0, 0.018]} rotation={[0, 0, -hrs / 12 * 2 * PI]}><mesh position={[0, 0.018, 0]}><boxGeometry args={[0.006, 0.036, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh></group>
        <group position={[0, 0, 0.019]} rotation={[0, 0, -hrs * 2 * PI]}><mesh position={[0, 0.025, 0]}><boxGeometry args={[0.004, 0.05, 0.002]} /><meshBasicMaterial color="#c62a22" /></mesh></group>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.045, 0.065, -0.005]}><sphereGeometry args={[0.02, 14, 10, 0, 2 * PI, 0, PI / 2]} />{M.brass()}</mesh>)}
      </group>
    </group>
  </>;
}}</Scene3D>;

// 14:59 · TODOS ARRANCAN A LA VEZ: el transformador del poste en primer plano; al volver la luz los pulsos corren por los cables, las casas prenden de golpe y el transformador se pone al rojo y escupe chispas
const IR_X = [-0.75, -0.5, -0.25, 0.0, 0.25];
export const HInrush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0b0f18" warm={0.55}
  cam={{ at: [-0.12, 0.34, -0.05], az: [-0.3, -0.2], el: [0.14, 0.1], r: [2.25, 2.1], fov: 30 }} lamp={[0, 0.9, 0.6]}>{(tt) => {
  const T0 = 1.3, pulse = cl((tt - T0) / 0.5), lit = (i: number) => cl((tt - T0 - 0.4 - i * 0.05) / 0.06), hot = eio(tt, T0 + 0.5, T0 + 0.9) * (1 - 0.6 * eio(tt, 3.8, 4.6)), shake = hot > 0.3 ? 0.006 * Math.sin(tt * 70) * hot : 0;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, 0]}><planeGeometry args={[4, 3]} /><meshStandardMaterial color="#c9d4e2" roughness={0.95} /></mesh>
    {IR_X.map((x, i) => <House key={i} p={[x, 0, -0.3]} lit={lit(i)} s={1.05} col={["#8a6a52", "#6a7a8a", "#9a7a5a", "#7a5a4a", "#5a6a5a"][i]} />)}
    {/* cables gruesos de cada casa al poste, con el pulso que corre */}
    {IR_X.map((x, i) => { const P: V[] = [[x, 0.2, -0.3], [(x + 0.55) / 2, 0.36, -0.2], [0.55, 0.52, -0.06]]; return <group key={i}>
      <mesh geometry={tubeG("ir2" + i, P, 0.006, 24, 6)}>{M.rubber({ col: "#141414" })}</mesh>
      {(() => { const u = 1 - pulse, a = u < 0.5 ? P[1] : P[0], b = u < 0.5 ? P[2] : P[1], w = u < 0.5 ? 1 - u * 2 : 1 - (u - 0.5) * 2; return <mesh position={[lerp(b[0], a[0], 1 - w), lerp(b[1], a[1], 1 - w), lerp(b[2], a[2], 1 - w)]} scale={pulse > 0 && pulse < 1 ? 1 : 0.001}><sphereGeometry args={[0.028, 12, 10]} />{M.glow({ col: "#ffe9a0" })}</mesh>; })()}
    </group>; })}
    {/* el poste y el transformador grande en primer plano */}
    <mesh position={[0.55, 0.3, -0.06]}><cylinderGeometry args={[0.022, 0.028, 0.66, 12]} />{M.wood({ base: [90, 64, 44] })}</mesh>
    <group position={[0.55 + shake, 0.52, 0.02]} scale={1.5}>
      <mesh><cylinderGeometry args={[0.06, 0.06, 0.14, 28]} /><meshStandardMaterial color="#8a9096" metalness={0.6} roughness={0.4} emissive="#ff3a1a" emissiveIntensity={1.2 * hot} /></mesh>
      {[-0.03, 0.03].map((x) => <mesh key={x} position={[x, 0.085, 0]}><cylinderGeometry args={[0.008, 0.012, 0.03, 10]} />{M.porcelain({ col: "#6a5a4a" })}</mesh>)}
    </group>
    <pointLight position={[0.55, 0.55, 0.2]} intensity={2.2 * hot} distance={0.8} color="#ff5a2a" />
    {Array.from({ length: 20 }, (_, i) => { const k = cl((tt - T0 - 0.5 - (i % 10) * 0.08) / 0.5), a = i * 1.1; return <mesh key={i} position={[0.55 + Math.cos(a) * 0.25 * k, 0.6 + Math.sin(a) * 0.12 * k + 0.1 * k - 0.4 * k * k, 0.05 + Math.sin(a * 1.3) * 0.12 * k]} scale={k > 0 && k < 1 ? 1 : 0.001}><sphereGeometry args={[0.018, 6, 4]} />{M.glow({ col: "#ffd86a" })}</mesh>; })}
    <Spark p={[0.55, 0.65, 0.05]} k={(tt - T0 - 0.5) / 0.6} s={2.4} />
  </>;
}}</Scene3D>;

// 15:28 · DE A UNO: heladera, freezer, horno y tele se prenden de a uno; cada pico sube por su cable al medidor de aguja y nunca toca la raya roja
export const HStagger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0f1014"
  cam={{ at: [0.1, 0.3, 0], az: [0.0, 0.06], el: [0.2, 0.14], r: [2.05, 1.92], fov: 30 }} lamp={[0, 0.8, 0.6]}>{(tt) => {
  const T = [0.8, 1.9, 3.0, 4.1], X = [-0.5, -0.17, 0.17, 0.5], pk = (i: number) => tt < T[i] ? 0 : tt < T[i] + 0.25 ? (tt - T[i]) / 0.25 : 1 - eio(tt, T[i] + 0.25, T[i] + 0.7);
  const needle = Math.max(...T.map((_, i) => pk(i) * 0.62)) + 0.08 * T.filter((a) => tt > a).length / 4, on = (i: number) => cl((tt - T[i]) / 0.1);
  return <>
    {/* los cuatro aparatos de verdad */}
    <group position={[X[0], 0, 0.05]} scale={pop(tt, 0.5)}><Fridge s={0.75} lit={on(0)} door={0.2 * on(0)} /></group>
    <group position={[X[1], 0, 0.05]} scale={pop(tt, 1.6)}>
      <RBox s={[0.26, 0.24, 0.2]} p={[0, 0.12, 0]} r={0.02}>{M.porcelain()}</RBox>
      <mesh position={[0, 0.2, 0.101]}><circleGeometry args={[0.008, 12]} /><meshStandardMaterial color="#030" emissive="#3aff6a" emissiveIntensity={2 * on(1)} toneMapped={false} /></mesh>
    </group>
    <group position={[X[2], 0, 0.05]} scale={pop(tt, 2.7)}>
      <RBox s={[0.26, 0.3, 0.22]} p={[0, 0.15, 0]} r={0.01}>{M.steel({ col: "#c9ccd0" })}</RBox>
      <mesh position={[0, 0.12, 0.111]}><planeGeometry args={[0.18, 0.1]} /><meshStandardMaterial color="#1a0d06" emissive="#ff6a2a" emissiveIntensity={1.2 * on(2)} /></mesh>
    </group>
    <group position={[X[3], 0, 0.05]} scale={pop(tt, 3.8)}>
      <RBox s={[0.3, 0.19, 0.025]} p={[0, 0.17, 0]} r={0.008}>{M.matte({ col: "#141414" })}</RBox>
      <mesh position={[0, 0.17, 0.014]}><planeGeometry args={[0.27, 0.16]} /><meshStandardMaterial color="#0b0d10" emissive="#3a7ad8" emissiveIntensity={1.0 * on(3)} /></mesh>
      <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.02, 0.08, 0.02]} />{M.matte({ col: "#1c1d20" })}</mesh>
    </group>
    {/* cables al medidor y el pulso de cada arranque */}
    {X.map((x, i) => { const P: V[] = [[x, 0.06, -0.06], [(x + 0.6) / 2, 0.3 + 0.05 * i, -0.12], [0.56, 0.34, -0.12]]; const u = cl((tt - T[i]) / 0.35); return <group key={i}>
      <mesh geometry={tubeG("stg" + i, P, 0.02, 24, 8)}>{M.rubber({ col: "#141414" })}</mesh>
      <mesh position={[lerp(P[0][0], P[2][0], u), lerp(P[0][1], P[2][1], u) + 0.05 * Math.sin(PI * u), -0.11]} scale={u > 0 && u < 1 ? 1 : 0.001}><sphereGeometry args={[0.042, 12, 10]} />{M.glow({ col: "#ffe9a0" })}</mesh>
    </group>; })}
    {/* el medidor de aguja con la raya roja */}
    <group position={[0.62, 0.36, -0.1]} rotation={[0, -0.2, 0]} scale={1.6}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.03, 48]} />{M.matte({ col: "#141516" })}</mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.108, 48]} /><meshStandardMaterial color="#f3efe5" /></mesh>
      <mesh position={[0, 0, 0.017]}><ringGeometry args={[0.08, 0.1, 40, 1, 0.35, 0.45]} /><meshBasicMaterial color="#d8361f" /></mesh>
      <group position={[0, 0, 0.019]} rotation={[0, 0, 1.25 - 1.6 * needle]}><mesh position={[0, 0.045, 0]}><boxGeometry args={[0.007, 0.09, 0.003]} /><meshBasicMaterial color="#141516" /></mesh></group>
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.01, 16]} /><meshBasicMaterial color="#c62a22" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// 15:59 · ARRIBA DE 40 °F: la caja de leche transparente ES el termómetro; el nivel sube, se enturbia al cruzar la raya roja de 40 y la caja se inclina y cae al tacho
export const HFortyTwo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" bg="#16181c"
  cam={{ at: [0.04, 0.3, 0], az: [-0.12, 0.06], el: [0.16, 0.12], r: [1.62, 1.52], fov: 30 }} lamp={[0, 0.8, 0.6]}>{(tt) => {
  const rise = eio(tt, 0.6, 2.6), deg = lerp(34, 46, rise), bad = cl((deg - 40) / 1.5), dx = lerp(-0.8, 0, cl(phys(tt, 0.05, 6, 0.55)));
  const toss = eio(tt, 3.0, 3.7), cx = lerp(0.02, 0.42, toss) + 0.6 * (1 - cl(phys(tt, 0.2, 6, 0.55))), cy = 0.2 * Math.sin(PI * toss) + 0.08 * toss, lid = cl(phys(tt, 3.75, 9, 0.4));
  const ang = (d: number) => 2.3 - 4.6 * (d - 30) / 20;
  return <>
    {/* el termómetro de dial grande, con la zona roja de 40 a 50 */}
    <group position={[-0.38 + dx, 0.32, 0.0]} rotation={[0, 0.2, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 64]} />{M.chrome()}</mesh>
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.18, 64]} /><meshStandardMaterial color="#f4f1ea" /></mesh>
      <mesh position={[0, 0, 0.022]}><ringGeometry args={[0.13, 0.17, 48, 1, PI / 2 - ang(50), ang(40) - ang(50)]} /><meshBasicMaterial color="#d8361f" /></mesh>
      <mesh position={[0, 0, 0.022]}><ringGeometry args={[0.13, 0.17, 48, 1, PI / 2 - ang(40), ang(30) - ang(40)]} /><meshBasicMaterial color="#58a8ff" /></mesh>
      {Array.from({ length: 11 }, (_, i) => { const a = ang(30 + i * 2); return <mesh key={i} position={[Math.sin(a) * 0.115, Math.cos(a) * 0.115, 0.023]} rotation={[0, 0, -a]}><boxGeometry args={[0.005, i % 5 ? 0.014 : 0.026, 0.001]} /><meshBasicMaterial color="#1b1b1b" /></mesh>; })}
      <group position={[0, 0, 0.026]} rotation={[0, 0, -ang(deg) + (bad > 0.5 ? 0.03 * Math.sin(tt * 30) * Math.exp(-(tt - 2.6) * 3) : 0)]}><mesh position={[0, 0.07, 0]}><boxGeometry args={[0.012, 0.15, 0.003]} /><meshBasicMaterial color="#141516" /></mesh></group>
      <mesh position={[0, 0, 0.029]}><circleGeometry args={[0.016, 20]} /><meshBasicMaterial color="#c62a22" /></mesh>
      <Txt3 txt={`${Math.round(deg)}°F`} w={0.14} h={0.06} col={bad > 0.5 ? "#c62a22" : "#1b2a44"} weight={900} p={[0, -0.08, 0.03]} />
    </group>
    {/* la caja de leche: entra deslizando, se agria y se tira */}
    <Shadow p={[cx, 0.003, 0.05]} r={0.1} s={1 - 0.5 * Math.sin(PI * toss)} />
    <group position={[cx, cy, lerp(0.05, -0.04, toss)]} rotation={[0, -0.3, -0.5 * toss]} scale={1.8 * (1 - 0.35 * toss)}>
      <RBox s={[0.1, 0.2, 0.1]} p={[0, 0.1, 0]} r={0.006}><meshStandardMaterial color="#f6f6f0" roughness={0.3} transparent opacity={0.45} depthWrite={false} /></RBox>
      <mesh position={[0, 0.005 + 0.09 * (0.3 + 0.7 * rise), 0]} scale={[1, 0.3 + 0.7 * rise, 1]}><boxGeometry args={[0.09, 0.18, 0.09]} /><meshStandardMaterial color={bad > 0.5 ? "#c8d48a" : "#fbfbf6"} roughness={0.5} /></mesh>
      <mesh position={[0, 0.005 + 0.18 * 0.65, 0.0505]}><planeGeometry args={[0.1, 0.006]} /><meshBasicMaterial color="#d8361f" /></mesh>
      <mesh position={[0, 0.22, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.072, 0.045, 4]} />{M.matte({ col: "#2f74c4" })}</mesh>
      <mesh position={[0, 0.14, 0.051]}><planeGeometry args={[0.1, 0.05]} /><meshBasicMaterial color="#2f74c4" /></mesh>
      <Txt3 txt="MILK" w={0.08} h={0.035} col="#ffffff" weight={900} p={[0, 0.14, 0.052]} />
      {[0, 1, 2, 3].map((k) => <mesh key={k} position={[-0.03 + k * 0.02, 0.05 + (k % 2) * 0.03, 0.052]} scale={Math.max(0.001, bad)}><circleGeometry args={[0.008, 10]} /><meshBasicMaterial color="#6a8a2a" /></mesh>)}
    </group>
    <group position={[0.42, 0, -0.04]}>
      <Shadow p={[0, 0.002, 0]} r={0.15} />
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.13, 0.11, 0.24, 32, 1, true]} />{M.steel({ col: "#8a9096", side: 2 })}</mesh>
      <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.11, 0.11, 0.01, 32]} />{M.steel({ col: "#6a7076" })}</mesh>
      <group position={[0, 0.245, -0.13]} rotation={[-1.4 * eio(tt, 2.6, 2.9), 0, 0]}>
        <mesh position={[0, 0, 0.13]}><cylinderGeometry args={[0.135, 0.135, 0.015, 32]} />{M.steel({ col: "#9aa0a6" })}</mesh>
      </group>
    </group>
  </>;
}}</Scene3D>;

// 16:31 · EL RESET DE LA CALDERA: la puerta del gabinete se abre; la plaqueta late en rojo; un dedo entra y aprieta reset con resorte; LED verde y se encienden las llamas azules
export const HFurnace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0e0f12"
  cam={{ at: [0.02, 0.32, 0], az: [-0.3, -0.1], el: [0.12, 0.08], r: [1.05, 0.92], fov: 30 }} lamp={[0, 0.8, 0.6]}>{(tt) => {
  const door = eio(tt, 0.0, 0.6), reach = eio(tt, 1.2, 1.8), press = tt < 1.8 ? 0 : tt < 2.3 ? cl(phys(tt, 1.8, 14, 0.3)) : 1 - eio(tt, 2.3, 2.6), ok = tt > 2.05, flame = eio(tt, 2.8, 3.3), blink = ok ? 1 : (Math.sin(tt * 10) > 0 ? 1 : 0.1);
  const sand = eio(tt, 2.1, 4.8);
  return <group position={[lerp(-0.6, 0, cl(phys(tt, 0.05, 6, 0.55))), 0, 0]}>
    <RBox s={[0.44, 0.6, 0.3]} p={[0, 0.3, -0.12]} r={0.01}>{M.steel({ col: "#c9ccd0" })}</RBox>
    <mesh position={[0, 0.3, 0.031]}><planeGeometry args={[0.38, 0.54]} />{M.matte({ col: "#1a1c20" })}</mesh>
    {/* la puerta del frente que se abre sobre su bisagra */}
    <group position={[-0.21, 0.3, 0.035]} rotation={[0, -1.8 * door, 0]}><RBox s={[0.42, 0.56, 0.012]} p={[0.21, 0, 0.006]} r={0.006}>{M.matte({ col: "#8e9398" })}</RBox></group>
    {/* la plaqueta, grande, con el LED y un relojito de arena */}
    <group position={[-0.06, 0.44, 0.04]} scale={1.4}>
      <RBox s={[0.16, 0.1, 0.006]} r={0.003}><meshStandardMaterial color="#1f5a2a" roughness={0.6} /></RBox>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.06 + i * 0.024, -0.03, 0.005]}><boxGeometry args={[0.012, 0.008, 0.004]} />{M.matte({ col: "#111" })}</mesh>)}
      <mesh position={[0.05, 0.02, 0.008]}><sphereGeometry args={[0.012, 14, 10]} /><meshStandardMaterial color="#300" emissive={ok ? "#3aff6a" : "#ff2a1a"} emissiveIntensity={1.6 * blink} /></mesh>
      <group position={[-0.045, 0.02, 0.02]} scale={0.6}>
        <mesh position={[0, 0.02, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.018, 0.035, 12]} />{M.glass({ op: 0.35 })}</mesh>
        <mesh position={[0, -0.02, 0]}><coneGeometry args={[0.018, 0.035, 12]} />{M.glass({ op: 0.35 })}</mesh>
        <mesh position={[0, 0.02 - 0.008 * sand, 0]} rotation={[PI, 0, 0]} scale={Math.max(0.001, 1 - sand)}><coneGeometry args={[0.014, 0.025, 12]} /><meshStandardMaterial color="#e2b46a" /></mesh>
        <mesh position={[0, -0.028, 0]} scale={Math.max(0.001, sand)}><coneGeometry args={[0.014, 0.022, 12]} /><meshStandardMaterial color="#e2b46a" /></mesh>
      </group>
    </group>
    
    {/* el botón rojo de reset y la mano con el índice que entra y aprieta */}
    <mesh position={[0.12, 0.44, 0.045 - 0.008 * press]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.016, 20]} />{M.plastic({ col: "#d8361f" })}</mesh>
    <group position={[0.12 + 0.35 * (1 - reach), 0.44 - 0.02, 0.09 - 0.025 * press]} scale={reach > 0.001 ? 1.5 : 0.001}>
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0.02, 0.03]}><capsuleGeometry args={[0.011, 0.05, 6, 12]} />{M.matte({ col: "#e0b08a" })}</mesh>
      <RBox s={[0.075, 0.03, 0.08]} p={[0.01, 0.01, 0.1]} r={0.014}>{M.matte({ col: "#d9a67e" })}</RBox>
      <mesh position={[0.012, -0.008, 0.065]} rotation={[0.9, 0, 0]}><capsuleGeometry args={[0.012, 0.03, 6, 10]} />{M.matte({ col: "#d9a67e" })}</mesh>
      <mesh position={[0.045, 0.01, 0.085]} rotation={[PI / 2, 0, -0.6]}><capsuleGeometry args={[0.01, 0.035, 6, 10]} />{M.matte({ col: "#e0b08a" })}</mesh>
      <mesh position={[0, 0.03, 0.0]} scale={[1, 0.35, 1.5]}><sphereGeometry args={[0.009, 14, 10]} /><meshStandardMaterial color="#f4dcd0" roughness={0.25} /></mesh>
      <mesh position={[0, 0.024, 0.042]}><sphereGeometry args={[0.0135, 14, 10]} />{M.matte({ col: "#d9a67e" })}</mesh>
      <mesh position={[0, 0.02, 0.022]} rotation={[0, 0, 0]}><torusGeometry args={[0.0112, 0.0012, 6, 20]} />{M.matte({ col: "#b8865e" })}</mesh>
    </group>
    {/* la fila de quemadores: llamas azules en capas que iluminan el interior */}
    {Array.from({ length: 6 }, (_, i) => <group key={i} position={[-0.15 + i * 0.06, 0.14, 0.04]}>
      <mesh><cylinderGeometry args={[0.012, 0.014, 0.03, 12]} />{M.steel({ col: "#6a7076" })}</mesh>
      <mesh position={[0, 0.045, 0]} scale={[1, Math.max(0.001, eio(tt, 2.8 + i * 0.15, 3.05 + i * 0.15) * (2.2 + 0.3 * Math.sin(tt * 9 + i))), 1]}><sphereGeometry args={[0.026, 16, 12]} />{M.glow({ col: "#3a7aff", op: 0.6 })}</mesh>
      <mesh position={[0, 0.035, 0]} scale={[1, Math.max(0.001, eio(tt, 2.8 + i * 0.15, 3.05 + i * 0.15) * 1.8), 1]}><sphereGeometry args={[0.013, 12, 10]} />{M.glow({ col: "#cfe4ff", op: 0.9 })}</mesh>
    </group>)}
    <pointLight position={[0, 0.22, 0.2]} intensity={0.9 * flame} distance={0.5} color="#4a8aff" />
  </group>;
}}</Scene3D>;
