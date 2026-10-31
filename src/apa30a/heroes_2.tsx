// apa30a · componentes únicos, minutos 10-20 (la trampa de pozo, los 5 errores, lo que el abuelo nunca hizo, los mitos).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { SoilBlock, TunnelCut, Ridge, Mole, Worm, Can, Board, Flag, Bucket, Jug, Sign, grassT, soilT, BarnWall } from "./farmkit";

const PI = Math.PI;

// ---- 10:22 · AL RAS DEL PISO DEL TÚNEL: corte del túnel con la lata; la lata sube un poco (el topo choca y se vuelve), baja al ras y el topo cae ----
export const HFlushRim: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110c" key1={[-0.9, 1.3, 1.3]}
  cam={{ at: [0, -0.16, 0], az: [0.25, -0.15], el: [0.18, 0.12], r: [0.85, 0.7], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={tt < 2.6 ? 0.8 : 2.6} x={960} y={140} txt={tt < 2.6 ? "RIM HIGH = HE TURNS BACK" : "FLUSH = HE DROPS IN"} col={tt < 2.6 ? RED : GRN} />}>{(tt) => {
  const hi = 1 - eio(tt, 2.2, 2.6), rim = 0.018 * hi;
  const mx = tt < 2.2 ? lerp(-0.55, -0.12, eio(tt, 0.3, 1.3)) - 0.08 * eio(tt, 1.4, 2.0) : lerp(-0.55, -0.02, eio(tt, 2.7, 3.6));
  const drop = tt > 3.6 ? eio(tt, 3.6, 4.1) : 0;
  return <>
    <SoilBlock w={1.3} h={0.45} d={0.6} p={[0, 0, -0.3]} />
    <TunnelCut pts={[[-0.65, -0.15], [-0.3, -0.155], [-0.09, -0.155]]} z={0.002} r={0.035} />
    <TunnelCut pts={[[0.09, -0.155], [0.35, -0.15], [0.65, -0.15]]} z={0.002} r={0.035} />
    <Can p={[0, -0.39 + rim, 0]} r={0.085} h={0.2} label={false} />
    <mesh position={[0, -0.19 + rim, 0.09]}><boxGeometry args={[0.2, 0.003, 0.003]} />{M.glow({ col: hi > 0.5 ? RED : GRN, op: 0.9 })}</mesh>
    <group position={[mx, -0.19 - 0.17 * drop, 0.005]} rotation={[0.9 * drop, tt < 2.2 && tt > 1.4 ? -PI / 2 + PI * eio(tt, 1.4, 1.9) : PI / 2, 0]}><Mole s={0.8} paddle={tt * 1.3} nose={tt} /></group>
  </>;
}}</Scene3D>;

// ---- 11:20 · LA TABLA HACE TRES COSAS: sobre el pozo, la tabla para el rayo de sol, la lluvia rebota y la bota no pisa el agujero ----
export const HBoardThree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#14120e" key1={[-1.0, 1.8, 1.0]}
  cam={{ at: [0, 0.1, 0], az: [-0.3, 0.25], el: [0.4, 0.32], r: [1.5, 1.3], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={0.9} x={420} y={170} txt="DARK" col={AMB} /><Tag tt={tt} at={2.0} x={960} y={130} txt="DRY" col="#8fd6ff" /><Tag tt={tt} at={3.1} x={1500} y={170} txt="SAFE" col={GRN} /></>}>{(tt) => {
  const sun = cl((tt - 0.6) * 2), rain = cl((tt - 1.7) * 1.5), boot = eio(tt, 2.8, 3.4);
  return <>
    <SoilBlock w={1.3} h={0.3} d={0.9} />
    <Board p={[0, 0.012, 0]} />
    
    {Array.from({ length: 18 }, (_, i) => { const ph = ((tt * 1.4 + rn(i, 1)) % 1); const y = 0.6 - 0.58 * ph;
      return rain > 0 && <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.4 + (y < 0.05 ? 0.03 * Math.sin(i) : 0), y, (rn(i, 3) - 0.5) * 0.4]}><capsuleGeometry args={[0.004, 0.02, 4, 6]} />{M.water({ op: 0.8 * rain })}</mesh>; })}
    <group position={[0.42, 0.25 * (1 - boot) + 0.02, 0.1]} rotation={[0, -0.5, 0]}><mesh position={[0, 0.0, 0]}><boxGeometry args={[0.1, 0.035, 0.24]} /><meshStandardMaterial color="#2a1f17" /></mesh><mesh position={[0, 0.06, -0.02]}><boxGeometry args={[0.095, 0.09, 0.18]} /><meshStandardMaterial color="#6b4423" /></mesh></group>
  </>;
}}</Scene3D>;

// ---- 12:00 · EL RELOJ DE LAS VISITAS: reloj de granero redondo; se encienden las cuatro miradas (mediodía, media tarde, cena, oscuro) ----
export const HCheckClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[-0.8, 1.2, 1.4]}
  cam={{ at: [0, 0.5, -1.5], az: [0.25, -0.2], el: [0.05, 0.1], r: [1.3, 1.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={950} txt="CHECK EVERY FEW HOURS" col={AMB} />}>{(tt) => {
  const hr = 12 + 9 * eio(tt, 0.6, 4.2), marks = [12, 15, 18, 21];
  return <group position={[0, 0.5, -1.55]}>
    <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.05, 64]} /><meshStandardMaterial color="#3a2a1c" roughness={0.7} /></mesh>
    <mesh position={[0, 0, 0.027]}><circleGeometry args={[0.33, 64]} /><meshStandardMaterial map={tex.paper()} color="#b9b2a2" roughness={0.9} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.29, Math.cos(i * PI / 6) * 0.29, 0.03]} rotation={[0, 0, -i * PI / 6]}><boxGeometry args={[0.012, 0.045, 0.004]} /><meshStandardMaterial color="#2a1d12" /></mesh>)}
    {marks.map((m, i) => { const a = (m % 12) * PI / 6, on = cl((hr - m) * 3);
      return <group key={i}><mesh position={[Math.sin(a) * 0.22, Math.cos(a) * 0.22, 0.032]}><circleGeometry args={[0.036, 24]} />{M.glow({ col: i === 3 ? "#8fd6ff" : AMB, op: 0.1 + 0.6 * on })}</mesh>
        {on > 0 && <pointLight position={[Math.sin(a) * 0.22, Math.cos(a) * 0.22, 0.1]} intensity={0.18 * on} distance={0.25} color="#ffcf7a" />}</group>; })}
    <mesh position={[0, 0, 0.04]} rotation={[0, 0, -(hr % 12) * PI / 6]}><boxGeometry args={[0.018, 0.34, 0.006]} /><meshStandardMaterial color="#1b1410" /></mesh>
    <mesh position={[0, 0, 0.045]} rotation={[0, 0, -(hr * 12 % 12) * PI / 6]}><boxGeometry args={[0.012, 0.48, 0.006]} /><meshStandardMaterial color="#1b1410" /></mesh>
    <mesh position={[0, 0, 0.05]}><cylinderGeometry args={[0.02, 0.02, 0.01, 20]} />{M.brass()}</mesh>
  </group>;
}}</Scene3D>;

// ---- 13:22 · EL DESVÍO: la lata con el borde alto en el corte; el topo llega, toca el labio y cava un túnel nuevo que la rodea ----
export const HBypass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, 0, 0], az: [0.1, -0.1], el: [1.25, 1.1], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={140} txt="MISTAKE 2 · THE RIM SITS TOO HIGH" col={RED} />}>{(tt) => {
  const dig = cl((tt - 1.4) / 2.2), pts = [[-0.6, 0, 0], [-0.15, 0, 0], [-0.12, 0, 0.16], [0, 0, 0.21], [0.12, 0, 0.16], [0.15, 0, 0], [0.6, 0, 0]];
  const N = Math.max(2, Math.round(2 + 5 * dig)), cur = new THREE.CatmullRomCurve3(pts.slice(0, N).map((q) => new THREE.Vector3(q[0], q[1], q[2])));
  const mp = tt < 1.4 ? new THREE.Vector3(lerp(-0.6, -0.14, eio(tt, 0.2, 1.2)), 0, 0) : cur.getPointAt(1);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial map={soilT()} color="#9a7a56" roughness={1} /></mesh>
    <Ridge id="bp0" pts={[[-0.7, 0.002, 0], [-0.4, 0.002, 0], [-0.16, 0.002, 0]]} r={0.04} up={0.8} col="#5a3e26" />
    <Ridge id="bp1" pts={[[0.16, 0.002, 0], [0.4, 0.002, 0], [0.7, 0.002, 0]]} r={0.04} up={0.8} col="#5a3e26" />
    {N > 2 && <mesh geometry={tubeG("bpdig" + N, pts.slice(0, N), 0.04, 40, 8)} scale={[1, 0.4, 1]}><meshStandardMaterial color="#3b2616" roughness={1} /></mesh>}
    <group position={[0, -0.18, 0]}><Can r={0.085} h={0.2} label={false} /></group>
    <mesh position={[0, 0.02, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.086, 0.005, 8, 40]} />{M.glow({ col: RED })}</mesh>
    <pointLight position={[0, 0.35, 0.1]} intensity={2.2} distance={1.1} color="#ffd9a0" />
    <group position={[mp.x, 0.01, mp.z]} rotation={[0, PI / 2 - (tt > 1.4 ? Math.atan2(0.21, 0.12) * Math.sin(PI * dig) : 0), 0]}><Mole s={0.75} paddle={tt * 1.5} nose={tt} /></group>
  </>;
}}</Scene3D>;

// ---- 14:13 · OLOR A MANO: la mano desnuda deja estelas de colores (nafta, tabaco, repelente) que bajan a la lata; el guante de algodón, ninguna ----
export const HSmellHands: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110c" key1={[-0.9, 1.5, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.25], el: [0.32, 0.25], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.0} x={560} y={150} txt="BARE HANDS" col={RED} /><Tag tt={tt} at={2.4} x={1360} y={150} txt="SHED GLOVES" col={GRN} /></>}>{(tt) => <>
  <SoilBlock w={1.4} h={0.25} d={0.7} />
  {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.32, 0, 0]}>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.09, 30]} /><meshStandardMaterial color="#120c07" /></mesh>
    <group position={[0, 0.26 + 0.03 * Math.sin(tt * 1.5 + sd), 0]} rotation={[0.3, 0, 0]}>
      <RBox s={[0.14, 0.04, 0.12]} r={0.02}><meshStandardMaterial color={sd < 0 ? "#d9a98a" : "#ece6d6"} roughness={sd < 0 ? 0.6 : 1} /></RBox>
      {[0, 1, 2, 3].map((f) => <RBox key={f} s={[0.026, 0.026, 0.08]} p={[-0.05 + f * 0.034, -0.005, 0.09]} r={0.012}><meshStandardMaterial color={sd < 0 ? "#d9a98a" : "#ece6d6"} roughness={sd < 0 ? 0.6 : 1} /></RBox>)}
    </group>
    {sd < 0 && Array.from({ length: 24 }, (_, i) => { const ph = (tt * 0.45 + rn(i, 1)) % 1, col = ["#9adf5a", "#c79a4a", "#b88ae8"][i % 3];
      return tt > 0.6 && <mesh key={i} position={[0.05 * Math.sin(ph * 9 + i), 0.24 - 0.3 * ph, 0.04 * Math.cos(ph * 7 + i)]} scale={1 + 2 * ph}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color={col} transparent opacity={0.5 * (1 - ph) * cl(tt - 0.6)} depthWrite={false} /></mesh>; })}
  </group>)}
</>}</Scene3D>;

// ---- 15:05 · LAS CINCO TABLITAS: cinco tablitas cuelgan de un clavo cada una en la pared del galpón y se dan vuelta de a una ----
const FIVE = ["DEAD RUN", "HIGH RIM", "LIGHT", "SMELL", "NOT CHECKING"];
export const HFiveTags: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" key1={[-1.2, 1.6, 1.2]}
  cam={{ at: [0, 0.62, -1.5], az: [-0.18, 0.15], el: [0.06, 0.03], r: [2.3, 2.0], fov: 32 }}>{(tt) => <>
  {FIVE.map((w, i) => { const at = 0.5 + i * 0.75, f = phys(tt, at, 7, 0.32), sw = Math.sin((tt - at) * 5) * 0.25 * Math.exp(-(tt - at) * 1.4) * (tt > at ? 1 : 0);
    return <group key={i} position={[-0.72 + i * 0.36, 0.78, -1.53]} rotation={[0, 0, sw]}>
      <mesh position={[0, 0.02, 0.02]}><cylinderGeometry args={[0.006, 0.006, 0.05, 8]} />{M.steel()}</mesh>
      <group position={[0, -0.13, 0.03]} rotation={[0, PI * (1 - cl(f)), 0]}>
        <Sign id={"five" + i} txt={String(i + 1)} sub={w} w={0.3} h={0.22} p={[0, 0, 0]} />
      </group>
    </group>; })}
</>}</Scene3D>;

// ---- 15:30 · "MATAMOS 20 Y NO ALCANZÓ": el comentario real clavado en la tabla; al lado, 20 avispas tachadas y el nido sigue zumbando ----
export const HComment20: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[-1.1, 1.4, 1.2]}
  cam={{ at: [0, 0.5, -1.5], az: [0.3, -0.15], el: [0.05, 0.1], r: [1.4, 1.2], fov: 32 }}>{(tt) => {
  const note = phys(tt, 0.3, 5, 0.55);
  const T = tex.text("c20", 512, 300, (g) => { g.fillStyle = "#f6f0e2"; g.fillRect(0, 0, 512, 300); g.fillStyle = "#7a6a52"; g.font = "700 26px Arial"; g.fillText("A VIEWER WROTE:", 30, 48);
    g.fillStyle = "#1d1a15"; g.font = "800 38px Arial"; ["“the 20 or so we killed", "did not take care of", "the whole problem”"].forEach((l, i) => g.fillText(l, 30, 110 + i * 54)); });
  return <group position={[0, 0, -1.5]}>
    <group position={[-0.32, 0.55, 0.03]} rotation={[0, 0, -0.04 + (1 - cl(note)) * 0.4]} scale={Math.max(0.01, cl(note))}>
      <mesh><planeGeometry args={[0.6, 0.35]} /><meshStandardMaterial map={T} roughness={0.9} /></mesh>
      <mesh position={[0, 0.15, 0.01]}><cylinderGeometry args={[0.012, 0.012, 0.01, 16]} />{M.brass()}</mesh>
    </group>
    {Array.from({ length: 20 }, (_, i) => { const x = 0.12 + (i % 5) * 0.085, y = 0.76 - Math.floor(i / 5) * 0.06, k = cl((tt - 1.2 - i * 0.08) * 4);
      return <group key={i} position={[x, y, 0.03]}><mesh scale={[0.026, 0.015, 0.014]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#e8b52a" : "#1b1712"} /></mesh>
        {k > 0 && <mesh rotation={[0, 0, 0.7]} position={[0, 0, 0.012]}><boxGeometry args={[0.05 * k, 0.006, 0.002]} />{M.glow({ col: RED })}</mesh>}</group>; })}
    <group position={[0.36, 0.36, 0.06]}>
      <mesh scale={[0.13, 0.11, 0.1]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#9a8a72" roughness={0.9} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const a = tt * 3 + i * 0.63; return tt > 2.8 && <mesh key={i} position={[Math.cos(a) * (0.17 + 0.03 * Math.sin(i)), 0.03 * Math.sin(a * 2), Math.sin(a) * 0.14]} scale={[0.012, 0.008, 0.008]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={i % 2 ? "#e8b52a" : "#1b1712"} /></mesh>; })}
    </group>
  </group>;
}}</Scene3D>;

// ---- 16:53 · LA CADENA DEL VENENO: del cebo al perro que cava, al gato que caza, al búho que come lo que deja el gato; los eslabones se tiñen de rojo ----
export const HPoisonChain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" key1={[-1.0, 1.7, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [-0.35, 0.35], el: [0.4, 0.3], r: [1.3, 1.1], fov: 32 }}
  over={(tt) => <>{["BAIT", "DOG", "CAT", "OWL"].map((w, i) => <Tag key={w} tt={tt} at={0.5 + i * 0.8} x={[250, 720, 1210, 1690][i]} y={880} txt={w} col={i === 0 ? RED : AMB} />)}<Tag tt={tt} at={3.6} x={960} y={140} txt="IT DOESN'T STOP AT THE MOLE" col={RED} /></>}>{(tt) => {
  const st = [-0.5, -0.17, 0.17, 0.5], red = (i: number) => cl((tt - 0.8 - i * 0.8) * 2);
  const blob = (i: number, c: string, s: number[], y: number) => <mesh position={[st[i], y, 0]} scale={s as [number, number, number]} castShadow><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color={new THREE.Color(c).lerp(new THREE.Color("#c22a26"), 0.35 * red(i)).getStyle()} roughness={0.8} /></mesh>;
  return <>
    <mesh position={[st[0], 0.02, 0]}><cylinderGeometry args={[0.05, 0.05, 0.04, 6]} /><meshStandardMaterial color="#c22a26" roughness={0.5} /></mesh>
    {blob(1, "#8a6a42", [0.09, 0.06, 0.13], 0.07)}{blob(2, "#5a554e", [0.06, 0.05, 0.1], 0.05)}{blob(3, "#8a7350", [0.07, 0.09, 0.06], 0.09)}
    {[0, 1, 2].map((i) => <mesh key={i} position={[(st[i] + st[i + 1]) / 2, 0.07, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.04, 0.008, 8, 20]} /><meshStandardMaterial color={red(i + 1) > 0.5 ? "#c22a26" : "#9aa0a4"} metalness={0.7} roughness={0.35} emissive={red(i + 1) > 0.5 ? "#5a0000" : "#000"} /></mesh>)}
    <mesh position={[st[3], 0.17, 0.04]}><coneGeometry args={[0.012, 0.025, 6]} /><meshStandardMaterial color="#e8b23a" /></mesh>
  </>;
}}</Scene3D>;

// ---- 17:10 · LA MANGUERA NO LLEGA: la red de túneles en corte se llena de agua azul; el topo sube por un ramal lateral y espera ----
export const HHoseFlood: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, -0.2, 0], az: [0.15, -0.12], el: [0.12, 0.08], r: [1.25, 1.05], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={960} txt="HUNDREDS OF FEET OF TUNNEL" col="#8fd6ff" />}>{(tt) => {
  const w = cl((tt - 0.6) / 2.6);
  const main = [[-0.75, -0.08], [-0.4, -0.2], [0, -0.28], [0.4, -0.3], [0.75, -0.35]], side = [[0.1, -0.28], [0.18, -0.18], [0.22, -0.08]];
  return <>
    <SoilBlock w={1.6} h={0.6} d={0.6} p={[0, 0, -0.3]} />
    <TunnelCut pts={main} z={0.002} r={0.03} />
    <TunnelCut pts={side} z={0.003} r={0.026} />
    <TunnelCut pts={main} z={0.004} r={0.024} k={w} col="#3f8fc8" />
    <mesh position={[-0.75, 0.15, 0.02]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.022, 0.022, 0.3, 16]} />{M.rubber({ col: "#2e7d32" })}</mesh>
    <group position={[0.21, lerp(-0.25, -0.1, eio(tt, 1.4, 2.4)), 0.01]} rotation={[0, 0, PI / 2 - 0.4]}><Mole s={0.55} paddle={tt * 1.2} /></group>
  </>;
}}</Scene3D>;

// ---- 18:12 · LA ESTACA QUE ZUMBA: la estaca a pilas tira ondas en la tierra; el topo se aleja un poco, se acostumbra y vuelve a dormir ----
export const HBuzzStake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, -0.1, 0], az: [-0.35, 0.2], el: [0.25, 0.18], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={140} txt="HE GETS USED TO IT" col={AMB} />}>{(tt) => {
  const away = eio(tt, 0.6, 1.4) * (1 - eio(tt, 2.4, 3.4));
  return <>
    <SoilBlock w={1.3} h={0.45} d={0.6} p={[0, 0, -0.3]} />
    <group position={[-0.3, 0.1, 0]}>
      <mesh><cylinderGeometry args={[0.035, 0.035, 0.12, 20]} />{M.plastic({ col: "#2b3a2b" })}</mesh>
      <mesh position={[0, -0.2, 0]}><coneGeometry args={[0.025, 0.28, 16]} />{M.plastic({ col: "#2b3a2b" })}</mesh>
      <mesh position={[0, 0.065, 0]}><sphereGeometry args={[0.01, 10, 8]} />{M.glow({ col: Math.sin(tt * 8) > 0 ? "#ff4a3d" : "#401010" })}</mesh>
    </group>
    {[0, 1, 2].map((i) => { const ph = ((tt * 0.9 + i / 3) % 1); return <mesh key={i} position={[-0.3, -0.2, 0.004]}><ringGeometry args={[0.04 + 0.4 * ph, 0.048 + 0.4 * ph, 48]} /><meshBasicMaterial color="#ffd08a" transparent opacity={0.45 * (1 - ph)} depthWrite={false} /></mesh>; })}
    <TunnelCut pts={[[-0.6, -0.25], [0, -0.26], [0.6, -0.24]]} z={0.002} r={0.032} />
    <group position={[lerp(0.05, 0.35, away), -0.255, 0.01]} rotation={[0, -PI / 2, 0]}><Mole s={0.75} paddle={away > 0.05 && away < 0.95 ? tt * 1.4 : 0} /></group>
    {tt > 3.6 && [0, 1, 2].map((i) => <mesh key={i} position={[0.12 + i * 0.03, -0.18 + i * 0.035 + 0.01 * Math.sin(tt * 2 + i), 0.02]}><planeGeometry args={[0.02, 0.02]} />{M.glow({ col: "#e9dcc0", op: 0.7 })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 19:30 · LO MUEVE, NO LO SACA: el parche regado con aceite de ricino; el topo se va al costado, llueve, el parche se lava y vuelve ----
export const HCastorTrial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#11140d"
  cam={{ at: [0, 0, 0], az: [0.2, -0.2], el: [0.95, 0.8], r: [1.3, 1.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={tt < 2.6 ? 0.9 : 2.6} x={960} y={140} txt={tt < 2.6 ? "IT MOVES HIM…" : "…RAIN WASHES IT OUT"} col={tt < 2.6 ? AMB : "#8fd6ff"} />}>{(tt) => {
  const treat = cl((tt - 0.3) * 2) * (1 - eio(tt, 2.4, 3.4)), rain = tt > 2.3 && tt < 3.6;
  const mx = lerp(0, 0.5, eio(tt, 0.8, 1.8)) - lerp(0, 0.5, eio(tt, 3.4, 4.3));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.8, 1.1]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <mesh position={[-0.05, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.36, 48]} /><meshStandardMaterial color="#d6c27a" transparent opacity={0.55 * treat} roughness={0.3} /></mesh>
    <mesh position={[-0.05, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><torusGeometry args={[0.36, 0.008, 8, 64]} /><meshStandardMaterial color="#b89a4a" transparent opacity={treat} roughness={0.5} /></mesh>
    <Ridge id="ct" pts={[[mx - 0.25, 0, 0.02], [mx - 0.12, 0, -0.03], [mx, 0, 0]]} r={0.03} />
    <group position={[mx + 0.04, 0.02, 0]} rotation={[0, PI / 2, 0]}><Mole s={0.7} paddle={tt * 1.2} /></group>
    {rain && Array.from({ length: 30 }, (_, i) => { const ph = ((tt * 1.6 + rn(i, 1)) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.4, 0.6 - 0.6 * ph, (rn(i, 3) - 0.5) * 0.9]}><capsuleGeometry args={[0.004, 0.025, 4, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 20:52 · LLAMÁ ANTES: el teléfono de pared del granero suena (el tubo salta), al lado la libreta con las tres preguntas ----
export const HCallFirst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[-1.0, 1.4, 1.3]}
  cam={{ at: [0, 0.5, -1.5], az: [-0.35, 0.2], el: [0.06, 0.1], r: [1.25, 1.05], fov: 30 }}>{(tt) => {
  const ring = tt < 2.0 ? Math.sin(tt * 40) * 0.04 * cl(tt * 3) : 0, lift = eio(tt, 2.0, 2.6);
  const T = tex.text("callq", 360, 420, (g) => { g.fillStyle = "#f6f0e2"; g.fillRect(0, 0, 360, 420); g.strokeStyle = "rgba(90,130,200,.4)"; for (let y = 60; y < 420; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(360, y); g.stroke(); }
    g.fillStyle = "#1d1a15"; g.font = "700 30px Arial"; ["STATE WILDLIFE:", "1. live trap OK?", "2. release OK?", "3. where?"].forEach((l, i) => g.fillText(l, 22, 52 + i * 80)); });
  return <group position={[0, 0, -1.5]}>
    <pointLight position={[-0.1, 0.75, 0.45]} intensity={1.8} distance={1.2} color="#fff2dc" />
    <group position={[-0.22, 0.55, 0.05]} rotation={[0, 0, ring]}>
      <RBox s={[0.22, 0.34, 0.08]} r={0.02}><meshStandardMaterial color="#3a3530" roughness={0.3} metalness={0.2} /></RBox>
      <mesh position={[0, 0.03, 0.045]}><circleGeometry args={[0.07, 32]} />{M.chrome()}</mesh>
      <group position={[-0.15 - 0.12 * lift, 0.05 + 0.08 * lift, 0.06 + 0.15 * lift]} rotation={[0.3 * lift, 0.4 * lift, 0.2 * lift]}>
        <RBox s={[0.05, 0.26, 0.05]} r={0.02}><meshStandardMaterial color="#1c1a18" roughness={0.35} /></RBox>
      </group>
    </group>
    <group position={[0.25, 0.5, 0.03]} rotation={[0, 0, 0.04]} scale={Math.max(0.01, phys(tt, 1.0, 5, 0.55))}><mesh><planeGeometry args={[0.38, 0.44]} /><meshStandardMaterial map={T} roughness={0.9} /></mesh></group>
  </group>;
}}</Scene3D>;
export const _u = { Flag, Bucket, Jug, Worm, Board, BarnWall, TX, rn };
