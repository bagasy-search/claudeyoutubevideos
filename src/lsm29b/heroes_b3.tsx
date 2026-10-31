// lsm29b · componentes únicos 13-18 (el halago, gente de cocina y gente de porche, el pan de las cuatro, la lista de oración, los domingos que se apagan, de a dos).
import React from "react";
import * as THREE from "three";
import { AMB, H, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Steam, Table, Teacup, paperTex } from "./tg";
import { House, Mug, Peg, Porch, Sky, listTex } from "./pg";

const PI = Math.PI;

// moño de premio (escarapela con dos colas)
const Rosette: React.FC<{ p?: [number, number, number]; rot?: [number, number, number]; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#2f5fa8" }) => <group position={p} rotation={rot} scale={s}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.006, 24]} /><meshStandardMaterial color={col} roughness={0.5} /></mesh>
  <mesh position={[0, 0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.042, 0.008, 8, 24]} /><meshStandardMaterial color={col} roughness={0.5} /></mesh>
  <mesh position={[0, 0.005, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.004, 20]} />{M.brass()}</mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.018, 0, -0.07]} rotation={[-PI / 2, 0, k * 0.2]}><planeGeometry args={[0.024, 0.08]} /><meshStandardMaterial color={col} roughness={0.5} side={THREE.DoubleSide} /></mesh>)}
</group>;

// ---- 9:12 · EL HALAGO: a la izquierda, un solo moño azul chiquito y cierto; a la derecha llueven moños dorados sin parar ----
export const HRibbons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0, 0.82, 0], at1: [0.05, 0.84, 0], az: [0.05, -0.08], el: [0.42, 0.34], r: [1.15, 1.02], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.9} x={960} y={1010} txt="ONE TRUE · NINE GOLD" col={AMB} size={42} />}>{(tt) => {
  const one = phys(tt, 0.5, 7, 0.5);
  return <>
    <group position={[0, 0.76, 0]}><Table w={1.3} d={0.8} /></group>
    {/* la izquierda: un moño, en su lugar */}
    <group position={[-0.2, 0.77 + (1 - cl(one)) * 0.25, 0.0]}><Rosette rot={[-PI / 2 + 0.2, 0, 0]} s={1.3} col="#2f5fa8" /></group>
    <mesh position={[-0.2, 0.762, 0.0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.09, 32]} />{M.glow({ col: "#ffe2a0", op: 0.22 * cl(one) })}</mesh>
    {/* la derecha: todo, grande, rápido y temprano */}
    {Array.from({ length: 9 }, (_, i) => { const a = 0.9 + i * 0.3, k = phys(tt, a, 8, 0.45); return tt > a && <group key={i} position={[0.04 + (i % 3) * 0.13, 0.772 + (1 - cl(k)) * 0.7, -0.13 + Math.floor(i / 3) * 0.14]}>
      <Rosette rot={[-PI / 2 + 0.25, 0, (rn(i, 6) - 0.5) * 0.3]} s={1.1} col={i % 2 ? "#d6b04a" : "#c9952e"} />
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 9:50 · GENTE DE COCINA Y GENTE DE PORCHE: la casa en corte; los muñequitos entran a la mesa o se quedan en la silla de afuera ----
const WHO = [{ in: true, a: 0.6 }, { in: false, a: 1.2 }, { in: true, a: 1.8 }, { in: false, a: 2.4 }, { in: true, a: 3.0 }, { in: false, a: 3.6 }];
export const HKitchenporch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#2b3550" warm={1.1}
  cam={{ at: [0, 0.15, 0], at1: [0.05, 0.12, 0.05], az: [0.55, 0.2], el: [0.75, 0.62], r: [1.7, 1.35], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="KITCHEN · PORCH" col={AMB} size={42} />}>{(tt) => <>
    <Sky />
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.003, 0]} receiveShadow><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#6d7f4a" roughness={0.95} /></mesh>
    <hemisphereLight args={["#fff4e0", "#4a5a30", 0.6]} />
    {/* la cocina (adentro): piso de linóleo a cuadros, pared con alacena, mesa con tazones */}
    <mesh rotation={[-PI / 2, 0, 0]} position={[-0.35, 0, 0]} receiveShadow><planeGeometry args={[0.8, 0.9]} /><meshStandardMaterial map={tex.tile(6, 6, "#d9cfb8", "#a8402f")} roughness={0.5} /></mesh>
    <RBox s={[0.8, 0.5, 0.04]} r={0.004} p={[-0.35, 0.25, -0.45]}><meshStandardMaterial color="#e9dfb8" roughness={0.85} /></RBox>
    <RBox s={[0.04, 0.5, 0.9]} r={0.004} p={[0.05, 0.25, 0]}><meshStandardMaterial color="#e9dfb8" roughness={0.85} /></RBox>
    {/* la puerta mosquitero entre los dos */}
    <RBox s={[0.045, 0.3, 0.16]} r={0.003} p={[0.05, 0.15, 0.12]}><meshStandardMaterial color="#2a2a2a" transparent opacity={0.55} roughness={0.9} /></RBox>
    <group position={[-0.38, 0.12, -0.05]}>
      <RBox s={[0.3, 0.015, 0.22]} r={0.004}>{M.wood({ base: [170, 120, 70] })}</RBox>
      {[-1, 1].map((kx) => [-1, 1].map((kz) => <RBox key={kx + "" + kz} s={[0.012, 0.12, 0.012]} r={0.002} p={[kx * 0.13, -0.06, kz * 0.09]}>{M.wood({ base: [140, 96, 56] })}</RBox>))}
      {[[-0.09, -0.05], [0.09, -0.05], [-0.09, 0.06], [0.09, 0.06]].map(([x, z], i) => <group key={i} position={[x, 0.008, z]} scale={0.4}><Mug col={["#e8dcc0", "#9fb6c9", "#d9b48a", "#c9d6b0"][i]} /></group>)}
    </group>
    {/* el porche (afuera): tablas grises, la silla con la taza y el platito */}
    <group position={[0.42, 0, 0]} scale={0.5}><Porch w={1.4} d={1.8} rail={false} yard={false} /></group>
    <group position={[0.42, 0.015, -0.1]}>
      <RBox s={[0.12, 0.012, 0.12]} r={0.003} p={[0, 0.09, 0]}>{M.matte({ col: "#f2efe7" })}</RBox>
      <RBox s={[0.12, 0.12, 0.012]} r={0.003} p={[0, 0.15, -0.055]}>{M.matte({ col: "#f2efe7" })}</RBox>
      {[-1, 1].map((kx) => [-1, 1].map((kz) => <RBox key={kx + "" + kz} s={[0.01, 0.09, 0.01]} r={0.002} p={[kx * 0.05, 0.045, kz * 0.05]}>{M.matte({ col: "#f2efe7" })}</RBox>))}
      <group position={[0.12, 0, 0.05]} scale={0.45}><Teacup /></group>
    </group>
    {/* los muñequitos llegan por el camino: unos pasan la puerta, otros se quedan afuera */}
    {WHO.map((w, i) => { const k = eio(tt, w.a, w.a + 0.9); if (tt < w.a - 0.05) return null; const n = WHO.slice(0, i).filter((x) => x.in === w.in).length;
      const end: [number, number] = w.in ? [-0.38 + (n - 1) * 0.12, 0.13] : [0.3 + n * 0.1, 0.12];
      const mid: [number, number] = [0.42, 0.42];
      const u = k < 0.5 ? k * 2 : (k - 0.5) * 2, p = k < 0.5 ? [lerp(0.42, mid[0], u), lerp(0.7, mid[1], u)] : [lerp(mid[0], end[0], u), lerp(mid[1], end[1], u)];
      return <Peg key={i} p={[p[0], 0.015 + 0.012 * Math.abs(Math.sin(k * PI * 4)), p[1]]} s={2.0} col={["#b8322a", "#2f5fa8", "#6a8a4a", "#c9952e", "#7a4a8a", "#3a7a7a"][i]} />; })}
    <pointLight position={[-0.35, 0.45, 0]} intensity={1.8} distance={1.2} color="#ffd29a" />
  </>}</Scene3D>;

// ---- 10:19 · EL PAN DE LAS CUATRO: la perilla del reloj del horno gira hasta las cuatro, suena y el pan sale dorado ----
export const HBreadfour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="wood" warm={0.42} key1={[-1.4, 2.0, 1.6]}
  cam={{ at: [0, 0.62, -0.15], at1: [0.0, 0.52, -0.05], az: [0.15, -0.1], el: [0.2, 0.3], r: [1.4, 1.15], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="THE BREAD OUT AT FOUR" col={AMB} size={40} />}>{(tt) => {
  const dial = eio(tt, 0.2, 1.6), ding = tt > 1.6 ? Math.exp(-(tt - 1.6) * 3) : 0, door = eio(tt, 1.8, 2.6), pull = eio(tt, 2.6, 3.8), rise = 0.6 + 0.4 * eio(tt, 0, 2.6);
  return <>
    {/* la cocina económica blanca esmaltada */}
    <group position={[0, 0, -0.4]}>
      <RBox s={[0.9, 0.8, 0.6]} r={0.03} p={[0, 0.4, 0]}><meshPhysicalMaterial color="#b9b2a2" roughness={0.45} clearcoat={0.5} /></RBox>
      <RBox s={[0.9, 0.22, 0.06]} r={0.02} p={[0, 0.91, -0.27]}><meshStandardMaterial color="#c8c2b4" roughness={0.55} /></RBox>
      {/* el reloj del horno con su perilla */}
      <group position={[0.0, 0.7, 0.305]} scale={1.9}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.012, 32]} /><meshStandardMaterial map={tex.text("odial", 256, 256, (g) => { g.fillStyle = "#f6f1e2"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#2a2420"; g.font = "800 26px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 1; i <= 12; i++) { const a = (i / 12) * PI * 2 - PI / 2; g.fillText(String(i), 128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92); } })} roughness={0.5} /></mesh>
        <group position={[0, 0, 0.008]} rotation={[0, 0, -lerp(0, (4 / 12) * PI * 2, dial) + 0.04 * ding * Math.sin(tt * 40)]}><RBox s={[0.008, 0.05, 0.004]} r={0.002} p={[0, 0.025, 0]}><meshStandardMaterial color="#b8322a" /></RBox></group>
        <mesh position={[0, 0, 0.012]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.012, 16]} />{M.chrome()}</mesh>
      </group>
      {/* la puerta del horno baja y sale el calor */}
      <group position={[0, 0.12, 0.3]} rotation={[PI / 2 * 0.9 * door, 0, 0]}>
        <RBox s={[0.62, 0.42, 0.03]} r={0.012} p={[0, 0.21, 0]}><meshPhysicalMaterial color="#aea796" roughness={0.45} clearcoat={0.5} /></RBox>
        <mesh position={[0, 0.22, 0.016]}><planeGeometry args={[0.36, 0.2]} />{M.glass({ op: 0.6, col: "#1c1410" })}</mesh>
        <RBox s={[0.4, 0.02, 0.03]} r={0.008} p={[0, 0.38, 0.03]}>{M.chrome()}</RBox>
      </group>
      <mesh position={[0, 0.34, 0.29]}><planeGeometry args={[0.6, 0.4]} /><meshStandardMaterial color="#1a0f08" emissive="#a8501e" emissiveIntensity={0.18 * door} /></mesh>
    </group>
    <pointLight position={[0, 0.3, -0.1]} intensity={0.3 + 0.25 * door} distance={1.0} color="#ff9a4a" />
    {/* el pan en su molde: crece y sale */}
    <group position={[0, lerp(0.3, 0.3, pull), lerp(-0.42, 0.12, pull)]}>
      {/* la bandeja que sale del horno */}
      <RBox s={[0.46, 0.012, 0.3]} r={0.004} p={[0, -0.004, 0]}>{M.steel({ col: "#8a8a86" })}</RBox>
      <RBox s={[0.26, 0.08, 0.13]} r={0.01} p={[0, 0.04, 0]}>{M.steel({ col: "#9a9a96" })}</RBox>
      <RBox s={[0.25, 0.09 * rise, 0.125]} r={0.04} p={[0, 0.08 + 0.045 * rise, 0]}><meshPhysicalMaterial color={new THREE.Color("#ecd3a0").lerp(new THREE.Color("#a8662a"), eio(tt, 0.4, 2.4))} roughness={0.5} clearcoat={0.35} /></RBox>
      {[-0.07, 0, 0.07].map((dx) => <mesh key={"cut" + dx} position={[dx, 0.08 + 0.09 * rise + 0.001, 0]} rotation={[-PI / 2, 0, 0.5]}><planeGeometry args={[0.012, 0.09]} /><meshStandardMaterial color="#e8c890" roughness={0.7} /></mesh>)}
    </group>
    <Steam p={[0, 0.42, 0.12]} tt={tt} on={0.8 * pull} n={22} w={0.12} hgt={0.3} sz={2.0} />
  </>;
}}</Scene3D>;

// ---- 10:34 · LA LISTA DE ORACIÓN: la lámpara de la mesa de luz se enciende y en la libreta aparecen los nombres, uno por renglón ----
const NAMES = ["Edith", "Lyle", "Vern", "the Bible man", "Carol", "Bev"];
export const HPrayerlist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.35} bg="#0b0a09" key1={[-0.6, 1.8, 1.2]}
  cam={{ at: [0, 0.7, 0], at1: [0.02, 0.68, 0.02], az: [0.45, 0.15], el: [0.62, 0.55], r: [1.05, 0.88], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={150} txt="BY NAME, EVERY NIGHT" col={AMB} size={40} />}>{(tt) => {
  const lamp = eio(tt, 0.2, 0.9), n = NAMES.filter((_, i) => tt > 1.0 + i * 0.55).length;
  return <>
    {/* la mesa de luz */}
    <RBox s={[0.5, 0.58, 0.4]} r={0.012} p={[0, 0.29, 0]}>{M.wood({ base: [120, 80, 46] })}</RBox>
    <RBox s={[0.38, 0.12, 0.02]} r={0.006} p={[0, 0.42, 0.205]}>{M.wood({ base: [134, 90, 52] })}</RBox>
    <mesh position={[0, 0.42, 0.217]}><sphereGeometry args={[0.012, 12, 10]} />{M.brass()}</mesh>
    {/* la lámpara */}
    <group position={[-0.15, 0.58, -0.08]}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.05, 0.06, 0.04, 24]} />{M.brass()}</mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.008, 0.008, 0.18, 10]} />{M.brass()}</mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.06, 0.1, 0.12, 28, 1, true]} /><meshStandardMaterial color="#f1e2c0" emissive="#ffcf8a" emissiveIntensity={0.9 * lamp} side={THREE.DoubleSide} roughness={0.9} /></mesh>
    </group>
    <pointLight position={[-0.15, 0.8, -0.08]} intensity={2.2 * lamp} distance={1.6} decay={2} color="#ffcf8a" castShadow />
    {/* la libreta de oración: los nombres en lápiz */}
    <mesh position={[0.06, 0.582, 0.04]} rotation={[-PI / 2, 0, -0.12]} receiveShadow><planeGeometry args={[0.2, 0.26]} /><meshStandardMaterial map={listTex("pray", NAMES, n, { ink: "#2a2a30" })} roughness={0.85} /></mesh>
    <group position={[0.15, 0.59, 0.12]} rotation={[PI / 2, 0, 0.9]}><mesh><cylinderGeometry args={[0.004, 0.004, 0.12, 6]} /><meshStandardMaterial color="#e8b92c" roughness={0.5} /></mesh></group>
    {/* la Biblia y los anteojos */}
    <RBox s={[0.13, 0.04, 0.18]} r={0.006} p={[-0.1, 0.6, 0.1]} rot={[0, 0.3, 0]}><meshStandardMaterial color="#1c1612" roughness={0.6} /></RBox>
    {[-1, 1].map((k) => <mesh key={k} position={[-0.08 + k * 0.022, 0.625, 0.1]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.016, 0.0015, 6, 20]} />{M.steel()}</mesh>)}
    {/* la colcha de la cama al costado */}
    <mesh position={[0.62, 0.45, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.6, 0.12, 1.2]} /><meshStandardMaterial map={tex.text("quilt", 256, 256, (g) => { const c = ["#c9604a", "#e8dcc0", "#5a7aa0", "#d9b45a"]; for (let r = 0; r < 8; r++) for (let q = 0; q < 8; q++) { g.fillStyle = c[(r * 3 + q) % 4]; g.fillRect(q * 32, r * 32, 32, 32); } })} roughness={0.95} /></mesh>
  </>;
}}</Scene3D>;

// ---- 11:08 · LOS DOMINGOS QUE SE APAGAN: el almanaque del cuarto de Cedar Falls; los domingos con tilde hasta que dejan de tenerla ----
export const HSundays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" warm={0.75}
  cam={{ at: [0, 1.1, -1.5], at1: [0.02, 1.1, -1.5], az: [-0.1, 0.06], el: [0.05, 0.02], r: [1.2, 1.08], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="BY CHRISTMAS, I'D STOPPED" col={AMB} size={40} />}>{(tt) => {
  const SUN = 16, shown = Math.min(SUN, Math.floor(tt / 0.1) + 1);
  return <>
    <RBox s={[0.7, 0.5, 0.02]} r={0.006} p={[0, 1.1, -1.58]}>{M.matte({ col: "#f3efe4" })}</RBox>
    <mesh position={[0, 1.31, -1.568]}><planeGeometry args={[0.66, 0.06]} /><meshStandardMaterial map={paperTex("fall62", ["SEPT · OCT · NOV · DEC  1962"], { w: 640, h: 64, ink: "#7a2a22", font: "900" })} roughness={0.8} /></mesh>
    {Array.from({ length: SUN }, (_, i) => { const r = Math.floor(i / 4), c = i % 4, x = -0.24 + c * 0.16, y = 1.2 - r * 0.1, a = 1.6 + Math.max(0, i - 5) * 0.22, grey = i < 6 ? 0 : eio(tt, a, a + 0.3), went = cl((tt - i * 0.1) / 0.2) * (i < 9 ? 1 - 0.45 * grey : 1 - grey), on = i < shown;
      return on && <group key={i} position={[x, y, -1.566]}>
        <mesh><planeGeometry args={[0.14, 0.085]} /><meshStandardMaterial color="#fbf6ea" roughness={0.85} /></mesh>
        <mesh position={[-0.05, 0.025, 0.001]}><planeGeometry args={[0.03, 0.02]} /><meshStandardMaterial map={paperTex("d" + i, [String(2 + ((i * 7) % 28))], { w: 64, h: 48, ink: "#7a2a22", font: "800" })} roughness={0.8} /></mesh>
        {/* el domingo que ya no fue: círculo gris tachado */}
        {i >= 9 && <group visible={grey > 0.6} position={[0.012, -0.004, 0.002]}><mesh><ringGeometry args={[0.022, 0.028, 32]} /><meshBasicMaterial color="#8a8f98" transparent opacity={cl((grey - 0.6) / 0.4)} /></mesh><mesh rotation={[0, 0, 0.8]}><planeGeometry args={[0.058, 0.005]} /><meshBasicMaterial color="#8a8f98" transparent opacity={cl((grey - 0.6) / 0.4)} /></mesh></group>}
        {/* la tilde azul de la pluma: fuerte al principio, después a medias, después nada */}
        {went > 0.01 && <group position={[0.01, -0.005, 0.002]} rotation={[0, 0, 0]}>
          <mesh position={[-0.012, -0.004, 0]} rotation={[0, 0, -0.8]}><planeGeometry args={[0.026, 0.011]} /><meshBasicMaterial color={new THREE.Color("#1d3f8f").lerp(new THREE.Color("#a8acb4"), grey)} transparent opacity={went} /></mesh>
          <mesh position={[0.012, 0.006, 0]} rotation={[0, 0, 0.9]}><planeGeometry args={[0.05, 0.011]} /><meshBasicMaterial color={new THREE.Color("#1d3f8f").lerp(new THREE.Color("#a8acb4"), grey)} transparent opacity={went} /></mesh>
        </group>}
      </group>; })}
    {/* la Biblia blanca que queda en el fondo de la valija */}
    <group position={[0.42, 0.88, -1.4]} rotation={[0.1, -0.4, 0]}><RBox s={[0.1, 0.14, 0.03]} r={0.006}><meshStandardMaterial color={new THREE.Color("#f6f2e8").lerp(new THREE.Color("#a8a49a"), eio(tt, 2.5, 4.5))} roughness={0.6} /></RBox></group>
  </>;
}}</Scene3D>;

// ---- 12:50 · DE A DOS: en la nieve del camino aparecen huellas de a pares que llegan a la iglesia con las ventanas prendidas ----
export const HTwobytwo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#10141a" warm={0.55} key1={[-1.2, 2.6, 1.4]}
  cam={{ at: [0, 0.1, -0.4], at1: [0.0, 0.18, -0.9], az: [0.25, 0.0], el: [0.4, 0.22], r: [1.7, 1.1], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="TWO BY TWO" col={AMB} size={44} />}>{(tt) => {
  const STEPS = 13, lit = eio(tt, 3.6, 4.3);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4, 4]} /><meshStandardMaterial color="#e9eef3" roughness={0.9} /></mesh>
    {/* la iglesita blanca al final del camino */}
    <group position={[0, 0, -1.4]}><House s={2.4} lit={0.04 + 0.2 * lit} col="#f4f4f2" />
      {/* las ventanas amarillas del frente y del costado, y la puerta de madera */}
      {[-0.13, 0.13].map((x) => <group key={"vw" + x} position={[x, 0.2, 0.171]}><mesh><planeGeometry args={[0.06, 0.09]} /><meshStandardMaterial color="#e8b860" emissive="#ffb850" emissiveIntensity={0.15 + 0.5 * lit} roughness={0.5} /></mesh><mesh position={[0, 0.045, 0]}><circleGeometry args={[0.03, 16, 0, PI]} /><meshStandardMaterial color="#e8b860" emissive="#ffb850" emissiveIntensity={0.15 + 0.5 * lit} roughness={0.5} /></mesh></group>)}
      {[-0.03, 0.06].map((z) => <mesh key={"sw" + z} position={[0.2415, 0.2, z]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.05, 0.1]} /><meshStandardMaterial color="#e8b860" emissive="#ffb850" emissiveIntensity={0.15 + 0.5 * lit} roughness={0.5} /></mesh>)}
      <mesh position={[0, 0.09, 0.172]}><planeGeometry args={[0.085, 0.17]} /><meshStandardMaterial color="#5a3a26" roughness={0.8} /></mesh>
      {/* la cruz arriba del campanario */}
      <RBox s={[0.014, 0.12, 0.014]} r={0.002} p={[0, 0.87, 0.05]}>{M.brass()}</RBox>
      <RBox s={[0.07, 0.014, 0.014]} r={0.002} p={[0, 0.89, 0.05]}>{M.brass()}</RBox>
      {/* los escalones de la entrada */}
      {[0, 1].map((k) => <RBox key={"es" + k} s={[0.26, 0.03, 0.08]} r={0.004} p={[0, 0.015 + k * 0.03, 0.27 - k * 0.06]}>{M.matte({ col: "#d8dcdf" })}</RBox>)}
      <RBox s={[0.12, 0.3, 0.12]} r={0.004} p={[0, 0.5, 0.05]}>{M.matte({ col: "#f4f4f2" })}</RBox>
      <mesh position={[0, 0.72, 0.05]}><coneGeometry args={[0.09, 0.18, 4]} /><meshStandardMaterial color="#5b3a2c" roughness={0.8} /></mesh>
    </group>
    <pointLight position={[0, 0.25, -0.95]} intensity={0.1 + 0.35 * lit} distance={1.0} color="#ffc070" />
    {/* las huellas: dos personas, una al lado de la otra */}
    {Array.from({ length: STEPS }, (_, i) => { const a = 0.3 + i * 0.25; if (tt < a) return null; const z = 0.5 - i * 0.14, s = i % 2 ? 1 : -1, o = cl((tt - a) / 0.2);
      return [-0.09, 0.09].map((cx, j) => <mesh key={i + "-" + j} rotation={[-PI / 2, 0, 0]} position={[cx + s * 0.025, 0.002, z + j * 0.02]} scale={[1, 1.7, 1]}><circleGeometry args={[0.026, 16]} /><meshStandardMaterial color="#3a4658" roughness={0.9} transparent opacity={o} /></mesh>); })}
    {/* copos */}
    {Array.from({ length: 70 }, (_, i) => { const y = 1.2 - ((tt * 0.12 + rn(i, 2)) % 1) * 1.2; return <mesh key={"f" + i} position={[(rn(i, 3) - 0.5) * 2.4, y, (rn(i, 4) - 0.5) * 2.4 - 0.3]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>; })}
  </>;
}}</Scene3D>;
