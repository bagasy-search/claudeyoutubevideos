// lhh29c · componentes únicos 25-32: el petirrojo que muerde cada frutilla, las tiras que brillan al sol, el embudo de aluminio,
// el horno a 350 por 10 minutos, el salón que se pinta en un fin de semana, el pincel sin aire, la grasa que se junta y el gato Pastor.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Foil, FoilBall, FoilSheet, SERIF } from "./foilkit";

const PI = Math.PI;
const berryTex = () => tex.text("berry", 256, 256, (g) => {
  g.fillStyle = "#c8202a"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 140; i++) { g.fillStyle = "#f2d36a"; g.beginPath(); g.ellipse((i * 37) % 256, ((i * 71) % 256), 2.4, 3.6, 0, 0, 6.3); g.fill(); }
});
const Berry: React.FC<{ p: number[]; bite: number; s?: number }> = ({ p, bite, s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <mesh position={[0, 0.022, 0]} rotation={[PI, 0, 0]} scale={[1, 1.25, 1]} castShadow><sphereGeometry args={[0.02, 32, 24]} /><meshPhysicalMaterial map={berryTex()} roughness={0.3} clearcoat={0.8} /></mesh>
  {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[Math.cos(i * 1.25) * 0.01, 0.046, Math.sin(i * 1.25) * 0.01]} rotation={[Math.sin(i * 1.25) * 0.9, 0, -Math.cos(i * 1.25) * 0.9]} scale={[0.4, 0.05, 1]}><sphereGeometry args={[0.012, 10, 6]} /><meshStandardMaterial color="#3f8a2a" roughness={0.6} /></mesh>)}
  {bite > 0 && <mesh position={[0.014, 0.026, 0.01]} scale={bite}><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#f6c8c0" roughness={0.6} /></mesh>}
</group>;
const Robin: React.FC<{ p: number[]; rot?: number; hop?: number; flap?: number }> = ({ p, rot = 0, hop = 0, flap = 0 }) => <group position={[p[0], p[1] + hop, p[2]]} rotation={[0, rot, 0]}>
  <mesh position={[0, 0.04, 0]} scale={[1.4, 1, 1]} castShadow><sphereGeometry args={[0.03, 24, 16]} /><meshStandardMaterial color="#5a4a3e" roughness={0.8} /></mesh>
  <mesh position={[0.018, 0.034, 0]} scale={[0.9, 0.9, 0.85]}><sphereGeometry args={[0.026, 24, 16]} /><meshStandardMaterial color="#d8642a" roughness={0.8} /></mesh>
  <mesh position={[0.04, 0.066, 0]}><sphereGeometry args={[0.018, 20, 14]} /><meshStandardMaterial color="#3a302a" roughness={0.7} /></mesh>
  <mesh position={[0.061, 0.064, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.004, 0.016, 8]} /><meshStandardMaterial color="#e8b43a" /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[0.05, 0.072, k * 0.012]}><sphereGeometry args={[0.003, 8, 6]} /><meshStandardMaterial color="#000" /></mesh>)}
  <mesh position={[-0.05, 0.05, 0]} rotation={[0, 0, 0.4]} scale={[1, 0.2, 0.6]}><sphereGeometry args={[0.025, 12, 8]} /><meshStandardMaterial color="#3a302a" /></mesh>
  {[-1, 1].map((k) => <mesh key={"w" + k} position={[-0.005, 0.05, k * 0.03]} rotation={[k * (0.3 + flap), 0, 0.2]} scale={[1.2, 0.2, 0.7]}><sphereGeometry args={[0.022, 12, 8]} /><meshStandardMaterial color="#4a3e34" /></mesh>)}
  {[-1, 1].map((k) => <mesh key={"l" + k} position={[0, 0.008, k * 0.008]}><cylinderGeometry args={[0.0015, 0.0015, 0.02, 6]} /><meshStandardMaterial color="#c8a070" /></mesh>)}
</group>;

// ---- 11:49 · UN MORDISCO EN CADA FRUTILLA: la fila de frutillas maduras; el petirrojo salta de una a otra y les deja un solo mordisco a todas ----
export const HOneBite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#a9cfe8"
  cam={{ at: [0.03, 0.07, 0], az: [-0.4, -0.22], el: [0.25, 0.2], r: [0.62, 0.54], fov: 30 }}
  over={(tt) => { const n = Math.min(6, Math.max(0, Math.floor((tt - 0.8) / 0.75) + 1));
    return <><Head tt={tt} kick="" title="ONE BITE · EVERY BERRY" col={RED} />
      {n < 0 && null}</>; }}>{(tt) => {
  const st = Math.min(5, Math.max(0, (tt - 0.8) / 0.75)), i0 = Math.floor(st), f = st - i0;
  const x = -0.25 + (i0 + eio(f, 0.55, 1.0)) * 0.1, hop = Math.sin(cl((f - 0.55) / 0.45) * PI) * 0.04;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4, 4]} /><meshStandardMaterial color="#6a4a2e" roughness={1} /></mesh>
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-0.4 + rn(i, 2) * 0.8, 0.012, -0.12 - rn(i, 3) * 0.2]} rotation={[-PI / 2 + 0.3, 0, rn(i, 4) * 6]} scale={[1, 1.4, 1]}><circleGeometry args={[0.03, 12]} /><meshStandardMaterial color="#3f8a2a" roughness={0.6} side={THREE.DoubleSide} /></mesh>)}
    {Array.from({ length: 6 }, (_, i) => <Berry key={i} p={[-0.25 + i * 0.1, 0, 0.04]} s={1.35} bite={cl((tt - 0.8 - i * 0.75 - 0.3) * 4)} />)}
    <Robin p={[x - 0.04, 0, -0.03]} rot={0.3} hop={hop} />
  </>;
}}</Scene3D>;

// ---- 12:07 · BRILLAN AL SOL: las estacas con tiras de aluminio que flamean; cada destello asusta al petirrojo, que se va volando ----
export const HFlash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#9cc8e6" key1={[1.5, 2.2, 1.2]}
  cam={{ at: [0, 0.18, 0], az: [0.4, 0.15], el: [0.18, 0.14], r: [0.7, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="FLASH IN THE SUN" col={AMB} />
    <Tag tt={tt} at={3.6} x={1460} y={830} txt="ROBINS · GONE" col={GRN} size={44} /></>}>{(tt) => {
  const fly = eio(tt, 2.4, 4.4), flap = Math.sin(tt * 30) * 0.6 * cl((tt - 2.3) * 4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 4]} /><meshStandardMaterial color="#5f8a3a" roughness={1} /></mesh>
    {[-0.36, -0.12, 0.12, 0.36].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.006, 0.007, 0.34, 8]} />{M.wood({ base: [150, 110, 70] })}</mesh>
      {[0, 1].map((j) => { const sw = Math.sin(tt * (5 + i + j) + i * 2 + j) * 0.7;
        return <group key={j} position={[0, 0.33, 0]} rotation={[sw, j * 1.2 + i, 0.15 * Math.sin(tt * 7 + j)]}>
          <mesh position={[0, -0.09, 0]}><planeGeometry args={[0.03, 0.18]} /><Foil /></mesh></group>; })}
      {Math.sin(tt * 4 + i * 1.7) > 0.85 && <mesh position={[0.02, 0.27, 0.03]}><sphereGeometry args={[0.012, 12, 8]} />{M.glow({ col: "#fff6e0", op: 0.25 })}</mesh>}
    </group>)}
    <pointLight position={[0, 0.3, 0.2]} intensity={0.5 + Math.max(0, Math.sin(tt * 4)) * 0.5} distance={1} color="#fff6e0" />
    <group position={[0.05 + fly * 0.5, 0.02 + fly * 0.45, 0.16 - fly * 0.3]} scale={2.2}><Robin p={[0, 0, 0]} rot={-0.6} flap={flap} /></group>
  </>;
}}</Scene3D>;

// ---- 12:54 · UN EMBUDO DE UN CUADRADO: el cuadrado se dobla al medio, se enrolla en cono y por la punta pasa el arroz al frasco ----
export const HCone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.12, 0], az: [-0.25, 0.2], el: [0.25, 0.2], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="A FUNNEL IN A PINCH" col={GRN} />
    <Tag tt={tt} at={0.4} x={1460} y={820} txt={tt < 1.6 ? "FOLD IT DOUBLE" : tt < 3 ? "ROLL A CONE" : "NOTHING TO WASH"} col={AMB} size={40} /></>}>{(tt) => {
  const fold = eio(tt, 0.3, 1.3), roll = eio(tt, 1.6, 2.8), pour = cl((tt - 3.2) / 3.2);
  return <>
    {/* el frasco que espera */}
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.045, 0.045, 0.14, 40, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
    <mesh position={[0, 0.003 + 0.05 * pour, 0]} scale={[1, Math.max(0.01, pour), 1]}><cylinderGeometry args={[0.043, 0.043, 0.1, 40]} /><meshStandardMaterial color="#f4efe2" roughness={0.9} bumpMap={tex.paper(4, 4)} bumpScale={3} /></mesh>
    {roll < 0.02 ? <group position={[0, 0.2, 0]}>
      <FoilSheet w={0.2} d={0.1} p={[0, 0, -0.05]} crumple={0.05} />
      <group rotation={[-PI * fold, 0, 0]}><FoilSheet w={0.2} d={0.1} p={[0, 0, 0.05]} crumple={0.05} /></group></group>
      : <mesh position={[0, 0.2, 0]} rotation={[PI, 0, 0]} scale={[roll, 1, roll]}><coneGeometry args={[0.07, 0.12, 48, 1, true]} /><Foil /></mesh>}
    {pour > 0 && Array.from({ length: 30 }, (_, i) => { const ph = ((tt * 1.4 + i / 30) % 1);
      return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.006, lerp(0.16, 0.02 + 0.1 * pour, ph), (rn(i, 3) - 0.5) * 0.006]} rotation={[i, i, 0]}><boxGeometry args={[0.002, 0.005, 0.002]} /><meshStandardMaterial color="#f6f1e2" /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 14:01 · 350 GRADOS, 10 MINUTOS: la perilla del horno gira a 350, el reloj de cocina barre diez minutos y el paquete de pancitos larga vapor ----
const knobTex = () => tex.text("knob350", 512, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill(); g.fillStyle = "#2a221a"; g.font = "bold 40px " + SERIF; g.textAlign = "center"; g.textBaseline = "middle";
  [["OFF", 0], ["200", 1], ["250", 2], ["300", 3], ["350", 4], ["400", 5], ["450", 6], ["BROIL", 7]].forEach(([s, i]) => { const a = -PI / 2 + (Number(i) / 8) * PI * 2;
    g.fillStyle = s === "350" ? "#b8322a" : "#2a221a"; g.fillText(String(s), 256 + Math.cos(a) * 200, 256 + Math.sin(a) * 200); });
});
export const HOven350: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0.02, 0.17, 0], az: [-0.05, 0.08], el: [0.1, 0.08], r: [0.72, 0.62], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="350° · 10 MINUTES" col={AMB} />
    </>}>{(tt) => {
  const kn = eio(tt, 0.4, 1.4) * (4 / 8) * PI * 2, sweep = eio(tt, 1.6, 4.6), steam = cl((tt - 3.0) / 1.5);
  return <>
    <RBox s={[0.9, 0.5, 0.04]} p={[0, 0.2, -0.1]} r={0.02}>{M.porcelain({ col: "#ece6d6" })}</RBox>
    {/* perilla */}
    <group position={[-0.06, 0.18, -0.07]} rotation={[PI / 2, 0, 0]} scale={1.25}>
      <mesh><cylinderGeometry args={[0.11, 0.11, 0.01, 64]} /><meshStandardMaterial map={knobTex()} roughness={0.5} /></mesh>
      <group rotation={[0, -kn, 0]}><mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.055, 0.06, 0.035, 40]} />{M.chrome({})}</mesh>
        <mesh position={[0, 0.038, -0.03]}><boxGeometry args={[0.008, 0.004, 0.05]} /><meshStandardMaterial color="#b8322a" /></mesh></group>
    </group>
    {/* reloj de cocina: diez minutos que se barren */}
    <group position={[0.14, 0.24, -0.05]} rotation={[PI / 2, 0, 0]} scale={0.7}>
      <mesh><cylinderGeometry args={[0.08, 0.08, 0.04, 48]} />{M.plastic({ col: "#e9e2cf" })}</mesh>
      <mesh position={[0, 0.021, 0]} rotation={[-PI / 2, 0, PI / 2]}><circleGeometry args={[0.07, 48, 0, PI * 2 * (10 / 60) * (1 - sweep)]} /><meshStandardMaterial color="#d9473a" /></mesh>
    </group>
    {/* paquete de pancitos envuelto */}
    <group position={[0.14, 0.07, 0.05]} scale={0.8}>
      <mesh scale={[1.6, 0.6, 1]}><sphereGeometry args={[0.06, 24, 16]} /><Foil /></mesh>
      {steam > 0 && [0, 1, 2].map((k) => <mesh key={k} position={[-0.04 + k * 0.04, 0.06 + ((tt * 0.12 + k * 0.3) % 0.15), 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.012, 12, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * steam} depthWrite={false} /></mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 14:30 · AMARILLO PÁLIDO EN UN FIN DE SEMANA: la pared del salón con sus ventanas; el amarillo la cubre de punta a punta mientras el almanaque pasa de sábado a domingo ----
export const HPaintWeekend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0.05, 0.16, 0], az: [-0.2, 0.05], el: [0.16, 0.12], r: [1.1, 0.95], fov: 32 }}
  over={(tt) => <><Head tt={tt} kick="" title="ONE WEEKEND · 1997" col={AMB} />
    <Tag tt={tt} at={0.6} x={1500} y={820} txt={tt < 3 ? "SATURDAY" : "SUNDAY"} col={AMB} size={46} /></>}>{(tt) => {
  const p = eio(tt, 0.6, 5.2), x = lerp(-0.5, 0.3, p);
  return <>
    <RBox s={[1.1, 0.4, 0.02]} p={[0, 0.2, -0.1]} r={0.004}><meshStandardMaterial color="#cfc8ba" roughness={0.9} /></RBox>
    <mesh position={[(x - 0.55) / 2, 0.2, -0.089]}><planeGeometry args={[Math.max(0.001, x + 0.55), 0.4]} /><meshStandardMaterial color="#f3e2a0" roughness={0.85} /></mesh>
    {[-0.35, 0, 0.35].map((wx, i) => <group key={i} position={[wx, 0.22, -0.086]}>
      <mesh><planeGeometry args={[0.16, 0.2]} /><meshStandardMaterial color="#bcd8ec" emissive="#bcd8ec" emissiveIntensity={0.5} /></mesh>
      {[[0, 0.1, 0.18, 0.012], [0, -0.1, 0.18, 0.012], [0.085, 0, 0.012, 0.21], [-0.085, 0, 0.012, 0.21], [0, 0, 0.16, 0.008], [0, 0, 0.008, 0.2]].map(([a, b, w, hh], j) =>
        <mesh key={j} position={[a, b, 0.002]}><planeGeometry args={[w, hh]} /><meshStandardMaterial color="#f7f4ec" /></mesh>)}</group>)}
    {/* el tarro de pintura al pie, tapado con foil arrugado hasta el domingo */}
    <group position={[0.42, 0, 0.18]}>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.12, 40]} />{M.steel({ col: "#c9ccd0" })}</mesh>
      <mesh position={[0, 0.07, 0.071]}><planeGeometry args={[0.1, 0.06]} /><meshStandardMaterial color="#f3e2a0" roughness={0.6} /></mesh>
      <mesh position={[0, 0.123, 0]} scale={[1, 0.25 + 0.15 * eio(tt, 2.6, 3.4), 1]}><sphereGeometry args={[0.078, 32, 16, 0, PI * 2, 0, PI / 2]} /><Foil /></mesh>
    </group>
    {/* el rodillo que avanza */}
    {p > 0 && p < 1 && <mesh position={[x - 0.035, 0.2, -0.0885]}><planeGeometry args={[0.07, 0.4]} /><meshPhysicalMaterial color="#f7e07a" roughness={0.2} clearcoat={1} clearcoatRoughness={0.15} /></mesh>}
    <group position={[x, 0.2 + 0.11 * Math.sin(tt * 4), -0.06]} rotation={[0, 0, PI / 2]} scale={2.2}>
      <mesh rotation={[0, tt * 3, 0]}><cylinderGeometry args={[0.022, 0.022, 0.12, 24]} /><meshStandardMaterial color="#f0d878" roughness={0.95} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[0, k * 0.062, 0]}><cylinderGeometry args={[0.024, 0.024, 0.004, 24]} />{M.steel({ col: "#9aa1a7" })}</mesh>)}
      <mesh position={[0.0, -0.08, 0.04]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />{M.chrome({})}</mesh>
      <mesh position={[0, -0.16, 0.09]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.08, 12]} />{M.wood({ base: [150, 100, 60] })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- 14:45 · QUE NO ENTRE AIRE: el pincel con pintura amarilla; el aluminio lo abraza y las burbujitas de aire rebotan contra el envoltorio ----
export const HNoAir: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0, 0.05, 0], az: [0.4, 0.2], el: [0.3, 0.24], r: [0.4, 0.34], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NO AIR GETS IN" col={ICE} />
    </>}>{(tt) => {
  const wrap = eio(tt, 0.6, 2.2), wet = eio(tt, 4.4, 5.0), dr = cl((tt - 4.9) / 1.0);
  return <><group position={[0, 0.04, 0]} rotation={[0, 0, PI / 2]}>
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.012, 0.016, 0.2, 20]} />{M.wood({ base: [190, 130, 70] })}</mesh>
    <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.024, 0.02, 0.04, 24]} />{M.chrome({})}</mesh>
    <mesh position={[0, 0.04, 0]} scale={[1, 1, 0.45]}><cylinderGeometry args={[0.02, 0.026, 0.07, 24]} /><meshPhysicalMaterial color="#f0d26a" roughness={0.35 - 0.3 * wet} clearcoat={wet} clearcoatRoughness={0.1} /></mesh>
    {wrap > 0 && <mesh position={[0, 0.03, 0]} scale={[1 + 2 * (1 - wrap), wrap, 0.6 + 1.6 * (1 - wrap)]}><cylinderGeometry args={[0.03, 0.03, 0.1, 32]} /><Foil op={cl(wrap * 2)} /></mesh>}
    {Array.from({ length: 16 }, (_, i) => { const ph = ((tt * 0.6 + rn(i, 2)) % 1), a = rn(i, 3) * PI * 2, r = 0.12 - 0.075 * Math.sin(ph * PI);
      return <mesh key={i} position={[Math.cos(a) * r, 0.03 + (rn(i, 4) - 0.5) * 0.08, Math.sin(a) * r]} scale={Math.max(0.001, 1 - wet)}><sphereGeometry args={[0.005, 10, 8]} />{M.glass({ op: 0.7, col: "#bfe6ff" })}</mesh>; })}
  </group>
    {/* la gota amarilla que todavía cae: sigue fresca */}
    <mesh position={[-0.075, 0.045 - 0.04 * dr * dr, 0]} scale={[1, 1 + 0.6 * Math.sin(dr * PI), 1]}><sphereGeometry args={[0.006 * wet, 14, 10]} /><meshPhysicalMaterial color="#f0d26a" roughness={0.1} clearcoat={1} /></mesh>
    <mesh position={[-0.075, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.001 + 0.012 * cl((dr - 0.95) * 20), 20]} /><meshPhysicalMaterial color="#f0d26a" roughness={0.1} clearcoat={1} /></mesh></>;
}}</Scene3D>;

// ---- 15:39 · SÓLO EL FONDO: corte de la asadera; si se tapa la rejilla la grasa se junta bajo la costeleta y prende; forrando sólo el fondo, gotea y queda limpia ----
export const HPooling: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [0.0, 0.15], el: [0.42, 0.36], r: [0.55, 0.47], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LINE THE BOTTOM ONLY" col={AMB} />
    <Tag tt={tt} at={0.8} x={480} y={850} txt={tt < 3.2 ? "TOP COVERED · FIRE" : "BOTTOM LINED"} col={tt < 3.2 ? RED : GRN} size={40} anchor="l" /></>}>{(tt) => {
  const sw = eio(tt, 3.0, 3.8), pool = cl((tt - 0.3) / 2.4) * (1 - sw), fire = pool > 0.85 ? (pool - 0.85) * 6.6 : 0;
  return <>
    <RBox s={[0.42, 0.006, 0.26]} p={[0, 0.003, 0]} r={0.002}>{M.steel({ col: "#7d848a" })}</RBox>
    {[[0, 0.025, 0.13, 0.42, 0.006], [0, 0.025, -0.13, 0.42, 0.006], [0.21, 0.025, 0, 0.006, 0.26], [-0.21, 0.025, 0, 0.006, 0.26]].map(([x, y, z, w, d], i) =>
      <RBox key={i} s={[w, 0.05, d]} p={[x, y, z]} r={0.002}>{M.steel({ col: "#7d848a" })}</RBox>)}
    {/* rejilla ranurada */}
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.03, 0.004, 0.24]} p={[-0.18 + i * 0.045, 0.052, 0]} r={0.001}>{M.steel({ col: "#9aa1a7" })}</RBox>)}
    <FoilSheet w={0.4} d={0.24} p={[0, lerp(0.056, 0.008, sw), 0]} crumple={0.06} />
    {/* costeleta */}
    <mesh position={[0, 0.068, 0]} scale={[1.4, 0.25, 1]}><sphereGeometry args={[0.06, 32, 16]} /><meshPhysicalMaterial color="#c88a64" roughness={0.5} clearcoat={0.4} /></mesh>
    {pool > 0 && <mesh position={[0, 0.0585, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 1, 1]}><circleGeometry args={[0.04 + 0.075 * pool, 32]} />{M.grease({ col: "#d9a640", op: 0.95 })}</mesh>}
    <pointLight position={[0, 0.12, 0.05]} color="#ff7a2a" intensity={0.6 * cl(fire)} distance={0.6} />
    {fire > 0 && Array.from({ length: 7 }, (_, i) => { const fl = 1 + 0.25 * Math.sin(tt * 2 * PI * 1.6 + i * 1.3), x = -0.1 + i * 0.033;
      return <group key={i} position={[x, 0.062, 0.03 + 0.02 * Math.sin(i * 2)]} scale={[cl(fire), cl(fire) * fl, cl(fire)]}>
        <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.02, 0.07, 16]} />{M.glow({ col: "#ff5a1a", op: 0.55 })}</mesh>
        <mesh position={[0, 0.024, 0]}><coneGeometry args={[0.013, 0.05, 16]} />{M.glow({ col: "#ffb43a", op: 0.7 })}</mesh>
        <mesh position={[0, 0.016, 0]}><coneGeometry args={[0.007, 0.03, 12]} />{M.glow({ col: "#fff0b0", op: 0.85 })}</mesh></group>; })}
    {sw > 0.9 && Array.from({ length: 6 }, (_, i) => { const ph = ((tt - 3.8) * 0.9 + i / 6) % 1;
      return <mesh key={i} position={[-0.1 + i * 0.04, lerp(0.05, 0.012, ph), 0.0]} scale={[0.7, 1.3, 0.7]}><sphereGeometry args={[0.004, 10, 8]} />{M.grease({ col: "#e3c060" })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 16:10 · UN GATO NARANJA LLAMADO PASTOR: el atigrado sentado en la mesada, la cola que va y viene y la chapita de bronce que dice PASTOR ----
const tabby = () => tex.text("tabby", 256, 256, (g) => {
  g.fillStyle = "#e08a3a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 12; i++) { g.fillStyle = "rgba(160,80,20,.55)"; g.fillRect(0, i * 22, 256, 9); }
});
export const HPastorTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.4]}
  cam={{ at: [0, 0.13, 0], az: [-0.4, -0.15], el: [0.2, 0.16], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HIS NAME IS PASTOR" col={AMB} />
    </>}>{(tt) => {
  const fur = <meshStandardMaterial map={tabby()} roughness={0.9} />, tail = Math.sin(tt * 2.2) * 0.5, tg = phys(tt, 1.2, 6, 0.3);
  return <><group position={[0, 0, 0]} rotation={[0, -1.75, 0]}>
    <mesh position={[0, 0.07, 0]} scale={[1, 1.2, 0.9]} castShadow><sphereGeometry args={[0.065, 32, 24]} />{fur}</mesh>
    <mesh position={[0.02, 0.17, 0]} castShadow><sphereGeometry args={[0.045, 32, 24]} />{fur}</mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0.02, 0.21, k * 0.026]} rotation={[k * 0.3, 0, 0]}><coneGeometry args={[0.014, 0.03, 4]} />{fur}</mesh>)}
    {[-1, 1].map((k) => <mesh key={"e" + k} position={[0.06, 0.18, k * 0.017]}><sphereGeometry args={[0.007, 12, 8]} /><meshPhysicalMaterial color="#9ab83a" clearcoat={1} roughness={0.1} /></mesh>)}
    <mesh position={[0.064, 0.165, 0]}><sphereGeometry args={[0.004, 8, 6]} /><meshStandardMaterial color="#d8787a" /></mesh>
    {[-1].map((k) => <mesh key={"p" + k} position={[0.04, 0.012, k * 0.025]} scale={[1.5, 0.6, 1]}><sphereGeometry args={[0.014, 12, 8]} />{fur}</mesh>)}
    {(() => { const sw = Math.sin(PI * cl((tt - 2.9) / 0.7)) + Math.sin(PI * cl((tt - 4.0) / 0.7)); return <group position={[0.04 + 0.035 * sw, 0.07 + 0.06 * sw, 0.025]} rotation={[0, 0, -1.1 * sw]}>
      <mesh position={[0, -0.03, 0]}><capsuleGeometry args={[0.012, 0.04, 6, 12]} />{fur}</mesh>
      <mesh position={[0.004, -0.058, 0]} scale={[1.5, 0.7, 1]}><sphereGeometry args={[0.014, 12, 8]} />{fur}</mesh></group>; })()}
    <group position={[-0.06, 0.02, 0]} rotation={[0, tail, 0.3]}><mesh position={[-0.06, 0.02, 0]} rotation={[0, 0, PI / 2 - 0.4]}><cylinderGeometry args={[0.009, 0.012, 0.13, 10]} />{fur}</mesh></group>
    {/* collar y chapita */}
    <mesh position={[0.02, 0.13, 0]} rotation={[0, 0, 0.15]}><torusGeometry args={[0.036, 0.004, 8, 32]} /><meshStandardMaterial color="#2f5fae" roughness={0.5} /></mesh>
    <group position={[0.058, 0.12, 0]} rotation={[Math.sin(tt * 3) * 0.2, 0, -PI / 2]} scale={cl(tg) * 1.4}>
      <mesh><cylinderGeometry args={[0.014, 0.014, 0.002, 24]} />{M.brass({})}</mesh>
      <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.013, 24]} /><meshStandardMaterial map={tex.text("pastor", 256, 256, (g) => { g.fillStyle = "#d9a84a"; g.beginPath(); g.arc(128, 128, 126, 0, 6.3); g.fill(); g.fillStyle = "#3a2410"; g.font = "bold 50px " + SERIF; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("PASTOR", 128, 130); })} metalness={0.6} roughness={0.35} /></mesh></group>
  </group>
    {[0, 1, 2].map((k) => { const m = eio(tt, 0.8 + k * 0.9, 2.6 + k * 0.9), x = lerp(-0.34, 0.1 + k * 0.06, m) + (k === 0 ? 0.3 * eio(tt, 3.2, 4.4) : k === 1 ? 0.25 * eio(tt, 4.3, 5.4) : 0);
      return <FoilBall key={k} r={0.016} seed={60 + k} p={[x, 0.016, 0.09 - k * 0.05]} rot={[0, 0, -(x + 0.34) / 0.016]} />; })}
  </>;
}}</Scene3D>;
