// len29d · 2ª vuelta en 3D real (kit h3d): frascos, cuadra, galones, línea, agujeros, budines, perilla, llave trabada, agenda, escudo.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bowl, Hand, PI, Tank, Valve } from "./heroes3d_d1";

// ---- 12:58 · AGITALOS: dos frascos con agua se sacuden con inercia; el papel higiénico se deshace en copos, la toallita queda entera ----
export const HJarTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0, 0.15, 0], az: [-0.15, 0.12], el: [0.14, 0.1], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="TRY IT YOURSELF" title="SHAKE THEM BOTH" col={AMB} />}>{(tt) => {
  const shake = cl((tt - 0.8) / 0.3) * (1 - cl((tt - 3.6) / 0.6)), ang = 0.28 * shake * Math.sin(tt * 13), lag = 0.2 * shake * Math.sin(tt * 13 - 1.2), dis = eio(tt, 1.2, 3.6);
  return <>
    {[-0.17, 0.17].map((x, i) => <group key={i} position={[x, 0, 0]} rotation={[0, 0, i ? -ang : ang]}>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.085, 0.085, 0.26, 48, 1, true]} />{M.glass({ op: 0.28, side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.088, 0.088, 0.03, 48]} />{M.steel({ col: "#c9a24a" })}</mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.082, 0.082, 0.21, 40]} />{M.water({ op: 0.3 })}</mesh>
      {i === 0 ? <>
        {dis < 0.98 && <mesh position={[0, 0.1, 0]} rotation={[lag, 0.4, lag * 2]} scale={1 - 0.8 * dis}><boxGeometry args={[0.1, 0.1, 0.003]} />{M.matte({ col: "#f6f3ec", op: 1 - 0.5 * dis })}</mesh>}
        {Array.from({ length: 36 }, (_, j) => { const k = cl(dis * 1.3 - rn(j, 2) * 0.3); if (k <= 0) return null; return <mesh key={j} position={[(rn(j, 3) - 0.5) * 0.13 * k, 0.1 + (rn(j, 4) - 0.5) * 0.17 * k + 0.01 * Math.sin(tt * 3 + j), (rn(j, 5) - 0.5) * 0.12 * k]} rotation={[j, j * 2 + tt, 0]}><planeGeometry args={[0.012, 0.012]} />{M.matte({ col: "#f6f3ec", side: THREE.DoubleSide })}</mesh>; })}
      </> : <mesh position={[0, 0.1, 0]} rotation={[lag, -0.4 + lag, 0.3]}><boxGeometry args={[0.11, 0.1, 0.004, 8, 8]} />{M.matte({ col: "#e6eef4" })}</mesh>}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 13:10 · UNA CUADRA ENTERA: calle en corte; bajo tierra una soga gruesa de toallitas crece en el caño; las casas se apagan de a una ----
export const HFortyHouses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0d1016"
  cam={{ at: [0, 0.02, 0], az: [0.25, 0.1], el: [0.22, 0.16], r: [1.6, 1.4], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="HUMBOLDT PARK · 2009" title="A WHOLE BLOCK" col={AMB} />}>{(tt) => {
  const rope = eio(tt, 0.4, 4.0), N = 7;
  return <>
    <mesh position={[0, -0.12, 0]}><boxGeometry args={[1.5, 0.24, 0.4]} />{M.matte({ col: "#5a4636" })}</mesh>
    <mesh position={[0, 0.002, 0.12]}><boxGeometry args={[1.5, 0.004, 0.12]} />{M.matte({ col: "#2a2c30" })}</mesh>
    <mesh position={[0, -0.14, 0.201]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.05, 0.05, 1.5, 40, 1, true, 0, PI]} />{M.matte({ col: "#8a8f93", side: THREE.DoubleSide })}</mesh>
    {rope > 0 && <mesh geometry={tubeG("d_rope" + Math.round(rope * 30), Array.from({ length: 12 }, (_, i) => [0.72 - 1.44 * rope * (i / 11), -0.14 + 0.012 * Math.sin(i * 1.7), 0.2 + 0.01 * Math.cos(i)]), 0.032, 60, 14)}>{M.matte({ col: "#e9e4d6" })}</mesh>}
    {Array.from({ length: N }, (_, i) => { const x = -0.6 + i * 0.2, off = cl((tt - 1.0 - (N - 1 - i) * 0.45) / 0.3), hh = 0.12 + 0.05 * rn(i, 2);
      return <group key={i} position={[x, 0, -0.06]}>
        <RBox s={[0.15, hh, 0.14]} r={0.004} p={[0, hh / 2, 0]}>{M.matte({ col: ["#9a6a4a", "#7a8a9a", "#a88a5a"][i % 3] })}</RBox>
        <mesh position={[0, hh + 0.035, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.115, 0.07, 4]} />{M.matte({ col: "#3a2a22" })}</mesh>
        {[-0.035, 0.035].map((wx) => <mesh key={wx} position={[wx, hh * 0.55, 0.071]}><planeGeometry args={[0.03, 0.035]} /><meshBasicMaterial color={off > 0.5 ? "#1a1c22" : "#ffd27a"} toneMapped={false} /></mesh>)}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 14:33 · MENOS AGUA POR DESCARGA: dos inodoros grandes, uno viejo y uno nuevo; arriba de cada uno un contador mecánico de galones gira; en las tazas el remolino ----
const galTex = () => tex.text("d_gal", 256, 64, (g) => { g.clearRect(0, 0, 256, 64); g.fillStyle = "#f7f4ee"; g.font = "bold 40px Arial"; g.textAlign = "center"; g.fillText("GAL", 128, 48); });
export const HLowFlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0, 0.42, -0.1], az: [0, 0.1], el: [0.18, 0.12], r: [1.75, 1.5], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="IN THE 90s THE RULES CHANGED" title="LESS WATER PER FLUSH" col={AMB} />}>{(tt) => {
  const run = eio(tt, 0.8, 4.4);
  return <>
    {[[-0.3, 3.5, 1.15], [0.3, 1.6, 0.95]].map(([x, gal, s], i) => { const v = gal * 10 * run; return <group key={i} position={[x, 0, 0]}>
      <Bowl p={[0, 0, 0.05]} s={s} water={0.6} />
      <Tank p={[0, 0.48 * s, -0.2]} />
      {Array.from({ length: 3 }, (_, j) => <mesh key={j} position={[0, 0.17 * s + 0.14 * 0.6 * s + 0.002, 0.05]} rotation={[-PI / 2, 0, tt * (2 + 4 * run) + j * 2.1]}><ringGeometry args={[(0.02 + j * 0.03) * s, (0.026 + j * 0.03) * s, 40, 1, 0, PI * 1.2]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * run} depthWrite={false} /></mesh>)}
      <group position={[0, 0.82, -0.12]}>
        <RBox s={[0.17, 0.08, 0.06]} r={0.008}>{M.brass({ col: "#3a3a3c" })}</RBox>
        <DigitDrum v={Math.floor(v / 10) + cl((v % 10) - 9)} p={[-0.035, 0, 0.032]} r={0.028} w={0.03} />
        <mesh position={[0, -0.02, 0.034]}><sphereGeometry args={[0.004, 8, 6]} />{M.glow({ col: "#f7f4ee" })}</mesh>
        <DigitDrum v={v % 10} p={[0.035, 0, 0.032]} r={0.028} w={0.03} />
        <mesh position={[0, -0.075, 0.032]}><planeGeometry args={[0.1, 0.025]} /><meshBasicMaterial map={galTex()} transparent depthWrite={false} /></mesh>
      </group>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 15:27 · LA MITAD DEL EMPUJE: tanque en corte con la marca de agua; primero el nivel está bajo y el chorro a la taza sale corto; el nivel sube a la marca y el chorro sale largo ----
export const HTankLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [0, 0.38, -0.08], az: [0.45, 0.25], el: [0.14, 0.1], r: [1.2, 1.05], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="TAKE THE LID OFF" title="HALF THE PUSH" col={RED} />}>{(tt) => {
  const fill = eio(tt, 2.6, 3.8), lvl = 0.45 + 0.42 * fill, j1 = cl((tt - 0.8) / 0.3) * (1 - cl((tt - 2.2) / 0.3)), j2 = cl((tt - 4.2) / 0.3) * (1 - cl((tt - 6.0) / 0.3)), mark = cl((tt - 2.4) / 0.3);
  const jet = (k: number, L: number) => k > 0 ? <mesh geometry={tubeG("d_tl" + L, [[0, 0.33, -0.12], [0, 0.32, -0.02], [0, 0.31 - 0.04 * L, 0.04 + 0.08 * L], [0, 0.26 - 0.08 * L, 0.06 + 0.1 * L]], 0.006 + 0.008 * L, 30, 10)}>{M.water({ op: 0.75 * k, emI: 0.4 })}</mesh> : null;
  return <>
    <Bowl p={[0, 0, 0.05]} water={0.55} />
    <Tank p={[0, 0.48, -0.2]} cut lid={1} />
    <group position={[0, 0.48, -0.2]}>
      <mesh position={[0, -0.135 + 0.13 * lvl, 0]} scale={[1, 0.001 + lvl, 1]}><boxGeometry args={[0.34, 0.26, 0.13]} />{M.water({ op: 0.45 })}</mesh>
      <mesh position={[0, -0.135 + 0.26 * 0.87, 0.075]}><boxGeometry args={[0.34, 0.004, 0.002]} />{M.glow({ col: RED, op: 0.3 + 0.7 * mark })}</mesh>
      <mesh position={[0.11, -0.135 + 0.26 * lvl, 0]}><sphereGeometry args={[0.03, 20, 14]} />{M.plastic({ col: "#d05030" })}</mesh>
    </group>
    {jet(j1, 0.2)}{jet(j2, 1)}
  </>;
}}</Scene3D>;

// ---- 16:44 · LOS AGUJERITOS DEL BORDE: el aro de la taza visto desde abajo; de una fila de agujeros salen chorros en abanico; el sarro los va tapando uno a uno ----
export const HRimHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.3, 0.12], az: [0.1, -0.1], el: [-0.35, -0.28], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="UNDER THE RIM" title="A ROW OF LITTLE HOLES" col={ICE} />}>{(tt) => {
  const N = 9;
  return <group position={[0, 0.34, 0]}>
    <mesh rotation={[PI / 2, 0, 0]} scale={[1, 1.22, 1]}><torusGeometry args={[0.16, 0.022, 20, 80]} />{M.porcelain()}</mesh>
    {Array.from({ length: N }, (_, i) => { const a = PI / 2 + (i - (N - 1) / 2) * 0.16, x = Math.cos(a) * 0.145, z = Math.sin(a) * 0.145 * 1.22, scale = cl((tt - 1.4 - i * 0.45) / 0.5), on = 1 - scale;
      return <group key={i}>
        <mesh position={[x, -0.019, z]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.006, 14]} />{M.matte({ col: "#0b0b0c" })}</mesh>
        {scale > 0 && <mesh position={[x, -0.02, z]} scale={[scale, 0.5 * scale, scale]}><sphereGeometry args={[0.011, 12, 8]} />{M.matte({ col: "#e6dfc6" })}</mesh>}
        {on > 0.05 && <mesh geometry={tubeG("d_rh" + i, [[x, -0.02, z], [x * 0.85, -0.08, z * 0.85], [x * 0.6, -0.16, z * 0.6]], 0.003, 16, 6)}>{M.water({ op: 0.75 * on, emI: 0.5 })}</mesh>}
      </group>; })}
  </group>;
}}</Scene3D>;

// ---- 17:51 · ONCE NAVIDADES: latas de budín con moño caen con peso y forman una torre que se balancea; la de arriba dice 11 ----
const elevenTex = () => tex.text("d_11", 256, 256, (g) => { g.fillStyle = "#b82a22"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#f2d07a"; g.font = "bold 150px Georgia"; g.textAlign = "center"; g.fillText("11", 128, 180); });
export const HFruitcake11: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0, 0.22, 0], az: [-0.2, 0.15], el: [0.2, 0.14], r: [1.15, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="EVERY CHRISTMAS · 11 YEARS" title="I ATE EVERY ONE" col={AMB} />}>{(tt) => {
  const N = 6, sway = 0.04 * Math.sin(tt * 2.4) * cl((tt - 3.0) / 0.5);
  return <group rotation={[0, 0, sway]}>
    {Array.from({ length: N }, (_, i) => { const a = 0.3 + i * 0.42, k = cl(phys(tt, a, 8, 0.38)); if (tt < a) return null; const y = 0.03 + i * 0.062 + 0.4 * (1 - k), col = i % 2 ? "#2a6a3a" : "#b82a22", top = i === N - 1;
      return <group key={i} position={[0.006 * (i % 2 ? 1 : -1), y, 0]} rotation={[0, i * 0.5, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.11 - 0.006 * i, 0.11 - 0.006 * i, 0.058, 48]} />{M.plastic({ col })}</mesh>
        <mesh position={[0, 0.0295, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.104 - 0.006 * i, 48]} />{top ? <meshStandardMaterial map={elevenTex()} roughness={0.4} /> : M.brass({ col: "#c9a24a" })}</mesh>
        {top && [-1, 1].map((s) => <mesh key={s} position={[s * 0.022, 0.05, 0]} rotation={[0, 0, s * 0.6]} scale={[1, 0.6, 0.5]}><torusGeometry args={[0.022, 0.007, 10, 24]} />{M.plastic({ col: "#f2d07a" })}</mesh>)}
      </group>; })}
  </group>;
}}</Scene3D>;

// ---- 18:54 · DOS SEGUNDOS: la llave de paso cromada de cerca; la cámara la rodea en curva; la mano gira la manija ovalada y una cinta 3D marca el giro ----
export const HOvalKnob: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile"
  cam={{ at: [0, 0.1, -1.45], az: [-0.5, 0.4], el: [0.16, 0.1], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="THE SHUT-OFF VALVE" title="TWO SECONDS" col={ICE} />}>{(tt) => {
  const turn = eio(tt, 1.8, 3.8) * PI / 2, rib = eio(tt, 1.8, 3.8), N = Math.max(3, Math.round(24 * rib));
  const arc = Array.from({ length: N }, (_, i) => { const a = PI / 2 - (i / (N - 1)) * rib * PI / 2; return [Math.cos(a) * 0.06, 0.1 + Math.sin(a) * 0.06, -1.47]; });
  return <>
    <Valve p={[0, 0.1, -1.56]} turn={turn} em={0.15} />
    <Hand p={[0.02 + 0.01 * Math.sin(turn), 0.16, -1.42]} rot={[0.3, 0, -turn * 0.8]} curl={0.7 * eio(tt, 1.2, 1.8)} s={0.95} />
    {rib > 0.02 && <mesh geometry={tubeG("d_ok" + N, arc, 0.006, 40, 8)}>{M.glow({ col: ICE, op: 0.85 })}</mesh>}
    {rib > 0.02 && <mesh position={arc[N - 1] as [number, number, number]} rotation={[0, 0, -rib * PI / 2 - PI]}><coneGeometry args={[0.014, 0.03, 16]} />{M.glow({ col: ICE, op: 0.85 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 19:26 · TRABADA CON MINERALES: la llave con costra de cristales; la mano con guante tira, tiembla y no la mueve; saltan granitos ----
export const HStuckValve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile" warm={0.6}
  cam={{ at: [0, 0.12, -1.45], az: [0.4, -0.2], el: [0.18, 0.12], r: [0.52, 0.45], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="NOT TURNED IN YEARS" title="FROZEN WITH MINERALS" col={RED} />}>{(tt) => {
  const grip = eio(tt, 0.5, 1.4), strain = cl((tt - 1.6) / 0.3), tr = strain * 0.004 * Math.sin(tt * 45), tw = strain * 0.04 * Math.sin(tt * 30);
  return <>
    <Valve p={[0, 0.1, -1.56]} turn={tw} crust={1} />
    <Hand p={[0.01 + tr, lerp(0.3, 0.16, grip), -1.43]} rot={[0.3, 0, -0.2 - 0.15 * strain]} curl={0.75 * grip} col="#3a6ac2" s={0.95} />
    {Array.from({ length: 8 }, (_, i) => { const a = 1.8 + i * 0.5, k = cl((tt - a) / 0.7); return k > 0 && k < 1 ? <mesh key={i} position={[0.01 * Math.cos(i * 2), 0.1 - 0.12 * k * k, -1.5 + 0.03 * k]}><octahedronGeometry args={[0.003 + 0.002 * rn(i, 2)]} />{M.matte({ col: "#e6e2d4" })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 20:18 · NO EN UNA EMERGENCIA: dos hojas de agenda en perspectiva; el martes bajo sol cálido y tranquilo; la otra, de madrugada en penumbra azul con agua que sube ----
const pageTex = (k: string, top: string, sub: string, ink: string) => tex.text("d_pg" + k, 256, 320, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 256, 320); g.fillStyle = ink; g.fillRect(0, 0, 256, 64); g.fillStyle = "#f6f1e4"; g.font = "bold 34px Arial"; g.textAlign = "center"; g.fillText(top, 128, 46); g.fillStyle = "#3a3630"; g.font = "bold 64px Georgia"; g.fillText(sub, 128, 190); g.strokeStyle = "rgba(60,54,48,.2)"; for (let y = 220; y < 320; y += 22) { g.beginPath(); g.moveTo(20, y); g.lineTo(236, y); g.stroke(); } });
export const HTuesday: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#14161c"
  cam={{ at: [0, 0.16, 0], az: [-0.1, 0.12], el: [0.3, 0.22], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="FIND OUT NOW" title="NOT IN AN EMERGENCY" col={AMB} />}>{(tt) => {
  const a = cl(phys(tt, 0.4, 7, 0.45)), b = cl(phys(tt, 0.9, 7, 0.45)), w = eio(tt, 1.8, 5.2);
  return <>
    <group position={[-0.2, 0.16, 0]} rotation={[-0.25, 0.35 + 0.4 * (1 - a), 0.03]} scale={0.001 + a}>
      <mesh castShadow><boxGeometry args={[0.24, 0.3, 0.004]} /><meshStandardMaterial map={pageTex("tue2", "TUESDAY", "3 PM", "#d4902a")} roughness={0.85} /></mesh>
      <pointLight position={[0.1, 0.2, 0.25]} intensity={0.4} distance={0.6} color="#ffcf8a" />
    </group>
    <group position={[0.2, 0.16, 0]} rotation={[-0.25, -0.35 - 0.4 * (1 - b), -0.03]} scale={0.001 + b}>
      <mesh castShadow><boxGeometry args={[0.24, 0.3, 0.004]} /><meshStandardMaterial map={pageTex("six", "MONDAY", "6 AM", "#3a4a6a")} roughness={0.85} color="#8a9ac0" /></mesh>
      <mesh position={[0, -0.15 + 0.11 * w, 0.006]} scale={[1, 0.001 + w, 1]}><boxGeometry args={[0.24, 0.22, 0.002]} />{M.water({ op: 0.55, col: "#3a6aa8" })}</mesh>
      <pointLight position={[-0.05, 0.1, 0.25]} intensity={0.4} distance={0.5} color="#6a8ad0" />
    </group>
  </>;
}}</Scene3D>;

// ---- 21:10 · SÓLO DOS COSAS: el inodoro con un escudo invisible; cinco objetos vuelan hacia la taza, rebotan contra el escudo (que destella) y caen al tacho ----
export const HOnlyTwo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0.12, 0.3, -0.05], az: [0.35, 0.2], el: [0.2, 0.14], r: [1.5, 1.3], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="THE WHOLE LIST" title="WASTE AND PAPER" col={ICE} />}>{(tt) => {
  const fly = (i: number) => { const a = 0.4 + i * 0.75, k = cl((tt - a) / 0.6), k2 = cl((tt - a - 0.6) / 0.6); return { a, k, k2 }; };
  const hitAny = Math.max(0, ...[0, 1, 2, 3, 4].map((i) => { const { a } = fly(i); const d = tt - a - 0.6; return d > 0 && d < 0.35 ? 1 - d / 0.35 : 0; }));
  const items = ["#f2efe8", "#e8f0f6", "#f6f3ec", "#cfe0ef", "#f2c230"];
  return <>
    <Bowl p={[0, 0, 0.05]} water={0.6} />
    <Tank p={[0, 0.48, -0.2]} />
    <mesh position={[0, 0.34, 0.05]} scale={[1, 0.55, 1.2]}><sphereGeometry args={[0.2, 40, 20, 0, 2 * PI, 0, PI / 2]} /><meshBasicMaterial color="#8ad0ff" transparent opacity={0.04 + 0.22 * hitAny} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    {/* el tacho al costado */}
    <group position={[0.42, 0, 0.05]}>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.08, 0.065, 0.22, 40, 1, true]} />{M.steel({ col: "#9aa2aa", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.065, 0.065, 0.006, 40]} />{M.steel({ col: "#7a828a" })}</mesh>
    </group>
    {[0, 1, 2, 3, 4].map((i) => { const { k, k2 } = fly(i); if (k <= 0) return null; const start = [-0.5, 0.55 + 0.04 * i, 0.15 - 0.05 * i], hit = [0, 0.43, 0.05], bin = [0.42, 0.06 + 0.025 * i, 0.05];
      const x = k2 > 0 ? lerp(hit[0], bin[0], k2) : lerp(start[0], hit[0], k), y = k2 > 0 ? lerp(hit[1], bin[1], k2) + 0.18 * Math.sin(PI * k2) : lerp(start[1], hit[1], k), z = k2 > 0 ? lerp(hit[2], bin[2], k2) : lerp(start[2], hit[2], k);
      return <group key={i} position={[x, y, z]} rotation={[tt * 3 + i, tt * 2, i]}>
        {i === 4 ? <mesh><capsuleGeometry args={[0.004, 0.06, 4, 8]} />{M.plastic({ col: items[i] })}</mesh> : <mesh><boxGeometry args={[0.06, 0.05, 0.006]} />{M.matte({ col: items[i] })}</mesh>}
      </group>; })}
  </>;
}}</Scene3D>;
