// lhh29c · componentes únicos 33-41: la pata del gato y el crujido, la honda de aluminio de las barras de limón, la semana de Acción de Gracias,
// el termómetro 40 grados de más, la carpa como techo de granero, la carrera pechuga-patas, el pinche a 165 sin tocar el hueso, el reposo y la sal que viene.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Foil, FoilBall, FoilSheet, Pie, Shears, Spoon, Turkey, SERIF } from "./foilkit";

const PI = Math.PI;

// ---- 16:25 · EL CRUJIDO QUE NO LES GUSTA: el aluminio en la mesada; baja la pata naranja, toca, salen ondas del crujido y la pata se va de un salto ----
export const HCrinkle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0.02, 0.08, 0.02], az: [0.45, 0.3], el: [0.34, 0.3], r: [0.6, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="PAWS HATE THE CRINKLE" col={ICE} />
    </>}>{(tt) => {
  const step = (a: number) => { const d = eio(tt, a, a + 0.5), u = eio(tt, a + 0.6, a + 0.75); return d * (1 - u); };
  const p1 = step(0.6), p2 = step(2.0), p3 = step(3.4), p4 = step(4.8), paw = Math.max(p1, p2, p3, p4), y = lerp(0.13, 0.025, paw);
  const rings = [0.6 + 0.5, 2.0 + 0.5, 3.4 + 0.5, 4.8 + 0.5];
  return <>
    <FoilSheet w={0.5} d={0.34} p={[0, 0.002, 0]} crumple={0.1 + 0.05 * (eio(tt, 0.9, 1.1) + eio(tt, 2.3, 2.5) + eio(tt, 3.7, 3.9) + eio(tt, 5.1, 5.3))} />
    <group position={[0.02, y, 0.02]} rotation={[0.2, 0, -0.3]}>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.02, 0.028, 0.3, 24]} /><meshStandardMaterial color="#d08a4a" roughness={1} bumpMap={tex.paper(2, 10)} bumpScale={14} /></mesh>
      {[0.06, 0.12, 0.18, 0.24].map((yy, k) => <mesh key={"s" + k} position={[0, yy, 0]} rotation={[0, k, 0.15]}><torusGeometry args={[0.025, 0.004, 8, 24, PI * 1.2]} /><meshStandardMaterial color="#8a4a1e" roughness={1} /></mesh>)}
      <mesh scale={[1.2, 0.72, 1.1]}><sphereGeometry args={[0.034, 32, 20]} /><meshStandardMaterial color="#d08a4a" roughness={1} bumpMap={tex.paper(3, 3)} bumpScale={12} /></mesh>
      {[-1.5, -0.5, 0.5, 1.5].map((k) => <mesh key={k} position={[0.032, -0.006, k * 0.012]} scale={[1, 0.8, 0.9]}><sphereGeometry args={[0.011, 14, 10]} /><meshStandardMaterial color="#d08a4a" roughness={1} bumpMap={tex.paper(2, 2)} bumpScale={10} /></mesh>)}
      {[-1.5, -0.5, 0.5, 1.5].map((k) => <mesh key={"b" + k} position={[0.034, -0.016, k * 0.012]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.006, 12, 8]} /><meshPhysicalMaterial color="#e89a9a" roughness={0.4} clearcoat={0.5} /></mesh>)}</group>
    {rings.map((a, j) => { const k = cl((tt - a) / 0.9); if (k <= 0 || k >= 1) return null;
      return [0, 1, 2].map((i) => { const kk = cl(k * 1.4 - i * 0.2); return kk > 0 && <mesh key={j * 3 + i} position={[0.02, 0.006, 0.02]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04 + 0.2 * kk, 0.046 + 0.2 * kk, 48]} />{M.glow({ col: "#ffffff", op: 0.35 * (1 - kk) })}</mesh>; }); })}
  </>;
}}</Scene3D>;

// ---- 17:16 · LA HONDA DE ALUMINIO: dos tiras cruzadas en la fuente con las puntas afuera; entran las barras de limón, salen enteras por las manijas y se cortan en cuadrados ----
export const HCrossStrips: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [0.5, 0.3], el: [0.6, 0.48], r: [0.68, 0.58], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE FOIL SLING" col={AMB} />
    <Tag tt={tt} at={0.4} x={1460} y={820} txt={tt < 3.2 ? "TWO STRIPS · CROSSED" : tt < 5.4 ? "LIFT WHEN COOL" : "PERFECT SQUARES"} col={tt < 5.4 ? AMB : GRN} size={40} /></>}>{(tt) => {
  const s1 = eio(tt, 0.3, 1.0), s2 = eio(tt, 0.9, 1.6), bars = phys(tt, 1.9, 6, 0.5), lift = eio(tt, 3.4, 4.6), cut = eio(tt, 5.0, 6.4);
  const ly = 0.16 * lift;
  return <>
    {/* fuente cuadrada */}
    <RBox s={[0.26, 0.004, 0.26]} p={[0, 0.002, 0]} r={0.002}>{M.steel({})}</RBox>
    {[[0, 0.025, 0.13, 0.26, 0.004], [0, 0.025, -0.13, 0.26, 0.004], [0.13, 0.025, 0, 0.004, 0.26], [-0.13, 0.025, 0, 0.004, 0.26]].map(([x, y, z, w, d], i) =>
      <RBox key={i} s={[w, 0.05, d]} p={[x, y, z]} r={0.002}>{M.steel({})}</RBox>)}
    <group position={[0, ly, 0]}>
      {s1 > 0 && <><RBox s={[0.25 * s1, 0.001, 0.08]} p={[0, 0.005, 0]} r={0.0004}><Foil /></RBox>
        {[-1, 1].map((k) => <RBox key={k} s={[0.004, 0.06, 0.08]} p={[k * 0.132, 0.035, 0]} r={0.0004}><Foil /></RBox>)}</>}
      {s2 > 0 && <><RBox s={[0.08, 0.001, 0.25 * s2]} p={[0, 0.006, 0]} r={0.0004}><Foil /></RBox>
        {[-1, 1].map((k) => <RBox key={k} s={[0.08, 0.06, 0.004]} p={[0, 0.035, k * 0.132]} r={0.0004}><Foil /></RBox>)}</>}
      {bars > 0 && <group scale={[1, cl(bars), 1]}>
        <RBox s={[0.25, 0.012, 0.25]} p={[0, 0.013, 0]} r={0.003}><meshStandardMaterial color="#d9a65a" roughness={0.8} /></RBox>
        <RBox s={[0.25, 0.018, 0.25]} p={[0, 0.028, 0]} r={0.003}><meshPhysicalMaterial color="#f3d64a" roughness={0.4} clearcoat={0.5} /></RBox>
        <mesh position={[0, 0.0375, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.245, 0.245]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.55} roughness={1} bumpMap={tex.paper(4, 4)} bumpScale={4} /></mesh></group>}
      {cut > 0 && [-1, 1].map((k) => <group key={k}>
        <mesh position={[k * 0.042, 0.039, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, cut, 1]}><planeGeometry args={[0.003, 0.25]} /><meshBasicMaterial color="#6a4a1a" /></mesh>
        <mesh position={[0, 0.039, k * 0.042]} rotation={[-PI / 2, 0, PI / 2]} scale={[1, cut, 1]}><planeGeometry args={[0.003, 0.25]} /><meshBasicMaterial color="#6a4a1a" /></mesh></group>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 18:02 · LA SEMANA DE ACCIÓN DE GRACIAS: cinco tarjetas de lunes a viernes se levantan en fila, cada una con su trabajo: tijera, plata, tarta, pavo y el aluminio doblado ----
const dayCard = (d: string) => tex.text("day" + d, 320, 420, (g) => {
  g.fillStyle = "#fbf6e8"; g.fillRect(0, 0, 320, 420); g.fillStyle = "#b8322a"; g.fillRect(0, 0, 320, 90);
  g.fillStyle = "#fff"; g.font = "bold 56px " + SERIF; g.textAlign = "center"; g.fillText(d, 160, 66);
});
export const HWeekFoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.6, 0.4]}
  cam={{ at: [0.02, 0.12, 0.04], az: [-0.15, 0.15], el: [0.24, 0.2], r: [1.25, 1.12], fov: 32 }}
  over={(tt) => <><Head tt={tt} kick="" title="THANKSGIVING WEEK" col={AMB} /></>}>{(tt) => <>
    {["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => { const up = phys(tt, 0.4 + i * 1.3, 6, 0.5), x = -0.4 + i * 0.2;
      return <group key={d} position={[x, 0, 0]}>
        <group rotation={[-PI / 2 + (PI / 2 - 0.15) * cl(up), 0, 0]}>
          <RBox s={[0.16, 0.21, 0.004]} p={[0, 0.105, 0]} r={0.006}><meshStandardMaterial map={dayCard(d)} roughness={0.85} /></RBox></group>
        {(() => { const x2 = eio(tt, 0.4 + (i + 1) * 1.3, 0.8 + (i + 1) * 1.3) * (i < 4 ? 1 : 0); return x2 > 0 && <group rotation={[-0.15, 0, 0]}>
          <mesh position={[0, 0.105, 0.006]} rotation={[0, 0, 0.75]} scale={[x2, 1, 1]}><boxGeometry args={[0.24, 0.012, 0.002]} /><meshStandardMaterial color="#b8322a" roughness={0.7} /></mesh></group>; })()}
        {up > 0.6 && <group position={[0, 0.06, 0.08]} scale={1.6 * cl((up - 0.6) * 2.5)}>
          {i === 0 && <Shears p={[-0.05, 0.02, 0]} rot={[PI / 2 - 0.4, 0, 0.3]} s={0.45} open={0.3} />}
          {i === 1 && <Spoon p={[0, 0.02, 0]} rot={[PI / 2 - 0.3, 0, 0.4]} s={1.1} tarnish={1 - cl((tt - 2.3) / 1.2)} />}
          {i === 2 && <Pie p={[0, -0.02, 0]} s={0.45} edge={0.4} mid={0.9} />}
          {i === 3 && <Turkey p={[0, -0.03, 0]} s={0.5} rot={[0, -0.6, 0]} />}
          {i === 4 && [0, 1, 2].map((k) => <RBox key={k} s={[0.07, 0.004, 0.05]} p={[0, -0.02 + k * 0.005, 0]} r={0.001}><Foil /></RBox>)}
        </group>}</group>; })}
  </>}</Scene3D>;

// ---- 18:43 · 40 GRADOS DE MÁS: el termómetro de vidrio del horno; la columna roja pasa la marca de 325 y llega a 365, con la llave de +40 al costado ----
export const HFortyHot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0.2, 0.6, 0.3]}
  cam={{ at: [0.1, 0.22, 0], az: [0.12, -0.08], el: [0.12, 0.1], r: [0.95, 0.85], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="40 DEGREES HOT" col={RED} />
    <Tag tt={tt} at={3.2} x={1180} y={330} txt="+40°" col={RED} size={60} anchor="l" />
    </>}>{(tt) => {
  const lv = lerp(0.04, 0.3, eio(tt, 0.4, 1.8)) + 0.07 * eio(tt, 2.0, 3.0), br = eio(tt, 3.0, 3.8);
  return <>
    <RBox s={[0.12, 0.46, 0.012]} p={[0, 0.22, -0.02]} r={0.01}><meshStandardMaterial color="#f4efe2" roughness={0.6} /></RBox>
    {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.03, 0.04 + i * 0.022, -0.012]}><boxGeometry args={[i % 3 === 0 ? 0.03 : 0.016, 0.002, 0.002]} /><meshStandardMaterial color="#2a221a" /></mesh>)}
    <mesh position={[0, 0.3, -0.011]}><boxGeometry args={[0.11, 0.008, 0.003]} />{M.glow({ col: GRN })}</mesh>
    <mesh position={[-0.075, 0.3, -0.011]}><planeGeometry args={[0.07, 0.035]} /><meshStandardMaterial map={tex.text("t325", 256, 128, (g) => { g.fillStyle = "#1f6b3a"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#ffffff"; g.font = "bold 92px " + SERIF; g.textAlign = "center"; g.fillText("325", 128, 100); })} emissive="#2a9a55" emissiveIntensity={0.3} /></mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.024, 0.024, 0.36, 24, 1, true]} /><meshPhysicalMaterial color="#ffffff" roughness={0.02} clearcoat={1} transparent opacity={0.3} /></mesh>
    <mesh position={[0.012, 0.2, 0.02]}><boxGeometry args={[0.004, 0.32, 0.001]} />{M.glow({ col: "#ffffff", op: 0.5 })}</mesh>
    <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.036, 24, 16]} /><meshPhysicalMaterial color="#d22a20" roughness={0.2} clearcoat={1} /></mesh>
    <mesh position={[0, 0.03 + lv / 2, 0]}><cylinderGeometry args={[0.012, 0.012, lv, 16]} /><meshPhysicalMaterial color="#d22a20" roughness={0.2} clearcoat={1} emissive="#7a0a00" emissiveIntensity={0.4} /></mesh>
    {br > 0 && <group position={[0.08, 0.335, 0]} scale={[1, br, 1]}>
      <mesh><boxGeometry args={[0.003, 0.07, 0.003]} />{M.glow({ col: RED })}</mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[-0.01, k * 0.035, 0]}><boxGeometry args={[0.02, 0.003, 0.003]} />{M.glow({ col: RED })}</mesh>)}</group>}
    {(() => { const dry = eio(tt, 2.4, 4.6), ck = eio(tt, 3.4, 5.2); return <group position={[0.24, 0.05, 0.02]}>
      <mesh scale={[1.3, 0.7, 1]} castShadow><sphereGeometry args={[0.07, 40, 28]} /><meshPhysicalMaterial color={new THREE.Color("#d79a5c").lerp(new THREE.Color("#8a5a2c"), dry)} roughness={0.4 + 0.45 * dry} clearcoat={0.6 * (1 - dry)} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.1, 0.045 + rn(i, 3) * 0.004, (rn(i, 4) - 0.5) * 0.06 + 0.01]} rotation={[-0.3, rn(i, 5) * 3, 0]} scale={[Math.max(0.001, ck), 1, 1]}><boxGeometry args={[0.03 + 0.02 * rn(i, 6), 0.002, 0.0025]} /><meshStandardMaterial color="#3a2210" roughness={1} /></mesh>)}
    </group>; })()}
  </>;
}}</Scene3D>;

// ---- 19:17 · COMO EL TECHO DE UN GRANERO: la hoja se dobla a lo largo y se abre como una carpita de dos aguas; baja sobre la pechuga del pavo sin cerrarla ----
export const HBarnRoof: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0, 0.08, 0], az: [-0.55, -0.3], el: [0.3, 0.24], r: [0.58, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LIKE A BARN ROOF" col={AMB} />
    </>}>{(tt) => {
  const fold = eio(tt, 0.1, 0.9), open = eio(tt, 0.5, 1.6), low = eio(tt, 1.0, 4.6), ang = lerp(PI / 2 - 0.02, 0.75, open) * fold + 0.01 * (1 - fold);
  return <>
    <Turkey p={[0, 0, 0]} s={1.3} brown={0.7} rot={[0, PI / 2, 0]} />
    {/* la ventana de la cocina: se refleja en la carpa de aluminio */}
    <group position={[0.05, 0.36, -0.3]}>
      <mesh><planeGeometry args={[0.36, 0.26]} /><meshBasicMaterial color="#dcecf6" /></mesh>
      {[[0, 0, 0.012, 0.27], [0, 0, 0.37, 0.012], [0, 0.13, 0.38, 0.016], [0, -0.13, 0.38, 0.016], [0.18, 0, 0.016, 0.27], [-0.18, 0, 0.016, 0.27]].map(([a, b, w, hh], j) => <mesh key={j} position={[a, b, 0.002]}><planeGeometry args={[w, hh]} /><meshStandardMaterial color="#f2eee6" /></mesh>)}
    </group>
    <pointLight position={[0.05, 0.36, -0.2]} intensity={0.5} distance={1} color="#e6f2ff" />
    <group position={[0, lerp(0.34, 0.2, low), 0]}>
      {[-1, 1].map((k) => <group key={k} rotation={[k * (PI / 2 - ang) * (fold > 0 ? 1 : 0), 0, 0]}>
        <mesh position={[0, -0.06 * fold, k * 0.08 * (1 - fold) + k * 0.0]} rotation={[-PI / 2 + k * 0.0, 0, 0]}><planeGeometry args={[0.34, 0.16]} /><Foil /></mesh></group>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 19:31 · LAS PATAS ALCANZAN: dos barras de cocción, pechuga y patas; sin carpa la pechuga se adelanta; con la carpa se frena y llegan juntas ----
export const HCatchUp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" lamp={[0.1, 0.5, 0.35]}
  cam={{ at: [0.05, 0.18, 0], az: [0.12, 0.02], el: [0.2, 0.16], r: [0.95, 0.84], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE LEGS CATCH UP" col={GRN} />
    </>}>{(tt) => {
  // dos termómetros de dial: el de la pechuga corre, la carpa lo frena y el de la pata lo alcanza
  const tent = eio(tt, 1.4, 2.2), bT = cl(tt / 5.2), l = Math.min(1, bT);
  const bv = Math.min(1, lerp(Math.min(1, bT * 1.7), bT * 1.05, tent));
  const probe = (p: number[], v: number, lean: number) => { const ok = Math.abs(v - l) < 0.12 || v < l, a = PI * 0.75 - v * PI * 1.5;
    return <group position={p as [number, number, number]} rotation={[0, 0, lean]}>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 10]} />{M.chrome({})}</mesh>
      <group position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]}>
        <mesh><cylinderGeometry args={[0.042, 0.042, 0.016, 40]} />{M.chrome({})}</mesh>
        <mesh position={[0, 0.0085, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.037, 40]} /><meshStandardMaterial color="#f4efe2" roughness={0.6} /></mesh>
        <mesh position={[0, 0.009, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.036, 40, 1, PI * 1.75 - PI * 0.35, PI * 0.3]} /><meshStandardMaterial color="#4fb36a" /></mesh>
        <group position={[0, 0.0095, 0]} rotation={[-PI / 2, 0, 0]}><group rotation={[0, 0, a]}><mesh position={[0.015, 0, 0]}><boxGeometry args={[0.032, 0.003, 0.001]} /><meshStandardMaterial color={ok ? "#2a221a" : "#d22a20"} /></mesh></group></group>
      </group></group>; };
  return <>
    <Turkey p={[-0.03, 0, 0]} s={1.6} brown={0.4 + 0.5 * bT} rot={[0, -0.25, 0]} />
    {probe([-0.02, 0.27, 0.03], bv, 0.15)}
    {probe([0.2, 0.16, 0.13], l, -0.35)}
    {tent > 0 && <group position={[0.0, 0.245, 0]} scale={[tent, tent, tent]}>
      {[-1, 1].map((k) => <mesh key={k} position={[0, 0, k * 0.045]} rotation={[k * 0.95 - PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.11]} /><Foil /></mesh>)}</group>}
  </>;
}}</Scene3D>;

// ---- 19:47 · 165 SIN TOCAR EL HUESO: corte del muslo con el hueso adentro; el pinche entra, toca el hueso (lectura mentirosa), retrocede a la carne y marca 165 ----
export const HBone165: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [0.1, -0.1], el: [0.2, 0.16], r: [0.42, 0.35], fov: 30 }}
  over={(tt) => { const r = tt < 2.2 ? Math.round(lerp(70, 182, eio(tt, 1.0, 2.0))) : Math.round(lerp(182, 165, eio(tt, 2.4, 3.6)));
    return <><Head tt={tt} kick="" title="165° · NOT THE BONE" col={AMB} />
      <Tag tt={tt} at={1.0} x={1440} y={300} txt={`${r}°`} col={tt < 2.3 ? RED : GRN} size={64} />
      <Tag tt={tt} at={1.9} x={1440} y={830} txt={tt < 2.3 ? "ON THE BONE · WRONG" : "IN THE MEAT · RIGHT"} col={tt < 2.3 ? RED : GRN} size={38} /></>; }}>{(tt) => {
  const ins = eio(tt, 0.4, 1.6) - 0.45 * eio(tt, 2.3, 3.8), x = lerp(0.3, 0.05, ins);
  return <>
    {/* el muslo cortado al medio: cáscara dorada, carne y el hueso */}
    <mesh position={[0, 0.06, 0]} scale={[1.6, 1, 1]}><sphereGeometry args={[0.07, 48, 32, 0, PI]} /><meshPhysicalMaterial color="#b4692a" roughness={0.45} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.06, 0]} scale={[1.6, 1, 1]}><circleGeometry args={[0.068, 48]} /><meshStandardMaterial color="#efc6a8" roughness={0.6} /></mesh>
    <mesh position={[-0.02, 0.06, 0.002]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.012, 0.13, 8, 16]} /><meshStandardMaterial color="#f6efe2" roughness={0.5} /></mesh>
    {/* el pinche */}
    <group position={[x, 0.06, 0.006]}>
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0025, 0.0025, 0.2, 10]} />{M.chrome({})}</mesh>
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.04, 32]} />{M.chrome({})}</mesh>
      <mesh position={[0.243, 0, 0]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.026, 32]} /><meshStandardMaterial color="#f4efe2" /></mesh></group>
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.35 + i / 6) % 1; return <mesh key={"v" + i} position={[-0.06 + i * 0.024 + Math.sin(ph * 6 + i) * 0.008, 0.13 + ph * 0.14, 0.01]} scale={[1 + ph, 1.4 + ph, 1]}><sphereGeometry args={[0.014, 14, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16 * Math.sin(ph * PI)} depthWrite={false} /></mesh>; })}
    {tt > 1.3 && tt < 2.4 && <mesh position={[0.045, 0.06, 0.006]}><sphereGeometry args={[0.012, 16, 12]} />{M.glow({ col: RED, op: 0.6 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 20:21 · REPOSAR 30 MINUTOS: a la izquierda, cortado enseguida, el jugo se escapa a la tabla; a la derecha, reposado bajo el aluminio, la tabla queda seca ----
export const HRest30: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.05, 0], az: [0.0, 0.1], el: [0.42, 0.34], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="REST IT 30 MINUTES" col={GRN} />
    <Tag tt={tt} at={1.0} x={560} y={870} txt="CARVED RIGHT AWAY" col={RED} size={38} />
    <Tag tt={tt} at={1.4} x={1360} y={870} txt="RESTED UNDER FOIL" col={GRN} size={38} /></>}>{(tt) => {
  const juice = eio(tt, 1.0, 4.0), lift = eio(tt, 3.6, 4.6);
  return <>
    {[-0.2, 0.2].map((x, i) => <RBox key={i} s={[0.3, 0.02, 0.22]} p={[x, 0.01, 0]} r={0.01}>{M.wood({ base: [190, 140, 90] })}</RBox>)}
    <Turkey p={[-0.2, 0.02, 0]} s={0.9} />
    {/* tajadas y el charco de jugo que se agranda */}
    {[0, 1, 2].map((k) => <mesh key={k} position={[-0.08, 0.026, -0.05 + k * 0.03]} rotation={[-PI / 2, 0, 0.2]} scale={[1.4, 1, 1]}><circleGeometry args={[0.02, 24]} /><meshStandardMaterial color="#efc6a8" roughness={0.6} /></mesh>)}
    <mesh position={[-0.12, 0.0205, 0.02]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 1, 1]}><circleGeometry args={[0.01 + 0.07 * juice, 40]} /><meshPhysicalMaterial color="#c98a3a" roughness={0.05} clearcoat={1} transparent opacity={0.8} /></mesh>
    <Turkey p={[0.2, 0.02, 0]} s={0.9} />
    <group position={[0.2, 0.15 + 0.12 * lift, 0]} rotation={[0, 0, lift * 0.4]}>
      {[-1, 1].map((k) => <mesh key={k} position={[0, -0.03, k * 0.05]} rotation={[-PI / 2 + k * 0.9, 0, 0]}><planeGeometry args={[0.24, 0.14]} /><Foil /></mesh>)}</group>
  </>;
}}</Scene3D>;

// ---- 21:59 · LA PRÓXIMA: SAL DE MESA: la caja azul redonda cae con peso, se abre el pico y sale un chorrito de sal que arma un montoncito ----
const saltTex = () => tex.text("saltbox5", 512, 256, (g) => {
  g.fillStyle = "#2f5fae"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#f4f1ea"; g.fillRect(0, 70, 512, 110);
  for (const cx of [128, 384]) { g.save(); g.translate(cx, 0); g.scale(0.5, 1); g.fillStyle = "#2f5fae"; g.font = "bold 46px " + SERIF; g.textAlign = "center"; g.fillText("TABLE", 0, 118); g.font = "bold 54px " + SERIF; g.fillText("SALT", 0, 170);
    g.fillStyle = "#fff"; g.font = "bold 30px Arial"; g.fillText("PLAIN · 26 OZ", 0, 222); g.restore(); }
});
export const HNextSalt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.35, -0.15], el: [0.22, 0.18], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEXT · TABLE SALT" col={ICE} /></>}>{(tt) => {
  const d = phys(tt, 0.3, 6, 0.4), tilt = eio(tt, 2.0, 2.8), pile = cl((tt - 2.8) / 3), roll = eio(tt, 0.2, 1.6), bx = lerp(-0.45, -0.09, roll);
  return <>
    <FoilBall r={0.03} seed={77} p={[bx, 0.03, 0.04]} rot={[0, 0, -(bx + 0.45) / 0.03]} />
    <group position={[0, 0.0 + (1 - cl(d)) * 0.4, 0]} rotation={[0, 0.4, -tilt * 0.9]}>
      <mesh position={[0, 0.09, 0]} rotation={[0, PI - 0.4 - 0.35 + 1.42, 0]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.18, 48]} /><meshStandardMaterial map={saltTex()} roughness={0.6} /></mesh>
      <mesh position={[0, 0.181, 0]}><cylinderGeometry args={[0.055, 0.055, 0.003, 48]} /><meshStandardMaterial color="#2f5fae" roughness={0.6} /></mesh>
      <mesh position={[0.035, 0.185, 0]} rotation={[0, 0, -0.5 * tilt]}><boxGeometry args={[0.02, 0.003, 0.025]} />{M.steel({})}</mesh></group>
    {pile > 0 && <>
      {Array.from({ length: 24 }, (_, i) => { const ph = ((tt * 1.6 + i / 24) % 1); return <mesh key={i} position={[0.16 + (rn(i, 2) - 0.5) * 0.008, lerp(0.17, 0.01 + 0.03 * pile, ph), (rn(i, 3) - 0.5) * 0.008]}><boxGeometry args={[0.002, 0.002, 0.002]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
      <mesh position={[0.16, 0, 0]}><coneGeometry args={[0.05 * pile, 0.035 * pile, 32]} /><meshStandardMaterial color="#f8f8f6" roughness={0.9} bumpMap={tex.paper(6, 6)} bumpScale={4} /></mesh></>}
  </>;
}}</Scene3D>;
