// lch29d · componentes únicos 21-26 (el cepillo que levanta el pelo, los cuatro tornillos, las sesenta sillas, la taza de Harold, el aro del tamaño de un plato de pastel, la sombra que casi no se ve).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { ClothesBrush, Cushion, Fabric, Hand, Mug, Spot, SteamIron, Towel } from "./sofa";

const PI = Math.PI;

// ---- 14:00 · EL CEPILLO LEVANTA LOS HILOS: un mechón de terciopelo verde aplastado; el cepillo pasa y los hilos se paran uno por uno y vuelven a brillar ----
export const HBrushNap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f130f" key1={[-0.8, 1.0, 1.0]}
  cam={{ at: [0, 0.02, 0], az: [0.5, 0.3], el: [0.3, 0.36], r: [0.5, 0.44], fov: 30 }}>{(tt) => {
  const bx = lerp(-0.36, 0.22, eio(tt, 0.6, 4.4));
  return <>
    <RBox s={[0.7, 0.02, 0.36]} p={[0, -0.01, 0]} r={0.003}><meshStandardMaterial color="#1f4a2a" roughness={0.9} /></RBox>
    {/* los hilos del terciopelo: chatos a la derecha del cepillo, parados a la izquierda */}
    {Array.from({ length: 30 * 15 }, (_, i) => { const x = -0.34 + (i % 30) * 0.023 + 0.006 * rn(i, 2), z = -0.16 + Math.floor(i / 30) * 0.022 + 0.006 * rn(i, 3);
      const up = cl((bx - x) * 12 + 0.3), lean = lerp(1.25, 0.08, up) + 0.1 * rn(i, 4);
      return <mesh key={i} position={[x, 0.0, z]} rotation={[0, 0, -lean]}><cylinderGeometry args={[0.0022, 0.0034, 0.032, 5]} />
        <meshStandardMaterial color={up > 0.5 ? "#3d8a4e" : "#2a5e36"} roughness={lerp(0.85, 0.35, up)} metalness={0.05} /></mesh>; })}
    <group position={[bx + 0.04, 0.05, 0]} rotation={[0, PI / 2, 0]} scale={1.2}><ClothesBrush /></group>
  </>;
}}</Scene3D>;

// ---- 17:09 · CUATRO TORNILLOS Y EL ASIENTO SALE: silla de comedor dada vuelta; cada tornillo gira, sube y cae en la palma; el asiento acolchado se separa ----
export const HChairScrews: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#17120e" key1={[-0.5, 1.4, 1.1]}
  cam={{ at: [0.15, 0.25, 0.05], az: [0.3, 0.2], el: [0.7, 0.78], r: [1.3, 1.15], fov: 32 }}>{(tt) => {
  const C = [[-0.17, -0.17], [0.17, -0.17], [0.17, 0.17], [-0.17, 0.17]];
  const off = eio(tt, 3.6, 4.6);
  return <>
    {/* el marco de la silla, boca abajo sobre la mesa */}
    {C.map(([x, z], i) => <RBox key={i} s={[0.04, 0.42, 0.04]} p={[x * 1.15, 0.3 + 0.21, z * 1.15]} r={0.006}>{M.wood({ base: [130, 82, 44] })}</RBox>)}
    {[0, 1].map((i) => <RBox key={"r" + i} s={[i ? 0.04 : 0.44, 0.06, i ? 0.44 : 0.04]} p={[0, 0.33, 0]} rot={[0, 0, 0]} r={0.006}>{M.wood({ base: [130, 82, 44] })}</RBox>)}
    <RBox s={[0.48, 0.03, 0.48]} p={[0, 0.315, 0]} r={0.006}>{M.wood({ base: [130, 82, 44] })}</RBox>
    {/* el asiento rosa, abajo, que se separa */}
    <group position={[lerp(0, 0.55, off), lerp(0.27, 0.035, off), lerp(0, 0.2, off)]} rotation={[0, 0.3 * off, 0]}><Cushion w={0.46} d={0.46} h={0.07} /></group>
    {/* los tornillos: giran, suben y vuelan a la mano */}
    {C.map(([x, z], i) => { const a = 0.4 + i * 0.75, spin = eio(tt, a, a + 0.5), fly = eio(tt, a + 0.5, a + 0.8);
      return <group key={"s" + i} position={[lerp(x, 0.38, fly), 0.335 + 0.03 * spin + 0.12 * Math.sin(fly * PI), lerp(z, 0.22 + i * 0.012, fly)]} rotation={[0, spin * 12, fly * 1.5]}>
        <mesh><cylinderGeometry args={[0.008, 0.008, 0.012, 16]} />{M.steel({})}</mesh>
        <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.004, 0.002, 0.03, 10]} />{M.steel({})}</mesh></group>; })}
    {/* el destornillador de mango rojo, que salta de tornillo en tornillo */}
    {(() => { const j = Math.min(3, Math.floor(cl((tt - 0.4) / 0.75) * 4)); const [x, z] = C[j]; return tt < 3.6 && <group position={[x, 0.42, z]} rotation={[0, eio(tt, 0.4 + j * 0.75, 0.9 + j * 0.75) * 8, 0]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.014, 0.016, 0.1, 16]} />{M.plastic({ col: "#c22a22" })}</mesh>
      <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.004, 0.004, 0.09, 8]} />{M.chrome({})}</mesh></group>; })()}
    <group position={[0.4, 0.3, 0.24]} rotation={[0, -PI / 2, 0]}><Hand grip={0.2} /></group>
  </>;
}}</Scene3D>;

// ---- 18:14 · DIEZ SILLAS CADA SÁBADO: la fila de sillas azules del salón; una por una, la mancha se apaga y aparece una palomita en la cinta; la plancha y la toalla viajan de silla en silla ----
export const HSixtyChairs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="dark" bg="#12131a" key1={[-0.6, 1.4, 1.4]}
  cam={{ at: [0, 0.4, 0], az: [0.6, 0.5], el: [0.3, 0.34], r: [1.05, 0.95], fov: 34 }}>{(tt) => {
  const N = 10, done = cl((tt - 0.3) / 4.0) * N;
  const cur = Math.min(N - 1, Math.floor(done)), cx = -0.9 + cur * 0.24;
  const sx = -(-0.9 + cl((tt - 0.3) / 4.0) * (N - 1) * 0.24);
  return <group position={[sx, 0, 0]}>
    {Array.from({ length: N }, (_, i) => { const x = -0.9 + i * 0.24, k = cl(done - i);
      return <group key={i} position={[x, 0, 0]}>
        {[[-0.08, -0.08], [0.08, -0.08], [0.08, 0.08], [-0.08, 0.08]].map(([a, b], j) => <mesh key={j} position={[a, 0.18, b]}><cylinderGeometry args={[0.008, 0.008, 0.36, 8]} />{M.chrome({})}</mesh>)}
        <RBox s={[0.2, 0.04, 0.2]} p={[0, 0.38, 0]} r={0.015}><meshStandardMaterial color="#26386a" roughness={0.9} /></RBox>
        <RBox s={[0.2, 0.18, 0.025]} p={[0, 0.5, -0.095]} r={0.01}><meshStandardMaterial color="#26386a" roughness={0.9} /></RBox>
        <Spot r={0.04 + 0.01 * rn(i, 2)} col="#6b4a2a" op={0.85 * (1 - k)} p={[0.02 * (rn(i, 3) - 0.5), 0.401, 0.02]} />
        {/* la cinta de papel en el respaldo, con la marca hecha a mano */}
        <RBox s={[0.06, 0.025, 0.003]} p={[0, 0.55, -0.08]} r={0.001}><meshStandardMaterial color="#e6d7ae" /></RBox>
        {k > 0.95 && <mesh position={[0, 0.55, -0.078]}><planeGeometry args={[0.03, 0.018]} /><meshBasicMaterial map={tex.text("tick", 64, 40, (g) => { g.clearRect(0, 0, 64, 40); g.strokeStyle = "#2a1c10"; g.lineWidth = 6; g.beginPath(); g.moveTo(14, 20); g.lineTo(26, 32); g.lineTo(52, 8); g.stroke(); })} transparent /></mesh>}
      </group>; })}
    {tt < 4.4 && <group position={[cx, 0.43 + 0.03 * Math.abs(Math.sin(tt * 6)), 0.02]}><Towel w={0.14} d={0.1} damp={1} /><group position={[0, 0.03, 0]} scale={0.7}><SteamIron /></group></group>}
  </group>;
}}</Scene3D>;

// ---- 19:52 · HAROLD VOLCÓ LA TAZA ENTERA: la taza grande de cerámica se inclina sobre el cojín del medio; el café sale en un chorro y se abre en la tela ----
export const HCoffeeMug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#17110c" key1={[-0.6, 1.3, 1.3]}
  cam={{ at: [0, 0.3, 0.05], az: [0.35, 0.25], el: [0.32, 0.38], r: [0.95, 0.82], fov: 32 }}>{(tt) => {
  const tip = phys(tt, 0.6, 5, 0.5), pour = eio(tt, 0.9, 2.4), spread = eio(tt, 1.0, 3.6);
  return <>
    <RBox s={[1.1, 0.3, 0.6]} p={[0, 0.12, 0]} r={0.04}><meshStandardMaterial color="#5e4632" /></RBox>
    {[-0.36, 0, 0.36].map((x, i) => <Cushion key={i} w={0.35} d={0.55} h={0.1} p={[x, 0.32, 0.02]} />)}
    <RBox s={[1.1, 0.4, 0.15]} p={[0, 0.55, -0.27]} r={0.06}><Fabric rep={2} /></RBox>
    <Spot r={lerp(0.01, 0.15, spread)} col="#3e2412" op={0.9} p={[0.02, 0.371, 0.06]} />
    <mesh position={[0.02, 0.373, 0.06]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[lerp(0.01, 0.11, spread), 40]} />{M.water({ col: "#3e2412", op: 0.7 * (1 - eio(tt, 3.5, 4.6)) })}</mesh>
    <group position={[-0.08, 0.37, 0.04]} rotation={[0, 0.3, -cl(tip) * 1.35]}><group position={[0, 0.0, 0]}><Mug fill={lerp(0.85, 0.1, pour)} /></group></group>
    {/* el chorro: gotas que caen de la boca de la taza */}
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 2.2 + i / 16) % 1; return pour > 0.05 && pour < 0.98 && <mesh key={i} position={[lerp(0.0, 0.03, ph), 0.44 - 0.07 * ph, 0.05]}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ col: "#3e2412", op: 0.9 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 20:08 · UN ARO DEL TAMAÑO DE UN PLATO DE PASTEL: el molde de pastel de vidrio baja y calza justo arriba del aro marrón del cojín ----
export const HPiePlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15100c" key1={[-0.7, 1.4, 1.1]}
  cam={{ at: [0, 0.03, 0], az: [0.3, 0.15], el: [0.62, 0.75], r: [0.85, 0.75], fov: 30 }}>{(tt) => {
  const d = cl(phys(tt, 0.8, 6, 0.5)), lift = eio(tt, 3.4, 4.4);
  return <>
    <Cushion w={0.62} d={0.6} h={0.1} p={[0, -0.05, 0]} />
    <Spot r={0.13} col="#7a5230" op={0.85 * 0.45} p={[0, 0.0012, 0]} />
    <mesh position={[0, 0.0018, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.112, 0.132, 72]} /><meshBasicMaterial color="#4e2e12" transparent opacity={0.85} depthWrite={false} /></mesh>
    {/* el molde de vidrio con borde ondulado */}
    <group position={[0.12 * lift, 0.005 + 0.35 * (1 - d) + 0.04 * Math.sin(lift * Math.PI), 0.05 * lift]} rotation={[0, tt * 0.1, 0]}>
      <mesh><cylinderGeometry args={[0.14, 0.11, 0.035, 48, 1, true]} />{M.glass({ op: 0.55, col: "#e8b878" })}</mesh>
    </group>
    {/* el aro calza: brilla un instante el borde */}
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.135, 0.145, 64]} />{M.glow({ col: "#ffd9a0", op: 0.5 * Math.sin(cl((tt - 1.4) / 1.4) * PI) })}</mesh>
  </>;
}}</Scene3D>;

// ---- 21:14 · UNA SOMBRA QUE SÓLO VES SI LA BUSCÁS: la toalla sale por última vez casi blanca; el aro se apaga hasta un fantasma; los anteojos de Loretta se acercan a mirarlo ----
export const HFaintShadow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16110d" key1={[-0.7, 1.4, 1.1]}
  cam={{ at: [0, 0.03, 0], az: [0.2, 0.35], el: [0.85, 0.6], r: [0.8, 0.55], fov: 30 }}>{(tt) => {
  const fade = eio(tt, 0.4, 3.0), lift = eio(tt, 0.3, 1.4), glass = eio(tt, 2.6, 4.2);
  return <>
    <Cushion w={0.62} d={0.6} h={0.1} p={[0, -0.05, 0]} />
    <Spot r={0.13} col="#7a5230" op={lerp(0.85, 0.1, fade) * 0.45} p={[0, 0.0012, 0]} />
    <mesh position={[0, 0.0018, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.112, 0.132, 72]} /><meshBasicMaterial color="#4e2e12" transparent opacity={lerp(0.85, 0.1, fade)} depthWrite={false} /></mesh>
    {/* la última toalla, que se va casi limpia */}
    <group position={[lerp(0, 0.4, lift), 0.01 + 0.2 * lift, lerp(0, -0.1, lift)]} rotation={[lift * 0.6, 0, -lift * 0.5]}><Towel w={0.32} d={0.24} marks={[{ x: 0, z: 0, r: 0.12, k: 0.12, col: "#8a6a44" }]} /></group>
    {/* los anteojos de alambre que se acercan */}
    {glass > 0 && <group position={[0, lerp(0.22, 0.1, glass), lerp(0.12, 0.05, glass)]} rotation={[-0.9, 0, 0]}>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.05, 0, 0]}>
        <mesh><torusGeometry args={[0.035, 0.0025, 10, 40]} />{M.brass({ col: "#c9b48a" })}</mesh>
        <mesh><circleGeometry args={[0.035, 32]} />{M.glass({ op: 0.12 })}</mesh></group>)}
      <mesh position={[0, 0.01, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.012, 0.002, 8, 16, PI]} />{M.brass({ col: "#c9b48a" })}</mesh>
    </group>}
  </>;
}}</Scene3D>;
void rn; void Fabric;
