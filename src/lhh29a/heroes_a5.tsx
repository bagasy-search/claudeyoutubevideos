// lhh29a · componentes únicos 33-40 (kit h3d): la paja que enfría la tierra, la rutina del domingo en cinco estaciones, la fila de 24 tomateras,
// las tres hojas a contraluz, el sótano con 96 frascos, la cola negra del tomate, los anteojos con el café y el limón del próximo video.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";

const PI = Math.PI;
const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const SERIF = "Georgia, 'Times New Roman', serif";

// ---- 21:49 · LA PAJA ENFRÍA LA TIERRA: el cantero partido en dos bajo el sol; a la derecha se acuesta la paja en gavillas prolijas y la aguja de SU termómetro de dial baja; el de la tierra desnuda sigue arriba ----
const dialTex = () => tex.text("soilDial", 256, 256, (g) => {
  g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
  const grd = g.createLinearGradient(30, 0, 226, 0); grd.addColorStop(0, "#3a8cff"); grd.addColorStop(0.5, "#f2c14a"); grd.addColorStop(1, "#e2412a");
  g.strokeStyle = grd; g.lineWidth = 22; g.beginPath(); g.arc(128, 128, 96, PI * 0.8, PI * 2.2); g.stroke();
  g.strokeStyle = "#2a1f14"; for (let i = 0; i <= 10; i++) { const a = PI * 0.8 + (i / 10) * PI * 1.4; g.lineWidth = i % 5 ? 3 : 6; g.beginPath(); g.moveTo(128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70); g.lineTo(128 + Math.cos(a) * 84, 128 + Math.sin(a) * 84); g.stroke(); }
});
const SoilDial: React.FC<{ v: number; p: [number, number, number] }> = ({ v, p }) => <group position={p} scale={1.5}>
  <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.004, 0.003, 0.2, 10]} />{M.steel()}</mesh>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.02, 40]} />{M.chrome()}</mesh>
  <mesh position={[0, 0, 0.0105]}><circleGeometry args={[0.054, 40]} /><meshStandardMaterial map={dialTex()} roughness={0.6} /></mesh>
  <mesh position={[0, 0, 0.012]}><circleGeometry args={[0.055, 40]} />{M.glass({ op: 0.15 })}</mesh>
  <group position={[0, 0, 0.013]} rotation={[0, 0, -(PI * 0.8 + v * PI * 1.4) + PI / 2 - PI]}><mesh position={[0, 0.02, 0]}><boxGeometry args={[0.004, 0.044, 0.002]} /><meshStandardMaterial color="#1a1a1a" /></mesh></group>
  <mesh position={[0, 0, 0.015]}><cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />{M.brass()}</mesh>
</group>;
export const HStraw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark"
  cam={{ at: [0, 0.12, 0], az: [0.25, 0.05], el: [0.22, 0.26], r: [0.98, 0.88], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="STRAW KEEPS THE SOIL COOL" col={AMB} />}>{(tt) => {
  const cool = eio(tt, 2.8, 5.0);
  return <>
    <RBox s={[0.62, 0.16, 0.3]} p={[0, 0, 0]} r={0.01}><meshStandardMaterial color="#5a3b24" roughness={1} /></RBox>
    <RBox s={[0.622, 0.04, 0.302]} p={[0, -0.05, 0]} r={0.008}><meshStandardMaterial color="#3e2716" roughness={1} /></RBox>
    {/* tabla que divide el cantero */}
    <RBox s={[0.012, 0.2, 0.31]} p={[0, 0.03, 0]} r={0.003}>{M.wood({ base: [160, 118, 72], rx: 1, ry: 1 })}</RBox>
    {/* tierra desnuda a la izquierda: grietas secas y aire caliente que sube */}
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.27 + i * 0.04, 0.0805, -0.1 + rn(i, 3) * 0.2]} rotation={[-PI / 2, 0, rn(i, 4) * 3]}><planeGeometry args={[0.06, 0.004]} /><meshBasicMaterial color="#2a180c" /></mesh>)}
    {Array.from({ length: 4 }, (_, i) => { const d = (tt * 0.35 + i * 0.25) % 1; return <mesh key={"h" + i} position={[-0.2 + i * 0.05, 0.1 + d * 0.2, 0.0]} rotation={[0, 0, Math.sin(tt * 3 + i) * 0.5]}><torusGeometry args={[0.025, 0.0018, 6, 20, PI]} />{M.glow({ col: "#ff8a4a", op: 0.45 * (1 - d) })}</mesh>; })}
    {/* gavillas de paja que llegan en arco y se acuestan paralelas a la derecha */}
    {Array.from({ length: 6 }, (_, b) => { const k = phys(tt, 0.9 + b * 0.3, 7, 0.45), z = -0.12 + b * 0.048;
      return <group key={b} position={[0.155 + (1 - cl(k)) * 0.25, 0.088 + (1 - cl(k)) * 0.25 * Math.sin(cl(k) * PI + PI), z]} rotation={[0, 0.05 * rn(b, 2), (1 - cl(k)) * 0.8]}>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(b * 20 + i, 3) - 0.5) * 0.02, (rn(b * 20 + i, 4)) * 0.012, (rn(b * 20 + i, 5) - 0.5) * 0.036]} rotation={[0, 0, PI / 2 + (rn(b * 20 + i, 6) - 0.5) * 0.12]}><cylinderGeometry args={[0.0022, 0.0022, 0.27, 5]} /><meshStandardMaterial color={rn(b * 20 + i, 7) > 0.5 ? "#e3c36a" : "#cfa94e"} roughness={0.8} /></mesh>)}
      </group>; })}
    {/* dos termómetros de dial: el de la paja baja, el de la tierra desnuda no */}
    <SoilDial v={0.88} p={[-0.16, 0.2, 0.14]} />
    <SoilDial v={0.88 - 0.6 * cool} p={[0.16, 0.2, 0.14]} />
    <directionalLight position={[0.3, 1, 0.4]} color="#ffd59a" intensity={0.9} />
  </>;
}}</Scene3D>;

// ---- 22:36 · LA RUTINA DEL DOMINGO EN UNA: cinco objetos llegan volando en arco a su lugar en la mesa, uno tras otro, y un hilo de luz los une: palangana, fuente, toalla, rosal, broche ----
export const HRoutine5: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [-0.08, 0.07, 0], at1: [0.08, 0.07, 0], az: [-0.25, 0.2], el: [0.3, 0.26], r: [0.95, 0.88], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="SUNDAY · AFTER SUPPER" col={AMB} />}>{(tt, u) => {
  const X = (i: number) => -0.4 + i * 0.2, path = cl((tt - 0.8) / 4.2), sw = eio(u, 0.68, 0.98);
  return <>
    {[0, 1, 2, 3, 4].map((i) => { const a = 0.5 + i * 0.85, k = cl((tt - a) / 0.7), e = 1 - Math.pow(1 - k, 3), land = phys(tt, a + 0.7, 9, 0.35);
      const fx = lerp(X(i) + (i % 2 ? 0.5 : -0.5), X(i), e), fy = 0.35 * Math.sin(e * PI) + (k < 1 ? 0 : 0.012 * (1 - cl(land)) * Math.sin(tt * 30)), sp = (1 - e) * 4 * (i % 2 ? -1 : 1);
      return <group key={i}>
        <mesh position={[X(i), 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.085, 40]} />{M.glow({ col: AMB, op: 0.08 + 0.3 * (k >= 1 ? 1 : 0) })}</mesh>
        {k > 0 && <group position={[fx, fy, 0]} rotation={[sp * 0.3, sp, 0]} scale={1.6}>
          {i === 0 && <><mesh geometry={lathe([[0, 0], [0.05, 0], [0.07, 0.03], [0.075, 0.032], [0.07, 0.034], [0.048, 0.004], [0, 0.004]])}>{M.porcelain({ side: THREE.DoubleSide })}</mesh><mesh position={[0, 0.033, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.073, 0.003, 8, 32]} /><meshStandardMaterial color="#2f5fa8" /></mesh><mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.064, 0.05, 0.002, 32]} />{M.water({ op: 0.6 })}</mesh></>}
          {i === 1 && <><RBox s={[0.12, 0.04, 0.085]} p={[0, 0.02, 0]} r={0.012}>{M.steel({ col: "#d8dde2" })}</RBox><mesh position={[0, 0.036, 0]}><boxGeometry args={[0.1, 0.003, 0.065]} />{M.water({ op: 0.6 })}</mesh>{Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[-0.03 + j * 0.015, 0.04, 0.01 * Math.sin(j * 2)]}><sphereGeometry args={[0.008, 10, 8]} /><meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0} transparent opacity={0.6} /></mesh>)}</>}
          {i === 2 && <>{[0, 1, 2].map((j) => <RBox key={j} s={[0.11, 0.012, 0.075]} p={[0, 0.006 + j * 0.012, 0]} r={0.005}><meshStandardMaterial color={["#f0e2c8", "#d9e6f2", "#f0e2c8"][j]} roughness={0.95} /></RBox>)}</>}
          {i === 3 && <>{Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[Math.cos(j * 1.05) * 0.03, 0.03 + j * 0.01, Math.sin(j * 1.05) * 0.03]} rotation={[0.5, j, 0]} scale={[1, 0.3, 1.8]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color="#2f6b34" roughness={0.6} /></mesh>)}
            {Array.from({ length: 7 }, (_, j) => <mesh key={"p" + j} position={[Math.cos(j * 0.9) * 0.008, 0.095 + j * 0.002, Math.sin(j * 0.9) * 0.008]} rotation={[0.6, j * 0.9, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.014, 12, 8]} /><meshPhysicalMaterial color="#e86f92" sheen={1} roughness={0.5} /></mesh>)}</>}
          {i === 4 && <group position={[0, 0.04, 0]} rotation={[0, 0, 0.4]}>{[-1, 1].map((s) => <RBox key={s} s={[0.012, 0.07, 0.008]} p={[0, 0, s * 0.006]} r={0.003}>{M.wood({ base: [214, 180, 128], rx: 1, ry: 1 })}</RBox>)}<mesh position={[0, 0.008, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.008, 0.0015, 8, 16]} />{M.steel()}</mesh></group>}
        </group>}
      </group>; })}
    <mesh position={[-0.4 + 0.4 * path, 0.003, 0.11]} scale={[Math.max(0.001, path), 1, 1]}><boxGeometry args={[0.8, 0.002, 0.006]} />{M.glow({ col: AMB })}</mesh>
    <pointLight position={[lerp(-0.55, 0.55, sw), 0.18, 0.12]} intensity={1.4 * Math.sin(PI * cl(sw * 1.2))} distance={0.6} color="#ffcf8a" />
    <mesh position={[lerp(-0.55, 0.55, sw), 0.0025, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.6, 1, 1]}><circleGeometry args={[0.11, 40]} />{M.glow({ col: "#ffcf8a", op: 0.5 * Math.sin(PI * cl(sw * 1.2)) })}</mesh>
  </>;
}}</Scene3D>;

// ---- 23:35 · VEINTICUATRO TOMATERAS: la cerca del jardín y, una tras otra, brotan 24 plantas con su estaca mientras el contador sube ----
export const HRow24: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0.1, 0.12, 0], az: [-0.75, -0.5], el: [0.22, 0.3], r: [1.3, 1.1], fov: 32 }}
  over={(tt) => { const n = Math.min(24, Math.floor(Math.max(0, tt - 0.5) / 0.15));
    return <><Head tt={tt} kick="" title="HAROLD'S ROW · JULY 1972" col={GRN} />
      <div style={{ position: "absolute", right: 150, top: 160, fontFamily: SERIF, fontWeight: 700, fontSize: 170, color: "#ffd27a", textShadow: "0 10px 40px rgba(0,0,0,.8)" }}>{n}</div></>; }}>{(tt) => {
  return <>
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 0.4]} /><meshStandardMaterial color="#4e3420" roughness={1} /></mesh>
    {/* la cerca */}
    <RBox s={[1.55, 0.02, 0.015]} p={[0, 0.2, -0.14]} r={0.003}>{M.wood({ base: [160, 140, 115] })}</RBox>
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.025, 0.28, 0.025]} p={[-0.76 + i * 0.19, 0.14, -0.14]} r={0.004}>{M.wood({ base: [150, 130, 105] })}</RBox>)}
    {Array.from({ length: 24 }, (_, i) => { const k = phys(tt, 0.5 + i * 0.15, 8, 0.5), x = -0.72 + i * 0.0626;
      return <group key={i} position={[x, 0, 0]} scale={[1, Math.max(0.001, cl(k)), 1]}>
        <mesh position={[0.012, 0.12, 0]}><cylinderGeometry args={[0.003, 0.003, 0.24, 6]} />{M.wood({ base: [170, 130, 80] })}</mesh>
        {Array.from({ length: 4 }, (_, j) => <mesh key={j} position={[Math.cos(j * 2 + i) * 0.012, 0.04 + j * 0.04, Math.sin(j * 2 + i) * 0.012]}><icosahedronGeometry args={[0.022, 0]} /><meshStandardMaterial color={j === 0 ? "#b9b04a" : "#3c7a36"} flatShading roughness={0.8} /></mesh>)}
        <mesh position={[0.012, 0.1, 0.02]}><sphereGeometry args={[0.009, 10, 8]} /><meshPhysicalMaterial color="#d3392a" roughness={0.25} clearcoat={1} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 24:11 · LA PRUEBA DE LA HOJA: tres hojas grandes en atriles de madera contra la ventana; la lupa pasa por cada una y sólo la del esqueleto verde se adelanta y se ilumina ----
const leaf3 = (kind: number) => tex.text("leaf3_" + kind, 384, 384, (g) => {
  g.clearRect(0, 0, 384, 384); g.save(); g.beginPath(); g.moveTo(192, 14); g.bezierCurveTo(350, 100, 345, 285, 192, 372); g.bezierCurveTo(39, 285, 34, 100, 192, 14); g.closePath(); g.clip();
  g.fillStyle = kind === 1 ? "#e3d34a" : kind === 2 ? "#7ea24a" : "#e2c93c"; g.fillRect(0, 0, 384, 384);
  g.strokeStyle = kind === 0 ? "#2f7a35" : kind === 1 ? "#cbbf3a" : "#5f8a3a"; g.lineCap = "round";
  g.lineWidth = kind === 0 ? 16 : 6; g.beginPath(); g.moveTo(192, 20); g.lineTo(192, 368); g.stroke();
  for (let i = 0; i < 6; i++) { const y = 70 + i * 48; g.lineWidth = kind === 0 ? 10 : 4; g.beginPath(); g.moveTo(192, y); g.quadraticCurveTo(250, y - 8, 320 - i * 8, y - 40); g.stroke(); g.beginPath(); g.moveTo(192, y); g.quadraticCurveTo(134, y - 8, 64 + i * 8, y - 40); g.stroke(); }
  if (kind === 2) for (let i = 0; i < 9; i++) { const x = 90 + rn(i, 2) * 200, y = 80 + rn(i, 3) * 220; g.fillStyle = "#5a3a1c"; g.beginPath(); g.arc(x, y, 16, 0, 7); g.fill(); g.strokeStyle = "#c9a35a"; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 10, 0, 7); g.stroke(); g.beginPath(); g.arc(x, y, 5, 0, 7); g.stroke(); }
  g.restore();
});
export const HThreeLeaves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.22, 0], az: [0.25, -0.15], el: [0.14, 0.1], r: [1.3, 1.16], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="THE LEAF TEST" col={GRN} />}>{(tt, u) => {
  const lens = eio(u, 0.18, 0.72), lst = lens * 2, lx = -0.3 + 0.3 * (Math.floor(lst) + (lst >= 2 ? 0 : eio(lst % 1, 0.55, 1))), pick = eio(u, 0.76, 0.94), onBad = cl(1 - Math.abs(lx - 0.3) / 0.12) * (1 - pick);
  return <>
    <mesh position={[0, 0.3, -0.35]}><planeGeometry args={[3.2, 1.8]} />{M.glow({ col: "#fff1c8", op: 0.07 })}</mesh>
    {[0, 1, 2].map((i) => { const k = phys(tt, 0.3 + i * 0.35, 6, 0.5), good = i === 0, dim = good ? 1 : 1 - 0.5 * pick;
      return <group key={i} position={[-0.3 + i * 0.3, 0, good ? 0.05 * pick : 0]}>
        {/* atril de madera */}
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.008, 0.01, 0.12, 12]} />{M.wood({ base: [150, 104, 62], rx: 1, ry: 1 })}</mesh>
        <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.06, 0.07, 0.012, 32]} />{M.wood({ base: [150, 104, 62], rx: 1, ry: 1 })}</mesh>
        <group position={[0, 0.27 + (1 - cl(k)) * -0.6 + (good ? 0.03 * pick : 0), 0]} rotation={[0.15 * Math.sin(tt * 0.7 + i * 2), Math.sin(tt * 0.9 + i) * 0.35, 0]} scale={good ? 1 + 0.1 * pick : 1}>
          <mesh position={[0, 0, -0.46]}><sphereGeometry args={[0.46, 32, 32, PI / 2 - 0.35, 0.7, PI / 2 - 0.35, 0.7]} /><meshStandardMaterial map={leaf3(i)} bumpMap={leaf3(i)} bumpScale={4} transparent alphaTest={0.4} side={THREE.DoubleSide} roughness={0.55} color={new THREE.Color(dim, dim, dim)} emissiveMap={leaf3(i)} emissive="#ffffff" emissiveIntensity={0.35 * dim} /></mesh>
          {good && <mesh position={[0, 0, -0.01]}><circleGeometry args={[0.2, 40]} />{M.glow({ col: GRN, op: 0.3 * pick })}</mesh>}
        </group>
      </group>; })}
    {/* la lupa que recorre las tres */}
    <group position={[lx, 0.28 + 0.03 * Math.sin(lens * PI * 3), 0.14]} scale={cl(phys(tt, 1.3, 6, 0.5)) * (1 - pick * 0.999)}>
      <mesh><torusGeometry args={[0.09, 0.007, 12, 48]} />{M.brass()}</mesh>
      <mesh scale={[1, 1, 0.16]}><sphereGeometry args={[0.09, 40, 20]} /><meshPhysicalMaterial color="#eef6ff" roughness={0} clearcoat={1} transparent opacity={0.16} depthWrite={false} /></mesh>
      <mesh position={[0.12, -0.09, 0]} rotation={[0, 0, 0.8]}><cylinderGeometry args={[0.01, 0.012, 0.11, 12]} />{M.wood({ base: [90, 50, 26], rx: 1, ry: 1 })}</mesh>
      {/* la mancha ampliada dentro de la lente */}
      <group position={[0, 0, 0.012]} scale={Math.max(0.001, onBad)}>
        <mesh><circleGeometry args={[0.042, 32]} /><meshStandardMaterial color="#5a3a1c" roughness={0.7} /></mesh>
        {[0.028, 0.016].map((r, j) => <mesh key={j} position={[0, 0, 0.001]}><ringGeometry args={[r, r + 0.004, 32]} /><meshStandardMaterial color="#c9a35a" /></mesh>)}
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 25:02 · NOVENTA Y SEIS FRASCOS: los estantes del sótano se llenan de frascos de tomate de a uno, cuatro estantes de 24, y el contador llega a 96 ----
export const HQuarts96: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark"
  cam={{ at: [0, 0.3, 0], az: [0.3, -0.3], el: [0.08, 0.12], r: [1.2, 1.0], fov: 32 }}
  over={(tt) => { const n = Math.min(96, Math.floor(96 * eio(tt, 0.5, 4.8)));
    return <><Head tt={tt} kick="" title="ONE SUMMER · 96 QUARTS" col={RED} />
      <div style={{ position: "absolute", right: 120, bottom: 120, fontFamily: SERIF, fontWeight: 700, fontSize: 170, color: "#ffd27a", textShadow: "0 10px 40px rgba(0,0,0,.8)" }}>{n}</div></>; }}>{(tt) => {
  const filled = 96 * eio(tt, 0.5, 4.8);
  return <>
    {[0, 1, 2, 3].map((r) => <RBox key={r} s={[1.05, 0.015, 0.12]} p={[0, 0.0 + r * 0.16, 0]} r={0.003}>{M.wood({ base: [130, 95, 60] })}</RBox>)}
    {[-0.53, 0.53].map((x, i) => <RBox key={i} s={[0.02, 0.62, 0.12]} p={[x, 0.29, 0]} r={0.003}>{M.wood({ base: [120, 85, 55] })}</RBox>)}
    {Array.from({ length: 96 }, (_, i) => { const r = Math.floor(i / 24), c = i % 24, k = cl(filled - i);
      return k > 0 && <group key={i} position={[-0.495 + c * 0.043, 0.008 + r * 0.16 + (1 - k) * 0.06, 0]} scale={0.6 + 0.4 * k}>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.019, 0.019, 0.1, 16]} /><meshPhysicalMaterial color="#c4301f" roughness={0.15} clearcoat={1} emissive="#4a0a04" emissiveIntensity={0.25} /></mesh>
        <mesh position={[0, 0.104, 0]}><cylinderGeometry args={[0.017, 0.017, 0.01, 16]} />{M.brass({ col: "#c9a24a" })}</mesh>
      </group>; })}
    <pointLight position={[0, 0.7, 0.4]} color="#ffcf8a" intensity={1.2} distance={2} />
  </>;
}}</Scene3D>;

// ---- 25:19 · LA COLA NEGRA DEL TOMATE: el tomate gira y muestra su fondo negro hundido; al lado, la regadera riega parejo, la cáscara de huevo se desmigaja en la tierra y el tomate nuevo sale entero ----
export const HEndRot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0.04, 0.13, 0], az: [0.2, -0.1], el: [0.18, 0.24], r: [0.86, 0.76], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="BLOSSOM END ROT: CALCIUM + EVEN WATER" col={RED} />}>{(tt) => {
  const roll = eio(tt, 0.5, 1.8), pour = eio(tt, 2.0, 2.4) * (1 - eio(tt, 4.2, 4.6)), shell = eio(tt, 2.4, 3.6), grow = eio(tt, 3.4, 5.2);
  const Tom: React.FC<{ rot: number; bad: boolean }> = ({ rot, bad }) => <group rotation={[-rot * 1.9, 0.4, 0]}>
    <mesh scale={[1, 0.85, 1]}><sphereGeometry args={[0.065, 48, 32]} /><meshPhysicalMaterial color="#d23a24" roughness={0.18} clearcoat={1} /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.256) * 0.017, 0.056, Math.sin(i * 1.256) * 0.017]} rotation={[0, -i * 1.256, 0.6]} scale={[1, 0.2, 0.4]}><sphereGeometry args={[0.02, 10, 6]} /><meshStandardMaterial color="#3b7a2e" /></mesh>)}
    {bad && <mesh position={[0, -0.052, 0]} rotation={[PI / 2, 0, 0]} scale={[1, 1, 0.4]}><sphereGeometry args={[0.034, 32, 16, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#1d130c" roughness={0.95} /></mesh>}
  </group>;
  return <>
    <group position={[-0.17, 0.055, 0.02]}><Tom rot={roll} bad /></group>
    {/* maceta con tierra, la regadera y la cáscara de huevo */}
    <group position={[0.14, 0, 0]}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.1, 0.08, 0.08, 40]} /><meshStandardMaterial color="#b8643a" roughness={0.85} /></mesh>
      <mesh position={[0, 0.079, 0]}><cylinderGeometry args={[0.095, 0.095, 0.004, 40]} /><meshStandardMaterial color={new THREE.Color("#6a4a2e").lerp(new THREE.Color("#3e2716"), pour > 0 ? eio(tt, 2.2, 4.0) : 0)} roughness={1} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const f = shell; return <mesh key={i} position={[-0.04 + (rn(i, 2) - 0.5) * 0.04 * (1 + f), 0.085 + 0.04 * (1 - f) + rn(i, 3) * 0.004, (rn(i, 4) - 0.5) * 0.04 * (1 + f)]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, 0]}><boxGeometry args={[0.012 * (1 - 0.5 * f), 0.002, 0.01 * (1 - 0.5 * f)]} /><meshStandardMaterial color="#f3ecdf" roughness={0.6} /></mesh>; })}
      <mesh position={[0, 0.08, 0]} geometry={tubeG("erStem", [[0, 0, 0], [0.005, 0.08, 0], [-0.005, 0.16, 0]], 0.005)}><meshStandardMaterial color="#3d7a3a" /></mesh>
      <group position={[0.035, 0.2 - 0.02 * grow, 0.0]} scale={Math.max(0.001, 0.5 + 0.5 * grow)}><Tom rot={0.4} bad={false} /></group>
      <group position={[0.15, 0.22, 0]} rotation={[0, PI, 0.7 * pour]}>
        <RBox s={[0.09, 0.08, 0.06]} p={[0, 0, 0]} r={0.02}>{M.steel({ col: "#7da36a" })}</RBox>
        <mesh position={[0.07, 0.01, 0]} rotation={[0, 0, -1.1]}><cylinderGeometry args={[0.005, 0.009, 0.1, 10]} />{M.steel({ col: "#7da36a" })}</mesh>
      </group>
      {pour > 0.4 && Array.from({ length: 14 }, (_, i) => { const d = (tt * 2 + rn(i, 7)) % 1; return <mesh key={"w" + i} position={[0.0 + (rn(i, 8) - 0.5) * 0.06, 0.2 - d * 0.12, (rn(i, 9) - 0.5) * 0.05]}><sphereGeometry args={[0.003, 8, 6]} />{M.water({ op: 0.9 })}</mesh>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 27:09 · CON LOS ANTEOJOS Y UN CAFÉ: la pila de cartas junto a la taza humeante; los anteojos se apoyan y los sobres se abren de a uno, la carta sale y se despliega ----
export const HGlasses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [-0.03, 0.03, 0.07], az: [-0.3, 0.1], el: [0.65, 0.55], r: [0.56, 0.48], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="I READ EVERY ONE" col={AMB} />}>{(tt) => {
  const g = phys(tt, 0.3, 6, 0.5);
  const env = tex.text("envelope", 256, 160, (c) => { c.fillStyle = "#efe4cc"; c.fillRect(0, 0, 256, 160); c.strokeStyle = "#c9b48a"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(128, 90); c.lineTo(256, 0); c.stroke(); c.fillStyle = "#b8322a"; c.fillRect(206, 14, 34, 40); c.strokeStyle = "#5a4a3a"; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(70, 104 + i * 14); c.lineTo(170, 104 + i * 14); c.stroke(); } });
  const letter = tex.text("letterInk", 256, 320, (c) => { c.fillStyle = "#fbf7ee"; c.fillRect(0, 0, 256, 320); c.strokeStyle = "#2f4f8a"; c.lineWidth = 3; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(24, 30 + i * 23); for (let x = 24; x < 220 - (i % 3) * 30; x += 8) c.lineTo(x, 30 + i * 23 + Math.sin(x * 0.3 + i) * 3); c.stroke(); } });
  return <>
    <group position={[0.14, 0, -0.04]}>
      <mesh geometry={lathe([[0, 0], [0.035, 0], [0.042, 0.065], [0.045, 0.067], [0.041, 0.067], [0.033, 0.005], [0, 0.005]])}>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.058, 0]}><cylinderGeometry args={[0.04, 0.038, 0.002, 32]} /><meshPhysicalMaterial color="#3a1f0e" roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0.05, 0.035, 0]}><torusGeometry args={[0.016, 0.005, 10, 24, PI * 1.2]} />{M.porcelain()}</mesh>
      <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.07, 40]} />{M.porcelain()}</mesh>
      {Array.from({ length: 6 }, (_, i) => { const d = (tt * 0.5 + i / 6) % 1; return <mesh key={i} position={[Math.sin(d * 6 + i) * 0.01, 0.07 + d * 0.14, 0]}><sphereGeometry args={[0.01 + 0.015 * d, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.22 * (1 - d)} depthWrite={false} /></mesh>; })}
    </group>
    {/* tres sobres: cada uno se desliza adelante, abre la solapa y suelta la carta */}
    {[0, 1, 2].map((i) => { const a = 1.0 + i * 1.3, sl = eio(tt, a, a + 0.4), flap = eio(tt, a + 0.4, a + 0.7), out = eio(tt, a + 0.7, a + 1.2);
      return <group key={i} position={[-0.1 + sl * 0.06 * (i - 1), 0.003 + (2 - i) * 0.004 + sl * 0.01, -0.08 + sl * 0.12]} rotation={[-PI / 2, 0, 0.1 * (i - 1) - sl * 0.1 * (i - 1)]}>
        <mesh><planeGeometry args={[0.14, 0.088]} /><meshStandardMaterial map={env} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <group position={[0, 0.044, 0.001]} rotation={[flap * 2.6, 0, 0]}><mesh position={[0, -0.022, 0]} rotation={[0, 0, PI]}><circleGeometry args={[0.072, 3, -PI / 2]} /><meshStandardMaterial color="#e3d6ba" roughness={0.85} side={THREE.DoubleSide} /></mesh></group>
        {out > 0 && <mesh position={[0, 0.03 + out * 0.07, 0.003 + out * 0.004]} scale={[1, 0.6 + 0.4 * out, 1]}><planeGeometry args={[0.12, 0.15]} /><meshStandardMaterial map={letter} roughness={0.8} side={THREE.DoubleSide} /></mesh>}
      </group>; })}
    {/* anteojos de alambre que bajan y se apoyan */}
    <group position={[-0.17, 0.012 + (1 - cl(g)) * 0.2, 0.1]} rotation={[-PI / 2 + 0.1, 0, 0.3]}>
      {[-0.028, 0.028].map((x, i) => <React.Fragment key={i}>
        <mesh position={[x, 0, 0]}><torusGeometry args={[0.022, 0.0012, 8, 40]} />{M.chrome({ col: "#c9b07a" })}</mesh>
        <mesh position={[x, 0, 0]}><circleGeometry args={[0.021, 32]} />{M.glass({ op: 0.18 })}</mesh>
        <mesh position={[x * 1.85, -0.0, -0.04]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0011, 0.0011, 0.08, 6]} />{M.chrome({ col: "#c9b07a" })}</mesh>
      </React.Fragment>)}
      <mesh position={[0, 0.006, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.007, 0.0011, 6, 16, PI]} />{M.chrome({ col: "#c9b07a" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 27:27 · EL PRÓXIMO: UN LIMÓN: el limón cae al platito y se parte; de la mitad sale un abanico de quince objetos de la casa (la tabla, la esponja, el microondas, la canilla…), el cuarto crece y brilla ----
export const HNextLemon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.11, 0], az: [0.15, -0.1], el: [0.14, 0.12], r: [1.0, 0.9], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="NEXT TIME · 15 JOBS FOR ONE LEMON" col={AMB} />}>{(tt) => {
  const land = phys(tt, 0.3, 6, 0.45), split = eio(tt, 1.0, 1.5), four = eio(tt, 3.8, 4.4);
  const cut = tex.text("lemonCut", 256, 256, (g) => { g.fillStyle = "#f2d22e"; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.fillStyle = "#fbf3c8"; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.fill(); for (let i = 0; i < 10; i++) { g.fillStyle = "#f7dc4a"; g.beginPath(); g.moveTo(128, 128); g.arc(128, 128, 104, i * 0.628 + 0.05, (i + 1) * 0.628 - 0.05); g.fill(); } g.fillStyle = "#fbf3c8"; g.beginPath(); g.arc(128, 128, 14, 0, 7); g.fill(); });
  const Obj = (i: number) => { const c = ["#c98a5a", "#f2c14a", "#d8dde2", "#3a7bd5", "#e86f92", "#7da36a", "#ffffff", "#b8322a", "#9cbf8a", "#c9b2e6", "#f08a4a", "#5a8ac0", "#e9cf3c", "#a0a0a0", "#6f4a2e"][i];
    if (i === 0) return <RBox s={[0.06, 0.008, 0.04]} p={[0, 0, 0]} r={0.004}>{M.wood({ base: [196, 150, 96], rx: 1, ry: 1 })}</RBox>;
    if (i === 1) return <RBox s={[0.05, 0.025, 0.035]} p={[0, 0, 0]} r={0.006}><meshStandardMaterial color={c} roughness={0.95} /></RBox>;
    if (i === 3) return <group><RBox s={[0.07, 0.045, 0.045]} p={[0, 0, 0]} r={0.005}>{M.steel({ col: "#e8e8e8" })}</RBox><mesh position={[-0.008, 0, 0.0235]}><planeGeometry args={[0.045, 0.032]} /><meshStandardMaterial color="#1a1a1a" emissive="#ffd59a" emissiveIntensity={1.5 * four} /></mesh></group>;
    if (i % 4 === 2) return <mesh><torusGeometry args={[0.018, 0.006, 10, 24]} />{M.chrome({ col: c })}</mesh>;
    if (i % 4 === 0) return <mesh><cylinderGeometry args={[0.016, 0.016, 0.03, 20]} />{M.porcelain({ col: c })}</mesh>;
    if (i % 4 === 1) return <mesh scale={[1, 1.3, 1]}><sphereGeometry args={[0.017, 16, 12]} /><meshPhysicalMaterial color={c} roughness={0.3} clearcoat={1} /></mesh>;
    return <mesh rotation={[0.4, 0.5, 0]}><boxGeometry args={[0.03, 0.03, 0.03]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>; };
  return <>
    <mesh geometry={lathe([[0, 0], [0.07, 0], [0.11, 0.015], [0.115, 0.017], [0.07, 0.004], [0, 0.004]])} receiveShadow>{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    {[-1, 1].map((s) => <group key={s} position={[s * 0.035 * split, 0.045 + (1 - cl(land)) * 0.35, 0]} rotation={[0, 0, s * 0.5 * split]}>
      <mesh scale={[1.3, 1, 1]}><sphereGeometry args={[0.04, 40, 24, s > 0 ? 0 : PI, PI]} /><meshPhysicalMaterial color="#f2d22e" roughness={0.45} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh rotation={[0, s > 0 ? -PI / 2 : PI / 2, 0]} scale={[1, 1, 1]}><circleGeometry args={[0.04, 32]} /><meshStandardMaterial map={cut} roughness={0.35} /></mesh>
    </group>)}
    {Array.from({ length: 15 }, (_, i) => { const a = 0.2 + (i / 14) * (PI - 0.4), k = phys(tt, 1.5 + i * 0.12, 7, 0.45), r = 0.2 * cl(k), lit = i === 3 ? four : 0;
      return k > 0 && <group key={i} position={[Math.cos(a) * r * 1.7, 0.07 + Math.sin(a) * r * 0.7, -0.02]} rotation={[0.2, tt * 0.6 + i, 0]} scale={Math.max(0.001, cl(k)) * (1 + 0.8 * lit)}>{Obj(i)}</group>; })}
  </>;
}}</Scene3D>;
